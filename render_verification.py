import bpy
import math
import mathutils

BLEND_FILE = r"c:\Users\Dhairyashil\website\Innerviewpccrc.blend"
bpy.ops.wm.open_mainfile(filepath=BLEND_FILE)
scene = bpy.context.scene

# Configure EEVEE for high quality fast renders
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1280
scene.render.resolution_y = 720

# 1. RENDER EXTERIOR VIEW (Using 'Low angle facade camera' from reconstruction)
cam_ext = bpy.data.objects.get("Low angle facade camera")
if cam_ext:
    scene.camera = cam_ext
    scene.render.filepath = r"c:\Users\Dhairyashil\website\final_facade_exterior_view.png"
    print("Rendering final exterior view...")
    bpy.ops.render.render(write_still=True)
    print("Exterior view saved!")

# 2. RENDER ATRIUM INTERIOR VIEW (Using 'Reference-style upward atrium view')
cam_int = bpy.data.objects.get("Reference-style upward atrium view")
if cam_int:
    scene.camera = cam_int
    scene.render.filepath = r"c:\Users\Dhairyashil\website\final_atrium_interior_view.png"
    print("Rendering final interior view...")
    bpy.ops.render.render(write_still=True)
    print("Interior view saved!")

# 3. RENDER COMBINED PERSPECTIVE VIEW (Front 3/4 showing entrance looking into the building)
cam_front_data = bpy.data.cameras.new("Cam_Front_Three_Quarter")
cam_front_data.lens = 32
cam_front = bpy.data.objects.new("Cam_Front_Three_Quarter", cam_front_data)
cam_front.location = (20.0, -38.0, 10.0)
target = mathutils.Vector((0.0, -12.0, 6.0))
direction = target - cam_front.location
cam_front.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
scene.collection.objects.link(cam_front)

scene.camera = cam_front
scene.render.filepath = r"c:\Users\Dhairyashil\website\final_combined_perspective_view.png"
print("Rendering combined 3/4 perspective view...")
bpy.ops.render.render(write_still=True)
print("Combined 3/4 perspective view saved!")
