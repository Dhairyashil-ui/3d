import React, { useState } from 'react';
import { Search, Plus, Edit3, Eye, FileSpreadsheet, ArrowLeft, Check, CheckSquare, Square } from 'lucide-react';

interface RoleRecord {
  id: string;
  sNo: number;
  role: string;
  roleDescription: string;
  createdBy: string;
  createdDate: string;
  permissions: {
    [key: string]: { add: boolean; update: boolean; view: boolean; enabled: boolean };
  };
}

interface MenuItemPermission {
  id: string;
  sNo: string;
  name: string;
  isSub?: boolean;
}

const MENU_ITEMS: MenuItemPermission[] = [
  { id: 'home', sNo: '1', name: 'Home' },
  { id: 'dashboard', sNo: '2', name: 'Dashboard' },
  { id: 'survey_units', sNo: '3', name: 'Survey Unit Details' },
  { id: 'survey_activities', sNo: '4', name: 'Survey Activities' },
  { id: 'map_img_verif', sNo: '4.1', name: 'Map & Image Verification', isSub: true },
  { id: 'upload_gt', sNo: '4.2', name: 'Upload GT Points', isSub: true },
  { id: 'merge_split', sNo: '4.3', name: 'Merge & Split', isSub: true },
  { id: 'plot_verif', sNo: '4.4', name: 'Plot Verification', isSub: true },
  { id: 'ror_entry', sNo: '4.5', name: 'ROR Entry', isSub: true },
  { id: 'manage_pub', sNo: '4.6', name: 'Manage Publication', isSub: true },
  { id: 'report', sNo: '5', name: 'Report' },
  { id: 'notification', sNo: '6', name: 'Notification' },
  { id: 'manage_log', sNo: '7', name: 'Manage Log' }
];

const INITIAL_ROLES: RoleRecord[] = [
  {
    id: 'role-1',
    sNo: 1,
    role: 'ULB_Pune_Officer',
    roleDescription: 'Urban local body administrative head for Pune & PMRDA land records publication',
    createdBy: 'ULB Pune Admin',
    createdDate: '23-07-2025',
    permissions: MENU_ITEMS.reduce((acc, item) => ({
      ...acc,
      [item.id]: { add: true, update: true, view: true, enabled: true }
    }), {})
  },
  {
    id: 'role-2',
    sNo: 2,
    role: 'Cadastral_Surveyor_Pune',
    roleDescription: 'Field surveyor for ground truthing, GPS control, and parcel verification',
    createdBy: 'ULB Pune Admin',
    createdDate: '21-07-2025',
    permissions: MENU_ITEMS.reduce((acc, item) => ({
      ...acc,
      [item.id]: {
        add: ['upload_gt', 'merge_split', 'plot_verif', 'ror_entry'].includes(item.id),
        update: ['upload_gt', 'merge_split', 'plot_verif', 'ror_entry'].includes(item.id),
        view: true,
        enabled: true
      }
    }), {})
  },
  {
    id: 'role-3',
    sNo: 3,
    role: 'Town_Planner_Assistant',
    roleDescription: 'Verification of municipal layout sanctions and floor records',
    createdBy: 'ULB Pune Admin',
    createdDate: '27-05-2025',
    permissions: MENU_ITEMS.reduce((acc, item) => ({
      ...acc,
      [item.id]: {
        add: false,
        update: ['plot_verif', 'manage_pub'].includes(item.id),
        view: true,
        enabled: true
      }
    }), {})
  }
];

