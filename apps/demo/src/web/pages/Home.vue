/* Hallmark · macrostructure: Swiss-Minimal · tone: clean-professional · anchor: white+blue-accent */
<script setup lang="ts">
import { inject } from 'vue';
import { Button } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const logos = ['GovTech', 'NATO', 'Quantum Systems', 'Nokia', 'Skydio', 'US DoD'];

const products: { name: string; icon: IconName; blurb: string; to: string }[] = [
  { name: 'Auterion Suite', icon: 'bars', blurb: 'Fleet, operations and analytics for your entire program — in the cloud.', to: 'products' },
  { name: 'Mission Control', icon: 'drone', blurb: 'Field-proven ground control. Map, gimbal and mission, on any tablet.', to: 'products' },
  { name: 'AuterionOS', icon: 'gear', blurb: 'The open operating system powering autonomous vehicles at the edge.', to: 'developers' },
  { name: 'Skynode', icon: 'lock', blurb: 'Flight-control compute and connectivity that runs the whole stack.', to: 'products' },
];

const steps = [
  { n: '01', title: 'Build', blurb: 'Write apps against the open SDK and simulate every mission before it flies.' },
  { n: '02', title: 'Deploy', blurb: 'Ship over-the-air to any Skynode-powered vehicle, across any airframe.' },
  { n: '03', title: 'Command', blurb: 'Run the whole fleet from the cloud — live telemetry, missions and analytics.' },
];

const stats = [
  { value: '2M+', label: 'Flight hours', brand: true },
  { value: '10,000+', label: 'Vehicles deployed', brand: false },
  { value: '60+', label: 'Countries', brand: false },
  { value: '99.9%', label: 'Fleet uptime', brand: false },
];
</script>

<template>
  <div class="overflow-x-clip" style="background: var(--background)">

    <!-- 1. HERO -->
    <WebHero
      eyebrow="AuterionOS 4.2 is now available"
      title="The operating system for autonomous robotics."
      subtitle="One software platform to build, deploy and command intelligent drones at scale — from the flight controller to the fleet."
      primary="Get started"
      secondary="Watch the demo"
      @primary="navigate('products')"
      @secondary="navigate('developers')"
    />

    <!-- 2. TRUST STRIP -->
    <section class="border-b border-border overflow-hidden" style="background: var(--background)">
      <div class="flex items-center gap-1 py-4">
        <span class="shrink-0 pr-4 pl-6 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40">Trusted by</span>
        <div class="trust-track flex items-center gap-16 whitespace-nowrap">
          <span v-for="(l, i) in [...logos, ...logos]" :key="`${l}-${i}`" class="font-mono text-[13px] font-medium text-muted-foreground/40 uppercase tracking-[0.08em]">{{ l }}</span>
        </div>
      </div>
    </section>

    <!-- 3. PRODUCTS -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="mb-10 max-w-xl">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">The platform</p>
        <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
          One stack, <span style="color: var(--brand)">silicon to fleet.</span>
        </h2>
        <p class="mt-4 text-[16px] leading-relaxed text-muted-foreground">
          Every layer is built to work together — and open enough to build on.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <button
          v-for="p in products"
          :key="p.name"
          class="group rounded-xl border border-border bg-card p-6 text-left transition-all hover:shadow-md"
          @click="navigate(p.to)"
        >
          <div class="mb-4 flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg"
              style="background: color-mix(in oklab, var(--brand) 8%, white)"
            >
              <Icon :name="p.icon" size="sm" style="color: var(--brand)" />
            </div>
          </div>
          <h3 class="flex items-center gap-1.5 text-[16px] font-medium" style="color: var(--foreground)">
            {{ p.name }}
            <Icon
              name="arrow-right"
              size="xs"
              class="text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5"
            />
          </h3>
          <p class="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{{ p.blurb }}</p>
        </button>
      </div>
    </section>

    <!-- 4. HOW IT WORKS -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="mb-12 max-w-xl">
          <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">How it works</p>
          <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
            From idea to <span style="color: var(--brand)">autonomy.</span>
          </h2>
        </div>

        <div class="grid gap-10 sm:grid-cols-3">
          <div v-for="s in steps" :key="s.n">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full font-mono text-[13px] font-medium"
              style="border: 1.5px solid var(--brand); color: var(--brand)"
            >{{ s.n }}</div>
            <h3 class="mt-5 text-[18px] font-medium" style="color: var(--foreground)">{{ s.title }}</h3>
            <p class="mt-2 text-[14px] leading-relaxed text-muted-foreground">{{ s.blurb }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. STATS (dark) -->
    <section style="background: #0a0c0e">
      <div class="mx-auto max-w-6xl px-6 py-24">
        <p class="font-mono text-[11px] uppercase tracking-[0.14em] mb-12 text-center" style="color: #4b5563">Numbers that matter</p>
        <div class="grid grid-cols-2 gap-12 text-center lg:grid-cols-4">
          <div v-for="s in stats" :key="s.label" class="flex flex-col items-center">
            <p
              class="stat-value font-medium tabular-nums"
              :style="s.brand ? 'color: var(--brand)' : 'color: #f3f4f6'"
            >{{ s.value }}</p>
            <div class="mt-3 h-px w-8 opacity-20" style="background: #6b7280" />
            <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.12em]" style="color: #4b5563">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. CTA -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-2xl px-6 py-24 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Get started</p>
        <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
          Build the autonomous future.
        </h2>
        <p class="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-muted-foreground">
          Trusted across defense, enterprise and public safety. See what one stack can do for your fleet.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            class="cta-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold"
            style="background: var(--brand); color: var(--brand-foreground)"
            @click="navigate('products')"
          >
            Get started
            <Icon name="arrow-right" size="xs" />
          </button>
          <Button variant="ghost" size="md" class="gap-2 text-[14px]" @click="navigate('developers')">
            Read the docs
          </Button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.trust-track {
  animation: scroll-left 22s linear infinite;
}

@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.stat-value {
  font-family: 'Inter Variable', Inter, system-ui, sans-serif;
  font-optical-sizing: auto;
  font-variation-settings: 'opsz' 48;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  letter-spacing: -0.04em;
  line-height: 1;
}

.cta-btn:hover {
  background: color-mix(in oklab, var(--brand) 88%, black) !important;
}

.cta-btn:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
</style>
