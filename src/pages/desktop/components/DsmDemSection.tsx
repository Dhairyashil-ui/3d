import React, { useState } from 'react';
import {
  Sliders,
  Layers,
  TrendingUp,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Ruler,
  Eye
} from 'lucide-react';
import { MOCK_DSM_DEM_DATA, SurveyProject } from '../../../data/survey3dData';
import { GisMap } from '../../../components/common/GisMap';

interface DsmDemSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const DsmDemSection: React.FC<DsmDemSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'dsm' | 'dem'>('both');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(4); // Point over building 1

  const data = MOCK_DSM_DEM_DATA;
  const currentPoint = data.crossSectionPoints[selectedPointIndex];

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
          <Sliders size={16} />
          <span>DSM / DEM Topographical & Surface Model Analysis Workspace</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Bare-Earth DTM vs First-Return Surface Elevation Modeling
        </div>
      </div>

      {/* Concept Definition Banner */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '6px',
        padding: '10px 16px',
        fontSize: '12px',
        color: '#1e3a8a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={16} color="#0284c7" />
          <span>
            <b>DSM (Surface):</b> Represents ground + buildings + trees + surface objects. | <b>DEM / DTM (Terrain):</b> Represents the bare ground surface.
          </span>
        </div>
        <div style={{ fontWeight: 700, color: '#0369a1' }}>
          Normalized Surface: nDSM = DSM - DEM (Building Height Detection)
        </div>
      </div>

      {/* Model Statistics Cards */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '14px 18px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            DSM Grid Resolution
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f2b5c', marginTop: '2px' }}>
            {data.dsmResolutionM} m GSD
          </div>
          <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '2px' }}>
            High-Resolution Surface
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            DEM / DTM Resolution
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f2b5c', marginTop: '2px' }}>
            {data.demResolutionM} m GSD
          </div>
          <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px' }}>
            Topographical Bare-Earth
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Elevation Range (Z)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309', marginTop: '2px' }}>
            {data.minElevationM}m – {data.maxElevationM}m
          </div>
          <div style={{ fontSize: '11px', color: '#d97706', marginTop: '2px' }}>
            Delta: {(data.maxElevationM - data.minElevationM).toFixed(1)}m relief
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Elevation Quality Status
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
            PASS (RMS &lt; 0.02m)
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>
            Verified with SoI GCPs
          </div>
        </div>
      </div>

      {/* Main Split: Left Elevation Profile Cross-Section Chart + Right Surface Map Overlay */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '14px' }}>
        {/* Left: Cross-Section Elevation Profiler */}
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
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={15} color="#0284c7" />
              <span>Cross-Section Elevation Profile (DSM vs DEM)</span>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {(['both', 'dsm', 'dem'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    backgroundColor: viewMode === mode ? '#0284c7' : '#f1f5f9',
                    color: viewMode === mode ? '#ffffff' : '#475569',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Visual SVG Elevation Profile Graph */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '6px',
            padding: '16px 12px 10px 12px',
            position: 'relative',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <svg width="100%" height="180" viewBox="0 0 500 180" style={{ overflow: 'visible' }}>
              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#334155" strokeDasharray="3,3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#334155" strokeDasharray="3,3" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#334155" strokeDasharray="3,3" />

              {/* DEM Line (Bare Ground - Green) */}
              {(viewMode === 'both' || viewMode === 'dem') && (
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  points="0,152 50,151 100,150 150,150 200,149 250,149 300,148 370,148 430,147 500,146"
                />
              )}

              {/* DSM Line (Surface & Buildings - Cyan) */}
              {(viewMode === 'both' || viewMode === 'dsm') && (
                <polyline
                  fill="rgba(6, 182, 212, 0.15)"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  points="0,152 50,150 100,149 140,149 140,40 240,40 240,148 290,148 360,148 360,80 430,80 430,147 500,146"
                />
              )}

              {/* Building Height Extrusion Marker */}
              <line x1="190" y1="40" x2="190" y2="149" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" />
              <text x="200" y="90" fill="#f59e0b" fontSize="11" fontWeight="bold">Height: +18.6m</text>

              {/* Interactive Clickable Nodes */}
              {data.crossSectionPoints.map((pt, idx) => {
                const x = (pt.distanceM / 150) * 480 + 10;
                const y = pt.heightDiffM > 5 ? (pt.heightDiffM > 15 ? 40 : 80) : 149;

                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={selectedPointIndex === idx ? 6 : 4}
                    fill={selectedPointIndex === idx ? '#f59e0b' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedPointIndex(idx)}
                  />
                );
              })}
            </svg>

            {/* Axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '10px' }}>
              <span>0m (Transect Start)</span>
              <span>Distance Along Transect Line (m)</span>
              <span>150m (Road Junction)</span>
            </div>
          </div>

          {/* Inspector Panel for Selected Point */}
          {currentPoint && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              padding: '10px 14px',
              fontSize: '11.5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ color: '#64748b' }}>Transect Distance: </span>
                <b>{currentPoint.distanceM}m</b>
                <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
                <span style={{ color: '#06b6d4' }}>DSM Surface: <b>{currentPoint.dsmElevM}m</b></span>
                <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
                <span style={{ color: '#22c55e' }}>DEM Bare Ground: <b>{currentPoint.demElevM}m</b></span>
              </div>

              <div style={{
                backgroundColor: currentPoint.heightDiffM > 1 ? '#eff6ff' : '#f1f5f9',
                color: currentPoint.heightDiffM > 1 ? '#0284c7' : '#64748b',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 700
              }}>
                Height Difference: {currentPoint.heightDiffM.toFixed(1)}m
              </div>
            </div>
          )}
        </div>

        {/* Right: Geospatial Elevation Surface Map */}
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
              Spatial Surface Layer Visualization
            </div>

            <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
              EPSG: 32643 • 5cm GSD
            </span>
          </div>

          <div style={{ flex: 1, minHeight: '300px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <GisMap
              height="320px"
              showAoi={true}
              showCadastral={true}
              showBuildings={true}
              title="DSM & DEM Extracted Elevation Grid"
            />
          </div>

          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onNavigateSection('reconstruction-buildings')}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '7px 16px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Open 3D Building Reconstruction Viewer</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
