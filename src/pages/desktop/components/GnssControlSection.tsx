import React, { useState } from 'react';
import {
  Crosshair,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Plus,
  RefreshCw,
  Sliders,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { GcpPoint, MOCK_GCPS, SurveyProject } from '../../../data/survey3dData';
import { GisMap } from '../../../components/common/GisMap';

interface GnssControlSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const GnssControlSection: React.FC<GnssControlSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [gcps, setGcps] = useState<GcpPoint[]>(MOCK_GCPS);
  const [selectedGcp, setSelectedGcp] = useState<GcpPoint | null>(gcps[0] || null);
  const [showGcpMap, setShowGcpMap] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  // Import mock GCP dialog
  const handleImportGcp = () => {
    const code = prompt('Enter New GCP / Checkpoint ID (e.g. MP-IND-GCP-005):');
    if (!code) return;
    const latStr = prompt('Enter Latitude (e.g. 22.7230):', '22.7230');
    const lngStr = prompt('Enter Longitude (e.g. 75.8630):', '75.8630');
    const elevStr = prompt('Enter Ellipsoidal Elevation in meters (e.g. 542.50):', '542.50');

    if (latStr && lngStr && elevStr) {
      const newPoint: GcpPoint = {
        id: `GCP-0${gcps.length + 1}`,
        name: `Survey Ground Monument ${gcps.length + 1}`,
        code,
        lat: parseFloat(latStr),
        lng: parseFloat(lngStr),
        elevation: parseFloat(elevStr),
        accuracyH: 0.009,
        accuracyV: 0.013,
        residuals: { x: 0.003, y: -0.004, z: 0.004 },
        pointType: 'GCP',
        status: 'VALIDATED'
      };
      setGcps((prev) => [...prev, newPoint]);
      setSelectedGcp(newPoint);
      alert(`Successfully added and validated Control Point ${code}!`);
    }
  };

  const handleValidateAllPoints = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      alert('All 6 Ground Control & Check Points re-verified against CORS Base Station MP-IND-01. Mean RMS Error: 0.011m (PASS).');
    }, 800);
  };

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
          <Crosshair size={16} />
          <span>GNSS / CORS Geodetic Control Workspace & GCP Adjustment</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Real-Time Kinematic (RTK FIX) • Survey of India CORS Network
        </div>
      </div>

      {/* Real-time CORS & Telemetry Status Cards */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '14px 18px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            CORS Connection Status
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#15803d', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            <span>ONLINE (MP-IND-01)</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            NTRIP Stream • RTCM 3.3
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            RTK Fix Mode & Satellite Constellation
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f2b5c', marginTop: '3px' }}>
            RTK FIX (31 Satellites)
          </div>
          <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '2px' }}>
            NavIC (8) + GPS (12) + GLO (7) + GAL (4)
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Horizontal / Vertical Accuracy
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#15803d', marginTop: '3px' }}>
            H: ± 0.009m | V: ± 0.014m
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>
            Exceeds SoI 2.5cm Tolerance
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Coordinate Reference System
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f2b5c', marginTop: '3px' }}>
            EPSG: 32643
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
            WGS 84 / UTM Zone 43N (Ellipsoidal)
          </div>
        </div>
      </div>

      {/* Main Split: Left GCP Table + Right GCP Map & Residuals Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
        {/* Left: GCPs and Check Points Table */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
              Ground Control Points (GCP) & Checkpoints Registry
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleImportGcp}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={13} />
                <span>Add GCP</span>
              </button>

              <button
                onClick={handleValidateAllPoints}
                disabled={isValidating}
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 12px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: isValidating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} className={isValidating ? 'spin' : ''} />
                <span>Validate Control Points</span>
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #cbd5e1', textTransform: 'uppercase', fontSize: '10.5px' }}>
                  <th style={{ padding: '7px 8px' }}>Point ID</th>
                  <th style={{ padding: '7px 8px' }}>Type</th>
                  <th style={{ padding: '7px 8px' }}>Latitude / Longitude</th>
                  <th style={{ padding: '7px 8px' }}>Elevation (Z)</th>
                  <th style={{ padding: '7px 8px' }}>Residuals (dX/dY/dZ)</th>
                  <th style={{ padding: '7px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {gcps.map((p) => {
                  const isSel = selectedGcp?.id === p.id;

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedGcp(p)}
                      style={{
                        backgroundColor: isSel ? '#eff6ff' : '#ffffff',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '8px', fontWeight: 700, color: '#0f2b5c' }}>
                        <div>{p.id}</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{p.code}</div>
                      </td>

                      <td style={{ padding: '8px' }}>
                        <span style={{
                          backgroundColor: p.pointType === 'GCP' ? '#dbeafe' : '#fef3c7',
                          color: p.pointType === 'GCP' ? '#1e40af' : '#92400e',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700
                        }}>
                          {p.pointType}
                        </span>
                      </td>

                      <td style={{ padding: '8px', color: '#334155' }}>
                        <div>{p.lat.toFixed(6)}° N</div>
                        <div>{p.lng.toFixed(6)}° E</div>
                      </td>

                      <td style={{ padding: '8px', fontWeight: 600, color: '#0f2b5c' }}>
                        {p.elevation.toFixed(2)} m
                      </td>

                      <td style={{ padding: '8px', fontSize: '10.5px', color: '#475569' }}>
                        {p.residuals.x > 0 ? `+${p.residuals.x}` : p.residuals.x} / {p.residuals.y > 0 ? `+${p.residuals.y}` : p.residuals.y} / {p.residuals.z > 0 ? `+${p.residuals.z}` : p.residuals.z} m
                      </td>

                      <td style={{ padding: '8px' }}>
                        <span style={{
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700
                        }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Map & Inspector */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
              Spatial Control Network Distribution
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Selected: <b style={{ color: '#0284c7' }}>{selectedGcp?.name}</b>
            </span>
          </div>

          <div style={{ flex: 1, minHeight: '260px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <GisMap
              height="260px"
              showAoi={true}
              showCadastral={true}
              showTaxPoints={true}
              title="GCP & Checkpoint Distribution Grid"
            />
          </div>

          {/* Selected Point Details Card */}
          {selectedGcp && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '11.5px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f2b5c' }}>
                <span>{selectedGcp.name} ({selectedGcp.code})</span>
                <span style={{ color: '#15803d' }}>RMS: 0.011m (PASS)</span>
              </div>
              <div style={{ color: '#475569', display: 'flex', gap: '14px' }}>
                <span>Lat: <b>{selectedGcp.lat.toFixed(6)}</b></span>
                <span>Lng: <b>{selectedGcp.lng.toFixed(6)}</b></span>
                <span>Elev: <b>{selectedGcp.elevation}m</b></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
