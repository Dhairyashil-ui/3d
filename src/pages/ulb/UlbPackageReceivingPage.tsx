import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Layers,
  Box,
  Building2,
  MapPin,
  Users,
  UserCheck,
  ShieldCheck,
  Send,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';
import { SurveyPipelineStore, PpcrcPipelineData, IngestedPackage } from '../../services/surveyPipelineStore';

export const UlbPackageReceivingPage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelineData, setPipelineData] = useState<PpcrcPipelineData>(SurveyPipelineStore.getData());
  const [dispatchedSuccess, setDispatchedSuccess] = useState<boolean>(pipelineData.teamDispatchedToSurveyor);

  useEffect(() => {
    const handleUpdate = () => {
      setPipelineData(SurveyPipelineStore.getData());
    };
    window.addEventListener('ppcrc_pipeline_updated', handleUpdate);
    return () => window.removeEventListener('ppcrc_pipeline_updated', handleUpdate);
  }, []);

  const handleAssignTeam = () => {
    const updated = SurveyPipelineStore.assignSurveyTeam();
    setPipelineData(updated);
  };

  const handleDispatchToSurveyor = () => {
    const updated = SurveyPipelineStore.dispatchToSurveyor();
    setPipelineData(updated);
    setDispatchedSuccess(true);
  };

  const getPackageIcon = (type: IngestedPackage['type']) => {
    switch (type) {
      case 'ori':
        return <Layers size={20} color="#0284c7" />;
      case 'gis2d':
        return <MapPin size={20} color="#16a34a" />;
      case 'survey3d':
        return <Box size={20} color="#9333ea" />;
      case 'vertical_property':
        return <Building2 size={20} color="#ea580c" />;
    }
  };

  return (
    <div style={{
      maxWidth: '1380px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b'
    }}>
      {/* Breadcrumb matching ULB theme */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c', cursor: 'pointer' }} onClick={() => navigate('/ulb/home')}>Home</span>
        <span>›</span>
        <span style={{ fontWeight: 600 }}>Package Ingestion & Survey Team Allocation</span>
      </div>

      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', marginBottom: '8px', textTransform: 'uppercase' }}>
            <span>ULB Ingestion Portal &bull; PMRDA Pune</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 6px 0' }}>
            Geospatial Package Ingestion & Survey Team Allocation
          </h1>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
            Receiving authoritative aerial survey files from NAKSHA Desktop Workstation &bull; Target: <b>{pipelineData.propertyTitle}</b> (CTS {pipelineData.ctsNumber})
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Statutory Dossier Ref:</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>PMRDA/3D-SURVEY/2026/0410</div>
          <div style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
            ● Local Registry Active
          </div>
        </div>
      </div>

      {/* SECTION 1: Received Geospatial Packages */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              1. Received Geospatial Packages from Desktop Workstation
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
              The 4 verified packages transmitted from Desktop Workstation (http://localhost:5174/desktop) for PPCRC Building.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              <CheckCircle2 size={15} />
              4 of 4 Packages Verified & Ingested
            </span>
          </div>
        </div>

        {/* 4 Packages Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
          {pipelineData.packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getPackageIcon(pkg.type)}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>
                    READY
                  </span>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Package {idx + 1} &bull; {pkg.fileFormat}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', margin: '3px 0 8px 0', minHeight: '38px' }}>
                  {pkg.name}
                </div>

                <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                  <div><b>File:</b> {pkg.fileName}</div>
                  <div><b>Size:</b> {pkg.fileSize}</div>
                  <div><b>CRS:</b> {pkg.crs}</div>
                </div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '11px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BadgeCheck size={14} />
                <span>Checksum & CRS Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Building Reference Summary */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12.5px'
        }}>
          <div>
            <b>Asset Reference:</b> {pipelineData.propertyTitle} &bull; CTS 342/1 &bull; {pipelineData.villageWard}, PMRDA Pune
          </div>
          <div>
            <b>Elevation / Height:</b> {pipelineData.elevationMsl}m MSL / {pipelineData.buildingHeightM}m ({pipelineData.totalStoreys}) &bull; Area: <b>{pipelineData.builtUpAreaSqM.toLocaleString()} sq.m</b>
          </div>
        </div>
      </div>

      {/* SECTION 2: Survey Team Allocation */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              2. Assign Survey Verification Team
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
              Appoint the Main Superintending Officer and specialized field verification officers for ground truthing.
            </p>
          </div>

          <button
            onClick={handleAssignTeam}
            style={{
              backgroundColor: pipelineData.surveyTeamAssigned ? '#f1f5f9' : '#1d4ed8',
              color: pipelineData.surveyTeamAssigned ? '#1e293b' : '#ffffff',
              border: pipelineData.surveyTeamAssigned ? '1px solid #cbd5e1' : 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: pipelineData.surveyTeamAssigned ? 'none' : '0 2px 8px rgba(29, 78, 216, 0.3)'
            }}
          >
            <Sparkles size={16} />
            <span>{pipelineData.surveyTeamAssigned ? 'Re-assign Survey Team' : 'Assign Survey Team (Autofill Details)'}</span>
          </button>
        </div>

        {pipelineData.surveyTeamAssigned && pipelineData.surveyTeam ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Main Superintending Officer Callout */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: pipelineData.surveyTeam.mainOfficer.avatarColor,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 800
                }}>
                  RD
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                    ★ Main Superintending Officer & Team Lead
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                    {pipelineData.surveyTeam.mainOfficer.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    {pipelineData.surveyTeam.mainOfficer.designation} &bull; {pipelineData.surveyTeam.mainOfficer.department}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '12px' }}>
                <div style={{ color: '#64748b' }}>Officer ID: <b>{pipelineData.surveyTeam.mainOfficer.employeeId}</b></div>
                <div style={{ color: '#15803d', fontWeight: 600, marginTop: '2px' }}>Assigned under Sec 148-A MLRC</div>
              </div>
            </div>

            {/* Team Members List */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
                All Assigned Team Members (Specialist Roster)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                {pipelineData.surveyTeam.members.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: member.avatarColor,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
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
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        ID: {member.employeeId}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '36px 20px',
            textAlign: 'center'
          }}>
            <Users size={36} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>
              No Survey Team Allocated Yet
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px', marginBottom: '16px' }}>
              Click the button below to auto-assign the Main Superintending Officer and specialized field surveyors.
            </div>
            <button
              onClick={handleAssignTeam}
              style={{
                backgroundColor: '#1d4ed8',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 22px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Assign Survey Team Now
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: Submit and Dispatch to Surveyor */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        padding: '22px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
      }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Dispatch Survey Activities to Surveyor Portal
          </div>
          <div style={{ fontSize: '12.5px', color: '#475569' }}>
            {dispatchedSuccess
              ? 'Successfully dispatched to Surveyor activities. Surveyor can now proceed with offline checkpoints.'
              : 'Submit survey team allocation and package assets to Surveyor activities section (http://localhost:5174/surveyor).'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {dispatchedSuccess && (
            <button
              onClick={() => navigate('/surveyor/data-extraction')}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '11px 22px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Go to Surveyor Activities</span>
              <ArrowRight size={16} />
            </button>
          )}

          <button
            onClick={handleDispatchToSurveyor}
            disabled={!pipelineData.surveyTeamAssigned}
            style={{
              backgroundColor: pipelineData.surveyTeamAssigned ? '#16a34a' : '#94a3b8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '11px 26px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: pipelineData.surveyTeamAssigned ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: pipelineData.surveyTeamAssigned ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none'
            }}
          >
            <Send size={16} />
            <span>Submit & Dispatch to Surveyor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UlbPackageReceivingPage;
