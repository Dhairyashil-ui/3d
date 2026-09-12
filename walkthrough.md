# Walkthrough: Hinjawadi Office Refinement & UE5 Tile Re-export

We have completed the incremental procedural refinement of the 294 office-style buildings in Hinjawadi, verified road and footprint integrity, and assigned all detail objects to their respective spatial tiles for Unreal Engine 5 export.

---

## 1. Summary of Actions Completed

### A. Profiles Configuration
- Created [office_profiles.json](file:///c:/Users/Dhairyashil/website/office_profiles.json), initialized as `{}`.
- Supports user-supplied reference profiles keyed by OSM IDs (`way/...` or `relation/...`) from `buildings.json` with parameters:
  - `cladding_rgb`, `glass_rgb`, `bay_width_m`, `window_fraction`, `horizontal_bands`
  - `entrance_direction`, `balcony_direction`, `balcony_floors`, `balcony_projection_m`, `rooftop_equipment`
  - `sources`, `reference_notes`

### B. Refinement Script Execution
- Saved [refine_hinjawadi_offices.py](file:///c:/Users/Dhairyashil/website/refine_hinjawadi_offices.py) incorporating the corrected rooftop equipment comment:
  > *"Rooftop equipment is intentionally placed above the existing roof, while the original building shell and its recorded height remain unchanged. Its extra height is recorded in the refinement metadata."*
- Executed refinement via Blender 5.2.1 LTS:
  ```powershell
  & "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" `
    hinjawadi_output/hinjawadi_phase1_editable.blend `
    --background `
    --python refine_hinjawadi_offices.py -- `
    --profiles office_profiles.json `
    --output hinjawadi_output/hinjawadi_offices_refined.blend
  ```
- **Integrity Check Results**:
  - Protected Road, Sidewalk, and Road Marking SHA-256 Signatures: **PASSED** (Road integrity check passed; 0 road objects modified).
  - Building Transform Signatures: **PASSED** (All 294 building transforms and massing heights preserved).
  - Procedural office candidates refined: **294**.
  - Generated report: [hinjawadi_offices_refined.refinement.json](file:///c:/Users/Dhairyashil/website/hinjawadi_output/hinjawadi_offices_refined.refinement.json).

### C. UE5 Spatial Tile Assignment & Re-export
- Implemented [reexport_hinjawadi_ue5.py](file:///c:/Users/Dhairyashil/website/reexport_hinjawadi_ue5.py) to resolve the UE5 implications:
  - Iterated through all 294 objects in `OFFICE_REFINE_Details`.
  - Mapped each detail mesh to its parent building and linked it under that building's export tile collection (`Tile_XXX_YYY_Office_Refinement`).
  - Saved the assigned tile collections inside [hinjawadi_offices_refined.blend](file:///c:/Users/Dhairyashil/website/hinjawadi_output/hinjawadi_offices_refined.blend).
  - Re-exported all 39 affected spatial tiles into [hinjawadi_output/ue5_fbx](file:///c:/Users/Dhairyashil/website/hinjawadi_output/ue5_fbx) with the new detail geometry and refined materials while leaving the existing road assets completely untouched.
  - Excluded hidden original placeholder glazing to avoid z-fighting.
  - Updated [hinjawadi_output/export_manifest.json](file:///c:/Users/Dhairyashil/website/hinjawadi_output/export_manifest.json) recording the updated object counts and `refined_office_count` per tile.

---

## 2. Verification Results

| Metric | Result |
| :--- | :--- |
| **Total Buildings in Dataset** | 2,605 |
| **Office-style Buildings Identified** | 294 |
| **Refined Office Detail Objects Created** | 294 |
| **Road Integrity Check** | Passed (Protected SHA-256 unchanged) |
| **Building Transform Check** | Passed (Locations, footprints, heights preserved) |
| **Total UE5 Export Tiles in Manifest** | 48 |
| **Spatial Tiles Re-exported with Refinements** | 39 |
| **Total Office Detail Objects Exported Across Tiles** | 294 |
| **Road Assets Status** | Untouched |

---

## 3. How to Supply Building-Specific Reference Profiles

To customize individual office buildings based on real-world photographic references or campus plans:

1. Locate the OSM identifier in `hinjawadi_output/buildings.json` (e.g. `"relation/5354432"` for Dassault Systèmes Red Fort).
2. Add an entry to [office_profiles.json](file:///c:/Users/Dhairyashil/website/office_profiles.json):
   ```json
   {
     "relation/5354432": {
       "sources": ["https://example.com/red_fort_photo.jpg"],
       "reference_notes": "Red sandstone cladding, horizontal glazing bands, main entrance facing north",
       "cladding_rgb": [0.65, 0.28, 0.22],
       "glass_rgb": [0.08, 0.14, 0.16],
       "bay_width_m": 3.2,
       "window_fraction": 0.75,
       "horizontal_bands": true,
       "entrance_direction": "north",
       "rooftop_equipment": true
     }
   }
   ```
3. Re-run refinement:
   ```powershell
   & "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" `
     hinjawadi_output/hinjawadi_phase1_editable.blend `
     --background `
     --python refine_hinjawadi_offices.py -- `
     --profiles office_profiles.json `
     --output hinjawadi_output/hinjawadi_offices_refined.blend
   ```
4. Re-export to UE5 FBX tiles:
   ```powershell
   & "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" `
     hinjawadi_output/hinjawadi_offices_refined.blend `
     --background `
     --python reexport_hinjawadi_ue5.py -- --save-blend
   ```
