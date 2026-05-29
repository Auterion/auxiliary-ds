# Combobox

A type-ahead select — an input that filters a list as you type, built on Reka UI's headless `Combobox`. For large option sets (vehicle IDs, waypoints, frequencies, payloads) where scanning a plain `<Select>` is too slow.

<div class="auxiliary-demo vp-raw" style="max-width: 18rem;">
  <Combobox>
    <ComboboxInput placeholder="Search units…" aria-label="Unit system" />
    <ComboboxContent>
      <ComboboxEmpty />
      <ComboboxItem value="metric">Metric</ComboboxItem>
      <ComboboxItem value="imperial">Imperial</ComboboxItem>
      <ComboboxItem value="nautical">Nautical</ComboboxItem>
    </ComboboxContent>
  </Combobox>
</div>

## When to use

- For picking one value from a **large** set where typing to filter is faster than scrolling — vehicle/asset IDs, waypoints, frequencies, airports.
- When the user knows roughly what they want and can type toward it.

## When *not* to use

- For a **small**, fixed set (≤ ~7 options) — a plain `<Select>` is simpler and needs no typing.
- For free-form text that isn't constrained to a list — that's `<Input>`.
- For multi-line or numeric entry — `<Textarea>` / `<NumberField>`.

## Examples

### Basic

Uncontrolled — the Combobox manages its own open/value state, and typing filters the list automatically.

```vue
<Combobox>
  <ComboboxInput placeholder="Search units…" aria-label="Unit system" />
  <ComboboxContent>
    <ComboboxEmpty />
    <ComboboxItem value="metric">Metric</ComboboxItem>
    <ComboboxItem value="imperial">Imperial</ComboboxItem>
    <ComboboxItem value="nautical">Nautical</ComboboxItem>
  </ComboboxContent>
</Combobox>
```

### Bound with v-model

```vue
<script setup>
import { ref } from 'vue'
const unit = ref('metric')
</script>

<template>
  <Combobox v-model="unit">
    <ComboboxInput placeholder="Search units…" aria-label="Unit system" />
    <ComboboxContent>
      <ComboboxEmpty>No matching unit.</ComboboxEmpty>
      <ComboboxItem value="metric">Metric</ComboboxItem>
      <ComboboxItem value="imperial">Imperial</ComboboxItem>
    </ComboboxContent>
  </Combobox>
</template>
```

### Sizes and invalid

`ComboboxInput` shares the form-control `size` (`sm | md | lg`) and `invalid` vocabulary with `<Input>` / `<Select>`.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.75rem; max-width: 18rem;">
  <Combobox>
    <ComboboxInput size="sm" placeholder="Small" aria-label="Small" />
    <ComboboxContent><ComboboxItem value="a">Alpha</ComboboxItem><ComboboxItem value="b">Bravo</ComboboxItem></ComboboxContent>
  </Combobox>
  <Combobox>
    <ComboboxInput invalid placeholder="Invalid" aria-label="Invalid" />
    <ComboboxContent><ComboboxItem value="a">Alpha</ComboboxItem><ComboboxItem value="b">Bravo</ComboboxItem></ComboboxContent>
  </Combobox>
</div>

```vue
<ComboboxInput size="sm" aria-label="…" />
<ComboboxInput invalid aria-label="…" />
```

## Props

### Combobox

<PropsTable name="Combobox" />

### ComboboxInput

<PropsTable name="ComboboxInput" />

`ComboboxInput` forwards `$attrs` (notably `aria-label` / `id`) onto the underlying `role="combobox"` input, so name it with `aria-label` or a `<Label for>` matching an `id`.

### ComboboxContent

<PropsTable name="ComboboxContent" />

### ComboboxItem

<PropsTable name="ComboboxItem" />

### ComboboxEmpty

<PropsTable name="ComboboxEmpty" />

### ComboboxSeparator

<PropsTable name="ComboboxSeparator" />

## Accessibility

- The input is `role="combobox"`; the list is `role="listbox"` and options are `role="option"` — all wired by Reka, including `aria-expanded`, `aria-controls`, and active-descendant.
- Keyboard: type to filter, ↑/↓ to move through options, Enter to select, Esc to close.
- **Name the input** — `aria-label` (forwarded to the combobox input) or a `<Label for>` + `id`. Without a name the combobox is anonymous to screen readers.
- `invalid` sets `aria-invalid`; pair with an error message via `aria-describedby`.
- `ComboboxEmpty` announces "no results" so a filtered-to-nothing state isn't silent.

## Tokens consumed

| Slot | Token |
| --- | --- |
| Anchor background / border | `--background` / `--input` |
| Value & option text | `--foreground` |
| Placeholder / chevron | `--muted-foreground` |
| List surface | `--popover` / `--border` |
| Highlighted option | `--accent` |
| Focus ring | `--ring` |
| Corner radius | `--radius-md` |
