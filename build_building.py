import bpy
import math
import os
from mathutils import Vector

# ------------------------------------------------------------
# Clear scene
# ------------------------------------------------------------

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

for datablocks in (
    bpy.data.meshes,
    bpy.data.curves,
    bpy.data.materials,
    bpy.data.cameras,
    bpy.data.lights,
):
    pass

# ------------------------------------------------------------
# Materials
# ------------------------------------------------------------

def material(name, color, roughness=0.65, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True

    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if not bsdf:
        bsdf = mat.node_tree.nodes.new(type="ShaderNodeBsdfPrincipled")

    if "Base Color" in bsdf.inputs:
        bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    if "Roughness" in bsdf.inputs:
        bsdf.inputs["Roughness"].default_value = roughness
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = metallic

    return mat

stone = material("Warm beige stone", (0.58, 0.39, 0.24), 0.8)
stone_light = material("Light facade", (0.72, 0.55, 0.38), 0.82)
dark_stone = material("Decorative stone", (0.25, 0.13, 0.08), 0.9)
glass = material("Blue grey glass", (0.035, 0.12, 0.18), 0.2)
metal = material("Dark metal", (0.04, 0.045, 0.04), 0.35, 0.5)
floor_mat = material("Ground", (0.16, 0.14, 0.12), 0.95)
roof_mat = material("Roof", (0.22, 0.16, 0.11), 0.9)

# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------

def cube(name, location, scale, mat=None, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    if bevel > 0:
        modifier = obj.modifiers.new("Soft edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2

    if mat:
        obj.data.materials.append(mat)

    return obj

def cylinder(name, location, radius, depth, mat=None, vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location
    )
    obj = bpy.context.object
    obj.name = name

    if mat:
        obj.data.materials.append(mat)

    return obj

def window(name, x, y, z, width, height, depth=0.16):
    frame = cube(
        name + "_frame",
        (x, y, z),
        (width, depth, height),
        stone_light,
        bevel=0.03
    )
    pane = cube(
        name + "_glass",
        (x, y - depth * 0.55, z),
        (width * 0.82, 0.025, height * 0.78),
        glass,
        bevel=0.015
    )

    # Window mullions
    cube(name + "_vertical_mullion", (x, y - depth * 0.58, z),
         (0.035, 0.035, height * 0.78), metal)
    cube(name + "_horizontal_mullion", (x, y - depth * 0.58, z),
         (width * 0.82, 0.035, 0.035), metal)

def balcony(name, x, y, z, width, depth):
    slab = cube(name + "_slab", (x, y, z), (width, depth, 0.38), stone_light)

    # Front railing
    rail_y = y - depth / 2
    cube(name + "_top_rail", (x, rail_y, z + 1.05),
         (width, 0.08, 0.08), metal)

    for px in [-width / 2, -width / 4, 0, width / 4, width / 2]:
        cube(name + "_rail", (x + px, rail_y, z + 0.55),
             (0.045, 0.045, 1.0), metal)

def column(name, x, y, z, height, radius=0.42):
    cylinder(name, (x, y, z + height / 2), radius, height, stone_light, 32)
    cylinder(name + "_base", (x, y, z + 0.12), radius * 1.25, 0.24,
             dark_stone, 32)
    cylinder(name + "_capital", (x, y, z + height - 0.12),
             radius * 1.2, 0.24, dark_stone, 32)

def arch_opening(name, x, y, z, width, height, depth):
    # Approximate arch made from vertical sides and curved top blocks
    side_w = 0.42
    cube(name + "_left", (x - width / 2, y, z + height / 2),
         (side_w, depth, height), stone_light)
    cube(name + "_right", (x + width / 2, y, z + height / 2),
         (side_w, depth, height), stone_light)

    bpy.ops.mesh.primitive_torus_add(
        major_radius=width / 2,
        minor_radius=side_w / 2,
        major_segments=32,
        minor_segments=8,
        location=(x, y, z + height)
    )
    ring = bpy.context.object
    ring.name = name + "_arch"
    ring.scale.y = depth / side_w
    ring.data.materials.append(stone_light)

# ------------------------------------------------------------
# Dimensions
# ------------------------------------------------------------

W = 38.0
D = 24.0
FLOOR_H = 4.0
FLOORS = 6
TOTAL_H = FLOOR_H * FLOORS

front_y = -D / 2
back_y = D / 2

# ------------------------------------------------------------
# Ground
# ------------------------------------------------------------

cube("Ground", (0, 0, -0.35), (80, 70, 0.7), floor_mat)

# Front approach
cube("Entrance pavement", (0, -20, 0.02), (34, 20, 0.15), floor_mat)

# ------------------------------------------------------------
# Main building masses
# ------------------------------------------------------------

# Side wings
cube("Left building wing", (-13.5, 0, TOTAL_H / 2),
     (11.0, D, TOTAL_H), stone_light)

cube("Right building wing", (13.5, 0, TOTAL_H / 2),
     (11.0, D, TOTAL_H), stone_light)

# Rear block around atrium
cube("Rear building block", (0, 8.0, TOTAL_H / 2),
     (16.0, 8.0, TOTAL_H), stone_light)

# Central front tower
cube("Central front mass", (0, -7.0, 17.5),
     (17.0, 8.0, 13.0), stone_light)

# Central entrance recess
cube("Entrance recess", (0, -11.2, 5.2),
     (13.0, 3.0, 9.0), stone)

# ------------------------------------------------------------
# Floors and atrium balconies
# ------------------------------------------------------------

for floor in range(1, FLOORS):
    z = floor * FLOOR_H

    # Visible side bands
    cube("Left floor band", (-13.5, -12.15, z),
         (11.0, 0.35, 0.30), dark_stone)
    cube("Right floor band", (13.5, -12.15, z),  
         (11.0, 0.35, 0.30), dark_stone)

    # Atrium balcony decks
    if floor >= 1:
        cube("Atrium left balcony", (-7.0, 0.0, z),
             (3.8, 15.0, 0.30), stone_light)
        cube("Atrium right balcony", (7.0, 0.0, z),
             (3.8, 15.0, 0.30), stone_light)

        # Railings
        for side in (-1, 1):
            x = side * 5.1
            cube("Atrium railing top", (x, -1.8, z + 1.0),
                 (0.08, 11.0, 0.08), metal)

            for yy in [-6.5, -4.0, -1.5, 1.0, 3.5, 6.0]:
                cube("Atrium railing post", (x, yy, z + 0.5),
                     (0.06, 0.06, 1.0), metal)

# ------------------------------------------------------------
# Front windows
# ------------------------------------------------------------

for floor in range(1, FLOORS):
    z = floor * FLOOR_H + 1.9

    # Left wing windows
    for x in [-17.0, -14.0, -10.5]:
        window("Front left window", x, front_y - 0.2, z, 2.2, 2.45)

    # Right wing windows
    for x in [10.5, 14.0, 17.0]:
        window("Front right window", x, front_y - 0.2, z, 2.2, 2.45)

    # Central windows
    if floor != 2:
        for x in [-4.2, 4.2]:
            window("Central window", x, -11.25, z, 2.8, 2.5)

# Large central top windows
for x in [-5.0, -1.7, 1.7, 5.0]:
    window("Top central window", x, -11.25, 22.0, 2.4, 2.5)

# Side facade windows
for floor in range(1, FLOORS):
    z = floor * FLOOR_H + 1.9

    for y in [-8, -3, 2, 7]:
        window("Left side window", -19.05, y, z, 2.3, 2.4, 0.16)
        window("Right side window", 19.05, y, z, 2.3, 2.4, 0.16)

# ------------------------------------------------------------
# Columns and entrance
# ------------------------------------------------------------

for x in [-8.0, -4.0, 4.0, 8.0]:
    column("Entrance column", x, -12.6, 0, 12.0, 0.45)

# Entrance canopy
cube("Entrance canopy", (0, -15.0, 11.7), (24.0, 7.0, 0.65),
     stone_light, bevel=0.08)

for x in [-9.5, -3.2, 3.2, 9.5]:
    column("Canopy column", x, -16.3, 0, 11.2, 0.38)

# Main entrance doors
for x in [-3.0, 0.0, 3.0]:
    cube("Entrance door", (x, -13.05, 3.1), (2.5, 0.15, 4.0),
         glass, bevel=0.03)

# Stairs
for step in range(7):
    cube(
        "Entrance step",
        (0, -13.3 - step * 0.55, step * 0.22),
        (18.0 - step * 0.5, 0.55, 0.22),
        stone_light
    )

# Side arches
arch_opening("Left arch", -15.0, -12.3, 0.2, 4.5, 5.2, 0.6)
arch_opening("Right arch", 15.0, -12.3, 0.2, 4.5, 5.2, 0.6)

# ------------------------------------------------------------
# Decorative facade elements
# ------------------------------------------------------------

for x in [-15.5, -11.5, 11.5, 15.5]:
    cube("Decorative horizontal trim", (x, -12.45, 19.2),
         (3.0, 0.35, 0.35), dark_stone)

for x in range(-16, 17, 3):
    cube("Top decorative square", (x, -12.5, 23.5),
         (0.65, 0.20, 0.65), dark_stone)

# Roof parapet
cube("Roof parapet front", (0, -11.6, 24.4), (38.0, 0.6, 1.0), stone_light)
cube("Roof parapet rear", (0, 11.6, 24.4), (38.0, 0.6, 1.0), stone_light)
cube("Roof parapet left", (-18.7, 0, 24.4), (0.6, 23.0, 1.0), stone_light)
cube("Roof parapet right", (18.7, 0, 24.4), (0.6, 23.0, 1.0), stone_light)

# ------------------------------------------------------------
# Atrium skylight
# ------------------------------------------------------------

bpy.ops.mesh.primitive_cylinder_add(
    vertices=48,
    radius=5.0,
    depth=0.25,
    location=(0, 0, 25.0)
)
skylight = bpy.context.object
skylight.name = "Circular atrium skylight"
skylight.data.materials.append(glass)

# Radial skylight ribs
for i in range(16):
    angle = math.radians(i * 360 / 16)
    x = math.cos(angle) * 2.5
    y = math.sin(angle) * 2.5

    rib = cube(
        "Skylight rib",
        (x, y, 25.15),
        (0.08, 5.0, 0.12),
        metal
    )
    rib.rotation_euler[2] = angle

# ------------------------------------------------------------
# Basic environment
# ------------------------------------------------------------

bpy.ops.object.light_add(
    type='AREA',
    location=(0, -28, 30)
)
key = bpy.context.object
key.name = "Front softbox"
key.data.energy = 1800
key.data.shape = 'RECTANGLE'
key.data.size = 25
key.rotation_euler = (math.radians(35), 0, 0)

bpy.ops.object.light_add(
    type='AREA',
    location=(0, 4, 28)
)
fill = bpy.context.object
fill.name = "Atrium light"
fill.data.energy = 1200
fill.data.size = 18

# Camera
bpy.ops.object.camera_add(
    location=(42, -48, 27),
    rotation=(math.radians(67), 0, math.radians(40))
)
camera = bpy.context.object
camera.name = "Exterior camera"
bpy.context.scene.camera = camera

def point_camera(cam, target):
    direction = Vector(target) - cam.location
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

point_camera(camera, (0, 0, 11))

# ------------------------------------------------------------
# Scene settings
# ------------------------------------------------------------

scene = bpy.context.scene
# Try BLENDER_EEVEE first (standard in Blender 4.2+ / 5.x), fall back if needed
for engine_candidate in ('BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT', 'CYCLES', 'BLENDER_WORKBENCH'):
    try:
        scene.render.engine = engine_candidate
        break
    except TypeError:
        continue

scene.render.resolution_x = 1000
scene.render.resolution_y = 800
scene.render.resolution_percentage = 100

if scene.world:
    scene.world.color = (0.08, 0.10, 0.14)

# Organize objects
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH':
        if "window" in obj.name.lower() or "glass" in obj.name.lower():
            obj.color = (0.1, 0.2, 0.3, 1.0)

# ------------------------------------------------------------
# Save file to home directory and current workspace
# ------------------------------------------------------------

output_home = os.path.expanduser("~/building_approximation.blend")
bpy.ops.wm.save_as_mainfile(filepath=output_home)
print(f"Saved Blender model to: {output_home}")

# Also save to current directory for convenience
current_dir_output = os.path.abspath("building_approximation.blend")
if os.path.abspath(output_home) != current_dir_output:
    bpy.ops.wm.save_as_mainfile(filepath=current_dir_output)
    print(f"Also saved Blender model to workspace: {current_dir_output}")

# Export GLTF/GLB for web viewing
glb_output = os.path.abspath("building_approximation.glb")
try:
    bpy.ops.export_scene.gltf(filepath=glb_output, export_format='GLB')
    print(f"Exported GLB model to: {glb_output}")
except Exception as e:
    print(f"GLB export note: {e}")

# Render a still image preview
preview_output = os.path.abspath("building_approximation_preview.png")
try:
    scene.render.filepath = preview_output
    bpy.ops.render.render(write_still=True)
    print(f"Rendered preview image to: {preview_output}")
except Exception as e:
    print(f"Render note: {e}")
