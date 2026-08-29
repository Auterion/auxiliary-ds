/* The sheet's content, in one table.
 *
 * Same discipline as the ecosystem demo's surface table: nothing in the markup
 * restates a fact that lives here, so a page cannot drift from its own data and
 * adding a row is a row rather than a redesign.
 *
 * Partner names match the ones the existing auterion.com demo already uses
 * (`web/pages/Home.vue`), so the two surfaces cannot disagree about who the
 * company works with.
 */

import type { IconName } from '@auxiliary/icons';

export type PageKey = 'home' | 'product' | 'solutions' | 'company' | 'careers' | 'news';

export const NAV: { key: PageKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'product', label: 'Product' },
  { key: 'solutions', label: 'Solutions' },
  { key: 'company', label: 'Company' },
  { key: 'careers', label: 'Careers' },
  { key: 'news', label: 'News' },
];

export const PARTNERS = ['NATO', 'US DoD', 'Quantum Systems', 'Nokia', 'Skydio', 'GovTech'];

/** The rotating capability list in the hero — what the platform actually does. */
export const CAPABILITIES = [
  'Mission autonomy',
  'Fleet operations',
  'Payload control',
  'Swarm command',
];

/* ── Product stack ───────────────────────────────────────────────────────── */

export interface StackEntry {
  id: string;
  index: string;
  name: string;
  role: string;
  blurb: string;
  specs: [string, string][];
}

export const STACK: StackEntry[] = [
  {
    id: 'skynode',
    index: '01',
    name: 'Skynode',
    role: 'Flight computer',
    blurb:
      'The mission computer that turns an airframe into a software-defined vehicle. Autopilot, compute, encrypted link and payload interface on one board.',
    specs: [
      ['Compute', 'NVIDIA Jetson class'],
      ['Autopilot', 'PX4, MAVLink 2'],
      ['Link', 'AES-256, mesh capable'],
      ['Interface', 'Payload SDK'],
    ],
  },
  {
    id: 'os',
    index: '02',
    name: 'AuterionOS',
    role: 'Vehicle operating system',
    blurb:
      'The on-vehicle system layer. Device status, radios, apps, security and diagnostics — administered from the airframe itself, offline-first by design.',
    specs: [
      ['Served from', 'The vehicle'],
      ['Updates', 'Signed, staged'],
      ['Apps', 'Sandboxed'],
      ['Offline', 'First-class state'],
    ],
  },
  {
    id: 'control',
    index: '03',
    name: 'Mission Control',
    role: 'Ground control station',
    blurb:
      'The operator surface. Map, multi-vehicle, payload and video, guarded actions for anything irreversible. Dark and dense, built for a rugged controller in daylight.',
    specs: [
      ['Context', 'L3 / L4 mission-critical'],
      ['Vehicles', 'Multi, simultaneous'],
      ['Actions', 'Guarded and logged'],
      ['Input', 'Desk and touch'],
    ],
  },
  {
    id: 'suite',
    index: '04',
    name: 'AuterionSuite',
    role: 'Fleet operations',
    blurb:
      'Everything between sorties. Fleet, flights, assets, compliance and mission sync across every vehicle you operate, in one tenant.',
    specs: [
      ['Scope', 'Whole fleet'],
      ['Records', 'Flights and assets'],
      ['Sync', 'Plans to operators'],
      ['Access', 'Role-based'],
    ],
  },
  {
    id: 'nemyx',
    index: '05',
    name: 'Nemyx',
    role: 'Swarm command',
    blurb:
      'Several vehicles addressed as one. Selection groups, formations and recall on a single keyboard-first screen, built for a tablet held outdoors.',
    specs: [
      ['Model', 'Agents, not aircraft'],
      ['Control', 'Keyboard-first'],
      ['Formations', 'Live re-tasking'],
      ['Themes', 'Sunlight to scotopic'],
    ],
  },
];

/* ── Capability tiles ────────────────────────────────────────────────────── */

