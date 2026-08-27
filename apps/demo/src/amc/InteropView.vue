<script setup lang="ts">
/**
 * AMC · NATO interoperability — STANAG 4817 status reporting over CATL.
 *
 * The surface a GCS operator uses to confirm that the platform is actually
 * pushing position/status into the coalition C2 node before and during a
 * NATO exercise: which CATL messages are emitted, on which bandwidth profile,
 * what the outbound position report contains, and which pre-sail gates remain
 * open. See `interop.ts` for the sourcing note.
 *
 * This is the surface's most editorial view — a conformance ledger — so it
 * takes the 07b grammar in full: a real `.dk-table` for the message set with
 * rates hard right, mono pointer-labels on every field, brackets on the
 * measured totals, hairlines instead of panels.
 *
 * Signal budget: ONE blue, and it is text, not a plate — the OWN marker on the
 * coalition track. Everything else that used to be brand-coloured (the wire
 * feed's message id, the RUN CHECK affordance) is ink. The latency sparkline
 * is ink too: `advisory` is a rung of the reserved severity ladder and a
 * round-trip trend is not a severity.
 */
import { computed, onUnmounted, ref } from 'vue';
import { Badge, StatusBadge, TelemetryValue, CoordinateValue, AlertBanner, Switch, type StatusLevel } from '@auxiliary/vue';
import { Sparkline } from '@auxiliary/viz';
import { Icon } from '@auxiliary/icons';
import { MESSAGES, TRACKS, GATES, RTT, PROFILES, PROFILE_META, type Coverage, type Gate, type GateState, type Profile } from './interop';

const profile = ref<Profile>('medium');
const reporting = ref(true);

/** Coverage → the reserved severity ladder + operator-facing wording. */
const COVERAGE: Record<Coverage, { level: StatusLevel; label: string }> = {
  emitting: { level: 'nominal', label: 'Emitting' },
  partial: { level: 'advisory', label: 'Partial' },
  planned: { level: 'caution', label: 'Planned' },
  absent: { level: 'caution', label: 'Not built' },
};

const GATE_LEVEL: Record<GateState, StatusLevel> = {
  met: 'nominal',
  scheduled: 'advisory',
  open: 'caution',
  waived: 'advisory',
};

const rate = (m: (typeof MESSAGES)[number]) => m.hz[profile.value];

/** Rate-derived gates re-evaluate live: the low-bandwidth profile fails ≥ 1 Hz. */
const gates = computed<Gate[]>(() =>
  GATES.map((g) => {
    if (!g.msg || g.minHz == null) return g;
    const hz = MESSAGES.find((m) => m.id === g.msg)?.hz[profile.value] ?? null;
    return {
      ...g,
      state: hz != null && hz >= g.minHz ? 'met' : 'open',
      detail: `${g.msg} · ${hz == null ? 'not emitted' : `${hz} Hz`} · ${profile.value} profile`,
    };
  }),
);
const metGates = computed(() => gates.value.filter((g) => g.state === 'met').length);

const emitting = computed(() => MESSAGES.filter((m) => rate(m) != null && reporting.value));
/** Aggregate outbound load — the number a bandwidth-constrained bearer cares about. */
const load = computed(() =>
  Math.round(emitting.value.reduce((sum, m) => sum + (rate(m) ?? 0) * m.bytes * 8, 0)),
);

const rtt = RTT[RTT.length - 1]!;
const linkLevel = computed<StatusLevel>(() => (reporting.value ? 'nominal' : 'caution'));

// ── Outbound feed ────────────────────────────────────────────────────────────
// Deterministic clock (no Date.now) so the mock reads the same on every load.
const t0 = 12 * 3600 + 4 * 60 + 31.204;
const seq = ref(4412);
const tick = ref(0);

