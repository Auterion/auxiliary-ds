<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui';

defineProps<{
  value: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}>();
</script>

<template>
  <RadioGroupItem
    :id="id"
    :value="value"
    :disabled="disabled"
    :required="required"
    class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-input bg-background outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed data-[state=checked]:border-primary"
  >
    <RadioGroupIndicator class="flex items-center justify-center">
      <span class="h-2 w-2 rounded-full bg-primary" />
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
