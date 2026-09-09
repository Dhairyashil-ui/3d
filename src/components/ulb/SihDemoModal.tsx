import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Play,
  Layers,
  Search,
  ShieldCheck,
  Send,
  AlertTriangle
} from 'lucide-react';

interface SihDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIH_STEPS = [
  {
    stepNumber: 1,
    title: 'Open ULB Dashboard',
    judgeOutcome: 'Show operational verification workload across Urban Local Body.',
    route: '/ulb/dashboard',
    description:
      'The ULB Admin opens the operational dashboard to oversee 842 surveyed buildings, 18 pending anomalies, and 32 parcels ready for District publication handoff.'
  },
  {
    stepNumber: 2,
    title: 'Open 2D GIS Map & Filter Parcel',
    judgeOutcome: 'Select a multi-storey urban parcel with drone footprint.',
    route: '/ulb/map',
    description:
      'Filter by District Pune → ULB PMRDA-270410 → Ward 1 Manakna. Identify multi-storey parcel #101/1 with official ULPIN 25094601101001.'
  },
  {
    stepNumber: 3,
    title: 'Inspect Parcel & ULPIN Context',
    judgeOutcome: 'Show parcel, 14-digit ULPIN anchor, and connected municipal records.',
    route: '/ulb/parcel/25094601101001',
    description:
      'Inspect parcel 101/1: Official ULPIN (25094601101001) anchors 540.8 m² land area, connected property tax IDs, and drone flight metadata.'
  },
  {
    stepNumber: 4,
    title: 'Switch to 3D Vertical View',
    judgeOutcome: 'Show physical building anchored directly to 2D land parcel.',
    route: '/ulb/3d-view',
    description:
      'The 2D parcel extrudes into the physical 3D structure: Mansarovar Complex with 4 floors and 14.5m total surveyed height.'
  },
  {
    stepNumber: 5,
    title: 'Explode Building into Vertical Slices',
    judgeOutcome: 'Show floors and individual property/unit volumes.',
    route: '/ulb/3d-view',
    description:
      'Activate Exploded Cutaway View. Each floor plate separates vertically, revealing individual unit volumes (Shops, Offices, Residential Flats, and Penthouse).'
  },
  {
    stepNumber: 6,
    title: 'Run Automated Verification',
    judgeOutcome: 'Compare physical survey evidence against municipal registries.',
    route: '/ulb/record-comparison',
    description:
      'System executes multi-source evidence reconciliation: Surveyed Drone ORI vs Cadastral Boundary vs Property Tax Registry vs RoR.'
  },
  {
    stepNumber: 7,
    title: 'Detect Critical Anomaly',
    judgeOutcome: 'Flag: "No matching registration record found in connected dataset".',
    route: '/ulb/verification-queue',
    description:
      'Floor 3 Penthouse Unit 301 is physically detected by drone photogrammetry (+10.2m elevation), but has 0 matching municipal registration records.'
  },
  {
    stepNumber: 8,
    title: 'Create Review Candidate',
    judgeOutcome: 'Show 96% confidence score, spatial evidence, and recommended action.',
    route: '/ulb/verification-queue',
    description:
      'An automated Review Candidate is created with AI confidence of 96% and recommended action: "Dispatch field verification with GNSS RTK".'
  },
  {
    stepNumber: 9,
    title: 'Dispatch Field Verification',
    judgeOutcome: 'Capture field remarks and GNSS rover measurements.',
    route: '/ulb/verification-queue',
    description:
      'ULB officer dispatches Field Surveyor Amit Verma. Field remarks and real-time photos are captured on-ground.'
  },
  {
    stepNumber: 10,
    title: 'Resolve & Link Record',
    judgeOutcome: 'Correct record and link to composite reference ULPIN-B001-F3-U301.',
    route: '/ulb/verification-queue',
    description:
      'ULB Admin resolves the anomaly, applies commercial/residential tax assessment, and links the verified 3D volume.'
  },
  {
    stepNumber: 11,
    title: 'Forward to District Admin',
    judgeOutcome: 'Prepare verified 3D-aware record package for District publication.',
    route: '/ulb/publication-preparation',
    description:
      'The ULB verification package is approved by the ULB Commissioner and forwarded to District Admin (Pune DM) for gazette publication.'
  },
  {
    stepNumber: 12,
    title: 'District Admin Final Publication',
    judgeOutcome: 'District approves with OTP + DSC e-Sign or rejects back to ULB.',
    route: '/portal/survey-activities/manage-publication',
    description:
      'District Collector reviews the ULB-forwarded 3D dossier, verifies OTP, applies Digital Signature Certificate, and locks the final record!'
  }
];

export const SihDemoModal: React.FC<SihDemoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = SIH_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < SIH_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      navigate(SIH_STEPS[nextIdx].route);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      navigate(SIH_STEPS[prevIdx].route);
    }
  };

  const jumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    navigate(SIH_STEPS[index].route);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '820px',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          backgroundColor: '#0f2b5c',
          backgroundImage: 'linear-gradient(90deg, #0f2b5c 0%, #1b539c 100%)',
          color: '#ffffff',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '10px'
            }}>
              SIH 2026 OFFICIAL SCENARIO
            </span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              12-Step 2D → 3D Property Intelligence Demonstration
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div style={{
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto'
        }}>
          {SIH_STEPS.map((s, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={s.stepNumber}
                onClick={() => jumpToStep(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: isCurrent ? '#1b539c' : isCompleted ? '#dcfce7' : '#ffffff',
                  color: isCurrent ? '#ffffff' : isCompleted ? '#166534' : '#64748b',
                  border: isCurrent ? '1.5px solid #1b539c' : isCompleted ? '1px solid #86efac' : '1px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{s.stepNumber}.</span>
                <span>{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Card */}
        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Step {currentStep.stepNumber} of 12
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', margin: '4px 0 8px 0' }}>
                {currentStep.title}
              </h2>
            </div>

            <button
              onClick={() => {
                navigate(currentStep.route);
                onClose();
              }}
              style={{
                backgroundColor: '#eff6ff',
                color: '#1b539c',
                border: '1px solid #bfdbfe',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <span>View Active Page</span>
              <ExternalLink size={12} />
            </button>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
              {currentStep.description}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '10px 14px',
              borderRadius: '6px'
            }}>
              <CheckCircle2 size={18} color="#059669" />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>
                  Judge-Visible Outcome:
                </span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#047857' }}>
                  {currentStep.judgeOutcome}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              borderRadius: '6px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStepIndex === 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ChevronLeft size={16} />
            <span>Previous Step</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                navigate(currentStep.route);
                onClose();
              }}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #1b539c',
                color: '#1b539c',
                borderRadius: '6px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Explore Screen Directly
            </button>

            {currentStepIndex < SIH_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                style={{
                  backgroundColor: '#1b539c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 22px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Next Step</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 22px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Complete Demo ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
