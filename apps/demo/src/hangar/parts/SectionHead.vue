<script setup lang="ts">
/* Eyebrow · headline · lede, in the middle half. The one opening move every
 * section makes, so the page has a spine a reader can find without looking. */
import Eyebrow from './Eyebrow.vue';

defineProps<{ eyebrow: string; title: string; lede?: string }>();
</script>

<template>
  <div class="hg-col">
    <Eyebrow :label="eyebrow" />
    <h2 class="hg-h1" style="margin-block: 22px 0">{{ title }}</h2>
    <p v-if="lede" class="hg-lede" style="margin-block-start: 22px">{{ lede }}</p>
    <slot />
  </div>
</template>
