<script setup lang="ts">
import {
  SwitchRoot,
  SwitchThumb,
  useForwardPropsEmits,
  type SwitchRootEmits,
  type SwitchRootProps,
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { switchControl } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<SwitchRootEmits>();

const delegated = computed(() => {
  const { class: _class, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);

const styles = switchControl();
const rootClass = computed(() => cn(styles.root(), props.class));
</script>

<template>
  <SwitchRoot v-bind="forwarded" :class="rootClass">
    <SwitchThumb :class="styles.thumb()" />
  </SwitchRoot>
</template>
