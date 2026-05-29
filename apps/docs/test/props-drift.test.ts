import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateProps, serialize, OUT_FILE } from '../scripts/gen-props.mjs';

/**
 * Props metadata drift guard (ROADMAP Phase 4).
 *
 * .vitepress/data/props.generated.json is committed and rendered by <PropsTable>.
 * This regenerates it from @auxiliary/vue's source types and fails if the committed
 * copy is stale — so a prop rename can't silently rot the docs (the bug that left
 * button.md documenting `intent` after Phase 2 renamed it to `variant`). Same
 * discipline as the committed icon registry. Fix with `pnpm gen:props`.
 */
describe('props metadata stays in sync with component source', () => {
  it('matches `pnpm --filter @auxiliary/docs gen:props` output', () => {
    const committed = readFileSync(OUT_FILE, 'utf8');
    const fresh = serialize(generateProps());
    expect(fresh).toBe(committed);
  }, 30_000);
});
