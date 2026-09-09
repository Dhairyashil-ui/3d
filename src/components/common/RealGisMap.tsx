// NAKSHA V2.0 — Authoritative 2D Interactive Cadastral GIS Engine
// Target Jurisdiction: PMRDA Hinjawadi Phase 1 • Survey Unit 01 (348671)
// Standard: Thin golden cadastral parcel boundaries, 317+ real building footprints,
// numbered vertex markers, edge segment distance measurements, and official boundary hierarchy.

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ULB_PMRDA_HINJAWADI_BOUNDARY,
  VILLAGE_HINJAWADI_BOUNDARY,
  SURVEY_UNIT_01_BOUNDARY
} from '../../data/jurisdictionData';
import { 
  ROAD_NETWORKS,
  CoherentParcel, 
  CoherentBuilding, 
  CoherentGtPoint,
  DEMO_DATA_DISCLAIMER
} from '../../data/coherentPuneDataset';
import { HINJAWADI_REAL_BUILDINGS } from '../../data/hinjawadiRealBuildings';
import { apiClient } from '../../services/apiClient';
import { useSelectionStore } from '../../services/selectionStore';
import { calculateGeodesicDistance, calculatePolygonArea } from '../../services/spatialMath';
import { 
  Layers, 
  Ruler, 
  MapPin, 
  Crosshair, 
  Compass, 
  Eye, 
  RotateCcw, 
  Info,
  Sliders,
  CheckCircle2,
  Navigation
} from 'lucide-react';

// Fix default Leaflet marker assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface RealGisMapProps {
  height?: string;
  onParcelSelect?: (parcel: CoherentParcel) => void;
  enableDrawMode?: boolean;
  onDrawPolygonComplete?: (coords: [number, number][]) => void;
  enableSplitMode?: boolean;
  onSplitLineComplete?: (line: [number, number][]) => void;
  splitCuttingLine?: [number, number][];
}