export const CAPABILITY_TILES = [
  {
    idx: '/01',
    title: 'One vehicle or one hundred',
    body: 'The same operator model scales from a single airframe to a coordinated group. Nothing about the interface changes shape when the fleet does.',
  },
  {
    idx: '/02',
    title: 'Guarded by construction',
    body: 'Every irreversible command — arm, strike, abort — is a two-stage action with an audit trail. The interlock is in the design system, not in each product.',
  },
  {
    idx: '/03',
    title: 'Legible in any light',
    body: 'Four themes, from a sunlit tablet to a scotopic night cockpit. The operator never trades legibility for the conditions they are working in.',
  },
  {
    idx: '/04',
    title: 'Open where it matters',
    body: 'PX4, MAVLink and a documented payload SDK. Your integrations are yours; the stack does not hold your airframes hostage.',
  },
];

/* ── Deployments (the measured row list) ─────────────────────────────────── */

export interface Deployment {
  year: string;
  client: string;
  title: string;
  body: string;
}

export const DEPLOYMENTS: Deployment[] = [
  {
    year: '//2026',
    client: 'NATO',
    title: 'Multi-national fleet interoperability',
    body: 'One ground station specification across allied operators, with mission plans that survive the handover between them.',
  },
  {
    year: '//2025',
    client: 'US DoD',
    title: 'Software-defined airframe programme',
    body: 'Skynode as the common mission computer across mixed vendors, so capability ships as an update rather than an airframe.',
  },
  {
    year: '//2025',
    client: 'Quantum Systems',
    title: 'Reconnaissance platform integration',
    body: 'Fixed-wing VTOL on AuterionOS with a shared payload interface and a single operator surface.',
  },
  {
    year: '//2024',
    client: 'Nokia',
    title: 'Drone-in-a-box over private LTE',
    body: 'Autonomous inspection sorties dispatched from Suite, flown over private cellular, returned to a docked charge cycle.',
  },
];

/* ── Telemetry cards ─────────────────────────────────────────────────────── */

export const TELEMETRY: {
  icon: IconName;
  title: string;
  value: string;
  caption: string;
  kind: 'gauge' | 'bars' | 'spark';
  reading?: number;
  series?: number[];
  foot: [string, string][];
}[] = [
  {
    icon: 'drone',
    title: 'Fleet readiness',
    value: '98.7%',
    caption: 'Airframes cleared to fly',
    kind: 'gauge',
    reading: 98.7,
    foot: [
      ['1 667', 'VEHICLES'],
      ['22', 'GROUNDED'],
    ],
  },
  {
    icon: 'bars',
    title: 'Sorties flown',
    value: '12 480',
    caption: 'Rolling thirty days',
    kind: 'bars',
    series: [38, 52, 47, 61, 55, 72, 66, 81, 74, 88, 79, 94],
    foot: [
      ['695', 'THIS WEEK'],
      ['+18%', 'VS LAST'],
    ],
  },
  {
    icon: 'circle-check',
    title: 'Link integrity',
    value: '99.99%',
    caption: 'Command and control uptime',
    kind: 'spark',
    series: [92, 94, 93, 96, 95, 97, 96, 98, 97, 99, 98, 99, 99, 100],
    foot: [
      ['41 ms', 'MEDIAN RTT'],
      ['0', 'LOST LINKS'],
    ],
  },
];

/* ── Approach ────────────────────────────────────────────────────────────── */

export const APPROACH = [
  {
    idx: '/01',
    title: 'Ship to the operator, not to the demo',
    body: 'Every surface is designed against the conditions it actually runs in — gloves, glare, a moving vehicle, a link that drops. A feature that only works at a desk is not finished.',
  },
  {
    idx: '/02',
    title: 'One vocabulary, every product',
    body: 'Five severities, two densities, four themes, one set of names. An operator moving from Suite to Mission Control is not asked to relearn what a warning looks like.',
  },
  {
    idx: '/03',
    title: 'Degraded is a designed state',
    body: 'Offline, stale, partial and denied are drawn deliberately, not left to whatever the component does when the data stops. The picture always says how old it is.',
  },
];

/* ── Solutions ───────────────────────────────────────────────────────────── */

