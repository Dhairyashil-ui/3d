import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { RealGisMap } from '../../components/common/RealGisMap';
import { JurisdictionFilterBar, JurisdictionSelection } from '../../components/common/JurisdictionFilterBar';
import { CURRENT_SURVEYOR_DEFAULT, NAKSHA_JURISDICTION_HIERARCHY } from '../../data/jurisdictionData';
import { markPlotMappingCompleted } from '../../data/plotBuildingUlpinRegister';
import {
  Search,
  Eye,
  X,
  FileSpreadsheet,
  CheckCircle,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const MapImageVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetPlot = searchParams.get('plot');
  const [isCompleted, setIsCompleted] = useState(false);

  // Jurisdiction selection state matching Image 1
  const [jurisdiction, setJurisdiction] = useState<JurisdictionSelection>({
    state: CURRENT_SURVEYOR_DEFAULT.state,
    district: CURRENT_SURVEYOR_DEFAULT.district,
    ulb: CURRENT_SURVEYOR_DEFAULT.ulb,
    wardVillage: CURRENT_SURVEYOR_DEFAULT.wardVillage,
    surveyUnit: CURRENT_SURVEYOR_DEFAULT.surveyUnit,
    surveyUnitCode: CURRENT_SURVEYOR_DEFAULT.surveyUnitCode
  });

  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Dynamic table data matching selected survey unit
  const stateObj = NAKSHA_JURISDICTION_HIERARCHY.find(s => s.name === jurisdiction.state);
  const districtObj = stateObj?.districts.find(d => d.name === jurisdiction.district);
  const ulbObj = districtObj?.ulbs.find(u => u.name === jurisdiction.ulb);
  const villageObj = ulbObj?.villages.find(v => v.name === jurisdiction.wardVillage);
  const currentSurveyUnitObj = villageObj?.surveyUnits.find(su => su.name === jurisdiction.surveyUnit) || villageObj?.surveyUnits[0];

  const handleSearch = (sel: JurisdictionSelection) => {
    setJurisdiction(sel);
  };

  const handleClear = () => {
    setJurisdiction({
      state: CURRENT_SURVEYOR_DEFAULT.state,
      district: CURRENT_SURVEYOR_DEFAULT.district,
      ulb: CURRENT_SURVEYOR_DEFAULT.ulb,
      wardVillage: CURRENT_SURVEYOR_DEFAULT.wardVillage,
      surveyUnit: CURRENT_SURVEYOR_DEFAULT.surveyUnit,
      surveyUnitCode: CURRENT_SURVEYOR_DEFAULT.surveyUnitCode
    });
    setTableSearchTerm('');
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Breadcrumb matching Image 1 */}
      <Breadcrumb items={[{ label: 'Home', link: '/surveyor/home' }, { label: 'Map & Image Verification' }]} />

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
                🎯 Active Mapping Task: Verify Drone Orthophoto & Satellite Image Alignment for Plot {targetPlot}
              </div>
              <div style={{ fontSize: '12px', color: '#3b82f6' }}>
                Inspect the 3.5cm drone imagery in Hinjawadi SU-01 and click Approve to finalize cadastral mapping.
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
                🎉 Drone Orthophoto Verified & Mapping Completed for Plot {targetPlot}!
              </div>
              <div style={{ fontSize: '12px', color: '#047857' }}>
                Cadastral imagery alignment approved and recorded into PMRDA Hinjawadi SU-01 register.
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

      {/* Top Title Bar with "Verify Map & Image" button matching Image 1 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Map & Image Verification
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Surveyor Target Jurisdiction: <b>{jurisdiction.ulb}</b> • <b>{jurisdiction.wardVillage}</b>
          </span>
        </div>

        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          style={{
            backgroundColor: '#1976d2',
            color: '#ffffff',
            border: 'none',
            padding: '9px 22px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {viewMode === 'list' ? (
            <>
              <Layers size={16} />
              <span>Verify Map & Image</span>
            </>
          ) : (
            <span>Back to Verification Table</span>
          )}
        </button>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Dropdown Filter Bar matching Image 1 exactly */}
          <JurisdictionFilterBar
            initialValues={jurisdiction}
            onSearch={handleSearch}
            onClear={handleClear}
            onChange={(sel) => setJurisdiction(sel)}
            showButtons={true}
          />

          {/* Verification Records Table Card matching Image 1 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            {/* Table Top Bar with Search & Excel Export */}
            <div style={{
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{
                position: 'relative',
                width: '320px'
              }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by Survey Unit or ID..."
                  value={tableSearchTerm}
                  onChange={(e) => setTableSearchTerm(e.target.value)}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '20px',
                    padding: '7px 14px 7px 36px',
                    fontSize: '13px',
                    width: '100%',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Showing <b>1</b> record
                </span>
                <button
                  title="Export to Excel"
                  onClick={() => alert('Exporting Map & Image Verification log to Excel...')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FileSpreadsheet size={22} />
                </button>
              </div>
            </div>

            {/* Table with Header matching Image 1 */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#29b6f6', color: '#ffffff', textAlign: 'left' }}>
                    <th style={{ padding: '11px 16px', fontWeight: 700 }}>S.No</th>
                    <th style={{ padding: '11px 16px', fontWeight: 700 }}>ULB Name</th>
                    <th style={{ padding: '11px 16px', fontWeight: 700 }}>Survey Unit</th>
                    <th style={{ padding: '11px 16px', fontWeight: 700 }}>Survey Unit Id</th>
                    <th style={{ padding: '11px 16px', fontWeight: 700 }}>Date & time of Approval</th>
                    <th style={{ padding: '11px 16px', fontWeight: 700 }}>Map Status</th>
                    <th style={{ padding: '11px 16px', fontWeight: 700 }}>Image Status</th>
                    <th style={{ padding: '11px 16px', fontWeight: 700, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 600 }}>1</td>
                    <td style={{ padding: '14px 16px', color: '#1e293b', fontWeight: 600 }}>{jurisdiction.ulb}</td>
                    <td style={{ padding: '14px 16px', color: '#0369a1', fontWeight: 700 }}>{currentSurveyUnitObj?.name.split('-')[0].trim() || 'Survey Unit 01'}</td>
                    <td style={{ padding: '14px 16px', color: '#334155', fontFamily: 'monospace', fontWeight: 700 }}>{currentSurveyUnitObj?.code || '348671'}</td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>{currentSurveyUnitObj?.approvalDate || '20 08 2026 11:30 AM'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11.5px',
                        fontWeight: 700
                      }}>
                        {currentSurveyUnitObj?.mapStatus || 'Approved'} (Remark)
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11.5px',
                        fontWeight: 700
                      }}>
                        {currentSurveyUnitObj?.imageStatus || 'Approved'} (Remark)
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => setViewModalOpen(true)}
                        title="View Verification Details"
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#1976d2',
                          padding: '6px 10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}
                      >
                        <Eye size={15} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination / Record info footer */}
            <div style={{
              padding: '12px 20px',
              backgroundColor: '#fafafa',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: '#64748b'
            }}>
              <span>Items per page: <b>10</b></span>
              <span>1 – 1 of 1</span>
            </div>
          </div>
        </>
      ) : (
        /* Real Interactive GIS Map with Official Boundaries */
        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <RealGisMap height="calc(100vh - 210px)" />
        </div>
      )}

      {/* Modal: View Image & Verification Data */}
      {viewModalOpen && (
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
            {/* Header */}
            <div style={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} />
                <span style={{ fontSize: '15px', fontWeight: 700 }}>View Image & Verification Data</span>
              </div>
              <button
                onClick={() => setViewModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content matching Official Portal */}
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px'
              }}>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ULB Name</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{jurisdiction.ulb}</div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>LGD Code / Survey Unit ID</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{currentSurveyUnitObj?.code || '348671'}</div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Survey Unit Name</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1', marginTop: '2px' }}>{currentSurveyUnitObj?.name || 'Survey Unit 01'}</div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Date & Time Of Approval</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{currentSurveyUnitObj?.approvalDate || '20 08 2026 11:30 AM'}</div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Map Status</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>Approved (PMRDA Cadastral Verified)</div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Image Status</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>Approved (Drone LiDAR 3.5cm GSD Verified)</div>
                </div>
              </div>

              {/* Remarks Box */}
              <div style={{ marginTop: '16px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '12px 16px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af' }}>Surveyor Verification Remarks:</div>
                <div style={{ fontSize: '12.5px', color: '#1e3a8a', marginTop: '4px' }}>
                  Drone photogrammetric orthomosaic and LiDAR point cloud verified against DGPS RTK ground control points in Hinjawadi Phase 1. 317 building footprints and 46 parcels strictly delineated.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => { setViewModalOpen(false); setViewMode('map'); }}
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Layers size={15} />
                  <span>Inspect Map Directly</span>
                </button>

                <button
                  onClick={() => setViewModalOpen(false)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '8px 22px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
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
