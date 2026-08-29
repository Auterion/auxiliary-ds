<script setup lang="ts">
/* Hallmark · macrostructure: Editorial (portfolio deck) worn by a working specimen sheet
 * tone: measured/declarative
 *
 * "ONE AUTERION" — the ecosystem layer, compiled.
 *
 * The proposal this page answers made one claim worth testing: five products
 * can be made to read as one system for the price of ONE component and ONE
 * table, because the hard parts — four themes, two registers, a brand hierarchy
 * — are already built and sitting unused in this repo. Every other demo here
 * argues about a surface. This one argues about the seam between surfaces.
 *
 * So the page is not a document with pictures of a shell in it. The table and
 * the component both live in `@auxiliary/shell` now (AD-D-038); this page
 * IMPORTS them and restates nothing. Every bar below is one instance of the
 * shipped component, not a drawing of it, and every caption is derived from the
 * shipped table. If the claim is false, this page cannot be built — and that is
 * the only kind of proof a design system can offer.
 *
 * THE CONTROL, and why it is the argument: both axes default to `Declared`,
 * where every specimen renders in the theme and register its row asks for —
 * six surfaces, four themes, two densities, on screen at once. Force either
 * axis and all six re-resolve while the bar's STRUCTURE does not move. That
 * second state is the whole proposal in one gesture; the first is what
 * shipping actually looks like.
 *
 * Zones and the raw-value rule are in the header of `_eco.css`.
 */
import { computed, ref, watch } from 'vue';
import { Icon } from '@auxiliary/icons';
/* The bar and the launcher are the SHIPPED artifacts now (AD-D-038), imported
 * from the package like any product would. That is the whole point of the
 * specimen sheet: if these were page-local copies, every claim below would be
 * a claim about a drawing. */
import { IdentityBar, Launcher } from '@auxiliary/shell';
import BodyControl from './BodyControl.vue';
import BodyNemyx from './BodyNemyx.vue';
import BodySuite from './BodySuite.vue';
import ObjectGrammar from './ObjectGrammar.vue';
import { suppressTransitions, useBarHeights } from './useEco';
import {
  REGISTERS,
  SURFACES,
  SURFACE_BY_ID,
  THEMES,
  type RegisterKey,
  spell,
  type Surface,
  type ThemeKey,
} from './surfaces';
import './_eco.css';

const ORG = '45th CAB';

/* `null` is not "no theme" — it is the ecosystem as declared, each surface in
 * its own. Making that a value in the same segment rather than a separate mode
 * switch keeps one control per axis and no hidden state. */
const themeOverride = ref<ThemeKey | null>(null);
const registerOverride = ref<RegisterKey | null>(null);

const pageTheme = computed<ThemeKey>(() => themeOverride.value ?? 'dark');
const pageRegister = computed<RegisterKey>(() => registerOverride.value ?? 'expressive');

const themeOf = (s: Surface) => themeOverride.value ?? s.theme;
const registerOf = (s: Surface) => registerOverride.value ?? s.register;

/* The launcher is the ecosystem's own surface: dark by default because that is
 * where an operator lands, expressive because it is a chooser, not a console. */
const launcherTheme = computed<ThemeKey>(() => themeOverride.value ?? 'dark');
const launcherRegister = computed<RegisterKey>(() => registerOverride.value ?? 'expressive');

watch([themeOverride, registerOverride], suppressTransitions);

const bar = useBarHeights();

const proposed = computed(() => SURFACES.filter((s) => s.proposed).length);

const IN_SITU = [
  { surface: SURFACE_BY_ID.suite, body: BodySuite, note: 'Sidebar IA is the shipped one.' },
  { surface: SURFACE_BY_ID.control, body: BodyControl, note: 'Rail order and telemetry fields are the shipped ones.' },
  { surface: SURFACE_BY_ID.nemyx, body: BodyNemyx, note: 'Agent cards and command rail are the shipped grammar.' },
];

/* The bar's contract. Each row is now gated by a test in the package rather
 * than asserted here, which is the difference between a design principle and a
 * design system. */
