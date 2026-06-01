# Bars

A categorical bar chart — values compared across a handful of labelled categories (flights per site, payloads by type). Pure SVG (SSR-safe), token-driven.

<div class="auxiliary-demo vp-raw" style="gap:2rem; align-items:flex-end;">
  <Bars :values="[34, 21, 47, 18, 29]" :labels="['SFO','MUC','ZRH','LON','YUL']" label="Flights per site" />
</div>

```vue
<Bars :values="[34, 21, 47, 18, 29]" :labels="['SFO','MUC','ZRH','LON','YUL']" label="Flights per site" />
```

## One series vs. distinct categories

Default is a single color (one measured series). Set `colorByIndex` when the bars are genuinely distinct categories — each is drawn from the [categorical palette](/data-viz/).

<div class="auxiliary-demo vp-raw" style="gap:2rem; align-items:flex-end;">
  <Bars :values="[12, 19, 8, 15, 22]" color="var(--viz-categorical-2)" label="Single series" />
  <Bars :values="[12, 19, 8, 15, 22]" color-by-index label="By category" />
</div>

```vue
<Bars :values="[12, 19, 8, 15, 22]" color="var(--viz-categorical-2)" />
<Bars :values="[12, 19, 8, 15, 22]" color-by-index />
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `values` | `number[]` | — | Bar values; negatives clamp to zero height. |
| `labels` | `string[]` | `[]` | Category labels under the bars. |
| `width` / `height` | `number` | `260` / `140` | px. |
| `max` | `number` | auto | Y-axis max; defaults to the largest value. |
| `color` | `string` | `var(--viz-categorical-1)` | Single-series fill. |
| `colorByIndex` | `boolean` | `false` | Color each bar from the categorical palette. |
| `label` | `string` | — | Accessible name (else `aria-hidden`). |

## Notes

- For **ordered magnitude** (a sequence, low→high) prefer the gradient of a [sequential](/data-viz/) treatment; bars are for **discrete comparison**.
- For the **distribution** of many samples, use the [histogram](/data-viz/distribution), not bars.
- Like the other charts, a bar chart can't convey exact values to a screen reader — when precise figures matter, expose them in a table beside the chart.
