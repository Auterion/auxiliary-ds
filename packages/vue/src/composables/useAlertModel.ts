import {
  reactive,
  computed,
  getCurrentScope,
  onScopeDispose,
  type ComputedRef,
} from 'vue';
import { STATUS_RANK, type StatusKind } from '../primitives/status-glyphs';

/** What a consumer raises — the identity and current state of a *condition*. */
export interface AlertSource {
  /** Stable identity of the condition (re-raising the same id updates, not duplicates). */
  id: string;
  level: StatusKind;
  title?: string;
  message?: string;
  /** Category, for inhibit/suppress by group. */
  group?: string;
  /** Latch this alert (stay active after clear until acknowledged). Defaults per level. */
  latch?: boolean;
  /** Auto-escalate to a higher level if still active + unacknowledged after `afterMs`. */
  escalate?: { to: StatusKind; afterMs: number };
}

/** A managed alert in the model. */
export interface Alert {
  id: string;
  level: StatusKind;
  /** Level as first raised, before any escalation. */
  baseLevel: StatusKind;
  title?: string;
  message?: string;
  group?: string;
  latch: boolean;
  escalate?: { to: StatusKind; afterMs: number };
  /** Whether the underlying condition is currently asserted. */
  active: boolean;
  acknowledged: boolean;
  raisedAt: number;
  updatedAt: number;
  acknowledgedAt?: number;
}

export interface UseAlertModelOptions {
  /** Audible-cue hook — fired when an alert newly needs annunciation (raise of an unacked alert, or escalation). */
  onAnnunciate?: (alert: Alert) => void;
  /** Fired when an alert is acknowledged. */
  onAcknowledge?: (alert: Alert) => void;
  /** Decides which levels latch by default. Default: alarm + warning. */
  defaultLatch?: (level: StatusKind) => boolean;
  /** Injectable clock for deterministic tests. Default: `Date.now`. */
  now?: () => number;
}

export interface AlertModel {
  /** Visible (non-inhibited) alerts, sorted by priority. */
  alerts: ComputedRef<Alert[]>;
  /** The single most urgent visible alert, or null. */
  highest: ComputedRef<Alert | null>;
  /** Count of visible alerts per level. */
  counts: ComputedRef<Record<StatusKind, number>>;
  /** Count of visible unacknowledged alerts. */
  unacknowledged: ComputedRef<number>;
  raise: (source: AlertSource) => void;
  clear: (id: string) => void;
  acknowledge: (id: string) => void;
  acknowledgeAll: () => void;
  inhibit: (idOrGroup: string) => void;
  uninhibit: (idOrGroup: string) => void;
  isInhibited: (id: string) => boolean;
  reset: () => void;
  dispose: () => void;
}

/** Severity-then-unacked-then-recency ordering. Lower rank = more urgent. */
export function compareAlerts(a: Alert, b: Alert): number {
  return (
    STATUS_RANK[a.level] - STATUS_RANK[b.level] ||
    Number(a.acknowledged) - Number(b.acknowledged) ||
    a.raisedAt - b.raisedAt
  );
}

const ALL_LEVELS: StatusKind[] = ['alarm', 'warning', 'caution', 'advisory', 'nominal'];

/**
 * Headless operational alert model — *alerting as a model, not a banner*.
 * Manages a prioritized set of alerts with acknowledgment, latching, escalation,
 * inhibit/suppress, and audible-cue hooks. Composed by `<AlertManager>` /
 * `<AlertAnnunciator>`; never modifies the base `AlertBanner`/`StatusBadge`.
 */
