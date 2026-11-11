import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { root, checkText, verify } from './verify.mjs';
import { buildContributorPlan } from './contributors.mjs';
import { validateArchive, validateResearchPacket, sha } from './research.mjs';

// Reviewed public-only projection of one exact existing catalog get. The build
// has no database, host credentials, arbitrary tenant selection or network call.
export const catalogSelection = Object.freeze({
  snapshotPath: 'provenance/wikirea-catalog-snapshot.json',
  snapshotSha256: '5e1b4726fe83b2a6d90a6da88968c6a1f31f9b47775a84adfd397ea1b1911ae5',
  compilerId: 'knowledge-compiler',
  artifactId: 'f5eb4f0b7db9c91e3a1ae651dd2e6b4ddc7d157f582de8b31c32e817a05e076b',
  artifactVersion: 'fa3cd5d4032418ef39e647cbad6b6b9c42992c59db7dcf8ca1a3d71bc966b26b',
  artifactDigest: '2f70ab15b16f19c8bf528800749310c2893ceddddc15a7000c97b88688153e61',
  sourceDigest: 'd1bfc7a8110097d8903be5ff95d966ac2381079183dacb2d2c8041c112530150',
  sourceCommit: '7bbfd5a76df0f5bf835e3f5fa6d1892d3a7eb6cf',
  sourcePath: 'research/packets/research-000009-96ee7b2932.json',
  packetId: 'research-000009-96ee7b2932',
  packetSha256: '4cb06772fcf2dd60033262f8d68704c38b05fbbf4f7d6e6050f88a8a971dc735',
  sourceObservedAt: '2026-11-11T19:23:22.058Z',
  sourceTimestamp: '2026-11-08T02:21:00Z'
});

export function validateCatalogEnvelope(transport) {
  assert.equal(transport.schema, 'dreamnet.wikirea.catalog-transport-receipt.v1');
  for (const key of ['compilerId', 'artifactId', 'artifactVersion', 'artifactDigest', 'sourceDigest'])
    assert.equal(transport[key], catalogSelection[key], `CATALOG_BINDING:${key}`);
  assert.equal(transport.stage, 'unreviewed');
  assert.equal(transport.hostPromotionsAccepted, false);
  const record = transport.record;
  assert.equal(record.representation, 'EXACT_UTF8_SERIALIZATION_NOT_REORDERED_OBJECT');
  for (const key of ['sourceCommit', 'sourcePath', 'packetSha256'])
    assert.equal(record[key], catalogSelection[key], `CATALOG_SOURCE:${key}`);
  assert.equal(record.proofLevel, 'P0');
  for (const key of ['publicationApproved', 'runtimeActivationAllowed', 'understandingAssessed'])
    assert.equal(record[key], false, `CATALOG_AUTHORITY:${key}`);
  assert.equal(typeof record.packetJsonUtf8, 'string');
  assert(Buffer.byteLength(record.packetJsonUtf8, 'utf8') <= 32768, 'CATALOG_PACKET_SIZE');
  assert.equal(sha(record.packetJsonUtf8), catalogSelection.packetSha256, 'CATALOG_EXACT_UTF8');
  const packet = validateResearchPacket(JSON.parse(record.packetJsonUtf8));
  assert.equal(packet.id, catalogSelection.packetId);
  assert.equal(packet.sourcePin.observedAt, catalogSelection.sourceObservedAt);
  assert.equal(packet.sourcePin.sourceTimestamp, catalogSelection.sourceTimestamp);
  return { packet, packetJsonUtf8: record.packetJsonUtf8, snapshotRecordedAt: transport.recordedAt };
}

export function decodeCatalogSnapshot(bytes) {
  assert(Buffer.isBuffer(bytes) && bytes.length <= 65536, 'CATALOG_SNAPSHOT_SIZE');
  assert.equal(sha(bytes), catalogSelection.snapshotSha256, 'CATALOG_SNAPSHOT_HASH');
  return validateCatalogEnvelope(JSON.parse(bytes.toString('utf8')));
}

export async function readBuildCatalog(base = root) {
  let bytes;
  try { bytes = await fs.readFile(path.join(base, catalogSelection.snapshotPath)); }
  catch (error) { throw new Error('CATALOG_SNAPSHOT_UNAVAILABLE', { cause: error }); }
  const selected = decodeCatalogSnapshot(bytes);
  const source = await fs.readFile(path.join(base, catalogSelection.sourcePath));
  assert.equal(sha(source), catalogSelection.packetSha256, 'CATALOG_REPOSITORY_PACKET_DRIFT');
  assert.equal(source.toString('utf8'), selected.packetJsonUtf8, 'CATALOG_REPOSITORY_BYTES');
  return selected;
}

