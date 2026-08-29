/**
 * The track → strike interlock, shared by Turns 2 and 3.
 *
 * Three facts hold the whole exploration together, and they live here rather
 * than in either view so the two turns cannot quietly diverge:
 *
 *   1. Strike is unavailable without a lock. Not hidden — VISIBLY unavailable,
 *      with the reason on its face, because an operator who cannot find the
 *      strike control does not conclude "no target", they conclude "broken".
 *   2. Picking is a mode. Track arms, the feed takes a crosshair, one click
 *      locks. Arming is free to cancel; nothing has happened yet.
 *   3. Releasing the track releases the strike guard with it. A hold that
 *      survived its own target would be a hold against nothing.
 */
import { computed, reactive, ref } from 'vue';
import { useHold } from './useHold';

export type TrackState = 'enabled' | 'armed' | 'engaged';
export interface TargetPoint {
  x: number;
  y: number;
}

export function useTargeting() {
  const track = ref<TrackState>('enabled');
  const point = ref<TargetPoint | null>(null);
  const hold = useHold();

  const engaged = computed(() => track.value === 'engaged');
  const picking = computed(() => track.value === 'armed');

  function arm() {
    track.value = 'armed';
  }

  function cancel() {
    track.value = 'enabled';
  }

  /** Rule 3: dropping the lock takes the guard down with it. */
  function release() {
    track.value = 'enabled';
    point.value = null;
    hold.reset();
  }

  /** One handler for the plate, because the plate is one control in 3 states. */
  function toggle() {
    if (track.value === 'engaged') release();
    else if (track.value === 'armed') cancel();
    else arm();
  }

  function pick(p: TargetPoint) {
    if (track.value !== 'armed') return;
    // The caller computes a fraction from a bounding box; a bad one must not be
    // able to open the interlock. Checked HERE rather than only in the view, so
    // a second caller cannot reintroduce the same defect: an out-of-frame point
    // is not a target, and refusing it leaves `track` armed rather than engaged.
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
    if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) return;
    track.value = 'engaged';
    point.value = p;
  }

  /** OSD readout — the same three words the operator sees on the plate. */
  const trkReadout = computed(() =>
    engaged.value ? 'LOCK' : picking.value ? 'PICK' : '—',
  );

  /** Normalised frame coordinates, to the precision the tracker reports. */
  const coords = computed(() =>
    point.value ? `${point.value.x.toFixed(3)} / ${point.value.y.toFixed(3)}` : '—',
  );

  const feedLabel = computed(() =>
    picking.value ? 'Video feed — click to lock a target' : 'Video feed',
  );

  /* Returned `reactive` rather than as loose refs: the three turns each hold
   * one of these as a single object, and a template reading `t3.picking` should
   * get the boolean, not a ref it has to remember to unwrap. */
  return reactive({
    track,
    point,
    hold,
    engaged,
    picking,
    arm,
    cancel,
    release,
    toggle,
    pick,
    trkReadout,
    coords,
    feedLabel,
  });
}
