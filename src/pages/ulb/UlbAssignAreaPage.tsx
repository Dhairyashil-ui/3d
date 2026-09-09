import React, { useState } from 'react';
import { Search, Plus, Edit3, Eye, FileSpreadsheet, X, CheckCircle } from 'lucide-react';

interface AreaAssignment {
  id: string;
  sNo: number;
  userName: string;
  district: string;
  ulb: string;
  ward: string;
  surveyUnits: string[];
  assignedDate: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_ASSIGNMENTS: AreaAssignment[] = [
  {
    id: 'area-1',
    sNo: 1,
    userName: 'Sanjay More',
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 12 - Hinjawadi Phase 1',
    surveyUnits: ['SU-HINJ-01'],
    assignedDate: '07-07-2025',
    status: 'Active'
  },
  {
    id: 'area-2',
    sNo: 2,
    userName: 'Pooja Kulkarni',
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 12 - Hinjawadi Phase 1',
    surveyUnits: ['SU-HINJ-01', 'SU-HINJ-02'],
    assignedDate: '25-06-2025',
    status: 'Active'
  },
  {
    id: 'area-3',
    sNo: 3,
    userName: 'Rohan Joshi',
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 24 - Baner-Balewadi',
    surveyUnits: ['SU-BANER-02'],
    assignedDate: '25-06-2025',
    status: 'Active'
  },
  {
    id: 'area-4',
    sNo: 4,
    userName: 'Nitin Pawar',
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 36 - Kothrud',
    surveyUnits: ['SU-KOTH-03'],
    assignedDate: '25-06-2025',
    status: 'Active'
  },
  {
    id: 'area-5',
    sNo: 5,
    userName: 'Amit Ghorpade',
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 42 - Shivajinagar',
    surveyUnits: ['SU-SHIV-04'],
    assignedDate: '16-07-2025',
    status: 'Active'
  },
  {
    id: 'area-6',
    sNo: 6,
    userName: 'Vijay Kamble',
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    ward: 'Ward 55 - Viman Nagar',
    surveyUnits: ['SU-VIMAN-05'],
    assignedDate: '29-07-2025',
    status: 'Active'
  }
];

export const UlbAssignAreaPage: React.FC = () => {
  const [assignments, setAssignments] = useState<AreaAssignment[]>(INITIAL_ASSIGNMENTS);
  const [searchUlb, setSearchUlb] = useState('');
  const [searchWard, setSearchWard] = useState('');
  const [query, setQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState('Sanjay More');
  const [selectedUlb, setSelectedUlb] = useState('PMRDA Pune - 270410');
  const [selectedWard, setSelectedWard] = useState('Ward 12 - Hinjawadi Phase 1');
  const [selectedUnits, setSelectedUnits] = useState<string[]>(['SU-HINJ-01']);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [remark, setRemark] = useState('');
  const [viewItem, setViewItem] = useState<AreaAssignment | null>(null);

  const handleOpenAssign = () => {
    setIsEditing(false);
    setEditId(null);
    setSelectedUser('Sanjay More');
    setSelectedUlb('PMRDA Pune - 270410');
    setSelectedWard('Ward 12 - Hinjawadi Phase 1');
    setSelectedUnits(['SU-HINJ-01']);
    setStatus('Active');
    setRemark('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: AreaAssignment) => {
    setIsEditing(true);
    setEditId(rec.id);
    setSelectedUser(rec.userName);
    setSelectedUlb(rec.ulb);
    setSelectedWard(rec.ward);
    setSelectedUnits(rec.surveyUnits);
    setStatus(rec.status);
    setRemark('');
    setModalOpen(true);
  };

  const handleToggleUnit = (unitCode: string) => {
    if (selectedUnits.includes(unitCode)) {
      setSelectedUnits(selectedUnits.filter(u => u !== unitCode));
    } else {
      setSelectedUnits([...selectedUnits, unitCode]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editId) {
      setAssignments(prev => prev.map(a => {
        if (a.id === editId) {
          return {
            ...a,
            userName: selectedUser,
            ulb: selectedUlb,
            ward: selectedWard,
            surveyUnits: selectedUnits,
            status
          };
        }
        return a;
      }));
    } else {
      const newA: AreaAssignment = {
        id: `area-${Date.now()}`,
        sNo: assignments.length + 1,
        userName: selectedUser,
        district: 'Pune',
        ulb: selectedUlb,
        ward: selectedWard,
        surveyUnits: selectedUnits,
        assignedDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        status
      };
      setAssignments(prev => [newA, ...prev]);
    }
    setModalOpen(false);
  };

  const filtered = assignments.filter(a => {
    const matchUlb = searchUlb ? a.ulb.toLowerCase().includes(searchUlb.toLowerCase()) : true;
    const matchWard = searchWard ? a.ward.toLowerCase().includes(searchWard.toLowerCase()) : true;
    const matchQuery = query ? a.userName.toLowerCase().includes(query.toLowerCase()) || a.ward.toLowerCase().includes(query.toLowerCase()) : true;
    return matchUlb && matchWard && matchQuery;
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
      {/* Breadcrumb */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c' }}>Home</span>
        <span>›</span>
        <span>User Management</span>
        <span>›</span>
        <span style={{ fontWeight: 600 }}>Assign Area To User</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          Assign Area To User
        </h2>
        <button
          onClick={handleOpenAssign}
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
          <span>Assign Area</span>
        </button>
      </div>

      {/* Filter Bar Card matching video frame 480s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 2fr auto auto',
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
              Search By ULB
            </label>
            <select
              value={searchUlb}
              onChange={(e) => setSearchUlb(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="">Choose ULB</option>
              <option value="PMRDA Pune">PMRDA Pune - 270410</option>
              <option value="PMC">PMC Pune - 270411</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Ward / Village / Colony
            </label>
            <select
              value={searchWard}
              onChange={(e) => setSearchWard(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="">Choose Ward/Village/Colony</option>
              <option value="Hinjawadi">Ward 12 - Hinjawadi Phase 1</option>
              <option value="Baner">Ward 24 - Baner-Balewadi</option>
              <option value="Kothrud">Ward 36 - Kothrud</option>
              <option value="Shivajinagar">Ward 42 - Shivajinagar</option>
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
            onClick={() => { setSearchUlb(''); setSearchWard(''); setQuery(''); }}
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

      {/* Table Section matching frame 480s */}
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>User Name</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>District</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ULB</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Ward</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Assigned Date</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Status</th>
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
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{item.sNo}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{item.userName}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{item.district}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{item.ulb}</td>
                  <td style={{ padding: '12px 14px', color: '#1b539c', fontWeight: 600 }}>{item.ward}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '12px' }}>{item.assignedDate}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: item.status === 'Active' ? '#dcfce7' : '#fee2e2',
                      color: item.status === 'Active' ? '#166534' : '#991b1b',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        title="Edit Area"
                        onClick={() => handleOpenEdit(item)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        title="View Info"
                        onClick={() => setViewItem(item)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0284c7' }}
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
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

      {/* ASSIGN AREA MODAL matching video frame 500s */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
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
            maxWidth: '750px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
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
              <span>Assign Area To User</span>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>District *</label>
                  <input type="text" readOnly value="Pune" style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>User *</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="Sanjay More">Sanjay More</option>
                    <option value="Pooja Kulkarni">Pooja Kulkarni</option>
                    <option value="Rohan Joshi">Rohan Joshi</option>
                    <option value="Nitin Pawar">Nitin Pawar</option>
                    <option value="Amit Ghorpade">Amit Ghorpade</option>
                    <option value="Vijay Kamble">Vijay Kamble</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>ULB *</label>
                  <select
                    value={selectedUlb}
                    onChange={(e) => setSelectedUlb(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="PMRDA Pune - 270410">PMRDA Pune - 270410</option>
                    <option value="PMC Pune - 270411">PMC Pune - 270411</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Ward/Village/Colony *</label>
                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="Ward 12 - Hinjawadi Phase 1">Ward 12 - Hinjawadi Phase 1</option>
                    <option value="Ward 24 - Baner-Balewadi">Ward 24 - Baner-Balewadi</option>
                    <option value="Ward 36 - Kothrud">Ward 36 - Kothrud</option>
                    <option value="Ward 42 - Shivajinagar">Ward 42 - Shivajinagar</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Multi-select badges for Survey Unit matching video frame 500s */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Survey Unit *
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                  {['SU-HINJ-01', 'SU-HINJ-02', 'SU-BANER-02', 'SU-KOTH-03', 'SU-SHIV-04'].map(code => {
                    const isSelected = selectedUnits.includes(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleToggleUnit(code)}
                        style={{
                          backgroundColor: isSelected ? '#1b539c' : '#e2e8f0',
                          color: isSelected ? '#ffffff' : '#334155',
                          border: 'none',
                          borderRadius: '16px',
                          padding: '5px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{code}</span>
                        <span>{isSelected ? '✕' : '+'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Remark</label>
                <textarea
                  rows={2}
                  placeholder="Enter remarks..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="submit" style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>
                  Update
                </button>
                <button type="button" onClick={() => setModalOpen(false)} style={{ backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '6px', padding: '10px 18px', fontWeight: 600, cursor: 'pointer' }}>
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
