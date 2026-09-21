import bpy
import bmesh
import math
import random
import os
import shutil
from pathlib import Path
from mathutils import Vector, Euler

# ==============================================================================
# FULL PHOTO-ACCURATE COMBINED BUILDING GENERATOR
# Outer Building (Monumental facade, canopy, columns, wings, AC units, grilles)
# + Inner Building (5-tier atrium, inlays, lift, 45 rooms with A-119 door details)
# ==============================================================================

random.seed(42)

# File paths
WORKSPACE = Path(r"c:\Users\Dhairyashil\website")
BLEND_FINAL = WORKSPACE / "final_full_building.blend"
GLB_FINAL = WORKSPACE / "final_full_building.glb"
GLB_PUBLIC = WORKSPACE / "public" / "final_full_building.glb"

# Synchronization targets requested by user
BUILDING_RECON_BLEND = WORKSPACE / "Building_Reconstruction.blend"
BUILDING_RECON_GLB = WORKSPACE / "Building_Reconstruction.glb"
REF_BLEND = WORKSPACE / "reference_building.blend"
REF_GLB = WORKSPACE / "reference_building.glb"
LEFTSIDE_GLB = WORKSPACE / "leftside.glb"

RENDER_EXTERIOR = WORKSPACE / "final_exterior_render.png"
RENDER_ATRIUM = WORKSPACE / "final_atrium_render.png"
RENDER_ROOF = WORKSPACE / "final_roof_view.png"
RENDER_LEFT = WORKSPACE / "final_left_side_view.png"

# Optimization: disable global undo during scripted generation
bpy.context.preferences.edit.use_global_undo = False

# Reset scene
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 1.0

# ------------------------------------------------------------------------------
# COLLECTIONS
# ------------------------------------------------------------------------------
COLLECTION_NAMES = [
    "01_Exterior_Front_Facade",
    "02_Exterior_Portico_and_Columns",
    "03_Exterior_Canopy_and_Steps",
    "04_Exterior_Side_and_Rear_Envelope",
    "05_Exterior_Windows_AC_and_Grilles",
    "06_Interior_Atrium_Ground_and_Inlays",
    "07_Interior_Galleries_and_Railings",
    "08_Interior_Rooms_and_Doors",
    "09_Interior_Panoramic_Lift",
    "10_Roof_and_Skylight",
    "11_Presentation_and_Lighting"
]

collections = {}
for name in COLLECTION_NAMES:
    c = bpy.data.collections.new(name)
    scene.collection.children.link(c)
    collections[name] = c

CURRENT_GROUP = "01_Exterior_Front_Facade"

def set_group(grp):
    global CURRENT_GROUP
    CURRENT_GROUP = grp

def place(obj, name, material=None):
    obj.name = name
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    collections[CURRENT_GROUP].objects.link(obj)
    if material:
        obj.data.materials.append(material)
    return obj

