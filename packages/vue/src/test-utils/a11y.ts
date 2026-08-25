import { configureAxe } from 'vitest-axe';

/**
 * Shared axe runner for component-level tests.
 *
 * Page-level rules are disabled because components are mounted in isolation
 * (no surrounding document landmarks), so they'd produce false positives that
 * say nothing about the component itself:
 *  - `region`     — "all content must be in a landmark" is a page concern.
 *  - `html-has-lang`, `document-title`, `landmark-one-main`, `page-has-heading-one`
 *    — document-shell rules, not component rules.
 *
 * Everything that *is* a component concern (names/roles, aria-*, label
 * associations) stays enabled.
 *
 * Color contrast is NOT checked here, and this comment used to say it was.
 * axe's `color-contrast` rule needs layout and computed styles; these tests run
 * in happy-dom, which does no layout and loads no stylesheet, so the rule finds
 * nothing and reports nothing — indistinguishable from passing. The contrast
 * contract is real and gated properly one layer up, against the token values
 * themselves: packages/tokens/test/contrast.test.ts (body/status pairs, per
 * theme) and sunlight-night-gates.test.ts (focus ring, structural UI, the
 * severity ladder under simulated dichromacy).
 */
export const axe = configureAxe({
  rules: {
    region: { enabled: false },
    'html-has-lang': { enabled: false },
    'document-title': { enabled: false },
    'landmark-one-main': { enabled: false },
    'page-has-heading-one': { enabled: false },
  },
});
