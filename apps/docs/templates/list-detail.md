<script setup>
import { ref, computed } from 'vue';
const items = [
  { id: 'mx01', vehicle: 'MX-01', level: 'nominal',  site: 'ZRH', batt: 74, alt: 408, fw: 'v4.2.1' },
  { id: 'mx02', vehicle: 'MX-02', level: 'caution',  site: 'MUC', batt: 41, alt: 122, fw: 'v4.2.1' },
  { id: 'mx03', vehicle: 'MX-03', level: 'warning',  site: 'ZRH', batt: 18, alt: 95,  fw: 'v4.1.9' },
  { id: 'mx04', vehicle: 'MX-04', level: 'alarm',    site: 'LON', batt: 63, alt: 0,   fw: 'v4.2.1' },
];
const selectedId = ref('mx01');
const selected = computed(() => items.find((v) => v.id === selectedId.value) ?? items[0]);
</script>

# List + detail

The master/detail screen — a scrollable list on the left, the selected item's detail on the right. The backbone of fleet management, mission logs, and asset views. Selecting in the list drives the detail (try it).

<div class="vp-raw" style="margin:1.25rem 0; border:1px solid var(--border); border-radius:0.5rem; overflow:hidden; background:var(--background); display:grid; grid-template-columns:16rem 1fr; height:20rem;">
  <nav aria-label="Vehicles" style="border-right:1px solid var(--border); background:var(--card); overflow-y:auto;">
    <button v-for="v in items" :key="v.id" @click="selectedId = v.id" :aria-current="selectedId === v.id ? 'true' : undefined" :style="{ display:'flex', alignItems:'center', gap:'0.5rem', width:'100%', padding:'0.625rem 0.75rem', border:'none', borderBottom:'1px solid var(--border)', background: selectedId===v.id ? 'var(--accent)' : 'transparent', cursor:'pointer', textAlign:'left' }">
      <code style="font-size:0.8125rem; font-weight:500;">{{ v.vehicle }}</code>
      <StatusBadge :level="v.level" size="sm" dot>{{ v.site }}</StatusBadge>
      <div style="flex:1;"></div>
      <TelemetryValue :value="v.batt" unit="%" :precision="0" size="sm" />
    </button>
  </nav>
  <section aria-label="Detail" style="overflow-y:auto; padding:1.25rem; display:flex; flex-direction:column; gap:1rem;">
    <div style="display:flex; align-items:center; gap:0.625rem;">
      <h3 style="margin:0; font-size:1.125rem;">{{ selected.vehicle }}</h3>
      <StatusBadge :level="selected.level" dot>{{ selected.site }}</StatusBadge>
      <div style="flex:1;"></div>
      <Button variant="ghost" size="sm">Edit</Button>
      <Button variant="primary" size="sm">Launch</Button>
    </div>
    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.75rem;">
      <TelemetryValue label="Battery" :value="selected.batt" unit="%" :precision="0" :level="selected.batt < 25 ? 'warning' : undefined" />
      <TelemetryValue label="Altitude" :value="selected.alt" unit="m" :precision="0" />
    </div>
    <div style="font-size:0.875rem; color:var(--muted-foreground);">Firmware {{ selected.fw }} · last seen 2 min ago · home ZRH</div>
    <CoordinateValue :lat="47.3977" :lon="8.5456" format="dms" show-format-tag />
  </section>
</div>

## Composition

- **Master list** — selectable rows (`aria-current` on the active one), each a compact summary (`StatusBadge` + `TelemetryValue`). For tabular density use the [fleet table](/patterns/fleet-table); for cards, the [vehicle status card](/patterns/vehicle-status-card).
- **Detail** — a header with the item's identity + actions, then its full data. Selection is a single `selectedId` ref the detail reads.
- **Responsive** — on narrow viewports, collapse to list-only with the detail as a pushed route or a [drawer](/patterns/app-blocks); don't shrink both into an unusable split.
