<script setup lang="ts">
/**
 * The command dial.
 *
 * Two asks in the thread are the same feature, and answering them separately is
 * what makes each one awkward:
 *
 *   "add quick commands for HOLD / EIGHT — currently four actions, we want two"
 *   "RESET VEHICLE POSITION should open a window with six modes"
 *
 * One pointer-anchored dial gives both. Press-and-hold on the map is action
 * one; the sector is action two. The four everyday commands cost exactly two.
 * The two that correct the aircraft's own estimate cost a third, deliberately.
 *
 * ── Why press-and-hold, not right-click ────────────────────────────────────
 * The thread rules right-click out: "Right-clicking was mentioned as an option,
 * but it's currently occupied by other functionality for EVO." A tablet has no
 * right button at all, so on this device the question does not arise — long
 * press is the gesture, it is free, and it is what every map application has
 * trained the same operators to expect. On the desktop build the same dial can
 * hang off middle-click or a modifier without disturbing EVO, and right-click
 * keeps whatever it already does; this surface takes no position on that beyond
 * showing that the dial does not need the button.
 *
 * ── Why a dial rather than a list ──────────────────────────────────────────
 * Six items is under the count where a ring stops paying. Every item is the
 * same distance from the pointer, direction becomes muscle memory inside a
 * week, and — the part that matters at 3 a.m. — the operator stops reading the
 * labels. A list forces a different travel distance per item and never stops
 * being read.
 *
 * ── What the ring is saying by its shape ───────────────────────────────────
 * The right half is everyday and fires on release. The left half corrects what
 * the aircraft BELIEVES about itself, and is guarded. Two fence marks sit in
 * the gaps between the halves. The complaint that opened this thread was LAND
 * next to RESET VEHICLE POSITION "and the LAND command goes through instantly"
 * — so the fence is the whole point, and it costs no colour and no label.
 */
import { computed, nextTick, ref, watch } from 'vue';
import { GuardedAction } from '@auxiliary/vue';
import { COMMANDS, type Cmd } from './model';

const props = defineProps<{
  /** Where the press landed, in screen-local px. */
  x: number;
  y: number;
  /** Bounds of the device screen, so the dial never opens half off the edge. */
  width: number;
  height: number;
  /** What the dial will act on — shown in the hub, because a command with no
   *  stated subject is how the wrong aircraft gets told to do something. */
  subject: string;
  /** The map point under the press, in the same notation the rest of AMC uses. */
  at: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'command', payload: { key: string; label: string; value?: string }): void;
}>();

/** Ring radius. Set on the element below, so this file is the one source. */
const R = 128;
/** Half the sector box, for the clamp — a sector may not cross the screen edge. */
const REACH = R + 48;

/** Highlighted sector. -1 is the hub: opened, nothing chosen yet. */
const active = ref(-1);
/** A value command that has opened the hub into its stepper. */
const editing = ref<Cmd | null>(null);
/** An estimate command that has opened the hub into its guard. */
const guarding = ref<Cmd | null>(null);
const amount = ref(0);
const root = ref<HTMLElement | null>(null);

/* ── Placement ─────────────────────────────────────────────────────────────
 * Clamped, not scrolled: the dial follows the pointer until the pointer gets
 * close enough to an edge that a sector would leave the screen, and then it
 * stops. A dial that reflows its sectors to fit has thrown away the muscle
 * memory that was the reason to draw a ring.
 */
const cx = computed(() => Math.min(Math.max(props.x, REACH), props.width - REACH));
const cy = computed(() => Math.min(Math.max(props.y, REACH), props.height - REACH));

/** Ring position for a sector, in px from the dial box's top-left corner. */
function place(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return { left: `${R + R * Math.sin(rad)}px`, top: `${R - R * Math.cos(rad)}px` };
}

/** The two fence marks, in the gaps between the everyday half and the guarded
 *  half. Drawn from the same angles the sectors use, so they cannot drift. */
const FENCES = [210, 330];
function fence(angle: number) {
  const rad = (angle * Math.PI) / 180;
  const inner = R * 0.52;
  const outer = R * 1.2;
  return {
    x1: R + inner * Math.sin(rad),
    y1: R - inner * Math.cos(rad),
    x2: R + outer * Math.sin(rad),
    y2: R - outer * Math.cos(rad),
  };
}

/* ── Hub content ───────────────────────────────────────────────────────── */

const hovered = computed<Cmd | null>(() => (active.value >= 0 ? COMMANDS[active.value]! : null));
const open = computed(() => editing.value ?? guarding.value);

const KIND_WORD: Record<Cmd['kind'], string> = {
  mode: 'Mode',
  value: 'Value',
  estimate: 'Estimate',
};

