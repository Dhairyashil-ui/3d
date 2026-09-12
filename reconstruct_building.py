"""
Photograph-informed institutional building reconstruction: The Chancellor's Academic & Research Hall.
Blender 4.2+; no external assets or Python packages required beyond Blender's NumPy.

Coordinate system:
    X: front elevation, left to right (-19.0 to +19.0 m)
    Y: front to rear (0.0 to 28.0 m)
    Z: elevation in metres
    Photographed principal facade faces -Y.

Architecture:
    Classical Beaux-Arts / Neoclassical Academic Hall:
    - Monumental hexastyle giant-order classical portico with dentiled pediment
    - Rusticated ground-floor arcade with arched window bays and keystones
    - Piano Nobile with paired arched French windows, balustraded Juliette balconies, and pediments
    - Stepped attic story with molded circular oculus (bull's-eye) windows
    - Octagonal clock cupola / lantern with arched belfry openings, copper dome, and spire finial
    - Central rotunda atrium lightwell, RC structural column-beam grid, and twin dogleg grand stairs
    - Full exterior utilities: downpipes, rooftop HVAC chiller plant, AC condenser units, lightning rods
    - Restrained, photo-realistic spatial weathering (mildew drip streaks, damp plinth moss, hairline cracks)

Default saved representation:
    SEMANTIC_POINTS visible.
    SOURCE_SURFACES hidden, but retained and editable.

Point representation:
    Vertex-only meshes, organized by floor/class/logical architectural element.
    Geometry Nodes converts vertices to renderable native points.
    The underlying vertices remain editable and contain semantic attributes.

Usage:
    blender --background --python reconstruct_building.py -- --out ./reconstruction

Optional:
    --spacing 0.065
    --max-points 3000000
    --no-ply
    --render
"""

import bpy
import math
import os
import sys
import json
import argparse
from collections import defaultdict

import numpy as np
from mathutils import Vector

bpy.context.preferences.edit.use_global_undo = False


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
parser = argparse.ArgumentParser()
parser.add_argument("--out", default="./reconstruction")
parser.add_argument("--spacing", type=float, default=0.065)
parser.add_argument("--max-points", type=int, default=3_000_000)
parser.add_argument("--no-ply", action="store_true")
parser.add_argument("--render", action="store_true")
ARGS = parser.parse_args(argv)

OUT = bpy.path.abspath(ARGS.out)
os.makedirs(OUT, exist_ok=True)

SEED = 38491
RNG = np.random.default_rng(SEED)

WIDTH = 38.0
DEPTH = 28.0
BASE = 0.90   # Elevated plinth / podium

# Floor elevations (Ground + 4 upper floors + Roof)
# Level 0 (Ground): 0.90 to 5.10 (H0 = 4.20)
# Level 1 (Piano Nobile): 5.10 to 9.00 (H1 = 3.90)
# Level 2 (Galleries): 9.00 to 12.60 (H2 = 3.60)
# Level 3 (Offices/Labs): 12.60 to 16.10 (H3 = 3.50)
# Level 4 (Attic Gallery): 16.10 to 19.40 (H4 = 3.30)
# Level 5 (Roof / Parapet): 19.40 to 20.30
LEVELS = [0.90, 5.10, 9.00, 12.60, 16.10, 19.40]
MAIN_ROOF = LEVELS[5]
CENTRAL_ROOF = MAIN_ROOF + 0.90
CUPOLA_BASE = CENTRAL_ROOF
CUPOLA_TOP = CUPOLA_BASE + 4.80

WALL_T = 0.32
SLAB_T = 0.26

CLASSES = [
    "BUILDING", "GROUND", "WALL", "COLUMN", "BEAM", "SLAB",
    "BALCONY", "PARAPET", "WINDOW", "DOOR", "STAIR", "RAILING",
    "ARCH", "ROOF", "PIPE", "AC_UNIT", "DECORATION", "OTHER"
]
CLASS_ID = {s: i for i, s in enumerate(CLASSES)}
FLOOR_NAMES = {
    -1: "SITE",
    0: "GROUND",
    1: "FLOOR_01",
    2: "FLOOR_02",
    3: "FLOOR_03",
    4: "FLOOR_04",
    5: "FLOOR_05",
    6: "ROOF",
}

# Linear-space base colors; exported PLY RGB is converted to sRGB.
PALETTE = {
    "sandstone": (0.68, 0.58, 0.44),     # Main ashlar / limestone facade
    "rusticated": (0.58, 0.49, 0.38),    # Rusticated ground arcade base
    "cream_trim": (0.76, 0.69, 0.56),    # Cornices, architraves, pediment trim
    "granite_base": (0.42, 0.39, 0.36),  # Plinth and entrance steps
    "concrete": (0.40, 0.38, 0.34),      # Structural slabs & internal beams
    "copper_roof": (0.24, 0.44, 0.38),   # Aged verdigris copper dome / cupola cap
    "roof": (0.32, 0.31, 0.28),          # Built-up flat roof membrane
    "metal": (0.28, 0.30, 0.31),         # Railings, iron grilles, brackets
    "frame": (0.52, 0.55, 0.52),         # Window frames & mullions
    "glass": (0.07, 0.12, 0.14),         # Reflective architectural glass
    "dark": (0.028, 0.032, 0.030),       # Recessed interiors & deep shadows
    "wood": (0.46, 0.29, 0.18),          # Heavy oak entrance doors
    "bronze": (0.48, 0.36, 0.22),        # Medallions, clock dials, door hardware
    "pipe": (0.50, 0.52, 0.46),          # Downpipes
    "ac": (0.54, 0.53, 0.48),            # AC condenser housings
    "grime": (0.065, 0.062, 0.040),      # Weathering streaks & cracks
    "moss": (0.12, 0.15, 0.07),          # Damp plinth edge & pavement joints
}

MATERIAL_ID = {k: i for i, k in enumerate(PALETTE)}
MATERIALS = {}
ELEMENTS = {}
ELEMENT_COUNTER = 0
ACTIVE = None
SOURCE_OBJECTS = []
COLLECTION_CACHE = {}


# ---------------------------------------------------------------------------
# Scene setup and metadata
# ---------------------------------------------------------------------------

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

for c in list(bpy.data.collections):
    if c.name != "Collection" and c.users == 0:
        bpy.data.collections.remove(c)

scene = bpy.context.scene
scene.unit_settings.system = "METRIC"
scene.unit_settings.length_unit = "METERS"
scene.unit_settings.scale_length = 1.0
bpy.context.preferences.edit.use_global_undo = False


def collection(name, parent=None):
    c = bpy.data.collections.new(name)
    (parent.children if parent else scene.collection.children).link(c)
    return c


ROOT = collection("BUILDING")
SRC = collection("SOURCE_SURFACES", ROOT)
PTS = collection("SEMANTIC_POINTS", ROOT)
PRESENTATION = collection("PRESENTATION")

ROOT["reference"] = "Photograph-informed academic institutional building reconstruction"
ROOT["building_title"] = "The Chancellor's Academic & Research Hall"
ROOT["status"] = "Photograph-informed reconstruction; not survey-verified"
ROOT["front_direction"] = "-Y"
ROOT["estimated_width_m"] = WIDTH
ROOT["estimated_depth_m"] = DEPTH
ROOT["estimated_floor_to_floor_m"] = 3.70
ROOT["floor_interpretation"] = "Ground plus four upper levels, attic, and central cupola"
ROOT["confidence_definition"] = (
    "Heuristic evidence confidence, not statistical measurement accuracy"
)


def semantic_collection(root, floor, cls):
    key = (root.name, floor, cls)
    if key in COLLECTION_CACHE:
        return COLLECTION_CACHE[key]
    fk = (root.name, floor, None)
    if fk not in COLLECTION_CACHE:
        fc = collection(FLOOR_NAMES[floor], root)
        fc["floor_id"] = floor
        COLLECTION_CACHE[fk] = fc
    c = collection(cls, COLLECTION_CACHE[fk])
    c["classification"] = CLASS_ID[cls]
    COLLECTION_CACHE[key] = c
    return c


# Stable semantic hierarchy
for root in (SRC, PTS):
    for floor in FLOOR_NAMES:
        for cls in CLASSES:
            semantic_collection(root, floor, cls)


def begin(name, cls, floor, confidence=0.35, evidence="inferred"):
    global ELEMENT_COUNTER, ACTIVE
    ELEMENT_COUNTER += 1
    ACTIVE = ELEMENT_COUNTER
    ELEMENTS[ACTIVE] = {
        "object_id": ACTIVE,
        "name": name,
        "class": cls,
        "classification": CLASS_ID[cls],
        "floor_id": floor,
        "confidence": float(confidence),
        "evidence": evidence,
        "parts": [],
    }
    return ACTIVE


def register(obj, mat):
    e = ELEMENTS[ACTIVE]
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    semantic_collection(SRC, e["floor_id"], e["class"]).objects.link(obj)
    obj.name = f'{ACTIVE:05d}_{e["name"]}_{len(e["parts"]):02d}'
    obj.data.materials.append(MATERIALS[mat])
    obj["object_id"] = ACTIVE
    obj["element_type"] = e["classification"]
    obj["classification"] = e["classification"]
    obj["floor_id"] = e["floor_id"]
    obj["material_id"] = MATERIAL_ID[mat]
    obj["confidence"] = e["confidence"]
    obj["evidence"] = e["evidence"]
    obj["material_key"] = mat
    e["parts"].append(obj)
    SOURCE_OBJECTS.append(obj)
    return obj


# ---------------------------------------------------------------------------
# Materials with PBR Micro-surface and Weathering Noise
# ---------------------------------------------------------------------------

def make_material(key, color):
    mat = bpy.data.materials.new(key)
    mat.use_nodes = True
    nt = mat.node_tree
    p = nt.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = 0.82

    if key == "glass":
        p.inputs["Roughness"].default_value = 0.22
        p.inputs["Metallic"].default_value = 0.08
        p.inputs["Transmission Weight"].default_value = 0.20
        p.inputs["IOR"].default_value = 1.48
    elif key in {"metal", "frame", "pipe"}:
        p.inputs["Metallic"].default_value = 0.50
        p.inputs["Roughness"].default_value = 0.50
    elif key in {"bronze"}:
        p.inputs["Metallic"].default_value = 0.75
        p.inputs["Roughness"].default_value = 0.42
    elif key in {"copper_roof"}:
        p.inputs["Metallic"].default_value = 0.25
        p.inputs["Roughness"].default_value = 0.65
    elif key in {"wood"}:
        p.inputs["Roughness"].default_value = 0.55
    else:
        tex = nt.nodes.new("ShaderNodeTexCoord")
        noise = nt.nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 2.4
        noise.inputs["Detail"].default_value = 4.0
        noise.inputs["Roughness"].default_value = 0.70
        nt.links.new(tex.outputs["Object"], noise.inputs["Vector"])

        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.20
        ramp.color_ramp.elements[0].color = (
            color[0] * .66, color[1] * .66, color[2] * .65, 1)
        ramp.color_ramp.elements[1].position = 0.80
        ramp.color_ramp.elements[1].color = (
            min(color[0] * 1.08, 1),
            min(color[1] * 1.07, 1),
            min(color[2] * 1.06, 1), 1)
        nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])

        micro = nt.nodes.new("ShaderNodeTexNoise")
        micro.inputs["Scale"].default_value = 120.0
        micro.inputs["Detail"].default_value = 2.0
        nt.links.new(tex.outputs["Object"], micro.inputs["Vector"])
        bump = nt.nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = 0.18
        bump.inputs["Distance"].default_value = 0.010
        nt.links.new(micro.outputs["Fac"], bump.inputs["Height"])
        nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])

    return mat


