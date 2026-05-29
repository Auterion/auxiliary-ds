# Textarea

A native `<textarea>` styled by the `textarea` recipe — a single, unadorned multi-line input bound to the form tokens. No variants, no sizes; the only knob is `rows`.

<div class="auxiliary-demo">
  <Textarea placeholder="Free-text instructions on link-loss behavior…" :rows="4" style="max-width: 28rem;" />
</div>

## When to use

- For **free-form, multi-line text** — operator notes, mission descriptions, failsafe instructions, anything where a single line won't do.
- When the expected input is open-ended prose rather than a constrained value. If the answer is a number, a date, or one of a few options, reach for a more specific control.
- Paired with a `<Label>` so the field has an accessible name (see [Accessibility](#accessibility)).

## When *not* to use

- For **single-line input** — use a text `<input>`. A one-row textarea invites accidental newlines and resizing where neither is wanted.
- For **a fixed set of choices** — use `<Select>`, `<RadioGroup>`, or `<Checkbox>`. Don't ask users to type what they could pick.
- For **rich text** (bold, links, mentions) — Textarea is plain text only. A rich editor is a different component with a different contract.

## Props

<PropsTable name="Textarea" />

The component forwards `$attrs`, so `aria-*`, `data-*`, `maxlength`, `name`, `required` etc. all pass through to the underlying `<textarea>`. It is a controlled input: bind `v-model` (or `:modelValue` + `@update:modelValue`) to drive its value.

## Examples

### Basic with v-model

<div class="auxiliary-demo">
  <Textarea placeholder="Operator notes…" :rows="4" style="max-width: 28rem;" />
</div>

```vue
<script setup>
import { ref } from 'vue'
const notes = ref('')
</script>

<template>
  <Textarea v-model="notes" placeholder="Operator notes…" :rows="4" />
</template>
```

`modelValue` is the value; every keystroke emits `update:modelValue`, which `v-model` wires up for you.

### Sizing with `rows`

<div class="auxiliary-demo" style="flex-direction: column; align-items: stretch; gap: 0.75rem; max-width: 28rem;">
  <Textarea placeholder="2 rows" :rows="2" />
  <Textarea placeholder="6 rows" :rows="6" />
</div>

```vue
<Textarea placeholder="2 rows" :rows="2" />
<Textarea placeholder="6 rows" :rows="6" />
```

`rows` sets the initial visible height (default `4`). The field stays vertically resizable by the user (`resize-y`), so `rows` is a starting point, not a cap.

### Labelled field

<div class="auxiliary-demo" style="flex-direction: column; align-items: stretch; gap: 0.5rem; max-width: 28rem;">
  <Label for="failsafe-demo">Failsafe note (operator)</Label>
  <Textarea id="failsafe-demo" placeholder="Free-text instructions on link-loss behavior…" :rows="3" />
</div>

```vue
<Label for="failsafe">Failsafe note (operator)</Label>
<Textarea
  id="failsafe"
  v-model="failsafeNote"
  placeholder="Free-text instructions on link-loss behavior…"
  :rows="3"
/>
```

Wiring the `<Label>`'s `for` to the Textarea's `id` is what makes the label clickable and gives the field its accessible name.

### Disabled

<div class="auxiliary-demo">
  <Textarea placeholder="Read-only context" :rows="3" disabled style="max-width: 28rem;" />
</div>

```vue
<Textarea placeholder="Read-only context" :rows="3" disabled />
```

`disabled` drops opacity to 50%, blocks input, and sets a not-allowed cursor.

## Accessibility

- The component renders a real `<textarea>`, so native keyboard behaviour (typing, multi-line entry, browser spellcheck, copy/paste) works without any extra wiring.
- Give every Textarea an accessible name. Prefer a `<Label for="…">` tied to the field's `id`; if no visible label fits, pass `aria-label` (forwarded via `$attrs`). `placeholder` is **not** an accessible name — it vanishes on input and is read inconsistently by assistive tech.
- The focus ring is `ring-2 ring-ring`, shown only on `:focus-visible`, so keyboard focus is visible while mouse clicks stay quiet.
- `disabled` removes the field from the tab order and is exposed to assistive tech via the native attribute.

## Tokens consumed

The textarea recipe binds these semantic tokens — change the values in [`@auxiliary/tokens`](/foundations/colors) and Textarea updates automatically:

| Role | Token |
| --- | --- |
| Background | `--background` |
| Text | `--foreground` |
| Placeholder text | `--muted-foreground` |
| Border | `--input` |
| Focus ring | `--ring` |
| Corner radius | `--radius-md` |
