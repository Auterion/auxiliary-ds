import { tv, type VariantProps } from 'tailwind-variants';

export const avatar = tv({
  base: 'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground',
  variants: {
    size: {
      sm: 'size-(--component-avatar-size-sm) text-xs',
      md: 'size-(--component-avatar-size-md) text-sm',
      lg: 'size-(--component-avatar-size-lg) text-base',
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