function choose(i: number) {
  const c = COMMANDS[i]!;
  if (c.kind === 'value') {
    amount.value = c.range!.from;
    editing.value = c;
    return;
  }
  if (c.kind === 'estimate') {
    guarding.value = c;
    return;
  }
  emit('command', { key: c.key, label: c.label });
  emit('close');
}

function applyValue() {
  const c = editing.value;
  if (!c) return;
  emit('command', { key: c.key, label: c.label, value: `${amount.value} ${c.range!.unit}` });
  emit('close');
}

function step(by: number) {
  const r = editing.value?.range;
  if (!r) return;
  amount.value = Math.min(r.max, Math.max(r.min, amount.value + by * r.step));
}

/** Free-typed entry, clamped on the way in — SW-3160 asks for exactly this
 *  alongside the slider, and the stepper is where it belongs. */
function typed(e: Event) {
  const r = editing.value?.range;
  const n = Number((e.target as HTMLInputElement).value);
  if (!r || Number.isNaN(n)) return;
  amount.value = Math.min(r.max, Math.max(r.min, Math.round(n)));
}

/* ── Keyboard ──────────────────────────────────────────────────────────────
 * A ring driven only by a pointer is a ring half the operators cannot use, and
 * it would fail the repo's own a11y gate. Arrow keys walk the ring in the
 * direction they point, Enter commits, Escape backs out one level at a time.
 */
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault();
    if (open.value) {
      editing.value = null;
      guarding.value = null;
      return;
    }
    emit('close');
    return;
  }
  if (open.value) return;

  const n = COMMANDS.length;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    active.value = (Math.max(active.value, 0) + 1) % n;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    active.value = (Math.max(active.value, 0) + n - 1) % n;
  } else if (e.key === 'Home') {
    e.preventDefault();
    active.value = 0;
  } else if (e.key === 'End') {
    e.preventDefault();
    active.value = n - 1;
  } else if ((e.key === 'Enter' || e.key === ' ') && active.value >= 0) {
    e.preventDefault();
    choose(active.value);
  }
}

watch(
  root,
  (el) => {
    if (el) void nextTick(() => el.focus());
  },
  { immediate: true },
);
</script>

