import math

def generate_atrium_code():
    return '''# ---------------------------------------------------------------------
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
    \"\"\"
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
    \"\"\"
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
'''
