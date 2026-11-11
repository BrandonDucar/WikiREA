import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { reserveJobs, reserveSeniorReviews, runSeniorReviews, sha, validateConfig, qualifyFreeModels, inference, nimResearchInference, researchJob, runPending, validateArchive, save, compileResearchPacket, validateResearchPacket } from './research.mjs';

const config = JSON.parse(await fs.readFile(new URL('../research/config.json', import.meta.url), 'utf8'));
const roles = Object.keys(config.seeds);
const orModel = 'nvidia/nemotron-3.5-lightning:free';
const orConfig = { ...config, writerProvider: 'openrouter-free', writerModel: orModel, reviewerProvider: 'openrouter-free', reviewerModel: 'google/gemma-4-31b-it:free', reviewerReasoning: false };
const now = Date.parse('2026-11-11T12:00:00Z');
const blank = () => ({ schema: 'wikirea.research-state.v1', sequence: 0, jobs: [], discovered: [] });
const article = { summary: 'A toaster converts electrical energy into heat using a resistive element. A control mechanism limits how long the bread is exposed to heat. This summary describes the documented mechanism, not an inspected proprietary circuit.',
  mechanisms: [{ title: 'Resistive heating', explanation: 'Electrical resistance converts supplied energy into heat that radiates toward the bread.', sourceIds: ['S1'] }, { title: 'Timed release', explanation: 'A timer or thermal control ends the cycle and releases the spring-loaded bread carriage.', sourceIds: ['S1'] }],
  unknowns: ['The exact circuit of a particular commercial model is not established.', 'No actual toaster has been disassembled or tested.'] };
const reply = value => new Response(JSON.stringify(value), { status: 200 });

test('compiler-first packets retain drafts as P0, reject tampering, and never grant publication approval', async () => {
  const p = await compileResearchPacket({ id: 'fixture', role: 'researcher', topic: 'Toaster' }, article, { revision: '123' }, { generationId: 'fixture' });
  assert.equal(validateResearchPacket(p).stage, 'UNREVIEWED_RESEARCH');
  assert.equal(p.publicationApproved, false); assert.equal(p.consumerAcceptance, false);
  const changed = structuredClone(p); changed.findings.summary += ' changed';
  assert.throws(() => validateResearchPacket(changed), /PACKET_SOURCE_DRIFT/);
  assert.equal((await compileResearchPacket({ id: 'fixture', role: 'researcher', topic: 'Toaster' }, article, { revision: '123' }, { generationId: 'fixture' })).artifactDigest, p.artifactDigest);
});

