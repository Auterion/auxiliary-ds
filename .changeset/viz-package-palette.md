---
'@auxiliary/tokens': minor
'@auxiliary/viz': minor
---

Phase 6.5 slice 2 — the viz token layer + a new **`@auxiliary/viz`** package.

- **`@auxiliary/tokens`**: add the data-viz palette — `viz.categorical` (5 series), `viz.sequential` (5-step ramp), `viz.diverging` (5-step, neutral midpoint), derived as aliases from the OKLCH primitive ramps and emitted as `--viz-*` CSS vars + into `tokens.ts`. A source gate (`test/viz-palette.test.ts`) enforces the invariants: every categorical series stays clear of the reserved status ladder (ΔEok), series stay mutually distinguishable in both color and **lightness** (the CVD-safe "luminance hierarchy" proxy — the categorical palette lives in the cool→magenta arc because status reserves the warm+cyan+green band), the sequential ramp is monotonic, and the diverging scale has distinct ends + a near-neutral midpoint.
- **`@auxiliary/viz`** (new): exposes the palette as typed `categorical`/`sequential`/`diverging` arrays — resolved oklch (for canvas/uPlot) and `--viz-*` var references (for SVG/DOM) — plus `seriesColor`/`seriesVar` helpers. This is the home for the chart set (sparkline, gauge, streaming time-series) in later slices. Engine choice (SVG + uPlot) per the §6.5 charting decision record.
