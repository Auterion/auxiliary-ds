import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Numeric entry with steppers — for telemetry/mission config (altitude, speed,
 * frequency, step). A bordered row: decrement button · input · optional unit ·
 * increment button. Shares the form-control size + invalid vocabulary so it
 * lines up with Input/Select.
 */
export const numberField = tv({
  slots: {
    root: 'inline-flex w-full items-stretch overflow-hidden rounded-md border border-input bg-background text-foreground focus-within:ring-2 ring-ring has-[input:disabled]:opacity-50 has-[input:disabled]:cursor-not-allowed',
    button:
      'inline-flex shrink-0 items-center justify-center px-2 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground active:bg-accent/80 disabled:pointer-events-none disabled:opacity-50',
    input:
      'min-w-0 flex-1 bg-transparent text-center tabular-nums text-foreground outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    unit: 'flex shrink-0 select-none items-center pr-2 text-sm text-muted-foreground',
  },
  variants: {
    // Register-flex height via --control-height-* (ROADMAP §6g) — stays aligned
    // with Input/Select rungs and tightens under [data-register="operational"].
    size: {
      sm: { root: 'h-[max(var(--control-height-sm),var(--target-floor))] text-sm' },
      md: { root: 'h-[max(var(--control-height-md),var(--target-floor))] text-sm' },
      lg: { root: 'h-[max(var(--control-height-lg),var(--target-floor))] text-base' },
    },
    invalid: {
      true: { root: 'border-destructive focus-within:ring-destructive' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type NumberFieldVariants = VariantProps<typeof numberField>;
