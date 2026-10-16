import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { DATA_PATH, githubGetter, refresh, Unreachable } from './fetch.mjs';
import {
  buildData,
  byUnit,
  channelOf,
  DataError,
  inline,
  normalizeAdvisories,
  normalizeReleases,
  parseNotes,
  unitsOf,
  validateData,
} from './model.mjs';

const APPLIANCE = 'Sneakers-PAM/sneakers-appliance';
const PRODUCT = 'Sneakers-PAM/sneakers-release';

const release = (tag, extra = {}) => ({
  tag_name: tag,
  name: tag,
  draft: false,
  prerelease: tag.includes('-'),
  published_at: '2026-10-01T12:00:00Z',
  html_url: `https://github.com/${APPLIANCE}/releases/tag/${tag}`,
  // A published appliance release carries its unit files.
  assets: [{ name: `sneakers-appliance-baseOS-${tag.slice(1)}-amd64.bin` }],
  body: '',
  ...extra,
});

const advisory = (extra = {}) => ({
  ghsa_id: 'GHSA-abcd-efgh-ijkl',
  cve_id: 'CVE-2026-12345',
  summary: 'A summary.',
  severity: 'high',
  state: 'published',
  published_at: '2026-10-02T00:00:00Z',
  html_url: `https://github.com/${APPLIANCE}/security/advisories/GHSA-abcd-efgh-ijkl`,
  vulnerabilities: [{ package: { name: 'sneakers-appliance' }, vulnerable_version_range: '< 0.1.1', patched_versions: '0.1.1' }],
  ...extra,
});

test('the channel comes from the tag', () => {
  assert.equal(channelOf('v0.1.0', false), 'stable');
  assert.equal(channelOf('v0.1.0-rc.2', true), 'rc');
  assert.equal(channelOf('v0.1.0-beta.1', true), 'pre-release');
  assert.equal(channelOf('v0.1.0', true), 'pre-release');
});

test('the update units come from the asset names', () => {
  const assets = [
    'sneakers-appliance-baseOS-0.2.0-amd64.bin',
    'sneakers-appliance-baseOS-patch-0.1.0-to-0.2.0-amd64.bin',
    'sneakers-appliance-baseWeb-0.2.0-amd64.bin',
    'sneakers-product-0.2.0-amd64.bin',
    'SHA256SUMS',
  ];
  assert.deepEqual(unitsOf(APPLIANCE, 'v0.2.0', assets), [
    { unit: 'baseOS', version: '0.2.0' },
    { unit: 'baseWeb', version: '0.2.0' },
    { unit: 'product', version: '0.2.0' },
  ]);
  assert.deepEqual(unitsOf(APPLIANCE, 'v0.2.1', ['sneakers-appliance-baseWeb-0.2.1-amd64.bin']), [
    { unit: 'baseWeb', version: '0.2.1' },
  ]);
  assert.deepEqual(unitsOf(APPLIANCE, 'v0.0.1', []), [{ unit: 'baseOS', version: '0.0.1' }]);
  assert.deepEqual(unitsOf(PRODUCT, 'v0.1.0-rc.1', []), [{ unit: 'product', version: '0.1.0-rc.1' }]);
});

test('drafts are left out and the rest are sorted newest first', () => {
  const data = buildData({
    [APPLIANCE]: {
      releases: [
        release('v0.1.0-rc.1', { published_at: '2026-10-01T00:00:00Z' }),
        release('v0.1.0', { published_at: '2026-10-05T00:00:00Z' }),
        release('v0.2.0-rc.1', { draft: true }),
      ],
      advisories: [],
    },
    [PRODUCT]: { releases: [release('v0.1.0', { published_at: '2026-10-03T00:00:00Z', html_url: `https://github.com/${PRODUCT}/releases/tag/v0.1.0` })], advisories: [] },
  });
  assert.deepEqual(
    data.releases.map((r) => `${r.repo.split('/')[1]} ${r.tag} ${r.channel}`),
    ['sneakers-appliance v0.1.0 stable', 'sneakers-release v0.1.0 stable', 'sneakers-appliance v0.1.0-rc.1 rc'],
  );
  const sections = byUnit(data.releases);
  assert.deepEqual(sections.map((s) => s.label), ['Base OS', 'Base Web', 'Product']);
  assert.equal(sections[0].entries.length, 2);
  assert.equal(sections[1].entries.length, 0);
  assert.equal(sections[2].entries[0].repo, PRODUCT);
});

test('bad release data fails loudly', () => {
  for (const bad of [
    'not a list',
    [release('latest')],
    [release('v0.1.0', { published_at: 'yesterday' })],
    [release('v0.1.0', { html_url: 'http://example.org' })],
  ]) {
    assert.throws(() => buildData({ [APPLIANCE]: { releases: bad, advisories: [] }, [PRODUCT]: { releases: [], advisories: [] } }), DataError);
  }
});

