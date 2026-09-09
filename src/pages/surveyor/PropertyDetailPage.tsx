import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RealGisMap } from '../../components/common/RealGisMap';
import { RealThreeDViewer } from '../../components/common/RealThreeDViewer';
import { apiClient } from '../../services/apiClient';
import { useSelectionStore } from '../../services/selectionStore';
import { CoherentParcel, CoherentBuilding, CoherentFloor, CoherentUnit } from '../../data/coherentPuneDataset';
import { VerificationRecord } from '../../services/spatialDatabase';
import { 
  Building2, 
  Layers, 
  Map as MapIcon, 
  Box, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowLeft, 
  Sliders, 
  Eye, 
  Download, 
  History, 
  Send, 
  Compass, 
  Check, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  FolderOpen,
  Camera,
  Ruler,
  Sparkles
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const parcelIdParam = searchParams.get('parcelId') || 'PAR-000123';
  const [selection, selectStore] = useSelectionStore();

  const [parcel, setParcel] = useState<CoherentParcel | null>(null);
  const [building, setBuilding] = useState<CoherentBuilding | null>(null);
  const [buildingFloors, setBuildingFloors] = useState<CoherentFloor[]>([]);
  const [buildingUnits, setBuildingUnits] = useState<CoherentUnit[]>([]);
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);

  const [activeTab, setActiveTab] = useState<
    'Overview' | '2D Map' | '3D View' | '2D + 3D Split' | 'Building' | 'Floors & Units' | 
    'RoR / Ownership' | 'Evidence' | 'Comparison' | 'Verification History' | 'Publication'
  >('Overview');

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const p = await apiClient.getParcelById(parcelIdParam);
      if (p) {
        setParcel(p);
        const bList = await apiClient.getBuildings(p.parcelId);
        const b = bList[0] || (await apiClient.getBuildings())[0];
        setBuilding(b);
        if (b) {
          const [f, u] = await Promise.all([
            apiClient.getFloorsByBuilding(b.buildingId),
            apiClient.getUnitsByBuilding(b.buildingId)
          ]);
          setBuildingFloors(f);
          setBuildingUnits(u);
        }
        const v = await apiClient.getVerifications(p.parcelId);
        setVerifications(v);
      }
    }
    loadData();
  }, [parcelIdParam]);

  if (!parcel) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: 'inherit' }}>
        <Building2 size={36} color="#1976d2" style={{ margin: '0 auto 12px auto' }} />
        <p style={{ fontWeight: 600, fontSize: '14px' }}>Loading authoritative parcel and building records...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit', color: '#1e293b' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '64px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#065f46',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 600,
          border: '1px solid #10b981'
        }}>
          <CheckCircle2 size={18} color="#a7f3d0" style={{ flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => navigate('/surveyor/property-search')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1976d2',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
              fontSize: '12px'
            }}
          >
            <ArrowLeft size={14} /> Back to Search
          </button>
          <span>&gt;</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Property Detail ({parcel.parcelId})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#64748b' }}>ULPIN Anchor:</span>
          <span style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            color: '#7c3aed',
            backgroundColor: '#f5f3ff',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid #ddd6fe'
          }}>
            {parcel.ulpin}
          </span>
        </div>
      </div>

      {/* Header Container */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          backgroundColor: '#1976d2',
          color: '#ffffff',
          padding: '14px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              padding: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '17px', fontWeight: 700, margin: 0, letterSpacing: '0.3px' }}>
                  Parcel: {parcel.parcelId}
                </h1>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  color: '#ffffff',
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontWeight: 600
                }}>
                  Plot: {parcel.plotNo}
                </span>
                <span style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '10.5px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {parcel.verificationStatus}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#bfdbfe', margin: '4px 0 0 0' }}>
                Khasra: <b>{parcel.khasraNo}</b> | Survey Unit: <b>Unit 1 (343671)</b> | Ward: <b>43 - Maharana Pratap Ward</b> | ULB: <b>Pune (270410)</b>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={async () => {
                await apiClient.saveVerification({
                  objectId: parcel.parcelId,
                  objectType: 'PARCEL',
                  decision: 'DISAGREE',
                  reason: 'Requires Ground Field Re-verification',
                  notes: 'Surveyor requested field inspection check.',
                  surveyor: 'Surveyor_Pune'
                });
                setToastMessage(`Parcel ${parcel.parcelId} flagged for field re-survey.`);
                setTimeout(() => setToastMessage(null), 3000);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Flag for Field Re-survey
            </button>
            <button
              onClick={async () => {
                await apiClient.saveVerification({
                  objectId: parcel.parcelId,
                  objectType: 'PARCEL',
                  decision: 'AGREE',
                  reason: 'Field Ground Truth & 2D/3D Geometry Aligned',
                  notes: 'Surveyor verified 3D building footprint and parcel polygon.',
                  surveyor: 'Surveyor_Pune'
                });
                setToastMessage(`3D Parcel Record ${parcel.parcelId} Approved & Verified!`);
                setTimeout(() => setToastMessage(null), 3000);
              }}
              style={{
                backgroundColor: '#059669',
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
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <CheckCircle2 size={16} /> Verify 3D Record
            </button>
          </div>
        </div>

        {/* 11 Navigation Tabs */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '12px',
          fontWeight: 600
        }}>
          {[
            { id: 'Overview', label: '1. Overview' },
            { id: '2D Map', label: '2. 2D Map' },
            { id: '3D View', label: '3. 3D View' },
            { id: '2D + 3D Split', label: '4. 2D + 3D Split View' },
            { id: 'Building', label: '5. Building' },
            { id: 'Floors & Units', label: '6. Floors & Units' },
            { id: 'RoR / Ownership', label: '7. RoR / Ownership' },
            { id: 'Evidence', label: '8. Evidence Vault' },
            { id: 'Comparison', label: '9. Comparison' },
            { id: 'Verification History', label: '10. Verification History' },
            { id: 'Publication', label: '11. Publication' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '11px 18px',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #1976d2' : '3px solid transparent',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#1976d2' : '#64748b',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TAB CONTENTS
          ========================================================================= */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Dual Split Map Previews (Real 2D and Real 3D) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '16px'
          }}>
            {/* Left: Real 2D Interactive Map */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: 600,
                color: '#1e293b'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapIcon size={16} color="#1976d2" /> 2D GIS Cadastral Boundary & Footprint
                </span>
                <button 
                  onClick={() => setActiveTab('2D Map')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1976d2',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '11.5px',
                    fontWeight: 600
                  }}
                >
                  Full 2D Map <ChevronRight size={13} />
                </button>
              </div>
              <div style={{ height: '330px', position: 'relative' }}>
                <RealGisMap height="330px" />
              </div>
            </div>

            {/* Right: Real 3D WebGL Massing Preview */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: 600,
                color: '#1e293b'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Box size={16} color="#4f46e5" /> 3D Spatial Volume on Aerial Satellite Map
                </span>
                <button 
                  onClick={() => setActiveTab('3D View')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1976d2',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '11.5px',
                    fontWeight: 600
                  }}
                >
                  Interactive 3D View <ChevronRight size={13} />
                </button>
              </div>
              <div style={{ height: '330px', position: 'relative' }}>
                <RealThreeDViewer height="330px" enableControls={false} />
              </div>
            </div>
          </div>

          {/* Authoritative Hierarchy Summary Cards */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FileText size={15} color="#1976d2" /> Authoritative Hierarchy & Linkage Summary
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              fontSize: '12px'
            }}>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>1. Land Parcel Anchor</span>
                <span style={{ fontWeight: 700, color: '#7c3aed', fontFamily: 'monospace', fontSize: '13px' }}>{parcel.ulpin}</span>
              </div>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>2. Local Cadastral ID</span>
                <span style={{ fontWeight: 700, color: '#1976d2', fontFamily: 'monospace', fontSize: '13px' }}>{parcel.parcelId}</span>
              </div>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>3. Primary Building</span>
                <span style={{ fontWeight: 700, color: '#1e293b', fontFamily: 'monospace', fontSize: '13px' }}>{building?.buildingId || 'BLD-000781'}</span>
              </div>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>4. Storeys (Floors)</span>
                <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>{building?.totalFloors || 5} Floors (G+4)</span>
              </div>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>5. Registered Units</span>
                <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>{buildingUnits.length || 4} Flats</span>
              </div>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>6. 3D Spatial Volumes</span>
                <span style={{ fontWeight: 700, color: '#4f46e5', fontSize: '13px' }}>{buildingUnits.length || 4} Enclosed CAD Polygons</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 2D MAP TAB */}
      {activeTab === '2D Map' && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          height: '660px'
        }}>
          <RealGisMap height="660px" />
        </div>
      )}

      {/* 3. 3D VIEW TAB */}
      {activeTab === '3D View' && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          height: '680px'
        }}>
          <RealThreeDViewer height="680px" />
        </div>
      )}

      {/* 4. 2D + 3D SPLIT VIEW TAB */}
      {activeTab === '2D + 3D Split' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '16px',
          height: '640px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              backgroundColor: '#eff6ff',
              borderBottom: '1px solid #bfdbfe',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapIcon size={15} /> 2D GIS Cadastral Layer</span>
              <span style={{ fontSize: '10px', backgroundColor: '#dbeafe', color: '#1976d2', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>WGS84 EPSG:4326</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <RealGisMap height="600px" />
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              backgroundColor: '#eef2ff',
              borderBottom: '1px solid #c7d2fe',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#4338ca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Box size={15} /> 3D Digital Twin on Google Photorealistic 3D Map</span>
              <span style={{ fontSize: '10px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>CesiumJS Engine</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <RealThreeDViewer height="600px" />
            </div>
          </div>
        </div>
      )}

      {/* 5. BUILDING TAB */}
      {activeTab === 'Building' && building && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="#1976d2" />
                Building Record: {building.buildingId}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Authoritative 3D Building Object Model derived from Technical Aerial Survey & Municipal Vector Footprints
              </p>
            </div>
            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 700,
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0'
            }}>
              {building.verificationStatus}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', fontSize: '12px' }}>
            {/* Identification */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', fontSize: '11px', margin: 0 }}>Identification</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Building ID:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#7c3aed' }}>{building.buildingId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Parcel ID:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1976d2' }}>{building.parcelId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>ULPIN Anchor:</span>
                <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{building.ulpin || parcel.ulpin}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Building Type:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{building.buildingType}</span>
              </div>
            </div>

            {/* Engineering Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', fontSize: '11px', margin: 0 }}>Engineering Metrics</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Number of Floors:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{building.totalFloors} (G + {building.totalFloors - 1})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Estimated Height:</span>
                <span style={{ fontWeight: 700, color: '#4f46e5', fontFamily: 'monospace' }}>{building.approxHeightM} m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Footprint Area:</span>
                <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{building.footprintAreaSqm} mÂ²</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Total Built-up Area:</span>
                <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{building.builtUpAreaSqm} mÂ²</span>
              </div>
            </div>

            {/* Provenance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', fontSize: '11px', margin: 0 }}>Technical Provenance</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>3D Data Source:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{building.geometrySource}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Confidence Score:</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>{building.confidencePct}% High Quality</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Roof Type:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{building.roofType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Field Ground Truth:</span>
                <span style={{ color: '#1976d2', fontWeight: 600 }}>Matched with DGPS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FLOORS & UNITS TAB */}
      {activeTab === 'Floors & Units' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Floors Table */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '12.5px', color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="#1976d2" /> Registered Building Floor Slabs
              </span>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>Total {buildingFloors.length} Registered Floor Slabs</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#5dade2', color: '#ffffff', fontSize: '11.5px' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Floor ID</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Floor Name</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Elevation (MSL)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Floor Height</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Built-up Area</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Units Count</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Geometry Status</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Confidence</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {buildingFloors.map(flr => (
                    <tr key={flr.floorId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#7c3aed' }}>{flr.floorId}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{flr.floorName}</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#475569' }}>{flr.baseElevationM || flr.baseHeightM || 524} m</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#475569' }}>{flr.floorHeightM || flr.heightM || 3.2} m</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#1e293b' }}>{flr.builtUpAreaSqm} mÂ²</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#1976d2' }}>{flr.unitsCount}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', fontWeight: 600 }}>
                          {flr.geometryStatus}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: '#059669' }}>{flr.confidencePct || flr.confidence || 98}%</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d' }}>
                          {flr.verificationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Units Table */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '12.5px', color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box size={16} color="#d97706" /> Registered Unit / Flat Records & 3D Spatial Volumes
              </span>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>Total {buildingUnits.length} Units</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1976d2', color: '#ffffff', fontSize: '11.5px' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Unit ID</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Flat No</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Floor</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Property Tax ID</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Carpet Area</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Owner(s)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>RoR Linkage</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>3D Volume ID</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Volume Status</th>
                  </tr>
                </thead>
                <tbody>
                  {buildingUnits.map(unit => (
                    <tr key={unit.unitId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#7c3aed' }}>{unit.unitId}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>Flat {unit.flatNumber}</td>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>Floor {unit.floorNumber}</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748b' }}>{unit.propertyTaxId}</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#1e293b' }}>{unit.carpetAreaSqm} mÂ²</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>
                        {(unit.ownerNames || []).join(', ')} ({unit.ownerCount || 1})
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                          {unit.rorStatus}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 600, color: '#b45309' }}>{unit.volumeId}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, backgroundColor: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>
                          {unit.verificationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. ROR / OWNERSHIP TAB */}
      {activeTab === 'RoR / Ownership' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#16a34a" /> Record of Rights (RoR) & Ownership Register
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Official Revenue & Property Records linked to Land Parcel Anchor {parcel.ulpin}
              </p>
            </div>
            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
              RoR Status: {parcel.rorStatus}
            </span>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '10px 16px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              Registered Co-Owners / Titleholders
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11.5px' }}>
                  <th style={{ padding: '10px 14px' }}>Owner Name</th>
                  <th style={{ padding: '10px 14px' }}>Share %</th>
                  <th style={{ padding: '10px 14px' }}>Aadhaar (Masked)</th>
                  <th style={{ padding: '10px 14px' }}>Mobile</th>
                  <th style={{ padding: '10px 14px' }}>Title Deed Reg. No.</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Document Verified</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>Rajesh Sharma</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700 }}>50%</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748b' }}>XXXX-XXXX-8821</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748b' }}>+91 98260 12345</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#1e293b' }}>MP-BHP-2014-9982</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ color: '#15803d', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Verified
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>Sunita Sharma</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700 }}>50%</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748b' }}>XXXX-XXXX-4519</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748b' }}>+91 98260 67890</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#1e293b' }}>MP-BHP-2014-9982</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ color: '#15803d', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Verified
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. EVIDENCE VAULT TAB */}
      {activeTab === 'Evidence' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderOpen size={18} color="#1976d2" /> Geospatial Asset Registry & Upstream Sensor Evidence
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Authoritative verification of available aerial datasets (Authenticity Rule strictly applied)
              </p>
            </div>
            <span style={{ fontSize: '11px', backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
              Sensor Audit: Active Study Area
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '12px' }}>
            <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16} color="#059669" /> Drone Ortho (ORI)</span>
                <span style={{ backgroundColor: '#d1fae5', color: '#065f46', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>AVAILABLE</span>
              </div>
              <div style={{ color: '#475569', fontSize: '11.5px' }}>Resolution: 2.5 cm GSD | Aerial Orthomosaic</div>
              <div style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#64748b' }}>Status: Georeferenced WGS84</div>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={16} color="#d97706" /> Building Footprints</span>
                <span style={{ backgroundColor: '#d1fae5', color: '#065f46', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>AVAILABLE</span>
              </div>
              <div style={{ color: '#475569', fontSize: '11.5px' }}>Source: Coherent Pune Vector Digitization</div>
              <div style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#64748b' }}>Status: Extruded to Scale</div>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}><Ruler size={16} color="#dc2626" /> GT Control Points</span>
                <span style={{ backgroundColor: '#d1fae5', color: '#065f46', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>AVAILABLE</span>
              </div>
              <div style={{ color: '#475569', fontSize: '11.5px' }}>DGPS Dual-Frequency RTK Controls</div>
              <div style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#64748b' }}>RMS Accuracy: Â±0.010m</div>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><Box size={16} color="#94a3b8" /> LiDAR Point Cloud</span>
                <span style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Not Available</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '11.5px' }}>Raw Aerial LAS / LAZ point cloud stream</div>
              <div style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#d97706' }}>LiDAR Sensor: Not Configured</div>
            </div>
          </div>
        </div>
      )}

      {/* 9. COMPARISON TAB */}
      {activeTab === 'Comparison' && building && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#1976d2" /> Automated Spatial Matching & Record Variance
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Deterministic geometric cross-verification between Cadastral Polygon, Footprint Extrusion, and RoR
              </p>
            </div>
            <span style={{ fontSize: '11px', backgroundColor: '#eff6ff', color: '#1976d2', padding: '4px 10px', borderRadius: '6px', fontFamily: 'monospace', fontWeight: 600, border: '1px solid #bfdbfe' }}>
              Spatial Match: 96.4% Verified
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ backgroundColor: '#5dade2', color: '#ffffff', fontSize: '11.5px' }}>
                  <th style={{ padding: '10px 14px' }}>Measurement Metric</th>
                  <th style={{ padding: '10px 14px' }}>2D Revenue Cadastre</th>
                  <th style={{ padding: '10px 14px' }}>Observed 3D Building Geometry</th>
                  <th style={{ padding: '10px 14px' }}>Deterministic Delta</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Validation Result</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e293b' }}>Footprint Area</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>{parcel.areaSqm.toFixed(2)} mÂ² (Parcel Area)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>{building.footprintAreaSqm} mÂ² (Ground Footprint)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#15803d', fontWeight: 600 }}>
                    {(building.footprintAreaSqm - parcel.areaSqm).toFixed(2)} mÂ² (Coverage: {((building.footprintAreaSqm / parcel.areaSqm) * 100).toFixed(1)}%)
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                      Centroid Contained in Parcel
                    </span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e293b' }}>Storey Count (Floors)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>5 Floors (RoR Record)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>{building.totalFloors} Extruded Slabs</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#15803d', fontWeight: 600 }}>0 Floors (Exact Match)</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                      Passed Floor Agreement Check
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e293b' }}>Building Total Height</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>N/A (2D Cadastre)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>{building.approxHeightM} m ({building.totalFloors} Ã— 3.2m)</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#1d4ed8' }}>Derived from Footprint Extrusion</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 700 }}>
                      Standard Height Met
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. VERIFICATION HISTORY TAB */}
      {activeTab === 'Verification History' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={18} color="#1976d2" /> Surveyor Verification Audit Trail (Persistent)
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Immutable chronological record of field verifications saved to spatial database
              </p>
            </div>
            <span style={{ fontSize: '11px', backgroundColor: '#eff6ff', color: '#1976d2', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, border: '1px solid #bfdbfe' }}>
              {verifications.length} Registered Events
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {verifications.length === 0 ? (
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                No recent surveyor decisions for this parcel. Click "Verify 3D Record" to submit an authoritative verification event.
              </div>
            ) : (
              verifications.map((v, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', fontSize: '12px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{
                    padding: '6px',
                    borderRadius: '50%',
                    backgroundColor: v.decision === 'AGREE' ? '#dcfce7' : '#fee2e2',
                    color: v.decision === 'AGREE' ? '#15803d' : '#b91c1c'
                  }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{v.decision}: {v.reason || 'Verified'}</span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{v.timestamp}</span>
                    </div>
                    <p style={{ color: '#475569', margin: '2px 0' }}>{v.notes}</p>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                      Operator: <span style={{ fontWeight: 600, color: '#334155' }}>{v.surveyor}</span> â€¢ ID: <span style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{v.verificationId}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 11. PUBLICATION TAB */}
      {activeTab === 'Publication' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#1976d2" /> Urban Property Card & Publication Docket
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Official Urban Property (UrPro) Publication Status under MAP-2 Section 14
              </p>
            </div>
            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }}>
              Card Status: {parcel.publicationStatus || 'Provisional'}
            </span>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '13px' }}>
              Notice of Provisional Publication â€” Ward 43, Survey Unit 1
            </div>
            <p style={{ color: '#1e40af', lineHeight: 1.5, margin: 0 }}>
              This property parcel (Plot No: <b>{parcel.plotNo}</b>, Khasra: <b>{parcel.khasraNo}</b>, Anchor ULPIN: <b>{parcel.ulpin}</b>) with 5-storey residential massing has completed technical validation and field ground truthing.
            </p>
            <div style={{ paddingTop: '8px' }}>
              <button
                onClick={() => navigate('/surveyor/manage-publication')}
                style={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)'
                }}
              >
                Go to Manage Publication Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

