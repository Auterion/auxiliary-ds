<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { statusBadge } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

export type StatusLevel = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

const props = withDefaults(
  defineProps<{
    level: StatusLevel;
    variant?: 'solid' | 'outline';
    size?: 'sm' | 'md';
    dot?: boolean;
    class?: HTMLAttributes['class'];
  }>(),
  {
    variant: 'solid',
    size: 'md',
    dot: false,
  },
);

const styles = computed(() =>
  statusBadge({ level: props.level, variant: props.variant, size: props.size }),
);

const classes = computed(() => cn(styles.value.base(), props.class));
const dotClass = computed(() => styles.value.dot());
</script>

<template>
  <span :class="classes">
    <span
      v-if="dot"
      :class="dotClass"
      aria-hidden="true"
    />
    <slot />
  </span>
</template>
