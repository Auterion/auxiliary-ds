import { defineConfig } from 'vitest/config';

/**
 * Two test runners live in this package and must not collide.
 *
 *   test/*.test.ts        → vitest   (`pnpm test`)      — drift + coverage gates
 *   test/visual/*.spec.ts → playwright (`pnpm test:visual`) — screenshot gates
 *
 * Vitest's default `include` matches `*.spec.ts` too, so without this it would
 * try to run the Playwright specs in happy-dom and fail on `@playwright/test`.
 * Stating the boundary explicitly is cheaper than remembering it.
 */
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
  },
});
