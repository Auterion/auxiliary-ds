<script setup lang="ts">
/**
 * AMC · gimbal feed view.
 *
 * Everything here sits on top of a live sensor image, so the whole view is
 * "readout" and almost none of it is chrome: no display cut, no ghost line, no
 * pointer glyph. Mono measures, ink at full contrast, and an OSD shadow where
 * text touches the frame directly.
 *
 * Signal budget: ONE blue surface — the ownship track in the map PiP, the same
 * symbology the map view spends its signal on. Tracking, the reticle, the
 * selected rail control and the compass ownship arrow are all INK: blue never
 * encodes state, and on a compass a bank/course symbol has to win on contrast,
 * not on hue. The course wedge is ink too — the status ladder is reserved for
 * severity and must not be borrowed for a heading.
 */
import { computed, ref } from 'vue';
import { TelemetryValue, GuardedAction } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { m } from './mission';

defineProps<{ mode: 'day' | 'night' }>();

const recording = ref(true);
const tracking = ref(false);

const batteryDash = `${(m.battery / 100) * 339.3} 339.3`; // r=54 → C≈339.3
const battLevel = computed(() => (m.battery < 35 ? 'warning' : 'nominal'));

const actions = [
  { icon: 'drone', label: 'Arm' },
  { icon: 'arrow-up', label: 'Altitude' },
  { icon: 'plus', label: 'Marker' },
] as const;
</script>

