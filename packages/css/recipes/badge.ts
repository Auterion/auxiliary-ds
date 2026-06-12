import { tv, type VariantProps } from 'tailwind-variants';

export const badge = tv({
  base: 'inline-flex items-center gap-1 rounded font-medium',
  variants: {
    variant: {
      // `neutral` (not `default`) — says what it looks like; `primary` (not
      // `accent`) — it IS the primary treatment, matching Button's vocabulary.
      neutral:   'bg-muted text-foreground border border-border',
      secondary: 'bg-card text-muted-foreground border border-border',
      outline:   'border border-border text-muted-foreground',
      primary:   'bg-primary text-primary-foreground',
    },
    size: {
      sm: 'h-5 px-1.5 text-2xs',
      md: 'h-6 px-2 text-xs',
    },
  },
  defaultVariants: {
    variant: 'neutral',
    size: 'md',
  },
});

export type BadgeVariants = VariantProps<typeof badge>;
