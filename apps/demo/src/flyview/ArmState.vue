<script setup lang="ts">
/**
 * The arm plate — a READOUT, never the control.
 *
 * This is the first decision the request forces, and the request does not
 * settle it: "ARM: RED | DISARM: GREEN" can mean the state is red when armed,
 * or it can mean the button that arms is red. Build the first and an operator
 * who reads the second presses the red thing to make the danger stop, and arms
 * the aircraft. That is not a hypothetical failure mode; it is the reason
 * industrial practice separates an indicator from an actuator by FORM before it
 * separates them by colour.
 *
 * So: this object is a plate. It has no hover, no press, no focus ring and no
 * pointer cursor, and arming happens elsewhere, behind a guard. The follow-up
 * line in the thread — "when the UAV is ARMED / in flight, use Deep Red" —
 * confirms the state reading was the one intended.
 *
 * It reports through four channels, in descending order of how well each one
 * survives a bad screen and a colour-blind operator: the WORD, the FILL
 * WEIGHT, the HATCH, and only then the HUE. See `_flyview.css`.
 */
import { computed } from 'vue';
import { Icon } from '@auxiliary/icons';
import { ARM, type Arm, type Scheme } from './model';

const props = withDefaults(
  defineProps<{
    arm: Arm;
    scheme: Scheme;
    /** Compact renders the plate without its second line, for the specimen row. */
    compact?: boolean;
  }>(),
  { compact: false },
);

const spec = computed(() => ARM[props.arm]);

/**
 * The hatch marks one state and one only: rotors live, aircraft on the ground,
 * a person able to walk into the disc. In the requested scheme it is withheld
 * entirely, so the two schemes differ in exactly the way the meeting is about.
 */
const hatched = computed(() => props.scheme === 'proposed' && props.arm === 'ground');

/** The whole state as one sentence, so a screen reader gets what the eye gets. */
const spoken = computed(() => `${spec.value.word}. ${spec.value.gloss}.`);
</script>

<template>
  <div
    class="fv-arm"
    :class="hatched ? 'fv-arm-hatch' : undefined"
    :data-scheme="scheme"
    :data-arm="arm"
    role="status"
  >
    <Icon :name="spec.open ? 'lock-open' : 'lock'" size="sm" />

    <span class="leading-tight" style="position: relative">
      <span class="fv-arm-word block">{{ spec.word }}</span>
      <span v-if="!compact" class="fv-arm-gloss mt-0.5 block">{{ spec.gloss }}</span>
    </span>

    <!-- The airborne mark. A third channel for the third state, so `ground` and
         `air` are not separated by hue alone in either scheme. -->
    <svg
      v-if="arm === 'air'"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      aria-hidden="true"
      style="position: relative"
    >
      <path d="M12 4 v13" />
      <path d="M4 20 q8 -5 16 0" />
    </svg>

    <span class="sr-only">{{ spoken }}</span>
  </div>
</template>
