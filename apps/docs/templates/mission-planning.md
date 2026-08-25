<script setup>
const waypoints = [
  { n: 1, x: 22, y: 70, alt: 60,  action: 'Takeoff' },
  { n: 2, x: 40, y: 38, alt: 120, action: 'Survey' },
  { n: 3, x: 66, y: 30, alt: 120, action: 'Survey' },
  { n: 4, x: 78, y: 62, alt: 80,  action: 'Photo' },
  { n: 5, x: 50, y: 80, alt: 0,   action: 'Land' },
];
const path = waypoints.map((w) => `${w.x * 4.8},${w.y * 2.4}`).join(' ');
</script>

# Mission planning

The plan-before-you-fly screen — a map to lay out the route, a waypoint list with per-leg parameters, and the mission-wide settings. The map engine is product-owned; the design system provides the planning chrome and the overlay.

<div class="vp-raw" style="margin:var(--spacing-5) var(--spacing-0); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; background:var(--background); display:grid; grid-template-rows:auto 1fr; grid-template-columns:1fr 15rem; height:26rem;">
  <header style="grid-column:1 / -1; display:flex; align-items:center; gap:var(--spacing-4); padding:var(--spacing-2.5) var(--spacing-3.5); border-bottom:1px solid var(--border); background:var(--card); flex-wrap:wrap;">
    <strong>Survey — North field</strong>
    <Separator orientation="vertical" style="height:1.25rem;" />
    <TelemetryValue label="Default alt" :value="120" unit="m" :precision="0" size="sm" />
    <TelemetryValue label="Speed" :value="8" unit="m/s" :precision="0" size="sm" />
    <TelemetryValue label="Est. time" :value="14" unit="min" :precision="0" size="sm" />
    <div style="flex:1;"></div>
    <Button variant="ghost" size="sm">Simulate</Button>
    <Button variant="primary" size="sm">Upload mission</Button>
  </header>
  <main style="grid-row:2; grid-column:1; position:relative; overflow:hidden; background:linear-gradient(135deg, var(--muted), var(--card));">
    <span style="position:absolute; top:0.5rem; left:0.625rem; font-size:0.6875rem; color:var(--muted-foreground);">Map slot — product-owned engine</span>
    <svg viewBox="0 0 480 240" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%;"><polyline :points="path" fill="none" stroke="var(--primary)" stroke-width="2" stroke-dasharray="6 4" /></svg>
    <div v-for="w in waypoints" :key="w.n" :style="{ position:'absolute', left:w.x+'%', top:w.y+'%', transform:'translate(-50%,-50%)', display:'flex', alignItems:'center', justifyContent:'center', width:'1.5rem', height:'1.5rem', borderRadius:'var(--radius-full)', background:'var(--primary)', color:'var(--primary-foreground)', fontSize:'0.75rem', fontWeight:'600', fontFamily:'var(--font-mono)' }">{{ w.n }}</div>
  </main>
  <aside aria-label="Waypoints" style="grid-row:2; grid-column:2; border-left:1px solid var(--border); background:var(--card); overflow-y:auto;">
    <div style="padding:var(--spacing-2) var(--spacing-3); font-size:0.75rem; color:var(--muted-foreground); border-bottom:1px solid var(--border);">WAYPOINTS</div>
    <div v-for="w in waypoints" :key="w.n" style="display:flex; align-items:center; gap:var(--spacing-2); padding:var(--spacing-2) var(--spacing-3); border-bottom:1px solid var(--border);">
      <code style="display:inline-flex; align-items:center; justify-content:center; width:1.25rem; height:1.25rem; border-radius:var(--radius-full); background:var(--muted); font-size:0.6875rem;">{{ w.n }}</code>
      <div style="flex:1;"><div style="font-size:0.8125rem; font-weight:500;">{{ w.action }}</div><div style="font-size:0.75rem; color:var(--muted-foreground); font-variant-numeric:tabular-nums;">{{ w.alt }} m</div></div>
    </div>
  </aside>
</div>

## Composition

- **Map + path overlay** — the planned route is a dashed `polyline` through numbered waypoint markers, drawn over the product map slot (same overlay grammar as the [operational console](/patterns/operational-console)).
- **Waypoint list** — each leg's action + altitude; in production these are editable (`NumberField` for altitude/speed, `Select` for the action) and reorderable.
- **Mission params + actions** — defaults in the header; `Simulate` is reversible, `Upload mission` is the commit. A destructive re-plan would compose [`GuardedAction`](/components/guarded-action).