export function useAlertModel(options: UseAlertModelOptions = {}): AlertModel {
  const store = reactive(new Map<string, Alert>());
  const inhibitions = reactive(new Set<string>());
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const now = options.now ?? (() => Date.now());
  const defaultLatch = options.defaultLatch ?? ((l: StatusKind) => l === 'alarm' || l === 'warning');

  function isInhibited(id: string): boolean {
    const a = store.get(id);
    if (!a) return inhibitions.has(id);
    return inhibitions.has(a.id) || (a.group != null && inhibitions.has(a.group));
  }

  function clearTimer(id: string): void {
    const t = timers.get(id);
    if (t != null) {
      clearTimeout(t);
      timers.delete(id);
    }
  }

  function annunciate(alert: Alert): void {
    if (!alert.acknowledged && !isInhibited(alert.id)) options.onAnnunciate?.(alert);
  }

  function scheduleEscalation(alert: Alert): void {
    clearTimer(alert.id);
    if (!alert.escalate || alert.acknowledged || !alert.active || isInhibited(alert.id)) return;
    const { to, afterMs } = alert.escalate;
    const handle = setTimeout(() => {
      timers.delete(alert.id);
      const a = store.get(alert.id);
      if (!a || a.acknowledged || !a.active) return;
      a.level = to;
      a.updatedAt = now();
      a.escalate = undefined; // one-shot — never re-fire
      annunciate(a);
    }, afterMs);
    timers.set(alert.id, handle);
  }

  function raise(source: AlertSource): void {
    const t = now();
    const latch = source.latch ?? defaultLatch(source.level);
    const existing = store.get(source.id);
    if (existing) {
      existing.level = source.level;
      existing.baseLevel = source.level;
      existing.title = source.title;
      existing.message = source.message;
      existing.group = source.group;
      existing.latch = latch;
      existing.escalate = source.escalate;
      existing.active = true;
      existing.updatedAt = t;
      // A re-asserted condition is a fresh event — drop any prior acknowledgment.
      existing.acknowledged = false;
      existing.acknowledgedAt = undefined;
      scheduleEscalation(existing);
      annunciate(existing);
      return;
    }
    const alert: Alert = {
      id: source.id,
      level: source.level,
      baseLevel: source.level,
      title: source.title,
      message: source.message,
      group: source.group,
      latch,
      escalate: source.escalate,
      active: true,
      acknowledged: false,
      raisedAt: t,
      updatedAt: t,
    };
    store.set(alert.id, alert);
    scheduleEscalation(alert);
    annunciate(alert);
  }

  function clear(id: string): void {
    const a = store.get(id);
    if (!a) return;
    clearTimer(id);
    if (a.latch && !a.acknowledged) {
      // Latched: keep it visible (condition gone, but unacknowledged) until ack.
      a.active = false;
      a.updatedAt = now();
    } else {
      store.delete(id);
    }
  }

  function acknowledge(id: string): void {
    const a = store.get(id);
    if (!a || a.acknowledged) return;
    a.acknowledged = true;
    a.acknowledgedAt = now();
    clearTimer(id); // stop escalation once acknowledged
    options.onAcknowledge?.(a);
    // Acked + already cleared (a latched condition that has since gone) → resolved.
    if (!a.active) store.delete(id);
  }

  function acknowledgeAll(): void {
    for (const id of [...store.keys()]) {
      if (!isInhibited(id)) acknowledge(id);
    }
  }

  function inhibit(idOrGroup: string): void {
    inhibitions.add(idOrGroup);
    // Pause escalation for anything now inhibited.
    for (const [id] of store) {
      if (isInhibited(id)) clearTimer(id);
    }
  }

  function uninhibit(idOrGroup: string): void {
    inhibitions.delete(idOrGroup);
    // Resume escalation for anything that became visible again.
    for (const alert of store.values()) {
      if (!isInhibited(alert.id)) scheduleEscalation(alert);
    }
  }

  function reset(): void {
    for (const id of [...timers.keys()]) clearTimer(id);
    store.clear();
    inhibitions.clear();
  }

  function dispose(): void {
    for (const id of [...timers.keys()]) clearTimer(id);
  }

  const alerts = computed(() =>
    [...store.values()].filter((a) => !isInhibited(a.id)).sort(compareAlerts),
  );
  const highest = computed(() => alerts.value[0] ?? null);
  const counts = computed(() => {
    const out: Record<StatusKind, number> = { alarm: 0, warning: 0, caution: 0, advisory: 0, nominal: 0 };
    for (const a of alerts.value) out[a.level] += 1;
    return out;
  });
  const unacknowledged = computed(() => alerts.value.filter((a) => !a.acknowledged).length);

  if (getCurrentScope()) onScopeDispose(dispose);

  return {
    alerts,
    highest,
    counts,
    unacknowledged,
    raise,
    clear,
    acknowledge,
    acknowledgeAll,
    inhibit,
    uninhibit,
    isInhibited,
    reset,
    dispose,
  };
}

export { ALL_LEVELS as ALERT_LEVELS };
