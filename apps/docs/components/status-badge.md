# StatusBadge

A pill-shaped, 5-level operational status indicator built on the `statusBadge` recipe and bound to the **alarm hierarchy** ([FAA 14 CFR Part 25.1322](/foundations/colors#alarm-hierarchy) compliant). Color is never the only signal: each level also carries a grayscale-distinct glyph and an always-rendered, screen-reader-only level label. Use it for live state — link, battery, GPS, mission, vehicle.

<div class="auxiliary-demo">
  <StatusBadge level="alarm" dot>Link lost</StatusBadge>
  <StatusBadge level="warning" dot>Battery 18%</StatusBadge>
  <StatusBadge level="caution" dot>Wind 11 m/s</StatusBadge>
  <StatusBadge level="advisory" dot>Out of range</StatusBadge>
  <StatusBadge level="nominal" dot>All systems go</StatusBadge>
</div>

## When to use

- For **live operational state** that changes during a session — link health, battery level, vehicle mode, mission phase.
- When the badge color carries the meaning and a screen reader will read the label — pair `<StatusBadge>` with descriptive text inside the slot.
- In dense telemetry strips where the pill shape signals "this is a state indicator, not a static tag."

## When *not* to use

- For **metadata or static labels** — reach for `<Badge>` instead. Pills (StatusBadge) signal live state; rounded squares (Badge) signal labels. Don't blur that distinction.
- For **persistent system identity** like version numbers (`v1.0`) or environment tags (`staging`) — those are Badge, not StatusBadge.
- For **non-operational status that doesn't map to the alarm hierarchy** — if a UI state is "draft / published / archived," that's domain status, not alarm tier; use Badge or a custom chip.

## Examples

### Solid variant (default)

The per-level glyph is on by default — an octagon for `alarm`, triangle for `warning`, diamond for `caution`, info circle for `advisory`, check circle for `nominal`. The shapes are grayscale-distinct, so the level reads even without color.

<div class="auxiliary-demo">
  <StatusBadge level="alarm">Alarm</StatusBadge>
  <StatusBadge level="warning">Warning</StatusBadge>
  <StatusBadge level="caution">Caution</StatusBadge>
  <StatusBadge level="advisory">Advisory</StatusBadge>
  <StatusBadge level="nominal">Nominal</StatusBadge>
</div>

```vue
<StatusBadge level="alarm">Alarm</StatusBadge>
<StatusBadge level="warning">Warning</StatusBadge>
<StatusBadge level="caution">Caution</StatusBadge>
<StatusBadge level="advisory">Advisory</StatusBadge>
<StatusBadge level="nominal">Nominal</StatusBadge>
```

### Outline variant

<div class="auxiliary-demo">
  <StatusBadge level="alarm" variant="outline">Alarm</StatusBadge>
  <StatusBadge level="warning" variant="outline">Warning</StatusBadge>
  <StatusBadge level="caution" variant="outline">Caution</StatusBadge>
  <StatusBadge level="advisory" variant="outline">Advisory</StatusBadge>
  <StatusBadge level="nominal" variant="outline">Nominal</StatusBadge>
</div>

```vue
<StatusBadge level="alarm" variant="outline">Alarm</StatusBadge>
```

Outline reads as quieter — use when the surrounding surface already carries a colored fill, or when many badges sit in a dense row.

### With dot

<div class="auxiliary-demo">
  <StatusBadge level="alarm" dot>Link lost</StatusBadge>
  <StatusBadge level="warning" dot>Battery 18%</StatusBadge>
  <StatusBadge level="nominal" dot variant="outline">12 sats</StatusBadge>
</div>

```vue
<StatusBadge level="alarm" dot>Link lost</StatusBadge>
<StatusBadge level="nominal" dot variant="outline">12 sats</StatusBadge>
```

The dot adds a leading "live" indicator next to the glyph — useful when multiple badges share the same row and the eye needs an anchor. On solid it uses the foreground color; on outline it matches the level color.

### Without the glyph

Set `:icon="false"` to drop the leading shape — the dot and slot text remain, and the level is still announced to assistive tech via the hidden label. Reach for this only in space-constrained rows where the dot alone is enough of a cue.

<div class="auxiliary-demo">
  <StatusBadge level="alarm" :icon="false" dot>Lost</StatusBadge>
  <StatusBadge level="warning" :icon="false" dot>Low</StatusBadge>
  <StatusBadge level="nominal" :icon="false" dot>OK</StatusBadge>
</div>

```vue
<StatusBadge level="alarm" :icon="false" dot>Lost</StatusBadge>
<StatusBadge level="warning" :icon="false" dot>Low</StatusBadge>
<StatusBadge level="nominal" :icon="false" dot>OK</StatusBadge>
```

### In situ

<div class="auxiliary-demo" style="flex-direction: column; align-items: flex-start; gap: 0.75rem;">
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <span style="font-size: 0.875rem; color: var(--muted-foreground);">Link status:</span>
    <StatusBadge level="alarm" size="sm" dot>Lost</StatusBadge>
  </div>
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <span style="font-size: 0.875rem; color: var(--muted-foreground);">Battery:</span>
    <StatusBadge level="warning" size="sm" dot>Low</StatusBadge>
  </div>
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <span style="font-size: 0.875rem; color: var(--muted-foreground);">GPS:</span>
    <StatusBadge level="nominal" size="sm" dot>12 sats</StatusBadge>
  </div>
</div>

The `size="sm"` variant (20 px tall) is the right call for telemetry strips where multiple labels stack vertically.

## Props

<PropsTable name="StatusBadge" />

`level` accepts the five alarm tiers (`alarm`, `warning`, `caution`, `advisory`, `nominal`). The component forwards `class` and merges it via `cn()`, so you can extend layout without overriding the recipe's color bindings.

## Accessibility

- The badge renders as a `<span>` with the slot content read inline. A **visually-hidden level label is always rendered** (e.g. "Alarm", "Nominal") ahead of the slot, so the alarm tier is announced even when the slot text is empty or non-descriptive. Override it with `label` when the default English word isn't what you want screen readers to hear.
- **Color is never the only cue.** Beyond the hidden label, each level draws a grayscale-distinct glyph (octagon, triangle, diamond, info circle, check circle), so the severity is legible to color-blind users and in monochrome. This satisfies WCAG 1.4.1 (Use of Color) without relying on the consumer to add text — though descriptive slot text ("Battery 18%") is still the right call.
- The decorative glyph (`<svg>`) and the dot are both `aria-hidden="true"` — the hidden label and slot text are what carry meaning to assistive tech.
- For *time-critical* alarm states that need to interrupt the user (link lost, geofence breach), don't rely on the badge alone — pair it with a `<Toast>` or `<AlertBanner>` so the change announces itself via ARIA live regions.

## Tokens consumed

Each level binds three semantic tokens — the background, the readable foreground, and (used only by the outline variant) the border. The glyph and dot inherit these in lockstep via the recipe's compound variants:

| Level | Solid bg | Solid text | Outline border/text |
| --- | --- | --- | --- |
| `alarm` | `--alarm` | `--alarm-foreground` | `--alarm` |
| `warning` | `--warning` | `--warning-foreground` | `--warning` |
| `caution` | `--caution` | `--caution-foreground` | `--caution` |
| `advisory` | `--advisory` | `--advisory-foreground` | `--advisory` |
| `nominal` | `--nominal` | `--nominal-foreground` | `--nominal` |

All five are constrained by regulation. See [Foundations → Colors → Alarm hierarchy](/foundations/colors#alarm-hierarchy) for the citations.
