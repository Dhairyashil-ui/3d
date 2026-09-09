"""
Photograph-informed institutional building reconstruction.
Blender 4.2+; no external assets or Python packages required beyond Blender's NumPy.

Coordinate system:
    X: front elevation, left to right
    Y: front to rear
    Z: elevation in metres
    Photographed principal facade faces -Y.

IMPORTANT:
    This is a single-image architectural reconstruction, not a measured survey.
    Hidden geometry and absolute dimensions are explicitly inferred.

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


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
parser = argparse.ArgumentParser()
parser.add_argument("--out", default="//reconstruction")
parser.add_argument("--spacing", type=float, default=0.065)
parser.add_argument("--max-points", type=int, default=3_000_000)
parser.add_argument("--no-ply", action="store_true")
parser.add_argument("--render", action="store_true")
ARGS = parser.parse_args(argv)

OUT = bpy.path.abspath(ARGS.out)
os.makedirs(OUT, exist_ok=True)

SEED = 24871
RNG = np.random.default_rng(SEED)

WIDTH = 30.0
DEPTH = 24.0
H = 3.60
BASE = 0.60
LEVELS = [BASE + i * H for i in range(7)]
WING_ROOF = LEVELS[6]
CENTRAL_ROOF = WING_ROOF + 0.85
WALL_T = 0.30
SLAB_T = 0.24

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
    "plaster": (0.61, 0.51, 0.39),
    "peach": (0.57, 0.385, 0.285),
    "cream_trim": (0.66, 0.56, 0.43),
    "concrete": (0.37, 0.34, 0.28),
    "roof": (0.33, 0.32, 0.285),
    "metal": (0.31, 0.335, 0.32),
    "frame": (0.56, 0.59, 0.55),
    "glass": (0.075, 0.12, 0.13),
    "dark": (0.033, 0.039, 0.036),
    "motif": (0.33, 0.235, 0.155),
    "step": (0.38, 0.275, 0.215),
    "pipe": (0.54, 0.565, 0.48),
    "ac": (0.54, 0.535, 0.46),
    "grime": (0.075, 0.073, 0.045),
    "moss": (0.115, 0.135, 0.067),
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


def collection(name, parent=None):
    c = bpy.data.collections.new(name)
    (parent.children if parent else scene.collection.children).link(c)
    return c


ROOT = collection("BUILDING")
SRC = collection("SOURCE_SURFACES", ROOT)
PTS = collection("SEMANTIC_POINTS", ROOT)
PRESENTATION = collection("PRESENTATION")

ROOT["reference"] = "Single user-supplied photograph"
ROOT["status"] = "Photograph-informed reconstruction; not survey-verified"
ROOT["front_direction"] = "-Y"
ROOT["estimated_width_m"] = WIDTH
ROOT["estimated_depth_m"] = DEPTH
ROOT["estimated_floor_to_floor_m"] = H
ROOT["floor_interpretation"] = "Ground plus five upper levels; inferred"
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


# Create a stable semantic hierarchy, including empty semantic categories.
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
# Materials
# ---------------------------------------------------------------------------

def make_material(key, color):
    mat = bpy.data.materials.new(key)
    mat.use_nodes = True
    nt = mat.node_tree
    p = nt.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = 0.84

    if key == "glass":
        p.inputs["Roughness"].default_value = 0.29
        p.inputs["Metallic"].default_value = 0.10
        p.inputs["Transmission Weight"].default_value = 0.16
        p.inputs["IOR"].default_value = 1.46
    elif key in {"metal", "frame", "pipe"}:
        p.inputs["Metallic"].default_value = 0.45
        p.inputs["Roughness"].default_value = 0.54
    else:
        tex = nt.nodes.new("ShaderNodeTexCoord")
        noise = nt.nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 2.0
        noise.inputs["Detail"].default_value = 5.0
        noise.inputs["Roughness"].default_value = 0.72
        nt.links.new(tex.outputs["Object"], noise.inputs["Vector"])

        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].position = 0.18
        ramp.color_ramp.elements[0].color = (
            color[0] * .63, color[1] * .64, color[2] * .62, 1)
        ramp.color_ramp.elements[1].position = 0.83
        ramp.color_ramp.elements[1].color = (
            min(color[0] * 1.08, 1),
            min(color[1] * 1.07, 1),
            min(color[2] * 1.06, 1), 1)
        nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])

        micro = nt.nodes.new("ShaderNodeTexNoise")
        micro.inputs["Scale"].default_value = 140.0
        micro.inputs["Detail"].default_value = 2.0
        nt.links.new(tex.outputs["Object"], micro.inputs["Vector"])
        bump = nt.nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = 0.20
        bump.inputs["Distance"].default_value = 0.012
        nt.links.new(micro.outputs["Fac"], bump.inputs["Height"])
        nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])

    return mat


for key, color in PALETTE.items():
    MATERIALS[key] = make_material(key, color)


# ---------------------------------------------------------------------------
# Primitive construction
# ---------------------------------------------------------------------------

def box(name, center, size, mat="plaster", rotation=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    obj.rotation_euler.z = rotation
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return register(obj, mat)


def cylinder(name, center, radius, height, mat="peach", vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=height, location=center)
    obj = bpy.context.object
    for p in obj.data.polygons:
        p.use_smooth = len(p.vertices) == 4
    return register(obj, mat)


def rod(name, a, b, radius, mat="metal", vertices=12):
    a, b = Vector(a), Vector(b)
    d = b - a
    obj = cylinder(name, (a + b) / 2, radius, d.length, mat, vertices)
    obj.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    return obj


def beam_between(name, a, b, width, depth, mat="cream_trim"):
    a, b = Vector(a), Vector(b)
    d = b - a
    obj = box(name, (a + b) / 2, (width, depth, d.length), mat)
    obj.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    return obj


def mesh_object(name, verts, faces, mat="plaster"):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
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

    def box(self, name, u, v, z, w, d, h, mat="plaster"):
        return box(name, self.p(u, v, z), (w, d, h), mat, self.angle)

    def rod(self, name, a, b, radius, mat="metal"):
        return rod(name, self.p(*a), self.p(*b), radius, mat)

    def prism(self, name, polygon_uz, v0, v1, mat="plaster"):
        n = len(polygon_uz)
        verts = [self.p(u, v0, z) for u, z in polygon_uz]
        verts += [self.p(u, v1, z) for u, z in polygon_uz]
        faces = [tuple(reversed(range(n))), tuple(range(n, 2*n))]
        faces += [(i, (i+1) % n, (i+1) % n+n, i+n)
                  for i in range(n)]
        return mesh_object(name, verts, faces, mat)


FRONT = Facade((0, 0), (1, 0), (0, 1))
RIGHT = Facade((WIDTH/2, 0), (0, 1), (-1, 0))
LEFT = Facade((-WIDTH/2, DEPTH), (0, -1), (1, 0))
REAR = Facade((WIDTH/2, DEPTH), (-1, 0), (0, -1))


def panel_with_holes(F, name, u0, u1, z0, z1, v, thickness,
                     holes, floor, confidence=.65, mat="plaster"):
    """
    Build a thick wall as nonoverlapping cells around rectangular holes.
    No solid wall is left behind the window openings.
    holes = [(u_min, u_max, z_min, z_max), ...]
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
           cols=2, rows=3, grille=False, door=False):
    begin(name, "DOOR" if door else "WINDOW", floor, conf,
          "visible-layout estimate" if conf >= .6 else "inferred")
    fw = .055 if not door else .075
    gd = v + .17

    # Dark interior is a recessed physical back surface.
    F.box("interior_shadow", u, gd+.16, z, w-.025, .025, h-.025, "dark")

    for c in range(cols):
        for r in range(rows):
            pw, ph = (w-fw)/cols, (h-fw)/rows
            uc = u-w/2+fw/2+(c+.5)*pw
            zc = z-h/2+fw/2+(r+.5)*ph
            F.box("individual_pane", uc, gd+.025, zc,
                  pw-fw, .024, ph-fw, "glass")

    for c in range(cols+1):
        uc = u-w/2+fw/2+c*(w-fw)/cols
        F.box("vertical_frame", uc, gd, z, fw, .075, h, "frame")
    for r in range(rows+1):
        zr = z-h/2+fw/2+r*(h-fw)/rows
        F.box("horizontal_frame", u, gd, zr, w, .075, fw, "frame")

    F.box("sill", u, v+.045, z-h/2-.065,
          w+.15, .44, .12, "cream_trim")
    F.box("reveal_left", u-w/2-.025, v+.105, z,
          .05, .22, h, "cream_trim")
    F.box("reveal_right", u+w/2+.025, v+.105, z,
          .05, .22, h, "cream_trim")

    if grille:
        for uc in np.arange(u-w/2+.14, u+w/2, .23):
            F.rod("grille_vertical",
                  (uc, v-.06, z-h/2+.06),
                  (uc, v-.06, z+h/2-.06), .012)
        for zr in np.arange(z-h/2+.16, z+h/2, .30):
            F.rod("grille_horizontal",
                  (u-w/2+.06, v-.065, zr),
                  (u+w/2-.06, v-.065, zr), .012)
    if door:
        for uc in (u-.15, u+.15):
            F.rod("pull_handle", (uc, gd-.07, z-.20),
                  (uc, gd-.07, z+.20), .018)


