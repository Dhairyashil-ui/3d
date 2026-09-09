import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { JurisdictionFilterBar, JurisdictionSelection } from '../../components/common/JurisdictionFilterBar';
import { CURRENT_SURVEYOR_DEFAULT } from '../../data/jurisdictionData';
import { CoherentParcel } from '../../data/coherentPuneDataset';
import { apiClient } from '../../services/apiClient';
import { useSelectionStore } from '../../services/selectionStore';
import { markPlotMappingCompleted } from '../../data/plotBuildingUlpinRegister';
import { CheckCircle2, X, AlertTriangle, CheckCircle, Search, Edit3, MapPin, Check, Sparkles, ArrowLeft } from 'lucide-react';

export const PlotVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetPlot = searchParams.get('plot');
  const [isCompleted, setIsCompleted] = useState(false);

  const [jurisdiction, setJurisdiction] = useState<JurisdictionSelection>({
    state: CURRENT_SURVEYOR_DEFAULT.state,
    district: CURRENT_SURVEYOR_DEFAULT.district,
    ulb: CURRENT_SURVEYOR_DEFAULT.ulb,
    wardVillage: CURRENT_SURVEYOR_DEFAULT.wardVillage,
    surveyUnit: CURRENT_SURVEYOR_DEFAULT.surveyUnit,
    surveyUnitCode: CURRENT_SURVEYOR_DEFAULT.surveyUnitCode
  });

  const [parcels, setParcels] = useState<CoherentParcel[]>([]);
  const [selection, selectStore] = useSelectionStore();

  // Load parcels from persistent spatial database
  const loadParcels = async () => {
    const list = await apiClient.getParcels();
    setParcels(list);
  };

  useEffect(() => {
    loadParcels();
  }, []);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeParcel, setActiveParcel] = useState<CoherentParcel | null>(null);

  // Form Fields
  const [parcelShapeAgree, setParcelShapeAgree] = useState<'agree' | 'disagree'>('agree');
  const [perimeterAgree, setPerimeterAgree] = useState<'agree' | 'disagree'>('agree');
  const [areaAgree, setAreaAgree] = useState<'agree' | 'disagree'>('agree');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleOpenModal = (p: CoherentParcel) => {
    setActiveParcel(p);
    selectStore.selectParcel(p.parcelId);
    setParcelShapeAgree('agree');
    setPerimeterAgree('agree');
    setAreaAgree(p.verificationStatus === 'Verified' ? 'agree' : 'disagree');
    setDescription('');
    setValidationError(false);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasDisagree = parcelShapeAgree === 'disagree' || perimeterAgree === 'disagree' || areaAgree === 'disagree';
    if (hasDisagree && !description.trim()) {
      setValidationError(true);
      return;
    }

    if (activeParcel) {
      await apiClient.saveVerification({
        objectId: activeParcel.parcelId,
        objectType: 'PARCEL',
        decision: hasDisagree ? 'DISAGREE' : 'AGREE',
        reason: hasDisagree ? (description || 'Boundary/Area Mismatch with Cadastral Record') : 'Field Ground Truth & 2D/3D Geometry Aligned',
        notes: description || 'Verified by ground surveyor in PMRDA Hinjawadi Phase 1.',
        surveyor: 'Surveyor Pune (Hinjawadi IT Park)'
      });

      // Reload persistent data
      await loadParcels();
    }

    setModalOpen(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Home', link: '/surveyor/home' }, { label: 'Plot Verification' }]} />

      {/* Pending Work Task Banner when redirected for a specific plot */}
      {targetPlot && !isCompleted && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1.5px solid #3b82f6',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color="#2563eb" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e40af' }}>
                🎯 Active Mapping Task: Field Ground Truthing & Boundary Verification for Plot {targetPlot}
              </div>
              <div style={{ fontSize: '12px', color: '#3b82f6' }}>
                Verify physical boundaries and area attributes in Hinjawadi SU-01, then approve to finalize mapping.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              markPlotMappingCompleted(targetPlot);
              setIsCompleted(true);
            }}
            style={{
              backgroundColor: '#16a34a',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)'
            }}
          >
            <CheckCircle2 size={16} />
            <span>Approve & Complete Mapping</span>
          </button>
        </div>
      )}

      {isCompleted && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1.5px solid #10b981',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={22} color="#059669" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#065f46' }}>
                🎉 Field Verification & Mapping Completed for Plot {targetPlot}!
              </div>
              <div style={{ fontSize: '12px', color: '#047857' }}>
                Cadastral boundaries verified and recorded into PMRDA Hinjawadi SU-01 register.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/surveyor/upload-gt-points?tab=unmappedPlots')}
            style={{
              backgroundColor: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Return to Mapping Register</span>
            <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      )}

      {successToast && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '10px 16px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <CheckCircle size={16} />
          <span>Plot verification decision recorded and submitted to PMRDA cadastre successfully!</span>
        </div>
      )}

      {/* Top Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Plot Verification
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Active Cadastral Unit: <b>{jurisdiction.surveyUnit}</b> ({jurisdiction.ulb})
          </span>
        </div>

        <button
          onClick={() => {
            if (parcels.length > 0) handleOpenModal(parcels[0]);
          }}
          style={{
            backgroundColor: '#1976d2',
            color: '#ffffff',
            border: 'none',
            padding: '9px 20px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)'
          }}
        >
          Verify Next Plot
        </button>
      </div>

      {/* Dropdown Filter Bar */}
      <JurisdictionFilterBar
        initialValues={jurisdiction}
        onChange={(sel) => setJurisdiction(sel)}
        showButtons={false}
      />

      {/* Table of Plots */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '18px 22px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              Cadastral Parcels in {jurisdiction.wardVillage}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Showing verified and pending field survey parcels for assigned unit SU-01 (348671)
            </div>
          </div>
          <span style={{ fontSize: '12px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
            {parcels.length} Cadastral Plots
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#29b6f6', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Plot No</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Khasra No</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>ULPIN</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Plot Area (m²)</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Perimeter (m)</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Verification Status</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((p) => (
                <tr key={p.parcelId} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284c7' }}>Plot {p.plotNo}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{p.khasraNo}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: p.ulpin ? '#0f172a' : '#94a3b8' }}>
                    {p.ulpin || 'Pending'}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>{p.areaSqm.toFixed(2)}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{p.perimeterM.toFixed(2)}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      backgroundColor: p.verificationStatus === 'Verified' ? '#dcfce7' : p.verificationStatus === 'Disputed' ? '#fee2e2' : '#fef9c3',
                      color: p.verificationStatus === 'Verified' ? '#15803d' : p.verificationStatus === 'Disputed' ? '#b91c1c' : '#a16207',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      fontWeight: 700
                    }}>
                      {p.verificationStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleOpenModal(p)}
                      style={{
                        backgroundColor: '#1976d2',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(25, 118, 210, 0.25)'
                      }}
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Plot Verification */}
      {modalOpen && activeParcel && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '680px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '15px', fontWeight: 700 }}>
                Plot Verification — Plot No. {activeParcel.plotNo} ({activeParcel.parcelId})
              </span>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleFormSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Location Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ULB</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{jurisdiction.ulb}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Village</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{jurisdiction.wardVillage}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Survey Unit</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1', marginTop: '2px' }}>SU-01 (348671)</div>
                </div>
              </div>

              {/* Parcel Shape section */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px 18px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Parcel Shape & Vector Alignment
                </div>
                <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="parcelShape"
                      checked={parcelShapeAgree === 'agree'}
                      onChange={() => setParcelShapeAgree('agree')}
                    />
                    <span>Agree</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="parcelShape"
                      checked={parcelShapeAgree === 'disagree'}
                      onChange={() => setParcelShapeAgree('disagree')}
                    />
                    <span>Disagree</span>
                  </label>
                </div>
              </div>

              {/* Perimeter Section */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px 18px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Perimeter: {activeParcel.perimeterM.toFixed(2)} meters
                </div>
                <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="perimeter"
                      checked={perimeterAgree === 'agree'}
                      onChange={() => setPerimeterAgree('agree')}
                    />
                    <span>Agree</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="perimeter"
                      checked={perimeterAgree === 'disagree'}
                      onChange={() => setPerimeterAgree('disagree')}
                    />
                    <span>Disagree</span>
                  </label>
                </div>
              </div>

              {/* Area Section */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px 18px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Area of the plot: {activeParcel.areaSqm.toFixed(2)} m² (Khasra: {activeParcel.khasraNo})
                </div>
                <div style={{ display: 'flex', gap: '24px', fontSize: '13px', marginBottom: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="plotArea"
                      checked={areaAgree === 'agree'}
                      onChange={() => setAreaAgree('agree')}
                    />
                    <span>Agree</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="plotArea"
                      checked={areaAgree === 'disagree'}
                      onChange={() => setAreaAgree('disagree')}
                    />
                    <span>Disagree</span>
                  </label>
                </div>

                {areaAgree === 'disagree' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#b91c1c', fontWeight: 600, marginBottom: '4px' }}>
                      Reason for Disagreement / Field Discrepancy Note *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setValidationError(false);
                      }}
                      placeholder="e.g. Field DGPS boundary indicates 12m² northern offset along Rajiv Gandhi MIDC Road..."
                      style={{
                        width: '100%',
                        height: '60px',
                        padding: '8px 10px',
                        border: validationError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                        borderRadius: '4px',
                        fontSize: '12.5px',
                        boxSizing: 'border-box'
                      }}
                    />
                    {validationError && (
                      <span style={{ fontSize: '11px', color: '#ef4444', marginTop: '2px', display: 'block' }}>
                        Description is required when disagreeing with official cadastre.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 24px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Submit Decision
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '9px 20px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
