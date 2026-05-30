<script setup lang="ts">
import { computed } from 'vue';
import type { UnitSystem } from '@auxiliary/css/format';
import { provideUnitSystem } from '../composables/useUnitSystem';

const props = withDefaults(
  defineProps<{
    /** Display unit system for descendant readouts. */
    system?: UnitSystem;
    /** Intl locale for descendant readouts (number grouping/separators). Unset = deterministic, no grouping. */
    locale?: string;
  }>(),
  {
    system: 'metric',
  },
);

provideUnitSystem({
  system: computed(() => props.system),
  locale: computed(() => props.locale),
});
</script>

<template>
  <slot />
</template>
