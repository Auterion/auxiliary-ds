#!/usr/bin/env node
/**
 * Regenerates src/registry.ts from:
 *   - src/config.ts allow-list
 *   - inputs/<name>.svg           (single shape, used for every weight)
 *   - inputs/<weight>/<name>.svg  (per-weight shapes, when a vendor ships them)
 *
 * No network, no registry auth, no vendor dependency — this reads SVG files
 * off disk and emits static path data.
 *
 * Run:  pnpm --filter @auxiliary/icons sync
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, '..');
const inputsDir = join(pkgRoot, 'inputs');
const configPath = join(pkgRoot, 'src/config.ts');
const registryOut = join(pkgRoot, 'src/registry.ts');

const WEIGHTS = ['thin', 'light', 'regular', 'solid'];

/** Weight key used for single-shape icons. Icon.vue falls back to it from any weight. */
const DEFAULT_WEIGHT = 'regular';

/* -------------------------------------------------------------------------- */
/* Load curated allow-list                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Reads src/config.ts and extracts ICONS without compiling the TS file.
 * Uses a tiny regex parser because the config shape is constrained.
 */
async function loadConfig() {
  const src = await readFile(configPath, 'utf8');

  const match = src.match(/export const ICONS:[^=]*=\s*\[([\s\S]*?)\];/);
  if (!match) {
    throw new Error('Could not parse ICONS from config.ts');
  }

  const entries = [];
  const re = /\{([^}]+)\}/g;
  let m;
  while ((m = re.exec(match[1])) !== null) {
    const obj = {};
    for (const [, key, val] of m[1].matchAll(/(\w+):\s*'([^']+)'/g)) {
      obj[key] = val;
    }
    if (obj.name) entries.push(obj);
  }
  return entries;
}

/* -------------------------------------------------------------------------- */
/* SVG source                                                                 */
/* -------------------------------------------------------------------------- */

async function shapeFromFile(path, label) {
  const svg = await readFile(path, 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) {
    throw new Error(`${label} is missing a viewBox attribute`);
  }
  const inner = svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg\b[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .replace(/>\s+</g, '><')
    .trim();
  return { viewBox, inner };
}

/**
 * Resolves one icon to { viewBox, weights }. Per-weight files win; a flat
 * inputs/<file>.svg is used for every weight via the default-weight key.
 */
async function resolveIcon(spec) {
  const file = spec.file ?? spec.name;
  const weights = {};
  let viewBox = null;

  for (const w of WEIGHTS) {
    const path = join(inputsDir, w, `${file}.svg`);
    if (!existsSync(path)) continue;
    const shape = await shapeFromFile(path, `inputs/${w}/${file}.svg`);
    weights[w] = shape.inner;
    viewBox ??= shape.viewBox;
  }

  if (Object.keys(weights).length > 0) return { viewBox, weights };

  const flat = join(inputsDir, `${file}.svg`);
  if (!existsSync(flat)) {
    throw new Error(
      `No source for "${spec.name}" — expected inputs/${file}.svg or inputs/<weight>/${file}.svg`,
    );
  }
  const shape = await shapeFromFile(flat, `inputs/${file}.svg`);
  return { viewBox: shape.viewBox, weights: { [DEFAULT_WEIGHT]: shape.inner } };
}

function escapeSvg(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

/* -------------------------------------------------------------------------- */
/* Emit                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const config = await loadConfig();

  const entries = {};
  for (const spec of config) {
    entries[spec.name] = await resolveIcon(spec);
  }

  // Sort for stable diffs
  const sorted = Object.fromEntries(
    Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)),
  );

  const lines = [
    '/* eslint-disable */',
    '/**',
    ' * GENERATED FILE — do not edit by hand.',
    ' * Source: src/config.ts + inputs/*.svg',
    ' * Regenerate: pnpm --filter @auxiliary/icons sync',
    ' */',
    '',
    "export type IconWeight = 'thin' | 'light' | 'regular' | 'solid';",
    '',
    'export interface IconShape {',
    '  viewBox: string;',
    '  weights: Partial<Record<IconWeight, string>>;',
    '}',
    '',
    'export const ICON_REGISTRY = {',
  ];

  for (const [name, entry] of Object.entries(sorted)) {
    const weightLines = Object.entries(entry.weights)
      .map(([w, inner]) => `    ${w}: \`${escapeSvg(inner)}\``)
      .join(',\n');
    lines.push(`  '${name}': {`);
    lines.push(`    viewBox: '${entry.viewBox}',`);
    lines.push(`    weights: {`);
    lines.push(weightLines + ',');
    lines.push(`    },`);
    lines.push(`  },`);
  }

  lines.push('} as const satisfies Record<string, IconShape>;');
  lines.push('');
  lines.push('export type IconName = keyof typeof ICON_REGISTRY;');
  lines.push('');
  lines.push(
    'export const ICON_NAMES = Object.keys(ICON_REGISTRY) as readonly IconName[];',
  );
  lines.push('');

  await writeFile(registryOut, lines.join('\n'), 'utf8');

  console.log(`✓ Wrote src/registry.ts — ${Object.keys(sorted).length} icons`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
