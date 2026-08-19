/**
 * Accent ↔ status-ladder separation, measured live in the studio.
 *
 * WHY THIS EXISTS
 * ---------------
 * AD-D-010 dropped amber as a brand accent because it collides with the
 * `caution`/`warning` vocabulary — a judgement, correctly made, but never
 * turned into a number. So when a new accent is proposed there is nothing to
 * check it against: the CVD gate in packages/tokens covers the **viz palette**
 * and the per-theme contrast gates cover **text pairs**, but nothing measures
 * how far a brand accent sits from the reserved severity ladder (AD-D-014).
 *
 * This module is that measurement, rendered rather than asserted. It is the
 * evidence a future gate would be built on; it is deliberately not a gate yet
 * (studio only, per the direction-review scope).
 *
 * DUPLICATION, STATED
 * -------------------
 * The maths below mirrors `packages/tokens/test/wcag.ts` and
 * `packages/tokens/test/cvd.ts` — same Ottosson matrices, same Machado et al.
 * (2009) severity-1.0 dichromacy matrices, same OKLab ΔE. Those live in a test
 * directory and are not exported from the package, so a demo cannot import
 * them. **If this becomes a real gate, delete this file and export the shared
 * helpers instead** rather than letting two copies drift.
 */
import { tokens } from '@auxiliary/tokens';

export type Oklch = [number, number, number];
export type Dichromacy = 'protanopia' | 'deuteranopia' | 'tritanopia';
export type ThemeName = 'light' | 'dark' | 'sunlight' | 'darknight';

/** The reserved ladder. Order is severity, not preference. */
export const LEVELS = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;
export type Level = (typeof LEVELS)[number];

export const DICHROMACIES: Dichromacy[] = ['protanopia', 'deuteranopia', 'tritanopia'];

// Machado, Oliveira & Fernandes (2009), severity 1.0, linear-RGB domain.
const CVD_MATRICES: Record<Dichromacy, number[]> = {
  protanopia: [
    0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039,
  ],
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function parseOklch(value: string): Oklch | null {
  const m = value.match(/oklch\(([^)]+)\)/i);
  if (!m?.[1]) return null;
  const parts = m[1].split('/')[0]!.trim().split(/\s+/).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return [parts[0]!, parts[1]!, parts[2]!];
}

function oklchToLinear([L, C, h]: Oklch): [number, number, number] {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function linearToOklab([r, g, b]: [number, number, number]): [number, number, number] {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklab([L, C, h]: Oklch): [number, number, number] {
  const rad = (h * Math.PI) / 180;
  return [L, C * Math.cos(rad), C * Math.sin(rad)];
}

export function deltaEOk(a: Oklch, b: Oklch): number {
  const [L1, a1, b1] = oklab(a);
  const [L2, a2, b2] = oklab(b);
  return Math.hypot(L1 - L2, a1 - a2, b1 - b2);
}

function simulate(c: Oklch, type: Dichromacy): [number, number, number] {
  const m = CVD_MATRICES[type]!;
  const [r, g, b] = oklchToLinear(c);
  return linearToOklab([
    clamp01(m[0]! * r + m[1]! * g + m[2]! * b),
    clamp01(m[3]! * r + m[4]! * g + m[5]! * b),
    clamp01(m[6]! * r + m[7]! * g + m[8]! * b),
  ]);
}

export function deltaEOkCvd(a: Oklch, b: Oklch, type: Dichromacy): number {
  const [L1, a1, b1] = simulate(a, type);
  const [L2, a2, b2] = simulate(b, type);
  return Math.hypot(L1 - L2, a1 - a2, b1 - b2);
}

/**
 * The ladder's fills for a theme, straight from the token source rather than
 * from `getComputedStyle` — browsers re-serialise `oklch()` into whatever their
 * internal colour space is (Chrome hands back `lab(...)`), so reading the DOM
 * would mean parsing a moving target. `@auxiliary/tokens` hands back the
 * authored string.
 */
export function ladder(theme: ThemeName): Partial<Record<Level, Oklch>> {
  const t = tokens.theme[theme];
  const out: Partial<Record<Level, Oklch>> = {};
  for (const level of LEVELS) {
    const value: unknown = t[level];
    const parsed = typeof value === 'string' ? parseOklch(value) : null;
    if (parsed) out[level] = parsed;
  }
  return out;
}

export interface Separation {
  /** Smallest plain-sight ΔEok between the accent and any reserved level. */
  min: number;
  /** Which level it is closest to — the one that would be confused. */
  nearest: Level | null;
  /** Smallest ΔEok under any of the three simulated dichromacies. */
  minCvd: number;
  /** Which dichromacy produced that worst case. */
  worstCvd: Dichromacy | null;
}

/**
 * How far an accent sits from every reserved level, in plain sight and under
 * simulated colour-vision deficiency. Higher is safer; there is no ratified
 * floor yet, which is the point.
 */
export function separation(accent: Oklch | null, theme: ThemeName): Separation | null {
  if (!accent) return null;
  const levels = ladder(theme);
  let min = Infinity;
  let nearest: Level | null = null;
  let minCvd = Infinity;
  let worstCvd: Dichromacy | null = null;

  for (const level of LEVELS) {
    const fill = levels[level];
    if (!fill) continue;
    const d = deltaEOk(accent, fill);
    if (d < min) {
      min = d;
      nearest = level;
    }
    for (const type of DICHROMACIES) {
      const dc = deltaEOkCvd(accent, fill, type);
      if (dc < minCvd) {
        minCvd = dc;
        worstCvd = type;
      }
    }
  }

  if (!Number.isFinite(min)) return null;
  return { min, nearest, minCvd, worstCvd };
}
