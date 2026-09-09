// NAKSHA V2.0 3D Aerial Survey & Building Reconstruction Data Architecture
// Aligned with Survey of India, Ministry of Rural Development & MPSEDC Specifications

export interface DatasetItem {
  id: string;
  name: string;
  category: 'Drone Images' | 'LiDAR' | 'GNSS' | 'GIS' | 'Architecture' | 'DSM/DEM';
  fileType: string;
  size: string;
  coordinateSystem: string;
  source: string;
  timestamp: string;
  uploadStatus: 'UPLOADED' | 'MISSING' | 'PENDING';
  validationStatus: 'PASS' | 'WARNING' | 'FAIL' | 'READY' | 'PROCESSING';
  validationReport?: string;
  itemCount?: number;
  filePath: string;
}

export interface GcpPoint {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  elevation: number;
  accuracyH: number; // in meters e.g. 0.012
  accuracyV: number; // in meters e.g. 0.018
  residuals: { x: number; y: number; z: number };
  pointType: 'GCP' | 'Check Point';
  status: 'VALIDATED' | 'READY' | 'FLAGGED';
}

export interface FlightPlan {
  id: string;
  name: string;
  surveyMethod: 'NADIR' | 'OBLIQUE' | 'OBLIQUE + LiDAR';
  altitudeMeters: number;
  gsdCm: number;
  forwardOverlapPct: number;
  sideOverlapPct: number;
  camera: string;
  drone: string;
  lidarSensor: string;
  flightLinesCount: number;
  estimatedImages: number;
  estimatedDuration: string;
  coveragePercentage: number;
  status: 'SAVED' | 'VALIDATED' | 'READY FOR MISSION';
  waypoints: [number, number][];
}

export interface PreFlightCheckItem {
  id: string;
  category: 'DRONE' | 'LiDAR' | 'GNSS' | 'MISSION';
  item: string;
  status: 'PASS' | 'PENDING' | 'FAIL';
  value: string;
  mandatory: boolean;
}

export interface TelemetryData {
  drone: {
    batteryPct: number;
    altitudeMeters: number;
    speedMs: number;
    satellites: number;
    gpsStatus: string;
    rtkStatus: 'RTK FIX' | 'FLOAT' | 'NO RTK';
    headingDeg: number;
    currentLat: number;
    currentLng: number;
  };
  camera: {
    imagesCaptured: number;
    imageQualityPct: number;
    blurPercentage: number;
    coveragePct: number;
    shutterSpeed: string;
    iso: number;
  };
  lidar: {
    pointCount: number;
    pointDensityM2: number;
    sensorStatus: string;
    pulseRateKhz: number;
    fovDeg: number;
  };
  gnss: {
    rtkFix: boolean;
    horizAccuracyM: number;
    vertAccuracyM: number;
    baseStationDistanceKm: number;
    corsId: string;
  };
}

export interface ProcessingStageItem {
  id: string;
  stageName: string;
  category: 'Photogrammetry' | 'LiDAR' | 'GNSS' | 'Fusion' | 'Surface' | '3D Reconstruction';
  progressPct: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FAILED';
  duration: string;
  outputArtifact: string;
  logLines: string[];
}

export interface DsmDemElevationData {
  dsmResolutionM: number;
  demResolutionM: number;
  minElevationM: number;
  maxElevationM: number;
  meanElevationM: number;
  stdDevM: number;
  processingStatus: 'READY' | 'COMPLETED';
  qualityStatus: 'PASS' | 'WARNING';
  crossSectionPoints: { distanceM: number; dsmElevM: number; demElevM: number; heightDiffM: number }[];
}

export interface BuildingUnit3D {
  id: string;
  unitNumber: string;
  floorLevel: number;
  useType: 'Commercial' | 'Residential' | 'Mixed' | 'Utility';
  carpetAreaSqm: number;
  ownerName: string;
  taxAssessmentNo: string;
  annualTaxInr: number;
  status: 'Verified' | 'Mismatch' | 'Unregistered';
  volume3dSqm: number;
}

export interface BuildingFloor3D {
  floorLevel: number;
  floorName: string;
  floorId: string;
  elevationMeters: number;
  heightMeters: number;
  builtUpAreaSqm: number;
  unitsCount: number;
  confidencePct: number;
  sourceDataset: string;
  units: BuildingUnit3D[];
  hasAnomaly: boolean;
  anomalyNotes?: string;
}

export interface ReconstructedBuildingModel {
  id: string; // Internal Building ID: BLDG-001
  buildingCode: string;
  buildingName: string;
  officialUlpin: string; // Authoritative Parcel Anchor
  parcelNo: string;
  district: string;
  ulb: string;
  ward: string;
  surveyUnit: string;
  coordinates: [number, number];
  footprintAreaSqm: number;
  totalHeightMeters: number;
  totalFloors: number;
  totalVolumeM3: number;
  structuralType: 'RCC Frame' | 'Load Bearing' | 'Steel Composite';
  reconstructionConfidence: number; // 98.4%
  sourceDatasets: string[];
  floors: BuildingFloor3D[];
  cadastralAlignmentStatus: 'Compliant' | 'Boundary Variance' | 'Overhang Detected';
}

export interface ArchitectureComparisonRecord {
  id: string;
  buildingId: string;
  ulpin: string;
  attribute: string;
  surveyValue: string;
  architecturePlanValue: string;
  varianceValue: string;
  status: 'MATCH' | 'MISMATCH';
  isReviewCandidate: boolean;
  notes: string;
}

export interface GisOverlayLayer {
  id: string;
  name: string;
  type: 'Cadastral' | 'TaxPolygon' | 'Footprint' | 'SurveyDerived' | '3DBuilding';
  opacity: number;
  visible: boolean;
  color: string;
  varianceDetected: boolean;
  metrics: string;
}

export interface AnomalyCase {
  caseId: string;
  buildingId: string;
  ulpin: string;
  parcelNo: string;
  anomalyType:
    | 'Unregistered Vertical Expansion'
    | 'Footprint Deviation (>10%)'
    | 'Height Discrepancy (>3m)'
    | 'Architecture Mismatch'
    | 'GIS Boundary Offset'
    | 'Missing Registry Record';
  confidenceScorePct: number;
  detectedEvidence: string;
  recommendedAction: 'Review' | 'Correct' | 'Field Verification' | 'Hold' | 'Resolve';
  status: 'Open' | 'Field Dispatched' | 'Resolved' | 'Held';
  flaggedTimestamp: string;
  assignedOfficer: string;
  fieldWorkOrderId?: string;
}

export interface FieldVerificationWorkOrder {
  workOrderId: string;
  buildingId: string;
  ulpin: string;
  parcelNo: string;
  issue: string;
  reason: string;
  requiredEvidence: string[];
  status: 'PENDING_DISPATCH' | 'IN_FIELD' | 'SUBMITTED_BY_FIELD' | 'INCORPORATED';
  fieldTeam: string;
  returnedEvidence?: {
    gnssLat: number;
    gnssLng: number;
    gnssElev: number;
    measuredHeightM: number;
    photographsCount: number;
    surveyorRemarks: string;
    timestamp: string;
    surveyorId: string;
  };
}

export interface QaQcCriterion {
  id: string;
  category: 'Accuracy' | 'Coverage' | 'LiDAR' | 'Surface' | '3D Geometry' | 'Topology';
  criterion: string;
  tolerance: string;
  measuredValue: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  isCritical: boolean;
  notes: string;
}

export interface DeliverableManifestItem {
  id: string;
  category: '2D Layers' | 'Elevation' | '3D Reconstruction' | 'GNSS Control' | 'Documentation';
  fileName: string;
  format: string;
  sizeBytes: string;
  sha256: string;
  status: 'GENERATED' | 'VALIDATED' | 'READY';
  description: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  stage: string;
  action: string;
  dataset: string;
  previousValue: string;
  newValue: string;
  reason: string;
}

export interface SurveyProject {
  id: string;
  title: string;
  state: string;
  district: string;
  ulb: string;
  ward: string;
  surveyUnit: string;
  aoiAreaKm2: number;
  assignedAgency: string;
  assignedTeam: string;
  deadlineDate: string;
  surveyRequirements: string[];
  crs: string;
  pipelineStep: number; // 1 to 9
  pipelineStatuses: {
    assignment: 'COMPLETED' | 'IN_PROGRESS';
    planning: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
    acquisition: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
    processing: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
    reconstruction3d: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
    verification: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
    qaQc: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
    delivery: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
    nakshaSubmission: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  };
  overallStatus: 'Active' | 'Assigned' | 'Processing' | '3D Reconstructed' | 'QC Pending' | 'Submitted' | 'Returned' | 'Completed';
  inputDatasets: DatasetItem[];
}

