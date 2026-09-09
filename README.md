# NAKSHA V2.0 — 3D Digital Twin & Property Intelligence

NAKSHA (National Geospatial Knowledge-based Land Survey of Urban Habitations) V2.0 delivers an authentic dual-world architecture combining **Google Maps Platform Photorealistic 3D Tiles** in **CesiumJS** with authoritative **NAKSHA Cadastral GIS** boundaries and a futuristic **Point Cloud Digital Twin**.

---

## 1. Dual-World Architectural Concept

```
                     REAL WORLD (Earth)
                             │
                             ▼
     Google Maps Platform Photorealistic 3D Tiles
                             │
                             ▼
                   CESIUMJS 3D ENGINE
                             │
                             ▼
            NAKSHA AUTHORITATIVE GIS OVERLAY
              ┌──────────────┴──────────────┐
              ▼                             ▼
       PARCEL BOUNDARY              BUILDING FOOTPRINT
     (PAR-000123 / Blue)           (BLD-000781 / Cyan)
              │                             │
              └──────────────┬──────────────┘
                             ▼
                      CLICK BUILDING
                             ▼
                   CAMERA FLIES TO OBJECT
                             ▼
           DIGITAL TWIN REVEAL (1.2s ANIMATION)
              ┌──────────────┴──────────────┐
              ▼                             ▼
     POINT CLOUD STRUCTURE          FLOORS & SLABS
  (Sampled Walls, Roof, Slabs)    (Ground to Floor 5)
              │                             │
              └──────────────┬──────────────┘
                             ▼
                 3D PROPERTY INTELLIGENCE
          (ULPIN, Khasra, Area, RoR, Verification)
```

- **World 1 (Real World)**: Photorealistic geographic 3D world with real buildings, roads, trees, and terrain rendered from Google Maps Platform Photorealistic 3D Tiles.
- **World 2 (Property Intelligence)**: Authoritative cadastral property boundary (`PAR-000123`), building footprints (`BLD-000781`), and the futuristic point-cloud digital twin structure that reveals on building selection.

---

## 2. Google Maps Platform Setup

To enable Google Photorealistic 3D Tiles in the 3D Viewer:

1. **Create Google Cloud Project**: Open [Google Cloud Console](https://console.cloud.google.com/) and create or select your project.
2. **Enable Billing**: Ensure an active billing account is linked to the project (required by Google Maps Platform).
3. **Enable Map Tiles API**:
   - Navigate to **APIs & Services > Library**.
   - Search for **Map Tiles API**.
   - Click **Enable**.
4. **Create API Key**:
   - Navigate to **APIs & Services > Credentials**.
   - Click **+ CREATE CREDENTIALS > API key**.
5. **Restrict API Key**:
   - Under **API restrictions**, select **Restrict key** and choose **Map Tiles API**.
   - Under **Application restrictions**, set appropriate HTTP referrers if deploying to production.
6. **Configure Environment Variable**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Set your key:
     ```env
     VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```
7. **Start Application**:
   ```bash
   npm run dev
   ```

---

## 3. Data Honesty & Provenance

NAKSHA strictly enforces truth in spatial provenance:
- **Base Map**: Google Maps Platform Photorealistic 3D Tiles.
- **Cadastral Boundary**: Authoritative NAKSHA GIS vector cadastre (PMRDA survey framework).
- **Digital Twin**: Footprint + Height Digital Twin Reconstruction (clearly marked as DEMO point cloud when surveyed LiDAR/photogrammetry is not present).
- **Interior CAD / Units**: When interior BIM/CAD is unavailable, the UI explicitly states `ROOM GEOMETRY: NOT AVAILABLE` while displaying authoritative unit records and ownership linkages.

---

## 4. Visualization Modes

1. **REAL WORLD**: Only Google photorealistic 3D environment + cadastral boundary.
2. **HYBRID (HERO MODE)**: Google photorealistic building visible + semi-transparent digital twin + subtle point structure.
3. **POINT CLOUD**: Dense futuristic point-based structure describing walls, floor slabs, and roof.
4. **STRUCTURE**: Structural elements (floor slabs, columns, beams, core).
5. **FLOORS**: Floor decomposition (Ground, Floor 1, Floor 2, Floor 3, Floor 4, Floor 5).
6. **EXPLODE FLOORS**: Smooth vertical separation of floor slabs.
7. **X-RAY**: Translucent building shell revealing internal structural components.
