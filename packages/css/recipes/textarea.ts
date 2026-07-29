import { tv, type VariantProps } from 'tailwind-variants';

export const textarea = tv({
  base: 'w-full rounded-(--component-textarea-radius) bg-background border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring disabled:opacity-(--opacity-disabled) disabled:cursor-not-allowed resize-y',
  variants: {
    // Shared size vocabulary (see sizes.ts). Textarea has no fixed height
    // (rows drives that), so size flexes padding + type only.
    size: {
      sm: 'px-(--component-textarea-padding-x-sm) py-(--component-textarea-padding-y-sm) text-sm',
      md: 'px-(--component-textarea-padding-x-md) py-(--component-textarea-padding-y-md) text-sm',
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
