import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Monospaced coordinate readout (lat/long, MGRS). Sibling to `telemetryValue`:
 * shares its mono/tabular treatment and status `level` recoloring, but models a
 * coordinate string rather than a scalar value. `size` scales the value; `level`
 * recolors it at a threshold (twMerge lets the level win over `text-foreground`).
 *
 * As in `telemetryValue`, `level` is never color-only (AD-D-014 invariant 1): the
 * hue is paired with the shared `STATUS_GLYPHS` shape in `levelIcon` and an
 * `sr-only` `STATUS_LABELS` word.
 */
export const coordinateValue = tv({
  slots: {
    root: 'inline-flex flex-col',
    label: 'text-xs uppercase tracking-wide text-muted-foreground',
    valueRow: 'inline-flex items-baseline gap-(--component-coordinate-value-gap)',
    value: 'font-mono tabular font-medium leading-tight text-foreground',
    formatTag: 'font-mono text-2xs uppercase tracking-wide text-muted-foreground',
    levelIcon: 'shrink-0 self-center',
  },
  variants: {
    size: {
      sm: { value: 'text-sm', levelIcon: 'size-(--component-coordinate-value-icon-size-sm)' },
      md: { value: 'text-base', levelIcon: 'size-(--component-coordinate-value-icon-size-md)' },
      lg: { value: 'text-xl', levelIcon: 'size-(--component-coordinate-value-icon-size-lg)' },
    },
    level: {
      alarm:    { value: 'text-alarm-emphasis',    levelIcon: 'text-alarm-emphasis' },
      warning:  { value: 'text-warning-emphasis',  levelIcon: 'text-warning-emphasis' },
      caution:  { value: 'text-caution-emphasis',  levelIcon: 'text-caution-emphasis' },
      advisory: { value: 'text-advisory-emphasis', levelIcon: 'text-advisory-emphasis' },
      nominal:  { value: 'text-nominal-emphasis',  levelIcon: 'text-nominal-emphasis' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type CoordinateValueVariants = VariantProps<typeof coordinateValue>;
