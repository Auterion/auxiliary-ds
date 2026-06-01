# Telemetry grid

A glanceable block of live readouts — altitude, speed, heading, battery, link. Each cell is a [`TelemetryValue`](/components/telemetry-value): a mono tabular figure with an optional unit, label, precision, and trend arrow, colored by the [status ladder](/components/status-badge) when a value crosses a threshold.

**Composes:** `TelemetryValue`

<div class="auxiliary-demo vp-raw" style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:1rem 1.5rem; align-items:start;">
  <TelemetryValue label="Altitude" :value="408.2" unit="m" trend="up" />
  <TelemetryValue label="Ground speed" :value="12.4" unit="m/s" trend="stable" />
  <TelemetryValue label="Heading" :value="247" unit="°" :precision="0" />
  <TelemetryValue label="Battery" :value="74" unit="%" :precision="0" trend="down" />
  <TelemetryValue label="Sats" :value="12" :precision="0" level="nominal" />
  <TelemetryValue label="RSSI" :value="-87" unit="dBm" :precision="0" level="caution" />
  <TelemetryValue label="Wind" :value="11.2" unit="m/s" trend="up" level="warning" />
  <TelemetryValue label="Link" value="LOST" level="alarm" />
</div>

```vue
<template>
  <div class="grid grid-cols-2 gap-x-6 gap-y-4 rounded-md border border-border bg-card p-5 sm:grid-cols-4">
    <TelemetryValue label="Altitude" :value="408.2" unit="m" trend="up" />
    <TelemetryValue label="Ground speed" :value="12.4" unit="m/s" trend="stable" />
    <TelemetryValue label="Heading" :value="247" unit="°" :precision="0" />
    <TelemetryValue label="Battery" :value="74" unit="%" :precision="0" trend="down" />
    <TelemetryValue label="Sats" :value="12" :precision="0" level="nominal" />
    <TelemetryValue label="RSSI" :value="-87" unit="dBm" :precision="0" level="caution" />
    <TelemetryValue label="Wind" :value="11.2" unit="m/s" trend="up" level="warning" />
    <TelemetryValue label="Link" value="LOST" level="alarm" />
  </div>
</template>
```

## Notes

- **Set `level` for status, `trend` for direction** — they're independent. A value can be `nominal` and trending `down` (battery draining normally) or `alarm` with no trend (link lost). The grid reads at a glance because severity is carried by color *and* the label text, never color alone.
- **`tabular-nums` keeps columns from jittering** as values stream — `TelemetryValue` uses the mono tabular figure so digits don't shift width on update. Pair with a fixed `precision` for a stable readout.
- **Responsive** — two columns on narrow viewports, four when there's room (`sm:grid-cols-4`). For a denser operational console, wrap the grid in `[data-register="operational"]`.
- For a single inline readout rather than a grid, use `TelemetryValue` on its own; for a per-vehicle summary, see the [vehicle status card](/patterns/vehicle-status-card).
