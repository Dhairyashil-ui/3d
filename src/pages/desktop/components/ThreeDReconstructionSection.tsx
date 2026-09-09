import React, { useState } from 'react';
import {
  Box,
  Layers,
  RotateCw,
  RotateCcw,
  Maximize2,
  Eye,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  ArrowUp,
  ArrowDown,
  Building2,
  Sparkles,
  GitCompare,
  Compass
} from 'lucide-react';
import {
  BuildingFloor3D,
  BuildingUnit3D,
  MOCK_RECONSTRUCTED_BUILDINGS,
  ReconstructedBuildingModel,
  SurveyProject
} from '../../../data/survey3dData';

interface ThreeDReconstructionSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const ThreeDReconstructionSection: React.FC<ThreeDReconstructionSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [buildings, setBuildings] = useState<ReconstructedBuildingModel[]>(MOCK_RECONSTRUCTED_BUILDINGS);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildings[0].id);

  // 3D Camera & Orientation State
  const [rotationAngle, setRotationAngle] = useState(35); // Deg
  const [pitchAngle, setPitchAngle] = useState(65); // Deg
  const [zoomScale, setZoomScale] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Camera Presets
  const [cameraPreset, setCameraPreset] = useState<'Perspective' | 'Top' | 'Side' | 'Section' | 'Cutaway'>('Perspective');

  // Layer Toggles
  const [layers, setLayers] = useState({
    pointCloud: true,
    lidar: true,
    photogrammetry: true,
    dsm: true,
    dem: false,
    buildingMesh: true,
    buildingFootprint: true
  });

  // Exploded Floor View
  const [isExploded, setIsExploded] = useState(true);
  const [explodedSpacing, setExplodedSpacing] = useState(55); // px
  const [selectedFloorLevel, setSelectedFloorLevel] = useState<number | 'all'>('all');
  const [selectedUnit, setSelectedUnit] = useState<BuildingUnit3D | null>(null);

  // Active Building
  const building = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  const setPreset = (preset: 'Perspective' | 'Top' | 'Side' | 'Section' | 'Cutaway') => {
    setCameraPreset(preset);
    if (preset === 'Perspective') {
      setRotationAngle(35);
      setPitchAngle(65);
    } else if (preset === 'Top') {
      setRotationAngle(0);
      setPitchAngle(0); // Looking straight down
    } else if (preset === 'Side') {
      setRotationAngle(0);
      setPitchAngle(90); // Looking horizontally
    } else if (preset === 'Section') {
      setRotationAngle(90);
      setPitchAngle(90);
    } else if (preset === 'Cutaway') {
      setRotationAngle(45);
      setPitchAngle(45);
      setIsExploded(true);
    }
  };

  const floorsToRender = selectedFloorLevel === 'all'
    ? building.floors
    : building.floors.filter((f) => f.floorLevel === selectedFloorLevel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
      {/* Cyan Header Banner */}
      <div style={{
        backgroundColor: '#06b6d4',
        backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #0284c7 100%)',
        color: '#ffffff',
        padding: '10px 18px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box size={16} />
          <span>3D Building Volumetric Reconstruction & Floor Extraction Workstation</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          NAKSHA V2.0 3D Spatial Hierarchy • LoD2 Volumetric Solid Modeling
        </div>
      </div>

      {/* Main 3D Workspace Layout: Left 3D Interactive Viewport + Right Spatial Hierarchy Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px' }}>
        {/* Left: 3D Orbit Viewport */}
        <div style={{
          backgroundColor: '#0a192f',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0a192f 100%)',
          border: '1px solid #334155',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          height: '560px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          userSelect: 'none'
        }}>
          {/* Viewport Top Bar: Building Anchor & Quick Controls */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '14px',
            right: '14px',
            zIndex: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            pointerEvents: 'none'
          }}>
            {/* Building Identity Card (ULPIN Anchor) */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '6px 12px',
              pointerEvents: 'auto',
              color: '#ffffff'
            }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800 }}>
                {building.buildingName} ({building.buildingCode})
              </div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', display: 'flex', gap: '8px', marginTop: '2px' }}>
                <span>Official ULPIN: <b style={{ color: '#38bdf8' }}>{building.officialUlpin}</b></span>
                <span>•</span>
                <span>Khasra: <b style={{ color: '#cbd5e1' }}>{building.parcelNo}</b></span>
              </div>
            </div>

            {/* Camera Controls & Presets */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'auto'
            }}>
              {/* Camera Presets Buttons */}
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                padding: '2px',
                display: 'flex',
                gap: '2px'
              }}>
                {(['Perspective', 'Top', 'Side', 'Cutaway'] as const).map((cp) => (
                  <button
                    key={cp}
                    onClick={() => setPreset(cp)}
                    style={{
                      backgroundColor: cameraPreset === cp ? '#0284c7' : 'transparent',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '3px 7px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {cp}
                  </button>
                ))}
              </div>

              {/* Exploded View Toggle */}
              <button
                onClick={() => setIsExploded(!isExploded)}
                style={{
                  backgroundColor: isExploded ? '#0284c7' : 'rgba(15, 23, 42, 0.85)',
                  color: '#ffffff',
                  border: isExploded ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Layers size={13} />
                <span>{isExploded ? 'Exploded: ON' : 'Exploded: OFF'}</span>
              </button>
            </div>
          </div>

          {/* Viewport Bottom Overlay: Rotation & Layer Toggles */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            right: '12px',
            zIndex: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            {/* Layer Toggles Strip */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              pointerEvents: 'auto',
              fontSize: '11px',
              color: '#ffffff'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.pointCloud}
                  onChange={(e) => setLayers((p) => ({ ...p, pointCloud: e.target.checked }))}
                />
                <span>Point Cloud</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.lidar}
                  onChange={(e) => setLayers((p) => ({ ...p, lidar: e.target.checked }))}
                />
                <span>LiDAR</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.buildingMesh}
                  onChange={(e) => setLayers((p) => ({ ...p, buildingMesh: e.target.checked }))}
                />
                <span>3D Solids</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.buildingFootprint}
                  onChange={(e) => setLayers((p) => ({ ...p, buildingFootprint: e.target.checked }))}
                />
                <span>Cadastral Footprint</span>
              </label>
            </div>

            {/* Rotation Controls */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'auto'
            }}>
              <button
                onClick={() => setRotationAngle((p) => (p - 15) % 360)}
                title="Rotate Left"
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => { setRotationAngle(35); setPitchAngle(65); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '10.5px', cursor: 'pointer' }}
              >
                Reset
              </button>
              <button
                onClick={() => setRotationAngle((p) => (p + 15) % 360)}
                title="Rotate Right"
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>

          {/* 3D Canvas Perspective Viewport */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1200px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* 3D Space Container */}
            <div style={{
              position: 'relative',
              width: '380px',
              height: '300px',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${pitchAngle}deg) rotateZ(${rotationAngle}deg) scale(${zoomScale})`,
              transition: 'transform 0.25s ease-out'
            }}>
              {/* Ground Cadastral Footprint Anchor */}
              {layers.buildingFootprint && (
                <div style={{
                  position: 'absolute',
                  width: '420px',
                  height: '340px',
                  left: '-20px',
                  top: '-20px',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  border: '2px dashed #22c55e',
                  boxShadow: '0 0 35px rgba(34, 197, 94, 0.25)',
                  transform: 'translateZ(-10px)',
                  borderRadius: '4px',
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '12px',
                    color: '#4ade80',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    transform: 'rotate(-45deg)'
                  }}>
                    PARCEL #{building.parcelNo} ({building.footprintAreaSqm} m²)
                  </div>
                </div>
              )}

              {/* Stacked 3D Building Floor Slices */}
              {floorsToRender.map((flr) => {
                const spacing = isExploded ? explodedSpacing : 28;
                const elevationZ = flr.floorLevel * spacing;

                return (
                  <div
                    key={flr.floorLevel}
                    style={{
                      position: 'absolute',
                      width: '360px',
                      height: '270px',
                      left: '10px',
                      top: '15px',
                      transformStyle: 'preserve-3d',
                      transform: `translateZ(${elevationZ}px)`,
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {/* Floor Slab Plate */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: flr.hasAnomaly
                        ? 'rgba(239, 68, 68, 0.18)'
                        : 'rgba(15, 23, 42, 0.7)',
                      border: flr.hasAnomaly
                        ? '2px solid #ef4444'
                        : '1.5px solid rgba(56, 189, 248, 0.65)',
                      boxShadow: flr.hasAnomaly
                        ? '0 0 25px rgba(239, 68, 68, 0.45)'
                        : '0 10px 30px rgba(0,0,0,0.5)',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '8px',
                      gap: '6px',
                      boxSizing: 'border-box'
                    }}>
                      {/* Floor Header Badge */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                        paddingBottom: '4px'
                      }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>
                          {flr.floorName}
                        </span>
                        <span style={{
                          backgroundColor: flr.hasAnomaly ? '#ef4444' : '#0284c7',
                          color: '#ffffff',
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '3px'
                        }}>
                          {flr.hasAnomaly ? '⚠️ MISMATCH' : `Elev: ${flr.elevationMeters}m`}
                        </span>
                      </div>

                      {/* Units Layout on this floor */}
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${flr.units.length}, 1fr)`, gap: '4px', flex: 1 }}>
                        {flr.units.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => setSelectedUnit(u)}
                            style={{
                              backgroundColor: selectedUnit?.id === u.id
                                ? '#0284c7'
                                : u.status === 'Unregistered'
                                  ? 'rgba(239, 68, 68, 0.25)'
                                  : 'rgba(255, 255, 255, 0.08)',
                              border: selectedUnit?.id === u.id
                                ? '1.5px solid #38bdf8'
                                : u.status === 'Unregistered'
                                  ? '1px dashed #f87171'
                                  : '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '4px',
                              padding: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff' }}>
                              {u.unitNumber}
                            </div>
                            <div style={{ fontSize: '9px', color: '#93c5fd' }}>
                              {u.carpetAreaSqm} m² ({u.useType})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Spatial Data Model Inspector (Hierarchy: Parcel -> Building -> Floor -> Unit -> 3D Volume) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflowY: 'auto',
          maxHeight: '560px'
        }}>
          {/* Spatial Model Heading */}
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f2b5c', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={16} color="#0284c7" />
              <span>3D Spatial Hierarchy Inspector</span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b' }}>
              Structured 3D Data Model (Official ULPIN Anchor)
            </div>
          </div>

          {/* Hierarchy Step 1: Parcel */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '8px 10px', fontSize: '11px' }}>
            <div style={{ fontWeight: 700, color: '#166534', display: 'flex', justifyContent: 'space-between' }}>
              <span>① PARCEL (Authoritative Anchor)</span>
              <span>Khasra #{building.parcelNo}</span>
            </div>
            <div style={{ color: '#14532d', marginTop: '2px' }}>
              Official ULPIN: <b style={{ color: '#0284c7' }}>{building.officialUlpin}</b> (Not redefined)
            </div>
          </div>

          {/* Hierarchy Step 2: Building */}
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '8px 10px', fontSize: '11px' }}>
            <div style={{ fontWeight: 700, color: '#1e40af', display: 'flex', justifyContent: 'space-between' }}>
              <span>② RECONSTRUCTED BUILDING</span>
              <span>ID: {building.id}</span>
            </div>
            <div style={{ color: '#1e3a8a', marginTop: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <div>Height: <b>{building.totalHeightMeters}m</b></div>
              <div>Footprint: <b>{building.footprintAreaSqm} m²</b></div>
              <div>Total Floors: <b>{building.totalFloors} Levels</b></div>
              <div>3D Volume: <b>{building.totalVolumeM3.toLocaleString()} m³</b></div>
              <div>Confidence: <b>{building.reconstructionConfidence}%</b></div>
              <div>Type: <b>{building.structuralType}</b></div>
            </div>
          </div>

          {/* Hierarchy Step 3: Floor Extraction Breakdown */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>③ Extracted Floors ({building.floors.length})</span>
              <span style={{ fontSize: '10.5px', color: '#0284c7' }}>Exploded Vertical Slicing</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {building.floors.map((flr) => (
                <div
                  key={flr.floorLevel}
                  onClick={() => setSelectedFloorLevel(selectedFloorLevel === flr.floorLevel ? 'all' : flr.floorLevel)}
                  style={{
                    backgroundColor: selectedFloorLevel === flr.floorLevel ? '#eff6ff' : '#f8fafc',
                    border: flr.hasAnomaly ? '1px solid #f87171' : '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: flr.hasAnomaly ? '#b91c1c' : '#0f2b5c' }}>
                    <span>{flr.floorName}</span>
                    <span>{flr.builtUpAreaSqm} m²</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '10px', marginTop: '2px' }}>
                    <span>Elevation: {flr.elevationMeters}m (H: {flr.heightMeters}m)</span>
                    <span>Confidence: {flr.confidencePct}%</span>
                  </div>
                  {flr.anomalyNotes && (
                    <div style={{ color: '#dc2626', fontSize: '10px', marginTop: '3px', fontWeight: 600 }}>
                      ⚠️ {flr.anomalyNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hierarchy Step 4: Unit / 3D Property Volume */}
          {selectedUnit && (
            <div style={{ backgroundColor: '#faf5ff', border: '1.5px solid #d8b4fe', borderRadius: '4px', padding: '8px 10px', fontSize: '11px' }}>
              <div style={{ fontWeight: 700, color: '#7e22ce', display: 'flex', justifyContent: 'space-between' }}>
                <span>④ PROPERTY UNIT / 3D VOLUME</span>
                <span>{selectedUnit.unitNumber}</span>
              </div>
              <div style={{ color: '#581c87', marginTop: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <div>Owner: <b>{selectedUnit.ownerName}</b></div>
                <div>Tax PIN: <b>{selectedUnit.taxAssessmentNo}</b></div>
                <div>Carpet Area: <b>{selectedUnit.carpetAreaSqm} m²</b></div>
                <div>3D Extruded Vol: <b>{selectedUnit.volume3dSqm} m³</b></div>
                <div>Status: <b style={{ color: selectedUnit.status === 'Verified' ? '#15803d' : '#b91c1c' }}>{selectedUnit.status}</b></div>
              </div>
            </div>
          )}

          {/* Action Buttons to Compare */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
            <button
              onClick={() => onNavigateSection('verification-architecture')}
              style={{
                flex: 1,
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '7px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <GitCompare size={13} />
              <span>Compare with Architecture CAD</span>
            </button>

            <button
              onClick={() => onNavigateSection('verification-anomalies')}
              style={{
                flex: 1,
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '7px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <AlertTriangle size={13} />
              <span>View Anomaly Queue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
