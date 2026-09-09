import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  landParcelsData, 
  buildingsData, 
  floorsData, 
  unitsData, 
  spatialVolumesData,
  LandParcel,
  BuildingRecord,
  FloorRecord,
  UnitRecord,
  SpatialVolumeRecord
} from '../../data/surveyor3dStore';
import { useSelectionStore } from '../../services/selectionStore';
import { 
  Building2, 
  Layers, 
  Box, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  FileText,
  User,
  Ruler
} from 'lucide-react';

export const BuildingFloorUnitRecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selection, selectStore] = useSelectionStore();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParcelId, setSelectedParcelId] = useState<string>(selection.selectedParcelId || landParcelsData[0].parcelId);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(selection.selectedBuildingId || buildingsData[0].buildingId);
  const [selectedFloorId, setSelectedFloorId] = useState<string>(selection.selectedFloorId || 'FLR-000003');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(selection.selectedUnitId || 'UNT-000302');

  // Expanded tree states
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'PAR-000123': true,
    'BLD-000781': true,
    'FLR-000003': true
  });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const currentParcel = landParcelsData.find(p => p.parcelId === selectedParcelId) || landParcelsData[0];
  const currentBuilding = buildingsData.find(b => b.buildingId === selectedBuildingId) || buildingsData[0];
  const currentFloor = floorsData.find(f => f.floorId === selectedFloorId) || floorsData[0];
  const currentUnit = unitsData.find(u => u.unitId === selectedUnitId) || unitsData[0];
  const currentVolume = spatialVolumesData.find(v => v.unitId === currentUnit.unitId) || spatialVolumesData[0];

  const filteredParcels = landParcelsData.filter(p => 
    p.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ulpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.khasraNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit', color: '#1e293b' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        backgroundColor: '#ffffff',
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#1976d2', fontWeight: 600 }}>Home</span>
          <span>&gt;</span>
          <span style={{ color: '#1976d2' }}>Property Intelligence</span>
          <span>&gt;</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Building, Floor & Unit Multi-Tier Records</span>
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
          Hierarchy: ULPIN ➔ Parcel ➔ Building ➔ Floor ➔ Unit ➔ 3D Volume
        </div>
      </div>

      {/* Main Multi-Pane Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* Left Pane: Hierarchical Tree Navigation */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '750px'
        }}>
          {/* Tree Header & Search */}
          <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Geospatial Object Hierarchy</span>
              <span style={{ fontSize: '10px', backgroundColor: '#eff6ff', color: '#1976d2', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700 }}>
                Tree View
              </span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search parcel, ULPIN..."
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  fontSize: '12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Tree Structure */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredParcels.map(parcel => {
              const isParcelExpanded = !!expandedNodes[parcel.parcelId];
              const pBuildings = buildingsData.filter(b => b.parcelId === parcel.parcelId);

              return (
                <div key={parcel.parcelId} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {/* Parcel Node (Level 1) */}
                  <div 
                    onClick={() => {
                      setSelectedParcelId(parcel.parcelId);
                      toggleNode(parcel.parcelId);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: selectedParcelId === parcel.parcelId ? '#eff6ff' : 'transparent',
                      border: selectedParcelId === parcel.parcelId ? '1px solid #bfdbfe' : '1px solid transparent',
                      color: selectedParcelId === parcel.parcelId ? '#1976d2' : '#334155'
                    }}
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleNode(parcel.parcelId); }} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#64748b' }}
                    >
                      {isParcelExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <ShieldCheck size={15} color="#7c3aed" style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#7c3aed', display: 'block', fontWeight: 700 }}>{parcel.ulpin}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Parcel: {parcel.parcelId} (Plot {parcel.plotNo})</span>
                    </div>
                  </div>

                  {/* Buildings (Level 2) */}
                  {isParcelExpanded && (
                    <div style={{ paddingLeft: '18px', borderLeft: '2px solid #ddd6fe', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {pBuildings.map(bld => {
                        const isBldExpanded = !!expandedNodes[bld.buildingId];
                        const bFloors = floorsData.filter(f => f.buildingId === bld.buildingId);

                        return (
                          <div key={bld.buildingId} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div 
                              onClick={() => {
                                setSelectedBuildingId(bld.buildingId);
                                toggleNode(bld.buildingId);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: selectedBuildingId === bld.buildingId ? '#dbeafe' : 'transparent',
                                color: selectedBuildingId === bld.buildingId ? '#1e40af' : '#475569',
                                fontWeight: selectedBuildingId === bld.buildingId ? 700 : 500
                              }}
                            >
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleNode(bld.buildingId); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#64748b' }}
                              >
                                {isBldExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <Building2 size={14} color="#1976d2" style={{ flexShrink: 0 }} />
                              <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                {bld.buildingId} ({bld.totalFloors} Flr)
                              </span>
                            </div>

                            {/* Floors (Level 3) */}
                            {isBldExpanded && (
                              <div style={{ paddingLeft: '16px', borderLeft: '2px solid #bfdbfe', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {bFloors.map(floor => {
                                  const isFlrExpanded = !!expandedNodes[floor.floorId];
                                  const fUnits = unitsData.filter(u => u.floorId === floor.floorId);

                                  return (
                                    <div key={floor.floorId} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <div 
                                        onClick={() => {
                                          setSelectedFloorId(floor.floorId);
                                          toggleNode(floor.floorId);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          padding: '5px 8px',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          backgroundColor: selectedFloorId === floor.floorId ? '#e0e7ff' : 'transparent',
                                          color: selectedFloorId === floor.floorId ? '#4338ca' : '#475569',
                                          fontWeight: selectedFloorId === floor.floorId ? 700 : 400
                                        }}
                                      >
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); toggleNode(floor.floorId); }}
                                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', color: '#64748b' }}
                                        >
                                          {isFlrExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                        </button>
                                        <Layers size={13} color="#6366f1" style={{ flexShrink: 0 }} />
                                        <span style={{ fontSize: '11px' }}>
                                          {floor.floorName} ({floor.unitsCount} Units)
                                        </span>
                                      </div>

                                      {/* Units (Level 4) */}
                                      {isFlrExpanded && (
                                        <div style={{ paddingLeft: '16px', borderLeft: '1px solid #c7d2fe', marginLeft: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                          {fUnits.map(unit => (
                                            <div 
                                              key={unit.unitId}
                                              onClick={() => setSelectedUnitId(unit.unitId)}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                                backgroundColor: selectedUnitId === unit.unitId ? '#fef3c7' : 'transparent',
                                                color: selectedUnitId === unit.unitId ? '#92400e' : '#64748b',
                                                fontWeight: selectedUnitId === unit.unitId ? 700 : 400,
                                                border: selectedUnitId === unit.unitId ? '1px solid #fcd34d' : '1px solid transparent'
                                              }}
                                            >
                                              <Box size={13} color="#d97706" style={{ flexShrink: 0 }} />
                                              <span>
                                                Flat {unit.flatNumber} ({unit.carpetAreaSqm} m²)
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Detailed Attribute Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Banner */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Selection:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>
                  Flat {currentUnit.flatNumber} | {currentFloor.floorName}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #a7f3d0'
                }}>
                  {currentUnit.verificationStatus}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Building: <b style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{currentBuilding.buildingId}</b> | Parcel: <b style={{ fontFamily: 'monospace', color: '#1976d2' }}>{currentParcel.parcelId}</b> | ULPIN: <b style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{currentParcel.ulpin}</b>
              </p>
            </div>

            <button
              onClick={() => navigate(`/surveyor/property-detail?parcelId=${currentParcel.parcelId}`)}
              style={{
                backgroundColor: '#1976d2',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.3)'
              }}
            >
              <Eye size={14} /> Open Property Dossier
            </button>
          </div>

          {/* Level 1: Parcel Record */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #ddd6fe', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ backgroundColor: '#f5f3ff', padding: '10px 16px', borderBottom: '1px solid #ddd6fe', fontSize: '12px', fontWeight: 700, color: '#5b21b6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#7c3aed" /> 1. Authoritative Land Parcel Anchor Record
              </span>
              <span style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{currentParcel.ulpin}</span>
            </div>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Parcel Identifier:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>{currentParcel.parcelId}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Khasra Number:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>{currentParcel.khasraNo}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Ground Area:</span>
                <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{currentParcel.areaSqm} m²</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>ULPIN Verification:</span>
                <span style={{ fontWeight: 700, color: '#047857' }}>{currentParcel.ulpinStatus}</span>
              </div>
            </div>
          </div>

          {/* Level 2: Building Record */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #bfdbfe', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '10px 16px', borderBottom: '1px solid #bfdbfe', fontSize: '12px', fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={16} color="#1976d2" /> 2. Building Object Record
              </span>
              <span style={{ fontFamily: 'monospace', color: '#1976d2' }}>{currentBuilding.buildingId}</span>
            </div>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Building Type:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{currentBuilding.buildingType}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Storeys / Floors:</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{currentBuilding.totalFloors} Floors (G+4)</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Estimated Height:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4338ca' }}>{currentBuilding.approxHeightM} m</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Footprint Area:</span>
                <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{currentBuilding.footprintAreaSqm} m²</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Confidence:</span>
                <span style={{ fontWeight: 700, color: '#047857' }}>{currentBuilding.confidencePct}% High Quality</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>FAR Ratio:</span>
                <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{currentBuilding.farRatio}</span>
              </div>
            </div>
          </div>

          {/* Level 3 & 4: Floor & Unit Records */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Floor Record */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #c7d2fe', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ backgroundColor: '#eef2ff', padding: '10px 16px', borderBottom: '1px solid #c7d2fe', fontSize: '12px', fontWeight: 700, color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Layers size={15} color="#4f46e5" /> 3. Floor Record</span>
                <span style={{ fontFamily: 'monospace', color: '#4338ca' }}>{currentFloor.floorId}</span>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Floor Name:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentFloor.floorName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Elevation:</span>
                  <span style={{ fontFamily: 'monospace', color: '#334155' }}>{currentFloor.estimatedElevationM} m MSL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Units Count:</span>
                  <span style={{ fontWeight: 700, color: '#1976d2' }}>{currentFloor.unitsCount} Units</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Geometry Status:</span>
                  <span style={{ fontWeight: 700, color: '#047857' }}>{currentFloor.geometryStatus}</span>
                </div>
              </div>
            </div>

            {/* Unit / Flat Record */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #fde68a', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ backgroundColor: '#fffbeb', padding: '10px 16px', borderBottom: '1px solid #fde68a', fontSize: '12px', fontWeight: 700, color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Box size={15} color="#d97706" /> 4. Unit / Flat Record</span>
                <span style={{ fontFamily: 'monospace', color: '#b45309' }}>{currentUnit.unitId}</span>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Flat Number:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>Flat {currentUnit.flatNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Carpet Area:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>{currentUnit.carpetAreaSqm} m²</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Tax ID:</span>
                  <span style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{currentUnit.propertyTaxId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>RoR Linkage:</span>
                  <span style={{ fontWeight: 700, color: '#047857' }}>{currentUnit.rorLinkage}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level 5: 3D Spatial Volume Record */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #a7f3d0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ backgroundColor: '#ecfdf5', padding: '10px 16px', borderBottom: '1px solid #a7f3d0', fontSize: '12px', fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box size={16} color="#059669" /> 5. 3D Spatial Volume Representation (VOL-000982)
              </span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: 700 }}>
                {currentVolume.validationStatus}
              </span>
            </div>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Enclosed Volume:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#047857', fontSize: '14px' }}>{currentVolume.volumeM3} m³</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Horizontal Area:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>{currentVolume.areaSqm} m²</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Vertical Clearance:</span>
                <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{currentVolume.heightM} m (3.20m clear)</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Vertical Bounds:</span>
                <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{currentVolume.baseElevationM}m – {currentVolume.topElevationM}m MSL</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Model Confidence:</span>
                <span style={{ fontWeight: 700, color: '#047857' }}>{currentVolume.confidencePct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
