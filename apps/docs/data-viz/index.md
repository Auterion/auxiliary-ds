# Data viz

A token-driven, theme- and color-blind-safe visualization layer (`@auxiliary/viz`) — the palettes plus a restrained chart set (sparkline, gauge, streaming time series). Charts render from tokens, so they follow the active theme and never invent their own colors.

## Why a separate palette

Chart series can't borrow from the **status ladder** — `alarm`/`warning`/`caution`/`advisory`/`nominal` reserve red, orange, yellow, cyan, and green, and a data series in those hues would read as an operational state. So the categorical palette lives in the **cool→magenta arc**, and because that's a narrow hue range, series are kept apart by **lightness** (the same "luminance hierarchy over saturation" rule that makes them survive color-blindness). A [build gate](/foundations/conformance) enforces all of this — distance from the status hues, mutual separation, and luminance spread.

## Categorical

For unordered series (vehicles, channels, categories). Five series, distinct in hue *and* lightness.

<div class="auxiliary-demo vp-raw" style="gap:0.75rem;">
  <div v-for="n in 5" :key="n" style="display:flex; flex-direction:column; align-items:center; gap:0.375rem;">
    <div :style="{ width:'3.5rem', height:'3.5rem', borderRadius:'0.5rem', background:`var(--viz-categorical-${n})`, boxShadow:'inset 0 0 0 1px color-mix(in oklch, var(--foreground) 12%, transparent)' }"></div>
    <code style="font-size:0.75rem;">{{ n }}</code>
  </div>
</div>

## Sequential

For ordered magnitude (low → high). A single-hue, monotonic-lightness ramp.

<div class="auxiliary-demo vp-raw" style="gap:0;">
  <div v-for="n in 5" :key="n" :style="{ width:'4rem', height:'2.5rem', background:`var(--viz-sequential-${n})`, boxShadow:'inset 0 0 0 1px color-mix(in oklch, var(--foreground) 8%, transparent)' }"></div>
</div>

## Diverging

For deviation around a midpoint (below ↔ baseline ↔ above). Distinct ends, a near-neutral middle.

<div class="auxiliary-demo vp-raw" style="gap:0;">
  <div v-for="n in 5" :key="n" :style="{ width:'4rem', height:'2.5rem', background:`var(--viz-diverging-${n})`, boxShadow:'inset 0 0 0 1px color-mix(in oklch, var(--foreground) 8%, transparent)' }"></div>
</div>

## Using the palette in code

```ts
import { categorical, categoricalVars, seriesColor, seriesVar } from '@auxiliary/viz';

categorical[0];        // resolved oklch — for canvas (uPlot) where CSS vars don't resolve
categoricalVars[0];    // "var(--viz-categorical-1)" — for SVG/DOM
seriesColor(7);        // wraps past the palette length (resolved)
seriesVar(7);          // wraps past the palette length (var ref)
```

Use the **resolved** values for canvas renderers (uPlot), the **`var(--viz-*)` references** for SVG/DOM (so a consumer could re-theme by overriding the custom properties). The charts here pick the right form automatically.

## The charts

- [**Sparkline**](/data-viz/sparkline) — inline trend, pairs with `TelemetryValue`.
- [**Gauge**](/data-viz/gauge) — single bounded value, number beside the dial.
- [**Time series**](/data-viz/time-series) — streaming, high-rate (uPlot).
