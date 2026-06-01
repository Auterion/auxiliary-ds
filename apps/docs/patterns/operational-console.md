<script setup>
import { ref, computed } from 'vue';
import { useAlertModel } from '@auxiliary/vue';

const fleet = [
  { id: 'mx01', callsign: 'MX-01', level: 'nominal',  heading: 32,  alt: 408, batt: 74, status: 'In mission' },
  { id: 'mx02', callsign: 'MX-02', level: 'caution',  heading: 110, alt: 122, batt: 41, status: 'Wind hold' },
  { id: 'mx03', callsign: 'MX-03', level: 'warning',  heading: 200, alt: 95,  batt: 18, status: 'Battery low' },
  { id: 'mx04', callsign: 'MX-04', level: 'alarm',    heading: 280, alt: 0,   batt: 63, status: 'Link lost' },
  { id: 'mx05', callsign: 'MX-05', level: 'advisory', heading: 60,  alt: 210, batt: 88, status: 'Returning' },
];
const selectedId = ref('mx01');
const selected = computed(() => fleet.find((v) => v.id === selectedId.value));
const entityColor = (level) => `var(--${level})`;
const altTrend = [372, 388, 381, 396, 401, 399, 408];

// Map entities at fixed positions over the placeholder.
const onMap = [
  { ...fleet[0], x: 38, y: 44 },
  { ...fleet[2], x: 62, y: 30 },
  { ...fleet[3], x: 54, y: 66 },
];

const alerts = useAlertModel();
alerts.raise({ id: 'mx04-link', level: 'alarm', title: 'MX-04 link lost', message: 'No telemetry for >3s.' });
alerts.raise({ id: 'mx03-batt', level: 'warning', title: 'MX-03 battery low', message: '18% — RTL advised.' });
alerts.raise({ id: 'mx02-wind', level: 'caution', title: 'MX-02 crosswind 14 kn' });
</script>

# Operational console

The blocks a ground-control / C2 surface is built from — composed from existing primitives and the [data-viz](/data-viz/) charts, arranged by the [operational layout model](#the-model). This page documents each block; the [GCS template](/patterns/) (slice 8) assembles them into a full screen.

> Grounded in Auterion **Mission Control** (see `.claude/docs/auterion-product-inventory.md`). Mission Control is a Qt/QML app, so these are distillations of its *patterns* into the Auxiliary web vocabulary, not ports.

## Operational status bar

The persistent top strip: vehicle identity + state, flight mode, and the vital telemetry an operator scans continuously — link, power, INS, battery. Numbers are `TelemetryValue` (mono, tabular); the battery is a [`Gauge`](/data-viz/gauge); state is a `StatusBadge`; mode is a `DropdownMenu`.

<div class="auxiliary-demo vp-raw" style="padding:0;">
  <div style="display:flex; align-items:center; gap:1rem; width:100%; padding:0.625rem 1rem; background:var(--card); border-radius:0.5rem; flex-wrap:wrap;">
    <strong style="font-variant-numeric:tabular-nums;">MX-01</strong>
    <StatusBadge level="nominal" size="sm" dot>In mission</StatusBadge>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button style="display:inline-flex; align-items:center; gap:0.375rem; padding:0.25rem 0.5rem; border:1px solid var(--border); border-radius:0.375rem; background:transparent; color:var(--foreground); font-size:0.8125rem; cursor:pointer;">Position <Icon name="chevron-down" /></button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Position</DropdownMenuItem>
        <DropdownMenuItem>Hold</DropdownMenuItem>
        <DropdownMenuItem>Return to launch</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div style="flex:1;"></div>
    <TelemetryValue label="Link" :value="-87" unit="dBm" :precision="0" size="sm" level="caution" />
    <TelemetryValue label="Power" :value="6.1" unit="W" size="sm" />
    <TelemetryValue label="Sats" :value="14" :precision="0" size="sm" level="nominal" />
    <Gauge :value="74" unit="%" label="Battery" :size="44" :thickness="5" />
  </div>
</div>

## Entity grammar

Every vehicle reads the same way on the map and in the fleet list: a **heading-rotated marker**, a **status halo** (color *and* the persistent badge — never color alone), a **callsign** in mono, and adjacent **readouts**. This repeated unit is the strongest candidate to extract into an `EntityIcon` component — flagged for follow-up; documented here as the composition.

<div class="auxiliary-demo vp-raw" style="gap:2rem;">
  <div v-for="v in fleet" :key="v.id" style="display:flex; flex-direction:column; align-items:center; gap:0.25rem;">
    <svg width="28" height="28" viewBox="0 0 28 28" :style="{ transform:`rotate(${v.heading}deg)` }" role="img" :aria-label="`${v.callsign} heading ${v.heading}°`">
      <circle cx="14" cy="14" r="12" fill="none" :stroke="entityColor(v.level)" stroke-width="2" :stroke-opacity="v.level==='alarm' ? 1 : 0.5" />
      <path d="M14 5 L20 22 L14 18 L8 22 Z" :fill="entityColor(v.level)" />
    </svg>
    <code style="font-size:0.6875rem;">{{ v.callsign }}</code>
  </div>
</div>

## Fleet panel

The roster, **alarm in the periphery**: an alarm-level row carries a colored left edge that's visible while the operator's eye is on the inspector. Click a row to select it (drives the inspector below).

<div class="auxiliary-demo vp-raw" style="padding:0;">
  <div style="width:100%; max-width:24rem; border:1px solid var(--border); border-radius:0.5rem; overflow:hidden; background:var(--card);">
    <button
      v-for="v in fleet"
      :key="v.id"
      @click="selectedId = v.id"
      :aria-current="selectedId === v.id ? 'true' : undefined"
      :style="{
        display:'flex', alignItems:'center', gap:'0.625rem', width:'100%', padding:'0.5rem 0.75rem',
        border:'none', borderLeft:`3px solid ${v.level==='alarm' ? entityColor(v.level) : 'transparent'}`,
        background: selectedId===v.id ? 'var(--accent)' : 'transparent', cursor:'pointer', textAlign:'left',
      }"
    >
      <svg width="18" height="18" viewBox="0 0 28 28" :style="{ transform:`rotate(${v.heading}deg)`, flexShrink:0 }" aria-hidden="true">
        <path d="M14 5 L20 22 L14 18 L8 22 Z" :fill="entityColor(v.level)" />
      </svg>
      <code style="font-size:0.8125rem; font-weight:500;">{{ v.callsign }}</code>
      <StatusBadge :level="v.level" size="sm" dot>{{ v.status }}</StatusBadge>
      <div style="flex:1;"></div>
      <TelemetryValue :value="v.batt" unit="%" :precision="0" size="sm" />
    </button>
  </div>
