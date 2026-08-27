import { defineConfig } from 'vitest/config';

/**
 * The demo had no test suite at all — `"test": "echo TODO && exit 0"` — while
 * every gate protecting the library stopped at the package boundary. That gap
 * is not incidental: `apps/demo` is the most-copied code in this repo, it models
 * the real product surfaces, and a defect here propagates into product code in a
 * way the same defect in `packages/` never would.
 *
 * These gates are static analysis over source, not a browser. They are cheap on
 * purpose: the point is that they run on every commit, not that they replace
 * looking at the thing.
 */
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
  },
});
