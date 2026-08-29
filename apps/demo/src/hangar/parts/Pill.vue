<script setup lang="ts">
/* The CTA. A glyph block welded to a label — see `_hangar.css`.
 *
 * Renders an <a> when given an href and a <button> otherwise, because a thing
 * that goes somewhere and a thing that does something are not the same control
 * and must not look identical to a keyboard or a screen reader. */
import { Icon, type IconName } from '@auxiliary/icons';

withDefaults(
  defineProps<{
    label: string;
    href?: string;
    icon?: IconName;
    variant?: 'solid' | 'ghost';
  }>(),
  { icon: 'arrow-right', variant: 'solid' },
);
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : 'button'"
    class="hg-pill"
    :data-variant="variant"
  >
    <span class="hg-pill-glyph"><Icon :name="icon" :size="15" aria-hidden="true" /></span>
    <span class="hg-pill-label">{{ label }}</span>
  </component>
</template>
