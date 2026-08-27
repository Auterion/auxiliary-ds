<script setup lang="ts">
import { ref } from 'vue';
import { Button, Badge, StatusBadge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Sparkline from '../suite/Sparkline.vue';

type Direction = 'mono' | 'blue';
type Theme = 'light' | 'dark';
type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

/* Two axes on this surface, and no third:
 *
 *   [data-theme]  — the design system's own colour axis. `.dk` sits on the SAME
 *                   element, so the --dk-* palette and the DS semantic tokens
 *                   (Card, Badge, StatusBadge, Button) re-resolve together and
 *                   cannot drift out of step (deck-07b §3).
 *   [data-accent] — the study's own subject: mono vs ultramarine. It moves ONE
 *                   named ladder (--bd-accent / --bd-accent-ink / --bd-on-accent)
 *                   declared in the scoped layer below, never a value at a call
 *                   site.
 *
 * The old "Ground: Neutral / Space Cadet" switch is gone on purpose. Space Cadet
 * IS the ink exposure — `--dk-bg` resolves to ink-950, oklch(0.139 0.014 265),
 * the same hue-265 navy the toggle used to paint on. Keeping it would have meant
 * a second mode attribute fighting [data-theme], which the grammar forbids
 * outright. The ground comparison survives as a specimen in 01 · Identity.
 */
const theme = ref<Theme>('light');
const dir = ref<Direction>('blue');

const THEMES: { k: Theme; l: string }[] = [
  { k: 'light', l: 'Light' },
  { k: 'dark', l: 'Dark' },
];

const DIRECTIONS: { k: Direction; l: string }[] = [
  { k: 'mono', l: 'Mono' },
  { k: 'blue', l: 'Ultramarine' },
];

// Proposed Auterion palette from shared reference. The hex IS the datum here —
// these are specimens of a palette that does not (yet) live in the token set,
// so the value is the content, not a styling shortcut.
const proposedPalette = [
  { name: 'Ultramarine', hex: '#1248DF', oklch: 'oklch(0.482 0.235 264)', role: 'Brand accent — auterion-blue.700' },
  { name: 'Space Cadet', hex: '#171744', oklch: 'oklch(0.180 0.080 264)', role: 'Dark ground' },
  { name: 'Night', hex: '#191C1C', oklch: 'oklch(0.170 0.000 000)', role: 'Near-black surface' },
  { name: 'Cadet Grey', hex: '#919A9B', oklch: 'oklch(0.630 0.010 200)', role: 'Neutral mid — cadet.500' },
  { name: 'Platinum', hex: '#D3DFE2', oklch: 'oklch(0.880 0.015 200)', role: 'Light surface — cadet.300' },
  { name: 'Seasalt', hex: '#F5F7F7', oklch: 'oklch(0.970 0.005 200)', role: 'Near-white — cadet.50' },
  { name: 'Azure', hex: '#E3F7FF', oklch: 'oklch(0.970 0.025 205)', role: 'Tinted light' },
  { name: 'Aquamarine', hex: '#3BE494', oklch: 'oklch(0.830 0.170 155)', role: 'Unresolved — collides with advisory' },
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

const statusLevels: { level: Level; label: string }[] = [
  { level: 'alarm', label: 'Alarm' },
  { level: 'warning', label: 'Warning' },
  { level: 'caution', label: 'Caution' },
  { level: 'advisory', label: 'Advisory' },
  { level: 'nominal', label: 'Nominal' },
];

const typeScale = [
  { cls: 'text-10xl font-medium', label: 'Inter / 128 medium', sample: 'Auterion', font: 'sans' as const },
  { cls: 'text-8xl font-medium', label: 'Inter / 80 medium', sample: 'Autonomous Systems', font: 'sans' as const },
  { cls: 'text-6xl font-medium', label: 'Inter / 60 medium', sample: 'Pushing boundaries', font: 'sans' as const },
  { cls: 'text-4xl font-medium', label: 'Inter / 40 medium', sample: 'Mission-ready at scale', font: 'sans' as const },
  { cls: 'text-3xl font-normal', label: 'Inter / 30 regular', sample: 'Fleet operations & telemetry', font: 'sans' as const },
  { cls: 'text-2xl font-normal', label: 'Inter / 24 regular', sample: 'One stack, from silicon to fleet', font: 'sans' as const },
  { cls: 'text-base', label: 'Inter / 16 regular', sample: 'Encrypted datalinks, on-device autonomy and a hardened OS — engineered to operate where connectivity is contested.', font: 'sans' as const },
  { cls: 'text-sm', label: 'Inter / 14 regular', sample: 'The open software platform for autonomous vehicles. Build, deploy and command from the cloud.', font: 'sans' as const },
  { cls: 'text-xs font-medium', label: 'Inter / 12 medium', sample: 'AuterionOS 4.2 · Release notes · June 2026', font: 'sans' as const },
  { cls: 'text-xs font-mono', label: 'Geist Mono / 12', sample: 'TELEMETRY · RSSI −82 dBm · BATTERY 86% · ALT 124m', font: 'mono' as const },
];

const coverFigures = [
  { label: 'Flight hours', value: '2,000,000+' },
  { label: 'Vehicles deployed', value: '10,000+' },
  { label: 'Nations', value: '60+' },
];

const componentStats = [
  { value: '2M+', label: 'Flight hours' },
  { value: '10k+', label: 'Vehicles deployed' },
  { value: '60+', label: 'Countries' },
  { value: '99.9%', label: 'Fleet uptime' },
];

const fleet: { id: string; level: Level; batt: string; note: string }[] = [
  { id: 'Skyhook-01', level: 'nominal', batt: '86%', note: 'ALT 408 M' },
  { id: 'Falcon-02', level: 'advisory', batt: '64%', note: 'ALT 122 M' },
  { id: 'Raven-03', level: 'warning', batt: '18%', note: 'RETURNING' },
  { id: 'Osprey-05', level: 'nominal', batt: '92%', note: 'ALT 312 M' },
];

const monoPros = [
  'Uniquely owned — no competitors here',
  'Strongest possible discipline signal',
  'Ties marketing to the product register',
];
const monoCons = [
  'Zero warmth — may read cold to non-technical audiences',
  'Harder to drive CTAs without a second colour',
];
const bluePros = [
  'Works on light and dark',
  'Highest CTA contrast — unambiguous',
  'Distinct from Anduril / Helsing — not SaaS-standard blue',
  'Ink ground amplifies it: same hue family (265)',
];
const blueCons = [
  'Advisory cyan must stay distinct (H185 vs H265 — they are)',
  'Discipline required: two blue surfaces per view, no third',
];
</script>

<template>
  <div
    class="dk bd-root min-h-dvh"
    :data-theme="theme"
    :data-accent="dir"
  >
    <!-- ═══ Chrome — one hairline bar, two segmented controls ═══ -->
    <header class="bd-header">
      <div class="bd-shell flex h-14 items-center justify-between gap-6">
        <div class="flex min-w-0 items-center gap-3">
          <span class="dk-label">Auterion</span>
          <span class="bd-tick" />
          <span class="dk-micro truncate">Brand system · 2026</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="dk-micro hidden sm:inline">Theme</span>
          <div class="dk-segment">
            <button
              v-for="t in THEMES"
              :key="t.k"
              type="button"
              class="dk-segment-btn"
              :data-active="theme === t.k"
              @click="theme = t.k"
            >{{ t.l }}</button>
          </div>
          <span class="dk-micro hidden sm:inline">Accent</span>
          <div class="dk-segment">
            <button
              v-for="d in DIRECTIONS"
              :key="d.k"
              type="button"
              class="dk-segment-btn"
              :data-active="dir === d.k"
              @click="dir = d.k"
            >{{ d.l }}</button>
          </div>
        </div>
      </div>
    </header>

    <!-- ═══ P-01 · COVER ═══════════════════════════════════════════════
         Display + ghost line. The art is a static hairline field: nothing
         draws in on load — an editorial page is already finished when you
         arrive at it. -->
    <section class="bd-cover">
      <svg
        class="bd-cover-art"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="bd-cover-grid"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 56 0 L 0 0 0 56"
              fill="none"
              stroke="var(--dk-line-2)"
              stroke-width="1"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#bd-cover-grid)"
        />
        <path
          d="M -40 520 C 120 420 280 300 520 200 S 900 80 1200 20"
          fill="none"
          stroke="var(--dk-line)"
          stroke-width="1"
          stroke-dasharray="4 10"
        />
        <circle
          cx="520"
          cy="200"
          r="3.5"
          fill="var(--dk-fg-3)"
        />
        <circle
          cx="520"
          cy="200"
          r="16"
          fill="none"
          stroke="var(--dk-line)"
          stroke-width="1"
        />
      </svg>

      <div class="bd-shell bd-cover-inner">
        <div class="flex items-start justify-between gap-6">
          <p class="dk-label">Auterion · Brand identity · 2026</p>
          <span class="bd-mark">
            <Icon
              name="drone"
              size="md"
            />
          </span>
        </div>

        <div class="max-w-4xl">
          <h1 class="dk-display">
            Precision design<br>for autonomous<br>systems
          </h1>
          <p class="dk-h2 dk-ghost mt-6">
            Trusted · mission-critical · precise
          </p>
        </div>

        <div>
          <div class="bd-figures">
            <div
              v-for="(f, i) in coverFigures"
              :key="f.label"
              class="bd-figure"
              :data-align="i === coverFigures.length - 1 ? 'end' : null"
            >
              <span class="dk-label">{{ f.label }}</span>
              <span class="dk-h2 dk-num">{{ f.value }}</span>
            </div>
          </div>
          <div class="mt-5 flex flex-wrap items-baseline justify-between gap-4">
            <span class="dk-bracket">4 themes · 2 registers · 1 token source</span>
            <span class="dk-caption">P-01 · Cover — display + ghost line</span>
          </div>
        </div>
      </div>
    </section>

    <div class="bd-shell bd-flow bd-body">

      <!-- ═══ P-02 · IDENTITY ══════════════════════════════════════════ -->
      <section>
        <div class="dk-section">
          <p class="dk-label">01 — Identity</p>
          <p class="dk-label">Ground · surface · content · accent</p>
        </div>
        <h2 class="dk-h1 mt-6">
          Colour system
        </h2>
        <p class="dk-body mt-3 max-w-xl">
          The palette is a signal vocabulary, not a mood palette. Ground → Surface → Content → Accent.
          Status colours are reserved for operational severity and never spent on decoration.
        </p>

        <!-- semantic ramp -->
        <p class="dk-label mt-10">
          Semantic ramp
        </p>
        <div class="bd-ramp mt-3">
          <div
            v-for="s in monoRamp"
            :key="s.label"
            class="bd-ramp-cell"
            :style="{ background: s.val }"
          >
            <span
              class="dk-micro"
              :style="{ color: s.text }"
            >{{ s.label }}</span>
          </div>
        </div>

        <!-- accent + status ladder -->
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p class="dk-label">Brand accent — one signal, rationed</p>
            <!-- BLUE SURFACE 1 of 2. The one place blue is the subject rather
                 than the signal, so it is a specimen, not a plate. -->
            <div class="bd-accent-swatch mt-3">
              <span class="dk-label bd-on-accent">{{ dir === 'blue' ? 'Ultramarine' : 'Ink' }}</span>
            </div>
          </div>
          <div>
            <p class="dk-label">Status ladder — fixed, never decorative</p>
            <div class="bd-ladder mt-3">
              <div
                v-for="s in statusLevels"
                :key="s.level"
                class="bd-ladder-cell"
                :style="{ background: `var(--${s.level})` }"
              >
                <span
                  class="dk-micro"
                  :style="{ color: `var(--${s.level}-foreground)` }"
                >{{ s.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ledger table — the proposed palette, values hard right -->
        <p class="dk-label mt-10">
          Proposed Auterion palette
        </p>
        <table class="dk-table mt-3">
          <thead>
            <tr>
              <th class="bd-col-chip">
                <span class="bd-sr">Swatch</span>
              </th>
              <th class="bd-col-name">
                Name
              </th>
              <th class="bd-col-hex">
                Hex
              </th>
              <th
                class="bd-col-oklch hidden md:table-cell"
                data-align="end"
              >
                OKLCH
              </th>
              <th class="hidden sm:table-cell">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in proposedPalette"
              :key="c.name"
            >
              <td>
                <span
                  class="bd-chip"
                  :style="{ background: c.hex }"
                />
              </td>
              <td data-lead="true">
                {{ c.name }}
              </td>
              <td class="bd-mono">
                {{ c.hex }}
              </td>
              <td
                class="bd-mono hidden md:table-cell"
                data-align="end"
              >
                {{ c.oklch }}
              </td>
              <td class="hidden sm:table-cell">
                {{ c.role }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ground study — the same block at two exposures. The left panel
             carries its own `.dk` + [data-theme], so the whole --dk-* palette
             (and the accent ladder) re-resolves inside it. -->
        <p class="dk-label mt-10">
          Ground study — ink vs page
        </p>
        <div class="mt-3 grid gap-6 sm:grid-cols-2">
          <div class="dk-card overflow-hidden">
            <div class="bd-strip">
              <span class="dk-label">Ink ground — ink-950 · hue 265</span>
            </div>
            <div
              class="dk bd-preview"
              data-theme="dark"
            >
              <div class="min-w-0">
                <p class="dk-label bd-accent-ink">
                  Auterion · 2026
                </p>
                <p class="dk-h2 mt-3">
                  The operating system<br>for autonomous robotics
                </p>
              </div>
              <span class="bd-mark bd-mark-sm">
                <Icon
                  name="drone"
                  size="sm"
                />
              </span>
            </div>
          </div>
          <div class="dk-card overflow-hidden">
            <div class="bd-strip">
              <span class="dk-label">Page ground — theme: {{ theme }}</span>
            </div>
            <div class="bd-preview">
              <div class="min-w-0">
                <p class="dk-label bd-accent-ink">
                  Auterion · 2026
                </p>
                <p class="dk-h2 mt-3">
                  The operating system<br>for autonomous robotics
                </p>
              </div>
              <span class="bd-mark bd-mark-sm">
                <Icon
                  name="drone"
                  size="sm"
                />
              </span>
            </div>
          </div>
        </div>

        <p class="dk-caption">
          P-02 · Identity — ledger table + ground study
        </p>
      </section>

      <!-- ═══ P-03 · TYPOGRAPHY ════════════════════════════════════════
           The one numeral card in the whole view. -->
      <section>
        <div class="bd-numeral-block">
          <div class="dk-plate bd-numeral-plate">
            <p class="dk-label">02 — Typography</p>
            <p class="dk-h2 mt-3">
              Grotesque speaks,<br>mono measures
            </p>
          </div>
          <div
            class="dk-numeral bd-numeral"
            aria-hidden="true"
          >
            <span class="dk-numeral-folio">02</span>
          </div>
        </div>

        <h2 class="dk-h1 mt-10">
          Type scale
        </h2>
        <p class="dk-body mt-3 max-w-xl">
          Inter Variable throughout — display, headings and body. Geist Mono is reserved for
          telemetry, coordinates and code.
        </p>

        <div class="bd-specimens dk-divide mt-8">
          <div
            v-for="t in typeScale"
            :key="t.label"
            class="bd-specimen"
          >
            <span class="dk-pointer">{{ t.label }}</span>
            <span :class="[t.cls, t.font === 'mono' ? 'font-mono' : '']">{{ t.sample }}</span>
          </div>
        </div>

        <p class="dk-caption">
          P-03 · Typography — numeral card + pointer-labelled fields
        </p>
      </section>

      <!-- ═══ P-04 · COMPONENTS ════════════════════════════════════════ -->
      <section>
        <div class="dk-section">
          <p class="dk-label">03 — Components</p>
          <p class="dk-label">@auxiliary/vue</p>
        </div>
        <h2 class="dk-h1 mt-6">
          Interactive elements
        </h2>
        <p class="dk-body mt-3 max-w-xl">
          Design-system primitives inside the deck's surroundings. Where a component fights the
          grammar the layout yields, not the component.
        </p>

        <div class="mt-8 grid gap-6 sm:grid-cols-2">
          <div class="dk-card bd-pad space-y-4">
            <p class="dk-label">Buttons</p>
            <div class="flex flex-wrap gap-3">
              <Button size="md">
                Get started
              </Button>
              <Button
                variant="secondary"
                size="md"
              >
                Learn more
              </Button>
              <Button
                variant="secondary"
                size="md"
              >
                Documentation
              </Button>
              <Button
                variant="ghost"
                size="md"
              >
                Sign in
              </Button>
            </div>
            <div class="flex flex-wrap gap-3">
              <Button size="sm">
                Request briefing
              </Button>
              <Button
                variant="secondary"
                size="sm"
              >
                Watch demo
              </Button>
            </div>
          </div>

          <div class="dk-card bd-pad space-y-4">
            <p class="dk-label">Status badges</p>
            <div class="flex flex-wrap gap-2">
              <StatusBadge
                v-for="s in statusLevels"
                :key="s.level"
                :level="s.level"
                size="sm"
              >
                {{ s.label }}
              </StatusBadge>
            </div>
            <div class="flex flex-wrap gap-2">
              <StatusBadge
                v-for="s in statusLevels"
                :key="s.level"
                :level="s.level"
                size="sm"
                dot
              >
                {{ s.label }}
              </StatusBadge>
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge>Primary</Badge>
              <Badge variant="secondary">
                Secondary
              </Badge>
              <Badge variant="outline">
                Outline
              </Badge>
            </div>
          </div>

          <div class="dk-card bd-pad space-y-3">
            <p class="dk-label">Product card</p>
            <div class="dk-inset bd-pad-sm dk-lift bd-product">
              <span class="bd-mark bd-mark-sm">
                <Icon
                  name="drone"
                  size="sm"
                />
              </span>
              <h3 class="dk-h2 mt-4">
                Mission Control
              </h3>
              <p class="dk-body mt-2">
                Field-proven ground control. Map, gimbal and mission, on any tablet.
              </p>
              <span class="dk-link mt-4">
                Learn more
                <Icon
                  name="arrow-right"
                  size="xs"
                />
              </span>
            </div>
          </div>

          <div class="dk-card bd-pad space-y-3">
            <p class="dk-label">Figures</p>
            <div class="grid grid-cols-2 gap-6">
              <div
                v-for="s in componentStats"
                :key="s.label"
              >
                <p class="dk-h2 dk-num">
                  {{ s.value }}
                </p>
                <p class="dk-label mt-1">
                  {{ s.label }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p class="dk-caption">
          P-04 · Components — hairline cards, no shadow
        </p>
      </section>

      <!-- ═══ P-05 · CHAPTER PLATE ═════════════════════════════════════
           BLUE SURFACE 2 of 2, and the only sanctioned use of the device:
           a chapter divider. Drops to the dark plate on the mono direction. -->
      <section>
        <div
          class="bd-chapter"
          :class="dir === 'blue' ? 'dk-plate-signal' : 'dk-plate'"
        >
          <div>
            <p class="dk-label">Chapter</p>
            <p class="dk-h1 mt-3">
              Above the fold
            </p>
          </div>
          <span class="dk-bracket">4 directions · 2 grounds · 1 accent</span>
        </div>
        <p class="dk-caption">
          P-05 · Chapter plate — the signal, spent once
        </p>
      </section>

      <!-- ═══ P-06 · HERO FILMSTRIP ════════════════════════════════════ -->
      <section>
        <div class="dk-section">
          <p class="dk-label">04 — Hero</p>
          <p class="dk-label">Four structural directions</p>
        </div>
        <h2 class="dk-h1 mt-6">
          Above the fold
        </h2>
        <p class="dk-body mt-3 max-w-xl">
          Structural directions for the hero section. Switch the accent in the bar above to see the
          colour impact on each.
        </p>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <!-- A — Statement -->
          <div class="dk-card overflow-hidden">
            <div class="bd-strip bd-strip-split">
              <span class="dk-label">Direction A — Statement</span>
              <span class="dk-micro">Type-forward · no widget</span>
            </div>
            <div class="bd-hero">
              <div class="max-w-lg">
                <p class="dk-label bd-accent-ink">
                  Auterion · 2026
                </p>
                <h3 class="dk-h1 mt-4">
                  The operating<br>system for<br>autonomous<br>robotics
                </h3>
                <p class="dk-body mt-5 max-w-sm">
                  One platform from flight controller to fleet — built for the mission, proven at
                  the edge.
                </p>
                <div class="mt-6 flex gap-3">
                  <Button size="md">
                    Get started
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                  >
                    Watch demo
                  </Button>
                </div>
              </div>
              <div class="bd-hud">
                <p>Fleet · Global</p>
                <p>8 active · 2 in flight</p>
                <p>Link nominal · 12 ms</p>
              </div>
            </div>
          </div>

          <!-- B — Data + Statement -->
          <div class="dk-card overflow-hidden">
            <div class="bd-strip bd-strip-split">
              <span class="dk-label">Direction B — Data + statement</span>
              <span class="dk-micro">Two-column · live data right</span>
            </div>
            <div class="bd-hero bd-hero-split">
              <div class="min-w-0">
                <p class="dk-label bd-accent-ink">
                  Auterion · 2026
                </p>
                <h3 class="dk-h2 mt-4">
                  The operating system for autonomous robotics
                </h3>
                <div class="mt-5 flex gap-2">
                  <Button size="sm">
                    Get started
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    Watch demo
                  </Button>
                </div>
              </div>
              <div class="dk-inset bd-widget">
                <div class="bd-widget-head">
                  <span class="dk-dot dk-dot-nominal" />
                  <span class="dk-label">Fleet · Live</span>
                </div>
                <div class="bd-pad-sm">
                  <p class="dk-pointer">Flights · 30 d</p>
                  <p class="dk-h2 dk-num mt-1">
                    695
                  </p>
                  <div class="bd-spark mt-2">
                    <Sparkline
                      :data="heroSpark"
                      :height="28"
                    />
                  </div>
                  <div class="dk-divide mt-3">
                    <div
                      v-for="r in fleet.slice(0, 3)"
                      :key="r.id"
                      class="bd-fleet-row"
                    >
                      <Icon
                        name="drone"
                        size="xs"
                      />
                      <span class="bd-mono truncate">{{ r.id }}</span>
                      <StatusBadge
                        :level="r.level"
                        size="sm"
                        dot
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- D — Paper exposure. Carries its own `.dk` + [data-theme] so the
               whole grammar re-resolves to paper inside a dark page. -->
          <div class="dk-card overflow-hidden lg:col-span-2">
            <div class="bd-strip bd-strip-split">
              <span class="dk-label">Direction D — Paper exposure</span>
              <span class="dk-micro">White ground · fleet data right</span>
            </div>
            <div
              class="dk bd-hero-d"
              data-theme="light"
            >
              <svg
                class="bd-hero-d-art"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="bd-hero-grid"
                    width="48"
                    height="48"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 48 0 L 0 0 0 48"
                      fill="none"
                      stroke="var(--dk-line-2)"
                      stroke-width="1"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#bd-hero-grid)"
                />
                <path
                  d="M 20 240 C 80 190 120 150 200 110 S 340 60 420 20"
                  fill="none"
                  stroke="var(--dk-line)"
                  stroke-width="1"
                  stroke-dasharray="3 9"
                />
                <circle
                  cx="200"
                  cy="110"
                  r="3.5"
                  fill="var(--dk-fg-3)"
                />
                <circle
                  cx="200"
                  cy="110"
                  r="14"
                  fill="none"
                  stroke="var(--dk-line)"
                  stroke-width="1"
                />
                <text
                  x="220"
                  y="114"
                  class="bd-hero-d-coord"
                >47°22'N 8°32'E · ALT 128 M</text>
              </svg>

              <div class="bd-hero-d-inner">
                <div class="bd-hero-d-type">
                  <p class="dk-label">01</p>
                  <h3 class="dk-display mt-6">
                    The operating<br>system for<br>autonomous<br>robotics
                  </h3>
                  <p class="dk-body-lg mt-5 max-w-sm">
                    One platform to build, deploy and command intelligent drones at scale.
                  </p>
                  <div class="mt-8 flex items-center gap-4">
                    <Button size="sm">
                      Get started
                      <Icon
                        name="arrow-right"
                        size="xs"
                      />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                    >
                      Watch the demo
                    </Button>
                  </div>
                </div>
                <div class="bd-hero-d-data">
                  <div class="bd-hero-d-head">
                    <span class="dk-pointer">Fleet · Live</span>
                    <span class="dk-dot dk-dot-nominal" />
                  </div>
                  <div class="dk-divide">
                    <div
                      v-for="r in fleet"
                      :key="r.id"
                      class="bd-fleet-row bd-fleet-row-wide"
                    >
                      <Icon
                        name="drone"
                        size="xs"
                      />
                      <span class="bd-mono truncate">{{ r.id }}</span>
                      <span class="bd-mono dk-num bd-fleet-num">{{ r.batt }}</span>
                      <StatusBadge
                        :level="r.level"
                        size="sm"
                        dot
                      />
                    </div>
                  </div>
                  <p class="dk-micro mt-4">
                    Link nominal · 12 ms · SYS v4.2.1
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- C — Mission canvas -->
          <div class="dk-card overflow-hidden lg:col-span-2">
            <div class="bd-strip bd-strip-split">
              <span class="dk-label">Direction C — Mission canvas</span>
              <span class="dk-micro">Full-width · operational data layer</span>
            </div>
            <div class="bd-canvas">
              <svg
                class="bd-canvas-art"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="bd-canvas-grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="var(--dk-line-2)"
                      stroke-width="1"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#bd-canvas-grid)"
                />
                <path
                  d="M 60 200 C 160 160, 200 100, 340 80 S 560 40, 640 28"
                  fill="none"
                  stroke="var(--dk-line)"
                  stroke-width="1"
                  stroke-dasharray="3 7"
                />
                <g
                  v-for="(p, i) in [[60, 200], [200, 130], [340, 80], [640, 28]]"
                  :key="i"
                >
                  <circle
                    :cx="p[0]"
                    :cy="p[1]"
                    r="3"
                    :fill="i === 2 ? 'var(--dk-fg-3)' : 'transparent'"
                    stroke="var(--dk-fg-3)"
                    stroke-width="1"
                  />
                  <circle
                    v-if="i === 2"
                    :cx="p[0]"
                    :cy="p[1]"
                    r="12"
                    fill="none"
                    stroke="var(--dk-line)"
                    stroke-width="1"
                  />
                </g>
              </svg>

              <div class="bd-canvas-inner">
                <div class="max-w-lg">
                  <p class="dk-label bd-accent-ink">
                    Operational truth, expressed with precision
                  </p>
                  <h3 class="dk-h1 mt-4">
                    The operating system<br>for autonomous robotics
                  </h3>
                  <div class="mt-6 flex gap-3">
                    <Button size="md">
                      Get started
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                    >
                      Watch demo
                    </Button>
                  </div>
                </div>
                <div class="bd-hud bd-hud-static">
                  <p>Fleet · Global</p>
                  <p class="dk-num">
                    2,000,000+ flight hrs
                  </p>
                  <p class="dk-num">
                    10,000+ vehicles · 60 nations
                  </p>
                  <p>Link nominal · UTC 14:22:09</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p class="dk-caption">
          P-06 · Hero filmstrip — four exposures of one page
        </p>
      </section>

      <!-- ═══ P-07 · DOCTRINE ══════════════════════════════════════════ -->
      <section>
        <div class="dk-section">
          <p class="dk-label">05 — Direction summary</p>
          <p class="dk-label">Doctrine</p>
        </div>
        <h2 class="dk-h1 mt-6">
          Two accents, one discipline
        </h2>
        <p class="dk-body mt-3 max-w-xl">
          Switch the theme and the accent in the bar above to compare every combination. The ink
          exposure is the Space Cadet ground — ink-950 at hue 265 — so the ground question rides
          the same axis as the theme.
        </p>

        <div class="mt-8 grid gap-6 sm:grid-cols-2">
          <div
            class="dk-card bd-pad bd-doctrine"
            :data-active="dir === 'mono'"
          >
            <p class="dk-label">A — Mono</p>
            <p class="dk-value mt-3">
              Fully monochromatic. Maximum discipline.
            </p>
            <p class="dk-body mt-2">
              No one in autonomous systems owns this. It reads as extremely precise and
              intentional. Status colours are the only chromatic elements on the page.
            </p>
            <ul class="bd-list mt-5">
              <li
                v-for="s in monoPros"
                :key="s"
              >
                <span class="bd-list-sign">+</span>
                <span class="dk-body">{{ s }}</span>
              </li>
              <li
                v-for="s in monoCons"
                :key="s"
                class="bd-list-con"
              >
                <span class="bd-list-sign">−</span>
                <span class="dk-body">{{ s }}</span>
              </li>
            </ul>
          </div>

          <div
            class="dk-card bd-pad bd-doctrine"
            :data-active="dir === 'blue'"
          >
            <p class="dk-label">B — Ultramarine</p>
            <p class="dk-value mt-3">
              Electric indigo-blue from the auterion-blue scale.
            </p>
            <p class="dk-body mt-2">
              Not IBM blue — bolder and more saturated. On the ink ground it reads as a harmonic
              continuation of the same hue family rather than a foreign accent.
            </p>
            <ul class="bd-list mt-5">
              <li
                v-for="s in bluePros"
                :key="s"
              >
                <span class="bd-list-sign">+</span>
                <span class="dk-body">{{ s }}</span>
              </li>
              <li
                v-for="s in blueCons"
                :key="s"
                class="bd-list-con"
              >
                <span class="bd-list-sign">−</span>
                <span class="dk-body">{{ s }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="dk-inset bd-pad mt-6">
          <p class="dk-label">Director recommendation</p>
          <p class="dk-value mt-3">
            Ink ground + Ultramarine.
          </p>
          <p class="dk-body mt-2 max-w-2xl">
            The navy ground gives Auterion something no aerospace peer has — a background with
            character, not just darkness. The electric blue accent is decisive and legible.
            Together they read as precision plus confidence.
          </p>
          <p class="dk-body mt-3 max-w-2xl">
            Anduril → near-black + warm orange. Helsing → near-black + white. Auterion → ink navy +
            Ultramarine. Distinct from all of them.
          </p>
        </div>

        <p class="dk-caption">
          P-07 · Doctrine — the argument, on the record
        </p>
      </section>

      <!-- ═══ P-08 · VOICE + PROOF CLOSE ═══════════════════════════════ -->
      <section>
        <div class="dk-section">
          <p class="dk-label">06 — Voice</p>
          <p class="dk-label">In use</p>
        </div>

        <!-- header ledger — tops the case layout below it -->
        <div class="dk-ledger">
          <div class="dk-ledger-cell">
            <span class="dk-label">System</span>
            <span class="dk-value">Auxiliary · @auxiliary/*</span>
          </div>
          <div class="dk-ledger-cell">
            <span class="dk-label">Surfaces</span>
            <span class="dk-value">Suite · Mission Control · AuterionOS</span>
          </div>
          <div
            class="dk-ledger-cell"
            data-align="end"
          >
            <span class="dk-label">Themes · registers</span>
            <span class="dk-value dk-num">4 · 2</span>
          </div>
        </div>

        <div class="bd-case mt-8">
          <div class="bd-case-copy">
            <div>
              <p class="dk-h2">
                The autonomous era demands design that operates at mission speed.
              </p>
              <p class="dk-body-lg mt-6 max-w-lg">
                Every surface in Auterion's stack appears in contested environments — where a
                moment of confusion costs a mission. The design system isn't furniture. It's
                operational infrastructure.
              </p>
            </div>
            <div class="mt-10 flex items-center gap-3">
              <span class="bd-attrib-rule" />
              <span class="dk-label">Auterion design principles · 2026</span>
            </div>
          </div>

          <div class="bd-case-data">
            <div>
              <div class="bd-widget-head bd-widget-head-flush">
                <span class="dk-pointer">Fleet · Live</span>
                <span class="dk-dot dk-dot-nominal" />
              </div>
              <div class="dk-divide">
                <div
                  v-for="r in fleet"
                  :key="r.id"
                  class="bd-fleet-row bd-fleet-row-wide"
                >
                  <Icon
                    name="drone"
                    size="xs"
                  />
                  <span class="bd-mono truncate">{{ r.id }}</span>
                  <span class="bd-mono dk-num bd-fleet-note hidden sm:inline">{{ r.note }}</span>
                  <span class="bd-mono dk-num bd-fleet-num">{{ r.batt }}</span>
                  <StatusBadge
                    :level="r.level"
                    size="sm"
                    dot
                  />
                </div>
              </div>
            </div>
            <p class="dk-micro mt-5">
              SYS nominal · UTC 14:22:09 · v4.2.1
            </p>
          </div>
        </div>

        <!-- proof close — the dark plate, not the signal -->
        <div class="dk-plate bd-close mt-6">
          <p class="dk-h2 max-w-3xl">
            “From AuterionOS on the flight controller to Mission Control on the tablet, one token
            set, one type ramp, one truth.”
          </p>
          <div class="mt-8 flex flex-wrap items-baseline justify-between gap-4">
            <span class="dk-label">Design principle #1 — code is the source of truth</span>
            <span class="dk-bracket">1 token source · 4 themes · 0 forks</span>
          </div>
        </div>

        <p class="dk-caption">
          P-08 · Voice + proof close — header ledger tops the case
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ── Brand · page-local layer ─────────────────────────────────────────────
 * Composes `_deck07b.css` (`.dk-*`). Nothing here re-derives a deck value:
 * every length steps to --dk-gutter / --dk-rule / --dk-r-*, every colour
 * resolves through --dk-* or a design-system semantic token.
 *
 * ONE ladder is added on top of the deck's — the accent, which is this page's
 * subject. It is declared on `.bd-root` AND on every nested `.dk` scope,
 * because a var() inside a custom-property declaration is substituted where it
 * is declared: without the re-declaration, the ink ground study and the paper
 * hero would keep the outer scope's already-resolved blue.
 */

.bd-root,
.bd-root .dk {
  --bd-accent: var(--dk-fg);
  --bd-accent-ink: var(--dk-fg);
  --bd-on-accent: var(--dk-bg);
  /* One focus ring for the whole grammar — the DS components ride it too. */
  --ring: var(--dk-fg);
}
.bd-root[data-accent='blue'],
.bd-root[data-accent='blue'] .dk {
  --bd-accent: var(--dk-signal);
  --bd-accent-ink: var(--dk-signal-ink);
  --bd-on-accent: var(--dk-on-signal);
}

.bd-accent-ink { color: var(--bd-accent-ink); }
.bd-on-accent { color: var(--bd-on-accent); }

/* Contrast repair — measured, scoped to this page, reported upstream.
 * `_deck07b.css` re-inks `.dk-label` / `.dk-pointer` / `.dk-micro` inside
 * `.dk-plate` (l.257) and `.dk-plate-signal` (l.244) but omits `.dk-bracket`,
 * so a bracket on a plate keeps `--dk-fg-2` — the wrong exposure's ink:
 *   · dark plate, light theme  ink-600 on ink-950   →  2.59:1
 *   · signal plate, light      ink-600 on blue-600  →  1.47:1
 *   · signal plate, dark       ink-400 on blue-500  →  1.43:1
 * And the plate's 72% on-signal mono roles land at 3.46:1 (light) / 3.80:1
 * (dark), under the 4.5:1 floor at 9.5px. Held at full on-signal here. */
.dk-plate .dk-bracket { color: var(--dk-plate-fg-2); }
.dk-plate-signal :is(.dk-bracket, .dk-label) { color: var(--dk-on-signal); }

/* ── Measure & rhythm ──────────────────────────────────────────────────── */
.bd-shell {
  width: 100%;
  max-width: 1120px;
  margin-inline: auto;
  padding-inline: var(--dk-gutter);
}
.bd-body { padding-block: calc(var(--dk-gutter) * 3); }
.bd-flow > * + * { margin-top: calc(var(--dk-gutter) * 4); }
.bd-pad { padding: var(--dk-gutter); }
.bd-pad-sm { padding: var(--dk-gutter-sm); }

.bd-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* Mono field value — the measuring voice at body size. */
.bd-mono {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: 0.02em;
  color: var(--dk-fg-2);
}

/* ── Chrome ────────────────────────────────────────────────────────────── */
.bd-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: color-mix(in oklab, var(--dk-bg) 90%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: var(--dk-rule) solid var(--dk-line);
}
.bd-tick {
  display: block;
  width: var(--dk-rule);
  height: 12px;
  flex-shrink: 0;
  background: var(--dk-line);
}

/* ── P-01 · Cover ──────────────────────────────────────────────────────── */
.bd-cover {
  position: relative;
  overflow: hidden;
  min-height: 72vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-bottom: var(--dk-rule) solid var(--dk-line);
}
.bd-cover-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.bd-cover-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: calc(var(--dk-gutter) * 2);
  flex: 1;
  padding-block: calc(var(--dk-gutter) * 2);
}

/* Cover figures — the cover's own 3-slot grid. Not `.dk-ledger`: that device
 * tops a case layout, and this closes a cover. Same column rhythm, same
 * hairline, different job. */
.bd-figures {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--dk-gutter);
  padding-top: var(--dk-gutter-sm);
  border-top: var(--dk-rule) solid var(--dk-line);
}
.bd-figure {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.bd-figure[data-align='end'] { align-items: flex-end; text-align: right; }

.bd-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border: var(--dk-rule) solid var(--dk-line);
  border-radius: var(--dk-r-sm);
  color: var(--dk-fg);
}
.bd-mark-sm { width: 36px; height: 36px; }

/* ── P-02 · Identity ───────────────────────────────────────────────────── */
.bd-ramp {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  overflow: hidden;
  border: var(--dk-rule) solid var(--dk-line);
  border-radius: var(--dk-r-lg);
}
.bd-ramp-cell {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  aspect-ratio: 1;
  padding: 10px;
  min-width: 0;
  overflow: hidden;
}

.bd-accent-swatch {
  display: flex;
  align-items: flex-end;
  height: 96px;
  padding: 12px;
  border-radius: var(--dk-r-lg);
  background: var(--bd-accent);
}

.bd-ladder {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--dk-rule);
  height: 96px;
  overflow: hidden;
  border-radius: var(--dk-r-lg);
}
.bd-ladder-cell {
  display: flex;
  align-items: flex-end;
  padding: 8px 6px;
  min-width: 0;
  overflow: hidden;
}

.bd-col-chip { width: 40px; }
.bd-col-name { width: 22%; }
.bd-col-hex { width: 84px; }
.bd-col-oklch { width: 24%; }
.bd-chip {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: var(--dk-rule) solid var(--dk-line);
}
.dk-table tbody tr:hover { background: var(--dk-bg-2); }

.bd-strip {
  padding: 10px var(--dk-gutter-sm);
  border-bottom: var(--dk-rule) solid var(--dk-line);
  background: var(--dk-bg-2);
}
.bd-strip-split {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--dk-gutter-sm);
}
.bd-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dk-gutter);
  padding: var(--dk-gutter);
  min-height: 148px;
}

/* ── P-03 · Typography ─────────────────────────────────────────────────── */
.bd-numeral-block { position: relative; }
.bd-numeral-plate {
  padding: var(--dk-gutter);
  padding-right: 160px;
  padding-bottom: calc(var(--dk-gutter) + 20px);
}
.bd-numeral {
  position: absolute;
  right: var(--dk-gutter);
  bottom: 0;
  width: 112px;
  height: 88px;
}

.bd-specimens { border-block: var(--dk-rule) solid var(--dk-line); }
.bd-specimen {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: var(--dk-gutter);
  align-items: baseline;
  padding-block: 20px;
  overflow: hidden;
}
@media (max-width: 640px) {
  .bd-specimen { grid-template-columns: minmax(0, 1fr); gap: 8px; }
}

/* ── P-04 · Components ─────────────────────────────────────────────────── */
.bd-product {
  display: block;
  border: var(--dk-rule) solid var(--dk-line);
  border-radius: var(--dk-r);
}
.bd-product .dk-link { display: inline-flex; }

/* ── P-05 · Chapter plate ──────────────────────────────────────────────── */
.bd-chapter {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--dk-gutter);
  flex-wrap: wrap;
  padding: calc(var(--dk-gutter) * 2);
  min-height: 200px;
}

