import re
import os

with open("institutional_reconstruction.py", "r", encoding="utf-8") as f:
    code = f.read()

from generate_atrium_code import generate_atrium_code
new_atrium = generate_atrium_code()

# 1. Update Material Colors to authentic rich wood and architectural plaster tones
old_materials_pattern = re.compile(r'# Authentic Clean Architectural Color Palette.*?mat_skirting_granite = simple_mat\("Dark granite skirting", \(\.20, \.21, \.22\), \.20\)', re.DOTALL)

new_materials = """# Authentic Clean Architectural Color Palette
cream = aged_mat("Warm beige plaster", (.78, .74, .64), strength=.06, bump_distance=.015)
pink = aged_mat("Peach sandstone cladding", (.66, .48, .38), strength=.08, bump_distance=.015)
trim = aged_mat("Warm cream cornice finish", (.82, .78, .70), strength=.04)
concrete = aged_mat("Light architectural concrete", (.68, .68, .66), strength=.08, bump_distance=.015)
panel = aged_mat("Inset ochre aggregate panels", (.52, .38, .22), strength=.12, bump_distance=.03)
white = aged_mat("Warm off-white interior plaster", (.80, .79, .76), strength=.03)
red = aged_mat("Terracotta red stair stone", (.55, .18, .12), strength=.08)
stone = aged_mat("Cream stair and paving stone", (.72, .69, .60), strength=.06)
asphalt = aged_mat("Forecourt paving", (.22, .23, .22), strength=.20, bump_distance=.03)
soil = aged_mat("Compacted soil", (.16, .12, .08), strength=.25)
moss = aged_mat("Landscaping greenery", (.18, .25, .12), strength=.25)
tile = aged_mat("Speckled terrazzo floor", (.52, .54, .53), roughness=.22, strength=.12, bump_distance=.006)
grout = simple_mat("Tile joints", (.35, .36, .35))
metal = simple_mat("Brushed stainless steel", (.75, .76, .78), .18, .92)
railmat = simple_mat("Stainless steel railing", (.75, .76, .78), .18, .92)
dark = simple_mat("Unlit recess and vent interiors", (.025, .03, .029))
rubber = simple_mat("Black glazing seals", (.018, .021, .022), .9)
rust = aged_mat("Oxidized brackets", (.30, .15, .08), strength=.25)
fire_red = aged_mat("Fire equipment paint", (.78, .09, .07))
door_mat = simple_mat("Warm wood door leaf", (.55, .38, .24), .35)
leafmat = aged_mat("Landscaping planting", (.15, .28, .10), strength=.20)

# Dedicated Photo-Accurate Door & Placard Materials (Matching Room A - 119)
mat_wood_surround = simple_mat("Light beech portal surround", (.58, .40, .26), .38)
mat_wood_leaf = simple_mat("Warm wood door leaf", (.55, .38, .24), .35)
mat_placard_plate = simple_mat("Sign plate white", (.92, .92, .90), .20)
mat_placard_text = simple_mat("Placard dark text", (.04, .04, .04), .80)
mat_vision_glass = simple_mat("Door vision glass", (.14, .20, .22), .06)
bs_vg = mat_vision_glass.node_tree.nodes.get("Principled BSDF")
if bs_vg and "Transmission Weight" in bs_vg.inputs:
    bs_vg.inputs["Transmission Weight"].default_value = .85
elif bs_vg and "Transmission" in bs_vg.inputs:
    bs_vg.inputs["Transmission"].default_value = .85
mat_alarm_red = simple_mat("Fire alarm call point red", (.78, .06, .05), .30)
mat_skirting_granite = simple_mat("Dark granite skirting", (.18, .19, .20), .20)"""

code, count = old_materials_pattern.subn(new_materials, code)
print(f"Replaced materials section: {count} matches")

# 2. Replace 06_Atrium and 07_Roof up to roof service structures
atrium_pattern = re.compile(r'# -+\s*# AUTHENTIC PCCRC ATRIUM INTERIOR.*?# Rooftop service structures are low', re.DOTALL)
replacement_text = new_atrium + '\n# Rooftop service structures are low'

