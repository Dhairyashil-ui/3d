// NAKSHA V2.0 — Authoritative Cadastral Plot, Building & ULPIN Assignment Register
// Planning Jurisdiction: PMRDA Pune (270410) • Hinjawadi Revenue Village (411057)
// Assigned Survey Unit: Survey Unit 01 (348671) — Rajiv Gandhi Infotech Park & I²IT Campus Zone
// Elevation Datum: MSL (Mean Sea Level) • Spatial Datum: WGS84 UTM Zone 43N

export interface PlotBuildingUlpinRecord {
  id: string;
  plotNo: string;
  khasraNo: string;
  parcelId: string;
  buildingId: string;
  buildingName: string;
  buildingCategory: 'Educational' | 'Commercial IT Park' | 'Residential' | 'Utility & Infrastructure';
  totalFloors: number;
  heightM: number;
  elevationMsl: number; // Height above Mean Sea Level in meters
  latitude: number;
  longitude: number;
  ulpin: string;
  ulpinType: 'PERMANENT' | 'TEMPORARY';
  ulpinStatusText: string;
  mappingStatus: 'Completed' | 'Mapping In Progress' | 'Pending Field Survey' | 'Ground Truthing Required';
  assignedSurveyor: string;
  surveyDate: string;
}

export interface AvailableUnmappedPlot {
  plotNo: string;
  parcelId: string;
  khasraNo: string;
  defaultLat: number;
  defaultLng: number;
  defaultElevationMsl: number;
  mappingStatus: 'Mapping In Progress' | 'Pending GT Survey' | 'Unmapped - DGPS Required' | 'Pending Field Demarcation';
  pendingTaskCategory: 'MERGE_SPLIT' | 'DGPS_HEIGHT' | 'MAP_IMAGE_VERIFICATION' | 'ROR_ENTRY' | 'PLOT_VERIFICATION';
  pendingTaskTitle: string;
  pendingTaskDescription: string;
  targetRoute: string;
  actionButtonText: string;
  badgeColor: string;
}

export const STORAGE_KEY_COMPLETED_PLOTS = 'naksha_completed_mapping_plots';

