import { tv } from 'tailwind-variants';

export const card = tv({
  slots: {
    root: 'rounded-md border border-border bg-card text-foreground',
    header: 'flex flex-col gap-1 px-5 pt-5',
    title: 'text-base font-medium leading-tight',
    description: 'text-sm text-muted-foreground',
    content: 'px-5 py-4',
    footer: 'flex items-center gap-2 border-t border-border px-5 py-3',
  },
});
