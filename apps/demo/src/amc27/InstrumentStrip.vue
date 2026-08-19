<script setup lang="ts">
/**
 * AMC27 · the instrument strip.
 *
 * The incumbent crams attitude, heading, speed, altitude and distance into one
 * overlapping corner of the video: a round compass with a course wedge sitting
 * on top of a four-row telemetry box, in three different type sizes, two
 * alignments and four hues. On a wide desktop that is the corner with the
 * least room and the most to say.
 *
 * Here the whole bottom edge is given to it, in three parts on one baseline:
 *
 *   attitude (what the aircraft is doing) │ measures (what it reads) │ heading
 *
 * The heading is a TAPE, not a rose. A rose spends a circle's worth of pixels
 * to show one number and forces the reader to interpolate an angle; a tape in
 * a wide strip shows the number, the neighbouring cardinals, the commanded
 * course and the wind bearing on one scale, and it reads left-to-right like
 * every other measure on the surface.
 */
import { computed } from 'vue';
import { t } from './telemetry';

/** Ticks every 10°, drawn across ±60° of the current heading. */
const SPAN = 60;
const PPD = 2.6; // px per degree

const ticks = computed(() => {
  const out: { deg: number; x: number; major: boolean; label: string | null }[] = [];
  const start = Math.ceil((t.heading - SPAN) / 10) * 10;
  for (let d = start; d <= t.heading + SPAN; d += 10) {
    const norm = ((d % 360) + 360) % 360;
    const major = norm % 30 === 0;
    const CARDINALS: Record<number, string> = { 0: 'N', 90: 'E', 180: 'S', 270: 'W' };
    out.push({
      deg: norm,
      x: (d - t.heading) * PPD,
      major,
      label: major ? (CARDINALS[norm] ?? String(norm / 10).padStart(2, '0')) : null,
    });
  }
  return out;
});

const courseX = computed(() => (t.course - t.heading) * PPD);
const windX = computed(() => {
  let d = t.windDir - t.heading;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d * PPD;
});

/** Vertical speed drives the ladder only when it leaves the normal envelope. */
const vsLevel = computed(() => (Math.abs(t.vs) > 4 ? 'caution' : 'nominal'));

/** The seven measures, in reading order. Declared once so the strip's markup
 * stays a layout and not a list of facts. */
const measures = computed(() => [
  { label: 'AIRSPEED', v: t.as.toFixed(1), u: 'm/s', level: null as string | null },
  { label: 'GROUND', v: t.gs.toFixed(1), u: 'm/s', level: null as string | null },
  {
    label: 'VERTICAL',
    v: (t.vs > 0 ? '+' : '') + t.vs.toFixed(1),
    u: 'm/s',
    level: vsLevel.value as string | null,
  },
  { label: 'ALT AGL', v: String(t.agl), u: 'm', level: null as string | null },
  { label: 'ALT MSL', v: String(t.msl), u: 'm', level: null as string | null },
  { label: 'HOME', v: String(t.home), u: 'm', level: null as string | null },
  { label: 'THROTTLE', v: String(t.thr), u: '%', level: null as string | null },
]);
</script>

