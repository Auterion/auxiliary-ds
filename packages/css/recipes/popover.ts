import { tv } from 'tailwind-variants';

export const popover = tv({
  slots: {
    content:
      'z-[var(--z-dropdown)] w-(--component-popover-width) rounded-(--component-popover-radius) border border-border bg-popover p-(--component-popover-padding) text-sm text-popover-foreground shadow-md outline-none focus-visible:ring-2 ring-ring',
  },
});
