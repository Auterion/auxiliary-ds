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
  <section class="hero-section relative overflow-hidden border-b" style="background: var(--background); border-color: var(--border)">

    <!-- Dot-grid background -->
    <div class="hero-grid absolute inset-0 pointer-events-none" />

    <!-- Top brand accent rule -->
    <div class="hero-rule absolute inset-x-0 top-0 h-px" style="background: var(--brand)" />

    <div class="relative mx-auto max-w-5xl px-8 py-28 lg:py-40 flex flex-col items-center text-center">

      <p
        v-if="eyebrow"
        class="hero-eyebrow font-mono text-[11px] uppercase tracking-[0.14em]"
        style="color: var(--brand)"
      >
        {{ eyebrow }}
      </p>

      <h1
        class="hero-h1 mt-5"
        style="color: var(--foreground)"
      >
        {{ title }}
      </h1>

      <p
        v-if="subtitle"
        class="mt-5 max-w-2xl text-[17px] leading-relaxed"
        style="color: var(--muted-foreground)"
      >
        {{ subtitle }}
      </p>

      <div v-if="primary || secondary" class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          v-if="primary"
          class="cta-btn inline-flex items-center gap-2 px-7 py-3 text-[13px] font-medium text-white transition-all hover:opacity-90 focus-visible:outline-none"
          style="background: var(--brand)"
          @click="emit('primary')"
        >
          {{ primary }} <Icon name="arrow-right" size="xs" />
        </button>
        <button
          v-if="secondary"
          class="cta-btn-ghost inline-flex items-center gap-2 border px-7 py-3 text-[13px] font-medium transition-all hover:opacity-70 focus-visible:outline-none"
          style="color: var(--foreground); border-color: var(--border); background: transparent"
          @click="emit('secondary')"
        >
          {{ secondary }}
        </button>
      </div>
    </div>

    <!-- Telemetry strip -->
    <div class="absolute inset-x-0 bottom-0 border-t flex items-center gap-6 px-8 py-2 overflow-hidden" style="border-color: var(--border)">
      <span class="flex items-center gap-1.5 shrink-0">
        <span class="h-1.5 w-1.5 rounded-full animate-pulse" style="background: var(--nominal)" />
        <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60">Live</span>
      </span>
      <div class="telemetry-ticker font-mono text-[10px] tracking-[0.08em] text-muted-foreground/40 whitespace-nowrap overflow-hidden flex-1">
        <span class="telemetry-items inline-block">
          UAV-001 &nbsp;·&nbsp; ALT 124m &nbsp;·&nbsp; BATT 86% &nbsp;·&nbsp; RSSI −82 dBm &nbsp;&nbsp;
          UAV-002 &nbsp;·&nbsp; ALT 88m &nbsp;·&nbsp; BATT 71% &nbsp;·&nbsp; RSSI −76 dBm &nbsp;&nbsp;
          UAV-003 &nbsp;·&nbsp; ALT 210m &nbsp;·&nbsp; BATT 94% &nbsp;·&nbsp; RSSI −91 dBm &nbsp;&nbsp;
          UGV-001 &nbsp;·&nbsp; SPD 3.2m/s &nbsp;·&nbsp; BATT 60% &nbsp;·&nbsp; GPS LOCK &nbsp;&nbsp;
          UAV-004 &nbsp;·&nbsp; MISSION ACTIVE &nbsp;·&nbsp; WP 14/22 &nbsp;·&nbsp; ETA 4m32s &nbsp;&nbsp;
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 60vh;
}

.hero-grid {
  background-image: radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 70% 80% at 50% 50%, black 30%, transparent 100%);
}

.hero-rule {
  animation: shimmer 3s ease-in-out infinite;
  background: linear-gradient(90deg, transparent 0%, var(--brand) 40%, var(--brand) 60%, transparent 100%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.hero-eyebrow {
  letter-spacing: 0.14em;
}

.hero-h1 {
  font-family: 'Inter Variable', Inter, system-ui, sans-serif;
  font-optical-sizing: auto;
  font-variation-settings: 'opsz' 48;
  font-size: clamp(2.25rem, 5.5vw, 4rem);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.03em;
  max-width: 44rem;
}

.telemetry-items {
  animation: marquee 28s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.cta-btn {
  border-radius: 3px;
}

.cta-btn-ghost {
  border-radius: 3px;
}

.cta-btn:focus-visible,
.cta-btn-ghost:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
</style>
