<script setup lang="ts">
/* Fleet — the ledger table. 07b's strictest device: a real <table> with
 * `table-layout: fixed`, pointer-labels (`↳ CALLSIGN`) on the field headers —
 * their one sanctioned use — and every measured column running hard right on
 * tabular numerals, so the figures line up down the whole page.
 *
 * Status is the one place colour is allowed: a 6px dot on the five-level ladder,
 * always paired with its text label so it never reads by colour alone. */
import { computed, ref } from 'vue';
import { Card, Avatar, AvatarFallback } from '@auxiliary/vue';
import { Sparkline } from '@auxiliary/viz';
import { Icon } from '@auxiliary/icons';
import { VEHICLES } from './data';

const query = ref('');
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return VEHICLES;
  return VEHICLES.filter((v) =>
    [v.callsign, v.model, v.site.name, v.operator.name, v.status.label].some((f) =>
      f.toLowerCase().includes(q),
    ),
  );
});
</script>

<template>
  <Card class="dk-card p-5">
    <!-- toolbar -->
    <div class="dk-section">
      <h2 class="dk-label">All vehicles</h2>
      <span class="dk-bracket">
        <span>{{ filtered.length }} of {{ VEHICLES.length }} listed</span>
      </span>
    </div>

    <div class="flex justify-end py-4">
      <div class="relative w-[240px]">
        <Icon
          class="bp-glyph pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
          name="magnifying-glass"
          size="sm"
        />
        <input v-model="query" class="bp-search" type="search" placeholder="Search fleet" aria-label="Search fleet" >
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="dk-table min-w-[860px]">
        <!-- fixed layout needs the proportions declared once, here, rather than
             letting content decide them differently on every render -->
        <colgroup>
          <col style="width: 13%" >
          <col style="width: 16%" >
          <col style="width: 15%" >
          <col style="width: 13%" >
          <col style="width: 13%" >
          <col style="width: 18%" >
          <col style="width: 12%" >
        </colgroup>
        <thead>
          <tr>
            <th scope="col"><span class="dk-pointer">Callsign</span></th>
            <th scope="col"><span class="dk-pointer">Model</span></th>
            <th scope="col"><span class="dk-pointer">Status</span></th>
            <th scope="col" data-align="end"><span class="dk-pointer">Battery</span></th>
            <th scope="col"><span class="dk-pointer">Site</span></th>
            <th scope="col"><span class="dk-pointer">Operator</span></th>
            <th scope="col" data-align="end"><span class="dk-pointer">Last seen</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in filtered" :key="v.id">
            <td data-lead="true">{{ v.callsign }}</td>
            <td class="truncate">{{ v.model }}</td>
            <td>
              <span class="flex items-center gap-2 whitespace-nowrap">
                <span class="dk-dot" :class="`dk-dot-${v.status.level}`" />
                {{ v.status.label }}
              </span>
            </td>
            <td data-align="end">
              <span class="flex items-center justify-end gap-2">
                <Sparkline
                  :values="v.metrics.battery"
                  :width="44"
                  :height="14"
                  color="var(--dk-fg-3)"
                />
                <span class="dk-num">{{ v.battery }}%</span>
              </span>
            </td>
            <td class="truncate">{{ v.site.name }}</td>
            <td>
              <span class="flex items-center gap-2 truncate whitespace-nowrap">
                <Avatar size="sm" class="!h-5 !w-5 shrink-0">
                  <AvatarFallback class="bp-avatar !text-[10px]">{{ v.operator.initials }}</AvatarFallback>
                </Avatar>
                {{ v.operator.name }}
              </span>
            </td>
            <td data-align="end" class="whitespace-nowrap">{{ v.lastSeen }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>
