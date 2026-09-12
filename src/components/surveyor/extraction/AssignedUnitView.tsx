import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  UploadCloud, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  FileText, 
  Layers, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle
} from 'lucide-react';
import { CURRENT_ASSIGNED_UNIT, INITIAL_SURVEY_FILES, SurveyFileRecord } from './extractionData';

interface AssignedUnitViewProps {
  onFinalise: () => void;
}

export const AssignedUnitView: React.FC<AssignedUnitViewProps> = ({ onFinalise }) => {
  const [files, setFiles] = useState<SurveyFileRecord[]>(INITIAL_SURVEY_FILES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showSimulateAlert, setShowSimulateAlert] = useState(false);

  const unit = CURRENT_ASSIGNED_UNIT;
  const allValid = files.every(f => f.validation === 'VALID');

  const filteredFiles = selectedCategory === 'All'
    ? files
    : files.filter(f => f.category === selectedCategory);

  const categories = ['All', 'LiDAR', 'Drone Imagery', 'GNSS / Trajectory', 'Ground Control (GCP)', 'Survey Metadata'];

  // Demo toggle to test validation state changes
  const toggleTestFileState = (id: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        const nextValidation = f.validation === 'VALID' ? 'WARNING' : 'VALID';
        return {
          ...f,
          validation: nextValidation,
          validationDetails: nextValidation === 'WARNING' 
            ? 'Minor timestamp drift detected (Δt = 3.2ms); review recommended.' 
            : 'Integrity verified and synchronized.'
        };
      }
      return f;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner: Professional Aerial Survey Processing System Notice */}
      <div style={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '10px',
        padding: '16px 22px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: '5px solid #2563eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            backgroundColor: 'rgba(37, 99, 235, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa'
          }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.3px' }}>
                DATA EXTRACTION & RECONSTRUCTION PIPELINE
              </h2>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                backgroundColor: '#1d4ed8',
                color: '#dbeafe',
                padding: '2px 8px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.6px'
              }}>
                STEP 1 OF 3 • ASSIGNED UNIT
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Sequential multi-sensor aerial survey data ingestion, radiometric validation, and spatial alignment for automated 3D LoD2/LoD3 reconstruction.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Ingestion Engine</div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#10b981' }}>● NAKSHA-3D v2.4 ONLINE</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: ASSIGNED SURVEY UNIT METADATA CARD (Req #2) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          padding: '14px 20px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="#1d4ed8" />
            <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              Assigned Survey Unit & Demonstration Property Record
            </h3>
          </div>
          <span style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            padding: '3px 10px',
            borderRadius: '6px',
            fontWeight: 700,
            border: '1px solid #bfdbfe'
          }}>
            ULPIN: {unit.ulpin14}
          </span>
        </div>

        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          {/* Left: Building Demonstration Card with Real Thumbnail */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            overflow: 'hidden',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #334155'
          }}>
            <div style={{ position: 'relative', height: '170px', overflow: 'hidden', backgroundColor: '#1e293b' }}>
              <img 
                src="/front_reconstruction.png" 
                alt="PPCRC Demonstration Building"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/atrium_interior_reconstruction.png';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(6px)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                Target Model: PPCRC Institutional Building
              </div>
            </div>

            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                PPCRC Academic & Research Complex
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="#38bdf8" />
                <span>Hinjawadi Infotech Park, Phase 1, Pune</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #334155' }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>Footprint</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f1f5f9' }}>{unit.footprintAreaSqm} m²</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>Elevation MSL</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f1f5f9' }}>{unit.coordinates.elevationMsl} m</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>Storeys</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f1f5f9' }}>G+4 ({unit.totalFloors} Tiers)</div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>Total Height</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f1f5f9' }}>{unit.totalHeightM} m</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Authoritative Jurisdiction & Survey Unit Specification Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 20px', alignContent: 'start' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Survey Unit Name</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginTop: '3px' }}>{unit.unitName}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Survey Unit ID</div>
              <div style={{ fontSize: '13.5px', fontFamily: 'monospace', fontWeight: 700, color: '#0369a1', marginTop: '3px' }}>{unit.surveyUnitId}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Property / Building ID</div>
              <div style={{ fontSize: '13.5px', fontFamily: 'monospace', fontWeight: 700, color: '#0f766e', marginTop: '3px' }}>{unit.propertyBuildingId}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Village</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{unit.village}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Urban Local Body (ULB)</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{unit.ulb}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>District & State</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginTop: '3px' }}>{unit.district}, {unit.state}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Survey Date</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#64748b" />
                <span>{unit.surveyDate}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Survey Team</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1d4ed8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="#1d4ed8" />
                <span>{unit.assignedTeam}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#eff6ff', padding: '10px 14px', borderRadius: '6px', border: '1px solid #bfdbfe', gridColumn: 'span 3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1e40af' }}>
                <ShieldCheck size={16} color="#1d4ed8" />
                <span>Spatial Reference: <b>{unit.crs}</b> • Geodetic Coordinates: <b>{unit.coordinates.lat}° N, {unit.coordinates.lng}° E</b></span>
              </div>
              <span style={{ fontSize: '11.5px', backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                ✓ GNSS CORS LOCKED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: MULTI-FORMAT SURVEY DATA IMPORT & VALIDATION MATRIX (Req #40 & #41) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Table Filter & Actions Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={18} color="#2563eb" />
              Multi-Sensor Survey Data Ingestion Matrix
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Supported formats: LiDAR (.LAS/.LAZ 1.4) • Drone Imagery (.JPG/.TIFF) • Trajectory (.POS/.CSV/.NMEA) • Ground Control (.CSV) • Metadata (.JSON)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  backgroundColor: selectedCategory === cat ? '#2563eb' : '#f1f5f9',
                  color: selectedCategory === cat ? '#ffffff' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* File Ingestion Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '11px 16px', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '11px 16px', fontWeight: 700 }}>File Name & Format</th>
                <th style={{ padding: '11px 16px', fontWeight: 700 }}>Size</th>
                <th style={{ padding: '11px 16px', fontWeight: 700 }}>Record Count / Resolution</th>
                <th style={{ padding: '11px 16px', fontWeight: 700 }}>Spatial Reference (CRS)</th>
                <th style={{ padding: '11px 16px', fontWeight: 700 }}>Validation Status</th>
                <th style={{ padding: '11px 16px', fontWeight: 700 }}>Automated Quality Audit</th>
                <th style={{ padding: '11px 16px', fontWeight: 700, textAlign: 'center' }}>Audit Toggle</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((f, idx) => {
                const isValid = f.validation === 'VALID';
                const isWarning = f.validation === 'WARNING';
                return (
                  <tr key={f.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                  }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#e2e8f0',
                        color: '#334155'
                      }}>
                        {f.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{f.fileName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{f.fileFormat}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#334155' }}>
                      {f.fileSize}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 600 }}>
                      {f.recordCount}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '11.5px', color: '#475569' }}>
                      {f.crs}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        backgroundColor: isValid ? '#dcfce7' : isWarning ? '#fef3c7' : '#fee2e2',
                        color: isValid ? '#15803d' : isWarning ? '#b45309' : '#b91c1c'
                      }}>
                        {isValid ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                        {f.validation}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#475569', maxWidth: '300px' }}>
                      {f.validationDetails}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => toggleTestFileState(f.id)}
                        title="Simulate validation warning to test error handling"
                        style={{
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          color: '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {isValid ? 'Test Warning' : 'Reset Valid'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ingestion Summary Bar */}
        <div style={{
          padding: '14px 20px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12.5px', color: '#475569' }}>
            <span>Total Datasets: <b>{files.length}</b></span>
            <span>•</span>
            <span>Total Point Returns: <b>14,820,940</b></span>
            <span>•</span>
            <span>Photogrammetry Frames: <b>482 Exposures</b></span>
            <span>•</span>
            <span>GCP Ground References: <b>6 Points</b></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: allValid ? '#15803d' : '#b45309', fontWeight: 600 }}>
              {allValid ? '✓ All files passed format, CRS, and checksum validation' : '⚠️ Non-critical validation flags present'}
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR WITH FINALISE BUTTON (Req #2) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 24px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={18} color="#64748b" />
          <span style={{ fontSize: '13px', color: '#475569' }}>
            The user cannot start 3D reconstruction until the assigned survey unit and raw datasets are <b>finalized</b>.
          </span>
        </div>

        <button
          onClick={onFinalise}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 28px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <span>FINALISE</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};