def railing(F, name, u0, u1, v, z, floor, conf=.55, height=1.05):
    begin(name, "RAILING", floor, conf)
    for uc in np.linspace(u0, u1, max(2, int((u1-u0)/.65)+1)):
        F.rod("post", (uc, v, z), (uc, v, z+height), .023)
    for hh in (.12, .38, .70, height):
        F.rod("rail", (u0, v, z+hh), (u1, v, z+hh), .021)


def band(F, name, u0, u1, v, z, height, floor, count,
         conf=.65, mat="plaster"):
    """
    A physically inset square band:
    solid backing, upper/lower strips and piers between square pockets.
    Inserts are recessed 45 mm from the fascia's front plane.
    """
    begin(name, "DECORATION", floor, conf)
    step = (u1-u0)/count
    sq = min(.43, height*.48, step*.48)
    front = v
    F.box("backing", (u0+u1)/2, front+.17, z,
          u1-u0, .18, height, mat)
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
        F.box("recessed_square_insert", uc, front+.057, z,
              sq-.025, .022, sq-.025, "motif")
    for dz in (-height/2-.045, height/2+.045):
        F.box("band_moulding", (u0+u1)/2, front+.025, z+dz,
              u1-u0+.07, .18, .09, "cream_trim")


def column_stack(x, y, z0, z1, radius, floor, name,
                 conf=.65, mat="peach"):
    begin(name, "COLUMN", floor, conf,
          "visible-layout estimate" if conf >= .6 else "inferred")
    cylinder("shaft", (x, y, (z0+z1)/2),
             radius, z1-z0, mat, 40)
    cylinder("base", (x, y, z0+.055),
             radius*1.12, .11, "cream_trim", 40)
    cylinder("capital", (x, y, z1-.07),
             radius*1.12, .14, "cream_trim", 40)
    # Fine horizontal repair/joint collars, not ornate classical capitals.
    if z1-z0 > 5:
        for zz in np.arange(z0+H, z1-.4, H):
            cylinder("plaster_joint", (x, y, zz),
                     radius*1.014, .035, "cream_trim", 40)


def arch_bay(F, name, u, width, bottom, spring, top, v,
             thickness, floor):
    begin(name, "ARCH", floor, .66, "visible curved opening")
    r = width/2
    outer = width/2+.46

    F.box("left_pier", u-r-.23, v+thickness/2,
          (bottom+top)/2, .46, thickness, top-bottom, "peach")
    F.box("right_pier", u+r+.23, v+thickness/2,
          (bottom+top)/2, .46, thickness, top-bottom, "peach")

    # Closed wedge-shaped spandrel pieces give a true curved intrados.
    angles = np.linspace(math.pi, 0, 49)
    pts = [(u+r*math.cos(t), spring+r*math.sin(t)) for t in angles]
    for (a, za), (b, zb) in zip(pts[:-1], pts[1:]):
        F.prism("curved_spandrel",
                [(a, za), (b, zb), (b, top), (a, top)],
                v, v+thickness, "peach")

    # Recessed, arched dark backing.
    polygon = [(u-r, bottom), (u+r, bottom)]
    polygon += list(reversed(pts))
    F.prism("arched_recess_back", polygon,
            v+thickness+.34, v+thickness+.37, "dark")

    window(F, name+"_lower_glazing", u, (bottom+spring)/2,
           width-.12, spring-bottom-.08,
           v+thickness+.10, floor, .63, rows=2)


def pediment(F, u, z, width, v, floor):
    begin(f"pediment_{u:+.1f}", "DECORATION", floor, .70,
          "visible triangular window crown")
    tri = [(u-width/2, z), (u+width/2, z), (u, z+.57)]
    F.prism("pediment_body", tri, v-.18, v+.14, "peach")
    F.box("pediment_entablature", u, v-.045, z-.13,
          width+.12, .48, .26, "cream_trim")
    for a, b in ((tri[0], tri[2]), (tri[2], tri[1])):
        beam_between("sloping_moulding",
                     F.p(a[0], v-.22, a[1]+.045),
                     F.p(b[0], v-.22, b[1]+.045),
                     .13, .16, "cream_trim")


# ---------------------------------------------------------------------------
# Site, foundations and floors
# ---------------------------------------------------------------------------

begin("immediate_paved_apron", "GROUND", -1, .38,
      "foreground surface visible; extent inferred")
box("ground", (0, DEPTH/2-2, -.17), (43, 39, .32), "concrete")

begin("building_plinth", "SLAB", 0, .40)
box("plinth", (0, DEPTH/2, BASE/2), (WIDTH+.30, DEPTH+.30, BASE),
    "concrete")

# Stairwell opening, retained through all upper floors.
STAIR_X0, STAIR_X1 = 8.8, 13.8
STAIR_Y0, STAIR_Y1 = 17.0, 23.2

for f in range(6):
    zz = LEVELS[f]
    begin(f"floor_{f}_structural_slab", "SLAB", f, .35)
    if f == 0:
        box("ground_slab", (0, DEPTH/2, zz-SLAB_T/2),
            (WIDTH, DEPTH, SLAB_T), "concrete")
        continue

    # Upper floors start behind the tall front window/recess zone.
    # Ground entrance remains double height at the front.
    ymin = 4.8 if f == 1 else 2.6
    if f == 5:
        ymin = 2.3

    box("main_slab", ((-15+STAIR_X0)/2, (ymin+DEPTH)/2,
                     zz-SLAB_T/2),
        (STAIR_X0+15, DEPTH-ymin, SLAB_T), "concrete")
    box("stair_right_strip", ((STAIR_X1+15)/2, (ymin+DEPTH)/2,
                              zz-SLAB_T/2),
        (15-STAIR_X1, DEPTH-ymin, SLAB_T), "concrete")
    box("stair_front_strip", ((STAIR_X0+STAIR_X1)/2,
                              (ymin+STAIR_Y0)/2, zz-SLAB_T/2),
        (STAIR_X1-STAIR_X0, STAIR_Y0-ymin, SLAB_T), "concrete")
    box("stair_rear_strip", ((STAIR_X0+STAIR_X1)/2,
                             (STAIR_Y1+DEPTH)/2, zz-SLAB_T/2),
        (STAIR_X1-STAIR_X0, DEPTH-STAIR_Y1, SLAB_T), "concrete")

