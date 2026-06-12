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
      // Keep deps external so tree-shaking is about which OF OUR components
      // ship. The regex covers every @auxiliary subpath — enumerating them
      // once missed @auxiliary/css/format, which silently vendored it (plus
      // its mgrs dependency) into dist/.
      external: ['vue', 'reka-ui', /^@auxiliary\//],
      output: {
        // One JS chunk per source module (mirrors src/) instead of a single
        // bundle. With "sideEffects": false this lets a downstream bundler drop
        // unused components even when imported from the barrel. Per-component
        // export subpaths in package.json point at these emitted files.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
