import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Full-width operational alert. `level` drives the color block; the icon and
 * text label (set in the component) keep the meaning decodable without color.
 */
export const alertBanner = tv({
  base: 'flex items-start gap-3 rounded-md border px-4 py-3',
  variants: {
    level: {
      alarm:    'bg-alarm text-alarm-foreground border-alarm',
      warning:  'bg-warning text-warning-foreground border-warning',
      caution:  'bg-caution text-caution-foreground border-caution',
      advisory: 'bg-advisory text-advisory-foreground border-advisory',
      nominal:  'bg-nominal text-nominal-foreground border-nominal',
    },
  },
});

export type AlertBannerVariants = VariantProps<typeof alertBanner>;
