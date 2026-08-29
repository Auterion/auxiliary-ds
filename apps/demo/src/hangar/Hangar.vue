<script setup lang="ts">
/* Hallmark · macrostructure: Full-bleed modular grid (agency press site)
 * tone: declarative/absolute · anchor hue: none — achromatic by decision
 *
 * "HANGAR" — auterion.com in a high-contrast monochrome grid grammar.
 *
 * The layout language is after armory.framer.ai: a four-column rule field with
 * prose in the middle half, bands alternating between near-black and near-white,
 * one display cut carrying the whole hierarchy, and mono reserved for facts.
 * The CONTENT is Auterion's, and the grammar is stated once in `_hangar.css`.
 *
 * Two decisions worth naming, because both are the opposite of the reference:
 *
 *   · NO PHOTOGRAPHY. Every image slot is a generated monochrome plate
 *     (`parts/Plate.vue`) — halftone, contour, scan, orbit, swarm. Stock is the
 *     one asset a design system cannot supply and the one a defence company
 *     should not fake.
 *   · NO PRODUCT HUE. The sheet spends zero chroma. Auterion blue appears
 *     nowhere, which is what would make a status colour unmissable if one ever
 *     appeared on this surface.
 *
 * Six pages, as asked: home · product · solutions · company · careers · news.
 */
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue';
import { NAV, type PageKey } from './content';
import Home from './pages/Home.vue';
import Product from './pages/Product.vue';
import Solutions from './pages/Solutions.vue';
import Company from './pages/Company.vue';
import Careers from './pages/Careers.vue';
import News from './pages/News.vue';
import './_hangar.css';

const PAGES = { home: Home, product: Product, solutions: Solutions, company: Company, careers: Careers, news: News };

const page = ref<PageKey>('home');
const menuOpen = ref(false);
const scroller = ref<HTMLElement | null>(null);
const menuFirst = ref<HTMLElement | null>(null);
const burger = ref<HTMLElement | null>(null);

const current = computed(() => PAGES[page.value]);
const heading = computed(() => NAV.find((n) => n.key === page.value)?.label ?? '');

function go(next: PageKey) {
  page.value = next;
  menuOpen.value = false;
  scroller.value?.scrollTo({ top: 0 });
}
/* Pages navigate by injection rather than by prop-drilling through six files;
 * the sheet has no router, and pretending otherwise would put a fake URL in
 * every href. */
provide('hangar-navigate', go);

/* The overlay is a modal surface: focus moves into it on open and back to the
 * control that opened it on close, and Escape always closes. */
