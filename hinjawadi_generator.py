"""
Hinjawadi Phase 1: editable OSM-based Blender environment.

Blender 4.2+
Dependency: Shapely >= 2.1, < 3

Geometry provenance:
  - OSM-derived does NOT mean surveyed.
  - Road edges are buffered from mapped centerlines.
  - Unknown heights and all generated facades are approximations.
  - Flat terrain; bridge/layer elevations are schematic.
  - Default extent is a working bbox, not an official phase boundary.

Coordinates:
  Blender X = east, Y = north, Z = up; metres.
  WGS84 coordinates are projected into a local horizontal ENU frame.
"""

import argparse
import csv
import hashlib
import json
import math
import random
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

import bpy
from mathutils import Vector


# ---------------------------------------------------------------------------
# Arguments and dependency
# ---------------------------------------------------------------------------

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
parser = argparse.ArgumentParser()
parser.add_argument("--out", default="./hinjawadi_output")
parser.add_argument(
    "--bbox", nargs=4, type=float,
    default=[18.578, 73.721, 18.604, 73.755],
    metavar=("SOUTH", "WEST", "NORTH", "EAST"),
)
parser.add_argument("--tile-size", type=float, default=512.0)
parser.add_argument("--seed", type=int, default=41)
parser.add_argument("--install-deps", action="store_true")
parser.add_argument("--export-fbx", action="store_true")
parser.add_argument("--refresh", action="store_true")
parser.add_argument("--max-procedural-trees", type=int, default=2400)
args = parser.parse_args(argv)

OUT = Path(args.out).resolve()
OUT.mkdir(parents=True, exist_ok=True)

S, W, N, E = args.bbox
if not (-90 < S < N < 90 and -180 < W < E < 180):
    raise ValueError("Invalid bbox.")
if args.tile_size <= 0:
    raise ValueError("tile-size must be positive.")

modules_dir = bpy.utils.user_resource(
    "SCRIPTS", path="modules", create=True
)
if modules_dir not in sys.path:
    sys.path.insert(0, modules_dir)

try:
    from shapely import constrained_delaunay_triangles, make_valid
except ImportError:
    if not args.install_deps:
        raise RuntimeError(
            "Shapely 2.1+ is required. Run again with --install-deps."
        )
    subprocess.check_call([sys.executable, "-m", "ensurepip"])
    subprocess.check_call([
        sys.executable, "-m", "pip", "install",
        "--upgrade", "--only-binary=:all:",
        "--target", modules_dir, "shapely>=2.1,<3",
    ])
    import importlib
    importlib.invalidate_caches()
    from shapely import constrained_delaunay_triangles, make_valid

from shapely.geometry import Point, LineString, Polygon, box
from shapely.geometry.polygon import orient
from shapely.ops import unary_union, polygonize
from shapely.prepared import prep


# ---------------------------------------------------------------------------
# Coordinate system: WGS84 ECEF -> local ENU
# ---------------------------------------------------------------------------

LAT0 = (S + N) / 2
LON0 = (W + E) / 2

def ecef(lat, lon):
    lat, lon = math.radians(lat), math.radians(lon)
    a = 6378137.0
    e2 = 6.69437999014e-3
    rn = a / math.sqrt(1 - e2 * math.sin(lat) ** 2)
    return (
        rn * math.cos(lat) * math.cos(lon),
        rn * math.cos(lat) * math.sin(lon),
        rn * (1 - e2) * math.sin(lat),
    )

ORIGIN_ECEF = ecef(LAT0, LON0)
PHI, LAM = math.radians(LAT0), math.radians(LON0)

def xy(lat, lon):
    p = ecef(lat, lon)
    dx, dy, dz = [p[i] - ORIGIN_ECEF[i] for i in range(3)]
    east = -math.sin(LAM) * dx + math.cos(LAM) * dy
    north = (
        -math.sin(PHI) * math.cos(LAM) * dx
        -math.sin(PHI) * math.sin(LAM) * dy
        +math.cos(PHI) * dz
    )
    return east, north

CLIP = Polygon([
    xy(S, W), xy(S, E), xy(N, E), xy(N, W)
])
EMPTY = Polygon()

def union_all(items):
    items = [g for g in items if g is not None and not g.is_empty]
    return unary_union(items) if items else EMPTY

def polygons(g):
    if g is None or g.is_empty:
        return
    if g.geom_type == "Polygon":
        yield orient(g, sign=1.0)
    elif hasattr(g, "geoms"):
        for sub in g.geoms:
            yield from polygons(sub)

def lines(g):
    if g is None or g.is_empty:
        return
    if g.geom_type == "LineString":
        yield g
    elif hasattr(g, "geoms"):
        for sub in g.geoms:
            yield from lines(sub)

def stable_rng(key):
    digest = hashlib.sha256(
        f"{args.seed}:{key}".encode()
    ).digest()
    return random.Random(int.from_bytes(digest[:8], "big"))


# ---------------------------------------------------------------------------
# Download and cache OSM
# ---------------------------------------------------------------------------

bbox_text = ",".join(str(v) for v in args.bbox)
query = f"""
[out:json][timeout:180];
(
  nwr["building"]({bbox_text});
  nwr["building:part"]({bbox_text});
  way["highway"]({bbox_text});
  nwr["landuse"]({bbox_text});
  nwr["leisure"~"^(park|garden)$"]({bbox_text});
  nwr["natural"~"^(wood|scrub|grassland|tree|water)$"]({bbox_text});
  nwr["amenity"~"^(parking|school|college|university|hospital|place_of_worship|fuel|bus_station)$"]({bbox_text});
  nwr["office"]({bbox_text});
  nwr["public_transport"]({bbox_text});
  nwr["man_made"~"^(street_cabinet|water_tower)$"]({bbox_text});
  node["highway"~"^(street_lamp|traffic_signals|bus_stop|crossing)$"]({bbox_text});
  node["power"~"^(pole|tower|substation)$"]({bbox_text});
);
out body;
>;
out skel qt;
"""
query_hash = hashlib.sha256(query.encode()).hexdigest()[:16]
cache = OUT / f"osm_{query_hash}.json"

if cache.exists() and not args.refresh:
    osm = json.loads(cache.read_text(encoding="utf8"))
else:
    endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
    ]
    errors = []
    for endpoint in endpoints:
        try:
            request = urllib.request.Request(
                endpoint,
                data=urllib.parse.urlencode({"data": query}).encode(),
                headers={
                    "User-Agent":
                        "HinjawadiEditableBlenderGenerator/1.0",
                },
            )
            with urllib.request.urlopen(request, timeout=240) as response:
                osm = json.load(response)
            if osm.get("remark"):
                raise RuntimeError(osm["remark"])
            if not osm.get("elements"):
                raise RuntimeError("Overpass returned no elements.")
            cache.write_text(json.dumps(osm), encoding="utf8")
            break
        except Exception as exc:
            errors.append(f"{endpoint}: {exc}")
            time.sleep(3)
    else:
        raise RuntimeError(
            "OSM download failed; no fictional map fallback is used.\n"
            + "\n".join(errors)
        )

(OUT / "overpass_query.txt").write_text(query, encoding="utf8")

# Overpass may return the same element both with tags and as a skeleton.
# Merge rather than allowing a later skeleton to erase existing tags.
elements = {}
for element in osm["elements"]:
    key = (element["type"], element["id"])
    previous = elements.get(key, {})
    merged = {**previous, **element}
    merged["tags"] = {
        **previous.get("tags", {}),
        **element.get("tags", {}),
    }
    elements[key] = merged

