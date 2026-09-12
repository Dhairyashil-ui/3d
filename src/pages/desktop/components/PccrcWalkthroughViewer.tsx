import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Maximize2,
  Navigation,
  Building,
  Layers,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface Waypoint {
  id: number;
  label: string;
  sublabel: string;
  description: string;
  enuCoords: [number, number, number];
  ueCoordsCm: [number, number, number];
  image?: string;
}

const WAYPOINTS: Waypoint[] = [
  {
    id: 1,
    label: 'Phase 1 Road Approach',
    sublabel: 'I²IT College Road / Rajiv Gandhi Infotech Park',
    description: 'Starting along the tree-lined asphalt avenue of Hinjawadi Phase 1, looking south-west towards the research institute campus.',
    enuCoords: [-140.0, -740.0, 1.65],
    ueCoordsCm: [-14000, 74000, 165],
    image: '/walk_01_road_approach.png'
  },
  {
    id: 2,
    label: 'Campus Forecourt & Portico',
    sublabel: 'Monumental 6-Story Terracotta & Sandstone Facade',
    description: 'Entering the landscaped approach plaza, gazing up at the monumental terracotta-finished columns, grand coffer canopy, and classic pediment.',
    enuCoords: [-88.0, -768.0, 1.65],
    ueCoordsCm: [-8800, 76800, 165],
    image: '/walk_02_portico_facade.png'
  },
  {
    id: 3,
    label: 'Monumental Steps & Entrance',
    sublabel: 'Portico Canopy & Glazed Doors',
    description: 'Ascending the 4 cream sandstone steps onto the grand portico platform, passing under the deep coffered ceiling and approaching the main glazed entrance doors.',
    enuCoords: [-82.33, -769.0, 1.95],
    ueCoordsCm: [-8233, 76900, 195],
    image: '/walk_03_steps_and_doors.png'
  },
  {
    id: 4,
    label: 'Grand Central Atrium Core',
    sublabel: 'Polished Stone Floor & Marble Inlays',
    description: 'Stepping inside onto the polished stone atrium floor, walking across the intricate black, ochre, and cream concentric star medallions flanked by burgundy planters.',
    enuCoords: [-82.33, -757.5, 1.65],
    ueCoordsCm: [-8233, 75750, 165],
    image: '/walk_04_atrium_inlays.png'
  },
  {
    id: 5,
    label: '5-Tier Galleries & Skylight',
    sublabel: 'Panoramic Glass Lift & Dome Ceiling',
    description: 'Standing at the atrium center, looking upward into the soaring 5 gallery tiers with stainless steel railings, the central panoramic glass elevator, and the sunlit dome skylight.',
    enuCoords: [-82.33, -754.0, 1.65],
    ueCoordsCm: [-8233, 75400, 165],
    image: '/walk_05_atrium_galleries_and_skylight.png'
  }
];

