<script setup lang="ts">
/* The launcher — the highest-leverage screen in the proposal and the cheapest.
 *
 * What exists today in place of this: one "View in Suite" sidebar link, and a
 * hardcoded `http://10.41.1.1` repeated across four Suite files. A place
 * replaces both.
 *
 * Three details are load-bearing, and each is a decision the artifact argued
 * for rather than a decoration:
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
import { Icon } from '@auxiliary/icons';
import IdentityBar from './IdentityBar.vue';
import SurfaceGlyph from './SurfaceGlyph.vue';
import { SURFACES, spell } from './surfaces';

defineProps<{ org: string }>();
</script>

<template>
  <div>
    <IdentityBar :org="org" />

    <div class="ec-launch">
      <div class="ec-launch-head">
        <div>
          <h3 class="ec-tile-name" style="font-size: 26px">Your surfaces</h3>
          <p class="ec-tile-blurb" style="margin-top: 4px">
            One account, {{ spell(SURFACES.length) }} places, nothing to relearn between them.
          </p>
        </div>
        <span class="ec-chip">
          <b>Support</b><span>24/7</span>
        </span>
      </div>

      <div class="ec-tiles">
        <a
          v-for="s in SURFACES"
          :key="s.id"
          class="ec-tile"
          :href="`#surface-${s.id}`"
          :data-proposed="s.proposed ? 'true' : 'false'"
        >
          <span class="ec-tile-top">
            <span class="ec-glyph">
              <SurfaceGlyph :surface="s.id" :size="22" />
            </span>
            <span>
              <span class="ec-tile-name" style="display: block">{{ s.chrome }}</span>
              <span
                class="ec-tile-blurb"
                style="display: block; font-size: 11px; letter-spacing: 0.04em"
              >{{ s.formal }}</span>
            </span>
          </span>

          <span class="ec-tile-blurb">{{ s.blurb }}</span>

          <span class="ec-chips">
            <span class="ec-chip"><b>Theme</b><span>{{ s.theme }}</span></span>
            <span class="ec-chip"><b>Register</b><span>{{ s.register }}</span></span>
            <span v-if="s.proposed" class="ec-chip"><b>Status</b><span>proposed</span></span>
          </span>
        </a>
      </div>

      <p id="launcher-account" class="ec-launch-foot">
        <Icon name="lock" :size="14" aria-hidden="true" />
        Signed in as
        <span style="color: var(--foreground)">y.dimov@auterion.com</span>
        · {{ org }} · Operator
      </p>
    </div>
  </div>
</template>
