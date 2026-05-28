/* eslint-disable */
/**
 * GENERATED FILE — do not edit by hand.
 * Source: src/config.ts + inputs/*.svg
 * Regenerate: pnpm --filter @auxiliary/icons sync
 */

export type IconWeight = 'thin' | 'light' | 'regular' | 'solid';

export interface IconShape {
  viewBox: string;
  weights: Partial<Record<IconWeight, string>>;
}

export const ICON_REGISTRY = {
  'drone': {
    viewBox: '0 0 24 24',
    weights: {
    regular: `<circle cx="5" cy="5" r="2.5"/>
  <circle cx="19" cy="5" r="2.5"/>
  <circle cx="5" cy="19" r="2.5"/>
  <circle cx="19" cy="19" r="2.5"/>
  <path d="M4 6L6 4L13 11L11 13Z"/>
  <path d="M20 6L18 4L11 11L13 13Z"/>
  <path d="M4 18L6 20L13 13L11 11Z"/>
  <path d="M20 18L18 20L11 13L13 11Z"/>
  <circle cx="12" cy="12" r="2.5"/>`,
    },
  },
} as const satisfies Record<string, IconShape>;

export type IconName = keyof typeof ICON_REGISTRY;

export const ICON_NAMES = Object.keys(ICON_REGISTRY) as readonly IconName[];
