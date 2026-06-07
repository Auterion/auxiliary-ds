<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  StatusBadge, TelemetryValue, Switch, Button, Badge,
} from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Sparkline from '../suite/Sparkline.vue';

const theme = ref<'dark' | 'light'>('dark');
const section = ref('overview');

const NAV = [
  { key: 'overview', label: 'Overview', icon: 'house' },
  { key: 'connectivity', label: 'Connectivity', icon: 'bars' },
  { key: 'payloads', label: 'Payloads', icon: 'eye' },
  { key: 'safety', label: 'Safety', icon: 'lock' },
  { key: 'apps', label: 'Apps', icon: 'gear' },
  { key: 'logs', label: 'Logs', icon: 'ellipsis' },
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
const C = 2 * Math.PI * 42;
const gaugeColor = (l: Level) => (l === 'nominal' ? 'var(--foreground)' : `var(--${l})`);

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

type LogLevel = 'info' | 'ok' | 'warn' | 'error';
const logs: { t: string; lvl: LogLevel; src: string; msg: string }[] = [
  { t: '06:14:23.881', lvl: 'info', src: 'mavlink', msg: 'Heartbeat OK · FMU sysid 1' },
  { t: '06:14:23.412', lvl: 'ok', src: 'gnss', msg: 'RTK FIXED · 21 sats · HDOP 0.6' },
  { t: '06:14:22.905', lvl: 'warn', src: 'datalink', msg: 'Cellular RSSI −84 dBm, approaching threshold' },
  { t: '06:14:22.770', lvl: 'info', src: 'payload', msg: 'Sony ILX-LR1 enumerated on USB3' },
  { t: '06:14:21.330', lvl: 'ok', src: 'health', msg: 'Pre-arm checks passed (12/12)' },
  { t: '06:14:20.110', lvl: 'info', src: 'ota', msg: 'MAVLink Router 2.1.0 available' },
  { t: '06:14:19.642', lvl: 'warn', src: 'thermal', msg: 'SoC junction 54°C, throttle headroom 18°C' },
  { t: '06:14:18.220', lvl: 'info', src: 'esc', msg: '4 motors calibrated, telemetry nominal' },
  { t: '06:14:17.005', lvl: 'error', src: 'rc', msg: 'RC link dropout 120 ms — recovered' },
  { t: '06:14:15.880', lvl: 'info', src: 'gimbal', msg: 'Gremsy Pixy homed, mode FOLLOW' },
  { t: '06:14:14.300', lvl: 'ok', src: 'net', msg: 'mesh peer yt-a4b2 joined' },
  { t: '06:14:12.770', lvl: 'info', src: 'kernel', msg: 'auterion-os 4.2.1 · uptime 6d 04:12' },
];
const logFilter = ref<'all' | 'warn' | 'error'>('all');
const shownLogs = computed(() =>
  logFilter.value === 'all' ? logs
  : logFilter.value === 'error' ? logs.filter((l) => l.lvl === 'error')
  : logs.filter((l) => l.lvl === 'warn' || l.lvl === 'error'),
);
const logColor: Record<LogLevel, string> = {
  info: 'var(--muted-foreground)', ok: 'var(--nominal)', warn: 'var(--caution)', error: 'var(--alarm)',
};
// Log level -> severity-edge rail class (INFO -> none, OK -> nominal, WARN -> caution, ERROR -> alarm).
const logEdge: Record<LogLevel, string> = {
  info: '', ok: 'ix-edge-nominal', warn: 'ix-edge-caution', error: 'ix-edge-alarm',
};

const sectionTitle = computed(() => NAV.find((n) => n.key === section.value)?.label ?? '');
</script>

<template>
  <div :data-theme="theme" data-register="operational" class="os-root flex h-dvh w-full overflow-hidden bg-background text-foreground">
    <!-- ╭─ Console rail ──────────────────────────────────────────╮ -->
    <aside class="flex w-60 shrink-0 flex-col border-r border-border bg-card">
      <!-- Device mark + identity -->
      <div class="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg"
          style="background: linear-gradient(140deg, var(--brand), color-mix(in oklab, var(--brand) 60%, black)); color: var(--brand-foreground)"
        >
          <Icon name="drone" size="sm" />
        </div>
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-[13px] font-semibold tracking-tight leading-tight">Skynode X</span>
          <span class="ix-label-sm">AX-3M3A6V</span>
        </div>
      </div>

      <!-- Nav group -->
      <nav class="flex flex-1 flex-col gap-0.5 px-3 pt-4">
        <span class="ix-label px-2 pb-1.5">DEVICE</span>
        <button
          v-for="n in NAV"
          :key="n.key"
          type="button"
          class="ix-edge group relative flex h-9 items-center gap-2.5 rounded-lg pl-2.5 pr-2 text-[13px] transition-colors"
          :class="section === n.key ? 'ix-active bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'"
          :aria-current="section === n.key ? 'page' : undefined"
          @click="section = n.key"
        >
          <Icon :name="n.icon" size="sm" :class="section === n.key ? 'text-[var(--brand)]' : ''" />
          <span class="truncate">{{ n.label }}</span>
        </button>
      </nav>

      <!-- System status block -->
      <div class="border-t border-border px-3 py-3">
        <div class="rounded-lg border border-border bg-card px-3 py-2.5">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span class="ix-live h-1.5 w-1.5 rounded-full" style="background: var(--nominal)" />
              <span class="ix-label">LINK NOMINAL</span>
            </span>
            <span class="font-mono text-[11px] tabular-nums text-muted-foreground">12 ms</span>
          </div>
          <div class="mt-1.5 flex items-center justify-between">
            <span class="ix-label-sm">BUILD</span>
            <span class="font-mono text-[11px] tabular-nums text-muted-foreground">v4.2.1·9f3a</span>
          </div>
        </div>

        <!-- Device switcher -->
        <button type="button" class="ix-lift mt-2.5 flex w-full items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-[13px] hover:bg-secondary">
          <span class="h-1.5 w-1.5 rounded-full" style="background: var(--nominal)" />
          <span class="flex-1 text-left">Skyhook-01</span>
          <Icon name="chevron-down" size="xs" class="text-muted-foreground" />
        </button>
      </div>
    </aside>

    <!-- ╭─ Main column ───────────────────────────────────────────╮ -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Status-strip topbar -->
      <header class="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/75 px-5 backdrop-blur">
        <span class="ix-label">OS</span>
        <span class="text-muted-foreground/40">/</span>
        <h1 class="text-[14px] font-medium tracking-tight">{{ sectionTitle }}</h1>
        <StatusBadge level="nominal" size="sm" dot class="ml-1">Connected</StatusBadge>
        <span class="font-mono text-[12px] tabular-nums text-muted-foreground">AuterionOS v4.2.1 · uptime 6d 04:12</span>
        <div class="ml-auto flex items-center gap-2">
          <div class="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5">
            <button
v-for="t in (['dark','light'] as const)" :key="t" type="button"
              class="rounded-md px-2.5 py-1 text-[12px] capitalize transition-colors"
              :class="theme === t ? 'bg-secondary text-foreground' : 'text-muted-foreground'"
              @click="theme = t">{{ t }}</button>
          </div>
          <Button variant="secondary" size="sm" class="gap-1.5"><Icon name="arrow-up" size="xs" /> Update</Button>
          <Button size="sm" class="gap-1.5"><Icon name="gear" size="xs" /> Configure</Button>
        </div>
      </header>

      <div class="flex-1 overflow-auto p-5">
        <!-- ════ OVERVIEW ════ -->
        <div v-if="section === 'overview'" class="mx-auto max-w-5xl space-y-4">
          <!-- device hero -->
          <section class="ix-panel overflow-hidden">
            <div class="grid gap-0 md:grid-cols-[1fr_auto]">
              <div class="p-6">
                <div class="ix-head">
                  <span class="ix-label">DEVICE</span>
                  <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">SN AX-3M3A6V</span>
                </div>
                <div class="mt-3 flex items-center gap-2">
                  <h2 class="text-[20px] font-semibold tracking-tight">Skynode X</h2>
                  <Badge variant="secondary" size="sm">VTOL · AVY Aera</Badge>
                  <StatusBadge level="caution" size="sm" variant="outline" dot>1 caution</StatusBadge>
                </div>
                <p class="mt-1 font-mono text-[12px] tabular-nums text-muted-foreground">FW v4.2.1 · MAVLink 2 · armed-ready</p>
                <div class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div><p class="ix-label">STATE</p><p class="mt-1 text-[15px] font-medium">Disarmed</p></div>
                  <div><p class="ix-label">BATTERY</p><p class="mt-1 font-mono text-[15px] tabular-nums">78%</p></div>
                  <div><p class="ix-label">SUBSYSTEMS</p><p class="mt-1 font-mono text-[15px] tabular-nums">8 / 8</p></div>
                  <div><p class="ix-label">LAST FLIGHT</p><p class="mt-1 text-[15px] font-medium">2h ago</p></div>
                </div>
                <div class="mt-5 flex gap-2">
                  <Button size="sm">Run diagnostics</Button>
                  <Button variant="secondary" size="sm">Restart services</Button>
                </div>
              </div>
              <!-- Skynode board visual -->
              <div class="hidden items-center justify-center border-l border-border px-8 md:flex" style="background: linear-gradient(160deg, color-mix(in oklab, var(--foreground) 6%, var(--card)), var(--card))">
                <svg viewBox="0 0 200 150" class="h-[150px] w-[210px]">
                  <rect x="42" y="28" width="116" height="94" rx="10" fill="color-mix(in oklab, var(--foreground) 9%, var(--card))" stroke="color-mix(in oklab, var(--foreground) 22%, transparent)" />
                  <rect x="74" y="54" width="52" height="42" rx="6" fill="color-mix(in oklab, var(--foreground) 16%, transparent)" />
                  <circle cx="100" cy="75" r="3" fill="var(--nominal)" />
                  <g stroke="color-mix(in oklab, var(--foreground) 30%, transparent)" stroke-width="2">
                    <line v-for="n in 6" :key="'t'+n" :x1="42 + n*17" y1="28" :x2="42 + n*17" y2="16" />
                    <line v-for="n in 6" :key="'b'+n" :x1="42 + n*17" y1="122" :x2="42 + n*17" y2="134" />
                  </g>
                  <text x="100" y="115" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8" fill="var(--muted-foreground)">SKYNODE X</text>
                </svg>
              </div>
            </div>
          </section>

          <!-- update banner -->
          <div class="ix-edge ix-edge-caution flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <Icon name="triangle-exclamation" size="sm" style="color: var(--caution)" />
            <div class="flex-1">
              <p class="text-[13px] font-medium">System update available</p>
              <p class="text-[12px] text-muted-foreground">MAVLink Router 2.1.0 — cellular failover fix · ~40 s · no reboot</p>
            </div>
            <Button variant="secondary" size="sm">Review & install</Button>
          </div>

          <!-- vitals gauges -->
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div v-for="v in vitals" :key="v.label" class="ix-panel p-4">
              <div class="ix-head">
                <span class="ix-label">{{ v.label }}</span>
                <StatusBadge :level="v.level" size="sm" variant="outline" :icon="false" dot class="ml-auto">{{ v.level === 'caution' ? 'Warm' : 'OK' }}</StatusBadge>
              </div>
              <div class="relative mx-auto mt-3 h-[104px] w-[104px]">
                <svg viewBox="0 0 100 100" class="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="color-mix(in oklab, var(--foreground) 8%, transparent)" stroke-width="5" />
                  <circle cx="50" cy="50" r="42" fill="none" :stroke="gaugeColor(v.level)" stroke-width="5" stroke-linecap="round" :stroke-dasharray="`${(v.value / 100) * C} ${C}`" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="font-mono text-[22px] font-semibold tabular-nums leading-none" :style="v.level !== 'nominal' ? `color: var(--${v.level})` : ''">{{ v.value }}</span>
                  <span class="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">{{ v.unit }}</span>
                </div>
              </div>
              <div class="ix-grid mt-2 h-7 rounded-md" style="color: var(--foreground)">
                <Sparkline :data="v.spark" :height="28" stroke="color-mix(in oklab, var(--foreground) 80%, transparent)" />
              </div>
              <p class="mt-1.5 text-center font-mono text-[11px] tabular-nums text-muted-foreground">{{ v.detail }}</p>
            </div>
          </div>

          <!-- topology -->
          <section class="ix-panel p-5">
            <div class="ix-head">
              <span class="ix-label">SYSTEM TOPOLOGY</span>
              <StatusBadge level="nominal" size="sm" variant="outline" :icon="false" dot class="ml-auto">All links nominal</StatusBadge>
            </div>
            <p class="mt-2 text-[12px] text-muted-foreground">Live bus — AuterionOS orchestrating every subsystem.</p>
            <div class="ix-plot relative mx-auto mt-3 h-[392px] w-full max-w-[720px] rounded-md">
              <svg viewBox="0 0 720 392" class="absolute inset-0 h-full w-full" aria-hidden="true">
                <line
v-for="n in nodes" :key="n.id" :x1="center.x" :y1="center.y" :x2="n.x" :y2="n.y"
                  :stroke="n.level === 'nominal' ? 'color-mix(in oklab, var(--foreground) 22%, transparent)' : `color-mix(in oklab, var(--${n.level}) 60%, transparent)`"
                  stroke-width="1.5" stroke-dasharray="3 5" />
              </svg>
              <!-- center: Skynode -->
              <div class="absolute flex flex-col items-center gap-1" :style="{ left: `${center.x / 720 * 100}%`, top: `${center.y / 392 * 100}%`, transform: 'translate(-50%,-50%)' }">
                <div class="flex h-16 w-16 items-center justify-center rounded-xl border border-border" style="background: linear-gradient(150deg, color-mix(in oklab, var(--foreground) 12%, var(--card)), var(--card))">
                  <Icon name="drone" size="lg" />
                </div>
                <span class="ix-label rounded-md bg-secondary px-2 py-0.5 text-foreground">SKYNODE</span>
              </div>
              <!-- subsystem nodes -->
              <div v-for="n in nodes" :key="n.id" class="absolute w-[124px]" :style="{ left: `${n.x / 720 * 100}%`, top: `${n.y / 392 * 100}%`, transform: 'translate(-50%,-50%)' }">
                <div class="ix-edge flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 shadow-sm" :class="n.level === 'nominal' ? '' : `ix-edge-${n.level}`">
                  <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary"><Icon :name="n.icon" size="xs" /></span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[12px] font-medium leading-tight">{{ n.label }}</p>
                    <p class="ix-label-sm truncate">{{ n.sub }}</p>
                  </div>
                  <span class="h-1.5 w-1.5 shrink-0 rounded-full" :style="{ background: `var(--${n.level})` }" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- ════ CONNECTIVITY ════ -->
        <div v-else-if="section === 'connectivity'" class="mx-auto max-w-3xl">
          <section class="ix-panel flex flex-col overflow-hidden">
            <div class="ix-head px-5 pt-3.5">
              <span class="ix-label">CONNECTIVITY</span>
              <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ links.length }} LINKS</span>
            </div>
            <div v-for="l in links" :key="l.name" class="ix-edge flex items-center gap-3 border-b border-border/60 px-5 py-4 last:border-b-0" :class="l.level === 'nominal' ? '' : `ix-edge-${l.level}`">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground"><Icon name="bars" size="sm" /></span>
              <div class="min-w-0 flex-1">
                <p class="text-[14px] font-medium">{{ l.name }}</p>
                <p class="text-[12px] text-muted-foreground">{{ l.sub }}</p>
              </div>
              <div class="text-right">
                <StatusBadge :level="l.level" size="sm" dot>{{ l.status }}</StatusBadge>
                <p class="mt-1 font-mono text-[12px] tabular-nums text-muted-foreground">{{ l.metric }}</p>
              </div>
              <Switch :model-value="l.status !== 'Idle'" />
            </div>
          </section>
        </div>

        <!-- ════ PAYLOADS ════ -->
        <div v-else-if="section === 'payloads'" class="mx-auto max-w-3xl">
          <section class="ix-panel flex flex-col overflow-hidden">
            <div class="ix-head px-5 pt-3.5">
              <span class="ix-label">PAYLOADS</span>
              <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ payloads.length }} BAYS</span>
            </div>
            <div v-for="p in payloads" :key="p.name" class="flex items-center gap-3 border-b border-border/60 px-5 py-4 last:border-b-0">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary" :class="p.on ? 'text-[var(--brand)]' : 'text-muted-foreground'"><Icon name="eye" size="sm" /></span>
              <div class="min-w-0 flex-1">
                <p class="text-[14px] font-medium">{{ p.name }}</p>
                <p class="text-[12px] text-muted-foreground">{{ p.sub }}</p>
              </div>
              <StatusBadge v-if="p.on" level="nominal" size="sm" variant="outline" :icon="false" dot>Ready</StatusBadge>
              <Switch v-model="p.on" />
            </div>
          </section>
        </div>

        <!-- ════ SAFETY ════ -->
        <div v-else-if="section === 'safety'" class="mx-auto max-w-3xl">
          <section class="ix-panel flex flex-col overflow-hidden">
            <div class="ix-head px-5 pt-3.5">
              <span class="ix-label">SAFETY</span>
              <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ safety.length }} GUARDS</span>
            </div>
            <div v-for="s in safety" :key="s.name" class="ix-edge flex items-center gap-3 border-b border-border/60 px-5 py-4 last:border-b-0" :class="s.on ? '' : 'ix-edge-caution'">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground"><Icon name="lock" size="sm" /></span>
              <div class="min-w-0 flex-1">
                <p class="text-[14px] font-medium">{{ s.name }}</p>
                <p class="text-[12px] text-muted-foreground">{{ s.sub }}</p>
              </div>
              <StatusBadge :level="s.on ? 'nominal' : 'caution'" size="sm" variant="outline" :icon="false" dot>{{ s.on ? 'Armed' : 'Off' }}</StatusBadge>
              <Switch v-model="s.on" />
            </div>
          </section>
        </div>

        <!-- ════ APPS ════ -->
        <div v-else-if="section === 'apps'" class="mx-auto max-w-3xl">
          <section class="ix-panel flex flex-col overflow-hidden">
            <div class="ix-head px-5 pt-3.5">
              <span class="ix-label">INSTALLED APPS</span>
              <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ apps.length }} PKG</span>
            </div>
            <div v-for="a in apps" :key="a.name" class="ix-edge ix-lift flex items-center gap-3 border-b border-border/60 px-5 py-4 last:border-b-0" :class="a.level === 'nominal' ? '' : `ix-edge-${a.level}`">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary"><Icon name="gear" size="sm" /></span>
              <div class="min-w-0 flex-1">
                <p class="text-[14px] font-medium">{{ a.name }}</p>
                <p class="font-mono text-[12px] tabular-nums text-muted-foreground">v{{ a.version }}</p>
              </div>
              <StatusBadge :level="a.level" size="sm" dot>{{ a.status }}</StatusBadge>
              <Button v-if="a.status === 'Update available'" variant="secondary" size="sm">Update</Button>
              <Button v-else variant="ghost" size="sm"><Icon name="ellipsis" size="xs" /></Button>
            </div>
          </section>
        </div>

        <!-- ════ LOGS ════ -->
        <div v-else class="mx-auto max-w-4xl">
          <section class="ix-panel flex flex-col overflow-hidden">
            <div class="ix-head px-4 pt-3.5">
              <span class="ix-label">SYSTEM LOG</span>
              <div class="ml-3 flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5">
                <button
