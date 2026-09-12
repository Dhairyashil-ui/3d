import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Users, 
  Building2, 
  X,
  Play,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { INITIAL_TEAM_COMPARISON, TeamComparisonField } from './extractionData';

interface DualTeamVerificationViewProps {
  onStartConstruction: () => void;
  onBackToUnit: () => void;
}

export const DualTeamVerificationView: React.FC<DualTeamVerificationViewProps> = ({
  onStartConstruction,
  onBackToUnit
}) => {
  const [fields, setFields] = useState<TeamComparisonField[]>(INITIAL_TEAM_COMPARISON);
  const [mismatchModalOpen, setMismatchModalOpen] = useState(false);
  const [activeMismatchField, setActiveMismatchField] = useState<TeamComparisonField | null>(null);

  const hasMismatch = fields.some(f => !f.isMatch);
  const allPassed = !hasMismatch;

  // Toggle mismatch for demonstration of the requirement:
  // "THIS DATA IS NOT MATCHING" Popup with Field, Team 1 value, Team 2 value
  const simulateMismatch = () => {
    setFields(prev => prev.map(f => {
      if (f.id === 'f-10') { // Number of LiDAR files
        return {
          ...f,
          team2Value: '3 Block Subsets (Block 04D Missing)',
          isMatch: false
        };
      }
      return f;
    }));
    const mismatched = {
      id: 'f-10',
      fieldLabel: 'Number of LiDAR Files',
      team1Value: '4 Block Subsets (.LAZ 1.4)',
      team2Value: '3 Block Subsets (Block 04D Missing)',
      isMatch: false,
      category: 'Sensor Data' as const
    };
    setActiveMismatchField(mismatched);
    setMismatchModalOpen(true);
  };

  const resolveMismatch = () => {
    setFields(INITIAL_TEAM_COMPARISON);
    setMismatchModalOpen(false);
    setActiveMismatchField(null);
  };

  const handleFieldClick = (field: TeamComparisonField) => {
    if (!field.isMatch) {
      setActiveMismatchField(field);
      setMismatchModalOpen(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #1e3a8a 0%, #0f172a 100%)',
        borderRadius: '10px',
        padding: '16px 22px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: '5px solid #3b82f6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            backgroundColor: 'rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#93c5fd'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#ffffff' }}>
                SURVEY TEAM DUAL-AUDIT VERIFICATION
              </h2>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                backgroundColor: '#2563eb',
                color: '#eff6ff',
                padding: '2px 8px',
                borderRadius: '12px',
                textTransform: 'uppercase'
              }}>
                STEP 2 OF 3 • AUDIT
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#cbd5e1' }}>
              Independent cross-validation between Acquisition Team 1 and Verifier Team 2 before triggering the 3D reconstruction engine.
            </p>
          </div>
        </div>

        {/* Simulation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={simulateMismatch}
            style={{
              padding: '7px 14px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertTriangle size={14} />
            <span>Simulate Mismatch</span>
          </button>

          <button
            onClick={resolveMismatch}
            style={{
              padding: '7px 14px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 size={14} />
            <span>Resolve All Matches</span>
          </button>
        </div>
      </div>

      {/* SIDE-BY-SIDE VERIFICATION CARD (Req #3) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        {/* Table Dual Column Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 1fr 140px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '14px 20px',
          fontWeight: 700,
          fontSize: '13.5px',
          alignItems: 'center',
          borderBottom: '2px solid #3b82f6'
        }}>
          <div>AUDIT ATTRIBUTE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#93c5fd' }}>
            <Users size={16} />
            <span>SURVEY TEAM 1 (Field Acquisition)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#86efac' }}>
            <ShieldCheck size={16} />
            <span>SURVEY TEAM 2 — VERIFIED DATA</span>
          </div>
          <div style={{ textAlign: 'center' }}>CORRELATION</div>
        </div>

        {/* Rows Comparison */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {fields.map((f, idx) => {
            const isRowMatch = f.isMatch;
            return (
              <div
                key={f.id}
                onClick={() => handleFieldClick(f)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '260px 1fr 1fr 140px',
                  padding: '12px 20px',
                  backgroundColor: !isRowMatch 
                    ? '#fef2f2' 
                    : idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                  borderBottom: '1px solid #f1f5f9',
                  alignItems: 'center',
                  fontSize: '13px',
                  cursor: !isRowMatch ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {/* Field Label */}
                <div style={{ fontWeight: 700, color: !isRowMatch ? '#991b1b' : '#334155' }}>
                  {f.fieldLabel}
                </div>

                {/* Team 1 Value */}
                <div style={{
                  color: '#1e293b',
                  fontWeight: 500,
                  fontFamily: f.fieldLabel.includes('ID') || f.fieldLabel.includes('Latitude') ? 'monospace' : 'inherit'
                }}>
                  {f.team1Value}
                </div>

                {/* Team 2 Value */}
                <div style={{
                  color: !isRowMatch ? '#dc2626' : '#1e293b',
                  fontWeight: !isRowMatch ? 700 : 500,
                  fontFamily: f.fieldLabel.includes('ID') || f.fieldLabel.includes('Latitude') ? 'monospace' : 'inherit'
                }}>
                  {f.team2Value}
                </div>

                {/* Correlation Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {isRowMatch ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={13} />
                      <span>MATCH</span>
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      animation: 'pulse 1.5s infinite'
                    }}>
                      <AlertOctagon size={13} />
                      <span>MISMATCH</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VERIFICATION SUMMARY & RECONSTRUCTION TRIGGER (Req #3) */}
      <div style={{
        backgroundColor: allPassed ? '#f0fdf4' : '#fff1f2',
        borderRadius: '10px',
        border: `1.5px solid ${allPassed ? '#86efac' : '#fecdd3'}`,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: allPassed ? '#22c55e' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: `0 0 16px ${allPassed ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
          }}>
            {allPassed ? <CheckCircle size={32} /> : <AlertOctagon size={32} />}
          </div>

          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: 800,
              color: allPassed ? '#15803d' : '#991b1b',
              letterSpacing: '0.4px'
            }}>
              {allPassed ? '✓ ALL TESTS PASSED' : '⚠️ MISMATCH DETECTED — RECONSTRUCTION LOCKED'}
            </div>
            <div style={{ fontSize: '13.5px', color: allPassed ? '#166534' : '#b91c1c', marginTop: '4px' }}>
              {allPassed 
                ? 'All 15 administrative, spatial, LiDAR, image, and GNSS control parameters strictly match between Team 1 and Team 2. Ready to launch the full-screen cinematic reconstruction pipeline.' 
                : 'One or more survey parameters between Field Team 1 and Verifier Team 2 do not match. You must resolve discrepancies before construction can begin.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBackToUnit}
            style={{
              padding: '11px 18px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            ← Back to Unit
          </button>

          <button
            onClick={() => {
              if (allPassed) {
                onStartConstruction();
              } else {
                setMismatchModalOpen(true);
              }
            }}
            disabled={!allPassed}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: allPassed ? '#1d4ed8' : '#94a3b8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '13px 28px',
              fontSize: '14.5px',
              fontWeight: 800,
              cursor: allPassed ? 'pointer' : 'not-allowed',
              boxShadow: allPassed ? '0 4px 14px rgba(29, 78, 216, 0.4)' : 'none',
              transition: 'all 0.15s ease',
              letterSpacing: '0.5px'
            }}
          >
            <Play size={18} fill="#ffffff" />
            <span>STARTING CONSTRUCTION</span>
          </button>
        </div>
      </div>

      {/* POPUP MODAL: "THIS DATA IS NOT MATCHING" (Req #3) */}
      {mismatchModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            width: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: '2px solid #ef4444'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertOctagon size={22} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, letterSpacing: '0.5px' }}>
                  THIS DATA IS NOT MATCHING
                </h3>
              </div>
              <button
                onClick={() => setMismatchModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: '1.5' }}>
                Reconstruction cannot proceed because the data values submitted by <b>Survey Team 1</b> and <b>Survey Team 2</b> conflict. The mismatch must be resolved before starting 3D construction.
              </p>

              <div style={{
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#991b1b', fontWeight: 700 }}>
                    Discrepant Field:
                  </span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                    {activeMismatchField?.fieldLabel || 'Number of LiDAR Files'}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '8px', borderTop: '1px solid #fecaca' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #fed7aa' }}>
                    <div style={{ fontSize: '11px', color: '#c2410c', fontWeight: 700 }}>Team 1 Value:</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '3px' }}>
                      {activeMismatchField?.team1Value || '4 Block Subsets (.LAZ 1.4)'}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 700 }}>Team 2 Value:</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626', marginTop: '3px' }}>
                      {activeMismatchField?.team2Value || '3 Block Subsets (Block 04D Missing)'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                Note: Do not allow construction to start until the mismatch is resolved.
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              padding: '14px 20px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                onClick={() => setMismatchModalOpen(false)}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                Close Notice
              </button>

              <button
                onClick={resolveMismatch}
                style={{
                  padding: '9px 18px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={14} />
                <span>Resolve Discrepancy (Re-verify Team 2)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