export const SECTORS = [
  {
    id: 'defense',
    idx: '//01',
    name: 'Defence',
    title: 'Command at the edge of the network',
    body: 'Multi-vehicle reconnaissance, strike coordination and swarm tasking on hardware that assumes the link will drop and the light will be wrong.',
    points: ['Guarded irreversible actions', 'Scotopic and sunlight themes', 'Air-gapped deployment', 'Allied interoperability'],
    plate: 'swarm' as const,
  },
  {
    id: 'safety',
    idx: '//02',
    name: 'Public safety',
    title: 'First on scene, before anyone is',
    body: 'Dispatch from a dock, stream to an incident commander, hand the same picture to every responder without a second radio call.',
    points: ['Drone-as-first-responder', 'Live shared situational picture', 'Chain-of-custody records', 'One-operator flight'],
    plate: 'orbit' as const,
  },
  {
    id: 'energy',
    idx: '//03',
    name: 'Energy',
    title: 'Inspect the grid without climbing it',
    body: 'Repeatable autonomous inspection over transmission, generation and pipeline assets, with the same flight flown identically every quarter.',
    points: ['Repeatable mission plans', 'Payload-agnostic capture', 'Change detection over time', 'Beyond visual line of sight'],
    plate: 'contour' as const,
  },
  {
    id: 'infrastructure',
    idx: '//04',
    name: 'Infrastructure',
    title: 'A survey that closes the same day',
    body: 'Bridges, rail, ports and construction, flown to a plan and returned to the office as a record rather than a folder of images.',
    points: ['Survey-grade capture', 'Fleet-wide compliance', 'Automated flight logs', 'Contractor access control'],
    plate: 'halftone' as const,
  },
];

/* ── Company ─────────────────────────────────────────────────────────────── */

export const COMPANY_NUMBERS: [string, string][] = [
  ['2017', 'Founded'],
  ['1 667', 'Vehicles under management'],
  ['40+', 'Countries operating'],
  ['3', 'Continents, engineering'],
];

export const PRINCIPLES = [
  {
    idx: '/01',
    title: 'Open beats locked',
    body: 'The stack is built on PX4 and MAVLink because an operator who cannot leave is not a customer, they are a hostage. Openness is a commercial position, not a licence choice.',
  },
  {
    idx: '/02',
    title: 'Software is the airframe',
    body: 'Capability should arrive as an update to a fleet already in the field, not as a procurement cycle for a new one.',
  },
  {
    idx: '/03',
    title: 'Sovereign by default',
    body: 'Where the data lives, who can read it and what runs without a network are answers we give before we are asked.',
  },
];

export const OFFICES: [string, string][] = [
  ['Zurich', 'Engineering · HQ'],
  ['Arlington, VA', 'Defence programmes'],
  ['Munich', 'Integration'],
  ['Salt Lake City', 'Manufacturing'],
];

/* ── Careers ─────────────────────────────────────────────────────────────── */

export interface Role {
  ref: string;
  title: string;
  team: string;
  location: string;
  type: string;
}

export const ROLES: Role[] = [
  { ref: '//ENG-114', title: 'Senior Flight Software Engineer', team: 'Autonomy', location: 'Zurich', type: 'Full-time' },
  { ref: '//ENG-118', title: 'Embedded Linux Engineer, Skynode', team: 'Platform', location: 'Zurich', type: 'Full-time' },
  { ref: '//DES-021', title: 'Design Engineer, Operator Surfaces', team: 'Design', location: 'Zurich · Remote', type: 'Full-time' },
  { ref: '//DES-022', title: 'Product Designer, Fleet', team: 'Design', location: 'Munich', type: 'Full-time' },
  { ref: '//FLD-009', title: 'Field Applications Engineer', team: 'Solutions', location: 'Arlington, VA', type: 'Full-time' },
  { ref: '//SEC-004', title: 'Security Engineer, Supply Chain', team: 'Security', location: 'Zurich · Remote', type: 'Full-time' },
  { ref: '//OPS-031', title: 'Manufacturing Test Engineer', team: 'Operations', location: 'Salt Lake City', type: 'Full-time' },
];

