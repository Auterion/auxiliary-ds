/**
 * A dot-matrix world map for the Live Fleet Map module.
 *
 * There is no map asset (and no map library) in this repo, and pulling either in
 * for one demo module would be a poor trade. Instead the continents are carried
 * as coarse lon/lat outlines and rasterised into a dot grid at render time — a
 * schematic, systematic map that suits the console's neutral voice, costs a few
 * hundred bytes, and needs no network.
 *
 * The outlines are deliberately low-fidelity: at ~4.5° per dot the grid quantises
 * away anything finer, so they only need to be right at continental scale. This
 * is decoration + site placement, never navigation.
 */

/** Closed lon/lat rings, flat [lon, lat, lon, lat, …]. Overlaps are fine (union). */
const LAND: number[][] = [
  // North America
  [
    -165, 64, -155, 70, -130, 70, -110, 69, -95, 70, -85, 70, -75, 68, -65, 60, -55, 52, -60, 47,
    -67, 45, -70, 42, -75, 37, -81, 31, -80, 25, -84, 23, -90, 21, -97, 20, -105, 22, -110, 26,
    -114, 31, -120, 35, -124, 42, -124, 48, -130, 54, -140, 60, -150, 61, -160, 58, -165, 64,
  ],
  // Greenland
  [-45, 60, -30, 66, -22, 70, -20, 76, -30, 82, -45, 83, -58, 82, -55, 76, -50, 68, -45, 60],
  // South America
  [
    -78, 9, -72, 11, -62, 11, -52, 5, -50, 0, -44, -2, -35, -6, -35, -10, -39, -16, -45, -23, -52,
    -30, -57, -34, -62, -39, -65, -45, -69, -51, -74, -52, -73, -45, -73, -38, -72, -30, -70, -22,
    -70, -15, -76, -8, -80, -4, -80, 2, -78, 9,
  ],
  // Europe
  [
    -10, 36, -8, 43, -2, 48, 2, 51, 7, 53, 10, 55, 12, 58, 18, 60, 22, 66, 26, 70, 32, 70, 36, 64,
    38, 56, 40, 48, 36, 44, 28, 40, 20, 40, 14, 38, 8, 40, 2, 42, -4, 38, -10, 36,
  ],
  // British Isles
  [-10, 51, -6, 55, -3, 58, -1, 55, -3, 51, -6, 50, -10, 51],
  // Africa
  [
    -17, 14, -16, 20, -10, 26, -2, 31, 10, 33, 20, 32, 28, 31, 33, 31, 36, 22, 39, 15, 43, 12, 51,
    12, 48, 5, 42, -1, 40, -8, 40, -16, 35, -22, 32, -27, 26, -34, 20, -35, 16, -29, 12, -18, 9, -5,
    9, 4, 3, 6, -5, 5, -12, 8, -17, 14,
  ],
  // Madagascar
  [43, -12, 50, -15, 50, -25, 45, -25, 43, -18, 43, -12],
  // Asia (Urals east, incl. the Indian subcontinent and the Siberian north)
  [
    40, 48, 48, 45, 52, 42, 58, 42, 60, 45, 68, 40, 72, 37, 68, 26, 70, 22, 73, 18, 77, 8, 80, 10,
    85, 20, 89, 22, 92, 21, 95, 16, 98, 10, 100, 6, 104, 2, 105, 10, 108, 15, 110, 20, 117, 23, 121,
    30, 122, 36, 126, 40, 130, 43, 135, 45, 142, 47, 140, 52, 145, 57, 155, 60, 162, 62, 170, 66,
    180, 66, 180, 72, 160, 72, 140, 74, 120, 76, 100, 78, 80, 76, 68, 72, 60, 70, 50, 68, 44, 66,
    40, 64, 32, 62, 30, 55, 35, 50, 40, 48,
  ],
  // Arabian peninsula
  [35, 29, 40, 31, 48, 30, 56, 26, 59, 22, 55, 17, 50, 13, 45, 13, 43, 17, 39, 21, 35, 25, 35, 29],
  // Japan
  [130, 31, 133, 34, 136, 36, 140, 40, 142, 44, 145, 44, 141, 38, 138, 35, 132, 32, 130, 31],
  // Indonesia + New Guinea
  [95, 5, 105, 0, 115, -3, 125, -3, 135, -3, 140, -6, 130, -8, 120, -9, 110, -7, 100, -2, 95, 5],
  // Philippines
  [120, 6, 124, 12, 122, 18, 119, 14, 118, 8, 120, 6],
  // Australia
  [
    113, -22, 114, -27, 118, -34, 126, -32, 132, -31, 138, -35, 141, -38, 147, -38, 150, -35, 153,
    -28, 146, -19, 142, -11, 136, -12, 130, -11, 125, -14, 120, -19, 113, -22,
  ],
  // New Zealand
  [166, -46, 170, -44, 174, -41, 176, -38, 173, -35, 172, -40, 168, -44, 166, -46],
];

/** Ray-casting point-in-ring test. */
function inRing(ring: number[], lon: number, lat: number): boolean {
  let inside = false;
  const n = ring.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = ring[i * 2]!;
    const yi = ring[i * 2 + 1]!;
    const xj = ring[j * 2]!;
    const yj = ring[j * 2 + 1]!;
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function isLand(lon: number, lat: number): boolean {
  return LAND.some((ring) => inRing(ring, lon, lat));
}

/** Viewport bounds — the poles are cropped so the map fills its card. */
export const BOUNDS = { west: -170, east: 180, north: 80, south: -56 };

/** Project lon/lat into a 0..1 unit box for the cropped equirectangular frame. */
export function project(lon: number, lat: number): { x: number; y: number } {
  return {
    x: (lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west),
    y: (BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south),
  };
}

export interface Dot {
  x: number;
  y: number;
}

/**
 * Rasterise the landmasses into a dot grid. Returns unit-box coordinates so the
 * caller can scale to any viewBox.
 */
export function landDots(cols = 78, rows = 34): Dot[] {
  const dots: Dot[] = [];
  for (let r = 0; r < rows; r++) {
    const lat = BOUNDS.north - ((r + 0.5) / rows) * (BOUNDS.north - BOUNDS.south);
    for (let c = 0; c < cols; c++) {
      const lon = BOUNDS.west + ((c + 0.5) / cols) * (BOUNDS.east - BOUNDS.west);
      if (isLand(lon, lat)) dots.push({ x: (c + 0.5) / cols, y: (r + 0.5) / rows });
    }
  }
  return dots;
}
