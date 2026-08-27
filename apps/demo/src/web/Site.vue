<!--
  Hallmark · macrostructure: Editorial (portfolio deck) · tone: measured/declarative
  anchor hue: auterion blue (rationed — ONE surface in the chrome)
  pre-emit critique: P5 H5 E5 S5 R5 V4

  auterion.com, written in the Deck 07b grammar and built the Console way.
  The surface layer is `_web.css` (`wb-`); the grammar is `_deck07b.css` (`dk-`),
  imported once globally in main.ts.
-->
<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { Icon } from '@auxiliary/icons';
import Home from './pages/Home.vue';
import Products from './pages/Products.vue';
import Skynode from './pages/Skynode.vue';
import Fleet from './pages/Fleet.vue';
import Insure from './pages/Insure.vue';
import Solutions from './pages/Solutions.vue';
import Defense from './pages/Defense.vue';
import Developers from './pages/Developers.vue';
import Company from './pages/Company.vue';
import Brand from './pages/Brand.vue';
import './_web.css';

type Page = 'home' | 'products' | 'skynode' | 'fleet' | 'insure' | 'solutions' | 'defense' | 'developers' | 'company' | 'brand';

// ONE attribute drives BOTH layers: `.dk` keys its palette off [data-theme],
// exactly as the DS semantic tokens do, so the deck grammar and Button/Badge/
// StatusBadge can never re-resolve out of step. There is no second mode axis.
const theme = ref<'dark' | 'light'>('light');
const page = ref<Page>('home');

// Brand-accent identity — orthogonal to the light/dark colour theme.
// `ultramarine` is the chromatic auterion-blue brand (the [data-theme]
// default); `mono` makes the brand achromatic by aliasing it to the
// foreground, so it flips with light/dark on its own.
//
// It also repoints the deck's ONE signal. The signal budget on this surface is
// two blue surfaces per view: the masthead mark (chrome, on every page) and at
// most one chapter divider inside the page. On `mono` the signal becomes ink
// and the whole site carries zero blue. Inline overrides win over [data-theme].
const accent = ref<'ultramarine' | 'mono'>('ultramarine');
const accentVars = computed(() =>
  accent.value === 'mono'
    ? '--brand: var(--foreground); --brand-foreground: var(--background); --ring: var(--dk-fg);'
      + ' --dk-signal: var(--dk-fg); --dk-signal-ink: var(--dk-fg); --dk-on-signal: var(--dk-bg)'
    : undefined,
);

const PAGES = { home: Home, products: Products, skynode: Skynode, fleet: Fleet, insure: Insure, solutions: Solutions, defense: Defense, developers: Developers, company: Company, brand: Brand };
const NAV: { key: Page; label: string }[] = [
  { key: 'products', label: 'Products' },
  { key: 'skynode', label: 'Skynode' },
  { key: 'fleet', label: 'Fleet' },
  { key: 'insure', label: 'Insure' },
  { key: 'solutions', label: 'Solutions' },
  { key: 'defense', label: 'Defense' },
  { key: 'developers', label: 'Developers' },
  { key: 'company', label: 'Company' },
  { key: 'brand', label: 'Brand' },
];

function go(p: Page) {
  page.value = p;
  document.querySelector('.web-scroll')?.scrollTo({ top: 0 });
}
provide('navigate', go);

const footerCols = [
  { h: 'Platform', items: ['Suite', 'Mission Control', 'AuterionOS', 'Skynode'] },
  { h: 'Solutions', items: ['Defense', 'Enterprise', 'Public safety', 'Developers'] },
  { h: 'Company', items: ['About', 'Careers', 'Newsroom', 'Contact'] },
  { h: 'Resources', items: ['Docs', 'Status', 'Security', 'Support'] },
];
</script>

<template>
  <div
    :data-theme="theme"
    :style="accentVars"
    class="dk wb-root web-scroll h-dvh overflow-auto"
  >

    <!-- ╭─ Masthead ─────────────────────────────────────────────────╮
         Position is marked with a rule, never a lozenge. The mark is the
         chrome's ONE signal surface. -->
    <header class="wb-nav">
      <div class="wb-wrap">
        <div class="wb-nav-inner">
          <button type="button" class="wb-brand" @click="go('home')">
            <span class="wb-mark dk-plate-signal"><Icon name="drone" size="xs" /></span>
            <span class="wb-wordmark">Auterion</span>
          </button>

          <div class="wb-nav-end">
            <!-- brand-accent identity -->
            <div class="dk-segment wb-sm-up">
              <button
                v-for="a in (['mono','ultramarine'] as const)" :key="a" type="button"
                class="dk-segment-btn" :data-active="accent === a" :aria-pressed="accent === a"
                @click="accent = a"
              >{{ a === 'ultramarine' ? 'ultra' : a }}</button>
            </div>
            <!-- colour theme -->
            <div class="dk-segment">
              <button
                v-for="t in (['light','dark'] as const)" :key="t" type="button"
                class="dk-segment-btn" :data-active="theme === t" :aria-pressed="theme === t"
                @click="theme = t"
              >{{ t }}</button>
            </div>
            <button type="button" class="dk-cta dk-cta-sm wb-sm-up">Sign in</button>
            <button type="button" class="dk-cta-solid dk-cta-sm" @click="go('products')">Get started</button>
          </div>
        </div>

        <!-- Row two — the section index, on its own hairline. -->
        <div class="wb-nav-strip">
          <nav class="wb-navlinks" aria-label="Primary">
            <button
              v-for="l in NAV"
              :key="l.key"
              type="button"
              class="wb-navlink"
              :data-active="page === l.key"
              :aria-pressed="page === l.key"
              :aria-current="page === l.key ? 'page' : undefined"
              @click="go(l.key)"
            >{{ l.label }}</button>
          </nav>
        </div>
      </div>
    </header>

    <main>
      <component :is="PAGES[page]" />
    </main>

    <!-- ╭─ Colophon ─────────────────────────────────────────────────╮ -->
    <footer class="wb-band">
      <div class="wb-wrap wb-block-sm">
        <div class="wb-foot-grid">
          <div class="wb-foot-col">
            <button type="button" class="wb-brand" @click="go('home')">
              <span class="wb-mark"><Icon name="drone" size="xs" /></span>
              <span class="wb-wordmark">Auterion</span>
            </button>
            <p class="dk-body">
              The open software platform<br>for autonomous vehicles.
            </p>
            <span class="wb-live">
              <span class="dk-dot dk-dot-nominal" />
              <span class="dk-label">All systems nominal</span>
            </span>
          </div>
          <div v-for="col in footerCols" :key="col.h" class="wb-foot-col">
            <p class="dk-label">{{ col.h }}</p>
            <ul class="wb-foot-links">
              <li v-for="it in col.items" :key="it">
                <a class="wb-foot-link" tabindex="0">{{ it }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="wb-wrap">
        <div class="wb-foot-bar">
          <span class="dk-small">© 2026 Auterion AG · Zürich · Switzerland</span>
          <span class="flex flex-wrap gap-4">
            <a v-for="l in ['Privacy','Terms','Security','Status']" :key="l" class="wb-foot-link" tabindex="0">{{ l }}</a>
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>
