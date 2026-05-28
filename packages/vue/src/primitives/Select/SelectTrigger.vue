<script setup lang="ts">
import { SelectIcon, SelectTrigger } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { select } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = select();
const rootClass = computed(() => cn(styles.trigger(), props.class));
</script>

<template>
  <SelectTrigger :class="rootClass">
    <slot />
    <SelectIcon>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="styles.triggerIcon()"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </SelectIcon>
  </SelectTrigger>
</template>
