---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

Input modality is now a first-class axis (ROADMAP § Input modality & touch). On a coarse pointer, every interactive control is floored to a 44px touch target (MIL-STD-1472 / WCAG 2.5.5 AAA), winning over operational-register density — so the same dense GCS controls stay usable on rugged field tablets.

- **`@auxiliary/tokens`**: new `--target-min` (44px) and `--target-floor` (0px default) primitives. The build emits a coarse-pointer layer after the theme/register blocks: `@media (pointer: coarse)` raises `--target-floor` to `--target-min`, with `[data-input="coarse"|"fine"]` as an authoring override (mirrors how `[data-theme]` layers over `prefers-color-scheme`).
- **`@auxiliary/css`**: control recipes (Button, Input, Select, NumberField, Combobox, GuardedAction) size via `max(var(--control-height-*), var(--target-floor))`, so the floor composes over register density at any tree depth and never lowers a control already taller than 44px. New `touch-target-floor` gate locks both halves — the CSS activation and that every recipe control-height usage is floored.

New docs page `foundations/input-and-touch.md`. Follow-up: box-sized controls (Checkbox/Switch) and icon-only hit areas expand their touch target separately.
