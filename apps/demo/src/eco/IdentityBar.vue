<script setup lang="ts">
/* THE identity bar. One implementation, rendered five times on this page.
 *
 * Its STRUCTURE never varies:
 *
 *     mark · AUTERION · / · SURFACE · apps · surface tabs · org · account
 *
 * Its PALETTE and its DENSITY do — both re-resolve from `[data-theme]` and
 * `[data-register]` on an ancestor, which is why the ecosystem layer costs one
 * component rather than five. Nothing in here reads the theme or the register;
 * it cannot, and that is the point. Every colour is a semantic token and every
 * measure steps off `--control-height-*`, so a surface that sets
 * `data-register="operational"` gets a bar 4px shorter with tighter corners and
 * quicker transitions without this file, or its caller, knowing it happened.
 *
 * What the bar deliberately does NOT do is reach down into how a surface does
 * its job. It renders whatever tabs it is handed and knows nothing else about
 * them. The moment a shared shell starts owning a product's own navigation,
 * product teams refuse it — and they are right to.
 */
import { ref } from 'vue';
import { Icon } from '@auxiliary/icons';
import AuterionMark from './AuterionMark.vue';
import type { Surface } from './surfaces';

const props = defineProps<{
  /** Omit for the ecosystem root — the launcher, which is nowhere in
   *  particular and so prints no name after the slash. */
  surface?: Surface;
  /** The org whose data is on screen. A safety fact, not a preference. */
  org: string;
}>();

/* Tabs are surface-local, so the bar holds only which one is marked. On this
 * page the marker moves and the body below does not: the bodies are frozen
 * specimens, and the caption says so rather than the tab pretending otherwise. */
const active = ref(props.surface?.tabs[0] ?? '');
</script>

<template>
  <div class="ec-bar">
    <span class="ec-bar-mark">
      <AuterionMark :size="20" />
    </span>

    <span class="ec-bar-word">Auterion</span>

    <template v-if="surface">
      <span class="ec-bar-slash" aria-hidden="true">/</span>
      <span class="ec-bar-surface">{{ surface.chrome }}</span>

      <!-- The app grid. In the shipped shell it opens the switcher; on this
           page the launcher is a real place, so it is a real link to it. -->
      <a class="ec-bar-apps" href="#launcher" aria-label="Open the launcher">
        <span class="ec-dots" aria-hidden="true">
          <i v-for="n in 9" :key="n" />
        </span>
      </a>
    </template>

    <nav
      v-if="surface && surface.tabs.length"
      class="ec-bar-tabs"
      :aria-label="`${surface.formal} sections`"
    >
      <button
        v-for="tab in surface.tabs"
        :key="tab"
        type="button"
        class="ec-bar-tab"
        :aria-current="active === tab ? 'page' : undefined"
        @click="active = tab"
      >
        {{ tab }}
      </button>
    </nav>

    <span class="ec-bar-grow" />

    <span class="ec-bar-right">
      <span class="ec-org">
        <Icon name="users" :size="11" aria-hidden="true" />
        {{ org }}
      </span>
      <a class="ec-account" href="#launcher-account" aria-label="Account details">
        <Icon name="user" :size="15" aria-hidden="true" />
      </a>
    </span>
  </div>
</template>
