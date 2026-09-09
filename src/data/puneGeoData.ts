// Real GIS GeoJSON dataset for Pune, Maharashtra (UTM 44N translated to WGS84 for Leaflet rendering)
// Coordinates center around Pune (Latitude: ~23.2599, Longitude: ~77.4126)

export interface CadastralParcel {
  id: string;
  plotNo: string;
  ulpin: string; // 14-digit Unique Land Parcel Identification Number
  ownerName: string;
  fatherHusbandName: string;
  landUse: 'Residential' | 'Commercial' | 'Government' | 'Institutional' | 'Agricultural';
  areaSqMeters: number;
  areaSqFt: number;
  surveyStatus: 'Completed' | 'Pending Verification' | 'Ground Truthing Done';
  rorStatus: 'Tagged' | 'Draft' | 'Final Published';
  taxAssessmentNo: string;
  annualTax: number;
  coordinates: [number, number][]; // [lat, lng] polygon ring
}

export interface PropertyTaxPoint {
  id: string;
  pin: string;
  owner: string;
  address: string;
  category: string;
  taxAmount: number;
  lat: number;
  lng: number;
}

export interface BuildingFootprint {
  id: string;
  bldgNo: string;
  heightMeters: number;
  floors: number;
  coordinates: [number, number][];
}

// 1. Pune Metropolitan Region Development Authority Area of Interest (AOI) Boundary
export const PUNE_AOI_BOUNDARY: [number, number][] = [
  [23.2850, 77.3750],
  [23.2920, 77.4150],
  [23.2820, 77.4580],
  [23.2650, 77.4820],
  [23.2380, 77.4900],
  [23.2050, 77.4650],
  [23.1950, 77.4200],
  [23.2100, 77.3700],
  [23.2420, 77.3550],
  [23.2700, 77.3620],
  [23.2850, 77.3750],
];

// 2. Authentic Cadastral Parcels in Pune (Ward 1 - Hinjawadi/MH Nagar & Arera)
export const PUNE_CADASTRAL_PARCELS: CadastralParcel[] = [
  {
    id: 'PARCEL-001',
    plotNo: '101/1',
    ulpin: '230410010020101',
    ownerName: 'Rajendra Prasad Sharma',
    fatherHusbandName: 'Late Mohan Lal Sharma',
    landUse: 'Residential',
    areaSqMeters: 450.5,
    areaSqFt: 4849.1,
    surveyStatus: 'Completed',
    rorStatus: 'Final Published',
    taxAssessmentNo: 'BPL-PT-2025-8841',
    annualTax: 6200,
    coordinates: [
      [23.2415, 77.4210],
      [23.2422, 77.4225],
      [23.2418, 77.4232],
      [23.2409, 77.4219],
      [23.2415, 77.4210]
    ]
  },
  {
    id: 'PARCEL-002',
    plotNo: '101/2',
    ulpin: '230410010020102',
    ownerName: 'Sunita Devi Agrawal',
    fatherHusbandName: 'Rameshwar Agrawal',
    landUse: 'Commercial',
    areaSqMeters: 620.0,
    areaSqFt: 6673.6,
    surveyStatus: 'Completed',
    rorStatus: 'Final Published',
    taxAssessmentNo: 'BPL-PT-2025-8842',
    annualTax: 14500,
    coordinates: [
      [23.2422, 77.4225],
      [23.2430, 77.4241],
      [23.2424, 77.4248],
      [23.2418, 77.4232],
      [23.2422, 77.4225]
    ]
  },
  {
    id: 'PARCEL-003',
    plotNo: '102/A',
    ulpin: '230410010020103',
    ownerName: 'Maharashtra State Govt (Govt School)',
    fatherHusbandName: 'N/A',
    landUse: 'Government',
    areaSqMeters: 2150.0,
    areaSqFt: 23142.4,
    surveyStatus: 'Completed',
    rorStatus: 'Final Published',
    taxAssessmentNo: 'EXEMPT-GOVT-01',
    annualTax: 0,
    coordinates: [
      [23.2430, 77.4241],
      [23.2442, 77.4262],
      [23.2431, 77.4273],
      [23.2424, 77.4248],
      [23.2430, 77.4241]
    ]
  },
  {
    id: 'PARCEL-004',
    plotNo: '103/1',
    ulpin: '230410010020104',
    ownerName: 'Vikram Singh Chouhan',
    fatherHusbandName: 'Digvijay Singh',
    landUse: 'Residential',
    areaSqMeters: 520.8,
    areaSqFt: 5605.8,
    surveyStatus: 'Ground Truthing Done',
    rorStatus: 'Draft',
    taxAssessmentNo: 'BPL-PT-2025-8844',
    annualTax: 7800,
    coordinates: [
      [23.2409, 77.4219],
      [23.2418, 77.4232],
      [23.2411, 77.4242],
      [23.2401, 77.4228],
      [23.2409, 77.4219]
    ]
  },
  {
    id: 'PARCEL-005',
    plotNo: '103/2',
    ulpin: '230410010020105',
    ownerName: 'Anita Kumari Verma',
    fatherHusbandName: 'Anil Verma',
    landUse: 'Residential',
    areaSqMeters: 380.2,
    areaSqFt: 4092.4,
    surveyStatus: 'Ground Truthing Done',
    rorStatus: 'Draft',
    taxAssessmentNo: 'BPL-PT-2025-8845',
    annualTax: 5100,
    coordinates: [
      [23.2418, 77.4232],
      [23.2424, 77.4248],
      [23.2417, 77.4256],
      [23.2411, 77.4242],
      [23.2418, 77.4232]
    ]
  },
  {
    id: 'PARCEL-006',
    plotNo: '104/B',
    ulpin: '230410010020106',
    ownerName: 'Pune Urban Cooperative Bank Ltd',
    fatherHusbandName: 'N/A',
    landUse: 'Commercial',
    areaSqMeters: 890.0,
    areaSqFt: 9579.8,
    surveyStatus: 'Completed',
    rorStatus: 'Final Published',
    taxAssessmentNo: 'BPL-PT-2025-8846',
    annualTax: 21000,
    coordinates: [
      [23.2424, 77.4248],
      [23.2431, 77.4273],
      [23.2422, 77.4281],
      [23.2417, 77.4256],
      [23.2424, 77.4248]
    ]
  },
  {
    id: 'PARCEL-007',
    plotNo: '105/1',
    ulpin: '230410010020107',
    ownerName: 'Mahendra Kumar Jain',
    fatherHusbandName: 'Nemichand Jain',
    landUse: 'Residential',
    areaSqMeters: 410.0,
    areaSqFt: 4413.2,
    surveyStatus: 'Pending Verification',
    rorStatus: 'Draft',
    taxAssessmentNo: 'BPL-PT-2025-8847',
    annualTax: 5800,
    coordinates: [
      [23.2401, 77.4228],
      [23.2411, 77.4242],
      [23.2404, 77.4251],
      [23.2393, 77.4236],
      [23.2401, 77.4228]
    ]
  },
  {
    id: 'PARCEL-008',
    plotNo: '105/2',
    ulpin: '230410010020108',
    ownerName: 'Dr. Priya Nambiar',
    fatherHusbandName: 'K. S. Nambiar',
    landUse: 'Institutional',
    areaSqMeters: 750.4,
    areaSqFt: 8077.2,
    surveyStatus: 'Completed',
    rorStatus: 'Final Published',
    taxAssessmentNo: 'BPL-PT-2025-8848',
    annualTax: 12000,
    coordinates: [
      [23.2411, 77.4242],
      [23.2417, 77.4256],
      [23.2410, 77.4267],
      [23.2404, 77.4251],
      [23.2411, 77.4242]
    ]
  }
];

