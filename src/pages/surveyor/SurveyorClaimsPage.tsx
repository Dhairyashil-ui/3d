import React, { useState } from 'react';
import { claimsData as initialClaims, ClaimRecord } from '../../data/surveyor3dStore';
import { 
  Search, 
  RotateCcw, 
  Eye, 
  Edit, 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Building2,
  Calendar,
  Check,
  Plus
} from 'lucide-react';

import { apiClient } from '../../services/apiClient';

export const SurveyorClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<ClaimRecord[]>(initialClaims);
  const [ticketIdFilter, setTicketIdFilter] = useState('');
  const [claimNoFilter, setClaimNoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    async function load() {
      const data = await apiClient.getClaims();
      if (data && data.length > 0) {
        setClaims(data as any);
      }
    }
    load();
  }, []);

  // Modals state
  const [selectedClaimForDoc, setSelectedClaimForDoc] = useState<ClaimRecord | null>(null);
  const [selectedClaimForEdit, setSelectedClaimForEdit] = useState<ClaimRecord | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; ticketId: string; name: string }[]>([
    { id: '1', ticketId: 'OF_1', name: '0855a29e-09cb-4a6a-aeb2-3c9cb22c4b1a.pdf' }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Edit form state
  const [editStatus, setEditStatus] = useState<string>('Accepted');
  const [editRemarks, setEditRemarks] = useState<string>('');

  const handleSearch = () => {
    // Filter trigger
  };

  const handleClear = () => {
    setTicketIdFilter('');
    setClaimNoFilter('');
    setStatusFilter('All');
    setFromDate('');
    setToDate('');
    setSearchQuery('');
  };

  const filteredClaims = claims.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      c.ticketId.toLowerCase().includes(q) ||
      c.plotNo.toLowerCase().includes(q) ||
      c.typeOfClaim.toLowerCase().includes(q) ||
      c.claimSource.toLowerCase().includes(q);

    const matchesTicket = ticketIdFilter ? c.ticketId.toLowerCase().includes(ticketIdFilter.toLowerCase()) : true;
    const matchesStatus = statusFilter !== 'All' ? c.claimStatus === statusFilter : true;

    return matchesQuery && matchesTicket && matchesStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedClaimForDoc) {
      const file = e.target.files[0];
      const newDoc = {
        id: String(Date.now()),
        ticketId: selectedClaimForDoc.ticketId,
        name: file.name
      };
      setUploadedFiles(prev => [...prev, newDoc]);
      setSuccessToast(`Document "${file.name}" uploaded successfully.`);
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  const handleSaveClaimResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaimForEdit) return;

    await apiClient.updateClaimStatus(selectedClaimForEdit.id, editStatus as any, editRemarks);
    const updated = await apiClient.getClaims();
    setClaims(updated as any);

    setSuccessToast(`Claim ${selectedClaimForEdit.ticketId} updated to "${editStatus}" & persisted.`);
    setSelectedClaimForEdit(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit', color: '#1e293b' }}>
      {/* Toast */}
      {successToast && (
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
          <span>{successToast}</span>
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
          <span style={{ color: '#1976d2' }}>Survey Activities</span>
          <span>&gt;</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Claim / Dispute Redressal</span>
        </div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          Module: <span style={{ fontWeight: 600, color: '#334155' }}>MAP-2 Grievance & Dispute Redressal Engine</span>
        </div>
      </div>

      {/* Top Filter Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          fontSize: '12px'
        }}>
          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Urban Local Body (ULB) *</label>
            <select style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#f8fafc', fontSize: '12px' }}>
              <option>Pune - 270410</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Ward / Village</label>
            <select style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#f8fafc', fontSize: '12px' }}>
              <option>43 - Maharana pratap ward</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Survey Unit</label>
            <select style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#f8fafc', fontSize: '12px' }}>
              <option>Survey Unit 1 (343671)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Ticket ID</label>
            <input
              type="text"
              value={ticketIdFilter}
              onChange={e => setTicketIdFilter(e.target.value)}
              placeholder="e.g. OF_1, PU_3"
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', fontSize: '12px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#ffffff', fontSize: '12px' }}
            >
              <option value="All">Select All</option>
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <button
              onClick={handleSearch}
              style={{
                flex: 1,
                backgroundColor: '#1976d2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Search
            </button>
            <button
              onClick={handleClear}
              style={{
                backgroundColor: '#cbd5e1',
                color: '#334155',
                border: 'none',
                borderRadius: '6px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ position: 'relative', maxWidth: '320px', display: 'flex', alignItems: 'center' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search claims table..."
              style={{ width: '100%', padding: '6px 10px 6px 32px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#5dade2', color: '#ffffff', fontSize: '11.5px', fontWeight: 600 }}>
                <th style={{ padding: '10px 14px', textAlign: 'center', width: '45px' }}>S.No</th>
                <th style={{ padding: '10px 14px' }}>ULB</th>
                <th style={{ padding: '10px 14px' }}>Ward</th>
                <th style={{ padding: '10px 14px' }}>Survey Unit</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Plot No</th>
                <th style={{ padding: '10px 14px' }}>Ticket ID</th>
                <th style={{ padding: '10px 14px' }}>Claim Source</th>
                <th style={{ padding: '10px 14px' }}>Type of Claim</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Claim Status</th>
                <th style={{ padding: '10px 14px' }}>Claim Date</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    No claims or grievances found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '10px 14px', textAlign: 'center', color: '#64748b' }}>{item.sNo}</td>
                    <td style={{ padding: '10px 14px' }}>{item.ulb}</td>
                    <td style={{ padding: '10px 14px' }}>{item.ward}</td>
                    <td style={{ padding: '10px 14px' }}>{item.surveyUnit}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#1976d2', fontFamily: 'monospace' }}>{item.plotNo}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{item.ticketId}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: item.claimSource === 'official' ? '#f3e8ff' : '#ffedd5',
                        color: item.claimSource === 'official' ? '#6b21a8' : '#9a3412'
                      }}>
                        {item.claimSource}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{item.typeOfClaim}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        backgroundColor: item.claimStatus === 'Accepted' ? '#ecfdf5' : (item.claimStatus === 'Pending' ? '#fffbeb' : '#eff6ff'),
                        color: item.claimStatus === 'Accepted' ? '#047857' : (item.claimStatus === 'Pending' ? '#b45309' : '#1d4ed8'),
                        border: item.claimStatus === 'Accepted' ? '1px solid #a7f3d0' : (item.claimStatus === 'Pending' ? '1px solid #fde68a' : '1px solid #bfdbfe')
                      }}>
                        {item.claimStatus}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{item.claimDate}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setSelectedClaimForEdit(item);
                            setEditStatus(item.claimStatus);
                            setEditRemarks(item.remarks || '');
                          }}
                          style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', padding: '2px' }}
                          title="Redress Claim"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setSelectedClaimForDoc(item)}
                          style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', padding: '2px' }}
                          title="View Documents"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Redress Claim Modal */}
      {selectedClaimForEdit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '520px',
            overflow: 'hidden',
            boxShadow: '0 20px 25px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                Redress Claim — Ticket #{selectedClaimForEdit.ticketId}
              </h3>
              <button
                onClick={() => setSelectedClaimForEdit(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveClaimResolution} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe', color: '#1e3a8a', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><b>Plot No:</b> {selectedClaimForEdit.plotNo} | <b>Ward:</b> {selectedClaimForEdit.ward}</div>
                <div><b>Claim Type:</b> {selectedClaimForEdit.typeOfClaim}</div>
                <div><b>Source:</b> {selectedClaimForEdit.claimSource} ({selectedClaimForEdit.claimDate})</div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Grievance Redressal Decision *</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', backgroundColor: '#ffffff' }}
                >
                  <option value="Accepted">Accepted (Field Ground Truth Verification Confirmed)</option>
                  <option value="Rejected">Rejected (Inconsistent with Aerial Technical Survey)</option>
                  <option value="In Review">In Review (Sent for Multi-Source Joint Survey)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Field Surveyor Remarks *</label>
                <textarea
                  rows={4}
                  value={editRemarks}
                  onChange={e => setEditRemarks(e.target.value)}
                  placeholder="Enter detailed surveyor remarks regarding boundary discrepancy, 3D volumetric clearance, or owner identity..."
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedClaimForEdit(null)}
                  style={{ padding: '7px 16px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '7px 18px', backgroundColor: '#1976d2', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Redressal Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim Documents Modal */}
      {selectedClaimForDoc && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '680px',
            overflow: 'hidden',
            boxShadow: '0 20px 25px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} /> Claim Documents — Ticket: {selectedClaimForDoc.ticketId}
              </h3>
              <button
                onClick={() => setSelectedClaimForDoc(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '12px' }}>
              <div style={{ border: '2px dashed #93c5fd', borderRadius: '8px', padding: '24px', textAlign: 'center', backgroundColor: '#eff6ff' }}>
                <p style={{ color: '#1e3a8a', fontWeight: 700, margin: '0 0 6px 0' }}>Upload Supporting Evidence / Ground Photos</p>
                <p style={{ color: '#64748b', margin: '0 0 12px 0' }}>Select PDF or Geotagged survey photograph</p>
                <label style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
                  Browse File
                  <input type="file" accept=".pdf,.png,.jpg" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1976d2', color: '#ffffff', fontSize: '11px' }}>
                      <th style={{ padding: '8px 12px' }}>S.No</th>
                      <th style={{ padding: '8px 12px' }}>Ticket</th>
                      <th style={{ padding: '8px 12px' }}>Document Name</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.map((doc, i) => (
                      <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 12px', color: '#64748b' }}>{i + 1}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 600 }}>{doc.ticketId}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#1e293b' }}>{doc.name}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          <button
                            onClick={() => alert(`Opening preview for ${doc.name}`)}
                            style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontWeight: 600 }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setSelectedClaimForDoc(null)}
                style={{ padding: '6px 18px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
