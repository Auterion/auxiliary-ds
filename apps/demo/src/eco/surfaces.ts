/* The ecosystem demo's page-local layer.
 *
 * The surface declaration table itself now lives in `@auxiliary/shell`
 * (AD-D-038) — this page is a CONSUMER of it, not the place it is defined,
 * which is the only way the specimen sheet proves anything about the shipped
 * artifact rather than about a copy that happens to sit beside it. Everything
 * re-exported below is the package's, verbatim.
 *
 * What stays here is the OBJECT GRAMMAR: a contract this page argues for and
 * that no product has agreed to yet. It is a proposal, so it lives with the
 * proposal.
 */
export {
  SURFACES,
  SURFACE_BY_ID,
  THEMES,
  REGISTERS,
  type Surface,
  type SurfaceId,
  type ThemeKey,
  type RegisterKey,
} from '@auxiliary/shell';

import { type SurfaceId } from '@auxiliary/shell';

/** The three surfaces the page draws in situ — the proposal's own three. */
export const IN_SITU: SurfaceId[] = ['suite', 'control', 'nemyx'];

/* ── The object grammar ───────────────────────────────────────────────────
 *
 * `auterion:<org>:<kind>:<id>`. One addressable name per object, resolvable by
 * any surface. Today the same aircraft is a database row in Suite, a `Vehicle`
 * in Trellys, a MAVLink system id in Mission Control and a serial number on the
 * device page — four names, no way to say "this one" across a radio.
 *
 * `opens` is what makes the app-grid a RESOLVER rather than a bookmarks page:
 * hold an object, open the grid, and the surfaces that cannot open THAT object
 * grey out instead of disappearing — so the operator learns the shape of the
 * system by using it. `why` is the greyed-out reason, and it has to say
 * something true about the surface, not "unavailable".
 */

export interface EntityKind {
  kind: string;
  id: string;
  /** What the object is, in the operator's words. */
  label: string;
  opens: SurfaceId[];
  /** What each surface that CAN open it calls the thing. This column is the
   *  whole argument: same object, nine vocabularies, one name.
   *
   *  Stored as a full noun phrase, ARTICLE INCLUDED, in the case it renders in.
   *  The resolver used to prefix `a`/`an` from the first letter, which is wrong
   *  in both directions on the same letter — "a utilisation record" but "an
   *  update target". English article selection follows the sound, not the
   *  spelling, so it belongs in the copy and not in a regex. */
  as: Partial<Record<SurfaceId, string>>;
  /** Per surface that cannot open it: why not. Keyed by surface id. */
  why: Partial<Record<SurfaceId, string>>;
}

const NO_DOCS = 'Docs holds no operational records.';

/* Typed non-empty so `ENTITIES[0]` is a fallback the compiler trusts, rather
 * than an index the call site has to null-check. */
export const ENTITIES: [EntityKind, ...EntityKind[]] = [
  {
    kind: 'vehicle',
    id: '0f3c-9a21',
    label: 'A tail number — the same aircraft on every surface that can see it',
    opens: ['suite', 'control', 'sim', 'nemyx', 'device', 'insights', 'deploy', 'store'],
    as: {
      suite: 'a fleet record',
      control: 'a selected vehicle',
      sim: 'a simulated twin',
      nemyx: 'an agent',
      device: 'a device page',
      insights: 'a utilisation record',
      deploy: 'an update target',
      store: 'a licensed seat',
    },
    why: { docs: NO_DOCS },
  },
  {
    kind: 'flight',
    id: '2026-08-27-114',
    label: 'One sortie, from arm to disarm',
    opens: ['suite', 'control', 'sim', 'insights'],
    as: {
      suite: 'a flight log entry',
      control: 'a replay',
      sim: 'a replayable scenario',
      insights: 'an analysed sortie',
    },
    why: {
      nemyx: 'Nemyx commands live agents; it keeps no flight log.',
      device: 'The device page reports the vehicle it runs on, not past sorties.',
      deploy: 'Deploy tracks software versions, not sorties.',
      store: 'The Store sells software, not flight records.',
      docs: NO_DOCS,
    },
  },
  {
    kind: 'entity',
    id: 'a71b-4402',
    label: 'A track — something seen, not something flown',
    opens: ['control', 'sim', 'nemyx'],
    as: {
      control: 'a map object',
      sim: 'a scenario contact',
      nemyx: 'a target',
    },
    why: {
      suite: 'Suite records the assets you own. A track is something seen, not something owned.',
      device: 'The device page is about one airframe.',
      insights: 'Insights reports on what you flew, not on what you saw.',
      deploy: 'Deploy addresses software on airframes, nothing on the map.',
      store: 'The Store sells software, not tracks.',
      docs: NO_DOCS,
    },
  },
  {
    kind: 'mission',
    id: 'sync-8821',
    label: 'A plan, synced to whoever has to fly it',
    opens: ['suite', 'control', 'sim', 'nemyx', 'insights'],
    as: {
      suite: 'a Mission Sync plan',
      control: 'a plan',
      sim: 'a rehearsal run',
      nemyx: 'a plan',
      insights: 'a plan-against-flown comparison',
    },
    why: {
      device: 'Plans live with the operator, not on the airframe.',
      deploy: 'Deploy ships software, not plans.',
      store: 'The Store sells software, not plans.',
      docs: NO_DOCS,
    },
  },
  {
    kind: 'group',
    id: 'g1',
    label: 'Several vehicles addressed as one',
    opens: ['suite', 'sim', 'nemyx', 'insights', 'deploy'],
    as: {
      suite: 'a vehicle group',
      sim: 'a simulated formation',
      nemyx: 'a recall group',
      insights: 'a utilisation cohort',
      /* The best evidence the contract is worth having: a group of vehicles in
       * Suite and a rollout ring in Deploy are the same set, and today they are
       * two lists maintained by two people. */
      deploy: 'a rollout ring',
    },
    why: {
      control: 'Mission Control selects vehicles one at a time.',
      device: 'The device page is about one airframe.',
      store: 'The Store sells software, not groups.',
      docs: NO_DOCS,
    },
  },
];

export const ORG = '45cab';

/**
 * Small integers as words.
 *
 * The page states its own counts in prose — how many surfaces, how many bars,
 * how many still proposals — and every one of them is derived from the table
 * rather than typed, because a heading that says "six surfaces" over nine of
 * them is the exact failure this whole demo is built to avoid. A numeral inside
 * a sentence also reads as data rather than as English.
 */
export function spell(n: number): string {
  const WORDS = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six',
    'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  ];
  return WORDS[n] ?? String(n);
}
