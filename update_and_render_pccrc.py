"""
Clean replacement and architectural rendering of PCCRC building in Hinjawadi city model.
"""

import math
from pathlib import Path
import bpy
import mathutils

WORKSPACE = Path(r"C:\Users\Dhairyashil\website")
TARGET_BLEND = WORKSPACE / "hinjawadi_output" / "hinjawadi_offices_refined.blend"
RENDER_FRONT = WORKSPACE / "hinjawadi_output" / "pccrc_in_hinjawadi_front.png"
RENDER_AERIAL = WORKSPACE / "hinjawadi_output" / "pccrc_in_hinjawadi_aerial.png"

def main():
    print(f"Loading {TARGET_BLEND}...")
    bpy.ops.wm.open_mainfile(filepath=str(TARGET_BLEND))
    scene = bpy.context.scene

    # 1. Archive ALL old procedural objects matching 359685492
    archive_col = bpy.data.collections.get("Archived_Procedural_PCCRC")
    if not archive_col:
        archive_col = bpy.data.collections.new("Archived_Procedural_PCCRC")
        scene.collection.children.link(archive_col)
    archive_col.hide_viewport = True
    archive_col.hide_render = True

    for obj in list(bpy.data.objects):
        if "359685492" in obj.name:
            for c in list(obj.users_collection):
                c.objects.unlink(obj)
            archive_col.objects.link(obj)
            obj.hide_viewport = True
            obj.hide_render = True
            print(f"Archived procedural object: {obj.name}")

    # 2. Verify cameras
    cam_front = bpy.data.objects.get("PCCRC_Front_Cam")
    cam_aerial = bpy.data.objects.get("PCCRC_Aerial_Cam")

    # Render settings
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"

    for engine in ["BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "CYCLES"]:
        try:
            scene.render.engine = engine
            break
        except Exception:
            pass

    # Render Front Perspective View
    print("Re-rendering front perspective view without old roof slab...")
    scene.camera = cam_front
    scene.render.filepath = str(RENDER_FRONT)
    bpy.ops.render.render(write_still=True)
    print(f"Saved: {RENDER_FRONT}")

    # Render Aerial Three-Quarter View
    print("Re-rendering aerial view showing authentic dome & atrium roof...")
    scene.camera = cam_aerial
    scene.render.filepath = str(RENDER_AERIAL)
    bpy.ops.render.render(write_still=True)
    print(f"Saved: {RENDER_AERIAL}")

    # Save blend file
    bpy.ops.wm.save_mainfile()
    print("Saved updated mainfile with clean roof.")

if __name__ == "__main__":
    main()
