<script setup lang="ts">
import { inject } from 'vue';
import { Button, Badge, StatusBadge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Sparkline from '../../suite/Sparkline.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const products = [
  { name: 'Auterion Suite', icon: 'house', blurb: 'Fleet, operations and analytics for your entire program — in the cloud.', to: 'products' },
  { name: 'Mission Control', icon: 'drone', blurb: 'Field-proven ground control. Map, gimbal and mission, on any tablet.', to: 'products' },
  { name: 'AuterionOS', icon: 'gear', blurb: 'The open operating system powering autonomous vehicles at the edge.', to: 'developers' },
  { name: 'Skynode', icon: 'bars', blurb: 'Flight-control compute and connectivity that runs the whole stack.', to: 'products' },
] as const;
const stats = [
  { value: '2M+', label: 'Flight hours' },
  { value: '10,000+', label: 'Vehicles deployed' },
  { value: '60+', label: 'Countries' },
  { value: '99.9%', label: 'Fleet uptime' },
];
const heroSpark = [8, 10, 9, 12, 14, 13, 16, 15, 18, 20, 19, 23, 26, 24, 28, 31];
const heroRows = [
  { name: 'Skyhook-01', level: 'nominal' as const, label: 'Operational', batt: 86 },
  { name: 'Falcon-02', level: 'advisory' as const, label: 'In flight', batt: 64 },
  { name: 'Raven-03', level: 'warning' as const, label: 'Low battery', batt: 18 },
  { name: 'Osprey-05', level: 'nominal' as const, label: 'Operational', batt: 92 },
];
</script>

