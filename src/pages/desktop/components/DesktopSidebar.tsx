import React from 'react';
import {
  Layers,
  FileText,
  Archive,
  CheckCircle2
} from 'lucide-react';

interface DesktopSidebarProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  anomaliesCount?: number;
}

interface UploadNavButton {
  id: string;
  stepNumber: string;
  label: string;
  format: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeSection,
  onSelectSection
}) => {
  // STRICT REQUIREMENT: Only 3 buttons in the sidebar, separating each upload
  const uploadButtons: UploadNavButton[] = [
    {
      id: 'data-tpk',
      stepNumber: '1',
      label: 'ORI / Raster Data',
      format: '.TPK',
      icon: <Layers size={16} />,
      badge: '2D RASTER',
      badgeColor: '#0284c7'
    },
    {
      id: 'data-gdb',
      stepNumber: '2',
      label: 'Vector Cadastral Data',
      format: '.GDB / .ZIP',
      icon: <FileText size={16} />,
      badge: '2D VECTOR',
      badgeColor: '#16a34a'
    },
    {
      id: 'data-3d-evidence',
      stepNumber: '3',
      label: '3D Evidence Package',
      format: '.ZIP Container',
      icon: <Archive size={16} />,
      badge: '3D EVIDENCE',
      badgeColor: '#b45309'
    }
  ];

  // Map any alias or legacy section id to one of the 3 buttons
  const normalizedActiveId =
    activeSection === 'data-gdb'
      ? 'data-gdb'
      : activeSection === 'data-3d-evidence' || activeSection === 'data-lidar' || activeSection === 'data-architecture'
      ? 'data-3d-evidence'
      : 'data-tpk';

  return (
    <div
      style={{
        width: '230px',
        backgroundColor: '#174880',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: '1px solid #1e3a8a',
        userSelect: 'none'
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: '16px 14px 12px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#93c5fd',
            marginBottom: '3px'
          }}
        >
          Data Ingestion & Validation
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          3D Vertical Cadastre Workstation
        </div>
      </div>

      {/* Exactly 3 Upload & Validation Buttons */}
      <div
        style={{
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1
        }}
      >
        {uploadButtons.map((btn) => {
          const isActive = normalizedActiveId === btn.id;

          return (
            <button
              key={btn.id}
              onClick={() => onSelectSection(btn.id)}
              style={{
                width: '100%',
                padding: '11px 12px',
                textAlign: 'left',
                backgroundColor: isActive ? '#0284c7' : 'rgba(255, 255, 255, 0.07)',
                color: '#ffffff',
                border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 6px rgba(2, 132, 199, 0.35)' : 'none'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: isActive ? '#ffffff' : '#38bdf8' }}>
                    {btn.icon}
                  </span>
                  <span
                    style={{
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 600,
                      color: '#ffffff'
                    }}
                  >
                    {btn.label}
                  </span>
                </div>

                <span
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                    color: '#ffffff',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    letterSpacing: '0.4px'
                  }}
                >
                  {btn.format}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: '24px',
                  marginTop: '1px'
                }}
              >
                <span
                  style={{
                    fontSize: '10.5px',
                    color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)'
                  }}
                >
                  Step {btn.stepNumber} of 3
                </span>

                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    color: isActive ? '#dcfce7' : '#86efac',
                    fontWeight: 600
                  }}
                >
                  <CheckCircle2 size={11} />
                  Ready
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Status Info */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          fontSize: '10.5px',
          color: 'rgba(255, 255, 255, 0.6)',
          lineHeight: 1.4
        }}
      >
        <div style={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '2px' }}>
          3-Input Workflow
        </div>
        TPK + GDB + 3D Evidence ZIP
      </div>
    </div>
  );
};
