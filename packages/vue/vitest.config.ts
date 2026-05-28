import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.vue', 'src/**/*.ts'],
      exclude: ['src/**/*.{test,spec}.ts', 'src/index.ts', 'src/**/__tests__/**', 'src/test-utils/**'],
      // Conservative floor below the current baseline (~95/95/89/95) — blocks regressions
      // without being brittle. Ratchet up as coverage of the thinner areas (Toast, Avatar) grows.
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 80,
        lines: 85,
      },
    },
  },
});
