---
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

Phase 6.3 (Defense layer) — alert model: "alerting as a model, not a banner" (ROADMAP §6i).

A C2/GCS surface manages a *set* of safety conditions over time, not one banner. This adds the headless
model plus two rendering surfaces that **compose** the existing `AlertBanner` / `StatusBadge` without
modifying them.

- **`@auxiliary/vue`** — `useAlertModel()`: a headless state machine with **prioritization** (severity →
  unacked → recency), **acknowledgment** (per-alert + `acknowledgeAll`), **latching** (alarm/warning latch
  past clear until acked, by ISA-18.2 convention; per-alert override), **escalation** (auto-bump after a
  window if still active+unacked), **inhibit/suppress** (by id or group), and **audible-cue hooks**
  (`onAnnunciate`/`onAcknowledge` — the DS ships no audio). Plus `<AlertManager>` (prioritized, keyed,
  acknowledge-able banner stack with `max`/"+N more" overflow) and `<AlertAnnunciator>` (compact highest-level
  + active-count summary). Re-asserting an acknowledged condition is treated as a fresh event; keyed banners
  avoid re-announce storms.
- **`@auxiliary/css`** — `alertManager` recipe (layout only; reuses existing tokens, no new variant vocabulary).

a11y: the manager owns a **single polite live region** (banners opt out of their own `role="alert"`) to
avoid a re-announce storm; acknowledged state is named for assistive tech, not opacity-only; the annunciator
keeps a stable action name and mirrors status changes into a polite live region.

Additive and opt-in: `AlertBanner` gains an additive `live` prop (default `true` → unchanged standalone
behavior); `status-glyphs.ts` gains a `STATUS_RANK` constant. `StatusBadge` is untouched.
