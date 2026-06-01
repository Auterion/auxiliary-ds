<script setup>
import { ref, onUnmounted } from 'vue';
import { pushCapped } from '@auxiliary/viz';

// A bounded streaming window. Each tick appends a point and drops the oldest
// past CAP, so the data — and the render cost — stay constant over time.
const CAP = 140;
let t = 60;
const seed = Array.from({ length: 60 }, (_, i) => i);
const data = ref([seed, seed.map((x) => 50 + 25 * Math.sin(x / 8))]);

let timer = null;
const streaming = ref(false);

function tick() {
  t += 1;
  const xs = pushCapped(data.value[0], t, CAP);
  const ys = pushCapped(data.value[1], 50 + 25 * Math.sin(t / 8) + (Math.random() * 10 - 5), CAP);
  data.value = [xs, ys];
}

function toggle() {
  streaming.value = !streaming.value;
  if (streaming.value) timer = setInterval(tick, 100); // 10 Hz
  else if (timer) { clearInterval(timer); timer = null; }
}

onUnmounted(() => { if (timer) clearInterval(timer); });
</script>

# Time series

A streaming line chart for the high-rate operational case — telemetry at 10–60 Hz. Built on **uPlot** (canvas): updates flow through `setData` (a canvas redraw), never DOM mutation, so a fast feed doesn't reflow the page. Pair it with `pushCapped` / `downsample` from `@auxiliary/viz` to keep the data window bounded.

<div class="auxiliary-demo vp-raw" style="flex-direction:column; align-items:stretch; gap:0.75rem;">
  <div>
    <Button size="sm" @click="toggle">{{ streaming ? 'Pause' : 'Stream (10 Hz)' }}</Button>
  </div>
  <ClientOnly>
    <TimeSeries :data="data" :series="['altitude']" label="Altitude (m) over time" :width="560" :height="180" />
  </ClientOnly>
</div>

```vue
<script setup>
import { ref, onUnmounted } from 'vue';
import { TimeSeries, pushCapped } from '@auxiliary/viz';

const CAP = 140;
let t = 60;
const seed = Array.from({ length: 60 }, (_, i) => i);
const data = ref([seed, seed.map((x) => 50 + 25 * Math.sin(x / 8))]);

let timer;
function tick() {
  t += 1;
  data.value = [
    pushCapped(data.value[0], t, CAP),
    pushCapped(data.value[1], readSensor(), CAP),
  ];
}
onMounted(() => (timer = setInterval(tick, 100))); // 10 Hz
onUnmounted(() => clearInterval(timer));
</script>

<template>
  <TimeSeries :data="data" :series="['altitude']" label="Altitude (m) over time" />
</template>
```

## Data shape

`data` is uPlot's aligned format — `[xValues, ...ySeries]` — so one x-axis array followed by one array per series. Series colors are taken from the [viz palette](/data-viz/) in order.

## Bounded work = no reflow

The reason a 60 Hz feed stays smooth: the chart never grows the DOM, and the data window is capped.

```ts
import { pushCapped, downsample } from '@auxiliary/viz';

xs = pushCapped(xs, nextX, 600);          // fixed window — O(window), not O(total)
const view = downsample(xs, ys, 800);     // cap to ~pixel density; keeps spikes (min/max buckets)
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `[number[], ...number[][]]` | — | uPlot aligned data: x array, then one array per series. |
| `series` | `string[]` | `[]` | Per-series names. |
| `label` | `string` | — | Accessible name for the chart region. |
| `width` / `height` | `number` | `360` / `140` | px. |

## Notes

- **Client-only.** uPlot needs a 2D canvas, so the component initializes on mount; in SSR / non-canvas environments it renders just the labelled container. Wrap it in `<ClientOnly>` in VitePress (as above).
- **Theme colors** (axis, grid) resolve from tokens at mount. After a runtime theme switch, re-mount to recolor — a known uPlot + CSS-variable limitation.
- **Accessibility.** A streaming canvas can't be read by assistive tech; the region carries an `aria-label`, and the underlying numbers should also be available as text/readouts (e.g. a `TelemetryValue`) for the current value.
- **Performance.** Sustained 10–60 Hz is the design target; validate the budget with a real-browser profile for your data rates.