<template>
  <div class="fv-dial-root">
    <!-- Dismiss. A button rather than a bare div so it is reachable and named,
         which is also what makes Escape's behaviour discoverable. -->
    <button type="button" class="fv-dial-scrim" aria-label="Dismiss command dial" @click="emit('close')" />

    <div
      ref="root"
      class="fv-dial"
      tabindex="-1"
      role="menu"
      aria-label="Flight commands"
      :aria-activedescendant="active >= 0 && !open ? `fv-sector-${COMMANDS[active]!.key}` : undefined"
      :style="{ left: `${cx}px`, top: `${cy}px`, '--fv-dial-r': `${R}px` }"
      @keydown="onKey"
    >
      <!-- The fence. Two marks, in the two gaps, at the same radius the ring
           sits on — a press above one is not the same kind of act as a press
           below it, said in geometry rather than in words. -->
      <svg
        class="fv-fence"
        :width="R * 2"
        :height="R * 2"
        :viewBox="`0 0 ${R * 2} ${R * 2}`"
        aria-hidden="true"
      >
        <line
          v-for="a in FENCES"
          :key="a"
          :x1="fence(a).x1"
          :y1="fence(a).y1"
          :x2="fence(a).x2"
          :y2="fence(a).y2"
          stroke="var(--fv-edge)"
          stroke-width="1.5"
          stroke-dasharray="3 4"
        />
      </svg>

      <button
        v-for="(c, i) in COMMANDS"
        :id="`fv-sector-${c.key}`"
        :key="c.key"
        type="button"
        role="menuitem"
        class="fv-sector"
        :style="place(c.angle)"
        :data-kind="c.kind"
        :data-level="c.level"
        :data-active="active === i && !open"
        :aria-current="active === i && !open ? 'true' : undefined"
        :inert="open ? true : undefined"
        @mouseenter="active = i"
        @focus="active = i"
        @click="choose(i)"
      >
        <!-- Loiter: a closed orbit with the aircraft on it. -->
        <svg v-if="c.key === 'hold'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
          <circle cx="12" cy="12" r="7.5" stroke-dasharray="3 3" />
          <path d="M12 4.5 l2.6 2.2 l-2.6 -0.9 l-2.6 0.9 Z" fill="currentColor" stroke="none" />
        </svg>
        <!-- Figure-eight: the shape itself, because no word describes it faster. -->
        <svg v-else-if="c.key === 'eight'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
          <circle cx="12" cy="7.6" r="4.3" />
          <circle cx="12" cy="16.4" r="4.3" />
        </svg>
        <!-- Commanded airspeed. -->
        <svg v-else-if="c.key === 'speed'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 7 l4.5 5 l-4.5 5 M12 7 l4.5 5 l-4.5 5" />
        </svg>
        <!-- Commanded altitude, against the ground it is measured from. -->
        <svg v-else-if="c.key === 'alt'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 4 v13 M8.4 7.6 L12 4 l3.6 3.6 M4 20.5 h16" />
        </svg>
        <!-- Heading estimate, re-aligned to north. -->
        <svg v-else-if="c.key === 'heading'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="13" r="7.5" />
          <path d="M12 13 L16.4 8.6 M12 2 v2.6" />
        </svg>
        <!-- Position estimate, moved to a point. -->
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
          <path d="M12 2.5 v4 M12 17.5 v4 M2.5 12 h4 M17.5 12 h4" />
          <circle cx="12" cy="12" r="3.2" />
        </svg>

        <span class="fv-sector-label">{{ c.label }}</span>
        <span class="fv-sector-kind">{{ KIND_WORD[c.kind] }}</span>
      </button>

      <!-- ══ The hub ═══════════════════════════════════════════════════════
           Idle it names the subject, because a command with no stated subject
           is how the wrong aircraft gets told to do something. On hover it
           carries the sentence the sector is too small to hold. Chosen, it
           becomes either the value stepper or the guard. -->
      <div class="fv-hub" :class="open ? 'fv-hub-open' : undefined">
        <template v-if="editing">
          <p class="fv-label">{{ editing.label }}</p>
          <div class="flex items-center gap-2.5">
            <button type="button" class="fv-hub-step" :aria-label="`Decrease ${editing.label}`" @click="step(-1)">
              <span class="fv-meas fv-meas-lg" style="line-height: 1">&minus;</span>
            </button>
            <label class="sr-only" :for="`fv-amount-${editing.key}`">{{ editing.detail }}</label>
            <input
              :id="`fv-amount-${editing.key}`"
              class="fv-hub-field"
              type="number"
              inputmode="numeric"
              :min="editing.range!.min"
              :max="editing.range!.max"
              :step="editing.range!.step"
              :value="amount"
              @input="typed"
            />
            <button type="button" class="fv-hub-step" :aria-label="`Increase ${editing.label}`" @click="step(1)">
              <span class="fv-meas fv-meas-lg" style="line-height: 1">+</span>
            </button>
          </div>
          <p class="fv-micro">
            {{ editing.range!.unit }} · {{ editing.range!.min }}&ndash;{{ editing.range!.max }} ·
            now {{ editing.range!.from }}
          </p>
          <div class="flex gap-2">
            <button type="button" class="fv-seg-btn" style="border: 1px solid var(--fv-line)" @click="editing = null">
              Back
            </button>
            <button
              type="button"
              class="fv-seg-btn"
              style="border: 1px solid var(--fv-ink); color: var(--fv-ink)"
              @click="applyValue"
            >
              Apply
            </button>
          </div>
        </template>

        <template v-else-if="guarding">
          <p class="fv-label" :class="guarding.level === 'warning' ? 'fv-ink-warning' : 'fv-ink-caution'">
            {{ guarding.label }}
          </p>
          <p class="fv-micro" style="max-width: 200px">{{ guarding.detail }}</p>
          <div class="fv-guard-block" style="width: 100%">
            <GuardedAction
              mode="hold"
              variant="secondary"
              size="sm"
              :hold-ms="1200"
              confirm-label="Hold&hellip;"
              :instruction-text="`Press and hold to ${guarding.detail.toLowerCase()}`"
              :class="guarding.level === 'warning' ? 'fv-guard-warning' : 'fv-guard-caution'"
              @confirm="() => { emit('command', { key: guarding!.key, label: guarding!.label }); emit('close'); }"
            >
              <span class="fv-act-label">Hold to apply</span>
            </GuardedAction>
          </div>
          <button type="button" class="fv-seg-btn" @click="guarding = null">Back</button>
        </template>

        <template v-else-if="hovered">
          <p class="fv-label">{{ KIND_WORD[hovered.kind] }}</p>
          <p class="fv-micro" style="max-width: 76px; line-height: 1.35">{{ hovered.detail }}</p>
        </template>

        <template v-else>
          <p class="fv-label">{{ subject }}</p>
          <p class="fv-micro">{{ at }}</p>
        </template>
      </div>
    </div>
  </div>
</template>
