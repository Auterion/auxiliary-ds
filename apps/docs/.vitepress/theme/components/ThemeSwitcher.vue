<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';

const THEMES = ['light', 'dark', 'sunlight', 'darknight'] as const;
type Theme = (typeof THEMES)[number];

// Themes that should use a dark surface treatment for the docs chrome.
// VitePress's internal styles still key off the `.dark` class for things
// like icon button hovers and code block accents.
const DARK_LIKE: ReadonlySet<Theme> = new Set(['dark', 'darknight']);

const theme = ref<Theme>('light');
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
  const stored =
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('auxiliary-theme') as Theme | null)
      : null;
  if (stored && THEMES.includes(stored)) theme.value = stored;
});

watchEffect(() => {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;

  html.setAttribute('data-theme', theme.value);

  if (DARK_LIKE.has(theme.value)) html.classList.add('dark');
  else html.classList.remove('dark');

  if (typeof localStorage !== 'undefined' && mounted.value) {
    localStorage.setItem('auxiliary-theme', theme.value);
  }
});
</script>

<template>
  <div class="aux-theme-switcher" role="group" aria-label="Theme">
    <button
      v-for="t in THEMES"
      :key="t"
      type="button"
      :aria-pressed="theme === t"
      :class="{ active: theme === t }"
      :title="`Switch to ${t} theme`"
      @click="theme = t"
    >
      {{ t }}
    </button>
  </div>
</template>

<style scoped>
.aux-theme-switcher {
  display: inline-flex;
  align-items: stretch;
  margin: 0 0.75rem 0 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.375rem;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  height: 1.75rem;
}

.aux-theme-switcher button {
  padding: 0 0.5rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-right: 1px solid var(--vp-c-border);
  cursor: pointer;
  transition: color 0.12s, background 0.12s;
  white-space: nowrap;
}

.aux-theme-switcher button:last-child {
  border-right: none;
}

.aux-theme-switcher button:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.aux-theme-switcher button.active {
  color: var(--primary-foreground);
  background: var(--primary);
}

@media (max-width: 960px) {
  .aux-theme-switcher button {
    /* On narrower viewports show only the first letter so the group fits */
    padding: 0 0.375rem;
    font-size: 0.625rem;
  }
}

@media (max-width: 640px) {
  .aux-theme-switcher {
    display: none;
  }
}
</style>
