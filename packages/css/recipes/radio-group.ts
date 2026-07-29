import { tv, type VariantProps } from 'tailwind-variants';

export const radioGroup = tv({
  slots: {
    root: 'flex gap-(--component-radio-group-gap)',
    item: 'flex size-(--component-radio-group-item-size) shrink-0 items-center justify-center rounded-full border border-input bg-background outline-none focus-visible:ring-2 ring-ring disabled:opacity-(--opacity-disabled) disabled:cursor-not-allowed data-[state=checked]:border-primary',
    indicator: 'flex items-center justify-center',
    dot: 'size-(--component-radio-group-dot-size) rounded-full bg-primary',
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
