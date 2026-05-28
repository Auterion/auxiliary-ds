import { tv, type VariantProps } from 'tailwind-variants';

export const badge = tv({
  base: 'inline-flex items-center gap-1 rounded font-medium',
  variants: {
    variant: {
      default:   'bg-muted text-foreground border border-border',
      secondary: 'bg-card text-muted-foreground border border-border',
      outline:   'border border-border text-muted-foreground',
      accent:    'bg-primary text-primary-foreground',
    },
    size: {
      sm: 'h-5 px-1.5 text-[10px]',
      md: 'h-6 px-2 text-xs',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export type BadgeVariants = VariantProps<typeof badge>;
