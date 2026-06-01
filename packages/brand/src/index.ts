/**
 * `@auxiliary/brand` — the brand-asset layer.
 *
 * - manifest — typed access to the brand manifest + resolution helpers
 *   (`getLogo`, `resolveLogo`, `toneForTheme`). The machine-readable source of
 *   truth for which mark to use on which surface/theme.
 * - Logo — the Vue component that renders the right mark, with a labelled
 *   placeholder until a master lands.
 *
 * Raw, framework-free consumers (and tooling) can read `brand.manifest.json`
 * directly from the package root.
 */
export * from './manifest';
export { default as Logo } from './Logo.vue';
