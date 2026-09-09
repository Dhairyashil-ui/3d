import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DataTable, Column } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { mockStore, AreaAssignment } from '../../data/mockStore';
import { Plus, Eye } from 'lucide-react';

export const AssignAreaPage: React.FC = () => {
  const [areas, setAreas] = useState<AreaAssignment[]>(mockStore.getAreaAssignments());
  const [users] = useState(mockStore.getUsers());

  // Filter States
  const [searchUlb, setSearchUlb] = useState('');
  const [searchWard, setSearchWard] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaAssignment | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    district: 'Pune',
    userId: '',
    ulb: 'Pune-270410',
    ward: '1 - Manakna gaon/ward (12928)',
    remark: ''
  });

  const handleSearch = () => {
    let filtered = mockStore.getAreaAssignments();
    if (searchUlb) filtered = filtered.filter(a => a.ulb.toLowerCase().includes(searchUlb.toLowerCase()));
    if (searchWard) filtered = filtered.filter(a => a.ward.toLowerCase().includes(searchWard.toLowerCase()));
    setAreas(filtered);
  };

  const handleClear = () => {
    setSearchUlb('');
    setSearchWard('');
    setAreas(mockStore.getAreaAssignments());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === formData.userId);
    if (!user) return;

    mockStore.addAreaAssignment({
      userName: user.name,
      district: formData.district,
      ulb: formData.ulb,
      ward: formData.ward,
      assignedDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      status: 'Active',
      remark: formData.remark
    });

    setAreas(mockStore.getAreaAssignments());
    setModalOpen(false);
    setFormData({
      district: 'Pune',
      userId: '',
      ulb: 'Pune-270410',
      ward: '1 - Manakna gaon/ward (12928)',
      remark: ''
    });
  };

  const columns: Column<AreaAssignment>[] = [
    { header: 'S.No', accessor: 'sNo', width: '60px', align: 'center' },
    { header: 'User Name', accessor: 'userName' },
    { header: 'District', accessor: 'district' },
    { header: 'ULB', accessor: 'ulb' },
    { header: 'Ward', accessor: 'ward' },
    { header: 'Assigned Date', accessor: 'assignedDate' },
    {
      header: 'Status',
      accessor: (row) => (
        <span style={{
          backgroundColor: row.status === 'Active' ? '#dcfce7' : '#fee2e2',
          color: row.status === 'Active' ? '#15803d' : '#b91c1c',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          {row.status}
        </span>
      ),
      align: 'center',
      width: '90px'
    },
    {
      header: 'Action',
      accessor: (row) => (
        <button
          onClick={() => {
            setSelectedArea(row);
            setViewModalOpen(true);
          }}
          title="View Assigned Area"
          style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1b539c', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
        >
          <Eye size={14} />
        </button>
      ),
      align: 'center',
      width: '80px'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'User Management' }, { label: 'Assign Area to User' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Assign Area to User
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            backgroundColor: '#1b539c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '9px 18px',
            fontSize: '13.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(27,83,156,0.2)'
          }}
        >
          <Plus size={16} />
          <span>Assign Area</span>
        </button>
      </div>

      {/* Filters matching Manual Page 25 */}
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
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Search By ULB
            </label>
            <select
              value={searchUlb}
              onChange={(e) => setSearchUlb(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
            >
              <option value="">Choose ULB</option>
              <option value="Pune-270410">Pune-270410</option>
              <option value="Berasia-250947">Berasia-250947</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Ward/Village
            </label>
            <select
              value={searchWard}
              onChange={(e) => setSearchWard(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13.5px' }}
            >
              <option value="">Select Ward</option>
              <option value="1 - Manakna gaon/ward (12928)">1 - Manakna gaon/ward (12928)</option>
              <option value="2 - Shahpura ward (12929)">2 - Shahpura ward (12929)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSearch}
              style={{ flex: 1, backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Search
            </button>
            <button
              onClick={handleClear}
              style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={areas}
        searchPlaceholder="Search Area Assignments..."
      />

      {/* ASSIGN AREA MODAL (Matching Manual Page 26 & 27) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assign Area To User"
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                District <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value="Pune"
                disabled
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                User <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="">Choose User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.designation})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                ULB <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={formData.ulb}
                onChange={(e) => setFormData({ ...formData, ulb: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="Pune-270410">Pune-270410</option>
                <option value="Berasia-250947">Berasia-250947</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Ward/Village <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              >
                <option value="1 - Manakna gaon/ward (12928)">1 - Manakna gaon/ward (12928)</option>
                <option value="2 - Shahpura ward (12929)">2 - Shahpura ward (12929)</option>
                <option value="3 - MP Nagar zone (12930)">3 - MP Nagar zone (12930)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Remark
            </label>
            <input
              type="text"
              placeholder="Enter remarks for area allocation..."
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{ backgroundColor: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW ASSIGNED AREA MODAL */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`Assigned Area Details: ${selectedArea?.userName}`}
        maxWidth="500px"
      >
        {selectedArea && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <div><b>User Name:</b> {selectedArea.userName}</div>
            <div><b>District:</b> {selectedArea.district}</div>
            <div><b>ULB:</b> {selectedArea.ulb}</div>
            <div><b>Assigned Ward:</b> {selectedArea.ward}</div>
            <div><b>Assigned Date:</b> {selectedArea.assignedDate}</div>
            <div><b>Status:</b> <span style={{ color: '#16a34a', fontWeight: 600 }}>{selectedArea.status}</span></div>
            {selectedArea.remark && <div><b>Remark:</b> {selectedArea.remark}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button
                onClick={() => setViewModalOpen(false)}
                style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
