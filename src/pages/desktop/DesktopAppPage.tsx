import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Monitor,
  UploadCloud,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCheck,
  Send,
  Layers,
  Box,
  Building2,
  MapPin,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  Check
} from 'lucide-react';
import { SurveyPipelineStore, PpcrcPipelineData, IngestedPackage } from '../../services/surveyPipelineStore';

export const DesktopAppPage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelineData, setPipelineData] = useState<PpcrcPipelineData>(SurveyPipelineStore.getData());
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [transmissionSuccess, setTransmissionSuccess] = useState<boolean>(pipelineData.desktopSubmittedToUlb);
  const [selectedFileNames, setSelectedFileNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleUpdate = () => {
      setPipelineData(SurveyPipelineStore.getData());
    };
    window.addEventListener('ppcrc_pipeline_updated', handleUpdate);
    return () => window.removeEventListener('ppcrc_pipeline_updated', handleUpdate);
  }, []);

  const handleVerifyOne = (pkgId: string) => {
    setVerifyingId(pkgId);
    setTimeout(() => {
      const updated = SurveyPipelineStore.verifyPackage(pkgId);
      setPipelineData(updated);
      setVerifyingId(null);
    }, 600);
  };

  const handleVerifyAll = () => {
    setVerifyingId('all');
    setTimeout(() => {
      const updated = SurveyPipelineStore.verifyAllPackages();
      setPipelineData(updated);
      setVerifyingId(null);
    }, 900);
  };

  const handleFileChange = (pkgId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFileNames(prev => ({ ...prev, [pkgId]: file.name }));
      // Automatically verify package when user selects custom file
      handleVerifyOne(pkgId);
    }
  };

  const handleTransmitToUlb = () => {
    const updated = SurveyPipelineStore.submitDesktopToUlb();
    setPipelineData(updated);
    setTransmissionSuccess(true);
  };

  const verifiedCount = pipelineData.packages.filter(p => p.verified).length;
  const allVerified = verifiedCount === pipelineData.packages.length;

  const getPackageIcon = (type: IngestedPackage['type']) => {
    switch (type) {
      case 'ori':
        return <Layers size={22} color="#0284c7" />;
      case 'gis2d':
        return <MapPin size={22} color="#16a34a" />;
      case 'survey3d':
        return <Box size={22} color="#9333ea" />;
      case 'vertical_property':
        return <Building2 size={22} color="#ea580c" />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b1329',
      color: '#e2e8f0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 1. Windows / Desktop Title Bar */}
      <div style={{
        height: '38px',
        backgroundColor: '#070d1e',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontSize: '12px',
        userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            backgroundColor: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Monitor size={12} color="#ffffff" />
          </div>
          <span style={{ fontWeight: 700, letterSpacing: '0.3px', color: '#f8fafc' }}>
            NAKSHA Desktop Application v2.0 &bull; 3D Geospatial Ingestion Workstation
          </span>
          <span style={{
            fontSize: '10px',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            color: '#4ade80',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            padding: '1px 8px',
            borderRadius: '10px',
            fontWeight: 700
          }}>
            CONNECTED TO PMRDA LOCAL REPOSITORY
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/ulb/package-receiving')}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}
          >
            <span>Switch to ULB Admin Portal</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* 2. Main Workstation Area */}
      <div style={{ flex: 1, padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {/* Project Context Header */}
        <div style={{
          backgroundColor: '#111c3a',
          border: '1px solid #1e3a8a',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                backgroundColor: '#1e40af',
                color: '#bfdbfe',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                Target Survey Asset
              </span>
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                CTS No: <b style={{ color: '#ffffff' }}>{pipelineData.ctsNumber}</b> &bull; ULPIN: <b style={{ color: '#38bdf8' }}>{pipelineData.ulpin}</b>
              </span>
            </div>
            <h1 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
              {pipelineData.propertyTitle}
            </h1>
            <div style={{ fontSize: '12.5px', color: '#94a3b8', display: 'flex', gap: '16px' }}>
              <span><b>ULB:</b> {pipelineData.ulbName} ({pipelineData.ulbCode})</span>
              <span>&bull;</span>
              <span><b>Ward:</b> {pipelineData.villageWard}</span>
              <span>&bull;</span>
              <span><b>Spatial Scope:</b> {pipelineData.totalStoreys} &bull; {pipelineData.builtUpAreaSqM.toLocaleString()} sq.m</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#070d1e',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #1e293b'
            }}>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                Verification Progress: <b style={{ color: allVerified ? '#4ade80' : '#f59e0b' }}>{verifiedCount} / 4 Packages Verified</b>
              </div>
              <button
                onClick={handleVerifyAll}
                disabled={allVerified || verifyingId !== null}
                style={{
                  backgroundColor: allVerified ? 'rgba(74, 222, 128, 0.2)' : '#0284c7',
                  color: allVerified ? '#4ade80' : '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: allVerified ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {verifyingId === 'all' ? (
                  <>
                    <RefreshCw size={12} className="spin" />
                    <span>Verifying All...</span>
                  </>
                ) : allVerified ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>All 4 Verified</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={12} />
                    <span>Verify All 4</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* The 4 Upload Packages on One Page */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#f8fafc' }}>
                Geospatial Upload Packages (4 Required)
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Verify and inspect each package individually before statutory transmission to ULB Admin.
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '18px'
          }}>
            {pipelineData.packages.map((pkg, idx) => {
              const currentFileName = selectedFileNames[pkg.id] || pkg.fileName;
              const isVerifyingThis = verifyingId === pkg.id || verifyingId === 'all';

              return (
                <div
                  key={pkg.id}
                  style={{
                    backgroundColor: '#111c3a',
                    border: pkg.verified ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: pkg.verified ? '0 0 15px rgba(34, 197, 94, 0.08)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    {/* Header with Type badge and Icon */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#070d1e',
                          border: '1px solid #1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getPackageIcon(pkg.type)}
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                            Package {idx + 1} &bull; {pkg.fileFormat}
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                            {pkg.name}
                          </div>
                        </div>
                      </div>

                      <div>
                        {pkg.verified ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            color: '#4ade80',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '12px'
                          }}>
                            <CheckCircle2 size={12} />
                            Verified
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '12px'
                          }}>
                            <Clock size={12} />
                            Pending Verification
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Technical Meta Specs */}
                    <div style={{
                      backgroundColor: '#070d1e',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      marginBottom: '14px',
                      fontSize: '11.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      border: '1px solid #1e293b'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Selected Archive:</span>
                        <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{currentFileName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>File Size:</span>
                        <span style={{ color: '#94a3b8' }}>{pkg.fileSize}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Coordinate Reference:</span>
                        <span style={{ color: '#94a3b8' }}>{pkg.crs}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>SHA-256 Checksum:</span>
                        <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '10.5px' }}>
                          {pkg.checksumSha256.substring(0, 16)}...
                        </span>
                      </div>
                      <div style={{ marginTop: '4px', color: '#94a3b8', fontSize: '11px', lineHeight: '1.4' }}>
                        {pkg.details}
                      </div>
                    </div>
                  </div>

                  {/* Actions: File Select and Individual Verification */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                    <label style={{
                      flex: 1,
                      backgroundColor: '#1e293b',
                      color: '#e2e8f0',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}>
                      <UploadCloud size={14} />
                      <span>Select/Replace File</span>
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange(pkg.id, e)}
                      />
                    </label>

                    <button
                      onClick={() => handleVerifyOne(pkg.id)}
                      disabled={pkg.verified || isVerifyingThis}
                      style={{
                        flex: 1,
                        backgroundColor: pkg.verified ? '#14532d' : isVerifyingThis ? '#1e3a8a' : '#2563eb',
                        color: pkg.verified ? '#86efac' : '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 14px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: pkg.verified ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {isVerifyingThis ? (
                        <>
                          <RefreshCw size={14} className="spin" />
                          <span>Verifying Integrity...</span>
                        </>
                      ) : pkg.verified ? (
                        <>
                          <Check size={14} />
                          <span>Verified at {pkg.verifiedAt || 'Ready'}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={14} />
                          <span>Verify Package</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transmission Section to ULB Admin */}
        <div style={{
          backgroundColor: '#070d1e',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '22px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              Statutory ULB Submission Hand-off
            </div>
            <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
              {allVerified
                ? 'All 4 packages verified. Ready to transmit survey assets to ULB Admin (PMRDA Pune).'
                : `Please complete verification for all 4 packages before transmission (${verifiedCount}/4 verified).`}
            </div>
            {pipelineData.desktopSubmittedToUlb && (
              <div style={{ fontSize: '12px', color: '#4ade80', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} />
                <span>Transmitted to ULB Admin at {pipelineData.desktopSubmittedAt || 'Just now'}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {transmissionSuccess && (
              <button
                onClick={() => navigate('/ulb/package-receiving')}
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
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                }}
              >
                <span>Open ULB Admin (Receiving Panel)</span>
                <ExternalLink size={15} />
              </button>
            )}

            <button
              onClick={handleTransmitToUlb}
              disabled={!allVerified}
              style={{
                backgroundColor: allVerified ? '#16a34a' : '#334155',
                color: allVerified ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                padding: '11px 26px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: allVerified ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: allVerified ? '0 4px 18px rgba(22, 163, 74, 0.45)' : 'none'
              }}
            >
              <Send size={16} />
              <span>Transmit Validated Packages to ULB Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopAppPage;
