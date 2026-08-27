<script setup lang="ts">
/* Six drawn glyphs — one per surface.
 *
 * These exist because the obvious way to tell five products apart is a colour
 * per product, and that is the one move this system cannot make: it would mint
 * five accent hues with no ramp, no contrast gate and no token behind them,
 * next to a status ladder that already owns five meanings. It would also fail
 * twice over in the operational themes — `sunlight` collapses the low end of
 * every ramp, and `darknight` has no blue at any strength.
 *
 * So identity is carried by SILHOUETTE. Each glyph is a diagram of what the
 * surface is, drawn in one hairline weight and `currentColor`, and every one is
 * distinguishable from the other five as a black shape at 24px.
 *
 * Decorative: the product's name is always beside it, so these are aria-hidden
 * at every call site and never the only carrier of which tile is which.
 */
import type { SurfaceId } from './surfaces';

withDefaults(defineProps<{ surface: SurfaceId; size?: number }>(), { size: 24 });
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <!-- Suite — a ledger. Records you own, with a measured column hard right. -->
    <g v-if="surface === 'suite'">
      <rect x="3" y="3.75" width="18" height="16.5" rx="1.5" />
      <path d="M3 8.25h18" />
      <path d="M6.25 12h6M6.25 16.25h6" />
      <path d="M15.5 12h2.25M15.5 16.25h2.25" />
    </g>

    <!-- Control — a reticle. One vehicle, held. -->
    <g v-else-if="surface === 'control'">
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="1.4" />
      <path d="M12 2.5V6M12 18v3.5M2.5 12H6M18 12h3.5" />
    </g>

    <!-- Simulation — a vehicle over ground that is not there. The arrow is the
         same silhouette the swarm stage draws for an aircraft; the dashed rule
         under it is the simulated world. Two large strokes rather than the two
         small overlapping arrows this started as: a dash pattern needs length
         before it reads as a dash, and at 22px those had turned to grit. -->
    <g v-else-if="surface === 'sim'">
      <path d="M12 2.75 17.75 16.25 12 13.15 6.25 16.25Z" />
      <path d="M3.5 20.25h17" stroke-dasharray="3 2.6" />
    </g>

    <!-- Nemyx — a graph. Several agents addressed as one. -->
    <g v-else-if="surface === 'nemyx'">
      <circle cx="12" cy="4.75" r="1.9" />
      <circle cx="4.75" cy="17.5" r="1.9" />
      <circle cx="19.25" cy="17.5" r="1.9" />
      <circle cx="12" cy="12.5" r="1.9" />
      <path d="M12 6.65v3.95M10.3 13.6 6.4 16.4M13.7 13.6l3.9 2.8M6.65 17.5h10.7" />
    </g>

    <!-- Device — a board. The computer bolted to the airframe. -->
    <g v-else-if="surface === 'device'">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <rect x="8.75" y="8.75" width="6.5" height="6.5" rx="1" />
      <path d="M9.75 3.5v2.25M14.25 3.5v2.25M9.75 18.25v2.25M14.25 18.25v2.25" />
      <path d="M3.5 9.75h2.25M3.5 14.25h2.25M18.25 9.75h2.25M18.25 14.25h2.25" />
    </g>

    <!-- Insights — a plotted series. The only chart in the set. -->
    <g v-else-if="surface === 'insights'">
      <path d="M4 3.75v15a1.5 1.5 0 0 0 1.5 1.5h15" />
      <path d="M7.5 15.75 11 11.5l3.25 2.5 4.75-6.5" />
      <circle cx="11" cy="11.5" r="1.15" />
      <circle cx="14.25" cy="14" r="1.15" />
    </g>

    <!-- Deploy — a stack of versions and the one going out. Store's arrow points
         down into a tray because you receive from it; this one points up out of
         a stack because you push from it. -->
    <g v-else-if="surface === 'deploy'">
      <rect x="3.5" y="16.5" width="17" height="4" rx="1.25" />
      <path d="M6 13.25h12M8.5 10h7" />
      <path d="M12 2.75v5.25M9.25 5.5 12 2.75l2.75 2.75" />
    </g>

    <!-- Store — a tray taking delivery. Apps, licences, builds. -->
    <g v-else-if="surface === 'store'">
      <path d="M12 3v9.5" />
      <path d="M8.5 9.25 12 12.75l3.5-3.5" />
      <path d="M3.75 14.5v4.25a1.75 1.75 0 0 0 1.75 1.75h13a1.75 1.75 0 0 0 1.75-1.75V14.5" />
      <path d="M3.75 14.5h4.5l1 2h5.5l1-2h4.5" />
    </g>

    <!-- Docs — a page. The tile a new operator opens first. -->
    <g v-else>
      <path d="M5.5 3.5h8.25L18.5 8.25V20.5H5.5Z" />
      <path d="M13.5 3.5v5h5" />
      <path d="M8.75 12.75h6.5M8.75 16.5h4.5" />
    </g>
  </svg>
</template>
