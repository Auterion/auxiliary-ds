<script setup lang="ts">
/**
 * AMC27 · tablet — the full-screen overlay.
 *
 * A shooter takes the whole screen for the scoreboard and the loadout, then
 * gives it straight back. It does not dock them into the HUD, because the HUD
 * is for the two seconds you are in, and these are for the ten seconds you
 * step out of it.
 *
 * That is what the fleet, the alert log and the plan get here — and engage
 * authority with them. Arming a payload is a two-handed, deliberate,
 * step-out-of-the-fight act; putting the switch on the HUD, within reach of
 * the thumb that flies the gimbal, would be the whole point missed.
 */
import { computed } from 'vue';
import { StatusBadge, Switch } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { fleet, alerts, plan } from './telemetry';

const props = defineProps<{
  panel: 'none' | 'fleet' | 'alerts' | 'plan';
  selected: string;
  authority: boolean;
}>();
const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'authority', v: boolean): void;
  (e: 'close'): void;
}>();

const TITLE = { fleet: 'Fleet', alerts: 'Alert log', plan: 'Mission plan' } as const;
const latched = computed(() => alerts.filter((a) => a.latched).length);
const current = 7;
</script>

<template>
  <!-- `inert`, not `aria-hidden`. The closed state hides with opacity + scale +
       pointer-events, none of which removes anything from the TAB ORDER — and
       `aria-hidden` over focusable content is worse than nothing: it hides the
       controls from a screen reader while leaving them keyboard-reachable, which
       is an explicit ARIA violation. `inert` is the one attribute that removes
       both, and it is the platform doing it rather than a hand-rolled guard. -->
  <div class="a27-overlay" :data-open="props.panel !== 'none'" :inert="props.panel === 'none'">
    <div class="a27-overlay-head">
      <span class="flex items-baseline gap-3">
        <span class="a27-name" style="font-size: 15px">
          {{ props.panel === 'none' ? '' : TITLE[props.panel] }}
        </span>
        <span class="a27-label">
          {{ props.panel === 'fleet' ? `${fleet.length} AIRCRAFT`
            : props.panel === 'alerts' ? `${latched} LATCHED · ${alerts.length} TOTAL`
            : `${plan.length} WAYPOINTS · CURRENT ${current}` }}
        </span>
      </span>
      <button type="button" class="a27-tb-btn" @click="emit('close')">
        <Icon name="xmark" size="xs" />
        <span class="a27-label" style="color: var(--a27-ink)">Close</span>
      </button>
    </div>

    <!-- ── Fleet ────────────────────────────────────────────────────────
         The incumbent's two vehicle cards, floating at the bottom of the video
         with a battery pip and nothing else. A fleet card should answer which,
         how healthy, how much is left, and what it is doing. -->
    <div v-if="props.panel === 'fleet'" class="a27-scroll flex-1 p-4">
      <div class="grid gap-3" style="grid-template-columns: repeat(3, minmax(0, 1fr))">
        <button
          v-for="v in fleet"
          :key="v.id"
          type="button"
          class="a27-well-box a27-edge p-4 text-left"
          :class="`a27-edge-${v.health}`"
          :style="v.id === props.selected ? 'background: var(--a27-well)' : ''"
          @click="emit('select', v.id)"
        >
          <span class="flex items-center justify-between">
            <!-- Selection is a brand CHECK, not a brand border: a border would
                 have to overwrite the card's severity rail to be seen, and a
                 card cannot trade "how bad is it" for "which one is it". -->
            <span class="flex items-center gap-2">
              <Icon v-if="v.id === props.selected" name="check" size="xs" style="color: var(--brand)" />
              <span class="a27-name" style="font-size: 15px">{{ v.callsign }}</span>
            </span>
            <StatusBadge :level="v.health" variant="outline" size="sm">
              {{ v.armed ? 'Armed' : 'Safe' }}
            </StatusBadge>
          </span>
          <span class="a27-label mt-1 block">{{ v.type }}</span>

          <span class="a27-fields mt-3 block" style="--a27-cols: 2">
            <span class="a27-field">
              <span class="a27-label">Battery</span>
              <span class="a27-field-row"><span class="a27-meas a27-meas-lg">{{ v.battery }}</span><span class="a27-unit">%</span></span>
            </span>
            <span class="a27-field">
              <span class="a27-label">Link</span>
              <span class="a27-field-row"><span class="a27-meas a27-meas-lg">{{ v.link }}</span><span class="a27-unit">dB</span></span>
            </span>
          </span>
          <span class="a27-micro mt-2.5 block" style="color: var(--a27-ink-2)">{{ v.note }}</span>
        </button>
      </div>

      <!-- ── Engage authority ───────────────────────────────────────────
           Deliberately here and not on the HUD. Arming a payload is a
           two-handed act you step out of the fight to perform; a switch within
           reach of the thumb that flies the gimbal is not a guard at all. -->
      <div
        class="a27-edge a27-edge-alarm mt-4 flex items-center justify-between gap-4 p-4"
        style="background: var(--a27-well); border-radius: var(--radius-md)"
      >
        <span>
          <span class="a27-name block" :class="props.authority ? 'a27-ink-alarm' : ''" style="font-size: 14px">
            Engage authority · {{ props.authority ? 'authorised' : 'safed' }}
          </span>
          <span class="a27-label mt-1 block">
            ROE 4-C · TGT-01 · 954 M · CEP 1.8 M · FUZE FAR
          </span>
          <span class="a27-micro mt-1.5 block" style="color: var(--a27-ink-3)">
            Authorising here reveals the hold-to-commit control on the HUD. It does not exist until you do.
          </span>
        </span>
        <Switch
          :model-value="props.authority"
          aria-label="Engage authority"
          @update:model-value="(v) => emit('authority', Boolean(v))"
        />
      </div>
    </div>

    <!-- ── Alerts ───────────────────────────────────────────────────────
         The surface the incumbent has none of: DEGRADED was magenta bitmap
         text burned into the video, with no level, no time and nowhere to
         acknowledge it. -->
    <div v-else-if="props.panel === 'alerts'" class="a27-scroll flex-1 p-2">
      <div
        v-for="a in alerts"
        :key="a.code"
        class="a27-edge flex items-center gap-4 p-4"
        :class="`a27-edge-${a.level}`"
        style="border-bottom: 1px solid var(--a27-line-2)"
      >
        <StatusBadge :level="a.level" size="sm">{{ a.level }}</StatusBadge>
        <span class="min-w-0 flex-1">
          <span class="a27-name block" style="font-size: 14px">{{ a.text }}</span>
          <span class="a27-label mt-1 block">{{ a.code }} · {{ a.at }}</span>
        </span>
        <button v-if="a.latched" type="button" class="a27-tb-btn">
          <Icon name="check" size="xs" />
          <span class="a27-label" style="color: var(--a27-ink)">Acknowledge</span>
        </button>
        <span v-else class="a27-label" style="color: var(--a27-ink-3)">CLEARED</span>
      </div>
    </div>

    <!-- ── Plan ─────────────────────────────────────────────────────────
         The console's table, at touch row height. -->
    <div v-else class="a27-scroll flex-1">
      <table class="a27-table">
        <thead>
          <tr>
            <th style="width: 64px">#</th>
            <th style="width: 130px">Kind</th>
            <th style="width: 100px">Alt AGL</th>
            <th style="width: 100px">Speed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in plan" :key="p.n" :data-current="p.n === current">
            <td style="padding-block: 14px">{{ p.n }}</td>
            <td><span class="a27-label">{{ p.kind }}</span></td>
            <td>{{ p.alt }} <span class="a27-unit">m</span></td>
            <td>{{ p.speed }} <span class="a27-unit">m/s</span></td>
            <td style="font-family: var(--font-sans); font-size: 13px">
              {{ p.action }}
              <span v-if="p.n === current" class="a27-label ml-2" style="color: var(--brand)">◂ CURRENT</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