<template>
  <div class="absolute inset-0">
    <!-- ─── Gimbal feed (full-bleed) ─── -->
    <div class="feed absolute inset-0" :class="mode === 'night' ? 'feed-night' : ''" />

    <!-- OSD burn-in: mono, tabular, shadowed. Sits directly on the frame. -->
    <div class="pointer-events-none absolute inset-x-0 top-16 flex justify-center">
      <p class="dk-label amc-osd flex items-center gap-2" style="color: var(--dk-fg)">
        <span class="dk-num">FPS {{ m.fps }}</span><span class="amc-glyph">/</span>
        <span class="dk-num">Z {{ m.zoom.toFixed(1) }}</span><span class="amc-glyph">/</span>
        <span>{{ tracking ? 'TRACK ACTIVE' : 'TRACK INACTIVE' }}</span>
      </p>
    </div>
    <!-- Reticle: state carried by contrast, never by hue. -->
    <div class="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2">
      <svg viewBox="0 0 112 112" class="h-full w-full" style="color: var(--dk-fg)">
        <g fill="none" stroke="currentColor" :stroke-width="tracking ? 2 : 1.5" :opacity="tracking ? 1 : 0.55">
          <path d="M8 24 V8 H24 M88 8 H104 V24 M104 88 V104 H88 M24 104 H8 V88" />
          <line x1="56" y1="40" x2="56" y2="50" /><line x1="56" y1="62" x2="56" y2="72" />
          <line x1="40" y1="56" x2="50" y2="56" /><line x1="62" y1="56" x2="72" y2="56" />
        </g>
      </svg>
    </div>

    <!-- ─── Top status bar ─── -->
    <div class="amc-glass amc-bar-top flex items-center gap-2 px-2.5">
      <button type="button" class="amc-glass-btn" aria-label="Back"><Icon name="chevron-left" size="sm" /></button>

      <span class="dk-inset amc-inline px-2.5 py-1">
        <Icon name="drone" size="xs" class="amc-glyph" />
        <span class="leading-tight">
          <span class="dk-value amc-value-sm block">Vehicle 1</span>
          <span class="dk-micro">{{ m.vehicle }}</span>
        </span>
        <span class="dk-dot dk-dot-nominal" />
      </span>

      <button type="button" class="amc-chip amc-chip-md amc-hairline">
        <span class="dk-label">{{ m.flightMode }}</span>
        <Icon name="chevron-down" size="xs" class="amc-glyph" />
      </button>

      <!-- Arm state — the single most consequential fact in the bar. -->
      <button type="button" class="amc-chip amc-chip-md mx-auto" style="border: 1px solid var(--dk-line)">
        <span class="dk-value amc-value-sm">{{ m.armed ? 'Armed' : 'Disarmed' }}</span>
        <Icon name="chevron-down" size="xs" class="amc-glyph" />
      </button>

      <!-- right cluster — measured facts, mono, tabular, hard right -->
      <span class="amc-inline">
        <Icon name="bars" size="sm" style="color: var(--dk-fg)" />
        <span class="flex flex-col gap-0.5 leading-none">
          <span class="dk-micro dk-num">RSSI {{ m.rssi }}</span>
          <span class="dk-micro dk-num">SNR {{ m.snr }}</span>
        </span>
      </span>
      <span class="flex flex-col gap-0.5 leading-none">
        <span class="dk-micro dk-num"><span style="color: var(--dk-fg)">{{ m.voltage }}</span> V</span>
        <span class="dk-micro dk-num">{{ m.current }} A</span>
      </span>
      <span class="amc-hairline flex flex-col gap-0.5 px-2 py-1 leading-none">
        <span class="dk-micro dk-num">HACC {{ m.hacc }}</span>
        <span class="dk-micro dk-num">VACC {{ m.vacc }}</span>
        <span class="dk-micro dk-num">NSAT {{ m.sats }}</span>
      </span>
      <!-- Battery: the ladder, at full strength and never dimmed. -->
      <span class="relative h-9 w-9">
        <svg viewBox="0 0 120 120" class="h-9 w-9 -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--dk-line)" stroke-width="12" />
          <circle cx="60" cy="60" r="54" fill="none" :stroke="`var(--${battLevel})`" stroke-width="12" :stroke-dasharray="batteryDash" stroke-linecap="round" />
        </svg>
        <span
          class="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold tabular-nums"
          :class="`dk-ink-${battLevel}`"
        >{{ m.battery }}</span>
      </span>
    </div>

    <!-- ─── Left action rail ─── -->
    <div class="amc-rail-l flex flex-col gap-2.5">
      <div v-for="a in actions" :key="a.label" class="flex items-center gap-2.5">
        <button type="button" class="amc-glass amc-glass-btn amc-glass-btn-lg" :aria-label="a.label"><Icon :name="a.icon" size="md" /></button>
        <span class="amc-glass amc-chip dk-label">{{ a.label }}</span>
      </div>
    </div>

    <!-- ─── Right gimbal / payload controls ─── -->
    <div class="amc-rail-r flex flex-col items-center gap-2">
      <span class="amc-glass amc-chip amc-edge amc-edge-alarm dk-label dk-ink-alarm">Strike</span>
      <GuardedAction mode="hold" variant="danger" size="md" confirm-label="Hold…" class="amc-touch-target" @confirm="() => {}">
        <Icon name="triangle-exclamation" size="sm" />
      </GuardedAction>
      <button type="button" class="amc-glass-btn amc-glass-btn-lg" aria-label="Gimbal up"><Icon name="chevron-up" size="sm" /></button>
      <button
        type="button"
        class="amc-glass-btn amc-glass-btn-lg"
        :data-active="tracking"
        :aria-pressed="tracking"
        @click="tracking = !tracking"
      >
        <Icon name="plus" size="md" />
      </button>
      <span class="amc-glass amc-chip dk-label">Track</span>

      <div class="mt-2 flex flex-col items-center gap-2">
        <span class="amc-glass amc-chip dk-label dk-num">FOV {{ m.fov }}°</span>
        <div class="amc-glass amc-glass-stack">
          <button type="button" class="amc-glass-btn amc-glass-btn-lg" aria-label="Zoom out"><Icon name="minus" size="sm" /></button>
          <span class="amc-glass-sep h-6 w-px" />
          <button type="button" class="amc-glass-btn amc-glass-btn-lg" aria-label="Zoom in"><Icon name="plus" size="sm" /></button>
        </div>
        <button type="button" class="amc-glass amc-chip dk-label"><Icon name="gear" size="xs" /> Video</button>
        <!-- Record: the shape carries the state, not a hue. The status ladder
             is reserved for severity, and "recording" is not one. -->
        <button
          type="button"
          class="amc-glass amc-glass-btn amc-glass-btn-lg"
          :aria-pressed="recording"
          :aria-label="recording ? 'Stop recording' : 'Start recording'"
          @click="recording = !recording"
        >
          <span
            class="rec-mark"
            :class="recording ? 'h-4 w-4 rounded-[3px]' : 'h-7 w-7 rounded-full'"
            style="background: var(--dk-fg)"
          />
        </button>
      </div>
    </div>

    <!-- ─── Bottom-left: map PiP + quick actions ─── -->
    <div class="amc-dock-l flex items-end gap-2.5">
      <div class="flex flex-col gap-2">
        <button type="button" class="amc-glass amc-glass-btn amc-glass-btn-lg" data-active="true" aria-label="Expand map"><Icon name="arrow-up-right-from-square" size="sm" /></button>
        <button type="button" class="amc-glass amc-glass-btn amc-glass-btn-lg" aria-label="Home"><Icon name="house" size="sm" /></button>
        <button type="button" class="amc-glass amc-glass-btn amc-glass-btn-lg" aria-label="Settings"><Icon name="gear" size="sm" /></button>
      </div>
      <div class="amc-glass relative h-[140px] w-[200px] overflow-hidden p-1">
        <div class="map-mini h-full w-full" style="border-radius: var(--dk-r)" />
        <!-- The view's ONE blue surface: the ownship track. -->
        <svg viewBox="0 0 230 150" class="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)]" aria-hidden="true">
          <path d="M30 120 C 80 90, 90 60, 150 50 S 210 30, 220 20" fill="none" stroke="var(--dk-signal)" stroke-width="1.5" stroke-dasharray="2 5" />
          <circle cx="120" cy="66" r="5" fill="var(--dk-signal)" />
        </svg>
        <button type="button" class="amc-glass-btn amc-glass-btn-xs absolute right-2 top-2" aria-label="Open map"><Icon name="arrow-up-right-from-square" size="xs" /></button>
      </div>
    </div>

    <!-- ─── Bottom-right: telemetry + compass ─── -->
    <div class="amc-dock-r flex items-end gap-2.5">
      <div class="amc-glass amc-pad relative grid grid-cols-2 items-center gap-x-4 gap-y-1.5">
        <div class="dk-section col-span-2 mb-0.5">
          <span class="dk-label">Elapsed</span>
          <span class="font-mono text-[11px] tabular-nums" style="color: var(--dk-fg)">{{ m.timer }}</span>
        </div>
        <TelemetryValue :value="m.gs" unit="m/s" label="GS" size="sm" />
        <TelemetryValue :value="m.vspeed" unit="m/s" label="V/S" size="sm" :trend="m.vspeed > 0 ? 'up' : 'down'" />
        <TelemetryValue :value="m.dist / 1000" unit="km" label="DST" size="sm" />
        <TelemetryValue :value="m.msl" unit="m" label="MSL" size="sm" />
      </div>

      <!-- compass rose — instrument-plain, ink only -->
      <div class="amc-glass amc-round flex h-[108px] w-[108px] items-center justify-center">
        <svg viewBox="-60 -60 120 120" class="h-[96px] w-[96px]">
          <circle r="54" fill="none" stroke="var(--dk-line)" stroke-width="1" />
          <g stroke="var(--dk-fg-3)" stroke-width="1">
            <line v-for="t in 12" :key="t" :transform="`rotate(${t * 30})`" x1="0" y1="-54" x2="0" y2="-48" />
          </g>
          <g font-family="ui-monospace, monospace" font-size="11" font-weight="600" text-anchor="middle" fill="var(--dk-fg)">
            <text x="0" y="-40">N</text><text x="44" y="4">E</text><text x="0" y="48">S</text><text x="-44" y="4">W</text>
          </g>
          <!-- course wedge + ownship: ink, not a status hue and not the signal -->
          <path :transform="`rotate(${m.heading})`" d="M0 0 L-9 -46 A46 46 0 0 1 9 -46 Z" fill="var(--dk-fg)" opacity="0.16" />
          <path :transform="`rotate(${m.heading})`" d="M0 -16 L9 10 L0 4 L-9 10 Z" fill="var(--dk-fg)" />
          <circle r="2" fill="var(--dk-fg)" />
          <text x="0" y="34" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" font-weight="700" fill="var(--dk-fg)">{{ m.heading }}°</text>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* The feed and the map thumbnail are simulated SENSOR IMAGERY, not UI. They
 * stand in for a live video frame and a raster map tile, which is the same
 * rationale that exempts the map terrain fills from the token system. Every
 * other colour in this view resolves through `--dk-*` or a DS token. */
