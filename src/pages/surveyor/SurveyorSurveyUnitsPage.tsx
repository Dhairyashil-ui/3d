import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { JurisdictionFilterBar, JurisdictionSelection } from '../../components/common/JurisdictionFilterBar';
import { CURRENT_SURVEYOR_DEFAULT } from '../../data/jurisdictionData';
import { Search, RotateCcw, Edit2, X, CheckCircle, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface SurveyUnitRecord {
  id: string;
  sNo: number;
  ulb: string;
  ward: string;
  surveyUnit: string;
  isAssigned: string;
  assignedTo: string;
  isMapUploaded: string;
  mapUploadedOn: string;
  isNewMapRequired: string;
}

const INITIAL_SURVEY_UNITS: SurveyUnitRecord[] = [
  {
    id: 'SU-01',
    sNo: 1,
    ulb: 'PMRDA Pune - 270410',
    ward: 'Hinjawadi Village (411057)',
    surveyUnit: 'Survey Unit 01 - 348671 (Hinjawadi Phase 1 / I²IT & Tech Zone)',
    isAssigned: 'Yes',
    assignedTo: 'Surveyor Pune (Hinjawadi IT Park)',
    isMapUploaded: 'Yes',
    mapUploadedOn: '8/20/2026 09:30:00 AM',
    isNewMapRequired: 'No'
  },
  {
    id: 'SU-02',
    sNo: 2,
    ulb: 'PMRDA Pune - 270410',
    ward: 'Hinjawadi Village (411057)',
    surveyUnit: 'Survey Unit 02 - 348672 (Blue Ridge Zone)',
    isAssigned: 'Yes',
    assignedTo: 'Surveyor Field Team B',
    isMapUploaded: 'Yes',
    mapUploadedOn: '8/22/2026 10:15:20 AM',
    isNewMapRequired: 'No'
  },
  {
    id: 'SU-03',
    sNo: 3,
    ulb: 'PMRDA Pune - 270410',
    ward: 'Hinjawadi Village (411057)',
    surveyUnit: 'Survey Unit 03 - 348673 (Hinjawadi Gaothan Core)',
    isAssigned: 'Yes',
    assignedTo: 'Surveyor Field Team C',
    isMapUploaded: 'No',
    mapUploadedOn: 'Pending Upload',
    isNewMapRequired: 'Yes'
  },
  {
    id: 'SU-04',
    sNo: 4,
    ulb: 'PMRDA Pune - 270410',
    ward: 'Wakad Ward 08 (411057)',
    surveyUnit: 'Survey Unit 01 - 348661 (Wakad Highway Corridor)',
    isAssigned: 'Yes',
    assignedTo: 'Senior Surveyor Pune',
    isMapUploaded: 'Yes',
    mapUploadedOn: '8/25/2026 4:40:12 PM',
    isNewMapRequired: 'No'
  }
];

export const SurveyorSurveyUnitsPage: React.FC = () => {
  const [units, setUnits] = useState<SurveyUnitRecord[]>(INITIAL_SURVEY_UNITS);
  const [jurisdiction, setJurisdiction] = useState<JurisdictionSelection>({
    state: CURRENT_SURVEYOR_DEFAULT.state,
    district: CURRENT_SURVEYOR_DEFAULT.district,
    ulb: CURRENT_SURVEYOR_DEFAULT.ulb,
    wardVillage: CURRENT_SURVEYOR_DEFAULT.wardVillage,
    surveyUnit: CURRENT_SURVEYOR_DEFAULT.surveyUnit,
    surveyUnitCode: CURRENT_SURVEYOR_DEFAULT.surveyUnitCode
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<{ ward?: string; unit?: string } | null>(null);

  // Modal State for "Update Map Status"
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<SurveyUnitRecord | null>(null);
  const [modalNewMapRequired, setModalNewMapRequired] = useState('No');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleSearch = (sel: JurisdictionSelection) => {
    setJurisdiction(sel);
    setActiveFilter({
      ward: sel.wardVillage.trim().toLowerCase(),
      unit: sel.surveyUnit.trim().toLowerCase()
    });
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
    setSearchTerm('');
    setActiveFilter(null);
  };

  const openEditModal = (item: SurveyUnitRecord) => {
    setEditingUnit(item);
    setModalNewMapRequired(item.isNewMapRequired || 'No');
    setModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;

    setUnits(prev => prev.map(u => 
      u.id === editingUnit.id 
        ? { ...u, isNewMapRequired: modalNewMapRequired, isMapUploaded: modalNewMapRequired === 'Yes' ? 'No' : u.isMapUploaded } 
        : u
    ));

    setModalOpen(false);
    setSaveToast(`Survey unit ${editingUnit.surveyUnit.split('-')[0].trim()} status successfully updated!`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const filteredUnits = units.filter(u => {
    if (activeFilter) {
      if (activeFilter.ward && !u.ward.toLowerCase().includes(activeFilter.ward)) return false;
      if (activeFilter.unit && !u.surveyUnit.toLowerCase().includes(activeFilter.unit)) return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        u.surveyUnit.toLowerCase().includes(q) ||
        u.ward.toLowerCase().includes(q) ||
        u.assignedTo.toLowerCase().includes(q) ||
        u.ulb.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Home', link: '/surveyor/home' }, { label: 'Survey Unit Details' }]} />

      {saveToast && (
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
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Survey Unit Details
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Assigned Territory: <b>{jurisdiction.wardVillage}</b> ({jurisdiction.ulb})
          </span>
        </div>
      </div>

      {/* Dropdown Filter Bar */}
      <JurisdictionFilterBar
        initialValues={jurisdiction}
        onSearch={handleSearch}
        onClear={handleClear}
        onChange={(sel) => setJurisdiction(sel)}
        showButtons={true}
      />

      {/* Table Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '18px 22px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        {/* Search Field */}
        <div style={{ marginBottom: '14px', maxWidth: '320px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '6px 14px',
            backgroundColor: '#ffffff'
          }}>
            <Search size={15} color="#94a3b8" style={{ marginRight: '8px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by Unit, Ward, Surveyor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                width: '100%',
                color: '#1e293b'
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#29b6f6', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>S.No</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>ULB</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Ward / Village</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Survey Unit</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Assigned To</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Is Map Uploaded</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Map Uploaded On</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Is New Map Required</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnits.length > 0 ? (
                filteredUnits.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{item.sNo}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{item.ulb}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{item.ward}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284c7' }}>{item.surveyUnit}</td>
                    <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>{item.assignedTo}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        backgroundColor: item.isMapUploaded === 'Yes' ? '#dcfce7' : '#fee2e2',
                        color: item.isMapUploaded === 'Yes' ? '#15803d' : '#b91c1c',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: 700
                      }}>
                        {item.isMapUploaded}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '12px' }}>{item.mapUploadedOn}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        backgroundColor: item.isNewMapRequired === 'Yes' ? '#fee2e2' : '#f1f5f9',
                        color: item.isNewMapRequired === 'Yes' ? '#b91c1c' : '#475569',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: 600
                      }}>
                        {item.isNewMapRequired}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        onClick={() => openEditModal(item)}
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#1976d2',
                          cursor: 'pointer',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                    No survey units found matching current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Update Map Status */}
      {modalOpen && editingUnit && (
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
            maxWidth: '520px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '15px', fontWeight: 700 }}>
                Update Map Status — {editingUnit.surveyUnit.split('-')[0].trim()}
              </span>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12.5px' }}>
                <div style={{ color: '#64748b' }}>Assigned Territory:</div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{editingUnit.ward} ({editingUnit.ulb})</div>
                <div style={{ color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>{editingUnit.surveyUnit}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Is New Drone LiDAR Cadastral Map Required? *
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="radio"
                      name="isNewMap"
                      value="Yes"
                      checked={modalNewMapRequired === 'Yes'}
                      onChange={() => setModalNewMapRequired('Yes')}
                    />
                    <span>Yes (Flag for re-survey)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="radio"
                      name="isNewMap"
                      value="No"
                      checked={modalNewMapRequired === 'No'}
                      onChange={() => setModalNewMapRequired('No')}
                    />
                    <span>No (Current vector cadastre verified)</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 24px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
