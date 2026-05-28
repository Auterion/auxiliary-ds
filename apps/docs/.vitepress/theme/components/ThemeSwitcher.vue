<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue';

const THEMES = ['system', 'light', 'dark', 'sunlight', 'darknight'] as const;
type Theme = (typeof THEMES)[number];

const theme = ref<Theme>('system');

onMounted(() => {
  const stored = (typeof localStorage !== 'undefined' && localStorage.getItem('auxiliary-theme')) as Theme | null;
  if (stored && THEMES.includes(stored)) theme.value = stored;
});

watchEffect(() => {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  if (theme.value === 'system') html.removeAttribute('data-theme');
  else html.setAttribute('data-theme', theme.value);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('auxiliary-theme', theme.value);
  }
});
</script>

<template>
  <div class="aux-theme-switcher">
    <button
      v-for="t in THEMES"
      :key="t"
      type="button"
      :aria-pressed="theme === t"
      :class="{ active: theme === t }"
      @click="theme = t"
    >
      {{ t }}
    </button>
  </div>
</template>

<style scoped>
.aux-theme-switcher {
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.125rem;
  margin-left: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--card);
}

.aux-theme-switcher button {
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted-foreground);
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-family: var(--font-mono);
}

.aux-theme-switcher button:hover {
  color: var(--foreground);
  background: var(--muted);
}

.aux-theme-switcher button.active {
  color: var(--primary-foreground);
  background: var(--primary);
}

@media (max-width: 768px) {
  .aux-theme-switcher {
    display: none;
  }
}
</style>
