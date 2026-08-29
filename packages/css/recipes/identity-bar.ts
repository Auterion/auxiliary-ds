import { tv } from 'tailwind-variants';

/**
 * The ecosystem identity strip (AD-D-038).
 *
 * One recipe, rendered by every Auterion surface. Its STRUCTURE never varies —
 * mark · AUTERION · / · SURFACE · apps · tabs · org · account — and nothing in
 * here reads the theme or the register. Every colour is a semantic token and
 * every measure steps off the component tier, so a surface that sets
 * `[data-register="operational"]` gets a denser bar without this file, or its
 * caller, knowing it happened.
 *
 * Two details are load-bearing rather than decorative:
 *
 *  - The active tab is marked by a RULE on the bar's bottom edge plus weight,
 *    never by a lozenge and never by colour alone. Position survives a
 *    monochrome render and a colour-vision deficiency both.
 *  - The tab strip SCROLLS rather than truncates, above a min-width floor. A
 *    scroll container too narrow to show even a partial tab is content hidden
 *    with no cue at all; with the floor, the next tab peeks past the edge and
 *    the peek is the affordance.
 *
 * Control heights are wrapped in `max(…, var(--target-floor))` so the coarse-
 * pointer floor composes over register density — the component tier cannot
 * carry the max() itself, because the floor is re-declared by blocks that do
 * not re-emit the component tier.
 */
export const identityBar = tv({
  slots: {
    root: [
      'flex items-center',
      'h-[calc(max(var(--component-identity-bar-height),var(--target-floor))+var(--component-identity-bar-height-offset))]',
      'px-(--component-identity-bar-padding-x)',
      'border-b border-border bg-card text-card-foreground',
    ],

    // The one signal the bar spends. `brand` is the identity hue in light and
    // dark, black in sunlight and amber in darknight — the theme's own answer
    // to glare and to dark adaptation. Never used for state.
    mark: 'flex-none text-brand [&>*]:block size-(--component-identity-bar-mark-icon-size)',

    word: [
      'ms-(--component-identity-bar-mark-gap) text-xs font-medium uppercase leading-none whitespace-nowrap text-foreground',
      'tracking-[0.3em]',
      // The tracking pushes a trailing sidebearing past the glyph; pull it back
      // so the slash sits the same distance from the N of AUTERION as it does
      // from the E of SUITE.
      'me-[calc(var(--component-identity-bar-mark-gap)-0.3em)]',
    ],

    slash: 'text-xs leading-none opacity-40',

    surface: [
      'ms-(--component-identity-bar-mark-gap) text-xs font-medium uppercase leading-none whitespace-nowrap text-muted-foreground',
      'tracking-[0.24em]',
      'me-[calc(var(--component-identity-bar-surface-gap)-0.24em)]',
    ],

    apps: [
      'flex-none grid place-items-center cursor-pointer text-muted-foreground',
      'size-[max(var(--component-identity-bar-apps-size),var(--target-floor))]',
      'rounded-(--component-identity-bar-apps-radius)',
      'transition-[background-color,color] duration-(--duration-fast) ease-out',
      'hover:bg-accent hover:text-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
    ],
    dots: 'grid grid-cols-3 gap-(--component-identity-bar-apps-dot-gap)',
    dot: 'size-(--component-identity-bar-apps-dot) rounded-full bg-current',

    tabs: [
      'flex items-stretch self-stretch',
      'ms-(--component-identity-bar-mark-gap)',
      'min-w-(--component-identity-bar-tabs-min-width) shrink',
      'overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    ],
    tab: [
      'inline-flex flex-none items-center h-full cursor-pointer whitespace-nowrap text-xs leading-none text-muted-foreground',
      'px-(--component-identity-bar-tab-padding-x)',
      'transition-[color,box-shadow,background-color] duration-(--duration-fast) ease-out',
      'hover:text-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
      'aria-[current=page]:font-semibold aria-[current=page]:text-foreground',
      'aria-[current=page]:shadow-[inset_0_calc(-1*var(--component-identity-bar-tab-marker))_0_0_var(--brand)]',
    ],

    // The spacer is the first thing to yield — everything it separates is real.
    grow: 'flex-1 min-w-0',

    right: 'flex flex-none items-center gap-(--component-identity-bar-right-gap)',

    // Org context lives in the bar and not in a sidebar popover because on a
    // shared terminal "which tenant am I in" is a safety question, not a
    // preference. It is the last thing in the bar allowed to collapse.
    // A readout, not a control — so it takes its size from its content and is
    // deliberately NOT floored to 44px. See the token's own note: a floor
    // applied to something nobody can press is a 44px box holding one word.
    org: [
      'inline-flex items-center whitespace-nowrap font-mono text-2xs uppercase tracking-[0.1em] text-foreground',
      'gap-(--component-identity-bar-org-gap)',
      'px-(--component-identity-bar-org-padding-x) py-(--component-identity-bar-org-padding-y)',
      'border border-border rounded-(--component-identity-bar-org-radius)',
    ],

    account: [
      'flex-none grid place-items-center cursor-pointer text-muted-foreground',
      'size-[max(var(--component-identity-bar-account-size),var(--target-floor))]',
      'rounded-(--component-identity-bar-account-radius)',
      'transition-[background-color,color] duration-(--duration-fast) ease-out',
      'hover:bg-accent hover:text-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
    ],
  },
});
