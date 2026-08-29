<script setup lang="ts">
/* The launcher — the highest-leverage screen in the ecosystem layer, and the
 * cheapest (AD-D-038).
 *
 * What exists today in place of this: one "View in Suite" sidebar link, and a
 * hardcoded `http://10.41.1.1` repeated across four Suite files. A place
 * replaces both.
 *
 * Three details are load-bearing, and each is a decision rather than a
 * decoration:
 *
 *   · Every tile DECLARES its theme and register. The operator learns before
 *     they click that Control will be dark and dense and Suite light and roomy,
 *     so the switch stops being a jolt.
 *   · Org context sits in the identity bar, not in a sidebar popover the way
 *     Suite has it today. On a shared terminal, "which tenant am I in" is a
 *     safety question.
 *   · Docs is a tile, at equal weight. It is the tile a new operator opens
 *     first, and a footer link is not a place.
 */
import { computed, type HTMLAttributes } from 'vue';
import { launcher } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';
import { Icon } from '@auxiliary/icons';
import IdentityBar from './IdentityBar.vue';
import SurfaceGlyph from './SurfaceGlyph.vue';
import { SURFACES, type Surface } from './surfaces';

const props = withDefaults(
  defineProps<{
    /** The org whose data is on screen. */
    org: string;
    /** Who is signed in. Stated in full here, which is why the bar may drop the
     *  account control at panel width and lose nothing. */
    account?: string;
    /** The role that account holds in this org. */
    role?: string;
    /** Which surfaces to offer. Defaults to the whole declared ecosystem. */
    surfaces?: Surface[];
    /** Given a surface, where its tile goes. */
    href?: (surface: Surface) => string;
    class?: HTMLAttributes['class'];
  }>(),
  { href: (s: Surface) => `#surface-${s.id}` },
);

const list = computed(() => props.surfaces ?? SURFACES);
const ui = launcher();
</script>

<template>
  <div :class="cn(props.class)">
    <IdentityBar :org="org" />

    <div :class="ui.root()">
      <div :class="ui.head()">
        <div>
          <h2 :class="ui.title()">Your surfaces</h2>
          <p :class="ui.blurb()">One account, every place, nothing to relearn between them.</p>
        </div>
        <span :class="ui.chip()"><span :class="ui.chipLabel()">Support</span><span>24/7</span></span>
      </div>

      <div :class="ui.tiles()">
        <a
          v-for="s in list"
          :key="s.id"
          :class="ui.tile()"
          :href="href(s)"
          :data-proposed="s.proposed ? 'true' : 'false'"
        >
          <span :class="ui.tileTop()">
            <span :class="ui.glyph()">
              <SurfaceGlyph :surface="s.id" />
            </span>
            <span>
              <span :class="ui.name()">{{ s.chrome }}</span>
              <span :class="ui.formal()">{{ s.formal }}</span>
            </span>
          </span>

          <span :class="ui.blurb()">{{ s.blurb }}</span>

          <span :class="ui.chips()">
            <span :class="ui.chip()">
              <span :class="ui.chipLabel()">Theme</span><span>{{ s.theme }}</span>
            </span>
            <span :class="ui.chip()">
              <span :class="ui.chipLabel()">Register</span><span>{{ s.register }}</span>
            </span>
            <span v-if="s.proposed" :class="ui.chip()">
              <span :class="ui.chipLabel()">Status</span><span>proposed</span>
            </span>
          </span>
        </a>
      </div>

      <p v-if="account" :class="ui.foot()">
        <Icon name="lock" :size="14" aria-hidden="true" />
        <span>
          Signed in as <span class="text-foreground">{{ account }}</span>
          · {{ org }}<template v-if="role"> · {{ role }}</template>
        </span>
      </p>
    </div>
  </div>
</template>
