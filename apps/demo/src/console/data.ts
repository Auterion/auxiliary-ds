/**
 * Console demo data — the Auterion Suite home page.
 *
 * Content mirrors the "Home Page Refactor UI" design: a fleet-health bar, a live
 * fleet map, an activity feed, pinned groups and a quick-access grid.
 *
 * The vehicle set itself is NOT redefined here — it reuses the Suite showcase's
 * deterministic fleet (`../suite/data`), so both surfaces describe the same
 * imaginary operation. Everything is static; no Math.random, no flicker.
 */

import type { IconName } from '@auxiliary/icons';
import { VEHICLES, type Vehicle } from '../suite/data';

export { VEHICLES };
export type { Vehicle };

export type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

/* ── Navigation ─────────────────────────────────────────────────────────── */

export interface NavItem {
  key: string;
  label: string;
  icon: IconName;
  /** Renders a disclosure chevron — the design's expandable sections. */
  expandable?: boolean;
}

export const NAV_MAIN: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: 'house' },
  { key: 'fleet', label: 'Fleet Management', icon: 'drone', expandable: true },
  { key: 'operations', label: 'Operations', icon: 'arrow-up-right-from-square', expandable: true },
  { key: 'manufacturer', label: 'Manufacturer', icon: 'users', expandable: true },
  { key: 'store', label: 'Store', icon: 'copy' },
];

export const NAV_UTILITY: NavItem[] = [
  { key: 'settings', label: 'Settings', icon: 'gear' },
  { key: 'help', label: 'Help & Support', icon: 'circle-question' },
  { key: 'switchboard', label: 'Switchboard', icon: 'bars' },
];

/* ── Fleet health ───────────────────────────────────────────────────────── */

export interface HealthSegment {
  key: string;
  label: string;
  count: number;
  level: Level;
}

/** The four states in the design's health bar, in ladder order (best → worst). */
export const HEALTH: HealthSegment[] = [
  { key: 'ready', label: 'Ready', count: 14, level: 'nominal' },
  { key: 'out', label: 'Out of Service', count: 2, level: 'caution' },
  { key: 'maint', label: 'In maintenance', count: 1, level: 'warning' },
  { key: 'need', label: 'Need maintenance', count: 1, level: 'alarm' },
];

export const HEALTH_TOTAL = HEALTH.reduce((sum, s) => sum + s.count, 0);
/** "78% of the Vehicles are Healthy" — the design's headline figure. */
export const HEALTH_PCT = 78;

/* ── Live fleet map ─────────────────────────────────────────────────────── */

export interface Site {
  key: string;
  name: string;
  lon: number;
  lat: number;
  vehicles: number;
}

export const SITES: Site[] = [
  { key: 'sf', name: 'San Francisco', lon: -122.4, lat: 37.8, vehicles: 6 },
  { key: 'austin', name: 'Austin', lon: -97.7, lat: 30.3, vehicles: 2 },
  { key: 'montreal', name: 'Montreal', lon: -73.6, lat: 45.5, vehicles: 2 },
  { key: 'dublin', name: 'Dublin', lon: -6.3, lat: 53.3, vehicles: 1 },
  { key: 'munich', name: 'Munich', lon: 11.6, lat: 48.1, vehicles: 4 },
  { key: 'zurich', name: 'Zürich', lon: 8.5, lat: 47.4, vehicles: 3 },
  { key: 'singapore', name: 'Singapore', lon: 103.8, lat: 1.4, vehicles: 1 },
];

/* ── Activity feed ──────────────────────────────────────────────────────── */

export const ACTIVITY_TABS = ['All', 'Flights', 'Software', 'Lifecycle'] as const;
export type ActivityTab = (typeof ACTIVITY_TABS)[number];

export interface Activity {
  id: string;
  who: string;
  initials: string;
  /** Text before the highlighted noun. */
  action: string;
  /** The highlighted noun in the row (the design shows it as a link). */
  link?: string;
  /** Text after the link. */
  tail?: string;
  when: string;
  /** Lifecycle rows carry a lock glyph — locked vs unlocked. */
  lock?: 'locked' | 'unlocked';
  /** The flight row carries a HEALTHY pill + a flight code. */
  flight?: { code: string; level: Level; label: string };
  tab: Exclude<ActivityTab, 'All'>;
}