export const RealGisMap: React.FC<RealGisMapProps> = ({
  height = '560px',
  onParcelSelect,
  enableDrawMode = false,
  onDrawPolygonComplete,
  enableSplitMode = false,
  onSplitLineComplete,
  splitCuttingLine
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseTileRef = useRef<L.TileLayer | null>(null);

  // Layer groups
  const adminBoundariesGroupRef = useRef<L.FeatureGroup | null>(null);
  const parcelsGroupRef = useRef<L.FeatureGroup | null>(null);
  const selectedParcelOverlayRef = useRef<L.FeatureGroup | null>(null);
  const buildingsGroupRef = useRef<L.FeatureGroup | null>(null);
  const gtPointsGroupRef = useRef<L.FeatureGroup | null>(null);
  const measureLayerRef = useRef<L.FeatureGroup | null>(null);
  const drawLayerRef = useRef<L.FeatureGroup | null>(null);
  const animatedSelectionGroupRef = useRef<L.FeatureGroup | null>(null);

  const lastAnimatedBuildingIdRef = useRef<string | null>(null);
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Global selection store
  const [selection, selectStore] = useSelectionStore();

  // Local state
  const [parcels, setParcels] = useState<CoherentParcel[]>([]);
  const [buildings, setBuildings] = useState<CoherentBuilding[]>([]);
  const [gtPoints, setGtPoints] = useState<CoherentGtPoint[]>([]);

  // Layer toggles
  const [basemapType, setBasemapType] = useState<'satellite' | 'street'>('satellite');
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showParcels, setShowParcels] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showGtPoints, setShowGtPoints] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showVerificationStatus, setShowVerificationStatus] = useState(false);

  // Coordinates readout
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number; utmX: number; utmY: number }>({
    lat: 18.5847,
    lng: 73.7376,
    utmX: 366740,
    utmY: 2055120
  });

  // Real measurement tools
  const [measureMode, setMeasureMode] = useState<'NONE' | 'DISTANCE' | 'AREA'>('NONE');
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [measuredValue, setMeasuredValue] = useState<string | null>(null);

  // Draw plot points
  const [drawVertices, setDrawVertices] = useState<[number, number][]>([]);

  // Refs for current handler states
  const measureModeRef = useRef(measureMode);
  measureModeRef.current = measureMode;
  const enableDrawModeRef = useRef(enableDrawMode);
  enableDrawModeRef.current = enableDrawMode;
  const enableSplitModeRef = useRef(enableSplitMode);
  enableSplitModeRef.current = enableSplitMode;
  const onSplitLineCompleteRef = useRef(onSplitLineComplete);
  onSplitLineCompleteRef.current = onSplitLineComplete;
  const onDrawPolygonCompleteRef = useRef(onDrawPolygonComplete);
  onDrawPolygonCompleteRef.current = onDrawPolygonComplete;
  const splitPointsRef = useRef<[number, number][]>([]);

  // Load dataset
  useEffect(() => {
    async function loadData() {
      const p = await apiClient.getParcels();
      const b = await apiClient.getBuildings();
      const g = await apiClient.getGtPoints();
      setParcels(p);
      setBuildings(b);
      setGtPoints(g);
    }
    loadData();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    // Centered around Surveyor Pune Assigned Zone (Hinjawadi Phase 1 / I2IT Campus Anchor)
    const map = L.map(mapContainerRef.current, {
      center: [18.584728, 73.737562],
      zoom: 17,
      zoomControl: true,
      attributionControl: false
    });
    mapRef.current = map;

    // Basemap: High-resolution Esri World Imagery (Satellite) by default
    const satelliteTile = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 20 }
    );
    const streetTile = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19 }
    );

    if (basemapType === 'satellite') {
      satelliteTile.addTo(map);
      baseTileRef.current = satelliteTile;
    } else {
      streetTile.addTo(map);
      baseTileRef.current = streetTile;
    }

    // Initialize feature groups in strict stacking order
    adminBoundariesGroupRef.current = L.featureGroup().addTo(map);
    parcelsGroupRef.current = L.featureGroup().addTo(map);
    buildingsGroupRef.current = L.featureGroup().addTo(map);
    selectedParcelOverlayRef.current = L.featureGroup().addTo(map);
    gtPointsGroupRef.current = L.featureGroup().addTo(map);
    measureLayerRef.current = L.featureGroup().addTo(map);
    drawLayerRef.current = L.featureGroup().addTo(map);
    animatedSelectionGroupRef.current = L.featureGroup().addTo(map);

    // Mouse coordinates tracker
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const utmX = Math.round(500000 + (lng - 75.0) * 111320 * Math.cos((lat * Math.PI) / 180));
      const utmY = Math.round(lat * 110574);
      setCursorCoords({
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
        utmX,
        utmY
      });
    });

    // Map click handler for measurement / drawing / splitting
    map.on('click', (e: L.LeafletMouseEvent) => {
      const pt: [number, number] = [e.latlng.lng, e.latlng.lat];

      if (measureModeRef.current === 'DISTANCE') {
        setMeasurePoints(prev => {
          const next = [...prev, pt];
          if (next.length >= 2) {
            let totalDist = 0;
            for (let i = 0; i < next.length - 1; i++) {
              totalDist += calculateGeodesicDistance(next[i], next[i + 1]);
            }
            setMeasuredValue(`Total Distance: ${totalDist.toFixed(2)} meters`);
          }
          return next;
        });
      } else if (measureModeRef.current === 'AREA') {
        setMeasurePoints(prev => {
          const next = [...prev, pt];
          if (next.length >= 3) {
            const area = calculatePolygonArea(next);
            setMeasuredValue(`Polygon Area: ${area.toFixed(2)} m²`);
          }
          return next;
        });
      } else if (enableDrawModeRef.current) {
        setDrawVertices(prev => {
          const next = [...prev, pt];
          if (onDrawPolygonCompleteRef.current && next.length >= 3) {
            onDrawPolygonCompleteRef.current(next);
          }
          return next;
        });
      } else if (enableSplitModeRef.current) {
        splitPointsRef.current.push(pt);
        if (splitPointsRef.current.length >= 2) {
          const line = [splitPointsRef.current[0], splitPointsRef.current[1]] as [number, number][];
          splitPointsRef.current = [];
          if (onSplitLineCompleteRef.current) {
            onSplitLineCompleteRef.current(line);
          }
        }
      }
    });

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      map.remove();
      mapRef.current = null;
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // Update Basemap Switcher
  useEffect(() => {
    if (!mapRef.current) return;
    if (baseTileRef.current) {
      mapRef.current.removeLayer(baseTileRef.current);
    }

    if (basemapType === 'satellite') {
      const tile = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 20 }
      ).addTo(mapRef.current);
      baseTileRef.current = tile;
    } else {
      const tile = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19 }
      ).addTo(mapRef.current);
      baseTileRef.current = tile;
    }
  }, [basemapType]);

  // ---------------------------------------------------------------------------
  // 1. RENDER OFFICIAL ADMINISTRATIVE BOUNDARIES (ULB, Village, Assigned Survey Unit)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const group = adminBoundariesGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showBoundaries) return;

    // A. Urban Local Body (ULB) Boundary: PMRDA Hinjawadi Sector (Dashed Orange)
    const ulbLatLngs = ULB_PMRDA_HINJAWADI_BOUNDARY.coordinates[0].map(pt => [pt[1], pt[0]] as [number, number]);
    L.polygon(ulbLatLngs, {
      color: '#f97316',
      weight: 2.5,
      fill: false,
      dashArray: '6, 6'
    }).addTo(group).bindTooltip(
      '<div style="font-weight:700; color:#ea580c;">🏛️ Urban Local Body: PMRDA Pune (270410)</div><div style="font-size:11px; color:#475569;">Special Planning Area Jurisdiction</div>',
      { sticky: true }
    );

    // B. Village Area Boundary: Hinjawadi Revenue Village (Dashed Purple)
    const vilLatLngs = VILLAGE_HINJAWADI_BOUNDARY.coordinates[0].map(pt => [pt[1], pt[0]] as [number, number]);
    L.polygon(vilLatLngs, {
      color: '#a855f7',
      weight: 2.5,
      fill: false,
      dashArray: '8, 4'
    }).addTo(group).bindTooltip(
      '<div style="font-weight:700; color:#7e22ce;">🏡 Village Boundary: Hinjawadi Village (411057)</div><div style="font-size:11px; color:#475569;">Mulshi Taluka, Pune Revenue Cadastre</div>',
      { sticky: true }
    );

    // C. Assigned Survey Unit Boundary: Survey Unit 01 (Solid Glowing Cyan/Blue)
    const suLatLngs = SURVEY_UNIT_01_BOUNDARY.coordinates[0].map(pt => [pt[1], pt[0]] as [number, number]);
    L.polygon(suLatLngs, {
      color: '#0284c7',
      weight: 3.2,
      fill: true,
      fillColor: '#0284c7',
      fillOpacity: 0.05
    }).addTo(group).bindTooltip(
      '<div style="font-weight:800; color:#0369a1;">🎯 Assigned Survey Unit: SU-01 (348671)</div><div style="font-size:11px; color:#1e293b; font-weight:600;">Assigned to: Surveyor Pune (Hinjawadi Phase 1)</div>',
      { permanent: false, sticky: true }
    );

    // Road Networks
    if (showRoads) {
      ROAD_NETWORKS.forEach(road => {
        const lineLatLngs = road.coordinates.map(pt => [pt[1], pt[0]] as [number, number]);
        L.polyline(lineLatLngs, {
          color: '#cbd5e1',
          weight: 4,
          opacity: 0.6
        }).addTo(group).bindTooltip(road.name, { sticky: true });
      });
    }
  }, [showBoundaries, showRoads]);

  // ---------------------------------------------------------------------------
  // 2. RENDER CADASTRAL PARCELS LAYER (Thin Yellow Lines matching Image 2)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const group = parcelsGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showParcels) return;

    parcels.forEach(parcel => {
      const ring = parcel.geometry.coordinates[0];
      const latLngs = ring.map(pt => [pt[1], pt[0]] as [number, number]);

      // NAKSHA Official Cadastral Styling: Crisp thin yellow lines
      let strokeColor = '#facc15'; // Amber-400 crisp yellow
      let fillColor = 'transparent';
      let fillOpacity = 0.0;
      let weight = 1.6;

      if (showVerificationStatus) {
        if (parcel.verificationStatus === 'Verified') {
          strokeColor = '#22c55e';
          fillColor = '#16a34a';
          fillOpacity = 0.15;
        } else if (parcel.verificationStatus === 'Disputed') {
          strokeColor = '#ef4444';
          fillColor = '#dc2626';
          fillOpacity = 0.2;
        } else {
          strokeColor = '#f59e0b';
          fillColor = '#d97706';
          fillOpacity = 0.15;
        }
      }

      const poly = L.polygon(latLngs, {
        color: strokeColor,
        weight: weight,
        fillColor: fillColor,
        fillOpacity: fillOpacity
      }).addTo(group);

      poly.bindTooltip(
        `<div style="font-weight:700; color:#1e293b;">Plot ${parcel.plotNo} (${parcel.parcelId})</div><div style="font-size:11px; color:#475569;">Area: ${parcel.areaSqm.toFixed(2)} m² • Khasra: ${parcel.khasraNo}</div>`,
        { sticky: true }
      );

      poly.on('click', () => {
        selectStore.selectParcel(parcel.parcelId, { lat: latLngs[0][0], lng: latLngs[0][1] });
        if (onParcelSelect) onParcelSelect(parcel);
      });
    });
  }, [parcels, showParcels, showVerificationStatus]);

  // ---------------------------------------------------------------------------
  // 3. RENDER SELECTED PARCEL OVERLAY (Emerald Highlight, Vertex Badges & Segment Distances)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const group = selectedParcelOverlayRef.current;
    if (!group) return;
    group.clearLayers();

    if (!selection.selectedParcelId) return;

    const selectedParcel = parcels.find(p => p.parcelId === selection.selectedParcelId);
    if (!selectedParcel) return;

    const ring = selectedParcel.geometry.coordinates[0];
    const latLngs = ring.map(pt => [pt[1], pt[0]] as [number, number]);

    // Highlight polygon matching Image 2 (translucent green with emerald outline)
    L.polygon(latLngs, {
      color: '#10b981',
      weight: 2.2,
      fillColor: '#22c55e',
      fillOpacity: 0.28
    }).addTo(group);

    // Numbered vertex markers (white circle, green border, bold number 1, 2, 3...)
    latLngs.forEach((pt, idx) => {
      // Exclude duplicated closing coordinate if identical to first
      if (idx === latLngs.length - 1 && pt[0] === latLngs[0][0] && pt[1] === latLngs[0][1]) {
        return;
      }
      const icon = L.divIcon({
        className: 'cadastral-vertex-icon',
        html: `<div style="
          background:#ffffff;
          color:#065f46;
          border:1.8px solid #059669;
          border-radius:50%;
          width:22px;
          height:22px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:10px;
          font-weight:800;
          box-shadow:0 2px 4px rgba(0,0,0,0.3);
        ">${idx + 1}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      L.marker(pt, { icon, interactive: false }).addTo(group);
    });

    // Edge segment distance labels (e.g. 9.39 M, 8.08 M, 11.27 M) along each edge midpoint
    for (let i = 0; i < ring.length - 1; i++) {
      const p1 = ring[i];
      const p2 = ring[i + 1];
      const distM = calculateGeodesicDistance(p1, p2);
      if (distM > 1.0) { // Only show label if edge is significant
        const midLng = (p1[0] + p2[0]) / 2;
        const midLat = (p1[1] + p2[1]) / 2;

        const labelIcon = L.divIcon({
          className: 'cadastral-edge-label',
          html: `<div style="
            background:rgba(15, 23, 42, 0.88);
            color:#ffffff;
            padding:1.5px 5.5px;
            border-radius:4px;
            font-size:9.5px;
            font-weight:700;
            white-space:nowrap;
            border:0.5px solid rgba(255,255,255,0.4);
            box-shadow:0 1px 3px rgba(0,0,0,0.4);
            letter-spacing:0.3px;
          ">${distM.toFixed(2)} M</div>`,
          iconSize: [50, 16],
          iconAnchor: [25, 8]
        });

        L.marker([midLat, midLng], { icon: labelIcon, interactive: false }).addTo(group);
      }
    }
  }, [selection.selectedParcelId, parcels]);

  // ---------------------------------------------------------------------------
  // 4. RENDER REAL BUILDING FOOTPRINTS (317+ Hinjawadi Homes & Complexes)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const group = buildingsGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showBuildings) return;

    // Render 317 real vector buildings from Hinjawadi OSM dataset
    HINJAWADI_REAL_BUILDINGS.forEach(bld => {
      const latLngs = bld.coordinates.map(pt => [pt[1], pt[0]] as [number, number]);

      L.polygon(latLngs, {
        color: '#38bdf8', // Clean Sky Blue thin outline
        weight: 1.2,
        fillColor: '#38bdf8',
        fillOpacity: 0.12,
        opacity: 0.85
      }).addTo(group).bindTooltip(
        `<div style="font-weight:700; color:#0369a1;">${bld.name}</div><div style="font-size:11px; color:#334155;">Type: ${bld.buildingType} • Floors: ${bld.floors} (Ht: ${bld.approxHeightM.toFixed(1)}m)</div>`,
        { sticky: true }
      );
    });

    // Also overlay seed detailed buildings
    buildings.forEach(bld => {
      const ring = bld.geometry.coordinates[0];
      const latLngs = ring.map(pt => [pt[1], pt[0]] as [number, number]);
      const isParentSelected = bld.parcelId === selection.selectedParcelId;

      L.polygon(latLngs, {
        color: isParentSelected ? '#f59e0b' : '#60a5fa',
        weight: isParentSelected ? 2.5 : 1.4,
        fillColor: isParentSelected ? '#f59e0b' : '#60a5fa',
        fillOpacity: isParentSelected ? 0.35 : 0.18
      }).addTo(group).bindTooltip(
        `<div style="font-weight:700; color:#1e293b;">${bld.buildingName}</div><div style="font-size:11px; color:#475569;">Floors: ${bld.totalFloors} (Ht: ${bld.approxHeightM}m) • Footprint: ${bld.footprintAreaSqm} m²</div>`,
        { sticky: true }
      );
    });
  }, [buildings, showBuildings, selection.selectedParcelId]);

  // ---------------------------------------------------------------------------
  // 5. RENDER GROUND TRUTH (GT) POINTS (DGPS RTK Control Points)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const group = gtPointsGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showGtPoints) return;

    gtPoints.forEach(pt => {
      // Color coded by sequence/status
      const isAnchor = pt.seqNo <= 3;
      const markerColor = isAnchor ? '#06b6d4' : '#ef4444';

      const circle = L.circleMarker([pt.lat, pt.lng], {
        radius: 5,
        color: '#ffffff',
        weight: 1.6,
        fillColor: markerColor,
        fillOpacity: 1
      }).addTo(group);

      circle.bindTooltip(
        `<div style="font-weight:800; color:#0e7490;">📍 GT Point #${pt.seqNo} (Plot ${pt.plotNo})</div><div style="font-size:11px; color:#334155;">Elev: ${pt.elevationM}m MSL • Acc: ±${pt.accuracyM}m<br/>${pt.observationType}</div>`,
        { sticky: true }
      );
    });
  }, [gtPoints, showGtPoints]);

  // ---------------------------------------------------------------------------
  // 6. MEASUREMENT, DRAWING & SPLIT CUTTING LINE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const group = measureLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (measurePoints.length === 0) return;

    const latLngs = measurePoints.map(p => [p[1], p[0]] as [number, number]);
    latLngs.forEach((pt, i) => {
      L.circleMarker(pt, {
        radius: 4,
        color: '#f59e0b',
        fillColor: '#ffffff',
        fillOpacity: 1
      }).addTo(group).bindTooltip(`Pt ${i + 1}`);
    });

    if (measureMode === 'DISTANCE' && latLngs.length >= 2) {
      L.polyline(latLngs, { color: '#f59e0b', weight: 2.5 }).addTo(group);
    } else if (measureMode === 'AREA' && latLngs.length >= 3) {
      L.polygon(latLngs, { color: '#f59e0b', fillColor: '#fbbf24', fillOpacity: 0.35 }).addTo(group);
    }
  }, [measurePoints, measureMode]);

  useEffect(() => {
    const group = drawLayerRef.current;
    if (!group) return;
    group.clearLayers();

    if (drawVertices.length > 0) {
      const latLngs = drawVertices.map(p => [p[1], p[0]] as [number, number]);
      latLngs.forEach(pt => {
        L.circleMarker(pt, { radius: 5, color: '#10b981', fillColor: '#ffffff', fillOpacity: 1 }).addTo(group);
      });
      if (latLngs.length >= 2) {
        L.polyline(latLngs, { color: '#10b981', weight: 2.5 }).addTo(group);
      }
      if (latLngs.length >= 3) {
        L.polygon(latLngs, { color: '#10b981', fillColor: '#34d399', fillOpacity: 0.25 }).addTo(group);
      }
    }

    if (splitCuttingLine && splitCuttingLine.length >= 2) {
      const lineLatLngs = splitCuttingLine.map(p => [p[1], p[0]] as [number, number]);
      L.polyline(lineLatLngs, {
        color: '#ef4444',
        weight: 3,
        dashArray: '5, 5'
      }).addTo(group);

      lineLatLngs.forEach((pt, idx) => {
        const cutIcon = L.divIcon({
          className: 'cut-vertex',
          html: `<div style="background:#ef4444; color:#ffffff; width:12px; height:12px; border-radius:50%; border:2px solid #ffffff; box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        L.marker(pt, { icon: cutIcon }).addTo(group).bindTooltip(`Split Point ${idx + 1}`);
      });
    }
  }, [drawVertices, splitCuttingLine]);

  // FlyTo Target handler
  useEffect(() => {
    if (!mapRef.current || !selection.flyToTarget) return;
    mapRef.current.flyTo(
      [selection.flyToTarget.lat, selection.flyToTarget.lng],
      selection.flyToTarget.zoom || 18,
      { duration: 1.2 }
    );
  }, [selection.flyToTarget]);

  // Animated Building Selection (red polygon outline)
  useEffect(() => {
    const group = animatedSelectionGroupRef.current;
    const map = mapRef.current;
    if (!group || !map) return;

    const targetId = selection.animatedBuildingId;
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    group.clearLayers();

    if (!targetId) {
      lastAnimatedBuildingIdRef.current = null;
      return;
    }
    if (lastAnimatedBuildingIdRef.current === targetId) return;
    lastAnimatedBuildingIdRef.current = targetId;

    const building = buildings.find(b => b.buildingId === targetId);
    if (!building) return;

    const ring = building.geometry.coordinates[0];
    const latLngs: [number, number][] = ring.map(pt => [pt[1], pt[0]] as [number, number]);
    const closedRing = [...latLngs, latLngs[0]];

    const flyDelay = selection.flyToTarget ? 1500 : 0;
    const startTimeout = setTimeout(() => {
      let currentIdx = 0;
      const tracePolyline = L.polyline([], {
        color: '#ef4444',
        weight: 3.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(group);

      animationIntervalRef.current = setInterval(() => {
        if (currentIdx >= closedRing.length) {
          if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
          }
          let pulseCount = 0;
          const pulseInterval = setInterval(() => {
            pulseCount++;
            tracePolyline.setStyle({ weight: pulseCount % 2 === 0 ? 3.5 : 5.5 });
            if (pulseCount >= 6) clearInterval(pulseInterval);
          }, 300);
          return;
        }
        const pts = closedRing.slice(0, currentIdx + 1);
        tracePolyline.setLatLngs(pts);
        currentIdx++;
      }, 28);
    }, flyDelay);

    return () => {
      clearTimeout(startTimeout);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    };
  }, [selection.animatedBuildingId, buildings]);

  const handleCenterOnAssignedUnit = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([18.584728, 73.737562], 17.5, { duration: 1 });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height,
      minHeight: '500px',
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #cbd5e1',
      backgroundColor: '#f8fafc',
      fontFamily: 'inherit'
    }}>
      {/* Top Map Action Ribbon */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #cbd5e1',
        padding: '8px 14px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '12px',
        zIndex: 20
      }}>
        {/* Basemap Switcher & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, color: '#334155' }}>Basemap:</span>
          <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid #1976d2', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <button
              onClick={() => setBasemapType('satellite')}
              style={{
                padding: '4px 12px',
                fontSize: '11.5px',
                fontWeight: 600,
                border: 'none',
                backgroundColor: basemapType === 'satellite' ? '#1976d2' : '#ffffff',
                color: basemapType === 'satellite' ? '#ffffff' : '#1976d2',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Satellite (Esri)
            </button>
            <button
              onClick={() => setBasemapType('street')}
              style={{
                padding: '4px 12px',
                fontSize: '11.5px',
                fontWeight: 600,
                border: 'none',
                borderLeft: '1px solid #1976d2',
                backgroundColor: basemapType === 'street' ? '#1976d2' : '#ffffff',
                color: basemapType === 'street' ? '#ffffff' : '#1976d2',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Streets (OSM)
            </button>
          </div>

          <span style={{ color: '#cbd5e1' }}>|</span>

          {/* Layer Checks */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: '#334155', flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
              <input type="checkbox" checked={showBoundaries} onChange={e => setShowBoundaries(e.target.checked)} style={{ accentColor: '#0284c7', cursor: 'pointer' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#0284c7', display: 'inline-block' }}></span>
                Boundaries
              </span>
            </label>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
              <input type="checkbox" checked={showParcels} onChange={e => setShowParcels(e.target.checked)} style={{ accentColor: '#eab308', cursor: 'pointer' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#eab308', display: 'inline-block' }}></span>
                Cadastre (Yellow Lines)
              </span>
            </label>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
              <input type="checkbox" checked={showBuildings} onChange={e => setShowBuildings(e.target.checked)} style={{ accentColor: '#38bdf8', cursor: 'pointer' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#38bdf8', display: 'inline-block' }}></span>
                Buildings (317 Homes)
              </span>
            </label>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
              <input type="checkbox" checked={showGtPoints} onChange={e => setShowGtPoints(e.target.checked)} style={{ accentColor: '#06b6d4', cursor: 'pointer' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4', display: 'inline-block' }}></span>
                GT Points
              </span>
            </label>
          </div>
        </div>

        {/* Action / Measurement Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleCenterOnAssignedUnit}
            title="Recenter on Surveyor Pune Assigned Unit (Hinjawadi SU-01)"
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              border: '1px solid #bfdbfe',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8'
            }}
          >
            <Navigation size={13} color="#1d4ed8" /> Focus Survey Unit 01
          </button>

          <button
            onClick={() => {
              setMeasureMode(measureMode === 'DISTANCE' ? 'NONE' : 'DISTANCE');
              setMeasurePoints([]);
              setMeasuredValue(null);
            }}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              border: measureMode === 'DISTANCE' ? '1px solid #f59e0b' : '1px solid #cbd5e1',
              backgroundColor: measureMode === 'DISTANCE' ? '#fef3c7' : '#ffffff',
              color: measureMode === 'DISTANCE' ? '#92400e' : '#334155'
            }}
          >
            <Ruler size={13} color="#d97706" /> Measure Dist
          </button>

          <button
            onClick={() => {
              setMeasureMode(measureMode === 'AREA' ? 'NONE' : 'AREA');
              setMeasurePoints([]);
              setMeasuredValue(null);
            }}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              border: measureMode === 'AREA' ? '1px solid #f59e0b' : '1px solid #cbd5e1',
              backgroundColor: measureMode === 'AREA' ? '#fef3c7' : '#ffffff',
              color: measureMode === 'AREA' ? '#92400e' : '#334155'
            }}
          >
            <Layers size={13} color="#d97706" /> Measure Area
          </button>

          {(measurePoints.length > 0 || drawVertices.length > 0) && (
            <button
              onClick={() => {
                setMeasurePoints([]);
                setMeasuredValue(null);
                setMeasureMode('NONE');
                setDrawVertices([]);
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f1f5f9',
                cursor: 'pointer',
                color: '#475569'
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Measurement Readout Banner */}
      {measuredValue && (
        <div style={{
          position: 'absolute',
          top: '46px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#0f172a',
          color: '#38bdf8',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 700,
          zIndex: 25,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: '1px solid #0284c7'
        }}>
          {measuredValue}
        </div>
      )}

      {/* Main Map Container */}
      <div ref={mapContainerRef} style={{ flex: 1, width: '100%', height: '100%', minHeight: '450px' }} />

      {/* Map Legend Overlay matching Image 2 */}
      <div style={{
        position: 'absolute',
        bottom: '26px',
        left: '12px',
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        color: '#ffffff',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '10.5px',
        zIndex: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '0', borderBottom: '2px dashed #f97316' }}></span>
          <span>ULB: PMRDA Hinjawadi (270410)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '0', borderBottom: '2px dashed #a855f7' }}></span>
          <span>Village: Hinjawadi Revenue Area (411057)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '0', borderBottom: '2.5px solid #0284c7' }}></span>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>Assigned Unit: SU-01 (Surveyor Pune)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '0', borderBottom: '1.5px solid #facc15' }}></span>
          <span>Cadastral Plot (Thin Yellow Line)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '14px', height: '8px', backgroundColor: 'rgba(56,189,248,0.25)', border: '1px solid #38bdf8' }}></span>
          <span>Real Home / Building Footprint (317 Structures)</span>
        </div>
      </div>

      {/* Bottom Coordinates & Scale Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        borderTop: '1px solid #cbd5e1',
        padding: '3px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: '#475569',
        zIndex: 15
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span>Scale: <b>1 : 1,570</b></span>
          <span>Target: <b>Hinjawadi Phase 1 • SU-01 (348671)</b></span>
          <span>Sensor: <b>Drone LiDAR + DGPS RTK</b></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'monospace' }}>
          <span>Lat: <b>{cursorCoords.lat.toFixed(5)}° N</b></span>
          <span>Lng: <b>{cursorCoords.lng.toFixed(5)}° E</b></span>
          <span>UTM: <b>{cursorCoords.utmX}E, {cursorCoords.utmY}N (Zone 43N)</b></span>
        </div>
      </div>
    </div>
  );
};
