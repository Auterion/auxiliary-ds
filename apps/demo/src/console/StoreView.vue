<script setup lang="ts">
/* Store — the design lists this in the rail but doesn't specify the page, so it
 * ships as an honest empty state rather than invented content. */
import { Card } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
</script>

<template>
  <Card class="bp-card p-10 text-center">
    <span class="bp-tile mx-auto"><Icon name="copy" size="lg" /></span>
    <h2 class="bp-ink-1 pt-4 text-[14px] font-semibold">Store</h2>
    <p class="bp-ink-2 mx-auto max-w-sm pt-1 text-[13px] leading-4">
      Payloads, spares and software add-ons for your fleet. This surface isn't part
      of the home-page design yet.
    </p>
    <button type="button" class="bp-pill bp-focus mx-auto mt-4">Browse catalogue</button>
  </Card>
</template>
