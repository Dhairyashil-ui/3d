"""
Reference-guided institutional building reconstruction.
Requires Blender 4.x. No external assets or add-ons.

Outputs:
    institutional_reconstruction.blend
    front_reconstruction.png  (with --render)

All dimensions are inferred, in metres.
Unseen elevations, atrium layout, roof and landscape are interpretive.
"""
import bpy
import math
import random
import os
import sys
import argparse
from mathutils import Vector

# ---------------------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------------------

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
parser = argparse.ArgumentParser()
parser.add_argument("--out", default=os.path.join(
    os.path.expanduser("~"), "building_reconstruction"))
parser.add_argument("--render", action="store_true")
args, _ = parser.parse_known_args(argv)

OUT = os.path.abspath(args.out)
os.makedirs(OUT, exist_ok=True)

random.seed(47)

W = 36.0
D = 25.2
FH = 4.2
H = FH * 5
GROUND = -0.9
RENDER_SAMPLES = 64

# Front faces toward negative Y.
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials):
    for block in list(datablocks):
        if block.users == 0:
            datablocks.remove(block)

scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.scale_length = 1.0

COLLECTIONS = {}
for name in (
    "01_Structure", "02_Front_Facade", "03_Sides_Rear",
    "04_Portico", "05_Windows_Doors", "06_Atrium",
    "07_Roof", "08_Utilities", "09_Weathering",
    "10_Ground", "11_Lighting_Cameras"
):
    col = bpy.data.collections.new(name)
    scene.collection.children.link(col)
    COLLECTIONS[name] = col

ACTIVE = COLLECTIONS["01_Structure"]

def group(name):
    global ACTIVE
    ACTIVE = COLLECTIONS[name]

def move_to_group(obj):
    for col in list(obj.users_collection):
        col.objects.unlink(obj)
    ACTIVE.objects.link(obj)
    return obj

# ---------------------------------------------------------------------
# MATERIALS: WORLD-SPACE WEATHERING, VARIABLE ROUGHNESS, MICRORELIEF
# ---------------------------------------------------------------------

def hex_to_linear(hex_str):
    hex_str = hex_str.lstrip("#")
    r = int(hex_str[0:2], 16) / 255.0
    g = int(hex_str[2:4], 16) / 255.0
    b = int(hex_str[4:6], 16) / 255.0
    return (r ** 2.2, g ** 2.2, b ** 2.2)

def simple_mat(name, color, roughness=.65, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bs = mat.node_tree.nodes.get("Principled BSDF")
    bs.inputs["Base Color"].default_value = (*color, 1)
    bs.inputs["Roughness"].default_value = roughness
    bs.inputs["Metallic"].default_value = metallic
    return mat

def aged_mat(name, color, roughness=.85, strength=.25, bump_distance=.035):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    n.clear()

    out = n.new("ShaderNodeOutputMaterial")
    bs = n.new("ShaderNodeBsdfPrincipled")
    bs.inputs["Roughness"].default_value = roughness
    l.new(bs.outputs["BSDF"], out.inputs["Surface"])

    geom = n.new("ShaderNodeNewGeometry")

    coarse = n.new("ShaderNodeTexNoise")
    coarse.inputs["Scale"].default_value = .82
    coarse.inputs["Detail"].default_value = 5
    coarse.inputs["Roughness"].default_value = .78
    l.new(geom.outputs["Position"], coarse.inputs["Vector"])

    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = .18
    ramp.color_ramp.elements[0].color = (
        color[0] * (1-strength),
        color[1] * (1-strength),
        color[2] * (1-strength), 1)
    ramp.color_ramp.elements[1].position = .82
    ramp.color_ramp.elements[1].color = (
        min(1, color[0]*1.07),
        min(1, color[1]*1.05),
        min(1, color[2]*1.03), 1)
    l.new(coarse.outputs["Fac"], ramp.inputs["Fac"])

    stretch = n.new("ShaderNodeVectorMath")
    stretch.operation = "MULTIPLY"
    stretch.inputs[1].default_value = (10, 10, .55)
    l.new(geom.outputs["Position"], stretch.inputs[0])

    rain = n.new("ShaderNodeTexNoise")
    rain.inputs["Scale"].default_value = 1.0
    rain.inputs["Detail"].default_value = 3
    l.new(stretch.outputs["Vector"], rain.inputs["Vector"])

    rain_ramp = n.new("ShaderNodeValToRGB")
    rain_ramp.color_ramp.elements[0].position = .3
    rain_ramp.color_ramp.elements[0].color = (.45, .43, .36, 1)
    rain_ramp.color_ramp.elements[1].position = .62
    rain_ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
    l.new(rain.outputs["Fac"], rain_ramp.inputs["Fac"])

    mix = n.new("ShaderNodeMixRGB")
    mix.blend_type = "MULTIPLY"
    mix.inputs[0].default_value = .03
    l.new(ramp.outputs["Color"], mix.inputs[1])
    l.new(rain_ramp.outputs["Color"], mix.inputs[2])
    l.new(mix.outputs[0], bs.inputs["Base Color"])

    micro = n.new("ShaderNodeTexNoise")
    micro.inputs["Scale"].default_value = 105
    micro.inputs["Detail"].default_value = 3
    l.new(geom.outputs["Position"], micro.inputs["Vector"])

    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = .12
    bump.inputs["Distance"].default_value = bump_distance
    l.new(micro.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], bs.inputs["Normal"])

    return mat

