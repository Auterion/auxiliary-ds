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
    base: 'inline-flex items-center gap-1.5 rounded-full font-medium uppercase tracking-wide',
    icon: 'shrink-0',
    dot: 'h-2 w-2 rounded-full',
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
      sm: { base: 'h-5 px-2 text-[10px]', icon: 'h-3 w-3' },
      md: { base: 'h-6 px-2.5 text-xs', icon: 'h-3.5 w-3.5' },
    },
  },
  compoundVariants: [
    // Solid: filled background, foreground-colored dot.
    { level: 'alarm', variant: 'solid', class: { base: 'bg-alarm text-alarm-foreground border border-alarm', dot: 'bg-alarm-foreground' } },
    { level: 'warning', variant: 'solid', class: { base: 'bg-warning text-warning-foreground border border-warning', dot: 'bg-warning-foreground' } },
    { level: 'caution', variant: 'solid', class: { base: 'bg-caution text-caution-foreground border border-caution', dot: 'bg-caution-foreground' } },
    { level: 'advisory', variant: 'solid', class: { base: 'bg-advisory text-advisory-foreground border border-advisory', dot: 'bg-advisory-foreground' } },
    { level: 'nominal', variant: 'solid', class: { base: 'bg-nominal text-nominal-foreground border border-nominal', dot: 'bg-nominal-foreground' } },
    // Outline: bordered, level-colored dot.
    { level: 'alarm', variant: 'outline', class: { base: 'border border-alarm text-alarm', dot: 'bg-alarm' } },
    { level: 'warning', variant: 'outline', class: { base: 'border border-warning text-warning', dot: 'bg-warning' } },
    { level: 'caution', variant: 'outline', class: { base: 'border border-caution text-caution', dot: 'bg-caution' } },
    { level: 'advisory', variant: 'outline', class: { base: 'border border-advisory text-advisory', dot: 'bg-advisory' } },
    { level: 'nominal', variant: 'outline', class: { base: 'border border-nominal text-nominal', dot: 'bg-nominal' } },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

export type StatusBadgeVariants = VariantProps<typeof statusBadge>;
