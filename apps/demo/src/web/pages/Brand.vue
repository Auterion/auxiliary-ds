<!--
  Hallmark · macrostructure: Manifesto · tone: technical-austere · anchor hue: blue
  pre-emit critique: P5 H5 E4 S4 R5 V4
  theme: custom (vibe: "precision aerospace light chromatic anchor" ·
    paper: oklch(0.98 0.004 247) · accent: oklch(0.546 0.245 262.881) blue ·
    Inter Variable display + Geist Mono data)
-->
<script setup lang="ts">
import { Button, Badge, StatusBadge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';

// Auterion blue family — color.primitive.auterion-blue.* in packages/tokens
// The brand token (--brand) maps to auterion-blue.DEFAULT in all themes.
// Dark mode backgrounds and surfaces use the night/shade/surface/edge slots.
const blueRamp = [
  { shade: 'night',   val: 'oklch(0.17 0.06 265)',  label: 'Night',   note: 'Dark mode background'   },
  { shade: 'shade',   val: 'oklch(0.21 0.07 265)',  label: 'Shade',   note: 'Dark mode card'          },
  { shade: 'surface', val: 'oklch(0.25 0.08 265)',  label: 'Surface', note: 'Dark mode secondary'     },
  { shade: 'edge',    val: 'oklch(0.30 0.09 265)',  label: 'Edge',    note: 'Dark mode border'        },
  { shade: 'DEFAULT', val: 'oklch(0.46 0.285 265)', label: 'Brand',   note: 'var(--brand)'            },
  { shade: 'light',   val: 'oklch(0.62 0.22 264)',  label: 'Light',   note: 'Focus ring / tint'       },
  { shade: 'tint',    val: 'oklch(0.96 0.018 264)', label: 'Tint',    note: 'Light mode hover surface'},
] as const;

const statusLevels = [
  { name: 'alarm',    token: '--alarm',    fg: '--alarm-foreground'    },
  { name: 'warning',  token: '--warning',  fg: '--warning-foreground'  },
  { name: 'caution',  token: '--caution',  fg: '--caution-foreground'  },
  { name: 'advisory', token: '--advisory', fg: '--advisory-foreground' },
  { name: 'nominal',  token: '--nominal',  fg: '--nominal-foreground'  },
] as const;

const typeScale = [
  { size: '64px', weight: '600', mono: false, specimen: 'Autonomous.' },
  { size: '40px', weight: '600', mono: false, specimen: 'Precision at scale.' },
  { size: '28px', weight: '500', mono: false, specimen: 'One stack, silicon to fleet.' },
  { size: '20px', weight: '500', mono: false, specimen: 'Mission-ready software.' },
  { size: '16px', weight: '400', mono: false, specimen: 'One software platform to build, deploy and command intelligent vehicles at scale.' },
  { size: '13px', weight: '400', mono: false, specimen: 'Trusted across defense, enterprise and public safety in over 60 countries.' },
  { size: '11px', weight: '500', mono: true,  specimen: 'FLEET STATUS · NOMINAL · 12 ms LATENCY' },
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
  { label: 'lockup-horizontal — color',   bg: 'var(--background)', bordered: true,  inverse: false, note: 'Primary mark. Light backgrounds.' },
  { label: 'lockup-horizontal — inverse', bg: 'var(--foreground)', bordered: false, inverse: true,  note: 'Dark backgrounds. White fills.' },
  { label: 'mark — mono',                 bg: 'var(--card)',        bordered: true,  inverse: false, note: 'Favicon / app icon / small contexts.' },
] as const;

const logoFiles = [
  { file: 'auterion--lockup-horizontal--color.svg',   desc: 'Primary mark, color tone'  },
  { file: 'auterion--lockup-horizontal--mono.svg',    desc: 'Single-color (black fills)' },
  { file: 'auterion--lockup-horizontal--inverse.svg', desc: 'Reversed (white fills)'     },
  { file: 'auterion--mark--color.svg',                desc: 'Symbol / favicon'           },
] as const;
</script>

<template>
  <div class="bp">

    <!-- ══ HERO — Blue left / statement right ════════════════════ -->
    <section class="bp-hero">
      <div class="bp-hero__blue">
        <div class="bp-hero__mark-row">
          <span class="bp-hero__mark-icon" aria-hidden="true" />
          <span class="bp-hero__wordmark">Auterion</span>
        </div>
        <p class="bp-hero__sub">Brand Identity System · 2026</p>
      </div>

      <div class="bp-hero__statement">
        <p class="bp-hero__principle">
          Precision.<br>Scale.<br>Autonomy.
        </p>
        <p class="bp-hero__desc">
          Auterion's identity is built on operational clarity, technical confidence, and the
          restraint that comes from building for real-world consequence. No aspiration language.
          No ambient glow. Blue means go.
        </p>
      </div>
    </section>

    <!-- ══ 01 · COLOR ════════════════════════════════════════════ -->
    <section class="bp-section">
      <header class="bp-section__head">
        <span class="bp-eyebrow">01 — Color</span>
        <h2 class="bp-h2">Blue as identity.</h2>
        <p class="bp-lead">
          The brand blue is not decorative. It is the single chromatic anchor — reserved for
          primary actions, brand marks, and moments that demand attention. Everything else stays
          on the neutral ramp.
        </p>
      </header>

      <div class="bp-ramp" role="img" aria-label="Auterion blue color family">
        <div
          v-for="sw in blueRamp"
          :key="sw.shade"
          class="bp-ramp__swatch"
          :class="sw.shade === 'DEFAULT' ? 'bp-ramp__swatch--brand' : ''"
          :style="{ background: sw.val }"
        >
          <span
            class="bp-ramp__shade"
            :style="{ color: ['night','shade','surface','edge'].includes(sw.shade) ? 'rgba(255,255,255,0.45)' : sw.shade === 'DEFAULT' ? 'rgba(255,255,255,0.9)' : 'oklch(0.282 0.091 267.935)' }"
          >{{ sw.label }}</span>
          <span v-if="sw.shade === 'DEFAULT'" class="bp-ramp__brand-pill">Brand</span>
        </div>
      </div>
      <!-- Swatch notes -->
      <div class="bp-ramp-notes">
        <div v-for="sw in blueRamp" :key="sw.shade + '_note'" class="bp-ramp-note">
          <span class="bp-meta-label" style="font-size: 8px">{{ sw.note }}</span>
        </div>
      </div>

      <dl class="bp-token-grid">
        <div class="bp-token-grid__item">
          <dt class="bp-meta-label">CSS token</dt>
          <dd><code class="bp-code">var(--brand)</code></dd>
        </div>
        <div class="bp-token-grid__item">
          <dt class="bp-meta-label">OKLCH</dt>
          <dd><code class="bp-code">oklch(0.46 0.285 265)</code></dd>
        </div>
        <div class="bp-token-grid__item">
          <dt class="bp-meta-label">Primitive</dt>
          <dd><code class="bp-code">auterion-blue.DEFAULT</code></dd>
        </div>
        <div class="bp-token-grid__item">
          <dt class="bp-meta-label">Usage</dt>
          <dd><code class="bp-code">CTA · Mark · Panel fill · Accent</code></dd>
        </div>
      </dl>

      <div class="bp-status-block">
        <p class="bp-meta-label" style="margin-bottom: 10px">Status ladder — not for brand use</p>
        <div class="bp-status-row" role="list">
          <div
            v-for="s in statusLevels"
            :key="s.name"
            class="bp-status-cell"
            :style="{ background: `var(${s.token})`, color: `var(${s.fg})` }"
            role="listitem"
          >
            <span class="bp-status-label">{{ s.name.toUpperCase() }}</span>
          </div>
        </div>
        <p class="bp-footnote">
          Status colors are a dedicated severity ladder. They are never used for brand expression,
          decoration, or UI variety. Blue does not appear on the status ladder — the two systems
          are orthogonal by design.
        </p>
      </div>
    </section>

    <!-- ══ 02 · TYPOGRAPHY — dark panel ══════════════════════════ -->
    <section class="bp-type-panel">
      <div class="bp-type-panel__inner">
        <header class="bp-section__head">
          <span class="bp-eyebrow bp-eyebrow--inv">02 — Typography</span>
          <h2 class="bp-h2 bp-h2--inv">Two voices.</h2>
          <p class="bp-lead bp-lead--inv">
            Inter Variable for editorial statements. Geist Mono for everything operational.
            Human intelligence, machine precision.
          </p>
        </header>

        <div class="bp-type-scale">
          <div v-for="(step, i) in typeScale" :key="i" class="bp-type-scale__row">
            <span class="bp-type-scale__meta">{{ step.size }} · {{ step.mono ? 'mono' : 'display' }}</span>
            <p
              class="bp-type-scale__specimen"
              :class="step.mono ? 'bp-type-scale__specimen--mono' : 'bp-type-scale__specimen--display'"
              :style="{ fontSize: step.size, fontWeight: step.weight, lineHeight: '1.1' }"
            >{{ step.specimen }}</p>
          </div>
        </div>

        <div class="bp-type-rule">
          <div class="bp-type-rule__item">
            <span class="bp-eyebrow bp-eyebrow--inv">Display face</span>
            <p class="bp-type-rule__face bp-type-rule__face--display">Inter Variable</p>
            <p class="bp-type-rule__when">Headlines · Pull quotes · Brand statements</p>
          </div>
          <div class="bp-type-rule__divider" aria-hidden="true" />
          <div class="bp-type-rule__item">
            <span class="bp-eyebrow bp-eyebrow--inv">Data face</span>
            <p class="bp-type-rule__face bp-type-rule__face--mono">Geist Mono</p>
            <p class="bp-type-rule__when">UI labels · Telemetry · Code · Captions</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 03 · VOICE ════════════════════════════════════════════ -->
    <section class="bp-section">
      <header class="bp-section__head">
        <span class="bp-eyebrow">03 — Voice</span>
        <h2 class="bp-h2">Operational. Declarative.</h2>
        <p class="bp-lead">
          Auterion does not inspire. It operates. Every word should sound like it came from
          an engineer who has flown the thing — not from an agency who has seen a pitch deck.
        </p>
      </header>

      <div class="bp-voice-grid">
        <article v-for="v in voiceSamples" :key="v.context" class="bp-voice-card">
          <span class="bp-meta-label">{{ v.context }}</span>
          <blockquote class="bp-voice-card__quote">"{{ v.text }}"</blockquote>
          <p class="bp-voice-card__note">{{ v.note }}</p>
        </article>
      </div>
    </section>

    <!-- ══ 04 · COMPONENTS ════════════════════════════════════════ -->
    <section class="bp-section">
      <header class="bp-section__head">
        <span class="bp-eyebrow">04 — Components</span>
        <h2 class="bp-h2">Blue means go.</h2>
        <p class="bp-lead">
          The brand blue appears on primary actions only. Secondary and ghost variants stay
          on the neutral ramp. One blue, one meaning.
        </p>
      </header>

      <div class="bp-comp-group">
        <span class="bp-meta-label" style="margin-bottom: 12px">Actions</span>
        <div class="bp-comp-row">
          <Button size="lg" class="gap-2" style="background: var(--brand); color: var(--brand-foreground)">
            Deploy now <Icon name="arrow-right" size="xs" />
          </Button>
          <Button variant="secondary" size="lg">View fleet</Button>
          <Button variant="ghost" size="lg">Sign in</Button>
        </div>
      </div>

      <div class="bp-comp-group">
        <span class="bp-meta-label" style="margin-bottom: 12px">Indicators</span>
        <div class="bp-comp-row">
          <Badge variant="secondary">AuterionOS 4.2</Badge>
          <Badge variant="outline">New</Badge>
          <StatusBadge level="nominal" dot>All systems nominal</StatusBadge>
          <StatusBadge level="advisory" dot>3 vehicles in flight</StatusBadge>
          <StatusBadge level="warning" dot>Battery critical</StatusBadge>
        </div>
      </div>

      <div class="bp-stat-strip" role="list">
        <div class="bp-stat-strip__item" role="listitem">
          <p class="bp-stat-strip__val" style="color: var(--brand)">2M+</p>
          <p class="bp-stat-strip__label">Flight hours logged</p>
        </div>
        <div class="bp-stat-strip__item" role="listitem">
          <p class="bp-stat-strip__val">10,000+</p>
          <p class="bp-stat-strip__label">Vehicles deployed</p>
        </div>
        <div class="bp-stat-strip__item" role="listitem">
          <p class="bp-stat-strip__val">60+</p>
          <p class="bp-stat-strip__label">Countries</p>
        </div>
        <div class="bp-stat-strip__item" role="listitem">
          <p class="bp-stat-strip__val">99.9%</p>
          <p class="bp-stat-strip__label">Fleet uptime</p>
        </div>
      </div>
    </section>

    <!-- ══ 05 · LOGO ══════════════════════════════════════════════ -->
    <section class="bp-section">
      <header class="bp-section__head">
        <span class="bp-eyebrow">05 — Logo</span>
        <h2 class="bp-h2">Masters pending.</h2>
        <p class="bp-lead">
          The brand package infrastructure is ready. Drop your SVG masters into
          <code class="bp-code-inline">packages/brand/assets/</code>
          following the naming convention below, then run the sync command.
        </p>
      </header>

      <div class="bp-logo-slots">
        <div v-for="slot in logoSlots" :key="slot.label" class="bp-logo-slot">
          <div
            class="bp-logo-slot__preview"
            :style="{ background: slot.bg, border: slot.bordered ? '1px solid var(--border)' : 'none' }"
          >
            <div class="bp-logo-slot__ph" :style="{ opacity: 0.3 }">
              <span
                class="bp-logo-slot__box"
                :style="{ borderColor: slot.inverse ? 'rgba(255,255,255,0.5)' : 'var(--border)' }"
                aria-hidden="true"
              />
              <span
                class="bp-logo-slot__word"
                :style="{ color: slot.inverse ? 'rgba(255,255,255,0.8)' : 'var(--foreground)' }"
              >Auterion</span>
            </div>
          </div>
          <div class="bp-logo-slot__meta">
            <p class="bp-meta-label">{{ slot.label }}</p>
            <p class="bp-logo-slot__note">{{ slot.note }}</p>
          </div>
        </div>
      </div>

      <div class="bp-logo-guide">
        <p class="bp-meta-label" style="margin-bottom: 14px">File naming convention</p>
        <div class="bp-logo-guide__files">
          <div v-for="lf in logoFiles" :key="lf.file" class="bp-logo-guide__row">
            <code class="bp-code">{{ lf.file }}</code>
            <span class="bp-logo-guide__desc">{{ lf.desc }}</span>
          </div>
        </div>
        <div class="bp-logo-guide__cmd">
          <code class="bp-code">pnpm --filter @auxiliary/brand sync</code>
          <span class="bp-logo-guide__desc">Run after adding any file — regenerates the registry</span>
        </div>
        <p class="bp-footnote">
          Marks must use <code class="bp-code-inline">currentColor</code> fills for mono and
          inverse tones so a single master SVG serves both dark and light surfaces. Ship a
          separate full-color file for the color tone.
        </p>
      </div>
    </section>

    <!-- ══ 06 · MOTION ════════════════════════════════════════════ -->
    <section class="bp-section">
      <header class="bp-section__head">
        <span class="bp-eyebrow">06 — Motion</span>
        <h2 class="bp-h2">Instant feedback.</h2>
        <p class="bp-lead">
          Motion in Auterion is informational, not decorative. State changes are immediate.
          Transitions imply precision — they do not delight.
        </p>
      </header>

      <div class="bp-motion-grid">
        <div class="bp-motion-card">
          <p class="bp-motion-card__name">Operational register</p>
          <p class="bp-motion-card__rule">100–150 ms · ease-out</p>
          <p class="bp-motion-card__desc">Instant feedback. Opacity and color only. Used in product UI wherever latency matters to the operator.</p>
        </div>
        <div class="bp-motion-card">
          <p class="bp-motion-card__name">Editorial register</p>
          <p class="bp-motion-card__rule">200–300 ms · ease-out · on-scroll</p>
          <p class="bp-motion-card__desc">Subtle entrance for marketing sections. No parallax, no looping animation, no bounce. One property at a time.</p>
        </div>
        <div class="bp-motion-card">
          <p class="bp-motion-card__name">Reduced motion</p>
          <p class="bp-motion-card__rule">≤ 150 ms opacity crossfade only</p>
          <p class="bp-motion-card__desc">All spatial motion collapses to a simple opacity transition when the user has requested reduced motion. No exceptions.</p>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/*
 * Hallmark · macrostructure: Manifesto · tone: technical-austere · anchor hue: blue
 * pre-emit critique: P5 H5 E4 S4 R5 V4
 * custom: Inter Variable display + Geist Mono data · paper near-white · brand oklch(0.546 0.245 262.881)
 */

.bp {
  --font-display: 'Inter', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  overflow-x: clip;
  min-height: 100vh;
}

/* ── Hero ──────────────────────────────────────────────────────── */
.bp-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 460px;
}

