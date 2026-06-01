import { describe, expect, it } from 'vitest';
import { gaugeGeometry, sparklinePath } from './geometry';

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