test('ten existing roles reserve unique durable jobs; overlapping run cannot duplicate them', () => {
  const first = reserveJobs(blank(), config, roles, 10, now, 'run-1');
  assert.equal(first.reserved.length, 10); assert.equal(new Set(first.reserved.map(j => j.role)).size, 10);
  assert.equal(new Set(first.reserved.map(j => j.id)).size, 10);
  assert.equal(reserveJobs(first.state, config, roles, 10, now + 1, 'run-2').reserved.length, 0);
  assert.equal(first.state.jobs.reduce((n, j) => n + j.callsReserved, 0), 20);
});
test('crash restart retains uncertain attempts, does not retry the same target, and enforces daily cap', () => {
  const first = reserveJobs(blank(), config, roles, 10, now, 'run-1');
  const second = reserveJobs(first.state, config, roles, 10, now + 16 * 60000, 'run-2');
  assert.equal(second.state.jobs.filter(j => j.status === 'INTERRUPTED_UNKNOWN').length, 10);
  assert.equal(second.reserved.length, 10);
  assert.equal(new Set(second.state.jobs.map(j => j.topic)).size, 20);
  assert.equal(reserveJobs(second.state, config, roles, 10, now + 32 * 60000, 'run-3').reserved.length, 0);
});
test('paid configuration and same-model self-review are rejected', () => {
  assert.throws(() => validateConfig({ ...config, writerModel: 'paid/model' }));
  assert.throws(() => validateConfig({ ...config, incrementalMonthlyBudgetUsd: 1 }));
  assert.throws(() => validateConfig({ ...config, reviewerModel: config.writerModel }));
});
test('quota exhaustion and nonzero current catalogue pricing block before model work', async () => {
  const fetchImpl = async url => reply(url.endsWith('/models') ? { data: [orConfig.writerModel, orConfig.reviewerModel].map(id => ({ id, pricing: { prompt: '0', completion: id === orConfig.reviewerModel ? '0.01' : '0' } })) } : { data: { is_free_tier: true, free_model_daily_requests: { remaining: 50 } } });
  await assert.rejects(qualifyFreeModels(orConfig, 'fixture-key', fetchImpl), /NONZERO_PRICING/);
  await assert.rejects(qualifyFreeModels(orConfig, 'fixture-key', async url => reply(url.endsWith('/models') ? { data: [orConfig.writerModel, orConfig.reviewerModel].map(id => ({ id, pricing: { prompt: '0', completion: '0' } })) } : { data: { is_free_tier: true, free_model_daily_requests: { remaining: 1 } } })), /FREE_QUOTA/);
  await assert.rejects(qualifyFreeModels(orConfig, 'fixture-key', async url => reply(url.endsWith('/models') ? { data: [orConfig.writerModel, orConfig.reviewerModel].map(id => ({ id, pricing: {} })) } : { data: { is_free_tier: true, free_model_daily_requests: { remaining: 50 } } })), /NONZERO_PRICING/);
});

test('mandatory-reasoning reviewer receives a bounded enabled request and HTTP errors retain safe diagnostics', async () => {
  let request;
  await inference(orModel, [], 'fixture-key', async (url, init) => {
    request = JSON.parse(init.body);
    return reply({ id: 'fixture', model: config.reviewerModel, choices: [{ finish_reason: 'stop', message: { content: '{}' } }], usage: { cost: 0 } });
  }, { reasoningEnabled: true });
  assert.deepEqual(request.reasoning, { enabled: true, effort: 'low' }); assert.equal(request.max_tokens, 8000);
  await assert.rejects(inference(orModel, [], 'fixture-key', async () => new Response(JSON.stringify({ error: { message: 'Rate limited' } }), { status: 429, headers: { 'Retry-After': '60' } })), e => e.status === 429 && e.diagnostic.retryAfter === '60' && e.diagnostic.message === 'Rate limited');
});

