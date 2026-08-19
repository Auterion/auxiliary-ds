<script setup lang="ts">
/* Team — the roster module: member rows with avatar, role and site, plus an
 * invite CTA. Pending invitations are marked with a mono label, not a hue —
 * "invited" is an account state, not an operational severity, and the status
 * ladder is the only place colour is allowed to mean something. */
import { Card, Avatar, AvatarFallback } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { TEAM } from './data';
</script>

<template>
  <Card class="dk-card p-5">
    <div class="dk-section">
      <h2 class="dk-label">Members</h2>
      <span class="dk-bracket">
        <span>{{ TEAM.length }} people</span>
        <span aria-hidden="true">·</span>
        <span>4 teams</span>
      </span>
    </div>

    <div class="flex justify-end py-4">
      <button type="button" class="dk-cta-solid">
        <Icon name="plus" size="sm" />
        Invite
      </button>
    </div>

    <ul class="flex flex-col gap-0.5">
      <li v-for="m in TEAM" :key="m.id" class="dk-row">
        <Avatar size="sm" class="shrink-0">
          <AvatarFallback class="bp-avatar text-[12px]">{{ m.initials }}</AvatarFallback>
        </Avatar>
        <div class="min-w-0">
          <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span class="dk-value truncate">{{ m.name }}</span>
            <span v-if="m.status === 'invited'" class="dk-label">Invited</span>
          </div>
          <div class="dk-body truncate">{{ m.role }} · {{ m.team }}</div>
        </div>
        <!-- site + action in ONE grid slot, flush right, so both edges hold -->
        <div class="flex shrink-0 items-center gap-4">
          <span class="dk-label hidden sm:block">{{ m.site }}</span>
          <button type="button" class="bp-icon-btn" :aria-label="`Manage ${m.name}`">
            <Icon name="ellipsis" size="sm" />
          </button>
        </div>
      </li>
    </ul>
  </Card>
</template>