watch(menuOpen, async (open) => {
  await nextTick();
  if (open) menuFirst.value?.focus();
  else burger.value?.focus();
});

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && menuOpen.value) menuOpen.value = false;
}
window.addEventListener('keydown', onKey);
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <div ref="scroller" class="hg-root" style="block-size: 100dvh; overflow-y: auto">
    <!-- The masthead takes no fill and blends against whatever band is under
         it, so the mark flips black-on-paper / white-on-ink with no script. -->
    <header class="hg-mast">
      <button type="button" class="hg-mark" style="border: 0; background: none; cursor: pointer" @click="go('home')">
        <svg width="22" height="22" viewBox="0 0 380 380" aria-hidden="true" focusable="false">
          <path
            d="M327.102 266.371L369 379H285.204C278.221 379 272.087 374.57 269.823 367.973L250.195 310.197L327.102 266.371ZM347.862 213.214L142.336 278.718C133.182 281.64 124.784 272.498 128.37 263.638L175.175 149.972C179.138 140.265 193.01 140.736 196.407 150.632L222.735 228.483L303.511 202.752L232.926 13.0272C230.472 6.3355 224.15 2 216.978 2H166.304C159.416 2 153.188 6.147 150.545 12.556L11.263 355.626C6.7335 366.748 14.9432 379 27.0219 379H72.2227C78.7338 379 85.245 377.304 90.9069 374.005L352.958 224.713C355.695 223.205 356.827 219.906 355.789 216.984C354.657 213.874 351.165 212.178 347.862 213.214Z"
            fill="currentColor"
          />
        </svg>
        <span class="hg-mark-word" translate="no">Auterion</span>
      </button>

      <button
        ref="burger"
        type="button"
        class="hg-burger"
        :aria-expanded="menuOpen"
        aria-controls="hg-menu"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <span /><span /><span />
      </button>
    </header>

    <!-- ── Menu overlay ───────────────────────────────────────────────── -->
    <div v-if="menuOpen" id="hg-menu" class="hg-menu" data-band="ink" role="dialog" aria-modal="true" aria-label="Site menu">
      <div />
      <nav aria-label="Pages">
        <ul class="hg-menu-list">
          <li v-for="(n, i) in NAV" :key="n.key">
            <button
              :ref="(el) => { if (i === 0) menuFirst = el as HTMLElement; }"
              type="button"
              class="hg-menu-link"
              :aria-current="page === n.key ? 'page' : undefined"
              @click="go(n.key)"
            >
              <span class="hg-menu-idx">{{ String(i + 1).padStart(2, '0') }}</span>
              <span>{{ n.label }}</span>
            </button>
          </li>
        </ul>
      </nav>
      <div class="hg-menu-foot">
        <p class="hg-meta">Zurich · Arlington · Munich · Salt Lake City</p>
        <p class="hg-meta">hello@auterion.com</p>
      </div>
    </div>

    <main :aria-label="heading">
      <component :is="current" />
    </main>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <footer class="hg-band" data-band="ink">
      <div class="hg-rules" aria-hidden="true"><i /><i /><i /><i /></div>

      <div class="hg-foot-cols">
        <div>
          <svg width="44" height="44" viewBox="0 0 380 380" aria-hidden="true" focusable="false" style="color: var(--hg-fg)">
            <path
              d="M327.102 266.371L369 379H285.204C278.221 379 272.087 374.57 269.823 367.973L250.195 310.197L327.102 266.371ZM347.862 213.214L142.336 278.718C133.182 281.64 124.784 272.498 128.37 263.638L175.175 149.972C179.138 140.265 193.01 140.736 196.407 150.632L222.735 228.483L303.511 202.752L232.926 13.0272C230.472 6.3355 224.15 2 216.978 2H166.304C159.416 2 153.188 6.147 150.545 12.556L11.263 355.626C6.7335 366.748 14.9432 379 27.0219 379H72.2227C78.7338 379 85.245 377.304 90.9069 374.005L352.958 224.713C355.695 223.205 356.827 219.906 355.789 216.984C354.657 213.874 351.165 212.178 347.862 213.214Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div>
          <h2 class="hg-foot-h">Pages</h2>
          <ul class="hg-foot-list">
            <li v-for="n in NAV" :key="n.key">
              <button type="button" class="hg-foot-link" @click="go(n.key)">{{ n.label }}</button>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="hg-foot-h">Platform</h2>
          <ul class="hg-foot-list">
            <li v-for="s in ['Skynode', 'AuterionOS', 'Mission Control', 'AuterionSuite', 'Nemyx']" :key="s">
              <button type="button" class="hg-foot-link" translate="no" @click="go('product')">{{ s }}</button>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="hg-foot-h">Legal</h2>
          <ul class="hg-foot-list">
            <li><span class="hg-foot-link" style="cursor: default">Terms of service</span></li>
            <li><span class="hg-foot-link" style="cursor: default">Privacy policy</span></li>
            <li><span class="hg-foot-link" style="cursor: default">Export compliance</span></li>
            <li><span class="hg-foot-link" style="cursor: default">Security</span></li>
          </ul>
        </div>
      </div>

      <!-- The stamp. Clipped by the viewport on purpose. -->
      <p class="hg-wordmark" translate="no" aria-hidden="true">Auterion</p>
      <p class="hg-colophon hg-meta">
        ©2026 Auterion AG · A design-system specimen, not the live site
      </p>
    </footer>
  </div>
</template>
