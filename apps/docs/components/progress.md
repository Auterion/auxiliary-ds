# Progress

A determinate (or indeterminate) bar built on Reka UI's `ProgressRoot` and styled by the `progress` recipe. With no `level` the fill uses `--primary`; pass an alarm tier to recolor it.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <Progress :value="74" />
  <Progress :value="42" level="caution" />
  <Progress :value="18" level="warning" />
  <Progress :value="5" level="alarm" />
</div>

## When to use

- For a **task whose completion is measurable** — file upload, firmware flash, mission upload, download.
- For a **bounded telemetry reading** where percent-of-max is the point — battery charge, tank level, signal-against-threshold. Bind `level` so the fill color tracks the alarm tier.
- When you can omit `value` to show an **indeterminate** bar — work is happening but you can't yet quantify how far along it is.

## When *not* to use

- For an **action in progress with no measurable extent** — a button saving, a panel loading — reach for `<Spinner>`. A bar that can't fill is just a spinner with extra steps.
- For **content placeholders** while data loads — that's `<Skeleton>`.
- As a **live status pill** — if the point is the operational state, not the fraction, use `<StatusBadge>`. Progress communicates "how far," not "what state."

## Examples

### Determinate

`value` is read against `max` (default `100`) and clamped to 0–100%.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <Progress :value="25" />
  <Progress :value="60" />
  <Progress :value="100" />
</div>

```vue
<Progress :value="25" />
<Progress :value="60" />
<Progress :value="100" />
```

### Custom max

`value` doesn't have to be a percentage — set `max` to your domain's scale and Progress does the math.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <Progress :value="3" :max="8" />
</div>

```vue
<!-- 3 of 8 waypoints reached -->
<Progress :value="3" :max="8" />
```

### Alarm-tiered fill

Pass a `level` to recolor the fill from the [alarm hierarchy](/foundations/colors#alarm-hierarchy). Drive it from your own threshold logic so the bar's color matches the reading's severity.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <Progress :value="88" level="nominal" />
  <Progress :value="42" level="caution" />
  <Progress :value="18" level="warning" />
  <Progress :value="5" level="alarm" />
</div>

```vue
<Progress :value="88" level="nominal" />
<Progress :value="42" level="caution" />
<Progress :value="18" level="warning" />
<Progress :value="5" level="alarm" />
```

The color is a redundant cue, not the only one — see [Accessibility](#accessibility).

### Indeterminate

Omit `value` (or pass `null`) and the fill parks off-screen, signalling "in progress, extent unknown."

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <Progress />
</div>

```vue
<Progress />
```

## Props

<PropsTable name="Progress" />

The component forwards `class`, so you can override the track width or height inline. It builds on `ProgressRoot`, which sets the underlying ARIA attributes.

## Accessibility

- `ProgressRoot` renders `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and (when `value` is set) `aria-valuenow`, so assistive tech reads the fraction without extra markup.
- Omitting `value` produces an **indeterminate** bar — Reka UI drops `aria-valuenow` and exposes the indeterminate state, the correct contract for "unknown extent."
- The bar has **no intrinsic accessible name.** When several bars share a view, give each an `aria-label` (e.g. `aria-label="Battery"`) or associate it with a visible label via `aria-labelledby` so the reading isn't ambiguous.
- **Color is never the only cue.** A track has no room for a glyph, so `level` travels through `aria-valuetext` — the level word is announced with the reading ("Caution — 18%") rather than living in the fill hue alone. `aria-valuenow` carries the *fraction*; it never carried the *tier*, which is what the color encodes (WCAG 1.4.1, `AD-D-014`).
- The indicator's `transition-transform` honors the platform reduced-motion preference at the surface level; the fill animates position only, never an attention-seeking loop.

## Tokens consumed

The recipe binds the track and each fill to semantic tokens — change the values in [`@auxiliary/tokens`](/foundations/colors) and Progress updates automatically:

| Part | Token |
| --- | --- |
| Track | `--background` |
| Fill (no `level`) | `--primary` |
| Fill `level="alarm"` | `--alarm` |
| Fill `level="warning"` | `--warning` |
| Fill `level="caution"` | `--caution` |
| Fill `level="advisory"` | `--advisory` |
| Fill `level="nominal"` | `--nominal` |

The five alarm tiers are constrained by regulation. See [Foundations → Colors → Alarm hierarchy](/foundations/colors#alarm-hierarchy) for the citations.
