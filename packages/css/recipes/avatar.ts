import { tv, type VariantProps } from 'tailwind-variants';

export const avatar = tv({
  base: 'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground',
  variants: {
    size: {
      sm: 'h-6 w-6 text-xs',
      md: 'h-8 w-8 text-sm',
      lg: 'h-10 w-10 text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type AvatarVariants = VariantProps<typeof avatar>;

export const avatarImage = tv({
  base: 'h-full w-full object-cover',
});

export const avatarFallback = tv({
  base: 'flex h-full w-full items-center justify-center font-medium uppercase tracking-wide',
});