// ============================================================================
// REAL PROJECT DATASETS (PUNE, NASHIK, NAGPUR)
// ============================================================================

export const MOCK_PROJECTS: SurveyProject[] = [
  {
    id: 'PRJ-MP-IND-226821',
    title: 'Indore Ward 54 (Residency Ward) 3D Urban Survey Unit 1',
    state: 'Maharashtra',
    district: 'Indore',
    ulb: 'Indore - 250901',
    ward: '54 - Residency ward',
    surveyUnit: 'Survey Unit 1 (226821)',
    aoiAreaKm2: 4.85,
    assignedAgency: 'Survey of India Drone Survey Wing (Zone IV)',
    assignedTeam: 'Flight Crew Bravo (Operator: soi_operator_01)',
    deadlineDate: '30-Oct-2026',
    surveyRequirements: [
      'High-Resolution Nadir & Oblique Drone Photogrammetry (GSD <= 3cm)',
      'Aerial LiDAR Point Cloud Acquisition (>= 100 pts/m²)',
      'Dual-Frequency GNSS CORS Network Synchronization (RTK Fixed)',
      'Digital Surface Model (DSM) & Digital Elevation Model (DEM) Extraction',
      'LoD2 3D Reconstructed Building Volumetrics with Floorwise Slicing',
      'Architecture Sanctioned Plan Variance Analysis & GIS Cadastral Fusion',
      'NAKSHA V2.0 Spatial Schema & CityGML Deliverable Packaging'
    ],
    crs: 'WGS 84 / UTM zone 43N (EPSG:32643)',
    pipelineStep: 4, // Processing in progress
    pipelineStatuses: {
      assignment: 'COMPLETED',
      planning: 'COMPLETED',
      acquisition: 'COMPLETED',
      processing: 'IN_PROGRESS',
      reconstruction3d: 'PENDING',
      verification: 'PENDING',
      qaQc: 'PENDING',
      delivery: 'PENDING',
      nakshaSubmission: 'PENDING'
    },
    overallStatus: 'Processing',
    inputDatasets: [
      {
        id: 'DS-IND-01',
        name: 'Indore_W54_Drone_RGB_Raw.zip',
        category: 'Drone Images',
        fileType: 'JPEG / EXIF (4,820 Images)',
        size: '28.4 GB',
        coordinateSystem: 'WGS84 / UTM 43N (EPSG:32643)',
        source: 'DJI Matrice 350 RTK (Sony α7R IV 61MP)',
        timestamp: '05-Sep-2026 11:30 AM',
        uploadStatus: 'UPLOADED',
        validationStatus: 'READY',
        validationReport: 'EXIF GPS tags verified on 4,820 frames. Mean GSD: 2.1cm. Forward overlap: 82%, Side overlap: 76%.',
        itemCount: 4820,
        filePath: 'C:\\NAKSHA\\Survey_Data\\Indore\\226821\\RAW_PHOTOS'
      },
      {
        id: 'DS-IND-02',
        name: 'Indore_W54_Aerial_LiDAR.laz',
        category: 'LiDAR',
        fileType: 'LAS/LAZ 1.4 (Point Cloud)',
        size: '14.2 GB',
        coordinateSystem: 'WGS84 / UTM 43N (EPSG:32643)',
        source: 'Riegl miniVUX-3UAV Sensor',
        timestamp: '05-Sep-2026 01:15 PM',
        uploadStatus: 'UPLOADED',
        validationStatus: 'READY',
        validationReport: '48.6 Million Points ingested. Point density: 138 pts/m². 5 echo returns recorded. Calibration intact.',
        itemCount: 48600000,
        filePath: 'C:\\NAKSHA\\Survey_Data\\Indore\\226821\\LIDAR\\points.laz'
      },
      {
        id: 'DS-IND-03',
        name: 'Indore_CORS_RTK_Observations.rnx',
        category: 'GNSS',
        fileType: 'RINEX 3.04 & GCP Logs',
        size: '340 MB',
        coordinateSystem: 'WGS84 / UTM 43N (EPSG:32643)',
        source: 'Survey of India CORS Base (Station MP-IND-01)',
        timestamp: '05-Sep-2026 09:00 AM',
        uploadStatus: 'UPLOADED',
        validationStatus: 'READY',
        validationReport: 'CORS sync verified. 14 Ground Control Points + 6 Checkpoints locked with RMS <= 0.014m.',
        itemCount: 20,
        filePath: 'C:\\NAKSHA\\Survey_Data\\Indore\\226821\\GNSS\\base.rnx'
      },
      {
        id: 'DS-IND-04',
        name: '226821.zip',
        category: 'GIS',
        fileType: 'Vector Feature GDB (.zip)',
        size: '185 MB',
        coordinateSystem: 'WGS 84 / UTM zone 43N (EPSG:32643)',
        source: 'MP Revenue Cadastral & Land Records Dept',
        timestamp: '04-Sep-2026 04:20 PM',
        uploadStatus: 'UPLOADED',
        validationStatus: 'READY',
        validationReport: 'WKID: 32643 verified. Cadastral parcel polygons, ULPIN schema & Ward 54 boundary intact.',
        itemCount: 412,
        filePath: 'C:\\Users\\diksh\\Downloads\\Indore\\226821.zip'
      },
      {
        id: 'DS-IND-05',
        name: 'Indore_W54_Sanctioned_Architectural_Plans.dwg',
        category: 'Architecture',
        fileType: 'CAD / DXF / Approved Plan PDF',
        size: '95 MB',
        coordinateSystem: 'Projected Local Metric Grid',
        source: 'Indore Municipal Corporation (IMC Town Planning)',
        timestamp: '04-Sep-2026 02:10 PM',
        uploadStatus: 'UPLOADED',
        validationStatus: 'READY',
        validationReport: 'Approved sanction drawings loaded for 18 commercial/mixed complex parcels. Floor elevations mapped.',
        itemCount: 18,
        filePath: 'C:\\NAKSHA\\Survey_Data\\Indore\\226821\\PLANS'
      },
      {
        id: 'DS-IND-06',
        name: '226821.tpk',
        category: 'DSM/DEM',
        fileType: 'Drone ORI Raster (.tpk)',
        size: '1.2 GB',
        coordinateSystem: 'WGS 84 / UTM zone 43N (EPSG:32643)',
        source: 'Preliminary Drone Photogrammetry Stitch',
        timestamp: '05-Sep-2026 03:45 PM',
        uploadStatus: 'UPLOADED',
        validationStatus: 'READY',
        validationReport: '0.05m GSD Ground Sample Distance. Radiometric depth: 8-bit. Tile cache valid.',
        itemCount: 1,
        filePath: 'C:\\Users\\diksh\\Downloads\\Indore\\226821.tpk'
      }
    ]
  },
  {
    id: 'PRJ-MP-BPL-250946',
    title: 'Pune Hinjawadi & Baner 3D Cadastral Unit 2',
    state: 'Maharashtra',
    district: 'Pune',
    ulb: 'Pune - 270410',
    ward: '1 - Manakna gaon/ward',
    surveyUnit: 'Survey Unit 2 (250946)',
    aoiAreaKm2: 6.20,
    assignedAgency: 'GeoSpatial Dynamics India Pvt Ltd',
    assignedTeam: 'Survey Team Alpha',
    deadlineDate: '15-Nov-2026',
    surveyRequirements: [
      'High-Resolution Nadir & Oblique Drone Photogrammetry',
      'LiDAR Classification & Bare-Earth DEM Extraction',
      '3D Reconstructed Building Volumetrics',
      'Evidence Reconciliation Engine Matching'
    ],
    crs: 'WGS 84 / UTM zone 44N (EPSG:32644)',
    pipelineStep: 5, // 3D Reconstruction ready
    pipelineStatuses: {
      assignment: 'COMPLETED',
      planning: 'COMPLETED',
      acquisition: 'COMPLETED',
      processing: 'COMPLETED',
      reconstruction3d: 'IN_PROGRESS',
      verification: 'PENDING',
      qaQc: 'PENDING',
      delivery: 'PENDING',
      nakshaSubmission: 'PENDING'
    },
    overallStatus: '3D Reconstructed',
    inputDatasets: []
  },
  {
    id: 'PRJ-MP-GWL-250930',
    title: 'Gwalior Heritage Fort & Civil Lines Survey Unit 1',
    state: 'Maharashtra',
    district: 'Gwalior',
    ulb: 'Gwalior - 250930',
    ward: '12 - Lashkar Central',
    surveyUnit: 'Survey Unit 1 (250930)',
    aoiAreaKm2: 3.90,
    assignedAgency: 'Apex Aerial Surveys Ltd',
    assignedTeam: 'Field Crew Delta',
    deadlineDate: '05-Dec-2026',
    surveyRequirements: ['Photogrammetric Mesh', 'Heritage 3D Volume Calculation'],
    crs: 'WGS 84 / UTM zone 43N (EPSG:32643)',
    pipelineStep: 2,
    pipelineStatuses: {
      assignment: 'COMPLETED',
      planning: 'IN_PROGRESS',
      acquisition: 'PENDING',
      processing: 'PENDING',
      reconstruction3d: 'PENDING',
      verification: 'PENDING',
      qaQc: 'PENDING',
      delivery: 'PENDING',
      nakshaSubmission: 'PENDING'
    },
    overallStatus: 'Assigned',
    inputDatasets: []
  }
];