export const ACTIVITY: Activity[] = [
  { id: 'a1', who: 'Simon Karrer', initials: 'SK', action: 'unlocked', link: 'vehicle', tail: 'for transfer', when: 'Today', lock: 'unlocked', tab: 'Lifecycle' },
  { id: 'a2', who: 'Simon Karrer', initials: 'SK', action: 'locked', link: 'vehicle', tail: 'for transfer', when: 'Yesterday', lock: 'locked', tab: 'Lifecycle' },
  { id: 'a3', who: 'Simon Karrer', initials: 'SK', action: 'unlocked', link: 'vehicle', tail: 'for transfer', when: 'Yesterday', lock: 'unlocked', tab: 'Lifecycle' },
  { id: 'a4', who: 'Kevin Enz', initials: 'KE', action: 'performed', tail: 'flight', when: 'Jul 14', flight: { code: '2NTG4H', level: 'nominal', label: 'Nominal' }, tab: 'Flights' },
  { id: 'a5', who: 'Simon Karrer', initials: 'SK', action: 'unlocked', link: 'vehicle', tail: 'for transfer', when: 'Mar 2', lock: 'unlocked', tab: 'Lifecycle' },
  { id: 'a6', who: 'Simon Karrer', initials: 'SK', action: 'unlocked', link: 'vehicle', tail: 'for transfer', when: 'Jan 27', lock: 'unlocked', tab: 'Lifecycle' },
  { id: 'a7', who: 'Mara Lindt', initials: 'ML', action: 'deployed', link: 'v4.2.1', tail: 'to 8 vehicles', when: 'Jan 12', tab: 'Software' },
  { id: 'a8', who: 'Kevin Enz', initials: 'KE', action: 'performed', tail: 'flight', when: 'Jan 9', flight: { code: '7QBH2M', level: 'caution', label: 'Caution' }, tab: 'Flights' },
  { id: 'a9', who: 'Priya Nadar', initials: 'PN', action: 'retired', link: 'vehicle', tail: 'from the fleet', when: 'Jan 6', lock: 'locked', tab: 'Lifecycle' },
  { id: 'a10', who: 'Oz Vahid', initials: 'OV', action: 'published', link: 'v4.1.8', tail: 'to the stable channel', when: 'Dec 19', tab: 'Software' },
  { id: 'a11', who: 'Wei Chen', initials: 'WC', action: 'performed', tail: 'flight', when: 'Dec 15', flight: { code: 'X4KD91', level: 'nominal', label: 'Nominal' }, tab: 'Flights' },
  { id: 'a12', who: 'Simon Karrer', initials: 'SK', action: 'unlocked', link: 'vehicle', tail: 'for transfer', when: 'Dec 11', lock: 'unlocked', tab: 'Lifecycle' },
  { id: 'a13', who: 'Jonas Réh', initials: 'JR', action: 'rolled back', link: 'v4.2.0', tail: 'on 2 vehicles', when: 'Dec 2', tab: 'Software' },
];

/* ── Pinned groups ──────────────────────────────────────────────────────── */

export interface Group {
  id: string;
  name: string;
  vehicles: number;
  /** Status ladder dots shown under the name. */
  dots: Level[];
}

export const GROUPS: Group[] = [
  { id: 'g1', name: 'Airlogix vehicles test', vehicles: 2, dots: ['nominal', 'warning'] },
  { id: 'g2', name: '1D-Gimbal', vehicles: 18, dots: ['nominal', 'warning', 'advisory'] },
  { id: 'g3', name: '1D-Gimbal', vehicles: 18, dots: ['nominal'] },
  { id: 'g4', name: '1D-Gimbal', vehicles: 18, dots: ['nominal', 'warning', 'alarm'] },
];

/* ── Quick access ───────────────────────────────────────────────────────── */

export interface QuickLink {
  key: string;
  title: string;
  blurb: string;
  icon: IconName;
}

