import React, { useState } from 'react';
import { Plus, Search, MapPin, CheckCircle, FileSpreadsheet, Eye } from 'lucide-react';

interface SurveyUnitItem {
  id: string;
  sNo: number;
  ward: string;
  surveyUnitCode: string;
  surveyUnitName: string;
  assignedCommittee: string;
  targetPlots: number;
  status: 'Created' | 'In Progress' | 'Completed';
  createdOn: string;
}

const INITIAL_UNITS: SurveyUnitItem[] = [
  {
    id: 'su-1',
    sNo: 1,
    ward: 'Ward 12 - Hinjawadi Phase 1',
    surveyUnitCode: 'SU-HINJ-01',
    surveyUnitName: 'I²IT & Rajiv Gandhi Infotech Park Sector',
    assignedCommittee: 'Hinjawadi Phase 1 Survey Committee',
    targetPlots: 120,
    status: 'In Progress',
    createdOn: '29/07/2025 11:40:30 AM'
  },
  {
    id: 'su-2',
    sNo: 2,
    ward: 'Ward 24 - Baner-Balewadi',
    surveyUnitCode: 'SU-BANER-02',
    surveyUnitName: 'Balewadi High Street & Sports Complex Sector',
    assignedCommittee: 'Baner-Balewadi Survey Committee',
    targetPlots: 95,
    status: 'In Progress',
    createdOn: '06/08/2025 02:15:10 PM'
  },
  {
    id: 'su-3',
    sNo: 3,
    ward: 'Ward 36 - Kothrud',
    surveyUnitCode: 'SU-KOTH-03',
    surveyUnitName: 'Mayur Colony & Paud Road Sector',
    assignedCommittee: 'Kothrud Ward Survey Committee',
    targetPlots: 140,
    status: 'Created',
    createdOn: '15/08/2025 10:20:45 AM'
  },
  {
    id: 'su-4',
    sNo: 4,
    ward: 'Ward 42 - Shivajinagar',
    surveyUnitCode: 'SU-SHIV-04',
    surveyUnitName: 'FC Road & Model Colony Sector',
    assignedCommittee: 'Shivajinagar Central Committee',
    targetPlots: 110,
    status: 'Completed',
    createdOn: '20/08/2025 04:50:12 PM'
  }
];

export const UlbCreateSurveyUnitPage: React.FC = () => {
  const [units, setUnits] = useState<SurveyUnitItem[]>(INITIAL_UNITS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ward, setWard] = useState('Ward 12 - Hinjawadi Phase 1');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [committee, setCommittee] = useState('Hinjawadi Phase 1 Survey Committee');
  const [targetPlots, setTargetPlots] = useState('100');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newUnit: SurveyUnitItem = {
      id: `su-${Date.now()}`,
      sNo: units.length + 1,
      ward,
      surveyUnitCode: code || `SU-PUNE-${units.length + 1}`,
      surveyUnitName: name || 'New Survey Unit Zone',
      assignedCommittee: committee,
      targetPlots: parseInt(targetPlots) || 50,
      status: 'Created',
      createdOn: new Date().toLocaleString()
    };
    setUnits(prev => [newUnit, ...prev]);
    setIsModalOpen(false);
    setCode('');
    setName('');
  };

  const filtered = units.filter(u => 
    u.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.surveyUnitCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.surveyUnitName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c', fontWeight: 600 }}>Home</span>
        <span>›</span>
        <span>Create Survey Unit</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            Create / Manage Survey Unit
          </h2>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Jurisdiction: Maharashtra &bull; District: Pune &bull; ULB: PMRDA Pune (270410)
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#1b539c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(27,83,156,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={16} />
          <span>Create Survey Unit</span>
        </button>
      </div>

      {/* Table Card */}
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
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search survey units..."
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

          <div style={{ fontSize: '12.5px', color: '#64748b' }}>
            Total Survey Units: <b style={{ color: '#0f172a' }}>{units.length}</b>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#2563eb', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>S.No</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Ward / Sector</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Survey Unit Code</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Survey Unit Name</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Assigned Committee</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Target Plots</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Created On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                  }}
                >
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{u.sNo}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{u.ward}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1b539c' }}>{u.surveyUnitCode}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{u.surveyUnitName}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{u.assignedCommittee}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>{u.targetPlots}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: u.status === 'Completed' ? '#dcfce7' : u.status === 'In Progress' ? '#e0f2fe' : '#fef3c7',
                      color: u.status === 'Completed' ? '#166534' : u.status === 'In Progress' ? '#0369a1' : '#b45309'
                    }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '12px' }}>{u.createdOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 800
            }}>
              <span>Create Survey Unit</span>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Select Ward / Area *
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="Ward 12 - Hinjawadi Phase 1">Ward 12 - Hinjawadi Phase 1</option>
                  <option value="Ward 24 - Baner-Balewadi">Ward 24 - Baner-Balewadi</option>
                  <option value="Ward 36 - Kothrud">Ward 36 - Kothrud</option>
                  <option value="Ward 42 - Shivajinagar">Ward 42 - Shivajinagar</option>
                  <option value="Ward 55 - Viman Nagar">Ward 55 - Viman Nagar</option>
                  <option value="Ward 68 - Hadapsar">Ward 68 - Hadapsar</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Survey Unit Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SU-HINJ-02"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Survey Unit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infosys Campus & Surrounding Habitation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Assign Committee *
                </label>
                <select
                  value={committee}
                  onChange={(e) => setCommittee(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="Hinjawadi Phase 1 Survey Committee">Hinjawadi Phase 1 Survey Committee</option>
                  <option value="Baner-Balewadi Survey Committee">Baner-Balewadi Survey Committee</option>
                  <option value="Kothrud Ward Survey Committee">Kothrud Ward Survey Committee</option>
                  <option value="Shivajinagar Central Committee">Shivajinagar Central Committee</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Estimated / Target Plots
                </label>
                <input
                  type="number"
                  value={targetPlots}
                  onChange={(e) => setTargetPlots(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1b539c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '9px 20px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Save Survey Unit
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: '#cbd5e1',
                    color: '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '9px 16px',
                    fontWeight: 600,
                    fontSize: '13px',
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
