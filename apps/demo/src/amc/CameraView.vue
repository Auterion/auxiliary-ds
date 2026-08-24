<script setup lang="ts">
import { ref } from 'vue';
import { TelemetryValue, GuardedAction } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { m } from './mission';

defineProps<{ mode: 'day' | 'night' }>();

const recording = ref(true);
const tracking = ref(false);

const batteryDash = `${(m.battery / 100) * 339.3} 339.3`; // r=54 → C≈339.3

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

    <!-- OSD: telemetry burn-in + reticle -->
    <div class="pointer-events-none absolute inset-x-0 top-16 flex justify-center">
      <p class="ix-label flex items-center gap-2 tabular-nums !text-[13px] !text-white/85" style="text-shadow: 0 1px 3px rgba(0,0,0,0.8)">
        <span>FPS {{ m.fps }}</span><span class="opacity-40">/</span>
        <span>Z {{ m.zoom.toFixed(1) }}</span><span class="opacity-40">/</span>
        <span>{{ tracking ? 'TRACK ACTIVE' : 'TRACK INACTIVE' }}</span>
      </p>
    </div>
    <div class="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2">
      <svg viewBox="0 0 112 112" class="h-full w-full" :style="{ color: tracking ? 'var(--brand)' : 'rgba(255,255,255,0.6)' }">
        <g fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M8 24 V8 H24 M88 8 H104 V24 M104 88 V104 H88 M24 104 H8 V88" />
          <line x1="56" y1="40" x2="56" y2="50" /><line x1="56" y1="62" x2="56" y2="72" />
          <line x1="40" y1="56" x2="50" y2="56" /><line x1="62" y1="56" x2="72" y2="56" />
        </g>
      </svg>
    </div>

    <!-- ─── Top status bar ─── -->
    <div class="amc-glass absolute inset-x-3 top-3 flex h-12 items-center gap-2 rounded-2xl px-2.5">
      <button class="amc-glass-btn h-8 w-8"><Icon name="chevron-left" size="sm" /></button>
      <div class="flex items-center gap-2 rounded-lg bg-secondary/70 px-2.5 py-1">
        <Icon name="drone" size="xs" class="text-muted-foreground" />
        <div class="leading-tight">
          <p class="text-[12px] font-semibold">Vehicle 1</p>
          <span class="ix-label-sm">{{ m.vehicle }}</span>
        </div>
        <span class="ml-1 h-1.5 w-1.5 rounded-full" style="background: var(--nominal)" />
      </div>
      <button class="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 hover:bg-secondary">
        <span class="ix-label-sm">{{ m.flightMode }}</span> <Icon name="chevron-down" size="xs" class="text-muted-foreground" />
      </button>

      <!-- center arm state -->
      <button class="mx-auto flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-1.5 text-[13px] font-semibold hover:bg-secondary">
        {{ m.armed ? 'Armed' : 'Disarmed' }} <Icon name="chevron-down" size="xs" class="text-muted-foreground" />
      </button>

      <!-- right cluster -->
      <div class="flex items-center gap-1.5">
        <Icon name="bars" size="sm" style="color: var(--brand)" />
        <div class="flex flex-col gap-0.5 leading-none">
          <span class="ix-label-sm tabular-nums">RSSI {{ m.rssi }}</span>
          <span class="ix-label-sm tabular-nums">SNR {{ m.snr }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-0.5 leading-none">
        <span class="ix-label-sm tabular-nums"><span class="text-foreground">{{ m.voltage }}</span> V</span>
        <span class="ix-label-sm tabular-nums">{{ m.current }} A</span>
      </div>
      <div class="flex flex-col gap-0.5 rounded-md border border-border px-2 py-1 leading-none">
        <span class="ix-label-sm tabular-nums">HACC {{ m.hacc }}</span>
        <span class="ix-label-sm tabular-nums">VACC {{ m.vacc }}</span>
        <span class="ix-label-sm tabular-nums">NSAT {{ m.sats }}</span>
      </div>
      <div class="relative h-9 w-9">
        <svg viewBox="0 0 120 120" class="h-9 w-9 -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--secondary)" stroke-width="12" />
          <circle cx="60" cy="60" r="54" fill="none" :stroke="m.battery < 35 ? 'var(--warning)' : 'var(--nominal)'" stroke-width="12" :stroke-dasharray="batteryDash" stroke-linecap="round" />
        </svg>
        <span class="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold tabular-nums" :style="m.battery < 35 ? 'color: var(--warning)' : ''">{{ m.battery }}</span>
      </div>
    </div>

    <!-- ─── Left action rail ─── -->
    <div class="absolute left-3 top-[72px] flex flex-col gap-2.5">
      <div v-for="a in actions" :key="a.label" class="flex items-center gap-2.5">
        <button class="amc-glass flex h-12 w-12 items-center justify-center rounded-full"><Icon :name="a.icon" size="md" /></button>
        <span class="amc-glass ix-label rounded-md px-2 py-1.5">{{ a.label }}</span>
      </div>
    </div>

    <!-- ─── Right gimbal/payload controls ─── -->
    <div class="absolute right-3 top-[72px] flex flex-col items-center gap-2">
      <span class="amc-glass ix-edge ix-edge-alarm ix-label rounded-md py-1 pl-2 pr-2" style="color: var(--alarm)">STRIKE</span>
      <GuardedAction mode="hold" variant="danger" size="md" confirm-label="Hold…" class="!h-11 !w-11 !rounded-full !p-0" @confirm="() => {}">
        <Icon name="triangle-exclamation" size="sm" />
      </GuardedAction>
      <button class="amc-glass-btn amc-glass h-9 w-9 rounded-full"><Icon name="chevron-up" size="sm" /></button>
      <button
        class="amc-glass flex h-11 w-11 items-center justify-center rounded-full"
        :style="tracking ? 'background: var(--brand); color: var(--brand-foreground)' : ''"
        @click="tracking = !tracking"
      >
        <Icon name="plus" size="md" />
      </button>
      <span class="amc-glass ix-label rounded-md px-2 py-1">TRACK</span>

      <div class="mt-2 flex flex-col items-center gap-2">
        <span class="amc-glass ix-label rounded-md px-2 py-1.5 tabular-nums">FOV {{ m.fov }}°</span>
        <div class="amc-glass flex items-center overflow-hidden rounded-full">
          <button class="flex h-9 w-9 items-center justify-center hover:bg-secondary"><Icon name="minus" size="sm" /></button>
          <button class="flex h-9 w-9 items-center justify-center hover:bg-secondary"><Icon name="plus" size="sm" /></button>
        </div>
        <button class="amc-glass ix-label flex items-center gap-1.5 rounded-md px-2.5 py-2 hover:bg-secondary"><Icon name="gear" size="xs" /> VIDEO</button>
        <button class="amc-glass flex h-12 w-12 items-center justify-center rounded-full" @click="recording = !recording">
          <span class="transition-all" :class="recording ? 'h-4 w-4 rounded-[3px]' : 'h-7 w-7 rounded-full'" style="background: var(--alarm)" />
        </button>
      </div>
    </div>

    <!-- ─── Bottom-left: map PiP + quick actions ─── -->
    <div class="absolute bottom-3 left-3 flex items-end gap-2.5">
      <div class="flex flex-col gap-2">
        <button class="amc-glass flex h-11 w-11 items-center justify-center rounded-full" style="color: var(--brand)"><Icon name="arrow-up-right-from-square" size="sm" /></button>
        <button class="amc-glass flex h-11 w-11 items-center justify-center rounded-full"><Icon name="house" size="sm" /></button>
        <button class="amc-glass flex h-11 w-11 items-center justify-center rounded-full"><Icon name="gear" size="sm" /></button>
      </div>
      <div class="amc-glass relative h-[140px] w-[200px] overflow-hidden rounded-xl p-1">
        <div class="map-mini h-full w-full rounded-lg" />
        <svg viewBox="0 0 230 150" class="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)]" aria-hidden="true">
          <path d="M30 120 C 80 90, 90 60, 150 50 S 210 30, 220 20" fill="none" stroke="var(--brand)" stroke-width="1.5" stroke-dasharray="2 5" />
          <circle cx="120" cy="66" r="5" fill="var(--brand)" />
        </svg>
        <button class="amc-glass-btn absolute right-2 top-2 h-6 w-6 rounded-md"><Icon name="arrow-up-right-from-square" size="xs" /></button>
      </div>
    </div>

    <!-- ─── Bottom-right: telemetry + compass ─── -->
    <div class="absolute bottom-3 right-3 flex items-end gap-2.5">
      <div class="amc-glass relative grid grid-cols-2 items-center gap-x-4 gap-y-1.5 rounded-2xl px-4 py-3">
        <div class="ix-head col-span-2 mb-0.5">
          <span class="ix-label">ELAPSED</span>
          <span class="ml-auto font-mono text-[11px] tabular-nums text-foreground">{{ m.timer }}</span>
        </div>
        <TelemetryValue :value="m.gs" unit="m/s" label="GS" size="sm" />
        <TelemetryValue :value="m.vspeed" unit="m/s" label="V/S" size="sm" :trend="m.vspeed > 0 ? 'up' : 'down'" />
        <TelemetryValue :value="m.dist / 1000" unit="km" label="DST" size="sm" />
        <TelemetryValue :value="m.msl" unit="m" label="MSL" size="sm" />
      </div>

      <!-- compass rose -->
      <div class="amc-glass flex h-[108px] w-[108px] items-center justify-center rounded-full">
        <svg viewBox="-60 -60 120 120" class="h-[96px] w-[96px]">
          <circle r="54" fill="none" stroke="color-mix(in oklab, var(--foreground) 14%, transparent)" stroke-width="1" />
          <g stroke="color-mix(in oklab, var(--foreground) 40%, transparent)" stroke-width="1">
            <line v-for="t in 12" :key="t" :transform="`rotate(${t * 30})`" x1="0" y1="-54" x2="0" y2="-48" />
          </g>
          <g font-family="ui-monospace, monospace" font-size="11" font-weight="600" text-anchor="middle" fill="var(--foreground)">
            <text x="0" y="-40">N</text><text x="44" y="4">E</text><text x="0" y="48">S</text><text x="-44" y="4">W</text>
          </g>
          <!-- track wedge -->
          <path :transform="`rotate(${m.heading})`" d="M0 0 L-9 -46 A46 46 0 0 1 9 -46 Z" fill="var(--nominal)" opacity="0.35" />
          <!-- aircraft -->
          <path :transform="`rotate(${m.heading})`" d="M0 -16 L9 10 L0 4 L-9 10 Z" fill="var(--brand)" />
          <circle r="2" fill="var(--brand)" />
          <text x="0" y="34" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" font-weight="700" fill="var(--brand)">{{ m.heading }}°</text>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
