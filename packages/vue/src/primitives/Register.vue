<script setup lang="ts">
import { type HTMLAttributes } from 'vue';

/**
 * Register — ergonomic wrapper for the operational↔expressive duality
 * (ROADMAP §6g / Phase 6.2).
 *
 * Sets the `data-register` attribute on a subtree, which re-resolves the
 * non-color "flex" tokens (control height, radius, motion) — exactly the way
 * `data-theme` re-resolves color. This is *pure convenience over the attribute*:
 * the token-mode layer is the source of truth, so `<div data-register="operational">`
 * works identically and this component never becomes load-bearing (Principle 2:
 * the axis lives in tokens/CSS, not in Vue).
 *
 * `expressive` is the system default (no attribute needed); the common use is to
 * opt a GCS/C2 subtree into `operational`. You can also nest an `expressive`
 * island inside an operational region to opt back out.
 */
const props = withDefaults(
  defineProps<{
    /** Which register this subtree resolves under. */
    register?: 'expressive' | 'operational';
    /** Element to render. Defaults to a plain block wrapper. */
    as?: string;
    class?: HTMLAttributes['class'];
  }>(),
  {
    register: 'operational',
    as: 'div',
  },
);
</script>

<template>
  <component :is="props.as" :data-register="props.register" :class="props.class">
    <slot />
  </component>
</template>