for key, color in PALETTE.items():
    MATERIALS[key] = make_material(key, color)

print("[1/6] Materials initialized.", flush=True)


# ---------------------------------------------------------------------------
# Procedural Primitive Construction
# ---------------------------------------------------------------------------

# Unit template cube mesh centered at (0, 0, 0) with size 1x1x1
CUBE_MESH = bpy.data.meshes.new("template_cube")
_cube_verts = [
    (-0.5, -0.5, -0.5), (0.5, -0.5, -0.5), (0.5, 0.5, -0.5), (-0.5, 0.5, -0.5),
    (-0.5, -0.5,  0.5), (0.5, -0.5,  0.5), (0.5, 0.5,  0.5), (-0.5, 0.5,  0.5)
]
_cube_faces = [
    (0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1),
    (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)
]
CUBE_MESH.from_pydata(_cube_verts, [], _cube_faces)
CUBE_MESH.update()

CYL_MESH_CACHE = {}


def get_cylinder_mesh(vertices=24):
    if vertices in CYL_MESH_CACHE:
        return CYL_MESH_CACHE[vertices]
    m = bpy.data.meshes.new(f"template_cylinder_{vertices}")
    angles = [i * 2 * math.pi / vertices for i in range(vertices)]
    verts = []
    for a in angles:
        verts.append((math.cos(a), math.sin(a), -0.5))
    for a in angles:
        verts.append((math.cos(a), math.sin(a), 0.5))
    faces = []
    for i in range(vertices):
        nxt = (i + 1) % vertices
        faces.append((i, nxt, nxt + vertices, i + vertices))
    faces.append(tuple(reversed(range(vertices))))
    faces.append(tuple(range(vertices, 2 * vertices)))
    m.from_pydata(verts, [], faces)
    m.update()
    CYL_MESH_CACHE[vertices] = m
    return m


def box(name, center, size, mat="sandstone", rotation=0.0):
    m = CUBE_MESH.copy()
    obj = bpy.data.objects.new(name, m)
    obj.location = center
    obj.scale = size
    obj.rotation_euler = (0, 0, rotation)
    return register(obj, mat)


def cylinder(name, center, radius, height, mat="sandstone", vertices=24):
    m = get_cylinder_mesh(vertices).copy()
    obj = bpy.data.objects.new(name, m)
    obj.location = center
    obj.scale = (radius, radius, height)
    return register(obj, mat)


def rod(name, a, b, radius, mat="metal", vertices=12):
    a, b = Vector(a), Vector(b)
    d = b - a
    if d.length < 1e-5:
        d = Vector((0, 0, 1e-4))
    obj = cylinder(name, (a + b) / 2, radius, d.length, mat, vertices)
    obj.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    return obj


def beam_between(name, a, b, width, depth, mat="cream_trim"):
    a, b = Vector(a), Vector(b)
    d = b - a
    obj = box(name, (a + b) / 2, (width, depth, max(d.length, 1e-4)), mat)
    obj.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    return obj


def mesh_object(name, verts, faces, mat="sandstone"):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    return register(obj, mat)


# Wall-local frame: u horizontal; v inward; z upward.
class Facade:
    def __init__(self, origin, tangent, inward):
        self.o = np.array(origin, dtype=float)
        self.u = np.array(tangent, dtype=float)
        self.v = np.array(inward, dtype=float)
        self.angle = math.atan2(self.u[1], self.u[0])

    def p(self, u, v, z):
        xy = self.o + self.u * u + self.v * v
        return (float(xy[0]), float(xy[1]), float(z))

    def box(self, name, u, v, z, w, d, h, mat="sandstone"):
        return box(name, self.p(u, v, z), (w, d, h), mat, self.angle)

    def rod(self, name, a, b, radius, mat="metal"):
        return rod(name, self.p(*a), self.p(*b), radius, mat)

    def prism(self, name, polygon_uz, v0, v1, mat="sandstone"):
        n = len(polygon_uz)
        verts = [self.p(u, v0, z) for u, z in polygon_uz]
        verts += [self.p(u, v1, z) for u, z in polygon_uz]
        faces = [tuple(reversed(range(n))), tuple(range(n, 2*n))]
        faces += [(i, (i+1) % n, (i+1) % n+n, i+n) for i in range(n)]
        return mesh_object(name, verts, faces, mat)


FRONT = Facade((0, 0), (1, 0), (0, 1))
RIGHT = Facade((WIDTH/2, 0), (0, 1), (-1, 0))
LEFT = Facade((-WIDTH/2, DEPTH), (0, -1), (1, 0))
REAR = Facade((WIDTH/2, DEPTH), (-1, 0), (0, -1))


def panel_with_holes(F, name, u0, u1, z0, z1, v, thickness,
                     holes, floor, confidence=.65, mat="sandstone"):
    """
    Build a thick wall as nonoverlapping cells around rectangular holes.
    Ensures true physical wall openings.
    """
    begin(name, "WALL", floor, confidence,
          "visible-layout estimate" if confidence >= .6 else "inferred")
    us = sorted(set([u0, u1] + [
        max(u0, min(u1, q)) for h in holes for q in h[:2]]))
    zs = sorted(set([z0, z1] + [
        max(z0, min(z1, q)) for h in holes for q in h[2:]]))
    for a, b in zip(us[:-1], us[1:]):
        for c, d in zip(zs[:-1], zs[1:]):
            if b-a < 1e-5 or d-c < 1e-5:
                continue
            um, zm = (a+b)/2, (c+d)/2
            empty = any(x0 < um < x1 and y0 < zm < y1
                        for x0, x1, y0, y1 in holes)
            if not empty:
                F.box("wall_cell", um, v+thickness/2, zm,
                      b-a, thickness, d-c, mat)


def window(F, name, u, z, w, h, v, floor, conf=.65,
           cols=2, rows=3, grille=False, door=False, arched=False):
    """
    Classical architectural window with sills, reveals, mullions,
    glazing pane, and recessed interior shadow backing.
    """
    begin(name, "DOOR" if door else "WINDOW", floor, conf,
          "visible-layout estimate" if conf >= .6 else "inferred")
    fw = .055 if not door else .075
    gd = v + .16

    # Dark interior backing plane
    F.box("interior_shadow", u, gd+.15, z, w-.025, .025, h-.025, "dark")

    if door:
        # Solid wood door panels
        F.box("wood_door_leaf_left", u-w/4, gd+.02, z,
              w/2-.02, .04, h-.04, "wood")
        F.box("wood_door_leaf_right", u+w/4, gd+.02, z,
              w/2-.02, .04, h-.04, "wood")
        for side in (-1, 1):
            F.rod("bronze_handle", (u+side*(w/4-.18), gd-.06, z-.15),
                  (u+side*(w/4-.18), gd-.06, z+.15), .022, "bronze")
    else:
        # Combined glass panel
        F.box("glazing_panel", u, gd+.024, z, w-fw, .022, h-fw, "glass")
        # Frame outer perimeter and primary mullion
        F.box("frame_outer", u, gd, z, w, .075, h, "frame")
        if cols > 1:
            F.box("vertical_mullion", u, gd-.005, z, fw, .076, h, "frame")
        if rows > 1:
            F.box("horizontal_transom", u, gd-.005, z, w, .076, fw, "frame")

    # Classical molded sill and reveals
    F.box("sill", u, v+.045, z-h/2-.075,
          w+.18, .42, .14, "cream_trim")
    F.box("reveal_left", u-w/2-.03, v+.095, z,
          .06, .22, h, "cream_trim")
    F.box("reveal_right", u+w/2+.03, v+.095, z,
          .06, .22, h, "cream_trim")

    if grille:
        F.rod("grille_v1", (u-w/4, v-.05, z-h/2+.06), (u-w/4, v-.05, z+h/2-.06), .014)
        F.rod("grille_v2", (u+w/4, v-.05, z-h/2+.06), (u+w/4, v-.05, z+h/2-.06), .014)
        F.rod("grille_h1", (u-w/2+.06, v-.055, z), (u+w/2-.06, v-.055, z), .014)


def circular_window(F, name, u, z, radius, v, floor, conf=.65):
    """Circular attic oculus (bull's-eye) window with quadrant muntins."""
    begin(name, "WINDOW", floor, conf)
    gd = v + .16
    F.box("interior_shadow", u, gd+.12, z,
          radius*1.9, .02, radius*1.9, "dark")

    # Glass disc approximated by polygonal cylinder
    cylinder("oculus_glass", F.p(u, gd+.02, z),
             radius*.88, .025, "glass", 24)
    # Molded outer surround
    cylinder("oculus_surround", F.p(u, v+.04, z),
             radius*1.18, .12, "cream_trim", 32)
    # Radial quadrant frame bars
    F.rod("muntin_vert", (u, gd-.02, z-radius*.85),
          (u, gd-.02, z+radius*.85), .016, "frame")
    F.rod("muntin_horiz", (u-radius*.85, gd-.02, z),
          (u+radius*.85, gd-.02, z), .016, "frame")
    # Keystone accents at 4 cardinal points
    for du, dz in ((0, radius*1.12), (0, -radius*1.12),
                   (radius*1.12, 0), (-radius*1.12, 0)):
        F.box("oculus_keystone", u+du, v-.02, z+dz,
              .16, .18, .16, "cream_trim")


def railing(F, name, u0, u1, v, z, floor, conf=.55, height=1.05):
    begin(name, "RAILING", floor, conf)
    count = max(2, int((u1-u0)/.65)+1)
    for uc in np.linspace(u0, u1, count):
        F.rod("post", (uc, v, z), (uc, v, z+height), .024)
    for hh in (.12, .40, .72, height):
        F.rod("rail", (u0, v, z+hh), (u1, v, z+hh), .022)


def balustrade(F, name, u0, u1, v, z, floor, conf=.65, height=0.95):
    """Classical stone balustrade with top rail, bottom plinth, and urn balusters."""
    begin(name, "BALCONY", floor, conf)
    w = u1 - u0
    uc = (u0 + u1) / 2
    F.box("balustrade_plinth", uc, v, z + 0.08, w, 0.28, 0.16, "cream_trim")
    F.box("balustrade_coping", uc, v, z + height - 0.06, w, 0.32, 0.12, "cream_trim")
    # Discrete baluster pillars
    num_balusters = max(2, int(w / 0.85))
    for x_pos in np.linspace(u0 + 0.25, u1 - 0.25, num_balusters):
        cylinder("baluster_shaft", F.p(x_pos, v, z + height/2),
                 0.075, height - 0.28, "cream_trim", 12)


def band(F, name, u0, u1, v, z, height, floor, count,
         conf=.65, mat="sandstone"):
    """
    A continuous architectural frieze with recessed square panels,
    upper/lower molding strips, and separating piers.
    """
    begin(name, "DECORATION", floor, conf)
    step = (u1-u0)/count
    sq = min(.42, height*.48, step*.48)
    front = v
    F.box("backing", (u0+u1)/2, front+.16, z,
          u1-u0, .16, height, mat)
    margin = (height-sq)/2
    for sign in (-1, 1):
        F.box("continuous_strip", (u0+u1)/2, front+.04,
              z+sign*(sq/2+margin/2),
              u1-u0, .08, margin, mat)

    ends = [(u0, u0+step/2-sq/2)]
    for i in range(count-1):
        c = u0+(i+.5)*step
        ends.append((c+sq/2, c+step-sq/2))
    ends.append((u1-step/2+sq/2, u1))

    for a, b in ends:
        if b > a:
            F.box("pocket_separator", (a+b)/2, front+.04, z,
                  b-a, .08, sq, mat)
    for i in range(count):
        uc = u0+(i+.5)*step
        F.box("recessed_square_insert", uc, front+.055, z,
              sq-.025, .022, sq-.025, "cream_trim")
    for dz in (-height/2-.045, height/2+.045):
        F.box("band_moulding", (u0+u1)/2, front+.025, z+dz,
              u1-u0+.08, .18, .09, "cream_trim")