export const PccrcWalkthroughViewer: React.FC = () => {
  const [activeWaypointIndex, setActiveWaypointIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [walkProgress, setWalkProgress] = useState(0); // 0 to 100%
  const [cameraMode, setCameraMode] = useState<'cinematic' | 'first-person'>('cinematic');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentWaypoint = WAYPOINTS[activeWaypointIndex];

  // Auto-tour animation loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveWaypointIndex((prev) => {
          const next = (prev + 1) % WAYPOINTS.length;
          setWalkProgress((next / (WAYPOINTS.length - 1)) * 100);
          return next;
        });
      }, 5000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleSelectWaypoint = (index: number) => {
    setActiveWaypointIndex(index);
    setWalkProgress((index / (WAYPOINTS.length - 1)) * 100);
  };

  const handleNext = () => {
    const next = Math.min(WAYPOINTS.length - 1, activeWaypointIndex + 1);
    handleSelectWaypoint(next);
  };

  const handlePrev = () => {
    const prev = Math.max(0, activeWaypointIndex - 1);
    handleSelectWaypoint(prev);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #1e293b',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #334155',
        paddingBottom: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              letterSpacing: '0.5px'
            }}>
              UE5 SCENE & WALKTHROUGH
            </span>
            <span style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              LUMEN GI & NANITE READY
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            Hinjawadi Phase 1 Roads to PPCRC Building & Interior Atrium
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Interactive First-Person & Cinematic Walk: Hinjawadi Phase 1 Avenue → Forecourt → Monumental Steps → 5-Tier Atrium & Marble Inlays
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCameraMode(cameraMode === 'cinematic' ? 'first-person' : 'cinematic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #38bdf8',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            <Navigation size={15} />
            {cameraMode === 'cinematic' ? 'Mode: Cinematic Cam (28mm)' : 'Mode: First-Person (WASD)'}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isPlaying ? '#ef4444' : '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px'
            }}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? 'Pause Tour' : 'Play Cinematic Walk'}
          </button>
        </div>
      </div>

      {/* Main Viewport & Perspective Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        {/* Visual Viewport Canvas */}
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#020617',
          border: '1px solid #334155',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Main Visual Stills / Render View */}
          <div style={{
            position: 'relative',
            flex: 1,
            backgroundColor: '#090d16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {currentWaypoint.image ? (
              <img
                src={currentWaypoint.image}
                alt={currentWaypoint.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            ) : (
              <div style={{ color: '#64748b', textAlign: 'center' }}>
                <Building size={48} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <div>3D Walkthrough Viewport</div>
              </div>
            )}

            {/* In-viewport HUD overlay */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                Milestone {currentWaypoint.id} / 5
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                {currentWaypoint.label}
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                {currentWaypoint.sublabel}
              </div>
            </div>

            {/* Coordinates Badge */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#94a3b8'
            }}>
              ENU: [{currentWaypoint.enuCoords.join(', ')}]m | UE: [{currentWaypoint.ueCoordsCm.join(', ')}]cm
            </div>

            {/* Walk Progress Line */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                height: '100%',
                width: `${walkProgress}%`,
                backgroundColor: '#38bdf8',
                transition: 'width 0.5s ease-out'
              }} />
            </div>
          </div>

          {/* Bottom Viewport Controls */}
          <div style={{
            padding: '12px 18px',
            backgroundColor: '#0f172a',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handlePrev}
                disabled={activeWaypointIndex === 0}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#1e293b',
                  color: activeWaypointIndex === 0 ? '#475569' : '#f8fafc',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: activeWaypointIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <ChevronLeft size={14} /> Prev Step
              </button>
              <button
                onClick={handleNext}
                disabled={activeWaypointIndex === WAYPOINTS.length - 1}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#1e293b',
                  color: activeWaypointIndex === WAYPOINTS.length - 1 ? '#475569' : '#f8fafc',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: activeWaypointIndex === WAYPOINTS.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                Next Step <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Eye Elevation: <strong>1.65m</strong> | FOV: <strong>65° (28mm Prime)</strong>
            </div>
          </div>
        </div>

        {/* Sidebar: Route Waypoints & GIS Technical Details */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #334155'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#38bdf8',
              letterSpacing: '0.6px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Compass size={14} /> Walking Route Sequence
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {WAYPOINTS.map((wp, idx) => {
                const isCurrent = idx === activeWaypointIndex;
                return (
                  <div
                    key={wp.id}
                    onClick={() => handleSelectWaypoint(idx)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isCurrent ? '#0284c7' : '#0f172a',
                      color: isCurrent ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer',
                      border: isCurrent ? '1px solid #38bdf8' : '1px solid transparent',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? '#ffffff' : '#334155',
                      color: isCurrent ? '#0284c7' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {wp.id}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {wp.label}
                      </div>
                      <div style={{ fontSize: '11px', color: isCurrent ? '#e0f2fe' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {wp.sublabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Architectural & UE5 Metadata Card */}
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #334155',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#10b981',
                letterSpacing: '0.6px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={14} /> Architectural Details
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#cbd5e1', margin: '0 0 12px 0' }}>
                {currentWaypoint.description}
              </p>
            </div>

            <div style={{
              backgroundColor: '#0f172a',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #334155',
              fontSize: '11px',
              color: '#94a3b8',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Unreal Engine Project:</span>
                <strong style={{ color: '#f1f5f9' }}>HinjawadiTwin.uproject</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Target Map:</span>
                <strong style={{ color: '#f1f5f9' }}>/Game/City/Hinjawadi_Walkthrough</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>PPCRC Objects:</span>
                <strong style={{ color: '#f1f5f9' }}>7,450 Meshes (Full Twin)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Collision Type:</span>
                <strong style={{ color: '#f1f5f9' }}>Complex-as-Simple (Roads/Slabs)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
