import React, { useState } from 'react';
import { 
  publicationCardsData as initialCards, 
  PublicationCardRecord 
} from '../../data/surveyor3dStore';
import { 
  Eye, 
  Download, 
  Share2, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  ArrowLeft,
  Printer,
  ShieldCheck,
  Building2,
  Layers,
  Home
} from 'lucide-react';

export const SurveyorManagePublicationPage: React.FC = () => {
  const [cards, setCards] = useState<PublicationCardRecord[]>(initialCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('Send for Provisional Publication');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewingCard, setViewingCard] = useState<PublicationCardRecord | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredCards = cards.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.urProCardNo.toLowerCase().includes(q) ||
      (c.plotNo || '').toLowerCase().includes(q) ||
      (c.khasraNo || '').toLowerCase().includes(q) ||
      c.ward.toLowerCase().includes(q) ||
      (c.ownerName || '').toLowerCase().includes(q)
    );
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredCards.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExecuteAction = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one property record to perform this action.');
      return;
    }

    if (selectedAction === 'Send for Provisional Publication') {
      setCards(prev => prev.map(c => 
        selectedIds.includes(c.id) ? { ...c, status: 'Provisional' } : c
      ));
      setSuccessToast(`Successfully sent ${selectedIds.length} property record(s) for Provisional Publication (Notice under Section 14).`);
      setSelectedIds([]);
      setTimeout(() => setSuccessToast(null), 5000);
    } else {
      setSuccessToast(`Action "${selectedAction}" executed successfully for ${selectedIds.length} record(s).`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit', color: '#1e293b' }}>
      {/* Toast Notification */}
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
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Manage Publication</span>
        </div>
        {viewingCard && (
          <button 
            onClick={() => setViewingCard(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              backgroundColor: '#1976d2',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={13} /> Back to Publication List
          </button>
        )}
      </div>

      {!viewingCard ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {/* Action Bar Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ position: 'relative', minWidth: '280px', display: 'flex', alignItems: 'center' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by Card No, Plot, Khasra, Owner..."
                style={{ width: '100%', padding: '7px 12px 7px 32px', fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Bulk Action:</span>
              <select
                value={selectedAction}
                onChange={e => setSelectedAction(e.target.value)}
                style={{ fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '7px 12px', backgroundColor: '#ffffff', color: '#1e293b' }}
              >
                <option value="Send for Provisional Publication">Send for Provisional Publication</option>
                <option value="Generate Publication Cards (UrPro)">Generate Publication Cards (UrPro)</option>
                <option value="Export Geospatial Publication Register (PDF)">Export Geospatial Publication Register (PDF)</option>
                <option value="Dispatch Notification to ULB Portal">Dispatch Notification to ULB Portal</option>
              </select>

              <button
                onClick={handleExecuteAction}
                style={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 18px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(25, 118, 210, 0.3)'
                }}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#5dade2', color: '#ffffff', fontSize: '11.5px', fontWeight: 600 }}>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={filteredCards.length > 0 && selectedIds.length === filteredCards.length}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer', accentColor: '#1976d2' }}
                    />
                  </th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '60px' }}>Action</th>
                  <th style={{ padding: '10px 14px' }}>Urban Property (UrPro) Card No</th>
                  <th style={{ padding: '10px 14px' }}>Form No</th>
                  <th style={{ padding: '10px 14px' }}>Date</th>
                  <th style={{ padding: '10px 14px' }}>District</th>
                  <th style={{ padding: '10px 14px' }}>Ward</th>
                  <th style={{ padding: '10px 14px' }}>Property Type</th>
                  <th style={{ padding: '10px 14px' }}>Owner Name</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>3D Intelligence</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Publication Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      No publication records found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCards.map((item, idx) => (
                    <tr 
                      key={item.id} 
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: selectedIds.includes(item.id) ? '#eff6ff' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc')
                      }}
                    >
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleToggleSelect(item.id)}
                          style={{ cursor: 'pointer', accentColor: '#1976d2' }}
                        />
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <button
                          onClick={() => setViewingCard(item)}
                          style={{ background: 'none', border: 'none', color: '#1976d2', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        >
                          <Eye size={13} /> View
                        </button>
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{item.urProCardNo}</td>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>{item.formNo}</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{item.date}</td>
                      <td style={{ padding: '10px 14px' }}>{item.district}</td>
                      <td style={{ padding: '10px 14px' }}>{item.ward}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                          {item.propertyType}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{item.ownerName}</td>
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
                          backgroundColor: item.status === 'Published' ? '#ecfdf5' : '#fffbeb',
                          color: item.status === 'Published' ? '#047857' : '#b45309',
                          border: item.status === 'Published' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Detailed Urban Property (UrPro) Card View */
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card Top Title Banner */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#1976d2', color: '#ffffff', fontSize: '11px', fontWeight: 700 }}>
                  URPRO CARD FORM-01
                </span>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Card No: {viewingCard.urProCardNo}
                </h2>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: viewingCard.status === 'Published' ? '#ecfdf5' : '#fffbeb',
                  color: viewingCard.status === 'Published' ? '#047857' : '#b45309',
                  border: viewingCard.status === 'Published' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                }}>
                  Status: {viewingCard.status}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Authoritative Urban Property Certificate & 3D Spatial Registration Record | Generated under NAKSHA MAP-2 Platform
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => window.print()}
                style={{ padding: '7px 14px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Printer size={14} /> Print Card
              </button>
              <button 
                onClick={() => {
                  setCards(prev => prev.map(c => c.id === viewingCard.id ? { ...c, status: 'Provisional' } : c));
                  setViewingCard(prev => prev ? { ...prev, status: 'Provisional' } : null);
                  setSuccessToast(`Card ${viewingCard.urProCardNo} sent for Provisional Publication.`);
                  setTimeout(() => setSuccessToast(null), 4000);
                }}
                style={{ padding: '7px 16px', backgroundColor: '#1976d2', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Send size={14} /> Send for Provisional Publication
              </button>
            </div>
          </div>

          {/* Section 1: Property Identification & Administrative Details */}
          <div style={{ border: '1px solid #bfdbfe', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '10px 16px', fontWeight: 700, fontSize: '12px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #bfdbfe' }}>
              <Building2 size={16} color="#1976d2" /> 1. General & Administrative Location Details
            </div>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>State / UT:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{viewingCard.state}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>District Name:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{viewingCard.district}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Town / ULB:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{viewingCard.city}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Ward Name & No:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{viewingCard.ward}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Plot Number:</span>
                <span style={{ fontWeight: 700, color: '#1976d2', fontFamily: 'monospace' }}>{viewingCard.plotNo}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Khasra No:</span>
                <span style={{ fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>{viewingCard.khasraNo}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Owner Details */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '10px 16px', fontWeight: 700, fontSize: '12px', color: '#334155', borderBottom: '1px solid #e2e8f0' }}>
              2. Registered Owner & Communication Details
            </div>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Registered Titleholder:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{viewingCard.ownerName}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Ownership Share:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>100% (Single Sole Owner)</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Property Type:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{viewingCard.propertyType}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Rights Type:</span>
                <span style={{ fontWeight: 700, color: '#047857' }}>Freehold Ownership</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
