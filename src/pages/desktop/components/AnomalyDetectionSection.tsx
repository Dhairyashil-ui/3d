import React, { useState } from 'react';
import {
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  Filter,
  Eye
} from 'lucide-react';
import { AnomalyCase, MOCK_ANOMALY_QUEUE, SurveyProject } from '../../../data/survey3dData';

interface AnomalyDetectionSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
  onSelectFieldOrder?: (orderId: string) => void;
}

export const AnomalyDetectionSection: React.FC<AnomalyDetectionSectionProps> = ({
  project,
  onNavigateSection,
  onSelectFieldOrder
}) => {
  const [anomalies, setAnomalies] = useState<AnomalyCase[]>(MOCK_ANOMALY_QUEUE);
  const [selectedCase, setSelectedCase] = useState<AnomalyCase | null>(anomalies[0] || null);

  const handleUpdateStatus = (caseId: string, newStatus: AnomalyCase['status']) => {
    setAnomalies((prev) =>
      prev.map((c) => (c.caseId === caseId ? { ...c, status: newStatus } : c))
    );
    if (selectedCase?.caseId === caseId) {
      setSelectedCase((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
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
          <AlertTriangle size={16} />
          <span>Automated 3D Anomaly Detection & Review Candidate Queue</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Objective Variance Flagging (No Automatic Legal Conclusions)
        </div>
      </div>

      {/* Main Split: Left Anomaly Queue Table + Right Anomaly Dossier & Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
        {/* Left: Anomaly List Table */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '10px 16px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
              Flagged Review Cases ({anomalies.length})
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Select case to inspect evidence
            </span>
          </div>

          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', borderBottom: '1px solid #cbd5e1', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 10px' }}>Case ID</th>
                  <th style={{ padding: '8px 10px' }}>Anomaly Type</th>
                  <th style={{ padding: '8px 10px' }}>ULPIN / Parcel</th>
                  <th style={{ padding: '8px 10px' }}>Confidence</th>
                  <th style={{ padding: '8px 10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.map((anom) => {
                  const isSel = selectedCase?.caseId === anom.caseId;

                  return (
                    <tr
                      key={anom.caseId}
                      onClick={() => setSelectedCase(anom)}
                      style={{
                        backgroundColor: isSel ? '#eff6ff' : '#ffffff',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '9px 10px', fontWeight: 700, color: '#0f2b5c' }}>
                        <div>{anom.caseId}</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{anom.buildingId}</div>
                      </td>

                      <td style={{ padding: '9px 10px' }}>
                        <div style={{ fontWeight: 600, color: '#b91c1c' }}>{anom.anomalyType}</div>
                      </td>

                      <td style={{ padding: '9px 10px' }}>
                        <div style={{ fontWeight: 600, color: '#0284c7' }}>{anom.ulpin}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Parcel #{anom.parcelNo}</div>
                      </td>

                      <td style={{ padding: '9px 10px', fontWeight: 700, color: '#0f2b5c' }}>
                        {anom.confidenceScorePct}%
                      </td>

                      <td style={{ padding: '9px 10px' }}>
                        <span style={{
                          backgroundColor: anom.status === 'Resolved' ? '#dcfce7' : anom.status === 'Field Dispatched' ? '#fef3c7' : '#fee2e2',
                          color: anom.status === 'Resolved' ? '#15803d' : anom.status === 'Field Dispatched' ? '#b45309' : '#b91c1c',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10.5px',
                          fontWeight: 700
                        }}>
                          {anom.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Case Dossier & Action Dispatcher */}
        {selectedCase ? (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f2b5c' }}>
                  Case Dossier: {selectedCase.caseId}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Building: <b>{selectedCase.buildingId}</b> • Official ULPIN: <b>{selectedCase.ulpin}</b>
                </div>
              </div>

              <span style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                Confidence: {selectedCase.confidenceScorePct}%
              </span>
            </div>

            {/* Evidence Text Box */}
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '4px',
              padding: '10px 12px',
              fontSize: '11.5px',
              color: '#92400e',
              lineHeight: 1.5
            }}>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>Detected Geospatial & Registry Evidence:</div>
              {selectedCase.detectedEvidence}
            </div>

            {/* Recommended Action */}
            <div style={{ fontSize: '12px', color: '#334155' }}>
              Recommended Remediation: <b style={{ color: '#0284c7' }}>{selectedCase.recommendedAction}</b>
            </div>

            {/* Action Buttons: Review, Correct, Field Verification, Hold, Resolve */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                Surveyor Resolution Actions:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  onClick={() => onNavigateSection('verification-field')}
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <FileCheck2 size={13} />
                  <span>Dispatch Field Verification</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedCase.caseId, 'Resolved')}
                  style={{
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Mark Resolved (Evidence Reconciled)</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedCase.caseId, 'Held')}
                  style={{
                    backgroundColor: '#64748b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hold for Municipal Input
                </button>

                <button
                  onClick={() => onNavigateSection('reconstruction-buildings')}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={13} />
                  <span>Inspect in 3D Viewer</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
