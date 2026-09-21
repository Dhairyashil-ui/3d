// State store for end-to-end PPCRC 3D Urban Survey & ULPIN Property Card Pipeline
// Desktop -> ULB Ingestion -> Surveyor Verification -> ULB Publication & BhuNaksha

export interface IngestedPackage {
  id: string;
  name: string;
  type: 'ori' | 'gis2d' | 'survey3d' | 'vertical_property';
  fileFormat: string;
  fileName: string;
  fileSize: string;
  checksumSha256: string;
  crs: string;
  verified: boolean;
  verifiedAt?: string;
  details: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  designation: string;
  department: string;
  employeeId: string;
  avatarColor: string;
}

export interface SurveyTeam {
  mainOfficer: TeamMember;
  members: TeamMember[];
  assignedAt: string;
  mandateReference: string;
}

export interface VerificationCheckpoint {
  id: string;
  title: string;
  description: string;
  standardTolerance: string;
  observedValue: string;
  status: 'pending' | 'verified' | 'failed';
  verifiedAt?: string;
}

export interface PpcrcPipelineData {
  projectName: string;
  propertyTitle: string;
  ulpin: string;
  ctsNumber: string;
  district: string;
  taluka: string;
  villageWard: string;
  ulbName: string;
  ulbCode: string;
  latitude: number;
  longitude: number;
  elevationMsl: number;
  buildingHeightM: number;
  totalStoreys: string;
  builtUpAreaSqM: number;
  packages: IngestedPackage[];
  desktopSubmittedToUlb: boolean;
  desktopSubmittedAt?: string;
  surveyTeamAssigned: boolean;
  surveyTeam?: SurveyTeam;
  teamDispatchedToSurveyor: boolean;
  teamDispatchedAt?: string;
  checkpoints: VerificationCheckpoint[];
  allCheckpointsVerified: boolean;
  surveyorSubmittedToUlb: boolean;
  surveyorSubmittedAt?: string;
  threeDBuildingFile: string;
  transmittedToBhunaksha: boolean;
  transmittedToBhunakshaAt?: string;
  bhunakshaReferenceNumber?: string;
  propertyCardGenerated: boolean;
  propertyCardGeneratedAt?: string;
}

const DEFAULT_PACKAGES: IngestedPackage[] = [
  {
    id: 'pkg-1',
    name: 'ORI & Ortho Imagery Package',
    type: 'ori',
    fileFormat: '.tbk / .tpk',
    fileName: 'PPCRC_Ortho_LOD3_Imagery.tbk',
    fileSize: '482.4 MB',
    checksumSha256: '9a7e8b12c45f3d018e62d4bb67a9921c8402ff71',
    crs: 'WGS 84 / UTM Zone 43N (EPSG:32643)',
    verified: false,
    details: '0.015m GSD high-density true-orthomosaic tile bundle with aerial sensor calibration'
  },
  {
    id: 'pkg-2',
    name: '2D GIS Cadastral Package',
    type: 'gis2d',
    fileFormat: '.gdb, .zip',
    fileName: 'PPCRC_Cadastral_Boundaries_CTS342.gdb.zip',
    fileSize: '64.8 MB',
    checksumSha256: '3f51b918a2cd710e44b82199ac201d447812bc89',
    crs: 'WGS 84 / UTM Zone 43N (EPSG:32643)',
    verified: false,
    details: 'PMRDA CTS 342/1 parcel polygon boundary, boundary stone coordinates & road buffer offsets'
  },
  {
    id: 'pkg-3',
    name: '3D Survey Photogrammetry Package',
    type: 'survey3d',
    fileFormat: '.zip',
    fileName: 'PPCRC_3D_Mesh_Photogrammetry_LOD3.zip',
    fileSize: '1.24 GB',
    checksumSha256: '88de9120bc714f331908221adbc49019772b1154',
    crs: 'MSL EGM2008 / UTM 43N',
    verified: false,
    details: 'LOD 3.0 watertight 3D reconstructed mesh with 4K textured architectural facades'
  },
  {
    id: 'pkg-4',
    name: 'Vertical Property & Floor Unit Package',
    type: 'vertical_property',
    fileFormat: '.zip',
    fileName: 'PPCRC_Vertical_Units_Cadastre.zip',
    fileSize: '112.5 MB',
    checksumSha256: '77ac0012de9412ffbb890123cb67882109ab3481',
    crs: 'Local Engineering Grid tied to UTM 43N',
    verified: false,
    details: '3D volumetric subdivision for G+3 floors, 24 individual property units and common utility easements'
  }
];

