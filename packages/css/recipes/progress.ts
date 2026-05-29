import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Progress track + indicator. With no `level` the indicator uses the accent
 * (`bg-primary`); a status level recolors it (twMerge lets the variant win).
 */
export const progress = tv({
  slots: {
    root: 'relative h-2 w-full overflow-hidden rounded-full bg-background',
    indicator: 'h-full w-full transition-transform duration-[var(--duration-slow)] bg-primary',
  },
  variants: {
    level: {
      alarm:    { indicator: 'bg-alarm' },
      warning:  { indicator: 'bg-warning' },
      caution:  { indicator: 'bg-caution' },
      advisory: { indicator: 'bg-advisory' },
      nominal:  { indicator: 'bg-nominal' },
    },
  },
});

export type ProgressVariants = VariantProps<typeof progress>;