def column_stack(x, y, z0, z1, radius, floor, name,
                 conf=.65, mat="sandstone"):
    """Classical column with molded plinth base, fluted shaft, and capital."""
    begin(name, "COLUMN", floor, conf,
          "visible-layout estimate" if conf >= .6 else "inferred")
    h = z1 - z0
    # Shaft
    cylinder("shaft", (x, y, (z0+z1)/2),
             radius, h, mat, 40)
    # Molded base plinth
    cylinder("base_torus", (x, y, z0+.08),
             radius*1.24, .16, "cream_trim", 40)
    box("base_plinth", (x, y, z0+.03),
        (radius*2.6, radius*2.6, .06), "granite_base")
    # Classical capital
    cylinder("capital_echinus", (x, y, z1-.10),
             radius*1.22, .18, "cream_trim", 40)
    box("capital_abacus", (x, y, z1-.03),
        (radius*2.6, radius*2.6, .06), "cream_trim")

    # Fluting / joint collar accents for giant order
    if h > 5.0:
        for zz in np.linspace(z0+1.2, z1-1.2, int(h/2.2)):
            cylinder("plaster_joint", (x, y, zz),
                     radius*1.02, .035, "cream_trim", 40)


def arch_bay(F, name, u, width, bottom, spring, top, v,
             thickness, floor, keystone=True):
    """True semicircular arch bay with wedge spandrels and prominent keystone."""
    begin(name, "ARCH", floor, .68, "visible curved arched bay")
    r = width/2

    # Side piers
    pier_w = 0.48
    F.box("left_pier", u-r-pier_w/2, v+thickness/2,
          (bottom+top)/2, pier_w, thickness, top-bottom, "rusticated")
    F.box("right_pier", u+r+pier_w/2, v+thickness/2,
          (bottom+top)/2, pier_w, thickness, top-bottom, "rusticated")

    # True curved intrados spandrels via closed extruded prisms
    angles = np.linspace(math.pi, 0, 17)
    pts = [(u+r*math.cos(t), spring+r*math.sin(t)) for t in angles]
    mid = len(pts) // 2
    poly_left = [(u-r, spring), (u-r, top), (u, top)] + list(reversed(pts[:mid+1]))
    F.prism("spandrel_left", poly_left, v, v+thickness, "rusticated")
    poly_right = [(u, top), (u+r, top), (u+r, spring)] + list(reversed(pts[mid:]))
    F.prism("spandrel_right", poly_right, v, v+thickness, "rusticated")

    # Recessed dark back for depth
    polygon = [(u-r, bottom), (u+r, bottom)]
    polygon += list(reversed(pts))
    F.prism("arched_recess_back", polygon,
            v+thickness+.28, v+thickness+.31, "dark")

    # Window glazing inside the arch
    window(F, name+"_lower_glazing", u, (bottom+spring)/2,
           width-.12, spring-bottom-.08,
           v+thickness+.08, floor, .64, cols=2, rows=2)

    # Fanlight radial glazing in the semicircle arch head
    for angle in np.linspace(math.pi*0.2, math.pi*0.8, 3):
        rad_end = (u+r*0.92*math.cos(angle),
                   v+thickness+.09,
                   spring+r*0.92*math.sin(angle))
        F.rod("fanlight_muntin", (u, v+thickness+.09, spring),
              (rad_end[0], v+thickness+.09, rad_end[2]), .015, "frame")

    # Keystone
    if keystone:
        F.box("arch_keystone", u, v-.04, spring+r+.05,
              .32, thickness+.08, .36, "cream_trim")


def pediment(F, u, z, width, v, floor, height=1.65, depth=0.45):
    """Classical triangular pediment with tympanum and raking cornices."""
    begin(f"pediment_{u:+.1f}_{z:.1f}", "DECORATION", floor, .72,
          "visible classical triangular window pediment")
    tri = [(u-width/2, z), (u+width/2, z), (u, z+height)]
    F.prism("pediment_tympanum", tri, v-depth/2, v+depth/2, "cream_trim")
    F.box("pediment_entablature", u, v, z-.12,
          width+.20, depth+.16, .24, "cream_trim")
    # Raking cornice beams along slopes
    for a, b in ((tri[0], tri[2]), (tri[2], tri[1])):
        beam_between("raking_cornice",
                     F.p(a[0], v-depth/2-.04, a[1]+.03),
                     F.p(b[0], v-depth/2-.04, b[1]+.03),
                     .16, .18, "cream_trim")


# ---------------------------------------------------------------------------
# 1. Site, Foundations and Structural Slabs
# ---------------------------------------------------------------------------

begin("site_paved_apron", "GROUND", -1, .40,
      "foreground plaza and surrounding apron")
box("paved_plaza", (0, DEPTH/2-3, -.18), (52, 46, .34), "granite_base")

begin("building_podium_plinth", "SLAB", 0, .45)
box("podium_plinth", (0, DEPTH/2, BASE/2),
    (WIDTH+.50, DEPTH+.50, BASE), "rusticated")

# Stairwell opening coordinates: twin symmetrical stairs on east and west wings
# West stair: X in [-16.5, -12.5], Y in [14.0, 20.5]
# East stair: X in [12.5, 16.5], Y in [14.0, 20.5]
# Central Rotunda Atrium Lightwell opening: X in [-5.0, 5.0], Y in [6.5, 14.5]

for f in range(6):
    zz = LEVELS[f]
    begin(f"floor_{f}_structural_slab", "SLAB", f, .38)
    if f == 0:
        box("ground_structural_slab", (0, DEPTH/2, zz-SLAB_T/2),
            (WIDTH, DEPTH, SLAB_T), "concrete")
        continue

    # Upper floors with rotunda lightwell and twin stair openings
    # Floor slabs structured around the central atrium and stair cores
    # 1. Rear zone behind stairs (Y in [20.5, DEPTH])
    box("slab_rear_zone", (0, (20.5+DEPTH)/2, zz-SLAB_T/2),
        (WIDTH, DEPTH-20.5, SLAB_T), "concrete")
    # 2. Central zone between stairs (Y in [14.0, 20.5], X in [-12.5, 12.5])
    box("slab_mid_center", (0, 17.25, zz-SLAB_T/2),
        (25.0, 6.5, SLAB_T), "concrete")
    # 3. Outer flanks outside stairs (X < -16.5 and X > 16.5)
    for sign in (-1, 1):
        box("slab_outer_flank", (sign*(16.5+WIDTH/2)/2, 17.25, zz-SLAB_T/2),
            (WIDTH/2-16.5, 6.5, SLAB_T), "concrete")
    # 4. Front wings (Y in [0, 14.0], excluding central rotunda lightwell for floors 1..3)
    if f in (1, 2, 3):
        # Flanking slabs left and right of rotunda
        for sign in (-1, 1):
            box("slab_front_flank", (sign*(5.0+WIDTH/2)/2, 7.0, zz-SLAB_T/2),
                (WIDTH/2-5.0, 14.0, SLAB_T), "concrete")
        # Front portico gallery bridge across front (Y in [0, 4.0])
        box("slab_rotunda_front_bridge", (0, 2.0, zz-SLAB_T/2),
            (10.0, 4.0, SLAB_T), "concrete")
    else:
        # Full front slab on attic/roof floor
        box("slab_front_full", (0, 7.0, zz-SLAB_T/2),
            (WIDTH, 14.0, SLAB_T), "concrete")

# Internal RC column grid (6 along X, 4 along Y)
for f in range(5):
    z0, z1 = LEVELS[f], LEVELS[f+1]
    for x in (-15.0, -9.0, -3.0, 3.0, 9.0, 15.0):
        for y in (5.5, 12.0, 18.5, 25.0):
            # Skip columns inside the open atrium lightwell or stairwell flights
            if abs(x) < 4.0 and 6.0 < y < 13.0 and f < 4:
                continue
            if (13.0 < abs(x) < 16.0) and (14.5 < y < 20.0):
                continue
            begin(f"internal_rc_column_{f}_{x}_{y}", "COLUMN", f, .25)
            cylinder("rc_column_shaft", (x, y, (z0+z1)/2), .26, z1-z0, "concrete", 12)
    begin(f"internal_structural_beams_{f}", "BEAM", f, .25)
    for y in (5.5, 12.0, 18.5):
        box("transverse_primary_beam", (0, y, z1-.38),
            (WIDTH-.60, .40, .42), "concrete")
    for x in (-15.0, -9.0, 0.0, 9.0, 15.0):
        box("longitudinal_primary_beam", (x, 15.0, z1-.38),
            (.40, DEPTH-4.0, .42), "concrete")

# Internal corridors, room partitions, and paneled oak doors
for f in range(5):
    z0, z1 = LEVELS[f]+.03, LEVELS[f+1]-.28
    CORR = Facade((-WIDTH/2+2.0, 12.0), (1, 0), (0, 1))
    door_u = (4.0, 10.0, 24.0, 30.0)
    holes = [(u-.60, u+.60, z0, z0+2.30) for u in door_u]
    panel_with_holes(CORR, f"corridor_partition_{f}",
                     0, WIDTH-4.0, z0, z1, 0, .20, holes, f, .22)
    for i, u in enumerate(door_u):
        window(CORR, f"internal_classroom_door_{f}_{i}", u, z0+1.15,
               1.18, 2.30, .02, f, .22, cols=1, rows=1, door=True)
    begin(f"faculty_partitions_{f}", "WALL", f, .20)
    for x in (-12.0, -6.0, 6.0, 12.0):
        box("cross_partition", (x, 21.5, (z0+z1)/2),
            (.20, 7.0, z1-z0), "sandstone")

print("[2/6] Structural plinth, slabs & internal column-beam grid built.", flush=True)


# ---------------------------------------------------------------------------
# 2. Front Facade: Monumental Hexastyle Portico
# ---------------------------------------------------------------------------

# Portico parameters
PORTICO_W = 13.6
PORTICO_PROJ = 3.0   # Projects forward from y=0 to y=-3.0
PORTICO_Z0 = BASE
PORTICO_Z1 = LEVELS[2]  # Rises 2 full storeys (to 9.00 m, height 8.10 m)

begin("monumental_portico_podium", "SLAB", 0, .75,
      "visible front portico podium extension")
box("portico_plinth_extension", (0, -PORTICO_PROJ/2, (BASE)/2),
    (PORTICO_W+1.2, PORTICO_PROJ, BASE), "rusticated")

# 6 Giant Order Classical Columns along the front portico line (y = -PORTICO_PROJ)
column_x = [-5.5, -3.3, -1.1, 1.1, 3.3, 5.5]
for i, cx in enumerate(column_x):
    column_stack(cx, -PORTICO_PROJ, PORTICO_Z0, PORTICO_Z1,
                 .38, 1, f"giant_portico_column_{i}", .78, "sandstone")

# Return columns at the sides of the portico
for sign in (-1, 1):
    column_stack(sign*5.5, -PORTICO_PROJ/2, PORTICO_Z0, PORTICO_Z1,
                 .38, 1, f"giant_portico_return_column_{sign}", .76, "sandstone")

# Portico Entablature: Architrave, Frieze, and Dentiled Modillion Cornice
begin("portico_entablature", "BEAM", 2, .78,
      "visible monumental portico entablature")
box("portico_architrave", (0, -PORTICO_PROJ/2, PORTICO_Z1+.20),
    (PORTICO_W+1.4, PORTICO_PROJ+1.2, .40), "cream_trim")
