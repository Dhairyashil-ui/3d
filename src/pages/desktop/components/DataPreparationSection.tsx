import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';

interface DataPreparationSectionProps {
  selectedState?: string;
  username?: string;
  isGuestMode?: boolean;
  onLogout?: () => void;
  project?: {
    id: string;
    district: string;
    ward: string;
    surveyUnit: string;
    crs: string;
  };
}

interface DatasetFile {
  fileName: string;
  fileSize: string;
  selected: boolean;
  uploaded: boolean;
  rawFile?: File | null;
}

export const DataPreparationSection: React.FC<DataPreparationSectionProps> = ({
  selectedState = 'Maharashtra',
  username = 'aman.pokale.soi@gov.in',
  onLogout
}) => {
  // Active Upload Tab: 'tpk' | 'gdb' | 'evidence'
  const [activeUpload, setActiveUpload] = useState<'tpk' | 'gdb' | 'evidence'>('tpk');

  // Administrative Unit State: Hinjawadi, Pune, Maharashtra
  const [district, setDistrict] = useState('Pune');
  const [districtCode, setDistrictCode] = useState('521');

  const [ulb, setUlb] = useState('PMRDA - Hinjawadi (270412)');
  const [ulbCode, setUlbCode] = useState('270412');

  const [ward, setWard] = useState('Hinjawadi Phase 1 - Ward 04');
  const [wardCode, setWardCode] = useState('270412004');

  const [surveyUnit, setSurveyUnit] = useState('SU-01 (PPCRC Campus / Hinjawadi Phase 1)');
  const [surveyUnitCode, setSurveyUnitCode] = useState('SU01');

  // ---------------------------------------------------------------------------
  // 3 DISTINCT DATASET INPUTS (Hinjawadi, Pune Survey Datasets)
  // ---------------------------------------------------------------------------
  // 1. ORI / Raster (.TPK)
  const [tpkFile, setTpkFile] = useState<DatasetFile>({
    fileName: 'Hinjawadi_Phase1_ORI_UTM43N.tpk',
    fileSize: '1.24 GB',
    selected: true,
    uploaded: false,
    rawFile: null
  });

  // 2. Feature Extracted Vector Data (.GDB)
  const [gdbFile, setGdbFile] = useState<DatasetFile>({
    fileName: 'Hinjawadi_PPCRC_Cadastral_Parcels.gdb.zip',
    fileSize: '45.8 MB',
    selected: true,
    uploaded: false,
    rawFile: null
  });

  // 3. 3D Evidence Package (.ZIP)
  const [evidenceZip, setEvidenceZip] = useState<DatasetFile>({
    fileName: 'Hinjawadi_PPCRC_3D_Evidence_Package.zip',
    fileSize: '342.6 MB',
    selected: true,
    uploaded: false,
    rawFile: null
  });

  // File input refs
  const tpkInputRef = useRef<HTMLInputElement | null>(null);
  const gdbInputRef = useRef<HTMLInputElement | null>(null);
  const zipInputRef = useRef<HTMLInputElement | null>(null);

  // ---------------------------------------------------------------------------
  // VALIDATION STATE
  // ---------------------------------------------------------------------------
  const [isValidating, setIsValidating] = useState(false);
  const [validationRun, setValidationRun] = useState(false);
  const [validationPassed, setValidationPassed] = useState<boolean | null>(null);
  const [validationLog, setValidationLog] = useState<string[]>([]);
  const [forceFailScenario, setForceFailScenario] = useState<string>('');

  // ---------------------------------------------------------------------------
  // UPLOAD STATE
  // ---------------------------------------------------------------------------
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // File selection handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'tpk' | 'gdb' | 'evidence') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const szMb = (file.size / (1024 * 1024)).toFixed(2);
      const formattedSize = file.size > 1024 * 1024 * 1024
        ? `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
        : `${szMb} MB`;

      if (type === 'tpk') {
        setTpkFile({ fileName: file.name, fileSize: formattedSize, selected: true, uploaded: false, rawFile: file });
      } else if (type === 'gdb') {
        setGdbFile({ fileName: file.name, fileSize: formattedSize, selected: true, uploaded: false, rawFile: file });
      } else {
        setEvidenceZip({ fileName: file.name, fileSize: formattedSize, selected: true, uploaded: false, rawFile: file });
      }
      setValidationRun(false);
      setValidationPassed(null);
      setUploadMessage(null);
    }
  };

  // ---------------------------------------------------------------------------
  // RUN VALIDATION
  // ---------------------------------------------------------------------------
  const handleValidate = () => {
    setIsValidating(true);
    setValidationRun(false);
    setUploadMessage(null);

    setTimeout(() => {
      setIsValidating(false);
      setValidationRun(true);

      if (forceFailScenario === 'crs_mismatch') {
        setValidationPassed(false);
        setValidationLog([
          '✓ TPK — Valid',
          '✓ GDB — Valid',
          '✕ LiDAR — CRS Mismatch',
          '✓ DEM/DSM — Valid',
          '✓ GNSS/GCP — Valid',
          '✓ Floor Plan — Found',
          '⚠ Optional 3D Reference — Not provided',
          '',
          '[ VALIDATION FAILED ]',
          'CRITICAL ERROR: Coordinate Reference System Mismatch.',
          'TPK & GDB are projected in EPSG: 32643 (UTM Zone 43N), but LiDAR point cloud header in 3D Evidence ZIP specifies EPSG: 4326 (Geographic WGS84). Coordinates cannot be reconciled.'
        ]);
        return;
      }

      if (forceFailScenario === 'missing_plan') {
        setValidationPassed(false);
        setValidationLog([
          '✓ TPK — Valid',
          '✓ GDB — Valid',
          '✓ LiDAR — Valid',
          '✓ DEM/DSM — Valid',
          '✓ GNSS/GCP — Valid',
          '✕ Floor Plan — Missing',
          '⚠ Optional 3D Reference — Not provided',
          '',
          '[ VALIDATION FAILED ]',
          'CRITICAL ERROR: Mandatory Building Floor Plan Missing.',
          '3D Evidence ZIP does not contain any approved architectural building plans (.PDF / .DWG / .DXF). Vertical unit validation cannot proceed.'
        ]);
        return;
      }

      // Default: VALIDATION PASSED
      setValidationPassed(true);
      setValidationLog([
        '✓ TPK — Valid',
        '✓ GDB — Valid',
        '✓ LiDAR — Valid',
        '✓ DEM/DSM — Valid',
        '✓ GNSS/GCP — Valid',
        '✓ Floor Plan — Found',
        '⚠ Optional 3D Reference — Not provided',
        '',
        '[ VALIDATION PASSED ]'
      ]);
    }, 800);
  };

  // ---------------------------------------------------------------------------
  // UPLOAD DATASET ACTION
  // ---------------------------------------------------------------------------
  const handleUpload = () => {
    if (!validationPassed) {
      alert('Please validate the survey data file before uploading.');
      return;
    }

    setIsUploading(true);
    const activeFileName =
      activeUpload === 'tpk' ? tpkFile.fileName : activeUpload === 'gdb' ? gdbFile.fileName : evidenceZip.fileName;

    setTimeout(() => {
      setIsUploading(false);
      if (activeUpload === 'tpk') setTpkFile(prev => ({ ...prev, uploaded: true }));
      else if (activeUpload === 'gdb') setGdbFile(prev => ({ ...prev, uploaded: true }));
      else setEvidenceZip(prev => ({ ...prev, uploaded: true }));

      setUploadMessage(`✓ File "${activeFileName}" successfully uploaded and registered to NAKSHA repository for Survey Unit: ${surveyUnit}!`);
    }, 900);
  };

  // ---------------------------------------------------------------------------
  // DOWNLOAD VALIDATION REPORT (.TXT FILE DOWNLOAD)
  // ---------------------------------------------------------------------------
  const handleDownloadReport = () => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const content = `================================================================================
SURVEY OF INDIA — NAKSHA 3D VERTICAL PROPERTY CADASTRE
OFFICIAL SURVEY DATA VALIDATION AUDIT REPORT
================================================================================
Audit Timestamp : ${timestamp} IST
Operator Name   : Aman Pokale (${username})
Authority       : Survey of India, Ministry of Science & Technology
State           : ${selectedState}
District        : ${district} (Code: ${districtCode})
ULB / Taluka    : ${ulb} (Code: ${ulbCode})
Ward            : ${ward} (Code: ${wardCode})
Survey Unit     : ${surveyUnit} (Code: ${surveyUnitCode})
Application Ver : 2.0.13 (3D Vertical Cadastre Extension)
================================================================================

1. ORI / RASTER DATA (.TPK):
   • File Name        : ${tpkFile.fileName} (${tpkFile.fileSize})
   • File Integrity   : SHA-256 Checksum Verified [PASS]
   • Tile Structure   : ArcGIS Tile Package 2.0 Compact Cache
   • CRS / Projection : WGS 84 / UTM Zone 43N (EPSG: 32643)
   • Spatial Extent   : [373500.00, 2055100.00] to [375200.00, 2056800.00] (Hinjawadi Phase 1)
   • Readability      : 3-Band RGB, 8-bit depth, 0.05m GSD
   • Status           : [✓ VALID]

2. FEATURE EXTRACTED VECTOR DATA (.GDB):
   • File Name        : ${gdbFile.fileName} (${gdbFile.fileSize})
   • Structure        : ESRI File Geodatabase v10.x Verified [PASS]
   • CRS / Projection : UTM Zone 43N (WKID: 32643)
   • Geometry Validity: 100% Valid Polygon Topology, 0 Self-Intersections
   • Feature Layers   : PROPERTY_PARCEL (PPCRC Campus), PLOT_BOUNDARY, BUILDING_FOOTPRINT
   • Required Schema  : ULPIN (27250401420089), OWNER_NAME, LAND_USE, AREA_SQM
   • Record Integrity : 0 Duplicates, 0 Null Mandatory Keys
   • Status           : [✓ VALID]

3. 3D / VERTICAL EVIDENCE PACKAGE (.ZIP):
   • File Name        : ${evidenceZip.fileName} (${evidenceZip.fileSize})
   • Container Form   : PKZip Container Archive (SHA-256 Verified) [PASS]
   • LiDAR LAS/LAZ    : ASPRS LAS 1.4 Point Cloud, 48,600,000 Returns, 138.4 pts/m²
   • Elevation Model  : GeoTIFF 32-bit Float DEM (bare earth) & DSM (surface), 0.05m GSD
   • GNSS/GCP Control : 14 GCPs + 6 Checkpoints, CORS RTK Lock Fixed
                        Horizontal RMS: 0.009m (PASS <= 0.025m)
                        Vertical RMS  : 0.014m (PASS <= 0.050m)
   • Building Plans   : Sanctioned CAD Drawing (.dwg) PMRDA/TP/2021/8412 Detected
                        PPCRC Hinjawadi G+3 Tiers (Ground + 3 Upper Floors), 540 m² Footprint
   • 3D Reference     : Not provided (Non-blocking optional visualization model)
   • metadata.json    : Schema Version 1.2 compliant, CRS consistency confirmed
   • Status           : [✓ VALID]

================================================================================
VALIDATION RESULTS SUMMARY:
✓ TPK — Valid
✓ GDB — Valid
✓ LiDAR — Valid
✓ DEM/DSM — Valid
✓ GNSS/GCP — Valid
✓ Floor Plan — Found
⚠ Optional 3D Reference — Not provided

OVERALL RESULT: [ VALIDATION PASSED ]
Authorized for 3D Property Unit Extraction & Vertical Registration Pipeline.
================================================================================
Digital Signature Token: SOI-NAKSHA-3D-VERIFIED-${Date.now()}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NAKSHA_3D_Validation_Report_Pune_Hinjawadi_${surveyUnitCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get current file info
  const getCurrentFile = () => {
    if (activeUpload === 'tpk') return tpkFile;
    if (activeUpload === 'gdb') return gdbFile;
    return evidenceZip;
  };

  const currentFile = getCurrentFile();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* ------------------------------------------------------------------- */}
      {/* TOP TITLE BAR (- Naksha | _ □ ✕)                                    */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          height: '24px',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #cbd5e1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 8px',
          fontSize: '11px',
          color: '#334155'
        }}
      >
        <span>— Naksha</span>
        <div style={{ display: 'flex', gap: '8px', color: '#64748b' }}>
          <span>—</span>
          <span>□</span>
          <span style={{ cursor: 'pointer' }} onClick={onLogout}>✕</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* OFFICIAL NAKSHA HEADER (Navy Blue Banner)                           */}
      {/* ------------------------------------------------------------------- */}
      <div
        style={{
          backgroundColor: '#13386e',
          color: '#ffffff',
          height: '56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          flexShrink: 0
        }}
      >
        {/* Left: Emblem + NAKSHA text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/assets/bharat-sarkar.svg"
            alt="Emblem of India"
            style={{ height: '36px', filter: 'brightness(0) invert(1)' }}
            onError={(e) => {
              // Fallback text if svg fails
              e.currentTarget.style.display = 'none';
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.5px' }}>
              NAKSHA
            </span>
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.85)' }}>
              National Geospatial Knowledge-based Land Survey of Urban Habitations
            </span>
          </div>
        </div>

        {/* Right: Operator info */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#ffffff' }}>
            Aman Pokale ({username})
          </span>
          <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.9)' }}>
            {selectedState} • Pune Division
          </span>
          <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.75)' }}>
            Surveyor / State Admin
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN BODY: 2 COLUMNS (Left Sidebar + Right Content Area)            */}
      {/* ------------------------------------------------------------------- */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* ================================================================= */}
        {/* LEFT SIDEBAR (Sidebar with 3 buttons + Watermark + Version)        */}
        {/* ================================================================= */}
        <div
          style={{
            width: '145px',
            backgroundColor: '#edf3f8',
            borderRight: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '12px 10px',
            flexShrink: 0
          }}
        >
          {/* Top: 3 Upload Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Button 1: Upload TPK */}
            <button
              onClick={() => {
                setActiveUpload('tpk');
                setValidationRun(false);
                setUploadMessage(null);
              }}
              style={{
                width: '100%',
                height: '34px',
                backgroundColor: activeUpload === 'tpk' ? '#0b2559' : '#ffffff',
                color: activeUpload === 'tpk' ? '#ffffff' : '#0b2559',
                border: activeUpload === 'tpk' ? 'none' : '1.5px solid #0b2559',
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: activeUpload === 'tpk' ? '0 1px 3px rgba(11, 37, 89, 0.3)' : 'none'
              }}
            >
              Upload TPK
            </button>

            {/* Button 2: Upload GDB */}
            <button
              onClick={() => {
                setActiveUpload('gdb');
                setValidationRun(false);
                setUploadMessage(null);
              }}
              style={{
                width: '100%',
                height: '34px',
                backgroundColor: activeUpload === 'gdb' ? '#0b2559' : '#ffffff',
                color: activeUpload === 'gdb' ? '#ffffff' : '#0b2559',
                border: activeUpload === 'gdb' ? 'none' : '1.5px solid #0b2559',
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: activeUpload === 'gdb' ? '0 1px 3px rgba(11, 37, 89, 0.3)' : 'none'
              }}
            >
              Upload GDB
            </button>

            {/* Button 3: Upload 3D Evidence */}
            <button
              onClick={() => {
                setActiveUpload('evidence');
                setValidationRun(false);
                setUploadMessage(null);
              }}
              style={{
                width: '100%',
                height: '34px',
                backgroundColor: activeUpload === 'evidence' ? '#0b2559' : '#ffffff',
                color: activeUpload === 'evidence' ? '#ffffff' : '#0b2559',
                border: activeUpload === 'evidence' ? 'none' : '1.5px solid #0b2559',
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: activeUpload === 'evidence' ? '0 1px 3px rgba(11, 37, 89, 0.3)' : 'none'
              }}
            >
              Upload 3D Evidence
            </button>
          </div>

          {/* Bottom: Surveyor Watermark SVG + Version */}
          <div>
            {/* Watermark Illustration matching official app */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '8px', opacity: 0.6 }}>
              <svg width="110" height="110" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cadastral Map Grid Lines */}
                <polygon points="15,90 60,65 105,90 60,110" stroke="#7ea3c7" strokeWidth="1.2" fill="#d9e9f7" />
                <line x1="37" y1="78" x2="82" y2="100" stroke="#7ea3c7" strokeWidth="0.9" />
                <line x1="60" y1="65" x2="60" y2="110" stroke="#7ea3c7" strokeWidth="0.9" />
                <line x1="82" y1="78" x2="37" y2="100" stroke="#7ea3c7" strokeWidth="0.9" />

                {/* Location Pin */}
                <circle cx="85" cy="80" r="4" fill="#0b2559" />
                <path d="M85 84 L85 92" stroke="#0b2559" strokeWidth="1.5" />

                {/* Surveyor Tripod / Total Station */}
                <line x1="70" y1="42" x2="55" y2="85" stroke="#4a6d91" strokeWidth="1.5" />
                <line x1="70" y1="42" x2="70" y2="85" stroke="#4a6d91" strokeWidth="1.5" />
                <line x1="70" y1="42" x2="85" y2="85" stroke="#4a6d91" strokeWidth="1.5" />
                <circle cx="70" cy="40" r="4" fill="#1b539c" />
                <line x1="64" y1="40" x2="76" y2="40" stroke="#1b539c" strokeWidth="2" />

                {/* Drone in the air */}
                <rect x="25" y="24" width="16" height="5" rx="2" fill="#1b539c" />
                <line x1="18" y1="21" x2="48" y2="31" stroke="#4a6d91" strokeWidth="1.5" />
                <line x1="18" y1="31" x2="48" y2="21" stroke="#4a6d91" strokeWidth="1.5" />
                <ellipse cx="18" cy="21" rx="5" ry="1.5" fill="#7ea3c7" />
                <ellipse cx="48" cy="21" rx="5" ry="1.5" fill="#7ea3c7" />
                <ellipse cx="18" cy="31" rx="5" ry="1.5" fill="#7ea3c7" />
                <ellipse cx="48" cy="31" rx="5" ry="1.5" fill="#7ea3c7" />
                {/* Drone signal rays */}
                <path d="M33 30 L45 55" stroke="#7ea3c7" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M33 30 L20 60" stroke="#7ea3c7" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>

            <div style={{ fontSize: '10.5px', color: '#64748b' }}>
              Version : 2.0.13
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT MAIN PANEL (Exact layout from user screenshot)               */}
        {/* ================================================================= */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            overflowY: 'auto'
          }}
        >
          {/* Main Form Container Card */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            {/* Teal Header Banner */}
            <div
              style={{
                height: '34px',
                backgroundColor: '#1ea896',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 14px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.2px'
              }}
            >
              <span>
                {activeUpload === 'gdb' && "Upload Feature Extracted/Plot Data File's"}
                {activeUpload === 'tpk' && "Upload ORI / Raster Data File's"}
                {activeUpload === 'evidence' && "Upload 3D / Vertical Evidence Package File's"}
              </span>

              {/* QC Failure Simulator Toggle (For Testing / Audit Demo) */}
              <select
                value={forceFailScenario}
                onChange={(e) => {
                  setForceFailScenario(e.target.value);
                  setValidationRun(false);
                  setValidationPassed(null);
                }}
                style={{
                  fontSize: '10.5px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#0f2b5c',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  outline: 'none',
                  fontWeight: 600
                }}
                title="Simulate validation scenarios"
              >
                <option value="">QC: Normal (All Valid)</option>
                <option value="crs_mismatch">Simulate: CRS Mismatch</option>
                <option value="missing_plan">Simulate: Missing Floor Plan</option>
              </select>
            </div>

            {/* Form Fields Section */}
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Row 1: District & ULB */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '24px' }}>
                {/* District */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#1e293b' }}>District :</span>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                  </div>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{
                      height: '28px',
                      fontSize: '12px',
                      border: '1px solid #94a3b8',
                      borderRadius: '2px',
                      padding: '0 8px',
                      backgroundColor: '#ffffff',
                      color: '#1e293b',
                      outline: 'none'
                    }}
                  >
                    <option value="Pune">Pune</option>
                    <option value="Yadadri Bhuvanagiri">Yadadri Bhuvanagiri</option>
                    <option value="Indore">Indore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bhopal">Bhopal</option>
                  </select>
                  <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                    {districtCode}
                  </span>
                </div>

                {/* ULB */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#1e293b' }}>ULB :</span>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                  </div>
                  <select
                    value={ulb}
                    onChange={(e) => setUlb(e.target.value)}
                    style={{
                      height: '28px',
                      fontSize: '12px',
                      border: '1px solid #94a3b8',
                      borderRadius: '2px',
                      padding: '0 8px',
                      backgroundColor: '#ffffff',
                      color: '#1e293b',
                      outline: 'none'
                    }}
                  >
                    <option value="PMRDA - Hinjawadi (270412)">PMRDA - Hinjawadi (270412)</option>
                    <option value="Yadagirigutta - 290146">Yadagirigutta - 290146</option>
                    <option value="Indore Municipal Corp - 108420">Indore Municipal Corp - 108420</option>
                    <option value="GHMC - 250101">GHMC - 250101</option>
                  </select>
                  <span style={{ fontSize: '10px', color: '#ea580c', fontWeight: 600, marginTop: '2px' }}>
                    {ulbCode}
                  </span>
                </div>
              </div>

              {/* Row 2: Ward & Survey Unit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '24px' }}>
                {/* Ward */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#1e293b' }}>Ward :</span>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                  </div>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    style={{
                      height: '28px',
                      fontSize: '12px',
                      border: '1px solid #94a3b8',
                      borderRadius: '2px',
                      padding: '0 8px',
                      backgroundColor: '#ffffff',
                      color: '#1e293b',
                      outline: 'none'
                    }}
                  >
                    <option value="Hinjawadi Phase 1 - Ward 04">Hinjawadi Phase 1 - Ward 04</option>
                    <option value="Ward7">Ward7</option>
                    <option value="Ward 14">Ward 14</option>
                    <option value="Ward 21">Ward 21</option>
                  </select>
                  <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                    {wardCode}
                  </span>
                </div>

                {/* Survey Unit */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#1e293b' }}>Survey Unit :</span>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                  </div>
                  <select
                    value={surveyUnit}
                    onChange={(e) => setSurveyUnit(e.target.value)}
                    style={{
                      height: '28px',
                      fontSize: '12px',
                      border: '1px solid #94a3b8',
                      borderRadius: '2px',
                      padding: '0 8px',
                      backgroundColor: '#ffffff',
                      color: '#1e293b',
                      outline: 'none'
                    }}
                  >
                    <option value="SU-01 (PPCRC Campus / Hinjawadi Phase 1)">SU-01 (PPCRC Campus / Hinjawadi Phase 1)</option>
                    <option value="SU-02 (Rajiv Gandhi Infotech Park)">SU-02 (Rajiv Gandhi Infotech Park)</option>
                    <option value="SU-03 (Commercial Complex)">SU-03 (Commercial Complex)</option>
                  </select>
                  <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                    {surveyUnitCode}
                  </span>
                </div>
              </div>

              {/* Row 3: File Input & Action Buttons (Validate / Upload) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  columnGap: '24px',
                  alignItems: 'flex-start',
                  marginTop: '4px'
                }}
              >
                {/* File Chooser */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#1e293b' }}>File :</span>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>*</span>
                  </div>

                  {/* Hidden File Inputs */}
                  <input
                    ref={tpkInputRef}
                    type="file"
                    accept=".tpk"
                    onChange={(e) => handleFileChange(e, 'tpk')}
                    style={{ display: 'none' }}
                  />
                  <input
                    ref={gdbInputRef}
                    type="file"
                    accept=".gdb,.zip"
                    onChange={(e) => handleFileChange(e, 'gdb')}
                    style={{ display: 'none' }}
                  />
                  <input
                    ref={zipInputRef}
                    type="file"
                    accept=".zip"
                    onChange={(e) => handleFileChange(e, 'evidence')}
                    style={{ display: 'none' }}
                  />

                  {/* Choose File Button */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                    <button
                      onClick={() => {
                        if (activeUpload === 'tpk') tpkInputRef.current?.click();
                        else if (activeUpload === 'gdb') gdbInputRef.current?.click();
                        else zipInputRef.current?.click();
                      }}
                      style={{
                        height: '28px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #475569',
                        borderRadius: '2px',
                        color: '#1e293b',
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        padding: '0 12px',
                        textAlign: 'center',
                        fontWeight: 500
                      }}
                    >
                      {activeUpload === 'tpk' && 'Choose a .TPK File'}
                      {activeUpload === 'gdb' && 'Choose a .GDB File'}
                      {activeUpload === 'evidence' && 'Choose 3D Evidence .ZIP File'}
                    </button>

                    {/* Selected File Name / Size */}
                    <div style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 600 }}>
                      Selected: <b>{currentFile.fileName}</b> ({currentFile.fileSize})
                    </div>
                  </div>
                </div>

                {/* Right: Validate & Upload Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
                  {/* Validate Button */}
                  <button
                    onClick={handleValidate}
                    disabled={isValidating}
                    style={{
                      height: '28px',
                      minWidth: '90px',
                      backgroundColor: '#d1d5db',
                      color: '#1f2937',
                      border: 'none',
                      borderRadius: '2px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: isValidating ? 'not-allowed' : 'pointer',
                      padding: '0 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    {isValidating ? 'Validating...' : 'Validate'}
                  </button>

                  {/* Upload Button */}
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    style={{
                      height: '28px',
                      minWidth: '90px',
                      backgroundColor: validationPassed ? '#16a34a' : '#d1d5db',
                      color: validationPassed ? '#ffffff' : '#4b5563',
                      border: 'none',
                      borderRadius: '2px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      padding: '0 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Notification Message */}
            {uploadMessage && (
              <div
                style={{
                  margin: '0 18px 8px 18px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#15803d',
                  padding: '6px 12px',
                  borderRadius: '2px',
                  fontSize: '11.5px',
                  fontWeight: 600
                }}
              >
                {uploadMessage}
              </div>
            )}

            {/* Central Large White Log / Report Box (Matching official app) */}
            <div
              style={{
                margin: '0 18px 14px 18px',
                border: '1px solid #b0bec5',
                borderRadius: '2px',
                backgroundColor: '#ffffff',
                minHeight: '260px',
                maxHeight: '340px',
                overflowY: 'auto',
                padding: '16px 20px',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace, sans-serif',
                fontSize: '12.5px',
                lineHeight: 1.6,
                color: '#1e293b'
              }}
            >
              {!validationRun && !isValidating && (
                <div style={{ color: '#94a3b8', fontStyle: 'italic', paddingTop: '80px', textAlign: 'center' }}>
                  <div>Ready for survey data verification.</div>
                  <div style={{ fontSize: '11.5px', marginTop: '6px', color: '#64748b' }}>
                    Select administrative unit, choose file, and click <b>[ Validate ]</b>.
                  </div>
                </div>
              )}

              {isValidating && (
                <div style={{ color: '#0284c7', paddingTop: '80px', textAlign: 'center', fontWeight: 600 }}>
                  Executing SHA-256 integrity, coordinate reference (CRS), and schema consistency checks...
                </div>
              )}

              {validationRun && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {validationLog.map((line, idx) => {
                    const isSuccess = line.startsWith('✓');
                    const isWarn = line.startsWith('⚠');
                    const isFail = line.startsWith('✕');
                    const isPassedBanner = line.includes('[ VALIDATION PASSED ]');
                    const isFailedBanner = line.includes('[ VALIDATION FAILED ]');

                    return (
                      <div
                        key={idx}
                        style={{
                          fontWeight: isPassedBanner || isFailedBanner ? 800 : isSuccess || isWarn || isFail ? 700 : 500,
                          fontSize: isPassedBanner || isFailedBanner ? '13.5px' : '12px',
                          color: isPassedBanner
                            ? '#15803d'
                            : isFailedBanner
                            ? '#dc2626'
                            : isSuccess
                            ? '#16a34a'
                            : isWarn
                            ? '#b45309'
                            : isFail
                            ? '#dc2626'
                            : '#334155',
                          marginTop: isPassedBanner || isFailedBanner ? '10px' : '0'
                        }}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Row: Download Validation Report + Logout Button */}
            <div
              style={{
                padding: '10px 18px 14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {/* Left: Download Validation Report */}
              <button
                onClick={handleDownloadReport}
                style={{
                  height: '30px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #94a3b8',
                  borderRadius: '2px',
                  color: '#0f2b5c',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Download Validation Report</span>
                <span
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #94a3b8',
                    borderRadius: '2px',
                    padding: '2px 4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Download size={11} color="#0f2b5c" />
                </span>
              </button>

              {/* Right: Logout Button */}
              <button
                onClick={onLogout}
                style={{
                  height: '30px',
                  backgroundColor: '#00a8ff',
                  border: 'none',
                  borderRadius: '3px',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0 26px'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