# ------------------------------------------------------------------------------
# MESH GENERATORS (PyData)
# ------------------------------------------------------------------------------
def make_cube_mesh(dimensions):
    dx, dy, dz = dimensions[0] / 2.0, dimensions[1] / 2.0, dimensions[2] / 2.0
    verts = [
        (-dx, -dy, -dz), (dx, -dy, -dz), (dx, dy, -dz), (-dx, dy, -dz),
        (-dx, -dy,  dz), (dx, -dy,  dz), (dx, dy,  dz), (-dx, dy,  dz)
    ]
    faces = [
        (0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1),
        (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)
    ]
    mesh = bpy.data.meshes.new("BoxMesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    return mesh

def box(name, loc, size, mat, bevel=0.015, rot_z=0.0):
    mesh = make_cube_mesh(size)
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    if rot_z != 0.0:
        obj.rotation_euler.z = rot_z
    place(obj, name, mat)
    if bevel > 0:
        mod = obj.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    return obj

def make_cylinder_mesh(radius, depth, segs=24):
    verts = []
    half_d = depth / 2.0
    for i in range(segs):
        angle = 2 * math.pi * i / segs
        verts.append((radius * math.cos(angle), radius * math.sin(angle), -half_d))
    for i in range(segs):
        angle = 2 * math.pi * i / segs
        verts.append((radius * math.cos(angle), radius * math.sin(angle), half_d))
    verts.append((0, 0, -half_d))
    verts.append((0, 0, half_d))
    bot_center = 2 * segs
    top_center = 2 * segs + 1
    faces = []
    for i in range(segs):
        ni = (i + 1) % segs
        faces.append((i, ni, ni + segs, i + segs))
        faces.append((bot_center, ni, i))
        faces.append((top_center, i + segs, ni + segs))
    mesh = bpy.data.meshes.new("CylinderMesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    return mesh

def cylinder(name, loc, radius, depth, mat, bevel=0.012, segs=24):
    mesh = make_cylinder_mesh(radius, depth, segs)
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    place(obj, name, mat)
    for p in obj.data.polygons:
        p.use_smooth = abs(p.normal.z) < 0.5
    if bevel > 0:
        mod = obj.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    return obj

def rod(name, a, b, radius, mat, segs=12):
    a, b = Vector(a), Vector(b)
    delta = b - a
    length = delta.length
    if length < 1e-6:
        return None
    mesh = make_cylinder_mesh(radius, length, segs)
    obj = bpy.data.objects.new(name, mesh)
    obj.location = (a + b) / 2.0
    obj.rotation_euler = delta.to_track_quat("Z", "Y").to_euler()
    place(obj, name, mat)
    return obj

def mesh_from_pydata(name, verts, faces, mat):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    place(obj, name, mat)
    return obj

# ------------------------------------------------------------------------------
# PBR MATERIALS SETUP
# ------------------------------------------------------------------------------
def create_material(name, base_color, metallic=0.0, roughness=0.5, transmission=0.0, bump_scale=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    
    if "Base Color" in bsdf.inputs:
        bsdf.inputs["Base Color"].default_value = (*base_color[:3], 1.0)
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = metallic
    if "Roughness" in bsdf.inputs:
        bsdf.inputs["Roughness"].default_value = roughness
    if "Transmission Weight" in bsdf.inputs:
        bsdf.inputs["Transmission Weight"].default_value = transmission
    elif "Transmission" in bsdf.inputs:
        bsdf.inputs["Transmission"].default_value = transmission
    if "IOR" in bsdf.inputs and transmission > 0:
        bsdf.inputs["IOR"].default_value = 1.45

    if bump_scale > 0:
        coord = nt.nodes.new("ShaderNodeTexCoord")
        noise = nt.nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = bump_scale
        noise.inputs["Detail"].default_value = 3.0
        bump = nt.nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = 0.15
        bump.inputs["Distance"].default_value = 0.015
        nt.links.new(coord.outputs["Object"], noise.inputs["Vector"])
        nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
        nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

    return m

# Exterior Materials
mat_facade_cream = create_material("Warm cream aged plaster", (0.74, 0.68, 0.56), 0.0, 0.78, bump_scale=35)
mat_facade_peach = create_material("Muted peach sandstone finish", (0.64, 0.48, 0.35), 0.0, 0.82, bump_scale=40)
mat_cornice_trim = create_material("Light warm cornice finish", (0.78, 0.72, 0.60), 0.0, 0.70, bump_scale=30)
mat_relief_square = create_material("Weathered ornament", (0.54, 0.43, 0.32), 0.0, 0.85)
mat_aluminium = create_material("Dull aluminium window frames", (0.58, 0.60, 0.58), 0.65, 0.35)
mat_rail_dark = create_material("Aged railing metal", (0.28, 0.27, 0.23), 0.70, 0.45)
mat_glazing_green = create_material("Grey green glazing", (0.22, 0.32, 0.30), 0.10, 0.12, transmission=0.45)
mat_dark_recess = create_material("Dark recessed interior", (0.035, 0.040, 0.038), 0.0, 0.95)
mat_paving_neutral = create_material("Neutral exterior paving", (0.33, 0.32, 0.29), 0.0, 0.90, bump_scale=50)

# Equipment Materials (from reference_building)
mat_ac_paint = create_material("Weathered AC paint", (0.68, 0.68, 0.62), 0.1, 0.55, bump_scale=60)
mat_grille_metal = create_material("Painted security grilles", (0.42, 0.44, 0.42), 0.5, 0.45)
mat_curtains = [
    create_material("Curtain cream", (0.68, 0.63, 0.52), 0.0, 0.85),
    create_material("Curtain muted green", (0.32, 0.39, 0.34), 0.0, 0.85),
    create_material("Curtain warm gray", (0.42, 0.40, 0.35), 0.0, 0.85),
]

# Interior Atrium Materials
mat_floor_grey = create_material("Pale grey polished floor", (0.62, 0.65, 0.64), 0.0, 0.18, bump_scale=80)
mat_atrium_white = create_material("Warm white painted concrete", (0.78, 0.79, 0.76), 0.0, 0.65)
mat_balcony_grey = create_material("Grey balcony undersides", (0.32, 0.33, 0.32), 0.0, 0.75)
mat_stone_cream = create_material("Cream stone", (0.74, 0.72, 0.61), 0.0, 0.25)
mat_stone_black = create_material("Black polished stone", (0.04, 0.045, 0.045), 0.0, 0.16)
mat_stone_ochre = create_material("Ochre stone", (0.52, 0.32, 0.14), 0.0, 0.25)
mat_accent_burgundy = create_material("Muted burgundy accents", (0.30, 0.11, 0.14), 0.0, 0.60)
mat_stainless_steel = create_material("Stainless handrails", (0.72, 0.74, 0.75), 0.90, 0.18)
mat_lift_glazing = create_material("Lift glazing", (0.65, 0.78, 0.76), 0.05, 0.10, transmission=0.90)
mat_plant_leaf = create_material("Dark green foliage", (0.06, 0.18, 0.07), 0.0, 0.60)
mat_pot_soil = create_material("Potting soil", (0.03, 0.02, 0.015), 0.0, 0.95)

# Room Door & Placard Materials (Photo-accurate to A-119)
mat_wood_surround = create_material("Light beech portal surround", (0.84, 0.70, 0.54), 0.0, 0.55)
mat_wood_leaf = create_material("Warm wood door leaf", (0.82, 0.66, 0.50), 0.0, 0.50)
mat_placard_plate = create_material("Sign plate white", (0.93, 0.93, 0.91), 0.05, 0.35)
mat_placard_text = create_material("Placard dark text", (0.04, 0.04, 0.04), 0.0, 0.70)
mat_vision_glass = create_material("Door vision glass", (0.15, 0.22, 0.24), 0.10, 0.10, transmission=0.82)
mat_alarm_red = create_material("Fire alarm call point red", (0.78, 0.09, 0.07), 0.0, 0.40)
mat_skirting_granite = create_material("Dark granite skirting", (0.28, 0.30, 0.30), 0.0, 0.30)
mat_room_interior = create_material("Room interior warm wall", (0.74, 0.72, 0.67), 0.0, 0.80)

# Skylight Glazing
mat_skylight_pearl = create_material("Skylight pearl", (0.84, 0.87, 0.80), 0.08, 0.28, transmission=0.55)

# ==============================================================================
# SECTION 1: EXTERIOR FRONT ELEVATION (from Building_Reconstruction)
# ==============================================================================
print(">>> Building Exterior Front Elevation...")

def wall_with_openings(name, x, y, z, width, height, depth, openings, mat):
    left, right = x - width / 2.0, x + width / 2.0
    bottom, top = z - height / 2.0, z + height / 2.0
    rects = [(a - w/2.0, a + w/2.0, b - h/2.0, b + h/2.0) for a, b, w, h in openings]
    xs = sorted(set([left, right] + [v for r in rects for v in r[:2] if left < v < right]))
    zs = sorted(set([bottom, top] + [v for r in rects for v in r[2:] if bottom < v < top]))
    for i in range(len(xs) - 1):
        for j in range(len(zs) - 1):
            cx = (xs[i] + xs[i+1]) / 2.0
            cz = (zs[j] + zs[j+1]) / 2.0
            if any(a < cx < b and c < cz < d for a, b, c, d in rects):
                continue
            box(f"{name}_sec_{i}_{j}", (cx, y, cz), (xs[i+1] - xs[i], depth, zs[j+1] - zs[j]), mat, 0)

def ext_window(name, x, y, z, width, height, cols=2, rows=3, add_curtain=True, add_grille=False):
    old = CURRENT_GROUP
    set_group("05_Exterior_Windows_AC_and_Grilles")
    
    # Interior dark shadow box
    box(f"{name}_int", (x, y + 0.22, z), (width, 0.05, height), mat_dark_recess, 0)
    
    # Curtain folds
    if add_curtain:
        c_mat = random.choice(mat_curtains)
        folds = max(4, int(width / 0.35))
        for k in range(folds):
            fx = x - width/2.0 + (k + 0.5) * (width / folds)
            box(f"{name}_curt_{k}", (fx, y + 0.16 + (k % 2) * 0.018, z),
                (width / folds * 0.92, 0.02, height * 0.88), c_mat, 0)
    
    # Glazing
    box(f"{name}_glass", (x, y + 0.08, z), (width - 0.08, 0.03, height - 0.08), mat_glazing_green, 0)
    
    # Frames
    for i in range(cols + 1):
        xx = x - width / 2.0 + i * width / cols
        box(f"{name}_vframe_{i}", (xx, y - 0.015, z), (0.065, 0.09, height + 0.08), mat_aluminium, 0.006)
    for j in range(rows + 1):
        zz = z - height / 2.0 + j * height / rows
        box(f"{name}_hframe_{j}", (x, y - 0.02, zz), (width + 0.08, 0.09, 0.06), mat_aluminium, 0.006)
    
    # Sill
    box(f"{name}_sill", (x, y - 0.10, z - height / 2.0 - 0.10), (width + 0.32, 0.38, 0.16), mat_cornice_trim)

    # Security Grilles (lower floors)
    if add_grille:
        for b_idx in range(int(height / 0.35)):
            bz = z - height/2.0 + (b_idx + 1) * 0.35
            rod(f"{name}_grille_h_{b_idx}", (x - width/2.0, y - 0.04, bz), (x + width/2.0, y - 0.04, bz), 0.012, mat_grille_metal)
        for v_idx in range(int(width / 0.25)):
            vx = x - width/2.0 + (v_idx + 1) * 0.25
            rod(f"{name}_grille_v_{v_idx}", (vx, y - 0.04, z - height/2.0), (vx, y - 0.04, z + height/2.0), 0.012, mat_grille_metal)

    set_group(old)

def ext_column(name, x, y, bottom, top, radius=0.25):
    old = CURRENT_GROUP
    set_group("02_Exterior_Portico_and_Columns")
    cylinder(f"{name}_shaft", (x, y, (bottom + top) / 2.0), radius, top - bottom, mat_facade_peach)
    cylinder(f"{name}_base", (x, y, bottom + 0.08), radius * 1.25, 0.16, mat_facade_peach)
    cylinder(f"{name}_capital", (x, y, top - 0.10), radius * 1.28, 0.20, mat_facade_peach)
    set_group(old)

def ext_cornice(name, x, y, z, width, depth):
    old = CURRENT_GROUP
    set_group("01_Exterior_Front_Facade")
    for dz, h, extra in [(0, 0.16, 0.0), (0.17, 0.12, 0.14), (0.31, 0.14, 0.26)]:
        box(name, (x, y, z + dz), (width + extra, depth + extra, h), mat_cornice_trim)
    set_group(old)

def ext_pediment(name, x, y, bottom, width, height=0.68):
    old = CURRENT_GROUP
    set_group("01_Exterior_Front_Facade")
    depth = 0.28
    verts = [
        (x - width/2, y, bottom), (x + width/2, y, bottom), (x, y, bottom + height),
        (x - width/2, y + depth, bottom), (x + width/2, y + depth, bottom), (x, y + depth, bottom + height),
    ]
    faces = [(0, 2, 1), (3, 4, 5), (0, 1, 4, 3), (1, 2, 5, 4), (2, 0, 3, 5)]
    mesh_from_pydata(name, verts, faces, mat_facade_peach)
    ext_cornice(f"{name}_base", x, y + 0.04, bottom - 0.18, width + 0.25, 0.48)
    set_group(old)

def ext_railing(name, x, y, bottom, width, height=1.05):
    old = CURRENT_GROUP
    set_group("01_Exterior_Front_Facade")
    for dz in (0.10, 0.25, height):
        rod(f"{name}_h_{dz}", (x - width/2, y, bottom + dz), (x + width/2, y, bottom + dz), 0.024, mat_rail_dark)
    count = max(2, math.ceil(width / 0.55))
    for i in range(count + 1):
        xx = x - width/2 + width * i / count
        rod(f"{name}_v_{i}", (xx, y, bottom), (xx, y, bottom + height), 0.023, mat_rail_dark)
    set_group(old)

# Front Side Wings
for side in (-1, 1):
    x_wing = side * 10.5
    inner_bay = side * 8.8
    outer_bay = side * 13.0
    openings = [
        (inner_bay, 3.3, 2.35, 3.2),
        (inner_bay, 8.0, 2.20, 3.2),
        (inner_bay, 15.0, 2.15, 5.0),
        (inner_bay, 23.6, 2.15, 6.4),
        (outer_bay, 3.0, 2.8, 1.8),
        (outer_bay, 8.0, 2.8, 3.2),
        (outer_bay, 13.4, 3.0, 3.4),
        (outer_bay, 19.0, 2.8, 2.8),
        (outer_bay, 24.9, 2.8, 2.2),
    ]

    set_group("01_Exterior_Front_Facade")
    wall_with_openings(f"Side_wing_{side}", x_wing, 0.35, 14.3, 9.0, 28.6, 0.70, openings, mat_facade_cream)

    for xx, zz, ww, hh in openings:
        is_balcony = abs(xx) > 12.0 and zz in (8.0, 13.4, 19.0)
        if is_balcony:
            box("Recessed_balcony_floor", (xx, 1.0, zz - hh / 2.0), (ww, 2.3, 0.18), mat_facade_cream)
            ext_window(f"Recessed_balcony_win_{xx}_{zz}", xx, 2.0, zz, ww * 0.76, hh * 0.78, 2, 2)
            ext_railing(f"Side_balcony_rail_{xx}_{zz}", xx, -0.06, zz - hh / 2.0 + 0.08, ww)
        else:
            is_lower = (zz < 4.0)
            ext_window(f"Wing_win_{xx}_{zz}", xx, 0.18, zz, ww, hh, 2, max(2, round(hh / 1.2)),
                       add_curtain=True, add_grille=is_lower)

    # Window Pediment & Columns on top floor
    ext_column(f"Pediment_col_L_{side}", inner_bay - 1.43, -0.17, 20.28, 27.0, 0.20)
    ext_column(f"Pediment_col_R_{side}", inner_bay + 1.43, -0.17, 20.28, 27.0, 0.20)
    ext_cornice(f"Tall_win_sill_{side}", inner_bay, -0.18, 20.1, 3.3, 0.64)
    ext_pediment(f"Window_pediment_{side}", inner_bay, -0.55, 27.05, 3.6, 0.68)

    # Lower window surround
    box(f"Lower_win_surr_L_{side}", (inner_bay - 1.30, -0.09, 15.0), (0.20, 0.30, 5.5), mat_cornice_trim)
    box(f"Lower_win_surr_R_{side}", (inner_bay + 1.30, -0.09, 15.0), (0.20, 0.30, 5.5), mat_cornice_trim)
    box(f"Lower_win_lintel_{side}", (inner_bay, -0.10, 17.72), (2.80, 0.36, 0.23), mat_cornice_trim)

    # Roof Cornice and Frieze
    ext_cornice(f"Wing_roof_cornice_{side}", x_wing, 0.20, 28.45, 9.0, 1.0)
    for i in range(7):
        xx = x_wing - 3.65 + i * 1.22
        box(f"Roof_frieze_sq_{side}_{i}", (xx, -0.045, 27.95), (0.40, 0.08, 0.40), mat_relief_square, 0.012)

# Central Facade & Portico
set_group("01_Exterior_Front_Facade")
wall_with_openings("Central_upper_block", 0, -0.35, 29.45, 12.0, 5.9, 1.0, [(0, 29.25, 9.2, 2.0)], mat_facade_cream)
ext_window("Central_upper_glazing", 0, -0.20, 29.25, 9.2, 2.0, 8, 2, add_curtain=False)
for x in (-2.0, -1.45, 1.45, 2.0):
    ext_column(f"Upper_paired_column_{x}", x, -0.82, 28.20, 30.30, 0.23)
ext_cornice("Central_roof_cornice", 0, -0.15, 32.3, 12.0, 1.25)
for i in range(9):
    box(f"Central_roof_square_{i}", (-5.0 + i * 1.25, -0.90, 31.6), (0.43, 0.09, 0.43), mat_relief_square)

# Central Recessed Opening with 4 Tall Monumental Columns
wall_with_openings("Central_recess_back", 0, 2.7, 19.4, 12.0, 14.2, 0.45,
                   [(-4.3, 16.5, 2.0, 2.6), (4.3, 16.5, 2.0, 2.6),
                    (-4.3, 23.4, 2.0, 1.5), (4.3, 23.4, 2.0, 1.5),
                    (0, 21.5, 4.8, 7.0)], mat_facade_cream)
for x in (-4.3, 4.3):
    ext_window(f"Central_side_win_{x}", x, 2.63, 16.5, 2.0, 2.6, 2, 2)
    ext_window(f"Central_upper_side_win_{x}", x, 2.63, 23.4, 2.0, 1.5, 3, 2)

for x in (-4.15, -3.48, 3.48, 4.15):
    ext_column(f"Tall_portico_col_{x}", x, -0.52, 13.05, 26.35, 0.29)

# Upper Projecting Canopy
set_group("03_Exterior_Canopy_and_Steps")
box("Upper_projecting_canopy", (0, 0.75, 26.45), (12.3, 5.0, 0.55), mat_facade_cream)
for x in (-5.1, 0, 5.1):
    box(f"Upper_canopy_beam_{x}", (x, 0.75, 26.02), (0.30, 4.8, 0.38), mat_facade_peach)

# Central Balcony
box("Central_balcony_floor", (0, 3.35, 18.0), (4.8, 3.2, 0.23), mat_facade_cream)
box("Central_balcony_parapet", (0, 1.76, 17.2), (4.8, 0.30, 1.55), mat_facade_cream)
ext_railing("Central_tall_railing", 0, 1.60, 18.12, 4.8, 2.25)

# Grand Entrance Canopy, Coffers and Support Piers
box("Entrance_canopy_slab", (0, 0.8, 12.0), (17.0, 6.2, 0.42), mat_facade_cream)
box("Canopy_front_fascia", (0, -2.23, 12.7), (17.0, 0.42, 1.4), mat_facade_cream)
for x in (-8.3, 8.3):
    box(f"Canopy_return_fascia_{x}", (x, 0.8, 12.7), (0.40, 6.2, 1.4), mat_facade_cream)
ext_cornice("Canopy_lower_moulding", 0, -2.25, 12.05, 17.1, 0.50)
ext_cornice("Canopy_upper_moulding", 0, -2.25, 13.40, 17.1, 0.50)
for i in range(11):
    x = -7.5 + i * 1.5
    box(f"Canopy_sq_border_{i}", (x, -2.475, 12.75), (0.67, 0.10, 0.67), mat_cornice_trim)
    box(f"Canopy_sq_relief_{i}", (x, -2.54, 12.75), (0.49, 0.06, 0.49), mat_relief_square)

for x in (-7.8, -4.0, 0, 4.0, 7.8):
    box(f"Canopy_long_beam_{x}", (x, 0.8, 11.54), (0.32, 6.0, 0.50), mat_facade_cream)
for y in (-1.85, 0.05, 1.95, 3.65):
    box(f"Canopy_cross_beam_{y}", (0, y, 11.54), (16.5, 0.30, 0.50), mat_facade_cream)

for x in (-7.65, 7.65):
    box(f"Entrance_support_pier_{x}", (x, 0.10, 5.80), (1.25, 1.65, 11.60), mat_facade_cream)

# Entrance Vestibule & Glazed Doors
box("Entrance_vestibule_floor", (0, 3.5, 0.15), (14.0, 5.0, 0.30), mat_floor_grey)
for x in (-4.7, -2.4, 2.4, 4.7):
    box(f"Entrance_inner_pillar_{x}", (x, 3.5, 4.25), (0.44, 0.55, 8.5), mat_facade_cream)
ext_window("Main_entry_glazed_doors", 0, 5.75, 1.95, 4.2, 3.2, 4, 2, add_curtain=False)

# Entrance Steps
for i in range(4):
    box(f"Entrance_step_{i}", (0, -0.9 - i * 0.38, 0.075 * (4 - i)), (8.0 + i * 0.35, 0.75, 0.15 * (4 - i)), mat_facade_cream)

# Downpipes & Lighting
set_group("01_Exterior_Front_Facade")
for x in (-8.55, 8.55):
    rod(f"Facade_downpipe_{x}", (x, -2.02, 0.35), (x, -2.02, 12.4), 0.055, mat_aluminium)
    for z in (1.0, 4.0, 7.0, 10.0):
        box(f"Pipe_bracket_{x}_{z}", (x, -1.96, z), (0.18, 0.17, 0.08), mat_rail_dark, 0.005)
box("Canopy_light", (0, -2.53, 13.64), (0.30, 0.19, 0.17), mat_rail_dark)

# ==============================================================================
# SECTION 2: AC UNITS & DETAILED EXTERIOR EQUIPMENT (from reference_building)
# ==============================================================================
print(">>> Adding AC Outdoor Units & Equipment to Facade...")
set_group("05_Exterior_Windows_AC_and_Grilles")

def make_ac_unit(name, loc, rot_z=0.0):
    lx, ly, lz = loc
    # Compressor main chassis
    box(f"{name}_body", (lx, ly, lz), (0.95, 0.52, 0.65), mat_ac_paint, bevel=0.02, rot_z=rot_z)
    
    # Circular fan disc
    fan = cylinder(f"{name}_fan", (lx - 0.14 * math.cos(rot_z), ly - 0.14 * math.sin(rot_z), lz),
                   0.23, 0.03, mat_dark_recess, segs=16)
    fan.rotation_euler = (math.pi / 2, 0, rot_z)
    
    # Fan protective grilles
    for j in range(5):
        gz = lz - 0.15 + j * 0.07
        box(f"{name}_grille_{j}", (lx - 0.14 * math.cos(rot_z), ly - 0.27 * math.cos(rot_z), gz),
            (0.40, 0.02, 0.014), mat_aluminium, rot_z=rot_z)
    
    # Side vents
    for j in range(4):
        vz = lz - 0.12 + j * 0.08
        box(f"{name}_vent_{j}", (lx + 0.28 * math.cos(rot_z), ly - 0.25 * math.cos(rot_z), vz),
            (0.18, 0.02, 0.02), mat_dark_recess, rot_z=rot_z)
    
    # Wall brackets
    for dx in (-0.30, 0.30):
        bx = lx + dx * math.cos(rot_z)
        by = ly + dx * math.sin(rot_z)
        box(f"{name}_bracket_{dx}", (bx, ly + 0.02, lz - 0.38), (0.05, 0.58, 0.06), mat_rail_dark, rot_z=rot_z)

# Mount AC units under exterior window bays
for side in (-1, 1):
    for zz in (3.0, 8.0, 13.4, 19.0):
        # On outer wing bay
        make_ac_unit(f"AC_Wing_Outer_{side}_{zz}", (side * 13.0, -0.42, zz - 1.6))
    for zz in (3.3, 8.0):
        # On inner wing bay
        make_ac_unit(f"AC_Wing_Inner_{side}_{zz}", (side * 8.8, -0.42, zz - 1.8))

# ==============================================================================
# SECTION 3: FULL-DEPTH EXTERIOR ENVELOPE & 6-STORY FLANK FACADES
# ==============================================================================
print(">>> Constructing Full-Depth Exterior Side & Rear Enclosure...")
set_group("04_Exterior_Side_and_Rear_Envelope")

ATRIUM_Y = 14.0
BUILDING_DEPTH = 32.5  # Encloses atrium (Y in [0, 28]) + rear rooms (Y up to 30.6)
SIDE_X = 15.12

# ------------------------------------------------------------------------------
# 6-STORY CLASSICAL FACADE FLANK (Exact architecture from reference_building copy)
# ------------------------------------------------------------------------------
def build_rich_facade_flank(wx, y_center, dir_x=-1, side_name="Left"):
    WIDTH = 24.0
    HALF = WIDTH / 2.0
    FLOORS = 6
    FLOOR_HEIGHT = 3.05
    BASE = 0.55
    HEIGHT = BASE + FLOORS * FLOOR_HEIGHT  # 18.85
    BAYS = 6
    SPACING = WIDTH / BAYS  # 4.0
    WINDOW_WIDTH = 2.55

    def world_pos(u, v, z):
        return (wx + dir_x * v, y_center + u, z)

    def wall_box(name, u, v, z, size_u, size_v, size_z, mat, bevel=0.015):
        return box(name, world_pos(u, v, z), (size_v, size_u, size_z), mat, bevel=bevel)

    # 1. Foundation Course
    wall_box(f"{side_name}_foundation", 0, -0.06, BASE / 2.0, WIDTH + 0.12, 0.45, BASE, mat_paving_neutral)

    # 2. Stone Base Blocks (Irregular rectangular masonry courses)
    base_rnd = random.Random(42 + (0 if dir_x < 0 else 7))
    for row in range(2):
        u = -HALF
        block_idx = 0
        while u < HALF:
            block_w = min(base_rnd.uniform(0.6, 1.35), HALF - u)
            wall_box(f"{side_name}_stone_block_{row}_{block_idx}",
                     u + block_w / 2.0, 0.04, 0.135 + row * 0.265,
                     max(0.02, block_w - 0.018), 0.12, 0.245, mat_rail_dark, bevel=0.015)
            u += block_w
            block_idx += 1

    # Window & AC builders
    def make_flank_window_bay(u, bottom, wh, barred=False, bay_id=0, floor_id=0):
        w = WINDOW_WIDTH
        z = bottom + wh / 2.0
        # Interior shadow
        wall_box(f"{side_name}_win_shadow_F{floor_id}_B{bay_id}", u, -0.35, z, w, 0.06, wh, mat_dark_recess, bevel=0)

        # Cloth Curtains with natural folds
        curtain_mat = mat_curtains[(floor_id + bay_id) % len(mat_curtains)]
        for j in range(10):
            cu = u - w / 2.0 + (j + 0.5) * w / 10.0
            wall_box(f"{side_name}_curtain_F{floor_id}_B{bay_id}_{j}", cu, -0.15 + 0.02 * (j % 2), z,
                     w / 10.0, 0.035, wh - 0.10, curtain_mat, bevel=0)

        # Recessed glazing
        wall_box(f"{side_name}_glazing_F{floor_id}_B{bay_id}", u, -0.08, z, w - 0.10, 0.018, wh - 0.10, mat_glazing_green, bevel=0)

        # Vertical frame members
        for du_idx, du in enumerate((-w / 2.0, 0, w / 2.0)):
            wall_box(f"{side_name}_v_frame_F{floor_id}_B{bay_id}_{du_idx}", u + du, -0.02, z, 0.055, 0.09, wh, mat_aluminium, bevel=0.006)

        # Horizontal frame members
        for dz_idx, dz in enumerate((-wh / 2.0, 0, wh / 2.0)):
            wall_box(f"{side_name}_h_frame_F{floor_id}_B{bay_id}_{dz_idx}", u, -0.02, z + dz, w, 0.09, 0.055, mat_aluminium, bevel=0.006)

        # Projecting window sill
        wall_box(f"{side_name}_win_sill_F{floor_id}_B{bay_id}", u, 0.10, bottom - 0.045, w + 0.18, 0.43, 0.09, mat_cornice_trim)

        # Security grilles (on floors 0 and 4)
        if barred:
            for j in range(13):
                gu = u - w / 2.0 + j * w / 12.0
                wall_box(f"{side_name}_grille_v_F{floor_id}_B{bay_id}_{j}", gu, 0.14, z, 0.021, 0.026, wh, mat_grille_metal, bevel=0)
            for dz_idx, dz in enumerate((-wh * 0.40, 0, wh * 0.40)):
                wall_box(f"{side_name}_grille_h_F{floor_id}_B{bay_id}_{dz_idx}", u, 0.15, z + dz, w, 0.03, 0.028, mat_grille_metal, bevel=0)

    def make_flank_ac_unit(u, z, bay_id=0, floor_id=0):
        v = 0.38
        wall_box(f"{side_name}_AC_body_F{floor_id}_B{bay_id}", u, v, z, 0.98, 0.54, 0.68, mat_ac_paint, bevel=0.045)
        # Circular fan disc
        fan_obj = cylinder(f"{side_name}_AC_fan_F{floor_id}_B{bay_id}", world_pos(u - 0.15, v + 0.26, z), 0.24, 0.025, mat_dark_recess, segs=16)
        fan_obj.rotation_euler = (0, math.pi / 2, 0 if dir_x < 0 else math.pi)
        # Fan grilles
        for j in range(7):
            wall_box(f"{side_name}_AC_grille_F{floor_id}_B{bay_id}_{j}", u - 0.15, v + 0.28, z - 0.21 + j * 0.07,
                     0.44, 0.025, 0.015, mat_aluminium, bevel=0)
        # Side vents
        for j in range(5):
            wall_box(f"{side_name}_AC_vent_F{floor_id}_B{bay_id}_{j}", u + 0.32, v + 0.26, z - 0.17 + j * 0.085,
                     0.18, 0.025, 0.024, mat_dark_recess, bevel=0)
        # Support brackets
        for du in (-0.32, 0.32):
            wall_box(f"{side_name}_AC_bracket_F{floor_id}_B{bay_id}_{du}", u + du, v - 0.28, z - 0.40,
                     0.055, 0.64, 0.06, mat_rail_dark, bevel=0.01)

    # 3. Floors & Bays
    for floor in range(FLOORS):
        z0 = BASE + floor * FLOOR_HEIGHT
        sill = 0.43 if floor == 0 else 0.59
        wh = 2.08 if floor == 0 else 1.91
        bottom = z0 + sill
        lintel = FLOOR_HEIGHT - sill - wh

        wall_box(f"{side_name}_wall_below_F{floor}", 0, -0.16, z0 + sill / 2.0, WIDTH, 0.32, sill, mat_facade_peach)
        wall_box(f"{side_name}_wall_above_F{floor}", 0, -0.16, bottom + wh + lintel / 2.0, WIDTH, 0.32, lintel, mat_facade_peach)

        for pier in range(BAYS + 1):
            if pier == 0:
                left = -HALF
                right = -HALF + SPACING / 2.0 - WINDOW_WIDTH / 2.0
            elif pier == BAYS:
                left = HALF - SPACING / 2.0 + WINDOW_WIDTH / 2.0
                right = HALF
            else:
                center = -HALF + pier * SPACING
                left = center - (SPACING - WINDOW_WIDTH) / 2.0
                right = center + (SPACING - WINDOW_WIDTH) / 2.0

            wall_box(f"{side_name}_pier_F{floor}_{pier}", (left + right) / 2.0, -0.16, bottom + wh / 2.0,
                     right - left, 0.32, wh, mat_facade_peach)

        for bay in range(BAYS):
            u = -HALF + SPACING * (bay + 0.5)
            make_flank_window_bay(u, bottom, wh, barred=(floor in (0, 4)), bay_id=bay, floor_id=floor)
            if floor in (1, 3) and bay in (1, 3, 4):
                make_flank_ac_unit(u + 0.78, bottom - 0.08, bay_id=bay, floor_id=floor)

        if floor in (0, 2, 4):
            wall_box(f"{side_name}_band_F{floor}", 0, 0.12, z0 + FLOOR_HEIGHT - 0.09, WIDTH, 0.38, 0.17, mat_cornice_trim)

    # 4. Upper Bay Raised Surrounds (Floors 3 & 4)
    low = BASE + 3 * FLOOR_HEIGHT + 0.28
    high = BASE + 5 * FLOOR_HEIGHT - 0.10
    surround_w = WINDOW_WIDTH + 0.47
    for bay in range(BAYS):
        u = -HALF + SPACING * (bay + 0.5)
        for du in (-surround_w / 2.0, surround_w / 2.0):
            wall_box(f"{side_name}_surround_v_B{bay}_{du}", u + du, 0.16, (low + high) / 2.0,
                     0.17, 0.34, high - low, mat_cornice_trim)
        for z in (low, high):
            wall_box(f"{side_name}_surround_h_B{bay}_{z}", u, 0.16, z,
                     surround_w + 0.17, 0.34, 0.17, mat_cornice_trim)

    # 5. Monumental Curved Arch Spandrel Feature
    segments = 80
    span = HALF - 0.7
    spring = BASE + 3.45
    rise = 5.10
    top = BASE + 3 * FLOOR_HEIGHT + 0.22

    arch_verts = []
    arch_faces = []
    for i in range(segments + 1):
        u = -span + 2 * span * i / segments
        lower = spring + rise * math.sqrt(max(0, 1 - (u / span) ** 2))
        for v, z in [(0.51, lower), (0.51, top), (0.10, lower), (0.10, top)]:
            arch_verts.append(world_pos(u, v, z))

    for i in range(segments):
        a = 4 * i
        b = a + 4
        arch_faces.extend([
            (a, b, b + 1, a + 1),
            (a + 2, a + 3, b + 3, b + 2),
            (a, a + 2, b + 2, b),
            (a + 1, b + 1, b + 3, a + 3)
        ])
    arch_faces.extend([
        (0, 1, 3, 2),
        (4 * segments, 4 * segments + 2, 4 * segments + 3, 4 * segments + 1)
    ])
    mesh = bpy.data.meshes.new(f"{side_name}_Arch_Mesh")
    mesh.from_pydata(arch_verts, [], arch_faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()
    arch_obj = bpy.data.objects.new(f"{side_name}_Large_Curved_Arch", mesh)
    place(arch_obj, f"{side_name}_Large_Curved_Arch", mat_facade_peach)
    mod = arch_obj.modifiers.new("Bevel", "BEVEL")
    mod.width = 0.025
    mod.segments = 2

    # 6. Roof Cornice, Parapet, and Coping
    wall_box(f"{side_name}_roof_cornice", 0, 0.10, HEIGHT, WIDTH + 0.22, 0.58, 0.24, mat_cornice_trim)
    wall_box(f"{side_name}_roof_parapet", 0, -0.15, HEIGHT + 0.42, WIDTH, 0.30, 0.78, mat_facade_peach)
    wall_box(f"{side_name}_parapet_coping", 0, -0.10, HEIGHT + 0.84, WIDTH + 0.12, 0.48, 0.12, mat_cornice_trim)

    # 7. Corner Return Walls connecting to front wing and rear facade
    f_len = (y_center - HALF) - 0.35
    f_mid_u = -HALF - f_len / 2.0
    wall_box(f"{side_name}_corner_return_front", f_mid_u, -0.16, HEIGHT / 2.0, f_len, 0.35, HEIGHT, mat_facade_cream)
    wall_box(f"{side_name}_corner_cornice_front", f_mid_u, 0.10, HEIGHT, f_len, 0.58, 0.24, mat_cornice_trim)
    wall_box(f"{side_name}_corner_parapet_front", f_mid_u, -0.15, HEIGHT + 0.42, f_len, 0.30, 0.78, mat_facade_cream)
    wall_box(f"{side_name}_corner_coping_front", f_mid_u, -0.10, HEIGHT + 0.84, f_len, 0.48, 0.12, mat_cornice_trim)

    r_len = BUILDING_DEPTH - (y_center + HALF)
    r_mid_u = HALF + r_len / 2.0
    wall_box(f"{side_name}_corner_return_rear", r_mid_u, -0.16, HEIGHT / 2.0, r_len, 0.35, HEIGHT, mat_facade_cream)
    wall_box(f"{side_name}_corner_cornice_rear", r_mid_u, 0.10, HEIGHT, r_len, 0.58, 0.24, mat_cornice_trim)
    wall_box(f"{side_name}_corner_parapet_rear", r_mid_u, -0.15, HEIGHT + 0.42, r_len, 0.30, 0.78, mat_facade_cream)
    wall_box(f"{side_name}_corner_coping_rear", r_mid_u, -0.10, HEIGHT + 0.84, r_len, 0.48, 0.12, mat_cornice_trim)

    # Upper clerestory wall up to roof slab Z = 28.6m
    upper_h = 28.6 - (HEIGHT + 0.90)
    upper_mid_z = (HEIGHT + 0.90) + upper_h / 2.0
    wall_box(f"{side_name}_upper_clerestory_wall", 0, -0.16, upper_mid_z, BUILDING_DEPTH - 0.35, 0.35, upper_h, mat_facade_cream)

# Construct Left Facade Flank (User Image 2 AFTER)
build_rich_facade_flank(-SIDE_X, ATRIUM_Y, dir_x=-1, side_name="Left_Flank")
# Construct Matching Right Facade Flank
build_rich_facade_flank(SIDE_X, ATRIUM_Y, dir_x=1, side_name="Right_Flank")

# Rear Facade Elevation
rear_y = BUILDING_DEPTH
box("Exterior_rear_facade_wall", (0, rear_y, 14.3), (SIDE_X * 2.0, 0.45, 28.6), mat_facade_cream)
ext_cornice("Rear_roof_cornice", 0, rear_y, 28.45, SIDE_X * 2.0, 0.8)

# Rear ground entrance / service doors and upper windows
ext_window("Rear_service_doors", 0, rear_y - 0.15, 2.0, 4.0, 3.2, 4, 2, add_curtain=False)
for rx in (-10.5, -5.5, 5.5, 10.5):
    for rz in (8.5, 13.5, 18.5, 23.5):
        ext_window(f"Rear_win_{rx}_{rz}", rx, rear_y - 0.15, rz, 2.4, 2.8, 2, 2, add_curtain=True)

# Main Roof Slab with Central Opening for Atrium Skylight
ROOF_HX = 8.5
ROOF_HY = 8.5
box("Main_roof_front", (0, (0.35 + (ATRIUM_Y - ROOF_HY)) / 2.0, 28.6), (SIDE_X * 2.0, (ATRIUM_Y - ROOF_HY) - 0.35, 0.35), mat_facade_cream)
box("Main_roof_rear", (0, ((ATRIUM_Y + ROOF_HY) + BUILDING_DEPTH) / 2.0, 28.6), (SIDE_X * 2.0, BUILDING_DEPTH - (ATRIUM_Y + ROOF_HY), 0.35), mat_facade_cream)
box("Main_roof_left", (-(SIDE_X + ROOF_HX) / 2.0, ATRIUM_Y, 28.6), (SIDE_X - ROOF_HX, ROOF_HY * 2.0, 0.35), mat_facade_cream)
box("Main_roof_right", ((SIDE_X + ROOF_HX) / 2.0, ATRIUM_Y, 28.6), (SIDE_X - ROOF_HX, ROOF_HY * 2.0, 0.35), mat_facade_cream)

# Ground Plane / Site
box("Ground_pavement", (0, 14.0, -0.20), (80.0, 80.0, 0.30), mat_paving_neutral, 0)

# ==============================================================================
# SECTION 4: INTERIOR ATRIUM PLAZA & INLAYS (from atrium_reconstruction)
# ==============================================================================
print(">>> Constructing Interior Atrium Core & Ground Floor Inlays...")
set_group("06_Interior_Atrium_Ground_and_Inlays")

# Spatial Alignment: The atrium is centered at Y = 14.0m
# Spanning Y in [0, 28m], seamlessly connected to the entrance vestibule at Y=5.75m.
ATRIUM_Y = 14.0

# Main Polished Stone Floor
box("Atrium_main_floor", (0, ATRIUM_Y, -0.15), (24.0, 28.0, 0.30), mat_floor_grey)

# Geometric Stone Tile Perimeter Paving
palette = [mat_stone_cream, mat_stone_ochre, mat_stone_black, mat_floor_grey, mat_accent_burgundy]
for ix in range(-5, 6):
    for iy in range(-6, 7):
        px, py = ix * 2.0 + 1.0, ATRIUM_Y + iy * 2.0 + 1.0
        dist_sq = (px)**2 + (py - ATRIUM_Y)**2
        if dist_sq > 5.6**2 and abs(px) < 11.2 and abs(py - ATRIUM_Y) < 13.0:
            box(f"Floor_paving_{ix}_{iy}", (px, py, 0.012), (1.95, 1.95, 0.018),
                palette[(ix * 3 + iy * 2) % len(palette)], bevel=0.003)

# Concentric Segmented Circular Floor Inlays
for r0, r1, mat in [
    (0.0, 2.8, mat_floor_grey),
    (2.8, 3.15, mat_stone_black),
    (3.15, 4.25, mat_floor_grey),
    (4.25, 4.65, mat_stone_black),
    (4.65, 5.45, mat_stone_cream)
]:
    segments = 64
    for i in range(segments):
        a = i * 2 * math.pi / segments
        b = (i + 1) * 2 * math.pi / segments
        verts = [
            (r0 * math.cos(a), ATRIUM_Y + r0 * math.sin(a), 0.026),
            (r1 * math.cos(a), ATRIUM_Y + r1 * math.sin(a), 0.026),
            (r1 * math.cos(b), ATRIUM_Y + r1 * math.sin(b), 0.026),
            (r0 * math.cos(b), ATRIUM_Y + r0 * math.sin(b), 0.026)
        ]
        mesh_from_pydata(f"Inlay_{r0}_{i}", verts, [(0, 1, 2, 3)], mat)

# Central Reflective Tiled Motif
for i in range(8):
    for j in range(12):
        tx = (i - 3.5) * 0.28
        ty = ATRIUM_Y + (j - 5.5) * 0.28
        box(f"Central_glossy_tile_{i}_{j}", (tx, ty, 0.042), (0.268, 0.268, 0.025), mat_floor_grey, bevel=0.003)

# Decorative Planters with Foliage
for px in (-7.5, 7.5):
    for py in (ATRIUM_Y - 8.0, ATRIUM_Y + 8.0):
        box(f"Atrium_planter_{px}_{py}", (px, py, 0.45), (1.4, 1.4, 0.90), mat_accent_burgundy, bevel=0.02)
        box(f"Planter_soil_{px}_{py}", (px, py, 0.86), (1.25, 1.25, 0.05), mat_pot_soil)
        cylinder(f"Planter_bush_{px}_{py}", (px, py, 1.25), 0.55, 0.75, mat_plant_leaf, segs=12)

# Full-Height Atrium Structural Piers
for x in (-8.9, 8.9):
    for y_rel in (-8.0, 8.0):
        box(f"Atrium_full_pier_{x}_{y_rel}", (x, ATRIUM_Y + y_rel, 12.0), (0.68, 0.85, 24.0), mat_atrium_white)

# ==============================================================================
# SECTION 5: 5 GALLERY TIERS, COLUMNS & BALCONIES
# ==============================================================================
print(">>> Constructing 5 Gallery Tiers & Balconies...")
set_group("07_Interior_Galleries_and_Railings")

GALLERY_LEVELS = [4.0, 8.0, 12.0, 16.0, 20.0]

for floor_idx, gz in enumerate(GALLERY_LEVELS):
    floor_num = floor_idx + 1

    # Rear Gallery Slab & Fascia (at Y = ATRIUM_Y + 9.65)
    box(f"Rear_gallery_slab_L{floor_num}", (0, ATRIUM_Y + 9.65, gz), (18.4, 4.1, 0.38), mat_balcony_grey)
    box(f"Rear_balcony_fascia_L{floor_num}", (0, ATRIUM_Y + 7.66, gz + 0.23), (18.4, 0.23, 0.83), mat_atrium_white)
    
    # Rear Handrail looking into atrium
    for dz in (0.10, 0.45, 0.95):
        rod(f"Rear_rail_h_{floor_num}_{dz}", (-9.0, ATRIUM_Y + 7.55, gz + dz),
            (9.0, ATRIUM_Y + 7.55, gz + dz), 0.022, mat_stainless_steel)
    for i in range(32):
        rx = -9.0 + i * (18.0 / 31)
        rod(f"Rear_rail_v_{floor_num}_{i}", (rx, ATRIUM_Y + 7.55, gz),
            (rx, ATRIUM_Y + 7.55, gz + 0.95), 0.018, mat_stainless_steel)

    # Side Gallery Slabs & Fascias (X = +/- 9.55)
    for x in (-9.55, 9.55):
        box(f"Side_gallery_slab_{x}_{floor_num}", (x, ATRIUM_Y, gz), (3.7, 19.4, 0.38), mat_balcony_grey)
        inner_x = -7.68 if x < 0 else 7.68
        box(f"Side_balcony_fascia_{x}_{floor_num}", (inner_x, ATRIUM_Y, gz + 0.23), (0.23, 19.4, 0.83), mat_atrium_white)
        
        # Side Handrails
        y_start = ATRIUM_Y - 9.6
        y_end = ATRIUM_Y + 7.55
        for dz in (0.10, 0.45, 0.95):
            rod(f"Side_rail_h_{x}_{floor_num}_{dz}", (inner_x, y_start, gz + dz),
                (inner_x, y_end, gz + dz), 0.022, mat_stainless_steel)
        for i in range(28):
            ry = y_start + i * ((y_end - y_start) / 27)
            rod(f"Side_rail_v_{x}_{floor_num}_{i}", (inner_x, ry, gz),
                (inner_x, ry, gz + 0.95), 0.018, mat_stainless_steel)

    # Round Gallery Columns
    for x in (-7.2, -4.4, 4.4, 7.2):
        cylinder(f"Gallery_col_rear_{x}_{floor_num}", (x, ATRIUM_Y + 9.0, gz + 2.0), 0.25, 3.6, mat_atrium_white)
    for x in (-10.2, 10.2):
        for y_rel in (-6.0, -2.0, 2.0, 6.0):
            cylinder(f"Gallery_col_side_{x}_{y_rel}_{floor_num}", (x, ATRIUM_Y + y_rel, gz + 2.0), 0.25, 3.6, mat_atrium_white)

    # Gallery Wall Panels & Service Pipes
    accent = mat_accent_burgundy if floor_idx == 4 else mat_stone_ochre if floor_idx == 3 else mat_dark_recess
    box(f"Gallery_wall_accent_{floor_num}", (0, ATRIUM_Y + 11.42, gz + 1.95), (17.5, 0.05, 2.85), accent, 0)
    for yy in (ATRIUM_Y + 9.0, ATRIUM_Y + 10.1):
        rod(f"Gallery_pipe_{floor_num}_{yy}", (-8.5, yy, gz - 0.36), (8.5, yy, gz - 0.36), 0.065, mat_aluminium)

# ==============================================================================
# SECTION 6: COMPLETE SUITE OF 45 NUMBERED ROOMS (with Photo-Accurate A-119 Details)
# ==============================================================================
print(">>> Assembling 45 Numbered Rooms with Detailed Doors & Placards...")
set_group("08_Interior_Rooms_and_Doors")

def create_detailed_room_entrance(room_no, center_pos, rot_z=0.0):
    cx, cy, cz = center_pos
    cos_r = math.cos(rot_z)
    sin_r = math.sin(rot_z)

    def to_w(lx, ly, lz):
        wx = cx + lx * cos_r - ly * sin_r
        wy = cy + lx * sin_r + ly * cos_r
        wz = cz + lz
        return (wx, wy, wz)

    r_tag = room_no.replace(" ", "_")

    # 1. Light Beech Portal Surround
    box(f"Portal_Top_{r_tag}", to_w(0, 0, 2.75), (2.12, 0.32, 0.52), mat_wood_surround, bevel=0.015, rot_z=rot_z)
    box(f"Portal_Left_{r_tag}", to_w(-0.95, 0, 1.25), (0.24, 0.32, 2.50), mat_wood_surround, bevel=0.015, rot_z=rot_z)
    box(f"Portal_Right_{r_tag}", to_w(0.95, 0, 1.25), (0.24, 0.32, 2.50), mat_wood_surround, bevel=0.015, rot_z=rot_z)

    # 2. Warm Wood Double Door Leaves
    box(f"Door_Left_{r_tag}", to_w(-0.41, 0.02, 1.24), (0.80, 0.05, 2.44), mat_wood_leaf, bevel=0.008, rot_z=rot_z)
    box(f"Door_Right_{r_tag}", to_w(0.41, 0.02, 1.24), (0.80, 0.05, 2.44), mat_wood_leaf, bevel=0.008, rot_z=rot_z)

    # 3. Vision Glass Rectangular Panels
    box(f"Vision_Glass_L_{r_tag}", to_w(-0.42, 0.02, 1.48), (0.34, 0.054, 0.22), mat_vision_glass, rot_z=rot_z)
    box(f"Vision_Glass_R_{r_tag}", to_w(0.42, 0.02, 1.48), (0.34, 0.054, 0.22), mat_vision_glass, rot_z=rot_z)

    # 4. Stainless Steel Hardware (Pull Handles, Hydraulic Closers, Slide Bolt)
    rod(f"Handle_L_{r_tag}", to_w(-0.08, -0.06, 0.85), to_w(-0.08, -0.06, 1.15), 0.016, mat_stainless_steel)
    rod(f"Handle_R_{r_tag}", to_w(0.08, -0.06, 0.85), to_w(0.08, -0.06, 1.15), 0.016, mat_stainless_steel)
    box(f"Slide_Bolt_{r_tag}", to_w(0, -0.04, 0.98), (0.24, 0.03, 0.05), mat_stainless_steel, rot_z=rot_z)

    box(f"Door_Closer_L_{r_tag}", to_w(-0.40, -0.04, 2.38), (0.22, 0.06, 0.05), mat_rail_dark, rot_z=rot_z)
    box(f"Door_Closer_R_{r_tag}", to_w(0.40, -0.04, 2.38), (0.22, 0.06, 0.05), mat_rail_dark, rot_z=rot_z)

    # 5. Room Number Placard (Photo-Accurate e.g. "A - 119")
    box(f"Placard_Plate_{r_tag}", to_w(0.05, -0.165, 2.76), (0.42, 0.02, 0.16), mat_placard_plate, bevel=0.005, rot_z=rot_z)
    box(f"Placard_Text_{r_tag}", to_w(0.05, -0.178, 2.76), (0.30, 0.01, 0.08), mat_placard_text, rot_z=rot_z)

    # 6. Red Fire Alarm Call Point & Electrical Conduit
    box(f"Fire_Alarm_{r_tag}", to_w(-1.38, -0.02, 1.35), (0.095, 0.06, 0.095), mat_alarm_red, bevel=0.005, rot_z=rot_z)
    rod(f"Conduit_{r_tag}", to_w(-1.38, -0.01, 1.40), to_w(-1.38, -0.01, 3.40), 0.012, mat_aluminium)

    # 7. Dark Granite Skirting & Corridor Partition Walls around Door
    box(f"Skirting_L_{r_tag}", to_w(-1.55, -0.02, 0.05), (1.10, 0.025, 0.10), mat_skirting_granite, rot_z=rot_z)
    box(f"Skirting_R_{r_tag}", to_w(1.55, -0.02, 0.05), (1.10, 0.025, 0.10), mat_skirting_granite, rot_z=rot_z)
    box(f"Corridor_Wall_L_{r_tag}", to_w(-1.55, 0.01, 1.7), (1.10, 0.14, 3.4), mat_atrium_white, rot_z=rot_z)
    box(f"Corridor_Wall_R_{r_tag}", to_w(1.55, 0.01, 1.7), (1.10, 0.14, 3.4), mat_atrium_white, rot_z=rot_z)

    # 8. Interior Room Volume (creates depth behind doors towards building wings/exterior)
    box(f"Room_Floor_{r_tag}", to_w(0, 1.8, 0.01), (3.6, 3.5, 0.04), mat_floor_grey, rot_z=rot_z)
    box(f"Room_Rear_{r_tag}", to_w(0, 3.55, 1.7), (3.6, 0.15, 3.4), mat_room_interior, rot_z=rot_z)
    box(f"Room_Side_L_{r_tag}", to_w(-1.8, 1.8, 1.7), (0.15, 3.5, 3.4), mat_room_interior, rot_z=rot_z)
    box(f"Room_Side_R_{r_tag}", to_w(1.8, 1.8, 1.7), (0.15, 3.5, 3.4), mat_room_interior, rot_z=rot_z)

# Generate 9 Rooms on Each of the 5 Floors (Total 45 Rooms)
# Correctly placed on the corridor partition walls facing inwards towards the gallery walkway
for floor_idx, gz in enumerate(GALLERY_LEVELS):
    floor_num = floor_idx + 1
    base_num = floor_num * 100  # Floor 1: 100, Floor 2: 200, etc.

    # 3 Left Gallery Rooms (Corridor partition at X = -11.45, doors facing +X into corridor)
    left_rot = math.pi / 2
    left_y_coords = [ATRIUM_Y - 5.2, ATRIUM_Y, ATRIUM_Y + 5.2]
    for i, y_pos in enumerate(left_y_coords):
        room_no = f"A - {base_num + i + 1}"
        create_detailed_room_entrance(room_no, (-11.45, y_pos, gz), rot_z=left_rot)

    # 3 Rear Gallery Rooms (Corridor partition at Y = ATRIUM_Y + 11.45, doors facing -Y into corridor)
    rear_rot = 0.0
    rear_x_coords = [-5.5, 0.0, 5.5]
    for i, x_pos in enumerate(rear_x_coords):
        room_no = f"A - {base_num + 3 + i + 1}"
        create_detailed_room_entrance(room_no, (x_pos, ATRIUM_Y + 11.45, gz), rot_z=rear_rot)

    # 3 Right Gallery Rooms (Corridor partition at X = 11.45, doors facing -X into corridor)
    # Includes photo-exact A-109 on Floor 1!
    right_rot = -math.pi / 2
    right_y_coords = [ATRIUM_Y + 5.2, ATRIUM_Y, ATRIUM_Y - 5.2]
    for i, y_pos in enumerate(right_y_coords):
        room_no = f"A - {base_num + 6 + i + 1}"
        create_detailed_room_entrance(room_no, (11.45, y_pos, gz), rot_z=right_rot)

# ==============================================================================
# SECTION 7: PANORAMIC GLASS ELEVATOR TOWER
# ==============================================================================
print(">>> Constructing Panoramic Glass Elevator Tower...")
set_group("09_Interior_Panoramic_Lift")

lx, ly = 8.05, ATRIUM_Y + 4.65
for dx in (-0.83, 0.83):
    for dy in (-0.85, 0.85):
        box(f"Lift_mast_{dx}_{dy}", (lx + dx, ly + dy, 11.7), (0.08, 0.08, 23.4), mat_dark_recess, bevel=0.008)

for z in range(0, 24, 2):
    for dy in (-0.85, 0.85):
        rod(f"Lift_beam_x_{z}_{dy}", (lx - 0.83, ly + dy, z), (lx + 0.83, ly + dy, z), 0.03, mat_aluminium)
    for dx in (-0.83, 0.83):
        rod(f"Lift_beam_y_{z}_{dx}", (lx + dx, ly - 0.85, z), (lx + dx, ly + 0.85, z), 0.03, mat_aluminium)

# Elevator Cabin (at Floor 2, z = 8.5m)
box("Lift_car_frame", (lx, ly, 8.5), (1.55, 1.55, 2.65), mat_rail_dark, bevel=0.02)
box("Lift_car_glazing", (lx, ly, 8.5), (1.48, 1.48, 2.50), mat_lift_glazing, 0)
box("Lift_floor_platform", (lx, ly, 7.22), (1.52, 1.52, 0.12), mat_stone_black)
box("Lift_roof_cap", (lx, ly, 9.80), (1.52, 1.52, 0.15), mat_aluminium)

# ==============================================================================
# SECTION 8: ATRIUM PYRAMIDAL SKYLIGHT (Roof Level Fix)
# ==============================================================================
print(">>> Constructing Central Pyramidal Skylight (Roof Fix)...")
set_group("10_Roof_and_Skylight")

# Roof opening dimensions
ROOF_OPEN_HX = 8.5
ROOF_OPEN_HY = 8.5
Z_ROOF_DECK = 28.6
Z_CURB_TOP = 29.15
Z_SKYLIGHT_APEX = 33.5

# 1. Perimeter Raised Curb framing the roof opening
box("Skylight_curb_front", (0, ATRIUM_Y - ROOF_OPEN_HY - 0.175, (Z_ROOF_DECK + Z_CURB_TOP) / 2.0),
    (ROOF_OPEN_HX * 2.0 + 0.70, 0.35, Z_CURB_TOP - Z_ROOF_DECK), mat_cornice_trim)
box("Skylight_curb_rear", (0, ATRIUM_Y + ROOF_OPEN_HY + 0.175, (Z_ROOF_DECK + Z_CURB_TOP) / 2.0),
    (ROOF_OPEN_HX * 2.0 + 0.70, 0.35, Z_CURB_TOP - Z_ROOF_DECK), mat_cornice_trim)
box("Skylight_curb_left", (-ROOF_OPEN_HX - 0.175, ATRIUM_Y, (Z_ROOF_DECK + Z_CURB_TOP) / 2.0),
    (0.35, ROOF_OPEN_HY * 2.0, Z_CURB_TOP - Z_ROOF_DECK), mat_cornice_trim)
box("Skylight_curb_right", (ROOF_OPEN_HX + 0.175, ATRIUM_Y, (Z_ROOF_DECK + Z_CURB_TOP) / 2.0),
    (0.35, ROOF_OPEN_HY * 2.0, Z_CURB_TOP - Z_ROOF_DECK), mat_cornice_trim)

# 2. Central Apex Hub (raised above roof)
box("Dark_central_skylight_hub", (0, ATRIUM_Y, Z_SKYLIGHT_APEX), (1.60, 1.60, 0.25), mat_dark_recess)

# 3. 4 Corner Hip Struts
skylight_corners = [
    (-ROOF_OPEN_HX, ATRIUM_Y - ROOF_OPEN_HY),
    (ROOF_OPEN_HX, ATRIUM_Y - ROOF_OPEN_HY),
    (ROOF_OPEN_HX, ATRIUM_Y + ROOF_OPEN_HY),
    (-ROOF_OPEN_HX, ATRIUM_Y + ROOF_OPEN_HY)
]
for i, (cx, cy) in enumerate(skylight_corners):
    rod(f"Skylight_hip_strut_{i}", (cx, cy, Z_CURB_TOP), (0, ATRIUM_Y, Z_SKYLIGHT_APEX), 0.10, mat_aluminium)

# 4. Perimeter Base Frame Rods
for i in range(4):
    c1 = skylight_corners[i]
    c2 = skylight_corners[(i + 1) % 4]
    rod(f"Skylight_base_frame_{i}", (c1[0], c1[1], Z_CURB_TOP), (c2[0], c2[1], Z_CURB_TOP), 0.06, mat_aluminium)

# 5. Glazing Shell (4 sloping triangular faces)
skylight_verts = [
    (0, ATRIUM_Y, Z_SKYLIGHT_APEX + 0.05),
    (skylight_corners[0][0], skylight_corners[0][1], Z_CURB_TOP),
    (skylight_corners[1][0], skylight_corners[1][1], Z_CURB_TOP),
    (skylight_corners[2][0], skylight_corners[2][1], Z_CURB_TOP),
    (skylight_corners[3][0], skylight_corners[3][1], Z_CURB_TOP),
]
skylight_faces = [
    (0, 1, 2),
    (0, 2, 3),
    (0, 3, 4),
    (0, 4, 1),
]
mesh_from_pydata("Skylight_glazing_shell", skylight_verts, skylight_faces, mat_skylight_pearl)

# ==============================================================================
# SECTION 9: CAMERAS & ENVIRONMENT LIGHTING
# ==============================================================================
print(">>> Setting up Professional Cameras & Lighting...")
set_group("11_Presentation_and_Lighting")

# Exterior Beauty Camera (Front 3/4 Perspective)
cam_ext_data = bpy.data.cameras.new("Cam_Exterior")
cam_ext_data.lens = 38
cam_ext_data.clip_end = 500
cam_ext = bpy.data.objects.new("Exterior_Beauty_Camera", cam_ext_data)
cam_ext.location = (-32.0, -32.0, 22.0)
cam_ext.rotation_euler = (math.radians(68.0), 0.0, math.radians(-42.0))
collections["11_Presentation_and_Lighting"].objects.link(cam_ext)

# Interior Atrium Camera (Ground Floor Perspective looking at Circular Inlay & Room A-119)
cam_int_data = bpy.data.cameras.new("Cam_Interior")
cam_int_data.lens = 22
cam_int_data.clip_end = 200
cam_int = bpy.data.objects.new("Interior_Atrium_Camera", cam_int_data)
cam_int.location = (-6.5, ATRIUM_Y - 7.5, 1.70)
cam_int.rotation_euler = (math.radians(82.0), 0.0, math.radians(-38.0))
collections["11_Presentation_and_Lighting"].objects.link(cam_int)

# Dedicated Roof View Camera (High Isometric Angle matching User Image 1 AFTER)
cam_roof_data = bpy.data.cameras.new("Cam_Roof_View")
cam_roof_data.lens = 34
cam_roof_data.clip_end = 500
cam_roof = bpy.data.objects.new("Roof_Beauty_Camera", cam_roof_data)
cam_roof.location = (-34.0, -14.0, 52.0)
cam_roof.rotation_euler = (math.radians(52.0), 0.0, math.radians(-55.0))
collections["11_Presentation_and_Lighting"].objects.link(cam_roof)

# Dedicated Left Side Facade Camera (Side Elevation matching User Image 2 AFTER)
cam_left_data = bpy.data.cameras.new("Cam_Left_Side")
cam_left_data.lens = 35
cam_left_data.clip_end = 500
cam_left = bpy.data.objects.new("Left_Side_Camera", cam_left_data)
cam_left.location = (-54.0, ATRIUM_Y, 10.0)
cam_left.rotation_euler = (math.radians(90.0), 0.0, math.radians(-90.0))
collections["11_Presentation_and_Lighting"].objects.link(cam_left)

scene.camera = cam_ext

# Exterior Sun / Daylight
sun_data = bpy.data.lights.new("Sun_Daylight", type="SUN")
sun_data.energy = 4.5
sun_data.color = (1.0, 0.98, 0.95)
sun_obj = bpy.data.objects.new("Sun_Daylight", sun_data)
sun_obj.rotation_euler = (math.radians(52.0), math.radians(24.0), math.radians(-35.0))
collections["11_Presentation_and_Lighting"].objects.link(sun_obj)

# Interior Atrium Skylight Warm Light Fill
skylight_lamp = bpy.data.lights.new("Skylight_Fill", type="AREA")
skylight_lamp.energy = 850.0
skylight_lamp.size = 12.0
skylight_lamp.color = (1.0, 0.96, 0.90)
skylight_obj = bpy.data.objects.new("Skylight_Fill", skylight_lamp)
skylight_obj.location = (0, ATRIUM_Y, 24.5)
collections["11_Presentation_and_Lighting"].objects.link(skylight_obj)

# Atrium Ground Foyer Accent Light
foyer_lamp = bpy.data.lights.new("Foyer_Accent", type="POINT")
foyer_lamp.energy = 350.0
foyer_lamp.color = (1.0, 0.94, 0.85)
foyer_obj = bpy.data.objects.new("Foyer_Accent", foyer_lamp)
foyer_obj.location = (0, ATRIUM_Y, 5.0)
collections["11_Presentation_and_Lighting"].objects.link(foyer_obj)

# Render settings
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"

# ==============================================================================
# SECTION 10: SAVE & EXPORT
# ==============================================================================
print(f"\n>>> Saving Master Blend file to: {BLEND_FINAL}...")
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_FINAL))
print("Saved blend successfully!")

# Copy to synchronization targets
for target in [BUILDING_RECON_BLEND, REF_BLEND]:
    try:
        shutil.copyfile(BLEND_FINAL, target)
        print(f"Synchronized blend to: {target}")
    except Exception as e:
        print(f"Could not copy to {target}: {e}")

# Export High-Quality Complete GLB
print(f"\n>>> Exporting Full GLB to: {GLB_FINAL}...")
bpy.ops.object.select_all(action="DESELECT")
for o in scene.objects:
    if o.type == "MESH":
        o.select_set(True)

try:
    bpy.ops.export_scene.gltf(
        filepath=str(GLB_FINAL),
        export_format="GLB",
        use_selection=True,
        export_materials="EXPORT"
    )
    print("Exported GLB successfully:", GLB_FINAL)
except Exception as e:
    print("Error exporting GLB:", e)

# Copy GLB to web targets and synchronization targets
for target_glb in [GLB_PUBLIC, BUILDING_RECON_GLB, REF_GLB, LEFTSIDE_GLB]:
    try:
        target_glb.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(GLB_FINAL, target_glb)
        print(f"Synchronized GLB to: {target_glb}")
    except Exception as e:
        print(f"Could not copy GLB to {target_glb}: {e}")

# Render 1: Roof Beauty Shot (Verifying User Image 1 AFTER)
print(f"\n>>> Rendering Roof Beauty Shot to: {RENDER_ROOF}...")
scene.camera = cam_roof
scene.render.filepath = str(RENDER_ROOF)
try:
    bpy.ops.render.render(write_still=True)
    print("Rendered Roof Beauty Shot successfully!")
except Exception as e:
    print("Error rendering roof:", e)

# Render 2: Left Side Elevation Shot (Verifying User Image 2 AFTER)
print(f"\n>>> Rendering Left Side Elevation to: {RENDER_LEFT}...")
scene.camera = cam_left
scene.render.filepath = str(RENDER_LEFT)
try:
    bpy.ops.render.render(write_still=True)
    print("Rendered Left Side Elevation successfully!")
except Exception as e:
    print("Error rendering left side:", e)

# Render 3: Exterior Beauty Shot
print(f"\n>>> Rendering Exterior Beauty Shot to: {RENDER_EXTERIOR}...")
scene.camera = cam_ext
scene.render.filepath = str(RENDER_EXTERIOR)
try:
    bpy.ops.render.render(write_still=True)
    print("Rendered Exterior Beauty Shot successfully!")
except Exception as e:
    print("Error rendering exterior:", e)

# Render 4: Interior Atrium Shot
print(f"\n>>> Rendering Interior Atrium Shot to: {RENDER_ATRIUM}...")
scene.camera = cam_int
scene.render.filepath = str(RENDER_ATRIUM)
try:
    bpy.ops.render.render(write_still=True)
    print("Rendered Interior Atrium Shot successfully!")
except Exception as e:
    print("Error rendering interior:", e)

print("\n=================================================================")
print("  COMPLETE FULL BUILDING GENERATION & INTEGRATION FINISHED!      ")
print("=================================================================")