band(FRONT, "portico_frieze_band",
     -PORTICO_W/2-.5, PORTICO_W/2+.5, -PORTICO_PROJ-.25,
     PORTICO_Z1+.62, .44, 2, 10, .76, "sandstone")
box("portico_modillion_cornice", (0, -PORTICO_PROJ/2, PORTICO_Z1+1.02),
    (PORTICO_W+2.2, PORTICO_PROJ+2.0, .36), "cream_trim")

# Portico Coffered Ceiling Soffit
begin("portico_coffered_soffit", "DECORATION", 1, .70)
for x in np.linspace(-5.0, 5.0, 5):
    box("coffered_long_rib", (x, -PORTICO_PROJ/2, PORTICO_Z1-.18),
        (.22, PORTICO_PROJ-.20, .32), "cream_trim")
for y in np.linspace(-PORTICO_PROJ+.5, -.5, 3):
    box("coffered_cross_rib", (0, y, PORTICO_Z1-.18),
        (PORTICO_W-.8, .22, .32), "cream_trim")

# Triangular Pediment atop the Portico (spans from z = PORTICO_Z1 + 1.20 to z = PORTICO_Z1 + 4.20)
ped_bottom = PORTICO_Z1 + 1.20
ped_h = 3.0
ped_w = PORTICO_W + 2.0
pediment(FRONT, 0, ped_bottom, ped_w, -PORTICO_PROJ, 3, height=ped_h, depth=.55)

# Classical Medallion / Coat-of-Arms Relief inside the Portico Tympanum
begin("pediment_tympanum_medallion", "DECORATION", 3, .72)
cylinder("central_relief_medallion", (0, -PORTICO_PROJ-.32, ped_bottom+ped_h*0.42),
         .65, .12, "bronze", 32)

# Grand Entrance Steps Sweeping Down from Portico (from y = -PORTICO_PROJ to -6.20, z = BASE to 0)
begin("grand_entrance_staircase", "STAIR", 0, .75,
      "visible front monumental approach steps")
num_front_steps = 7
for s in range(num_front_steps):
    step_z = BASE * (num_front_steps - s) / num_front_steps
    step_y = -PORTICO_PROJ - (s + 1) * 0.45
    box(f"front_step_{s}", (0, step_y + .22, step_z/2),
        (PORTICO_W + 3.0 + s * 0.40, 0.46, step_z), "granite_base")
    box(f"step_nosing_{s}", (0, step_y + .03, step_z - .02),
        (PORTICO_W + 3.1 + s * 0.40, .06, .04), "cream_trim")

# Symmetrical Cheek Plinths flanking the steps with Ornamental Urn Pedestals
for side in (-1, 1):
    cheek_x = side * (PORTICO_W/2 + 2.2)
    begin(f"entrance_cheek_plinth_{side}", "OTHER", 0, .70)
    box("cheek_wall", (cheek_x, -PORTICO_PROJ - 1.8, BASE/2),
        (.75, 4.2, BASE), "granite_base")
    box("cheek_coping", (cheek_x, -PORTICO_PROJ - 1.8, BASE+.08),
        (.90, 4.4, .16), "cream_trim")
    # Classical Urn Pedestal
    cylinder("urn_pedestal_base", (cheek_x, -PORTICO_PROJ - 3.4, BASE+.30),
             .34, .36, "cream_trim", 24)
    cylinder("urn_body", (cheek_x, -PORTICO_PROJ - 3.4, BASE+.70),
             .28, .44, "bronze", 24)


# ---------------------------------------------------------------------------
# 3. Front Wall Behind the Portico: Monumental Portal & Loggia
# ---------------------------------------------------------------------------

# Ground Level (0.90 to 5.10): Monumental Arched Double-Door Portal
ENT = Facade((0, 0), (1, 0), (0, 1))
portal_w = 2.80
portal_bottom = BASE
portal_spring = BASE + 2.80
portal_top = BASE + 4.10
portal_hole = (-portal_w/2, portal_w/2, portal_bottom, portal_top)

# Flanking niche windows behind the portico
flank_w_u = (-4.2, 4.2)
holes_ground_portico = [portal_hole]
for fu in flank_w_u:
    holes_ground_portico.append((fu-0.90, fu+0.90, BASE+0.40, BASE+3.40))

panel_with_holes(ENT, "ground_portico_rear_wall",
                 -PORTICO_W/2, PORTICO_W/2, BASE, LEVELS[1],
                 0, WALL_T, holes_ground_portico, 0, .75, "rusticated")

# Arched Portal Construction
arch_bay(ENT, "monumental_entrance_portal", 0, portal_w,
         portal_bottom, portal_spring, portal_top, 0, WALL_T, 0)
window(ENT, "grand_entrance_double_doors", 0, (portal_bottom+portal_spring)/2,
       portal_w-.10, portal_spring-portal_bottom, .04, 0, .76,
       cols=2, rows=2, door=True)

# Flanking Ground Windows behind Portico
for fu in flank_w_u:
    window(ENT, f"portico_ground_niche_window_{fu:+.1f}", fu,
           BASE+1.90, 1.80, 3.00, .04, 0, .70, cols=2, rows=3, grille=True)

# First Floor Loggia (5.10 to 9.00) behind the Giant Columns
loggia_holes = []
for lu in (-4.0, 0.0, 4.0):
    loggia_holes.append((lu-1.15, lu+1.15, LEVELS[1]+.20, LEVELS[2]-.30))

panel_with_holes(ENT, "first_floor_loggia_wall",
                 -PORTICO_W/2, PORTICO_W/2, LEVELS[1], LEVELS[2],
                 0, WALL_T, loggia_holes, 1, .75, "sandstone")

for i, lu in enumerate((-4.0, 0.0, 4.0)):
    window(ENT, f"loggia_french_window_{i}", lu,
           (LEVELS[1]+LEVELS[2])/2, 2.30, LEVELS[2]-LEVELS[1]-.50,
           .04, 1, .74, cols=2, rows=4, door=True)

# Loggia wrought iron railing spanning between giant columns
railing(FRONT, "portico_mezzanine_balcony_railing",
        -5.4, 5.4, -PORTICO_PROJ+.10, LEVELS[1], 1, .74, height=1.05)


# ---------------------------------------------------------------------------
# 4. Front Facade: Symmetrical East and West Flanking Wings
# ---------------------------------------------------------------------------

# Wing layout: Left wing X in [-19.0, -PORTICO_W/2], Right wing X in [PORTICO_W/2, 19.0]
# 3 regular architectural bays per wing:
# Left wing bays at U = -15.2, -11.2, -8.0
# Right wing bays at U = 8.0, 11.2, 15.2

for sign in (-1, 1):
    w_min, w_max = sorted((sign * (PORTICO_W/2), sign * (WIDTH/2)))
    bays = [sign * 8.0, sign * 11.4, sign * 15.4] if sign > 0 else [sign * 15.4, sign * 11.4, sign * 8.0]

    # --- Ground Floor (0.90 to 5.10): Rusticated Arcade with Arched Windows ---
    g_holes = []
    for bu in bays:
        g_holes.append((bu-1.10, bu+1.10, BASE+0.40, BASE+3.80))

    panel_with_holes(FRONT, f"front_wing_ground_{sign}",
                     w_min, w_max, BASE, LEVELS[1],
                     0, WALL_T, g_holes, 0, .72, "rusticated")

    for i, bu in enumerate(bays):
        arch_bay(FRONT, f"wing_ground_arch_{sign}_{i}", bu, 2.20,
                 BASE+0.40, BASE+2.70, BASE+3.80, 0, WALL_T, 0)

    # --- Piano Nobile (Floor 1: 5.10 to 9.00): Paired Arched Windows with Juliette Balconies ---
    p_holes = []
    for bu in bays:
        p_holes.append((bu-1.15, bu+1.15, LEVELS[1]+0.30, LEVELS[2]-0.30))

    panel_with_holes(FRONT, f"front_wing_piano_nobile_{sign}",
                     w_min, w_max, LEVELS[1], LEVELS[2],
                     0, WALL_T, p_holes, 1, .74, "sandstone")

    for i, bu in enumerate(bays):
        window(FRONT, f"piano_nobile_window_{sign}_{i}", bu,
               (LEVELS[1]+LEVELS[2])/2, 2.30, LEVELS[2]-LEVELS[1]-0.60,
               .04, 1, .74, cols=2, rows=4)
        # Stone balustraded Juliette balcony
        balustrade(FRONT, f"juliette_balcony_{sign}_{i}",
                   bu-1.35, bu+1.35, -.24, LEVELS[1], 1, .72, height=0.90)
        # Triangular pediment lintel over Piano Nobile windows
        pediment(FRONT, bu, LEVELS[2]-.20, 2.80, -.04, 1, height=0.75, depth=0.36)

    # Continuous Stringcourse Cornice between Floor 1 and Floor 2
    begin(f"front_stringcourse_band_{sign}", "DECORATION", 1, .70)
    FRONT.box("stringcourse_moulding", (w_min+w_max)/2, -.08, LEVELS[2],
              abs(w_max-w_min)+.15, .38, .22, "cream_trim")

    # --- Floor 2 (9.00 to 12.60): Rectangular Paired Windows with Molded Architraves ---
    f2_holes = []
    for bu in bays:
        f2_holes.append((bu-1.10, bu+1.10, LEVELS[2]+0.50, LEVELS[3]-0.40))

    panel_with_holes(FRONT, f"front_wing_floor_2_{sign}",
                     w_min, w_max, LEVELS[2], LEVELS[3],
                     0, WALL_T, f2_holes, 2, .72, "sandstone")

    for i, bu in enumerate(bays):
        window(FRONT, f"floor2_window_{sign}_{i}", bu,
               (LEVELS[2]+LEVELS[3])/2, 2.20, LEVELS[3]-LEVELS[2]-0.90,
               .04, 2, .72, cols=2, rows=3)
        # Molded apron panel below window sill
        FRONT.box("apron_panel", bu, -.02, LEVELS[2]+.25,
                  2.20, .14, .38, "cream_trim")

    # --- Floor 3 (12.60 to 16.10): Regular Double-Casement Windows ---
    f3_holes = []
    for bu in bays:
        f3_holes.append((bu-1.05, bu+1.05, LEVELS[3]+0.45, LEVELS[4]-0.45))

    panel_with_holes(FRONT, f"front_wing_floor_3_{sign}",
                     w_min, w_max, LEVELS[3], LEVELS[4],
                     0, WALL_T, f3_holes, 3, .70, "sandstone")

    for i, bu in enumerate(bays):
        window(FRONT, f"floor3_window_{sign}_{i}", bu,
               (LEVELS[3]+LEVELS[4])/2, 2.10, LEVELS[4]-LEVELS[3]-0.90,
               .04, 3, .70, cols=2, rows=3)

    # Secondary Cornice dividing Main Facade from Attic Story
    begin(f"front_attic_beltcourse_{sign}", "DECORATION", 3, .70)
    FRONT.box("beltcourse_moulding", (w_min+w_max)/2, -.06, LEVELS[4],
              abs(w_max-w_min)+.15, .32, .20, "cream_trim")

    # --- Floor 4 (Attic: 16.10 to 19.40): Circular Oculus (Bull's-Eye) Windows ---
    panel_with_holes(FRONT, f"front_wing_attic_solid_{sign}",
                     w_min, w_max, LEVELS[4], MAIN_ROOF,
                     0, WALL_T, [], 4, .68, "sandstone")

    for i, bu in enumerate(bays):
        circular_window(FRONT, f"attic_oculus_{sign}_{i}", bu,
                        (LEVELS[4]+MAIN_ROOF)/2, .68, 0, 4, .70)

