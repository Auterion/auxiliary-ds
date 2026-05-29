# Checkbox

A tri-state checkbox built on Reka UI's `CheckboxRoot` / `CheckboxIndicator`, styled by the `checkbox` recipe. It supports checked, unchecked, and a third `indeterminate` state, and binds to a model with `v-model`.

<div class="auxiliary-demo">
  <Checkbox :default-value="true" id="hero" />
  <Label for="hero">Arm vehicle on launch</Label>
</div>

## When to use

- For an independent on/off choice in a form — "remember me", "arm on launch", "agree to terms".
- For selecting multiple items from a set where each option toggles independently (a list of pre-flight checks).
- As the header toggle of a "select all" group — drive its `indeterminate` state from whether the children are fully, partially, or not selected.

## When *not* to use

- For a single immediate setting that takes effect the moment it changes — reach for `<Switch>`. A checkbox implies a pending choice confirmed later (on submit); a switch implies the change is live.
- For choosing exactly one option from several mutually exclusive choices — use `<RadioGroup>`. Multiple checkboxes can't express "pick one."
- For triggering an action — that's a `<Button>`. A checkbox stores state, it doesn't fire commands.

## Examples

### Bound with v-model

The component is controlled with `v-model`. Pair every checkbox with a `<Label>` whose `for` matches the checkbox `id` so the label is clickable and announced.

<div class="auxiliary-demo">
  <Checkbox :default-value="true" id="ex-armed" />
  <Label for="ex-armed">Arm vehicle on launch</Label>
</div>

```vue
<script setup>
import { ref } from 'vue';
const armed = ref(true);
</script>

<template>
  <Checkbox id="armed" v-model="armed" />
  <Label for="armed">Arm vehicle on launch</Label>
</template>
```

### Unchecked / checked

<div class="auxiliary-demo">
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <Checkbox :default-value="false" id="ex-off" />
    <Label for="ex-off">Off</Label>
  </div>
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <Checkbox :default-value="true" id="ex-on" />
    <Label for="ex-on">On</Label>
  </div>
</div>

```vue
<Checkbox :default-value="false" id="off" />
<Checkbox :default-value="true" id="on" />
```

A checked box fills with `--primary` and draws the check in `--primary-foreground`; unchecked is a bordered, transparent square.

### Indeterminate

Set the value to the string `'indeterminate'` for a "partially selected" state — typically the parent of a checkbox group where some, but not all, children are checked. The indicator renders a dash instead of a check.

<div class="auxiliary-demo">
  <Checkbox default-value="indeterminate" id="ex-mixed" />
  <Label for="ex-mixed">Select all checks</Label>
</div>

```vue
<script setup>
import { ref } from 'vue';
const allChecks = ref('indeterminate'); // boolean | 'indeterminate'
</script>

<template>
  <Checkbox id="checks" v-model="allChecks" />
  <Label for="checks">Select all checks</Label>
</template>
```

`indeterminate` is purely visual — it is not a value the user can set by clicking. Clicking an indeterminate box resolves it to `true`. Drive it from your own group logic.

### Disabled

<div class="auxiliary-demo">
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <Checkbox :default-value="true" disabled id="ex-dis-on" />
    <Label for="ex-dis-on">Locked on</Label>
  </div>
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <Checkbox :default-value="false" disabled id="ex-dis-off" />
    <Label for="ex-dis-off">Locked off</Label>
  </div>
</div>

```vue
<Checkbox :default-value="true" disabled id="locked-on" />
<Checkbox :default-value="false" disabled id="locked-off" />
```

`disabled` drops opacity to 50% and blocks pointer interaction. Use it when the choice is unavailable given current state, not as a substitute for hiding an irrelevant option.

## Props

<PropsTable name="Checkbox" />

The component forwards its Reka UI props and emits `update:modelValue` (so `v-model` works). Use `name` + `value` to participate in native form submission, and `required` to gate submit.

## Accessibility

- Renders a `role="checkbox"` element with `aria-checked` kept in sync — `true`, `false`, or `mixed` for the indeterminate state. Screen readers announce all three.
- Always pair the checkbox with a `<Label>` whose `for` matches the `id`. The label becomes the accessible name and an extra click target; without it, the box has no announced meaning.
- Keyboard: focus with <kbd>Tab</kbd>, toggle with <kbd>Space</kbd>. The focus ring is `ring-2 ring-ring`, shown only on `:focus-visible`, so pointer clicks stay quiet while keyboard navigation is visible.
- The check and dash glyphs are inline SVGs marked `aria-hidden="true"` — they are decorative; `aria-checked` carries the state, not the icon.
- `disabled` sets the disabled state Reka UI exposes to assistive tech, so the control is skipped in the tab order and announced as unavailable.

## Tokens consumed

The `checkbox` recipe binds these semantic tokens — change the underlying values in [`@auxiliary/tokens`](/foundations/colors) and Checkbox updates automatically:

| State | Background | Border | Indicator |
| --- | --- | --- | --- |
| unchecked | `--background` | `--input` | — |
| checked | `--primary` | `--primary` | `--primary-foreground` |
| indeterminate | `--primary` | `--primary` | `--primary-foreground` |

Plus `--ring` for the focus outline on every state, and `--radius` (via `rounded`) for the corner radius.
