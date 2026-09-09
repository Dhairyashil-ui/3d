// NAKSHA V2.0 â€” Persistent In-Browser Spatial Database Engine
import { 
  COHERENT_PARCELS, 
  COHERENT_BUILDINGS, 
  COHERENT_FLOORS, 
  COHERENT_UNITS, 
  COHERENT_GT_POINTS,
  CoherentParcel, 
  CoherentBuilding, 
  CoherentFloor, 
  CoherentUnit, 
  CoherentGtPoint,
  DEMO_DATA_DISCLAIMER
} from '../data/coherentPuneDataset';
import { 
  calculatePolygonArea, 
  calculatePolygonPerimeter, 
  splitPolygonByCuttingLine, 
  mergePolygons, 
  validatePolygon 
} from './spatialMath';

export interface VerificationRecord {
  verificationId: string;
  objectId: string; // parcelId or buildingId
  objectType: 'PARCEL' | 'BUILDING' | 'FLOOR' | 'UNIT';
  decision: 'AGREE' | 'DISAGREE';
  reason?: string;
  notes: string;
  surveyor: string;
  timestamp: string;
}

export interface ClaimEntry {
  id: string;
  ticketId: string;
  parcelId: string;
  plotNo: string;
  claimSource: 'official' | 'public';
  typeOfClaim: string;
  claimStatus: 'Accepted' | 'Pending' | 'Rejected' | 'In Review';
  claimDate: string;
  redressalDate?: string;
  remarks?: string;
  documents: { name: string; type: string; date: string }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  objectType: string;
  objectId: string;
  details: string;
}

const STORAGE_PREFIX = 'naksha_v2_db_';
const KEYS = {
  PARCELS: `${STORAGE_PREFIX}parcels`,
  BUILDINGS: `${STORAGE_PREFIX}buildings`,
  FLOORS: `${STORAGE_PREFIX}floors`,
  UNITS: `${STORAGE_PREFIX}units`,
  GT_POINTS: `${STORAGE_PREFIX}gt_points`,
  VERIFICATIONS: `${STORAGE_PREFIX}verifications`,
  CLAIMS: `${STORAGE_PREFIX}claims`,
  PUBLICATIONS: `${STORAGE_PREFIX}publications`,
  AUDIT_LOGS: `${STORAGE_PREFIX}audit_logs`,
  INITIALIZED: `${STORAGE_PREFIX}initialized_v2`
};

