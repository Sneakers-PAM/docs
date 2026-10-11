// Reads the built-in secret-type catalogue straight from a sneakers-vault
// checkout and writes catalog.json, or with --check fails when catalog.json no
// longer matches the code.
//
//   node scripts/secret-types/sync.mjs <sneakers-vault checkout> [--check]
//
// It needs Go. typedump.go is compiled inside the checkout through
// `go run -overlay`, so nothing is written into the checkout.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateCatalog } from './render.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
export const CATALOG_PATH = join(here, 'catalog.json');

export function readCatalogFromCode(vaultDir) {
  const dir = resolve(vaultDir);
  const virtualFile = join(dir, 'cmd', 'website-typedump', 'main.go');
  const overlayDir = mkdtempSync(join(tmpdir(), 'typedump-'));
  const overlay = join(overlayDir, 'overlay.json');
  writeFileSync(overlay, JSON.stringify({ Replace: { [virtualFile]: join(here, 'typedump.go') } }));
  const out = execFileSync('go', ['run', `-overlay=${overlay}`, './cmd/website-typedump'], {
    cwd: dir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
  const dump = JSON.parse(out);
  return {
    source: {
      repository: 'Sneakers-PAM/sneakers-vault',
      path: 'internal/vault/grpcsvc/builtins.go',
      commit,
    },
    ...dump,
  };
}

// The catalogue without its source commit, for comparing two catalogues.
const content = (catalog) => JSON.stringify({ ...catalog, source: undefined });

function main(argv) {
  const args = argv.filter((a) => a !== '--check');
  const check = argv.includes('--check');
  if (args.length !== 1) {
    console.error('usage: node scripts/secret-types/sync.mjs <sneakers-vault checkout> [--check]');
    process.exit(2);
  }
  const fromCode = readCatalogFromCode(args[0]);
  validateCatalog(fromCode);
  if (check) {
    const stored = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
    if (content(stored) !== content(fromCode)) {
      console.error(
        `catalog.json doesn't match the vault at ${fromCode.source.commit}. ` +
          'Run sync.mjs without --check, then npm run types:generate.',
      );
      process.exit(1);
    }
    console.log(`catalog.json matches the vault at ${fromCode.source.commit}.`);
    return;
  }
  writeFileSync(CATALOG_PATH, `${JSON.stringify(fromCode, null, 2)}\n`);
  console.log(`Wrote catalog.json from the vault at ${fromCode.source.commit}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
