import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { surveyorStore, RoRPlotRecord } from '../../data/surveyor3dStore';
import { markPlotMappingCompleted } from '../../data/plotBuildingUlpinRegister';
import {
  FileSpreadsheet,
  Edit2,
  Trash2,
  Plus,
  ArrowLeft,
  CheckCircle,
  FileText,
  Upload,
  User,
  Building2,
  Calendar,
  Search,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

import { JurisdictionFilterBar, JurisdictionSelection } from '../../components/common/JurisdictionFilterBar';
import { CURRENT_SURVEYOR_DEFAULT } from '../../data/jurisdictionData';

export const RorEntryPage: React.FC = () => {
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
  const [filterStatus, setFilterStatus] = useState('All');

  const [plots, setPlots] = useState<RoRPlotRecord[]>(surveyorStore.getRorPlots());

  // Wizard state: null means table list, or active plot record
  const [activePlot, setActivePlot] = useState<RoRPlotRecord | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [successToast, setSuccessToast] = useState(false);

  // Step 1: Personal Data Form
  const [personalData, setPersonalData] = useState({
    citizenId: 'MH-CIT-2026-99120',
    aadhaar: 'XXXX-XXXX-9128',
    ownerShare: '100',
    firstName: 'Rajesh',
    middleName: '',
    lastName: 'Sharma',
    fatherName: 'Late Mohan Sharma',
    relation: 'Father',
    gender: 'Male',
    dob: '1982-05-14',
    mobile: '9826011223',
    email: 'rajesh.sharma@example.com',
    ownershipRights: 'Ownership',
    commencementYear: '2019',
    addressSame: 'Yes'
  });

  // Step 2: Type of Property Form
  const [propertyData, setPropertyData] = useState({
    typeOfProperty: 'Multi-Ownership/Group Housing Society',
    jurisdictionType: 'Private',
    departmentName: 'Town Planning & Housing (PMRDA)',
    purposeOfUsage: 'Residential / Mixed',
    mutationNo: 'MUT-PMRDA-2025-4402',
    dateOfMutation: '2025-04-18',
    encumbrances: 'None (Nil Encumbrance Certificate Verified)',
    buildingName: 'Megapolis Crest Residency',
    totalFloors: '5',
    builtUpArea: '2485',
    parkingArea: '450',
    garageArea: '120',
    municipalId: 'PMRDA-PT-2026-8840',
    acquisition: 'Purchased via Registered Sale Deed No. 1842',
    houseNo: 'Building 1',
    street: 'Rajiv Gandhi Infotech Park Main Rd',
    areaLocality: 'Hinjawadi Phase 1, Mulshi',
    landmark: 'Near I²IT Academic Campus & Wipro Circle',
    pincode: '411057'
  });

  const handleEditPlot = (p: RoRPlotRecord) => {
    setActivePlot(p);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save & Complete
      setActivePlot(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setActivePlot(null);
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Dynamic Breadcrumb */}
      {activePlot ? (
        <Breadcrumb
          items={[
            { label: 'Home', link: '/surveyor/home' },
            { label: 'List of ROR Plot', link: '#', onClick: () => setActivePlot(null) },
            { label: 'Plot/Property Details' }
          ]}
        />
      ) : (
        <Breadcrumb items={[{ label: 'Home', link: '/surveyor/home' }, { label: 'List of ROR Plot' }]} />
      )}

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
                🎯 Active Mapping Task: RoR 7/12 Land Record & Ownership Demarcation for Plot {targetPlot}
              </div>
              <div style={{ fontSize: '12px', color: '#3b82f6' }}>
                Verify property ownership rights, citizen ID, and land registry attributes, then click Approve to complete mapping.
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
                🎉 RoR 7/12 Record Demarcated & Mapping Completed for Plot {targetPlot}!
              </div>
              <div style={{ fontSize: '12px', color: '#047857' }}>
                Property ownership linked and recorded into PMRDA Hinjawadi SU-01 register.
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
          <span>Record of Rights (RoR) successfully saved and linked to land parcel!</span>
        </div>
      )}

      {!activePlot ? (
        /* =========================================================================
           VIEW 1: LIST OF ROR PLOTS matching Screenshot 221432.png
           ========================================================================= */
        <>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            List of ROR Plot
          </h2>

          {/* Jurisdiction Dropdown Selector Bar */}
          <JurisdictionFilterBar
            initialValues={jurisdiction}
            onChange={(sel) => setJurisdiction(sel)}
            showButtons={false}
          />

          {/* Table Card matching Screenshot 221432.png */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ maxWidth: '280px' }}>
                <input
                  type="text"
                  placeholder="Search"
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    width: '100%'
                  }}
                />
              </div>
              <button title="Export Excel" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a' }}>
                <FileSpreadsheet size={22} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#5dade2', color: '#ffffff', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>S.No</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Ward/Village</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Survey Unit</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Plot Serial Number</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Plot Number</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Plot Area(SQM)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {plots.map((p) => (
                    <tr key={p.sNo} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{p.sNo}</td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{p.wardVillage}</td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{p.surveyUnit}</td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{p.plotSerialNo}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1565c0' }}>{p.plotNumber}</td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{p.plotAreaSqm}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          backgroundColor: p.status === 'Completed' ? '#dcfce7' : p.status === 'Pending' ? '#fef9c3' : '#f1f5f9',
                          color: p.status === 'Completed' ? '#15803d' : p.status === 'Pending' ? '#a16207' : '#475569',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          fontWeight: 700
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleEditPlot(p)}
                            title="Edit / Enter RoR"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            title="Delete"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* =========================================================================
           VIEW 2: 4-STEP ROR WIZARD matching Screenshot 221708.png & 222828.png
           ========================================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Info Ribbon matching Screenshot 221708.png */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
              ULB : <b style={{ color: '#0f172a' }}>Pune</b> &nbsp;&nbsp;|&nbsp;&nbsp;
              Ward : <b style={{ color: '#0f172a' }}>Maharana pratap ward</b> &nbsp;&nbsp;|&nbsp;&nbsp;
              Survey Unit : <b style={{ color: '#0f172a' }}>Survey Unit 1</b> &nbsp;&nbsp;|&nbsp;&nbsp;
              Plot : <b style={{ color: '#1565c0' }}>{activePlot.plotNumber}</b>
            </div>
            <button
              onClick={handlePrevStep}
              style={{
                backgroundColor: '#1976d2',
                color: '#ffffff',
                border: 'none',
                padding: '6px 18px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          </div>

          {/* Stepper Progress Bar matching Screenshot 221708.png */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentStep >= 1 ? '#0f172a' : '#cbd5e1',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}>1</span>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 1 ? 700 : 500, color: currentStep === 1 ? '#0f172a' : '#64748b' }}>
                Private Plot/Property Details
              </span>
            </div>

            <div style={{ flex: 1, height: '2px', backgroundColor: '#e2e8f0', margin: '0 16px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentStep >= 2 ? '#1e88e5' : '#cbd5e1',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}>2</span>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 2 ? 700 : 500, color: currentStep === 2 ? '#0f172a' : '#64748b' }}>
                Type of Property
              </span>
            </div>

            <div style={{ flex: 1, height: '2px', backgroundColor: '#e2e8f0', margin: '0 16px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentStep >= 3 ? '#1e88e5' : '#cbd5e1',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}>3</span>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 3 ? 700 : 500, color: currentStep === 3 ? '#0f172a' : '#64748b' }}>
                Owners List
              </span>
            </div>

            <div style={{ flex: 1, height: '2px', backgroundColor: '#e2e8f0', margin: '0 16px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentStep >= 4 ? '#1e88e5' : '#cbd5e1',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}>4</span>
              <span style={{ fontSize: '12.5px', fontWeight: currentStep === 4 ? 700 : 500, color: currentStep === 4 ? '#0f172a' : '#64748b' }}>
                Owner Details & Verification
              </span>
            </div>
          </div>

          {/* STEP 1: Personal Data matching Screenshot 221708.png */}
          {currentStep === 1 && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                Personal Data
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px 20px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>State Citizen Centric ID</label>
                  <input
                    type="text"
                    value={personalData.citizenId}
                    onChange={(e) => setPersonalData({ ...personalData, citizenId: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Aadhar Number</label>
                  <input
                    type="text"
                    value={personalData.aadhaar}
                    onChange={(e) => setPersonalData({ ...personalData, aadhaar: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Owner Share (%) *</label>
                  <input
                    type="text"
                    value={personalData.ownerShare}
                    onChange={(e) => setPersonalData({ ...personalData, ownerShare: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f8fafc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>First name *</label>
                  <input
                    type="text"
                    value={personalData.firstName}
                    onChange={(e) => setPersonalData({ ...personalData, firstName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Middle name</label>
                  <input
                    type="text"
                    value={personalData.middleName}
                    onChange={(e) => setPersonalData({ ...personalData, middleName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Last name</label>
                  <input
                    type="text"
                    value={personalData.lastName}
                    onChange={(e) => setPersonalData({ ...personalData, lastName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Father/ Husband's/Guardian Name</label>
                  <input
                    type="text"
                    value={personalData.fatherName}
                    onChange={(e) => setPersonalData({ ...personalData, fatherName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Relation</label>
                  <select
                    value={personalData.relation}
                    onChange={(e) => setPersonalData({ ...personalData, relation: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', backgroundColor: '#ffffff' }}
                  >
                    <option value="Father">Father</option>
                    <option value="Husband">Husband</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Gender</label>
                  <select
                    value={personalData.gender}
                    onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', backgroundColor: '#ffffff' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Date of Birth *</label>
                  <input
                    type="date"
                    value={personalData.dob}
                    onChange={(e) => setPersonalData({ ...personalData, dob: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Mobile No. *</label>
                  <input
                    type="text"
                    value={personalData.mobile}
                    onChange={(e) => setPersonalData({ ...personalData, mobile: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Email ID</label>
                  <input
                    type="email"
                    value={personalData.email}
                    onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Address verification radio */}
              <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                  Is the owner's communication address same as the property address * &nbsp;&nbsp;
                </span>
                <label style={{ marginRight: '16px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="addressSame"
                    checked={personalData.addressSame === 'Yes'}
                    onChange={() => setPersonalData({ ...personalData, addressSame: 'Yes' })}
                  />
                  &nbsp; Yes
                </label>
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="addressSame"
                    checked={personalData.addressSame === 'No'}
                    onChange={() => setPersonalData({ ...personalData, addressSame: 'No' })}
                  />
                  &nbsp; No
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handleNextStep}
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 28px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(25, 118, 210, 0.25)'
                  }}
                >
                  Save & Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Type of Property matching Screenshot 222828.png */}
          {currentStep === 2 && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Type of Property Radios */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Type of Property *
                </label>
                <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="propType"
                      checked={propertyData.typeOfProperty === 'Plot'}
                      onChange={() => setPropertyData({ ...propertyData, typeOfProperty: 'Plot' })}
                    />
                    <span>Plot</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="propType"
                      checked={propertyData.typeOfProperty === 'Single/Joint Owners Individual Building'}
                      onChange={() => setPropertyData({ ...propertyData, typeOfProperty: 'Single/Joint Owners Individual Building' })}
                    />
                    <span>Single/Joint Owners Individual Building</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="propType"
                      checked={propertyData.typeOfProperty === 'Multi-Ownership/Group Housing Society'}
                      onChange={() => setPropertyData({ ...propertyData, typeOfProperty: 'Multi-Ownership/Group Housing Society' })}
                    />
                    <span>Multi-Ownership/Group Housing Society</span>
                  </label>
                </div>
              </div>

              {/* Building Details Section matching Screenshot 222828.png */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1565c0', marginBottom: '16px' }}>
                  Building Details ({propertyData.typeOfProperty})
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '14px 18px'
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Jurisdiction Type</label>
                    <select
                      value={propertyData.jurisdictionType}
                      onChange={(e) => setPropertyData({ ...propertyData, jurisdictionType: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px', backgroundColor: '#ffffff' }}
                    >
                      <option value="Private">Private</option>
                      <option value="State Govt.">State Govt.</option>
                      <option value="Central Govt.">Central Govt.</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Department Name</label>
                    <input
                      type="text"
                      value={propertyData.departmentName}
                      onChange={(e) => setPropertyData({ ...propertyData, departmentName: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Purpose of Usage</label>
                    <input
                      type="text"
                      value={propertyData.purposeOfUsage}
                      onChange={(e) => setPropertyData({ ...propertyData, purposeOfUsage: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Mutation No</label>
                    <input
                      type="text"
                      value={propertyData.mutationNo}
                      onChange={(e) => setPropertyData({ ...propertyData, mutationNo: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Date of Mutation</label>
                    <input
                      type="date"
                      value={propertyData.dateOfMutation}
                      onChange={(e) => setPropertyData({ ...propertyData, dateOfMutation: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Encumbrances / Other rights</label>
                    <input
                      type="text"
                      value={propertyData.encumbrances}
                      onChange={(e) => setPropertyData({ ...propertyData, encumbrances: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Building Name</label>
                    <input
                      type="text"
                      value={propertyData.buildingName}
                      onChange={(e) => setPropertyData({ ...propertyData, buildingName: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Total No of Floors</label>
                    <input
                      type="number"
                      value={propertyData.totalFloors}
                      onChange={(e) => setPropertyData({ ...propertyData, totalFloors: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Super Built-up Area (Sqm)</label>
                    <input
                      type="text"
                      value={propertyData.builtUpArea}
                      onChange={(e) => setPropertyData({ ...propertyData, builtUpArea: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Parking Area (SqM)</label>
                    <input
                      type="text"
                      value={propertyData.parkingArea}
                      onChange={(e) => setPropertyData({ ...propertyData, parkingArea: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Enter Municipal/Property ID</label>
                    <input
                      type="text"
                      value={propertyData.municipalId}
                      onChange={(e) => setPropertyData({ ...propertyData, municipalId: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Acquisition / Circumstances</label>
                    <input
                      type="text"
                      value={propertyData.acquisition}
                      onChange={(e) => setPropertyData({ ...propertyData, acquisition: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                    />
                  </div>
                </div>

                {/* Plot Address matching Screenshot 222828.png */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                    Plot Address
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px 18px'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>House/Building/Apartment No</label>
                      <input
                        type="text"
                        value={propertyData.houseNo}
                        onChange={(e) => setPropertyData({ ...propertyData, houseNo: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Street/Lane/Road *</label>
                      <input
                        type="text"
                        value={propertyData.street}
                        onChange={(e) => setPropertyData({ ...propertyData, street: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Pincode *</label>
                      <input
                        type="text"
                        value={propertyData.pincode}
                        onChange={(e) => setPropertyData({ ...propertyData, pincode: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Wizard Nav */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 24px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 28px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(25, 118, 210, 0.25)'
                  }}
                >
                  Save & Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Owners List */}
          {currentStep === 3 && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                  Registered Co-Owners for Plot {activePlot.plotNumber}
                </span>
                <button
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + Add Co-Owner
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#5dade2', color: '#ffffff', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px' }}>S.No</th>
                      <th style={{ padding: '8px 12px' }}>Owner Name</th>
                      <th style={{ padding: '8px 12px' }}>Share (%)</th>
                      <th style={{ padding: '8px 12px' }}>Aadhaar (Masked)</th>
                      <th style={{ padding: '8px 12px' }}>Mobile</th>
                      <th style={{ padding: '8px 12px' }}>Ownership Rights</th>
                      <th style={{ padding: '8px 12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 12px' }}>1</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1565c0' }}>{personalData.firstName} {personalData.lastName}</td>
                      <td style={{ padding: '10px 12px' }}>100%</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{personalData.aadhaar}</td>
                      <td style={{ padding: '10px 12px' }}>{personalData.mobile}</td>
                      <td style={{ padding: '10px 12px' }}>{personalData.ownershipRights}</td>
                      <td style={{ padding: '10px 12px', color: '#15803d', fontWeight: 700 }}>KYC Verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  style={{ backgroundColor: '#1976d2', color: '#ffffff', border: 'none', padding: '9px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  style={{ backgroundColor: '#1976d2', color: '#ffffff', border: 'none', padding: '9px 28px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save & Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Owner Details & Documents */}
          {currentStep === 4 && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                Owner Identity & Title Documents
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  <FileText size={32} color="#1976d2" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Aadhaar / Citizen Identity Card</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>PDF / JPG up to 5MB</div>
                  <input type="file" style={{ marginTop: '12px', fontSize: '12px' }} />
                </div>

                <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  <Upload size={32} color="#1976d2" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Registered Sale Deed / Title Deed</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>PDF / Scanned Copy</div>
                  <input type="file" style={{ marginTop: '12px', fontSize: '12px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  style={{ backgroundColor: '#1976d2', color: '#ffffff', border: 'none', padding: '9px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 32px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  Finalize & Submit RoR
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
