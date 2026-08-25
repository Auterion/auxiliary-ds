<script setup>
import { ref } from 'vue';

const FLEET = [
  { id: 'mx01', vehicle: 'MX-01', level: 'nominal',  status: 'In mission',  battery: 74, altitude: 408 },
  { id: 'mx02', vehicle: 'MX-02', level: 'caution',  status: 'Wind hold',   battery: 41, altitude: 122 },
  { id: 'mx03', vehicle: 'MX-03', level: 'warning',  status: 'Battery low', battery: 18, altitude: 95 },
  { id: 'mx04', vehicle: 'MX-04', level: 'alarm',    status: 'Link lost',   battery: 63, altitude: 0 },
  { id: 'mx05', vehicle: 'MX-05', level: 'advisory', status: 'Returning',   battery: 88, altitude: 210 },
];

const selectedVehicles = ref(new Set(['mx01']));
function toggleVehicle(id) {
  const next = new Set(selectedVehicles.value);
  next.has(id) ? next.delete(id) : next.add(id);
  selectedVehicles.value = next;
}
</script>

# Fleet table

The top operational surface — fleets, mission logs, telemetry streams, alert history. A [`Table`](/components/table) with a sticky header on a bounded scroll container, row selection, and per-row status + telemetry cells. `scope="row"` headers tie each row to its vehicle so screen readers announce "MX-01" as the row's name.

**Composes:** `Table` · `Checkbox` · `StatusBadge` · `TelemetryValue`

<div class="auxiliary-demo vp-raw" style="display:block;">
  <div style="border:1px solid var(--border); border-radius:var(--radius-lg); background:var(--card); overflow:hidden;">
    <Table>
      <TableCaption style="padding:var(--spacing-3) var(--spacing-4) var(--spacing-0);">
        Active fleet — {{ selectedVehicles.size }} of {{ FLEET.length }} selected
      </TableCaption>
      <TableHeader sticky>
        <TableRow>
          <TableHead style="width:2.5rem;"><span class="sr-only">Select</span></TableHead>
          <TableHead scope="col">Vehicle</TableHead>
          <TableHead scope="col">Status</TableHead>
          <TableHead scope="col">Battery</TableHead>
          <TableHead scope="col">Altitude</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="row in FLEET"
          :key="row.id"
          :data-state="selectedVehicles.has(row.id) ? 'selected' : undefined"
        >
          <TableCell>
            <Checkbox
              :model-value="selectedVehicles.has(row.id)"
              :aria-label="`Select ${row.vehicle}`"
              @update:model-value="toggleVehicle(row.id)"
            />
          </TableCell>
          <TableHead scope="row" style="font-weight:500; color:var(--foreground);">{{ row.vehicle }}</TableHead>
          <TableCell><StatusBadge :level="row.level" size="sm" dot>{{ row.status }}</StatusBadge></TableCell>
          <TableCell><TelemetryValue :value="row.battery" unit="%" :precision="0" size="sm" /></TableCell>
          <TableCell><TelemetryValue :value="row.altitude" unit="m" :precision="0" size="sm" /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</div>

```vue
<script setup>
import { ref } from 'vue';

const FLEET = [
  { id: 'mx01', vehicle: 'MX-01', level: 'nominal',  status: 'In mission',  battery: 74, altitude: 408 },
  { id: 'mx02', vehicle: 'MX-02', level: 'caution',  status: 'Wind hold',   battery: 41, altitude: 122 },
  { id: 'mx03', vehicle: 'MX-03', level: 'warning',  status: 'Battery low', battery: 18, altitude: 95 },
  { id: 'mx04', vehicle: 'MX-04', level: 'alarm',    status: 'Link lost',   battery: 63, altitude: 0 },
  { id: 'mx05', vehicle: 'MX-05', level: 'advisory', status: 'Returning',   battery: 88, altitude: 210 },
];

const selected = ref(new Set(['mx01']));
function toggle(id) {
  const next = new Set(selected.value);
  next.has(id) ? next.delete(id) : next.add(id);
  selected.value = next;
}
</script>

<template>
  <div class="rounded-md border border-border bg-card">
    <Table class="max-h-72">
      <TableCaption class="px-4 pt-3">
        Active fleet — {{ selected.size }} of {{ FLEET.length }} selected
      </TableCaption>
      <TableHeader sticky>
        <TableRow>
          <TableHead class="w-10"><span class="sr-only">Select</span></TableHead>
          <TableHead scope="col">Vehicle</TableHead>
          <TableHead scope="col">Status</TableHead>
          <TableHead scope="col">Battery</TableHead>
          <TableHead scope="col">Altitude</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="row in FLEET"
          :key="row.id"
          :data-state="selected.has(row.id) ? 'selected' : undefined"
        >
          <TableCell>
            <Checkbox
              :model-value="selected.has(row.id)"
              :aria-label="`Select ${row.vehicle}`"
              @update:model-value="toggle(row.id)"
            />
          </TableCell>
          <TableHead scope="row" class="font-medium text-foreground">{{ row.vehicle }}</TableHead>
          <TableCell><StatusBadge :level="row.level" size="sm" dot>{{ row.status }}</StatusBadge></TableCell>
          <TableCell><TelemetryValue :value="row.battery" unit="%" :precision="0" size="sm" /></TableCell>
          <TableCell><TelemetryValue :value="row.altitude" unit="m" :precision="0" size="sm" /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
```

## Notes

- **`scope="row"` on the vehicle cell** (a `TableHead`, not a `TableCell`) makes the vehicle ID the row's header, so assistive tech announces "MX-01, Status, Link lost" instead of reading bare cells. `scope="col"` on the column headers completes the association.
- **Selection is controlled state you own** — a `Set` of ids, toggled per row, surfaced in the caption ("2 of 5 selected"). `:data-state="…'selected'"` lets the row recipe style the selected state. Each `Checkbox` carries an `aria-label` naming its vehicle, since the visual label is the row, not the checkbox.
- **Sticky header + bounded height** (`max-h-72` on a scroll container) keeps headers visible as the fleet scrolls — essential once the list outgrows the viewport. Virtualization is deferred; for very large fleets, paginate.
- **Status by level, telemetry tabular** — `StatusBadge`'s `level` carries severity (color + text + dot), `TelemetryValue` keeps battery/altitude in mono tabular figures so columns don't jitter. An `alarm` row (MX-04, link lost) is legible at a glance.
- This is the dense, all-fleet view; for a single highlighted vehicle use the [vehicle status card](/patterns/vehicle-status-card).
