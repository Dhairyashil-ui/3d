// NAKSHA V2.0 — Authoritative Administrative Jurisdiction Framework
// State: Maharashtra (27) • District: Pune (2704)
// Planning Authority: Pune Metropolitan Region Development Authority (PMRDA - 270410)
// Assigned Village: Hinjawadi (411057) • Assigned Survey Unit: Survey Unit 01 (348671)

export interface JurisdictionLevel {
  id: string;
  name: string;
  code: string;
}

export interface SurveyUnitInfo extends JurisdictionLevel {
  ulbId: string;
  villageId: string;
  assignedSurveyor: string;
  isAssignedToCurrentUser: boolean;
  totalParcels: number;
  totalBuildings: number;
  status: 'Approved' | 'In Survey' | 'Pending Verification';
  approvalDate: string;
  droneResolution: string;
  mapStatus: 'Approved' | 'Pending' | 'Rejected';
  imageStatus: 'Approved' | 'Pending' | 'Rejected';
  remarks: string;
}

export interface VillageInfo extends JurisdictionLevel {
  ulbId: string;
  pincode: string;
  surveyUnits: SurveyUnitInfo[];
}

export interface UlbInfo extends JurisdictionLevel {
  districtId: string;
  fullName: string;
  villages: VillageInfo[];
}

export interface DistrictInfo extends JurisdictionLevel {
  stateId: string;
  ulbs: UlbInfo[];
}

export interface StateInfo extends JurisdictionLevel {
  districts: DistrictInfo[];
}

// -----------------------------------------------------------------------------
// HIERARCHICAL JURISDICTION DATA
// -----------------------------------------------------------------------------

