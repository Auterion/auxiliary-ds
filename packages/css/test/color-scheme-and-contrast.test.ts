import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * UA-painted chrome must follow the chosen theme, and an increased-contrast
 * request must be answered.
 *
 * `color-scheme` governs everything the user agent paints and no token can
 * reach — scrollbars, <select> popups, the caret, spellcheck underlines,
 * autofill backgrounds, native checkbox internals. It was declared once on bare
 * `:root` and never re-declared per `[data-theme]`, so it stayed frozen at the OS
 * preference while every token switched: `darknight` on a light laptop rendered
 * a scotopic palette behind white scrollbars and light-filled autofill, and
 * `sunlight` on a dark OS put dark UA chrome behind a glare-hardened white page.
 * Those are the two themes whose entire purpose is controlling emitted light.
 *
 * "Pick one switching mechanism and use it throughout" is the rule; this gates it.
 */

const require = createRequire(import.meta.url);
const tokensCss = readFileSync(require.resolve('@auxiliary/tokens/dist/tailwind-v4.css'), 'utf8');
const themeCss = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'theme.css'),
  'utf8',
);

describe('color-scheme follows [data-theme]', () => {
  it('keeps `light dark` on bare :root as the system-preference default', () => {
    expect(themeCss).toMatch(/:root\s*\{[^}]*color-scheme:\s*light dark/);
  });

  it.each([
    ['light', 'light'],
    ['sunlight', 'light'],
    ['dark', 'dark'],
    ['darknight', 'dark'],
  ])('declares color-scheme: %s → %s', (theme, scheme) => {
    // The selector list may group themes, so look for the attribute and the
    // scheme inside the same rule.
    const rules = [...themeCss.matchAll(/([^{}]*)\{([^}]*color-scheme:[^}]*)\}/g)];
    const match = rules.find(
      (r) => r[1]!.includes(`[data-theme="${theme}"]`) && r[2]!.includes(`color-scheme: ${scheme}`),
    );
    expect(match, `no rule sets color-scheme: ${scheme} for [data-theme="${theme}"]`).toBeTruthy();
  });

  it('covers every theme the token build emits', () => {
    // Positive control: if a fifth theme is added, this fails until it is paired
    // with a color-scheme — the gate cannot go quietly out of date.
    const emitted = [...tokensCss.matchAll(/\[data-theme="([a-z]+)"\]/g)].map((m) => m[1]!);
    const declared = [...themeCss.matchAll(/\[data-theme="([a-z]+)"\][^{]*\{[^}]*color-scheme/g)]
      .map((m) => m[1]!);
    for (const theme of new Set(emitted)) {
      const anyRule = themeCss.match(
        new RegExp(String.raw`[^{}]*\[data-theme="${theme}"\][^{}]*\{[^}]*color-scheme`),
      );
      expect(anyRule ?? declared.includes(theme), `theme "${theme}" has no color-scheme`).toBeTruthy();
    }
  });
});

describe('increased-contrast preference', () => {
  it('repoints un-themed roots at the hardened palettes', () => {
    const block = tokensCss.match(/@media \(prefers-contrast: more\)\s*\{[\s\S]*?\n\}/);
    expect(block, 'no prefers-contrast block emitted').toBeTruthy();
    const css = block![0];
    // Scoped so an explicit choice wins over an inferred preference.
    expect(css).toContain(':root:not([data-theme])');
    // …and it must actually carry token values, not just a color-scheme switch.
    expect((css.match(/--[a-z-]+:/g) ?? []).length).toBeGreaterThan(20);
    // The dark counterpart is nested inside.
    expect(css).toContain('prefers-color-scheme: dark');
  });
});

describe('forced-colors', () => {
  it('restates the focus ring, which is otherwise replaced by a system color', () => {
    const block = themeCss.match(/@media \(forced-colors: active\)\s*\{[\s\S]*?\n {2}\}/);
    expect(block, 'no forced-colors block').toBeTruthy();
    expect(block![0]).toMatch(/:focus-visible/);
    expect(block![0]).toMatch(/Highlight/);
  });
});
