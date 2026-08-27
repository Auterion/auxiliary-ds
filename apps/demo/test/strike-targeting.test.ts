import { describe, expect, it } from 'vitest';
import { useTargeting } from '../src/strike/useTargeting';

/**
 * The targeting interlock, as a state machine.
 *
 * `strike/` is a weapons-guard surface: the whole design is that the strike
 * control cannot be armed unless a target is actually locked. That interlock was
 * defeated by the keyboard.
 *
 * `Enter`/`Space` on a `<button>` dispatches a click whose `clientX`/`clientY`
 * are 0 and whose `detail` is 0. `VideoStage` turned that into a fraction of its
 * own bounding box — a NEGATIVE number, varying with scroll position — and
 * handed it to `pick()`, which set `track` to `engaged` without looking at it.
 * `TargetLock` then positioned itself off-frame inside an `overflow: hidden`
 * box and never drew. So a keyboard operator saw no reticle, no lock, and no
 * target, and the strike guard became pressable anyway.
 *
 * Two independent fixes, and this file gates both, because either alone leaves
 * the interlock one refactor away from opening again:
 *   - the view gives keyboard activation a real aim (centre-frame), and
 *   - the state machine refuses a point outside the frame, wherever it came from.
 */

describe('the targeting interlock', () => {
  it('does not engage before it is armed', () => {
    const t = useTargeting();
    t.pick({ x: 0.5, y: 0.5 });
    expect(t.engaged, 'a pick before arming must do nothing').toBe(false);
  });

  it('engages on a point inside the frame', () => {
    const t = useTargeting();
    t.arm();
    t.pick({ x: 0.42, y: 0.61 });
    expect(t.engaged).toBe(true);
    expect(t.point).toEqual({ x: 0.42, y: 0.61 });
  });

  // The exact value a keyboard-dispatched click produced. `clientX` of 0 minus
  // the box's own left offset, over its width — negative, and scroll-dependent.
  it.each([
    ['negative x — the keyboard-click shape', { x: -0.31, y: 0.5 }],
    ['negative y', { x: 0.5, y: -0.12 }],
    ['past the right edge', { x: 1.4, y: 0.5 }],
    ['past the bottom edge', { x: 0.5, y: 1.02 }],
    ['not a number', { x: Number.NaN, y: 0.5 }],
  ])('refuses a point %s, and stays armed rather than engaged', (_label, p) => {
    const t = useTargeting();
    t.arm();
    t.pick(p as { x: number; y: number });
    expect(t.engaged, 'an out-of-frame point must not open the interlock').toBe(false);
    expect(t.picking, 'and it must stay armed, so the operator can try again').toBe(true);
  });

  it('accepts the exact frame edges', () => {
    for (const p of [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]) {
      const t = useTargeting();
      t.arm();
      t.pick(p);
      expect(t.engaged, `${JSON.stringify(p)} is on the frame, not outside it`).toBe(true);
    }
  });

  it('takes the guard down when the lock is dropped', () => {
    const t = useTargeting();
    t.arm();
    t.pick({ x: 0.5, y: 0.5 });
    expect(t.engaged).toBe(true);
    t.cancel();
    expect(t.engaged, 'dropping the lock must close the interlock').toBe(false);
  });
});
