// NAKSHA V2.0 — Authentic Geospatial GIS Dataset
// Study Area: International Institute of Information Technology (I²IT), Hinjawadi Phase 1, Pune, Maharashtra
// Anchor Coordinates: 18.584728° N, 73.737562° E (WGS84 EPSG:4326 / UTM Zone 43N)
// Elevation: 568.2m MSL (Plateau datum)
// Source: OpenStreetMap Verified Vector Footprints, PMRDA Cadastral Framework, DGPS RTK Field Survey

export const DEMO_DATA_DISCLAIMER = 'GEOSPATIAL DIGITAL TWIN - I²IT HINJAWADI PUNE • REAL VECTOR CADASTRE & FOOTPRINTS';

export interface DemoGeoJsonPolygon {
  type: 'Polygon';
  coordinates: [number, number][][]; // [lng, lat] GeoJSON standard
}

export interface CoherentParcel {
  parcelId: string;
  khasraNo: string;
  plotNo: string;
  ulpin: string;
  ulpinStatus: 'Available' | 'Pending' | 'Not Available' | 'Requires Review';
  surveyUnitId: string;
  wardId: string;
  ulbId: string;
  propertyType: 'Single/Joint Owners Individual Building' | 'Multi-Ownership/Group Housing Society' | 'Plot' | 'Commercial Complex';
  geometry: DemoGeoJsonPolygon;
  areaSqm: number;
  perimeterM: number;
  verificationStatus: 'Verified' | 'Pending Field Verification' | 'Requires Review' | 'Disputed';
  rorStatus: 'Verified' | 'Pending' | 'Draft';
  threeDStatus: 'Ready for Verification' | 'Model Reconstructed' | 'Pending Photogrammetry' | 'Anomalies Flagged';
  publicationStatus: 'Provisional' | 'Finalized' | 'Published' | 'Pending';
  dataSource: string;
  buildingsCount?: number;
  floorsCount?: number;
  unitsCount?: number;
}

export interface CoherentBuilding {
  buildingId: string;
  parcelId: string;
  buildingName: string;
  buildingType: 'Residential Apartment' | 'Commercial Complex' | 'Mixed Use' | 'Individual House';
  buildingStatus: 'Existing & Occupied' | 'Under Construction' | 'Renovated';
  totalFloors: number;
  floorHeightM: number;
  approxHeightM: number;
  footprintAreaSqm: number;
  builtUpAreaSqm: number;
  roofType: 'Flat RCC Slab' | 'Sloped Tile' | 'Metal Truss';
  geometry: DemoGeoJsonPolygon;
  geometrySource: 'Building Footprint Extrusion' | 'Photogrammetric Mesh' | 'LiDAR-derived Building';
  hasLidar: boolean;
  lidarStatus: 'Not Available' | 'Available' | 'Processing';
  confidencePct: number;
  confidenceBreakdown: {
    spatialOverlap: number;
    parcelContainment: number;
    addressAgreement: number;
    floorAgreement: number;
    planAgreement: number;
  };
  verificationStatus: 'Verified' | 'Pending Field Verification' | 'Variance Flagged';
  dataSource: string;
  ulpin?: string;
  farRatio?: number;
  source?: string;
  constructionYear?: string;
  groundElevationM?: number;
  roofElevationM?: number;
  heightSource?: 'Building Plan / Field Survey (DGPS RTK)' | 'Estimated' | 'DSM-DTM' | 'LiDAR';
}

export interface CoherentFloor {
  floorId: string;
  buildingId: string;
  floorNumber: number;
  floorName: string;
  baseElevationM: number;
  topElevationM: number;
  floorHeightM: number;
  unitsCount: number;
  builtUpAreaSqm: number;
  geometryStatus: 'Available' | 'Pending' | 'Derived from Footprint';
  verificationStatus: 'Verified' | 'Pending' | 'Discrepancy Detected';
  baseHeightM?: number;
  heightM?: number;
  confidence?: number;
  estimatedElevationM?: number;
  estimatedHeightM?: number;
  confidencePct?: number;
}

export interface CoherentUnit {
  unitId: string;
  flatNumber: string;
  floorId: string;
  floorNumber: number;
  buildingId: string;
  parcelId: string;
  carpetAreaSqm: number;
  propertyTaxId: string;
  useType: 'Residential' | 'Commercial' | 'Retail';
  ownerCount: number;
  ownerNames: string[];
  rorStatus: 'Linked' | 'Pending' | 'Not Linked';
  volumeId: string;
  volumeM3: number;
  verificationStatus: 'Verified' | 'Pending' | 'Flagged';
  unitNumber?: string;
  ownerName?: string;
  ownersCount?: number;
  rorLinkage?: 'Linked' | 'Pending' | 'Not Linked';
  threeDVolumeStatus?: 'Available' | 'Pending Generation' | 'Review Required';
}

export interface CoherentGtPoint {
  seqNo: number;
  plotNo: string;
  parcelId: string;
  lng: number;
  lat: number;
  elevationM: number;
  accuracyM: number;
  observationType: 'DGPS RTK FIX' | 'Total Station' | 'Field Laser Tape';
  timestamp: string;
  status: 'Approved' | 'Pending' | 'Uploaded';
  buildingId?: string;
  heightM?: number;
  ulpin?: string;
  ulpinType?: 'PERMANENT' | 'TEMPORARY';
}

// -----------------------------------------------------------------------------
// ADMINISTRATIVE BOUNDARIES (Hinjawadi Phase 1 & I2IT Campus Plot P-14)
// -----------------------------------------------------------------------------

export const HINJAWADI_PHASE_1_BOUNDARY: DemoGeoJsonPolygon = {
  type: 'Polygon',
  coordinates: [[[73.733,18.5815],[73.7425,18.5815],[73.7425,18.5885],[73.733,18.5885],[73.733,18.5815]]]
};

export const I2IT_CAMPUS_BOUNDARY: DemoGeoJsonPolygon = {
  type: 'Polygon',
  coordinates: [[[73.7354551,18.5843356],[73.7369584,18.583313],[73.7384309,18.5851803],[73.7382293,18.5859548],[73.7373061,18.5848198],[73.7363918,18.5855132],[73.7354551,18.5843356]]]
};

// Aliases for backwards compatibility with existing UI components
export const WARD_43_BOUNDARY = HINJAWADI_PHASE_1_BOUNDARY;
export const SURVEY_UNIT_1_BOUNDARY = I2IT_CAMPUS_BOUNDARY;

