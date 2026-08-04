#!/usr/bin/env node
/**
 * Decision-log gate.
 *
 * `decisions/` is the constitution (see decisions/README.md). A log only works
 * if every entry is findable, parseable, and honest about its status — the old
 * flat DECISIONS.md rotted precisely because nothing checked it.
 *
 * What this asserts:
 *   1. filename ↔ frontmatter `id` agree, and no ID is used twice;
 *   2. every required field is present, with a valid `status` and ISO `date`;
 *   3. `superseded` entries name a `superseded_by` that actually exists;
 *   4. the four body sections (Context / Options / Decision / Revoked when) are
 *      all present — an entry without Options is a claim, not a decision;
 *   5. the README index and the files on disk match in both directions, so a
 *      new entry cannot be invisible and a link cannot dangle.
 *
 * Deliberately NOT checked: whether a decision is *good*, whether Options are
 * real alternatives, or whether `ratified_by` is truthful. Those are human
 * review. A gate that overclaims is worse than one that scopes itself.
 *
 * Run via `pnpm decisions:check`.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'decisions');

const REQUIRED_FIELDS = ['id', 'date', 'title', 'status', 'owner', 'ratified_by'];
const STATUSES = ['proposed', 'ratified', 'superseded'];
const REQUIRED_SECTIONS = ['Context', 'Options', 'Decision', 'Revoked when'];
const ID_RE = /^AD-D-\d{3}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

let failures = 0;
const fail = (file, msg) => {
  failures++;
  console.error(`  ✘ ${file}: ${msg}`);
};

/** Minimal frontmatter reader — the fields here are flat scalars by design. */
function parseFrontmatter(source) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(source);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split('\n')) {
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    fields[kv[1]] = kv[2].trim().replace(/^["'](.*)["']$/, '$1');
  }
  return { fields, body: source.slice(match[0].length) };
}

const files = readdirSync(dir)
  .filter((f) => f.startsWith('AD-D-') && f.endsWith('.md'))
  .sort();

if (files.length === 0) {
  console.error('✘ decisions/ contains no AD-D-*.md entries.');
  process.exit(1);
}

const seen = new Map();

for (const file of files) {
  const parsed = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
  if (!parsed) {
    fail(file, 'no YAML frontmatter — see the template in decisions/README.md');
    continue;
  }
  const { fields, body } = parsed;

  for (const field of REQUIRED_FIELDS) {
    if (!(field in fields)) fail(file, `missing required field \`${field}\``);
  }

  const idFromName = file.slice(0, 8);
  if (!ID_RE.test(idFromName)) {
    fail(file, `filename must start with AD-D-### (got \`${idFromName}\`)`);
  } else if (fields.id !== idFromName) {
    fail(file, `frontmatter id \`${fields.id}\` does not match filename \`${idFromName}\``);
  } else if (seen.has(fields.id)) {
    fail(file, `duplicate id — already used by ${seen.get(fields.id)}`);
  } else {
    seen.set(fields.id, file);
  }

  if (fields.date && !DATE_RE.test(fields.date)) {
    fail(file, `date must be YYYY-MM-DD (got \`${fields.date}\`)`);
  }

  if (fields.status && !STATUSES.includes(fields.status)) {
    fail(file, `status must be one of ${STATUSES.join(' | ')} (got \`${fields.status}\`)`);
  }
  if (fields.status === 'superseded' && !fields.superseded_by) {
    fail(file, 'status is `superseded` but no `superseded_by` is named');
  }
  if (fields.superseded_by && !ID_RE.test(fields.superseded_by)) {
    fail(file, `superseded_by must be an AD-D-### id (got \`${fields.superseded_by}\`)`);
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!new RegExp(`^## ${section}\\s*$`, 'm').test(body)) {
      fail(file, `missing \`## ${section}\` section`);
    }
  }
}

// Cross-check supersession targets now that every id is known.
for (const file of files) {
  const parsed = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
  const target = parsed?.fields.superseded_by;
  if (target && !seen.has(target)) {
    fail(file, `superseded_by names \`${target}\`, which has no entry`);
  }
}

// The README index is the front door — it must match the directory exactly.
const readme = readFileSync(join(dir, 'README.md'), 'utf8');
const linked = new Set([...readme.matchAll(/\]\((AD-D-\d{3}-[a-z0-9.-]+\.md)\)/g)].map((m) => m[1]));

for (const file of files) {
  if (!linked.has(file)) fail('README.md', `index is missing a row for ${file}`);
}
for (const link of linked) {
  if (!files.includes(link)) fail('README.md', `index links ${link}, which does not exist`);
}

if (failures > 0) {
  console.error(`\n✘ decision log: ${failures} problem(s) in ${files.length} entries.`);
  console.error('  Template and rules: decisions/README.md');
  process.exit(1);
}

const byStatus = files.reduce((acc, file) => {
  const status = parseFrontmatter(readFileSync(join(dir, file), 'utf8')).fields.status;
  acc[status] = (acc[status] ?? 0) + 1;
  return acc;
}, {});

const summary = Object.entries(byStatus)
  .map(([status, n]) => `${n} ${status}`)
  .join(', ');
console.log(`decision log: ${files.length} entries in sync (${summary}).`);
