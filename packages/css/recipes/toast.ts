import { tv } from 'tailwind-variants';

export const toast = tv({
  slots: {
    viewport:
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-6 sm:max-w-[420px] outline-none',
    root: 'grid grid-cols-[1fr_auto] items-start gap-3 rounded-md border border-border bg-popover p-4 text-sm text-foreground shadow-md outline-none focus-visible:ring-2 ring-ring',
    title: 'font-medium text-foreground',
    description: 'mt-1 text-xs text-muted-foreground',
    action: '',
    close:
      'rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring',
  },
});