# Internal, conservatively inferred RC grid.
for f in range(6):
    z0, z1 = LEVELS[f], LEVELS[f+1]
    for x in (-12, -6, 0, 6, 12):
        for y in (7.2, 13.2, 19.2):
            if STAIR_X0 < x < STAIR_X1 and STAIR_Y0 < y < STAIR_Y1:
                continue
            column_stack(x, y, z0, z1, .25, f,
                         f"internal_column_{f}_{x}_{y}", .25, "concrete")
    begin(f"internal_beams_{f}", "BEAM", f, .25)
    for y in (7.2, 13.2):
        box("transverse_beam", (0, y, z1-.39),
            (29.7, .35, .40), "concrete")
    box("rear_left_beam", (-3.1, 19.2, z1-.39),
        (23.8, .35, .40), "concrete")
    for x in (-12, -6, 0, 6):
        box("longitudinal_beam", (x, 15.4, z1-.39),
            (.35, 17.2, .40), "concrete")

# A modest internal corridor and room partitions, not fabricated room programs.
for f in range(6):
    z0, z1 = LEVELS[f]+.03, LEVELS[f+1]-.26
    corridor = Facade((-14.7, 9.8), (1, 0), (0, 1))
    door_centres = (3.0, 9.0, 15.0, 21.0, 27.0)
    holes = [(u-.55, u+.55, z0, z0+2.25) for u in door_centres]
    panel_with_holes(corridor, f"corridor_partition_{f}",
                     0, 29.4, z0, z1, 0, .18, holes, f, .20)
    for i, u in enumerate(door_centres):
        window(corridor, f"internal_door_{f}_{i}", u, z0+1.12,
               1.08, 2.24, .02, f, .20, cols=1, rows=1, door=True)
    begin(f"rear_room_partitions_{f}", "WALL", f, .20)
    for x in (-9, -3, 3):
        box("partition", (x, 16.85, (z0+z1)/2),
            (.18, 13.5, z1-z0), "plaster")


# ---------------------------------------------------------------------------
# Front: lower flanking masses, arches and tall window towers
# ---------------------------------------------------------------------------

canopy_top = LEVELS[2] + .20
canopy_under = canopy_top - .36
grand_top = LEVELS[5] + .30

for sign in (-1, 1):
    u = sign*9.55
    a, b = sorted((sign*7.25, sign*11.8))

    # Lower front wing: ground window, then arched upper opening.
    lower_hole = (u-1.05, u+1.05, BASE+.12, BASE+2.80)
    panel_with_holes(FRONT, f"lower_wing_{sign}",
                     a, b, BASE, LEVELS[1]+.05,
                     .0, .46, [lower_hole], 0, .64, "peach")
    window(FRONT, f"lower_wing_window_{sign}",
           u, BASE+1.46, 2.10, 2.68, .05, 0, .66,
           rows=3, grille=(sign == 1))

    # Flat side strips close the space outside the arch's own piers.
    arch_bottom = LEVELS[1]+.13
    arch_spring = LEVELS[1]+1.64
    arch_top = canopy_top-.10
    aw = 2.22
    arch_bay(FRONT, f"front_arch_{sign}", u, aw,
             arch_bottom, arch_spring, arch_top, 0, .46, 1)
    begin(f"arch_outer_returns_{sign}", "WALL", 1, .62)
    left_edge, right_edge = u-aw/2-.46, u+aw/2+.46
    for aa, bb in ((a, left_edge), (right_edge, b)):
        if bb > aa:
            FRONT.box("side_fill", (aa+bb)/2, .23,
                      (LEVELS[1]+arch_top)/2,
                      bb-aa, .46, arch_top-LEVELS[1], "peach")
    FRONT.box("under_arch_sill", u, .23,
              (LEVELS[1]+arch_bottom)/2,
              aw, .46, arch_bottom-LEVELS[1], "peach")

    # Two tall openings separated by the strong horizontal sill band.
    tall1 = (u-1.04, u+1.04, canopy_top+.20, LEVELS[4]-.35)
    tall2 = (u-1.02, u+1.02, LEVELS[4]+.32, WING_ROOF-1.48)
    panel_with_holes(FRONT, f"tall_window_tower_{sign}",
                     a, b, canopy_top, WING_ROOF,
                     .02, .55, [tall1, tall2], 3, .70)
    window(FRONT, f"lower_tall_window_{sign}", u,
           (tall1[2]+tall1[3])/2, 2.08, tall1[3]-tall1[2],
           .14, 2, .72, rows=5)
    window(FRONT, f"upper_tall_window_{sign}", u,
           (tall2[2]+tall2[3])/2, 2.04, tall2[3]-tall2[2],
           .14, 4, .72, rows=5)

    begin(f"tower_horizontal_bands_{sign}", "DECORATION", 4, .68)
    for zz in (canopy_top+.02, LEVELS[4], LEVELS[4]+.19):
        FRONT.box("projecting_sill_band", u, -.13, zz,
                  3.02, .49, .20, "cream_trim")

    for du in (-1.31, 1.31):
        column_stack(u+du, -.04, tall2[2]-.02, tall2[3]+.04,
                     .18, 4, f"tall_window_colonette_{sign}_{du}", .70)
    pediment(FRONT, u, tall2[3]+.12, 3.10, -.04, 5)


# ---------------------------------------------------------------------------
# Front: central recessed entrance, canopy and elevated monumental loggia
# ---------------------------------------------------------------------------

# Wide lower entrance piers, with physically deep returns.
for sign in (-1, 1):
    begin(f"entrance_side_pier_{sign}", "WALL", 0, .71,
          "visible deep entrance support")
    box("deep_entrance_pier", (sign*6.92, 1.2, (BASE+canopy_under)/2),
        (.72, 4.0, canopy_under-BASE), "plaster")

# Recessed entrance wall and upper corridor behind the canopy.
ENT = Facade((0, 4.7), (1, 0), (0, 1))
for f in (0, 1):
    z0, z1 = LEVELS[f], LEVELS[f+1]-.08
    holes = [
        (-5.7, -3.3, z0+.10, z0+2.85),
        (-2.6, 2.6, z0+.05, z0+2.88),
        (3.3, 5.7, z0+.10, z0+2.85),
    ]
    panel_with_holes(ENT, f"entrance_rear_wall_{f}",
                     -6.65, 6.65, z0, z1, 0, .32,
                     holes, f, .58)
    for i, (a, b, c, d) in enumerate(holes):
        window(ENT, f"entrance_opening_{f}_{i}",
               (a+b)/2, (c+d)/2, b-a, d-c, .03,
               f, .60, cols=4 if i == 1 else 2,
               rows=2, door=(f == 0))
    if f == 1:
        begin("entrance_mezzanine_balcony", "BALCONY", 1, .60)
        box("corridor_slab", (0, 3.94, LEVELS[1]-.12),
            (12.6, 1.55, .24), "concrete")
        railing(FRONT, "entrance_upper_corridor_rail",
                -6.15, 6.15, 3.16, LEVELS[1], 1, .61)

# Entrance canopy: slab, fascia with nine inset motifs, returns and soffit grid.
begin("projecting_entrance_canopy", "SLAB", 2, .76,
      "visible canopy geometry")
box("thick_canopy_slab", (0, .94, canopy_top-.18),
    (15.4, 7.15, .36), "concrete")

band(FRONT, "canopy_front_inset_square_fascia",
     -7.7, 7.7, -2.635, canopy_top+.35, .94, 2, 9, .77)

CAN_R = Facade((7.7, -2.635), (0, 1), (-1, 0))
CAN_L = Facade((-7.7, 4.515), (0, -1), (1, 0))
for F, nm in ((CAN_R, "right"), (CAN_L, "left")):
    band(F, f"canopy_{nm}_return_motifs",
         0, 7.15, 0, canopy_top+.35, .94, 2, 5, .59)

begin("canopy_coffered_structural_soffit", "BEAM", 2, .70,
      "visible grid-like ceiling; spacing estimated")
for x in np.linspace(-7.1, 7.1, 7):
    box("soffit_longitudinal_rib", (x, .94, canopy_under-.15),
        (.19, 6.92, .30), "plaster")
