import React, { useState } from 'react';
import { Search, Plus, Edit3, Eye, FileSpreadsheet, X, CheckCircle } from 'lucide-react';

interface DepartmentRecord {
  id: string;
  sNo: number;
  department: string;
  description: string;
  createdBy: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_DEPARTMENTS: DepartmentRecord[] = [
  {
    id: 'dept-1',
    sNo: 1,
    department: 'PMRDA Town Planning & GIS Cell',
    description: 'Urban planning, land development control, and cadastral GIS integration',
    createdBy: 'ULB Pune Admin',
    createdDate: '23-07-2025',
    status: 'Active'
  },
  {
    id: 'dept-2',
    sNo: 2,
    department: 'Directorate of Settlement and Land Records',
    description: 'Cadastral land measurement, CTS survey, and revenue boundary demarcation',
    createdBy: 'State Admin Maharashtra',
    createdDate: '05-06-2025',
    status: 'Active'
  },
  {
    id: 'dept-3',
    sNo: 3,
    department: 'Pune Municipal Corporation (PMC) Revenue Cell',
    description: 'Property taxation, assessment, and urban land titles',
    createdBy: 'State Admin Maharashtra',
    createdDate: '17-07-2025',
    status: 'Active'
  },
  {
    id: 'dept-4',
    sNo: 4,
    department: 'District Administration Pune (Collectorate)',
    description: 'Revenue authority, non-agricultural permissions, and land acquisitions',
    createdBy: 'Pune District Admin',
    createdDate: '21-07-2025',
    status: 'Active'
  },
  {
    id: 'dept-5',
    sNo: 5,
    department: 'Maharashtra Remote Sensing Application Centre (MRSAC)',
    description: 'Satellite imagery verification and drone orthomosaic generation',
    createdBy: 'State Admin Maharashtra',
    createdDate: '21-07-2025',
    status: 'Active'
  },
  {
    id: 'dept-6',
    sNo: 6,
    department: 'PMRDA Engineering & Infrastructure Cell',
    description: 'Right-of-way, road reservations, and utility network mapping',
    createdBy: 'ULB Pune Admin',
    createdDate: '28-07-2025',
    status: 'Active'
  }
];

export const UlbManageDepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentRecord[]>(INITIAL_DEPARTMENTS);
  const [searchDept, setSearchDept] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [query, setQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deptName, setDeptName] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewRecord, setViewRecord] = useState<DepartmentRecord | null>(null);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setDeptName('');
    setDesc('');
    setStatus('Active');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: DepartmentRecord) => {
    setIsEditing(true);
    setEditId(rec.id);
    setDeptName(rec.department);
    setDesc(rec.description);
    setStatus(rec.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editId) {
      setDepartments(prev => prev.map(d => {
        if (d.id === editId) {
          return { ...d, department: deptName, description: desc, status };
        }
        return d;
      }));
    } else {
      const newD: DepartmentRecord = {
        id: `dept-${Date.now()}`,
        sNo: departments.length + 1,
        department: deptName,
        description: desc,
        createdBy: 'ULB Pune Admin',
        createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        status
      };
      setDepartments(prev => [newD, ...prev]);
    }
    setModalOpen(false);
    setShowSuccess(true);
  };

  const filtered = departments.filter(d => {
    const matchDept = searchDept ? d.department.toLowerCase().includes(searchDept.toLowerCase()) : true;
    const matchStatus = statusFilter !== 'All' ? d.status === statusFilter : true;
    const matchQuery = query ? d.department.toLowerCase().includes(query.toLowerCase()) || d.description.toLowerCase().includes(query.toLowerCase()) : true;
    return matchDept && matchStatus && matchQuery;
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
        <span style={{ fontWeight: 600 }}>Create/Manage Department</span>
      </div>

      {/* Header with Title and Create Button matching frame 210s */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          Create/Manage Department
        </h2>
        <button
          onClick={handleOpenCreate}
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
          <span>Create New Department</span>
        </button>
      </div>

      {/* Filter Bar Card matching video frame 210s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr auto auto',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Search By Department Name
            </label>
            <input
              type="text"
              placeholder="Enter Department Name"
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Select Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="All">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
            onClick={() => { setSearchDept(''); setStatusFilter('All'); setQuery(''); }}
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

      {/* Table Section matching frame 230s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {/* Search & Excel bar */}
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

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#2563eb', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>S.No</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Department</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Created By</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Created Date</th>
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
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{item.department}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{item.description}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{item.createdBy}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{item.createdDate}</td>
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
                      {item.createdBy.includes('ULB') && (
                        <button
                          title="Edit Department"
                          onClick={() => handleOpenEdit(item)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
                        >
                          <Edit3 size={15} />
                        </button>
                      )}
                      <button
                        title="View Department"
                        onClick={() => setViewRecord(item)}
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

        {/* Footer */}
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

      {/* CREATE / UPDATE MODAL matching video frame 240s */}
      {modalOpen && (
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
            maxWidth: '650px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 800
            }}>
              <span>{isEditing ? 'Update Department' : 'Create New Department'}</span>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                  Select State *
                </label>
                <input
                  type="text"
                  readOnly
                  value="Maharashtra"
                  style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PMRDA Urban GIS & Planning Unit"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter department scope and responsibilities..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1b539c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '9px 22px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    backgroundColor: '#cbd5e1',
                    color: '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '9px 16px',
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

      {/* SUCCESS NOTIFICATION POPUP matching frame 240s */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '24px 32px',
            maxWidth: '380px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 30px rgba(0,0,0,0.15)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              <CheckCircle size={28} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Department {isEditing ? 'Updated' : 'Created'} Successfully.
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 24px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewRecord && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', width: '100%', maxWidth: '500px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#1b539c', color: '#ffffff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800 }}>Department Details</span>
              <button onClick={() => setViewRecord(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Department</span>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{viewRecord.department}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Description</span>
                <span>{viewRecord.description}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Created By</span>
                  <span style={{ fontWeight: 600 }}>{viewRecord.createdBy}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Created Date</span>
                  <span style={{ fontWeight: 600 }}>{viewRecord.createdDate}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  onClick={() => setViewRecord(null)}
                  style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer' }}
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
