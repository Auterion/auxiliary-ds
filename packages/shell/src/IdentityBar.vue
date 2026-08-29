<script setup lang="ts">
/* THE identity bar. One implementation, every Auterion surface (AD-D-038).
 *
 * Its STRUCTURE never varies:
 *
 *     mark · AUTERION · / · SURFACE · apps · surface tabs · org · account
 *
 * Its PALETTE and its DENSITY do — both re-resolve from `[data-theme]` and
 * `[data-register]` on an ancestor, which is why the ecosystem layer costs one
 * component rather than five. Nothing in here reads the theme or the register;
 * it cannot, and that is the point. Every colour is a semantic token and every
 * measure steps off the component tier, so a surface that sets
 * `data-register="operational"` gets a shorter bar with tighter corners and
 * quicker transitions without this file, or its caller, knowing it happened.
 *
 * What the bar deliberately does NOT do is reach down into how a surface does
 * its job. It renders whatever tabs it is handed and knows nothing else about
 * them. The moment a shared shell starts owning a product's own navigation,
 * product teams refuse it — and they are right to.
 */
import { computed, ref, watch, type HTMLAttributes } from 'vue';
import { identityBar } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';
import { Icon } from '@auxiliary/icons';
import { Logo } from '@auxiliary/brand';
import type { Surface } from './surfaces';

const props = withDefaults(
  defineProps<{
    /** Omit for the ecosystem root — the launcher, which is nowhere in
     *  particular and so prints no name after the slash. */
    surface?: Surface;
    /** The org whose data is on screen. A safety fact, not a preference. */
    org: string;
    /** Which surface-local tab is current. Uncontrolled when omitted. */
    tab?: string;
    /** Where the app grid goes. A real place, not a menu that pretends to be one. */
    launcherHref?: string;
    /** Where the account control goes. */
    accountHref?: string;
    class?: HTMLAttributes['class'];
  }>(),
  { launcherHref: '#launcher', accountHref: '#account' },
);

const emit = defineEmits<{ 'update:tab': [tab: string] }>();

/* Tabs are surface-local, so the bar holds only which one is marked — and only
 * when the caller has not said. A product with a router owns its own current
 * tab and passes it down; a specimen sheet does not, and should not have to. */
const internal = ref(props.surface?.tabs[0] ?? '');
watch(
  () => props.surface,
  (s) => {
    internal.value = s?.tabs[0] ?? '';
  },
);
const current = computed(() => props.tab ?? internal.value);

function select(tab: string) {
  internal.value = tab;
  emit('update:tab', tab);
}

const ui = identityBar();
</script>

<template>
  <div :class="cn(ui.root(), props.class)">
    <!-- The real mark, from the brand registry — not a second copy of the path.
         It fills with `currentColor`, so the slot paints it `--brand` and the
         theme decides what that means: blue in light and dark, black in
         sunlight, amber in darknight. -->
    <span :class="ui.mark()">
      <Logo id="auterion" kind="mark" decorative />
    </span>

    <span :class="ui.word()">Auterion</span>

    <template v-if="surface">
      <span :class="ui.slash()" aria-hidden="true">/</span>
      <span :class="ui.surface()">{{ surface.chrome }}</span>

      <a :class="ui.apps()" :href="launcherHref" aria-label="Open the launcher">
        <span :class="ui.dots()" aria-hidden="true">
          <i v-for="n in 9" :key="n" :class="ui.dot()" />
        </span>
      </a>
    </template>

    <nav
      v-if="surface && surface.tabs.length"
      :class="ui.tabs()"
      :aria-label="`${surface.formal} sections`"
    >
      <button
        v-for="t in surface.tabs"
        :key="t"
        type="button"
        :class="ui.tab()"
        :aria-current="current === t ? 'page' : undefined"
        @click="select(t)"
      >
        {{ t }}
      </button>
    </nav>

    <span :class="ui.grow()" />

    <span :class="ui.right()">
      <span :class="ui.org()">
        <Icon name="users" :size="11" aria-hidden="true" />
        {{ org }}
      </span>
      <a :class="ui.account()" :href="accountHref" aria-label="Account details">
        <Icon name="user" :size="15" aria-hidden="true" />
      </a>
    </span>
  </div>
</template>
