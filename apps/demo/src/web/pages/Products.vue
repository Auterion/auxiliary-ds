<script setup lang="ts">
import { Button, Badge, StatusBadge, Progress } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Sparkline from '../../suite/Sparkline.vue';
import WebHero from '../WebHero.vue';

const products = [
  {
    name: 'Auterion Suite', tag: 'Cloud', graphic: 'dash',
    desc: 'Command your entire fleet from one place. Live operations, mission history, analytics and team management — in the browser.',
    bullets: ['Real-time fleet status & telemetry', 'Mission planning and replay', 'Org, team and seat management'],
  },
  {
    name: 'Mission Control', tag: 'Ground control', graphic: 'map',
    desc: 'The field-proven ground station. Plan, fly and stream from a tablet, with day and scotopic night operation built in.',
    bullets: ['Map & gimbal-feed views', 'Guarded flight actions', 'Offline-first mission autonomy'],
  },
  {
    name: 'AuterionOS', tag: 'Vehicle OS', graphic: 'vitals',
    desc: 'The open operating system for autonomous vehicles. One software layer across every airframe and payload.',
    bullets: ['MAVLink-native, open APIs', 'Over-the-air updates', 'Payload & sensor framework'],
  },
  {
    name: 'Skynode', tag: 'Compute', graphic: 'board',
    desc: 'Flight-control compute, connectivity and AI acceleration in a single module — the brain that runs the stack.',
    bullets: ['Mission computer + autopilot', '4G/5G & mesh connectivity', 'NDAA-compliant hardware'],
  },
];
const spark = [10, 12, 11, 14, 16, 15, 18, 22, 20, 25, 28, 31];
</script>

<template>
  <div>
    <WebHero
      eyebrow="Products"
      title="Every layer of the autonomy stack"
      subtitle="From the flight controller to the cloud, each part is engineered to work as one system — and open enough to build on."
      primary="Get started"
      secondary="Compare products"
    />

    <section class="mx-auto max-w-6xl space-y-20 px-6 py-20">
      <div v-for="(p, i) in products" :key="p.name" class="grid items-center gap-10 lg:grid-cols-2">
        <div :class="i % 2 === 1 ? 'lg:order-2' : ''">
          <Badge variant="secondary" size="sm">{{ p.tag }}</Badge>
          <h2 class="mt-3 text-3xl font-semibold tracking-tight">{{ p.name }}</h2>
          <p class="mt-3 text-[16px] leading-relaxed text-muted-foreground">{{ p.desc }}</p>
          <ul class="mt-5 space-y-2.5">
            <li v-for="b in p.bullets" :key="b" class="flex items-center gap-3 text-[15px]">
              <Icon name="circle-check" size="sm" style="color: var(--nominal)" /> {{ b }}
            </li>
          </ul>
          <Button variant="secondary" size="md" class="mt-7 gap-2">Learn more <Icon name="arrow-right" size="xs" /></Button>
        </div>

        <!-- preview -->
        <div :class="i % 2 === 1 ? 'lg:order-1' : ''" class="relative overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl">
          <div class="rounded-xl border border-border" style="background: linear-gradient(160deg, color-mix(in oklab, var(--foreground) 5%, var(--card)), var(--card))">
            <div class="flex items-center gap-2 border-b border-border px-3.5 py-2">
              <span class="flex h-5 w-5 items-center justify-center rounded-md" style="background: var(--foreground); color: var(--background)"><Icon name="drone" size="xs" /></span>
              <span class="text-[12px] font-medium">{{ p.name }}</span>
              <Badge variant="outline" size="sm" class="ml-auto">{{ p.tag }}</Badge>
            </div>
            <div class="p-4">
              <!-- dash -->
              <div v-if="p.graphic === 'dash'" class="space-y-2">
                <div class="rounded-lg border border-border p-2.5">
                  <p class="text-[10px] text-muted-foreground">Flights · 30d</p>
                  <div class="flex items-end justify-between">
                    <p class="text-xl font-semibold tabular-nums">695</p>
                    <div class="h-7 w-32" style="color: var(--foreground)"><Sparkline :data="spark" :height="28" /></div>
                  </div>
                </div>
                <div v-for="r in [['Skyhook-01','nominal','86%'],['Falcon-02','advisory','64%'],['Raven-03','warning','18%']]" :key="r[0]" class="flex items-center gap-2 text-[12px]">
                  <Icon name="drone" size="xs" class="text-muted-foreground" />
                  <span class="flex-1">{{ r[0] }}</span>
                  <span class="font-mono tabular-nums text-muted-foreground">{{ r[2] }}</span>
                  <StatusBadge :level="(r[1] as any)" size="sm" dot :label="r[1]" />
                </div>
              </div>
              <!-- map -->
              <svg v-else-if="p.graphic === 'map'" viewBox="0 0 320 170" class="h-[150px] w-full">
                <rect width="320" height="170" rx="8" fill="color-mix(in oklab, var(--foreground) 4%, transparent)" />
                <path d="M30 140 C 90 110, 110 70, 180 60 S 280 30, 300 24" fill="none" stroke="var(--foreground)" stroke-width="2" stroke-dasharray="2 6" opacity="0.8" />
                <g v-for="(pt, j) in [[30,140],[110,90],[180,60],[300,24]]" :key="j"><circle :cx="pt[0]" :cy="pt[1]" r="4" fill="var(--foreground)" /></g>
                <circle cx="180" cy="60" r="9" fill="none" stroke="var(--foreground)" stroke-width="1.5" />
              </svg>
              <!-- vitals -->
              <div v-else-if="p.graphic === 'vitals'" class="space-y-3 py-1">
                <div v-for="v in [['CPU',31],['Memory',52],['Storage',38]]" :key="v[0]">
                  <div class="mb-1 flex justify-between text-[11px]"><span class="text-muted-foreground">{{ v[0] }}</span><span class="font-mono tabular-nums">{{ v[1] }}%</span></div>
                  <Progress :value="(v[1] as number)" level="nominal" class="h-1.5" />
                </div>
              </div>
              <!-- board -->
              <svg v-else viewBox="0 0 320 160" class="h-[150px] w-full">
                <rect x="70" y="36" width="180" height="100" rx="10" fill="color-mix(in oklab, var(--foreground) 8%, var(--card))" stroke="color-mix(in oklab, var(--foreground) 20%, transparent)" />
                <rect x="120" y="66" width="80" height="44" rx="6" fill="color-mix(in oklab, var(--foreground) 14%, transparent)" />
                <g stroke="color-mix(in oklab, var(--foreground) 30%, transparent)" stroke-width="2">
                  <line v-for="n in 8" :key="'t'+n" :x1="70 + n*20" y1="36" :x2="70 + n*20" y2="22" />
                  <line v-for="n in 8" :key="'b'+n" :x1="70 + n*20" y1="136" :x2="70 + n*20" y2="150" />
                </g>
                <text x="160" y="92" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" fill="var(--foreground)">SKYNODE</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-border/60">
      <div class="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 class="text-3xl font-semibold tracking-tight lg:text-4xl">See the whole platform in action</h2>
        <p class="mx-auto mt-3 max-w-lg text-[16px] text-muted-foreground">Book a walkthrough with our team, tailored to your fleet and missions.</p>
        <div class="mt-7 flex justify-center gap-3">
          <Button size="lg" class="gap-2">Request a demo <Icon name="arrow-right" size="xs" /></Button>
        </div>
      </div>
    </section>
  </div>
</template>
