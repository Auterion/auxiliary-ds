<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  StatusBadge, TelemetryValue, Progress, Avatar, AvatarFallback,
} from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { VEHICLES } from './data';

const theme = defineModel<'dark' | 'light'>('theme', { default: 'dark' });

const TABS = ['Missions', 'Schedule', 'Log'] as const;
type Tab = (typeof TABS)[number];
const tab = ref<Tab>('Missions');

type MissionState = 'Active' | 'Queued' | 'Planned' | 'Completed' | 'Aborted' | 'Paused';
const STATE_LEVEL: Record<MissionState, 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal' | null> = {
  Active: 'advisory',
  Queued: null,
  Planned: null,
  Completed: 'nominal',
  Aborted: 'alarm',
  Paused: 'caution',
};

interface Mission {
  id: string;
  name: string;
  vehicleId: string;
  state: MissionState;
  progress: number;
  distance: number;
  eta: string;
}

// Static, deterministic. Each mission pinned to a real vehicle by id.
const MISSIONS: Mission[] = [
  { id: 'OP-2041', name: 'Coastline Survey', vehicleId: '5', state: 'Active', progress: 67, distance: 24.8, eta: '00:14' },
  { id: 'OP-2042', name: 'Grid Inspection North', vehicleId: '2', state: 'Active', progress: 41, distance: 12.3, eta: '00:22' },
  { id: 'OP-2043', name: 'Delivery Run 12', vehicleId: '7', state: 'Paused', progress: 58, distance: 9.6, eta: '--:--' },
  { id: 'OP-2044', name: 'Perimeter Patrol', vehicleId: '9', state: 'Queued', progress: 0, distance: 17.1, eta: '00:38' },
  { id: 'OP-2045', name: 'Bridge Survey', vehicleId: '1', state: 'Completed', progress: 100, distance: 6.4, eta: '--:--' },
  { id: 'OP-2046', name: 'Wind Farm Sweep', vehicleId: '4', state: 'Aborted', progress: 31, distance: 28.0, eta: '--:--' },
];

const byId = (id: string) => VEHICLES.find((v) => v.id === id)!;

const missions = computed(() =>
  MISSIONS.map((m) => ({ ...m, vehicle: byId(m.vehicleId), level: STATE_LEVEL[m.state] })),
);

const activeCount = computed(() => MISSIONS.filter((m) => m.state === 'Active').length);

// Mission table grid, shared by column header + rows.
const MISSION_COLS = 'minmax(160px,1.6fr) minmax(0,112px) 64px 56px 116px 32px';
// Flight-log grid, shared by column header + rows (md+).
const LOG_COLS = '72px minmax(160px,1fr) 88px 96px 80px 132px';

const selectedId = ref('OP-2041');
const selected = computed(() => missions.value.find((m) => m.id === selectedId.value)!);

// Upcoming schedule - static rows, vehicles + sites pulled from the fleet.
const SCHEDULE = [
  { time: '14:30', name: 'Reservoir Inspection', vehicleId: '8' },
  { time: '15:10', name: 'Delivery Run 13', vehicleId: '7' },
  { time: '16:00', name: 'Solar Array Audit', vehicleId: '1' },
  { time: '17:45', name: 'Night Perimeter Sweep', vehicleId: '9' },
].map((r) => ({ ...r, vehicle: byId(r.vehicleId) }));

