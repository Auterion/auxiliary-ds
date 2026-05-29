import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Reduced-motion gate (ROADMAP cross-cutting: operational invariants).
 *
 * Defense/operational surfaces must be deterministic: motion may never hide or
 * obscure a state-bearing change, and the system must honor the user's
 * prefers-reduced-motion setting. theme.css ships a global reduce reset; this
 * locks it in so a refactor can't silently drop it.
 */

const here = dirname(fileURLToPath(import.meta.url));
const themeCss = readFileSync(resolve(here, '..', 'theme.css'), 'utf8');

/** The `@media (prefers-reduced-motion: reduce) { ... }` block body, if present. */
function reduceBlock(): string | null {
  const start = themeCss.search(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{/);
  if (start === -1) return null;
  let depth = 0;
  let i = themeCss.indexOf('{', start);
  const from = i;
  for (; i < themeCss.length; i++) {
    if (themeCss[i] === '{') depth++;
    else if (themeCss[i] === '}' && --depth === 0) return themeCss.slice(from, i + 1);
  }
  return null;
}

describe('reduced-motion: theme honors prefers-reduced-motion', () => {
  const block = reduceBlock();

  it('declares a prefers-reduced-motion: reduce block', () => {
    expect(block, 'theme.css must ship a prefers-reduced-motion reduce reset').toBeTruthy();
  });

  it('neutralizes animation and transition durations with !important', () => {
    expect(block).toMatch(/animation-duration:\s*0[^;]*!important/);
    expect(block).toMatch(/transition-duration:\s*0[^;]*!important/);
  });

  it('stops looping animations (iteration-count: 1)', () => {
    expect(block).toMatch(/animation-iteration-count:\s*1\s*!important/);
  });
});
