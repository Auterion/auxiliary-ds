import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Type-ahead select — for large option sets (vehicle IDs, waypoints, frequencies)
 * where a plain Select is too slow to scan. The anchor reuses the form-control
 * look (size + invalid) so it lines up with Input/Select; the listbox mirrors the
 * Select content/item styling.
 */
export const combobox = tv({
  slots: {
    anchor:
      'inline-flex w-full items-center gap-2 rounded-md border border-input bg-background text-foreground focus-within:ring-2 ring-ring has-[input:disabled]:opacity-50 has-[input:disabled]:cursor-not-allowed',
    input:
      'min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
    trigger: 'shrink-0 text-muted-foreground outline-none',
    content:
      'z-[var(--z-dropdown)] max-h-72 min-w-[var(--reka-combobox-trigger-width)] overflow-hidden overflow-y-auto rounded-md border border-border bg-popover text-sm text-foreground shadow-md outline-none',
    viewport: 'p-1',
    item: 'relative flex h-8 cursor-pointer select-none items-center rounded-sm pl-7 pr-2 text-sm outline-none data-[highlighted]:bg-accent data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
    itemIndicator: 'absolute left-2 flex items-center justify-center',
    empty: 'px-2 py-6 text-center text-sm text-muted-foreground',
    separator: 'my-1 border-t border-border',
  },
  variants: {
    // Register-flex anchor height via --control-height-* (ROADMAP §6g) — keeps
    // the anchor aligned with Input/Select rungs across registers.
    size: {
      sm: { anchor: 'h-[var(--control-height-sm)] px-2.5 text-sm' },
      md: { anchor: 'h-[var(--control-height-md)] px-3 text-sm' },
      lg: { anchor: 'h-[var(--control-height-lg)] px-3.5 text-base' },
    },
    invalid: {
      true: { anchor: 'border-destructive focus-within:ring-destructive' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type ComboboxVariants = VariantProps<typeof combobox>;
