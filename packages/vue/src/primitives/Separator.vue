<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { Separator } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { separator } from '@auxiliary/css/recipes';

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
    class?: HTMLAttributes['class'];
  }>(),
  {
    orientation: 'horizontal',
    decorative: true,
  },
);

const rootClass = computed(() =>
  cn(separator({ orientation: props.orientation }), props.class),
);
</script>

<template>
  <Separator
    :orientation="orientation"
    :decorative="decorative"
    :class="rootClass"
  />
</template>
