<script setup lang="ts">
/**
 * Direction review harness — the room where AD-D-013 gets decided.
 *
 * Three candidates over one content set, under whichever theme, register and
 * accent the reviewer picks:
 *
 *   A — the incumbent, "operational truth, expressed with precision". Already
 *       shipping across six demo surfaces and already specified in
 *       apps/docs/foundations/visual-language.md. It is entered as an incumbent,
 *       not a proposal — the review is a defence, not a derivation.
 *   B — "Anno 1965". Gerstner field grid, zero radius, zero shadow, steps(1)
 *       motion, mono display.
 *   C — "Sera", the shadcn/ui preset beXRTDCy. Zinc, Inter, radius none,
 *       uppercase letterspaced headings. Read off the preset's own panel, not
 *       guessed — see _sera.css, including the awkward part: on geometry it
 *       largely converges with A and B.
 *
 * ACCENT IS ITS OWN AXIS, not a property of a candidate. A candidate is a
 * language; an accent is a hue decision (AD-D-010). Bundling them would confound
 * the review — a winner would be ambiguous between the two — so the picker
 * applies across all three, the way theme and register already do.
 *
 * Both panels below are deliberately part of the page rather than separate
 * documents. Buildability and colour separation are the two axes a reviewer
 * cannot judge by looking, and burying them in markdown is how they get skipped.
 */
import { computed, ref } from 'vue';
import { Register } from '@auxiliary/vue';
import DirectionContent from './DirectionContent.vue';
import { LEVELS, parseOklch, separation, type ThemeName } from './separation';

const THEMES = ['light', 'dark', 'sunlight', 'darknight'] as const;
const REGISTERS = ['expressive', 'operational'] as const;
type RegisterValue = (typeof REGISTERS)[number];

/**
 * The accent set, carrying the *exact* primitive values `_accents.css` applies.
 * Two per accent, because the step changes with the ground: a 600/700 fill goes
 * to a hole on near-black, so dark themes take the 400. The readout has to
 * measure what actually ships under the theme you are looking at, not a nominal
 * 500 — measuring the wrong step would be worse than not measuring.
 *
 * Mono is null: it sets nothing, and leaves the status ladder as the only
 * chromatic thing on screen.
 */
const ACCENTS = [
  { key: 'mono', label: 'mono', light: null, dark: null, note: 'no accent — AD-D-010 direction A' },
  {
    key: 'ultramarine',
    label: 'ultramarine',
    light: 'oklch(0.548 0.245 264)',
    dark: 'oklch(0.709 0.170 264)',
    note: 'auterion-blue 600 / 400 — AD-D-010 direction B',
  },
  {
    key: 'sky',
    label: 'sky',
    light: 'oklch(0.5 0.134 242.749)',
    dark: 'oklch(0.746 0.16 232.661)',
    note: 'sky 700 / 400 — challenger',
  },
  {
    key: 'teal',
    label: 'teal',
    light: 'oklch(0.511 0.096 186.391)',
    dark: 'oklch(0.777 0.152 181.912)',
    note: 'teal 700 / 400 — challenger',
  },
] as const;

/** Which ground a theme presents — the same split `_accents.css` selects on. */
const DARK_GROUND: ReadonlySet<ThemeName> = new Set<ThemeName>(['dark', 'darknight']);

const theme = ref<ThemeName>('dark');
const register = ref<RegisterValue>('expressive');
const accent = ref<(typeof ACCENTS)[number]['key']>('mono');
/** Side-by-side reads the difference; solo reads the design. Both are needed. */
const solo = ref<'all' | 'a' | 'b' | 'c'>('all');

const activeAccent = computed(() => ACCENTS.find((a) => a.key === accent.value)!);
const activeAccentValue = computed(() =>
  DARK_GROUND.has(theme.value) ? activeAccent.value.dark : activeAccent.value.light,
);

/**
 * Live separation between the chosen accent and the reserved ladder, measured
 * with the same maths as the tokens package (see separation.ts). There is no
 * ratified floor — that is the finding, not an oversight.
 */
const sep = computed(() =>
  separation(activeAccentValue.value ? parseOklch(activeAccentValue.value) : null, theme.value),
);

