# Gauge

A radial dial for a single bounded value — battery, CPU, signal, fuel. The **number sits beside the graphic** in tabular figures (the operational "numbers before graphics" rule: the digit is faster and more precise than the arc in a critical moment), and ARIA `meter` semantics announce the value without reading the dial.

<div class="auxiliary-demo vp-raw" style="gap:2rem; align-items:center;">
  <Gauge :value="74" unit="%" label="Battery" />
  <Gauge :value="23" unit="%" label="CPU" color="var(--viz-categorical-3)" />
  <Gauge :value="9300" :max="12000" unit="" label="RPM" :size="120" color="var(--viz-categorical-2)" />
</div>

```vue
<Gauge :value="74" unit="%" label="Battery" />
<Gauge :value="23" unit="%" label="CPU" color="var(--viz-categorical-3)" />
<Gauge :value="9300" :max="12000" label="RPM" :size="120" />
```

## Props

<PropsTable name="Gauge" />

## When to use

- A **single** value against a range, where "how full / how close to the limit" reads at a glance — battery, tank, utilization.
- **Not** for a trend over time (use a [sparkline](/data-viz/sparkline) or [time series](/data-viz/time-series)) or for comparing many series (use bars).
- For an operational threshold (battery low, temp high), pair the gauge with a [`StatusBadge`](/components/status-badge) or drive `color` from the status level — the gauge itself stays a neutral readout.

## Accessibility

Renders as an ARIA `meter` with `aria-valuenow` / `valuemin` / `valuemax` / `valuetext` (`"74 %"`) and the `label` as its accessible name, so assistive tech announces the value without interpreting the arc. The visible number is the same figure, in `tabular-nums` so it doesn't jitter as it updates.
