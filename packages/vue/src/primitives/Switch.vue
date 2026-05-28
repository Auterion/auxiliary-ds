<script setup lang="ts">
import {
  SwitchRoot,
  SwitchThumb,
  useForwardPropsEmits,
  type SwitchRootEmits,
  type SwitchRootProps,
} from 'reka-ui';

const props = defineProps<SwitchRootProps>();
const emits = defineEmits<SwitchRootEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-input bg-background outline-none data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    <SwitchThumb
      class="block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-background shadow-sm transition-transform data-[state=checked]:translate-x-[18px]"
    />
  </SwitchRoot>
</template>