export const NAKSHA_JURISDICTION_HIERARCHY: StateInfo[] = [
  {
    id: 'MH',
    name: 'Maharashtra',
    code: '27',
    districts: [
      {
        id: 'PUNE',
        name: 'Pune',
        code: '2704',
        stateId: 'MH',
        ulbs: [
          {
            id: 'ULB-PMRDA-270410',
            name: 'PMRDA Pune - 270410',
            fullName: 'Pune Metropolitan Region Development Authority',
            code: '270410',
            districtId: 'PUNE',
            villages: [
              {
                id: 'VIL-HINJAWADI',
                name: 'Hinjawadi Village (411057)',
                code: 'HINJ-411057',
                ulbId: 'ULB-PMRDA-270410',
                pincode: '411057',
                surveyUnits: [
                  {
                    id: 'SU-348671',
                    name: 'Survey Unit 01 - 348671 (Hinjawadi Phase 1 / I²IT & Tech Zone)',
                    code: '348671',
                    ulbId: 'ULB-PMRDA-270410',
                    villageId: 'VIL-HINJAWADI',
                    assignedSurveyor: 'Surveyor Pune (Hinjawadi IT Park)',
                    isAssignedToCurrentUser: true,
                    totalParcels: 46,
                    totalBuildings: 317,
                    status: 'Approved',
                    approvalDate: '20 08 2026 11:30 AM',
                    droneResolution: '0.035m (3.5 cm / pixel)',
                    mapStatus: 'Approved',
                    imageStatus: 'Approved',
                    remarks: 'Approved (Remark: Verified by PMRDA DGPS RTK & Drone LiDAR)'
                  },
                  {
                    id: 'SU-348672',
                    name: 'Survey Unit 02 - 348672 (Blue Ridge & Riverfront Zone)',
                    code: '348672',
                    ulbId: 'ULB-PMRDA-270410',
                    villageId: 'VIL-HINJAWADI',
                    assignedSurveyor: 'Surveyor Field Team B',
                    isAssignedToCurrentUser: false,
                    totalParcels: 28,
                    totalBuildings: 85,
                    status: 'In Survey',
                    approvalDate: 'Pending',
                    droneResolution: '0.05m',
                    mapStatus: 'Pending',
                    imageStatus: 'Pending',
                    remarks: 'Ground Survey in Progress'
                  },
                  {
                    id: 'SU-348673',
                    name: 'Survey Unit 03 - 348673 (Hinjawadi Gaothan Core & Wipro Circle)',
                    code: '348673',
                    ulbId: 'ULB-PMRDA-270410',
                    villageId: 'VIL-HINJAWADI',
                    assignedSurveyor: 'Surveyor Field Team C',
                    isAssignedToCurrentUser: false,
                    totalParcels: 64,
                    totalBuildings: 142,
                    status: 'Pending Verification',
                    approvalDate: 'Pending',
                    droneResolution: '0.04m',
                    mapStatus: 'Pending',
                    imageStatus: 'Pending',
                    remarks: 'Drone Imagery Uploaded'
                  },
                  {
                    id: 'SU-348674',
                    name: 'Survey Unit 04 - 348674 (Tech Vista & Phase 1 East)',
                    code: '348674',
                    ulbId: 'ULB-PMRDA-270410',
                    villageId: 'VIL-HINJAWADI',
                    assignedSurveyor: 'Surveyor Field Team D',
                    isAssignedToCurrentUser: false,
                    totalParcels: 38,
                    totalBuildings: 96,
                    status: 'In Survey',
                    approvalDate: 'Pending',
                    droneResolution: '0.035m',
                    mapStatus: 'Pending',
                    imageStatus: 'Pending',
                    remarks: 'DGPS Network Calibration'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// Current Logged-in Surveyor Default Assignment
export const CURRENT_SURVEYOR_DEFAULT = {
  state: 'Maharashtra',
  district: 'Pune',
  ulb: 'PMRDA Pune - 270410',
  wardVillage: 'Hinjawadi Village (411057)',
  surveyUnit: 'Survey Unit 01 - 348671 (Hinjawadi Phase 1 / I²IT & Tech Zone)',
  surveyUnitCode: '348671',
  surveyorName: 'Surveyor Pune (Hinjawadi IT Park)',
  assignedZoneName: 'Hinjawadi Phase 1 Special Planning Unit (I²IT Campus Anchor)'
};

// -----------------------------------------------------------------------------
// REAL GEOMETRIC BOUNDARIES (EPSG:4326 GeoJSON standard [lng, lat])
// -----------------------------------------------------------------------------

/**
 * 1. Urban Local Body (ULB) Boundary
 * Pune Metropolitan Region Development Authority (PMRDA) - Hinjawadi Planning Sector
 */
export const ULB_PMRDA_HINJAWADI_BOUNDARY = {
  type: 'Polygon' as const,
  name: 'Urban Local Body (ULB): PMRDA Hinjawadi Sector (270410)',
  code: '270410',
  color: '#f97316', // Vibrant Amber/Orange dashed
  coordinates: [
    [
      [73.7220, 18.5750],
      [73.7380, 18.5720],
      [73.7540, 18.5760],
      [73.7580, 18.5880],
      [73.7520, 18.5970],
      [73.7360, 18.5980],
      [73.7240, 18.5920],
      [73.7200, 18.5820],
      [73.7220, 18.5750]
    ]
  ]
};

/**
 * 2. Village Area Boundary
 * Hinjawadi Revenue Village Boundary (Mulshi Taluka, Pune, 411057)
 */
export const VILLAGE_HINJAWADI_BOUNDARY = {
  type: 'Polygon' as const,
  name: 'Village Area Boundary: Hinjawadi Revenue Village (411057)',
  code: 'HINJ-411057',
  color: '#a855f7', // Regal Purple dashed
  coordinates: [
    [
      [73.7285, 18.5785],
      [73.7375, 18.5770],
      [73.7485, 18.5805],
      [73.7470, 18.5915],
      [73.7385, 18.5935],
      [73.7305, 18.5900],
      [73.7270, 18.5835],
      [73.7285, 18.5785]
    ]
  ]
};

/**
 * 3. Assigned Survey Unit Boundary
 * Survey Unit 01 (348671) — Assigned strictly to Surveyor Pune
 * Covers Hinjawadi Phase 1 / Rajiv Gandhi Infotech Park & I²IT Campus Zone
 */
export const SURVEY_UNIT_01_BOUNDARY = {
  type: 'Polygon' as const,
  name: 'Assigned Survey Unit: SU-01 (348671) • Surveyor Pune',
  code: '348671',
  color: '#0284c7', // Radiant Solid Cyan/Blue
  fillColor: '#0284c7',
  coordinates: [
    [
      [73.7328, 18.5812],
      [73.7355, 18.5805],
      [73.7392, 18.5808],
      [73.7428, 18.5822],
      [73.7435, 18.5855],
      [73.7420, 18.5888],
      [73.7385, 18.5898],
      [73.7345, 18.5892],
      [73.7325, 18.5858],
      [73.7328, 18.5812]
    ]
  ]
};
