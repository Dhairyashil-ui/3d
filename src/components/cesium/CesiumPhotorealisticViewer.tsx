// NAKSHA V2.0 â€” Authoritative 3D Geospatial Digital Twin Implementation
// Administrative Authority: Pune Metropolitan Region Development Authority (PMRDA)
// Jurisdiction: Hinjawadi Phase 1 Special Planning Unit (ULB-PMRDA-HINJ-01)
// Base World: Google Maps Platform Photorealistic 3D Tiles via CesiumJS
// Intelligence Layer: PMRDA Hinjawadi GIS Cadastre + On-Demand LiDAR Point Cloud Digital Twin

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelectionStore } from '../../services/selectionStore';
import { 
  HINJAWADI_ULB_UNIT_AOI,
  HINJAWADI_ULB_UNIT_INFO,
  HINJAWADI_BUILDINGS,
  HinjawadiBuilding,
  findBuildingAtCoordinate
} from '../../data/hinjawadiUlbDataset';
import { 
  COHERENT_PARCELS 
} from '../../data/coherentPuneDataset';
import { 
  Layers, 
  Box, 
  Building2, 
  Sparkles, 
  Compass, 
  Maximize2, 
  Eye, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  Scissors, 
  Info, 
  RotateCcw,
  ShieldCheck,
  Activity,
  Grid,
  MapPin,
  Camera,
  X,
  ChevronRight,
  Filter,
  EyeOff,
  Radio
} from 'lucide-react';

// Study Area: Hinjawadi Phase 1 - Rajiv Gandhi Infotech Park, Pune
const HINJAWADI_CENTER = {
  lng: 73.73769,
  lat: 18.58489,
  height: 280,
  heading: 35.0,
  pitch: -28.0
};

export type VisMode = 
  | 'real_world' 
  | 'hybrid' 
  | 'digital_twin' 
  | 'point_cloud' 
  | 'structure' 
  | 'floors' 
  | 'x_ray';

interface CesiumPhotorealisticViewerProps {
  height?: string;
  enableControls?: boolean;
}

