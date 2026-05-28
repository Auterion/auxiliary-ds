// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      // Generated — kept in sync by `pnpm --filter @auxiliary/icons sync`, not hand-edited.
      'packages/icons/src/registry.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  // Vue SFCs use the TS parser for their <script lang="ts"> blocks.
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
  },

  // Browser globals for component/runtime source.
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },

  // Node globals for build scripts, configs, and tooling.
  {
    files: ['**/*.{js,mjs,cjs}', '**/*.config.{ts,js,mjs}', '**/scripts/**', '**/build.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  {
    rules: {
      // Single-word primitive names (Button, Badge, Dialog) are intentional in a design system.
      'vue/multi-word-component-names': 'off',
      // TS-first props: optionality is expressed in the type; runtime defaults aren't required.
      'vue/require-default-prop': 'off',
      // Redundant with `withDefaults`, which vue-tsc already type-checks, and a false-positive
      // on union-typed props (e.g. `size?: SizeKey | number` with a string default).
      'vue/require-valid-default-prop': 'off',
      // Allow intentional unused args/vars when prefixed with `_`.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  {
    // The Icon renderer injects trusted, build-generated SVG markup — v-html is by design.
    files: ['packages/icons/**/*.vue'],
    rules: {
      'vue/no-v-html': 'off',
    },
  },

  {
    // Tests legitimately define small inline harness components to compose primitives under test.
    files: ['**/*.{test,spec}.{ts,js}', '**/__tests__/**'],
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },

  // Prettier last — turn off all formatting rules it would conflict with.
  prettier,
);
