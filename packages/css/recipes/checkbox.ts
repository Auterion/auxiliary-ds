import { tv, type VariantProps } from 'tailwind-variants';

export const checkbox = tv({
  slots: {
    root: 'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input bg-background outline-none data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
    indicator: 'text-primary-foreground',
  },
});

export type CheckboxVariants = VariantProps<typeof checkbox>;
