import hashlib
import json
import math
import shutil
from pathlib import Path

import unreal


# EDIT THESE:
INTERCHANGE = Path(r"D:\GIS\city_interchange")
LEVEL_PATH = "/Game/City/Hinjawadi"

# Set this to a verified accessible road/sidewalk location in ENU metres.
# None chooses a low-elevation imported road origin as a provisional start.
SPAWN_ENU_METRES = None

# Keep import-only first runs manageable if diagnosing the pipeline.
# 0 means import everything.
MAX_OBJECTS = 0


manifest = json.loads(
    (INTERCHANGE / "manifest.json").read_text(encoding="utf8")
)
objects = manifest["objects"]

asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
assets = unreal.EditorAssetLibrary
actors = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
levels = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
meshes = unreal.get_editor_subsystem(unreal.StaticMeshEditorSubsystem)

FEATURE_CLASS = unreal.load_class(
    None, "/Script/HinjawadiTwin.CityFeatureActor"
)
if not FEATURE_CLASS:
    raise RuntimeError("Compile the C++ project before running this importer.")

# Fail rather than overwrite a previously edited level.
if assets.does_asset_exist(LEVEL_PATH):
    raise RuntimeError(
        f"{LEVEL_PATH} already exists. Use another LEVEL_PATH or explicitly "
        "remove the generated level before rebuilding."
    )

template = "/Engine/Maps/Templates/OpenWorld"
if not assets.does_asset_exist(template):
    raise RuntimeError(
        "OpenWorld template asset not found. Create an Open World level "
        "manually and adapt the level-creation section for your UE version."
    )

if not levels.new_level_from_template(LEVEL_PATH, template):
    raise RuntimeError("Failed to create the World Partition template level.")


def import_fbx(relative_file, destination):
    task = unreal.AssetImportTask()
    task.set_editor_property("filename", str(INTERCHANGE / relative_file))
    task.set_editor_property("destination_path", destination)
    task.set_editor_property("automated", True)
    task.set_editor_property("replace_existing", True)
    task.set_editor_property("save", True)

    options = unreal.FbxImportUI()
    options.set_editor_property("import_mesh", True)
    options.set_editor_property("import_as_skeletal", False)
    options.set_editor_property("import_materials", False)
    options.set_editor_property("import_textures", False)
    options.set_editor_property("import_animations", False)
    options.set_editor_property(
        "mesh_type_to_import", unreal.FBXImportType.FBXIT_STATIC_MESH
    )
    options.set_editor_property("automated_import_should_detect_type", False)

    data = options.static_mesh_import_data
    data.set_editor_property("combine_meshes", True)
    data.set_editor_property("auto_generate_collision", False)
    data.set_editor_property("generate_lightmap_u_vs", False)
    data.set_editor_property("convert_scene", True)
    data.set_editor_property("convert_scene_unit", True)
    data.set_editor_property("force_front_x_axis", False)
    data.set_editor_property("transform_vertex_to_absolute", True)
    data.set_editor_property("bake_pivot_in_vertex", False)
    data.set_editor_property("import_uniform_scale", 1.0)

    task.set_editor_property("options", options)
    task.set_editor_property("factory", unreal.FbxFactory())

    asset_tools.import_asset_tasks([task])

    found = [
        unreal.load_asset(path)
        for path in task.get_editor_property("imported_object_paths")
    ]
    found = [obj for obj in found if isinstance(obj, unreal.StaticMesh)]

    if len(found) != 1:
        raise RuntimeError(
            f"Expected one static mesh from {relative_file}; got {len(found)}"
        )

    return found[0]


# --------------------------------------------------------------------------
# Measure import basis: Unreal cm per ENU metre
# --------------------------------------------------------------------------

centers = {}
for name, filename in manifest["calibration"].items():
    mesh = import_fbx(filename, "/Game/City/Calibration")
    origin = mesh.get_bounds().origin
    centers[name] = [origin.x, origin.y, origin.z]

base = centers["origin"]
basis = []

