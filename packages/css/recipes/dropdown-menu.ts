import { tv } from 'tailwind-variants';

export const dropdownMenu = tv({
  slots: {
    content:
      'z-[var(--z-dropdown)] min-w-(--component-dropdown-menu-min-width) rounded-(--component-dropdown-menu-radius) border border-border bg-popover p-(--component-dropdown-menu-padding) text-sm text-popover-foreground shadow-md outline-none',
    item: 'flex h-(--component-dropdown-menu-item-height) cursor-pointer select-none items-center rounded-(--component-dropdown-menu-item-radius) px-(--component-dropdown-menu-item-padding-x) text-sm outline-none data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground data-[disabled]:opacity-(--opacity-disabled) data-[disabled]:cursor-not-allowed',
    label:
      'px-(--component-dropdown-menu-label-padding-x) py-(--component-dropdown-menu-label-padding-y) text-xs uppercase tracking-wide text-muted-foreground',
    separator: 'my-(--component-dropdown-menu-separator-margin-y) border-t border-border',
  },
});
