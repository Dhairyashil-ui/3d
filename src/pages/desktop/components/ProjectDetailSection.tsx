import React, { useState } from 'react';
import {
  FolderKanban,
  MapPin,
  Calendar,
  Users,
  Shield,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Layers,
  ArrowRight,
  ExternalLink,
  Eye
} from 'lucide-react';
import { SurveyProject, DatasetItem } from '../../../data/survey3dData';
import { GisMap } from '../../../components/common/GisMap';

interface ProjectDetailSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const ProjectDetailSection: React.FC<ProjectDetailSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [activeInputTab, setActiveInputTab] = useState<string>('all');

  const REQUIRED_INPUT_CATEGORIES = [
    { key: 'Drone Images', label: '1. Drone Imagery (Nadir & Oblique)', required: true },
    { key: 'LiDAR', label: '2. Aerial LiDAR Point Cloud', required: true },
    { key: 'GIS', label: '3. Cadastral Vector GIS Data', required: true },
    { key: 'Architecture', label: '4. Building Architecture / Plans', required: false }, // "Do not force architecture data if it is unavailable"
    { key: 'GNSS', label: '5. GNSS / CORS Control Data', required: true },
    { key: 'DSM/DEM', label: '6 & 7. DSM & DEM / DTM Rasters', required: true }
  ];

  const getCategoryStatusBadge = (categoryKey: string) => {
    const matched = project.inputDatasets.find((d) => d.category === categoryKey);
    if (!matched) {
      if (categoryKey === 'Architecture') {
        return (
          <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700 }}>
            OPTIONAL / NOT UPLOADED
          </span>
        );
      }
      return (
        <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700 }}>
          MISSING
        </span>
      );
    }

    const st = matched.validationStatus;
    let bg = '#e0f2fe';
    let text = '#0369a1';
    if (st === 'READY' || st === 'PASS') {
      bg = '#dcfce7';
      text = '#15803d';
    } else if (st === 'PROCESSING') {
      bg = '#fef3c7';
      text = '#b45309';
    } else if (st === 'WARNING') {
      bg = '#ffedd5';
      text = '#c2410c';
    } else if (st === 'FAIL') {
      bg = '#fee2e2';
      text = '#b91c1c';
    }

    return (
      <span style={{ backgroundColor: bg, color: text, padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700 }}>
        {st} • {matched.uploadStatus}
      </span>
    );
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
          <FolderKanban size={16} />
          <span>Project Brief & Survey Dossier — {project.id}</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Status: <b>{project.overallStatus}</b>
        </div>
      </div>

      {/* Top Metadata Cards Grid */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Administrative Jurisdiction
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
            {project.district}, {project.state}
          </div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
            {project.ulb} • {project.ward}
          </div>
          <div style={{ fontSize: '11.5px', color: '#0284c7', marginTop: '2px', fontWeight: 600 }}>
            {project.surveyUnit}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Survey Agency & Assigned Crew
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
            {project.assignedAgency}
          </div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
            {project.assignedTeam}
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px', fontWeight: 600 }}>
            ● Operator Authorized & Authenticated
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            AOI Extent & Coordinate Reference
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
            AOI Area: {project.aoiAreaKm2} km²
          </div>
          <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '2px', fontWeight: 600 }}>
            {project.crs}
          </div>
          <div style={{ fontSize: '11.5px', color: '#b45309', marginTop: '2px', fontWeight: 600 }}>
            Deadline: {project.deadlineDate}
          </div>
        </div>
      </div>

      {/* Main Split: Left AOI Map Component + Right Required Inputs Readiness Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
        {/* Left: AOI Map Viewer (Reuse existing GisMap) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="#0284c7" />
              <span>Project AOI Boundary & Ground Cadastral Footprint</span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Real ESRI Satellite World Imagery
            </span>
          </div>

          <div style={{ flex: 1, minHeight: '340px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <GisMap
              height="360px"
              showAoi={true}
              showCadastral={true}
              showBuildings={true}
              showDronePath={true}
              title={`${project.title} • AOI Envelope`}
            />
          </div>

          <div style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px',
            color: '#64748b'
          }}>
            <span>Legend: <b style={{ color: '#ef4444' }}>■ AOI Geofence</b> | <b style={{ color: '#22c55e' }}>■ Cadastral Parcels</b> | <b style={{ color: '#38bdf8' }}>--- Drone Path</b></span>
            <button
              onClick={() => onNavigateSection('flight-plans')}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Flight Planning</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Right: Required Survey Inputs Readiness Matrix */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '8px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                Required Survey Inputs Readiness
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                7 Core Datasets (2D + 3D Building Reconstruction)
              </div>
            </div>

            <button
              onClick={() => onNavigateSection('data-preparation')}
              style={{
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Upload size={12} />
              <span>Import Data</span>
            </button>
          </div>

          {/* List of 7 Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>
            {REQUIRED_INPUT_CATEGORIES.map((cat) => {
              const matchedDataset = project.inputDatasets.find((d) => d.category === cat.key);

              return (
                <div
                  key={cat.key}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    backgroundColor: matchedDataset ? '#ffffff' : '#fafafa',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>
                      {cat.label}
                    </span>
                    {getCategoryStatusBadge(cat.key)}
                  </div>

                  {matchedDataset ? (
                    <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>File: <b>{matchedDataset.name}</b></span>
                        <span>Size: <b>{matchedDataset.size}</b></span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '11px' }}>
                        Source: {matchedDataset.source}
                      </div>
                      <div style={{ color: '#0369a1', fontSize: '10.5px' }}>
                        {matchedDataset.validationReport}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', fontStyle: 'italic' }}>
                      {cat.key === 'Architecture'
                        ? 'Approved building plans optional if not available from municipal registry.'
                        : 'Dataset pending acquisition or ingestion.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Action to Processing */}
          <div style={{ marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 600 }}>
              ✓ Core Datasets Ready for 3D Pipeline
            </span>
            <button
              onClick={() => onNavigateSection('processing-photogrammetry')}
              style={{
                backgroundColor: '#22c55e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Launch Processing Pipeline</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