const clock = (offset: number) => {
  const t = t0 + offset;
  const h = Math.floor(t / 3600);
  const mm = Math.floor((t % 3600) / 60);
  const ss = t % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${ss.toFixed(3).padStart(6, '0')}`;
};

const feed = computed(() => {
  const msgs = emitting.value.length ? emitting.value : MESSAGES.slice(0, 1);
  return Array.from({ length: 9 }, (_, i) => {
    const n = tick.value - i;
    const m = msgs[((n % msgs.length) + msgs.length) % msgs.length]!;
    return {
      key: n,
      time: clock(n * 0.94),
      id: m.id,
      seq: seq.value + n,
      bytes: m.bytes,
      ack: 38 + ((n * 7) % 26),
      ok: reporting.value,
    };
  });
});

const timer = window.setInterval(() => {
  if (reporting.value) tick.value += 1;
}, 940);
onUnmounted(() => window.clearInterval(timer));

// ── Outbound position report (the CATL.POS payload the C2 node receives) ─────
const pos = {
  lat: 38.4772,
  lon: -8.8894,
  altMsl: 434,
  altAgl: 124,
  cog: 123,
  sog: 11.4,
  vrate: 1.2,
  uncertainty: 1.4,
};

// ── Bracketed totals — counted from the data, never typed, so they cannot go
//    stale against the rows below them. Kept short: these head narrow panels,
//    and a bracket that wraps reads as two broken measurements, not one fact.
const setBracket = computed(() =>
  `${emitting.value.length}/${MESSAGES.length} emitting · ${(load.value / 1000).toFixed(2)} kbit/s`,
);
const gateBracket = computed(() => `${metGates.value}/${gates.value.length} met`);
const trackBracket = computed(() => `${TRACKS.length} tracks`);
</script>

<template>
  <div class="amc-page">
    <!-- ═══ Page header ═══ -->
    <header class="amc-topbar">
      <Icon name="bars" size="sm" class="amc-glyph" />
      <span class="dk-label">AMC</span>
      <span class="amc-glyph">/</span>
      <h1 class="dk-value">Coalition reporting</h1>
      <Badge variant="secondary" size="sm" class="font-mono tabular-nums">STANAG 4817</Badge>
      <Badge variant="outline" size="sm" class="font-mono tabular-nums">CATL · SCI-343</Badge>
      <span class="amc-inline ml-auto gap-3">
        <span class="dk-label">REPMUS 26 · Tróia</span>
        <StatusBadge :level="linkLevel" size="sm" dot>
          {{ reporting ? 'Reporting' : 'Muted' }}
        </StatusBadge>
        <Switch v-model="reporting" aria-label="Emit CATL reports" />
      </span>
    </header>

    <div class="amc-interop">
      <!-- ── left: the link itself ─────────────────────────────────────── -->
      <div class="amc-stack">
        <section class="dk-card amc-pad shrink-0">
          <div class="dk-section mb-2.5">
            <span class="dk-label">Reporting link</span>
            <span class="amc-inline">
              <span
                class="dk-dot"
                :class="[reporting ? 'dk-dot-nominal amc-live' : 'dk-dot-caution']"
              />
              <span class="dk-micro">{{ reporting ? 'UP' : 'MUTED' }}</span>
            </span>
          </div>

          <dl>
            <div class="amc-field">
              <dt class="dk-pointer">C2 node</dt>
              <dd class="amc-field-value">CMRE-COP-04</dd>
            </div>
            <div class="amc-field">
              <dt class="dk-pointer">Bearer</dt>
              <dd class="amc-field-value truncate">{{ PROFILE_META[profile].bearer }}</dd>
            </div>
            <div class="amc-field">
              <dt class="dk-pointer">Edition</dt>
              <dd class="amc-field-value">4817 ed.A · draft</dd>
            </div>
          </dl>

          <div class="dk-section mb-2 mt-3">
            <span class="dk-label">Bandwidth profile</span>
          </div>
          <div class="dk-segment amc-segment-block">
            <button
              v-for="p in PROFILES"
              :key="p"
              type="button"
              class="dk-segment-btn"
              :data-active="profile === p"
              :aria-pressed="profile === p"
              @click="profile = p"
            >{{ PROFILE_META[p].label }}</button>
          </div>
          <p class="dk-small mt-2">
            CATL vol.1 encoding for a {{ PROFILE_META[profile].bandwidth }} stream.
          </p>

          <hr class="dk-rule mt-3">
          <div class="mt-3 flex items-end justify-between gap-3">
            <TelemetryValue :value="load / 1000" unit="kbit/s" label="OUTBOUND" size="sm" :precision="2" />
            <TelemetryValue :value="rtt" unit="ms" label="ACK RTT" size="sm" :precision="0" />
            <!-- Ink, not `advisory`: a round-trip trend is not a severity. -->
            <Sparkline :values="RTT" :width="88" :height="26" area color="var(--dk-fg-3)" />
          </div>
        </section>

        <section class="dk-card amc-pad flex min-h-0 flex-1 flex-col">
          <div class="dk-section mb-2">
            <span class="dk-label">Coalition picture</span>
            <span class="dk-bracket">{{ trackBracket }}</span>
          </div>
          <div class="amc-scroll min-h-0 flex-1">
            <div
              v-for="t in TRACKS"
              :key="t.track"
              class="amc-track-row amc-edge"
              :class="t.own ? 'amc-edge-nominal' : ''"
              :data-own="t.own"
            >
              <span class="dk-micro">{{ t.domain }}</span>
              <span class="min-w-0">
                <span class="block truncate text-[12px]" :class="t.own ? 'font-semibold' : ''">{{ t.callsign }}</span>
                <span class="dk-micro">{{ t.nation }} · {{ t.track }}</span>
              </span>
              <!-- The view's ONE blue: ownship in the shared picture. -->
              <span v-if="t.own" class="dk-micro" style="color: var(--dk-signal-ink)">OWN</span>
              <span v-else class="font-mono text-[11px] tabular-nums" style="color: var(--dk-fg-2)">
                {{ t.bearing }}° {{ t.range.toFixed(1) }} km
              </span>
            </div>
          </div>
        </section>
      </div>

      <!-- ── centre: message set + wire feed ───────────────────────────── -->
      <div class="amc-stack">
        <AlertBanner
          level="caution"
          title="STANAG 4817 is not yet ratified"
          description="The outbound profile is pinned to the REPMUS 26 exercise ICD, not to a ratified edition. Re-confirm the required message set with the exercise authority before sail."
          action-label="Open ICD"
          class="shrink-0"
        />

        <!-- ═══ The ledger table — rates hard right, one column model ═══ -->
        <section class="dk-card amc-pad flex min-h-0 flex-1 flex-col">
          <div class="amc-head">
            <span class="dk-label">CATL message set</span>
            <span class="dk-bracket" :class="reporting ? '' : 'dk-ink-caution'">{{ reporting ? setBracket : 'reporting muted' }}</span>
          </div>
          <div class="amc-scroll min-h-0 flex-1">
            <table class="dk-table amc-table">
              <colgroup>
                <col class="amc-col-catl-id">
                <col>
                <col class="amc-col-catl-rate">
                <col class="amc-col-catl-state">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Message</th>
                  <th scope="col">C2 layer</th>
                  <th scope="col" data-align="end">Rate</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in MESSAGES" :key="m.id">
                  <td class="amc-edge font-mono" :class="`amc-edge-${COVERAGE[m.coverage].level}`" data-lead="true">{{ m.id }}</td>
                  <td>
                    <span class="block truncate" style="color: var(--dk-fg)">{{ m.name }}</span>
                    <span class="dk-micro block truncate">{{ m.note }}</span>
                  </td>
                  <td
                    data-align="end"
                    class="font-mono"
                    :class="rate(m) == null ? 'amc-glyph' : !reporting ? 'amc-glyph line-through' : ''"
                    :data-lead="rate(m) != null && reporting ? 'true' : undefined"
                  >{{ rate(m) == null ? '—' : `${rate(m)} Hz` }}</td>
                  <td class="amc-cell-mid">
                    <StatusBadge
                      :level="!reporting && rate(m) != null ? 'caution' : COVERAGE[m.coverage].level"
                      variant="outline"
                      size="sm"
                      dot
                      :icon="false"
                    >
                      {{ !reporting && rate(m) != null ? 'Muted' : COVERAGE[m.coverage].label }}
                    </StatusBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="dk-card amc-pad shrink-0">
          <div class="dk-section mb-2">
            <span class="dk-label">Outbound wire</span>
            <span class="dk-bracket">SEQ {{ seq + tick }}</span>
          </div>
          <div class="amc-wire">
            <p
              v-for="(l, i) in feed"
              :key="l.key"
              class="amc-wire-row"
              :style="{ opacity: 1 - i * 0.07 }"
            >
              <span class="amc-glyph">{{ l.time }}</span>
              <!-- Ink, not signal: a message id is a measured fact. -->
              <span style="color: var(--dk-fg)">{{ l.id }}</span>
              <span class="amc-glyph">seq {{ l.seq }}</span>
              <span class="amc-glyph">{{ l.bytes }} B</span>
              <span v-if="l.ok" class="dk-ink-nominal">ACK {{ l.ack }} ms</span>
              <span v-else class="dk-ink-caution">SUPPRESSED</span>
            </p>
          </div>
        </section>
      </div>

      <!-- ── right: payload + readiness ────────────────────────────────── -->
      <div class="amc-stack">
        <section class="dk-card amc-pad flex min-h-0 flex-1 flex-col">
          <div class="dk-section mb-2">
            <span class="dk-label">CATL.POS payload</span>
            <span class="dk-micro">LAST TX</span>
          </div>

          <div class="amc-scroll min-h-0 flex-1 pr-0.5">
            <dl>
              <div class="amc-field">
                <dt class="dk-pointer">Sender</dt>
                <dd class="amc-field-value">AUT.COBRA.01</dd>
              </div>
              <div class="amc-field">
                <dt class="dk-pointer">Track / domain</dt>
                <dd class="amc-field-value">J1207 · AIR</dd>
              </div>
              <div class="amc-field">
                <dt class="dk-pointer">Time UTC</dt>
                <dd class="amc-field-value">{{ clock(tick * 0.94) }}</dd>
              </div>
            </dl>

            <hr class="dk-rule mt-2">
            <div class="pt-2">
              <span class="dk-pointer">Position · WGS-84</span>
              <div class="mt-1 space-y-0.5">
                <CoordinateValue :lat="pos.lat" :lon="pos.lon" format="mgrs" :mgrs-accuracy="5" size="sm" show-format-tag />
                <CoordinateValue :lat="pos.lat" :lon="pos.lon" format="dd" :precision="5" size="sm" class="amc-glyph" />
              </div>
            </div>

            <hr class="dk-rule mt-2">
            <div class="grid grid-cols-3 gap-x-3 gap-y-2 pt-2">
              <TelemetryValue :value="pos.altMsl" unit="m" label="ALT MSL" size="sm" :precision="0" />
              <TelemetryValue :value="pos.altAgl" unit="m" label="ALT AGL" size="sm" :precision="0" />
              <TelemetryValue :value="pos.cog" unit="°" label="COURSE" size="sm" :precision="0" />
              <TelemetryValue :value="pos.sog" unit="m/s" label="SPEED" size="sm" />
              <TelemetryValue :value="pos.vrate" unit="m/s" label="V-RATE" size="sm" trend="up" />
              <TelemetryValue :value="pos.uncertainty" unit="m" label="CEP 95" size="sm" />
            </div>

            <hr class="dk-rule mt-2">
            <dl class="pt-2">
              <div class="amc-field">
                <dt class="dk-pointer">Op state</dt>
                <dd class="amc-field-value">EXECUTING_TASK</dd>
              </div>
              <div class="amc-field">
                <dt class="dk-pointer">Autonomy</dt>
                <dd class="amc-field-value">SUPERVISED</dd>
              </div>
              <div class="amc-field">
                <dt class="dk-pointer">Task ref</dt>
                <dd class="amc-field-value">TSK-4471 · LEG 4/12</dd>
              </div>
              <div class="amc-field">
                <dt class="dk-pointer">Energy</dt>
                <dd class="amc-field-value">78 % · 34 min</dd>
              </div>
              <div class="amc-field items-center">
                <dt class="dk-pointer">Health</dt>
                <dd class="flex justify-end">
                  <StatusBadge level="nominal" variant="outline" size="sm" dot :icon="false">Nominal</StatusBadge>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section class="dk-card amc-pad shrink-0">
          <div class="dk-section mb-2">
            <span class="dk-label">Pre-sail gates</span>
            <span class="amc-inline">
              <span class="dk-bracket">{{ gateBracket }}</span>
              <button type="button" class="dk-cta dk-cta-sm">Run check</button>
            </span>
          </div>
          <div>
            <div
              v-for="g in gates"
              :key="g.label"
              class="amc-gate-row amc-edge"
              :class="`amc-edge-${GATE_LEVEL[g.state]}`"
            >
              <span class="min-w-0">
                <span class="block truncate text-[12px] leading-tight" style="color: var(--dk-fg)">{{ g.label }}</span>
                <span class="dk-micro block truncate">{{ g.detail }}</span>
              </span>
              <Icon
                :name="g.state === 'met' ? 'circle-check' : g.state === 'open' ? 'triangle-exclamation' : 'circle-info'"
                size="xs"
                :class="`dk-ink-${GATE_LEVEL[g.state]}`"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
