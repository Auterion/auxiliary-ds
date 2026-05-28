import { tv } from 'tailwind-variants';

export const textarea = tv({
  base: 'w-full rounded-md bg-background border border-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed resize-y',
});
