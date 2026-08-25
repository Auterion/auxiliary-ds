<script setup>
const flightCount = [42, 51, 47, 63, 58, 71, 66, 82];
const distance = [12, 18, 15, 22, 19, 28, 24, 31];
const hours = [3, 4, 4, 6, 5, 7, 6, 8];
</script>

# Dashboard

The overview screen — headline metrics up top, a primary visualization, and a recent-activity surface. Mirrors the AuterionSuite overview: stat cards with trend [sparklines](/data-viz/sparkline), then detail below. A Level-2 conventional surface (light by default).

<div class="vp-raw" style="margin:var(--spacing-5) var(--spacing-0); border:1px solid var(--border); border-radius:var(--radius-lg); background:var(--background); padding:var(--spacing-4); display:flex; flex-direction:column; gap:var(--spacing-4);">
  <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:var(--spacing-3);">
    <div style="border:1px solid var(--border); border-radius:var(--radius-lg); padding:var(--spacing-3.5); background:var(--card); display:flex; flex-direction:column; gap:var(--spacing-1.5);">
      <span style="font-size:0.75rem; color:var(--muted-foreground);">Flight count</span>
      <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:var(--spacing-2);">
        <strong style="font-size:1.5rem; font-variant-numeric:tabular-nums;">695</strong>
        <Sparkline :values="flightCount" :width="72" :height="28" area />
      </div>
      <span style="font-size:0.75rem; color:var(--nominal);">↑ 75% last 30 days</span>
    </div>
    <div style="border:1px solid var(--border); border-radius:var(--radius-lg); padding:var(--spacing-3.5); background:var(--card); display:flex; flex-direction:column; gap:var(--spacing-1.5);">
      <span style="font-size:0.75rem; color:var(--muted-foreground);">Flight distance</span>
      <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:var(--spacing-2);">
        <strong style="font-size:1.5rem; font-variant-numeric:tabular-nums;">678 km</strong>
        <Sparkline :values="distance" :width="72" :height="28" area color="var(--viz-categorical-2)" />
      </div>
      <span style="font-size:0.75rem; color:var(--nominal);">↑ 32% last 30 days</span>
    </div>
    <div style="border:1px solid var(--border); border-radius:var(--radius-lg); padding:var(--spacing-3.5); background:var(--card); display:flex; flex-direction:column; gap:var(--spacing-1.5);">
      <span style="font-size:0.75rem; color:var(--muted-foreground);">Flight hours</span>
      <div style="display:flex; align-items:flex-end; justify-content:space-between; gap:var(--spacing-2);">
        <strong style="font-size:1.5rem; font-variant-numeric:tabular-nums;">44 hr</strong>
        <Sparkline :values="hours" :width="72" :height="28" area color="var(--viz-categorical-3)" />
      </div>
      <span style="font-size:0.75rem; color:var(--nominal);">↑ 86% last 30 days</span>
    </div>
  </div>
  <div style="display:grid; grid-template-columns:2fr 1fr; gap:var(--spacing-3);">
    <div style="border:1px solid var(--border); border-radius:var(--radius-lg); padding:var(--spacing-3.5); background:var(--card);">
      <div style="font-size:0.8125rem; font-weight:500; margin-bottom:var(--spacing-2);">Flights per site</div>
      <Bars :values="[34, 21, 47, 18, 29]" :labels="['SFO','MUC','ZRH','LON','YUL']" :width="380" :height="120" label="Flights per site" />
    </div>
    <div style="border:1px solid var(--border); border-radius:var(--radius-lg); padding:var(--spacing-3.5); background:var(--card); display:flex; flex-direction:column; gap:var(--spacing-2);">
      <div style="font-size:0.8125rem; font-weight:500;">Fleet status</div>
      <div style="display:flex; flex-direction:column; gap:var(--spacing-2);">
        <div style="display:flex; align-items:center; gap:var(--spacing-2);"><StatusBadge level="nominal" size="sm" dot>Nominal</StatusBadge><span style="margin-left:auto; font-variant-numeric:tabular-nums;">38</span></div>
        <div style="display:flex; align-items:center; gap:var(--spacing-2);"><StatusBadge level="caution" size="sm" dot>Caution</StatusBadge><span style="margin-left:auto; font-variant-numeric:tabular-nums;">5</span></div>
        <div style="display:flex; align-items:center; gap:var(--spacing-2);"><StatusBadge level="warning" size="sm" dot>Warning</StatusBadge><span style="margin-left:auto; font-variant-numeric:tabular-nums;">2</span></div>
        <div style="display:flex; align-items:center; gap:var(--spacing-2);"><StatusBadge level="alarm" size="sm" dot>Alarm</StatusBadge><span style="margin-left:auto; font-variant-numeric:tabular-nums;">1</span></div>
      </div>
    </div>
  </div>
</div>

## Composition

- **Stat cards** — a label, a tabular figure, a trend `Sparkline`, and a delta line (`var(--nominal)` for positive). The cards are a simple `Card`-like composition; the trend uses the [viz palette](/data-viz/).
- **Primary viz** — a [`Bars`](/data-viz/bars) chart (or time series for live data); the side panel rolls up fleet status via the [status ladder](/components/status-badge).
- **Density** — wrap in `[data-register="operational"]` for a denser, console-style dashboard.
