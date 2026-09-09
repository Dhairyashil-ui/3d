// NAKSHA V2.0 - Authoritative Surveyor MAP-2 & 3D Property Intelligence Store
// Strict Hierarchy: ULPIN / Source Parcel -> Parcel -> Building -> Floor -> Unit / Flat -> 3D Volume

export interface LandParcel {
  parcelId: string; // e.g. PAR-000123
  ulpin: string; // 14-digit authoritative land parcel anchor, e.g. "230410010020101"
  ulpinStatus: 'Available' | 'Pending' | 'Not Available' | 'Requires Review';
  khasraNo: string; // e.g. "112/3" or "4"
  plotNo: string; // e.g. "4" or "20"
  state: string; // "Maharashtra"
  district: string; // "Pune"
  ulb: string; // "Pune - 270410"
  ward: string; // "43 - Maharana pratap ward (34367)"
  surveyUnit: string; // "Survey Unit 1 (343671)"
  areaSqm: number; // e.g. 766.765
  perimeterM: number; // e.g. 119.89
  propertyType: 'Single/Joint Owners Individual Building' | 'Multi-Ownership/Group Housing Society' | 'Plot' | 'Commercial Complex';
  verificationStatus: 'Verified' | 'Pending Field Verification' | 'Requires Review' | 'Disputed';
  rorStatus: 'Verified' | 'Pending' | 'Draft';
  threeDStatus: 'Ready for Verification' | 'Model Reconstructed' | 'Pending Photogrammetry' | 'Anomalies Flagged';
  publicationStatus: 'Provisional Published' | 'Pending' | 'Published';
  coordinates: [number, number]; // [lat, lng]
  buildingsCount: number;
  floorsCount: number;
  unitsCount: number;
}

export interface BuildingRecord {
  buildingId: string; // BLD-000781
  parcelId: string; // PAR-000123
  ulpin: string; // 230410010020101 (Parcel anchor)
  buildingName: string;
  buildingType: 'Residential Apartment' | 'Commercial Complex' | 'Mixed Use' | 'Individual House';
  buildingStatus: 'Existing & Occupied' | 'Under Construction' | 'Renovated';
  totalFloors: number;
  approxHeightM: number; // e.g. 18.6
  footprintAreaSqm: number; // e.g. 540.8
  builtUpAreaSqm: number; // e.g. 2485.0
  roofType: 'Flat RCC Slab' | 'Sloped Tile' | 'Metal Truss';
  constructionYear: string; // e.g. "2019"
  source: string; // "Drone Photogrammetry + LiDAR LAS 1.4"
  confidencePct: number; // e.g. 96.8
  verificationStatus: 'Verified' | 'Pending Field Verification' | 'Variance Flagged';
  farRatio: number; // e.g. 1.84
}

export interface FloorRecord {
  floorId: string; // FLR-000001
  buildingId: string; // BLD-000781
  floorNumber: number; // 0 for Ground, 1, 2, 3, 4
  floorName: string; // "Ground Floor", "First Floor", etc.
  estimatedElevationM: number; // e.g. 524.8
  estimatedHeightM: number; // e.g. 3.6
  unitsCount: number;
  geometryStatus: 'Available' | 'Pending' | 'Derived from LiDAR';
  source: string; // "Photogrammetry Mesh + Terrestrial Inspection"
  confidencePct: number; // 98.4
  verificationStatus: 'Verified' | 'Pending' | 'Discrepancy Detected';
  builtUpAreaSqm: number;
}

export interface UnitRecord {
  unitId: string; // UNT-000302
  flatNumber: string; // "302"
  floorId: string; // FLR-000003
  floorNumber: number;
  buildingId: string; // BLD-000781
  parcelId: string; // PAR-000123
  ownersCount: number;
  ownerNames: string[];
  useType: 'Residential' | 'Commercial' | 'Retail' | 'Public Utility';
  carpetAreaSqm: number; // e.g. 112.5
  propertyTaxId: string; // e.g. "PMC-PT-2026-8841"
  propertyStatus: 'Occupied' | 'Vacant' | 'Rented';
  rorLinkage: 'Linked' | 'Pending' | 'Not Linked';
  threeDVolumeStatus: 'Available' | 'Pending Generation' | 'Review Required';
  verificationStatus: 'Verified' | 'Pending' | 'Flagged';
  volumeId: string; // VOL-000982
}

