export interface PropertyUnit {
  id: string; // e.g. "U-G01"
  compositeId: string; // e.g. "25094601101001-B001-FG-U01"
  unitNumber: string; // "Shop 01" or "Flat 301"
  floorLevel: number; // 0 for Ground, 1 for 1st, etc.
  floorName: string; // "Ground Floor", "Floor 1", etc.
  useType: 'Commercial' | 'Residential' | 'Mixed' | 'Utility';
  carpetAreaSqm: number;
  carpetAreaSqft: number;
  ownerName: string;
  fatherHusbandName: string;
  citizenAadhaarMasked: string;
  propertyTaxAssessmentNo: string;
  annualTaxInr: number;
  taxPaymentStatus: 'Paid' | 'Pending' | 'Exempt';
  verificationStatus: 'Verified' | 'Mismatch' | 'Unregistered';
  statusNote?: string;
  colorHex: string;
}

export interface BuildingFloor {
  floorLevel: number;
  floorName: string;
  elevationMeters: number;
  heightMeters: number;
  totalUnits: number;
  builtUpAreaSqm: number;
  units: PropertyUnit[];
  hasAnomaly: boolean;
  anomalyDescription?: string;
}

export interface Building3DModel {
  id: string;
  buildingCode: string; // B001
  buildingName: string;
  officialUlpin: string; // 14-char anchor
  parcelNo: string; // 101/1
  district: string; // Pune
  ulb: string; // Pune Municipal Corporation (BMC - 250946)
  ward: string; // Ward 1 - Manakna
  locality: string; // Arera Hills / Commercial Hub
  coordinates: [number, number]; // [lat, lng]
  footprintAreaSqm: number;
  totalFloors: number;
  totalHeightMeters: number;
  constructionYear: number;
  structuralType: 'RCC Frame' | 'Load Bearing' | 'Steel Composite';
  droneSurveyDate: string;
  droneResolutionGsd: string;
  floors: BuildingFloor[];
  overallStatus: 'Verified' | 'Needs Field Verification' | 'Anomaly Detected' | 'Ready for ULB Review' | 'Forwarded to District';
  reviewCandidatesCount: number;
}

export interface VerificationAnomaly {
  id: string;
  ulpin: string;
  buildingName: string;
  floorName: string;
  unitRef: string;
  anomalyType:
    | 'Unregistered Vertical Expansion'
    | 'Area Mismatch (>15%)'
    | 'Commercial Use in Residential Zone'
    | 'Spatial Footprint Deviation';
  confidenceScore: number; // 0.94 = 94%
  detectedEvidence: string;
  connectedRegistryRecord: string;
  recommendedAction: string;
  status: 'Open' | 'Field Dispatched' | 'Resolved' | 'Rejected';
  fieldRemarks?: string;
  assignedOfficer: string;
  flaggedDate: string;
}

export interface UlbPublicationRecord {
  id: string;
  sNo: number;
  ulpin: string;
  buildingName: string;
  ward: string;
  totalFloors: number;
  totalUnits: number;
  verifiedUnits: number;
  unregisteredUnits: number;
  ulbStatus:
    | 'Draft / In Verification'
    | 'Needs Field Verification'
    | 'Ready for ULB Review'
    | 'Forwarded to District'
    | 'Rejected by District'
    | 'Final Published';
  forwardedDate?: string;
  rejectionRemarks?: string;
  collectorActionDate?: string;
}

