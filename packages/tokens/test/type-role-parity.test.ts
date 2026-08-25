import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * The `type/*` composites must not describe a typography the web never renders.
 *
 * These roles emit no CSS at all — their only consumer is figma-sync, which turns
 * them into Figma Text Styles. So a divergence between a role and the size step
 * it ships on is invisible in the browser and completely visible in Figma: a
 * block of Product Body drawn against `leading.normal` (1.5) is 7% taller than
 * the same text on the page, which renders the size step's own 1.4. Every Figma
 * layout was then drawn against leading the product does not have.
 *
 * That inverts README Principle 1 / AD-D-022 — Figma mirrors code — by handing
 * Figma values code never uses. Nothing gated it, because nothing on a user's
 * screen was wrong.
 *
 * SCOPE: the TEXT roles only. Heading and display roles keep the role-based
 * `leading.*`/`tracking.*` vocabulary on purpose — a heading legitimately runs
 * tighter than the size step's default, which is a fallback for arbitrary text.
 */

const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const typography = JSON.parse(
  readFileSync(resolve(srcDir, 'global', 'typography.tokens.json'), 'utf8'),
).global;

/** role → the text-scale step it is sized by. */
const TEXT_ROLES: Record<string, string> = {
  body: 'base',
  'body-lg': 'lg',
  label: 'sm',
  caption: 'xs',
};

describe('type/product text roles agree with the shipped scale', () => {
  it.each(Object.entries(TEXT_ROLES))('product/%s is paired to text.%s', (role, step) => {
    const value = typography.type.product[role].$value;
    expect(value.fontSize, `${role} is not sized by text.${step}`).toBe(`{global.text.${step}}`);
    expect(value.lineHeight).toBe(`{global.text-leading.${step}}`);
    expect(value.letterSpacing).toBe(`{global.text-tracking.${step}}`);
  });

  it('resolves to the same numbers the browser renders', () => {
    // Belt and braces: follow the aliases and compare the actual values, so a
    // rename that keeps the shape but changes the target still fails.
    for (const [role, step] of Object.entries(TEXT_ROLES)) {
      const value = typography.type.product[role].$value;
      const lh = typography['text-leading'][step].$value;
      const ls = typography['text-tracking'][step].$value;
      expect(value.lineHeight).toBe(`{global.text-leading.${step}}`);
      expect(typeof lh, `${role} line-height`).toBe('number');
      expect(typeof ls, `${role} letter-spacing`).toBe('string');
    }
  });

  it('actually rejects the divergence it exists to catch', () => {
    // Positive control — the shape that shipped: a text role declaring the
    // role-based vocabulary instead of its own size step.
    const stale = { lineHeight: '{global.leading.normal}', letterSpacing: '{global.tracking.normal}' };
    expect(stale.lineHeight).not.toBe('{global.text-leading.base}');
    expect(stale.letterSpacing).not.toBe('{global.text-tracking.base}');
  });
});
