import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Monospaced telemetry readout. `size` scales the value; `level` recolors it
 * at a threshold (twMerge lets the level win over the default `text-foreground`).
 *
 * `level` is NEVER color-only (AD-D-014 invariant 1). The hue is paired with the
 * shared `STATUS_GLYPHS` shape in the `levelIcon` slot and an `sr-only`
 * `STATUS_LABELS` word, the same redundancy StatusBadge and AlertBanner carry —
 * so the tier survives grayscale, dichromacy and a screen reader. The color is
 * the fast cue, not the only one.
 *
 * `spaced` mirrors the formatter's own flag (`format/units.ts`): `408 m` takes the
 * gap, `247°` does not. It cancels the row gap on the unit alone via a negative
 * inline-start margin, so the trend glyph keeps its spacing either way.
 */
export const telemetryValue = tv({
  slots: {
    root: 'inline-flex flex-col',
    label: 'text-xs uppercase tracking-wide text-muted-foreground',
    valueRow: 'inline-flex items-baseline gap-(--component-telemetry-value-gap)',
    value: 'font-mono tabular font-medium leading-tight text-foreground',
    unit: 'font-mono text-xs text-muted-foreground',
    trend: 'font-mono text-xs text-muted-foreground',
    levelIcon: 'shrink-0 self-center',
  },
  variants: {
    size: {
      sm: { value: 'text-sm', levelIcon: 'size-(--component-telemetry-value-icon-size-sm)' },
      md: { value: 'text-lg', levelIcon: 'size-(--component-telemetry-value-icon-size-md)' },
      lg: { value: 'text-2xl', levelIcon: 'size-(--component-telemetry-value-icon-size-lg)' },
    },
    level: {
      alarm:    { value: 'text-alarm-emphasis',    levelIcon: 'text-alarm-emphasis' },
      warning:  { value: 'text-warning-emphasis',  levelIcon: 'text-warning-emphasis' },
      caution:  { value: 'text-caution-emphasis',  levelIcon: 'text-caution-emphasis' },
      advisory: { value: 'text-advisory-emphasis', levelIcon: 'text-advisory-emphasis' },
      nominal:  { value: 'text-nominal-emphasis',  levelIcon: 'text-nominal-emphasis' },
    },
    spaced: {
      true: {},
      false: { unit: 'ms-[calc(var(--component-telemetry-value-gap)*-1)]' },
    },
  },
  defaultVariants: {
    size: 'md',
    spaced: true,
  },
});

export type TelemetryValueVariants = VariantProps<typeof telemetryValue>;
