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
      { text: 'Components', link: '/components/' },
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
          { text: 'Overview', link: '/components/' },
        ],
      },
      {
        text: 'Forms',
        items: [
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Input', link: '/components/input' },
          { text: 'Label', link: '/components/label' },
          { text: 'RadioGroup', link: '/components/radio-group' },
          { text: 'Select', link: '/components/select' },
          { text: 'Slider', link: '/components/slider' },
          { text: 'Switch', link: '/components/switch' },
          { text: 'Textarea', link: '/components/textarea' },
        ],
      },
      {
        text: 'Actions',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'DropdownMenu', link: '/components/dropdown-menu' },
        ],
      },
      {
        text: 'Overlays',
        items: [
          { text: 'Dialog', link: '/components/dialog' },
          { text: 'Popover', link: '/components/popover' },
          { text: 'Toast', link: '/components/toast' },
          { text: 'Tooltip', link: '/components/tooltip' },
        ],
      },
      {
        text: 'Feedback',
        items: [
          { text: 'Progress', link: '/components/progress' },
          { text: 'Skeleton', link: '/components/skeleton' },
          { text: 'Spinner', link: '/components/spinner' },
        ],
      },
      {
        text: 'Operational',
        items: [
          { text: 'AlertBanner', link: '/components/alert-banner' },
          { text: 'StatusBadge', link: '/components/status-badge' },
          { text: 'TelemetryValue', link: '/components/telemetry-value' },
        ],
      },
      {
        text: 'Data display',
        items: [
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Badge', link: '/components/badge' },
        ],
      },
      {
        text: 'Layout',
        items: [
          { text: 'Accordion', link: '/components/accordion' },
          { text: 'Card', link: '/components/card' },
          { text: 'Separator', link: '/components/separator' },
          { text: 'Tabs', link: '/components/tabs' },
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
