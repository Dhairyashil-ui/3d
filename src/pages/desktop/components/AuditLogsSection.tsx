import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Clock,
  UserCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { AuditLogEntry, MOCK_AUDIT_LOGS, SurveyProject } from '../../../data/survey3dData';

interface AuditLogsSectionProps {
  project: SurveyProject;
}

export const AuditLogsSection: React.FC<AuditLogsSectionProps> = ({ project }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.dataset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'all' || log.stage.toLowerCase().includes(filterStage.toLowerCase());
    return matchesSearch && matchesStage;
  });

  const exportAuditLogCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'User', 'Role', 'Processing Stage', 'Action', 'Dataset', 'Previous Value', 'New Value', 'Reason'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      l.user,
      l.role,
      `"${l.stage}"`,
      `"${l.action}"`,
      `"${l.dataset}"`,
      `"${l.previousValue}"`,
      `"${l.newValue}"`,
      `"${l.reason}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NAKSHA_Audit_Log_${project.id}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
      {/* Cyan Header Banner */}
      <div style={{
        backgroundColor: '#06b6d4',
        backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #0284c7 100%)',
        color: '#ffffff',
        padding: '10px 18px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ScrollText size={16} />
          <span>Audit Trail & Geospatial Processing Provenance Log</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Immutable Transaction & Operator Action Registry
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
          <Search size={14} color="#64748b" />
          <input
            type="text"
            placeholder="Search action, dataset, user, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>Filter Stage:</span>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }}
          >
            <option value="all">All Processing Stages</option>
            <option value="Field Verification">Field Verification</option>
            <option value="3D QA/QC">3D QA/QC</option>
            <option value="Reconstruction">3D Reconstruction</option>
            <option value="Data Preparation">Data Preparation</option>
          </select>

          <button
            onClick={exportAuditLogCsv}
            style={{
              backgroundColor: '#475569',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #cbd5e1', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 10px' }}>Timestamp</th>
                <th style={{ padding: '8px 10px' }}>User & Role</th>
                <th style={{ padding: '8px 10px' }}>Stage</th>
                <th style={{ padding: '8px 10px' }}>Action & Target Dataset</th>
                <th style={{ padding: '8px 10px' }}>Previous &rarr; New Value</th>
                <th style={{ padding: '8px 10px' }}>Justification / Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 10px', fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {log.timestamp}
                  </td>

                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ fontWeight: 700, color: '#0f2b5c' }}>{log.user}</div>
                    <div style={{ fontSize: '10.5px', color: '#0284c7' }}>{log.role}</div>
                  </td>

                  <td style={{ padding: '9px 10px' }}>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                      {log.stage}
                    </span>
                  </td>

                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{log.action}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{log.dataset}</div>
                  </td>

                  <td style={{ padding: '9px 10px', fontSize: '11px' }}>
                    <div style={{ color: '#64748b' }}>From: {log.previousValue}</div>
                    <div style={{ color: '#15803d', fontWeight: 600, marginTop: '2px' }}>To: {log.newValue}</div>
                  </td>

                  <td style={{ padding: '9px 10px', fontSize: '11px', color: '#475569' }}>
                    {log.reason}
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