nodes = {
    eid: el for (kind, eid), el in elements.items() if kind == "node"
}
ways = {
    eid: el for (kind, eid), el in elements.items() if kind == "way"
}
relations = {
    eid: el for (kind, eid), el in elements.items() if kind == "relation"
}

node_xy = {
    nid: xy(n["lat"], n["lon"])
    for nid, n in nodes.items()
    if "lat" in n and "lon" in n
}

warnings = []
object_records = []
instance_records = []
tile_collections = {}
tile_objects = defaultdict(list)

def osm_id(element):
    return f'{element["type"]}/{element["id"]}'

def way_line(way):
    refs = way.get("nodes", [])
    if len(refs) < 2 or any(n not in node_xy for n in refs):
        warnings.append(f"Incomplete way omitted: {osm_id(way)}")
        return None
    coords = [node_xy[n] for n in refs]
    if len(set(coords)) < 2:
        return None
    return LineString(coords)

def source_meta(element, **extra):
    return {
        "osm_id": osm_id(element),
        "osm_tags": element.get("tags", {}),
        "source": "OpenStreetMap; not independently surveyed",
        **extra,
    }


# ---------------------------------------------------------------------------
# Polygon features, including multipolygon courtyards
# ---------------------------------------------------------------------------

AREA_KEYS = {
    "building", "building:part", "landuse", "leisure",
    "natural", "amenity", "office", "public_transport",
}

areas = []
consumed_ways = set()

for rel in relations.values():
    tags = rel.get("tags", {})
    if tags.get("type") != "multipolygon":
        continue
    if not AREA_KEYS.intersection(tags):
        continue

    outer_lines, inner_lines = [], []
    member_ids = []
    for member in rel.get("members", []):
        if member.get("type") != "way":
            continue
        way = ways.get(member["ref"])
        if way is None:
            continue
        line = way_line(way)
        if line is None:
            continue
        role = member.get("role", "")
        if role not in ("", "outer", "inner"):
            continue
        (inner_lines if role == "inner" else outer_lines).append(line)
        member_ids.append(member["ref"])

    outer = union_all(list(polygonize(union_all(outer_lines))))
    inner = union_all(list(polygonize(union_all(inner_lines))))
    geom = make_valid(outer.difference(inner)).intersection(CLIP)
    if not geom.is_empty:
        areas.append((rel, geom))
        consumed_ways.update(member_ids)
    else:
        warnings.append(f"Unresolved multipolygon: {osm_id(rel)}")

for way in ways.values():
    if way["id"] in consumed_ways:
        continue
    tags = way.get("tags", {})
    if not AREA_KEYS.intersection(tags):
        continue
    refs = way.get("nodes", [])
    if len(refs) < 4 or refs[0] != refs[-1]:
        continue
    line = way_line(way)
    if line is None:
        continue
    geom = make_valid(Polygon(line.coords)).intersection(CLIP)
    if not geom.is_empty:
        areas.append((way, geom))

building_features = [
    (el, geom) for el, geom in areas
    if (
        el.get("tags", {}).get("building", "no") != "no"
        or el.get("tags", {}).get("building:part", "no") != "no"
    )
]

roads = []
for way in ways.values():
    tags = way.get("tags", {})
    if "highway" not in tags or tags.get("area") == "yes":
        continue
    line = way_line(way)
    if line is not None:
        for segment in lines(line.intersection(CLIP)):
            if segment.length > 0.5:
                roads.append((way, segment))

if not roads:
    raise RuntimeError("No usable road centerlines found. Check the extent/data.")
if not building_features:
    raise RuntimeError("No building footprints found. Check the extent/data.")


# ---------------------------------------------------------------------------
# Scene and materials
# ---------------------------------------------------------------------------

# This script intentionally starts a new scene.
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 1.0
scene["geographic_origin_latitude"] = LAT0
scene["geographic_origin_longitude"] = LON0
scene["coordinate_frame"] = "Local ENU metres: X east, Y north, Z up"
scene["extent_status"] = "Working bbox; not official Phase 1 boundary"
scene["attribution"] = "© OpenStreetMap contributors — ODbL"
scene["terrain_status"] = "Flat approximation; no elevation source"

root = bpy.data.collections.new("Hinjawadi_OSM_Approximation")
scene.collection.children.link(root)
reference = bpy.data.collections.new("References_Not_For_Export")
scene.collection.children.link(reference)

