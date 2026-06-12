import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error — plain .mjs script, no declarations; the test only needs its exports.
import { generateRegistry, registryPath } from '../../scripts/sync.mjs';

/**
 * Drift gate for the committed registry — the same regenerate-and-compare
 * discipline the icons registry (CI step) and docs props
 * (apps/docs/test/props-drift.test.ts) already have. If brand.manifest.json
 * or assets/**.svg change without re-running `pnpm --filter @auxiliary/brand
 * sync`, this fails with the path to fix it.
 */
describe('registry.generated.ts is in sync with manifest + assets', () => {
  it('matches freshly generated output exactly', () => {
    const fresh = generateRegistry().contents;
    const committed = readFileSync(registryPath, 'utf8');
    expect(
      fresh === committed,
      'src/registry.generated.ts is stale — run `pnpm --filter @auxiliary/brand sync` and commit the result.',
    ).toBe(true);
    expect(fresh).toBe(committed);
  });
});