/* ── P-06 · Hero filmstrip ─────────────────────────────────────────────── */
.bd-hero {
  position: relative;
  padding: calc(var(--dk-gutter) * 1.5);
  min-height: 300px;
}
.bd-hero-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: var(--dk-gutter);
  align-items: center;
}
@media (max-width: 640px) {
  .bd-hero-split { grid-template-columns: minmax(0, 1fr); }
}

.bd-hud {
  position: absolute;
  right: var(--dk-gutter);
  bottom: var(--dk-gutter);
  text-align: right;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  line-height: 1.8;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dk-fg-3);
}
.bd-hud-static { position: static; }

.bd-widget { overflow: hidden; }
.bd-widget-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px var(--dk-gutter-sm);
  border-bottom: var(--dk-rule) solid var(--dk-line);
}
.bd-widget-head-flush {
  padding-inline: 0;
  padding-top: 0;
  margin-bottom: 4px;
}
.bd-spark { height: 28px; color: var(--dk-fg); }

.bd-fleet-row {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding-block: 7px;
  color: var(--dk-fg-3);
}
.bd-fleet-row-wide { grid-template-columns: 14px minmax(0, 1fr) auto auto; }
.bd-fleet-row-wide:has(.bd-fleet-note) { grid-template-columns: 14px minmax(0, 1fr) auto auto auto; }
.bd-fleet-row .bd-mono { color: var(--dk-fg); }
.bd-fleet-num,
.bd-fleet-note { color: var(--dk-fg-3) !important; }

