<script setup lang="ts">
import { Icon } from '@auxiliary/icons';

const props = withDefaults(defineProps<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primary?: string;
  secondary?: string;
}>(), {});

const emit = defineEmits<{ primary: []; secondary: [] }>();
</script>

<template>
  <section class="relative overflow-hidden border-b" style="background: var(--background); border-color: var(--border)">

    <!-- Top brand accent rule -->
    <div class="absolute inset-x-0 top-0 h-px" style="background: var(--brand)" />

    <div class="relative mx-auto max-w-5xl px-8 py-24 lg:py-32 flex flex-col items-center text-center">

      <p
        v-if="eyebrow"
        class="font-mono text-[11px] uppercase tracking-[0.12em]"
        style="color: var(--brand)"
      >
        {{ eyebrow }}
      </p>

      <h1
        class="hero-h1 mt-4"
        style="color: var(--foreground)"
      >
        {{ title }}
      </h1>

      <p
        v-if="subtitle"
        class="mt-4 max-w-2xl text-[17px] leading-relaxed"
        style="color: var(--muted-foreground)"
      >
        {{ subtitle }}
      </p>

      <div v-if="primary || secondary" class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          v-if="primary"
          class="cta-btn inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85 focus-visible:outline-none"
          style="background: var(--brand)"
          @click="emit('primary')"
        >
          {{ primary }} <Icon name="arrow-right" size="xs" />
        </button>
        <button
          v-if="secondary"
          class="cta-btn-ghost inline-flex items-center gap-2 border px-6 py-2.5 text-[13px] font-medium transition-colors hover:opacity-70 focus-visible:outline-none"
          style="color: var(--foreground); border-color: var(--border); background: transparent"
          @click="emit('secondary')"
        >
          {{ secondary }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-h1 {
  font-family: 'Inter Variable', Inter, system-ui, sans-serif;
  font-variation-settings: 'opsz' 40;
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  max-width: 42rem;
}

.cta-btn:focus-visible,
.cta-btn-ghost:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
</style>
