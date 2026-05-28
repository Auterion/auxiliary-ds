<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { TabsContent } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { tabs } from '@auxiliary/css/recipes';

const props = defineProps<{
  value: string;
  forceMount?: boolean;
  class?: HTMLAttributes['class'];
}>();

const styles = tabs();
const rootClass = computed(() => cn(styles.content(), props.class));
</script>

<template>
  <TabsContent :value="value" :force-mount="forceMount" :class="rootClass">
    <slot />
  </TabsContent>
</template>