for name in ("east", "north", "up"):
    column = [
        (centers[name][i] - base[i]) / 10.0 for i in range(3)
    ]
    basis.append(column)

def dot(a, b):
    return sum(x*y for x, y in zip(a, b))

for column in basis:
    length = math.sqrt(dot(column, column))
    if abs(length - 100.0) > 0.5:
        raise RuntimeError(
            f"FBX scale calibration failed: {length} cm per metre"
        )

for i, j in ((0, 1), (0, 2), (1, 2)):
    if abs(dot(basis[i], basis[j])) > 1.0:
        raise RuntimeError("FBX basis is not orthogonal.")

if basis[2][2] < 99.5:
    raise RuntimeError(
        "Imported ENU up is not UE +Z. Fix FBX import settings first."
    )

if max(abs(v) for v in base) > 0.1:
    raise RuntimeError("Unexpected calibration origin shift.")

def enu_to_ue(position):
    return unreal.Vector(*[
        sum(position[j] * basis[j][i] for j in range(3))
        for i in range(3)
    ])


# --------------------------------------------------------------------------
# Materials: UE-native PBR values
# --------------------------------------------------------------------------

material_cache = {}

def make_material(record):
    key = hashlib.sha256(
        json.dumps(record, sort_keys=True).encode()
    ).hexdigest()[:16]

    if key in material_cache:
        return material_cache[key]

    name = "M_" + key
    path = "/Game/City/Materials/" + name

    if assets.does_asset_exist(path):
        mat = unreal.load_asset(path)
        material_cache[key] = mat
        return mat

    mat = asset_tools.create_asset(
        name, "/Game/City/Materials",
        unreal.Material, unreal.MaterialFactoryNew()
    )

    lib = unreal.MaterialEditingLibrary

    color = lib.create_material_expression(
        mat, unreal.MaterialExpressionConstant3Vector, -350, 0
    )
    rgb = record.get("color", [0.5, 0.5, 0.5])
    color.set_editor_property(
        "constant", unreal.LinearColor(*rgb, 1.0)
    )
    lib.connect_material_property(
        color, "", unreal.MaterialProperty.MP_BASE_COLOR
    )

    for field, prop, y in [
        ("roughness", unreal.MaterialProperty.MP_ROUGHNESS, 120),
        ("metallic", unreal.MaterialProperty.MP_METALLIC, 230),
    ]:
        value = lib.create_material_expression(
            mat, unreal.MaterialExpressionConstant, -350, y
        )
        value.set_editor_property("r", float(record.get(field, 0.0)))
        lib.connect_material_property(value, "", prop)

    # The generated glazing is deliberately opaque reflective glazing.
    # It does not pretend that interiors exist behind the shell.
    lib.recompile_material(mat)
    assets.save_loaded_asset(mat)

    material_cache[key] = mat
    return mat


# --------------------------------------------------------------------------
# Geometry and metadata
# --------------------------------------------------------------------------

collision_categories = {"Buildings", "Ground", "Roads", "Sidewalks"}
nanite_categories = {"Buildings"}
spawn_candidates = []
import_report = []

records = objects[:MAX_OBJECTS] if MAX_OBJECTS else objects

