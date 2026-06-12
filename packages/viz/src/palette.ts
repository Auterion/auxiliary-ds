/**
 * The viz palette surface — categorical / sequential / diverging scales.
 *
 * The scales are PER-THEME semantic roles (`viz-categorical-1…6`,
 * `viz-sequential-1…5`, `viz-diverging-1…5` in `@auxiliary/tokens`), re-resolving
 * under `[data-theme]` like every other role: light/dark/sunlight carry the
 * brand-anchored cool sweep (series 1 is always Auterion ultramarine), darknight
 * swaps to a warm luminance ladder under the blue-energy cap. Gated per theme in
 * `@auxiliary/tokens` (contrast floors, ΔEok + simulated-CVD separation,
 * monotonic sequential, status-ladder reservation).
 *
 * Three forms of each scale:
 *   - CSS var references (`categoricalVars`, …) — for **SVG/DOM**, where the
 *     cascade resolves them per theme (and a consumer can re-theme by
 *     overriding `--viz-*`). Prefer these wherever CSS resolves.
 *   - `resolveScale(el, scale)` — for **canvas** renderers (uPlot), which can't
 *     resolve CSS vars: reads the computed values from the host element, so
 *     scoped `[data-theme]` ancestors are honored. Pair with `observeTheme` to
 *     re-read on live theme switches.
 *   - resolved oklch strings (`categorical`, …) — the LIGHT-theme values, as a
 *     static/SSR fallback only. They do not re-theme; don't paint with them in
 *     the browser.
 */
import { tokens } from '@auxiliary/tokens';

export const SCALE_SIZES = { categorical: 6, sequential: 5, diverging: 5 } as const;
export type VizScale = keyof typeof SCALE_SIZES;

const light = tokens.light as Record<string, string>;

const lightScale = (scale: VizScale): string[] =>
  Array.from({ length: SCALE_SIZES[scale] }, (_unused, i) => light[`viz-${scale}-${i + 1}`]!);

const varRefs = (scale: VizScale): string[] =>
  Array.from({ length: SCALE_SIZES[scale] }, (_unused, i) => `var(--viz-${scale}-${i + 1})`);

/** Light-theme resolved oklch values — static/SSR fallback only (do not paint with these in the browser; they don't re-theme). */
export const categorical: readonly string[] = lightScale('categorical');
export const sequential: readonly string[] = lightScale('sequential');
export const diverging: readonly string[] = lightScale('diverging');

/** CSS custom-property references — use for SVG/DOM. */
export const categoricalVars: readonly string[] = varRefs('categorical');
export const sequentialVars: readonly string[] = varRefs('sequential');
export const divergingVars: readonly string[] = varRefs('diverging');

const wrap = (i: number, len: number): number => ((i % len) + len) % len;

/** Categorical series color by index — LIGHT-theme fallback (see `resolveSeries` for canvas). */
export const seriesColor = (i: number): string => categorical[wrap(i, categorical.length)]!;

/** Categorical series CSS var by index, wrapping past the palette length. */
export const seriesVar = (i: number): string => categoricalVars[wrap(i, categoricalVars.length)]!;

/**
 * Resolve a scale's CURRENT values against a host element (canvas renderers).
 * Reads computed custom properties, so any `[data-theme]` ancestor — not just
 * the document root — is honored. Falls back to the light-theme values when
 * the theme stylesheet isn't loaded.
 */
export function resolveScale(el: Element, scale: VizScale): string[] {
  if (typeof window === 'undefined') return [...lightScale(scale)];
  const styles = getComputedStyle(el);
  return Array.from({ length: SCALE_SIZES[scale] }, (_unused, i) => {
    const v = styles.getPropertyValue(`--viz-${scale}-${i + 1}`).trim();
    return v || lightScale(scale)[i]!;
  });
}

/** Resolved categorical series color by index against a host element (canvas). */
export function resolveSeries(el: Element, i: number): string {
  return resolveScale(el, 'categorical')[wrap(i, SCALE_SIZES.categorical)]!;
}

/**
 * Watch for `[data-theme]` changes that affect `el` (on itself, any ancestor,
 * or the document root) and invoke `cb` — canvas charts re-stroke on live
 * theme switches this way. Returns a disposer.
 */
export function observeTheme(el: Element, cb: () => void): () => void {
  if (typeof MutationObserver === 'undefined') return () => {};
  const observer = new MutationObserver(cb);
  let node: Element | null = el;
  while (node) {
    observer.observe(node, { attributes: true, attributeFilter: ['data-theme'] });
    node = node.parentElement;
  }
  return () => observer.disconnect();
}
