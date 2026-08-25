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
      'inline-flex w-full items-center gap-(--component-combobox-gap) rounded-(--component-combobox-radius) border border-input bg-background text-foreground focus-within:ring-2 ring-ring has-[input:disabled]:opacity-(--opacity-disabled) has-[input:disabled]:cursor-not-allowed',
    input:
      'min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
    trigger: 'shrink-0 text-muted-foreground outline-none',
    content:
      'z-[var(--z-dropdown)] max-h-(--component-combobox-content-max-height) min-w-[var(--reka-combobox-trigger-width)] overflow-hidden overflow-y-auto rounded-(--component-combobox-content-radius) border border-border bg-popover text-sm text-popover-foreground shadow-md outline-none',
    viewport: 'p-(--component-combobox-viewport-padding)',
    // Text inset is DERIVED — see the same note in select.ts.
    item: 'relative flex h-(--component-combobox-item-height) cursor-pointer select-none items-center rounded-(--component-combobox-item-radius) ps-[calc(var(--component-combobox-item-indicator-inset-inline-start)+var(--component-combobox-item-icon-size)+var(--spacing-2))] pe-(--component-combobox-item-padding-inline-end) truncate text-sm outline-none data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground data-[disabled]:opacity-(--opacity-disabled) data-[disabled]:cursor-not-allowed',
    itemIndicator:
      'absolute start-(--component-combobox-item-indicator-inset-inline-start) flex items-center justify-center',
    empty:
      'px-(--component-combobox-empty-padding-x) py-(--component-combobox-empty-padding-y) text-center text-sm text-muted-foreground',
    separator: 'my-(--component-combobox-separator-margin-y) border-t border-border',
  },
  variants: {
    // Register-flex anchor height via --control-height-* (ROADMAP §6g) — keeps
    // the anchor aligned with Input/Select rungs across registers.
    size: {
      sm: { anchor: 'h-[max(var(--component-combobox-height-sm),var(--target-floor))] px-(--component-combobox-padding-x-sm) text-[max(var(--text-sm),var(--field-text-floor))]' },
      md: { anchor: 'h-[max(var(--component-combobox-height-md),var(--target-floor))] px-(--component-combobox-padding-x-md) text-[max(var(--text-sm),var(--field-text-floor))]' },
      lg: { anchor: 'h-[max(var(--component-combobox-height-lg),var(--target-floor))] px-(--component-combobox-padding-x-lg) text-base' },
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
