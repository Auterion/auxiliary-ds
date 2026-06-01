---
'@auxiliary/viz': minor
---

Phase 6.5 slice 4 — streaming **`TimeSeries`** (uPlot), validating the §6.5 charting decision.

- **`TimeSeries`** — a uPlot (canvas) line chart for the high-rate operational case. Updates flow through `uplot.setData` (canvas redraw, never DOM mutation), so a 10–60 Hz feed doesn't reflow the page. Client-only with graceful degradation: SSR / non-canvas envs render just the labelled `role="img"` container and skip init. Series colors come from the viz palette; axis/grid resolve from theme tokens at mount. uPlot is externalized from the bundle (a dependency, deduped by the consumer).
- **`streaming.ts`** — framework-agnostic bounded-work helpers: `pushCapped` (fixed-capacity window — O(capacity) per frame, not O(total)) and `downsample` (min/max bucketing that preserves transient spikes). Unit-tested.

**Honest perf scope:** the bounded-data helpers are the deterministic guard against unbounded work/reflow (gated by unit tests). A true sustained-60 Hz frame benchmark needs a real browser profile and stays a manual check (as flagged in the charting decision record); the uPlot config was visually verified to render. Live docs demo lands in slice 6.