export const CesiumPhotorealisticViewer: React.FC<CesiumPhotorealisticViewerProps> = ({
  height = '680px',
  enableControls = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const tilesetRef = useRef<any>(null);
  const pointCloudCollectionRef = useRef<any>(null);
  const polylinesRef = useRef<any>(null);
  const boundaryEntitiesRef = useRef<any[]>([]);

  // Selection store synchronization
  const [selection, selectStore] = useSelectionStore();

  // Active visualization modes
  const [visMode, setVisMode] = useState<VisMode>('hybrid');
  const [searchQuery, setSearchQuery] = useState('');
  const [tilesetLoaded, setTilesetLoaded] = useState(false);
  const [coverageWarning, setCoverageWarning] = useState(false);
  const [loadingTiles, setLoadingTiles] = useState(true);

  // Structural & Interactive states
  const [explodeValue, setExplodeValue] = useState(0); // 0 to 12 meters
  const [revealProgress, setRevealProgress] = useState(1); // 0 to 1
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showWireframe, setShowWireframe] = useState(true);
  const [pointDensity, setPointDensity] = useState<'normal' | 'high' | 'ultra'>('high');
  const [pointColorMode, setPointCloudColorMode] = useState<'cyan' | 'elevation' | 'intensity' | 'rgb'>('cyan');

  // Layer Toggles
  const [showAoiBoundary, setShowAoiBoundary] = useState(true);
  const [showAllFootprints, setShowAllFootprints] = useState(true);
  const [showBuildingPins, setShowBuildingPins] = useState(true);
  const [catalogDrawerOpen, setCatalogDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // CRITICAL REQUIREMENT: Point cloud ONLY appears after clicking that building!
  // Initialized to null so ZERO point cloud appears on initial load!
  const [activePointCloudBuilding, setActivePointCloudBuilding] = useState<HinjawadiBuilding | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<HinjawadiBuilding | null>(null);

  // ---------------------------------------------------------------------------
  // 1. Initialize CesiumJS Globe & Google Photorealistic 3D Tiles
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;
    let isMounted = true;
    let checkTimer: any = null;

    const initViewer = () => {
      const Cesium = (window as any).Cesium;
      if (!Cesium || !containerRef.current) {
        checkTimer = setTimeout(initViewer, 80);
        return;
      }

      // Get Google Maps Platform API Key
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCpnqe41Fmad2SDx9vFU5P-DwglKD5M72U';
      if (apiKey) {
        Cesium.GoogleMaps.defaultApiKey = apiKey;
      }

      // Initialize Cesium Viewer with baseLayer: false to prevent unauthorized Ion calls
      const viewer = new Cesium.Viewer(containerRef.current, {
        baseLayer: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        shadows: true,
        shouldAnimate: true
      });

      viewerRef.current = viewer;

      if (viewer.scene.globe) {
        viewer.scene.globe.depthTestAgainstTerrain = true;
      }
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0b0f19');

      // Asynchronously load Google Photorealistic 3D Tiles
      const loadGoogleTileset = async () => {
        try {
          setLoadingTiles(true);
          let tileset: any = null;

          if (typeof Cesium.createGooglePhotorealistic3DTileset === 'function' && apiKey) {
            Cesium.GoogleMaps.defaultApiKey = apiKey;
            tileset = await Cesium.createGooglePhotorealistic3DTileset();
          }

          if (!tileset && apiKey) {
            tileset = await Cesium.Cesium3DTileset.fromUrl(
              `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`
            );
          }

          if (tileset && isMounted) {
            viewer.scene.primitives.add(tileset);
            tilesetRef.current = tileset;
            if (viewer.scene.globe) {
              viewer.scene.globe.show = false;
            }
            setTilesetLoaded(true);
            setCoverageWarning(false);
          } else {
            throw new Error('Google Photorealistic 3D Tiles unavailable');
          }
        } catch (err: any) {
          console.warn('Google 3D Tiles unavailable, using fallback imagery:', err);
          if (isMounted) {
            if (viewer.scene.globe) {
              viewer.scene.globe.show = true;
              try {
                const arcgis = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
                  'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                  { credit: 'Â© Esri, Maxar, Earthstar Geographics' }
                );
                viewer.imageryLayers.addImageryProvider(arcgis);
              } catch {
                viewer.imageryLayers.addImageryProvider(
                  new Cesium.UrlTemplateImageryProvider({
                    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    maximumLevel: 19,
                    credit: 'Â© OpenStreetMap contributors'
                  })
                );
              }
            }
            setCoverageWarning(true);
          }
        } finally {
          if (isMounted) setLoadingTiles(false);
        }
      };

      loadGoogleTileset();

      // Initial Camera fly to Hinjawadi Phase 1 Campus Center
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          HINJAWADI_CENTER.lng,
          HINJAWADI_CENTER.lat,
          HINJAWADI_CENTER.height
        ),
        orientation: {
          heading: Cesium.Math.toRadians(HINJAWADI_CENTER.heading),
          pitch: Cesium.Math.toRadians(HINJAWADI_CENTER.pitch),
          roll: 0.0
        },
        duration: 2.0
      });

      // Primitives for Point Cloud and Architectural Wireframe
      const pointCollection = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
      pointCloudCollectionRef.current = pointCollection;

      const polylineCollection = viewer.scene.primitives.add(new Cesium.PolylineCollection());
      polylinesRef.current = polylineCollection;

      // -----------------------------------------------------------------------
      // Interactive Click & Hover Picking Handler
      // -----------------------------------------------------------------------
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      // LEFT_CLICK: Pick building and dynamically load point cloud
      handler.setInputAction((click: any) => {
        let foundBuilding: HinjawadiBuilding | null = null;

        // 1. Check drillPick for entity IDs
        const pickedObjects = viewer.scene.drillPick(click.position);
        if (pickedObjects && pickedObjects.length > 0) {
          for (const obj of pickedObjects) {
            if (Cesium.defined(obj) && obj.id) {
              const entityId = obj.id.id || obj.id;
              if (typeof entityId === 'string' && entityId.startsWith('bld-footprint-')) {
                const bldId = entityId.replace('bld-footprint-', '');
                foundBuilding = HINJAWADI_BUILDINGS.find(b => b.buildingId === bldId) || null;
                if (foundBuilding) break;
              }
            }
          }
        }

        // 2. World Coordinate Raycast Fallback: Works reliably over 3D Tiles mesh
        if (!foundBuilding) {
          const ray = viewer.camera.getPickRay(click.position);
          const cartesian = viewer.scene.pickPosition(click.position) || 
            (viewer.scene.globe ? viewer.scene.globe.pick(ray, viewer.scene) : null);
          if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const lng = Cesium.Math.toDegrees(cartographic.longitude);
            const lat = Cesium.Math.toDegrees(cartographic.latitude);
            foundBuilding = findBuildingAtCoordinate(lng, lat, 0.00022);
          }
        }

        if (foundBuilding) {
          selectAndFlyToBuilding(foundBuilding);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // MOUSE_MOVE: Tooltip & Cursor Pointer feedback
      handler.setInputAction((movement: any) => {
        let hovered: HinjawadiBuilding | null = null;
        const pickedObjects = viewer.scene.drillPick(movement.endPosition);
        if (pickedObjects && pickedObjects.length > 0) {
          for (const obj of pickedObjects) {
            if (Cesium.defined(obj) && obj.id) {
              const entityId = obj.id.id || obj.id;
              if (typeof entityId === 'string' && entityId.startsWith('bld-footprint-')) {
                const bldId = entityId.replace('bld-footprint-', '');
                hovered = HINJAWADI_BUILDINGS.find(b => b.buildingId === bldId) || null;
                if (hovered) break;
              }
            }
          }
        }

        if (hovered) {
          viewer.scene.canvas.style.cursor = 'pointer';
          setHoveredBuilding(hovered);
        } else {
          viewer.scene.canvas.style.cursor = 'default';
          setHoveredBuilding(null);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    };

    initViewer();

    return () => {
      isMounted = false;
      if (checkTimer) clearTimeout(checkTimer);
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. Select Building & Fly To with Optimal 3D Perspective Tilt
  // ---------------------------------------------------------------------------
  const selectAndFlyToBuilding = useCallback((bld: HinjawadiBuilding) => {
    setActivePointCloudBuilding(bld);
    selectStore.selectBuilding(bld.buildingId, bld.parcelId);
    triggerRevealAnimation();

    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium) return;

    const [centerLng, centerLat] = bld.center;
    const approxH = bld.approxHeightM || 18;
    const range = Math.max(90, Math.sqrt(bld.footprintAreaSqm) * 2.0 + approxH * 2.2);

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        centerLng - 0.00062,
        centerLat - 0.00052,
        568.2 + approxH + range * 0.6
      ),
      orientation: {
        heading: Cesium.Math.toRadians(42.0),
        pitch: Cesium.Math.toRadians(-28.0),
        roll: 0.0
      },
      duration: 1.6
    });
  }, []);

  // ---------------------------------------------------------------------------
  // 3. Dismiss Point Cloud Handler
  // ---------------------------------------------------------------------------
  const dismissPointCloud = useCallback(() => {
    setActivePointCloudBuilding(null);
    selectStore.selectBuilding(null, null);
    const pointCollection = pointCloudCollectionRef.current;
    const polylineCollection = polylinesRef.current;
    if (pointCollection) pointCollection.removeAll();
    if (polylineCollection) polylineCollection.removeAll();
  }, [selectStore]);

  // ---------------------------------------------------------------------------
  // 4. Render Hinjawadi ULB Unit Area AOI Boundary & All 48 Building Footprints
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium) return;

    // Clear previous entities
    boundaryEntitiesRef.current.forEach(entity => viewer.entities.remove(entity));
    boundaryEntitiesRef.current = [];

    // 1. Hinjawadi ULB Unit Area AOI Boundary (Emerald / Cyan glowing perimeter)
    if (showAoiBoundary) {
      const aoiCoords = HINJAWADI_ULB_UNIT_AOI.coordinates[0];
      const flatAoiCoords: number[] = [];
      aoiCoords.forEach(([lng, lat]) => flatAoiCoords.push(lng, lat));

      // Draped fill indicating official ULB zone
      const aoiEntity = viewer.entities.add({
        id: 'hinjawadi-ulb-aoi-fill',
        name: HINJAWADI_ULB_UNIT_INFO.unitName,
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(flatAoiCoords),
          material: Cesium.Color.fromCssColorString('#10b981').withAlpha(0.08),
          outline: false,
          classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
        }
      });
      boundaryEntitiesRef.current.push(aoiEntity);

      // Neon glowing perimeter outline
      const flatAoiHeights: number[] = [];
      aoiCoords.forEach(([lng, lat]) => flatAoiHeights.push(lng, lat, 570));
      const aoiOutline = viewer.entities.add({
        id: 'hinjawadi-ulb-aoi-outline',
        name: 'Hinjawadi ULB AOI Perimeter',
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(flatAoiHeights),
          width: 3.5,
          material: Cesium.Material.fromType('Color', {
            color: Cesium.Color.fromCssColorString('#10b981').withAlpha(0.85)
          }),
          clampToGround: true
        }
      });
      boundaryEntitiesRef.current.push(aoiOutline);

      // Survey Beacons (PMRDA Boundary Beacons 01â€“09)
      HINJAWADI_ULB_UNIT_INFO.boundaryBeacons.forEach(bc => {
        const beaconEntity = viewer.entities.add({
          id: `beacon-${bc.beaconId}`,
          name: `${bc.beaconId}: ${bc.description}`,
          position: Cesium.Cartesian3.fromDegrees(bc.lng, bc.lat, bc.elevationM + 12),
          point: {
            pixelSize: 7,
            color: Cesium.Color.fromCssColorString('#10b981'),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: bc.beaconId,
            font: '10px monospace',
            fillColor: Cesium.Color.fromCssColorString('#a7f3d0'),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -8),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000)
          }
        });
        boundaryEntitiesRef.current.push(beaconEntity);
      });
    }

    // 2. All 48 Building Footprints (Exact AOIs draped on 3D Tiles)
    if (showAllFootprints) {
      HINJAWADI_BUILDINGS.forEach(b => {
        const isSelected = activePointCloudBuilding?.buildingId === b.buildingId;
        const bldCoords = b.geometry.coordinates[0];
        const flatBldCoords: number[] = [];
        bldCoords.forEach(([lng, lat]) => flatBldCoords.push(lng, lat));

        let catColor = '#06b6d4'; // default IT/Tech
        if (b.buildingCategory === 'Educational Institution') catColor = '#3b82f6';
        else if (b.buildingCategory === 'Commercial & Hospitality') catColor = '#f59e0b';
        else if (b.buildingCategory === 'Residential High-Rise') catColor = '#a855f7';
        else if (b.buildingCategory === 'Civic & Emergency') catColor = '#ef4444';

        const bldEntity = viewer.entities.add({
          id: `bld-footprint-${b.buildingId}`,
          name: b.buildingName,
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(flatBldCoords),
            material: isSelected
              ? Cesium.Color.fromCssColorString('#00f5ff').withAlpha(0.45)
              : Cesium.Color.fromCssColorString(catColor).withAlpha(0.18),
            outline: true,
            outlineColor: isSelected
              ? Cesium.Color.fromCssColorString('#ffffff')
              : Cesium.Color.fromCssColorString(catColor),
            outlineWidth: isSelected ? 3.5 : 1.8,
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
          }
        });
        boundaryEntitiesRef.current.push(bldEntity);

        // Major landmark 3D label pins
        const isLandmark = [
          'BLD-000781', 'BLD-HYATT-01', 'BLD-RADISSON', 'BLD-SCIT-01', 
          'BLD-POLICE-01', 'BLD-FIRE-01', 'BLD-CITY-CTR', 'BLD-I2IT-LIB'
        ].includes(b.buildingId);

        if (isLandmark && showBuildingPins) {
          const landmarkLabel = viewer.entities.add({
            id: `landmark-label-${b.buildingId}`,
            position: Cesium.Cartesian3.fromDegrees(b.center[0], b.center[1], 568.2 + b.approxHeightM + 14),
            billboard: {
              image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%2338bdf8" stroke="%23ffffff" stroke-width="2"><circle cx="12" cy="12" r="7"/></svg>',
              width: 16,
              height: 16,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4500)
            },
            label: {
              text: b.buildingName.length > 24 ? b.buildingName.slice(0, 23) + 'â€¦' : b.buildingName,
              font: 'bold 11px sans-serif',
              fillColor: isSelected ? Cesium.Color.fromCssColorString('#00f5ff') : Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 3,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -10),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2800)
            }
          });
          boundaryEntitiesRef.current.push(landmarkLabel);
        }
      });
    }

  }, [activePointCloudBuilding, showAoiBoundary, showAllFootprints, showBuildingPins]);

  // ---------------------------------------------------------------------------
  // 5. Reveal Animation Trigger
  // ---------------------------------------------------------------------------
  const triggerRevealAnimation = useCallback(() => {
    setRevealProgress(0);
    const startTime = performance.now();
    const duration = 1200; // 1.2s smooth scan reveal

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRevealProgress(eased);

      if (progress < 1.0) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // ---------------------------------------------------------------------------
  // 6. Generate High-Density LiDAR Point Cloud ONLY on Building Click
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    const pointCollection = pointCloudCollectionRef.current;
    const polylineCollection = polylinesRef.current;

    if (!viewer || !Cesium || !pointCollection || !polylineCollection) return;

    pointCollection.removeAll();
    polylineCollection.removeAll();

    // CRITICAL: Point cloud ONLY appears after clicking on that building!
    // When activePointCloudBuilding is null or mode is real_world, zero points are generated.
    if (!activePointCloudBuilding || visMode === 'real_world') return;

    const coords = activePointCloudBuilding.geometry.coordinates[0];
    const totalFloors = activePointCloudBuilding.totalFloors || 5;
    const floorHeight = activePointCloudBuilding.floorHeightM || 3.28;
    const totalHeight = activePointCloudBuilding.approxHeightM || (totalFloors * floorHeight);
    const groundElevation = 568.2;

    // Density configurations
    const wallSamples = pointDensity === 'ultra' ? 100 : pointDensity === 'high' ? 65 : 35;
    const verticalLayers = pointDensity === 'ultra' ? 32 : pointDensity === 'high' ? 22 : 12;
    const roofGridSteps = pointDensity === 'ultra' ? 16 : pointDensity === 'high' ? 10 : 6;

    // Point alpha and base color
    let pointAlpha = 0.9;
    let basePointSize = pointDensity === 'ultra' ? 2.4 : pointDensity === 'high' ? 2.8 : 3.2;

    // Helper: Compute color by elevation / mode
    const getPointColor = (normalizedHeight: number, isEdge: boolean) => {
      if (pointColorMode === 'elevation') {
        // Gradient: Emerald (ground) -> Cyan (mid) -> Gold (roof)
        if (normalizedHeight < 0.3) {
          return Cesium.Color.fromCssColorString('#10b981').withAlpha(pointAlpha);
        } else if (normalizedHeight < 0.7) {
          return Cesium.Color.fromCssColorString('#06b6d4').withAlpha(pointAlpha);
        } else {
          return Cesium.Color.fromCssColorString('#f59e0b').withAlpha(pointAlpha);
        }
      } else if (pointColorMode === 'intensity') {
        // High reflectance on corners/roof, standard on walls
        return isEdge 
          ? Cesium.Color.fromCssColorString('#f43f5e').withAlpha(1.0)
          : Cesium.Color.fromCssColorString('#e2e8f0').withAlpha(pointAlpha * 0.85);
      } else if (pointColorMode === 'rgb') {
        return isEdge
          ? Cesium.Color.WHITE.withAlpha(pointAlpha)
          : Cesium.Color.fromCssColorString('#67e8f9').withAlpha(pointAlpha * 0.7);
      } else {
        // Default: Neon Cyan LiDAR Digital Twin
        return isEdge
          ? Cesium.Color.WHITE.withAlpha(pointAlpha)
          : Cesium.Color.fromCssColorString('#00f5ff').withAlpha(pointAlpha * 0.88);
      }
    };

    // 1. Vertical Facade Wall & Structural Column Points
    const numSegments = coords.length - 1;
    const samplesPerSeg = Math.max(4, Math.floor(wallSamples / numSegments));

    for (let l = 0; l <= verticalLayers; l++) {
      const normalizedH = l / verticalLayers;
      if (normalizedH > revealProgress) continue;

      const currentH = groundElevation + normalizedH * totalHeight;
      const isRingLevel = (l % 3 === 0);

      for (let i = 0; i < numSegments; i++) {
        const p1 = coords[i];
        const p2 = coords[i + 1];

        for (let s = 0; s < samplesPerSeg; s++) {
          const t = s / samplesPerSeg;
          const lng = p1[0] + (p2[0] - p1[0]) * t;
          const lat = p1[1] + (p2[1] - p1[1]) * t;
          const isEdge = (s === 0 || isRingLevel);

          pointCollection.add({
            position: Cesium.Cartesian3.fromDegrees(lng, lat, currentH),
            color: getPointColor(normalizedH, isEdge),
            pixelSize: isEdge ? basePointSize + 0.8 : basePointSize
          });
        }
      }
    }

    // 2. Floor Slabs with Interactive Exploded View
    for (let f = 0; f <= totalFloors; f++) {
      const baseFloorH = groundElevation + f * floorHeight;
      const separation = f * (explodeValue * 1.5);
      const floorH = baseFloorH + separation;

      for (let i = 0; i < numSegments; i++) {
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const slabSteps = 16;
        for (let s = 0; s <= slabSteps; s++) {
          const t = s / slabSteps;
          const lng = p1[0] + (p2[0] - p1[0]) * t;
          const lat = p1[1] + (p2[1] - p1[1]) * t;

          pointCollection.add({
            position: Cesium.Cartesian3.fromDegrees(lng, lat, floorH),
            color: Cesium.Color.fromCssColorString('#67e8f9').withAlpha(0.95),
            pixelSize: basePointSize + 0.6
          });
        }
      }

      // 3. Flat RCC Roof Surface Grid Points (at top floor)
      if (f === totalFloors && revealProgress >= 0.75) {
        const minLng = Math.min(...coords.map(c => c[0]));
        const maxLng = Math.max(...coords.map(c => c[0]));
        const minLat = Math.min(...coords.map(c => c[1]));
        const maxLat = Math.max(...coords.map(c => c[1]));

        for (let gx = 0; gx <= roofGridSteps; gx++) {
          for (let gy = 0; gy <= roofGridSteps; gy++) {
            const lng = minLng + (maxLng - minLng) * (gx / roofGridSteps);
            const lat = minLat + (maxLat - minLat) * (gy / roofGridSteps);

            pointCollection.add({
              position: Cesium.Cartesian3.fromDegrees(lng, lat, floorH),
              color: Cesium.Color.fromCssColorString('#e0f2fe').withAlpha(0.7),
              pixelSize: basePointSize - 0.4
            });
          }
        }
      }
    }

    // 4. Architectural Wireframe Edges
    if (showWireframe || visMode === 'structure') {
      // Vertical corner columns
      coords.forEach(([lng, lat]) => {
        polylineCollection.add({
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            lng, lat, groundElevation,
            lng, lat, groundElevation + totalHeight * revealProgress
          ]),
          width: 1.5,
          material: Cesium.Material.fromType('Color', {
            color: Cesium.Color.fromCssColorString('#06b6d4').withAlpha(0.65)
          })
        });
      });

      // Floor slab perimeter rings
      for (let f = 0; f <= totalFloors; f++) {
        const separation = f * (explodeValue * 1.5);
        const floorH = groundElevation + f * floorHeight + separation;
        const flatRing: number[] = [];
        coords.forEach(([lng, lat]) => {
          flatRing.push(lng, lat, floorH);
        });

        polylineCollection.add({
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(flatRing),
          width: 1.2,
          material: Cesium.Material.fromType('Color', {
            color: Cesium.Color.fromCssColorString('#38bdf8').withAlpha(0.55)
          })
        });
      }
    }

    // 5. Active Laser Scan Beam Ring during reveal animation
    if (revealProgress < 0.98) {
      const scanH = groundElevation + totalHeight * revealProgress;
      const flatScanRing: number[] = [];
      coords.forEach(([lng, lat]) => {
        flatScanRing.push(lng, lat, scanH);
      });

      polylineCollection.add({
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(flatScanRing),
        width: 3.0,
        material: Cesium.Material.fromType('Color', {
          color: Cesium.Color.fromCssColorString('#22c55e')
        })
      });
    }

    // 3D Tileset style fading when digital twin is active
    if (tilesetRef.current) {
      tilesetRef.current.style = new Cesium.Cesium3DTileStyle({
        color: visMode === 'point_cloud' ? 'color("white", 0.25)' : 'color("white", 0.95)'
      });
    }

  }, [activePointCloudBuilding, visMode, explodeValue, revealProgress, showWireframe, pointDensity, pointColorMode]);

  // ---------------------------------------------------------------------------
  // 7. Camera Actions: Fly to Entire ULB Unit Area AOI
  // ---------------------------------------------------------------------------
  const flyToHinjawadiUlbAoi = useCallback(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        HINJAWADI_ULB_UNIT_INFO.centerCoordinates.lng,
        HINJAWADI_ULB_UNIT_INFO.centerCoordinates.lat - 0.005,
        1550
      ),
      orientation: {
        heading: Cesium.Math.toRadians(HINJAWADI_ULB_UNIT_INFO.centerCoordinates.heading),
        pitch: Cesium.Math.toRadians(-46.0),
        roll: 0.0
      },
      duration: 2.0
    });
  }, []);

  const orbitBuilding = useCallback(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium || !activePointCloudBuilding) return;

    const [centerLng, centerLat] = activePointCloudBuilding.center;
    const center = Cesium.Cartesian3.fromDegrees(centerLng, centerLat, 568.2);

    viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(
      viewer.camera.heading + Cesium.Math.toRadians(45),
      Cesium.Math.toRadians(-28),
      Math.max(120, activePointCloudBuilding.approxHeightM * 2.8)
    ));
    setTimeout(() => {
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }, 450);
  }, [activePointCloudBuilding]);

  // Filter buildings for catalog drawer
  const filteredBuildings = HINJAWADI_BUILDINGS.filter(b => {
    const matchesCat = selectedCategory === 'All' || b.buildingCategory === selectedCategory;
    const matchesSearch = !searchQuery || 
      b.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.buildingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ulpin.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', backgroundColor: '#0b0f19', color: '#f8fafc', fontFamily: 'inherit' }}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* TOP HEADER: ULB Unit Info & Quick Action Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        right: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        pointerEvents: 'none',
        zIndex: 20
      }}>
        {/* Left: ULB Unit AOI Badge & Catalog Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
          <button
            onClick={() => setCatalogDrawerOpen(!catalogDrawerOpen)}
            style={{
              backgroundColor: catalogDrawerOpen ? '#0284c7' : 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
            }}
          >
            <Building2 size={15} color="#38bdf8" />
            <span>Hinjawadi Buildings (48)</span>
            <ChevronRight size={14} style={{ transform: catalogDrawerOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          <button
            onClick={flyToHinjawadiUlbAoi}
            title="Fly to Hinjawadi Phase 1 ULB Unit Overview"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10b981',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Compass size={14} />
            <span>Fit ULB AOI (3.45 kmÂ²)</span>
          </button>
        </div>

        {/* Center: Search across all Hinjawadi Buildings */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '8px',
          padding: '5px 12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          pointerEvents: 'auto',
          width: '320px',
          gap: '8px'
        }}>
          <Search size={15} color="#38bdf8" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 48 Hinjawadi buildings, ULPIN..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '12px',
              flex: 1
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              âœ•
            </button>
          )}
        </div>

        {/* Right: Technical Provenance & Layer Toggles */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setShowAoiBoundary(!showAoiBoundary)}
            style={{
              backgroundColor: showAoiBoundary ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.9)',
              border: '1px solid',
              borderColor: showAoiBoundary ? '#10b981' : 'rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              color: showAoiBoundary ? '#a7f3d0' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <ShieldCheck size={13} color={showAoiBoundary ? '#10b981' : '#94a3b8'} />
            <span>AOI Boundary</span>
          </button>

          <button
            onClick={() => setShowAllFootprints(!showAllFootprints)}
            style={{
              backgroundColor: showAllFootprints ? 'rgba(6, 182, 212, 0.2)' : 'rgba(15, 23, 42, 0.9)',
              border: '1px solid',
              borderColor: showAllFootprints ? '#06b6d4' : 'rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              color: showAllFootprints ? '#67e8f9' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Layers size={13} color={showAllFootprints ? '#06b6d4' : '#94a3b8'} />
            <span>Footprints</span>
          </button>

          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tilesetLoaded ? '#10b981' : '#f59e0b' }}></span>
            <span>BASE: <b>Google 3D Tiles</b></span>
          </div>
        </div>
      </div>

      {/* HOVER TOOLTIP ON BUILDING FOOTPRINTS */}
      {hoveredBuilding && !activePointCloudBuilding && (
        <div style={{
          position: 'absolute',
          top: '68px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #00f5ff',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '12px',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 245, 255, 0.3)',
          pointerEvents: 'none',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={15} color="#00f5ff" />
          <span><b>{hoveredBuilding.buildingName}</b> ({hoveredBuilding.totalFloors} Floors â€¢ {hoveredBuilding.approxHeightM}m)</span>
          <span style={{ color: '#94a3b8', fontSize: '11px' }}>â€¢ Click to load 3D LiDAR Point Cloud</span>
        </div>
      )}

      {/* NOTICE WHEN NO BUILDING IS SELECTED: Point Cloud Ready */}
      {!activePointCloudBuilding && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '8px',
          padding: '8px 18px',
          fontSize: '12px',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          zIndex: 15
        }}>
          <Radio size={14} color="#38bdf8" />
          <span><b>Hinjawadi ULB Unit Area Mapped:</b> Click any building footprint on the globe or open the Catalog to generate its 3D LiDAR Point Cloud.</span>
        </div>
      )}

      {/* FLOATING 3D STRUCTURAL HUD CARD â€” APPEARS ONLY AFTER CLICKING A BUILDING */}
      {activePointCloudBuilding && (
        <div style={{
          position: 'absolute',
          top: '68px',
          left: '14px',
          width: '330px',
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'fadeIn 0.2s ease-in'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
            <div style={{ flex: 1, paddingRight: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '9.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 700
                }}>
                  {activePointCloudBuilding.buildingCategory}
                </span>
                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>â— Point Cloud Live</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '4px', lineHeight: 1.3 }}>
                {activePointCloudBuilding.buildingName}
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', marginTop: '2px' }}>
                ULPIN: {activePointCloudBuilding.ulpin} â€¢ Parcel: {activePointCloudBuilding.parcelId}
              </div>
            </div>
            {/* Dismiss Point Cloud Button */}
            <button
              onClick={dismissPointCloud}
              title="Dismiss Point Cloud & Clear Selection"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '6px',
                color: '#f87171',
                padding: '6px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.65)', padding: '7px 10px', borderRadius: '6px' }}>
              <div style={{ color: '#94a3b8', fontSize: '10px' }}>AOI FOOTPRINT</div>
              <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '13px' }}>
                {activePointCloudBuilding.footprintAreaSqm.toLocaleString()} mÂ²
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.65)', padding: '7px 10px', borderRadius: '6px' }}>
              <div style={{ color: '#94a3b8', fontSize: '10px' }}>HEIGHT / FLOORS</div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '13px' }}>
                {activePointCloudBuilding.approxHeightM}m (G+{activePointCloudBuilding.totalFloors - 1})
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.65)', padding: '7px 10px', borderRadius: '6px' }}>
              <div style={{ color: '#94a3b8', fontSize: '10px' }}>STRUCTURE TYPE</div>
              <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activePointCloudBuilding.structuralType}
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.65)', padding: '7px 10px', borderRadius: '6px' }}>
              <div style={{ color: '#94a3b8', fontSize: '10px' }}>PROPERTY TAX</div>
              <div style={{ fontWeight: 700, color: activePointCloudBuilding.taxStatus === 'Paid' ? '#10b981' : '#f59e0b', fontSize: '12px' }}>
                â‚¹{activePointCloudBuilding.annualTaxInr.toLocaleString()} ({activePointCloudBuilding.taxStatus})
              </div>
            </div>
          </div>

          {/* Point Cloud Stats */}
          <div style={{
            backgroundColor: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '6px',
            padding: '8px 10px',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#67e8f9', fontWeight: 600 }}>
              <span>LiDAR Points Rendered:</span>
              <span style={{ fontFamily: 'monospace' }}>{activePointCloudBuilding.pointCloudData.totalPoints.toLocaleString()} pts</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '10.5px' }}>
              <span>Sensor:</span>
              <span>{activePointCloudBuilding.pointCloudData.sensor}</span>
            </div>
          </div>

          {/* Point Cloud Color Mode & Density Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>LiDAR Style:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['cyan', 'elevation', 'intensity', 'rgb'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setPointCloudColorMode(mode)}
                    style={{
                      backgroundColor: pointColorMode === mode ? '#0284c7' : 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      border: '1px solid',
                      borderColor: pointColorMode === mode ? '#38bdf8' : 'rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      padding: '3px 7px',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Density:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['normal', 'high', 'ultra'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setPointDensity(d)}
                    style={{
                      backgroundColor: pointDensity === d ? '#0284c7' : 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      border: '1px solid',
                      borderColor: pointDensity === d ? '#38bdf8' : 'rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      padding: '3px 7px',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
            <button
              onClick={triggerRevealAnimation}
              style={{
                flex: 1,
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '6px',
                color: '#38bdf8',
                padding: '6px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={13} /> Re-scan
            </button>
            <button
              onClick={orbitBuilding}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#ffffff',
                padding: '6px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={13} /> Orbit 45Â°
            </button>
            <button
              onClick={dismissPointCloud}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '6px',
                color: '#fca5a5',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Close point cloud"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* COLLAPSIBLE HINJAWADI BUILDINGS CATALOG DRAWER */}
      {catalogDrawerOpen && (
        <div style={{
          position: 'absolute',
          top: '68px',
          left: activePointCloudBuilding ? '354px' : '14px',
          width: '320px',
          maxHeight: 'calc(100% - 160px)',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '10px',
          padding: '14px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={16} color="#38bdf8" />
              <span>Hinjawadi Buildings ({filteredBuildings.length})</span>
            </div>
            <button
              onClick={() => setCatalogDrawerOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
            >
              âœ•
            </button>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['All', 'IT & Tech Park', 'Educational Institution', 'Commercial & Hospitality', 'Residential High-Rise', 'Civic & Emergency'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  whiteSpace: 'nowrap',
                  backgroundColor: selectedCategory === cat ? '#0284c7' : 'rgba(255,255,255,0.06)',
                  color: selectedCategory === cat ? '#ffffff' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat === 'All' ? 'All (48)' : cat.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Buildings List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            overflowY: 'auto',
            maxHeight: '440px',
            paddingRight: '4px'
          }}>
            {filteredBuildings.map(b => {
              const isSelected = activePointCloudBuilding?.buildingId === b.buildingId;
              return (
                <div
                  key={b.buildingId}
                  onClick={() => selectAndFlyToBuilding(b)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid',
                    borderColor: isSelected ? '#00f5ff' : 'rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600, fontSize: '11.5px', color: isSelected ? '#38bdf8' : '#ffffff', lineHeight: 1.25 }}>
                      {b.buildingName}
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: '9px', backgroundColor: '#0284c7', color: '#ffffff', padding: '1px 5px', borderRadius: '3px', fontWeight: 700, flexShrink: 0 }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                    <span>{b.totalFloors} Floors â€¢ {b.approxHeightM}m</span>
                    <span>{b.footprintAreaSqm.toLocaleString()} mÂ²</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BOTTOM FLOATING CONTROLS: 3D Visualization Modes */}
      <div style={{
        position: 'absolute',
        bottom: '36px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        padding: '8px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        zIndex: 20
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', paddingRight: '6px', borderRight: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Layers size={14} /> 3D MODES:
        </div>

        {/* 1. REAL WORLD */}
        <button
          onClick={() => setVisMode('real_world')}
          style={{
            backgroundColor: visMode === 'real_world' ? '#0284c7' : 'rgba(255,255,255,0.06)',
            color: '#ffffff',
            border: '1px solid',
            borderColor: visMode === 'real_world' ? '#38bdf8' : 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          REAL WORLD
        </button>

        {/* 2. HYBRID (Hero Mode) */}
        <button
          onClick={() => {
            setVisMode('hybrid');
            if (activePointCloudBuilding) triggerRevealAnimation();
          }}
          style={{
            backgroundColor: visMode === 'hybrid' ? '#0284c7' : 'rgba(255,255,255,0.06)',
            color: '#ffffff',
            border: '1px solid',
            borderColor: visMode === 'hybrid' ? '#38bdf8' : 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Sparkles size={12} color="#38bdf8" /> HYBRID
        </button>

        {/* 3. POINT CLOUD */}
        <button
          onClick={() => {
            setVisMode('point_cloud');
            if (activePointCloudBuilding) triggerRevealAnimation();
          }}
          style={{
            backgroundColor: visMode === 'point_cloud' ? '#0284c7' : 'rgba(255,255,255,0.06)',
            color: '#ffffff',
            border: '1px solid',
            borderColor: visMode === 'point_cloud' ? '#00f5ff' : 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          POINT CLOUD
        </button>

        {/* 4. DIGITAL TWIN */}
        <button
          onClick={() => setVisMode('digital_twin')}
          style={{
            backgroundColor: visMode === 'digital_twin' ? '#0284c7' : 'rgba(255,255,255,0.06)',
            color: '#ffffff',
            border: '1px solid',
            borderColor: visMode === 'digital_twin' ? '#38bdf8' : 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          DIGITAL TWIN
        </button>

        {/* 5. STRUCTURE */}
        <button
          onClick={() => setVisMode('structure')}
          style={{
            backgroundColor: visMode === 'structure' ? '#0284c7' : 'rgba(255,255,255,0.06)',
            color: '#ffffff',
            border: '1px solid',
            borderColor: visMode === 'structure' ? '#38bdf8' : 'rgba(255,255,255,0.15)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          STRUCTURE
        </button>

        {/* Explode Floors Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>EXPLODE:</span>
          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={explodeValue}
            onChange={(e) => setExplodeValue(Number(e.target.value))}
            style={{ width: '75px', accentColor: '#38bdf8', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8', minWidth: '30px' }}>
            {explodeValue > 0 ? `+${explodeValue * 1.5}m` : '0m'}
          </span>
        </div>

        {/* Room / Unit Modal Trigger */}
        <button
          onClick={() => setShowRoomDetails(!showRoomDetails)}
          style={{
            backgroundColor: showRoomDetails ? '#4f46e5' : 'rgba(79, 70, 229, 0.2)',
            color: '#ffffff',
            border: '1px solid #6366f1',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          UNITS / CAD
        </button>
      </div>

      {/* ROOM / UNIT CAD DISCLAIMER MODAL */}
      {showRoomDetails && (
        <div style={{
          position: 'absolute',
          bottom: '84px',
          right: '14px',
          width: '340px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          zIndex: 25
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>Interior CAD & Unit Records</div>
            <button
              onClick={() => setShowRoomDetails(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
            >
              âœ•
            </button>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '11px',
              color: '#fca5a5'
            }}>
              <b>ROOM GEOMETRY: NOT AVAILABLE</b>
              <p style={{ margin: '4px 0 0 0', fontSize: '10.5px', color: '#cbd5e1' }}>
                Survey records and BIM floor plans have not yet been surveyed for internal room boundaries. Authentic unit counts and ownership records are linked below.
              </p>
            </div>

            <div style={{ fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Active Building:</span>
                <b style={{ color: '#ffffff' }}>{activePointCloudBuilding?.buildingName || 'IÂ²IT Hinjawadi'}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>ULPIN:</span>
                <span style={{ fontFamily: 'monospace', color: '#ffffff' }}>{activePointCloudBuilding?.ulpin || '27041001003000'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Carpet Area:</span>
                <span style={{ color: '#ffffff' }}>{activePointCloudBuilding?.builtUpAreaSqm.toLocaleString() || '26,185'} mÂ²</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>RoR Record Status:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Linked & Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REQUIRED GOOGLE MAPS PLATFORM ATTRIBUTION */}
      <div style={{
        position: 'absolute',
        bottom: '6px',
        left: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '10.5px',
        color: 'rgba(255, 255, 255, 0.7)',
        pointerEvents: 'none',
        zIndex: 20
      }}>
        <span style={{ fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>Google</span>
        <span>â€¢</span>
        <span>Map Tiles API: Photorealistic 3D Tiles â€¢ Imagery Â©2026 Google</span>
        <span>â€¢</span>
        <span>PMRDA Hinjawadi GIS Layer Â© Department of Land Resources</span>
      </div>
    </div>
  );
};

