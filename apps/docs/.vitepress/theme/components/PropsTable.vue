<script setup lang="ts">
import { computed } from 'vue';
import data from '../../data/props.generated.json';

/**
 * Renders a component's props (and events) from generated metadata — see
 * apps/docs/scripts/gen-props.mjs. Types/defaults/required/JSDoc are read from
 * @auxiliary/vue's source by vue-component-meta, so this never drifts from the
 * code. Use inline in any .md: `<PropsTable name="Button" />`.
 */
const props = defineProps<{ name: string }>();

interface PropRow {
  name: string;
  type: string;
  default: string | null;
  required: boolean;
  description: string;
}
interface EventRow {
  name: string;
  type: string;
  description: string;
}
type Meta = Record<string, { props: PropRow[]; events: EventRow[]; slots: string[] }>;

const entry = computed(() => (data as Meta)[props.name]);
const rows = computed(() => entry.value?.props ?? []);
const events = computed(() => entry.value?.events ?? []);
const fmtDefault = (d: string | null) => (d == null || d === '' ? '—' : d);
</script>

<template>
  <div v-if="!entry" class="props-missing">
    No generated metadata for <code>{{ name }}</code> — run <code>pnpm gen:props</code>.
  </div>
  <template v-else>
    <table class="props-table">
      <thead>
        <tr><th>Prop</th><th>Type</th><th>Default</th><th>Notes</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td>
            <code class="prop-name">{{ row.name }}</code>
            <span v-if="row.required" class="prop-required" title="required">required</span>
          </td>
          <td><code class="prop-type">{{ row.type }}</code></td>
          <td><code class="prop-default">{{ fmtDefault(row.default) }}</code></td>
          <td class="prop-notes">{{ row.description }}</td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="4" class="props-empty">No component-specific props — forwards native attributes.</td>
        </tr>
      </tbody>
    </table>

    <template v-if="events.length">
      <p class="props-events-title">Events</p>
      <table class="props-table">
        <thead>
          <tr><th>Event</th><th>Payload</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr v-for="evt in events" :key="evt.name">
            <td><code class="prop-name">{{ evt.name }}</code></td>
            <td><code class="prop-type">{{ evt.type }}</code></td>
            <td class="prop-notes">{{ evt.description }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </template>
</template>

<style scoped>
.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  margin: 0.5rem 0 1rem;
  display: table; /* override VitePress's default striped block table */
}
.props-table thead th {
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  border-bottom: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
}
.props-table tbody td {
  border-bottom: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  vertical-align: top;
}
.props-table tbody tr:hover {
  background: var(--muted);
}
.prop-name {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--foreground);
  background: transparent;
  padding: 0;
}
.prop-type {
  font-family: var(--font-mono);
  font-size: 0.7188rem;
  color: var(--primary);
  background: transparent;
  padding: 0;
  white-space: pre-wrap;
}
.prop-default {
  font-family: var(--font-mono);
  font-size: 0.7188rem;
  color: var(--muted-foreground);
  background: transparent;
  padding: 0;
}
.prop-required {
  display: inline-block;
  margin-left: 0.4rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--alarm);
}
.prop-notes {
  color: var(--foreground);
}
.props-empty,
.props-missing {
  color: var(--muted-foreground);
  font-style: italic;
  font-size: 0.8125rem;
}
.props-events-title {
  font-weight: 600;
  margin: 0.5rem 0 0;
}
</style>
