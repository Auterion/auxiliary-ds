// Rasterizes the brand marks into the favicon / app-icon / OG outputs the manifest
// declares (appIcons.outputs), one folder per target under exports/<id>/.
//
//   node scripts/export-icons.mjs            # all targets that have a master mark
//   node scripts/export-icons.mjs auterion   # a single target
//
// Source of truth is the manifest + the inlined masters: for each target whose `mark`
// (and, for the OG template, `lockup-horizontal`) master is available, we bake the
// single-color `currentColor` master to the explicit inks each raster needs and shell
// out to ImageMagick. The marks are author with `currentColor`, so "bake" is a literal
// string swap — no separate light/dark master to maintain.
//
// Requires ImageMagick (`magick`, or `convert` on v6) on PATH; skips with a clear
// message if it's missing, so the build never hard-fails on a workstation without it.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, '..');
const assetsDir = resolve(pkgRoot, 'assets');
const outRoot = resolve(pkgRoot, 'exports');

// Brand inks + the solid ground used where transparency isn't allowed (apple-touch,
// PWA/maskable, OG). The mark is monochrome, so this is the whole palette.
const INK_DARK = '#0B0B0D'; // near-black ink on light surfaces
const INK_LIGHT = '#FFFFFF'; // light ink on dark surfaces
const GROUND = '#0B0B0D'; // solid icon/OG background (neutral near-black)

// --- locate ImageMagick ----------------------------------------------------
function findMagick() {
  for (const [cmd, pre] of [
    ['magick', []],
    ['convert', []],
  ]) {
    try {
      execFileSync(cmd, ['-version'], { stdio: 'ignore' });
      return (args) => execFileSync(cmd, [...pre, ...args], { stdio: ['ignore', 'ignore', 'inherit'] });
    } catch {
      /* try next */
    }
  }
  return null;
}
const magick = findMagick();
if (!magick) {
  console.error('[brand] export-icons: ImageMagick not found (need `magick` or `convert`). Skipping raster export.');
  process.exit(0);
}

// --- helpers ---------------------------------------------------------------
const manifest = JSON.parse(readFileSync(resolve(pkgRoot, 'brand.manifest.json'), 'utf8'));
const onlyTarget = process.argv[2];

/** Path of an available master for a logo+kind, or null if pending/missing. */
function masterFor(logo, kind) {
  const tones = logo.variants[kind] ?? {};
  const slot = tones.mono ?? tones.inverse ?? tones.color;
  if (!slot || slot === 'pending') return null;
  return resolve(assetsDir, slot);
}

/** Read a master and swap its `currentColor` fill for an explicit ink. */
function bake(masterPath, ink) {
  return readFileSync(masterPath, 'utf8').replaceAll('currentColor', ink);
}

/** Mark with no hard-coded fill, so an embedded <style> drives it (adaptive favicon). */
function strip(masterPath) {
  return readFileSync(masterPath, 'utf8').replace(/\s*fill="currentColor"/g, '');
}

let exported = 0;
for (const logo of manifest.logos) {
  if (onlyTarget && logo.id !== onlyTarget) continue;
  if (!manifest.appIcons.targets.includes(logo.id)) continue;

  const markMaster = masterFor(logo, 'mark');
  if (!markMaster) continue; // no mark yet — nothing to rasterize

  const dir = resolve(outRoot, logo.id);
  mkdirSync(dir, { recursive: true });
  const tmp = resolve(dir, '.tmp');
  mkdirSync(tmp, { recursive: true });
  const w = (name, svg) => {
    const p = resolve(tmp, name);
    writeFileSync(p, svg);
    return p;
  };

  const markDark = w('mark-dark.svg', bake(markMaster, INK_DARK));
  const markLight = w('mark-light.svg', bake(markMaster, INK_LIGHT));

  // Ship the baked single-tone marks too (handy for <img>, email, slides — no currentColor).
  writeFileSync(resolve(dir, 'mark-black.svg'), bake(markMaster, INK_DARK));
  writeFileSync(resolve(dir, 'mark-white.svg'), bake(markMaster, INK_LIGHT));

  // favicon.svg — one adaptive file: dark ink by default, light ink in dark UI.
  const innerSvg = strip(markMaster).replace(
    /(<svg[^>]*>)/,
    `$1<style>path{fill:${INK_DARK}}@media(prefers-color-scheme:dark){path{fill:${INK_LIGHT}}}</style>`,
  );
  writeFileSync(resolve(dir, 'favicon.svg'), innerSvg);

  // favicon.ico — multi-res, dark ink on transparent (legacy fallback to the .svg).
  magick([markDark, '-background', 'none', '-define', 'icon:auto-resize=48,32,16', resolve(dir, 'favicon.ico')]);

  // Square rasters: white mark centered on the solid ground, with breathing room.
  const square = (file, size, inner, bg, src) =>
    magick([
      '-background', bg, src, '-resize', `${inner}x${inner}`,
      '-gravity', 'center', '-background', bg, '-extent', `${size}x${size}`,
      resolve(dir, file),
    ]);

  square('apple-touch-icon.png', 180, 132, GROUND, markLight); // iOS adds its own mask/corners
  square('icon-192.png', 192, 140, GROUND, markLight);
  square('icon-512.png', 512, 376, GROUND, markLight);
  square('icon-maskable-512.png', 512, 300, GROUND, markLight); // ~80% safe zone for mask crop

  // og-image.png — 1200×630 template: lockup if present, else the mark, on the ground.
  const lockupMaster = masterFor(logo, 'lockup-horizontal');
  const ogSrc = lockupMaster ? w('og.svg', bake(lockupMaster, INK_LIGHT)) : markLight;
  const ogInner = lockupMaster ? '520x' : 'x300';
  magick([
    '-size', '1200x630', `xc:${GROUND}`,
    '(', '-background', 'none', ogSrc, '-resize', ogInner, ')',
    '-gravity', 'center', '-composite', resolve(dir, 'og-image.png'),
  ]);

  rmSync(tmp, { recursive: true, force: true });
  exported += 1;
  console.log(`[brand] export-icons: ${logo.id} → exports/${logo.id}/ (favicon.svg/.ico, app icons, og-image.png)`);
}

if (!exported) {
  console.log('[brand] export-icons: no targets with an available mark master — nothing to export.');
}
