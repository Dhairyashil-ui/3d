// NAKSHA V2.0 — Authoritative Hinjawadi Phase 1 ULB Unit Area & Building AOI Dataset
// Administrative Jurisdiction: Pune Metropolitan Region Development Authority (PMRDA)
// Special Planning Area: Rajiv Gandhi Infotech Park Phase 1, Hinjawadi, Pune, Maharashtra
// EPSG:4326 (WGS84) / UTM Zone 43N • Elevation Datum: 568.2m MSL

export interface HinjawadiAoiPolygon {
  type: 'Polygon';
  coordinates: [number, number][][]; // [lng, lat]
}

export interface HinjawadiUlbUnitInfo {
  unitCode: string;
  unitName: string;
  authorityName: string;
  district: string;
  taluka: string;
  state: string;
  postalPincode: string;
  totalAoiAreaSqKm: number;
  totalAoiAreaHectares: number;
  perimeterKm: number;
  totalBuildingsCount: number;
  totalParcelsCount: number;
  totalBuiltUpAreaSqm: number;
  totalAnnualPropertyTaxInr: number;
  surveyDatum: string;
  droneResolutionGsd: string;
  droneLidarSensor: string;
  surveyDate: string;
  centerCoordinates: {
    lng: number;
    lat: number;
    height: number;
    heading: number;
    pitch: number;
  };
  boundaryBeacons: Array<{
    beaconId: string;
    description: string;
    lng: number;
    lat: number;
    elevationM: number;
  }>;
}

export interface HinjawadiBuilding {
  buildingId: string;
  buildingName: string;
  buildingCategory: 'IT & Tech Park' | 'Educational Institution' | 'Commercial & Hospitality' | 'Residential High-Rise' | 'Civic & Emergency';
  buildingType: string;
  parcelId: string;
  ulpin: string;
  totalFloors: number;
  approxHeightM: number;
  floorHeightM: number;
  footprintAreaSqm: number;
  builtUpAreaSqm: number;
  roofType: string;
  structuralType: string;
  geometry: HinjawadiAoiPolygon;
  center: [number, number]; // [lng, lat]
  confidencePct: number;
  verificationStatus: 'Verified' | 'Pending Field Verification' | 'Variance Flagged';
  taxAssessmentNo: string;
  annualTaxInr: number;
  taxStatus: 'Paid' | 'Pending';
  droneSurveyDate: string;
  pointCloudData: {
    totalPoints: number;
    sensor: string;
    densityPtsPerSqm: number;
    elevationRangeM: [number, number];
  };
}

export const HINJAWADI_ULB_UNIT_AOI: HinjawadiAoiPolygon = {
  type: 'Polygon',
  coordinates: [[[73.7328,18.5812],[73.7355,18.5805],[73.7392,18.5808],[73.7428,18.5822],[73.7435,18.5855],[73.742,18.5888],[73.7385,18.5898],[73.7345,18.5892],[73.7325,18.5858],[73.7328,18.5812]]]
};

export const HINJAWADI_ULB_UNIT_INFO: HinjawadiUlbUnitInfo = {
  unitCode: 'ULB-PMRDA-HINJ-01',
  unitName: 'Hinjawadi Phase 1 - Rajiv Gandhi Infotech Park Special Planning Unit',
  authorityName: 'Pune Metropolitan Region Development Authority (PMRDA)',
  district: 'Pune',
  taluka: 'Mulshi',
  state: 'Maharashtra',
  postalPincode: '411057',
  totalAoiAreaSqKm: 3.45,
  totalAoiAreaHectares: 345,
  perimeterKm: 7.82,
  totalBuildingsCount: 48,
  totalParcelsCount: 32,
  totalBuiltUpAreaSqm: 284500,
  totalAnnualPropertyTaxInr: 42800000,
  surveyDatum: 'DGPS RTK Network / WGS84 UTM 43N',
  droneResolutionGsd: '0.035m (3.5 cm / pixel)',
  droneLidarSensor: 'Riegl VUX-1UAV Precision Drone LiDAR',
  surveyDate: '12-Feb-2025',
  centerCoordinates: {
    lng: 73.73769,
    lat: 18.58489,
    height: 480,
    heading: 35.0,
    pitch: -32.0
  },
  boundaryBeacons: [
    { beaconId: 'PMRDA-BC-01', description: 'South-West: Hinjawadi Bridge & Shivaji Chowk Apex', lng: 73.7328, lat: 18.5812, elevationM: 566.4 },
    { beaconId: 'PMRDA-BC-02', description: 'South Spine: Hinjawadi Main Road & Blue Ridge approach', lng: 73.7355, lat: 18.5805, elevationM: 567.1 },
    { beaconId: 'PMRDA-BC-03', description: 'South-East: Phase 1 East Junction Gateway', lng: 73.7392, lat: 18.5808, elevationM: 568.0 },
    { beaconId: 'PMRDA-BC-04', description: 'East Gateway: Wipro Circle Connector Corner', lng: 73.7428, lat: 18.5822, elevationM: 569.2 },
    { beaconId: 'PMRDA-BC-05', description: 'North-East: Radisson & Tech Corridor Boundary', lng: 73.7435, lat: 18.5855, elevationM: 570.5 },
    { beaconId: 'PMRDA-BC-06', description: 'North Perimeter: SCIT & Symbiosis Boundary Apex', lng: 73.7420, lat: 18.5888, elevationM: 571.2 },
    { beaconId: 'PMRDA-BC-07', description: 'North-West: MIDC Fire & Police Sector Line', lng: 73.7385, lat: 18.5898, elevationM: 570.1 },
    { beaconId: 'PMRDA-BC-08', description: 'West Ridge: Rajiv Gandhi MIDC Road Junction', lng: 73.7345, lat: 18.5892, elevationM: 568.8 },
    { beaconId: 'PMRDA-BC-09', description: 'West Gateway: Hinjawadi Phase 1 West Entrance', lng: 73.7325, lat: 18.5858, elevationM: 567.5 }
  ]
};

