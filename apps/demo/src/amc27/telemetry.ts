/**
 * AMC27 · the mission model.
 *
 * One source for every number the surface shows. The incumbent screenshots show
 * the same fact in two places with two treatments (the vehicle selector in the
 * command bar AND the two vehicle cards at the bottom of the video); modelling
 * the fleet once, here, is what makes "one fact, one place" enforceable in the
 * views rather than a thing you have to remember.
 */

export type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

export interface Vehicle {
  id: string;
  callsign: string;
  type: string;
  mode: string;
  armed: boolean;
  battery: number;
  /** Link margin, dB. */
  link: number;
  /** Health as a severity level — the ladder, never a decorative hue. */
  health: Level;
  note: string;
}

export const fleet: Vehicle[] = [
  {
    id: 'v1',
    callsign: 'HAWK 01',
    type: 'AUX-4 QUAD',
    mode: 'MISSION',
    armed: true,
    battery: 64,
    link: 22,
    health: 'nominal',
    note: 'On plan · WP 7/12',
  },
  {
    id: 'v2',
    callsign: 'HAWK 02',
    type: 'AUX-4 QUAD',
    mode: 'MISSION',
    armed: true,
    battery: 38,
    link: 9,
    health: 'caution',
    note: 'Link margin low',
  },
  {
    id: 'v3',
    callsign: 'HAWK 03',
    type: 'AUX-2 VTOL',
    mode: 'STANDBY',
    armed: false,
    battery: 97,
    link: 27,
    health: 'nominal',
    note: 'Ready · pad B',
  },
];

/** Live telemetry for the selected vehicle. */
export const t = {
  // attitude & track
  roll: -6,
  pitch: 3,
  heading: 89,
  course: 92,
  // speeds
  as: 27.5,
  gs: 28.3,
  vs: 0.4,
  wind: 4.1,
  windDir: 214,
  // position
  agl: 118,
  msl: 151,
  dist: 954,
  home: 954,
  thr: 64,
  // power & link
  volts: 15.3,
  amps: 1.0,
  watts: 15.3,
  rssi: -71,
  snr: 14,
  // gnss
  hacc: 0.9,
  vacc: 1.8,
  sats: 10,
  fix: 'RTK FIX',
  // sensor
  fov: 28,
  zoom: 4.0,
  fps: 20.1,
  sensor: 'EO',
  elapsed: '01:39',
  eta: '06:12',
  clock: '14:22:07Z',
};

export interface AlertRow {
  level: Level;
  code: string;
  text: string;
  at: string;
  latched?: boolean;
}

/**
 * The incumbent renders "DEGRADED" as magenta bitmap text burned into the
 * video and offers nowhere to acknowledge it. Alerts are a list with a
 * severity, a time and a state, so they are modelled as one.
 */
export const alerts: AlertRow[] = [
  { level: 'caution', code: 'LNK-02', text: 'Datalink margin 9 dB — degraded', at: '14:21:48', latched: true },
  { level: 'advisory', code: 'PLD-11', text: 'Gimbal recentred after track loss', at: '14:20:12' },
  { level: 'advisory', code: 'NAV-04', text: 'RTK fix acquired · 10 SV', at: '14:16:30' },
  { level: 'nominal', code: 'MSN-01', text: 'Mission uploaded · 12 waypoints', at: '14:09:02' },
];

/** Mission actions on the left rail. Destructive ones declare it. */
export interface Command {
  key: string;
  label: string;
  hint: string;
  destructive?: boolean;
  level?: Level;
}

export const commands: Command[] = [
  { key: 'rtl', label: 'Return', hint: 'RTL · 954 m' },
  { key: 'hold', label: 'Hold', hint: 'Loiter at position' },
  { key: 'approach', label: 'Approach', hint: '30° glide' },
  { key: 'speed', label: 'Set speed', hint: '28.3 m/s' },
  { key: 'reset', label: 'Reset pose', hint: 'Position & heading' },
  { key: 'abort', label: 'Abort mission', hint: 'Irreversible', destructive: true, level: 'warning' },
];

/** Waypoints for the plan view and the map. Space is 1000 × 620. */
export interface Waypoint {
  n: number;
  kind: 'TAKEOFF' | 'WAYPOINT' | 'SURVEY' | 'LOITER' | 'LAND';
  x: number;
  y: number;
  alt: number;
  speed: number;
  action: string;
}

export const plan: Waypoint[] = [
  { n: 1, kind: 'TAKEOFF', x: 132, y: 512, alt: 40, speed: 6, action: 'Climb to 40 m' },
  { n: 2, kind: 'WAYPOINT', x: 248, y: 430, alt: 110, speed: 22, action: '—' },
  { n: 3, kind: 'WAYPOINT', x: 372, y: 452, alt: 118, speed: 28, action: '—' },
  { n: 4, kind: 'SURVEY', x: 498, y: 356, alt: 118, speed: 28, action: 'Start capture · 80 % overlap' },
  { n: 5, kind: 'SURVEY', x: 624, y: 388, alt: 118, speed: 28, action: '—' },
  { n: 6, kind: 'SURVEY', x: 742, y: 288, alt: 118, speed: 28, action: 'Stop capture' },
  { n: 7, kind: 'LOITER', x: 848, y: 246, alt: 120, speed: 12, action: 'Loiter 2 min · ISR' },
  { n: 8, kind: 'WAYPOINT', x: 700, y: 180, alt: 100, speed: 24, action: '—' },
  // Pad A sits beside the launch point, not on it — coincident marks hide
  // each other, and a plan you cannot read is not a plan.
  { n: 9, kind: 'LAND', x: 168, y: 546, alt: 0, speed: 4, action: 'Precision land · pad A' },
];

/** Where the ownship sits along the plan right now. */
export const ownship = { x: 848, y: 246, hdg: 89 };

/** Other tracks on the tactical picture. */
export const tracks = [
  { id: 'HAWK 02', x: 470, y: 300, hdg: 210, rng: 870, own: true },
  { id: 'GND-A', x: 300, y: 250, hdg: 284, rng: 1310, own: false },
  { id: 'TGT-01', x: 640, y: 470, hdg: 118, rng: 954, own: false, hostile: true },
];
