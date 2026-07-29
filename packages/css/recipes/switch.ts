import { tv, type VariantProps } from 'tailwind-variants';

// `switch` is a reserved word, so the recipe is exported as `switchControl`.
//
// The checked thumb travel is DERIVED, never a token: track − thumb − 2 × offset
// (36 − 14 − 2×2 = 18px today). Expressed as a calc() over the three component
// vars so it re-solves itself if any of them moves, instead of desyncing.
export const switchControl = tv({
  slots: {
    root: 'relative inline-flex h-(--component-switch-track-height) w-(--component-switch-track-width) shrink-0 items-center rounded-full border border-input bg-input outline-none data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:ring-2 ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:opacity-(--opacity-disabled) disabled:cursor-not-allowed transition-colors',
    thumb:
      'block size-(--component-switch-thumb-size) translate-x-(--component-switch-thumb-offset) rounded-full bg-background shadow-sm transition-transform data-[state=checked]:translate-x-[calc(var(--component-switch-track-width)-var(--component-switch-thumb-size)-2*var(--component-switch-thumb-offset))]',
  },
  variants: {
    // Validation: pairs with aria-invalid on the root (set in the component).
    invalid: {
      true: { root: 'border-destructive focus-visible:ring-destructive' },
    },
  },
});

export type SwitchVariants = VariantProps<typeof switchControl>;
