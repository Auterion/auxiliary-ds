<script setup lang="ts">
/**
 * Direction review harness — the room where AD-D-013 gets decided.
 *
 * Two candidates, one content set, side by side, under whichever theme and
 * register the reviewer picks:
 *
 *   A — the incumbent, "operational truth, expressed with precision". Already
 *       shipping across six demo surfaces and already specified in
 *       apps/docs/foundations/visual-language.md. It is entered as an incumbent,
 *       not a proposal — the review is a defence, not a derivation.
 *   B — "Anno 1965". Gerstner field grid, zero radius, zero shadow, steps(1)
 *       motion, mono display.
 *
 * The scoring panel is deliberately part of the page rather than a separate
 * document: the buildability finding is the one axis a reviewer cannot judge by
 * looking, and burying it in a markdown file is how it gets skipped.
 */
import { ref } from 'vue';
import { Register } from '@auxiliary/vue';
import DirectionContent from './DirectionContent.vue';

const THEMES = ['light', 'dark', 'sunlight', 'darknight'] as const;
const REGISTERS = ['expressive', 'operational'] as const;
type Theme = (typeof THEMES)[number];
type RegisterValue = (typeof REGISTERS)[number];

const theme = ref<Theme>('dark');
const register = ref<RegisterValue>('expressive');
/** Side-by-side reads the difference; solo reads the design. Both are needed. */
const solo = ref<'both' | 'a' | 'b'>('both');

/**
 * The buildability audit, counted from `_anno1965.css`. Update it there and
 * here together — the file is the evidence, this is the summary.
 */
const AUDIT = [
  { trait: 'Zero radius', how: 'token', detail: '--radius-* → 0.' },
  { trait: 'Zero shadow', how: 'token', detail: '--shadow-* → none.' },
  { trait: 'steps(1) motion', how: 'token', detail: '--ease-* → steps(1, end). Durations unchanged.' },
  {
    trait: 'Mono display voice',
    how: 'token',
    detail:
      '--font-display → var(--font-mono). One line, because AD-D-011 kept display and sans on one stack.',
  },
  {
    trait: 'Letterspaced uppercase',
    how: 'bespoke',
    detail: 'No tracking or case tokens exist. Would need a global.tracking.* family.',
  },
  {
    trait: 'Gerstner field grid',
    how: 'bespoke',
    detail: 'No column system at all — the gap AD-D-012 defers. ~60 lines of hand-authored layout.',
  },
  {
    trait: 'Display size correction',
    how: 'bespoke',
    detail: 'Geist Mono overruns the measure at --text-6xl; the type scale is not family-aware.',
  },
  {
    trait: 'Pill-shaped status badges',
    how: 'open',
    detail:
      '--radius-full is deliberately NOT zeroed here, so badges stay pills in a zero-radius language. Squaring them is one more token override — but it is a design call for the room, not a buildability limit.',
  },
] as const;

const tokenCount = AUDIT.filter((a) => a.how === 'token').length;
const bespokeCount = AUDIT.filter((a) => a.how === 'bespoke').length;
const scored = tokenCount + bespokeCount;
</script>

