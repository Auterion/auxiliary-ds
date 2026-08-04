import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { generateTokens, serialize, OUT_FILE } from '../scripts/gen-tokens.mjs';

/**
 * Token-documentation drift gate.
 *
 * <TokenRow> is a runtime component: it reads the custom property off the live
 * document, so a token that was renamed or deleted renders a silent em-dash —
 * invisible to CI and to screenshot review. These gates make the docs' token
 * inventory a checked artifact instead:
 *
 *   1. .vitepress/data/tokens.generated.json is committed and must match a fresh
 *      generate (same discipline as props.generated.json / the icon registry).
 *   2. Every <TokenRow token="X" /> must name a token that actually exists.
 *   3. Every semantic role must be documented *somewhere*, with an ALLOWLIST for
 *      the roles that have no prose today.
 *
 * The ALLOWLIST only ever ratchets DOWN (mirroring the "floors only ever ratchet
 * up" discipline in packages/tokens/test/contrast.test.ts): the last case fails if
 * an entry is in fact documented, so writing the missing docs forces the list to
 * shrink and the list can never rot into a permanent exemption.
 */
const here = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(here, '..');

/** Every authored docs page — the whole site, not just one section. */
function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = resolve(dir, entry.name);
    // node_modules is vendored, .vitepress holds build output + theme sources.
    if (entry.isDirectory()) return entry.name.startsWith('.') || entry.name === 'node_modules' ? [] : markdownFiles(full);
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

const allPagesText = markdownFiles(docsRoot)
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

const manifest = generateTokens();
const documentable = new Set([...manifest.semantic, ...manifest.component]);

/** Tokens named by a <TokenRow token="X" /> anywhere in the docs. */
const tokenRowNames = [...allPagesText.matchAll(/<TokenRow\b[^>]*\btoken="([^"]+)"/g)].map((m) => m[1]);

/**
 * A role counts as documented if a page renders a <TokenRow> for it or mentions
 * `--role` in prose/code. The trailing guard stops `--viz-diverging-1` from
 * satisfying a hypothetical `--viz-diverging-10`.
 */
function isDocumented(role: string): boolean {
  return new RegExp(`--${role}(?![\\w-])`).test(allPagesText) || tokenRowNames.includes(role);
}

/**
 * Semantic roles with no docs coverage today. This list only ever ratchets DOWN —
 * see the meta-test below, which fails the moment an entry becomes documented.
 * TODO(ratchet): burn this down — brand belongs in foundations/colors.md and the viz
 * ramps in data-viz/index.md. (`overlay` was retired when the Opacity/Blur sections
 * landed; the whole *-emphasis tier went when foundations/tokens.md grew its
 * fill-vs-ink table under "Choosing a name".)
 */
const ALLOWLIST = [
  'brand',
  'brand-foreground',
  'viz-categorical-5',
  'viz-categorical-6',
  'viz-diverging-1',
  'viz-diverging-2',
  'viz-diverging-3',
  'viz-diverging-4',
  'viz-diverging-5',
  'viz-sequential-1',
  'viz-sequential-2',
  'viz-sequential-3',
  'viz-sequential-4',
  'viz-sequential-5',
];

describe('token manifest stays in sync with the built tokens', () => {
  it('matches `pnpm --filter @auxiliary/docs gen:tokens` output', () => {
    const committed = readFileSync(OUT_FILE, 'utf8');
    expect(serialize(manifest)).toBe(committed);
  });
});

describe('token docs coverage', () => {
  it('every <TokenRow> names a token that exists', () => {
    const ghosts = [...new Set(tokenRowNames)].filter((name) => !documentable.has(name));
    expect(
      ghosts,
      `<TokenRow> references tokens that aren't emitted (they render as "—"): ${ghosts.join(', ')}`,
    ).toEqual([]);
  });

  it('documents every semantic role somewhere', () => {
    const undocumented = manifest.semantic.filter((role) => !isDocumented(role) && !ALLOWLIST.includes(role));
    expect(undocumented, `semantic roles with no docs at all: ${undocumented.join(', ')}`).toEqual([]);
  });

  it('ALLOWLIST holds nothing that is already documented (ratchet down only)', () => {
    const stale = ALLOWLIST.filter((role) => isDocumented(role) || !manifest.semantic.includes(role));
    expect(
      stale,
      `these are documented (or no longer exist) — remove them from ALLOWLIST: ${stale.join(', ')}`,
    ).toEqual([]);
  });
});
