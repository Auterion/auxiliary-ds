<script setup lang="ts">
/* Nemyx, compressed. Agent cards, selection groups and the keyboard-first
 * command rail are the shipped grammar; nothing here reaches into it.
 *
 * One addition, and it is the proposal's only new instrument: DATA AGE, in the
 * status strip beside the selection count. Every surface in the ecosystem
 * receives timestamped telemetry and not one of them says how old the picture
 * is. The closest thing that ships anywhere is Mission Control's `goingStale`
 * opacity pulse on a vehicle icon — a binary, with no number attached, carried
 * by opacity alone. Age is the one operational fact all five surfaces hold and
 * none of them states out loud. */

const AGENTS = [
  { n: '01', id: 'SKY-01', state: 'Armed · Offboard', level: 'nominal', selected: true },
  { n: '04', id: 'SKY-04', state: 'Armed · Offboard', level: 'nominal', selected: true },
  { n: '07', id: 'SKY-07', state: 'Armed · Hold', level: 'nominal', selected: false },
  { n: '11', id: 'SKY-11', state: 'Disarmed', level: 'alarm', selected: false },
];

const COMMANDS = [
  { label: 'Take off', key: 'T' },
  { label: 'Go to', key: 'G' },
  { label: 'Land', key: 'L' },
  { label: 'Formation', key: 'F' },
];

/* Leader plus four followers, radial. Drawn rather than photographed so it
 * re-resolves with the theme like everything else on the stage. */
const FOLLOWERS = [
  { x: 466, y: 132 },
  { x: 534, y: 132 },
  { x: 444, y: 168 },
  { x: 556, y: 168 },
];
</script>

<template>
  <div class="ec-body">
    <div class="ec-stage">
      <svg
        class="ec-stage-art"
        viewBox="0 0 900 264"
        preserveAspectRatio="xMidYMid slice"
        style="color: var(--foreground)"
        aria-hidden="true"
      >
        <g stroke="currentColor" stroke-width="1" opacity="0.11" fill="none">
          <path d="M0 66h900M0 132h900M0 198h900" />
          <path d="M180 0v264M360 0v264M540 0v264M720 0v264" />
        </g>
        <path
          d="M300 240C380 200 430 168 500 148"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-dasharray="5 4"
          opacity="0.3"
          fill="none"
        />
        <!-- The selection ring. Brand, because selection is identity-of-focus,
             not severity — the status ladder never marks what you picked. -->
        <circle
          cx="500"
          cy="148"
          r="36"
          fill-opacity="0.1"
          stroke-width="1.2"
          style="fill: var(--brand); stroke: var(--brand)"
        />
        <path
          d="M500 131 507 152 500 147 493 152Z"
          stroke-width="1"
          style="fill: var(--brand); stroke: var(--background)"
        />
        <path
          v-for="f in FOLLOWERS"
          :key="`${f.x}-${f.y}`"
          :d="`M${f.x} ${f.y} ${f.x + 6} ${f.y + 17} ${f.x} ${f.y + 13} ${f.x - 6} ${f.y + 17}Z`"
          fill="currentColor"
          fill-opacity="0.55"
        />
        <text
          x="544"
          y="136"
          fill="currentColor"
          opacity="0.72"
          style="font-family: var(--font-mono); font-size: 10px"
        >
          G1 · LEADER
        </text>
      </svg>

      <div class="ec-agents">
        <p
          v-for="a in AGENTS"
          :key="a.id"
          class="ec-plate ec-agent"
          :data-selected="a.selected"
        >
          <span class="ec-agent-id" :data-level="a.level">{{ a.n }}</span>
          <span class="ec-agent-tx">
            <b>{{ a.id }}</b>
            <span>{{ a.state }}</span>
          </span>
        </p>
      </div>

      <div class="ec-plate ec-swarm-status">
        <span>SEL <b>2</b>/12</span>
        <span>FORM <b>Radial</b></span>
        <span>AGE <b style="color: var(--nominal-emphasis)">0.4 s</b></span>
      </div>

      <div class="ec-cmd">
        <p v-for="c in COMMANDS" :key="c.key" class="ec-plate ec-cmd-btn">
          {{ c.label }}<kbd>{{ c.key }}</kbd>
        </p>
      </div>
    </div>
  </div>
</template>
