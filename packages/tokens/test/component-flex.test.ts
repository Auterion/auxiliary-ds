/**
 * The component tier's two load-bearing mechanisms. Without this gate both can
 * silently degrade — the CSS still builds, the values still look plausible, and the
 * register axis just quietly stops reaching components.
 *
 * 1. Component tokens must emit as `var()` REFERENCES, not resolved literals. The
 *    build resolves every other tier to a literal, so this is the one place that
 *    deviates and the deviation is the entire point.
 * 2. Every register block must RE-EMIT the component declarations that depend on a
 *    var it shadows. Custom properties substitute var() at the element the
 *    declaration applies to and descendants inherit the substituted value, so a
 *    `:root`-only component var would keep its expressive value for any subtree that
 *    sets [data-register] below the root.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const tokensRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(resolve(tokensRoot, 'dist/tokens.css'), 'utf8');

/** Declarations inside the first block whose selector line starts with `selector`. */
function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`no ${selector} block in dist/tokens.css`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('\n}', open);
  const body = css.slice(open + 1, close);
  return Object.fromEntries(
    [...body.matchAll(/^\s*(--[\w\\.-]+):\s*(.+?);$/gm)].map((m) => [m[1]!, m[2]!]),
  );
}

/** The :root block that carries the component tier (the last one declared). */
function componentBlock(): Record<string, string> {
  const idx = css.lastIndexOf(':root {\n  --component-');
  expect(idx, 'no component :root block found').toBeGreaterThan(-1);
  const open = css.indexOf('{', idx);
  const close = css.indexOf('\n}', open);
  return Object.fromEntries(
    [...css.slice(open + 1, close).matchAll(/^\s*(--[\w\\.-]+):\s*(.+?);$/gm)].map((m) => [
      m[1]!,
      m[2]!,
    ]),
  );
}

describe('component tier follows [data-register]', () => {
  const components = componentBlock();

  it('emits a non-trivial component tier', () => {
    // Guards against a vacuous pass if the tier ever stops being emitted.
    expect(Object.keys(components).length).toBeGreaterThan(150);
  });

  it('declares every component var as a var() reference, never a literal', () => {
    const literals = Object.entries(components)
      .filter(([, value]) => !/^var\(--[\w\\.-]+\)$/.test(value))
      .map(([name, value]) => `${name}: ${value}`);
    expect(literals, 'a literal here freezes the token against [data-register]').toEqual([]);
  });

  it('points every reference at a var declared on :root', () => {
    const root = block(':root {');
    const dangling = Object.entries(components)
      .map(([name, value]) => [name, value.match(/^var\((--[\w\\.-]+)\)$/)?.[1]] as const)
      .filter(([, target]) => target && !(target in root))
      .map(([name, target]) => `${name} -> ${target}`);
    expect(dangling).toEqual([]);
  });

  it('re-emits, inside the register block, every component var that depends on it', () => {
    const operational = block('[data-register="operational"]');
    const missing = Object.entries(components)
      .filter(([name, value]) => {
        const target = value.match(/^var\((--[\w\\.-]+)\)$/)?.[1];
        return target && target in operational && !(name in operational);
      })
      .map(([name]) => name);
    expect(
      missing,
      'these would inherit their :root value in a [data-register] subtree',
    ).toEqual([]);
  });

  it('actually shifts a control height and a radius under the operational register', () => {
    const operational = block('[data-register="operational"]');
    // The end-to-end proof: the token points at the axis, and the axis moves.
    expect(components['--component-button-height-md']).toBe('var(--control-height-md)');
    expect(operational['--control-height-md']).toBe('32px');
    expect(operational['--component-button-height-md']).toBe('var(--control-height-md)');
    expect(operational['--component-button-radius']).toBe('var(--radius-md)');
    expect(operational['--radius-md']).toBe('4px');
  });

  it('never aliases the touch-target floor', () => {
    // --target-floor is re-declared by @media(pointer:coarse) and [data-input],
    // neither of which re-emits the component tier. Recipes must compose it.
    const offenders = Object.entries(components)
      .filter(([, v]) => v.includes('--target-'))
      .map(([n]) => n);
    expect(offenders).toEqual([]);
  });
});

describe('fractional spacing rungs are reachable', () => {
  it('emits the escaped form Tailwind looks up', () => {
    const root = block(':root {');
    // `--spacing-2-5` (the pre-GTC form) never matched Tailwind's `px-2.5` lookup,
    // leaving all three fractional rungs dead code.
    for (const [name, value] of [
      ['--spacing-0\\.5', '2px'],
      ['--spacing-1\\.5', '6px'],
      ['--spacing-2\\.5', '10px'],
      ['--spacing-3\\.5', '14px'],
    ] as const) {
      expect(root[name], `${name} missing`).toBe(value);
    }
    expect(root['--spacing-2-5'], 'the unreachable hyphen form must be gone').toBeUndefined();
  });
});
