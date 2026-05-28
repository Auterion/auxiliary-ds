<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { TabsList } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { tabs } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = tabs();
const rootClass = computed(() => cn(styles.list(), props.class));
</script>

<template>
  <TabsList :class="rootClass">
    <slot />
  </TabsList>
</template>