// ============================================================================
// GNSS & CORS CONTROL POINTS
// ============================================================================

export const MOCK_GCPS: GcpPoint[] = [
  {
    id: 'GCP-01',
    name: 'GCP Primary Base Station Marker',
    code: 'MP-IND-GCP-001',
    lat: 22.7196,
    lng: 75.8577,
    elevation: 541.28,
    accuracyH: 0.008,
    accuracyV: 0.012,
    residuals: { x: 0.004, y: -0.003, z: 0.005 },
    pointType: 'GCP',
    status: 'VALIDATED'
  },
  {
    id: 'GCP-02',
    name: 'Residency Club North Corner',
    code: 'MP-IND-GCP-002',
    lat: 22.7214,
    lng: 75.8612,
    elevation: 543.12,
    accuracyH: 0.010,
    accuracyV: 0.014,
    residuals: { x: -0.005, y: 0.006, z: -0.004 },
    pointType: 'GCP',
    status: 'VALIDATED'
  },
  {
    id: 'GCP-03',
    name: 'Collectorate Junction Monument',
    code: 'MP-IND-GCP-003',
    lat: 22.7178,
    lng: 75.8645,
    elevation: 539.84,
    accuracyH: 0.009,
    accuracyV: 0.013,
    residuals: { x: 0.002, y: 0.004, z: 0.003 },
    pointType: 'GCP',
    status: 'VALIDATED'
  },
  {
    id: 'GCP-04',
    name: 'Residency Park Boundary South',
    code: 'MP-IND-GCP-004',
    lat: 22.7152,
    lng: 75.8598,
    elevation: 537.45,
    accuracyH: 0.011,
    accuracyV: 0.015,
    residuals: { x: -0.003, y: -0.005, z: 0.006 },
    pointType: 'GCP',
    status: 'VALIDATED'
  },
  {
    id: 'CP-01',
    name: 'Check Point - Municipal Water Tank Pillar',
    code: 'MP-IND-CP-001',
    lat: 22.7202,
    lng: 75.8625,
    elevation: 544.50,
    accuracyH: 0.012,
    accuracyV: 0.017,
    residuals: { x: 0.006, y: 0.007, z: -0.008 },
    pointType: 'Check Point',
    status: 'VALIDATED'
  },
  {
    id: 'CP-02',
    name: 'Check Point - High Court Annex Cross',
    code: 'MP-IND-CP-002',
    lat: 22.7169,
    lng: 75.8562,
    elevation: 540.10,
    accuracyH: 0.010,
    accuracyV: 0.016,
    residuals: { x: -0.004, y: 0.003, z: 0.005 },
    pointType: 'Check Point',
    status: 'VALIDATED'
  }
];

// ============================================================================
// FLIGHT PLANS
// ============================================================================

export const MOCK_FLIGHT_PLANS: FlightPlan[] = [
  {
    id: 'FP-IND-01',
    name: 'Indore W54 Combined Oblique + Aerial LiDAR Mission',
    surveyMethod: 'OBLIQUE + LiDAR',
    altitudeMeters: 120,
    gsdCm: 2.1,
    forwardOverlapPct: 80,
    sideOverlapPct: 75,
    camera: 'Sony α7R IV (61.0 MP Full-Frame, 35mm f/2.8 lens)',
    drone: 'DJI Matrice 350 RTK Enterprise',
    lidarSensor: 'Riegl miniVUX-3UAV Laser Scanner',
    flightLinesCount: 16,
    estimatedImages: 1840,
    estimatedDuration: '44 mins (2 battery cycles)',
    coveragePercentage: 99.8,
    status: 'VALIDATED',
    waypoints: [
      [22.7150, 75.8550],
      [22.7240, 75.8550],
      [22.7240, 75.8580],
      [22.7150, 75.8580],
      [22.7150, 75.8610],
      [22.7240, 75.8610],
      [22.7240, 75.8640],
      [22.7150, 75.8640]
    ]
  },
  {
    id: 'FP-IND-02',
    name: 'Indore W54 Pure Nadir Orthophoto Fast Scan',
    surveyMethod: 'NADIR',
    altitudeMeters: 100,
    gsdCm: 1.8,
    forwardOverlapPct: 80,
    sideOverlapPct: 70,
    camera: 'Zenmuse P1 45MP Full-Frame',
    drone: 'DJI Matrice 300 RTK',
    lidarSensor: 'N/A (Photogrammetry Only)',
    flightLinesCount: 12,
    estimatedImages: 1250,
    estimatedDuration: '28 mins',
    coveragePercentage: 100.0,
    status: 'READY FOR MISSION',
    waypoints: [
      [22.7160, 75.8560],
      [22.7230, 75.8560],
      [22.7230, 75.8600],
      [22.7160, 75.8600]
    ]
  }
];

// ============================================================================
// PRE-FLIGHT CHECKLIST
// ============================================================================

export const MOCK_PREFLIGHT_CHECKS: PreFlightCheckItem[] = [
  { id: 'CHK-01', category: 'DRONE', item: 'TB65 Dual Intelligent Batteries Voltage Balance', status: 'PASS', value: '100% (52.4V, Cells balanced)', mandatory: true },
  { id: 'CHK-02', category: 'DRONE', item: 'IMU & Compass Multi-Sensor Calibration', status: 'PASS', value: 'Calibration Normal (RMS < 0.05)', mandatory: true },
  { id: 'CHK-03', category: 'DRONE', item: 'Propeller & Airframe Structural Integrity', status: 'PASS', value: 'Visual & Torque Check Passed', mandatory: true },
  { id: 'CHK-04', category: 'DRONE', item: 'High-Speed MicroSD / SSD Storage Capacity', status: 'PASS', value: '512 GB NVMe High Speed (480 GB Free)', mandatory: true },
  { id: 'CHK-05', category: 'LiDAR', item: 'Riegl miniVUX-3UAV Laser Scanner Online', status: 'PASS', value: 'Laser Diode Ready, 100 kHz Pulsing', mandatory: true },
  { id: 'CHK-06', category: 'LiDAR', item: 'LiDAR Boresight & Lever-Arm Calibration Matrix', status: 'PASS', value: 'Roll: 0.012°, Pitch: -0.008°, Yaw: 0.024°', mandatory: true },
  { id: 'CHK-07', category: 'GNSS', item: 'Survey of India CORS NTRIP Network Stream', status: 'PASS', value: 'Connected (Station MP-IND-01, Mount: RTCM33)', mandatory: true },
  { id: 'CHK-08', category: 'GNSS', item: 'Dual RTK Antenna Position Fix (NavIC + GPS + GLONASS)', status: 'PASS', value: 'RTK FIX (31 Satellites, H: 0.009m, V: 0.014m)', mandatory: true },
  { id: 'CHK-09', category: 'MISSION', item: 'Indore Ward 54 AOI Boundary Clearance & Geofencing', status: 'PASS', value: 'Polygon Loaded, DGCA Green Zone Cleared', mandatory: true },
  { id: 'CHK-10', category: 'MISSION', item: 'Flight Grid Overlap (80% Forward / 75% Side)', status: 'PASS', value: 'Validated on 16 Grid Flightlines', mandatory: true },
  { id: 'CHK-11', category: 'MISSION', item: 'Survey Control GCP Targets Deployed & Surveyed', status: 'PASS', value: '4 GCPs + 2 Checkpoints Active', mandatory: true }
];

