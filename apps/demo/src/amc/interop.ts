/**
 * Static reference data for the AMC "NATO interop" view — STANAG 4817 status
 * reporting over CATL.
 *
 * Grounding (open sources, Jul 2026):
 * - STANAG 4817 is NATO's multi-domain C2 reference architecture for unmanned
 *   systems (UUV/USV/UAV): a common reference architecture plus standardised
 *   interfaces at several C2 layers, from high-level command down to vehicle
 *   reporting and tasking. Still in final development, NOT yet ratified.
 * - Its message layer builds on CATL (Collaborative Autonomy Tasking Layer),
 *   the task-centric message format from NATO STO panel SCI-343. Volume 1
 *   defines encodings for high / medium / low-bandwidth streams.
 * - Exercised at REPMUS, Dynamic Messenger and Task Force X Baltic (Jun 2025),
 *   run out of CMRE.
 * - Distinct from STANAG 4586 (UCS air-vehicle interoperability): 4817 is the
 *   newer, broader multi-domain layer.
 *
 * Everything below is illustrative UI data, not a conformance claim.
 */

export type Coverage = 'emitting' | 'partial' | 'planned' | 'absent';

export interface CatlMessage {
  /** CATL message identifier as it appears on the wire. */
  id: string;
  name: string;
  /** Which STANAG 4817 C2 layer the message belongs to. */
  layer: string;
  coverage: Coverage;
  /** Emission rate per bandwidth profile, in Hz (null = not emitted). */
  hz: { low: number | null; medium: number | null; high: number | null };
  /** Approximate encoded payload size in bytes at the medium profile. */
  bytes: number;
  note: string;
}

/** What AMC pushes into the coalition C2 node, message by message. */
export const MESSAGES: CatlMessage[] = [
  {
    id: 'CATL.POS',
    name: 'Platform position report',
    layer: 'Vehicle reporting',
    coverage: 'emitting',
    hz: { low: 0.2, medium: 1, high: 4 },
    bytes: 184,
    note: 'WGS-84 position, altitude, course, speed, uncertainty',
  },
  {
    id: 'CATL.STA',
    name: 'Platform status & health',
    layer: 'Vehicle reporting',
    coverage: 'emitting',
    hz: { low: 0.1, medium: 0.2, high: 1 },
    bytes: 226,
    note: 'Operating state, autonomy level, energy, subsystem health',
  },
  {
    id: 'CATL.TSK',
    name: 'Task status',
    layer: 'Tasking',
    coverage: 'partial',
    hz: { low: null, medium: 0.2, high: 0.5 },
    bytes: 148,
    note: 'Task ref + progress emitted; completion criteria not yet mapped',
  },
  {
    id: 'CATL.CTC',
    name: 'Contact report',
    layer: 'Vehicle reporting',
    coverage: 'planned',
    hz: { low: null, medium: null, high: null },
    bytes: 312,
    note: 'Payload detections — needs a sensor-to-CATL contact mapping',
  },
  {
    id: 'CATL.HND',
    name: 'Control handover',
    layer: 'C2 negotiation',
    coverage: 'absent',
    hz: { low: null, medium: null, high: null },
    bytes: 96,
    note: 'Station-to-station transfer of control authority',
  },
];

/** Coalition tracks resolved from the shared picture, multi-domain per 4817. */
export const TRACKS = [
  { track: 'J1207', domain: 'AIR', callsign: 'COBRA-01', nation: 'DEU', bearing: 123, range: 0, own: true },
  { track: 'J1188', domain: 'SURF', callsign: 'NRP-SETUBAL', nation: 'PRT', bearing: 47, range: 6.4, own: false },
  { track: 'J1204', domain: 'USV', callsign: 'SEAGULL-04', nation: 'GBR', bearing: 88, range: 2.1, own: false },
  { track: 'J1219', domain: 'UUV', callsign: 'REMUS-11', nation: 'USA', bearing: 96, range: 1.7, own: false },
  { track: 'J1223', domain: 'AIR', callsign: 'HERON-02', nation: 'NLD', bearing: 201, range: 11.8, own: false },
] as const;

export type GateState = 'met' | 'open' | 'waived' | 'scheduled';

export interface Gate {
  label: string;
  /** Static caption; replaced by a live one when the gate is rate-derived. */
  detail: string;
  state: GateState;
  /** Rate-derived gates re-evaluate against the selected bandwidth profile. */
  msg?: string;
  minHz?: number;
}

/** Pre-sail readiness gates for the September exercise. */
export const GATES: Gate[] = [
  { label: 'Position report ≥ 1 Hz', detail: '', state: 'met', msg: 'CATL.POS', minHz: 1 },
  { label: 'Status & health report', detail: '', state: 'met', msg: 'CATL.STA', minHz: 0.1 },
  { label: 'CATL vol.1 encoding', detail: 'Low / medium / high streams', state: 'met' },
  { label: 'Task status completion criteria', detail: 'Progress emitted, criteria unmapped', state: 'open' },
  { label: 'Contact report mapping', detail: 'Not in the exercise MOU scope', state: 'waived' },
  { label: 'C2 node interop test', detail: 'Pre-sail bench test · 24 Aug 2026', state: 'scheduled' },
];

/** Rolling latency samples for the link sparkline (ms RTT). */
export const RTT = [46, 52, 44, 61, 48, 43, 57, 71, 49, 45, 42, 58, 66, 47, 44, 51, 43, 48];

export const PROFILES = ['low', 'medium', 'high'] as const;
export type Profile = (typeof PROFILES)[number];

export const PROFILE_META: Record<Profile, { label: string; bandwidth: string; bearer: string }> = {
  low: { label: 'Low', bandwidth: '≤ 2 kbit/s', bearer: 'Acoustic / SATCOM burst' },
  medium: { label: 'Medium', bandwidth: '≤ 64 kbit/s', bearer: 'SRoIP · TCP/TLS' },
  high: { label: 'High', bandwidth: '≤ 2 Mbit/s', bearer: 'LOS datalink · TCP/TLS' },
};
