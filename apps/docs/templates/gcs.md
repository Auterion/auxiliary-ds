<script setup>
import { ref, computed } from 'vue';
import { useAlertModel } from '@auxiliary/vue';

const fleet = [
  { id: 'mx01', callsign: 'MX-01', level: 'nominal',  heading: 32,  alt: 408, batt: 74, speed: 12.4, status: 'In mission' },
  { id: 'mx02', callsign: 'MX-02', level: 'caution',  heading: 110, alt: 122, batt: 41, speed: 8.1,  status: 'Wind hold' },
  { id: 'mx03', callsign: 'MX-03', level: 'warning',  heading: 200, alt: 95,  batt: 18, speed: 6.7,  status: 'Battery low' },
  { id: 'mx04', callsign: 'MX-04', level: 'alarm',    heading: 280, alt: 0,   batt: 63, speed: 0,    status: 'Link lost' },
];
const selectedId = ref('mx01');
const selected = computed(() => fleet.find((v) => v.id === selectedId.value) ?? fleet[0]);
const entityColor = (level) => `var(--${level})`;
const altTrend = [372, 388, 381, 396, 401, 399, 408];
const onMap = [
  { ...fleet[0], x: 40, y: 46 },
  { ...fleet[2], x: 64, y: 30 },
  { ...fleet[3], x: 52, y: 68 },
];

const degraded = ref(false);

const alerts = useAlertModel();
alerts.raise({ id: 'mx03-batt', level: 'warning', title: 'MX-03 battery low', message: '18% — RTL advised.' });
alerts.raise({ id: 'mx02-wind', level: 'caution', title: 'MX-02 crosswind 14 kn' });
</script>

# GCS layout

The full ground-control-station screen — the [operational console blocks](/patterns/operational-console) assembled into the standard layout: status bar across the top, fleet left, map center, inspector right, mission timeline + alerts along the bottom. Rendered in the **operational register on a dark theme** (`data-theme="dark" data-register="operational"`), the way it ships.

**Air-gap / degraded connectivity is a first-class state, not an edge case** — toggle the link to see the screen's degraded treatment.

