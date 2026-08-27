<script setup lang="ts">
import { computed, ref } from 'vue';
import { StatusBadge, Button, AlertBanner } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';

const theme = defineModel<'dark' | 'light'>('theme', { default: 'dark' });

type Level = 'alarm' | 'warning' | 'caution' | 'advisory';

interface Alert {
  id: string;
  level: Level;
  vehicle: string;
  message: string;
  source: string;
  site: { name: string; flag: string };
  time: string;
  acknowledged: boolean;
}

// Deterministic alert feed, derived from real vehicles in ./data.
const SEED_ALERTS: Alert[] = [
  { id: 'al-1', level: 'alarm', vehicle: 'Condor-04', message: 'Datalink lost — RTL engaged', source: 'datalink', site: { name: 'Austin', flag: '🇺🇸' }, time: '2 min ago', acknowledged: false },
  { id: 'al-2', level: 'warning', vehicle: 'Raven-03', message: 'Battery 18% below threshold', source: 'battery', site: { name: 'Zürich', flag: '🇨🇭' }, time: '4 min ago', acknowledged: false },
  { id: 'al-3', level: 'warning', vehicle: 'Vulture-10', message: 'Geofence breach risk', source: 'geofence', site: { name: 'Austin', flag: '🇺🇸' }, time: '7 min ago', acknowledged: false },
  { id: 'al-4', level: 'caution', vehicle: 'Merlin-08', message: 'GPS degraded to DGPS', source: 'gps', site: { name: 'Zürich', flag: '🇨🇭' }, time: '11 min ago', acknowledged: false },
  { id: 'al-5', level: 'caution', vehicle: 'Falcon-02', message: 'CPU load sustained above 80%', source: 'compute', site: { name: 'Montreal', flag: '🇨🇦' }, time: '18 min ago', acknowledged: true },
  { id: 'al-6', level: 'advisory', vehicle: 'Heron-06', message: 'Maintenance / charging in progress', source: 'service', site: { name: 'Munich', flag: '🇩🇪' }, time: '34 min ago', acknowledged: false },
  { id: 'al-7', level: 'advisory', vehicle: 'Kite-07', message: 'Firmware update available (v4.2.1)', source: 'firmware', site: { name: 'Singapore', flag: '🇸🇬' }, time: '52 min ago', acknowledged: true },
];

const alerts = ref<Alert[]>(SEED_ALERTS.map((a) => ({ ...a })));

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unacknowledged', label: 'Unacknowledged' },
  // Two rungs, so it takes a band name rather than a rung name — calling it
  // `alarm` would claim to be one rung and calling it `critical` would rename one.
  { key: 'urgent', label: 'Urgent' },
] as const;
const filter = ref<(typeof FILTERS)[number]['key']>('all');

const LEVELS: Level[] = ['alarm', 'warning', 'caution', 'advisory'];
const LEVEL_ORDER: Record<Level, number> = { alarm: 0, warning: 1, caution: 2, advisory: 3 };
const LEVEL_LABELS: Record<Level, string> = {
  alarm: 'Alarm', warning: 'Warning', caution: 'Caution', advisory: 'Advisory',
};

const counts = computed(() => {
  const c: Record<Level, number> = { alarm: 0, warning: 0, caution: 0, advisory: 0 };
  for (const a of alerts.value) c[a.level] += 1;
  return c;
});
const total = computed(() => alerts.value.length);
const unacked = computed(() => alerts.value.filter((a) => !a.acknowledged).length);

const sorted = computed(() =>
  [...alerts.value].sort((x, y) => LEVEL_ORDER[x.level] - LEVEL_ORDER[y.level]),
);

const visible = computed(() =>
  sorted.value.filter((a) => {
    if (filter.value === 'unacknowledged') return !a.acknowledged;
    if (filter.value === 'urgent') return a.level === 'alarm' || a.level === 'warning';
    return true;
  }),
);

// Highest-severity unacknowledged alert for the hero banner.
const hero = computed(() =>
  sorted.value.find((a) => !a.acknowledged) ?? null,
);

function toggle(id: string) {
  const a = alerts.value.find((x) => x.id === id);
  if (a) a.acknowledged = !a.acknowledged;
}

function acknowledgeAll() {
  for (const a of alerts.value) a.acknowledged = true;
}