test('rate limit stops the batch, persists attempted work, and never invokes a paid or duplicate retry', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'wikirea-rate-'));
  let calls = 0;
  try {
    await save(dir, 'research/config.json', config);
    await save(dir, 'research/state.json', reserveJobs(blank(), config, roles, 2, Date.now(), 'limited-run').state);
    const fetchImpl = async url => {
      if (url.endsWith('/models')) return reply({ data: [config.writerModel, config.reviewerModel].map(id => ({ id })) });
      if (url.endsWith('/key')) return reply({ data: { is_free_tier: true, free_model_daily_requests: { remaining: 50 } } });
      if (url.includes('/page/summary/')) return reply({ revision: '12345', type: 'standard' });
      if (url.includes('/w/api.php')) return reply({ query: { pages: { '1': { title: 'Wikipedia', revisions: [{ revid: 12345, timestamp: '2026-11-10T00:00:00Z', slots: { main: { '*': 'Public source text. '.repeat(50) } } }] } } } });
      calls++; return new Response('{"error":{"message":"Rate limited"}}', { status: 429 });
    };
    const state = await runPending(dir, { key: 'fixture-key-123', nimKey: 'fixture-nim-key-123', fetchImpl, runId: 'limited-run' });
    assert.equal(calls, 1); assert.equal(state.jobs[0].status, 'RATE_LIMITED'); assert.equal(state.jobs[0].callsAttempted, 1);
    assert.equal(state.jobs[1].status, 'RESERVED'); assert.equal(state.jobs[1].callsAttempted, 0);
    await validateArchive(dir);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
test('inference has no tools, no paid fallback, requires completed output and explicit zero cost', async () => {
  let body;
  const fetchImpl = async (url, init) => { body = JSON.parse(init.body); return reply({ id: 'test', model: 'fixture', choices: [{ finish_reason: 'stop', message: { content: '{"ok":true}' } }], usage: { cost: 0 } }); };
  const r = await inference(orModel, [], 'fixture-key', fetchImpl);
  assert.equal(r.value.ok, true); assert.equal(body.provider.allow_fallbacks, false);
  assert.deepEqual(body.provider.max_price, { prompt: 0, completion: 0 });
  assert.deepEqual(body.reasoning, { enabled: false });
  assert.equal(body.tools, undefined); assert.equal(body.models, undefined);
  for (const usage of [{}, { cost: null }, { cost: 0.001 }]) await assert.rejects(inference(orModel, [], 'fixture-key', async () => reply({ choices: [{ finish_reason: 'stop', message: { content: '{}' } }], usage })), /ZERO_REPORTED/);
});
test('two-call source-grounded job binds exact revision, reviewer and evidence without copying source', async () => {
  const requests = [], attempts = [];
  const original = 'A toaster uses electrical resistance to heat bread. A timer controls its spring-loaded carriage. '.repeat(10);
  const fetchImpl = async (url, init) => {
    requests.push(url);
    if (url.includes('/page/summary/')) return reply({ revision: '12345', type: 'standard' });
    if (url.includes('/w/api.php')) return reply({ query: { pages: { '1': { title: 'Toaster', revisions: [{ revid: 12345, timestamp: '2026-11-10T00:00:00Z', slots: { main: { '*': original } } }], links: [{ title: 'Heating element' }] } } } });
    const body = JSON.parse(init.body);
    return reply({ id: `call-${requests.length}`, model: body.model, choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(body.model === config.writerModel ? article : { accepted: true, reasons: ['Mechanisms match the supplied source; unknowns are explicit.'] }) } }], usage: { cost: 0, prompt_tokens: 100, completion_tokens: 100 } });
  };
  const { entry, discovered } = await researchJob({ id: 'fixture', topic: 'Toaster', role: roles[5] }, config, 'fixture-key', { nimKey: 'fixture-nim-key-123', fetchImpl, onAttempt: async stage => attempts.push(stage) });
  assert.deepEqual(attempts, ['writer', 'reviewer']); assert.equal(requests.filter(u => u.includes('/chat/completions')).length, 2);
  assert.equal(entry.sources[0].revision, '12345'); assert.equal(entry.sources[0].url, 'https://en.wikipedia.org/w/index.php?oldid=12345');
  assert.equal(entry.sourceTextRepublished, false); assert(!JSON.stringify(entry).includes(original));
  assert.equal(entry.review.independentHumanReview, false); assert.equal(entry.targetExecuted, false);
  assert.deepEqual(discovered, ['Heating element']);
});
test('fresh archive validates; completed jobs cannot omit their evidence entry', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'wikirea-archive-'));
  try {
    await save(dir, 'research/config.json', config); await save(dir, 'research/state.json', blank());
    assert.equal((await validateArchive(dir)).completed, 0);
    const state = reserveJobs(blank(), config, roles, 1, now).state; state.jobs[0].status = 'COMPLETED';
    await save(dir, 'research/state.json', state); await assert.rejects(validateArchive(dir));
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

test('NIM research preserves missing monetary reporting and rejects unqualified models or paid usage', async () => {
  let requestUrl, request;
  const result = await nimResearchInference(config.writerModel, [], 'fixture-nim-key-123', async (url, init) => {
    requestUrl = url; request = JSON.parse(init.body);
    return reply({ id: 'nim-fixture', choices: [{ finish_reason: 'stop', message: { content: '{}' } }], usage: { prompt_tokens: 10, completion_tokens: 10 } });
  });
  assert.equal(requestUrl, 'https://integrate.api.nvidia.com/v1/chat/completions'); assert.equal(request.tools, undefined);
  assert.equal(request.max_tokens, 4096); assert.equal(result.receipt.costUsdReported, null);
  assert.equal(result.receipt.productionLicenseClaimed, false); assert.equal(result.receipt.purpose, 'RESEARCH_AND_TESTING');
  await assert.rejects(nimResearchInference('unqualified/model', [], 'fixture-nim-key-123'));
  await assert.rejects(nimResearchInference(config.writerModel, [], 'fixture-nim-key-123', async () => reply({ choices: [{ finish_reason: 'stop', message: { content: '{}' } }], usage: { cost: 1 } })), /NONZERO_NIM_COST/);
});

test('senior review resumes a compiled packet on a changed route, preserves failure and never repeats research', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'wikirea-senior-'));
  const original = 'A toaster uses electrical resistance to heat bread. A timer controls its spring-loaded carriage. '.repeat(10);
  let modelCalls = 0;
  try {
    const state = reserveJobs(blank(), config, roles, 1, Date.now(), 'previous-run').state;
    const j = state.jobs[0]; Object.assign(j, { status: 'FAILED', lastStage: 'reviewer', error: 'MODEL_OUTPUT_LIMIT', callsAttempted: 2 });
    const sourcePin = { id: 'S1', kind: 'PINNED_ENCYCLOPEDIA_REVISION', revision: '12345', url: 'https://en.wikipedia.org/w/index.php?oldid=12345', sha256: sha(original), excerptSha256: sha(original), inspectedCharacters: original.length, totalCharacters: original.length, observedAt: new Date().toISOString(), sourceTimestamp: '2026-11-10T00:00:00Z' };
    const writerReceipt = { model: config.writerModel, provider: 'nvidia-nim-research', generationId: 'original-writer', costUsdReported: null, costBasis: 'EXISTING_FREE_DEVELOPER_RESEARCH_ACCESS', purpose: 'RESEARCH_AND_TESTING', productionLicenseClaimed: false };
    const packet = await compileResearchPacket(j, article, sourcePin, writerReceipt);
    Object.assign(j, { sourcePin, writerReceipt, packet: `research/packets/${j.id}.json`, packetDigest: packet.artifactDigest });
    await save(dir, j.packet, packet); await save(dir, 'research/config.json', config);
    const reserved = reserveSeniorReviews(state, config, 10, Date.now(), 'senior-run'); assert.equal(reserved.reserved.length, 1);
    await save(dir, 'research/state.json', reserved.state);
    const fetchImpl = async (url, init) => {
      if (url.endsWith('/models')) return reply({ data: [{ id: config.reviewerModel }] });
      if (url.includes('/w/api.php')) return reply({ query: { pages: { '1': { revisions: [{ revid: 12345, slots: { main: { '*': original } } }] } } } });
      modelCalls++; const persisted = JSON.parse(await fs.readFile(path.join(dir, 'research/state.json'), 'utf8'));
      assert.equal(persisted.reviewJobs[0].callsAttempted, 1); assert.equal(JSON.parse(init.body).model, config.reviewerModel);
      return reply({ id: 'senior-review', choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({ accepted: true, reasons: ['Source supports both mechanisms.'] }) } }], usage: { prompt_tokens: 100, completion_tokens: 40 } });
    };
    const after = await runSeniorReviews(dir, { nimKey: 'fixture-nim-key-123', fetchImpl, runId: 'senior-run' });
    assert.equal(modelCalls, 1); assert.equal(after.jobs[0].status, 'FAILED'); assert.equal(after.jobs[0].error, 'MODEL_OUTPUT_LIMIT');
    assert.equal(after.reviewJobs[0].status, 'COMPLETED'); assert(after.jobs[0].publication);
    assert.equal((await validateArchive(dir)).completed, 1);
    assert.equal(reserveSeniorReviews(after, config, 10, Date.now(), 'later').reserved.length, 0);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
