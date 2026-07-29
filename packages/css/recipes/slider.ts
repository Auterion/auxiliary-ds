import { tv } from 'tailwind-variants';

export const slider = tv({
  slots: {
    root: 'relative flex w-full touch-none select-none items-center',
    track: 'relative h-(--component-slider-track-height) w-full grow overflow-hidden rounded-full bg-input',
    range: 'absolute h-full bg-primary',
    thumb:
      'block size-(--component-slider-thumb-size) rounded-full border border-primary bg-background shadow-sm outline-none focus-visible:ring-2 ring-ring disabled:opacity-(--opacity-disabled)',
  },
});
