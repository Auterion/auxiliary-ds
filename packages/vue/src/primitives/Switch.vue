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

const props = defineProps<
  SwitchRootProps & {
    /** Marks the control invalid: sets aria-invalid + destructive border/ring. */
    invalid?: boolean;
    class?: HTMLAttributes['class'];
  }
>();
const emits = defineEmits<SwitchRootEmits>();

const delegated = computed(() => {
  const { class: _class, invalid: _invalid, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);

const styles = computed(() => switchControl({ invalid: props.invalid }));
const rootClass = computed(() => cn(styles.value.root(), props.class));
</script>

<template>
  <SwitchRoot v-bind="forwarded" :aria-invalid="invalid || undefined" :class="rootClass">
    <SwitchThumb :class="styles.thumb()" />
  </SwitchRoot>
</template>
