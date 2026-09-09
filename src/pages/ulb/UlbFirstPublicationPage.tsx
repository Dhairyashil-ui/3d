import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Image, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface OwnerRecord {
  id: string;
  floorNo: string;
  ownershipShare: string;
  titleDocNo: string;
  ownerName: string;
  idDocType: string;
  idDocNumber: string;
  address: string;
  photoUrl: string;
  status: 'Pending' | 'Verified' | 'Flagged';
}

const INITIAL_OWNERS: OwnerRecord[] = [
  {
    id: 'own-1',
    floorNo: 'Ground Floor (Unit G-01)',
    ownershipShare: '100%',
    titleDocNo: '7/12 Gat No. 342/1 (PMRDA/REG/2019/8492)',
    ownerName: 'Dhananjay Balasaheb Patil',
    idDocType: 'Aadhaar Card',
    idDocNumber: 'XXXX-XXXX-4891',
    address: 'Survey No. 342, Near Blue Ridge IT Park, Hinjawadi Phase 1, Pune - 411057',
    photoUrl: '/assets/extracted/3d_parcel.png',
    status: 'Pending'
  },
  {
    id: 'own-2',
    floorNo: 'First Floor (Unit 101)',
    ownershipShare: '50%',
    titleDocNo: 'Registered Sale Deed #452009/2021',
    ownerName: 'Sunita Ramesh Kulkarni',
    idDocType: 'PAN Card',
    idDocNumber: 'ABCPS4521K',
    address: 'Plot 42, Green Acre Residency, Hinjawadi Phase 1, Pune - 411057',
    photoUrl: '/assets/extracted/3d_parcel.png',
    status: 'Pending'
  },
  {
    id: 'own-3',
    floorNo: 'First Floor (Unit 102)',
    ownershipShare: '50%',
    titleDocNo: 'PMC Assessment Tax #HINJ-9041-A',
    ownerName: 'Ramesh Vasantrao Kulkarni',
    idDocType: 'Aadhaar Card',
    idDocNumber: 'XXXX-XXXX-9102',
    address: 'Plot 42, Green Acre Residency, Hinjawadi Phase 1, Pune - 411057',
    photoUrl: '/assets/extracted/3d_parcel.png',
    status: 'Pending'
  },
  {
    id: 'own-4',
    floorNo: 'Second Floor (Unit 201)',
    ownershipShare: '100%',
    titleDocNo: 'Sanctioned Layout Deed #PMRDA-SLD-882',
    ownerName: 'Vikramaditya Shinde',
    idDocType: 'Voter ID',
    idDocNumber: 'MH/12/345/9871',
    address: 'Survey 345/A, Rajiv Gandhi Infotech Park, Hinjawadi Phase 1, Pune - 411057',
    photoUrl: '/assets/extracted/3d_parcel.png',
    status: 'Pending'
  }
];