# Central Attic Story behind/above the Portico (X in [-PORTICO_W/2, PORTICO_W/2])
panel_with_holes(FRONT, "central_attic_wall",
                 -PORTICO_W/2, PORTICO_W/2, LEVELS[4], MAIN_ROOF,
                 0, WALL_T, [], 4, .68, "sandstone")
for cu in (-4.2, 0.0, 4.2):
    circular_window(FRONT, f"central_attic_oculus_{cu:+.1f}", cu,
                    (LEVELS[4]+MAIN_ROOF)/2, .68, 0, 4, .70)


# ---------------------------------------------------------------------------
# 5. Roofline, Parapets, Layered Modillion Cornice & Perimeter Balustrades
# ---------------------------------------------------------------------------

# Full-perimeter Layered Modillion Cornice at MAIN_ROOF (19.40 m)
for F, name, length in (
    (FRONT, "front", WIDTH),
    (RIGHT, "right", DEPTH),
    (LEFT, "left", DEPTH),
    (REAR, "rear", WIDTH),
):
    begin(f"{name}_main_cornice", "PARAPET", 5, .72)
    # 3 stepped cantilevered cornice moldings
    F.box("cornice_bed", length/2, -.10, MAIN_ROOF+.10,
          length+.20, .44, .18, "cream_trim")
    F.box("cornice_corona", length/2, -.18, MAIN_ROOF+.28,
          length+.40, .58, .20, "cream_trim")
    F.box("cornice_cymatium", length/2, -.26, MAIN_ROOF+.48,
          length+.56, .72, .22, "cream_trim")

# Perimeter Roof Balustrade atop the main cornice (z = MAIN_ROOF + .58 to MAIN_ROOF + 1.55)
for F, name, length in (
    (FRONT, "front", WIDTH),
    (RIGHT, "right", DEPTH),
    (LEFT, "left", DEPTH),
    (REAR, "rear", WIDTH),
):
    balustrade(F, f"{name}_roof_perimeter_balustrade",
               0.4, length-0.4, -.05, MAIN_ROOF+.58, 5, .66, height=0.96)
    # Pier pedestals at corners
    for corner in (0.4, length-0.4):
        begin(f"{name}_balustrade_pier_{corner:.1f}", "PARAPET", 5, .68)
        F.box("corner_pier", corner, -.05, MAIN_ROOF+1.08,
              .62, .48, 1.02, "cream_trim")
        cylinder("corner_urn", F.p(corner, -.05, MAIN_ROOF+1.85),
                 .20, .45, "bronze", 16)


# ---------------------------------------------------------------------------
# 6. Central Roof Pavilion & Octagonal Clock Cupola / Lantern
# ---------------------------------------------------------------------------

begin("raised_central_roof_platform", "ROOF", 6, .45)
# Raised rectangular base for the cupola at central roof (X in [-5.5, 5.5], Y in [4.5, 15.5])
box("central_cupola_platform", (0, 10.0, CENTRAL_ROOF-.14),
    (11.0, 11.0, .28), "roof")
band(FRONT, "cupola_platform_front_frieze",
     -5.5, 5.5, -4.5, CENTRAL_ROOF-.14, .75, 6, 8, .65, "cream_trim")

# Octagonal Cupola Construction (Center at x=0, y=10.0, z=CUPOLA_BASE to CUPOLA_TOP)
CUP_X, CUP_Y = 0.0, 10.0
CUP_R = 3.20  # Radius of octagonal drum
CUP_H = 3.60

begin("octagonal_cupola_drum", "WALL", 6, .75,
      "visible octagonal central clock lantern")
cylinder("cupola_base_plinth", (CUP_X, CUP_Y, CUPOLA_BASE+.25),
         CUP_R*1.12, .50, "rusticated", 8)
cylinder("cupola_drum_body", (CUP_X, CUP_Y, CUPOLA_BASE+CUP_H/2+.50),
         CUP_R, CUP_H, "sandstone", 8)

# 8 Arched Belfry Openings on each octagonal face
for k in range(8):
    theta = k * (math.pi / 4)
    fx = CUP_X + CUP_R * 0.96 * math.sin(theta)
    fy = CUP_Y - CUP_R * 0.96 * math.cos(theta)
    belfry_z = CUPOLA_BASE + 2.40

    begin(f"cupola_belfry_opening_{k}", "ARCH", 6, .72)
    # Dark recessed interior
    box(f"belfry_recess_{k}", (fx, fy, belfry_z),
        (.90, .40, 1.80), "dark", rotation=-theta)
    # Louvered belfry slats
    for s_idx in range(5):
        box(f"belfry_louver_{k}_{s_idx}",
            (fx, fy, belfry_z - 0.60 + s_idx * 0.28),
            (.82, .08, .06), "metal", rotation=-theta)

    # Cardinal clock dials on Front, Back, Left, Right
    if k in (0, 2, 4, 6):
        begin(f"cupola_clock_dial_{k}", "DECORATION", 6, .76)
        cylinder(f"clock_dial_face_{k}",
                 (fx*1.02, fy*1.02, CUPOLA_BASE + CUP_H - .35),
                 .55, .08, "cream_trim", 24)
        cylinder(f"clock_dial_rim_{k}",
                 (fx*1.03, fy*1.03, CUPOLA_BASE + CUP_H - .35),
                 .62, .05, "bronze", 24)

# Stepped Cornice and Copper Dome Cap
begin("cupola_copper_dome", "ROOF", 6, .76,
      "visible octagonal copper dome and spire")
cylinder("cupola_cornice", (CUP_X, CUP_Y, CUPOLA_BASE+CUP_H+.65),
         CUP_R*1.18, .30, "cream_trim", 8)
cylinder("cupola_dome_step_1", (CUP_X, CUP_Y, CUPOLA_BASE+CUP_H+.95),
         CUP_R*1.02, .30, "copper_roof", 8)
cylinder("cupola_dome_step_2", (CUP_X, CUP_Y, CUPOLA_BASE+CUP_H+1.35),
         CUP_R*0.82, .50, "copper_roof", 8)
cylinder("cupola_dome_step_3", (CUP_X, CUP_Y, CUPOLA_BASE+CUP_H+1.85),
         CUP_R*0.58, .50, "copper_roof", 8)
cylinder("cupola_dome_cap", (CUP_X, CUP_Y, CUPOLA_BASE+CUP_H+2.35),
         CUP_R*0.32, .50, "copper_roof", 8)

# Slender Bronze Spire Finial
rod("cupola_spire_finial",
    (CUP_X, CUP_Y, CUPOLA_BASE+CUP_H+2.60),
    (CUP_X, CUP_Y, CUPOLA_TOP+1.40), .035, "bronze")
cylinder("spire_orb", (CUP_X, CUP_Y, CUPOLA_TOP+.60),
         .18, .25, "bronze", 16)


# ---------------------------------------------------------------------------
# 7. Flanking Side Elevations (East and West Facades)
# ---------------------------------------------------------------------------

# 7 regular bays along Y in [2.0, DEPTH-2.0]: bay centres at Y = 3.6, 7.0, 10.5, 14.0, 17.5, 21.0, 24.4
side_bays = [3.6, 7.0, 10.5, 14.0, 17.5, 21.0, 24.4]

for F, name in ((RIGHT, "right"), (LEFT, "left")):
    for f in range(5):
        z0, z1 = LEVELS[f], LEVELS[f+1]
        holes = []
        for i, u in enumerate(side_bays):
            # Center bay at u = 14.0 is a secondary side entrance on Ground floor
            if f == 0 and i == 3:
                holes.append((u-1.30, u+1.30, z0, z0+2.80))
            elif f == 4:
                # Attic story oculus windows
                pass
            else:
                w_w = 2.00
                w_h = (z1 - z0) - 1.20
                holes.append((u-w_w/2, u+w_w/2, z0+.65, z0+.65+w_h))

        panel_with_holes(F, f"{name}_wall_{f}", 0, DEPTH, z0, z1,
                         0, WALL_T, holes, f, .36,
                         "rusticated" if f == 0 else "sandstone")

        for i, (a, b, c, d) in enumerate(holes):
            is_door = (f == 0 and i == 3)
            window(F, f"{name}_opening_{f}_{i}", (a+b)/2, (c+d)/2,
                   b-a, d-c, .035, f, .35, cols=2, rows=3 if not is_door else 2,
                   door=is_door)

        # Attic story oculus windows on side elevations
        if f == 4:
            for i, u in enumerate(side_bays):
                circular_window(F, f"{name}_attic_oculus_{i}", u,
                                (z0+z1)/2, .64, 0, 4, .38)

        # Floor horizontal beltcourse moulding
        begin(f"{name}_floor_edge_band_{f}", "BEAM", f, .32)
        F.box("floor_edge", DEPTH/2, -.04, z1-.14,
              DEPTH, .38, .28, "cream_trim")

    # Side Entrance Canopy and Steps at bay 3 (u = 14.0)
    begin(f"{name}_side_entrance_canopy", "SLAB", 0, .42)
    F.box("canopy_slab", 14.0, -.85, LEVELS[0]+2.95, 3.40, 1.70, .24, "cream_trim")
    for sign in (-1, 1):
        F.rod("canopy_support_rod",
              (14.0+sign*1.50, -.80, LEVELS[0]+2.95),
              (14.0+sign*1.50, .05, LEVELS[0]+4.10), .028, "metal")
    # 3 stone steps down
    for s in range(3):
        sz = BASE * (3 - s) / 3
        sy = -(s + 1) * .35
        F.box(f"side_step_{s}", 14.0, sy, sz/2,
              3.60 + s * .30, .36, sz, "granite_base")


# ---------------------------------------------------------------------------
# 8. Rear Elevation (North Facade, Facing +Y)
# ---------------------------------------------------------------------------

# 8 regular bays across width (38.0 m): centres at U = 3.5, 8.0, 12.5, 17.0, 21.0, 25.5, 30.0, 34.5
rear_bays = [3.5, 8.0, 12.5, 17.0, 21.0, 25.5, 30.0, 34.5]

for f in range(5):
    z0, z1 = LEVELS[f], LEVELS[f+1]
    holes = []
    for i, u in enumerate(rear_bays):
        # Delivery & service double doors at bay 3 & 4 on Ground floor
        if f == 0 and i in (3, 4):
            holes.append((u-1.25, u+1.25, z0, z0+2.85))
        elif f == 4:
            # Attic oculus windows
            pass
        else:
            w_w = 2.10
            w_h = (z1 - z0) - 1.15
            holes.append((u-w_w/2, u+w_w/2, z0+.60, z0+.60+w_h))

    panel_with_holes(REAR, f"rear_wall_{f}", 0, WIDTH, z0, z1,
                     0, WALL_T, holes, f, .28,
                     "rusticated" if f == 0 else "sandstone")

    for i, (a, b, c, d) in enumerate(holes):
        is_service_door = (f == 0 and i in (3, 4))
        window(REAR, f"rear_opening_{f}_{i}", (a+b)/2, (c+d)/2,
               b-a, d-c, .035, f, .28,
               cols=2, rows=3 if not is_service_door else 2,
               door=is_service_door)

    if f == 4:
        for i, u in enumerate(rear_bays):
            circular_window(REAR, f"rear_attic_oculus_{i}", u,
                            (z0+z1)/2, .64, 0, 4, .30)

    begin(f"rear_slab_edge_{f}", "BEAM", f, .26)
    REAR.box("rear_edge_band", WIDTH/2, -.04, z1-.14,
             WIDTH, .38, .28, "cream_trim")

