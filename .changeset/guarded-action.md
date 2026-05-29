---
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

Phase 6.3 (Defense layer, first slice) — add the `GuardedAction` primitive (ROADMAP §6i).

A deliberately hard-to-misfire control for irreversible operational commands (arm/disarm, RTL, payload
release), with three guard modes — `hold` (press-and-hold for `holdMs`), `double` (activate twice within
`doubleMs`), and `confirm` (reveal an inline Confirm/Cancel pair). The guarded `confirm` event is the only
"go" signal; `cancel` and `progress` round out the API.

- **`@auxiliary/css`** — new `guarded-action` recipe. Reuses Button's variant vocabulary and the
  register-flex `--control-height-*` size rungs (no second variant axis), plus a progress `fill` slot.
- **`@auxiliary/vue`** — new `<GuardedAction>` component. Keyboard-equivalent and **tap-proof** (a single
  Enter/Space press can never complete a hold — the synthetic click is suppressed); exposes a
  `role="progressbar"` + assertive live-region for non-visual progress; `disabled`/`loading` block every
  path. Progress is driven by component state rather than a CSS transition, so it is **reduced-motion-safe**.

Additive and opt-in per the 6.3 constraint — it composes `Button` and does not modify `Button`,
`AlertBanner`, or `StatusBadge`.