// Recent flight log - completed sorties.
const LOG = [
  { id: 'FL-8841', vehicleId: '5', duration: '18:42', distance: 22.6, alt: 118, result: 'Completed', level: 'nominal' as const },
  { id: 'FL-8840', vehicleId: '1', duration: '11:05', distance: 8.9, alt: 74, result: 'Completed', level: 'nominal' as const },
  { id: 'FL-8839', vehicleId: '8', duration: '24:17', distance: 31.2, alt: 142, result: 'Degraded link', level: 'caution' as const },
  { id: 'FL-8838', vehicleId: '9', duration: '09:33', distance: 6.1, alt: 61, result: 'Completed', level: 'nominal' as const },
  { id: 'FL-8837', vehicleId: '2', duration: '15:58', distance: 19.4, alt: 96, result: 'Completed', level: 'nominal' as const },
].map((r) => ({ ...r, vehicle: byId(r.vehicleId) }));
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col">
    <!-- topbar -->
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <Icon name="arrow-up-right-from-square" size="sm" class="text-muted-foreground" />
      <span class="ix-label">SUITE</span>
      <span class="text-muted-foreground/40">/</span>
      <h1 class="text-[14px] font-medium tracking-tight">Operations</h1>

      <div class="mx-1 h-5 w-px bg-border" />

      <nav class="flex min-w-0 items-center gap-0.5 rounded-lg border border-border bg-card p-0.5">
        <button
          v-for="t in TABS"
          :key="t"
          type="button"
          class="ix-label shrink-0 rounded-md px-2.5 py-1 transition-colors"
          :class="tab === t ? 'bg-secondary text-foreground' : 'hover:text-foreground'"
          @click="tab = t"
        >
          {{ t }}
        </button>
      </nav>

      <div class="ml-auto flex items-center gap-3">
        <span class="ix-label hidden lg:inline">
          {{ activeCount }} ACTIVE · {{ missions.length }} TOTAL
        </span>
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
    <div class="flex-1 overflow-auto px-5 py-5">
      <div class="mx-auto max-w-6xl space-y-5">
        <!-- MISSIONS -->
        <template v-if="tab === 'Missions'">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <!-- mission table -->
            <section class="ix-panel flex min-w-0 flex-col overflow-hidden lg:col-span-2">
              <div class="ix-head px-4 pt-3.5">
                <span class="ix-label">MISSIONS</span>
                <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ missions.length }} ON BOOK</span>
              </div>

              <!-- column header -->
              <div
                class="grid items-center gap-3 border-b border-border px-4 py-2.5"
                :style="{ gridTemplateColumns: MISSION_COLS }"
              >
                <span class="ix-label">MISSION</span>
                <span class="ix-label hidden sm:inline">PROGRESS</span>
                <span class="ix-label hidden text-right md:inline">DIST</span>
                <span class="ix-label hidden text-right md:inline">ETA</span>
                <span class="ix-label">STATE</span>
                <span class="ix-label text-right">CREW</span>
              </div>

              <button
                v-for="m in missions"
                :key="m.id"
                type="button"
                class="ix-edge ix-lift grid w-full items-center gap-3 border-b border-border/60 px-4 py-3 text-left hover:bg-secondary/40"
                :class="[m.level ? `ix-edge-${m.level}` : '', selectedId === m.id ? 'ix-active bg-secondary/70' : '']"
                :style="{ gridTemplateColumns: MISSION_COLS }"
                @click="selectedId = m.id"
              >
                <div class="min-w-0">
                  <p class="truncate text-[13px] font-medium text-foreground">{{ m.name }}</p>
                  <p class="truncate font-mono text-[11px] tabular-nums text-muted-foreground">
                    {{ m.id }} · {{ m.vehicle.callsign }} · {{ m.vehicle.model }}
                  </p>
                </div>
                <div class="hidden sm:block">
                  <Progress v-if="m.state === 'Active' || m.state === 'Paused'" :value="m.progress" :level="m.level ?? undefined" class="h-1.5" />
                  <span v-else class="font-mono text-[12px] tabular-nums text-muted-foreground/60">—</span>
                </div>
                <span class="hidden text-right font-mono text-[13px] tabular-nums text-foreground md:inline">
                  {{ m.distance }}<span class="ml-0.5 text-[11px] text-muted-foreground">km</span>
                </span>
                <span class="hidden text-right font-mono text-[12px] tabular-nums text-muted-foreground md:inline">{{ m.eta }}</span>
                <StatusBadge
                  v-if="m.level"
                  :level="m.level"
                  size="sm"
                  dot
                  :sr-label="m.state"
                  class="justify-self-start"
                >{{ m.state }}</StatusBadge>
                <span v-else class="ix-label justify-self-start rounded-md border border-border px-1.5 py-0.5">{{ m.state }}</span>
                <Avatar size="sm" class="justify-self-end"><AvatarFallback>{{ m.vehicle.operator.initials }}</AvatarFallback></Avatar>
              </button>
            </section>

            <!-- selected mission detail + route map -->
            <aside class="ix-panel flex flex-col overflow-hidden lg:col-span-1">
              <div class="ix-head px-4 pt-3.5">
                <span class="ix-label">MISSION DETAIL</span>
                <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ selected.id }}</span>
              </div>

              <div class="flex flex-col gap-4 p-4">
                <!-- identity -->
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <h2 class="truncate text-[16px] font-semibold tracking-tight">{{ selected.name }}</h2>
                    <p class="truncate font-mono text-[11px] tabular-nums text-muted-foreground">
                      {{ selected.id }} · {{ selected.vehicle.callsign }}
                    </p>
                  </div>
                  <StatusBadge
                    v-if="selected.level"
                    :level="selected.level"
                    size="sm"
                    dot
                    :sr-label="selected.state"
                    class="shrink-0"
                  >{{ selected.state }}</StatusBadge>
                  <span v-else class="ix-label shrink-0 rounded-md border border-border px-1.5 py-0.5">{{ selected.state }}</span>
                </div>

                <!-- route plot -->
                <div class="ix-plot overflow-hidden rounded-md border border-border/60 bg-secondary/20">
                  <svg viewBox="0 0 280 140" class="block h-32 w-full">
                    <path
                      d="M28 110 L80 64 L150 88 L208 40 L252 58"
                      fill="none"
                      stroke="var(--foreground)"
                      stroke-width="1.5"
                      stroke-dasharray="4 3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      opacity="0.8"
                    />
                    <circle cx="28" cy="110" r="3.5" fill="var(--foreground)" />
                    <circle cx="80" cy="64" r="2.5" fill="var(--foreground)" opacity="0.7" />
                    <circle cx="150" cy="88" r="2.5" fill="var(--foreground)" opacity="0.7" />
                    <circle cx="208" cy="40" r="2.5" fill="var(--foreground)" opacity="0.7" />
                    <circle cx="252" cy="58" r="3.5" fill="none" stroke="var(--foreground)" stroke-width="1.5" />
                  </svg>
                </div>

                <!-- readouts -->
                <div class="grid grid-cols-2 gap-4">
                  <TelemetryValue :value="selected.distance" unit="km" label="Route" size="md" />
                  <div>
                    <span class="ix-label">ETA</span>
                    <p class="mt-0.5 font-mono text-[18px] tabular-nums">{{ selected.eta }}</p>
                  </div>
                </div>

                <!-- progress -->
                <div>
                  <div class="ix-head mb-2">
                    <span class="ix-label">PROGRESS</span>
                    <span class="ml-auto font-mono text-[12px] tabular-nums text-foreground">{{ selected.progress }}%</span>
                  </div>
                  <Progress :value="selected.progress" :level="selected.level ?? undefined" class="h-1.5" />
                </div>

                <!-- crew -->
                <div class="flex items-center gap-2 border-t border-border/60 pt-3">
                  <Avatar size="sm"><AvatarFallback>{{ selected.vehicle.operator.initials }}</AvatarFallback></Avatar>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[12px] font-medium">{{ selected.vehicle.operator.name }}</p>
                    <p class="truncate text-[11px] text-muted-foreground">{{ selected.vehicle.team }} · {{ selected.vehicle.site.flag }} {{ selected.vehicle.site.name }}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </template>

        <!-- SCHEDULE -->
        <template v-else-if="tab === 'Schedule'">
          <section class="ix-panel flex flex-col overflow-hidden">
            <div class="ix-head px-4 pt-3.5">
              <span class="ix-label">UPCOMING SCHEDULE</span>
              <span class="ml-auto ix-label">TODAY</span>
            </div>
            <div
              v-for="(r, i) in SCHEDULE"
              :key="i"
              class="flex items-center gap-3 border-b border-border/60 px-4 py-3.5"
            >
              <span class="w-14 shrink-0 font-mono text-[13px] tabular-nums text-foreground">{{ r.time }}</span>
              <div class="mx-1 h-7 w-px bg-border/60" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-[13px] font-medium">{{ r.name }}</p>
                <p class="truncate font-mono text-[11px] tabular-nums text-muted-foreground">{{ r.vehicle.callsign }} · {{ r.vehicle.model }}</p>
              </div>
              <span class="hidden items-center gap-1.5 text-[12px] text-muted-foreground sm:flex">
                <span class="text-[13px] leading-none">{{ r.vehicle.site.flag }}</span>{{ r.vehicle.site.name }}
              </span>
              <span class="ix-label shrink-0 rounded-md border border-border px-1.5 py-0.5">PLANNED</span>
            </div>
          </section>
        </template>

        <!-- LOG -->
        <template v-else>
          <section class="ix-panel flex flex-col overflow-hidden">
            <div class="ix-head px-4 pt-3.5">
              <span class="ix-label">RECENT FLIGHT LOG</span>
              <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ LOG.length }} FLIGHTS</span>
            </div>
            <div
              class="hidden items-center gap-3 border-b border-border px-4 py-2.5 md:grid"
              :style="{ gridTemplateColumns: LOG_COLS }"
            >
              <span class="ix-label">FLIGHT</span>
              <span class="ix-label">VEHICLE</span>
              <span class="ix-label text-right">DURATION</span>
              <span class="ix-label text-right">DISTANCE</span>
              <span class="ix-label text-right">MAX ALT</span>
              <span class="ix-label text-right">RESULT</span>
            </div>
            <div
              v-for="f in LOG"
              :key="f.id"
              class="ix-edge flex items-center gap-3 border-b border-border/60 px-4 py-3 md:grid"
              :class="`ix-edge-${f.level}`"
              :style="{ gridTemplateColumns: LOG_COLS }"
            >
              <span class="hidden font-mono text-[12px] tabular-nums text-muted-foreground md:inline">{{ f.id }}</span>
              <div class="min-w-0 flex-1 md:flex-none">
                <p class="truncate text-[13px] font-medium">{{ f.vehicle.callsign }}</p>
                <p class="truncate font-mono text-[11px] tabular-nums text-muted-foreground">{{ f.vehicle.model }} · {{ f.vehicle.site.flag }} {{ f.vehicle.site.name }}</p>
              </div>
              <span class="shrink-0 text-right font-mono text-[13px] tabular-nums">{{ f.duration }}</span>
              <span class="hidden text-right font-mono text-[13px] tabular-nums md:inline">{{ f.distance }}<span class="ml-0.5 text-[11px] text-muted-foreground">km</span></span>
              <span class="hidden text-right font-mono text-[13px] tabular-nums md:inline">{{ f.alt }}<span class="ml-0.5 text-[11px] text-muted-foreground">m</span></span>
              <div class="shrink-0 justify-self-end text-right">
                <StatusBadge :level="f.level" size="sm" dot :sr-label="f.result">{{ f.result }}</StatusBadge>
              </div>
            </div>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>