export interface SpatialVolumeRecord {
  volumeId: string; // VOL-000982
  buildingId: string;
  floorId: string;
  unitId: string;
  heightM: number; // 3.2
  baseElevationM: number; // 534.4
  topElevationM: number; // 537.6
  volumeM3: number; // 360.0
  areaSqm: number; // 112.5
  source: string; // "Upstream 3D GIS Reality Mesh Pipeline"
  confidencePct: number; // 97.5
  validationStatus: 'Passed Orthogonal Check' | 'Within Permissible Tolerance' | 'Height Discrepancy';
  timestamp: string;
}

export interface GroundTruthPoint {
  seqNo: number;
  plotNo: string;
  lat: number;
  lng: number;
  elevationM?: number;
  accuracyM: number;
  status: 'Approved' | 'Pending' | 'Uploaded';
}

export interface RoRPlotRecord {
  sNo: number;
  wardVillage: string;
  surveyUnit: string;
  plotSerialNo: string;
  plotNumber: string;
  plotAreaSqm: number;
  status: 'Draft' | 'Pending' | 'Completed';
  khasraNo: string;
  ulpin?: string;
  owners: {
    name: string;
    sharePct: number;
    aadhaarMasked: string;
    mobile: string;
    rights: string;
  }[];
}

export interface PublicationCardRecord {
  id: string;
  sNo: number;
  action: string;
  urProCardNo: string; // e.g. "UPC123456"
  formNo: string; // e.g. "Form-01"
  date: string; // "2026-08-04"
  state: string; // "Maharashtra"
  district: string; // "Pune"
  town: string; // "Pune"
  city?: string; // "Pune"
  ward: string; // "Maharana pratap ward(43)"
  propertyType: string;
  khasra: string;
  khasraNo?: string;
  plotNo?: string;
  ownerName?: string;
  threeDStatus?: string;
  ulpin: string;
  status: 'Provisional' | 'Finalized' | 'Published';
}

export interface ClaimRecord {
  id: string;
  sNo: number;
  district: string;
  ulb: string;
  ward: string;
  surveyUnit: string;
  plotNo: string;
  ticketId: string; // e.g. "OF_1" or "PU_3"
  claimSource: 'official' | 'public';
  typeOfClaim: string; // "Area Correction, Owner Detail Correction"
  claimStatus: 'Accepted' | 'Pending' | 'Rejected' | 'In Review';
  claimDate: string;
  redressalDate: string;
  remarks?: string;
  objectionDescription?: string;
  documents: {
    name: string;
    type: string;
    date: string;
  }[];
}

// ----------------------------------------------------------------------------
// INITIAL SEED DATA ALIGNED WITH PUNE HINJAWADI WARD 1 & SURVEYORS_MAP2 SCREENSHOTS
// ----------------------------------------------------------------------------

export const MOCK_PARCELS: LandParcel[] = [
  {
    parcelId: 'PAR-000123',
    ulpin: '230410010020101',
    ulpinStatus: 'Available',
    khasraNo: '112/3',
    plotNo: '4',
    state: 'Maharashtra',
    district: 'Pune',
    ulb: 'Pune - 270410',
    ward: '43 - Maharana pratap ward (34367)',
    surveyUnit: 'Survey Unit 1 (343671)',
    areaSqm: 766.765,
    perimeterM: 119.89,
    propertyType: 'Multi-Ownership/Group Housing Society',
    verificationStatus: 'Verified',
    rorStatus: 'Verified',
    threeDStatus: 'Ready for Verification',
    publicationStatus: 'Provisional Published',
    coordinates: [23.2428291, 77.4301698],
    buildingsCount: 1,
    floorsCount: 5,
    unitsCount: 18
  },
  {
    parcelId: 'PAR-000124',
    ulpin: '230410010020102',
    ulpinStatus: 'Available',
    khasraNo: '114/1',
    plotNo: '20',
    state: 'Maharashtra',
    district: 'Pune',
    ulb: 'Pune - 270410',
    ward: '43 - Maharana pratap ward (34367)',
    surveyUnit: 'Survey Unit 1 (343671)',
    areaSqm: 768.043,
    perimeterM: 122.40,
    propertyType: 'Multi-Ownership/Group Housing Society',
    verificationStatus: 'Pending Field Verification',
    rorStatus: 'Pending',
    threeDStatus: 'Model Reconstructed',
    publicationStatus: 'Pending',
    coordinates: [23.2419451, 77.431777],
    buildingsCount: 1,
    floorsCount: 4,
    unitsCount: 12
  },
  {
    parcelId: 'PAR-000125',
    ulpin: '230410010020103',
    ulpinStatus: 'Requires Review',
    khasraNo: '118/2',
    plotNo: '8',
    state: 'Maharashtra',
    district: 'Pune',
    ulb: 'Pune - 270410',
    ward: '43 - Maharana pratap ward (34367)',
    surveyUnit: 'Survey Unit 1 (343671)',
    areaSqm: 20377.0,
    perimeterM: 614.5,
    propertyType: 'Commercial Complex',
    verificationStatus: 'Disputed',
    rorStatus: 'Draft',
    threeDStatus: 'Anomalies Flagged',
    publicationStatus: 'Pending',
    coordinates: [23.2435439, 77.4298779],
    buildingsCount: 3,
    floorsCount: 6,
    unitsCount: 42
  },
  {
    parcelId: 'PAR-000126',
    ulpin: '230410010020104',
    ulpinStatus: 'Available',
    khasraNo: '121/4',
    plotNo: '16',
    state: 'Maharashtra',
    district: 'Pune',
    ulb: 'Pune - 270410',
    ward: '43 - Maharana pratap ward (34367)',
    surveyUnit: 'Survey Unit 1 (343671)',
    areaSqm: 5289.0,
    perimeterM: 310.2,
    propertyType: 'Single/Joint Owners Individual Building',
    verificationStatus: 'Verified',
    rorStatus: 'Verified',
    threeDStatus: 'Ready for Verification',
    publicationStatus: 'Provisional Published',
    coordinates: [23.2406979, 77.4294183],
    buildingsCount: 1,
    floorsCount: 2,
    unitsCount: 2
  },
  {
    parcelId: 'PAR-000127',
    ulpin: '',
    ulpinStatus: 'Pending',
    khasraNo: '124/A',
    plotNo: '1/1/1',
    state: 'Maharashtra',
    district: 'Pune',
    ulb: 'Pune - 270410',
    ward: '43 - Maharana pratap ward (34367)',
    surveyUnit: 'Survey Unit 1 (343671)',
    areaSqm: 6692.0,
    perimeterM: 345.0,
    propertyType: 'Plot',
    verificationStatus: 'Pending Field Verification',
    rorStatus: 'Draft',
    threeDStatus: 'Pending Photogrammetry',
    publicationStatus: 'Pending',
    coordinates: [23.244012, 77.428511],
    buildingsCount: 0,
    floorsCount: 0,
    unitsCount: 0
  }
];

