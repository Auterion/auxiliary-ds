/**
 * The viz palette surface — categorical / sequential / diverging scales, derived
 * from the OKLCH primitive ramps in `@auxiliary/tokens` and gated (ROADMAP §6.5,
 * `viz-palette.test.ts`) to stay clear of the reserved status ladder and stay
 * distinguishable under CVD.
 *
 * Two forms of each scale:
 *   - resolved oklch strings (`categorical`, …) — for **canvas** renderers (uPlot),
 *     where CSS custom properties don't resolve;
 *   - CSS var references (`categoricalVars`, …) — for **SVG/DOM**, where the
 *     cascade resolves them (and a consumer could re-theme by overriding `--viz-*`).
 */
import { tokens } from '@auxiliary/tokens';

type Scale = Record<string, string>;

/** Scale entries in numeric key order (`1, 2, …`), not object insertion order. */
const ordered = (scale: Scale): string[] =>
  Object.keys(scale)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => scale[key]!);

const varRefs = (name: string, count: number): string[] =>
  Array.from({ length: count }, (_unused, i) => `var(--viz-${name}-${i + 1})`);

/** Resolved oklch values — use for canvas (uPlot). */
export const categorical: readonly string[] = ordered(tokens.viz.categorical);
export const sequential: readonly string[] = ordered(tokens.viz.sequential);
export const diverging: readonly string[] = ordered(tokens.viz.diverging);

/** CSS custom-property references — use for SVG/DOM. */
export const categoricalVars: readonly string[] = varRefs('categorical', categorical.length);
export const sequentialVars: readonly string[] = varRefs('sequential', sequential.length);
export const divergingVars: readonly string[] = varRefs('diverging', diverging.length);

const wrap = (i: number, len: number): number => ((i % len) + len) % len;

/** Categorical series color (resolved oklch) by index, wrapping past the palette length. */
export const seriesColor = (i: number): string => categorical[wrap(i, categorical.length)]!;

/** Categorical series CSS var by index, wrapping past the palette length. */
export const seriesVar = (i: number): string => categoricalVars[wrap(i, categoricalVars.length)]!;

export type VizScale = 'categorical' | 'sequential' | 'diverging';