/* The input axis, which the page gives no control for on purpose: an operator
 * does not choose their pointer. Four rows rather than two, because the claim
 * is that the touch floor composes OVER register density — and a specimen that
 * only showed coarse-vs-fine at one density would not test that. */
const INPUT_PROBES = [
  { key: 'e-fine', register: 'expressive', input: 'fine', note: 'Desk. The bar as it ships.' },
  { key: 'e-coarse', register: 'expressive', input: 'coarse', note: 'Tablet. Targets take the 44px floor; type and rules do not move.' },
  { key: 'o-fine', register: 'operational', input: 'fine', note: 'Console. Denser by register.' },
  { key: 'o-coarse', register: 'operational', input: 'coarse', note: 'Rugged controller — the real Mission Control case. Dense AND reachable.' },
] as const;

const INVARIANTS = [
  ['Order', 'mark · AUTERION · / · SURFACE · apps · tabs · org · account. Never rearranged.'],
  ['Height', 'A ladder off --component-identity-bar-height, which aliases --control-height-lg — so the register makes it denser.'],
  ['Colour', 'Semantic tokens only. The bar never learns which theme is on.'],
  ['Reach', 'It renders the tabs it is handed and owns nothing below itself.'],
];

/* The build order, and where it has actually got to.
 *
 * `state` is on the row rather than in the markup for the same reason the
 * surface table is: a caption that says "shipped" over a step that is not is
 * exactly the drift this page exists to argue against. Two states only —
 * something is in the repo or it is not. There is no "in progress" here,
 * because "in progress" is what a roadmap says when it means "no". */
const BUILD = [
  ['Step 1', 'Settle the blue, add Nemyx to the brand', 'Two decision records, both written and both awaiting ratification: AD-D-015 re-anchors auterion-blue on #1475ff — the blue Mission Control and Nemyx already ship, independently, and which this ramp did not contain — and AD-D-016 gives Nemyx its place in the brand hierarchy. Every later step depended on both.', 'drafted'],
  ['Step 2', '@auxiliary/shell', 'Shipped, and it is what you are looking at. The identity bar, the launcher and the surface table are a package (AD-D-038), styled by two recipes off two component token tiers, with 27 tests. The bars below are imported from it, not drawn here.', 'shipped'],
  ['Step 3', 'Adopt in Nemyx first', 'Not Suite. Nemyx is Vue 3.5 on Tailwind v4 with a local token layer — one migration away. Suite and the device app are Tailwind 2.2.7 with dark mode off and chrome colour in the templates; those are quarters, not weeks.', 'next'],
  ['Step 4', 'The entity contract and EntityRef', 'Agree the URI scheme, then ship the primitive. Retiring the hardcoded 10.41.1.1 in Suite is the first proof it works, and it fixes a real bug for anyone whose vehicle is not on that address.', 'next'],
  ['Step 5', 'Data-age grammar, then the overlay layer', 'The staleness ladder as tokens plus an Age primitive, consumed by Nemyx and Control. Then the map overlay grammar — and its recorded constraint still governs: everything sits on satellite imagery, so scrims and outlines, never flat fills.', 'next'],
  ['Step 6', 'Suite and the device app', 'Last, and honestly. The prize is real — Suite is the surface most customers see — but it is a migration project, and pretending otherwise is how design systems get blamed for slipping roadmaps.', 'next'],
];
</script>