const DEFAULT_MAIN_OFFICER: TeamMember = {
  id: 'off-main',
  name: 'Dr. Rajesh Deshmukh',
  role: 'Main Superintending Officer & Team Lead',
  designation: 'Chief Cadastral Surveyor & Superintending Land Records Officer',
  department: 'PMRDA Land Records & Town Planning Authority',
  employeeId: 'MH-SLR-PUN-0410',
  avatarColor: '#1d4ed8'
};

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Anil Kadam',
    role: 'Senior GIS & Photogrammetry Specialist',
    designation: 'Deputy Superintendent of Land Records',
    department: 'Geospatial Extraction Division',
    employeeId: 'MH-GIS-842',
    avatarColor: '#0891b2'
  },
  {
    id: 'tm-2',
    name: 'Pooja Sharma',
    role: 'Drone Survey Pilot & LiDAR Sensor Analyst',
    designation: 'Senior Technical Officer (Aviation & Remote Sensing)',
    department: 'Drone Survey Wing PMRDA',
    employeeId: 'MH-UAV-109',
    avatarColor: '#7c3aed'
  },
  {
    id: 'tm-3',
    name: 'Vikas Gaikwad',
    role: 'Ground Truthing & RoR Verification Officer',
    designation: 'Cadastral Verification Inspector',
    department: 'District Revenue Office',
    employeeId: 'MH-GTR-331',
    avatarColor: '#ea580c'
  },
  {
    id: 'tm-4',
    name: 'Suresh Mane',
    role: 'Vertical Property & 3D Cadastral Auditor',
    designation: 'Municipal Architectural Inspector',
    department: 'Urban Development & Building Registry',
    employeeId: 'MH-VPC-518',
    avatarColor: '#059669'
  }
];

const DEFAULT_CHECKPOINTS: VerificationCheckpoint[] = [
  {
    id: 'cp-1',
    title: 'DGPS / RTK Ground Control Point (GCP) Alignment',
    description: 'Verify field benchmark monument coordinates against Cors Network and drone sensor telemetry',
    standardTolerance: 'Horizontal < 2.5cm | Vertical < 3.0cm RMSE',
    observedValue: 'Observed horizontal shift 1.1cm, vertical shift 1.4cm (PASSED)',
    status: 'pending'
  },
  {
    id: 'cp-2',
    title: '2D Cadastral Boundary vs Drone Ortho Match (CTS 342/1)',
    description: 'Ensure boundary coordinates match statutory revenue sheet boundaries and road setback lines',
    standardTolerance: 'Discrepancy < 0.05m along all 14 parcel vertices',
    observedValue: '100% boundary edge alignment with revenue boundary stones',
    status: 'pending'
  },
  {
    id: 'cp-3',
    title: '3D Building Facade, Height & Roof Conformance (LOD 3.0)',
    description: 'Confirm 3D mesh building height, cornice elevation, and facade openings match architectural clearance',
    standardTolerance: 'Height tolerance ± 0.15m from datum 568.20m MSL',
    observedValue: 'Building height 16.40m matching sanctioned PMRDA layout plan',
    status: 'pending'
  },
  {
    id: 'cp-4',
    title: 'Floor-by-Floor Vertical Unit Division Audit',
    description: 'Inspect 3D volumetric boundaries for Units G-01 through 304, stairwell, and elevator shafts',
    standardTolerance: 'Zero volumetric collision; 100% boundary envelope closure',
    observedValue: 'All 24 unit envelopes completely sealed and attributed',
    status: 'pending'
  },
  {
    id: 'cp-5',
    title: 'Legal RoR & Title Deed Cross-Audit',
    description: 'Verify 7/12 extract, assessment index II, and municipal tax records linkage to PPCRC',
    standardTolerance: 'Zero title discrepancy; encumbrance check verified',
    observedValue: 'Clear statutory title registered under CTS No. 342/1',
    status: 'pending'
  }
];

const STORAGE_KEY = 'naksha_ppcrc_survey_pipeline_v1';

