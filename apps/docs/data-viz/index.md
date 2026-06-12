# Data viz

A token-driven, theme- and color-blind-safe visualization layer (`@auxiliary/viz`) — the palettes plus a restrained chart set (sparkline, gauge, streaming time series). Charts render from tokens, so they follow the active theme and never invent their own colors.

## Why a separate palette

The palette is **per-theme**: the same `--viz-*` variable re-resolves under `[data-theme]`, so each theme carries its own realization of one brand-anchored identity — series 1 is always Auterion ultramarine, and the sweep walks the cool→magenta arc plus a warm-neutral stone (the blue–yellow axis is what survives red-green color-blindness). **Darknight is the deliberate exception**: the blue-energy cap rules out the cool sweep entirely, so night charts switch to a warm scale whose series identity rides on an enforced **lightness ladder** — the same brightness-as-meaning rule as the darknight status ladder. Chart series never borrow from the **status ladder** (`alarm`…`nominal` reserve their hues; a series in those colors would read as an operational state). A [token gate](/foundations/conformance) enforces all of it per theme — contrast floors against background *and* card, mutual ΔE separation **including simulated protanopia/deuteranopia/tritanopia**, distance from every status fill, and monotonic sequential ramps.

## Categorical

For unordered series (vehicles, channels, categories). Five series, distinct in hue *and* lightness.

<div class="auxiliary-demo vp-raw" style="gap:0.75rem;">
  <div v-for="n in 6" :key="n" style="display:flex; flex-direction:column; align-items:center; gap:0.375rem;">
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

categorical[0];        // LIGHT-theme resolved oklch — static/SSR fallback only
// For canvas (uPlot), resolve at runtime against the host element instead:
// resolveScale(hostEl, 'categorical') — honors scoped [data-theme]; pair with observeTheme()
categoricalVars[0];    // "var(--viz-categorical-1)" — for SVG/DOM
seriesColor(7);        // wraps past the palette length (resolved)
seriesVar(7);          // wraps past the palette length (var ref)
```

Use the **resolved** values for canvas renderers (uPlot), the **`var(--viz-*)` references** for SVG/DOM (so a consumer could re-theme by overriding the custom properties). The charts here pick the right form automatically.

## The charts

- [**Sparkline**](/data-viz/sparkline) — inline trend, pairs with `TelemetryValue`.
- [**Gauge**](/data-viz/gauge) — single bounded value, number beside the dial.
- [**Time series**](/data-viz/time-series) — streaming, high-rate (uPlot).
