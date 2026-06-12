<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Input, Label, Switch, Button, Badge, StatusBadge, Progress, Avatar, AvatarFallback, Separator,
} from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';

const theme = defineModel<'dark' | 'light'>('theme', { default: 'dark' });

const SECTIONS = [
  { key: 'general', label: 'Organization', icon: 'house' },
  { key: 'plan', label: 'Plan & usage', icon: 'circle-info' },
  { key: 'members', label: 'Members', icon: 'users' },
  { key: 'integrations', label: 'Integrations', icon: 'gear' },
  { key: 'api', label: 'API keys', icon: 'lock' },
] as const;
const section = ref('general');
const activeSection = computed(() => SECTIONS.find((s) => s.key === section.value) ?? SECTIONS[0]!);

const orgName = ref('Skyward Robotics');
const orgDomain = ref('skyward.auterion.com');

const usage = [
  { label: 'Seats', used: 226, cap: '∞', pct: 38 },
  { label: 'Vehicles', used: 1667, cap: '10,000', pct: 17 },
  { label: 'Flights · month', used: 8420, cap: '25,000', pct: 34 },
  { label: 'Storage', used: 412, cap: '1,024 GB', pct: 40 },
];

const members = [
  { name: 'Oz Vahid', email: 'oz@skyward.io', role: 'Owner', initials: 'OV', level: 'nominal' as const },
  { name: 'Mara Lindt', email: 'mara@skyward.io', role: 'Admin', initials: 'ML', level: 'nominal' as const },
  { name: 'Jonas Réh', email: 'jonas@skyward.io', role: 'Pilot', initials: 'JR', level: 'advisory' as const },
  { name: 'Priya Nadar', email: 'priya@skyward.io', role: 'Observer', initials: 'PN', level: 'caution' as const },
];

const integrations = ref([
  { name: 'Slack', sub: 'Alerts to #ops', on: true },
  { name: 'Webhooks', sub: 'Mission + telemetry events', on: true },
  { name: 'MAVLink bridge', sub: 'External GCS forwarding', on: false },
  { name: 'S3 export', sub: 'Nightly flight-log archive', on: true },
]);

const showKey = ref(false);
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col">
    <!-- Topbar -->
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
      <Icon name="gear" size="sm" class="text-muted-foreground" />
      <span class="ix-label">SUITE</span>
      <span class="text-muted-foreground/40">/</span>
      <h1 class="text-[14px] font-medium tracking-tight">Settings</h1>

      <div class="ml-auto flex items-center gap-3">
        <span class="ix-label hidden lg:inline">{{ activeSection.label.toUpperCase() }}</span>

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

    <div class="flex min-h-0 flex-1 overflow-hidden">
      <!-- settings section-nav -->
      <nav class="w-56 shrink-0 space-y-0.5 border-r border-border p-3">
        <span class="ix-label px-2.5 pb-1.5">SECTIONS</span>
        <button
          v-for="s in SECTIONS"
          :key="s.key"
          class="ix-edge flex w-full items-center gap-2.5 rounded-lg pl-2.5 pr-2 py-2 text-left text-[13px] transition-colors"
          :class="section === s.key ? 'ix-active bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'"
          :aria-current="section === s.key ? 'page' : undefined"
          @click="section = s.key"
        >
          <Icon :name="s.icon" size="xs" :class="section === s.key ? 'text-[var(--brand)]' : ''" />
          {{ s.label }}
        </button>
      </nav>

      <!-- content -->
      <div class="flex-1 overflow-auto px-6 py-6">
        <div class="mx-auto max-w-2xl space-y-4">
          <!-- General -->
          <template v-if="section === 'general'">
            <section class="ix-panel p-5">
              <div class="ix-head mb-4">
                <span class="ix-label">ORGANIZATION</span>
                <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">BUSINESS</span>
              </div>
              <p class="-mt-2 mb-4 text-[13px] text-muted-foreground">Identity and defaults for your workspace.</p>

              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div
