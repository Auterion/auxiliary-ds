import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Structural guards for the Phase 5b token categories (z-index, breakpoints,
 * semantic typography). These are foundations other layers depend on, so lock
 * their shape: the z-index scale must stay a coherent ascending layering order
 * (a regression here silently breaks overlay stacking), breakpoints must ascend,
 * and the semantic type roles must alias the primitive scale (one source of truth).
 */
const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '..', 'src', 'primitive');
const read = (f: string) => JSON.parse(readFileSync(resolve(src, f), 'utf8'));

describe('z-index layering scale', () => {
  const z = read('z-index.tokens.json').z as Record<string, { $value: number }>;
  // Low → high. Overlay (scrim) sits below modal (content); toast surfaces above
  // modals (operational: alerts must not be hidden); tooltip is always on top.
  const ORDER = ['base', 'raised', 'sticky', 'nav', 'dropdown', 'overlay', 'modal', 'toast', 'tooltip'];

  it('defines the full named layering set', () => {
    expect(Object.keys(z).sort()).toEqual([...ORDER].sort());
  });

  it('is strictly ascending in layering order', () => {
    const values = ORDER.map((k) => z[k]!.$value);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]!, `${ORDER[i]} must sit above ${ORDER[i - 1]}`).toBeGreaterThan(values[i - 1]!);
    }
  });
});

describe('breakpoints', () => {
  const bp = read('breakpoint.tokens.json').breakpoint as Record<string, { $value: string }>;
  const ORDER = ['sm', 'md', 'lg', 'xl', '2xl'];
  const rem = (v: string) => parseFloat(v);

  it('defines sm…2xl and ascends', () => {
    expect(Object.keys(bp).sort()).toEqual([...ORDER].sort());
    const values = ORDER.map((k) => rem(bp[k]!.$value));
    for (let i = 1; i < values.length; i++) expect(values[i]!).toBeGreaterThan(values[i - 1]!);
  });
});

describe('semantic typography roles', () => {
  const text = read('typography.tokens.json').text as Record<string, { $value: string }>;

  it('exposes named roles that alias the primitive scale', () => {
    for (const role of ['caption', 'label', 'body', 'body-lg', 'title', 'heading']) {
      expect(text[role], `missing semantic role text.${role}`).toBeDefined();
      expect(text[role]!.$value, `text.${role} should alias a primitive size`).toMatch(/^\{text\.[a-z0-9]+\}$/);
    }
  });
});
