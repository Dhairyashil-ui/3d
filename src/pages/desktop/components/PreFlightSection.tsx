import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Cpu,
  Crosshair,
  MapPin,
  Play,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MOCK_PREFLIGHT_CHECKS, PreFlightCheckItem, SurveyProject } from '../../../data/survey3dData';

interface PreFlightSectionProps {
  project: SurveyProject;
  onStartSurvey: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const PreFlightSection: React.FC<PreFlightSectionProps> = ({
  project,
  onStartSurvey,
  onNavigateSection
}) => {
  const [checks, setChecks] = useState<PreFlightCheckItem[]>(MOCK_PREFLIGHT_CHECKS);

  const toggleCheck = (id: string) => {
    setChecks((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'PASS' ? 'PENDING' : 'PASS' } : c
      )
    );
  };

  const allMandatoryPassed = checks.filter((c) => c.mandatory).every((c) => c.status === 'PASS');

  const categories = [
    { key: 'DRONE', label: 'UAV Platform & Airframe Systems', icon: <Radio size={14} color="#0284c7" /> },
    { key: 'LiDAR', label: 'Aerial LiDAR Laser Scanning Unit', icon: <Cpu size={14} color="#f59e0b" /> },
    { key: 'GNSS', label: 'Geodetic CORS & RTK Control Link', icon: <Crosshair size={14} color="#15803d" /> },
    { key: 'MISSION', label: 'Flight Mission Clearance & Overlap', icon: <MapPin size={14} color="#9333ea" /> }
  ];

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
          <ClipboardCheck size={16} />
          <span>Pre-Flight Readiness Safety Checklist & Airworthiness Lock</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Mandatory Safety Interlock Prior to Aerial Acquisition
        </div>
      </div>

      {/* Main Checklist Container */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
              System Sub-Assemblies Readiness Verification
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              All mandatory safety, sensor calibration, and CORS synchronization checks must be confirmed (PASS) before takeoff.
            </div>
          </div>

          <div style={{
            backgroundColor: allMandatoryPassed ? '#dcfce7' : '#fee2e2',
            color: allMandatoryPassed ? '#15803d' : '#b91c1c',
            border: allMandatoryPassed ? '1px solid #86efac' : '1px solid #fca5a5',
            borderRadius: '4px',
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={14} />
            <span>{allMandatoryPassed ? 'ALL MANDATORY CHECKS CLEARED' : 'ACTION REQUIRED: CHECKS PENDING'}</span>
          </div>
        </div>

        {/* 4 Category Groups */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {categories.map((cat) => {
            const catItems = checks.filter((c) => c.category === cat.key);

            return (
              <div
                key={cat.key}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: '#f8fafc',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '8px 12px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#1e293b'
                }}>
                  {cat.icon}
                  <span>{cat.label}</span>
                </div>

                <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {catItems.map((item) => {
                    const isPass = item.status === 'PASS';

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: isPass ? '1px solid #bbf7d0' : '1px solid #fecaca',
                          borderRadius: '4px',
                          padding: '7px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1e293b' }}>
                            {item.item}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                            Value: <b style={{ color: '#0369a1' }}>{item.value}</b>
                          </div>
                        </div>

                        <span style={{
                          backgroundColor: isPass ? '#22c55e' : '#cbd5e1',
                          color: '#ffffff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {isPass ? '✓ PASS' : 'PENDING'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Survey Action Bar */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            {allMandatoryPassed
              ? '✓ All 11 checklist parameters verified. Airspace permission active.'
              : '⚠️ Complete all checks to unlock UAV propulsion and sensor telemetry.'}
          </div>

          <button
            onClick={onStartSurvey}
            disabled={!allMandatoryPassed}
            style={{
              backgroundColor: allMandatoryPassed ? '#22c55e' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 24px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: allMandatoryPassed ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: allMandatoryPassed ? '0 4px 12px rgba(34, 197, 94, 0.35)' : 'none',
              letterSpacing: '0.4px'
            }}
          >
            <Play size={15} fill="#ffffff" />
            <span>START AERIAL SURVEY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
