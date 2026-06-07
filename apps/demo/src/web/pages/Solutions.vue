/* Hallmark · macrostructure: Swiss-Minimal · tone: clean-professional · anchor: white+blue-accent */
<script setup lang="ts">
import { inject } from 'vue';
import { Button } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const industries: { name: string; icon: IconName; blurb: string; to?: string }[] = [
  { name: 'Defense', icon: 'triangle-exclamation', blurb: 'ISR, force protection and tactical autonomy for allied forces.', to: 'defense' },
  { name: 'Public Safety', icon: 'bell', blurb: 'First-responder situational awareness, search-and-rescue and incident command.' },
  { name: 'Energy & Utilities', icon: 'gear', blurb: 'Automated inspection of grids, pipelines, wind and solar at scale.' },
  { name: 'Construction', icon: 'house', blurb: 'Photogrammetry, progress tracking and volumetric site mapping.' },
  { name: 'Logistics', icon: 'arrow-up-right-from-square', blurb: 'BVLOS delivery networks with fleet routing and airspace integration.' },
  { name: 'Agriculture', icon: 'drone', blurb: 'Crop scouting, spraying and yield analytics across large operations.' },
];
</script>

<template>
  <div class="overflow-x-clip" style="background: var(--background)">

    <!-- Hero -->
    <WebHero
      eyebrow="Solutions"
      title="Built for every operation."
      subtitle="Defense, energy, logistics, public safety. Same platform. Configured for each."
      primary="Find your solution"
      secondary="Talk to an expert"
    />

    <!-- Industry grid -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="mb-10">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Industries</p>
        <h2 class="mt-3 text-4xl font-semibold tracking-[-0.02em] leading-[1.15]">
          Every sector. <span style="color: var(--brand)">One platform.</span>
        </h2>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="ind in industries"
          :key="ind.name"
          class="industry-card group rounded-xl border border-border bg-card p-6 text-left transition-all hover:shadow-md"
          @click="ind.to && navigate(ind.to)"
        >
          <div class="mb-4 flex items-center gap-3">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg"
              style="background: color-mix(in oklab, var(--brand) 8%, white)"
            >
              <Icon :name="ind.icon" size="sm" style="color: var(--brand)" />
            </div>
          </div>

          <h3 class="flex items-center gap-1.5 text-[15px] font-semibold tracking-[-0.01em]">
            {{ ind.name }}
            <Icon
              name="arrow-right"
              size="xs"
              class="text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5"
            />
          </h3>
          <p class="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{{ ind.blurb }}</p>
        </button>
      </div>
    </section>

    <!-- Case study: left-right split -->
    <section class="border-t border-border">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="grid gap-12 lg:grid-cols-2 lg:items-center">

          <!-- Left: headline + text + stats -->
          <div>
            <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Case study · Energy &amp; utilities</p>
            <h2 class="mt-3 text-4xl font-semibold tracking-[-0.02em] leading-[1.15]">
              Inspecting 40,000 km of grid,<br><span style="color: var(--brand)">autonomously.</span>
            </h2>
            <p class="mt-4 text-[16px] leading-relaxed text-muted-foreground">
              A national utility replaced manual line inspection with an Auterion-powered fleet —
              cutting inspection time by 70% and flagging faults before they became outages.
            </p>

            <!-- Stats -->
            <div class="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div>
                <p class="font-mono text-4xl font-medium tabular-nums" style="color: var(--brand)">70%</p>
                <p class="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Faster inspection</p>
              </div>
              <div>
                <p class="font-mono text-4xl font-medium tabular-nums text-foreground">12k</p>
                <p class="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Flights per year</p>
              </div>
              <div>
                <p class="font-mono text-4xl font-medium tabular-nums text-foreground">9</p>
                <p class="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Regions covered</p>
              </div>
            </div>
          </div>

          <!-- Right: grid inspection diagram -->
          <div
            class="rounded-xl p-8"
            style="background: color-mix(in oklab, var(--brand) 6%, white); border: 1px solid color-mix(in oklab, var(--brand) 18%, transparent)"
          >
            <p class="mb-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Inspection flight path</p>
            <!-- SVG grid inspection diagram -->
            <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full" aria-label="Grid inspection path diagram">
              <!-- Grid lines (power grid) -->
              <line x1="40" y1="40" x2="280" y2="40" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="40" y1="80" x2="280" y2="80" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="40" y1="120" x2="280" y2="120" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="40" y1="160" x2="280" y2="160" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="40" y1="200" x2="280" y2="200" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="40" y1="40" x2="40" y2="200" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="100" y1="40" x2="100" y2="200" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="160" y1="40" x2="160" y2="200" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="220" y1="40" x2="220" y2="200" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />
              <line x1="280" y1="40" x2="280" y2="200" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 3" />

              <!-- Flight path (lawnmower pattern) -->
              <polyline
                points="40,50 280,50 280,70 40,70 40,90 280,90 280,110 40,110 40,130 280,130 280,150 40,150 40,170 280,170 280,190 40,190"
                stroke="var(--brand)"
                stroke-width="1.5"
                fill="none"
                stroke-linejoin="round"
                opacity="0.7"
              />

              <!-- Tower/pylon markers -->
              <g v-for="x in [40, 100, 160, 220, 280]" :key="x">
                <rect :x="x - 3" y="37" width="6" height="6" fill="var(--brand)" rx="1" opacity="0.8" />
                <rect :x="x - 3" y="77" width="6" height="6" fill="var(--brand)" rx="1" opacity="0.8" />
                <rect :x="x - 3" y="117" width="6" height="6" fill="var(--brand)" rx="1" opacity="0.8" />
                <rect :x="x - 3" y="157" width="6" height="6" fill="var(--brand)" rx="1" opacity="0.8" />
                <rect :x="x - 3" y="197" width="6" height="6" fill="var(--brand)" rx="1" opacity="0.8" />
              </g>

              <!-- Fault marker -->
              <circle cx="160" cy="130" r="7" fill="none" stroke="#EF4444" stroke-width="1.5" />
              <circle cx="160" cy="130" r="2" fill="#EF4444" />

              <!-- Drone icon (simple) -->
              <g transform="translate(276, 46)">
                <circle cx="4" cy="4" r="4" fill="var(--brand)" opacity="0.9" />
              </g>

              <!-- Legend -->
              <line x1="40" y1="212" x2="60" y2="212" stroke="var(--brand)" stroke-width="1.5" opacity="0.7" />
              <text x="65" y="216" font-family="monospace" font-size="8" fill="#64748B">Flight path</text>
              <circle cx="150" cy="212" r="4" fill="none" stroke="#EF4444" stroke-width="1.5" />
              <text x="158" y="216" font-family="monospace" font-size="8" fill="#64748B">Fault detected</text>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-3xl px-6 py-20">
        <figure>
          <blockquote
            class="border-l-[3px] pl-6 text-[18px] leading-relaxed text-foreground lg:text-[20px]"
            style="border-color: var(--brand)"
          >
            "We went from scheduling inspections in weeks to launching them in minutes.
            The whole fleet runs on one stack."
          </blockquote>
          <figcaption class="mt-6 flex items-center gap-3 pl-6">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full font-mono text-[12px] font-medium"
              style="background: color-mix(in oklab, var(--brand) 10%, white); color: var(--brand)"
            >AR</span>
            <span class="text-[13px]">
              <span class="font-semibold text-foreground">Anna Roth</span>
              <span class="mt-0.5 block text-muted-foreground">Head of Grid Ops, Nordic Power</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-2xl px-6 py-20 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Get started</p>
        <h2 class="mt-3 text-4xl font-semibold tracking-[-0.02em] leading-[1.15]">
          Find your solution.
        </h2>
        <p class="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-muted-foreground">
          Tell us about your operation and we'll map the right configuration.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            class="cta-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold"
            style="background: var(--brand); color: var(--brand-foreground)"
          >
            Talk to our team
            <Icon name="arrow-right" size="xs" />
          </button>
          <Button variant="ghost" size="md" class="gap-2 text-[14px]">
            Explore the platform
          </Button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.industry-card:hover {
  border-color: color-mix(in oklab, var(--brand) 30%, var(--border));
  border-bottom-width: 2px;
  border-bottom-color: var(--brand);
}

.cta-btn:hover {
  background: color-mix(in oklab, var(--brand) 88%, black) !important;
}

.cta-btn:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
</style>
