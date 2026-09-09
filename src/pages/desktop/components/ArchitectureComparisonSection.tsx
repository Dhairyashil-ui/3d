import React, { useState } from 'react';
import {
  GitCompare,
  Box,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Info,
  Layers,
  Scale
} from 'lucide-react';
import {
  ArchitectureComparisonRecord,
  MOCK_ARCHITECTURE_COMPARISONS,
  MOCK_RECONSTRUCTED_BUILDINGS,
  SurveyProject
} from '../../../data/survey3dData';

interface ArchitectureComparisonSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const ArchitectureComparisonSection: React.FC<ArchitectureComparisonSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [comparisons, setComparisons] = useState<ArchitectureComparisonRecord[]>(MOCK_ARCHITECTURE_COMPARISONS);
  const building = MOCK_RECONSTRUCTED_BUILDINGS[0];

  const mismatchesCount = comparisons.filter((c) => c.status === 'MISMATCH').length;

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
          <GitCompare size={16} />
          <span>Architecture Sanctioned Plan vs 3D Survey Reconstruction Reconciliation</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Evidence Matching Engine • Objective Variance Verification
        </div>
      </div>

      {/* Critical Legal Boundary Notice */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: '6px',
        padding: '10px 16px',
        fontSize: '12px',
        color: '#92400e',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0 }} />
        <span>
          <b>Statutory Rule:</b> Discrepancies between aerial survey models and municipal architectural records are designated as <b>REVIEW CANDIDATES</b> for administrative enquiry. The desktop workstation does NOT make unilateral legal conclusions regarding property legality.
        </span>
      </div>

      {/* Side-by-Side Visual Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* LEFT: Survey-Derived 3D Model */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #0284c7',
          borderRadius: '6px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Box size={16} />
              <span>SURVEY-DERIVED 3D RECONSTRUCTED MODEL</span>
            </div>
            <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
              Physical Reality
            </span>
          </div>

          <div style={{ backgroundColor: '#0f172a', borderRadius: '6px', padding: '16px', color: '#ffffff', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>{building.buildingName}</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Official ULPIN: <b>{building.officialUlpin}</b></div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Measured Physical Height: <b style={{ color: '#f59e0b' }}>18.6 meters</b></div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Detected Vertical Floors: <b style={{ color: '#f59e0b' }}>5 Floors (Ground + 4)</b></div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Footprint Area: <b>540.8 m²</b> | Total Vol: <b>10,058.9 m³</b></div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '4px' }}>Source: Multi-View Photogrammetry + Riegl LiDAR Point Cloud</div>
          </div>
        </div>

        {/* RIGHT: Approved Sanctioned Plan */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #8b5cf6',
          borderRadius: '6px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} />
              <span>APPROVED SANCTIONED ARCHITECTURAL PLAN</span>
            </div>
            <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
              Municipal Registry
            </span>
          </div>

          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', color: '#1e293b', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#7c3aed' }}>Sanction Drawing IMC/TP/2021/412</div>
            <div style={{ fontSize: '12px', color: '#475569' }}>Registered Plot: <b>101/1, Residency Ward</b></div>
            <div style={{ fontSize: '12px', color: '#475569' }}>Sanctioned Height Limit: <b style={{ color: '#0f2b5c' }}>15.0 meters</b></div>
            <div style={{ fontSize: '12px', color: '#475569' }}>Approved Floor Configuration: <b style={{ color: '#0f2b5c' }}>Ground + 3 Stories (Terrace Open)</b></div>
            <div style={{ fontSize: '12px', color: '#475569' }}>Sanctioned Footprint: <b>540.0 m²</b> | Permissible FAR: <b>2,125 m²</b></div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>Approval Body: Indore Municipal Corporation Town Planning</div>
          </div>
        </div>
      </div>

      {/* Comparison Attribute Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        overflow: 'hidden',
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
            Multi-Parameter Variance Matrix ({comparisons.length} Evaluated Parameters)
          </span>

          <span style={{
            backgroundColor: mismatchesCount > 0 ? '#fee2e2' : '#dcfce7',
            color: mismatchesCount > 0 ? '#b91c1c' : '#15803d',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700
          }}>
            {mismatchesCount} Variances Detected (Flagged for Review)
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', borderBottom: '1px solid #cbd5e1', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 12px' }}>Attribute</th>
                <th style={{ padding: '8px 12px' }}>Survey 3D Model</th>
                <th style={{ padding: '8px 12px' }}>Sanctioned Architecture Plan</th>
                <th style={{ padding: '8px 12px' }}>Variance / Difference</th>
                <th style={{ padding: '8px 12px' }}>Reconciliation Result</th>
                <th style={{ padding: '8px 12px' }}>Auditor Notes</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f2b5c' }}>
                    {c.attribute}
                  </td>

                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>
                    {c.surveyValue}
                  </td>

                  <td style={{ padding: '10px 12px', color: '#475569' }}>
                    {c.architecturePlanValue}
                  </td>

                  <td style={{ padding: '10px 12px', fontWeight: 700, color: c.status === 'MISMATCH' ? '#b91c1c' : '#15803d' }}>
                    {c.varianceValue}
                  </td>

                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      backgroundColor: c.status === 'MATCH' ? '#dcfce7' : '#fef3c7',
                      color: c.status === 'MATCH' ? '#166534' : '#b45309',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'inline-block'
                    }}>
                      {c.status === 'MATCH' ? '✓ MATCH' : '⚠️ REVIEW CANDIDATE'}
                    </span>
                  </td>

                  <td style={{ padding: '10px 12px', fontSize: '11px', color: '#64748b' }}>
                    {c.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => onNavigateSection('verification-gis')}
          style={{
            backgroundColor: '#475569',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Layers size={14} />
          <span>Switch to GIS Cadastral Comparison</span>
        </button>

        <button
          onClick={() => onNavigateSection('verification-anomalies')}
          style={{
            backgroundColor: '#f59e0b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 18px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Send Review Candidates to Anomaly Queue</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
