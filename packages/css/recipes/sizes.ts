/**
 * The canonical size vocabulary for the system. Recipes pick the subset they
 * support (a Button spans `sm | md | lg`; a Badge only `sm | md`), but they all
 * draw the *names* from here so a "md" means the same rung everywhere and sizes
 * stop diverging arbitrarily across components.
 */
export type Size = 'sm' | 'md' | 'lg';

/** Recipes that top out at medium (badges, status pills). */
export type SizeSm = Extract<Size, 'sm' | 'md'>;