// ============================================================================
// TELEMETRY HUD STATE
// ============================================================================

export const MOCK_TELEMETRY: TelemetryData = {
  drone: {
    batteryPct: 86,
    altitudeMeters: 120.4,
    speedMs: 7.4,
    satellites: 31,
    gpsStatus: 'NavIC+GPS+Galileo High Precision',
    rtkStatus: 'RTK FIX',
    headingDeg: 182.5,
    currentLat: 22.7198,
    currentLng: 75.8605
  },
  camera: {
    imagesCaptured: 1420,
    imageQualityPct: 98.6,
    blurPercentage: 0.15,
    coveragePct: 78.4,
    shutterSpeed: '1/1600s',
    iso: 200
  },
  lidar: {
    pointCount: 38450120,
    pointDensityM2: 142.8,
    sensorStatus: '100 kHz Active • 5 Returns Tracking',
    pulseRateKhz: 100,
    fovDeg: 120
  },
  gnss: {
    rtkFix: true,
    horizAccuracyM: 0.009,
    vertAccuracyM: 0.014,
    baseStationDistanceKm: 3.2,
    corsId: 'SoI-CORS-MP-IND-01'
  }
};

// ============================================================================
// PROCESSING PIPELINE STAGES
// ============================================================================

export const MOCK_PROCESSING_STAGES: ProcessingStageItem[] = [
  {
    id: 'STG-01',
    stageName: 'Image Ingestion & Quality QC',
    category: 'Photogrammetry',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '6m 12s',
    outputArtifact: '4,820 Calibrated Image Metadata Records',
    logLines: [
      '[08:30:01] Reading 4,820 raw drone exposures from C:\\NAKSHA\\Survey_Data\\Indore\\226821\\RAW_PHOTOS...',
      '[08:32:15] EXIF GPS / Timestamp parsed. Mean sensor temperature: 34.2°C.',
      '[08:35:40] Laplacian blur detection complete. 4,818 sharp frames (99.9%), 2 flagged for edge reprojection.',
      '[08:36:13] Stage 1 COMPLETE. All exposures accepted for photogrammetric reconstruction.'
    ]
  },
  {
    id: 'STG-02',
    stageName: 'Sensor Calibration & Camera Interior Orientation',
    category: 'Photogrammetry',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '4m 45s',
    outputArtifact: 'Focal Length: 35.12mm, Principle Point Offset, Radial Distortion Matrix',
    logLines: [
      '[08:36:15] Estimating initial interior orientation parameters for Sony α7R IV (61MP)...',
      '[08:38:20] Solving Brown-Conrady lens distortion model: k1=-0.042, k2=0.018, p1=0.0002, p2=-0.0001.',
      '[08:40:58] Camera interior orientation converged with reprojection error 0.42 pixels.'
    ]
  },
  {
    id: 'STG-03',
    stageName: 'SIFT Feature Matching & Epipolar Geometry',
    category: 'Photogrammetry',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '18m 30s',
    outputArtifact: '4.8 Million Tie Points Across 4,820 Frame Pairs',
    logLines: [
      '[08:41:00] Initializing multi-scale GPU SIFT keypoint detector (NVIDIA RTX A5000)...',
      '[08:52:14] Extracted 38,400 tie points per overlapping image baseline.',
      '[08:59:25] Epipolar geometric consistency verified across 18 flight track lines.'
    ]
  },
  {
    id: 'STG-04',
    stageName: 'Sparse Bundle Adjustment & Control Alignment',
    category: 'Photogrammetry',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '12m 10s',
    outputArtifact: 'Sparse Point Cloud (1.2M points) + Camera Trajectories (RMS 0.014m)',
    logLines: [
      '[08:59:30] Executing Levenberg-Marquardt non-linear least squares optimization...',
      '[09:05:40] Injecting 4 Ground Control Points (GCP-01 to GCP-04) + CORS RTK base trajectory.',
      '[09:11:38] Global bundle adjustment converged. Horizontal RMS: 0.009m, Vertical RMS: 0.014m.'
    ]
  },
  {
    id: 'STG-05',
    stageName: 'Dense Reconstruction (Multi-View Stereo)',
    category: 'Photogrammetry',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '34m 50s',
    outputArtifact: 'Dense Photogrammetric Point Cloud (142.4 Million Points)',
    logLines: [
      '[09:11:40] Constructing semi-global depth maps across all camera stereopairs...',
      '[09:32:10] Point cloud densification running: 142,480,900 3D spatial points generated.',
      '[09:46:28] Dense point cloud filtering and statistical outlier removal complete.'
    ]
  },
  {
    id: 'STG-06',
    stageName: 'Aerial LiDAR Classification & Filtering',
    category: 'LiDAR',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '14m 20s',
    outputArtifact: 'ASPRS Standard LAS 1.4 Classified (Ground=Class 2, Building=Class 6, Veg=Class 3-5)',
    logLines: [
      '[09:46:30] Reading 48.6M Riegl LiDAR returns from C:\\NAKSHA\\Survey_Data\\Indore\\226821\\LIDAR\\points.laz...',
      '[09:52:10] Progressive TIN densification applied for bare-earth ground filtering.',
      '[09:58:45] Point classification: Ground: 18.2M pts (Class 2), Buildings: 24.8M pts (Class 6), Vegetation: 5.6M pts.'
    ]
  },
  {
    id: 'STG-07',
    stageName: 'Photogrammetry + LiDAR + GNSS Geospatial Fusion',
    category: 'Fusion',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '16m 05s',
    outputArtifact: 'Fused Georeferenced 3D Master Spatial Dataset (WKID 32643)',
    logLines: [
      '[09:58:50] Performing Iterative Closest Point (ICP) registration between photogrammetry & LiDAR point clouds...',
      '[10:08:20] Co-registration residuals: dX=0.006m, dY=0.005m, dZ=0.009m.',
      '[10:14:52] Fusion successful. Georeferenced multi-sensor point cloud assembled.'
    ]
  },
  {
    id: 'STG-08',
    stageName: 'Digital Surface Model (DSM) Generation',
    category: 'Surface',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '8m 40s',
    outputArtifact: '0.05m High-Resolution DSM GeoTIFF (226821_DSM.tif)',
    logLines: [
      '[10:14:55] Interpolating highest first-return surface elevations onto 0.05m raster grid...',
      '[10:20:10] Capturing rooftops, architectural cornices, parapets, and canopy envelopes.',
      '[10:23:32] DSM raster generation complete. Elevation span: 512.4m to 548.8m.'
    ]
  },
  {
    id: 'STG-09',
    stageName: 'Digital Elevation Model (DEM / DTM) Generation',
    category: 'Surface',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '7m 15s',
    outputArtifact: '0.10m Bare-Earth Ground Terrain DTM GeoTIFF (226821_DEM.tif)',
    logLines: [
      '[10:23:35] Interpolating classified ground returns (Class 2) for bare-earth topography...',
      '[10:28:40] Hydrological conditioning and contour smoothing applied.',
      '[10:30:48] DEM / DTM terrain model generated. Ground datum established.'
    ]
  },
  {
    id: 'STG-10',
    stageName: 'Building Footprint Vector Extraction & Normalization',
    category: '3D Reconstruction',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '11m 30s',
    outputArtifact: '412 Reconstructed Vector Building Footprints with ULPIN Mapping',
    logLines: [
      '[10:30:50] Calculating normalized Digital Surface Model (nDSM = DSM - DEM) for height segmentation...',
      '[10:36:20] Applying RANSAC building edge vectorization and orthogonal polygon regularization.',
      '[10:42:18] Reconstructed 412 discrete building footprint polygons conforming to cadastral boundaries.'
    ]
  },
  {
    id: 'STG-11',
    stageName: 'LoD2 3D Building Volumetric & Floor Slicing Engine',
    category: '3D Reconstruction',
    progressPct: 100,
    status: 'COMPLETED',
    duration: '19m 20s',
    outputArtifact: '412 LoD2 3D Building Models with Floor & Unit 3D Volumes (CityGML / glTF)',
    logLines: [
      '[10:42:20] Extruding 3D building solid geometries with multi-pitch and flat rooftop classification...',
      '[10:52:10] Slicing vertical point cloud density profiles to detect inter-floor slab elevations.',
      '[11:01:38] All 412 building volumetric solids synthesized with floorwise spatial hierarchy.'
    ]
  }
];

