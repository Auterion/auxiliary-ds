<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  StatusBadge, Switch, Button, Badge,
} from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Sparkline from '../suite/Sparkline.vue';
import './_os.css';

// One attribute drives BOTH layers: `.dk` keys its palette off [data-theme],
// exactly as the DS semantic tokens do, so the deck grammar and Card/Switch/
// StatusBadge can never re-resolve out of step. There is no second mode axis.
const theme = ref<'dark' | 'light'>('dark');
const section = ref('overview');

// Brand-accent identity — orthogonal to the light/dark theme. `ultramarine` is
// the chromatic auterion-blue brand; `mono` aliases brand to the foreground so
// it flips with light/dark on its own.
//
// It also repoints the deck's ONE signal. The signal budget is one blue surface
// per view, spent where it matters — here, the device mark, because the single
// thing this whole page reports on is one machine. On `mono` the signal becomes
// ink and the view carries zero blue. Inline overrides win over [data-theme].
const accent = ref<'ultramarine' | 'mono'>('ultramarine');
const ACCENTS = [
  { key: 'mono', label: 'Mono' },
  { key: 'ultramarine', label: 'Ultra' },
] as const;
const accentVars = computed(() =>
  accent.value === 'mono'
    ? '--brand: var(--foreground); --brand-foreground: var(--background);'
      + ' --dk-signal: var(--dk-fg); --dk-signal-ink: var(--dk-fg); --dk-on-signal: var(--dk-bg)'
    : undefined,
);

// The device this page is a dossier of. Every fact in the header ledger comes
// from here, so the ledger and the rail can never disagree.
const device = {
  name: 'Skynode X',
  model: 'VTOL · AVY Aera',
  serial: 'AX-3M3A6V',
  os: 'AuterionOS v4.2.1',
  build: '9f3a',
  site: 'Zürich · CH-04',
  uptime: '6d 04:12',
};

// `folio` is the section's position in a sequence of six — it feeds the numeral
// card, which is aria-hidden, so `label` always carries the index in text.
const NAV = [
  { key: 'overview', label: 'Overview', icon: 'house', folio: '01', lede: 'Vitals, subsystem topology and pending updates for this unit.' },
  { key: 'connectivity', label: 'Connectivity', icon: 'bars', folio: '02', lede: 'Every radio reporting to the unit, with measured signal.' },
  { key: 'payloads', label: 'Payloads', icon: 'eye', folio: '03', lede: 'Bays enumerated on the vehicle bus.' },
  { key: 'safety', label: 'Safety', icon: 'lock', folio: '04', lede: 'Guards evaluated before and during flight.' },
  { key: 'apps', label: 'Apps', icon: 'gear', folio: '05', lede: 'Packages installed on this unit.' },
  { key: 'logs', label: 'Logs', icon: 'ellipsis', folio: '06', lede: 'Streaming system journal, newest first.' },
] as const;

function noise(seed: number, base: number, amp: number) {
  let v = base, a = seed;
  const out: number[] = [];
  for (let i = 0; i < 40; i++) {
    a = (a * 1103515245 + 12345) & 0x7fffffff;
    v = Math.max(2, Math.min(100, v + ((a / 0x7fffffff) - 0.5) * amp));
    out.push(Math.round(v));
  }
  return out;
}

type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

const vitals = [
  { label: 'CPU', value: 31, unit: '%', detail: '4 cores · 1.4 GHz', spark: noise(7, 31, 22), level: 'nominal' as Level },
  { label: 'Memory', value: 52, unit: '%', detail: '2.1 / 4.0 GB', spark: noise(11, 52, 14), level: 'nominal' as Level },
  { label: 'Temp', value: 54, unit: '°C', detail: 'SoC junction', spark: noise(13, 54, 10), level: 'caution' as Level },
  { label: 'Storage', value: 30, unit: '%', detail: '38 / 128 GB', spark: noise(17, 30, 6), level: 'nominal' as Level },
];

