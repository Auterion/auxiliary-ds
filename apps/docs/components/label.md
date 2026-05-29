# Label

A native `<label>` styled by the `label` recipe — muted, medium-weight caption type that binds a caption to a form control via the `for` prop.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: flex-start; gap: 0.375rem;">
  <Label for="hero-callsign">Callsign</Label>
  <Input id="hero-callsign" placeholder="MSN-..." />
</div>

## When to use

- To caption any form control — `<Input>`, `<Textarea>`, `<Select>`, `<Checkbox>`, `<Switch>`, `<Slider>`. Always pair a control with a label.
- When you want the click target extended to the caption: clicking a `<Label>` wired with `for` focuses (or toggles) its control for free.
- For the visible name that a screen reader announces when the control gains focus.

## When *not* to use

- For section headings or group titles — those are `<h2>`…`<h6>`, not labels. A label names a single control, not a region.
- For help text, hints, or validation messages — use a plain `<p>` (and wire it with `aria-describedby`). The label is the name; describing text is separate.
- For the legend of a radio or checkbox group — that's a `<fieldset>`/`<legend>` (or a labelled `role="group"`). A single `<Label>` can title the group visually, but it does not replace the grouping semantics.

## Props

<PropsTable name="Label" />

The component forwards `$attrs` and accepts `class`, so `id`, `data-*`, and extra utility classes (e.g. `class="mb-2 block"`) all just work. The default slot accepts rich markup, not just text.

## Examples

### With a text input

The most common pattern: a stacked label + control. Wiring `for` to the control's `id` makes the caption part of the input's click target.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: flex-start; gap: 0.375rem;">
  <Label for="ex-altitude">Altitude (m)</Label>
  <Input id="ex-altitude" type="number" placeholder="408" />
</div>

```vue
<Label for="altitude">Altitude (m)</Label>
<Input id="altitude" type="number" placeholder="408" />
```

### Inline with a toggle

For checkboxes and switches, lay the label beside the control. Because `for` points at the control's `id`, clicking the text flips the toggle.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: flex-start; gap: 0.75rem;">
  <div style="display: flex; align-items: center; gap: 0.75rem;">
    <Checkbox id="ex-armed" />
    <Label for="ex-armed">Arm vehicle on launch</Label>
  </div>
  <div style="display: flex; align-items: center; gap: 0.75rem;">
    <Switch id="ex-geofence" />
    <Label for="ex-geofence">Geofence active</Label>
  </div>
</div>

```vue
<Checkbox id="armed" v-model="armed" />
<Label for="armed">Arm vehicle on launch</Label>

<Switch id="geofence" v-model="geofenceEnabled" />
<Label for="geofence">Geofence active</Label>
```

### Rich slot content

The slot renders any markup, so a label can carry a live value or a required marker alongside its text. Use `class="mb-2 block"` to give it spacing and full width above a control.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: flex-start; gap: 0.375rem;">
  <Label for="ex-maxalt" class="mb-2 block">
    Max altitude
    <span style="font-family: var(--font-mono, monospace); font-size: 0.75rem; margin-left: 0.5rem;">120 m</span>
  </Label>
  <Slider id="ex-maxalt" :modelValue="[120]" :min="10" :max="400" :step="10" style="width: 16rem;" />
</div>

```vue
<Label for="max-alt" class="mb-2 block">
  Max altitude
  <span class="font-mono tabular text-xs text-muted-foreground ml-2">
    {{ maxAltitude[0] }} m
  </span>
</Label>
<Slider id="max-alt" v-model="maxAltitude" :min="10" :max="400" :step="10" />
```

## Accessibility

- Renders a real `<label>` element — no `role` override. When `for` matches a control's `id`, assistive tech announces the label as that control's accessible name, and the label becomes part of the control's click/tap target.
- Always provide `for` (or wrap the control inside the label). A `<Label>` with no association is just styled text and gives the control no accessible name.
- For checkboxes and switches, prefer the explicit `for` + `id` pairing over relying on layout proximity — proximity is a visual cue, not a programmatic one.
- The default type is `text-muted-foreground`. Keep label text against a background that clears WCAG 1.4.3 contrast (4.5:1) — on very low-contrast surfaces, raise the surface or text token rather than dropping below the threshold.

## Tokens consumed

The label recipe binds typography and color to semantic tokens, so a theme change updates every label automatically:

| Aspect | Value | Token |
| --- | --- | --- |
| Text color | muted caption | `--muted-foreground` |
| Font size | `text-sm` | `--text-sm` |
| Weight | `font-medium` (500) | `--font-weight-medium` |
