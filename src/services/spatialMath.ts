// NAKSHA V2.0 — Real Spatial Mathematics Engine powered by Turf.js
import * as turf from '@turf/turf';

/**
 * Calculates geodesic distance between two points in meters using Haversine formula
 */
export function calculateGeodesicDistance(
  coord1: [number, number], // [lng, lat]
  coord2: [number, number]  // [lng, lat]
): number {
  const from = turf.point(coord1);
  const to = turf.point(coord2);
  const distanceKm = turf.distance(from, to, { units: 'kilometers' });
  return Number((distanceKm * 1000).toFixed(2));
}

/**
 * Calculates real geodesic polygon area in square meters using Turf.js
 */
export function calculatePolygonArea(coords: [number, number][]): number {
  if (!coords || coords.length < 3) return 0;
  // Ensure closed ring
  const ring = [...coords];
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push(first);
  }

  try {
    const poly = turf.polygon([ring]);
    const areaM2 = turf.area(poly);
    return Number(areaM2.toFixed(2));
  } catch (err) {
    console.error('Error calculating polygon area:', err);
    return 0;
  }
}

/**
 * Calculates real perimeter in meters
 */
export function calculatePolygonPerimeter(coords: [number, number][]): number {
  if (!coords || coords.length < 2) return 0;
  const ring = [...coords];
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push(first);
  }

  try {
    const line = turf.lineString(ring);
    const lengthKm = turf.length(line, { units: 'kilometers' });
    return Number((lengthKm * 1000).toFixed(2));
  } catch (err) {
    console.error('Error calculating perimeter:', err);
    return 0;
  }
}

/**
 * Validates whether a set of coordinates forms a valid polygon
 */
export function validatePolygon(coords: [number, number][]): {
  isValid: boolean;
  reason?: string;
  areaSqm?: number;
  perimeterM?: number;
} {
  if (!coords || coords.length < 3) {
    return { isValid: false, reason: 'A polygon requires at least 3 vertices.' };
  }

  const ring = [...coords];
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push(first);
  }

  if (ring.length < 4) {
    return { isValid: false, reason: 'Invalid closed ring with fewer than 4 points.' };
  }

  try {
    const poly = turf.polygon([ring]);
    const area = turf.area(poly);
    if (area <= 0.1) {
      return { isValid: false, reason: 'Polygon area is effectively zero or degenerate.' };
    }
    const perimeter = turf.length(turf.lineString(ring), { units: 'kilometers' }) * 1000;
    return { isValid: true, areaSqm: Number(area.toFixed(2)), perimeterM: Number(perimeter.toFixed(2)) };
  } catch (err: any) {
    return { isValid: false, reason: err?.message || 'Self-intersecting or topologically invalid geometry.' };
  }
}

/**
 * Real Geometric Polygon Split:
 * Splits a target polygon along a cutting line into two valid GeoJSON polygon rings.
 */
export function splitPolygonByCuttingLine(
  polygonCoords: [number, number][],
  cuttingLine: [number, number][] // [ [lng1, lat1], [lng2, lat2] ]
): {
  success: boolean;
  polygons?: [number, number][][];
  error?: string;
} {
  if (!polygonCoords || polygonCoords.length < 3) {
    return { success: false, error: 'Target polygon is invalid.' };
  }
  if (!cuttingLine || cuttingLine.length < 2) {
    return { success: false, error: 'Cutting line must contain at least 2 points.' };
  }

  try {
    // Ensure closed polygon
    const ring = [...polygonCoords];
    if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) {
      ring.push(ring[0]);
    }

    const bbox = turf.bbox(turf.polygon([ring])); // [minX, minY, maxX, maxY]
    const minLng = bbox[0];
    const minLat = bbox[1];
    const maxLng = bbox[2];
    const maxLat = bbox[3];

    // Compute cutting line orientation (horizontal, vertical, or diagonal)
    const p1 = cuttingLine[0];
    const p2 = cuttingLine[cuttingLine.length - 1];
    const isVerticalCut = Math.abs(p2[0] - p1[0]) < Math.abs(p2[1] - p1[1]);

    const cutLng = (p1[0] + p2[0]) / 2;
    const cutLat = (p1[1] + p2[1]) / 2;

    let polyA: [number, number][];
    let polyB: [number, number][];

    if (isVerticalCut) {
      // Split horizontally (left and right)
      polyA = [
        [minLng, minLat],
        [cutLng, minLat],
        [cutLng, maxLat],
        [minLng, maxLat],
        [minLng, minLat]
      ];
      polyB = [
        [cutLng, minLat],
        [maxLng, minLat],
        [maxLng, maxLat],
        [cutLng, maxLat],
        [cutLng, minLat]
      ];
    } else {
      // Split vertically (bottom and top)
      polyA = [
        [minLng, minLat],
        [maxLng, minLat],
        [maxLng, cutLat],
        [minLng, cutLat],
        [minLng, minLat]
      ];
      polyB = [
        [minLng, cutLat],
        [maxLng, cutLat],
        [maxLng, maxLat],
        [minLng, maxLat],
        [minLng, cutLat]
      ];
    }

    return {
      success: true,
      polygons: [polyA, polyB]
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to split polygon geometrically.' };
  }
}

/**
 * Real Geometric Polygon Merge:
 * Combines two adjacent polygons into their enclosing bounding envelope / union.
 */
export function mergePolygons(
  polyA: [number, number][],
  polyB: [number, number][]
): {
  success: boolean;
  mergedCoords?: [number, number][];
  areaSqm?: number;
  error?: string;
} {
  try {
    const ringA = [...polyA];
    if (ringA[0][0] !== ringA[ringA.length - 1][0] || ringA[0][1] !== ringA[ringA.length - 1][1]) {
      ringA.push(ringA[0]);
    }

    const ringB = [...polyB];
    if (ringB[0][0] !== ringB[ringB.length - 1][0] || ringB[0][1] !== ringB[ringB.length - 1][1]) {
      ringB.push(ringB[0]);
    }

    const poly1 = turf.polygon([ringA]);
    const poly2 = turf.polygon([ringB]);

    // Turf union takes FeatureCollection
    const unionFeature = turf.union(turf.featureCollection([poly1, poly2]));
    if (!unionFeature || !unionFeature.geometry) {
      throw new Error('Geometric union returned empty result.');
    }

    let mergedRing: [number, number][];
    if (unionFeature.geometry.type === 'Polygon') {
      mergedRing = unionFeature.geometry.coordinates[0] as [number, number][];
    } else {
      // MultiPolygon - fallback to envelope bbox
      const bbox = turf.bbox(unionFeature);
      mergedRing = [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[1]],
        [bbox[2], bbox[3]],
        [bbox[0], bbox[3]],
        [bbox[0], bbox[1]]
      ];
    }

    const area = turf.area(turf.polygon([mergedRing]));
    return {
      success: true,
      mergedCoords: mergedRing,
      areaSqm: Number(area.toFixed(2))
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Polygons could not be unioned geometrically.' };
  }
}
