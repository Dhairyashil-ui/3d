// Data Extraction to 3D Reconstruction Data Architecture
// PPCRC Building Demonstration Dataset (Hinjawadi, Pune)

export interface AssignedSurveyUnit {
  unitName: string;
  village: string;
  ulb: string;
  district: string;
  state: string;
  surveyUnitId: string;
  propertyBuildingId: string;
  ulpin14: string;
  surveyDate: string;
  assignedTeam: string;
  crs: string;
  coordinates: {
    lat: number;
    lng: number;
    elevationMsl: number;
  };
  footprintAreaSqm: number;
  totalFloors: number;
  totalHeightM: number;
}

export const CURRENT_ASSIGNED_UNIT: AssignedSurveyUnit = {
  unitName: 'Hinjawadi IT Park Phase 1 - Survey Unit 04',
  village: 'Hinjawadi (Code: 0142)',
  ulb: 'PMRDA / PCMC (Code: 270410)',
  district: 'Pune (Code: 25)',
  state: 'Maharashtra (Code: 27)',
  surveyUnitId: 'SU-HINJ-270410-04',
  propertyBuildingId: '0089-01-01-119 / BLD-PPCRC-0089',
  ulpin14: '27250401420089',
  surveyDate: '12-Aug-2026',
  assignedTeam: 'SoI Aerial LiDAR & Drone Photogrammetry Wing - Team Alpha',
  crs: 'WGS 84 / UTM Zone 43N (EPSG:32643)',
  coordinates: {
    lat: 18.584072,
    lng: 73.737195,
    elevationMsl: 568.20
  },
  footprintAreaSqm: 540.8,
  totalFloors: 5,
  totalHeightM: 18.60
};

export interface SurveyFileRecord {
  id: string;
  category: 'LiDAR' | 'Drone Imagery' | 'GNSS / Trajectory' | 'Ground Control (GCP)' | 'Survey Metadata';
  fileName: string;
  fileFormat: string;
  fileSize: string;
  recordCount: string;
  crs: string;
  status: 'UPLOADED' | 'PROCESSING' | 'PENDING';
  validation: 'VALID' | 'WARNING' | 'ERROR';
  validationDetails: string;
  integrityChecksum: string;
}

export const INITIAL_SURVEY_FILES: SurveyFileRecord[] = [
  {
    id: 'FILE-LIDAR-01',
    category: 'LiDAR',
    fileName: 'PPCRC_Block04_Aerial_LiDAR.laz',
    fileFormat: 'ASPRS LAS/LAZ 1.4 (Point Format 6)',
    fileSize: '84.6 MB',
    recordCount: '14,820,940 Returns',
    crs: 'EPSG:32643 (UTM 43N)',
    status: 'UPLOADED',
    validation: 'VALID',
    validationDetails: 'Point records 100% intact; pulse rate 400kHz; multi-return calibrated.',
    integrityChecksum: 'SHA256: d41d8cd98f00b204e9800998ecf8427e'
  },
  {
    id: 'FILE-IMG-01',
    category: 'Drone Imagery',
    fileName: 'PPCRC_Nadir_Oblique_Photogrammetry.zip',
    fileFormat: 'JPG / TIFF (Sony α7R IV, 61.0 MP)',
    fileSize: '4.18 GB',
    recordCount: '482 Exposures',
    crs: 'EXIF GPS (WGS84) + RTK Synced',
    status: 'UPLOADED',
    validation: 'VALID',
    validationDetails: '80% forward / 75% side overlap verified; blur score < 0.05% (Laplacian pass).',
    integrityChecksum: 'SHA256: 7a3f8902c529e87bb90a12e365fa1098'
  },
  {
    id: 'FILE-GNSS-01',
    category: 'GNSS / Trajectory',
    fileName: 'NovAtel_SPAN_Drone_Trajectory.pos',
    fileFormat: 'NovAtel POS / NMEA ASCII (20Hz)',
    fileSize: '12.4 MB',
    recordCount: '86,400 Epochs',
    crs: 'ITRF2014 / WGS84 Datum',
    status: 'UPLOADED',
    validation: 'VALID',
    validationDetails: '100% RTK Fixed solution; baseline to CORS PMRDA-01: 2.4km; Pos RMS: 0.012m.',
    integrityChecksum: 'SHA256: 3c9b21f98d0e52aa405efc8911043811'
  },
  {
    id: 'FILE-GCP-01',
    category: 'Ground Control (GCP)',
    fileName: 'Hinjawadi_SU04_GCP_Network.csv',
    fileFormat: 'CSV (PointID, Lat, Lon, EllipsHeight, OrthoHeight)',
    fileSize: '48 KB',
    recordCount: '6 GCPs + 2 Checkpoints',
    crs: 'EPSG:32643 (Ortho Height MSL)',
    status: 'UPLOADED',
    validation: 'VALID',
    validationDetails: 'Dual-frequency Trimble R12 DGPS surveyed; Mean residual error: 0.008m.',
    integrityChecksum: 'SHA256: 9e107d9d372bb6826bd81d3542a419d6'
  },
  {
    id: 'FILE-META-01',
    category: 'Survey Metadata',
    fileName: 'PPCRC_Flight_BIM_Metadata.json',
    fileFormat: 'JSON (ISO 19115 / NAKSHA Schema)',
    fileSize: '1.2 MB',
    recordCount: '1 Complete Survey Manifest',
    crs: 'WGS 84 / UTM 43N',
    status: 'UPLOADED',
    validation: 'VALID',
    validationDetails: 'Sensor lever-arm extrinsics, camera distortion parameters, and ULPIN cross-validated.',
    integrityChecksum: 'SHA256: e2fc714c4727ee9395f324cd2e7f331f'
  }
];

export interface TeamComparisonField {
  id: string;
  fieldLabel: string;
  team1Value: string;
  team2Value: string;
  isMatch: boolean;
  category: 'Administrative' | 'Spatial' | 'Sensor Data' | 'Quality';
}

