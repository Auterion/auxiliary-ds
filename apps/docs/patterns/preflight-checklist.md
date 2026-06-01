# Pre-flight checklist

Confirm-before-proceed checks with expandable detail — the kind an operator works through before takeoff. A [`Card`](/components/card) frames the list; an [`Accordion`](/components/accordion) keeps each check collapsed to its title until the operator expands it for the full reading.

**Composes:** `Card` · `Accordion`

<div class="auxiliary-demo vp-raw" style="justify-content:center;">
  <Card style="width:100%; max-width:32rem;">
    <CardHeader>
      <CardTitle>Pre-flight checks</CardTitle>
      <CardDescription>Confirm before takeoff. Expand each for details.</CardDescription>
    </CardHeader>
    <CardContent style="padding-left:0.25rem; padding-right:0.25rem;">
      <Accordion type="single" collapsible default-value="airspace">
        <AccordionItem value="airspace">
          <AccordionTrigger>Airspace authorization</AccordionTrigger>
          <AccordionContent>
            Class G uncontrolled airspace below 120m AGL. No NOTAMs active for
            this area. Cleared for VLOS operations.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="weather">
          <AccordionTrigger>Weather window</AccordionTrigger>
          <AccordionContent>
            Wind: 6.2 m/s gusting to 9.8 m/s — within operational limits.
            Visibility: &gt;10 km. No precipitation expected for 90 minutes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="vehicle">
          <AccordionTrigger>Vehicle systems</AccordionTrigger>
          <AccordionContent>
            Battery: 74% (estimated 21 min flight). GPS lock: 12 satellites,
            HDOP 0.7. IMU and barometer calibrated &lt;24h ago.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="payload" disabled>
          <AccordionTrigger>Payload (none attached)</AccordionTrigger>
          <AccordionContent>
            Not applicable for this mission.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
</div>

```vue
<template>
  <Card>
    <CardHeader>
      <CardTitle>Pre-flight checks</CardTitle>
      <CardDescription>Confirm before takeoff. Expand each for details.</CardDescription>
    </CardHeader>
    <CardContent class="px-1">
      <Accordion type="single" collapsible default-value="airspace">
        <AccordionItem value="airspace">
          <AccordionTrigger>Airspace authorization</AccordionTrigger>
          <AccordionContent>
            Class G uncontrolled airspace below 120m AGL. No NOTAMs active for
            this area. Cleared for VLOS operations.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="weather">
          <AccordionTrigger>Weather window</AccordionTrigger>
          <AccordionContent>
            Wind: 6.2 m/s gusting to 9.8 m/s — within operational limits.
            Visibility: >10 km. No precipitation expected for 90 minutes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="vehicle">
          <AccordionTrigger>Vehicle systems</AccordionTrigger>
          <AccordionContent>
            Battery: 74% (estimated 21 min flight). GPS lock: 12 satellites,
            HDOP 0.7. IMU and barometer calibrated <24h ago.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="payload" disabled>
          <AccordionTrigger>Payload (none attached)</AccordionTrigger>
          <AccordionContent>
            Not applicable for this mission.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
</template>
```

## Notes

- **`type="single" collapsible`** opens one check at a time and lets the operator collapse all — the right model for a checklist, where focus is on the item being verified. Use `type="multiple"` if checks are reviewed in parallel.
- **`default-value`** opens the first check on load so the list isn't fully cold. Drop it to start fully collapsed.
- **A non-applicable check is `disabled`, not hidden** — "Payload (none attached)" stays visible so the operator sees it was considered and ruled out, not omitted. Presence-with-reason beats a silent gap on a safety surface.
- This is review/confirm, not a required gate. A toast that auto-dismisses or a checklist that doesn't block are wrong for a *must-acknowledge* step — for an irreversible command use [`GuardedAction`](/components/guarded-action); for a decision that must be made before continuing use a [`Dialog`](/components/dialog).
