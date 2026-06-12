/**
 * Color-vision-deficiency simulation for the viz-palette gate.
 *
 * Simulates dichromacy with the Machado, Oliveira & Fernandes (2009)
 * severity-1.0 matrices applied in linear sRGB, then measures perceptual
 * separation in OKLab (ΔEok) — i.e. "how far apart do these two series colors
 * look to a protanope/deuteranope/tritanope". This automates the Okabe-Ito
 * discipline: a categorical palette is only CVD-safe if every pair stays
 * separated under every simulated deficiency, per theme.
 *
 * Shares the oklch → linear sRGB pipeline with wcag.ts so the gate measures
 * the same gamut-clamped colors the contrast gates do.
 */
import { oklchToLinear } from './wcag';

type Oklch = [number, number, number];
type Mat3 = [number, number, number, number, number, number, number, number, number];

export type Dichromacy = 'protanopia' | 'deuteranopia' | 'tritanopia';

// Machado et al. (2009), severity 1.0, linear-RGB domain.
const CVD_MATRICES: Record<Dichromacy, Mat3> = {
  protanopia: [
    0.152286, 1.052583, -0.204868,
    0.114503, 0.786281, 0.099216,
    -0.003882, -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968,
    0.280085, 0.672501, 0.047413,
    -0.01182, 0.04294, 0.968881,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779,
    -0.078411, 0.930809, 0.147602,
    0.004733, 0.691367, 0.3039,
  ],
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function applyMat3(m: Mat3, [r, g, b]: [number, number, number]): [number, number, number] {
  return [
    clamp01(m[0] * r + m[1] * g + m[2] * b),
    clamp01(m[3] * r + m[4] * g + m[5] * b),
    clamp01(m[6] * r + m[7] * g + m[8] * b),
  ];
}

/** Linear sRGB → OKLab (Björn Ottosson's reference matrices). */
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

/** Simulate a dichromacy and return the result in OKLab. */
export function simulateCvd(c: Oklch, type: Dichromacy): [number, number, number] {
  return linearToOklab(applyMat3(CVD_MATRICES[type], oklchToLinear(c)));
}

/** ΔEok between two colors as seen under a simulated dichromacy. */
export function deltaEOkCvd(a: Oklch, b: Oklch, type: Dichromacy): number {
  const [L1, a1, b1] = simulateCvd(a, type);
  const [L2, a2, b2] = simulateCvd(b, type);
  return Math.hypot(L1 - L2, a1 - a2, b1 - b2);
}

export const DICHROMACIES: Dichromacy[] = ['protanopia', 'deuteranopia', 'tritanopia'];