# Rear Service Delivery Canopy
begin("rear_service_delivery_canopy", "SLAB", 0, .35)
REAR.box("loading_dock_canopy", 19.0, -1.25, LEVELS[0]+3.10,
         7.20, 2.50, .22, "metal")


# ---------------------------------------------------------------------------
# 9. Internal Symmetrical Grand Circulation Stairs (Twin Dogleg)
# ---------------------------------------------------------------------------

def build_internal_dogleg_stair(f, side):
    """
    Twin monumental dogleg stairs on East and West wings.
    Solid stone steps, sloping RC waist slabs, landings, and continuous handrails.
    """
    z0 = LEVELS[f]
    h_flight = (LEVELS[f+1] - z0)
    rise = h_flight / 22
    run = 0.29
    w = 1.80

    # West wing: x in [-15.5, -13.0], East wing: x in [13.0, 15.5]
    x_up = side * 13.5
    x_ret = side * 15.3
    y0 = 15.00

    begin(f"internal_grand_stair_{side}_{f}", "STAIR", f, .24,
          "inferred twin monumental circulation cores")

    # 11 steps for Up flight, 11 steps for Return flight
    for k in range(11):
        # First flight (Up to half-landing)
        zt = z0 + (k + 1) * rise
        box(f"up_step_{side}_{f}_{k}",
            (x_up, y0 + (k + .5) * run, zt - .08),
            (w, run + .02, .18), "granite_base")
        # Return flight (Half-landing to next floor)
        zt2 = z0 + h_flight/2 + (k + 1) * rise
        box(f"return_step_{side}_{f}_{k}",
            (x_ret, y0 + (10 - k + .5) * run, zt2 - .08),
            (w, run + .02, .18), "granite_base")

    # Sloping RC Waist Slabs via Prism Extrusions
    SF_up = Facade((x_up - w/2, 0), (0, 1), (1, 0))
    poly_up = [(y0, z0 - .10), (y0 + 11*run, z0 + h_flight/2 - .10),
               (y0 + 11*run, z0 + h_flight/2 - .30), (y0, z0 - .30)]
    SF_up.prism("up_flight_waist", poly_up, 0, w, "concrete")

    SF_ret = Facade((x_ret - w/2, 0), (0, 1), (1, 0))
    poly_ret = [(y0, z0 + h_flight - .10), (y0 + 11*run, z0 + h_flight/2 - .10),
                (y0 + 11*run, z0 + h_flight/2 - .30), (y0, z0 + h_flight - .30)]
    SF_ret.prism("return_flight_waist", poly_ret, 0, w, "concrete")

    # Intermediate Half-Landing & Floor Landing
    mid_x = (x_up + x_ret) / 2
    box("half_landing", (mid_x, y0 + 11*run + .80, z0 + h_flight/2 - .10),
        (abs(x_ret - x_up) + w, 1.60, .24), "concrete")
    box("floor_landing", (mid_x, y0 - .60, z0 - .10),
        (abs(x_ret - x_up) + w, 1.20, .24), "concrete")

    # Stair Handrails and Balusters
    begin(f"stair_handrails_{side}_{f}", "RAILING", f, .24)
    for xx, rev in ((x_up + .75*side, False), (x_ret - .75*side, True)):
        pts = []
        for k in (0, 5, 11):
            yy = y0 + k * run
            zz = z0 + (h_flight - k * rise if rev else k * rise)
            rod("stair_newel", (xx, yy, zz), (xx, yy, zz + .92), .022, "metal")
            pts.append((xx, yy, zz + .92))
        rod("sloping_handrail", pts[0], pts[-1], .028, "wood")


for f in range(5):
    for side in (-1, 1):
        build_internal_dogleg_stair(f, side)


# ---------------------------------------------------------------------------
# 10. Exterior Services, Utilities & Rooftop Plant
# ---------------------------------------------------------------------------

# Rainwater Downpipes: 2 on Front, 2 on Right, 2 on Left, 2 on Rear
def downpipe(F, u, name, height, conf=.32):
    begin(name, "PIPE", -1, conf,
          "front pipe routing visible" if conf >= .6 else "inferred drainage")
    F.rod("vertical_pipe", (u, -.20, .20), (u, -.20, height-.20), .054, "pipe")
    F.rod("roof_hopper_outlet", (u, -.20, height-.20), (u, .22, height-.20), .054, "pipe")
    F.rod("bottom_discharge_shoe", (u, -.20, .24), (u, -.52, .12), .054, "pipe")
    for z in np.arange(1.2, height, 2.4):
        F.box("pipe_wall_bracket", u, -.10, z, .18, .22, .05, "metal")

    begin(name+"_ground_drain_box", "OTHER", -1, conf)
    F.box("cast_iron_drain_box", u, -.50, .025, .44, .44, .05, "metal")
    for du in np.linspace(-.15, .15, 7):
        F.box("grille_slot", u+du, -.50, .055, .02, .34, .012, "dark")


for u in (-PORTICO_W/2 - .80, PORTICO_W/2 + .80):
    downpipe(FRONT, u, f"front_downpipe_{u:+.1f}", MAIN_ROOF+.15, .68)
for F, nm in ((RIGHT, "right"), (LEFT, "left")):
    for u in (4.5, 23.5):
        downpipe(F, u, f"{nm}_downpipe_{u:.1f}", MAIN_ROOF+.15, .32)
for u in (5.0, 33.0):
    downpipe(REAR, u, f"rear_downpipe_{u:.1f}", MAIN_ROOF+.15, .30)


# Rooftop HVAC Chiller Plant Enclosure (on rear half of main roof)
begin("rooftop_chiller_equipment", "AC_UNIT", 6, .35,
      "functional rooftop service equipment")
# Acoustic Louvered Protective Enclosure (X in [-7.0, 7.0], Y in [18.0, 23.5])
CH_X0, CH_X1 = -7.0, 7.0
CH_Y0, CH_Y1 = 18.0, 23.5
CH_Z = MAIN_ROOF + .58
box("chiller_plinth", (0, (CH_Y0+CH_Y1)/2, CH_Z+.10),
    (CH_X1-CH_X0, CH_Y1-CH_Y0, .20), "concrete")

# Acoustic louvered screen walls
for xx in (CH_X0, CH_X1):
    box("screen_side", (xx, (CH_Y0+CH_Y1)/2, CH_Z+1.20),
        (.15, CH_Y1-CH_Y0, 2.0), "frame")
for yy in (CH_Y0, CH_Y1):
    box("screen_cross", (0, yy, CH_Z+1.20),
        (CH_X1-CH_X0, .15, 2.0), "frame")

# Twin Chiller Units inside the enclosure
for cx in (-3.5, 3.5):
    box("chiller_compressor_housing", (cx, 20.7, CH_Z+1.0),
        (3.4, 2.6, 1.4), "ac")
    # Twin rooftop condenser fan discs
    for fx in (cx-0.8, cx+0.8):
        cylinder("fan_housing", (fx, 20.7, CH_Z+1.75), .55, .15, "metal", 24)
        for t in np.linspace(0, 2*math.pi, 9):
            rod("fan_guard_wire",
                (fx + .52*math.cos(t), 20.7 + .52*math.sin(t), CH_Z+1.84),
                (fx, 20.7, CH_Z+1.84), .008, "metal")


# Wall-mounted Split AC Units on Secondary Elevations (Side and Rear)
def wall_ac_unit(F, u, z, floor, name):
    begin(name, "AC_UNIT", floor, .28)
    F.box("chassis", u, -.38, z, .92, .48, .64, "ac")
    F.box("front_fan_recess", u, -.63, z, .78, .02, .50, "dark")
    # Concentric fan wire guards
    for r in (.12, .22):
        pp = [(u+r*math.cos(t), -.65, z+r*math.sin(t))
              for t in np.linspace(0, 2*math.pi, 9)]
        for a, b in zip(pp[:-1], pp[1:]):
            F.rod("fan_guard_ring", a, b, .007, "metal")
    for t in (0, math.pi/2):
        du, dz = .24*math.cos(t), .24*math.sin(t)
        F.rod("fan_guard_spoke", (u-du, -.655, z-dz),
              (u+du, -.655, z+dz), .007, "metal")
    # Mounting brackets and condensate pipe
    for du in (-.32, .32):
        F.box("bracket", u+du, -.26, z-.38, .05, .64, .06, "metal")
        F.rod("strut", (u+du, -.05, z-.64), (u+du, -.50, z-.38), .02)
    F.rod("condensate_drain", (u+.44, -.12, z), (u+.44, -.12, z-1.1), .014, "pipe")


for F, nm, units in (
    (RIGHT, "right", [(8.5, 2), (19.5, 3)]),
    (LEFT, "left", [(9.0, 2), (20.0, 3)]),
    (REAR, "rear", [(8.0, 1), (21.0, 2), (30.0, 3)]),
):
    for i, (u, f) in enumerate(units):
        wall_ac_unit(F, u, LEVELS[f]+.60, f, f"{nm}_split_ac_{i}")

# Lightning Protection System (Air Terminals at Roof Corners and Cupola)
begin("lightning_protection_system", "PIPE", 6, .35)
for x in (-WIDTH/2+.6, WIDTH/2-.6):
    for y in (.6, DEPTH-.6):
        rod("roof_air_terminal", (x, y, MAIN_ROOF+1.55),
            (x, y, MAIN_ROOF+2.75), .014, "bronze")
        rod("conductor_cable", (x, y, MAIN_ROOF+1.55),
            (x, y, 0.0), .008, "bronze")


# ---------------------------------------------------------------------------
# 11. Restrained Procedural Weathering Geometry
# ---------------------------------------------------------------------------

begin("front_weathering_streaks", "DECORATION", 2, .55,
      "approximate visible environmental rain runoff staining")
# Vertical mildew runoff streaks below ledges and window sills
for x, top_z, l in [
    (-14.2, LEVELS[2]+.10, 1.2),
    (13.8, LEVELS[2]+.10, 1.3),
    (-8.5, LEVELS[1]+.10, 1.1),
    (8.2, LEVELS[1]+.10, 1.1),
    (-16.0, MAIN_ROOF+.10, 1.5),
    (16.0, MAIN_ROOF+.10, 1.4),
]:
    for j in range(3):
        FRONT.box("mildew_drip_streak",
                  x + (j-1)*.08, -.012, top_z - l/2,
                  .022, .008, l * (0.8 + 0.1*j), "grime")

# Hairline plaster cracks
for x, z in [(-11.5, 7.8), (11.2, 11.5), (-15.2, 14.2)]:
    pts = [(x, -.016, z),
           (x+.06, -.017, z-.22),
           (x+.02, -.016, z-.44),
           (x+.09, -.017, z-.68)]
    for a, b in zip(pts[:-1], pts[1:]):
        rod("hairline_plaster_crack", a, b, .0035, "grime", 6)

# Damp moss/lichen patches along plinth base
begin("plinth_damp_edge_weathering", "GROUND", -1, .40)
for side in (-1, 1):
    box("damp_plinth_moss", (side*17.5, 14.0, .01),
        (.30, 22.0, .02), "moss")
for x in (-12.0, 12.0):
    box("forecourt_paving_crack", (x, -2.5, .005),
        (.04, 3.2, .01), "grime")

print("[5/6] Stairs, services, utilities & weathering built.", flush=True)
print("[6/6] Surface sampling into semantic point cloud...", flush=True)


# ---------------------------------------------------------------------------
# 12. Surface Sampling into Semantic Point Cloud
# ---------------------------------------------------------------------------

