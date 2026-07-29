import { tv } from 'tailwind-variants';

export const accordion = tv({
  slots: {
    root: 'w-full',
    item: 'border-b border-border last:border-b-0',
    header: 'flex',
    trigger:
      'flex flex-1 items-center justify-between py-(--component-accordion-padding-y) text-sm font-medium text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 ring-ring px-(--component-accordion-padding-x) [&[data-state=open]>svg]:rotate-180',
    chevron:
      'ms-(--component-accordion-chevron-margin-inline-start) size-(--component-accordion-icon-size) shrink-0 text-muted-foreground transition-transform duration-[var(--duration-base)]',
    content:
      'overflow-hidden text-sm text-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
    contentInner: 'pb-(--component-accordion-padding-y) px-(--component-accordion-padding-x)',
  },
});
