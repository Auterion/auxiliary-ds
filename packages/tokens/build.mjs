import StyleDictionary from 'style-dictionary';
import { converter, formatHex, parse as parseColor } from 'culori';

const THEMES = ['light', 'dark', 'sunlight', 'darknight'];

const toSrgb = converter('rgb');
const isTheme = (t) => THEMES.includes(t.path[0]);

const kebabSegment = (s) => String(s).replace(/_/g, '-');
const cssName = (path) => path.map(kebabSegment).join('-');

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
 * Convert authoring-friendly token values into strict W3C DTCG shapes.
 * Our source files use CSS-like strings ("16px", "200ms", "cubic-bezier(...)"
 * "0 1px 2px rgb(...)") because they're readable and Style Dictionary's CSS
 * pipeline emits them straight through. The DTCG export needs the structured
 * forms validators and downstream tools (Paper, Magic Path, Pencil, etc.)
 * expect. Aliases (`{path}` strings) and color strings stay untouched.
 */
const DIM_RE = /^(-?\d*\.?\d+)([a-zA-Z%]+)?$/;
const CB_RE = /^cubic-bezier\(\s*([\d.\-]+)\s*,\s*([\d.\-]+)\s*,\s*([\d.\-]+)\s*,\s*([\d.\-]+)\s*\)$/;
// Strict-DTCG color $value object form (spec §8.1) in sRGB color space.
// Source values may be in any CSS color function (oklch, rgb, hex, hsl, …);
// culori normalises them to sRGB and we emit `{colorSpace, components, alpha,
// hex}`. We deliberately collapse to sRGB rather than carry the source space
// because most validators and design tools only round-trip sRGB cleanly; the
// perceptually-uniform OKLCH literals are still authoritative in tokens.css /
// tailwind-v4.css where browsers render them natively.
const toDtcgColor = (raw) => {
  if (typeof raw !== 'string') return null;
  const parsed = parseColor(raw);
  if (!parsed) return null;
  const rgb = toSrgb(parsed);
  if (!rgb) return null;
  // Clamp to gamut (oklch can encode out-of-gamut sRGB values), then round
  // to 6 decimals — keeps the file readable without losing perceptual fidelity.
  const round = (n) => Math.round(Math.max(0, Math.min(1, n)) * 1e6) / 1e6;
  const r = round(rgb.r ?? 0);
  const g = round(rgb.g ?? 0);
  const b = round(rgb.b ?? 0);
  const alpha = rgb.alpha ?? 1;
  const out = {
    colorSpace: 'srgb',
    components: [r, g, b],
    hex: formatHex({ mode: 'rgb', r, g, b }),
  };
  if (alpha !== 1) out.alpha = round(alpha);
  return out;
};

const toDtcgValue = (token) => {
  const raw = token.original?.$value ?? token.$value;
  // Aliases pass through verbatim — they're spec-compliant strings.
  if (typeof raw === 'string' && raw.startsWith('{') && raw.endsWith('}')) return raw;

  switch (token.$type) {
    case 'color': {
      const dtcg = toDtcgColor(raw);
      return dtcg ?? raw;
    }
    case 'dimension':
    case 'duration': {
      if (typeof raw === 'number') {
        return { value: raw, unit: token.$type === 'duration' ? 'ms' : 'px' };
      }
      const m = String(raw).match(DIM_RE);
      if (m) return { value: parseFloat(m[1]), unit: m[2] ?? (token.$type === 'duration' ? 'ms' : 'px') };
      return raw;
    }
    case 'cubicBezier': {
      const m = String(raw).match(CB_RE);
      if (m) return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])];
      if (Array.isArray(raw) && raw.length === 4) return raw.map(Number);
      return raw;
    }
    case 'shadow': {
      // Source authors shadows as CSS strings: "0 1px 2px 0 rgb(0 0 0 / 0.08)"
      // or composite "0 4px 8px -2px rgb(..), 0 2px 4px -2px rgb(..)".
      // DTCG wants { color, offsetX, offsetY, blur, spread } per layer.
      const layers = String(raw)
        .split(/,(?![^()]*\))/)
        .map((s) => s.trim())
        .map((layer) => {
          const m = layer.match(/^(-?\d+(?:\.\d+)?)(px|rem|em)?\s+(-?\d+(?:\.\d+)?)(px|rem|em)?\s+(-?\d+(?:\.\d+)?)(px|rem|em)?(?:\s+(-?\d+(?:\.\d+)?)(px|rem|em)?)?\s+(.+)$/);
          if (!m) return null;
          const dim = (v, u) => ({ value: parseFloat(v), unit: u ?? 'px' });
          return {
            color: toDtcgColor(m[9]) ?? m[9],
            offsetX: dim(m[1], m[2]),
            offsetY: dim(m[3], m[4]),
            blur: dim(m[5], m[6]),
            spread: m[7] != null ? dim(m[7], m[8]) : { value: 0, unit: 'px' },
          };
        });
      if (layers.every(Boolean)) return layers.length === 1 ? layers[0] : layers;
      return raw;
    }
    case 'fontFamily':
    case 'fontWeight':
    case 'number':
    default:
      return raw;
  }
};

/**
 * Strict DTCG single-file export. Consolidates every source token into one
 * nested JSON matching the W3C Design Tokens Community Group spec. Aliases
 * stay as `{path.to.token}` strings. Color values become structured objects
 * with colorSpace + components. Composite types (shadow, cubicBezier) emit
 * their spec'd object/array shapes. Dimension/duration emit { value, unit }.
 *
 * Consumed by any DTCG-aware design tool (Paper, Magic Path, Pencil, …) and
 * validates against the W3C DTCG spec.
 */
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
      node[t.path[t.path.length - 1]] = { $type: t.$type, $value: toDtcgValue(t) };
    }
    return JSON.stringify(tree, null, 2) + '\n';
  },
});

/**
 * Build-time invariant: every semantic theme token must be a `{path}` alias
 * to a primitive. Catches accidental "literal RGB" cells like the bespoke
 * OpenBridge night palette we deleted. Throws with a clear list of offenders.
 */
const assertPrimitivePurity = (dictionary) => {
  const offenders = [];
  for (const t of dictionary.allTokens) {
    if (!isTheme(t)) continue;
    const orig = t.original?.$value;
    const isAlias = typeof orig === 'string' && orig.startsWith('{') && orig.endsWith('}');
    if (!isAlias) {
      offenders.push(`  ${t.path.join('.')} = ${JSON.stringify(orig)}`);
    }
  }
  if (offenders.length > 0) {
    throw new Error(
      `Primitive-purity check failed — ${offenders.length} theme token(s) ` +
        `use literal values instead of {color.primitive.*} aliases:\n` +
        offenders.join('\n'),
    );
  }
};

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
    dtcg: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{ destination: 'tokens.json', format: 'json/dtcg' }],
    },
  },
});

// Run the purity assertion against a hydrated dictionary, then build.
const dict = await sd.getPlatformTokens('dtcg');
assertPrimitivePurity(dict);

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
