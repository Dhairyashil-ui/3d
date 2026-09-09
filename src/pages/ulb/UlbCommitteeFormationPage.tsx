import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Eye, 
  Edit3, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Check, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface CommitteeMember {
  name: string;
  mobile: string;
  email: string;
  department: string;
  designation: string;
}

interface CommitteeRecord {
  id: string;
  sNo: number;
  district: string;
  ulb: string;
  committeeName: string;
  headOfCommittee: string;
  assistant: string;
  surveyors: CommitteeMember[];
  documentName: string;
  createdBy: string;
  createdOn: string;
}

const INITIAL_COMMITTEES: CommitteeRecord[] = [
  {
    id: 'comm-1',
    sNo: 1,
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    committeeName: 'Hinjawadi Phase 1 Survey Committee',
    headOfCommittee: 'Rajesh Deshmukh (Addl. Collector, Pune)',
    assistant: 'Snehal Patil (Town Planning Officer)',
    surveyors: [
      { name: 'Sanjay More', mobile: '9822014521', email: 'sanjay.more@maharashtra.gov.in', department: 'Land Records Pune', designation: 'Cadastral Surveyor' },
      { name: 'Pooja Kulkarni', mobile: '9822098712', email: 'pooja.k@maharashtra.gov.in', department: 'PMRDA GIS Cell', designation: 'GIS Analyst' }
    ],
    documentName: 'PMRDA_HINJ_COMM_ORDER_01.pdf',
    createdBy: 'ULB Pune Admin',
    createdOn: '23/07/2025 5:42:44 PM'
  },
  {
    id: 'comm-2',
    sNo: 2,
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    committeeName: 'Baner-Balewadi Survey Committee',
    headOfCommittee: 'Anil Kadam (Deputy Collector, Land Records)',
    assistant: 'Pravin Shinde (Assistant Director Town Planning)',
    surveyors: [
      { name: 'Rohan Joshi', mobile: '9823145621', email: 'rohan.j@pmc.gov.in', department: 'PMC Survey Branch', designation: 'Senior Surveyor' }
    ],
    documentName: 'PMC_BANER_COMM_ORDER_02.pdf',
    createdBy: 'ULB Pune Admin',
    createdOn: '05/08/2025 4:33:51 PM'
  },
  {
    id: 'comm-3',
    sNo: 3,
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    committeeName: 'Kothrud Ward Survey Committee',
    headOfCommittee: 'Vikas Gaikwad (Superintendent Land Records)',
    assistant: 'Meera Rao (Junior Planner)',
    surveyors: [
      { name: 'Nitin Pawar', mobile: '9823908123', email: 'nitin.p@maharashtra.gov.in', department: 'Settlement & Land Records', designation: 'Survey Officer' }
    ],
    documentName: 'KOTHRUD_SURVEY_COMM_03.pdf',
    createdBy: 'ULB Pune Admin',
    createdOn: '12/08/2025 11:11:35 AM'
  },
  {
    id: 'comm-4',
    sNo: 4,
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    committeeName: 'Shivajinagar Central Committee',
    headOfCommittee: 'Dr. Suresh Mane (Joint Director Town Planning)',
    assistant: 'Kiran Thite (Survey Inspector)',
    surveyors: [
      { name: 'Amit Ghorpade', mobile: '9822456789', email: 'amit.g@maharashtra.gov.in', department: 'Town Planning & Valuation', designation: 'Junior Surveyor' }
    ],
    documentName: 'SHIVAJINAGAR_SURVEY_04.pdf',
    createdBy: 'ULB Pune Admin',
    createdOn: '18/08/2025 11:11:36 AM'
  },
  {
    id: 'comm-5',
    sNo: 5,
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    committeeName: 'Viman Nagar IT Zone Committee',
    headOfCommittee: 'Manisha Jagtap (Sub-Divisional Officer)',
    assistant: 'Sachin Thorat (Tahsildar)',
    surveyors: [
      { name: 'Vijay Kamble', mobile: '9823334455', email: 'vijay.k@maharashtra.gov.in', department: 'Revenue Department', designation: 'Field Surveyor' }
    ],
    documentName: 'VIMANNAGAR_COMM_05.pdf',
    createdBy: 'ULB Pune Admin',
    createdOn: '25/08/2025 11:15:30 AM'
  },
  {
    id: 'comm-6',
    sNo: 6,
    district: 'Pune',
    ulb: 'PMRDA Pune (270410)',
    committeeName: 'Hadapsar Magarpatta Survey Committee',
    headOfCommittee: 'Girish Patil (Addl. Director)',
    assistant: 'Sunita Chavan (Planning Assistant)',
    surveyors: [
      { name: 'Sunil Jagtap', mobile: '9822119988', email: 'sunil.j@maharashtra.gov.in', department: 'PMRDA Town Planning', designation: 'Cadastral Surveyor' }
    ],
    documentName: 'HADAPSAR_COMM_06.pdf',
    createdBy: 'ULB Pune Admin',
    createdOn: '29/08/2025 11:32:09 AM'
  }
];

