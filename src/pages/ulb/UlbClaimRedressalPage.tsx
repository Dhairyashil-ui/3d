import React, { useState } from 'react';
import { Search, AlertOctagon, CheckCircle2, Clock, Eye, FileSpreadsheet, X } from 'lucide-react';

interface ClaimItem {
  id: string;
  claimNo: string;
  claimantName: string;
  mobile: string;
  ward: string;
  surveyUnit: string;
  propertyRef: string;
  claimType: string;
  submissionDate: string;
  status: 'Pending' | 'Under Inquiry' | 'Addressed' | 'Rejected';
  redressalNotes?: string;
}

const INITIAL_CLAIMS: ClaimItem[] = [
  {
    id: 'cl-1',
    claimNo: 'CLM-PUNE-2025-001',
    claimantName: 'Sunita Ramesh Kulkarni',
    mobile: '9822019283',
    ward: 'Ward 12 - Hinjawadi Phase 1',
    surveyUnit: 'SU-HINJ-01',
    propertyRef: 'Plot 42, Floor 1 (Unit 101)',
    claimType: 'Correction in Ownership Share (from 50% to 100%)',
    submissionDate: '12-08-2025',
    status: 'Pending'
  },
  {
    id: 'cl-2',
    claimNo: 'CLM-PUNE-2025-002',
    claimantName: 'Anil Bhausaheb Shinde',
    mobile: '9823194821',
    ward: 'Ward 12 - Hinjawadi Phase 1',
    surveyUnit: 'SU-HINJ-01',
    propertyRef: 'Gat No. 342/2',
    claimType: 'Boundary Overlap with Adjacent Cadastral Parcel',
    submissionDate: '14-08-2025',
    status: 'Under Inquiry'
  },
  {
    id: 'cl-3',
    claimNo: 'CLM-PUNE-2025-003',
    claimantName: 'Meenakshi Rao',
    mobile: '9822774411',
    ward: 'Ward 24 - Baner-Balewadi',
    surveyUnit: 'SU-BANER-02',
    propertyRef: 'CTS No. 1298, Balewadi',
    claimType: 'Spelling Correction in Property Card Name',
    submissionDate: '02-08-2025',
    status: 'Addressed',
    redressalNotes: 'Corrected per Aadhaar verification.'
  },
  {
    id: 'cl-4',
    claimNo: 'CLM-PUNE-2025-004',
    claimantName: 'Mahesh Deshpande',
    mobile: '9822998811',
    ward: 'Ward 36 - Kothrud',
    surveyUnit: 'SU-KOTH-03',
    propertyRef: 'Mayur Colony Plot 15',
    claimType: 'Objection against provisional publication measurement',
    submissionDate: '19-08-2025',
    status: 'Pending'
  }
];

export const UlbClaimRedressalPage: React.FC = () => {
  const [claims, setClaims] = useState<ClaimItem[]>(INITIAL_CLAIMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(null);
  const [actionStatus, setActionStatus] = useState<'Addressed' | 'Rejected' | 'Under Inquiry'>('Addressed');
  const [resolutionNote, setResolutionNote] = useState('');

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClaim) {
      setClaims(prev => prev.map(c => c.id === selectedClaim.id ? {
        ...c,
        status: actionStatus,
        redressalNotes: resolutionNote
      } : c));
    }
    setSelectedClaim(null);
  };

  const filtered = claims.filter(c => {
    const matchStatus = statusFilter !== 'All' ? c.status === statusFilter : true;
    const matchQuery = searchQuery ? c.claimantName.toLowerCase().includes(searchQuery.toLowerCase()) || c.claimNo.toLowerCase().includes(searchQuery.toLowerCase()) || c.ward.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchStatus && matchQuery;
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
        <span style={{ fontWeight: 600 }}>Claim & Redressal</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          Public Claims & Grievance Redressal
        </h2>
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          ULB Jurisdiction: <b style={{ color: '#1b539c' }}>PMRDA Pune (270410) / PMC</b>
        </div>
      </div>

      {/* Filter Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr auto auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Search By Claimant / Claim Number
            </label>
            <input
              type="text"
              placeholder="Enter claimant name or claim number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Claim Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Inquiry">Under Inquiry</option>
              <option value="Addressed">Addressed</option>
            </select>
          </div>

          <button
            style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
          >
            Filter
          </button>

          <button
            onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
            style={{ backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '6px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#2563eb', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Claim No.</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Claimant</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Ward & Survey Unit</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Property Ref</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Claim Description</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Filed On</th>
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
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1b539c' }}>{item.claimNo}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                    <div>{item.claimantName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Ph: {item.mobile}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>
                    <div>{item.ward}</div>
                    <div style={{ fontSize: '11px', color: '#1b539c', fontWeight: 600 }}>{item.surveyUnit}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{item.propertyRef}</td>
                  <td style={{ padding: '12px 14px', color: '#1e293b', maxWidth: '240px' }}>{item.claimType}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '12px' }}>{item.submissionDate}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: item.status === 'Addressed' ? '#dcfce7' : item.status === 'Under Inquiry' ? '#e0f2fe' : '#fef3c7',
                      color: item.status === 'Addressed' ? '#166534' : item.status === 'Under Inquiry' ? '#0369a1' : '#b45309',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setSelectedClaim(item);
                        setActionStatus(item.status === 'Pending' ? 'Addressed' : item.status as any);
                        setResolutionNote(item.redressalNotes || '');
                      }}
                      style={{
                        backgroundColor: '#1b539c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Redress
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESOLUTION MODAL */}
      {selectedClaim && (
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
            maxWidth: '580px',
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
              <span>Claim Redressal Hearing</span>
              <button onClick={() => setSelectedClaim(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleResolve} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div>Claimant: <b>{selectedClaim.claimantName}</b> ({selectedClaim.claimNo})</div>
                <div>Property: <b>{selectedClaim.propertyRef} &bull; {selectedClaim.ward}</b></div>
                <div style={{ color: '#dc2626', marginTop: '4px' }}>Dispute: {selectedClaim.claimType}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Redressal Decision / Action *
                </label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value as any)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="Addressed">Addressed & Approved for Correction</option>
                  <option value="Under Inquiry">Under Inquiry / Refer to Tahsildar</option>
                  <option value="Rejected">Rejected (Inadequate Title Proof)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Official Redressal Findings & Order Note
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter hearing outcome and order reference..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="submit"
                  style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 22px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Record Redressal Order
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedClaim(null)}
                  style={{ backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '6px', padding: '9px 16px', fontWeight: 600, cursor: 'pointer' }}
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
