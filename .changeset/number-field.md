---
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

Add `NumberField` — numeric entry with steppers, bounds, and an optional unit.

The first net-new primitive from the Phase 6.1 backlog (top operational need: altitude/speed/
frequency/step entry). Built on Reka UI's headless `NumberField`: a bordered row of decrement ·
spinbutton input · optional `unit` suffix · increment.

- Forwards the Reka root props (`min`, `max`, `step`, `stepSnapping`, `formatOptions`, `locale`,
  `readonly`, `disabled`, `id`, …) and emits `update:modelValue` with the parsed number.
- Shares the form-control `size` (sm/md/lg) and `invalid` vocabulary (aria-invalid + destructive
  border/ring), so it lines up with Input/Select.
- A11y: `role="spinbutton"` value with `aria-valuenow/min/max`; `aria-label`led stepper buttons;
  names via `<Label for>` + `id`. The `unit` suffix is decorative (`aria-hidden`).

New: `numberField` recipe + `NumberFieldVariants` type; `@auxiliary/vue/NumberField` subpath.
