# Select

A compound listbox built on Reka UI's `SelectRoot` and styled by the `select` recipe. You compose it from six parts — `Select` (the provider), `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, and `SelectSeparator` — to pick one value (or many) from a closed set.

<div class="auxiliary-demo">
  <Select :default-value="'auto'">
    <SelectTrigger class="w-48">
      <SelectValue placeholder="Select mode" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="manual">Manual</SelectItem>
      <SelectItem value="auto">Auto</SelectItem>
      <SelectItem value="loiter">Loiter</SelectItem>
      <SelectItem value="rtl">Return to launch</SelectItem>
      <SelectItem value="land">Land</SelectItem>
    </SelectContent>
  </Select>
</div>

## When to use

- For choosing **one value from a closed, known set** — vehicle mode, payload type, map layer, units.
- When the list is long enough that radio buttons would crowd the layout but short enough to scan in a dropdown (roughly 5–20 options).
- Inside a form, where it submits a name/value pair. Set `name` on `<Select>` and it participates in native form submission like a `<select>`.
- When you want type-ahead: Reka UI matches keystrokes against item text out of the box.

## When *not* to use

- For **2–4 mutually exclusive options** that benefit from being visible at once — reach for a radio group. Hiding three choices behind a click costs more than it saves.
- For a **boolean** — that's `<Switch>` or `<Checkbox>`, not a two-item Select.
- For **free-text entry or search-as-you-type over a large/open set** — a Select only picks from fixed items. Use a combobox/autocomplete pattern instead.
- For **actions** (run, calibrate, delete) — those belong in a `<DropdownMenu>`. A Select holds a *value*; a menu fires *commands*.

## Examples

### Basic single-select

Every Select needs the full composition: a `<Select>` provider wrapping a `<SelectTrigger>` (with a `<SelectValue>` for the chosen label) and a `<SelectContent>` holding the `<SelectItem>`s.

<div class="auxiliary-demo">
  <Select>
    <SelectTrigger class="w-48">
      <SelectValue placeholder="Select mode" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="manual">Manual</SelectItem>
      <SelectItem value="auto">Auto</SelectItem>
      <SelectItem value="loiter">Loiter</SelectItem>
      <SelectItem value="rtl">Return to launch</SelectItem>
      <SelectItem value="land">Land</SelectItem>
    </SelectContent>
  </Select>
</div>

```vue
<Select>
  <SelectTrigger class="w-48">
    <SelectValue placeholder="Select mode" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="manual">Manual</SelectItem>
    <SelectItem value="auto">Auto</SelectItem>
    <SelectItem value="loiter">Loiter</SelectItem>
    <SelectItem value="rtl">Return to launch</SelectItem>
    <SelectItem value="land">Land</SelectItem>
  </SelectContent>
</Select>
```

`placeholder` on `<SelectValue>` is the empty-state label; it shows until a value is chosen. The chevron on the trigger is rendered by the component — you don't add it.

### Bound value (v-model)

`<Select>` supports `v-model` for the chosen value and emits `update:modelValue`. Bind it to drive state elsewhere in your UI.

<div class="auxiliary-demo">
  <Select :default-value="'loiter'">
    <SelectTrigger class="w-48">
      <SelectValue placeholder="Select mode" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="manual">Manual</SelectItem>
      <SelectItem value="auto">Auto</SelectItem>
      <SelectItem value="loiter">Loiter</SelectItem>
      <SelectItem value="rtl">Return to launch</SelectItem>
    </SelectContent>
  </Select>
</div>

```vue
<script setup>
import { ref } from 'vue'
const vehicleMode = ref('loiter')
</script>

<template>
  <Select v-model="vehicleMode">
    <SelectTrigger class="w-48">
      <SelectValue placeholder="Select mode" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="manual">Manual</SelectItem>
      <SelectItem value="auto">Auto</SelectItem>
      <SelectItem value="loiter">Loiter</SelectItem>
      <SelectItem value="rtl">Return to launch</SelectItem>
    </SelectContent>
  </Select>
</template>
```

Use `default-value` instead of `v-model` when you only need an initial selection and don't need to read it back. The hero demo above uses `default-value="auto"`.

### Grouped options with a separator

`<SelectSeparator>` draws a thin divider between item groups — useful when the set has a natural split (e.g. assisted modes vs. manual recovery).