/**
 * The full matrix — every chromatic accent against every theme's ladder.
 *
 * Built after the single-theme readout showed why one number is not enough:
 * teal's collision is *ground-specific*. On a light ground it takes the 700 step
 * and lands next to `advisory` (0.113, and 0.080 once you simulate dichromacy);
 * on a dark ground it takes the 400 step and is nowhere near it. Quoting only
 * the light figures while the studio sat on `dark` would have looked like an
 * overstatement, and quoting only the current theme would have hidden the
 * failure entirely. So: show all twelve cells and let the worst one speak.
 */
const MATRIX = computed(() =>
  ACCENTS.filter((a) => a.light).map((a) => ({
    key: a.key,
    label: a.label,
    cells: THEMES.map((t) => {
      const value = DARK_GROUND.has(t) ? a.dark : a.light;
      const s = separation(value ? parseOklch(value) : null, t);
      return { theme: t, s };
    }),
  })),
);

/** Worst CVD separation for an accent across all four themes. */
const worstOf = (cells: { s: ReturnType<typeof separation> }[]) =>
  Math.min(...cells.map((c) => c.s?.minCvd ?? Infinity));

/**
 * The buildability audit, counted from `_anno1965.css` and `_sera.css`. Update
 * those and this together — the CSS files are the evidence, this is the summary.
 */
const AUDIT = [
  { cand: 'B', trait: 'Zero radius', how: 'token', detail: '--radius-* → 0.' },
  { cand: 'B', trait: 'Zero shadow', how: 'token', detail: '--shadow-* → none.' },
  {
    cand: 'B',
    trait: 'steps(1) motion',
    how: 'token',
    detail: '--ease-* → steps(1, end). Durations unchanged.',
  },
  {
    cand: 'B',
    trait: 'Mono display voice',
    how: 'token',
    detail:
      '--font-display → var(--font-mono). One line, because AD-D-011 kept display and sans on one stack.',
  },
  {
    cand: 'B',
    trait: 'Letterspaced uppercase',
    how: 'bespoke',
    detail: 'No tracking or case tokens exist. Would need a global.tracking.* family.',
  },
  {
    cand: 'B',
    trait: 'Gerstner field grid',
    how: 'bespoke',
    detail: 'No column system at all — the gap AD-D-012 defers. ~60 lines of hand-authored layout.',
  },
  {
    cand: 'B',
    trait: 'Display size correction',
    how: 'bespoke',
    detail: 'Geist Mono overruns the measure at --text-6xl; the type scale is not family-aware.',
  },
  { cand: 'C', trait: 'Zero radius', how: 'token', detail: '--radius-* → 0. Same override as B.' },
  { cand: 'C', trait: 'Flat fills, no elevation', how: 'token', detail: '--shadow-* → none.' },
  {
    cand: 'C',
    trait: 'Tinted card on ground',
    how: 'token',
    detail: '--card → var(--muted). Re-resolves per theme, so it survives the theme axis.',
  },
  {
    cand: 'C',
    trait: 'Inter as the type voice',
    how: 'token',
    detail:
      'Costs zero lines — Inter is already the house sans (AD-D-011). The one place the ecosystem default and the house already agree.',
  },
  {
    cand: 'C',
    trait: 'ALL-CAPS letterspaced headings',
    how: 'bespoke',
    detail:
      'The same missing global.tracking.* family that B hits — reached by a completely different route.',
  },
  {
    cand: 'C',
    trait: 'Large bold stat numerals',
    how: 'bespoke',
    detail:
      'A type-role pairing ("readout") the scale has no name for. TelemetryValue solves it per component; the language cannot state it.',
  },
  {
    cand: 'C',
    trait: 'Lucide icon library',
    how: 'blocked',
    detail:
      'Not a token gap and not fixable with one. Adopting Sera wholesale means a second icon vocabulary alongside @auxiliary/icons, which the restraint principle refuses. Specimens keep the house icons.',
  },
  {
    cand: '—',
    trait: 'Pill-shaped status badges',
    how: 'open',
    detail:
      '--radius-full is deliberately NOT zeroed in either zero-radius candidate, so badges stay pills. Squaring them is one more token override — a design call for the room, not a buildability limit.',
  },
] as const;

const scoreFor = (cand: string) => {
  const rows = AUDIT.filter((a) => a.cand === cand && (a.how === 'token' || a.how === 'bespoke'));
  return { token: rows.filter((r) => r.how === 'token').length, total: rows.length };
};
const scoreB = scoreFor('B');
const scoreC = scoreFor('C');
</script>