with unreal.ScopedSlowTask(len(records), "Importing Hinjawadi city") as progress:
    progress.make_dialog(True)

    for record in records:
        if progress.should_cancel():
            raise RuntimeError(
                "Import cancelled. Partial level has not been finalized."
            )

        progress.enter_progress_frame(1, record["source_object"])

        tile = record["tile"]
        tile_name = f"Tile_{tile[0]:+04d}_{tile[1]:+04d}"
        destination = f"/Game/City/Meshes/{tile_name}"

        mesh = import_fbx(record["file"], destination)

        for index, material in enumerate(record["materials"]):
            mesh.set_material(index, make_material(material))

        category = record["category"]

        if category in collision_categories:
            body = mesh.get_editor_property("body_setup")
            if body is None:
                raise RuntimeError(
                    f"No BodySetup on collision mesh: {mesh.get_name()}"
                )
            body.set_editor_property(
                "collision_trace_flag",
                unreal.CollisionTraceFlag.CTF_USE_COMPLEX_AS_SIMPLE
            )

        # Nanite applies to original shell assets only.
        # Tiny glazing/frame details should not automatically become Nanite.
        if category in nanite_categories:
            settings = meshes.get_nanite_settings(mesh)
            settings.set_editor_property("enabled", True)
            meshes.set_nanite_settings(mesh, settings, True)

        location = enu_to_ue(record["enu_origin_m"])
        actor = actors.spawn_actor_from_class(
            FEATURE_CLASS, location, unreal.Rotator(0, 0, 0)
        )
        actor.set_actor_label(record["source_object"])
        actor.set_folder_path(
            unreal.Name(f"City/{tile_name}/{category}")
        )

        component = actor.get_editor_property("mesh")
        component.set_static_mesh(mesh)

        if category in collision_categories:
            component.set_collision_enabled(
                unreal.CollisionEnabled.QUERY_AND_PHYSICS
            )
            component.set_collision_response_to_all_channels(
                unreal.CollisionResponse.BLOCK
            )
        else:
            component.set_collision_enabled(
                unreal.CollisionEnabled.NO_COLLISION
            )

        # Distance culling for small decorative objects, never building shells.
        if category in {"Street_Furniture", "Roof_Equipment"}:
            component.set_cull_distance(90000.0)
        elif category == "Vegetation":
            component.set_cull_distance(180000.0)

        properties = dict(record["properties"])
        properties["ue_asset"] = mesh.get_path_name()
        properties["source_object"] = record["source_object"]
        properties["source_tile"] = tile
        properties["coordinate_frame"] = "Original local ENU metres"
        properties["georeference_file"] = "CityData/georeference.json"

        actor.set_editor_property("feature_id", record["uid"])
        actor.set_editor_property("building_id", record["building_id"])
        actor.set_editor_property("display_name", record["name"])
        actor.set_editor_property("category", category)
        actor.set_editor_property(
            "attributes_json",
            json.dumps(properties, ensure_ascii=False)
        )
        actor.set_editor_property(
            "enu_origin_metres",
            unreal.Vector(*record["enu_origin_m"])
        )
        actor.set_editor_property(
            "is_building_shell", category == "Buildings"
        )

        # The Open World template supplies World Partition.
        # Imported features participate in spatial streaming.
        actor.set_editor_property("is_spatially_loaded", True)

        assets.set_metadata_tag(
            mesh, "SourceObject", record["source_object"]
        )
        assets.set_metadata_tag(
            mesh, "OSM_ID", str(properties.get("osm_id", ""))
        )
        assets.set_metadata_tag(
            mesh, "BuildingId", record["building_id"]
        )

        if category == "Roads" and record["enu_origin_m"][2] < 1:
            spawn_candidates.append(record["enu_origin_m"])

        assets.save_loaded_asset(mesh)

        import_report.append({
            "feature_id": record["uid"],
            "source_object": record["source_object"],
            "asset": mesh.get_path_name(),
            "building_id": record["building_id"],
            "tile": tile,
            "enu_origin_m": record["enu_origin_m"],
            "ue_location_cm": [location.x, location.y, location.z],
        })


# --------------------------------------------------------------------------
# Lighting: use template actors where available
# --------------------------------------------------------------------------

all_actors = actors.get_all_level_actors()

def ensure_actor(cls, label):
    existing = next(
        (a for a in all_actors if isinstance(a, cls)), None
    )
    if existing:
        return existing
    actor = actors.spawn_actor_from_class(cls, unreal.Vector(0, 0, 0))
    actor.set_actor_label(label)
    return actor

