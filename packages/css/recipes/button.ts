import { tv, type VariantProps } from 'tailwind-variants';

export const button = tv({
  base: [
    'inline-flex items-center justify-center gap-2',
    'rounded-md font-medium',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 ring-focus',
    'disabled:opacity-50 disabled:pointer-events-none',
  ].join(' '),
  variants: {
    intent: {
      primary:   'bg-accent text-accent-fg hover:bg-accent-hover',
      secondary: 'bg-muted text-primary hover:bg-hover',
      ghost:     'text-primary hover:bg-hover',
      danger:    'bg-alarm text-alarm border border-alarm hover:opacity-90',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-6 text-base',
    },
    loading: {
      true: 'opacity-80 pointer-events-none',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
});

export type ButtonVariants = VariantProps<typeof button>;
