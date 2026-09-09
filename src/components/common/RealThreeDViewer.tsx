// NAKSHA V2.0 — Photorealistic 3D Geospatial Engine (Powered by CesiumJS + Google Photorealistic 3D Tiles)
// Replaces the legacy Three.js extruded box simulation with authentic photorealistic 3D world tiles
import React from 'react';
import { CesiumPhotorealisticViewer } from '../cesium/CesiumPhotorealisticViewer';

export type VisMode = 
  | 'real_world' 
  | 'hybrid' 
  | 'digital_twin' 
  | 'point_cloud' 
  | 'structure' 
  | 'floors' 
  | 'x_ray';

interface RealThreeDViewerProps {
  height?: string;
  enableControls?: boolean;
}

export const RealThreeDViewer: React.FC<RealThreeDViewerProps> = ({
  height = '680px',
  enableControls = true
}) => {
  return (
    <CesiumPhotorealisticViewer 
      height={height} 
      enableControls={enableControls} 
    />
  );
};
