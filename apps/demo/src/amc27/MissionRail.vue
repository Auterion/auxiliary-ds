<script setup lang="ts">
/**
 * AMC27 · the mission rail (left).
 *
 * The incumbent draws each command twice: a naked grey circle with an
 * ambiguous glyph, and — floating beside it, unattached — a black box holding
 * the words. Two objects, one command, and neither of them is the hit target
 * for the other. Rejoined here into one row: glyph, name, and the consequence
 * underneath, which is the thing the incumbent never says. "Approach 30°" and
 * "Detonation: FAR" are settings shown as buttons; here the current value is
 * the row's second line.
 *
 * Below the commands is the thing the incumbent has no surface for at all: an
 * alert list. The screenshot screams DEGRADED in magenta bitmap text over the
 * video, with no level, no time and nowhere to acknowledge it.
 */
import { GuardedAction, StatusBadge } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import { commands, alerts } from './telemetry';

const GLYPH: Record<string, IconName> = {
  rtl: 'house',
  hold: 'circle-exclamation',
  approach: 'arrow-down',
  speed: 'arrow-right',
  reset: 'arrow-up-right-from-square',
  abort: 'octagon-exclamation',
};
</script>

<template>
  <aside class="a27-rail a27-rail-left">
    <!-- ── Commands ─────────────────────────────────────────────────────── -->
    <div class="a27-sec">
      <div class="a27-sec-head">
        <span class="a27-label">Flight commands</span>
        <span class="a27-label" style="color: var(--a27-ink-3)">F1–F6</span>
      </div>

      <div class="flex flex-col gap-0.5">
        <template v-for="c in commands" :key="c.key">
          <!-- An irreversible command is not a button you can hit by accident.
               The DS already ships the hold-to-confirm control; using it is
               cheaper and more honest than styling a red button.

               It takes `secondary`, not `danger`, on purpose. Aborting a
               mission is a WARNING on the reserved ladder; committing an
               engagement is an ALARM. If both were solid destructive red the
               ladder would be saying they are the same, and a surface with
               two loudest things has none. So the abort carries the warning
               ink and rail, and the alarm plate stays unique to the payload
               column. Local to this demo — a ladder-aware variant is a real
               DS question, not something to smuggle in through a page. -->
          <!-- GuardedAction's root is an inline-flex `<span>` and the `class`
               prop lands on the button inside it, so the block wrapper is what
               makes the control fill the rail. -->
          <div v-if="c.destructive" class="a27-guard-block mt-1.5">
            <GuardedAction
              mode="hold"
              variant="secondary"
              size="md"
              confirm-label="Hold to abort…"
              class="a27-abort"
              @confirm="() => {}"
            >
              <Icon name="triangle-exclamation" size="xs" />
              <span class="a27-name" style="color: currentcolor">{{ c.label }}</span>
            </GuardedAction>
          </div>

          <button v-else type="button" class="a27-cmd">
            <span class="a27-cmd-glyph"><Icon :name="GLYPH[c.key] ?? 'circle-info'" size="sm" /></span>
            <span class="min-w-0 leading-tight">
              <span class="a27-name block truncate">{{ c.label }}</span>
              <span class="a27-label">{{ c.hint }}</span>
            </span>
          </button>
        </template>
      </div>
    </div>

    <!-- ── Alerts ───────────────────────────────────────────────────────── -->
    <div class="a27-sec a27-sec-flex">
      <div class="a27-sec-head">
        <span class="a27-label">Alerts</span>
        <StatusBadge level="caution" variant="outline" size="sm">1 latched</StatusBadge>
      </div>

      <div class="a27-scroll -mx-1 flex-1">
        <div
          v-for="a in alerts"
          :key="a.code"
          class="a27-alert a27-edge"
          :class="`a27-edge-${a.level}`"
        >
          <span class="a27-label" :class="`a27-ink-${a.level}`">{{ a.code }}</span>
          <span class="a27-micro" style="color: var(--a27-ink)">{{ a.text }}</span>
          <span class="a27-label" style="color: var(--a27-ink-3)">{{ a.at }}</span>
          <span class="a27-label" style="color: var(--a27-ink-3)">
            {{ a.latched ? 'LATCHED' : 'CLEARED' }}
          </span>
        </div>
      </div>
    </div>
  </aside>
</template>
