import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Send, CheckCircle, FileCheck, FileSpreadsheet } from 'lucide-react';

interface PublicationItem {
  id: string;
  villageColony: string;
  surveyUnit: string;
  totalPlots: number;
  gtCompleted: number;
  gtPending: number;
  rorCompleted: number;
  rorPending: number;
  caseNumber: string;
  firstPublicationRecord: string;
  finalPublicationRecord: string;
  status: string;
  remark: string;
}

const INITIAL_PUBLICATIONS: PublicationItem[] = [
  {
    id: 'pub-1',
    villageColony: 'Ward 12 - Hinjawadi Phase 1 (PMRDA)',
    surveyUnit: 'PPCRC Institutional & Tech Complex (CTS 342/1)',
    totalPlots: 24,
    gtCompleted: 24,
    gtPending: 0,
    rorCompleted: 24,
    rorPending: 0,
    caseNumber: 'PMRDA/3D-SURVEY/2026/0410',
    firstPublicationRecord: '22-09-2026',
    finalPublicationRecord: '-',
    status: 'Verified by Surveyor (Ready for BhuNaksha Transmission)',
    remark: 'Verified by Superintending Officer Dr. Rajesh Deshmukh & 3D Model Attached'
  },
  {
    id: 'pub-2',
    villageColony: 'Ward 24 - Baner-Balewadi',
    surveyUnit: 'Survey Unit 2 (SU-BANER-02)',
    totalPlots: 45,
    gtCompleted: 45,
    gtPending: 0,
    rorCompleted: 42,
    rorPending: 3,
    caseNumber: '24/PMC/2025',
    firstPublicationRecord: '15-06-2025',
    finalPublicationRecord: '28-07-2025',
    status: 'Published',
    remark: 'Gazette notification issued'
  },
  {
    id: 'pub-3',
    villageColony: 'Ward 36 - Kothrud',
    surveyUnit: 'Survey Unit 3 (SU-KOTH-03)',
    totalPlots: 52,
    gtCompleted: 30,
    gtPending: 22,
    rorCompleted: 28,
    rorPending: 24,
    caseNumber: '36/PMC/2025',
    firstPublicationRecord: '20-07-2025',
    finalPublicationRecord: '-',
    status: 'Received For Provisional Publication',
    remark: 'Notice sent to ward office'
  }
];

export const UlbManagePublicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [publications] = useState<PublicationItem[]>(INITIAL_PUBLICATIONS);
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState('All');

  const handleVerifyAndPublish = (item: PublicationItem) => {
    navigate('/ulb/urban-survey-publication/urban-survey-first-publication', { state: { item } });
  };

  const filtered = publications.filter(p => {
    const matchWard = selectedWard !== 'All' ? p.villageColony.includes(selectedWard) : true;
    const matchUnit = selectedUnit !== 'All' ? p.surveyUnit.includes(selectedUnit) : true;
    return matchWard && matchUnit;
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
      {/* Breadcrumb matching frame 560s */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c' }}>Home</span>
        <span>›</span>
        <span style={{ fontWeight: 600 }}>Manage Publication</span>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
        Manage Publication
      </h2>

      {/* Filter Bar Card matching video frame 560s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.5fr 2fr 1.5fr auto auto',
          gap: '14px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              District
            </label>
            <input
              type="text"
              readOnly
              value="Pune"
              style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Urban Local Body (ULB)
            </label>
            <select
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option>PMRDA Pune - 270410</option>
              <option>PMC Pune - 270411</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Ward / Village / Colony
            </label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="All">Select Ward / Colony</option>
              <option value="Hinjawadi">Ward 12 - Hinjawadi Phase 1</option>
              <option value="Baner">Ward 24 - Baner-Balewadi</option>
              <option value="Kothrud">Ward 36 - Kothrud</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Survey Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="All">Select Survey Unit</option>
              <option value="SU-HINJ-01">Survey Unit 1</option>
              <option value="SU-BANER-02">Survey Unit 2</option>
              <option value="SU-KOTH-03">Survey Unit 3</option>
            </select>
          </div>

          <button
            style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 24px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Search
          </button>

          <button
            onClick={() => { setSelectedWard('All'); setSelectedUnit('All'); }}
            style={{
              backgroundColor: '#cbd5e1',
              color: '#334155',
              border: 'none',
              borderRadius: '6px',
              padding: '9px 20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Publication Registry Table matching frame 560s / 605s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ backgroundColor: '#2563eb', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Village/Colony</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Survey Unit</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Total Plots</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>GT Completed</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>GT Pending</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>RoR Completed</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>RoR Pending</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Case Number</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>First Publication</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Final Publication</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Remark</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                  }}
                >
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{item.villageColony}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1b539c' }}>{item.surveyUnit}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>{item.totalPlots}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>{item.gtCompleted}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: '#ca8a04', fontWeight: 700 }}>{item.gtPending}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>{item.rorCompleted}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: '#ea580c', fontWeight: 700 }}>{item.rorPending}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{item.caseNumber}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{item.firstPublicationRecord}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{item.finalPublicationRecord}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      backgroundColor: item.status.includes('Published') ? '#dcfce7' : '#e0f2fe',
                      color: item.status.includes('Published') ? '#166534' : '#0369a1',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{item.remark}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleVerifyAndPublish(item)}
                        style={{
                          backgroundColor: '#1b539c',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '7px 16px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 5px rgba(27,83,156,0.2)'
                        }}
                      >
                        <Send size={13} />
                        <span>Verify & Publish</span>
                      </button>
                      <button
                        title="Refresh status"
                        style={{
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '7px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        <RefreshCw size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
