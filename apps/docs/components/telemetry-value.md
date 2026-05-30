# TelemetryValue

A monospaced, tabular readout for live numeric telemetry — altitude, speed, battery, RSSI — built on the `telemetryValue` recipe. It formats numbers to a fixed precision, aligns digits with `tabular-nums`, and can recolor at a threshold via the **alarm hierarchy**.

<div class="auxiliary-demo vp-raw">
  <TelemetryValue label="Altitude" :value="408.2" unit="m" trend="up" />
  <TelemetryValue label="Ground speed" :value="12.4" unit="m/s" trend="stable" />
  <TelemetryValue label="Heading" :value="247" unit="°" :precision="0" />
  <TelemetryValue label="Battery" :value="74" unit="%" :precision="0" trend="down" />
  <TelemetryValue label="Link" value="LOST" level="alarm" />
</div>

## When to use

- For **live numeric readouts** in a telemetry strip or HUD — altitude, ground speed, heading, battery, satellite count, RSSI.
- When digits change rapidly and the value **must not jiggle** — `tabular-nums` keeps every glyph the same width so the readout stays put as numbers tick.
- When a value crosses an operational threshold and should **recolor** rather than show a separate badge — pass `level` to tint the number red/amber/etc. in place.
- For a pre-formatted string state like `LOST` or `--` that belongs in the same readout row as numeric siblings.

## When *not* to use

- For **operational state that is inherently a label**, not a number — link health, GPS lock, vehicle mode. Reach for `<StatusBadge>`; its pill shape signals "state indicator."
- For **static metadata** (version, serial number, environment) — that's `<Badge>`, not a telemetry readout.
- For **long-form or prose values** — TelemetryValue is tuned for short monospaced figures, not sentences. The mono font and tight leading work against running text.
- As a **progress indicator** — if you're showing completion toward a goal, use `<Progress>`.

## Props

<PropsTable name="TelemetryValue" />

The component renders a `<div>` and forwards `$attrs`, so `id`, `data-*`, and `aria-*` land on the root.

## Examples

### Numeric readouts with units and precision

<div class="auxiliary-demo vp-raw">
  <TelemetryValue label="Altitude" :value="408.2" unit="m" />
  <TelemetryValue label="Heading" :value="247" unit="°" :precision="0" />
  <TelemetryValue label="RSSI" :value="-87" unit="dBm" :precision="0" />
</div>

```vue
<TelemetryValue label="Altitude" :value="408.2" unit="m" />
<TelemetryValue label="Heading" :value="247" unit="°" :precision="0" />
<TelemetryValue label="RSSI" :value="-87" unit="dBm" :precision="0" />
```

`precision` controls decimals for numeric values via `toFixed`. Use `:precision="0"` for whole-number fields like heading or satellite count; the default of `1` suits most analog quantities. Strings are passed through untouched — `precision` is ignored for them.

### Trend arrows

<div class="auxiliary-demo vp-raw">
  <TelemetryValue label="Climb" :value="2.1" unit="m/s" trend="up" />
  <TelemetryValue label="Descent" :value="-1.4" unit="m/s" trend="down" />
  <TelemetryValue label="Cruise" :value="12.4" unit="m/s" trend="stable" />
</div>

```vue
<TelemetryValue label="Climb" :value="2.1" unit="m/s" trend="up" />
<TelemetryValue label="Descent" :value="-1.4" unit="m/s" trend="down" />
<TelemetryValue label="Cruise" :value="12.4" unit="m/s" trend="stable" />
```

`trend` renders a small arrow (`▲` up, `▼` down, `–` stable) after the value, carrying an `aria-label` of `trend up` / `trend down` / `trend stable`. It's a glanceable directional hint, not a delta — it says *which way*, not *how much*.

### Threshold coloring with `level`

<div class="auxiliary-demo vp-raw">
  <TelemetryValue label="Sats" :value="12" :precision="0" level="nominal" />
  <TelemetryValue label="RSSI" :value="-87" unit="dBm" :precision="0" level="caution" />
  <TelemetryValue label="Wind" :value="11.2" unit="m/s" trend="up" level="warning" />
  <TelemetryValue label="Link" value="LOST" level="alarm" />
</div>

```vue
<TelemetryValue label="Sats" :value="12" :precision="0" level="nominal" />
<TelemetryValue label="RSSI" :value="-87" unit="dBm" :precision="0" level="caution" />
<TelemetryValue label="Wind" :value="11.2" unit="m/s" trend="up" level="warning" />
<TelemetryValue label="Link" value="LOST" level="alarm" />
```

`level` recolors the value to the matching alarm tier — drive it from your own threshold logic (e.g. set `level="warning"` once wind exceeds your limit). When `level` is `null` (the default) the value uses `--foreground`.

### Sizes

