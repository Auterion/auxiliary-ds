import StyleDictionary from 'style-dictionary';
import { formatHex, parse as parseColor } from 'culori';

const THEMES = ['light', 'dark', 'sunlight', 'darknight'];
const isTheme = (t) => THEMES.includes(t.path[0]);

const kebabSegment = (s) => String(s).replace(/_/g, '-');
const cssName = (path) => path.map(kebabSegment).join('-');

/**
 * Convert OKLCH/OKLab/LAB/LCH colors to sRGB hex for the figma.tokens.json
 * artifact. The DTCG Design Token Manager Figma plugin can't parse modern
 * color-space functions and silently falls back to white. The browser-bound
 * artifacts (tailwind-v4.css / tokens.css / tokens.ts) keep the OKLCH literals
 * so we don't lose perceptual accuracy in code.
 */
const toFigmaColor = (raw) => {
  if (typeof raw !== 'string') return raw;
  if (/^(oklch|oklab|lab|lch)\s*\(/i.test(raw)) {
    const parsed = parseColor(raw);
    const hex = parsed ? formatHex(parsed) : null;
    return hex ?? raw;
  }
  return raw;
};

const renderVars = (tokens, stripPrefix, indent = '  ') =>
  tokens
    .map((t) => {
      const path = stripPrefix ? t.path.slice(1) : t.path;
      return `${indent}--${cssName(path)}: ${t.$value};`;
    })
    .join('\n');

StyleDictionary.registerFormat({
  name: 'css/auxiliary-tailwind-themes',
  format: async ({ dictionary }) => {
    const primitives = dictionary.allTokens.filter((t) => !isTheme(t));
    const byTheme = Object.fromEntries(
      THEMES.map((name) => [name, dictionary.allTokens.filter((t) => t.path[0] === name)])
    );

    let out = '';
    // @theme: primitives + light defaults (Tailwind generates utilities from these)
    out += '@theme {\n';
    out += '  /* Primitives */\n';
    out += renderVars(primitives, false) + '\n\n';
    out += '  /* Semantic (light defaults) */\n';
    out += renderVars(byTheme.light, true) + '\n';
    out += '}\n\n';

    // System dark mode
    out += '@media (prefers-color-scheme: dark) {\n  :root {\n';
    out += renderVars(byTheme.dark, true, '    ') + '\n';
    out += '  }\n}\n\n';

    // Explicit overrides via [data-theme]
    for (const theme of THEMES) {
      out += `[data-theme="${theme}"] {\n`;
      out += renderVars(byTheme[theme], true) + '\n';
      out += '}\n';
      if (theme !== THEMES.at(-1)) out += '\n';
    }
    return out;
  },
});

StyleDictionary.registerFormat({
  name: 'css/auxiliary-vars',
  format: async ({ dictionary }) => {
    const primitives = dictionary.allTokens.filter((t) => !isTheme(t));
    const byTheme = Object.fromEntries(
      THEMES.map((name) => [name, dictionary.allTokens.filter((t) => t.path[0] === name)])
    );

    let out = '/* Generated — do not edit */\n\n';
    out += ':root {\n';
    out += renderVars(primitives, false) + '\n\n';
    out += renderVars(byTheme.light, true) + '\n';
    out += '}\n\n';

    out += '@media (prefers-color-scheme: dark) {\n  :root {\n';
    out += renderVars(byTheme.dark, true, '    ') + '\n';
    out += '  }\n}\n\n';

    for (const theme of THEMES) {
      out += `[data-theme="${theme}"] {\n`;
      out += renderVars(byTheme[theme], true) + '\n';
      out += '}\n\n';
    }
    return out;
  },
});

StyleDictionary.registerFormat({
  name: 'typescript/tokens-const',
  format: async ({ dictionary }) => {
    const tree = {};
    for (const t of dictionary.allTokens) {
      let node = tree;
      for (let i = 0; i < t.path.length - 1; i++) {
        const key = t.path[i];
        node[key] ??= {};
        node = node[key];
      }
      node[t.path[t.path.length - 1]] = t.$value;
    }
    return `export const tokens = ${JSON.stringify(tree, null, 2)} as const;\n`;
  },
});

StyleDictionary.registerFormat({
  name: 'json/dtcg',
  format: async ({ dictionary }) => {
    const tree = {};
    for (const t of dictionary.allTokens) {
      let node = tree;
      for (let i = 0; i < t.path.length - 1; i++) {
        const key = t.path[i];
        node[key] ??= {};
        node = node[key];
      }
      node[t.path[t.path.length - 1]] = {
        $type: t.$type,
        $value: t.$type === 'color' ? toFigmaColor(t.$value) : t.$value,
      };
    }
    return JSON.stringify(tree, null, 2) + '\n';
  },
});

const sd = new StyleDictionary({
  source: ['src/**/*.tokens.json'],
  platforms: {
    'tailwind-v4': {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [{ destination: 'tailwind-v4.css', format: 'css/auxiliary-tailwind-themes' }],
    },
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [{ destination: 'tokens.css', format: 'css/auxiliary-vars' }],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{ destination: 'tokens.ts', format: 'typescript/tokens-const' }],
    },
    figma: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{ destination: 'figma.tokens.json', format: 'json/dtcg' }],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
