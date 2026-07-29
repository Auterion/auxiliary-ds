import { tv } from 'tailwind-variants';

export const toast = tv({
  slots: {
    viewport:
      'fixed bottom-0 right-0 z-[var(--z-toast)] flex max-h-screen w-full flex-col gap-(--component-toast-viewport-gap) p-(--component-toast-viewport-padding) sm:max-w-(--component-toast-viewport-max-width) outline-none',
    root: 'grid grid-cols-[1fr_auto] items-start gap-(--component-toast-gap) rounded-(--component-toast-radius) border border-border bg-popover p-(--component-toast-padding) text-sm text-popover-foreground shadow-md outline-none focus-visible:ring-2 ring-ring',
    title: 'font-medium',
    description: 'mt-(--component-toast-description-margin-top) text-xs text-muted-foreground',
    action: '',
    close:
      'rounded-(--component-toast-close-radius) text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring [&>svg]:size-(--component-toast-close-icon-size)',
  },
});
