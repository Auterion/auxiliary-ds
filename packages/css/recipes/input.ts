import { tv, type VariantProps } from 'tailwind-variants';

export const input = tv({
  base: 'w-full rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    // Shared size vocabulary (see sizes.ts) — keeps a "md" input the same rung
    // as a "md" button. Height is register-flex via --control-height-* (ROADMAP
    // §6g): operational density shrinks fields automatically, no hand-rolled
    // classes.
    size: {
      sm: 'h-[var(--control-height-sm)] px-2.5 text-sm',
      md: 'h-[var(--control-height-md)] px-3 text-sm',
      lg: 'h-[var(--control-height-lg)] px-3.5 text-base',
    },
    // Validation: pairs with aria-invalid on the element (set in the component).
    // The red border is the at-rest cue; the focus ring turns destructive too.
    invalid: {
      true: 'border-destructive focus-visible:ring-destructive',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type InputVariants = VariantProps<typeof input>;