<template>
  <footer class="a27-strip">
    <!-- ── Attitude ───────────────────────────────────────────────────────
         Ink only. Roll and pitch are geometry, not severity, so the horizon
         is drawn with contrast and never with a status hue. -->
    <div
      class="flex items-center justify-center"
      style="border-right: 1px solid var(--a27-line-2)"
    >
      <div class="relative">
        <svg viewBox="0 0 100 100" width="72" height="72" role="img" aria-label="Attitude indicator">
          <defs>
            <clipPath id="a27-ahi"><circle cx="50" cy="50" r="38" /></clipPath>
          </defs>
          <g :clip-path="'url(#a27-ahi)'">
            <g :transform="`rotate(${-t.roll} 50 50) translate(0 ${t.pitch * 1.4})`">
              <!-- Sky and ground need a real separation, not one step on the
                   ink ramp. Named as a mix of the theme's own foreground so
                   all four themes re-resolve it together. -->
              <rect
                x="-40" y="-40" width="180" height="90"
                fill="color-mix(in oklab, var(--foreground) 30%, var(--card))"
              />
              <rect
                x="-40" y="50" width="180" height="120"
                fill="color-mix(in oklab, var(--foreground) 6%, var(--card))"
              />
              <line x1="-40" y1="50" x2="140" y2="50" stroke="var(--a27-ink)" stroke-width="1.2" />
              <g stroke="var(--a27-ink-2)" stroke-width="0.8">
                <line x1="38" y1="34" x2="62" y2="34" />
                <line x1="43" y1="42" x2="57" y2="42" />
                <line x1="43" y1="58" x2="57" y2="58" />
                <line x1="38" y1="66" x2="62" y2="66" />
              </g>
            </g>
          </g>
          <circle cx="50" cy="50" r="38" fill="none" stroke="var(--a27-line)" stroke-width="1" />
          <!-- Aircraft symbol: fixed, full contrast. -->
          <g stroke="var(--a27-ink)" stroke-width="1.8" fill="none">
            <path d="M32 50 H44 L50 55 L56 50 H68" stroke-linejoin="round" />
          </g>
          <!-- Roll pointer -->
          <g :transform="`rotate(${-t.roll} 50 50)`">
            <path d="M50 12 L46.5 18 L53.5 18 Z" fill="var(--a27-ink)" />
          </g>
        </svg>
      </div>
    </div>

    <!-- ── Measures ───────────────────────────────────────────────────────
         Seven facts in fixed slots, label over value, unit demoted. Every
         value starts on a slot boundary, so a number changing width never
         nudges its neighbours — the incumbent's cluster reflows as it ticks. -->
    <div class="grid items-center px-3" style="grid-template-columns: repeat(7, minmax(0, 1fr))">
      <div
        v-for="f in measures"
        :key="f.label"
        class="min-w-0 px-2"
        style="border-left: 1px solid var(--a27-line-2)"
      >
        <p class="a27-label">{{ f.label }}</p>
        <p class="mt-1.5 flex items-baseline gap-1">
          <span class="a27-meas a27-meas-lg" :class="f.level ? `a27-ink-${f.level}` : ''">{{ f.v }}</span>
          <span class="a27-unit">{{ f.u }}</span>
        </p>
      </div>
    </div>

    <!-- ── Heading tape ───────────────────────────────────────────────────
         One scale carrying four things: current heading (the boxed number),
         the tape itself, the commanded course (hollow marker) and the wind
         bearing (a small barb). Ink throughout — a heading is not a severity,
         and the status ladder must not be borrowed for one. -->
    <div
      class="relative flex flex-col justify-center gap-2 px-3"
      style="border-left: 1px solid var(--a27-line-2)"
    >
      <div class="flex items-baseline justify-between">
        <span class="flex items-baseline gap-2">
          <span class="a27-label">HEADING</span>
          <!-- The one number a pilot reads without looking for it, boxed and
               at measure size, ABOVE the tape rather than on top of it — a box
               parked over the tape's centre hides the very tick it marks. -->
          <span
            class="px-1.5 py-0.5"
            style="border: 1px solid var(--a27-ink); border-radius: 2px"
          >
            <span class="a27-meas">{{ String(t.heading).padStart(3, '0') }}°</span>
          </span>
        </span>
        <span class="a27-micro">CRS {{ t.course }}° · WIND {{ t.wind }} m/s @ {{ t.windDir }}°</span>
      </div>

      <div class="relative h-11 overflow-hidden">
        <svg viewBox="-138 0 276 44" width="100%" height="44" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="var(--a27-line)" stroke-width="1">
            <line x1="-138" y1="26" x2="138" y2="26" />
          </g>
          <g v-for="tk in ticks" :key="tk.deg + '-' + tk.x">
            <line
              :x1="tk.x"
              :x2="tk.x"
              y1="26"
              :y2="tk.major ? 17 : 21"
              stroke="var(--a27-ink-3)"
              stroke-width="1"
            />
            <text
              v-if="tk.label"
              :x="tk.x"
              y="12"
              text-anchor="middle"
              font-family="var(--font-mono)"
              font-size="9"
              fill="var(--a27-ink-2)"
            >{{ tk.label }}</text>
          </g>
          <!-- commanded course -->
          <path
            :transform="`translate(${courseX} 0)`"
            d="M0 26 L-4 33 L4 33 Z"
            fill="none"
            stroke="var(--a27-ink-2)"
            stroke-width="1.2"
          />
          <!-- wind barb -->
          <g :transform="`translate(${windX} 0)`">
            <line x1="0" y1="34" x2="0" y2="42" stroke="var(--a27-ink-3)" stroke-width="1" />
            <line x1="0" y1="42" x2="5" y2="40" stroke="var(--a27-ink-3)" stroke-width="1" />
          </g>
          <!-- The lubber line: where the tape reads the current heading. -->
          <line x1="0" y1="14" x2="0" y2="30" stroke="var(--a27-ink)" stroke-width="1.5" />
        </svg>
      </div>
    </div>
  </footer>
</template>