export const SAMPLE_BUILDINGS: Building3DModel[] = [
  {
    id: 'bldg-pune-001',
    buildingCode: 'B001',
    buildingName: 'Mansarovar Commercial Complex & Residences',
    officialUlpin: '25094601101001',
    parcelNo: '101/1',
    district: 'Pune',
    ulb: 'Pune Metropolitan Region Development Authority (270410)',
    ward: 'Ward 1 - Manakna',
    locality: 'Plot 101/1, Hinjawadi Phase 1, Pune',
    coordinates: [23.2385, 77.4245],
    footprintAreaSqm: 540.8,
    totalFloors: 4,
    totalHeightMeters: 14.5,
    constructionYear: 2021,
    structuralType: 'RCC Frame',
    droneSurveyDate: '15-01-2025',
    droneResolutionGsd: '0.045m',
    overallStatus: 'Anomaly Detected',
    reviewCandidatesCount: 2,
    floors: [
      {
        floorLevel: 0,
        floorName: 'Ground Floor',
        elevationMeters: 0,
        heightMeters: 3.8,
        totalUnits: 3,
        builtUpAreaSqm: 490,
        hasAnomaly: false,
        units: [
          {
            id: 'U-G01',
            compositeId: '25094601101001-B001-FG-U01',
            unitNumber: 'Shop G-01 (Apex Diagnostic)',
            floorLevel: 0,
            floorName: 'Ground Floor',
            useType: 'Commercial',
            carpetAreaSqm: 142.5,
            carpetAreaSqft: 1533,
            ownerName: 'Sunita Sharma',
            fatherHusbandName: 'Rajesh Sharma',
            citizenAadhaarMasked: 'XXXX-XXXX-8921',
            propertyTaxAssessmentNo: 'PMC-TX-2024-8841',
            annualTaxInr: 28400,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          },
          {
            id: 'U-G02',
            compositeId: '25094601101001-B001-FG-U02',
            unitNumber: 'Shop G-02 (Central Bank ATM)',
            floorLevel: 0,
            floorName: 'Ground Floor',
            useType: 'Commercial',
            carpetAreaSqm: 95.0,
            carpetAreaSqft: 1022,
            ownerName: 'Vijay Kumar Verma',
            fatherHusbandName: 'M. P. Verma',
            citizenAadhaarMasked: 'XXXX-XXXX-3341',
            propertyTaxAssessmentNo: 'PMC-TX-2024-8842',
            annualTaxInr: 19800,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          },
          {
            id: 'U-G03',
            compositeId: '25094601101001-B001-FG-U03',
            unitNumber: 'Common Lobby & Service Staging',
            floorLevel: 0,
            floorName: 'Ground Floor',
            useType: 'Utility',
            carpetAreaSqm: 180.0,
            carpetAreaSqft: 1937,
            ownerName: 'Mansarovar Society RWA',
            fatherHusbandName: 'N/A',
            citizenAadhaarMasked: 'N/A',
            propertyTaxAssessmentNo: 'PMC-TX-2024-8843',
            annualTaxInr: 0,
            taxPaymentStatus: 'Exempt',
            verificationStatus: 'Verified',
            colorHex: '#64748b'
          }
        ]
      },
      {
        floorLevel: 1,
        floorName: 'Floor 1',
        elevationMeters: 3.8,
        heightMeters: 3.2,
        totalUnits: 2,
        builtUpAreaSqm: 490,
        hasAnomaly: false,
        units: [
          {
            id: 'U-101',
            compositeId: '25094601101001-B001-F1-U101',
            unitNumber: 'Office 101 (MP Tech Consultancy)',
            floorLevel: 1,
            floorName: 'Floor 1',
            useType: 'Commercial',
            carpetAreaSqm: 210.0,
            carpetAreaSqft: 2260,
            ownerName: 'Amit Saxena',
            fatherHusbandName: 'L. N. Saxena',
            citizenAadhaarMasked: 'XXXX-XXXX-4512',
            propertyTaxAssessmentNo: 'PMC-TX-2024-8844',
            annualTaxInr: 34500,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          },
          {
            id: 'U-102',
            compositeId: '25094601101001-B001-F1-U102',
            unitNumber: 'Office 102 (Shri Ganesh Logistics)',
            floorLevel: 1,
            floorName: 'Floor 1',
            useType: 'Commercial',
            carpetAreaSqm: 195.0,
            carpetAreaSqft: 2098,
            ownerName: 'Rameshwar Patidar',
            fatherHusbandName: 'G. K. Patidar',
            citizenAadhaarMasked: 'XXXX-XXXX-6701',
            propertyTaxAssessmentNo: 'PMC-TX-2024-8845',
            annualTaxInr: 31200,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          }
        ]
      },
      {
        floorLevel: 2,
        floorName: 'Floor 2',
        elevationMeters: 7.0,
        heightMeters: 3.2,
        totalUnits: 2,
        builtUpAreaSqm: 490,
        hasAnomaly: true,
        anomalyDescription: 'Floor area expansion exceeds sanctioned plan by 22%',
        units: [
          {
            id: 'U-201',
            compositeId: '25094601101001-B001-F2-U201',
            unitNumber: 'Apartment 201 (3BHK Residential)',
            floorLevel: 2,
            floorName: 'Floor 2',
            useType: 'Residential',
            carpetAreaSqm: 185.0,
            carpetAreaSqft: 1991,
            ownerName: 'Priya Joshi',
            fatherHusbandName: 'Sanjay Joshi',
            citizenAadhaarMasked: 'XXXX-XXXX-1934',
            propertyTaxAssessmentNo: 'PMC-TX-2024-8846',
            annualTaxInr: 14200,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          },
          {
            id: 'U-202',
            compositeId: '25094601101001-B001-F2-U202',
            unitNumber: 'Apartment 202 (Balcony Extension)',
            floorLevel: 2,
            floorName: 'Floor 2',
            useType: 'Residential',
            carpetAreaSqm: 230.0,
            carpetAreaSqft: 2475,
            ownerName: 'Anand Chouhan',
            fatherHusbandName: 'B. S. Chouhan',
            citizenAadhaarMasked: 'XXXX-XXXX-7729',
            propertyTaxAssessmentNo: 'PMC-TX-2024-8847',
            annualTaxInr: 12000,
            taxPaymentStatus: 'Pending',
            verificationStatus: 'Mismatch',
            statusNote: 'Detected 45 sqm balcony enclosed without building permission',
            colorHex: '#f59e0b'
          }
        ]
      },
      {
        floorLevel: 3,
        floorName: 'Floor 3 (Rooftop Penthouse)',
        elevationMeters: 10.2,
        heightMeters: 3.5,
        totalUnits: 1,
        builtUpAreaSqm: 380,
        hasAnomaly: true,
        anomalyDescription: 'No matching registration record found in the connected dataset (Unregistered Vertical Construction)',
        units: [
          {
            id: 'U-301',
            compositeId: '25094601101001-B001-F3-U301',
            unitNumber: 'Penthouse Unit 301',
            floorLevel: 3,
            floorName: 'Floor 3 (Rooftop Penthouse)',
            useType: 'Residential',
            carpetAreaSqm: 290.0,
            carpetAreaSqft: 3121,
            ownerName: 'Occupant Unknown (Under ULB Review)',
            fatherHusbandName: 'N/A',
            citizenAadhaarMasked: 'Unverified',
            propertyTaxAssessmentNo: 'UNREGISTERED',
            annualTaxInr: 0,
            taxPaymentStatus: 'Pending',
            verificationStatus: 'Unregistered',
            statusNote: 'No matching registration record found in the connected dataset.',
            colorHex: '#ef4444'
          }
        ]
      }
    ]
  },
  {
    id: 'bldg-pune-002',
    buildingCode: 'B002',
    buildingName: 'Arera Heights Tower A',
    officialUlpin: '25094601101002',
    parcelNo: '101/2',
    district: 'Pune',
    ulb: 'Pune Metropolitan Region Development Authority (270410)',
    ward: 'Ward 1 - Manakna',
    locality: 'Sector 2B, Rajiv Gandhi Infotech Park, Hinjawadi',
    coordinates: [23.2392, 77.426],
    footprintAreaSqm: 420.0,
    totalFloors: 3,
    totalHeightMeters: 10.5,
    constructionYear: 2022,
    structuralType: 'RCC Frame',
    droneSurveyDate: '15-01-2025',
    droneResolutionGsd: '0.045m',
    overallStatus: 'Ready for ULB Review',
    reviewCandidatesCount: 0,
    floors: [
      {
        floorLevel: 0,
        floorName: 'Ground Floor',
        elevationMeters: 0,
        heightMeters: 3.5,
        totalUnits: 2,
        builtUpAreaSqm: 380,
        hasAnomaly: false,
        units: [
          {
            id: 'U-A01',
            compositeId: '25094601101002-B002-FG-A01',
            unitNumber: 'Flat G-1',
            floorLevel: 0,
            floorName: 'Ground Floor',
            useType: 'Residential',
            carpetAreaSqm: 160.0,
            carpetAreaSqft: 1722,
            ownerName: 'Deepak Tiwari',
            fatherHusbandName: 'H. P. Tiwari',
            citizenAadhaarMasked: 'XXXX-XXXX-9102',
            propertyTaxAssessmentNo: 'PMC-TX-2024-9102',
            annualTaxInr: 11500,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          },
          {
            id: 'U-A02',
            compositeId: '25094601101002-B002-FG-A02',
            unitNumber: 'Flat G-2',
            floorLevel: 0,
            floorName: 'Ground Floor',
            useType: 'Residential',
            carpetAreaSqm: 160.0,
            carpetAreaSqft: 1722,
            ownerName: 'Manish Dubey',
            fatherHusbandName: 'S. K. Dubey',
            citizenAadhaarMasked: 'XXXX-XXXX-6612',
            propertyTaxAssessmentNo: 'PMC-TX-2024-9103',
            annualTaxInr: 11500,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          }
        ]
      },
      {
        floorLevel: 1,
        floorName: 'Floor 1',
        elevationMeters: 3.5,
        heightMeters: 3.5,
        totalUnits: 2,
        builtUpAreaSqm: 380,
        hasAnomaly: false,
        units: [
          {
            id: 'U-A11',
            compositeId: '25094601101002-B002-F1-A11',
            unitNumber: 'Flat 101',
            floorLevel: 1,
            floorName: 'Floor 1',
            useType: 'Residential',
            carpetAreaSqm: 165.0,
            carpetAreaSqft: 1776,
            ownerName: 'Kiran Patel',
            fatherHusbandName: 'V. Patel',
            citizenAadhaarMasked: 'XXXX-XXXX-5541',
            propertyTaxAssessmentNo: 'PMC-TX-2024-9104',
            annualTaxInr: 11800,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          },
          {
            id: 'U-A12',
            compositeId: '25094601101002-B002-F1-A12',
            unitNumber: 'Flat 102',
            floorLevel: 1,
            floorName: 'Floor 1',
            useType: 'Residential',
            carpetAreaSqm: 165.0,
            carpetAreaSqft: 1776,
            ownerName: 'Nitin Gaur',
            fatherHusbandName: 'R. K. Gaur',
            citizenAadhaarMasked: 'XXXX-XXXX-8822',
            propertyTaxAssessmentNo: 'PMC-TX-2024-9105',
            annualTaxInr: 11800,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          }
        ]
      },
      {
        floorLevel: 2,
        floorName: 'Floor 2',
        elevationMeters: 7.0,
        heightMeters: 3.5,
        totalUnits: 2,
        builtUpAreaSqm: 380,
        hasAnomaly: false,
        units: [
          {
            id: 'U-A21',
            compositeId: '25094601101002-B002-F2-A21',
            unitNumber: 'Flat 201',
            floorLevel: 2,
            floorName: 'Floor 2',
            useType: 'Residential',
            carpetAreaSqm: 165.0,
            carpetAreaSqft: 1776,
            ownerName: 'Sanjay Malviya',
            fatherHusbandName: 'P. Malviya',
            citizenAadhaarMasked: 'XXXX-XXXX-4419',
            propertyTaxAssessmentNo: 'PMC-TX-2024-9106',
            annualTaxInr: 11800,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          },
          {
            id: 'U-A22',
            compositeId: '25094601101002-B002-F2-A22',
            unitNumber: 'Flat 202',
            floorLevel: 2,
            floorName: 'Floor 2',
            useType: 'Residential',
            carpetAreaSqm: 165.0,
            carpetAreaSqft: 1776,
            ownerName: 'Rahul Agrawal',
            fatherHusbandName: 'D. Agrawal',
            citizenAadhaarMasked: 'XXXX-XXXX-3310',
            propertyTaxAssessmentNo: 'PMC-TX-2024-9107',
            annualTaxInr: 11800,
            taxPaymentStatus: 'Paid',
            verificationStatus: 'Verified',
            colorHex: '#10b981'
          }
        ]
      }
    ]
  }
];