export class SurveyPipelineStore {
  private static loadData(): PpcrcPipelineData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {
      projectName: 'NAKSHA 3D Aerial Survey & Vertical Cadastre',
      propertyTitle: 'PPCRC Institutional & Tech Complex',
      ulpin: 'MH27041001002026PPCRC01',
      ctsNumber: 'CTS 342/1',
      district: 'Pune',
      taluka: 'Haveli',
      villageWard: 'Ward 12 - Hinjawadi Phase 1',
      ulbName: 'Pune Metropolitan Region Development Authority (PMRDA)',
      ulbCode: '270410',
      latitude: 18.59124,
      longitude: 73.73892,
      elevationMsl: 568.20,
      buildingHeightM: 16.40,
      totalStoreys: 'Ground + 3 Floors (G+3)',
      builtUpAreaSqM: 18450.0,
      packages: DEFAULT_PACKAGES,
      desktopSubmittedToUlb: false,
      surveyTeamAssigned: false,
      teamDispatchedToSurveyor: false,
      checkpoints: DEFAULT_CHECKPOINTS,
      allCheckpointsVerified: false,
      surveyorSubmittedToUlb: false,
      threeDBuildingFile: 'PPCRC_Building_Reconstruction_LOD3.glb',
      transmittedToBhunaksha: false,
      propertyCardGenerated: false
    };
  }

  private static saveData(data: PpcrcPipelineData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('ppcrc_pipeline_updated', { detail: data }));
    } catch {
      // ignore
    }
  }

  static getData(): PpcrcPipelineData {
    return this.loadData();
  }

  // 1. Desktop: Verify individual package
  static verifyPackage(packageId: string): PpcrcPipelineData {
    const data = this.loadData();
    data.packages = data.packages.map(pkg => {
      if (pkg.id === packageId) {
        return {
          ...pkg,
          verified: true,
          verifiedAt: new Date().toLocaleTimeString('en-IN', { hour12: false })
        };
      }
      return pkg;
    });
    this.saveData(data);
    return data;
  }

  // 1. Desktop: Verify all packages
  static verifyAllPackages(): PpcrcPipelineData {
    const data = this.loadData();
    data.packages = data.packages.map(pkg => ({
      ...pkg,
      verified: true,
      verifiedAt: new Date().toLocaleTimeString('en-IN', { hour12: false })
    }));
    this.saveData(data);
    return data;
  }

  // 1. Desktop: Submit to ULB Admin
  static submitDesktopToUlb(): PpcrcPipelineData {
    const data = this.loadData();
    data.desktopSubmittedToUlb = true;
    data.desktopSubmittedAt = new Date().toLocaleString('en-IN');
    this.saveData(data);
    return data;
  }

  // 2. ULB: Autofill Survey Team
  static assignSurveyTeam(): PpcrcPipelineData {
    const data = this.loadData();
    data.surveyTeamAssigned = true;
    data.surveyTeam = {
      mainOfficer: DEFAULT_MAIN_OFFICER,
      members: DEFAULT_MEMBERS,
      assignedAt: new Date().toLocaleString('en-IN'),
      mandateReference: 'PMRDA/SURVEY/3D-CADASTRE/2026/SEC-148A'
    };
    this.saveData(data);
    return data;
  }

  // 2. ULB: Submit & Dispatch to Surveyor
  static dispatchToSurveyor(): PpcrcPipelineData {
    const data = this.loadData();
    if (!data.surveyTeam) {
      data.surveyTeamAssigned = true;
      data.surveyTeam = {
        mainOfficer: DEFAULT_MAIN_OFFICER,
        members: DEFAULT_MEMBERS,
        assignedAt: new Date().toLocaleString('en-IN'),
        mandateReference: 'PMRDA/SURVEY/3D-CADASTRE/2026/SEC-148A'
      };
    }
    data.teamDispatchedToSurveyor = true;
    data.teamDispatchedAt = new Date().toLocaleString('en-IN');
    this.saveData(data);
    return data;
  }

  // 3. Surveyor: Toggle Checkpoint
  static toggleCheckpoint(checkpointId: string, verified: boolean): PpcrcPipelineData {
    const data = this.loadData();
    data.checkpoints = data.checkpoints.map(cp => {
      if (cp.id === checkpointId) {
        return {
          ...cp,
          status: verified ? 'verified' : 'pending',
          verifiedAt: verified ? new Date().toLocaleTimeString('en-IN') : undefined
        };
      }
      return cp;
    });
    data.allCheckpointsVerified = data.checkpoints.every(cp => cp.status === 'verified');
    this.saveData(data);
    return data;
  }

  // 3. Surveyor: Verify All Checkpoints
  static verifyAllCheckpoints(): PpcrcPipelineData {
    const data = this.loadData();
    data.checkpoints = data.checkpoints.map(cp => ({
      ...cp,
      status: 'verified',
      verifiedAt: new Date().toLocaleTimeString('en-IN')
    }));
    data.allCheckpointsVerified = true;
    this.saveData(data);
    return data;
  }

  // 3. Surveyor: Submit to ULB Admin
  static submitSurveyorToUlb(): PpcrcPipelineData {
    const data = this.loadData();
    data.surveyorSubmittedToUlb = true;
    data.surveyorSubmittedAt = new Date().toLocaleString('en-IN');
    this.saveData(data);
    return data;
  }

  // 4. ULB Publication: Transmit to BhuNaksha
  static transmitToBhunaksha(): PpcrcPipelineData {
    const data = this.loadData();
    data.transmittedToBhunaksha = true;
    data.transmittedToBhunakshaAt = new Date().toLocaleString('en-IN');
    data.bhunakshaReferenceNumber = 'BN-MAHA-2026-PMRDA-0410-PPCRC';
    this.saveData(data);
    return data;
  }

  // 4. Download 3D Urban Property Card PDF
  static downloadPropertyCardPdf(): void {
    const data = this.loadData();
    data.propertyCardGenerated = true;
    data.propertyCardGeneratedAt = new Date().toLocaleString('en-IN');
    this.saveData(data);

    // Trigger PDF download from public directory
    const link = document.createElement('a');
    link.href = '/PPCRC_3D_Urban_Property_Card_UPC_22Sep2026.pdf';
    link.download = 'PPCRC_3D_Urban_Property_Card_UPC_22Sep2026.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Reset demo
  static resetPipeline(): PpcrcPipelineData {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = this.loadData();
    this.saveData(fresh);
    return fresh;
  }
}
