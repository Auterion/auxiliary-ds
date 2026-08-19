<script setup lang="ts">
/**
 * AMC27 · tactical map.
 *
 * The same frame, a different picture — which is the point: the incumbent
 * rebuilds its chrome per view, so a control learned on the camera page is
 * somewhere else on the map page. Here the command bar, the mission rail and
 * the instrument strip do not move; only the viewport and the right column
 * change.
 *
 * Map symbology rules, which the incumbent has none of:
 *   · Ownship and its flown track are `--brand`. That is the whole brand
 *     budget on this view.
 *   · Planned track is ink, dashed. Flown track is ink, solid. The difference
 *     between intent and history is line style, not colour.
 *   · Other tracks are ink outlines. A hostile track is the ONLY other place a
 *     status hue appears, and it is `alarm` — the ladder, used for what it is
 *     reserved for.
 */
import { ref } from 'vue';
import { Switch } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { plan, ownship, tracks, t } from './telemetry';

const layers = ref({ plan: true, geofence: true, terrain: true, tracks: true });
const scale = ref('200 m');

const planPath = plan.map((p) => `${p.x},${p.y}`).join(' ');
const flownPath = plan.slice(0, 7).map((p) => `${p.x},${p.y}`).join(' ');
</script>

<template>
  <div class="a27-viewport a27-ticks">
    <div class="terrain absolute inset-0" />

    <svg viewBox="0 0 1000 620" class="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <!-- Geofence: a boundary, so a hairline and a wash, never a fill. -->
      <path
        v-if="layers.geofence"
        d="M70 560 L70 140 L560 90 L930 160 L930 560 Z"
        fill="var(--a27-ink)"
        fill-opacity="0.03"
        stroke="var(--a27-ink)"
        stroke-opacity="0.4"
        stroke-width="1.5"
        stroke-dasharray="10 6"
      />

      <!-- Planned track — intent. Dashed ink. -->
      <polyline
        v-if="layers.plan"
        :points="planPath"
        fill="none"
        stroke="var(--a27-ink)"
        stroke-opacity="0.55"
        stroke-width="1.5"
        stroke-dasharray="6 5"
      />
      <!-- Flown track — history. Solid brand: this is ownship's own line. -->
      <polyline :points="flownPath" fill="none" stroke="var(--brand)" stroke-width="2" />

      <!-- Waypoints. Number inside the mark, so the mark IS the label. -->
      <g v-if="layers.plan">
        <g v-for="p in plan" :key="p.n" :transform="`translate(${p.x} ${p.y})`">
          <rect
            x="-8"
            y="-8"
            width="16"
            height="16"
            :transform="p.kind === 'LOITER' ? 'rotate(45)' : undefined"
            fill="var(--background)"
            stroke="var(--a27-ink)"
            stroke-width="1.25"
            rx="2"
          />
          <text
            y="3.5"
            text-anchor="middle"
            font-family="var(--font-mono)"
            font-size="9"
            font-weight="600"
            fill="var(--a27-ink)"
          >{{ p.n }}</text>
        </g>
      </g>

      <!-- Other tracks. Ink outlines; hostile is the ladder, used honestly. -->
      <g v-if="layers.tracks">
        <g v-for="tr in tracks" :key="tr.id" :transform="`translate(${tr.x} ${tr.y})`">
          <circle
            r="9"
            fill="none"
            :stroke="tr.hostile ? 'var(--alarm)' : 'var(--a27-ink)'"
            stroke-width="1.5"
            :stroke-opacity="tr.hostile ? 1 : 0.7"
          />
          <circle r="2" :fill="tr.hostile ? 'var(--alarm)' : 'var(--a27-ink)'" />
          <text
            x="14"
            y="4"
            font-family="var(--font-mono)"
            font-size="9.5"
            letter-spacing="0.06em"
            :fill="tr.hostile ? 'var(--alarm-emphasis)' : 'var(--a27-ink-2)'"
          >{{ tr.id }}</text>
        </g>
      </g>

      <!-- Ownship. The one mark that must win at a glance: brand fill, ink
           halo, and a heading vector proportional to ground speed. -->
      <g :transform="`translate(${ownship.x} ${ownship.y})`">
        <line
          :transform="`rotate(${ownship.hdg - 90})`"
          x1="0" y1="0" x2="46" y2="0"
          stroke="var(--brand)"
          stroke-width="1.5"
          stroke-dasharray="3 3"
        />
        <g :transform="`rotate(${ownship.hdg - 90})`">
          <path d="M14 0 L-9 -9 L-4 0 L-9 9 Z" fill="var(--brand)" stroke="var(--background)" stroke-width="1" />
        </g>
        <text
          x="0"
          y="-18"
          text-anchor="middle"
          font-family="var(--font-mono)"
          font-size="9.5"
          letter-spacing="0.06em"
          fill="var(--a27-ink)"
        >HAWK 01 · {{ t.agl }} M</text>
      </g>
    </svg>

    <!-- Scale bar and grid reference — a map without a scale is a picture. -->
    <div class="a27-glass absolute bottom-3 left-3 flex items-center gap-3 px-2.5 py-1.5">
      <svg width="72" height="10" aria-hidden="true">
        <g stroke="var(--a27-ink)" stroke-width="1.25">
          <line x1="1" y1="7" x2="71" y2="7" />
          <line x1="1" y1="2" x2="1" y2="7" />
          <line x1="36" y1="4" x2="36" y2="7" />
          <line x1="71" y1="2" x2="71" y2="7" />
        </g>
      </svg>
      <span class="a27-label" style="color: var(--a27-ink)">{{ scale }}</span>
      <span class="a27-label" style="color: var(--a27-ink-3)">MGRS 32TMT 8841 2277</span>
    </div>

    <!-- Map controls: a single stack, docked, not four circles on the terrain. -->
    <div class="absolute right-3 top-3 flex flex-col gap-2">
      <div class="a27-stack a27-stack-v a27-glass">
        <button type="button" class="a27-btn" aria-label="Zoom in"><Icon name="plus" size="xs" /></button>
        <button type="button" class="a27-btn" aria-label="Zoom out"><Icon name="minus" size="xs" /></button>
      </div>
      <button type="button" class="a27-btn a27-glass" data-active="true" aria-label="Centre on ownship">
        <Icon name="house" size="xs" />
      </button>
    </div>
  </div>

  <!-- ══ Map column ═══════════════════════════════════════════════════════ -->
  <aside class="a27-rail a27-rail-right">
    <div class="a27-sec">
      <div class="a27-sec-head">
        <span class="a27-label">Layers</span>
        <span class="a27-label" style="color: var(--a27-ink-3)">OFFLINE TILES</span>
      </div>
      <div class="flex flex-col gap-2.5">
        <div v-for="(k, key) in { plan: 'Mission plan', geofence: 'Geofence', terrain: 'Terrain relief', tracks: 'Tracks' }" :key="key" class="flex items-center justify-between gap-3">
          <span class="a27-name">{{ k }}</span>
          <Switch v-model="layers[key as keyof typeof layers]" :aria-label="k" />
        </div>
      </div>
    </div>

    <div class="a27-sec">
      <p class="a27-label mb-2">Track picture</p>
      <div class="flex flex-col">
        <div
          v-for="tr in tracks"
          :key="tr.id"
          class="a27-alert a27-edge"
          :class="tr.hostile ? 'a27-edge-alarm' : 'a27-edge-nominal'"
          style="grid-template-columns: minmax(0, 1fr) auto"
        >
          <span class="a27-name">{{ tr.id }}</span>
          <span class="a27-micro">{{ tr.hostile ? 'HOSTILE' : tr.own ? 'FRIEND · OWN' : 'FRIEND' }}</span>
          <span class="a27-label" style="color: var(--a27-ink-3)">BRG {{ String(tr.hdg).padStart(3, '0') }}° · {{ tr.rng }} M</span>
        </div>
      </div>
    </div>

    <div class="a27-sec a27-sec-flex">
      <p class="a27-label mb-2">Mission progress</p>
      <div class="a27-fields" style="--a27-cols: 2">
        <div class="a27-field">
          <span class="a27-label">Waypoint</span>
          <span class="a27-field-row"><span class="a27-meas">7</span><span class="a27-unit">/ 9</span></span>
        </div>
        <div class="a27-field">
          <span class="a27-label">Remaining</span>
          <span class="a27-field-row"><span class="a27-meas">{{ t.eta }}</span></span>
        </div>
        <div class="a27-field">
          <span class="a27-label">Leg dist</span>
          <span class="a27-field-row"><span class="a27-meas">412</span><span class="a27-unit">m</span></span>
        </div>
        <div class="a27-field">
          <span class="a27-label">Endurance</span>
          <span class="a27-field-row"><span class="a27-meas">14:20</span></span>
        </div>
      </div>
      <p class="a27-micro mt-3" style="color: var(--a27-ink-3)">
        Loiter at WP 7 for ISR, then return via WP 8 to pad A.
      </p>
    </div>
  </aside>
</template>

<style scoped>
/* Simulated raster MAP TILE, not UI — same exemption as the sensor imagery.
 * A topographic tile's hues are cartographic data, not design-system colour. */
.terrain {
  background:
    radial-gradient(38% 42% at 66% 30%, rgb(108 118 74 / 0.85), transparent 68%),
    radial-gradient(30% 34% at 24% 66%, rgb(88 100 66 / 0.8), transparent 70%),
    radial-gradient(46% 30% at 50% 96%, rgb(62 78 92 / 0.75), transparent 72%),
    linear-gradient(150deg, rgb(58 66 46), rgb(40 47 36) 55%, rgb(32 38 34));
}
.terrain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(58deg, rgb(255 255 255 / 0.035) 0 1px, transparent 1px 26px),
    repeating-linear-gradient(148deg, rgb(0 0 0 / 0.06) 0 1px, transparent 1px 34px);
}
</style>
