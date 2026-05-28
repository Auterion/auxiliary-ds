import { tv } from 'tailwind-variants';

export const input = tv({
  base: 'h-9 w-full rounded-md bg-background border border-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
});