@media (max-width: 768px) {
  .bp-hero { grid-template-columns: 1fr; min-height: auto; }
}

.bp-hero__blue {
  background: var(--brand);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 56px 40px;
}

.bp-hero__mark-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bp-hero__mark-icon {
  display: block;
  width: 34px;
  height: 34px;
  border: 2px solid rgba(255 255 255 / 0.45);
  border-radius: 5px;
  flex-shrink: 0;
}

.bp-hero__wordmark {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: oklch(0.97 0.014 254.604);
}

.bp-hero__sub {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: rgba(255 255 255 / 0.45);
}

.bp-hero__statement {
  background: var(--background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px 48px;
  gap: 18px;
}

.bp-hero__principle {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 54px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--foreground);
  overflow-wrap: anywhere;
  min-width: 0;
  margin: 0;
}

.bp-hero__desc {
  font-size: 14px;
  line-height: 1.65;
  color: var(--muted-foreground);
  max-width: 380px;
  margin: 0;
}

/* ── Sections ──────────────────────────────────────────────────── */
.bp-section {
  padding: 68px 48px;
  border-top: 1px solid var(--border);
  max-width: 1060px;
  margin: 0 auto;
}

@media (max-width: 768px) { .bp-section { padding: 48px 20px; } }

.bp-section__head { margin-bottom: 36px; }

