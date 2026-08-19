<script setup lang="ts">
/**
 * AMC · moving-map view.
 *
 * The chrome speaks 07b — mono labels, brackets on measured facts, hairlines,
 * one ink ramp. The READOUTS do not: no display cut, no ghost line and no
 * pointer glyph lands on altitude, speed, heading or battery. Those stay
 * instrument-plain at full contrast.
 *
 * Signal budget: ONE blue surface, spent on the ownship track — the flight
 * path, the waypoints strung on it and the vehicle symbol are one object, and
 * that object is the single thing this view exists to show. Everything else
 * that used to be blue (the heading readout, the flight-mode chip, the
 * attitude reference symbol, the range ring, the selected rail control) is now
 * INK: weight carried by contrast, which is both the editorial move and the
 * legible one over terrain. Blue never encodes state here.
 */
import { computed } from 'vue';
import { TelemetryValue, CoordinateValue, Progress, Button, GuardedAction } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { m, path, home, vehiclePos as vehicle } from './mission';

defineProps<{ mode: 'day' | 'night' }>();

const pathD = path.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

/** Pixels per degree on the heading tape — geometry, bound inline like the
 *  waypoint coordinates rather than hidden in a class. */
const DEG_PX = 3;

/** The tape labels every third tick relative to the CENTRE, not on absolute
 *  30° boundaries — at heading 123 no tick lands on a multiple of 30, and the
 *  tape rendered with no labels at all. A heading tape with nothing written on
 *  it is not an instrument. */
const headings = computed(() => {
  const out: { deg: number; off: number; major: boolean }[] = [];
  for (let d = -70; d <= 70; d += 10) {
    const deg = (((m.heading + d) % 360) + 360) % 360;
    out.push({ deg, off: d, major: d % 30 === 0 });
  }
  return out;
});
const compassLabel = (deg: number) => ({ 0: 'N', 90: 'E', 180: 'S', 270: 'W' })[deg] ?? String(deg);
const rungs = [20, 10, -10, -20];

/** Bracketed totals — measured facts, counted rather than typed. */
const legBracket = computed(
  () => `${m.vehicle} · WP ${m.wp}/${m.wpTotal} · ${(m.dist / 1000).toFixed(2)} KM`,
);
const battLevel = computed(() => (m.battery < 35 ? 'warning' : 'nominal'));
</script>

