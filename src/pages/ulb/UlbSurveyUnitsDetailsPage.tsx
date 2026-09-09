import React, { useState } from 'react';
import { Search, FileSpreadsheet, MapPin, CheckCircle, Clock } from 'lucide-react';

interface SurveyUnitDetail {
  id: string;
  sNo: number;
  ulb: string;
  ward: string;
  surveyUnit: string;
  isAssigned: 'Yes' | 'No';
  assignedTo: string;
  isMapUploaded: 'Yes' | 'No';
  mapUploadedOn: string;
}

const INITIAL_DETAILS: SurveyUnitDetail[] = [
  {
    id: 'sud-1',
    sNo: 1,
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 12 - Hinjawadi Phase 1 (411057)',
    surveyUnit: 'Survey Unit 1 (SU-HINJ-01)',
    isAssigned: 'Yes',
    assignedTo: 'Desktop Surveyor PMRDA',
    isMapUploaded: 'Yes',
    mapUploadedOn: '29/07/2025 11:40:30 AM'
  },
  {
    id: 'sud-2',
    sNo: 2,
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 12 - Hinjawadi Phase 1 (411057)',
    surveyUnit: 'Survey Unit 1 (SU-HINJ-01)',
    isAssigned: 'Yes',
    assignedTo: 'Surveyor Sanjay More',
    isMapUploaded: 'Yes',
    mapUploadedOn: '29/07/2025 11:40:30 AM'
  },
  {
    id: 'sud-3',
    sNo: 3,
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 24 - Baner-Balewadi (411045)',
    surveyUnit: 'Survey Unit 2 (SU-BANER-02)',
    isAssigned: 'Yes',
    assignedTo: 'Surveyor Rohan Joshi',
    isMapUploaded: 'Yes',
    mapUploadedOn: '06/08/2025 03:22:15 PM'
  },
  {
    id: 'sud-4',
    sNo: 4,
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 36 - Kothrud (411038)',
    surveyUnit: 'Survey Unit 3 (SU-KOTH-03)',
    isAssigned: 'Yes',
    assignedTo: 'Surveyor Nitin Pawar',
    isMapUploaded: 'No',
    mapUploadedOn: 'Pending Upload'
  },
  {
    id: 'sud-5',
    sNo: 5,
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 42 - Shivajinagar (411005)',
    surveyUnit: 'Survey Unit 4 (SU-SHIV-04)',
    isAssigned: 'Yes',
    assignedTo: 'Surveyor Amit Ghorpade',
    isMapUploaded: 'Yes',
    mapUploadedOn: '18/08/2025 09:14:00 AM'
  },
  {
    id: 'sud-6',
    sNo: 6,
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 55 - Viman Nagar (411014)',
    surveyUnit: 'Survey Unit 5 (SU-VIMAN-05)',
    isAssigned: 'No',
    assignedTo: 'Unassigned',
    isMapUploaded: 'No',
    mapUploadedOn: 'Pending'
  }
];

export const UlbSurveyUnitsDetailsPage: React.FC = () => {
  const [details] = useState<SurveyUnitDetail[]>(INITIAL_DETAILS);
  const [selectedWard, setSelectedWard] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = details.filter(item => {
    const matchWard = selectedWard !== 'All' ? item.ward.includes(selectedWard) : true;
    const matchSearch = searchQuery ? item.surveyUnit.toLowerCase().includes(searchQuery.toLowerCase()) || item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchWard && matchSearch;
  });

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Breadcrumb matching frame 530s */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c', fontWeight: 600 }}>Home</span>
        <span>›</span>
        <span>Survey Unit Details</span>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
        Survey Unit Details
      </h2>

      {/* Filter Bar Card matching video frame 530s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1.5fr 1.5fr 1fr auto auto',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
              Select State *
            </label>
            <input
              type="text"
              readOnly
              value="Maharashtra"
              style={{ width: '100%', padding: '8px 10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
              District *
            </label>
            <input
              type="text"
              readOnly
              value="Pune"
              style={{ width: '100%', padding: '8px 10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
              Urban Local Body (ULB) *
            </label>
            <select
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px', backgroundColor: '#ffffff' }}
            >
              <option>PMRDA Pune - 270410</option>
              <option>PMC Pune - 270411</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
              Ward / Village / Colony
            </label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px', backgroundColor: '#ffffff' }}
            >
              <option value="All">All Wards</option>
              <option value="Hinjawadi">Ward 12 - Hinjawadi Phase 1</option>
              <option value="Baner">Ward 24 - Baner-Balewadi</option>
              <option value="Kothrud">Ward 36 - Kothrud</option>
              <option value="Shivajinagar">Ward 42 - Shivajinagar</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
              Survey Unit
            </label>
            <select
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12.5px', backgroundColor: '#ffffff' }}
            >
              <option value="All">All Units</option>
              <option value="SU-HINJ-01">Survey Unit 1</option>
              <option value="SU-BANER-02">Survey Unit 2</option>
            </select>
          </div>

          <button
            style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 18px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Search
          </button>

          <button
            onClick={() => { setSelectedWard('All'); setSearchQuery(''); }}
            style={{
              backgroundColor: '#cbd5e1',
              color: '#334155',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 16px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table Section matching frame 540s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                fontSize: '13px'
              }}
            />
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <FileSpreadsheet size={15} />
            <span>Export Excel</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#2563eb', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>S.No</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ULB</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Ward</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Survey Unit</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Is Assigned</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Assigned To</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Is Map Uploaded</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Map Uploaded on</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                  }}
                >
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{row.sNo}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{row.ulb}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{row.ward}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1b539c' }}>{row.surveyUnit}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: row.isAssigned === 'Yes' ? '#dcfce7' : '#fef3c7',
                      color: row.isAssigned === 'Yes' ? '#166534' : '#b45309',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {row.isAssigned}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1e293b' }}>{row.assignedTo}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: row.isMapUploaded === 'Yes' ? '#dcfce7' : '#fee2e2',
                      color: row.isMapUploaded === 'Yes' ? '#166534' : '#991b1b',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {row.isMapUploaded}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '12px' }}>{row.mapUploadedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '16px',
          fontSize: '12px',
          color: '#64748b',
          borderTop: '1px solid #f1f5f9'
        }}>
          <span>Items per page: 10</span>
          <span>1 - {filtered.length} of {filtered.length}</span>
        </div>
      </div>
    </div>
  );
};
