import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { buildContributorPlan, taskForRole, validateWorkerDraft } from './contributors.mjs';

const catalog = JSON.parse(await fs.readFile(new URL('../library.json', import.meta.url), 'utf8'));
const plan = () => buildContributorPlan(catalog);
test('ten role packets are not ten running agents or permission to spend', () => {
  const p = plan();
  assert.equal(p.tasks.length, 10);
  assert.equal(new Set(p.tasks.map(t => t.role)).size, 10);
  assert.equal(p.runningAgents, 0);
  assert.equal(p.modelCalls, 0);
  assert.equal(p.paidFallbackAllowed, false);
  assert.equal(p.publicationAllowed, false);
  assert(p.tasks.every(t => t.status === 'AWAITING_WORKER' && t.maxSourceFiles === 8));
});
test('one compact task preserves its exact plan binding', () => {
  const p = plan(), task = taskForRole(p, 'music-events');
  assert.equal(task.planDigest, p.planDigest);
  assert(task.entryIds.includes('wavewarz-public-api'));
  assert.throws(() => taskForRole(p, 'invented-worker'), /ROLE/);
  assert(Buffer.byteLength(JSON.stringify(task)) < 6000);
});
test('plan identity changes when catalog source binding changes', () => {
  const c = structuredClone(catalog);
  c.entries[0].commit = 'a'.repeat(40);
  assert.notEqual(buildContributorPlan(c).planDigest, plan().planDigest);
});
const draft = task => ({ taskId: task.id, planDigest: task.planDigest,
  status: 'DRAFT_FOR_REVIEW', workerId: 'fixture-worker', executionKind: 'DETERMINISTIC',
  modelCalls: 0, publicationPerformed: false, targetExecuted: false,
  authorityGranted: false, evidence: [{ entryId: task.entryIds[0],
    commit: task.sources[0].commit, inspectedFiles: ['README.md'] }],
  findings: ['Fixture observation with a bounded source reference.'],
  unknowns: ['Target application was not executed.'] });
test('worker draft preserves unreviewed status and cannot authorize publishing', () => {
  const task = taskForRole(plan(), 'music-events');
  assert.equal(validateWorkerDraft(task, draft(task)).status, 'DRAFT_BINDING_CHECKED_NOT_INDEPENDENTLY_VERIFIED');
  for (const patch of [{ publicationPerformed: true }, { authorityGranted: true },
    { targetExecuted: true }, { planDigest: '0'.repeat(64) }, { unknowns: [] },
    { executionKind: 'MODEL', modelCalls: 0 }]) {
    assert.throws(() => validateWorkerDraft(task, { ...draft(task), ...patch }));
  }
});
test('source substitution and private-path findings fail closed', () => {
  const task = taskForRole(plan(), 'music-events');
  const d = draft(task); d.evidence[0].commit = '0'.repeat(40);
  assert.throws(() => validateWorkerDraft(task, d));
  const secret = ['C:', 'Users', 'person', 'private.txt'].join('/');
  assert.throws(() => validateWorkerDraft(task, { ...draft(task), findings: [secret] }));
});
