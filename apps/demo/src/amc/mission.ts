/** Shared live-mission telemetry for the Mission Control views. */
export const m = {
  mission: 'Coastline Survey',
  vehicle: 'Skyhook-01',
  flightMode: 'POSITION',
  armed: false,
  wp: 4,
  wpTotal: 12,
  alt: 124,
  msl: 434,
  speed: 11.4,
  gs: 11.2,
  vspeed: 1.2,
  dist: 1240,
  heading: 123,
  battery: 78,
  voltage: 22.2,
  power: 96.1,
  current: 4.3,
  sats: 21,
  hacc: 0.8,
  vacc: 1.2,
  rssi: -67,
  snr: 18,
  eta: '4:12',
  progress: 33,
  lat: 47.3769,
  lon: 8.5417,
  roll: -7,
  pitch: 4,
  // camera
  fps: 30.1,
  zoom: 1.0,
  fov: 49,
  timer: '06:14',
};

/** Flight path waypoints in the 1160×760 map space (Map view). */
export const path: [number, number][] = [
  [200, 560],
  [330, 486],
  [470, 510],
  [600, 412],
  [740, 446],
  [880, 338],
  [980, 296],
];
export const home = path[0]!;
export const vehiclePos = { x: 600, y: 412 };