export const MOCK_BUILDINGS: BuildingRecord[] = [
  {
    buildingId: 'BLD-000781',
    parcelId: 'PAR-000123',
    ulpin: '230410010020101',
    buildingName: 'Gulmohar Heights Residency',
    buildingType: 'Residential Apartment',
    buildingStatus: 'Existing & Occupied',
    totalFloors: 5,
    approxHeightM: 18.6,
    footprintAreaSqm: 540.8,
    builtUpAreaSqm: 2485.0,
    roofType: 'Flat RCC Slab',
    constructionYear: '2019',
    source: 'Drone Photogrammetry + LiDAR LAS 1.4',
    confidencePct: 96.8,
    verificationStatus: 'Verified',
    farRatio: 3.24
  },
  {
    buildingId: 'BLD-000782',
    parcelId: 'PAR-000124',
    ulpin: '230410010020102',
    buildingName: 'Pratap Enclave Tower A',
    buildingType: 'Residential Apartment',
    buildingStatus: 'Existing & Occupied',
    totalFloors: 4,
    approxHeightM: 15.2,
    footprintAreaSqm: 490.0,
    builtUpAreaSqm: 1960.0,
    roofType: 'Flat RCC Slab',
    constructionYear: '2021',
    source: 'Nadir Drone + Terrestrial Scan',
    confidencePct: 94.2,
    verificationStatus: 'Pending Field Verification',
    farRatio: 2.55
  },
  {
    buildingId: 'BLD-000783',
    parcelId: 'PAR-000125',
    ulpin: '230410010020103',
    buildingName: 'MP Nagar Commerce Tower',
    buildingType: 'Commercial Complex',
    buildingStatus: 'Existing & Occupied',
    totalFloors: 6,
    approxHeightM: 24.8,
    footprintAreaSqm: 1250.0,
    builtUpAreaSqm: 7500.0,
    roofType: 'Flat RCC Slab',
    constructionYear: '2018',
    source: 'Photogrammetry + Aerial LiDAR',
    confidencePct: 92.5,
    verificationStatus: 'Variance Flagged',
    farRatio: 3.68
  }
];

