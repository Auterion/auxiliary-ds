---
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

Phase 6.3 (Defense layer) — add coordinate formatting + the `CoordinateValue` primitive (ROADMAP §6i).

Operational/C2 surfaces present positions in the formats operators actually read; this adds the coordinate
half of the 6i "units / coordinates / locale" workstream. Unit-systems (metric/imperial) and locale numeric
formatting are deferred to a follow-up slice.

- **`@auxiliary/css`** — new framework-agnostic `@auxiliary/css/format` subpath with `formatLatLon(lat, lon, opts)`:
  decimal degrees (`dd`), degrees-minutes-seconds (`dms`), degrees-decimal-minutes (`ddm`), and **MGRS**
  (Military Grid Reference System, via the `mgrs` dependency). Rounding carries across units; invalid input
  (NaN / out-of-range / beyond MGRS's polar band) degrades to a `—` sentinel rather than throwing, so a bad
  fix never breaks a panel. Adds a `coordinate-value` recipe mirroring `telemetry-value`'s mono/tabular vocabulary.
- **`@auxiliary/vue`** — new `<CoordinateValue>` primitive, a sibling to `TelemetryValue`: renders a WGS84
  lat/long pair in any of the four formats, with `precision` / `mgrsAccuracy`, optional `label` + format tag,
  `size`, and alarm-tier `level` recoloring. Read-only, screen-reader-legible, `tabular-nums` aligned.

Additive and opt-in — does not modify `TelemetryValue` or any existing primitive.
