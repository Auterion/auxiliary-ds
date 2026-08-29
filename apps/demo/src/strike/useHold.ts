/**
 * The press-and-hold guard behind the octagon strike control (Turns 2 and 3).
 *
 * A guard is only a guard if the operator can feel it running, so the phase and
 * the progress are both exposed: the octagon spends `progress` on its perimeter
 * trace, which means the guard is readable with no colour at all — the one
 * property that has to survive sunlight, darknight and colour-vision loss.
 *
 * Releasing early aborts. Reaching 1.0 commits, holds the SENT frame for
 * `sentMs`, then falls back to idle on its own — the control never strands the
 * operator in a terminal state they have to clear by hand.
 */
import { onScopeDispose, ref } from 'vue';

export type HoldPhase = 'idle' | 'holding' | 'sent';

/** The guard. Long enough to be deliberate, short enough not to be a chore. */
export const HOLD_MS = 1500;
/** How long SENT holds before the control returns to rest. */
export const SENT_MS = 900;

export function useHold(holdMs = HOLD_MS, sentMs = SENT_MS) {
  const phase = ref<HoldPhase>('idle');
  const progress = ref(0);

  let frame = 0;
  let settle: ReturnType<typeof setTimeout> | undefined;

  function clear() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (settle) clearTimeout(settle);
    settle = undefined;
  }

  function start() {
    // A second pointerdown during SENT must not restart the guard.
    if (phase.value !== 'idle') return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / holdMs);
      progress.value = p;
      phase.value = p >= 1 ? 'sent' : 'holding';
      if (p < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      frame = 0;
      settle = setTimeout(() => {
        phase.value = 'idle';
        progress.value = 0;
      }, sentMs);
    };
    frame = requestAnimationFrame(tick);
  }

  /** Pointer up, or pointer out of the control — both abort a hold in flight. */
  function end() {
    if (phase.value !== 'holding') return; // a completed hold outlives the release
    clear();
    phase.value = 'idle';
    progress.value = 0;
  }

  /** Losing the target cancels the guard outright, mid-hold or mid-SENT. */
  function reset() {
    clear();
    phase.value = 'idle';
    progress.value = 0;
  }

  /* A guard that pauses is a guard that lies. `requestAnimationFrame` stops in a
   * hidden tab, so a hold left running while the operator switches away would
   * freeze mid-arc and then resume from where it froze — reporting time that
   * never passed. Hiding aborts it instead. */
  function onVisibility() {
    if (document.visibilityState === 'hidden') end();
  }
  document.addEventListener('visibilitychange', onVisibility);

  onScopeDispose(() => {
    clear();
    document.removeEventListener('visibilitychange', onVisibility);
  });

  return { phase, progress, start, end, reset };
}
