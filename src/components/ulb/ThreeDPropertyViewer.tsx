import React, { useState } from 'react';
import {
  Building3DModel,
  BuildingFloor,
  PropertyUnit
} from '../../data/ulbData';
import {
  Maximize2,
  Minimize2,
  Layers,
  Eye,
  RotateCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ShieldAlert,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface ThreeDPropertyViewerProps {
  building: Building3DModel;
  selectedUnitId?: string;
  onSelectUnit?: (unit: PropertyUnit) => void;
  height?: string;
}

export const ThreeDPropertyViewer: React.FC<ThreeDPropertyViewerProps> = ({
  building,
  selectedUnitId,
  onSelectUnit,
  height = '560px'
}) => {
  // 3D Controls
  const [rotationAngle, setRotationAngle] = useState(35); // degrees
  const [pitchAngle, setPitchAngle] = useState(65); // degrees tilt
  const [isExploded, setIsExploded] = useState(true); // Exploded/Cutaway view
  const [activeFloorLevel, setActiveFloorLevel] = useState<number | 'all'>('all');
  const [showFootprint, setShowFootprint] = useState(true);
  const [showHeightMarkers, setShowHeightMarkers] = useState(true);
  const [hoveredUnit, setHoveredUnit] = useState<PropertyUnit | null>(null);
  const [inspectedUnit, setInspectedUnit] = useState<PropertyUnit | null>(
    building.floors.flatMap(f => f.units).find(u => u.id === selectedUnitId) || null
  );

  const handleUnitClick = (unit: PropertyUnit) => {
    setInspectedUnit(unit);
    if (onSelectUnit) onSelectUnit(unit);
  };

  const floorsToRender = activeFloorLevel === 'all'
    ? building.floors
    : building.floors.filter(f => f.floorLevel === activeFloorLevel);

  return (
    <div style={{
      position: 'relative',
      height,
      backgroundColor: '#0a192f',
      backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
      borderRadius: '10px',
      overflow: 'hidden',
      border: '1px solid #334155',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none'
    }}>
      {/* Top Floating Action Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        right: '14px',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        pointerEvents: 'none'
      }}>
        {/* Left: Building Header & ULPIN Anchor */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          padding: '8px 14px',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#f8fafc' }}>
                {building.buildingName}
              </span>
              <span style={{
                backgroundColor: '#0ea5e9',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                {building.buildingCode}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>Official ULPIN: <b style={{ color: '#38bdf8' }}>{building.officialUlpin}</b></span>
              <span>•</span>
              <span>Parcel No: <b style={{ color: '#cbd5e1' }}>{building.parcelNo}</b></span>
            </div>
          </div>
        </div>

        {/* Right: Controls (Exploded View, Rotate, Floor Selector) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto'
        }}>
          {/* Exploded / Cutaway Toggle Button */}
          <button
            onClick={() => setIsExploded(!isExploded)}
            title="Toggle Exploded Vertical Cutaway View"
            style={{
              backgroundColor: isExploded ? '#0284c7' : 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              border: isExploded ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            <Layers size={14} />
            <span>{isExploded ? 'Exploded View: ON' : 'Exploded View: OFF'}</span>
          </button>

          {/* Rotation Controls */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setRotationAngle(prev => (prev - 15) % 360)}
              title="Rotate Left"
              style={{ background: 'transparent', border: 'none', color: '#f8fafc', padding: '6px 10px', cursor: 'pointer' }}
            >
              ⟲
            </button>
            <button
              onClick={() => { setRotationAngle(35); setPitchAngle(65); }}
              title="Reset 3D Angle"
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '11px', padding: '6px 6px', cursor: 'pointer' }}
            >
              Reset
            </button>
            <button
              onClick={() => setRotationAngle(prev => (prev + 15) % 360)}
              title="Rotate Right"
              style={{ background: 'transparent', border: 'none', color: '#f8fafc', padding: '6px 10px', cursor: 'pointer' }}
            >
              ⟳
            </button>
          </div>

          {/* Floor Level Quick Filter */}
          <select
            value={activeFloorLevel}
            onChange={(e) => setActiveFloorLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">All Floors ({building.totalFloors})</option>
            {building.floors.map(f => (
              <option key={f.floorLevel} value={f.floorLevel}>
                {f.floorName} {f.hasAnomaly ? '⚠️' : '✓'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center 3D Isometric Viewport */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Spatial Floor Stacking Container */}
        <div style={{
          position: 'relative',
          width: '420px',
          height: '320px',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${pitchAngle}deg) rotateZ(${rotationAngle}deg)`,
          transition: 'transform 0.2s ease-out'
        }}>
          {/* Ground Parcel Footprint Anchor */}
          {showFootprint && (
            <div style={{
              position: 'absolute',
              width: '460px',
              height: '360px',
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
                bottom: '10px',
                right: '12px',
                color: '#4ade80',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1px',
                transform: 'rotate(-45deg)'
              }}>
                CADASTRAL PARCEL #{building.parcelNo} ({building.footprintAreaSqm} m²)
              </div>
            </div>
          )}

          {/* Vertical Floors */}
          {floorsToRender.map((floor) => {
            // Calculate vertical elevation in exploded or normal view
            const floorSpacing = isExploded ? 65 : 32;
            const elevationZ = floor.floorLevel * floorSpacing;

            return (
              <div
                key={floor.floorLevel}
                style={{
                  position: 'absolute',
                  width: '400px',
                  height: '300px',
                  left: '10px',
                  top: '10px',
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${elevationZ}px)`,
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Floor Slab Plate */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: floor.hasAnomaly
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(15, 23, 42, 0.65)',
                  border: floor.hasAnomaly
                    ? '2px solid #ef4444'
                    : '1.5px solid rgba(56, 189, 248, 0.6)',
                  boxShadow: floor.hasAnomaly
                    ? '0 0 20px rgba(239, 68, 68, 0.4)'
                    : '0 10px 30px rgba(0,0,0,0.5)',
                  borderRadius: '6px',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '10px',
                  gap: '8px',
                  boxSizing: 'border-box'
                }}>
                  {/* Floor Label Strip */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>
                        {floor.floorName}
                      </span>
                      {floor.hasAnomaly && (
                        <span style={{
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <AlertTriangle size={10} /> ANOMALY
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      +{floor.elevationMeters}m ({floor.builtUpAreaSqm} m²)
                    </span>
                  </div>

                  {/* Units Layout on Floor Plate */}
                  <div style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(floor.units.length, 3)}, 1fr)`,
                    gap: '8px'
                  }}>
                    {floor.units.map((unit) => {
                      const isInspected = inspectedUnit?.id === unit.id;
                      const isHovered = hoveredUnit?.id === unit.id;

                      let badgeColor = '#10b981';
                      if (unit.verificationStatus === 'Mismatch') badgeColor = '#f59e0b';
                      if (unit.verificationStatus === 'Unregistered') badgeColor = '#ef4444';

                      return (
                        <div
                          key={unit.id}
                          onClick={() => handleUnitClick(unit)}
                          onMouseEnter={() => setHoveredUnit(unit)}
                          onMouseLeave={() => setHoveredUnit(null)}
                          style={{
                            backgroundColor: isInspected
                              ? 'rgba(56, 189, 248, 0.35)'
                              : isHovered
                                ? 'rgba(255, 255, 255, 0.15)'
                                : 'rgba(30, 41, 59, 0.75)',
                            border: isInspected
                              ? '2px solid #38bdf8'
                              : `1.5px solid ${badgeColor}`,
                            borderRadius: '4px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: isInspected
                              ? '0 0 15px rgba(56, 189, 248, 0.6)'
                              : 'none',
                            transform: isHovered ? 'translateZ(10px)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div>
                            <div style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {unit.unitNumber}
                            </div>
                            <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px' }}>
                              {unit.useType} • {unit.carpetAreaSqm} m²
                            </div>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '6px',
                            paddingTop: '4px',
                            borderTop: '1px solid rgba(255,255,255,0.08)'
                          }}>
                            <span style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              color: badgeColor
                            }}>
                              {unit.verificationStatus}
                            </span>
                            <span style={{ fontSize: '9px', color: '#cbd5e1' }}>
                              {unit.taxPaymentStatus}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Inspector Panel (Unit/Floor Detail Card) */}
      {inspectedUnit && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          right: '14px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          border: inspectedUnit.verificationStatus === 'Unregistered'
            ? '1.5px solid #ef4444'
            : '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '8px',
          padding: '12px 18px',
          color: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 30
        }}>
          {/* Unit Identification */}
          <div style={{ flex: '1 1 320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                {inspectedUnit.unitNumber}
              </span>
              <span style={{
                backgroundColor: inspectedUnit.verificationStatus === 'Verified' ? '#10b981' : inspectedUnit.verificationStatus === 'Mismatch' ? '#f59e0b' : '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {inspectedUnit.verificationStatus}
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                ({inspectedUnit.floorName})
              </span>
            </div>

            {/* Composite 3D Reference Identifier matching Page 5 of manual */}
            <div style={{ fontSize: '11px', color: '#38bdf8', fontFamily: 'monospace' }}>
              3D Reference: <b>{inspectedUnit.compositeId}</b>
            </div>

            {inspectedUnit.statusNote && (
              <div style={{ fontSize: '11.5px', color: '#fca5a5', marginTop: '4px', fontWeight: 500 }}>
                ⚠️ {inspectedUnit.statusNote}
              </div>
            )}
          </div>

          {/* Unit Attributes Grid */}
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Owner Name</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f8fafc' }}>{inspectedUnit.ownerName}</div>
            </div>

            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Carpet Area</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f8fafc' }}>
                {inspectedUnit.carpetAreaSqm} m² ({inspectedUnit.carpetAreaSqft} sq.ft)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Property Tax ID</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: inspectedUnit.propertyTaxAssessmentNo === 'UNREGISTERED' ? '#ef4444' : '#38bdf8' }}>
                {inspectedUnit.propertyTaxAssessmentNo}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Annual Tax</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f8fafc' }}>
                ₹{inspectedUnit.annualTaxInr.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              onClick={() => setInspectedUnit(null)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                borderRadius: '4px',
                padding: '4px 10px',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
