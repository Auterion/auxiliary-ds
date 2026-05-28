<script setup lang="ts">
import { SelectSeparator } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { select } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = select();
const rootClass = computed(() => cn(styles.separator(), props.class));
</script>

<template>
  <SelectSeparator :class="rootClass" />
</template>
