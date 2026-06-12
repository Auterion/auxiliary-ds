---
'@auxiliary/vue': minor
---

**Breaking (pre-1.0):** one coherent label vocabulary. `label` previously
meant four different things across components; it is now reserved for visible
text (TelemetryValue, CoordinateValue keep it unchanged):

- `Checkbox`, `Switch`, `Spinner`: `label` → `ariaLabel` (assistive-only
  accessible name; never rendered).
- `StatusBadge`: `label` → `srLabel` (overrides the always-rendered
  screen-reader-only level announcement).
- `GuardedAction`: `cancelText` → `cancelLabel` (matches the `*Label` suffix
  used everywhere else).
- `NumberField` no longer leaks `decrementLabel`/`incrementLabel` as DOM
  attributes on its root element.
