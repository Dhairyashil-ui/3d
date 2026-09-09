// NAKSHA V2.0 — Shared 2D/3D Selection & Synchronization Store
import { useState, useEffect } from 'react';

export interface SelectionState {
  selectedParcelId: string | null;
  selectedBuildingId: string | null;
  selectedFloorId: string | null;
  selectedUnitId: string | null;
  hoveredParcelId: string | null;
  viewMode: '2D' | '3D' | 'SPLIT';
  flyToTarget: { lat: number; lng: number; zoom?: number } | null;
  /** When set, RealGisMap will animate a red polygon outline around this building's footprint */
  animatedBuildingId: string | null;
}

const initialState: SelectionState = {
  selectedParcelId: 'PAR-000123',
  selectedBuildingId: 'BLD-000781',
  selectedFloorId: 'FLR-000781-03',
  selectedUnitId: 'UNT-000302',
  hoveredParcelId: null,
  viewMode: '2D',
  flyToTarget: { lat: 18.5847, lng: 73.7376, zoom: 18 },
  animatedBuildingId: null
};

class SelectionStore {
  private state: SelectionState = { ...initialState };
  private listeners: Set<() => void> = new Set();

  public getState(): SelectionState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public selectParcel(parcelId: string | null, flyToCoords?: { lat: number; lng: number }) {
    this.state = {
      ...this.state,
      selectedParcelId: parcelId,
      // If parcel is PAR-000123, link to BLD-000781
      selectedBuildingId: parcelId === 'PAR-000123' ? 'BLD-000781' : null,
      flyToTarget: flyToCoords ? { ...flyToCoords, zoom: 18 } : this.state.flyToTarget
    };
    this.notify();
  }

  public selectBuilding(buildingId: string | null, parcelId?: string | null) {
    this.state = {
      ...this.state,
      selectedBuildingId: buildingId,
      selectedParcelId: parcelId || (buildingId === 'BLD-000781' ? 'PAR-000123' : this.state.selectedParcelId)
    };
    this.notify();
  }

  public selectFloor(floorId: string | null) {
    this.state = {
      ...this.state,
      selectedFloorId: floorId
    };
    this.notify();
  }

  public selectUnit(unitId: string | null, floorId?: string | null) {
    this.state = {
      ...this.state,
      selectedUnitId: unitId,
      selectedFloorId: floorId || this.state.selectedFloorId
    };
    this.notify();
  }

  public setHoveredParcel(parcelId: string | null) {
    if (this.state.hoveredParcelId !== parcelId) {
      this.state = {
        ...this.state,
        hoveredParcelId: parcelId
      };
      this.notify();
    }
  }

  public setViewMode(mode: '2D' | '3D' | 'SPLIT') {
    this.state = {
      ...this.state,
      viewMode: mode
    };
    this.notify();
  }

  public flyTo(lat: number, lng: number, zoom: number = 18) {
    this.state = {
      ...this.state,
      flyToTarget: { lat, lng, zoom }
    };
    this.notify();
  }

  /**
   * Fly the map to a building's location AND trigger the animated red polygon drawing.
   * Designed to be called from BuildingSearchWidget after ULPIN / Building ID lookup.
   */
  public selectBuildingAndFly(
    buildingId: string,
    parcelId: string | null,
    lat: number,
    lng: number,
    zoom: number = 19
  ) {
    this.state = {
      ...this.state,
      selectedBuildingId: buildingId,
      selectedParcelId: parcelId,
      animatedBuildingId: buildingId,
      flyToTarget: { lat, lng, zoom }
    };
    this.notify();
  }

  /** Clear the animated building highlight */
  public clearAnimatedBuilding() {
    if (this.state.animatedBuildingId !== null) {
      this.state = { ...this.state, animatedBuildingId: null };
      this.notify();
    }
  }
}

export const selectionStore = new SelectionStore();

/**
 * Custom React Hook for connecting any component to selectionStore
 */
export function useSelectionStore(): [SelectionState, typeof selectionStore] {
  const [state, setState] = useState<SelectionState>(selectionStore.getState());

  useEffect(() => {
    return selectionStore.subscribe(() => {
      setState(selectionStore.getState());
    });
  }, []);

  return [state, selectionStore];
}
