import React, { useState, useEffect } from 'react';
import {
  Radio,
  Camera,
  Cpu,
  Crosshair,
  Pause,
  Play,
  RotateCcw,
  CheckCircle,
  Square,
  AlertTriangle,
  ArrowRight,
  Battery,
  Wifi,
  Navigation,
  Layers
} from 'lucide-react';
import { MOCK_TELEMETRY, SurveyProject, TelemetryData } from '../../../data/survey3dData';
import { GisMap } from '../../../components/common/GisMap';

interface LiveAcquisitionSectionProps {
  project: SurveyProject;
  onEndSurvey: () => void;
}

export const LiveAcquisitionSection: React.FC<LiveAcquisitionSectionProps> = ({
  project,
  onEndSurvey
}) => {
  const [telemetry, setTelemetry] = useState<TelemetryData>(MOCK_TELEMETRY);
  const [isPaused, setIsPaused] = useState(false);
  const [missionStatus, setMissionStatus] = useState<'AIRBORNE' | 'PAUSED' | 'RETURNING_HOME'>('AIRBORNE');

  // Simulate live telemetry tick
  useEffect(() => {
    if (isPaused || missionStatus === 'RETURNING_HOME') return;

    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        drone: {
          ...prev.drone,
          batteryPct: Math.max(20, prev.drone.batteryPct - 0.1),
          altitudeMeters: +(120 + (Math.random() * 0.4 - 0.2)).toFixed(1),
          speedMs: +(7.2 + (Math.random() * 0.4 - 0.2)).toFixed(1)
        },
        camera: {
          ...prev.camera,
          imagesCaptured: prev.camera.imagesCaptured + 2,
          coveragePct: Math.min(100, +(prev.camera.coveragePct + 0.1).toFixed(1))
        },
        lidar: {
          ...prev.lidar,
          pointCount: prev.lidar.pointCount + 35000,
          pointDensityM2: +(142 + Math.random() * 2).toFixed(1)
        }
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused, missionStatus]);

  const handleReturnHome = () => {
    setMissionStatus('RETURNING_HOME');
    alert('Return-to-Home (RTH) command dispatched to UAV. Drone ascending to safe transit altitude (150m) and executing automated RTK homing.');
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
          <Radio size={16} color="#ef4444" className="pulse" />
          <span>Live Aerial Acquisition Station — Real-Time Flight & Multi-Sensor Telemetry</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px' }}>
          <span style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '2px 8px', borderRadius: '4px' }}>
            Mission Status: <b style={{ color: missionStatus === 'AIRBORNE' ? '#4ade80' : '#f59e0b' }}>{missionStatus}</b>
          </span>
          <span>Battery: <b style={{ color: '#ffffff' }}>{telemetry.drone.batteryPct.toFixed(0)}%</b></span>
        </div>
      </div>

      {/* Real-time Telemetry HUD (Drone, Camera, LiDAR, GNSS) */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '12px 16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Drone Flight Dynamics */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
            <span>UAV FLIGHT STATUS</span>
            <Navigation size={13} color="#0284c7" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f2b5c', marginTop: '2px' }}>
            Alt: {telemetry.drone.altitudeMeters}m
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Speed: <b>{telemetry.drone.speedMs} m/s</b></span>
            <span>Batt: <b>{telemetry.drone.batteryPct.toFixed(0)}%</b></span>
          </div>
        </div>

        {/* Camera Sensor Telemetry */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
            <span>RGB PHOTOGRAMMETRY</span>
            <Camera size={13} color="#15803d" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
            {telemetry.camera.imagesCaptured.toLocaleString()} Frames
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Blur: <b>{telemetry.camera.blurPercentage}%</b></span>
            <span>Coverage: <b>{telemetry.camera.coveragePct}%</b></span>
          </div>
        </div>

        {/* LiDAR Telemetry */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
            <span>AERIAL LIDAR SCANNER</span>
            <Cpu size={13} color="#b45309" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309', marginTop: '2px' }}>
            {(telemetry.lidar.pointCount / 1000000).toFixed(2)}M Points
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Density: <b>{telemetry.lidar.pointDensityM2} pts/m²</b></span>
            <span>Pulse: <b>100 kHz</b></span>
          </div>
        </div>

        {/* GNSS RTK Status */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
            <span>GEODETIC RTK FIX</span>
            <Crosshair size={13} color="#0284c7" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0369a1', marginTop: '2px' }}>
            {telemetry.drone.rtkStatus}
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Sats: <b>{telemetry.drone.satellites} Locked</b></span>
            <span>H: <b>± {telemetry.gnss.horizAccuracyM}m</b></span>
          </div>
        </div>
      </div>

      {/* Main Center Area: Map with live drone path + control HUD */}
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
            <Navigation size={15} color="#0284c7" />
            <span>Real-Time UAV Path Tracking & Ground Coverage Footprint</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsPaused(!isPaused)}
              style={{
                backgroundColor: isPaused ? '#15803d' : '#f59e0b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
              <span>{isPaused ? 'RESUME MISSION' : 'PAUSE SURVEY'}</span>
            </button>

            <button
              onClick={handleReturnHome}
              style={{
                backgroundColor: '#475569',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RotateCcw size={13} />
              <span>RETURN HOME (RTH)</span>
            </button>

            <button
              onClick={onEndSurvey}
              style={{
                backgroundColor: '#22c55e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 18px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(34, 197, 94, 0.3)'
              }}
            >
              <CheckCircle size={14} />
              <span>END SURVEY & INGEST DATA</span>
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: '380px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <GisMap
            height="400px"
            showAoi={true}
            showCadastral={true}
            showDronePath={true}
            showBuildings={true}
            title={`Live UAV Telemetry • Lat: ${telemetry.drone.currentLat}°N, Lng: ${telemetry.drone.currentLng}°E`}
          />
        </div>
      </div>
    </div>
  );
};