export const UlbFirstPublicationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [owners] = useState<OwnerRecord[]>(INITIAL_OWNERS);
  const [selectedAction, setSelectedAction] = useState('Select Action');
  const [previewDoc, setPreviewDoc] = useState<OwnerRecord | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<OwnerRecord | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAction === 'Select Action') {
      alert('Please select an action from the dropdown.');
      return;
    }
    setSubmittedMessage(`Successfully processed: "${selectedAction}" for Ward 12 Hinjawadi Phase 1 (SU-HINJ-01). Status updated in NAKSHA State Registry.`);
  };

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Breadcrumb matching frame 580s */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => navigate('/ulb/urban-survey-publication')}
          style={{ background: 'none', border: 'none', color: '#1b539c', cursor: 'pointer', padding: 0, fontWeight: 600 }}
        >
          Manage Publication
        </button>
        <span>›</span>
        <span style={{ fontWeight: 600 }}>Urban Survey First Publication</span>
      </div>

      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            Urban Survey First Publication Review
          </h2>
        </div>

        <div style={{
          backgroundColor: '#eff6ff',
          padding: '6px 16px',
          borderRadius: '20px',
          border: '1px solid #bfdbfe',
          fontSize: '12.5px',
          color: '#1b539c',
          fontWeight: 700
        }}>
          Ward 12 - Hinjawadi Phase 1 &bull; SU-HINJ-01 &bull; Case No: 12/PMRDA/2025
        </div>
      </div>

      {/* Main Review Table matching video Frame 590s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '12px 20px',
          fontWeight: 700,
          fontSize: '14px'
        }}>
          Verified Cadastral Ownership & Title Records (Ground Truthing Completed)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {owners.map((owner, idx) => (
            <div
              key={owner.id}
              style={{
                padding: '20px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
              }}
            >
              {/* Row 1 Header Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1.5fr 1fr 2fr 1fr',
                gap: '16px',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Owner's Floor No.</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{owner.floorNo}</span>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Ownership Share</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a' }}>{owner.ownershipShare}</span>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Title Document No.</span>
                  <span style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 600 }}>{owner.titleDocNo}</span>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Owner's Identity</span>
                  <button
                    onClick={() => setPreviewDoc(owner)}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 4px rgba(2,132,199,0.25)'
                    }}
                  >
                    <FileText size={13} />
                    <span>View Document</span>
                  </button>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Communication Address</span>
                  <span style={{ fontSize: '12px', color: '#334155' }}>{owner.address}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Owner's Photo</span>
                  <button
                    onClick={() => setPreviewPhoto(owner)}
                    style={{
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 4px rgba(37,99,235,0.25)'
                    }}
                  >
                    <Image size={13} />
                    <span>View Photo</span>
                  </button>
                </div>
              </div>

              {/* Row 2 Owner Profile Strip */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <div>
                  Owner: <b style={{ color: '#1b539c' }}>{owner.ownerName}</b> &bull; ID: <b>{owner.idDocType} ({owner.idDocNumber})</b>
                </div>
                <div style={{ color: '#16a34a', fontWeight: 700 }}>
                  ✓ Ground Truthing Signature Attached &bull; DGPS Footprint Locked
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ACTION BAR matching video frame 590s */}
        <div style={{
          backgroundColor: '#f1f5f9',
          padding: '16px 24px',
          borderTop: '1px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '16px'
        }}>
          <form onSubmit={handleSubmitAction} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <option value="Select Action">Select Action</option>
                <option value="Claim">Claim</option>
                <option value="Send back to surveyor correction">Send back to surveyor correction</option>
                <option value="Send for final publication">Send for final publication</option>
                <option value="Verify & Process for 1st Publication">Verify & Process for 1st Publication</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(27,83,156,0.25)'
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* CONFIRMATION NOTIFICATION POPUP */}
      {submittedMessage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 150
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '28px 32px',
            maxWidth: '460px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle size={32} />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              Action Executed Successfully
            </div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', lineHeight: '1.5' }}>
              {submittedMessage}
            </div>
            <button
              onClick={() => {
                setSubmittedMessage(null);
                navigate('/ulb/urban-survey-publication');
              }}
              style={{
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 26px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Return to Publications
            </button>
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
              backgroundColor: '#1b539c',
              color: '#ffffff',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 800
            }}>
              <span>Official Document Preview</span>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Document Type</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1b539c', marginTop: '2px' }}>{previewDoc.idDocType}</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Document No: <b>{previewDoc.idDocNumber}</b></div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Registered Owner: <b>{previewDoc.ownerName}</b></div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Property: <b>{previewDoc.floorNo}</b></div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Cadastral Ref: <b>{previewDoc.titleDocNo}</b></div>
              </div>
              <div style={{ padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                <FileText size={36} color="#1b539c" style={{ margin: '0 auto 8px auto' }} />
                <div>Verified Digital Copy of Government Identity Document</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Verified via DigiLocker / MahaBhulekh API Integration</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  onClick={() => setPreviewDoc(null)}
                  style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW MODAL */}
      {previewPhoto && (
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
            maxWidth: '420px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 800
            }}>
              <span>Owner Photograph</span>
              <button onClick={() => setPreviewPhoto(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                backgroundColor: '#e0e7ff',
                color: '#1b539c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 800,
                border: '4px solid #bfdbfe',
                boxShadow: '0 4px 12px rgba(27,83,156,0.2)'
              }}>
                {previewPhoto.ownerName.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{previewPhoto.ownerName}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{previewPhoto.floorNo} &bull; Hinjawadi Phase 1, Pune</div>
              </div>
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, backgroundColor: '#dcfce7', padding: '4px 12px', borderRadius: '12px' }}>
                ✓ Biometrically verified during NAKSHA Ground Truthing
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <button
                  onClick={() => setPreviewPhoto(null)}
                  style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
