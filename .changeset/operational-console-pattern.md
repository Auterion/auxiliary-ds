---
---

Docs (Phase 6.4 slice 6): add the **Operational console** pattern — the GCS block set distilled from Auterion Mission Control. Composes existing primitives + the viz charts into the operational status bar, the **entity grammar** (heading-rotated marker + status halo + callsign + readouts), the fleet panel (alarm-in-periphery, selecting drives the inspector), the inspector panel (telemetry grid + `CoordinateValue` + `Sparkline`), the `AlertManager` feed, and a map + overlay placeholder (map engine product-owned; satellite/terrain legibility parked). Flags EntityIcon's repetition as the signal to extract a component. No package changes.
