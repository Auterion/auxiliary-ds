import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AuxiliaryVue',
      fileName: 'auxiliary-vue',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@auxiliary/css', '@auxiliary/css/recipes', '@auxiliary/tokens'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
});