export const MOCK_FLOORS: FloorRecord[] = [
  {
    floorId: 'FLR-000001',
    buildingId: 'BLD-000781',
    floorNumber: 0,
    floorName: 'Ground Floor',
    estimatedElevationM: 524.8,
    estimatedHeightM: 3.8,
    unitsCount: 2,
    geometryStatus: 'Available',
    source: 'Photogrammetry Mesh + Terrestrial Inspection',
    confidencePct: 98.4,
    verificationStatus: 'Verified',
    builtUpAreaSqm: 510.0
  },
  {
    floorId: 'FLR-000002',
    buildingId: 'BLD-000781',
    floorNumber: 1,
    floorName: 'First Floor',
    estimatedElevationM: 528.6,
    estimatedHeightM: 3.4,
    unitsCount: 4,
    geometryStatus: 'Available',
    source: 'Photogrammetry Mesh',
    confidencePct: 97.2,
    verificationStatus: 'Verified',
    builtUpAreaSqm: 495.0
  },
  {
    floorId: 'FLR-000003',
    buildingId: 'BLD-000781',
    floorNumber: 2,
    floorName: 'Second Floor',
    estimatedElevationM: 532.0,
    estimatedHeightM: 3.4,
    unitsCount: 4,
    geometryStatus: 'Available',
    source: 'Photogrammetry Mesh',
    confidencePct: 96.8,
    verificationStatus: 'Verified',
    builtUpAreaSqm: 495.0
  },
  {
    floorId: 'FLR-000004',
    buildingId: 'BLD-000781',
    floorNumber: 3,
    floorName: 'Third Floor',
    estimatedElevationM: 535.4,
    estimatedHeightM: 3.4,
    unitsCount: 4,
    geometryStatus: 'Available',
    source: 'Photogrammetry Mesh + Oblique Drone',
    confidencePct: 96.5,
    verificationStatus: 'Verified',
    builtUpAreaSqm: 495.0
  },
  {
    floorId: 'FLR-000005',
    buildingId: 'BLD-000781',
    floorNumber: 4,
    floorName: 'Fourth Floor (Penthouse)',
    estimatedElevationM: 538.8,
    estimatedHeightM: 3.6,
    unitsCount: 4,
    geometryStatus: 'Available',
    source: 'LiDAR + Photogrammetry',
    confidencePct: 95.1,
    verificationStatus: 'Pending',
    builtUpAreaSqm: 490.0
  }
];

export const MOCK_UNITS: UnitRecord[] = [
  {
    unitId: 'UNT-000301',
    flatNumber: '301',
    floorId: 'FLR-000004',
    floorNumber: 3,
    buildingId: 'BLD-000781',
    parcelId: 'PAR-000123',
    ownersCount: 1,
    ownerNames: ['Rajesh Sharma'],
    useType: 'Residential',
    carpetAreaSqm: 110.0,
    propertyTaxId: 'PMC-PT-2026-8840',
    propertyStatus: 'Occupied',
    rorLinkage: 'Linked',
    threeDVolumeStatus: 'Available',
    verificationStatus: 'Verified',
    volumeId: 'VOL-000981'
  },
  {
    unitId: 'UNT-000302',
    flatNumber: '302',
    floorId: 'FLR-000004',
    floorNumber: 3,
    buildingId: 'BLD-000781',
    parcelId: 'PAR-000123',
    ownersCount: 2,
    ownerNames: ['Amitabh Verma', 'Sunita Verma'],
    useType: 'Residential',
    carpetAreaSqm: 115.5,
    propertyTaxId: 'PMC-PT-2026-8841',
    propertyStatus: 'Occupied',
    rorLinkage: 'Linked',
    threeDVolumeStatus: 'Available',
    verificationStatus: 'Pending',
    volumeId: 'VOL-000982'
  },
  {
    unitId: 'UNT-000303',
    flatNumber: '303',
    floorId: 'FLR-000004',
    floorNumber: 3,
    buildingId: 'BLD-000781',
    parcelId: 'PAR-000123',
    ownersCount: 1,
    ownerNames: ['Deepak Chouhan'],
    useType: 'Residential',
    carpetAreaSqm: 112.0,
    propertyTaxId: 'PMC-PT-2026-8842',
    propertyStatus: 'Occupied',
    rorLinkage: 'Linked',
    threeDVolumeStatus: 'Available',
    verificationStatus: 'Verified',
    volumeId: 'VOL-000983'
  },
  {
    unitId: 'UNT-000304',
    flatNumber: '304',
    floorId: 'FLR-000004',
    floorNumber: 3,
    buildingId: 'BLD-000781',
    parcelId: 'PAR-000123',
    ownersCount: 1,
    ownerNames: ['Pooja Saxena'],
    useType: 'Residential',
    carpetAreaSqm: 114.0,
    propertyTaxId: 'PMC-PT-2026-8843',
    propertyStatus: 'Occupied',
    rorLinkage: 'Linked',
    threeDVolumeStatus: 'Available',
    verificationStatus: 'Verified',
    volumeId: 'VOL-000984'
  }
];

