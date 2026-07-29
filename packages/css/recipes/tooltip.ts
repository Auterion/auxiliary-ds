import { tv } from 'tailwind-variants';

export const tooltip = tv({
  base: 'z-[var(--z-tooltip)] max-w-(--component-tooltip-max-width) rounded-(--component-tooltip-radius) bg-primary px-(--component-tooltip-padding-x) py-(--component-tooltip-padding-y) text-xs text-primary-foreground shadow-md',
});
