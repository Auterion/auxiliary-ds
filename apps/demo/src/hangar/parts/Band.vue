<script setup lang="ts">
/* One band of the sheet: an exposure, and the four-column rule field.
 *
 * Every section on every page is one of these. The `exposure` is the only
 * styling decision a page makes — everything below it reads the `--hg-*`
 * aliases the band sets, so a page never names a colour. */
withDefaults(
  defineProps<{
    exposure?: 'ink' | 'paper';
    /** Vertical rhythm. `none` for bands that manage their own. */
    pad?: 'default' | 'small' | 'none';
    id?: string;
  }>(),
  { exposure: 'paper', pad: 'default' },
);
</script>

<template>
  <section
    :id="id"
    class="hg-band"
    :data-band="exposure"
    :class="{ 'hg-pad': pad === 'default', 'hg-pad-sm': pad === 'small' }"
  >
    <!-- The backdrop paints UNDER the rule field, and does so by DOM order
         rather than by a second z-index step: both sit at the same layer, and
         the later element wins. That keeps the sheet on the system's z ladder
         instead of inventing a rung below it. -->
    <div v-if="$slots.backdrop" class="hg-backdrop" aria-hidden="true"><slot name="backdrop" /></div>

    <!-- Decorative and inert. Four cells, three visible rules. -->
    <div class="hg-rules" aria-hidden="true"><i /><i /><i /><i /></div>
    <slot />
  </section>
</template>
