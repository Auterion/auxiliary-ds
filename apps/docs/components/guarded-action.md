# GuardedAction

A deliberately hard-to-misfire control for **irreversible operational commands** — arm/disarm, return-to-launch, payload release. A single stray click must never trigger one of these, so `GuardedAction` puts a guard between intent and action: hold it down, double-tap it, or confirm it. The guarded `confirm` event is the *only* "go" signal.

<div class="auxiliary-demo vp-raw" style="gap: 1rem;">
  <GuardedAction mode="hold" confirm-label="Hold to ARM">Arm</GuardedAction>
  <GuardedAction mode="double" variant="primary" confirm-label="Confirm RTL">Return to launch</GuardedAction>
  <GuardedAction mode="confirm" confirm-label="Release">Release payload</GuardedAction>
</div>

## When to use

- For commands that are **dangerous, irreversible, or safety-relevant** — anything where an accidental activation has real consequences (arm, disarm, RTL, jettison, abort).
- When you want the *physical effort* of the interaction to match the *gravity* of the command — a press-and-hold forces deliberate, sustained intent.
- On dense operator consoles where buttons sit close together and a mis-click is likely.

## When *not* to use

- For ordinary, reversible actions — use `<Button>`. Guarding a routine action just adds friction and trains operators to muscle through guards.
- As a generic confirmation dialog for destructive *data* operations (delete a row) — that's a `<Dialog>` with a confirm button.
- Do not wrap every dangerous-looking action; over-guarding erodes the signal. Reserve it for the genuine few.

## Modes

### Hold

Press and hold for `holdMs` (default 1500). Releasing early cancels. The fill shows progress; completion fires `confirm`. A single Enter/Space tap can never complete a hold — the key must be held.

<div class="auxiliary-demo vp-raw">
  <GuardedAction mode="hold" :hold-ms="1500" confirm-label="Hold to ARM">Arm</GuardedAction>
</div>

```vue
<GuardedAction mode="hold" :hold-ms="1500" variant="danger" confirm-label="Hold to ARM" @confirm="arm()">
  Arm
</GuardedAction>
```

### Double

Activate once to arm (the label switches to `confirmLabel`), then activate again within `doubleMs` (default 2000) to confirm. The window lapsing disarms and emits `cancel`.

<div class="auxiliary-demo vp-raw">
  <GuardedAction mode="double" variant="primary" confirm-label="Confirm RTL">Return to launch</GuardedAction>
</div>

```vue
<GuardedAction mode="double" confirm-label="Confirm RTL" @confirm="returnToLaunch()">
  Return to launch
</GuardedAction>
```

### Confirm

Activate to reveal an inline **Confirm / Cancel** pair — an explicit two-step commit with no timing pressure. Stays self-contained (no dialog).

<div class="auxiliary-demo vp-raw">
  <GuardedAction mode="confirm" confirm-label="Release">Release payload</GuardedAction>
</div>

```vue
<GuardedAction mode="confirm" confirm-label="Release" @confirm="releasePayload()">
  Release payload
</GuardedAction>
```

## Props

<PropsTable name="GuardedAction" />

It emits `confirm` (the guarded action fired — do the real work here), `cancel` (released early / window lapsed / dismissed), and `progress` with a `0..1` fraction during a hold.

## Accessibility

- The control is a native `<button>` — focusable, and `disabled`/`loading` block every guard path.
- **Hold is keyboard-equivalent and tap-proof:** holding Space/Enter starts the hold and releasing cancels it; the synthetic single-press click is suppressed, so a quick tap can never confirm.
- During a hold, a visually-hidden `role="progressbar"` exposes `aria-valuenow` so progress is perceivable non-visually, and an assertive live region announces milestones ("Hold to confirm" → "Confirmed" / "Cancelled").
- A static instruction is wired via `aria-describedby`; `double` mode reflects state with `aria-pressed`, `confirm` mode with `aria-expanded`.
- **Reduced-motion safe:** the progress fill is driven by component state, not a CSS transition, so completion is identical under `prefers-reduced-motion` — the guard never depends on perceiving animation.

## Tokens consumed

| Slot | Token |
| --- | --- |
| Surface / text (per `variant`) | `--destructive` · `--primary` · `--secondary` · `--accent` (+ `-foreground`) |
| Progress fill | `currentColor` @ 25% |
| Focus / armed ring | `--ring` |
| Control height | `--control-height-{sm,md,lg}` (register-flex) |
| Corner radius | `--radius-md` |
