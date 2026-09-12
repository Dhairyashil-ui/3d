"""
Incremental office refinement for the preceding Hinjawadi generator.

Preserves:
    Existing building transforms, footprints and heights.
    Road, sidewalk and road-marking geometry and materials.

Reference policy:
    No building-specific architectural claims without supplied profiles.
    Profiles are user-supplied observations, not automatically verified.
    Missing facade dimensions remain procedural approximations.

Blender 4.2+
"""

import argparse
import hashlib
import json
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector

modules = bpy.utils.user_resource("SCRIPTS", path="modules", create=True)
if modules not in sys.path:
    sys.path.insert(0, modules)

from shapely.geometry import Polygon, Point
from shapely.ops import unary_union


argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
parser = argparse.ArgumentParser()
parser.add_argument("--profiles", default="office_profiles.json")
parser.add_argument("--output", required=True)
args = parser.parse_args(argv)

profile_path = Path(args.profiles)
profiles = (
    json.loads(profile_path.read_text(encoding="utf8"))
    if profile_path.exists() else {}
)

scene = bpy.context.scene
report = []
PREFIX = "OFFICE_REFINE_"


# ---------------------------------------------------------------------------
# Protect roads and existing building transforms
# ---------------------------------------------------------------------------

def in_category(obj, suffix):
    return any(c.name.endswith("_" + suffix) for c in obj.users_collection)

protected = [
    obj for obj in scene.objects
    if any(in_category(obj, category) for category in (
        "Roads", "Sidewalks", "Road_Markings"
    ))
]

def object_signature(obj):
    h = hashlib.sha256()
    h.update(repr(tuple(v for row in obj.matrix_world for v in row)).encode())
    if obj.type == "MESH":
        for vertex in obj.data.vertices:
            h.update(repr(tuple(vertex.co)).encode())
        for face in obj.data.polygons:
            h.update(repr(tuple(face.vertices)).encode())
            h.update(str(face.material_index).encode())
        for mat in obj.data.materials:
            h.update((mat.name if mat else "").encode())
            if mat:
                h.update(repr(tuple(mat.diffuse_color)).encode())
    return h.hexdigest()

protected_before = {
    obj.name: object_signature(obj) for obj in protected
}

buildings = [
    obj for obj in scene.objects
    if obj.type == "MESH"
    and in_category(obj, "Buildings")
    and obj.get("style") == "office"
]

if not buildings:
    raise RuntimeError("No office-style building objects from the generator found.")

building_transforms = {
    obj.name: obj.matrix_world.copy() for obj in buildings
}