code, count = atrium_pattern.subn(replacement_text, code)
print(f"Replaced atrium section: {count} matches")

# 3. Update lighting & camera setup for A-119
old_lighting_cam_pattern = re.compile(r'area\("Atrium interior warm fill".*?scene\.camera=front', re.DOTALL)

new_lighting_cam = """area("Atrium interior warm fill", (0, 12.6, 16.0), 3200, 18, (1.0, 0.98, 0.94), (0, 12.6, 0))
# Balanced corridor fill preventing washed-out wood
area("Corridor door A119 soft fill", (9.6, 8.0, 2.6), 180, 4.0, (1.0, 0.96, 0.90), (11.45, 7.4, 1.5))
area("Corridor door A119 ambient bounce", (10.0, 6.2, 1.8), 120, 4.0, (1.0, 0.98, 0.95), (11.45, 7.4, 1.5))

# Soft sun for subtle architectural shadows.
sun_data=bpy.data.lights.new("Diffuse daylight direction","SUN")
sun_data.energy=.75
sun_data.angle=math.radians(22)
sun=bpy.data.objects.new("Diffuse daylight direction",sun_data)
ACTIVE.objects.link(sun)
sun.rotation_euler=(math.radians(24),math.radians(-22),math.radians(-30))

def camera(name,location,target,lens):
    data=bpy.data.cameras.new(name)
    obj=bpy.data.objects.new(name,data)
    ACTIVE.objects.link(obj)
    obj.location=location
    obj.rotation_euler=(Vector(target)-Vector(location)).to_track_quat("-Z","Y").to_euler()
    data.lens=lens
    data.sensor_width=36
    data.clip_start=.08
    data.clip_end=500
    return obj

# Low upward angle follows the photograph's visual logic.
front=camera("01_Reference_guided_low_front",
             (3.4,-33.0,1.65),(0,.2,11.45),25.0)
camera("02_Full_building_three_quarter",
       (43,-46,23),(0,9,10),36)
camera("03_Inferred_rear",
       (-39,58,21),(0,13,10),39)

# Atrium Interior Upward Camera (Shows 5 tiers, lift, skylight)
atrium_cam_data = bpy.data.cameras.new("04_Atrium_interior")
atrium_cam_data.lens = 13.0
atrium_cam_data.clip_start = 0.05
atrium_cam_data.clip_end = 500.0
atrium_cam = bpy.data.objects.new("04_Atrium_interior", atrium_cam_data)
ACTIVE.objects.link(atrium_cam)
atrium_cam.location = (0.1, 12.6 - 5.5, 1.65)
atrium_cam.rotation_euler = (2.2706, 0.0, 0.0074)

camera("05_Roof_and_skylight",
       (31,-18,43),(0,12,14),38)

# Dedicated Photo-Accurate Door A-119 Closeup Camera (Handheld reference framing)
a119_cam_data = bpy.data.cameras.new("06_Door_A119_Closeup")
a119_cam_data.lens = 22.0
a119_cam_data.clip_start = 0.05
a119_cam_data.clip_end = 150.0
a119_cam = bpy.data.objects.new("06_Door_A119_Closeup", a119_cam_data)
ACTIVE.objects.link(a119_cam)
# Located in corridor looking across at Room A-119 matching reference photograph angle & perspective
a119_cam.location = (8.90, 8.85, 1.15)
target_a119 = Vector((11.45, 7.30, 1.62))
direction_a119 = target_a119 - a119_cam.location
rot_euler = direction_a119.to_track_quat("-Z", "Y").to_euler()
rot_euler.y -= math.radians(11.0)  # Dynamic handheld tilt matching photograph
a119_cam.rotation_euler = rot_euler

scene.camera=front"""

code, count = old_lighting_cam_pattern.subn(new_lighting_cam, code)
print(f"Replaced lighting/cam section: {count} matches")

# 4. Set neutral exposure
code = code.replace('scene.view_settings.exposure=.35', 'scene.view_settings.exposure=0.0')

with open("institutional_reconstruction.py", "w", encoding="utf-8") as f:
    f.write(code)

print("Finished updating institutional_reconstruction.py!")