// System topology — Skynode orchestrating the vehicle subsystems.
const center = { x: 360, y: 196 };
const nodes = [
  { id: 'fmu', label: 'Autopilot', sub: 'PX4 FMU', icon: 'drone', level: 'nominal' as Level, x: 150, y: 70 },
  { id: 'gnss', label: 'GNSS / RTK', sub: '21 sats · fixed', icon: 'house', level: 'nominal' as Level, x: 360, y: 48 },
  { id: 'rc', label: 'RC radio', sub: 'ExpressLRS', icon: 'bars', level: 'nominal' as Level, x: 570, y: 70 },
  { id: 'link', label: 'Datalink', sub: '4G · −84 dBm', icon: 'bars', level: 'caution' as Level, x: 620, y: 196 },
  { id: 'gimbal', label: 'Gimbal', sub: 'Gremsy Pixy', icon: 'eye', level: 'nominal' as Level, x: 570, y: 322 },
  { id: 'esc', label: 'ESC · Motors', sub: '4 / 4 armed-ready', icon: 'gear', level: 'nominal' as Level, x: 360, y: 344 },
  { id: 'ai', label: 'Companion AI', sub: 'Obstacle avoid', icon: 'eye', level: 'advisory' as Level, x: 150, y: 322 },
  { id: 'pwr', label: 'Power', sub: '22.2 V · 78%', icon: 'lock', level: 'nominal' as Level, x: 100, y: 196 },
] as const;

const links = [
  { name: 'RC link', sub: 'ExpressLRS 2.4 GHz', level: 'nominal' as Level, status: 'Bonded', metric: '−52 dBm' },
  { name: 'Datalink', sub: 'Cellular · 4G LTE', level: 'caution' as Level, status: 'Weak', metric: '−84 dBm' },
  { name: 'RTK GPS', sub: 'u-blox F9P', level: 'nominal' as Level, status: 'Fixed', metric: '21 sats' },
  { name: 'Wi-Fi', sub: 'Access point', level: 'advisory' as Level, status: 'Idle', metric: 'off' },
];
const payloads = ref([
  { name: 'Sony ILX-LR1', sub: 'EO camera · 61 MP', on: true },
  { name: 'Gremsy Pixy', sub: '3-axis gimbal', on: true },
  { name: 'FLIR Boson', sub: 'Thermal / IR', on: false },
  { name: 'Parachute', sub: 'Recovery system', on: true },
]);
const safety = ref([
  { name: 'Geofence enforcement', sub: 'Polygon · 400 m ceiling', on: true },
  { name: 'RTL on link loss', sub: 'After 3 s of signal loss', on: true },
  { name: 'Low-battery failsafe', sub: 'Land at 15% remaining', on: true },
  { name: 'Pre-arm checks', sub: 'Block arming on fault', on: false },
]);
const apps = [
  { name: 'Mission Control', version: '4.2.1', level: 'nominal' as Level, status: 'Up to date' },
  { name: 'MAVLink Router', version: '2.0.0', level: 'caution' as Level, status: 'Update available' },
  { name: 'Obstacle Avoidance', version: '1.7.3', level: 'advisory' as Level, status: 'Running' },
  { name: 'RTK Base Link', version: '0.9.0', level: 'advisory' as Level, status: 'Beta' },
];