/* ── Typography primitives ─────────────────────────────────────── */
.bp-eyebrow {
  display: block;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  margin-bottom: 10px;
}

.bp-eyebrow--inv { color: rgba(255 255 255 / 0.4); }

.bp-h2 {
  font-family: var(--font-display);
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: var(--foreground);
  margin: 0 0 10px;
  overflow-wrap: anywhere;
  min-width: 0;
}

.bp-h2--inv { color: oklch(0.97 0.014 254.604); }

.bp-lead {
  font-size: 15px;
  line-height: 1.65;
  color: var(--muted-foreground);
  max-width: 560px;
  margin: 0;
}

.bp-lead--inv { color: rgba(255 255 255 / 0.5); }

.bp-meta-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.bp-footnote {
  font-size: 12px;
  line-height: 1.65;
  color: var(--muted-foreground);
  margin: 12px 0 0;
}

.bp-code {
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  color: var(--foreground);
  white-space: nowrap;
}

.bp-code-inline {
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 4px;
  color: var(--foreground);
}

/* ── Color ramp ────────────────────────────────────────────────── */
.bp-ramp {
  display: flex;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  height: 72px;
  margin-bottom: 0;
}

.bp-ramp-notes {
  display: flex;
  border-radius: 0 0 12px 12px;
  border: 1px solid var(--border);
  border-top: none;
  overflow: hidden;
  margin-bottom: 20px;
}

