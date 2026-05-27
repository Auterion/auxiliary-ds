<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { button } from '@auxiliary/css/recipes';

const THEMES = ['system', 'light', 'dark', 'sunlight', 'darknight'] as const;
type Theme = (typeof THEMES)[number];

const theme = ref<Theme>('system');

watchEffect(() => {
  const html = document.documentElement;
  if (theme.value === 'system') html.removeAttribute('data-theme');
  else html.setAttribute('data-theme', theme.value);
});

const STATUSES = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;
const STATUS_LABELS: Record<(typeof STATUSES)[number], string> = {
  alarm: 'Link lost',
  warning: 'Battery low',
  caution: 'Wind > 10 m/s',
  advisory: 'New waypoint',
  nominal: 'All systems go',
};

const BUTTON_INTENTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

// Sample mission ID showing ss02 / cv01 disambiguation
const MISSION_ID = 'MSN-IO1l0-2026-05-27';
</script>

<template>
  <main class="min-h-dvh bg-canvas text-primary">
    <header
      class="sticky top-0 z-10 flex items-center justify-between border-b border-default bg-canvas/80 px-8 py-4 backdrop-blur"
    >
      <div>
        <h1 class="font-display text-2xl">Auxiliary</h1>
        <p class="text-sm text-muted">System showcase · pre-1.0</p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-muted uppercase tracking-wide">Theme</span>
        <div class="flex gap-1 rounded-md border border-default bg-surface p-1">
          <button
            v-for="t in THEMES"
            :key="t"
            type="button"
            @click="theme = t"
            class="rounded px-3 py-1 text-sm capitalize transition-colors"
            :class="
              theme === t
                ? 'bg-accent text-accent-fg'
                : 'text-secondary hover:bg-hover'
            "
          >
            {{ t }}
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-6xl space-y-12 px-8 py-10">
      <!-- Status -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Status hierarchy</h2>
        <p class="mb-5 text-sm text-muted">
          Five levels, populated per theme. Same vocabulary across product, marketing,
          internal tools. Foundation for operational surfaces (Level 3–4).
        </p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div
            v-for="s in STATUSES"
            :key="s"
            :class="[
              'rounded-md border p-4',
              s === 'alarm' ? 'bg-alarm text-alarm border-alarm' : '',
              s === 'warning' ? 'bg-warning text-warning border-warning' : '',
              s === 'caution' ? 'bg-caution text-caution border-caution' : '',
              s === 'advisory' ? 'bg-advisory text-advisory border-advisory' : '',
              s === 'nominal' ? 'bg-nominal text-nominal border-nominal' : '',
            ]"
          >
            <div class="text-xs uppercase tracking-wide opacity-80">{{ s }}</div>
            <div class="mt-1 font-medium">{{ STATUS_LABELS[s] }}</div>
          </div>
        </div>
      </section>

      <!-- Buttons -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Buttons</h2>
        <p class="mb-5 text-sm text-muted">
          <code class="font-mono">tailwind-variants</code> recipe from
          <code class="font-mono">@auxiliary/css/recipes/button</code>. Intent × size.
        </p>
        <div class="space-y-4">
          <div
            v-for="size in BUTTON_SIZES"
            :key="size"
            class="flex flex-wrap items-center gap-3"
          >
            <span class="w-12 text-xs uppercase text-muted">{{ size }}</span>
            <button
              v-for="intent in BUTTON_INTENTS"
              :key="intent"
              :class="button({ intent, size })"
            >
              {{ intent }}
            </button>
          </div>
        </div>
      </section>

      <!-- Typography -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Typography</h2>
        <p class="mb-5 text-sm text-muted">
          Inter Variable with <code class="font-mono">ss02</code> +
          <code class="font-mono">cv01</code> for I/l/1 + O/0 disambiguation. Geist Mono
          + tabular for identifiers, coordinates, telemetry.
        </p>
        <div class="space-y-3 rounded-md border border-default bg-surface p-5">
          <div class="font-display">Mission Control</div>
          <p class="text-base text-secondary">
            The quick brown fox jumps over the lazy dog — 0123456789
          </p>
          <p class="font-mono tabular text-sm text-muted">{{ MISSION_ID }}</p>
          <p class="font-mono tabular text-sm">
            <span class="text-muted">LAT </span><span>47.3769° N</span>
            <span class="text-muted ml-3">LON </span><span>8.5417° E</span>
            <span class="text-muted ml-3">ALT </span><span>408 m</span>
          </p>
        </div>
      </section>

      <!-- Surface specimens -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Surfaces</h2>
        <p class="mb-5 text-sm text-muted">
          Background hierarchy: canvas → surface → elevated. Borders, accent, focus.
        </p>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-md bg-canvas border border-default p-5">
            <div class="text-xs uppercase text-muted">bg-canvas</div>
            <div class="mt-2 text-sm">Page background</div>
          </div>
          <div class="rounded-md bg-surface border border-default p-5">
            <div class="text-xs uppercase text-muted">bg-surface</div>
            <div class="mt-2 text-sm">Card / panel</div>
          </div>
          <div class="rounded-md bg-elevated border border-strong p-5 shadow-md">
            <div class="text-xs uppercase text-muted">bg-elevated</div>
            <div class="mt-2 text-sm">Popover / dropdown</div>
          </div>
        </div>
      </section>
    </div>

    <footer class="border-t border-default px-8 py-6 text-xs text-muted">
      Auxiliary · zinc-on-zinc, 4 themes, 5-level status · pre-1.0
    </footer>
  </main>
</template>
