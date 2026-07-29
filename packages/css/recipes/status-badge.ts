import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Color-blind-safe status pill. Color encodes `level`, but it is never the only
 * signal — a per-level glyph (grayscale-distinct shape) and an always-rendered
 * visually-hidden level label carry the meaning independent of color or of any
 * consumer-supplied slot text. The `level × variant` color pairings live in
 * compoundVariants so the pill, its glyph, and its dot stay in lockstep.
 */
export const statusBadge = tv({
  slots: {
    base: 'inline-flex items-center gap-(--component-status-badge-gap) rounded-full font-medium uppercase tracking-wide',
    icon: 'shrink-0',
    dot: 'size-(--component-status-badge-dot-size) rounded-full',
  },
  variants: {
    level: {
      alarm: '',
      warning: '',
      caution: '',
      advisory: '',
      nominal: '',
    },
    variant: {
      solid: '',
      outline: '',
    },
    size: {
      sm: {
        base: 'h-(--component-status-badge-height-sm) px-(--component-status-badge-padding-x-sm) text-2xs',
        icon: 'size-(--component-status-badge-icon-size-sm)',
      },
      md: {
        base: 'h-(--component-status-badge-height-md) px-(--component-status-badge-padding-x-md) text-xs',
        icon: 'size-(--component-status-badge-icon-size-md)',
      },
    },
  },
  compoundVariants: [
    // Solid: filled background, foreground-colored dot.
    { level: 'alarm', variant: 'solid', class: { base: 'bg-alarm text-alarm-foreground border border-alarm', dot: 'bg-alarm-foreground' } },
    { level: 'warning', variant: 'solid', class: { base: 'bg-warning text-warning-foreground border border-warning', dot: 'bg-warning-foreground' } },
    { level: 'caution', variant: 'solid', class: { base: 'bg-caution text-caution-foreground border border-caution', dot: 'bg-caution-foreground' } },
    { level: 'advisory', variant: 'solid', class: { base: 'bg-advisory text-advisory-foreground border border-advisory', dot: 'bg-advisory-foreground' } },
    { level: 'nominal', variant: 'solid', class: { base: 'bg-nominal text-nominal-foreground border border-nominal', dot: 'bg-nominal-foreground' } },
    // Outline: bordered, level-colored dot — in the *-emphasis ON-SURFACE ink,
    // not the fill hue. Fills are gated only against their own -foreground;
    // as ink on page/card they fell to 1.4-2.9:1 (worst: darknight nominal
    // 1.41:1). The emphasis tier is gated >= 4.5:1 vs background AND card.
    { level: 'alarm', variant: 'outline', class: { base: 'border border-alarm-emphasis text-alarm-emphasis', dot: 'bg-alarm-emphasis' } },
    { level: 'warning', variant: 'outline', class: { base: 'border border-warning-emphasis text-warning-emphasis', dot: 'bg-warning-emphasis' } },
    { level: 'caution', variant: 'outline', class: { base: 'border border-caution-emphasis text-caution-emphasis', dot: 'bg-caution-emphasis' } },
    { level: 'advisory', variant: 'outline', class: { base: 'border border-advisory-emphasis text-advisory-emphasis', dot: 'bg-advisory-emphasis' } },
    { level: 'nominal', variant: 'outline', class: { base: 'border border-nominal-emphasis text-nominal-emphasis', dot: 'bg-nominal-emphasis' } },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

export type StatusBadgeVariants = VariantProps<typeof statusBadge>;
