/**
 * The comparator: what code says Figma should contain, versus what it actually contains.
 *
 * Pure — no I/O, no Figma, no MCP. Takes two documents of the `figma-native.json` shape
 * (`expected` from the tokens build, `actual` from pull-logic.mjs) and returns findings.
 * That purity is the point: fetching needs an interactively-authenticated MCP session,
 * but comparing is deterministic and testable with no connection at all, which is the
 * only part of this that CI can honestly gate.
 *
 * NOTHING HERE WRITES. The report is a worklist for a human, not a patch. Figma is
 * readable, never authoritative (README Principle 1).
 *
 * SCOPE — only collections the export owns.
 * A designer's scratch collection is not drift, so collections absent from `expected`
 * are ignored entirely rather than reported. Within an owned collection the full set of
 * findings applies, because that IS the contract surface.
 */

/** Collection-qualified variable key, the join key on both sides. */
const keyOf = (collection, name) => collection + '/' + name;

/**
 * Figma stores effect colour channels and offsets as floats. The push writes them from
 * DTCG numbers, so a clean round-trip is exact — but a designer nudging a shadow in the
 * UI lands on values like 0.07999999821186066. Comparing raw would report drift that no
 * human could act on, so effect numerics compare at 4dp. Variable values are NOT rounded:
 * COLOR round-trips through hex (already discrete) and FLOAT tokens are authored numbers.
 */
const round4 = (n) => (typeof n === 'number' ? Math.round(n * 10000) / 10000 : n);

