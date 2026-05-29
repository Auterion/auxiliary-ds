<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import {
  RadioGroupRoot,
  useForwardPropsEmits,
  type RadioGroupRootEmits,
  type RadioGroupRootProps,
} from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { radioGroup } from '@auxiliary/css/recipes';

const props = defineProps<
  RadioGroupRootProps & {
    /** Marks the group invalid: sets aria-invalid on the group root. Pair with a
     * field-level error message; individual items are not recolored. */
    invalid?: boolean;
    class?: HTMLAttributes['class'];
  }
>();
const emits = defineEmits<RadioGroupRootEmits>();

const delegated = computed(() => {
  const { class: _class, invalid: _invalid, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);

const styles = radioGroup();
const rootClass = computed(() =>
  cn(
    styles.root({ orientation: props.orientation === 'horizontal' ? 'horizontal' : 'vertical' }),
    props.class,
  ),
);
</script>

<template>
  <RadioGroupRoot v-bind="forwarded" :aria-invalid="invalid || undefined" :class="rootClass">
    <slot />
  </RadioGroupRoot>
</template>
