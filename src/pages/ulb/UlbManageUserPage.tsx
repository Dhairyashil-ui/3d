import React, { useState } from 'react';
import { Search, Plus, Edit3, Eye, FileSpreadsheet, X, CheckCircle } from 'lucide-react';

interface UserRecord {
  id: string;
  sNo: number;
  district: string;
  name: string;
  email: string;
  mobile: string;
  department: string;
  designation: string;
  roles: string;
  actionDate: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'usr-1',
    sNo: 1,
    district: 'Pune',
    name: 'Rajesh Deshmukh',
    email: 'rajesh.deshmukh@maharashtra.gov.in',
    mobile: '9822019921',
    department: 'District Administration Pune (Collectorate)',
    designation: 'Additional Collector',
    roles: 'Committee_Head',
    actionDate: '29-07-2025',
    status: 'Active'
  },
  {
    id: 'usr-2',
    sNo: 2,
    district: 'Pune',
    name: 'Snehal Patil',
    email: 'snehal.patil@pmc.gov.in',
    mobile: '9822143211',
    department: 'Pune Municipal Corporation (PMC) Revenue Cell',
    designation: 'Assistant Director of Town Planning (ADTP)',
    roles: 'ULB_Pune_Officer',
    actionDate: '21-07-2025',
    status: 'Active'
  },
  {
    id: 'usr-3',
    sNo: 3,
    district: 'Pune',
    name: 'Sanjay More',
    email: 'sanjay.more@maharashtra.gov.in',
    mobile: '9822014521',
    department: 'Directorate of Settlement and Land Records',
    designation: 'Cadastral Land Surveyor',
    roles: 'Cadastral_Surveyor_Pune',
    actionDate: '19-06-2025',
    status: 'Active'
  },
  {
    id: 'usr-4',
    sNo: 4,
    district: 'Pune',
    name: 'Pooja Kulkarni',
    email: 'pooja.k@maharashtra.gov.in',
    mobile: '9822098712',
    department: 'PMRDA Town Planning & GIS Cell',
    designation: 'GIS Drone Photogrammetry Specialist',
    roles: 'Cadastral_Surveyor_Pune',
    actionDate: '06-06-2025',
    status: 'Active'
  },
  {
    id: 'usr-5',
    sNo: 5,
    district: 'Pune',
    name: 'Rohan Joshi',
    email: 'rohan.j@pmc.gov.in',
    mobile: '9823145621',
    department: 'Pune Municipal Corporation (PMC) Revenue Cell',
    designation: 'Junior Town Planner',
    roles: 'Town_Planner_Assistant',
    actionDate: '06-06-2025',
    status: 'Active'
  },
  {
    id: 'usr-6',
    sNo: 6,
    district: 'Pune',
    name: 'Nitin Pawar',
    email: 'nitin.p@maharashtra.gov.in',
    mobile: '9823908123',
    department: 'Directorate of Settlement and Land Records',
    designation: 'Cadastral Land Surveyor',
    roles: 'Cadastral_Surveyor_Pune',
    actionDate: '21-07-2025',
    status: 'Active'
  }
];