for y in np.linspace(-2.35, 4.22, 5):
    box("soffit_cross_rib", (0, y, canopy_under-.15),
        (14.9, .19, .30), "plaster")

# Central wall behind the giant paired columns.
central_holes = [(-2.55, 2.55, LEVELS[3], grand_top-.22)]
for side in (-1, 1):
    c = side*4.70
    central_holes.extend([
        (c-1.15, c+1.15, LEVELS[2]+1.25, LEVELS[3]-.24),
        (c-1.15, c+1.15, LEVELS[4]+.40, LEVELS[4]+1.83),
    ])

panel_with_holes(FRONT, "central_loggia_screen",
                 -7.25, 7.25, canopy_top+.10, grand_top,
                 1.20, .38, central_holes, 3, .70)
for side in (-1, 1):
    c = side*4.70
    for f, za, zb in [
        (2, LEVELS[2]+1.25, LEVELS[3]-.24),
        (4, LEVELS[4]+.40, LEVELS[4]+1.83)
    ]:
        window(FRONT, f"central_flank_window_{side}_{f}",
               c, (za+zb)/2, 2.30, zb-za, 1.28, f, .68,
               cols=3, rows=2, grille=(f == 4))

# Actual central upper recess, not a painted black rectangle.
begin("central_upper_recess_returns", "WALL", 3, .59)
for x in (-2.72, 2.72):
    box("loggia_side_return", (x, 2.45, (LEVELS[3]+grand_top)/2),
        (.34, 2.48, grand_top-LEVELS[3]), "plaster")
box("loggia_recess_back", (0, 3.75, (LEVELS[3]+grand_top)/2),
    (5.1, .26, grand_top-LEVELS[3]), "plaster")

begin("central_upper_loggia_floor", "BALCONY", 3, .63)
box("loggia_floor", (0, 2.40, LEVELS[3]-.12),
    (5.40, 2.75, .24), "concrete")
railing(FRONT, "central_loggia_tall_metal_screen",
        -2.50, 2.50, 1.12, LEVELS[3], 3, .70, height=1.90)

LOGGIA_BACK = Facade((0, 3.58), (1, 0), (0, 1))
window(LOGGIA_BACK, "upper_loggia_recessed_door",
       0, LEVELS[3]+1.17, 1.75, 2.34, .0, 3, .44,
       cols=2, rows=2, door=True)

# Giant paired cylindrical columns rise directly from canopy level.
for side in (-1, 1):
    for offset in (-.30, .30):
        column_stack(side*4.45+offset, -.06,
                     canopy_top+.82, grand_top,
                     .245, 3, f"grand_paired_column_{side}_{offset}",
                     .77)

# Heavy upper projecting box with a recessed horizontal opening.
begin("central_upper_projecting_floor", "SLAB", 5, .70)
box("upper_box_floor", (0, 1.05, grand_top+.10),
    (14.7, 4.90, .36), "plaster")

upper_opening = (-5.65, 5.65, grand_top+1.05, CENTRAL_ROOF-.55)
panel_with_holes(FRONT, "upper_central_projecting_front",
                 -7.35, 7.35, grand_top+.20, CENTRAL_ROOF,
                 -1.40, .48, [upper_opening], 5, .74)

begin("upper_central_box_side_returns", "WALL", 5, .48)
for x in (-7.12, 7.12):
    box("box_side_return", (x, 1.07, (grand_top+CENTRAL_ROOF)/2),
        (.46, 4.94, CENTRAL_ROOF-grand_top), "plaster")

window(FRONT, "top_horizontal_recessed_glazing", 0,
       (upper_opening[2]+upper_opening[3])/2,
       11.30, upper_opening[3]-upper_opening[2], -.57, 5, .71,
       cols=8, rows=2)

for centre in (-2.02, 2.02):
    for du in (-.29, .29):
        column_stack(centre+du, -1.03,
                     upper_opening[2], upper_opening[3],
                     .205, 5, f"top_paired_columns_{centre}_{du}", .74)


# ---------------------------------------------------------------------------
# Front: asymmetrical outer recessed bays
# ---------------------------------------------------------------------------

for side in (-1, 1):
    a, b = (-15, -11.8) if side < 0 else (11.8, 15)
    u = (a+b)/2
    recess_v = 1.60
    holes = []
    for f in range(6):
        zz = LEVELS[f]
        holes.append((u-.98, u+.98, zz+.75, zz+2.74))

    panel_with_holes(FRONT, f"outer_recessed_back_wall_{side}",
                     a, b, BASE, WING_ROOF, recess_v, .30,
                     holes, 3, .60)

    for f in range(6):
        window(FRONT, f"outer_recess_window_{side}_{f}",
               u, LEVELS[f]+1.745, 1.96, 1.99,
               recess_v+.03, f, .60, rows=2)

    # Vertical returns physically enclose the balcony recesses.
    begin(f"outer_bay_returns_{side}", "WALL", 3, .61)
    for xx in (a+.15, b-.15):
        box("full_height_return", (xx, .90, (BASE+WING_ROOF)/2),
            (.30, 1.80, WING_ROOF-BASE), "plaster")

    # Photo asymmetry: right has a more repetitive stack;
    # left has larger/taller columned recesses.
    balcony_floors = (1, 2, 3, 4, 5) if side > 0 else (2, 4, 5)
    for f in balcony_floors:
        zz = LEVELS[f]
        begin(f"front_outer_balcony_{side}_{f}", "BALCONY", f, .62)
        box("balcony_slab", (u, .78, zz-.13),
            (b-a, 1.85, .26), "concrete")
        box("solid_balcony_parapet", (u, -.025, zz+.43),
            (b-a, .25, .86), "plaster")
        box("parapet_coping", (u, -.035, zz+.89),
            (b-a+.06, .33, .10), "cream_trim")

    spans = [(LEVELS[0], LEVELS[2]),
             (LEVELS[2], LEVELS[4]),
             (LEVELS[4], WING_ROOF)] if side < 0 else [
                 (LEVELS[0], LEVELS[2]),
                 (LEVELS[2], LEVELS[3]),
                 (LEVELS[3], LEVELS[4]),
                 (LEVELS[4], LEVELS[5]),
                 (LEVELS[5], WING_ROOF)]
    for i, (za, zb) in enumerate(spans):
        column_stack(side*14.42, .02, za, zb, .27,
                     min(5, max(0, int((za-BASE)/H))),
                     f"outer_front_round_column_{side}_{i}", .65)


# ---------------------------------------------------------------------------
# Hidden sides and rear: conservative continuation, same levels/window language
# ---------------------------------------------------------------------------