export const INITIAL_ANOMALIES: VerificationAnomaly[] = [
  {
    id: 'anom-001',
    ulpin: '25094601101001',
    buildingName: 'Mansarovar Commercial Complex',
    floorName: 'Floor 3 (Rooftop Penthouse)',
    unitRef: '25094601101001-B001-F3-U301',
    anomalyType: 'Unregistered Vertical Expansion',
    confidenceScore: 0.96,
    detectedEvidence: 'Drone ORI photogrammetry identified 3.5m vertical floor height and 380 sqm built footprint; 0 municipal tax records found.',
    connectedRegistryRecord: 'Sanctioned plan allows Ground + 2 floors only. Floor 3 is unrecorded.',
    recommendedAction: 'Dispatch field survey officer with GNSS RTK rover to verify structural occupancy.',
    status: 'Open',
    assignedOfficer: 'Field Surveyor Amit Verma (BMC)',
    flaggedDate: '18-01-2025'
  },
  {
    id: 'anom-002',
    ulpin: '25094601101001',
    buildingName: 'Mansarovar Commercial Complex',
    floorName: 'Floor 2',
    unitRef: '25094601101001-B001-F2-U202',
    anomalyType: 'Area Mismatch (>15%)',
    confidenceScore: 0.88,
    detectedEvidence: 'Surveyed built-up area is 230 sqm vs municipal assessment of 185 sqm (+24.3% variance).',
    connectedRegistryRecord: 'Property Tax ID: PMC-TX-2024-8847 assessed for 185 sqm.',
    recommendedAction: 'Issue tax assessment revision notice & link updated carpet volume.',
    status: 'Open',
    assignedOfficer: 'Revenue Inspector S. K. Sen',
    flaggedDate: '22-01-2025'
  },
  {
    id: 'anom-003',
    ulpin: '25094601102001',
    buildingName: 'Residency Plaza Block C',
    floorName: 'Ground Floor',
    unitRef: '25094601102001-B001-FG-U01',
    anomalyType: 'Commercial Use in Residential Zone',
    confidenceScore: 0.91,
    detectedEvidence: 'Field photo OCR detected commercial pharmacy signboard "MedPlus" in residential cadastral plot.',
    connectedRegistryRecord: 'Master Plan Land Use: Low Density Residential (LDR).',
    recommendedAction: 'Apply commercial conversion surcharge in property tax assessment.',
    status: 'Field Dispatched',
    fieldRemarks: 'Notice served to shopkeeper on 04-02-2025; compounding application under review.',
    assignedOfficer: 'Zonal Officer Priya Nambiar',
    flaggedDate: '02-02-2025'
  }
];

