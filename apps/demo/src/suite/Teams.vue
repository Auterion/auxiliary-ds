<script setup lang="ts">
import { computed } from 'vue';
import {
  Button, Badge, StatusBadge, Avatar, AvatarFallback,
} from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import { VEHICLES } from './data';

const theme = defineModel<'dark' | 'light'>('theme', { default: 'dark' });

type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

interface Member {
  name: string;
  initials: string;
  team: string;
  vehicles: number;
  flying: boolean;
}

// Dedupe operators across the fleet, keyed by name. Tally their assigned vehicles
// and whether any assignment is currently in flight.
const members = computed<Member[]>(() => {
  const byName = new Map<string, Member>();
  for (const v of VEHICLES) {
    const existing = byName.get(v.operator.name);
    const flying = v.status.label === 'In flight';
    if (existing) {
      existing.vehicles += 1;
      existing.flying = existing.flying || flying;
    } else {
      byName.set(v.operator.name, {
        name: v.operator.name,
        initials: v.operator.initials,
        team: v.team,
        vehicles: 1,
        flying,
      });
    }
  }
  return [...byName.values()].sort((a, b) => b.vehicles - a.vehicles);
});

// Roles assigned deterministically: most-assigned operator is Owner, then a
// fixed ladder. Stable because `members` is deterministically ordered.
const ROLE_LADDER = ['Owner', 'Admin', 'Pilot', 'Observer'] as const;
function roleFor(index: number): string {
  return ROLE_LADDER[Math.min(index, ROLE_LADDER.length - 1)] ?? 'Observer';
}

// Deterministic flight hours from initials — stable, no randomness.
function hoursFor(m: Member): number {
  let h = 0;
  for (const ch of m.name) h = (h * 31 + ch.charCodeAt(0)) & 0x7fff;
  return 120 + (h % 880) + m.vehicles * 40;
}

const roster = computed(() =>
  members.value.map((m, i) => {
    const role = roleFor(i);
    const level: Level = m.flying ? 'advisory' : 'nominal';
    const state = m.flying ? 'Flying' : 'Active';
    return { ...m, role, level, state, hours: hoursFor(m) };
  }),
);

// Team purposes — static copy keyed by the team names present in the fleet.
const TEAM_INFO: Record<string, { purpose: string; icon: IconName }> = {
  Inspection: { purpose: 'Asset inspection and structural surveys', icon: 'eye' },
  Survey: { purpose: 'Mapping, photogrammetry and corridor survey', icon: 'magnifying-glass' },
  Delivery: { purpose: 'Payload transport and last-mile logistics', icon: 'arrow-up-right-from-square' },
  Maintenance: { purpose: 'Servicing, charging and airframe upkeep', icon: 'gear' },
};
const TEAM_ORDER = ['Inspection', 'Survey', 'Delivery', 'Maintenance'];

interface TeamCard {
  name: string;
  purpose: string;
  icon: IconName;
  members: Member[];
  vehicles: number;
  onMission: boolean;
}