export function getCompletedMappingPlots(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_PLOTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function markPlotMappingCompleted(plotNo: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCompletedMappingPlots();
    if (!current.includes(plotNo)) {
      current.push(plotNo);
      localStorage.setItem(STORAGE_KEY_COMPLETED_PLOTS, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Error saving completed plot:', e);
  }
}

export function isPlotMappingCompleted(plotNo: string): boolean {
  return getCompletedMappingPlots().includes(plotNo);
}

/**
 * List of available plots in Survey Unit 01 whose mapping/ground truthing is pending or in progress
 * Each plot links to its real pending surveyor tool to finish the work
 */
export const AVAILABLE_UNMAPPED_PLOTS: AvailableUnmappedPlot[] = [
  {
    plotNo: 'P-14',
    parcelId: 'PAR-000123',
    khasraNo: '112/3',
    defaultLat: 18.584728,
    defaultLng: 73.737562,
    defaultElevationMsl: 568.20,
    mappingStatus: 'Mapping In Progress',
    pendingTaskCategory: 'MERGE_SPLIT',
    pendingTaskTitle: 'Cadastral Subdivision / Parcel Split',
    pendingTaskDescription: 'Parcel P-14 requires internal cadastral bisector split into P-14/1 and P-14/2 for academic vs research wing.',
    targetRoute: '/surveyor/merge-split?plot=P-14&parcelId=PAR-000123&action=split',
    actionButtonText: 'Complete Split in Merge & Split Tool →',
    badgeColor: '#8b5cf6'
  },
  {
    plotNo: 'P-15',
    parcelId: 'PAR-000124',
    khasraNo: '114/1',
    defaultLat: 18.585180,
    defaultLng: 73.738430,
    defaultElevationMsl: 569.00,
    mappingStatus: 'Pending GT Survey',
    pendingTaskCategory: 'DGPS_HEIGHT',
    pendingTaskTitle: 'DGPS RTK Ground Truth Point & Height Recording',
    pendingTaskDescription: 'Plot P-15 (Tech Vista Alpha) requires DGPS RTK millimeter observation and MSL elevation capture.',
    targetRoute: '/surveyor/upload-gt-points?plot=P-15&action=capture_gt',
    actionButtonText: 'Record DGPS RTK & Height →',
    badgeColor: '#0284c7'
  },
  {
    plotNo: 'P-16',
    parcelId: 'PAR-000125',
    khasraNo: '115/2',
    defaultLat: 18.585954,
    defaultLng: 73.738229,
    defaultElevationMsl: 569.40,
    mappingStatus: 'Pending GT Survey',
    pendingTaskCategory: 'MAP_IMAGE_VERIFICATION',
    pendingTaskTitle: 'Drone Orthophoto & Satellite Image Alignment',
    pendingTaskDescription: 'Plot P-16 cadastral boundary requires verification against high-resolution drone orthophoto.',
    targetRoute: '/surveyor/map-image-verification?plot=P-16&unit=348671',
    actionButtonText: 'Verify Satellite & Drone Orthophoto →',
    badgeColor: '#059669'
  },
  {
    plotNo: 'Plot-21',
    parcelId: 'PAR-PUNE-011',
    khasraNo: '121/2',
    defaultLat: 18.584089,
    defaultLng: 73.737943,
    defaultElevationMsl: 568.20,
    mappingStatus: 'Unmapped - DGPS Required',
    pendingTaskCategory: 'MERGE_SPLIT',
    pendingTaskTitle: 'Parcel Boundary Demarcation & Amalgamation',
    pendingTaskDescription: 'Plot 21 boundary adjustment needed to resolve overlap with Cognizant Tech Park Annex.',
    targetRoute: '/surveyor/merge-split?plot=Plot-21&parcelId=PAR-PUNE-011&action=merge',
    actionButtonText: 'Open Merge & Split Tool →',
    badgeColor: '#8b5cf6'
  },
  {
    plotNo: 'Plot-28',
    parcelId: 'PAR-PUNE-018',
    khasraNo: '128/4',
    defaultLat: 18.586200,
    defaultLng: 73.736800,
    defaultElevationMsl: 570.10,
    mappingStatus: 'Pending Field Demarcation',
    pendingTaskCategory: 'ROR_ENTRY',
    pendingTaskTitle: 'RoR 7/12 Land Record & Ownership Demarcation',
    pendingTaskDescription: 'Hinjawadi Gaothan Plot 28 pending land ownership registration and RoR rights assignment.',
    targetRoute: '/surveyor/ror-entry?plot=Plot-28&khasra=128/4',
    actionButtonText: 'Complete RoR 7/12 Entry →',
    badgeColor: '#d97706'
  },
  {
    plotNo: 'Plot-32',
    parcelId: 'PAR-PUNE-022',
    khasraNo: '132/1',
    defaultLat: 18.583414,
    defaultLng: 73.735300,
    defaultElevationMsl: 568.80,
    mappingStatus: 'Pending GT Survey',
    pendingTaskCategory: 'PLOT_VERIFICATION',
    pendingTaskTitle: 'Field Ground Truthing & Boundary Verification',
    pendingTaskDescription: 'Wipro Circle Ancillary commercial plot requires field physical boundary check and GIS verification.',
    targetRoute: '/surveyor/plot-verification?plot=Plot-32&parcelId=PAR-PUNE-022',
    actionButtonText: 'Complete Field Verification →',
    badgeColor: '#2563eb'
  },
  {
    plotNo: 'Plot-45',
    parcelId: 'PAR-PUNE-035',
    khasraNo: '145/3',
    defaultLat: 18.587100,
    defaultLng: 73.740100,
    defaultElevationMsl: 571.30,
    mappingStatus: 'Unmapped - DGPS Required',
    pendingTaskCategory: 'DGPS_HEIGHT',
    pendingTaskTitle: 'High-Rise Building Height & DGPS Fix',
    pendingTaskDescription: 'Blue Ridge Spine 14-floor residential tower requires vertical height measurement and MSL elevation.',
    targetRoute: '/surveyor/upload-gt-points?plot=Plot-45&action=capture_gt',
    actionButtonText: 'Record Building Height & Elevation →',
    badgeColor: '#0284c7'
  },
  {
    plotNo: 'Plot-58',
    parcelId: 'PAR-PUNE-048',
    khasraNo: '158/2',
    defaultLat: 18.582900,
    defaultLng: 73.734500,
    defaultElevationMsl: 567.90,
    mappingStatus: 'Pending Field Demarcation',
    pendingTaskCategory: 'MAP_IMAGE_VERIFICATION',
    pendingTaskTitle: 'MIDC Substation Cadastral Vector Verification',
    pendingTaskDescription: 'Emergency utility substation plot vector alignment with 3.5cm drone imagery pending surveyor approval.',
    targetRoute: '/surveyor/map-image-verification?plot=Plot-58&unit=348671',
    actionButtonText: 'Verify GIS Cadastral Alignment →',
    badgeColor: '#059669'
  }
];

/**
 * Authoritative Register of Plots, Assigned Building IDs, Heights, and Permanent & Temporary ULPINs
 */
export const HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER: PlotBuildingUlpinRecord[] = [
  {
    id: 'REG-001',
    plotNo: 'P-14',
    khasraNo: '112/3',
    parcelId: 'PAR-000123',
    buildingId: 'BLD-HINJ-001',
    buildingName: 'I²IT Academic Central Complex (A-Block)',
    buildingCategory: 'Educational',
    totalFloors: 5,
    heightM: 16.4,
    elevationMsl: 568.20,
    latitude: 18.584728,
    longitude: 73.737562,
    ulpin: '27041001002001',
    ulpinType: 'PERMANENT',
    ulpinStatusText: 'Authoritative Permanent ULPIN Assigned',
    mappingStatus: 'Completed',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '20-Aug-2026'
  },
  {
    id: 'REG-002',
    plotNo: 'P-14',
    khasraNo: '112/3',
    parcelId: 'PAR-000123',
    buildingId: 'BLD-HINJ-002',
    buildingName: 'I²IT Advanced Computing & Research Wing',
    buildingCategory: 'Educational',
    totalFloors: 4,
    heightM: 13.2,
    elevationMsl: 568.60,
    latitude: 18.585180,
    longitude: 73.738430,
    ulpin: '27041001002002',
    ulpinType: 'PERMANENT',
    ulpinStatusText: 'Authoritative Permanent ULPIN Assigned',
    mappingStatus: 'Completed',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '20-Aug-2026'
  },
  {
    id: 'REG-003',
    plotNo: 'P-14',
    khasraNo: '112/3',
    parcelId: 'PAR-000123',
    buildingId: 'BLD-HINJ-003',
    buildingName: 'I²IT Innovation Incubation & Seminar Center',
    buildingCategory: 'Educational',
    totalFloors: 3,
    heightM: 9.8,
    elevationMsl: 569.00,
    latitude: 18.584402,
    longitude: 73.737702,
    ulpin: 'TEMP2704100089',
    ulpinType: 'TEMPORARY',
    ulpinStatusText: 'Provisional Temp ULPIN (Internal Partitioning Pending)',
    mappingStatus: 'Mapping In Progress',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '22-Aug-2026'
  },
  {
    id: 'REG-004',
    plotNo: 'P-15',
    khasraNo: '114/1',
    parcelId: 'PAR-000124',
    buildingId: 'BLD-HINJ-004',
    buildingName: 'Tech Vista IT Campus — Tower Alpha',
    buildingCategory: 'Commercial IT Park',
    totalFloors: 8,
    heightM: 26.5,
    elevationMsl: 569.40,
    latitude: 18.585954,
    longitude: 73.738229,
    ulpin: '27041001002004',
    ulpinType: 'PERMANENT',
    ulpinStatusText: 'Authoritative Permanent ULPIN Assigned',
    mappingStatus: 'Completed',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '22-Aug-2026'
  },
  {
    id: 'REG-005',
    plotNo: 'P-15',
    khasraNo: '114/1',
    parcelId: 'PAR-000124',
    buildingId: 'BLD-HINJ-005',
    buildingName: 'Tech Vista Campus — Tower Beta (Under Extension)',
    buildingCategory: 'Commercial IT Park',
    totalFloors: 6,
    heightM: 19.8,
    elevationMsl: 569.80,
    latitude: 18.586391,
    longitude: 73.737306,
    ulpin: 'TEMP2704100114',
    ulpinType: 'TEMPORARY',
    ulpinStatusText: 'Provisional Temp ULPIN (Structural Demarcation Ongoing)',
    mappingStatus: 'Mapping In Progress',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '23-Aug-2026'
  },
  {
    id: 'REG-006',
    plotNo: 'Plot-21',
    khasraNo: '121/2',
    parcelId: 'PAR-PUNE-011',
    buildingId: 'BLD-HINJ-006',
    buildingName: 'Cognizant Technology Park — Annex 1',
    buildingCategory: 'Commercial IT Park',
    totalFloors: 3,
    heightM: 9.6,
    elevationMsl: 568.20,
    latitude: 18.584089,
    longitude: 73.737943,
    ulpin: '27041001003001',
    ulpinType: 'PERMANENT',
    ulpinStatusText: 'Authoritative Permanent ULPIN Assigned',
    mappingStatus: 'Completed',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '24-Aug-2026'
  },
  {
    id: 'REG-007',
    plotNo: 'Plot-21',
    khasraNo: '121/2',
    parcelId: 'PAR-PUNE-011',
    buildingId: 'BLD-HINJ-007',
    buildingName: 'Cognizant Tech Facility — Utility & Data Hub',
    buildingCategory: 'Utility & Infrastructure',
    totalFloors: 2,
    heightM: 6.4,
    elevationMsl: 568.30,
    latitude: 18.583945,
    longitude: 73.737819,
    ulpin: 'TEMP2704100142',
    ulpinType: 'TEMPORARY',
    ulpinStatusText: 'Provisional Temp ULPIN (Boundary Verification Pending)',
    mappingStatus: 'Pending Field Survey',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '24-Aug-2026'
  },
  {
    id: 'REG-008',
    plotNo: 'Plot-28',
    khasraNo: '128/4',
    parcelId: 'PAR-PUNE-018',
    buildingId: 'BLD-HINJ-008',
    buildingName: 'Hinjawadi Gaothan Residential Society — Block A',
    buildingCategory: 'Residential',
    totalFloors: 4,
    heightM: 12.8,
    elevationMsl: 570.10,
    latitude: 18.586200,
    longitude: 73.736800,
    ulpin: '27041001003018',
    ulpinType: 'PERMANENT',
    ulpinStatusText: 'Authoritative Permanent ULPIN Assigned',
    mappingStatus: 'Completed',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '25-Aug-2026'
  },
  {
    id: 'REG-009',
    plotNo: 'Plot-28',
    khasraNo: '128/4',
    parcelId: 'PAR-PUNE-018',
    buildingId: 'BLD-HINJ-009',
    buildingName: 'Hinjawadi Gaothan Mixed Commercial Storefront',
    buildingCategory: 'Residential',
    totalFloors: 2,
    heightM: 6.5,
    elevationMsl: 570.20,
    latitude: 18.586344,
    longitude: 73.736874,
    ulpin: 'TEMP2704100198',
    ulpinType: 'TEMPORARY',
    ulpinStatusText: 'Provisional Temp ULPIN (Multi-Ownership Review)',
    mappingStatus: 'Pending Field Survey',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '25-Aug-2026'
  },
  {
    id: 'REG-010',
    plotNo: 'Plot-32',
    khasraNo: '132/1',
    parcelId: 'PAR-PUNE-022',
    buildingId: 'BLD-HINJ-010',
    buildingName: 'Wipro Circle Ancillary Office Complex',
    buildingCategory: 'Commercial IT Park',
    totalFloors: 5,
    heightM: 16.0,
    elevationMsl: 568.80,
    latitude: 18.583414,
    longitude: 73.735300,
    ulpin: 'TEMP2704100205',
    ulpinType: 'TEMPORARY',
    ulpinStatusText: 'Provisional Temp ULPIN (Ground Truthing Yet to Complete)',
    mappingStatus: 'Ground Truthing Required',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '26-Aug-2026'
  },
  {
    id: 'REG-011',
    plotNo: 'Plot-45',
    khasraNo: '145/3',
    parcelId: 'PAR-PUNE-035',
    buildingId: 'BLD-HINJ-011',
    buildingName: 'Blue Ridge Spine Residential Tower 9',
    buildingCategory: 'Residential',
    totalFloors: 14,
    heightM: 44.8,
    elevationMsl: 571.30,
    latitude: 18.587100,
    longitude: 73.740100,
    ulpin: '27041001003035',
    ulpinType: 'PERMANENT',
    ulpinStatusText: 'Authoritative Permanent ULPIN Assigned',
    mappingStatus: 'Completed',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '26-Aug-2026'
  },
  {
    id: 'REG-012',
    plotNo: 'Plot-58',
    khasraNo: '158/2',
    parcelId: 'PAR-PUNE-048',
    buildingId: 'BLD-HINJ-012',
    buildingName: 'MIDC Emergency Power & Substation Facility',
    buildingCategory: 'Utility & Infrastructure',
    totalFloors: 1,
    heightM: 4.8,
    elevationMsl: 567.90,
    latitude: 18.582900,
    longitude: 73.734500,
    ulpin: 'TEMP2704100254',
    ulpinType: 'TEMPORARY',
    ulpinStatusText: 'Provisional Temp ULPIN (Final Gazette Approval Pending)',
    mappingStatus: 'Pending Field Survey',
    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
    surveyDate: '27-Aug-2026'
  }
];
