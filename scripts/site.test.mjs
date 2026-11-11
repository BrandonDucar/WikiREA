import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite, catalogSelection, validateCatalogEnvelope, decodeCatalogSnapshot, readBuildCatalog } from './build-site.mjs';
import { sha } from './research.mjs';
import { category, filterEntries, safeUrl, workerStatus } from '../web/app.js';

test('search and category filters compose without hiding research provenance', () => {
  const entries = [{ title: 'Toaster', summary: 'Resistive heating', automated: true }, { title: 'Node.js runtime', automated: false }];
  assert.equal(category(entries[0]), 'Hardware');
  assert.equal(filterEntries(entries, 'HEATING', 'Hardware', 'research').length, 1);
  assert.equal(filterEntries(entries, '', 'Everything', 'research').length, 1);
  assert.equal(filterEntries(entries, 'absent').length, 0);
});

const snapshotBytes = await fs.readFile(new URL(`../${catalogSelection.snapshotPath}`, import.meta.url));
const snapshot = JSON.parse(snapshotBytes);
test('catalog reader consumes the exact retained real packet without refreshing source dates', async () => {
  const selected = await readBuildCatalog();
  assert.equal(selected.packet.id, catalogSelection.packetId);
  assert.equal(selected.packet.sourcePin.observedAt, catalogSelection.sourceObservedAt);
  assert.equal(selected.packet.sourcePin.sourceTimestamp, catalogSelection.sourceTimestamp);
  assert.equal(selected.packet.consumerAcceptance, false);
  assert.equal(selected.packet.publicationApproved, false);
});
for (const [name, mutate] of [
  ['changed exact bytes', t => { t.record.packetJsonUtf8 += ' '; }],
  ['forged file hash', t => { t.record.packetSha256 = '0'.repeat(64); }],
  ['wrong original source commit', t => { t.record.sourceCommit = '0'.repeat(40); }],
  ['publishing escalation', t => { t.record.publicationApproved = true; }],
  ['P0 promotion', t => { t.record.proofLevel = 'P1'; }],
  ['wrong catalog artifact', t => { t.artifactId = '0'.repeat(64); }],
  ['wrong catalog version', t => { t.artifactVersion = '0'.repeat(64); }],
  ['wrong compiler binding', t => { t.sourceDigest = '0'.repeat(64); }],
  ['memory promotion', t => { t.hostPromotionsAccepted = true; }],
]) test(`catalog rejects ${name}`, () => {
  const changed = structuredClone(snapshot); mutate(changed);
  assert.throws(() => validateCatalogEnvelope(changed));
});
test('catalog snapshot cannot be replaced with self-reported readback flags', () => {
  assert.throws(() => decodeCatalogSnapshot(Buffer.concat([snapshotBytes, Buffer.from(' ')])), /CATALOG_SNAPSHOT_HASH/);
});
test('missing snapshot and conflicting repository bytes have no unrelated fallback', async () => {
  const here = fileURLToPath(new URL('..', import.meta.url));
  const original = fs.readFile;
  try {
    fs.readFile = async (...args) => {
      if (path.resolve(args[0]) === path.join(here, catalogSelection.snapshotPath)) throw new Error('fixture missing');
      return original(...args);
    };
    await assert.rejects(readBuildCatalog(), /CATALOG_SNAPSHOT_UNAVAILABLE/);
    fs.readFile = async (...args) => path.resolve(args[0]) === path.join(here, catalogSelection.sourcePath) ? Buffer.from('changed packet') : original(...args);
    await assert.rejects(readBuildCatalog(), /CATALOG_REPOSITORY_PACKET_DRIFT/);
  } finally { fs.readFile = original; }
});
test('normal production build emits exact P0 catalog inclusion once with stable replay', async () => {
  const first = await fs.mkdtemp(path.join(os.tmpdir(), 'wikirea-catalog-a-'));
  const second = await fs.mkdtemp(path.join(os.tmpdir(), 'wikirea-catalog-b-'));
  try {
    for (const dir of [first, second]) await buildSite(undefined, dir);
    const a = JSON.parse(await fs.readFile(path.join(first, 'catalog-consumption.json'), 'utf8'));
    const b = JSON.parse(await fs.readFile(path.join(second, 'catalog-consumption.json'), 'utf8'));
    const data = JSON.parse(await fs.readFile(path.join(first, 'data.json'), 'utf8'));
    assert.equal(a.stableProjectionSha256, b.stableProjectionSha256);
    assert.equal(a.consumerDataSha256, sha(JSON.stringify(data)));
    const selectedJob = data.state.jobs.find(j => j.id === catalogSelection.packetId);
    const reviewedSeparately = selectedJob.status === 'COMPLETED' || Boolean(selectedJob.publication);
    assert.equal(a.selectedDraftCount, reviewedSeparately ? 0 : 1);
    assert.equal(a.acceptedEntryCountFromCatalog, 0);
    assert.equal(a.separatelyReviewedEntryCount, reviewedSeparately ? 1 : 0);
    assert.equal(a.networkCalls, 0);
    assert.equal(a.sourceObservedAt, catalogSelection.sourceObservedAt);
    assert.equal(a.sourceTimestamp, catalogSelection.sourceTimestamp);
    assert.equal(data.drafts.filter(d => d.id === catalogSelection.packetId).length, reviewedSeparately ? 0 : 1);
    assert.equal(data.entries.filter(d => d.id === catalogSelection.packetId).length, reviewedSeparately ? 1 : 0);
    assert.equal(a.modelContextInclusion, false);
    assert.equal(a.memoryPromotionAccepted, false);
  } finally {
    await fs.rm(first, { recursive: true });
    await fs.rm(second, { recursive: true });
  }
});
test('source links cannot invoke script, data or file protocols', () => {
  for (const bad of ['javascript:alert(1)', 'data:text/html,test', 'file:///private', 'not a url']) assert.equal(safeUrl(bad), null);
  assert.equal(safeUrl('https://en.wikipedia.org/wiki/Toaster'), 'https://en.wikipedia.org/wiki/Toaster');
});
test('expired reservations are shown as interrupted, never fabricated live workers', () => {
  const now = Date.now();
  assert.equal(workerStatus([]).label, 'Awaiting first run');
  assert.equal(workerStatus([{ status: 'RESERVED', expiresAt: new Date(now - 1).toISOString() }], now).label, 'Interrupted / lease expired');
  assert.equal(workerStatus([{ status: 'COMPLETED' }], now).kind, 'complete');
  assert.equal(workerStatus([{ status: 'COMPILED', packet: 'retained' }], now).kind, 'compiled');
  assert.equal(workerStatus([{ status: 'FAILED', lastStage: 'reviewer', packet: 'retained' }], now).label, 'Draft compiled · review pending');
});
test('public renderer uses text nodes and safe links rather than executing source markup', async () => {
  const source = await fs.readFile(new URL('../web/app.js', import.meta.url), 'utf8');
  assert(!source.includes('innerHTML')); assert(!source.includes('eval('));
  assert(source.includes('textContent')); assert(source.includes('noopener noreferrer'));
});

test('deployed asset URLs change with exact source bytes to invalidate browser caches', async () => {
  const output = await fs.mkdtemp(path.join(os.tmpdir(), 'wikirea-site-'));
  try {
    await buildSite(undefined, output);
    const html = await fs.readFile(path.join(output, 'index.html'), 'utf8');
    for (const name of ['app.js', 'styles.css']) {
      const digest = sha(await fs.readFile(path.join(output, name)));
      assert(html.includes(`"${name}?v=${digest}"`));
    }
  } finally { await fs.rm(output, { recursive: true }); }
});
