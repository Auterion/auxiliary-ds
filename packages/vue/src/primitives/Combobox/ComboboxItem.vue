<script setup lang="ts">
import { ComboboxItem, ComboboxItemIndicator } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { combobox } from '@auxiliary/css/recipes';

const props = defineProps<{
  value: string | number | Record<string, unknown>;
  disabled?: boolean;
  class?: HTMLAttributes['class'];
}>();

const styles = combobox();
const rootClass = computed(() => cn(styles.item(), props.class));
</script>

<template>
  <ComboboxItem :value="value" :disabled="disabled" :class="rootClass">
    <ComboboxItemIndicator :class="styles.itemIndicator()">
      <svg
        class="size-(--component-combobox-item-icon-size)"
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
    </ComboboxItemIndicator>
    <slot />
  </ComboboxItem>
</template>
