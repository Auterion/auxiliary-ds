<script setup lang="ts">
import { inject } from 'vue';
import { Button, Badge } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const industries: { name: string; icon: IconName; blurb: string; to?: string }[] = [
  { name: 'Defense', icon: 'triangle-exclamation', blurb: 'ISR, force protection and tactical autonomy for allied forces.', to: 'defense' },
  { name: 'Public safety', icon: 'bell', blurb: 'First-responder situational awareness, search-and-rescue and incident command.' },
  { name: 'Energy & utilities', icon: 'gear', blurb: 'Automated inspection of grids, pipelines, wind and solar at scale.' },
  { name: 'Construction & survey', icon: 'house', blurb: 'Photogrammetry, progress tracking and volumetric site mapping.' },
  { name: 'Logistics & delivery', icon: 'arrow-up-right-from-square', blurb: 'BVLOS delivery networks with fleet routing and airspace integration.' },
  { name: 'Agriculture', icon: 'drone', blurb: 'Crop scouting, spraying and yield analytics across large operations.' },
];
</script>

<template>
  <div>
    <WebHero
      eyebrow="Solutions"
      title="Built for your mission"
      subtitle="The same platform adapts to every operation — from contested airspace to a wind farm at dawn."
      primary="Find your solution"
      secondary="Talk to an expert"
    />

    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="ind in industries"
          :key="ind.name"
          class="group rounded-2xl border border-border bg-card p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-xl"
          @click="ind.to && navigate(ind.to)"
        >
          <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary"><Icon :name="ind.icon" size="md" /></div>
          <h3 class="mt-4 flex items-center gap-1.5 text-[16px] font-semibold">{{ ind.name }} <Icon name="arrow-right" size="xs" class="text-muted-foreground transition-transform group-hover:translate-x-0.5" /></h3>
          <p class="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{{ ind.blurb }}</p>
        </button>
      </div>
    </section>

    <!-- featured use-case -->
    <section class="border-y border-border/60 bg-card/40">
      <div class="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
        <div>
          <Badge variant="secondary" size="sm">Case study</Badge>
          <h2 class="mt-3 text-3xl font-semibold tracking-tight">Inspecting 40,000 km of grid, autonomously</h2>
          <p class="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            A national utility replaced manual line inspection with an Auterion-powered fleet — cutting
            inspection time by 70% and flagging faults before they became outages.
          </p>
          <div class="mt-6 grid grid-cols-3 gap-4">
            <div><p class="text-2xl font-semibold tabular-nums">70%</p><p class="text-[12px] text-muted-foreground">Faster</p></div>
            <div><p class="text-2xl font-semibold tabular-nums">12k</p><p class="text-[12px] text-muted-foreground">Flights / yr</p></div>
            <div><p class="text-2xl font-semibold tabular-nums">9</p><p class="text-[12px] text-muted-foreground">Regions</p></div>
          </div>
        </div>
        <figure class="rounded-2xl border border-border bg-card p-6">
          <blockquote class="text-[18px] leading-relaxed">
            “We went from scheduling inspections in weeks to launching them in minutes. The whole fleet runs on one stack.”
          </blockquote>
          <figcaption class="mt-5 flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-[12px] font-medium">AR</span>
            <span class="text-[13px]"><span class="font-medium">Anna Roth</span><span class="block text-muted-foreground">Head of Grid Ops, Nordic Power</span></span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-20 text-center">
      <h2 class="text-3xl font-semibold tracking-tight lg:text-4xl">Not sure where to start?</h2>
      <p class="mx-auto mt-3 max-w-lg text-[16px] text-muted-foreground">Tell us about your operation and we'll map the right configuration.</p>
      <div class="mt-7 flex justify-center gap-3">
        <Button size="lg" class="gap-2">Talk to our team <Icon name="arrow-right" size="xs" /></Button>
      </div>
    </section>
  </div>
</template>
