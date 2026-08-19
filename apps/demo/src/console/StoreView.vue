<script setup lang="ts">
/* Store — the design lists this in the rail but doesn't specify the page, so it
 * ships as an honest empty state rather than invented content.
 *
 * This is where the surface spends its SECOND and last signal plate: an unbuilt
 * chapter is exactly the divider case the device is permitted for. The shell's
 * brand mark is the first. Two blue surfaces on this view, one on every other —
 * at budget, never over it. */
import { Icon } from '@auxiliary/icons';
</script>

<template>
  <section class="dk-plate-signal px-6 py-16 text-center">
    <p class="dk-label">Chapter · not yet written</p>
    <h2 class="dk-h1 pt-3">Store</h2>
    <p class="dk-body mx-auto max-w-md pt-3">
      Payloads, spares and software add-ons for your fleet. This surface isn't part
      of the home-page design yet.
    </p>
    <!-- inline-flex, centred by the section's text-align -->
    <button type="button" class="dk-cta-solid mt-8">
      <Icon name="copy" size="sm" />
      Browse catalogue
    </button>
  </section>
</template>
