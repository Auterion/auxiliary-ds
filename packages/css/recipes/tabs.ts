import { tv } from 'tailwind-variants';

export const tabs = tv({
  slots: {
    // No height of its own: the list is a container and derives its height from
    // its padding + border + the trigger it holds. The old `h-9` (36px) could not
    // hold 28 + 2×4 + 2×1 = 38px, so the trigger overflowed its own list by 2px.
    list: 'inline-flex items-center gap-(--component-tabs-list-gap) rounded-(--component-tabs-list-radius) border border-border bg-card p-(--component-tabs-list-padding)',
    trigger:
      'inline-flex h-(--component-tabs-trigger-height) items-center justify-center rounded-(--component-tabs-trigger-radius) px-(--component-tabs-trigger-padding-x) text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 ring-ring focus-visible:ring-offset-2 ring-offset-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-(--opacity-disabled) disabled:cursor-not-allowed',
    content: 'mt-(--component-tabs-content-margin-top) outline-none focus-visible:ring-2 ring-ring',
  },
});