export const UlbManageUserPage: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [searchDesig, setSearchDesig] = useState('');
  const [query, setQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [department, setDepartment] = useState('PMRDA Town Planning & GIS Cell');
  const [designation, setDesignation] = useState('Cadastral Land Surveyor');
  const [remark, setRemark] = useState('');
  const [viewRecord, setViewRecord] = useState<UserRecord | null>(null);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setMobile('');
    setDepartment('PMRDA Town Planning & GIS Cell');
    setDesignation('Cadastral Land Surveyor');
    setRemark('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: UserRecord) => {
    setIsEditing(true);
    setEditId(rec.id);
    const parts = rec.name.split(' ');
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' ') || '');
    setEmail(rec.email);
    setMobile(rec.mobile);
    setDepartment(rec.department);
    setDesignation(rec.designation);
    setRemark('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    if (isEditing && editId) {
      setUsers(prev => prev.map(u => {
        if (u.id === editId) {
          return {
            ...u,
            name: fullName,
            email,
            mobile,
            department,
            designation
          };
        }
        return u;
      }));
    } else {
      const newU: UserRecord = {
        id: `usr-${Date.now()}`,
        sNo: users.length + 1,
        district: 'Pune',
        name: fullName,
        email,
        mobile,
        department,
        designation,
        roles: 'Cadastral_Surveyor_Pune',
        actionDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        status: 'Active'
      };
      setUsers(prev => [newU, ...prev]);
    }
    setModalOpen(false);
  };

  const filtered = users.filter(u => {
    const matchName = searchName ? u.name.toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchDept = searchDept ? u.department.toLowerCase().includes(searchDept.toLowerCase()) : true;
    const matchDesig = searchDesig ? u.designation.toLowerCase().includes(searchDesig.toLowerCase()) : true;
    const matchQuery = query ? u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()) : true;
    return matchName && matchDept && matchDesig && matchQuery;
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
        <span style={{ fontWeight: 600 }}>Create/Manage User</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          Create/Manage User
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
          <span>Create User</span>
        </button>
      </div>

      {/* Filter Bar Card matching video frame 380s / 410s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1.5fr 1.5fr auto auto',
          gap: '14px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Search By Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Search By Department
            </label>
            <select
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="">Select Department</option>
              <option value="PMRDA">PMRDA Town Planning</option>
              <option value="Land Records">Land Records</option>
              <option value="PMC">Pune Municipal Corp</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Search By Designation
            </label>
            <select
              value={searchDesig}
              onChange={(e) => setSearchDesig(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="">Select Designation</option>
              <option value="Surveyor">Surveyor</option>
              <option value="Planner">Planner</option>
              <option value="Collector">Collector</option>
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
            onClick={() => { setSearchName(''); setSearchDept(''); setSearchDesig(''); setQuery(''); }}
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

      {/* Table Section matching frame 410s */}
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
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>District</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Mobile</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Department</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Designation</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Roles</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Action Date</th>
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
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{item.district}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1b539c' }}>{item.name}</td>
                  <td style={{ padding: '12px 14px', color: '#475569', fontSize: '12px' }}>{item.email}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{item.mobile}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{item.department}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{item.designation}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#7c3aed' }}>{item.roles}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '12px' }}>{item.actionDate}</td>
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
                        title="Edit User"
                        onClick={() => handleOpenEdit(item)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        title="View User"
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

      {/* CREATE / UPDATE MODAL matching video frame 380s */}
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
            maxWidth: '850px',
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
              <span>{isEditing ? 'Update User' : 'Create User'}</span>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Email Id *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter official email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10 digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    Select District *
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Pune"
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Select Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="PMRDA Town Planning & GIS Cell">PMRDA Town Planning & GIS Cell</option>
                    <option value="Directorate of Settlement and Land Records">Directorate of Settlement and Land Records</option>
                    <option value="Pune Municipal Corporation (PMC) Revenue Cell">Pune Municipal Corporation (PMC) Revenue Cell</option>
                    <option value="District Administration Pune (Collectorate)">District Administration Pune (Collectorate)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Select Designation *
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="Cadastral Land Surveyor">Cadastral Land Surveyor</option>
                    <option value="Junior Town Planner">Junior Town Planner</option>
                    <option value="Assistant Director of Town Planning (ADTP)">Assistant Director of Town Planning (ADTP)</option>
                    <option value="GIS Drone Photogrammetry Specialist">GIS Drone Photogrammetry Specialist</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Remark
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter remarks or authorization reference..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1b539c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 24px',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer'
                  }}
                >
                  {isEditing ? 'Update' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    backgroundColor: '#cbd5e1',
                    color: '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 18px',
                    fontWeight: 600,
                    fontSize: '13.5px',
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

      {/* VIEW MODAL */}
      {viewRecord && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', width: '100%', maxWidth: '540px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#1b539c', color: '#ffffff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800 }}>User Profile</span>
              <button onClick={() => setViewRecord(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#1b539c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px' }}>
                  {viewRecord.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>{viewRecord.name}</div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>{viewRecord.designation}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Email</span>
                  <span style={{ fontWeight: 600 }}>{viewRecord.email}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Mobile</span>
                  <span style={{ fontWeight: 600 }}>{viewRecord.mobile}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Department</span>
                  <span style={{ fontWeight: 600 }}>{viewRecord.department}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Assigned Role</span>
                  <span style={{ fontWeight: 700, color: '#7c3aed' }}>{viewRecord.roles}</span>
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
