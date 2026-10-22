// Writes figma-source.json: which Figma library version this PR was made from.
// Run it as the last step of an update, after the parity check passes:
//
//   FIGMA_TOKEN=... node scripts/write-figma-source.mjs
//
// Needs Node 18+ and a Figma personal access token with the file_content:read
// scope, set in the environment. The token is never written anywhere.
// token-verify (run by the engineering team) compares this version with the
// library's version at check time, to tell real errors from unreleased changes.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE_KEY = process.argv[2] || 'RKduL8UHSJyIMVyotTzSZS'; // NDS Tokens & Variables library
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'figma-source.json');

const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.error('Set FIGMA_TOKEN in the environment first.');
  process.exit(2);
}

const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}?depth=1`, {
  headers: { 'X-Figma-Token': token },
});
if (!res.ok) {
  console.error(`Figma API error ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(2);
}
const file = await res.json();

const source = {
  figma_file_key: FILE_KEY,
  figma_file_name: file.name,
  figma_version: file.version,
  figma_last_modified: file.lastModified,
  generated_at: new Date().toISOString(),
};
writeFileSync(OUT, JSON.stringify(source, null, 2) + '\n');
console.log(`figma-source.json: ${file.name}, version ${file.version}, last modified ${file.lastModified}`);