# Higher sampling density for articulated features than broad planar walls
DENSITY_MULT = {
    "WINDOW": 2.6,
    "DOOR": 2.5,
    "COLUMN": 2.0,
    "DECORATION": 2.8,
    "RAILING": 3.4,
    "PIPE": 2.8,
    "AC_UNIT": 3.0,
    "ARCH": 2.2,
    "BALCONY": 1.6,
    "STAIR": 1.6,
    "ROOF": .85,
    "GROUND": .55,
}

bpy.context.view_layer.update()


def triangles_world(obj):
    mesh = obj.data
    mesh.calc_loop_triangles()
    vertices = np.empty((len(mesh.vertices), 3), np.float32)
    mesh.vertices.foreach_get("co", vertices.ravel())
    matrix = np.array(obj.matrix_world, dtype=np.float64)
    vertices = vertices @ matrix[:3, :3].T + matrix[:3, 3]

    idx = np.empty(len(mesh.loop_triangles)*3, np.int32)
    mesh.loop_triangles.foreach_get("vertices", idx)
    tris = vertices[idx.reshape(-1, 3)]
    cross = np.cross(tris[:, 1]-tris[:, 0], tris[:, 2]-tris[:, 0])
    norm = np.linalg.norm(cross, axis=1)
    good = norm > 1e-12
    normals = cross[good]/norm[good, None]
    return tris[good], normals, norm[good]*.5


sampling_records = []
weighted_total = 0.0
triangle_total = 0
for obj in SOURCE_OBJECTS:
    tris, normals, areas = triangles_world(obj)
    e = ELEMENTS[obj["object_id"]]
    multiplier = DENSITY_MULT.get(e["class"], 1.0)
    density = multiplier / max(ARGS.spacing, .015)**2
    weighted_total += float(areas.sum())*density
    triangle_total += len(areas)
    sampling_records.append((obj, tris, normals, areas, density))

available = max(0, ARGS.max_points - triangle_total)
density_scale = min(1.0, available / max(weighted_total, 1))
effective_spacing = ARGS.spacing / math.sqrt(max(density_scale, 1e-8))

print("Source objects:", len(SOURCE_OBJECTS), flush=True)
print("Logical elements:", len(ELEMENTS), flush=True)
print("Estimated density scale:", density_scale, flush=True)


def weather_colors(xyz, normals, mat_key, floor):
    """Deterministic spatial weathering baked into point RGB."""
    base = np.array(PALETTE[mat_key], np.float32)
    n = len(xyz)
    rgb = np.broadcast_to(base, (n, 3)).copy()
    x, y, z = xyz.T

    if mat_key in {"glass", "dark"}:
        variation = .94 + .065*np.sin(x*1.7 + y*.4 + z*.65)
        rgb *= variation[:, None]
        return np.clip(rgb, 0, 1)

    if mat_key in {"metal", "frame", "pipe", "ac", "bronze"}:
        variation = .92 + .050*np.sin(x*4.2 + y*3.1 + z*2.4)
        rgb *= variation[:, None]
        return np.clip(rgb, 0, 1)

    broad = (
        .035*np.sin(x*.55 + y*.35 + z*.18)
        + .025*np.sin(x*1.65 - y*.45 + z*.60)
        + .018*np.sin(x*6.8 + y*5.2 + z*2.8)
    )
    micro = RNG.normal(0, .012, n).astype(np.float32)
    variation = .96 + broad + micro

    # Drip streaks under ledges
    streak = np.maximum(
        0, np.sin(x*4.8 + y*3.9) + .40*np.sin(x*12.5 - y*7.8) - .78)
    streak = np.minimum(streak, 1.0)

    ledge_stain = np.zeros(n, np.float32)
    for ledge in LEVELS[1:] + [MAIN_ROOF+.58, CENTRAL_ROOF+.90, CUPOLA_TOP]:
        dz = ledge - z
        ledge_stain = np.maximum(
            ledge_stain,
            np.where((dz > 0) & (dz < 1.7),
                     np.exp(-np.maximum(dz, 0)/.48), 0).astype(np.float32))

    vertical = np.clip(1 - np.abs(normals[:, 2]), 0, 1)
    variation -= .28 * streak * ledge_stain * vertical

    # Underside dirt and upward-facing dust
    variation -= .075 * np.maximum(-normals[:, 2], 0)
    variation -= .035 * np.maximum(normals[:, 2], 0)

    # Rising damp near ground level
    near_ground = np.exp(-np.maximum(z, 0)/.40)
    variation -= .12 * near_ground
    rgb *= np.clip(variation, .45, 1.1)[:, None]

    # Greenish damp tint near base
    damp = np.clip(near_ground*.20 + streak*ledge_stain*.06, 0, .22)
    rgb[:, 0] *= 1 - damp
    rgb[:, 2] *= 1 - damp*.75
    return np.clip(rgb, 0, 1)


def point_material():
    mat = bpy.data.materials.new("POINTS_BAKED_RGB")
    mat.use_nodes = True
    nt = mat.node_tree
    p = nt.nodes.get("Principled BSDF")
    p.inputs["Roughness"].default_value = .82
    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = "rgb"
    nt.links.new(attr.outputs["Color"], p.inputs["Base Color"])
    return mat


PC_MAT = point_material()


