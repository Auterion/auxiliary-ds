<script setup lang="ts">
/**
 * The lock box the operator placed, drawn on the feed.
 *
 * Pure report — `pointer-events: none`, so it can never eat a click meant for
 * the frame beneath it. It carries the tracker's own normalised coordinates
 * because "the box is over the truck" and "the tracker thinks it is over the
 * truck" are different claims, and only the second one can be checked.
 */
defineProps<{ x: number; y: number; readout: string }>();
</script>

<template>
  <div class="sk-target" :style="{ left: `${(x * 100).toFixed(1)}%`, top: `${(y * 100).toFixed(1)}%` }">
    <div class="sk-target-box" />
    <div class="sk-target-pip" />
    <div class="sk-target-tag">
      <span class="sk-osd-badge" style="background: var(--sk-amc-signal)">TRK</span>
      <span style="color: rgb(255 255 255 / 0.85); background: rgb(0 0 0 / 0.7); padding: 1px 5px">
        {{ readout }}
      </span>
    </div>
  </div>
</template>
