import React, { useState } from 'react';
import {
  PackageCheck,
  CheckCircle2,
  Download,
  ArrowRight,
  ShieldCheck,
  FileText,
  Layers,
  Box,
  Cpu,
  FileCheck
} from 'lucide-react';
import { DeliverableManifestItem, MOCK_DELIVERABLE_MANIFEST, SurveyProject } from '../../../data/survey3dData';

interface DeliverablesSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const DeliverablesSection: React.FC<DeliverablesSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [manifestItems, setManifestItems] = useState<DeliverableManifestItem[]>(MOCK_DELIVERABLE_MANIFEST);
  const [isManifestExported, setIsManifestExported] = useState(false);

  const exportManifestJson = () => {
    const manifest = {
      project: project.id,
      standard: 'NAKSHA V2.0 3D Survey Delivery Standard',
      coordinateSystem: project.crs,
      exportTimestamp: new Date().toISOString(),
      packageSizeBytes: '34.2 GB',
      deliverables: manifestItems
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NAKSHA_Delivery_Manifest_${project.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsManifestExported(true);
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
          <PackageCheck size={16} />
          <span>Deliverable Package Assembler & Cryptographic Manifest Generator</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          2D + 3D Multi-Tier Delivery Architecture
        </div>
      </div>

      {/* Package Summary Box */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '14px 18px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Package Footprint
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f2b5c', marginTop: '2px' }}>
            34.2 GB (8 Artifacts)
          </div>
          <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px' }}>
            SHA-256 Checksums Verified
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Spatial Specification
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
            CityGML 2.0 (LoD2)
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
            412 Reconstructed Solids Extruded
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Package Integrity
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
            100% INTACT & SEALED
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>
            Zero Missing Dependencies
          </div>
        </div>
      </div>

      {/* Manifest Table */}
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
            Delivery Manifest File Inventory ({manifestItems.length} Registered Deliverables)
          </span>

          <button
            onClick={exportManifestJson}
            style={{
              backgroundColor: '#475569',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Download size={12} />
            <span>Generate Manifest JSON</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', borderBottom: '1px solid #cbd5e1', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 12px' }}>Category</th>
                <th style={{ padding: '8px 12px' }}>File Name & Format</th>
                <th style={{ padding: '8px 12px' }}>Payload Size</th>
                <th style={{ padding: '8px 12px' }}>SHA-256 Cryptographic Hash</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {manifestItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 12px', fontWeight: 700, color: '#0f2b5c' }}>
                    {item.category}
                  </td>

                  <td style={{ padding: '9px 12px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.fileName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{item.description}</div>
                  </td>

                  <td style={{ padding: '9px 12px', color: '#475569', fontWeight: 600 }}>
                    {item.sizeBytes}
                  </td>

                  <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: '10.5px', color: '#0284c7' }}>
                    {item.sha256.substring(0, 24)}...
                  </td>

                  <td style={{ padding: '9px 12px' }}>
                    <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                      ✓ READY
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action to proceed to submission */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
        <button
          onClick={() => onNavigateSection('naksha-submission')}
          style={{
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '9px 24px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
          }}
        >
          <span>Proceed to NAKSHA Submission</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
