<script setup lang="ts">
import { Button, Badge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const capabilities = [
  { icon: 'lock', name: 'Contested environments', blurb: 'Operate through GPS denial, jamming and lost links with on-board autonomy and resilient mesh datalinks.' },
  { icon: 'drone', name: 'On-device AI', blurb: 'Detection, tracking and re-identification run at the edge — no cloud dependency in the field.' },
  { icon: 'bars', name: 'Secure datalink', blurb: 'End-to-end encrypted C2 and video, with spectrum agility and anti-tamper key management.' },
  { icon: 'circle-check', name: 'NDAA & Blue UAS', blurb: 'Trusted supply chain and compliant hardware, cleared for government and allied operations.' },
] as const;
const stats = [
  { value: '30+', label: 'Allied nations' },
  { value: '24/7', label: 'Mission readiness' },
  { value: 'AES-256', label: 'Link encryption' },
  { value: '0', label: 'Cloud required' },
];
</script>

<template>
  <div>
    <WebHero
      eyebrow="Defense & national security"
      title="Autonomy for the modern battlespace"
      subtitle="A hardened, open software core for uncrewed systems — built to operate where connectivity is contested and the mission cannot fail."
      primary="Request a briefing"
      secondary="Download capability brief"
    />

    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid gap-4 sm:grid-cols-2">
        <div v-for="c in capabilities" :key="c.name" class="rounded-2xl border border-border bg-card p-6">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary"><Icon :name="c.icon" size="md" /></div>
          <h3 class="mt-4 text-[17px] font-semibold">{{ c.name }}</h3>
          <p class="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{{ c.blurb }}</p>
        </div>
      </div>
    </section>

    <!-- deployment map -->
    <section class="border-y border-border/60 bg-card/40">
      <div class="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Badge variant="secondary" size="sm">Deployed worldwide</Badge>
          <h2 class="mt-3 text-3xl font-semibold tracking-tight">Trusted by allied forces</h2>
          <p class="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            From reconnaissance to force protection, Auterion-powered platforms are in service across
            land, sea and air — interoperable with the systems units already rely on.
          </p>
          <Button variant="secondary" size="md" class="mt-6 gap-2">Partner programs <Icon name="arrow-right" size="xs" /></Button>
        </div>
        <div class="relative overflow-hidden rounded-2xl border border-border bg-card p-1.5">
          <div class="def-map relative h-80 w-full overflow-hidden rounded-xl">
            <svg viewBox="0 0 560 320" class="absolute inset-0 h-full w-full" aria-hidden="true">
              <g fill="none" stroke="color-mix(in oklab, var(--foreground) 12%, transparent)" stroke-width="1">
                <path d="M0 70 H560 M0 140 H560 M0 210 H560 M0 280 H560 M140 0 V320 M280 0 V320 M420 0 V320" />
              </g>
              <g v-for="(p, i) in [[90,210],[200,120],[300,180],[360,90],[470,150],[150,260]]" :key="i">
                <circle :cx="p[0]" :cy="p[1]" r="4" fill="var(--foreground)" />
                <circle :cx="p[0]" :cy="p[1]" r="12" fill="none" stroke="var(--foreground)" stroke-width="1" opacity="0.35" />
              </g>
              <path d="M90 210 L200 120 L300 180 L360 90 L470 150" fill="none" stroke="var(--foreground)" stroke-width="1.5" stroke-dasharray="2 6" opacity="0.6" />
            </svg>
            <span class="absolute bottom-3 left-3 rounded-md border border-border bg-card/80 px-2 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur">6 theaters · classified detail withheld</span>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-border/60">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 lg:grid-cols-4">
        <div v-for="s in stats" :key="s.label">
          <p class="text-3xl font-semibold tracking-tight tabular-nums lg:text-4xl">{{ s.value }}</p>
          <p class="mt-1 text-[14px] text-muted-foreground">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-20 text-center">
      <h2 class="text-3xl font-semibold tracking-tight lg:text-4xl">Bring autonomy to your force</h2>
      <p class="mx-auto mt-3 max-w-lg text-[16px] text-muted-foreground">Speak with our defense team about integration, compliance and field trials.</p>
      <div class="mt-7 flex justify-center gap-3">
        <Button size="lg" class="gap-2">Request a briefing <Icon name="arrow-right" size="xs" /></Button>
        <Button variant="secondary" size="lg">Contact defense sales</Button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.def-map { background: linear-gradient(160deg, color-mix(in oklab, var(--foreground) 6%, var(--card)), var(--card)); }
</style>
