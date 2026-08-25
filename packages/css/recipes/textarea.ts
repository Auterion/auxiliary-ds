import { tv, type VariantProps } from 'tailwind-variants';

export const textarea = tv({
  base: 'w-full rounded-(--component-textarea-radius) bg-background border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring disabled:opacity-(--opacity-disabled) disabled:cursor-not-allowed resize-y',
  variants: {
    // Shared size vocabulary (see sizes.ts). Textarea has no fixed height
    // (rows drives that), so size flexes padding + type only.
    // The typed-text half of the coarse-pointer contract: --field-text-floor
    // raises these two rungs to 16px under a coarse pointer, because iOS Safari
    // zooms the page on focus below that and never zooms back out. Keyed on the
    // POINTER, not the viewport — the same axis --target-floor uses, and what
    // input-and-touch.md means by "touch sizing is about the pointer".
    size: {
      sm: 'px-(--component-textarea-padding-x-sm) py-(--component-textarea-padding-y-sm) text-[max(var(--text-sm),var(--field-text-floor))]',
      md: 'px-(--component-textarea-padding-x-md) py-(--component-textarea-padding-y-md) text-[max(var(--text-sm),var(--field-text-floor))]',
      lg: 'px-(--component-textarea-padding-x-lg) py-(--component-textarea-padding-y-lg) text-base',
    },
    invalid: {
      true: 'border-destructive focus-visible:ring-destructive',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type TextareaVariants = VariantProps<typeof textarea>;
