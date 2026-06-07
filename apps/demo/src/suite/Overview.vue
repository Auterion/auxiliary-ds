<script setup lang="ts">
import { computed } from 'vue';
import { StatusBadge, TelemetryValue, Avatar, AvatarFallback } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Sparkline from './Sparkline.vue';
import { VEHICLES } from './data';

const theme = defineModel<'dark' | 'light'>('theme', { default: 'dark' });

const LOCATIONS = ['Munich', 'Montreal', 'Zürich', 'Austin', 'Dublin', 'Singapore'];

function seriesGen(seed: number, n: number, base: number, amp: number) {
  let v = base, a = seed;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    a = (a * 1103515245 + 12345) & 0x7fffffff;
    v = Math.max(1, v + ((a / 0x7fffffff) - 0.46) * amp);
    out.push(Math.round(v));
  }
  return out;
}

const stats = [
  { label: 'Flights · 30d', value: 695, unit: '', precision: 0, delta: '+75%', up: true, spark: seriesGen(3, 30, 12, 8) },
  { label: 'Flight hours', value: 1284, unit: 'h', precision: 0, delta: '+12%', up: true, spark: seriesGen(9, 30, 30, 10) },
  { label: 'Avg mission', value: 18.4, unit: 'min', precision: 1, delta: '−4%', up: false, spark: seriesGen(15, 30, 18, 6) },
  { label: 'Missions today', value: 14, unit: '', precision: 0, delta: '+3', up: true, spark: seriesGen(21, 30, 8, 7) },
];

const flightTrend = seriesGen(42, 30, 16, 9);

// Fleet status donut.
const LEVELS = ['nominal', 'advisory', 'caution', 'warning', 'alarm'] as const;
const LEVEL_LABELS: Record<(typeof LEVELS)[number], string> = {
  nominal: 'Operational', advisory: 'In flight', caution: 'Maintenance', warning: 'Attention', alarm: 'Critical',
};
const counts = computed(() => {
  const c = Object.fromEntries(LEVELS.map((l) => [l, 0])) as Record<string, number>;
  for (const v of VEHICLES) c[v.status.level] = (c[v.status.level] ?? 0) + 1;
  return c;
});
const total = VEHICLES.length;
const donut = computed(() => {
  const R = 52, C = 2 * Math.PI * R;
  let offset = 0;
  return LEVELS.filter((l) => (counts.value[l] ?? 0) > 0).map((l) => {
    const frac = counts.value[l]! / total;
    const seg = { level: l, dash: frac * C, gap: C - frac * C, offset: -offset * C, color: `var(--${l})` };
    offset += frac;
    return seg;
  });
});

const activity = [
  { v: 'Falcon-02', text: 'reached waypoint 8 of 12', time: '2 min ago', level: 'advisory' as const },
  { v: 'Condor-04', text: 'datalink lost — RTL engaged', time: '4 min ago', level: 'alarm' as const },
  { v: 'Raven-03', text: 'battery below 20% threshold', time: '6 min ago', level: 'warning' as const },
  { v: 'Osprey-05', text: 'completed Coastline Survey', time: '14 min ago', level: 'nominal' as const },
  { v: 'Merlin-08', text: 'GPS degraded to DGPS', time: '22 min ago', level: 'caution' as const },
];
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col">
    <!-- topbar -->
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <Icon name="house" size="sm" class="text-muted-foreground" />
      <span class="ix-label">SUITE</span>
      <span class="text-muted-foreground/40">/</span>
      <h1 class="text-[14px] font-medium tracking-tight">Overview</h1>

      <div class="mx-1 h-5 w-px bg-border" />

      <nav class="flex min-w-0 items-center gap-0.5 overflow-x-auto">
        <button
          v-for="(loc, i) in LOCATIONS"
          :key="loc"
          type="button"
          class="ix-edge shrink-0 rounded-lg pl-2.5 pr-2.5 py-1.5 text-[13px] transition-colors"
          :class="i === 0 ? 'ix-active bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'"
        >
          {{ loc }}
        </button>
        <button type="button" class="shrink-0 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"><Icon name="plus" size="xs" /></button>
      </nav>

      <div class="ml-auto flex items-center gap-3">
        <span class="ix-label hidden lg:inline">{{ total }} UNITS · {{ counts.advisory }} FLYING</span>

        <button
          type="button"
          class="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-foreground transition-colors hover:bg-secondary"
        >
          <span class="ix-label-sm">RANGE</span>
          Last 30 days
          <Icon name="chevron-down" size="xs" class="text-muted-foreground" />
        </button>

        <!-- theme quick toggle -->
        <div class="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5">
          <button