export const INITIAL_TEAM_COMPARISON: TeamComparisonField[] = [
  { id: 'f-01', fieldLabel: 'Property ID', team1Value: '0089-01-01-119', team2Value: '0089-01-01-119', isMatch: true, category: 'Administrative' },
  { id: 'f-02', fieldLabel: 'Survey Unit', team1Value: 'Hinjawadi IT Park Phase 1 - SU-04', team2Value: 'Hinjawadi IT Park Phase 1 - SU-04', isMatch: true, category: 'Administrative' },
  { id: 'f-03', fieldLabel: 'Village', team1Value: 'Hinjawadi (0142)', team2Value: 'Hinjawadi (0142)', isMatch: true, category: 'Administrative' },
  { id: 'f-04', fieldLabel: 'ULB', team1Value: 'PMRDA / PCMC (270410)', team2Value: 'PMRDA / PCMC (270410)', isMatch: true, category: 'Administrative' },
  { id: 'f-05', fieldLabel: 'Building ID', team1Value: 'BLD-PPCRC-0089', team2Value: 'BLD-PPCRC-0089', isMatch: true, category: 'Administrative' },
  { id: 'f-06', fieldLabel: 'Latitude', team1Value: '18.584072° N', team2Value: '18.584072° N', isMatch: true, category: 'Spatial' },
  { id: 'f-07', fieldLabel: 'Longitude', team1Value: '73.737195° E', team2Value: '73.737195° E', isMatch: true, category: 'Spatial' },
  { id: 'f-08', fieldLabel: 'Survey Date', team1Value: '12-Aug-2026', team2Value: '12-Aug-2026', isMatch: true, category: 'Administrative' },
  { id: 'f-09', fieldLabel: 'Survey Operator', team1Value: 'Er. R. Deshmukh (SoI-OP-04)', team2Value: 'Er. R. Deshmukh (SoI-OP-04)', isMatch: true, category: 'Administrative' },
  { id: 'f-10', fieldLabel: 'Number of LiDAR Files', team1Value: '4 Block Subsets (.LAZ 1.4)', team2Value: '4 Block Subsets (.LAZ 1.4)', isMatch: true, category: 'Sensor Data' },
  { id: 'f-11', fieldLabel: 'Number of Drone Images', team1Value: '482 High-Res Exposures', team2Value: '482 High-Res Exposures', isMatch: true, category: 'Sensor Data' },
  { id: 'f-12', fieldLabel: 'GNSS/RTK Availability', team1Value: 'RTK Fixed (Base CORS PMRDA-01)', team2Value: 'RTK Fixed (Base CORS PMRDA-01)', isMatch: true, category: 'Sensor Data' },
  { id: 'f-13', fieldLabel: 'GCP Availability', team1Value: '6 GCPs + 2 Checkpoints Verified', team2Value: '6 GCPs + 2 Checkpoints Verified', isMatch: true, category: 'Spatial' },
  { id: 'f-14', fieldLabel: 'File Counts', team1Value: '14 Raw Data Archives (Checksum Valid)', team2Value: '14 Raw Data Archives (Checksum Valid)', isMatch: true, category: 'Sensor Data' },
  { id: 'f-15', fieldLabel: 'Data Status', team1Value: 'Calibrated & Integrity Verified', team2Value: 'Calibrated & Integrity Verified', isMatch: true, category: 'Quality' }
];

export interface TechnicalPipelineStage {
  stageNumber: number;
  id: string;
  title: string;
  subtitle: string;
  formula?: string;
  scientificExplanation: string;
  keyConcepts: string[];
  hudMetrics: { label: string; value: string }[];
  visualMode: 
    | 'lidar_pulse'
    | 'drone_camera'
    | 'gnss_card'
    | 'gnss_imu_trajectory'
    | 'ground_range'
    | 'gcp_network'
    | 'lidar_scanning'
    | 'lidar_point_creation'
    | 'camera_overlap'
    | 'feature_matching'
    | 'sfm_poses'
    | 'triangulation'
    | 'mvs_dense_cloud'
    | 'registration_icp'
    | 'two_matching_types'
    | 'fusion_rgb'
    | 'cleaning_normals'
    | 'geometric_segmentation'
    | 'semantic_instance'
    | 'door_boundaries_decision'
    | 'bounding_box_measurements'
    | 'object_graph'
    | 'mesh_texturing'
    | 'qc_validation';
}

