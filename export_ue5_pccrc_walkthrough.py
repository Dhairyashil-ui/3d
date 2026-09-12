"""
Export updated Hinjawadi Phase 1 tile and high-fidelity modular PCCRC exterior
and interior assets to Unreal Engine 5 compatible FBX meshes.

Scale: 1 unit = 1 metre in Blender -> 100 cm in Unreal Engine.
Coordinate system: FBX export with -Y forward, Z up, FBX_SCALE_UNITS.
"""

import hashlib
import json
import math
import sys
from pathlib import Path
import bpy
from mathutils import Vector, Matrix

WORKSPACE = Path(r"c:\Users\Dhairyashil\website")
BLEND_FILE = WORKSPACE / "hinjawadi_output" / "hinjawadi_offices_refined.blend"
EXPORT_DIR_OUTPUT = WORKSPACE / "hinjawadi_output" / "ue5_fbx"
EXPORT_DIR_TWIN = WORKSPACE / "HinjawadiTwin" / "Content" / "CityData" / "fbx"

EXPORT_DIR_OUTPUT.mkdir(parents=True, exist_ok=True)
EXPORT_DIR_TWIN.mkdir(parents=True, exist_ok=True)

def material_record(mat):
    if mat is None:
        return {"name": "Default", "color": [0.5, 0.5, 0.5], "roughness": 0.7, "metallic": 0.0}
    color = list(mat.diffuse_color[:3])
    roughness, metallic = 0.7, 0.0
    if mat.use_nodes and mat.node_tree:
        bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
        if bsdf:
            if "Base Color" in bsdf.inputs and hasattr(bsdf.inputs["Base Color"], "default_value"):
                val = bsdf.inputs["Base Color"].default_value
                color = list(val[:3]) if hasattr(val, "__iter__") else [0.5, 0.5, 0.5]
            if "Roughness" in bsdf.inputs and hasattr(bsdf.inputs["Roughness"], "default_value"):
                roughness = float(bsdf.inputs["Roughness"].default_value)
            if "Metallic" in bsdf.inputs and hasattr(bsdf.inputs["Metallic"], "default_value"):
                metallic = float(bsdf.inputs["Metallic"].default_value)
    return {"name": mat.name, "color": color, "roughness": roughness, "metallic": metallic}

