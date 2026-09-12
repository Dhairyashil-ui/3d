import React, { useState, useEffect, useRef } from 'react';
import { Cinematic3DPipeline } from './cinematic3d/Cinematic3DPipeline';
import { 
  Play, 
  Pause, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Maximize2, 
  Layers, 
  Activity, 
  Cpu, 
  Compass, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  Radio,
  Eye,
  Camera,
  Boxes,
  Sliders,
  ArrowRight,
  Box
} from 'lucide-react';
import { TECHNICAL_STAGES, TechnicalPipelineStage } from './extractionData';

interface CinematicReconstructionPipelineProps {
  onComplete: () => void;
  onExit: () => void;
}

export const CinematicReconstructionPipeline: React.FC<CinematicReconstructionPipelineProps> = ({
  onComplete,
  onExit
}) => {
  const [pipelineMode, setPipelineMode] = useState<'3d_webgl' | '2d_schematic'>('3d_webgl');

  if (pipelineMode === '3d_webgl') {
    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <Cinematic3DPipeline onComplete={onComplete} onExit={onExit} />
        <button
          onClick={() => setPipelineMode('2d_schematic')}
          style={{
            position: 'fixed',
            bottom: '12px',
            right: '12px',
            zIndex: 9999,
            padding: '4px 10px',
            fontSize: '9px',
            fontFamily: 'monospace',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#94a3b8',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          title="Switch to 2D Technical Schematic Mode"
        >
          2D SCHEMATIC MODE
        </button>
      </div>
    );
  }

  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [pulseTick, setPulseTick] = useState<number>(0);

  const stage = TECHNICAL_STAGES[currentStageIdx];
  const totalStages = TECHNICAL_STAGES.length;

  // Animation pulse ticker
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseTick(prev => (prev + 1) % 1000);
    }, 40);
    return () => clearInterval(pulseInterval);
  }, []);

  // Stage progression timer (approx 3.2 seconds base per stage as requested in prompt)
  useEffect(() => {
    if (!isPlaying) return;

    const baseDuration = 3200; // ~3.2s
    const effectiveDuration = baseDuration / speedMultiplier;

    const timer = setTimeout(() => {
      if (currentStageIdx < totalStages - 1) {
        setCurrentStageIdx(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, effectiveDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStageIdx, speedMultiplier, totalStages]);

  const handleNext = () => {
    if (currentStageIdx < totalStages - 1) {
      setCurrentStageIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStageIdx > 0) {
      setCurrentStageIdx(prev => prev - 1);
    }
  };

  const handleSkipToFinish = () => {
    setCurrentStageIdx(totalStages - 1);
    setIsPlaying(false);
  };

  // Render stage-specific technical visualization
  const renderStageVisual = () => {
    const t = pulseTick * 0.05;

    switch (stage.visualMode) {
      // 1. STAGE 1 — LIDAR INPUT & RAW SENSOR DATA (Req #5, #6)
      case 'lidar_pulse':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="680" height="380" viewBox="0 0 680 380" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="laserBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Sensor Emitter (Left) */}
              <rect x="80" y="140" width="110" height="100" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
              <circle cx="135" cy="180" r="22" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="135" cy="180" r="8" fill="#38bdf8" filter="url(#glow)" />
              <text x="135" y="225" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">LIDAR SENSOR</text>

              {/* Target Surface (Right) */}
              <path d="M 520,80 L 540,80 L 540,300 L 520,300 Z" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="560" y="190" fill="#cbd5e1" fontSize="11" fontWeight="bold">BUILDING FACADE</text>

              {/* Laser Pulse Travelling to Target */}
              <line x1="165" y1="180" x2="520" y2="180" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 6" />
              {/* Animated Emitted Pulse */}
              <circle 
                cx={165 + ((pulseTick * 7) % 355)} 
                cy="176" 
                r="7" 
                fill="#38bdf8" 
                filter="url(#glow)" 
              />
              {/* Animated Return Pulse */}
              <circle 
                cx={520 - ((pulseTick * 7) % 355)} 
                cy="184" 
                r="6" 
                fill="#22c55e" 
                filter="url(#glow)" 
              />

              {/* Time of flight & formula annotations */}
              <text x="340" y="145" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">
                EMITTED LASER PULSE →
              </text>
              <text x="340" y="215" fill="#22c55e" fontSize="12" textAnchor="middle" fontWeight="bold">
                ← REFLECTED RETURN PULSE
              </text>

              {/* Center Technical Data Card */}
              <rect x="230" y="240" width="220" height="90" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="340" y="265" fill="#38bdf8" fontSize="13" textAnchor="middle" fontWeight="bold">LIDAR INPUT</text>
              <text x="340" y="284" fill="#94a3b8" fontSize="11" textAnchor="middle">RAW SENSOR DATA</text>
              <text x="340" y="305" fill="#22c55e" fontSize="11" textAnchor="middle" fontFamily="monospace">
                X: 12.42  Y: 3.18  Z: -1.52
              </text>
              <text x="340" y="322" fill="#64748b" fontSize="10" textAnchor="middle">1 Return = 1 Spatial Point</text>
            </svg>
          </div>
        );

      // 2. STAGE 2 — DRONE IMAGE INPUT & MULTI-SENSOR (Req #7)
      case 'drone_camera':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="680" height="380" viewBox="0 0 680 380">
              {/* Drone Body */}
              <g transform={`translate(340, ${150 + Math.sin(t) * 8})`}>
                {/* Adding GNSS Banner above drone */}
                <rect x="-85" y="-95" width="170" height="32" rx="6" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="0" y="-74" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">ADDING GNSS</text>

                {/* Drone Arms & Rotors */}
                <line x1="-120" y1="-30" x2="120" y2="30" stroke="#475569" strokeWidth="5" />
                <line x1="-120" y1="30" x2="120" y2="-30" stroke="#475569" strokeWidth="5" />
                
                {/* Rotating Propellers */}
                <ellipse cx="-120" cy="-30" rx={24 + Math.cos(t * 5) * 10} ry="4" fill="#64748b" />
                <ellipse cx="120" cy="30" rx={24 + Math.cos(t * 5) * 10} ry="4" fill="#64748b" />
                <ellipse cx="-120" cy="30" rx={24 + Math.cos(t * 5) * 10} ry="4" fill="#64748b" />
                <ellipse cx="120" cy="-30" rx={24 + Math.cos(t * 5) * 10} ry="4" fill="#64748b" />

                {/* Drone Main Chassis */}
                <rect x="-45" y="-25" width="90" height="50" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
                
                {/* Camera / Gimbal Mount */}
                <rect x="-18" y="25" width="36" height="24" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="0" cy="37" r="7" fill="#f59e0b" />
                <text x="0" y="3" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">LIDAR</text>
                <text x="0" y="62" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">61MP CAMERA</text>

                {/* Camera Field of View Cone */}
                <polygon points="0,48 -140,160 140,160" fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" strokeDasharray="4 4" />
              </g>

              {/* Sequential Overlapping Images Queue */}
              <g transform="translate(100, 290)">
                <rect x="0" y="0" width="75" height="50" rx="4" fill="#1e293b" stroke="#475569" />
                <text x="37" y="30" fill="#94a3b8" fontSize="10" textAnchor="middle">IMAGE 001</text>
              </g>
              <g transform="translate(190, 290)">
                <rect x="0" y="0" width="75" height="50" rx="4" fill="#1e293b" stroke="#475569" />
                <text x="37" y="30" fill="#94a3b8" fontSize="10" textAnchor="middle">IMAGE 002</text>
              </g>
              <g transform="translate(280, 290)">
                <rect x="0" y="0" width="75" height="50" rx="4" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                <text x="37" y="30" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">IMAGE 003</text>
              </g>
              <g transform="translate(370, 290)">
                <rect x="0" y="0" width="75" height="50" rx="4" fill="#1e293b" stroke="#475569" />
                <text x="37" y="30" fill="#94a3b8" fontSize="10" textAnchor="middle">IMAGE 004</text>
              </g>
              <g transform="translate(460, 290)">
                <rect x="0" y="0" width="75" height="50" rx="4" fill="#1e293b" stroke="#475569" />
                <text x="37" y="30" fill="#94a3b8" fontSize="10" textAnchor="middle">IMAGE ...</text>
              </g>
            </svg>
          </div>
        );

      // 3. STAGE 3 — GNSS DATA COORDINATE CARD (Req #8)
      case 'gnss_card':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '420px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '2px solid #38bdf8',
              borderRadius: '12px',
              padding: '24px 28px',
              boxShadow: '0 0 35px rgba(56, 189, 248, 0.25)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio size={20} color="#38bdf8" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.6px' }}>
                    DRONE SENSOR POSE (GNSS / RTK)
                  </span>
                </div>
                <span style={{ fontSize: '10.5px', backgroundColor: '#166534', color: '#86efac', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  RTK FIXED
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>LATITUDE</div>
                  <div style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: 800, color: '#f8fafc', marginTop: '3px' }}>
                    18.584072° N
                  </div>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>LONGITUDE</div>
                  <div style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: 800, color: '#f8fafc', marginTop: '3px' }}>
                    73.737195° E
                  </div>
                </div>

                <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #22c55e' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>ALTITUDE MSL</div>
                  <div style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: 800, color: '#4ade80', marginTop: '3px' }}>
                    568.20 m
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: '1.4', backgroundColor: 'rgba(2, 6, 23, 0.6)', padding: '10px 12px', borderRadius: '6px' }}>
                <b>Note:</b> GNSS determines the <i>drone sensor position over time</i>. It does not measure XYZ of every LiDAR point directly.
              </div>
            </div>
          </div>
        );

      // 4. STAGE 4 — GNSS + IMU + TIMESTAMP SYNCHRONIZATION [T1 → T5] (Req #9)
      case 'gnss_imu_trajectory':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="680" height="380" viewBox="0 0 680 380">
              <defs>
                <linearGradient id="trajGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Title Header */}
              <text x="340" y="45" fill="#38bdf8" fontSize="13" textAnchor="middle" fontWeight="bold">
                DRONE TRAJECTORY POSE SYNCHRONIZATION
              </text>
              <text x="340" y="68" fill="#94a3b8" fontSize="11" textAnchor="middle">
                GNSS Position (20Hz) + IMU Orientation (200Hz) @ Timestamp t
              </text>

              {/* Flight Path Curve */}
              <path d="M 80,180 Q 220,120 340,190 T 600,160" fill="none" stroke="url(#trajGrad)" strokeWidth="3" />

              {/* Waypoints T1 to T5 */}
              {[
                { label: 'T1', x: 80, y: 180 },
                { label: 'T2', x: 210, y: 145 },
                { label: 'T3', x: 340, y: 190 },
                { label: 'T4', x: 470, y: 175 },
                { label: 'T5', x: 600, y: 160 }
              ].map((pt, i) => (
                <g key={pt.label} transform={`translate(${pt.x}, ${pt.y})`}>
                  <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="0" cy="0" r="4" fill="#38bdf8" />
                  <text x="0" y="4" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">{pt.label}</text>
                  <text x="0" y="-22" fill="#a855f7" fontSize="10" textAnchor="middle" fontWeight="bold">Pose {i + 1}</text>
                  {/* Downward sync ray */}
                  <line x1="0" y1="16" x2="0" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="0" y="85" fill="#64748b" fontSize="9" textAnchor="middle">GNSS+IMU</text>
                </g>
              ))}

              {/* Moving Drone Sprite along Trajectory */}
              <circle 
                cx={80 + ((pulseTick * 5) % 520)} 
                cy={170 + Math.sin(pulseTick * 0.1) * 20} 
                r="9" 
                fill="#f59e0b" 
                stroke="#ffffff" 
                strokeWidth="2" 
              />

              {/* Bottom Sync Banner */}
              <rect x="140" y="300" width="400" height="42" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#475569" />
              <text x="340" y="326" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">
                TIMESTAMP SYNCHRONIZATION: GNSS/INS ↔ LIDAR CLOCK
              </text>
            </svg>
          </div>
        );

      // 5. STAGE 5 — GROUND MEASUREMENT ANIMATION (Req #10)
      case 'ground_range':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="680" height="380" viewBox="0 0 680 380">
              {/* Drone at Top */}
              <g transform="translate(340, 70)">
                <rect x="-40" y="-18" width="80" height="36" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="0" y="4" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">DRONE</text>
                <circle cx="0" cy="18" r="5" fill="#f59e0b" />
              </g>

              {/* Vertical LiDAR Range Measurement Beam */}
              <line x1="340" y1="90" x2="340" y2="290" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6 4" />
              
              {/* Animated Range Measurement Pulse */}
              <circle cx="340" cy={90 + ((pulseTick * 8) % 200)} r="7" fill="#06b6d4" />

              {/* Distance Arrow Indicators */}
              <g transform="translate(365, 190)">
                <line x1="0" y1="-80" x2="0" y2="80" stroke="#f59e0b" strokeWidth="2" />
                <polygon points="0,-85 -4,-75 4,-75" fill="#f59e0b" />
                <polygon points="0,85 -4,75 4,75" fill="#f59e0b" />
                <rect x="15" y="-16" width="170" height="32" rx="4" fill="#1e293b" stroke="#f59e0b" />
                <text x="100" y="4" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">
                  DISTANCE TO GROUND: 48.34m
                </text>
              </g>

              {/* Ground Terrain at Bottom */}
              <rect x="100" y="290" width="480" height="24" fill="#334155" stroke="#475569" />
              <text x="340" y="307" fill="#cbd5e1" fontSize="12" textAnchor="middle" fontWeight="bold">GROUND SURFACE</text>

              {/* Crucial Notice Banner as required */}
              <rect x="120" y="326" width="440" height="34" rx="6" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="1.5" />
              <text x="340" y="348" fill="#fca5a5" fontSize="11" textAnchor="middle" fontWeight="bold">
                IMPORTANT: A LiDAR drone-to-ground measurement is NOT automatically a GCP.
              </text>
            </svg>
          </div>
        );

      // 6. STAGE 6 — GROUND CONTROL POINTS (Req #11)
      case 'gcp_network':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="680" height="380" viewBox="0 0 680 380">
              <text x="340" y="40" fill="#22c55e" fontSize="14" textAnchor="middle" fontWeight="bold">
                GROUND CONTROL POINTS (GCP) NETWORK
              </text>
              <text x="340" y="62" fill="#94a3b8" fontSize="11" textAnchor="middle">
                Independently surveyed high-precision benchmarks (Checkered targets & DGPS)
              </text>

              {/* Ground Terrain Outline */}
              <path d="M 60,260 L 620,260" stroke="#475569" strokeWidth="3" />

              {/* GCP Target 1 */}
              <g transform="translate(180, 240)">
                <rect x="-18" y="-18" width="36" height="36" fill="#ffffff" stroke="#22c55e" strokeWidth="2" />
                <path d="M -18,-18 L 0,-18 L 0,0 L -18,0 Z" fill="#000000" />
                <path d="M 0,0 L 18,0 L 18,18 L 0,18 Z" fill="#000000" />
                <circle cx="0" cy="0" r="3" fill="#ef4444" />
                <rect x="-60" y="-60" width="120" height="34" rx="4" fill="#0f172a" stroke="#22c55e" />
                <text x="0" y="-45" fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="bold">GCP-01</text>
                <text x="0" y="-32" fill="#94a3b8" fontSize="9" textAnchor="middle">X: 367412.82 Y: 2055184.14</text>
              </g>

              {/* GCP Target 2 */}
              <g transform="translate(340, 240)">
                <rect x="-18" y="-18" width="36" height="36" fill="#ffffff" stroke="#22c55e" strokeWidth="2" />
                <path d="M -18,-18 L 0,-18 L 0,0 L -18,0 Z" fill="#000000" />
                <path d="M 0,0 L 18,0 L 18,18 L 0,18 Z" fill="#000000" />
                <circle cx="0" cy="0" r="3" fill="#ef4444" />
                <rect x="-60" y="-60" width="120" height="34" rx="4" fill="#0f172a" stroke="#22c55e" />
                <text x="0" y="-45" fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="bold">GCP-02</text>
                <text x="0" y="-32" fill="#94a3b8" fontSize="9" textAnchor="middle">X: 367498.10 Y: 2055210.35</text>
              </g>

              {/* GCP Target 3 */}
              <g transform="translate(500, 240)">
                <rect x="-18" y="-18" width="36" height="36" fill="#ffffff" stroke="#22c55e" strokeWidth="2" />
                <path d="M -18,-18 L 0,-18 L 0,0 L -18,0 Z" fill="#000000" />
                <path d="M 0,0 L 18,0 L 18,18 L 0,18 Z" fill="#000000" />
                <circle cx="0" cy="0" r="3" fill="#ef4444" />
                <rect x="-60" y="-60" width="120" height="34" rx="4" fill="#0f172a" stroke="#22c55e" />
                <text x="0" y="-45" fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="bold">GCP-03</text>
                <text x="0" y="-32" fill="#94a3b8" fontSize="9" textAnchor="middle">X: 367545.60 Y: 2055140.80</text>
              </g>

              {/* Triangle Geodetic Control Mesh */}
              <polygon points="180,240 340,240 500,240" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="340" y="325" fill="#94a3b8" fontSize="11" textAnchor="middle">
                Geodetic network anchors absolute georeferencing & eliminates drift error (Residual: 0.007m)
              </text>
            </svg>
          </div>
        );

      // 7. STAGE 7 — ACTIVE LIDAR SCANNING (Req #12)
      case 'lidar_scanning':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="680" height="380" viewBox="0 0 680 380">
              {/* Drone Scanner at Origin */}
              <circle cx="340" cy="50" r="10" fill="#38bdf8" />
              <text x="340" y="30" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="bold">SENSOR POSE</text>

              {/* Rotating Laser Rays striking PPCRC Building */}
              {[-50, -35, -20, -10, 0, 10, 20, 35, 50].map((angle, i) => {
                const rad = ((angle + Math.sin(t * 2) * 15) * Math.PI) / 180;
                const endX = 340 + Math.sin(rad) * 260;
                const endY = 50 + Math.cos(rad) * 260;
                return (
                  <g key={i}>
                    <line x1="340" y1="50" x2={endX} y2={endY} stroke="#06b6d4" strokeWidth="1.5" opacity={0.7} />
                    <circle cx={endX} cy={endY} r="3" fill="#22c55e" />
                  </g>
                );
              })}

              {/* PPCRC Building Schematic Profile */}
              {/* Roof */}
              <rect x="180" y="160" width="320" height="15" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="340" y="152" fill="#38bdf8" fontSize="10" textAnchor="middle">ROOF SLAB</text>

              {/* Facade Walls */}
              <rect x="190" y="175" width="300" height="130" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              
              {/* Doors & Windows */}
              <rect x="315" y="225" width="50" height="80" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
              <text x="340" y="270" fill="#93c5fd" fontSize="9" textAnchor="middle">DOOR</text>

              <rect x="220" y="200" width="60" height="40" fill="#164e63" stroke="#22d3ee" strokeWidth="1" />
              <rect x="400" y="200" width="60" height="40" fill="#164e63" stroke="#22d3ee" strokeWidth="1" />
              <text x="250" y="224" fill="#67e8f9" fontSize="9" textAnchor="middle">WINDOW</text>
              <text x="430" y="224" fill="#67e8f9" fontSize="9" textAnchor="middle">WINDOW</text>

              {/* Ground Returns */}
              <line x1="80" y1="305" x2="600" y2="305" stroke="#475569" strokeWidth="2" />
              <text x="340" y="340" fill="#4ade80" fontSize="12" textAnchor="middle" fontWeight="bold">
                LASER → SURFACE RETURN → XYZ POINT CLOUD ACCUMULATION
              </text>
            </svg>
          </div>
        );

      // 8. STAGE 8 — LIDAR POINT CREATION PIPELINE (Req #13)
      case 'lidar_point_creation':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              padding: '24px 32px',
              borderRadius: '12px',
              border: '1.5px solid #38bdf8',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.2)'
            }}>
              {[
                { title: 'RANGE + ANGLE', sub: 'Sensor Time & Direction', color: '#38bdf8' },
                { title: 'LIDAR COORD', sub: 'Scanner Local Frame', color: '#06b6d4' },
                { title: 'GNSS/INS POSE', sub: 'R_ins(t) + T_gnss(t)', color: '#a855f7' },
                { title: 'TRANSFORMATION', sub: 'Rigid Matrix Multiply', color: '#f59e0b' },
                { title: 'WORLD XYZ', sub: 'EPSG:32643 Geotagged', color: '#22c55e' }
              ].map((stepItem, idx) => (
                <React.Fragment key={stepItem.title}>
                  <div style={{
                    backgroundColor: '#1e293b',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    borderTop: `3px solid ${stepItem.color}`,
                    textAlign: 'center',
                    minWidth: '115px'
                  }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: stepItem.color }}>{stepItem.title}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{stepItem.sub}</div>
                  </div>
                  {idx < 4 && (
                    <div style={{ color: '#64748b', fontSize: '18px', fontWeight: 'bold' }}>→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );

      // 9 & 10. CAMERA PHOTOGRAMMETRY & FEATURE MATCHING (Req #14, #15)
      case 'camera_overlap':
      case 'feature_matching':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="680" height="380" viewBox="0 0 680 380">
              <text x="340" y="40" fill="#f59e0b" fontSize="13" textAnchor="middle" fontWeight="bold">
                SIFT FEATURE HOMOLOGY MATCHING ACROSS STEREO IMAGES
              </text>

              {/* Photo 1 (Left) */}
              <g transform="translate(100, 80)">
                <rect x="0" y="0" width="200" height="160" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <text x="100" y="24" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">IMAGE 084</text>
                {/* Facade Door & Window shapes */}
                <rect x="70" y="60" width="60" height="80" fill="#0f172a" stroke="#64748b" />
                {/* Keypoints */}
                <circle cx="70" cy="60" r="4" fill="#22c55e" />
                <circle cx="130" cy="60" r="4" fill="#22c55e" />
                <circle cx="100" cy="100" r="4" fill="#06b6d4" />
                <circle cx="70" cy="140" r="4" fill="#38bdf8" />
              </g>

              {/* Photo 2 (Right) */}
              <g transform="translate(380, 80)">
                <rect x="0" y="0" width="200" height="160" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <text x="100" y="24" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">IMAGE 085</text>
                {/* Slightly angled door in next frame */}
                <polygon points="65,65 125,58 125,138 65,145" fill="#0f172a" stroke="#64748b" />
                {/* Matching Keypoints */}
                <circle cx="65" cy="65" r="4" fill="#22c55e" />
                <circle cx="125" cy="58" r="4" fill="#22c55e" />
                <circle cx="95" cy="102" r="4" fill="#06b6d4" />
                <circle cx="65" cy="145" r="4" fill="#38bdf8" />
              </g>

              {/* Feature Match Lines between images */}
              <line x1="170" y1="140" x2="445" y2="145" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="230" y1="140" x2="505" y2="138" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="200" y1="180" x2="475" y2="182" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="170" y1="220" x2="445" y2="225" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />

              <text x="340" y="290" fill="#4ade80" fontSize="12" textAnchor="middle" fontWeight="bold">
                ✓ 4.8 Million Validated Tie Points Across Stereo Frames
              </text>
            </svg>
          </div>
        );

      // 11 & 12. STRUCTURE FROM MOTION & TRIANGULATION (Req #16, #17)
      case 'sfm_poses':
      case 'triangulation':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="680" height="380" viewBox="0 0 680 380">
              <text x="340" y="40" fill="#38bdf8" fontSize="13" textAnchor="middle" fontWeight="bold">
                OPTICAL RAY TRIANGULATION INTO 3D SPACE
              </text>

              {/* Camera A (Left) */}
              <g transform="translate(140, 90)">
                <polygon points="0,0 20,-12 20,12" fill="#f59e0b" />
                <rect x="-35" y="-12" width="35" height="24" rx="4" fill="#1e293b" stroke="#f59e0b" />
                <text x="-17" y="4" fill="#ffffff" fontSize="9" textAnchor="middle">CAM A</text>
              </g>

              {/* Camera B (Right) */}
              <g transform="translate(540, 90)">
                <polygon points="0,0 -20,-12 -20,12" fill="#f59e0b" />
                <rect x="0" y="-12" width="35" height="24" rx="4" fill="#1e293b" stroke="#f59e0b" />
                <text x="17" y="4" fill="#ffffff" fontSize="9" textAnchor="middle">CAM B</text>
              </g>

              {/* Intersecting Optical Rays */}
              <line x1="160" y1="90" x2="340" y2="250" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5" />
              <line x1="520" y1="90" x2="340" y2="250" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5" />

              {/* Triangulated 3D Point */}
              <circle cx="340" cy="250" r="10" fill="#22c55e" stroke="#ffffff" strokeWidth="2" />
              <circle cx="340" cy="250" r="18" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" />
              <text x="340" y="280" fill="#4ade80" fontSize="13" textAnchor="middle" fontWeight="bold">
                RECONSTRUCTED 3D POINT
              </text>
              <text x="340" y="298" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                X: 18.584072, Y: 73.737195, Z: 569.42m
              </text>
            </svg>
          </div>
        );

      // 14 & 15. REGISTRATION & TWO DIFFERENT MATCHING TYPES (Req #19, #20, #21, #22)
      case 'registration_icp':
      case 'two_matching_types':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '640px' }}>
              {/* Type A Box */}
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '10px',
                border: '1.5px solid #06b6d4',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#06b6d4' }}>
                  A. LIDAR POINT → CAMERA PIXEL
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Collinear projection of a 3D LiDAR point onto calibrated 2D image plane to sample RGB color.
                </div>
                <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8' }}>
                  3D Point (X,Y,Z) → Extrinsics → Projection → Pixel (u,v) → RGB
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                  ✓ Output: XYZ + RGB Colorized Points
                </div>
              </div>

              {/* Type B Box */}
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '10px',
                border: '1.5px solid #a855f7',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#a855f7' }}>
                  B. LIDAR CLOUD ↔ PHOTOGRAMMETRY
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Rigid 3D → 3D registration between two independently reconstructed surface point clouds.
                </div>
                <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', color: '#c084fc' }}>
                  Cloud 1 ↔ Initial GCP Anchor ↔ ICP Refinement ↔ Zero Residual
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                  ✓ Output: Same Spatial Coordinate Datum
                </div>
              </div>
            </div>
          </div>
        );

      // 19 & 20. AI SEMANTIC VS INSTANCE SEGMENTATION & DOOR DECISION (Req #27, #28, #29, #30)
      case 'semantic_instance':
      case 'door_boundaries_decision':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '620px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderRadius: '12px',
              border: '2px solid #22c55e',
              padding: '22px 26px',
              boxShadow: '0 0 35px rgba(34, 197, 94, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#4ade80' }}>
                  OBJECT CLASSIFICATION & DECISION PIPELINE: DOOR #127
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#14532d', color: '#86efac', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  CONFIDENCE: 97.4%
                </span>
              </div>

              {/* Signals checklist proving: "How the system decides this is a door" */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '6px', color: '#cbd5e1' }}>
                  ✓ <b>Geometry:</b> Planar surface (|variance| &lt; 0.02m)
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '6px', color: '#cbd5e1' }}>
                  ✓ <b>Shape:</b> Approximately rectangular outline
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '6px', color: '#cbd5e1' }}>
                  ✓ <b>Orientation:</b> Strictly vertical (|normal.z| &lt; 0.05)
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '6px', color: '#cbd5e1' }}>
                  ✓ <b>Dimensions:</b> Width 0.92m / Height 2.05m (Standard)
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '6px', color: '#cbd5e1' }}>
                  ✓ <b>Position:</b> Located on/inside WALL #001 boundary
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '8px 12px', borderRadius: '6px', color: '#cbd5e1' }}>
                  ✓ <b>Depth:</b> Recessed 0.14m relative to facade plane
                </div>
              </div>

              <div style={{ backgroundColor: '#020617', padding: '10px 14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Tagged Points: <b>15,201 to 18,400</b> (4,827 Returns)</span>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700 }}>Class: DOOR • Instance: 127</span>
              </div>
            </div>
          </div>
        );

      // 21 & 22. 3D BOUNDING BOX & OBJECT GRAPH (Req #31, #32, #33, #34)
      case 'bounding_box_measurements':
      case 'object_graph':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="680" height="380" viewBox="0 0 680 380">
              {/* 3D Oriented Bounding Box Projection for Door #127 */}
              <g transform="translate(180, 100)">
                {/* 3D Wireframe Box */}
                <polygon points="0,0 120,0 120,200 0,200" fill="rgba(6, 182, 212, 0.08)" stroke="#06b6d4" strokeWidth="2" />
                <polygon points="0,0 30,-25 150,-25 120,0" fill="rgba(6, 182, 212, 0.04)" stroke="#06b6d4" strokeWidth="1.5" />
                <polygon points="120,0 150,-25 150,175 120,200" fill="rgba(6, 182, 212, 0.04)" stroke="#06b6d4" strokeWidth="1.5" />
                
                {/* Measurements with Arrows as requested in prompt */}
                {/* Height line */}
                <line x1="-20" y1="0" x2="-20" y2="200" stroke="#f59e0b" strokeWidth="2" />
                <polygon points="-20,-5 -24,5 -16,5" fill="#f59e0b" />
                <polygon points="-20,205 -24,195 -16,195" fill="#f59e0b" />
                <text x="-35" y="105" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">2.05 m ↕</text>

                {/* Width line */}
                <line x1="0" y1="225" x2="120" y2="225" stroke="#f59e0b" strokeWidth="2" />
                <polygon points="-5,225 5,221 5,229" fill="#f59e0b" />
                <polygon points="125,225 115,221 115,229" fill="#f59e0b" />
                <text x="60" y="245" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">← 0.92 m →</text>

                {/* Depth line */}
                <line x1="130" y1="-8" x2="155" y2="-28" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="165" y="-12" fill="#38bdf8" fontSize="11" fontWeight="bold">0.14 m depth</text>

                <text x="60" y="105" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">DOOR #127</text>
              </g>

              {/* Building Object Graph (Right) */}
              <g transform="translate(420, 90)">
                <rect x="0" y="0" width="220" height="220" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#3b82f6" />
                <text x="15" y="28" fill="#60a5fa" fontSize="12" fontWeight="bold">BUILDING OBJECT GRAPH</text>
                
                <text x="25" y="60" fill="#f1f5f9" fontSize="11" fontFamily="monospace">BUILDING #001 (PPCRC)</text>
                <text x="35" y="85" fill="#94a3b8" fontSize="11" fontFamily="monospace">├── WALL #001</text>
                <text x="50" y="110" fill="#4ade80" fontSize="11" fontFamily="monospace">│   ├── DOOR #127 (0.92m)</text>
                <text x="50" y="132" fill="#38bdf8" fontSize="11" fontFamily="monospace">│   ├── WINDOW #128</text>
                <text x="50" y="154" fill="#fbbf24" fontSize="11" fontFamily="monospace">│   └── AC #129</text>
                <text x="35" y="178" fill="#94a3b8" fontSize="11" fontFamily="monospace">├── FLOOR #001</text>
                <text x="35" y="200" fill="#94a3b8" fontSize="11" fontFamily="monospace">└── ROOF #001</text>
              </g>
            </svg>
          </div>
        );

      // 24. STAGE 24 — QUALITY CONTROL & SURVEY REPORT (Req #42, #43)
      case 'qc_validation':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '640px',
              backgroundColor: 'rgba(15, 23, 42, 0.96)',
              borderRadius: '12px',
              border: '2px solid #10b981',
              padding: '24px 28px',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#34d399' }}>
                    SURVEY QUALITY REPORT — CERTIFIED COMPLIANT
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                    Target: PPCRC Building 0089 (Hinjawadi IT Park) • ULPIN: 27250401420089
                  </div>
                </div>
                <span style={{
                  fontSize: '13px',
                  backgroundColor: '#166534',
                  color: '#86efac',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontWeight: 800
                }}>
                  ✓ PASS
                </span>
              </div>

              {/* Quality Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Point Count</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>18,420,940 Pts</div>
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Point Density</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>142 pts/m²</div>
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Coverage</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>99.8% Facade</div>
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Registration Error</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399' }}>0.007 m (7mm)</div>
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>GCP Residuals</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399' }}>dX: 4mm, dY: 3mm</div>
                </div>
                <div style={{ backgroundColor: '#1e293b', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Confidence</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399' }}>98.6% Overall</div>
                </div>
              </div>

              {/* Complete Stage Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                <button
                  onClick={onComplete}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <span>RETURN TO SURVEYOR — VIEW INTERACTIVE 3D MODEL</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        );

      // Default fallback visualization
      default:
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8' }}>{stage.title}</div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>{stage.subtitle}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000000',
      color: '#ffffff',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
      overflow: 'hidden'
    }}>
      {/* Top Technical Telemetry HUD Bar */}
      <div style={{
        height: '64px',
        backgroundColor: 'rgba(10, 15, 29, 0.95)',
        borderBottom: '1px solid #1e293b',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        {/* Left: Stage Title & Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            padding: '4px 10px',
            borderRadius: '4px',
            backgroundColor: '#1e3a8a',
            color: '#60a5fa',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.8px'
          }}>
            STAGE {stage.stageNumber} / {totalStages}
          </div>

          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.4px' }}>
              {stage.title}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
              {stage.subtitle}
            </div>
          </div>
        </div>

        {/* Center: Real Mathematical Formula Display */}
        {stage.formula && (
          <div style={{
            backgroundColor: 'rgba(2, 6, 23, 0.8)',
            border: '1px solid #334155',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#38bdf8'
          }}>
            {stage.formula}
          </div>
        )}

        {/* Right: Exit / Return button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onExit}
            style={{
              padding: '7px 14px',
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '6px',
              color: '#cbd5e1',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Exit Full Screen
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        overflow: 'hidden'
      }}>
        {/* Grid lines background for technical aesthetic */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.3,
          pointerEvents: 'none'
        }} />

        {/* Live Visual Component */}
        <div style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%' }}>
          {renderStageVisual()}
        </div>

        {/* Floating Telemetry Box (Bottom Left) */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '14px 18px',
          maxWidth: '380px',
          zIndex: 20
        }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
            Scientific Explanation
          </div>
          <div style={{ fontSize: '12px', color: '#e2e8f0', marginTop: '4px', lineHeight: '1.45' }}>
            {stage.scientificExplanation}
          </div>
        </div>

        {/* Floating Metrics HUD (Bottom Right) */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '14px 18px',
          minWidth: '240px',
          zIndex: 20
        }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
            Live Sensor Telemetry
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {stage.hudMetrics.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>{m.label}:</span>
                <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Interactive Playback & Scrubber Controls Bar */}
      <div style={{
        height: '76px',
        backgroundColor: 'rgba(10, 15, 29, 0.98)',
        borderTop: '1px solid #1e293b',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '8px',
        zIndex: 10
      }}>
        {/* Stage Scrubber Indicator (1 to 24) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
          {TECHNICAL_STAGES.map((s, idx) => {
            const isCurrent = idx === currentStageIdx;
            const isDone = idx < currentStageIdx;
            return (
              <div
                key={s.id}
                onClick={() => setCurrentStageIdx(idx)}
                title={`Stage ${s.stageNumber}: ${s.title}`}
                style={{
                  flex: 1,
                  height: isCurrent ? '8px' : '4px',
                  backgroundColor: isCurrent ? '#38bdf8' : isDone ? '#22c55e' : '#334155',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isCurrent ? '0 0 10px #38bdf8' : 'none'
                }}
              />
            );
          })}
        </div>

        {/* Button Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: Previous / Play / Next */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrev}
              disabled={currentStageIdx === 0}
              style={{
                background: 'none',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: currentStageIdx === 0 ? '#475569' : '#ffffff',
                padding: '5px 10px',
                cursor: currentStageIdx === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="#ffffff" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStageIdx === totalStages - 1}
              style={{
                background: 'none',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: currentStageIdx === totalStages - 1 ? '#475569' : '#ffffff',
                padding: '5px 10px',
                cursor: currentStageIdx === totalStages - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Center: Stage Number Text */}
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            STAGE {currentStageIdx + 1} OF {totalStages} • <b style={{ color: '#ffffff' }}>{stage.title}</b>
          </div>

          {/* Right: Speed Multiplier & Skip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#1e293b', borderRadius: '6px', padding: '2px 4px' }}>
              {[1, 2, 4, 8].map(spd => (
                <button
                  key={spd}
                  onClick={() => setSpeedMultiplier(spd)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: speedMultiplier === spd ? '#2563eb' : 'transparent',
                    color: speedMultiplier === spd ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              onClick={handleSkipToFinish}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <SkipForward size={14} />
              <span>SKIP TO FINISH</span>
            </button>

            <button
              onClick={() => setPipelineMode('3d_webgl')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Box size={14} />
              <span>3D WEBGL SIMULATION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