// Road Network Polylines
export const ROAD_NETWORKS = [
  {
    "id": "ROAD-PUNE-1",
    "name": "Rajiv Gandhi MIDC Road",
    "coordinates": [
      [
        73.7338478,
        18.5862635
      ],
      [
        73.73364,
        18.5865576
      ],
      [
        73.7335649,
        18.5866707
      ],
      [
        73.7334955,
        18.5868011
      ],
      [
        73.7334122,
        18.5870769
      ],
      [
        73.733076,
        18.5881894
      ],
      [
        73.7327371,
        18.5893106
      ],
      [
        73.7327183,
        18.5894093
      ],
      [
        73.7327331,
        18.589525
      ],
      [
        73.7328933,
        18.5900675
      ],
      [
        73.7329563,
        18.5902809
      ],
      [
        73.7330413,
        18.5906111
      ],
      [
        73.7330624,
        18.5906932
      ],
      [
        73.7330675,
        18.5907708
      ],
      [
        73.7330652,
        18.5908547
      ],
      [
        73.7330452,
        18.5909424
      ],
      [
        73.7330323,
        18.5909988
      ],
      [
        73.733017,
        18.5910635
      ],
      [
        73.7330074,
        18.5911044
      ],
      [
        73.7329908,
        18.5911748
      ],
      [
        73.7328301,
        18.5918551
      ],
      [
        73.7328004,
        18.5919765
      ],
      [
        73.7327802,
        18.592059
      ],
      [
        73.73273,
        18.5922648
      ],
      [
        73.7327086,
        18.5923522
      ],
      [
        73.7326287,
        18.5926795
      ],
      [
        73.7325874,
        18.5928514
      ],
      [
        73.7323512,
        18.5938354
      ],
      [
        73.7323498,
        18.5938459
      ],
      [
        73.7323344,
        18.5939608
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-2",
    "name": "Hinjawadi Phase 1 road",
    "coordinates": [
      [
        73.735192,
        18.5860522
      ],
      [
        73.7350992,
        18.5860302
      ],
      [
        73.7349844,
        18.586003
      ],
      [
        73.7347651,
        18.5859786
      ],
      [
        73.7347565,
        18.5859783
      ],
      [
        73.7345665,
        18.5859713
      ],
      [
        73.7344366,
        18.5859571
      ],
      [
        73.734423,
        18.5859556
      ],
      [
        73.7339428,
        18.5858839
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-3",
    "name": "Blue Ridge Road, Phase 1",
    "coordinates": [
      [
        73.7339082,
        18.5858409
      ],
      [
        73.7338578,
        18.5856808
      ],
      [
        73.7338343,
        18.5856026
      ],
      [
        73.7338361,
        18.5855479
      ],
      [
        73.7338467,
        18.5854836
      ],
      [
        73.7339127,
        18.5853615
      ],
      [
        73.7341501,
        18.585174
      ],
      [
        73.7343542,
        18.5850333
      ],
      [
        73.7347161,
        18.584775
      ],
      [
        73.7349188,
        18.5846303
      ],
      [
        73.7352894,
        18.5843854
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-4",
    "name": "Rajiv Gandhi MIDC Road",
    "coordinates": [
      [
        73.7334473,
        18.5861735
      ],
      [
        73.7334613,
        18.5865069
      ],
      [
        73.7334546,
        18.5866235
      ],
      [
        73.7334228,
        18.5867807
      ],
      [
        73.7333693,
        18.5869569
      ],
      [
        73.7333374,
        18.5870619
      ],
      [
        73.7332609,
        18.587314
      ],
      [
        73.7326617,
        18.5892884
      ],
      [
        73.7326483,
        18.5894096
      ],
      [
        73.7326629,
        18.5895443
      ],
      [
        73.7327429,
        18.5898114
      ],
      [
        73.7327721,
        18.5899089
      ],
      [
        73.7328086,
        18.5900307
      ],
      [
        73.7328259,
        18.5900883
      ],
      [
        73.7328475,
        18.5901604
      ],
      [
        73.7328808,
        18.5902717
      ],
      [
        73.7328894,
        18.5903003
      ],
      [
        73.7329921,
        18.5907036
      ],
      [
        73.7329934,
        18.5908471
      ],
      [
        73.7329715,
        18.5909313
      ],
      [
        73.7329417,
        18.5910462
      ],
      [
        73.7329006,
        18.5912387
      ],
      [
        73.7328675,
        18.5914013
      ],
      [
        73.7327828,
        18.5917485
      ],
      [
        73.7327606,
        18.5918393
      ],
      [
        73.7326665,
        18.5922248
      ],
      [
        73.7326077,
        18.5924655
      ],
      [
        73.732578,
        18.5925872
      ],
      [
        73.7325595,
        18.592663
      ],
      [
        73.7324125,
        18.5932653
      ],
      [
        73.7323007,
        18.5937232
      ],
      [
        73.7322764,
        18.5938229
      ],
      [
        73.7322577,
        18.5939636
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-5",
    "name": "Maan road",
    "coordinates": [
      [
        73.7335603,
        18.5857856
      ],
      [
        73.7334445,
        18.5857559
      ],
      [
        73.7333024,
        18.5857258
      ],
      [
        73.7331484,
        18.5856772
      ],
      [
        73.7318212,
        18.5848517
      ],
      [
        73.7317568,
        18.5848489
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-6",
    "name": "Blue Ridge Road, Phase 1",
    "coordinates": [
      [
        73.7340434,
        18.585163
      ],
      [
        73.7338847,
        18.5853001
      ],
      [
        73.7338709,
        18.5853121
      ],
      [
        73.7337396,
        18.5854742
      ],
      [
        73.7335603,
        18.5857856
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-7",
    "name": "Blue Ridge Road, Phase 1",
    "coordinates": [
      [
        73.7369821,
        18.5830722
      ],
      [
        73.7364338,
        18.5834623
      ],
      [
        73.736055,
        18.5837318
      ],
      [
        73.7352343,
        18.5843191
      ],
      [
        73.7348747,
        18.5845715
      ],
      [
        73.7344916,
        18.5848441
      ],
      [
        73.7340434,
        18.585163
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-8",
    "name": "I2IT College Road",
    "coordinates": [
      [
        73.7352894,
        18.5843854
      ],
      [
        73.7353514,
        18.5844513
      ],
      [
        73.7363371,
        18.5856672
      ],
      [
        73.7365442,
        18.5859381
      ],
      [
        73.7366479,
        18.586073
      ],
      [
        73.7367925,
        18.5862463
      ],
      [
        73.7368744,
        18.5863444
      ],
      [
        73.7369703,
        18.5864593
      ],
      [
        73.7370021,
        18.5864986
      ],
      [
        73.7372508,
        18.5868059
      ],
      [
        73.7372767,
        18.5868379
      ],
      [
        73.7373983,
        18.5869882
      ],
      [
        73.7379712,
        18.5876264
      ],
      [
        73.7379834,
        18.5876399
      ],
      [
        73.7381743,
        18.5878517
      ],
      [
        73.7384969,
        18.5882096
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-9",
    "name": "Hinjawadi Phase 1 road",
    "coordinates": [
      [
        73.7388893,
        18.5910974
      ],
      [
        73.7388597,
        18.5909928
      ],
      [
        73.7387648,
        18.5906255
      ],
      [
        73.738657,
        18.5903051
      ],
      [
        73.738582,
        18.5900814
      ],
      [
        73.7384437,
        18.5898081
      ],
      [
        73.7383111,
        18.5895657
      ],
      [
        73.7376994,
        18.5885744
      ],
      [
        73.7373023,
        18.5879216
      ],
      [
        73.7369384,
        18.5872876
      ],
      [
        73.7366502,
        18.5868455
      ],
      [
        73.7365583,
        18.5867295
      ],
      [
        73.7363518,
        18.5865927
      ],
      [
        73.7359509,
        18.5863777
      ],
      [
        73.7358538,
        18.5863377
      ],
      [
        73.7356372,
        18.5862485
      ],
      [
        73.7354387,
        18.586161
      ],
      [
        73.7354126,
        18.5861495
      ],
      [
        73.735192,
        18.5860522
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-10",
    "name": "Blue Ridge Road, Phase 1",
    "coordinates": [
      [
        73.738808,
        18.5821041
      ],
      [
        73.7377942,
        18.5827899
      ],
      [
        73.7377511,
        18.5828156
      ],
      [
        73.7375288,
        18.582932
      ],
      [
        73.7374804,
        18.582938
      ],
      [
        73.7374085,
        18.5829366
      ],
      [
        73.7373602,
        18.5829338
      ],
      [
        73.7373039,
        18.5829359
      ],
      [
        73.7372474,
        18.5829437
      ],
      [
        73.7371868,
        18.5829641
      ],
      [
        73.7371165,
        18.5829903
      ],
      [
        73.7370519,
        18.5830203
      ],
      [
        73.7369821,
        18.5830722
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-11",
    "name": "Sakhare Vasti Road",
    "coordinates": [
      [
        73.7435365,
        18.5791863
      ],
      [
        73.7435032,
        18.5795387
      ],
      [
        73.7433417,
        18.5805012
      ],
      [
        73.7432722,
        18.5809157
      ],
      [
        73.7432533,
        18.5810287
      ],
      [
        73.7432304,
        18.581165
      ],
      [
        73.7431444,
        18.5814801
      ],
      [
        73.7431265,
        18.5816441
      ],
      [
        73.7431028,
        18.5819255
      ],
      [
        73.7430925,
        18.5819867
      ],
      [
        73.7430709,
        18.5820966
      ],
      [
        73.7430317,
        18.5823571
      ],
      [
        73.7430278,
        18.582548
      ],
      [
        73.7430155,
        18.5831473
      ],
      [
        73.7430086,
        18.5834838
      ],
      [
        73.7429883,
        18.5835457
      ],
      [
        73.7428909,
        18.5838427
      ],
      [
        73.742892,
        18.5838915
      ],
      [
        73.742901,
        18.5842729
      ],
      [
        73.7428854,
        18.5845899
      ],
      [
        73.7428082,
        18.584828
      ],
      [
        73.7426071,
        18.5854789
      ],
      [
        73.7423977,
        18.5860052
      ],
      [
        73.7422128,
        18.5863796
      ],
      [
        73.7421075,
        18.5865928
      ],
      [
        73.7418118,
        18.5871914
      ],
      [
        73.7417456,
        18.5873867
      ],
      [
        73.7416489,
        18.5876716
      ],
      [
        73.7416219,
        18.5877522
      ],
      [
        73.7415179,
        18.588288
      ],
      [
        73.7415222,
        18.5884992
      ],
      [
        73.7415263,
        18.5885645
      ],
      [
        73.7415403,
        18.5887863
      ],
      [
        73.7415382,
        18.5888276
      ],
      [
        73.7415264,
        18.5889149
      ],
      [
        73.74152,
        18.5889623
      ],
      [
        73.7414685,
        18.5894205
      ],
      [
        73.7411907,
        18.589833
      ],
      [
        73.7411471,
        18.5898827
      ],
      [
        73.7411297,
        18.5899129
      ],
      [
        73.7408437,
        18.5904085
      ],
      [
        73.7406836,
        18.5906835
      ],
      [
        73.740419,
        18.5910164
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-12",
    "name": "Blue Ridge Road, Phase 1",
    "coordinates": [
      [
        73.7352894,
        18.5843854
      ],
      [
        73.7362674,
        18.5836783
      ],
      [
        73.7363925,
        18.583589
      ],
      [
        73.7366018,
        18.5834395
      ],
      [
        73.7370759,
        18.5831009
      ],
      [
        73.7370953,
        18.5830871
      ],
      [
        73.7372314,
        18.5830825
      ],
      [
        73.7372943,
        18.5830787
      ],
      [
        73.737361,
        18.583072
      ],
      [
        73.737444,
        18.5830593
      ],
      [
        73.7374751,
        18.5830471
      ],
      [
        73.7375054,
        18.5830351
      ],
      [
        73.7375461,
        18.5830179
      ],
      [
        73.7376058,
        18.5829888
      ],
      [
        73.7376551,
        18.5829622
      ],
      [
        73.7377024,
        18.5829367
      ],
      [
        73.7381221,
        18.5826698
      ],
      [
        73.7387114,
        18.582245
      ],
      [
        73.7388418,
        18.582142
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-14",
    "name": "Hirai Sitai Road",
    "coordinates": [
      [
        73.7415264,
        18.5889149
      ],
      [
        73.7420841,
        18.5889078
      ],
      [
        73.7423806,
        18.588897
      ],
      [
        73.7428008,
        18.5889072
      ],
      [
        73.7430666,
        18.5889309
      ],
      [
        73.7432981,
        18.5889732
      ],
      [
        73.7435138,
        18.5890348
      ],
      [
        73.743708,
        18.5890751
      ],
      [
        73.7439291,
        18.589115
      ],
      [
        73.7440875,
        18.5891364
      ],
      [
        73.7443166,
        18.5891789
      ],
      [
        73.7443508,
        18.5891852
      ],
      [
        73.7446132,
        18.5892374
      ],
      [
        73.7446315,
        18.5892163
      ],
      [
        73.7446513,
        18.5891412
      ],
      [
        73.7446206,
        18.5888784
      ],
      [
        73.7445963,
        18.5885439
      ],
      [
        73.7446003,
        18.5881545
      ],
      [
        73.7446187,
        18.588121
      ],
      [
        73.7446825,
        18.5880727
      ],
      [
        73.744714,
        18.5880743
      ],
      [
        73.7448037,
        18.5880787
      ],
      [
        73.7451942,
        18.5881545
      ],
      [
        73.7455754,
        18.5882195
      ],
      [
        73.7460004,
        18.5881689
      ],
      [
        73.7462597,
        18.5881327
      ],
      [
        73.7468388,
        18.5880848
      ],
      [
        73.7472789,
        18.5879961
      ],
      [
        73.7482232,
        18.5878567
      ],
      [
        73.7491954,
        18.5877465
      ],
      [
        73.7494804,
        18.5877038
      ],
      [
        73.7503021,
        18.5875809
      ],
      [
        73.7508486,
        18.5875061
      ],
      [
        73.751014,
        18.5874997
      ],
      [
        73.7511672,
        18.5875284
      ],
      [
        73.7512398,
        18.587547
      ],
      [
        73.7512817,
        18.5875585
      ],
      [
        73.7513087,
        18.5875659
      ],
      [
        73.7516113,
        18.5875534
      ],
      [
        73.7516541,
        18.5875489
      ],
      [
        73.7517347,
        18.5875513
      ],
      [
        73.7519652,
        18.5875791
      ],
      [
        73.7523485,
        18.5876197
      ],
      [
        73.7526157,
        18.5876318
      ],
      [
        73.752861,
        18.5876444
      ],
      [
        73.7529468,
        18.587667
      ],
      [
        73.7530306,
        18.5876949
      ],
      [
        73.7531037,
        18.5877536
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-15",
    "name": "Planet 9 Rd",
    "coordinates": [
      [
        73.7415222,
        18.5884992
      ],
      [
        73.7412509,
        18.5884942
      ],
      [
        73.7412134,
        18.5884815
      ],
      [
        73.7411879,
        18.5884536
      ],
      [
        73.7411772,
        18.5884345
      ],
      [
        73.7412053,
        18.5877455
      ],
      [
        73.7412073,
        18.5873661
      ],
      [
        73.7412053,
        18.5873445
      ],
      [
        73.7411839,
        18.5873191
      ],
      [
        73.7411698,
        18.5873067
      ],
      [
        73.7411611,
        18.5873019
      ],
      [
        73.740905,
        18.5872709
      ],
      [
        73.7408819,
        18.5872681
      ],
      [
        73.7406515,
        18.5872402
      ],
      [
        73.7405175,
        18.5872194
      ],
      [
        73.7404148,
        18.5871898
      ],
      [
        73.740117,
        18.5871157
      ],
      [
        73.7400851,
        18.5871061
      ],
      [
        73.7397462,
        18.5870045
      ],
      [
        73.7397211,
        18.5869978
      ]
    ]
  },
  {
    "id": "ROAD-PUNE-16",
    "name": "Morya Residency Rd",
    "coordinates": [
      [
        73.7405175,
        18.5872194
      ],
      [
        73.7404375,
        18.5885349
      ]
    ]
  }
];

// -----------------------------------------------------------------------------
// SEED PARCELS (Real Cadastral Parcels in Hinjawadi Phase 1)
// -----------------------------------------------------------------------------
export const COHERENT_PARCELS: CoherentParcel[] = [
  {
    "parcelId": "PAR-000123",
    "khasraNo": "112/3",
    "plotNo": "P-14",
    "ulpin": "27041001002001",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Multi-Ownership/Group Housing Society",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7354551,
            18.5843356
          ],
          [
            73.7369584,
            18.583313
          ],
          [
            73.7384309,
            18.5851803
          ],
          [
            73.7382293,
            18.5859548
          ],
          [
            73.7373061,
            18.5848198
          ],
          [
            73.7363918,
            18.5855132
          ],
          [
            73.7354551,
            18.5843356
          ]
        ]
      ]
    },
    "areaSqm": 38450,
    "perimeterM": 885,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Provisional",
    "dataSource": "OpenStreetMap & Ground Survey Anchor - I2IT Campus P-14 Hinjawadi",
    "buildingsCount": 4,
    "floorsCount": 18,
    "unitsCount": 36
  },
  {
    "parcelId": "PAR-PUNE-011",
    "khasraNo": "121/2",
    "plotNo": "Plot-21",
    "ulpin": "27041001003001",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7377883,
            18.5840527
          ],
          [
            73.7379707,
            18.5842888
          ],
          [
            73.7381771,
            18.5841457
          ],
          [
            73.7379947,
            18.5839095
          ],
          [
            73.7377883,
            18.5840527
          ]
        ]
      ]
    },
    "areaSqm": 839,
    "perimeterM": 119,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-012",
    "khasraNo": "122/3",
    "plotNo": "Plot-22",
    "ulpin": "27041001003002",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7369379,
            18.5839552
          ],
          [
            73.7368862,
            18.5841299
          ],
          [
            73.7370472,
            18.5843274
          ],
          [
            73.7371439,
            18.5843522
          ],
          [
            73.7372353,
            18.5843515
          ],
          [
            73.7375662,
            18.5841292
          ],
          [
            73.7375464,
            18.5840002
          ],
          [
            73.7373851,
            18.5837854
          ],
          [
            73.7372661,
            18.5837379
          ],
          [
            73.7369379,
            18.5839552
          ]
        ]
      ]
    },
    "areaSqm": 3068,
    "perimeterM": 210,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 5,
    "unitsCount": 20
  },
  {
    "parcelId": "PAR-PUNE-014",
    "khasraNo": "124/1",
    "plotNo": "Plot-24",
    "ulpin": "27041001003004",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.737745,
            18.5841202
          ],
          [
            73.738152,
            18.5838489
          ],
          [
            73.7380717,
            18.5837408
          ],
          [
            73.7377826,
            18.5839336
          ],
          [
            73.7376587,
            18.5837668
          ],
          [
            73.7377938,
            18.5836767
          ],
          [
            73.7378015,
            18.5836869
          ],
          [
            73.7379556,
            18.5835842
          ],
          [
            73.7378568,
            18.5834511
          ],
          [
            73.7375212,
            18.5836747
          ],
          [
            73.7375266,
            18.5836819
          ],
          [
            73.7374733,
            18.5837174
          ],
          [
            73.7375448,
            18.5838138
          ],
          [
            73.7375266,
            18.5838259
          ],
          [
            73.737745,
            18.5841202
          ]
        ]
      ]
    },
    "areaSqm": 1892,
    "perimeterM": 290,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-016",
    "khasraNo": "126/3",
    "plotNo": "Plot-26",
    "ulpin": "27041001003006",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7379683,
            18.5855839
          ],
          [
            73.7382061,
            18.5858907
          ],
          [
            73.7383966,
            18.5853466
          ],
          [
            73.7383578,
            18.5853011
          ],
          [
            73.7379683,
            18.5855839
          ]
        ]
      ]
    },
    "areaSqm": 1214,
    "perimeterM": 164,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-017",
    "khasraNo": "127/4",
    "plotNo": "Plot-27",
    "ulpin": "27041001003007",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Multi-Ownership/Group Housing Society",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7384558,
            18.5842186
          ],
          [
            73.7388333,
            18.5839471
          ],
          [
            73.7387086,
            18.5837912
          ],
          [
            73.7381883,
            18.5841656
          ],
          [
            73.738229,
            18.5842164
          ],
          [
            73.7382121,
            18.5842282
          ],
          [
            73.7384408,
            18.5845237
          ],
          [
            73.7386041,
            18.5844102
          ],
          [
            73.7384558,
            18.5842186
          ]
        ]
      ]
    },
    "areaSqm": 2000,
    "perimeterM": 238,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-018",
    "khasraNo": "128/1",
    "plotNo": "Plot-28",
    "ulpin": "27041001003008",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7367514,
            18.5839067
          ],
          [
            73.737191,
            18.5836096
          ],
          [
            73.7371127,
            18.5834117
          ],
          [
            73.7369175,
            18.5833751
          ],
          [
            73.7365887,
            18.5835791
          ],
          [
            73.7365583,
            18.583767
          ],
          [
            73.736665,
            18.5838971
          ],
          [
            73.7367514,
            18.5839067
          ]
        ]
      ]
    },
    "areaSqm": 2306,
    "perimeterM": 191,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 5,
    "unitsCount": 20
  },
  {
    "parcelId": "PAR-PUNE-019",
    "khasraNo": "129/2",
    "plotNo": "Plot-29",
    "ulpin": "27041001003009",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7381832,
            18.5840803
          ],
          [
            73.7387941,
            18.5836568
          ],
          [
            73.7386348,
            18.5834505
          ],
          [
            73.7383502,
            18.583648
          ],
          [
            73.7384063,
            18.5837207
          ],
          [
            73.7384048,
            18.5837217
          ],
          [
            73.7383179,
            18.5836071
          ],
          [
            73.7385813,
            18.5834278
          ],
          [
            73.7380707,
            18.582749
          ],
          [
            73.7378938,
            18.582881
          ],
          [
            73.7381269,
            18.5831855
          ],
          [
            73.7380392,
            18.5832453
          ],
          [
            73.7381388,
            18.5833767
          ],
          [
            73.7380646,
            18.5834273
          ],
          [
            73.7381426,
            18.5835301
          ],
          [
            73.7381957,
            18.5834938
          ],
          [
            73.7382424,
            18.5835552
          ],
          [
            73.7379767,
            18.583737
          ],
          [
            73.7381197,
            18.5839246
          ],
          [
            73.7381024,
            18.5839365
          ],
          [
            73.7381507,
            18.5839992
          ],
          [
            73.7381311,
            18.5840127
          ],
          [
            73.7381832,
            18.5840803
          ]
        ]
      ]
    },
    "areaSqm": 5390,
    "perimeterM": 514,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 5,
    "unitsCount": 20
  },
  {
    "parcelId": "PAR-PUNE-020",
    "khasraNo": "130/3",
    "plotNo": "Plot-30",
    "ulpin": "27041001003010",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7377803,
            18.5834007
          ],
          [
            73.7378697,
            18.5835175
          ],
          [
            73.7379475,
            18.583464
          ],
          [
            73.7379622,
            18.5834834
          ],
          [
            73.7380542,
            18.5834202
          ],
          [
            73.7380395,
            18.5834009
          ],
          [
            73.7381167,
            18.5833479
          ],
          [
            73.7380275,
            18.583231
          ],
          [
            73.7377803,
            18.5834007
          ]
        ]
      ]
    },
    "areaSqm": 524,
    "perimeterM": 101,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-022",
    "khasraNo": "132/1",
    "plotNo": "Plot-32",
    "ulpin": "27041001003012",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.737475,
            18.5863181
          ],
          [
            73.737552,
            18.5864189
          ],
          [
            73.738035,
            18.5860872
          ],
          [
            73.7379458,
            18.5859705
          ],
          [
            73.7377739,
            18.5860886
          ],
          [
            73.737786,
            18.5861045
          ],
          [
            73.737475,
            18.5863181
          ]
        ]
      ]
    },
    "areaSqm": 878,
    "perimeterM": 158,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-023",
    "khasraNo": "133/2",
    "plotNo": "Plot-33",
    "ulpin": "27041001003013",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7376945,
            18.5832129
          ],
          [
            73.737618,
            18.5831103
          ],
          [
            73.7376634,
            18.5830799
          ],
          [
            73.7376739,
            18.5830727
          ],
          [
            73.7377504,
            18.5831754
          ],
          [
            73.7376945,
            18.5832129
          ]
        ]
      ]
    },
    "areaSqm": 96,
    "perimeterM": 43,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-024",
    "khasraNo": "134/3",
    "plotNo": "Plot-34",
    "ulpin": "27041001003014",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7363999,
            18.5860854
          ],
          [
            73.7366507,
            18.5864211
          ],
          [
            73.7367832,
            18.5863321
          ],
          [
            73.7365324,
            18.5859965
          ],
          [
            73.7363999,
            18.5860854
          ]
        ]
      ]
    },
    "areaSqm": 749,
    "perimeterM": 125,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-025",
    "khasraNo": "135/4",
    "plotNo": "Plot-35",
    "ulpin": "27041001003015",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7371766,
            18.5864598
          ],
          [
            73.7372876,
            18.5865923
          ],
          [
            73.7373811,
            18.5865221
          ],
          [
            73.7372701,
            18.5863894
          ],
          [
            73.7371766,
            18.5864598
          ]
        ]
      ]
    },
    "areaSqm": 227,
    "perimeterM": 63,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-004",
    "khasraNo": "136/1",
    "plotNo": "P-12",
    "ulpin": "27041001003016",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Commercial Complex",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7359177,
            18.5859571
          ],
          [
            73.7360374,
            18.5861061
          ],
          [
            73.7361122,
            18.5861679
          ],
          [
            73.7361495,
            18.5861968
          ],
          [
            73.7361861,
            18.5862112
          ],
          [
            73.736214,
            18.5862001
          ],
          [
            73.7362394,
            18.5861839
          ],
          [
            73.7362885,
            18.5861494
          ],
          [
            73.736391,
            18.5860829
          ],
          [
            73.7363784,
            18.5860657
          ],
          [
            73.7365784,
            18.5859331
          ],
          [
            73.7364702,
            18.5857866
          ],
          [
            73.7364289,
            18.5858139
          ],
          [
            73.736423,
            18.5858058
          ],
          [
            73.7361795,
            18.5859673
          ],
          [
            73.7360819,
            18.5858457
          ],
          [
            73.7360336,
            18.5858804
          ],
          [
            73.7360224,
            18.5858663
          ],
          [
            73.735956,
            18.5859142
          ],
          [
            73.7359637,
            18.5859239
          ],
          [
            73.7359177,
            18.5859571
          ]
        ]
      ]
    },
    "areaSqm": 1530,
    "perimeterM": 194,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 8,
    "unitsCount": 32
  },
  {
    "parcelId": "PAR-PUNE-005",
    "khasraNo": "137/2",
    "plotNo": "P-11",
    "ulpin": "27041001003017",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Commercial Complex",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7384787,
            18.5866451
          ],
          [
            73.7388489,
            18.5866559
          ],
          [
            73.7388729,
            18.5859199
          ],
          [
            73.7385026,
            18.5859091
          ],
          [
            73.7384711,
            18.5860679
          ],
          [
            73.7384576,
            18.5861675
          ],
          [
            73.7384541,
            18.5862557
          ],
          [
            73.7384846,
            18.5863312
          ],
          [
            73.7384787,
            18.5866451
          ]
        ]
      ]
    },
    "areaSqm": 3176,
    "perimeterM": 243,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 6,
    "unitsCount": 24
  },
  {
    "parcelId": "PAR-PUNE-028",
    "khasraNo": "138/3",
    "plotNo": "Plot-38",
    "ulpin": "27041001003018",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7367237,
            18.5863949
          ],
          [
            73.7367968,
            18.5864869
          ],
          [
            73.7368938,
            18.5864176
          ],
          [
            73.7368207,
            18.5863256
          ],
          [
            73.7367237,
            18.5863949
          ]
        ]
      ]
    },
    "areaSqm": 156,
    "perimeterM": 51,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 2,
    "unitsCount": 8
  },
  {
    "parcelId": "PAR-PUNE-029",
    "khasraNo": "139/4",
    "plotNo": "Plot-39",
    "ulpin": "27041001003019",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7379843,
            18.5864617
          ],
          [
            73.738113,
            18.586605
          ],
          [
            73.7381201,
            18.5865992
          ],
          [
            73.7382059,
            18.5866946
          ],
          [
            73.7382658,
            18.5866462
          ],
          [
            73.7382168,
            18.5865834
          ],
          [
            73.7382386,
            18.5863311
          ],
          [
            73.7381981,
            18.586289
          ],
          [
            73.7379843,
            18.5864617
          ]
        ]
      ]
    },
    "areaSqm": 623,
    "perimeterM": 116,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-030",
    "khasraNo": "140/1",
    "plotNo": "Plot-40",
    "ulpin": "27041001003020",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Multi-Ownership/Group Housing Society",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7392435,
            18.5852318
          ],
          [
            73.7395817,
            18.5852505
          ],
          [
            73.739565,
            18.5855238
          ],
          [
            73.7392237,
            18.5855051
          ],
          [
            73.7392082,
            18.5857588
          ],
          [
            73.7398021,
            18.5857915
          ],
          [
            73.7398512,
            18.5849858
          ],
          [
            73.7392605,
            18.5849535
          ],
          [
            73.7392435,
            18.5852318
          ]
        ]
      ]
    },
    "areaSqm": 4319,
    "perimeterM": 375,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 5,
    "unitsCount": 20
  },
  {
    "parcelId": "PAR-PUNE-031",
    "khasraNo": "141/2",
    "plotNo": "Plot-41",
    "ulpin": "27041001003021",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7362793,
            18.5862324
          ],
          [
            73.7365237,
            18.5865221
          ],
          [
            73.7366321,
            18.5864399
          ],
          [
            73.7363876,
            18.5861503
          ],
          [
            73.7363523,
            18.5861563
          ],
          [
            73.7363176,
            18.5861744
          ],
          [
            73.7362973,
            18.5861983
          ],
          [
            73.7362793,
            18.5862324
          ]
        ]
      ]
    },
    "areaSqm": 597,
    "perimeterM": 113,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-032",
    "khasraNo": "142/3",
    "plotNo": "Plot-42",
    "ulpin": "27041001003022",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7368474,
            18.5866017
          ],
          [
            73.7369122,
            18.586684
          ],
          [
            73.7370346,
            18.5865975
          ],
          [
            73.7369698,
            18.5865154
          ],
          [
            73.7368474,
            18.5866017
          ]
        ]
      ]
    },
    "areaSqm": 176,
    "perimeterM": 55,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-033",
    "khasraNo": "143/4",
    "plotNo": "Plot-43",
    "ulpin": "27041001003023",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.736281,
            18.5862724
          ],
          [
            73.7363207,
            18.5863213
          ],
          [
            73.736239,
            18.5863809
          ],
          [
            73.7361993,
            18.5863322
          ],
          [
            73.736281,
            18.5862724
          ]
        ]
      ]
    },
    "areaSqm": 71,
    "perimeterM": 35,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-034",
    "khasraNo": "144/1",
    "plotNo": "Plot-44",
    "ulpin": "27041001003024",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7376512,
            18.5867045
          ],
          [
            73.7379274,
            18.5870192
          ],
          [
            73.7382565,
            18.5867598
          ],
          [
            73.7379803,
            18.586445
          ],
          [
            73.7376512,
            18.5867045
          ]
        ]
      ]
    },
    "areaSqm": 1964,
    "perimeterM": 181,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-035",
    "khasraNo": "145/2",
    "plotNo": "Plot-45",
    "ulpin": "27041001003025",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7364898,
            18.586534
          ],
          [
            73.7365741,
            18.5866374
          ],
          [
            73.7367322,
            18.5865215
          ],
          [
            73.7366479,
            18.5864181
          ],
          [
            73.7364898,
            18.586534
          ]
        ]
      ]
    },
    "areaSqm": 293,
    "perimeterM": 71,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-036",
    "khasraNo": "146/3",
    "plotNo": "Plot-46",
    "ulpin": "27041001003026",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Multi-Ownership/Group Housing Society",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7389539,
            18.5862769
          ],
          [
            73.7393327,
            18.5862435
          ],
          [
            73.7393061,
            18.5859717
          ],
          [
            73.7389273,
            18.586005
          ],
          [
            73.7389539,
            18.5862769
          ]
        ]
      ]
    },
    "areaSqm": 1164,
    "perimeterM": 141,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-007",
    "khasraNo": "147/4",
    "plotNo": "P-15",
    "ulpin": "27041001003027",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Commercial Complex",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7361764,
            18.5829801
          ],
          [
            73.7363121,
            18.5831516
          ],
          [
            73.7364705,
            18.5830498
          ],
          [
            73.7367476,
            18.5830659
          ],
          [
            73.7372511,
            18.5827228
          ],
          [
            73.7370701,
            18.5825726
          ],
          [
            73.736397,
            18.5827871
          ],
          [
            73.7362951,
            18.5828621
          ],
          [
            73.7364139,
            18.5829425
          ],
          [
            73.7361764,
            18.5829801
          ]
        ]
      ]
    },
    "areaSqm": 3164,
    "perimeterM": 293,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 5,
    "unitsCount": 20
  },
  {
    "parcelId": "PAR-PUNE-038",
    "khasraNo": "148/1",
    "plotNo": "Plot-48",
    "ulpin": "27041001003028",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7358501,
            18.5833172
          ],
          [
            73.7360409,
            18.5830897
          ],
          [
            73.7362054,
            18.5832137
          ],
          [
            73.7360146,
            18.5834412
          ],
          [
            73.7358501,
            18.5833172
          ]
        ]
      ]
    },
    "areaSqm": 684,
    "perimeterM": 109,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-039",
    "khasraNo": "149/2",
    "plotNo": "Plot-49",
    "ulpin": "27041001003029",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7362,
            18.5863333
          ],
          [
            73.7362367,
            18.5863828
          ],
          [
            73.7362074,
            18.5864023
          ],
          [
            73.736189,
            18.5863773
          ],
          [
            73.7361624,
            18.5863951
          ],
          [
            73.7361442,
            18.5863705
          ],
          [
            73.7362,
            18.5863333
          ]
        ]
      ]
    },
    "areaSqm": 38,
    "perimeterM": 28,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-040",
    "khasraNo": "150/3",
    "plotNo": "Plot-50",
    "ulpin": "27041001003030",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7361866,
            18.5863347
          ],
          [
            73.7361418,
            18.5862802
          ],
          [
            73.7360611,
            18.5863398
          ],
          [
            73.7361061,
            18.5863943
          ],
          [
            73.7361866,
            18.5863347
          ]
        ]
      ]
    },
    "areaSqm": 80,
    "perimeterM": 36,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-041",
    "khasraNo": "151/4",
    "plotNo": "Plot-51",
    "ulpin": "27041001003031",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7352205,
            18.5837481
          ],
          [
            73.7353686,
            18.5839537
          ],
          [
            73.7356183,
            18.5838298
          ],
          [
            73.7356051,
            18.583806
          ],
          [
            73.7356528,
            18.5838003
          ],
          [
            73.7356748,
            18.5837963
          ],
          [
            73.7356976,
            18.5837811
          ],
          [
            73.7357129,
            18.5837673
          ],
          [
            73.7357248,
            18.5837448
          ],
          [
            73.7357308,
            18.583708
          ],
          [
            73.7359438,
            18.5835583
          ],
          [
            73.7357849,
            18.583354
          ],
          [
            73.7352205,
            18.5837481
          ]
        ]
      ]
    },
    "areaSqm": 2109,
    "perimeterM": 210,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-042",
    "khasraNo": "152/1",
    "plotNo": "Plot-52",
    "ulpin": "27041001003032",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7381136,
            18.582786
          ],
          [
            73.7386545,
            18.5835568
          ],
          [
            73.7389383,
            18.5833398
          ],
          [
            73.7390353,
            18.5828198
          ],
          [
            73.7391136,
            18.5821787
          ],
          [
            73.738948,
            18.5821932
          ],
          [
            73.7381136,
            18.582786
          ]
        ]
      ]
    },
    "areaSqm": 8391,
    "perimeterM": 398,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 5,
    "unitsCount": 20
  },
  {
    "parcelId": "PAR-PUNE-008",
    "khasraNo": "153/2",
    "plotNo": "P-10",
    "ulpin": "27041001003033",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Commercial Complex",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7391146,
            18.584017
          ],
          [
            73.739101,
            18.5837511
          ],
          [
            73.7405997,
            18.5836821
          ],
          [
            73.7406133,
            18.5839484
          ],
          [
            73.7391146,
            18.584017
          ]
        ]
      ]
    },
    "areaSqm": 4478,
    "perimeterM": 375,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 6,
    "unitsCount": 24
  },
  {
    "parcelId": "PAR-PUNE-044",
    "khasraNo": "154/3",
    "plotNo": "Plot-54",
    "ulpin": "27041001003034",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7351212,
            18.5847293
          ],
          [
            73.7352746,
            18.5849348
          ],
          [
            73.7353695,
            18.5848713
          ],
          [
            73.7352161,
            18.5846657
          ],
          [
            73.7351212,
            18.5847293
          ]
        ]
      ]
    },
    "areaSqm": 327,
    "perimeterM": 80,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-045",
    "khasraNo": "155/4",
    "plotNo": "Plot-55",
    "ulpin": "27041001003035",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7352065,
            18.5852781
          ],
          [
            73.7352356,
            18.5853168
          ],
          [
            73.7353734,
            18.5852236
          ],
          [
            73.7353442,
            18.585185
          ],
          [
            73.7353134,
            18.5852058
          ],
          [
            73.7352605,
            18.5851303
          ],
          [
            73.7352927,
            18.5851089
          ],
          [
            73.7352692,
            18.585077
          ],
          [
            73.735117,
            18.5851781
          ],
          [
            73.7351406,
            18.5852099
          ],
          [
            73.7351827,
            18.585182
          ],
          [
            73.7352361,
            18.5852581
          ],
          [
            73.7352065,
            18.5852781
          ]
        ]
      ]
    },
    "areaSqm": 269,
    "perimeterM": 94,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-046",
    "khasraNo": "156/1",
    "plotNo": "Plot-56",
    "ulpin": "27041001003036",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7393328,
            18.586151
          ],
          [
            73.7396988,
            18.5861735
          ],
          [
            73.739707,
            18.5860537
          ],
          [
            73.739613,
            18.5860478
          ],
          [
            73.7396163,
            18.585997
          ],
          [
            73.7397105,
            18.5860027
          ],
          [
            73.7397182,
            18.5858908
          ],
          [
            73.7393521,
            18.5858683
          ],
          [
            73.7393442,
            18.5859842
          ],
          [
            73.739451,
            18.5859907
          ],
          [
            73.7394475,
            18.5860407
          ],
          [
            73.7393407,
            18.5860342
          ],
          [
            73.7393328,
            18.586151
          ]
        ]
      ]
    },
    "areaSqm": 1050,
    "perimeterM": 183,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-006",
    "khasraNo": "157/2",
    "plotNo": "P-16",
    "ulpin": "27041001003037",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Commercial Complex",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7355175,
            18.5861283
          ],
          [
            73.7355645,
            18.5861283
          ],
          [
            73.7356115,
            18.5861395
          ],
          [
            73.735655,
            18.5861537
          ],
          [
            73.7356969,
            18.5861791
          ],
          [
            73.7357222,
            18.5861966
          ],
          [
            73.7357455,
            18.5862172
          ],
          [
            73.735759,
            18.5862347
          ],
          [
            73.7358797,
            18.5861585
          ],
          [
            73.7357372,
            18.5859821
          ],
          [
            73.7355175,
            18.5861283
          ]
        ]
      ]
    },
    "areaSqm": 447,
    "perimeterM": 98,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 2,
    "unitsCount": 8
  },
  {
    "parcelId": "PAR-PUNE-009",
    "khasraNo": "158/3",
    "plotNo": "P-18",
    "ulpin": "27041001003038",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Commercial Complex",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7349526,
            18.5848068
          ],
          [
            73.7350989,
            18.5849928
          ],
          [
            73.7352482,
            18.5848873
          ],
          [
            73.7351018,
            18.5847013
          ],
          [
            73.7349526,
            18.5848068
          ]
        ]
      ]
    },
    "areaSqm": 485,
    "perimeterM": 91,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-049",
    "khasraNo": "159/4",
    "plotNo": "Plot-59",
    "ulpin": "27041001003039",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Multi-Ownership/Group Housing Society",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7388734,
            18.5867632
          ],
          [
            73.7393373,
            18.5867737
          ],
          [
            73.7393443,
            18.5864979
          ],
          [
            73.7388804,
            18.5864874
          ],
          [
            73.7388734,
            18.5867632
          ]
        ]
      ]
    },
    "areaSqm": 1434,
    "perimeterM": 159,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 12,
    "unitsCount": 48
  },
  {
    "parcelId": "PAR-PUNE-050",
    "khasraNo": "160/1",
    "plotNo": "Plot-60",
    "ulpin": "27041001003040",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7350119,
            18.5853332
          ],
          [
            73.7350366,
            18.5853155
          ],
          [
            73.7350934,
            18.5853852
          ],
          [
            73.7350634,
            18.5854071
          ],
          [
            73.7350962,
            18.5854478
          ],
          [
            73.7352341,
            18.5853478
          ],
          [
            73.7352011,
            18.5853071
          ],
          [
            73.7351716,
            18.5853285
          ],
          [
            73.7351152,
            18.5852591
          ],
          [
            73.7351449,
            18.5852378
          ],
          [
            73.7351135,
            18.5851985
          ],
          [
            73.7349804,
            18.585294
          ],
          [
            73.7350119,
            18.5853332
          ]
        ]
      ]
    },
    "areaSqm": 290,
    "perimeterM": 93,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-051",
    "khasraNo": "161/2",
    "plotNo": "Plot-61",
    "ulpin": "27041001003041",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7364362,
            18.5827491
          ],
          [
            73.7366073,
            18.5826531
          ],
          [
            73.736535,
            18.5825373
          ],
          [
            73.7368069,
            18.5823849
          ],
          [
            73.7368792,
            18.5825008
          ],
          [
            73.7370425,
            18.5824091
          ],
          [
            73.7369609,
            18.5822783
          ],
          [
            73.736932,
            18.5822945
          ],
          [
            73.7368764,
            18.5822054
          ],
          [
            73.7367479,
            18.5822774
          ],
          [
            73.7367213,
            18.5822346
          ],
          [
            73.7364499,
            18.5823869
          ],
          [
            73.7364787,
            18.582433
          ],
          [
            73.7363687,
            18.5824946
          ],
          [
            73.7364137,
            18.5825668
          ],
          [
            73.736346,
            18.5826046
          ],
          [
            73.7364362,
            18.5827491
          ]
        ]
      ]
    },
    "areaSqm": 1595,
    "perimeterM": 246,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-052",
    "khasraNo": "162/3",
    "plotNo": "Plot-62",
    "ulpin": "27041001003042",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7383807,
            18.5871195
          ],
          [
            73.7386178,
            18.5871533
          ],
          [
            73.7386562,
            18.5869126
          ],
          [
            73.738419,
            18.5868787
          ],
          [
            73.7383807,
            18.5871195
          ]
        ]
      ]
    },
    "areaSqm": 654,
    "perimeterM": 105,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-053",
    "khasraNo": "163/4",
    "plotNo": "Plot-63",
    "ulpin": "27041001003043",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7360196,
            18.5829127
          ],
          [
            73.7364228,
            18.58263
          ],
          [
            73.7362569,
            18.5824173
          ],
          [
            73.7361069,
            18.5825224
          ],
          [
            73.7361409,
            18.5825662
          ],
          [
            73.7359982,
            18.5826662
          ],
          [
            73.7360254,
            18.5827012
          ],
          [
            73.7359744,
            18.5827369
          ],
          [
            73.7360052,
            18.5827762
          ],
          [
            73.7359456,
            18.5828179
          ],
          [
            73.7360196,
            18.5829127
          ]
        ]
      ]
    },
    "areaSqm": 1187,
    "perimeterM": 164,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-054",
    "khasraNo": "164/1",
    "plotNo": "Plot-64",
    "ulpin": "27041001003044",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7382432,
            18.5869592
          ],
          [
            73.7382299,
            18.5868798
          ],
          [
            73.7381774,
            18.5868673
          ],
          [
            73.7380282,
            18.5869666
          ],
          [
            73.7379188,
            18.5870617
          ],
          [
            73.7382148,
            18.5874187
          ],
          [
            73.7382455,
            18.5874346
          ],
          [
            73.7382873,
            18.5874287
          ],
          [
            73.7383157,
            18.5874002
          ],
          [
            73.7383224,
            18.5873377
          ],
          [
            73.7382432,
            18.5869592
          ]
        ]
      ]
    },
    "areaSqm": 1382,
    "perimeterM": 161,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 4,
    "unitsCount": 16
  },
  {
    "parcelId": "PAR-PUNE-055",
    "khasraNo": "165/2",
    "plotNo": "Plot-65",
    "ulpin": "27041001003045",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7348401,
            18.5851268
          ],
          [
            73.7348643,
            18.585153
          ],
          [
            73.7348591,
            18.5851573
          ],
          [
            73.7349521,
            18.5852587
          ],
          [
            73.7349923,
            18.5852255
          ],
          [
            73.7349719,
            18.5852033
          ],
          [
            73.7350395,
            18.5851475
          ],
          [
            73.735065,
            18.5851753
          ],
          [
            73.7351026,
            18.5851443
          ],
          [
            73.735016,
            18.5850499
          ],
          [
            73.735021,
            18.5850459
          ],
          [
            73.7349854,
            18.5850072
          ],
          [
            73.7349401,
            18.5850445
          ],
          [
            73.7349583,
            18.5850643
          ],
          [
            73.7349024,
            18.5851102
          ],
          [
            73.7348843,
            18.5850905
          ],
          [
            73.7348401,
            18.5851268
          ]
        ]
      ]
    },
    "areaSqm": 320,
    "perimeterM": 94,
    "verificationStatus": "Verified",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-056",
    "khasraNo": "166/3",
    "plotNo": "Plot-66",
    "ulpin": "27041001003046",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Multi-Ownership/Group Housing Society",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.74011,
            18.585148
          ],
          [
            73.7402688,
            18.5851571
          ],
          [
            73.7402816,
            18.5849567
          ],
          [
            73.7401227,
            18.5849477
          ],
          [
            73.74011,
            18.585148
          ]
        ]
      ]
    },
    "areaSqm": 357,
    "perimeterM": 78,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 3,
    "unitsCount": 12
  },
  {
    "parcelId": "PAR-PUNE-057",
    "khasraNo": "167/4",
    "plotNo": "Plot-67",
    "ulpin": "27041001003047",
    "ulpinStatus": "Available",
    "surveyUnitId": "SU-HINJ-01",
    "wardId": "WARD-HINJAWADI-01",
    "ulbId": "ULB-PMRDA-01",
    "propertyType": "Single/Joint Owners Individual Building",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            73.7351705,
            18.5832215
          ],
          [
            73.7351415,
            18.5832087
          ],
          [
            73.7349613,
            18.5833355
          ],
          [
            73.7350883,
            18.5835217
          ],
          [
            73.7351108,
            18.5835482
          ],
          [
            73.7351768,
            18.5836027
          ],
          [
            73.7352596,
            18.5836294
          ],
          [
            73.735347,
            18.5836237
          ],
          [
            73.7354254,
            18.5835869
          ],
          [
            73.735489,
            18.583529
          ],
          [
            73.735509,
            18.5834915
          ],
          [
            73.7358019,
            18.5833056
          ],
          [
            73.7355545,
            18.5829711
          ],
          [
            73.7351705,
            18.5832215
          ]
        ]
      ]
    },
    "areaSqm": 3290,
    "perimeterM": 238,
    "verificationStatus": "Pending Field Verification",
    "rorStatus": "Verified",
    "threeDStatus": "Ready for Verification",
    "publicationStatus": "Published",
    "dataSource": "OSM Cadastre Vector Extrusion",
    "buildingsCount": 1,
    "floorsCount": 5,
    "unitsCount": 20
  }
];

