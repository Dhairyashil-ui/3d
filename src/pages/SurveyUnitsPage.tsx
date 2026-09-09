import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DataTable, Column } from '../components/common/DataTable';
import { GisMap } from '../components/common/GisMap';
import { Modal } from '../components/common/Modal';
import { mockStore, SurveyUnit } from '../data/mockStore';
import { MapPin, Eye, CheckCircle2, X } from 'lucide-react';

export const SurveyUnitsPage: React.FC = () => {
  const [unitsList, setUnitsList] = useState<SurveyUnit[]>(mockStore.getSurveyUnits());

  // Filter States
  const [ulb, setUlb] = useState('PMRDA Pune (270410)');
  const [ward, setWard] = useState('Hinjawadi Village (411057)');
  const [surveyUnit, setSurveyUnit] = useState('');

  // Map Modal
  const [activeUnitForMap, setActiveUnitForMap] = useState<SurveyUnit | null>(null);

  const handleSearch = () => {
    let filtered = mockStore.getSurveyUnits();
    if (ulb) filtered = filtered.filter((u) => u.ulb === ulb);
    if (ward) filtered = filtered.filter((u) => u.ward === ward);
    if (surveyUnit) filtered = filtered.filter((u) => u.surveyUnit === surveyUnit);
    setUnitsList(filtered);
  };

  const handleClear = () => {
    setUlb('PMRDA Pune (270410)');
    setWard('');
    setSurveyUnit('');
    setUnitsList(mockStore.getSurveyUnits());
  };

  const columns: Column<SurveyUnit>[] = [
    { header: 'S.No', accessor: 'sNo', width: '60px', align: 'center' },
    { header: 'ULB', accessor: 'ulb' },
    { header: 'Ward', accessor: 'ward' },
    { header: 'Survey Unit', accessor: 'surveyUnit' },
    {
      header: 'Is Assigned',
      accessor: (row) => (
        <span style={{
          backgroundColor: row.isAssigned === 'Yes' ? '#dcfce7' : '#fee2e2',
          color: row.isAssigned === 'Yes' ? '#15803d' : '#b91c1c',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          {row.isAssigned}
        </span>
      ),
      align: 'center',
      width: '110px'
    },
    { header: 'Assigned To', accessor: 'assignedTo' },
    {
      header: 'Is Map Uploaded',
      accessor: (row) => (
        <span style={{
          backgroundColor: row.isMapUploaded === 'Yes' ? '#e0f2fe' : '#f1f5f9',
          color: row.isMapUploaded === 'Yes' ? '#0369a1' : '#64748b',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: row.isMapUploaded === 'Yes' ? 'pointer' : 'default'
        }}
        onClick={() => {
          if (row.isMapUploaded === 'Yes') setActiveUnitForMap(row);
        }}
        >
          {row.isMapUploaded} {row.isMapUploaded === 'Yes' ? '👁️' : ''}
        </span>
      ),
      align: 'center',
      width: '130px'
    },
    { header: 'Map Uploaded On', accessor: 'mapUploadedOn' },
    {
      header: 'Action',
      accessor: (row) => (
        <button
          onClick={() => setActiveUnitForMap(row)}
          title="View Unit Geospatial Coverage"
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1b539c',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px'
          }}
        >
          <MapPin size={13} /> View Map
        </button>
      ),
      align: 'center',
      width: '110px'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'Survey Unit Details' }]} />

      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
        Survey Unit Details
      </h2>

      {/* Filter Card matching Manual Page 14 & 15 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              District
            </label>
            <input
              type="text"
              value="Pune"
              disabled
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '13.5px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Urban Local Body (ULB)<span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={ulb}
              onChange={(e) => setUlb(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px'
              }}
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
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px'
              }}
            >
              <option value="">Select Ward / Village</option>
              <option value="Hinjawadi Village (411057)">Hinjawadi Village (411057)</option>
              <option value="Wakad Ward 08 (411057)">Wakad Ward 08 (411057)</option>
              <option value="Maan Village (411057)">Maan Village (411057)</option>
              <option value="Marunji Village (411057)">Marunji Village (411057)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Survey Unit
            </label>
            <select
              value={surveyUnit}
              onChange={(e) => setSurveyUnit(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px'
              }}
            >
              <option value="">All Survey Units</option>
              <option value="Survey Unit 01 - 348671">Survey Unit 01 - 348671 (Phase 1)</option>
              <option value="Survey Unit 02 - 348672">Survey Unit 02 - 348672 (Blue Ridge)</option>
              <option value="Survey Unit 03 - 348673">Survey Unit 03 - 348673 (Gaothan)</option>
              <option value="Survey Unit 01 - 348661">Survey Unit 01 - 348661 (Wakad)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSearch}
              style={{
                flex: 1,
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Search
            </button>
            <button
              onClick={handleClear}
              style={{
                flex: 1,
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Survey Units Table */}
      <DataTable
        columns={columns}
        data={unitsList}
        searchPlaceholder="Search Survey Units..."
      />

      {/* Survey Unit Real GIS Map View Modal */}
      {activeUnitForMap && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '1000px',
            overflow: 'hidden',
            boxShadow: '0 20px 25px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>
                  {activeUnitForMap.surveyUnit} — {activeUnitForMap.ward}
                </h3>
                <div style={{ fontSize: '11px', color: '#bfdbfe', marginTop: '2px' }}>
                  Assigned Surveyor: <b>{activeUnitForMap.assignedTo}</b> | Upload Status: <b>{activeUnitForMap.isMapUploaded}</b>
                </div>
              </div>
              <button
                onClick={() => setActiveUnitForMap(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '16px' }}>
              <GisMap
                height="520px"
                showCadastral={true}
                showDronePath={true}
                showTaxPoints={true}
                title={`Cadastral Survey Map • ${activeUnitForMap.surveyUnit}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
