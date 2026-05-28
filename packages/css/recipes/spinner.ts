import { tv, type VariantProps } from 'tailwind-variants';

export const spinner = tv({
  slots: {
    root: 'inline-flex items-center',
    icon: 'animate-spin text-current',
  },
  variants: {
    size: {
      sm: { icon: 'h-3 w-3' },
      md: { icon: 'h-4 w-4' },
      lg: { icon: 'h-6 w-6' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type SpinnerVariants = VariantProps<typeof spinner>;
