---
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

**Step 5f — Form inputs.** Five new primitives completing the selection/range surface; everything beyond text now has a control.

- **`<Checkbox>`** — boolean or `indeterminate` state. v-model. Built-in check + minus icons. Focus ring via `ring-focus`.
- **`<Switch>`** — boolean toggle (semantic preference, not selection — pair with Label not in a form group). v-model, smooth thumb transform.
- **`<RadioGroup>`** + **`<RadioGroupItem>`** — single-select from N options. Horizontal/vertical orientation, full keyboard nav (↑/↓ in vertical, ←/→ in horizontal), ARIA-correct.
- **`<Slider>`** — range input. v-model as `number[]` (Reka convention — supports multi-thumb later). `min`/`max`/`step`/`orientation`/`inverted` props. Track + range + thumb styled with semantic tokens.
- **`<Textarea>`** — multi-line text input. Same styling as `<Input>` (bg-input, border-input, ring-focus) plus `rows` prop and `resize-y`.

`apps/demo` — new "Form inputs" section between the existing form composition and typography. Demonstrates each control with v-model state and a live echo line. Realistic mission-control framing: arm-on-launch checkbox, geofence switch, flight-mode radio (Auto/Manual/Loiter), max-altitude slider (10–400m), failsafe-note textarea.

Bundle: `@auxiliary/vue` 30.07 → 37.72 KB. Demo 292 → 324 KB.

**Step 5g (Card + Separator + Accordion) and Step 5h (Avatar + Badge + Progress + Spinner/Skeleton) are next** to round out the "universal basics across all major DS" set before docs/Patterns.
