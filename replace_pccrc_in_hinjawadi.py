"""
Replace procedural PCCRC building in Hinjawadi with the detailed 3D model
from institutional_reconstruction.blend.
"""

import math
from pathlib import Path
import bpy
import mathutils

WORKSPACE = Path(r"C:\Users\Dhairyashil\website")
SRC_BLEND = WORKSPACE / "institutional_reconstruction.blend"
TARGET_BLEND = WORKSPACE / "hinjawadi_output" / "hinjawadi_offices_refined.blend"
RENDER_OUT = WORKSPACE / "hinjawadi_output" / "pccrc_in_hinjawadi.png"

def main():
    print(f"Loading {TARGET_BLEND}...")
    bpy.ops.wm.open_mainfile(filepath=str(TARGET_BLEND))

    scene = bpy.context.scene

    # 1. Locate the existing procedural PCCRC objects
    old_building = bpy.data.objects.get("B_way_359685492_OSM_359685492")
    old_detail = bpy.data.objects.get("OFFICE_REFINE_B_way_359685492_OSM_359685492")
    old_glazing = bpy.data.objects.get("B_way_359685492_OSM_359685492_Glazing")

    archive_col = bpy.data.collections.get("Archived_Procedural_PCCRC")
    if not archive_col:
        archive_col = bpy.data.collections.new("Archived_Procedural_PCCRC")
        scene.collection.children.link(archive_col)
    archive_col.hide_viewport = True
    archive_col.hide_render = True

    for old_obj in [old_building, old_detail, old_glazing]:
        if old_obj:
            for c in list(old_obj.users_collection):
                c.objects.unlink(old_obj)
            archive_col.objects.link(old_obj)
            old_obj.hide_viewport = True
            old_obj.hide_render = True
            print(f"Archived procedural object: {old_obj.name}")

    # 2. Prepare target collection in Tile_-001_-002
    tile_col = bpy.data.collections.get("Tile_-001_-002")
    pccrc_col_name = "Tile_-001_-002_PCCRC_Reconstruction"
    pccrc_col = bpy.data.collections.get(pccrc_col_name)
    if not pccrc_col:
        pccrc_col = bpy.data.collections.new(pccrc_col_name)
        if tile_col:
            tile_col.children.link(pccrc_col)
        else:
            scene.collection.children.link(pccrc_col)

    # 3. Calculate transform matrix
    # Building local structure bounds in institutional_reconstruction.blend:
    # X in [-18, 18], Y in [0, 25.25], Z base = 0.0
    cx, cy, cz = 0.0, 12.625, 0.0
    target_x, target_y, target_z = -82.33, -769.22, 0.0
    theta = math.radians(4.44)  # Alignment with campus forecourt edge

    M_center = mathutils.Matrix.Translation(mathutils.Vector((-cx, -cy, -cz)))
    M_rot = mathutils.Matrix.Rotation(theta, 4, "Z")
    M_target = mathutils.Matrix.Translation(mathutils.Vector((target_x, target_y, target_z)))
    M_transform = M_target @ M_rot @ M_center

    # 4. Append collections from institutional_reconstruction.blend
    collections_to_import = [
        "01_Structure",
        "02_Front_Facade",
        "03_Sides_Rear",
        "04_Portico",
        "05_Windows_Doors",
        "06_Atrium",
        "07_Roof",
        "08_Utilities",
        "09_Weathering",
    ]

    print("Appending objects from institutional_reconstruction.blend...")
    imported_objects = []

    with bpy.data.libraries.load(str(SRC_BLEND)) as (data_from, data_to):
        # We load collections
        data_to.collections = [c for c in collections_to_import if c in data_from.collections]

    for imported_col in data_to.collections:
        if not imported_col:
            continue
        for obj in list(imported_col.objects):
            # Apply transformation
            obj.matrix_world = M_transform @ obj.matrix_world
            # Link to tile collection
            if obj.name not in pccrc_col.objects:
                pccrc_col.objects.link(obj)
            imported_objects.append(obj)

    print(f"Successfully placed {len(imported_objects)} PCCRC reconstruction objects into {pccrc_col.name}.")

    # Tag primary building object for GIS/metadata recognition
    main_structure = next((o for o in imported_objects if "Main structural concrete core" in o.name or "column" in o.name.lower()), imported_objects[0])
    main_structure["osm_id"] = "way/359685492"
    main_structure["name"] = "Pralhad P. Chhabria Research Center (PCCRC)"
    main_structure["style"] = "pccrc_reconstruction"
    main_structure["provenance"] = "Calibrated 3D architectural digital twin (institutional_reconstruction.blend)"

    # 5. Set up Camera for rendering the updated building in context
    cam_data = bpy.data.cameras.new("PCCRC_Context_Camera")
    cam_data.lens = 35.0
    cam_data.clip_start = 0.5
    cam_data.clip_end = 2000.0

    cam_obj = bpy.data.objects.new("PCCRC_Context_Camera", cam_data)
    # Position: elevated south-west three-quarter perspective
    cam_pos = mathutils.Vector((-82.33 - 62.0, -769.22 - 75.0, 38.0))
    cam_target = mathutils.Vector((-82.33, -769.22, 10.0))

    direction = cam_target - cam_pos
    rot_quat = direction.to_track_quat("-Z", "Y")
    cam_obj.location = cam_pos
    cam_obj.rotation_euler = rot_quat.to_euler()

    scene.collection.objects.link(cam_obj)
    scene.camera = cam_obj

    # Sun light for clear architectural visualization
    sun_data = bpy.data.lights.new(name="PCCRC_Context_Sun", type="SUN")
    sun_data.energy = 3.5
    sun_data.color = (1.0, 0.98, 0.95)
    sun_obj = bpy.data.objects.new("PCCRC_Context_Sun", sun_data)
    sun_obj.rotation_euler = (math.radians(50), math.radians(15), math.radians(-35))
    scene.collection.objects.link(sun_obj)

    # 6. Render context image
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(RENDER_OUT)

    # Render with EEVEE for fast high-quality preview
    if hasattr(scene.render, "engine"):
        # Use EEVEE or BLENDER_EEVEE_NEXT
        for engine in ["BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "CYCLES"]:
            try:
                scene.render.engine = engine
                break
            except Exception:
                pass

    if scene.render.engine == "CYCLES":
        scene.cycles.samples = 64
        scene.cycles.device = "CPU"

    print(f"Rendering contextual image to {RENDER_OUT}...")
    bpy.ops.render.render(write_still=True)
    print(f"Render complete: {RENDER_OUT}")

    # 7. Save updated mainfile
    print(f"Saving updated {TARGET_BLEND}...")
    bpy.ops.wm.save_mainfile()
    print("Successfully replaced PCCRC building and saved mainfile.")

if __name__ == "__main__":
    main()
