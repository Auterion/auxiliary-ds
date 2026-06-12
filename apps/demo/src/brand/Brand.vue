<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Button, Badge, StatusBadge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Sparkline from '../suite/Sparkline.vue';

type Direction = 'mono' | 'blue';
type Background = 'neutral' | 'cadet';

const dir = ref<Direction>('blue');
const bg = ref<Background>('neutral');
const theme = ref<'dark' | 'light'>('light');
watch(theme, t => { if (t === 'light') bg.value = 'neutral'; });

const BLUE = 'var(--color-primitive-auterion-blue-700)';
const BLUE_FG = 'var(--color-primitive-white)';

const accentStyle = computed(() => {
  if (dir.value === 'blue')  return `--brand: ${BLUE};  --brand-foreground: ${BLUE_FG};  --ring: ${BLUE};`;
  return '';
});

// Space Cadet — deep indigo-navy brand ground.
// cadet scale: see color.primitive.cadet in tailwind-palette.tokens.json
const bgStyle = computed(() => {
  if (bg.value !== 'cadet') return '';
  return [
    '--background: var(--color-primitive-ink-950)',                  // oklch(0.139 0.014 265) ≈ #06090f
    '--card: var(--color-primitive-ink-900)',                        // oklch(0.210 0.018 265) ≈ #141821
    '--card-foreground: var(--color-primitive-auterion-blue-50)',    // oklch(0.970 0.013 264) ≈ #f1f5fe
    '--popover: var(--color-primitive-ink-900)',
    '--popover-foreground: var(--color-primitive-auterion-blue-50)',
    '--secondary: var(--color-primitive-ink-800)',                   // oklch(0.274 0.022 265) ≈ #222732
    '--secondary-foreground: var(--color-primitive-auterion-blue-50)',
    '--muted: var(--color-primitive-ink-900)',
    '--muted-foreground: var(--color-primitive-cadet-600)',
    '--accent: var(--color-primitive-ink-800)',
    '--accent-foreground: var(--color-primitive-auterion-blue-50)',
    '--border: var(--color-primitive-ink-700)',                      // oklch(0.372 0.022 265) ≈ #3b404c
    '--input: var(--color-primitive-ink-700)',
  ].join('; ');
});

// Proposed Auterion palette from shared reference
const proposedPalette = [
  { name: 'Ultramarine', hex: '#1248DF', oklch: 'oklch(0.482 0.235 264)', fg: '#ffffff', role: 'Brand accent — auterion-blue.700 (semantic brand)' },
  { name: 'Space Cadet', hex: '#171744', oklch: 'oklch(0.18 0.08 264)', fg: '#ffffff', role: 'Dark ground' },
  { name: 'Night', hex: '#191C1C', oklch: 'oklch(0.17 0 0)', fg: '#ffffff', role: 'Near-black surface' },
  { name: 'Cadet Grey', hex: '#919A9B', oklch: 'oklch(0.63 0.01 200)', fg: '#ffffff', role: 'Neutral mid — cadet.500' },
  { name: 'Platinum', hex: '#D3DFE2', oklch: 'oklch(0.88 0.015 200)', fg: '#191C1C', role: 'Light surface — cadet.300' },
  { name: 'Seasalt', hex: '#F5F7F7', oklch: 'oklch(0.97 0.005 200)', fg: '#191C1C', role: 'Near-white — cadet.50' },
  { name: 'Azure', hex: '#E3F7FF', oklch: 'oklch(0.97 0.025 205)', fg: '#171744', role: 'Tinted light' },
  { name: 'Aquamarine', hex: '#3BE494', oklch: 'oklch(0.83 0.17 155)', fg: '#16352B', role: '? secondary / advisory conflict' },
];

const heroSpark = [8, 10, 9, 12, 14, 13, 16, 15, 18, 20, 19, 23, 26, 24, 28, 31];

const monoRamp = [
  { label: 'background', val: 'var(--background)', text: 'var(--foreground)' },
  { label: 'card', val: 'var(--card)', text: 'var(--card-foreground)' },
  { label: 'secondary', val: 'var(--secondary)', text: 'var(--secondary-foreground)' },
  { label: 'muted', val: 'var(--muted)', text: 'var(--muted-foreground)' },
  { label: 'border', val: 'var(--border)', text: 'var(--foreground)' },
  { label: 'foreground', val: 'var(--foreground)', text: 'var(--background)' },
];

const statusLevels = [
  { level: 'alarm' as const, label: 'Alarm' },
  { level: 'warning' as const, label: 'Warning' },
  { level: 'caution' as const, label: 'Caution' },
  { level: 'advisory' as const, label: 'Advisory' },
  { level: 'nominal' as const, label: 'Nominal' },
];

