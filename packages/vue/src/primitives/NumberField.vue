<script setup lang="ts">
import {
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  useForwardPropsEmits,
  type NumberFieldRootProps,
  type NumberFieldRootEmits,
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { numberField, type NumberFieldVariants } from '@auxiliary/css/recipes';

const props = defineProps<
  NumberFieldRootProps & {
    /** Shared size scale (sm | md | lg). */
    size?: NumberFieldVariants['size'];
    /** Marks the control invalid: sets aria-invalid + destructive border/ring. */
    invalid?: boolean;
    /** Trailing unit label (e.g. "m", "kts", "MHz") — decorative, shown after the value. */
    unit?: string;
    /** Accessible label for the decrement button. Override to match the field's operational context (e.g. "Minus"). Default: "Decrease". */
    decrementLabel?: string;
    /** Accessible label for the increment button. Override to match the field's operational context (e.g. "Plus"). Default: "Increase". */
    incrementLabel?: string;
    class?: HTMLAttributes['class'];
  }
>();
const emits = defineEmits<NumberFieldRootEmits>();

const delegated = computed(() => {
  // decrementLabel/incrementLabel are consumed by the stepper buttons below —
  // strip them too, or they fall through NumberFieldRoot as DOM attributes.
  const {
    class: _class,
    size: _size,
    invalid: _invalid,
    unit: _unit,
    decrementLabel: _dec,
    incrementLabel: _inc,
    ...rest
  } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);

const styles = computed(() => numberField({ size: props.size, invalid: props.invalid }));
const rootClass = computed(() => cn(styles.value.root(), props.class));
</script>

<template>
  <NumberFieldRoot v-bind="forwarded" :class="rootClass">
    <NumberFieldDecrement :class="styles.button()" :aria-label="decrementLabel ?? 'Decrease'">
      <svg
        class="size-(--component-number-field-icon-size)"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </NumberFieldDecrement>

    <NumberFieldInput :class="styles.input()" :aria-invalid="invalid || undefined" />

    <span v-if="unit" :class="styles.unit()" aria-hidden="true">{{ unit }}</span>

    <NumberFieldIncrement :class="styles.button()" :aria-label="incrementLabel ?? 'Increase'">
      <svg
        class="size-(--component-number-field-icon-size)"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </NumberFieldIncrement>
  </NumberFieldRoot>
</template>
