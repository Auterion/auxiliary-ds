import { tv, type VariantProps } from 'tailwind-variants';

export const dialog = tv({
  slots: {
    overlay:
      'fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    content:
      'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-md border border-border bg-card p-6 shadow-lg outline-none',
    close:
      'absolute right-4 top-4 rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring',
    title: 'text-lg font-medium text-foreground',
    description: 'text-sm text-muted-foreground',
  },
});

export type DialogVariants = VariantProps<typeof dialog>;
