import { tv } from 'tailwind-variants';

export const card = tv({
  slots: {
    root: 'rounded-(--component-card-radius) border border-border bg-card text-card-foreground',
    header:
      'flex flex-col gap-(--component-card-header-gap) px-(--component-card-padding-x) pt-(--component-card-header-padding-top)',
    title: 'text-base font-medium leading-tight',
    description: 'text-sm text-muted-foreground',
    content: 'px-(--component-card-padding-x) py-(--component-card-content-padding-y)',
    footer:
      'flex items-center gap-(--component-card-footer-gap) border-t border-border px-(--component-card-padding-x) py-(--component-card-footer-padding-y)',
  },
});
