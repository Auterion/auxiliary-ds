<script setup lang="ts">
/* Auterion Mission Control, compressed. The left toolstrip order, the telemetry
 * fields and the vehicle strip are the shipped ones.
 *
 * Abort sits last and below a hairline fence, so the rail is ordered by
 * consequence and the ordering still reads with no colour at all — the same
 * rule the strike-control study lands on (`strike/StrikeStudio.vue`). */
import { Icon } from '@auxiliary/icons';

const RAIL = [
  { label: 'Takeoff', icon: 'arrow-up' as const },
  { label: 'Land', icon: 'arrow-down' as const },
  { label: 'Return', icon: 'arrow-left' as const },
  { label: 'Mission', icon: 'drone' as const },
];

const TELEM = [
  { k: 'RSSI', v: '−64', u: ' dBm' },
  { k: 'SNR', v: '21', u: '' },
  { k: 'V', v: '24.1', u: '' },
  { k: 'I', v: '18.4', u: ' A' },
  { k: 'HAcc', v: '0.4', u: ' m' },
  { k: 'Nsat', v: '21', u: '' },
];

const VEHICLES = [
  { id: 'SKY-01', mode: 'Mission', level: 'nominal', selected: true },
  { id: 'SKY-04', mode: 'Hold', level: 'nominal', selected: false },
  { id: 'SKY-07', mode: 'Return', level: 'caution', selected: false },
];
</script>

<template>
  <div class="ec-body">
    <div class="ec-stage">
      <!-- Terrain. Everything the system draws over a stage sits on satellite
           imagery in the real product, so this is a hairline field, not a fill:
           a flat tint would be the one thing that cannot survive the transfer. -->
      <svg
        class="ec-stage-art"
        viewBox="0 0 900 264"
        preserveAspectRatio="none"
        style="color: var(--foreground)"
        aria-hidden="true"
      >
        <g stroke="currentColor" stroke-width="1" opacity="0.12" fill="none">
          <path d="M0 44h900M0 100h900M0 156h900M0 212h900" />
          <path d="M140 0v264M320 0v264M500 0v264M680 0v264M860 0v264" />
        </g>
        <g stroke="currentColor" stroke-width="1.2" opacity="0.22" fill="none">
          <path d="M0 186C160 162 250 208 390 188 530 168 660 214 900 178" />
          <path d="M0 214C170 196 260 240 400 220 540 200 670 244 900 210" />
        </g>
        <path
          d="M560 18C602 62 580 116 646 152 712 188 754 162 796 122"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-dasharray="6 5"
          opacity="0.42"
          fill="none"
        />
      </svg>

      <div class="ec-rail">
        <p v-for="r in RAIL" :key="r.label" class="ec-rail-item">
          <Icon :name="r.icon" :size="15" aria-hidden="true" />
          {{ r.label }}
        </p>
        <span class="ec-rail-fence" aria-hidden="true" />
        <p class="ec-rail-item" data-destructive="true">
          <Icon name="octagon-exclamation" :size="15" aria-hidden="true" />
          Abort
        </p>
      </div>

      <div class="ec-plate ec-telem">
        <span v-for="t in TELEM" :key="t.k">{{ t.k }} <b>{{ t.v }}</b>{{ t.u }}</span>
        <span style="color: var(--nominal-emphasis)">BATT <b style="color: inherit">78%</b></span>
      </div>

      <div class="ec-vcards">
        <p
          v-for="v in VEHICLES"
          :key="v.id"
          class="ec-plate ec-vcard"
          :data-selected="v.selected"
        >
          <span class="ec-dot" :data-level="v.level" aria-hidden="true" />
          <b>{{ v.id }}</b>
          <span>{{ v.mode }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
