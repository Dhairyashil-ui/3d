import bpy
import math
from pathlib import Path

WORKSPACE = Path(r"c:\Users\Dhairyashil\website")
BLEND_FINAL = WORKSPACE / "final_full_building.blend"
RENDER_ISO = WORKSPACE / "final_building_isometric.png"
RENDER_A119 = WORKSPACE / "final_room_A119_detail.png"

bpy.ops.wm.open_mainfile(filepath=str(BLEND_FINAL))
scene = bpy.context.scene

# 1. Higher overall isometric beauty camera
# (already rendered and verified)

# 2. Close-up view of Room A-119 (Right Gallery, Floor 1, z=4.0m)
# A-119 is on corridor partition wall at X = 11.45, Y = 8.8, facing -X into the corridor
cam_door_data = bpy.data.cameras.new("Cam_Door_A119")
cam_door_data.lens = 20
cam_door_data.clip_end = 100
cam_door = bpy.data.objects.new("Cam_Door_A119", cam_door_data)
cam_door.location = (7.5, 8.8, 5.8)  # standing in the gallery corridor looking directly at Room A-119 door
cam_door.rotation_euler = (math.radians(82.0), 0.0, math.radians(-90.0))
scene.collection.objects.link(cam_door)

# Add spotlight onto the door A-119 placard and entrance
spot_data = bpy.data.lights.new("Spot_A119", type="SPOT")
spot_data.energy = 900.0
spot_data.spot_size = math.radians(75.0)
spot_data.color = (1.0, 0.98, 0.95)
spot_obj = bpy.data.objects.new("Spot_A119", spot_data)
spot_obj.location = (8.0, 8.8, 7.2)
spot_obj.rotation_euler = (math.radians(20.0), 0.0, math.radians(-90.0))
scene.collection.objects.link(spot_obj)

scene.camera = cam_door
scene.render.filepath = str(RENDER_A119)
print("Rendering close-up of Room A-119...")
bpy.ops.render.render(write_still=True)
print("Rendered Room A-119 close-up successfully!")