function acknowledgeHero() {
  if (hero.value) toggle(hero.value.id);
}
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col">
    <!-- Topbar -->
    <header
      class="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur"
    >
      <Icon name="bell" size="sm" class="text-muted-foreground" />
      <span class="ix-label">SUITE</span>
      <span class="text-border">/</span>
      <h1 class="text-[14px] font-medium tracking-tight">Alerts</h1>

      <div class="mx-1 h-5 w-px bg-border" />

      <!-- section filter sub-tabs -->
      <nav class="flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-lg border border-border bg-card p-0.5">
        <button
          v-for="f in FILTERS"
          :key="f.key"
          type="button"
          class="shrink-0 rounded-md px-2.5 py-1 text-[12px] transition-colors"
          :class="filter === f.key ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
          @click="filter = f.key"
        >
          {{ f.label }}
        </button>
      </nav>

      <div class="ml-auto flex items-center gap-3">
        <span class="ix-label hidden lg:inline">
          {{ total }} ACTIVE · {{ unacked }} UNACKED
        </span>

        <!-- theme quick toggle -->
        <div class="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5">
          <button
            v-for="t in (['dark', 'light'] as const)"
            :key="t"
            type="button"
            class="rounded-md px-2 py-1 text-[12px] capitalize transition-colors"
            :class="theme === t ? 'bg-secondary text-foreground' : 'text-muted-foreground'"
            @click="theme = t"
          >
            {{ t }}
          </button>
        </div>
      </div>
    </header>

    <!-- Body -->
    <div class="flex-1 overflow-auto px-5 py-5">
      <div class="mx-auto max-w-5xl space-y-4">
        <!-- hero banner: highest-severity unacknowledged alert -->
        <AlertBanner
          v-if="hero"
          :level="hero.level"
          :title="`${hero.vehicle} — ${hero.message}`"
          :description="`${hero.source} · ${hero.site.name} · ${hero.time}`"
          action-label="Acknowledge"
          @action="acknowledgeHero"
        />

        <!-- severity-count summary -->
        <section class="ix-panel p-4">
          <div class="ix-head mb-3.5">
            <span class="ix-label">SEVERITY SUMMARY</span>
            <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ total }} ACTIVE</span>
          </div>

          <div class="flex flex-wrap items-stretch gap-3">
            <!-- active total readout -->
            <div class="flex min-w-[112px] flex-col justify-center">
              <span class="ix-label">ACTIVE</span>
              <span class="mt-1 font-mono text-[28px] font-medium tabular-nums leading-none">{{ total }}</span>
            </div>

            <div class="w-px self-stretch bg-border" />

            <!-- per-level counts -->
            <div class="grid flex-1 grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-4">
              <div
                v-for="l in LEVELS"
                :key="l"
                class="ix-edge flex flex-col gap-1 pl-2.5"
                :class="`ix-edge-${l}`"
              >
                <span class="ix-label">{{ LEVEL_LABELS[l] }}</span>
                <span class="font-mono text-[20px] font-medium tabular-nums leading-none text-foreground">{{ counts[l] }}</span>
              </div>
            </div>

            <div class="hidden w-px self-stretch bg-border sm:block" />

            <!-- acknowledge-all action -->
            <div class="flex flex-col justify-center gap-2">
              <span class="font-mono text-[11px] tabular-nums text-muted-foreground">{{ unacked }} UNACKED</span>
              <Button variant="secondary" size="sm" :disabled="unacked === 0" @click="acknowledgeAll">
                Acknowledge all
              </Button>
            </div>
          </div>
        </section>

        <!-- alert feed: every row carries an ix-edge of its level -->
        <section class="ix-panel flex flex-col overflow-hidden">
          <div class="ix-head px-4 pt-3.5">
            <span class="ix-label">ALERT FEED</span>
            <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ visible.length }} SHOWN</span>
          </div>

          <div
            v-for="a in visible"
            :key="a.id"
            class="ix-edge flex items-center gap-3 border-b border-border/60 px-4 py-3 transition-opacity last:border-b-0"
            :class="[`ix-edge-${a.level}`, a.acknowledged ? 'opacity-55' : '']"
          >
            <StatusBadge
              :level="a.level"
              size="sm"
              :variant="a.acknowledged ? 'outline' : 'solid'"
              dot
              :sr-label="LEVEL_LABELS[a.level]"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-[13px]">
                <span class="font-medium">{{ a.vehicle }}</span>
                <span class="text-muted-foreground"> — {{ a.message }}</span>
              </p>
              <p class="truncate font-mono text-[11px] tabular-nums text-muted-foreground">
                {{ a.source }} · {{ a.site.flag }} {{ a.site.name }} · {{ a.time }}
              </p>
            </div>
            <span
              v-if="a.acknowledged"
              class="ix-label hidden items-center gap-1 sm:flex"
            >
              <Icon name="check" size="xs" /> ACKED
            </span>
            <Button
              :variant="a.acknowledged ? 'ghost' : 'secondary'"
              size="sm"
              @click="toggle(a.id)"
            >
              {{ a.acknowledged ? 'Reopen' : 'Acknowledge' }}
            </Button>
          </div>

          <div
            v-if="visible.length === 0"
            class="flex flex-col items-center gap-2 px-5 py-12 text-center"
          >
            <Icon name="circle-check" size="lg" class="text-muted-foreground" />
            <p class="text-[13px] text-muted-foreground">No alerts match this filter.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
