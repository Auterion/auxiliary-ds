# RadioGroup

A single-select control built on Reka UI's `RadioGroupRoot` / `RadioGroupItem` and styled by the `radioGroup` recipe. `RadioGroup` owns the value and roving focus; each `RadioGroupItem` is one mutually-exclusive option.

<div class="auxiliary-demo">
  <RadioGroup default-value="auto">
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="hero-auto" value="auto" />
      <span>Auto</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="hero-manual" value="manual" />
      <span>Manual</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="hero-loiter" value="loiter" />
      <span>Loiter</span>
    </label>
  </RadioGroup>
</div>

## When to use

- For **one choice out of a small, fixed set** (2–5 options) where seeing every option at once aids the decision — flight mode, quality tier, payload profile.
- When the options are short and you want them all visible without a click — radios beat a `<Select>` for scannability.
- For form fields where exactly one value is required and the default matters — set `default-value` so the form is never in a no-selection state.

## When *not* to use

- For **many options** (roughly 6+) — the list gets long and noisy; reach for `<Select>` instead.
- For **independent on/off toggles** — each radio is mutually exclusive with its siblings. If a user can pick several, use `<Checkbox>`; if it's a single binary, use `<Switch>` or `<Checkbox>`.
- For **navigation or actions** — radios set a value, they don't trigger anything. Use `<Button>` or `<Tabs>` for that.

## Examples

### Vertical (default)

Each `RadioGroupItem` is just the dot control — wrap it in a `<label>` with text so the option is clickable and labelled. The group stacks vertically by default.

<div class="auxiliary-demo">
  <RadioGroup default-value="balanced">
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="q-eco" value="eco" />
      <span>Eco — longest flight time</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="q-balanced" value="balanced" />
      <span>Balanced</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="q-sport" value="sport" />
      <span>Sport — maximum responsiveness</span>
    </label>
  </RadioGroup>
</div>

```vue
<RadioGroup default-value="balanced">
  <label class="flex items-center gap-2 text-sm">
    <RadioGroupItem id="q-eco" value="eco" />
    <span>Eco — longest flight time</span>
  </label>
  <label class="flex items-center gap-2 text-sm">
    <RadioGroupItem id="q-balanced" value="balanced" />
    <span>Balanced</span>
  </label>
  <label class="flex items-center gap-2 text-sm">
    <RadioGroupItem id="q-sport" value="sport" />
    <span>Sport — maximum responsiveness</span>
  </label>
</RadioGroup>
```

### Horizontal

Set `orientation="horizontal"` to lay the items out in a row — useful for compact settings panels where the labels are short.

<div class="auxiliary-demo">
  <RadioGroup default-value="auto" orientation="horizontal">
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="fm-auto" value="auto" />
      <span>Auto</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="fm-manual" value="manual" />
      <span>Manual</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="fm-loiter" value="loiter" />
      <span>Loiter</span>
    </label>
  </RadioGroup>
</div>

```vue
<RadioGroup default-value="auto" orientation="horizontal">
  <label class="flex items-center gap-2 text-sm">
    <RadioGroupItem id="fm-auto" value="auto" />
    <span>Auto</span>
  </label>
  <label class="flex items-center gap-2 text-sm">
    <RadioGroupItem id="fm-manual" value="manual" />
    <span>Manual</span>
  </label>
  <label class="flex items-center gap-2 text-sm">
    <RadioGroupItem id="fm-loiter" value="loiter" />
    <span>Loiter</span>
  </label>
</RadioGroup>
```

### Controlled with `v-model`

Bind `v-model` on `RadioGroup` to read and drive the selected value. The group emits `update:modelValue` with the chosen item's `value`.

```vue
<script setup>
import { ref } from 'vue'
const flightMode = ref('auto')
</script>

<template>
  <RadioGroup v-model="flightMode" orientation="horizontal">
    <label class="flex items-center gap-2 text-sm">
      <RadioGroupItem id="rm-auto" value="auto" />
      <span>Auto</span>
    </label>
    <label class="flex items-center gap-2 text-sm">
      <RadioGroupItem id="rm-manual" value="manual" />
      <span>Manual</span>
    </label>
    <label class="flex items-center gap-2 text-sm">
      <RadioGroupItem id="rm-loiter" value="loiter" />
      <span>Loiter</span>
    </label>
  </RadioGroup>
  <p>Selected: {{ flightMode }}</p>
</template>
```

### Disabled options

`disabled` on the group disables every item; `disabled` on a single `RadioGroupItem` gates just that option. Disabled items are skipped by keyboard navigation.

<div class="auxiliary-demo">
  <RadioGroup default-value="standard">
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="p-standard" value="standard" />
      <span>Standard payload</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; opacity: 0.6;">
      <RadioGroupItem id="p-thermal" value="thermal" disabled />
      <span>Thermal camera — not attached</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
      <RadioGroupItem id="p-lidar" value="lidar" />
      <span>LiDAR</span>
    </label>
  </RadioGroup>
</div>

```vue
<RadioGroup default-value="standard">
  <label class="flex items-center gap-2 text-sm">
    <RadioGroupItem id="p-standard" value="standard" />
    <span>Standard payload</span>
  </label>
  <label class="flex items-center gap-2 text-sm opacity-60">
    <RadioGroupItem id="p-thermal" value="thermal" disabled />
    <span>Thermal camera — not attached</span>
  </label>
  <label class="flex items-center gap-2 text-sm">
    <RadioGroupItem id="p-lidar" value="lidar" />
    <span>LiDAR</span>
  </label>
</RadioGroup>
```

## Props

### RadioGroup

<PropsTable name="RadioGroup" />

### RadioGroupItem

<PropsTable name="RadioGroupItem" />

## Accessibility

- The group renders Reka UI's `RadioGroupRoot` (`role="radiogroup"`) and each item a native radio (`role="radio"` with `aria-checked`), so screen readers announce position, count, and selected state correctly.
- **Items carry no visible text of their own** — `RadioGroupItem` is only the dot control. Always wrap it in a `<label>` (or pair it via `id`/`for`) so the option has an accessible name and a larger click target.
- **Roving focus:** the group is a single Tab stop. Tab moves focus to the checked item (or the first item if none is checked); arrow keys move between options and select as they go. Set `loop` to wrap from the last item back to the first.
- `orientation` informs arrow-key behaviour — horizontal groups respond to Left/Right, vertical groups to Up/Down — and `dir` flips that for RTL layouts.
- The focus ring is `ring-2 ring-ring`, shown only on `:focus-visible`, so keyboard navigation is visible while mouse clicks stay quiet.
- Selection is signalled by the filled inner dot plus the `--primary` border on the checked item — not by color alone — so the state survives a color-blind-safe reading. Disabled items drop to 50% opacity and `cursor-not-allowed`.
- For form submission, set `name` (and `required` if a choice is mandatory) on `RadioGroup`; it submits a standard name/value pair so native form validation applies.
