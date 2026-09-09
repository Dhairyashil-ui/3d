import React, { useState } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  Map as MapIcon, 
  Box, 
  Ruler, 
  FileText,
  Search,
  ArrowRight,
  Send
} from 'lucide-react';
import { landParcelsData, buildingsData } from '../../data/surveyor3dStore';
import { apiClient } from '../../services/apiClient';

export const SurveyorComparisonPage: React.FC = () => {
  const [selectedParcelId, setSelectedParcelId] = useState('PAR-000123');
  const [activeLayerMode, setActiveLayerMode] = useState<'All' | 'Cadastre' | 'Aerial3D' | 'FieldGT'>('All');
  const [resolutionAction, setResolutionAction] = useState<string | null>(null);

  const parcel = landParcelsData.find(p => p.parcelId === selectedParcelId) || landParcelsData[0];
  const building = buildingsData.find(b => b.parcelId === parcel.parcelId) || buildingsData[0];

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
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Multi-Source Geospatial Comparison</span>
        </div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          Module: 2D Revenue Cadastre vs 3D Volumetric Mesh vs Field Ground Truth
        </div>
      </div>

      {/* Top Selector & Metrics Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Select Land Parcel:</label>
          <select
            value={selectedParcelId}
            onChange={e => setSelectedParcelId(e.target.value)}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontFamily: 'monospace',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {landParcelsData.map(p => (
              <option key={p.parcelId} value={p.parcelId}>
                {p.parcelId} (Plot {p.plotNo} | ULPIN: {p.ulpin})
              </option>
            ))}
          </select>
        </div>

        {/* Layer View Mode */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '12px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', padding: '0 8px' }}>Overlay Mode:</span>
          {(['All', 'Cadastre', 'Aerial3D', 'FieldGT'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setActiveLayerMode(mode)}
              style={{
                padding: '5px 12px',
                borderRadius: '4px',
                fontSize: '11.5px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeLayerMode === mode ? '#1976d2' : 'transparent',
                color: activeLayerMode === mode ? '#ffffff' : '#334155',
                transition: 'all 0.15s ease'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison Canvas & Side-by-Side Analysis */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* Visual Comparison Stage */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '520px'
        }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            fontWeight: 700,
            color: '#1e293b'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} color="#1976d2" /> Multi-Source Geometric Overlay Canvas
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
              EPSG:4326 | Lat: {parcel.coordinates[0]}, Lng: {parcel.coordinates[1]}
            </span>
          </div>

          <div style={{ flex: 1, backgroundColor: '#090d16', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <svg viewBox="0 0 700 420" style={{ width: '100%', height: '100%' }}>
              <defs>
                <pattern id="cmpGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width="700" height="420" fill="#090d16" />
              <rect width="700" height="420" fill="url(#cmpGrid)" />

              {/* Layer 1: 2D Revenue Cadastre */}
              {(activeLayerMode === 'All' || activeLayerMode === 'Cadastre') && (
                <g>
                  <polygon 
                    points="140,60 560,60 560,360 140,360" 
                    fill="#0284c7" 
                    fillOpacity="0.18" 
                    stroke="#38bdf8" 
                    strokeWidth="2.5" 
                  />
                  <text x="150" y="88" fill="#38bdf8" fontSize="12" fontWeight="bold">
                    2D Revenue Cadastre: {parcel.areaSqm} m²
                  </text>
                </g>
              )}

              {/* Layer 2: MAP-1 Aerial 3D Photogrammetry Footprint */}
              {(activeLayerMode === 'All' || activeLayerMode === 'Aerial3D') && (
                <g>
                  <polygon 
                    points="200,100 500,100 500,320 200,320" 
                    fill="#f59e0b" 
                    fillOpacity="0.28" 
                    stroke="#fbbf24" 
                    strokeWidth="2" 
                    strokeDasharray="5,3" 
                  />
                  <text x="210" y="125" fill="#fbbf24" fontSize="11" fontWeight="bold">
                    Aerial 3D Footprint: {building.footprintAreaSqm} m² (Ht: {building.approxHeightM}m)
                  </text>
                </g>
              )}

              {/* Layer 3: MAP-2 Field Ground Truth DGPS Points */}
              {(activeLayerMode === 'All' || activeLayerMode === 'FieldGT') && (
                <g>
                  <polygon 
                    points="140,60 560,60 560,360 140,360" 
                    fill="none" 
                    stroke="#22c55e" 
                    strokeWidth="2" 
                    strokeDasharray="3,3" 
                  />
                  <circle cx="140" cy="60" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="560" cy="60" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="560" cy="360" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="140" cy="360" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="400" y="380" fill="#4ade80" fontSize="11" fontWeight="bold">
                    Field DGPS: 4 Control Points Matched
                  </text>
                </g>
              )}
            </svg>

            {/* Canvas Legend */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(10, 15, 29, 0.9)',
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '10.5px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontFamily: 'monospace'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '3px', backgroundColor: '#38bdf8', display: 'inline-block' }}></span>
                <span>2D Cadastral Boundary</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '3px', backgroundColor: '#fbbf24', borderTop: '1px dashed #fbbf24', display: 'inline-block' }}></span>
                <span>MAP-1 3D Photogrammetric Footprint</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
                <span>MAP-2 Field DGPS Control Points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quantitative Variance Table & Signoff */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={15} color="#1976d2" /> Discrepancy & Variance Analysis
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Footprint Area Variance:</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px', marginTop: '2px' }}>
                  Δ +0.09 m² (0.01%)
                </div>
                <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#047857' }}>
                  Within State Tolerance (±0.5%)
                </span>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Vertical Height Check:</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px', marginTop: '2px' }}>
                  Aerial: 18.60m | Field Laser: 18.55m (Δ -0.05m)
                </div>
                <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#047857' }}>
                  Passed Orthogonal Height Check
                </span>
              </div>

              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Encroachment Status:</div>
                <div style={{ fontWeight: 800, color: '#059669', fontSize: '14px', marginTop: '2px' }}>
                  No Cadastral Encroachment
                </div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  Structure strictly conforms to Plot {parcel.plotNo} boundaries
                </span>
              </div>
            </div>

            {/* Resolution Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '6px' }}>
              <button
                onClick={async () => {
                  setResolutionAction('Approved');
                  await apiClient.saveVerification({
                    objectId: parcel.parcelId,
                    objectType: 'PARCEL',
                    decision: 'AGREE',
                    reason: 'Multi-source geometric comparison certified',
                    notes: 'Structure strictly conforms to plot boundary within state tolerance (±0.5%)',
                    surveyor: 'Surveyor_Pune'
                  });
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontWeight: 700,
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
              >
                <CheckCircle2 size={16} /> Approve & Certify Geometric Fit
              </button>

              <button
                onClick={async () => {
                  setResolutionAction('Flagged');
                  await apiClient.saveVerification({
                    objectId: parcel.parcelId,
                    objectType: 'PARCEL',
                    decision: 'DISAGREE',
                    reason: 'Flagged for Joint Inspection',
                    notes: 'Discrepancy noted in multi-source comparison',
                    surveyor: 'Surveyor_Pune'
                  });
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  fontWeight: 700,
                  borderRadius: '6px',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <AlertTriangle size={15} /> Flag for Joint Inspection
              </button>
            </div>

            {resolutionAction && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '6px',
                color: '#065f46',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                <span>Decision <b>{resolutionAction}</b> saved & persisted for Parcel <b>{parcel.parcelId}</b> in survey audit trail.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
