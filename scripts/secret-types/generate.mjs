// Writes the secret-type pages from catalog.json and notes.mjs, or with --check
// fails when a page on disk doesn't match what the catalogue makes (a page
// edited by hand, or a catalogue change that wasn't regenerated).
//
//   node scripts/secret-types/generate.mjs [--check]

import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TYPE_NOTES } from './notes.mjs';
import { OUT_DIR, renderAll } from './render.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));

export function loadCatalog() {
  return JSON.parse(readFileSync(join(root, 'scripts/secret-types/catalog.json'), 'utf8'));
}

// Every difference between the generated set and the files on disk, by path.
export function drift(files, base = root) {
  const problems = [];
  for (const [rel, want] of files) {
    const path = join(base, rel);
    if (!existsSync(path)) problems.push(`${rel}: missing`);
    else if (readFileSync(path, 'utf8') !== want) problems.push(`${rel}: differs from the catalogue`);
  }
  const dir = join(base, OUT_DIR);
  if (existsSync(dir)) {
    for (const name of readdirSync(dir)) {
      if (!files.has(`${OUT_DIR}/${name}`)) problems.push(`${OUT_DIR}/${name}: not made from the catalogue`);
    }
  }
  return problems;
}

function main(argv) {
  const files = renderAll(loadCatalog(), TYPE_NOTES);
  if (argv.includes('--check')) {
    const problems = drift(files);
    if (problems.length) {
      console.error('The secret-type pages have drifted from catalog.json:');
      for (const p of problems) console.error(`  ${p}`);
      console.error('Run npm run types:generate and commit the result.');
      process.exit(1);
    }
    console.log(`The ${files.size} secret-type files match catalog.json.`);
    return;
  }
  for (const [rel, text] of files) {
    const path = join(root, rel);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  console.log(`Wrote ${files.size} secret-type files.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