# Remove only this script's previous detail pass.
old_collection = bpy.data.collections.get(PREFIX + "Details")
if old_collection:
    for obj in list(old_collection.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(old_collection)

details = bpy.data.collections.new(PREFIX + "Details")
scene.collection.children.link(details)


# ---------------------------------------------------------------------------
# Materials: new datablocks only, never edit shared original materials
# ---------------------------------------------------------------------------

def make_material(name, color, roughness=0.6, metallic=0.0, texture=False):
    mat = bpy.data.materials.new(PREFIX + name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True

    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic

    if texture:
        texcoord = nodes.new("ShaderNodeTexCoord")
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 7.0
        noise.inputs["Detail"].default_value = 3.0

        ramp = nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].color = (
            *(max(0, c * 0.83) for c in color), 1
        )
        ramp.color_ramp.elements[1].color = (
            *(min(1, c * 1.08) for c in color), 1
        )

        bump = nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = 0.16
        bump.inputs["Distance"].default_value = 0.015

        links.new(texcoord.outputs["Object"], noise.inputs["Vector"])
        links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
        links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
        links.new(noise.outputs["Fac"], bump.inputs["Height"])
        links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

    return mat


# ---------------------------------------------------------------------------
# Geometry helpers
# ---------------------------------------------------------------------------

def top_footprint(obj):
    """Recover footprint from horizontal top triangles of original massing."""
    top = float(obj["height_m"])
    pieces = []

    for face in obj.data.polygons:
        points = [
            obj.matrix_world @ obj.data.vertices[i].co
            for i in face.vertices
        ]
        if len(points) >= 3 and all(abs(p.z - top) < 0.03 for p in points):
            poly = Polygon([(p.x, p.y) for p in points])
            if poly.is_valid and poly.area > 0:
                pieces.append(poly)

    return unary_union(pieces) if pieces else None


def poly_parts(geom):
    if geom.geom_type == "Polygon":
        yield geom
    elif hasattr(geom, "geoms"):
        for part in geom.geoms:
            yield from poly_parts(part)


def append_box(vertices, faces, indices, center, dimensions, yaw, mat_index):
    """Closed box, optionally rotated around its vertical axis."""
    cx, cy, cz = center
    sx, sy, sz = (d / 2 for d in dimensions)
    c, s = math.cos(yaw), math.sin(yaw)
    start = len(vertices)

    for x, y, z in [
        (-sx,-sy,-sz), (sx,-sy,-sz), (sx,sy,-sz), (-sx,sy,-sz),
        (-sx,-sy,sz), (sx,-sy,sz), (sx,sy,sz), (-sx,sy,sz),
    ]:
        vertices.append((cx + c*x - s*y, cy + s*x + c*y, cz + z))

    for face in [
        (0,3,2,1), (4,5,6,7), (0,1,5,4),
        (1,2,6,5), (2,3,7,6), (3,0,4,7),
    ]:
        faces.append(tuple(start + i for i in face))
        indices.append(mat_index)


def create_detail_mesh(name, vertices, faces, indices, materials, metadata):
    if not faces:
        return

    # Useful local pivot without changing the original building.
    ox = sum(v[0] for v in vertices) / len(vertices)
    oy = sum(v[1] for v in vertices) / len(vertices)

    mesh = bpy.data.meshes.new(name + "_Mesh")
    mesh.from_pydata(
        [(x-ox, y-oy, z) for x, y, z in vertices], [], faces
    )
    for mat in materials:
        mesh.materials.append(mat)
    for face, index in zip(mesh.polygons, indices):
        face.material_index = index
    mesh.update()

    obj = bpy.data.objects.new(name, mesh)
    obj.location = (ox, oy, 0)
    details.objects.link(obj)

    for key, value in metadata.items():
        obj[key] = json.dumps(value) if isinstance(value, (list, dict)) else value


DIRECTIONS = {
    "north": Vector((0, 1)),
    "south": Vector((0, -1)),
    "east": Vector((1, 0)),
    "west": Vector((-1, 0)),
}


# ---------------------------------------------------------------------------
# Refine office candidates
# ---------------------------------------------------------------------------

office_footprints = []

for building in buildings:
    footprint = top_footprint(building)
    if footprint is None or footprint.is_empty:
        continue

    office_footprints.append(footprint)
    source_id = building.get("osm_id", building.name)

    seed = int(hashlib.sha256(source_id.encode()).hexdigest()[:16], 16)
    rng = random.Random(seed)
    profile = profiles.get(source_id, {})
    sources = profile.get("sources", [])

    reference_status = (
        "User-supplied reference profile; not independently verified"
        if sources else
        "Procedural appearance; not actual building-specific architecture"
    )

    cladding_color = profile.get("cladding_rgb", rng.choice([
        [0.68, 0.69, 0.65],
        [0.52, 0.56, 0.57],
        [0.73, 0.68, 0.57],
        [0.58, 0.61, 0.63],
    ]))
    glass_color = profile.get("glass_rgb", rng.choice([
        [0.055, 0.14, 0.18],
        [0.08, 0.15, 0.16],
        [0.10, 0.16, 0.22],
        [0.12, 0.17, 0.18],
    ]))

    cladding = make_material(
        source_id + "_Cladding", cladding_color, 0.72, texture=True
    )
    glass = make_material(source_id + "_Glass", glass_color, 0.17, 0.25)
    frame = make_material(
        source_id + "_Frames", (0.17, 0.19, 0.20), 0.36, 0.7
    )
    equipment = make_material(
        source_id + "_Equipment", (0.44, 0.46, 0.44), 0.65, 0.35,
        texture=True
    )

    # Copy mesh before changing its slots, avoiding shared-datablock edits.
    building.data = building.data.copy()
    if building.data.materials:
        building.data.materials[0] = cladding
    else:
        building.data.materials.append(cladding)

    # Keep the original facade editable but invisible beneath this pass.
    original_glazing = bpy.data.objects.get(building.name + "_Glazing")
    if original_glazing:
        original_glazing.hide_render = True
        original_glazing.hide_set(True)

    z0 = float(building.get("min_height_m", 0))
    z1 = float(building["height_m"])
    storey = float(building.get("storey_height_m", 3.6))
    floors = max(1, round((z1-z0) / storey))
    storey = (z1-z0) / floors

    bay_width = max(1.8, min(6.0, float(
        profile.get("bay_width_m", rng.uniform(2.5, 3.8))
    )))
    window_fraction = max(0.3, min(0.9, float(
        profile.get("window_fraction", rng.uniform(0.62, 0.84))
    )))
    bands = profile.get("horizontal_bands", rng.choice([True, False]))

    vertices, faces, indices = [], [], []
    edges = []

    def box(center, dimensions, yaw=0, mat=0):
        append_box(
            vertices, faces, indices, center, dimensions, yaw, mat
        )

    from shapely.geometry.polygon import orient

    for poly in poly_parts(footprint):
        poly = orient(poly, sign=1.0)
        for ring_index, ring in enumerate([poly.exterior, *poly.interiors]):
            points = list(ring.coords)
            for a, b in zip(points, points[1:]):
                length = math.dist(a, b)
                if length < 1.0:
                    continue

                ux, uy = (b[0]-a[0])/length, (b[1]-a[1])/length
                nx, ny = uy, -ux
                yaw = math.atan2(uy, ux)
                edges.append((a, length, ux, uy, nx, ny, yaw, ring_index))

                count = max(1, int(length / bay_width))
                cell = length / count
                width = cell * window_fraction

                for floor in range(floors):
                    low = z0 + floor*storey + storey*0.23
                    high = z0 + floor*storey + storey*0.84
                    height = high-low
                    middle_z = (low+high)/2

                    for j in range(count):
                        along = (j+0.5)*cell
                        x, y = a[0]+ux*along, a[1]+uy*along

                        # Opaque reflective glazing with dimensional frame.
                        # No unsupported claim of modeled interior spaces.
                        box(
                            (x+nx*0.045, y+ny*0.045, middle_z),
                            (width, 0.05, height), yaw, 1
                        )

                        for side in (-1, 1):
                            off = side*width/2
                            box(
                                (x+ux*off+nx*0.09,
                                 y+uy*off+ny*0.09, middle_z),
                                (0.065, 0.12, height+0.08), yaw, 2
                            )

                        for zz in (low, high):
                            box(
                                (x+nx*0.09, y+ny*0.09, zz),
                                (width+0.08, 0.12, 0.065), yaw, 2
                            )

                    if bands:
                        box(
                            (a[0]+ux*length/2+nx*0.08,
                             a[1]+uy*length/2+ny*0.08,
                             z0+floor*storey+0.12),
                            (length, 0.18, 0.22), yaw, 0
                        )

    def facing_edge(direction):
        target = DIRECTIONS.get(direction)
        candidates = [
            edge for edge in edges
            if edge[7] == 0 and edge[1] >= 5.0
        ]
        if target is None or not candidates:
            return None
        return max(
            candidates,
            key=lambda edge:
                Vector((edge[4], edge[5])).dot(target)
                + min(edge[1], 100)*0.0001
        )

    # Reference-directed entrances are visual inserts, not cut openings.
    entrance = facing_edge(profile.get("entrance_direction"))
    if entrance and z0 < 0.1:
        a, length, ux, uy, nx, ny, yaw, _ = entrance
        width = min(4.5, length*0.6)
        x, y = a[0]+ux*length/2, a[1]+uy*length/2

        box(
            (x+nx*0.12, y+ny*0.12, 1.5),
            (width, 0.14, 3.0), yaw, 1
        )
        box(
            (x+nx*0.22, y+ny*0.22, 1.5),
            (0.08, 0.12, 3.0), yaw, 2
        )

        # Compact canopy remains above ground; no road/sidewalk edits.
        box(
            (x+nx*0.65, y+ny*0.65, 3.2),
            (width+0.6, 1.3, 0.15), yaw, 2
        )

    # Balconies are not invented for offices without a supporting profile.
    balcony_edge = facing_edge(profile.get("balcony_direction"))
    if balcony_edge:
        a, length, ux, uy, nx, ny, yaw, _ = balcony_edge
        width = min(5.0, length*0.5)
        depth = max(0.6, min(2.5, float(
            profile.get("balcony_projection_m", 1.2)
        )))
        x, y = a[0]+ux*length/2, a[1]+uy*length/2

        for floor in profile.get("balcony_floors", []):
            if not isinstance(floor, int) or not 1 <= floor < floors:
                continue
            zz = z0+floor*storey
            box(
                (x+nx*depth/2, y+ny*depth/2, zz),
                (width, depth, 0.16), yaw, 0
            )
            box(
                (x+nx*depth, y+ny*depth, zz+0.65),
                (width, 0.06, 1.1), yaw, 1
            )
            for side in (-1, 1):
                box(
                    (x+ux*side*width/2+nx*depth/2,
                     y+uy*side*width/2+ny*depth/2, zz+0.65),
                    (0.06, depth, 1.1), yaw, 1
                )

    # Rooftop equipment is intentionally placed above the existing roof,
    # while the original building shell and its recorded height remain unchanged.
    # Its extra height is recorded in the refinement metadata.
    if profile.get("rooftop_equipment", False):
        safe_roof = footprint.buffer(-3.5)
        if not safe_roof.is_empty:
            p = safe_roof.representative_point()
            equipment_height = min(1.3, storey*0.4)

            # Existing generator roofs are at z1: equipment is placed above
            # that roof, so report its additional non-massing height explicitly.
            for dx in (-1.2, 1.2):
                equipment_plan = Polygon([
                    (p.x+dx-0.8, p.y-0.5),
                    (p.x+dx+0.8, p.y-0.5),
                    (p.x+dx+0.8, p.y+0.5),
                    (p.x+dx-0.8, p.y+0.5),
                ])
                if safe_roof.covers(equipment_plan):
                    box(
                        (p.x+dx, p.y, z1+equipment_height/2),
                        (1.6, 1.0, equipment_height), 0, 3
                    )

    metadata = {
        "osm_id": source_id,
        "reference_status": reference_status,
        "reference_sources": sources,
        "reference_notes": profile.get("reference_notes", ""),
        "dimension_status":
            "Facade/equipment dimensions approximate unless separately measured",
        "location_status": "Original geographic transform preserved",
        "massing_status": "Original building footprint and shell height preserved",
        "equipment_status":
            "Optional rooftop details can extend above original shell height",
        "entrance_status":
            "Visual entrance insert; no navigable doorway or interior",
    }

    create_detail_mesh(
        PREFIX + building.name,
        vertices, faces, indices,
        [cladding, glass, frame, equipment],
        metadata,
    )
    report.append({"building": building.name, **metadata})


# ---------------------------------------------------------------------------
# Existing nearby parking and vegetation: material refinement only
# ---------------------------------------------------------------------------

office_union = unary_union(office_footprints)
near_offices = office_union.buffer(100)

parking_mat = make_material(
    "Parking_Weathered_Asphalt",
    (0.12, 0.125, 0.13), 0.94, texture=True
)
leaf_materials = [
    make_material(
        f"Leaves_{i}", color, 0.78, texture=True
    )
    for i, color in enumerate([
        (0.10, 0.23, 0.055),
        (0.15, 0.28, 0.075),
        (0.12, 0.25, 0.09),
        (0.19, 0.29, 0.08),
    ])
]

for obj in list(scene.objects):
    if obj.type != "MESH":
        continue
    if not near_offices.covers(Point(obj.location.x, obj.location.y)):
        continue

    if (
        in_category(obj, "Parking")
        and obj.name.startswith("Parking_")
        and not obj.name.startswith("Parking_Bays")
    ):
        obj.data = obj.data.copy()
        if obj.data.materials:
            obj.data.materials[0] = parking_mat

    elif in_category(obj, "Vegetation") and len(obj.material_slots) >= 2:
        seed = int(hashlib.sha256(obj.name.encode()).hexdigest()[:8], 16)
        # Object-linked material keeps the shared tree mesh intact.
        obj.material_slots[1].link = "OBJECT"
        obj.material_slots[1].material = leaf_materials[seed % len(leaf_materials)]


# ---------------------------------------------------------------------------
# Integrity checks and save
# ---------------------------------------------------------------------------

for obj in protected:
    if object_signature(obj) != protected_before[obj.name]:
        raise RuntimeError(
            f"Protected road-related object changed: {obj.name}. Not saving."
        )

for obj in buildings:
    if obj.matrix_world != building_transforms[obj.name]:
        raise RuntimeError(
            f"Building transform changed: {obj.name}. Not saving."
        )

output = Path(args.output).resolve()
output.parent.mkdir(parents=True, exist_ok=True)

output.with_suffix(".refinement.json").write_text(
    json.dumps({
        "road_integrity_check": "Passed",
        "building_transform_check": "Passed",
        "office_candidates_refined": len(report),
        "selection_note":
            "Uses office-style candidates from original generator; "
            "some building uses may themselves be procedural classifications",
        "limitations": [
            "Public references are not downloaded or automatically verified.",
            "No terrain, road, sidewalk or intersection reconstruction.",
            "Parking layouts and tree locations remain unchanged.",
            "Balconies and entrance locations require supplied profiles.",
            "Facade glazing is reflective surface geometry, not an interior.",
            "Procedural Blender material textures require baking or UE recreation.",
            "Review projections for clearance before export.",
        ],
        "buildings": report,
    }, indent=2),
    encoding="utf8",
)

bpy.ops.wm.save_as_mainfile(filepath=str(output))
print(f"Saved: {output}")
print("Road integrity check passed.")
print(f"Refined office candidates: {len(report)}")