class="flex h-14 w-14 items-center justify-center rounded-xl"
                    style="background: linear-gradient(140deg, var(--brand), color-mix(in oklab, var(--brand) 60%, black)); color: var(--brand-foreground)">
                    <Icon name="drone" size="lg" />
                  </div>
                  <Button variant="secondary" size="sm">Change logo</Button>
                  <Badge variant="secondary" size="sm" class="ml-auto">Business plan</Badge>
                </div>
                <Separator />
                <div class="grid gap-1.5">
                  <Label for="org" class="ix-label">ORGANIZATION NAME</Label>
                  <Input id="org" v-model="orgName" />
                </div>
                <div class="grid gap-1.5">
                  <Label for="dom" class="ix-label">WORKSPACE URL</Label>
                  <Input id="dom" v-model="orgDomain" class="font-mono" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="grid gap-1.5">
                    <Label class="ix-label">DEFAULT THEME</Label>
                    <button class="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-[13px] capitalize transition-colors hover:bg-secondary">
                      {{ theme }} <Icon name="chevron-down" size="xs" class="text-muted-foreground" />
                    </button>
                  </div>
                  <div class="grid gap-1.5">
                    <Label class="ix-label">UNITS</Label>
                    <button class="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-[13px] transition-colors hover:bg-secondary">
                      Metric (SI) <Icon name="chevron-down" size="xs" class="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <div class="flex justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button size="sm">Save changes</Button>
            </div>
          </template>

          <!-- Plan & usage -->
          <template v-else-if="section === 'plan'">
            <section class="ix-panel p-5">
              <div class="ix-head mb-4">
                <span class="ix-label">PLAN &amp; USAGE</span>
                <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">RESETS 12D</span>
              </div>
              <div class="flex items-center gap-4">
                <div>
                  <p class="text-[15px] font-semibold tracking-tight">Business</p>
                  <p class="font-mono text-[12px] tabular-nums text-muted-foreground">$1,200 / mo · billed annually</p>
                </div>
                <StatusBadge level="nominal" size="sm" dot class="ml-auto">Active</StatusBadge>
                <Button variant="secondary" size="sm">Manage plan</Button>
              </div>
            </section>

            <section class="ix-panel p-5">
              <div class="ix-head mb-4">
                <span class="ix-label">RESOURCE USAGE</span>
                <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ usage.length }} METERS</span>
              </div>
              <div class="grid grid-cols-2 gap-x-6 gap-y-5">
                <div v-for="u in usage" :key="u.label" class="space-y-2">
                  <div class="flex items-baseline justify-between">
                    <span class="ix-label">{{ u.label.toUpperCase() }}</span>
                    <span class="font-mono text-[12px] tabular-nums">
                      <span class="text-foreground">{{ u.used.toLocaleString() }}</span>
                      <span class="text-muted-foreground"> / {{ u.cap }}</span>
                    </span>
                  </div>
                  <Progress :value="u.pct" class="h-1.5" />
                  <div class="text-right font-mono text-[10px] tabular-nums text-muted-foreground">{{ u.pct }}%</div>
                </div>
              </div>
            </section>
          </template>

          <!-- Members -->
          <template v-else-if="section === 'members'">
            <section class="ix-panel overflow-hidden">
              <div class="ix-head px-4 pt-4">
                <span class="ix-label">MEMBERS</span>
                <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ members.length }} / 226 SEATS</span>
                <Button size="sm" class="ml-3 gap-1.5"><Icon name="plus" size="xs" /> Invite</Button>
              </div>
              <div>
                <div
v-for="(mem, i) in members" :key="mem.email"
                  class="ix-edge flex items-center gap-3 px-4 py-3"
                  :class="[`ix-edge-${mem.level}`, i < members.length - 1 ? 'border-b border-border/60' : '']">
                  <Avatar size="sm"><AvatarFallback>{{ mem.initials }}</AvatarFallback></Avatar>
                  <div class="min-w-0 flex-1">
                    <p class="text-[13px] font-medium">{{ mem.name }}</p>
                    <p class="font-mono text-[12px] tabular-nums text-muted-foreground">{{ mem.email }}</p>
                  </div>
                  <Badge variant="secondary" size="sm">{{ mem.role }}</Badge>
                  <StatusBadge :level="mem.level" size="sm" dot :sr-label="mem.level">{{ mem.level === 'nominal' ? 'Active' : mem.level === 'advisory' ? 'Flying' : 'Idle' }}</StatusBadge>
                  <button class="text-muted-foreground hover:text-foreground"><Icon name="ellipsis" size="sm" /></button>
                </div>
              </div>
            </section>
          </template>

          <!-- Integrations -->
          <template v-else-if="section === 'integrations'">
            <section class="ix-panel overflow-hidden">
              <div class="ix-head px-4 pt-4">
                <span class="ix-label">INTEGRATIONS</span>
                <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ integrations.filter((it) => it.on).length }} / {{ integrations.length }} ON</span>
              </div>
              <div>
                <div v-for="(it, i) in integrations" :key="it.name" class="flex items-center gap-3 px-4 py-3.5" :class="i < integrations.length - 1 ? 'border-b border-border/60' : ''">
                  <span class="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary"><Icon name="gear" size="sm" /></span>
                  <div class="min-w-0 flex-1">
                    <p class="text-[13px] font-medium">{{ it.name }}</p>
                    <p class="text-[12px] text-muted-foreground">{{ it.sub }}</p>
                  </div>
                  <StatusBadge v-if="it.on" level="nominal" size="sm" variant="outline" :icon="false" dot>Connected</StatusBadge>
                  <Switch v-model="it.on" />
                </div>
              </div>
            </section>
          </template>

          <!-- API keys -->
          <template v-else>
            <section class="ix-panel p-5">
              <div class="ix-head mb-4">
                <span class="ix-label">API KEYS</span>
                <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">1 ACTIVE</span>
                <Button size="sm" class="ml-3 gap-1.5"><Icon name="plus" size="xs" /> New key</Button>
              </div>
              <div class="space-y-4">
                <div class="ix-edge ix-edge-nominal flex items-center gap-3 rounded-r-lg bg-secondary/30 py-2 pl-3 pr-2">
                  <div class="min-w-0 flex-1">
                    <p class="text-[13px] font-medium">Production key</p>
                    <p class="font-mono text-[12px] tabular-nums text-muted-foreground">{{ showKey ? 'sk_live_aX3M3A6v9Qk2RtZ7pL0wNc' : 'sk_live_•••••••••••••••••••' }}</p>
                  </div>
                  <StatusBadge level="nominal" size="sm" dot>Active</StatusBadge>
                  <Button variant="ghost" size="sm" class="gap-1.5" @click="showKey = !showKey">
                    <Icon :name="showKey ? 'eye-slash' : 'eye'" size="xs" /> {{ showKey ? 'Hide' : 'Reveal' }}
                  </Button>
                  <Button variant="secondary" size="sm" class="gap-1.5"><Icon name="copy" size="xs" /> Copy</Button>
                </div>
                <Separator />
                <p class="font-mono text-[11px] tabular-nums text-muted-foreground">Last used 4m ago · created Mar 4, 2025 · 28,402 requests this month.</p>
              </div>
            </section>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
