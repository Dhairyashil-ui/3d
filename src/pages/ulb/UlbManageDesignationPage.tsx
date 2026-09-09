import React, { useState } from 'react';
import { Search, Plus, Edit3, Eye, FileSpreadsheet, X, CheckCircle } from 'lucide-react';

interface DesignationRecord {
  id: string;
  sNo: number;
  designation: string;
  department: string;
  description: string;
  createdBy: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_DESIGNATIONS: DesignationRecord[] = [
  {
    id: 'desig-1',
    sNo: 1,
    designation: 'Assistant Director of Town Planning (ADTP)',
    department: 'PMRDA Town Planning & GIS Cell',
    description: 'Statutory approval of layout plans and cadastral verification',
    createdBy: 'ULB Pune Admin',
    createdDate: '23-07-2025',
    status: 'Active'
  },
  {
    id: 'desig-2',
    sNo: 2,
    designation: 'Cadastral Land Surveyor',
    department: 'Directorate of Settlement and Land Records',
    description: 'Ground truthing, ETS/DGPS boundary survey, and CTS numbering',
    createdBy: 'State Admin Maharashtra',
    createdDate: '05-06-2025',
    status: 'Active'
  },
  {
    id: 'desig-3',
    sNo: 3,
    designation: 'Junior Town Planner',
    department: 'Pune Municipal Corporation (PMC) Revenue Cell',
    description: 'Field inspection of building footprints and plot boundary reconciliation',
    createdBy: 'Pune District Admin',
    createdDate: '27-05-2025',
    status: 'Active'
  },
  {
    id: 'desig-4',
    sNo: 4,
    designation: 'GIS Drone Photogrammetry Specialist',
    department: 'Maharashtra Remote Sensing Application Centre (MRSAC)',
    description: 'High-resolution drone orthomosaic rectification and feature extraction',
    createdBy: 'State Admin Maharashtra',
    createdDate: '24-06-2025',
    status: 'Active'
  },
  {
    id: 'desig-5',
    sNo: 5,
    designation: 'Superintendent of Land Records (SLR)',
    department: 'Directorate of Settlement and Land Records',
    description: 'Appellate authority for property boundary dispute and final publication',
    createdBy: 'ULB Pune Admin',
    createdDate: '04-07-2025',
    status: 'Active'
  }
];

export const UlbManageDesignationPage: React.FC = () => {
  const [designations, setDesignations] = useState<DesignationRecord[]>(INITIAL_DESIGNATIONS);
  const [searchDesig, setSearchDesig] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [query, setQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState('PMRDA Town Planning & GIS Cell');
  const [desigName, setDesigName] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewRecord, setViewRecord] = useState<DesignationRecord | null>(null);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setSelectedDept('PMRDA Town Planning & GIS Cell');
    setDesigName('');
    setDesc('');
    setStatus('Active');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: DesignationRecord) => {
    setIsEditing(true);
    setEditId(rec.id);
    setSelectedDept(rec.department);
    setDesigName(rec.designation);
    setDesc(rec.description);
    setStatus(rec.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editId) {
      setDesignations(prev => prev.map(d => {
        if (d.id === editId) {
          return { ...d, designation: desigName, department: selectedDept, description: desc, status };
        }
        return d;
      }));
    } else {
      const newD: DesignationRecord = {
        id: `desig-${Date.now()}`,
        sNo: designations.length + 1,
        designation: desigName,
        department: selectedDept,
        description: desc,
        createdBy: 'ULB Pune Admin',
        createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        status
      };
      setDesignations(prev => [newD, ...prev]);
    }
    setModalOpen(false);
    setShowSuccess(true);
  };

  const filtered = designations.filter(d => {
    const matchName = searchDesig ? d.designation.toLowerCase().includes(searchDesig.toLowerCase()) : true;
    const matchDept = deptFilter !== 'All' ? d.department === deptFilter : true;
    const matchQuery = query ? d.designation.toLowerCase().includes(query.toLowerCase()) || d.department.toLowerCase().includes(query.toLowerCase()) : true;
    return matchName && matchDept && matchQuery;
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
        <span style={{ fontWeight: 600 }}>Create/Manage Designation</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          Create/Manage Designation
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
          <span>Create Designation</span>
        </button>
      </div>

      {/* Filter Bar Card matching video frame 260s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr auto auto',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Search By Designation Name
            </label>
            <input
              type="text"
              placeholder="Enter Designation"
              value={searchDesig}
              onChange={(e) => setSearchDesig(e.target.value)}
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
              Department Name
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="All">Select Department</option>
              <option value="PMRDA Town Planning & GIS Cell">PMRDA Town Planning & GIS Cell</option>
              <option value="Directorate of Settlement and Land Records">Directorate of Settlement and Land Records</option>
              <option value="Pune Municipal Corporation (PMC) Revenue Cell">Pune Municipal Corporation (PMC) Revenue Cell</option>
              <option value="Maharashtra Remote Sensing Application Centre (MRSAC)">Maharashtra Remote Sensing Application Centre (MRSAC)</option>
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
            onClick={() => { setSearchDesig(''); setDeptFilter('All'); setQuery(''); }}
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

      {/* Table Section */}
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
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Designation</th>
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
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{item.designation}</td>
                  <td style={{ padding: '12px 14px', color: '#1b539c', fontWeight: 600 }}>{item.department}</td>
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
                          title="Edit Designation"
                          onClick={() => handleOpenEdit(item)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
                        >
                          <Edit3 size={15} />
                        </button>
                      )}
                      <button
                        title="View Designation"
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

      {/* CREATE / UPDATE MODAL matching video frame 290s */}
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
              <span>{isEditing ? 'Update Designation' : 'Create Designation'}</span>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                    Select Department *
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="PMRDA Town Planning & GIS Cell">PMRDA Town Planning & GIS Cell</option>
                    <option value="Directorate of Settlement and Land Records">Directorate of Settlement and Land Records</option>
                    <option value="Pune Municipal Corporation (PMC) Revenue Cell">Pune Municipal Corporation (PMC) Revenue Cell</option>
                    <option value="Maharashtra Remote Sensing Application Centre (MRSAC)">Maharashtra Remote Sensing Application Centre (MRSAC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assistant Director of Town Planning"
                  value={desigName}
                  onChange={(e) => setDesigName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter designation duties and clearance level..."
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

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '24px 32px', maxWidth: '380px', width: '90%', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <CheckCircle size={28} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Designation {isEditing ? 'Updated' : 'Created'} Successfully.
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              style={{ backgroundColor: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 700, cursor: 'pointer' }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewRecord && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', width: '100%', maxWidth: '500px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#1b539c', color: '#ffffff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800 }}>Designation Details</span>
              <button onClick={() => setViewRecord(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Designation</span>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{viewRecord.designation}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Department</span>
                <span style={{ fontWeight: 600, color: '#1b539c' }}>{viewRecord.department}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Description</span>
                <span>{viewRecord.description}</span>
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
