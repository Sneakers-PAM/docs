// Refreshes src/data/releases.json, the data behind /changelog and
// /security/advisories, from the GitHub API, before each build.
//
//   node scripts/releases/fetch.mjs [--offline]
//
// When GitHub can't be reached (no network, a rate limit, a server error) it
// keeps the last fetched data that's checked in, with a warning, so the build
// still works offline. Bad data, fetched or checked in, fails the run.
// GITHUB_TOKEN, when set, is sent to raise the rate limit; it's never logged.

import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildData, DataError, REPOS, validateData } from './model.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
export const DATA_PATH = join(root, 'src/data/releases.json');

export class Unreachable extends Error {}

export function githubGetter(fetchImpl = globalThis.fetch, token = process.env.GITHUB_TOKEN) {
  return async (path) => {
    let res;
    try {
      res = await fetchImpl(`https://api.github.com${path}`, {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(15000),
      });
    } catch (err) {
      throw new Unreachable(`${path}: ${err.message}`);
    }
    if (res.status === 403 || res.status === 429 || res.status >= 500) {
      throw new Unreachable(`${path}: HTTP ${res.status}`);
    }
    if (!res.ok) throw new DataError(`${path}: HTTP ${res.status}`);
    try {
      return await res.json();
    } catch {
      throw new DataError(`${path}: the answer isn't JSON`);
    }
  };
}

// Returns { data, source } where source is 'github' or 'checked-in'.
export async function refresh({ get, readStored, offline = false, log = console }) {
  const stored = () => {
    const data = validateData(readStored());
    return { data, source: 'checked-in' };
  };
  if (offline) return stored();
  const perRepo = {};
  try {
    for (const repo of REPOS) {
      perRepo[repo] = {
        releases: await get(`/repos/${repo}/releases?per_page=100`),
        advisories: await get(`/repos/${repo}/security-advisories?state=published&per_page=100`),
      };
    }
  } catch (err) {
    if (!(err instanceof Unreachable)) throw err;
    log.warn(`GitHub isn't reachable (${err.message}); using the checked-in release data.`);
    return stored();
  }
  return { data: buildData(perRepo), source: 'github' };
}

async function main(argv) {
  const text = (data) => `${JSON.stringify(data, null, 2)}\n`;
  const before = readFileSync(DATA_PATH, 'utf8');
  const { data, source } = await refresh({
    get: githubGetter(),
    readStored: () => JSON.parse(before),
    offline: argv.includes('--offline') || process.env.SITE_DATA_OFFLINE === '1',
  });
  if (source === 'github' && text(data) !== before) writeFileSync(DATA_PATH, text(data));
  console.log(
    `Release data (${source}): ${data.releases.length} releases, ${data.advisories.length} advisories.`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(`Release data refused: ${err.message}`);
    process.exit(1);
  });
}
