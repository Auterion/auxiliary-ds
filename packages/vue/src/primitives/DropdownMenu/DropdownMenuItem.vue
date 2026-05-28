<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { DropdownMenuItem } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { dropdownMenu } from '@auxiliary/css/recipes';

const props = defineProps<{
  disabled?: boolean;
  class?: HTMLAttributes['class'];
}>();

defineEmits<{
  (e: 'select', event: Event): void;
}>();

const styles = dropdownMenu();
const rootClass = computed(() => cn(styles.item(), props.class));
</script>

<template>
  <DropdownMenuItem
    :disabled="disabled"
    :class="rootClass"
    @select="$emit('select', $event)"
  >
    <slot />
  </DropdownMenuItem>
</template>
