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

/**
 * Token types that aren't usable as Figma Variables. Figma's variable types
 * are number / color / string / boolean — no cubic-bezier, no composite
 * shadows. Designers apply easing and shadow via Figma's Effect panel, not
 * via Variables. Filtering these out of the figma artifact keeps the import
 * clean (no plugin warnings). They remain in the CSS/TS artifacts where
 * they're actually consumed.
 */
const FIGMA_SKIP_TYPES = new Set(['cubicBezier', 'shadow']);

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

/**
 * Convert hex/named color → Figma's {r,g,b,a} 0-1 float shape.
 */
const toFigmaRgba = (raw) => {
  const hex = toFigmaColor(raw);
  const parsed = parseColor(hex);
  if (!parsed) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: parsed.r ?? 0,
    g: parsed.g ?? 0,
    b: parsed.b ?? 0,
    a: parsed.alpha ?? 1,
  };
};

/**
 * DTCG token type → Figma `resolvedType`.
 */
const figmaResolvedType = (dtcgType) => {
  if (dtcgType === 'color') return 'COLOR';
  return 'FLOAT'; // dimension, number, fontWeight, duration → all numeric
};

/**
 * Convert a DTCG value to Figma's variable value shape (NOT alias-aware —
 * caller handles aliases).
 */
const toFigmaValue = (token) => {
  if (token.$type === 'color') return toFigmaRgba(token.$value);
  if (typeof token.$value === 'string') {
    // strip "px", "ms", etc. and return a float
    const n = parseFloat(token.$value);
    return Number.isFinite(n) ? n : 0;
  }
  if (typeof token.$value === 'number') return token.$value;
  return 0;
};

/**
 * Figma-name path: slash-separated, kebab-cased segments.
 * `['color', 'primitive', 'zinc', '900']` → `color/primitive/zinc/900`
 * `['spacing', '0_5']` → `spacing/0-5`
 */
const figmaName = (path) => path.map(kebabSegment).join('/');

/**
 * Synthetic ID generator — stable per token path so re-runs produce the
 * same JSON. The DTCG Design Token Manager plugin maps these to its own
 * Figma IDs at import time; IDs in the JSON only need to be unique within
 * the JSON (used for VARIABLE_ALIAS references).
 */
const idForVariable = (collectionShort, path) =>
  `var_${collectionShort}_${path.map(kebabSegment).join('_')}`;

/**
 * Token types Figma Variables don't natively support — `STRING` works for
 * font family / tracking but adds noise; we keep them out of the figma
 * artifact for now and let designers consume them through Effect Styles /
 * inline values.
 */
const FIGMA_INCLUDE_TYPES = new Set([
  'color',
  'dimension',
  'number',
  'fontWeight',
  'duration',
]);

/**
 * Emit the full Figma-native variable export the DTCG Design Token Manager
 * plugin uses both as its export format AND its single-file import format.
 * Produces two collections (Primitives, Themes) with proper Modes and
 * cross-collection variable aliases — exactly the end-state designers want.
 */
StyleDictionary.registerFormat({
  name: 'json/figma-plugin-export',
  format: async ({ dictionary }) => {
    const all = dictionary.allTokens.filter(
      (t) => !FIGMA_SKIP_TYPES.has(t.$type) && FIGMA_INCLUDE_TYPES.has(t.$type),
    );

    const PRIMITIVES_COLL_ID = 'collection_primitives';
    const THEMES_COLL_ID = 'collection_themes';
    const PRIMITIVES_MODE_ID = 'mode_primitives_default';
    const THEME_MODE_IDS = Object.fromEntries(
      THEMES.map((t) => [t, `mode_${t}`]),
    );

    const titleCase = (s) => s[0].toUpperCase() + s.slice(1);

    const collections = [
      {
        id: PRIMITIVES_COLL_ID,
        name: 'Primitives',
        modes: [{ modeId: PRIMITIVES_MODE_ID, name: 'Mode 1' }],
        defaultModeId: PRIMITIVES_MODE_ID,
      },
      {
        id: THEMES_COLL_ID,
        name: 'Themes',
        modes: THEMES.map((t) => ({
          modeId: THEME_MODE_IDS[t],
          name: titleCase(t),
        })),
        defaultModeId: THEME_MODE_IDS.light,
      },
    ];

    // Primitive variables — one per non-theme token, single mode value.
    const primitiveTokens = all.filter((t) => !isTheme(t));
    const primitiveVars = primitiveTokens.map((t) => ({
      id: idForVariable('prim', t.path),
      name: figmaName(t.path),
      description: '',
      resolvedType: figmaResolvedType(t.$type),
      scopes: ['ALL_SCOPES'],
      variableCollectionId: PRIMITIVES_COLL_ID,
      valuesByMode: {
        [PRIMITIVES_MODE_ID]: toFigmaValue(t),
      },
    }));

    // Map each primitive's source path (e.g. `color.primitive.zinc.900`)
    // to its variable id, so we can resolve DTCG aliases → VARIABLE_ALIAS.
    const primIdByDottedPath = new Map();
    for (const t of primitiveTokens) {
      primIdByDottedPath.set(t.path.join('.'), idForVariable('prim', t.path));
    }

    // Semantic variables — group theme tokens by their post-prefix path
    // (`light.bg.canvas` and `dark.bg.canvas` → `bg/canvas`).
    const semanticGroups = new Map();
    for (const t of all) {
      if (!isTheme(t)) continue;
      const [theme, ...rest] = t.path;
      const semKey = rest.join('.');
      if (!semanticGroups.has(semKey)) {
        semanticGroups.set(semKey, { path: rest, byTheme: {} });
      }
      semanticGroups.get(semKey).byTheme[theme] = t;
    }

    const semanticVars = [];
    for (const [, group] of semanticGroups) {
      const sampleToken =
        group.byTheme.light ?? Object.values(group.byTheme)[0];
      const valuesByMode = {};
      for (const theme of THEMES) {
        const t = group.byTheme[theme];
        if (!t) continue;
        const modeId = THEME_MODE_IDS[theme];

        // If the source value is a DTCG alias like {color.primitive.zinc.900},
        // emit a VARIABLE_ALIAS pointing at the primitive variable. Otherwise
        // emit a direct value.
        const orig = t.original?.$value;
        if (
          typeof orig === 'string' &&
          orig.startsWith('{') &&
          orig.endsWith('}')
        ) {
          const refPath = orig.slice(1, -1);
          const targetId = primIdByDottedPath.get(refPath);
          if (targetId) {
            valuesByMode[modeId] = { type: 'VARIABLE_ALIAS', id: targetId };
            continue;
          }
        }
        valuesByMode[modeId] = toFigmaValue(t);
      }

      semanticVars.push({
        id: idForVariable('theme', group.path),
        name: figmaName(group.path),
        description: '',
        resolvedType: figmaResolvedType(sampleToken.$type),
        scopes: ['ALL_SCOPES'],
        variableCollectionId: THEMES_COLL_ID,
        valuesByMode,
      });
    }

    return (
      JSON.stringify(
        {
          variables: [...primitiveVars, ...semanticVars],
          collections,
          exportedAt: new Date().toISOString(),
          pluginVersion: 'auxiliary-1.0.0',
        },
        null,
        2,
      ) + '\n'
    );
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
      files: [
        {
          destination: 'figma.tokens.json',
          format: 'json/figma-plugin-export',
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
