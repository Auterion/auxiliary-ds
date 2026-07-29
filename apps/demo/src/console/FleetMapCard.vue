<script setup lang="ts">
/* Live Fleet Map — a dot-matrix world (see worldmap.ts) with a pin per site.
 * The dots are pure decoration and stay aria-hidden; the sites are also listed
 * as text below the map so the information is never map-only. */
import { computed } from 'vue';
import { landDots, project } from './worldmap';
import { SITES } from './data';

/** viewBox units — the dot grid is unit-space, scaled here. */
const W = 640;
const H = 300;

const dots = computed(() => landDots().map((d) => ({ x: d.x * W, y: d.y * H })));
const pins = computed(() =>
  SITES.map((s) => {
    const p = project(s.lon, s.lat);
    return { ...s, x: p.x * W, y: p.y * H };
  }),
);
const totalPinned = computed(() => SITES.reduce((n, s) => n + s.vehicles, 0));
</script>

<template>
  <div class="bp-map">
    <svg :viewBox="`0 0 ${W} ${H}`" class="block w-full" role="img" aria-label="World map showing fleet sites">
      <!-- landmass dots -->
      <g fill="var(--bp-map-dot)">
        <circle v-for="(d, i) in dots" :key="i" :cx="d.x" :cy="d.y" r="1.5" />
      </g>
      <!-- site pins -->
      <!-- "Live" is the module's claim, so the pin earns a slow pulse -->
      <g v-for="(p, i) in pins" :key="p.key">
        <circle
          class="bp-map-ping"
          :cx="p.x"
          :cy="p.y"
          r="9"
          fill="var(--bp-map-pin)"
          :style="{ animationDelay: `${i * 260}ms` }"
        />
        <circle :cx="p.x" :cy="p.y" r="3.5" fill="var(--bp-map-pin)" />
        <circle :cx="p.x" :cy="p.y" r="3.5" fill="none" stroke="var(--bp-card)" stroke-width="1.25" />
      </g>
    </svg>

    <!-- the map is decorative; the same data reads as text -->
    <ul class="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 pt-3">
      <li v-for="s in pins" :key="s.key" class="flex items-center gap-1.5">
        <span class="bp-dot" style="background: var(--bp-map-pin)" />
        <span class="bp-ink-2 text-[12px]">{{ s.name }}</span>
        <span class="bp-ink-3 text-[12px] tabular">{{ s.vehicles }}</span>
      </li>
      <li class="bp-ink-3 ml-auto text-[12px] tabular">{{ totalPinned }} vehicles tracked</li>
    </ul>
  </div>
</template>
