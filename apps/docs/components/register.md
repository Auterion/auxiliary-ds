# Register

An ergonomic wrapper for the **expressive ↔ operational** duality. It sets the
`data-register` attribute on a subtree, which re-resolves the non-color *flex*
tokens (control height, radius, motion) — the same mechanism `data-theme` uses
for color. See [Registers](/foundations/registers) for the full model.

It is **pure convenience over the attribute**: `<div data-register="operational">`
behaves identically, so `Register` never becomes load-bearing — the token layer
stays the source of truth.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 1rem; max-width: 360px;">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <span style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.6;">expressive (default)</span>
    <div style="display: flex; gap: 0.5rem;">
      <Button>Arm</Button>
      <Input placeholder="Altitude (m)" />
    </div>
  </div>
  <Register>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <span style="font-size: 0.75rem; text-transform: uppercase; opacity: 0.6;">operational</span>
      <div style="display: flex; gap: 0.5rem;">
        <Button>Arm</Button>
        <Input placeholder="Altitude (m)" />
      </div>
    </div>
  </Register>
</div>

## When to use

- To opt a GCS / telemetry / command-and-control surface into the dense,
  tight-cornered, motion-restrained **operational** treatment in one place.
- To wrap a region rather than thread a `density` prop through every control —
  the whole subtree tightens together and stays in rhythm.

## When *not* to use

- On expressive (marketing, web, brand) surfaces — `expressive` is the default,
  so no wrapper is needed.
- As a styling escape hatch — it only flips the register; it does not accept
  arbitrary tokens. Reach for `class` or a recipe variant for one-off styling.
- For color — register never touches color. Use `data-theme` /
  [theming](/foundations/colors) for that.

## Props

<PropsTable name="Register" />

The component forwards `class` onto the rendered element, and `as` lets you pick
the wrapper tag (default `div`).

## Examples

### Opt a subtree into operational

<div class="auxiliary-demo vp-raw">
  <Register style="display: flex; gap: 0.5rem; align-items: center;">
    <Button size="sm">Disarm</Button>
    <Button size="sm" variant="danger">Abort</Button>
  </Register>
</div>

```vue
<Register>
  <Button size="sm">Disarm</Button>
  <Button size="sm" variant="danger">Abort</Button>
</Register>
```

`register` defaults to `operational`, so a bare `<Register>` is the common
opt-in. Equivalent to `<div data-register="operational">`.

### Nest an expressive island

```vue
<Register> <!-- operational region -->
  <TelemetryReadout />
  <Register register="expressive"> <!-- a roomy island inside it -->
    <MarketingCallout />
  </Register>
</Register>
```

Because the axis cascades through `data-register`, you can opt a subtree back
into `expressive` exactly the way you would nest a `data-theme`.

## Accessibility

- **Transparent wrapper.** `Register` renders a single element with no role and
  no interactive behavior — it never appears to assistive tech as anything but
  its content.
- **Motion is shortened, not removed.** The operational register shortens
  durations; it never zeroes them. `prefers-reduced-motion` remains the
  accessibility override that collapses motion entirely, independent of register.
- **Color and contrast are unchanged.** Register touches only non-color tokens,
  so contrast ratios are identical across registers — switching one never
  degrades legibility.

## Tokens consumed

Register sets no tokens itself; it switches which *flex* tokens resolve. Under
`data-register="operational"`:

| Aspect | Token | Expressive → Operational |
| --- | --- | --- |
| Control height | `--control-height-{sm,md,lg}` | 32/36/40 → 28/32/36 px |
| Radius | `--radius-{sm,md,lg}` | 4/6/8 → 2/4/6 px |
| Motion duration | `--duration-{fast,base,slow}` | 120/200/320 → 80/120/200 ms |
