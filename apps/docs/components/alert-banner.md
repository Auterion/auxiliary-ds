# AlertBanner

A full-width, severity-coded banner built on the `alertBanner` recipe and bound to the **alarm hierarchy** ([FAA 14 CFR Part 25.1322](/foundations/colors#alarm-hierarchy) compliant). Use it for a persistent, in-flight condition that needs to stay on screen and be acknowledged — not a transient toast.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.5rem;">
  <AlertBanner
    level="alarm"
    title="Telemetry link lost"
    description="No packets received for 3.4s. Failsafe will trigger in 5s."
    action-label="Override"
  />
  <AlertBanner
    level="warning"
    title="Battery below 30%"
    description="Estimated 4 minutes of flight remaining at current draw."
    dismissible
  />
  <AlertBanner
    level="nominal"
    title="Mission complete"
    description="All 5 waypoints reached. Vehicle returning to home."
  />
</div>

## When to use

- For a **persistent operational condition** that must stay visible until it resolves or the operator acts — link loss, low battery, geofence breach, exceeded wind limits.
- When the change is **severe enough to interrupt** the current task. The `role="alert"` makes a screen reader announce it the moment it mounts.
- When the user may need to **respond inline** — pass `actionLabel` to surface a single primary response (Override, Acknowledge, Return home).
- For conditions that map cleanly onto the five-level alarm hierarchy.

## When *not* to use

- For **transient, self-dismissing notifications** ("Saved", "Copied to clipboard") — reach for `<Toast>`. AlertBanner is deliberately persistent; it does not auto-dismiss.
- For **compact inline state** in a telemetry strip or table cell — use `<StatusBadge>`. A banner is a full-width block; a badge is a pill.
- For **non-operational status** like "draft / published / archived" — that's domain status, not an alarm tier. Use `<Badge>` or a custom chip.
- As a **modal interrupt** that blocks the whole UI — if the user must resolve it before doing anything else, use `<Dialog>` instead.

## Props

<PropsTable name="AlertBanner" />

The component emits `dismiss` (when the close button is clicked, shown only with `dismissible`) and `action` (when the `actionLabel` button is clicked). It exposes `title` and default (description) slots so you can pass rich content instead of plain strings.

## Examples

### Level matrix

Every level renders a distinct grayscale glyph (octagon, triangle, diamond, circle-i, circle-check) so severity is legible without color.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.5rem;">
  <AlertBanner level="alarm" title="Alarm" description="Immediate action required." />
  <AlertBanner level="warning" title="Warning" description="Action required soon." />
  <AlertBanner level="caution" title="Caution" description="Be aware of this condition." />
  <AlertBanner level="advisory" title="Advisory" description="Informational state change." />
  <AlertBanner level="nominal" title="Nominal" description="Operating within limits." />
</div>

```vue
<AlertBanner level="alarm" title="Alarm" description="Immediate action required." />
<AlertBanner level="warning" title="Warning" description="Action required soon." />
<AlertBanner level="caution" title="Caution" description="Be aware of this condition." />
<AlertBanner level="advisory" title="Advisory" description="Informational state change." />
<AlertBanner level="nominal" title="Nominal" description="Operating within limits." />
```

### With an inline action

`actionLabel` renders a single text button on the trailing edge and emits `action` on click. Use it for the one response that resolves the condition.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch;">
  <AlertBanner
    level="alarm"
    title="Telemetry link lost"
    description="No packets received for 3.4s. Failsafe will trigger in 5s."
    action-label="Override"
  />
</div>

```vue
<AlertBanner
  level="alarm"
  title="Telemetry link lost"
  description="No packets received for 3.4s. Failsafe will trigger in 5s."
  action-label="Override"
  @action="overrideFailsafe"
/>
```

### Dismissible

Set `dismissible` to add a close button that emits `dismiss`. The component does not hide itself — you own the visibility state, so the parent decides whether dismissing is allowed.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch;">
  <AlertBanner
    level="advisory"
    title="New waypoint queued"
    description="WP-06 (47.380° N, 8.543° E) added from ground station."
    dismissible
  />
</div>

```vue
<AlertBanner
  v-if="showWaypointNotice"
  level="advisory"
  title="New waypoint queued"
  description="WP-06 (47.380° N, 8.543° E) added from ground station."
  dismissible
  @dismiss="showWaypointNotice = false"
/>
```

Reserve `dismissible` for advisory and nominal conditions. An active `alarm` should not be dismissible — the operator can act on it, but they shouldn't be able to wave it away while it's still live.

### Title only

`title` and `description` are both optional. A title alone reads as a terse status line.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch;">
  <AlertBanner level="caution" title="Wind exceeds operational limits" />
</div>

```vue
<AlertBanner level="caution" title="Wind exceeds operational limits" />
```

## Accessibility

- The banner is `role="alert"`, so assistive tech announces it as soon as it mounts. Mount it **when the condition occurs** — don't render it hidden and toggle it, or the announcement won't fire.
- The level is **never color-only**. A visually-hidden label ("Alarm", "Warning", …) is always rendered first inside the banner, so a screen reader hears the severity even when no `title` is supplied. This meets WCAG 1.4.1.
- The severity **glyph is `aria-hidden="true"`** — it's a decorative, grayscale-distinct shape (octagon → triangle → diamond → circle-i → circle-check) that conveys level to sighted and color-blind users alike; the visible text and the sr-only label carry the meaning to AT.
- The dismiss button has a fixed `aria-label="Dismiss"`. Both the action and dismiss buttons are `type="button"` (they won't submit a surrounding form) and show a `ring-2 ring-ring` focus ring on `:focus-visible`, so keyboard users can reach and operate them.
- For a *time-critical* alarm that must be felt instantly, pair the banner with an audible or haptic cue at the application level — the visual banner and ARIA announcement are necessary but not always sufficient under high operator workload.

## Tokens consumed

The `alertBanner` recipe binds each level to its alarm-hierarchy color trio — background, readable foreground, and border. Change the underlying values in [`@auxiliary/tokens`](/foundations/colors) and every banner updates automatically:

| Level | Background | Text | Border |
| --- | --- | --- | --- |
| `alarm` | `--alarm` | `--alarm-foreground` | `--alarm` |
| `warning` | `--warning` | `--warning-foreground` | `--warning` |
| `caution` | `--caution` | `--caution-foreground` | `--caution` |
| `advisory` | `--advisory` | `--advisory-foreground` | `--advisory` |
| `nominal` | `--nominal` | `--nominal-foreground` | `--nominal` |

Plus `--ring` (focus outline on the action and dismiss buttons) and `--radius-md` (corner radius). All five levels are constrained by regulation — see [Foundations → Colors → Alarm hierarchy](/foundations/colors#alarm-hierarchy) for the citations.
