import { tv, type VariantProps } from 'tailwind-variants';

export const spinner = tv({
  slots: {
    root: 'inline-flex items-center',
    icon: 'animate-spin text-current',
  },
  variants: {
    size: {
      sm: { icon: 'size-(--component-spinner-size-sm)' },
      md: { icon: 'size-(--component-spinner-size-md)' },
      lg: { icon: 'size-(--component-spinner-size-lg)' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type SpinnerVariants = VariantProps<typeof spinner>;
