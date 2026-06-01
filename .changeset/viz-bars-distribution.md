---
'@auxiliary/viz': minor
---

Phase 6.5 slice 5 — **`Bars`** and **`Distribution`**, completing the static chart set.

- **`Bars`** — a categorical bar chart (values across labelled categories). Single-color by default, or `colorByIndex` to draw each bar from the categorical palette for genuinely distinct categories. Optional category labels.
- **`Distribution`** — a histogram: bins raw samples into equal-width buckets and renders adjacent bars, so skew/spread/modes read at a glance.
- **`geometry.ts`** gains `barRects` (baseline-aligned bar layout, explicit/auto max, negatives clamped) and `histogram` (equal-width binning, last-bin-inclusive) — pure, unit-tested.

Both are pure SVG, SSR-safe, token-driven. Docs pages added under Data viz (slice 6 surface). With this, the SVG chart set is complete: sparkline, gauge, bars, distribution (+ the uPlot streaming time series).
