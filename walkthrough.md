# Walkthrough: Realistic Hinjawadi Phase 1 Digital Twin & Hybrid Workflow

We have upgraded [hinjawadi_offices_refined.blend](file:///c:/Users/Dhairyashil/website/hinjawadi_output/hinjawadi_offices_refined.blend) from a flat procedural blockout into a rich 3D digital twin of Hinjawadi Phase 1, Pune. This implementation satisfies **Pillar 1 (Real Environment)**, **Pillar 2 (Real Buildings)**, and establishes the **Hybrid Photogrammetry Workflow**.

---

## 1. Visual Verification & Renders

````carousel
![Hinjawadi Phase 1 Aerial Digital Twin Overview](C:\Users\Dhairyashil\.gemini\antigravity-ide\brain\6b66d2f7-6e44-4d8a-9b33-b0daabb0c4c1\aerial_overview_realistic.png)
<!-- slide -->
![PCCRC Hero Campus with Realistic Atmosphere & Satellite Ground](C:\Users\Dhairyashil\.gemini\antigravity-ide\brain\6b66d2f7-6e44-4d8a-9b33-b0daabb0c4c1\pccrc_hero_realistic.png)
<!-- slide -->
![Elevated Pune Metro Line 3 Viaduct Corridor](C:\Users\Dhairyashil\.gemini\antigravity-ide\brain\6b66d2f7-6e44-4d8a-9b33-b0daabb0c4c1\metro_corridor_realistic.png)
````

---

## 2. Key Upgrades Delivered

### A. Pillar 1: Real Environment & Atmosphere ([build_hinjawadi_environment.py](file:///c:/Users/Dhairyashil/website/build_hinjawadi_environment.py))
1. **Physical Sky & Sunlight**:
   * Installed Blender's **Nishita Multi-Scattering Physical Sky** calibrated to Hinjawadi solar coordinates ($18.591^\circ \text{ N}, 73.738^\circ \text{ E}$) with $34^\circ$ elevation and warm solar temperature ($1.0, 0.96, 0.90$).
   * Calibrated color management to **AgX High Contrast** with adjusted physical exposure ($-1.6$).
2. **High-Resolution Satellite Ground Topography**:
   * Replaced the 48 flat beige ground planes with [hinjawadi_satellite_ortho.png](file:///c:/Users/Dhairyashil/website/hinjawadi_output/hinjawadi_satellite_ortho.png) mapped across the $3.6\text{ km} \times 2.9\text{ km}$ terrain.
   * Incorporated topographic slope down to the Mula River basin in the north-east.
   * Applied PBR roughness masking separating water, asphalt roads, and green campus landscaping.
3. **Elevated Pune Metro Line 3 Viaduct**:
   * Modeled the elevated metro spine along the Hinjawadi–Wakad arterial corridor from Shivaji Chowk past Phase 1 circle:
     * **229 precast segmental box-girder deck sections** ($8.8\text{ m}$ dual-track width, $8.5\text{ m}$ road clearance).
     * **114 concrete cylindrical piers with hammerhead caps** spaced every $28\text{ m}$.
4. **Native Landscaping & Vegetation Prototypes**:
   * Generated native Indian tree species (Royal Palm, Indian Neem, and flowering red Gulmohar) along road verges and campus compounds.

---

### B. Pillar 2: Real Buildings & PBR Materials ([upgrade_hinjawadi_pbr_materials.py](file:///c:/Users/Dhairyashil/website/upgrade_hinjawadi_pbr_materials.py))
1. **Landmark Campus Architectural Profiles**:
   * Configured [office_profiles.json](file:///c:/Users/Dhairyashil/website/office_profiles.json) with custom specifications for 14 major Hinjawadi campuses:
     * **Dassault Systèmes 3DS Red Fort** (`relation/5354432`): Red terracotta/sandstone composite panels and solar-tinted ribbon glass.
     * **Dassault Systèmes Sky Wing** (`way/239275013`): Silver-white ACP and blue reflective glazing.
     * **Wipro Technologies Phase 1** (`way/359729198`): Exposed brick-red terracotta cladding with charcoal grey structural framing.
     * **Tata Technologies Ltd** (`relation/5351455`): Metallic silver aluminum facade with panoramic curtain walls.
     * **HCL Technologies Amber Fort** (`way/1460519904`): Warm ochre/amber architectural sandstone.
     * **Birlasoft SDB 1 & SDB 2** (`way/359525809`, `way/359525897`): Modern white/charcoal composite panels with solar glass.
     * **LTIMindtree**, **Siemens**, **KPIT Technologies**, **Radius Tech Park**, **Vivanta by Taj**, **Radisson Blu**, **Symbiosis Institute**.
2. **PBR Material Upgrades**:
   * **317 Architectural Glass Materials**: Refined with $IOR = 1.52$, Roughness $= 0.035$, Transmission $= 0.22$, and solar blue/green specular reflectivity.
   * **310 Facade Cladding Materials**: Applied metallic ACP panels ($0.55$ metallic, $0.32$ roughness) and architectural stone.
   * **296 Rooftops & HVAC Equipment**: Weathered membrane roofs and galvanized steel cooling towers.

---

### C. Hybrid Workflow Engine ([fetch_hinjawadi_photogrammetry.py](file:///c:/Users/Dhairyashil/website/fetch_hinjawadi_photogrammetry.py))
* Implemented a Python engine to connect to Google Maps Platform Photorealistic 3D Tiles API (`AIzaSyCpnqe41Fmad2SDx9vFU5P-DwglKD5M72U`).
* Traverses OBB spatial hierarchy for Hinjawadi Phase 1 coordinates ($18.591^\circ \text{ N}, 73.738^\circ \text{ E}$).
* Transforms 3D tile vertex data from ECEF into the local ENU frame defined in [georeference.json](file:///c:/Users/Dhairyashil/website/hinjawadi_output/georeference.json).
* Caches downloaded `.glb` meshes in `hinjawadi_output/photogrammetry_cache/` for streaming into collection `00_Photogrammetry_3D_Tiles`.

---

## 3. Verification Summary

| Component | Status | Details |
| :--- | :--- | :--- |
| **Physical Sky & Sun** | **Active** | Nishita multi-scattering, $34^\circ$ elevation, AgX High Contrast |
| **Topographic Satellite Ground** | **Active** | 3.6 km x 2.9 km satellite ortho with Mula river elevation |
| **Pune Metro Line 3 Viaduct** | **Active** | 229 deck sections, 114 concrete piers along central spine |
| **Landmark Campuses Profiled** | **14 Campuses** | Dassault Red Fort, Wipro, Tata Tech, Birlasoft, HCL, etc. |
| **PBR Glass Materials Upgraded**| **317 Materials** | $IOR = 1.52$, reflective solar tint |
| **PBR Cladding Materials Upgraded** | **310 Materials** | Metallic ACP & architectural masonry |
| **Rooftop & Industrial Materials** | **296 Materials** | Weathered gravel & galvanized steel HVAC |
| **Master Blend File Saved** | **Saved** | [hinjawadi_offices_refined.blend](file:///c:/Users/Dhairyashil/website/hinjawadi_output/hinjawadi_offices_refined.blend) (101.4 MB) |
| **Safety Backup Preserved** | **Preserved** | [hinjawadi_offices_refined.backup.blend](file:///c:/Users/Dhairyashil/website/hinjawadi_output/hinjawadi_offices_refined.backup.blend) (101.3 MB) |

---

## 4. How to Inspect in Blender or Re-export

### Inspect in Blender:
Open the updated file directly in Blender:
```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" "hinjawadi_output/hinjawadi_offices_refined.blend"
```
* Use cameras `PCCRC_Hero_Realistic`, `Metro_Line3_Corridor_Realistic`, or `Aerial_Overview_Realistic`.
* Switch viewport shading to **Rendered** (Z -> 8) to view live EEVEE Next lighting and reflections.

### Re-export to Unreal Engine 5:
```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" `
  hinjawadi_output/hinjawadi_offices_refined.blend `
  --background `
  --python reexport_hinjawadi_ue5.py -- --save-blend
```
