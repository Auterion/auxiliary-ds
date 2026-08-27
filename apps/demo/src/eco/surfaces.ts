/* "One Auterion" — the surface declaration table.
 *
 * The proposal's whole claim is that the ecosystem layer is ONE component and
 * ONE table. This is the table. Every panel on the page reads from it: the
 * launcher tiles, the five identity bars, the spec ledger, and the object
 * resolver. Nothing on the page restates a surface's theme, register or
 * context level in markup — so a caption cannot go stale against the specimen
 * sitting above it, and adding a sixth surface is a row, not a redesign.
 *
 * The values are the ones the proposal read out of the four product repos
 * (suite · vehicle-webapp-ui · trellys · auterion-qgroundcontrol), plus the
 * brand manifest's `themes` array per logo entry.
 */

export type ThemeKey = 'light' | 'sunlight' | 'dark' | 'darknight';
export type RegisterKey = 'expressive' | 'operational';
export type SurfaceId =
  | 'suite'
  | 'control'
  | 'sim'
  | 'nemyx'
  | 'device'
  | 'insights'
  | 'deploy'
  | 'store'
  | 'docs';

export interface Surface {
  id: SurfaceId;
  /** What the bar prints after the slash. Natural case — CSS uppercases it. */
  chrome: string;
  /** The name the product keeps in the field and on its download page. */
  formal: string;
  /** What the surface is, and what you do there. One line, sentence case. */
  blurb: string;
  /** Context level — the L2 / L3 / L4 ladder the design system already draws. */
  level: string;
  /** The theme this surface lands in by default. */
  theme: ThemeKey;
  /** Every theme it must support — the brand manifest's `themes` for its logo. */
  themes: ThemeKey[];
  register: RegisterKey;
  /** Surface-local navigation. The bar renders whatever it is handed. */
  tabs: string[];
  /** The stack it runs on today — why adoption is cheap here and dear there. */
  stack: string;
  /** Not a surface yet. The proposal's sixth tile. */
  proposed?: boolean;
}

export const SURFACES: Surface[] = [
  {
    id: 'suite',
    chrome: 'Suite',
    formal: 'AuterionSuite',
    blurb: 'Fleet, flights, assets and compliance across every vehicle you operate.',
    level: 'L2 Conventional',
    theme: 'light',
    themes: ['light', 'dark'],
    register: 'expressive',
    tabs: ['Overview', 'Fleet', 'Operations', 'Store'],
    stack: 'Vue 3.3 · Tailwind 2.2.7 · darkMode off',
  },
  {
    id: 'control',
    chrome: 'Control',
    formal: 'Auterion Mission Control',
    blurb: 'The ground control station. Map, multi-vehicle, payload, guarded actions.',
    level: 'L3 Operational / L4 Mission-critical',
    theme: 'dark',
    themes: ['dark', 'darknight'],
    register: 'operational',
    tabs: ['Fly', 'Plan', 'Analyze'],
    stack: 'C++20 · Qt 6 · QML',
  },
  {
    id: 'sim',
    chrome: 'Sim',
    formal: 'Auterion Simulation',
    blurb: 'Fly the plan against a simulated vehicle before the real one leaves the ground.',
    level: 'L2 rehearsal of an L3 surface',
    /* Simulation is the one surface that declares ANOTHER surface's axes on
     * purpose. A rehearsal drawn in a light, roomy desk theme would train the
     * operator on a screen they will never see again — so it takes Control's
     * dark/operational pair, and the launcher tile says so before you click. */
    theme: 'dark',
    themes: ['dark', 'darknight'],
    register: 'operational',
    tabs: ['Scenario', 'Fly', 'Results'],
    stack: 'proposed — not scanned',
    proposed: true,
  },
  {
    id: 'nemyx',
    chrome: 'Nemyx',
    formal: 'Nemyx',
    blurb: 'Swarm command. Selection groups, formations, one screen, keyboard first.',
    level: 'L4 Mission-critical',
    theme: 'dark',
    // The only surface that needs all three operational themes: it is the one
    // designed for a tablet held outdoors. `sunlight` ships in the token set
    // and has no consumer today — this is it.
    themes: ['dark', 'darknight', 'sunlight'],
    register: 'operational',
    tabs: [],
    stack: 'Vue 3.5 · Tailwind v4 · local c2-* tokens',
  },
  {
    id: 'device',
    chrome: 'Device',
    formal: 'AuterionOS',
    blurb: 'On-vehicle admin. System status, radios, apps, security and diagnostics.',
    level: 'L2 device admin',
    theme: 'light',
    themes: ['light', 'dark'],
    register: 'expressive',
    tabs: ['Status', 'Network', 'Apps', 'Security'],
    stack: 'Vue 3.2 · Tailwind 2.2.7 · darkMode off',
  },
  {
    id: 'insights',
    chrome: 'Insights',
    formal: 'Auterion Insights',
    blurb: 'What the fleet actually did. Utilisation, anomalies, plan against flown, exports.',
    level: 'L2 Conventional',
    theme: 'light',
    themes: ['light', 'dark'],
    register: 'expressive',
    tabs: ['Fleet', 'Sorties', 'Anomalies', 'Reports'],
    stack: 'proposed — not scanned',
    proposed: true,
  },
  {
    id: 'deploy',
    chrome: 'Deploy',
    formal: 'Auterion Deploy',
    blurb: 'Software to the fleet in rings, with a staged rollout you can stop halfway.',
    level: 'L2 Conventional',
    theme: 'light',
    themes: ['light', 'dark'],
    register: 'expressive',
    tabs: ['Releases', 'Rollouts', 'Devices'],
    stack: 'proposed — not scanned',
    proposed: true,
  },
  {
    id: 'store',
    chrome: 'Store',
    formal: 'Auterion Store',
    blurb: 'Apps, licences, Mission Control builds, AuterionOS releases, developer tools.',
    level: 'L2 Conventional',
    theme: 'light',
    themes: ['light', 'dark'],
    register: 'expressive',
    tabs: ['Apps', 'Licences', 'Builds'],
    stack: 'Vue 3.3 · Tailwind 2.2.7',
  },
  {
    id: 'docs',
    chrome: 'Docs',
    formal: 'Auterion Docs',
    blurb: 'The manual, at equal weight in the grid — the tile a new operator opens first.',
    level: 'L1 Reference',
    theme: 'light',
    themes: ['light', 'dark'],
    register: 'expressive',
    tabs: [],
    stack: 'proposed — the slot the wiki takes',
    proposed: true,
  },
];

export const SURFACE_BY_ID = Object.fromEntries(
  SURFACES.map((s) => [s.id, s]),
) as Record<SurfaceId, Surface>;

/** The three surfaces the page draws in situ — the proposal's own three. */
export const IN_SITU: SurfaceId[] = ['suite', 'control', 'nemyx'];

export const THEMES: { key: ThemeKey; label: string }[] = [
  { key: 'light', label: 'Light' },
  { key: 'sunlight', label: 'Sunlight' },
  { key: 'dark', label: 'Dark' },
  { key: 'darknight', label: 'Darknight' },
];

export const REGISTERS: { key: RegisterKey; label: string }[] = [
  { key: 'expressive', label: 'Expressive' },
  { key: 'operational', label: 'Operational' },
];

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
