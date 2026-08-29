import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      // The regex covers every @auxiliary subpath. Enumerating bare package
      // names misses `@auxiliary/css/recipes` and silently vendors the whole
      // recipe set — and tailwind-merge with it — into dist/.
      external: ['vue', /^@auxiliary\//],
      output: {
        // One chunk per source module, so a consumer importing only the bar
        // does not pull the launcher and its surface table.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
