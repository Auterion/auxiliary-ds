# Sparkline

An inline trend line — the smallest chart. It carries shape, not exact values, so it pairs with a [`TelemetryValue`](/components/telemetry-value) that carries the number. Pure SVG (SSR-safe), token-driven stroke.

<div class="auxiliary-demo vp-raw" style="gap:2rem; align-items:center;">
  <Sparkline :values="[3, 7, 4, 9, 6, 11, 8, 13]" label="Throughput trend" />
  <Sparkline :values="[3, 7, 4, 9, 6, 11, 8, 13]" area label="Throughput trend, filled" />
</div>

```vue
<Sparkline :values="[3, 7, 4, 9, 6, 11, 8, 13]" label="Throughput trend" />
<Sparkline :values="[3, 7, 4, 9, 6, 11, 8, 13]" area label="Throughput trend" />
```

## Paired with a readout

The intended composition — the sparkline shows the shape, the `TelemetryValue` carries the number:

<div class="auxiliary-demo vp-raw" style="gap:0.75rem; align-items:center;">
  <TelemetryValue label="Throughput" :value="13.2" unit="MB/s" trend="up" />
  <Sparkline :values="[3, 7, 4, 9, 6, 11, 8, 13]" :width="80" :height="28" />
</div>

```vue
<TelemetryValue label="Throughput" :value="13.2" unit="MB/s" trend="up" />
<Sparkline :values="[3, 7, 4, 9, 6, 11, 8, 13]" :width="80" :height="28" />
```

## Series colors

Default is the first viz series; override with any color or `var(--viz-categorical-*)`.

<div class="auxiliary-demo vp-raw" style="gap:1.5rem; align-items:center;">
  <Sparkline :values="[5, 3, 8, 4, 9, 6, 10]" color="var(--viz-categorical-2)" label="Series 2" />
  <Sparkline :values="[5, 3, 8, 4, 9, 6, 10]" color="var(--viz-categorical-4)" label="Series 4" />
</div>

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `values` | `number[]` | — | The series. A flat or single-point series draws a centered line. |
| `width` / `height` | `number` | `120` / `32` | SVG box. |
| `area` | `boolean` | `false` | Fill under the line at low opacity. |
| `color` | `string` | `var(--viz-categorical-1)` | Any CSS color or var. |
| `label` | `string` | — | Accessible name. **Without it the sparkline is `aria-hidden`** — fine when an adjacent readout carries the value. |

## Accessibility

Decorative by default (`aria-hidden`) on the assumption a `TelemetryValue` beside it announces the number. Pass `label` to make it a standalone `role="img"` with an accessible name. A sparkline can't convey exact values to a screen reader — when the numbers matter, expose them in adjacent text or a table, not the line alone.
