# Switch

A two-state toggle built on Reka UI's `SwitchRoot` / `SwitchThumb` and styled by the `switchControl` recipe. Use it for settings that take effect immediately.

<div class="auxiliary-demo vp-raw">
  <Switch :default-value="true" />
  <Switch :default-value="false" />
  <Switch :default-value="true" disabled />
</div>

## When to use

- For a binary setting that applies the instant it flips — geofence on/off, telemetry recording, a feature flag. The label should read like a state, not a command.
- When the change has an immediate effect and needs no separate "Save" step. A switch that does nothing until you submit a form is a lie; use `<Checkbox>` there.
- Paired with a `<Label>` so the control has an accessible name and a larger click target.

## When *not* to use

- For form data that's submitted later with the rest of a form — reach for `<Checkbox>`. Checkboxes read as "select this option for submission"; switches read as "this is on now."
- For choosing one of several mutually exclusive options — use `<RadioGroup>`.
- For triggering an action (run, deploy, abort) — that's a `<Button>`. A switch implies a persistent state, not a one-shot command.
- For more than two states — a switch is strictly on/off. Three-plus states need `<RadioGroup>`, `<Select>`, or `<Tabs>`.

## Examples

### Controlled with v-model

The common case: bind state with `v-model` and react to it.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: flex-start; gap: 0.75rem;">
  <div style="display: flex; align-items: center; gap: 0.75rem;">
    <Switch id="geofence" :default-value="true" />
    <Label for="geofence">Geofence active</Label>
  </div>
</div>

```vue
<script setup>
import { ref } from 'vue'
const geofenceEnabled = ref(true)
</script>

<template>
  <div class="flex items-center gap-3">
    <Switch id="geofence" v-model="geofenceEnabled" />
    <Label for="geofence">Geofence active</Label>
  </div>
</template>
```

Always pair the switch with a `<Label>` whose `for` matches the switch `id` — clicking the label then toggles the control, and screen readers announce the name.

### Default (uncontrolled) value

When you don't need to read the state in script, set the initial value with `default-value` and let the component own it.

<div class="auxiliary-demo vp-raw">
  <Switch :default-value="true" />
  <Switch :default-value="false" />
</div>

```vue
<Switch :default-value="true" />
<Switch :default-value="false" />
```

### Disabled

<div class="auxiliary-demo vp-raw">
  <Switch :default-value="true" disabled />
  <Switch :default-value="false" disabled />
</div>

```vue
<Switch :default-value="true" disabled />
<Switch :default-value="false" disabled />
```

`disabled` drops opacity to 50%, switches the cursor to `not-allowed`, and blocks both pointer and keyboard interaction. Use it when the setting is gated by other state — e.g. "Geofence active" is unavailable until a home point is set.

### In a form

With a `name` (and optional `value`), the switch participates in native form submission as a name/value pair when on.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: flex-start; gap: 0.75rem;">
  <div style="display: flex; align-items: center; gap: 0.75rem;">
    <Switch id="record" name="recordTelemetry" :default-value="true" />
    <Label for="record">Record telemetry</Label>
  </div>
</div>

```vue
<form>
  <div class="flex items-center gap-3">
    <Switch id="record" name="recordTelemetry" :default-value="true" />
    <Label for="record">Record telemetry</Label>
  </div>
</form>
```

Add `required` to block submission until the user sets the value — useful for a "I accept" toggle gating a destructive operation.

## Props

<PropsTable name="Switch" />

The component forwards Reka UI's `SwitchRoot` props and emits `update:modelValue` (so `v-model` works). `trueValue` / `falseValue` let you map the on/off states onto values other than `true` / `false` when submitting with a `name`.

## Accessibility

- Renders as Reka UI's `SwitchRoot`, which carries `role="switch"` and `aria-checked` reflecting the current state — screen readers announce it as a switch, on or off.
- It has no visible text of its own. Give it an accessible name with an associated `<Label>` (matching `for`/`id`) or an `aria-label`. A nameless switch is meaningless to assistive tech.
- Keyboard: `Tab` moves focus to the switch; `Space` and `Enter` toggle it. The focus ring (`ring-2 ring-ring`) shows only on `:focus-visible`, so keyboard users see it while mouse clicks don't.
- `disabled` blocks interaction and is exposed to assistive tech, not just visually dimmed.
- State is conveyed by both the thumb position and the background color (`--background` off, `--primary` on), so the on/off distinction never relies on color alone — it stays legible for color-blind users.

## Tokens consumed

The `switchControl` recipe binds these semantic tokens — change the underlying values in [`@auxiliary/tokens`](/foundations/colors) and Switch updates automatically:

| Part | Off | On |
| --- | --- | --- |
| Track background | `--background` | `--primary` |
| Track border | `--input` | `--primary` |
| Thumb | `--background` | `--background` |

Plus `--ring` (focus outline) on every state. The track and thumb are both fully rounded (`rounded-full`), and the thumb slides via a `transition-transform`.
