import { tv } from 'tailwind-variants';

export const slider = tv({
  slots: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted',
    range: 'absolute h-full bg-primary',
    thumb:
      'block h-4 w-4 rounded-full border border-primary bg-background shadow-sm outline-none focus-visible:ring-2 ring-ring disabled:opacity-50',
  },
});