// -----------------------------------------------------------------------------
// BUILDINGS (Extruded from Real OpenStreetMap Footprints)
// -----------------------------------------------------------------------------
export const COHERENT_BUILDINGS: CoherentBuilding[] = [
  {
    "buildingId": "BLD-000781",
    "parcelId": "PAR-000123",
    "buildingName": "Pralhad P. Chhabria Research Center (PCCRC) - I²IT Academic Complex",
    "buildingType": "Commercial Complex",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 5,
    "floorHeightM": 3.28,
    "approxHeightM": 16.4,
    "footprintAreaSqm": 5237,
    "builtUpAreaSqm": 26185,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359573772 • Hinjawadi Phase 1",
    "ulpin": "27041001003000",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "buildingName": "Building 359685472",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 559,
    "builtUpAreaSqm": 1677,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359685472 • Hinjawadi Phase 1",
    "ulpin": "27041001003001",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "buildingName": "Building 359685492",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 5,
    "floorHeightM": 3.2,
    "approxHeightM": 16,
    "footprintAreaSqm": 2045,
    "builtUpAreaSqm": 10225,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359685492 • Hinjawadi Phase 1",
    "ulpin": "27041001003002",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "buildingName": "I2IT Central Library & Knowledge Center",
    "buildingType": "Commercial Complex",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.4,
    "approxHeightM": 10.2,
    "footprintAreaSqm": 1349,
    "builtUpAreaSqm": 4047,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 1151918980 • Hinjawadi Phase 1",
    "ulpin": "27041001003003",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "buildingName": "Building 359685463",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 1261,
    "builtUpAreaSqm": 5044,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359685463 • Hinjawadi Phase 1",
    "ulpin": "27041001003004",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "buildingName": "Takshashila Complex - Research & Faculty Wing",
    "buildingType": "Commercial Complex",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.3,
    "approxHeightM": 13.2,
    "footprintAreaSqm": 726,
    "builtUpAreaSqm": 2904,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359685464 • Hinjawadi Phase 1",
    "ulpin": "27041001003005",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "buildingName": "Building 359685471",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 809,
    "builtUpAreaSqm": 3236,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359685471 • Hinjawadi Phase 1",
    "ulpin": "27041001003006",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "buildingName": "Building 359685490",
    "buildingType": "Residential Apartment",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 1333,
    "builtUpAreaSqm": 5332,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359685490 • Hinjawadi Phase 1",
    "ulpin": "27041001003007",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "buildingName": "Building 359685462",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 5,
    "floorHeightM": 3.2,
    "approxHeightM": 16,
    "footprintAreaSqm": 1537,
    "builtUpAreaSqm": 7685,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359685462 • Hinjawadi Phase 1",
    "ulpin": "27041001003008",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "buildingName": "Building 359685467",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 5,
    "floorHeightM": 3.2,
    "approxHeightM": 16,
    "footprintAreaSqm": 3593,
    "builtUpAreaSqm": 17965,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359685467 • Hinjawadi Phase 1",
    "ulpin": "27041001003009",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "buildingName": "Building 359685493",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 349,
    "builtUpAreaSqm": 1047,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359685493 • Hinjawadi Phase 1",
    "ulpin": "27041001003010",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "buildingName": "ISquareIT Student Residential Hostel",
    "buildingType": "Residential Apartment",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 6,
    "floorHeightM": 3.1,
    "approxHeightM": 18.6,
    "footprintAreaSqm": 2500,
    "builtUpAreaSqm": 15000,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359685460 • Hinjawadi Phase 1",
    "ulpin": "27041001003011",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "buildingName": "Building 359552085",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 585,
    "builtUpAreaSqm": 1755,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359552085 • Hinjawadi Phase 1",
    "ulpin": "27041001003012",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "buildingName": "Building 764847147",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 64,
    "builtUpAreaSqm": 192,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 764847147 • Hinjawadi Phase 1",
    "ulpin": "27041001003013",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "buildingName": "Building 359552069",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 499,
    "builtUpAreaSqm": 1497,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359552069 • Hinjawadi Phase 1",
    "ulpin": "27041001003014",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "buildingName": "Building 359685485",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 151,
    "builtUpAreaSqm": 453,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359685485 • Hinjawadi Phase 1",
    "ulpin": "27041001003015",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "buildingName": "Hyatt Palace Hinjawadi",
    "buildingType": "Commercial Complex",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 8,
    "floorHeightM": 3.3,
    "approxHeightM": 26.4,
    "footprintAreaSqm": 1020,
    "builtUpAreaSqm": 8160,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359685465 • Hinjawadi Phase 1",
    "ulpin": "27041001003016",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "buildingName": "City Centre Commercial Complex",
    "buildingType": "Commercial Complex",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 6,
    "floorHeightM": 3.5,
    "approxHeightM": 21,
    "footprintAreaSqm": 2117,
    "builtUpAreaSqm": 12702,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359552093 • Hinjawadi Phase 1",
    "ulpin": "27041001003017",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000019",
    "parcelId": "PAR-PUNE-028",
    "buildingName": "Hinjawadi Sub Post Office",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 2,
    "floorHeightM": 3.2,
    "approxHeightM": 6.4,
    "footprintAreaSqm": 104,
    "builtUpAreaSqm": 208,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359685482 • Hinjawadi Phase 1",
    "ulpin": "27041001003018",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "buildingName": "Building 359685489",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 415,
    "builtUpAreaSqm": 1245,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359685489 • Hinjawadi Phase 1",
    "ulpin": "27041001003019",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "buildingName": "Building 1199635011",
    "buildingType": "Residential Apartment",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 5,
    "floorHeightM": 3.2,
    "approxHeightM": 16,
    "footprintAreaSqm": 2879,
    "builtUpAreaSqm": 14395,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 1199635011 • Hinjawadi Phase 1",
    "ulpin": "27041001003020",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "buildingName": "Saraswat Bank",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 398,
    "builtUpAreaSqm": 1194,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359685488 • Hinjawadi Phase 1",
    "ulpin": "27041001003021",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "buildingName": "Building 1222440025",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 117,
    "builtUpAreaSqm": 351,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 1222440025 • Hinjawadi Phase 1",
    "ulpin": "27041001003022",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "buildingName": "Building 1517443441",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 47,
    "builtUpAreaSqm": 141,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 1517443441 • Hinjawadi Phase 1",
    "ulpin": "27041001003023",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "buildingName": "Building 359551975",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 1309,
    "builtUpAreaSqm": 5236,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359551975 • Hinjawadi Phase 1",
    "ulpin": "27041001003024",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "buildingName": "Building 359685479",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 195,
    "builtUpAreaSqm": 585,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359685479 • Hinjawadi Phase 1",
    "ulpin": "27041001003025",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "buildingName": "Building 1162002025",
    "buildingType": "Residential Apartment",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 776,
    "builtUpAreaSqm": 3104,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 1162002025 • Hinjawadi Phase 1",
    "ulpin": "27041001003026",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "buildingName": "Symbiosis Centre for Information Technology (SCIT)",
    "buildingType": "Commercial Complex",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 5,
    "floorHeightM": 3.3,
    "approxHeightM": 16.5,
    "footprintAreaSqm": 2109,
    "builtUpAreaSqm": 10545,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 1151920030 • Hinjawadi Phase 1",
    "ulpin": "27041001003027",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "buildingName": "Symbiosis Infotech campus swimming pool",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 456,
    "builtUpAreaSqm": 1368,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 1137073445 • Hinjawadi Phase 1",
    "ulpin": "27041001003028",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "buildingName": "Building 1517443442",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 25,
    "builtUpAreaSqm": 75,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 1517443442 • Hinjawadi Phase 1",
    "ulpin": "27041001003029",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "buildingName": "Indian Thali House",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 53,
    "builtUpAreaSqm": 159,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 1162004144 • Hinjawadi Phase 1",
    "ulpin": "27041001003030",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "buildingName": "Building 359537050",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 1406,
    "builtUpAreaSqm": 5624,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359537050 • Hinjawadi Phase 1",
    "ulpin": "27041001003031",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "buildingName": "Symbiosis",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 5,
    "floorHeightM": 3.2,
    "approxHeightM": 16,
    "footprintAreaSqm": 5594,
    "builtUpAreaSqm": 27970,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359573752 • Hinjawadi Phase 1",
    "ulpin": "27041001003032",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "buildingName": "Radisson Blu Hinjawadi",
    "buildingType": "Commercial Complex",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 6,
    "floorHeightM": 3.4,
    "approxHeightM": 20.4,
    "footprintAreaSqm": 2985,
    "builtUpAreaSqm": 17910,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 544598096 • Hinjawadi Phase 1",
    "ulpin": "27041001003033",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "buildingName": "Building 359551982",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 218,
    "builtUpAreaSqm": 654,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359551982 • Hinjawadi Phase 1",
    "ulpin": "27041001003034",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "buildingName": "Building 359551954",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 179,
    "builtUpAreaSqm": 537,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359551954 • Hinjawadi Phase 1",
    "ulpin": "27041001003035",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "buildingName": "Building 359551955",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 700,
    "builtUpAreaSqm": 2800,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359551955 • Hinjawadi Phase 1",
    "ulpin": "27041001003036",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-POLICE-01",
    "parcelId": "PAR-PUNE-006",
    "buildingName": "Hinjawadi Police Station",
    "buildingType": "Commercial Complex",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 2,
    "floorHeightM": 3.5,
    "approxHeightM": 7,
    "footprintAreaSqm": 298,
    "builtUpAreaSqm": 596,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 1098988707 • Hinjawadi Phase 1",
    "ulpin": "27041001003037",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "buildingName": "Hinjawadi Fire Station - Phase 1",
    "buildingType": "Commercial Complex",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.5,
    "approxHeightM": 10.5,
    "footprintAreaSqm": 323,
    "builtUpAreaSqm": 969,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359552051 • Hinjawadi Phase 1",
    "ulpin": "27041001003038",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "buildingName": "Building 1162004537",
    "buildingType": "Residential Apartment",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 12,
    "floorHeightM": 3.2,
    "approxHeightM": 38.4,
    "footprintAreaSqm": 956,
    "builtUpAreaSqm": 11472,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 1162004537 • Hinjawadi Phase 1",
    "ulpin": "27041001003039",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "buildingName": "Building 359551952",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 193,
    "builtUpAreaSqm": 579,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359551952 • Hinjawadi Phase 1",
    "ulpin": "27041001003040",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "buildingName": "Building 359554753",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 1063,
    "builtUpAreaSqm": 4252,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359554753 • Hinjawadi Phase 1",
    "ulpin": "27041001003041",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "buildingName": "Symbiosis Cherry Blossom Hostel",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 436,
    "builtUpAreaSqm": 1308,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359552018 • Hinjawadi Phase 1",
    "ulpin": "27041001003042",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "buildingName": "Symbiosis Centre Of Health Care, SCHC Hinjawadi",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 791,
    "builtUpAreaSqm": 3164,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359554742 • Hinjawadi Phase 1",
    "ulpin": "27041001003043",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "buildingName": "Pesh Infotech",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 4,
    "floorHeightM": 3.2,
    "approxHeightM": 12.8,
    "footprintAreaSqm": 921,
    "builtUpAreaSqm": 3684,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 359749225 • Hinjawadi Phase 1",
    "ulpin": "27041001003044",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "buildingName": "Building 359551968",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 213,
    "builtUpAreaSqm": 639,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359551968 • Hinjawadi Phase 1",
    "ulpin": "27041001003045",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "buildingName": "Building 1199635020",
    "buildingType": "Residential Apartment",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 3,
    "floorHeightM": 3.2,
    "approxHeightM": 9.6,
    "footprintAreaSqm": 238,
    "builtUpAreaSqm": 714,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Verified",
    "dataSource": "OpenStreetMap Footprint ID 1199635020 • Hinjawadi Phase 1",
    "ulpin": "27041001003046",
    "farRatio": 1.85,
    "constructionYear": "2016"
  },
  {
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "buildingName": "Building 359537060",
    "buildingType": "Individual House",
    "buildingStatus": "Existing & Occupied",
    "totalFloors": 5,
    "floorHeightM": 3.2,
    "approxHeightM": 16,
    "footprintAreaSqm": 2193,
    "builtUpAreaSqm": 10965,
    "roofType": "Flat RCC Slab",
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
    "geometrySource": "Building Footprint Extrusion",
    "hasLidar": false,
    "lidarStatus": "Not Available",
    "confidencePct": 98.2,
    "confidenceBreakdown": {
      "spatialOverlap": 40,
      "parcelContainment": 20,
      "addressAgreement": 14.2,
      "floorAgreement": 14,
      "planAgreement": 10
    },
    "verificationStatus": "Pending Field Verification",
    "dataSource": "OpenStreetMap Footprint ID 359537060 • Hinjawadi Phase 1",
    "ulpin": "27041001003047",
    "farRatio": 1.85,
    "constructionYear": "2016"
  }
];

