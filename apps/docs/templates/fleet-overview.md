<script setup>
const fleet = [
  { id: 'mx01', callsign: 'MX-01', level: 'nominal',  status: 'In mission', batt: 74, site: 'ZRH' },
  { id: 'mx02', callsign: 'MX-02', level: 'caution',  status: 'Wind hold',  batt: 41, site: 'MUC' },
  { id: 'mx03', callsign: 'MX-03', level: 'warning',  status: 'Battery low', batt: 18, site: 'ZRH' },
  { id: 'mx04', callsign: 'MX-04', level: 'alarm',    status: 'Link lost',  batt: 63, site: 'LON' },
  { id: 'mx05', callsign: 'MX-05', level: 'advisory', status: 'Returning',  batt: 88, site: 'ZRH' },
  { id: 'mx06', callsign: 'MX-06', level: 'nominal',  status: 'In mission', batt: 52, site: 'MUC' },
];
</script>

# Fleet overview

The whole-fleet glance — a status roll-up across the top, then a card per vehicle. Answers "how is the fleet, right now" before drilling into any one vehicle. Scales from a handful to a wall display.

<div class="vp-raw" style="margin:1.25rem 0; border:1px solid var(--border); border-radius:0.5rem; background:var(--background); padding:1rem; display:flex; flex-direction:column; gap:1rem;">
  <div style="display:flex; gap:1.5rem; flex-wrap:wrap; font-family:var(--font-mono);">
    <div style="display:flex; flex-direction:column;"><strong style="font-size:1.5rem; font-variant-numeric:tabular-nums;">6</strong><span style="font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted-foreground);">Active</span></div>
    <div style="display:flex; align-items:center; gap:0.875rem;"><div style="display:flex; align-items:center; gap:0.375rem;"><StatusBadge level="nominal" size="sm" dot>2</StatusBadge></div><div style="display:flex; align-items:center; gap:0.375rem;"><StatusBadge level="caution" size="sm" dot>1</StatusBadge></div><div style="display:flex; align-items:center; gap:0.375rem;"><StatusBadge level="warning" size="sm" dot>1</StatusBadge></div><div style="display:flex; align-items:center; gap:0.375rem;"><StatusBadge level="alarm" size="sm" dot>1</StatusBadge></div><div style="display:flex; align-items:center; gap:0.375rem;"><StatusBadge level="advisory" size="sm" dot>1</StatusBadge></div></div>
  </div>
  <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(13rem, 1fr)); gap:0.75rem;">
    <div v-for="v in fleet" :key="v.id" :style="{ border:'1px solid var(--border)', borderLeft:`3px solid ${v.level==='alarm' ? 'var(--alarm)' : 'var(--border)'}`, borderRadius:'0.375rem', padding:'0.75rem', background:'var(--card)', display:'flex', flexDirection:'column', gap:'0.5rem' }">
      <div style="display:flex; align-items:center; gap:0.5rem;"><code style="font-weight:600;">{{ v.callsign }}</code><div style="flex:1;"></div><span style="font-size:0.75rem; color:var(--muted-foreground);">{{ v.site }}</span></div>
      <StatusBadge :level="v.level" size="sm" dot>{{ v.status }}</StatusBadge>
      <div style="display:flex; align-items:center; gap:0.5rem;"><span style="font-size:0.75rem; color:var(--muted-foreground);">Battery</span><div style="flex:1;"></div><TelemetryValue :value="v.batt" unit="%" :precision="0" size="sm" :level="v.batt < 25 ? 'warning' : undefined" /></div>
    </div>
  </div>
</div>

## Composition

- **Roll-up** — the count + a `StatusBadge` tally by [severity level](/components/status-badge), so the fleet's health reads in one glance before any card.
- **Card grid** — a responsive `auto-fill` grid of compact [vehicle status cards](/patterns/vehicle-status-card); an `alarm` vehicle keeps a colored left edge (alarm-in-periphery) so it stands out across a dense grid.
- **Scales to a wall display** — wrap in `[data-register="operational"]` + a dark theme for an ops-room screen; the grid reflows to the viewport.
