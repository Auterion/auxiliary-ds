/**
 * The Figma Plugin API program that builds component sets from the component schema,
 * one-way (code → Figma). Run via `use_figma`; build-program.mjs prepends the `SPEC`
 * constant, producing a self-contained program.
 *
 * It interprets nothing. Every decision — which CSS property becomes which Figma
 * property, which state earns a variant, which of two `var()` references is the design
 * value — was made in src/component-spec.mjs, in Node, under test. This applies the
 * result. That split is deliberate: a program shipped as a string through an MCP tool
 * has no debugger and a 50 000-character budget, and is the worst possible place to
 * keep logic worth arguing about.
 *
 * Idempotent: sets are matched by name on the Components page and reconciled in place —
 * variants are updated, missing ones added, extras removed — so re-running never
 * duplicates. Re-running is also how a recipe change reaches Figma.
 *
 * NOTE: this whole file is embedded into a template literal by build-program.mjs
 * — never use a backtick here, not even inside a comment.
 */
export const COMPONENTS_PROGRAM = String.raw`
const PAGE_NAME = 'Components';

// Qualified "Collection/name" -> Variable. The spec addresses every binding this way,
// which is why the token push must run first: a variable that does not exist yet
// cannot be bound, and silently skipping it would produce a component that looks
// right and carries no tokens at all.
const allColls = await figma.variables.getLocalVariableCollectionsAsync();
const collById = new Map(allColls.map((c) => [c.id, c]));
const collByName = new Map(allColls.map((c) => [c.name, c]));
const byQualified = new Map();
for (const v of await figma.variables.getLocalVariablesAsync()) {
  const c = collById.get(v.variableCollectionId);
  if (c) byQualified.set(c.name + '/' + v.name, v);
}

const missingVars = new Set();
function variableFor(binding) {
  if (!binding) return null;
  const v = byQualified.get(binding.figma);
  if (!v) missingVars.add(binding.figma);
  return v || null;
}

// The Component collection's size axis. A variant sets the mode ONCE on its frame and
// every bound structural variable resolves at that size together — which is the whole
// reason the exporter collapses the size path segment into modes.
const componentColl = collByName.get('Component');
function applyMode(node, mode) {
  if (!mode || !componentColl) return;
  const m = componentColl.modes.find((x) => x.name === mode);
  if (m) node.setExplicitVariableModeForCollection(componentColl, m.modeId);
}

// setBoundVariableForPaint returns a NEW paint — it never mutates in place, and fills
// are read-only arrays besides. Both facts bite silently if ignored.
function paintBound(variable, fallback) {
  const base = { type: 'SOLID', color: fallback || { r: 0.5, g: 0.5, b: 0.5 } };
  return variable ? figma.variables.setBoundVariableForPaint(base, 'color', variable) : base;
}

function bindFloat(node, field, binding) {
  const v = variableFor(binding);
  if (v) node.setBoundVariable(field, v);
  return !!v;
}

const page = figma.root.children.find((p) => p.name === PAGE_NAME) || figma.createPage();
page.name = PAGE_NAME;
await figma.setCurrentPageAsync(page);

// Fonts must be loaded before any text is written or mutated. Load every style the
// spec asks for up front; a family that will not load is reported, not thrown, so one
// missing font cannot roll back every component.
const fontStyles = new Set();
for (const set of Object.values(SPEC)) {
  for (const v of set.variants) if (v.text) fontStyles.add(v.text.fontStyle);
}
const fonts = {};
const fontFailures = [];
for (const style of fontStyles) {
  let loaded = null;
  for (const family of ['Inter', 'Inter Variable']) {
    for (const s of [style, style.replace(/\s+/g, '')]) {
      try { await figma.loadFontAsync({ family, style: s }); loaded = { family, style: s }; break; } catch (e) {}
    }
    if (loaded) break;
  }
  if (loaded) fonts[style] = loaded;
  else fontFailures.push(style);
}
const anyFont = Object.values(fonts)[0] || null;

function buildVariant(spec) {
  const frame = figma.createComponent();
  frame.name = spec.name;
  frame.layoutMode = spec.frame.layout;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.counterAxisAlignItems = spec.frame.align;
  frame.primaryAxisAlignItems = spec.frame.justify;
  return frame;
}

function applyVariant(frame, spec) {
  frame.name = spec.name;
  frame.layoutMode = spec.frame.layout;
  frame.counterAxisAlignItems = spec.frame.align;
  frame.primaryAxisAlignItems = spec.frame.justify;
  applyMode(frame, spec.mode);

  const f = spec.frame;
  frame.fills = f.fill ? [paintBound(variableFor(f.fill))] : [];
  frame.strokes = f.stroke ? [paintBound(variableFor(f.stroke))] : [];
  if (f.strokeWeight) bindFloat(frame, 'strokeWeight', f.strokeWeight);
  else if (f.stroke) frame.strokeWeight = 1;
  frame.opacity = 1;
  if (f.opacity) bindFloat(frame, 'opacity', f.opacity);

  for (const corner of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) {
    if (f.radius) bindFloat(frame, corner, f.radius);
  }
  if (f.gap) bindFloat(frame, 'itemSpacing', f.gap);
  if (f.paddingX) { bindFloat(frame, 'paddingLeft', f.paddingX); bindFloat(frame, 'paddingRight', f.paddingX); }
  if (f.paddingY) { bindFloat(frame, 'paddingTop', f.paddingY); bindFloat(frame, 'paddingBottom', f.paddingY); }

  // Height: bind when a token carries it, otherwise fall back to the sample geometry.
  // A bound height needs FIXED vertical sizing — HUG would let the text win.
  if (f.height) {
    frame.counterAxisSizingMode = spec.frame.layout === 'HORIZONTAL' ? 'FIXED' : 'AUTO';
    bindFloat(frame, 'height', f.height);
  } else if (f.sampleHeight) {
    frame.resize(frame.width, f.sampleHeight);
  }
  if (f.sampleWidth) {
    frame.primaryAxisSizingMode = spec.frame.layout === 'HORIZONTAL' ? 'FIXED' : 'AUTO';
    frame.resize(f.sampleWidth, frame.height);
  }

  // Text child: reuse the existing one so re-running does not stack duplicates.
  let text = frame.children.find((c) => c.type === 'TEXT') || null;
  if (!spec.text) {
    if (text) text.remove();
    return;
  }
  const font = fonts[spec.text.fontStyle] || anyFont;
  if (!font) return; // no loadable font — recorded in fontFailures, not fatal
  if (!text) { text = figma.createText(); frame.appendChild(text); }
  text.fontName = font;
  text.characters = spec.text.characters;
  text.fills = [paintBound(variableFor(spec.text.fill))];
  if (spec.text.fontSize) bindFloat(text, 'fontSize', spec.text.fontSize);
  text.name = 'Label';
}

const results = [];
for (const [setName, set] of Object.entries(SPEC)) {
  const wanted = new Map(set.variants.map((v) => [v.name, v]));
  let componentSet = page.children.find((n) => n.type === 'COMPONENT_SET' && n.name === setName) || null;
  let created = 0;
  let updated = 0;
  let removed = 0;

  if (!componentSet) {
    const nodes = set.variants.map((v) => { const c = buildVariant(v); page.appendChild(c); return c; });
    componentSet = figma.combineAsVariants(nodes, page);
    componentSet.name = setName;
    componentSet.layoutMode = 'VERTICAL';
    componentSet.itemSpacing = 16;
    componentSet.counterAxisAlignItems = 'MIN';
    for (const c of componentSet.children) applyVariant(c, wanted.get(c.name));
    created = nodes.length;
  } else {
    for (const child of [...componentSet.children]) {
      const spec = wanted.get(child.name);
      if (!spec) { child.remove(); removed++; continue; }
      applyVariant(child, spec);
      updated++;
      wanted.delete(child.name);
    }
    for (const spec of wanted.values()) {
      const c = buildVariant(spec);
      componentSet.appendChild(c);
      applyVariant(c, spec);
      created++;
    }
  }
  results.push({ set: setName, recipe: set.recipe, created, updated, removed, total: set.variants.length });
}

// Lay the sets out left to right so a re-run does not pile them at the origin.
let x = 0;
for (const node of page.children) {
  if (node.type !== 'COMPONENT_SET') continue;
  node.x = x;
  node.y = 0;
  x += node.width + 120;
}

return {
  page: PAGE_NAME,
  sets: results,
  missingVariables: [...missingVars],
  fontFailures,
};
`;