/** Stable, order-independent value comparison for a single mode's value. */
function sameValue(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a === 'object' && typeof b === 'object') {
    if ('alias' in a || 'alias' in b) return a.alias === b.alias;
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

/** Human-readable rendering of a mode value, for the report line. */
function show(v) {
  if (v == null) return '—';
  if (typeof v === 'object' && 'alias' in v) return '→ ' + v.alias;
  return String(v);
}

/**
 * Index a document's variables by "Collection/name".
 * Returns { byKey, collections } where collections maps name → { modes }.
 */
function index(doc) {
  const byKey = new Map();
  const collections = new Map();
  for (const coll of doc.collections ?? []) {
    collections.set(coll.name, { modes: coll.modes ?? [] });
    for (const v of coll.variables ?? []) {
      byKey.set(keyOf(coll.name, v.name), { ...v, collection: coll.name });
    }
  }
  return { byKey, collections };
}

/**
 * Canonical serialisation of a variable's identity-by-value: type plus every mode value,
 * with mode keys sorted so declaration order can't affect the signature.
 *
 * Written out rather than using JSON.stringify's array-replacer, which looked like a
 * one-liner and is a trap: a replacer array filters keys at EVERY level, so a mode list
 * of ['light','dark'] would strip the `alias` key out of the nested {alias} values and
 * collapse every aliased variable to the same empty signature.
 */
function valueSignature(v) {
  const modes = Object.keys(v.valuesByMode ?? {}).sort();
  const parts = modes.map((m) => {
    const val = v.valuesByMode[m];
    const rendered =
      val && typeof val === 'object'
        ? 'alias' in val
          ? 'alias:' + val.alias
          : JSON.stringify(val)
        : String(val);
    return m + '=' + rendered;
  });
  return v.type + '|' + parts.join(';');
}

/**
 * Pair a variable code still expects with one Figma has gained, when the two hold
 * identical values across every mode — the signature of a rename, which is exactly what
 * a semantic restructure (the Flight Manual's background→bg, foreground→fg) looks like
 * from the outside.
 *
 * Reported as PROBABLE and never applied. Two tokens can legitimately share a value, so
 * this is a hint for whoever reads the report, not a conclusion. A candidate is only
 * offered when the match is unambiguous — exactly one on each side shares that value
 * signature — because "renamed to one of these four" helps nobody.
 *
 * THE VALUE MUST ALSO BE DISTINCTIVE, not merely unique among the unmatched.
 * Learned from the first real run: pairing on uniqueness within the unmatched sets
 * produced `control/height/xs → density/control-height/compact` (both 28) and
 * `spacing/9 → density/control-height/comfortable` (both 36) alongside the one true
 * find. A single-mode FLOAT carries almost no identifying information — plenty of
 * unrelated tokens are 28. So the signature must occur exactly once across the WHOLE
 * side, matched variables included: if `36` is also the value of `control/height/md`,
 * it identifies nothing. A 4-mode colour ramp signature is distinctive; a bare number
 * usually is not, and that asymmetry is the correct behaviour rather than a limitation.
 *
 * @param {Array} expectedMissing variables code expects that Figma lacks (the FROM side)
 * @param {Array} figmaGained     variables Figma has that code does not (the TO side)
 * @param {Array} allExpected     every expected variable, for distinctiveness
 * @param {Array} allActual       every actual variable, for distinctiveness
 */
function pairRenames(expectedMissing, figmaGained, allExpected, allActual) {
  const frequency = (list) => {
    const m = new Map();
    for (const v of list) {
      const s = valueSignature(v);
      m.set(s, (m.get(s) ?? 0) + 1);
    }
    return m;
  };
  const group = (list) => {
    const m = new Map();
    for (const v of list) {
      const s = valueSignature(v);
      if (!m.has(s)) m.set(s, []);
      m.get(s).push(v);
    }
    return m;
  };

  const expectedFreq = frequency(allExpected);
  const actualFreq = frequency(allActual);
  const fromBySig = group(expectedMissing);
  const toBySig = group(figmaGained);

  const pairs = [];
  for (const [sig, froms] of fromBySig) {
    const tos = toBySig.get(sig);
    if (froms.length !== 1 || !tos || tos.length !== 1) continue;
    // Distinctive on BOTH sides, or the "match" is just a common value.
    if (expectedFreq.get(sig) !== 1 || actualFreq.get(sig) !== 1) continue;
    pairs.push({ from: froms[0], to: tos[0] });
  }
  return pairs;
}

/** Compare the Variable collections. */
function diffVariables(expected, actual) {
  const exp = index(expected);
  const act = index(actual);
  const findings = [];

  // Mode drift, per owned collection. A renamed or added mode invalidates every value
  // comparison inside it, so it is reported at the collection level and once only.
  for (const [name, e] of exp.collections) {
    const a = act.collections.get(name);
    if (!a) {
      findings.push({ kind: 'missing-collection', collection: name, detail: 'not in Figma' });
      continue;
    }
    const missingModes = e.modes.filter((m) => !a.modes.includes(m));
    const extraModes = a.modes.filter((m) => !e.modes.includes(m));
    if (missingModes.length || extraModes.length) {
      findings.push({
        kind: 'mode-mismatch',
        collection: name,
        detail:
          'expected [' + e.modes.join(', ') + '] · figma [' + a.modes.join(', ') + ']',
        missingModes,
        extraModes,
      });
    }
  }

  const ownedCollections = new Set(exp.collections.keys());
  const expectedMissing = []; // code expects it, Figma lacks it — the rename FROM side
  const figmaGained = []; // Figma has it, code does not — the rename TO side

  for (const [key, e] of exp.byKey) {
    const a = act.byKey.get(key);
    if (!a) {
      // Only meaningful if the collection itself made it to Figma — otherwise the
      // missing-collection finding above already says it, once, instead of 412 times.
      if (act.collections.has(e.collection)) {
        findings.push({ kind: 'missing-in-figma', key, collection: e.collection, name: e.name });
        expectedMissing.push(e);
      }
      continue;
    }
    if (e.type !== a.type) {
      findings.push({
        kind: 'type-mismatch',
        key,
        collection: e.collection,
        name: e.name,
        detail: 'expected ' + e.type + ' · figma ' + a.type,
      });
      continue; // values are not comparable across types
    }
    const modes = new Set([...Object.keys(e.valuesByMode ?? {}), ...Object.keys(a.valuesByMode ?? {})]);
    const changes = [];
    for (const mode of modes) {
      const ev = e.valuesByMode?.[mode];
      const av = a.valuesByMode?.[mode];
      // A mode absent on one side is already reported as mode-mismatch at the
      // collection level; do not restate it per variable.
      if (ev === undefined || av === undefined) continue;
      if (!sameValue(ev, av)) changes.push({ mode, expected: ev, actual: av });
    }
    if (changes.length) {
      findings.push({ kind: 'changed', key, collection: e.collection, name: e.name, changes });
    }
  }

  // `new-in-figma` covers two situations the report cannot tell apart, and deliberately
  // does not pretend to: a variable the designer added, and one left behind when a token
  // was renamed in code (the orphan figma-sync/README.md warns about, whose bindings stay
  // live). Distinguishing them needs history nobody has; `probable-rename` below is the
  // honest hint instead.
  for (const [key, a] of act.byKey) {
    if (!ownedCollections.has(a.collection)) continue; // a designer's own collection
    if (exp.byKey.has(key)) continue;
    findings.push({ kind: 'new-in-figma', key, collection: a.collection, name: a.name, type: a.type });
    figmaGained.push(a);
  }

  const ownedActual = [...act.byKey.values()].filter((v) => ownedCollections.has(v.collection));
  const renames = pairRenames(expectedMissing, figmaGained, [...exp.byKey.values()], ownedActual).map((p) => ({
    kind: 'probable-rename',
    from: keyOf(p.from.collection, p.from.name),
    to: keyOf(p.to.collection, p.to.name),
  }));

  return { findings, renames };
}

/** Compare shadow Effect Styles. `expectedShadows` is the { "shadow/sm": [effect] } map. */
function diffEffectStyles(expectedShadows, actualEffectStyles) {
  const findings = [];
  if (!actualEffectStyles) return findings; // payload carried no styles
  const norm = (effects) =>
    (effects ?? []).map((e) => ({
      type: e.type,
      color: e.color
        ? { r: round4(e.color.r), g: round4(e.color.g), b: round4(e.color.b), a: round4(e.color.a ?? 1) }
        : null,
      offset: e.offset ? { x: round4(e.offset.x), y: round4(e.offset.y) } : null,
      radius: round4(e.radius),
      spread: round4(e.spread ?? 0),
    }));

  for (const [name, effects] of Object.entries(expectedShadows ?? {})) {
    const actual = actualEffectStyles[name];
    if (!actual) {
      findings.push({ kind: 'missing-effect-style', name });
      continue;
    }
    if (JSON.stringify(norm(effects)) !== JSON.stringify(norm(actual))) {
      findings.push({
        kind: 'changed-effect-style',
        name,
        detail: norm(effects).length + ' expected layer(s) · ' + norm(actual).length + ' in figma',
      });
    }
  }
  return findings;
}

/**
 * Compare Text Styles.
 *
 * The push renames on the way out — role `product/body-lg` becomes style
 * `Type/Product/Body Large` (niceName in push-logic.mjs). Rather than invert that
 * title-casing, which is lossy, this re-applies the SAME transform to the expected
 * role names and matches on the result. One transform, one direction, no guessing.
 */
export function styleNameForRole(roleName) {
  const NICE_SEG = { 'body-lg': 'Body Large' };
  const titleSeg = (seg) =>
    NICE_SEG[seg] ?? seg.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return 'Type/' + roleName.split('/').map(titleSeg).join('/');
}

function diffTextStyles(expectedTextStyles, actualTextStyles) {
  const findings = [];
  if (!actualTextStyles) return findings; // payload carried no styles
  const actualByName = new Map(actualTextStyles.map((s) => [s.name, s]));

  for (const e of expectedTextStyles ?? []) {
    const styleName = styleNameForRole(e.name);
    const a = actualByName.get(styleName);
    if (!a) {
      findings.push({ kind: 'missing-text-style', name: styleName, role: e.name });
      continue;
    }
    const changes = [];
    if (e.fontSize !== a.fontSize) changes.push({ prop: 'fontSize', expected: e.fontSize, actual: a.fontSize });
    if ((e.lineHeightPercent ?? null) !== (a.lineHeightPercent ?? null))
      changes.push({ prop: 'lineHeight%', expected: e.lineHeightPercent, actual: a.lineHeightPercent });
    if (round4(e.letterSpacingPercent ?? 0) !== round4(a.letterSpacingPercent ?? 0))
      changes.push({ prop: 'letterSpacing%', expected: e.letterSpacingPercent, actual: a.letterSpacingPercent });
    // The push tries each candidate family and falls back — including all the way to
    // Regular — recording rather than throwing. So a family outside the candidate list,
    // or a downgraded weight, is real information: it means the file silently rendered
    // a role in a font we did not ask for.
    if (a.fontFamily && !(e.fontFamilyCandidates ?? []).includes(a.fontFamily))
      changes.push({ prop: 'fontFamily', expected: (e.fontFamilyCandidates ?? []).join(' / '), actual: a.fontFamily });
    if (e.fontStyle && a.fontStyle && e.fontStyle.replace(/\s+/g, '') !== a.fontStyle.replace(/\s+/g, ''))
      changes.push({ prop: 'fontStyle', expected: e.fontStyle, actual: a.fontStyle });
    if (changes.length) findings.push({ kind: 'changed-text-style', name: styleName, role: e.name, changes });
  }
  return findings;
}

/**
 * Compare a code-side contract against a Figma-side read.
 *
 * @param {object} expected  figma-native.json — { collections, textStyles }
 * @param {object} actual    pull-logic output — { collections, effectStyles, textStyles }
 * @param {object} [opts]
 * @param {object} [opts.expectedShadows]  the { "shadow/sm": [effect] } map from build-program
 */
export function diff(expected, actual, opts = {}) {
  const { findings: variableFindings, renames } = diffVariables(expected, actual);
  const findings = [
    ...variableFindings,
    ...diffEffectStyles(opts.expectedShadows, actual.effectStyles),
    ...diffTextStyles(expected.textStyles, actual.textStyles),
  ];
  const counts = {};
  for (const f of findings) counts[f.kind] = (counts[f.kind] ?? 0) + 1;
  return { findings, renames, counts, clean: findings.length === 0 };
}

/** Render a report for the terminal. Grouped by collection, most actionable first. */
export function format(report) {
  if (report.clean) return 'figma:diff — no drift. Figma matches the token contract.';

  const lines = [];
  const ORDER = [
    'missing-collection',
    'mode-mismatch',
    'type-mismatch',
    'changed',
    'new-in-figma',
    'missing-in-figma',
    'changed-text-style',
    'missing-text-style',
    'changed-effect-style',
    'missing-effect-style',
  ];
  const byKind = new Map();
  for (const f of report.findings) {
    if (!byKind.has(f.kind)) byKind.set(f.kind, []);
    byKind.get(f.kind).push(f);
  }

  for (const kind of ORDER) {
    const group = byKind.get(kind);
    if (!group) continue;
    lines.push('');
    lines.push(kind + '  (' + group.length + ')');
    for (const f of group) {
      if (kind === 'changed') {
        lines.push('  ' + f.key);
        for (const c of f.changes) {
          lines.push('    ' + c.mode.padEnd(10) + show(c.expected) + '  ←figma  ' + show(c.actual));
        }
      } else if (kind === 'changed-text-style') {
        lines.push('  ' + f.name);
        for (const c of f.changes) {
          lines.push('    ' + c.prop.padEnd(16) + String(c.expected) + '  ←figma  ' + String(c.actual));
        }
      } else {
        lines.push('  ' + (f.key ?? f.name ?? f.collection) + (f.detail ? '   ' + f.detail : ''));
      }
    }
  }

  if (report.renames.length) {
    lines.push('');
    lines.push('probable renames  (' + report.renames.length + ')  — unambiguous value matches, NOT applied');
    for (const r of report.renames) lines.push('  ' + r.from + '  →  ' + r.to);
  }

  lines.push('');
  const summary = Object.entries(report.counts).map(([k, n]) => n + ' ' + k).join(' · ');
  lines.push(summary);
  return lines.join('\n');
}
