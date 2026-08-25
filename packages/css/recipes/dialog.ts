import { tv } from 'tailwind-variants';

export const dialog = tv({
  slots: {
    // The scrim fades; it does not slide or scale. One named animation per
    // direction (theme.css), not the shadcn `animate-in` + `fade-in-0` pair —
    // that vocabulary composes at the call site, which is what this layer avoids.
    overlay:
      'fixed inset-0 z-[var(--z-overlay)] bg-overlay backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
    // `max-h` + `overflow-y-auto` are load-bearing, not polish: a fixed, centred
    // panel with neither grows past both viewport edges, and the page scrollbar
    // cannot reach a fixed element. At 320x256 the title, the close button and
    // the confirm action all sat off-screen with no scroll path (WCAG 1.4.10).
    // `overscroll-contain` stops the scroll chaining to the page behind the scrim.
    // The content fades with the scrim rather than popping in beside it.
    content:
      'fixed left-1/2 top-1/2 z-[var(--z-modal)] grid max-h-[calc(100dvh-var(--component-dialog-viewport-inset))] w-full max-w-(--component-dialog-max-width) -translate-x-1/2 -translate-y-1/2 gap-(--component-dialog-gap) overflow-y-auto overscroll-contain rounded-(--component-dialog-radius) border border-border bg-card p-(--component-dialog-padding) shadow-lg outline-none data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
    // The glyph is 16px; the BOX is the target. `inline-grid` + `place-items-center`
    // keeps the icon optically centred while the hit area takes the coarse-pointer
    // floor, so a gloved thumb gets 44px without the icon growing.
    close:
      'absolute end-(--component-dialog-close-inset) top-(--component-dialog-close-inset) inline-grid size-[max(var(--component-dialog-close-size),var(--target-floor))] place-items-center rounded-(--component-dialog-close-radius) text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring [&>svg]:size-(--component-dialog-close-icon-size)',
    title: 'text-lg font-medium text-balance text-foreground',
    description: 'text-sm text-pretty text-muted-foreground',
  },
});
