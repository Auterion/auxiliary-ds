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
 * So the page is not a document with pictures of a shell in it. The table is
 * `surfaces.ts` and nothing on the page restates a row of it; the component is
 * `IdentityBar.vue` and the six bars below are six instances of it, not six
 * drawings. If the claim is false, this page cannot be built, and that is the
 * only kind of proof a design system can offer.
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
import BodyControl from './BodyControl.vue';
import BodyNemyx from './BodyNemyx.vue';
import BodySuite from './BodySuite.vue';
import IdentityBar from './IdentityBar.vue';
import LauncherFrame from './LauncherFrame.vue';
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

const INVARIANTS = [
  ['Order', 'mark · AUTERION · / · SURFACE · apps · tabs · org · account. Never rearranged.'],
  ['Height', 'A ladder off --control-height-lg, so the register makes it denser.'],
  ['Colour', 'Semantic tokens only. The bar never learns which theme is on.'],
  ['Reach', 'It renders the tabs it is handed and owns nothing below itself.'],
];

const BUILD = [
  ['Step 1', 'Settle the blue, add Nemyx to the brand', 'Two decision records. Retune auterion-blue so the ramp passes through the value Mission Control and Nemyx already ship, and add the missing nemyx logo entry with themes [dark, darknight, sunlight]. Days of work, and every later step depends on both.'],
  ['Step 2', '@auxiliary/shell', 'The identity bar, the app grid, the org control, the account menu and the launcher as a real route. The smallest thing all five surfaces can adopt, and the smallest thing that makes them look related.'],
  ['Step 3', 'Adopt in Nemyx first', 'Not Suite. Nemyx is Vue 3.5 on Tailwind v4 with a local token layer — one migration away. Suite and the device app are Tailwind 2.2.7 with dark mode off and chrome colour in the templates; those are quarters, not weeks.'],
  ['Step 4', 'The entity contract and EntityRef', 'Agree the URI scheme, then ship the primitive. Retiring the hardcoded 10.41.1.1 in Suite is the first proof it works, and it fixes a real bug for anyone whose vehicle is not on that address.'],
  ['Step 5', 'Data-age grammar, then the overlay layer', 'The staleness ladder as tokens plus an Age primitive, consumed by Nemyx and Control. Then the map overlay grammar — and its recorded constraint still governs: everything sits on satellite imagery, so scrims and outlines, never flat fills.'],
  ['Step 6', 'Suite and the device app', 'Last, and honestly. The prize is real — Suite is the surface most customers see — but it is a migration project, and pretending otherwise is how design systems get blamed for slipping roadmaps.'],
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
            <span class="dk-small">the identity bar, rendered {{ spell(SURFACES.length) }} times below</span>
          </div>
          <div class="dk-ledger-cell" data-align="end">
            <span class="dk-pointer">Products on @auxiliary</span>
            <span class="dk-h2 dk-num">0</span>
            <span class="dk-small">seven packages, 195 tests, no consumers</span>
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
          <LauncherFrame :org="ORG" />
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
            Every bar below is the same <code class="dk-value">IdentityBar.vue</code>, each inside
            its own <code class="dk-value">[data-theme]</code> and
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
                  read off live probes, not asserted, so this line cannot drift from the
                  specimens above it.
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
            v-for="[n, title, body] in BUILD"
            :key="n"
            style="display: grid; grid-template-columns: 5.5rem minmax(0, 1fr); gap: var(--spacing-4); padding: var(--spacing-4) var(--spacing-5)"
          >
            <span class="dk-label" style="padding-top: 3px">{{ n }}</span>
            <div>
              <p class="dk-value" style="margin-bottom: 5px">{{ title }}</p>
              <p class="dk-body">{{ body }}</p>
            </div>
          </div>
        </div>

        <div class="ec-col" style="margin-top: var(--spacing-8)">
          <div class="dk-card" style="padding: var(--spacing-5)">
            <p class="dk-label" style="margin-bottom: 8px">One decision still open</p>
            <p class="dk-body">
              Mission Control's primary and Nemyx's highlight are the same value —
              <span class="dk-num">#1475ff</span> — arrived at by two teams, in two languages,
              four years apart. It is not Auxiliary's blue: it sits between the ramp's 500 and 600
              and 4.7° off its hue anchor. Either retune the ramp to pass through it, or hold the
              anchor and accept that adoption visibly shifts both operational products' accent.
              The ramp has no consumers; the products have thousands of hours of muscle memory.
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
