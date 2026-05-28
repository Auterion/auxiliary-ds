import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Monospaced telemetry readout. `size` scales the value; `level` recolors it
 * at a threshold (twMerge lets the level win over the default `text-foreground`).
 */
export const telemetryValue = tv({
  slots: {
    root: 'inline-flex flex-col',
    label: 'text-xs uppercase tracking-wide text-muted-foreground',
    valueRow: 'inline-flex items-baseline gap-1.5',
    value: 'font-mono tabular font-medium leading-tight text-foreground',
    unit: 'font-mono text-xs text-muted-foreground',
    trend: 'font-mono text-xs text-muted-foreground',
  },
  variants: {
    size: {
      sm: { value: 'text-sm' },
      md: { value: 'text-lg' },
      lg: { value: 'text-2xl' },
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

export type TelemetryValueVariants = VariantProps<typeof telemetryValue>;
