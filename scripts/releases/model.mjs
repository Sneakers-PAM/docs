// The changelog and security advisory data: what the GitHub API returns, turned
// into the small, checked shape the site's pages read. Pure functions only;
// fetch.mjs does the network and file work.

// The repositories that ship, in the order the changelog shows them: the
// appliance (whose releases carry the Base OS, Base Web and product update
// units), then the product release (the Helm charts and pinned manifest).
export const REPOS = ['Sneakers-PAM/sneakers-appliance', 'Sneakers-PAM/sneakers-release'];

export const UNITS = [
  { id: 'baseOS', label: 'Base OS' },
  { id: 'baseWeb', label: 'Base Web' },
  { id: 'product', label: 'Product' },
];

export const SEVERITIES = ['critical', 'high', 'medium', 'low', 'unknown'];

export class DataError extends Error {}

const fail = (msg) => {
  throw new DataError(msg);
};

const isDate = (s) => typeof s === 'string' && !Number.isNaN(Date.parse(s));
const isHttps = (s) => typeof s === 'string' && /^https:\/\/[^\s]+$/.test(s);

// stable: vX.Y.Z and not marked prerelease. rc: vX.Y.Z-rc.N. Anything else
// published as a prerelease is shown as a pre-release.
export function channelOf(tag, prerelease) {
  if (/^v\d+\.\d+\.\d+$/.test(tag) && !prerelease) return 'stable';
  if (/^v\d+\.\d+\.\d+-rc\.\d+$/.test(tag)) return 'rc';
  return 'pre-release';
}

const UNIT_ASSETS = [
  ['baseOS', /^sneakers-appliance-baseOS-(?!patch-)(.+)-(?:amd64|arm64)\.bin$/],
  ['baseWeb', /^sneakers-appliance-baseWeb-(.+)-(?:amd64|arm64)\.bin$/],
  ['product', /^sneakers-product-(.+)-(?:amd64|arm64)\.bin$/],
];

// The update units a release ships, read from its asset names. An appliance
// release with no unit files is the Base OS at its tag; a product release is
// the product at its tag.
export function unitsOf(repo, tag, assetNames) {
  const found = new Map();
  for (const name of assetNames) {
    for (const [unit, re] of UNIT_ASSETS) {
      const m = re.exec(name);
      if (m && !found.has(unit)) found.set(unit, m[1]);
    }
  }
  const version = tag.replace(/^v/, '');
  if (repo.endsWith('/sneakers-release')) return [{ unit: 'product', version }];
  if (found.size === 0) return [{ unit: 'baseOS', version }];
  return UNITS.filter((u) => found.has(u.id)).map((u) => ({ unit: u.id, version: found.get(u.id) }));
}

// Release notes, as blocks the page renders without any HTML: headings, list
// items and paragraphs, each a list of inline runs (text, bold, code, link).
export function parseNotes(markdown) {
  const blocks = [];
  let para = [];
  const flush = () => {
    if (para.length) blocks.push({ type: 'paragraph', inline: inline(para.join(' ')) });
    para = [];
  };
  for (const raw of String(markdown ?? '').replace(/\r/g, '').split('\n')) {
    const line = raw.trim();
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    const li = /^[-*]\s+(.*)$/.exec(line);
    if (!line) flush();
    else if (h) {
      flush();
      blocks.push({ type: 'heading', inline: inline(h[2]) });
    } else if (li) {
      flush();
      const last = blocks.at(-1);
      if (last?.type === 'list') last.items.push(inline(li[1]));
      else blocks.push({ type: 'list', items: [inline(li[1])] });
    } else para.push(line);
  }
  flush();
  return blocks;
}

const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https:\/\/[^\s)]+)/g;

export function inline(text) {
  const out = [];
  let at = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > at) out.push({ t: 'text', v: text.slice(at, m.index) });
    if (m[1] !== undefined) out.push({ t: 'code', v: m[1] });
    else if (m[2] !== undefined) out.push({ t: 'bold', v: m[2] });
    else if (m[3] !== undefined) out.push(isHttps(m[4]) ? { t: 'link', v: m[3], href: m[4] } : { t: 'text', v: m[3] });
    else out.push({ t: 'link', v: m[5], href: m[5] });
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push({ t: 'text', v: text.slice(at) });
  return out;
}

