/* Hallmark · macrostructure: Swiss-Minimal · tone: clean-professional · anchor: white+blue-accent */
<script setup lang="ts">
import { inject } from 'vue';
import { Button } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const products: { name: string; tag: string; icon: IconName; desc: string; bullets: string[] }[] = [
  {
    name: 'Auterion Suite', tag: 'Cloud', icon: 'bars',
    desc: 'Command your entire fleet from one place. Live operations, mission history, analytics and team management — in the browser.',
    bullets: ['Real-time fleet status & telemetry', 'Mission planning and replay', 'Org, team and seat management'],
  },
  {
    name: 'Mission Control', tag: 'Ground control', icon: 'drone',
    desc: 'The field-proven ground station. Plan, fly and stream from a tablet, with day and scotopic night operation built in.',
    bullets: ['Map & gimbal-feed views', 'Guarded flight actions', 'Offline-first mission autonomy'],
  },
  {
    name: 'AuterionOS', tag: 'Vehicle OS', icon: 'gear',
    desc: 'The open operating system for autonomous vehicles. One software layer across every airframe and payload.',
    bullets: ['MAVLink-native, open APIs', 'Over-the-air updates', 'Payload & sensor framework'],
  },
  {
    name: 'Skynode', tag: 'Compute', icon: 'lock',
    desc: 'Flight-control compute, connectivity and AI acceleration in a single module — the brain that runs the stack.',
    bullets: ['Mission computer + autopilot', '4G/5G & mesh connectivity', 'NDAA-compliant hardware'],
  },
];

const comparison: { feature: string; oss: boolean; auterion: boolean }[] = [
  { feature: 'MAVLink-native flight stack', oss: true, auterion: true },
  { feature: 'Open APIs & SDK', oss: true, auterion: true },
  { feature: 'Fleet management & analytics', oss: false, auterion: true },
  { feature: 'Guarded mission operations', oss: false, auterion: true },
  { feature: 'Over-the-air updates', oss: false, auterion: true },
  { feature: 'NDAA-compliant hardware', oss: false, auterion: true },
  { feature: 'Enterprise support & SLAs', oss: false, auterion: true },
];
</script>

<template>
  <div class="overflow-x-clip" style="background: var(--background)">

    <!-- 1. HERO -->
    <WebHero
      eyebrow="Products"
      title="Every layer of the autonomy stack."
      subtitle="From the flight controller to the cloud, each part is engineered to work as one system — and open enough to build on."
      primary="Get started"
      secondary="Compare products"
      @primary="navigate('company')"
      @secondary="navigate('developers')"
    />

    <!-- 2. PRODUCT GRID (2x2) -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="mb-10">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">The platform</p>
        <h2 class="mt-3 text-4xl font-semibold tracking-[-0.02em] leading-[1.15]" style="color: var(--foreground)">
          Four products. <span style="color: var(--brand)">One stack.</span>
        </h2>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div
          v-for="p in products"
          :key="p.name"
          class="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
        >
          <div class="mb-4 flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg"
              style="background: color-mix(in oklab, var(--brand) 8%, white)"
            >
              <Icon :name="p.icon" size="sm" style="color: var(--brand)" />
            </div>
            <span class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{{ p.tag }}</span>
          </div>

          <h3 class="text-[18px] font-semibold tracking-[-0.01em]" style="color: var(--foreground)">{{ p.name }}</h3>
          <p class="mt-2 text-[14px] leading-relaxed text-muted-foreground">{{ p.desc }}</p>

          <ul class="mt-5 space-y-2.5">
            <li v-for="b in p.bullets" :key="b" class="flex items-center gap-2.5 text-[14px]" style="color: var(--foreground)">
              <Icon name="circle-check" size="xs" style="color: var(--brand); flex-shrink: 0" />
              {{ b }}
            </li>
          </ul>

          <Button variant="ghost" size="sm" class="mt-6 gap-2 text-[13px]">
            Learn more <Icon name="arrow-right" size="xs" />
          </Button>
        </div>
      </div>
    </section>

    <!-- 3. COMPARISON TABLE -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-4xl px-6 py-20">
        <div class="mb-10">
          <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Open source vs. Auterion</p>
          <h2 class="mt-3 text-4xl font-semibold tracking-[-0.02em] leading-[1.15]" style="color: var(--foreground)">
            Built on open. <span style="color: var(--brand)">Ready for scale.</span>
          </h2>
        </div>

        <div class="overflow-hidden rounded-xl border border-border">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr style="background: var(--brand)">
                <th class="px-5 py-3.5 text-[13px] font-semibold" style="color: var(--brand-foreground)">Feature</th>
                <th class="w-32 px-5 py-3.5 text-center text-[13px] font-semibold" style="color: var(--brand-foreground)">Open Source</th>
                <th class="w-32 px-5 py-3.5 text-center text-[13px] font-semibold" style="color: var(--brand-foreground)">Auterion</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in comparison"
                :key="row.feature"
                class="border-t border-border"
                :style="i % 2 === 1 ? 'background: color-mix(in oklab, var(--foreground) 2.5%, var(--card))' : 'background: var(--card)'"
              >
                <td class="px-5 py-3.5 text-[14px]" style="color: var(--foreground)">{{ row.feature }}</td>
                <td class="px-5 py-3.5 text-center">
                  <Icon
                    v-if="row.oss"
                    name="check"
                    size="xs"
                    class="text-muted-foreground"
                    style="display: inline-block"
                  />
                  <Icon
                    v-else
                    name="minus"
                    size="xs"
                    class="text-muted-foreground/50"
                    style="display: inline-block"
                  />
                </td>
                <td class="px-5 py-3.5 text-center">
                  <Icon name="circle-check" size="sm" style="color: var(--brand); display: inline-block" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 4. CTA -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-2xl px-6 py-24 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Get started</p>
        <h2 class="mt-3 text-4xl font-semibold tracking-[-0.02em] leading-[1.15]" style="color: var(--foreground)">
          See the whole platform in action.
        </h2>
        <p class="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-muted-foreground">
          Book a walkthrough with our team, tailored to your fleet and missions.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            class="cta-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold"
            style="background: var(--brand); color: var(--brand-foreground)"
            @click="navigate('company')"
          >
            Request a demo
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
.cta-btn:hover {
  background: color-mix(in oklab, var(--brand) 88%, black) !important;
}

.cta-btn:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
</style>