v-for="f in (['all','warn','error'] as const)" :key="f" type="button"
                  class="rounded-md px-2.5 py-1 text-[12px] capitalize transition-colors"
                  :class="logFilter === f ? 'bg-secondary text-foreground' : 'text-muted-foreground'"
                  @click="logFilter = f">{{ f }}</button>
              </div>
              <span class="ml-auto flex items-center gap-1.5">
                <span class="ix-live h-1.5 w-1.5 rounded-full" style="background: var(--nominal)" />
                <span class="ix-label">STREAMING</span>
              </span>
            </div>
            <div class="max-h-[560px] overflow-auto py-1 font-mono text-[12px] leading-6">
              <div v-for="(l, i) in shownLogs" :key="i" class="ix-edge flex gap-3 px-4 py-0.5" :class="logEdge[l.lvl]">
                <span class="shrink-0 tabular-nums text-muted-foreground/70">{{ l.t }}</span>
                <span class="ix-label w-12 shrink-0" :style="{ color: logColor[l.lvl] }">{{ l.lvl }}</span>
                <span class="w-20 shrink-0 text-muted-foreground">{{ l.src }}</span>
                <span class="text-foreground">{{ l.msg }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.os-root {
  background-image: radial-gradient(color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px);
  background-size: 22px 22px;
}
</style>
