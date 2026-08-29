/* "One Auterion" — the surface declaration table.
 *
 * The claim the ecosystem layer rests on is that it costs ONE component and ONE
 * table. This is the table. Every consumer reads from it — the launcher tiles,
 * the identity bars, any spec panel — so nothing restates a surface's theme,
 * register or context level in markup, and adding a surface is a row rather
 * than a redesign.
 *
 * The values were read out of the four product repos (suite ·
 * vehicle-webapp-ui · trellys · auterion-qgroundcontrol), plus the brand
 * manifest's `themes` array per logo entry. A row marked `proposed` is a
 * surface that does not exist yet; it is declared here so the grid can show the
 * shape of the ecosystem rather than only its current state.
 *
 * This table lives in the package rather than in a demo because the point of
 * it is to be the one copy (AD-D-038). A product that needs a subset filters
 * it; a product that disagrees with a row fixes the row.
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
    /* The surface that needs every theme. It is the one designed for a tablet
     * held outdoors, so it is the first real consumer of `sunlight`, which
     * ships in the token set and has none today. `light` is here because Nemyx
     * ALREADY SHIPS a light theme (`src/assets/main.css:52`) — the earlier
     * version of this row omitted it, which made the table aspirational where
     * it is supposed to be observational (AD-D-016). */
    themes: ['dark', 'darknight', 'sunlight', 'light'],
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
