import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Monospaced coordinate readout (lat/long, MGRS). Sibling to `telemetryValue`:
 * shares its mono/tabular treatment and status `level` recoloring, but models a
 * coordinate string rather than a scalar value. `size` scales the value; `level`
 * recolors it at a threshold (twMerge lets the level win over `text-foreground`).
 */
export const coordinateValue = tv({
  slots: {
    root: 'inline-flex flex-col',
    label: 'text-xs uppercase tracking-wide text-muted-foreground',
    valueRow: 'inline-flex items-baseline gap-1.5',
    value: 'font-mono tabular font-medium leading-tight text-foreground',
    formatTag: 'font-mono text-2xs uppercase tracking-wide text-muted-foreground',
  },
  variants: {
    size: {
      sm: { value: 'text-sm' },
      md: { value: 'text-base' },
      lg: { value: 'text-xl' },
    },
    level: {
      alarm:    { value: 'text-alarm' },
      warning:  { value: 'text-warning' },
      caution:  { value: 'text-caution' },
      advisory: { value: 'text-advisory' },
      nominal:  { value: 'text-nominal' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type CoordinateValueVariants = VariantProps<typeof coordinateValue>;
