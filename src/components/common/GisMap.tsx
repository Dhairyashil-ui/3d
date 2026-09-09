import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  PUNE_AOI_BOUNDARY,
  PUNE_CADASTRAL_PARCELS,
  PUNE_PROPERTY_TAX_POINTS,
  PUNE_BUILDING_FOOTPRINTS,
  PUNE_CORS_STATION,
  DRONE_FLIGHT_PATH,
  CadastralParcel
} from '../../data/puneGeoData';
import { Layers, Maximize2, Ruler, MapPin, Eye, CheckCircle2 } from 'lucide-react';

// Fix default leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface GisMapProps {
  height?: string;
  showAoi?: boolean;
  showCadastral?: boolean;
  showTaxPoints?: boolean;
  showBuildings?: boolean;
  showDronePath?: boolean;
  activeParcelId?: string;
  onSelectParcel?: (parcel: CadastralParcel) => void;
  title?: string;
}

export const GisMap: React.FC<GisMapProps> = ({
  height = '500px',
  showAoi = true,
  showCadastral = true,
  showTaxPoints = false,
  showBuildings = false,
  showDronePath = false,
  activeParcelId,
  onSelectParcel,
  title = 'Geospatial Map Viewer (UTM 44N / WGS84)'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeBaseLayer, setActiveBaseLayer] = useState<'satellite' | 'street'>('satellite');
  const [layersVisible, setLayersVisible] = useState({
    aoi: showAoi,
    cadastral: showCadastral,
    taxPoints: showTaxPoints,
    buildings: showBuildings,
    dronePath: showDronePath
  });
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number; utmX: number; utmY: number }>({
    lat: 23.2422,
    lng: 77.4241,
    utmX: 747820,
    utmY: 2572180
  });
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [measureDistance, setMeasureDistance] = useState<number | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [23.2422, 77.4241],
      zoom: 16,
      zoomControl: true,
      attributionControl: false
    });

    mapInstanceRef.current = map;
    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;

    // Track mouse coordinates and convert to approx UTM 44N
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      // Approximate WGS84 to UTM Zone 44N coordinate calculation
      const utmX = Math.round(500000 + (lng - 81) * 111320 * Math.cos((lat * Math.PI) / 180));
      const utmY = Math.round(lat * 110574);
      setCoords({ lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)), utmX, utmY });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // Update Base Layer (Satellite vs Street)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (activeBaseLayer === 'satellite') {
      // ESRI World Imagery (High-Res Aerial/Satellite)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri'
      }).addTo(map);
    } else {
      // OpenStreetMap Standard
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    }
  }, [activeBaseLayer]);

  // Update Vector Overlays (AOI, Cadastral, Points, Buildings)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. AOI Boundary
    if (layersVisible.aoi) {
      const aoiPolygon = L.polygon(PUNE_AOI_BOUNDARY, {
        color: '#2563eb',
        weight: 3,
        dashArray: '6, 8',
        fillColor: '#3b82f6',
        fillOpacity: 0.08
      });
      aoiPolygon.bindTooltip('<b>Pune Metropolitan Region Development Authority AOI</b><br/>Code: 250946 | Projection: UTM 44N', {
        sticky: true
      });
      group.addLayer(aoiPolygon);
    }

    // 2. Cadastral Parcel Polygons
    if (layersVisible.cadastral) {
      PUNE_CADASTRAL_PARCELS.forEach((parcel) => {
        const isSelected = activeParcelId === parcel.id || selectedParcel?.id === parcel.id;
        const color = isSelected ? '#ef4444' : '#22c55e';
        const fillColor = isSelected ? '#f87171' : '#16a34a';

        const poly = L.polygon(parcel.coordinates, {
          color: isSelected ? '#dc2626' : '#eab308',
          weight: isSelected ? 3 : 2,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.6 : 0.38
        });

        // Click popup with full details
        const popupContent = `
          <div style="font-family: Inter, sans-serif; font-size: 13px; min-width: 220px;">
            <div style="background: #1b539c; color: white; padding: 6px 10px; border-radius: 4px 4px 0 0; font-weight: 600; display: flex; justify-content: space-between;">
              <span>Plot ${parcel.plotNo}</span>
              <span style="font-size: 11px; background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 3px;">${parcel.landUse}</span>
            </div>
            <div style="padding: 8px 10px; background: #fff; border: 1px solid #e2e8f0; border-top: none;">
              <p style="margin: 3px 0;"><b>ULPIN:</b> <code style="color: #2563eb;">${parcel.ulpin}</code></p>
              <p style="margin: 3px 0;"><b>Owner:</b> ${parcel.ownerName}</p>
              <p style="margin: 3px 0;"><b>Father/Husband:</b> ${parcel.fatherHusbandName}</p>
              <p style="margin: 3px 0;"><b>Area:</b> ${parcel.areaSqMeters} m² (${parcel.areaSqFt} sq.ft)</p>
              <p style="margin: 3px 0;"><b>Tax No:</b> ${parcel.taxAssessmentNo}</p>
              <p style="margin: 3px 0;"><b>RoR Status:</b> <span style="color: ${parcel.rorStatus === 'Final Published' ? '#16a34a' : '#d97706'}; font-weight: 600;">${parcel.rorStatus}</span></p>
            </div>
          </div>
        `;

        poly.bindPopup(popupContent);
        poly.on('click', () => {
          setSelectedParcel(parcel);
          if (onSelectParcel) onSelectParcel(parcel);
        });

        // Center marker for Plot No label
        const center = poly.getBounds().getCenter();
        const labelIcon = L.divIcon({
          className: 'cadastral-label',
          html: `<div style="background: rgba(0,0,0,0.75); color: #fff; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 3px; border: 1px solid #facc15; white-space: nowrap;">${parcel.plotNo}</div>`,
          iconSize: [40, 16],
          iconAnchor: [20, 8]
        });
        const labelMarker = L.marker(center, { icon: labelIcon, interactive: false });

        group.addLayer(poly);
        group.addLayer(labelMarker);
      });
    }

    // 3. Property Tax Points
    if (layersVisible.taxPoints) {
      PUNE_PROPERTY_TAX_POINTS.forEach((pt) => {
        const marker = L.circleMarker([pt.lat, pt.lng], {
          radius: 7,
          fillColor: '#8b5cf6',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        });
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px;">
            <b style="color: #7c3aed;">Property Tax Point</b><br/>
            <b>PIN:</b> ${pt.pin}<br/>
            <b>Owner:</b> ${pt.owner}<br/>
            <b>Tax:</b> ₹${pt.taxAmount.toLocaleString()}<br/>
            <b>Address:</b> ${pt.address}
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 4. Building Footprints
    if (layersVisible.buildings) {
      PUNE_BUILDING_FOOTPRINTS.forEach((bldg) => {
        const poly = L.polygon(bldg.coordinates, {
          color: '#ea580c',
          weight: 2,
          fillColor: '#f97316',
          fillOpacity: 0.6
        });
        poly.bindTooltip(`Building ${bldg.bldgNo} (${bldg.floors} floors, ${bldg.heightMeters}m)`, { sticky: true });
        group.addLayer(poly);
      });
    }

    // 5. Drone Flight Paths & CORS Station
    if (layersVisible.dronePath) {
      const flightLine = L.polyline(DRONE_FLIGHT_PATH, {
        color: '#06b6d4',
        weight: 3,
        dashArray: '5, 5'
      });
      flightLine.bindTooltip('Drone Photogrammetry Flight Trajectory (GSD: 2.5cm)', { sticky: true });
      group.addLayer(flightLine);

      // CORS Station Marker
      const corsIcon = L.divIcon({
        className: 'cors-icon',
        html: `<div style="background: #dc2626; color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 10px rgba(220,38,38,0.8);">📡 CORS</div>`,
        iconSize: [55, 20]
      });
      const corsMarker = L.marker([PUNE_CORS_STATION.lat, PUNE_CORS_STATION.lng], { icon: corsIcon });
      corsMarker.bindPopup(`<b>${PUNE_CORS_STATION.name}</b><br/>Accuracy: ${PUNE_CORS_STATION.accuracyMm}<br/>Elevation: ${PUNE_CORS_STATION.elevationMeters}m`);
      group.addLayer(corsMarker);
    }
  }, [layersVisible, activeParcelId, selectedParcel, onSelectParcel]);

  // Interactive Measurement tool
  const toggleMeasurement = () => {
    setIsMeasuring(!isMeasuring);
    setMeasurePoints([]);
    setMeasureDistance(null);
  };

  const resetMapBounds = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([23.2422, 77.4241], 16);
    }
  };

  return (
    <div className="gis-map-wrapper" style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
      {/* Top Map Action Bar */}
      <div className="map-toolbar" style={{
        background: '#1b539c',
        color: '#ffffff',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '13px',
        fontWeight: 500
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} />
          <span>{title}</span>
          <span style={{ fontSize: '11px', background: '#3b82f6', padding: '2px 8px', borderRadius: '12px' }}>EPSG:32644 (UTM 44N)</span>
        </div>

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Base Layer Switcher */}
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '4px', padding: '2px', display: 'flex' }}>
            <button
              onClick={() => setActiveBaseLayer('satellite')}
              style={{
                background: activeBaseLayer === 'satellite' ? '#ffffff' : 'transparent',
                color: activeBaseLayer === 'satellite' ? '#1b539c' : '#ffffff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Satellite
            </button>
            <button
              onClick={() => setActiveBaseLayer('street')}
              style={{
                background: activeBaseLayer === 'street' ? '#ffffff' : 'transparent',
                color: activeBaseLayer === 'street' ? '#1b539c' : '#ffffff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Street
            </button>
          </div>

          {/* Reset View */}
          <button
            onClick={resetMapBounds}
            title="Reset View to Pune"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            <Maximize2 size={14} /> Center
          </button>
        </div>
      </div>

      {/* Map Element */}
      <div ref={mapContainerRef} style={{ height, width: '100%', backgroundColor: '#0f172a' }} />

      {/* Floating Layer Controls */}
      <div style={{
        position: 'absolute',
        top: '52px',
        right: '12px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(4px)',
        borderRadius: '6px',
        padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
        fontSize: '12px',
        border: '1px solid #e2e8f0',
        minWidth: '165px'
      }}>
        <div style={{ fontWeight: 700, color: '#1b539c', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} /> Layer Switcher
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layersVisible.aoi}
              onChange={(e) => setLayersVisible({ ...layersVisible, aoi: e.target.checked })}
            />
            <span>AOI Boundary (Pune)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layersVisible.cadastral}
              onChange={(e) => setLayersVisible({ ...layersVisible, cadastral: e.target.checked })}
            />
            <span>Cadastral Parcels</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layersVisible.taxPoints}
              onChange={(e) => setLayersVisible({ ...layersVisible, taxPoints: e.target.checked })}
            />
            <span>Property Tax Points</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layersVisible.buildings}
              onChange={(e) => setLayersVisible({ ...layersVisible, buildings: e.target.checked })}
            />
            <span>Building Footprints</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layersVisible.dronePath}
              onChange={(e) => setLayersVisible({ ...layersVisible, dronePath: e.target.checked })}
            />
            <span>Drone Survey Track</span>
          </label>
        </div>
      </div>

      {/* Bottom Coordinates & Projection Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.85)',
        color: '#e2e8f0',
        padding: '4px 12px',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'monospace'
      }}>
        <div>
          <span>Lat: <b>{coords.lat}° N</b></span>
          <span style={{ marginLeft: '12px' }}>Lng: <b>{coords.lng}° E</b></span>
          <span style={{ marginLeft: '12px', color: '#38bdf8' }}>UTM X: <b>{coords.utmX}m</b></span>
          <span style={{ marginLeft: '12px', color: '#38bdf8' }}>UTM Y: <b>{coords.utmY}m</b></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#4ade80' }}>● Survey Datum: WGS84 / UTM Zone 44N</span>
          <span>Scale: 1:1,000</span>
        </div>
      </div>

      {/* Selected Parcel Inspector Panel (if selected) */}
      {selectedParcel && (
        <div style={{
          position: 'absolute',
          bottom: '36px',
          left: '12px',
          zIndex: 1000,
          background: '#ffffff',
          borderRadius: '6px',
          padding: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          border: '2px solid #22c55e',
          maxWidth: '300px',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: '#1b539c' }}>Plot {selectedParcel.plotNo}</span>
            <button
              onClick={() => setSelectedParcel(null)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: '#64748b' }}
            >
              ✕
            </button>
          </div>
          <div><b>ULPIN:</b> {selectedParcel.ulpin}</div>
          <div><b>Owner:</b> {selectedParcel.ownerName}</div>
          <div><b>Area:</b> {selectedParcel.areaSqMeters} m² ({selectedParcel.areaSqFt} sq.ft)</div>
          <div><b>Status:</b> <span style={{ color: '#16a34a', fontWeight: 600 }}>{selectedParcel.rorStatus}</span></div>
        </div>
      )}
    </div>
  );
};
