import { describe, expect, it } from 'vitest';
import { barRects, gaugeGeometry, histogram, sparklinePath } from './geometry';

describe('sparklinePath', () => {
  it('returns one point per value, spread across the width', () => {
    const geo = sparklinePath([1, 2, 3, 4], { width: 120, height: 32, padding: 2 });
    expect(geo.points).toHaveLength(4);
    expect(geo.points[0]!.x).toBe(2); // first at left padding
    expect(geo.points.at(-1)!.x).toBe(118); // last at width - padding
    // x strictly increases
    for (let i = 1; i < geo.points.length; i++) {
      expect(geo.points[i]!.x).toBeGreaterThan(geo.points[i - 1]!.x);
    }
  });

  it('inverts y (SVG y-down): a rising series ends higher on screen = smaller y', () => {
    const geo = sparklinePath([1, 2, 3, 4]);
    expect(geo.points.at(-1)!.y).toBeLessThan(geo.points[0]!.y);
    expect(geo.line.startsWith('M')).toBe(true);
    expect(geo.area.endsWith('Z')).toBe(true);
  });

  it('draws a centered flat line for an all-equal series (no divide-by-zero)', () => {
    const geo = sparklinePath([5, 5, 5], { height: 32, padding: 2 });
    for (const p of geo.points) expect(p.y).toBe(16); // mid of the box
  });

  it('handles empty input', () => {
    const geo = sparklinePath([]);
    expect(geo.points).toEqual([]);
    expect(geo.line).toBe('');
    expect(geo.last).toBeNull();
  });
});

describe('gaugeGeometry', () => {
  it('clamps the fraction into 0..1', () => {
    expect(gaugeGeometry(50, { min: 0, max: 100 }).fraction).toBeCloseTo(0.5);
    expect(gaugeGeometry(-20, { min: 0, max: 100 }).fraction).toBe(0);
    expect(gaugeGeometry(999, { min: 0, max: 100 }).fraction).toBe(1);
  });

  it('emits no value arc at the floor, a real arc above it', () => {
    expect(gaugeGeometry(0).value).toBe('');
    const mid = gaugeGeometry(60);
    expect(mid.value.startsWith('M')).toBe(true);
    expect(mid.value).toContain('A'); // an SVG arc command
    expect(mid.track).toContain('A');
  });

  it('derives radius from size and thickness', () => {
    const geo = gaugeGeometry(50, { size: 100, thickness: 10 });
    expect(geo.center).toBe(50);
    expect(geo.radius).toBe(45);
  });
});

describe('barRects', () => {
  it('emits one rect per value, baseline-aligned, tallest at the max', () => {
    const geo = barRects([1, 2, 4], { width: 120, height: 100, padding: 0, gap: 0 });
    expect(geo.rects).toHaveLength(3);
    expect(geo.max).toBe(4);
    // tallest bar (value 4) fills the inner height; bottoms align at the baseline
    expect(geo.rects[2]!.height).toBeGreaterThan(geo.rects[0]!.height);
    const baseline = geo.rects[2]!.y + geo.rects[2]!.height;
    for (const r of geo.rects) expect(r.y + r.height).toBeCloseTo(baseline, 1);
  });

  it('respects an explicit max and clamps negatives to zero height', () => {
    const geo = barRects([5, -3], { max: 10, height: 100, padding: 0 });
    expect(geo.rects[1]!.height).toBe(0);
  });

  it('handles empty input', () => {
    expect(barRects([]).rects).toEqual([]);
  });
});

describe('histogram', () => {
  it('bins samples and reports the modal count', () => {
    const h = histogram([0, 0, 0, 1, 9, 10], 10);
    expect(h.counts).toHaveLength(10);
    expect(h.counts.reduce((a, b) => a + b, 0)).toBe(6); // every sample counted
    expect(h.max).toBe(3); // the 0-bin holds three samples
  });

  it('puts the maximum sample in the last bin (no overflow)', () => {
    const h = histogram([0, 5, 10], 5);
    expect(h.counts[h.counts.length - 1]).toBe(1);
  });

  it('handles empty input', () => {
    expect(histogram([], 8)).toEqual({ bins: [], counts: [], max: 0 });
  });
});
