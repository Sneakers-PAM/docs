// Turns catalog.json and notes.mjs into the secret-type pages. Pure functions
// only, so the tests can drive them; generate.mjs does the file work.

export const OUT_DIR = 'docs/admin-guide/secret-types';
export const SIDEBAR_FILE = 'src/data/secret-types-sidebar.json';

const KINDS = {
  FIELD_KIND_TEXT: 'Text',
  FIELD_KIND_PASSWORD: 'Password (can be generated)',
  FIELD_KIND_MULTILINE: 'Multi-line text',
  FIELD_KIND_SELECT: 'Choice',
  FIELD_KIND_SENSITIVE: 'Secret value (never generated)',
  FIELD_KIND_BOOLEAN: 'Yes or no',
};

// The types a target can carry without heartbeat or rotation: the host a
// brokered session opens to. Mirrors the vault's connectableTypeIDs.
const CONNECTABLE = new Set(['type-ssh-key', 'type-unix-ssh']);

const ORIGINS = new Set(['TYPE_ORIGIN_SYSTEM', 'TYPE_ORIGIN_EXTENSION']);

export class CatalogError extends Error {}

const fail = (msg) => {
  throw new CatalogError(msg);
};

function validateType(t, where, wantOrigin) {
  if (typeof t?.id !== 'string' || !t.id) fail(`${where}: a type has no id`);
  if (typeof t.name !== 'string' || !t.name) fail(`${where} ${t.id}: no name`);
  if (!ORIGINS.has(t.origin) || t.origin !== wantOrigin) fail(`${where} ${t.id}: origin ${t.origin}, want ${wantOrigin}`);
  if (!Array.isArray(t.fields) || t.fields.length === 0) fail(`${where} ${t.id}: no fields`);
  const keys = new Set();
  for (const f of t.fields) {
    if (typeof f.key !== 'string' || !f.key) fail(`${where} ${t.id}: a field has no key`);
    if (keys.has(f.key)) fail(`${where} ${t.id}: field ${f.key} appears twice`);
    keys.add(f.key);
    if (typeof f.label !== 'string' || !f.label) fail(`${where} ${t.id}.${f.key}: no label`);
    if (!(f.kind in KINDS)) fail(`${where} ${t.id}.${f.key}: unknown kind ${f.kind}`);
    if (f.kind === 'FIELD_KIND_SELECT' && !(Array.isArray(f.options) && f.options.length)) {
      fail(`${where} ${t.id}.${f.key}: a choice with no options`);
    }
  }
}

export function validateCatalog(catalog) {
  const src = catalog?.source;
  if (!src || typeof src.commit !== 'string' || !/^[0-9a-f]{40}$/.test(src.commit)) {
    fail('catalog: source.commit must be a full commit hash');
  }
  if (!Array.isArray(catalog.types) || catalog.types.length === 0) fail('catalog: no types');
  if (!Array.isArray(catalog.extensions)) fail('catalog: no extensions list');
  if (!Array.isArray(catalog.connections) || catalog.connections.length === 0) fail('catalog: no connections');
  const ids = new Set();
  for (const t of catalog.types) {
    validateType(t, 'types', 'TYPE_ORIGIN_SYSTEM');
    if (ids.has(t.id)) fail(`types: ${t.id} appears twice`);
    ids.add(t.id);
  }
  for (const t of catalog.extensions) validateType(t, 'extensions', 'TYPE_ORIGIN_EXTENSION');
  for (const c of catalog.connections) {
    if (!c.id || !c.name || !c.protocol || !Number.isInteger(c.port)) fail(`connections: ${c.id ?? '?'} is incomplete`);
  }
  return catalog;
}

export function validateNotes(catalog, notes) {
  const ids = new Set(catalog.types.map((t) => t.id));
  const slugs = new Set();
  for (const id of ids) {
    const n = notes[id];
    if (!n) fail(`notes.mjs: no entry for ${id}; describe the new type there`);
    if (!/^[a-z0-9-]+$/.test(n.slug ?? '')) fail(`notes.mjs ${id}: bad slug`);
    if (slugs.has(n.slug) || n.slug === 'index' || n.slug === 'extension-packs') fail(`notes.mjs ${id}: slug ${n.slug} is taken`);
    slugs.add(n.slug);
    for (const k of ['emoji', 'summary', 'targets']) {
      if (typeof n[k] !== 'string' || !n[k]) fail(`notes.mjs ${id}: no ${k}`);
    }
  }
  for (const id of Object.keys(notes)) {
    if (!ids.has(id)) fail(`notes.mjs: ${id} isn't in the catalogue any more`);
  }
}

// Table cells: a pipe would end the cell, even inside a code span.
const cell = (s) => String(s).replace(/\|/g, '\\|');
const code = (s) => '`' + s + '`';
const yes = (b) => (b ? 'Yes' : 'No');

export const secretLevel = (f) => (f.superSensitive ? 'Super-sensitive' : f.sensitive ? 'Sensitive' : 'No');