const typeScale = [
  { cls: 'text-10xl font-medium', label: 'Inter / 128 medium', sample: 'Auterion',                   font: 'sans' as const },
  { cls: 'text-8xl  font-medium', label: 'Inter / 80 medium',  sample: 'Autonomous Systems',         font: 'sans' as const },
  { cls: 'text-6xl  font-medium',   label: 'Inter / 60 medium',    sample: 'Pushing boundaries',         font: 'sans' as const },
  { cls: 'text-4xl  font-medium',   label: 'Inter / 40 medium',    sample: 'Mission-ready at scale',     font: 'sans' as const },
  { cls: 'text-3xl  font-normal',   label: 'Inter / 30 regular',   sample: 'Fleet operations & telemetry', font: 'sans' as const },
  { cls: 'text-2xl  font-normal',   label: 'Inter / 24 regular',   sample: 'One stack, from silicon to fleet', font: 'sans' as const },
  { cls: 'text-base',               label: 'Inter / 16 regular',      sample: 'Encrypted datalinks, on-device autonomy and a hardened OS — engineered to operate where connectivity is contested.', font: 'sans' as const },
  { cls: 'text-sm',                 label: 'Inter / 14 regular',      sample: 'The open software platform for autonomous vehicles. Build, deploy and command from the cloud.', font: 'sans' as const },
  { cls: 'text-xs font-medium',     label: 'Inter / 12 medium',       sample: 'AuterionOS 4.2 · Release notes · June 2026', font: 'sans' as const },
  { cls: 'text-xs font-mono',       label: 'Geist Mono / 12',         sample: 'TELEMETRY · RSSI −82 dBm · BATTERY 86% · ALT 124m', font: 'mono' as const },
];
</script>

