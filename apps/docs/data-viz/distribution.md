<script setup>
// A right-skewed sample (e.g. latencies): mostly low, a long tail. Seeded (not
// Math.random) so the SSR render and the client match — no hydration mismatch.
let seed = 1337;
const rand = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const samples = Array.from({ length: 600 }, () => Math.round(20 + -Math.log(1 - rand()) * 30));
</script>

# Distribution

A histogram — the *shape* of a sample set, not individual values. Bins raw samples into equal-width buckets and renders them as adjacent bars, so skew, spread, and modes read at a glance (flight-duration spread, latency distribution, battery-at-landing). Pure SVG (SSR-safe), token-driven.

<div class="auxiliary-demo vp-raw">
  <Distribution :values="samples" :bins="24" :width="420" :height="160" label="Latency distribution (ms)" />
</div>

```vue
<script setup>
import { Distribution } from '@auxiliary/viz';
// raw samples — the component does the binning
const samples = await fetchLatencies();
</script>

<template>
  <Distribution :values="samples" :bins="24" label="Latency distribution (ms)" />
</template>
```

## Bin count

Fewer bins smooth the shape; more bins show detail (at the cost of noise). Pick for the story, not the data size.

<div class="auxiliary-demo vp-raw" style="gap:2rem;">
  <Distribution :values="samples" :bins="8" :width="220" :height="120" label="8 bins" />
  <Distribution :values="samples" :bins="40" :width="220" :height="120" label="40 bins" />
</div>

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `values` | `number[]` | — | Raw samples; the component bins them. |
| `bins` | `number` | `12` | Equal-width buckets over `[min, max]`. |
| `width` / `height` | `number` | `260` / `140` | px. |
| `color` | `string` | `var(--viz-sequential-3)` | Bar fill. |
| `label` | `string` | — | Accessible name (else `aria-hidden`). |

## Notes

- Bars are **adjacent** (a tiny gap) so the distribution reads as a continuous shape — distinct from the spaced [Bars](/data-viz/bars) chart, which compares discrete categories.
- For a single value against a range use a [Gauge](/data-viz/gauge); for change over time use a [Time series](/data-viz/time-series).