</div>

## Inspector panel

The selected entity in detail — telemetry grid, position as a [`CoordinateValue`](/components/coordinate-value), and an altitude [`Sparkline`](/data-viz/sparkline).

<div class="auxiliary-demo vp-raw" style="padding:0;">
  <div style="width:100%; max-width:22rem; border:1px solid var(--border); border-radius:0.5rem; background:var(--card); padding:1rem; display:flex; flex-direction:column; gap:0.75rem;">
    <div style="display:flex; align-items:center; gap:0.5rem;">
      <strong>{{ selected.callsign }}</strong>
      <StatusBadge :level="selected.level" size="sm" dot>{{ selected.status }}</StatusBadge>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem 1rem;">
      <TelemetryValue label="Altitude" :value="selected.alt" unit="m" :precision="0" size="sm" />
      <TelemetryValue label="Heading" :value="selected.heading" unit="°" :precision="0" size="sm" />
      <TelemetryValue label="Battery" :value="selected.batt" unit="%" :precision="0" size="sm" :level="selected.batt < 25 ? 'warning' : undefined" />
      <TelemetryValue label="Speed" :value="12.4" unit="m/s" size="sm" />
    </div>
    <CoordinateValue :lat="47.3977" :lon="8.5456" format="dms" show-format-tag />
    <div style="display:flex; align-items:center; gap:0.5rem;">
      <span style="font-size:0.75rem; color:var(--muted-foreground);">Alt trend</span>
      <Sparkline :values="altTrend" :width="120" :height="24" />
    </div>
  </div>
</div>

## Alert feed

The prioritized, acknowledgeable condition stack — this is the [alert model](/components/alert-model) (`useAlertModel` + `AlertManager`), not a pile of toasts.

<div class="auxiliary-demo vp-raw" style="padding:0;">
  <AlertManager :model="alerts" :max="4" style="width:100%; max-width:28rem;" />
</div>

## Map + overlay

The map engine is **product-owned** (no mapping engine ships in the design system) — the console provides a labelled slot and the **overlay grammar** drawn over it: entities positioned by coordinate, using the same marker as the fleet.

<div class="auxiliary-demo vp-raw" style="padding:0;">
  <div role="img" aria-label="Map view with three vehicles" style="position:relative; width:100%; height:16rem; border:1px solid var(--border); border-radius:0.5rem; overflow:hidden; background:linear-gradient(135deg, var(--muted), var(--card));">
    <span style="position:absolute; top:0.5rem; left:0.625rem; font-size:0.75rem; color:var(--muted-foreground);">Map slot — product-owned engine</span>
    <div v-for="v in onMap" :key="v.id" :style="{ position:'absolute', left:v.x+'%', top:v.y+'%', transform:'translate(-50%,-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }">
      <svg width="24" height="24" viewBox="0 0 28 28" :style="{ transform:`rotate(${v.heading}deg)` }" :aria-label="v.callsign">
        <circle cx="14" cy="14" r="12" fill="none" :stroke="entityColor(v.level)" stroke-width="2" :stroke-opacity="v.level==='alarm' ? 1 : 0.5" />
        <path d="M14 5 L20 22 L14 18 L8 22 Z" :fill="entityColor(v.level)" />
      </svg>
      <code style="font-size:0.625rem; background:var(--card); padding:0 2px; border-radius:2px;">{{ v.callsign }}</code>
    </div>
  </div>
</div>

> **Parked (see the inventory doc):** the real basemap is satellite/terrain imagery, not a flat fill — entity halos, labels, and any [map-linked viz](/data-viz/) will need scrims/outlines to stay legible over high-variance imagery. Addressed when the map-block work lands.

## The model

These blocks slot into the standard operational layout — status bar across the top, fleet panel left, map center, inspector right, timeline/alerts along the bottom — documented in `ROADMAP.md` §6.4. Destructive commands in any of them compose [`GuardedAction`](/components/guarded-action); none re-solve confirmation locally.