sun = ensure_actor(unreal.DirectionalLight, "City_Sun")
sun.set_actor_rotation(unreal.Rotator(-38, -25, 0), False)
sun_component = sun.get_component_by_class(unreal.DirectionalLightComponent)
sun_component.set_mobility(unreal.ComponentMobility.MOVABLE)
sun_component.set_editor_property("intensity", 70000.0)
sun_component.set_editor_property("atmosphere_sun_light", True)

sky = ensure_actor(unreal.SkyLight, "City_SkyLight")
sky_component = sky.get_component_by_class(unreal.SkyLightComponent)
sky_component.set_mobility(unreal.ComponentMobility.MOVABLE)
sky_component.set_editor_property("real_time_capture", True)

ensure_actor(unreal.SkyAtmosphere, "City_Atmosphere")
ensure_actor(unreal.ExponentialHeightFog, "City_Fog")

post = ensure_actor(unreal.PostProcessVolume, "City_PostProcess")
post.set_editor_property("unbound", True)

settings = post.get_editor_property("settings")
settings.set_editor_property("override_auto_exposure_min_brightness", True)
settings.set_editor_property("override_auto_exposure_max_brightness", True)
settings.set_editor_property("auto_exposure_min_brightness", 1.0)
settings.set_editor_property("auto_exposure_max_brightness", 1.0)
post.set_editor_property("settings", settings)

# Exposure is a starting point, not calibrated photography.
# Check whether your project uses EV100-extended exposure settings.


# --------------------------------------------------------------------------
# Player start
# --------------------------------------------------------------------------

if SPAWN_ENU_METRES is not None:
    spawn_enu = list(SPAWN_ENU_METRES)
elif spawn_candidates:
    spawn_enu = list(min(
        spawn_candidates, key=lambda p: p[0]*p[0] + p[1]*p[1]
    ))
else:
    spawn_enu = [0, 0, 0]

# Provisional start is above ground so the character can settle.
# Verify it does not overlap buildings/vegetation before packaging.
spawn_enu[2] += 2.5

existing_starts = [
    a for a in actors.get_all_level_actors()
    if isinstance(a, unreal.PlayerStart)
]
for actor in existing_starts:
    actors.destroy_actor(actor)

start = actors.spawn_actor_from_class(
    unreal.PlayerStart, enu_to_ue(spawn_enu)
)
start.set_actor_label("City_PlayerStart_Verify_Clearance")
start.set_editor_property("is_spatially_loaded", False)


# --------------------------------------------------------------------------
# Runtime GIS data and import report
# --------------------------------------------------------------------------

city_data = Path(unreal.Paths.project_content_dir()) / "CityData"
city_data.mkdir(parents=True, exist_ok=True)

for filename in [
    "building_index.json", "georeference.json",
    "ATTRIBUTION.txt", "warnings.txt", "generation_report.json",
]:
    source = INTERCHANGE / filename
    if source.exists():
        shutil.copy2(source, city_data / filename)

(city_data / "ue_coordinate_basis.json").write_text(
    json.dumps({
        "basis_columns_cm_per_enu_m": basis,
        "interpretation":
            "UE_cm = EastColumn*east_m + NorthColumn*north_m "
            "+ UpColumn*up_m",
        "georeference": manifest["georeference"],
    }, indent=2),
    encoding="utf8"
)

(city_data / "import_report.json").write_text(
    json.dumps({
        "level": LEVEL_PATH,
        "world_partition_source": template,
        "object_count": len(import_report),
        "partial_import": bool(MAX_OBJECTS),
        "terrain_status": manifest["terrain_status"],
        "road_source_hashes": manifest["road_source_hashes"],
        "objects": import_report,
    }, indent=2, ensure_ascii=False),
    encoding="utf8"
)

# Keep the complete original interchange metadata outside individual actors too.
shutil.copy2(INTERCHANGE / "manifest.json", city_data / "manifest.json")

levels.save_current_level()
unreal.EditorLoadingAndSavingUtils.save_dirty_packages(True, True)

unreal.log("Hinjawadi import complete.")
unreal.log("Verify PlayerStart clearance, exposure, streaming and map selection.")
