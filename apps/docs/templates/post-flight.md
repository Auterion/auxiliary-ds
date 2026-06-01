<script setup>
const altProfile = [0, 60, 95, 120, 120, 118, 121, 119, 120, 90, 60, 30, 0];
const events = [
  { t: '00:00', event: 'Armed and took off', level: 'nominal' },
  { t: '02:14', event: 'Reached survey altitude', level: 'nominal' },
  { t: '08:41', event: 'Crosswind exceeded 12 kn', level: 'caution' },
  { t: '11:03', event: 'Battery below 30%', level: 'warning' },
  { t: '13:52', event: 'Returned and landed', level: 'nominal' },
];
</script>

# Post-flight review

The after-action screen — what happened on the flight: headline metrics, the altitude profile, and the event log. Read-only analysis, built from the same telemetry and the [data-viz](/data-viz/) layer.

<div class="vp-raw" style="margin:1.25rem 0; border:1px solid var(--border); border-radius:0.5rem; background:var(--background); padding:1rem; display:flex; flex-direction:column; gap:1rem;">
  <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
    <strong>MX-01 — Survey, North field</strong>
    <StatusBadge level="nominal" size="sm" dot>Completed</StatusBadge>
    <div style="flex:1;"></div>
    <Button variant="ghost" size="sm">Export log</Button>
  </div>
  <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.75rem;">
    <div style="border:1px solid var(--border); border-radius:0.375rem; padding:0.75rem; background:var(--card);"><div style="font-size:0.75rem; color:var(--muted-foreground);">Duration</div><strong style="font-size:1.25rem; font-variant-numeric:tabular-nums;">13:52</strong></div>
    <div style="border:1px solid var(--border); border-radius:0.375rem; padding:0.75rem; background:var(--card);"><div style="font-size:0.75rem; color:var(--muted-foreground);">Distance</div><strong style="font-size:1.25rem; font-variant-numeric:tabular-nums;">4.2 km</strong></div>
    <div style="border:1px solid var(--border); border-radius:0.375rem; padding:0.75rem; background:var(--card);"><div style="font-size:0.75rem; color:var(--muted-foreground);">Max altitude</div><strong style="font-size:1.25rem; font-variant-numeric:tabular-nums;">121 m</strong></div>
    <div style="border:1px solid var(--border); border-radius:0.375rem; padding:0.75rem; background:var(--card);"><div style="font-size:0.75rem; color:var(--muted-foreground);">Battery used</div><strong style="font-size:1.25rem; font-variant-numeric:tabular-nums;">62 %</strong></div>
  </div>
  <div style="border:1px solid var(--border); border-radius:0.375rem; padding:0.875rem; background:var(--card);">
    <div style="font-size:0.8125rem; font-weight:500; margin-bottom:0.5rem;">Altitude profile</div>
    <Sparkline :values="altProfile" :width="560" :height="80" area label="Altitude profile over the flight" />
  </div>
  <div style="border:1px solid var(--border); border-radius:0.375rem; overflow:hidden; background:var(--card);">
    <Table>
      <TableHeader><TableRow><TableHead scope="col">Time</TableHead><TableHead scope="col">Event</TableHead><TableHead scope="col">Level</TableHead></TableRow></TableHeader>
      <TableBody>
        <TableRow v-for="(e, i) in events" :key="i">
          <TableHead scope="row" style="font-variant-numeric:tabular-nums; font-weight:500;">{{ e.t }}</TableHead>
          <TableCell>{{ e.event }}</TableCell>
          <TableCell><StatusBadge :level="e.level" size="sm" dot>{{ e.level }}</StatusBadge></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</div>

## Composition

- **Headline metrics** — the flight's totals as tabular stat cards (same shape as the [dashboard](/templates/dashboard)).
- **Altitude profile** — a wide [`Sparkline`](/data-viz/sparkline) (or a [time series](/data-viz/time-series) for scrubbable detail) of the recorded track.
- **Event log** — a `Table` of timestamped events, each tagged with its [severity level](/components/status-badge); this is the dismissible *history*, distinct from the live alert model.
- Read-only by design — the actions are export/share, not edit.
