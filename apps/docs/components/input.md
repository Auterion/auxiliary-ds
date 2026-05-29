# Input

A native `<input>` styled by the `input` recipe, with two-way binding through `v-model`. One look, every input type — `text`, `number`, `email`, `password`, and the rest are just the `type` prop.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; max-width: 22rem;">
  <Input placeholder="Callsign — MSN-..." />
  <Input type="number" placeholder="Altitude (m)" />
  <Input placeholder="Disabled" disabled />
</div>

## When to use

- For free-form single-line text entry — names, search queries, numeric values, URLs.
- Inside a form, paired with a `<Label>` (use `id` + `for` so clicking the label focuses the field).
- Whenever you need a typed value back via `v-model` — the component emits `update:modelValue` on every keystroke.

## When *not* to use

- For multi-line text — reach for `<Textarea>`. A single-line input that scrolls horizontally hides the user's own writing.
- For choosing from a fixed set of options — use `<Select>`, `<RadioGroup>`, or `<Checkbox>`. Typing a value that has to match a known list is a validation trap.
- For on/off state — that's `<Switch>` or `<Checkbox>`, not a text field.
- For ranged numeric selection where the bounds matter visually — `<Slider>` shows the range; a number input doesn't.

## Examples

### Basic text input

<div class="auxiliary-demo vp-raw" style="max-width: 22rem;">
  <Input placeholder="Search missions…" />
</div>

```vue
<Input placeholder="Search missions…" />
```

### Bound with v-model

The component is a controlled input — pass `modelValue` (or use `v-model`) and read every change back through `update:modelValue`.

<div class="auxiliary-demo vp-raw" style="max-width: 22rem;">
  <Input model-value="MSN-204" placeholder="Callsign" />
</div>

```vue
<script setup>
import { ref } from 'vue'
const callsign = ref('MSN-204')
</script>

<template>
  <Input v-model="callsign" placeholder="Callsign" />
</template>
```

### Input types

The `type` prop forwards straight to the native element — anything the browser supports works (`text`, `number`, `email`, `password`, `search`, `url`, …).

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; max-width: 22rem;">
  <Input type="text" placeholder="Text" />
  <Input type="number" placeholder="408" />
  <Input type="email" placeholder="pilot@auterion.com" />
  <Input type="password" placeholder="Password" />
</div>

```vue
<Input type="text" placeholder="Text" />
<Input type="number" placeholder="408" />
<Input type="email" placeholder="pilot@auterion.com" />
<Input type="password" placeholder="Password" />
```

### Disabled

<div class="auxiliary-demo vp-raw" style="max-width: 22rem;">
  <Input model-value="MSN-204" disabled />
</div>

```vue
<Input v-model="callsign" disabled />
```

`disabled` drops opacity to 50% and blocks pointer events. Use it when the field is *unavailable* given the current state — not for read-only display, where a plain styled value is clearer.

### With a label

The canonical form pattern: a `<Label for>` tied to the input's `id`. Clicking the label moves focus into the field.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 1rem; max-width: 22rem;">
  <div style="display: flex; flex-direction: column; gap: 0.375rem;">
    <Label for="callsign">Callsign</Label>
    <Input id="callsign" placeholder="MSN-..." />
  </div>
  <div style="display: flex; flex-direction: column; gap: 0.375rem;">
    <Label for="altitude">Altitude (m)</Label>
    <Input id="altitude" type="number" placeholder="408" />
  </div>
</div>

```vue
<div class="flex flex-col gap-1.5">
  <Label for="callsign">Callsign</Label>
  <Input id="callsign" v-model="callsign" placeholder="MSN-..." />
</div>
<div class="flex flex-col gap-1.5">
  <Label for="altitude">Altitude (m)</Label>
  <Input id="altitude" v-model="altitude" type="number" placeholder="408" />
</div>
```

## Props

<PropsTable name="Input" />

The component forwards `$attrs`, so `name`, `required`, `min`, `max`, `autocomplete`, `aria-*`, `data-*`, and the rest reach the underlying `<input>`. It emits `update:modelValue` (the new string value) on every `input` event.

## Accessibility

- Renders a real native `<input>`, so all built-in input semantics, keyboard handling, and form participation come for free.
- Always pair with a `<Label for>` matching the input's `id`. A field without a programmatic label is invisible to screen readers — the `placeholder` is **not** a substitute (it disappears on input and fails contrast in many themes).
- The focus ring is `ring-2 ring-ring`, shown only on `:focus-visible`, so keyboard navigation surfaces it while mouse clicks stay quiet.
- `disabled` sets the native attribute, removing the field from the tab order and announcing it as unavailable.
- When you need to communicate validation errors, wire `aria-invalid` and `aria-describedby` (both pass through `$attrs`) pointing at your error text.

## Tokens consumed

The input recipe binds these semantic tokens — change the underlying values in [`@auxiliary/tokens`](/foundations/colors) and Input updates automatically:

| Slot | Token |
| --- | --- |
| Background | `--background` |
| Text | `--foreground` |
| Border | `--input` |
| Placeholder text | `--muted-foreground` |
| Focus ring | `--ring` |
| Corner radius | `--radius-md` |
