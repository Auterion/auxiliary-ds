import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Composable data table — styled semantic <table> parts (the slot-component
 * pattern, like Card/Accordion). Sorting and row selection are wired by the
 * consumer through the slots (a Button in a TableHead, a Checkbox in a TableCell);
 * this primitive owns the structure, surface, and density, not the behavior.
 */
export const table = tv({
  slots: {
    // Scroll container — keeps wide tables from breaking the page layout.
    root: 'relative w-full overflow-x-auto',
    table: 'w-full caption-bottom border-collapse text-sm',
    header: '[&_tr]:border-b [&_tr]:border-border',
    body: '[&_tr:last-child]:border-0',
    footer: 'border-t border-border bg-muted/50 font-medium',
    row: 'border-b border-border transition-colors hover:bg-accent data-[state=selected]:bg-accent',
    head: 'h-10 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap',
    cell: 'px-3 py-2 align-middle text-foreground',
    caption: 'mt-3 text-sm text-muted-foreground',
  },
  variants: {
    // Stick the header row to the top of the scroll container for long tables.
    // Set once on <TableHeader sticky>; applies to every header cell.
    sticky: {
      true: { header: '[&_th]:sticky [&_th]:top-0 [&_th]:z-[1] [&_th]:bg-card' },
    },
  },
});

export type TableVariants = VariantProps<typeof table>;