<div class="vp-raw" style="margin:var(--spacing-5) var(--spacing-0);">
  <div
    data-theme="dark"
    data-register="operational"
    style="height:32rem; border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--background); color:var(--foreground); display:grid; grid-template-rows:auto 1fr auto; grid-template-columns:13rem 1fr 15rem; font-size:0.8125rem;"
  >
    <header style="grid-column:1 / -1; display:flex; align-items:center; gap:var(--spacing-3); padding:var(--spacing-0) var(--spacing-3); height:2.75rem; border-bottom:1px solid var(--border); background:var(--card);">
      <strong style="font-variant-numeric:tabular-nums;">{{ selected.callsign }}</strong>
      <StatusBadge v-if="!degraded" :level="selected.level" size="sm" dot>{{ selected.status }}</StatusBadge>
      <StatusBadge v-else level="alarm" size="sm" dot>Link lost</StatusBadge>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button style="display:inline-flex; align-items:center; gap:var(--spacing-1); padding:var(--spacing-0.75) var(--spacing-2); border:1px solid var(--border); border-radius:var(--radius-md); background:transparent; color:var(--foreground); font-size:0.75rem; cursor:pointer;">Position <Icon name="chevron-down" /></button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Position</DropdownMenuItem>
          <DropdownMenuItem>Hold</DropdownMenuItem>
          <DropdownMenuItem>Return to launch</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div style="flex:1;"></div>
      <div :style="{ display:'flex', gap:'var(--spacing-3)', alignItems:'center', opacity: degraded ? 0.4 : 1 }">
        <TelemetryValue label="Link" :value="-87" unit="dBm" :precision="0" size="sm" :level="degraded ? 'alarm' : 'caution'" />
        <TelemetryValue label="Sats" :value="degraded ? 0 : 14" :precision="0" size="sm" :level="degraded ? 'alarm' : 'nominal'" />
        <Gauge :value="selected.batt" unit="%" label="Battery" :size="38" :thickness="4" />
      </div>
      <Button variant="secondary" size="sm" @click="degraded = !degraded">{{ degraded ? 'Restore link' : 'Simulate link loss' }}</Button>
    </header>
    <nav aria-label="Fleet" style="grid-row:2; grid-column:1; border-right:1px solid var(--border); background:var(--card); overflow-y:auto; padding:var(--spacing-1.5);">
      <button
        v-for="v in fleet"
        :key="v.id"
        @click="selectedId = v.id"
        :aria-current="selectedId === v.id ? 'true' : undefined"
        :style="{ display:'flex', alignItems:'center', gap:'var(--spacing-2)', width:'100%', padding:'var(--spacing-1.5) var(--spacing-2)', border:'none', borderLeft:`3px solid ${v.level==='alarm' ? entityColor(v.level) : 'transparent'}`, background: selectedId===v.id ? 'var(--accent)' : 'transparent', cursor:'pointer', textAlign:'left', borderRadius:'var(--radius-sm)' }"
      >
        <svg width="14" height="14" viewBox="0 0 28 28" :style="{ transform:`rotate(${v.heading}deg)`, flexShrink:0 }" aria-hidden="true">
          <path d="M14 5 L20 22 L14 18 L8 22 Z" :fill="entityColor(v.level)" />
        </svg>
        <code style="font-size:0.75rem; font-weight:500;">{{ v.callsign }}</code>
        <div style="flex:1;"></div>
        <TelemetryValue :value="v.batt" unit="%" :precision="0" size="sm" />
      </button>
    </nav>
    <main style="grid-row:2; grid-column:2; position:relative; overflow:hidden; background:linear-gradient(135deg, var(--muted), var(--card));">
      <span style="position:absolute; top:0.5rem; left:0.625rem; font-size:0.6875rem; color:var(--muted-foreground);">Map slot — product-owned engine</span>
      <div v-if="degraded" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:color-mix(in oklch, var(--alarm) 12%, transparent);">
        <StatusBadge level="alarm" dot>Telemetry stale — last known positions</StatusBadge>
      </div>
      <div v-for="v in onMap" :key="v.id" :style="{ position:'absolute', left:v.x+'%', top:v.y+'%', transform:'translate(-50%,-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'var(--spacing-0.5)', opacity: degraded ? 0.45 : 1 }">
        <svg width="22" height="22" viewBox="0 0 28 28" :style="{ transform:`rotate(${v.heading}deg)` }" :aria-label="v.callsign">
          <circle cx="14" cy="14" r="12" fill="none" :stroke="entityColor(v.level)" stroke-width="2" :stroke-opacity="v.level==='alarm' ? 1 : 0.5" />
          <path d="M14 5 L20 22 L14 18 L8 22 Z" :fill="entityColor(v.level)" />
        </svg>
        <code style="font-size:0.5625rem; background:var(--card); padding:var(--spacing-0) var(--spacing-0.5); border-radius:var(--radius-xs);">{{ v.callsign }}</code>
      </div>
    </main>
    <aside aria-label="Inspector" style="grid-row:2; grid-column:3; border-left:1px solid var(--border); background:var(--card); overflow-y:auto; padding:var(--spacing-3); display:flex; flex-direction:column; gap:var(--spacing-2.5);">
      <div style="display:flex; align-items:center; gap:var(--spacing-2);"><strong>{{ selected.callsign }}</strong></div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--spacing-2);">
        <TelemetryValue label="Altitude" :value="selected.alt" unit="m" :precision="0" size="sm" />
        <TelemetryValue label="Heading" :value="selected.heading" unit="°" :precision="0" size="sm" />
        <TelemetryValue label="Battery" :value="selected.batt" unit="%" :precision="0" size="sm" :level="selected.batt < 25 ? 'warning' : undefined" />
        <TelemetryValue label="Speed" :value="selected.speed" unit="m/s" size="sm" />
      </div>
      <CoordinateValue :lat="47.3977" :lon="8.5456" format="dms" show-format-tag />
      <div style="display:flex; align-items:center; gap:var(--spacing-2);">
        <span style="font-size:0.6875rem; color:var(--muted-foreground);">Alt</span>
        <Sparkline :values="altTrend" :width="110" :height="22" />
      </div>
    </aside>
    <footer style="grid-column:1 / -1; display:flex; align-items:center; gap:var(--spacing-4); padding:var(--spacing-2) var(--spacing-3); border-top:1px solid var(--border); background:var(--card);">
      <div style="flex:1; display:flex; flex-direction:column; gap:var(--spacing-1);">
        <div style="display:flex; justify-content:space-between; font-size:0.6875rem; color:var(--muted-foreground);"><span>Mission elapsed 0:19</span><span>Waypoint 3 / 5</span></div>
        <Progress :value="62" />
      </div>
      <AlertAnnunciator :model="alerts" />
    </footer>
  </div>
</div>

## What it assembles

| Region | Block |
|---|---|
| Top | [Operational status bar](/patterns/operational-console#operational-status-bar) — identity, mode, vitals, battery gauge |
| Left | [Fleet panel](/patterns/operational-console#fleet-panel) — roster, alarm-in-periphery, drives the inspector |
| Center | Map slot + [entity overlay](/patterns/operational-console#entity-grammar) (engine product-owned) |
| Right | [Inspector](/patterns/operational-console#inspector-panel) — telemetry, coordinate, altitude trend |
| Bottom | Mission timeline (`Progress`) + the [alert annunciator](/components/alert-model) |

## Degraded / air-gap as a state

Toggling **Simulate link loss** shows the degraded treatment the field demands: the vehicle reads `Link lost`, vitals dim and flip to `alarm`, the map marks telemetry **stale (last-known positions)** rather than hiding it, and the annunciator carries the condition. A GCS that goes blank on disconnect is dangerous — the operator must still see the last truth and know it's stale. This is why offline is designed, not bolted on.

## Notes

- **Operational skin.** The frame sets `data-theme="dark" data-register="operational"` — dense control heights, tight radii, restrained motion. Swap to `darknight` for night operations (the scotopic, low-blue palette).
- **No full-page scroll.** Each region scrolls within the fixed shell (the [app-shell](/patterns/app-shell) rule).
- **Destructive actions** (arm, RTL, payload) compose [`GuardedAction`](/components/guarded-action); the map engine and video are product-owned slots.
- Siblings to come (§6.4 slice 8): mission-planning, fleet/asset overview, post-flight review.