<template>
  <div>
    <!-- hero -->
    <section class="relative overflow-hidden border-b border-border/60">
      <div class="hero-glow pointer-events-none absolute inset-0" />
      <div class="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[12px] text-muted-foreground">
            <span class="h-1.5 w-1.5 rounded-full" style="background: var(--nominal)" /> AuterionOS 4.2 is now available
          </span>
          <h1 class="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight lg:text-6xl">The operating system for autonomous robotics</h1>
          <p class="mt-5 max-w-md text-[17px] leading-relaxed text-muted-foreground">
            One software platform to build, deploy and command intelligent drones at scale — from the flight controller to the fleet.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" class="gap-2">Get started <Icon name="arrow-right" size="xs" /></Button>
            <Button variant="secondary" size="lg" class="gap-2"><Icon name="circle-info" size="xs" /> Watch the demo</Button>
          </div>
          <p class="mt-6 text-[13px] text-muted-foreground">Trusted across defense, enterprise and public safety.</p>
        </div>
        <div class="relative">
          <div class="absolute -inset-4 rounded-3xl" style="background: radial-gradient(60% 60% at 70% 20%, color-mix(in oklab, var(--foreground) 8%, transparent), transparent 70%)" />
          <div class="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span class="flex h-5 w-5 items-center justify-center rounded-md" style="background: var(--foreground); color: var(--background)"><Icon name="drone" size="xs" /></span>
              <span class="text-[13px] font-medium">Fleet · Munich</span>
              <Badge variant="secondary" size="sm" class="ml-auto">Live</Badge>
            </div>
            <div class="grid grid-cols-3 gap-3 p-4">
              <div class="col-span-2 rounded-xl border border-border p-3">
                <p class="text-[11px] text-muted-foreground">Flights · 30d</p>
                <p class="mt-0.5 text-2xl font-semibold tabular-nums">695</p>
                <div class="mt-1 h-9" style="color: var(--foreground)"><Sparkline :data="heroSpark" :height="36" /></div>
              </div>
              <div class="rounded-xl border border-border p-3">
                <p class="text-[11px] text-muted-foreground">Active</p>
                <p class="mt-0.5 text-2xl font-semibold tabular-nums">8</p>
                <p class="mt-1 text-[11px] text-muted-foreground">of 10 vehicles</p>
              </div>
            </div>
            <div class="px-4 pb-4">
              <div v-for="r in heroRows" :key="r.name" class="flex items-center gap-3 border-t border-border/60 py-2.5">
                <Icon name="drone" size="xs" class="text-muted-foreground" />
                <span class="flex-1 text-[13px] font-medium">{{ r.name }}</span>
                <span class="font-mono text-[12px] tabular-nums text-muted-foreground">{{ r.batt }}%</span>
                <StatusBadge :level="r.level" size="sm" dot>{{ r.label }}</StatusBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- trust strip -->
    <section class="border-b border-border/60">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-8 text-[15px] font-medium text-muted-foreground/70">
        <span>GovTech</span><span>NATO</span><span>Quantum Systems</span><span>Nokia</span><span>Skydio</span><span>US DoD</span>
      </div>
    </section>

    <!-- products -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="max-w-xl">
        <p class="text-[13px] font-medium uppercase tracking-widest text-muted-foreground">The platform</p>
        <h2 class="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">One stack, from silicon to fleet</h2>
        <p class="mt-3 text-[16px] text-muted-foreground">Every layer is built to work together — and open enough to build on.</p>
      </div>
      <div class="mt-10 grid gap-4 sm:grid-cols-2">
        <button v-for="p in products" :key="p.name" class="group rounded-2xl border border-border bg-card p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-xl" @click="navigate(p.to)">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary"><Icon :name="p.icon" size="md" /></div>
          <h3 class="mt-4 flex items-center gap-1.5 text-[17px] font-semibold">{{ p.name }} <Icon name="arrow-right" size="xs" class="text-muted-foreground transition-transform group-hover:translate-x-0.5" /></h3>
          <p class="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{{ p.blurb }}</p>
        </button>
      </div>
    </section>

    <!-- stats -->
    <section class="border-y border-border/60 bg-card/40">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 lg:grid-cols-4">
        <div v-for="s in stats" :key="s.label">
          <p class="text-4xl font-semibold tracking-tight tabular-nums lg:text-5xl">{{ s.value }}</p>
          <p class="mt-1 text-[14px] text-muted-foreground">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- defense callout -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p class="text-[13px] font-medium uppercase tracking-widest text-muted-foreground">Defense & public safety</p>
          <h2 class="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">Built for the mission. Proven at the edge.</h2>
          <p class="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            Encrypted datalinks, on-device autonomy and a hardened OS — engineered to operate where connectivity is contested and the stakes are real.
          </p>
          <ul class="mt-6 space-y-3">
            <li v-for="f in ['NDAA-compliant hardware', 'Offline-first mission autonomy', 'Day & scotopic night operations', 'Role-based access and audit']" :key="f" class="flex items-center gap-3 text-[15px]">
              <Icon name="circle-check" size="sm" style="color: var(--nominal)" /> {{ f }}
            </li>
          </ul>
          <Button variant="secondary" size="md" class="mt-7 gap-2" @click="navigate('defense')">Explore defense <Icon name="arrow-right" size="xs" /></Button>
        </div>
        <div class="relative overflow-hidden rounded-2xl border border-border bg-card p-1.5">
          <div class="def-map relative h-72 w-full overflow-hidden rounded-xl">
            <svg viewBox="0 0 480 300" class="absolute inset-0 h-full w-full" aria-hidden="true">
              <g fill="none" stroke="color-mix(in oklab, var(--foreground) 16%, transparent)" stroke-width="1">
                <path d="M0 80 H480 M0 150 H480 M0 220 H480 M120 0 V300 M240 0 V300 M360 0 V300" />
              </g>
              <path d="M40 240 C 140 180, 180 120, 280 100 S 420 60, 450 40" fill="none" stroke="var(--foreground)" stroke-width="1.5" stroke-dasharray="2 6" opacity="0.7" />
              <g v-for="(p, i) in [[40,240],[180,150],[280,100],[450,40]]" :key="i">
                <circle :cx="p[0]" :cy="p[1]" r="4" fill="var(--foreground)" />
                <circle :cx="p[0]" :cy="p[1]" r="11" fill="none" stroke="var(--foreground)" stroke-width="1" opacity="0.4" />
              </g>
            </svg>
            <span class="absolute bottom-3 left-3 rounded-md border border-border bg-card/80 px-2 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur">3 active corridors · 11 vehicles</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-border/60">
      <div class="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 class="mx-auto max-w-2xl text-4xl font-semibold tracking-tight lg:text-5xl">Ready to put autonomy in the field?</h2>
        <p class="mx-auto mt-4 max-w-lg text-[16px] text-muted-foreground">Start building on the Auterion platform today, or talk to our team about your program.</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" class="gap-2">Get started <Icon name="arrow-right" size="xs" /></Button>
          <Button variant="secondary" size="lg">Contact sales</Button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-glow {
  background:
    radial-gradient(50% 60% at 75% 0%, color-mix(in oklab, var(--foreground) 7%, transparent), transparent 70%),
    radial-gradient(40% 50% at 10% 20%, color-mix(in oklab, var(--foreground) 5%, transparent), transparent 70%);
}
.def-map { background: linear-gradient(160deg, color-mix(in oklab, var(--foreground) 6%, var(--card)), var(--card)); }
</style>
