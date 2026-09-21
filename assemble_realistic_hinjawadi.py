"""
Master Orchestration: Realistic Hinjawadi Phase 1 Digital Twin & Hybrid Workflow
Blender 5.2+ LTS

Executes:
1. Landmark Architectural Customization (Dassault Red Fort, Wipro, Tata Tech, Birlasoft, HCL, etc.)
2. Real Environment (Nishita Physical Sky, Pune Sun, AgX Color, Volumetric Haze)
3. Topographic Terrain with High-Res Satellite Ortho (Mula river depression, rolling contours)
4. Pune Metro Line 3 Elevated Viaduct (piers, caps, double-track guideway)
5. Native Landscaping & Vegetation Prototypes
6. PBR Architectural Glass, Cladding, and Asphalt Road Materials
7. High-Resolution Verification Renders (Overview, Metro Corridor, Campus Context)
"""

import json
import math
from pathlib import Path
import sys
import bpy
from mathutils import Vector, Matrix

# Ensure immediate unbuffered console logs
try:
    sys.stdout.reconfigure(line_buffering=True)
except Exception:
    pass

WORKSPACE = Path(r"C:\Users\Dhairyashil\website")
if str(WORKSPACE) not in sys.path:
    sys.path.insert(0, str(WORKSPACE))

BLEND_PATH = WORKSPACE / "hinjawadi_output" / "hinjawadi_offices_refined.blend"
PROFILES_PATH = WORKSPACE / "office_profiles.json"
OUTPUT_DIR = WORKSPACE / "hinjawadi_output"

def apply_landmark_profiles():
    print("Applying landmark architectural profiles from office_profiles.json...")
    if not PROFILES_PATH.exists():
        print("No office_profiles.json found.")
        return

    profiles = json.loads(PROFILES_PATH.read_text(encoding="utf-8"))
    applied = 0

    # Map OSM IDs to scene objects
    for osm_id, p in profiles.items():
        # Find objects matching this OSM ID
        clean_id = osm_id.replace("/", "_")
        tag = osm_id.split("/")[-1]
        matching = [
            o for o in bpy.data.objects
            if (clean_id in o.name or f"_{tag}_" in o.name or o.name.endswith(f"_{tag}"))
            and o.type == "MESH"
        ]

        if not matching:
            continue

        print(f"Applying profile to {osm_id}: {p.get('sources', [''])[0]} ({len(matching)} objects)")

        # Create or update dedicated PBR materials for this landmark
        mat_cladding_name = f"M_LANDMARK_{clean_id}_Cladding"
        mat_glass_name = f"M_LANDMARK_{clean_id}_Glass"

        mat_cladding = bpy.data.materials.get(mat_cladding_name) or bpy.data.materials.new(mat_cladding_name)
        mat_cladding.use_nodes = True
        bsdf_c = mat_cladding.node_tree.nodes.get("Principled BSDF")
        if bsdf_c and "cladding_rgb" in p:
            rgb = p["cladding_rgb"]
            bsdf_c.inputs["Base Color"].default_value = (*rgb, 1.0)
            is_metallic = any("acp" in s.lower() or "silver" in s.lower() or "aluminum" in s.lower() for s in p.get("reference_notes", "").split())
            bsdf_c.inputs["Metallic"].default_value = 0.55 if is_metallic else 0.05
            bsdf_c.inputs["Roughness"].default_value = 0.38 if is_metallic else 0.65

        mat_glass = bpy.data.materials.get(mat_glass_name) or bpy.data.materials.new(mat_glass_name)
        mat_glass.use_nodes = True
        bsdf_g = mat_glass.node_tree.nodes.get("Principled BSDF")
        if bsdf_g and "glass_rgb" in p:
            rgb = p["glass_rgb"]
            bsdf_g.inputs["Base Color"].default_value = (*rgb, 1.0)
            bsdf_g.inputs["Roughness"].default_value = 0.035
            bsdf_g.inputs["IOR"].default_value = 1.52
            if "Transmission Weight" in bsdf_g.inputs:
                bsdf_g.inputs["Transmission Weight"].default_value = 0.25

        # Assign to objects
        for obj in matching:
            if "glass" in obj.name.lower() or "glazing" in obj.name.lower():
                if obj.data.materials:
                    obj.data.materials[0] = mat_glass
                else:
                    obj.data.materials.append(mat_glass)
            else:
                if obj.data.materials:
                    obj.data.materials[0] = mat_cladding
                else:
                    obj.data.materials.append(mat_cladding)

        applied += 1

    print(f"Applied custom architectural profiles to {applied} landmark campuses.")


