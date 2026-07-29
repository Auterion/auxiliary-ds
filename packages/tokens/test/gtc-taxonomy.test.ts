/**
 * GTC model conformance — one `it()` per rule, so CI reports
 * "GTC: theme tokens store no raw values — FAILED" rather than "build.mjs threw".
 *
 * The rules themselves live in ../gtc-validate.mjs (which build.mjs also calls, so
 * `pnpm build` stays the hard gate). This file only partitions the findings.
 *
 * There is deliberately no KNOWN_GAPS allowlist: the tree is clean as of the GTC
 * migration and must stay that way. If you are adding one, you are almost
 * certainly meant to fix the token instead.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  collectTokens,
  type GtcFinding,
  isGtcLayout,
  loadSource,
  shippedComponentNames,
  validateGtc,
} from '../gtc-validate.mjs';

const tokensRoot = resolve(fileURLToPath(import.meta.url), '../..');
const repoRoot = resolve(tokensRoot, '../..');

const { tree } = loadSource(tokensRoot);
const tokens = collectTokens(tree);
const findings: GtcFinding[] = validateGtc(tokens, {
  gtcLayout: isGtcLayout(tree),
  componentNames: shippedComponentNames(repoRoot),
});

const of = (rule: string) => findings.filter((f) => f.rule === rule).map((f) => `${f.path}: ${f.message}`);

describe('GTC taxonomy', () => {
  it('parses a non-trivial token set', () => {
    // Guards against a silent-pass: an empty/failed load would make every rule below vacuous.
    expect(tokens.length).toBeGreaterThan(600);
  });

  it('every {alias} resolves', () => expect(of('alias-resolves')).toEqual([]));

  // Narrowed from GTC's "global aliases nothing" — Auxiliary's global tier carries a
  // role-alias layer (text.caption -> {text.xs}) and the type/* composites. See the
  // divergence table in gtc-validate.mjs.
  it('global never aliases outside global', () => expect(of('global-self-contained')).toEqual([]));

  it('theme/component/register never store raw values', () => expect(of('no-raw-outside-global')).toEqual([]));

  it('has no reference cycles', () => expect(of('no-cycles')).toEqual([]));

  it('has no color tokens under component.*', () => expect(of('no-component-color')).toEqual([]));

  it('keeps the theme and register axes orthogonal', () => expect(of('axis-orthogonality')).toEqual([]));

  it('uses factual numeric scale keys', () => expect(of('factual-scale-keys')).toEqual([]));

  it('names every level as a kebab word or a numeric scale key', () => expect(of('kebab-levels')).toEqual([]));

  it('keeps State as the terminal level', () => expect(of('state-terminal')).toEqual([]));

  it('gives every component size family a complete size vocabulary', () =>
    expect(of('size-suffix-parity')).toEqual([]));

  it('names component Elements after shipped components', () =>
    expect(of('component-element-known')).toEqual([]));

  it('reports no findings outside the rules asserted above', () => {
    // Fails if gtc-validate gains a rule nobody wired an it() for.
    const asserted = new Set([
      'alias-resolves', 'global-self-contained', 'no-raw-outside-global', 'no-cycles',
      'no-component-color', 'axis-orthogonality', 'factual-scale-keys', 'kebab-levels',
      'state-terminal', 'size-suffix-parity', 'component-element-known', 'group-first',
      'no-value-lead',
    ]);
    expect(findings.filter((f) => !asserted.has(f.rule))).toEqual([]);
  });
});
