import { defineConfig, postcssIsolateStyles } from 'vitepress';
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
      { text: 'Patterns', link: '/patterns/' },
      { text: 'Data viz', link: '/data-viz/' },
      {
        text: 'pre-1.0',
        items: [
          { text: 'GitHub', link: 'https://github.com/Auterion/auxiliary-ds' },
          { text: 'Demo (live)', link: 'http://localhost:5174' },
        ],
      },
    ],

    // Per-section sidebars (keyed by path prefix) so each area shows only its
    // own nav — the flat all-in-one list got unwieldy once Patterns landed.
    // VitePress picks the longest matching prefix; the `layout: home` index has
    // no sidebar. Top-nav (Foundations/Components/Patterns) crosses between them.
    sidebar: {
      '/foundations/': [
        {
          text: 'Foundations',
          items: [
            { text: 'Visual language', link: '/foundations/visual-language' },
            { text: 'Registers', link: '/foundations/registers' },
            { text: 'Voice & lexicon', link: '/foundations/voice-and-lexicon' },
            { text: 'Colors', link: '/foundations/colors' },
            { text: 'Typography', link: '/foundations/typography' },
            { text: 'Spacing', link: '/foundations/spacing' },
            { text: 'Radii', link: '/foundations/radii' },
            { text: 'Motion', link: '/foundations/motion' },
            { text: 'Layering & breakpoints', link: '/foundations/layering' },
            { text: 'Input & touch', link: '/foundations/input-and-touch' },
            { text: 'Conformance', link: '/foundations/conformance' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Components',
          items: [{ text: 'Overview', link: '/components/' }],
        },
        {
          text: 'Forms',
          items: [
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Combobox', link: '/components/combobox' },
            { text: 'Input', link: '/components/input' },
            { text: 'Label', link: '/components/label' },
            { text: 'NumberField', link: '/components/number-field' },
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
            { text: 'GuardedAction', link: '/components/guarded-action' },
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
            { text: 'Alert model', link: '/components/alert-model' },
            { text: 'CoordinateValue', link: '/components/coordinate-value' },
            { text: 'StatusBadge', link: '/components/status-badge' },
            { text: 'TelemetryValue', link: '/components/telemetry-value' },
          ],
        },
        {
          text: 'Data display',
          items: [
            { text: 'Avatar', link: '/components/avatar' },
            { text: 'Badge', link: '/components/badge' },
            { text: 'Table', link: '/components/table' },
          ],
        },
        {
          text: 'Layout',
          items: [
            { text: 'Accordion', link: '/components/accordion' },
            { text: 'Card', link: '/components/card' },
            { text: 'Register', link: '/components/register' },
            { text: 'Separator', link: '/components/separator' },
            { text: 'Tabs', link: '/components/tabs' },
          ],
        },
      ],
      '/patterns/': [
        {
          text: 'Patterns',
          items: [
            { text: 'Overview', link: '/patterns/' },
            { text: 'App shell', link: '/patterns/app-shell' },
            { text: 'Fleet table', link: '/patterns/fleet-table' },
            { text: 'Telemetry grid', link: '/patterns/telemetry-grid' },
            { text: 'Vehicle status card', link: '/patterns/vehicle-status-card' },
            { text: 'Pre-flight checklist', link: '/patterns/preflight-checklist' },
          ],
        },
      ],
      '/data-viz/': [
        {
          text: 'Data viz',
          items: [
            { text: 'Palette', link: '/data-viz/' },
            { text: 'Sparkline', link: '/data-viz/sparkline' },
            { text: 'Gauge', link: '/data-viz/gauge' },
            { text: 'Bars', link: '/data-viz/bars' },
            { text: 'Distribution', link: '/data-viz/distribution' },
            { text: 'Time series', link: '/data-viz/time-series' },
          ],
        },
      ],
    },

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
    // VitePress's theme-default base.css ships UNLAYERED element resets
    // (button/input { background:transparent; padding:0 }). Per the CSS cascade,
    // unlayered rules beat Tailwind v4's @layer utilities, so live demo components
    // would render unstyled. postcssIsolateStyles rewrites those base.css rules to
    // `:not(:where(.vp-raw, .vp-raw *))`, so they don't apply inside our
    // `.auxiliary-demo vp-raw` wrappers — letting Auxiliary utilities win there
    // without touching the shared @auxiliary/css or resorting to !important.
    // Default includeFiles is [/base\.css/], exactly the file with the reset.
    css: { postcss: { plugins: [postcssIsolateStyles()] } },
    resolve: {
      alias: {
        '@auxiliary/vue': fileURLToPath(new URL('../../../packages/vue/src/index.ts', import.meta.url)),
        '@auxiliary/icons': fileURLToPath(new URL('../../../packages/icons/src/index.ts', import.meta.url)),
      },
    },
  },
});
