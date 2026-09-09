import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Download,
  ArrowRight,
  Layers,
  Box
} from 'lucide-react';
import { SurveyProject } from '../../../data/survey3dData';

interface NakshaSubmissionSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const NakshaSubmissionSection: React.FC<NakshaSubmissionSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'IDLE' | 'PROCESSING' | 'ACCEPTED' | 'CORRECTION_REQUIRED'>('IDLE');
  const [submissionReceiptId, setSubmissionReceiptId] = useState<string | null>(null);

  const checklistItems = [
    { label: 'Required Survey Inputs Ingested (7 Core Datasets)', passed: true },
    { label: 'Multi-Sensor Data Validation (PASS on all files)', passed: true },
    { label: 'Comprehensive 3D QA/QC Matrix Cleared (13/13 Passed)', passed: true },
    { label: 'Coordinate Reference System Verified (EPSG: 32643)', passed: true },
    { label: 'LoD2 3D Geometry Validated (Watertight 2-Manifolds)', passed: true },
    { label: 'Metadata & Provenance Complete (ISO 19115 Schema)', passed: true },
    { label: 'Package Cryptographic Integrity Verified (SHA-256)', passed: true }
  ];

  const handleStartSubmission = () => {
    setIsSubmitting(true);
    setSubmissionStatus('PROCESSING');

    const steps = [
      'Encrypted Stream Uploading to NAKSHA Cloud (34.2 GB)...',
      'Phase 1: XML & JSON Schema Validation...',
      'Phase 2: Coordinate Reference System Integrity (EPSG:32643)...',
      'Phase 3: Administrative AOI Geofence Verification...',
      'Phase 4: ISO 19115 Metadata & Operator Provenance Check...',
      'Phase 5: 3D LoD2 Solid Geometry & Topology Verification...',
      'Phase 6: Official Survey Submission Received & Registered!'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setSubmissionStage(step);
        if (index === steps.length - 1) {
          setIsSubmitting(false);
          setIsCompleted(true);
          setSubmissionStatus('ACCEPTED');
          setSubmissionReceiptId(`NAKSHA-V2-REC-${project.id}-${Date.now().toString().slice(-6)}`);
        }
      }, (index + 1) * 600);
    });
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
          <Send size={16} />
          <span>Final NAKSHA V2.0 National Portal Submission Gateway</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Ministry of Rural Development • Survey of India Direct Ingestion
        </div>
      </div>

      {/* Main Container */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Project & Package Brief */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '14px 18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Project Identifier</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f2b5c', marginTop: '2px' }}>{project.id}</div>
            <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '1px' }}>{project.ward}, {project.district}</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Package</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>34.2 GB • 8 Files</div>
            <div style={{ fontSize: '11.5px', color: '#15803d', marginTop: '1px' }}>✓ Manifest Signed</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Quality Audit Status</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>PASSED (0 Fails)</div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>RMS: 0.009m H / 0.014m V</div>
          </div>
        </div>

        {/* Pre-Submission Gatekeeper Checklist */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
            Pre-Submission Automated Verification Interlock:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {checklistItems.map((chk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#1e293b' }}>
                <CheckCircle2 size={15} color="#22c55e" />
                <span>{chk.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Execution & Progress Bar */}
        {submissionStatus === 'PROCESSING' && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1.5px solid #60a5fa',
            borderRadius: '6px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', fontWeight: 700, fontSize: '13px' }}>
              <RefreshCw size={15} className="spin" />
              <span>Transmitting & Validating Package on NAKSHA Core Service:</span>
            </div>

            <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>
              {submissionStage}
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: '#bfdbfe', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: '#2563eb', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        )}

        {/* Accepted Receipt Banner */}
        {submissionStatus === 'ACCEPTED' && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '6px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={24} color="#15803d" />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#15803d' }}>
                    SUBMISSION ACCEPTED & OFFICIALLY REGISTERED
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '2px' }}>
                    Receipt Identifier: <b>{submissionReceiptId}</b>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`Official Electronic Acknowledgement Receipt (${submissionReceiptId}) downloaded.`)}
                style={{
                  backgroundColor: '#15803d',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={13} />
                <span>Download Official Receipt</span>
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#166534', lineHeight: 1.5, borderTop: '1px solid #bbf7d0', paddingTop: '8px' }}>
              The 2D and 3D geospatial datasets, DSM/DEM elevation surfaces, and 412 LoD2 reconstructed building volumetrics have been validated against NAKSHA V2.0 national schemas and officially committed to the State and District registry.
            </div>
          </div>
        )}

        {/* Submit Action Bar */}
        {submissionStatus === 'IDLE' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
            <div style={{ fontSize: '11.5px', color: '#64748b' }}>
              Authenticated Surveyor: <b>soi_operator_01</b> (Survey of India Drone Wing)
            </div>

            <button
              onClick={handleStartSubmission}
              disabled={isSubmitting}
              style={{
                backgroundColor: '#0ea5e9',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 28px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)',
                letterSpacing: '0.3px'
              }}
            >
              <Send size={15} />
              <span>SUBMIT TO NAKSHA</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
