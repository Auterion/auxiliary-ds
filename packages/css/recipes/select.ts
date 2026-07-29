import { tv, type VariantProps } from 'tailwind-variants';

export const select = tv({
  slots: {
    trigger:
      'inline-flex w-full items-center justify-between gap-(--component-select-gap) rounded-(--component-select-radius) border border-input bg-background text-foreground outline-none focus-visible:ring-2 ring-ring disabled:opacity-(--opacity-disabled) disabled:cursor-not-allowed data-[placeholder]:text-muted-foreground',
    triggerIcon: 'size-(--component-select-icon-size) text-muted-foreground',
    content:
      'z-[var(--z-dropdown)] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-(--component-select-content-radius) border border-border bg-popover text-sm text-popover-foreground shadow-md outline-none',
    viewport: 'p-(--component-select-viewport-padding)',
    // The text inset is DERIVED, not a measurement: indicator inset + indicator
    // icon + label gap. Left as a literal (it was `pl-7`), bumping the check icon
    // silently overlaps the label — the relationship was invisible.
    item: 'relative flex h-(--component-select-item-height) cursor-pointer select-none items-center rounded-(--component-select-item-radius) pl-[calc(var(--component-select-item-indicator-inset-inline-start)+var(--component-select-item-icon-size)+var(--spacing-2))] pr-(--component-select-item-padding-inline-end) text-sm outline-none data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground data-[disabled]:opacity-(--opacity-disabled) data-[disabled]:cursor-not-allowed',
    itemIndicator:
      'absolute left-(--component-select-item-indicator-inset-inline-start) flex items-center justify-center',
    separator: 'my-(--component-select-separator-margin-y) border-t border-border',
  },
  variants: {
    // Shared size vocabulary (see sizes.ts) — flexes the trigger only. Height is
    // register-flex via --control-height-* (ROADMAP §6g).
    size: {
      sm: { trigger: 'h-[max(var(--component-select-height-sm),var(--target-floor))] px-(--component-select-padding-x-sm) text-sm' },
      md: { trigger: 'h-[max(var(--component-select-height-md),var(--target-floor))] px-(--component-select-padding-x-md) text-sm' },
      lg: { trigger: 'h-[max(var(--component-select-height-lg),var(--target-floor))] px-(--component-select-padding-x-lg) text-base' },
    },
    invalid: {
      true: { trigger: 'border-destructive focus-visible:ring-destructive' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type SelectVariants = VariantProps<typeof select>;
