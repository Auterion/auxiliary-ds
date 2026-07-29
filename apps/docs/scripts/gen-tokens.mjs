/**
 * Generate the documentable-token manifest for the docs from @auxiliary/tokens'
 * BUILT CSS.
 *
 * Parses the *emitted* custom-property names out of `dist/tailwind-v4.css` rather
 * than walking the DTCG source tree: emitted names are the same contract a consumer
 * sees (`var(--alarm-emphasis)`), so the manifest can't disagree with reality, and
 * it stays correct across source-tier restructures that don't change output.
 *
 * Scope is deliberately narrow — the semantic theme roles (read off the
 * `[data-theme="light"]` block, which holds exactly the per-theme roles) plus any
 * `--component-*` tokens. The ~291 colour primitives are excluded on purpose:
 * packages/tokens/README calls them private ("Override semantics freely; treat
 * primitives as private"), so demanding a doc row for each would be noise.
 *
 * Output (.vitepress/data/tokens.generated.json) is COMMITTED — a drift test
 * regenerates and compares so it can't go stale, and a coverage test fails when a
 * semantic role is documented nowhere. Same discipline as the props manifest and
 * the icon registry. Without it, a renamed token only shows up as a silent `—` in
 * <TokenRow>, which no CI or screenshot review can see.
 *
 * Run `pnpm --filter @auxiliary/docs gen:tokens` after changing tokens.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
export const OUT_FILE = resolve(here, '..', '.vitepress', 'data', 'tokens.generated.json');

// Resolve the built tokens CSS through the package export (same as
// packages/css/test/register-orthogonality.test.ts) so no relative dist path is
// hard-coded. Requires `pnpm --filter @auxiliary/tokens build` to have run.
export const TOKENS_CSS = require.resolve('@auxiliary/tokens/dist/tailwind-v4.css');

/** The theme block whose declarations define the semantic role set. */
const ROLE_SOURCE_SELECTOR = '[data-theme="light"]';

/** Body (including braces) of the first selector block matching `selector`, or null. */
export function block(css, selector) {
  const start = css.indexOf(selector);
  if (start === -1) return null;
  let depth = 0;
  const from = css.indexOf('{', start);
  for (let i = from; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return css.slice(from, i + 1);
  }
  return null;
}

/** Declared custom-property names in a CSS fragment, without the leading `--`, deduped + sorted. */
function declaredNames(css) {
  const names = [...css.matchAll(/--([\w-]+)\s*:/g)].map((m) => m[1]);
  return [...new Set(names)].sort();
}

/** Build the manifest: { semantic: string[], component: string[] }. */
export function generateTokens(css = readFileSync(TOKENS_CSS, 'utf8')) {
  const themeBlock = block(css, ROLE_SOURCE_SELECTOR);
  if (!themeBlock) {
    throw new Error(`tokens CSS has no ${ROLE_SOURCE_SELECTOR} block — rebuild @auxiliary/tokens`);
  }
  return {
    // Per-theme semantic roles — the public, documentable contract.
    semantic: declaredNames(themeBlock),
    // Component-scoped tokens, wherever they're emitted (none today; the bucket
    // exists so they're covered the moment the tier lands).
    component: declaredNames(css).filter((n) => n.startsWith('component-')),
  };
}

export const serialize = (data) => JSON.stringify(data, null, 2) + '\n';

// Run as a script (skipped when imported by the drift test).
if (import.meta.url === `file://${process.argv[1]}`) {
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  const data = generateTokens();
  writeFileSync(OUT_FILE, serialize(data));
  console.log(
    `✓ wrote token manifest — ${data.semantic.length} semantic roles, ${data.component.length} component tokens → .vitepress/data/tokens.generated.json`,
  );
}