# Side balcony recesses are concentrated near the visible front corners.
for F, name in ((RIGHT, "right"), (LEFT, "left")):
    # LEFT runs from rear toward front.
    front_start = 0 if name == "right" else DEPTH-4.5
    main_start = 4.5 if name == "right" else 0
    main_end = DEPTH if name == "right" else DEPTH-4.5
    centres = np.linspace(main_start+2.0, main_end-2.0, 4)

    for f in range(6):
        z0, z1 = LEVELS[f], LEVELS[f+1]
        holes = []
        for i, u in enumerate(centres):
            w = 1.55 if i == 3 else 2.15
            hh = 1.55 if i == 3 else 1.95
            holes.append((u-w/2, u+w/2, z0+.95, z0+.95+hh))
        panel_with_holes(F, f"{name}_wall_{f}",
                         main_start, main_end, z0, z1,
                         0, WALL_T, holes, f, .31)
        for i, (a, b, c, d) in enumerate(holes):
            window(F, f"{name}_window_{f}_{i}",
                   (a+b)/2, (c+d)/2, b-a, d-c, .035,
                   f, .31, cols=2, rows=2,
                   grille=(f == 0 and i % 2 == 0))

        # Physical side balcony/corridor recess.
        ua, ub = front_start, front_start+4.5
        uc = (ua+ub)/2
        holes2 = [(uc-1.1, uc+1.1, z0+.20, z0+2.75)]
        panel_with_holes(F, f"{name}_corner_recess_back_{f}",
                         ua, ub, z0, z1, 1.25, .30,
                         holes2, f, .36)
        window(F, f"{name}_corner_balcony_door_{f}",
               uc, z0+1.475, 2.2, 2.55, 1.28, f, .34,
               rows=2, door=(f > 0))

        begin(f"{name}_side_balcony_{f}", "BALCONY", f, .34)
        F.box("slab", uc, .62, z0-.12, 4.50, 1.80, .24, "concrete")
        if f > 0:
            F.box("parapet", uc, -.14, z0+.43,
                  4.50, .25, .86, "plaster")
            F.box("coping", uc, -.15, z0+.90,
                  4.57, .33, .10, "cream_trim")
        for edge in (ua+.17, ub-.17):
            xyz = F.p(edge, -.02, z0)
            column_stack(xyz[0], xyz[1], z0, z1, .22, f,
                         f"{name}_side_column_{f}_{edge}", .32)

        begin(f"{name}_floor_edge_band_{f}", "BEAM", f, .30)
        F.box("floor_edge", (main_start+main_end)/2, -.045,
              z1-.15, main_end-main_start, .39, .30, "cream_trim")

# Rear: regular bays, central rear access, no invented monumental entrance.
for f in range(6):
    z0, z1 = LEVELS[f], LEVELS[f+1]
    centres = [2.7, 7.6, 12.5, 17.5, 22.4, 27.3]
    holes = []
    for i, u in enumerate(centres):
        w = 1.65 if i == 0 else 2.15
        holes.append((u-w/2, u+w/2, z0+.95, z0+2.90))
    if f == 0:
        holes.append((14.1, 15.9, z0, z0+2.50))

    panel_with_holes(REAR, f"rear_wall_{f}", 0, WIDTH, z0, z1,
                     0, WALL_T, holes, f, .26)
    for i, (a, b, c, d) in enumerate(holes):
        window(REAR, f"rear_opening_{f}_{i}", (a+b)/2,
               (c+d)/2, b-a, d-c, .035, f, .26,
               rows=2, door=(f == 0 and i == 6),
               grille=(f == 0 and i < 6))
    begin(f"rear_slab_edge_{f}", "BEAM", f, .26)
    REAR.box("rear_edge_band", WIDTH/2, -.05, z1-.15,
             WIDTH, .40, .30, "cream_trim")


# ---------------------------------------------------------------------------
# Stairs: broad front approach and continuous internal dogleg stairs
# ---------------------------------------------------------------------------

begin("broad_entrance_steps", "STAIR", 0, .65,
      "visible entrance steps; riser count estimated")
risers = 4
for i in range(risers):
    top = BASE*(i+1)/risers
    front_y = -4.05+i*.36
    rear_y = -.30
    box("entrance_tread", (0, (front_y+rear_y)/2, top/2),
        (13.05, rear_y-front_y, top), "step")
    box("worn_tread_nosing", (0, front_y+.035, top-.025),
        (13.10, .07, .05), "concrete")

for side in (-1, 1):
    begin(f"flank_access_steps_{side}", "STAIR", 0, .47)
    for i in range(4):
        z = BASE*(i+1)/4
        y0 = -1.85+i*.30
        box("side_tread", (side*9.55, (y0+.16)/2, z/2),
            (2.70, .16-y0, z), "concrete")

# Small circular foreground platform: only a partial arc is visible in the photo.
begin("foreground_partial_evidence_circular_platform", "GROUND", -1, .30,
      "circular/curved foreground rim suggested; diameter and extent inferred")
cylinder("low_circular_platform", (-3.6, -4.65, .18),
         1.20, .36, "concrete", 96)

def internal_stair(f):
    z0 = LEVELS[f]
    rise = H/22
    run = .28
    x_left, x_right = 10.05, 12.45
    y0 = 18.00
    width = 1.70
    begin(f"dogleg_stair_{f}", "STAIR", f, .22,
          "inferred circulation, location not observed")

    # Individual solid steps, with sloping RC waist slabs.
    for k in range(11):
        z = z0+(k+1)*rise
        box("up_flight_tread", (x_left, y0+(k+.5)*run, z-.09),
            (width, run+.015, .18), "concrete")
        z2 = z0+H/2+(k+1)*rise
        box("return_flight_tread",
            (x_right, y0+(10-k+.5)*run, z2-.09),
            (width, run+.015, .18), "concrete")

    # Sloped waist slabs are closed extruded prisms.
    SF = Facade((x_left-width/2, 0), (0, 1), (1, 0))
    poly1 = [(y0, z0-.12), (y0+11*run, z0+H/2-.12),
             (y0+11*run, z0+H/2-.32), (y0, z0-.32)]
    SF.prism("first_flight_waist", poly1, 0, width, "concrete")
    SF2 = Facade((x_right-width/2, 0), (0, 1), (1, 0))
    poly2 = [(y0, z0+H-.12), (y0+11*run, z0+H/2-.12),
             (y0+11*run, z0+H/2-.32), (y0, z0+H-.32)]
    SF2.prism("return_flight_waist", poly2, 0, width, "concrete")

    box("half_landing", (11.25, 21.82, z0+H/2-.12),
        (4.65, 1.45, .24), "concrete")
    box("floor_landing", (11.25, 17.48, z0-.12),
        (4.65, 1.0, .24), "concrete")

    begin(f"stair_handrails_{f}", "RAILING", f, .22)
    for xx, reverse in ((x_left+.81, False), (x_right-.81, True)):
        p = []
        for k in range(12):
            yy = y0+k*run
            zz = z0+(H-k*rise if reverse else k*rise)
            rod("stair_baluster", (xx, yy, zz),
                (xx, yy, zz+.95), .018)
            p.append((xx, yy, zz+.95))
        rod("sloped_handrail", p[0], p[-1], .027)

for f in range(6):
    internal_stair(f)


# ---------------------------------------------------------------------------
# Roof, parapets, cornices, motifs and roof stair enclosure
# ---------------------------------------------------------------------------

begin("main_flat_roof", "ROOF", 6, .30)
# Keep the stairwell opening clear, including at the roof.
box("roof_main", ((-15+STAIR_X0)/2, DEPTH/2, WING_ROOF-.12),
    (STAIR_X0+15, DEPTH, .24), "roof")
box("roof_right", ((STAIR_X1+15)/2, DEPTH/2, WING_ROOF-.12),
    (15-STAIR_X1, DEPTH, .24), "roof")
box("roof_stair_front", ((STAIR_X0+STAIR_X1)/2, STAIR_Y0/2,
                         WING_ROOF-.12),
    (STAIR_X1-STAIR_X0, STAIR_Y0, .24), "roof")
box("roof_stair_rear", ((STAIR_X0+STAIR_X1)/2,
                        (STAIR_Y1+DEPTH)/2, WING_ROOF-.12),
    (STAIR_X1-STAIR_X0, DEPTH-STAIR_Y1, .24), "roof")

begin("raised_central_roof", "ROOF", 6, .40)
box("central_roof_slab", (0, 1.17, CENTRAL_ROOF-.12),
    (14.75, 5.20, .24), "roof")

for a, b, name in ((-15, -7.35, "left"), (7.35, 15, "right")):
    band(FRONT, f"front_{name}_roof_square_band",
         a, b, -.08, WING_ROOF+.44, .86, 6, 6, .68)

band(FRONT, "central_crown_square_band",
     -7.40, 7.40, -1.45, CENTRAL_ROOF+.43, .86, 6, 8, .73)

