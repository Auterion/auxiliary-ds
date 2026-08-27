import { tv, type VariantProps } from 'tailwind-variants';

export const button = tv({
  base: [
    'inline-flex items-center justify-center gap-(--component-button-gap)',
    'rounded-(--component-button-radius) font-medium',
    // Press feedback is the tactile half of a button and the library shipped only
    // the colour half, so every consumer either had no press state or hand-rolled
    // one (the demo has three different behaviours in a single row on the page
    // that documents the system). 0.96 is the value: below 0.95 reads exaggerated.
    // `transition-colors` is KEPT rather than replaced with an explicit property
    // list — swapping it would silently drop text-decoration-color, fill and
    // stroke from Tailwind's colors group. The colour shift stays as the static
    // cue, so the state is never carried by motion alone.
    'transition-colors transition-[scale] duration-150 ease-out',
    'active:not-disabled:scale-[0.96] motion-reduce:active:scale-100',
    'focus-visible:outline-none focus-visible:ring-2 ring-ring focus-visible:ring-offset-2 ring-offset-background',
    'disabled:opacity-(--opacity-disabled) disabled:pointer-events-none',
  ].join(' '),
  variants: {
    variant: {
      primary:   'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
      ghost:     'text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
      danger:    'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
    },
    // Geometry comes from the component tier, which redirects to the global
    // control-height and spacing scales — so [data-register="operational"] still
    // tightens the control (the component var is a var() reference, not a baked
    // literal, and the register block re-emits it).
    // The max(…, --target-floor) stays HERE and cannot move into the token: the
    // floor is re-declared by @media(pointer:coarse) and [data-input], neither of
    // which re-emits the component tier, so a token wrapping it would inherit its
    // :root value and silently ignore the touch floor.
    size: {
      sm: 'h-[max(var(--component-button-height-sm),var(--target-floor))] px-(--component-button-padding-x-sm) text-sm',
      md: 'h-[max(var(--component-button-height-md),var(--target-floor))] px-(--component-button-padding-x-md) text-sm',
      lg: 'h-[max(var(--component-button-height-lg),var(--target-floor))] px-(--component-button-padding-x-lg) text-base',
    },
    loading: {
      true: 'opacity-(--opacity-loading) pointer-events-none',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonVariants = VariantProps<typeof button>;
