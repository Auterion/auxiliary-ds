<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'reka-ui';
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      class="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-md border border-border bg-card p-6 shadow-lg outline-none"
    >
      <slot />
      <DialogClose
        aria-label="Close"
        class="absolute right-4 top-4 rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring"
      >
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
