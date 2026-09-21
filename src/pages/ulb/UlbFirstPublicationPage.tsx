import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
  Download,
  Building2,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  QrCode,
  Layers,
  Box,
  FileSpreadsheet,
  FileCheck2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { SurveyPipelineStore, PpcrcPipelineData } from '../../services/surveyPipelineStore';

interface OwnerRecord {
  id: string;
  floorNo: string;
  ownershipShare: string;
  titleDocNo: string;
  ownerName: string;
  idDocType: string;
  idDocNumber: string;
  address: string;
  status: 'Verified';
}

const PPCRC_OWNERS: OwnerRecord[] = [
  {
    id: 'own-1',
    floorNo: 'Ground Floor (Units G-01 to G-06)',
    ownershipShare: '100% Institutional',
    titleDocNo: 'PMRDA/REG/2019/8492 (CTS 342/1)',
    ownerName: 'Pimpri Chinchwad Research Center (PPCRC Trust)',
    idDocType: 'PAN & Trust Registration',
    idDocNumber: 'AAATP4521P',
    address: 'Survey No. 342/1, Rajiv Gandhi Infotech Park, Hinjawadi Phase 1, Pune - 411057',
    status: 'Verified'
  },
  {
    id: 'own-2',
    floorNo: 'First Floor (Units 101 to 106)',
    ownershipShare: '100% Academic & Lab Wing',
    titleDocNo: 'Sanctioned Layout Deed #PMRDA-SLD-882',
    ownerName: 'PPCRC Advanced Computing & Innovation Wing',
    idDocType: 'DigiLocker Entity ID',
    idDocNumber: 'MH-GOV-REG-9041',
    address: 'Survey No. 342/1, Rajiv Gandhi Infotech Park, Hinjawadi Phase 1, Pune - 411057',
    status: 'Verified'
  },
  {
    id: 'own-3',
    floorNo: 'Second Floor (Units 201 to 206)',
    ownershipShare: '100% Incubation Center',
    titleDocNo: 'PMC & PMRDA Assessment #HINJ-9041-B',
    ownerName: 'Fintech & AI Research Incubator',
    idDocType: 'MahaBhulekh DigiID',
    idDocNumber: 'DL-MH-PUN-34201',
    address: 'Survey No. 342/1, Rajiv Gandhi Infotech Park, Hinjawadi Phase 1, Pune - 411057',
    status: 'Verified'
  },
  {
    id: 'own-4',
    floorNo: 'Third Floor (Units 301 to 306)',
    ownershipShare: '100% Executive Directorate',
    titleDocNo: 'Sanctioned Cadastral Map 342/1-F3',
    ownerName: 'PPCRC Directorate & Technical Conference Facility',
    idDocType: 'State Cadastral Reg',
    idDocNumber: 'REG-270410-PPCRC',
    address: 'Survey No. 342/1, Rajiv Gandhi Infotech Park, Hinjawadi Phase 1, Pune - 411057',
    status: 'Verified'
  }
];

