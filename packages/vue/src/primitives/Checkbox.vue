<script setup lang="ts">
import {
  CheckboxIndicator,
  CheckboxRoot,
  useForwardPropsEmits,
  type CheckboxRootEmits,
  type CheckboxRootProps,
} from 'reka-ui';

const props = defineProps<CheckboxRootProps>();
const emits = defineEmits<CheckboxRootEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    class="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input bg-background outline-none data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <CheckboxIndicator class="text-primary-foreground">
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