def material(name, color, roughness=0.7, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat

M = {
    "ground": material("Soil_Dry_Brown", (0.25, 0.20, 0.14)),
    "grass": material("Grass_Dry_Green", (0.23, 0.31, 0.11)),
    "water": material("Water_Approximate", (0.08, 0.17, 0.19), 0.2),
    "asphalt": material("Asphalt", (0.065, 0.07, 0.075), 0.92),
    "paving": material("Concrete_Paving", (0.48, 0.46, 0.42)),
    "parking": material("Parking_Asphalt", (0.14, 0.145, 0.15)),
    "white": material("Road_Marking_OffWhite", (0.85, 0.84, 0.73)),
    "roof": material("Weathered_Concrete_Roof", (0.40, 0.39, 0.36)),
    "glass": material("Approximate_Blue_Glazing", (0.075, 0.18, 0.23), 0.22, 0.25),
    "metal": material("Galvanized_Metal", (0.36, 0.39, 0.40), 0.4, 0.65),
    "black": material("Black_Plastic_Water_Tank", (0.025, 0.027, 0.025)),
    "bark": material("Tree_Bark", (0.19, 0.12, 0.065)),
    "leaves": material("Tree_Leaves", (0.10, 0.25, 0.065)),
}
facade_materials = [
    material("Stucco_Warm_White", (0.75, 0.72, 0.63)),
    material("Stucco_Sand", (0.67, 0.56, 0.40)),
    material("Stucco_Pale_Peach", (0.76, 0.60, 0.48)),
    material("Office_OffWhite_Cladding", (0.66, 0.69, 0.67)),
    material("Office_Grey_Cladding", (0.42, 0.46, 0.47)),
]

def tile_key(x, y):
    return (
        math.floor(x / args.tile_size),
        math.floor(y / args.tile_size),
    )

def get_collection(x, y, category):
    key = tile_key(x, y)
    if key not in tile_collections:
        col = bpy.data.collections.new(f"Tile_{key[0]:+04d}_{key[1]:+04d}")
        root.children.link(col)
        tile_collections[key] = {"root": col}
    cats = tile_collections[key]
    if category not in cats:
        col = bpy.data.collections.new(
            f"{cats['root'].name}_{category}"
        )
        cats["root"].children.link(col)
        cats[category] = col
    return key, cats[category]

def register_object(obj, category, meta):
    key, col = get_collection(obj.location.x, obj.location.y, category)
    col.objects.link(obj)
    tile_objects[key].append(obj)
    for k, value in meta.items():
        obj[k] = (
            json.dumps(value, ensure_ascii=False)
            if isinstance(value, (dict, list)) else value
        )
    object_records.append({
        "object": obj.name,
        "category": category,
        "tile": list(key),
        **meta,
    })
    return obj

def mesh_object(name, verts, faces, mats, face_mats=None,
                category="Details", meta=None):
    if not verts or not faces:
        return None
    # Keep geometry local to each object for editability and useful pivots.
    ox = (min(v[0] for v in verts) + max(v[0] for v in verts)) / 2
    oy = (min(v[1] for v in verts) + max(v[1] for v in verts)) / 2
    local = [(x - ox, y - oy, z) for x, y, z in verts]
    mesh = bpy.data.meshes.new(name + "_Mesh")
    mesh.from_pydata(local, [], faces)
    mesh.materials.clear()
    for mat in mats:
        mesh.materials.append(mat)
    mesh.update()
    if face_mats:
        for face, idx in zip(mesh.polygons, face_mats):
            face.material_index = idx
    obj = bpy.data.objects.new(name, mesh)
    obj.location = (ox, oy, 0)
    return register_object(obj, category, meta or {})

def extrusion(name, geom, z0, z1, wall_mat, roof_mat=None,
              category="Buildings", meta=None):
    verts, faces, mids = [], [], []

    def face(coords, mat_idx):
        start = len(verts)
        verts.extend(coords)
        faces.append(tuple(range(start, len(verts))))
        mids.append(mat_idx)

    for poly in polygons(make_valid(geom)):
        if poly.area < 0.02:
            continue
        triangles = constrained_delaunay_triangles(poly)
        for tri in triangles.geoms:
            pts = list(orient(tri, sign=1.0).exterior.coords)[:3]
            face([(x, y, z1) for x, y in pts], 1 if roof_mat else 0)
            if z1 > z0:
                face([(x, y, z0) for x, y in reversed(pts)], 0)

        if z1 > z0:
            for ring in [poly.exterior, *poly.interiors]:
                pts = list(ring.coords)
                for a, b in zip(pts, pts[1:]):
                    face([
                        (*a, z0), (*b, z0),
                        (*b, z1), (*a, z1),
                    ], 0)

    mats = [wall_mat] + ([roof_mat] if roof_mat else [])
    return mesh_object(
        name, verts, faces, mats, mids, category, meta
    )

def tiled_surface(name, geom, z0, z1, mat, category, meta):
    if geom.is_empty:
        return
    xmin, ymin, xmax, ymax = geom.bounds
    for ix in range(math.floor(xmin / args.tile_size),
                    math.floor(xmax / args.tile_size) + 1):
        for iy in range(math.floor(ymin / args.tile_size),
                        math.floor(ymax / args.tile_size) + 1):
            tile = box(
                ix * args.tile_size, iy * args.tile_size,
                (ix + 1) * args.tile_size, (iy + 1) * args.tile_size
            )
            cut = geom.intersection(tile)
            if cut.area > 0.02:
                extrusion(
                    f"{name}_{ix}_{iy}", cut, z0, z1, mat,
                    category=category, meta=meta
                )


# ---------------------------------------------------------------------------
# Primitive mesh templates: shared mesh data, editable objects
# ---------------------------------------------------------------------------

def add_box(v, f, mi, center, size, mat=0):
    cx, cy, cz = center
    sx, sy, sz = [s / 2 for s in size]
    i = len(v)
    v.extend([
        (cx-sx, cy-sy, cz-sz), (cx+sx, cy-sy, cz-sz),
        (cx+sx, cy+sy, cz-sz), (cx-sx, cy+sy, cz-sz),
        (cx-sx, cy-sy, cz+sz), (cx+sx, cy-sy, cz+sz),
        (cx+sx, cy+sy, cz+sz), (cx-sx, cy+sy, cz+sz),
    ])
    for q in [(0,3,2,1), (4,5,6,7), (0,1,5,4),
              (1,2,6,5), (2,3,7,6), (3,0,4,7)]:
        f.append(tuple(i+n for n in q))
        mi.append(mat)

def add_cylinder(v, f, mi, radius, height, center=(0,0,0),
                 mat=0, count=12):
    cx, cy, cz = center
    i = len(v)
    for z in (cz, cz + height):
        for j in range(count):
            a = 2 * math.pi * j / count
            v.append((cx + radius*math.cos(a),
                      cy + radius*math.sin(a), z))
    f.append(tuple(i+j for j in reversed(range(count))))
    mi.append(mat)
    f.append(tuple(i+count+j for j in range(count)))
    mi.append(mat)
    for j in range(count):
        k = (j + 1) % count
        f.append((i+j, i+k, i+count+k, i+count+j))
        mi.append(mat)

def add_ellipsoid(v, f, mi, center, scale, mat=1,
                  segments=12, rings=8):
    cx, cy, cz = center
    sx, sy, sz = scale
    bottom = len(v)
    v.append((cx, cy, cz-sz))
    first = len(v)
    for r in range(1, rings):
        lat = -math.pi/2 + math.pi*r/rings
        for j in range(segments):
            a = 2*math.pi*j/segments
            v.append((
                cx + sx*math.cos(lat)*math.cos(a),
                cy + sy*math.cos(lat)*math.sin(a),
                cz + sz*math.sin(lat),
            ))
    top = len(v)
    v.append((cx, cy, cz+sz))
    for j in range(segments):
        k = (j+1) % segments
        f.append((bottom, first+k, first+j)); mi.append(mat)
    for r in range(rings-2):
        a = first + r*segments
        b = a + segments
        for j in range(segments):
            k = (j+1) % segments
            f.append((a+j, a+k, b+k, b+j)); mi.append(mat)
    last = first + (rings-2)*segments
    for j in range(segments):
        k = (j+1) % segments
        f.append((last+j, last+k, top)); mi.append(mat)

def template(name, mats, build):
    v, f, mi = [], [], []
    build(v, f, mi)
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(v, [], f)
    for mat in mats:
        mesh.materials.append(mat)
    mesh.update()
    for face, idx in zip(mesh.polygons, mi):
        face.material_index = idx
    return mesh

def build_tree(v, f, mi):
    add_cylinder(v, f, mi, 0.19, 4.6)
    for center, scale in [
        ((0,0,5.4), (2.4,2.1,2.4)),
        ((1.3,0.3,5.1), (1.8,1.7,1.8)),
        ((-1.2,0.6,5.0), (1.8,1.6,1.9)),
        ((0.0,-1.3,4.8), (1.8,1.7,1.7)),
    ]:
        add_ellipsoid(v, f, mi, center, scale)

def build_lamp(v, f, mi):
    add_cylinder(v, f, mi, 0.065, 7.5)
    add_box(v, f, mi, (0.55,0,7.35), (1.2,0.09,0.09))
    add_box(v, f, mi, (1.15,0,7.30), (0.55,0.25,0.12), 1)

def build_signal(v, f, mi):
    add_cylinder(v, f, mi, 0.055, 3.2)
    add_box(v, f, mi, (0,0,3.1), (0.25,0.20,0.80), 1)

T = {
    "tree": template("Tree_Approximation_Shared",
                     [M["bark"], M["leaves"]], build_tree),
    "lamp": template("StreetLamp_Approximation_Shared",
                     [M["metal"], M["black"]], build_lamp),
    "signal": template("Signal_Approximation_Shared",
                       [M["metal"], M["black"]], build_signal),
    "pole": template(
        "UtilityPole_Approximation_Shared", [M["paving"]],
        lambda v,f,mi: add_cylinder(v,f,mi,0.12,8.0)
    ),
    "cabinet": template(
        "UtilityCabinet_Approximation_Shared", [M["metal"]],
        lambda v,f,mi: add_box(v,f,mi,(0,0,0.65),(0.8,0.45,1.3))
    ),
    "tank": template(
        "RoofWaterTank_Approximation_Shared", [M["black"]],
        lambda v,f,mi: add_cylinder(v,f,mi,0.65,1.2,count=20)
    ),
    "hvac": template(
        "RoofHVAC_Approximation_Shared", [M["metal"]],
        lambda v,f,mi: add_box(v,f,mi,(0,0,0.5),(1.6,1.0,1.0))
    ),
}

def instance(kind, name, position, scale=1.0, yaw=0.0,
             category="Street_Furniture", meta=None):
    obj = bpy.data.objects.new(name, T[kind])
    obj.location = position
    obj.scale = (scale, scale, scale)
    obj.rotation_euler.z = yaw
    register_object(obj, category, meta or {})
    instance_records.append({
        "object": obj.name,
        "prototype": kind,
        "position_enu_m": list(position),
        "uniform_scale": scale,
        "yaw_radians": yaw,
        "tile": list(tile_key(position[0], position[1])),
        "provenance": meta or {},
    })
    return obj


# ---------------------------------------------------------------------------
# Ground, land-use blocks, mapped parking and vegetation regions
# ---------------------------------------------------------------------------

tiled_surface(
    "Ground", CLIP, -0.30, -0.05, M["ground"], "Ground",
    {"geometry_status": "Flat procedural ground; no DEM"}
)

green_regions = []
parking_features = []

for element, geom in areas:
    tags = element.get("tags", {})
    if "building" in tags or "building:part" in tags:
        continue

    green = (
        tags.get("landuse") in
        {"grass", "forest", "meadow", "recreation_ground"}
        or tags.get("leisure") in {"park", "garden"}
        or tags.get("natural") in {"wood", "scrub", "grassland"}
    )
    if green:
        green_regions.append(geom)
        tiled_surface(
            "Mapped_GreenArea", geom, -0.04, -0.025,
            M["grass"], "Landuse",
            source_meta(element, surface_status="Approximate ground cover")
        )
    elif tags.get("natural") == "water":
        tiled_surface(
            "Mapped_Water", geom, -0.04, -0.03,
            M["water"], "Landuse",
            source_meta(element, elevation_status="Approximate flat water")
        )
    elif tags.get("amenity") == "parking":
        parking_features.append((element, geom))
    elif tags.get("landuse") in {
        "commercial", "industrial", "residential", "retail"
    }:
        tiled_surface(
            "Mapped_Landuse_Block", geom, -0.045, -0.035,
            M["ground"], "Landuse",
            source_meta(
                element,
                geometry_status="Mapped land-use extent; not cadastral parcel"
            )
        )

all_buildings = union_all(g for _, g in building_features)
building_prepared = prep(all_buildings.buffer(0.5))


# ---------------------------------------------------------------------------
# Roads, sidewalks and markings
# ---------------------------------------------------------------------------

WIDTHS = {
    "motorway": 15.0, "trunk": 14.0, "primary": 12.0,
    "secondary": 10.0, "tertiary": 8.0, "residential": 6.0,
    "unclassified": 6.0, "service": 4.5, "living_street": 4.5,
    "motorway_link": 6.0, "trunk_link": 6.0,
    "primary_link": 6.0, "secondary_link": 5.5,
    "tertiary_link": 5.0, "footway": 1.8, "path": 1.5,
    "pedestrian": 4.0, "cycleway": 2.0, "steps": 1.8,
    "track": 3.0,
}
WALK_CLASSES = {"footway", "path", "pedestrian", "cycleway", "steps"}
NO_BUILD = {"construction", "proposed", "raceway"}

def number(value):
    if value is None:
        return None
    try:
        return float(str(value).strip())
    except ValueError:
        return None

def metres(value):
    if value is None:
        return None
    s = str(value).strip().lower()
    m = re.fullmatch(r"(\d+(?:\.\d+)?)\s*(?:m|metres|meters)?", s)
    if m:
        return float(m.group(1))
    m = re.fullmatch(r"(\d+(?:\.\d+)?)\s*(?:ft|feet|')", s)
    return float(m.group(1))*0.3048 if m else None

def road_width(tags):
    width = metres(tags.get("width"))
    if width and 0.5 <= width <= 80:
        return width, "OSM width tag; unverified"
    lanes = number(tags.get("lanes"))
    if lanes and 1 <= lanes <= 12:
        return lanes*3.1 + 0.8, "Approximation from OSM lanes"
    return WIDTHS.get(tags.get("highway"), 5.0), "Class-based approximation"

road_surfaces = defaultdict(list)
walk_surfaces = defaultdict(list)
road_info = []
ground_road_masks = []
road_manifest = []

for element, line in roads:
    tags = element.get("tags", {})
    cls = tags["highway"]
    if cls in NO_BUILD:
        continue

    width, width_source = road_width(tags)
    layer = number(tags.get("layer")) or 0
    z = 0.015

    if tags.get("tunnel") not in (None, "no"):
        warnings.append(
            f"Tunnel retained in source but not modeled: {osm_id(element)}"
        )
        continue

    elevated = layer > 0 or tags.get("bridge") not in (None, "no")
    if elevated:
        z += max(1, layer)*5.5
        warnings.append(
            f"Schematic elevated road; no surveyed deck/ramp/support geometry: "
            f"{osm_id(element)}"
        )

    surface = line.buffer(width/2, cap_style=1, join_style=1).intersection(CLIP)
    is_walk = cls in WALK_CLASSES

    if is_walk:
        walk_surfaces[z].append(surface)
        if cls == "steps":
            warnings.append(
                f"Mapped steps represented as flat paving: {osm_id(element)}"
            )
    else:
        road_surfaces[z].append(surface)

    if not elevated:
        ground_road_masks.append(surface)

    sidewalk = EMPTY
    if (
        not is_walk and not elevated
        and cls not in {"motorway", "motorway_link", "trunk", "track"}
        and tags.get("sidewalk") not in {"no", "none", "separate"}
    ):
        sidewalk_width = 1.6
        sidewalk = line.buffer(width/2 + sidewalk_width).difference(
            line.buffer(width/2)
        ).intersection(CLIP)
        walk_surfaces[z].append(sidewalk)

    road_info.append({
        "element": element, "line": line, "width": width,
        "width_source": width_source, "z": z,
        "surface": surface, "sidewalk": sidewalk,
        "walk": is_walk, "elevated": elevated,
    })
    road_manifest.append({
        **source_meta(element),
        "width_m": width,
        "width_source": width_source,
        "surface_elevation_m": z,
        "centerline_enu_m": [list(c) for c in line.coords],
        "sidewalk_status":
            "Procedural buffer, if generated; not surveyed sidewalk edges",
    })

ground_roads = union_all(ground_road_masks)
ground_sidewalks = EMPTY

for z, geometries in road_surfaces.items():
    tiled_surface(
        f"Road_Surface_Z{z:.2f}", union_all(geometries),
        z - 0.08, z, M["asphalt"], "Roads",
        {
            "geometry_status": "Buffered OSM centerlines; approximate edges",
            "source_manifest": "roads.json",
            "elevation_status":
                "Flat or schematic layer-derived elevation; not surveyed",
        },
    )


for z, geometries in walk_surfaces.items():
    geom = union_all(geometries)
    geom = geom.difference(
        union_all(road_surfaces.get(z, []))
    ).difference(all_buildings)
    tiled_surface(
        f"Paving_Z{z:.2f}", geom, z, z + 0.12,
        M["paving"], "Sidewalks",
        {
            "geometry_status":
                "Mapped pedestrian routes plus procedural sidewalks",
            "sidewalk_edges": "Approximate, not surveyed",
        },
    )
    if abs(z - 0.015) < 0.001:
        ground_sidewalks = geom

# Dashed center markings. These are decorative assumptions, not mapped lanes.
for idx, info in enumerate(road_info):
    if info["walk"] or info["width"] < 7.0:
        continue

    tags = info["element"].get("tags", {})
    if tags.get("oneway") in {"yes", "1", "-1"}:
        continue

    line = info["line"]
    d = 4.0
    dashes = []
    while d + 3.0 < line.length:
        a = line.interpolate(d)
        b = line.interpolate(d + 3.0)
        dash = LineString([a.coords[0], b.coords[0]]).buffer(
            0.06, cap_style=2
        )
        dashes.append(dash)
        d += 9.0

    if dashes:
        tiled_surface(
            f"Center_Markings_{idx}",
            union_all(dashes).intersection(info["surface"]),
            info["z"] + 0.004, info["z"] + 0.004,
            M["white"], "Road_Markings",
            source_meta(
                info["element"],
                geometry_status="Procedural dashed markings; not mapped lanes",
            ),
        )


# ---------------------------------------------------------------------------
# Parking: mapped outer areas, approximate bay layouts
# ---------------------------------------------------------------------------

parking_masks = []

for element, geom in parking_features:
    parking = geom.difference(
        all_buildings.buffer(0.3)
    ).difference(ground_roads)

    if parking.is_empty:
        continue

    parking_masks.append(parking)
    tiled_surface(
        f"Parking_{element['id']}", parking,
        -0.01, 0.005, M["parking"], "Parking",
        source_meta(
            element,
            boundary_status="OSM-derived parking extent",
            layout_status="Procedural bays; access/circulation not verified",
        ),
    )

    bay_lines = []
    for poly in polygons(parking):
        if poly.area < 70:
            continue

        # Align rows to the longest edge of the minimum rotated rectangle.
        rect = list(poly.minimum_rotated_rectangle.exterior.coords)
        edges = [
            (a, b, math.dist(a, b))
            for a, b in zip(rect, rect[1:])
        ]
        a, b, length = max(edges, key=lambda item: item[2])
        ux, uy = (b[0] - a[0]) / length, (b[1] - a[1]) / length
        vx, vy = -uy, ux

        points = list(poly.exterior.coords)
        u_values = [x * ux + y * uy for x, y in points]
        v_values = [x * vx + y * vy for x, y in points]
        umin, umax = min(u_values), max(u_values)
        vmin, vmax = min(v_values), max(v_values)

        safe = poly.buffer(-0.5)
        vv = vmin + 0.7
        while vv + 5.0 < vmax:
            uu = umin + 0.7
            while uu + 2.5 < umax:
                def uv(u, v):
                    return (u * ux + v * vx, u * uy + v * vy)

                bay = Polygon([
                    uv(uu, vv), uv(uu + 2.5, vv),
                    uv(uu + 2.5, vv + 5.0), uv(uu, vv + 5.0),
                ])
                if safe.covers(bay):
                    bay_lines.append(
                        LineString([
                            uv(uu, vv), uv(uu, vv + 5.0),
                            uv(uu + 2.5, vv + 5.0),
                            uv(uu + 2.5, vv),
                        ]).buffer(0.045, cap_style=2)
                    )
                uu += 2.5
            # Five-metre bays plus a nominal six-metre maneuvering aisle.
            vv += 11.0

    if bay_lines:
        tiled_surface(
            f"Parking_Bays_{element['id']}",
            union_all(bay_lines), 0.010, 0.010,
            M["white"], "Parking",
            source_meta(
                element,
                geometry_status=
                    "Procedural 2.5 x 5 m bays; not surveyed parking layout",
            ),
        )

all_parking = union_all(parking_masks)


# ---------------------------------------------------------------------------
# Building massing and height provenance
# ---------------------------------------------------------------------------

building_manifest = []

def building_parameters(element, geom):
    tags = element.get("tags", {})
    rng = stable_rng(osm_id(element))
    kind = tags.get("building:part", tags.get("building", "yes"))

    explicit_office = (
        kind in {"office", "commercial"}
        or "office" in tags
    )
    industrial = kind in {"industrial", "warehouse"}
    residential = kind in {
        "house", "detached", "apartments", "residential",
        "terrace", "semidetached_house",
    }
    landmark = (
        tags.get("amenity") in {
            "place_of_worship", "hospital", "school",
            "college", "university",
        }
        or kind in {"temple", "church", "mosque", "hospital", "school"}
    )

    if explicit_office:
        style = "office"
        style_source = "Office/commercial use indicated by OSM"
    elif industrial:
        style = "industrial"
        style_source = "Industrial/warehouse use indicated by OSM"
    elif residential:
        style = "residential"
        style_source = "Residential use indicated by OSM"
    elif landmark:
        style = "neutral_landmark"
        style_source = "Neutral massing; distinctive architecture unknown"
    elif geom.area > 900:
        style = "office"
        style_source = (
            "Procedural large-footprint office-like appearance; "
            "actual use unverified"
        )
    else:
        style = "residential"
        style_source = (
            "Procedural small-building appearance; actual use unverified"
        )

    storey_height = 3.6 if style == "office" else 3.0
    height = metres(tags.get("height"))
    levels = number(tags.get("building:levels"))

    if height is not None and 1.5 <= height <= 300:
        height_source = "OSM height tag; unverified"
    elif levels is not None and 0 < levels <= 80:
        height = levels * storey_height
        height_source = (
            f"Approximation: OSM building:levels x {storey_height:.1f} m"
        )
    else:
        if style == "office":
            assumed_levels = rng.randint(4, 9)
            height = assumed_levels * storey_height
        elif style == "industrial":
            height = rng.uniform(7.0, 11.0)
        elif style == "neutral_landmark":
            height = rng.uniform(6.0, 12.0)
        else:
            assumed_levels = (
                rng.randint(2, 5) if geom.area > 120 else rng.randint(1, 3)
            )
            height = assumed_levels * storey_height
        height_source = "Procedural height assumption; no usable OSM height"

    min_height = metres(tags.get("min_height"))
    min_source = "OSM min_height tag; unverified"
    if min_height is None:
        min_levels = number(tags.get("building:min_level"))
        min_height = (
            min_levels * storey_height
            if min_levels is not None and min_levels >= 0 else 0.0
        )
        min_source = (
            "Approximation from building:min_level"
            if min_levels else "Assumed ground-level base"
        )

    if min_height < 0 or min_height >= height:
        warnings.append(
            f"Invalid/unsupported building base reset: {osm_id(element)}"
        )
        min_height = 0.0
        min_source = "Fallback ground-level base"

    return {
        "style": style,
        "style_source": style_source,
        "height_m": height,
        "height_source": height_source,
        "min_height_m": min_height,
        "min_height_source": min_source,
        "storey_height_m": storey_height,
    }

prepared_buildings = [
    (el, geom, building_parameters(el, geom))
    for el, geom in building_features
]

# Avoid duplicate parent massing where ground-starting building parts exist.
# Elevated parts are retained separately and may overlap their parent.
ground_parts = union_all(
    geom
    for el, geom, params in prepared_buildings
    if "building:part" in el.get("tags", {})
    and params["min_height_m"] == 0
)

for el, _, params in prepared_buildings:
    if (
        "building:part" in el.get("tags", {})
        and params["min_height_m"] > 0
    ):
        warnings.append(
            "Elevated building part retained without reconstructing the "
            f"parent's architectural hierarchy: {osm_id(el)}"
        )


def facade_panels(name, footprint, z0, z1, style, storey_height, meta):
    """Disconnected editable facade quads; not surveyed window placement."""
    if style in {"industrial", "neutral_landmark"}:
        return

    verts, faces = [], []
    levels = max(1, int((z1 - z0) / storey_height))
    dz = (z1 - z0) / levels
    spacing = 2.4 if style == "office" else 3.1

    for poly in polygons(footprint):
        for ring in [poly.exterior, *poly.interiors]:
            points = list(ring.coords)
            for a, b in zip(points, points[1:]):
                length = math.dist(a, b)
                if length < 2.0:
                    continue

                ux = (b[0] - a[0]) / length
                uy = (b[1] - a[1]) / length
                # Exterior rings are CCW, interior rings CW.
                nx, ny = uy, -ux
                count = max(1, int(length / spacing))
                cell = length / count
                panel_width = cell * (0.80 if style == "office" else 0.46)

                for floor in range(levels):
                    low = z0 + floor * dz + dz * 0.25
                    high = z0 + floor * dz + dz * 0.82
                    for j in range(count):
                        center = (j + 0.5) * cell
                        p = center - panel_width / 2
                        q = center + panel_width / 2
                        x1, y1 = (
                            a[0] + ux * p + nx * 0.025,
                            a[1] + uy * p + ny * 0.025,
                        )
                        x2, y2 = (
                            a[0] + ux * q + nx * 0.025,
                            a[1] + uy * q + ny * 0.025,
                        )
                        start = len(verts)
                        verts.extend([
                            (x1, y1, low), (x2, y2, low),
                            (x2, y2, high), (x1, y1, high),
                        ])
                        faces.append(tuple(range(start, start + 4)))

    mesh_object(
        name, verts, faces, [M["glass"]],
        category="Facades",
        meta={
            **meta,
            "geometry_status":
                "Procedural surface glazing panels; no interior/window openings",
        },
    )


for element, original_geom, params in prepared_buildings:
    tags = element.get("tags", {})
    geom = original_geom
    is_part = "building:part" in tags

    if not is_part and not ground_parts.is_empty:
        geom = geom.difference(ground_parts)

    if geom.is_empty or geom.area < 1.0:
        building_manifest.append({
            **source_meta(element),
            **params,
            "model_status": "Parent footprint covered by building-part massing",
        })
        continue

    rng = stable_rng("appearance:" + osm_id(element))
    style = params["style"]
    z0 = params["min_height_m"]
    z1 = params["height_m"]
    label = tags.get("name", f"OSM_{element['id']}")
    label = re.sub(r"[^\w .-]+", "_", label)[:90]
    prefix = f"B_{element['type']}_{element['id']}_{label}"

    wall_mat = (
        rng.choice(facade_materials[3:])
        if style == "office" else rng.choice(facade_materials[:3])
    )

    meta = source_meta(
        element,
        footprint_status="OSM-derived; clipped to working extent",
        facade_status="Procedural approximation; not surveyed",
        roof_status="Flat-roof approximation",
        **params,
    )

    extrusion(
        prefix, geom, z0, z1, wall_mat, M["roof"],
        category="Buildings", meta=meta,
    )

    # Roof cap is an independently editable material-bearing object.
    extrusion(
        prefix + "_Roof", geom, z1 + 0.008, z1 + 0.008,
        M["roof"], category="Roofs", meta=meta,
    )

    facade_panels(
        prefix + "_Glazing", geom, z0, z1, style,
        params["storey_height_m"], meta,
    )

    if tags.get("roof:shape", "flat") != "flat":
        warnings.append(
            f"Tagged roof shape not reproduced; flat approximation: "
            f"{osm_id(element)} ({tags.get('roof:shape')})"
        )

    # Keep details within the assumed total height instead of increasing it.
    parapet_region = geom.difference(geom.buffer(-0.18))
    if style not in {"industrial", "neutral_landmark"}:
        extrusion(
            prefix + "_Parapet", parapet_region,
            max(z0, z1 - 0.7), z1 + 0.015,
            wall_mat, category="Roofs",
            meta={**meta, "geometry_status": "Procedural parapet"},
        )

    # Equipment locations and even the presence of equipment are assumptions.
    inset = geom.buffer(-2.0)
    if not inset.is_empty and style in {"office", "residential", "industrial"}:
        p = inset.representative_point()
        kind = "tank" if style == "residential" else "hvac"
        instance(
            kind, prefix + "_RoofEquipment",
            (p.x, p.y, z1 + 0.02),
            yaw=rng.uniform(0, math.tau),
            category="Roof_Equipment",
            meta=source_meta(
                element,
                geometry_status="Procedural rooftop equipment",
                placement_status="Assumed; not observed or surveyed",
            ),
        )

    building_manifest.append({
        **meta,
        "object_prefix": prefix,
        "modeled_footprint_area_m2": geom.area,
        "model_status": "Generated editable massing and separate details",
    })


# ---------------------------------------------------------------------------
# Vegetation and street furniture
# ---------------------------------------------------------------------------

occupied = union_all([
    all_buildings.buffer(1.0),
    ground_roads.buffer(0.6),
    ground_sidewalks,
    all_parking,
])
occupied_prepared = prep(occupied)
tree_positions = []

def place_tree(name, x, y, provenance, mapped=False):
    if not CLIP.covers(Point(x, y)):
        return False
    if not mapped and occupied_prepared.intersects(Point(x, y)):
        return False
    rng = stable_rng(name)
    instance(
        "tree", name, (x, y, 0),
        scale=rng.uniform(0.75, 1.35),
        yaw=rng.uniform(0, math.tau),
        category="Vegetation",
        meta=provenance,
    )
    tree_positions.append((x, y))
    return True

# Mapped point objects: position from OSM; dimensions/form approximate.
for nid, node in nodes.items():
    if nid not in node_xy:
        continue
    x, y = node_xy[nid]
    if not CLIP.covers(Point(x, y)):
        continue
    tags = node.get("tags", {})
    meta = source_meta(
        node,
        placement_status="Mapped OSM point; unverified",
        geometry_status="Generic procedural object; dimensions approximate",
    )

    if tags.get("natural") == "tree":
        place_tree(f"Mapped_Tree_{nid}", x, y, meta, mapped=True)

    elif tags.get("highway") == "street_lamp":
        instance("lamp", f"Mapped_Lamp_{nid}", (x, y, 0), meta=meta)

    elif tags.get("highway") == "traffic_signals":
        instance("signal", f"Mapped_Signal_{nid}", (x, y, 0), meta=meta)

    elif tags.get("power") in {"pole", "tower"}:
        instance("pole", f"Mapped_Utility_{nid}", (x, y, 0), meta=meta)
        if tags.get("power") == "tower":
            warnings.append(
                f"Power tower represented by pole placeholder: node/{nid}"
            )

    elif (
        tags.get("man_made") == "street_cabinet"
        or tags.get("power") == "substation"
    ):
        instance(
            "cabinet", f"Mapped_UtilityCabinet_{nid}",
            (x, y, 0), meta=meta,
        )

# Procedural vegetation only within mapped green areas, minus occupied areas.
plantable = union_all(green_regions).difference(occupied).buffer(-1.0)
tree_count = 0
rng = stable_rng("procedural_vegetation")

if not plantable.is_empty:
    # Grid jitter provides a simple minimum-spacing tendency.
    xmin, ymin, xmax, ymax = plantable.bounds
    plantable_prepared = prep(plantable)
    spacing = 9.0
    candidates = []
    x = xmin
    while x < xmax:
        y = ymin
        while y < ymax:
            px = x + rng.uniform(1.0, spacing - 1.0)
            py = y + rng.uniform(1.0, spacing - 1.0)
            if plantable_prepared.covers(Point(px, py)):
                candidates.append((px, py))
            y += spacing
        x += spacing
    rng.shuffle(candidates)

    for x, y in candidates:
        if tree_count >= args.max_procedural_trees:
            break
        if place_tree(
            f"Approx_GreenArea_Tree_{tree_count}", x, y,
            {
                "source": "Procedural placement within OSM green-area polygons",
                "placement_status": "Approximate; not mapped individual tree",
                "species_status": "Generic broadleaf form; species unknown",
            },
        ):
            tree_count += 1

# Lamps only on generated ground-level sidewalks.
# Reject nearby furniture to reduce duplicates across connected OSM ways.
existing_lamps = [
    (nxy[0], nxy[1])
    for nid, nxy in node_xy.items()
    if nodes[nid].get("tags", {}).get("highway") == "street_lamp"
    and CLIP.covers(Point(*nxy))
]
lamp_positions = list(existing_lamps)
sidewalk_prepared = prep(ground_sidewalks)

for idx, info in enumerate(road_info):
    if info["walk"] or info["elevated"] or info["sidewalk"].is_empty:
        continue
    if info["width"] < 6:
        continue

    line = info["line"]
    d = 16.0
    while d < line.length - 3.0:
        p = line.interpolate(d)
        a = line.interpolate(max(0, d - 0.5))
        b = line.interpolate(min(line.length, d + 0.5))
        dx, dy = b.x - a.x, b.y - a.y
        length = math.hypot(dx, dy)
        if length > 0:
            nx, ny = -dy / length, dx / length
            offset = info["width"] / 2 + 1.0
            x, y = p.x + nx * offset, p.y + ny * offset
            point = Point(x, y)
            if (
                sidewalk_prepared.covers(point)
                and not building_prepared.intersects(point)
                and all(
                    math.hypot(x - lx, y - ly) > 15
                    for lx, ly in lamp_positions
                )
            ):
                instance(
                    "lamp", f"Approx_Road_Lamp_{idx}_{int(d)}",
                    (x, y, 0.14),
                    yaw=math.atan2(-ny, -nx),
                    meta=source_meta(
                        info["element"],
                        placement_status=
                            "Procedural sidewalk placement; not mapped lamp",
                        geometry_status="Generic approximate street lamp",
                    ),
                )
                lamp_positions.append((x, y))
        d += 38.0


# ---------------------------------------------------------------------------
# Named landmarks and reference markers
# ---------------------------------------------------------------------------

area_lookup = {
    (el["type"], el["id"]): geom for el, geom in areas
}
landmarks = []

for key, element in elements.items():
    tags = element.get("tags", {})
    name = tags.get("name") or tags.get("name:en")
    if not name:
        continue

    # Named roads belong in the road manifest, not the landmark inventory.
    if "highway" in tags and not any(
        k in tags for k in ("amenity", "office", "public_transport")
    ):
        continue

    position = None
    if element["type"] == "node" and element["id"] in node_xy:
        position = node_xy[element["id"]]
    elif key in area_lookup:
        p = area_lookup[key].representative_point()
        position = (p.x, p.y)
    elif element["type"] == "way":
        line = way_line(element)
        if line is not None:
            p = line.interpolate(0.5, normalized=True)
            position = (p.x, p.y)

    if position is None or not CLIP.covers(Point(*position)):
        continue

    row = {
        "name": name,
        "osm_id": osm_id(element),
        "east_m": position[0],
        "north_m": position[1],
        "tags": tags,
        "status":
            "Name/location from OSM; importance and architecture not verified",
    }
    landmarks.append(row)

    marker = bpy.data.objects.new(f"LANDMARK_{name[:80]}", None)
    marker.location = (*position, 3.0)
    marker.empty_display_type = "PLAIN_AXES"
    marker.empty_display_size = 4.0
    marker["osm_id"] = osm_id(element)
    marker["name_from_osm"] = name
    marker["architectural_status"] = "Not verified"
    reference.objects.link(marker)


# ---------------------------------------------------------------------------
# Quality checks
# ---------------------------------------------------------------------------

road_building_overlap = ground_roads.intersection(all_buildings).area
if road_building_overlap > 1.0:
    warnings.append(
        f"Ground-road/building footprint overlap: "
        f"{road_building_overlap:.1f} m². Inspect possible width assumptions, "
        "OSM alignment differences, covered roads or level separation."
    )

if not green_regions:
    warnings.append(
        "No supported mapped green-area polygons found; "
        "procedural green-area planting was not generated."
    )

warnings.extend([
    "Default bbox is not an authoritative Hinjawadi Phase 1 boundary.",
    "Ground is flat; no DEM, contours, drainage gradients or earthworks.",
    "No surveyed architecture, facade photographs or cadastral parcels supplied.",
    "Unmapped buildings are not invented; blank areas may reflect OSM omissions.",
    "Distinctive landmark architecture requires separate reference-based modeling.",
    "Road junctions are planar buffer unions, not traffic-engineered geometry.",
    "No inferred overhead wires, buried utilities or service connections.",
    "No building interiors, navigable stairs or traffic simulation.",
    "Vegetation and street furniture use lightweight generic procedural meshes.",
    "Geometry/materials are editable, but this is a base reconstruction, "
    "not a photogrammetric or finished photorealistic digital twin.",
])

# Make the source/fidelity limitations visible inside the .blend file.
readme_text = """HINJAWADI OSM-BASED EDITABLE RECONSTRUCTION

© OpenStreetMap contributors
https://www.openstreetmap.org/copyright

Coordinates: local horizontal ENU in metres.
X east, Y north, Z up.
Origin and extent are stored on the Scene and in georeference.json.

Mapped footprints and centerlines are OSM-derived, NOT surveyed.
Heights are tagged with their source on each building.
Facades, unknown heights, roof equipment, parking layouts and most
street dressing are procedural approximations.

References_Not_For_Export contains named OSM landmark markers.
Inspect warnings.txt and provenance.json before using this model as evidence.
"""
text_block = bpy.data.texts.new("READ_ME_PROVENANCE")
text_block.write(readme_text)


# ---------------------------------------------------------------------------
# Lighting and a useful starting view
# ---------------------------------------------------------------------------

scene.world = bpy.data.worlds.new("Hinjawadi_World")
scene.world.use_nodes = True
background = scene.world.node_tree.nodes.get("Background")
background.inputs["Color"].default_value = (0.60, 0.72, 0.90, 1)
background.inputs["Strength"].default_value = 0.5

sun_data = bpy.data.lights.new("Sun", "SUN")
sun_data.energy = 2.5
sun_data.angle = math.radians(1.0)
sun = bpy.data.objects.new("Sun", sun_data)
sun.rotation_euler = (
    math.radians(27), math.radians(-18), math.radians(-35)
)
reference.objects.link(sun)

xmin, ymin, xmax, ymax = CLIP.bounds
camera_data = bpy.data.cameras.new("Overview_Camera")
camera = bpy.data.objects.new("Overview_Camera", camera_data)
reference.objects.link(camera)
camera.location = (
    0,
    ymin - (ymax - ymin) * 0.28,
    max(xmax - xmin, ymax - ymin) * 0.85,
)
target = Vector((0, 0, 0))
camera.rotation_euler = (
    target - camera.location
).to_track_quat("-Z", "Y").to_euler()
camera_data.lens = 32
camera_data.clip_end = 20000
scene.camera = camera

scene.render.engine = "CYCLES"
scene.cycles.samples = 64
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

# Long clipping range for exploring this large scene in Blender.
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type == "VIEW_3D":
            area.spaces.active.clip_end = 20000
            area.spaces.active.region_3d.view_distance = 1800

scene["generated_building_records"] = len(building_manifest)
scene["generated_objects"] = len(object_records)


# ---------------------------------------------------------------------------
# Optional tiled FBX export
# ---------------------------------------------------------------------------

export_manifest = []
export_dir = OUT / "ue5_fbx"

if args.export_fbx:
    export_dir.mkdir(exist_ok=True)

    # FBX stores material slots and simple material values.
    # UE material fidelity and texture setup must be checked after import.
    for key, objects in sorted(tile_objects.items()):
        mesh_objects = [obj for obj in objects if obj.type == "MESH"]
        if not mesh_objects:
            continue

        bpy.ops.object.select_all(action="DESELECT")
        tile_origin = Vector((
            key[0] * args.tile_size,
            key[1] * args.tile_size,
            0,
        ))
        previous = [(obj, obj.location.copy()) for obj in mesh_objects]

        filename = f"Tile_{key[0]:+04d}_{key[1]:+04d}.fbx"
        destination = export_dir / filename

        try:
            # Local tile coordinates avoid a single large scene origin.
            for obj, location in previous:
                obj.location = location - tile_origin
                obj.select_set(True)

            bpy.context.view_layer.objects.active = mesh_objects[0]
            bpy.context.view_layer.update()

            bpy.ops.export_scene.fbx(
                filepath=str(destination),
                use_selection=True,
                object_types={"MESH"},
                global_scale=1.0,
                apply_unit_scale=True,
                apply_scale_options="FBX_SCALE_UNITS",
                axis_forward="-Y",
                axis_up="Z",
                use_mesh_modifiers=True,
                mesh_smooth_type="FACE",
                use_triangles=True,
                add_leaf_bones=False,
                bake_anim=False,
                use_custom_props=True,
                path_mode="AUTO",
            )

            export_manifest.append({
                "file": filename,
                "tile": list(key),
                "tile_origin_enu_m": list(tile_origin),
                "object_count": len(mesh_objects),
                "coordinate_note":
                    "Geometry is relative to tile origin. Resolve ENU-to-UE "
                    "axis mapping with a calibration import; do not assume "
                    "FBX importer orientation settings are identical.",
            })
        finally:
            for obj, location in previous:
                obj.location = location
                obj.select_set(False)
            bpy.context.view_layer.update()

    # A tiny axis calibration asset makes import orientation testable.
    # Mesh markers: origin, +10 m east, +10 m north, +10 m up.
    calibration_collection = bpy.data.collections.new("Export_Calibration")
    scene.collection.children.link(calibration_collection)
    calibration_objects = []

    for name, position in [
        ("CAL_Origin", (0, 0, 0)),
        ("CAL_East_10m", (10, 0, 0)),
        ("CAL_North_10m", (0, 10, 0)),
        ("CAL_Up_10m", (0, 0, 10)),
    ]:
        v, f, mi = [], [], []
        add_box(v, f, mi, (0, 0, 0), (0.4, 0.4, 0.4))
        mesh = bpy.data.meshes.new(name + "_Mesh")
        mesh.from_pydata(v, [], f)
        mesh.update()
        obj = bpy.data.objects.new(name, mesh)
        obj.location = position
        calibration_collection.objects.link(obj)
        calibration_objects.append(obj)

    bpy.ops.object.select_all(action="DESELECT")
    for obj in calibration_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = calibration_objects[0]

    bpy.ops.export_scene.fbx(
        filepath=str(export_dir / "Axis_And_Scale_Calibration.fbx"),
        use_selection=True,
        object_types={"MESH"},
        global_scale=1.0,
        apply_unit_scale=True,
        apply_scale_options="FBX_SCALE_UNITS",
        axis_forward="-Y",
        axis_up="Z",
        use_triangles=True,
        bake_anim=False,
        use_custom_props=True,
    )

    for obj in calibration_objects:
        mesh = obj.data
        bpy.data.objects.remove(obj, do_unlink=True)
        if mesh.users == 0:
            bpy.data.meshes.remove(mesh)
    bpy.data.collections.remove(calibration_collection)


# ---------------------------------------------------------------------------
# Reports and editable Blender file
# ---------------------------------------------------------------------------

def write_json(filename, value):
    (OUT / filename).write_text(
        json.dumps(value, indent=2, ensure_ascii=False),
        encoding="utf8",
    )

write_json("georeference.json", {
    "source_crs": "WGS84 geographic coordinates",
    "local_frame": "Horizontal ENU from WGS84 ECEF",
    "origin_latitude": LAT0,
    "origin_longitude": LON0,
    "origin_ellipsoidal_height_for_projection_m": 0,
    "axes": {"X": "east", "Y": "north", "Z": "up"},
    "units": "metres",
    "bbox_south_west_north_east": args.bbox,
    "extent_status": "Working bbox, not authoritative phase boundary",
    "terrain_status": "Flat approximation; projected vertical component unused",
    "tile_size_m": args.tile_size,
})

write_json("roads.json", road_manifest)
write_json("buildings.json", building_manifest)
write_json("landmarks.json", landmarks)
write_json("provenance.json", object_records)
write_json("instances.json", instance_records)
write_json("export_manifest.json", export_manifest)

with (OUT / "landmarks.csv").open(
    "w", newline="", encoding="utf-8-sig"
) as handle:
    writer = csv.DictWriter(
        handle,
        fieldnames=["name", "osm_id", "east_m", "north_m", "status"],
    )
    writer.writeheader()
    for row in landmarks:
        writer.writerow({key: row[key] for key in writer.fieldnames})

(OUT / "warnings.txt").write_text(
    "\n".join(sorted(set(warnings))) + "\n", encoding="utf8"
)

source_hash = hashlib.sha256(cache.read_bytes()).hexdigest()
height_counts = Counter(
    row.get("height_source", "unknown") for row in building_manifest
)

write_json("generation_report.json", {
    "generator_seed": args.seed,
    "blender_version": bpy.app.version_string,
    "osm_cache_file": cache.name,
    "osm_cache_sha256": source_hash,
    "osm_metadata": osm.get("osm3s", {}),
    "download_or_cache_mtime_utc":
        time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(cache.stat().st_mtime)),
    "objects": len(object_records),
    "building_records": len(building_manifest),
    "road_records": len(road_manifest),
    "named_landmark_records": len(landmarks),
    "tree_objects": len(tree_positions),
    "tiles": len(tile_objects),
    "height_source_counts": dict(height_counts),
    "ground_road_building_overlap_m2": road_building_overlap,
    "warnings": sorted(set(warnings)),
})

(OUT / "ATTRIBUTION.txt").write_text(
    "Contains information from OpenStreetMap, made available under "
    "the Open Database License (ODbL).\n"
    "© OpenStreetMap contributors\n"
    "https://www.openstreetmap.org/copyright\n"
    "https://opendatacommons.org/licenses/odbl/1-0/\n\n"
    "Retain appropriate attribution when publishing the environment, "
    "renders or derived datasets. Review ODbL obligations for your "
    "particular distribution, including any derived database.\n",
    encoding="utf8",
)

bpy.ops.object.select_all(action="DESELECT")
blend_path = OUT / "hinjawadi_phase1_editable.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))

print("\n--- GENERATION COMPLETE ---")
print(f"Blender scene: {blend_path}")
print(f"Editable objects: {len(object_records)}")
print(f"Building records: {len(building_manifest)}")
print(f"Road records: {len(road_manifest)}")
print(f"Named landmark records: {len(landmarks)}")
print(f"Spatial tiles: {len(tile_objects)}")
print(f"Reports and attribution: {OUT}")
print("Review warnings.txt before treating this as a geographic reference.")
