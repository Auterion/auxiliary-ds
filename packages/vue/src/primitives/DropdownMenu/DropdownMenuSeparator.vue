<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { DropdownMenuSeparator } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { dropdownMenu } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = dropdownMenu();
const rootClass = computed(() => cn(styles.separator(), props.class));
</script>

<template>
  <DropdownMenuSeparator :class="rootClass" />
</template>
