import { describe, expect, it } from 'vitest';
import { downsample, pushCapped } from './streaming';

describe('pushCapped', () => {
  it('appends below capacity', () => {
    expect(pushCapped([1, 2], 3, 5)).toEqual([1, 2, 3]);
  });

  it('drops the oldest at capacity (bounded window)', () => {
    expect(pushCapped([1, 2, 3], 4, 3)).toEqual([2, 3, 4]);
    // Repeated streaming stays at capacity, never grows.
    let s: number[] = [];
    for (let i = 0; i < 1000; i++) s = pushCapped(s, i, 50);
    expect(s).toHaveLength(50);
    expect(s.at(-1)).toBe(999);
    expect(s[0]).toBe(950);
  });

  it('returns a new array (does not mutate input)', () => {
    const input = [1, 2];
    const out = pushCapped(input, 3, 5);
    expect(out).not.toBe(input);
    expect(input).toEqual([1, 2]);
  });
});

describe('downsample', () => {
  it('passes through when already within budget', () => {
    const xs = [0, 1, 2];
    const ys = [5, 6, 7];
    expect(downsample(xs, ys, 100)).toEqual({ xs: [0, 1, 2], ys: [5, 6, 7] });
  });

  it('caps a large series to roughly maxPoints', () => {
    const n = 10_000;
    const xs = Array.from({ length: n }, (_v, i) => i);
    const ys = xs.map((x) => Math.sin(x / 10));
    const out = downsample(xs, ys, 200);
    expect(out.xs.length).toBeLessThanOrEqual(200);
    expect(out.xs.length).toBeGreaterThan(0);
  });

  it('preserves the global min and max (a spike survives)', () => {
    const n = 5000;
    const xs = Array.from({ length: n }, (_v, i) => i);
    const ys = xs.map(() => 0);
    ys[1234] = 999; // a transient spike
    ys[4321] = -999; // a transient dip
    const out = downsample(xs, ys, 100);
    expect(Math.max(...out.ys)).toBe(999);
    expect(Math.min(...out.ys)).toBe(-999);
  });
});
