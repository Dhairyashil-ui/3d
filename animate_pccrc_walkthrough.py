"""
Animate a realistic human-eye-level walking camera in Blender from
Hinjawadi Phase 1 roads through the forecourt, up the steps, and
into the PCCRC building and its 5-tier interior atrium.

Exports the animated camera to FBX for UE5 Level Sequence import and
renders 5 keyframe verification stills.
"""

import math
from pathlib import Path
import bpy
import mathutils

WORKSPACE = Path(r"c:\Users\Dhairyashil\website")
BLEND_FILE = WORKSPACE / "hinjawadi_output" / "hinjawadi_offices_refined.blend"
OUTPUT_DIR = WORKSPACE / "hinjawadi_output"
CAMERA_FBX = WORKSPACE / "HinjawadiTwin" / "Content" / "CityData" / "fbx" / "Hinjawadi_Walkthrough_Camera.fbx"

def point_camera_at(cam_obj, target_pos):
    """Calculate Euler rotation for camera to point at target."""
    loc = cam_obj.location
    direction = mathutils.Vector(target_pos) - loc
    rot_quat = direction.to_track_quat("-Z", "Y")
    return rot_quat.to_euler()

def main():
    print(f"Loading {BLEND_FILE}...")
    bpy.ops.wm.open_mainfile(filepath=str(BLEND_FILE))
    scene = bpy.context.scene

    # 1. Setup Camera Object
    cam_name = "PCCRC_Walkthrough_Camera"
    cam_obj = bpy.data.objects.get(cam_name)
    if cam_obj:
        bpy.data.objects.remove(cam_obj, do_unlink=True)

    cam_data = bpy.data.cameras.new(cam_name)
    cam_data.lens = 28.0  # Human perspective FOV (approx. 65 deg horizontal)
    cam_data.clip_start = 0.1
    cam_data.clip_end = 2500.0

    cam_obj = bpy.data.objects.new(cam_name, cam_data)
    scene.collection.objects.link(cam_obj)
    scene.camera = cam_obj

    # 2. Keyframed Walking Route
    # Waypoints: (frame, location [x, y, z], look_target [x, y, z])
    # Coordinate system: ENU meters. PCCRC center is (-82.33, -769.22, 0.0)
    # Front entrance is around Y = -763.5, atrium center is around Y = -755.2
    waypoints = [
        # 1. Road Approach on Hinjawadi Phase 1 / I2IT Road
        (1, (-140.0, -740.0, 1.65), (-110.0, -755.0, 1.65)),
        (120, (-115.0, -752.0, 1.65), (-85.0, -765.0, 1.65)),
        # 2. Campus Gate & Forecourt Plaza (Looking at monumental facade)
        (250, (-95.0, -762.0, 1.65), (-82.33, -769.22, 12.0)),
        (350, (-88.0, -768.0, 1.65), (-82.33, -769.22, 8.0)),
        # 3. Base of Monumental Steps & Portico
        (480, (-82.33, -771.5, 1.65), (-82.33, -763.5, 2.5)),
        (550, (-82.33, -769.0, 1.95), (-82.33, -763.5, 2.2)),
        # 4. Under Portico Canopy & Passing Entrance Glazed Doors
        (650, (-82.33, -765.5, 1.95), (-82.33, -758.0, 2.0)),
        (750, (-82.33, -762.0, 1.95), (-82.33, -755.0, 1.8)),
        # 5. Entering Grand 5-Story Central Atrium Core
        (880, (-82.33, -757.5, 1.65), (-82.33, -753.0, 0.8)),
        # 6. Standing Over Marble Floor Inlays & Gazing Up at Galleries & Dome
        (1020, (-82.33, -754.0, 1.65), (-82.33, -754.0, 26.0)),
        (1150, (-82.33, -753.5, 1.65), (-82.33, -748.0, 16.0)),
        # 7. Exploring Panoramic Glass Elevator & Corridor
        (1280, (-82.33, -750.5, 1.65), (-82.33, -744.0, 2.0)),
        # 8. Approaching Departmental Rooms A-111 to A-119
        (1400, (-76.0, -749.0, 1.65), (-70.0, -749.0, 1.65)),
        (1500, (-72.0, -749.0, 1.65), (-72.0, -745.0, 1.65))
    ]

    scene.frame_start = 1
    scene.frame_end = 1500

    cam_obj.animation_data_clear()
    cam_obj.animation_data_create()

    for frame, loc, look in waypoints:
        cam_obj.location = mathutils.Vector(loc)
        cam_obj.rotation_euler = point_camera_at(cam_obj, look)
        cam_obj.keyframe_insert(data_path="location", frame=frame)
        cam_obj.keyframe_insert(data_path="rotation_euler", frame=frame)

    # Smooth curve interpolation (Bézier is default in Blender)
    try:
        if cam_obj.animation_data and cam_obj.animation_data.action:
            action = cam_obj.animation_data.action
            if hasattr(action, "fcurves"):
                for fcurve in action.fcurves:
                    for kf in fcurve.keyframe_points:
                        kf.interpolation = "BEZIER"
    except Exception as e:
        print(f"Note on curve interpolation: {e}")

    print("Created smooth Bézier walking camera animation (1500 frames).")

    # 3. Export Camera to FBX for UE5 Level Sequence
    CAMERA_FBX.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    cam_obj.select_set(True)
    bpy.context.view_layer.objects.active = cam_obj

    bpy.ops.export_scene.fbx(
        filepath=str(CAMERA_FBX),
        use_selection=True,
        object_types={"CAMERA"},
        global_scale=1.0,
        apply_unit_scale=True,
        apply_scale_options="FBX_SCALE_UNITS",
        axis_forward="-Y",
        axis_up="Z",
        bake_anim=True,
        bake_anim_use_nla_strips=False,
        bake_anim_use_all_actions=False,
        bake_anim_step=1.0,
        bake_anim_simplify_factor=0.0
    )
    print(f"Exported camera FBX to: {CAMERA_FBX}")

    # Copy to output directory as well
    cam_fbx_out = OUTPUT_DIR / "ue5_fbx" / "Hinjawadi_Walkthrough_Camera.fbx"
    import shutil
    shutil.copy2(CAMERA_FBX, cam_fbx_out)

    # 4. Render 5 Milestone Stills along the Walking Route
    milestones = [
        (1, "walk_01_road_approach.png", "Hinjawadi Phase 1 Road Approach towards PCCRC"),
        (350, "walk_02_portico_facade.png", "PCCRC Campus Forecourt & Monumental Facade"),
        (550, "walk_03_steps_and_doors.png", "Ascending Entrance Steps beneath Portico Canopy"),
        (880, "walk_04_atrium_inlays.png", "Entering Grand Central Atrium & Polished Stone Inlays"),
        (1050, "walk_05_atrium_galleries_and_skylight.png", "Looking Up at 5-Tier Galleries, Glass Elevator & Dome")
    ]

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

    for frame, filename, desc in milestones:
        scene.frame_set(frame)
        out_path = OUTPUT_DIR / filename
        scene.render.filepath = str(out_path)
        print(f"Rendering Milestone [{frame}]: {desc} -> {filename}...")
        bpy.ops.render.render(write_still=True)
        print(f"Saved: {out_path}")

    # 5. Save blend file with animated camera
    bpy.ops.wm.save_mainfile()
    print("Saved updated mainfile with animated walkthrough camera.")

if __name__ == "__main__":
    main()
