# StatusBadge

A pill-shaped, 5-level operational status indicator bound to the **alarm hierarchy** ([FAA 14 CFR Part 25.1322](/foundations/colors#alarm-hierarchy) compliant). Use it for live state — link, battery, GPS, mission, vehicle.

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

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `level` | `'alarm' \| 'warning' \| 'caution' \| 'advisory' \| 'nominal'` | required | The alarm tier. Color is bound by `@auxiliary/tokens`. |
| `variant` | `'solid' \| 'outline'` | `'solid'` | Solid = filled pill, outline = border + transparent fill. |
| `size` | `'sm' \| 'md'` | `'md'` | `sm` = 20px tall, 10px text. `md` = 24px tall, 12px text. |
| `dot` | `boolean` | `false` | Adds a leading dot indicator. On solid, the dot uses the foreground color; on outline, it matches the border. |

## Examples

### Solid variant (default)

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

The dot adds a visual indicator that the badge is *live* — useful when multiple badges share the same row and the eye needs an anchor.

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

## Accessibility

- The badge renders as a `<span>` — screen readers read the slot content as inline text. Make sure the slot carries the meaning ("Link lost", "Battery 18%"), not just the level.
- The color alone never carries the meaning. A red pill that says nothing visible to a screen reader is meaningless to a user using a screen reader; meet WCAG 1.4.1 by always including text.
- The dot is `aria-hidden="true"` — it's decorative; the badge text is the assertion.
- For *time-critical* alarm states that need to interrupt the user (link lost, geofence breach), don't rely on the badge alone — pair it with a `<Toast>` or `<AlertBanner>` so the change announces itself via ARIA live regions.

## Tokens consumed

Each level binds three semantic tokens — the background, the readable foreground, and (used only by the outline variant) the border:

| Level | Solid bg | Solid text | Outline border/text |
| --- | --- | --- | --- |
| `alarm` | `--alarm` | `--alarm-foreground` | `--alarm` |
| `warning` | `--warning` | `--warning-foreground` | `--warning` |
| `caution` | `--caution` | `--caution-foreground` | `--caution` |
| `advisory` | `--advisory` | `--advisory-foreground` | `--advisory` |
| `nominal` | `--nominal` | `--nominal-foreground` | `--nominal` |

All five are constrained by regulation. See [Foundations → Colors → Alarm hierarchy](/foundations/colors#alarm-hierarchy) for the citations.