export function normalizeReleases(repo, api) {
  if (!Array.isArray(api)) fail(`${repo}: releases answer isn't a list`);
  const out = [];
  for (const r of api) {
    if (r?.draft) continue;
    if (typeof r?.tag_name !== 'string' || !/^v\d+\.\d+\.\d+/.test(r.tag_name)) fail(`${repo}: a release has a bad tag ${r?.tag_name}`);
    if (!isDate(r.published_at)) fail(`${repo} ${r.tag_name}: no published date`);
    if (!isHttps(r.html_url)) fail(`${repo} ${r.tag_name}: no release link`);
    const assets = Array.isArray(r.assets) ? r.assets.map((a) => a?.name).filter((n) => typeof n === 'string') : [];
    // An appliance release with no files yet is still being built (or its
    // release run failed): it isn't a release anyone can take, so leave it out.
    if (repo.endsWith('/sneakers-appliance') && assets.length === 0) continue;
    out.push({
      repo,
      tag: r.tag_name,
      name: typeof r.name === 'string' && r.name ? r.name : r.tag_name,
      channel: channelOf(r.tag_name, !!r.prerelease),
      publishedAt: new Date(r.published_at).toISOString(),
      url: r.html_url,
      units: unitsOf(repo, r.tag_name, assets),
      notes: parseNotes(r.body),
    });
  }
  return out;
}

export function normalizeAdvisories(repo, api) {
  if (!Array.isArray(api)) fail(`${repo}: advisories answer isn't a list`);
  return api
    .filter((a) => a?.state === undefined || a.state === 'published')
    .map((a) => {
      if (typeof a?.ghsa_id !== 'string' || !/^GHSA(-[0-9a-z]{4}){3}$/.test(a.ghsa_id)) fail(`${repo}: an advisory has a bad id ${a?.ghsa_id}`);
      if (a.cve_id != null && !/^CVE-\d{4}-\d{4,}$/.test(a.cve_id)) fail(`${repo} ${a.ghsa_id}: bad CVE id ${a.cve_id}`);
      if (typeof a.summary !== 'string' || !a.summary) fail(`${repo} ${a.ghsa_id}: no summary`);
      const severity = a.severity ?? 'unknown';
      if (!SEVERITIES.includes(severity)) fail(`${repo} ${a.ghsa_id}: unknown severity ${severity}`);
      if (!isDate(a.published_at)) fail(`${repo} ${a.ghsa_id}: no published date`);
      if (!isHttps(a.html_url)) fail(`${repo} ${a.ghsa_id}: no advisory link`);
      const vulns = Array.isArray(a.vulnerabilities) ? a.vulnerabilities : [];
      return {
        repo,
        ghsaId: a.ghsa_id,
        cveId: a.cve_id ?? null,
        severity,
        summary: a.summary,
        publishedAt: new Date(a.published_at).toISOString(),
        url: a.html_url,
        affected: vulns.map((v) => ({
          package: v?.package?.name ?? repo.split('/')[1],
          affected: v?.vulnerable_version_range || 'not stated',
          fixed: v?.patched_versions || 'not fixed yet',
        })),
      };
    });
}

const newestFirst = (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.repo.localeCompare(b.repo);

// The checked shape both pages read. `releases` and `advisories` are each
// sorted newest first.
export function validateData(data) {
  if (!data || !Array.isArray(data.releases) || !Array.isArray(data.advisories)) fail('site data: releases and advisories must be lists');
  for (const r of data.releases) {
    if (!REPOS.includes(r.repo)) fail(`site data: release from an unknown repository ${r.repo}`);
    if (!['stable', 'rc', 'pre-release'].includes(r.channel)) fail(`site data ${r.tag}: bad channel`);
    if (!isDate(r.publishedAt) || !isHttps(r.url)) fail(`site data ${r.tag}: bad date or link`);
    if (!Array.isArray(r.units) || !r.units.length || r.units.some((u) => !UNITS.some((x) => x.id === u.unit) || !u.version)) {
      fail(`site data ${r.tag}: bad units`);
    }
    if (!Array.isArray(r.notes)) fail(`site data ${r.tag}: bad notes`);
  }
  for (const a of data.advisories) {
    if (!REPOS.includes(a.repo)) fail(`site data: advisory from an unknown repository ${a.repo}`);
    if (!SEVERITIES.includes(a.severity) || !isHttps(a.url) || !a.ghsaId) fail(`site data: bad advisory ${a.ghsaId}`);
  }
  return data;
}

export function buildData(perRepo) {
  const releases = [];
  const advisories = [];
  for (const repo of REPOS) {
    const got = perRepo[repo];
    if (!got) fail(`no answer for ${repo}`);
    releases.push(...normalizeReleases(repo, got.releases));
    advisories.push(...normalizeAdvisories(repo, got.advisories));
  }
  releases.sort(newestFirst);
  advisories.sort(newestFirst);
  return validateData({ releases, advisories });
}

// The changelog's sections: one per unit, each with the releases that ship
// it, newest first.
export function byUnit(releases) {
  return UNITS.map((u) => ({
    ...u,
    entries: releases
      .filter((r) => r.units.some((x) => x.unit === u.id))
      .map((r) => ({ ...r, version: r.units.find((x) => x.unit === u.id).version })),
  }));
}