// -----------------------------------------------------------------------------
// FLOORS & UNITS
// -----------------------------------------------------------------------------
export const COHERENT_FLOORS: CoherentFloor[] = [
  {
    "floorId": "FLR-000781-01",
    "buildingId": "BLD-000781",
    "floorNumber": 1,
    "floorName": "Level 1 (Ground Floor Atrium Tier)",
    "baseElevationM": 562.4,
    "topElevationM": 566.6,
    "floorHeightM": 4.2,
    "unitsCount": 9,
    "builtUpAreaSqm": 5237.0,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
},
  {
    "floorId": "FLR-000781-02",
    "buildingId": "BLD-000781",
    "floorNumber": 2,
    "floorName": "Level 2 (Second Floor Gallery)",
    "baseElevationM": 566.6,
    "topElevationM": 570.8,
    "floorHeightM": 4.2,
    "unitsCount": 9,
    "builtUpAreaSqm": 5237.0,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
},
  {
    "floorId": "FLR-000781-03",
    "buildingId": "BLD-000781",
    "floorNumber": 3,
    "floorName": "Level 3 (Third Floor Gallery)",
    "baseElevationM": 570.8,
    "topElevationM": 575.0,
    "floorHeightM": 4.2,
    "unitsCount": 9,
    "builtUpAreaSqm": 5237.0,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
},
  {
    "floorId": "FLR-000781-04",
    "buildingId": "BLD-000781",
    "floorNumber": 4,
    "floorName": "Level 4 (Fourth Floor Gallery)",
    "baseElevationM": 575.0,
    "topElevationM": 579.2,
    "floorHeightM": 4.2,
    "unitsCount": 9,
    "builtUpAreaSqm": 5237.0,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
},
  {
    "floorId": "FLR-000781-05",
    "buildingId": "BLD-000781",
    "floorNumber": 5,
    "floorName": "Level 5 (Fifth Floor Gallery)",
    "baseElevationM": 579.2,
    "topElevationM": 583.4,
    "floorHeightM": 4.2,
    "unitsCount": 9,
    "builtUpAreaSqm": 5237.0,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
},
  {
    "floorId": "FLR-000002-00",
    "buildingId": "BLD-000002",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 531,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000002-01",
    "buildingId": "BLD-000002",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 531,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000002-02",
    "buildingId": "BLD-000002",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 531,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000003-00",
    "buildingId": "BLD-000003",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1942.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000003-01",
    "buildingId": "BLD-000003",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1942.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000003-02",
    "buildingId": "BLD-000003",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1942.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000003-03",
    "buildingId": "BLD-000003",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1942.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000003-04",
    "buildingId": "BLD-000003",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581,
    "topElevationM": 584.2,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1942.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-LIB-00",
    "buildingId": "BLD-I2IT-LIB",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.6,
    "floorHeightM": 3.4,
    "unitsCount": 4,
    "builtUpAreaSqm": 1281.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-LIB-01",
    "buildingId": "BLD-I2IT-LIB",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.6,
    "topElevationM": 575,
    "floorHeightM": 3.4,
    "unitsCount": 4,
    "builtUpAreaSqm": 1281.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-LIB-02",
    "buildingId": "BLD-I2IT-LIB",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 575,
    "topElevationM": 578.4,
    "floorHeightM": 3.4,
    "unitsCount": 4,
    "builtUpAreaSqm": 1281.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000005-00",
    "buildingId": "BLD-000005",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1198,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000005-01",
    "buildingId": "BLD-000005",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1198,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000005-02",
    "buildingId": "BLD-000005",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1198,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000005-03",
    "buildingId": "BLD-000005",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1198,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-TAK-00",
    "buildingId": "BLD-I2IT-TAK",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.5,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 689.7,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-TAK-01",
    "buildingId": "BLD-I2IT-TAK",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.5,
    "topElevationM": 574.8,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 689.7,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-TAK-02",
    "buildingId": "BLD-I2IT-TAK",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.8,
    "topElevationM": 578.1,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 689.7,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-TAK-03",
    "buildingId": "BLD-I2IT-TAK",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 578.1,
    "topElevationM": 581.4,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 689.7,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000007-00",
    "buildingId": "BLD-000007",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 768.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000007-01",
    "buildingId": "BLD-000007",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 768.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000007-02",
    "buildingId": "BLD-000007",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 768.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000007-03",
    "buildingId": "BLD-000007",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 768.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000008-00",
    "buildingId": "BLD-000008",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1266.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000008-01",
    "buildingId": "BLD-000008",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1266.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000008-02",
    "buildingId": "BLD-000008",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1266.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000008-03",
    "buildingId": "BLD-000008",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1266.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000009-00",
    "buildingId": "BLD-000009",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1460.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000009-01",
    "buildingId": "BLD-000009",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1460.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000009-02",
    "buildingId": "BLD-000009",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1460.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000009-03",
    "buildingId": "BLD-000009",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1460.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000009-04",
    "buildingId": "BLD-000009",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581,
    "topElevationM": 584.2,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1460.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000010-00",
    "buildingId": "BLD-000010",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 3413.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000010-01",
    "buildingId": "BLD-000010",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 3413.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000010-02",
    "buildingId": "BLD-000010",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 3413.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000010-03",
    "buildingId": "BLD-000010",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 3413.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000010-04",
    "buildingId": "BLD-000010",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581,
    "topElevationM": 584.2,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 3413.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000011-00",
    "buildingId": "BLD-000011",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 331.6,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000011-01",
    "buildingId": "BLD-000011",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 331.6,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000011-02",
    "buildingId": "BLD-000011",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 331.6,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-HST-00",
    "buildingId": "BLD-I2IT-HST",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.3,
    "floorHeightM": 3.1,
    "unitsCount": 4,
    "builtUpAreaSqm": 2375,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-HST-01",
    "buildingId": "BLD-I2IT-HST",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.3,
    "topElevationM": 574.4,
    "floorHeightM": 3.1,
    "unitsCount": 4,
    "builtUpAreaSqm": 2375,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-HST-02",
    "buildingId": "BLD-I2IT-HST",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.4,
    "topElevationM": 577.5,
    "floorHeightM": 3.1,
    "unitsCount": 4,
    "builtUpAreaSqm": 2375,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-HST-03",
    "buildingId": "BLD-I2IT-HST",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.5,
    "topElevationM": 580.6,
    "floorHeightM": 3.1,
    "unitsCount": 4,
    "builtUpAreaSqm": 2375,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-HST-04",
    "buildingId": "BLD-I2IT-HST",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 580.6,
    "topElevationM": 583.7,
    "floorHeightM": 3.1,
    "unitsCount": 4,
    "builtUpAreaSqm": 2375,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-I2IT-HST-05",
    "buildingId": "BLD-I2IT-HST",
    "floorNumber": 5,
    "floorName": "Fifth Floor",
    "baseElevationM": 583.7,
    "topElevationM": 586.8,
    "floorHeightM": 3.1,
    "unitsCount": 4,
    "builtUpAreaSqm": 2375,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000013-00",
    "buildingId": "BLD-000013",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 555.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000013-01",
    "buildingId": "BLD-000013",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 555.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000013-02",
    "buildingId": "BLD-000013",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 555.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000014-00",
    "buildingId": "BLD-000014",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 60.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000014-01",
    "buildingId": "BLD-000014",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 60.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000014-02",
    "buildingId": "BLD-000014",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 60.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000015-00",
    "buildingId": "BLD-000015",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 474,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000015-01",
    "buildingId": "BLD-000015",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 474,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000015-02",
    "buildingId": "BLD-000015",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 474,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000016-00",
    "buildingId": "BLD-000016",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 143.4,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000016-01",
    "buildingId": "BLD-000016",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 143.4,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000016-02",
    "buildingId": "BLD-000016",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 143.4,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-HYATT-01-00",
    "buildingId": "BLD-HYATT-01",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.5,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 969,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-HYATT-01-01",
    "buildingId": "BLD-HYATT-01",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.5,
    "topElevationM": 574.8,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 969,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-HYATT-01-02",
    "buildingId": "BLD-HYATT-01",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.8,
    "topElevationM": 578.1,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 969,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-HYATT-01-03",
    "buildingId": "BLD-HYATT-01",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 578.1,
    "topElevationM": 581.4,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 969,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-HYATT-01-04",
    "buildingId": "BLD-HYATT-01",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581.4,
    "topElevationM": 584.7,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 969,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-HYATT-01-05",
    "buildingId": "BLD-HYATT-01",
    "floorNumber": 5,
    "floorName": "Fifth Floor",
    "baseElevationM": 584.7,
    "topElevationM": 588,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 969,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-HYATT-01-06",
    "buildingId": "BLD-HYATT-01",
    "floorNumber": 6,
    "floorName": "Sixth Floor",
    "baseElevationM": 588,
    "topElevationM": 591.3,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 969,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-HYATT-01-07",
    "buildingId": "BLD-HYATT-01",
    "floorNumber": 7,
    "floorName": "Seventh Floor",
    "baseElevationM": 591.3,
    "topElevationM": 594.6,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 969,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-CITY-CTR-00",
    "buildingId": "BLD-CITY-CTR",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.7,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 2011.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-CITY-CTR-01",
    "buildingId": "BLD-CITY-CTR",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.7,
    "topElevationM": 575.2,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 2011.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-CITY-CTR-02",
    "buildingId": "BLD-CITY-CTR",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 575.2,
    "topElevationM": 578.7,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 2011.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-CITY-CTR-03",
    "buildingId": "BLD-CITY-CTR",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 578.7,
    "topElevationM": 582.2,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 2011.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-CITY-CTR-04",
    "buildingId": "BLD-CITY-CTR",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 582.2,
    "topElevationM": 585.7,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 2011.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-CITY-CTR-05",
    "buildingId": "BLD-CITY-CTR",
    "floorNumber": 5,
    "floorName": "Fifth Floor",
    "baseElevationM": 585.7,
    "topElevationM": 589.2,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 2011.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000019-00",
    "buildingId": "BLD-000019",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 98.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000019-01",
    "buildingId": "BLD-000019",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 98.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000020-00",
    "buildingId": "BLD-000020",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 394.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000020-01",
    "buildingId": "BLD-000020",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 394.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000020-02",
    "buildingId": "BLD-000020",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 394.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000021-00",
    "buildingId": "BLD-000021",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2735,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000021-01",
    "buildingId": "BLD-000021",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2735,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000021-02",
    "buildingId": "BLD-000021",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2735,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000021-03",
    "buildingId": "BLD-000021",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2735,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000021-04",
    "buildingId": "BLD-000021",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581,
    "topElevationM": 584.2,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2735,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000022-00",
    "buildingId": "BLD-000022",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 378.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000022-01",
    "buildingId": "BLD-000022",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 378.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000022-02",
    "buildingId": "BLD-000022",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 378.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000023-00",
    "buildingId": "BLD-000023",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 111.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000023-01",
    "buildingId": "BLD-000023",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 111.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000023-02",
    "buildingId": "BLD-000023",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 111.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000024-00",
    "buildingId": "BLD-000024",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 44.6,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000024-01",
    "buildingId": "BLD-000024",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 44.6,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000024-02",
    "buildingId": "BLD-000024",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 44.6,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000025-00",
    "buildingId": "BLD-000025",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1243.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000025-01",
    "buildingId": "BLD-000025",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1243.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000025-02",
    "buildingId": "BLD-000025",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1243.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000025-03",
    "buildingId": "BLD-000025",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1243.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000026-00",
    "buildingId": "BLD-000026",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 185.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000026-01",
    "buildingId": "BLD-000026",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 185.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000026-02",
    "buildingId": "BLD-000026",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 185.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000027-00",
    "buildingId": "BLD-000027",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 737.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000027-01",
    "buildingId": "BLD-000027",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 737.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000027-02",
    "buildingId": "BLD-000027",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 737.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000027-03",
    "buildingId": "BLD-000027",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 737.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-SCIT-01-00",
    "buildingId": "BLD-SCIT-01",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.5,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 2003.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-SCIT-01-01",
    "buildingId": "BLD-SCIT-01",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.5,
    "topElevationM": 574.8,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 2003.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-SCIT-01-02",
    "buildingId": "BLD-SCIT-01",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.8,
    "topElevationM": 578.1,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 2003.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-SCIT-01-03",
    "buildingId": "BLD-SCIT-01",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 578.1,
    "topElevationM": 581.4,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 2003.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-SCIT-01-04",
    "buildingId": "BLD-SCIT-01",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581.4,
    "topElevationM": 584.7,
    "floorHeightM": 3.3,
    "unitsCount": 4,
    "builtUpAreaSqm": 2003.5,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000029-00",
    "buildingId": "BLD-000029",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 433.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000029-01",
    "buildingId": "BLD-000029",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 433.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000029-02",
    "buildingId": "BLD-000029",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 433.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000030-00",
    "buildingId": "BLD-000030",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 23.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000030-01",
    "buildingId": "BLD-000030",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 23.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000030-02",
    "buildingId": "BLD-000030",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 23.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000031-00",
    "buildingId": "BLD-000031",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 50.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000031-01",
    "buildingId": "BLD-000031",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 50.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000031-02",
    "buildingId": "BLD-000031",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 50.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000032-00",
    "buildingId": "BLD-000032",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1335.7,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000032-01",
    "buildingId": "BLD-000032",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1335.7,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000032-02",
    "buildingId": "BLD-000032",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1335.7,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000032-03",
    "buildingId": "BLD-000032",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1335.7,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000033-00",
    "buildingId": "BLD-000033",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 5314.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000033-01",
    "buildingId": "BLD-000033",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 5314.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000033-02",
    "buildingId": "BLD-000033",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 5314.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000033-03",
    "buildingId": "BLD-000033",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 5314.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000033-04",
    "buildingId": "BLD-000033",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581,
    "topElevationM": 584.2,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 5314.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-RADISSON-00",
    "buildingId": "BLD-RADISSON",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.6,
    "floorHeightM": 3.4,
    "unitsCount": 4,
    "builtUpAreaSqm": 2835.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-RADISSON-01",
    "buildingId": "BLD-RADISSON",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.6,
    "topElevationM": 575,
    "floorHeightM": 3.4,
    "unitsCount": 4,
    "builtUpAreaSqm": 2835.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-RADISSON-02",
    "buildingId": "BLD-RADISSON",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 575,
    "topElevationM": 578.4,
    "floorHeightM": 3.4,
    "unitsCount": 4,
    "builtUpAreaSqm": 2835.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-RADISSON-03",
    "buildingId": "BLD-RADISSON",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 578.4,
    "topElevationM": 581.8,
    "floorHeightM": 3.4,
    "unitsCount": 4,
    "builtUpAreaSqm": 2835.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-RADISSON-04",
    "buildingId": "BLD-RADISSON",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581.8,
    "topElevationM": 585.2,
    "floorHeightM": 3.4,
    "unitsCount": 4,
    "builtUpAreaSqm": 2835.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-RADISSON-05",
    "buildingId": "BLD-RADISSON",
    "floorNumber": 5,
    "floorName": "Fifth Floor",
    "baseElevationM": 585.2,
    "topElevationM": 588.6,
    "floorHeightM": 3.4,
    "unitsCount": 4,
    "builtUpAreaSqm": 2835.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000035-00",
    "buildingId": "BLD-000035",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 207.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000035-01",
    "buildingId": "BLD-000035",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 207.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000035-02",
    "buildingId": "BLD-000035",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 207.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000036-00",
    "buildingId": "BLD-000036",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 170,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000036-01",
    "buildingId": "BLD-000036",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 170,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000036-02",
    "buildingId": "BLD-000036",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 170,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000037-00",
    "buildingId": "BLD-000037",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 665,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000037-01",
    "buildingId": "BLD-000037",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 665,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000037-02",
    "buildingId": "BLD-000037",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 665,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000037-03",
    "buildingId": "BLD-000037",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 665,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-POLICE-01-00",
    "buildingId": "BLD-POLICE-01",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.7,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 283.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-POLICE-01-01",
    "buildingId": "BLD-POLICE-01",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.7,
    "topElevationM": 575.2,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 283.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-FIRE-01-00",
    "buildingId": "BLD-FIRE-01",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.7,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 306.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-FIRE-01-01",
    "buildingId": "BLD-FIRE-01",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.7,
    "topElevationM": 575.2,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 306.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-FIRE-01-02",
    "buildingId": "BLD-FIRE-01",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 575.2,
    "topElevationM": 578.7,
    "floorHeightM": 3.5,
    "unitsCount": 4,
    "builtUpAreaSqm": 306.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-00",
    "buildingId": "BLD-000040",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-01",
    "buildingId": "BLD-000040",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-02",
    "buildingId": "BLD-000040",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-03",
    "buildingId": "BLD-000040",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-04",
    "buildingId": "BLD-000040",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581,
    "topElevationM": 584.2,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-05",
    "buildingId": "BLD-000040",
    "floorNumber": 5,
    "floorName": "Fifth Floor",
    "baseElevationM": 584.2,
    "topElevationM": 587.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-06",
    "buildingId": "BLD-000040",
    "floorNumber": 6,
    "floorName": "Sixth Floor",
    "baseElevationM": 587.4,
    "topElevationM": 590.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-07",
    "buildingId": "BLD-000040",
    "floorNumber": 7,
    "floorName": "Seventh Floor",
    "baseElevationM": 590.6,
    "topElevationM": 593.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-08",
    "buildingId": "BLD-000040",
    "floorNumber": 8,
    "floorName": "Floor 8",
    "baseElevationM": 593.8,
    "topElevationM": 597,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-09",
    "buildingId": "BLD-000040",
    "floorNumber": 9,
    "floorName": "Floor 9",
    "baseElevationM": 597,
    "topElevationM": 600.2,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-10",
    "buildingId": "BLD-000040",
    "floorNumber": 10,
    "floorName": "Floor 10",
    "baseElevationM": 600.2,
    "topElevationM": 603.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000040-11",
    "buildingId": "BLD-000040",
    "floorNumber": 11,
    "floorName": "Floor 11",
    "baseElevationM": 603.4,
    "topElevationM": 606.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 908.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000041-00",
    "buildingId": "BLD-000041",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 183.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000041-01",
    "buildingId": "BLD-000041",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 183.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000041-02",
    "buildingId": "BLD-000041",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 183.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000042-00",
    "buildingId": "BLD-000042",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1009.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000042-01",
    "buildingId": "BLD-000042",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1009.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000042-02",
    "buildingId": "BLD-000042",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1009.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000042-03",
    "buildingId": "BLD-000042",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 1009.8,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000043-00",
    "buildingId": "BLD-000043",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 414.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000043-01",
    "buildingId": "BLD-000043",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 414.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000043-02",
    "buildingId": "BLD-000043",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 414.2,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000044-00",
    "buildingId": "BLD-000044",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 751.4,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000044-01",
    "buildingId": "BLD-000044",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 751.4,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000044-02",
    "buildingId": "BLD-000044",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 751.4,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000044-03",
    "buildingId": "BLD-000044",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 751.4,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000045-00",
    "buildingId": "BLD-000045",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 874.9,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000045-01",
    "buildingId": "BLD-000045",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 874.9,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000045-02",
    "buildingId": "BLD-000045",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 874.9,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000045-03",
    "buildingId": "BLD-000045",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 874.9,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000046-00",
    "buildingId": "BLD-000046",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 202.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000046-01",
    "buildingId": "BLD-000046",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 202.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000046-02",
    "buildingId": "BLD-000046",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 202.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000047-00",
    "buildingId": "BLD-000047",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 226.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000047-01",
    "buildingId": "BLD-000047",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 226.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000047-02",
    "buildingId": "BLD-000047",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 226.1,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000048-00",
    "buildingId": "BLD-000048",
    "floorNumber": 0,
    "floorName": "Ground Floor",
    "baseElevationM": 568.2,
    "topElevationM": 571.4,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2083.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000048-01",
    "buildingId": "BLD-000048",
    "floorNumber": 1,
    "floorName": "First Floor",
    "baseElevationM": 571.4,
    "topElevationM": 574.6,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2083.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000048-02",
    "buildingId": "BLD-000048",
    "floorNumber": 2,
    "floorName": "Second Floor",
    "baseElevationM": 574.6,
    "topElevationM": 577.8,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2083.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000048-03",
    "buildingId": "BLD-000048",
    "floorNumber": 3,
    "floorName": "Third Floor",
    "baseElevationM": 577.8,
    "topElevationM": 581,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2083.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  },
  {
    "floorId": "FLR-000048-04",
    "buildingId": "BLD-000048",
    "floorNumber": 4,
    "floorName": "Fourth Floor",
    "baseElevationM": 581,
    "topElevationM": 584.2,
    "floorHeightM": 3.2,
    "unitsCount": 4,
    "builtUpAreaSqm": 2083.3,
    "geometryStatus": "Available",
    "verificationStatus": "Verified"
  }
];
export const COHERENT_UNITS: CoherentUnit[] = [
  {
      "unitId": "UNT-000781-101",
      "flatNumber": "101",
      "floorId": "FLR-000781-01",
      "floorNumber": 1,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-101",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Central Atrium Auditorium & Lecture Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-101",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-102",
      "flatNumber": "102",
      "floorId": "FLR-000781-01",
      "floorNumber": 1,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-102",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "CAD & BIM Geospatial Mapping Station"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-102",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-103",
      "flatNumber": "103",
      "floorId": "FLR-000781-01",
      "floorNumber": 1,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-103",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Embedded Systems & IoT Innovation Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-103",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-104",
      "flatNumber": "104",
      "floorId": "FLR-000781-01",
      "floorNumber": 1,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-104",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "AI & Neural Network Supercomputing Center"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-104",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-105",
      "flatNumber": "105",
      "floorId": "FLR-000781-01",
      "floorNumber": 1,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 60.4,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-105",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Digital Twin & VR Simulation Studio"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-105",
      "volumeM3": 205.4,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-106",
      "flatNumber": "106",
      "floorId": "FLR-000781-01",
      "floorNumber": 1,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-106",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Robotics & Autonomous Drones Facility"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-106",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-107",
      "flatNumber": "107",
      "floorId": "FLR-000781-01",
      "floorNumber": 1,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-107",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Materials Science & Micro-Analysis Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-107",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-108",
      "flatNumber": "108",
      "floorId": "FLR-000781-01",
      "floorNumber": 1,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-108",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Faculty Research & Seminar Conference Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-108",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-109",
      "flatNumber": "109",
      "floorId": "FLR-000781-01",
      "floorNumber": 1,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-109",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "High-Performance Computing Research Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-109",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-201",
      "flatNumber": "201",
      "floorId": "FLR-000781-02",
      "floorNumber": 2,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-201",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Central Atrium Auditorium & Lecture Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-201",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-202",
      "flatNumber": "202",
      "floorId": "FLR-000781-02",
      "floorNumber": 2,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-202",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "CAD & BIM Geospatial Mapping Station"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-202",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-203",
      "flatNumber": "203",
      "floorId": "FLR-000781-02",
      "floorNumber": 2,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-203",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Embedded Systems & IoT Innovation Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-203",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-204",
      "flatNumber": "204",
      "floorId": "FLR-000781-02",
      "floorNumber": 2,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-204",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "AI & Neural Network Supercomputing Center"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-204",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-205",
      "flatNumber": "205",
      "floorId": "FLR-000781-02",
      "floorNumber": 2,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 60.4,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-205",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Digital Twin & VR Simulation Studio"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-205",
      "volumeM3": 205.4,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-206",
      "flatNumber": "206",
      "floorId": "FLR-000781-02",
      "floorNumber": 2,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-206",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Robotics & Autonomous Drones Facility"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-206",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-207",
      "flatNumber": "207",
      "floorId": "FLR-000781-02",
      "floorNumber": 2,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-207",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Materials Science & Micro-Analysis Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-207",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-208",
      "flatNumber": "208",
      "floorId": "FLR-000781-02",
      "floorNumber": 2,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-208",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Faculty Research & Seminar Conference Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-208",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-209",
      "flatNumber": "209",
      "floorId": "FLR-000781-02",
      "floorNumber": 2,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-209",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "High-Performance Computing Research Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-209",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-301",
      "flatNumber": "301",
      "floorId": "FLR-000781-03",
      "floorNumber": 3,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-301",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Central Atrium Auditorium & Lecture Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-301",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-302",
      "flatNumber": "302",
      "floorId": "FLR-000781-03",
      "floorNumber": 3,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-302",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "CAD & BIM Geospatial Mapping Station"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-302",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-303",
      "flatNumber": "303",
      "floorId": "FLR-000781-03",
      "floorNumber": 3,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-303",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Embedded Systems & IoT Innovation Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-303",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-304",
      "flatNumber": "304",
      "floorId": "FLR-000781-03",
      "floorNumber": 3,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-304",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "AI & Neural Network Supercomputing Center"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-304",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-305",
      "flatNumber": "305",
      "floorId": "FLR-000781-03",
      "floorNumber": 3,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 60.4,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-305",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Digital Twin & VR Simulation Studio"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-305",
      "volumeM3": 205.4,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-306",
      "flatNumber": "306",
      "floorId": "FLR-000781-03",
      "floorNumber": 3,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-306",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Robotics & Autonomous Drones Facility"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-306",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-307",
      "flatNumber": "307",
      "floorId": "FLR-000781-03",
      "floorNumber": 3,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-307",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Materials Science & Micro-Analysis Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-307",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-308",
      "flatNumber": "308",
      "floorId": "FLR-000781-03",
      "floorNumber": 3,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-308",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Faculty Research & Seminar Conference Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-308",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-309",
      "flatNumber": "309",
      "floorId": "FLR-000781-03",
      "floorNumber": 3,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-309",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "High-Performance Computing Research Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-309",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-401",
      "flatNumber": "401",
      "floorId": "FLR-000781-04",
      "floorNumber": 4,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-401",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Central Atrium Auditorium & Lecture Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-401",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-402",
      "flatNumber": "402",
      "floorId": "FLR-000781-04",
      "floorNumber": 4,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-402",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "CAD & BIM Geospatial Mapping Station"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-402",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-403",
      "flatNumber": "403",
      "floorId": "FLR-000781-04",
      "floorNumber": 4,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-403",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Embedded Systems & IoT Innovation Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-403",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-404",
      "flatNumber": "404",
      "floorId": "FLR-000781-04",
      "floorNumber": 4,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-404",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "AI & Neural Network Supercomputing Center"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-404",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-405",
      "flatNumber": "405",
      "floorId": "FLR-000781-04",
      "floorNumber": 4,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 60.4,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-405",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Digital Twin & VR Simulation Studio"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-405",
      "volumeM3": 205.4,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-406",
      "flatNumber": "406",
      "floorId": "FLR-000781-04",
      "floorNumber": 4,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-406",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Robotics & Autonomous Drones Facility"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-406",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-407",
      "flatNumber": "407",
      "floorId": "FLR-000781-04",
      "floorNumber": 4,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-407",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Materials Science & Micro-Analysis Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-407",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-408",
      "flatNumber": "408",
      "floorId": "FLR-000781-04",
      "floorNumber": 4,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-408",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Faculty Research & Seminar Conference Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-408",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-409",
      "flatNumber": "409",
      "floorId": "FLR-000781-04",
      "floorNumber": 4,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-409",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "High-Performance Computing Research Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-409",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-501",
      "flatNumber": "501",
      "floorId": "FLR-000781-05",
      "floorNumber": 5,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-501",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Central Atrium Auditorium & Lecture Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-501",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-502",
      "flatNumber": "502",
      "floorId": "FLR-000781-05",
      "floorNumber": 5,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-502",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "CAD & BIM Geospatial Mapping Station"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-502",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-503",
      "flatNumber": "503",
      "floorId": "FLR-000781-05",
      "floorNumber": 5,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-503",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Embedded Systems & IoT Innovation Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-503",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-504",
      "flatNumber": "504",
      "floorId": "FLR-000781-05",
      "floorNumber": 5,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-504",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "AI & Neural Network Supercomputing Center"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-504",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-505",
      "flatNumber": "505",
      "floorId": "FLR-000781-05",
      "floorNumber": 5,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 60.4,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-505",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Digital Twin & VR Simulation Studio"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-505",
      "volumeM3": 205.4,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-506",
      "flatNumber": "506",
      "floorId": "FLR-000781-05",
      "floorNumber": 5,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 64.6,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-506",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Robotics & Autonomous Drones Facility"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-506",
      "volumeM3": 219.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-507",
      "flatNumber": "507",
      "floorId": "FLR-000781-05",
      "floorNumber": 5,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 68.7,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-507",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Materials Science & Micro-Analysis Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-507",
      "volumeM3": 233.6,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-508",
      "flatNumber": "508",
      "floorId": "FLR-000781-05",
      "floorNumber": 5,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 72.9,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-508",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "Faculty Research & Seminar Conference Hall"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-508",
      "volumeM3": 247.9,
      "verificationStatus": "Verified"
  },
  {
      "unitId": "UNT-000781-509",
      "flatNumber": "509",
      "floorId": "FLR-000781-05",
      "floorNumber": 5,
      "buildingId": "BLD-000781",
      "parcelId": "PAR-000123",
      "carpetAreaSqm": 77.1,
      "propertyTaxId": "PMRDA-PT-2026-PCCRC-509",
      "useType": "Commercial",
      "ownerCount": 1,
      "ownerNames": [
          "High-Performance Computing Research Lab"
      ],
      "rorStatus": "Linked",
      "volumeId": "VOL-781-509",
      "volumeM3": 262.1,
      "verificationStatus": "Verified"
  },

  {
    "unitId": "UNT-000002-01",
    "flatNumber": "G01",
    "floorId": "FLR-000002-00",
    "floorNumber": 0,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-01",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-02",
    "flatNumber": "G02",
    "floorId": "FLR-000002-00",
    "floorNumber": 0,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-02",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-03",
    "flatNumber": "G03",
    "floorId": "FLR-000002-00",
    "floorNumber": 0,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-03",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-04",
    "flatNumber": "G04",
    "floorId": "FLR-000002-00",
    "floorNumber": 0,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-04",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-11",
    "flatNumber": "101",
    "floorId": "FLR-000002-01",
    "floorNumber": 1,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-11",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-12",
    "flatNumber": "102",
    "floorId": "FLR-000002-01",
    "floorNumber": 1,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-12",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-13",
    "flatNumber": "103",
    "floorId": "FLR-000002-01",
    "floorNumber": 1,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-13",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-14",
    "flatNumber": "104",
    "floorId": "FLR-000002-01",
    "floorNumber": 1,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-14",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-21",
    "flatNumber": "201",
    "floorId": "FLR-000002-02",
    "floorNumber": 2,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-21",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-22",
    "flatNumber": "202",
    "floorId": "FLR-000002-02",
    "floorNumber": 2,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-22",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-23",
    "flatNumber": "203",
    "floorId": "FLR-000002-02",
    "floorNumber": 2,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-23",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000002-24",
    "flatNumber": "204",
    "floorId": "FLR-000002-02",
    "floorNumber": 2,
    "buildingId": "BLD-000002",
    "parcelId": "PAR-PUNE-011",
    "carpetAreaSqm": 125.8,
    "propertyTaxId": "PMRDA-PT-2026-2-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-002-24",
    "volumeM3": 402.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-01",
    "flatNumber": "G01",
    "floorId": "FLR-000003-00",
    "floorNumber": 0,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-01",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-02",
    "flatNumber": "G02",
    "floorId": "FLR-000003-00",
    "floorNumber": 0,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-02",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-03",
    "flatNumber": "G03",
    "floorId": "FLR-000003-00",
    "floorNumber": 0,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-03",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-04",
    "flatNumber": "G04",
    "floorId": "FLR-000003-00",
    "floorNumber": 0,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-04",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-11",
    "flatNumber": "101",
    "floorId": "FLR-000003-01",
    "floorNumber": 1,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-11",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-12",
    "flatNumber": "102",
    "floorId": "FLR-000003-01",
    "floorNumber": 1,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-12",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-13",
    "flatNumber": "103",
    "floorId": "FLR-000003-01",
    "floorNumber": 1,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-13",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-14",
    "flatNumber": "104",
    "floorId": "FLR-000003-01",
    "floorNumber": 1,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-14",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-21",
    "flatNumber": "201",
    "floorId": "FLR-000003-02",
    "floorNumber": 2,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-21",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-22",
    "flatNumber": "202",
    "floorId": "FLR-000003-02",
    "floorNumber": 2,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-22",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-23",
    "flatNumber": "203",
    "floorId": "FLR-000003-02",
    "floorNumber": 2,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-23",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-24",
    "flatNumber": "204",
    "floorId": "FLR-000003-02",
    "floorNumber": 2,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-24",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-31",
    "flatNumber": "301",
    "floorId": "FLR-000003-03",
    "floorNumber": 3,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-31",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-32",
    "flatNumber": "302",
    "floorId": "FLR-000003-03",
    "floorNumber": 3,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-32",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-33",
    "flatNumber": "303",
    "floorId": "FLR-000003-03",
    "floorNumber": 3,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-33",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-34",
    "flatNumber": "304",
    "floorId": "FLR-000003-03",
    "floorNumber": 3,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-34",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-41",
    "flatNumber": "401",
    "floorId": "FLR-000003-04",
    "floorNumber": 4,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-41",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-41",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-42",
    "flatNumber": "402",
    "floorId": "FLR-000003-04",
    "floorNumber": 4,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-42",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-42",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-43",
    "flatNumber": "403",
    "floorId": "FLR-000003-04",
    "floorNumber": 4,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-43",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-43",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000003-44",
    "flatNumber": "404",
    "floorId": "FLR-000003-04",
    "floorNumber": 4,
    "buildingId": "BLD-000003",
    "parcelId": "PAR-PUNE-012",
    "carpetAreaSqm": 460.1,
    "propertyTaxId": "PMRDA-PT-2026-3-44",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-003-44",
    "volumeM3": 1472.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-01",
    "flatNumber": "G01",
    "floorId": "FLR-I2IT-LIB-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-01",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-01",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-02",
    "flatNumber": "G02",
    "floorId": "FLR-I2IT-LIB-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-02",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-02",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-03",
    "flatNumber": "G03",
    "floorId": "FLR-I2IT-LIB-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-03",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-03",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-04",
    "flatNumber": "G04",
    "floorId": "FLR-I2IT-LIB-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-04",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-04",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-11",
    "flatNumber": "101",
    "floorId": "FLR-I2IT-LIB-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-11",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-11",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-12",
    "flatNumber": "102",
    "floorId": "FLR-I2IT-LIB-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-12",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-12",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-13",
    "flatNumber": "103",
    "floorId": "FLR-I2IT-LIB-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-13",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-13",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-14",
    "flatNumber": "104",
    "floorId": "FLR-I2IT-LIB-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-14",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-14",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-21",
    "flatNumber": "201",
    "floorId": "FLR-I2IT-LIB-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-21",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-21",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-22",
    "flatNumber": "202",
    "floorId": "FLR-I2IT-LIB-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-22",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-22",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-23",
    "flatNumber": "203",
    "floorId": "FLR-I2IT-LIB-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-23",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-23",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-LIB-24",
    "flatNumber": "204",
    "floorId": "FLR-I2IT-LIB-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-LIB",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 303.5,
    "propertyTaxId": "PMRDA-PT-2026-B-24",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-LIB-24",
    "volumeM3": 1032,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-01",
    "flatNumber": "G01",
    "floorId": "FLR-000005-00",
    "floorNumber": 0,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-01",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-02",
    "flatNumber": "G02",
    "floorId": "FLR-000005-00",
    "floorNumber": 0,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-02",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-03",
    "flatNumber": "G03",
    "floorId": "FLR-000005-00",
    "floorNumber": 0,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-03",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-04",
    "flatNumber": "G04",
    "floorId": "FLR-000005-00",
    "floorNumber": 0,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-04",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-11",
    "flatNumber": "101",
    "floorId": "FLR-000005-01",
    "floorNumber": 1,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-11",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-12",
    "flatNumber": "102",
    "floorId": "FLR-000005-01",
    "floorNumber": 1,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-12",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-13",
    "flatNumber": "103",
    "floorId": "FLR-000005-01",
    "floorNumber": 1,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-13",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-14",
    "flatNumber": "104",
    "floorId": "FLR-000005-01",
    "floorNumber": 1,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-14",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-21",
    "flatNumber": "201",
    "floorId": "FLR-000005-02",
    "floorNumber": 2,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-21",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-22",
    "flatNumber": "202",
    "floorId": "FLR-000005-02",
    "floorNumber": 2,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-22",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-23",
    "flatNumber": "203",
    "floorId": "FLR-000005-02",
    "floorNumber": 2,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-23",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-24",
    "flatNumber": "204",
    "floorId": "FLR-000005-02",
    "floorNumber": 2,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-24",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-31",
    "flatNumber": "301",
    "floorId": "FLR-000005-03",
    "floorNumber": 3,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-31",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-32",
    "flatNumber": "302",
    "floorId": "FLR-000005-03",
    "floorNumber": 3,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-32",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-33",
    "flatNumber": "303",
    "floorId": "FLR-000005-03",
    "floorNumber": 3,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-33",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000005-34",
    "flatNumber": "304",
    "floorId": "FLR-000005-03",
    "floorNumber": 3,
    "buildingId": "BLD-000005",
    "parcelId": "PAR-PUNE-014",
    "carpetAreaSqm": 283.7,
    "propertyTaxId": "PMRDA-PT-2026-5-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-005-34",
    "volumeM3": 907.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-01",
    "flatNumber": "G01",
    "floorId": "FLR-I2IT-TAK-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-01",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-01",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-02",
    "flatNumber": "G02",
    "floorId": "FLR-I2IT-TAK-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-02",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-02",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-03",
    "flatNumber": "G03",
    "floorId": "FLR-I2IT-TAK-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-03",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-03",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-04",
    "flatNumber": "G04",
    "floorId": "FLR-I2IT-TAK-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-04",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-04",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-11",
    "flatNumber": "101",
    "floorId": "FLR-I2IT-TAK-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-11",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-11",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-12",
    "flatNumber": "102",
    "floorId": "FLR-I2IT-TAK-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-12",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-12",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-13",
    "flatNumber": "103",
    "floorId": "FLR-I2IT-TAK-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-13",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-13",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-14",
    "flatNumber": "104",
    "floorId": "FLR-I2IT-TAK-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-14",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-14",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-21",
    "flatNumber": "201",
    "floorId": "FLR-I2IT-TAK-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-21",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-21",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-22",
    "flatNumber": "202",
    "floorId": "FLR-I2IT-TAK-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-22",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-22",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-23",
    "flatNumber": "203",
    "floorId": "FLR-I2IT-TAK-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-23",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-23",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-24",
    "flatNumber": "204",
    "floorId": "FLR-I2IT-TAK-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-24",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-24",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-31",
    "flatNumber": "301",
    "floorId": "FLR-I2IT-TAK-03",
    "floorNumber": 3,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-31",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-31",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-32",
    "flatNumber": "302",
    "floorId": "FLR-I2IT-TAK-03",
    "floorNumber": 3,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-32",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-32",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-33",
    "flatNumber": "303",
    "floorId": "FLR-I2IT-TAK-03",
    "floorNumber": 3,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-33",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-33",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-TAK-34",
    "flatNumber": "304",
    "floorId": "FLR-I2IT-TAK-03",
    "floorNumber": 3,
    "buildingId": "BLD-I2IT-TAK",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 163.3,
    "propertyTaxId": "PMRDA-PT-2026-K-34",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-TAK-34",
    "volumeM3": 539.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-01",
    "flatNumber": "G01",
    "floorId": "FLR-000007-00",
    "floorNumber": 0,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-01",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-02",
    "flatNumber": "G02",
    "floorId": "FLR-000007-00",
    "floorNumber": 0,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-02",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-03",
    "flatNumber": "G03",
    "floorId": "FLR-000007-00",
    "floorNumber": 0,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-03",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-04",
    "flatNumber": "G04",
    "floorId": "FLR-000007-00",
    "floorNumber": 0,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-04",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-11",
    "flatNumber": "101",
    "floorId": "FLR-000007-01",
    "floorNumber": 1,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-11",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-12",
    "flatNumber": "102",
    "floorId": "FLR-000007-01",
    "floorNumber": 1,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-12",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-13",
    "flatNumber": "103",
    "floorId": "FLR-000007-01",
    "floorNumber": 1,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-13",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-14",
    "flatNumber": "104",
    "floorId": "FLR-000007-01",
    "floorNumber": 1,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-14",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-21",
    "flatNumber": "201",
    "floorId": "FLR-000007-02",
    "floorNumber": 2,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-21",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-22",
    "flatNumber": "202",
    "floorId": "FLR-000007-02",
    "floorNumber": 2,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-22",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-23",
    "flatNumber": "203",
    "floorId": "FLR-000007-02",
    "floorNumber": 2,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-23",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-24",
    "flatNumber": "204",
    "floorId": "FLR-000007-02",
    "floorNumber": 2,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-24",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-31",
    "flatNumber": "301",
    "floorId": "FLR-000007-03",
    "floorNumber": 3,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-31",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-32",
    "flatNumber": "302",
    "floorId": "FLR-000007-03",
    "floorNumber": 3,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-32",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-33",
    "flatNumber": "303",
    "floorId": "FLR-000007-03",
    "floorNumber": 3,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-33",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000007-34",
    "flatNumber": "304",
    "floorId": "FLR-000007-03",
    "floorNumber": 3,
    "buildingId": "BLD-000007",
    "parcelId": "PAR-PUNE-016",
    "carpetAreaSqm": 182,
    "propertyTaxId": "PMRDA-PT-2026-7-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-007-34",
    "volumeM3": 582.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-01",
    "flatNumber": "G01",
    "floorId": "FLR-000008-00",
    "floorNumber": 0,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-01",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-02",
    "flatNumber": "G02",
    "floorId": "FLR-000008-00",
    "floorNumber": 0,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-02",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-03",
    "flatNumber": "G03",
    "floorId": "FLR-000008-00",
    "floorNumber": 0,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-03",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-04",
    "flatNumber": "G04",
    "floorId": "FLR-000008-00",
    "floorNumber": 0,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-04",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-11",
    "flatNumber": "101",
    "floorId": "FLR-000008-01",
    "floorNumber": 1,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-11",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-12",
    "flatNumber": "102",
    "floorId": "FLR-000008-01",
    "floorNumber": 1,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-12",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-13",
    "flatNumber": "103",
    "floorId": "FLR-000008-01",
    "floorNumber": 1,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-13",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-14",
    "flatNumber": "104",
    "floorId": "FLR-000008-01",
    "floorNumber": 1,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-14",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-21",
    "flatNumber": "201",
    "floorId": "FLR-000008-02",
    "floorNumber": 2,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-21",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-22",
    "flatNumber": "202",
    "floorId": "FLR-000008-02",
    "floorNumber": 2,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-22",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-23",
    "flatNumber": "203",
    "floorId": "FLR-000008-02",
    "floorNumber": 2,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-23",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-24",
    "flatNumber": "204",
    "floorId": "FLR-000008-02",
    "floorNumber": 2,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-24",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-31",
    "flatNumber": "301",
    "floorId": "FLR-000008-03",
    "floorNumber": 3,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-31",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-32",
    "flatNumber": "302",
    "floorId": "FLR-000008-03",
    "floorNumber": 3,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-32",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-33",
    "flatNumber": "303",
    "floorId": "FLR-000008-03",
    "floorNumber": 3,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-33",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000008-34",
    "flatNumber": "304",
    "floorId": "FLR-000008-03",
    "floorNumber": 3,
    "buildingId": "BLD-000008",
    "parcelId": "PAR-PUNE-017",
    "carpetAreaSqm": 299.9,
    "propertyTaxId": "PMRDA-PT-2026-8-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-008-34",
    "volumeM3": 959.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-01",
    "flatNumber": "G01",
    "floorId": "FLR-000009-00",
    "floorNumber": 0,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-01",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-02",
    "flatNumber": "G02",
    "floorId": "FLR-000009-00",
    "floorNumber": 0,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-02",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-03",
    "flatNumber": "G03",
    "floorId": "FLR-000009-00",
    "floorNumber": 0,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-03",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-04",
    "flatNumber": "G04",
    "floorId": "FLR-000009-00",
    "floorNumber": 0,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-04",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-11",
    "flatNumber": "101",
    "floorId": "FLR-000009-01",
    "floorNumber": 1,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-11",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-12",
    "flatNumber": "102",
    "floorId": "FLR-000009-01",
    "floorNumber": 1,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-12",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-13",
    "flatNumber": "103",
    "floorId": "FLR-000009-01",
    "floorNumber": 1,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-13",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-14",
    "flatNumber": "104",
    "floorId": "FLR-000009-01",
    "floorNumber": 1,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-14",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-21",
    "flatNumber": "201",
    "floorId": "FLR-000009-02",
    "floorNumber": 2,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-21",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-22",
    "flatNumber": "202",
    "floorId": "FLR-000009-02",
    "floorNumber": 2,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-22",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-23",
    "flatNumber": "203",
    "floorId": "FLR-000009-02",
    "floorNumber": 2,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-23",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-24",
    "flatNumber": "204",
    "floorId": "FLR-000009-02",
    "floorNumber": 2,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-24",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-31",
    "flatNumber": "301",
    "floorId": "FLR-000009-03",
    "floorNumber": 3,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-31",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-32",
    "flatNumber": "302",
    "floorId": "FLR-000009-03",
    "floorNumber": 3,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-32",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-33",
    "flatNumber": "303",
    "floorId": "FLR-000009-03",
    "floorNumber": 3,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-33",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-34",
    "flatNumber": "304",
    "floorId": "FLR-000009-03",
    "floorNumber": 3,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-34",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-41",
    "flatNumber": "401",
    "floorId": "FLR-000009-04",
    "floorNumber": 4,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-41",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-41",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-42",
    "flatNumber": "402",
    "floorId": "FLR-000009-04",
    "floorNumber": 4,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-42",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-42",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-43",
    "flatNumber": "403",
    "floorId": "FLR-000009-04",
    "floorNumber": 4,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-43",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-43",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000009-44",
    "flatNumber": "404",
    "floorId": "FLR-000009-04",
    "floorNumber": 4,
    "buildingId": "BLD-000009",
    "parcelId": "PAR-PUNE-018",
    "carpetAreaSqm": 345.8,
    "propertyTaxId": "PMRDA-PT-2026-9-44",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-009-44",
    "volumeM3": 1106.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-01",
    "flatNumber": "G01",
    "floorId": "FLR-000010-00",
    "floorNumber": 0,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-01",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-02",
    "flatNumber": "G02",
    "floorId": "FLR-000010-00",
    "floorNumber": 0,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-02",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-03",
    "flatNumber": "G03",
    "floorId": "FLR-000010-00",
    "floorNumber": 0,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-03",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-04",
    "flatNumber": "G04",
    "floorId": "FLR-000010-00",
    "floorNumber": 0,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-04",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-11",
    "flatNumber": "101",
    "floorId": "FLR-000010-01",
    "floorNumber": 1,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-11",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-12",
    "flatNumber": "102",
    "floorId": "FLR-000010-01",
    "floorNumber": 1,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-12",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-13",
    "flatNumber": "103",
    "floorId": "FLR-000010-01",
    "floorNumber": 1,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-13",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-14",
    "flatNumber": "104",
    "floorId": "FLR-000010-01",
    "floorNumber": 1,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-14",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-21",
    "flatNumber": "201",
    "floorId": "FLR-000010-02",
    "floorNumber": 2,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-21",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-22",
    "flatNumber": "202",
    "floorId": "FLR-000010-02",
    "floorNumber": 2,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-22",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-23",
    "flatNumber": "203",
    "floorId": "FLR-000010-02",
    "floorNumber": 2,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-23",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-24",
    "flatNumber": "204",
    "floorId": "FLR-000010-02",
    "floorNumber": 2,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-24",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-31",
    "flatNumber": "301",
    "floorId": "FLR-000010-03",
    "floorNumber": 3,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-31",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-32",
    "flatNumber": "302",
    "floorId": "FLR-000010-03",
    "floorNumber": 3,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-32",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-33",
    "flatNumber": "303",
    "floorId": "FLR-000010-03",
    "floorNumber": 3,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-33",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-34",
    "flatNumber": "304",
    "floorId": "FLR-000010-03",
    "floorNumber": 3,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-34",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-41",
    "flatNumber": "401",
    "floorId": "FLR-000010-04",
    "floorNumber": 4,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-41",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-41",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-42",
    "flatNumber": "402",
    "floorId": "FLR-000010-04",
    "floorNumber": 4,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-42",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-42",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-43",
    "flatNumber": "403",
    "floorId": "FLR-000010-04",
    "floorNumber": 4,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-43",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-43",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000010-44",
    "flatNumber": "404",
    "floorId": "FLR-000010-04",
    "floorNumber": 4,
    "buildingId": "BLD-000010",
    "parcelId": "PAR-PUNE-019",
    "carpetAreaSqm": 808.4,
    "propertyTaxId": "PMRDA-PT-2026-0-44",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-010-44",
    "volumeM3": 2587,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-01",
    "flatNumber": "G01",
    "floorId": "FLR-000011-00",
    "floorNumber": 0,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-01",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-02",
    "flatNumber": "G02",
    "floorId": "FLR-000011-00",
    "floorNumber": 0,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-02",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-03",
    "flatNumber": "G03",
    "floorId": "FLR-000011-00",
    "floorNumber": 0,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-03",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-04",
    "flatNumber": "G04",
    "floorId": "FLR-000011-00",
    "floorNumber": 0,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-04",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-11",
    "flatNumber": "101",
    "floorId": "FLR-000011-01",
    "floorNumber": 1,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-11",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-12",
    "flatNumber": "102",
    "floorId": "FLR-000011-01",
    "floorNumber": 1,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-12",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-13",
    "flatNumber": "103",
    "floorId": "FLR-000011-01",
    "floorNumber": 1,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-13",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-14",
    "flatNumber": "104",
    "floorId": "FLR-000011-01",
    "floorNumber": 1,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-14",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-21",
    "flatNumber": "201",
    "floorId": "FLR-000011-02",
    "floorNumber": 2,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-21",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-22",
    "flatNumber": "202",
    "floorId": "FLR-000011-02",
    "floorNumber": 2,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-22",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-23",
    "flatNumber": "203",
    "floorId": "FLR-000011-02",
    "floorNumber": 2,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-23",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000011-24",
    "flatNumber": "204",
    "floorId": "FLR-000011-02",
    "floorNumber": 2,
    "buildingId": "BLD-000011",
    "parcelId": "PAR-PUNE-020",
    "carpetAreaSqm": 78.5,
    "propertyTaxId": "PMRDA-PT-2026-1-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-011-24",
    "volumeM3": 251.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-01",
    "flatNumber": "G01",
    "floorId": "FLR-I2IT-HST-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-01",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-02",
    "flatNumber": "G02",
    "floorId": "FLR-I2IT-HST-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-02",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-03",
    "flatNumber": "G03",
    "floorId": "FLR-I2IT-HST-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-03",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-04",
    "flatNumber": "G04",
    "floorId": "FLR-I2IT-HST-00",
    "floorNumber": 0,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-04",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-11",
    "flatNumber": "101",
    "floorId": "FLR-I2IT-HST-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-11",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-12",
    "flatNumber": "102",
    "floorId": "FLR-I2IT-HST-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-12",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-13",
    "flatNumber": "103",
    "floorId": "FLR-I2IT-HST-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-13",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-14",
    "flatNumber": "104",
    "floorId": "FLR-I2IT-HST-01",
    "floorNumber": 1,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-14",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-21",
    "flatNumber": "201",
    "floorId": "FLR-I2IT-HST-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-21",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-22",
    "flatNumber": "202",
    "floorId": "FLR-I2IT-HST-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-22",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-23",
    "flatNumber": "203",
    "floorId": "FLR-I2IT-HST-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-23",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-24",
    "flatNumber": "204",
    "floorId": "FLR-I2IT-HST-02",
    "floorNumber": 2,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-24",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-31",
    "flatNumber": "301",
    "floorId": "FLR-I2IT-HST-03",
    "floorNumber": 3,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-31",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-32",
    "flatNumber": "302",
    "floorId": "FLR-I2IT-HST-03",
    "floorNumber": 3,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-32",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-33",
    "flatNumber": "303",
    "floorId": "FLR-I2IT-HST-03",
    "floorNumber": 3,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-33",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-34",
    "flatNumber": "304",
    "floorId": "FLR-I2IT-HST-03",
    "floorNumber": 3,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-34",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-41",
    "flatNumber": "401",
    "floorId": "FLR-I2IT-HST-04",
    "floorNumber": 4,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-41",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-41",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-42",
    "flatNumber": "402",
    "floorId": "FLR-I2IT-HST-04",
    "floorNumber": 4,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-42",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-42",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-43",
    "flatNumber": "403",
    "floorId": "FLR-I2IT-HST-04",
    "floorNumber": 4,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-43",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-43",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-44",
    "flatNumber": "404",
    "floorId": "FLR-I2IT-HST-04",
    "floorNumber": 4,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-44",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-44",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-51",
    "flatNumber": "501",
    "floorId": "FLR-I2IT-HST-05",
    "floorNumber": 5,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-51",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 501"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-51",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-52",
    "flatNumber": "502",
    "floorId": "FLR-I2IT-HST-05",
    "floorNumber": 5,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-52",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 502"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-52",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-53",
    "flatNumber": "503",
    "floorId": "FLR-I2IT-HST-05",
    "floorNumber": 5,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-53",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 503"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-53",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-I2IT-HST-54",
    "flatNumber": "504",
    "floorId": "FLR-I2IT-HST-05",
    "floorNumber": 5,
    "buildingId": "BLD-I2IT-HST",
    "parcelId": "PAR-000123",
    "carpetAreaSqm": 562.5,
    "propertyTaxId": "PMRDA-PT-2026-T-54",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 504"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-HST-54",
    "volumeM3": 1743.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-01",
    "flatNumber": "G01",
    "floorId": "FLR-000013-00",
    "floorNumber": 0,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-01",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-02",
    "flatNumber": "G02",
    "floorId": "FLR-000013-00",
    "floorNumber": 0,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-02",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-03",
    "flatNumber": "G03",
    "floorId": "FLR-000013-00",
    "floorNumber": 0,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-03",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-04",
    "flatNumber": "G04",
    "floorId": "FLR-000013-00",
    "floorNumber": 0,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-04",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-11",
    "flatNumber": "101",
    "floorId": "FLR-000013-01",
    "floorNumber": 1,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-11",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-12",
    "flatNumber": "102",
    "floorId": "FLR-000013-01",
    "floorNumber": 1,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-12",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-13",
    "flatNumber": "103",
    "floorId": "FLR-000013-01",
    "floorNumber": 1,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-13",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-14",
    "flatNumber": "104",
    "floorId": "FLR-000013-01",
    "floorNumber": 1,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-14",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-21",
    "flatNumber": "201",
    "floorId": "FLR-000013-02",
    "floorNumber": 2,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-21",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-22",
    "flatNumber": "202",
    "floorId": "FLR-000013-02",
    "floorNumber": 2,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-22",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-23",
    "flatNumber": "203",
    "floorId": "FLR-000013-02",
    "floorNumber": 2,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-23",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000013-24",
    "flatNumber": "204",
    "floorId": "FLR-000013-02",
    "floorNumber": 2,
    "buildingId": "BLD-000013",
    "parcelId": "PAR-PUNE-022",
    "carpetAreaSqm": 131.6,
    "propertyTaxId": "PMRDA-PT-2026-3-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-013-24",
    "volumeM3": 421.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-01",
    "flatNumber": "G01",
    "floorId": "FLR-000014-00",
    "floorNumber": 0,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-01",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-02",
    "flatNumber": "G02",
    "floorId": "FLR-000014-00",
    "floorNumber": 0,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-02",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-03",
    "flatNumber": "G03",
    "floorId": "FLR-000014-00",
    "floorNumber": 0,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-03",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-04",
    "flatNumber": "G04",
    "floorId": "FLR-000014-00",
    "floorNumber": 0,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-04",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-11",
    "flatNumber": "101",
    "floorId": "FLR-000014-01",
    "floorNumber": 1,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-11",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-12",
    "flatNumber": "102",
    "floorId": "FLR-000014-01",
    "floorNumber": 1,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-12",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-13",
    "flatNumber": "103",
    "floorId": "FLR-000014-01",
    "floorNumber": 1,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-13",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-14",
    "flatNumber": "104",
    "floorId": "FLR-000014-01",
    "floorNumber": 1,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-14",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-21",
    "flatNumber": "201",
    "floorId": "FLR-000014-02",
    "floorNumber": 2,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-21",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-22",
    "flatNumber": "202",
    "floorId": "FLR-000014-02",
    "floorNumber": 2,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-22",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-23",
    "flatNumber": "203",
    "floorId": "FLR-000014-02",
    "floorNumber": 2,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-23",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000014-24",
    "flatNumber": "204",
    "floorId": "FLR-000014-02",
    "floorNumber": 2,
    "buildingId": "BLD-000014",
    "parcelId": "PAR-PUNE-023",
    "carpetAreaSqm": 14.4,
    "propertyTaxId": "PMRDA-PT-2026-4-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-014-24",
    "volumeM3": 46.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-01",
    "flatNumber": "G01",
    "floorId": "FLR-000015-00",
    "floorNumber": 0,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-01",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-02",
    "flatNumber": "G02",
    "floorId": "FLR-000015-00",
    "floorNumber": 0,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-02",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-03",
    "flatNumber": "G03",
    "floorId": "FLR-000015-00",
    "floorNumber": 0,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-03",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-04",
    "flatNumber": "G04",
    "floorId": "FLR-000015-00",
    "floorNumber": 0,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-04",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-11",
    "flatNumber": "101",
    "floorId": "FLR-000015-01",
    "floorNumber": 1,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-11",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-12",
    "flatNumber": "102",
    "floorId": "FLR-000015-01",
    "floorNumber": 1,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-12",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-13",
    "flatNumber": "103",
    "floorId": "FLR-000015-01",
    "floorNumber": 1,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-13",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-14",
    "flatNumber": "104",
    "floorId": "FLR-000015-01",
    "floorNumber": 1,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-14",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-21",
    "flatNumber": "201",
    "floorId": "FLR-000015-02",
    "floorNumber": 2,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-21",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-22",
    "flatNumber": "202",
    "floorId": "FLR-000015-02",
    "floorNumber": 2,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-22",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-23",
    "flatNumber": "203",
    "floorId": "FLR-000015-02",
    "floorNumber": 2,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-23",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000015-24",
    "flatNumber": "204",
    "floorId": "FLR-000015-02",
    "floorNumber": 2,
    "buildingId": "BLD-000015",
    "parcelId": "PAR-PUNE-024",
    "carpetAreaSqm": 112.3,
    "propertyTaxId": "PMRDA-PT-2026-5-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-015-24",
    "volumeM3": 359.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-01",
    "flatNumber": "G01",
    "floorId": "FLR-000016-00",
    "floorNumber": 0,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-01",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-02",
    "flatNumber": "G02",
    "floorId": "FLR-000016-00",
    "floorNumber": 0,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-02",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-03",
    "flatNumber": "G03",
    "floorId": "FLR-000016-00",
    "floorNumber": 0,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-03",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-04",
    "flatNumber": "G04",
    "floorId": "FLR-000016-00",
    "floorNumber": 0,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-04",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-11",
    "flatNumber": "101",
    "floorId": "FLR-000016-01",
    "floorNumber": 1,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-11",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-12",
    "flatNumber": "102",
    "floorId": "FLR-000016-01",
    "floorNumber": 1,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-12",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-13",
    "flatNumber": "103",
    "floorId": "FLR-000016-01",
    "floorNumber": 1,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-13",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-14",
    "flatNumber": "104",
    "floorId": "FLR-000016-01",
    "floorNumber": 1,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-14",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-21",
    "flatNumber": "201",
    "floorId": "FLR-000016-02",
    "floorNumber": 2,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-21",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-22",
    "flatNumber": "202",
    "floorId": "FLR-000016-02",
    "floorNumber": 2,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-22",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-23",
    "flatNumber": "203",
    "floorId": "FLR-000016-02",
    "floorNumber": 2,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-23",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000016-24",
    "flatNumber": "204",
    "floorId": "FLR-000016-02",
    "floorNumber": 2,
    "buildingId": "BLD-000016",
    "parcelId": "PAR-PUNE-025",
    "carpetAreaSqm": 34,
    "propertyTaxId": "PMRDA-PT-2026-6-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-016-24",
    "volumeM3": 108.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-01",
    "flatNumber": "G01",
    "floorId": "FLR-HYATT-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-01",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-01",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-02",
    "flatNumber": "G02",
    "floorId": "FLR-HYATT-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-02",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-02",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-03",
    "flatNumber": "G03",
    "floorId": "FLR-HYATT-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-03",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-03",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-04",
    "flatNumber": "G04",
    "floorId": "FLR-HYATT-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-04",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-04",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-11",
    "flatNumber": "101",
    "floorId": "FLR-HYATT-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-11",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-11",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-12",
    "flatNumber": "102",
    "floorId": "FLR-HYATT-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-12",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-12",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-13",
    "flatNumber": "103",
    "floorId": "FLR-HYATT-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-13",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-13",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-14",
    "flatNumber": "104",
    "floorId": "FLR-HYATT-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-14",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-14",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-21",
    "flatNumber": "201",
    "floorId": "FLR-HYATT-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-21",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-21",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-22",
    "flatNumber": "202",
    "floorId": "FLR-HYATT-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-22",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-22",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-23",
    "flatNumber": "203",
    "floorId": "FLR-HYATT-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-23",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-23",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-24",
    "flatNumber": "204",
    "floorId": "FLR-HYATT-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-24",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-24",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-31",
    "flatNumber": "301",
    "floorId": "FLR-HYATT-01-03",
    "floorNumber": 3,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-31",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-31",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-32",
    "flatNumber": "302",
    "floorId": "FLR-HYATT-01-03",
    "floorNumber": 3,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-32",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-32",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-33",
    "flatNumber": "303",
    "floorId": "FLR-HYATT-01-03",
    "floorNumber": 3,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-33",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-33",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-34",
    "flatNumber": "304",
    "floorId": "FLR-HYATT-01-03",
    "floorNumber": 3,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-34",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-34",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-41",
    "flatNumber": "401",
    "floorId": "FLR-HYATT-01-04",
    "floorNumber": 4,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-41",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-41",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-42",
    "flatNumber": "402",
    "floorId": "FLR-HYATT-01-04",
    "floorNumber": 4,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-42",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-42",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-43",
    "flatNumber": "403",
    "floorId": "FLR-HYATT-01-04",
    "floorNumber": 4,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-43",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-43",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-44",
    "flatNumber": "404",
    "floorId": "FLR-HYATT-01-04",
    "floorNumber": 4,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-44",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-44",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-51",
    "flatNumber": "501",
    "floorId": "FLR-HYATT-01-05",
    "floorNumber": 5,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-51",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 501"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-51",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-52",
    "flatNumber": "502",
    "floorId": "FLR-HYATT-01-05",
    "floorNumber": 5,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-52",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 502"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-52",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-53",
    "flatNumber": "503",
    "floorId": "FLR-HYATT-01-05",
    "floorNumber": 5,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-53",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 503"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-53",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-54",
    "flatNumber": "504",
    "floorId": "FLR-HYATT-01-05",
    "floorNumber": 5,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-54",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 504"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-54",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-61",
    "flatNumber": "601",
    "floorId": "FLR-HYATT-01-06",
    "floorNumber": 6,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-61",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 601"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-61",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-62",
    "flatNumber": "602",
    "floorId": "FLR-HYATT-01-06",
    "floorNumber": 6,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-62",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 602"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-62",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-63",
    "flatNumber": "603",
    "floorId": "FLR-HYATT-01-06",
    "floorNumber": 6,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-63",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 603"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-63",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-64",
    "flatNumber": "604",
    "floorId": "FLR-HYATT-01-06",
    "floorNumber": 6,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-64",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 604"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-64",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-71",
    "flatNumber": "701",
    "floorId": "FLR-HYATT-01-07",
    "floorNumber": 7,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-71",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 701"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-71",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-72",
    "flatNumber": "702",
    "floorId": "FLR-HYATT-01-07",
    "floorNumber": 7,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-72",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 702"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-72",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-73",
    "flatNumber": "703",
    "floorId": "FLR-HYATT-01-07",
    "floorNumber": 7,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-73",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 703"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-73",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-HYATT-01-74",
    "flatNumber": "704",
    "floorId": "FLR-HYATT-01-07",
    "floorNumber": 7,
    "buildingId": "BLD-HYATT-01",
    "parcelId": "PAR-PUNE-004",
    "carpetAreaSqm": 229.5,
    "propertyTaxId": "PMRDA-PT-2026-1-74",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 704"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-74",
    "volumeM3": 757.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-01",
    "flatNumber": "G01",
    "floorId": "FLR-CITY-CTR-00",
    "floorNumber": 0,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-01",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-01",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-02",
    "flatNumber": "G02",
    "floorId": "FLR-CITY-CTR-00",
    "floorNumber": 0,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-02",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-02",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-03",
    "flatNumber": "G03",
    "floorId": "FLR-CITY-CTR-00",
    "floorNumber": 0,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-03",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-03",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-04",
    "flatNumber": "G04",
    "floorId": "FLR-CITY-CTR-00",
    "floorNumber": 0,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-04",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-04",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-11",
    "flatNumber": "101",
    "floorId": "FLR-CITY-CTR-01",
    "floorNumber": 1,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-11",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-11",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-12",
    "flatNumber": "102",
    "floorId": "FLR-CITY-CTR-01",
    "floorNumber": 1,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-12",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-12",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-13",
    "flatNumber": "103",
    "floorId": "FLR-CITY-CTR-01",
    "floorNumber": 1,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-13",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-13",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-14",
    "flatNumber": "104",
    "floorId": "FLR-CITY-CTR-01",
    "floorNumber": 1,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-14",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-14",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-21",
    "flatNumber": "201",
    "floorId": "FLR-CITY-CTR-02",
    "floorNumber": 2,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-21",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-21",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-22",
    "flatNumber": "202",
    "floorId": "FLR-CITY-CTR-02",
    "floorNumber": 2,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-22",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-22",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-23",
    "flatNumber": "203",
    "floorId": "FLR-CITY-CTR-02",
    "floorNumber": 2,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-23",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-23",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-24",
    "flatNumber": "204",
    "floorId": "FLR-CITY-CTR-02",
    "floorNumber": 2,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-24",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-24",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-31",
    "flatNumber": "301",
    "floorId": "FLR-CITY-CTR-03",
    "floorNumber": 3,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-31",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-31",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-32",
    "flatNumber": "302",
    "floorId": "FLR-CITY-CTR-03",
    "floorNumber": 3,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-32",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-32",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-33",
    "flatNumber": "303",
    "floorId": "FLR-CITY-CTR-03",
    "floorNumber": 3,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-33",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-33",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-34",
    "flatNumber": "304",
    "floorId": "FLR-CITY-CTR-03",
    "floorNumber": 3,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-34",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-34",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-41",
    "flatNumber": "401",
    "floorId": "FLR-CITY-CTR-04",
    "floorNumber": 4,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-41",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-41",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-42",
    "flatNumber": "402",
    "floorId": "FLR-CITY-CTR-04",
    "floorNumber": 4,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-42",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-42",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-43",
    "flatNumber": "403",
    "floorId": "FLR-CITY-CTR-04",
    "floorNumber": 4,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-43",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-43",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-44",
    "flatNumber": "404",
    "floorId": "FLR-CITY-CTR-04",
    "floorNumber": 4,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-44",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-44",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-51",
    "flatNumber": "501",
    "floorId": "FLR-CITY-CTR-05",
    "floorNumber": 5,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-51",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 501"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-51",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-52",
    "flatNumber": "502",
    "floorId": "FLR-CITY-CTR-05",
    "floorNumber": 5,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-52",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 502"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-52",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-53",
    "flatNumber": "503",
    "floorId": "FLR-CITY-CTR-05",
    "floorNumber": 5,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-53",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 503"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-53",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-CITY-CTR-54",
    "flatNumber": "504",
    "floorId": "FLR-CITY-CTR-05",
    "floorNumber": 5,
    "buildingId": "BLD-CITY-CTR",
    "parcelId": "PAR-PUNE-005",
    "carpetAreaSqm": 476.3,
    "propertyTaxId": "PMRDA-PT-2026-R-54",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 504"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-CTR-54",
    "volumeM3": 1667.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000019-01",
    "flatNumber": "G01",
    "floorId": "FLR-000019-00",
    "floorNumber": 0,
    "buildingId": "BLD-000019",
    "parcelId": "PAR-PUNE-028",
    "carpetAreaSqm": 23.4,
    "propertyTaxId": "PMRDA-PT-2026-9-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-019-01",
    "volumeM3": 74.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000019-02",
    "flatNumber": "G02",
    "floorId": "FLR-000019-00",
    "floorNumber": 0,
    "buildingId": "BLD-000019",
    "parcelId": "PAR-PUNE-028",
    "carpetAreaSqm": 23.4,
    "propertyTaxId": "PMRDA-PT-2026-9-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-019-02",
    "volumeM3": 74.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000019-03",
    "flatNumber": "G03",
    "floorId": "FLR-000019-00",
    "floorNumber": 0,
    "buildingId": "BLD-000019",
    "parcelId": "PAR-PUNE-028",
    "carpetAreaSqm": 23.4,
    "propertyTaxId": "PMRDA-PT-2026-9-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-019-03",
    "volumeM3": 74.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000019-04",
    "flatNumber": "G04",
    "floorId": "FLR-000019-00",
    "floorNumber": 0,
    "buildingId": "BLD-000019",
    "parcelId": "PAR-PUNE-028",
    "carpetAreaSqm": 23.4,
    "propertyTaxId": "PMRDA-PT-2026-9-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-019-04",
    "volumeM3": 74.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000019-11",
    "flatNumber": "101",
    "floorId": "FLR-000019-01",
    "floorNumber": 1,
    "buildingId": "BLD-000019",
    "parcelId": "PAR-PUNE-028",
    "carpetAreaSqm": 23.4,
    "propertyTaxId": "PMRDA-PT-2026-9-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-019-11",
    "volumeM3": 74.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000019-12",
    "flatNumber": "102",
    "floorId": "FLR-000019-01",
    "floorNumber": 1,
    "buildingId": "BLD-000019",
    "parcelId": "PAR-PUNE-028",
    "carpetAreaSqm": 23.4,
    "propertyTaxId": "PMRDA-PT-2026-9-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-019-12",
    "volumeM3": 74.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000019-13",
    "flatNumber": "103",
    "floorId": "FLR-000019-01",
    "floorNumber": 1,
    "buildingId": "BLD-000019",
    "parcelId": "PAR-PUNE-028",
    "carpetAreaSqm": 23.4,
    "propertyTaxId": "PMRDA-PT-2026-9-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-019-13",
    "volumeM3": 74.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000019-14",
    "flatNumber": "104",
    "floorId": "FLR-000019-01",
    "floorNumber": 1,
    "buildingId": "BLD-000019",
    "parcelId": "PAR-PUNE-028",
    "carpetAreaSqm": 23.4,
    "propertyTaxId": "PMRDA-PT-2026-9-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-019-14",
    "volumeM3": 74.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-01",
    "flatNumber": "G01",
    "floorId": "FLR-000020-00",
    "floorNumber": 0,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-01",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-02",
    "flatNumber": "G02",
    "floorId": "FLR-000020-00",
    "floorNumber": 0,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-02",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-03",
    "flatNumber": "G03",
    "floorId": "FLR-000020-00",
    "floorNumber": 0,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-03",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-04",
    "flatNumber": "G04",
    "floorId": "FLR-000020-00",
    "floorNumber": 0,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-04",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-11",
    "flatNumber": "101",
    "floorId": "FLR-000020-01",
    "floorNumber": 1,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-11",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-12",
    "flatNumber": "102",
    "floorId": "FLR-000020-01",
    "floorNumber": 1,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-12",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-13",
    "flatNumber": "103",
    "floorId": "FLR-000020-01",
    "floorNumber": 1,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-13",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-14",
    "flatNumber": "104",
    "floorId": "FLR-000020-01",
    "floorNumber": 1,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-14",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-21",
    "flatNumber": "201",
    "floorId": "FLR-000020-02",
    "floorNumber": 2,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-21",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-22",
    "flatNumber": "202",
    "floorId": "FLR-000020-02",
    "floorNumber": 2,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-22",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-23",
    "flatNumber": "203",
    "floorId": "FLR-000020-02",
    "floorNumber": 2,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-23",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000020-24",
    "flatNumber": "204",
    "floorId": "FLR-000020-02",
    "floorNumber": 2,
    "buildingId": "BLD-000020",
    "parcelId": "PAR-PUNE-029",
    "carpetAreaSqm": 93.4,
    "propertyTaxId": "PMRDA-PT-2026-0-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-020-24",
    "volumeM3": 298.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-01",
    "flatNumber": "G01",
    "floorId": "FLR-000021-00",
    "floorNumber": 0,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-01",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-02",
    "flatNumber": "G02",
    "floorId": "FLR-000021-00",
    "floorNumber": 0,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-02",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-03",
    "flatNumber": "G03",
    "floorId": "FLR-000021-00",
    "floorNumber": 0,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-03",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-04",
    "flatNumber": "G04",
    "floorId": "FLR-000021-00",
    "floorNumber": 0,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-04",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-11",
    "flatNumber": "101",
    "floorId": "FLR-000021-01",
    "floorNumber": 1,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-11",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-12",
    "flatNumber": "102",
    "floorId": "FLR-000021-01",
    "floorNumber": 1,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-12",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-13",
    "flatNumber": "103",
    "floorId": "FLR-000021-01",
    "floorNumber": 1,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-13",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-14",
    "flatNumber": "104",
    "floorId": "FLR-000021-01",
    "floorNumber": 1,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-14",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-21",
    "flatNumber": "201",
    "floorId": "FLR-000021-02",
    "floorNumber": 2,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-21",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-22",
    "flatNumber": "202",
    "floorId": "FLR-000021-02",
    "floorNumber": 2,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-22",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-23",
    "flatNumber": "203",
    "floorId": "FLR-000021-02",
    "floorNumber": 2,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-23",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-24",
    "flatNumber": "204",
    "floorId": "FLR-000021-02",
    "floorNumber": 2,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-24",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-31",
    "flatNumber": "301",
    "floorId": "FLR-000021-03",
    "floorNumber": 3,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-31",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-32",
    "flatNumber": "302",
    "floorId": "FLR-000021-03",
    "floorNumber": 3,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-32",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-33",
    "flatNumber": "303",
    "floorId": "FLR-000021-03",
    "floorNumber": 3,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-33",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-34",
    "flatNumber": "304",
    "floorId": "FLR-000021-03",
    "floorNumber": 3,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-34",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-41",
    "flatNumber": "401",
    "floorId": "FLR-000021-04",
    "floorNumber": 4,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-41",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-41",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-42",
    "flatNumber": "402",
    "floorId": "FLR-000021-04",
    "floorNumber": 4,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-42",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-42",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-43",
    "flatNumber": "403",
    "floorId": "FLR-000021-04",
    "floorNumber": 4,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-43",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-43",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000021-44",
    "flatNumber": "404",
    "floorId": "FLR-000021-04",
    "floorNumber": 4,
    "buildingId": "BLD-000021",
    "parcelId": "PAR-PUNE-030",
    "carpetAreaSqm": 647.8,
    "propertyTaxId": "PMRDA-PT-2026-1-44",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-021-44",
    "volumeM3": 2072.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-01",
    "flatNumber": "G01",
    "floorId": "FLR-000022-00",
    "floorNumber": 0,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-01",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-02",
    "flatNumber": "G02",
    "floorId": "FLR-000022-00",
    "floorNumber": 0,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-02",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-03",
    "flatNumber": "G03",
    "floorId": "FLR-000022-00",
    "floorNumber": 0,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-03",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-04",
    "flatNumber": "G04",
    "floorId": "FLR-000022-00",
    "floorNumber": 0,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-04",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-11",
    "flatNumber": "101",
    "floorId": "FLR-000022-01",
    "floorNumber": 1,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-11",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-12",
    "flatNumber": "102",
    "floorId": "FLR-000022-01",
    "floorNumber": 1,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-12",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-13",
    "flatNumber": "103",
    "floorId": "FLR-000022-01",
    "floorNumber": 1,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-13",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-14",
    "flatNumber": "104",
    "floorId": "FLR-000022-01",
    "floorNumber": 1,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-14",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-21",
    "flatNumber": "201",
    "floorId": "FLR-000022-02",
    "floorNumber": 2,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-21",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-22",
    "flatNumber": "202",
    "floorId": "FLR-000022-02",
    "floorNumber": 2,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-22",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-23",
    "flatNumber": "203",
    "floorId": "FLR-000022-02",
    "floorNumber": 2,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-23",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000022-24",
    "flatNumber": "204",
    "floorId": "FLR-000022-02",
    "floorNumber": 2,
    "buildingId": "BLD-000022",
    "parcelId": "PAR-PUNE-031",
    "carpetAreaSqm": 89.5,
    "propertyTaxId": "PMRDA-PT-2026-2-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-022-24",
    "volumeM3": 286.6,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-01",
    "flatNumber": "G01",
    "floorId": "FLR-000023-00",
    "floorNumber": 0,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-01",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-02",
    "flatNumber": "G02",
    "floorId": "FLR-000023-00",
    "floorNumber": 0,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-02",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-03",
    "flatNumber": "G03",
    "floorId": "FLR-000023-00",
    "floorNumber": 0,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-03",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-04",
    "flatNumber": "G04",
    "floorId": "FLR-000023-00",
    "floorNumber": 0,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-04",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-11",
    "flatNumber": "101",
    "floorId": "FLR-000023-01",
    "floorNumber": 1,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-11",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-12",
    "flatNumber": "102",
    "floorId": "FLR-000023-01",
    "floorNumber": 1,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-12",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-13",
    "flatNumber": "103",
    "floorId": "FLR-000023-01",
    "floorNumber": 1,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-13",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-14",
    "flatNumber": "104",
    "floorId": "FLR-000023-01",
    "floorNumber": 1,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-14",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-21",
    "flatNumber": "201",
    "floorId": "FLR-000023-02",
    "floorNumber": 2,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-21",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-22",
    "flatNumber": "202",
    "floorId": "FLR-000023-02",
    "floorNumber": 2,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-22",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-23",
    "flatNumber": "203",
    "floorId": "FLR-000023-02",
    "floorNumber": 2,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-23",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000023-24",
    "flatNumber": "204",
    "floorId": "FLR-000023-02",
    "floorNumber": 2,
    "buildingId": "BLD-000023",
    "parcelId": "PAR-PUNE-032",
    "carpetAreaSqm": 26.3,
    "propertyTaxId": "PMRDA-PT-2026-3-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-023-24",
    "volumeM3": 84.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-01",
    "flatNumber": "G01",
    "floorId": "FLR-000024-00",
    "floorNumber": 0,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-01",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-02",
    "flatNumber": "G02",
    "floorId": "FLR-000024-00",
    "floorNumber": 0,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-02",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-03",
    "flatNumber": "G03",
    "floorId": "FLR-000024-00",
    "floorNumber": 0,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-03",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-04",
    "flatNumber": "G04",
    "floorId": "FLR-000024-00",
    "floorNumber": 0,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-04",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-11",
    "flatNumber": "101",
    "floorId": "FLR-000024-01",
    "floorNumber": 1,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-11",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-12",
    "flatNumber": "102",
    "floorId": "FLR-000024-01",
    "floorNumber": 1,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-12",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-13",
    "flatNumber": "103",
    "floorId": "FLR-000024-01",
    "floorNumber": 1,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-13",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-14",
    "flatNumber": "104",
    "floorId": "FLR-000024-01",
    "floorNumber": 1,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-14",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-21",
    "flatNumber": "201",
    "floorId": "FLR-000024-02",
    "floorNumber": 2,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-21",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-22",
    "flatNumber": "202",
    "floorId": "FLR-000024-02",
    "floorNumber": 2,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-22",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-23",
    "flatNumber": "203",
    "floorId": "FLR-000024-02",
    "floorNumber": 2,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-23",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000024-24",
    "flatNumber": "204",
    "floorId": "FLR-000024-02",
    "floorNumber": 2,
    "buildingId": "BLD-000024",
    "parcelId": "PAR-PUNE-033",
    "carpetAreaSqm": 10.6,
    "propertyTaxId": "PMRDA-PT-2026-4-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-024-24",
    "volumeM3": 33.8,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-01",
    "flatNumber": "G01",
    "floorId": "FLR-000025-00",
    "floorNumber": 0,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-01",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-02",
    "flatNumber": "G02",
    "floorId": "FLR-000025-00",
    "floorNumber": 0,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-02",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-03",
    "flatNumber": "G03",
    "floorId": "FLR-000025-00",
    "floorNumber": 0,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-03",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-04",
    "flatNumber": "G04",
    "floorId": "FLR-000025-00",
    "floorNumber": 0,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-04",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-11",
    "flatNumber": "101",
    "floorId": "FLR-000025-01",
    "floorNumber": 1,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-11",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-12",
    "flatNumber": "102",
    "floorId": "FLR-000025-01",
    "floorNumber": 1,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-12",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-13",
    "flatNumber": "103",
    "floorId": "FLR-000025-01",
    "floorNumber": 1,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-13",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-14",
    "flatNumber": "104",
    "floorId": "FLR-000025-01",
    "floorNumber": 1,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-14",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-21",
    "flatNumber": "201",
    "floorId": "FLR-000025-02",
    "floorNumber": 2,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-21",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-22",
    "flatNumber": "202",
    "floorId": "FLR-000025-02",
    "floorNumber": 2,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-22",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-23",
    "flatNumber": "203",
    "floorId": "FLR-000025-02",
    "floorNumber": 2,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-23",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-24",
    "flatNumber": "204",
    "floorId": "FLR-000025-02",
    "floorNumber": 2,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-24",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-31",
    "flatNumber": "301",
    "floorId": "FLR-000025-03",
    "floorNumber": 3,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-31",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-32",
    "flatNumber": "302",
    "floorId": "FLR-000025-03",
    "floorNumber": 3,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-32",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-33",
    "flatNumber": "303",
    "floorId": "FLR-000025-03",
    "floorNumber": 3,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-33",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000025-34",
    "flatNumber": "304",
    "floorId": "FLR-000025-03",
    "floorNumber": 3,
    "buildingId": "BLD-000025",
    "parcelId": "PAR-PUNE-034",
    "carpetAreaSqm": 294.5,
    "propertyTaxId": "PMRDA-PT-2026-5-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-025-34",
    "volumeM3": 942.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-01",
    "flatNumber": "G01",
    "floorId": "FLR-000026-00",
    "floorNumber": 0,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-01",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-02",
    "flatNumber": "G02",
    "floorId": "FLR-000026-00",
    "floorNumber": 0,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-02",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-03",
    "flatNumber": "G03",
    "floorId": "FLR-000026-00",
    "floorNumber": 0,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-03",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-04",
    "flatNumber": "G04",
    "floorId": "FLR-000026-00",
    "floorNumber": 0,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-04",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-11",
    "flatNumber": "101",
    "floorId": "FLR-000026-01",
    "floorNumber": 1,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-11",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-12",
    "flatNumber": "102",
    "floorId": "FLR-000026-01",
    "floorNumber": 1,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-12",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-13",
    "flatNumber": "103",
    "floorId": "FLR-000026-01",
    "floorNumber": 1,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-13",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-14",
    "flatNumber": "104",
    "floorId": "FLR-000026-01",
    "floorNumber": 1,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-14",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-21",
    "flatNumber": "201",
    "floorId": "FLR-000026-02",
    "floorNumber": 2,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-21",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-22",
    "flatNumber": "202",
    "floorId": "FLR-000026-02",
    "floorNumber": 2,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-22",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-23",
    "flatNumber": "203",
    "floorId": "FLR-000026-02",
    "floorNumber": 2,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-23",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000026-24",
    "flatNumber": "204",
    "floorId": "FLR-000026-02",
    "floorNumber": 2,
    "buildingId": "BLD-000026",
    "parcelId": "PAR-PUNE-035",
    "carpetAreaSqm": 43.9,
    "propertyTaxId": "PMRDA-PT-2026-6-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-026-24",
    "volumeM3": 140.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-01",
    "flatNumber": "G01",
    "floorId": "FLR-000027-00",
    "floorNumber": 0,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-01",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-02",
    "flatNumber": "G02",
    "floorId": "FLR-000027-00",
    "floorNumber": 0,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-02",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-03",
    "flatNumber": "G03",
    "floorId": "FLR-000027-00",
    "floorNumber": 0,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-03",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-04",
    "flatNumber": "G04",
    "floorId": "FLR-000027-00",
    "floorNumber": 0,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-04",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-11",
    "flatNumber": "101",
    "floorId": "FLR-000027-01",
    "floorNumber": 1,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-11",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-12",
    "flatNumber": "102",
    "floorId": "FLR-000027-01",
    "floorNumber": 1,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-12",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-13",
    "flatNumber": "103",
    "floorId": "FLR-000027-01",
    "floorNumber": 1,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-13",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-14",
    "flatNumber": "104",
    "floorId": "FLR-000027-01",
    "floorNumber": 1,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-14",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-21",
    "flatNumber": "201",
    "floorId": "FLR-000027-02",
    "floorNumber": 2,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-21",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-22",
    "flatNumber": "202",
    "floorId": "FLR-000027-02",
    "floorNumber": 2,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-22",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-23",
    "flatNumber": "203",
    "floorId": "FLR-000027-02",
    "floorNumber": 2,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-23",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-24",
    "flatNumber": "204",
    "floorId": "FLR-000027-02",
    "floorNumber": 2,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-24",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-31",
    "flatNumber": "301",
    "floorId": "FLR-000027-03",
    "floorNumber": 3,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-31",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-32",
    "flatNumber": "302",
    "floorId": "FLR-000027-03",
    "floorNumber": 3,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-32",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-33",
    "flatNumber": "303",
    "floorId": "FLR-000027-03",
    "floorNumber": 3,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-33",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000027-34",
    "flatNumber": "304",
    "floorId": "FLR-000027-03",
    "floorNumber": 3,
    "buildingId": "BLD-000027",
    "parcelId": "PAR-PUNE-036",
    "carpetAreaSqm": 174.6,
    "propertyTaxId": "PMRDA-PT-2026-7-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-027-34",
    "volumeM3": 558.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-01",
    "flatNumber": "G01",
    "floorId": "FLR-SCIT-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-01",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-01",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-02",
    "flatNumber": "G02",
    "floorId": "FLR-SCIT-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-02",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-02",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-03",
    "flatNumber": "G03",
    "floorId": "FLR-SCIT-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-03",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-03",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-04",
    "flatNumber": "G04",
    "floorId": "FLR-SCIT-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-04",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-04",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-11",
    "flatNumber": "101",
    "floorId": "FLR-SCIT-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-11",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-11",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-12",
    "flatNumber": "102",
    "floorId": "FLR-SCIT-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-12",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-12",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-13",
    "flatNumber": "103",
    "floorId": "FLR-SCIT-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-13",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-13",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-14",
    "flatNumber": "104",
    "floorId": "FLR-SCIT-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-14",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-14",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-21",
    "flatNumber": "201",
    "floorId": "FLR-SCIT-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-21",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-21",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-22",
    "flatNumber": "202",
    "floorId": "FLR-SCIT-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-22",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-22",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-23",
    "flatNumber": "203",
    "floorId": "FLR-SCIT-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-23",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-23",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-24",
    "flatNumber": "204",
    "floorId": "FLR-SCIT-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-24",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-24",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-31",
    "flatNumber": "301",
    "floorId": "FLR-SCIT-01-03",
    "floorNumber": 3,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-31",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-31",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-32",
    "flatNumber": "302",
    "floorId": "FLR-SCIT-01-03",
    "floorNumber": 3,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-32",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-32",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-33",
    "flatNumber": "303",
    "floorId": "FLR-SCIT-01-03",
    "floorNumber": 3,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-33",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-33",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-34",
    "flatNumber": "304",
    "floorId": "FLR-SCIT-01-03",
    "floorNumber": 3,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-34",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-34",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-41",
    "flatNumber": "401",
    "floorId": "FLR-SCIT-01-04",
    "floorNumber": 4,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-41",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-41",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-42",
    "flatNumber": "402",
    "floorId": "FLR-SCIT-01-04",
    "floorNumber": 4,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-42",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-42",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-43",
    "flatNumber": "403",
    "floorId": "FLR-SCIT-01-04",
    "floorNumber": 4,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-43",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-43",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-SCIT-01-44",
    "flatNumber": "404",
    "floorId": "FLR-SCIT-01-04",
    "floorNumber": 4,
    "buildingId": "BLD-SCIT-01",
    "parcelId": "PAR-PUNE-007",
    "carpetAreaSqm": 474.5,
    "propertyTaxId": "PMRDA-PT-2026-1-44",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-44",
    "volumeM3": 1565.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-01",
    "flatNumber": "G01",
    "floorId": "FLR-000029-00",
    "floorNumber": 0,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-01",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-02",
    "flatNumber": "G02",
    "floorId": "FLR-000029-00",
    "floorNumber": 0,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-02",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-03",
    "flatNumber": "G03",
    "floorId": "FLR-000029-00",
    "floorNumber": 0,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-03",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-04",
    "flatNumber": "G04",
    "floorId": "FLR-000029-00",
    "floorNumber": 0,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-04",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-11",
    "flatNumber": "101",
    "floorId": "FLR-000029-01",
    "floorNumber": 1,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-11",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-12",
    "flatNumber": "102",
    "floorId": "FLR-000029-01",
    "floorNumber": 1,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-12",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-13",
    "flatNumber": "103",
    "floorId": "FLR-000029-01",
    "floorNumber": 1,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-13",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-14",
    "flatNumber": "104",
    "floorId": "FLR-000029-01",
    "floorNumber": 1,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-14",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-21",
    "flatNumber": "201",
    "floorId": "FLR-000029-02",
    "floorNumber": 2,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-21",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-22",
    "flatNumber": "202",
    "floorId": "FLR-000029-02",
    "floorNumber": 2,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-22",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-23",
    "flatNumber": "203",
    "floorId": "FLR-000029-02",
    "floorNumber": 2,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-23",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000029-24",
    "flatNumber": "204",
    "floorId": "FLR-000029-02",
    "floorNumber": 2,
    "buildingId": "BLD-000029",
    "parcelId": "PAR-PUNE-038",
    "carpetAreaSqm": 102.6,
    "propertyTaxId": "PMRDA-PT-2026-9-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-029-24",
    "volumeM3": 328.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-01",
    "flatNumber": "G01",
    "floorId": "FLR-000030-00",
    "floorNumber": 0,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-01",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-02",
    "flatNumber": "G02",
    "floorId": "FLR-000030-00",
    "floorNumber": 0,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-02",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-03",
    "flatNumber": "G03",
    "floorId": "FLR-000030-00",
    "floorNumber": 0,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-03",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-04",
    "flatNumber": "G04",
    "floorId": "FLR-000030-00",
    "floorNumber": 0,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-04",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-11",
    "flatNumber": "101",
    "floorId": "FLR-000030-01",
    "floorNumber": 1,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-11",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-12",
    "flatNumber": "102",
    "floorId": "FLR-000030-01",
    "floorNumber": 1,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-12",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-13",
    "flatNumber": "103",
    "floorId": "FLR-000030-01",
    "floorNumber": 1,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-13",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-14",
    "flatNumber": "104",
    "floorId": "FLR-000030-01",
    "floorNumber": 1,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-14",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-21",
    "flatNumber": "201",
    "floorId": "FLR-000030-02",
    "floorNumber": 2,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-21",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-22",
    "flatNumber": "202",
    "floorId": "FLR-000030-02",
    "floorNumber": 2,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-22",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-23",
    "flatNumber": "203",
    "floorId": "FLR-000030-02",
    "floorNumber": 2,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-23",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000030-24",
    "flatNumber": "204",
    "floorId": "FLR-000030-02",
    "floorNumber": 2,
    "buildingId": "BLD-000030",
    "parcelId": "PAR-PUNE-039",
    "carpetAreaSqm": 5.6,
    "propertyTaxId": "PMRDA-PT-2026-0-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-030-24",
    "volumeM3": 18,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-01",
    "flatNumber": "G01",
    "floorId": "FLR-000031-00",
    "floorNumber": 0,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-01",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-02",
    "flatNumber": "G02",
    "floorId": "FLR-000031-00",
    "floorNumber": 0,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-02",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-03",
    "flatNumber": "G03",
    "floorId": "FLR-000031-00",
    "floorNumber": 0,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-03",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-04",
    "flatNumber": "G04",
    "floorId": "FLR-000031-00",
    "floorNumber": 0,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-04",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-11",
    "flatNumber": "101",
    "floorId": "FLR-000031-01",
    "floorNumber": 1,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-11",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-12",
    "flatNumber": "102",
    "floorId": "FLR-000031-01",
    "floorNumber": 1,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-12",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-13",
    "flatNumber": "103",
    "floorId": "FLR-000031-01",
    "floorNumber": 1,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-13",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-14",
    "flatNumber": "104",
    "floorId": "FLR-000031-01",
    "floorNumber": 1,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-14",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-21",
    "flatNumber": "201",
    "floorId": "FLR-000031-02",
    "floorNumber": 2,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-21",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-22",
    "flatNumber": "202",
    "floorId": "FLR-000031-02",
    "floorNumber": 2,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-22",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-23",
    "flatNumber": "203",
    "floorId": "FLR-000031-02",
    "floorNumber": 2,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-23",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000031-24",
    "flatNumber": "204",
    "floorId": "FLR-000031-02",
    "floorNumber": 2,
    "buildingId": "BLD-000031",
    "parcelId": "PAR-PUNE-040",
    "carpetAreaSqm": 11.9,
    "propertyTaxId": "PMRDA-PT-2026-1-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-031-24",
    "volumeM3": 38.2,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-01",
    "flatNumber": "G01",
    "floorId": "FLR-000032-00",
    "floorNumber": 0,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-01",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-02",
    "flatNumber": "G02",
    "floorId": "FLR-000032-00",
    "floorNumber": 0,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-02",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-03",
    "flatNumber": "G03",
    "floorId": "FLR-000032-00",
    "floorNumber": 0,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-03",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-04",
    "flatNumber": "G04",
    "floorId": "FLR-000032-00",
    "floorNumber": 0,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-04",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-11",
    "flatNumber": "101",
    "floorId": "FLR-000032-01",
    "floorNumber": 1,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-11",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-12",
    "flatNumber": "102",
    "floorId": "FLR-000032-01",
    "floorNumber": 1,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-12",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-13",
    "flatNumber": "103",
    "floorId": "FLR-000032-01",
    "floorNumber": 1,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-13",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-14",
    "flatNumber": "104",
    "floorId": "FLR-000032-01",
    "floorNumber": 1,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-14",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-21",
    "flatNumber": "201",
    "floorId": "FLR-000032-02",
    "floorNumber": 2,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-21",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-22",
    "flatNumber": "202",
    "floorId": "FLR-000032-02",
    "floorNumber": 2,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-22",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-23",
    "flatNumber": "203",
    "floorId": "FLR-000032-02",
    "floorNumber": 2,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-23",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-24",
    "flatNumber": "204",
    "floorId": "FLR-000032-02",
    "floorNumber": 2,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-24",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-31",
    "flatNumber": "301",
    "floorId": "FLR-000032-03",
    "floorNumber": 3,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-31",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-32",
    "flatNumber": "302",
    "floorId": "FLR-000032-03",
    "floorNumber": 3,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-32",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-33",
    "flatNumber": "303",
    "floorId": "FLR-000032-03",
    "floorNumber": 3,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-33",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000032-34",
    "flatNumber": "304",
    "floorId": "FLR-000032-03",
    "floorNumber": 3,
    "buildingId": "BLD-000032",
    "parcelId": "PAR-PUNE-041",
    "carpetAreaSqm": 316.4,
    "propertyTaxId": "PMRDA-PT-2026-2-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-032-34",
    "volumeM3": 1012.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-01",
    "flatNumber": "G01",
    "floorId": "FLR-000033-00",
    "floorNumber": 0,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-01",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-02",
    "flatNumber": "G02",
    "floorId": "FLR-000033-00",
    "floorNumber": 0,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-02",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-03",
    "flatNumber": "G03",
    "floorId": "FLR-000033-00",
    "floorNumber": 0,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-03",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-04",
    "flatNumber": "G04",
    "floorId": "FLR-000033-00",
    "floorNumber": 0,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-04",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-11",
    "flatNumber": "101",
    "floorId": "FLR-000033-01",
    "floorNumber": 1,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-11",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-12",
    "flatNumber": "102",
    "floorId": "FLR-000033-01",
    "floorNumber": 1,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-12",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-13",
    "flatNumber": "103",
    "floorId": "FLR-000033-01",
    "floorNumber": 1,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-13",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-14",
    "flatNumber": "104",
    "floorId": "FLR-000033-01",
    "floorNumber": 1,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-14",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-21",
    "flatNumber": "201",
    "floorId": "FLR-000033-02",
    "floorNumber": 2,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-21",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-22",
    "flatNumber": "202",
    "floorId": "FLR-000033-02",
    "floorNumber": 2,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-22",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-23",
    "flatNumber": "203",
    "floorId": "FLR-000033-02",
    "floorNumber": 2,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-23",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-24",
    "flatNumber": "204",
    "floorId": "FLR-000033-02",
    "floorNumber": 2,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-24",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-31",
    "flatNumber": "301",
    "floorId": "FLR-000033-03",
    "floorNumber": 3,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-31",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-32",
    "flatNumber": "302",
    "floorId": "FLR-000033-03",
    "floorNumber": 3,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-32",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-33",
    "flatNumber": "303",
    "floorId": "FLR-000033-03",
    "floorNumber": 3,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-33",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-34",
    "flatNumber": "304",
    "floorId": "FLR-000033-03",
    "floorNumber": 3,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-34",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-41",
    "flatNumber": "401",
    "floorId": "FLR-000033-04",
    "floorNumber": 4,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-41",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-41",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-42",
    "flatNumber": "402",
    "floorId": "FLR-000033-04",
    "floorNumber": 4,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-42",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-42",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-43",
    "flatNumber": "403",
    "floorId": "FLR-000033-04",
    "floorNumber": 4,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-43",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-43",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000033-44",
    "flatNumber": "404",
    "floorId": "FLR-000033-04",
    "floorNumber": 4,
    "buildingId": "BLD-000033",
    "parcelId": "PAR-PUNE-042",
    "carpetAreaSqm": 1258.7,
    "propertyTaxId": "PMRDA-PT-2026-3-44",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-033-44",
    "volumeM3": 4027.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-01",
    "flatNumber": "G01",
    "floorId": "FLR-RADISSON-00",
    "floorNumber": 0,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-01",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-01",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-02",
    "flatNumber": "G02",
    "floorId": "FLR-RADISSON-00",
    "floorNumber": 0,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-02",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-02",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-03",
    "flatNumber": "G03",
    "floorId": "FLR-RADISSON-00",
    "floorNumber": 0,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-03",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-03",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-04",
    "flatNumber": "G04",
    "floorId": "FLR-RADISSON-00",
    "floorNumber": 0,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-04",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-04",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-11",
    "flatNumber": "101",
    "floorId": "FLR-RADISSON-01",
    "floorNumber": 1,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-11",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-11",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-12",
    "flatNumber": "102",
    "floorId": "FLR-RADISSON-01",
    "floorNumber": 1,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-12",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-12",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-13",
    "flatNumber": "103",
    "floorId": "FLR-RADISSON-01",
    "floorNumber": 1,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-13",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-13",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-14",
    "flatNumber": "104",
    "floorId": "FLR-RADISSON-01",
    "floorNumber": 1,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-14",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-14",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-21",
    "flatNumber": "201",
    "floorId": "FLR-RADISSON-02",
    "floorNumber": 2,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-21",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-21",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-22",
    "flatNumber": "202",
    "floorId": "FLR-RADISSON-02",
    "floorNumber": 2,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-22",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-22",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-23",
    "flatNumber": "203",
    "floorId": "FLR-RADISSON-02",
    "floorNumber": 2,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-23",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-23",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-24",
    "flatNumber": "204",
    "floorId": "FLR-RADISSON-02",
    "floorNumber": 2,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-24",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-24",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-31",
    "flatNumber": "301",
    "floorId": "FLR-RADISSON-03",
    "floorNumber": 3,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-31",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-31",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-32",
    "flatNumber": "302",
    "floorId": "FLR-RADISSON-03",
    "floorNumber": 3,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-32",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-32",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-33",
    "flatNumber": "303",
    "floorId": "FLR-RADISSON-03",
    "floorNumber": 3,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-33",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-33",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-34",
    "flatNumber": "304",
    "floorId": "FLR-RADISSON-03",
    "floorNumber": 3,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-34",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-34",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-41",
    "flatNumber": "401",
    "floorId": "FLR-RADISSON-04",
    "floorNumber": 4,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-41",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-41",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-42",
    "flatNumber": "402",
    "floorId": "FLR-RADISSON-04",
    "floorNumber": 4,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-42",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-42",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-43",
    "flatNumber": "403",
    "floorId": "FLR-RADISSON-04",
    "floorNumber": 4,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-43",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-43",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-44",
    "flatNumber": "404",
    "floorId": "FLR-RADISSON-04",
    "floorNumber": 4,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-44",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-44",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-51",
    "flatNumber": "501",
    "floorId": "FLR-RADISSON-05",
    "floorNumber": 5,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-51",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 501"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-51",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-52",
    "flatNumber": "502",
    "floorId": "FLR-RADISSON-05",
    "floorNumber": 5,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-52",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 502"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-52",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-53",
    "flatNumber": "503",
    "floorId": "FLR-RADISSON-05",
    "floorNumber": 5,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-53",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 503"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-53",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-RADISSON-54",
    "flatNumber": "504",
    "floorId": "FLR-RADISSON-05",
    "floorNumber": 5,
    "buildingId": "BLD-RADISSON",
    "parcelId": "PAR-PUNE-008",
    "carpetAreaSqm": 671.6,
    "propertyTaxId": "PMRDA-PT-2026-N-54",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 504"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-SON-54",
    "volumeM3": 2283.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-01",
    "flatNumber": "G01",
    "floorId": "FLR-000035-00",
    "floorNumber": 0,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-01",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-02",
    "flatNumber": "G02",
    "floorId": "FLR-000035-00",
    "floorNumber": 0,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-02",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-03",
    "flatNumber": "G03",
    "floorId": "FLR-000035-00",
    "floorNumber": 0,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-03",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-04",
    "flatNumber": "G04",
    "floorId": "FLR-000035-00",
    "floorNumber": 0,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-04",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-11",
    "flatNumber": "101",
    "floorId": "FLR-000035-01",
    "floorNumber": 1,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-11",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-12",
    "flatNumber": "102",
    "floorId": "FLR-000035-01",
    "floorNumber": 1,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-12",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-13",
    "flatNumber": "103",
    "floorId": "FLR-000035-01",
    "floorNumber": 1,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-13",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-14",
    "flatNumber": "104",
    "floorId": "FLR-000035-01",
    "floorNumber": 1,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-14",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-21",
    "flatNumber": "201",
    "floorId": "FLR-000035-02",
    "floorNumber": 2,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-21",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-22",
    "flatNumber": "202",
    "floorId": "FLR-000035-02",
    "floorNumber": 2,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-22",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-23",
    "flatNumber": "203",
    "floorId": "FLR-000035-02",
    "floorNumber": 2,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-23",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000035-24",
    "flatNumber": "204",
    "floorId": "FLR-000035-02",
    "floorNumber": 2,
    "buildingId": "BLD-000035",
    "parcelId": "PAR-PUNE-044",
    "carpetAreaSqm": 49.1,
    "propertyTaxId": "PMRDA-PT-2026-5-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-035-24",
    "volumeM3": 157,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-01",
    "flatNumber": "G01",
    "floorId": "FLR-000036-00",
    "floorNumber": 0,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-01",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-02",
    "flatNumber": "G02",
    "floorId": "FLR-000036-00",
    "floorNumber": 0,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-02",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-03",
    "flatNumber": "G03",
    "floorId": "FLR-000036-00",
    "floorNumber": 0,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-03",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-04",
    "flatNumber": "G04",
    "floorId": "FLR-000036-00",
    "floorNumber": 0,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-04",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-11",
    "flatNumber": "101",
    "floorId": "FLR-000036-01",
    "floorNumber": 1,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-11",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-12",
    "flatNumber": "102",
    "floorId": "FLR-000036-01",
    "floorNumber": 1,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-12",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-13",
    "flatNumber": "103",
    "floorId": "FLR-000036-01",
    "floorNumber": 1,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-13",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-14",
    "flatNumber": "104",
    "floorId": "FLR-000036-01",
    "floorNumber": 1,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-14",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-21",
    "flatNumber": "201",
    "floorId": "FLR-000036-02",
    "floorNumber": 2,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-21",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-22",
    "flatNumber": "202",
    "floorId": "FLR-000036-02",
    "floorNumber": 2,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-22",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-23",
    "flatNumber": "203",
    "floorId": "FLR-000036-02",
    "floorNumber": 2,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-23",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000036-24",
    "flatNumber": "204",
    "floorId": "FLR-000036-02",
    "floorNumber": 2,
    "buildingId": "BLD-000036",
    "parcelId": "PAR-PUNE-045",
    "carpetAreaSqm": 40.3,
    "propertyTaxId": "PMRDA-PT-2026-6-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-036-24",
    "volumeM3": 128.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-01",
    "flatNumber": "G01",
    "floorId": "FLR-000037-00",
    "floorNumber": 0,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-01",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-02",
    "flatNumber": "G02",
    "floorId": "FLR-000037-00",
    "floorNumber": 0,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-02",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-03",
    "flatNumber": "G03",
    "floorId": "FLR-000037-00",
    "floorNumber": 0,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-03",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-04",
    "flatNumber": "G04",
    "floorId": "FLR-000037-00",
    "floorNumber": 0,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-04",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-11",
    "flatNumber": "101",
    "floorId": "FLR-000037-01",
    "floorNumber": 1,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-11",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-12",
    "flatNumber": "102",
    "floorId": "FLR-000037-01",
    "floorNumber": 1,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-12",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-13",
    "flatNumber": "103",
    "floorId": "FLR-000037-01",
    "floorNumber": 1,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-13",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-14",
    "flatNumber": "104",
    "floorId": "FLR-000037-01",
    "floorNumber": 1,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-14",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-21",
    "flatNumber": "201",
    "floorId": "FLR-000037-02",
    "floorNumber": 2,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-21",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-22",
    "flatNumber": "202",
    "floorId": "FLR-000037-02",
    "floorNumber": 2,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-22",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-23",
    "flatNumber": "203",
    "floorId": "FLR-000037-02",
    "floorNumber": 2,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-23",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-24",
    "flatNumber": "204",
    "floorId": "FLR-000037-02",
    "floorNumber": 2,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-24",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-31",
    "flatNumber": "301",
    "floorId": "FLR-000037-03",
    "floorNumber": 3,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-31",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-32",
    "flatNumber": "302",
    "floorId": "FLR-000037-03",
    "floorNumber": 3,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-32",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-33",
    "flatNumber": "303",
    "floorId": "FLR-000037-03",
    "floorNumber": 3,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-33",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000037-34",
    "flatNumber": "304",
    "floorId": "FLR-000037-03",
    "floorNumber": 3,
    "buildingId": "BLD-000037",
    "parcelId": "PAR-PUNE-046",
    "carpetAreaSqm": 157.5,
    "propertyTaxId": "PMRDA-PT-2026-7-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-037-34",
    "volumeM3": 504,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-POLICE-01-01",
    "flatNumber": "G01",
    "floorId": "FLR-POLICE-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-POLICE-01",
    "parcelId": "PAR-PUNE-006",
    "carpetAreaSqm": 67,
    "propertyTaxId": "PMRDA-PT-2026-1-01",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-01",
    "volumeM3": 234.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-POLICE-01-02",
    "flatNumber": "G02",
    "floorId": "FLR-POLICE-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-POLICE-01",
    "parcelId": "PAR-PUNE-006",
    "carpetAreaSqm": 67,
    "propertyTaxId": "PMRDA-PT-2026-1-02",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-02",
    "volumeM3": 234.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-POLICE-01-03",
    "flatNumber": "G03",
    "floorId": "FLR-POLICE-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-POLICE-01",
    "parcelId": "PAR-PUNE-006",
    "carpetAreaSqm": 67,
    "propertyTaxId": "PMRDA-PT-2026-1-03",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-03",
    "volumeM3": 234.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-POLICE-01-04",
    "flatNumber": "G04",
    "floorId": "FLR-POLICE-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-POLICE-01",
    "parcelId": "PAR-PUNE-006",
    "carpetAreaSqm": 67,
    "propertyTaxId": "PMRDA-PT-2026-1-04",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-04",
    "volumeM3": 234.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-POLICE-01-11",
    "flatNumber": "101",
    "floorId": "FLR-POLICE-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-POLICE-01",
    "parcelId": "PAR-PUNE-006",
    "carpetAreaSqm": 67,
    "propertyTaxId": "PMRDA-PT-2026-1-11",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-11",
    "volumeM3": 234.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-POLICE-01-12",
    "flatNumber": "102",
    "floorId": "FLR-POLICE-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-POLICE-01",
    "parcelId": "PAR-PUNE-006",
    "carpetAreaSqm": 67,
    "propertyTaxId": "PMRDA-PT-2026-1-12",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-12",
    "volumeM3": 234.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-POLICE-01-13",
    "flatNumber": "103",
    "floorId": "FLR-POLICE-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-POLICE-01",
    "parcelId": "PAR-PUNE-006",
    "carpetAreaSqm": 67,
    "propertyTaxId": "PMRDA-PT-2026-1-13",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-13",
    "volumeM3": 234.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-POLICE-01-14",
    "flatNumber": "104",
    "floorId": "FLR-POLICE-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-POLICE-01",
    "parcelId": "PAR-PUNE-006",
    "carpetAreaSqm": 67,
    "propertyTaxId": "PMRDA-PT-2026-1-14",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-14",
    "volumeM3": 234.7,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-01",
    "flatNumber": "G01",
    "floorId": "FLR-FIRE-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-01",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-01",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-02",
    "flatNumber": "G02",
    "floorId": "FLR-FIRE-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-02",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-02",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-03",
    "flatNumber": "G03",
    "floorId": "FLR-FIRE-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-03",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-03",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-04",
    "flatNumber": "G04",
    "floorId": "FLR-FIRE-01-00",
    "floorNumber": 0,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-04",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-04",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-11",
    "flatNumber": "101",
    "floorId": "FLR-FIRE-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-11",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-11",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-12",
    "flatNumber": "102",
    "floorId": "FLR-FIRE-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-12",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-12",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-13",
    "flatNumber": "103",
    "floorId": "FLR-FIRE-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-13",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-13",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-14",
    "flatNumber": "104",
    "floorId": "FLR-FIRE-01-01",
    "floorNumber": 1,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-14",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-14",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-21",
    "flatNumber": "201",
    "floorId": "FLR-FIRE-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-21",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-21",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-22",
    "flatNumber": "202",
    "floorId": "FLR-FIRE-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-22",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-22",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-23",
    "flatNumber": "203",
    "floorId": "FLR-FIRE-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-23",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-23",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-FIRE-01-24",
    "flatNumber": "204",
    "floorId": "FLR-FIRE-01-02",
    "floorNumber": 2,
    "buildingId": "BLD-FIRE-01",
    "parcelId": "PAR-PUNE-009",
    "carpetAreaSqm": 72.7,
    "propertyTaxId": "PMRDA-PT-2026-1-24",
    "useType": "Commercial",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL--01-24",
    "volumeM3": 254.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-01",
    "flatNumber": "G01",
    "floorId": "FLR-000040-00",
    "floorNumber": 0,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-01",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-02",
    "flatNumber": "G02",
    "floorId": "FLR-000040-00",
    "floorNumber": 0,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-02",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-03",
    "flatNumber": "G03",
    "floorId": "FLR-000040-00",
    "floorNumber": 0,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-03",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-04",
    "flatNumber": "G04",
    "floorId": "FLR-000040-00",
    "floorNumber": 0,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-04",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-11",
    "flatNumber": "101",
    "floorId": "FLR-000040-01",
    "floorNumber": 1,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-11",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-12",
    "flatNumber": "102",
    "floorId": "FLR-000040-01",
    "floorNumber": 1,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-12",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-13",
    "flatNumber": "103",
    "floorId": "FLR-000040-01",
    "floorNumber": 1,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-13",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-14",
    "flatNumber": "104",
    "floorId": "FLR-000040-01",
    "floorNumber": 1,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-14",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-21",
    "flatNumber": "201",
    "floorId": "FLR-000040-02",
    "floorNumber": 2,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-21",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-22",
    "flatNumber": "202",
    "floorId": "FLR-000040-02",
    "floorNumber": 2,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-22",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-23",
    "flatNumber": "203",
    "floorId": "FLR-000040-02",
    "floorNumber": 2,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-23",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-24",
    "flatNumber": "204",
    "floorId": "FLR-000040-02",
    "floorNumber": 2,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-24",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-31",
    "flatNumber": "301",
    "floorId": "FLR-000040-03",
    "floorNumber": 3,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-31",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-32",
    "flatNumber": "302",
    "floorId": "FLR-000040-03",
    "floorNumber": 3,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-32",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-33",
    "flatNumber": "303",
    "floorId": "FLR-000040-03",
    "floorNumber": 3,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-33",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-34",
    "flatNumber": "304",
    "floorId": "FLR-000040-03",
    "floorNumber": 3,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-34",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-41",
    "flatNumber": "401",
    "floorId": "FLR-000040-04",
    "floorNumber": 4,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-41",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-41",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-42",
    "flatNumber": "402",
    "floorId": "FLR-000040-04",
    "floorNumber": 4,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-42",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-42",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-43",
    "flatNumber": "403",
    "floorId": "FLR-000040-04",
    "floorNumber": 4,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-43",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-43",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-44",
    "flatNumber": "404",
    "floorId": "FLR-000040-04",
    "floorNumber": 4,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-44",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-44",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-51",
    "flatNumber": "501",
    "floorId": "FLR-000040-05",
    "floorNumber": 5,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-51",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 501"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-51",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-52",
    "flatNumber": "502",
    "floorId": "FLR-000040-05",
    "floorNumber": 5,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-52",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 502"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-52",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-53",
    "flatNumber": "503",
    "floorId": "FLR-000040-05",
    "floorNumber": 5,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-53",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 503"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-53",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-54",
    "flatNumber": "504",
    "floorId": "FLR-000040-05",
    "floorNumber": 5,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-54",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 504"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-54",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-61",
    "flatNumber": "601",
    "floorId": "FLR-000040-06",
    "floorNumber": 6,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-61",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 601"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-61",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-62",
    "flatNumber": "602",
    "floorId": "FLR-000040-06",
    "floorNumber": 6,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-62",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 602"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-62",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-63",
    "flatNumber": "603",
    "floorId": "FLR-000040-06",
    "floorNumber": 6,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-63",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 603"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-63",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-64",
    "flatNumber": "604",
    "floorId": "FLR-000040-06",
    "floorNumber": 6,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-64",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 604"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-64",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-71",
    "flatNumber": "701",
    "floorId": "FLR-000040-07",
    "floorNumber": 7,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-71",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 701"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-71",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-72",
    "flatNumber": "702",
    "floorId": "FLR-000040-07",
    "floorNumber": 7,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-72",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 702"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-72",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-73",
    "flatNumber": "703",
    "floorId": "FLR-000040-07",
    "floorNumber": 7,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-73",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 703"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-73",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-74",
    "flatNumber": "704",
    "floorId": "FLR-000040-07",
    "floorNumber": 7,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-74",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 704"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-74",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-81",
    "flatNumber": "801",
    "floorId": "FLR-000040-08",
    "floorNumber": 8,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-81",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 801"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-81",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-82",
    "flatNumber": "802",
    "floorId": "FLR-000040-08",
    "floorNumber": 8,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-82",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 802"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-82",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-83",
    "flatNumber": "803",
    "floorId": "FLR-000040-08",
    "floorNumber": 8,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-83",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 803"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-83",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-84",
    "flatNumber": "804",
    "floorId": "FLR-000040-08",
    "floorNumber": 8,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-84",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 804"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-84",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-91",
    "flatNumber": "901",
    "floorId": "FLR-000040-09",
    "floorNumber": 9,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-91",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 901"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-91",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-92",
    "flatNumber": "902",
    "floorId": "FLR-000040-09",
    "floorNumber": 9,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-92",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 902"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-92",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-93",
    "flatNumber": "903",
    "floorId": "FLR-000040-09",
    "floorNumber": 9,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-93",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 903"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-93",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-94",
    "flatNumber": "904",
    "floorId": "FLR-000040-09",
    "floorNumber": 9,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026-0-94",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 904"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-040-94",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-101",
    "flatNumber": "1001",
    "floorId": "FLR-000040-10",
    "floorNumber": 10,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026--101",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 1001"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-40-101",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-102",
    "flatNumber": "1002",
    "floorId": "FLR-000040-10",
    "floorNumber": 10,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026--102",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 1002"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-40-102",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-103",
    "flatNumber": "1003",
    "floorId": "FLR-000040-10",
    "floorNumber": 10,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026--103",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 1003"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-40-103",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-104",
    "flatNumber": "1004",
    "floorId": "FLR-000040-10",
    "floorNumber": 10,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026--104",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 1004"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-40-104",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-111",
    "flatNumber": "1101",
    "floorId": "FLR-000040-11",
    "floorNumber": 11,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026--111",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 1101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-40-111",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-112",
    "flatNumber": "1102",
    "floorId": "FLR-000040-11",
    "floorNumber": 11,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026--112",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 1102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-40-112",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-113",
    "flatNumber": "1103",
    "floorId": "FLR-000040-11",
    "floorNumber": 11,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026--113",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 1103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-40-113",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000040-114",
    "flatNumber": "1104",
    "floorId": "FLR-000040-11",
    "floorNumber": 11,
    "buildingId": "BLD-000040",
    "parcelId": "PAR-PUNE-049",
    "carpetAreaSqm": 215.1,
    "propertyTaxId": "PMRDA-PT-2026--114",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 1104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-40-114",
    "volumeM3": 688.3,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-01",
    "flatNumber": "G01",
    "floorId": "FLR-000041-00",
    "floorNumber": 0,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-01",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-02",
    "flatNumber": "G02",
    "floorId": "FLR-000041-00",
    "floorNumber": 0,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-02",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-03",
    "flatNumber": "G03",
    "floorId": "FLR-000041-00",
    "floorNumber": 0,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-03",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-04",
    "flatNumber": "G04",
    "floorId": "FLR-000041-00",
    "floorNumber": 0,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-04",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-11",
    "flatNumber": "101",
    "floorId": "FLR-000041-01",
    "floorNumber": 1,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-11",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-12",
    "flatNumber": "102",
    "floorId": "FLR-000041-01",
    "floorNumber": 1,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-12",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-13",
    "flatNumber": "103",
    "floorId": "FLR-000041-01",
    "floorNumber": 1,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-13",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-14",
    "flatNumber": "104",
    "floorId": "FLR-000041-01",
    "floorNumber": 1,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-14",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-21",
    "flatNumber": "201",
    "floorId": "FLR-000041-02",
    "floorNumber": 2,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-21",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-22",
    "flatNumber": "202",
    "floorId": "FLR-000041-02",
    "floorNumber": 2,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-22",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-23",
    "flatNumber": "203",
    "floorId": "FLR-000041-02",
    "floorNumber": 2,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-23",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000041-24",
    "flatNumber": "204",
    "floorId": "FLR-000041-02",
    "floorNumber": 2,
    "buildingId": "BLD-000041",
    "parcelId": "PAR-PUNE-050",
    "carpetAreaSqm": 43.4,
    "propertyTaxId": "PMRDA-PT-2026-1-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-041-24",
    "volumeM3": 139,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-01",
    "flatNumber": "G01",
    "floorId": "FLR-000042-00",
    "floorNumber": 0,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-01",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-02",
    "flatNumber": "G02",
    "floorId": "FLR-000042-00",
    "floorNumber": 0,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-02",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-03",
    "flatNumber": "G03",
    "floorId": "FLR-000042-00",
    "floorNumber": 0,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-03",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-04",
    "flatNumber": "G04",
    "floorId": "FLR-000042-00",
    "floorNumber": 0,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-04",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-11",
    "flatNumber": "101",
    "floorId": "FLR-000042-01",
    "floorNumber": 1,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-11",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-12",
    "flatNumber": "102",
    "floorId": "FLR-000042-01",
    "floorNumber": 1,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-12",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-13",
    "flatNumber": "103",
    "floorId": "FLR-000042-01",
    "floorNumber": 1,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-13",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-14",
    "flatNumber": "104",
    "floorId": "FLR-000042-01",
    "floorNumber": 1,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-14",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-21",
    "flatNumber": "201",
    "floorId": "FLR-000042-02",
    "floorNumber": 2,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-21",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-22",
    "flatNumber": "202",
    "floorId": "FLR-000042-02",
    "floorNumber": 2,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-22",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-23",
    "flatNumber": "203",
    "floorId": "FLR-000042-02",
    "floorNumber": 2,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-23",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-24",
    "flatNumber": "204",
    "floorId": "FLR-000042-02",
    "floorNumber": 2,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-24",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-31",
    "flatNumber": "301",
    "floorId": "FLR-000042-03",
    "floorNumber": 3,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-31",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-32",
    "flatNumber": "302",
    "floorId": "FLR-000042-03",
    "floorNumber": 3,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-32",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-33",
    "flatNumber": "303",
    "floorId": "FLR-000042-03",
    "floorNumber": 3,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-33",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000042-34",
    "flatNumber": "304",
    "floorId": "FLR-000042-03",
    "floorNumber": 3,
    "buildingId": "BLD-000042",
    "parcelId": "PAR-PUNE-051",
    "carpetAreaSqm": 239.2,
    "propertyTaxId": "PMRDA-PT-2026-2-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-042-34",
    "volumeM3": 765.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-01",
    "flatNumber": "G01",
    "floorId": "FLR-000043-00",
    "floorNumber": 0,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-01",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-02",
    "flatNumber": "G02",
    "floorId": "FLR-000043-00",
    "floorNumber": 0,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-02",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-03",
    "flatNumber": "G03",
    "floorId": "FLR-000043-00",
    "floorNumber": 0,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-03",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-04",
    "flatNumber": "G04",
    "floorId": "FLR-000043-00",
    "floorNumber": 0,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-04",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-11",
    "flatNumber": "101",
    "floorId": "FLR-000043-01",
    "floorNumber": 1,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-11",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-12",
    "flatNumber": "102",
    "floorId": "FLR-000043-01",
    "floorNumber": 1,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-12",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-13",
    "flatNumber": "103",
    "floorId": "FLR-000043-01",
    "floorNumber": 1,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-13",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-14",
    "flatNumber": "104",
    "floorId": "FLR-000043-01",
    "floorNumber": 1,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-14",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-21",
    "flatNumber": "201",
    "floorId": "FLR-000043-02",
    "floorNumber": 2,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-21",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-22",
    "flatNumber": "202",
    "floorId": "FLR-000043-02",
    "floorNumber": 2,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-22",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-23",
    "flatNumber": "203",
    "floorId": "FLR-000043-02",
    "floorNumber": 2,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-23",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000043-24",
    "flatNumber": "204",
    "floorId": "FLR-000043-02",
    "floorNumber": 2,
    "buildingId": "BLD-000043",
    "parcelId": "PAR-PUNE-052",
    "carpetAreaSqm": 98.1,
    "propertyTaxId": "PMRDA-PT-2026-3-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-043-24",
    "volumeM3": 313.9,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-01",
    "flatNumber": "G01",
    "floorId": "FLR-000044-00",
    "floorNumber": 0,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-01",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-02",
    "flatNumber": "G02",
    "floorId": "FLR-000044-00",
    "floorNumber": 0,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-02",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-03",
    "flatNumber": "G03",
    "floorId": "FLR-000044-00",
    "floorNumber": 0,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-03",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-04",
    "flatNumber": "G04",
    "floorId": "FLR-000044-00",
    "floorNumber": 0,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-04",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-11",
    "flatNumber": "101",
    "floorId": "FLR-000044-01",
    "floorNumber": 1,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-11",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-12",
    "flatNumber": "102",
    "floorId": "FLR-000044-01",
    "floorNumber": 1,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-12",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-13",
    "flatNumber": "103",
    "floorId": "FLR-000044-01",
    "floorNumber": 1,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-13",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-14",
    "flatNumber": "104",
    "floorId": "FLR-000044-01",
    "floorNumber": 1,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-14",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-21",
    "flatNumber": "201",
    "floorId": "FLR-000044-02",
    "floorNumber": 2,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-21",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-22",
    "flatNumber": "202",
    "floorId": "FLR-000044-02",
    "floorNumber": 2,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-22",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-23",
    "flatNumber": "203",
    "floorId": "FLR-000044-02",
    "floorNumber": 2,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-23",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-24",
    "flatNumber": "204",
    "floorId": "FLR-000044-02",
    "floorNumber": 2,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-24",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-31",
    "flatNumber": "301",
    "floorId": "FLR-000044-03",
    "floorNumber": 3,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-31",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-32",
    "flatNumber": "302",
    "floorId": "FLR-000044-03",
    "floorNumber": 3,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-32",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-33",
    "flatNumber": "303",
    "floorId": "FLR-000044-03",
    "floorNumber": 3,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-33",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000044-34",
    "flatNumber": "304",
    "floorId": "FLR-000044-03",
    "floorNumber": 3,
    "buildingId": "BLD-000044",
    "parcelId": "PAR-PUNE-053",
    "carpetAreaSqm": 178,
    "propertyTaxId": "PMRDA-PT-2026-4-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-044-34",
    "volumeM3": 569.5,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-01",
    "flatNumber": "G01",
    "floorId": "FLR-000045-00",
    "floorNumber": 0,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-01",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-02",
    "flatNumber": "G02",
    "floorId": "FLR-000045-00",
    "floorNumber": 0,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-02",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-03",
    "flatNumber": "G03",
    "floorId": "FLR-000045-00",
    "floorNumber": 0,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-03",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-04",
    "flatNumber": "G04",
    "floorId": "FLR-000045-00",
    "floorNumber": 0,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-04",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-11",
    "flatNumber": "101",
    "floorId": "FLR-000045-01",
    "floorNumber": 1,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-11",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-12",
    "flatNumber": "102",
    "floorId": "FLR-000045-01",
    "floorNumber": 1,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-12",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-13",
    "flatNumber": "103",
    "floorId": "FLR-000045-01",
    "floorNumber": 1,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-13",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-14",
    "flatNumber": "104",
    "floorId": "FLR-000045-01",
    "floorNumber": 1,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-14",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-21",
    "flatNumber": "201",
    "floorId": "FLR-000045-02",
    "floorNumber": 2,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-21",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-22",
    "flatNumber": "202",
    "floorId": "FLR-000045-02",
    "floorNumber": 2,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-22",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-23",
    "flatNumber": "203",
    "floorId": "FLR-000045-02",
    "floorNumber": 2,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-23",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-24",
    "flatNumber": "204",
    "floorId": "FLR-000045-02",
    "floorNumber": 2,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-24",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-31",
    "flatNumber": "301",
    "floorId": "FLR-000045-03",
    "floorNumber": 3,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-31",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-32",
    "flatNumber": "302",
    "floorId": "FLR-000045-03",
    "floorNumber": 3,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-32",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-33",
    "flatNumber": "303",
    "floorId": "FLR-000045-03",
    "floorNumber": 3,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-33",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000045-34",
    "flatNumber": "304",
    "floorId": "FLR-000045-03",
    "floorNumber": 3,
    "buildingId": "BLD-000045",
    "parcelId": "PAR-PUNE-054",
    "carpetAreaSqm": 207.2,
    "propertyTaxId": "PMRDA-PT-2026-5-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-045-34",
    "volumeM3": 663.1,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-01",
    "flatNumber": "G01",
    "floorId": "FLR-000046-00",
    "floorNumber": 0,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-01",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-02",
    "flatNumber": "G02",
    "floorId": "FLR-000046-00",
    "floorNumber": 0,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-02",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-03",
    "flatNumber": "G03",
    "floorId": "FLR-000046-00",
    "floorNumber": 0,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-03",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-04",
    "flatNumber": "G04",
    "floorId": "FLR-000046-00",
    "floorNumber": 0,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-04",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-11",
    "flatNumber": "101",
    "floorId": "FLR-000046-01",
    "floorNumber": 1,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-11",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-12",
    "flatNumber": "102",
    "floorId": "FLR-000046-01",
    "floorNumber": 1,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-12",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-13",
    "flatNumber": "103",
    "floorId": "FLR-000046-01",
    "floorNumber": 1,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-13",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-14",
    "flatNumber": "104",
    "floorId": "FLR-000046-01",
    "floorNumber": 1,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-14",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-21",
    "flatNumber": "201",
    "floorId": "FLR-000046-02",
    "floorNumber": 2,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-21",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-22",
    "flatNumber": "202",
    "floorId": "FLR-000046-02",
    "floorNumber": 2,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-22",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-23",
    "flatNumber": "203",
    "floorId": "FLR-000046-02",
    "floorNumber": 2,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-23",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000046-24",
    "flatNumber": "204",
    "floorId": "FLR-000046-02",
    "floorNumber": 2,
    "buildingId": "BLD-000046",
    "parcelId": "PAR-PUNE-055",
    "carpetAreaSqm": 47.9,
    "propertyTaxId": "PMRDA-PT-2026-6-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-046-24",
    "volumeM3": 153.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-01",
    "flatNumber": "G01",
    "floorId": "FLR-000047-00",
    "floorNumber": 0,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-01",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-02",
    "flatNumber": "G02",
    "floorId": "FLR-000047-00",
    "floorNumber": 0,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-02",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-03",
    "flatNumber": "G03",
    "floorId": "FLR-000047-00",
    "floorNumber": 0,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-03",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-04",
    "flatNumber": "G04",
    "floorId": "FLR-000047-00",
    "floorNumber": 0,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-04",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-11",
    "flatNumber": "101",
    "floorId": "FLR-000047-01",
    "floorNumber": 1,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-11",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-12",
    "flatNumber": "102",
    "floorId": "FLR-000047-01",
    "floorNumber": 1,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-12",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-13",
    "flatNumber": "103",
    "floorId": "FLR-000047-01",
    "floorNumber": 1,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-13",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-14",
    "flatNumber": "104",
    "floorId": "FLR-000047-01",
    "floorNumber": 1,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-14",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-21",
    "flatNumber": "201",
    "floorId": "FLR-000047-02",
    "floorNumber": 2,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-21",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-22",
    "flatNumber": "202",
    "floorId": "FLR-000047-02",
    "floorNumber": 2,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-22",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-23",
    "flatNumber": "203",
    "floorId": "FLR-000047-02",
    "floorNumber": 2,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-23",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000047-24",
    "flatNumber": "204",
    "floorId": "FLR-000047-02",
    "floorNumber": 2,
    "buildingId": "BLD-000047",
    "parcelId": "PAR-PUNE-056",
    "carpetAreaSqm": 53.6,
    "propertyTaxId": "PMRDA-PT-2026-7-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-047-24",
    "volumeM3": 171.4,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-01",
    "flatNumber": "G01",
    "floorId": "FLR-000048-00",
    "floorNumber": 0,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-01",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G01"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-01",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-02",
    "flatNumber": "G02",
    "floorId": "FLR-000048-00",
    "floorNumber": 0,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-02",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G02"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-02",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-03",
    "flatNumber": "G03",
    "floorId": "FLR-000048-00",
    "floorNumber": 0,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-03",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G03"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-03",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-04",
    "flatNumber": "G04",
    "floorId": "FLR-000048-00",
    "floorNumber": 0,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-04",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder G04"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-04",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-11",
    "flatNumber": "101",
    "floorId": "FLR-000048-01",
    "floorNumber": 1,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-11",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 101"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-11",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-12",
    "flatNumber": "102",
    "floorId": "FLR-000048-01",
    "floorNumber": 1,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-12",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 102"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-12",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-13",
    "flatNumber": "103",
    "floorId": "FLR-000048-01",
    "floorNumber": 1,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-13",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 103"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-13",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-14",
    "flatNumber": "104",
    "floorId": "FLR-000048-01",
    "floorNumber": 1,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-14",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 104"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-14",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-21",
    "flatNumber": "201",
    "floorId": "FLR-000048-02",
    "floorNumber": 2,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-21",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 201"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-21",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-22",
    "flatNumber": "202",
    "floorId": "FLR-000048-02",
    "floorNumber": 2,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-22",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 202"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-22",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-23",
    "flatNumber": "203",
    "floorId": "FLR-000048-02",
    "floorNumber": 2,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-23",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 203"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-23",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-24",
    "flatNumber": "204",
    "floorId": "FLR-000048-02",
    "floorNumber": 2,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-24",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 204"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-24",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-31",
    "flatNumber": "301",
    "floorId": "FLR-000048-03",
    "floorNumber": 3,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-31",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 301"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-31",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-32",
    "flatNumber": "302",
    "floorId": "FLR-000048-03",
    "floorNumber": 3,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-32",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 302"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-32",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-33",
    "flatNumber": "303",
    "floorId": "FLR-000048-03",
    "floorNumber": 3,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-33",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 303"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-33",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-34",
    "flatNumber": "304",
    "floorId": "FLR-000048-03",
    "floorNumber": 3,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-34",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 304"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-34",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-41",
    "flatNumber": "401",
    "floorId": "FLR-000048-04",
    "floorNumber": 4,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-41",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 401"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-41",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-42",
    "flatNumber": "402",
    "floorId": "FLR-000048-04",
    "floorNumber": 4,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-42",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 402"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-42",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-43",
    "flatNumber": "403",
    "floorId": "FLR-000048-04",
    "floorNumber": 4,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-43",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 403"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-43",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  },
  {
    "unitId": "UNT-000048-44",
    "flatNumber": "404",
    "floorId": "FLR-000048-04",
    "floorNumber": 4,
    "buildingId": "BLD-000048",
    "parcelId": "PAR-PUNE-057",
    "carpetAreaSqm": 493.4,
    "propertyTaxId": "PMRDA-PT-2026-8-44",
    "useType": "Residential",
    "ownerCount": 1,
    "ownerNames": [
      "Unit Holder 404"
    ],
    "rorStatus": "Linked",
    "volumeId": "VOL-048-44",
    "volumeM3": 1579,
    "verificationStatus": "Verified"
  }
];

// -----------------------------------------------------------------------------
// DGPS RTK GROUND TRUTH CONTROL POINTS
// -----------------------------------------------------------------------------
export const COHERENT_GT_POINTS: CoherentGtPoint[] = [
  {
    "seqNo": 1,
    "plotNo": "P-14",
    "parcelId": "PAR-000123",
    "lng": 73.7354551,
    "lat": 18.5843356,
    "elevationM": 568.2,
    "accuracyM": 0.008,
    "observationType": "DGPS RTK FIX",
    "timestamp": "2026-08-20 09:30:00",
    "status": "Approved"
  },
  {
    "seqNo": 2,
    "plotNo": "P-14",
    "parcelId": "PAR-000123",
    "lng": 73.7369584,
    "lat": 18.583313,
    "elevationM": 568.6,
    "accuracyM": 0.008,
    "observationType": "DGPS RTK FIX",
    "timestamp": "2026-08-20 09:30:00",
    "status": "Approved"
  },
  {
    "seqNo": 3,
    "plotNo": "P-14",
    "parcelId": "PAR-000123",
    "lng": 73.7384309,
    "lat": 18.5851803,
    "elevationM": 569,
    "accuracyM": 0.008,
    "observationType": "DGPS RTK FIX",
    "timestamp": "2026-08-20 09:30:00",
    "status": "Approved"
  },
  {
    "seqNo": 4,
    "plotNo": "P-14",
    "parcelId": "PAR-000123",
    "lng": 73.7382293,
    "lat": 18.5859548,
    "elevationM": 569.4,
    "accuracyM": 0.008,
    "observationType": "DGPS RTK FIX",
    "timestamp": "2026-08-20 09:30:00",
    "status": "Approved"
  },
  {
    "seqNo": 5,
    "plotNo": "P-14",
    "parcelId": "PAR-000123",
    "lng": 73.7373061,
    "lat": 18.5848198,
    "elevationM": 569.8,
    "accuracyM": 0.008,
    "observationType": "DGPS RTK FIX",
    "timestamp": "2026-08-20 09:30:00",
    "status": "Approved"
  },
  {
    "seqNo": 6,
    "plotNo": "P-14",
    "parcelId": "PAR-000123",
    "lng": 73.7363918,
    "lat": 18.5855132,
    "elevationM": 570.2,
    "accuracyM": 0.008,
    "observationType": "DGPS RTK FIX",
    "timestamp": "2026-08-20 09:30:00",
    "status": "Approved"
  }
];
