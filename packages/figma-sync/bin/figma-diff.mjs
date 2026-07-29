#!/usr/bin/env node
/**
 * `pnpm figma:diff` — report how the Figma file has drifted from the token contract.
 *
 * Reads two files and writes none:
 *   dist/figma-expected.json  what code says Figma should contain (from the build)
 *   dist/figma-actual.json    what Figma actually contains (saved from a pull program)
 *
 * The fetch is a separate, interactive step on purpose. The Figma MCP is
 * interactively authenticated and the Variables REST API is Enterprise-only while
 * Auterion is on Organization tier (see the package README), so nothing here can — or
 * pretends to — reach Figma on its own. An agent session runs dist/pull.figma.js
 * through use_figma and saves the result; this compares the two documents offline,
 * which is what makes the comparator testable in CI at all.
 *
 * Usage:
 *   node bin/figma-diff.mjs [--actual <path>] [--expected <path>] [--map a=b,c=d]
 *                           [--json] [--check]
 *
 *   --check   exit 1 when there is drift (for a session gate; CI cannot fetch)
 *   --json    emit the raw report instead of the formatted one
 *   --map     rename Figma collections onto contract names, e.g.
 *             --map Global=Primitives,Theme=Semantic
 *             Needed when a file's collections were renamed by hand; without it the
 *             report is three missing collections and nothing else.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { diff, format } from '../src/diff.mjs';
import { decodePull, mapCollectionNames } from '../src/decode-pull.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(here, '..', 'dist');

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf('--' + name);
  return i === -1 ? fallback : argv[i + 1];
};
const has = (name) => argv.includes('--' + name);

const expectedPath = resolve(flag('expected', resolve(distDir, 'figma-expected.json')));
const actualPath = resolve(flag('actual', resolve(distDir, 'figma-actual.json')));

if (!existsSync(expectedPath)) {
  console.error(
    '✗ no ' + expectedPath + '\n' +
      '  Build it first:  pnpm --filter @auxiliary/tokens build && pnpm --filter @auxiliary/figma-sync build',
  );
  process.exit(2);
}
if (!existsSync(actualPath)) {
  console.error(
    '✗ no ' + actualPath + '\n' +
      '  This file is the Figma side, and only an authenticated session can produce it:\n' +
      '    1. pnpm --filter @auxiliary/figma-sync build\n' +
      '    2. run dist/pull.figma.js through the Figma MCP use_figma tool\n' +
      '    3. save its return value to dist/figma-actual.json\n' +
      '  The /figma-sync skill walks through it.',
  );
  process.exit(2);
}

const expected = JSON.parse(readFileSync(expectedPath, 'utf8'));
const rawActual = JSON.parse(readFileSync(actualPath, 'utf8'));

/** --map Global=Primitives,Theme=Semantic → { Global: 'Primitives', Theme: 'Semantic' } */
const mapping = Object.fromEntries(
  (flag('map', '') || '')
    .split(',')
    .filter(Boolean)
    .map((pair) => {
      const [from, to] = pair.split('=');
      if (!from || !to) {
        console.error('✗ --map expects comma-separated <figma>=<contract> pairs, got: ' + pair);
        process.exit(2);
      }
      return [from, to];
    }),
);

let actual;
try {
  // The pull may be saved either as the raw compact response or already decoded; accept
  // both so a hand-assembled paginated merge does not have to round-trip the encoder.
  actual = rawActual.format ? decodePull(rawActual) : rawActual;
} catch (e) {
  console.error('✗ ' + e.message);
  process.exit(2);
}
actual = mapCollectionNames(actual, mapping);

const report = diff(expected, actual, { expectedShadows: expected.shadows });

if (has('json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(format(report));
}

// Drift is not an error — it is the whole output. --check opts into an exit code for
// callers that want one; without it, a drifted file still exits 0 so the report can be
// piped and read.
if (has('check') && !report.clean) process.exit(1);