def wall_plaster_weathered_mat(name, base_hex="#D8D0C2", roughness=0.94):
    """
    Main exterior walls: warm aged ivory / cream cement-plaster exterior (#D8D0C2).
    Real stucco texture: slightly rough, fine granular surface, microscopic bumps,
    uneven plaster undulation, very low gloss/matte reflectance.
    Aged paint containing subtle variations of ivory, beige, dusty grey and faint brown tones.
    Accumulated airborne dust, vertical rainwater streaks, localized dirt, faded areas,
    naturally irregular discoloration, and severe foundation plinth weathering.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    n.clear()

    out = n.new("ShaderNodeOutputMaterial")
    bs = n.new("ShaderNodeBsdfPrincipled")
    bs.inputs["Roughness"].default_value = roughness
    if "Specular IOR Level" in bs.inputs:
        bs.inputs["Specular IOR Level"].default_value = 0.14
    elif "Specular" in bs.inputs:
        bs.inputs["Specular"].default_value = 0.14
    if "Metallic" in bs.inputs:
        bs.inputs["Metallic"].default_value = 0.0
    l.new(bs.outputs["BSDF"], out.inputs["Surface"])

    geom = n.new("ShaderNodeNewGeometry")
    pos = geom.outputs["Position"]
    norm = geom.outputs["Normal"]

    # 1. Authentic color variation: ivory (#D8D0C2), beige, dusty grey, and faint brown tones
    col_brown     = hex_to_linear("#B8A58D") # Weathered dusty beige-brown
    col_grey      = hex_to_linear("#C9C1B2") # Cement-plaster dusty grey
    col_beige     = hex_to_linear("#D0C7B6") # Warm light beige
    col_base      = hex_to_linear(base_hex)   # #D8D0C2 warm ivory / light cream
    col_highlight = hex_to_linear("#DDD4C4") # Sun-aged cream (not bleached white)

    coarse = n.new("ShaderNodeTexNoise")
    coarse.inputs["Scale"].default_value = 0.70
    coarse.inputs["Detail"].default_value = 4.0
    coarse.inputs["Roughness"].default_value = 0.68
    l.new(pos, coarse.inputs["Vector"])

    ramp_color = n.new("ShaderNodeValToRGB")
    ramp_color.color_ramp.elements[0].position = 0.06
    ramp_color.color_ramp.elements[0].color = (*col_brown, 1.0)
    ramp_color.color_ramp.elements[1].position = 0.28
    ramp_color.color_ramp.elements[1].color = (*col_grey, 1.0)
    e3 = ramp_color.color_ramp.elements.new(0.55)
    e3.color = (*col_beige, 1.0)
    e4 = ramp_color.color_ramp.elements.new(0.80)
    e4.color = (*col_base, 1.0)
    e5 = ramp_color.color_ramp.elements.new(0.96)
    e5.color = (*col_highlight, 1.0)
    l.new(coarse.outputs["Fac"], ramp_color.inputs["Fac"])

    # 1b. Large-scale sun-fading vs unexposed patches
    macro_noise = n.new("ShaderNodeTexNoise")
    macro_noise.inputs["Scale"].default_value = 0.18
    macro_noise.inputs["Detail"].default_value = 2.0
    l.new(pos, macro_noise.inputs["Vector"])

    macro_ramp = n.new("ShaderNodeValToRGB")
    macro_ramp.color_ramp.elements[0].position = 0.25
    macro_ramp.color_ramp.elements[0].color = (0.90, 0.88, 0.85, 1.0)
    macro_ramp.color_ramp.elements[1].position = 0.75
    macro_ramp.color_ramp.elements[1].color = (1.02, 1.01, 0.98, 1.0)
    l.new(macro_noise.outputs["Fac"], macro_ramp.inputs["Fac"])

    mix_patchy = n.new("ShaderNodeMixRGB")
    mix_patchy.blend_type = "MULTIPLY"
    mix_patchy.inputs[0].default_value = 0.55
    l.new(ramp_color.outputs["Color"], mix_patchy.inputs[1])
    l.new(macro_ramp.outputs["Color"], mix_patchy.inputs[2])

    # 2. Accumulated airborne dust on horizontal ledges and upward faces
    sep_norm = n.new("ShaderNodeSeparateXYZ")
    l.new(norm, sep_norm.inputs["Vector"])

    dust_range = n.new("ShaderNodeMapRange")
    dust_range.inputs["From Min"].default_value = 0.20
    dust_range.inputs["From Max"].default_value = 0.90
    dust_range.inputs["To Min"].default_value = 0.0
    dust_range.inputs["To Max"].default_value = 0.50
    l.new(sep_norm.outputs["Z"], dust_range.inputs["Value"])

    dust_col = hex_to_linear("#B4A996")
    mix_dust = n.new("ShaderNodeMixRGB")
    mix_dust.blend_type = "MIX"
    l.new(dust_range.outputs["Result"], mix_dust.inputs[0])
    l.new(mix_patchy.outputs["Color"], mix_dust.inputs[1])
    mix_dust.inputs[2].default_value = (*dust_col, 1.0)

    # 3. Vertical rainwater streaking underneath edges and projections
    stretch = n.new("ShaderNodeVectorMath")
    stretch.operation = "MULTIPLY"
    stretch.inputs[1].default_value = (1.6, 1.6, 0.08)
    l.new(pos, stretch.inputs[0])

    rain_noise = n.new("ShaderNodeTexNoise")
    rain_noise.inputs["Scale"].default_value = 1.15
    rain_noise.inputs["Detail"].default_value = 4.0
    l.new(stretch.outputs["Vector"], rain_noise.inputs["Vector"])

    rain_ramp = n.new("ShaderNodeValToRGB")
    rain_ramp.color_ramp.elements[0].position = 0.24
    rain_ramp.color_ramp.elements[0].color = (0.24, 0.21, 0.17, 1.0)
    rain_ramp.color_ramp.elements[1].position = 0.60
    rain_ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1.0)
    l.new(rain_noise.outputs["Fac"], rain_ramp.inputs["Fac"])

    mix_streaks = n.new("ShaderNodeMixRGB")
    mix_streaks.blend_type = "MULTIPLY"
    mix_streaks.inputs[0].default_value = 0.38
    l.new(mix_dust.outputs["Color"], mix_streaks.inputs[1])
    l.new(rain_ramp.outputs["Color"], mix_streaks.inputs[2])

    # 4. Lower plinth/foundation significantly stronger weathering (Z < 1.85m)
    sep_pos = n.new("ShaderNodeSeparateXYZ")
    l.new(pos, sep_pos.inputs["Vector"])

    plinth_range = n.new("ShaderNodeMapRange")
    plinth_range.inputs["From Min"].default_value = -0.90
    plinth_range.inputs["From Max"].default_value = 1.85
    plinth_range.inputs["To Min"].default_value = 1.0
    plinth_range.inputs["To Max"].default_value = 0.0
    l.new(sep_pos.outputs["Z"], plinth_range.inputs["Value"])

    # Mottled damp moisture staining and splash dirt
    plinth_noise = n.new("ShaderNodeTexNoise")
    plinth_noise.inputs["Scale"].default_value = 3.5
    plinth_noise.inputs["Detail"].default_value = 3.5
    l.new(pos, plinth_noise.inputs["Vector"])

    plinth_mult = n.new("ShaderNodeMath")
    plinth_mult.operation = "MULTIPLY"
    l.new(plinth_range.outputs["Result"], plinth_mult.inputs[0])
    l.new(plinth_noise.outputs["Fac"], plinth_mult.inputs[1])

    damp_black_dirt = (0.05, 0.05, 0.045, 1.0)
    mix_plinth = n.new("ShaderNodeMixRGB")
    mix_plinth.blend_type = "MULTIPLY"
    l.new(plinth_mult.outputs["Value"], mix_plinth.inputs[0])
    l.new(mix_streaks.outputs["Color"], mix_plinth.inputs[1])
    mix_plinth.inputs[2].default_value = damp_black_dirt

    # 5. Ambient Occlusion crevice grime pooling
    ao = n.new("ShaderNodeAmbientOcclusion")
    ao.inputs["Distance"].default_value = 1.35
    ao_ramp = n.new("ShaderNodeValToRGB")
    ao_ramp.color_ramp.elements[0].position = 0.05
    ao_ramp.color_ramp.elements[0].color = (0.20, 0.18, 0.15, 1.0)
    ao_ramp.color_ramp.elements[1].position = 0.90
    ao_ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1.0)
    l.new(ao.outputs["AO"], ao_ramp.inputs["Fac"])

    mix_ao = n.new("ShaderNodeMixRGB")
    mix_ao.blend_type = "MULTIPLY"
    mix_ao.inputs[0].default_value = 0.68
    l.new(mix_plinth.outputs["Color"], mix_ao.inputs[1])
    l.new(ao_ramp.outputs["Color"], mix_ao.inputs[2])

    # 6. Realistic Plaster Cracking: Locally clustered hairline cracks and upper branching fissures
    # Cracks follow realistic plaster stress behaviour rather than appearing as repeated procedural lines everywhere
    crack_mask_noise = n.new("ShaderNodeTexNoise")
    crack_mask_noise.inputs["Scale"].default_value = 1.2
    crack_mask_noise.inputs["Detail"].default_value = 3.5
    l.new(pos, crack_mask_noise.inputs["Vector"])

    crack_mask = n.new("ShaderNodeMapRange")
    crack_mask.inputs["From Min"].default_value = 0.50
    crack_mask.inputs["From Max"].default_value = 0.65
    crack_mask.inputs["To Min"].default_value = 0.0
    crack_mask.inputs["To Max"].default_value = 1.0
    crack_mask.clamp = True
    l.new(crack_mask_noise.outputs["Fac"], crack_mask.inputs["Value"])

    vor_crack_fine = n.new("ShaderNodeTexVoronoi")
    vor_crack_fine.feature = "DISTANCE_TO_EDGE"
    vor_crack_fine.inputs["Scale"].default_value = 18.0
    l.new(pos, vor_crack_fine.inputs["Vector"])

    vor_crack_branch = n.new("ShaderNodeTexVoronoi")
    vor_crack_branch.feature = "DISTANCE_TO_EDGE"
    vor_crack_branch.inputs["Scale"].default_value = 5.2
    l.new(pos, vor_crack_branch.inputs["Vector"])

    crack_comb = n.new("ShaderNodeMath")
    crack_comb.operation = "MINIMUM"
    l.new(vor_crack_fine.outputs["Distance"], crack_comb.inputs[0])
    l.new(vor_crack_branch.outputs["Distance"], crack_comb.inputs[1])

    crack_ramp = n.new("ShaderNodeValToRGB")
    crack_ramp.color_ramp.elements[0].position = 0.007
    crack_ramp.color_ramp.elements[0].color = (0.08, 0.07, 0.05, 1.0)
    crack_ramp.color_ramp.elements[1].position = 0.024
    crack_ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1.0)
    l.new(crack_comb.outputs["Value"], crack_ramp.inputs["Fac"])

    # Isolate cracks into realistic organic clusters matching real plaster stress zones
    crack_isolated = n.new("ShaderNodeMixRGB")
    crack_isolated.blend_type = "MIX"
    l.new(crack_mask.outputs["Result"], crack_isolated.inputs[0])
    crack_isolated.inputs[1].default_value = (1.0, 1.0, 1.0, 1.0)
    l.new(crack_ramp.outputs["Color"], crack_isolated.inputs[2])

    mix_cracks = n.new("ShaderNodeMixRGB")
    mix_cracks.blend_type = "MULTIPLY"
    mix_cracks.inputs[0].default_value = 0.82
    l.new(mix_ao.outputs["Color"], mix_cracks.inputs[1])
    l.new(crack_isolated.outputs["Color"], mix_cracks.inputs[2])
    l.new(mix_cracks.outputs["Color"], bs.inputs["Base Color"])

    # 7. Four-tier physical surface relief:
    # Plaster trowel waviness (Scale=2.2) + Plinth degradation chip + micro bumps (Scale=55) + stucco grit (Scale=190)
    plaster_wave = n.new("ShaderNodeTexNoise")
    plaster_wave.inputs["Scale"].default_value = 2.2
    plaster_wave.inputs["Detail"].default_value = 2.5
    l.new(pos, plaster_wave.inputs["Vector"])

    bump_wave = n.new("ShaderNodeBump")
    bump_wave.inputs["Strength"].default_value = 0.18
    bump_wave.inputs["Distance"].default_value = 0.025
    l.new(plaster_wave.outputs["Fac"], bump_wave.inputs["Height"])

    # Crack physical indentation bump (only in active crack clusters)
    crack_bump = n.new("ShaderNodeBump")
    crack_bump.inputs["Strength"].default_value = 0.38
    crack_bump.inputs["Distance"].default_value = 0.008
    l.new(crack_isolated.outputs["Color"], crack_bump.inputs["Height"])
    l.new(bump_wave.outputs["Normal"], crack_bump.inputs["Normal"])

    micro_bumps = n.new("ShaderNodeTexNoise")
    micro_bumps.inputs["Scale"].default_value = 55.0
    micro_bumps.inputs["Detail"].default_value = 4.0
    l.new(pos, micro_bumps.inputs["Vector"])

    bump_micro = n.new("ShaderNodeBump")
    bump_micro.inputs["Strength"].default_value = 0.22
    bump_micro.inputs["Distance"].default_value = 0.010
    l.new(micro_bumps.outputs["Fac"], bump_micro.inputs["Height"])
    l.new(crack_bump.outputs["Normal"], bump_micro.inputs["Normal"])

    stucco_grit = n.new("ShaderNodeTexNoise")
    stucco_grit.inputs["Scale"].default_value = 190.0
    stucco_grit.inputs["Detail"].default_value = 5.0
    stucco_grit.inputs["Roughness"].default_value = 0.85
    l.new(pos, stucco_grit.inputs["Vector"])

    bump_grit = n.new("ShaderNodeBump")
    bump_grit.inputs["Strength"].default_value = 0.32
    bump_grit.inputs["Distance"].default_value = 0.005
    l.new(stucco_grit.outputs["Fac"], bump_grit.inputs["Height"])
    l.new(bump_micro.outputs["Normal"], bump_grit.inputs["Normal"])
    l.new(bump_grit.outputs["Normal"], bs.inputs["Normal"])

    return mat

def column_textured_mat(name, base_hex="#9A7358"):
    """
    Round columns: muted dusty terracotta / beige-brown plaster finish (#9A7358).
    Rough granular surface, subtle fading, dust and slight colour variation.
    Textured plaster/concrete exterior coating with shadows and matte finish.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    n.clear()

    out = n.new("ShaderNodeOutputMaterial")
    bs = n.new("ShaderNodeBsdfPrincipled")
    bs.inputs["Roughness"].default_value = 0.94
    if "Specular IOR Level" in bs.inputs:
        bs.inputs["Specular IOR Level"].default_value = 0.12
    elif "Specular" in bs.inputs:
        bs.inputs["Specular"].default_value = 0.12
    if "Metallic" in bs.inputs:
        bs.inputs["Metallic"].default_value = 0.0
    l.new(bs.outputs["BSDF"], out.inputs["Surface"])

    geom = n.new("ShaderNodeNewGeometry")
    pos = geom.outputs["Position"]

    base_col = hex_to_linear(base_hex) # #9A7358
    col_dark = hex_to_linear("#75533A") # Deep aged terracotta in crevices & undersides
    col_mid  = hex_to_linear("#8E6549") # Dusty terracotta tone
    col_fade = hex_to_linear("#9E775B") # Faded terracotta highlight (#9E775B)

    # Subtle fading and natural colour variation across columns
    coarse = n.new("ShaderNodeTexNoise")
    coarse.inputs["Scale"].default_value = 35.0
    coarse.inputs["Detail"].default_value = 4.0
    coarse.inputs["Roughness"].default_value = 0.70
    l.new(pos, coarse.inputs["Vector"])

    ramp_color = n.new("ShaderNodeValToRGB")
    ramp_color.color_ramp.elements[0].position = 0.12
    ramp_color.color_ramp.elements[0].color = (*col_dark, 1.0)
    ramp_color.color_ramp.elements[1].position = 0.50
    ramp_color.color_ramp.elements[1].color = (*col_mid, 1.0)
    e3 = ramp_color.color_ramp.elements.new(0.85)
    e3.color = (*col_fade, 1.0)
    l.new(coarse.outputs["Fac"], ramp_color.inputs["Fac"])

    # Ambient occlusion in collar grooves and capital junctions
    ao = n.new("ShaderNodeAmbientOcclusion")
    ao.inputs["Distance"].default_value = 0.8
    ao_ramp = n.new("ShaderNodeValToRGB")
    ao_ramp.color_ramp.elements[0].position = 0.10
    ao_ramp.color_ramp.elements[0].color = (0.20, 0.13, 0.08, 1.0)
    ao_ramp.color_ramp.elements[1].position = 0.85
    ao_ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1.0)
    l.new(ao.outputs["AO"], ao_ramp.inputs["Fac"])

    mix_ao = n.new("ShaderNodeMixRGB")
    mix_ao.blend_type = "MULTIPLY"
    mix_ao.inputs[0].default_value = 0.58
    l.new(ramp_color.outputs["Color"], mix_ao.inputs[1])
    l.new(ao_ramp.outputs["Color"], mix_ao.inputs[2])
    l.new(mix_ao.outputs["Color"], bs.inputs["Base Color"])

    # Heavy granular sand/stucco coating bump
    gran_noise = n.new("ShaderNodeTexNoise")
    gran_noise.inputs["Scale"].default_value = 210.0
    gran_noise.inputs["Detail"].default_value = 5.0
    gran_noise.inputs["Roughness"].default_value = 0.90
    l.new(pos, gran_noise.inputs["Vector"])

    bump_gran = n.new("ShaderNodeBump")
    bump_gran.inputs["Strength"].default_value = 0.65
    bump_gran.inputs["Distance"].default_value = 0.025
    l.new(gran_noise.outputs["Fac"], bump_gran.inputs["Height"])

    # Plaster undulation
    wave = n.new("ShaderNodeTexNoise")
    wave.inputs["Scale"].default_value = 3.5
    wave.inputs["Detail"].default_value = 3.0
    l.new(pos, wave.inputs["Vector"])

    bump_wave = n.new("ShaderNodeBump")
    bump_wave.inputs["Strength"].default_value = 0.25
    bump_wave.inputs["Distance"].default_value = 0.015
    l.new(wave.outputs["Fac"], bump_wave.inputs["Height"])
    l.new(bump_wave.outputs["Normal"], bump_gran.inputs["Normal"])
    l.new(bump_gran.outputs["Normal"], bs.inputs["Normal"])

    return mat

