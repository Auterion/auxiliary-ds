import { tv, type VariantProps } from 'tailwind-variants';

export const textarea = tv({
  base: 'w-full rounded-md bg-background border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed resize-y',
  variants: {
    // Shared size vocabulary (see sizes.ts). Textarea has no fixed height
    // (rows drives that), so size flexes padding + type only.
    size: {
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-3.5 py-2.5 text-base',
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
