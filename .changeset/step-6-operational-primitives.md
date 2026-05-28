---
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

**Step 6 — Operational primitives.** The Auterion-specific layer: status, telemetry, alerts. The thing nobody else in the Vue ecosystem ships.

New `@auxiliary/vue` exports:

- **`<StatusBadge>`** — pill displaying a status `level` (alarm/warning/caution/advisory/nominal) with optional `dot` indicator. `variant`: `solid` (default) or `outline`. `size`: `sm` or `md`. Status colors come from semantic tokens so badges re-theme correctly across Light/Dark/Sunlight/Darknight.
- **`<TelemetryValue>`** — mono-tabular readout with optional `label`, `unit`, `precision` (decimals for numeric values), `trend` (`up`/`down`/`stable` → ▲/▼/–), `size` (`sm`/`md`/`lg`), and `level` (colors the value when a threshold is crossed, e.g. `level="alarm"` for a lost-link readout).
- **`<AlertBanner>`** — persistent, severity-coded banner with built-in icon glyph (triangle-exclamation for alarm/warning/caution, circle-i for advisory, checkmark for nominal). `title` + `description` props or slots, optional `actionLabel` button, optional `dismissible` close. Emits `action` and `dismiss`. `role="alert"` for screen readers.

Each exports a typed `StatusLevel` / `AlertLevel` union so consumers' code stays typed end-to-end.

`apps/demo`:

- **Status section** rewritten to use `<StatusBadge>` (solid row, outline row, in-situ row showing inline use)
- **New Telemetry section** — 8 readouts in a 4×2 grid (altitude, speed, heading, battery, sats, RSSI, wind, link) demonstrating units, trends, precision, and threshold coloring
- **New Alerts section** — 5 banners (one per status level) with realistic mission-critical copy (telemetry loss, low battery, wind limit, new waypoint, mission complete)

Bundle: `@auxiliary/vue` 23.64 → 30.07 KB. Demo 284 → 292 KB.

**The Auterion-specific differentiator is now real.** The system has the operational vocabulary that makes it distinct from "shadcn-vue with prettier tokens."
