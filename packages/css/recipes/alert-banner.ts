import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Full-width operational alert. `level` drives the color block; the icon and
 * text label (set in the component) keep the meaning decodable without color.
 * The action/dismiss slots style the banner's inline buttons — they inherit
 * the level's foreground color and must stay recipe-owned (component
 * pattern 1: no hand-rolled class strings in the component).
 */
export const alertBanner = tv({
  slots: {
    root: 'flex items-start gap-3 rounded-md border px-4 py-3',
    icon: 'mt-0.5 shrink-0',
    action:
      'shrink-0 rounded px-2 py-1 text-xs font-medium underline-offset-2 hover:underline active:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 ring-ring',
    dismiss:
      'shrink-0 rounded p-1 opacity-70 hover:opacity-100 active:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 ring-ring',
  },
  variants: {
    level: {
      alarm:    { root: 'bg-alarm text-alarm-foreground border-alarm' },
      warning:  { root: 'bg-warning text-warning-foreground border-warning' },
      caution:  { root: 'bg-caution text-caution-foreground border-caution' },
      advisory: { root: 'bg-advisory text-advisory-foreground border-advisory' },
      nominal:  { root: 'bg-nominal text-nominal-foreground border-nominal' },
    },
  },
});

export type AlertBannerVariants = VariantProps<typeof alertBanner>;
