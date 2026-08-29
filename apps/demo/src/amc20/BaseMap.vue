<script setup lang="ts">
/**
 * The basemap, reproduced.
 *
 * An OSM-carto stand-in for the tile layer in the screenshot — the Irchel /
 * Milchbuck junction north of Zürich, drawn rather than fetched. It is
 * IMAGERY: every colour in here is a raw value on purpose, because this is the
 * picture the proposal sits on top of, not a surface the design system owns.
 * Redrawing it in tokens would quietly improve the thing the proposal is meant
 * to be measured against.
 *
 * Roads are drawn casing-then-fill in one pass per class, which is how a real
 * renderer does it and the only way junctions read correctly.
 */

/** Motorway — the A1L and its ramps, the loudest thing on an OSM basemap. */
const MOTORWAY = [
  'M 596 700 C 660 620, 700 560, 760 500 S 880 400, 960 330 S 1120 200, 1260 140',
  'M 1000 300 C 1080 280, 1160 258, 1260 236',
  'M 828 430 C 880 452, 940 470, 1010 476',
];
/** Secondary — Schaffhauserstrasse / Winterthurerstrasse. */
const SECONDARY = [
  'M 640 130 C 646 260, 650 400, 664 560 S 690 720, 700 819',
  'M 210 470 C 360 452, 520 440, 700 432 S 1000 420, 1150 404',
  'M 840 130 C 852 240, 864 340, 880 430',
];
/** Minor — the residential grid on the west side. */
const MINOR = [
  'M 60 248 C 240 236, 420 222, 620 210', 'M 60 322 C 250 306, 430 294, 610 286',
  'M 40 392 C 230 380, 420 368, 616 360', 'M 70 545 C 260 536, 450 526, 660 520',
  'M 90 620 C 280 612, 470 602, 676 596', 'M 110 700 C 300 692, 490 684, 690 676',
  'M 46 176 C 240 166, 430 156, 618 148', 'M 128 762 C 320 754, 500 748, 700 742',
  'M 150 160 C 168 350, 186 560, 200 780', 'M 260 150 C 280 360, 296 580, 310 790',
  'M 370 150 C 386 360, 400 580, 412 790', 'M 480 145 C 496 360, 508 580, 516 790',
  'M 208 158 C 222 340, 236 540, 248 786', 'M 424 152 C 438 340, 450 560, 462 788',
  'M 900 560 C 1000 578, 1090 600, 1180 620', 'M 980 700 C 1090 690, 1200 674, 1300 660',
  'M 1060 300 C 1140 340, 1220 386, 1300 420', 'M 1120 690 C 1210 726, 1300 754, 1390 774',
];

/** Parks and forest — the green mass on the east side, and Irchelpark. */
const GREEN = [
  'M 1010 130 C 1130 150, 1260 130, 1400 150 L 1400 700 C 1250 690, 1120 640, 1020 560 C 980 460, 970 300, 1010 130 Z',
  'M 690 400 C 760 380, 830 386, 872 420 C 890 480, 860 540, 800 556 C 730 560, 686 500, 690 400 Z',
  'M 120 690 C 240 700, 330 720, 380 780 L 120 790 Z',
];
const WATER = [
  'M 792 468 C 818 460, 842 470, 844 488 C 838 506, 806 510, 790 496 Z',
  'M 1046 486 C 1068 480, 1084 492, 1080 506 C 1064 518, 1042 508, 1046 486 Z',
  'M 1216 806 C 1244 796, 1268 810, 1262 819 L 1210 819 Z',
];

/** A few labels, at the angles the streets run. */
const LABELS = [
  { t: 'Winterthurerstrasse', x: 1010, y: 268, r: -22 },
  { t: 'Schaffhauserstrasse', x: 676, y: 300, r: 84 },
  { t: 'Hirschwiesenstrasse', x: 470, y: 438, r: -3 },
  { t: 'Bucheggstrasse', x: 250, y: 466, r: -3 },
  { t: 'Irchelpark', x: 782, y: 522, r: 0 },
  { t: 'Milchbuck Tunnel', x: 892, y: 640, r: 78 },
  { t: 'Uzh Campus Irchel', x: 1104, y: 596, r: 0 },
  { t: 'Rothstrasse', x: 300, y: 690, r: -4 },
];
</script>

<template>
  <svg viewBox="0 0 1400 819" class="absolute inset-0 h-full w-full" aria-hidden="true">
    <rect width="1400" height="819" fill="var(--a20-map)" />

    <path v-for="(d, i) in GREEN" :key="`g${i}`" :d="d" fill="var(--a20-park)" />
    <path v-for="(d, i) in WATER" :key="`w${i}`" :d="d" fill="var(--a20-water)" />

    <!-- Minor: white fill on a faint casing. -->
    <g fill="none" stroke="#e2dfd8" stroke-width="4.6" stroke-linecap="round">
      <path v-for="(d, i) in MINOR" :key="`mc${i}`" :d="d" />
    </g>
    <g fill="none" stroke="var(--a20-minor)" stroke-width="3" stroke-linecap="round">
      <path v-for="(d, i) in MINOR" :key="`mf${i}`" :d="d" />
    </g>

    <!-- Secondary. -->
    <g fill="none" stroke="#e2c76e" stroke-width="10" stroke-linecap="round">
      <path v-for="(d, i) in SECONDARY" :key="`sc${i}`" :d="d" />
    </g>
    <g fill="none" stroke="var(--a20-secondary)" stroke-width="7.5" stroke-linecap="round">
      <path v-for="(d, i) in SECONDARY" :key="`sf${i}`" :d="d" />
    </g>

    <!-- Motorway. -->
    <g fill="none" stroke="#ad86c6" stroke-width="14" stroke-linecap="round">
      <path v-for="(d, i) in MOTORWAY" :key="`hc${i}`" :d="d" />
    </g>
    <g fill="none" stroke="var(--a20-motorway)" stroke-width="11" stroke-linecap="round">
      <path v-for="(d, i) in MOTORWAY" :key="`hf${i}`" :d="d" />
    </g>

    <!-- Motorway shields, the way OSM renders them. -->
    <g v-for="s in [{ x: 964, y: 332 }, { x: 1194, y: 246 }, { x: 878, y: 448 }]" :key="`sh${s.x}`">
      <rect :x="s.x - 13" :y="s.y - 8" width="26" height="16" rx="3" fill="#e8823a" />
      <text
        :x="s.x" :y="s.y + 4" text-anchor="middle"
        font-family="var(--font-sans)" font-size="10" font-weight="600" fill="#fff"
      >A1L</text>
    </g>

    <g fill="var(--a20-map-ink)" font-family="var(--font-sans)" font-size="11">
      <text
        v-for="l in LABELS" :key="l.t"
        :x="l.x" :y="l.y" text-anchor="middle"
        :transform="`rotate(${l.r} ${l.x} ${l.y})`"
      >{{ l.t }}</text>
    </g>
  </svg>
</template>
