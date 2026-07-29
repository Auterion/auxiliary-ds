import { tv, type VariantProps } from 'tailwind-variants';

export const input = tv({
  base: 'w-full rounded-(--component-input-radius) bg-background border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring disabled:opacity-(--opacity-disabled) disabled:cursor-not-allowed',
  variants: {
    // Shared size vocabulary (see sizes.ts) — keeps a "md" input the same rung
    // as a "md" button. Height is register-flex via --control-height-* (ROADMAP
    // §6g): operational density shrinks fields automatically, no hand-rolled
    // classes.
    size: {
      sm: 'h-[max(var(--component-input-height-sm),var(--target-floor))] px-(--component-input-padding-x-sm) text-sm',
      md: 'h-[max(var(--component-input-height-md),var(--target-floor))] px-(--component-input-padding-x-md) text-sm',
      lg: 'h-[max(var(--component-input-height-lg),var(--target-floor))] px-(--component-input-padding-x-lg) text-base',
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