<template>
  <div :data-theme="theme" class="brand-root min-h-dvh bg-background text-foreground" :style="[accentStyle, bgStyle].filter(Boolean).join('; ')">

    <!-- sticky header -->
    <header class="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6">
        <div class="flex items-center gap-3 shrink-0">
          <span class="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Brand</span>
          <span class="h-3 w-px bg-border" />
          <span class="font-mono text-[11px] text-muted-foreground">Auterion · 2026</span>
        </div>
        <div class="flex items-center gap-3">
          <!-- theme toggle -->
          <div class="flex items-center gap-0.5">
            <span class="mr-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60">Theme</span>
            <button
              v-for="t in (['dark','light'] as const)"
              :key="t"
              class="rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors"
              :class="theme === t ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
              @click="theme = t"
            >{{ t }}</button>
          </div>
          <span class="h-3 w-px bg-border/60" />
          <!-- background toggle -->
          <div class="flex items-center gap-0.5">
            <span class="mr-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60">Ground</span>
            <button
              v-for="b in ([{k:'neutral',l:'Neutral'},{k:'cadet',l:'Space Cadet'}] as const)"
              :key="b.k"
              class="rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors"
              :class="[bg === b.k ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground', theme === 'light' && b.k === 'cadet' ? 'opacity-30 pointer-events-none' : '']"
              @click="bg = b.k"
            >{{ b.l }}</button>
          </div>
          <span class="h-3 w-px bg-border/60" />
          <!-- accent direction switcher -->
          <div class="flex items-center gap-0.5">
            <span class="mr-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60">Accent</span>
            <button
              v-for="d in ([{k:'mono',l:'Mono'},{k:'blue',l:'Ultramarine'}] as const)"
              :key="d.k"
              class="rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors"
              :class="dir === d.k ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
              @click="dir = d.k"
            >{{ d.l }}</button>
          </div>
        </div>
      </div>
    </header>

    <!-- ── 00 BRAND STATEMENT ── -->
    <section class="brand-statement relative overflow-hidden border-b border-border/40 px-8 flex flex-col justify-end min-h-[72vh]">
      <!-- hairline grid -->
      <svg class="absolute inset-0 h-full w-full pointer-events-none" aria-hidden preserveAspectRatio="none">
        <defs>
          <pattern id="stmt-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="currentColor" stroke-width="0.4" class="text-border/30"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stmt-grid)"/>
        <!-- animated mission arc -->
        <path class="stmt-arc" d="M -40 520 C 120 420 280 300 520 200 S 900 80 1200 20"
          fill="none" :stroke="dir !== 'mono' ? 'var(--brand)' : 'var(--foreground)'"
          stroke-width="1" stroke-dasharray="4 10" opacity="0.35"/>
        <circle class="stmt-pulse" cx="520" cy="200" r="5"
          :fill="dir !== 'mono' ? 'var(--brand)' : 'var(--foreground)'" opacity="0.7"/>
        <circle cx="520" cy="200" r="18" fill="none"
          :stroke="dir !== 'mono' ? 'var(--brand)' : 'var(--foreground)'"
          stroke-width="0.8" opacity="0.2"/>
      </svg>

      <!-- brand mark — top right -->
      <div class="absolute top-10 right-10 flex h-16 w-16 items-center justify-center rounded-sm shrink-0"
        :style="`background: ${dir !== 'mono' ? 'var(--brand)' : 'var(--foreground)'}`">
        <Icon name="drone" size="md" :style="`color: ${dir !== 'mono' ? 'var(--brand-foreground)' : 'var(--background)'}`"/>
      </div>

      <!-- index stamp — top left -->
      <p class="absolute top-10 left-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
        Auterion · Brand identity · 2026
      </p>

      <!-- statement -->
      <div class="relative z-10 pb-16 max-w-4xl">
        <h1 class="stmt-h1">
          Precision design<br>for autonomous<br>systems
        </h1>
        <!-- stat strip -->
        <div class="mt-10 flex items-end gap-10 border-t border-border/30 pt-6">
          <div v-for="s in [['2,000,000+','Flight hours'],['10,000+','Vehicles deployed'],['60+','Nations']]" :key="s[0]">
            <p class="font-mono text-2xl font-semibold tabular-nums leading-none"
              :style="dir !== 'mono' ? 'color: var(--brand)' : ''">{{ s[0] }}</p>
            <p class="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{{ s[1] }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-5xl px-6 py-16 space-y-20">

      <!-- ── 01 IDENTITY ── -->
      <section>
        <p class="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">01 — Identity</p>
        <h2 class="mt-2 section-h2 text-[2rem] font-medium">Color system</h2>
        <p class="mt-2 text-[14px] text-muted-foreground max-w-xl">
          The palette is a signal vocabulary, not a mood palette. Ground → Surface → Content → Accent. Status colors are reserved for operational severity.
        </p>

        <!-- mono ramp -->
        <div class="mt-8 grid grid-cols-6 overflow-hidden rounded-sm border border-border">
          <div
            v-for="s in monoRamp" :key="s.label"
            class="flex flex-col justify-end p-3 aspect-square"
            :style="`background: ${s.val}; color: ${s.text};`"
          >
            <span class="font-mono text-[10px] font-medium uppercase tracking-wide opacity-70">{{ s.label }}</span>
          </div>
        </div>

        <!-- brand accent -->
        <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Brand accent</p>
            <div class="flex h-20 items-center justify-center rounded-sm" style="background: var(--brand)">
              <span class="font-mono text-[11px] font-medium uppercase tracking-wide" style="color: var(--brand-foreground)">
                {{ dir === 'blue' ? 'Ultramarine' : 'mono.50' }}
              </span>
            </div>
          </div>
          <div>
            <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-2">On brand</p>
            <div class="flex h-20 items-center justify-center rounded-sm" style="background: var(--brand-foreground)">
              <span class="font-mono text-[11px] font-medium uppercase tracking-wide" style="color: var(--brand)">
                white
              </span>
            </div>
          </div>
          <div class="sm:col-span-2">
            <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Status ladder (fixed — never decorative)</p>
            <div class="flex h-20 gap-px overflow-hidden rounded-sm">
              <div v-for="s in statusLevels" :key="s.level" class="flex flex-1 items-end p-1.5" :style="`background: var(--${s.level})`">
                <span class="font-mono text-[9px] font-medium uppercase tracking-wide" :style="`color: var(--${s.level}-foreground)`">{{ s.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- proposed palette (blue direction only) -->
        <div v-if="dir === 'blue'" class="mt-8">
          <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-3">Proposed Auterion palette</p>
          <div class="grid grid-cols-4 gap-2 sm:grid-cols-8">
            <div v-for="c in proposedPalette" :key="c.name" class="group relative">
              <div class="h-16 rounded-sm flex flex-col justify-end p-2 overflow-hidden"
                :style="`background: ${c.hex}; color: ${c.fg};`"
                :class="c.name === 'Aquamarine' ? 'ring-1 ring-yellow-400/60 ring-inset' : ''">
                <span class="font-mono text-[9px] font-medium opacity-80 leading-tight">{{ c.hex }}</span>
              </div>
              <p class="mt-1 font-mono text-[9px] text-muted-foreground leading-tight">{{ c.name }}</p>
              <p class="font-mono text-[8px] text-muted-foreground/50 leading-tight">{{ c.role }}</p>
            </div>
          </div>
          <!-- Space Cadet dark surface preview -->
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div class="rounded-sm overflow-hidden border border-border">
              <div class="px-3 py-1.5 bg-card border-b border-border">
                <span class="font-mono text-[10px] text-muted-foreground">Dark ground: Space Cadet #171744</span>
              </div>
              <div class="p-6 flex items-center justify-between" style="background: var(--color-primitive-ink-950);">
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-[0.12em] mb-2" :style="`color: ${BLUE}`">Auterion · 2026</p>
                  <p class="font-mono text-[22px] font-medium leading-tight text-white">The operating system<br>for autonomous robotics</p>
                </div>
                <div class="flex h-16 w-16 items-center justify-center rounded-sm shrink-0" :style="`background: ${BLUE}`">
                  <Icon name="drone" size="md" style="color: white"/>
                </div>
              </div>
            </div>
            <div class="rounded-sm overflow-hidden border border-border">
              <div class="px-3 py-1.5 bg-card border-b border-border">
                <span class="font-mono text-[10px] text-muted-foreground">Dark ground: mono.950 (current)</span>
              </div>
              <div class="p-6 flex items-center justify-between bg-background">
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-[0.12em] mb-2" :style="`color: ${BLUE}`">Auterion · 2026</p>
                  <p class="font-mono text-[22px] font-medium leading-tight">The operating system<br>for autonomous robotics</p>
                </div>
                <div class="flex h-16 w-16 items-center justify-center rounded-sm shrink-0" :style="`background: ${BLUE}`">
                  <Icon name="drone" size="md" style="color: white"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 02 TYPOGRAPHY ── -->
      <section>
        <p class="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">02 — Typography</p>
        <h2 class="mt-2 section-h2 text-[2rem] font-medium">Type scale</h2>
        <p class="mt-2 text-[14px] text-muted-foreground max-w-xl">
          Inter Variable throughout — display, headings, and body. Geist Mono reserved for telemetry data and code.
        </p>

        <div class="mt-8 divide-y divide-border/60 border-y border-border/60">
          <div v-for="t in typeScale" :key="t.label" class="grid grid-cols-[200px_1fr] gap-4 py-5 items-baseline">
            <span class="font-mono text-[11px] text-muted-foreground self-start pt-1">{{ t.label }}</span>
            <span :class="[t.cls, t.font === 'mono' ? 'font-mono' : '']">{{ t.sample }}</span>
          </div>
        </div>
      </section>

      <!-- ── 03 COMPONENTS ── -->
      <section>
        <p class="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">03 — Components</p>
        <h2 class="mt-2 section-h2 text-[2rem] font-medium">Interactive elements</h2>
        <p class="mt-2 text-[14px] text-muted-foreground max-w-xl">
          Brand accent surfaces in interactive controls — buttons, active states, focus rings. Geist Mono reserved for telemetry and data labels.
        </p>

        <div class="mt-8 grid gap-6 sm:grid-cols-2">
          <!-- buttons -->
          <div class="rounded-sm border border-border bg-card p-6 space-y-4">
            <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Buttons</p>
            <div class="flex flex-wrap gap-3">
              <Button size="md">Get started</Button>
              <Button variant="secondary" size="md">Learn more</Button>
              <Button variant="secondary" size="md">Documentation</Button>
              <Button variant="ghost" size="md">Sign in</Button>
            </div>
            <div class="flex flex-wrap gap-3">
              <Button size="sm">Request briefing</Button>
              <Button variant="secondary" size="sm">Watch demo</Button>
            </div>
          </div>

          <!-- badges + status -->
          <div class="rounded-sm border border-border bg-card p-6 space-y-4">
            <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Status badges</p>
            <div class="flex flex-wrap gap-2">
              <StatusBadge v-for="s in statusLevels" :key="s.level" :level="s.level" size="sm">{{ s.label }}</StatusBadge>
            </div>
            <div class="flex flex-wrap gap-2">
              <StatusBadge v-for="s in statusLevels" :key="s.level" :level="s.level" size="sm" dot>{{ s.label }}</StatusBadge>
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge>Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          <!-- product card -->
          <div class="rounded-sm border border-border bg-card p-6 space-y-3">
            <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Product card</p>
            <div class="rounded-sm border border-border bg-background p-5 text-left">
              <div class="flex h-9 w-9 items-center justify-center border border-border/60">
                <Icon name="drone" size="sm" class="text-muted-foreground" />
              </div>
              <h3 class="mt-4 font-mono text-[17px] font-medium">Mission Control</h3>
              <p class="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">Field-proven ground control. Map, gimbal and mission, on any tablet.</p>
              <div class="mt-4 flex items-center gap-1.5 font-mono text-[13px] font-medium" style="color: var(--brand)">
                Learn more <Icon name="arrow-right" size="xs" />
              </div>
            </div>
          </div>

          <!-- stat strip -->
          <div class="rounded-sm border border-border bg-card p-6 space-y-3">
            <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Stats</p>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="s in [['2M+','Flight hours'],['10k+','Vehicles deployed'],['60+','Countries'],['99.9%','Fleet uptime']]" :key="s[0]">
                <p class="font-mono text-3xl font-medium tabular-nums" :style="dir !== 'mono' ? `color: var(--brand)` : ''">{{ s[0] }}</p>
                <p class="mt-0.5 font-mono text-[12px] text-muted-foreground">{{ s[1] }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 04 HERO DIRECTIONS ── -->
      <section>
        <p class="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">04 — Hero</p>
        <h2 class="mt-2 section-h2 text-[2rem] font-medium">Above the fold</h2>
        <p class="mt-2 text-[14px] text-muted-foreground max-w-xl">
          Two structural directions for the hero section. Toggle the accent above to see color impact on each.
        </p>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <!-- Hero A: Editorial / Statement -->
          <div class="rounded-sm border border-border overflow-hidden">
            <div class="border-b border-border px-4 py-2.5 bg-card flex items-center justify-between">
              <span class="font-mono text-[11px] text-muted-foreground">Direction A — Statement</span>
              <span class="font-mono text-[10px] text-muted-foreground/60">Type-forward · No widget</span>
            </div>
            <div class="hero-grid p-8 relative min-h-64">
              <div class="relative z-10 max-w-lg">
                <p class="font-mono text-[10px] font-medium uppercase tracking-[0.18em]" :style="dir !== 'mono' ? 'color: var(--brand)' : 'color: var(--muted-foreground)'">Auterion · 2026</p>
                <h1 class="mt-4 hero-h1 text-4xl font-medium leading-[1.0]">
                  The operating<br>system for<br>autonomous<br>robotics
                </h1>
                <p class="mt-5 text-[14px] leading-relaxed text-muted-foreground max-w-sm">
                  One platform from flight controller to fleet — built for the mission, proven at the edge.
                </p>
                <div class="mt-6 flex gap-3">
                  <Button size="md">Get started</Button>
                  <Button variant="secondary" size="md">Watch demo</Button>
                </div>
              </div>
              <!-- telemetry strip decoration -->
              <div class="absolute bottom-4 right-4 font-mono text-[10px] text-muted-foreground/40 text-right space-y-0.5">
                <p>FLEET · GLOBAL</p>
                <p>8 ACTIVE · 2 IN FLIGHT</p>
                <p>LINK NOMINAL · 12ms</p>
              </div>
            </div>
          </div>

          <!-- Hero B: Data + Statement -->
          <div class="rounded-sm border border-border overflow-hidden">
            <div class="border-b border-border px-4 py-2.5 bg-card flex items-center justify-between">
              <span class="font-mono text-[11px] text-muted-foreground">Direction B — Data + Statement</span>
              <span class="font-mono text-[10px] text-muted-foreground/60">Two-column · Live data right</span>
            </div>
            <div class="p-6 grid grid-cols-[1fr_200px] gap-6 items-center min-h-64">
              <div>
                <p class="font-mono text-[10px] font-medium uppercase tracking-[0.18em]" :style="dir !== 'mono' ? 'color: var(--brand)' : 'color: var(--muted-foreground)'">Auterion · 2026</p>
                <h1 class="mt-3 hero-h1 text-3xl font-medium leading-[1.02]">The operating system for autonomous robotics</h1>
                <div class="mt-4 flex gap-2">
                  <Button size="sm">Get started</Button>
                  <Button variant="secondary" size="sm">Watch demo</Button>
                </div>
              </div>
              <!-- live widget -->
              <div class="rounded-sm border border-border bg-card text-[11px]">
                <div class="flex items-center gap-1.5 border-b border-border px-3 py-2">
                  <span class="h-1.5 w-1.5 rounded-full" :style="dir !== 'mono' ? 'background: var(--brand)' : 'background: var(--nominal)'" />
                  <span class="font-mono text-muted-foreground">Fleet · Live</span>
                </div>
                <div class="p-3 space-y-2">
                  <div>
                    <p class="font-mono text-muted-foreground text-[10px]">Flights · 30d</p>
                    <p class="font-mono text-xl font-medium tabular-nums">695</p>
                    <div class="mt-1 h-7" :style="dir !== 'mono' ? 'color: var(--brand)' : 'color: var(--foreground)'">
                      <Sparkline :data="heroSpark" :height="28" />
                    </div>
                  </div>
                  <div v-for="r in [['Skyhook-01','nominal'],['Falcon-02','advisory'],['Raven-03','warning']]" :key="r[0]"
                    class="flex items-center gap-2 border-t border-border/40 pt-1.5">
                    <Icon name="drone" size="xs" class="text-muted-foreground" />
                    <span class="font-mono flex-1 text-[10px]">{{ r[0] }}</span>
                    <StatusBadge :level="(r[1] as any)" size="sm" dot />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero D: Light theme (blue direction only) -->
          <div v-if="dir === 'blue'" class="lg:col-span-2 rounded-sm border border-border overflow-hidden">
            <div class="border-b border-border px-4 py-2.5 bg-card flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] text-muted-foreground">Hero D — Light theme</span>
                <span class="rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]" style="background: var(--color-primitive-auterion-blue-700); color: white;">Blue direction</span>
              </div>
              <span class="font-mono text-[10px] text-muted-foreground/60">White ground · Blue CTA · Fleet data right</span>
            </div>
            <div data-theme="light" class="relative bg-background text-foreground overflow-hidden" style="--brand: var(--color-primitive-auterion-blue-700); --brand-foreground: white; --ring: var(--color-primitive-auterion-blue-600);">
              <!-- hairline grid, right half only -->
              <svg class="absolute right-0 top-0 h-full w-1/2 pointer-events-none" aria-hidden preserveAspectRatio="none">
                <defs>
                  <pattern id="light-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                    <path d="M 48 0 L 0 0 0 48" fill="none" stroke="oklch(0.88 0 0)" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#light-grid)"/>
                <!-- mission trace -->
                <path d="M 20 240 C 80 190 120 150 200 110 S 340 60 420 20" fill="none" stroke="var(--color-primitive-auterion-blue-700)" stroke-width="1.5" stroke-dasharray="3 9" opacity="0.4"/>
                <circle cx="200" cy="110" r="4" fill="var(--color-primitive-auterion-blue-700)" opacity="0.7"/>
                <circle cx="200" cy="110" r="14" fill="none" stroke="var(--color-primitive-auterion-blue-700)" stroke-width="1" opacity="0.25"/>
                <text x="218" y="106" font-family="monospace" font-size="9" fill="oklch(0.65 0 0)">47°22'N 8°32'E / ALT 128m</text>
              </svg>

              <div class="relative z-10 grid grid-cols-[3fr_2fr] gap-0 items-stretch min-h-80">
                <!-- left: headline -->
                <div class="p-10 flex flex-col justify-center">
                  <p class="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-6">01</p>
                  <h1 class="font-sans text-[52px] font-medium leading-[0.93] tracking-[-0.025em]">
                    The operating<br>system for<br>autonomous<br>robotics
                  </h1>
                  <p class="mt-5 text-[15px] leading-relaxed text-muted-foreground max-w-sm">
                    One platform to build, deploy and command intelligent drones at scale.
                  </p>
                  <div class="mt-8 flex items-center gap-4">
                    <Button size="sm">Get started <Icon name="arrow-right" size="xs"/></Button>
                    <Button variant="secondary" size="sm">Watch the demo</Button>
                  </div>
                </div>
                <!-- right: fleet status -->
                <div class="border-l border-border/40 p-8 flex flex-col justify-center gap-1 font-mono text-[11px]">
                  <div class="flex items-center justify-between pb-2 mb-1 border-b border-border/30">
                    <span class="uppercase tracking-[0.1em] text-[9px] text-muted-foreground">Fleet · Live</span>
                    <span class="h-1.5 w-1.5 rounded-full" style="background: var(--color-primitive-auterion-blue-700);"/>
                  </div>
                  <div v-for="r in [['Skyhook-01','nominal','86%'],['Falcon-02','advisory','64%'],['Raven-03','warning','18%'],['Osprey-05','nominal','92%']]"
                    :key="r[0]" class="flex items-center gap-2 py-1.5 border-b border-border/20">
                    <Icon name="drone" size="xs" class="text-muted-foreground"/>
                    <span class="flex-1 text-foreground">{{ r[0] }}</span>
                    <span class="tabular-nums text-muted-foreground">{{ r[2] }}</span>
                    <StatusBadge :level="(r[1] as any)" size="sm" dot/>
                  </div>
                  <p class="mt-2 font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest">LINK NOMINAL · 12ms / SYS v4.2.1</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero C: Mission canvas -->
          <div class="lg:col-span-2 rounded-sm border border-border overflow-hidden">
            <div class="border-b border-border px-4 py-2.5 bg-card flex items-center justify-between">
              <span class="font-mono text-[11px] text-muted-foreground">Direction C — Mission canvas</span>
              <span class="font-mono text-[10px] text-muted-foreground/60">Full-width · Operational data layer</span>
            </div>
            <div class="relative mission-bg min-h-72 overflow-hidden">
              <!-- grid lines -->
              <svg class="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
                <defs>
                  <pattern id="brand-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.5" class="text-border/40"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#brand-grid)" />
                <!-- mission path — animated trace -->
                <path class="mission-trace" d="M 60 200 C 160 160, 200 100, 340 80 S 560 40, 640 28" fill="none"
                  stroke="var(--brand)"
                  stroke-width="1.5" stroke-dasharray="3 7" opacity="0.8" />
                <!-- waypoints -->
                <g v-for="(p, i) in [[60,200],[200,130],[340,80],[640,28]]" :key="i">
                  <circle :cx="p[0]" :cy="p[1]" r="3"
                    :fill="i === 2 ? 'var(--brand)' : 'transparent'"
                    stroke="var(--brand)"
                    stroke-width="1.5" />
                  <circle v-if="i === 2" :cx="p[0]" :cy="p[1]" r="12" fill="none"
                    stroke="var(--brand)"
                    stroke-width="1" opacity="0.4" />
                </g>
              </svg>

              <!-- content -->
              <div class="relative z-10 p-8 grid grid-cols-[1fr_auto] items-end h-72">
                <div class="self-center max-w-lg">
                  <p class="font-mono text-[10px] font-medium uppercase tracking-[0.18em]"
                    :style="dir !== 'mono' ? 'color: var(--brand)' : 'color: var(--muted-foreground)'">
                    Operational truth, expressed with precision
                  </p>
                  <h1 class="mt-3 hero-h1 text-[42px] font-medium leading-[1.0]">
                    The operating system<br>for autonomous robotics
                  </h1>
                  <div class="mt-6 flex gap-3">
                    <Button size="md">Get started</Button>
                    <Button variant="secondary" size="md">Watch demo</Button>
                  </div>
                </div>
                <!-- operational HUD strip -->
                <div class="self-end pb-1 text-right space-y-1">
                  <p class="font-mono text-[10px] text-muted-foreground/60">FLEET · GLOBAL</p>
                  <p class="font-mono text-[10px]" :style="dir !== 'mono' ? 'color: var(--brand)' : 'color: var(--foreground)'">
                    2,000,000+ FLIGHT HRS
                  </p>
                  <p class="font-mono text-[10px] text-muted-foreground/60">10,000+ VEHICLES · 60 NATIONS</p>
                  <p class="font-mono text-[10px] text-muted-foreground/40">LINK NOMINAL · UTC 14:22:09</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 05 DIRECTION SUMMARY ── -->
      <section class="border-t border-border/60 pt-12">
        <p class="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">05 — Direction summary</p>
        <p class="mt-2 text-[13px] text-muted-foreground">
          Combine the Ground toggle (Neutral / Space Cadet) with each accent to compare all combinations.
          <span v-if="bg === 'cadet' && dir === 'blue'" class="ml-2 px-1.5 py-0.5 rounded-sm font-mono text-[10px] uppercase tracking-[0.1em]" style="background: var(--brand); color: var(--brand-foreground)">Live: Space Cadet + Ultramarine</span>
        </p>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="border p-5 space-y-2"
            :class="dir === 'mono' ? 'border-foreground bg-card' : 'border-border bg-card/40'">
            <p class="font-mono text-[12px] font-medium uppercase tracking-[0.1em]"
              :class="dir === 'mono' ? 'text-foreground' : 'text-muted-foreground'">
              A — Mono
            </p>
            <p class="text-[13px] leading-relaxed text-muted-foreground">Fully monochromatic. Maximum discipline. No one in autonomous systems owns this. Reads as extremely precise and intentional. Status colors are the only chromatic elements.</p>
            <ul class="space-y-1 mt-3">
              <li v-for="s in ['Uniquely owned — no competitors here','Strongest possible discipline signal','Ties marketing to the product register']" :key="s"
                class="flex items-start gap-2 text-[13px] text-muted-foreground">
                <span class="mt-0.5">+</span> {{ s }}
              </li>
              <li v-for="s in ['Zero warmth — may read cold to non-technical audiences','Harder to drive CTAs without a second color']" :key="s"
                class="flex items-start gap-2 text-[13px] text-muted-foreground/50">
                <span class="mt-0.5">−</span> {{ s }}
              </li>
            </ul>
          </div>
          <div class="border p-5 space-y-2"
            :class="dir === 'blue' ? 'border-foreground bg-card' : 'border-border bg-card/40'">
            <p class="font-mono text-[12px] font-medium uppercase tracking-[0.1em]"
              :class="dir === 'blue' ? 'text-foreground' : 'text-muted-foreground'">
              B — Ultramarine
            </p>
            <p class="text-[13px] leading-relaxed text-muted-foreground">Electric indigo-blue from the auterion-blue token scale. Not IBM blue — bolder, more saturated. On Space Cadet ground it reads as a harmonic continuation of the same hue family. Best combination: Space Cadet + Ultramarine.</p>
            <ul class="space-y-1 mt-3">
              <li v-for="s in ['Works on light and dark','Highest CTA contrast — unambiguous','Distinct from Anduril/Helsing — not SaaS-standard blue','Space Cadet ground amplifies it: same hue family']" :key="s"
                class="flex items-start gap-2 text-[13px] text-muted-foreground">
                <span class="mt-0.5">+</span> {{ s }}
              </li>
              <li v-for="s in ['Advisory cyan must stay distinct (H185 vs H265 — they are)','Discipline required: brand touches ≤4 elements per section']" :key="s"
                class="flex items-start gap-2 text-[13px] text-muted-foreground/50">
                <span class="mt-0.5">−</span> {{ s }}
              </li>
            </ul>
          </div>
        </div>

        <!-- ground + accent recommendation -->
        <div class="mt-6 border border-border p-5 space-y-2">
          <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Director recommendation</p>
          <p class="text-[14px] leading-relaxed">
            <span class="font-medium">Space Cadet + Ultramarine.</span>
            <span class="text-muted-foreground ml-2">The navy ground gives Auterion something no aerospace peer has — a background with character, not just darkness. The electric blue accent is decisive and legible. Together they read as precision + confidence: Swiss engineering for the autonomous era.</span>
          </p>
          <p class="mt-2 text-[13px] text-muted-foreground">
            Anduril → near-black + warm orange. Helsing → near-black + white. Auterion → Space Cadet navy + Ultramarine blue. Distinct from all of them.
          </p>
        </div>
      </section>

      <!-- ── 06 VOICE ── -->
      <section class="border-t border-border/60 pt-12">
        <p class="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">06 — Voice</p>
        <h2 class="mt-2 section-h2 text-[2rem] font-medium">In use</h2>
        <p class="mt-2 text-[14px] text-muted-foreground max-w-xl">
          The system speaking for itself — type, color, and data working together.
        </p>

        <!-- editorial two-col -->
        <div class="mt-10 grid lg:grid-cols-[3fr_2fr] overflow-hidden border border-border/40 rounded-sm">
          <!-- pull quote + body copy -->
          <div class="p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/40">
            <div>
              <p class="editorial-quote">
                The autonomous era demands design that operates at mission speed.
              </p>
              <p class="mt-6 text-[15px] leading-[1.65] text-muted-foreground max-w-lg">
                Every surface in Auterion's stack appears in contested environments — where a moment of confusion costs a mission. The design system isn't furniture. It's operational infrastructure.
              </p>
            </div>
            <div class="mt-10 flex items-center gap-3">
              <span class="h-px w-8 shrink-0" :style="dir !== 'mono' ? 'background: var(--brand)' : 'background: var(--foreground)'"/>
              <span class="font-mono text-[11px] text-muted-foreground">Auterion Design Principles · 2026</span>
            </div>
          </div>

          <!-- live data panel -->
          <div class="bg-card p-8 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-5">
                <p class="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Fleet · Live</p>
                <span class="h-1.5 w-1.5 rounded-full animate-pulse"
                  :style="dir !== 'mono' ? 'background: var(--brand)' : 'background: var(--nominal)'"/>
              </div>
              <div
                v-for="r in [['Skyhook-01','nominal','86%','ALT 408m'],['Falcon-02','advisory','64%','ALT 122m'],['Raven-03','warning','18%','RETURNING'],['Osprey-05','nominal','92%','ALT 312m']]"
                :key="r[0]"
                class="flex items-center gap-3 py-3 border-b border-border/20 last:border-0 font-mono text-[11px]"
              >
                <Icon name="drone" size="xs" class="text-muted-foreground shrink-0"/>
                <span class="flex-1">{{ r[0] }}</span>
                <span class="tabular-nums text-muted-foreground/60 text-[10px] hidden sm:block">{{ r[3] }}</span>
                <span class="tabular-nums text-muted-foreground text-[10px]">{{ r[2] }}</span>
                <StatusBadge :level="(r[1] as any)" size="sm" dot/>
              </div>
            </div>
            <p class="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/30 mt-5">
              SYS NOMINAL · UTC 14:22:09 · v4.2.1
            </p>
          </div>
        </div>

        <!-- second moment: large quote -->
        <div class="mt-6 relative overflow-hidden rounded-sm border border-border/40 p-10 lg:p-14"
          :style="dir === 'blue' ? 'background: var(--color-primitive-auterion-blue-700)' : ''">
          <p class="relative z-10 max-w-3xl"
            :style="dir === 'blue' ? 'color: var(--color-primitive-white); opacity: 0.9' : ''"
            style="font-family: 'Inter Variable', Inter, system-ui; font-variation-settings: 'opsz' 32; font-size: clamp(1.25rem, 2.5vw, 1.875rem); font-weight: 500; line-height: 1.3; letter-spacing: -0.025em;">
            "From AuterionOS on the flight controller to Mission Control on the tablet, one token set, one type ramp, one truth."
          </p>
          <p class="mt-6 font-mono text-[11px]"
            :style="dir === 'blue' ? 'color: var(--color-primitive-white); opacity: 0.5' : ''"
            :class="dir !== 'blue' ? 'text-muted-foreground' : ''">
            — Design principle #1: code is the source of truth
          </p>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.hero-h1 {
  font-family: 'Inter Variable', Inter, system-ui, sans-serif;
  font-variation-settings: 'opsz' 36;
  letter-spacing: -0.025em;
}

.section-h2 {
  font-family: 'Inter Variable', Inter, system-ui, sans-serif;
  font-variation-settings: 'opsz' 28;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.brand-root {
  background-image: radial-gradient(
    color-mix(in oklab, var(--foreground) 3%, transparent) 1px,
    transparent 1px
  );
  background-size: 28px 28px;
}
.hero-grid {
  background: radial-gradient(60% 80% at 80% 20%, color-mix(in oklab, var(--foreground) 5%, transparent), transparent 70%);
}
.mission-bg {
  background: linear-gradient(
    160deg,
    color-mix(in oklab, var(--foreground) 4%, var(--background)),
    var(--background)
  );
}

/* ── Brand statement hero ── */
.brand-statement {
  background-image: radial-gradient(
    color-mix(in oklab, var(--foreground) 2%, transparent) 1px,
    transparent 1px
  );
  background-size: 28px 28px;
}

.stmt-h1 {
  font-family: 'Inter Variable', Inter, system-ui, sans-serif;
  font-variation-settings: 'opsz' 48;
  font-size: clamp(3rem, 7.5vw, 6rem);
  font-weight: 500;
  line-height: 0.93;
  letter-spacing: -0.04em;
}

.stmt-arc {
  stroke-dashoffset: 800;
  animation: trace-arc 2.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
}

.stmt-pulse {
  opacity: 0;
  animation: fade-in 0.4s ease 2.4s forwards;
}

@keyframes trace-arc {
  to { stroke-dashoffset: 0; }
}

@keyframes fade-in {
  to { opacity: 0.7; }
}

/* ── Mission canvas trace ── */
.mission-trace {
  stroke-dashoffset: 500;
  animation: trace-arc 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
}

/* ── Editorial voice section ── */
.editorial-quote {
  font-family: 'Inter Variable', Inter, system-ui, sans-serif;
  font-variation-settings: 'opsz' 28;
  font-size: clamp(1.5rem, 2.8vw, 2.25rem);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.025em;
}
</style>
