import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root, allowed, safeRelative, checkText, validateSource, verify } from './verify.mjs';

test('public catalog, files, links, source bindings and release hashes validate', async () => {
  const result = await verify(); assert(result.investigations >= 12); assert(result.reaParsedFiles >= 54);
});
for (const name of ['HANDOFF.md', '.env', 'evidence/raw.json', 'source/lib.js', 'scripts/unknown.mjs', 'assets/private.jpg']) {
  test(`rejects non-allowlisted file ${name}`, () => assert.equal(allowed(name), false));
}
for (const name of ['../escape', '/absolute', 'a/../b', 'a\\b', 'a:b', 'a//b']) {
  test(`rejects unsafe relative name ${name}`, () => assert.throws(() => safeRelative(name)));
}
for (const [name, value] of [
  ['machine path', ['C:', 'Users', 'someone', 'secret.txt'].join('/')],
  ['API credential', 'sk_' + 'live_' + 'a'.repeat(24)],
  ['GitHub credential', 'ghp' + '_' + 'a'.repeat(30)],
  ['private service', 'https://' + '127.0.0.1' + '/private'],
  ['database URL', 'postgres' + '://' + 'example'],
]) test(`rejects ${name}`, () => assert.throws(() => checkText(value)));

const original = JSON.parse(await fs.readFile(path.join(root, 'provenance/tradingview-lightweight-charts.json'), 'utf8'));
test('valid sanitized source manifest is admitted', () => validateSource(structuredClone(original)));
for (const [name, change] of [
  ['moving source', c => { c.commit = 'master'; }],
  ['external source host', c => { c.files[0].url = 'https://example.com/source'; }],
  ['path escape', c => { c.files[0].name = '../escape'; }],
  ['invented analysis', c => { c.analyzedFiles.push('missing.js'); }],
  ['runtime promotion', c => { c.targetExecuted = true; }],
  ['raw evidence included', c => { c.rawEvidenceIncluded = true; }],
  ['independent reproduction claim', c => { c.analysisSummary.independentlyReproduced = true; }],
]) test(`rejects ${name}`, () => {
  const changed = structuredClone(original); change(changed); assert.throws(() => validateSource(changed));
});