export const TECHNICAL_STAGES: TechnicalPipelineStage[] = [
  {
    stageNumber: 1,
    id: 'lidar_input',
    title: 'STAGE 1 — LIDAR INPUT',
    subtitle: 'RAW SENSOR DATA & TIME-OF-FLIGHT PULSES',
    formula: 'distance = c × Δt / 2  (c = 299,792,458 m/s)',
    scientificExplanation: 'LiDAR does NOT directly create a finished 3D model. The sensor emits short laser pulses. For every return, the system measures timestamp, measured range, laser beam direction, return number, and reflected intensity. Angular encoder values yield point coordinates in the local sensor frame.',
    keyConcepts: [
      'Laser pulse emitted toward surface',
      'Receiver detects reflected return pulse',
      'Time-of-flight Δt measured with picosecond resolution',
      'One measurement = 1 point in sensor coordinates [X: 12.42, Y: 3.18, Z: -1.52]',
      'Millions of returns synthesize an unstructured point cloud'
    ],
    hudMetrics: [
      { label: 'Pulse Frequency', value: '400 kHz' },
      { label: 'Beam Divergence', value: '0.25 mrad' },
      { label: 'Returns Recorded', value: '14,820,940' },
      { label: 'Speed of Light', value: '299,792,458 m/s' }
    ],
    visualMode: 'lidar_pulse'
  },
  {
    stageNumber: 2,
    id: 'drone_image_input',
    title: 'STAGE 2 — DRONE / CAMERA INPUT',
    subtitle: 'OVERLAPPING MULTI-SPECTRAL AERIAL EXPOSURES',
    formula: 'Overlap = (1 - Baseline / Footprint) × 100% ≥ 80%',
    scientificExplanation: 'The drone carries a synchronized multi-sensor payload: LiDAR, calibrated high-resolution camera (Sony α7R IV 61MP), GNSS/RTK antenna, and tactical-grade IMU. The camera shoots overlapping photographs along planned flight lines for downstream photogrammetric triangulation.',
    keyConcepts: [
      'Payload: LiDAR scanner + 61MP Camera + GNSS/RTK + IMU',
      'Forward overlap: 80% • Side overlap: 75%',
      'Exposures indexed sequentially (IMAGE 001 ... IMAGE 482)',
      'Sub-millisecond shutter synchronization with GNSS clock'
    ],
    hudMetrics: [
      { label: 'Captured Frames', value: '482 Photos' },
      { label: 'Sensor Resolution', value: '9504 × 6336 px (61 MP)' },
      { label: 'Focal Length', value: '35.12 mm' },
      { label: 'Ground Sample Dist', value: '1.8 cm/pixel' }
    ],
    visualMode: 'drone_camera'
  },
  {
    stageNumber: 3,
    id: 'gnss_data',
    title: 'STAGE 3 — GNSS DATA',
    subtitle: 'SENSOR TRAJECTORY DATUM (NOT PER-POINT COORDINATES)',
    formula: 'Pos_sensor(t) = [φ(t), λ(t), h(t)]_WGS84',
    scientificExplanation: 'GNSS does NOT measure the XYZ coordinate of every individual LiDAR point! Instead, dual-frequency GNSS/RTK determines the position of the drone and sensor over time. LiDAR points are subsequently transformed into world coordinates using GNSS positions, IMU attitudes, calibration matrices, and timestamp synchronization.',
    keyConcepts: [
      'Determines drone position over time [Lat, Lon, Altitude]',
      'Crucial distinction: GNSS measures drone pose, NOT individual target points',
      'Dual-frequency L1/L2 RTK correction from CORS station PMRDA-01',
      'Elevation referenced to WGS84 Ellipsoid and EGM2008 Geoid'
    ],
    hudMetrics: [
      { label: 'Latitude', value: '18.584072° N' },
      { label: 'Longitude', value: '73.737195° E' },
      { label: 'Ellipsoid Altitude', value: '568.20 m' },
      { label: 'RTK Solution Quality', value: 'Fixed (±0.012 m)' }
    ],
    visualMode: 'gnss_card'
  },
  {
    stageNumber: 4,
    id: 'gnss_imu_sync',
    title: 'STAGE 4 — GNSS + IMU + TIMESTAMP SYNCHRONIZATION',
    subtitle: 'INS TRAJECTORY POSE ESTIMATION [T1 → T5]',
    formula: 'Pose(t) = [Position_GNSS(t), Rotation_IMU(Roll, Pitch, Yaw)]',
    scientificExplanation: 'A Kalman filter merges 20Hz GNSS positions with 200Hz IMU angular rates and accelerations. This continuous trajectory records sensor position and attitude at every instant T1, T2, T3, T4, T5. Each LiDAR pulse timestamp queries this trajectory to retrieve the exact sensor pose in 3D space.',
    keyConcepts: [
      'Loosely/Tightly coupled GNSS/INS Kalman filtering',
      '200Hz IMU measures Roll, Pitch, and Heading (Yaw)',
      'Trajectory poses mapped continuously across T1 → T5',
      'Pulse timestamp matches exact sensor pose at emission moment'
    ],
    hudMetrics: [
      { label: 'IMU Sample Rate', value: '200 Hz' },
      { label: 'Roll / Pitch Accuracy', value: '0.005°' },
      { label: 'Heading (Yaw) Accuracy', value: '0.012°' },
      { label: 'Time Sync Jitter', value: '< 2 microseconds' }
    ],
    visualMode: 'gnss_imu_trajectory'
  },
  {
    stageNumber: 5,
    id: 'ground_measurement',
    title: 'STAGE 5 — GROUND MEASUREMENT ANIMATION',
    subtitle: 'LIDAR DRONE-TO-GROUND RANGE (NOT A GCP)',
    formula: 'Range_ground = Z_drone - Z_surface = 48.34 m',
    scientificExplanation: 'The LiDAR emits a direct vertical laser ray measuring distance from the airborne sensor to the ground surface. IMPORTANT: A LiDAR range measurement is NOT automatically a Ground Control Point (GCP). It is merely an optical distance measurement subject to sensor pose uncertainty.',
    keyConcepts: [
      'Vertical distance measured from drone to ground terrain',
      'Validates flight altitude and terrain clearance',
      'Technical rule: Drone-to-ground LiDAR distance ≠ GCP',
      'First-return and last-return ground detection'
    ],
    hudMetrics: [
      { label: 'Distance to Ground', value: '48.34 m' },
      { label: 'Surface Class', value: 'PPCRC Forecourt Pavement' },
      { label: 'Pulse Return Type', value: 'Return 1 of 1 (Single)' },
      { label: 'GCP Equivalence', value: 'FALSE (Raw Range Only)' }
    ],
    visualMode: 'ground_range'
  },
  {
    stageNumber: 6,
    id: 'gcp_stage',
    title: 'STAGE 6 — GROUND CONTROL POINTS (GCP)',
    subtitle: 'INDEPENDENT HIGH-ACCURACY SURVEYED BENCHMARKS',
    formula: 'Residual = ||XYZ_surveyed - XYZ_reconstructed|| ≤ 0.015 m',
    scientificExplanation: 'A Ground Control Point (GCP) is a physically identifiable marker on the ground whose coordinates have been independently surveyed with millimeter-level geodetic DGPS instruments. GCPs are known spatial references used to georeference the project, remove drift, and check final accuracy.',
    keyConcepts: [
      'Physical painted checkered targets or permanent monuments',
      'Surveyed with static dual-frequency geodetic GNSS',
      'Used for absolute georeferencing and bundle adjustment',
      'GCPs are NOT normal LiDAR points — they are absolute ground truth'
    ],
    hudMetrics: [
      { label: 'Active GCPs', value: '6 Control + 2 Check' },
      { label: 'GCP-01 Coordinates', value: 'X: 367412.82, Y: 2055184.14' },
      { label: 'Elevation MSL', value: '568.24 m' },
      { label: 'Mean Horizontal RMS', value: '0.007 m (7 mm)' }
    ],
    visualMode: 'gcp_network'
  },
  {
    stageNumber: 7,
    id: 'lidar_scanning',
    title: 'STAGE 7 — ACTIVE LIDAR SCANNING',
    subtitle: 'HIGH-FREQUENCY LASER SWEEPS ACROSS THE PPCRC BUILDING',
    formula: 'Returns: Surface_hit → Receiver → Peak_Detector → XYZ',
    scientificExplanation: 'The scanner mirror rotates at high speed, sweeping laser rays across the entire scene. The beams strike the PPCRC building: roof slabs, concrete columns, glass facades, brick walls, entrance doors, window mullions, paved forecourts, and surrounding trees. Every return generates a raw measurement.',
    keyConcepts: [
      'Scanning mirror sweeps 360° across target azimuths',
      'Laser strikes building walls, parapets, doors, windows, and trees',
      'Laser → Surface Return → Optical Receiver → Point Sample',
      'Repeated hundreds of thousands of times per flight pass'
    ],
    hudMetrics: [
      { label: 'Scan Rate', value: '250 lines/second' },
      { label: 'Angular Resolution', value: '0.018°' },
      { label: 'Building Coverage', value: '360° All Facades' },
      { label: 'Raw Points Sampled', value: '14,820,940' }
    ],
    visualMode: 'lidar_scanning'
  },
  {
    stageNumber: 8,
    id: 'lidar_point_creation',
    title: 'STAGE 8 — LIDAR POINT CREATION PIPELINE',
    subtitle: 'TRANSFORMATION: SENSOR FRAME → GNSS/INS → WORLD XYZ',
    formula: 'P_world = R_ins(t) × (R_calib × P_sensor + T_calib) + P_gnss(t)',
    scientificExplanation: 'The conversion pipeline: [Range + Beam Angle + Timestamp] calculates raw LiDAR coordinates in the scanner frame. The sensor pose at that timestamp is queried from the GNSS/INS trajectory. Coordinate transformation rotates and translates each return into georeferenced World XYZ.',
    keyConcepts: [
      '[Range, Angle, Time] → Sensor XYZ coordinate',
      'Extrinsic calibration relates sensor center to IMU center',
      'INS rotation matrix R(t) + GNSS translation T(t) applied',
      'Output: Authoritative Georeferenced LiDAR Point Cloud'
    ],
    hudMetrics: [
      { label: 'Point 001 XYZ', value: '[18.584072, 73.737195, 568.20]' },
      { label: 'Coordinate System', value: 'WGS 84 / UTM 43N' },
      { label: 'Transformation Error', value: '< 0.005 m' },
      { label: 'Geotagging Status', value: '100% Georeferenced' }
    ],
    visualMode: 'lidar_point_creation'
  },
  {
    stageNumber: 9,
    id: 'camera_photogrammetry',
    title: 'STAGE 9 — CAMERA PHOTOGRAMMETRY',
    subtitle: 'OVERLAPPING AERIAL EXPOSURES SURROUNDING BUILDING',
    formula: 'FOV = 2 × arctan(SensorSize / (2 × f)) = 63.4°',
    scientificExplanation: 'Now emphasis switches to drone imagery. 482 high-resolution photos surround the PPCRC building with rich visual overlap. The photogrammetric pipeline detects distinctive visual features across multiple photos: window lintels, door frame joints, brick masonry, and roof cornices.',
    keyConcepts: [
      'Overlapping multi-view photographs surrounding building',
      'Identical physical features observed in 5 to 15 different photos',
      'Visual features: window corners, door hinges, roof parapets',
      'Sub-pixel feature detection using GPU-accelerated algorithms'
    ],
    hudMetrics: [
      { label: 'Photos Loaded', value: '482 Images' },
      { label: 'Detected Keypoints', value: '38,400 / image' },
      { label: 'Mean Visibility', value: '8.4 photos / feature' },
      { label: 'Color Space', value: '24-bit sRGB' }
    ],
    visualMode: 'camera_overlap'
  },
  {
    stageNumber: 10,
    id: 'feature_matching',
    title: 'STAGE 10 — FEATURE MATCHING',
    subtitle: 'SIFT KEYPOINT EXTRACTION & HOMOLOGY TIE LINES',
    formula: 'Distance(D_a, D_b) = ||Descriptor_A - Descriptor_B||_2',
    scientificExplanation: 'The computer vision engine computes 128-dimensional invariant descriptors for every keypoint. It searches corresponding photos and connects matching points with tie lines. Nearest-neighbor ratio tests and epipolar geometry constraints filter out ambiguous matches.',
    keyConcepts: [
      'Scale-Invariant Feature Transform (SIFT) descriptors',
      'Match lines connect identical features across stereo pairs',
      'RANSAC fundamental matrix estimation eliminates outliers',
      'Epipolar consistency ensures strict geometric validity'
    ],
    hudMetrics: [
      { label: 'Validated Tie Points', value: '4,840,200 Pairs' },
      { label: 'RANSAC Outlier Rejection', value: '14.2% pruned' },
      { label: 'Matching Confidence', value: '99.2%' },
      { label: 'GPU Processing Time', value: '18.4 seconds' }
    ],
    visualMode: 'feature_matching'
  },
  {
    stageNumber: 11,
    id: 'structure_from_motion',
    title: 'STAGE 11 — STRUCTURE FROM MOTION (SfM)',
    subtitle: 'CAMERA POSITION ESTIMATION & SPARSE 3D RECONSTRUCTION',
    formula: 'min_{R,t,X} Σ ||x_ij - P(R_i, t_i, X_j)||^2',
    scientificExplanation: 'Structure from Motion (SfM) iteratively estimates camera positions, orientations, and the sparse 3D geometry of the scene. Bundle adjustment optimizes all camera poses and 3D tie points simultaneously by minimizing total reprojection error.',
    keyConcepts: [
      'Estimates exterior orientation [X, Y, Z, Yaw, Pitch, Roll]',
      'Non-linear Levenberg-Marquardt bundle adjustment',
      'Produces sparse 3D point cloud of primary building features',
      'Aligns camera positions along flight trajectory'
    ],
    hudMetrics: [
      { label: 'Optimized Cameras', value: '482 / 482 Solved' },
      { label: 'Mean Reprojection Error', value: '0.41 pixels' },
      { label: 'Sparse Cloud Size', value: '1,240,800 Points' },
      { label: 'Scale Factor', value: 'Constrained by GNSS/GCP' }
    ],
    visualMode: 'sfm_poses'
  },
  {
    stageNumber: 12,
    id: 'triangulation',
    title: 'STAGE 12 — TRIANGULATION',
    subtitle: 'INTERSECTION OF OPTICAL RAYS IN 3D SPACE',
    formula: 'Ray_A(s) ∩ Ray_B(t) → 3D Point X_world',
    scientificExplanation: 'When Camera A and Camera B both observe the same physical feature, their calibrated optical viewing rays project into 3D space. The intersection of these rays determines the exact 3D spatial coordinate. Repeating this for millions of rays reconstructs the building geometry.',
    keyConcepts: [
      'Two or more cameras view the same landmark',
      'Optical lines of sight intersect in world space',
      'Intersection produces true 3D spatial coordinate',
      'Higher base-to-height ratio improves triangulation depth precision'
    ],
    hudMetrics: [
      { label: 'Stereo Rays Intersected', value: '14,200,000' },
      { label: 'Mean Intersection Angle', value: '38.4°' },
      { label: 'Triangulation Precision', value: '± 0.014 m' },
      { label: 'Geometry Reconstructed', value: 'PPCRC Building Shell' }
    ],
    visualMode: 'triangulation'
  },
  {
    stageNumber: 13,
    id: 'multi_view_stereo',
    title: 'STAGE 13 — MULTI-VIEW STEREO (MVS)',
    subtitle: 'DENSE PHOTOGRAMMETRIC SURFACE RECONSTRUCTION',
    formula: 'Cost(p, d) = Census_Transform(I_ref(p), I_src(p + d))',
    scientificExplanation: 'Multi-View Stereo (MVS) densifies the sparse model by calculating depth maps for every pixel across all overlapping image pairs. The result is a dense photogrammetry point cloud containing tens of millions of colored points representing the building surfaces.',
    keyConcepts: [
      'Semi-Global Matching (SGM) depth map estimation',
      'Densifies every building pixel into a 3D coordinate',
      'Dense photogrammetric point cloud synthesized',
      'Now two distinct clouds exist: LiDAR and Photogrammetry'
    ],
    hudMetrics: [
      { label: 'Photogrammetry Cloud', value: '18,650,400 Points' },
      { label: 'Point Density', value: '185 pts/m²' },
      { label: 'Color Depth', value: 'RGB (True Color)' },
      { label: 'Coverage', value: 'Facade, Roof, Balconies' }
    ],
    visualMode: 'mvs_dense_cloud'
  },
  {
    stageNumber: 14,
    id: 'registration_icp',
    title: 'STAGE 14 — COORDINATE REGISTRATION & SENSOR EXTRINSICS',
    subtitle: 'ITERATIVE CLOSEST POINT (ICP) GEOMETRIC ALIGNMENT',
    formula: 'min_{R, T} Σ ||p_lidar - (R × p_photo + T)||^2',
    scientificExplanation: 'The two clouds must NOT simply be combined blindly! Photogrammetry initially operates in an arbitrary camera frame X\',Y\',Z\', while LiDAR is in sensor/world X,Y,Z. The system applies lever-arm extrinsic calibration, georeferences with GCPs, and executes ICP refinement to pull both clouds into exact alignment.',
    keyConcepts: [
      'LiDAR frame [X,Y,Z] vs Photogrammetry frame [X\',Y\',Z\']',
      'Extrinsic calibration relates camera optical center to LiDAR origin',
      'Initial coarse alignment via GNSS + GCP constraints',
      'Fine registration via Iterative Closest Point (ICP) algorithm'
    ],
    hudMetrics: [
      { label: 'Initial Translation Offset', value: 'ΔX: 0.14m, ΔY: 0.08m, ΔZ: 0.12m' },
      { label: 'ICP Iterations', value: '24 Iterations Converged' },
      { label: 'Final Registration Residual', value: '0.007 m (7 mm)' },
      { label: 'Alignment Quality', value: 'SURVEY GRADE (PASS)' }
    ],
    visualMode: 'registration_icp'
  },
  {
    stageNumber: 15,
    id: 'two_matching_types',
    title: 'STAGE 15 — TWO DIFFERENT TYPES OF MATCHING',
    subtitle: 'DISTINCTION: POINT→PIXEL PROJECTION VS CLOUD→CLOUD REGISTRATION',
    formula: 'Type A: [u,v]^T = K × [R|T] × [X,Y,Z]^T  |  Type B: 3D_ICP(Cloud_1, Cloud_2)',
    scientificExplanation: 'Crucial technical distinction: Process A (LiDAR Point → Camera Pixel) projects a 3D LiDAR point onto a calibrated 2D image plane to sample its RGB color. Process B (LiDAR Cloud ↔ Photogrammetry Cloud) performs 3D-to-3D geometric surface registration. These are fundamentally different mathematical operations.',
    keyConcepts: [
      'Type A (3D → 2D): Collinear projection of LiDAR point onto image pixel for RGB',
      'Type B (3D → 3D): Rigid spatial transformation between two independent surface clouds',
      'Type A samples radiometric color; Type B aligns coordinate datums',
      'System executes both systematically without conflating them'
    ],
    hudMetrics: [
      { label: 'Type A (Point → Pixel)', value: 'Projection Matrix Solved' },
      { label: 'Type B (Cloud ↔ Cloud)', value: 'Spatial ICP Aligned' },
      { label: 'Radiometric Calibration', value: 'Vignetting & Exposure Normalized' },
      { label: 'Spatial Rigidity', value: 'Scale Factor = 1.00000' }
    ],
    visualMode: 'two_matching_types'
  },
  {
    stageNumber: 16,
    id: 'sensor_fusion',
    title: 'STAGE 16 — SENSOR FUSION',
    subtitle: 'COMBINED GEOMETRY + RADIOMETRIC RGB 3D DATASET',
    formula: 'Point_Fused = [X, Y, Z]_LiDAR ⊕ [R, G, B]_Camera ⊕ [Intensity, Return]',
    scientificExplanation: 'With spatial registration perfected, multi-sensor fusion combines LiDAR geometric precision with camera color information. Every point now carries full 3D coordinates, laser reflection intensity, and high-fidelity RGB texture values.',
    keyConcepts: [
      'LiDAR provides razor-sharp structural geometry and penetration',
      'Camera provides rich photometric surface color and texture',
      'Synthesizes a georeferenced, photorealistic 3D point cloud',
      'Point attribute schema: X, Y, Z, R, G, B, Intensity, Timestamp'
    ],
    hudMetrics: [
      { label: 'Fused Points', value: '18,420,940' },
      { label: 'Geometry Source', value: 'LiDAR Returns (±0.005m)' },
      { label: 'Color Source', value: '61MP Drone Imagery' },
      { label: 'Dynamic Range', value: '14-bit Radiometric' }
    ],
    visualMode: 'fusion_rgb'
  },
  {
    stageNumber: 17,
    id: 'point_cloud_cleaning',
    title: 'STAGE 17 — POINT CLOUD CLEANING & NORMAL ESTIMATION',
    subtitle: 'STATISTICAL OUTLIER FILTERING & LOCAL SURFACE ORIENTATIONS',
    formula: 'Normal n = Eigenvector(min(λ)) of Covariance Matrix C',
    scientificExplanation: 'Statistical Outlier Removal (SOR) filters airborne dust, birds, and multipath noise without destroying thin architectural structures (railings, flagpoles, cables). Covariance analysis of local neighborhoods estimates surface normal vectors: flat vertical walls show uniform normals, while doors and window recesses show distinct directional changes.',
    keyConcepts: [
      'Statistical Outlier Removal (k=20 neighbors, σ=1.5)',
      'Preserves delicate structures: light poles, conduits, window bars',
      'Normal estimation calculates orientation vectors for each surface patch',
      'Walls: [0, -1, 0] • Ground: [0, 0, 1] • Door recesses: normal step'
    ],
    hudMetrics: [
      { label: 'Noise Points Pruned', value: '42,180 (0.23%)' },
      { label: 'Cleaned Cloud Size', value: '18,378,760 Points' },
      { label: 'Normals Estimated', value: '100% Surface Coverage' },
      { label: 'Planar Uniformity', value: '0.982' }
    ],
    visualMode: 'cleaning_normals'
  },
  {
    stageNumber: 18,
    id: 'geometric_segmentation',
    title: 'STAGE 18 — INITIAL GEOMETRIC SEGMENTATION',
    subtitle: 'RANSAC PLANE FITTING & EUCLIDEAN REGION GROWING',
    formula: 'RANSAC Plane: a·X + b·Y + c·Z + d = 0, |d| ≤ 0.03 m',
    scientificExplanation: 'Geometric segmentation analyzes spatial neighborhoods using RANSAC plane fitting, normal variance, and Euclidean clustering. It separates horizontal floor slabs, vertical facade planes, roof terraces, and ground pavements. NOTE: Point density alone does NOT determine object class; multi-feature criteria are required.',
    keyConcepts: [
      'RANSAC extracts primary structural planes (walls, roof, floor)',
      'Region growing groups contiguous surface patches',
      'Euclidean cluster extraction identifies detached physical elements',
      'Density is only one feature among normals, curvature, and bounding shape'
    ],
    hudMetrics: [
      { label: 'Extracted Major Planes', value: '18 Structural Facets' },
      { label: 'Plane Fitting Residual', value: '0.014 m' },
      { label: 'Cluster Segments', value: '142 Candidate Objects' },
      { label: 'Floor Slices Detected', value: '5 Floor Levels' }
    ],
    visualMode: 'geometric_segmentation'
  },
  {
    stageNumber: 19,
    id: 'semantic_instance_seg',
    title: 'STAGE 19 — AI SEMANTIC VS INSTANCE SEGMENTATION',
    subtitle: 'CLASS LABELS (SEMANTIC) VS UNIQUE IDENTITY (INSTANCE)',
    formula: 'P_i → {Semantic: "DOOR", Instance: 127, Confidence: 0.97}',
    scientificExplanation: 'Crucial distinction: Semantic segmentation answers "What class does this point belong to?" (WALL, ROOF, DOOR, WINDOW, AC, GROUND). Instance segmentation answers "Which individual object does this point belong to?". For example, Door #127 and Door #128 share the class DOOR, but are distinct spatial instances.',
    keyConcepts: [
      'Semantic Segmentation: Categorizes points into object classes',
      'Instance Segmentation: Separates discrete individual objects',
      'Door #127 and Door #128 are distinct instances of class DOOR',
      'Enables individual BIM cadastre modeling and property tax indexing'
    ],
    hudMetrics: [
      { label: 'Classes Identified', value: 'WALL, ROOF, DOOR, WINDOW, AC, FLOOR' },
      { label: 'Instances Segmented', value: '184 Discrete Objects' },
      { label: 'Mean Classification F1', value: '96.8%' },
      { label: 'Instance Disambiguation', value: '100% Partitioned' }
    ],
    visualMode: 'semantic_instance'
  },
  {
    stageNumber: 20,
    id: 'door_decision_pipeline',
    title: 'STAGE 20 — OBJECT BOUNDARY & DECISION PIPELINE',
    subtitle: 'HOW THE SYSTEM IDENTIFIES AND DELIMITS "DOOR #127"',
    formula: 'Score_door = w1·Planar + w2·Rect + w3·Dims + w4·Recess + w5·Image = 0.97',
    scientificExplanation: 'The system does NOT define an object by arbitrary file row indices! Points receive individual tags (e.g. Points 15201–18400 tagged DOOR #127). The system combines multi-signal evidence: is it planar? rectangular? vertical? are dimensions within door standards? is it recessed into a wall opening? does image texture match timber/glazing? Result: Confidence 97%.',
    keyConcepts: [
      'Points tagged by label, NOT arbitrary file indices',
      'Multi-signal decision: Planar + Rectangular + Vertical orientation',
      'Standard architectural dimensions: ~0.9m - 1.8m width, 2.05m - 2.44m height',
      'Recessed opening detected inside surrounding wall boundary',
      'Object #127 | Class: DOOR | Confidence: 97%'
    ],
    hudMetrics: [
      { label: 'Object ID', value: 'DOOR #127 (Entrance Lab Door)' },
      { label: 'Points in Instance', value: '4,827 LiDAR Returns' },
      { label: 'Decision Signals', value: '7 Conforming Architectural Tests' },
      { label: 'AI Classification Score', value: '97.4% Match' }
    ],
    visualMode: 'door_boundaries_decision'
  },
  {
    stageNumber: 21,
    id: 'bounding_box_measurements',
    title: 'STAGE 21 — 3D BOUNDING BOX & PRECISE MEASUREMENTS',
    subtitle: 'ORIENTED BOUNDING BOX (OBB) & METRIC ATTRIBUTES',
    formula: 'Width = 0.92 m (leaf) / 1.80 m (frame) | Height = 2.05 m | Depth = 0.14 m',
    scientificExplanation: 'From the points belonging to Door #127, the engine computes an Oriented Bounding Box (OBB). Axis orientation aligns with the wall surface rather than arbitrary world axes. Real metric measurements (width, height, depth, area, volume, centroid) are extracted directly from registered geometry.',
    keyConcepts: [
      'Min/Max XYZ calculated along object primary eigenvector axes',
      'Calculates exact metric dimensions: Width 0.92m, Height 2.05m, Depth 0.14m',
      'Surface area = 1.886 m² • Extracted from true geometry, not hardcoded',
      'Spatial centroid and elevation above MSL indexed'
    ],
    hudMetrics: [
      { label: 'Width (Transverse)', value: '0.92 m (Single Leaf) / 1.80 m (Frame)' },
      { label: 'Height (Vertical)', value: '2.05 m (Clear) / 2.44 m (Lintel)' },
      { label: 'Depth (Jamb Wall)', value: '0.14 m Recess' },
      { label: 'Centroid World MSL', value: 'X: 18.58407, Y: 73.73719, Z: 569.42m' }
    ],
    visualMode: 'bounding_box_measurements'
  },
  {
    stageNumber: 22,
    id: 'object_graph',
    title: 'STAGE 22 — WALL RELATIONSHIP & BUILDING OBJECT GRAPH',
    subtitle: 'HIERARCHICAL BIM TOPOLOGY (BUILDING → WALL → DOOR/WINDOW/AC)',
    formula: 'Graph = {Building_001: [Wall_001: [Door_127, Window_128, AC_129], Roof_001]}',
    scientificExplanation: 'Isolated points become structured architectural BIM intelligence. Objects are organized into a relational graph: Door #127 penetrates Wall #001; Window #128 penetrates Wall #001; AC Unit #129 is mounted on Wall #001. This semantic topology enables automated compliance checking and unit-level cadastre management.',
    keyConcepts: [
      'Door #127 is child of / belongs to WALL #001',
      'Window #128 belongs to WALL #001',
      'AC Unit #129 is mounted externally on WALL #001',
      'Structured graph is vastly superior to raw unstructured point clouds'
    ],
    hudMetrics: [
      { label: 'Root Node', value: 'BUILDING #001 (PPCRC Hinjawadi)' },
      { label: 'Parent Wall', value: 'WALL #001 (West Academic Elevation)' },
      { label: 'Child Elements', value: 'Door #127, Window #128, AC #129' },
      { label: 'Graph Validation', value: '100% Topologically Closed' }
    ],
    visualMode: 'object_graph'
  },
  {
    stageNumber: 23,
    id: 'mesh_generation',
    title: 'STAGE 23 — 3D SURFACE RECONSTRUCTION & TEXTURING',
    subtitle: 'POISSON SURFACE RECONSTRUCTION & UV TEXTURE MAPPING',
    formula: 'Mesh: ∇ · ∇χ = ∇ · V  (Screened Poisson Reconstruction)',
    scientificExplanation: 'The clean, segmented point cloud is converted into continuous polygonal surface meshes via Screened Poisson Surface Reconstruction. UV coordinates are projected from calibrated drone images, generating textured LoD2/LoD3 3D models preserving exact real-world dimensions and visual appearance.',
    keyConcepts: [
      'Screened Poisson mesh generation from point normals',
      'Water-tight solid geometry for walls, floors, and roofs',
      'High-resolution photographic texture mapped to polygon UVs',
      'Preserves object identities, measurements, and world coordinates'
    ],
    hudMetrics: [
      { label: 'Triangle Faces', value: '184,200 Polygons' },
      { label: 'Texture Atlases', value: '4 × 4K Textures' },
      { label: 'Geometric Fidelity', value: 'LoD3 Architectural Grade' },
      { label: 'File Output', value: 'glTF / CityGML / OBJ' }
    ],
    visualMode: 'mesh_texturing'
  },
  {
    stageNumber: 24,
    id: 'survey_quality_report',
    title: 'STAGE 24 — QUALITY CONTROL & FINAL SURVEY REPORT',
    subtitle: 'COMPREHENSIVE COMPLIANCE AUDIT & TOLERANCE VERIFICATION',
    formula: 'QC_Index = 0.3·Acc + 0.25·Reg + 0.25·Seg + 0.2·GCP = 98.4% (PASS)',
    scientificExplanation: 'The reconstruction pipeline terminates with an automated Survey Quality Control audit. It verifies point density, boundary coverage, ICP registration error, GCP ground residuals, segmentation confidence, and metric measurement tolerances before releasing the deliverable to the Surveyor portal.',
    keyConcepts: [
      'Rigorous automated survey compliance verification',
      'Registration error: 7mm • Density: 142 pts/m² • Coverage: 99.8%',
      'All 14 processing checklist milestones verified',
      'Deliverable certified: PASS — Ready for Interactive Inspection'
    ],
    hudMetrics: [
      { label: 'Total Points Processed', value: '18,420,940' },
      { label: 'Mean Registration Error', value: '0.007 m (7 mm)' },
      { label: 'GCP Mean Residual', value: '0.006 m' },
      { label: 'Reconstruction Status', value: 'CERTIFIED PASS' }
    ],
    visualMode: 'qc_validation'
  }
];