const takesTarget = (t) => !!(t.heartbeat || t.rotation || CONNECTABLE.has(t.id));

function fieldNotes(f) {
  const out = [];
  if (f.options?.length) out.push(`One of ${f.options.map(code).join(', ')}`);
  if (f.defaultValue) out.push(`default ${code(f.defaultValue)}`);
  if (f.pattern) out.push(`must match ${code(f.pattern)}`);
  if (f.maxLength) out.push(`at most ${f.maxLength} characters`);
  if (f.rotates) out.push('the field rotation changes');
  return out.length ? out.join('; ') : '';
}

function fieldsTable(t) {
  const rows = [
    '| Field | Key | Kind | Required | Secret | Notes |',
    '|---|---|---|---|---|---|',
  ];
  for (const f of t.fields) {
    rows.push(
      `| ${cell(f.label)} | ${code(cell(f.key))} | ${KINDS[f.kind]} | ${yes(f.required)} | ${secretLevel(f)} | ${cell(fieldNotes(f))} |`,
    );
  }
  return rows.join('\n');
}

function secretSection(t) {
  const secret = t.fields.filter((f) => f.sensitive || f.superSensitive);
  const superS = secret.filter((f) => f.superSensitive);
  const lines = [];
  if (secret.length === 0) {
    lines.push('No field of this type is secret.');
  } else {
    lines.push(
      `${secret.map((f) => `**${f.label}**`).join(', ')} ${secret.length === 1 ? 'is' : 'are'} masked until someone who can read the secret reveals or copies ${secret.length === 1 ? 'it' : 'them'}, and every reveal and copy is written to the [audit trail](../audit.md). Everything else is plain metadata that anyone who can see the folder can see.`,
    );
  }
  if (superS.length) {
    lines.push(
      '',
      `${superS.map((f) => `**${f.label}**`).join(', ')} ${superS.length === 1 ? 'is' : 'are'} super-sensitive: the reveal shows a partial mask first and takes a second, deliberate reveal for the whole value. Service accounts and personal tokens can't read ${superS.length === 1 ? 'it' : 'them'} while the **Allow API access to sensitive secrets** setting is off, which is the default ([security settings](../security-settings.md)). Checking out a secret of this type asks for a fresh second factor while **Require MFA for sensitive checkout** is on, also the default.`,
    );
  }
  return lines.join('\n');
}

