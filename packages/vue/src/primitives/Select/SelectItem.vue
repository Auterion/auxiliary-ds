<script setup lang="ts">
import { SelectItem, SelectItemIndicator, SelectItemText } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { select } from '@auxiliary/css/recipes';

const props = defineProps<{
  value: string;
  disabled?: boolean;
  class?: HTMLAttributes['class'];
}>();

const styles = select();
const rootClass = computed(() => cn(styles.item(), props.class));
</script>

<template>
  <SelectItem :value="value" :disabled="disabled" :class="rootClass">
    <SelectItemIndicator :class="styles.itemIndicator()">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </SelectItemIndicator>
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
