<script setup lang="ts">
/* Team — the roster module: 32px member rows with avatar, role and site, plus an
 * invite CTA. Pending invitations are marked with a neutral chip, not a hue —
 * "invited" is an account state, not an operational severity. */
import { Card, Avatar, AvatarFallback } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { TEAM } from './data';
</script>

<template>
  <Card class="bp-card p-5">
    <div class="flex items-center justify-between pb-3">
      <div>
        <h2 class="bp-ink-1 text-[14px] font-semibold">Members</h2>
        <p class="bp-ink-2 pt-0.5 text-[13px]">{{ TEAM.length }} people across 4 teams</p>
      </div>
      <button type="button" class="bp-pill bp-focus">
        <Icon name="plus" size="sm" />
        Invite
      </button>
    </div>

    <ul class="flex flex-col gap-0.5">
      <li v-for="m in TEAM" :key="m.id" class="bp-row">
        <Avatar size="sm">
          <AvatarFallback class="bp-avatar text-[12px]">{{ m.initials }}</AvatarFallback>
        </Avatar>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="bp-ink-1 truncate text-[14px] font-medium">{{ m.name }}</span>
            <span v-if="m.status === 'invited'" class="bp-chip">Invited</span>
          </div>
          <div class="bp-ink-2 truncate text-[13px] leading-4">{{ m.role }} · {{ m.team }}</div>
        </div>
        <span class="bp-ink-3 hidden shrink-0 text-[12px] sm:block">{{ m.site }}</span>
        <button type="button" class="bp-cta bp-cta-sm bp-icon-only bp-focus" :aria-label="`Manage ${m.name}`">
          <Icon name="ellipsis" size="sm" />
        </button>
      </li>
    </ul>
  </Card>
</template>
