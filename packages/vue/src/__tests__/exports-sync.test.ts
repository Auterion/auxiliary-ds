import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildExports, parseComponents } from '../../scripts/gen-exports.mjs';

/**
 * Exports drift guard (ROADMAP Phase 3: library-grade packaging).
 *
 * package.json "exports" is generated from src/index.ts (one subpath per
 * component, alongside the "." barrel). This fails if they drift — e.g. a new
 * component was added to index.ts but `pnpm gen:exports` wasn't re-run — the same
 * discipline as the committed icon registry.
 */

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, '..', '..');

describe('package exports stay in sync with index.ts', () => {
  it('matches `pnpm gen:exports` output (run it if this fails)', () => {
    const indexSrc = readFileSync(resolve(pkgRoot, 'src/index.ts'), 'utf8');
    const pkg = JSON.parse(readFileSync(resolve(pkgRoot, 'package.json'), 'utf8'));
    const expected = buildExports(parseComponents(indexSrc));
    expect(pkg.exports).toEqual(expected);
  });

  it('exposes a subpath for every barrel component', () => {
    const indexSrc = readFileSync(resolve(pkgRoot, 'src/index.ts'), 'utf8');
    const names = parseComponents(indexSrc).map((c) => c.name);
    expect(names.length).toBeGreaterThan(0);
    const pkg = JSON.parse(readFileSync(resolve(pkgRoot, 'package.json'), 'utf8'));
    for (const name of names) expect(pkg.exports).toHaveProperty(`./${name}`);
  });
});