export const MOCK_SPATIAL_VOLUMES: SpatialVolumeRecord[] = [
  {
    volumeId: 'VOL-000981',
    buildingId: 'BLD-000781',
    floorId: 'FLR-000004',
    unitId: 'UNT-000301',
    heightM: 3.2,
    baseElevationM: 535.4,
    topElevationM: 538.6,
    volumeM3: 352.0,
    areaSqm: 110.0,
    source: 'Upstream 3D GIS Reality Mesh Pipeline',
    confidencePct: 97.8,
    validationStatus: 'Passed Orthogonal Check',
    timestamp: '2026-09-05 14:32:10'
  },
  {
    volumeId: 'VOL-000982',
    buildingId: 'BLD-000781',
    floorId: 'FLR-000004',
    unitId: 'UNT-000302',
    heightM: 3.2,
    baseElevationM: 535.4,
    topElevationM: 538.6,
    volumeM3: 369.6,
    areaSqm: 115.5,
    source: 'Upstream 3D GIS Reality Mesh Pipeline',
    confidencePct: 97.4,
    validationStatus: 'Within Permissible Tolerance',
    timestamp: '2026-09-05 14:32:15'
  },
  {
    volumeId: 'VOL-000983',
    buildingId: 'BLD-000781',
    floorId: 'FLR-000004',
    unitId: 'UNT-000303',
    heightM: 3.2,
    baseElevationM: 535.4,
    topElevationM: 538.6,
    volumeM3: 358.4,
    areaSqm: 112.0,
    source: 'Upstream 3D GIS Reality Mesh Pipeline',
    confidencePct: 97.1,
    validationStatus: 'Passed Orthogonal Check',
    timestamp: '2026-09-05 14:32:20'
  }
];

export const MOCK_GT_POINTS: GroundTruthPoint[] = [
  { seqNo: 1, plotNo: '1', lat: 23.242091, lng: 77.427639, elevationM: 524.2, accuracyM: 0.012, status: 'Approved' },
  { seqNo: 2, plotNo: '4', lat: 23.242829, lng: 77.430170, elevationM: 524.8, accuracyM: 0.009, status: 'Approved' },
  { seqNo: 3, plotNo: '8', lat: 23.243544, lng: 77.429878, elevationM: 525.1, accuracyM: 0.014, status: 'Approved' },
  { seqNo: 4, plotNo: '16', lat: 23.240698, lng: 77.429418, elevationM: 523.9, accuracyM: 0.011, status: 'Approved' },
  { seqNo: 5, plotNo: '20', lat: 23.241945, lng: 77.431777, elevationM: 525.4, accuracyM: 0.010, status: 'Approved' }
];

export const MOCK_ROR_PLOTS: RoRPlotRecord[] = [
  {
    sNo: 1,
    wardVillage: 'Maharana pratap ward',
    surveyUnit: 'Survey Unit 1',
    plotSerialNo: '1',
    plotNumber: '1/1/1',
    plotAreaSqm: 0,
    status: 'Draft',
    khasraNo: '101/1',
    owners: [{ name: 'Sanjay Patidar', sharePct: 100, aadhaarMasked: 'XXXX-XXXX-9128', mobile: '9826011223', rights: 'Ownership' }]
  },
  {
    sNo: 2,
    wardVillage: 'Maharana pratap ward',
    surveyUnit: 'Survey Unit 1',
    plotSerialNo: '1',
    plotNumber: '1/1/2/1',
    plotAreaSqm: 0,
    status: 'Draft',
    khasraNo: '101/2',
    owners: [{ name: 'Pramod Kumar', sharePct: 100, aadhaarMasked: 'XXXX-XXXX-4412', mobile: '9425033441', rights: 'Ownership' }]
  },
  {
    sNo: 3,
    wardVillage: 'Maharana pratap ward',
    surveyUnit: 'Survey Unit 1',
    plotSerialNo: '1',
    plotNumber: '1/1/2/2',
    plotAreaSqm: 0,
    status: 'Draft',
    khasraNo: '101/3',
    owners: [{ name: 'Rameshwar Dayal', sharePct: 100, aadhaarMasked: 'XXXX-XXXX-7120', mobile: '9893055667', rights: 'Ownership' }]
  },
  {
    sNo: 4,
    wardVillage: 'Maharana pratap ward',
    surveyUnit: 'Survey Unit 1',
    plotSerialNo: '1',
    plotNumber: '1/2',
    plotAreaSqm: 0,
    status: 'Completed',
    khasraNo: '102',
    owners: [{ name: 'Government of Maharashtra (Sports & Youth Welfare)', sharePct: 100, aadhaarMasked: 'GOV-DEPT-391', mobile: '0755-2771122', rights: 'State Govt.' }]
  },
  {
    sNo: 5,
    wardVillage: 'Maharana pratap ward',
    surveyUnit: 'Survey Unit 1',
    plotSerialNo: '4',
    plotNumber: '4',
    plotAreaSqm: 20377,
    status: 'Pending',
    khasraNo: '112/3',
    ulpin: '230410010020101',
    owners: [{ name: 'Gulmohar Co-op Housing Society', sharePct: 100, aadhaarMasked: 'SOC-REG-10492', mobile: '9826788990', rights: 'Society Title' }]
  },
  {
    sNo: 6,
    wardVillage: 'Maharana pratap ward',
    surveyUnit: 'Survey Unit 1',
    plotSerialNo: '9',
    plotNumber: '9',
    plotAreaSqm: 5289,
    status: 'Completed',
    khasraNo: '114/1',
    owners: [{ name: 'Harish Chandra Jain', sharePct: 50, aadhaarMasked: 'XXXX-XXXX-3341', mobile: '9425112233', rights: 'Ownership' }]
  },
  {
    sNo: 7,
    wardVillage: 'Maharana pratap ward',
    surveyUnit: 'Survey Unit 1',
    plotSerialNo: '11',
    plotNumber: '11',
    plotAreaSqm: 6692,
    status: 'Completed',
    khasraNo: '118/2',
    owners: [{ name: 'Maharashtra Housing Board', sharePct: 100, aadhaarMasked: 'MPHB-BH-0021', mobile: '0755-2554411', rights: 'State Undertaking' }]
  }
];

