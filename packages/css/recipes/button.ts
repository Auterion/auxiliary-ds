import { tv, type VariantProps } from 'tailwind-variants';

export const button = tv({
  base: [
    'inline-flex items-center justify-center gap-2',
    'rounded-md font-medium',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 ring-ring',
    'disabled:opacity-50 disabled:pointer-events-none',
  ].join(' '),
  variants: {
    variant: {
      primary:   'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
      ghost:     'text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
      danger:    'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
    },
    // Control height is register-flex (ROADMAP §6g): the rungs resolve from
    // --control-height-* (32/36/40 expressive → 28/32/36 operational) instead
    // of fixed h-8/9/10, so [data-register="operational"] tightens controls.
    // The max(…, --target-floor) wraps the touch floor (ROADMAP § Input modality
    // & touch): --target-floor is 0 normally and 44px under a coarse pointer, so
    // the control never falls below a 44px touch target — winning over register.
    size: {
      sm: 'h-[max(var(--control-height-sm),var(--target-floor))] px-3 text-sm',
      md: 'h-[max(var(--control-height-md),var(--target-floor))] px-4 text-sm',
      lg: 'h-[max(var(--control-height-lg),var(--target-floor))] px-6 text-base',
    },
    loading: {
      true: 'opacity-80 pointer-events-none',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonVariants = VariantProps<typeof button>;
