import { tv, type VariantProps } from 'tailwind-variants';

export const select = tv({
  slots: {
    trigger:
      'inline-flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background text-foreground outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed data-[placeholder]:text-muted-foreground',
    triggerIcon: 'text-muted-foreground',
    content:
      'z-[var(--z-dropdown)] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-border bg-popover text-sm text-foreground shadow-md outline-none',
    viewport: 'p-1',
    item: 'relative flex h-8 cursor-pointer select-none items-center rounded-sm pl-7 pr-2 text-sm outline-none data-[highlighted]:bg-accent data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
    itemIndicator: 'absolute left-2 flex items-center justify-center',
    separator: 'my-1 border-t border-border',
  },
  variants: {
    // Shared size vocabulary (see sizes.ts) — flexes the trigger only. Height is
    // register-flex via --control-height-* (ROADMAP §6g).
    size: {
      sm: { trigger: 'h-[var(--control-height-sm)] px-2.5 text-sm' },
      md: { trigger: 'h-[var(--control-height-md)] px-3 text-sm' },
      lg: { trigger: 'h-[var(--control-height-lg)] px-3.5 text-base' },
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
