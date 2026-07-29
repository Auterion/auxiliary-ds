<script setup lang="ts">
/* Fleet — a dense but calm vehicle table over the Suite showcase's shared fleet.
 * Status is the one place color is allowed: a 6px dot on the five-level ladder,
 * always paired with its text label so it never reads by color alone. */
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
  <Card class="bp-card p-5">
    <!-- toolbar -->
    <div class="flex items-center justify-between gap-3 pb-4">
      <div>
        <h2 class="bp-ink-1 text-[14px] font-semibold">All vehicles</h2>
        <p class="bp-ink-2 pt-0.5 text-[13px]">{{ filtered.length }} of {{ VEHICLES.length }} in the fleet</p>
      </div>
      <div class="relative w-[240px]">
        <Icon
          class="bp-ink-3 pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
          name="magnifying-glass"
          size="sm"
        />
        <input v-model="query" class="bp-search" type="search" placeholder="Search fleet" aria-label="Search fleet" >
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="bp-table">
        <thead>
          <tr>
            <th scope="col">Callsign</th>
            <th scope="col">Model</th>
            <th scope="col">Status</th>
            <th scope="col">Battery</th>
            <th scope="col">Site</th>
            <th scope="col">Operator</th>
            <th scope="col" class="text-right">Last seen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in filtered" :key="v.id">
            <td>
              <span class="bp-ink-1 text-[13px] font-medium">{{ v.callsign }}</span>
            </td>
            <td class="whitespace-nowrap">{{ v.model }}</td>
            <td>
              <span class="flex items-center gap-2 whitespace-nowrap">
                <span class="bp-dot" :class="`bp-dot-${v.status.level}`" />
                {{ v.status.label }}
              </span>
            </td>
            <td>
              <span class="flex items-center gap-2">
                <Sparkline
                  :values="v.metrics.battery"
                  :width="48"
                  :height="16"
                  color="var(--bp-ink-3)"
                />
                <span class="bp-ink-1 tabular text-[13px]">{{ v.battery }}%</span>
              </span>
            </td>
            <td class="whitespace-nowrap">{{ v.site.name }}</td>
            <td>
              <span class="flex items-center gap-2 whitespace-nowrap">
                <Avatar size="sm" class="!h-5 !w-5">
                  <AvatarFallback class="bp-avatar !text-[10px]">{{ v.operator.initials }}</AvatarFallback>
                </Avatar>
                {{ v.operator.name }}
              </span>
            </td>
            <td class="bp-ink-3 whitespace-nowrap text-right">{{ v.lastSeen }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>
