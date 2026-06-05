/**
 * Auterion Suite demo data — fleet of autonomous vehicles.
 *
 * All values are static / deterministically seeded (a tiny mulberry32 PRNG) so
 * the showcase renders identically on every load — no Math.random, no flicker.
 */

import type { IconName } from '@auxiliary/icons';

type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

/** Deterministic PRNG so telemetry series are stable across reloads. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build a series of `n` points wandering around `base` (± `amp`), clamped. */
function series(seed: number, n: number, base: number, amp: number, min = 0, max = 100): number[] {
  const rand = mulberry32(seed);
  let v = base;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    v += (rand() - 0.5) * amp;
    v = Math.max(min, Math.min(max, v));
    out.push(Math.round(v * 10) / 10);
  }
  return out;
}

export interface Site {
  name: string;
  code: string;
  flag: string;
}

export interface Vehicle {
  id: string;
  callsign: string;
  model: string;
  type: 'VTOL' | 'Quad' | 'Fixed-wing';
  status: { level: Level; label: string };
  battery: number;
  rssi: number | null;
  cpu: number;
  site: Site;
  operator: { name: string; initials: string };
  team: string;
  serial: string;
  firmware: string;
  commissioned: string;
  lastSeen: string;
  zones: number;
  live: boolean;
  metrics: { battery: number[]; rssi: number[]; cpu: number[]; requests: number[] };
}

const SITES = {
  munich: { name: 'Munich', code: 'EU-CENTRAL-1', flag: '🇩🇪' },
  montreal: { name: 'Montreal', code: 'NA-EAST-2', flag: '🇨🇦' },
  zurich: { name: 'Zürich', code: 'EU-CENTRAL-2', flag: '🇨🇭' },
  austin: { name: 'Austin', code: 'NA-CENTRAL-1', flag: '🇺🇸' },
  dublin: { name: 'Dublin', code: 'EU-WEST-1', flag: '🇮🇪' },
  singapore: { name: 'Singapore', code: 'AP-SOUTH-1', flag: '🇸🇬' },
};

interface Seed {
  callsign: string;
  model: string;
  type: Vehicle['type'];
  level: Level;
  label: string;
  battery: number;
  rssi: number | null;
  cpu: number;
  site: Site;
  operator: [string, string];
  team: string;
  serial: string;
  firmware: string;
  commissioned: string;
  lastSeen: string;
  zones: number;
  live: boolean;
}

