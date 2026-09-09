import React, { useState } from 'react';
import { 
  FolderOpen, 
  Camera, 
  Box, 
  Layers, 
  FileText, 
  Upload, 
  Download, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  RefreshCw,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Server
} from 'lucide-react';

interface DatasetItem {
  id: string;
  name: string;
  category: 'Nadir ORI' | 'Oblique Drone' | 'LiDAR LAS/LAZ' | 'DSM / DTM' | 'Building Footprint' | 'GNSS / GCP';
  surveyUnit: string;
  fileSize: string;
  resolution: string;
  uploadDate: string;
  pipelineStatus: 'Available' | 'Not Available' | 'Processing';
  derivedLayersCount: number;
}

export const EvidenceVaultPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'done'>('idle');

  const datasets: DatasetItem[] = [
    {
      id: 'DS-001',
      name: 'ORI_Pune_Ward1_SU1_Nadir.tif',
      category: 'Nadir ORI',
      surveyUnit: 'Survey Unit 1 (343671)',
      fileSize: '1.42 GB',
      resolution: '2.5 cm GSD',
      uploadDate: '2025-11-12 14:30',
      pipelineStatus: 'Available',
      derivedLayersCount: 4
    },
    {
      id: 'DS-002',
      name: 'LIDAR_LAS14_Pune_SU1_Dense.laz',
      category: 'LiDAR LAS/LAZ',
      surveyUnit: 'Survey Unit 1 (343671)',
      fileSize: '—',
      resolution: 'Not Acquired',
      uploadDate: '—',
      pipelineStatus: 'Not Available',
      derivedLayersCount: 0
    },
    {
      id: 'DS-003',
      name: 'Oblique_UAV_Pune_W1_Angle45.tif',
      category: 'Oblique Drone',
      surveyUnit: 'Survey Unit 1 (343671)',
      fileSize: '—',
      resolution: 'Not Acquired',
      uploadDate: '—',
      pipelineStatus: 'Not Available',
      derivedLayersCount: 0
    },
    {
      id: 'DS-004',
      name: 'Pune_SU1_Municipal_Footprints.geojson',
      category: 'Building Footprint',
      surveyUnit: 'Survey Unit 1 (343671)',
      fileSize: '8.4 MB',
      resolution: '1:500 Scale CAD',
      uploadDate: '2025-10-04 09:15',
      pipelineStatus: 'Available',
      derivedLayersCount: 6
    },
    {
      id: 'DS-005',
      name: 'GNSS_DGPS_SurveyControl_SU1.csv',
      category: 'GNSS / GCP',
      surveyUnit: 'Survey Unit 1 (343671)',
      fileSize: '420 KB',
      resolution: '±0.010 m RTK',
      uploadDate: '2025-11-15 16:45',
      pipelineStatus: 'Available',
      derivedLayersCount: 18
    },
    {
      id: 'DS-006',
      name: 'DSM_Pune_Urban_Elevation.tif',
      category: 'DSM / DTM',
      surveyUnit: 'Survey Unit 1 (343671)',
      fileSize: '—',
      resolution: 'Not Available',
      uploadDate: '—',
      pipelineStatus: 'Not Available',
      derivedLayersCount: 0
    }
  ];

  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.surveyUnit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleTriggerAsynchronousReconstruction = () => {
    setPipelineState('running');
    setTimeout(() => {
      setPipelineState('done');
      setTimeout(() => setPipelineState('idle'), 4000);
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit', color: '#1e293b' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        backgroundColor: '#ffffff',
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#1976d2', fontWeight: 600 }}>Home</span>
          <span>&gt;</span>
          <span style={{ color: '#1976d2' }}>Property Intelligence</span>
          <span>&gt;</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Evidence Vault & Technical Sensor Datasets</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>Sensor Authenticity Policy:</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            fontSize: '11px',
            fontWeight: 700,
            border: '1px solid #a7f3d0'
          }}>
            Strictly Verified Upstream Data
          </span>
        </div>
      </div>

      {/* Raw Data to 3D Pipeline Visualizer */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={18} color="#1976d2" />
              Automated 3D Reconstruction Pipeline & Data Lineage
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              How raw drone surveys and CAD vector datasets flow into MAP-2 Field Surveyor models
            </p>
          </div>

          <button
            onClick={handleTriggerAsynchronousReconstruction}
            disabled={pipelineState === 'running'}
            style={{
              padding: '8px 16px',
              backgroundColor: pipelineState === 'running' ? '#94a3b8' : '#1976d2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: pipelineState === 'running' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(25, 118, 210, 0.3)'
            }}
          >
            <RefreshCw size={14} />
            {pipelineState === 'running' ? 'Processing Photogrammetry...' : 'Synchronize Derived 3D Layers'}
          </button>
        </div>

        {/* Pipeline Visual Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', textAlign: 'center', fontSize: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#1d4ed8' }}>Step 1</div>
            <div style={{ fontWeight: 700, marginTop: '2px', color: '#1e3a8a' }}>Upload Raw Aerial</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>ORI / LiDAR / Oblique</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#1d4ed8' }}>Step 2</div>
            <div style={{ fontWeight: 700, marginTop: '2px', color: '#1e3a8a' }}>Processing Service</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Dense Mesh / Ortho</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#1d4ed8' }}>Step 3</div>
            <div style={{ fontWeight: 700, marginTop: '2px', color: '#1e3a8a' }}>Derived Dataset</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Footprints / LoD 2.5</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#1d4ed8' }}>Step 4</div>
            <div style={{ fontWeight: 700, marginTop: '2px', color: '#1e3a8a' }}>Validation Check</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>GCP Orthogonal Check</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#047857' }}>Step 5</div>
            <div style={{ fontWeight: 700, marginTop: '2px', color: '#065f46' }}>Available to MAP-2</div>
            <div style={{ fontSize: '10px', color: '#059669' }}>Field Surveyor Ingest</div>
          </div>
        </div>

        {pipelineState === 'done' && (
          <div style={{ padding: '10px 14px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', color: '#065f46', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>Asynchronous synchronization completed. All 6 derived GIS layers updated to latest survey run.</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
          <div style={{ position: 'relative', minWidth: '280px', display: 'flex', alignItems: 'center' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dataset name, file, or survey unit..."
              style={{ width: '100%', padding: '7px 12px 7px 32px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: '#334155' }}>Dataset Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', backgroundColor: '#ffffff', fontSize: '12px', color: '#1e293b' }}
            >
              <option value="ALL">All Technical Categories</option>
              <option value="Nadir ORI">Nadir ORI</option>
              <option value="LiDAR LAS/LAZ">LiDAR LAS/LAZ</option>
              <option value="Oblique Drone">Oblique Drone</option>
              <option value="DSM / DTM">DSM / DTM</option>
              <option value="Building Footprint">Building Footprint</option>
              <option value="GNSS / GCP">GNSS / GCP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Datasets Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#5dade2', color: '#ffffff', fontSize: '11.5px', fontWeight: 600 }}>
                <th style={{ padding: '10px 14px' }}>Dataset ID</th>
                <th style={{ padding: '10px 14px' }}>Dataset File Name</th>
                <th style={{ padding: '10px 14px' }}>Category</th>
                <th style={{ padding: '10px 14px' }}>Survey Unit</th>
                <th style={{ padding: '10px 14px' }}>Resolution / Precision</th>
                <th style={{ padding: '10px 14px' }}>File Size</th>
                <th style={{ padding: '10px 14px' }}>Timestamp</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Pipeline Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDatasets.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#475569' }}>{item.id}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>{item.name}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{item.surveyUnit}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#334155' }}>{item.resolution}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748b' }}>{item.fileSize}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{item.uploadDate}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      backgroundColor: item.pipelineStatus === 'Available' ? '#ecfdf5' : '#f8fafc',
                      color: item.pipelineStatus === 'Available' ? '#047857' : '#64748b',
                      border: item.pipelineStatus === 'Available' ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                    }}>
                      {item.pipelineStatus}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => alert(`Streaming metadata & preview for ${item.name}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#1976d2',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11.5px'
                      }}
                    >
                      <ExternalLink size={13} /> Inspect
                    </button>
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