.bp-ramp-note {
  flex: 1;
  padding: 6px 4px;
  border-right: 1px solid var(--border);
  background: var(--card);
}

.bp-ramp-note:last-child { border-right: none; }

@media (max-width: 375px) { .bp-ramp { height: 52px; } }

.bp-ramp__swatch {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 5px;
  position: relative;
}

.bp-ramp__swatch--brand { flex: 3; }

.bp-ramp__shade {
  font-family: var(--font-mono);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1;
}

.bp-ramp__brand-pill {
  position: absolute;
  top: 7px;
  left: 8px;
  font-family: var(--font-mono);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255 255 255 / 0.7);
  background: rgba(255 255 255 / 0.14);
  padding: 2px 7px;
  border-radius: 100px;
}

/* ── Token grid ────────────────────────────────────────────────── */
.bp-token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  padding: 20px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 32px;
}

.bp-token-grid__item { display: flex; flex-direction: column; gap: 6px; }

/* ── Status ladder ─────────────────────────────────────────────── */
.bp-status-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.bp-status-cell {
  padding: 14px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bp-status-label {
  font-family: var(--font-mono);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.1em;
}

@media (max-width: 414px) {
  .bp-status-label { font-size: 6px; letter-spacing: 0.05em; }
}

/* ── Type panel (dark) ─────────────────────────────────────────── */
.bp-type-panel {
  background: var(--foreground);
  border-top: 1px solid var(--border);
}

.bp-type-panel__inner {
  max-width: 1060px;
  margin: 0 auto;
  padding: 68px 48px;
}

@media (max-width: 768px) { .bp-type-panel__inner { padding: 48px 20px; } }

.bp-type-scale { display: flex; flex-direction: column; margin-bottom: 36px; }

.bp-type-scale__row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255 255 255 / 0.07);
}

