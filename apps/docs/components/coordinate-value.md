# CoordinateValue

A monospaced readout for a **WGS84 position** — latitude/longitude rendered as decimal degrees, DMS, decimal minutes, or **MGRS** (Military Grid Reference System). A sibling to [`TelemetryValue`](/components/telemetry-value): same tabular, glanceable treatment, but for a coordinate *pair* rather than a scalar.

<div class="auxiliary-demo vp-raw" style="gap: 1.5rem;">
  <CoordinateValue label="Decimal" :lat="47.3769" :lon="8.5417" format="dd" />
  <CoordinateValue label="DMS" :lat="47.3769" :lon="8.5417" format="dms" />
  <CoordinateValue label="MGRS" :lat="47.3769" :lon="8.5417" format="mgrs" show-format-tag />
</div>

## When to use

- For a **fixed position** in an operational readout — vehicle location, target, waypoint, home point, ground-station site.
- When operators need a **specific convention** they can read off and relay over voice — DMS for aviation, MGRS for ground/defense coordination.
- When the coordinate sits alongside numeric telemetry and should share the same monospaced, `tabular-nums` alignment so a streaming position **doesn't jiggle**.

## When *not* to use

- For a **single scalar** (altitude, speed, heading) — that's [`TelemetryValue`](/components/telemetry-value).
- For an **editable** coordinate entry — this is a read-only display, not an input.
- As a **map** or spatial picker — CoordinateValue states a position; it doesn't plot one.

## Formats

| `format` | Example | Use |
| --- | --- | --- |
| `dd`   | `47.3769° N, 8.5417° E` | Compact, machine-friendly decimal degrees. |
| `dms`  | `47°22′36.8″ N  8°32′30.1″ E` | Degrees/minutes/seconds — common in aviation/marine. |
| `ddm`  | `47°22.614′ N  8°32.502′ E` | Degrees + decimal minutes. |
| `mgrs` | `32T MT 65403 47150` | Military Grid Reference System (1 m at full accuracy). |

<div class="auxiliary-demo vp-raw" style="flex-direction: column; gap: 0.75rem; align-items: flex-start;">
  <CoordinateValue :lat="47.3769" :lon="8.5417" format="dd" show-format-tag />
  <CoordinateValue :lat="47.3769" :lon="8.5417" format="dms" show-format-tag />
  <CoordinateValue :lat="47.3769" :lon="8.5417" format="ddm" show-format-tag />
  <CoordinateValue :lat="47.3769" :lon="8.5417" format="mgrs" show-format-tag />
</div>

```vue
<CoordinateValue :lat="47.3769" :lon="8.5417" format="dd" />
<CoordinateValue :lat="47.3769" :lon="8.5417" format="dms" />
<CoordinateValue :lat="47.3769" :lon="8.5417" format="ddm" />
<CoordinateValue :lat="47.3769" :lon="8.5417" format="mgrs" />
```

### Precision

`precision` controls decimals — its meaning follows the format: degrees for `dd`, seconds for `dms`, minutes for `ddm`. For `mgrs`, use `mgrsAccuracy` (1–5, i.e. 10 km → 1 m) instead.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; gap: 0.75rem; align-items: flex-start;">
  <CoordinateValue label="dd · 2dp" :lat="47.3769" :lon="8.5417" format="dd" :precision="2" />
  <CoordinateValue label="MGRS · 100 m" :lat="47.3769" :lon="8.5417" format="mgrs" :mgrs-accuracy="3" />
  <CoordinateValue label="MGRS · 10 km" :lat="47.3769" :lon="8.5417" format="mgrs" :mgrs-accuracy="1" />
</div>

```vue
<CoordinateValue :lat="47.3769" :lon="8.5417" format="dd" :precision="2" />
<CoordinateValue :lat="47.3769" :lon="8.5417" format="mgrs" :mgrs-accuracy="3" />
```

### Threshold coloring with `level`

<div class="auxiliary-demo vp-raw" style="gap: 1.5rem;">
  <CoordinateValue label="Home" :lat="47.3769" :lon="8.5417" format="mgrs" level="nominal" />
  <CoordinateValue label="Drift" :lat="47.3769" :lon="8.5417" format="mgrs" level="caution" />
  <CoordinateValue label="Geofence" :lat="47.3769" :lon="8.5417" format="mgrs" level="alarm" />
</div>

```vue
<CoordinateValue label="Geofence" :lat="47.3769" :lon="8.5417" format="mgrs" level="alarm" />
```

`level` recolors the value to the matching alarm tier — drive it from your own logic (e.g. tint red on a geofence breach). When `level` is `null` (the default) the value uses `--foreground`.

## Props

<PropsTable name="CoordinateValue" />

The component renders a `<div>` and forwards `$attrs`, so `id`, `data-*`, and `aria-*` land on the root.

## Accessibility

- The coordinate is **plain text** in document order (optional label, then value, then format tag), so a screen reader reads it naturally. Keep `label` set so the position has a name.
- `tabular-nums` keeps each glyph a fixed width, so a streaming position stays aligned and doesn't reflow as digits tick.
- **Invalid input degrades, never throws.** A `NaN`, out-of-range, or polar coordinate MGRS can't express renders as an em dash (`—`) rather than blanking — a bad fix must never break the surrounding panel.
- **Color is never the only cue.** Setting `level` renders the shared severity glyph (the same grayscale-distinct shape `StatusBadge` uses) and a visually-hidden level word alongside the tint, so the *tier* survives grayscale, dichromacy and a screen reader. The coordinate text carries the reading; it does not carry the tier, which is why the tint alone was not enough (WCAG 1.4.1, `AD-D-014`). For a time-critical breach still pair it with a `<Toast>` / `<AlertBanner>` that announces via a live region — a recolored readout is silent to anyone not looking at that field.

## Tokens consumed

| Part | Token |
| --- | --- |
| Value (default) | `--foreground` |
| Label | `--muted-foreground` |
| Format tag | `--muted-foreground` |

When `level` is set, the value swaps to the matching alarm-tier color — `--alarm`, `--warning`, `--caution`, `--advisory`, or `--nominal`. See [Foundations → Colors → Alarm hierarchy](/foundations/colors#alarm-hierarchy).