// ============================================================================
// DSM / DEM ELEVATION MODEL DATA
// ============================================================================

export const MOCK_DSM_DEM_DATA: DsmDemElevationData = {
  dsmResolutionM: 0.05,
  demResolutionM: 0.10,
  minElevationM: 512.4,
  maxElevationM: 548.8,
  meanElevationM: 531.2,
  stdDevM: 6.84,
  processingStatus: 'COMPLETED',
  qualityStatus: 'PASS',
  crossSectionPoints: [
    { distanceM: 0, dsmElevM: 524.2, demElevM: 524.2, heightDiffM: 0.0 },
    { distanceM: 15, dsmElevM: 524.5, demElevM: 524.4, heightDiffM: 0.1 },
    { distanceM: 30, dsmElevM: 525.0, demElevM: 524.8, heightDiffM: 0.2 },
    { distanceM: 45, dsmElevM: 543.4, demElevM: 524.8, heightDiffM: 18.6 }, // Building 1 front
    { distanceM: 60, dsmElevM: 543.4, demElevM: 524.9, heightDiffM: 18.5 }, // Building 1 roof
    { distanceM: 75, dsmElevM: 543.4, demElevM: 525.0, heightDiffM: 18.4 }, // Building 1 rear
    { distanceM: 90, dsmElevM: 525.2, demElevM: 525.1, heightDiffM: 0.1 }, // Courtyard
    { distanceM: 110, dsmElevM: 537.2, demElevM: 525.2, heightDiffM: 12.0 }, // Building 2 front
    { distanceM: 130, dsmElevM: 537.2, demElevM: 525.3, heightDiffM: 11.9 }, // Building 2 roof
    { distanceM: 150, dsmElevM: 525.5, demElevM: 525.4, heightDiffM: 0.1 }  // Road
  ]
};

// ============================================================================
// 3D RECONSTRUCTED BUILDING HIERARCHY (PARCEL -> BLDG -> FLOOR -> UNIT -> 3D VOLUME)
// ============================================================================

