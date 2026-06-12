import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { componentList } from '../scripts/gen-props.mjs';

/**
 * Docs coverage gate (ROADMAP Phase 4 acceptance: "every exported component has a
 * docs page; no component ships without one").
 *
 * Every component exported from @auxiliary/vue must be documented — proven by a
 * <PropsTable name="X" /> for it on some page (families document each part on the
 * family page). Adding a component without docs fails CI.
 */
const here = dirname(fileURLToPath(import.meta.url));
// vue components document under components/, viz charts under data-viz/.
const pageDirs = [resolve(here, '..', 'components'), resolve(here, '..', 'data-viz')];

const allPagesText = pageDirs
  .flatMap((dir) =>
    readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => readFileSync(resolve(dir, f), 'utf8')),
  )
  .join('\n');

describe('docs coverage', () => {
  const names = componentList().map((c) => c.name);

  it('documents every exported component with a <PropsTable>', () => {
    const undocumented = names.filter((name) => !allPagesText.includes(`name="${name}"`));
    expect(undocumented, `missing a <PropsTable> (and likely a docs page): ${undocumented.join(', ')}`).toEqual([]);
  });
});
