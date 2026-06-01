<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { resolveLogo, type Kind, type Tone } from './manifest';

const props = withDefaults(
  defineProps<{
    /** Logo id from the manifest: 'auterion' | 'mission-control' | 'suite' | 'os'. */
    id: string;
    /** Which form of the mark. */
    kind?: Kind;
    /**
     * Color treatment. `auto` (default) renders the single-color master via
     * `currentColor`, so it inherits the surface's themed text color and stays
     * legible on any theme. `color` uses the dedicated full-color master.
     */
    tone?: Tone | 'auto';
    /** Override the accessible name (defaults to "<Name> logo"). */
    title?: string;
    /** Mark as decorative — removes it from the accessibility tree. */
    decorative?: boolean;
    class?: HTMLAttributes['class'];
  }>(),
  { kind: 'lockup-horizontal', tone: 'auto', decorative: false },
);

// `auto` resolves against the single-color (currentColor) master so CSS color drives legibility.
const artTone = computed<Tone>(() => (props.tone === 'auto' ? 'mono' : props.tone));

const resolved = computed(() => resolveLogo({ id: props.id, kind: props.kind, tone: artTone.value }));

const label = computed(() => props.title ?? `${resolved.value?.entry.name ?? props.id} logo`);
const a11y = computed(() =>
  props.decorative
    ? { 'aria-hidden': 'true' as const }
    : { role: 'img', 'aria-label': label.value },
);
</script>

<template>
  <!-- eslint-disable vue/no-v-html -- trusted, build-generated brand SVGs (registry.generated.ts); never user input -->
  <span
    v-if="resolved && resolved.status === 'available'"
    v-bind="a11y"
    class="aux-logo inline-flex items-center"
    :data-tone="tone"
    :style="{ minWidth: resolved.minSize + 'px' }"
    :class="props.class"
    v-html="resolved.svg"
  />
  <!-- eslint-enable vue/no-v-html -->
  <!-- Pending: a clearly-labelled placeholder so the slot is visible in dev/docs and nothing fake ships. -->
  <span
    v-else
    v-bind="a11y"
    class="aux-logo aux-logo--pending inline-flex items-center justify-center rounded border border-dashed px-2 py-1 text-[10px] uppercase tracking-wide opacity-60"
    :style="{ minHeight: (resolved?.minSize ?? 16) + 'px' }"
    :class="props.class"
  >
    {{ resolved ? `${resolved.entry.name} · ${kind} pending` : `unknown logo: ${id}` }}
  </span>
</template>