export const BENEFITS = [
  { idx: '/01', title: 'Time in the field', body: 'Every engineer flies. You will stand in a cold field watching an operator use what you built, at least twice a year.' },
  { idx: '/02', title: 'Equity, not lottery tickets', body: 'Meaningful ownership with terms written in plain language, explained before you sign rather than after.' },
  { idx: '/03', title: 'Deep work is protected', body: 'Two no-meeting days a week, held company-wide. Not a guideline — it is in the calendar and it is defended.' },
  { idx: '/04', title: 'Move where the work is', body: 'Relocation support across four sites, and the visa work handled by people who have done it before.' },
];

/* ── News ────────────────────────────────────────────────────────────────── */

export interface Article {
  id: string;
  date: string;
  read: string;
  kind: string;
  title: string;
  excerpt: string;
  plate: 'halftone' | 'contour' | 'scan' | 'orbit' | 'swarm';
  seed: number;
}

export const ARTICLES: Article[] = [
  {
    id: 'a1',
    date: 'AUG 18, 2026',
    read: '6 MIN READ',
    kind: 'PLATFORM',
    title: 'What a shared design system does to a fleet of five products',
    excerpt:
      'Five surfaces, four themes and one status vocabulary. What changed when the operator stopped having to relearn a warning between Suite and Mission Control.',
    plate: 'swarm',
    seed: 3,
  },
  {
    id: 'a2',
    date: 'AUG 04, 2026',
    read: '4 MIN READ',
    kind: 'ENGINEERING',
    title: 'Designing for a link that will drop',
    excerpt: 'Degraded is a state you draw on purpose, or a state your users discover for you.',
    plate: 'scan',
    seed: 7,
  },
  {
    id: 'a3',
    date: 'JUL 22, 2026',
    read: '5 MIN READ',
    kind: 'FIELD NOTES',
    title: 'Why the night theme is amber, not blue',
    excerpt: 'Scotopic adaptation takes twenty minutes to build and one glance to lose.',
    plate: 'contour',
    seed: 11,
  },
  {
    id: 'a4',
    date: 'JUL 09, 2026',
    read: '3 MIN READ',
    kind: 'COMPANY',
    title: 'Skynode ships to a fourth airframe manufacturer',
    excerpt: 'The common mission computer thesis, one integration further along.',
    plate: 'halftone',
    seed: 5,
  },
  {
    id: 'a5',
    date: 'JUN 27, 2026',
    read: '7 MIN READ',
    kind: 'ENGINEERING',
    title: 'Guarded actions: the interlock that belongs in the system',
    excerpt: 'Arming a vehicle should be hard in exactly one way, and every product should agree on which way.',
    plate: 'orbit',
    seed: 13,
  },
  {
    id: 'a6',
    date: 'JUN 12, 2026',
    read: '4 MIN READ',
    kind: 'PLATFORM',
    title: 'Mission sync, and the plan that outlives the planner',
    excerpt: 'A route is not a file. It is an object several people have to agree about.',
    plate: 'swarm',
    seed: 17,
  },
];

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export const FAQ = [
  {
    q: 'Does the stack run without a network?',
    a: 'Yes. AuterionOS is administered from the vehicle itself and Mission Control operates fully offline; air-gapped deployment is a supported configuration, not a workaround. Fleet-level features in Suite resynchronise when a link returns.',
  },
  {
    q: 'Which airframes does Skynode support?',
    a: 'Skynode is airframe-agnostic and ships across multiple manufacturers. Integration is a documented hardware interface plus the payload SDK, so a new airframe is an integration project rather than a bespoke programme.',
  },
  {
    q: 'What happens to our data?',
    a: 'It stays where you put it. Suite can be operated as a tenant you host, and nothing in the vehicle stack requires telemetry to leave your network for the aircraft to fly.',
  },
  {
    q: 'Can we build our own operator surfaces?',
    a: 'Yes. The payload SDK and MAVLink interfaces are documented and public, and the design system behind our own surfaces is available so a product you build reads as part of the same fleet.',
  },
];