export const MOCK_RECONSTRUCTED_BUILDINGS: ReconstructedBuildingModel[] = [
  {
    id: 'BLDG-IND-001',
    buildingCode: 'B001',
    buildingName: 'Shree Ganesh Commercial Arcade & Residences',
    officialUlpin: '230410010020101', // Official 14-char ULPIN (Not redefined)
    parcelNo: '101/1',
    district: 'Indore',
    ulb: 'Indore - 250901',
    ward: '54 - Residency ward',
    surveyUnit: 'Survey Unit 1 (226821)',
    coordinates: [22.7198, 75.8605],
    footprintAreaSqm: 540.8,
    totalHeightMeters: 18.6,
    totalFloors: 5,
    totalVolumeM3: 10058.9,
    structuralType: 'RCC Frame',
    reconstructionConfidence: 98.4,
    sourceDatasets: ['Photogrammetry Point Cloud', 'LiDAR LAS 1.4', 'CORS RTK Fix (SoI-01)'],
    cadastralAlignmentStatus: 'Compliant',
    floors: [
      {
        floorLevel: 0,
        floorName: 'Ground Floor (Commercial Retail)',
        floorId: 'FLR-B001-00',
        elevationMeters: 524.8,
        heightMeters: 4.2,
        builtUpAreaSqm: 520.0,
        unitsCount: 4,
        confidencePct: 99.2,
        sourceDataset: 'Ground LiDAR + Drone Oblique',
        hasAnomaly: false,
        units: [
          { id: 'U-G01', unitNumber: 'Shop G-01', floorLevel: 0, useType: 'Commercial', carpetAreaSqm: 115.0, ownerName: 'Rameshwar Lal Agrawal', taxAssessmentNo: 'IMC-PT-2026-8801', annualTaxInr: 28500, status: 'Verified', volume3dSqm: 483.0 },
          { id: 'U-G02', unitNumber: 'Shop G-02', floorLevel: 0, useType: 'Commercial', carpetAreaSqm: 120.0, ownerName: 'Deepak Patidar', taxAssessmentNo: 'IMC-PT-2026-8802', annualTaxInr: 29800, status: 'Verified', volume3dSqm: 504.0 },
          { id: 'U-G03', unitNumber: 'Shop G-03 (Bank ATM)', floorLevel: 0, useType: 'Commercial', carpetAreaSqm: 95.0, ownerName: 'Indore Urban Bank Ltd', taxAssessmentNo: 'IMC-PT-2026-8803', annualTaxInr: 34000, status: 'Verified', volume3dSqm: 399.0 },
          { id: 'U-G04', unitNumber: 'Common Lobby & Utility', floorLevel: 0, useType: 'Utility', carpetAreaSqm: 125.0, ownerName: 'Society Management', taxAssessmentNo: 'IMC-PT-2026-8804', annualTaxInr: 0, status: 'Verified', volume3dSqm: 525.0 }
        ]
      },
      {
        floorLevel: 1,
        floorName: 'Floor 1 (Professional Offices)',
        floorId: 'FLR-B001-01',
        elevationMeters: 529.0,
        heightMeters: 3.6,
        builtUpAreaSqm: 535.0,
        unitsCount: 3,
        confidencePct: 98.8,
        sourceDataset: 'Drone Oblique + LiDAR',
        hasAnomaly: false,
        units: [
          { id: 'U-101', unitNumber: 'Office 101', floorLevel: 1, useType: 'Commercial', carpetAreaSqm: 170.0, ownerName: 'Anand & Associates CA', taxAssessmentNo: 'IMC-PT-2026-8811', annualTaxInr: 24000, status: 'Verified', volume3dSqm: 612.0 },
          { id: 'U-102', unitNumber: 'Office 102', floorLevel: 1, useType: 'Commercial', carpetAreaSqm: 185.0, ownerName: 'Malwa Tech Solutions', taxAssessmentNo: 'IMC-PT-2026-8812', annualTaxInr: 26500, status: 'Verified', volume3dSqm: 666.0 },
          { id: 'U-103', unitNumber: 'Office 103', floorLevel: 1, useType: 'Commercial', carpetAreaSqm: 140.0, ownerName: 'Dr. Neha Kulkarni Clinic', taxAssessmentNo: 'IMC-PT-2026-8813', annualTaxInr: 21000, status: 'Verified', volume3dSqm: 504.0 }
        ]
      },
      {
        floorLevel: 2,
        floorName: 'Floor 2 (Residential Apartments)',
        floorId: 'FLR-B001-02',
        elevationMeters: 532.6,
        heightMeters: 3.4,
        builtUpAreaSqm: 535.0,
        unitsCount: 2,
        confidencePct: 98.5,
        sourceDataset: 'Drone Oblique Photogrammetry',
        hasAnomaly: false,
        units: [
          { id: 'U-201', unitNumber: 'Flat 201 (3BHK)', floorLevel: 2, useType: 'Residential', carpetAreaSqm: 240.0, ownerName: 'Sunita Devi Agrawal', taxAssessmentNo: 'IMC-PT-2026-8821', annualTaxInr: 12500, status: 'Verified', volume3dSqm: 816.0 },
          { id: 'U-202', unitNumber: 'Flat 202 (3BHK)', floorLevel: 2, useType: 'Residential', carpetAreaSqm: 250.0, ownerName: 'Praveen Jain', taxAssessmentNo: 'IMC-PT-2026-8822', annualTaxInr: 13000, status: 'Verified', volume3dSqm: 850.0 }
        ]
      },
      {
        floorLevel: 3,
        floorName: 'Floor 3 (Residential Apartments)',
        floorId: 'FLR-B001-03',
        elevationMeters: 536.0,
        heightMeters: 3.4,
        builtUpAreaSqm: 535.0,
        unitsCount: 2,
        confidencePct: 98.0,
        sourceDataset: 'Drone Oblique Photogrammetry',
        hasAnomaly: false,
        units: [
          { id: 'U-301', unitNumber: 'Flat 301 (3BHK)', floorLevel: 3, useType: 'Residential', carpetAreaSqm: 240.0, ownerName: 'Sanjay Rathore', taxAssessmentNo: 'IMC-PT-2026-8831', annualTaxInr: 12500, status: 'Verified', volume3dSqm: 816.0 },
          { id: 'U-302', unitNumber: 'Flat 302 (3BHK)', floorLevel: 3, useType: 'Residential', carpetAreaSqm: 250.0, ownerName: 'Kailash Chand Verma', taxAssessmentNo: 'IMC-PT-2026-8832', annualTaxInr: 13000, status: 'Verified', volume3dSqm: 850.0 }
        ]
      },
      {
        floorLevel: 4,
        floorName: 'Floor 4 (Rooftop Penthouse Structure)',
        floorId: 'FLR-B001-04',
        elevationMeters: 539.4,
        heightMeters: 3.6,
        builtUpAreaSqm: 360.0,
        unitsCount: 1,
        confidencePct: 97.4,
        sourceDataset: 'Aerial Drone Oblique + LiDAR DSM Top',
        hasAnomaly: true,
        anomalyNotes: 'Sanctioned plan permits G+3 only (Max height 15.0m). Detected 5th floor penthouse adds +3.6m elevation and 360m² built volume.',
        units: [
          { id: 'U-401', unitNumber: 'Penthouse Suite 401', floorLevel: 4, useType: 'Residential', carpetAreaSqm: 320.0, ownerName: 'Unregistered Occupant / Under Review', taxAssessmentNo: 'NOT_FOUND_IN_TAX_REGISTER', annualTaxInr: 0, status: 'Unregistered', volume3dSqm: 1152.0 }
        ]
      }
    ]
  },
  {
    id: 'BLDG-IND-002',
    buildingCode: 'B002',
    buildingName: 'Residency Plaza Executive Tower',
    officialUlpin: '230410010020102',
    parcelNo: '101/2',
    district: 'Indore',
    ulb: 'Indore - 250901',
    ward: '54 - Residency ward',
    surveyUnit: 'Survey Unit 1 (226821)',
    coordinates: [22.7212, 75.8618],
    footprintAreaSqm: 620.0,
    totalHeightMeters: 14.2,
    totalFloors: 4,
    totalVolumeM3: 8804.0,
    structuralType: 'Steel Composite',
    reconstructionConfidence: 99.1,
    sourceDatasets: ['Photogrammetry Point Cloud', 'LiDAR LAS 1.4'],
    cadastralAlignmentStatus: 'Compliant',
    floors: [
      {
        floorLevel: 0,
        floorName: 'Ground Floor (Banking)',
        floorId: 'FLR-B002-00',
        elevationMeters: 525.0,
        heightMeters: 4.0,
        builtUpAreaSqm: 600.0,
        unitsCount: 2,
        confidencePct: 99.4,
        sourceDataset: 'LiDAR + Drone',
        hasAnomaly: false,
        units: [
          { id: 'U-B2-G01', unitNumber: 'Bank Main Hall', floorLevel: 0, useType: 'Commercial', carpetAreaSqm: 420.0, ownerName: 'State Bank of India', taxAssessmentNo: 'IMC-PT-2026-9101', annualTaxInr: 85000, status: 'Verified', volume3dSqm: 1680.0 },
          { id: 'U-B2-G02', unitNumber: 'ATM Zone', floorLevel: 0, useType: 'Commercial', carpetAreaSqm: 80.0, ownerName: 'State Bank of India', taxAssessmentNo: 'IMC-PT-2026-9102', annualTaxInr: 18000, status: 'Verified', volume3dSqm: 320.0 }
        ]
      },
      {
        floorLevel: 1,
        floorName: 'Floor 1 (Offices)',
        floorId: 'FLR-B002-01',
        elevationMeters: 529.0,
        heightMeters: 3.4,
        builtUpAreaSqm: 600.0,
        unitsCount: 2,
        confidencePct: 99.1,
        sourceDataset: 'LiDAR + Drone',
        hasAnomaly: false,
        units: [
          { id: 'U-B2-101', unitNumber: 'Office 201', floorLevel: 1, useType: 'Commercial', carpetAreaSqm: 260.0, ownerName: 'Nexus Legal Chambers', taxAssessmentNo: 'IMC-PT-2026-9111', annualTaxInr: 32000, status: 'Verified', volume3dSqm: 884.0 },
          { id: 'U-B2-102', unitNumber: 'Office 202', floorLevel: 1, useType: 'Commercial', carpetAreaSqm: 280.0, ownerName: 'Apex Architecture', taxAssessmentNo: 'IMC-PT-2026-9112', annualTaxInr: 35000, status: 'Verified', volume3dSqm: 952.0 }
        ]
      },
      {
        floorLevel: 2,
        floorName: 'Floor 2 (Offices)',
        floorId: 'FLR-B002-02',
        elevationMeters: 532.4,
        heightMeters: 3.4,
        builtUpAreaSqm: 600.0,
        unitsCount: 2,
        confidencePct: 98.9,
        sourceDataset: 'Drone Oblique',
        hasAnomaly: false,
        units: [
          { id: 'U-B2-201', unitNumber: 'Office 301', floorLevel: 2, useType: 'Commercial', carpetAreaSqm: 270.0, ownerName: 'Fintech Hub', taxAssessmentNo: 'IMC-PT-2026-9121', annualTaxInr: 33000, status: 'Verified', volume3dSqm: 918.0 },
          { id: 'U-B2-202', unitNumber: 'Office 302', floorLevel: 2, useType: 'Commercial', carpetAreaSqm: 270.0, ownerName: 'Indore MediTech', taxAssessmentNo: 'IMC-PT-2026-9122', annualTaxInr: 33000, status: 'Verified', volume3dSqm: 918.0 }
        ]
      },
      {
        floorLevel: 3,
        floorName: 'Floor 3 (Conference Suites)',
        floorId: 'FLR-B002-03',
        elevationMeters: 535.8,
        heightMeters: 3.4,
        builtUpAreaSqm: 600.0,
        unitsCount: 1,
        confidencePct: 98.7,
        sourceDataset: 'Drone Oblique',
        hasAnomaly: false,
        units: [
          { id: 'U-B2-301', unitNumber: 'Executive Hall 401', floorLevel: 3, useType: 'Commercial', carpetAreaSqm: 520.0, ownerName: 'Residency Club Trustees', taxAssessmentNo: 'IMC-PT-2026-9131', annualTaxInr: 60000, status: 'Verified', volume3dSqm: 1768.0 }
        ]
      }
    ]
  }
];

// ============================================================================
// ARCHITECTURE COMPARISON CASES
// ============================================================================

export const MOCK_ARCHITECTURE_COMPARISONS: ArchitectureComparisonRecord[] = [
  {
    id: 'ARC-COMP-01',
    buildingId: 'BLDG-IND-001',
    ulpin: '230410010020101',
    attribute: 'Building Footprint Area',
    surveyValue: '540.8 m²',
    architecturePlanValue: '540.0 m² (Sanctioned Plan IMC/TP/2021/412)',
    varianceValue: '+0.8 m² (+0.15%)',
    status: 'MATCH',
    isReviewCandidate: false,
    notes: 'Footprint boundary geometry matches within approved RTK tolerance (±0.05m).'
  },
  {
    id: 'ARC-COMP-02',
    buildingId: 'BLDG-IND-001',
    ulpin: '230410010020101',
    attribute: 'Total Vertical Building Height',
    surveyValue: '18.6 m (Ground datum 524.8m to Parapet 543.4m)',
    architecturePlanValue: '15.0 m Maximum Permissible Height',
    varianceValue: '+3.6 m Excess Vertical Envelope',
    status: 'MISMATCH',
    isReviewCandidate: true,
    notes: 'LiDAR and photogrammetry detect +3.6m height above sanctioned elevation. Flagged as Review Candidate.'
  },
  {
    id: 'ARC-COMP-03',
    buildingId: 'BLDG-IND-001',
    ulpin: '230410010020101',
    attribute: 'Floor Count Hierarchy',
    surveyValue: '5 Floors (Ground + 4 Stories)',
    architecturePlanValue: '4 Floors (Ground + 3 Stories Sanctioned)',
    varianceValue: '+1 Additional Floor (Floor 4 Penthouse)',
    status: 'MISMATCH',
    isReviewCandidate: true,
    notes: 'Survey identifies active 5th floor slab. Sanction plan indicates open terrace. Review Case generated.'
  },
  {
    id: 'ARC-COMP-04',
    buildingId: 'BLDG-IND-001',
    ulpin: '230410010020101',
    attribute: 'Total Built-Up Area',
    surveyValue: '2,485 m²',
    architecturePlanValue: '2,125 m² Sanctioned FAR',
    varianceValue: '+360 m² Excess Built-Up Space',
    status: 'MISMATCH',
    isReviewCandidate: true,
    notes: 'Additional built area corresponds precisely with 4th floor penthouse structure.'
  },
  {
    id: 'ARC-COMP-05',
    buildingId: 'BLDG-IND-001',
    ulpin: '230410010020101',
    attribute: 'Zonal Land Use Conformance',
    surveyValue: 'Mixed Commercial (G+1) + Residential (F2-4)',
    architecturePlanValue: 'Mixed Use Commercial / Residential',
    varianceValue: '0 (Conforms to Indore Master Plan 2031)',
    status: 'MATCH',
    isReviewCandidate: false,
    notes: 'Land use adheres to Indore Master Plan zoning for Residency Ward.'
  }
];