export const MOCK_PUBLICATIONS: PublicationCardRecord[] = [
  { id: '1', sNo: 1, action: 'View', urProCardNo: 'UPC123456', formNo: 'Form-01', date: '2026-07-22', state: 'Maharashtra', district: 'Pune', town: 'Pune', city: 'Pune', ward: 'Maharana pratap ward(43)', propertyType: 'Individual Building', khasra: '102', khasraNo: '102', plotNo: '1', ownerName: 'Ramesh Sharma', threeDStatus: 'Ready for Verification', ulpin: '230410010020088', status: 'Finalized' },
  { id: '2', sNo: 2, action: 'View', urProCardNo: 'UPC123457', formNo: 'Form-01', date: '2026-07-22', state: 'Maharashtra', district: 'Pune', town: 'Pune', city: 'Pune', ward: 'Maharana pratap ward(43)', propertyType: 'Multi-Ownership', khasra: '112/3', khasraNo: '112/3', plotNo: '4', ownerName: 'Rajesh Sharma & Co.', threeDStatus: 'Ready for Verification', ulpin: '230410010020101', status: 'Provisional' },
  { id: '3', sNo: 3, action: 'View', urProCardNo: 'UPC123458', formNo: 'Form-01', date: '2026-07-24', state: 'Maharashtra', district: 'Pune', town: 'Pune', city: 'Pune', ward: 'Maharana pratap ward(43)', propertyType: 'Individual Building', khasra: '114/1', khasraNo: '114/1', plotNo: '20', ownerName: 'Sunil Verma', threeDStatus: 'Model Reconstructed', ulpin: '230410010020102', status: 'Provisional' },
  { id: '4', sNo: 4, action: 'View', urProCardNo: 'UPC123459', formNo: 'Form-01', date: '2026-08-04', state: 'Maharashtra', district: 'Pune', town: 'Pune', city: 'Pune', ward: 'Maharana pratap ward(43)', propertyType: 'Commercial', khasra: '118/2', khasraNo: '118/2', plotNo: '8', ownerName: 'Pune IT Park Ltd', threeDStatus: 'Anomalies Flagged', ulpin: '230410010020103', status: 'Provisional' },
  { id: '5', sNo: 5, action: 'View', urProCardNo: 'UPC123460', formNo: 'Form-01', date: '2026-08-06', state: 'Maharashtra', district: 'Pune', town: 'Pune', city: 'Pune', ward: 'Maharana pratap ward(43)', propertyType: 'Individual Building', khasra: '121/4', khasraNo: '121/4', plotNo: '16', ownerName: 'Amit Saxena', threeDStatus: 'Ready for Verification', ulpin: '230410010020104', status: 'Finalized' }
];

