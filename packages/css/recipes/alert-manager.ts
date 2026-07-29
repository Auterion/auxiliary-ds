import { tv } from 'tailwind-variants';

/**
 * Layout for the rendering surfaces of the alert model. Pure structure — the per-level
 * color/icon vocabulary lives in `alertBanner` / `statusBadge`, which the
 * `<AlertManager>` and `<AlertAnnunciator>` components compose. No variants here.
 */
export const alertManager = tv({
  slots: {
    root: 'flex flex-col gap-(--component-alert-manager-root-gap)',
    header: 'flex items-center justify-between gap-(--component-alert-manager-header-gap)',
    count: 'text-xs font-medium uppercase tracking-wide text-muted-foreground',
    ackAll:
      'rounded-(--component-alert-manager-ack-all-radius) px-(--component-alert-manager-ack-all-padding-x) py-(--component-alert-manager-ack-all-padding-y) text-xs font-medium text-muted-foreground underline-offset-2 hover:underline hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring',
    stack: 'flex flex-col gap-(--component-alert-manager-stack-gap)',
    overflow: 'px-(--component-alert-manager-overflow-padding-x) text-xs text-muted-foreground',
    acknowledged: 'opacity-60',
    annunciator:
      'inline-flex items-center gap-(--component-alert-annunciator-gap) rounded-(--component-alert-annunciator-radius) focus-visible:outline-none focus-visible:ring-2 ring-ring',
    annunciatorCount: 'text-xs font-medium tabular',
  },
});