<template>
  <div class="absolute inset-0">
    <div class="map-terrain absolute inset-0" :class="mode === 'night' ? 'map-night' : ''" />
    <svg viewBox="0 0 1160 760" class="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <!-- Terrain: the ONE sanctioned exemption from the token system —
           topographic legibility is a functional requirement, so these fills
           are hardcoded and deliberately do not re-resolve per theme. -->
      <path d="M1160 250 C 1010 300, 980 470, 1030 600 S 1080 740, 1160 760 L1160 250 Z" fill="#2b4a5c" opacity="0.78" />
      <path d="M1160 250 C 1010 300, 980 470, 1030 600 S 1080 740, 1160 760" fill="none" stroke="#dfe7e0" stroke-width="2" opacity="0.25" />
      <polygon points="0,420 360,372 520,470 360,620 0,640" fill="#5b6a3a" opacity="0.5" />
      <polygon points="520,470 740,420 700,600 480,620" fill="#6d7544" opacity="0.42" />
      <polygon points="0,640 360,620 320,760 0,760" fill="#4f5b33" opacity="0.5" />
      <polygon points="120,120 520,96 700,250 420,330 80,250" fill="#707a4a" opacity="0.4" />
      <ellipse cx="880" cy="150" rx="150" ry="120" fill="#374a2a" opacity="0.5" />
      <g stroke="#3a4326" stroke-width="1" opacity="0.3">
        <path d="M0 470 L520 430" /><path d="M0 540 L500 520" /><path d="M360 96 L420 330" />
      </g>
      <path d="M-20 200 C 240 300, 180 470, 460 540 S 820 660, 900 700" fill="none" stroke="#3a5a6b" stroke-width="16" opacity="0.5" stroke-linecap="round" />
      <path d="M0 360 L1160 280" stroke="#c9c3b2" stroke-width="3" opacity="0.2" />
      <path d="M420 0 L470 760" stroke="#c9c3b2" stroke-width="2.5" opacity="0.16" />

      <!-- Range ring: a graticule, not ownship. Ink, so it reads as scale
           furniture rather than as part of the track. -->
      <circle :cx="vehicle.x" :cy="vehicle.y" r="320" fill="none" stroke="var(--dk-fg-3)" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.55" />

      <!-- ═══ Ownship track — the view's ONE signal surface ═══ -->
      <path :d="pathD" fill="none" stroke="var(--dk-signal)" stroke-width="2.5" stroke-dasharray="2 7" stroke-linecap="round" />
      <g v-for="(p, i) in path" :key="i">
        <circle
          :cx="p[0]" :cy="p[1]"
          :r="i === m.wp ? 13 : 9"
          :fill="i < m.wp ? 'var(--dk-fg)' : 'var(--dk-bg)'"
          :stroke="i === m.wp ? 'var(--dk-signal)' : i < m.wp ? 'var(--dk-fg)' : 'var(--dk-fg-3)'"
          :stroke-width="i === m.wp ? 2.5 : 1.5"
          :opacity="i > m.wp ? 0.7 : 1"
        />
        <text
          :x="p[0]" :y="p[1] + 4"
          text-anchor="middle"
          :font-size="i === m.wp ? 11 : 9"
          font-family="ui-monospace, monospace"
          :fill="i < m.wp ? 'var(--dk-bg)' : 'var(--dk-fg)'"
          :opacity="i > m.wp ? 0.7 : 1"
        >{{ i + 1 }}</text>
      </g>
      <!-- Home: a SOLID ink disc with the glyph knocked out, against the hollow
           ink rings of the waypoints. It used to be drawn in `nominal` green,
           which reused a rung of the reserved severity ladder for a map symbol
           that reports no state at all. Figure/ground carries it instead. -->
      <g :transform="`translate(${home[0]}, ${home[1]})`">
        <circle r="13" fill="var(--dk-fg)" />
        <path d="M-5 1 L0 -5 L5 1 M-3.5 0 V5 H3.5 V0" fill="none" stroke="var(--dk-bg)" stroke-width="1.6" />
      </g>
      <circle :cx="vehicle.x" :cy="vehicle.y" r="16" fill="var(--dk-signal)" class="veh-pulse" />
      <g :transform="`translate(${vehicle.x}, ${vehicle.y}) rotate(${m.heading - 360})`">
        <path d="M0 0 L-24 -50 A54 54 0 0 1 24 -50 Z" fill="var(--dk-signal)" opacity="0.16" />
        <circle r="15" fill="var(--dk-bg)" stroke="var(--dk-signal)" stroke-width="2" />
      </g>
      <g :transform="`translate(${vehicle.x}, ${vehicle.y})`" style="color: var(--dk-signal)">
        <Icon name="drone" :size="18" class="-translate-x-[9px] -translate-y-[9px]" />
      </g>
    </svg>

    <div class="amc-vignette" />

    <!-- ═══ Top status bar ═══ -->
    <div class="amc-glass amc-bar-top flex items-center gap-3 px-3">
      <button type="button" class="amc-glass-btn" aria-label="Back"><Icon name="chevron-left" size="sm" /></button>
      <div class="min-w-0">
        <p class="dk-value truncate">{{ m.mission }}</p>
        <span class="dk-bracket">{{ legBracket }}</span>
      </div>

      <!-- Heading tape. Instrument-plain: mono, tabular, full contrast, and the
           centre readout is INK — a heading is a measured fact, not brand. -->
      <div class="relative mx-2 h-9 flex-1 self-center overflow-hidden">
        <div class="relative h-full w-full">
          <div
            v-for="h in headings"
            :key="h.off"
            class="absolute top-0 flex h-full flex-col items-center justify-center"
            :style="{ left: `calc(50% + ${h.off * DEG_PX}px)`, transform: 'translateX(-50%)' }"
          >
            <span
              v-if="h.major"
              class="font-mono text-[10px] tabular-nums"
              :style="{ color: [0, 90, 180, 270].includes(h.deg) ? 'var(--dk-fg)' : 'var(--dk-fg-2)' }"
            >{{ compassLabel(h.deg) }}</span>
            <span class="mt-0.5 w-px" :class="h.major ? 'h-2' : 'h-1'" style="background: var(--dk-fg-3)" />
          </div>
        </div>
        <div class="absolute left-1/2 top-0 -translate-x-1/2">
          <span
            class="rounded-[4px] px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums"
            style="background: var(--dk-fg); color: var(--dk-bg)"
          >{{ m.heading }}°</span>
          <span
            class="absolute -bottom-0.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent"
            style="border-bottom-color: var(--dk-fg)"
          />
        </div>
      </div>

      <span class="amc-chip dk-label" style="background: var(--dk-bg-2); color: var(--dk-fg)">{{ m.flightMode }}</span>
      <span class="amc-inline">
        <span class="dk-micro">BATT</span>
        <span class="dk-dot" :class="`dk-dot-${battLevel}`" />
        <span class="font-mono text-[13px] font-semibold tabular-nums" :class="`dk-ink-${battLevel}`">{{ m.battery }}%</span>
      </span>
      <span class="amc-inline">
        <span class="dk-micro">SATS</span>
        <span class="font-mono text-[12px] tabular-nums" style="color: var(--dk-fg)">RTK·{{ m.sats }}</span>
      </span>
      <button type="button" class="amc-glass-btn" aria-label="More"><Icon name="ellipsis" size="sm" /></button>
    </div>

    <!-- ═══ Left instrument cluster ═══ -->
    <div class="amc-glass amc-rail-l amc-cluster amc-pad">
      <div class="dk-section mb-2.5">
        <span class="dk-label">Attitude</span>
        <span class="font-mono text-[10px] tabular-nums" style="color: var(--dk-fg)">{{ m.heading }}°</span>
      </div>
      <div class="mx-auto w-[176px]">
        <svg viewBox="-100 -100 200 200" class="h-[176px] w-[176px]">
          <defs><clipPath id="ahi-map"><circle r="84" /></clipPath></defs>
          <g clip-path="url(#ahi-map)">
            <g :transform="`rotate(${m.roll}) translate(0 ${m.pitch * 3})`">
              <rect x="-260" y="-260" width="520" height="260" fill="var(--amc-ahi-sky)" />
              <rect x="-260" y="0" width="520" height="260" fill="var(--amc-ahi-ground)" />
              <line x1="-260" y1="0" x2="260" y2="0" stroke="var(--dk-fg)" stroke-width="1.5" />
              <g stroke="var(--dk-fg-3)" stroke-width="1.2">
                <line v-for="r in rungs" :key="r" :x1="-22" :y1="-r * 3" :x2="22" :y2="-r * 3" />
              </g>
            </g>
          </g>
          <!-- Reference symbol: INK at full contrast, not signal. A bank
               pointer that reads as brand is a bank pointer you argue with. -->
          <g stroke="var(--dk-fg)" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M-36 0 L-14 0 L0 9 L14 0 L36 0" /></g>
          <circle r="2.4" fill="var(--dk-fg)" />
          <g stroke="var(--dk-fg-3)" stroke-width="1.2">
            <line x1="0" y1="-84" x2="0" y2="-78" /><line x1="-29" y1="-79" x2="-26" y2="-72" /><line x1="29" y1="-79" x2="26" y2="-72" />
          </g>
          <path :transform="`rotate(${m.roll})`" d="M0 -84 L-5 -74 L5 -74 Z" fill="var(--dk-fg)" />
          <circle r="84" fill="none" stroke="var(--dk-line)" stroke-width="1.5" />
        </svg>
      </div>
      <div class="dk-section mb-2.5 mt-3">
        <span class="dk-label">Telemetry</span>
      </div>
      <div class="grid grid-cols-2 gap-x-3 gap-y-2">
        <TelemetryValue :value="m.alt" unit="m" label="ALT" size="sm" />
        <TelemetryValue :value="m.speed" unit="m/s" label="SPD" size="sm" />
        <TelemetryValue :value="m.vspeed" unit="m/s" label="V/S" size="sm" :trend="m.vspeed > 0 ? 'up' : 'down'" />
        <TelemetryValue :value="m.dist / 1000" unit="km" label="DIST" size="sm" />
      </div>
    </div>

    <!-- ═══ Right rail — video PiP over the control stack ═══ -->
    <div class="amc-rail-r flex flex-col items-end gap-2">
      <div class="amc-glass amc-pip overflow-hidden p-1.5">
        <div class="feed-pip relative aspect-video w-full overflow-hidden" style="border-radius: var(--dk-r)">
          <!-- The tally is INK, not `alarm`. Recording is not a severity, and
               spending the ladder's top rung on a benign capture state teaches
               an operator to read the alarm hue as routine. Shape and blink
               carry it instead. -->
          <span class="dk-micro amc-osd absolute left-2 top-2 flex items-center gap-1.5" style="color: var(--dk-fg)">
            <span class="rec-dot h-1.5 w-1.5 rounded-full" style="background: var(--dk-fg)" /> REC
          </span>
          <span class="dk-micro amc-osd absolute bottom-2 left-2" style="color: var(--dk-fg)">CAM · EO/IR</span>
        </div>
      </div>

      <button type="button" class="amc-glass-btn amc-glass-btn-lg" aria-label="Layers"><Icon name="bars" size="sm" /></button>
      <button type="button" class="amc-glass-btn amc-glass-btn-lg" data-active="true" aria-label="Follow vehicle"><Icon name="drone" size="sm" /></button>
      <div class="amc-glass amc-glass-stack amc-glass-stack-v">
        <button type="button" class="amc-glass-btn amc-glass-btn-lg" aria-label="Zoom in"><Icon name="plus" size="sm" /></button>
        <span class="amc-glass-sep h-px w-6" />
        <button type="button" class="amc-glass-btn amc-glass-btn-lg" aria-label="Zoom out"><Icon name="minus" size="sm" /></button>
      </div>
    </div>

    <!-- ═══ In-flight caution — the ladder, at full strength ═══ -->
    <div class="amc-glass amc-notice amc-edge amc-edge-caution amc-inline py-2 pl-3 pr-3">
      <Icon name="triangle-exclamation" size="sm" class="dk-ink-caution" />
      <span class="dk-label dk-ink-caution">Wind</span>
      <span class="text-[12px]" style="color: var(--dk-fg)">9.4 m/s gusting 13 — crosswind on leg 4</span>
    </div>

    <!-- ═══ Bottom action bar ═══ -->
    <div class="amc-glass amc-bar-bottom flex h-16 items-center gap-4 px-4">
      <div class="w-64">
        <div class="mb-1.5 flex items-center justify-between">
          <span class="dk-label">Waypoint {{ m.wp }} / {{ m.wpTotal }}</span>
          <span class="amc-inline">
            <span class="dk-micro">ETA</span>
            <span class="font-mono text-[12px] tabular-nums" style="color: var(--dk-fg)">{{ m.eta }}</span>
          </span>
        </div>
        <!-- No `level`: progress along a route is not a severity, and the
             reserved ladder must not be borrowed to tint a bar. -->
        <Progress :value="m.progress" />
      </div>
      <div class="ml-auto flex items-center gap-2">
        <span class="amc-inline mr-2">
          <Icon name="house" size="xs" class="dk-ink-nominal" />
          <span class="dk-label">Pos</span>
          <CoordinateValue :lat="m.lat" :lon="m.lon" format="mgrs" :mgrs-accuracy="4" size="sm" show-format-tag />
        </span>
        <Button variant="secondary" size="md" class="gap-1.5"><Icon name="circle-info" size="xs" /> Pause</Button>
        <GuardedAction mode="hold" variant="primary" size="md" confirm-label="Hold to RTL…" @confirm="() => {}">Return to Launch</GuardedAction>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Terrain and the PiP frame are IMAGERY, not UI: the map fills are the one
 * sanctioned exemption from the token system (topographic legibility is a
 * functional requirement) and the PiP is a stand-in for a live sensor frame.
 * Every other colour in this view resolves through `--dk-*` or a DS token. */
