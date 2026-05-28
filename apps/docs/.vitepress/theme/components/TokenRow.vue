<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    /** Token name without leading dashes, e.g. `primary`, `alarm-foreground`. */
    token: string;
    /** Display kind — color shows a chip, dimension shows a size box, radius shows a corner sample. */
    kind?: 'color' | 'dimension' | 'radius';
    /** Optional human description. */
    note?: string;
  }>(),
  { kind: 'color' },
);

const value = ref<string>('');
const sample = ref<HTMLDivElement | null>(null);

function refresh() {
  if (typeof window === 'undefined') return;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${props.token}`)
    .trim();
  value.value = raw || '—';
}

onMounted(() => {
  refresh();
  // Re-read when the user toggles themes
  const observer = new MutationObserver(refresh);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  });
});

watch(() => props.token, refresh);

const swatchStyle = computed(() => {
  if (props.kind === 'color') {
    return { backgroundColor: `var(--${props.token})` };
  }
  if (props.kind === 'radius') {
    return {
      backgroundColor: 'var(--muted)',
      borderRadius: `var(--radius-${props.token})`,
    };
  }
  // dimension — width/height proportional to the value
  return {
    backgroundColor: 'var(--primary)',
    width: `var(--${props.token})`,
    height: `var(--${props.token})`,
    minWidth: '0.5rem',
    minHeight: '0.5rem',
  };
});

async function copy() {
  if (typeof navigator === 'undefined') return;
  try {
    await navigator.clipboard.writeText(`var(--${props.token})`);
  } catch {
    /* ignore */
  }
}
</script>

<template>
  <div class="token-row" @click="copy">
    <div ref="sample" class="token-swatch" :style="swatchStyle" />
    <div class="token-meta">
      <code class="token-name">--{{ token }}</code>
      <span class="token-value">{{ value }}</span>
      <span v-if="note" class="token-note">{{ note }}</span>
    </div>
  </div>
</template>

<style scoped>
.token-row {
  display: grid;
  grid-template-columns: 3rem 1fr;
  gap: 0.875rem;
  align-items: center;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--card);
  cursor: copy;
  transition: border-color 0.15s, background 0.15s;
}

.token-row:hover {
  border-color: var(--accent);
  background: var(--muted);
}

.token-swatch {
  width: 3rem;
  height: 2rem;
  border-radius: 0.25rem;
  border: 1px solid var(--border);
  display: inline-block;
}

.token-meta {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.token-name {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--foreground);
  background: transparent;
  padding: 0;
}

.token-value {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--muted-foreground);
}

.token-note {
  font-size: 0.6875rem;
  color: var(--muted-foreground);
  font-style: italic;
}
</style>