<div class="auxiliary-demo vp-raw">
  <TelemetryValue label="Battery" :value="74" unit="%" :precision="0" size="sm" />
  <TelemetryValue label="Battery" :value="74" unit="%" :precision="0" size="md" />
  <TelemetryValue label="Battery" :value="74" unit="%" :precision="0" size="lg" />
</div>

```vue
<TelemetryValue :value="74" unit="%" :precision="0" size="sm" />
<TelemetryValue :value="74" unit="%" :precision="0" size="md" />
<TelemetryValue :value="74" unit="%" :precision="0" size="lg" />
```

`size` scales only the value glyph; the label, unit, and trend stay constant. Use `sm` inside dense strips, `lg` for a primary HUD figure that should dominate.

## Unit systems & locale

Pass a `quantity` and the `value` is treated as **canonical SI** (metres, m/s, °C, degrees) and converted to the active unit system — the unit label is derived for you. The system is set **once per deployment** with `<UnitSystemProvider>`; readouts inside it follow along.

<div class="auxiliary-demo vp-raw" style="gap: 2rem;">
  <UnitSystemProvider system="metric">
    <div style="display:flex; gap:1.5rem;">
      <TelemetryValue label="Alt" :value="408" quantity="altitude" />
      <TelemetryValue label="GS" :value="12.4" quantity="speed" />
      <TelemetryValue label="OAT" :value="21" quantity="temperature" />
    </div>
  </UnitSystemProvider>
  <UnitSystemProvider system="imperial">
    <div style="display:flex; gap:1.5rem;">
      <TelemetryValue label="Alt" :value="408" quantity="altitude" />
      <TelemetryValue label="GS" :value="12.4" quantity="speed" />
      <TelemetryValue label="OAT" :value="21" quantity="temperature" />
    </div>
  </UnitSystemProvider>
</div>

```vue
<!-- Set the deployment's unit system once, high in the tree -->
<UnitSystemProvider system="imperial">
  <TelemetryValue label="Alt" :value="408" quantity="altitude" />  <!-- 1339 ft -->
  <TelemetryValue label="GS"  :value="12.4" quantity="speed" />    <!-- 24.1 kn -->
  <TelemetryValue label="OAT" :value="21" quantity="temperature" /><!-- 70°F -->
</UnitSystemProvider>
```

**Imperial means the aviation convention** a GCS expects: altitude in **feet**, speed in **knots**, vertical speed in **ft/min**, temperature in **°F**. The supported quantities are `distance`, `altitude`, `speed`, `verticalSpeed`, `temperature`, and `angle`. A named `unit` override reaches the rest (`km`, `mph`, `NM`, `mils`):

```vue
<TelemetryValue :value="247" quantity="angle" unit="mils" />  <!-- 4391 mils -->
<TelemetryValue :value="2000" quantity="distance" unit="NM" /><!-- 1.08 NM -->
```

`locale` engages `Intl.NumberFormat` for grouping/decimal separators — also a `<UnitSystemProvider>` prop, so a whole deployment localizes at once. It is **opt-in**: with no locale set, numbers format deterministically (no grouping), so existing readouts are unaffected.

```vue
<UnitSystemProvider system="metric" locale="de-DE">
  <TelemetryValue :value="1234.5" quantity="speed" />  <!-- 1.234,5 m/s -->
</UnitSystemProvider>
```

A per-component `system`, `locale`, `unit`, or `precision` prop overrides the provider for that one readout — but per the lexicon, prefer one consistent system per view.

## Accessibility

- The readout is a plain `<div>` of inline `<span>`s, so a screen reader reads it in document order: label, then value, then unit, then trend. Keep `label` set so the number has a name — a bare `408.2 m` with no label is ambiguous out of context.
- The trend arrow is **not** decorative: it carries `aria-label="trend up|down|stable"` so the direction is announced. The glyph alone (`▲`/`▼`/`–`) would not be reliably read otherwise.
- **Color is never the only cue.** `level` tints the value, but the value text itself still carries the meaning — a screen-reader user hears `LOST` or the number regardless of the red. Pair color with the label and value, never lean on the tint alone (WCAG 1.4.1).
- For **time-critical thresholds** (link lost, geofence breach), don't rely on a recolored readout to interrupt the operator — pair it with a `<Toast>` or `<AlertBanner>` that announces via an ARIA live region. A static color change is silent to anyone not looking at that exact field.

## Tokens consumed

The recipe binds semantic tokens — change them in [`@auxiliary/tokens`](/foundations/colors) and every readout updates:

| Part | Token |
| --- | --- |
| Value (default) | `--foreground` |
| Label | `--muted-foreground` |
| Unit | `--muted-foreground` |
| Trend | `--muted-foreground` |

When `level` is set, the value swaps to the matching alarm-tier color — `--alarm`, `--warning`, `--caution`, `--advisory`, or `--nominal`. Those five are constrained by regulation; see [Foundations → Colors → Alarm hierarchy](/foundations/colors#alarm-hierarchy).
