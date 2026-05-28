<script setup lang="ts">
import { computed } from 'vue';

export type StatusLevel = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

const props = withDefaults(
  defineProps<{
    level: StatusLevel;
    variant?: 'solid' | 'outline';
    size?: 'sm' | 'md';
    dot?: boolean;
  }>(),
  {
    variant: 'solid',
    size: 'md',
    dot: false,
  },
);

const classes = computed(() => {
  const base = 'inline-flex items-center gap-1.5 rounded-full font-medium uppercase tracking-wide';
  const sizing = props.size === 'sm' ? 'h-5 px-2 text-[10px]' : 'h-6 px-2.5 text-xs';

  const color =
    props.variant === 'outline'
      ? {
          alarm:    'border border-alarm text-alarm',
          warning:  'border border-warning text-warning',
          caution:  'border border-caution text-caution',
          advisory: 'border border-advisory text-advisory',
          nominal:  'border border-nominal text-nominal',
        }
      : {
          alarm:    'bg-alarm text-alarm-foreground border border-alarm',
          warning:  'bg-warning text-warning-foreground border border-warning',
          caution:  'bg-caution text-caution-foreground border border-caution',
          advisory: 'bg-advisory text-advisory-foreground border border-advisory',
          nominal:  'bg-nominal text-nominal-foreground border border-nominal',
        };

  return [base, sizing, color[props.level]].join(' ');
});

const dotClass = computed(() => {
  if (props.variant === 'solid') {
    return {
      alarm:    'bg-alarm-foreground',
      warning:  'bg-warning-foreground',
      caution:  'bg-caution-foreground',
      advisory: 'bg-advisory-foreground',
      nominal:  'bg-nominal-foreground',
    }[props.level];
  }
  return {
    alarm:    'bg-alarm',
    warning:  'bg-warning',
    caution:  'bg-caution',
    advisory: 'bg-advisory',
    nominal:  'bg-nominal',
  }[props.level];
});
</script>

<template>
  <span :class="classes">
    <span
      v-if="dot"
      class="h-2 w-2 rounded-full"
      :class="dotClass"
      aria-hidden="true"
    />
    <slot />
  </span>
</template>