// The reserved ladder (AD-D-014), not a parallel log vocabulary: one word per
// concept. `advisory` is the informational rung; there is no separate `info`.
type LogLevel = 'advisory' | 'nominal' | 'caution' | 'alarm';
const logs: { t: string; lvl: LogLevel; src: string; msg: string }[] = [
  { t: '06:14:23.881', lvl: 'advisory', src: 'mavlink', msg: 'Heartbeat OK · FMU sysid 1' },
  { t: '06:14:23.412', lvl: 'nominal', src: 'gnss', msg: 'RTK FIXED · 21 sats · HDOP 0.6' },
  { t: '06:14:22.905', lvl: 'caution', src: 'datalink', msg: 'Cellular RSSI −84 dBm, approaching threshold' },
  { t: '06:14:22.770', lvl: 'advisory', src: 'payload', msg: 'Sony ILX-LR1 enumerated on USB3' },
  { t: '06:14:21.330', lvl: 'nominal', src: 'health', msg: 'Pre-arm checks passed (12/12)' },
  { t: '06:14:20.110', lvl: 'advisory', src: 'ota', msg: 'MAVLink Router 2.1.0 available' },
  { t: '06:14:19.642', lvl: 'caution', src: 'thermal', msg: 'SoC junction 54°C, throttle headroom 18°C' },
  { t: '06:14:18.220', lvl: 'advisory', src: 'esc', msg: '4 motors calibrated, telemetry nominal' },
  { t: '06:14:17.005', lvl: 'alarm', src: 'rc', msg: 'RC link dropout 120 ms — recovered' },
  { t: '06:14:15.880', lvl: 'advisory', src: 'gimbal', msg: 'Gremsy Pixy homed, mode FOLLOW' },
  { t: '06:14:14.300', lvl: 'nominal', src: 'net', msg: 'mesh peer yt-a4b2 joined' },
  { t: '06:14:12.770', lvl: 'advisory', src: 'kernel', msg: 'auterion-os 4.2.1 · uptime 6d 04:12' },
];
const logFilter = ref<'all' | 'caution' | 'alarm'>('all');
const shownLogs = computed(() =>
  logFilter.value === 'all' ? logs
  : logFilter.value === 'alarm' ? logs.filter((l) => l.lvl === 'alarm')
  : logs.filter((l) => l.lvl === 'caution' || l.lvl === 'alarm'),
);
// Journal severity rides the status ladder — the dot carries the hue, the label
// carries the contrast-gated *-emphasis ink. `advisory` is the quiet rung, so it stays
// neutral rather than borrowing a ladder rung.
const logDot: Record<LogLevel, string> = {
  advisory: '', nominal: 'dk-dot-nominal', caution: 'dk-dot-caution', alarm: 'dk-dot-alarm',
};
const logInk: Record<LogLevel, string> = {
  advisory: '', nominal: 'dk-ink-nominal', caution: 'dk-ink-caution', alarm: 'dk-ink-alarm',
};

const current = computed(() => NAV.find((n) => n.key === section.value) ?? NAV[0]);

// Bracketed totals — measured facts only, counted from the data rather than
// typed, so they cannot go stale against the table below them.
const bracket = computed(() => {
  switch (section.value) {
    case 'connectivity':
      return `${links.length} links · ${links.filter((l) => l.level === 'nominal').length} nominal `
        + `· ${links.filter((l) => l.level === 'caution').length} degraded`;
    case 'payloads':
      return `${payloads.value.length} bays · ${payloads.value.filter((p) => p.on).length} active`;
    case 'safety':
      return `${safety.value.length} guards · ${safety.value.filter((s) => s.on).length} armed`;
    case 'apps':
      return `${apps.length} packages · ${apps.filter((a) => a.status === 'Update available').length} update`;
    case 'logs':
      return `${shownLogs.value.length} lines · ${logs.filter((l) => l.lvl === 'caution').length} caution `
        + `· ${logs.filter((l) => l.lvl === 'alarm').length} alarm`;
    default:
      return `${vitals.length} vitals · ${nodes.length} subsystems `
        + `· ${nodes.filter((n) => n.level !== 'nominal').length} flagged`;
  }
});

const vitalsBracket = computed(
  () => `${vitals.length} sensors · ${vitals.filter((v) => v.level !== 'nominal').length} caution`,
);
const topologyBracket = computed(
  () => `${nodes.length} subsystems · ${nodes.filter((n) => n.level === 'caution').length} caution `
    + `· ${nodes.filter((n) => n.level === 'advisory').length} advisory`,
);
</script>