export const HINJAWADI_BUILDINGS: HinjawadiBuilding[] = [
  {
    "buildingId": "BLD-000781",
    "buildingName": "International Institute of Information Technology (I²IT) - Academic Complex",
    "buildingCategory": "Educational Institution",
    "buildingType": "Academic & Research Hub",
    "parcelId": "PAR-000123",
    "ulpin": "27041001003000",
    "totalFloors": 5,
    "approxHeightM": 16.4,
    "floorHeightM": 3.28,
    "footprintAreaSqm": 5237,
    "builtUpAreaSqm": 26185,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7372874,
            18.5846941
          ],
          [
            73.7378326,
            18.5853916
          ],
          [
            73.7382481,
            18.5850998
          ],
          [
            73.7377028,
            18.5844023
          ],
          [
            73.737381,
            18.5846283
          ],
          [
            73.7372874,
            18.5846941
          ]
        ]
      ]
    },
    "center": [
      73.7376232,
      18.5848184
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4800",
    "annualTaxInr": 191636,
    "taxStatus": "Pending",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 22316,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        584.6
      ]
    }
  },
  {
    "buildingId": "BLD-000002",
    "buildingName": "Cognizant Technology Park - Annex A",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-011",
    "ulpin": "27041001003001",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 559,
    "builtUpAreaSqm": 1677,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7378194,
            18.5840601
          ],
          [
            73.7379653,
            18.584249
          ],
          [
            73.7381304,
            18.5841345
          ],
          [
            73.7379845,
            18.5839456
          ],
          [
            73.7378194,
            18.5840601
          ]
        ]
      ]
    },
    "center": [
      73.7379438,
      18.5840899
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4801",
    "annualTaxInr": 60652,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 14279,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000003",
    "buildingName": "Wipro Circle Tech Center 1",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-012",
    "ulpin": "27041001003002",
    "totalFloors": 5,
    "approxHeightM": 16,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 2045,
    "builtUpAreaSqm": 10225,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7369894,
            18.5839786
          ],
          [
            73.736948,
            18.5841184
          ],
          [
            73.7370768,
            18.5842764
          ],
          [
            73.7371542,
            18.5842962
          ],
          [
            73.7372273,
            18.5842957
          ],
          [
            73.737492,
            18.5841178
          ],
          [
            73.7374762,
            18.5840146
          ],
          [
            73.7373471,
            18.5838428
          ],
          [
            73.7372519,
            18.5838048
          ],
          [
            73.7369894,
            18.5839786
          ]
        ]
      ]
    },
    "center": [
      73.7371952,
      18.5840724
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4802",
    "annualTaxInr": 102260,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 17468,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        584.2
      ]
    }
  },
  {
    "buildingId": "BLD-I2IT-LIB",
    "buildingName": "I²IT Central Knowledge & Library Tower",
    "buildingCategory": "Educational Institution",
    "buildingType": "Library & Digital Archives",
    "parcelId": "PAR-000123",
    "ulpin": "27041001003003",
    "totalFloors": 3,
    "approxHeightM": 10.2,
    "floorHeightM": 3.4,
    "footprintAreaSqm": 1349,
    "builtUpAreaSqm": 4047,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7363932,
            18.5845561
          ],
          [
            73.7366231,
            18.5843346
          ],
          [
            73.7368684,
            18.5846687
          ],
          [
            73.7366193,
            18.5848249
          ],
          [
            73.7365388,
            18.5847195
          ],
          [
            73.7363932,
            18.5845561
          ]
        ]
      ]
    },
    "center": [
      73.7365727,
      18.58461
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4803",
    "annualTaxInr": 82772,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15554,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        578.4
      ]
    }
  },
  {
    "buildingId": "BLD-000005",
    "buildingName": "Blue Ridge IT SEZ Tower 4",
    "buildingCategory": "Residential High-Rise",
    "buildingType": "Multi-Story Residential",
    "parcelId": "PAR-PUNE-014",
    "ulpin": "27041001003004",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 1261,
    "builtUpAreaSqm": 5044,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7377447,
            18.5840514
          ],
          [
            73.7380703,
            18.5838344
          ],
          [
            73.7380061,
            18.5837479
          ],
          [
            73.7377748,
            18.5839021
          ],
          [
            73.7376757,
            18.5837687
          ],
          [
            73.7377838,
            18.5836966
          ],
          [
            73.7377899,
            18.5837048
          ],
          [
            73.7379132,
            18.5836226
          ],
          [
            73.7378342,
            18.5835161
          ],
          [
            73.7375657,
            18.583695
          ],
          [
            73.73757,
            18.5837008
          ],
          [
            73.7375274,
            18.5837292
          ],
          [
            73.7375846,
            18.5838063
          ],
          [
            73.73757,
            18.583816
          ],
          [
            73.7377447,
            18.5840514
          ]
        ]
      ]
    },
    "center": [
      73.7377437,
      18.5837762
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4804",
    "annualTaxInr": 80308,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15812,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-I2IT-TAK",
    "buildingName": "Takshashila Complex - Research & Faculty Wing",
    "buildingCategory": "Educational Institution",
    "buildingType": "Faculty & Lab Complex",
    "parcelId": "PAR-000123",
    "ulpin": "27041001003005",
    "totalFloors": 4,
    "approxHeightM": 13.2,
    "floorHeightM": 3.3,
    "footprintAreaSqm": 726,
    "builtUpAreaSqm": 2904,
    "roofType": "Flat RCC Slab",
    "structuralType": "Post-Tensioned Flat Slab",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.736572,
            18.5851947
          ],
          [
            73.7368328,
            18.585012
          ],
          [
            73.7367411,
            18.5848945
          ],
          [
            73.736691,
            18.5849296
          ],
          [
            73.7366662,
            18.5848978
          ],
          [
            73.7365677,
            18.5849668
          ],
          [
            73.7365837,
            18.5849873
          ],
          [
            73.7365572,
            18.5850059
          ],
          [
            73.7365231,
            18.584998
          ],
          [
            73.7364843,
            18.5850252
          ],
          [
            73.7364819,
            18.5850473
          ],
          [
            73.7365044,
            18.5850762
          ],
          [
            73.7364249,
            18.5851319
          ],
          [
            73.7364789,
            18.5852012
          ],
          [
            73.7365424,
            18.5851567
          ],
          [
            73.736572,
            18.5851947
          ]
        ]
      ]
    },
    "center": [
      73.7365765,
      18.585045
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4805",
    "annualTaxInr": 65328,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15069,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581.4
      ]
    }
  },
  {
    "buildingId": "BLD-000007",
    "buildingName": "Qubix Business Park - Block B",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-016",
    "ulpin": "27041001003006",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 809,
    "builtUpAreaSqm": 3236,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7380105,
            18.5855754
          ],
          [
            73.7382008,
            18.5858208
          ],
          [
            73.7383532,
            18.5853855
          ],
          [
            73.7383221,
            18.5853491
          ],
          [
            73.7380105,
            18.5855754
          ]
        ]
      ]
    },
    "center": [
      73.7381794,
      18.5855412
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4806",
    "annualTaxInr": 67652,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15134,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-000008",
    "buildingName": "Embassy Tech Zone Annex",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-017",
    "ulpin": "27041001003007",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 1333,
    "builtUpAreaSqm": 5332,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7384564,
            18.5842131
          ],
          [
            73.7387584,
            18.5839959
          ],
          [
            73.7386586,
            18.5838712
          ],
          [
            73.7382424,
            18.5841707
          ],
          [
            73.7382749,
            18.5842113
          ],
          [
            73.7382614,
            18.5842208
          ],
          [
            73.7384444,
            18.5844572
          ],
          [
            73.738575,
            18.5843664
          ],
          [
            73.7384564,
            18.5842131
          ]
        ]
      ]
    },
    "center": [
      73.7384587,
      18.5841911
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4807",
    "annualTaxInr": 82324,
    "taxStatus": "Pending",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15920,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-000009",
    "buildingName": "Persistent Systems Development Center",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-018",
    "ulpin": "27041001003008",
    "totalFloors": 5,
    "approxHeightM": 16,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 1537,
    "builtUpAreaSqm": 7685,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7367645,
            18.5838617
          ],
          [
            73.7371162,
            18.583624
          ],
          [
            73.7370536,
            18.5834657
          ],
          [
            73.7368974,
            18.5834364
          ],
          [
            73.7366344,
            18.5835996
          ],
          [
            73.73661,
            18.5837499
          ],
          [
            73.7366954,
            18.583854
          ],
          [
            73.7367645,
            18.5838617
          ]
        ]
      ]
    },
    "center": [
      73.736817,
      18.5836816
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4808",
    "annualTaxInr": 88036,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 16706,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        584.2
      ]
    }
  },
  {
    "buildingId": "BLD-000010",
    "buildingName": "Tata Technologies Innovation Lab",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-019",
    "ulpin": "27041001003009",
    "totalFloors": 5,
    "approxHeightM": 16,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 3593,
    "builtUpAreaSqm": 17965,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7381922,
            18.5839812
          ],
          [
            73.7386809,
            18.5836424
          ],
          [
            73.7385535,
            18.5834773
          ],
          [
            73.7383258,
            18.5836353
          ],
          [
            73.7383707,
            18.5836935
          ],
          [
            73.7383695,
            18.5836943
          ],
          [
            73.7383,
            18.5836026
          ],
          [
            73.7385107,
            18.5834592
          ],
          [
            73.7381022,
            18.5829161
          ],
          [
            73.7379607,
            18.5830217
          ],
          [
            73.7381472,
            18.5832653
          ],
          [
            73.738077,
            18.5833132
          ],
          [
            73.7381567,
            18.5834183
          ],
          [
            73.7380973,
            18.5834588
          ],
          [
            73.7381597,
            18.583541
          ],
          [
            73.7382022,
            18.583512
          ],
          [
            73.7382396,
            18.5835611
          ],
          [
            73.738027,
            18.5837065
          ],
          [
            73.7381414,
            18.5838566
          ],
          [
            73.7381276,
            18.5838661
          ],
          [
            73.7381662,
            18.5839163
          ],
          [
            73.7381505,
            18.5839271
          ],
          [
            73.7381922,
            18.5839812
          ]
        ]
      ]
    },
    "center": [
      73.7382283,
      18.5835847
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4809",
    "annualTaxInr": 145604,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 19790,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        584.2
      ]
    }
  },
  {
    "buildingId": "BLD-000011",
    "buildingName": "Infosys Circle Executive Suites",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-020",
    "ulpin": "27041001003010",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 349,
    "builtUpAreaSqm": 1047,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7378149,
            18.583402
          ],
          [
            73.7378864,
            18.5834955
          ],
          [
            73.7379486,
            18.5834527
          ],
          [
            73.7379604,
            18.5834682
          ],
          [
            73.738034,
            18.5834176
          ],
          [
            73.7380222,
            18.5834022
          ],
          [
            73.738084,
            18.5833598
          ],
          [
            73.7380126,
            18.5832663
          ],
          [
            73.7378149,
            18.583402
          ]
        ]
      ]
    },
    "center": [
      73.7379531,
      18.5834074
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4810",
    "annualTaxInr": 54772,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13964,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-I2IT-HST",
    "buildingName": "ISquareIT Student Residential Hostel",
    "buildingCategory": "Residential High-Rise",
    "buildingType": "Student Campus Housing",
    "parcelId": "PAR-000123",
    "ulpin": "27041001003011",
    "totalFloors": 6,
    "approxHeightM": 18.6,
    "floorHeightM": 3.1,
    "footprintAreaSqm": 2500,
    "builtUpAreaSqm": 15000,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7358813,
            18.584257
          ],
          [
            73.7358295,
            18.5841917
          ],
          [
            73.7357259,
            18.5842657
          ],
          [
            73.7360258,
            18.5846428
          ],
          [
            73.7363205,
            18.5850135
          ],
          [
            73.7364289,
            18.5849361
          ],
          [
            73.7360061,
            18.5844041
          ],
          [
            73.7363769,
            18.5841394
          ],
          [
            73.736257,
            18.5839887
          ],
          [
            73.7358813,
            18.584257
          ]
        ]
      ]
    },
    "center": [
      73.7360733,
      18.5844096
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4811",
    "annualTaxInr": 115000,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 18540,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        586.8
      ]
    }
  },
  {
    "buildingId": "BLD-000013",
    "buildingName": "Ascendas IT Park Phase 1 Wing",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-022",
    "ulpin": "27041001003012",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 585,
    "builtUpAreaSqm": 1755,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7375241,
            18.5862918
          ],
          [
            73.7375857,
            18.5863724
          ],
          [
            73.7379721,
            18.5861071
          ],
          [
            73.7379007,
            18.5860137
          ],
          [
            73.7377632,
            18.5861082
          ],
          [
            73.7377729,
            18.5861209
          ],
          [
            73.7375241,
            18.5862918
          ]
        ]
      ]
    },
    "center": [
      73.7377204,
      18.5861866
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4812",
    "annualTaxInr": 61380,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 14318,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000014",
    "buildingName": "Hinjawadi Central Plaza Suites",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-023",
    "ulpin": "27041001003013",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 64,
    "builtUpAreaSqm": 192,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7376921,
            18.5831991
          ],
          [
            73.7376309,
            18.583117
          ],
          [
            73.7376672,
            18.5830927
          ],
          [
            73.7376756,
            18.583087
          ],
          [
            73.7377368,
            18.5831691
          ],
          [
            73.7376921,
            18.5831991
          ]
        ]
      ]
    },
    "center": [
      73.7376825,
      18.583144
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4813",
    "annualTaxInr": 46792,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13536,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000015",
    "buildingName": "Quadron Business Park Hub",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-024",
    "ulpin": "27041001003014",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 499,
    "builtUpAreaSqm": 1497,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7364306,
            18.5861051
          ],
          [
            73.7366312,
            18.5863737
          ],
          [
            73.7367372,
            18.5863025
          ],
          [
            73.7365366,
            18.586034
          ],
          [
            73.7364306,
            18.5861051
          ]
        ]
      ]
    },
    "center": [
      73.7365532,
      18.5861841
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4814",
    "annualTaxInr": 58972,
    "taxStatus": "Pending",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 14189,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000016",
    "buildingName": "Hinjawadi Smart Residency Tower B",
    "buildingCategory": "Residential High-Rise",
    "buildingType": "Multi-Story Residential",
    "parcelId": "PAR-PUNE-025",
    "ulpin": "27041001003015",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 151,
    "builtUpAreaSqm": 453,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.737193,
            18.5864648
          ],
          [
            73.7372818,
            18.5865708
          ],
          [
            73.7373566,
            18.5865146
          ],
          [
            73.7372678,
            18.5864085
          ],
          [
            73.737193,
            18.5864648
          ]
        ]
      ]
    },
    "center": [
      73.7372584,
      18.5864847
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4815",
    "annualTaxInr": 49228,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13667,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-HYATT-01",
    "buildingName": "Hyatt Place Pune Hinjawadi",
    "buildingCategory": "Commercial & Hospitality",
    "buildingType": "Luxury Hotel & Convention Center",
    "parcelId": "PAR-PUNE-004",
    "ulpin": "27041001003016",
    "totalFloors": 8,
    "approxHeightM": 26.4,
    "floorHeightM": 3.3,
    "footprintAreaSqm": 1020,
    "builtUpAreaSqm": 8160,
    "roofType": "Flat RCC Slab",
    "structuralType": "Steel Composite Frame",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.735972,
            18.5859658
          ],
          [
            73.7360677,
            18.586085
          ],
          [
            73.7361276,
            18.5861345
          ],
          [
            73.7361574,
            18.5861576
          ],
          [
            73.7361867,
            18.5861691
          ],
          [
            73.736209,
            18.5861602
          ],
          [
            73.7362293,
            18.5861473
          ],
          [
            73.7362686,
            18.5861197
          ],
          [
            73.7363506,
            18.5860665
          ],
          [
            73.7363405,
            18.5860527
          ],
          [
            73.7365005,
            18.5859466
          ],
          [
            73.736414,
            18.5858294
          ],
          [
            73.7363809,
            18.5858513
          ],
          [
            73.7363762,
            18.5858448
          ],
          [
            73.7361814,
            18.585974
          ],
          [
            73.7361033,
            18.5858767
          ],
          [
            73.7360647,
            18.5859045
          ],
          [
            73.7360557,
            18.5858932
          ],
          [
            73.7360026,
            18.5859315
          ],
          [
            73.7360088,
            18.5859393
          ],
          [
            73.735972,
            18.5859658
          ]
        ]
      ]
    },
    "center": [
      73.736189,
      18.5860007
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4816",
    "annualTaxInr": 73560,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 17490,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        594.6
      ]
    }
  },
  {
    "buildingId": "BLD-CITY-CTR",
    "buildingName": "Hinjawadi City Centre Commercial Hub",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "Commercial Retail & Offices",
    "parcelId": "PAR-PUNE-005",
    "ulpin": "27041001003017",
    "totalFloors": 6,
    "approxHeightM": 21,
    "floorHeightM": 3.5,
    "footprintAreaSqm": 2117,
    "builtUpAreaSqm": 12702,
    "roofType": "Flat RCC Slab",
    "structuralType": "Post-Tensioned Flat Slab",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7384952,
            18.5865738
          ],
          [
            73.7387913,
            18.5865824
          ],
          [
            73.7388105,
            18.5859936
          ],
          [
            73.7385143,
            18.585985
          ],
          [
            73.7384891,
            18.586112
          ],
          [
            73.7384783,
            18.5861917
          ],
          [
            73.7384755,
            18.5862623
          ],
          [
            73.7384999,
            18.5863227
          ],
          [
            73.7384952,
            18.5865738
          ]
        ]
      ]
    },
    "center": [
      73.738561,
      18.5862886
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4817",
    "annualTaxInr": 104276,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 18326,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        589.2
      ]
    }
  },
  {
    "buildingId": "BLD-000019",
    "buildingName": "Hinjawadi Sub Post Office & Citizen Service Centre",
    "buildingCategory": "Civic & Emergency",
    "buildingType": "Postal & Civic Services",
    "parcelId": "PAR-PUNE-028",
    "ulpin": "27041001003018",
    "totalFloors": 2,
    "approxHeightM": 6.4,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 104,
    "builtUpAreaSqm": 208,
    "roofType": "Flat RCC Slab",
    "structuralType": "Load Bearing Masonry",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7367373,
            18.5863967
          ],
          [
            73.7367958,
            18.5864703
          ],
          [
            73.7368734,
            18.5864149
          ],
          [
            73.7368149,
            18.5863413
          ],
          [
            73.7367373,
            18.5863967
          ]
        ]
      ]
    },
    "center": [
      73.7367917,
      18.586404
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4818",
    "annualTaxInr": 47912,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13116,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        574.6
      ]
    }
  },
  {
    "buildingId": "BLD-000020",
    "buildingName": "Silicon Heights Residential Wing A",
    "buildingCategory": "Residential High-Rise",
    "buildingType": "Multi-Story Residential",
    "parcelId": "PAR-PUNE-029",
    "ulpin": "27041001003019",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 415,
    "builtUpAreaSqm": 1245,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7380169,
            18.5864732
          ],
          [
            73.7381199,
            18.5865878
          ],
          [
            73.7381256,
            18.5865832
          ],
          [
            73.7381942,
            18.5866595
          ],
          [
            73.7382421,
            18.5866208
          ],
          [
            73.7382029,
            18.5865705
          ],
          [
            73.7382204,
            18.5863687
          ],
          [
            73.738188,
            18.586335
          ],
          [
            73.7380169,
            18.5864732
          ]
        ]
      ]
    },
    "center": [
      73.7381474,
      18.5865191
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4819",
    "annualTaxInr": 56620,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 14063,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000021",
    "buildingName": "Park Infotech Residency Tower 2",
    "buildingCategory": "Residential High-Rise",
    "buildingType": "Multi-Story Residential",
    "parcelId": "PAR-PUNE-030",
    "ulpin": "27041001003020",
    "totalFloors": 5,
    "approxHeightM": 16,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 2879,
    "builtUpAreaSqm": 14395,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7392832,
            18.5852573
          ],
          [
            73.7395538,
            18.5852722
          ],
          [
            73.7395404,
            18.5854909
          ],
          [
            73.7392674,
            18.5854759
          ],
          [
            73.739255,
            18.5856789
          ],
          [
            73.7397301,
            18.585705
          ],
          [
            73.7397694,
            18.5850605
          ],
          [
            73.7392968,
            18.5850346
          ],
          [
            73.7392832,
            18.5852573
          ]
        ]
      ]
    },
    "center": [
      73.7394421,
      18.5853592
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4820",
    "annualTaxInr": 125612,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 18719,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        584.2
      ]
    }
  },
  {
    "buildingId": "BLD-000022",
    "buildingName": "Saraswat Cooperative Bank & Financial Centre",
    "buildingCategory": "Commercial & Hospitality",
    "buildingType": "Banking & Financial Branch",
    "parcelId": "PAR-PUNE-031",
    "ulpin": "27041001003021",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 398,
    "builtUpAreaSqm": 1194,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7363002,
            18.5862386
          ],
          [
            73.7364957,
            18.5864703
          ],
          [
            73.7365824,
            18.5864046
          ],
          [
            73.7363868,
            18.5861729
          ],
          [
            73.7363586,
            18.5861777
          ],
          [
            73.7363308,
            18.5861922
          ],
          [
            73.7363146,
            18.5862113
          ],
          [
            73.7363002,
            18.5862386
          ]
        ]
      ]
    },
    "center": [
      73.7363837,
      18.5862633
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4821",
    "annualTaxInr": 56144,
    "taxStatus": "Pending",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 14037,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000023",
    "buildingName": "Orchid Corporate Center",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-032",
    "ulpin": "27041001003022",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 117,
    "builtUpAreaSqm": 351,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7368624,
            18.5866014
          ],
          [
            73.7369142,
            18.5866672
          ],
          [
            73.7370121,
            18.586598
          ],
          [
            73.7369603,
            18.5865323
          ],
          [
            73.7368624,
            18.5866014
          ]
        ]
      ]
    },
    "center": [
      73.7369223,
      18.5866001
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4822",
    "annualTaxInr": 48276,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13616,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000024",
    "buildingName": "Regus Executive Hub Hinjawadi",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-033",
    "ulpin": "27041001003023",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 47,
    "builtUpAreaSqm": 141,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7362776,
            18.5862811
          ],
          [
            73.7363094,
            18.5863202
          ],
          [
            73.736244,
            18.5863679
          ],
          [
            73.7362123,
            18.5863289
          ],
          [
            73.7362776,
            18.5862811
          ]
        ]
      ]
    },
    "center": [
      73.7362642,
      18.5863158
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4823",
    "annualTaxInr": 46316,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13511,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000025",
    "buildingName": "Tech Mahindra Software Unit 3",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-034",
    "ulpin": "27041001003024",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 1309,
    "builtUpAreaSqm": 5236,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7376996,
            18.5867089
          ],
          [
            73.7379206,
            18.5869607
          ],
          [
            73.7381839,
            18.5867532
          ],
          [
            73.7379629,
            18.5865013
          ],
          [
            73.7376996,
            18.5867089
          ]
        ]
      ]
    },
    "center": [
      73.7378933,
      18.5867266
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4824",
    "annualTaxInr": 81652,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15884,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-000026",
    "buildingName": "Cognizant Enterprise Hub B",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-035",
    "ulpin": "27041001003025",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 195,
    "builtUpAreaSqm": 585,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7365092,
            18.586533
          ],
          [
            73.7365766,
            18.5866157
          ],
          [
            73.7367031,
            18.586523
          ],
          [
            73.7366357,
            18.5864403
          ],
          [
            73.7365092,
            18.586533
          ]
        ]
      ]
    },
    "center": [
      73.7365868,
      18.586529
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4825",
    "annualTaxInr": 50460,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13733,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000027",
    "buildingName": "Hinjawadi Metro Station Admin Office",
    "buildingCategory": "Civic & Emergency",
    "buildingType": "Civic Infrastructure",
    "parcelId": "PAR-PUNE-036",
    "ulpin": "27041001003026",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 776,
    "builtUpAreaSqm": 3104,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7389821,
            18.5862525
          ],
          [
            73.7392851,
            18.5862258
          ],
          [
            73.7392638,
            18.5860083
          ],
          [
            73.7389608,
            18.586035
          ],
          [
            73.7389821,
            18.5862525
          ]
        ]
      ]
    },
    "center": [
      73.7390948,
      18.5861548
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4826",
    "annualTaxInr": 66728,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15084,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-SCIT-01",
    "buildingName": "Symbiosis Centre for Information Technology (SCIT)",
    "buildingCategory": "Educational Institution",
    "buildingType": "Higher Education Institute",
    "parcelId": "PAR-PUNE-007",
    "ulpin": "27041001003027",
    "totalFloors": 5,
    "approxHeightM": 16.5,
    "floorHeightM": 3.3,
    "footprintAreaSqm": 2109,
    "builtUpAreaSqm": 10545,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7362473,
            18.5829664
          ],
          [
            73.7363559,
            18.5831036
          ],
          [
            73.7364826,
            18.5830221
          ],
          [
            73.7367043,
            18.583035
          ],
          [
            73.7371071,
            18.5827605
          ],
          [
            73.7369623,
            18.5826404
          ],
          [
            73.7364238,
            18.582812
          ],
          [
            73.7363423,
            18.582872
          ],
          [
            73.7364373,
            18.5829363
          ],
          [
            73.7362473,
            18.5829664
          ]
        ]
      ]
    },
    "center": [
      73.736531,
      18.5829115
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4827",
    "annualTaxInr": 104052,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 17639,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        584.7
      ]
    }
  },
  {
    "buildingId": "BLD-000029",
    "buildingName": "Symbiosis Sports & Aquatic Complex",
    "buildingCategory": "Educational Institution",
    "buildingType": "Campus Recreation & Sports",
    "parcelId": "PAR-PUNE-038",
    "ulpin": "27041001003028",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 456,
    "builtUpAreaSqm": 1368,
    "roofType": "Flat RCC Slab",
    "structuralType": "Steel Truss Composite",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7358785,
            18.5833089
          ],
          [
            73.7360312,
            18.5831269
          ],
          [
            73.7361628,
            18.5832261
          ],
          [
            73.7360101,
            18.5834081
          ],
          [
            73.7358785,
            18.5833089
          ]
        ]
      ]
    },
    "center": [
      73.7359922,
      18.5832758
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4828",
    "annualTaxInr": 57768,
    "taxStatus": "Pending",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 14124,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000030",
    "buildingName": "Hinjawadi Green Energy Substation",
    "buildingCategory": "Civic & Emergency",
    "buildingType": "Civic Infrastructure",
    "parcelId": "PAR-PUNE-039",
    "ulpin": "27041001003029",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 25,
    "builtUpAreaSqm": 75,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7361983,
            18.5863408
          ],
          [
            73.7362276,
            18.5863804
          ],
          [
            73.7362042,
            18.586396
          ],
          [
            73.7361895,
            18.586376
          ],
          [
            73.7361682,
            18.5863902
          ],
          [
            73.7361536,
            18.5863705
          ],
          [
            73.7361983,
            18.5863408
          ]
        ]
      ]
    },
    "center": [
      73.7361914,
      18.5863707
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4829",
    "annualTaxInr": 45700,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13478,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000031",
    "buildingName": "Hinjawadi Executive Food Court & Hub",
    "buildingCategory": "Commercial & Hospitality",
    "buildingType": "Food Court & Dining",
    "parcelId": "PAR-PUNE-040",
    "ulpin": "27041001003030",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 53,
    "builtUpAreaSqm": 159,
    "roofType": "Flat RCC Slab",
    "structuralType": "Precast Concrete Frame",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7361766,
            18.5863351
          ],
          [
            73.7361407,
            18.5862915
          ],
          [
            73.7360762,
            18.5863392
          ],
          [
            73.7361122,
            18.5863828
          ],
          [
            73.7361766,
            18.5863351
          ]
        ]
      ]
    },
    "center": [
      73.7361365,
      18.5863367
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4830",
    "annualTaxInr": 46484,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13520,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000032",
    "buildingName": "Symbiosis Research Center Annex",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-041",
    "ulpin": "27041001003031",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 1406,
    "builtUpAreaSqm": 5624,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7352988,
            18.5837461
          ],
          [
            73.7354173,
            18.5839106
          ],
          [
            73.735617,
            18.5838115
          ],
          [
            73.7356065,
            18.5837924
          ],
          [
            73.7356446,
            18.5837879
          ],
          [
            73.7356622,
            18.5837847
          ],
          [
            73.7356805,
            18.5837725
          ],
          [
            73.7356927,
            18.5837615
          ],
          [
            73.7357022,
            18.5837435
          ],
          [
            73.735707,
            18.583714
          ],
          [
            73.7358774,
            18.5835943
          ],
          [
            73.7357503,
            18.5834308
          ],
          [
            73.7352988,
            18.5837461
          ]
        ]
      ]
    },
    "center": [
      73.7356119,
      18.5837381
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4831",
    "annualTaxInr": 84368,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 16029,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-000033",
    "buildingName": "Symbiosis Academic Block C",
    "buildingCategory": "Educational Institution",
    "buildingType": "Lecture Halls & Innovation Lab",
    "parcelId": "PAR-PUNE-042",
    "ulpin": "27041001003032",
    "totalFloors": 5,
    "approxHeightM": 16,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 5594,
    "builtUpAreaSqm": 27970,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7382314,
            18.5827905
          ],
          [
            73.7386641,
            18.5834072
          ],
          [
            73.7388911,
            18.5832336
          ],
          [
            73.7389687,
            18.5828176
          ],
          [
            73.7390314,
            18.5823047
          ],
          [
            73.7388989,
            18.5823163
          ],
          [
            73.7382314,
            18.5827905
          ]
        ]
      ]
    },
    "center": [
      73.7387024,
      18.5828086
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4832",
    "annualTaxInr": 201632,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 22791,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        584.2
      ]
    }
  },
  {
    "buildingId": "BLD-RADISSON",
    "buildingName": "Radisson Blu Hotel Hinjawadi",
    "buildingCategory": "Commercial & Hospitality",
    "buildingType": "Premium Hospitality Suite",
    "parcelId": "PAR-PUNE-008",
    "ulpin": "27041001003033",
    "totalFloors": 6,
    "approxHeightM": 20.4,
    "floorHeightM": 3.4,
    "footprintAreaSqm": 2985,
    "builtUpAreaSqm": 17910,
    "roofType": "Flat RCC Slab",
    "structuralType": "Steel Composite Frame",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7392334,
            18.5839902
          ],
          [
            73.7392225,
            18.5837775
          ],
          [
            73.7404215,
            18.5837223
          ],
          [
            73.7404324,
            18.5839353
          ],
          [
            73.7392334,
            18.5839902
          ]
        ]
      ]
    },
    "center": [
      73.7397086,
      18.5838831
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4833",
    "annualTaxInr": 128580,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 19538,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        588.6
      ]
    }
  },
  {
    "buildingId": "BLD-000035",
    "buildingName": "Blue Ridge Commercial Wing 2",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-044",
    "ulpin": "27041001003034",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 218,
    "builtUpAreaSqm": 654,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7351411,
            18.5847407
          ],
          [
            73.7352638,
            18.5849051
          ],
          [
            73.7353397,
            18.5848543
          ],
          [
            73.735217,
            18.5846898
          ],
          [
            73.7351411,
            18.5847407
          ]
        ]
      ]
    },
    "center": [
      73.7352205,
      18.5847861
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4834",
    "annualTaxInr": 51104,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13767,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000036",
    "buildingName": "Megapolis Splendour Tower 2",
    "buildingCategory": "Residential High-Rise",
    "buildingType": "Multi-Story Residential",
    "parcelId": "PAR-PUNE-045",
    "ulpin": "27041001003035",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 179,
    "builtUpAreaSqm": 537,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7352141,
            18.585263
          ],
          [
            73.7352374,
            18.5852939
          ],
          [
            73.7353476,
            18.5852194
          ],
          [
            73.7353243,
            18.5851885
          ],
          [
            73.7352996,
            18.5852051
          ],
          [
            73.7352573,
            18.5851447
          ],
          [
            73.7352831,
            18.5851276
          ],
          [
            73.7352643,
            18.5851021
          ],
          [
            73.7351425,
            18.585183
          ],
          [
            73.7351614,
            18.5852084
          ],
          [
            73.7351951,
            18.5851861
          ],
          [
            73.7352378,
            18.585247
          ],
          [
            73.7352141,
            18.585263
          ]
        ]
      ]
    },
    "center": [
      73.7352445,
      18.5852024
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4835",
    "annualTaxInr": 50012,
    "taxStatus": "Pending",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13709,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000037",
    "buildingName": "Cisco Innovation Partner Hub",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-046",
    "ulpin": "27041001003036",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 700,
    "builtUpAreaSqm": 2800,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7393688,
            18.5861267
          ],
          [
            73.7396616,
            18.5861447
          ],
          [
            73.7396681,
            18.5860489
          ],
          [
            73.7395929,
            18.5860442
          ],
          [
            73.7395956,
            18.5860035
          ],
          [
            73.7396709,
            18.5860081
          ],
          [
            73.7396771,
            18.5859186
          ],
          [
            73.7393842,
            18.5859006
          ],
          [
            73.7393779,
            18.5859933
          ],
          [
            73.7394633,
            18.5859985
          ],
          [
            73.7394605,
            18.5860385
          ],
          [
            73.7393751,
            18.5860333
          ],
          [
            73.7393688,
            18.5861267
          ]
        ]
      ]
    },
    "center": [
      73.7395127,
      18.5860297
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4836",
    "annualTaxInr": 64600,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 14970,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-POLICE-01",
    "buildingName": "Hinjawadi Police Station & Surveillance Hub",
    "buildingCategory": "Civic & Emergency",
    "buildingType": "Government Law Enforcement",
    "parcelId": "PAR-PUNE-006",
    "ulpin": "27041001003037",
    "totalFloors": 2,
    "approxHeightM": 7,
    "floorHeightM": 3.5,
    "footprintAreaSqm": 298,
    "builtUpAreaSqm": 596,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7355487,
            18.5861326
          ],
          [
            73.7355863,
            18.5861326
          ],
          [
            73.7356239,
            18.5861415
          ],
          [
            73.7356587,
            18.5861529
          ],
          [
            73.7356922,
            18.5861732
          ],
          [
            73.7357124,
            18.5861872
          ],
          [
            73.7357311,
            18.5862037
          ],
          [
            73.7357419,
            18.5862177
          ],
          [
            73.7358384,
            18.5861567
          ],
          [
            73.7357244,
            18.5860156
          ],
          [
            73.7355487,
            18.5861326
          ]
        ]
      ]
    },
    "center": [
      73.7356733,
      18.5861497
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4837",
    "annualTaxInr": 53344,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13497,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        575.2
      ]
    }
  },
  {
    "buildingId": "BLD-FIRE-01",
    "buildingName": "MIDC Fire & Emergency Response Station - Phase 1",
    "buildingCategory": "Civic & Emergency",
    "buildingType": "Emergency Response Facility",
    "parcelId": "PAR-PUNE-009",
    "ulpin": "27041001003038",
    "totalFloors": 3,
    "approxHeightM": 10.5,
    "floorHeightM": 3.5,
    "footprintAreaSqm": 323,
    "builtUpAreaSqm": 969,
    "roofType": "Flat RCC Slab",
    "structuralType": "Heavy RCC & Steel Truss",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7349762,
            18.5848132
          ],
          [
            73.7350933,
            18.584962
          ],
          [
            73.7352127,
            18.5848776
          ],
          [
            73.7350956,
            18.5847288
          ],
          [
            73.7349762,
            18.5848132
          ]
        ]
      ]
    },
    "center": [
      73.7350708,
      18.584839
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4838",
    "annualTaxInr": 54044,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 14060,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        578.7
      ]
    }
  },
  {
    "buildingId": "BLD-000040",
    "buildingName": "Megapolis Splendour Tower 1",
    "buildingCategory": "Residential High-Rise",
    "buildingType": "High-Rise Residential Complex",
    "parcelId": "PAR-PUNE-049",
    "ulpin": "27041001003039",
    "totalFloors": 12,
    "approxHeightM": 38.4,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 956,
    "builtUpAreaSqm": 11472,
    "roofType": "Flat RCC Slab",
    "structuralType": "Mivan Formwork RCC",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7389111,
            18.586742
          ],
          [
            73.7392822,
            18.5867504
          ],
          [
            73.7392878,
            18.5865297
          ],
          [
            73.7389167,
            18.5865213
          ],
          [
            73.7389111,
            18.586742
          ]
        ]
      ]
    },
    "center": [
      73.7390618,
      18.5866571
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4839",
    "annualTaxInr": 71768,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 19194,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        606.6
      ]
    }
  },
  {
    "buildingId": "BLD-000041",
    "buildingName": "Hinjawadi Telecom Exchange Bld",
    "buildingCategory": "Civic & Emergency",
    "buildingType": "Civic Infrastructure",
    "parcelId": "PAR-PUNE-050",
    "ulpin": "27041001003040",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 193,
    "builtUpAreaSqm": 579,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7350291,
            18.5853311
          ],
          [
            73.7350489,
            18.5853169
          ],
          [
            73.7350943,
            18.5853727
          ],
          [
            73.7350703,
            18.5853902
          ],
          [
            73.7350966,
            18.5854228
          ],
          [
            73.7352069,
            18.5853428
          ],
          [
            73.7351805,
            18.5853102
          ],
          [
            73.7351569,
            18.5853273
          ],
          [
            73.7351118,
            18.5852718
          ],
          [
            73.7351355,
            18.5852548
          ],
          [
            73.7351104,
            18.5852233
          ],
          [
            73.7350039,
            18.5852997
          ],
          [
            73.7350291,
            18.5853311
          ]
        ]
      ]
    },
    "center": [
      73.735098,
      18.5853227
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4840",
    "annualTaxInr": 50404,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13730,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000042",
    "buildingName": "Capgemini Hinjawadi Development Annex",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-051",
    "ulpin": "27041001003041",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 1063,
    "builtUpAreaSqm": 4252,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7364788,
            18.5826906
          ],
          [
            73.7366157,
            18.5826138
          ],
          [
            73.7365579,
            18.5825211
          ],
          [
            73.7367754,
            18.5823992
          ],
          [
            73.7368332,
            18.5824919
          ],
          [
            73.7369639,
            18.5824186
          ],
          [
            73.7368986,
            18.5823139
          ],
          [
            73.7368755,
            18.5823269
          ],
          [
            73.736831,
            18.5822556
          ],
          [
            73.7367282,
            18.5823132
          ],
          [
            73.7367069,
            18.582279
          ],
          [
            73.7364898,
            18.5824008
          ],
          [
            73.7365128,
            18.5824377
          ],
          [
            73.7364248,
            18.582487
          ],
          [
            73.7364608,
            18.5825447
          ],
          [
            73.7364067,
            18.582575
          ],
          [
            73.7364788,
            18.5826906
          ]
        ]
      ]
    },
    "center": [
      73.7366493,
      18.5824564
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4841",
    "annualTaxInr": 74764,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15515,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-000043",
    "buildingName": "Symbiosis Cherry Blossom Scholars Residence",
    "buildingCategory": "Residential High-Rise",
    "buildingType": "Hostel Accommodation",
    "parcelId": "PAR-PUNE-052",
    "ulpin": "27041001003042",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 436,
    "builtUpAreaSqm": 1308,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7384027,
            18.5871029
          ],
          [
            73.7385924,
            18.58713
          ],
          [
            73.7386231,
            18.5869374
          ],
          [
            73.7384334,
            18.5869103
          ],
          [
            73.7384027,
            18.5871029
          ]
        ]
      ]
    },
    "center": [
      73.7384909,
      18.5870367
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4842",
    "annualTaxInr": 57208,
    "taxStatus": "Pending",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 14094,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000044",
    "buildingName": "Symbiosis Centre of Health Care (SCHC)",
    "buildingCategory": "Civic & Emergency",
    "buildingType": "Health Centre & Medical Clinic",
    "parcelId": "PAR-PUNE-053",
    "ulpin": "27041001003043",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 791,
    "builtUpAreaSqm": 3164,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7360323,
            18.5828694
          ],
          [
            73.7363549,
            18.5826433
          ],
          [
            73.7362222,
            18.5824731
          ],
          [
            73.7361022,
            18.5825572
          ],
          [
            73.7361294,
            18.5825922
          ],
          [
            73.7360152,
            18.5826722
          ],
          [
            73.736037,
            18.5827002
          ],
          [
            73.7359962,
            18.5827288
          ],
          [
            73.7360208,
            18.5827602
          ],
          [
            73.7359731,
            18.5827936
          ],
          [
            73.7360323,
            18.5828694
          ]
        ]
      ]
    },
    "center": [
      73.7360832,
      18.5826963
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4843",
    "annualTaxInr": 67148,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15107,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-000045",
    "buildingName": "Pesh Infotech IT Tower - Phase 1",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT/ITeS Software Facility",
    "parcelId": "PAR-PUNE-054",
    "ulpin": "27041001003044",
    "totalFloors": 4,
    "approxHeightM": 12.8,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 921,
    "builtUpAreaSqm": 3684,
    "roofType": "Flat RCC Slab",
    "structuralType": "Post-Tensioned Flat Slab",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.738235,
            18.5869985
          ],
          [
            73.7382244,
            18.586935
          ],
          [
            73.7381824,
            18.586925
          ],
          [
            73.738063,
            18.5870044
          ],
          [
            73.7379755,
            18.5870805
          ],
          [
            73.7382123,
            18.5873661
          ],
          [
            73.7382369,
            18.5873788
          ],
          [
            73.7382703,
            18.5873741
          ],
          [
            73.738293,
            18.5873513
          ],
          [
            73.7382984,
            18.5873013
          ],
          [
            73.738235,
            18.5869985
          ]
        ]
      ]
    },
    "center": [
      73.7382024,
      18.5871558
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4844",
    "annualTaxInr": 70788,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 15302,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        581
      ]
    }
  },
  {
    "buildingId": "BLD-000046",
    "buildingName": "Hinjawadi Co-Working Space Plaza",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-055",
    "ulpin": "27041001003045",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 213,
    "builtUpAreaSqm": 639,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7348631,
            18.5851265
          ],
          [
            73.7348824,
            18.5851475
          ],
          [
            73.7348783,
            18.5851509
          ],
          [
            73.7349527,
            18.585232
          ],
          [
            73.7349848,
            18.5852055
          ],
          [
            73.7349685,
            18.5851877
          ],
          [
            73.7350226,
            18.5851431
          ],
          [
            73.735043,
            18.5851653
          ],
          [
            73.7350731,
            18.5851405
          ],
          [
            73.7350038,
            18.585065
          ],
          [
            73.7350078,
            18.5850618
          ],
          [
            73.7349793,
            18.5850308
          ],
          [
            73.7349431,
            18.5850607
          ],
          [
            73.7349576,
            18.5850765
          ],
          [
            73.7349129,
            18.5851132
          ],
          [
            73.7348984,
            18.5850975
          ],
          [
            73.7348631,
            18.5851265
          ]
        ]
      ]
    },
    "center": [
      73.734955,
      18.5851254
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4845",
    "annualTaxInr": 50964,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13760,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000047",
    "buildingName": "PMRDA Hinjawadi Sector Office",
    "buildingCategory": "Civic & Emergency",
    "buildingType": "Civic Infrastructure",
    "parcelId": "PAR-PUNE-056",
    "ulpin": "27041001003046",
    "totalFloors": 3,
    "approxHeightM": 9.6,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 238,
    "builtUpAreaSqm": 714,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7401237,
            18.5851327
          ],
          [
            73.7402508,
            18.58514
          ],
          [
            73.740261,
            18.5849797
          ],
          [
            73.7401339,
            18.5849725
          ],
          [
            73.7401237,
            18.5851327
          ]
        ]
      ]
    },
    "center": [
      73.7401786,
      18.5850715
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Verified",
    "taxAssessmentNo": "PMRDA-TX-2025-4846",
    "annualTaxInr": 51664,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 13797,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        577.8
      ]
    }
  },
  {
    "buildingId": "BLD-000048",
    "buildingName": "Cognizant Technology Park - Annex A",
    "buildingCategory": "IT & Tech Park",
    "buildingType": "IT / Tech Office Complex",
    "parcelId": "PAR-PUNE-057",
    "ulpin": "27041001003047",
    "totalFloors": 5,
    "approxHeightM": 16,
    "floorHeightM": 3.2,
    "footprintAreaSqm": 2193,
    "builtUpAreaSqm": 10965,
    "roofType": "Flat RCC Slab",
    "structuralType": "RCC Framed Structure",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7351965,
            18.58326
          ],
          [
            73.7351733,
            18.5832498
          ],
          [
            73.7350291,
            18.5833512
          ],
          [
            73.7351307,
            18.5835002
          ],
          [
            73.7351487,
            18.5835214
          ],
          [
            73.7352015,
            18.583565
          ],
          [
            73.7352678,
            18.5835863
          ],
          [
            73.7353377,
            18.5835818
          ],
          [
            73.7354004,
            18.5835523
          ],
          [
            73.7354513,
            18.583506
          ],
          [
            73.7354673,
            18.583476
          ],
          [
            73.7357016,
            18.5833273
          ],
          [
            73.7355037,
            18.5830597
          ],
          [
            73.7351965,
            18.58326
          ]
        ]
      ]
    },
    "center": [
      73.7353004,
      18.5834141
    ],
    "confidencePct": 98.2,
    "verificationStatus": "Pending Field Verification",
    "taxAssessmentNo": "PMRDA-TX-2025-4847",
    "annualTaxInr": 106404,
    "taxStatus": "Paid",
    "droneSurveyDate": "12-Feb-2025",
    "pointCloudData": {
      "totalPoints": 17690,
      "sensor": "Riegl VUX-1UAV Precision Drone LiDAR",
      "densityPtsPerSqm": 140,
      "elevationRangeM": [
        568.2,
        584.2
      ]
    }
  }
];

/**
 * Robust Raycasting Point-in-Polygon detection for world coordinates
 */
export function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  let inside = false;
  const x = point[0], y = point[1];
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Finds the building at a given [lng, lat] coordinate, with an optional tolerance radius
 */
export function findBuildingAtCoordinate(lng: number, lat: number, toleranceDeg: number = 0.00015): HinjawadiBuilding | null {
  // First, check strict polygon containment
  for (const bld of HINJAWADI_BUILDINGS) {
    if (isPointInPolygon([lng, lat], bld.geometry.coordinates[0])) {
      return bld;
    }
  }

  // Second, check proximity to building center within tolerance
  let closest: HinjawadiBuilding | null = null;
  let minDist = toleranceDeg;
  for (const bld of HINJAWADI_BUILDINGS) {
    const [bLng, bLat] = bld.center;
    const dist = Math.sqrt(Math.pow(lng - bLng, 2) + Math.pow(lat - bLat, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = bld;
    }
  }
  return closest;
}
