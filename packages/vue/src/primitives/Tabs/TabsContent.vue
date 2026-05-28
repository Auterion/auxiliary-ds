<script setup lang="ts">
import { TabsContent } from 'reka-ui';

defineProps<{
  value: string;
  forceMount?: boolean;
}>();
</script>

<template>
  <TabsContent
    :value="value"
    :force-mount="forceMount"
    class="mt-4 outline-none focus-visible:ring-2 ring-focus"
  >
    <slot />
  </TabsContent>
</template>