<template>
  <div
    :data-theme="theme"
    data-register="operational"
    :style="accentVars"
    class="dk os-root flex h-dvh w-full overflow-hidden"
  >
    <!-- ╭─ Console rail ──────────────────────────────────────────╮ -->
    <aside class="os-rail dk-divide flex shrink-0 flex-col">
      <!-- Device mark + identity. The mark is the view's ONE signal surface. -->
      <div class="os-block os-inline">
        <span class="os-mark dk-plate-signal"><Icon name="drone" size="sm" /></span>
        <span class="os-tight">
          <span class="dk-value truncate">{{ device.name }}</span>
          <span class="dk-label">{{ device.serial }}</span>
        </span>
      </div>

      <!-- Nav. Mono labels, folio hard right — the rail keeps the page's
           alignment rule even though it holds no numerals of its own. -->
      <nav class="os-block flex flex-1 flex-col">
        <p class="dk-label os-rail-head">Sections</p>
        <button
          v-for="n in NAV"
          :key="n.key"
          type="button"
          class="dk-nav-item"
          :data-active="section === n.key"
          :aria-pressed="section === n.key"
          :aria-current="section === n.key ? 'page' : undefined"
          @click="section = n.key"
        >
          <Icon :name="n.icon" size="sm" />
          <span class="dk-label">{{ n.label }}</span>
          <span class="dk-micro dk-num os-nav-folio" aria-hidden="true">{{ n.folio }}</span>
        </button>
      </nav>

      <!-- Live facts + device switcher -->
      <div class="os-block os-stack">
        <div class="os-fields">
          <span class="os-field">
            <span class="dk-pointer">Link</span>
            <span class="os-inline">
              <span class="dk-dot dk-dot-nominal" />
              <span class="dk-value dk-num">12 ms</span>
            </span>
          </span>
          <span class="os-field" data-align="end">
            <span class="dk-pointer">Build</span>
            <span class="dk-value dk-num">{{ device.build }}</span>
          </span>
        </div>
        <button type="button" class="dk-cta dk-lift os-cta-block">
          <span class="os-inline">
            <span class="dk-dot dk-dot-nominal" />
            <span>Skyhook-01</span>
          </span>
          <Icon name="chevron-down" size="xs" />
        </button>
      </div>
    </aside>

    <!-- ╭─ Main column ───────────────────────────────────────────╮ -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Status strip -->
      <header class="os-topbar os-block-x os-inline-lg shrink-0">
        <span class="dk-label">AuterionOS</span>
        <span class="dk-micro">/</span>
        <span class="dk-label">{{ current.label }}</span>
        <StatusBadge level="nominal" size="sm" dot>Connected</StatusBadge>
        <StatusBadge level="caution" size="sm" variant="outline" dot>1 caution</StatusBadge>
        <div class="os-inline ml-auto">
          <!-- brand-accent axis (mono vs ultramarine) -->
          <div class="dk-segment os-md-only">
            <button
              v-for="a in ACCENTS"
              :key="a.key"
              type="button"
              class="dk-segment-btn"
              :data-active="accent === a.key"
              :aria-pressed="accent === a.key"
              @click="accent = a.key"
            >{{ a.label }}</button>
          </div>
          <div class="dk-segment">
            <button
              v-for="t in (['dark', 'light'] as const)"
              :key="t"
              type="button"
              class="dk-segment-btn"
              :data-active="theme === t"
              :aria-pressed="theme === t"
              @click="theme = t"
            >{{ t }}</button>
          </div>
          <Button variant="secondary" size="sm"><Icon name="arrow-up" size="xs" /> Update</Button>
          <Button size="sm"><Icon name="gear" size="xs" /> Configure</Button>
        </div>
      </header>

      <div class="os-scroll flex-1">
        <div class="os-measure">
          <!-- ════ HEADER LEDGER — tops the case layout, one per view ════
               The device identity, constant across every section. -->
          <div class="dk-ledger os-ledger-5">
            <div class="dk-ledger-cell">
              <span class="dk-pointer">Device</span>
              <span class="os-inline">
                <span class="dk-value">{{ device.name }}</span>
                <Badge variant="secondary" size="sm">{{ device.model }}</Badge>
              </span>
            </div>
            <div class="dk-ledger-cell">
              <span class="dk-pointer">Serial</span>
              <span class="dk-value dk-num">{{ device.serial }}</span>
            </div>
            <div class="dk-ledger-cell">
              <span class="dk-pointer">Firmware</span>
              <span class="dk-value dk-num">{{ device.os }} · {{ device.build }}</span>
            </div>
            <div class="dk-ledger-cell">
              <span class="dk-pointer">Site</span>
              <span class="dk-value">{{ device.site }}</span>
            </div>
            <div class="dk-ledger-cell" data-align="end">
              <span class="dk-pointer">Uptime</span>
              <span class="dk-value dk-num">{{ device.uptime }}</span>
            </div>
          </div>

          <!-- ════ CHAPTER HEAD — numeral card · title · totals ════
               Exactly one numeral card per section. -->
          <header class="os-chapter">
            <div class="dk-numeral os-folio">
              <span class="dk-numeral-folio" aria-hidden="true">{{ current.folio }}</span>
            </div>
            <div class="min-w-0">
              <p class="dk-label">Section</p>
              <h1 class="dk-h1">{{ current.label }}</h1>
              <p class="dk-body os-lede">{{ current.lede }}</p>
            </div>
            <span class="dk-bracket">{{ bracket }}</span>
          </header>

          <!-- ════ OVERVIEW ════ -->
          <div v-if="section === 'overview'" class="os-stack">
            <!-- Device cover. Type only: DS components resolve against
                 [data-theme], not against the plate. -->
            <section class="dk-plate os-cover">
              <div class="os-cover-body">
                <p class="dk-h2 dk-ghost os-cover-eyebrow">{{ device.os }}</p>
                <p class="dk-display">{{ device.name }}</p>
                <p class="dk-body os-lede">{{ device.model }} · MAVLink 2 · armed-ready</p>
                <div class="os-fields os-fields-4 os-cover-fields">
                  <span class="os-field">
                    <span class="dk-pointer">State</span>
                    <span class="dk-value">Disarmed</span>
                  </span>
                  <span class="os-field">
                    <span class="dk-pointer">Battery</span>
                    <span class="dk-value dk-num">78%</span>
                  </span>
                  <span class="os-field">
                    <span class="dk-pointer">Subsystems</span>
                    <span class="dk-value dk-num">8 / 8</span>
                  </span>
                  <span class="os-field">
                    <span class="dk-pointer">Last flight</span>
                    <span class="dk-value">2h ago</span>
                  </span>
                </div>
              </div>
              <div class="os-cover-art">
                <svg viewBox="0 0 200 150" class="os-cover-svg" aria-hidden="true">
                  <rect x="42" y="28" width="116" height="94" rx="10" fill="var(--dk-plate-line)" stroke="var(--dk-plate-fg-2)" />
                  <rect x="74" y="54" width="52" height="42" rx="6" fill="var(--dk-plate-line)" stroke="var(--dk-plate-fg-2)" />
                  <circle cx="100" cy="75" r="3" fill="var(--nominal)" />
                  <g stroke="var(--dk-plate-fg-2)" stroke-width="2">
                    <line v-for="n in 6" :key="'t' + n" :x1="42 + n * 17" y1="28" :x2="42 + n * 17" y2="16" />
                    <line v-for="n in 6" :key="'b' + n" :x1="42 + n * 17" y1="122" :x2="42 + n * 17" y2="134" />
                  </g>
                  <text x="100" y="115" text-anchor="middle" class="dk-micro" fill="var(--dk-plate-fg-2)">SKYNODE X</text>
                </svg>
              </div>
            </section>

            <div class="os-inline">
              <Button size="sm">Run diagnostics</Button>
              <Button variant="secondary" size="sm">Restart services</Button>
            </div>

            <!-- update banner — the ladder, not the signal -->
            <div class="dk-card os-edge os-edge-caution os-banner">
              <Icon name="triangle-exclamation" size="sm" class="dk-ink-caution" />
              <div class="os-tight">
                <p class="dk-value">System update available</p>
                <p class="dk-small">MAVLink Router 2.1.0 — cellular failover fix · ~40 s · no reboot</p>
              </div>
              <Button variant="secondary" size="sm">Review &amp; install</Button>
            </div>

            <!-- vitals — a ledger table, numerals hard right -->
            <section>
              <div class="os-head">
                <span class="dk-label">Vitals</span>
                <span class="dk-bracket">{{ vitalsBracket }}</span>
              </div>
              <table class="dk-table">
                <colgroup>
                  <col class="os-col-vital">
                  <col class="os-col-detail">
                  <col class="os-col-trend">
                  <col class="os-col-vstate">
                  <col class="os-col-value">
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">Subsystem</th>
                    <th scope="col">Detail</th>
                    <th scope="col">Trend · 40 samples</th>
                    <th scope="col">State</th>
                    <th scope="col" data-align="end">Load</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="v in vitals" :key="v.label">
                    <td data-lead="true">{{ v.label }}</td>
                    <td class="dk-num">{{ v.detail }}</td>
                    <td class="os-cell-mid">
                      <Sparkline
                        :data="v.spark"
                        :width="168"
                        :height="24"
                        stroke="var(--dk-fg-3)"
                        class="os-trend"
                      />
                    </td>
                    <td class="os-cell-mid">
                      <span class="os-inline">
                        <span class="dk-dot" :class="`dk-dot-${v.level}`" />
                        <span class="dk-label" :class="`dk-ink-${v.level}`">{{ v.level === 'caution' ? 'Warm' : 'Nominal' }}</span>
                      </span>
                    </td>
                    <td data-align="end" data-lead="true">{{ v.value }}{{ v.unit }}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <!-- topology -->
            <section>
              <div class="dk-section">
                <span class="dk-label">System topology</span>
                <span class="dk-bracket">{{ topologyBracket }}</span>
              </div>
              <div class="dk-card os-plot os-cover-fields">
                <svg viewBox="0 0 720 392" class="absolute inset-0 h-full w-full" aria-hidden="true">
                  <line
                    v-for="n in nodes"
                    :key="n.id"
                    :x1="center.x"
                    :y1="center.y"
                    :x2="n.x"
                    :y2="n.y"
                    :stroke="n.level === 'nominal' ? 'var(--dk-line)' : `var(--${n.level})`"
                    stroke-width="1.5"
                    stroke-dasharray="3 5"
                  />
                </svg>
                <!-- centre: the unit itself. Ink, not signal — weight by contrast. -->
                <div
                  class="os-abs os-hub-wrap"
                  :style="{ left: `${center.x / 720 * 100}%`, top: `${center.y / 392 * 100}%` }"
                >
                  <span class="os-hub"><Icon name="drone" size="lg" /></span>
                  <span class="dk-label">Skynode</span>
                </div>
                <!-- subsystem nodes -->
                <div
                  v-for="n in nodes"
                  :key="n.id"
                  class="os-abs"
                  :style="{ left: `${n.x / 720 * 100}%`, top: `${n.y / 392 * 100}%` }"
                >
                  <div
                    class="dk-card dk-lift os-node os-edge"
                    :class="n.level === 'nominal' ? '' : `os-edge-${n.level}`"
                  >
                    <span class="os-tile"><Icon :name="n.icon" size="xs" /></span>
                    <span class="os-tight">
                      <span class="dk-small os-node-title truncate">{{ n.label }}</span>
                      <span class="dk-micro truncate">{{ n.sub }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- ════ CONNECTIVITY ════ -->
          <section v-else-if="section === 'connectivity'">
            <div class="os-head">
              <span class="dk-label">Links</span>
            </div>
            <table class="dk-table">
              <colgroup>
                <col class="os-col-lead">
                <col class="os-col-state">
                <col class="os-col-spec">
                <col class="os-col-act">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Link</th>
                  <th scope="col">State</th>
                  <th scope="col" data-align="end">Signal</th>
                  <th scope="col" data-align="end">Enabled</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="l in links" :key="l.name">
                  <td>
                    <span class="os-tight">
                      <span class="dk-value">{{ l.name }}</span>
                      <span class="dk-pointer">{{ l.sub }}</span>
                    </span>
                  </td>
                  <td class="os-cell-mid"><StatusBadge :level="l.level" size="sm" dot>{{ l.status }}</StatusBadge></td>
                  <td data-align="end" data-lead="true">{{ l.metric }}</td>
                  <td class="os-cell-mid">
                    <span class="os-cell-end"><Switch :model-value="l.status !== 'Idle'" :aria-label="`${l.name} link`" /></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ════ PAYLOADS ════ -->
          <section v-else-if="section === 'payloads'">
            <div class="os-head">
              <span class="dk-label">Bays</span>
            </div>
            <table class="dk-table">
              <colgroup>
                <col class="os-col-lead">
                <col class="os-col-state">
                <col class="os-col-spec">
                <col class="os-col-act">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Payload</th>
                  <th scope="col">State</th>
                  <th scope="col" data-align="end">Spec</th>
                  <th scope="col" data-align="end">Power</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in payloads" :key="p.name">
                  <td data-lead="true">{{ p.name }}</td>
                  <td class="os-cell-mid">
                    <StatusBadge v-if="p.on" level="nominal" size="sm" variant="outline" :icon="false" dot>Ready</StatusBadge>
                    <span v-else class="dk-label">Off</span>
                  </td>
                  <td data-align="end">{{ p.sub }}</td>
                  <td class="os-cell-mid">
                    <span class="os-cell-end"><Switch v-model="p.on" :aria-label="p.name" /></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ════ SAFETY ════ -->
          <section v-else-if="section === 'safety'">
            <div class="os-head">
              <span class="dk-label">Guards</span>
            </div>
            <table class="dk-table">
              <colgroup>
                <col class="os-col-lead">
                <col class="os-col-state">
                <col class="os-col-spec">
                <col class="os-col-act">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Guard</th>
                  <th scope="col">State</th>
                  <th scope="col" data-align="end">Trigger</th>
                  <th scope="col" data-align="end">Armed</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in safety" :key="s.name">
                  <td data-lead="true">{{ s.name }}</td>
                  <td class="os-cell-mid">
                    <StatusBadge :level="s.on ? 'nominal' : 'caution'" size="sm" variant="outline" :icon="false" dot>{{ s.on ? 'Armed' : 'Off' }}</StatusBadge>
                  </td>
                  <td data-align="end">{{ s.sub }}</td>
                  <td class="os-cell-mid">
                    <span class="os-cell-end"><Switch v-model="s.on" :aria-label="s.name" /></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ════ APPS ════ -->
          <section v-else-if="section === 'apps'">
            <div class="os-head">
              <span class="dk-label">Installed</span>
            </div>
            <table class="dk-table">
              <colgroup>
                <col class="os-col-lead">
                <col class="os-col-state">
                <col class="os-col-spec">
                <col class="os-col-act">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Package</th>
                  <th scope="col">State</th>
                  <th scope="col" data-align="end">Version</th>
                  <th scope="col" data-align="end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in apps" :key="a.name">
                  <td data-lead="true">{{ a.name }}</td>
                  <td class="os-cell-mid"><StatusBadge :level="a.level" size="sm" dot>{{ a.status }}</StatusBadge></td>
                  <td data-align="end" data-lead="true">v{{ a.version }}</td>
                  <td class="os-cell-mid">
                    <span class="os-cell-end">
                      <Button v-if="a.status === 'Update available'" variant="secondary" size="sm">Update</Button>
                      <Button v-else variant="ghost" size="sm" aria-label="More actions"><Icon name="ellipsis" size="xs" /></Button>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- ════ LOGS ════ -->
          <section v-else>
            <div class="os-head">
              <div class="dk-segment">
                <button
                  v-for="f in (['all', 'caution', 'alarm'] as const)"
                  :key="f"
                  type="button"
                  class="dk-segment-btn"
                  :data-active="logFilter === f"
                  :aria-pressed="logFilter === f"
                  @click="logFilter = f"
                >{{ f }}</button>
              </div>
              <span class="os-inline">
                <span class="dk-dot dk-dot-nominal" />
                <span class="dk-label">Streaming</span>
              </span>
            </div>
            <div class="os-log-scroll os-scroll">
              <table class="dk-table os-log">
                <colgroup>
                  <col class="os-col-lvl">
                  <col class="os-col-src">
                  <col class="os-col-msg">
                  <col class="os-col-time">
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">Level</th>
                    <th scope="col">Source</th>
                    <th scope="col">Message</th>
                    <th scope="col" data-align="end">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(l, i) in shownLogs" :key="i">
                    <td class="os-cell-mid">
                      <span class="os-inline">
                        <span class="dk-dot" :class="logDot[l.lvl]" />
                        <span class="dk-label" :class="logInk[l.lvl]">{{ l.lvl }}</span>
                      </span>
                    </td>
                    <td>{{ l.src }}</td>
                    <td data-lead="true">{{ l.msg }}</td>
                    <td data-align="end">{{ l.t }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
