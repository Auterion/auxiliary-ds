# Slider

A horizontal (or vertical) track for picking a number from a continuous range, built on Reka UI's `Slider` primitive and styled by the `slider` recipe. Its value is always an array of numbers — one thumb per entry — so the same component covers single-value and range selection.

<div class="auxiliary-demo vp-raw">
  <Slider :defaultValue="[160]" :min="10" :max="400" :step="10" aria-label="Max altitude" style="width: 280px;" />
</div>

## When to use

- For choosing a number from a bounded, continuous range where the exact value matters less than the relative position — max altitude, opacity, volume, playback speed.
- For a **range** selection (two thumbs) when the user picks a lower and upper bound — a time window, a price band, an altitude floor and ceiling.
- When direct manipulation is faster than typing — coarse adjustments where a few units of imprecision are acceptable.

## When *not* to use

- For a precise numeric entry where the user knows the value they want — use a number input. Sliders are bad at hitting an exact target.
- For an unbounded or very large range — a slider needs a meaningful `min`/`max`. If the range is "any positive integer," reach for an input.
- For a binary or small discrete choice — use `<Switch>`, `<Checkbox>`, or `<RadioGroup>`. A two-position slider is a worse toggle.
- As the *only* affordance for a safety-critical value. Pair the slider with a visible numeric readout (and ideally a typed input) so the operator can confirm the exact figure.

## Examples

### Single value with a label and readout

A slider carries no visible value of its own — bind it to state and render the number yourself. This is the pattern from the demo's mission form.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.5rem; max-width: 320px;">
  <Slider :defaultValue="[160]" :min="10" :max="400" :step="10" aria-label="Max altitude" />
</div>

```vue
<script setup>
import { ref } from 'vue'
const maxAltitude = ref([160])
</script>

<template>
  <Label for="max-alt" class="mb-2 block">
    Max altitude
    <span class="font-mono text-xs text-muted-foreground ml-2">{{ maxAltitude[0] }} m</span>
  </Label>
  <Slider id="max-alt" v-model="maxAltitude" :min="10" :max="400" :step="10" />
</template>
```

`v-model` binds an array — `maxAltitude[0]` is the single thumb's value. The `:step="10"` snaps the value to ten-metre increments.

### Range with two thumbs

Give `defaultValue` (or `v-model`) two entries and the component renders two thumbs. `minStepsBetweenThumbs` keeps them from crossing.

<div class="auxiliary-demo vp-raw" style="max-width: 320px;">
  <Slider :defaultValue="[40, 80]" :min="0" :max="100" :minStepsBetweenThumbs="1" aria-label="Operating band" style="width: 280px;" />
</div>

```vue
<Slider
  v-model="band"
  :min="0"
  :max="100"
  :minStepsBetweenThumbs="1"
/>
<!-- band = [40, 80] -->
```

### Stepped

A larger `step` turns the continuous track into discrete stops — useful when only round values make sense.

<div class="auxiliary-demo vp-raw" style="max-width: 320px;">
  <Slider :defaultValue="[50]" :min="0" :max="100" :step="25" aria-label="Quality" style="width: 280px;" />
</div>

```vue
<Slider :defaultValue="[50]" :min="0" :max="100" :step="25" />
```

### Disabled

<div class="auxiliary-demo vp-raw" style="max-width: 320px;">
  <Slider :defaultValue="[30]" :disabled="true" aria-label="Locked value" style="width: 280px;" />
</div>

```vue
<Slider :defaultValue="[30]" :disabled="true" />
```

`disabled` dims the thumb and blocks pointer and keyboard interaction.

## Props

<PropsTable name="Slider" />

The value is **always an array** (`number[]`), one element per thumb — even for a single-thumb slider. `update:modelValue` fires on every change (drag, key); `valueCommit` fires once when the user releases the thumb, which is the right event to hook for expensive side effects. Forwarded Reka UI props like `min`, `max`, `step`, `orientation`, `inverted`, and `dir` are listed above.

## Accessibility

- Each thumb renders with `role="slider"` and the live `aria-valuenow` / `aria-valuemin` / `aria-valuemax` attributes Reka UI manages from `min`/`max`/`step`.
- An accessible name is **required** but the root is a role-less `<span>` where `aria-label` is a prohibited attribute — so the component routes `aria-label` / `aria-labelledby` onto the thumb(s) for you. Always pass one, either via `aria-label` or by associating a `<Label>` with `aria-labelledby`.
- Keyboard: <kbd>←</kbd>/<kbd>→</kbd> (and <kbd>↑</kbd>/<kbd>↓</kbd>) move by one `step`; <kbd>PageUp</kbd>/<kbd>PageDown</kbd> jump by a larger increment; <kbd>Home</kbd>/<kbd>End</kbd> go to `min`/`max`.
- Focus ring is `ring-2 ring-ring` on the thumb, shown on `:focus-visible` so mouse interaction stays quiet while keyboard navigation is visible.
- The slider does not render its own numeric label. Because the value is conveyed visually by thumb position, pair it with a visible readout so the current value is available as text, not just position.

## Tokens consumed

The slider recipe binds these semantic tokens — change the values in [`@auxiliary/tokens`](/foundations/colors) and the slider follows:

| Part | Token | Role |
| --- | --- | --- |
| Track | `--background` | The unfilled rail |
| Range | `--primary` | The filled portion from `min` to the thumb |
| Thumb | `--background` fill, `--primary` border | The draggable handle |
| Focus ring | `--ring` | Keyboard focus outline on the thumb |

Corners use the fully-rounded radius on both track and thumb.
