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
  { label: 'FLIGHTS · 30D', value: 695, unit: '', precision: 0, delta: '+75%', up: true, spark: seriesGen(3, 30, 12, 8) },
  { label: 'FLIGHT HOURS', value: 1284, unit: 'h', precision: 0, delta: '+12%', up: true, spark: seriesGen(9, 30, 30, 10) },
  { label: 'AVG MISSION', value: 18.4, unit: 'min', precision: 1, delta: '−4%', up: false, spark: seriesGen(15, 30, 18, 6) },
  { label: 'MISSIONS TODAY', value: 14, unit: '', precision: 0, delta: '+3', up: true, spark: seriesGen(21, 30, 8, 7) },
];

const flightTrend = seriesGen(42, 30, 16, 9);

// Fleet status donut.
const LEVELS = ['nominal', 'advisory', 'caution', 'warning', 'alarm'] as const;
const LEVEL_LABELS: Record<(typeof LEVELS)[number], string> = {
  nominal: 'Operational', advisory: 'In flight', caution: 'Maintenance', warning: 'Attention', alarm: 'Grounded',
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
    <!-- Topbar -->
    <header class="ix-hair-b flex h-14 shrink-0 items-center gap-3 px-4">
      <Icon name="house" size="sm" class="ix-ink-3" />
      <span class="dk-label">SUITE / OVERVIEW</span>

      <nav class="ml-2 flex min-w-0 items-center gap-2 overflow-x-auto">
        <div class="dk-segment">
          <button
            v-for="(loc, i) in LOCATIONS"
            :key="loc"
            type="button"
            class="dk-segment-btn"
            :data-active="i === 0"
            :aria-pressed="i === 0"
          >
            {{ loc }}
          </button>
        </div>
        <button type="button" class="dk-cta dk-cta-sm" aria-label="Add site">
          <Icon name="plus" size="xs" />
        </button>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <button type="button" class="dk-cta">
          <span class="dk-label">RANGE</span>
          Last 30 days
          <Icon name="chevron-down" size="xs" class="ix-ink-3" />
        </button>

        <!-- theme quick toggle -->
        <div class="dk-segment">
          <button
            v-for="t in (['dark', 'light'] as const)"
            :key="t"
            type="button"
            class="dk-segment-btn"
            :data-active="theme === t"
            :aria-pressed="theme === t"
            @click="theme = t"
          >
            {{ t }}
          </button>
        </div>
      </div>
    </header>

    <!-- Body -->
    <div class="flex-1 overflow-auto px-6 py-5">
      <div class="mx-auto max-w-6xl space-y-6">
        <!-- Case header + the ledger that tops it. The four headline figures
             ARE the ledger — four fixed slots, one rhythm, held across blocks. -->
        <div>
          <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div class="min-w-0">
              <h1 class="dk-h1">Overview</h1>
              <p class="dk-body dk-ghost">Fleet posture across every site, last thirty days.</p>
            </div>
            <span class="dk-bracket">
              {{ total }} UNITS · {{ counts.advisory }} FLYING · {{ LOCATIONS.length }} SITES
            </span>
          </div>

          <div class="dk-ledger mt-4" style="--dk-ledger-cols: 4">
            <div v-for="s in stats" :key="s.label" class="dk-ledger-cell">
              <span class="dk-label">{{ s.label }}</span>
              <TelemetryValue :value="s.value" :unit="s.unit" :precision="s.precision" size="lg" />
              <span class="dk-micro flex items-center gap-1">
                <Icon :name="s.up ? 'arrow-up' : 'arrow-down'" size="xs" />{{ s.delta }} VS PRIOR
              </span>
              <div class="ix-grid mt-1 w-full">
                <Sparkline :data="s.spark" :height="24" stroke="var(--dk-fg-3)" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <!-- Flight activity — carries this spread's ONE numeral card. -->
          <section class="dk-card flex flex-col p-5 lg:col-span-2">
            <div class="dk-section">
              <span class="dk-label">FLIGHT ACTIVITY</span>
              <span class="dk-bracket">695 SORTIES · 30 DAYS · ALL SITES</span>
            </div>

            <div class="mt-4 flex items-stretch gap-4">
              <div class="dk-numeral w-44 shrink-0 flex-col justify-end gap-1">
                <span class="dk-label">30D TOTAL</span>
                <span class="dk-numeral-folio" aria-hidden="true">695</span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="ix-grid h-40">
                  <Sparkline :data="flightTrend" :height="160" :width="760" stroke="var(--dk-fg-2)" />
                </div>
                <div class="mt-2 flex justify-between">
                  <span class="dk-micro">MAY 6</span>
                  <span class="dk-micro">MAY 14</span>
                  <span class="dk-micro">MAY 22</span>
                  <span class="dk-micro">MAY 30</span>
                  <span class="dk-micro">JUN 5</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Fleet status -->
          <section class="dk-card flex flex-col p-5 lg:col-span-1">
            <div class="dk-section">
              <span class="dk-label">FLEET STATUS</span>
              <span class="dk-bracket">{{ total }} UNITS</span>
            </div>
            <div class="mt-4 flex items-center gap-4">
              <svg viewBox="0 0 120 120" class="h-28 w-28 -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--dk-line)" stroke-width="14" />
                <circle
                  v-for="seg in donut"
                  :key="seg.level"
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="14"
                  :stroke-dasharray="`${seg.dash} ${seg.gap}`"
                  :stroke-dashoffset="seg.offset"
                  stroke-linecap="butt"
                />
              </svg>
              <ul class="min-w-0 flex-1 space-y-2">
                <li
                  v-for="l in LEVELS"
                  v-show="counts[l]"
                  :key="l"
                  class="ix-edge flex items-baseline gap-2 pl-2.5"
                  :class="`ix-edge-${l}`"
                >
                  <span class="dk-label flex-1 truncate">{{ LEVEL_LABELS[l] }}</span>
                  <span class="dk-value dk-num">{{ counts[l] }}</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <!-- Recent activity — fixed slots, so copy starts and times end on one x. -->
        <section class="dk-card flex flex-col overflow-hidden">
          <div class="dk-section px-5 pt-3.5">
            <span class="dk-label">RECENT ACTIVITY</span>
            <span class="flex items-baseline gap-3">
              <span class="dk-bracket">{{ activity.length }} EVENTS</span>
              <button type="button" class="dk-link text-[12px]">View all</button>
            </span>
          </div>

          <div class="p-2" style="--dk-row-cols: auto minmax(0, 1fr) auto auto">
            <div
              v-for="(a, i) in activity"
              :key="i"
              class="dk-row ix-edge"
              :class="`ix-edge-${a.level}`"
            >
              <Avatar size="sm"><AvatarFallback>{{ a.v.slice(0, 2) }}</AvatarFallback></Avatar>
              <p class="dk-body min-w-0 truncate">
                <span class="dk-value">{{ a.v }}</span>
                {{ a.text }}
              </p>
              <span class="dk-label dk-num">{{ a.time }}</span>
              <StatusBadge :level="a.level" size="sm" :sr-label="a.level" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
