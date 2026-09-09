import React, { useState, useEffect } from 'react';
import {
  Workflow,
  Cpu,
  Camera,
  Crosshair,
  Sparkles,
  Layers,
  Box,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Download,
  Terminal
} from 'lucide-react';
import { MOCK_PROCESSING_STAGES, ProcessingStageItem, SurveyProject } from '../../../data/survey3dData';

interface ProcessingCenterSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const ProcessingCenterSection: React.FC<ProcessingCenterSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [stages, setStages] = useState<ProcessingStageItem[]>(MOCK_PROCESSING_STAGES);
  const [selectedStageId, setSelectedStageId] = useState<string>(stages[4]?.id || stages[0].id);
  const [isRunning, setIsRunning] = useState(false);

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  const handleRunAllPipeline = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setStages((prev) =>
        prev.map((s) => ({ ...s, progressPct: 100, status: 'COMPLETED' }))
      );
      alert('Photogrammetry + LiDAR + GNSS Registration and Fusion Pipeline Executed Successfully! Georeferenced 3D Master Dataset generated.');
    }, 1200);
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
          <Workflow size={16} />
          <span>Processing Center — Photogrammetry + LiDAR + GNSS Geospatial Fusion Engine</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          GPU Accelerated Distributed Reconstruction Cluster (NVIDIA RTX A5000)
        </div>
      </div>

      {/* Visual Pipeline Flow Graphic */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        overflowX: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Step 1: Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>1. RAW INGESTION</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
              Drone Images (4,820)
            </span>
            <span style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
              Aerial LiDAR (48.6M pts)
            </span>
            <span style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
              GNSS CORS / GCPs
            </span>
          </div>
        </div>

        <ArrowRight size={16} color="#94a3b8" />

        {/* Step 2: Processing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>2. POINT PROCESSORS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
              Dense Photogrammetric Cloud
            </span>
            <span style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
              Classified LiDAR Cloud
            </span>
            <span style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
              Geodetic Control Constraint
            </span>
          </div>
        </div>

        <ArrowRight size={16} color="#94a3b8" />

        {/* Step 3: Fusion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>3. GEOSPATIAL FUSION</div>
          <div style={{ backgroundColor: '#faf5ff', border: '1.5px solid #d8b4fe', color: '#7e22ce', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, textAlign: 'center' }}>
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
            <span>Co-Registered 3D Dataset</span>
            <div style={{ fontSize: '10px', color: '#9333ea', fontWeight: 500, marginTop: '2px' }}>WKID 32643 • ICP Residuals &lt; 0.01m</div>
          </div>
        </div>

        <ArrowRight size={16} color="#94a3b8" />

        {/* Step 4: Outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>4. SYNTHESIZED DERIVATIVES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
            <span style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600 }}>
              ORI Orthomosaic
            </span>
            <span style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600 }}>
              DSM Surface
            </span>
            <span style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600 }}>
              DEM Bare-Earth
            </span>
            <span style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700 }}>
              412 3D Buildings
            </span>
          </div>
        </div>
      </div>

      {/* Main Split: Left Stage Progress List + Right Execution Terminal Console */}
      <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: '14px' }}>
        {/* Left: 11 Stages Progress List */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
              Processing Pipeline Stages (11 Stages)
            </span>
            <button
              onClick={handleRunAllPipeline}
              disabled={isRunning}
              style={{
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} className={isRunning ? 'spin' : ''} />
              <span>{isRunning ? 'Processing Cluster...' : 'Execute Pipeline'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: '420px' }}>
            {stages.map((stg, idx) => {
              const isSelected = selectedStageId === stg.id;

              return (
                <div
                  key={stg.id}
                  onClick={() => setSelectedStageId(stg.id)}
                  style={{
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    borderRadius: '5px',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                      {idx + 1}. {stg.stageName}
                    </div>
                    <span style={{
                      backgroundColor: stg.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                      color: stg.status === 'COMPLETED' ? '#15803d' : '#b45309',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700
                    }}>
                      {stg.status === 'COMPLETED' ? `✓ ${stg.progressPct}%` : `● ${stg.progressPct}%`}
                    </span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${stg.progressPct}%`, height: '100%', backgroundColor: stg.status === 'COMPLETED' ? '#22c55e' : '#f59e0b' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b' }}>
                    <span>Category: <b>{stg.category}</b></span>
                    <span>Elapsed: {stg.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Execution Console Terminal */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '8px',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={15} color="#0284c7" />
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>
                Stage Log Console: {selectedStage.stageName}
              </span>
            </div>

            <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
              Status: {selectedStage.status} ({selectedStage.progressPct}%)
            </span>
          </div>

          {/* Log Stream */}
          <div style={{
            flex: 1,
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            borderRadius: '4px',
            padding: '12px',
            overflowY: 'auto',
            minHeight: '260px',
            fontSize: '11.5px',
            lineHeight: 1.6
          }}>
            {selectedStage.logLines.map((log, i) => (
              <div key={i} style={{ color: log.includes('COMPLETE') || log.includes('complete') || log.includes('successful') ? '#4ade80' : log.includes('error') ? '#f87171' : '#cbd5e1' }}>
                {log}
              </div>
            ))}
          </div>

          {/* Stage Output Artifact Box */}
          <div style={{
            marginTop: '10px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '11.5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ color: '#64748b' }}>Generated Artifact: </span>
              <b style={{ color: '#0f2b5c' }}>{selectedStage.outputArtifact}</b>
            </div>

            <button
              onClick={() => onNavigateSection('processing-dsm-dem')}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Inspect DSM / DEM</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