for F, name, length in (
    (RIGHT, "right", DEPTH),
    (LEFT, "left", DEPTH),
    (REAR, "rear", WIDTH),
):
    band(F, f"{name}_roof_inset_band", 0, length,
         -.065, WING_ROOF+.44, .86, 6,
         int(round(length/1.35)), .29)
    begin(f"{name}_roof_coping", "PARAPET", 6, .29)
    for dz, thick, depth in ((.92, .12, .48),
                             (1.04, .09, .44),
                             (1.13, .07, .40)):
        F.box("layered_coping", length/2, .095, WING_ROOF+dz,
              length+.08, depth, thick, "cream_trim")

for a, b, z, v, nm in (
    (-15, -7.35, WING_ROOF, -.08, "left"),
    (7.35, 15, WING_ROOF, -.08, "right"),
    (-7.40, 7.40, CENTRAL_ROOF, -1.45, "central"),
):
    begin(f"front_{nm}_layered_crown", "PARAPET", 6, .66)
    for dz, thickness, depth in ((.92, .12, .48),
                                 (1.04, .09, .44),
                                 (1.13, .07, .40)):
        FRONT.box("cornice_layer", (a+b)/2, v+.15, z+dz,
                  b-a+.12, depth, thickness, "cream_trim")

# Raised roof side and rear parapets.
for sign in (-1, 1):
    F = Facade((sign*7.40, -1.45 if sign > 0 else 3.77),
               (0, sign), (-sign, 0))
    band(F, f"central_roof_side_return_{sign}",
         0, 5.22, 0, CENTRAL_ROOF+.43, .86, 6, 4, .37)

begin("central_roof_rear_parapet", "PARAPET", 6, .25)
box("rear_parapet", (0, 3.68, CENTRAL_ROOF+.47),
    (14.80, .27, .94), "plaster")
box("rear_coping", (0, 3.68, CENTRAL_ROOF+.98),
    (14.90, .40, .10), "cream_trim")

# Modest stair headroom enclosure located over the inferred stair.
SH = Facade((0, 16.86), (1, 0), (0, 1))
panel_with_holes(SH, "roof_stair_headroom_front",
                 8.65, 13.95, WING_ROOF, WING_ROOF+2.65,
                 0, .22,
                 [(10.15, 11.25, WING_ROOF, WING_ROOF+2.20)],
                 6, .20)
window(SH, "roof_access_door", 10.70, WING_ROOF+1.10,
       1.10, 2.20, .02, 6, .20, cols=1, rows=1, door=True)
begin("roof_stair_headroom_shell", "WALL", 6, .20)
for xx in (8.76, 13.84):
    box("headroom_side", (xx, 20.05, WING_ROOF+1.325),
        (.22, 6.38, 2.65), "plaster")
box("headroom_back", (11.3, 23.13, WING_ROOF+1.325),
    (5.30, .22, 2.65), "plaster")
begin("roof_stair_headroom_lid", "ROOF", 6, .20)
box("flat_headroom_lid", (11.30, 20.05, WING_ROOF+2.75),
    (5.50, 6.58, .20), "roof")

# Drainage strips and roof sumps rather than speculative rooftop equipment.
begin("roof_drainage_channels", "ROOF", 6, .24)
for xx in (-14.50, 14.50):
    box("edge_drain_channel", (xx, 12, WING_ROOF+.014),
        (.16, 22.7, .028), "dark")
for yy in (1.15, 22.95):
    box("cross_drain_channel", (0, yy, WING_ROOF+.014),
        (28.8, .16, .028), "dark")


# ---------------------------------------------------------------------------
# Exterior services
# ---------------------------------------------------------------------------

def downpipe(F, u, name, height, conf=.30):
    begin(name, "PIPE", -1, conf,
          "front pipe routing visible" if conf >= .6 else "inferred drainage")
    F.rod("vertical_rainwater_pipe",
          (u, -.20, .20), (u, -.20, height-.20), .052, "pipe")
    F.rod("roof_outlet",
          (u, -.20, height-.20), (u, .22, height-.20), .052, "pipe")
    F.rod("bottom_elbow",
          (u, -.20, .24), (u, -.54, .12), .052, "pipe")
    for z in np.arange(1.1, height, 1.8):
        F.box("pipe_bracket", u, -.10, z, .19, .24, .055, "metal")
    begin(name+"_ground_drain", "OTHER", -1, conf)
    F.box("drain_box", u, -.52, .025, .42, .42, .05, "metal")
    for du in np.linspace(-.16, .16, 7):
        F.box("drain_grille_slot", u+du, -.52, .057,
              .022, .34, .012, "dark")

for u in (-7.95, 7.95):
    downpipe(FRONT, u, f"front_canopy_downpipe_{u}",
             canopy_top+.45, .69)
for F, nm in ((RIGHT, "right"), (LEFT, "left"), (REAR, "rear")):
    for u in ((5.0, 22.8) if nm != "rear" else (1.1, 28.9)):
        downpipe(F, u, f"{nm}_rainwater_pipe_{u}",
                 WING_ROOF+.10, .28)


def ac_unit(F, u, z, floor, name):
    begin(name, "AC_UNIT", floor, .28,
          "sparse service allocation; exact unit placement unverified")
    F.box("housing", u, -.40, z, .90, .48, .62, "ac")
    F.box("front_recess", u, -.648, z, .77, .014, .48, "dark")

    # Circular fan guard in the wall-local UZ plane.
    for r in (.075, .13, .19, .225):
        pp = [(u+r*math.cos(t), -.667, z+r*math.sin(t))
              for t in np.linspace(0, 2*math.pi, 33)]
        for a, b in zip(pp[:-1], pp[1:]):
            F.rod("fan_concentric_guard", a, b, .007, "metal")
    for t in np.linspace(0, math.pi, 6, endpoint=False):
        du, dz = .235*math.cos(t), .235*math.sin(t)
        F.rod("fan_radial_guard", (u-du, -.674, z-dz),
              (u+du, -.674, z+dz), .007, "metal")

    for du in (-.31, .31):
        F.box("mounting_bracket", u+du, -.28, z-.37,
              .055, .66, .065, "metal")
        F.rod("bracket_diagonal", (u+du, -.05, z-.63),
              (u+du, -.52, z-.37), .022)
    for dz in (-.09, .07):
        F.rod("insulated_refrigerant_line",
              (u+.43, -.24, z+dz), (u+.65, -.10, z+dz), .022, "pipe")
    F.rod("condensate_drop", (u+.65, -.10, z-.02),
          (u+.65, -.10, z-.98), .013, "pipe")

# No AC units added to the photograph's principal tall window towers.
for F, nm, settings in (
    (RIGHT, "right", [(9.0, 2), (18.0, 4)]),
    (LEFT, "left", [(8.0, 3)]),
    (REAR, "rear", [(7.6, 1), (22.4, 3)]),
):
    for i, (u, f) in enumerate(settings):
        ac_unit(F, u, LEVELS[f]+.58, f, f"{nm}_ac_{i}")

begin("rear_electrical_service_route", "PIPE", -1, .22)
REAR.rod("vertical_conduit", (28.25, -.09, .8),
         (28.25, -.09, 7.6), .016, "metal")
REAR.rod("horizontal_conduit", (20.0, -.09, 7.6),
         (28.25, -.09, 7.6), .016, "metal")
REAR.box("service_box", 28.25, -.16, 1.35,
         .46, .25, .64, "metal")

# Small, unlabelled entrance notice boards; no invented institutional name.
for side in (-1, 1):
    begin(f"entrance_notice_board_{side}", "OTHER", 0, .54)
    box("notice_board", (side*6.49, 2.23, 2.85),
        (.045, 1.05, .68), "metal")


# ---------------------------------------------------------------------------
# Localized weathering geometry
# ---------------------------------------------------------------------------

# Narrow surface cracks, shallow streaks and damp edge patches.
# These are restrained: functioning building, not ruin.
begin("front_localized_weathering", "DECORATION", 3, .53,
      "weathering locations approximate visible staining")
