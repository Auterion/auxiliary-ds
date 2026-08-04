import { defineConfig, devices } from '@playwright/test';

/**
 * Visual-regression config.
 *
 * Serves the *built* docs site rather than the dev server: dev-mode HMR
 * injects its own client and re-renders on file watch, which is exactly the
 * kind of nondeterminism a screenshot gate cannot tolerate. `vitepress build`
 * also runs the props/tokens generators via `prebuild`, so a stale generated
 * artifact fails here the same way it fails in vitest.
 *
 * One browser only. Chromium is what the operators' ground stations run and
 * what CI has; adding Firefox/WebKit would triple the snapshot count to gate
 * rendering differences we do not ship against.
 */
export default defineConfig({
  testDir: './test/visual',
  // Snapshots are committed and reviewed like any other generated artifact
  // (icon registry, brand registry, docs props). Keep them beside the spec.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  // A snapshot that only passes on a retry is not a passing snapshot.
  retries: 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: 'http://localhost:5173',
  },

  expect: {
    toHaveScreenshot: {
      // Sub-pixel antialiasing differs slightly between machines even at a
      // fixed DPR. This tolerance absorbs that without hiding a real 1px
      // shift — a moved border or a changed radius blows well past it.
      maxDiffPixelRatio: 0.002,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // These must come AFTER the spread: project-level `use` overrides the
        // top-level block, and `devices['Desktop Chrome']` carries its own
        // viewport and deviceScaleFactor that would otherwise win.
        //
        // Pin every rasteriser input. A different window size, DPR, or
        // reduced-motion setting renders different pixels and would read as a
        // component regression.
        viewport: { width: 1280, height: 900 },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        // `reducedMotion` lives under contextOptions as of Playwright 1.62.
        contextOptions: { reducedMotion: 'reduce' },
      },
    },
  ],

  webServer: {
    command: 'pnpm build && pnpm preview',
    url: 'http://localhost:5173/specimens',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