export const UlbCommitteeFormationPage: React.FC = () => {
  const [committees, setCommittees] = useState<CommitteeRecord[]>(INITIAL_COMMITTEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUlb, setSelectedUlb] = useState('PMRDA Pune - 270410');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<CommitteeRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formCommitteeName, setFormCommitteeName] = useState('');
  const [headOfCommittee, setHeadOfCommittee] = useState('Rajesh Deshmukh (Addl. Collector, Pune)');
  const [assistant, setAssistant] = useState('Snehal Patil (Town Planning Officer)');
  const [surveyors, setSurveyors] = useState<CommitteeMember[]>([
    { name: '', mobile: '', email: '', department: '', designation: '' }
  ]);
  const [documentFile, setDocumentFile] = useState<string>('');
  
  // Accordion state inside modal
  const [accordionState, setAccordionState] = useState<{ [key: string]: boolean }>({
    head: true,
    assistant: false,
    surveyor: true
  });

  const toggleAccordion = (key: string) => {
    setAccordionState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    setAccordionState({ head: true, assistant: true, surveyor: true });
  };

  const collapseAll = () => {
    setAccordionState({ head: false, assistant: false, surveyor: false });
  };

  const handleAddSurveyor = () => {
    setSurveyors(prev => [...prev, { name: '', mobile: '', email: '', department: '', designation: '' }]);
  };

  const handleSurveyorChange = (index: number, field: keyof CommitteeMember, val: string) => {
    setSurveyors(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormCommitteeName('');
    setHeadOfCommittee('Rajesh Deshmukh (Addl. Collector, Pune)');
    setAssistant('Snehal Patil (Town Planning Officer)');
    setSurveyors([{ name: '', mobile: '', email: '', department: '', designation: '' }]);
    setDocumentFile('');
    setAccordionState({ head: true, assistant: false, surveyor: true });
    setModalOpen(true);
  };

  const openEditModal = (rec: CommitteeRecord) => {
    setIsEditing(true);
    setEditingId(rec.id);
    setFormCommitteeName(rec.committeeName);
    setHeadOfCommittee(rec.headOfCommittee);
    setAssistant(rec.assistant);
    setSurveyors(rec.surveyors.length > 0 ? rec.surveyors : [{ name: '', mobile: '', email: '', department: '', designation: '' }]);
    setDocumentFile(rec.documentName);
    setAccordionState({ head: true, assistant: true, surveyor: true });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      setCommittees(prev => prev.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            committeeName: formCommitteeName || item.committeeName,
            headOfCommittee,
            assistant,
            surveyors: surveyors.filter(s => s.name.trim() !== ''),
            documentName: documentFile || item.documentName
          };
        }
        return item;
      }));
    } else {
      const newRec: CommitteeRecord = {
        id: `comm-${Date.now()}`,
        sNo: committees.length + 1,
        district: 'Pune',
        ulb: 'PMRDA Pune (270410)',
        committeeName: formCommitteeName || `Pune Survey Committee ${committees.length + 1}`,
        headOfCommittee,
        assistant,
        surveyors: surveyors.filter(s => s.name.trim() !== ''),
        documentName: documentFile || 'COMM_FORMATION_ORDER.pdf',
        createdBy: 'ULB Pune Admin',
        createdOn: new Date().toLocaleString()
      };
      setCommittees(prev => [newRec, ...prev]);
    }
    setModalOpen(false);
  };

  const filtered = committees.filter(c => 
    c.committeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.ulb.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Breadcrumb matching frame 110s */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c', fontWeight: 600 }}>Home</span>
        <span>›</span>
        <span>Create/Manage Committee</span>
      </div>

      {/* Header with Title and Create Survey Committee Button matching frame 110s */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          Create/Manage Committee
        </h2>
        <button
          onClick={openCreateModal}
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
          <span>Create Survey Committee</span>
        </button>
      </div>

      {/* Filter Bar Card matching video Frame 110s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr auto auto',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              District
            </label>
            <input
              type="text"
              readOnly
              value="Pune"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#475569',
                fontSize: '13px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              Search By ULB
            </label>
            <select
              value={selectedUlb}
              onChange={(e) => setSelectedUlb(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '13px'
              }}
            >
              <option value="PMRDA Pune - 270410">PMRDA Pune - 270410</option>
              <option value="Pune Municipal Corporation (PMC) - 270411">Pune Municipal Corporation (PMC) - 270411</option>
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
            onClick={() => setSearchQuery('')}
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

      {/* Table Section matching frame 170s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {/* Search and Excel bar */}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            title="Export to Excel"
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
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>District</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ULB</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Committee</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>Document</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Created By</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Created On</th>
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
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{item.ulb}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1b539c' }}>{item.committeeName}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      title="Download Gazette Order"
                      onClick={() => alert(`Downloading formation document: ${item.documentName}`)}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        color: '#2563eb'
                      }}
                    >
                      <Download size={14} />
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{item.createdBy}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '12px' }}>{item.createdOn}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        title="Edit Committee"
                        onClick={() => openEditModal(item)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#2563eb'
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        title="View Details"
                        onClick={() => setViewRecord(item)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#0284c7'
                        }}
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

        {/* Table Pagination Footer */}
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

      {/* CREATE / UPDATE COMMITTEE MODAL matching video Frames 125s, 140s, 180s */}
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
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '16px', fontWeight: 800 }}>
                {isEditing ? 'Update Committee' : 'Create Committee'}
              </span>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* District & ULB row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    District
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Pune"
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                    Search By ULB
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="PMRDA Pune - 270410"
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Committee Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hinjawadi Phase 1 Survey Committee"
                  value={formCommitteeName}
                  onChange={(e) => setFormCommitteeName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              {/* Expand / Collapse buttons matching video */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={expandAll}
                  style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Collapse All
                </button>
              </div>

              {/* 1. Head of Committee Accordion */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <div
                  onClick={() => toggleAccordion('head')}
                  style={{
                    backgroundColor: '#e0e7ff',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: '#1e1b4b'
                  }}
                >
                  <span>Head of Committee</span>
                  {accordionState.head ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {accordionState.head && (
                  <div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Select User *
                    </label>
                    <select
                      value={headOfCommittee}
                      onChange={(e) => setHeadOfCommittee(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    >
                      <option value="Rajesh Deshmukh (Addl. Collector, Pune)">Rajesh Deshmukh (Addl. Collector, Pune)</option>
                      <option value="Anil Kadam (Deputy Collector, Land Records)">Anil Kadam (Deputy Collector, Land Records)</option>
                      <option value="Vikas Gaikwad (Superintendent Land Records)">Vikas Gaikwad (Superintendent Land Records)</option>
                      <option value="Dr. Suresh Mane (Joint Director Town Planning)">Dr. Suresh Mane (Joint Director Town Planning)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 2. Committee Assistant Accordion */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <div
                  onClick={() => toggleAccordion('assistant')}
                  style={{
                    backgroundColor: '#e0e7ff',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: '#1e1b4b'
                  }}
                >
                  <span>Committee Assistant</span>
                  {accordionState.assistant ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {accordionState.assistant && (
                  <div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Select User *
                    </label>
                    <select
                      value={assistant}
                      onChange={(e) => setAssistant(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    >
                      <option value="Snehal Patil (Town Planning Officer)">Snehal Patil (Town Planning Officer)</option>
                      <option value="Pravin Shinde (Assistant Director Town Planning)">Pravin Shinde (Assistant Director Town Planning)</option>
                      <option value="Meera Rao (Junior Planner)">Meera Rao (Junior Planner)</option>
                      <option value="Kiran Thite (Survey Inspector)">Kiran Thite (Survey Inspector)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 3. Surveyor Accordion (Dynamic) */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <div
                  onClick={() => toggleAccordion('surveyor')}
                  style={{
                    backgroundColor: '#e0e7ff',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: '#1e1b4b'
                  }}
                >
                  <span>Surveyor ({surveyors.length})</span>
                  {accordionState.surveyor ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {accordionState.surveyor && (
                  <div style={{ padding: '16px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {surveyors.map((srv, idx) => (
                      <div key={idx} style={{ padding: '14px', border: '1px solid #f1f5f9', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1b539c', marginBottom: '10px' }}>
                          Surveyor #{idx + 1}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="Enter surveyor name"
                              value={srv.name}
                              onChange={(e) => handleSurveyorChange(idx, 'name', e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Mobile *</label>
                            <input
                              type="text"
                              required
                              placeholder="10 digit mobile number"
                              value={srv.mobile}
                              onChange={(e) => handleSurveyorChange(idx, 'mobile', e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Email</label>
                            <input
                              type="email"
                              placeholder="Enter email address"
                              value={srv.email}
                              onChange={(e) => handleSurveyorChange(idx, 'email', e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Department</label>
                            <input
                              type="text"
                              placeholder="e.g. PMRDA GIS / Land Records"
                              value={srv.department}
                              onChange={(e) => handleSurveyorChange(idx, 'department', e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            />
                          </div>
                          <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Designation</label>
                            <input
                              type="text"
                              placeholder="e.g. Cadastral Field Surveyor"
                              value={srv.designation}
                              onChange={(e) => handleSurveyorChange(idx, 'designation', e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={handleAddSurveyor}
                        style={{
                          backgroundColor: '#7c3aed',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(124,58,237,0.3)'
                        }}
                        title="Add Another Surveyor"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Document Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Choose Document *
                </label>
                <input
                  type="file"
                  onChange={(e) => setDocumentFile(e.target.files?.[0]?.name || 'PMRDA_COMMITTEE_ORDER.pdf')}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    width: '100%',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Modal Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
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
                    padding: '10px 20px',
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

      {/* VIEW RECORD MODAL */}
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
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '650px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ backgroundColor: '#1b539c', color: '#ffffff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '15px' }}>Committee Details</span>
              <button onClick={() => setViewRecord(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px', fontWeight: 600 }}>Committee Name</span>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>{viewRecord.committeeName}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>District</span>
                  <span style={{ fontWeight: 600 }}>{viewRecord.district}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>ULB</span>
                  <span style={{ fontWeight: 600 }}>{viewRecord.ulb}</span>
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>Head of Committee</span>
                <span style={{ fontWeight: 600, color: '#1b539c' }}>{viewRecord.headOfCommittee}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>Committee Assistant</span>
                <span style={{ fontWeight: 600 }}>{viewRecord.assistant}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px', marginBottom: '6px' }}>Assigned Surveyors ({viewRecord.surveyors.length})</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {viewRecord.surveyors.map((s, idx) => (
                    <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{s.name} - {s.designation}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{s.department} | Mobile: {s.mobile}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                <button
                  onClick={() => setViewRecord(null)}
                  style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
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