export interface InspectableObject {
  id: string;
  name: string;
  semanticClass: 'DOOR' | 'WINDOW' | 'AC' | 'WALL' | 'ROOF' | 'ROOM';
  instanceNumber: number;
  widthM: number;
  heightM: number;
  depthM: number;
  areaSqm: number;
  volumeM3: number;
  confidencePct: number;
  sourceAttribution: string;
  worldCoordinates: {
    lat: number;
    lng: number;
    elevationMsl: number;
  };
  localBounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
  pointCount: number;
  parentRelationship: string;
  cadastreCode: string;
  verificationNotes: string;
}

export const INSPECTABLE_OBJECTS: InspectableObject[] = [
  {
    id: 'DOOR-127',
    name: 'DOOR #127 (Academic Entrance Double Beech Leaf)',
    semanticClass: 'DOOR',
    instanceNumber: 127,
    widthM: 0.92, // Single active leaf (double frame 1.80m)
    heightM: 2.05,
    depthM: 0.14,
    areaSqm: 1.886,
    volumeM3: 0.264,
    confidencePct: 97.4,
    sourceAttribution: 'Aerial LiDAR + Oblique Drone Imagery (Exposures 084-089)',
    worldCoordinates: {
      lat: 18.584072,
      lng: 73.737195,
      elevationMsl: 569.42
    },
    localBounds: {
      minX: 11.01,
      maxX: 11.93,
      minY: 0.20,
      maxY: 2.25,
      minZ: -7.47,
      maxZ: -7.33
    },
    pointCount: 4827,
    parentRelationship: 'Belongs to / Penetrates WALL #001 (West Academic Elevation)',
    cadastreCode: '0089-01-01-119-D127',
    verificationNotes: 'Planar rectangular vertical opening; recessed 0.14m in 220mm masonry jamb; standard door clearance verified.'
  },
  {
    id: 'WINDOW-128',
    name: 'WINDOW #128 (West Atrium Structural Glazing)',
    semanticClass: 'WINDOW',
    instanceNumber: 128,
    widthM: 2.40,
    heightM: 1.80,
    depthM: 0.08,
    areaSqm: 4.32,
    volumeM3: 0.345,
    confidencePct: 98.2,
    sourceAttribution: 'LiDAR Reflected Returns + Drone Photogrammetry',
    worldCoordinates: {
      lat: 18.584090,
      lng: 73.737210,
      elevationMsl: 571.20
    },
    localBounds: {
      minX: 10.27,
      maxX: 12.67,
      minY: 1.00,
      maxY: 2.80,
      minZ: -12.64,
      maxZ: -12.56
    },
    pointCount: 6240,
    parentRelationship: 'Belongs to WALL #001 (West Academic Elevation)',
    cadastreCode: '0089-01-01-W128',
    verificationNotes: 'Low LiDAR reflectance intensity characteristic of architectural glass; clear aluminum mullion boundaries.'
  },
  {
    id: 'AC-129',
    name: 'AC UNIT #129 (Server Rack HVAC Condenser)',
    semanticClass: 'AC',
    instanceNumber: 129,
    widthM: 0.95,
    heightM: 0.72,
    depthM: 0.38,
    areaSqm: 0.684,
    volumeM3: 0.260,
    confidencePct: 95.8,
    sourceAttribution: 'Oblique Drone Imagery (Exposures 112-116) + LiDAR Cluster',
    worldCoordinates: {
      lat: 18.584065,
      lng: 73.737180,
      elevationMsl: 573.40
    },
    localBounds: {
      minX: 11.47,
      maxX: 12.42,
      minY: 4.50,
      maxY: 5.22,
      minZ: -17.99,
      maxZ: -17.61
    },
    pointCount: 2180,
    parentRelationship: 'Mounted externally on WALL #001',
    cadastreCode: '0089-02-01-AC129',
    verificationNotes: 'Cantilevered metallic bracket detection; planar rectangular casing projecting 0.38m from facade.'
  },
  {
    id: 'WALL-001',
    name: 'WALL #001 (West Academic Wing Main Elevation)',
    semanticClass: 'WALL',
    instanceNumber: 1,
    widthM: 28.50,
    heightM: 18.60,
    depthM: 0.25,
    areaSqm: 530.10,
    volumeM3: 132.52,
    confidencePct: 99.4,
    sourceAttribution: 'Aerial LiDAR LAS 1.4 (ASPRS Class 6) + Fused Drone Mesh',
    worldCoordinates: {
      lat: 18.584072,
      lng: 73.737195,
      elevationMsl: 568.20
    },
    localBounds: {
      minX: 11.47,
      maxX: 11.72,
      minY: 0.00,
      maxY: 18.60,
      minZ: -27.00,
      maxZ: 1.50
    },
    pointCount: 842000,
    parentRelationship: 'Primary structural envelope of BUILDING #001',
    cadastreCode: '0089-STR-W001',
    verificationNotes: 'Vertical RCC moment frame with brick infill; host boundary for Door #127, Window #128, AC #129.'
  },
  {
    id: 'ROOF-001',
    name: 'ROOF #001 (Parapet & Flat Slab Terrace)',
    semanticClass: 'ROOF',
    instanceNumber: 1,
    widthM: 34.00,
    heightM: 1.20,
    depthM: 28.00,
    areaSqm: 952.00,
    volumeM3: 1142.40,
    confidencePct: 99.1,
    sourceAttribution: 'Aerial LiDAR First Returns + Nadir Drone Orthophoto',
    worldCoordinates: {
      lat: 18.584072,
      lng: 73.737195,
      elevationMsl: 586.80
    },
    localBounds: {
      minX: -17.00,
      maxX: 17.00,
      minY: 18.60,
      maxY: 19.80,
      minZ: -27.00,
      maxZ: 1.00
    },
    pointCount: 1420000,
    parentRelationship: 'Roof capping of BUILDING #001',
    cadastreCode: '0089-RF-001',
    verificationNotes: 'Flat RCC slab with 1.2m perimeter parapet; includes solar panel mounting arrays and lift machine room.'
  }
];
