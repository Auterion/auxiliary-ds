import { tv } from 'tailwind-variants';

/**
 * Layout for the alert model's rendering surfaces. Pure structure — the per-level
 * color/icon vocabulary lives in `alertBanner` / `statusBadge`, which the
 * `<AlertManager>` and `<AlertAnnunciator>` components compose. No variants here.
 */
export const alertManager = tv({
  slots: {
    root: 'flex flex-col gap-2',
    header: 'flex items-center justify-between gap-3',
    count: 'text-xs font-medium uppercase tracking-wide text-muted-foreground',
    ackAll:
      'rounded px-2 py-1 text-xs font-medium text-muted-foreground underline-offset-2 hover:underline hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring',
    stack: 'flex flex-col gap-2',
    overflow: 'px-1 text-xs text-muted-foreground',
    acknowledged: 'opacity-60',
    annunciator:
      'inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 ring-ring',
    annunciatorCount: 'text-xs font-medium tabular',
  },
});