export const UlbFirstPublicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelineData, setPipelineData] = useState<PpcrcPipelineData>(SurveyPipelineStore.getData());
  const [owners] = useState<OwnerRecord[]>(PPCRC_OWNERS);
  const [syncingBhunaksha, setSyncingBhunaksha] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<OwnerRecord | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setPipelineData(SurveyPipelineStore.getData());
    };
    window.addEventListener('ppcrc_pipeline_updated', handleUpdate);
    return () => window.removeEventListener('ppcrc_pipeline_updated', handleUpdate);
  }, []);

  const handleTransmitToBhunaksha = () => {
    setSyncingBhunaksha(true);
    setTimeout(() => {
      const updated = SurveyPipelineStore.transmitToBhunaksha();
      setPipelineData(updated);
      setSyncingBhunaksha(false);
    }, 800);
  };

  const handleGeneratePropertyCard = () => {
    SurveyPipelineStore.downloadPropertyCardPdf();
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 5000);
  };

  return (
    <div style={{
      maxWidth: '1380px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '22px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b'
    }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => navigate('/ulb/urban-survey-publication')}
          style={{ background: 'none', border: 'none', color: '#1b539c', cursor: 'pointer', padding: 0, fontWeight: 600 }}
        >
          Manage Publication
        </button>
        <span>›</span>
        <span style={{ fontWeight: 600 }}>Urban Survey Publication & BhuNaksha ULPIN Issuance</span>
      </div>

      {/* Header Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        padding: '20px 26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate('/ulb/urban-survey-publication')}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#1b539c',
              fontWeight: 600,
              fontSize: '12.5px'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 4px 0' }}>
              Urban Survey Publication & BhuNaksha ULPIN Issuance
            </h1>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
              Asset: <b>{pipelineData.propertyTitle}</b> &bull; CTS No: <b>{pipelineData.ctsNumber}</b> &bull; Ward 12 Hinjawadi Phase 1, PMRDA Pune
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#eff6ff',
          padding: '8px 18px',
          borderRadius: '20px',
          border: '1px solid #bfdbfe',
          fontSize: '12.5px',
          color: '#1b539c',
          fontWeight: 700
        }}>
          Case No: PMRDA/3D-SURVEY/2026/0410 &bull; Verified by Surveyor
        </div>
      </div>

      {/* STEP 1: TRANSMIT TO BHUNAKSHA */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '22px 26px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Step 1: State BhuNaksha Core Transmission
            </h2>
            {pipelineData.transmittedToBhunaksha && (
              <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px' }}>
                SYNCHRONIZED WITH BHUNAKSHA
              </span>
            )}
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
            {pipelineData.transmittedToBhunaksha
              ? `Authoritative cadastral polygons & 3D building layers synchronized under Ref: ${pipelineData.bhunakshaReferenceNumber || 'BN-MAHA-2026-PMRDA-0410-PPCRC'}`
              : 'Transmit verified PPCRC surveyor audit report & 3D building model to National Informatics Centre (NIC) BhuNaksha engine.'}
          </p>
        </div>

        <button
          onClick={handleTransmitToBhunaksha}
          disabled={syncingBhunaksha || pipelineData.transmittedToBhunaksha}
          style={{
            backgroundColor: pipelineData.transmittedToBhunaksha ? '#14532d' : '#2563eb',
            color: pipelineData.transmittedToBhunaksha ? '#86efac' : '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '11px 22px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: pipelineData.transmittedToBhunaksha ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: pipelineData.transmittedToBhunaksha ? 'none' : '0 2px 8px rgba(37,99,235,0.3)'
          }}
        >
          {syncingBhunaksha ? (
            <span>Syncing with BhuNaksha Core...</span>
          ) : pipelineData.transmittedToBhunaksha ? (
            <>
              <CheckCircle2 size={16} />
              <span>Transmitted to BhuNaksha ✓</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Transmit to BhuNaksha</span>
            </>
          )}
        </button>
      </div>

      {/* STEP 2: ULPIN DETAILS CARD (REPLACED FINAL URBAN PROPERTY CARD) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          backgroundColor: '#1e3a8a',
          color: '#ffffff',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={20} color="#60a5fa" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Government of India &bull; Department of Land Resources (DoLR) &bull; PMRDA
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>
                ULPIN Details Card &bull; {pipelineData.propertyTitle}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#93c5fd' }}>Authoritative Unique Land Parcel Identifier</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fef08a', fontFamily: 'monospace' }}>
              {pipelineData.ulpin}
            </div>
          </div>
        </div>

        {/* ULPIN Details Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Key Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Cadastral Plot (CTS No.)</span>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{pipelineData.ctsNumber}</div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Gat / Survey Sheet No. 12</span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Jurisdiction & Local Body</span>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>PMRDA Pune (270410)</div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Ward 12 Hinjawadi Phase 1</span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Built-up & Storeys</span>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>18,450.00 sq.m &bull; G+3 Floors</div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Height: 16.40m &bull; MSL: 568.20m</span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>BhuNaksha Core Sync</span>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                ✓ Certified & Active
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Ref: BN-MAHA-2026-PPCRC</span>
            </div>
          </div>

          {/* Floor-by-Floor Vertical Property Schedule */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>
              Floor-Wise Vertical Property Division & Title Extract
            </h3>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>Floor Level</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>Registered Owner & Trust</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>Ownership Share</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>Title Deed / Reference</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>Doc Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map((own, idx) => (
                    <tr key={own.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>{own.floorNo}</td>
                      <td style={{ padding: '10px 14px', color: '#1e293b' }}>{own.ownerName}</td>
                      <td style={{ padding: '10px 14px', color: '#15803d', fontWeight: 700 }}>{own.ownershipShare}</td>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>{own.titleDocNo}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <button
                          onClick={() => setPreviewDoc(own)}
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          View {own.idDocType}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attached 3D Model & Survey Team Endorsement */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '14px 18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Box size={22} color="#15803d" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#14532d' }}>
                  Authoritative 3D Building Model Attached: {pipelineData.threeDBuildingFile}
                </div>
                <div style={{ fontSize: '11.5px', color: '#166534' }}>
                  Endorsed by Main Superintending Officer: <b>Dr. Rajesh Deshmukh</b> (MH-SLR-PUN-0410)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#15803d', fontWeight: 700 }}>
              <ShieldCheck size={18} />
              <span>Section 148-A Statutory Compliance Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: GENERATE PROPERTY CARD BUTTON & DOWNLOAD */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
      }}>
        <div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Generate & Download 3D Urban Property Card (UPC)
          </div>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            Download the official certified 3D Urban Property Card PDF for <b>PPCRC Building (CTS 342/1)</b> issued under the authority of PMRDA Pune.
          </div>
          {pipelineData.propertyCardGenerated && (
            <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} />
              <span>Card generated and downloaded successfully at {pipelineData.propertyCardGeneratedAt || 'Just now'}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleGeneratePropertyCard}
          style={{
            backgroundColor: '#16a34a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '13px 30px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 16px rgba(22, 163, 74, 0.45)',
            transition: 'transform 0.1s ease'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Download size={18} />
          <span>Generate Property Card</span>
        </button>
      </div>

      {/* TOAST ON DOWNLOAD SUCCESS */}
      {downloadSuccessToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          zIndex: 9999,
          border: '1px solid #22c55e'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Download size={16} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#f8fafc' }}>
              Download Started Successfully!
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
              PPCRC_3D_Urban_Property_Card_UPC_22Sep2026.pdf has been downloaded to your device.
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '560px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              backgroundColor: '#1e3a8a',
              color: '#ffffff',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 800
            }}>
              <span>Official Cadastral Document Record</span>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Verification Authority</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>{previewDoc.idDocType}</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Doc Identifier: <b>{previewDoc.idDocNumber}</b></div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Registered Trust: <b>{previewDoc.ownerName}</b></div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Spatial Unit: <b>{previewDoc.floorNo}</b></div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Title Reference: <b>{previewDoc.titleDocNo}</b></div>
              </div>
              <div style={{ padding: '14px', border: '2px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                <FileText size={32} color="#1e3a8a" style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontWeight: 700, color: '#1e293b' }}>Verified Digital Certificate Registered with DigiLocker / MahaBhulekh</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>Section 148-A Statutory Land Title Enclosure</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => setPreviewDoc(null)}
                  style={{ backgroundColor: '#1e3a8a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UlbFirstPublicationPage;
