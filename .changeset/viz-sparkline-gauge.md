---
'@auxiliary/viz': minor
---

Phase 6.5 slice 3 — the first charts: **`Sparkline`** and **`Gauge`**, the two that pair with `TelemetryValue`. `@auxiliary/viz` becomes a Vue lib (vite + vue-tsc, `vue` peer) so it can host the chart set.

- **`geometry.ts`** — framework-agnostic, SSR-safe path math (`sparklinePath`, `gaugeGeometry`), unit-tested independently of Vue.
- **`Sparkline`** — inline trend line/area in pure SVG, token-driven stroke (defaults to the first viz series), decorative (`aria-hidden`) without a `label` / an `img` with one.
- **`Gauge`** — radial dial with the **number beside the graphic** (the "numbers before graphics" rule) in tabular figures, plus ARIA `meter` semantics (`aria-valuenow`/`min`/`max`/`valuetext`). Token-driven arc; SSR-safe.

Both render from tokens with no runtime dependency (SVG; uPlot enters at the streaming slice). Docs pages land in slice 6.
