<script setup lang="ts">
import { computed } from 'vue';
import { TelemetryValue, CoordinateValue, Progress, Button, GuardedAction } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { m, path, home, vehiclePos as vehicle } from './mission';

defineProps<{ mode: 'day' | 'night' }>();

const pathD = path.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

const headings = computed(() => {
  const out: { deg: number; off: number; major: boolean }[] = [];
  for (let d = -70; d <= 70; d += 10) {
    const deg = (((m.heading + d) % 360) + 360) % 360;
    out.push({ deg, off: d, major: deg % 30 === 0 });
  }
  return out;
});
const compassLabel = (deg: number) => ({ 0: 'N', 90: 'E', 180: 'S', 270: 'W' })[deg] ?? String(deg);
const rungs = [20, 10, -10, -20];
</script>

<template>
  <div class="absolute inset-0">
    <div class="map-terrain absolute inset-0" :class="mode === 'night' ? 'map-night' : ''" />
    <svg viewBox="0 0 1160 760" class="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
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

      <circle :cx="vehicle.x" :cy="vehicle.y" r="320" fill="none" stroke="var(--brand)" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.4" />
      <path :d="pathD" fill="none" stroke="var(--brand)" stroke-width="2.5" stroke-dasharray="2 7" stroke-linecap="round" opacity="0.95" />
      <g v-for="(p, i) in path" :key="i">
        <circle :cx="p[0]" :cy="p[1]" r="9" fill="color-mix(in oklab, var(--card) 82%, transparent)" stroke="var(--brand)" stroke-width="1.5" :opacity="i < m.wp ? 1 : 0.55" />
        <text :x="p[0]" :y="p[1] + 3.5" text-anchor="middle" font-size="10" font-family="ui-monospace, monospace" fill="var(--foreground)">{{ i + 1 }}</text>
      </g>
      <g :transform="`translate(${home[0]}, ${home[1]})`">
        <circle r="13" fill="color-mix(in oklab, var(--card) 85%, transparent)" stroke="var(--nominal)" stroke-width="1.5" />
        <path d="M-5 1 L0 -5 L5 1 M-3.5 0 V5 H3.5 V0" fill="none" stroke="var(--nominal)" stroke-width="1.3" />
      </g>
      <circle :cx="vehicle.x" :cy="vehicle.y" r="16" fill="var(--brand)" class="veh-pulse" />
      <g :transform="`translate(${vehicle.x}, ${vehicle.y}) rotate(${m.heading - 360})`">
        <path d="M0 0 L-24 -50 A54 54 0 0 1 24 -50 Z" fill="var(--brand)" opacity="0.16" />
        <circle r="15" fill="color-mix(in oklab, var(--card) 70%, transparent)" stroke="var(--brand)" stroke-width="2" />
      </g>
      <g :transform="`translate(${vehicle.x}, ${vehicle.y})`" style="color: var(--brand)">
        <Icon name="drone" :size="18" class="-translate-x-[9px] -translate-y-[9px]" />
      </g>
    </svg>

    <div class="pointer-events-none absolute inset-0" style="background: radial-gradient(120% 90% at 50% 45%, transparent 50%, rgba(0,0,0,0.5) 100%)" />

    <!-- top status bar -->
    <div class="amc-glass absolute inset-x-3 top-3 flex h-12 items-center gap-3 rounded-2xl px-3">
      <button class="amc-glass-btn h-8 w-8"><Icon name="chevron-left" size="sm" /></button>
      <div class="min-w-0">
        <p class="truncate text-[13px] font-semibold leading-tight">{{ m.mission }}</p>
        <p class="ix-label-sm truncate">{{ m.vehicle }} · WP {{ m.wp }}/{{ m.wpTotal }}</p>
      </div>
      <div class="relative mx-2 h-9 flex-1 self-center overflow-hidden">
        <div class="relative h-full w-full">
          <div v-for="h in headings" :key="h.off" class="absolute top-0 flex h-full flex-col items-center justify-center" :style="{ left: `calc(50% + ${h.off * 3}px)`, transform: 'translateX(-50%)' }">
            <span v-if="h.major" class="font-mono text-[10px] tabular-nums" :class="[0,90,180,270].includes(h.deg) ? 'text-foreground' : 'text-muted-foreground'">{{ compassLabel(h.deg) }}</span>
            <span class="mt-0.5 w-px bg-border" :class="h.major ? 'h-2' : 'h-1'" />
          </div>
        </div>
        <div class="absolute left-1/2 top-0 -translate-x-1/2">
          <span class="rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums" style="background: var(--brand); color: var(--brand-foreground)">{{ m.heading }}°</span>
          <span class="absolute -bottom-0.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent" style="border-bottom-color: var(--brand)" />
        </div>
      </div>
      <span class="ix-label-sm rounded-md px-2 py-1" style="background: color-mix(in oklab, var(--brand) 20%, transparent); color: var(--brand)">{{ m.flightMode }}</span>
      <span class="flex items-center gap-1.5">
        <span class="ix-label-sm">BATT</span>
        <Icon name="circle-check" size="xs" :class="m.battery < 35 ? 'text-[var(--warning)]' : 'text-[var(--nominal)]'" />
        <span class="font-mono text-[13px] tabular-nums" :class="m.battery < 35 ? 'text-[var(--warning)]' : ''">{{ m.battery }}%</span>
      </span>
      <span class="flex items-center gap-1.5">
        <span class="ix-label-sm">SATS</span>
        <span class="font-mono text-[12px] tabular-nums text-muted-foreground">RTK·{{ m.sats }}</span>
      </span>
      <button class="amc-glass-btn h-8 w-8"><Icon name="ellipsis" size="sm" /></button>
    </div>

    <!-- left instrument cluster -->
    <div class="amc-glass absolute left-3 top-[72px] w-[228px] rounded-2xl p-3">
      <div class="ix-head mb-2.5">
        <span class="ix-label">ATTITUDE</span>
        <span class="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground">{{ m.heading }}°</span>
      </div>
      <div class="mx-auto w-[176px]">
        <svg viewBox="-100 -100 200 200" class="h-[176px] w-[176px]">
          <defs><clipPath id="ahi-map"><circle r="84" /></clipPath></defs>
          <g clip-path="url(#ahi-map)">
            <g :transform="`rotate(${m.roll}) translate(0 ${m.pitch * 3})`">
              <rect x="-260" y="-260" width="520" height="260" fill="color-mix(in oklab, var(--foreground) 16%, var(--card))" />
              <rect x="-260" y="0" width="520" height="260" fill="color-mix(in oklab, var(--card) 88%, black)" />
              <line x1="-260" y1="0" x2="260" y2="0" stroke="var(--foreground)" stroke-width="1.5" />
              <g stroke="color-mix(in oklab, var(--foreground) 55%, transparent)" stroke-width="1.2">
                <line v-for="r in rungs" :key="r" :x1="-22" :y1="-r * 3" :x2="22" :y2="-r * 3" />
              </g>
            </g>
          </g>
          <g stroke="var(--brand)" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M-36 0 L-14 0 L0 9 L14 0 L36 0" /></g>
          <circle r="2.4" fill="var(--brand)" />
          <g stroke="color-mix(in oklab, var(--foreground) 55%, transparent)" stroke-width="1.2">
            <line x1="0" y1="-84" x2="0" y2="-78" /><line x1="-29" y1="-79" x2="-26" y2="-72" /><line x1="29" y1="-79" x2="26" y2="-72" />
          </g>
          <path :transform="`rotate(${m.roll})`" d="M0 -84 L-5 -74 L5 -74 Z" fill="var(--brand)" />
          <circle r="84" fill="none" stroke="color-mix(in oklab, var(--foreground) 18%, transparent)" stroke-width="1.5" />
        </svg>
      </div>
      <div class="ix-head mt-2">
        <span class="ix-label">TELEMETRY</span>
      </div>
      <div class="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
        <TelemetryValue :value="m.alt" unit="m" label="ALT" size="sm" />
        <TelemetryValue :value="m.speed" unit="m/s" label="SPD" size="sm" />
        <TelemetryValue :value="m.vspeed" unit="m/s" label="V/S" size="sm" :trend="m.vspeed > 0 ? 'up' : 'down'" />
        <TelemetryValue :value="m.dist / 1000" unit="km" label="DIST" size="sm" />
      </div>
    </div>

    <!-- video PiP -->
    <div class="amc-glass absolute right-3 top-[72px] w-[224px] overflow-hidden rounded-2xl p-1.5">
      <div class="relative aspect-video w-full overflow-hidden rounded-xl" style="background: linear-gradient(160deg, #2c3e2a, #1a2630 70%)">
        <div class="absolute inset-0" style="background: radial-gradient(60% 50% at 35% 30%, rgba(120,150,110,0.4), transparent)" />
        <span class="ix-label-sm absolute left-2 top-2 flex items-center gap-1 text-white/85"><span class="rec-dot h-1.5 w-1.5 rounded-full" style="background: var(--alarm)" /> REC</span>
        <span class="ix-label-sm absolute bottom-2 left-2 text-white/70">CAM · EO/IR</span>
      </div>
    </div>

    <!-- right control stack -->
    <div class="absolute right-3 top-[210px] flex flex-col gap-2">
      <button class="amc-glass-btn h-10 w-10"><Icon name="bars" size="sm" /></button>
      <button class="amc-glass-btn h-10 w-10" style="color: var(--brand)"><Icon name="drone" size="sm" /></button>
      <div class="amc-glass flex flex-col overflow-hidden rounded-xl">
        <button class="flex h-10 w-10 items-center justify-center hover:bg-secondary"><Icon name="plus" size="sm" /></button>
        <span class="mx-auto h-px w-6 bg-border" />
        <button class="flex h-10 w-10 items-center justify-center hover:bg-secondary"><Icon name="minus" size="sm" /></button>
      </div>
    </div>

    <!-- caution -->
    <div class="amc-glass ix-edge ix-edge-caution absolute left-1/2 top-[72px] flex -translate-x-1/2 items-center gap-2 rounded-xl py-2 pl-3 pr-3">
      <Icon name="triangle-exclamation" size="sm" style="color: var(--caution)" />
      <span class="ix-label-sm" style="color: var(--caution)">WIND</span>
      <span class="text-[12px]">9.4 m/s gusting 13 — crosswind on leg 4</span>
    </div>

    <!-- bottom action bar -->
    <div class="amc-glass absolute inset-x-3 bottom-3 flex h-16 items-center gap-4 rounded-2xl px-4">
      <div class="w-64">
        <div class="mb-1.5 flex items-center justify-between">
          <span class="ix-label-sm">WAYPOINT {{ m.wp }} / {{ m.wpTotal }}</span>
          <span class="flex items-center gap-1">
            <span class="ix-label-sm">ETA</span>
            <span class="font-mono text-[12px] tabular-nums">{{ m.eta }}</span>
          </span>
        </div>
        <Progress :value="m.progress" level="advisory" />
      </div>
      <div class="ml-auto flex items-center gap-2">
        <span class="mr-2 flex items-center gap-1.5">
          <Icon name="house" size="xs" class="text-muted-foreground" />
          <span class="ix-label-sm">POS</span>
          <CoordinateValue :lat="m.lat" :lon="m.lon" format="mgrs" :mgrs-accuracy="4" size="sm" show-format-tag class="text-muted-foreground" />
        </span>
        <Button variant="secondary" size="md" class="gap-1.5"><Icon name="circle-info" size="xs" /> Pause</Button>
        <GuardedAction mode="hold" variant="primary" size="md" confirm-label="Hold to RTL…" @confirm="() => {}">Return to Launch</GuardedAction>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.veh-pulse { transform-box: fill-box; transform-origin: center; animation: veh-pulse 2.4s ease-out infinite; }
@keyframes veh-pulse { 0% { transform: scale(1); opacity: 0.35; } 70% { transform: scale(3.6); opacity: 0; } 100% { transform: scale(3.6); opacity: 0; } }
.rec-dot { animation: rec-blink 1.4s steps(1) infinite; }
@keyframes rec-blink { 0%, 60% { opacity: 1; } 61%, 100% { opacity: 0.25; } }
@media (prefers-reduced-motion: reduce) { .veh-pulse, .rec-dot { animation: none; } }
</style>
