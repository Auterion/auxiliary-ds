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

type Page = 'home' | 'products' | 'skynode' | 'fleet' | 'insure' | 'solutions' | 'defense' | 'developers' | 'company' | 'brand';
const theme = ref<'dark' | 'light'>('light');
const page = ref<Page>('home');

// Brand-accent identity — orthogonal to the light/dark color theme.
// `ultramarine` is the chromatic auterion-blue brand (the [data-theme] default);
// `mono` makes the brand achromatic by aliasing it to the foreground, so it flips
// correctly between light/dark on its own. Applied as an inline token override on
// the web root (inline wins over the [data-theme] declaration).
const accent = ref<'ultramarine' | 'mono'>('ultramarine');
const accentVars = computed(() =>
  accent.value === 'mono'
    ? '--brand: var(--foreground); --brand-foreground: var(--background); --ring: var(--foreground)'
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
  <div :data-theme="theme" :style="accentVars" class="web-root web-scroll h-dvh overflow-auto bg-background text-foreground">

    <!-- NAV — white, brand-blue active + CTA -->
    <header class="site-nav sticky top-0 z-30 bg-background border-b border-border py-3 px-6">
      <div class="mx-auto flex h-10 max-w-7xl items-center gap-8">

        <!-- wordmark -->
        <button class="flex items-center gap-2 shrink-0 focus-visible:outline-none" @click="go('home')">
          <span style="color: var(--brand)">
            <Icon name="drone" size="sm" />
          </span>
          <span class="font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-foreground">Auterion</span>
        </button>

        <!-- nav links -->
        <nav class="hidden items-center md:flex">
          <button
            v-for="l in NAV"
            :key="l.key"
            class="px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none"
            :class="page === l.key ? '' : 'text-muted-foreground hover:text-foreground'"
            :style="page === l.key ? 'color: var(--brand); font-weight: 500' : ''"
            @click="go(l.key)"
          >{{ l.label }}</button>
        </nav>

        <div class="ml-auto flex items-center gap-3">
          <!-- brand-accent toggle (mono vs ultramarine) -->
          <div class="hidden items-center border border-border sm:flex">
            <button
              v-for="a in (['mono','ultramarine'] as const)" :key="a" type="button"
              class="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors"
              :class="accent === a ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground'"
              @click="accent = a">{{ a === 'ultramarine' ? 'ultra' : a }}</button>
          </div>
          <!-- theme toggle -->
          <div class="flex items-center border border-border">
            <button
              v-for="t in (['light','dark'] as const)" :key="t" type="button"
              class="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors"
              :class="theme === t ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground'"
              @click="theme = t">{{ t }}</button>
          </div>
          <button class="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground sm:block">Sign in</button>
          <button
            class="px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] font-medium transition-all hover:opacity-90 focus-visible:outline-none"
            style="background: var(--brand); color: var(--brand-foreground)"
            @click="go('products')"
          >Get started</button>
        </div>
      </div>
    </header>

    <main>
      <component :is="PAGES[page]" />
    </main>

    <!-- FOOTER — clean white -->
    <footer class="bg-background border-t border-border">
      <div class="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-5">
        <div class="col-span-2 md:col-span-1">
          <button class="flex items-center gap-2 focus-visible:outline-none" @click="go('home')">
            <span style="color: var(--brand)">
              <Icon name="drone" size="sm" />
            </span>
            <span class="font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-foreground">Auterion</span>
          </button>
          <p class="mt-4 text-[14px] leading-relaxed text-muted-foreground">
            The open software platform<br>for autonomous vehicles.
          </p>
          <div class="mt-6 flex items-center gap-1.5">
            <span class="h-1.5 w-1.5 rounded-full" style="background: var(--nominal)" />
            <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">All systems nominal</span>
          </div>
        </div>
        <div v-for="col in footerCols" :key="col.h">
          <p class="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{{ col.h }}</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="it in col.items" :key="it">
              <a class="text-[14px] text-foreground transition-opacity hover:text-muted-foreground cursor-pointer">{{ it }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-border">
        <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5">
          <span class="text-[12px] text-muted-foreground">© 2026 Auterion AG · Zürich · Switzerland</span>
          <span class="flex gap-5">
            <a v-for="l in ['Privacy','Terms','Security','Status']" :key="l" class="text-[12px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer">{{ l }}</a>
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.web-root {
  background-image: none;
}

/* Inter Variable for headings and all content paragraphs.
 * :deep() specificity beats .font-mono (class), so eyebrow labels become Inter too.
 * <pre>, <code>, <div class="font-mono">, <button> — untouched. */
:deep(h1),
:deep(h2),
:deep(h3) {
  font-family: 'Inter Variable', var(--font-sans);
  letter-spacing: -0.03em;
}

:deep(p) {
  font-family: 'Inter Variable', var(--font-sans);
  font-optical-sizing: auto;
}
</style>
