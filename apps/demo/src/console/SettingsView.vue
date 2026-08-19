<script setup lang="ts">
/* Settings — preferences (Switch rows: a switch is a *setting*, applied
 * immediately) plus a read-only workspace summary.
 *
 * The workspace block is a ledger read: mono field label left, value hard right,
 * every value ending on the same x — the same alignment rule the fleet table
 * runs, held across a different block on the same page. */
import { reactive } from 'vue';
import { Card, Switch } from '@auxiliary/vue';
import { PREFS } from './data';

const prefs = reactive(PREFS.map((p) => ({ ...p })));

const workspace = [
  { label: 'Workspace', value: 'Auterion Field Ops' },
  { label: 'Plan', value: 'Enterprise' },
  { label: 'Region', value: 'EU-CENTRAL-1 · Munich' },
  { label: 'Fleet firmware baseline', value: 'v4.2.1' },
];
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card class="dk-card p-5">
      <div class="dk-section">
        <h2 class="dk-label">Preferences</h2>
        <span class="dk-bracket"><span>{{ prefs.length }} settings</span></span>
      </div>
      <ul class="dk-divide flex flex-col">
        <li v-for="pref in prefs" :key="pref.key" class="flex items-center gap-6 py-4">
          <div class="min-w-0 flex-1">
            <div class="dk-value">{{ pref.label }}</div>
            <div class="dk-body">{{ pref.help }}</div>
          </div>
          <Switch v-model="pref.on" :aria-label="pref.label" />
        </li>
      </ul>
    </Card>

    <Card class="dk-card p-5">
      <div class="dk-section">
        <h2 class="dk-label">Workspace</h2>
      </div>
      <dl class="dk-divide flex flex-col">
        <div
          v-for="row in workspace"
          :key="row.label"
          class="flex items-baseline justify-between gap-6 py-3.5"
        >
          <dt class="dk-label">{{ row.label }}</dt>
          <dd class="dk-value dk-num text-right">{{ row.value }}</dd>
        </div>
      </dl>
    </Card>
  </div>
</template>
