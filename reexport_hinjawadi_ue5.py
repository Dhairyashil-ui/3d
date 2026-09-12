"""
Re-export Hinjawadi tiles for Unreal Engine 5 after office refinement.

Assigns OFFICE_REFINE_Details objects to their parent buildings' spatial export tiles.
Re-exports the updated tiles containing the refined buildings and new detail meshes to FBX.
Leaves road assets completely untouched.
Updates export_manifest.json with the updated object counts.
"""

import argparse
import json
import math
import re
import sys
from collections import defaultdict
from pathlib import Path

import bpy
from mathutils import Vector


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--tile-size", type=float, default=512.0)
    parser.add_argument("--export-dir", default="hinjawadi_output/ue5_fbx")
    parser.add_argument("--manifest", default="hinjawadi_output/export_manifest.json")
    parser.add_argument("--save-blend", action="store_true", help="Save the blend file with assigned tile collections")
    args = parser.parse_args(argv)

    details_col = bpy.data.collections.get("OFFICE_REFINE_Details")
    if not details_col:
        print("No OFFICE_REFINE_Details collection found. Nothing to re-export.")
        return

    tile_pattern = re.compile(r"^Tile_([+-]\d{3})_([+-]\d{3})$")
    tile_collections = {}
    for col in bpy.data.collections:
        m = tile_pattern.match(col.name)
        if m:
            gx, gy = int(m.group(1)), int(m.group(2))
            tile_collections[(gx, gy)] = col

    # Helper to recursively get objects in collection hierarchy
    def get_collection_objects(col):
        objs = set(col.objects)
        for child in col.children:
            objs.update(get_collection_objects(child))
        return objs

    # Step 1: Assign each detail object to its parent building's export tile
    print(f"Assigning {len(details_col.objects)} detail objects to parent building tiles...")
    assigned_count = 0
    tile_to_details = defaultdict(list)
    affected_tiles = set()

    for detail_obj in list(details_col.objects):
        parent_name = detail_obj.name.removeprefix("OFFICE_REFINE_")
        parent_obj = bpy.data.objects.get(parent_name)
        if not parent_obj:
            print(f"Warning: Parent building {parent_name} not found for {detail_obj.name}")
            continue

        # Find which tile collection the parent belongs to
        parent_tile_key = None
        for col in parent_obj.users_collection:
            m = re.match(r"^Tile_([+-]\d{3})_([+-]\d{3})", col.name)
            if m:
                parent_tile_key = (int(m.group(1)), int(m.group(2)))
                break

        if not parent_tile_key:
            gx = math.floor(parent_obj.location.x / args.tile_size)
            gy = math.floor(parent_obj.location.y / args.tile_size)
            parent_tile_key = (gx, gy)

        affected_tiles.add(parent_tile_key)
        tile_to_details[parent_tile_key].append(detail_obj)

        tile_root = tile_collections.get(parent_tile_key)
        if tile_root:
            refine_subcol_name = f"{tile_root.name}_Office_Refinement"
            refine_subcol = bpy.data.collections.get(refine_subcol_name)
            if not refine_subcol:
                refine_subcol = bpy.data.collections.new(refine_subcol_name)
                tile_root.children.link(refine_subcol)
            if detail_obj.name not in refine_subcol.objects:
                refine_subcol.objects.link(detail_obj)
            assigned_count += 1

    print(f"Assigned {assigned_count} detail objects across {len(affected_tiles)} spatial tiles.")

    # Load existing manifest if present
    manifest_path = Path(args.manifest)
    manifest = []
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf8"))
        except Exception:
            manifest = []

    manifest_by_file = {entry["file"]: entry for entry in manifest}

    export_dir = Path(args.export_dir)
    export_dir.mkdir(parents=True, exist_ok=True)

    # Step 2: Re-export affected tiles
    print(f"Re-exporting {len(affected_tiles)} affected tiles to FBX...")
    reexported_tiles = 0

    for key in sorted(affected_tiles):
        tile_root = tile_collections.get(key)
        if not tile_root:
            print(f"Warning: Tile collection for key {key} not found.")
            continue

        filename = f"Tile_{key[0]:+04d}_{key[1]:+04d}.fbx"
        destination = export_dir / filename

        # Collect all mesh objects belonging to this tile
        tile_all_objects = get_collection_objects(tile_root)
        # Exclude hidden original glazing or any hidden objects
        mesh_objects = [
            obj for obj in tile_all_objects
            if obj.type == "MESH" and not obj.hide_render and not obj.hide_get()
        ]

        if not mesh_objects:
            continue

        bpy.ops.object.select_all(action="DESELECT")
        tile_origin = Vector((
            key[0] * args.tile_size,
            key[1] * args.tile_size,
            0.0,
        ))
        previous = [(obj, obj.location.copy()) for obj in mesh_objects]

        try:
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

            entry = {
                "file": filename,
                "tile": list(key),
                "tile_origin_enu_m": list(tile_origin),
                "object_count": len(mesh_objects),
                "coordinate_note":
                    "Geometry is relative to tile origin. Resolve ENU-to-UE "
                    "axis mapping with a calibration import; do not assume "
                    "FBX importer orientation settings are identical.",
                "refined_office_count": len(tile_to_details[key]),
            }
            manifest_by_file[filename] = entry
            reexported_tiles += 1
            print(f"Re-exported {filename} ({len(mesh_objects)} objects, including {len(tile_to_details[key])} refined office details)")
        finally:
            for obj, location in previous:
                obj.location = location

    # Update manifest
    updated_manifest = list(manifest_by_file.values())
    updated_manifest.sort(key=lambda x: (x.get("tile", [0, 0])[0], x.get("tile", [0, 0])[1]))
    manifest_path.write_text(json.dumps(updated_manifest, indent=2), encoding="utf8")
    print(f"Updated export manifest saved to: {manifest_path}")

    if args.save_blend:
        bpy.ops.wm.save_mainfile()
        print("Updated mainfile saved with assigned tile collections.")


if __name__ == "__main__":
    main()