<template>
  <div
    class="dk ec-page"
    :data-theme="pageTheme"
    :data-register="pageRegister"
  >
    <!-- ── Control bar ──────────────────────────────────────────────────── -->
    <div class="ec-topbar">
      <div class="ec-wrap" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--spacing-4); width: 100%">
        <p class="dk-label">One Auterion · ecosystem layer</p>

        <div class="ec-controls">
          <div class="ec-axis">
            <span class="dk-label">Theme</span>
            <div class="dk-segment" role="group" aria-label="Colour theme across every surface">
              <button
                type="button"
                class="dk-segment-btn"
                :data-active="themeOverride === null ? 'true' : 'false'"
                :aria-pressed="themeOverride === null"
                @click="themeOverride = null"
              >
                Declared
              </button>
              <button
                v-for="t in THEMES"
                :key="t.key"
                type="button"
                class="dk-segment-btn"
                :data-active="themeOverride === t.key ? 'true' : 'false'"
                :aria-pressed="themeOverride === t.key"
                @click="themeOverride = t.key"
              >
                {{ t.label }}
              </button>
            </div>
          </div>

          <div class="ec-axis">
            <span class="dk-label">Register</span>
            <div class="dk-segment" role="group" aria-label="Density register across every surface">
              <button
                type="button"
                class="dk-segment-btn"
                :data-active="registerOverride === null ? 'true' : 'false'"
                :aria-pressed="registerOverride === null"
                @click="registerOverride = null"
              >
                Declared
              </button>
              <button
                v-for="r in REGISTERS"
                :key="r.key"
                type="button"
                class="dk-segment-btn"
                :data-active="registerOverride === r.key ? 'true' : 'false'"
                :aria-pressed="registerOverride === r.key"
                @click="registerOverride = r.key"
              >
                {{ r.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <main class="ec-wrap">
      <!-- ── Cover ──────────────────────────────────────────────────────── -->
      <header class="ec-cover">
        <p class="dk-label">Ecosystem layer · specimen sheet</p>
        <h1 class="dk-display" style="margin-top: 14px">One Auterion</h1>
        <div class="ec-cover-rule" aria-hidden="true"></div>
        <div class="ec-col ec-stack">
          <p class="dk-body-lg">
            Five products, five chromes, four independently invented dark navies. What is missing
            is not capability — it is the layer that makes them read as one thing. This page is
            that layer, running: <strong>one table</strong> of surfaces and
            <strong>one identity bar</strong>, re-resolving across four themes and two densities.
            Both now ship from <code class="dk-value">@auxiliary/shell</code>, so what follows is
            the artifact itself rather than a drawing of it.
          </p>
          <p class="dk-body">
            Set either axis above to <em>Declared</em> and every specimen renders as it would
            ship. Force one and all six move together while the bar's structure does not.
          </p>
        </div>

        <div class="dk-ledger" style="--dk-ledger-cols: 3; margin-top: var(--spacing-8)">
          <div class="dk-ledger-cell">
            <span class="dk-pointer">Surfaces</span>
            <span class="dk-h2 dk-num">{{ SURFACES.length }}</span>
            <span class="dk-small">{{ spell(proposed) }} still proposed</span>
          </div>
          <div class="dk-ledger-cell">
            <span class="dk-pointer">Shared components</span>
            <span class="dk-h2 dk-num">1</span>
            <span class="dk-small">
              the identity bar, imported from <code class="dk-value">@auxiliary/shell</code> and
              rendered {{ spell(SURFACES.length) }} times below
            </span>
          </div>
          <div class="dk-ledger-cell" data-align="end">
            <span class="dk-pointer">Products on @auxiliary</span>
            <span class="dk-h2 dk-num">0</span>
            <span class="dk-small">
              still none — the shell exists now, and a package with one demo consumer is a
              package, not an adoption
            </span>
          </div>
        </div>
      </header>

      <!-- ── 01 · Launcher ──────────────────────────────────────────────── -->
      <section id="launcher" class="ec-section-block">
        <div class="ec-col ec-stack" style="margin-bottom: var(--spacing-6)">
          <div class="dk-section">
            <h2 class="dk-h1">01 — The launcher</h2>
            <span class="dk-label">Specimen</span>
          </div>
          <p class="dk-body">
            The cheapest screen in the proposal and the one that does the most work. Each tile
            declares the theme and register it will hand you, so moving between a light, roomy
            Suite and a dark, dense Control stops being a jolt. Simulation declares Control's
            pair on purpose: a rehearsal surface that does not look like the thing it rehearses
            is not a rehearsal.
          </p>
        </div>

        <div
          class="ec-surface"
          :data-theme="launcherTheme"
          :data-register="launcherRegister"
        >
          <Launcher :org="ORG" account="y.dimov@auterion.com" role="Operator" />
        </div>
        <div class="ec-caption">
          <span class="dk-caption">
            Tiles carry no product hue — identity is a drawn glyph
          </span>
          <span class="dk-caption">theme {{ launcherTheme }} · register {{ launcherRegister }}</span>
        </div>
      </section>

      <!-- ── 02 · The bar ───────────────────────────────────────────────── -->
      <section id="bars" class="ec-section-block">
        <div class="ec-col ec-stack" style="margin-bottom: var(--spacing-6)">
          <div class="dk-section">
            <h2 class="dk-h1">02 — One bar, {{ spell(SURFACES.length) }} surfaces</h2>
            <span class="dk-label">Specimen</span>
          </div>
          <p class="dk-body">
            Every bar below is the same <code class="dk-value">IdentityBar</code> from
            <code class="dk-value">@auxiliary/shell</code>, each inside its own
            <code class="dk-value">[data-theme]</code> and
            <code class="dk-value">[data-register]</code> subtree. The component is handed a row
            from the table and nothing else — it never learns which theme is on.
          </p>
        </div>

        <div class="ec-stack" style="gap: var(--spacing-4)">
          <div v-for="s in SURFACES" :id="`surface-${s.id}`" :key="s.id">
            <div
              class="ec-surface"
              :data-theme="themeOf(s)"
              :data-register="registerOf(s)"
            >
              <IdentityBar :surface="s" :org="ORG" />
            </div>
            <div class="ec-caption">
              <span class="dk-caption">{{ s.formal }} — {{ s.level }}</span>
              <span class="dk-caption">
                theme {{ themeOf(s) }} · register {{ registerOf(s) }}
                <template v-if="s.proposed"> · proposed</template>
              </span>
            </div>
          </div>
        </div>

        <div class="ec-col ec-stack" style="margin-top: var(--spacing-10)">
          <div class="dk-section">
            <h3 class="dk-h2">And in situ</h3>
            <span class="dk-label">{{ spell(IN_SITU.length) }} surfaces</span>
          </div>
          <p class="dk-body">
            A bar on its own proves it is coherent with itself. Only a real frame proves it is
            coherent with the twelve other things already on the screen — which is where shared
            chrome actually goes wrong.
          </p>
        </div>

        <div class="ec-stack" style="gap: var(--spacing-6); margin-top: var(--spacing-5)">
          <div v-for="f in IN_SITU" :id="`insitu-${f.surface.id}`" :key="f.surface.id">
            <div
              class="ec-surface"
              :data-theme="themeOf(f.surface)"
              :data-register="registerOf(f.surface)"
            >
              <IdentityBar :surface="f.surface" :org="ORG" />
              <component :is="f.body" />
            </div>
            <div class="ec-caption">
              <span class="dk-caption">{{ f.surface.formal }} — {{ f.note }}</span>
              <span class="dk-caption">
                theme {{ themeOf(f.surface) }} · register {{ registerOf(f.surface) }}
              </span>
            </div>
          </div>
        </div>

        <div class="ec-col ec-stack" style="margin-top: var(--spacing-10)">
          <p class="dk-body">
            Note what did <em>not</em> change. Nemyx keeps its keyboard-first, selection-first
            grammar and its right-hand command rail. Control keeps its left toolstrip and its
            telemetry bar. Suite keeps its category sidebar. The shell is
            {{ bar.expressive.value || 48 }} pixels of shared identity and an app grid; the moment
            it reaches further down, product teams will refuse it and they will be right.
          </p>
          <p class="dk-body">
            One addition worth arguing for, visible in the Nemyx strip: a
            <strong>data-age readout</strong> beside the selection count. Every surface receives
            timestamped telemetry and none of them says how old the picture is.
          </p>
        </div>

        <!-- ── The third axis ───────────────────────────────────────────── -->
        <div class="ec-col ec-stack" style="margin-top: var(--spacing-10)">
          <div class="dk-section">
            <h3 class="dk-h2">And a third axis nobody set</h3>
            <span class="dk-label">Input</span>
          </div>
          <p class="dk-body">
            Theme and register are the two axes this page gives you a control for. There is a
            third, and it has no control because an operator does not choose it: input modality.
            Mission Control runs on rugged tablets, so under
            <code class="dk-value">[data-input="coarse"]</code> every hit area in the bar is
            raised to the 44px floor — and the floor composes <em>over</em> register density
            rather than replacing it, so a dense operational bar on a tablet stays dense
            everywhere the density is not a target.
          </p>
          <p class="dk-body">
            The bar did not have to be taught this. It consumes
            <code class="dk-value">max(--component-identity-bar-apps-size, --target-floor)</code>,
            and the floor is raised by a media query the component tier never sees. Below is the
            same component, four times, with only that attribute changing.
          </p>
        </div>

        <div class="ec-stack" style="gap: var(--spacing-4); margin-top: var(--spacing-5)">
          <div v-for="probe in INPUT_PROBES" :key="probe.key">
            <div
              class="ec-surface"
              :data-theme="themeOf(SURFACE_BY_ID.control)"
              :data-register="probe.register"
              :data-input="probe.input"
            >
              <IdentityBar :surface="SURFACE_BY_ID.control" :org="ORG" />
            </div>
            <div class="ec-caption">
              <span class="dk-caption">{{ probe.note }}</span>
              <span class="dk-caption">
                register {{ probe.register }} · input {{ probe.input }}
              </span>
            </div>
          </div>
        </div>

        <div class="ec-col ec-stack" style="margin-top: var(--spacing-6)">
          <p class="dk-body">
            Note which measurements move and which do not. The bar grows, and the app-grid and
            account targets grow with it, because those are things a gloved thumb has to hit. The
            tracking, the rules and the tab padding do not, because a touch screen does not make
            type harder to read — it makes it harder to <em>hit</em>. A floor that raised
            everything would just be a bigger bar, and would have cost the density the operational
            register exists to buy.
          </p>
        </div>
      </section>

      <!-- ── 03 · Object grammar ────────────────────────────────────────── -->
      <section id="grammar" class="ec-section-block">
        <div class="ec-col ec-stack" style="margin-bottom: var(--spacing-6)">
          <div class="dk-section">
            <h2 class="dk-h1">03 — One name for every object</h2>
            <span class="dk-label">Contract</span>
          </div>
          <p class="dk-body">
            A vehicle is a database row in Suite, a <code class="dk-value">Vehicle</code> in
            Trellys, a MAVLink system id in Control and a serial number on the device page. Same
            aircraft, four names, and no way to say <em>this one</em> over a radio.
          </p>
        </div>
        <ObjectGrammar />
      </section>

      <!-- ── 04 · What it costs ─────────────────────────────────────────── -->
      <section id="spec" class="ec-section-block">
        <div class="ec-col ec-stack" style="margin-bottom: var(--spacing-6)">
          <div class="dk-section">
            <h2 class="dk-h1">04 — What it costs</h2>
            <span class="dk-label">Sequencing</span>
          </div>
        </div>

        <div class="dk-card" style="padding: var(--spacing-5); margin-bottom: var(--spacing-6)">
          <p class="dk-label" style="margin-bottom: var(--spacing-4)">The bar's invariants</p>
          <table class="dk-table">
            <tbody>
              <tr v-for="[k, v] in INVARIANTS" :key="k">
                <td data-lead="true" style="width: 22%">{{ k }}</td>
                <td>{{ v }}</td>
              </tr>
              <tr>
                <td data-lead="true">Measured</td>
                <td>
                  <span class="dk-num">{{ bar.expressive.value || '—' }} px</span> expressive ·
                  <span class="dk-num">{{ bar.operational.value || '—' }} px</span> operational —
                  computed from <code class="dk-value">--component-identity-bar-height</code> +
                  <code class="dk-value">-height-offset</code> under each register, not asserted —
                  so this line cannot drift from the specimens above it, and two equal numbers
                  would mean the register axis had stopped reaching the component tier.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="dk-card" style="padding: var(--spacing-5); margin-bottom: var(--spacing-6); overflow-x: auto">
          <table class="dk-table" style="min-width: 44rem">
            <thead>
              <tr>
                <th>Surface</th>
                <th>In chrome</th>
                <th>Context</th>
                <th>Themes</th>
                <th>Register</th>
                <th>Runs on today</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in SURFACES" :key="s.id">
                <td data-lead="true">{{ s.formal }}</td>
                <td><span class="dk-micro">AUTERION / {{ s.chrome.toUpperCase() }}</span></td>
                <td>{{ s.level }}</td>
                <td><span class="dk-micro">{{ s.themes.join(' · ') }}</span></td>
                <td><span class="dk-micro">{{ s.register }}</span></td>
                <td>{{ s.stack }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="dk-divide dk-card">
          <div
            v-for="[n, title, body, state] in BUILD"
            :key="n"
            :data-state="state"
            style="display: grid; grid-template-columns: 5.5rem minmax(0, 1fr); gap: var(--spacing-4); padding: var(--spacing-4) var(--spacing-5)"
          >
            <span class="dk-label" style="padding-top: 3px">{{ n }}</span>
            <div>
              <p style="display: flex; align-items: baseline; flex-wrap: wrap; gap: var(--spacing-2); margin-bottom: 5px">
                <span class="dk-value">{{ title }}</span>
                <span class="ec-state" :data-state="state">{{ state }}</span>
              </p>
              <p class="dk-body">{{ body }}</p>
            </div>
          </div>
        </div>

        <div class="ec-col" style="margin-top: var(--spacing-8)">
          <div class="dk-card" style="padding: var(--spacing-5)">
            <p class="dk-label" style="margin-bottom: 8px">The blue — answered, and what answering it turned up</p>
            <p class="dk-body">
              Mission Control's primary and Nemyx's highlight are the same value —
              <span class="dk-num">#1475ff</span> — arrived at by two teams, in two languages,
              four years apart. It was not Auxiliary's blue: it sat between the ramp's 500 and 600
              and 4.7° off its hue anchor. <strong>AD-D-015 re-anchors the ramp on it</strong> —
              hue 259.3°, rung 600 the product value — because the ramp has no consumers and the
              products have thousands of hours of muscle memory.
            </p>
            <p class="dk-body" style="margin-top: var(--spacing-3)">
              Checking it turned up something the proposal could not have known:
              <span class="dk-num">#1475ff</span> sits at <strong>99.9% of the sRGB chroma
              maximum</strong> at its own lightness and hue. The gamut gate requires every
              authored rung to stay under 97%, because a rung any nearer the boundary is silently
              clipped and renders as a colour other than the one written down. So the literal hex
              cannot be a token. Rung 600 is <span class="dk-num">#1b76fb</span> instead — the
              nearest value that clears the gate, and <span class="dk-num">ΔE00 0.52</span> away,
              which is half a just-noticeable difference. The products keep their blue; the system
              keeps its gate.
            </p>
            <p class="dk-body" style="margin-top: var(--spacing-3)">
              What does <em>not</em> move: the semantic <code class="dk-value">brand</code> role
              stays on rung 700. <span class="dk-num">#1475ff</span> carries white text at
              <span class="dk-num">4.18:1</span> — the products ship a primary button that fails
              AA, and a design system that inherits that has laundered a defect rather than
              adopted a colour.
            </p>
          </div>
        </div>
      </section>

      <footer class="ec-section-block" style="padding-bottom: var(--spacing-20)">
        <p class="ec-col dk-small">
          <Icon name="circle-info" :size="13" aria-hidden="true" />
          Specimen sheet, not a shipped shell. The surface table, the context levels and the
          stacks are read from the four product repos; the bodies are compressed but their IA,
          rail order and telemetry fields are the shipped ones. Tabs move their marker — the
          bodies below them are frozen.
        </p>
      </footer>
    </main>
  </div>
</template>
