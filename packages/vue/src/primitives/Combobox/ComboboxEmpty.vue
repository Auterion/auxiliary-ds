<script setup lang="ts">
// Shown when the filter matches no items. Defaults to "No results."
import { ComboboxEmpty } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { combobox } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = combobox();
const rootClass = computed(() => cn(styles.empty(), props.class));
</script>

<template>
  <ComboboxEmpty :class="rootClass">
    <slot>No results.</slot>
  </ComboboxEmpty>
</template>
