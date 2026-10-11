import assert from 'node:assert/strict';
import test from 'node:test';

import { drift, loadCatalog } from './generate.mjs';
import { TYPE_NOTES } from './notes.mjs';
import { CatalogError, renderAll, validateCatalog, validateNotes } from './render.mjs';

const copy = (v) => structuredClone(v);

test('the committed pages match catalog.json', () => {
  assert.deepEqual(drift(renderAll(loadCatalog(), TYPE_NOTES)), []);
});

test('every built-in type gets a page with every field and its secret level', () => {
  const catalog = loadCatalog();
  const files = renderAll(catalog, TYPE_NOTES);
  for (const t of catalog.types) {
    const page = files.get(`docs/admin-guide/secret-types/${TYPE_NOTES[t.id].slug}.md`);
    assert.ok(page, t.id);
    for (const f of t.fields) assert.ok(page.includes(`\`${f.key}\``), `${t.id}.${f.key}`);
    if (t.fields.some((f) => f.superSensitive)) assert.match(page, /super-sensitive/);
  }
});

test('a pipe in a pattern is escaped inside a table cell', () => {
  const files = renderAll(loadCatalog(), TYPE_NOTES);
  const card = files.get('docs/admin-guide/secret-types/credit-card.md');
  assert.ok(card.includes('1[0-2])'));
  assert.ok(!/\(0\[1-9\]\|1/.test(card.replaceAll('\\|', '')), 'unescaped pipe');
});

test('rendering twice gives the same files', () => {
  const a = renderAll(loadCatalog(), TYPE_NOTES);
  const b = renderAll(loadCatalog(), TYPE_NOTES);
  assert.deepEqual([...a], [...b]);
});

test('bad catalogue data fails loudly', () => {
  const good = loadCatalog();
  const cases = [
    ['no commit', (c) => delete c.source.commit],
    ['short commit', (c) => (c.source.commit = 'abc123')],
    ['no types', (c) => (c.types = [])],
    ['an unknown field kind', (c) => (c.types[0].fields[0].kind = 'FIELD_KIND_WHAT')],
    ['a duplicate type', (c) => c.types.push(copy(c.types[0]))],
    ['a duplicate field', (c) => c.types[0].fields.push(copy(c.types[0].fields[0]))],
    ['a choice with no options', (c) => {
      const f = c.types.flatMap((t) => t.fields).find((x) => x.kind === 'FIELD_KIND_SELECT');
      f.options = [];
    }],
    ['an extension marked as a system type', (c) => (c.extensions[0].origin = 'TYPE_ORIGIN_SYSTEM')],
    ['a connection with no port', (c) => delete c.connections[0].port],
  ];
  for (const [name, mutate] of cases) {
    const bad = copy(good);
    mutate(bad);
    assert.throws(() => validateCatalog(bad), CatalogError, name);
  }
});

test('a type without notes, or notes for a type that is gone, fails', () => {
  const catalog = loadCatalog();
  const missing = { ...TYPE_NOTES };
  delete missing['type-pin'];
  assert.throws(() => validateNotes(catalog, missing), /no entry for type-pin/);
  assert.throws(
    () => validateNotes(catalog, { ...TYPE_NOTES, 'type-gone': { ...TYPE_NOTES['type-pin'], slug: 'gone' } }),
    /type-gone isn't in the catalogue/,
  );
});