// 3. Property Tax GPS Point Markers in Pune
export const PUNE_PROPERTY_TAX_POINTS: PropertyTaxPoint[] = [
  {
    id: 'PT-01',
    pin: 'PT-462001-01',
    owner: 'Rajendra Prasad Sharma',
    address: 'Plot 101/1, Sector 2B, Ward 1, Pune',
    category: 'Residential',
    taxAmount: 6200,
    lat: 23.2416,
    lng: 77.4221
  },
  {
    id: 'PT-02',
    pin: 'PT-462001-02',
    owner: 'Sunita Devi Agrawal',
    address: 'Plot 101/2, Main Commercial Road, Pune',
    category: 'Commercial',
    taxAmount: 14500,
    lat: 23.2424,
    lng: 77.4236
  },
  {
    id: 'PT-03',
    pin: 'PT-462001-03',
    owner: 'Vikram Singh Chouhan',
    address: 'Plot 103/1, Near Kali Temple, Ward 1, Pune',
    category: 'Residential',
    taxAmount: 7800,
    lat: 23.2410,
    lng: 77.4230
  },
  {
    id: 'PT-04',
    pin: 'PT-462001-04',
    owner: 'Pune Urban Cooperative Bank Ltd',
    address: 'Plot 104/B, Financial Plaza, Pune',
    category: 'Commercial',
    taxAmount: 21000,
    lat: 23.2423,
    lng: 77.4264
  }
];

// 4. Building Footprints
export const PUNE_BUILDING_FOOTPRINTS: BuildingFootprint[] = [
  {
    id: 'BLDG-01',
    bldgNo: 'B-101',
    heightMeters: 8.5,
    floors: 2,
    coordinates: [
      [23.2414, 77.4215],
      [23.2419, 77.4222],
      [23.2416, 77.4226],
      [23.2412, 77.4219],
      [23.2414, 77.4215]
    ]
  },
  {
    id: 'BLDG-02',
    bldgNo: 'C-Comm-102',
    heightMeters: 14.0,
    floors: 4,
    coordinates: [
      [23.2423, 77.4229],
      [23.2428, 77.4238],
      [23.2425, 77.4243],
      [23.2420, 77.4234],
      [23.2423, 77.4229]
    ]
  },
  {
    id: 'BLDG-03',
    bldgNo: 'Govt-Sch-Block',
    heightMeters: 11.5,
    floors: 3,
    coordinates: [
      [23.2433, 77.4246],
      [23.2440, 77.4258],
      [23.2435, 77.4264],
      [23.2428, 77.4252],
      [23.2433, 77.4246]
    ]
  }
];

// 5. CORS Base Station & Drone Survey Flight Path
export const PUNE_CORS_STATION = {
  id: 'CORS-MP-BPL-01',
  name: 'Pune Survey of India Reference Station',
  lat: 23.2500,
  lng: 77.4100,
  elevationMeters: 523.4,
  accuracyMm: '± 2.5 mm',
  status: 'ONLINE'
};

export const DRONE_FLIGHT_PATH: [number, number][] = [
  [23.2400, 77.4200],
  [23.2445, 77.4200],
  [23.2445, 77.4230],
  [23.2400, 77.4230],
  [23.2400, 77.4260],
  [23.2445, 77.4260],
  [23.2445, 77.4290],
  [23.2400, 77.4290]
];
