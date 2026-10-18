import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const rootFiles = new Set(['README.md', 'LICENSE', 'LICENSE-DOCS.md', 'PROVENANCE.md',
  'CONTRIBUTING.md', 'ATTRIBUTION.md', 'ENTRY_TEMPLATE.md', 'TARGETS.md', '.gitignore', '.gitattributes',
  'library.json', 'mechanics.json', 'release-manifest.json']);
export function allowed(name) {
  return rootFiles.has(name) || /^wiki\/[a-z0-9-]+\.md$/.test(name) ||
    /^provenance\/[a-z0-9-]+\.json$/.test(name) ||
    /^scripts\/(verify\.mjs|verify\.test\.mjs|fetch-source\.mjs|events-probe\.test\.mjs|runtime-probe\.test\.mjs|portable-probe\.js|portable\.test\.mjs|run-portable\.mjs|quickjs\.Dockerfile|mirofish-probe\.py)$/.test(name) ||
    name === 'assets/wikirea-poster.png' || name === '.github/workflows/verify.yml';
}
export function safeRelative(name) {
  assert(typeof name === 'string' && name.length > 0);
  assert(!name.includes('\\') && !name.includes(':') && !name.includes('\0'));
  assert(name.split('/').every(x => x && x !== '.' && x !== '..'));
  return name;
}
export function checkText(value) {
  for (const pattern of [
    /\b[A-Za-z]:[\\/](?:Users|Windows|Program Files)[\\/]/i,
    /\/(?:Users|home)\/[a-z0-9_.-]+\//i,
    /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}/,
    /\bgh[pousr]_[A-Za-z0-9]{20,}/,
    /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/,
    /github\.com[/:]BrandonDucar\/dream-net/i,
    /https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.|10\.\d+\.)/i,
    /\b(?:postgres(?:ql)?|redis|mongodb):\/\//i,
  ]) assert(!pattern.test(value), 'PRIVATE_OR_SECRET_PATTERN');
}
export function validateSource(manifest) {
  assert.equal(manifest.schemaVersion, 'wikirea.public-source.v1');
  assert.match(manifest.repository, /^https:\/\/github\.com\/[a-z0-9_.-]+\/[a-z0-9_.-]+$/i);
  assert.match(manifest.commit, /^[a-f0-9]{40}$/);
  assert.equal(manifest.sourceScope, 'EXPLICIT_SUBSET');
  assert.equal(manifest.targetExecuted, false);
  assert.equal(manifest.rawEvidenceIncluded, false);
  assert(Array.isArray(manifest.files) && manifest.files.length > 0 && manifest.files.length <= 32);
  const names = new Set(); let total = 0;
  const repo = new URL(manifest.repository).pathname;
  for (const item of manifest.files) {
    safeRelative(item.name); assert(!names.has(item.name)); names.add(item.name);
    assert(Number.isInteger(item.sizeBytes) && item.sizeBytes > 0 && item.sizeBytes <= 1048576);
    assert.match(item.sha256, /^[a-f0-9]{64}$/); assert.match(item.gitBlobSha1, /^[a-f0-9]{40}$/);
    assert.equal(item.url, `https://raw.githubusercontent.com${repo}/${manifest.commit}/${item.name}`);
    total += item.sizeBytes;
  }
  assert(total <= 8 * 1048576);
  assert(new Set(manifest.analyzedFiles).size === manifest.analyzedFiles.length);
  for (const name of manifest.analyzedFiles) { assert(names.has(name)); assert(/\.[jt]s$/.test(name)); }
  if (manifest.analysisSummary) {
    assert.equal(manifest.analysisSummary.status, 'REVIEW_READY');
    assert.equal(manifest.analysisSummary.independentlyReproduced, false);
    assert.equal(manifest.analysisSummary.parseFailures, 0);
    assert.equal(manifest.analysisSummary.parsedFiles, manifest.analyzedFiles.length);
  } else assert.equal(manifest.analyzedFiles.length, 0);
}
export function validateRuntimeSnapshot(report) {
  assert.equal(report.schemaVersion, 'wikirea.runtime-execution.v1');
  assert.equal(report.authorityGranted, false); assert.equal(report.productionActivated, false);
  assert.equal(report.privateDataIncluded, false);
  assert.equal(report.fixture, 'scripts/portable-probe.js');
  assert.match(report.fixtureSha256, /^[a-f0-9]{64}$/);
  assert(Number.isFinite(Date.parse(report.observedAt)));
  assert(Array.isArray(report.runtimes) && report.runtimes.length > 0 && report.runtimes.length <= 3);
  const ids = new Set();
  for (const runtime of report.runtimes) {
    assert(['deno', 'bun', 'quickjs'].includes(runtime.id) && !ids.has(runtime.id)); ids.add(runtime.id);
    assert(typeof runtime.version === 'string' && runtime.version.length < 240);
    assert.equal(runtime.fixtureSha256, report.fixtureSha256);
    assert.match(runtime.archiveSha256, /^[a-f0-9]{64}$/);
    if (runtime.sourceCommit !== null) assert.match(runtime.sourceCommit, /^[a-f0-9]{40}$/);
    if (runtime.binarySha256 !== null) assert.match(runtime.binarySha256, /^[a-f0-9]{64}$/);
    if (runtime.containerImage !== null) assert.match(runtime.containerImage, /^sha256:[a-f0-9]{64}$/);
    assert(Array.isArray(runtime.cases) && runtime.cases.length > 0 && runtime.cases.length <= 64);
    assert(new Set(runtime.cases.map(c => c.name)).size === runtime.cases.length);
    for (const c of runtime.cases) { assert.match(c.name, /^[a-z0-9-]+$/); assert([true, false, null].includes(c.passed)); }
  }
}
export function validateFishExecution(report, source) {
  assert.equal(report.schemaVersion, 'wikirea.mirofish-component-execution.v1');
  assert.equal(report.upstreamCommit, source.commit);
  assert.equal(report.scope, 'TWO_COMPONENTS_NOT_FULL_SIMULATION');
  assert.equal(report.simulationExecuted, false); assert.equal(report.bettafishExecuted, false);
  assert.equal(report.privateDataIncluded, false); assert.equal(report.rawEvidenceIncluded, false);
  assert.equal(report.authorityGranted, false); assert.equal(report.remoteDelivered, false);
  assert.equal(report.modelCalls, 0); assert.equal(report.billedCreditsSaved, null);
  assert.equal(report.independentlyReproduced, false);
  assert(Number.isFinite(Date.parse(report.observedAt)));
  assert.deepEqual(report.executedSourceFiles, ['backend/app/utils/file_parser.py', 'backend/scripts/action_logger.py']);
  for (const name of report.executedSourceFiles) assert(source.files.some(f => f.name === name));
  assert(Number.isSafeInteger(report.chunkCount) && report.chunkCount > 0 && report.chunkCount <= 256);
  assert.equal(report.actionCount, 4); assert.equal(report.traceRows, 6);
  assert.match(report.receiptDigest, /^sha256:[a-f0-9]{64}$/);
  for (const key of ['secondProcessReusedReceipt', 'cancellationRetainedAndReused', 'modifiedArtifactRejected', 'changedSourceRejected', 'incompleteRunBlocked'])
    assert.equal(report[key], true);
  assert.equal(report.duplicateTraceRowsAdded, 0);
}
async function filesAt(folder, prefix = '') {
  const result = [];
  for (const ent of await fs.readdir(folder, { withFileTypes: true })) {
    if (!prefix && ['.git', '.local'].includes(ent.name)) continue;
    assert(!ent.isSymbolicLink(), 'SYMLINK_NOT_ALLOWED');
    const name = `${prefix}${ent.name}`;
    if (ent.isDirectory()) result.push(...await filesAt(path.join(folder, ent.name), `${name}/`));
    else { assert(ent.isFile() && allowed(name), `FILE_NOT_ALLOWLISTED:${name}`); result.push(name); }
  }
  return result.sort();
}
export async function verify(base = root, refresh = false) {
  const names = await filesAt(base); const inventory = []; let links = 0;
  for (const name of names) {
    const bytes = await fs.readFile(path.join(base, name));
    checkText(bytes.toString('latin1'));
    if (name !== 'assets/wikirea-poster.png') {
      const text = new TextDecoder('utf8', { fatal: true }).decode(bytes);
      checkText(text);
      assert(!/[ \t]+$/m.test(text), `TRAILING_WHITESPACE:${name}`);
      if (name.endsWith('.md')) {
        for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
          const href = match[1]; if (/^(https?:|#)/.test(href)) continue;
          assert(!/^[a-z]+:/i.test(href));
          const resolved = path.resolve(base, path.dirname(name), href.split('#')[0]);
          const rel = path.relative(base, resolved);
          assert(rel && !rel.startsWith('..') && !path.isAbsolute(rel));
          assert((await fs.stat(resolved)).isFile(), `BROKEN_LINK:${name}`); links++;
        }
      }
    }
    if (name !== 'release-manifest.json') inventory.push({ path: name, sizeBytes: bytes.length, sha256: digest(bytes) });
  }
  const catalog = JSON.parse(await fs.readFile(path.join(base, 'library.json'), 'utf8'));
  assert.equal(catalog.schemaVersion, 'wikirea.public-library.v1');
  assert.equal(catalog.rawEvidenceIncluded, false);
  assert.equal(catalog.sourceBodiesIncluded, false);
  const ids = new Set(); const sources = new Map(); let parsed = 0;
  const runtimePath = 'provenance/runtime-execution.json';
  const runtimeReport = names.includes(runtimePath) ? JSON.parse(await fs.readFile(path.join(base, runtimePath), 'utf8')) : null;
  if (runtimeReport) {
    validateRuntimeSnapshot(runtimeReport);
    assert.equal(digest(await fs.readFile(path.join(base, runtimeReport.fixture))), runtimeReport.fixtureSha256);
  }
  for (const entry of catalog.entries) {
    assert(!ids.has(entry.id)); ids.add(entry.id);
    if (entry.runtimeEvidence) {
      assert.equal(entry.runtimeEvidence, runtimePath); assert(runtimeReport);
      const runtime = runtimeReport.runtimes.find(r => r.id === entry.runtimeId); assert(runtime);
      assert.equal(entry.targetExecuted, true);
      if (runtime.sourceCommit) assert.equal(runtime.sourceCommit, entry.commit);
    } else assert.equal(entry.targetExecuted, false);
    assert(['STATIC_ANALYZED_SUBSET', 'SOURCE_INSPECTED_SUBSET', 'OFFICIAL_DOCUMENTATION_REVIEWED'].includes(entry.stage));
    safeRelative(entry.article); assert(names.includes(entry.article));
    if (entry.provenance) {
      safeRelative(entry.provenance); assert(names.includes(entry.provenance));
      const manifest = JSON.parse(await fs.readFile(path.join(base, entry.provenance), 'utf8'));
      validateSource(manifest); sources.set(entry.id, new Set(manifest.files.map(x => x.name)));
      if (entry.componentExecutionEvidence) {
        assert.equal(entry.componentExecutionEvidence, 'provenance/mirofish-preparation-execution.json');
        assert.equal(entry.id, 'mirofish-pipeline'); assert.equal(entry.targetExecuted, false);
        validateFishExecution(JSON.parse(await fs.readFile(path.join(base, entry.componentExecutionEvidence), 'utf8')), manifest);
      }
      assert.equal(manifest.repository, entry.repository); assert.equal(manifest.commit, entry.commit);
      if (entry.stage === 'STATIC_ANALYZED_SUBSET') { assert(manifest.analysisSummary); parsed += manifest.analysisSummary.parsedFiles; }
      else assert(!manifest.analysisSummary);
    } else assert.equal(entry.stage, 'OFFICIAL_DOCUMENTATION_REVIEWED');
  }
  const mechanics = JSON.parse(await fs.readFile(path.join(base, 'mechanics.json'), 'utf8'));
  for (const item of mechanics.mechanics) {
    assert.equal(item.stage, 'SPECIFIED'); assert.equal(item.integrationStatus, 'PROPOSED_NOT_WIRED');
    assert.equal(item.adaptationRuntimeTests, 0); assert.equal(item.authorityGranted, false);
    assert(item.acceptanceCases.length > 0);
    for (const ref of item.sourceRefs) assert(sources.get(ref.entryId)?.has(ref.sourcePath));
  }
  const manifestPath = path.join(base, 'release-manifest.json');
  if (refresh) await fs.writeFile(manifestPath, JSON.stringify({ schemaVersion: 'wikirea.release.v1', files: inventory }, null, 2) + '\n');
  else {
    const release = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    assert.equal(release.schemaVersion, 'wikirea.release.v1'); assert.deepEqual(release.files, inventory);
  }
  return { status: 'PUBLIC_RELEASE_CHECK_PASSED', files: inventory.length, localLinks: links,
    investigations: ids.size, reaParsedFiles: parsed, mechanics: mechanics.mechanics.length,
    separatelyProbedRuntimes: runtimeReport?.runtimes.length ?? 0 };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const flags = process.argv.slice(2); assert(flags.every(x => x === '--refresh-manifest'));
  console.log(JSON.stringify(await verify(root, flags.includes('--refresh-manifest')), null, 2));
}
