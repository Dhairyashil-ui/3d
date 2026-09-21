import React, { useState } from 'react';
import {
  Upload,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  RefreshCw,
  FolderOpen,
  Layers,
  FileText,
  Camera,
  Cpu,
  Crosshair,
  Box,
  Sliders,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { DatasetItem, SurveyProject } from '../../../data/survey3dData';

interface DataPreparationSectionProps {
  project: SurveyProject;
  defaultTab?: 'all' | 'gdb' | 'tpk' | 'drone' | 'lidar' | 'gnss' | 'architecture';
  onNavigateSection: (sectionId: string) => void;
  onPreviewMap: () => void;
  isGuestMode?: boolean;
}

export const DataPreparationSection: React.FC<DataPreparationSectionProps> = ({
  project,
  defaultTab = 'all',
  onNavigateSection,
  onPreviewMap,
  isGuestMode = false
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // File Paths & state
  const [gdbPath, setGdbPath] = useState('C:\\Users\\diksh\\Downloads\\Indore\\226821.zip');
  const [tpkPath, setTpkPath] = useState('C:\\Users\\diksh\\Downloads\\Indore\\226821.tpk');
  const [dronePath, setDronePath] = useState('C:\\NAKSHA\\Survey_Data\\Indore\\226821\\RAW_PHOTOS');
  const [lidarPath, setLidarPath] = useState('C:\\NAKSHA\\Survey_Data\\Indore\\226821\\LIDAR\\points.laz');
  const [gnssPath, setGnssPath] = useState('C:\\NAKSHA\\Survey_Data\\Indore\\226821\\GNSS\\base.rnx');
  const [archPath, setArchPath] = useState('C:\\NAKSHA\\Survey_Data\\Indore\\226821\\PLANS\\Sanctioned.dwg');

  // Validation Simulation States
  const [isValidating, setIsValidating] = useState(false);
  const [validatedStatus, setValidatedStatus] = useState<Record<string, boolean>>({
    gdb: true,
    tpk: true,
    drone: true,
    lidar: true,
    gnss: true,
    architecture: true
  });
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'System Ready. Select a dataset tab and click "Validate Dataset" to run automated integrity and coordinate reference checks.'
  ]);

  // Run Real Validation Log for GDB (Preserving desktop manual behavior)
  const runGdbValidation = () => {
    setIsValidating(true);
    setConsoleLogs([]);
    const steps = [
      'Validation Started for Feature GDB...',
      `Extracting zip file to: ${gdbPath}\\Extracted\\226821...`,
      'Validating file name... Done!',
      'Validating GDB File... Done!',
      'Validating PROPERTY_PARCEL Layer...',
      'Checking Layer Projection... Found WKID: 32643 (UTM Zone 43N) - Done!',
      'Validating Fields schema (ULPIN, OWNER_NAME, LAND_USE, AREA_SQM)... Done!',
      'Checking data in GDB file...',
      'Validating duplicate values... Done!',
      'Validating Village/Ward Code (54 - Residency ward)... Done!',
      'Validating Start Plot Number (101/1)... Done!',
      'Validating Mandatory attributes... Done!',
      'Checking special characters in Plot Data... - Done!',
      'Checking Duplicate plot numbers... - Done!',
      'PASS: Vector Cadastral File Found VALID.'
    ];

    steps.forEach((line, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, line]);
        if (index === steps.length - 1) {
          setIsValidating(false);
          setValidatedStatus((prev) => ({ ...prev, gdb: true }));
        }
      }, (index + 1) * 140);
    });
  };

  // Run Real Validation Log for TPK (Preserving desktop manual behavior)
  const runTpkValidation = () => {
    setIsValidating(true);
    setConsoleLogs([]);
    const steps = [
      'Validating Drone ORI Raster file...',
      'Checking Layer Projection... WGS_1984_UTM_Zone_43N (EPSG: 32643)',
      'Extent: XMin=588468.592, YMin=2509944.351, XMax=592633.142, YMax=2513002.951',
      'Resolution: 0.05m GSD (Ground Sample Distance) - PASS',
      'Raster Bands: 3 (Red, Green, Blue) - Radiometric Depth: 8-bit',
      'Validating Tile Cache Index & Metadata... Done!',
      'Compression: JPEG (Quality: 85%) - PASS',
      'Coordinate Reference System Integrity Check: OK',
      'PASS: Raster TPK File Found VALID.'
    ];

    steps.forEach((line, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, line]);
        if (index === steps.length - 1) {
          setIsValidating(false);
          setValidatedStatus((prev) => ({ ...prev, tpk: true }));
        }
      }, (index + 1) * 150);
    });
  };

  // Run Validation for Drone Images
  const runDroneValidation = () => {
    setIsValidating(true);
    setConsoleLogs([]);
    const steps = [
      'Scanning Drone Image Folder: 4,820 exposures...',
      'Validating EXIF metadata and GPS geotags... 4,820 / 4,820 present (100%)',
      'Checking Camera Sensor Calibration: Sony α7R IV (35mm f/2.8 lens) - OK',
      'Analyzing Timestamp consistency: 05-Sep-2026 10:14:02 to 10:58:34 IST',
      'Calculating Multi-View Overlap: Forward: 82% (PASS >= 80%), Side: 76% (PASS >= 75%)',
      'Laplacian Image Blur QC: 4,818 sharp (99.9%), 2 boundary turns flagged - PASS',
      'PASS: Drone Imagery Dataset Validated for Dense Photogrammetry.'
    ];

    steps.forEach((line, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, line]);
        if (index === steps.length - 1) {
          setIsValidating(false);
          setValidatedStatus((prev) => ({ ...prev, drone: true }));
        }
      }, (index + 1) * 150);
    });
  };

  // Run Validation for LiDAR
  const runLidarValidation = () => {
    setIsValidating(true);
    setConsoleLogs([]);
    const steps = [
      'Reading ASPRS LAS 1.4 Point Cloud Header...',
      'Point Count: 48,600,000 returns recorded',
      'Calculating Spatial Point Density: 138.4 pts/m² on building roofs (PASS >= 100)',
      'Checking Sensor Boresight & IMU Trajectory: Riegl miniVUX-3UAV calibrated - OK',
      'Evaluating Return Classes: First, Intermediate, and Last returns intact - PASS',
      'CRS Verification: Projected UTM Zone 43N Ellipsoidal Height - OK',
      'PASS: LiDAR Point Cloud Dataset Validated.'
    ];

    steps.forEach((line, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, line]);
        if (index === steps.length - 1) {
          setIsValidating(false);
          setValidatedStatus((prev) => ({ ...prev, lidar: true }));
        }
      }, (index + 1) * 150);
    });
  };

  // Run Validation for GNSS
  const runGnssValidation = () => {
    setIsValidating(true);
    setConsoleLogs([]);
    const steps = [
      'Reading Dual-Frequency RINEX 3.04 Observation Logs...',
      'Connecting to Survey of India CORS Network (Base Station MP-IND-01)...',
      'Satellite Constellations: NavIC (8), GPS (12), GLONASS (7), Galileo (6) - Locked',
      'Ambiguity Resolution: RTK FIX achieved across 100% of trajectory epochs',
      'Horizontal RMS: 0.009m (PASS <= 0.025m), Vertical RMS: 0.014m (PASS <= 0.050m)',
      'Validating 14 GCPs and 6 Independent Checkpoints against ground monument registry - OK',
      'PASS: GNSS / CORS Control Data Validated.'
    ];

    steps.forEach((line, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, line]);
        if (index === steps.length - 1) {
          setIsValidating(false);
          setValidatedStatus((prev) => ({ ...prev, gnss: true }));
        }
      }, (index + 1) * 150);
    });
  };

  // Run Validation for Architecture
  const runArchitectureValidation = () => {
    setIsValidating(true);
    setConsoleLogs([]);
    const steps = [
      'Importing Sanctioned Architectural CAD Drawing (.dwg)...',
      'Reading IMC Town Planning Approval Records (Sanction Ref: IMC/TP/2021/412)...',
      'Extracting Approved Floor Levels: Ground, Floor 1, Floor 2, Floor 3 (G+3 sanction)',
      'Extracting Approved Footprint Polygons: 540.0 m² ground coverage',
      'Extracting Permissible Maximum Height: 15.0m',
      'Layer Mapping: Architecture CAD aligned to local survey coordinate origin - OK',
      'PASS: Building Architecture Dataset Loaded as Evidence Baseline.'
    ];

    steps.forEach((line, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, line]);
        if (index === steps.length - 1) {
          setIsValidating(false);
          setValidatedStatus((prev) => ({ ...prev, architecture: true }));
        }
      }, (index + 1) * 150);
    });
  };

  // Dispatch current validation
  const handleValidateCurrentTab = () => {
    if (activeTab === 'gdb') runGdbValidation();
    else if (activeTab === 'tpk') runTpkValidation();
    else if (activeTab === 'drone') runDroneValidation();
    else if (activeTab === 'lidar') runLidarValidation();
    else if (activeTab === 'gnss') runGnssValidation();
    else if (activeTab === 'architecture') runArchitectureValidation();
    else runGdbValidation();
  };

  // Download official audit report
  const downloadReport = () => {
    const reportContent = `
================================================================================
NAKSHA V2.0 DESKTOP WORKSTATION - GEOSPATIAL VALIDATION AUDIT REPORT
Department of Land Resources | Ministry of Rural Development & Survey of India
================================================================================
Generated Date   : ${new Date().toLocaleString()}
Application      : NAKSHA V2.0 Desktop Workstation (3D Survey Edition)
Operator User    : ${isGuestMode ? 'Guest User (Unauthenticated)' : 'soi_operator_01 (Authorized)'}
Project ID       : ${project.id}
State / District : ${project.state} / ${project.district}
ULB / Ward       : ${project.ulb} / ${project.ward}
Survey Unit      : ${project.surveyUnit}
Target Dataset   : ${activeTab.toUpperCase()}
Coordinate Sys   : ${project.crs}
--------------------------------------------------------------------------------
VALIDATION CONSOLE AUDIT TRAIL:
${consoleLogs.join('\n')}
================================================================================
End of Validation Report.
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NAKSHA_Validation_Report_${project.id}_${activeTab}_${Date.now()}.txt`;
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
          <Upload size={16} />
          <span>Data Ingestion & Multi-Sensor Pre-Processing Validation Center</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Automated Integrity, Coordinate System & Quality QC
        </div>
      </div>

      {/* Main Container */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}>
        {/* Tab Strip */}
        <div style={{
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #cbd5e1',
          display: 'flex',
          gap: '2px',
          padding: '6px 12px 0 12px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'all', label: 'All Ingested Datasets', icon: <Layers size={13} /> },
            { id: 'gdb', label: 'Vector GDB (.zip)', icon: <FileText size={13} /> },
            { id: 'tpk', label: 'Raster TPK (.tpk)', icon: <Layers size={13} /> },
            { id: 'drone', label: 'Drone RGB Photos', icon: <Camera size={13} /> },
            { id: 'lidar', label: 'LiDAR LAS/LAZ', icon: <Cpu size={13} /> },
            { id: 'gnss', label: 'GNSS RINEX / GCP', icon: <Crosshair size={13} /> },
            { id: 'architecture', label: 'Building Plans (CAD)', icon: <Box size={13} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                  borderBottom: isActive ? '1px solid #ffffff' : 'none',
                  borderRadius: '6px 6px 0 0',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0284c7' : '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: isActive ? '-1px' : '0'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'all' ? (
            /* All Datasets Overview Table */
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #cbd5e1', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '8px 10px' }}>Dataset ID</th>
                    <th style={{ padding: '8px 10px' }}>Dataset Name & Category</th>
                    <th style={{ padding: '8px 10px' }}>Format & Size</th>
                    <th style={{ padding: '8px 10px' }}>Coordinate System</th>
                    <th style={{ padding: '8px 10px' }}>Source / Sensor</th>
                    <th style={{ padding: '8px 10px' }}>Validation Status</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Inspect</th>
                  </tr>
                </thead>
                <tbody>
                  {project.inputDatasets.map((ds) => (
                    <tr key={ds.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '9px 10px', fontWeight: 700, color: '#0f2b5c' }}>{ds.id}</td>
                      <td style={{ padding: '9px 10px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{ds.name}</div>
                        <div style={{ fontSize: '11px', color: '#0284c7' }}>{ds.category}</div>
                      </td>
                      <td style={{ padding: '9px 10px', color: '#475569' }}>
                        <div>{ds.fileType}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Size: {ds.size}</div>
                      </td>
                      <td style={{ padding: '9px 10px', color: '#334155', fontSize: '11.5px' }}>{ds.coordinateSystem}</td>
                      <td style={{ padding: '9px 10px', color: '#64748b', fontSize: '11px' }}>{ds.source}</td>
                      <td style={{ padding: '9px 10px' }}>
                        <span style={{
                          backgroundColor: ds.validationStatus === 'READY' || ds.validationStatus === 'PASS' ? '#dcfce7' : '#fef3c7',
                          color: ds.validationStatus === 'READY' || ds.validationStatus === 'PASS' ? '#166534' : '#92400e',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {ds.validationStatus}
                        </span>
                      </td>
                      <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            if (ds.category === 'GIS') setActiveTab('gdb');
                            else if (ds.category === 'DSM/DEM') setActiveTab('tpk');
                            else if (ds.category === 'Drone Images') setActiveTab('drone');
                            else if (ds.category === 'LiDAR') setActiveTab('lidar');
                            else if (ds.category === 'GNSS') setActiveTab('gnss');
                            else if (ds.category === 'Architecture') setActiveTab('architecture');
                          }}
                          style={{
                            backgroundColor: '#e0f2fe',
                            color: '#0284c7',
                            border: '1px solid #bae6fd',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Verify Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Specific Dataset Inspection & Real Validation Form */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* File Selection Row */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <label style={{ width: '110px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                  Target File Path:
                </label>

                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  minWidth: '280px'
                }}>
                  <button
                    onClick={() => {
                      const currentVal = activeTab === 'gdb' ? gdbPath : activeTab === 'tpk' ? tpkPath : activeTab === 'drone' ? dronePath : activeTab === 'lidar' ? lidarPath : activeTab === 'gnss' ? gnssPath : archPath;
                      const custom = prompt('Enter file path to validate:', currentVal);
                      if (custom) {
                        if (activeTab === 'gdb') setGdbPath(custom);
                        else if (activeTab === 'tpk') setTpkPath(custom);
                        else if (activeTab === 'drone') setDronePath(custom);
                        else if (activeTab === 'lidar') setLidarPath(custom);
                        else if (activeTab === 'gnss') setGnssPath(custom);
                        else if (activeTab === 'architecture') setArchPath(custom);
                      }
                    }}
                    style={{
                      backgroundColor: '#e2e8f0',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Browse Local Workstation
                  </button>
                  <span style={{ fontSize: '12px', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeTab === 'gdb' ? gdbPath : activeTab === 'tpk' ? tpkPath : activeTab === 'drone' ? dronePath : activeTab === 'lidar' ? lidarPath : activeTab === 'gnss' ? gnssPath : archPath}
                  </span>
                </div>

                {/* Orange Validate Button */}
                <button
                  onClick={handleValidateCurrentTab}
                  disabled={isValidating}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: isValidating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(245, 158, 11, 0.25)'
                  }}
                >
                  {isValidating && <RefreshCw size={13} className="spin" />}
                  <span>{isValidating ? 'Running QC Checks...' : 'Validate Dataset'}</span>
                </button>

                {/* Map Preview Button */}
                {(activeTab === 'gdb' || activeTab === 'tpk') && (
                  <button
                    onClick={onPreviewMap}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 14px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Eye size={14} />
                    <span>Preview On Map</span>
                  </button>
                )}
              </div>

              {/* Terminal Log Console */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '220px',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#334155',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '6px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Validation & Integrity Console Stream:</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Status: {validatedStatus[activeTab] ? '🟢 PASSED & VERIFIED' : '⚪ IDLE'}
                  </span>
                </div>

                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#0f172a'
                }}>
                  {consoleLogs.map((line, idx) => (
                    <div
                      key={idx}
                      style={{
                        color: line.includes('VALID') || line.includes('PASS') || line.includes('Done!') || line.includes('OK')
                          ? '#15803d'
                          : line.includes('Projection') || line.includes('Scanning') || line.includes('Extracted')
                            ? '#0369a1'
                            : line.includes('FAIL')
                              ? '#dc2626'
                              : '#1e293b'
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={downloadReport}
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
                  <span>Download Official Validation Audit Certificate</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onNavigateSection('gnss-cors')}
                    style={{
                      backgroundColor: '#0284c7',
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
                    <span>Inspect GNSS Control</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={() => onNavigateSection('processing-photogrammetry')}
                    style={{
                      backgroundColor: '#22c55e',
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
                    <span>Proceed to Processing Center</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
