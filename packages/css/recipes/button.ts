import { tv, type VariantProps } from 'tailwind-variants';

export const button = tv({
  base: [
    'inline-flex items-center justify-center gap-2',
    'rounded-md font-medium',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 ring-ring',
    'disabled:opacity-50 disabled:pointer-events-none',
  ].join(' '),
  variants: {
    variant: {
      primary:   'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
      ghost:     'text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
      danger:    'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
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
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonVariants = VariantProps<typeof button>;