// ============================================================================
// GIS LAYER COMPARISON OVERLAYS
// ============================================================================

export const MOCK_GIS_OVERLAYS: GisOverlayLayer[] = [
  {
    id: 'GIS-LAY-01',
    name: 'Revenue Cadastral Parcel Polygon (Khasra 101/1)',
    type: 'Cadastral',
    opacity: 0.85,
    visible: true,
    color: '#3b82f6',
    varianceDetected: false,
    metrics: 'Parcel Area: 620.0 m² • Boundary Offset: 0.04m'
  },
  {
    id: 'GIS-LAY-02',
    name: 'Municipal Property Tax Assessment Ring',
    type: 'TaxPolygon',
    opacity: 0.70,
    visible: true,
    color: '#10b981',
    varianceDetected: false,
    metrics: 'Assessed Ground Footprint: 540.0 m² • Tax Assessment: Valid'
  },
  {
    id: 'GIS-LAY-03',
    name: 'Approved Sanctioned Building Footprint',
    type: 'Footprint',
    opacity: 0.75,
    visible: true,
    color: '#8b5cf6',
    varianceDetected: false,
    metrics: 'Sanctioned Footprint: 540.0 m² • Conforms to setback rules'
  },
  {
    id: 'GIS-LAY-04',
    name: 'Survey-Derived 3D Extruded Footprint',
    type: 'SurveyDerived',
    opacity: 0.90,
    visible: true,
    color: '#f59e0b',
    varianceDetected: true,
    metrics: 'Surveyed Footprint: 540.8 m² • Vertical Expansion: +1 Floor (+3.6m)'
  }
];

// ============================================================================
// ANOMALY DETECTION QUEUE
// ============================================================================

export const MOCK_ANOMALY_QUEUE: AnomalyCase[] = [
  {
    caseId: 'ANOM-2026-081',
    buildingId: 'BLDG-IND-001',
    ulpin: '230410010020101',
    parcelNo: '101/1',
    anomalyType: 'Unregistered Vertical Expansion',
    confidenceScorePct: 97.4,
    detectedEvidence: 'Aerial drone photogrammetry & LiDAR point cloud detect 5th level structure (+3.6m above approved terrace slab, 360m² built area) not present in sanctioned CAD plan IMC/TP/2021/412.',
    recommendedAction: 'Field Verification',
    status: 'Open',
    flaggedTimestamp: '05-Sep-2026 02:45 PM',
    assignedOfficer: 'soi_operator_01',
    fieldWorkOrderId: 'FVR-2026-042'
  },
  {
    caseId: 'ANOM-2026-082',
    buildingId: 'BLDG-IND-003',
    ulpin: '230410010020104',
    parcelNo: '103/1',
    anomalyType: 'Footprint Deviation (>10%)',
    confidenceScorePct: 92.1,
    detectedEvidence: 'Surveyed building footprint (312m²) extends 24m² beyond registered property tax polygon into rear marginal setback.',
    recommendedAction: 'Review',
    status: 'Open',
    flaggedTimestamp: '05-Sep-2026 03:10 PM',
    assignedOfficer: 'soi_operator_01'
  },
  {
    caseId: 'ANOM-2026-083',
    buildingId: 'BLDG-IND-007',
    ulpin: '230410010020109',
    parcelNo: '107/A',
    anomalyType: 'Missing Registry Record',
    confidenceScorePct: 88.5,
    detectedEvidence: 'Permanent RCC structure (G+1, 140m²) detected in drone survey with no corresponding tax PIN or sanctioned plan in municipal registry.',
    recommendedAction: 'Field Verification',
    status: 'Field Dispatched',
    flaggedTimestamp: '05-Sep-2026 03:30 PM',
    assignedOfficer: 'soi_operator_01',
    fieldWorkOrderId: 'FVR-2026-043'
  }
];

// ============================================================================
// FIELD VERIFICATION WORK ORDERS
// ============================================================================

export const MOCK_FIELD_VERIFICATIONS: FieldVerificationWorkOrder[] = [
  {
    workOrderId: 'FVR-2026-042',
    buildingId: 'BLDG-IND-001',
    ulpin: '230410010020101',
    parcelNo: '101/1',
    issue: 'Potential Rooftop Penthouse Construction (Floor 4, +3.6m elevation)',
    reason: 'Drone photogrammetry indicates vertical expansion beyond G+3 sanction. Ground confirmation needed for occupancy and structural type.',
    requiredEvidence: [
      'High-precision GNSS RTK corner coordinates of 4th floor',
      'Geotagged photographs of rooftop staircase & entrance',
      'Physical laser tape measurement of rooftop clear height',
      'Occupancy inquiry: Electricity meter count and resident name'
    ],
    status: 'SUBMITTED_BY_FIELD',
    fieldTeam: 'Ground Field Unit 3 (Inspector: S. K. Chouhan)',
    returnedEvidence: {
      gnssLat: 22.71982,
      gnssLng: 75.86054,
      gnssElev: 543.42,
      measuredHeightM: 3.58,
      photographsCount: 6,
      surveyorRemarks: 'Physical inspection completed. Dedicated staircase leads to fully finished residential penthouse. Independent electricity meter (MPPKVVCL ID: 8891042) installed in name of R. K. Agrawal. Construction is permanent RCC.',
      timestamp: '06-Sep-2026 10:15 AM',
      surveyorId: 'SOI_FIELD_INSP_04'
    }
  }
];

// ============================================================================
// 3D QA / QC CRITERIA
// ============================================================================

