---
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

Phase 6.3 (Defense layer) — unit systems (metric/imperial) + locale-aware formatting (ROADMAP §6i).

Completes the "units / coordinates / locale" workstream. The design system speaks SI internally; a
deployment picks its unit system + locale once and readouts follow — *"metric or imperial per deployment,
never mixed in one view"* (the lexicon rule), now enforced in code.

- **`@auxiliary/css`** — new `units` formatters in `@auxiliary/css/format`: `convertQuantity` / `formatQuantity`
  / `formatNumber`. Quantities `distance`, `altitude`, `speed`, `verticalSpeed`, `temperature`, `angle`.
  **Imperial = aviation** (feet, knots, ft/min, °F); temperature is an affine °C↔°F transform, angle is
  system-invariant with a NATO-`mils` override, and named overrides (`km`, `mph`, `NM`, …) reach the rest.
  Locale formatting is **opt-in**: with no locale it's a deterministic `toFixed` (no grouping); with one it
  uses `Intl.NumberFormat`. Non-finite input degrades to a `—` sentinel.
- **`@auxiliary/vue`** — new `<UnitSystemProvider>` + `useUnitSystem()` composable: the package's first
  provide/inject context, setting `system` + `locale` deployment-wide. `TelemetryValue` gains `quantity`,
  `system`, and `locale` props — pass `quantity` and the numeric `value` is treated as canonical SI and
  converted with a derived unit label; a per-component prop overrides the provider. **Default output is
  unchanged** — readouts without `quantity`/`locale` format exactly as before.

Additive: `<UnitSystemProvider>` is opt-in and existing `TelemetryValue` usage is unaffected.
