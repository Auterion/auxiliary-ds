/**
 * WCAG 2.2 contrast utilities for the token gate.
 *
 * Reads the DTCG source of truth directly (primitive palette + semantic theme
 * files), resolves `{color.primitive.x.y}` references to oklch, converts
 * oklch -> oklab -> linear sRGB (gamut-clamped) -> WCAG relative luminance, and
 * computes contrast ratio (L1+0.05)/(L2+0.05). Validated by the self-check in
 * contrast.test.ts: black-on-white must equal 21.00.
 *
 * Source-based (not the built CSS) so the gate has no build dependency and
 * tests the authored tokens, not a downstream artifact.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, '..', 'src');

type Oklch = [number, number, number];

const readJson = (p: string): unknown => JSON.parse(readFileSync(p, 'utf8'));

const palette = readJson(resolve(srcDir, 'primitive', 'color', 'tailwind-palette.tokens.json'));

/** Resolve a `{color.primitive.red.700}` reference to its oklch string. */
function deref(reference: string): string {
  const path = reference.replace(/[{}]/g, '').split('.');
  let node: unknown = palette;
  for (const key of path) node = (node as Record<string, unknown>)[key];
  const value = (node as { $value?: string }).$value;
  if (typeof value !== 'string') throw new Error(`Unresolved token reference: ${reference}`);
  return value;
}

export function parseOklch(value: string): Oklch {
  const ref = value.trim().startsWith('{') ? deref(value) : value;
  const m = ref.match(/oklch\(([^)]+)\)/i);
  if (!m?.[1]) throw new Error(`Not an oklch value: ${ref}`);
  const parts = m[1].trim().split(/\s+/).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) throw new Error(`Bad oklch: ${ref}`);
  return [parts[0], parts[1], parts[2]] as Oklch;
}

function oklchToLinear([L, C, h]: Oklch): [number, number, number] {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((x) => Math.min(1, Math.max(0, x))) as [number, number, number];
}

/** WCAG relative luminance of an oklch color (after sRGB gamut clamp). */
export function luminance(c: Oklch): number {
  const [r, g, b] = oklchToLinear(c);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Linear-sRGB blue channel — proxy for darknight night-vision leakage. */
export function blueEnergy(c: Oklch): number {
  return oklchToLinear(c)[2];
}

/** WCAG 2.x contrast ratio between two oklch colors. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const la = luminance(a);
  const lb = luminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export type ThemeName = 'light' | 'dark' | 'sunlight' | 'darknight';

/** Load a theme's resolved semantic tokens: role -> oklch tuple. */
export function loadTheme(theme: ThemeName): Record<string, Oklch> {
  const file = readJson(resolve(srcDir, 'semantic', `${theme}.tokens.json`)) as Record<
    string,
    Record<string, { $value: string }>
  >;
  const roles = file[theme];
  if (!roles) throw new Error(`No "${theme}" block in ${theme}.tokens.json`);
  const out: Record<string, Oklch> = {};
  for (const [role, token] of Object.entries(roles)) out[role] = parseOklch(token.$value);
  return out;
}

/** Contrast ratio between two roles in a theme (e.g. 'alarm', 'alarm-foreground'). */
export function pairRatio(theme: Record<string, Oklch>, bg: string, fg: string): number {
  const bgColor = theme[bg];
  const fgColor = theme[fg];
  if (!bgColor || !fgColor) throw new Error(`Missing role(s): ${bg}, ${fg}`);
  return contrastRatio(bgColor, fgColor);
}
