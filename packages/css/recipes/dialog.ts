import { tv } from 'tailwind-variants';

export const dialog = tv({
  slots: {
    // The scrim fades; it does not slide or scale. One named animation per
    // direction (theme.css), not the shadcn `animate-in` + `fade-in-0` pair —
    // that vocabulary composes at the call site, which is what this layer avoids.
    overlay:
      'fixed inset-0 z-[var(--z-overlay)] bg-overlay backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
    content:
      'fixed left-1/2 top-1/2 z-[var(--z-modal)] grid w-full max-w-(--component-dialog-max-width) -translate-x-1/2 -translate-y-1/2 gap-(--component-dialog-gap) rounded-(--component-dialog-radius) border border-border bg-card p-(--component-dialog-padding) shadow-lg outline-none',
    close:
      'absolute right-(--component-dialog-close-inset) top-(--component-dialog-close-inset) rounded-(--component-dialog-close-radius) text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring [&>svg]:size-(--component-dialog-close-icon-size)',
    title: 'text-lg font-medium text-foreground',
    description: 'text-sm text-muted-foreground',
  },
});
