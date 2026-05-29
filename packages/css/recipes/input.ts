import { tv, type VariantProps } from 'tailwind-variants';

export const input = tv({
  base: 'w-full rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
  variants: {
    // Shared size vocabulary (see sizes.ts) — keeps a "md" input the same rung
    // as a "md" button. Drives height/padding/type so dense GCS layouts can
    // shrink fields without hand-rolled classes.
    size: {
      sm: 'h-8 px-2.5 text-sm',
      md: 'h-9 px-3 text-sm',
      lg: 'h-10 px-3.5 text-base',
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