def setup_verification_cameras(scene):
    print("Setting up cinematic verification cameras...")
    cam_col = bpy.data.collections.get("00_Cinematic_Cameras")
    if not cam_col:
        cam_col = bpy.data.collections.new("00_Cinematic_Cameras")
        scene.collection.children.link(cam_col)

    cameras_def = [
        {
            "name": "Cam_Aerial_Overview",
            "loc": (-350.0, -1450.0, 420.0),
            "rot": (math.radians(64.0), 0.0, math.radians(18.0)),
            "lens": 32.0,
            "clip_end": 8000.0,
            "filename": "aerial_overview.png"
        },
        {
            "name": "Cam_Metro_Spine",
            "loc": (-65.0, 360.0, 14.5),
            "rot": (math.radians(82.0), 0.0, math.radians(-142.0)),
            "lens": 28.0,
            "clip_end": 5000.0,
            "filename": "metro_spine_view.png"
        },
        {
            "name": "Cam_PCCRC_And_Campuses",
            "loc": (-210.0, -890.0, 68.0),
            "rot": (math.radians(72.0), 0.0, math.radians(35.0)),
            "lens": 42.0,
            "clip_end": 6000.0,
            "filename": "pccrc_and_campuses.png"
        }
    ]

    created = []
    for cdef in cameras_def:
        cam_obj = bpy.data.objects.get(cdef["name"])
        if not cam_obj:
            cam_data = bpy.data.cameras.new(cdef["name"])
            cam_obj = bpy.data.objects.new(cdef["name"], cam_data)
            cam_col.objects.link(cam_obj)

        cam_obj.location = cdef["loc"]
        cam_obj.rotation_euler = cdef["rot"]
        cam_obj.data.lens = cdef["lens"]
        cam_obj.data.clip_end = cdef["clip_end"]
        created.append((cam_obj, cdef["filename"]))

    return created


def render_verification(scene, cam_tuples):
    print("Rendering verification frames...")
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100

    # Ensure EEVEE Next has ambient occlusion and screen space raytracing enabled
    if hasattr(scene.eevee, "use_raytracing"):
        scene.eevee.use_raytracing = True
    if hasattr(scene.eevee, "use_gtao"):
        scene.eevee.use_gtao = True

    for cam_obj, filename in cam_tuples:
        scene.camera = cam_obj
        out_path = OUTPUT_DIR / filename
        scene.render.filepath = str(out_path)
        print(f"Rendering {filename} from {cam_obj.name}...")
        bpy.ops.render.render(write_still=True)
        print(f"Saved render: {out_path} ({out_path.stat().st_size:,} bytes)")


def main():
    if not bpy.data.filepath or Path(bpy.data.filepath).resolve() != BLEND_PATH.resolve():
        print(f"Loading {BLEND_PATH}...")
        bpy.ops.wm.open_mainfile(filepath=str(BLEND_PATH))
    else:
        print(f"File already loaded: {bpy.data.filepath}")
    
    scene = bpy.context.scene

    # 1. Environment & Atmosphere (Pillar 1)
    import build_hinjawadi_environment
    build_hinjawadi_environment.setup_nishita_sky_and_lighting(scene)
    build_hinjawadi_environment.setup_photorealistic_terrain(scene)
    build_hinjawadi_environment.build_pune_metro_line_3(scene)
    build_hinjawadi_environment.add_realistic_native_vegetation(scene)

    # 2. Real Buildings & Landmark Profiles (Pillar 2)
    apply_landmark_profiles()

    # 3. PBR Material Upgrades across all objects
    import upgrade_hinjawadi_pbr_materials
    upgrade_hinjawadi_pbr_materials.upgrade_glass_materials()
    upgrade_hinjawadi_pbr_materials.upgrade_cladding_and_facades()
    upgrade_hinjawadi_pbr_materials.upgrade_roofs_and_equipment()
    upgrade_hinjawadi_pbr_materials.upgrade_roads_and_infrastructure()

    # 4. Cameras and Renders
    cam_tuples = setup_verification_cameras(scene)

    # Save upgraded blend file
    print(f"Saving upgraded digital twin: {BLEND_PATH}...")
    bpy.ops.wm.save_mainfile(filepath=str(BLEND_PATH))
    print("Blend file saved successfully.")

    # Render verification views
    render_verification(scene, cam_tuples)
    print("All tasks completed successfully!")

if __name__ == "__main__":
    main()
