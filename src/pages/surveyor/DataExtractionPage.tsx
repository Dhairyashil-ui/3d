import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { AssignedUnitView } from '../../components/surveyor/extraction/AssignedUnitView';
import { DualTeamVerificationView } from '../../components/surveyor/extraction/DualTeamVerificationView';
import { CinematicReconstructionPipeline } from '../../components/surveyor/extraction/CinematicReconstructionPipeline';
import { InteractiveBuildingInspectionView } from '../../components/surveyor/extraction/InteractiveBuildingInspectionView';
import { Layers, ShieldCheck, Box, CheckCircle2 } from 'lucide-react';

type ExtractionWorkflowStep = 'unit_assignment' | 'team_verification' | 'cinematic_pipeline' | 'interactive_model';

export const DataExtractionPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ExtractionWorkflowStep>('unit_assignment');

  // Step 1 -> Step 2
  const handleFinaliseUnit = () => {
    setCurrentStep('team_verification');
  };

  // Step 2 -> Step 3
  const handleStartConstruction = () => {
    setCurrentStep('cinematic_pipeline');
  };

  // Step 3 -> Step 4
  const handleCinematicComplete = () => {
    setCurrentStep('interactive_model');
  };

  // Step 3 Cancel / Exit
  const handleExitCinematic = () => {
    setCurrentStep('team_verification');
  };

  // Replay
  const handleReplayPipeline = () => {
    setCurrentStep('cinematic_pipeline');
  };

  const breadcrumbItems = [
    { label: 'Survey Activities', path: '/surveyor/survey-activities' },
    { label: 'Data Extraction', path: '/surveyor/data-extraction' }
  ];

  // If in full screen cinematic mode, render pipeline directly without outer layout wrapper
  if (currentStep === 'cinematic_pipeline') {
    return (
      <CinematicReconstructionPipeline 
        onComplete={handleCinematicComplete}
        onExit={handleExitCinematic}
      />
    );
  }

  return (
    <div style={{ padding: '20px 24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Sequential Workflow Step Navigator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: currentStep === 'unit_assignment' ? '#2563eb' : '#f1f5f9',
            color: currentStep === 'unit_assignment' ? '#ffffff' : '#64748b',
            cursor: 'pointer'
          }}
          onClick={() => setCurrentStep('unit_assignment')}
          >
            <span>1. Assigned Survey Unit & Ingestion</span>
          </div>

          <span style={{ color: '#cbd5e1' }}>→</span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: currentStep === 'team_verification' ? '#2563eb' : '#f1f5f9',
            color: currentStep === 'team_verification' ? '#ffffff' : '#64748b',
            cursor: 'pointer'
          }}
          onClick={() => setCurrentStep('team_verification')}
          >
            <span>2. Team 1 vs Team 2 Dual Audit</span>
          </div>

          <span style={{ color: '#cbd5e1' }}>→</span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: currentStep === 'interactive_model' ? '#16a34a' : '#f1f5f9',
            color: currentStep === 'interactive_model' ? '#ffffff' : '#64748b',
            cursor: currentStep === 'interactive_model' ? 'pointer' : 'default'
          }}
          >
            <span>3. 3D Reconstructed Building Model</span>
          </div>
        </div>

        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
          Authoritative Aerial Survey • Hinjawadi IT Park SU-04
        </div>
      </div>

      {/* Screen 1: Assigned Survey Unit */}
      {currentStep === 'unit_assignment' && (
        <AssignedUnitView onFinalise={handleFinaliseUnit} />
      )}

      {/* Screen 2: Team 1 vs Team 2 Dual Audit Verification */}
      {currentStep === 'team_verification' && (
        <DualTeamVerificationView 
          onStartConstruction={handleStartConstruction}
          onBackToUnit={() => setCurrentStep('unit_assignment')}
        />
      )}

      {/* Screen 4: Final Interactive 3D Model Inspection */}
      {currentStep === 'interactive_model' && (
        <InteractiveBuildingInspectionView 
          onReplayPipeline={handleReplayPipeline}
        />
      )}
    </div>
  );
};

export default DataExtractionPage;
