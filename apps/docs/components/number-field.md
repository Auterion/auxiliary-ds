# NumberField

A numeric entry control with steppers, bounds, and an optional unit — built on Reka UI's headless `NumberField`. Decrement · value · unit · increment, in one bordered row. For altitude, speed, frequency, step counts, and the rest of the numbers an operator types or nudges.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 1rem; max-width: 16rem;">
  <NumberField :model-value="408" unit="m" />
  <NumberField :model-value="12" :min="0" :max="60" unit="kts" />
  <NumberField :model-value="5" disabled />
</div>

## When to use

- For numeric values the user adjusts in steps — altitude, speed, frequency, gain, count. The steppers give coarse control by mouse; typing gives precise entry.
- When the value has **bounds** (`min`/`max`) or a meaningful **step** — the control clamps and snaps for you, so an out-of-range number can't be entered.
- When a **unit** belongs with the value — show it inline (`unit="m"`) rather than in a separate label, so the number is never ambiguous.

## When *not* to use

- For free-form text or non-numeric input — use `<Input>`.
- For a value chosen by dragging across a visible range — `<Slider>` shows the range; a NumberField doesn't.
- For *displaying* a live readout you don't edit — that's `<TelemetryValue>`. NumberField is for entry.

## Examples

### Bound and stepped

`min`, `max`, and `step` clamp and snap the value. The spinbutton announces the current value and its range to assistive tech.

<div class="auxiliary-demo vp-raw" style="max-width: 16rem;">
  <NumberField :model-value="20" :min="0" :max="100" :step="5" unit="%" />
</div>

```vue
<NumberField v-model="throttle" :min="0" :max="100" :step="5" unit="%" />
```

### Bound with v-model

The control is two-way bound — pass `modelValue` (or `v-model`) and read changes back via `update:modelValue`.

```vue
<script setup>
import { ref } from 'vue'
const altitude = ref(408)
</script>

<template>
  <NumberField v-model="altitude" :min="0" unit="m" />
</template>
```

### Formatting

`formatOptions` forwards straight to `Intl.NumberFormat`, so currencies, units, and precision are the platform's job, not yours.

<div class="auxiliary-demo vp-raw" style="max-width: 16rem;">
  <NumberField :model-value="1500" :format-options="{ style: 'unit', unit: 'meter' }" />
</div>

```vue
<NumberField v-model="distance" :format-options="{ style: 'unit', unit: 'meter' }" />
```

### Sizes

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.75rem; max-width: 16rem;">
  <NumberField size="sm" :model-value="1" unit="m" />
  <NumberField size="md" :model-value="2" unit="m" />
  <NumberField size="lg" :model-value="3" unit="m" />
</div>

```vue
<NumberField size="sm" v-model="a" />
<NumberField size="md" v-model="b" />
<NumberField size="lg" v-model="c" />
```

### Invalid

`invalid` sets `aria-invalid` on the input and a destructive border. Pair it with a field-level error message wired through `aria-describedby`.

<div class="auxiliary-demo vp-raw" style="max-width: 16rem;">
  <NumberField :model-value="150" :max="100" invalid unit="%" />
</div>

```vue
<NumberField v-model="throttle" :max="100" :invalid="throttle > 100" unit="%" />
```

### With a label

The canonical form pattern: a `<Label for>` tied to the field's `id` (Reka wires `id` onto the spinbutton input).

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.375rem; max-width: 16rem;">
  <Label for="alt">Altitude</Label>
  <NumberField id="alt" :model-value="408" :min="0" unit="m" />
</div>

```vue
<Label for="alt">Altitude</Label>
<NumberField id="alt" v-model="altitude" :min="0" unit="m" />
```

## Props

<PropsTable name="NumberField" />

Beyond the props above, the Reka root props (`min`, `max`, `step`, `stepSnapping`, `formatOptions`, `locale`, `readonly`, `disabled`, `id`, …) are forwarded. The control emits `update:modelValue` with the parsed number.

## Accessibility

- The value field is a `role="spinbutton"` input exposing `aria-valuenow`/`aria-valuemin`/`aria-valuemax`, so screen readers announce the value and its range; ↑/↓ adjust by `step`.
- The decrement and increment buttons carry `aria-label="Decrease"`/`"Increase"`; their glyphs are `aria-hidden`.
- Give the field an accessible name with a `<Label for>` matching `id` — same rule as `<Input>`. The placeholder is not a substitute.
- `invalid` sets `aria-invalid`; wire `aria-describedby` to your error text.
- The `unit` suffix is decorative (`aria-hidden`) — encode it into the value's accessible context (label or `formatOptions`) if it carries meaning beyond the visible label.

## Tokens consumed

| Slot | Token |
| --- | --- |
| Background | `--background` |
| Value text | `--foreground` |
| Border | `--input` |
| Stepper glyphs / unit | `--muted-foreground` |
| Stepper hover | `--accent` / `--accent-foreground` |
| Focus ring | `--ring` |
| Corner radius | `--radius-md` |
