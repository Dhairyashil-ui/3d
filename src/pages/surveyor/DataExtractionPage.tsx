import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Layers,
  Box,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  ExternalLink,
  ArrowRight,
  FileCheck2,
  AlertCircle,
  Eye,
  Check,
  Award,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { SurveyPipelineStore, PpcrcPipelineData, IngestedPackage } from '../../services/surveyPipelineStore';
import { InteractiveBuildingInspectionView } from '../../components/surveyor/extraction/InteractiveBuildingInspectionView';

export const DataExtractionPage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelineData, setPipelineData] = useState<PpcrcPipelineData>(SurveyPipelineStore.getData());
  const [submittedToUlbSuccess, setSubmittedToUlbSuccess] = useState<boolean>(pipelineData.surveyorSubmittedToUlb);
  const [activeTab, setActiveTab] = useState<'verification_dossier' | 'interactive_3d_inspection'>('verification_dossier');

  useEffect(() => {
    const handleUpdate = () => {
      setPipelineData(SurveyPipelineStore.getData());
    };
    window.addEventListener('ppcrc_pipeline_updated', handleUpdate);
    return () => window.removeEventListener('ppcrc_pipeline_updated', handleUpdate);
  }, []);

  const handleToggleCheckpoint = (cpId: string, currentStatus: string) => {
    const newVerified = currentStatus !== 'verified';
    const updated = SurveyPipelineStore.toggleCheckpoint(cpId, newVerified);
    setPipelineData(updated);
  };

  const handleVerifyAllCheckpoints = () => {
    const updated = SurveyPipelineStore.verifyAllCheckpoints();
    setPipelineData(updated);
  };

  const handleSubmitToUlb = () => {
    const updated = SurveyPipelineStore.submitSurveyorToUlb();
    setPipelineData(updated);
    setSubmittedToUlbSuccess(true);
  };

  const getPackageIcon = (type: IngestedPackage['type']) => {
    switch (type) {
      case 'ori':
        return <Layers size={18} color="#0284c7" />;
      case 'gis2d':
        return <MapPin size={18} color="#16a34a" />;
      case 'survey3d':
        return <Box size={18} color="#9333ea" />;
      case 'vertical_property':
        return <Building2 size={18} color="#ea580c" />;
    }
  };

  const verifiedCheckpointsCount = pipelineData.checkpoints.filter(cp => cp.status === 'verified').length;
  const canSubmit = verifiedCheckpointsCount === pipelineData.checkpoints.length;

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '22px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b'
    }}>
      {/* Breadcrumb matching Surveyor portal */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/surveyor/dashboard')}>Surveyor Portal</span>
        <span>›</span>
        <span style={{ color: '#1976d2' }}>Survey Activities</span>
        <span>›</span>
        <span style={{ fontWeight: 600 }}>PPCRC Field Verification & 3D Audit</span>
      </div>

      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #bfdbfe',
        padding: '22px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#1d4ed8', color: '#ffffff', fontSize: '10.5px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', marginBottom: '8px', textTransform: 'uppercase' }}>
            <span>Dispatched by ULB Admin &bull; Hinjawadi Phase 1</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 6px 0' }}>
            Survey Activities &bull; PPCRC Offline Verification & 3D Building Audit
          </h1>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
            Asset: <b>{pipelineData.propertyTitle}</b> &bull; CTS No: <b>{pipelineData.ctsNumber}</b> &bull; PMRDA Local Registry Code: <b>{pipelineData.ulbCode}</b>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab(activeTab === 'verification_dossier' ? 'interactive_3d_inspection' : 'verification_dossier')}
            style={{
              backgroundColor: activeTab === 'interactive_3d_inspection' ? '#1d4ed8' : '#ffffff',
              color: activeTab === 'interactive_3d_inspection' ? '#ffffff' : '#1d4ed8',
              border: '1px solid #93c5fd',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Eye size={15} />
            <span>{activeTab === 'interactive_3d_inspection' ? 'Back to Verification Checklist' : 'Inspect Interactive 3D Model'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'interactive_3d_inspection' ? (
        <InteractiveBuildingInspectionView
          onReplayPipeline={() => setActiveTab('verification_dossier')}
        />
      ) : (
        <>
          {/* SECTION 1: Assigned Survey Team Details */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            padding: '22px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  1. Assigned Survey Team Details (Allocated by ULB Admin)
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                  Mandate Reference: <b>{pipelineData.surveyTeam?.mandateReference || 'PMRDA/SURVEY/3D-CADASTRE/2026/SEC-148A'}</b> &bull; Assigned: {pipelineData.surveyTeam?.assignedAt || 'Verified Official Allocation'}
                </p>
              </div>

              <span style={{
                backgroundColor: '#dcfce7',
                color: '#15803d',
                padding: '4px 12px',
                borderRadius: '14px',
                fontSize: '11.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Award size={14} />
                Team Roster Active
              </span>
            </div>

            {/* Main Officer Banner */}
            {pipelineData.surveyTeam && (
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '14px 18px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: pipelineData.surveyTeam.mainOfficer.avatarColor,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800
                  }}>
                    RD
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                      ★ Lead Superintending Officer
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                      {pipelineData.surveyTeam.mainOfficer.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      {pipelineData.surveyTeam.mainOfficer.designation} &bull; ID: <b>{pipelineData.surveyTeam.mainOfficer.employeeId}</b>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '11.5px', color: '#1e40af' }}>
                  <b>Authority:</b> Department of Land Records, PMRDA Pune
                </div>
              </div>
            )}

            {/* Specialist Team Members */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {(pipelineData.surveyTeam?.members || []).map((member) => (
                <div
                  key={member.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: member.avatarColor,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                    flexShrink: 0
                  }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb' }}>
                      {member.role}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                      ID: {member.employeeId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Ingested File Packages Details */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            padding: '22px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  2. Received File Package Details (PPCRC Building Assets)
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                  Authoritative input files ready for field ground truthing and statutory offline verification.
                </p>
              </div>

              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: '12px' }}>
                ✓ 4 Packages Ingested
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {pipelineData.packages.map((pkg, idx) => (
                <div
                  key={pkg.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      {getPackageIcon(pkg.type)}
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                        Package {idx + 1}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                      {pkg.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #f1f5f9' }}>
                      <div><b>Archive:</b> {pkg.fileName}</div>
                      <div><b>Size:</b> {pkg.fileSize}</div>
                      <div><b>Format:</b> {pkg.fileFormat}</div>
                      <div style={{ wordBreak: 'break-all', fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                        <b>Hash:</b> {pkg.checksumSha256.substring(0, 18)}...
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                    ● Integrity Verified
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Checkpoints for Offline Verifications */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            padding: '22px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  3. Statutory Offline Verification Checkpoints
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                  Click each verification checkpoint to confirm field ground truthing, topological closure, and 3D height conformity.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12.5px', color: canSubmit ? '#16a34a' : '#ea580c', fontWeight: 700 }}>
                  {verifiedCheckpointsCount} of {pipelineData.checkpoints.length} Checkpoints Approved
                </span>
                <button
                  onClick={handleVerifyAllCheckpoints}
                  disabled={canSubmit}
                  style={{
                    backgroundColor: canSubmit ? '#f1f5f9' : '#0284c7',
                    color: canSubmit ? '#94a3b8' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: canSubmit ? 'default' : 'pointer'
                  }}
                >
                  Verify All 5 Checkpoints
                </button>
              </div>
            </div>

            {/* Checkpoints List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pipelineData.checkpoints.map((cp, idx) => {
                const isVerified = cp.status === 'verified';
                return (
                  <div
                    key={cp.id}
                    onClick={() => handleToggleCheckpoint(cp.id, cp.status)}
                    style={{
                      backgroundColor: isVerified ? '#f0fdf4' : '#f8fafc',
                      border: isVerified ? '1px solid #86efac' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: isVerified ? '#16a34a' : '#ffffff',
                        border: isVerified ? '1px solid #16a34a' : '2px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        {isVerified && <Check size={16} />}
                      </div>

                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                          Checkpoint {idx + 1}: {cp.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                          {cp.description}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                          <b>Standard:</b> {cp.standardTolerance} &bull; <span style={{ color: isVerified ? '#16a34a' : '#475569' }}><b>Observed:</b> {cp.observedValue}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isVerified ? (
                        <span style={{
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={13} />
                          Verified
                        </span>
                      ) : (
                        <span style={{
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Clock size={13} />
                          Click to Verify
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: 3D Building File Bundle & Submission to ULB */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                Submit Verification Result & 3D Building File to ULB Admin
              </div>
              <div style={{ fontSize: '12.5px', color: '#475569' }}>
                {canSubmit
                  ? 'All 5 checkpoints verified. Ready to dispatch result and 3D building file (PPCRC_Building_Reconstruction_LOD3.glb) to ULB publication.'
                  : `Please check and verify all 5 checkpoints above before submitting to ULB (${verifiedCheckpointsCount}/5 approved).`}
              </div>
              {pipelineData.surveyorSubmittedToUlb && (
                <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} />
                  <span>Submitted to ULB Urban Survey Publication at {pipelineData.surveyorSubmittedAt || 'Just now'}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {submittedToUlbSuccess && (
                <button
                  onClick={() => navigate('/ulb/urban-survey-publication')}
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '11px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Open ULB Urban Survey Publication</span>
                  <ExternalLink size={15} />
                </button>
              )}

              <button
                onClick={handleSubmitToUlb}
                disabled={!canSubmit}
                style={{
                  backgroundColor: canSubmit ? '#16a34a' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px 26px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: canSubmit ? '0 4px 14px rgba(22, 163, 74, 0.35)' : 'none'
                }}
              >
                <Send size={16} />
                <span>Submit to ULB</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataExtractionPage;