.map-terrain {
  background:
    radial-gradient(36% 34% at 18% 30%, #6f7a48 0%, transparent 60%),
    radial-gradient(44% 46% at 70% 62%, #57633a 0%, transparent 60%),
    radial-gradient(60% 50% at 40% 92%, #444f2e 0%, transparent 70%),
    linear-gradient(160deg, #5d6a3e 0%, #4a5532 50%, #3c4a30 100%);
}
.map-terrain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(0, 0, 0, 0.16) 1px, transparent 1px);
  background-size: 8px 8px;
  opacity: 0.5;
}
.map-night { filter: brightness(0.4) saturate(0.7) hue-rotate(-8deg); }
.feed-pip { background: linear-gradient(160deg, #2c3e2a, #1a2630 70%); }
.feed-pip::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 50% at 35% 30%, rgba(120, 150, 110, 0.4), transparent);
}

/* Motion: two claims being kept, not two entrances. The ownship pulse says the
 * track is live; the REC dot says the payload is recording. */
.veh-pulse { transform-box: fill-box; transform-origin: center; animation: veh-pulse 2.4s ease-out infinite; }
@keyframes veh-pulse { 0% { transform: scale(1); opacity: 0.35; } 70% { transform: scale(3.6); opacity: 0; } 100% { transform: scale(3.6); opacity: 0; } }
.rec-dot { animation: rec-blink 1.4s steps(1) infinite; }
@keyframes rec-blink { 0%, 60% { opacity: 1; } 61%, 100% { opacity: 0.25; } }
@media (prefers-reduced-motion: reduce) { .veh-pulse, .rec-dot { animation: none; } }
</style>
