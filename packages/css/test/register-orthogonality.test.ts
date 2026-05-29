import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

/**
 * Register/theme orthogonality gate (ROADMAP §6g / Phase 6.2).
 *
 * The design system has two orthogonal axes that compose freely and must never
 * overlap:
 *   - [data-theme]    controls COLOR only (light/dark/sunlight/darknight)
 *   - [data-register] controls everything NON-color (density/radius/motion)
 *
 * If a color leaked into a register block, switching register would shift color
 * (breaking theme as the single owner of color); if a density/motion var leaked
 * into a theme block, switching theme would shift density. The token build
 * asserts this at source (assertRegisterOrthogonality in build.mjs); this gate
 * locks the *generated* CSS so a regression in the emitter is caught too.
 */

const require = createRequire(import.meta.url);
// Resolve the built tokens CSS via the package export so this doesn't hard-code
// a relative dist path.
const tokensCss = readFileSync(
  require.resolve('@auxiliary/tokens/dist/tailwind-v4.css'),
  'utf8',
);

/** Body (including braces) of the first selector block matching `selector`. */
function block(css: string, selector: string): string | null {
  const start = css.indexOf(selector);
  if (start === -1) return null;
  let depth = 0;
  const from = css.indexOf('{', start);
  for (let i = from; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return css.slice(from, i + 1);
  }
  return null;
}

const THEMES = ['light', 'dark', 'sunlight', 'darknight'];
// Anything the register axis is allowed to own — by emitted var prefix.
const NON_COLOR_PREFIXES = ['--control-height-', '--radius-', '--duration-', '--spacing'];

describe('register/theme orthogonality (generated CSS)', () => {
  const opBlock = block(tokensCss, '[data-register="operational"]');

  it('emits a [data-register="operational"] override block', () => {
    expect(opBlock, 'tokens build must emit the operational register block').toBeTruthy();
  });

  it('register block contains no color (theme owns all color)', () => {
    // No --color-* custom properties, and no color-bearing values (oklch/hex/rgb).
    expect(opBlock).not.toMatch(/--color-/);
    expect(opBlock).not.toMatch(/oklch\(|#[0-9a-fA-F]{3,8}\b|\brgb\(/);
  });

  it('register block only sets the non-color flex tokens', () => {
    const decls = opBlock!.match(/--[\w-]+(?=\s*:)/g) ?? [];
    expect(decls.length).toBeGreaterThan(0);
    for (const name of decls) {
      expect(
        NON_COLOR_PREFIXES.some((p) => name.startsWith(p)),
        `register declares ${name}, which is not a non-color flex token`,
      ).toBe(true);
    }
  });

  it('no theme block sets a density/motion/radius flex token (theme is color-only)', () => {
    for (const theme of THEMES) {
      const tBlock = block(tokensCss, `[data-theme="${theme}"]`);
      expect(tBlock, `missing [data-theme="${theme}"] block`).toBeTruthy();
      for (const prefix of NON_COLOR_PREFIXES) {
        expect(tBlock, `theme "${theme}" leaks a ${prefix} token`).not.toContain(`${prefix}`);
      }
    }
  });
});
