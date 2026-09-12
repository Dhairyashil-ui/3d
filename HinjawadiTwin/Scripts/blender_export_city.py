import argparse
import hashlib
import json
import math
import shutil
import sys
from pathlib import Path

import bpy
from mathutils import Vector


argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
p = argparse.ArgumentParser()
p.add_argument("--out", required=True)
p.add_argument("--source-data", required=True)
args = p.parse_args(argv)

OUT = Path(args.out).resolve()
OUT.mkdir(parents=True, exist_ok=True)
FBX = OUT / "fbx"
FBX.mkdir(exist_ok=True)

SOURCE = Path(args.source_data).resolve()
GEO_PATH = SOURCE / "georeference.json"
if not GEO_PATH.exists():
    raise RuntimeError("Missing original georeference.json")

geo = json.loads(GEO_PATH.read_text(encoding="utf8"))
tile_size = float(geo.get("tile_size_m", 512))
scene = bpy.context.scene

if scene.unit_settings.scale_length != 1:
    raise RuntimeError("Expected Blender scene units: one unit = one metre.")

if not hasattr(bpy.ops.export_scene, "fbx"):
    raise RuntimeError("Blender FBX exporter unavailable.")


def serializable(value):
    if hasattr(value, "to_dict"):
        return {k: serializable(v) for k, v in value.to_dict().items()}
    if hasattr(value, "to_list"):
        return [serializable(v) for v in value.to_list()]
    if isinstance(value, dict):
        return {str(k): serializable(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [serializable(v) for v in value]
    if isinstance(value, str):
        try:
            result = json.loads(value)
            if isinstance(result, (dict, list)):
                return result
        except Exception:
            pass
        return value
    if isinstance(value, (int, float, bool)) or value is None:
        return value
    return str(value)


CATEGORIES = [
    "Buildings", "Facades", "Roofs", "Roof_Equipment",
    "Roads", "Sidewalks", "Road_Markings", "Parking",
    "Vegetation", "Street_Furniture", "Ground", "Landuse"
]


def category(obj):
    names = [c.name for c in obj.users_collection]
    if any(n.startswith("OFFICE_REFINE_") for n in names):
        return "Facades"
    for cat in CATEGORIES:
        if any(n.endswith("_" + cat) for n in names):
            return cat
    return "Details"


def digest_geometry(obj):
    h = hashlib.sha256()
    h.update(repr(tuple(v for row in obj.matrix_world for v in row)).encode())
    for v in obj.data.vertices:
        h.update(repr(tuple(v.co)).encode())
    for face in obj.data.polygons:
        h.update(repr(tuple(face.vertices)).encode())
    return h.hexdigest()


def material_record(mat):
    if mat is None:
        return {
            "name": "Default",
            "color": [0.5, 0.5, 0.5],
            "roughness": 0.7,
            "metallic": 0.0,
        }

    color = list(mat.diffuse_color[:3])
    roughness, metallic = 0.7, 0.0

    if mat.use_nodes:
        node = next(
            (n for n in mat.node_tree.nodes
             if n.type == "BSDF_PRINCIPLED"), None
        )
        if node:
            color = list(node.inputs["Base Color"].default_value[:3])
            roughness = float(node.inputs["Roughness"].default_value)
            metallic = float(node.inputs["Metallic"].default_value)

    return {
        "name": mat.name,
        "color": color,
        "roughness": roughness,
        "metallic": metallic,
        "shader_status":
            "Base PBR values only; procedural textures are not baked",
    }


def export_mesh(name, mesh, materials):
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)

    mesh.materials.clear()
    for mat in materials:
        if mat:
            mesh.materials.append(mat)
        else:
            placeholder = bpy.data.materials.get("UE_Default")
            if not placeholder:
                placeholder = bpy.data.materials.new("UE_Default")
            mesh.materials.append(placeholder)

    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.context.view_layer.update()

    path = FBX / (name + ".fbx")

    bpy.ops.export_scene.fbx(
        filepath=str(path),
        use_selection=True,
        object_types={"MESH"},
        global_scale=1.0,
        apply_unit_scale=True,
        apply_scale_options="FBX_SCALE_UNITS",
        axis_forward="-Y",
        axis_up="Z",
        use_mesh_modifiers=False,
        use_triangles=True,
        mesh_smooth_type="FACE",
        bake_anim=False,
        add_leaf_bones=False,
        use_custom_props=False,
    )

    bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.meshes.remove(mesh)
    return str(path.relative_to(OUT))


source_objects = [
    obj for obj in list(scene.objects)
    if obj.type == "MESH" and not obj.hide_render
    and not any(
        c.name in {"References_Not_For_Export", "Export_Calibration"}
        for c in obj.users_collection
    )
]

road_objects = [
    obj for obj in source_objects
    if category(obj) in {"Roads", "Sidewalks", "Road_Markings"}
]
road_hashes = {obj.name: digest_geometry(obj) for obj in road_objects}

shell_ids = {
    obj.get("osm_id")
    for obj in source_objects
    if category(obj) == "Buildings" and obj.get("osm_id")
}

records = []
building_index = []
depsgraph = bpy.context.evaluated_depsgraph_get()

for i, source in enumerate(source_objects):
    cat = category(source)
    properties = {
        k: serializable(source[k])
        for k in source.keys() if k != "_RNA_UI"
    }

    osm_id = str(properties.get("osm_id", ""))
    building_id = (
        osm_id if osm_id in shell_ids
        and cat in {"Buildings", "Facades", "Roofs", "Roof_Equipment"}
        else ""
    )

    uid = hashlib.sha256(source.name.encode()).hexdigest()[:20]
    asset_name = "SM_" + uid

    evaluated = source.evaluated_get(depsgraph)
    mesh = bpy.data.meshes.new_from_object(
        evaluated, preserve_all_data_layers=True, depsgraph=depsgraph
    )

    # Bake rotation/scale into vertices, but keep a nearby ENU pivot.
    pivot = source.matrix_world.translation.copy()
    for vertex in mesh.vertices:
        vertex.co = source.matrix_world @ vertex.co - pivot

    world_positions = [v.co + pivot for v in mesh.vertices]
    if not world_positions or not mesh.polygons:
        bpy.data.meshes.remove(mesh)
        continue

    bounds = [
        min(v.x for v in world_positions),
        min(v.y for v in world_positions),
        max(v.x for v in world_positions),
        max(v.y for v in world_positions),
    ]

    materials = [slot.material for slot in source.material_slots]
    if not materials:
        materials = [None]

    mat_records = [material_record(m) for m in materials]
    path = export_mesh(asset_name, mesh, materials)

    tags = properties.get("osm_tags", {})
    display_name = (
        tags.get("name", source.name)
        if isinstance(tags, dict) else source.name
    )

    record = {
        "uid": uid,
        "asset_name": asset_name,
        "source_object": source.name,
        "file": path,
        "category": cat,
        "building_id": building_id,
        "name": display_name,
        "enu_origin_m": list(pivot),
        "tile": [
            math.floor(pivot.x / tile_size),
            math.floor(pivot.y / tile_size),
        ],
        "bounds_enu_m": bounds,
        "properties": properties,
        "materials": mat_records,
    }
    records.append(record)

    if cat == "Buildings":
        building_index.append({
            "building_id": building_id or source.name,
            "name": display_name,
            "bounds_enu_m": bounds,
            "attributes_json": json.dumps(properties, ensure_ascii=False),
        })

    if i % 200 == 0:
        print(f"Exported {i}/{len(source_objects)} objects")


# Calibration uses off-origin mesh vertices, not object transforms.
calibration = {}

for name, center in {
    "origin": (0, 0, 0),
    "east": (10, 0, 0),
    "north": (0, 10, 0),
    "up": (0, 0, 10),
}.items():
    cx, cy, cz = center
    mesh = bpy.data.meshes.new("CAL_" + name)

    verts = [
        (cx+x, cy+y, cz+z)
        for x, y, z in [
            (-0.1,-0.1,-0.1), (0.1,-0.1,-0.1),
            (0.1,0.1,-0.1), (-0.1,0.1,-0.1),
            (-0.1,-0.1,0.1), (0.1,-0.1,0.1),
            (0.1,0.1,0.1), (-0.1,0.1,0.1),
        ]
    ]
    faces = [
        (0,3,2,1), (4,5,6,7), (0,1,5,4),
        (1,2,6,5), (2,3,7,6), (3,0,4,7),
    ]
    mesh.from_pydata(verts, [], faces)
    mesh.update()

    calibration[name] = export_mesh("CAL_" + name, mesh, [None])

for obj in road_objects:
    if digest_geometry(obj) != road_hashes[obj.name]:
        raise RuntimeError(f"Source road geometry changed: {obj.name}")

manifest = {
    "schema": 1,
    "georeference": geo,
    "calibration": calibration,
    "objects": records,
    "road_source_hashes": road_hashes,
    "terrain_status": "Original Blender terrain retained; no DEM added",
}

(OUT / "manifest.json").write_text(
    json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf8"
)
(OUT / "building_index.json").write_text(
    json.dumps({"buildings": building_index}, indent=2, ensure_ascii=False),
    encoding="utf8",
)

for filename in [
    "georeference.json", "ATTRIBUTION.txt",
    "warnings.txt", "generation_report.json",
]:
    source = SOURCE / filename
    if source.exists():
        shutil.copy2(source, OUT / filename)

print(f"Export complete: {OUT}")
print("Road source geometry integrity check passed.")
