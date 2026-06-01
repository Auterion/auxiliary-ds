/**
 * Streaming helpers — framework-agnostic, no DOM. The bounded-work primitives
 * that keep a live chart's data (and therefore its render cost) from growing
 * without limit, which is what keeps high-rate updates reflow-free.
 */

/**
 * Append `value` to a fixed-capacity series, dropping the oldest entries past
 * `capacity`. Returns a **new** array (reactivity-friendly). A streaming chart
 * holding a capped window does O(capacity) work per frame, not O(total).
 */
export function pushCapped<T>(series: readonly T[], value: T, capacity: number): T[] {
  if (capacity <= 0) return [];
  const start = series.length >= capacity ? series.length - capacity + 1 : 0;
  const next = series.slice(start);
  next.push(value);
  return next;
}

/**
 * Downsample x/y series to roughly `maxPoints`, preserving extremes: the data is
 * split into buckets and each contributes its min-y and max-y point (in x order),
 * so a transient telemetry spike survives instead of being averaged away. Returns
 * copies of the inputs untouched when already within budget.
 */
export function downsample(
  xs: readonly number[],
  ys: readonly number[],
  maxPoints: number,
): { xs: number[]; ys: number[] } {
  const n = Math.min(xs.length, ys.length);
  if (n <= maxPoints || maxPoints < 4) {
    return { xs: xs.slice(0, n), ys: ys.slice(0, n) };
  }
  const buckets = Math.floor(maxPoints / 2);
  const bucketSize = n / buckets;
  const outX: number[] = [];
  const outY: number[] = [];
  for (let b = 0; b < buckets; b++) {
    const start = Math.floor(b * bucketSize);
    const end = Math.min(n, Math.floor((b + 1) * bucketSize));
    if (end <= start) continue;
    let minI = start;
    let maxI = start;
    for (let i = start; i < end; i++) {
      if (ys[i]! < ys[minI]!) minI = i;
      if (ys[i]! > ys[maxI]!) maxI = i;
    }
    const [first, second] = minI <= maxI ? [minI, maxI] : [maxI, minI];
    outX.push(xs[first]!);
    outY.push(ys[first]!);
    if (second !== first) {
      outX.push(xs[second]!);
      outY.push(ys[second]!);
    }
  }
  return { xs: outX, ys: outY };
}