<template>
  <div class="dir-studio" :data-theme="theme">
    <header class="dir-bar">
      <div class="dir-bar-title">
        <strong>Direction review</strong>
        <span class="dir-bar-id">AD-D-013 · proposed</span>
      </div>

      <div class="dir-bar-controls">
        <div class="dir-seg" role="group" aria-label="Theme">
          <button
            v-for="t in THEMES"
            :key="t"
            type="button"
            :aria-pressed="theme === t"
            :class="{ on: theme === t }"
            @click="theme = t"
          >
            {{ t }}
          </button>
        </div>
        <div class="dir-seg" role="group" aria-label="Register">
          <button
            v-for="r in REGISTERS"
            :key="r"
            type="button"
            :aria-pressed="register === r"
            :class="{ on: register === r }"
            @click="register = r"
          >
            {{ r }}
          </button>
        </div>
        <div class="dir-seg" role="group" aria-label="Candidates shown">
          <button type="button" :aria-pressed="solo === 'both'" :class="{ on: solo === 'both' }" @click="solo = 'both'">
            both
          </button>
          <button type="button" :aria-pressed="solo === 'a'" :class="{ on: solo === 'a' }" @click="solo = 'a'">
            A only
          </button>
          <button type="button" :aria-pressed="solo === 'b'" :class="{ on: solo === 'b' }" @click="solo = 'b'">
            B only
          </button>
        </div>
      </div>
    </header>

    <div class="dir-columns" :data-solo="solo">
      <!-- Candidate A — the incumbent -->
      <section v-if="solo !== 'b'" class="dir-column">
        <div class="dir-column-head">
          <h2>A · Mono-neutral <span class="dir-tag">incumbent</span></h2>
          <p>Operational truth, expressed with precision. Swiss / NASA-JPL restraint.</p>
        </div>
        <Register :value="register">
          <div class="dir-stage">
            <DirectionContent />
          </div>
        </Register>
      </section>

      <!-- Candidate B — the challenger. data-direction nests INSIDE the
           register element on purpose; see the header of _anno1965.css. -->
      <section v-if="solo !== 'a'" class="dir-column">
        <div class="dir-column-head">
          <h2>B · Anno 1965 <span class="dir-tag">challenger</span></h2>
          <p>Gerstner field grid, zero radius, zero shadow, steps(1) motion, mono display.</p>
        </div>
        <Register :value="register">
          <div data-direction="anno-1965" class="dir-stage">
            <DirectionContent />
          </div>
        </Register>
      </section>
    </div>

    <section class="dir-audit">
      <h2>Buildability — the axis you cannot see</h2>
      <p class="dir-audit-lede">
        AD-D-013 requires the challenger to be expressible as a token override plus a register
        value. It is <strong>{{ tokenCount }} of {{ scored }}</strong> — the remaining
        <strong>{{ bespokeCount }}</strong> need CSS the token layer has no vocabulary for.
        Evidence is <code>_anno1965.css</code>, split into exactly those two halves. The last row
        is not a buildability result; it is a question for the room.
      </p>
      <table class="dir-audit-table">
        <thead>
          <tr>
            <th>Characteristic</th>
            <th>Expressible?</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in AUDIT" :key="row.trait" :data-how="row.how">
            <td>{{ row.trait }}</td>
            <td>
              <span class="dir-how">
                {{
                  row.how === 'token'
                    ? 'token override'
                    : row.how === 'bespoke'
                      ? 'bespoke CSS'
                      : 'open question'
                }}
              </span>
            </td>
            <td>{{ row.detail }}</td>
          </tr>
        </tbody>
      </table>
      <p class="dir-audit-note">
        The three failures are not three independent problems — they cluster on two gaps:
        <strong>no tracking/case tokens</strong> and <strong>no column system</strong>. The second
        is already logged as deferred in
        AD-D-012 — this is the evidence that it is load-bearing rather than cosmetic, and the
        loser's contribution to the winner regardless of which way the review goes.
      </p>
    </section>
  </div>
</template>

<style scoped>
.dir-studio {
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  padding-bottom: var(--spacing-24);
}

.dir-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-6);
  background: var(--card);
  border-bottom: var(--border-width-1) solid var(--border);
}

.dir-bar-title {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-3);
}

.dir-bar-id {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--muted-foreground);
}

.dir-bar-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.dir-seg {
  display: inline-flex;
  border: var(--border-width-1) solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.dir-seg button {
  padding: var(--spacing-1) var(--spacing-2);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--muted-foreground);
  background: transparent;
  border: 0;
  border-right: var(--border-width-1) solid var(--border);
  cursor: pointer;
}

.dir-seg button:last-child {
  border-right: 0;
}

.dir-seg button.on {
  color: var(--primary-foreground);
  background: var(--primary);
}

.dir-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-6);
  padding: var(--spacing-6);
  align-items: start;
}

.dir-columns[data-solo='a'],
.dir-columns[data-solo='b'] {
  grid-template-columns: minmax(0, 64rem);
  justify-content: center;
}

.dir-column-head {
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-2);
  border-bottom: var(--border-width-2) solid var(--foreground);
}

.dir-column-head h2 {
  font-size: var(--text-title);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.dir-column-head p {
  margin-top: var(--spacing-1);
  font-size: var(--text-caption);
  color: var(--muted-foreground);
}

.dir-tag {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-foreground);
}

.dir-audit {
  max-width: 72rem;
  margin: 0 auto;
  padding: var(--spacing-8) var(--spacing-6);
  border-top: var(--border-width-2) solid var(--foreground);
}

.dir-audit h2 {
  font-size: var(--text-heading);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-3);
}

.dir-audit-lede,
.dir-audit-note {
  max-width: 68ch;
  color: var(--muted-foreground);
  margin-bottom: var(--spacing-4);
}

.dir-audit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-caption);
}

.dir-audit-table th,
.dir-audit-table td {
  text-align: left;
  padding: var(--spacing-2) var(--spacing-3);
  border-bottom: var(--border-width-1) solid var(--border);
  vertical-align: top;
}

.dir-audit-table th {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-foreground);
}

.dir-how {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  white-space: nowrap;
}

/* Status hues are reserved (AD-D-014) — the audit is not a status, so it reads
   through weight and the muted/foreground pair rather than through a colour. */
.dir-audit-table tr[data-how='bespoke'] .dir-how {
  color: var(--foreground);
  font-weight: var(--font-weight-semibold);
}

.dir-audit-table tr[data-how='token'] .dir-how {
  color: var(--muted-foreground);
}

.dir-audit-table tr[data-how='open'] .dir-how {
  color: var(--foreground);
  font-style: italic;
}

@media (max-width: 1200px) {
  .dir-columns {
    grid-template-columns: 1fr;
  }
}
</style>
