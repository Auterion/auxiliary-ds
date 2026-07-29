import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@auxiliary/vue': fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url)),
      '@auxiliary/icons': fileURLToPath(new URL('../../packages/icons/src/index.ts', import.meta.url)),
      '@auxiliary/viz': fileURLToPath(new URL('../../packages/viz/src/index.ts', import.meta.url)),
    },
  },
});
