import { expect, test } from '@playwright/test';

/**
 * Visual regression across the full token matrix.
 *
 * The gate this closes: tokens, recipes and components can all pass their unit
 * and axe tests while rendering wrong. A contrast token that regresses under
 * `darknight`, a radius that stops tightening under `operational`, a status
 * glyph that vanishes — none of those are type errors and none fail axe. They
 * are only visible.
 *
 * Scope is deliberately the **operational-critical set** first, per AD-D-014:
 * these are the components where a rendering regression is a safety issue, not
 * a cosmetic one. The list ratchets outward from here; it does not start wide
 * and shallow.
 *
 * Snapshots are committed and drift-gated, the same discipline as the icon
 * registry, the brand registry and the docs props. To accept an intended
 * change: `pnpm --filter @auxiliary/docs test:visual:update`, then review the
 * diff in the PR like any other generated artifact.
 */

const THEMES = ['light', 'dark', 'sunlight', 'darknight'] as const;
const REGISTERS = ['expressive', 'operational'] as const;

/**
 * The operational-critical set. Every entry is a `[data-specimen]` block in
 * .vitepress/theme/components/VisualSpecimens.vue.
 */
const SPECIMENS = [
  'status-badge',
  'alert-banner',
  'alert-annunciator',
  'guarded-action',
  'telemetry-value',
  'table',
] as const;

for (const theme of THEMES) {
  for (const register of REGISTERS) {
    test.describe(`${theme} · ${register}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/specimens?theme=${theme}&register=${register}`);
        // The harness renders nothing until it has read the query string and
        // seeded the alert model, so this also serves as the readiness gate.
        await expect(page.locator('.aux-specimens')).toHaveAttribute(
          'data-cell',
          `${theme}/${register}`,
        );
        // Web fonts shift metrics when they land. Without this the first
        // capture on a cold cache is a fallback-font screenshot.
        await page.evaluate(() => document.fonts.ready);
      });

      for (const specimen of SPECIMENS) {
        test(specimen, async ({ page }) => {
          await expect(page.locator(`[data-specimen="${specimen}"]`)).toHaveScreenshot(
            `${specimen}-${theme}-${register}.png`,
          );
        });
      }
    });
  }
}
