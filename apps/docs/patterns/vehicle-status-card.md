# Vehicle status card

A compact, at-a-glance summary of one vehicle or asset: identity in the header, live status + key telemetry in the body, primary actions in the footer. The building block of a fleet overview or an inspector panel.

**Composes:** `Card` · `StatusBadge` · `TelemetryValue` · `Separator` · `Button`

<div class="auxiliary-demo vp-raw" style="justify-content:center;">
  <Card style="width:100%; max-width:24rem;">
    <CardHeader>
      <CardTitle>Vehicle MX-01</CardTitle>
      <CardDescription>Quadcopter · firmware v4.2.1</CardDescription>
    </CardHeader>
    <CardContent>
      <div style="display:flex; flex-wrap:wrap; align-items:center; gap:var(--spacing-2); font-size:0.875rem;">
        <StatusBadge level="nominal" size="sm" dot>Connected</StatusBadge>
        <Separator orientation="vertical" style="height:1rem;" />
        <span style="color:var(--muted-foreground);">Battery</span>
        <TelemetryValue :value="74" unit="%" :precision="0" size="sm" />
        <Separator orientation="vertical" style="height:1rem;" />
        <span style="color:var(--muted-foreground);">Signal</span>
        <TelemetryValue :value="-87" unit="dBm" :precision="0" size="sm" level="caution" />
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="ghost" size="sm">Details</Button>
      <Button variant="primary" size="sm" style="margin-left:auto;">Launch</Button>
    </CardFooter>
  </Card>
</div>

```vue
<template>
  <Card>
    <CardHeader>
      <CardTitle>Vehicle MX-01</CardTitle>
      <CardDescription>Quadcopter · firmware v4.2.1</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <StatusBadge level="nominal" size="sm" dot>Connected</StatusBadge>
        <Separator orientation="vertical" class="h-4" />
        <span class="text-muted-foreground">Battery</span>
        <TelemetryValue :value="74" unit="%" :precision="0" size="sm" />
        <Separator orientation="vertical" class="h-4" />
        <span class="text-muted-foreground">Signal</span>
        <TelemetryValue :value="-87" unit="dBm" :precision="0" size="sm" level="caution" />
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="ghost" size="sm">Details</Button>
      <Button variant="primary" size="sm" class="ml-auto">Launch</Button>
    </CardFooter>
  </Card>
</template>
```

## Notes

- **Status first, in the periphery.** The `StatusBadge` carries the at-a-glance state with a `dot` and text — distinguishable without reading. In a fleet grid, an `alarm`-level card should be visible in peripheral vision while the operator's focus is elsewhere.
- **`size="sm"` throughout** keeps the card dense — the small `StatusBadge` and `TelemetryValue` rungs match a compact summary. Under `[data-register="operational"]` it tightens further.
- **Footer actions** lead with the low-commitment action (`ghost` "Details") and push the primary one right (`ml-auto`). For an irreversible command (arm, release), reach for [`GuardedAction`](/components/guarded-action) instead of a plain `Button`.
- Many of these side by side become a fleet overview; one expanded becomes an inspector panel. For tabular density across a whole fleet, use the [fleet table](/patterns/fleet-table).