class SpatialDatabase {
  private parcels: CoherentParcel[] = [];
  private buildings: CoherentBuilding[] = [];
  private floors: CoherentFloor[] = [];
  private units: CoherentUnit[] = [];
  private gtPoints: CoherentGtPoint[] = [];
  private verifications: VerificationRecord[] = [];
  private claims: ClaimEntry[] = [];
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      const isInit = localStorage.getItem(KEYS.INITIALIZED);
      if (!isInit) {
        this.resetToSeedData();
      } else {
        this.loadFromStorage();
      }
    } catch (err) {
      console.warn('Storage read failed, initializing in-memory fallback:', err);
      this.resetToSeedData();
    }
  }

  public resetToSeedData() {
    this.parcels = JSON.parse(JSON.stringify(COHERENT_PARCELS));
    this.buildings = JSON.parse(JSON.stringify(COHERENT_BUILDINGS));
    this.floors = JSON.parse(JSON.stringify(COHERENT_FLOORS));
    this.units = JSON.parse(JSON.stringify(COHERENT_UNITS));
    this.gtPoints = JSON.parse(JSON.stringify(COHERENT_GT_POINTS));
    this.verifications = [
      {
        verificationId: 'VER-0001',
        objectId: 'PAR-000123',
        objectType: 'PARCEL',
        decision: 'AGREE',
        notes: 'Parcel boundary coordinates verified with DGPS RTK FIX. Permissible deviation < 0.02m.',
        surveyor: 'Surveyor_Pune (MAP-2 Unit)',
        timestamp: '2026-08-14 11:30:00'
      }
    ];
    this.claims = [
      {
        id: '1',
        ticketId: 'OF_1',
        parcelId: 'PAR-000008',
        plotNo: '8',
        claimSource: 'official',
        typeOfClaim: 'Area Correction, Owner Detail Correction',
        claimStatus: 'Accepted',
        claimDate: '2026-06-11 12:09:20',
        redressalDate: '2026-12-21',
        remarks: 'Eastern parcel boundary overlap rectified.',
        documents: [{ name: 'boundary_rectification_of1.pdf', type: 'Claim Document', date: '2026-06-11' }]
      },
      {
        id: '2',
        ticketId: 'PU_3',
        parcelId: 'PAR-000008',
        plotNo: '8',
        claimSource: 'public',
        typeOfClaim: 'Area Correction',
        claimStatus: 'Pending',
        claimDate: '2026-07-04 11:32:52',
        remarks: 'Public claimant requested re-measurement of rear courtyard.',
        documents: [{ name: 'claim_notice_pu3.pdf', type: 'Claim Document', date: '2026-07-04' }]
      }
    ];
    this.auditLogs = [
      {
        id: 'LOG-001',
        timestamp: new Date().toISOString(),
        user: 'System Seed Initializer',
        action: 'DATABASE_INITIALIZED',
        objectType: 'SYSTEM',
        objectId: 'SU-343671',
        details: 'Initial seed database established for Pune (Hinjawadi) - PMRDA Special Planning Area, Maharashtra.'
      }
    ];

    this.saveToStorage();
    try {
      localStorage.setItem(KEYS.INITIALIZED, 'true');
    } catch {}
  }

  private loadFromStorage() {
    this.parcels = this.getStoredItem(KEYS.PARCELS, COHERENT_PARCELS);
    this.buildings = this.getStoredItem(KEYS.BUILDINGS, COHERENT_BUILDINGS);
    this.floors = this.getStoredItem(KEYS.FLOORS, COHERENT_FLOORS);
    this.units = this.getStoredItem(KEYS.UNITS, COHERENT_UNITS);
    this.gtPoints = this.getStoredItem(KEYS.GT_POINTS, COHERENT_GT_POINTS);
    this.verifications = this.getStoredItem(KEYS.VERIFICATIONS, []);
    this.claims = this.getStoredItem(KEYS.CLAIMS, []);
    this.auditLogs = this.getStoredItem(KEYS.AUDIT_LOGS, []);
  }

  private getStoredItem<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(KEYS.PARCELS, JSON.stringify(this.parcels));
      localStorage.setItem(KEYS.BUILDINGS, JSON.stringify(this.buildings));
      localStorage.setItem(KEYS.FLOORS, JSON.stringify(this.floors));
      localStorage.setItem(KEYS.UNITS, JSON.stringify(this.units));
      localStorage.setItem(KEYS.GT_POINTS, JSON.stringify(this.gtPoints));
      localStorage.setItem(KEYS.VERIFICATIONS, JSON.stringify(this.verifications));
      localStorage.setItem(KEYS.CLAIMS, JSON.stringify(this.claims));
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
    } catch (err) {
      console.warn('Storage write failed:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // PARCEL METHODS (with bbox spatial filtering & search)
  // ---------------------------------------------------------------------------

  public getParcels(query?: string, bbox?: [number, number, number, number]): CoherentParcel[] {
    let result = [...this.parcels];

    // Bounding Box filter [minLng, minLat, maxLng, maxLat]
    if (bbox && bbox.length === 4) {
      const [minX, minY, maxX, maxY] = bbox;
      result = result.filter(p => {
        const ring = p.geometry.coordinates[0];
        return ring.some(pt => pt[0] >= minX && pt[0] <= maxX && pt[1] >= minY && pt[1] <= maxY);
      });
    }

    // Text search query
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(p => 
        p.parcelId.toLowerCase().includes(q) ||
        p.plotNo.toLowerCase().includes(q) ||
        p.khasraNo.toLowerCase().includes(q) ||
        p.ulpin.toLowerCase().includes(q) ||
        p.propertyType.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getParcelById(parcelId: string): CoherentParcel | undefined {
    return this.parcels.find(p => p.parcelId.toLowerCase() === parcelId.toLowerCase() || p.ulpin === parcelId);
  }

  public updateParcel(parcelId: string, updates: Partial<CoherentParcel>): CoherentParcel | undefined {
    const idx = this.parcels.findIndex(p => p.parcelId === parcelId);
    if (idx === -1) return undefined;

    this.parcels[idx] = { ...this.parcels[idx], ...updates };
    this.saveToStorage();
    return this.parcels[idx];
  }

  // ---------------------------------------------------------------------------
  // BUILDING, FLOOR & UNIT METHODS
  // ---------------------------------------------------------------------------

  public getBuildings(parcelId?: string): CoherentBuilding[] {
    if (parcelId) {
      return this.buildings.filter(b => b.parcelId.toLowerCase() === parcelId.toLowerCase());
    }
    return [...this.buildings];
  }

  public getBuildingById(buildingId: string): CoherentBuilding | undefined {
    return this.buildings.find(b => b.buildingId.toLowerCase() === buildingId.toLowerCase());
  }

  public getFloors(): CoherentFloor[] {
    return [...this.floors];
  }

  public getFloorsByBuilding(buildingId: string): CoherentFloor[] {
    return this.floors.filter(f => f.buildingId.toLowerCase() === buildingId.toLowerCase());
  }

  public getUnits(): CoherentUnit[] {
    return [...this.units];
  }

  public getUnitsByFloor(floorId: string): CoherentUnit[] {
    return this.units.filter(u => u.floorId.toLowerCase() === floorId.toLowerCase());
  }

  public getUnitsByBuilding(buildingId: string): CoherentUnit[] {
    return this.units.filter(u => u.buildingId.toLowerCase() === buildingId.toLowerCase());
  }

  public getUnitById(unitId: string): CoherentUnit | undefined {
    return this.units.find(u => u.unitId.toLowerCase() === unitId.toLowerCase());
  }

  // ---------------------------------------------------------------------------
  // GROUND TRUTH (GT) POINTS
  // ---------------------------------------------------------------------------

  public getGtPoints(plotNo?: string): CoherentGtPoint[] {
    if (plotNo) {
      return this.gtPoints.filter(p => p.plotNo === plotNo);
    }
    return [...this.gtPoints];
  }

  public addGtPoint(point: Omit<CoherentGtPoint, 'seqNo'>): CoherentGtPoint {
    const seq = this.gtPoints.length > 0 ? Math.max(...this.gtPoints.map(p => p.seqNo)) + 1 : 1;
    const newPt: CoherentGtPoint = {
      ...point,
      seqNo: seq
    };
    this.gtPoints.push(newPt);
    this.saveToStorage();

    this.logAudit('ADD_GT_POINT', 'GT_POINT', `GT-${seq}`, `Added DGPS control point on Plot ${point.plotNo} at [${point.lat}, ${point.lng}].`);
    return newPt;
  }

  public deleteGtPoint(seqNo: number): boolean {
    const before = this.gtPoints.length;
    this.gtPoints = this.gtPoints.filter(p => p.seqNo !== seqNo);
    if (this.gtPoints.length !== before) {
      this.saveToStorage();
      this.logAudit('DELETE_GT_POINT', 'GT_POINT', `GT-${seqNo}`, `Deleted GT Point #${seqNo}`);
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // VERIFICATIONS (Persistent Surveyor Decisions)
  // ---------------------------------------------------------------------------

  public saveVerification(record: Omit<VerificationRecord, 'verificationId' | 'timestamp'>): VerificationRecord {
    const verificationId = `VER-${String(this.verifications.length + 1).padStart(4, '0')}`;
    const newRecord: VerificationRecord = {
      ...record,
      verificationId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.verifications.push(newRecord);

    // Update parcel status accordingly
    if (record.objectType === 'PARCEL') {
      const p = this.parcels.find(item => item.parcelId === record.objectId);
      if (p) {
        p.verificationStatus = record.decision === 'AGREE' ? 'Verified' : 'Disputed';
      }
    }

    this.saveToStorage();
    this.logAudit(
      'PARCEL_VERIFIED',
      record.objectType,
      record.objectId,
      `Surveyor recorded ${record.decision}: ${record.notes || record.reason || 'Verified'}`
    );

    return newRecord;
  }

  public getVerifications(objectId?: string): VerificationRecord[] {
    if (objectId) {
      return this.verifications.filter(v => v.objectId === objectId);
    }
    return [...this.verifications];
  }

  // ---------------------------------------------------------------------------
  // REAL GEOMETRIC OPERATIONS: SPLIT, MERGE, DRAW PLOT
  // ---------------------------------------------------------------------------

  public splitParcel(
    parcelId: string,
    cuttingLine: [number, number][]
  ): { success: boolean; newParcels?: CoherentParcel[]; error?: string } {
    const target = this.parcels.find(p => p.parcelId === parcelId);
    if (!target) return { success: false, error: 'Target parcel not found.' };

    const splitResult = splitPolygonByCuttingLine(target.geometry.coordinates[0], cuttingLine);
    if (!splitResult.success || !splitResult.polygons || splitResult.polygons.length < 2) {
      return { success: false, error: splitResult.error || 'Splitting operation failed.' };
    }

    const polyA = splitResult.polygons[0];
    const polyB = splitResult.polygons[1];

    const areaA = calculatePolygonArea(polyA);
    const perimA = calculatePolygonPerimeter(polyA);
    const areaB = calculatePolygonArea(polyB);
    const perimB = calculatePolygonPerimeter(polyB);

    // Create 2 child parcels
    const parcelA: CoherentParcel = {
      ...target,
      parcelId: `${target.parcelId}/1`,
      plotNo: `${target.plotNo}/1`,
      khasraNo: `${target.khasraNo}/1`,
      areaSqm: areaA,
      perimeterM: perimA,
      geometry: { type: 'Polygon', coordinates: [polyA] },
      verificationStatus: 'Pending Field Verification',
      threeDStatus: 'Pending Photogrammetry'
    };

    const parcelB: CoherentParcel = {
      ...target,
      parcelId: `${target.parcelId}/2`,
      plotNo: `${target.plotNo}/2`,
      khasraNo: `${target.khasraNo}/2`,
      areaSqm: areaB,
      perimeterM: perimB,
      geometry: { type: 'Polygon', coordinates: [polyB] },
      verificationStatus: 'Pending Field Verification',
      threeDStatus: 'Pending Photogrammetry'
    };

    // Remove old parcel and insert new ones
    this.parcels = this.parcels.filter(p => p.parcelId !== parcelId);
    this.parcels.push(parcelA, parcelB);

    this.saveToStorage();
    this.logAudit('SPLIT_PARCEL', 'PARCEL', parcelId, `Split parcel into ${parcelA.parcelId} (${areaA}mÂ²) and ${parcelB.parcelId} (${areaB}mÂ²).`);

    return { success: true, newParcels: [parcelA, parcelB] };
  }

  public mergeParcels(
    parcelIdA: string,
    parcelIdB: string
  ): { success: boolean; mergedParcel?: CoherentParcel; error?: string } {
    const pA = this.parcels.find(p => p.parcelId === parcelIdA);
    const pB = this.parcels.find(p => p.parcelId === parcelIdB);

    if (!pA || !pB) return { success: false, error: 'One or both parcels could not be found.' };

    const mergeRes = mergePolygons(pA.geometry.coordinates[0], pB.geometry.coordinates[0]);
    if (!mergeRes.success || !mergeRes.mergedCoords) {
      return { success: false, error: mergeRes.error || 'Failed to merge parcel boundaries.' };
    }

    const mergedCoords = mergeRes.mergedCoords;
    const newArea = mergeRes.areaSqm || calculatePolygonArea(mergedCoords);
    const newPerim = calculatePolygonPerimeter(mergedCoords);

    const mergedId = `${pA.parcelId}+${pB.plotNo}`;
    const mergedParcel: CoherentParcel = {
      ...pA,
      parcelId: mergedId,
      plotNo: `${pA.plotNo}+${pB.plotNo}`,
      khasraNo: `${pA.khasraNo}+${pB.khasraNo}`,
      areaSqm: newArea,
      perimeterM: newPerim,
      geometry: { type: 'Polygon', coordinates: [mergedCoords] },
      verificationStatus: 'Pending Field Verification',
      threeDStatus: 'Pending Photogrammetry'
    };

    // Remove old parcels and add merged parcel
    this.parcels = this.parcels.filter(p => p.parcelId !== parcelIdA && p.parcelId !== parcelIdB);
    this.parcels.push(mergedParcel);

    this.saveToStorage();
    this.logAudit('MERGE_PARCEL', 'PARCEL', mergedId, `Merged ${parcelIdA} and ${parcelIdB} into ${mergedId} (${newArea}mÂ²).`);

    return { success: true, mergedParcel };
  }

  public drawNewPlot(
    coords: [number, number][],
    plotNumber: string,
    propertyType: CoherentParcel['propertyType'] = 'Single/Joint Owners Individual Building'
  ): { success: boolean; newParcel?: CoherentParcel; error?: string } {
    const val = validatePolygon(coords);
    if (!val.isValid || !val.areaSqm) {
      return { success: false, error: val.reason || 'Invalid polygon geometry drawn.' };
    }

    const newId = `PAR-${String(this.parcels.length + 1).padStart(6, '0')}`;
    const ring = [...coords];
    if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) {
      ring.push(ring[0]);
    }

    const newParcel: CoherentParcel = {
      parcelId: newId,
      khasraNo: `${200 + this.parcels.length}/1`,
      plotNo: plotNumber,
      ulpin: `2304100100${String(30000 + this.parcels.length)}`,
      ulpinStatus: 'Available',
      surveyUnitId: 'SU-343671',
      wardId: 'WARD-43',
      ulbId: 'ULB-250946',
      propertyType,
      geometry: { type: 'Polygon', coordinates: [ring] },
      areaSqm: val.areaSqm,
      perimeterM: val.perimeterM || calculatePolygonPerimeter(ring),
      verificationStatus: 'Pending Field Verification',
      rorStatus: 'Draft',
      threeDStatus: 'Ready for Verification',
      publicationStatus: 'Pending',
      dataSource: DEMO_DATA_DISCLAIMER
    };

    this.parcels.push(newParcel);
    this.saveToStorage();
    this.logAudit('DRAW_PLOT', 'PARCEL', newId, `Drawn new plot ${plotNumber} (${val.areaSqm}mÂ²).`);

    return { success: true, newParcel };
  }

  // ---------------------------------------------------------------------------
  // CLAIMS & PUBLICATIONS
  // ---------------------------------------------------------------------------

  public getClaims(): ClaimEntry[] {
    return [...this.claims];
  }

  public saveClaim(claim: Omit<ClaimEntry, 'id'>): ClaimEntry {
    const newClaim: ClaimEntry = {
      ...claim,
      id: String(this.claims.length + 1)
    };
    this.claims.push(newClaim);
    this.saveToStorage();
    this.logAudit('FILE_CLAIM', 'CLAIM', newClaim.ticketId, `Grievance claim filed on Plot ${claim.plotNo}.`);
    return newClaim;
  }

  public updateClaimStatus(claimId: string, status: ClaimEntry['claimStatus'], remarks?: string) {
    const c = this.claims.find(item => item.id === claimId || item.ticketId === claimId);
    if (c) {
      c.claimStatus = status;
      if (remarks) c.remarks = remarks;
      c.redressalDate = new Date().toISOString().slice(0, 10);
      this.saveToStorage();
      this.logAudit('RESOLVE_CLAIM', 'CLAIM', c.ticketId, `Claim ${c.ticketId} marked as ${status}.`);
    }
  }

  // ---------------------------------------------------------------------------
  // DYNAMIC COMPUTED DASHBOARD STATISTICS (No hardcoded values!)
  // ---------------------------------------------------------------------------

  public getStats() {
    const totalParcels = this.parcels.length;
    const verifiedParcels = this.parcels.filter(p => p.verificationStatus === 'Verified').length;
    const pendingParcels = this.parcels.filter(p => p.verificationStatus === 'Pending Field Verification').length;
    const disputedParcels = this.parcels.filter(p => p.verificationStatus === 'Disputed').length;

    const totalBuildings = this.buildings.length;
    const multiStoreyBuildings = this.buildings.filter(b => b.totalFloors > 2).length;
    const totalUnits = this.units.length;

    const rorCompleted = this.parcels.filter(p => p.rorStatus === 'Verified').length;
    const rorPending = this.parcels.filter(p => p.rorStatus === 'Pending' || p.rorStatus === 'Draft').length;

    const openClaims = this.claims.filter(c => c.claimStatus === 'Pending').length;
    const resolvedClaims = this.claims.filter(c => c.claimStatus === 'Accepted' || c.claimStatus === 'Rejected').length;

    const gtPointsCount = this.gtPoints.length;
    const splitCount = this.auditLogs.filter(l => l.action === 'SPLIT_PARCEL').length;
    const mergedCount = this.auditLogs.filter(l => l.action === 'MERGE_PARCEL').length;
    const createdCount = this.auditLogs.filter(l => l.action === 'DRAW_NEW_PLOT').length;

    return {
      totalParcels,
      verifiedParcels,
      pendingParcels,
      disputedParcels,
      totalBuildings,
      multiStoreyBuildings,
      totalUnits,
      rorCompleted,
      rorPending,
      openClaims,
      resolvedClaims,
      gtPointsCount,
      splitCount,
      mergedCount,
      createdCount,
      // Verification percentages
      verificationPct: totalParcels > 0 ? Number(((verifiedParcels / totalParcels) * 100).toFixed(1)) : 0,
      rorPct: totalParcels > 0 ? Number(((rorCompleted / totalParcels) * 100).toFixed(1)) : 0
    };
  }

  // ---------------------------------------------------------------------------
  // AUDIT LOGS
  // ---------------------------------------------------------------------------

  public logAudit(action: string, objectType: string, objectId: string, details: string, user: string = 'Surveyor_Pune') {
    const entry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user,
      action,
      objectType,
      objectId,
      details
    };
    this.auditLogs.unshift(entry);
    this.saveToStorage();
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }
}

export const spatialDb = new SpatialDatabase();