.feed {
  background:
    radial-gradient(7% 9% at 26% 30%, rgba(255, 255, 255, 0.92) 0%, rgba(200, 200, 200, 0.5) 55%, transparent 75%),
    radial-gradient(13% 30% at 27% 58%, rgba(238, 238, 238, 0.9) 0%, rgba(150, 150, 150, 0.4) 50%, transparent 72%),
    radial-gradient(46% 52% at 72% 62%, rgba(96, 96, 96, 0.45), transparent 72%),
    radial-gradient(40% 60% at 8% 70%, rgba(120, 120, 120, 0.35), transparent 70%),
    linear-gradient(115deg, #525252 0%, #383838 45%, #1c1c1c 100%);
}
.feed::before {
  /* doorway / structural edge */
  content: '';
  position: absolute;
  left: 30%;
  top: 8%;
  width: 14%;
  height: 78%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.14), transparent);
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}
.feed::after {
  /* sensor grain + scanlines */
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 3px),
    radial-gradient(rgba(255, 255, 255, 0.05) 0.5px, transparent 0.5px);
  background-size: 100% 3px, 4px 4px;
  opacity: 0.7;
}
.feed-night {
  filter: brightness(0.85) contrast(1.15) sepia(0.5) saturate(0.6) hue-rotate(-18deg);
}
.map-mini {
  background:
    radial-gradient(40% 40% at 60% 40%, #5f6a3e, transparent 70%),
    linear-gradient(160deg, #4a5532, #3a4528);
}

/* State change only, on the grammar's own duration and easing. */
.rec-mark { transition: width var(--dk-dur-slow) var(--dk-ease), height var(--dk-dur-slow) var(--dk-ease), border-radius var(--dk-dur-slow) var(--dk-ease); }
@media (prefers-reduced-motion: reduce) { .rec-mark { transition: none; } }
</style>
