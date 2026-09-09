import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { MOCK_QAQC_CHECKS, QaQcCriterion, SurveyProject } from '../../../data/survey3dData';

interface QualityControlSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const QualityControlSection: React.FC<QualityControlSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [checks, setChecks] = useState<QaQcCriterion[]>(MOCK_QAQC_CHECKS);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const totalPassed = checks.filter((c) => c.status === 'PASS').length;
  const criticalFailed = checks.filter((c) => c.isCritical && c.status === 'FAIL').length;

  const filteredChecks = filterCategory === 'all'
    ? checks
    : checks.filter((c) => c.category === filterCategory);

  const categories = ['all', 'Accuracy', 'Coverage', 'LiDAR', 'Surface', '3D Geometry', 'Topology'];

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
          <ClipboardCheck size={16} />
          <span>Comprehensive 3D QA / QC Quality Assurance Matrix & Certification</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Survey of India Topographical & Volumetric Accuracy Standard
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '12px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>QA / QC Verdict:</span>
            <span style={{
              backgroundColor: criticalFailed === 0 ? '#dcfce7' : '#fee2e2',
              color: criticalFailed === 0 ? '#15803d' : '#b91c1c',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800
            }}>
              {criticalFailed === 0 ? '✓ PASSED FOR NAKSHA SUBMISSION' : '❌ CRITICAL QC FAILURE'}
            </span>
          </div>

          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Passed Checks: <b style={{ color: '#15803d' }}>{totalPassed}</b> / {checks.length}
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                backgroundColor: filterCategory === cat ? '#0284c7' : '#f1f5f9',
                color: filterCategory === cat ? '#ffffff' : '#475569',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* QC Criteria Table */}
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
                <th style={{ padding: '8px 12px' }}>Category</th>
                <th style={{ padding: '8px 12px' }}>Inspection Rule & Criterion</th>
                <th style={{ padding: '8px 12px' }}>Prescribed Tolerance</th>
                <th style={{ padding: '8px 12px' }}>Measured Survey Value</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
                <th style={{ padding: '8px 12px' }}>Auditor Observations</th>
              </tr>
            </thead>
            <tbody>
              {filteredChecks.map((qc) => {
                const isPass = qc.status === 'PASS';

                return (
                  <tr key={qc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 700, color: '#0f2b5c' }}>
                      {qc.category}
                    </td>

                    <td style={{ padding: '9px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{qc.criterion}</div>
                      {qc.isCritical && (
                        <div style={{ fontSize: '10px', color: '#b91c1c', fontWeight: 700 }}>
                          • Critical Mandatory Parameter
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '9px 12px', color: '#475569', fontFamily: 'monospace' }}>
                      {qc.tolerance}
                    </td>

                    <td style={{ padding: '9px 12px', fontWeight: 700, color: '#0f2b5c', fontFamily: 'monospace' }}>
                      {qc.measuredValue}
                    </td>

                    <td style={{ padding: '9px 12px' }}>
                      <span style={{
                        backgroundColor: isPass ? '#dcfce7' : '#fee2e2',
                        color: isPass ? '#15803d' : '#b91c1c',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-block'
                      }}>
                        {isPass ? '✓ PASS' : 'FAIL'}
                      </span>
                    </td>

                    <td style={{ padding: '9px 12px', fontSize: '11px', color: '#64748b' }}>
                      {qc.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => alert('Official Signed QA/QC Quality Certification PDF generated and saved to deliverables folder.')}
          style={{
            backgroundColor: '#475569',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Download size={13} />
          <span>Export Signed QA/QC Quality Certificate</span>
        </button>

        <button
          onClick={() => onNavigateSection('deliverables')}
          disabled={criticalFailed > 0}
          style={{
            backgroundColor: criticalFailed === 0 ? '#22c55e' : '#cbd5e1',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 20px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: criticalFailed === 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Assemble Deliverable Package</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