test('an advisory keeps its ids, versions, severity, summary and link', () => {
  const [a] = normalizeAdvisories(APPLIANCE, [advisory(), advisory({ state: 'draft', ghsa_id: 'GHSA-zzzz-zzzz-zzzz' })]);
  assert.deepEqual(a, {
    repo: APPLIANCE,
    ghsaId: 'GHSA-abcd-efgh-ijkl',
    cveId: 'CVE-2026-12345',
    severity: 'high',
    summary: 'A summary.',
    publishedAt: '2026-10-02T00:00:00.000Z',
    url: `https://github.com/${APPLIANCE}/security/advisories/GHSA-abcd-efgh-ijkl`,
    affected: [{ package: 'sneakers-appliance', affected: '< 0.1.1', fixed: '0.1.1' }],
  });
  assert.equal(normalizeAdvisories(APPLIANCE, [advisory({ cve_id: null })])[0].cveId, null);
});

test('bad advisory data fails loudly', () => {
  for (const extra of [{ ghsa_id: 'GHSA-1' }, { cve_id: 'CVE-1' }, { severity: 'scary' }, { summary: '' }, { html_url: 'javascript:alert(1)' }]) {
    assert.throws(() => normalizeAdvisories(APPLIANCE, [advisory(extra)]), DataError);
  }
});

test('release notes become safe blocks', () => {
  const blocks = parseNotes('# What Changed\r\n\r\n## Fixes\r\n\r\n- fix(x): a `code` bit (#3)\r\n- [link](javascript:alert(1)) and **bold**\r\n\r\n**Full Changelog**: https://github.com/a/b/compare/v1...v2\r\n');
  assert.deepEqual(blocks.map((b) => b.type), ['heading', 'heading', 'list', 'paragraph']);
  assert.deepEqual(blocks[2].items[0], [{ t: 'text', v: 'fix(x): a ' }, { t: 'code', v: 'code' }, { t: 'text', v: ' bit (#3)' }]);
  assert.deepEqual(blocks[2].items[1][0], { t: 'text', v: 'link' });
  assert.deepEqual(inline('see https://github.com/x'), [{ t: 'text', v: 'see ' }, { t: 'link', v: 'https://github.com/x', href: 'https://github.com/x' }]);
});

test('an unreachable GitHub falls back to the checked-in data', async () => {
  const warnings = [];
  const stored = { releases: [], advisories: [] };
  const got = await refresh({
    get: async () => {
      throw new Unreachable('offline');
    },
    readStored: () => stored,
    log: { warn: (m) => warnings.push(m) },
  });
  assert.equal(got.source, 'checked-in');
  assert.equal(warnings.length, 1);
});

test('bad checked-in data fails even offline', async () => {
  await assert.rejects(refresh({ get: null, readStored: () => ({ releases: 'x' }), offline: true }), DataError);
});

test('bad data from GitHub fails instead of falling back', async () => {
  await assert.rejects(
    refresh({ get: async () => [{ tag_name: 'nope' }], readStored: () => ({ releases: [], advisories: [] }) }),
    DataError,
  );
});

test('rate limits and server errors count as unreachable; a 404 is bad data', async () => {
  const answer = (status) => async () => ({ status, ok: status < 300, json: async () => [] });
  await assert.rejects(githubGetter(answer(429), '')('/x'), Unreachable);
  await assert.rejects(githubGetter(answer(503), '')('/x'), Unreachable);
  await assert.rejects(githubGetter(answer(404), '')('/x'), DataError);
  await assert.rejects(githubGetter(async () => { throw new Error('ENOTFOUND'); }, '')('/x'), Unreachable);
  assert.deepEqual(await githubGetter(answer(200), '')('/x'), []);
});

test('the checked-in data is valid', () => {
  validateData(JSON.parse(readFileSync(DATA_PATH, 'utf8')));
});

test('an appliance release with no files yet is left out', () => {
  const api = [
    { tag_name: 'v0.1.0-rc.2', prerelease: true, published_at: '2026-10-14T02:15:25Z', html_url: 'https://github.com/Sneakers-PAM/sneakers-appliance/releases/tag/v0.1.0-rc.2', assets: [], body: '' },
    { tag_name: 'v0.1.0-rc.1', prerelease: true, published_at: '2026-10-13T03:22:32Z', html_url: 'https://github.com/Sneakers-PAM/sneakers-appliance/releases/tag/v0.1.0-rc.1', assets: [{ name: 'sneakers-appliance-baseOS-0.1.0-rc.1-amd64.bin' }], body: '' },
  ];
  assert.deepEqual(normalizeReleases(APPLIANCE, api).map((r) => r.tag), ['v0.1.0-rc.1']);
});