export const MOCK_QAQC_CHECKS: QaQcCriterion[] = [
  { id: 'QC-01', category: 'Accuracy', criterion: 'Horizontal Absolute Accuracy (RMSE)', tolerance: '<= 0.050 m', measuredValue: '0.009 m', status: 'PASS', isCritical: true, notes: 'Validated against 4 SoI CORS synchronized GCPs.' },
  { id: 'QC-02', category: 'Accuracy', criterion: 'Vertical Absolute Accuracy (RMSE)', tolerance: '<= 0.080 m', measuredValue: '0.014 m', status: 'PASS', isCritical: true, notes: 'Evaluated against ellipsoidal heights of 2 Independent Checkpoints.' },
  { id: 'QC-03', category: 'Accuracy', criterion: 'GCP Control Point Residuals (Mean RMS)', tolerance: '<= 0.025 m', measuredValue: '0.011 m', status: 'PASS', isCritical: true, notes: 'Residual vectors evenly distributed across AOI.' },
  { id: 'QC-04', category: 'Coverage', criterion: 'Aerial Photogrammetric Image Coverage', tolerance: '>= 95.0%', measuredValue: '99.8%', status: 'PASS', isCritical: true, notes: '16 flight lines achieved 80% forward / 75% side overlap.' },
  { id: 'QC-05', category: 'Coverage', criterion: 'Image Quality & Blur Index', tolerance: '<= 2.0% blur', measuredValue: '0.15% blur', status: 'PASS', isCritical: false, notes: '4,818 of 4,820 frames met high-definition crispness criteria.' },
  { id: 'QC-06', category: 'LiDAR', criterion: 'LiDAR Point Density on Building Roofs', tolerance: '>= 100 pts/m²', measuredValue: '142.8 pts/m²', status: 'PASS', isCritical: true, notes: 'Riegl miniVUX scanner captured multi-return architectural detail.' },
  { id: 'QC-07', category: 'LiDAR', criterion: 'ASPRS Point Cloud Classification Integrity', tolerance: '>= 95.0% accuracy', measuredValue: '98.6%', status: 'PASS', isCritical: true, notes: 'Ground (Class 2) and Buildings (Class 6) classified without confusion.' },
  { id: 'QC-08', category: 'Surface', criterion: 'Digital Surface Model (DSM) Spatial Resolution', tolerance: '<= 0.05 m GSD', measuredValue: '0.050 m', status: 'PASS', isCritical: true, notes: 'Rooftop features and parapets distinctly resolved.' },
  { id: 'QC-09', category: 'Surface', criterion: 'Digital Elevation Model (DEM) Bare-Earth Quality', tolerance: '<= 0.10 m GSD', measuredValue: '0.100 m', status: 'PASS', isCritical: true, notes: 'Vegetation canopy successfully stripped to expose ground datum.' },
  { id: 'QC-10', category: '3D Geometry', criterion: '3D Building Solid Manifoldness & Water-Tightness', tolerance: '100% 2-manifold', measuredValue: '100% Watertight', status: 'PASS', isCritical: true, notes: 'No non-manifold edges, zero self-intersections detected.' },
  { id: 'QC-11', category: '3D Geometry', criterion: 'Duplicate Building Volumes & Sliver Polygons', tolerance: '0 Duplicates', measuredValue: '0 Detected', status: 'PASS', isCritical: true, notes: 'Spatial index deduplication clean.' },
  { id: 'QC-12', category: 'Topology', criterion: 'Building-to-Cadastral Parcel Enclosure', tolerance: '<= 0.20 m offset', measuredValue: '0.040 m mean offset', status: 'PASS', isCritical: true, notes: 'All 412 buildings linked to official 14-char ULPIN anchors.' },
  { id: 'QC-13', category: 'Topology', criterion: 'Coordinate Reference System Verification', tolerance: 'Exact CRS Match', measuredValue: 'EPSG:32643 (UTM 43N)', status: 'PASS', isCritical: true, notes: 'Verified matching Survey of India State projection standard.' }
];

// ============================================================================
// DELIVERABLE PACKAGE MANIFEST
// ============================================================================

export const MOCK_DELIVERABLE_MANIFEST: DeliverableManifestItem[] = [
  { id: 'DEL-01', category: '2D Layers', fileName: '226821.zip', format: 'ESRI File Geodatabase (.gdb)', sizeBytes: '185 MB', sha256: 'a4f91c98e2170321f64923e41b9d107f9c81a243d9e03f218c5049381ea209bc', status: 'READY', description: 'Validated Vector Cadastral Parcels with Official ULPINs & Property Boundaries.' },
  { id: 'DEL-02', category: '2D Layers', fileName: '226821.tpk', format: 'ArcGIS Tile Package (.tpk)', sizeBytes: '1.2 GB', sha256: '9b7201fd340a182049e01349f821034ba98412c98031d274092b1a84f9103e21', status: 'READY', description: 'Orthorectified Drone Imagery (ORI) at 0.05m Ground Sample Distance.' },
  { id: 'DEL-03', category: 'Elevation', fileName: '226821_DSM.tif', format: 'GeoTIFF 32-bit Float', sizeBytes: '840 MB', sha256: '3819e049102ab39841029c81f0923e41b9d107f9c81a243d9e03f218c5049381', status: 'READY', description: 'Digital Surface Model (Ground + Buildings + Canopy Surface).' },
  { id: 'DEL-04', category: 'Elevation', fileName: '226821_DEM.tif', format: 'GeoTIFF 32-bit Float', sizeBytes: '420 MB', sha256: '721a982103e41b9d107f9c81a243d9e03f218c5049381ea209bc3819e049102a', status: 'READY', description: 'Digital Elevation Model / DTM (Bare-Earth Topographical Terrain).' },
  { id: 'DEL-05', category: '3D Reconstruction', fileName: '226821_LoD2_Buildings.gml', format: 'OGC CityGML 2.0 (LoD2)', sizeBytes: '680 MB', sha256: 'f821034ba98412c98031d274092b1a84f9103e21a4f91c98e2170321f64923e4', status: 'READY', description: '412 LoD2 3D Building Models with Floor & Unit volumetric spatial hierarchy.' },
  { id: 'DEL-06', category: '3D Reconstruction', fileName: '226821_Pointcloud_Classified.laz', format: 'ASPRS LAS 1.4 Compressed', sizeBytes: '14.2 GB', sha256: 'c81a243d9e03f218c5049381ea209bc9b7201fd340a182049e01349f821034ba', status: 'READY', description: 'Fused Multi-Sensor Georeferenced Point Cloud (142M Points).' },
  { id: 'DEL-07', category: 'GNSS Control', fileName: 'Indore_W54_CORS_GCP_Audit.pdf', format: 'Signed Survey PDF', sizeBytes: '12 MB', sha256: 'e03f218c5049381ea209bc3819e049102aa4f91c98e2170321f64923e41b9d10', status: 'READY', description: 'SoI CORS Network Synchronization Logs and GCP Adjustment Residuals.' },
  { id: 'DEL-08', category: 'Documentation', fileName: 'NAKSHA_V2_Delivery_Manifest.json', format: 'JSON Metadata Standard', sizeBytes: '45 KB', sha256: '98412c98031d274092b1a84f9103e21a4f91c98e2170321f64923e41b9d107f9', status: 'READY', description: 'Delivery Manifest with SHA-256 Checksums, Provenance, and Operator Sign-Off.' }
];

// ============================================================================
// AUDIT TRAIL LOGS
// ============================================================================

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '06-Sep-2026 11:20:15 AM',
    user: 'soi_operator_01',
    role: 'Surveyor / Operator',
    stage: 'Field Verification Incorporation',
    action: 'Incorporated Field Evidence for BLDG-IND-001',
    dataset: 'BLDG-IND-001 (ULPIN: 230410010020101)',
    previousValue: 'Status: Open / Unverified Penthouse',
    newValue: 'Status: Field Dispatched Evidence Verified (Rooftop Penthouse Confirmed)',
    reason: 'Field team inspector S. K. Chouhan submitted physical tape measurements and meter evidence.'
  },
  {
    id: 'AUD-002',
    timestamp: '06-Sep-2026 10:45:00 AM',
    user: 'soi_operator_01',
    role: 'Surveyor / Operator',
    stage: '3D QA/QC Inspection',
    action: 'Ran Automated 3D Quality Checklist',
    dataset: 'Indore Ward 54 Survey Unit 1 (226821)',
    previousValue: 'Status: Pending QC',
    newValue: 'Status: 13 / 13 Quality Rules Passed (PASS)',
    reason: 'Horizontal RMSE 0.009m, Vertical RMSE 0.014m, zero self-intersections.'
  },
  {
    id: 'AUD-003',
    timestamp: '06-Sep-2026 09:30:20 AM',
    user: 'soi_operator_01',
    role: 'Surveyor / Operator',
    stage: '3D Building Reconstruction',
    action: 'Floor Slicing Engine Executed',
    dataset: '412 Building Reconstructed Solids',
    previousValue: 'Raw nDSM Vector Polygons',
    newValue: 'LoD2 Multi-Floor Solids Extruded with Unit Volumes',
    reason: 'Multi-view stereo point cloud sliced at detected inter-floor slab elevations.'
  },
  {
    id: 'AUD-004',
    timestamp: '05-Sep-2026 04:15:33 PM',
    user: 'soi_operator_01',
    role: 'Surveyor / Operator',
    stage: 'Data Preparation & Ingestion',
    action: 'Validated Drone ORI Raster (.tpk)',
    dataset: '226821.tpk',
    previousValue: 'Status: Unchecked',
    newValue: 'Status: Validated (EPSG:32643, 0.05m GSD)',
    reason: 'Tile cache index and spatial projection confirmed valid.'
  },
  {
    id: 'AUD-005',
    timestamp: '05-Sep-2026 03:20:10 PM',
    user: 'soi_operator_01',
    role: 'Surveyor / Operator',
    stage: 'Data Preparation & Ingestion',
    action: 'Validated Vector Cadastral GDB (.zip)',
    dataset: '226821.zip',
    previousValue: 'Status: Unchecked',
    newValue: 'Status: Validated (WKID: 32643, 412 Parcels)',
    reason: 'Cadastral schema, ULPIN format, and Residency Ward codes verified.'
  }
];
