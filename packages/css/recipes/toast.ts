import { tv } from 'tailwind-variants';

export const toast = tv({
  slots: {
    // Logical `end-0` (not `right-0`) so the stack mirrors under RTL, and the
    // padding absorbs the safe-area inset: this system is documented for "rugged
    // touch tablets and handheld controllers", where a flat pad puts the dismiss
    // and action buttons inside the home-indicator and rounded-corner band. The
    // two-argument env() falls back to 0px where the feature is unsupported, so
    // desktop geometry is unchanged.
    viewport:
      'fixed bottom-0 end-0 z-[var(--z-toast)] flex max-h-screen w-full flex-col gap-(--component-toast-viewport-gap) p-(--component-toast-viewport-padding) pb-[calc(var(--component-toast-viewport-padding)+env(safe-area-inset-bottom,0px))] pe-[calc(var(--component-toast-viewport-padding)+env(safe-area-inset-right,0px))] sm:max-w-(--component-toast-viewport-max-width) outline-none',
    root: 'grid grid-cols-[1fr_auto] items-start gap-(--component-toast-gap) rounded-(--component-toast-radius) border border-border bg-popover p-(--component-toast-padding) text-sm text-popover-foreground shadow-md outline-none focus-visible:ring-2 ring-ring',
    title: 'font-medium text-balance',
    description: 'mt-(--component-toast-description-margin-top) text-xs text-pretty text-muted-foreground',
    action: '',
    // Box is the target, not the 14px glyph — see dialog.close.
    close:
      'inline-grid size-[max(var(--component-toast-close-size),var(--target-floor))] place-items-center rounded-(--component-toast-close-radius) text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring [&>svg]:size-(--component-toast-close-icon-size)',
  },
});
