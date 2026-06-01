---
---

Docs/planning (Phase 6.5 slice 1 — the charting spike): record the data-viz charting-engine decision in `ROADMAP.md`. Grounded in a scan of the real products (AuterionOS → Chart.js, Suite → ECharts/D3 — they diverge, so no standard to inherit) and the system's criteria (streaming 10–60 Hz, token-drivability, air-gap, SSR, bundle, Vue-first). Outcome: **token-driven SVG** for static/small charts + **uPlot** for high-rate streaming, behind one thin API in a new **`@auxiliary/viz`** package (visx disqualified as React-only; ECharts/Chart.js lose on token-drivability). Empirical 60 Hz validation deferred to slice 4. No package changes.