const teams = computed<TeamCard[]>(() => {
  const out: TeamCard[] = [];
  for (const name of TEAM_ORDER) {
    const teamVehicles = VEHICLES.filter((v) => v.team === name);
    if (teamVehicles.length === 0) continue;
    const seen = new Map<string, Member>();
    for (const m of members.value) {
      if (m.team === name) seen.set(m.name, m);
    }
    const info = TEAM_INFO[name] ?? { purpose: 'Field operations', icon: 'users' };
    out.push({
      name,
      purpose: info.purpose,
      icon: info.icon,
      members: [...seen.values()],
      vehicles: teamVehicles.length,
      onMission: teamVehicles.some((v) => v.status.label === 'In flight'),
    });
  }
  return out;
});
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col">
    <!-- topbar -->
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <Icon name="users" size="sm" class="text-muted-foreground" />
      <span class="ix-label">SUITE</span>
      <span class="text-border">/</span>
      <h1 class="text-[14px] font-medium tracking-tight">Teams</h1>

      <div class="mx-1 h-5 w-px bg-border" />

      <span class="font-mono text-[12px] tabular-nums text-muted-foreground">
        {{ teams.length }}<span class="text-muted-foreground"> CREWS</span> · {{ roster.length }}<span class="text-muted-foreground"> OPS</span>
      </span>

      <div class="ml-auto flex items-center gap-2">
        <span class="ix-label hidden lg:inline">
          {{ roster.filter((m) => m.flying).length }} FLYING · {{ teams.filter((t) => t.onMission).length }} ON MISSION
        </span>

        <Button size="sm" class="gap-1.5"><Icon name="plus" size="xs" /> Invite</Button>

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
        <!-- team cards -->
        <section>
          <div class="ix-head mb-3">
            <span class="ix-label">CREWS</span>
            <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ teams.length }} ACTIVE</span>
          </div>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              v-for="team in teams"
              :key="team.name"
              type="button"
              class="ix-panel ix-lift ix-edge flex h-full flex-col gap-3 p-4 text-left"
              :class="team.onMission ? 'ix-edge-advisory' : 'ix-edge-nominal'"
            >
              <div class="flex items-start justify-between">
                <span class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary">
                  <Icon :name="team.icon" size="sm" class="text-muted-foreground" />
                </span>
                <StatusBadge v-if="team.onMission" level="advisory" size="sm" variant="outline" :icon="false" dot>
                  On mission
                </StatusBadge>
                <span v-else class="ix-label rounded-md border border-border px-2 py-1">
                  STANDBY
                </span>
              </div>
              <div>
                <p class="text-[14px] font-medium tracking-tight">{{ team.name }}</p>
                <p class="text-[12px] leading-snug text-muted-foreground">{{ team.purpose }}</p>
              </div>
              <div class="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                <div class="flex -space-x-1.5">
                  <Avatar v-for="m in team.members" :key="m.name" size="sm" class="ring-2 ring-card">
                    <AvatarFallback>{{ m.initials }}</AvatarFallback>
                  </Avatar>
                </div>
                <span class="flex items-center gap-1.5 font-mono text-[13px] tabular-nums text-foreground">
                  <Icon name="drone" size="xs" class="text-muted-foreground" />{{ team.vehicles }}<span class="text-[11px] text-muted-foreground">UNITS</span>
                </span>
              </div>
            </button>
          </div>
        </section>

        <!-- members table -->
        <section class="ix-panel flex flex-col overflow-hidden">
          <div class="ix-head px-4 pt-3.5">
            <span class="ix-label">MEMBERS</span>
            <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ roster.length }} OPERATORS</span>
          </div>

          <!-- column header -->
          <div class="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 border-b border-border bg-card/95 px-4 py-2.5">
            <span class="ix-label">OPERATOR</span>
            <span class="ix-label w-20 text-left">ROLE</span>
            <span class="ix-label w-24 text-left">STATE</span>
            <span class="ix-label w-16 text-right">VEHICLES</span>
            <span class="ix-label w-20 text-right">HOURS</span>
          </div>

          <div
v-for="mem in roster" :key="mem.name"
            class="ix-edge grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 border-b border-border/60 px-4 py-2.5"
            :class="mem.flying ? 'ix-edge-advisory' : ''">
            <div class="flex min-w-0 items-center gap-3">
              <Avatar size="sm"><AvatarFallback>{{ mem.initials }}</AvatarFallback></Avatar>
              <div class="min-w-0">
                <p class="truncate text-[13px] font-medium">{{ mem.name }}</p>
                <p class="truncate text-[12px] text-muted-foreground">{{ mem.team }} crew</p>
              </div>
            </div>
            <div class="w-20">
              <Badge variant="secondary" size="sm">{{ mem.role }}</Badge>
            </div>
            <div class="w-24">
              <StatusBadge :level="mem.level" size="sm" dot>{{ mem.state }}</StatusBadge>
            </div>
            <span class="w-16 text-right font-mono text-[13px] tabular-nums text-foreground">{{ mem.vehicles }}</span>
            <span class="w-20 text-right font-mono text-[13px] tabular-nums text-foreground">
              {{ mem.hours }}<span class="text-[11px] text-muted-foreground"> h</span>
            </span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
