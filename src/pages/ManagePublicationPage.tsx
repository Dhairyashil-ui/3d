import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { GisMap } from '../components/common/GisMap';
import { mockStore, PublicationRecord } from '../data/mockStore';
import { PUNE_CADASTRAL_PARCELS } from '../data/puneGeoData';
import { Eye, CheckCircle2, XCircle, ShieldCheck, KeyRound, Award, ArrowLeft, RefreshCw } from 'lucide-react';

export const ManagePublicationPage: React.FC = () => {
  const [publications, setPublications] = useState<PublicationRecord[]>(mockStore.getPublications());

  // Filter States
  const [district] = useState('Pune');
  const [ulb, setUlb] = useState('PMRDA Pune (270410)');
  const [ward, setWard] = useState('');
  const [surveyUnit, setSurveyUnit] = useState('');

  // Selected Publication for Detailed Verification
  const [selectedPub, setSelectedPub] = useState<PublicationRecord | null>(null);

  // Workflow Dialogs
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('482910'); // Pre-fill for ease of review
  const [otpError, setOtpError] = useState('');
  const [eSignStep, setESignStep] = useState<'otp' | 'sign' | 'complete'>('otp');

  // Rejection Dialog
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleSearch = () => {
    let filtered = mockStore.getPublications();
    if (ulb) filtered = filtered.filter(p => p.ulb === ulb);
    if (ward) filtered = filtered.filter(p => p.ward === ward);
    if (surveyUnit) filtered = filtered.filter(p => p.surveyUnit === surveyUnit);
    setPublications(filtered);
  };

  const handleClear = () => {
    setWard('');
    setSurveyUnit('');
    setPublications(mockStore.getPublications());
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }
    setOtpError('');
    setESignStep('sign');
  };

  const handleCompleteESign = () => {
    if (!selectedPub) return;
    mockStore.publishRoR(selectedPub.id, 'Pune District Collector (MH-PUN-ADM-01)');
    setPublications(mockStore.getPublications());
    setESignStep('complete');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim() || !selectedPub) return;

    mockStore.rejectRoR(selectedPub.id, rejectReason);
    setPublications(mockStore.getPublications());
    setRejectModalOpen(false);
    setSelectedPub(null);
    setRejectReason('');
  };

  const columns: Column<PublicationRecord>[] = [
    { header: 'S.No', accessor: 'sNo', width: '55px', align: 'center' },
    { header: 'District', accessor: 'district' },
    { header: 'ULB', accessor: 'ulb' },
    { header: 'Ward/Village', accessor: 'ward' },
    { header: 'Survey Unit', accessor: 'surveyUnit' },
    { header: 'Total Plots', accessor: 'totalPlots', align: 'center' },
    {
      header: 'Ground Truthing Completed',
      accessor: (r) => <span style={{ color: '#16a34a', fontWeight: 600 }}>{r.gtCompleted}</span>,
      align: 'center'
    },
    {
      header: 'Ground Truthing Pending',
      accessor: (r) => <span style={{ color: r.gtPending > 0 ? '#ea580c' : '#64748b' }}>{r.gtPending}</span>,
      align: 'center'
    },
    {
      header: 'RoR Completed',
      accessor: (r) => <span style={{ color: '#16a34a', fontWeight: 600 }}>{r.rorCompleted}</span>,
      align: 'center'
    },
    {
      header: 'RoR Pending',
      accessor: (r) => <span style={{ color: r.rorPending > 0 ? '#ea580c' : '#64748b' }}>{r.rorPending}</span>,
      align: 'center'
    },
    { header: 'Case Pending', accessor: 'casePending', align: 'center' },
    {
      header: 'Status',
      accessor: (r) => (
        <span style={{
          backgroundColor:
            r.status === 'Final Published' ? '#dcfce7' :
            r.status === 'Pending' ? '#fef3c7' :
            r.status === 'Rejected' ? '#fee2e2' : '#f1f5f9',
          color:
            r.status === 'Final Published' ? '#15803d' :
            r.status === 'Pending' ? '#b45309' :
            r.status === 'Rejected' ? '#b91c1c' : '#64748b',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
          display: 'inline-block'
        }}>
          {r.status}
        </span>
      ),
      align: 'center'
    },
    {
      header: 'Final Publication Record',
      accessor: (row) => (
        <button
          onClick={() => {
            setSelectedPub(row);
            setESignStep('otp');
          }}
          title="Review Record & Map"
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1b539c',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <Eye size={14} /> View & Publish
        </button>
      ),
      align: 'center',
      width: '150px'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'Survey Activities' }, { label: 'Manage Publication' }]} />

      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
        Manage Publication
      </h2>

      {/* VIEW 1: PUBLICATION LIST (Manual Page 26 & 27) */}
      {!selectedPub && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filters matching Manual Page 27 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              alignItems: 'flex-end'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  disabled
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Urban Local Body (ULB)
                </label>
                <select
                  value={ulb}
                  onChange={(e) => setUlb(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
                >
                  <option value="PMRDA Pune (270410)">PMRDA Pune (270410)</option>
                  <option value="PCMC (270409)">PCMC (270409)</option>
                  <option value="PMC (270408)">PMC (270408)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Ward/Village
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
                >
                  <option value="">Choose Ward / Village</option>
                  <option value="Hinjawadi Village (411057)">Hinjawadi Village (411057)</option>
                  <option value="Wakad Ward 08 (411057)">Wakad Ward 08 (411057)</option>
                  <option value="Maan Village (411057)">Maan Village (411057)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Survey Unit
                </label>
                <select
                  value={surveyUnit}
                  onChange={(e) => setSurveyUnit(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
                >
                  <option value="">Choose Survey Unit</option>
                  <option value="Survey Unit 01 - 348671">Survey Unit 01 - 348671 (Phase 1)</option>
                  <option value="Survey Unit 02 - 348672">Survey Unit 02 - 348672 (Blue Ridge)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSearch}
                  style={{ flex: 1, backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Search
                </button>
                <button
                  onClick={handleClear}
                  style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={publications}
            searchPlaceholder="Search Publications..."
          />
        </div>
      )}

      {/* VIEW 2: DETAILED ROR VERIFICATION & E-SIGN FLOW (Manual Page 28) */}
      {selectedPub && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Bar with Back Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setSelectedPub(null)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#475569'
                }}
              >
                <ArrowLeft size={14} /> Back to Publications
              </button>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                Publication Review: {selectedPub.ward} — {selectedPub.surveyUnit}
              </h3>
            </div>

            {/* Action Buttons matching Manual Step 4: Proceed or Reject */}
            {selectedPub.status !== 'Final Published' ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setRejectModalOpen(true)}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    border: '1px solid #fca5a5',
                    borderRadius: '6px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <XCircle size={16} /> Reject & Send Back
                </button>
                <button
                  onClick={() => {
                    setESignStep('otp');
                    setOtpModalOpen(true);
                  }}
                  style={{
                    backgroundColor: '#1b539c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 10px rgba(27,83,156,0.3)'
                  }}
                >
                  <ShieldCheck size={18} /> Proceed for Final Publication
                </button>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#15803d',
                border: '1px solid #86efac',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={16} /> Final Published & Digitally Locked
              </div>
            )}
          </div>

          {/* Verification Warning / Summary Notice */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1b539c', fontSize: '14px' }}>
                Forwarded by ULB Admin: Pune Metropolitan Region Development Authority (270410)
              </div>
              <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>
                Carefully review the parcel boundaries on the satellite map and RoR attribute registry below before authorized e-Sign.
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#1e293b' }}>
              <div>Total Surveyed Plots: <b>{selectedPub.totalPlots}</b></div>
              <div>Ground Truthed: <b style={{ color: '#16a34a' }}>{selectedPub.gtCompleted}</b></div>
            </div>
          </div>

          {/* Interactive Cadastral Map View of the Unit */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#1b539c' }}>
              Associated Spatial Cadastre & Drone Orthomosaic
            </h4>
            <GisMap
              height="440px"
              showCadastral={true}
              showTaxPoints={true}
              showBuildings={true}
              title={`RoR Cadastral Verification Map • ${selectedPub.ward}`}
            />
          </div>

          {/* Record of Rights (RoR) Table */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              padding: '12px 18px',
              fontWeight: 700,
              fontSize: '14px'
            }}>
              Draft Record of Rights (RoR) Register — Ward 1, Pune
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Plot No</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>14-Digit ULPIN</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Owner Name</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Father/Husband</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Land Use</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Area (m²)</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Annual Tax</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>RoR Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PUNE_CADASTRAL_PARCELS.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1b539c' }}>{p.plotNo}</td>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb' }}>{p.ulpin}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{p.ownerName}</td>
                      <td style={{ padding: '8px 12px', color: '#64748b' }}>{p.fatherHusbandName}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', fontSize: '11.5px', fontWeight: 500 }}>
                          {p.landUse}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>{p.areaSqMeters}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{p.annualTax.toLocaleString()}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: selectedPub.status === 'Final Published' ? '#dcfce7' : '#fef3c7',
                          color: selectedPub.status === 'Final Published' ? '#15803d' : '#b45309',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '11.5px',
                          fontWeight: 600
                        }}>
                          {selectedPub.status === 'Final Published' ? 'Final Published' : p.rorStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: OTP & E-SIGN WORKFLOW MODAL (Matching Manual Page 28) */}
      <Modal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        title="Authorized RoR Final Publication & e-Sign"
        maxWidth="540px"
      >
        {eSignStep === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#1b539c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <KeyRound size={26} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', color: '#1e293b' }}>
                District Authority OTP Verification
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                An authentication OTP has been sent to the registered mobile of <b>Pune DM (+91 70005*****)</b>.
              </p>
            </div>

            {otpError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
                {otpError}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textAlign: 'center' }}>
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                style={{
                  width: '200px',
                  margin: '0 auto',
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '22px',
                  letterSpacing: '8px',
                  padding: '8px',
                  border: '2px solid #1b539c',
                  borderRadius: '6px',
                  outline: 'none',
                  fontWeight: 800
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setOtpModalOpen(false)}
                style={{ backgroundColor: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer', fontSize: '13.5px' }}
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {eSignStep === 'sign' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <Award size={26} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', color: '#1e293b' }}>
                Aadhaar / Digital Signature Certificate (DSC)
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                Signatory: <b>Collector & District Magistrate, Pune</b>
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', fontSize: '12.5px', color: '#334155', marginBottom: '20px' }}>
              <div><b>Department:</b> Revenue Department, Government of Maharashtra</div>
              <div><b>Certificate ID:</b> MP-BPL-DSC-2025-00981</div>
              <div><b>Standard:</b> CCA India Digital Signatures (PKI Class 3)</div>
              <div><b>Document Hash:</b> SHA-256 (b8a7c29...e4f91)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setOtpModalOpen(false)}
                style={{ backgroundColor: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteESign}
                style={{ backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '13.5px' }}
              >
                Apply e-Sign & Lock RoR
              </button>
            </div>
          </div>
        )}

        {eSignStep === 'complete' && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#15803d', fontSize: '20px' }}>
              Successfully Final Published!
            </h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
              The Record of Rights for <b>{selectedPub?.ward}</b> is now locked and referenced system-wide as the authoritative legal version.
            </p>
            <button
              onClick={() => {
                setOtpModalOpen(false);
                setSelectedPub(null);
              }}
              style={{
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 24px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Return to Publications
            </button>
          </div>
        )}
      </Modal>

      {/* REJECT MODAL (Matching Manual Page 28 Step 4 Option 2) */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject and Send Back for Correction"
        maxWidth="500px"
      >
        <form onSubmit={handleRejectSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Mandatory Rejection Remark <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Explain the specific boundary discrepancies or documentation inaccuracies requiring correction by ULB Admin..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              style={{ backgroundColor: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer', fontSize: '13.5px' }}
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
