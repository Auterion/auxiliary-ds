import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Inline-glyph stroke-weight gate.
 *
 * The hand-rolled SVGs in this package are one icon set and must read as one.
 * They did not: the check indicators in Select, Combobox and Checkbox carried
 * `stroke-width="3"` while every chevron, close and status glyph beside them
 * carried `2` — so two glyphs inside the SAME control rendered at 1.50px and
 * 1.17px effective stroke. Nothing measured it, because stroke weight is not a
 * token and never appears in a diff as a number anyone compares.
 *
 * One weight, one exception, stated: Spinner is a rotating ARC, not an icon.
 */
const primitivesDir = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Files whose stroke weight is deliberately not the glyph weight. */
const EXCEPTIONS = new Set(['Spinner.vue']);

function vueFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? vueFiles(join(dir, e.name)) : e.name.endsWith('.vue') ? [join(dir, e.name)] : [],
  );
}

describe('inline glyph stroke weight', () => {
  const files = vueFiles(primitivesDir);

  it('finds the glyph set it is meant to police', () => {
    const withStroke = files.filter((f) => readFileSync(f, 'utf8').includes('stroke-width='));
    expect(withStroke.length, 'no inline SVGs found — has the glyph set moved?').toBeGreaterThanOrEqual(10);
  });

  it('is a single weight across every inline glyph', () => {
    const offenders: string[] = [];
    for (const file of files) {
      const name = file.split('/').pop()!;
      if (EXCEPTIONS.has(name)) continue;
      for (const m of readFileSync(file, 'utf8').matchAll(/stroke-width="([\d.]+)"/g)) {
        if (m[1] !== '2') offenders.push(`${name}: stroke-width="${m[1]}"`);
      }
    }
    expect(
      offenders,
      `inline glyphs must all use stroke-width="2" (add to EXCEPTIONS with a reason if genuinely not an icon):\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  it('actually rejects a mismatched weight', () => {
    // Positive control — the matcher must catch the shape that was shipping.
    const sample = '<svg stroke-width="3"><path d="M1 1" /></svg>';
    const found = [...sample.matchAll(/stroke-width="([\d.]+)"/g)].filter((m) => m[1] !== '2');
    expect(found).toHaveLength(1);
  });
});
