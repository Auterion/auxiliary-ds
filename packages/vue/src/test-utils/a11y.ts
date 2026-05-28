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
 * Everything that *is* a component concern (color contrast, names/roles,
 * aria-*, label associations) stays enabled.
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