<template>
  <div class="dir-studio" :data-theme="theme" :data-accent="accent">
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
        <div class="dir-seg" role="group" aria-label="Accent">
          <button
            v-for="a in ACCENTS"
            :key="a.key"
            type="button"
            :aria-pressed="accent === a.key"
            :class="{ on: accent === a.key }"
            :title="a.note"
            @click="accent = a.key"
          >
            {{ a.label }}
          </button>
        </div>
        <div class="dir-seg" role="group" aria-label="Candidates shown">
          <button type="button" :aria-pressed="solo === 'all'" :class="{ on: solo === 'all' }" @click="solo = 'all'">
            all
          </button>
          <button type="button" :aria-pressed="solo === 'a'" :class="{ on: solo === 'a' }" @click="solo = 'a'">
            A
          </button>
          <button type="button" :aria-pressed="solo === 'b'" :class="{ on: solo === 'b' }" @click="solo = 'b'">
            B
          </button>
          <button type="button" :aria-pressed="solo === 'c'" :class="{ on: solo === 'c' }" @click="solo = 'c'">
            C
          </button>
        </div>
      </div>
    </header>

    <div class="dir-columns" :data-solo="solo">
      <!-- Candidate A — the incumbent -->
      <section v-if="solo === 'all' || solo === 'a'" class="dir-column">
        <div class="dir-column-head">
          <h2>A · Mono-neutral <span class="dir-tag">incumbent</span></h2>
          <p>Operational truth, expressed with precision. Swiss / NASA-JPL restraint.</p>
        </div>
        <Register :register="register">
          <div class="dir-stage">
            <DirectionContent />
          </div>
        </Register>
      </section>

      <!-- Candidates B and C — data-direction nests INSIDE the register element
           on purpose; see the header of _anno1965.css. -->
      <section v-if="solo === 'all' || solo === 'b'" class="dir-column">
        <div class="dir-column-head">
          <h2>B · Anno 1965 <span class="dir-tag">challenger</span></h2>
          <p>Gerstner field grid, zero radius, zero shadow, steps(1) motion, mono display.</p>
        </div>
        <Register :register="register">
          <div data-direction="anno-1965" class="dir-stage">
            <DirectionContent />
          </div>
        </Register>
      </section>

      <section v-if="solo === 'all' || solo === 'c'" class="dir-column">
        <div class="dir-column-head">
          <h2>C · Sera <span class="dir-tag">shadcn beXRTDCy</span></h2>
          <p>Zinc, Inter, radius none, uppercase letterspaced headings, flat tinted cards.</p>
        </div>
        <Register :register="register">
          <div data-direction="sera" class="dir-stage">
            <DirectionContent />
          </div>
        </Register>
      </section>
    </div>

    <section class="dir-audit">
      <h2>Accent vs the reserved ladder</h2>
      <p class="dir-audit-lede">
        Accent is its own axis here, not a property of a candidate — a candidate is a language, an
        accent is a hue decision (AD-D-010). Bundling them would make a winner ambiguous between
        the two.
      </p>
      <p class="dir-audit-lede">
        AD-D-010 dropped amber because it collides with <code>caution</code>/<code>warning</code>.
        That was a judgement, correctly made, and never turned into a number — so nothing checks a
        <em>new</em> accent. There is a CVD gate on the viz palette and per-theme contrast gates on
        text pairs, but nothing measures a brand accent against the severity ladder.
        <strong>This readout is that measurement.</strong> It is not a gate; there is no ratified
        floor to gate against, which is itself the finding.
      </p>

      <div class="dir-sep">
        <div class="dir-sep-swatches">
          <span class="dir-sep-swatch dir-sep-accent" :title="activeAccent.note">
            <i />{{ activeAccent.label }}
          </span>
          <span v-for="level in LEVELS" :key="level" class="dir-sep-swatch" :data-level="level">
            <i />{{ level }}
          </span>
        </div>

        <p v-if="!sep" class="dir-sep-none">
          <strong>mono</strong> — no accent is set, so there is nothing to collide. The ladder is
          the only chromatic thing on screen, which is the whole argument for AD-D-010 direction A.
        </p>
        <dl v-else class="dir-sep-figures">
          <div>
            <dt>closest level</dt>
            <dd>{{ sep.nearest }}</dd>
          </div>
          <div>
            <dt>ΔEok, plain sight</dt>
            <dd>{{ sep.min.toFixed(3) }}</dd>
          </div>
          <div>
            <dt>ΔEok, worst dichromacy</dt>
            <dd>{{ sep.minCvd.toFixed(3) }}</dd>
          </div>
          <div>
            <dt>which</dt>
            <dd>{{ sep.worstCvd }}</dd>
          </div>
        </dl>
        <p class="dir-sep-note">
          Measured against the {{ theme }} ladder, using the step
          <code>{{ activeAccentValue ?? 'none' }}</code> that <code>_accents.css</code> actually
          applies on this ground. Higher is safer.
        </p>
      </div>

      <h3 class="dir-matrix-head">Worst-case separation, every accent × every theme</h3>
      <p class="dir-audit-lede">
        One number is not enough, because the collision is <em>ground-specific</em>: an accent takes
        a different step on light and dark grounds, so it can be safe on one and not the other.
        Each cell is ΔEok under the worst of the three simulated dichromacies — the number that
        actually matters, since plain-sight separation flatters every hue.
      </p>
      <table class="dir-audit-table dir-matrix">
        <thead>
          <tr>
            <th>Accent</th>
            <th v-for="t in THEMES" :key="t">{{ t }}</th>
            <th>worst</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in MATRIX" :key="row.key" :class="{ on: row.key === accent }">
            <td>{{ row.label }}</td>
            <td v-for="cell in row.cells" :key="cell.theme" class="tabular">
              <template v-if="cell.s">
                {{ cell.s.minCvd.toFixed(3) }}
                <span class="dir-matrix-vs">{{ cell.s.nearest }}</span>
              </template>
            </td>
            <td class="tabular dir-matrix-worst">{{ worstOf(row.cells).toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
      <p class="dir-audit-note">
        <strong>Read the sunlight column, not the last one.</strong> The expected result was that
        teal fails and ultramarine is safe. What the matrix actually says is that
        <strong>every accent collapses in <code>sunlight</code></strong> — ultramarine 0.078, sky
        0.037, teal 0.017 — and each one against <code>advisory</code>.
      </p>
      <p class="dir-audit-note">
        That is not a quirk of the measurement. <code>sunlight</code> is glare-hardened, so it
        darkens and desaturates <code>advisory</code> to <code>oklch(0.45 0.085 224)</code> —
        straight into the lightness band the 600/700 accent steps occupy on a light ground. The
        accent and the advisory chip end up near-identical in lightness and only ~20° apart in hue,
        and simulated dichromacy erases what is left. It follows that
        <code>_accents.css</code> treating <code>sunlight</code> as just another light ground is
        probably wrong: the theme that matters most for glare is the one where the accent needs its
        own step, not a shared one.
      </p>
      <p class="dir-audit-note">
        The ordering the review asked for still holds — ultramarine beats sky beats teal, on every
        ground — so AD-D-010's ratified pair survives. But "ultramarine is safe" does not survive
        as stated, and teal is not a special case so much as the worst instance of a general one.
      </p>
      <p class="dir-audit-note">
        None of this is enforced. A tokens test asserting a floor here — mirroring the existing
        viz-palette CVD gate, ratcheting up only — is what would have caught this, and what would
        have caught amber before AD-D-010 had to catch it by eye. Deliberately not written yet:
        there is no ratified floor to assert, and picking one is the room's call. The number to
        argue about is <strong>0.078</strong> — the best any accent manages in sunlight.
      </p>
    </section>

    <section class="dir-audit">
      <h2>Buildability — the axis you cannot see</h2>
      <p class="dir-audit-lede">
        AD-D-013 requires a challenger to be expressible as a token override plus a register value.
        <strong>B is {{ scoreB.token }} of {{ scoreB.total }}</strong>;
        <strong>C is {{ scoreC.token }} of {{ scoreC.total }}</strong>. Evidence is
        <code>_anno1965.css</code> and <code>_sera.css</code>, each split into exactly those two
        halves. The <em>open</em> and <em>blocked</em> rows are not buildability results — one is a
        question for the room, the other is a hard incompatibility.
      </p>
      <table class="dir-audit-table">
        <thead>
          <tr>
            <th>·</th>
            <th>Characteristic</th>
            <th>Expressible?</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in AUDIT" :key="row.cand + row.trait" :data-how="row.how">
            <td class="dir-audit-cand">{{ row.cand }}</td>
            <td>{{ row.trait }}</td>
            <td>
              <span class="dir-how">
                {{
                  row.how === 'token'
                    ? 'token override'
                    : row.how === 'bespoke'
                      ? 'bespoke CSS'
                      : row.how === 'blocked'
                        ? 'incompatible'
                        : 'open question'
                }}
              </span>
            </td>
            <td>{{ row.detail }}</td>
          </tr>
        </tbody>
      </table>
      <p class="dir-audit-note">
        The failures are not independent problems — they cluster on two gaps:
        <strong>no tracking/case tokens</strong> and <strong>no column system</strong>. The second
        is already logged as deferred in AD-D-012, so this is the evidence that it is load-bearing
        rather than cosmetic.
      </p>
      <p class="dir-audit-note">
        The stronger result is that <strong>B and C hit the tracking gap independently.</strong>
        Two challengers with nothing else in common — a 1965 Gerstner grid and a 2026 ecosystem
        preset — both stop at the same missing <code>global.tracking.*</code> family, one reaching
        for letterspaced uppercase section labels and the other for uppercase button text. That is
        owed regardless of which candidate wins, and it is the clearest thing this review produced.
      </p>
      <p class="dir-audit-note">
        Worth naming plainly: <strong>C converges with A and B on geometry.</strong> Zero radius is
        B's opening move; neutral-carries-everything and hairlines-over-shadows are A's. Sera is
        not a third shape so much as a third accent on the same shape. What C actually puts on the
        table is the ecosystem-default question — does the house want to look like what every
        shadcn app looks like? — and that is a positioning call, not a craft one.
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
  z-index: var(--z-raised);
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-6);
  padding: var(--spacing-6);
  align-items: start;
}