for x, top, length in [
    (-13.8, LEVELS[4]+.05, 1.1),
    (13.5, LEVELS[3]+.85, 1.4),
    (12.7, LEVELS[4]+.86, .9),
    (-9.9, WING_ROOF+.80, .7),
    (9.2, canopy_top+.30, 1.15),
]:
    for j in range(4):
        FRONT.box("thin_mildew_streak",
                  x+(j-1.5)*.075, -.012, top-length/2,
                  .020+.012*(j % 2), .008, length*(.72+.08*j), "grime")

for x, z in [(-11.15, 6.6), (10.8, 11.1), (14.6, 16.8)]:
    p = [(x, -.016, z),
         (x+.05, -.017, z-.20),
         (x+.015, -.016, z-.39),
         (x+.10, -.017, z-.62)]
    for a, b in zip(p[:-1], p[1:]):
        rod("hairline_plaster_crack", a, b, .0035, "grime", 6)

begin("site_weathering", "GROUND", -1, .30)
for x, y, length in [(-11, -4, 2.5), (10, -3.5, 1.7),
                     (16.6, 8, 3.0), (-16.5, 16, 2.0)]:
    pts = [(x, y, .001), (x+.42, y+.30*length, .003),
           (x+.29, y+.61*length, .002), (x+.75, y+length, .001)]
    for a, b in zip(pts[:-1], pts[1:]):
        rod("paving_crack", a, b, .009, "grime", 6)
for x in (-15.25, 15.25):
    box("damp_plinth_edge", (x, 13, .008),
        (.16, 17.2, .016), "moss")


# ---------------------------------------------------------------------------
# Surface sampling into semantic point clouds
# ---------------------------------------------------------------------------