@media (max-width: 600px) {
  .bp-type-scale__row { grid-template-columns: 1fr; gap: 4px; }
}

.bp-type-scale__meta {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255 255 255 / 0.3);
  flex-shrink: 0;
}

.bp-type-scale__specimen { overflow-wrap: anywhere; min-width: 0; margin: 0; }

.bp-type-scale__specimen--display {
  font-family: var(--font-display);
  letter-spacing: -0.025em;
  color: oklch(0.97 0.014 254.604);
}

.bp-type-scale__specimen--mono {
  font-family: var(--font-mono);
  font-size: 11px !important;
  font-weight: 500 !important;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255 255 255 / 0.45);
}

/* ── Type pairing block ────────────────────────────────────────── */
.bp-type-rule {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  padding: 28px;
  background: rgba(255 255 255 / 0.04);
  border: 1px solid rgba(255 255 255 / 0.08);
  border-radius: 12px;
}

@media (max-width: 600px) {
  .bp-type-rule { grid-template-columns: 1fr; gap: 20px; }
  .bp-type-rule__divider { display: none; }
}

.bp-type-rule__item { display: flex; flex-direction: column; gap: 8px; }

.bp-type-rule__face {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: oklch(0.97 0.014 254.604);
  margin: 0;
}

.bp-type-rule__face--display { font-family: var(--font-display); }
.bp-type-rule__face--mono    { font-family: var(--font-mono); }

