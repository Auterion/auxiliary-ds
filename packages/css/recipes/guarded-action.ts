import { tv, type VariantProps } from 'tailwind-variants';

/**
 * GuardedAction — a deliberate, hard-to-misfire control for irreversible
 * operational commands (arm/disarm, RTL, payload release). ROADMAP §6i / 6.3.
 *
 * It is NOT a restyle of Button: it adds a guard interaction (hold / double /
 * confirm) and a progress fill. But it deliberately REUSES Button's variant
 * vocabulary and the register-flex `--control-height-*` size rungs so the look
 * stays consistent and we don't invent a second variant axis (component pattern 1).
 *
 * The `fill` slot is an absolutely-positioned overlay whose width is driven by
 * JS state (not a CSS transition) so it advances identically under
 * `prefers-reduced-motion` — progress is functional feedback, not decoration.
 */
export const guardedAction = tv({
  slots: {
    // `relative`/`overflow-hidden` clip the fill; `select-none` so a press-hold
    // doesn't start a text selection. `isolate` keeps the fill behind the label.
    // Plain `outline-none` (not focus-visible:) so the armed outline below can
    // win unconditionally — focus is carried entirely by the ring channel.
    root: [
      'relative isolate overflow-hidden select-none',
      'inline-flex items-center justify-center gap-2',
      'rounded-md font-medium',
      'transition-colors',
      'outline-none focus-visible:ring-2 ring-ring focus-visible:ring-offset-2 ring-offset-background',
      'disabled:opacity-50 disabled:pointer-events-none',
    ].join(' '),
    // Solid currentColor progress bar along the bottom edge, out from under the
    // label: the variant's paired -foreground is token-gated against its fill
    // (4.76–7.26:1 in every theme), whereas the old full-height bg-current/25
    // wash measured 1.2–2.2:1 — invisible progress on a safety-critical hold.
    // `pointer-events-none` so it never eats the press; width is set inline
    // from component state (JS-driven, so reduced-motion can't desync it).
    fill: 'pointer-events-none absolute bottom-0 left-0 h-[3px] bg-current',
    label: 'inline-flex items-center gap-2',
    // confirm-mode inline confirm/cancel pair
    confirmRow: 'inline-flex items-center gap-1.5',
  },
  variants: {
    // Same colour treatment as Button — danger is the default since these are
    // dangerous commands. The solid `bg-current` fill bar reads correctly on
    // every variant because each pairs its fill with a gated -foreground.
    variant: {
      primary: { root: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80' },
      secondary: { root: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70' },
      ghost: { root: 'text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80' },
      danger: { root: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80' },
    },
    // Register-flex height via --control-height-* (ROADMAP §6g) — identical rungs
    // to Button so guarded controls line up with ordinary ones and tighten under
    // [data-register="operational"].
    size: {
      sm: { root: 'h-[max(var(--control-height-sm),var(--target-floor))] px-3 text-sm' },
      md: { root: 'h-[max(var(--control-height-md),var(--target-floor))] px-4 text-sm' },
      lg: { root: 'h-[max(var(--control-height-lg),var(--target-floor))] px-6 text-base' },
    },
    // While armed/holding, draw a destructive outline — its own CSS channel,
    // so it can't collide with the focus ring (Tailwind ring utilities share
    // one box-shadow slot; the old `ring-2 ring-ring` made armed and focused
    // indistinguishable, and `ring` is contractually the focus role).
    // `destructive` vs background is gated ≥3:1 in every theme, and "armed"
    // means a destructive action is imminent — the hue is the message.
    armed: {
      true: { root: 'outline-solid outline-2 outline-offset-2 outline-destructive' },
    },
  },
  defaultVariants: {
    variant: 'danger',
    size: 'md',
  },
});

export type GuardedActionVariants = VariantProps<typeof guardedAction>;