export const QUICK_ACCESS: QuickLink[] = [
  { key: 'vehicles', title: 'Vehicles', blurb: 'Monitor your fleet and manage vehicle software', icon: 'drone' },
  { key: 'flights', title: 'Flights', blurb: 'View flight analytics, logs and access maps', icon: 'arrow-up-right-from-square' },
  { key: 'assets', title: 'Assets', blurb: 'Keep track of payloads, batteries and much more', icon: 'copy' },
  { key: 'maintenance', title: 'Maintenance', blurb: 'Schedule and track upkeep across the fleet', icon: 'bars' },
  { key: 'software', title: 'Software', blurb: 'All Releases, deployments and update status', icon: 'pen-to-square' },
  { key: 'compliance', title: 'Compliance', blurb: 'Flight compliance statistics and reports', icon: 'circle-check' },
];

/* ── Secondary views (kept from the console demo) ───────────────────────── */

export interface AlertRow {
  id: string;
  level: Level;
  title: string;
  detail: string;
  vehicle: string;
  when: string;
  acked: boolean;
}

export const ALERTS: AlertRow[] = [
  { id: 'al1', level: 'alarm', title: 'Datalink lost', detail: 'No telemetry for 4 min — last known position held', vehicle: 'Condor-04', when: '4 min ago', acked: false },
  { id: 'al2', level: 'warning', title: 'Battery below reserve', detail: '18% remaining, return-to-launch advised', vehicle: 'Raven-03', when: '9 min ago', acked: false },
  { id: 'al3', level: 'warning', title: 'Geofence proximity', detail: 'Within 40 m of the Austin zone boundary', vehicle: 'Vulture-10', when: '22 min ago', acked: true },
  { id: 'al4', level: 'caution', title: 'GPS accuracy degraded', detail: 'HDOP 3.4 — holding position until fix improves', vehicle: 'Merlin-08', when: '38 min ago', acked: true },
  { id: 'al5', level: 'advisory', title: 'Firmware update available', detail: 'v4.2.1 ready for 3 vehicles on v4.1.8', vehicle: 'Fleet', when: '2 hr ago', acked: true },
];

export interface Member {
  id: string;
  name: string;
  initials: string;
  role: string;
  team: string;
  site: string;
  status: 'active' | 'invited';
}

export const TEAM: Member[] = [
  { id: 'm1', name: 'Mariana Ferreira', initials: 'MF', role: 'Flight lead', team: 'Operations', site: 'Munich', status: 'active' },
  { id: 'm2', name: 'Simon Karrer', initials: 'SK', role: 'Operator', team: 'Inspection', site: 'Zürich', status: 'active' },
  { id: 'm3', name: 'Kevin Enz', initials: 'KE', role: 'Operator', team: 'Survey', site: 'Zürich', status: 'active' },
  { id: 'm4', name: 'Mara Lindt', initials: 'ML', role: 'Operator', team: 'Survey', site: 'Montreal', status: 'active' },
  { id: 'm5', name: 'Priya Nadar', initials: 'PN', role: 'Maintainer', team: 'Delivery', site: 'Austin', status: 'active' },
  { id: 'm6', name: 'Wei Chen', initials: 'WC', role: 'Operator', team: 'Delivery', site: 'Singapore', status: 'active' },
  { id: 'm7', name: 'Liam Ó Sé', initials: 'LÓ', role: 'Observer', team: 'Inspection', site: 'Dublin', status: 'invited' },
];

export interface Pref {
  key: string;
  label: string;
  help: string;
  on: boolean;
}

export const PREFS: Pref[] = [
  { key: 'notify', label: 'Operational notifications', help: 'Email + in-app when a drone needs attention', on: true },
  { key: 'twofa', label: 'Require two-factor', help: 'Enforce 2FA for every team member', on: false },
  { key: 'metric', label: 'Metric units', help: 'Show altitude and distance in meters', on: true },
  { key: 'digest', label: 'Weekly flight digest', help: 'Monday summary of hours, incidents and utilisation', on: false },
];
