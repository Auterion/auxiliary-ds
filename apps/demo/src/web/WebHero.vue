<script setup lang="ts">
import { Button } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';

withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    subtitle?: string;
    primary?: string;
    secondary?: string;
  }>(),
  { primary: 'Get started', secondary: 'Talk to sales' },
);
</script>

<template>
  <section class="relative overflow-hidden border-b border-border/60">
    <div class="hero-glow pointer-events-none absolute inset-0" />
    <div class="relative mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
      <p v-if="eyebrow" class="text-[13px] font-medium uppercase tracking-widest text-muted-foreground">{{ eyebrow }}</p>
      <h1 class="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight lg:text-6xl">{{ title }}</h1>
      <p v-if="subtitle" class="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">{{ subtitle }}</p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" class="gap-2">{{ primary }} <Icon name="arrow-right" size="xs" /></Button>
        <Button variant="secondary" size="lg">{{ secondary }}</Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-glow {
  background:
    radial-gradient(50% 60% at 75% 0%, color-mix(in oklab, var(--foreground) 7%, transparent), transparent 70%),
    radial-gradient(40% 50% at 10% 20%, color-mix(in oklab, var(--foreground) 5%, transparent), transparent 70%);
}
</style>
