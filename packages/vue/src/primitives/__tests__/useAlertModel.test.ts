import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { effectScope } from 'vue';
import { useAlertModel, compareAlerts, type Alert } from '../../composables/useAlertModel';

/** Run the model inside an effect scope so onScopeDispose has somewhere to land. */
function withModel<T>(fn: (m: ReturnType<typeof useAlertModel>) => T, opts = {}): T {
  const scope = effectScope();
  const result = scope.run(() => fn(useAlertModel(opts)))!;
  scope.stop();
  return result;
}

describe('useAlertModel', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  describe('raise / clear', () => {
    it('raises a new alert as active + unacknowledged', () => {
      withModel((m) => {
        m.raise({ id: 'gps', level: 'caution', title: 'GPS degraded' });
        expect(m.alerts.value).toHaveLength(1);
        expect(m.alerts.value[0]).toMatchObject({ id: 'gps', active: true, acknowledged: false });
      });
    });

    it('re-raising the same id updates rather than duplicates', () => {
      withModel((m) => {
        m.raise({ id: 'gps', level: 'caution' });
        m.raise({ id: 'gps', level: 'warning', title: 'GPS lost' });
        expect(m.alerts.value).toHaveLength(1);
        expect(m.alerts.value[0]?.level).toBe('warning');
      });
    });

    it('a non-latching alert is removed when its condition clears', () => {
      withModel((m) => {
        m.raise({ id: 'gps', level: 'advisory' }); // advisory does not latch
        m.clear('gps');
        expect(m.alerts.value).toHaveLength(0);
      });
    });
  });

  describe('prioritization', () => {
    it('sorts by severity, then unacknowledged-first, then recency', () => {
      withModel((m) => {
        m.raise({ id: 'a', level: 'advisory' });
        m.raise({ id: 'b', level: 'alarm' });
        m.raise({ id: 'c', level: 'caution' });
        expect(m.alerts.value.map((x) => x.id)).toEqual(['b', 'c', 'a']);
        expect(m.highest.value?.id).toBe('b');
      });
    });

    it('exposes per-level counts and the unacknowledged total', () => {
      withModel((m) => {
        m.raise({ id: 'a', level: 'alarm' });
        m.raise({ id: 'b', level: 'alarm' });
        m.raise({ id: 'c', level: 'advisory' });
        m.acknowledge('c');
        expect(m.counts.value.alarm).toBe(2);
        expect(m.counts.value.advisory).toBe(1);
        expect(m.unacknowledged.value).toBe(2);
      });
    });
  });

  describe('latching (alarm + warning by default)', () => {
    it('keeps a latched alarm visible after clear until acknowledged', () => {
      withModel((m) => {
        m.raise({ id: 'fire', level: 'alarm', title: 'Engine fire' });
        m.clear('fire'); // condition gone, but latched + unacked → stays
        expect(m.alerts.value).toHaveLength(1);
        expect(m.alerts.value[0]).toMatchObject({ active: false, acknowledged: false });

        m.acknowledge('fire'); // acked + already cleared → resolved, drops
        expect(m.alerts.value).toHaveLength(0);
      });
    });

    it('does not latch caution/advisory unless asked', () => {
      withModel((m) => {
        m.raise({ id: 'x', level: 'caution' });
        m.clear('x');
        expect(m.alerts.value).toHaveLength(0);
      });
    });

    it('honors an explicit per-alert latch override', () => {
      withModel((m) => {
        m.raise({ id: 'x', level: 'advisory', latch: true });
        m.clear('x');
        expect(m.alerts.value).toHaveLength(1);
      });
    });

    it('re-raising a latched-cleared alert re-activates it', () => {
      withModel((m) => {
        m.raise({ id: 'fire', level: 'alarm' });
        m.clear('fire');
        expect(m.alerts.value[0]).toMatchObject({ active: false, acknowledged: false });
        m.raise({ id: 'fire', level: 'alarm' }); // condition re-asserts
        expect(m.alerts.value[0]).toMatchObject({ active: true, acknowledged: false });
      });
    });
  });

  describe('acknowledgment', () => {
    it('acknowledges an active alert in place (stays, but acked)', () => {
      withModel((m) => {
        m.raise({ id: 'a', level: 'warning' });
        m.acknowledge('a');
        expect(m.alerts.value[0]).toMatchObject({ active: true, acknowledged: true });
      });
    });

    it('acknowledgeAll clears the unacknowledged backlog', () => {
      withModel((m) => {
        m.raise({ id: 'a', level: 'warning' });
        m.raise({ id: 'b', level: 'caution' });
        m.acknowledgeAll();
        expect(m.unacknowledged.value).toBe(0);
      });
    });

    it('acknowledgeAll skips inhibited alerts', () => {
      withModel((m) => {
        m.raise({ id: 'a', level: 'warning' });
        m.raise({ id: 'b', level: 'caution' });
        m.inhibit('b');
        m.acknowledgeAll();
        m.uninhibit('b');
        // 'b' was suppressed during ack-all, so it stays unacknowledged.
        const b = m.alerts.value.find((x) => x.id === 'b')!;
        expect(b.acknowledged).toBe(false);
      });
    });

    it('a re-asserted condition drops a prior acknowledgment (fresh event)', () => {
      withModel((m) => {
        m.raise({ id: 'a', level: 'warning' });
        m.acknowledge('a');
        m.raise({ id: 'a', level: 'warning' });
        expect(m.alerts.value[0]?.acknowledged).toBe(false);
      });
    });
  });

  describe('escalation', () => {
    it('bumps the level after the window if still active + unacknowledged', () => {
      withModel((m) => {
        m.raise({ id: 'batt', level: 'caution', escalate: { to: 'warning', afterMs: 5000 } });
        expect(m.alerts.value[0]?.level).toBe('caution');
        vi.advanceTimersByTime(5000);
        expect(m.alerts.value[0]?.level).toBe('warning');
      });
    });

    it('cancels the escalation timer on acknowledge (not just guards the callback)', () => {
      withModel((m) => {
        m.raise({ id: 'batt', level: 'caution', escalate: { to: 'warning', afterMs: 5000 } });
        expect(vi.getTimerCount()).toBe(1);
        m.acknowledge('batt');
        // The timer itself is gone — proves clearTimer(), not merely the callback guard.
        expect(vi.getTimerCount()).toBe(0);
        vi.advanceTimersByTime(10000);
        expect(m.alerts.value[0]?.level).toBe('caution');
      });
    });

    it('cancels the escalation timer when a non-latching alert clears', () => {
      const onAnnunciate = vi.fn();
      withModel(
        (m) => {
          m.raise({ id: 'x', level: 'advisory', escalate: { to: 'caution', afterMs: 5000 } });
          m.clear('x'); // advisory does not latch → removed, timer must be cancelled
          expect(vi.getTimerCount()).toBe(0);
          vi.advanceTimersByTime(10000);
          expect(m.alerts.value).toHaveLength(0);
          expect(onAnnunciate).toHaveBeenCalledTimes(1); // raise only, never the escalation
        },
        { onAnnunciate },
      );
    });

    it('escalation is one-shot — it never re-fires on a repeating timer', () => {
      const onAnnunciate = vi.fn();
      withModel(
        (m) => {
          m.raise({ id: 'a', level: 'caution', escalate: { to: 'warning', afterMs: 1000 } });
          vi.advanceTimersByTime(1000);
          expect(onAnnunciate).toHaveBeenCalledTimes(2); // raise + escalation
          vi.advanceTimersByTime(100000); // far past — must not bump or annunciate again
          expect(onAnnunciate).toHaveBeenCalledTimes(2);
          expect(m.alerts.value[0]?.level).toBe('warning');
          expect(vi.getTimerCount()).toBe(0);
        },
        { onAnnunciate },
      );
    });
  });

  describe('inhibit / suppress', () => {
    it('hides an inhibited alert by id and restores it on uninhibit', () => {
      withModel((m) => {
        m.raise({ id: 'noise', level: 'caution' });
        m.inhibit('noise');
        expect(m.alerts.value).toHaveLength(0);
        m.uninhibit('noise');
        expect(m.alerts.value).toHaveLength(1);
      });
    });

    it('inhibits a whole group', () => {
      withModel((m) => {
        m.raise({ id: 'a', level: 'caution', group: 'sensors' });
        m.raise({ id: 'b', level: 'caution', group: 'sensors' });
        m.raise({ id: 'c', level: 'alarm' });
        m.inhibit('sensors');
        expect(m.alerts.value.map((x) => x.id)).toEqual(['c']);
      });
    });

    it('pauses escalation while inhibited and reschedules it on uninhibit', () => {
      withModel((m) => {
        m.raise({ id: 'x', level: 'caution', escalate: { to: 'warning', afterMs: 5000 } });
        m.inhibit('x');
        expect(vi.getTimerCount()).toBe(0); // timer paused
        vi.advanceTimersByTime(5000);

        m.uninhibit('x');
        expect(vi.getTimerCount()).toBe(1); // rescheduled
        vi.advanceTimersByTime(5000);
        expect(m.alerts.value[0]?.level).toBe('warning'); // escalation resumed
      });
    });
  });

  describe('lifecycle cleanup', () => {
    it('dispose() clears pending escalation timers', () => {
      const onAnnunciate = vi.fn();
      withModel(
        (m) => {
          m.raise({ id: 'x', level: 'caution', escalate: { to: 'warning', afterMs: 5000 } });
          expect(vi.getTimerCount()).toBe(1);
          m.dispose();
          expect(vi.getTimerCount()).toBe(0);
          vi.advanceTimersByTime(10000);
          expect(onAnnunciate).toHaveBeenCalledTimes(1); // raise only — escalation never fired
        },
        { onAnnunciate },
      );
    });

    it('stopping the effect scope disposes timers (onScopeDispose)', () => {
      const onAnnunciate = vi.fn();
      const scope = effectScope();
      const m = scope.run(() => useAlertModel({ onAnnunciate }))!;
      m.raise({ id: 'x', level: 'caution', escalate: { to: 'warning', afterMs: 5000 } });
      expect(vi.getTimerCount()).toBe(1);
      scope.stop(); // triggers onScopeDispose(dispose)
      expect(vi.getTimerCount()).toBe(0);
      vi.advanceTimersByTime(10000);
      expect(onAnnunciate).toHaveBeenCalledTimes(1);
    });
  });

  describe('audible-cue hook', () => {
    it('fires on a new raise and on escalation, but not on ack or inhibit', () => {
      const onAnnunciate = vi.fn();
      withModel(
        (m) => {
          m.raise({ id: 'a', level: 'caution', escalate: { to: 'warning', afterMs: 1000 } });
          expect(onAnnunciate).toHaveBeenCalledTimes(1); // raise

          vi.advanceTimersByTime(1000);
          expect(onAnnunciate).toHaveBeenCalledTimes(2); // escalation

          m.acknowledge('a');
          m.inhibit('a');
          expect(onAnnunciate).toHaveBeenCalledTimes(2); // neither ack nor inhibit annunciates
        },
        { onAnnunciate },
      );
    });

    it('does not annunciate a raise that is already inhibited', () => {
      const onAnnunciate = vi.fn();
      withModel(
        (m) => {
          m.inhibit('quiet');
          m.raise({ id: 'quiet', level: 'alarm' });
          expect(onAnnunciate).not.toHaveBeenCalled();
        },
        { onAnnunciate },
      );
    });
  });

  describe('compareAlerts', () => {
    it('orders alarm before nominal', () => {
      const mk = (level: Alert['level'], over: Partial<Alert> = {}): Alert => ({
        id: level, level, baseLevel: level, latch: false, active: true, acknowledged: false,
        raisedAt: 0, updatedAt: 0, ...over,
      });
      expect(compareAlerts(mk('alarm'), mk('nominal'))).toBeLessThan(0);
      expect(compareAlerts(mk('warning', { acknowledged: true }), mk('warning'))).toBeGreaterThan(0);
    });
  });
});
