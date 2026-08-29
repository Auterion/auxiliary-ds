/**
 * FlyView — the model behind the two AMC asks routed to #amc-ui-work.
 *
 * Both asks arrive as solutions ("make ARM red", "put six items on right-click").
 * Modelling them first is what turns each one back into the question it came
 * from, and the two questions are different:
 *
 *   ARM  → what STATE is the aircraft in, and how loud should each state be?
 *   DIAL → what CLASS is a command in, and how much guard does that class earn?
 *
 * One source for both, so a state cannot be styled in one place and worded in
 * another.
 */

import type { Level } from '../amc27/telemetry';

/* ── Arm state ─────────────────────────────────────────────────────────────
 * The request is binary — ARM red, DISARM green. The aircraft is not binary.
 * An armed aircraft ON THE GROUND is the state in which a person can walk into
 * a turning rotor; an armed aircraft AIRBORNE has taken that hazard 118 m away
 * from everyone standing near it. Collapsing the two loses the distinction that
 * the colour was being asked for in the first place.
 */
export type Arm = 'safe' | 'ground' | 'air';

export interface ArmSpec {
  /** The word an operator reads. Never abbreviated below four characters. */
  word: string;
  /** The second line — what the state permits, not what it is called. */
  gloss: string;
  /** Which glyph: a closed shackle, an open one, an open one in flight. */
  open: boolean;
}

export const ARM: Record<Arm, ArmSpec> = {
  safe: { word: 'DISARMED', gloss: 'Rotors inhibited', open: false },
  ground: { word: 'ARMED', gloss: 'Rotors live · on ground', open: true },
  air: { word: 'ARMED', gloss: 'Rotors live · airborne', open: true },
};

export const ARM_ORDER: Arm[] = ['safe', 'ground', 'air'];

/**
 * The two colour schemes the meeting has to choose between.
 *
 * `requested` is the Slack text implemented literally, so it can be looked at
 * rather than imagined. `proposed` is the same three states with the loudness
 * ordered by how close the hazard is to a human being.
 */
export type Scheme = 'requested' | 'proposed';

export const SCHEME_LABEL: Record<Scheme, string> = {
  requested: 'As requested',
  proposed: 'Proposed',
};

/* ── Commands ──────────────────────────────────────────────────────────────
 * The six the thread names, plus the class each belongs to. The class — not
 * the label, not the icon — decides the guard, the placement and the wording.
 *
 *   mode   a reversible change of what the aircraft is doing. Fires on release.
 *   value  a number the operator has to choose. Opens the hub; never fires blind.
 *   estimate  a correction to what the aircraft BELIEVES about itself. Guarded,
 *             because a wrong one is silent — the aircraft flies confidently to
 *             the wrong place and nothing on the screen looks unusual.
 */
export type CmdKind = 'mode' | 'value' | 'estimate';

export interface Cmd {
  key: string;
  /** Sector label. Two words at most — it is read in peripheral vision. */
  label: string;
  /** What it will do, in the imperative, shown in the hub on hover. */
  detail: string;
  kind: CmdKind;
  /** Clock angle in degrees, 0 = up, growing clockwise. */
  angle: number;
  /** Value commands only: the unit, bounds and step of the hub stepper. */
  range?: { unit: string; min: number; max: number; step: number; from: number };
  /** Estimate commands only: the level their confirmation carries. */
  level?: Level;
}

/**
 * Placement is deliberate and is half the design.
 *
 * The right half of the ring is everyday: the two modes at the top, where the
 * pointer already is, and the two values below them. The left half is the two
 * estimator corrections, together, behind a guard — because the complaint that
 * started this thread was LAND sitting next to RESET VEHICLE POSITION with
 * nothing between them and one of the two going through instantly.
 *
 * Same-class items may sit next to each other. Different-class items may not.
 */
export const COMMANDS: Cmd[] = [
  { key: 'hold', label: 'Hold', detail: 'Loiter at present position', kind: 'mode', angle: 0 },
  { key: 'eight', label: 'Eight', detail: 'Fly a figure-eight about this point', kind: 'mode', angle: 60 },
  {
    key: 'speed',
    label: 'Speed',
    detail: 'Set commanded airspeed',
    kind: 'value',
    angle: 120,
    range: { unit: 'm/s', min: 8, max: 34, step: 1, from: 28 },
  },
  {
    key: 'alt',
    label: 'Altitude',
    detail: 'Set commanded altitude above ground',
    kind: 'value',
    angle: 180,
    range: { unit: 'm', min: 30, max: 400, step: 10, from: 118 },
  },
  {
    key: 'heading',
    label: 'Reset heading',
    detail: 'Re-align the aircraft heading estimate to true north',
    kind: 'estimate',
    angle: 240,
    level: 'caution',
  },
  {
    key: 'position',
    label: 'Reset position',
    detail: 'Move the aircraft position estimate to this map point',
    kind: 'estimate',
    angle: 300,
    level: 'warning',
  },
];

/** Sector geometry. Six sectors, so 60° each and a 6° gap between neighbours. */
export const SECTOR = 60;
export const SECTOR_GAP = 6;

/**
 * The reduced left rail.
 *
 * The thread's conclusion was "use now only 3 modes, everything else we can
 * control from keyboard" — the six-circle rail is what the dial replaces. These
 * three stay because they are the ones an operator reaches for without having
 * decided anything first.
 */
export const RAIL: { key: string; label: string; value: string }[] = [
  { key: 'rtl', label: 'Return', value: '954 m' },
  { key: 'hold', label: 'Hold', value: 'Loiter' },
  { key: 'land', label: 'Land', value: 'Pad A' },
];
