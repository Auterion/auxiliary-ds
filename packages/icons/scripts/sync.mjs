#!/usr/bin/env node
/**
 * Regenerates src/registry.ts from:
 *   - src/config.ts allow-list of Font Awesome Pro Sharp names
 *   - inputs/<name>.svg hand-authored Auterion glyphs
 *
 * Requires FONTAWESOME_PACKAGE_TOKEN in the environment for the FA Pro npm registry.
 * Custom-only syncs work without it.
 *
 * Run:  pnpm --filter @auxiliary/icons sync
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, '..');
const inputsDir = join(pkgRoot, 'inputs');
const configPath = join(pkgRoot, 'src/config.ts');
const registryOut = join(pkgRoot, 'src/registry.ts');

const WEIGHTS = ['thin', 'light', 'regular', 'solid'];
const WEIGHT_TO_PACKAGE = {
  thin: '@fortawesome/sharp-thin-svg-icons',
  light: '@fortawesome/sharp-light-svg-icons',
  regular: '@fortawesome/sharp-regular-svg-icons',
  solid: '@fortawesome/sharp-solid-svg-icons',
};

/* -------------------------------------------------------------------------- */
/* Load curated allow-list                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Reads src/config.ts and extracts FA_ICONS + CUSTOM_ICONS without compiling
 * the TS file. Uses a tiny regex parser because the config shape is constrained.
 */
async function loadConfig() {
  const src = await readFile(configPath, 'utf8');

  const faMatch = src.match(/export const FA_ICONS:[^=]*=\s*\[([\s\S]*?)\];/);
  const customMatch = src.match(/export const CUSTOM_ICONS:[^=]*=\s*\[([\s\S]*?)\];/);
  if (!faMatch || !customMatch) {
    throw new Error('Could not parse FA_ICONS / CUSTOM_ICONS from config.ts');
  }

  const parseEntries = (body) => {
    const entries = [];
    const re = /\{([^}]+)\}/g;
    let m;
    while ((m = re.exec(body)) !== null) {
      const obj = {};
      for (const [, key, val] of m[1].matchAll(/(\w+):\s*'([^']+)'/g)) {
        obj[key] = val;
      }
      // weights: [...] (string array form, optional)
      const weightsM = m[1].match(/weights:\s*\[([^\]]+)\]/);
      if (weightsM) {
        obj.weights = [...weightsM[1].matchAll(/'(\w+)'/g)].map((x) => x[1]);
      }
      if (obj.name) entries.push(obj);
    }
    return entries;
  };

  return {
    fa: parseEntries(faMatch[1]),
    custom: parseEntries(customMatch[1]),
  };
}

/* -------------------------------------------------------------------------- */
/* FA Pro source                                                              */
/* -------------------------------------------------------------------------- */

async function tryLoadFaWeight(weight) {
  try {
    return await import(WEIGHT_TO_PACKAGE[weight]);
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') return null;
    throw err;
  }
}

function faKey(name) {
  // chevron-right → faChevronRight
  return (
    'fa' +
    name
      .split('-')
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join('')
  );
}

function escapeSvg(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function shapeFromFa(icon) {
  // icon = [width, height, ligatures, unicode, pathData]
  const [width, height, , , pathData] = icon;
  const paths = Array.isArray(pathData) ? pathData : [pathData];
  const inner = paths.map((d) => `<path d="${d}"/>`).join('');
  return { viewBox: `0 0 ${width} ${height}`, inner };
}

/* -------------------------------------------------------------------------- */
/* Custom SVG source                                                          */
/* -------------------------------------------------------------------------- */

async function shapeFromFile(filename) {
  const path = join(inputsDir, `${filename}.svg`);
  if (!existsSync(path)) {
    throw new Error(`Custom icon source not found: inputs/${filename}.svg`);
  }
  const svg = await readFile(path, 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) {
    throw new Error(`inputs/${filename}.svg is missing a viewBox attribute`);
  }
  const inner = svg
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<svg\b[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim();
  return { viewBox, inner };
}

/* -------------------------------------------------------------------------- */
/* Emit                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const config = await loadConfig();

  // Load each FA weight package — degrade gracefully if not installed/authed
  const faModules = {};
  const missingWeights = [];
  for (const w of WEIGHTS) {
    const mod = await tryLoadFaWeight(w);
    if (mod) faModules[w] = mod;
    else missingWeights.push(w);
  }
  if (missingWeights.length === WEIGHTS.length) {
    console.warn(
      '⚠ No @fortawesome/sharp-*-svg-icons packages installed. Generating registry from custom inputs only.\n' +
        '  Set FONTAWESOME_PACKAGE_TOKEN and run `pnpm install` to enable FA-sourced icons.',
    );
  } else if (missingWeights.length > 0) {
    console.warn(`⚠ Missing FA weight packages: ${missingWeights.join(', ')}`);
  }

  const entries = {};

  // FA-sourced
  for (const spec of config.fa) {
    const wantedWeights = spec.weights ?? WEIGHTS;
    const weightsOut = {};
    let viewBox = null;
    for (const w of wantedWeights) {
      const mod = faModules[w];
      if (!mod) continue;
      const icon = mod[faKey(spec.fa)];
      if (!icon) {
        console.warn(`  · ${spec.name}: missing in @fortawesome/sharp-${w}-svg-icons`);
        continue;
      }
      const shape = shapeFromFa(icon.icon);
      weightsOut[w] = shape.inner;
      viewBox ??= shape.viewBox;
    }
    if (Object.keys(weightsOut).length === 0) {
      console.warn(`  · ${spec.name}: skipped — no FA weight packages resolved`);
      continue;
    }
    entries[spec.name] = { viewBox, weights: weightsOut };
  }

  // Custom-sourced
  for (const spec of config.custom) {
    const shape = await shapeFromFile(spec.file ?? spec.name);
    entries[spec.name] = { viewBox: shape.viewBox, weights: { regular: shape.inner } };
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

  const faCount = config.fa.length - config.fa.filter((s) => !(s.name in entries)).length;
  const customCount = config.custom.length;
  console.log(
    `✓ Wrote src/registry.ts — ${Object.keys(sorted).length} icons (${faCount} FA, ${customCount} custom)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
