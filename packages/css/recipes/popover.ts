import { tv } from 'tailwind-variants';

export const popover = tv({
  slots: {
    content:
      'z-[var(--z-dropdown)] w-72 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md outline-none focus-visible:ring-2 ring-ring',
  },
});
