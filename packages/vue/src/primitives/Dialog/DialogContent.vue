<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { dialog } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = dialog();
const contentClass = computed(() => cn(styles.content(), props.class));
</script>

<template>
  <DialogPortal>
    <DialogOverlay :class="styles.overlay()" />
    <DialogContent :class="contentClass">
      <slot />
      <DialogClose aria-label="Close" :class="styles.close()">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
