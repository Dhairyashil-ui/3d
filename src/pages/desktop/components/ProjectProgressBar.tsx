import React from 'react';
import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';
import { SurveyProject } from '../../../data/survey3dData';

interface ProjectProgressBarProps {
  project: SurveyProject;
  activeSection: string;
  onNavigateSection: (section: string) => void;
}

interface StepDef {
  step: number;
  label: string;
  targetSection: string;
  statusKey: keyof SurveyProject['pipelineStatuses'];
}

const PIPELINE_STEPS: StepDef[] = [
  { step: 1, label: 'Assignment', targetSection: 'project-detail', statusKey: 'assignment' },
  { step: 2, label: 'Planning', targetSection: 'flight-plans', statusKey: 'planning' },
  { step: 3, label: 'Acquisition', targetSection: 'field-acquisition', statusKey: 'acquisition' },
  { step: 4, label: 'Processing', targetSection: 'processing-photogrammetry', statusKey: 'processing' },
  { step: 5, label: '3D Reconstruction', targetSection: 'reconstruction-buildings', statusKey: 'reconstruction3d' },
  { step: 6, label: 'Verification', targetSection: 'verification-architecture', statusKey: 'verification' },
  { step: 7, label: 'QA/QC', targetSection: 'quality-control', statusKey: 'qaQc' },
  { step: 8, label: 'Delivery', targetSection: 'deliverables', statusKey: 'delivery' },
  { step: 9, label: 'NAKSHA Submission', targetSection: 'naksha-submission', statusKey: 'nakshaSubmission' }
];

export const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  project,
  activeSection,
  onNavigateSection
}) => {
  return (
    <div style={{
      backgroundColor: '#0f2b5c',
      borderBottom: '1px solid #1e3a8a',
      padding: '8px 16px',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }}>
      {/* Top Banner: Where Am I & Status Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#93c5fd', fontWeight: 600 }}>PROJECT PIPELINE:</span>
          <span style={{
            backgroundColor: '#1e3a8a',
            color: '#38bdf8',
            padding: '1px 8px',
            borderRadius: '4px',
            fontWeight: 700
          }}>
            {project.id}
          </span>
          <span style={{ color: '#cbd5e1' }}>• {project.ward}, {project.district}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
          <span>Current Active Stage: <b style={{ color: '#f59e0b' }}>Step {project.pipelineStep} ({PIPELINE_STEPS[project.pipelineStep - 1]?.label})</b></span>
          <span>•</span>
          <span>CRS: <b style={{ color: '#38bdf8' }}>{project.crs.split('(')[0].trim()}</b></span>
        </div>
      </div>

      {/* 9-Stage Progress Steps */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4px',
        overflowX: 'auto',
        padding: '2px 0'
      }}>
        {PIPELINE_STEPS.map((stepDef, idx) => {
          const status = project.pipelineStatuses[stepDef.statusKey];
          const isCompleted = status === 'COMPLETED';
          const isInProgress = status === 'IN_PROGRESS';
          const isCurrentActiveSection = activeSection === stepDef.targetSection;

          let badgeBg = 'rgba(255, 255, 255, 0.08)';
          let badgeBorder = '1px solid rgba(255, 255, 255, 0.15)';
          let textColor = '#94a3b8';
          let icon = <Circle size={11} color="#64748b" />;

          if (isCompleted) {
            badgeBg = 'rgba(34, 197, 94, 0.15)';
            badgeBorder = '1px solid #22c55e';
            textColor = '#4ade80';
            icon = <CheckCircle2 size={12} color="#22c55e" />;
          } else if (isInProgress) {
            badgeBg = 'rgba(245, 158, 11, 0.2)';
            badgeBorder = '1px solid #f59e0b';
            textColor = '#fbbf24';
            icon = <Clock size={12} color="#f59e0b" />;
          }

          return (
            <React.Fragment key={stepDef.step}>
              <button
                onClick={() => onNavigateSection(stepDef.targetSection)}
                title={`Click to navigate to ${stepDef.label}`}
                style={{
                  backgroundColor: isCurrentActiveSection ? '#0284c7' : badgeBg,
                  border: isCurrentActiveSection ? '1.5px solid #38bdf8' : badgeBorder,
                  color: isCurrentActiveSection ? '#ffffff' : textColor,
                  borderRadius: '6px',
                  padding: '5px 9px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {icon}
                <span>{stepDef.step}. {stepDef.label}</span>
                {isCompleted && <span style={{ fontSize: '10px' }}>✓</span>}
                {isInProgress && <span style={{ fontSize: '10px' }}>●</span>}
              </button>

              {idx < PIPELINE_STEPS.length - 1 && (
                <ArrowRight size={10} color="#475569" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