.bd-hero-d { position: relative; overflow: hidden; }
.bd-hero-d-art {
  position: absolute;
  inset-block: 0;
  right: 0;
  width: 50%;
  height: 100%;
  pointer-events: none;
}
.bd-hero-d-coord {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  fill: var(--dk-fg-3);
}
.bd-hero-d-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 3fr 2fr;
  align-items: stretch;
  min-height: 340px;
}
@media (max-width: 900px) {
  .bd-hero-d-inner { grid-template-columns: minmax(0, 1fr); }
}
.bd-hero-d-type {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: calc(var(--dk-gutter) * 1.5);
}
.bd-hero-d-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: calc(var(--dk-gutter) * 1.5);
  border-left: var(--dk-rule) solid var(--dk-line);
}
@media (max-width: 900px) {
  .bd-hero-d-data { border-left: 0; border-top: var(--dk-rule) solid var(--dk-line); }
}
.bd-hero-d-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dk-gutter-sm);
  padding-bottom: 8px;
  margin-bottom: 4px;
  border-bottom: var(--dk-rule) solid var(--dk-line);
}

.bd-canvas { position: relative; overflow: hidden; background: var(--dk-bg-2); }
.bd-canvas-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.bd-canvas-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: var(--dk-gutter);
  padding: calc(var(--dk-gutter) * 1.5);
  min-height: 300px;
}
@media (max-width: 640px) {
  .bd-canvas-inner { grid-template-columns: minmax(0, 1fr); }
}

