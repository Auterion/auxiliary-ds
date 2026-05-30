<script setup>
import { useAlertModel } from '@auxiliary/vue';

// A standing demo model, pre-seeded with a few conditions.
const demo = useAlertModel();
demo.raise({ id: 'fire', level: 'alarm', title: 'Engine 1 fire', message: 'Shut down engine 1.' });
demo.raise({ id: 'gps', level: 'caution', title: 'GPS degraded', message: 'Switched to dead reckoning.' });
demo.raise({ id: 'wind', level: 'advisory', title: 'Crosswind 18 kn' });

// A second model wired to live buttons.
const live = useAlertModel();
let n = 0;
function raiseRandom() {
  const levels = ['advisory', 'caution', 'warning', 'alarm'];
  const level = levels[n % levels.length];
  live.raise({ id: `c${n}`, level, title: `${level} event ${n}` });
  n++;
}
</script>

# Alert model

Operational alerting is **a model, not a banner**. A C2 / GCS surface doesn't show one alert — it manages a *set* of conditions over time: prioritized, acknowledgeable, latching, escalating, suppressible. `useAlertModel()` is that headless state machine; `<AlertManager>` and `<AlertAnnunciator>` render it by **composing** the existing [`AlertBanner`](/components/alert-banner) and [`StatusBadge`](/components/status-badge) — they never replace or modify them.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 1rem;">
  <AlertAnnunciator :model="demo" />
  <AlertManager :model="demo" />
</div>

## The model

```ts
import { useAlertModel } from '@auxiliary/vue';

const alerts = useAlertModel({
  onAnnunciate: (a) => playTone(a.level),   // audible-cue hook (the DS ships no sound)
});

alerts.raise({ id: 'eng1-fire', level: 'alarm', title: 'Engine 1 fire' });
alerts.clear('eng1-fire');        // condition gone (latched alarms persist until acked)
alerts.acknowledge('eng1-fire');  // operator ack
```

`raise` is **keyed by `id`** — re-raising the same condition updates it rather than stacking duplicates, and re-asserting a previously-acknowledged condition is treated as a fresh event. The model exposes reactive `alerts` (prioritized), `highest`, `counts`, and `unacknowledged`, plus `acknowledgeAll`, `inhibit` / `uninhibit`, `reset`, and `dispose`.

## Prioritization

`alerts` is sorted by severity (`alarm → warning → caution → advisory → nominal`), then unacknowledged-first, then recency. `highest` is the top of that list — what the annunciator surfaces.

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
    <Button variant="secondary" size="sm" @click="raiseRandom()">Raise alert</Button>
    <Button variant="secondary" size="sm" @click="live.acknowledgeAll()">Acknowledge all</Button>
    <Button variant="ghost" size="sm" @click="live.reset()">Reset</Button>
  </div>
  <AlertManager :model="live" :max="4" />
</div>

## Latching

By convention (ISA-18.2 / aviation), **alarm and warning latch**: they stay visible after the condition clears until an operator acknowledges them, so a transient critical fault can't be missed. Caution / advisory / nominal auto-clear. Override per alert with `latch`.

```ts
alerts.raise({ id: 'overspeed', level: 'caution', latch: true });  // force a caution to latch
```

## Escalation

An alert can auto-escalate if it stays active and unacknowledged too long:

```ts
alerts.raise({
  id: 'batt-low',
  level: 'caution',
  escalate: { to: 'warning', afterMs: 30_000 },  // caution → warning after 30 s unacked
});
```

Acknowledging (or clearing) before the window cancels the escalation. Escalation re-fires the `onAnnunciate` hook.

## Inhibit / suppress

Silence a noisy condition or a whole category (by `group`) without losing the record — useful during a known maneuver. Inhibited alerts drop out of `alerts`, stop annunciating, and pause escalation until `uninhibit`.

```ts
alerts.raise({ id: 'prox-1', level: 'caution', group: 'proximity' });
alerts.inhibit('proximity');   // suppress the whole group
alerts.uninhibit('proximity'); // restore
```

## AlertManager

<PropsTable name="AlertManager" />

Renders `model.alerts` as a prioritized, keyed stack of `<AlertBanner>`s. Each unacknowledged banner carries an **Acknowledge** action; a header offers **Acknowledge all**. `max` caps the stack and summarises the rest as "+N more" — never silently truncated.

## AlertAnnunciator

<PropsTable name="AlertAnnunciator" />

A compact, at-a-glance summary — the highest active level (as a `StatusBadge`) plus the active count, or a resting "All nominal". Emits `select` on click, for wiring a "jump to alerts" affordance. Put it in a top bar; put the `<AlertManager>` in a panel.

## Accessibility

- The stack owns a **single polite live region** (`role="log"`); each banner opts out of its own `role="alert"` (`AlertBanner`'s additive `:live="false"`). Acknowledging or reordering one alert therefore doesn't re-announce the whole backlog — only genuine additions and the acknowledged-state cue are spoken.
- **Acknowledged is named, not just dimmed**: an acked banner carries a visually-hidden "Acknowledged" cue, so the state reaches a screen-reader user (not opacity alone).
- The **annunciator** keeps a stable action name (`aria-label="View alerts"`) and mirrors the changing status (highest level + count) into a polite live region, so an escalation is announced without the control being read as two unrelated things.
- Severity is **never color-only**: the banner/badge carry a grayscale-distinct glyph and an always-present visually-hidden level label, and the annunciator shows the alert count beside the badge (WCAG 1.4.1).
- The **audible cue is a hook, not a sound** — `onAnnunciate` lets the host play an annunciation tone; the design system ships no audio and makes no assumption about it.
- Acknowledgment is an explicit operator action (a focusable button), never automatic.

## When to use

- For **operational consoles** that surface multiple, evolving safety conditions — a GCS, mission control, a vehicle health panel.
- When alerts must be **acknowledged**, **latched**, **prioritized**, or **escalated** — anything beyond a single transient message.

## When *not* to use

- For a **single, static** alert — use [`AlertBanner`](/components/alert-banner) directly.
- For **transient, dismissible notifications** (saved, copied, undo) — use [`Toast`](/components/toast).
- For a **steady-state indicator** of one thing's status — use [`StatusBadge`](/components/status-badge).
