// NAKSHA V2.0 â€” Unified API Client Layer (with Offline-First Spatial Persistence)
import { spatialDb, VerificationRecord, ClaimEntry, AuditLogEntry } from './spatialDatabase';
import { CoherentParcel, CoherentBuilding, CoherentFloor, CoherentUnit, CoherentGtPoint } from '../data/coherentPuneDataset';

export const apiClient = {
  // Parcels
  async getParcels(query?: string, bbox?: [number, number, number, number]): Promise<CoherentParcel[]> {
    return spatialDb.getParcels(query, bbox);
  },

  async getParcelById(parcelId: string): Promise<CoherentParcel | undefined> {
    return spatialDb.getParcelById(parcelId);
  },

  async updateParcel(parcelId: string, updates: Partial<CoherentParcel>): Promise<CoherentParcel | undefined> {
    return spatialDb.updateParcel(parcelId, updates);
  },

  // Buildings, Floors & Units
  async getBuildings(parcelId?: string): Promise<CoherentBuilding[]> {
    return spatialDb.getBuildings(parcelId);
  },

  async getBuildingById(buildingId: string): Promise<CoherentBuilding | undefined> {
    return spatialDb.getBuildingById(buildingId);
  },

  async getFloors(): Promise<CoherentFloor[]> {
    return spatialDb.getFloors();
  },

  async getFloorsByBuilding(buildingId: string): Promise<CoherentFloor[]> {
    return spatialDb.getFloorsByBuilding(buildingId);
  },

  async getUnits(): Promise<CoherentUnit[]> {
    return spatialDb.getUnits();
  },

  async getUnitsByFloor(floorId: string): Promise<CoherentUnit[]> {
    return spatialDb.getUnitsByFloor(floorId);
  },

  async getUnitsByBuilding(buildingId: string): Promise<CoherentUnit[]> {
    return spatialDb.getUnitsByBuilding(buildingId);
  },

  async getUnitById(unitId: string): Promise<CoherentUnit | undefined> {
    return spatialDb.getUnitById(unitId);
  },

  // GT Points
  async getGtPoints(plotNo?: string): Promise<CoherentGtPoint[]> {
    return spatialDb.getGtPoints(plotNo);
  },

  async addGtPoint(point: Omit<CoherentGtPoint, 'seqNo'>): Promise<CoherentGtPoint> {
    return spatialDb.addGtPoint(point);
  },

  async deleteGtPoint(seqNo: number): Promise<boolean> {
    return spatialDb.deleteGtPoint(seqNo);
  },

  // Verification
  async saveVerification(record: Omit<VerificationRecord, 'verificationId' | 'timestamp'>): Promise<VerificationRecord> {
    return spatialDb.saveVerification(record);
  },

  async getVerifications(objectId?: string): Promise<VerificationRecord[]> {
    return spatialDb.getVerifications(objectId);
  },

  // Geometric Operations
  async splitParcel(parcelId: string, cuttingLine: [number, number][]) {
    return spatialDb.splitParcel(parcelId, cuttingLine);
  },

  async mergeParcels(parcelIdA: string, parcelIdB: string) {
    return spatialDb.mergeParcels(parcelIdA, parcelIdB);
  },

  async drawNewPlot(coords: [number, number][], plotNumber: string, propertyType?: CoherentParcel['propertyType']) {
    return spatialDb.drawNewPlot(coords, plotNumber, propertyType);
  },

  // Claims
  async getClaims(): Promise<ClaimEntry[]> {
    return spatialDb.getClaims();
  },

  async saveClaim(claim: Omit<ClaimEntry, 'id'>): Promise<ClaimEntry> {
    return spatialDb.saveClaim(claim);
  },

  async updateClaimStatus(claimId: string, status: ClaimEntry['claimStatus'], remarks?: string) {
    return spatialDb.updateClaimStatus(claimId, status, remarks);
  },

  // Dynamic Dashboard Stats
  async getDashboardStats() {
    return spatialDb.getStats();
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return spatialDb.getAuditLogs();
  },

  // Database Reset
  async resetDatabase() {
    spatialDb.resetToSeedData();
  }
};

