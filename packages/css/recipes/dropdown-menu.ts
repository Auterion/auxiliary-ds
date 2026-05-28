import { tv } from 'tailwind-variants';

export const dropdownMenu = tv({
  slots: {
    content:
      'z-50 min-w-[10rem] rounded-md border border-border bg-popover p-1 text-sm text-foreground shadow-md outline-none',
    item: 'flex h-8 cursor-pointer select-none items-center rounded-sm px-2 text-sm outline-none data-[highlighted]:bg-accent data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
    label: 'px-2 py-1.5 text-xs uppercase tracking-wide text-muted-foreground',
    separator: 'my-1 border-t border-border',
  },
});
