<script setup lang="ts">
/* PLATES — the imagery layer, and the reason this sheet ships no photographs.
 *
 * The reference layout runs full-bleed stock photography under its headlines.
 * Stock is the one thing a design system cannot supply and the one thing a
 * defence company should not fake, so every image slot here is a GENERATED
 * monochrome field instead: halftone, contour, scan, orbit, swarm. They read as
 * instrumentation rather than as pictures — which is the honest register for a
 * company whose actual product is a picture of the ground.
 *
 * All five are drawn from the band's own `--hg-*` aliases, so a plate inverts
 * with its exposure and never carries a colour of its own. Geometry is seeded
 * and deterministic: the same plate renders identically every time, so a
 * screenshot diff of this page means something.
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    kind?: 'halftone' | 'contour' | 'scan' | 'orbit' | 'swarm';
    /** Changes the geometry without changing the kind. */
    seed?: number;
    /** Darken toward the bottom so overlaid type keeps its contrast. */
    scrim?: boolean;
  }>(),
  { kind: 'halftone', seed: 1, scrim: false },
);

/* Mulberry32 — small, seeded, deterministic. A plate must not change between
 * renders or the visual-regression story on this page becomes a coin toss. */
function rng(seed: number) {
  let a = seed * 1831565813 + 0x6d2b79f5;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 800;
const H = 600;

/** Halftone: a dot matrix whose radius follows a soft light source. */
const dots = computed(() => {
  if (props.kind !== 'halftone') return [];
  const r = rng(props.seed);
  const cx = 240 + r() * 320;
  const cy = 180 + r() * 240;
  const out: { x: number; y: number; r: number }[] = [];
  const step = 16;
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const d = Math.hypot(x - cx, y - cy) / 460;
      const fall = Math.max(0, 1 - d * d);
      const radius = fall * 6.4 + r() * 0.7;
      if (radius > 0.35) out.push({ x, y, r: +radius.toFixed(2) });
    }
  }
  return out;
});

/** Contour: stacked topographic bands from summed sines. */
const contours = computed(() => {
  if (props.kind !== 'contour') return [];
  const r = rng(props.seed);
  const p1 = r() * 6.28;
  const p2 = r() * 6.28;
  const out: string[] = [];
  for (let line = 0; line < 26; line++) {
    const base = line * 24 - 60;
    let d = '';
    for (let x = 0; x <= W; x += 16) {
      const y =
        base +
        Math.sin(x / 190 + p1 + line * 0.16) * 42 +
        Math.sin(x / 71 + p2 - line * 0.09) * 15;
      d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`;
    }
    out.push(d);
  }
  return out;
});

/** Scan: horizontal raster with dropped and doubled lines. */
const scan = computed(() => {
  if (props.kind !== 'scan') return [];
  const r = rng(props.seed);
  const out: { y: number; o: number; w: number }[] = [];
  for (let y = 0; y < H; y += 5) {
    const v = r();
    if (v < 0.14) continue;
    out.push({ y, o: +(0.08 + v * 0.5).toFixed(2), w: v > 0.94 ? 2.4 : 1 });
  }
  return out;
});

/** Orbit: concentric arcs with tick marks — a radar face, not a logo. */
const orbit = computed(() => {
  if (props.kind !== 'orbit') return { rings: [], ticks: [] };
  const r = rng(props.seed);
  const cx = W / 2;
  const cy = H / 2;
  const rings = [70, 130, 190, 250, 310].map((rad) => ({
    rad,
    dash: r() > 0.5 ? '3 7' : '',
    o: +(0.2 + r() * 0.4).toFixed(2),
  }));
  const ticks: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const len = i % 6 === 0 ? 18 : 8;
    ticks.push({
      x1: cx + Math.cos(a) * 318,
      y1: cy + Math.sin(a) * 318,
      x2: cx + Math.cos(a) * (318 + len),
      y2: cy + Math.sin(a) * (318 + len),
    });
  }
  return { rings, ticks };
});

/** Swarm: agents on a field with their track history. */
const swarm = computed(() => {
  if (props.kind !== 'swarm') return [];
  const r = rng(props.seed);
  return Array.from({ length: 14 }, () => {
    const x = 60 + r() * (W - 120);
    const y = 60 + r() * (H - 120);
    const a = r() * Math.PI * 2;
    const len = 40 + r() * 90;
    return {
      x: +x.toFixed(1),
      y: +y.toFixed(1),
      tx: +(x - Math.cos(a) * len).toFixed(1),
      ty: +(y - Math.sin(a) * len).toFixed(1),
      rot: +((a * 180) / Math.PI + 90).toFixed(1),
    };
  });
});
</script>

<template>
  <!-- A plate is ALWAYS an ink object, whichever exposure it sits in — the
       same way a photograph on a white page is still a photograph. Declaring
       the band on the element itself means the plate re-resolves its own
       ground and stroke from the ink aliases and never washes out on paper. -->
  <div class="hg-plate-el" data-band="ink" :data-scrim="scrim ? 'true' : 'false'">
    <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g v-if="kind === 'halftone'" fill="currentColor">
        <circle v-for="(d, i) in dots" :key="i" :cx="d.x" :cy="d.y" :r="d.r" :opacity="0.55" />
      </g>

      <g v-else-if="kind === 'contour'" fill="none" stroke="currentColor" stroke-width="1" opacity="0.42">
        <path v-for="(d, i) in contours" :key="i" :d="d" />
      </g>

      <g v-else-if="kind === 'scan'" stroke="currentColor">
        <line
          v-for="(l, i) in scan"
          :key="i"
          :x1="0"
          :y1="l.y"
          :x2="W"
          :y2="l.y"
          :stroke-width="l.w"
          :opacity="l.o"
        />
      </g>

      <g v-else-if="kind === 'orbit'" fill="none" stroke="currentColor">
        <circle
          v-for="(g, i) in orbit.rings"
          :key="`r${i}`"
          :cx="W / 2"
          :cy="H / 2"
          :r="g.rad"
          :stroke-dasharray="g.dash || undefined"
          :opacity="g.o"
        />
        <line
          v-for="(t, i) in orbit.ticks"
          :key="`t${i}`"
          :x1="t.x1"
          :y1="t.y1"
          :x2="t.x2"
          :y2="t.y2"
          opacity="0.5"
        />
      </g>

      <g v-else-if="kind === 'swarm'" stroke="currentColor" fill="none">
        <g opacity="0.85">
          <template v-for="(a, i) in swarm" :key="i">
            <line :x1="a.tx" :y1="a.ty" :x2="a.x" :y2="a.y" opacity="0.32" stroke-dasharray="2 5" />
            <path
              d="M0 -9 L6 8 L0 4 L-6 8 Z"
              :transform="`translate(${a.x} ${a.y}) rotate(${a.rot})`"
              fill="currentColor"
              stroke="none"
            />
            <circle :cx="a.x" :cy="a.y" r="17" opacity="0.22" />
          </template>
        </g>
      </g>
    </svg>
  </div>
</template>
