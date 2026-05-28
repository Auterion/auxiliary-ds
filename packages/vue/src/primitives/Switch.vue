<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui';

defineProps<{
  modelValue?: boolean;
  defaultValue?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', checked: boolean): void;
}>();
</script>

<template>
  <SwitchRoot
    :id="id"
    :model-value="modelValue"
    :default-value="defaultValue"
    :disabled="disabled"
    :required="required"
    :name="name"
    :value="value"
    class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-input bg-input outline-none data-[state=checked]:bg-accent data-[state=checked]:border-accent focus-visible:ring-2 ring-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <SwitchThumb
      class="block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-canvas shadow-sm transition-transform data-[state=checked]:translate-x-[18px]"
    />
  </SwitchRoot>
</template>
