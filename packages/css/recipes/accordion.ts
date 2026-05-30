import { tv } from 'tailwind-variants';

export const accordion = tv({
  slots: {
    root: 'w-full',
    item: 'border-b border-border last:border-b-0',
    header: 'flex',
    trigger:
      'flex flex-1 items-center justify-between py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 ring-ring px-1 [&[data-state=open]>svg]:rotate-180',
    chevron:
      'ml-2 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-base)]',
    content:
      'overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
    contentInner: 'pb-2 px-1',
  },
});
