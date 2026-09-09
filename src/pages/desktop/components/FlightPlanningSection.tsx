import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Camera,
  Cpu,
  Layers,
  CheckCircle2,
  Download,
  Save,
  Play,
  ArrowRight,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { FlightPlan, MOCK_FLIGHT_PLANS, SurveyProject } from '../../../data/survey3dData';
import { GisMap } from '../../../components/common/GisMap';

interface FlightPlanningSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const FlightPlanningSection: React.FC<FlightPlanningSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [plans, setPlans] = useState<FlightPlan[]>(MOCK_FLIGHT_PLANS);
  const [activePlan, setActivePlan] = useState<FlightPlan>(plans[0]);

  // Form edit state
  const [method, setMethod] = useState<'NADIR' | 'OBLIQUE' | 'OBLIQUE + LiDAR'>(activePlan.surveyMethod);
  const [altitude, setAltitude] = useState<number>(activePlan.altitudeMeters);
  const [forwardOverlap, setForwardOverlap] = useState<number>(activePlan.forwardOverlapPct);
  const [sideOverlap, setSideOverlap] = useState<number>(activePlan.sideOverlapPct);
  const [coverageValidated, setCoverageValidated] = useState<boolean>(true);

  const handleMethodChange = (newMethod: 'NADIR' | 'OBLIQUE' | 'OBLIQUE + LiDAR') => {
    setMethod(newMethod);
    if (newMethod === 'NADIR') {
      setAltitude(100);
      setForwardOverlap(80);
      setSideOverlap(70);
    } else if (newMethod === 'OBLIQUE') {
      setAltitude(120);
      setForwardOverlap(80);
      setSideOverlap(75);
    } else {
      setAltitude(120);
      setForwardOverlap(80);
      setSideOverlap(75);
    }
  };

  const exportFlightPlan = () => {
    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${activePlan.name}</name>
    <description>NAKSHA V2.0 Drone Flight Grid - Altitude: ${altitude}m, GSD: ${activePlan.gsdCm}cm</description>
    <Placemark>
      <name>Flight Survey Grid</name>
      <LineString>
        <coordinates>
          ${activePlan.waypoints.map((w) => `${w[1]},${w[0]},${altitude}`).join('\n          ')}
        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`;

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NAKSHA_FlightPlan_${project.id}_${method.replace(/[^a-zA-Z0-9]/g, '_')}.kml`;
    a.click();
    URL.revokeObjectURL(url);
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
          <Compass size={16} />
          <span>Professional Aerial Flight Planning & Survey Grid Synthesis</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Autonomous Multi-Rotor UAV Grid Execution • RTK Waypoint Mission
        </div>
      </div>

      {/* Main Split: Left Configuration Parameters + Right Interactive Survey Grid Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '14px' }}>
        {/* Left: Planning Controls Form */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            Mission Survey Parameters
          </div>

          {/* Survey Method Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Survey Acquisition Method:
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['NADIR', 'OBLIQUE', 'OBLIQUE + LiDAR'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => handleMethodChange(m)}
                  style={{
                    flex: 1,
                    backgroundColor: method === m ? '#0284c7' : '#f1f5f9',
                    color: method === m ? '#ffffff' : '#334155',
                    border: method === m ? '1px solid #0369a1' : '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '6px 4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Altitude & GSD */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              <span>Flight Altitude (AGL):</span>
              <b style={{ color: '#0284c7' }}>{altitude} meters</b>
            </div>
            <input
              type="range"
              min={60}
              max={180}
              step={5}
              value={altitude}
              onChange={(e) => setAltitude(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b' }}>
              <span>60m (High Res)</span>
              <span>Calculated GSD: <b>{(altitude * 0.0175).toFixed(1)} cm/px</b></span>
              <span>180m (Fast Coverage)</span>
            </div>
          </div>

          {/* Overlaps: Forward & Side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>Forward Overlap:</span>
                <b style={{ color: '#15803d' }}>{forwardOverlap}%</b>
              </div>
              <input
                type="range"
                min={70}
                max={90}
                value={forwardOverlap}
                onChange={(e) => setForwardOverlap(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                <span>Side Overlap:</span>
                <b style={{ color: '#15803d' }}>{sideOverlap}%</b>
              </div>
              <input
                type="range"
                min={60}
                max={85}
                value={sideOverlap}
                onChange={(e) => setSideOverlap(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Equipment Selection */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px 10px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>Drone: <b>{activePlan.drone}</b></div>
            <div>Camera: <b>{activePlan.camera}</b></div>
            <div>LiDAR Sensor: <b>{method.includes('LiDAR') ? activePlan.lidarSensor : 'Disabled in NADIR mode'}</b></div>
          </div>

          {/* Calculations Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '6px 8px', borderRadius: '4px', color: '#1e40af' }}>
              <div>Flight Lines: <b>16 Lines</b></div>
              <div>Est. Images: <b>1,840 Frames</b></div>
            </div>
            <div style={{ backgroundColor: '#f0fdf4', padding: '6px 8px', borderRadius: '4px', color: '#166534' }}>
              <div>Duration: <b>44 mins</b></div>
              <div>Coverage: <b>99.8% (PASS)</b></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => {
                  setCoverageValidated(true);
                  alert('Coverage validated: 99.8% geometric enclosure over Ward 54 AOI geofence.');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '7px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Validate Coverage
              </button>

              <button
                onClick={exportFlightPlan}
                style={{
                  flex: 1,
                  backgroundColor: '#475569',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '7px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <Download size={12} />
                <span>Export KML / WP</span>
              </button>
            </div>

            <button
              onClick={() => onNavigateSection('preflight-check')}
              style={{
                backgroundColor: '#22c55e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(34, 197, 94, 0.25)'
              }}
            >
              <span>Save & Proceed to Pre-Flight Check</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right: Map with Survey Grid */}
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
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={15} color="#0284c7" />
              <span>Survey Waypoint Grid & Overlap Simulation</span>
            </div>

            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
              ✓ Geofence Enclosure: Compliant
            </span>
          </div>

          <div style={{ flex: 1, minHeight: '420px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <GisMap
              height="440px"
              showAoi={true}
              showCadastral={true}
              showDronePath={true}
              showBuildings={true}
              title={`Flight Grid Plan (${method}) • ${project.district}`}
            />
          </div>

          <div style={{
            marginTop: '8px',
            fontSize: '11px',
            color: '#64748b',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Displaying 16 Parallel Flight Lines with 80% Forward & 75% Side Cross-Track Overlap</span>
            <span>Terrain-Follow Algorithm: Enabled (DEM Datum)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