function automationSection(t, n) {
  const rotates = t.fields.filter((f) => f.rotates).map((f) => `**${f.label}**`);
  const lines = [
    `- **Heartbeat:** ${t.heartbeat ? 'yes, against the secret\'s target ([how it works](../rotation-and-heartbeat.md#heartbeat)).' : 'no.'}`,
    `- **Rotation:** ${t.rotation ? `yes${rotates.length ? `: rotation changes ${rotates.join(', ')}` : ''} ([how it works](../rotation-and-heartbeat.md#rotation)).` : 'no.'}`,
    `- **Check-out:** ${t.checkout ? 'yes: one person at a time holds it for a lease ([check-out](../../user-guide/check-out.md)).' : 'no.'}`,
  ];
  if (n.automation?.length) {
    lines.push('', ...n.automation.map((a) => `- ${a}`));
  }
  return lines.join('\n');
}

export function renderTypePage(t, n, position, commit) {
  const use = n.use?.length ? `\n\n${n.use.map((u) => `- ${u}`).join('\n')}` : '';
  return `---
title: ${JSON.stringify(t.name)}
description: ${JSON.stringify(n.summary)}
sidebar_position: ${position}
---

{/* Generated by scripts/secret-types/generate.mjs from catalog.json (sneakers-vault ${commit.slice(0, 12)}); edit notes.mjs and regenerate. */}

# ${n.emoji} ${t.name}

${n.summary}${use}

Type id: ${code(t.id)}. Agents and \`sneakers-put\` name the type by this id; \`sneakers_list_secret_types\` lists it.

## 🧾 Fields {#fields}

${fieldsTable(t)}

## 🔒 What's secret {#whats-secret}

${secretSection(t)}

## 🔁 Heartbeat, rotation and check-out {#automation}

${automationSection(t, n)}

## 🎯 Targets {#targets}

${n.targets}${takesTarget(t) ? ' See [targets and connections](../targets-and-connections.md) for how to set one up.' : ''}
`;
}

export function renderIndex(catalog, notes) {
  const rows = [
    '| Type | Secret fields | Heartbeat | Rotation | Check-out | Takes a target |',
    '|---|---|---|---|---|---|',
  ];
  for (const t of catalog.types) {
    const n = notes[t.id];
    const secret = t.fields.filter((f) => f.sensitive || f.superSensitive).map((f) => f.label);
    rows.push(
      `| [${cell(t.name)}](./${n.slug}.md) | ${cell(secret.join(', ') || 'none')} | ${yes(t.heartbeat)} | ${yes(t.rotation)} | ${yes(t.checkout)} | ${yes(takesTarget(t))} |`,
    );
  }
  return `---
title: Secret types
description: Every built-in secret type, its fields, which are secret, and what it can do.
sidebar_position: 0
---

{/* Generated by scripts/secret-types/generate.mjs from catalog.json (sneakers-vault ${catalog.source.commit.slice(0, 12)}); edit notes.mjs and regenerate. */}

# 🧩 Secret types

A secret's type decides which fields it has, which of them are secret, and what Sneakers-PAM can do
with it: check it against a target (the heartbeat), change it on the target (rotation), or lend it
to one person at a time (check-out). Sneakers-PAM ships with the ${catalog.types.length} types below. They're read-only:
nobody can edit or delete a built-in type, but a site admin can clone one into a custom type on the
admin app's **Secret types** page, and import the [extension packs](./extension-packs.md).

${rows.join('\n')}

:::info[Heartbeat and rotation need a connector adapter]

A type marked for heartbeat or rotation still needs an adapter in the connector for its target's
protocol. LDAP, LDAPS, Kerberos and SSH work today; WinRM and SAMR are registered but report the
target as unreachable, and there is no database adapter yet. Each type's page says what works.

:::

## 🔤 Field kinds {#field-kinds}

| Kind | What it holds |
|---|---|
| Text | Plain text, shown to anyone who can see the secret. |
| Password (can be generated) | A secret password. The editor can generate one from the folder's password policy, and rotation changes it. |
| Secret value (never generated) | A fixed secret, such as a key or a token: masked and revealed like a password, never generated or rotated. |
| Multi-line text | Longer text, such as notes or a certificate. Secret only where the type marks it so. |
| Choice | One of a fixed list of options. |
| Yes or no | A flag. |

## 🔐 Secret and super-sensitive fields {#sensitivity}

- **Sensitive fields** are masked everywhere. Revealing or copying one is a deliberate act, written
  to the [audit trail](../audit.md), and a site admin can require a fresh second factor first
  ([security settings](../security-settings.md)).
- **Super-sensitive fields** (card numbers, PINs, the SSN, a certificate's private key, bank
  numbers) also show a partial mask before the whole value, and service accounts and personal
  tokens can't read them unless a site admin turns on **Allow API access to sensitive secrets**.

## 🔄 Changing a secret's type {#changing-type}

A secret can move to another type. No value is ever dropped: a value with no field in the new type
is appended to the notes, or the change is refused. A secret value only moves into a secret field,
and a super-sensitive one only into a super-sensitive field.

<small>These pages are generated from the vault's built-in catalogue at commit ${code(catalog.source.commit.slice(0, 12))}.</small>
`;
}

export function renderExtensions(catalog) {
  const blocks = catalog.extensions.map((t) => {
    const rows = ['| Field | Key | Kind | Required | Secret |', '|---|---|---|---|---|'];
    for (const f of t.fields) {
      rows.push(`| ${cell(f.label)} | ${code(cell(f.key))} | ${KINDS[f.kind]} | ${yes(f.required)} | ${secretLevel(f)} |`);
    }
    const id = t.id.replace(/[^a-z0-9-]/g, '');
    return `### ${t.name} {#${id}}\n\nFrom ${t.vendor || 'its vendor'}. Type id: ${code(t.id)}.\n\n${rows.join('\n')}`;
  });
  return `---
title: Extension packs
description: The vendor types a site admin can import next to the built-in ones.
sidebar_position: ${catalog.types.length + 1}
---

{/* Generated by scripts/secret-types/generate.mjs from catalog.json (sneakers-vault ${catalog.source.commit.slice(0, 12)}); edit notes.mjs and regenerate. */}

# 📦 Extension packs

Extension packs are vendor types that ship with Sneakers-PAM but aren't installed until a site
admin imports one on the admin app's **Secret types** page. Once imported, a pack is a read-only
type like the built-in ones: people can create secrets of it, and nobody can edit it. None of them
has heartbeat, rotation or check-out.

## 📋 The packs {#packs}

${blocks.join('\n\n')}
`;
}

export function renderAll(catalog, notes) {
  validateCatalog(catalog);
  validateNotes(catalog, notes);
  const files = new Map();
  const commit = catalog.source.commit;
  files.set(`${OUT_DIR}/index.md`, renderIndex(catalog, notes));
  catalog.types.forEach((t, i) => {
    files.set(`${OUT_DIR}/${notes[t.id].slug}.md`, renderTypePage(t, notes[t.id], i + 1, commit));
  });
  files.set(`${OUT_DIR}/extension-packs.md`, renderExtensions(catalog));
  const sidebar = [
    ...catalog.types.map((t) => ({ id: `admin-guide/secret-types/${notes[t.id].slug}`, label: t.name })),
    { id: 'admin-guide/secret-types/extension-packs', label: 'Extension packs' },
  ];
  files.set(SIDEBAR_FILE, `${JSON.stringify(sidebar, null, 2)}\n`);
  return files;
}