export const UlbManageRolePage: React.FC = () => {
  const [roles, setRoles] = useState<RoleRecord[]>(INITIAL_ROLES);
  const [searchRole, setSearchRole] = useState('');
  const [query, setQuery] = useState('');

  // Mode: list view vs permission matrix editor
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [isNewRole, setIsNewRole] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [permissions, setPermissions] = useState<{ [key: string]: { add: boolean; update: boolean; view: boolean; enabled: boolean } }>({});

  const handleOpenCreate = () => {
    setIsNewRole(true);
    setRoleName('');
    setRoleDesc('');
    const initialPerms = MENU_ITEMS.reduce((acc, item) => ({
      ...acc,
      [item.id]: { add: true, update: true, view: true, enabled: true }
    }), {});
    setPermissions(initialPerms);
    setEditingRole({
      id: `role-${Date.now()}`,
      sNo: roles.length + 1,
      role: '',
      roleDescription: '',
      createdBy: 'ULB Pune Admin',
      createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      permissions: initialPerms
    });
  };

  const handleOpenEdit = (rec: RoleRecord) => {
    setIsNewRole(false);
    setEditingRole(rec);
    setRoleName(rec.role);
    setRoleDesc(rec.roleDescription);
    setPermissions(rec.permissions);
  };

  const togglePerm = (itemId: string, type: 'enabled' | 'add' | 'update' | 'view') => {
    setPermissions(prev => {
      const current = prev[itemId] || { add: false, update: false, view: false, enabled: false };
      const updated = { ...current, [type]: !current[type] };
      if (type === 'enabled' && !updated.enabled) {
        updated.add = false;
        updated.update = false;
        updated.view = false;
      }
      return { ...prev, [itemId]: updated };
    });
  };

  const handleSaveRole = () => {
    if (!roleName) {
      alert('Please enter Role Name');
      return;
    }
    if (isNewRole) {
      const newR: RoleRecord = {
        id: `role-${Date.now()}`,
        sNo: roles.length + 1,
        role: roleName,
        roleDescription: roleDesc,
        createdBy: 'ULB Pune Admin',
        createdDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        permissions
      };
      setRoles(prev => [...prev, newR]);
    } else if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, role: roleName, roleDescription: roleDesc, permissions } : r));
    }
    setEditingRole(null);
  };

  const filtered = roles.filter(r => {
    const matchSearch = searchRole ? r.role.toLowerCase().includes(searchRole.toLowerCase()) : true;
    const matchQuery = query ? r.role.toLowerCase().includes(query.toLowerCase()) || r.roleDescription.toLowerCase().includes(query.toLowerCase()) : true;
    return matchSearch && matchQuery;
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
        <span style={{ fontWeight: 600 }}>Create/Manage Role</span>
      </div>

      {/* IF EDITING ROLE: Show Permissions Matrix matching Frame 350s */}
      {editingRole ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setEditingRole(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1b539c', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
              >
                <ArrowLeft size={18} />
                <span>Back to Roles</span>
              </button>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>
                {isNewRole ? 'Create New Role & Permissions' : `Edit Role: ${roleName}`}
              </h3>
            </div>

            <button
              onClick={handleSaveRole}
              style={{
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 24px',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              Update
            </button>
          </div>

          {/* Role Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                Role Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter role name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                Role Description
              </label>
              <input
                type="text"
                placeholder="Enter role description..."
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Permissions Matrix Table matching video Frame 350s */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#2563eb', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', width: '50px' }}>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={(e) => {
                        const val = e.target.checked;
                        setPermissions(prev => {
                          const updated: any = {};
                          MENU_ITEMS.forEach(m => {
                            updated[m.id] = { add: val, update: val, view: val, enabled: val };
                          });
                          return updated;
                        });
                      }}
                    />
                  </th>
                  <th style={{ padding: '12px 16px', width: '80px', fontWeight: 600 }}>S.No</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Menu Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', width: '120px', fontWeight: 600 }}>Add</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', width: '120px', fontWeight: 600 }}>Update</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', width: '120px', fontWeight: 600 }}>View</th>
                </tr>
              </thead>
              <tbody>
                {MENU_ITEMS.map((item, idx) => {
                  const perm = permissions[item.id] || { add: false, update: false, view: false, enabled: false };
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: item.isSub ? '#f8fafc' : '#ffffff'
                      }}
                    >
                      <td style={{ padding: '10px 16px' }}>
                        <input
                          type="checkbox"
                          checked={perm.enabled}
                          onChange={() => togglePerm(item.id, 'enabled')}
                        />
                      </td>
                      <td style={{ padding: '10px 16px', color: '#64748b', fontWeight: item.isSub ? 400 : 700 }}>
                        {item.sNo}
                      </td>
                      <td style={{ padding: '10px 16px', paddingLeft: item.isSub ? '32px' : '16px', fontWeight: item.isSub ? 500 : 700, color: '#0f172a' }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perm.add}
                          disabled={!perm.enabled}
                          onChange={() => togglePerm(item.id, 'add')}
                        />
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perm.update}
                          disabled={!perm.enabled}
                          onChange={() => togglePerm(item.id, 'update')}
                        />
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perm.view}
                          disabled={!perm.enabled}
                          onChange={() => togglePerm(item.id, 'view')}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={handleSaveRole}
              style={{
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 28px',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        /* LIST VIEW matching Frame 320s */
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              Create/Manage Role
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
              <span>Create Role</span>
            </button>
          </div>

          {/* Search Filter Card matching video frame 320s */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '3fr auto auto',
              gap: '16px',
              alignItems: 'flex-end'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                  Role Name
                </label>
                <input
                  type="text"
                  placeholder="Search Name"
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px'
                  }}
                />
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
                onClick={() => { setSearchRole(''); setQuery(''); }}
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

          {/* Roles Table */}
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
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Role</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Role Description</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Created By</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Created Date</th>
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
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1b539c' }}>{item.role}</td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>{item.roleDescription}</td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{item.createdBy}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{item.createdDate}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            title="Edit Permissions"
                            onClick={() => handleOpenEdit(item)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            title="View Permissions"
                            onClick={() => handleOpenEdit(item)}
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
        </>
      )}
    </div>
  );
};
