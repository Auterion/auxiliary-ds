<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { TabsTrigger } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { tabs } from '@auxiliary/css/recipes';

const props = defineProps<{
  value: string;
  disabled?: boolean;
  class?: HTMLAttributes['class'];
}>();

const styles = tabs();
const rootClass = computed(() => cn(styles.trigger(), props.class));
</script>

<template>
  <TabsTrigger :value="value" :disabled="disabled" :class="rootClass">
    <slot />
  </TabsTrigger>
</template>