def export_objects_to_fbx(objects, file_name, pivot_offset=Vector((0, 0, 0))):
    """
    Exports a list of objects as a single unified or grouped FBX file.
    """
    if not objects:
        print(f"Warning: No objects to export for {file_name}")
        return None

    bpy.ops.object.select_all(action="DESELECT")
    valid_objects = []
    original_transforms = []

    for obj in objects:
        if obj and obj.name in bpy.data.objects:
            obj.hide_set(False)
            obj.hide_viewport = False
            obj.hide_render = False
            obj.select_set(True)
            valid_objects.append(obj)
            original_transforms.append((obj, obj.location.copy()))
            if pivot_offset.length_squared > 1e-6:
                obj.location = obj.location - pivot_offset

    if not valid_objects:
        return None

    bpy.context.view_layer.objects.active = valid_objects[0]
    bpy.context.view_layer.update()

    dest1 = EXPORT_DIR_OUTPUT / file_name
    dest2 = EXPORT_DIR_TWIN / file_name

    try:
        bpy.ops.export_scene.fbx(
            filepath=str(dest1),
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
        import shutil
        shutil.copy2(dest1, dest2)
        print(f"Exported: {file_name} ({len(valid_objects)} objects, {dest1.stat().st_size / 1024 / 1024:.2f} MB)")
    finally:
        for obj, loc in original_transforms:
            obj.location = loc

    return dest1

def main():
    print(f"Loading {BLEND_FILE}...")
    bpy.ops.wm.open_mainfile(filepath=str(BLEND_FILE))
    scene = bpy.context.scene

    pccrc_col = bpy.data.collections.get("Tile_-001_-002_PCCRC_Reconstruction")
    if not pccrc_col:
        raise RuntimeError("Tile_-001_-002_PCCRC_Reconstruction collection not found!")

    pccrc_all = list(pccrc_col.objects)
    print(f"Found {len(pccrc_all)} objects in PCCRC reconstruction collection.")

    # 1. Group PCCRC objects into logical architectural modules
    exterior_keywords = [
        "structural slab", "wing floor", "rcc rectangular column", "connector slab",
        "facade", "column", "portico", "pediment", "canopy", "fascia", "step", "frieze",
        "moulding", "downpipe", "ac ", "bracket", "corbel", "cornice", "arch", "spandrel",
        "parapet", "lintel", "sill"
    ]
    atrium_floor_keywords = [
        "atrium", "inlay", "motif", "planter", "soil", "bush", "central_glossy", "pier"
    ]
    gallery_keywords = [
        "gallery", "balcony", "rail", "pipe"
    ]
    room_door_keywords = [
        "portal", "door", "placard", "sign", "alarm", "skirting", "room"
    ]
    lift_skylight_keywords = [
        "lift", "elevator", "skylight", "dome", "glass"
    ]

    grouped = {
        "exterior": [],
        "atrium_floor": [],
        "galleries": [],
        "rooms_doors": [],
        "lift_skylight": [],
        "other": []
    }

    for obj in pccrc_all:
        if obj.type != "MESH":
            continue
        name_lower = obj.name.lower()
        if any(k in name_lower for k in lift_skylight_keywords):
            grouped["lift_skylight"].append(obj)
        elif any(k in name_lower for k in room_door_keywords):
            grouped["rooms_doors"].append(obj)
        elif any(k in name_lower for k in gallery_keywords):
            grouped["galleries"].append(obj)
        elif any(k in name_lower for k in atrium_floor_keywords):
            grouped["atrium_floor"].append(obj)
        elif any(k in name_lower for k in exterior_keywords):
            grouped["exterior"].append(obj)
        else:
            grouped["other"].append(obj)

    print("Grouping counts:")
    for k, v in grouped.items():
        print(f"  - {k}: {len(v)} objects")

    # PCCRC World Origin in local ENU is (-82.33, -769.22, 0.0)
    pccrc_origin_enu = Vector((-82.33, -769.22, 0.0))

    # Export Modular FBX files
    export_objects_to_fbx(grouped["exterior"] + grouped["other"], "SM_PCCRC_Exterior_Architecture.fbx", pccrc_origin_enu)
    export_objects_to_fbx(grouped["atrium_floor"], "SM_PCCRC_Interior_Atrium.fbx", pccrc_origin_enu)
    export_objects_to_fbx(grouped["galleries"], "SM_PCCRC_Interior_Galleries.fbx", pccrc_origin_enu)
    export_objects_to_fbx(grouped["rooms_doors"], "SM_PCCRC_Interior_Rooms_Doors.fbx", pccrc_origin_enu)
    export_objects_to_fbx(grouped["lift_skylight"], "SM_PCCRC_Interior_Lift_and_Skylight.fbx", pccrc_origin_enu)

    # 2. Export Hinjawadi Phase 1 Road and Walkway Network around PCCRC
    road_tile_cols = ["Tile_-001_-002_Roads", "Tile_-001_-002_Sidewalks", "Tile_-001_-002_Road_Markings"]
    road_objs = []
    for col_name in road_tile_cols:
        col = bpy.data.collections.get(col_name)
        if col:
            road_objs.extend([o for o in col.objects if o.type == "MESH"])

    # Also grab nearby road lamps and street furniture along the walk
    furn_col = bpy.data.collections.get("Tile_-001_-002_Street_Furniture")
    if furn_col:
        for o in furn_col.objects:
            if o.type == "MESH" and ("lamp" in o.name.lower() or "tree" in o.name.lower() or "bench" in o.name.lower()):
                road_objs.append(o)

    tile_origin_1_2 = Vector((-512.0, -1024.0, 0.0))
    export_objects_to_fbx(road_objs, "SM_Hinjawadi_Phase1_Roads_Walkway.fbx", tile_origin_1_2)

    # 3. Update Tile_-001_-002.fbx so the complete spatial tile is in sync
    tile_root = bpy.data.collections.get("Tile_-001_-002")
    if tile_root:
        def get_all_meshes(c):
            res = [o for o in c.objects if o.type == "MESH" and not o.hide_render and not o.hide_get()]
            for ch in c.children:
                res.extend(get_all_meshes(ch))
            return res
        all_tile_meshes = get_all_meshes(tile_root)
        print(f"Re-exporting complete Tile_-001_-002.fbx ({len(all_tile_meshes)} meshes)...")
        export_objects_to_fbx(all_tile_meshes, "Tile_-001_-002.fbx", tile_origin_1_2)

    # 4. Generate JSON manifest for UE5
    manifest = {
        "project": "Hinjawadi Phase 1 & PCCRC Digital Twin Walkthrough",
        "ue_engine_target": "5.4",
        "coordinate_frame": "Blender ENU (metres) -> UE5 (cm), UE_X = ENU_X * 100, UE_Y = -ENU_Y * 100, UE_Z = ENU_Z * 100",
        "pccrc_origin_enu_m": list(pccrc_origin_enu),
        "pccrc_ue_location_cm": [pccrc_origin_enu.x * 100.0, -pccrc_origin_enu.y * 100.0, pccrc_origin_enu.z * 100.0],
        "tile_-001_-002_origin_enu_m": list(tile_origin_1_2),
        "tile_-001_-002_ue_location_cm": [tile_origin_1_2.x * 100.0, -tile_origin_1_2.y * 100.0, tile_origin_1_2.z * 100.0],
        "walkthrough_path_enu_m": [
            {"label": "Phase 1 Road Approach", "enu": [-140.0, -740.0, 0.0], "heading_deg": 125.0},
            {"label": "I2IT / PCCRC Campus Gate", "enu": [-105.0, -758.0, 0.0], "heading_deg": 130.0},
            {"label": "Landscaped Forecourt Plaza", "enu": [-95.0, -762.0, 0.0], "heading_deg": 140.0},
            {"label": "Base of Monumental Steps", "enu": [-82.33, -771.5, 0.0], "heading_deg": 4.44},
            {"label": "Monumental Portico Platform", "enu": [-82.33, -769.5, 0.30], "heading_deg": 4.44},
            {"label": "Entrance Vestibule Doors", "enu": [-82.33, -763.5, 0.30], "heading_deg": 4.44},
            {"label": "Grand Central Atrium Core", "enu": [-82.33, -755.22, 0.0], "heading_deg": 4.44},
            {"label": "Atrium Floor Marble Inlays", "enu": [-82.33, -753.5, 0.0], "heading_deg": 4.44},
            {"label": "Panoramic Glass Lift & Corridors", "enu": [-82.33, -749.0, 0.0], "heading_deg": 4.44},
            {"label": "Departmental Rooms (A-111 to A-119)", "enu": [-74.0, -749.0, 0.0], "heading_deg": 90.0}
        ],
        "assets": [
            {"file": "SM_PCCRC_Exterior_Architecture.fbx", "category": "Building", "collision": "ComplexAsSimple"},
            {"file": "SM_PCCRC_Interior_Atrium.fbx", "category": "Interior", "collision": "ComplexAsSimple"},
            {"file": "SM_PCCRC_Interior_Galleries.fbx", "category": "Interior", "collision": "ComplexAsSimple"},
            {"file": "SM_PCCRC_Interior_Rooms_Doors.fbx", "category": "Interior", "collision": "ComplexAsSimple"},
            {"file": "SM_PCCRC_Interior_Lift_and_Skylight.fbx", "category": "Interior_Glazing", "collision": "ComplexAsSimple"},
            {"file": "SM_Hinjawadi_Phase1_Roads_Walkway.fbx", "category": "Roads", "collision": "ComplexAsSimple"},
            {"file": "Tile_-001_-002.fbx", "category": "Tile", "collision": "ComplexAsSimple"}
        ]
    }

    manifest_path1 = EXPORT_DIR_OUTPUT / "pccrc_ue5_manifest.json"
    manifest_path2 = EXPORT_DIR_TWIN / "pccrc_ue5_manifest.json"
    manifest_path1.write_text(json.dumps(manifest, indent=2), encoding="utf8")
    manifest_path2.write_text(json.dumps(manifest, indent=2), encoding="utf8")
    print(f"Saved manifest to {manifest_path1} and {manifest_path2}")

if __name__ == "__main__":
    main()
