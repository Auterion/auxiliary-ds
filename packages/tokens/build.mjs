import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFormat({
  name: 'css/tailwind-v4-theme',
  format: async ({ dictionary }) => {
    const lines = dictionary.allTokens.map((t) => `  --${t.name}: ${t.$value};`);
    return `@theme {\n${lines.join('\n')}\n}\n`;
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
        $value: t.$value,
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
      files: [
        {
          destination: 'tailwind-v4.css',
          format: 'css/tailwind-v4-theme',
        },
      ],
    },
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: ':root' },
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'typescript/tokens-const',
        },
      ],
    },
    figma: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'figma.tokens.json',
          format: 'json/dtcg',
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
