import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  landParcelsData, 
  buildingsData, 
  LandParcel 
} from '../../data/surveyor3dStore';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  ShieldCheck, 
  Building2, 
  Layers,
  ArrowRight
} from 'lucide-react';

import { apiClient } from '../../services/apiClient';

export const SurveyorVerificationQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const [parcels, setParcels] = useState<any[]>(landParcelsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const list = await apiClient.getParcels();
      if (list && list.length > 0) {
        setParcels(list);
      }
    }
    loadData();
  }, []);

  const filteredParcels = parcels.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      p.parcelId.toLowerCase().includes(q) ||
      p.ulpin.toLowerCase().includes(q) ||
      p.khasraNo.toLowerCase().includes(q) ||
      p.plotNo.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || p.threeDStatus === statusFilter || p.verificationStatus === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredParcels.map(p => p.parcelId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one property record to verify.');
      return;
    }
    for (const id of selectedIds) {
      await apiClient.saveVerification({
        objectId: id,
        objectType: 'PARCEL',
        decision: 'AGREE',
        reason: 'Batch queue verification signoff',
        notes: 'Verified via 3D Spatial Verification Queue console',
        surveyor: 'Surveyor_Pune'
      });
    }
    const updated = await apiClient.getParcels();
    setParcels(updated);
    setToastMessage(`Successfully verified and persisted ${selectedIds.length} 3D Property record(s)!`);
    setSelectedIds([]);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit', color: '#1e293b' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '64px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#065f46',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 600,
          border: '1px solid #10b981'
        }}>
          <CheckCircle2 size={18} color="#a7f3d0" style={{ flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        backgroundColor: '#ffffff',
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#1976d2', fontWeight: 600 }}>Home</span>
          <span>&gt;</span>
          <span style={{ color: '#1976d2' }}>Property Intelligence</span>
          <span>&gt;</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>3D Spatial Verification Queue</span>
        </div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          Field Surveyor Task Queue: Pune Ward 43 / Survey Unit 1
        </div>
      </div>

      {/* Action Bar & Stats */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '260px', display: 'flex', alignItems: 'center' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search parcel, ULPIN, plot..."
              style={{ width: '100%', padding: '7px 12px 7px 32px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '7px 12px', backgroundColor: '#ffffff', fontSize: '12px', color: '#1e293b' }}
          >
            <option value="ALL">All Verification States</option>
            <option value="Ready for Verification">Ready for Verification</option>
            <option value="Model Reconstructed">Model Reconstructed</option>
            <option value="Anomalies Flagged">Anomalies Flagged</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleBulkApprove}
            style={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)'
            }}
          >
            <CheckCircle2 size={15} /> Bulk Verify ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Verification Queue Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#5dade2', color: '#ffffff', fontSize: '11.5px', fontWeight: 600 }}>
                <th style={{ padding: '10px 14px', textAlign: 'center', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={filteredParcels.length > 0 && selectedIds.length === filteredParcels.length}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', accentColor: '#1976d2' }}
                  />
                </th>
                <th style={{ padding: '10px 14px' }}>Parcel ID</th>
                <th style={{ padding: '10px 14px' }}>ULPIN (Land Parcel Anchor)</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Plot No</th>
                <th style={{ padding: '10px 14px' }}>Khasra</th>
                <th style={{ padding: '10px 14px' }}>Ground Area</th>
                <th style={{ padding: '10px 14px' }}>Buildings / Floors</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>3D Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Verification Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredParcels.map(item => (
                <tr key={item.parcelId} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: selectedIds.includes(item.parcelId) ? '#eff6ff' : 'transparent' }}>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.parcelId)}
                      onChange={() => handleToggleSelect(item.parcelId)}
                      style={{ cursor: 'pointer', accentColor: '#1976d2' }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#1976d2' }}>{item.parcelId}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#7c3aed', fontWeight: 700 }}>{item.ulpin}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{item.plotNo}</td>
                  <td style={{ padding: '10px 14px', color: '#475569', fontFamily: 'monospace' }}>{item.khasraNo}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#475569' }}>{item.areaSqm} m²</td>
                  <td style={{ padding: '10px 14px', color: '#1e293b' }}>{item.buildingsCount || 1} Bld ({item.floorsCount || 5} Flr)</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, backgroundColor: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>
                      {item.threeDStatus}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      backgroundColor: item.verificationStatus === 'Verified' ? '#ecfdf5' : '#fffbeb',
                      color: item.verificationStatus === 'Verified' ? '#047857' : '#b45309',
                      border: item.verificationStatus === 'Verified' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                    }}>
                      {item.verificationStatus}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => navigate(`/surveyor/property-detail?parcelId=${item.parcelId}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#1976d2',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11.5px'
                      }}
                    >
                      <Eye size={13} /> Inspect Dossier
                    </button>
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