# Higher densities for features than broad planar structure.
DENSITY_MULT = {
    "WINDOW": 2.5,
    "DOOR": 2.4,
    "COLUMN": 1.7,
    "DECORATION": 2.6,
    "RAILING": 3.2,
    "PIPE": 2.6,
    "AC_UNIT": 3.0,
    "ARCH": 2.0,
    "BALCONY": 1.4,
    "STAIR": 1.5,
    "ROOF": .80,
    "GROUND": .50,
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


# The global cap is applied consistently, rather than truncating later floors.
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

# At least one point per triangle; if the requested cap is too small for this,
# preserve geometric coverage and report the actual count.
available = max(0, ARGS.max_points-triangle_total)
density_scale = min(1.0, available/max(weighted_total, 1))
effective_spacing = ARGS.spacing/math.sqrt(max(density_scale, 1e-8))

print("Source objects:", len(SOURCE_OBJECTS))
print("Logical elements:", len(ELEMENTS))
print("Estimated density scale:", density_scale)


def weather_colors(xyz, normals, mat_key, floor):
    """Deterministic spatial aging baked into each point's RGB."""
    base = np.array(PALETTE[mat_key], np.float32)
    n = len(xyz)
    rgb = np.broadcast_to(base, (n, 3)).copy()
    x, y, z = xyz.T

    if mat_key in {"glass", "dark"}:
        variation = .94+.065*np.sin(x*1.7+y*.4+z*.65)
        rgb *= variation[:, None]
        return np.clip(rgb, 0, 1)

    if mat_key in {"metal", "frame", "pipe", "ac"}:
        variation = .91+.055*np.sin(x*4.2+y*3.1+z*2.4)
        rgb *= variation[:, None]
        return np.clip(rgb, 0, 1)

    broad = (
        .035*np.sin(x*.61+y*.38+z*.21)
        + .028*np.sin(x*1.73-y*.49+z*.63)
        + .018*np.sin(x*7.3+y*5.7+z*3.1)
    )
    micro = RNG.normal(0, .012, n).astype(np.float32)
    variation = .96+broad+micro

    # Repeated localized drip paths instead of uniform dirt.
    streak = np.maximum(
        0, np.sin(x*5.17+y*4.11)+.40*np.sin(x*13.1-y*8.3)-.76)
    streak = np.minimum(streak, 1.0)

    ledge_stain = np.zeros(n, np.float32)
    for ledge in LEVELS[1:] + [canopy_top+.82, WING_ROOF+.88,
                               CENTRAL_ROOF+.86]:
        dz = ledge-z
        ledge_stain = np.maximum(
            ledge_stain,
            np.where((dz > 0) & (dz < 1.6),
                     np.exp(-np.maximum(dz, 0)/.47), 0).astype(np.float32))

    vertical = np.clip(1-np.abs(normals[:, 2]), 0, 1)
    variation -= .29*streak*ledge_stain*vertical

    # Dirt at horizontal undersides and dusty upward-facing ledges.
    variation -= .075*np.maximum(-normals[:, 2], 0)
    variation -= .035*np.maximum(normals[:, 2], 0)

    near_ground = np.exp(-np.maximum(z, 0)/.36)
    variation -= .12*near_ground
    rgb *= np.clip(variation, .45, 1.1)[:, None]

    # Modest greenish damp tint near the base and selected runoff paths.
    damp = np.clip(near_ground*.22+streak*ledge_stain*.065, 0, .24)
    rgb[:, 0] *= 1-damp
    rgb[:, 2] *= 1-damp*.7
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

    obj = bpy.data.objects.new(
        f'PC_{e["object_id"]:05d}_{e["name"]}', mesh)
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


# Collect contiguous surface samples by logical architectural element.
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

    # Add all actual primitive vertices as edge/corner anchors.
    # These help preserve fine frame corners and small inset geometry.
    edge_xyz = tris.reshape(-1, 3).astype(np.float32)
    edge_norm = np.repeat(normals, 3, axis=0).astype(np.float32)
    # Corner anchors are limited to detailed semantic classes.
    if e["class"] in {"WINDOW", "DOOR", "ARCH", "DECORATION",
                      "RAILING", "PIPE", "AC_UNIT"}:
        xyz = np.concatenate((xyz, edge_xyz))
        norm = np.concatenate((norm, edge_norm))

    rgb = weather_colors(xyz, norm, obj["material_key"], e["floor_id"])
    n = len(xyz)
    local_spacing = 1/math.sqrt(max(density*density_scale, 1e-6))
    # Radius is only a display attribute; canonical XYZ is unchanged.
    radius = min(.065, max(.009, local_spacing*.61))
    if e["class"] in {"RAILING", "PIPE", "AC_UNIT"}:
        radius = min(radius, .023)

    element_samples[eid].append((
        xyz, norm, rgb,
        np.full(n, obj["material_id"], np.int32),
        np.full(n, radius, np.float32)
    ))

# Free the triangle cache before creating the final mesh datablocks.
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
# PLY export and semantic manifest
# ---------------------------------------------------------------------------

if not ARGS.no_ply:
    path = os.path.join(OUT, "building_semantic.ply")
    header = f"""ply
format binary_little_endian 1.0
comment Photograph-informed reconstruction; not a measured survey
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
    "title": "Single-photograph institutional building reconstruction",
    "units": "metres",
    "coordinate_system": {"front": "-Y", "up": "+Z"},
    "reference_count": 1,
    "survey_verified": False,
    "estimated_dimensions": {
        "width": WIDTH,
        "depth": DEPTH,
        "floor_to_floor": H,
        "plinth_elevation": BASE,
        "wing_roof_elevation": WING_ROOF,
        "central_roof_elevation": CENTRAL_ROOF,
    },
    "floor_interpretation": "Ground plus five upper levels, inferred",
    "floor_elevations": LEVELS,
    "classes": CLASS_ID,
    "floors": FLOOR_NAMES,
    "materials": MATERIAL_ID,
    "point_count": TOTAL_POINTS,
    "requested_spacing_m": ARGS.spacing,
    "effective_base_spacing_m": effective_spacing,
    "point_cap_note": (
        "Density target; mandatory triangle coverage and detailed corner "
        "anchors can increase the final total above the requested cap."
    ),
    "confidence_note": (
        "Heuristic evidence confidence only; not a probability or metric "
        "accuracy estimate. No surveyed dimensions or camera calibration."
    ),
    "major_assumptions": [
        "Approximately 30 m wide and 24 m deep.",
        "Six occupied levels inferred from facade and floor rhythms.",
        "Central entrance treated as a double-height covered approach.",
        "Hidden side windows continue the front window/frame vocabulary.",
        "Rear facade uses regular bays, without copying the monumental entry.",
        "Internal RC grid, corridor and stair location are conservative inferences.",
        "Roof stair enclosure is functional inference, not directly observed.",
        "AC placement is sparse and inferred on secondary elevations.",
        "Circular foreground platform extent is low-confidence.",
        "No institution name, signage text, roof tanks or pitched roof invented.",
    ],
    "limitations": [
        "Not a laser scan or photogrammetric solve.",
        "Rear, roof and interior layout cannot be verified from one image.",
        "Tall multi-level facade assemblies use a primary floor ID.",
        "Point samples include constituent surfaces and concealed interfaces.",
        "Weathering is procedural approximation, not photograph-projected texture.",
    ],
    "elements": [
        {k: v for k, v in e.items() if k != "parts"}
        for e in ELEMENTS.values()
    ],
}
with open(os.path.join(OUT, "building_manifest.json"), "w", encoding="utf8") as f:
    json.dump(manifest, f, indent=2)


# ---------------------------------------------------------------------------
# Presentation, cameras and embedded editing instructions
# ---------------------------------------------------------------------------

def move_to_collection(obj, target):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    target.objects.link(obj)


def camera(name, position, target, lens=40):
    data = bpy.data.cameras.new(name)
    data.lens = lens
    data.clip_start = .08
    data.clip_end = 500
    obj = bpy.data.objects.new(name, data)
    PRESENTATION.objects.link(obj)
    obj.location = position
    obj.rotation_euler = (
        Vector(target)-Vector(position)).to_track_quat("-Z", "Y").to_euler()
    return obj


cam_overview = camera("CAM_front_right_overview",
                      (37, -48, 27), (0, 8, 10.4), 43)
camera("CAM_reference_like_low_front",
       (-1.6, -24, 2.0), (0, .9, 12.7), 23)
camera("CAM_front_left", (-37, -44, 20), (0, 8, 10.5), 42)
camera("CAM_rear", (0, 61, 16), (0, 16, 11), 43)
camera("CAM_rear_left", (-36, 51, 25), (0, 13, 11), 42)
camera("CAM_roof", (34, -14, 49), (0, 11, 12), 45)
camera("CAM_entrance", (0, -9, 2.1), (0, 4.6, 4.0), 24)
scene.camera = cam_overview

world = bpy.data.worlds.new("soft_daylight_world")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (
    .64, .72, .82, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = .55
scene.world = world

sun_data = bpy.data.lights.new("warm_soft_sun", "SUN")
sun_data.energy = 2.1
sun_data.angle = math.radians(12)
sun = bpy.data.objects.new("warm_soft_sun", sun_data)
PRESENTATION.objects.link(sun)
sun.rotation_euler = (math.radians(28), math.radians(-24), math.radians(-30))

area_data = bpy.data.lights.new("sky_fill", "AREA")
area_data.energy = 2200
area_data.shape = "DISK"
area_data.size = 22
area = bpy.data.objects.new("sky_fill", area_data)
PRESENTATION.objects.link(area)
area.location = (2, -14, 25)
area.rotation_euler = (
    Vector((0, 4, 10))-area.location).to_track_quat("-Z", "Y").to_euler()

scene.render.engine = "CYCLES"
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.render.resolution_x = 1600
scene.render.resolution_y = 1400
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = os.path.join(OUT, "point_cloud_preview.png")
scene.view_settings.view_transform = "AgX"

# Save points as the primary representation.
SRC.hide_render = True
SRC.hide_viewport = True
PTS.hide_render = False
PTS.hide_viewport = False

readme = bpy.data.texts.new("README_RECONSTRUCTION.txt")
readme.write(f"""
PHOTOGRAPH-INFORMED BUILDING RECONSTRUCTION
=========================================

This file is an editable architectural interpretation of one photograph.
It is not a surveyed or verified digital twin.

MODEL
-----
Approximate width: {WIDTH:.2f} m
Approximate depth: {DEPTH:.2f} m
Floor spacing: {H:.2f} m
Interpretation: ground plus five upper levels
Front faces -Y.

REPRESENTATIONS
---------------
BUILDING / SEMANTIC_POINTS
    Primary saved representation.
    One editable vertex-only mesh per logical architectural element.
    Geometry Nodes creates native renderable points without changing
    canonical vertex XYZ.

BUILDING / SOURCE_SURFACES
    Hidden source architecture.
    Thick walls, window openings/recesses, slabs, stairs, curved arches,
    cylindrical columns, roof and service details.
    Enable this collection and hide SEMANTIC_POINTS for surface editing.

Both representations are organized by floor and semantic class.

POINT ATTRIBUTES
----------------
rgb                Linear RGBA
surface_normal     XYZ source-surface normal
intensity          Linear luminance; synthetic, not scanner return intensity
classification     Integer semantic class
element_type       Same class code, provided explicitly
object_id          Logical architectural element identifier
floor_id           Primary floor; tall assemblies can span multiple levels
material_id        Material palette identifier
confidence         Heuristic evidence confidence
observed_layout    Layout evidence flag, NOT a metric-accuracy claim
radius             Visualization radius in metres

EDITING
-------
Select a PC_* object to transform an entire logical element.
Enter Edit Mode to edit individual XYZ vertices.
The Spreadsheet editor exposes all point attributes.
Disable "Native point display" to inspect raw mesh vertices.
Hide floor/class collections to isolate subsets.

Source and point geometry are snapshots, not automatically synchronized.
If source geometry is substantially edited, rerun sampling/generation.
Object transforms rotate geometry normally; after manually baking such
transforms, update stored normal attributes if exporting independently.

UNCERTAINTY
-----------
Front layout is prioritized.
Scale, exact floor assignment, depth and hidden elevations are inferred.
Rear architecture deliberately avoids a second monumental entrance.
Interior partitions and stair location are low-confidence functional inference.
Roof details and services are restrained.
Weathering is procedurally generated, not image-projected.

POINT COUNT
-----------
{TOTAL_POINTS:,}

EXPORT
------
building_semantic.ply contains XYZ, sRGB, normals, synthetic intensity,
classification, object ID, floor ID, element type, material ID, confidence.
building_manifest.json defines labels and assumptions.

No institutional name or unreadable signage text has been invented.
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
    prefix = "PC_" if points else ""
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
            # Blender may suffix duplicate collection names.
            visible = class_name is None or cls.name.split(".")[0] == class_name
            cls.hide_viewport = not visible
            cls.hide_render = not visible
''')

# Embed this generation script when running from a real file.
try:
    with open(os.path.realpath(__file__), "r", encoding="utf8") as f:
        text = bpy.data.texts.new("reconstruct_building.py")
        text.write(f.read())
except Exception:
    pass

# Useful initial viewport.
for screen in bpy.data.screens:
    for ar in screen.areas:
        if ar.type == "VIEW_3D":
            ar.spaces.active.clip_end = 500
            ar.spaces.active.shading.type = "MATERIAL"
            ar.spaces.active.region_3d.view_distance = 48
            ar.spaces.active.region_3d.view_location = Vector((0, 8, 10))

bpy.ops.object.select_all(action="DESELECT")
blend_path = os.path.join(OUT, "institutional_reconstruction.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

if ARGS.render:
    bpy.ops.render.render(write_still=True)

print("\\nCompleted.")
print("BLEND:", blend_path)
print("Manifest:", os.path.join(OUT, "building_manifest.json"))
if not ARGS.no_ply:
    print("PLY:", os.path.join(OUT, "building_semantic.ply"))
print("Semantic point count:", f"{TOTAL_POINTS:,}")