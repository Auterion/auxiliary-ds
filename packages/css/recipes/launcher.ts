import { tv } from 'tailwind-variants';

/**
 * The ecosystem launcher (AD-D-038) — the chooser an operator lands on.
 *
 * Two decisions in here are arguments, not defaults:
 *
 *  - **Every tile declares the theme and register it will hand you.** Moving
 *    between a light, roomy Suite and a dark, dense Control stops being a jolt
 *    when the tile said so before the click.
 *  - **Products are told apart by glyph and name, never by hue.** A colour per
 *    product would mint accent hues with no ramp, no contrast gate and no token
 *    behind them, next to a status ladder that already owns five meanings — and
 *    it would fail in `darknight` (no blue at any strength) and in `sunlight`
 *    (the low end of every ramp collapses).
 *
 * The column thresholds are CONTAINER queries at the width a tile stops
 * fitting, not viewport breakpoints at device sizes: the launcher has to hold
 * up in a side panel as well as on a page. Three columns fixed rather than
 * `auto-fit`, because a grid that leaves two tiles alone on a row reads as an
 * accident.
 */
export const launcher = tv({
  slots: {
    root: [
      '@container',
      'px-(--component-launcher-padding) pt-(--component-launcher-padding-top) pb-(--component-launcher-padding)',
      '@max-2xl:p-(--component-launcher-padding-compact)',
    ],

    head: [
      'flex flex-wrap items-end justify-between',
      'gap-(--component-launcher-head-gap) mb-(--component-launcher-head-margin-bottom)',
    ],

    tiles: [
      'grid grid-cols-3 gap-(--component-launcher-tiles-gap)',
      '@max-4xl:grid-cols-2',
      '@max-2xl:grid-cols-1',
    ],

    tile: [
      'flex flex-col items-stretch no-underline',
      'gap-(--component-launcher-tile-gap) p-(--component-launcher-tile-padding)',
      'rounded-(--component-launcher-tile-radius) border border-border bg-card text-card-foreground',
      'transition-[border-color,background-color,scale] duration-(--duration-base) ease-out',
      'hover:border-muted-foreground active:scale-[0.96]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      // A surface that does not exist yet is drawn as a dashed edge, so the
      // grid can show the shape of the ecosystem without claiming it ships.
      'data-[proposed=true]:border-dashed',
    ],

    tileTop: 'flex items-center gap-(--component-launcher-tile-gap)',

    glyph: [
      'flex-none grid place-items-center',
      'p-(--component-launcher-glyph-padding) rounded-(--component-launcher-glyph-radius)',
      'border border-border bg-muted text-foreground',
      '[&>svg]:block [&>svg]:size-(--component-launcher-glyph-icon-size)',
    ],

    // The launcher's own heading, one step above a tile title. Without the
    // separation the section head and nine tile names all read as peers, and
    // the grid loses the thing that says where it starts.
    title: 'font-display text-2xl font-semibold leading-tight tracking-tight text-foreground',
    name: 'font-display text-xl font-semibold leading-tight tracking-tight text-foreground',
    formal: 'block text-2xs uppercase tracking-[0.04em] text-muted-foreground',
    blurb: 'text-sm leading-normal text-pretty text-muted-foreground',

    chips: [
      'flex flex-wrap mt-auto',
      'gap-(--component-launcher-chips-gap) pt-(--component-launcher-chips-padding-top)',
    ],
    chip: [
      'inline-flex items-center font-mono text-2xs uppercase text-muted-foreground',
      'gap-(--component-launcher-chip-gap)',
      'px-(--component-launcher-chip-padding-x) py-(--component-launcher-chip-padding-y)',
      'rounded-(--component-launcher-chip-radius) border border-border',
    ],
    // The label half of a chip. Dimmed rather than re-weighted: `font-normal`
    // resolves to no token, and a chip label reading lighter than its value is
    // the point anyway.
    chipLabel: 'opacity-70',

    foot: [
      'flex flex-wrap items-center text-xs text-muted-foreground',
      'gap-(--component-launcher-foot-gap) mt-(--component-launcher-foot-margin-top)',
    ],
  },
});
