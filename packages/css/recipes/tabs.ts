import { tv } from 'tailwind-variants';

export const tabs = tv({
  slots: {
    list: 'inline-flex h-9 items-center gap-1 rounded-md border border-border bg-card p-1',
    trigger:
      'inline-flex h-7 items-center justify-center rounded px-3 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 ring-ring focus-visible:ring-offset-2 ring-offset-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed',
    content: 'mt-4 outline-none focus-visible:ring-2 ring-ring',
  },
});
