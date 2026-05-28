<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { DropdownMenuLabel } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { dropdownMenu } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = dropdownMenu();
const rootClass = computed(() => cn(styles.label(), props.class));
</script>

<template>
  <DropdownMenuLabel :class="rootClass">
    <slot />
  </DropdownMenuLabel>
</template>
