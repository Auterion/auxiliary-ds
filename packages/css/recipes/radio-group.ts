import { tv, type VariantProps } from 'tailwind-variants';

export const radioGroup = tv({
  slots: {
    root: 'flex gap-2',
    item: 'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-input bg-background outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed data-[state=checked]:border-primary',
    indicator: 'flex items-center justify-center',
    dot: 'h-2 w-2 rounded-full bg-primary',
  },
  variants: {
    orientation: {
      horizontal: { root: 'flex-row' },
      vertical: { root: 'flex-col' },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export type RadioGroupVariants = VariantProps<typeof radioGroup>;