const SEEDS: Seed[] = [
  { callsign: 'Skyhook-01', model: 'AVY Aera VTOL', type: 'VTOL', level: 'nominal', label: 'Operational', battery: 86, rssi: -58, cpu: 31, site: SITES.munich, operator: ['Oz Vahid', 'OV'], team: 'Inspection', serial: 'AX-3M3A6V', firmware: 'v4.2.1', commissioned: 'Mar 4, 2025', lastSeen: '25 sec ago', zones: 2, live: true },
  { callsign: 'Falcon-02', model: 'Skynode X', type: 'Quad', level: 'advisory', label: 'In flight', battery: 64, rssi: -67, cpu: 52, site: SITES.montreal, operator: ['Mara Lindt', 'ML'], team: 'Survey', serial: 'AX-7K2P0Q', firmware: 'v4.2.1', commissioned: 'Jan 19, 2025', lastSeen: 'Live', zones: 3, live: true },
  { callsign: 'Raven-03', model: 'AVY Aera VTOL', type: 'VTOL', level: 'warning', label: 'Low battery', battery: 18, rssi: -72, cpu: 44, site: SITES.zurich, operator: ['Jonas Réh', 'JR'], team: 'Survey', serial: 'AX-9F1B2C', firmware: 'v4.1.8', commissioned: 'Nov 2, 2024', lastSeen: '2 min ago', zones: 2, live: true },
  { callsign: 'Condor-04', model: 'Skynode X', type: 'Fixed-wing', level: 'alarm', label: 'Link lost', battery: 41, rssi: -98, cpu: 0, site: SITES.austin, operator: ['Priya Nadar', 'PN'], team: 'Delivery', serial: 'AX-5D8E1A', firmware: 'v4.2.0', commissioned: 'Feb 11, 2025', lastSeen: '4 min ago', zones: 1, live: false },
  { callsign: 'Osprey-05', model: 'AVY Aera VTOL', type: 'VTOL', level: 'nominal', label: 'Operational', battery: 92, rssi: -55, cpu: 27, site: SITES.dublin, operator: ['Liam Ó Sé', 'LÓ'], team: 'Inspection', serial: 'AX-2C4D6E', firmware: 'v4.2.1', commissioned: 'Apr 1, 2025', lastSeen: '12 sec ago', zones: 2, live: true },
  { callsign: 'Heron-06', model: 'Skynode S', type: 'Quad', level: 'caution', label: 'Charging', battery: 38, rssi: -64, cpu: 8, site: SITES.munich, operator: ['Oz Vahid', 'OV'], team: 'Maintenance', serial: 'AX-8A0B3F', firmware: 'v4.1.8', commissioned: 'Dec 9, 2024', lastSeen: '1 hr ago', zones: 2, live: false },
  { callsign: 'Kite-07', model: 'Skynode X', type: 'Quad', level: 'advisory', label: 'In flight', battery: 73, rssi: -61, cpu: 49, site: SITES.singapore, operator: ['Wei Chen', 'WC'], team: 'Delivery', serial: 'AX-1E2F3A', firmware: 'v4.2.1', commissioned: 'Feb 27, 2025', lastSeen: 'Live', zones: 3, live: true },
  { callsign: 'Merlin-08', model: 'AVY Aera VTOL', type: 'VTOL', level: 'caution', label: 'GPS degraded', battery: 58, rssi: -70, cpu: 36, site: SITES.zurich, operator: ['Jonas Réh', 'JR'], team: 'Survey', serial: 'AX-6B7C8D', firmware: 'v4.2.0', commissioned: 'Jan 5, 2025', lastSeen: '38 sec ago', zones: 2, live: true },
  { callsign: 'Harrier-09', model: 'Skynode X', type: 'Fixed-wing', level: 'nominal', label: 'Operational', battery: 80, rssi: -59, cpu: 33, site: SITES.montreal, operator: ['Mara Lindt', 'ML'], team: 'Inspection', serial: 'AX-4F5A6B', firmware: 'v4.2.1', commissioned: 'Mar 22, 2025', lastSeen: '8 sec ago', zones: 2, live: true },
  { callsign: 'Vulture-10', model: 'Skynode S', type: 'Quad', level: 'warning', label: 'Geofence', battery: 47, rssi: -65, cpu: 41, site: SITES.austin, operator: ['Priya Nadar', 'PN'], team: 'Survey', serial: 'AX-0C1D2E', firmware: 'v4.1.8', commissioned: 'Oct 28, 2024', lastSeen: '3 min ago', zones: 1, live: true },
];

export const VEHICLES: Vehicle[] = SEEDS.map((s, i) => {
  const n = 48;
  const seed = (i + 1) * 9973;
  return {
    id: String(i + 1),
    callsign: s.callsign,
    model: s.model,
    type: s.type,
    status: { level: s.level, label: s.label },
    battery: s.battery,
    rssi: s.rssi,
    cpu: s.cpu,
    site: s.site,
    operator: { name: s.operator[0], initials: s.operator[1] },
    team: s.team,
    serial: s.serial,
    firmware: s.firmware,
    commissioned: s.commissioned,
    lastSeen: s.lastSeen,
    zones: s.zones,
    live: s.live,
    metrics: {
      battery: series(seed + 1, n, s.battery, 4, 0, 100),
      rssi: series(seed + 2, n, Math.abs(s.rssi ?? 90), 6, 40, 110).map((v) => -v),
      cpu: series(seed + 3, n, s.cpu, 14, 0, 100),
      requests: series(seed + 4, n, 24, 18, 0, 60),
    },
  };
});

export interface NavItem {
  key: string;
  label: string;
  icon: IconName;
}

export const NAV: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: 'house' },
  { key: 'fleet', label: 'Fleet', icon: 'drone' },
  { key: 'operations', label: 'Operations', icon: 'arrow-up-right-from-square' },
  { key: 'teams', label: 'Teams', icon: 'users' },
  { key: 'alerts', label: 'Alerts', icon: 'bell' },
  { key: 'settings', label: 'Settings', icon: 'gear' },
];

/** Header summary counts derived from the fleet. */
export const FLEET_SUMMARY = {
  total: VEHICLES.length,
  flying: VEHICLES.filter((v) => v.status.label === 'In flight').length,
  attention: VEHICLES.filter((v) => v.status.level === 'alarm' || v.status.level === 'warning').length,
};