v-for="t in (['dark','light'] as const)" :key="t" type="button"
            class="rounded-md px-2 py-1 text-[12px] capitalize transition-colors"
            :class="theme === t ? 'bg-secondary text-foreground' : 'text-muted-foreground'"
            @click="theme = t">{{ t }}</button>
        </div>
      </div>
    </header>

    <!-- body -->
    <div class="flex-1 overflow-auto px-4 py-4">
      <div class="mx-auto max-w-6xl space-y-4">
        <!-- stat panels -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div v-for="s in stats" :key="s.label" class="ix-panel ix-lift flex flex-col gap-2.5 p-4">
            <div class="ix-head">
              <span class="ix-label">{{ s.label }}</span>
              <span class="ml-auto flex items-center gap-0.5 font-mono text-[11px] tabular-nums" :style="{ color: s.up ? 'var(--nominal)' : 'var(--warning)' }">
                <Icon :name="s.up ? 'arrow-up' : 'arrow-down'" size="xs" />{{ s.delta }}
              </span>
            </div>
            <TelemetryValue :value="s.value" :unit="s.unit" :precision="s.precision" size="lg" />
            <div class="ix-grid -mx-1 h-7 rounded-md" style="color: var(--foreground)">
              <Sparkline :data="s.spark" :height="28" stroke="color-mix(in oklab, var(--foreground) 80%, transparent)" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <!-- flight activity chart -->
          <section class="ix-panel flex flex-col p-5 lg:col-span-2">
            <div class="ix-head">
              <span class="ix-label">FLIGHT ACTIVITY</span>
              <span class="ix-label-sm hidden text-muted-foreground/70 sm:inline">SORTIES PER DAY · ALL SITES</span>
              <span class="ml-auto flex items-baseline gap-1.5">
                <TelemetryValue :value="695" unit="" :precision="0" size="md" />
                <span class="ix-label-sm">30D TOTAL</span>
              </span>
            </div>
            <div class="ix-grid mt-4 h-40 rounded-md" style="color: var(--foreground)">
              <Sparkline :data="flightTrend" :height="160" :width="760" stroke="color-mix(in oklab, var(--foreground) 80%, transparent)" />
            </div>
            <div class="mt-2 flex justify-between font-mono text-[10px] tabular-nums text-muted-foreground">
              <span>May 6</span><span>May 14</span><span>May 22</span><span>May 30</span><span>Jun 5</span>
            </div>
          </section>

          <!-- fleet status donut -->
          <section class="ix-panel flex flex-col p-5 lg:col-span-1">
            <div class="ix-head">
              <span class="ix-label">FLEET STATUS</span>
              <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ total }} UNITS</span>
            </div>
            <div class="mt-4 flex items-center gap-4">
              <svg viewBox="0 0 120 120" class="h-28 w-28 -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--secondary)" stroke-width="14" />
                <circle
v-for="seg in donut" :key="seg.level"
                  cx="60" cy="60" r="52" fill="none" :stroke="seg.color" stroke-width="14"
                  :stroke-dasharray="`${seg.dash} ${seg.gap}`" :stroke-dashoffset="seg.offset" stroke-linecap="butt" />
              </svg>
              <ul class="flex-1 space-y-1.5">
                <li v-for="l in LEVELS" v-show="counts[l]" :key="l" class="ix-edge flex items-center gap-2 pl-2 text-[12px]" :class="`ix-edge-${l}`">
                  <span class="flex-1 text-muted-foreground">{{ LEVEL_LABELS[l] }}</span>
                  <span class="font-mono tabular-nums text-foreground">{{ counts[l] }}</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <!-- recent activity -->
        <section class="ix-panel flex flex-col overflow-hidden">
          <div class="ix-head px-5 pt-3.5">
            <span class="ix-label">RECENT ACTIVITY</span>
            <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ activity.length }} EVENTS</span>
            <button type="button" class="ml-3 text-[12px] text-muted-foreground transition-colors hover:text-foreground">View all</button>
          </div>
          <div
            v-for="(a, i) in activity"
            :key="i"
            class="ix-edge flex items-center gap-3 border-b border-border/60 px-5 py-3 last:border-b-0"
            :class="`ix-edge-${a.level}`"
          >
            <Avatar size="sm"><AvatarFallback>{{ a.v.slice(0, 2) }}</AvatarFallback></Avatar>
            <p class="min-w-0 flex-1 truncate text-[13px]">
              <span class="font-medium">{{ a.v }}</span>
              <span class="text-muted-foreground"> {{ a.text }}</span>
            </p>
            <span class="font-mono text-[11px] tabular-nums text-muted-foreground">{{ a.time }}</span>
            <StatusBadge :level="a.level" size="sm" :label="a.level" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
