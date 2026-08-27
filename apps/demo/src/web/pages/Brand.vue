<!--
  Hallmark · macrostructure: Editorial (portfolio deck) · tone: technical-austere
  anchor hue: auterion blue — SPECIMEN ONLY on this page. The colour ramp in
  §01 shows the blue the way a type specimen shows a face; it is content, not
  signal, and is not counted against the budget. The view's one signal surface
  is the masthead mark in Site.vue.
  pre-emit critique: P5 H5 E5 S5 R5 V4
-->
<script setup lang="ts">
import { Button, Badge, StatusBadge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';

// Auterion blue family — color.primitive.auterion-blue.* in packages/tokens.
// The brand token (--brand) maps to auterion-blue.700; the focus ring to .600.
// Dark-mode backgrounds and surfaces come from the separate `ink` neutral ramp.
const blueRamp = [
  { shade: 'ink.950', val: 'var(--color-primitive-ink-950)', label: 'Ink 950', note: 'Dark mode background', onDark: true },
  { shade: 'ink.900', val: 'var(--color-primitive-ink-900)', label: 'Ink 900', note: 'Dark mode card', onDark: true },
  { shade: 'ink.800', val: 'var(--color-primitive-ink-800)', label: 'Ink 800', note: 'Dark mode secondary', onDark: true },
  { shade: 'ink.700', val: 'var(--color-primitive-ink-700)', label: 'Ink 700', note: 'Dark mode border', onDark: true },
  { shade: '700', val: 'var(--color-primitive-auterion-blue-700)', label: 'Brand', note: 'var(--brand)', onDark: true },
  { shade: '600', val: 'var(--color-primitive-auterion-blue-600)', label: 'Ring', note: 'Focus ring · var(--ring)', onDark: true },
  { shade: '50', val: 'var(--color-primitive-auterion-blue-50)', label: 'Tint', note: 'Light mode hover surface', onDark: false },
] as const;

const statusLevels = [
  { name: 'alarm', token: '--alarm', fg: '--alarm-foreground' },
  { name: 'warning', token: '--warning', fg: '--warning-foreground' },
  { name: 'caution', token: '--caution', fg: '--caution-foreground' },
  { name: 'advisory', token: '--advisory', fg: '--advisory-foreground' },
  { name: 'nominal', token: '--nominal', fg: '--nominal-foreground' },
] as const;

const typeScale = [
  { size: '54px', weight: '600', face: 'display', specimen: 'Autonomous.' },
  { size: '40px', weight: '600', face: 'display', specimen: 'Precision at scale.' },
  { size: '28px', weight: '600', face: 'display', specimen: 'One stack, silicon to fleet.' },
  { size: '20px', weight: '600', face: 'display', specimen: 'Mission-ready software.' },
  { size: '16px', weight: '400', face: 'display', specimen: 'One software platform to build, deploy and command intelligent vehicles at scale.' },
  { size: '13px', weight: '400', face: 'display', specimen: 'Trusted across defense, enterprise and public safety in over 60 countries.' },
  { size: '11px', weight: '500', face: 'mono', specimen: 'FLEET STATUS · NOMINAL · 12 ms LATENCY' },
] as const;

const voiceSamples = [
  {
    context: 'Hero headline',
    text: 'The operating system for autonomous robotics.',
    note: 'Declarative. No verbs implying aspiration — states what it is.',
  },
  {
    context: 'Defense',
    text: 'Engineered to operate where connectivity is contested and the stakes are real.',
    note: 'Mission-context language. Operational, not promotional.',
  },
  {
    context: 'Product tagline',
    text: 'One stack, from silicon to fleet.',
    note: 'Technical + scale. Short phrases, precise nouns.',
  },
  {
    context: 'CTA',
    text: 'Get started',
    note: 'Action, no exclamation. Direct.',
  },
] as const;

const logoSlots = [
  { label: 'lockup-horizontal — color', tone: 'default', note: 'Primary mark. Light backgrounds.' },
  { label: 'lockup-horizontal — inverse', tone: 'inverse', note: 'Dark backgrounds. White fills.' },
  { label: 'mark — mono', tone: 'surface', note: 'Favicon / app icon / small contexts.' },
] as const;

const logoFiles = [
  { file: 'auterion--lockup-horizontal--color.svg', desc: 'Primary mark, color tone' },
  { file: 'auterion--lockup-horizontal--mono.svg', desc: 'Single-color (black fills)' },
  { file: 'auterion--lockup-horizontal--inverse.svg', desc: 'Reversed (white fills)' },
  { file: 'auterion--mark--color.svg', desc: 'Symbol / favicon' },
] as const;

const tokenFacts = [
  { label: 'CSS token', value: 'var(--brand)' },
  { label: 'OKLCH', value: 'oklch(0.482 0.235 264)' },
  { label: 'Primitive', value: 'auterion-blue.700' },
  { label: 'Usage', value: 'CTA · Mark · Panel fill · Accent' },
] as const;

const motion = [
  { name: 'Operational register', rule: '100–150 ms · ease-out', desc: 'Instant feedback. Opacity and color only. Used in product UI wherever latency matters to the operator.' },
  { name: 'Editorial register', rule: '200–300 ms · ease-out · on-scroll', desc: 'Subtle entrance for marketing sections. No parallax, no looping animation, no bounce. One property at a time.' },
  { name: 'Reduced motion', rule: '≤ 150 ms opacity crossfade only', desc: 'All spatial motion collapses to a simple opacity transition when the user has requested reduced motion. No exceptions.' },
] as const;

const stats = [
  { value: '2M+', label: 'Flight hours logged' },
  { value: '10,000+', label: 'Vehicles deployed' },
  { value: '60+', label: 'Countries' },
  { value: '99.9%', label: 'Fleet uptime' },
] as const;
</script>

<template>
  <div>

    <!-- ╭─ Cover ────────────────────────────────────────────────────╮ -->
    <section class="wb-wrap wb-block">
      <div class="dk-plate wb-cover">
        <div class="wb-cover-copy">
          <p class="dk-h2 dk-ghost">Brand Identity System · 2026</p>
          <h1 class="dk-display">Precision. Scale. Autonomy.</h1>
        </div>
        <p class="dk-body-lg wb-cover-lede">
          Auterion's identity is built on operational clarity, technical confidence, and the
          restraint that comes from building for real-world consequence. No aspiration language.
          No ambient glow. Blue means go.
        </p>
        <span class="dk-bracket">6 SECTIONS · 1 SIGNAL · 5 STATUS LEVELS</span>
      </div>
    </section>

    <!-- ╭─ 01 · Colour ──────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">01 — Colour</span>
          <span class="dk-bracket">7 SWATCHES · 1 BRAND STOP</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Blue as identity.</h2>
          <p class="dk-body-lg wb-measure-text">
            The brand blue is not decorative. It is the single chromatic anchor — reserved for
            primary actions, brand marks, and moments that demand attention. Everything else stays
            on the neutral ramp.
          </p>
        </div>

        <!-- Specimen: the ramp is content, not signal. -->
        <div class="wb-swatches" role="img" aria-label="Auterion blue colour family">
          <div
            v-for="sw in blueRamp"
            :key="sw.shade"
            class="wb-swatch"
            :data-wide="sw.shade === '700' ? 'true' : undefined"
            :style="{ background: sw.val, color: sw.onDark ? 'var(--color-primitive-ink-50)' : 'var(--color-primitive-ink-950)' }"
          >
            <span class="wb-swatch-name">{{ sw.label }}</span>
          </div>
        </div>
        <div class="wb-grid wb-stack" data-cols="4">
          <span v-for="sw in blueRamp" :key="`${sw.shade}-note`" class="wb-rule-row">
            <span class="dk-small">{{ sw.note }}</span>
            <span class="dk-micro">{{ sw.shade }}</span>
          </span>
        </div>

        <!-- Token facts — a ledger, measured column hard right. -->
        <div class="dk-ledger wb-ledger-4 wb-stack">
          <div
            v-for="(t, i) in tokenFacts"
            :key="t.label"
            class="dk-ledger-cell"
            :data-align="i === tokenFacts.length - 1 ? 'end' : undefined"
          >
            <span class="dk-pointer">{{ t.label }}</span>
            <code class="wb-chip">{{ t.value }}</code>
          </div>
        </div>

        <!-- The reserved severity ladder. Exempt from the budget: it is state. -->
        <div class="dk-section wb-stack">
          <span class="dk-label">Status ladder — not for brand use</span>
          <span class="dk-bracket">5 LEVELS</span>
        </div>
        <div class="wb-swatches wb-stack" role="list">
          <div
            v-for="s in statusLevels"
            :key="s.name"
            class="wb-swatch"
            role="listitem"
            :style="{ background: `var(${s.token})`, color: `var(${s.fg})` }"
          >
            <span class="wb-swatch-name">{{ s.name }}</span>
          </div>
        </div>
        <p class="dk-small wb-measure-text wb-stack">
          Status colors are a dedicated severity ladder. They are never used for brand expression,
          decoration, or UI variety. Blue does not appear on the status ladder — the two systems
          are orthogonal by design.
        </p>
      </div>
    </section>

    <!-- ╭─ 02 · Typography ──────────────────────────────────────────╮ -->
    <section class="wb-band wb-band-alt">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">02 — Typography</span>
          <span class="dk-bracket">2 FACES · 7 STEPS</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Two voices.</h2>
          <p class="dk-body-lg wb-measure-text">
            Inter Variable for editorial statements. Geist Mono for everything operational.
            Human intelligence, machine precision.
          </p>
        </div>

        <div>
          <div v-for="(step, i) in typeScale" :key="i" class="wb-type-row">
            <span class="dk-pointer">{{ step.size }} · {{ step.face }}</span>
            <p
              class="wb-specimen"
              :data-face="step.face"
              :style="{ fontSize: step.size, fontWeight: step.weight }"
            >{{ step.specimen }}</p>
          </div>
        </div>

        <div class="dk-ledger wb-stack">
          <div class="dk-ledger-cell">
            <span class="dk-pointer">Display face</span>
            <span class="wb-specimen">Inter Variable</span>
            <span class="dk-small">Headlines · Pull quotes · Brand statements</span>
          </div>
          <div class="dk-ledger-cell" data-align="end">
            <span class="dk-pointer">Data face</span>
            <span class="wb-specimen" data-face="mono">Geist Mono</span>
            <span class="dk-small">UI labels · Telemetry · Code · Captions</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ 03 · Voice ───────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">03 — Voice</span>
          <span class="dk-bracket">4 SAMPLES</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Operational. Declarative.</h2>
          <p class="dk-body-lg wb-measure-text">
            Auterion does not inspire. It operates. Every word should sound like it came from
            an engineer who has flown the thing — not from an agency who has seen a pitch deck.
          </p>
        </div>

        <div class="wb-grid" data-cols="4">
          <article v-for="v in voiceSamples" :key="v.context" class="dk-card wb-tile">
            <span class="dk-label">{{ v.context }}</span>
            <blockquote class="dk-h2">"{{ v.text }}"</blockquote>
            <p class="dk-small">{{ v.note }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ╭─ 04 · Components ──────────────────────────────────────────╮ -->
    <section class="wb-band wb-band-alt">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">04 — Components</span>
          <span class="dk-bracket">3 ACTIONS · 5 INDICATORS</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Blue means go.</h2>
          <p class="dk-body-lg wb-measure-text">
            The brand blue appears on primary actions only. Secondary and ghost variants stay
            on the neutral ramp. One blue, one meaning.
          </p>
        </div>

        <div class="dk-card wb-tile">
          <span class="dk-label">Actions</span>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid">Deploy now <Icon name="arrow-right" size="xs" /></button>
            <button type="button" class="dk-cta">View fleet</button>
            <Button variant="ghost" size="sm">Sign in</Button>
          </div>
        </div>

        <div class="dk-card wb-tile wb-stack">
          <span class="dk-label">Indicators</span>
          <div class="wb-actions">
            <Badge variant="secondary">AuterionOS 4.2</Badge>
            <Badge variant="outline">New</Badge>
            <StatusBadge level="nominal" dot>All systems nominal</StatusBadge>
            <StatusBadge level="advisory" dot>3 vehicles in flight</StatusBadge>
            <StatusBadge level="alarm" dot>Battery below reserve</StatusBadge>
          </div>
        </div>

        <div class="dk-card wb-figure wb-stack">
          <div class="wb-metrics" data-cols="4" role="list">
            <div v-for="s in stats" :key="s.label" class="wb-metric" role="listitem">
              <span class="wb-figure-num">{{ s.value }}</span>
              <span class="dk-label">{{ s.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ 05 · Logo ────────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">05 — Logo</span>
          <span class="dk-bracket">3 TONES · 4 FILES</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Masters pending.</h2>
          <p class="dk-body-lg wb-measure-text">
            The brand package infrastructure is ready. Drop your SVG masters into
            <code class="wb-chip">packages/brand/assets/</code>
            following the naming convention below, then run the sync command.
          </p>
        </div>

        <div class="wb-grid" data-cols="3">
          <div v-for="slot in logoSlots" :key="slot.label" class="dk-card wb-figure">
            <div class="wb-stage" :data-tone="slot.tone">
              <span class="wb-stage-ph" aria-hidden="true">
                <span class="wb-stage-box" />
                <span class="wb-stage-word">Auterion</span>
              </span>
            </div>
            <div class="wb-tile">
              <span class="dk-label">{{ slot.label }}</span>
              <span class="dk-small">{{ slot.note }}</span>
            </div>
          </div>
        </div>

        <div class="dk-section wb-stack">
          <span class="dk-label">File naming convention</span>
          <span class="dk-bracket">4 MASTERS</span>
        </div>
        <div class="wb-grid" data-cols="2">
          <span v-for="lf in logoFiles" :key="lf.file" class="wb-rule-row">
            <code class="wb-chip">{{ lf.file }}</code>
            <span class="dk-small">{{ lf.desc }}</span>
          </span>
        </div>
        <div class="wb-rule-row">
          <code class="wb-chip">pnpm --filter @auxiliary/brand sync</code>
          <span class="dk-small">Run after adding any file — regenerates the registry</span>
        </div>
        <p class="dk-small wb-measure-text wb-stack">
          Marks must use <code class="wb-chip">currentColor</code> fills for mono and
          inverse tones so a single master SVG serves both dark and light surfaces. Ship a
          separate full-color file for the color tone.
        </p>
      </div>
    </section>

    <!-- ╭─ 06 · Motion ──────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">06 — Motion</span>
          <span class="dk-bracket">3 REGISTERS</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Instant feedback.</h2>
          <p class="dk-body-lg wb-measure-text">
            Motion in Auterion is informational, not decorative. State changes are immediate.
            Transitions imply precision — they do not delight.
          </p>
        </div>

        <div class="wb-grid" data-cols="3">
          <div v-for="m in motion" :key="m.name" class="dk-card wb-tile">
            <span class="dk-label">{{ m.name }}</span>
            <span class="dk-value dk-num">{{ m.rule }}</span>
            <p class="dk-body">{{ m.desc }}</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
