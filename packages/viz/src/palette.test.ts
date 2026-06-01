import { describe, expect, it } from 'vitest';
import {
  categorical,
  categoricalVars,
  diverging,
  divergingVars,
  sequential,
  sequentialVars,
  seriesColor,
  seriesVar,
} from './index';

describe('@auxiliary/viz palette surface', () => {
  it('exposes non-empty scales', () => {
    expect(categorical.length).toBeGreaterThanOrEqual(5);
    expect(sequential.length).toBeGreaterThan(0);
    expect(diverging.length).toBeGreaterThan(0);
  });

  it('resolved values are oklch strings', () => {
    for (const c of [...categorical, ...sequential, ...diverging]) {
      expect(c).toMatch(/^oklch\(/);
    }
  });

  it('var refs mirror each scale length and format', () => {
    expect(categoricalVars).toHaveLength(categorical.length);
    expect(sequentialVars).toHaveLength(sequential.length);
    expect(divergingVars).toHaveLength(diverging.length);
    expect(categoricalVars[0]).toBe('var(--viz-categorical-1)');
    expect(divergingVars.at(-1)).toBe(`var(--viz-diverging-${diverging.length})`);
  });

  it('seriesColor / seriesVar wrap past the palette length', () => {
    expect(seriesColor(0)).toBe(categorical[0]);
    expect(seriesColor(categorical.length)).toBe(categorical[0]);
    expect(seriesVar(1)).toBe(categoricalVars[1]);
    expect(seriesVar(categoricalVars.length + 1)).toBe(categoricalVars[1]);
  });
});
