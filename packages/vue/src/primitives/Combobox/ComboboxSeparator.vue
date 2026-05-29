<script setup lang="ts">
import { ComboboxSeparator } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { combobox } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = combobox();
const rootClass = computed(() => cn(styles.separator(), props.class));
</script>

<template>
  <ComboboxSeparator :class="rootClass" />
</template>