def point_node_group():
    ng = bpy.data.node_groups.new("SEMANTIC_POINT_DISPLAY", "GeometryNodeTree")
    ng.interface.new_socket(
        name="Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
    ng.interface.new_socket(
        name="Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")

    inp = ng.nodes.new("NodeGroupInput")
    out = ng.nodes.new("NodeGroupOutput")
    convert = ng.nodes.new("GeometryNodeMeshToPoints")
    convert.mode = "VERTICES"

    radius = ng.nodes.new("GeometryNodeInputNamedAttribute")
    radius.data_type = "FLOAT"
    radius.inputs["Name"].default_value = "radius"

    sm = ng.nodes.new("GeometryNodeSetMaterial")
    sm.inputs["Material"].default_value = PC_MAT

    ng.links.new(inp.outputs["Geometry"], convert.inputs["Mesh"])
    ng.links.new(radius.outputs["Attribute"], convert.inputs["Radius"])
    ng.links.new(convert.outputs["Points"], sm.inputs["Geometry"])
    ng.links.new(sm.outputs["Geometry"], out.inputs["Geometry"])

    inp.location = (-420, 80)
    radius.location = (-420, -110)
    convert.location = (-170, 80)
    sm.location = (55, 80)
    out.location = (280, 80)
    return ng


PC_NODES = point_node_group()
POINT_OBJECTS = []
PLY_CHUNKS = []


def attribute(mesh, name, kind, data):
    attr = mesh.attributes.new(name=name, type=kind, domain="POINT")
    field = "vector" if kind == "FLOAT_VECTOR" else (
        "color" if kind == "FLOAT_COLOR" else "value")
    attr.data.foreach_set(field, np.asarray(data).ravel())
    return attr


def linear_to_srgb(c):
    return np.where(c <= .0031308, c*12.92,
                    1.055*np.power(np.maximum(c, 0), 1/2.4)-.055)


def make_cloud(e, chunks):
    xyz = np.concatenate([c[0] for c in chunks]).astype(np.float32)
    normal = np.concatenate([c[1] for c in chunks]).astype(np.float32)
    rgb = np.concatenate([c[2] for c in chunks]).astype(np.float32)
    matids = np.concatenate([c[3] for c in chunks]).astype(np.int32)
    radii = np.concatenate([c[4] for c in chunks]).astype(np.float32)
    n = len(xyz)

    mesh = bpy.data.meshes.new(f'PC_{e["object_id"]:05d}_data')
    mesh.vertices.add(n)
    mesh.vertices.foreach_set("co", xyz.ravel())
    mesh.update()

    rgba = np.ones((n, 4), np.float32)
    rgba[:, :3] = rgb
    ca = mesh.color_attributes.new(
        name="rgb", type="FLOAT_COLOR", domain="POINT")
    ca.data.foreach_set("color", rgba.ravel())

    attribute(mesh, "surface_normal", "FLOAT_VECTOR", normal)
    attribute(mesh, "intensity", "FLOAT",
              rgb @ np.array([.2126, .7152, .0722], np.float32))
    for name, value in (
        ("classification", e["classification"]),
        ("element_type", e["classification"]),
        ("object_id", e["object_id"]),
        ("floor_id", e["floor_id"]),
    ):
        attribute(mesh, name, "INT", np.full(n, value, np.int32))
    attribute(mesh, "material_id", "INT", matids)
    attribute(mesh, "confidence", "FLOAT",
              np.full(n, e["confidence"], np.float32))
    attribute(mesh, "radius", "FLOAT", radii)
    attribute(mesh, "observed_layout", "BOOLEAN",
              np.full(n, e["confidence"] >= .60, dtype=bool))

    obj = bpy.data.objects.new(f'PC_{e["object_id"]:05d}_{e["name"]}', mesh)
    semantic_collection(PTS, e["floor_id"], e["class"]).objects.link(obj)
    obj["object_id"] = e["object_id"]
    obj["classification"] = e["classification"]
    obj["floor_id"] = e["floor_id"]
    obj["confidence"] = e["confidence"]
    obj["evidence"] = e["evidence"]
    obj["point_count"] = n
    obj["representation"] = "Editable vertex-only semantic point cloud"
    mod = obj.modifiers.new("Native point display", "NODES")
    mod.node_group = PC_NODES
    POINT_OBJECTS.append(obj)
    e["point_count"] = n

    if not ARGS.no_ply:
        dtype = np.dtype([
            ("x", "<f4"), ("y", "<f4"), ("z", "<f4"),
            ("red", "u1"), ("green", "u1"), ("blue", "u1"),
            ("nx", "<f4"), ("ny", "<f4"), ("nz", "<f4"),
            ("intensity", "<f4"),
            ("classification", "<i4"),
            ("object_id", "<i4"),
            ("floor_id", "<i4"),
            ("element_type", "<i4"),
            ("material_id", "<i4"),
            ("confidence", "<f4"),
        ])
        arr = np.empty(n, dtype=dtype)
        for j, key in enumerate(("x", "y", "z")):
            arr[key] = xyz[:, j]
        srgb = np.clip(linear_to_srgb(rgb)*255+.5, 0, 255).astype(np.uint8)
        for j, key in enumerate(("red", "green", "blue")):
            arr[key] = srgb[:, j]
        for j, key in enumerate(("nx", "ny", "nz")):
            arr[key] = normal[:, j]
        arr["intensity"] = rgb @ np.array([.2126, .7152, .0722])
        arr["classification"] = e["classification"]
        arr["object_id"] = e["object_id"]
        arr["floor_id"] = e["floor_id"]
        arr["element_type"] = e["classification"]
        arr["material_id"] = matids
        arr["confidence"] = e["confidence"]
        PLY_CHUNKS.append(arr)


# Collect contiguous surface samples by logical architectural element
element_samples = defaultdict(list)
for obj, tris, normals, areas, density in sampling_records:
    eid = obj["object_id"]
    e = ELEMENTS[eid]
    expected = areas*density*density_scale
    counts = np.floor(expected).astype(np.int64)
    counts += (RNG.random(len(counts)) < expected-counts)
    counts = np.maximum(counts, 1)

    tri_ids = np.repeat(np.arange(len(tris)), counts)
    n = len(tri_ids)
    r = RNG.random((n, 2))
    s = np.sqrt(r[:, 0])
    w0 = 1-s
    w1 = s*(1-r[:, 1])
    w2 = s*r[:, 1]
    chosen = tris[tri_ids]
    xyz = (chosen[:, 0]*w0[:, None] +
           chosen[:, 1]*w1[:, None] +
           chosen[:, 2]*w2[:, None]).astype(np.float32)
    norm = normals[tri_ids].astype(np.float32)

    # Edge/corner anchors for detailed semantic classes
    edge_xyz = tris.reshape(-1, 3).astype(np.float32)
    edge_norm = np.repeat(normals, 3, axis=0).astype(np.float32)
    if e["class"] in {"WINDOW", "DOOR", "ARCH", "DECORATION",
                      "RAILING", "PIPE", "AC_UNIT"}:
        xyz = np.concatenate((xyz, edge_xyz))
        norm = np.concatenate((norm, edge_norm))

    rgb = weather_colors(xyz, norm, obj["material_key"], e["floor_id"])
    n = len(xyz)
    local_spacing = 1/math.sqrt(max(density*density_scale, 1e-6))
    radius = min(.065, max(.009, local_spacing*.61))
    if e["class"] in {"RAILING", "PIPE", "AC_UNIT"}:
        radius = min(radius, .023)

    element_samples[eid].append((
        xyz, norm, rgb,
        np.full(n, obj["material_id"], np.int32),
        np.full(n, radius, np.float32)
    ))

sampling_records.clear()

for eid, chunks in element_samples.items():
    make_cloud(ELEMENTS[eid], chunks)
element_samples.clear()

TOTAL_POINTS = sum(o["point_count"] for o in POINT_OBJECTS)
ROOT["point_count"] = TOTAL_POINTS
ROOT["point_sampling"] = "Deterministic area-weighted triangle surface sampling"
ROOT["rgb_encoding_blender"] = "Linear RGB"
ROOT["rgb_encoding_ply"] = "8-bit sRGB"
ROOT["geometry_accuracy"] = "Uncalibrated single-image estimate"

print("Generated points:", f"{TOTAL_POINTS:,}")


# ---------------------------------------------------------------------------
# 13. PLY Export and Semantic Manifest
# ---------------------------------------------------------------------------

if not ARGS.no_ply:
    path = os.path.join(OUT, "building_semantic.ply")
    header = f"""ply
format binary_little_endian 1.0
comment Photograph-informed reconstruction: The Chancellor's Academic & Research Hall
comment Units metres; front -Y; RGB sRGB
comment See building_manifest.json for labels and uncertainty
element vertex {TOTAL_POINTS}
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
property float nx
property float ny
property float nz
property float intensity
property int classification
property int object_id
property int floor_id
property int element_type
property int material_id
property float confidence
end_header
"""
    with open(path, "wb") as f:
        f.write(header.encode("ascii"))
        for chunk in PLY_CHUNKS:
            chunk.tofile(f)
    PLY_CHUNKS.clear()

manifest = {
    "title": "Photograph-informed academic institutional building reconstruction",
    "building_title": "The Chancellor's Academic & Research Hall",
    "units": "metres",
    "coordinate_system": {"front": "-Y", "up": "+Z"},
    "reference_count": 1,
    "survey_verified": False,
    "estimated_dimensions": {
        "width": WIDTH,
        "depth": DEPTH,
        "plinth_elevation": BASE,
        "main_roof_elevation": MAIN_ROOF,
        "central_roof_elevation": CENTRAL_ROOF,
        "cupola_top_elevation": CUPOLA_TOP,
    },
    "floor_interpretation": "Ground plus four upper levels, attic, and central cupola",
    "floor_elevations": LEVELS,
    "classes": CLASS_ID,
    "floors": FLOOR_NAMES,
    "materials": MATERIAL_ID,
    "point_count": TOTAL_POINTS,
    "requested_spacing_m": ARGS.spacing,
    "effective_base_spacing_m": effective_spacing,
    "confidence_note": (
        "Heuristic evidence confidence only; not a statistical measurement accuracy. "
        "Photograph-informed reconstruction."
    ),
    "major_assumptions": [
        "Approximately 38 m wide and 28 m deep.",
        "Imposing Beaux-Arts institutional massing with hexastyle giant-order portico.",
        "Five occupied storeys plus attic story and central octagonal cupola.",
        "Monumental central entrance portal treated as a double-leaf arched opening with fanlight.",
        "Piano Nobile features paired arched French windows with balustraded Juliette balconies.",
        "Stepped attic story features circular oculus (bull's-eye) windows.",
        "Twin symmetrical grand dogleg staircases on East and West wings.",
        "Interior central rotunda lightwell passing through Floors 1 to 3.",
        "Rear facade utilizes regular functional laboratory/lecture bays with loading dock.",
        "Rooftop HVAC chiller plant enclosed in acoustic louvered screens.",
    ],
    "limitations": [
        "Not a laser scan or photogrammetric solve.",
        "Rear, roof and interior layout inferred from institutional typology.",
        "Tall multi-level portico and colonnades assigned to primary floor IDs.",
        "Weathering is procedural approximation, not photographic texture bake.",
    ],
    "elements": [
        {k: v for k, v in e.items() if k != "parts"}
        for e in ELEMENTS.values()
    ],
}
with open(os.path.join(OUT, "building_manifest.json"), "w", encoding="utf8") as f:
    json.dump(manifest, f, indent=2)


# ---------------------------------------------------------------------------
# 14. Presentation: Cameras, Daylight Lighting and Embedded Scripts
# ---------------------------------------------------------------------------

def camera(name, position, target, lens=40):
    data = bpy.data.cameras.new(name)
    data.lens = lens
    data.clip_start = .08
    data.clip_end = 600
    obj = bpy.data.objects.new(name, data)
    PRESENTATION.objects.link(obj)
    obj.location = position
    obj.rotation_euler = (
        Vector(target)-Vector(position)).to_track_quat("-Z", "Y").to_euler()
    return obj


cam_overview = camera("CAM_front_right_overview",
                      (45, -55, 32), (0, 10, 11.5), 44)
camera("CAM_reference_like_low_front",
       (0, -32, 2.2), (0, 0, 12.0), 24)
camera("CAM_front_left", (-45, -50, 24), (0, 10, 11.5), 44)
camera("CAM_rear", (0, 72, 18), (0, 18, 12.0), 44)
camera("CAM_rear_left", (-42, 60, 28), (0, 14, 12.0), 42)
camera("CAM_roof_cupola", (38, -12, 52), (0, 10, 21.0), 48)
camera("CAM_entrance_portico", (0, -11, 2.4), (0, -2.5, 5.2), 26)
scene.camera = cam_overview

world = bpy.data.worlds.new("soft_daylight_world")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (
    .65, .73, .84, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = .58
scene.world = world

sun_data = bpy.data.lights.new("warm_soft_sun", "SUN")
sun_data.energy = 2.4
sun_data.angle = math.radians(10)
sun = bpy.data.objects.new("warm_soft_sun", sun_data)
PRESENTATION.objects.link(sun)
sun.rotation_euler = (math.radians(30), math.radians(-26), math.radians(-32))

area_data = bpy.data.lights.new("sky_fill", "AREA")
area_data.energy = 2600
area_data.shape = "DISK"
area_data.size = 26
area = bpy.data.objects.new("sky_fill", area_data)
PRESENTATION.objects.link(area)
area.location = (0, -18, 28)
area.rotation_euler = (
    Vector((0, 6, 12))-area.location).to_track_quat("-Z", "Y").to_euler()

scene.render.engine = "CYCLES"
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.resolution_x = 1600
scene.render.resolution_y = 1300
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = os.path.join(OUT, "point_cloud_preview.png")
scene.view_settings.view_transform = "AgX"

# Primary saved representation: Points visible, source surfaces hidden
SRC.hide_render = True
SRC.hide_viewport = True
PTS.hide_render = False
PTS.hide_viewport = False

readme = bpy.data.texts.new("README_RECONSTRUCTION.txt")
readme.write(f"""
THE CHANCELLOR'S ACADEMIC & RESEARCH HALL
=========================================
Photograph-informed institutional building reconstruction.

MODEL SPECIFICATION
-------------------
Approximate width: {WIDTH:.2f} m
Approximate depth: {DEPTH:.2f} m
Ground plinth elevation: {BASE:.2f} m
Main roof elevation: {MAIN_ROOF:.2f} m
Cupola top elevation: {CUPOLA_TOP:.2f} m
Floors: Ground plus four upper levels, attic, and central cupola.
Principal facade faces -Y.

REPRESENTATIONS
---------------
BUILDING / SEMANTIC_POINTS
    Primary saved representation.
    Vertex-only meshes with native Geometry Nodes point cloud rendering.
    Underlying XYZ coordinates and point attributes remain editable.

BUILDING / SOURCE_SURFACES
    Hidden source architecture (retained for solid mesh editing).
    Thick walls, non-overlapping window openings, columns, pediments,
    slabs, grand stairs, cupola, and HVAC plant.

POINT ATTRIBUTES
----------------
rgb                Linear RGBA with procedural weathering
surface_normal     XYZ surface normal vector
intensity          Linear luminance
classification     Integer semantic class (0..17)
element_type       Class code
object_id          Unique logical architectural element identifier
floor_id           Primary floor identifier (-1..6)
material_id        Material palette identifier
confidence         Heuristic evidence confidence
observed_layout    Layout flag
radius             Point display radius in metres

POINT COUNT
-----------
{TOTAL_POINTS:,}
""")

helper = bpy.data.texts.new("EDITING_HELPERS.py")
helper.write('''
import bpy

def show_representation(points=True):
    bpy.data.collections["SEMANTIC_POINTS"].hide_viewport = not points
    bpy.data.collections["SEMANTIC_POINTS"].hide_render = not points
    bpy.data.collections["SOURCE_SURFACES"].hide_viewport = points
    bpy.data.collections["SOURCE_SURFACES"].hide_render = points

def select_element(object_id, points=True):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.context.scene.objects:
        if obj.get("object_id") == object_id:
            if points != obj.name.startswith("PC_"):
                continue
            if obj.visible_get():
                obj.select_set(True)
                bpy.context.view_layer.objects.active = obj

def isolate_point_floor(floor_id=None):
    root = bpy.data.collections["SEMANTIC_POINTS"]
    for floor in root.children:
        visible = floor_id is None or floor.get("floor_id") == floor_id
        floor.hide_viewport = not visible
        floor.hide_render = not visible

def isolate_point_class(class_name=None):
    root = bpy.data.collections["SEMANTIC_POINTS"]
    for floor in root.children:
        for cls in floor.children:
            visible = class_name is None or cls.name.split(".")[0] == class_name
            cls.hide_viewport = not visible
            cls.hide_render = not visible
''')

# Initial 3D viewport setup
for screen in bpy.data.screens:
    for ar in screen.areas:
        if ar.type == "VIEW_3D":
            ar.spaces.active.clip_end = 600
            ar.spaces.active.shading.type = "MATERIAL"
            ar.spaces.active.region_3d.view_distance = 55
            ar.spaces.active.region_3d.view_location = Vector((0, 10, 11.5))

bpy.ops.object.select_all(action="DESELECT")
blend_path = os.path.join(OUT, "institutional_reconstruction.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

glb_path = os.path.join(OUT, "institutional_reconstruction.glb")
try:
    SRC.hide_render = False
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', use_selection=False)
    SRC.hide_render = True
    print("GLB:", glb_path, flush=True)
except Exception as e:
    print("GLB export skipped:", e, flush=True)

if ARGS.render:
    print("Rendering presentation camera view...", flush=True)
    bpy.ops.render.render(write_still=True)
    print("Render preview:", scene.render.filepath, flush=True)

print("\nReconstruction Completed Successfully.", flush=True)
print("BLEND:", blend_path, flush=True)
print("Manifest:", os.path.join(OUT, "building_manifest.json"), flush=True)
if not ARGS.no_ply:
    print("PLY:", os.path.join(OUT, "building_semantic.ply"), flush=True)
print("Semantic point count:", f"{TOTAL_POINTS:,}", flush=True)
