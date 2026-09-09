import React from 'react';
import {
  FolderKanban,
  Radio,
  Workflow,
  Box,
  ClipboardCheck,
  Send,
  AlertTriangle,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  Building2
} from 'lucide-react';
import { SurveyProject } from '../../../data/survey3dData';

interface DashboardSectionProps {
  projects: SurveyProject[];
  selectedProject: SurveyProject;
  onSelectProject: (project: SurveyProject) => void;
  onOpenProjectDetail: (project: SurveyProject) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onOpenProjectDetail
}) => {
  // KPI Statistics
  const assignedCount = projects.length;
  const activeCount = projects.filter((p) => p.overallStatus === 'Active' || p.overallStatus === 'Processing').length;
  const processingCount = projects.filter((p) => p.pipelineStatuses.processing === 'IN_PROGRESS' || p.pipelineStatuses.processing === 'COMPLETED').length;
  const reconstructionCount = projects.filter((p) => p.pipelineStatuses.reconstruction3d === 'COMPLETED' || p.pipelineStatuses.reconstruction3d === 'IN_PROGRESS').length;
  const qcPendingCount = projects.filter((p) => p.pipelineStatuses.qaQc === 'IN_PROGRESS' || p.pipelineStatuses.qaQc === 'PENDING').length;
  const submissionPendingCount = projects.filter((p) => p.pipelineStatuses.delivery === 'COMPLETED' && p.pipelineStatuses.nakshaSubmission !== 'COMPLETED').length;
  const returnedCount = projects.filter((p) => p.overallStatus === 'Returned').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
      {/* Cyan Header Banner matching desktop style */}
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
          <FolderKanban size={16} />
          <span>Survey Agency Operations Dashboard — 2D & 3D Aerial Survey Workstation</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          NAKSHA V2.0 3D Survey Standard • Survey of India Specification
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px'
      }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
            <span>Assigned Projects</span>
            <FolderKanban size={14} color="#0284c7" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f2b5c', marginTop: '4px' }}>
            {assignedCount}
          </div>
          <div style={{ fontSize: '10.5px', color: '#0284c7', marginTop: '2px' }}>Authorized Wards</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
            <span>Active Surveys</span>
            <Radio size={14} color="#22c55e" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '10.5px', color: '#16a34a', marginTop: '2px' }}>Drone In Flight</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
            <span>Processing Jobs</span>
            <Workflow size={14} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
            {processingCount}
          </div>
          <div style={{ fontSize: '10.5px', color: '#d97706', marginTop: '2px' }}>Photogrammetry / LiDAR</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
            <span>3D Reconstruction</span>
            <Box size={14} color="#0ea5e9" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0369a1', marginTop: '4px' }}>
            {reconstructionCount}
          </div>
          <div style={{ fontSize: '10.5px', color: '#0284c7', marginTop: '2px' }}>412 LoD2 Solids</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
            <span>QC Pending</span>
            <ClipboardCheck size={14} color="#6366f1" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#4338ca', marginTop: '4px' }}>
            {qcPendingCount}
          </div>
          <div style={{ fontSize: '10.5px', color: '#4f46e5', marginTop: '2px' }}>Topology Checks</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
            <span>Submission Ready</span>
            <Send size={14} color="#14b8a6" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f766e', marginTop: '4px' }}>
            {submissionPendingCount}
          </div>
          <div style={{ fontSize: '10.5px', color: '#0d9488', marginTop: '2px' }}>Manifests Built</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
            <span>Returned</span>
            <AlertTriangle size={14} color="#ef4444" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#b91c1c', marginTop: '4px' }}>
            {returnedCount}
          </div>
          <div style={{ fontSize: '10.5px', color: '#dc2626', marginTop: '2px' }}>Corrections Req.</div>
        </div>
      </div>

      {/* Main Project Worklist Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '10px 16px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
              Assigned Survey Projects Queue
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              ({projects.length} Total Projects Loaded)
            </span>
          </div>

          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            Selected Project: <b style={{ color: '#0284c7' }}>{selectedProject.id}</b>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', borderBottom: '1px solid #cbd5e1', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                <th style={{ padding: '8px 12px' }}>Project ID</th>
                <th style={{ padding: '8px 12px' }}>Jurisdiction (State / Dist / ULB)</th>
                <th style={{ padding: '8px 12px' }}>Ward & Survey Unit</th>
                <th style={{ padding: '8px 12px' }}>AOI Area</th>
                <th style={{ padding: '8px 12px' }}>Survey Status</th>
                <th style={{ padding: '8px 12px' }}>Processing</th>
                <th style={{ padding: '8px 12px' }}>3D Status</th>
                <th style={{ padding: '8px 12px' }}>QC Status</th>
                <th style={{ padding: '8px 12px' }}>Submission</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((prj) => {
                const isSelected = prj.id === selectedProject.id;

                return (
                  <tr
                    key={prj.id}
                    onClick={() => onSelectProject(prj)}
                    style={{
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease'
                    }}
                  >
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f2b5c' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSelected && <span style={{ color: '#0284c7' }}>▶</span>}
                        <span>{prj.id}</span>
                      </div>
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{prj.district}, {prj.state}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{prj.ulb}</div>
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{prj.ward}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{prj.surveyUnit}</div>
                    </td>

                    <td style={{ padding: '10px 12px', color: '#475569', fontWeight: 600 }}>
                      {prj.aoiAreaKm2} km²
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        backgroundColor: prj.overallStatus === 'Processing' ? '#fef3c7' : prj.overallStatus === '3D Reconstructed' ? '#e0f2fe' : '#f1f5f9',
                        color: prj.overallStatus === 'Processing' ? '#b45309' : prj.overallStatus === '3D Reconstructed' ? '#0369a1' : '#475569',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {prj.overallStatus}
                      </span>
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        color: prj.pipelineStatuses.processing === 'COMPLETED' ? '#15803d' : prj.pipelineStatuses.processing === 'IN_PROGRESS' ? '#b45309' : '#94a3b8',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {prj.pipelineStatuses.processing === 'COMPLETED' ? '✓ Done' : prj.pipelineStatuses.processing === 'IN_PROGRESS' ? '● In Progress' : '○ Pending'}
                      </span>
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        color: prj.pipelineStatuses.reconstruction3d === 'COMPLETED' ? '#15803d' : prj.pipelineStatuses.reconstruction3d === 'IN_PROGRESS' ? '#0284c7' : '#94a3b8',
                        fontWeight: 600
                      }}>
                        {prj.pipelineStatuses.reconstruction3d === 'COMPLETED' ? '✓ Reconstructed' : prj.pipelineStatuses.reconstruction3d === 'IN_PROGRESS' ? '● Slicing' : '○ Pending'}
                      </span>
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        backgroundColor: prj.pipelineStatuses.qaQc === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                        color: prj.pipelineStatuses.qaQc === 'COMPLETED' ? '#166534' : '#92400e',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        fontWeight: 700
                      }}>
                        {prj.pipelineStatuses.qaQc === 'COMPLETED' ? 'PASS' : 'QC Pending'}
                      </span>
                    </td>

                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        color: prj.pipelineStatuses.nakshaSubmission === 'COMPLETED' ? '#15803d' : '#64748b',
                        fontWeight: 600
                      }}>
                        {prj.pipelineStatuses.nakshaSubmission === 'COMPLETED' ? '✓ Accepted' : 'Draft / Ready'}
                      </span>
                    </td>

                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProjectDetail(prj);
                        }}
                        style={{
                          backgroundColor: '#0ea5e9',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '5px 10px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>Open Workspace</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Project Pipeline Snapshot */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={16} color="#0284c7" />
            <span>Workflow Pipeline Snapshot: <b>{selectedProject.title}</b></span>
          </div>

          <button
            onClick={() => onOpenProjectDetail(selectedProject)}
            style={{
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>View Complete Project Brief</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Input Data Readiness Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
          {selectedProject.inputDatasets.map((ds) => (
            <div
              key={ds.id}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ fontWeight: 700, color: '#334155' }}>{ds.category}:</span>
              <span style={{
                color: ds.validationStatus === 'READY' || ds.validationStatus === 'PASS' ? '#15803d' : '#b45309',
                fontWeight: 700
              }}>
                {ds.validationStatus}
              </span>
              <span style={{ color: '#94a3b8' }}>({ds.size})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