export const MOCK_CLAIMS: ClaimRecord[] = [
  {
    id: '1',
    sNo: 1,
    district: 'Pune',
    ulb: 'Pune',
    ward: 'Maharana pratap ward(43)',
    surveyUnit: 'Survey Unit 1(343671)',
    plotNo: '8',
    ticketId: 'OF_1',
    claimSource: 'official',
    typeOfClaim: 'Area Correction, Owner Detail Correction',
    claimStatus: 'Accepted',
    claimDate: '2026-06-11 12:09:20',
    redressalDate: '2026-12-21',
    objectionDescription: 'Correction of eastern parcel boundary coordinate overlap with municipal drain reservation.',
    documents: [{ name: '0855a29e-09cb-4a6a-aeb2-3c9cb22c4b1a.pdf', type: 'Claim Document', date: '2026-06-11' }]
  },
  {
    id: '2',
    sNo: 2,
    district: 'Pune',
    ulb: 'Pune',
    ward: 'Maharana pratap ward(43)',
    surveyUnit: 'Survey Unit 1(343671)',
    plotNo: '8',
    ticketId: 'OF_2',
    claimSource: 'official',
    typeOfClaim: 'Area Correction, Owner Detail Correction',
    claimStatus: 'Accepted',
    claimDate: '2026-06-11 12:19:02',
    redressalDate: '2026-07-13',
    objectionDescription: 'Clarification of mutation share between co-parceners.',
    documents: [{ name: 'claim_order_proceeding_771.pdf', type: 'Proceeding Document', date: '2026-07-13' }]
  },
  {
    id: '3',
    sNo: 3,
    district: 'Pune',
    ulb: 'Pune',
    ward: 'Maharana pratap ward(43)',
    surveyUnit: 'Survey Unit 1(343671)',
    plotNo: '4/1',
    ticketId: 'OF_3',
    claimSource: 'official',
    typeOfClaim: 'Area Correction',
    claimStatus: 'Accepted',
    claimDate: '2026-07-23 17:15:13',
    redressalDate: '2026-07-01',
    documents: []
  },
  {
    id: '4',
    sNo: 4,
    district: 'Pune',
    ulb: 'Pune',
    ward: 'Maharana pratap ward(43)',
    surveyUnit: 'Survey Unit 1(343671)',
    plotNo: '8',
    ticketId: 'PU_3',
    claimSource: 'public',
    typeOfClaim: 'Area Correction, Owner Detail Correction',
    claimStatus: 'Pending',
    claimDate: '2026-07-04 11:32:52',
    redressalDate: 'Under Review',
    objectionDescription: 'Public claimant requests re-measurement of rear courtyard area before final gazette publication.',
    documents: [{ name: 'objection_affidavit_pu3.pdf', type: 'Claim Document', date: '2026-07-04' }]
  },
  {
    id: '5',
    sNo: 5,
    district: 'Pune',
    ulb: 'Pune',
    ward: 'Maharana pratap ward(43)',
    surveyUnit: 'Survey Unit 1(343671)',
    plotNo: '1',
    ticketId: 'PU_4',
    claimSource: 'public',
    typeOfClaim: 'Area Correction, Owner Detail Correction',
    claimStatus: 'Pending',
    claimDate: '2026-07-04 11:44:03',
    redressalDate: 'Under Review',
    documents: []
  },
  {
    id: '6',
    sNo: 6,
    district: 'Pune',
    ulb: 'Pune',
    ward: 'Maharana pratap ward(43)',
    surveyUnit: 'Survey Unit 1(343671)',
    plotNo: '14',
    ticketId: 'PU_5',
    claimSource: 'public',
    typeOfClaim: 'Shape of Property Correction',
    claimStatus: 'Pending',
    claimDate: '2026-07-04 12:02:12',
    redressalDate: 'Under Review',
    documents: []
  }
];

// ----------------------------------------------------------------------------
// DATA STORE SINGLETON
// ----------------------------------------------------------------------------

class Surveyor3dStore {
  private parcels: LandParcel[] = [...MOCK_PARCELS];
  private buildings: BuildingRecord[] = [...MOCK_BUILDINGS];
  private floors: FloorRecord[] = [...MOCK_FLOORS];
  private units: UnitRecord[] = [...MOCK_UNITS];
  private spatialVolumes: SpatialVolumeRecord[] = [...MOCK_SPATIAL_VOLUMES];
  private gtPoints: GroundTruthPoint[] = [...MOCK_GT_POINTS];
  private rorPlots: RoRPlotRecord[] = [...MOCK_ROR_PLOTS];
  private publications: PublicationCardRecord[] = [...MOCK_PUBLICATIONS];
  private claims: ClaimRecord[] = [...MOCK_CLAIMS];

  getParcels(): LandParcel[] {
    return this.parcels;
  }

  getParcelById(parcelId: string): LandParcel | undefined {
    return this.parcels.find(p => p.parcelId.toLowerCase() === parcelId.toLowerCase() || p.ulpin === parcelId);
  }