.dir-columns[data-solo='a'],
.dir-columns[data-solo='b'],
.dir-columns[data-solo='c'] {
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

.dir-audit-table tr[data-how='open'] .dir-how,
.dir-audit-table tr[data-how='blocked'] .dir-how {
  color: var(--foreground);
  font-style: italic;
}

.dir-audit-cand {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--muted-foreground);
}

/* ── Accent / ladder separation readout ───────────────────────────────── */

.dir-sep {
  margin-top: var(--spacing-4);
  padding: var(--spacing-4);
  border: var(--border-width-1) solid var(--border);
}

.dir-sep-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.dir-sep-swatch {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--muted-foreground);
}

/* A square, not a dot: the ladder's own badges are the round things, and this
   row must not read as a status. */
.dir-sep-swatch i {
  width: var(--spacing-6);
  height: var(--spacing-6);
  border: var(--border-width-1) solid var(--border);
}

.dir-sep-accent i {
  background: var(--primary);
}

.dir-sep-swatch[data-level='alarm'] i {
  background: var(--alarm);
}
.dir-sep-swatch[data-level='warning'] i {
  background: var(--warning);
}
.dir-sep-swatch[data-level='caution'] i {
  background: var(--caution);
}
.dir-sep-swatch[data-level='advisory'] i {
  background: var(--advisory);
}
.dir-sep-swatch[data-level='nominal'] i {
  background: var(--nominal);
}

.dir-sep-figures {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
  margin: 0 0 var(--spacing-4);
}

.dir-sep-figures dt {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-foreground);
}

.dir-sep-figures dd {
  margin: var(--spacing-1) 0 0;
  font-size: var(--text-title);
  font-variant-numeric: tabular-nums;
}

.dir-sep-none,
.dir-sep-note {
  max-width: 68ch;
  font-size: var(--text-caption);
  color: var(--muted-foreground);
  margin: 0;
}

.dir-matrix-head {
  margin: var(--spacing-8) 0 var(--spacing-2);
  font-size: var(--text-title);
  font-weight: var(--font-weight-semibold);
}

.dir-matrix .dir-matrix-vs {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--muted-foreground);
}

/* The selected row, marked by weight rather than by a hue — the reserved
   ladder owns colour-as-meaning here (AD-D-014), and this table is *about*
   that ladder, so borrowing a status hue to mean "selected" would be exactly
   the misuse it measures. */
.dir-matrix tr.on td {
  color: var(--foreground);
  font-weight: var(--font-weight-semibold);
  background: var(--muted);
}

.dir-matrix-worst {
  font-weight: var(--font-weight-semibold);
}

@media (max-width: 1600px) {
  .dir-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1100px) {
  .dir-columns {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
