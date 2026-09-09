import React, { useState } from 'react';
import { Search, PlusCircle, Eye, FileSpreadsheet, X, CheckCircle } from 'lucide-react';

interface UserRoleItem {
  id: string;
  sNo: number;
  userName: string;
  email: string;
  roles: string;
  createdDate: string;
}

const INITIAL_USER_ROLES: UserRoleItem[] = [
  { id: 'ur-1', sNo: 1, userName: 'Sanjay More', email: 'sanjay.more@maharashtra.gov.in', roles: 'Cadastral_Surveyor_Pune', createdDate: '06-06-2025' },
  { id: 'ur-2', sNo: 2, userName: 'Pooja Kulkarni', email: 'pooja.k@maharashtra.gov.in', roles: 'Cadastral_Surveyor_Pune', createdDate: '06-06-2025' },
  { id: 'ur-3', sNo: 3, userName: 'Rohan Joshi', email: 'rohan.j@pmc.gov.in', roles: 'Town_Planner_Assistant', createdDate: '06-06-2025' },
  { id: 'ur-4', sNo: 4, userName: 'Nitin Pawar', email: 'nitin.p@maharashtra.gov.in', roles: 'Cadastral_Surveyor_Pune', createdDate: '06-06-2025' },
  { id: 'ur-5', sNo: 5, userName: 'Snehal Patil', email: 'snehal.patil@pmc.gov.in', roles: 'ULB_Pune_Officer', createdDate: '19-06-2025' },
  { id: 'ur-6', sNo: 6, userName: 'Rajesh Deshmukh', email: 'rajesh.deshmukh@maharashtra.gov.in', roles: 'Committee_Head', createdDate: '21-07-2025' },
  { id: 'ur-7', sNo: 7, userName: 'Amit Ghorpade', email: 'amit.g@maharashtra.gov.in', roles: 'Cadastral_Surveyor_Pune', createdDate: '29-07-2025' }
];

export const UlbAssignRolePage: React.FC = () => {
  const [userRoles, setUserRoles] = useState<UserRoleItem[]>(INITIAL_USER_ROLES);
  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [query, setQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRoleItem | null>(null);
  const [newRole, setNewRole] = useState('Cadastral_Surveyor_Pune');
  const [viewItem, setViewItem] = useState<UserRoleItem | null>(null);

  const handleOpenAssign = (item: UserRoleItem) => {
    setSelectedUser(item);
    setNewRole(item.roles);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      setUserRoles(prev => prev.map(u => u.id === selectedUser.id ? { ...u, roles: newRole } : u));
    }
    setModalOpen(false);
  };

  const filtered = userRoles.filter(u => {
    const matchName = searchName ? u.userName.toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchRole = searchRole ? u.roles.toLowerCase().includes(searchRole.toLowerCase()) : true;
    const matchQuery = query ? u.userName.toLowerCase().includes(query.toLowerCase()) || u.roles.toLowerCase().includes(query.toLowerCase()) : true;
    return matchName && matchRole && matchQuery;
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
        <span style={{ fontWeight: 600 }}>Assign Role To User</span>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
        Assign Role To User
      </h2>

      {/* Filter Bar Card matching video frame 440s / 470s */}
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
              Select State *
            </label>
            <input
              type="text"
              readOnly
              value="Maharashtra"
              style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

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
              Search By Role
            </label>
            <select
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="">Select Role</option>
              <option value="Cadastral_Surveyor_Pune">Cadastral_Surveyor_Pune</option>
              <option value="ULB_Pune_Officer">ULB_Pune_Officer</option>
              <option value="Town_Planner_Assistant">Town_Planner_Assistant</option>
              <option value="Committee_Head">Committee_Head</option>
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
            onClick={() => { setSearchName(''); setSearchRole(''); setQuery(''); }}
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

      {/* Table Section matching frame 470s */}
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
                <th style={{ padding: '12px 14px', fontWeight: 600, width: '70px' }}>S.No</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>User Name</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Roles</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Created Date</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center', width: '120px' }}>Action</th>
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
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1b539c' }}>{item.roles}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{item.createdDate}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        title="Assign / Change Role"
                        onClick={() => handleOpenAssign(item)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
                      >
                        <PlusCircle size={16} />
                      </button>
                      <button
                        title="View Info"
                        onClick={() => setViewItem(item)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0284c7' }}
                      >
                        <Eye size={16} />
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

      {/* ASSIGN ROLE MODAL */}
      {modalOpen && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ backgroundColor: '#1b539c', color: '#ffffff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
              <span>Assign Role To User</span>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>User</label>
                <input type="text" readOnly value={selectedUser.userName} style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Select Role *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="Cadastral_Surveyor_Pune">Cadastral_Surveyor_Pune</option>
                  <option value="ULB_Pune_Officer">ULB_Pune_Officer</option>
                  <option value="Town_Planner_Assistant">Town_Planner_Assistant</option>
                  <option value="Committee_Head">Committee_Head</option>
                  <option value="AgriRole_ULB">AgriRole_ULB</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="submit" style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 20px', fontWeight: 700, cursor: 'pointer' }}>
                  Update
                </button>
                <button type="button" onClick={() => setModalOpen(false)} style={{ backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '6px', padding: '9px 16px', fontWeight: 600, cursor: 'pointer' }}>
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
