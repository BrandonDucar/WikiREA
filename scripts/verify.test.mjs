import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root, allowed, safeRelative, checkText, validateSource, validateFishExecution, verify } from './verify.mjs';

test('public catalog, files, links, source bindings and release hashes validate', async () => {
  const result = await verify(); assert(result.investigations >= 16); assert(result.reaParsedFiles >= 57);
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

test('QuickJS host findings do not pretend that C was analyzed as JavaScript', async () => {
  const source = JSON.parse(await fs.readFile(path.join(root, 'provenance/quickjs-host.json'), 'utf8'));
  validateSource(source);
  assert.deepEqual(source.analyzedFiles, ['tests/test_builtin.js']);
  assert(source.files.some(f => f.name === 'quickjs-libc.c'));
  assert(source.omissions.some(text => text.includes('C host files manually inspected')));
});

test('Deno and Bun source coverage remains documentation-only while execution evidence is separate', async () => {
  const catalog = JSON.parse(await fs.readFile(path.join(root, 'library.json'), 'utf8'));
  for (const id of ['deno-permissions', 'bun-compatibility']) {
    const entry = catalog.entries.find(e => e.id === id);
    assert.equal(entry.stage, 'OFFICIAL_DOCUMENTATION_REVIEWED');
    assert.equal(entry.targetExecuted, true);
    assert.equal(entry.runtimeEvidence, 'provenance/runtime-execution.json');
    assert.equal(entry.provenance, undefined);
  }
});

test('MiroFish Python component execution is source-bound, not a full simulator or JS analysis', async () => {
  const source = JSON.parse(await fs.readFile(path.join(root, 'provenance/mirofish-pipeline.json'), 'utf8'));
  const report = JSON.parse(await fs.readFile(path.join(root, 'provenance/mirofish-preparation-execution.json'), 'utf8'));
  validateSource(source); assert.deepEqual(source.analyzedFiles, []);
  validateFishExecution(report, source);
  for (const patch of [{ simulationExecuted: true }, { upstreamCommit: '0'.repeat(40) },
    { privateDataIncluded: true }, { executedSourceFiles: ['missing.py'] }, { modelCalls: 1 }])
    assert.throws(() => validateFishExecution({ ...report, ...patch }, source));
});

test('improvement-system studies bind manual Python subsets without inventing execution or analyzer coverage', async () => {
  const catalog = JSON.parse(await fs.readFile(path.join(root, 'library.json'), 'utf8'));
  let files = 0, python = 0;
  for (const id of ['dspy-optimization', 'darwin-godel-machine', 'alphaevolve-cloud-client']) {
    const entry = catalog.entries.find(e => e.id === id);
    assert.equal(entry.stage, 'SOURCE_INSPECTED_SUBSET');
    assert.equal(entry.targetExecuted, false);
    const source = JSON.parse(await fs.readFile(path.join(root, entry.provenance), 'utf8'));
    validateSource(source);
    assert.equal(source.commit, entry.commit);
    assert.deepEqual(source.analyzedFiles, []);
    assert.equal(source.analysisSummary, undefined);
    assert(source.omissions.some(s => s.includes('no REA analyzer')));
    files += source.files.length;
    python += source.files.filter(f => f.name.endsWith('.py')).length;
  }
  assert.equal(files, 17); assert.equal(python, 11);
  const alpha = catalog.entries.find(e => e.id === 'alphaevolve-cloud-client');
  assert.equal(alpha.repository, 'https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud');
});

test('new improvement mechanics remain proposals, not runtime qualification or authority', async () => {
  const { mechanics } = JSON.parse(await fs.readFile(path.join(root, 'mechanics.json'), 'utf8'));
  for (const id of ['metric-bound-candidate-selection', 'lineage-archive-with-separate-promotion', 'evaluation-handoff-with-reconciliation']) {
    const mechanic = mechanics.find(m => m.id === id);
    assert.equal(mechanic.stage, 'SPECIFIED');
    assert.equal(mechanic.adaptationRuntimeTests, 0);
    assert.equal(mechanic.integrationStatus, 'PROPOSED_NOT_WIRED');
    assert.equal(mechanic.authorityGranted, false);
    assert(mechanic.acceptanceCases.length >= 5);
  }
});
