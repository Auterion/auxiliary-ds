import { tv, type VariantProps } from 'tailwind-variants';

export const separator = tv({
  base: 'bg-transparent',
  variants: {
    orientation: {
      horizontal: 'border-t border-border h-px w-full',
      vertical:   'border-l border-border w-px h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export type SeparatorVariants = VariantProps<typeof separator>;
