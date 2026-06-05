<script setup lang="ts">
import { provide, ref } from 'vue';
import { Button } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Home from './pages/Home.vue';
import Products from './pages/Products.vue';
import Solutions from './pages/Solutions.vue';
import Defense from './pages/Defense.vue';
import Developers from './pages/Developers.vue';
import Company from './pages/Company.vue';

type Page = 'home' | 'products' | 'solutions' | 'defense' | 'developers' | 'company';
const theme = ref<'dark' | 'light'>('dark');
const page = ref<Page>('home');

const PAGES = { home: Home, products: Products, solutions: Solutions, defense: Defense, developers: Developers, company: Company };
const NAV: { key: Page; label: string }[] = [
  { key: 'products', label: 'Products' },
  { key: 'solutions', label: 'Solutions' },
  { key: 'defense', label: 'Defense' },
  { key: 'developers', label: 'Developers' },
  { key: 'company', label: 'Company' },
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
  <div :data-theme="theme" class="web-root web-scroll h-dvh overflow-auto bg-background text-foreground">
    <!-- nav -->
    <header class="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <button class="flex items-center gap-2 font-semibold tracking-tight" @click="go('home')">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg" style="background: var(--foreground); color: var(--background)"><Icon name="drone" size="sm" /></span>
          Auterion
        </button>
        <nav class="hidden items-center gap-1 md:flex">
          <button
            v-for="l in NAV"
            :key="l.key"
            class="rounded-lg px-3 py-1.5 text-[14px] transition-colors"
            :class="page === l.key ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="go(l.key)"
          >
            {{ l.label }}
          </button>
        </nav>
        <div class="ml-auto flex items-center gap-2">
          <div class="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5">
            <button
v-for="t in (['dark','light'] as const)" :key="t" type="button"
              class="rounded-md px-2 py-1 text-[12px] capitalize transition-colors"
              :class="theme === t ? 'bg-secondary text-foreground' : 'text-muted-foreground'"
              @click="theme = t">{{ t }}</button>
          </div>
          <button class="hidden text-[14px] text-muted-foreground transition-colors hover:text-foreground sm:block">Sign in</button>
          <Button size="sm">Get started</Button>
        </div>
      </div>
    </header>

    <main>
      <component :is="PAGES[page]" />
    </main>

    <!-- footer -->
    <footer class="border-t border-border/60 bg-card/30">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-5">
        <div class="col-span-2 md:col-span-1">
          <button class="flex items-center gap-2 font-semibold" @click="go('home')">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg" style="background: var(--foreground); color: var(--background)"><Icon name="drone" size="sm" /></span>
            Auterion
          </button>
          <p class="mt-3 text-[13px] text-muted-foreground">The open software platform for autonomous robotics.</p>
        </div>
        <div v-for="col in footerCols" :key="col.h">
          <p class="text-[13px] font-semibold">{{ col.h }}</p>
          <ul class="mt-3 space-y-2">
            <li v-for="it in col.items" :key="it"><a class="text-[13px] text-muted-foreground transition-colors hover:text-foreground">{{ it }}</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-border/60">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-[12px] text-muted-foreground">
          <span>© 2026 Auterion AG. All rights reserved.</span>
          <span class="flex gap-4"><a class="hover:text-foreground">Privacy</a><a class="hover:text-foreground">Terms</a><a class="hover:text-foreground">Cookies</a></span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.web-root {
  background-image: radial-gradient(color-mix(in oklab, var(--foreground) 4%, transparent) 1px, transparent 1px);
  background-size: 28px 28px;
}
</style>
