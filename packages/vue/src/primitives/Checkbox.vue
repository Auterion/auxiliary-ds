<script setup lang="ts">
import {
  CheckboxIndicator,
  CheckboxRoot,
  useForwardPropsEmits,
  type CheckboxRootEmits,
  type CheckboxRootProps,
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { checkbox } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = defineProps<
  CheckboxRootProps & {
    /** Marks the control invalid: sets aria-invalid + destructive border/ring. */
    invalid?: boolean;
    /**
     * Accessible name for the control. Use when there's no associated `<Label>`
     * — a checkbox has no visible text of its own, so without this (or a
     * `<Label for>`) it ships nameless. Sets `aria-label`; renders nothing
     * visible (`label` is reserved for visible text across the system).
     */
    ariaLabel?: string;
    class?: HTMLAttributes['class'];
  }
>();
const emits = defineEmits<CheckboxRootEmits>();

const delegated = computed(() => {
  const { class: _class, invalid: _invalid, ariaLabel: _ariaLabel, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);

const styles = computed(() => checkbox({ invalid: props.invalid }));
const rootClass = computed(() => cn(styles.value.root(), props.class));
</script>

<template>
  <CheckboxRoot v-bind="forwarded" :aria-invalid="invalid || undefined" :aria-label="ariaLabel || undefined" :class="rootClass">
    <CheckboxIndicator :class="styles.indicator()">
      <svg
        v-if="props.modelValue === 'indeterminate'"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <svg
        v-else
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