export async function buildSite(base = root, output = path.join(base, '.local/site')) {
  await verify(base); await validateArchive(base);
  const selected = await readBuildCatalog(base);
  const load = async name => JSON.parse(await fs.readFile(path.join(base, name), 'utf8'));
  const catalog = await load('library.json'); const state = await load('research/state.json');
  const entries = [], drafts = [];
  for (const e of catalog.entries) {
    const markdown = await fs.readFile(path.join(base, e.article), 'utf8');
    const paragraphs = markdown.split(/\n\s*\n/).filter(x => !/^(#|\||-|>)/.test(x.trim()));
    entries.push({ ...e, markdown, summary: paragraphs.find(x => x.trim().length > 70)?.replaceAll('\n', ' ') || e.title, automated: false });
  }
  for (const j of state.jobs.filter(j => j.status === 'COMPLETED' || j.publication)) {
    const entry = j.entry || j.publication.entry;
    assert.equal(entry, `research/entries/${j.id}.json`);
    entries.unshift({ ...await load(entry), automated: true });
  }
  for (const j of state.jobs.filter(j => j.packet && j.status !== 'COMPLETED' && !j.publication)) {
    const p = j.id === catalogSelection.packetId ? selected.packet : await load(j.packet);
    drafts.push({ ...p.findings, id: j.id, title: j.topic, role: j.role, createdAt: j.reservedAt,
      sources: [p.sourcePin], automated: true, unreviewed: true, stage: p.stage, proofLevel: p.proofLevel,
      compilerRef: { artifactId: p.artifactId, artifactDigest: p.artifactDigest, packet: j.packet,
        ...(j.id === catalogSelection.packetId ? { catalog: catalogSelection } : {}) },
      reviewError: j.error || null });
  }
  const sourcePins = {};
  for (const name of ['library.json', 'research/state.json', 'research/config.json', 'web/app.js', 'scripts/build-site.mjs', catalogSelection.snapshotPath]) sourcePins[name] = sha(await fs.readFile(path.join(base, name)));
  const data = { builtAt: new Date().toISOString(), sourceCommit: process.env.GITHUB_SHA || null, sourcePins, entries, drafts, state,
    roles: buildContributorPlan(catalog).tasks.map(t => t.role), mechanics: (await load('mechanics.json')).mechanics };
  checkText(JSON.stringify(data));
  const job = state.jobs.find(j => j.id === catalogSelection.packetId);
  assert(job && job.packet === catalogSelection.sourcePath, 'CATALOG_JOB_BINDING');
  const selectedDrafts = drafts.filter(d => d.id === selected.packet.id);
  const reviewedEntries = entries.filter(e => e.id === selected.packet.id);
  const reviewedSeparately = job.status === 'COMPLETED' || Boolean(job.publication);
  assert.equal(selectedDrafts.length, reviewedSeparately ? 0 : 1, 'CATALOG_DRAFT_INCLUSION');
  assert.equal(reviewedEntries.length, reviewedSeparately ? 1 : 0, 'CATALOG_SEPARATE_REVIEW');
  if (selectedDrafts.length) {
    assert.equal(selectedDrafts[0].unreviewed, true);
    assert.equal(selectedDrafts[0].proofLevel, 'P0');
    assert.equal(selectedDrafts[0].summary, selected.packet.findings.summary);
    assert.deepEqual(selectedDrafts[0].sources, [selected.packet.sourcePin]);
  }
  const { builtAt, ...projection } = data;
  const consumption = { schema: 'wikirea.catalog-build-consumption.v1', consumedAt: builtAt,
    selectedArtifact: catalogSelection, snapshotRecordedAt: selected.snapshotRecordedAt,
    packetDigest: selected.packet.artifactDigest, sourceObservedAt: selected.packet.sourcePin.observedAt,
    sourceTimestamp: selected.packet.sourcePin.sourceTimestamp, sourcePins,
    consumerDataSha256: sha(JSON.stringify(data)), stableProjectionSha256: sha(JSON.stringify(projection)),
    selectedDraftCount: selectedDrafts.length, acceptedEntryCountFromCatalog: 0,
    separatelyReviewedEntryCount: reviewedEntries.length,
    proofLevel: 'P0', stage: 'unreviewed', catalogSource: 'RETAINED_EXACT_GET_SNAPSHOT',
    modelContextInclusion: false, understandingAssessed: false, memoryPromotionAccepted: false,
    publicationApproved: false, buildReaderInstalled: true, liveCatalogConnection: false, networkCalls: 0 };
  checkText(JSON.stringify(consumption));
  await fs.mkdir(output, { recursive: true });
  for (const name of ['app.js', 'styles.css']) await fs.copyFile(path.join(base, 'web', name), path.join(output, name));
  let html = await fs.readFile(path.join(base, 'web/index.html'), 'utf8');
  for (const name of ['app.js', 'styles.css']) {
    const digest = sha(await fs.readFile(path.join(base, 'web', name)));
    html = html.replace(`"${name}"`, `"${name}?v=${digest}"`);
  }
  await fs.writeFile(path.join(output, 'index.html'), html);
  await fs.writeFile(path.join(output, 'data.json'), JSON.stringify(data));
  await fs.writeFile(path.join(output, 'catalog-consumption.json'), JSON.stringify(consumption, null, 2) + '\n');
  await fs.writeFile(path.join(output, '.nojekyll'), '');
  return { output, entries: entries.length, unreviewedDrafts: drafts.length, roles: data.roles.length };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await buildSite()));
