<script setup lang="ts">
/**
 * AMC27 · the command bar.
 *
 * The incumbent splits the fleet across two places — a dropdown top-left and a
 * pair of cards floating at the bottom of the video — and gives the selected
 * vehicle a saturated orange fill, which at a glance is indistinguishable from
 * a caution. Here the fleet lives once, in the bar, as a row of slots; the
 * selected one is marked by a brand rule beneath it, and each slot carries its
 * own severity dot from the reserved ladder.
 *
 * Everything to the right of the fleet is a measured fact about the selected
 * vehicle, in mono, in a ruled cell. Cells are separated by the rule itself
 * rather than by whitespace, so the bar reads as a row of instruments.
 */
import { computed } from 'vue';
import { Icon } from '@auxiliary/icons';
import { fleet, t, type Vehicle } from './telemetry';

const props = defineProps<{ selected: string }>();
const emit = defineEmits<{ (e: 'select', id: string): void }>();

const active = computed<Vehicle>(() => fleet.find((v) => v.id === props.selected) ?? fleet[0]!);

/** Battery drives the ladder, not a decorative hue ramp. */
const battLevel = computed(() =>
  active.value.battery < 25 ? 'alarm' : active.value.battery < 40 ? 'warning' : 'nominal',
);
const linkLevel = computed(() => (t.snr < 10 ? 'caution' : 'nominal'));
</script>

<template>
  <header class="a27-bar">
    <!-- Identity. A mark and the mission, not a logo lockup — this is chrome. -->
    <div class="a27-cell" style="gap: 10px">
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" style="color: var(--brand)">
        <path d="M3 6 L12 20 L21 6 L12 11 Z" fill="currentColor" />
      </svg>
      <span class="leading-tight">
        <span class="a27-name block">Coastline Survey</span>
        <span class="a27-label">MSN 27-114 · ELAPSED {{ t.elapsed }}</span>
      </span>
    </div>

    <!-- The fleet, once. -->
    <div class="flex items-stretch">
      <button
        v-for="v in fleet"
        :key="v.id"
        type="button"
        class="a27-veh"
        :data-active="v.id === selected"
        :aria-pressed="v.id === selected"
        @click="emit('select', v.id)"
      >
        <span :class="`a27-ink-${v.health}`" aria-hidden="true"><span class="a27-dot block" /></span>
        <span class="text-left leading-tight">
          <span class="a27-name block" style="color: inherit">{{ v.callsign }}</span>
          <span class="a27-label">{{ v.armed ? 'ARMED' : 'SAFE' }} · {{ v.battery }}%</span>
        </span>
      </button>
    </div>

    <!-- Flight mode + arm state. The arm plate is one of two heavy marks on the
         whole surface; the other is the engage authority in the payload rail. -->
    <div class="a27-cell">
      <button type="button" class="a27-btn a27-btn-wide">
        <span class="a27-label" style="color: var(--a27-ink)">{{ active.mode }}</span>
        <Icon name="chevron-down" size="xs" style="color: var(--a27-ink-3)" />
      </button>
      <span class="a27-plate" :class="active.armed ? 'a27-plate-armed' : 'a27-plate-safe'">
        <Icon :name="active.armed ? 'lock-open' : 'lock'" size="xs" />
        <span class="a27-label" style="color: currentcolor">{{ active.armed ? 'ARMED' : 'SAFE' }}</span>
      </span>
    </div>

    <div class="a27-cell a27-cell-grow" />

    <!-- Measured facts, hard right, each in its own cell so the eye can find
         the same number in the same place every time. -->
    <div class="a27-cell">
      <span class="a27-label">LINK</span>
      <span :class="`a27-ink-${linkLevel}`"><span class="a27-dot a27-pulse" /></span>
      <span class="leading-tight">
        <span class="a27-micro block">RSSI {{ t.rssi }}</span>
        <span class="a27-micro block">SNR&nbsp;&nbsp;{{ t.snr }}</span>
      </span>
    </div>

    <div class="a27-cell">
      <span class="a27-label">GNSS</span>
      <span class="leading-tight">
        <span class="a27-micro block">{{ t.fix }} · {{ t.sats }} SV</span>
        <span class="a27-micro block">H {{ t.hacc }} / V {{ t.vacc }} m</span>
      </span>
    </div>

    <div class="a27-cell">
      <span class="a27-label">PWR</span>
      <span class="leading-tight">
        <span class="a27-micro block">{{ t.volts }} V · {{ t.amps }} A</span>
        <span class="a27-micro block">{{ t.watts }} W</span>
      </span>
    </div>

    <!-- Battery: the ladder, at full strength, never dimmed to fit a palette. -->
    <div class="a27-cell" style="gap: 9px">
      <span class="a27-meas" :class="`a27-ink-${battLevel}`">{{ active.battery }}%</span>
      <span
        class="relative block h-3.5 w-8 overflow-hidden"
        :style="{ border: '1px solid var(--a27-line)', borderRadius: '2px' }"
        role="img"
        :aria-label="`Battery ${active.battery} percent`"
      >
        <span
          class="absolute inset-y-px left-px block"
          :style="{ width: `calc(${active.battery}% - 2px)`, background: `var(--${battLevel})` }"
        />
      </span>
    </div>

    <div class="a27-cell">
      <span class="a27-meas">{{ t.clock }}</span>
    </div>
  </header>
</template>
