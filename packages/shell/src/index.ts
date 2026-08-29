/**
 * `@auxiliary/shell` — the Auterion ecosystem layer.
 *
 * The chrome that is IDENTICAL across every Auterion surface, and nothing else.
 * Its value is that it is one artifact rather than five copies, which is why it
 * is a package and not a documented pattern (AD-D-038).
 *
 * - `IdentityBar` — the strip: mark · AUTERION · / · SURFACE · apps · tabs ·
 *   org · account. Fixed order, register-flexed height, semantic colour only.
 * - `Launcher` — the ecosystem's own screen: every surface as a tile that
 *   declares the theme and register it will hand you.
 * - `SurfaceGlyph` — the drawn hairline mark per surface. Identity by
 *   silhouette, never by hue.
 * - `surfaces` — the one surface declaration table everything above reads.
 *
 * What is deliberately NOT here: page layout, sidebars, content regions,
 * panels, routing — anything a product renders BELOW the bar. The moment a
 * shared shell reaches further down, product teams refuse it, and they are
 * right to.
 */
export { default as IdentityBar } from './IdentityBar.vue';
export { default as Launcher } from './Launcher.vue';
export { default as SurfaceGlyph } from './SurfaceGlyph.vue';
export * from './surfaces';