<div class="auxiliary-demo">
  <Select>
    <SelectTrigger class="w-56">
      <SelectValue placeholder="Flight mode" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="auto">Auto</SelectItem>
      <SelectItem value="loiter">Loiter</SelectItem>
      <SelectSeparator />
      <SelectItem value="rtl">Return to launch</SelectItem>
      <SelectItem value="land">Land</SelectItem>
      <SelectItem value="manual" disabled>Manual (locked)</SelectItem>
    </SelectContent>
  </Select>
</div>

```vue
<Select>
  <SelectTrigger class="w-56">
    <SelectValue placeholder="Flight mode" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="auto">Auto</SelectItem>
    <SelectItem value="loiter">Loiter</SelectItem>
    <SelectSeparator />
    <SelectItem value="rtl">Return to launch</SelectItem>
    <SelectItem value="land">Land</SelectItem>
    <SelectItem value="manual" disabled>Manual (locked)</SelectItem>
  </SelectContent>
</Select>
```

A `disabled` `<SelectItem>` stays visible but can't be chosen or focused — use it when an option exists but isn't available in the current state, not to hide it entirely.

### Disabled trigger

Set `disabled` on `<Select>` to gate the whole control when there's no valid choice to make yet.

<div class="auxiliary-demo">
  <Select disabled>
    <SelectTrigger class="w-48">
      <SelectValue placeholder="Select mode" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="manual">Manual</SelectItem>
      <SelectItem value="auto">Auto</SelectItem>
    </SelectContent>
  </Select>
</div>

```vue
<Select disabled>
  <SelectTrigger class="w-48">
    <SelectValue placeholder="Select mode" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="manual">Manual</SelectItem>
    <SelectItem value="auto">Auto</SelectItem>
  </SelectContent>
</Select>
```

## Props

### Select

<PropsTable name="Select" />

`<Select>` forwards the full Reka UI `SelectRoot` API — `multiple`, `by`, `dir`, `name`, `required`, `autocomplete` — and emits `update:modelValue` and `update:open`.

### SelectTrigger

<PropsTable name="SelectTrigger" />

`SelectTrigger` takes no props of its own (besides `class`, forwarded to the recipe). It's the clickable button that opens the listbox; put a `<SelectValue>` inside it.

### SelectValue

<PropsTable name="SelectValue" />

### SelectContent

<PropsTable name="SelectContent" />

`SelectContent` portals into the document body and positions itself with `position="popper"` by default. Pass `side` and `sideOffset` to control where it opens relative to the trigger.

### SelectItem

<PropsTable name="SelectItem" />

`value` is required and must be unique within the list — it's what `v-model` reports. A checkmark indicator renders automatically on the selected item.

### SelectSeparator

<PropsTable name="SelectSeparator" />

`SelectSeparator` takes no props (besides `class`). It's a decorative divider between groups of items.

## Accessibility

- The trigger exposes the chosen value through Reka UI's `role="combobox"` semantics; `SelectContent` carries `role="listbox"` and each `SelectItem` is an `option`. Keyboard users get the native pattern for free.
- **`SelectContent` needs an accessible name.** Because the listbox root is the element that carries the role, fallthrough attributes (`aria-label`, `aria-labelledby`) are forwarded onto it rather than the renderless portal. When the trigger has no visible label, give the content an `aria-label`:

```vue
<SelectContent aria-label="Vehicle mode">
  <SelectItem value="auto">Auto</SelectItem>
</SelectContent>
```

- Pair the trigger with a `<Label>` via `for`/`id` so the control announces its purpose. The `id` lands on `SelectTrigger`:

```vue
<Label for="vehicle-mode">Vehicle mode</Label>
<Select v-model="vehicleMode">
  <SelectTrigger id="vehicle-mode" class="w-48">
    <SelectValue placeholder="Select mode" />
  </SelectTrigger>
  <!-- … -->
</Select>
```

- **Keyboard:** `Space`/`Enter` opens the list; `↑`/`↓` move between options; `Home`/`End` jump to the ends; type-ahead matches item text; `Esc` closes without changing the value; `Tab` moves focus on. Focus returns to the trigger when the list closes.
- The chevron and the selected-item checkmark are both `aria-hidden` — they're decorative; the value and option text carry the meaning.
- `disabled` items are removed from the focus order, so keyboard and screen-reader users skip them rather than landing on a dead option.