.bp-type-rule__when { font-size: 12px; color: rgba(255 255 255 / 0.4); margin: 0; }

.bp-type-rule__divider {
  width: 1px;
  height: 44px;
  background: rgba(255 255 255 / 0.1);
}

/* ── Voice grid ────────────────────────────────────────────────── */
.bp-voice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.bp-voice-card {
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bp-voice-card__quote {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--foreground);
  margin: 0;
  overflow-wrap: anywhere;
  min-width: 0;
}

.bp-voice-card__note { font-size: 12px; line-height: 1.6; color: var(--muted-foreground); margin: 0; }

/* ── Component groups ──────────────────────────────────────────── */
.bp-comp-group { margin-bottom: 24px; }

.bp-comp-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }

/* ── Stat strip ────────────────────────────────────────────────── */
.bp-stat-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.bp-stat-strip__item {
  padding: 22px 18px;
  border-right: 1px solid var(--border);
  background: var(--card);
}

.bp-stat-strip__item:last-child { border-right: none; }

.bp-stat-strip__val {
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--foreground);
  margin: 0 0 5px;
}

.bp-stat-strip__label { font-size: 12px; color: var(--muted-foreground); margin: 0; }

@media (max-width: 414px) {
  .bp-stat-strip { grid-template-columns: 1fr 1fr; }
  .bp-stat-strip__item:nth-child(2) { border-right: none; }
  .bp-stat-strip__item:nth-child(3),
  .bp-stat-strip__item:nth-child(4) { border-top: 1px solid var(--border); }
}

/* ── Logo slots ────────────────────────────────────────────────── */
.bp-logo-slots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.bp-logo-slot {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.bp-logo-slot__preview {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bp-logo-slot__ph { display: flex; align-items: center; gap: 10px; }

.bp-logo-slot__box {
  display: block;
  width: 26px;
  height: 26px;
  border: 2px solid currentColor;
  border-radius: 3px;
  flex-shrink: 0;
}

.bp-logo-slot__word {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.bp-logo-slot__meta {
  padding: 12px 14px;
  background: var(--card);
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bp-logo-slot__note { font-size: 11px; color: var(--muted-foreground); margin: 0; }

/* ── Logo guide ────────────────────────────────────────────────── */
.bp-logo-guide {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bp-logo-guide__files {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.bp-logo-guide__row { display: flex; flex-direction: column; gap: 4px; }

.bp-logo-guide__desc { font-size: 11px; color: var(--muted-foreground); }

.bp-logo-guide__cmd {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
}

/* ── Motion grid ───────────────────────────────────────────────── */
.bp-motion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.bp-motion-card {
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bp-motion-card__name {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
}

.bp-motion-card__rule {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--brand);
  text-transform: uppercase;
  margin: 0;
}

.bp-motion-card__desc { font-size: 13px; line-height: 1.6; color: var(--muted-foreground); margin: 5px 0 0; }

@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 150ms !important; animation-duration: 150ms !important; }
}
</style>