  getBuildings(): BuildingRecord[] {
    return this.buildings;
  }

  getBuildingsByParcel(parcelId: string): BuildingRecord[] {
    return this.buildings.filter(b => b.parcelId === parcelId);
  }

  getFloorsByBuilding(buildingId: string): FloorRecord[] {
    return this.floors.filter(f => f.buildingId === buildingId);
  }

  getUnitsByFloor(floorId: string): UnitRecord[] {
    return this.units.filter(u => u.floorId === floorId);
  }

  getUnitsByBuilding(buildingId: string): UnitRecord[] {
    return this.units.filter(u => u.buildingId === buildingId);
  }

  getSpatialVolumeByUnit(unitId: string): SpatialVolumeRecord | undefined {
    return this.spatialVolumes.find(v => v.unitId === unitId);
  }

  getGtPoints(): GroundTruthPoint[] {
    return this.gtPoints;
  }

  addGtPoint(point: GroundTruthPoint) {
    this.gtPoints.push(point);
  }

  deleteGtPoint(seqNo: number) {
    this.gtPoints = this.gtPoints.filter(p => p.seqNo !== seqNo);
  }

  getRorPlots(): RoRPlotRecord[] {
    return this.rorPlots;
  }

  getPublications(): PublicationCardRecord[] {
    return this.publications;
  }

  getClaims(): ClaimRecord[] {
    return this.claims;
  }

  updateParcelVerification(parcelId: string, status: LandParcel['verificationStatus']) {
    const p = this.parcels.find(item => item.parcelId === parcelId);
    if (p) {
      p.verificationStatus = status;
    }
  }

  searchProperties(query: string, filters?: { ward?: string; status?: string }): LandParcel[] {
    const q = query.trim().toLowerCase();
    return this.parcels.filter(p => {
      const matchesQuery = !q || (
        p.ulpin.toLowerCase().includes(q) ||
        p.khasraNo.toLowerCase().includes(q) ||
        p.parcelId.toLowerCase().includes(q) ||
        p.plotNo.toLowerCase().includes(q) ||
        p.propertyType.toLowerCase().includes(q) ||
        p.ward.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );
      const matchesWard = !filters?.ward || filters.ward === 'all' || p.ward.includes(filters.ward);
      const matchesStatus = !filters?.status || filters.status === 'all' || p.verificationStatus === filters.status;
      return matchesQuery && matchesWard && matchesStatus;
    });
  }
}

export const surveyorStore = new Surveyor3dStore();

// Export standard arrays directly for ergonomic component consumption
export const landParcelsData: LandParcel[] = MOCK_PARCELS;
export const buildingsData: BuildingRecord[] = MOCK_BUILDINGS;
export const floorsData: FloorRecord[] = MOCK_FLOORS;
export const unitsData: UnitRecord[] = MOCK_UNITS;
export const spatialVolumesData: SpatialVolumeRecord[] = MOCK_SPATIAL_VOLUMES;
export const gtPointsData: GroundTruthPoint[] = MOCK_GT_POINTS;
export const rorPlotsData: RoRPlotRecord[] = MOCK_ROR_PLOTS;
export const publicationCardsData: PublicationCardRecord[] = MOCK_PUBLICATIONS;
export const claimsData: ClaimRecord[] = MOCK_CLAIMS;
export const verificationHistoryData: { action: string; date: string; surveyor: string; remarks: string }[] = [
  { action: 'Technical Photogrammetry Processing & Mesh Generation', date: '2025-11-15 11:30', surveyor: 'Survey of India Photogrammetry Team', remarks: 'Ortho-rectified mesh LoD 2.5 generated from 2.5cm GSD Nadir + 5-camera oblique imagery. ASPRS vertical accuracy ±0.04m.' },
  { action: 'Field Ground Truth GNSS Verification Completed', date: '2025-11-20 16:45', surveyor: 'Surveyor_Pune (MAP-2 Unit)', remarks: '4 Boundary control pegs verified with RTK DGPS. Parcel perimeter matched within 0.02m permissible tolerance.' },
  { action: 'Multi-Storey Floor & Unit Volumetric Registration', date: '2026-02-14 10:20', surveyor: 'Pune PMRDA Revenue Cell', remarks: '18 Units across 5 floors linked with Municipal Property Tax IDs and authenticated title deeds.' },
  { action: 'Provisional Urban Property Publication Notice Issued', date: '2026-07-22 14:00', surveyor: 'Competent Authority (Section 14)', remarks: 'Provisional publication card UPC123457 gazetted. 30-day objection window opened.' }
];