def recessed_area_mat(name, base_hex="#A98A72"):
    """
    Recessed architectural area around the windows: muted warm beige / dusty peach (#A98A72).
    Slightly darker than the main wall due to material and recessed lighting.
    Brownish weather stains around recesses.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    n.clear()

    out = n.new("ShaderNodeOutputMaterial")
    bs = n.new("ShaderNodeBsdfPrincipled")
    bs.inputs["Roughness"].default_value = 0.90
    if "Specular IOR Level" in bs.inputs:
        bs.inputs["Specular IOR Level"].default_value = 0.16
    elif "Specular" in bs.inputs:
        bs.inputs["Specular"].default_value = 0.16
    if "Metallic" in bs.inputs:
        bs.inputs["Metallic"].default_value = 0.0
    l.new(bs.outputs["BSDF"], out.inputs["Surface"])

    geom = n.new("ShaderNodeNewGeometry")
    pos = geom.outputs["Position"]

    base_col = hex_to_linear(base_hex) # #A98A72

    # Brownish weather stains around architectural recesses
    stain_noise = n.new("ShaderNodeTexNoise")
    stain_noise.inputs["Scale"].default_value = 3.2
    stain_noise.inputs["Detail"].default_value = 3.5
    l.new(pos, stain_noise.inputs["Vector"])

    stain_ramp = n.new("ShaderNodeValToRGB")
    stain_ramp.color_ramp.elements[0].position = 0.25
    stain_ramp.color_ramp.elements[0].color = (base_col[0] * 0.65, base_col[1] * 0.58, base_col[2] * 0.50, 1.0)
    stain_ramp.color_ramp.elements[1].position = 0.75
    stain_ramp.color_ramp.elements[1].color = (base_col[0], base_col[1], base_col[2], 1.0)
    l.new(stain_noise.outputs["Fac"], stain_ramp.inputs["Fac"])

    # Ambient occlusion shadow in recesses
    ao = n.new("ShaderNodeAmbientOcclusion")
    ao.inputs["Distance"].default_value = 1.0
    ao_ramp = n.new("ShaderNodeValToRGB")
    ao_ramp.color_ramp.elements[0].position = 0.05
    ao_ramp.color_ramp.elements[0].color = (0.35, 0.28, 0.22, 1.0)
    ao_ramp.color_ramp.elements[1].position = 0.85
    ao_ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1.0)
    l.new(ao.outputs["AO"], ao_ramp.inputs["Fac"])

    mix_ao = n.new("ShaderNodeMixRGB")
    mix_ao.blend_type = "MULTIPLY"
    mix_ao.inputs[0].default_value = 0.55
    l.new(stain_ramp.outputs["Color"], mix_ao.inputs[1])
    l.new(ao_ramp.outputs["Color"], mix_ao.inputs[2])
    l.new(mix_ao.outputs["Color"], bs.inputs["Base Color"])

    # Plaster bump
    bump_noise = n.new("ShaderNodeTexNoise")
    bump_noise.inputs["Scale"].default_value = 120.0
    bump_noise.inputs["Detail"].default_value = 4.0
    l.new(pos, bump_noise.inputs["Vector"])

    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.24
    bump.inputs["Distance"].default_value = 0.012
    l.new(bump_noise.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], bs.inputs["Normal"])

    return mat

def weathered_band_mat(name, base_hex="#8C7F70"):
    """
    Top horizontal bands/parapet edges: greyish beige/brown from accumulated dirt and weathering (#8C7F70).
    Upward-facing horizontal surfaces accumulate heavy atmospheric soot and grime.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    n.clear()

    out = n.new("ShaderNodeOutputMaterial")
    bs = n.new("ShaderNodeBsdfPrincipled")
    bs.inputs["Roughness"].default_value = 0.88
    if "Specular IOR Level" in bs.inputs:
        bs.inputs["Specular IOR Level"].default_value = 0.16
    elif "Specular" in bs.inputs:
        bs.inputs["Specular"].default_value = 0.16
    l.new(bs.outputs["BSDF"], out.inputs["Surface"])

    geom = n.new("ShaderNodeNewGeometry")
    pos = geom.outputs["Position"]
    norm = geom.outputs["Normal"]

    base_col = hex_to_linear(base_hex)

    # Accumulate dirt on upward-facing edges (Normal Z > 0.18)
    sep_norm = n.new("ShaderNodeSeparateXYZ")
    l.new(norm, sep_norm.inputs["Vector"])

    norm_range = n.new("ShaderNodeMapRange")
    norm_range.inputs["From Min"].default_value = 0.18
    norm_range.inputs["From Max"].default_value = 0.85
    norm_range.inputs["To Min"].default_value = 0.0
    norm_range.inputs["To Max"].default_value = 0.70
    l.new(sep_norm.outputs["Z"], norm_range.inputs["Value"])

    mix_dirt = n.new("ShaderNodeMixRGB")
    mix_dirt.blend_type = "MULTIPLY"
    mix_dirt.inputs[1].default_value = (*base_col, 1.0)
    mix_dirt.inputs[2].default_value = (0.24, 0.22, 0.19, 1.0)
    l.new(norm_range.outputs["Result"], mix_dirt.inputs[0])
    l.new(mix_dirt.outputs["Color"], bs.inputs["Base Color"])

    # Micro bump
    b_noise = n.new("ShaderNodeTexNoise")
    b_noise.inputs["Scale"].default_value = 105.0
    b_noise.inputs["Detail"].default_value = 3.5
    l.new(pos, b_noise.inputs["Vector"])

    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.22
    bump.inputs["Distance"].default_value = 0.015
    l.new(b_noise.outputs["Fac"], bump.inputs["Height"])
    l.new(bump.outputs["Normal"], bs.inputs["Normal"])

    return mat

def dark_reflective_glass_mat(name, base_hex="#11161B", roughness=0.055):
    """
    Window glass: dark charcoal / blue-black reflective glass (#11161B),
    with realistic subtle reflections rather than flat black material.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bs = nt.nodes.get("Principled BSDF")

    base_col = hex_to_linear(base_hex)
    bs.inputs["Base Color"].default_value = (*base_col, 1.0)
    bs.inputs["Roughness"].default_value = roughness
    if "Metallic" in bs.inputs:
        bs.inputs["Metallic"].default_value = 0.08
    if "IOR" in bs.inputs:
        bs.inputs["IOR"].default_value = 1.52
    if "Transmission Weight" in bs.inputs:
        bs.inputs["Transmission Weight"].default_value = 0.12
    elif "Transmission" in bs.inputs:
        bs.inputs["Transmission"].default_value = 0.12
    if "Specular IOR Level" in bs.inputs:
        bs.inputs["Specular IOR Level"].default_value = 1.0
    elif "Specular" in bs.inputs:
        bs.inputs["Specular"].default_value = 1.0

    return mat

def aged_silver_grill_mat(name, base_hex="#5C6063"):
    """
    Window grills: aged metallic silver/grey with slight oxidation,
    dirt accumulation and realistic metal roughness. Not clean or uniformly bright.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    n.clear()

    out = n.new("ShaderNodeOutputMaterial")
    bs = n.new("ShaderNodeBsdfPrincipled")
    bs.inputs["Roughness"].default_value = 0.58
    if "Metallic" in bs.inputs:
        bs.inputs["Metallic"].default_value = 0.75
    l.new(bs.outputs["BSDF"], out.inputs["Surface"])

    geom = n.new("ShaderNodeNewGeometry")
    pos = geom.outputs["Position"]

    base_col = hex_to_linear(base_hex)
    noise = n.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 95.0
    noise.inputs["Detail"].default_value = 4.0
    l.new(pos, noise.inputs["Vector"])

    ramp = n.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.32
    ramp.color_ramp.elements[0].color = (0.04, 0.04, 0.04, 1.0)
    ramp.color_ramp.elements[1].position = 0.68
    ramp.color_ramp.elements[1].color = (*base_col, 1.0)
    l.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    l.new(ramp.outputs["Color"], bs.inputs["Base Color"])

    return mat

def natural_stone_ramp_mat(name):
    """
    Stone-clad ramp/wall: irregular natural grey-blue stone pieces,
    each stone having slightly different colour, roughness and shape, with dark grey grout.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    n.clear()

    out = n.new("ShaderNodeOutputMaterial")
    bs = n.new("ShaderNodeBsdfPrincipled")
    bs.inputs["Roughness"].default_value = 0.85
    if "Metallic" in bs.inputs:
        bs.inputs["Metallic"].default_value = 0.0
    l.new(bs.outputs["BSDF"], out.inputs["Surface"])

    geom = n.new("ShaderNodeNewGeometry")
    pos = geom.outputs["Position"]

    vor = n.new("ShaderNodeTexVoronoi")
    vor.feature = "DISTANCE_TO_EDGE"
    vor.inputs["Scale"].default_value = 8.0
    l.new(pos, vor.inputs["Vector"])

    # Voronoi cell noise for stone color variations
    noise_stone = n.new("ShaderNodeTexNoise")
    noise_stone.inputs["Scale"].default_value = 2.2
    l.new(pos, noise_stone.inputs["Vector"])

    stone_ramp = n.new("ShaderNodeValToRGB")
    # Irregular natural grey-blue stone pieces
    c1 = hex_to_linear("#556470") # Slate blue-grey
    c2 = hex_to_linear("#3E4A54") # Deep charcoal-blue
    c3 = hex_to_linear("#687988") # Light dusty grey-blue
    c4 = hex_to_linear("#5C6166") # Earthy grey stone
    stone_ramp.color_ramp.elements[0].position = 0.0
    stone_ramp.color_ramp.elements[0].color = (*c2, 1.0)
    stone_ramp.color_ramp.elements[1].position = 0.35
    stone_ramp.color_ramp.elements[1].color = (*c1, 1.0)
    e3 = stone_ramp.color_ramp.elements.new(0.70)
    e3.color = (*c3, 1.0)
    e4 = stone_ramp.color_ramp.elements.new(1.0)
    e4.color = (*c4, 1.0)
    l.new(noise_stone.outputs["Fac"], stone_ramp.inputs["Fac"])

    # Mortar grout: dark grey #222528
    grout_col = hex_to_linear("#222528")
    grout_ramp = n.new("ShaderNodeValToRGB")
    grout_ramp.color_ramp.elements[0].position = 0.065
    grout_ramp.color_ramp.elements[0].color = (0.0, 0.0, 0.0, 1.0)
    grout_ramp.color_ramp.elements[1].position = 0.095
    grout_ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1.0)
    l.new(vor.outputs["Distance"], grout_ramp.inputs["Fac"])

    mix_grout = n.new("ShaderNodeMixRGB")
    mix_grout.blend_type = "MIX"
    l.new(grout_ramp.outputs["Color"], mix_grout.inputs[0])
    mix_grout.inputs[1].default_value = (*grout_col, 1.0)
    l.new(stone_ramp.outputs["Color"], mix_grout.inputs[2])
    l.new(mix_grout.outputs["Color"], bs.inputs["Base Color"])

    # Bump relief: stone blocks raised, grout recessed + natural stone roughness
    bump = n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.42
    bump.inputs["Distance"].default_value = 0.024
    l.new(grout_ramp.outputs["Color"], bump.inputs["Height"])

    stone_grit = n.new("ShaderNodeTexNoise")
    stone_grit.inputs["Scale"].default_value = 85.0
    stone_grit.inputs["Detail"].default_value = 3.0
    l.new(pos, stone_grit.inputs["Vector"])

    bump_grit = n.new("ShaderNodeBump")
    bump_grit.inputs["Strength"].default_value = 0.20
    bump_grit.inputs["Distance"].default_value = 0.008
    l.new(stone_grit.outputs["Fac"], bump_grit.inputs["Height"])
    l.new(bump.outputs["Normal"], bump_grit.inputs["Normal"])
    l.new(bump_grit.outputs["Normal"], bs.inputs["Normal"])

    return mat

def plinth_foundation_mat(name):
    """
    Lower plinth/foundation significantly stronger weathering:
    cracked plaster/concrete, black-grey moisture staining, accumulated dirt,
    dark edges, chipped areas and irregular surface deterioration.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    n, l = nt.nodes, nt.links
    n.clear()

    out = n.new("ShaderNodeOutputMaterial")
    bs = n.new("ShaderNodeBsdfPrincipled")
    bs.inputs["Roughness"].default_value = 0.96
    l.new(bs.outputs["BSDF"], out.inputs["Surface"])

    geom = n.new("ShaderNodeNewGeometry")
    pos = geom.outputs["Position"]

    # Heavy black-grey staining and splash-back earth dirt
    noise_damp = n.new("ShaderNodeTexNoise")
    noise_damp.inputs["Scale"].default_value = 4.2
    noise_damp.inputs["Detail"].default_value = 4.0
    l.new(pos, noise_damp.inputs["Vector"])

    ramp_damp = n.new("ShaderNodeValToRGB")
    c_dirt = hex_to_linear("#34302A")
    c_moist = hex_to_linear("#212324")
    c_base = hex_to_linear("#8E877B")
    ramp_damp.color_ramp.elements[0].position = 0.20
    ramp_damp.color_ramp.elements[0].color = (*c_moist, 1.0)
    ramp_damp.color_ramp.elements[1].position = 0.55
    ramp_damp.color_ramp.elements[1].color = (*c_dirt, 1.0)
    e3 = ramp_damp.color_ramp.elements.new(0.85)
    e3.color = (*c_base, 1.0)
    l.new(noise_damp.outputs["Fac"], ramp_damp.inputs["Fac"])
    l.new(ramp_damp.outputs["Color"], bs.inputs["Base Color"])

    # Chipped plaster/concrete surface deterioration bump
    chip_noise = n.new("ShaderNodeTexNoise")
    chip_noise.inputs["Scale"].default_value = 25.0
    chip_noise.inputs["Detail"].default_value = 5.0
    chip_noise.inputs["Roughness"].default_value = 0.85
    l.new(pos, chip_noise.inputs["Vector"])

    bump_chip = n.new("ShaderNodeBump")
    bump_chip.inputs["Strength"].default_value = 0.55
    bump_chip.inputs["Distance"].default_value = 0.035
    l.new(chip_noise.outputs["Fac"], bump_chip.inputs["Height"])
    l.new(bump_chip.outputs["Normal"], bs.inputs["Normal"])

    return mat

# Calibrated Architectural Material Palette
cream = wall_plaster_weathered_mat("Main warm ivory exterior plaster", "#D8D0C2", roughness=0.92)
pink = recessed_area_mat("Recessed architectural peach", "#A98A72")
trim = weathered_band_mat("Top weathered horizontal bands", "#8C7F70")
mat_column = column_textured_mat("Granular column exterior finish", "#9A7358")
mat_stone_ramp = natural_stone_ramp_mat("Irregular grey-blue stone masonry")
mat_window_grill = aged_silver_grill_mat("Aged silver oxidised window grill", "#63666A")

concrete = plinth_foundation_mat("Weathered foundation concrete")
panel = aged_mat("Inset ochre aggregate panels", (.48, .36, .22), roughness=.88, strength=.16, bump_distance=.03)
white = aged_mat("Warm off-white interior plaster", (.76, .74, .70), roughness=.90, strength=.05)
red = aged_mat("Aged terracotta red stair stone", (.36, .17, .12), roughness=.88, strength=.22, bump_distance=.018)
stone = aged_mat("Weathered cream stair stone", (.65, .62, .54), roughness=.86, strength=.16)
asphalt = aged_mat("Forecourt paving", (.20, .21, .20), roughness=.92, strength=.25, bump_distance=.03)
soil = aged_mat("Compacted soil", (.16, .12, .08), strength=.25)
moss = aged_mat("Landscaping greenery", (.18, .25, .12), strength=.25)
tile = aged_mat("Speckled terrazzo floor", (.52, .54, .53), roughness=.22, strength=.12, bump_distance=.006)
grout = simple_mat("Tile joints", (.35, .36, .35))
metal = simple_mat("Aged dark bronze/charcoal window frame", (.18, .20, .22), .62, .75)
railmat = simple_mat("Aged silver-grey railing", (.38, .40, .42), .52, .68)
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
mat_skirting_granite = simple_mat("Dark granite skirting", (.18, .19, .20), .20)

# Window Glass: Very dark charcoal / blue-black (#11161B), highly reflective
glass_mats = []
for i in range(5):
    glass_mats.append(dark_reflective_glass_mat(
        "Highly reflective dark charcoal glazing %02d" % i,
        "#11161B",
        roughness=0.04 + 0.01 * i
    ))

skylight_glass = simple_mat("Clouded skylight glass", (.56, .63, .64), .22)
bs = skylight_glass.node_tree.nodes.get("Principled BSDF")
bs.inputs["Transmission Weight"].default_value = .65
bs.inputs["IOR"].default_value = 1.46

lampmat = simple_mat("Old frosted luminaire diffuser", (.73, .75, .66), .55)


# Transparent, uneven weathering overlays.
stain = bpy.data.materials.new("Patchy algae and rain deposit overlay")
stain.use_nodes = True
nt = stain.node_tree
nt.nodes.clear()
out = nt.nodes.new("ShaderNodeOutputMaterial")
mix = nt.nodes.new("ShaderNodeMixShader")
trans = nt.nodes.new("ShaderNodeBsdfTransparent")
dirt = nt.nodes.new("ShaderNodeBsdfPrincipled")
dirt.inputs["Base Color"].default_value = (.055, .065, .034, 1)
dirt.inputs["Roughness"].default_value = .98
geom = nt.nodes.new("ShaderNodeNewGeometry")
noise = nt.nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value = 20
noise.inputs["Detail"].default_value = 4
nt.links.new(geom.outputs["Position"], noise.inputs["Vector"])
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = .33
ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
ramp.color_ramp.elements[1].position = .73
ramp.color_ramp.elements[1].color = (.78, .78, .78, 1)
nt.links.new(noise.outputs["Fac"], ramp.inputs[0])
nt.links.new(ramp.outputs["Color"], mix.inputs[0])
nt.links.new(trans.outputs[0], mix.inputs[1])
nt.links.new(dirt.outputs[0], mix.inputs[2])
nt.links.new(mix.outputs[0], out.inputs["Surface"])

# ---------------------------------------------------------------------
# GEOMETRY HELPERS
# ---------------------------------------------------------------------

def assign(obj, mat):
    if mat:
        obj.data.materials.append(mat)
    return obj

def box(name, loc, dims, mat=cream, bevel=.015, rz=0):
    dx, dy, dz = dims[0] / 2.0, dims[1] / 2.0, dims[2] / 2.0
    verts = [
        (-dx, -dy, -dz), (dx, -dy, -dz), (dx, dy, -dz), (-dx, dy, -dz),
        (-dx, -dy,  dz), (dx, -dy,  dz), (dx, dy,  dz), (-dx, dy,  dz)
    ]
    faces = [
        (0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1),
        (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)
    ]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    obj.rotation_euler.z = rz
    ACTIVE.objects.link(obj)
    assign(obj, mat)
    if bevel:
        mod = obj.modifiers.new("Small worn edge radius", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    return obj

def mesh_obj(name, verts, faces, mat):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    ACTIVE.objects.link(obj)
    assign(obj, mat)
    return obj

def cylinder(name, loc, radius, depth, mat, vertices=32):
    half_d = depth / 2.0
    verts = []
    for i in range(vertices):
        a = 2 * math.pi * i / vertices
        verts.append((radius * math.cos(a), radius * math.sin(a), -half_d))
    for i in range(vertices):
        a = 2 * math.pi * i / vertices
        verts.append((radius * math.cos(a), radius * math.sin(a), half_d))
    verts.append((0, 0, -half_d))
    verts.append((0, 0, half_d))
    bc, tc = 2 * vertices, 2 * vertices + 1
    faces = []
    for i in range(vertices):
        nxt = (i + 1) % vertices
        faces.append((i, nxt, nxt + vertices, i + vertices))
        faces.append((bc, nxt, i))
        faces.append((tc, i + vertices, nxt + vertices))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    for p in mesh.polygons:
        if len(p.vertices) == 4:
            p.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    ACTIVE.objects.link(obj)
    assign(obj, mat)
    return obj

def rod(name, a, b, radius=.025, mat=metal, vertices=12):
    a, b = Vector(a), Vector(b)
    obj = cylinder(name, (a+b)/2, radius, (b-a).length, mat, vertices)
    obj.rotation_euler = (b-a).to_track_quat("Z", "Y").to_euler()
    return obj

def path(name, pts, radius=.02, mat=metal):
    cv = bpy.data.curves.new(name, "CURVE")
    cv.dimensions = "3D"
    cv.resolution_u = 1
    cv.bevel_depth = radius
    cv.bevel_resolution = 2
    sp = cv.splines.new("POLY")
    sp.points.add(len(pts)-1)
    for p, co in zip(sp.points, pts):
        p.co = (*co, 1)
    obj = bpy.data.objects.new(name, cv)
    ACTIVE.objects.link(obj)
    assign(obj, mat)
    return obj

def polygon_slab(name, points, z0, z1, mat):
    n = len(points)
    verts = [(x,y,z0) for x,y in points] + [(x,y,z1) for x,y in points]
    faces = [tuple(reversed(range(n))), tuple(range(n,2*n))]
    for i in range(n):
        j = (i+1) % n
        faces.append((i,j,j+n,i+n))
    return mesh_obj(name, verts, faces, mat)

def beam_between(name, a, b, z, height, thickness, mat):
    a, b = Vector(a), Vector(b)
    delta = b-a
    return box(name, ((a.x+b.x)/2, (a.y+b.y)/2, z),
               (delta.length, thickness, height), mat, .015,
               math.atan2(delta.y, delta.x))

def wall_box(name, axis, plane, u, z, width, height, thickness, mat):
    if axis == "X":
        return box(name, (u,plane,z), (width,thickness,height), mat)
    return box(name, (plane,u,z), (thickness,width,height), mat)

def wall_with_openings(name, axis, plane, u0, u1, z0, z1,
                       holes, thickness=.40, mat=cream):
    """
    Walls assembled around rectangular openings, not a solid box with
    window textures. holes = [(left,right,bottom,top), ...]
    """
    xs = sorted(set([u0,u1] +
                    [max(u0,min(u1,v)) for h in holes for v in h[:2]]))
    zs = sorted(set([z0,z1] +
                    [max(z0,min(z1,v)) for h in holes for v in h[2:]]))
    for a,b in zip(xs[:-1],xs[1:]):
        for c,d in zip(zs[:-1],zs[1:]):
            if b-a < .001 or d-c < .001:
                continue
            u,z = (a+b)/2,(c+d)/2
            if any(h[0] < u < h[1] and h[2] < z < h[3] for h in holes):
                continue
            wall_box(name,axis,plane,u,z,b-a,d-c,thickness,mat)

def frame_window(name, u, plane, bottom, width, height,
                 axis="X", cols=2, rows=3, grill=False):
    # Geometry lies in a local horizontal U / vertical Z plane.
    def local_box(label, du, depth, z, w, t, h, material, bevel=.004):
        if axis == "X":
            return box(label, (u+du,plane+depth,z), (w,t,h),
                       material, bevel)
        return box(label, (plane+depth,u+du,z), (t,w,h),
                   material, bevel)

    local_box(name+" perimeter seal",0,.045,bottom+height/2,
              width+.045,.055,height+.045,rubber)
    local_box(name+" glass",0,0,bottom+height/2,
              width-.055,.032,height-.055,random.choice(glass_mats))

    for k in range(cols+1):
        x = -width/2 + k*width/cols
        local_box(name+" vertical mullion",x,-.034,bottom+height/2,
                  .045,.065,height,metal)
    for k in range(rows+1):
        z = bottom + k*height/rows
        local_box(name+" horizontal transom",0,-.039,z,
                  width,.07,.044,metal)

    # Small operable-window handle.
    local_box(name+" latch",width*.20,-.09,bottom+height*.47,
              .022,.025,.12,metal)

    if grill:
        for k in range(int(width/.18)+1):
            du = -width/2+k*.18
            local_box(name+" security grille",du,-.15,
                      bottom+height/2,.018,.022,height,mat_window_grill)
        for f in (.2,.5,.8):
            local_box(name+" grille crossbar",0,-.16,bottom+height*f,
                      width,.025,.022,mat_window_grill)

def railing(name, a, b, base, height=1.05, mat=railmat, spacing=.55):
    a,b = Vector(a),Vector(b)
    count = max(1,int((b-a).length/spacing))
    for k in range(count+1):
        p = a.lerp(b,k/count)
        rod(name+" upright",(p.x,p.y,base),(p.x,p.y,base+height),
            .024,mat)
    for dz in (.12,.42,.72,height):
        rod(name+" horizontal",(a.x,a.y,base+dz),
            (b.x,b.y,base+dz),.024 if dz < height else .035,mat)

def column(name,x,y,z0,z1,r=.30,mat=mat_column):
    cylinder(name+" shaft",(x,y,(z0+z1)/2),r,z1-z0,mat,40)
    for z,rr,hh in (
        (z0+.08,r*1.20,.16),(z0+.22,r*1.07,.10),
        (z1-.12,r*1.13,.20),(z1-.025,r*1.22,.06)
    ):
        cylinder(name+" plain collar",(x,y,z),rr,hh,mat,40)

def pediment(x,y,z,width):
    # True triangular prism and sloped mouldings.
    h = .67
    polygon = [(x-width/2,z),(x+width/2,z),(x,z+h)]
    verts = [(a,y-.14,b) for a,b in polygon] + [
             (a,y+.18,b) for a,b in polygon]
    mesh_obj("Triangular pediment",verts,
             [(2,1,0),(3,4,5),(0,1,4,3),(1,2,5,4),(2,0,3,5)],pink)
    box("Pediment entablature",(x,y,z-.13),(width+.16,.56,.27),trim)
    for a,b in ((polygon[0],polygon[2]),(polygon[2],polygon[1])):
        rod("Pediment sloping moulding",(a[0],y-.2,a[1]),
            (b[0],y-.2,b[1]),.068,trim,12)
        rod("Pediment inner raised line",(a[0],y-.225,a[1]-.14),
            (b[0],y-.225,b[1]-.14),.025,pink,8)

def front_streak(x,y,top,length,width):
    # Irregular taper: deliberate concentration beneath ledges/outlets.
    verts = []
    steps = 7
    for i in range(steps):
        t = i/(steps-1)
        w = width*(1-.80*t)*random.uniform(.6,1.2)
        shift = random.uniform(-.17,.17)*width
        z = top-length*t
        verts.extend([(x+shift-w/2,y,z),(x+shift+w/2,y,z)])
    faces = [(2*i,2*i+1,2*i+3,2*i+2) for i in range(steps-1)]
    return mesh_obj("Irregular rain or algae streak",verts,faces,stain)

def panel_band(a,b,z,thickness=.28):
    a,b = Vector(a),Vector(b)
    length = (b-a).length
    angle = math.atan2(b.y-a.y,b.x-a.x)
    tangent = (b-a).normalized()
    # Outward for the ordered portico boundary used below.
    normal = Vector((tangent.y,-tangent.x))
    count = max(1,int(length/1.5))
    for k in range(count):
        p = a.lerp(b,(k+.5)/count)
        p += normal*(thickness/2+.012)
        box("Raised border around aggregate inset",(p.x,p.y,z),
            (.63,.075,.59),trim,.008,angle)
        p += normal*.045
        box("Square textured decorative inset",(p.x,p.y,z),
            (.49,.055,.45),panel,.004,angle)

def ring_mesh(name,cx,cy,z,inner,outer,height,mat,n=96):
    verts=[]
    for zz in (z,z+height):
        for r in (inner,outer):
            verts += [(cx+r*math.cos(i*2*math.pi/n),
                       cy+r*math.sin(i*2*math.pi/n),zz) for i in range(n)]
    faces=[]
    for i in range(n):
        j=(i+1)%n
        faces += [(i,j,n+j,n+i),
                  (2*n+i,3*n+i,3*n+j,2*n+j),
                  (i,2*n+i,2*n+j,j),
                  (n+i,n+j,3*n+j,3*n+i)]
    return mesh_obj(name,verts,faces,mat)

# ---------------------------------------------------------------------
# MAIN RCC STRUCTURE: FIVE LEVELS AND A GENUINE ATRIUM VOID
# ---------------------------------------------------------------------

group("01_Structure")

# Main slabs: rear central atrium x[-5.5,5.5], y[7,18].
# Wing slabs stop behind the façade, preserving deep window recesses.
# Main floor slabs: preserving open central atrium X[-7.68, 7.68], Y[4.94, 20.26]
for level in range(6):
    z = level*FH
    if level == 0:
        box("Ground structural slab",(0,D/2,z-.18),(W,D,.36),concrete)
    else:
        for x in (-13.5,13.5):
            box("Wing floor slab",(x,13.25,z-.15),
                (9.0,23.9,.30),concrete)
        box("Front wing connector slab",(0,3.5,z-.15),
            (18.0,3.5,.30),concrete)
        box("Rear wing connector slab",(0,23.5,z-.15),
            (18.0,3.5,.30),concrete)

# Perimeter structural columns (leaving central atrium open)
for x in (-17.4,-12.0,12.0,17.4):
    for y in (2.0,7.0,13.0,19.0,24.5):
        box("RCC rectangular column",(x,y,H/2),(.48,.52,H),cream)
for x in (-6.0,6.0):
    for y in (2.0,24.5):
        box("RCC rectangular column",(x,y,H/2),(.48,.52,H),cream)

for level in range(1,6):
    for y in (2.0,24.5):
        box("RCC transverse beam",(0,y,level*FH-.35),(W,.42,.48),cream)
    for x in (-13.5,13.5):
        for y in (7.0,13.0,19.0):
            box("Wing transverse beam",(x,y,level*FH-.35),(9.0,.42,.48),cream)

# ---------------------------------------------------------------------
# FRONT WINGS: TALL BAYS, ARCHED BASE OPENINGS, BALCONY VOIDS
# ---------------------------------------------------------------------

group("02_Front_Facade")

for sign in (-1,1):
    lo,hi = sorted((sign*6.0,sign*18.0))
    center = sign*10.35
    outer = sign*15.5
    openings = [
        (center-1.40,center+1.40,0.0,7.45),
        (center-1.30,center+1.30,8.90,12.15),
        (center-1.30,center+1.30,13.05,19.75),
        (outer-1.65,outer+1.65,.75,2.0),
        (outer-1.85,outer+1.85,4.25,7.65),
        (outer-1.85,outer+1.85,8.45,11.65),
        (outer-.78,outer+.78,13.1,15.65),
        (outer-1.8,outer+1.8,16.85,19.75)
    ]
    wall_with_openings("Front wing plaster wall","X",0,
                       lo,hi,0,H,openings,.5,cream)

    # Pink lower wall cladding assembled around the same openings.
    wall_with_openings("Pink lower façade","X",-.275,
                       min(center-2.12,center+2.12),
                       max(center-2.12,center+2.12),
                       0,8.45,openings,.10,pink)

    # Tall inset rectangular windows.
    for bottom,height in ((8.90,3.25),(13.05,6.70)):
        group("05_Windows_Doors")
        frame_window("Tall front aluminium bay",center,.40,bottom,
                     2.60,height,cols=2,rows=4 if height<4 else 7)
        group("02_Front_Facade")
        for dx in (-1.49,1.49):
            box("Tall bay raised jamb",(center+dx,-.31,bottom+height/2),
                (.23,.22,height+.32),trim)
        box("Tall bay sill",(center,-.39,bottom-.08),
            (3.25,.61,.18),trim)
        box("Tall bay header",(center,-.28,bottom+height+.10),
            (3.18,.24,.20),trim)

    for dx in (-1.65,1.65):
        column("Classical tall bay column",center+dx,-.49,
               13.00,19.77,.22,mat_column)
    pediment(center,-.51,20.05,3.95)

    # Ground-level arched opening. Infill above the arch is solid.
    radius = 1.40
    spring = 6.05
    segments = 32
    for i in range(segments):
        x0=-radius+2*radius*i/segments
        x1=-radius+2*radius*(i+1)/segments
        z0=spring+math.sqrt(max(0,radius*radius-x0*x0))
        z1=spring+math.sqrt(max(0,radius*radius-x1*x1))
        verts=[
            (center+x0,-.34,z0),(center+x1,-.34,z1),
            (center+x1,-.34,7.46),(center+x0,-.34,7.46),
            (center+x0,.26,z0),(center+x1,.26,z1),
            (center+x1,.26,7.46),(center+x0,.26,7.46)]
        mesh_obj("Solid arched opening spandrel",verts,
                 [(0,1,2,3),(7,6,5,4),(0,4,5,1),
                  (1,5,6,2),(2,6,7,3),(3,7,4,0)],pink)

    arc=[(center+radius*math.cos(t),-.40,
          spring+radius*math.sin(t))
         for t in [math.pi*i/48 for i in range(49)]]
    path("Worn arch reveal rim",arc,.045,pink)

    group("05_Windows_Doors")
    frame_window("Lower arched-bay window",center,.46,.45,
                 2.70,2.65,cols=2,rows=3,grill=True)
    frame_window("Upper arched-bay window",center,.46,4.25,
                 2.70,1.80,cols=2,rows=2)

    # Solid panel separating windows inside tall base opening.
    group("02_Front_Facade")
    box("Arch bay intermediate wall",(center,.25,3.68),
        (2.8,.42,1.14),cream)
    # Recessed cap behind the open arch.
    box("Shadowed arch back",(center,1.35,6.77),
        (2.8,.18,1.45),cream)

    # Outer recessed balconies, not black rectangles.
    for bottom,top in ((4.25,7.65),(8.45,11.65),(16.85,19.75)):
        box("Deep balcony slab",(outer,1.0,bottom-.14),
            (4.0,2.6,.28),cream)
        box("Balcony recessed rear wall",(outer,2.3,(bottom+top)/2),
            (4,.24,top-bottom),cream)
        group("05_Windows_Doors")
        frame_window("Balcony rear glazing",outer,2.14,bottom+.25,
                     2.75,top-bottom-.5,cols=3,rows=2)
        group("02_Front_Facade")
        box("Solid balcony upstand",(outer,-.08,bottom+.36),
            (3.70,.24,.72),cream)
        railing("Balcony front railing",
                (outer-1.8,-.24),(outer+1.8,-.24),bottom+.72,.5)
        column("Outer balcony rounded column",
               outer+sign*1.53,.45,bottom,top,.25,cream)

    group("05_Windows_Doors")
    frame_window("Small upper service window",outer,.42,13.1,
                 1.56,2.55,rows=3)
    frame_window("Small low service window",outer,.40,.75,
                 3.3,1.25,cols=3,rows=1)

    # Continuous wall bands and façade grooves.
    group("02_Front_Facade")
    for z,hh,depth in ((8.40,.28,.72),(20.5,.14,.62),
                       (21.08,.18,.76),(21.30,.13,.68)):
        box("Front wing continuous cornice",
            ((lo+hi)/2,-.16,z),(hi-lo,depth,hh),trim)
    for x in (center-2.3,center+2.3):
        box("Raised vertical façade border",(x,-.29,14.4),
            (.10,.09,11.6),trim)
        box("Dark recessed vertical groove",(x+.10,-.264,14.4),
            (.023,.015,11.6),concrete,.002)

    box("Front wing roof parapet",((lo+hi)/2,.02,21.55),
        (hi-lo,.42,1.10),cream)
    panel_band((lo,-.04),(hi,-.04),21.56,.42)
    box("Wing parapet coping",((lo+hi)/2,-.02,22.13),
        (hi-lo+.12,.72,.16),trim)

# ---------------------------------------------------------------------
# CENTRAL RECESSED ELEVATION AND UPPER PROJECTING CROWN
# ---------------------------------------------------------------------

group("02_Front_Facade")

# Recessed middle wall above the entrance.
mid_holes=[
    (-5.35,-3.05,9.3,11.75),(3.05,5.35,9.3,11.75),
    (-5.35,-3.05,13.50,15.5),(3.05,5.35,13.50,15.5),
    (-2.65,2.65,9.0,16.55)
]
wall_with_openings("Central recessed upper wall","X",1.25,
                   -6,6,8.4,17.7,mid_holes,.48,cream)

group("05_Windows_Doors")
for sign in (-1,1):
    frame_window("Central side bay",sign*4.2,1.64,9.3,2.3,2.45,
                 cols=2,rows=2)
    frame_window("Central upper side bay",sign*4.2,1.64,13.5,2.3,2,
                 cols=2,rows=2,grill=True)

group("02_Front_Facade")
# Deep central niche, open corridor with a tall security grille.
box("Central niche rear wall",(0,4.9,13.0),(5.3,.25,7.2),cream)
box("Central niche landing",(0,3.0,10.0),(5.3,3.7,.25),cream)
railing("Central tall rectangular grille",(-2.65,1.02),(2.65,1.02),
        10.1,2.45,railmat,.56)
for x in (-2.40,-.80,.80,2.40):
    box("Recessed vertical relief",(x,4.70,14.1),
        (.16,.15,3.4),cream)

for x in (-4.65,-4.05,4.05,4.65):
    column("Paired monumental central column",x,-.92,
           8.48,17.60,.27,mat_column)

# Upper polygonal projection.
crown=[(-6.4,1.1),(-6.4,-.75),(-5.45,-2.0),
       (5.45,-2.0),(6.4,-.75),(6.4,1.1)]
polygon_slab("Central crown cantilever",crown,17.48,17.92,cream)

wall_with_openings("Central crown front","X",-1.84,
                   -5.45,5.45,17.9,22.9,
                   [(-4.35,4.35,19.10,21.08)],.40,cream)
for sign in (-1,1):
    beam_between("Crown chamfer wall",
                 (sign*5.45,-2),(sign*6.4,-.75),20.35,4.85,.4,cream)
    box("Crown return wall",(sign*6.23,.16,20.35),
        (.4,1.83,4.85),cream)

group("05_Windows_Doors")
frame_window("Central crown wide glazing",0,-1.38,19.1,8.7,1.98,
             cols=6,rows=2)
group("02_Front_Facade")
for x in (-1.90,-1.36,1.36,1.90):
    column("Crown paired small columns",x,-1.98,19.05,21.12,.20,mat_column)
for z,hh in ((22.25,.10),(22.92,.15),(23.12,.13)):
    box("Central crown moulded cornice",(0,-1.90,z),
        (11.0,.60,hh),trim)
panel_band((-5.35,-1.93),(5.35,-1.93),22.52,.40)
polygon_slab("Crown roof",crown,22.98,23.18,concrete)

# ---------------------------------------------------------------------
# TWO-STOREY PORTICO: CHAMFERED SLAB, PARAPET, BEAMS AND PIERS
# ---------------------------------------------------------------------

group("04_Portico")

porch=[(-8.1,1.0),(-8.1,-4.85),(-6.65,-6.35),
       (6.65,-6.35),(8.1,-4.85),(8.1,1.0)]
polygon_slab("Thick polygonal entrance canopy",porch,8.05,8.48,cream)

front_edges=list(zip(porch[:-1],porch[1:]))
for a,b in front_edges:
    beam_between("Portico solid parapet",a,b,9.02,1.08,.32,cream)
    beam_between("Portico pink lower fascia",a,b,8.40,.22,.44,pink)
    beam_between("Portico coping",a,b,9.61,.18,.53,trim)
    beam_between("Portico cornice shadow line",a,b,9.48,.075,.44,concrete)
    panel_band(a,b,9.03,.32)

# Portico's visible tall piers and internal rounded supports.
for x in (-7.40,7.40):
    box("Portico principal square pier",(x,-4.25,4.025),
        (.64,.78,8.05),cream)
    box("Portico pier plinth",(x,-4.25,.18),(.85,.97,.36),concrete)
    for y in (-1.20,2.8):
        column("Portico supporting cylindrical column",x,y,
               0,8.05,.34,mat_column)

for x in (-6.0,0,6.0):
    box("Portico deep longitudinal soffit beam",(x,-2.25,7.82),
        (.36,7.75,.47),cream)
for y in (-4.50,-1.45,1.0):
    box("Portico transverse soffit beam",(0,y,7.78),
        (15.5,.38,.55),cream)

# Concrete veranda extends to the entrance lobby.
box("Entrance veranda",(0,-1.40,-.14),(15.6,9.90,.28),stone)

# Six red-and-cream steps, built as solid stair blocks.
for i in range(6):
    height=(i+1)*.15
    y0=-9.05+i*.45
    y1=-6.35
    box("Wide entrance stair riser",
        (0,(y0+y1)/2,GROUND+height/2),
        (14.4,y1-y0,height),red,.008)
    box("Cream worn stair nosing",
        (0,y0+.055,GROUND+height+.008),
        (14.4,.11,.022),stone,.004)

# Side ramps slope from ground at y=-10.2 to lobby at y=-4.9.
for sign in (-1,1):
    x0,x1=sorted((sign*8.0,sign*10.15))
    y0,y1=-10.2,-4.9
    verts=[(x0,y0,GROUND),(x1,y0,GROUND),
           (x1,y1,0),(x0,y1,0),
           (x0,y0,GROUND-.18),(x1,y0,GROUND-.18),
           (x1,y1,GROUND-.18),(x0,y1,GROUND-.18)]
    mesh_obj("Solid sloping side access ramp",verts,
             [(0,1,2,3),(4,7,6,5),(0,4,5,1),
              (1,5,6,2),(2,6,7,3),(3,7,4,0)],mat_stone_ramp)
    x=sign*10.12
    for k in range(9):
        t=k/8
        y=y0+(y1-y0)*t
        z=GROUND+.9*t
        rod("Ramp railing upright",(x,y,z),(x,y,z+1.0),.025,railmat)
    for dz in (.48,1.0):
        rod("Ramp sloping handrail",(x,y0,GROUND+dz),(x,y1,dz),
            .034,railmat)

# ---------------------------------------------------------------------
# SIDE AND REAR ELEVATIONS: INFERRED, BUT FULLY MODELLED
# ---------------------------------------------------------------------

group("03_Sides_Rear")
side_centers=(4.4,9.1,13.8,18.5,23.1)

for sign in (-1,1):
    plane=sign*18
    holes=[]
    for level in range(5):
        z=level*FH
        for idx,y in enumerate(side_centers):
            width=2.65 if idx!=3 else 1.45
            holes.append((y-width/2,y+width/2,z+.88,z+3.23))
    wall_with_openings("Side elevation wall","Y",plane,
                       0,D,0,H,holes,.44,cream)

    for level in range(5):
        z=level*FH
        for idx,y in enumerate(side_centers):
            width=2.65 if idx!=3 else 1.45
            group("05_Windows_Doors")
            frame_window("Side recessed window",y,plane-sign*.28,
                         z+.88,width,2.35,axis="Y",
                         cols=2,rows=3,grill=(level==0))
            group("03_Sides_Rear")
            box("Side projecting sill",(plane+sign*.15,y,z+.82),
                (.70,width+.30,.16),trim)
        box("Side floor ledge",(plane,12.6,z+FH-.06),
            (.68,D,.15),trim)

    # Additional projecting open service balconies.
    for level in (1,2,3):
        z=level*FH
        yc=8.9
        box("Side service balcony slab",
            (plane+sign*.90,yc,z-.08),(1.90,3.30,.25),concrete)
        railing("Side balcony outer rail",
                (plane+sign*1.78,yc-1.65),
                (plane+sign*1.78,yc+1.65),z+.05)
        for yy in (yc-1.65,yc+1.65):
            railing("Side balcony return",
                    (plane,yy),(plane+sign*1.78,yy),z+.05)

    box("Side roof parapet",(plane,12.6,H+.52),(.43,D,1.04),cream)
    box("Side parapet coping",(plane,12.6,H+1.10),(.72,D+.1,.16),trim)
    for y in [1.2+i*1.6 for i in range(15)]:
        box("Side square inset border",(plane+sign*.24,y,H+.52),
            (.08,.64,.58),trim)
        box("Side textured parapet inset",(plane+sign*.29,y,H+.52),
            (.05,.49,.44),panel)

# Rear: repeated institutional bays and a central service door.
rear_holes=[]
for level in range(5):
    for x in (-15,-10,-5,0,5,10,15):
        if level==0 and x==0:
            rear_holes.append((-1.15,1.15,0,2.8))
        else:
            rear_holes.append((x-1.30,x+1.30,
                               level*FH+.85,level*FH+3.2))
wall_with_openings("Rear elevation","X",D,-18,18,0,H,
                   rear_holes,.44,cream)

for level in range(5):
    for x in (-15,-10,-5,0,5,10,15):
        if level==0 and x==0:
            continue
        group("05_Windows_Doors")
        frame_window("Rear window",x,D-.25,level*FH+.85,
                     2.6,2.35,cols=2,rows=3,grill=(level==0))
        group("03_Sides_Rear")
        box("Rear sill",(x,D+.15,level*FH+.78),(2.88,.62,.16),trim)
    box("Rear slab-edge band",(0,D,level*FH+4.12),
        (36,.65,.16),trim)

box("Rear roof parapet",(0,D,H+.52),(36,.44,1.04),cream)
box("Rear parapet coping",(0,D,H+1.1),(36.1,.73,.16),trim)
panel_band((18,D+.1),(-18,D+.1),H+.52,.44)

# ---------------------------------------------------------------------
# AUTHENTIC PCCRC ATRIUM INTERIOR: 5 TIERS, INLAYS, LIFT & RADIAL SKYLIGHT
# Based on Innerviewpccrc_combined.blend1 & Reference Photo (Room A - 119)
# ---------------------------------------------------------------------

group("06_Atrium")

CY = 12.6  # Center of atrium in Y
ATRIUM_W = 15.36  # Clear opening width (X in [-7.68, 7.68])
ATRIUM_D = 15.36  # Clear opening depth (Y in [CY - 7.68, CY + 7.68])

# ---------------------------------------------------------------------
# 1. GROUND PLAZA & INLAYS
# ---------------------------------------------------------------------
box("Atrium polished stone ground", (0, CY, 0.01), (24.0, 24.0, 0.06), tile, 0.002)

# Concentric circular segmented stone inlays
inlay_rings = [
    (0.0, 2.8, tile),
    (2.8, 3.15, dark),
    (3.15, 4.25, stone),
    (4.25, 4.65, dark),
    (4.65, 5.45, cream)
]
for r0, r1, r_mat in inlay_rings:
    segs = 64
    for i in range(segs):
        a = i * 2 * math.pi / segs
        b = (i + 1) * 2 * math.pi / segs
        verts = [
            (r0 * math.cos(a), CY + r0 * math.sin(a), 0.045),
            (r1 * math.cos(a), CY + r1 * math.sin(a), 0.045),
            (r1 * math.cos(b), CY + r1 * math.sin(b), 0.045),
            (r0 * math.cos(b), CY + r0 * math.sin(b), 0.045)
        ]
        mesh_obj(f"Circular stone inlay {r0}_{i}", verts, [(0, 1, 2, 3)], r_mat)

# Central reflective tile grid
for i in range(8):
    for j in range(12):
        tx = (i - 3.5) * 0.28
        ty = CY + (j - 5.5) * 0.28
        box(f"Central glossy tile {i}_{j}", (tx, ty, 0.055), (0.268, 0.268, 0.015), stone, 0.002)

# Geometric perimeter paving tiles
paving_palette = [stone, panel, dark, tile, red]
for ix in range(-5, 6):
    for iy in range(-6, 7):
        px = ix * 2.0 + 1.0
        py = CY + iy * 2.0 + 1.0
        dist_sq = px**2 + (py - CY)**2
        if dist_sq > 5.5**2 and abs(px) < 11.2 and abs(py - CY) < 11.8:
            box(f"Geometric stone paving {ix}_{iy}", (px, py, 0.025),
                (1.95, 1.95, 0.018), paving_palette[(ix * 3 + iy * 2) % len(paving_palette)], 0.003)

# Burgundy decorative planters
for px in (-2.2, 2.2):
    for py in (CY - 1.7, CY + 1.7):
        box(f"Burgundy planter {px}_{py}", (px, py, 0.35), (0.66, 0.66, 0.65), red, 0.01)
        box(f"Planter soil {px}_{py}", (px, py, 0.68), (0.60, 0.60, 0.03), soil)
        for s in range(6):
            sa = s * math.pi / 3
            rod(f"Plant stem {px}_{py}_{s}", (px, py, 0.70),
                (px + 0.15 * math.cos(sa), py + 0.15 * math.sin(sa), 1.15), 0.012, leafmat)
            box(f"Plant leaf {px}_{py}_{s}",
                (px + 0.22 * math.cos(sa), py + 0.22 * math.sin(sa), 1.25),
                (0.18, 0.45, 0.06), leafmat, 0.005, sa)

# Full-height atrium corner structural piers
for x in (-8.9, 8.9):
    for y_rel in (-8.0, 8.0):
        box(f"Full-height atrium pier {x}_{y_rel}", (x, CY + y_rel, H / 2), (0.68, 0.85, H), white)

# Ground floor glazed entrance doors
for x in (-0.75, 0.75):
    for dx in (-0.74, 0.74):
        box(f"Main glazed door jamb {x}_{dx}", (x + dx, 5.0, 1.45), (0.075, 0.16, 2.96), metal, 0.005)
    box(f"Main glazed door head {x}", (x, 5.0, 2.90), (1.56, 0.16, 0.075), metal, 0.005)
    box(f"Main glazed door leaf {x}", (x, 5.035, 1.45), (1.38, 0.075, 2.83), mat_wood_leaf, 0.006)
    box(f"Main glazed vision {x}", (x, 5.0, 1.45), (1.20, 0.05, 1.90), glass_mats[0])

# ---------------------------------------------------------------------
# 2. PHOTO-ACCURATE ROOM ENTRANCE SYSTEM (ROOM A - 119 STYLE)
# ---------------------------------------------------------------------
def create_detailed_room_entrance(room_no, center_pos, rot_z=0.0):
    """
    Builds a photo-accurate double-door institutional room entrance
    directly modeled after Room A - 119:
      - Deep boxed portal architrave in light beech wood veneer
      - White placard with 3D typography room numbering
      - Warm wood double leaves with meeting stile clearance
      - Dual horizontal rectangular vision panels with dark slim frames
      - Stainless steel tubular pull handles with mounting standoffs
      - Vertical PUSH plate
      - Horizontal sliding tower bolt with brass padlock
      - Hydraulic surface door closers on both leaves
      - Dark polished granite skirting along floor
      - Red manual fire call point with vertical metallic conduit
      - Overhead black electrical cable bundles
      - Interior room volume with natural room depth
    """
    cx, cy, cz = center_pos
    cos_r = math.cos(rot_z)
    sin_r = math.sin(rot_z)

    def to_w(lx, ly, lz):
        wx = cx + lx * cos_r - ly * sin_r
        wy = cy + lx * sin_r + ly * cos_r
        wz = cz + lz
        return (wx, wy, wz)

    r_tag = room_no.replace(" ", "_").replace("-", "_")

    # 1. Light Beech Boxed Portal Surround (Projecting from wall)
    box(f"Portal_Top_{r_tag}", to_w(0, 0, 2.74), (2.14, 0.32, 0.52), mat_wood_surround, 0.015, rot_z)
    box(f"Portal_Left_{r_tag}", to_w(-0.94, 0, 1.24), (0.26, 0.32, 2.48), mat_wood_surround, 0.015, rot_z)
    box(f"Portal_Right_{r_tag}", to_w(0.94, 0, 1.24), (0.26, 0.32, 2.48), mat_wood_surround, 0.015, rot_z)

    # 2. Warm Wood Double Door Leaves
    box(f"Door_Left_{r_tag}", to_w(-0.405, 0.02, 1.23), (0.79, 0.048, 2.44), mat_wood_leaf, 0.008, rot_z)
    box(f"Door_Right_{r_tag}", to_w(0.405, 0.02, 1.23), (0.79, 0.048, 2.44), mat_wood_leaf, 0.008, rot_z)

    # 3. Vision Glass Rectangular Panels with Dark Slim Frames (Eye Level)
    # Left leaf vision panel
    box(f"Vision_Frame_L_{r_tag}", to_w(-0.41, 0.02, 1.55), (0.38, 0.054, 0.24), dark, 0.003, rot_z)
    box(f"Vision_Glass_L_{r_tag}", to_w(-0.41, 0.02, 1.55), (0.34, 0.046, 0.20), mat_vision_glass, 0.0, rot_z)
    # Right leaf vision panel
    box(f"Vision_Frame_R_{r_tag}", to_w(0.41, 0.02, 1.55), (0.38, 0.054, 0.24), dark, 0.003, rot_z)
    box(f"Vision_Glass_R_{r_tag}", to_w(0.41, 0.02, 1.55), (0.34, 0.046, 0.20), mat_vision_glass, 0.0, rot_z)

    # 4. Vertical 'PUSH' Sign Plate (Below glass on right leaf)
    box(f"Push_Plate_{r_tag}", to_w(0.12, -0.008, 1.36), (0.065, 0.012, 0.16), mat_placard_plate, 0.003, rot_z)
    box(f"Push_Text_{r_tag}", to_w(0.12, -0.016, 1.36), (0.045, 0.005, 0.12), mat_alarm_red, 0.0, rot_z)

    # 5. Stainless Steel Tubular Pull Handles with Standoffs
    rod(f"Handle_Bar_L_{r_tag}", to_w(-0.08, -0.065, 0.85), to_w(-0.08, -0.065, 1.18), 0.016, metal)
    rod(f"Handle_Standoff_L_Top_{r_tag}", to_w(-0.08, -0.01, 1.15), to_w(-0.08, -0.065, 1.15), 0.012, metal)
    rod(f"Handle_Standoff_L_Bot_{r_tag}", to_w(-0.08, -0.01, 0.88), to_w(-0.08, -0.065, 0.88), 0.012, metal)

    rod(f"Handle_Bar_R_{r_tag}", to_w(0.08, -0.065, 0.85), to_w(0.08, -0.065, 1.18), 0.016, metal)
    rod(f"Handle_Standoff_R_Top_{r_tag}", to_w(0.08, -0.01, 1.15), to_w(0.08, -0.065, 1.15), 0.012, metal)
    rod(f"Handle_Standoff_R_Bot_{r_tag}", to_w(0.08, -0.01, 0.88), to_w(0.08, -0.065, 0.88), 0.012, metal)

    # 6. Horizontal Sliding Tower Bolt with Padlock
    box(f"Slide_Bolt_Plate_{r_tag}", to_w(0, -0.035, 0.98), (0.24, 0.02, 0.05), metal, 0.004, rot_z)
    rod(f"Slide_Bolt_Bar_{r_tag}", to_w(-0.10, -0.048, 0.98), to_w(0.10, -0.048, 0.98), 0.009, metal)
    box(f"Padlock_Body_{r_tag}", to_w(0.02, -0.055, 0.94), (0.038, 0.018, 0.042), panel, 0.004, rot_z)
    rod(f"Padlock_Shackle_{r_tag}", to_w(0.02, -0.055, 0.965), to_w(0.02, -0.055, 0.98), 0.005, metal)

    # 7. Hydraulic Door Closers at Top of Both Leaves
    box(f"Closer_Body_L_{r_tag}", to_w(-0.40, -0.04, 2.38), (0.22, 0.06, 0.05), dark, 0.005, rot_z)
    rod(f"Closer_Arm_L_{r_tag}", to_w(-0.40, -0.04, 2.41), to_w(-0.25, -0.02, 2.47), 0.008, metal)
    box(f"Closer_Body_R_{r_tag}", to_w(0.40, -0.04, 2.38), (0.22, 0.06, 0.05), dark, 0.005, rot_z)
    rod(f"Closer_Arm_R_{r_tag}", to_w(0.40, -0.04, 2.41), to_w(0.25, -0.02, 2.47), 0.008, metal)

    # 8. Room Number Placard (Photo-Accurate 'A - 119', etc.)
    box(f"Placard_Plate_{r_tag}", to_w(0.0, -0.165, 2.76), (0.44, 0.018, 0.16), mat_placard_plate, 0.005, rot_z)
    box(f"Placard_Border_{r_tag}", to_w(0.0, -0.163, 2.76), (0.45, 0.012, 0.17), dark, 0.0, rot_z)
    
    # Crisp 3D typography curve object for room number
    font_curve = bpy.data.curves.new(name=f"Curve_{r_tag}", type='FONT')
    font_curve.body = room_no
    font_curve.size = 0.065
    font_curve.extrude = 0.004
    font_curve.align_x = 'CENTER'
    font_curve.align_y = 'CENTER'
    text_obj = bpy.data.objects.new(name=f"Placard_Text_{r_tag}", object_data=font_curve)
    text_obj.location = to_w(0.0, -0.176, 2.76)
    text_obj.rotation_euler = (math.pi / 2, 0, rot_z)
    assign(text_obj, mat_placard_text)
    ACTIVE.objects.link(text_obj)

    # 9. Red Manual Fire Alarm Call Point & Vertical Conduit (On Left Adjacent Wall Face)
    box(f"Fire_Alarm_{r_tag}", to_w(1.42, -0.11, 1.35), (0.11, 0.065, 0.11), mat_alarm_red, 0.005, rot_z)
    rod(f"Conduit_{r_tag}", to_w(1.42, -0.10, 1.40), to_w(1.42, -0.10, 3.80), 0.012, metal)

    # 10. Dark Granite Skirting Along Corridor Floor & Off-White Corridor Walls
    box(f"Skirting_L_{r_tag}", to_w(1.60, -0.09, 0.06), (1.10, 0.035, 0.12), mat_skirting_granite, 0.0, rot_z)
    box(f"Skirting_R_{r_tag}", to_w(-1.60, -0.09, 0.06), (1.10, 0.035, 0.12), mat_skirting_granite, 0.0, rot_z)
    box(f"Corridor_Wall_L_{r_tag}", to_w(1.60, 0.0, 1.70), (1.10, 0.14, 3.40), white, 0.0, rot_z)
    box(f"Corridor_Wall_R_{r_tag}", to_w(-1.60, 0.0, 1.70), (1.10, 0.14, 3.40), white, 0.0, rot_z)

    # 11. Overhead Electrical Cables / Conduit (Photo-Accurate)
    for dc, cr in ((-0.09, 0.008), (-0.06, 0.007), (-0.03, 0.006)):
        rod(f"Cable_{r_tag}_{dc}", to_w(-2.1, dc, 3.45), to_w(2.1, dc, 3.45), cr, dark)

    # 12. Interior Room Volume (Creates Realistic Depth through Vision Glass)
    box(f"Room_Interior_Wall_{r_tag}", to_w(0, 2.5, 1.70), (3.6, 0.15, 3.40), cream, 0.0, rot_z)
    box(f"Room_Interior_Floor_{r_tag}", to_w(0, 1.25, 0.01), (3.6, 2.5, 0.04), concrete, 0.0, rot_z)

# ---------------------------------------------------------------------
# 3. FIVE GALLERY TIERS, BALCONIES, COLUMNS & RAILINGS
# ---------------------------------------------------------------------
# 5 Building Levels: Level 0 (Ground/Floor 1) to Level 4 (Floor 5)
GALLERY_LEVELS = [FH * lvl for lvl in range(1, 5)]

# Generate Photo-Accurate Numbered Doors on ALL 5 FLOORS (Total 45 Rooms)
# Floor 1 (Level 0, z=0) to Floor 5 (Level 4, z=4*FH)
for floor_idx in range(5):
    floor_num = floor_idx + 1
    gz = floor_idx * FH
    base_num = floor_num * 100 + 10  # Floor 1: 110, Floor 2: 210, etc.

    # 3 Left Gallery Rooms (Corridor partition at X = -11.45, doors facing +X into corridor)
    left_rot = math.pi / 2
    for i, y_pos in enumerate([CY - 5.2, CY, CY + 5.2]):
        room_no = f"A - {base_num + i + 1}"
        create_detailed_room_entrance(room_no, (-11.45, y_pos, gz), rot_z=left_rot)

    # 3 Rear Gallery Rooms (Corridor partition at Y = CY + 11.45, doors facing -Y into corridor)
    rear_rot = 0.0
    for i, x_pos in enumerate([-5.5, 0.0, 5.5]):
        room_no = f"A - {base_num + 3 + i + 1}"
        create_detailed_room_entrance(room_no, (x_pos, CY + 11.45, gz), rot_z=rear_rot)

    # 3 Right Gallery Rooms (Corridor partition at X = 11.45, doors facing -X into corridor)
    # Includes photo-exact A - 119 on Floor 1!
    right_rot = -math.pi / 2
    for i, y_pos in enumerate([CY + 5.2, CY, CY - 5.2]):
        room_no = f"A - {base_num + 6 + i + 1}"
        create_detailed_room_entrance(room_no, (11.45, y_pos, gz), rot_z=right_rot)

# Construct upper gallery slabs, fascias, round columns, and handrails
for floor_idx, gz in enumerate(GALLERY_LEVELS):
    floor_num = floor_idx + 1

    # Rear gallery slab & fascia
    box(f"Rear gallery slab L{floor_num}", (0, CY + 9.65, gz - 0.15), (18.4, 4.1, 0.30), concrete)
    box(f"Rear white balcony fascia L{floor_num}", (0, CY + 7.66, gz + 0.35), (18.4, 0.23, 0.70), white)

    # Front gallery slab & fascia
    box(f"Front gallery slab L{floor_num}", (0, CY - 9.65, gz - 0.15), (18.4, 4.1, 0.30), concrete)
    box(f"Front white balcony fascia L{floor_num}", (0, CY - 7.66, gz + 0.35), (18.4, 0.23, 0.70), white)

    # Rear handrail (Brushed Stainless Steel)
    for dz in (0.12, 0.45, 0.95):
        rod(f"Continuous balcony railing rear {floor_num}_{dz}",
            (-7.68, CY + 7.55, gz + dz), (7.68, CY + 7.55, gz + dz), 0.022, metal)
    for i in range(29):
        rx = -7.68 + i * (15.36 / 28)
        rod(f"Railing upright rear {floor_num}_{i}",
            (rx, CY + 7.55, gz), (rx, CY + 7.55, gz + 0.95), 0.016, metal)

    # Front handrail (Brushed Stainless Steel)
    for dz in (0.12, 0.45, 0.95):
        rod(f"Continuous balcony railing front {floor_num}_{dz}",
            (-7.68, CY - 7.55, gz + dz), (7.68, CY - 7.55, gz + dz), 0.022, metal)
    for i in range(29):
        rx = -7.68 + i * (15.36 / 28)
        rod(f"Railing upright front {floor_num}_{i}",
            (rx, CY - 7.55, gz), (rx, CY - 7.55, gz + 0.95), 0.016, metal)

    # Side gallery slabs & fascias
    for x in (-9.55, 9.55):
        box(f"Side gallery slab {x}_{floor_num}", (x, CY, gz - 0.15), (3.7, 19.4, 0.30), concrete)
        inner_x = -7.68 if x < 0 else 7.68
        box(f"Side white balcony fascia {x}_{floor_num}", (inner_x, CY, gz + 0.35), (0.23, 19.4, 0.70), white)

        # Side handrails (Brushed Stainless Steel)
        y_start = CY - 7.55
        y_end = CY + 7.55
        for dz in (0.12, 0.45, 0.95):
            rod(f"Continuous balcony railing side {x}_{floor_num}_{dz}",
                (inner_x, y_start, gz + dz), (inner_x, y_end, gz + dz), 0.022, metal)
        for i in range(29):
            ry = y_start + i * ((y_end - y_start) / 28)
            rod(f"Railing upright side {x}_{floor_num}_{i}",
                (inner_x, ry, gz), (inner_x, ry, gz + 0.95), 0.016, metal)

    # Round gallery interior columns (Clean Warm White)
    for x in (-7.2, -4.4, 4.4, 7.2):
        cylinder(f"Round rear gallery column {x}_{floor_num}", (x, CY + 8.7, gz + 1.8), 0.25, 3.6, white)
    for x in (-9.8, 9.8):
        for y_rel in (-6.0, -2.0, 2.0, 6.0):
            cylinder(f"Round side gallery column {x}_{y_rel}_{floor_num}", (x, CY + y_rel, gz + 1.8), 0.25, 3.6, white)

# ---------------------------------------------------------------------
# 4. MONUMENTAL UPPER RECTANGULAR ARCHITECTURAL FRAME
# ---------------------------------------------------------------------
for x in (-2.65, 2.65):
    box(f"Upper rectangular frame upright {x}", (x, CY + 7.38, 17.5), (0.46, 0.50, 7.0), white)
for z in (14.0, 17.5, 20.8):
    box(f"Upper rectangular frame crosspiece {z}", (0, CY + 7.38, z), (5.75, 0.50, 0.46), white)

# ---------------------------------------------------------------------
# 5. PANORAMIC GLASS SCENIC ELEVATOR TOWER
# ---------------------------------------------------------------------
lx, ly = 8.05, CY + 4.65
for dx in (-0.83, 0.83):
    for dy in (-0.85, 0.85):
        box(f"Lift vertical steel frame {dx}_{dy}", (lx + dx, ly + dy, H / 2), (0.08, 0.08, H), metal, 0.005)

for z in range(0, int(H) + 1, 2):
    box(f"Lift horizontal frame {z}", (lx, ly - 0.85, z), (1.75, 0.08, 0.07), metal, 0.003)
    for dx in (-0.83, 0.83):
        box(f"Lift side cross-frame {dx}_{z}", (lx + dx, ly, z), (0.08, 1.75, 0.07), metal, 0.003)

# Transparent elevator cab glass
box("Lift transparent front", (lx, ly - 0.82, H / 2), (1.60, 0.02, H - 0.5), glass_mats[0])
for dx in (-0.80, 0.80):
    box(f"Lift transparent side {dx}", (lx + dx, ly, H / 2), (0.02, 1.65, H - 0.5), glass_mats[0])
for dx in (-0.50, 0.50):
    rod(f"Lift guide rail {dx}", (lx + dx, ly + 0.80, 0.0), (lx + dx, ly + 0.80, H), 0.045, metal)

# ---------------------------------------------------------------------
# 6. ROOF AND 64-PANEL RADIAL DOMED GLASS SKYLIGHT
# ---------------------------------------------------------------------
group("07_Roof")

# Roof concrete deck around central atrium opening
roof_z = H + 0.15
box("Main roof deck front", (0, (CY - 8.2) / 2, roof_z), (W, CY - 8.2, 0.30), concrete)
box("Main roof deck rear", (0, (CY + 8.2 + D) / 2, roof_z), (W, D - (CY + 8.2), 0.30), concrete)
box("Main roof deck left", (-(W / 2 + 8.2) / 2, CY, roof_z), ((W / 2 - 8.2), 16.4, 0.30), concrete)
box("Main roof deck right", ((W / 2 + 8.2) / 2, CY, roof_z), ((W / 2 - 8.2), 16.4, 0.30), concrete)

# Circular skylight concrete curb
skylight_r = 7.50
dome_base_z = H + 0.55
dome_apex_z = H + 3.20

ring_mesh("Circular skylight concrete curb", 0, CY, H,
          skylight_r - 0.15, skylight_r + 0.20, 0.55, cream, n=96)

# 64 radial wedge panels and 64 radial ribs
num_wedges = 64
for i in range(num_wedges):
    a0 = i * 2 * math.pi / num_wedges
    a1 = (i + 1) * 2 * math.pi / num_wedges
    r_mid = skylight_r * 0.5
    z_mid = dome_base_z + (dome_apex_z - dome_base_z) * 0.65

    v0_bot = (skylight_r * math.cos(a0), CY + skylight_r * math.sin(a0), dome_base_z)
    v1_bot = (skylight_r * math.cos(a1), CY + skylight_r * math.sin(a1), dome_base_z)
    v0_mid = (r_mid * math.cos(a0), CY + r_mid * math.sin(a0), z_mid)
    v1_mid = (r_mid * math.cos(a1), CY + r_mid * math.sin(a1), z_mid)
    v0_top = (0.65 * math.cos(a0), CY + 0.65 * math.sin(a0), dome_apex_z)
    v1_top = (0.65 * math.cos(a1), CY + 0.65 * math.sin(a1), dome_apex_z)

    panel_verts = [v0_bot, v1_bot, v1_mid, v0_mid, v1_top, v0_top]
    panel_faces = [(0, 1, 2, 3), (3, 2, 4, 5)]
    g_mat = skylight_glass if i % 2 == 0 else glass_mats[i % 5]
    mesh_obj(f"Individual radial skylight panel {i}", panel_verts, panel_faces, g_mat)

    rod(f"Skylight radial rib bot {i}", v0_bot, v0_mid, 0.032, metal)
    rod(f"Skylight radial rib top {i}", v0_mid, v0_top, 0.028, metal)

# Central oculus ring at apex
ring_mesh("Skylight central oculus ring", 0, CY, dome_apex_z - 0.10,
          0.50, 0.72, 0.22, metal, n=48)
cylinder("Skylight oculus glass", (0, CY, dome_apex_z), 0.52, 0.025, dark, 32)

# Diagonal steel roof supports connecting corners
for dx in (-6.5, 6.5):
    for dy in (-6.5, 6.5):
        rod(f"Diagonal roof support {dx}_{dy}", (dx, CY + dy, H + 0.2),
            (dx * 0.65, CY + dy * 0.65, dome_base_z + 0.4), 0.08, metal)

# Rooftop service structures are low and kept away from front silhouette.
box("Rear stair and lift overrun",(5.5,22,H+1.35),
    (6.0,4.3,2.7),cream)
box("Overrun flat roof",(5.5,22,H+2.76),(6.4,4.7,.22),concrete)
for x in (3.8,6.7):
    frame_window("Overrun ventilation glazing",x,19.82,H+.95,
                 1.35,.85,cols=2,rows=1)
for x in (-12,-9):
    cylinder("Rooftop service water tank",(x,21.5,H+1.03),
             .98,1.8,dark,48)
    cylinder("Water tank lid",(x,21.5,H+1.97),1.02,.10,dark,48)
    for zz in (H+.38,H+.75,H+1.12,H+1.49):
        ring_mesh("Water tank reinforcing rib",x,21.5,zz,.97,1.01,.065,dark,48)
    path("Roof tank service pipe",
         [(x+.95,21.5,H+.45),(x+1.35,21.5,H+.45),
          (x+1.35,23.7,H+.45)],.055,metal)

# ---------------------------------------------------------------------
# UTILITIES: AC UNITS, GRILLES, PIPES, CONDUITS, FIRE BOXES
# ---------------------------------------------------------------------

group("08_Utilities")

def ac_front(x,y,z,rotation=0):
    # Local unit faces negative Y. Parent then rotate for other elevations.
    root=bpy.data.objects.new("AC assembly",None)
    ACTIVE.objects.link(root)
    created=[]
    def add(obj):
        obj.parent=root
        created.append(obj)
        return obj
    add(box("Weathered AC outdoor casing",(0,0,0),
            (1.05,.42,.65),white,.025))
    add(box("AC front grille shadow",(0,-.224,0),
            (.88,.018,.49),dark,.006))
    for i in range(12):
        add(box("AC horizontal grille slat",(0,-.245,-.23+i*.042),
                (.89,.025,.013),metal,.002))
    # Fan visible behind grille.
    fan=cylinder("AC fan hub",(.22,-.265,0),.07,.025,dark,20)
    fan.rotation_euler.x=math.pi/2
    add(fan)
    for i in range(3):
        a=i*2*math.pi/3
        obj=box("AC fan blade",(.22+math.sin(a)*.11,-.258,
                               math.cos(a)*.11),
                (.10,.012,.24),dark,.008)
        obj.rotation_euler.y=a
        add(obj)
    for xx in (-.36,.36):
        add(box("Rusted AC support bracket",(xx,.02,-.40),
                (.055,.65,.065),rust,.003))
        add(box("AC bracket wall plate",(xx,.29,-.24),
                (.07,.06,.48),rust,.003))
    root.location=(x,y,z)
    root.rotation_euler.z=rotation
    return root

ac_front(-4.70,.94,10.0)
ac_front(15.65,1.85,14.0)
for sign in (-1,1):
    for level,y in ((1,4.4),(2,13.8),(3,23.0),(4,18.5)):
        ac_front(sign*18.45,y,level*FH+1.0,
                 math.pi/2 if sign>0 else -math.pi/2)
        path("AC refrigerant insulated line",
             [(sign*18.25,y+.5,level*FH+1.0),
              (sign*18.25,y+.9,level*FH+.8),
              (sign*18.25,y+.9,level*FH+.25)],.026,dark)
        path("AC condensate drain",
             [(sign*18.28,y-.32,level*FH+.7),
              (sign*18.29,y-.32,level*FH-.25)],.017,white)

# Front downpipes following visible portico edges.
for sign in (-1,1):
    x=sign*8.07
    pts=[(x,-4.80,9.50),(x,-4.98,8.15),
         (x+sign*.12,-4.98,1.0),
         (x+sign*.18,-5.12,.15)]
    path("Portico exposed rainwater pipe",pts,.057,white)
    for z in (1.2,3.3,5.4,7.5):
        box("Downpipe metal clip",(x+sign*.08,-5.0,z),
            (.19,.09,.045),metal,.003)

for sign in (-1,1):
    for y in (.75,17.0,24.8):
        x=sign*18.28
        path("Side rainwater downpipe",
             [(x,y,H+1),(x,y,.28),(x+sign*.18,y,.1)],.065,white)
        for z in [1.1+i*2.1 for i in range(10)]:
            box("Downpipe wall bracket",(x,y,z),(.16,.16,.04),metal,.002)
    # External fire riser.
    x=sign*18.38
    path("External red fire riser",
         [(x,20.15,.15),(x,20.15,19.8),(x,20.8,19.8)],
         .048,fire_red)

for level in range(5):
    z=level*FH
    box("Corridor fire hose cabinet",(-7.48,6.0,z+1.3),
        (.22,.72,.86),fire_red)
    box("Hose cabinet glazed inset",(-7.35,6.0,z+1.3),
        (.018,.57,.68),glass_mats[0],.004)
    box("Electrical distribution box",(7.48,20.5,z+1.45),
        (.22,.55,.8),white)
    path("Corridor electrical conduit",
         [(7.38,20.5,z+1.85),(7.38,20.5,z+3.68),
          (7.38,6.0,z+3.68)],.014,white)

# Short, gently sagging external utility cables.
for sign in (-1,1):
    pts=[]
    for i in range(20):
        t=i/19
        pts.append((sign*18.30,2+20*t,12.1-.35*math.sin(math.pi*t)))
    path("Sagging external service cable",pts,.013,dark)

# Scuppers and portico downlights.
for x in (-5.6,0,5.6):
    box("Portico drainage outlet",(x,-6.54,8.6),(.20,.22,.12),dark)
    box("Portico worn light housing",(x,-3.8,7.52),
        (.31,.31,.11),metal)
    box("Portico light diffuser",(x,-3.8,7.45),
        (.25,.25,.045),lampmat)

# ---------------------------------------------------------------------
# SITE-SPECIFIC WEATHERING OVERLAYS AND SMALL DAMAGE
# ---------------------------------------------------------------------

group("09_Weathering")

# Heavy contamination at runoff edges, much lighter elsewhere.
for sign in (-1,1):
    for top,y,xcenter,span in (
        (22.08,-.389,sign*12,11),
        (8.48,-.342,sign*10.35,4.0),
        (12.17,-.273,sign*10.35,3.0),
        (19.83,-.273,sign*15.5,3.1)
    ):
        for _ in range(22):
            x=xcenter+random.uniform(-span/2,span/2)
            front_streak(x,y,top,
                         random.uniform(.15,1.5),
                         random.uniform(.035,.26))

# Stained portico parapet front face.
for _ in range(95):
    x=random.uniform(-6.5,6.5)
    front_streak(x,-6.516,9.48,
                 random.uniform(.12,.87),
                 random.uniform(.025,.17))
for x in (-5.6,0,5.6):
    for _ in range(8):
        front_streak(x+random.uniform(-.14,.14),-6.579,8.49,
                     random.uniform(.08,.30),random.uniform(.03,.12))

# Damp patches beneath the arched base and at façade feet.
for sign in (-1,1):
    for _ in range(28):
        x=sign*10.35+random.uniform(-1.95,1.95)
        # Side strips, so the opening itself is not covered.
        if abs(x-sign*10.35)>1.43:
            front_streak(x,-.338,random.uniform(.3,1.9),
                         random.uniform(.25,1.7),
                         random.uniform(.07,.36))

# Naturally distributed hairline cracks and larger branching cracks around upper window/arch
crackmat=simple_mat("Hairline plaster fissure",(.14,.12,.10),1)
deep_crackmat=simple_mat("Deep structural fissure",(.06,.05,.04),1)

for sign in (-1,1):
    # 1. Subtle hairline cracks distributed across upper facade plaster
    for z in (2.8,7.7,12.5,18.2):
        x=sign*12.50+random.uniform(-.25,.25)
        pts=[(x,-.266,z),
             (x+.06,-.267,z-.17),
             (x-.025,-.267,z-.36),
             (x+.09,-.267,z-.56)]
        path("Subtle branching plaster crack",pts,.0025,crackmat)
        path("Hairline crack branch",
             [pts[2],(x-.15,-.268,z-.43)],.0018,crackmat)

    # 2. Larger branching cracks around the upper window and arch
    center = sign * 10.35
    # Arch spandrel keystone stress crack
    arch_pts = [
        (center, -.342, 7.42),
        (center + sign * .08, -.343, 7.68),
        (center + sign * .02, -.343, 7.95),
        (center + sign * .14, -.343, 8.28)
    ]
    path("Arch spandrel branching crack", arch_pts, .0038, deep_crackmat)
    path("Arch spandrel secondary branch",
         [arch_pts[1], (center - sign * .12, -.343, 7.82), (center - sign * .18, -.343, 8.05)],
         .0024, crackmat)

    # Arch flank stress cracks along curved voussoirs
    flank_pts = [
        (center + sign * 1.35, -.342, 6.20),
        (center + sign * 1.48, -.343, 6.55),
        (center + sign * 1.62, -.343, 6.85)
    ]
    path("Arch flank curved crack", flank_pts, .0032, deep_crackmat)

    # Upper window jamb corner stress cracks
    for wz in (8.90, 13.05, 19.75):
        for dx_corner in (-1.32, 1.32):
            w_pts = [
                (center + dx_corner, -.315, wz),
                (center + dx_corner + (0.12 if dx_corner > 0 else -0.12), -.316, wz + 0.22),
                (center + dx_corner + (0.22 if dx_corner > 0 else -0.22), -.316, wz + 0.48)
            ]
            path("Upper window corner branching crack", w_pts, .0030, deep_crackmat)
            path("Upper window fissure branch",
                 [w_pts[1], (center + dx_corner + (0.18 if dx_corner > 0 else -0.18), -.316, wz + 0.35)],
                 .0020, crackmat)

    # 3. Bottom foundation/plinth heavier cracking, black staining, and moisture weathering
    for k in range(5):
        fx = sign * (6.5 + k * 2.2)
        fz = GROUND + random.uniform(0.12, 0.45)
        plinth_pts = [
            (fx, -.340, fz),
            (fx + random.uniform(0.2, 0.4), -.341, fz + random.uniform(-0.06, 0.08)),
            (fx + random.uniform(0.5, 0.8), -.341, fz + random.uniform(-0.04, 0.12)),
            (fx + random.uniform(0.9, 1.3), -.341, fz + random.uniform(-0.08, 0.05))
        ]
        path("Foundation plinth heavy distress crack", plinth_pts, .0045, deep_crackmat)
        path("Plinth branch fissure",
             [plinth_pts[2], (plinth_pts[2][0] + 0.15, -.341, plinth_pts[2][2] - 0.20)],
             .0028, crackmat)

# Irregular exposed-plaster chips, kept small.
for _ in range(35):
    x=random.uniform(-6.4,6.4)
    z=random.uniform(8.33,8.48)
    w=random.uniform(.035,.13)
    mesh_obj("Chipped portico fascia",
             [(x,-6.586,z),(x+w,-6.586,z+.02),
              (x+w*.8,-6.586,z+.07),(x-.015,-6.586,z+.05)],
             [(0,1,2,3)],concrete)

# ---------------------------------------------------------------------
# FORECOURT, DRAINS, CIRCULAR RAISED LANDSCAPE FEATURE
# ---------------------------------------------------------------------

group("10_Ground")
box("Worn asphalt and concrete site",(0,5,GROUND-.18),
    (90,95,.36),asphalt,.01)

# Paving strips beside the building.
for sign in (-1,1):
    box("Side concrete walkway",(sign*20.0,12.7,GROUND+.035),
        (3.4,29,.08),concrete)
    for y in range(-1,28,2):
        box("Walkway joint",(sign*20,y,GROUND+.08),
            (3.4,.015,.008),dark,0)

# Forecourt construction joints and drainage channel.
for x in (-14,-7,0,7,14):
    box("Forecourt worn expansion joint",(x,-16,GROUND+.003),
        (.019,16,.004),dark,0)
box("Entrance trench drain recess",(0,-10.5,GROUND+.01),
    (20,.30,.06),dark)
for i in range(120):
    box("Drainage grate bar",(-9.95+i*.167,-10.5,GROUND+.05),
        (.032,.30,.025),metal,.002)

# Circular feature is inferred; partly beyond the matched front framing.
cx,cy=0,-15.2
ring_mesh("Circular raised stone landscape edging",
          cx,cy,GROUND,2.1,2.38,.45,concrete)
cylinder("Circular bed soil",(cx,cy,GROUND+.32),2.10,.13,soil,96)
cylinder("Central circular concrete platform",
         (cx,cy,GROUND+.48),.77,.36,stone,64)

# Stone edging divisions.
for i in range(32):
    t=i*2*math.pi/32
    path("Circular edging mortar seam",
         [(cx+2.11*math.cos(t),cy+2.11*math.sin(t),GROUND+.455),
          (cx+2.37*math.cos(t),cy+2.37*math.sin(t),GROUND+.455)],
         .008,dark)

# Restrained planting: small irregular low shrubs, not beautification.
for i in range(22):
    t=i*2*math.pi/22
    rr=random.uniform(1.30,1.85)
    x,y=cx+rr*math.cos(t),cy+rr*math.sin(t)
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=2,radius=random.uniform(.17,.30),
        location=(x,y,GROUND+.55))
    obj=move_to_group(bpy.context.object)
    obj.name="Sparse low planting"
    obj.scale=(1,.85,random.uniform(.55,.95))
    assign(obj,leafmat)

# Ground dampness patches as irregular coplanar polygons.
for _ in range(65):
    x=random.uniform(-25,25)
    y=random.uniform(-24,28)
    rx=random.uniform(.12,1.8)
    ry=random.uniform(.08,.65)
    pts=[]
    for i in range(10):
        t=i*2*math.pi/10
        f=random.uniform(.65,1.12)
        pts.append((x+rx*f*math.cos(t),y+ry*f*math.sin(t),
                    GROUND+.007))
    mesh_obj("Irregular damp forecourt patch",pts,[tuple(range(10))],stain)

# Scattered tiny chips and grit around forecourt margins.
for _ in range(95):
    x=random.uniform(-24,24)
    y=random.uniform(-22,-10)
    size=random.uniform(.015,.055)
    obj=box("Small forecourt grit",(x,y,GROUND+size/2),
            (size*1.8,size,size*.55),concrete,0)
    obj.rotation_euler.z=random.uniform(0,math.tau)

# ---------------------------------------------------------------------
# LIGHTING AND CAMERAS
# ---------------------------------------------------------------------

group("11_Lighting_Cameras")

world=bpy.data.worlds.new("Atmospheric Indian Daylight")
world.use_nodes=True
scene.world=world
nt=world.node_tree
nt.nodes.clear()
out=nt.nodes.new("ShaderNodeOutputWorld")
bg=nt.nodes.new("ShaderNodeBackground")

# Physical Nishita / Multiple-scattering Sky Texture for authentic Indian atmospheric daylight
sky=nt.nodes.new("ShaderNodeTexSky")
sky.sky_type="MULTIPLE_SCATTERING"
sky.sun_elevation=math.radians(38.0)
sky.sun_rotation=math.radians(-32.0)
sky.altitude=560.0
sky.air_density=1.15
sky.ozone_density=1.05
if hasattr(sky, "aerosol_density"):
    sky.aerosol_density=1.25
elif hasattr(sky, "dust_density"):
    sky.dust_density=1.25
sky.sun_intensity=0.88
sky.sun_disc=True
sky.ground_albedo=0.22

bg.inputs["Strength"].default_value=0.70
nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
nt.links.new(bg.outputs[0], out.inputs["Surface"])

def area(name,loc,energy,size,color,target):
    data=bpy.data.lights.new(name,"AREA")
    data.energy=energy
    data.shape="DISK"
    data.size=size
    data.color=color
    obj=bpy.data.objects.new(name,data)
    ACTIVE.objects.link(obj)
    obj.location=loc
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat("-Z","Y").to_euler()
    return obj

# Gentle atmospheric fill lights matching real ambient bounce, avoiding overexposure
area("Broad cloud-filtered daylight",(-20,-16,42),
     750,32,(1.0,.96,.90),(0,7,8))
area("Cool open-sky fill",(20,8,33),
     480,28,(.82,.90,1.0),(0,8,10))

# Interior Atrium and Corridor Lighting
area("Atrium interior warm fill", (0, 12.6, 16.0), 3200, 18, (1.0, 0.98, 0.94), (0, 12.6, 0))
# Balanced corridor fill preventing washed-out wood
area("Corridor door A119 soft fill", (9.6, 8.0, 2.6), 180, 4.0, (1.0, 0.96, 0.90), (11.45, 7.4, 1.5))
area("Corridor door A119 ambient bounce", (10.0, 6.2, 1.8), 120, 4.0, (1.0, 0.98, 0.95), (11.45, 7.4, 1.5))

# Directional daylight for natural architectural depth and overhang shadows
sun_data=bpy.data.lights.new("Diffuse daylight direction","SUN")
sun_data.energy=1.40
sun_data.angle=math.radians(7.5)
sun_data.color=(1.0, 0.97, 0.92)
sun=bpy.data.objects.new("Diffuse daylight direction",sun_data)
ACTIVE.objects.link(sun)
sun.rotation_euler=(math.radians(38),math.radians(-18),math.radians(-42))

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

scene.camera=front

# ---------------------------------------------------------------------
# RENDER SETTINGS, SCENE METADATA, SAVE
# ---------------------------------------------------------------------

parser.add_argument("--engine", default="eevee", choices=["eevee", "cycles"])
args, _ = parser.parse_known_args(argv)

if args.engine == "cycles":
    scene.render.engine = "CYCLES"
    scene.cycles.samples = RENDER_SAMPLES
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 8
    scene.cycles.diffuse_bounces = 3
    scene.cycles.glossy_bounces = 3
    scene.cycles.transmission_bounces = 4
else:
    scene.render.engine = "BLENDER_EEVEE"

scene.render.resolution_x=1920
scene.render.resolution_y=1080
scene.render.resolution_percentage=100
scene.render.image_settings.file_format="PNG"
scene.render.image_settings.color_mode="RGBA"
scene.render.film_transparent=False

scene.view_settings.view_transform="AgX"
scene.view_settings.exposure=0.0

if hasattr(scene, "node_tree") and scene.node_tree is not None:
    scene.use_nodes = True
    nt = scene.node_tree
    nt.nodes.clear()
    rl = nt.nodes.new("CompositorNodeRLayers")
    out = nt.nodes.new("CompositorNodeComposite")
    nt.links.new(rl.outputs["Image"], out.inputs["Image"])

scene["reference_status"] = (
    "Single-photo guided approximation. Not a survey-accurate reconstruction."
)
scene["inferred_geometry"] = (
    "Scale, side/rear layouts, internal partitions, elevators, roof services, "
    "atrium skylight and circular landscape feature are inferred."
)
scene["dimensions_metres"] = "Main block: 36 W x 25.2 D; 5 floors at 4.2 m."
scene["front_direction"] = "Negative Y"
scene["editable_collections"] = True

readme=bpy.data.texts.new("README_RECONSTRUCTION")
readme.write(
    "REFERENCE-GUIDED BUILDING RECONSTRUCTION\n"
    "----------------------------------------\n"
    "Five-storey institutional RCC architectural interpretation.\n"
    "Front façade follows the supplied photograph's principal composition.\n"
    "Dimensions and hidden elevations are inferred, not measured.\n\n"
    "Cameras:\n"
    "01 low front: reference-guided composition\n"
    "02 overall three-quarter\n"
    "03 inferred rear\n"
    "04 interior atrium\n"
    "05 rooftop and skylight\n\n"
    "Materials use procedural world-space roughness and weathering.\n"
    "Individual rain stains, cracks, grilles and utility objects are editable.\n"
    "The source photograph is not embedded or used as a projected texture.\n"
    "For exact matching, survey measurements and additional photos are needed.\n"
)

# Start saved scene in camera view when opened interactively.
for screen in bpy.data.screens:
    for ar in screen.areas:
        if ar.type=="VIEW_3D":
            ar.spaces.active.region_3d.view_perspective="CAMERA"
            ar.spaces.active.clip_end=500

bpy.ops.object.select_all(action="DESELECT")
scene.render.filepath=os.path.join(OUT,"front_reconstruction.png")
blend_path=os.path.join(OUT,"institutional_reconstruction.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

print("\nSaved:",blend_path)
print("Objects:",len(scene.objects))
print("Optional render:",scene.render.filepath)

parser.add_argument("--view", default="all", choices=["front", "atrium", "a119", "all", "both"])
args, _ = parser.parse_known_args(argv)

if args.render:
    if args.view in ("a119", "all"):
        scene.camera = a119_cam
        scene.render.filepath = os.path.join(OUT, "door_a119_closeup.png")
        print("Rendering Door A-119 Closeup to:", scene.render.filepath)
        bpy.ops.render.render(write_still=True)
        print("Door A-119 render complete.")
    if args.view in ("atrium", "all", "both"):
        scene.camera = atrium_cam
        scene.render.filepath = os.path.join(OUT, "atrium_interior_reconstruction.png")
        print("Rendering Atrium Interior to:", scene.render.filepath)
        bpy.ops.render.render(write_still=True)
        print("Atrium render complete.")
    if args.view in ("front", "all", "both"):
        scene.camera = front
        scene.render.filepath = os.path.join(OUT, "front_reconstruction.png")
        print("Rendering Front Facade to:", scene.render.filepath)
        bpy.ops.render.render(write_still=True)
        print("Front render complete.")
