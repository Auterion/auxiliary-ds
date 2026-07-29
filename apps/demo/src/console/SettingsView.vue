<script setup lang="ts">
/* Settings — preferences (Switch rows: a switch is a *setting*, applied
 * immediately) plus a read-only workspace summary. Deliberately distinct from
 * the Overview checklist, which uses Checkbox because those are tasks. */
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
    <Card class="bp-card p-5">
      <h2 class="bp-ink-1 pb-1 text-[14px] font-semibold">Preferences</h2>
      <ul class="bp-divide flex flex-col">
        <li v-for="pref in prefs" :key="pref.key" class="flex items-center gap-3 py-3">
          <div class="min-w-0 flex-1">
            <div class="bp-ink-1 text-[14px] font-medium">{{ pref.label }}</div>
            <div class="bp-ink-2 text-[13px] leading-4">{{ pref.help }}</div>
          </div>
          <Switch v-model="pref.on" :aria-label="pref.label" />
        </li>
      </ul>
    </Card>

    <Card class="bp-card p-5">
      <h2 class="bp-ink-1 pb-1 text-[14px] font-semibold">Workspace</h2>
      <dl class="bp-divide flex flex-col">
        <div v-for="row in workspace" :key="row.label" class="flex items-center justify-between gap-3 py-3">
          <dt class="bp-ink-2 text-[13px]">{{ row.label }}</dt>
          <dd class="bp-ink-1 text-[13px] font-medium">{{ row.value }}</dd>
        </div>
      </dl>
    </Card>
  </div>
</template>