/* ── P-07 · Doctrine ───────────────────────────────────────────────────── */
.bd-doctrine[data-active='true'] { border-color: var(--dk-fg); }
.bd-list { display: flex; flex-direction: column; gap: 6px; }
.bd-list li {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr);
  gap: 8px;
  align-items: baseline;
}
/* The sign is the only thing separating a pro from a con, so it is not an
 * 8px micro. Cons step down the ink ladder rather than fading on opacity —
 * opacity would drag them under the 4.5:1 floor; `--dk-fg-3` holds 4.77:1
 * (light) / 4.17:1 (dark, the layer's own fg-3 ceiling). */
.bd-list-sign {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  color: var(--dk-fg-3);
}
.bd-list-con .dk-body { color: var(--dk-fg-3); }

/* ── P-08 · Voice + proof close ────────────────────────────────────────── */
.bd-case {
  display: grid;
  grid-template-columns: 3fr 2fr;
  overflow: hidden;
  border: var(--dk-rule) solid var(--dk-line);
  border-radius: var(--dk-r-lg);
}
@media (max-width: 900px) {
  .bd-case { grid-template-columns: minmax(0, 1fr); }
}
.bd-case-copy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(var(--dk-gutter) * 1.5);
  border-right: var(--dk-rule) solid var(--dk-line);
}
@media (max-width: 900px) {
  .bd-case-copy { border-right: 0; border-bottom: var(--dk-rule) solid var(--dk-line); }
}
.bd-case-data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(var(--dk-gutter) * 1.5);
  background: var(--dk-bg-2);
}
.bd-attrib-rule {
  display: block;
  width: 32px;
  height: var(--dk-rule);
  flex-shrink: 0;
  background: var(--dk-fg);
}

.bd-close { padding: calc(var(--dk-gutter) * 2); }
</style>
