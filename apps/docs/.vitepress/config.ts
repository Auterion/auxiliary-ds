import { defineConfig } from 'vitepress';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  title: 'Auxiliary',
  description: 'Auterion design system. Vue, Tailwind v4, framework-agnostic tokens, aerospace-grade alarm hierarchy.',

  // Use clean URLs in production (no .html suffix)
  cleanUrls: true,

  // Pre-1.0 hint in the page chrome
  lastUpdated: true,

  // Our ThemeSwitcher owns the 4-theme model end-to-end (light / dark /
  // sunlight / darknight). VitePress's built-in light/dark toggle would
  // double up the navbar and fight our data-theme attribute. Disable it.
  appearance: false,

  themeConfig: {
    siteTitle: 'Auxiliary',

    nav: [
      { text: 'Foundations', link: '/foundations/colors' },
      { text: 'Components', link: '/components/button' },
      {
        text: 'pre-1.0',
        items: [
          { text: 'GitHub', link: 'https://github.com/Auterion/auxiliary-ds' },
          { text: 'Demo (live)', link: 'http://localhost:5174' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Get started',
        items: [
          { text: 'Introduction', link: '/' },
        ],
      },
      {
        text: 'Foundations',
        items: [
          { text: 'Colors', link: '/foundations/colors' },
          { text: 'Typography', link: '/foundations/typography' },
          { text: 'Spacing', link: '/foundations/spacing' },
          { text: 'Radii', link: '/foundations/radii' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'StatusBadge', link: '/components/status-badge' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Auterion/auxiliary-ds' },
    ],

    footer: {
      message: 'Pre-1.0. APIs subject to change.',
      copyright: '© Auterion AG. UNLICENSED.',
    },

    search: {
      provider: 'local',
    },
  },

  vite: {
    // tailwindcss is typed against Vite 6; VitePress bundles Vite 5. Same
    // runtime API, type cast satisfies the older PluginOption shape.
    plugins: [tailwindcss() as never],
    resolve: {
      alias: {
        '@auxiliary/vue': fileURLToPath(new URL('../../../packages/vue/src/index.ts', import.meta.url)),
        '@auxiliary/icons': fileURLToPath(new URL('../../../packages/icons/src/index.ts', import.meta.url)),
      },
    },
  },
});