export const INITIAL_ULB_PUBLICATIONS: UlbPublicationRecord[] = [
  {
    id: 'ulb-pub-001',
    sNo: 1,
    ulpin: '25094601101001',
    buildingName: 'Mansarovar Commercial Complex',
    ward: 'Ward 1 - Manakna',
    totalFloors: 4,
    totalUnits: 8,
    verifiedUnits: 6,
    unregisteredUnits: 2,
    ulbStatus: 'Needs Field Verification',
    forwardedDate: undefined
  },
  {
    id: 'ulb-pub-002',
    sNo: 2,
    ulpin: '25094601101002',
    buildingName: 'Arera Heights Tower A',
    ward: 'Ward 1 - Manakna',
    totalFloors: 3,
    totalUnits: 6,
    verifiedUnits: 6,
    unregisteredUnits: 0,
    ulbStatus: 'Ready for ULB Review'
  },
  {
    id: 'ulb-pub-003',
    sNo: 3,
    ulpin: '25094601101003',
    buildingName: 'Shalimar Park View Block B',
    ward: 'Ward 1 - Manakna',
    totalFloors: 5,
    totalUnits: 10,
    verifiedUnits: 10,
    unregisteredUnits: 0,
    ulbStatus: 'Forwarded to District',
    forwardedDate: '12-02-2025'
  },
  {
    id: 'ulb-pub-004',
    sNo: 4,
    ulpin: '25094601102004',
    buildingName: 'Narmada Commercial Arcade',
    ward: 'Ward 2 - Jahangirabad',
    totalFloors: 4,
    totalUnits: 12,
    verifiedUnits: 11,
    unregisteredUnits: 1,
    ulbStatus: 'Rejected by District',
    rejectionRemarks: 'Discrepancy in Floor 2 boundary polygon vs RoR share. Reverification required with Tehsildar remarks.'
  }
];
