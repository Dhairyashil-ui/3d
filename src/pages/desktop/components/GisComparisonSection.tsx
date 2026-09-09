import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Building2
} from 'lucide-react';
import { GisOverlayLayer, MOCK_GIS_OVERLAYS, SurveyProject } from '../../../data/survey3dData';
import { GisMap } from '../../../components/common/GisMap';

interface GisComparisonSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const GisComparisonSection: React.FC<GisComparisonSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [layers, setLayers] = useState<GisOverlayLayer[]>(MOCK_GIS_OVERLAYS);

  const toggleLayerVisible = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const updateOpacity = (id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity } : l))
    );
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
          <Layers size={16} />
          <span>GIS Multi-Layer Overlay & Cadastral Boundary Alignment Workspace</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Cadastral Boundary Offset • Tax Assessment Polygon Fusion
        </div>
      </div>

      {/* Main Split: Left Layer Controls & Metrics + Right Map Overlay */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '14px' }}>
        {/* Left: Layer Opacity Sliders & Metrics */}
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
            GIS Layer Opacity & Superimposition
          </div>

          {/* Layer Cards with Opacity Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {layers.map((lay) => (
              <div
                key={lay.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '5px',
                  padding: '8px 10px',
                  backgroundColor: lay.visible ? '#ffffff' : '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={lay.visible}
                      onChange={() => toggleLayerVisible(lay.id)}
                    />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e293b' }}>
                      {lay.name}
                    </span>
                  </label>
                  <span style={{ height: '10px', width: '10px', borderRadius: '2px', backgroundColor: lay.color, display: 'inline-block' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '10.5px', color: '#64748b', width: '45px' }}>Opacity:</span>
                  <input
                    type="range"
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    value={lay.opacity}
                    disabled={!lay.visible}
                    onChange={(e) => updateOpacity(lay.id, parseFloat(e.target.value))}
                    style={{ flex: 1, cursor: lay.visible ? 'pointer' : 'not-allowed' }}
                  />
                  <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0f2b5c', width: '32px' }}>
                    {(lay.opacity * 100).toFixed(0)}%
                  </span>
                </div>

                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                  {lay.metrics}
                </div>
              </div>
            ))}
          </div>

          {/* Spatial Relationship Calculations */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '10px', fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontWeight: 700, color: '#166534' }}>Building-to-Parcel Geometric Relationship:</div>
            <div style={{ color: '#14532d' }}>• Footprint Difference: <b>+0.8 m² (+0.15%)</b></div>
            <div style={{ color: '#14532d' }}>• Cadastral Boundary Offset: <b>0.04m (Within 0.2m limit)</b></div>
            <div style={{ color: '#14532d' }}>• Parcel Coverage Ratio: <b>87.2%</b></div>
            <div style={{ color: '#15803d', fontWeight: 700, marginTop: '2px' }}>✓ Ground alignment compliant with Survey of India norms.</div>
          </div>

          {/* Action */}
          <button
            onClick={() => onNavigateSection('verification-anomalies')}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Proceed to Anomaly Queue</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Right: Map with Multi-layer Superimposition */}
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
              Cadastral Boundary Superimposition Overlay
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              ESRI High-Res World Imagery
            </span>
          </div>

          <div style={{ flex: 1, minHeight: '400px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <GisMap
              height="420px"
              showAoi={true}
              showCadastral={true}
              showBuildings={true}
              showTaxPoints={true}
              title={`GIS Cadastral Overlay • ${project.district}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
