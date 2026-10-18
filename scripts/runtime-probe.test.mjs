import test from 'node:test';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';

// Only original, fixed synthetic fixtures are evaluated, never retrieved sources.
const evaluate = text => new Function(
  stripTypeScriptTypes(`function fixture() {\n${text}\n}`, { mode: 'strip' }) + '\nreturn fixture();'
)();

test('type assertions and interfaces do not validate incoming values', t => {
  t.diagnostic(`Host Node ${process.versions.node}; built-in type stripping, not the TypeScript compiler`);
  const result = evaluate(`
    interface Reading { value: number }
    const reading = { value: 'wrong' } as unknown as Reading;
    return { value: reading.value, kind: typeof reading.value };
  `);
  assert.deepEqual(result, { value: 'wrong', kind: 'string' });
});

test('a non-null assertion does not prevent a runtime null access', () => {
  assert.throws(() => evaluate(`
    const reading: { value: number } | null = null;
    return reading!.value;
  `), TypeError);
});

test('strip-only rejects an enum requiring transformation', () => {
  assert.throws(() => stripTypeScriptTypes('enum Phase { Ready, Done }', { mode: 'strip' }),
    { code: 'ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX' });
});

test('a type-only import is erased without loading its module', () => {
  const output = stripTypeScriptTypes("import type { Reading } from 'never-load-this-package';\nconst n: number = 7;", { mode: 'strip' });
  assert(!output.includes('never-load-this-package'));
  assert.match(output, /const n\s*= 7/);
});

test('queued promise and microtask callbacks preserve this finite FIFO fixture', async () => {
  const observed = ['sync'];
  queueMicrotask(() => {
    observed.push('microtask');
    queueMicrotask(() => observed.push('nested'));
  });
  Promise.resolve().then(() => observed.push('promise'));
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(observed, ['sync', 'microtask', 'promise', 'nested']);
});

test('abort observation cannot undo a side effect already performed', () => {
  const controller = new AbortController();
  const effects = ['recorded-before-abort'];
  controller.abort(new Error('STOP'));
  assert.throws(() => controller.signal.throwIfAborted(), /STOP/);
  assert.deepEqual(effects, ['recorded-before-abort']);
});

test('a race winner does not cancel the losing operation', async () => {
  let finish;
  const effects = [];
  const operation = new Promise(resolve => { finish = resolve; }).then(() => effects.push('late-result'));
  assert.equal(await Promise.race([operation, Promise.resolve('deadline')]), 'deadline');
  assert.deepEqual(effects, []);
  finish();
  await operation;
  assert.deepEqual(effects, ['late-result']);
});

test('a rejected awaited operation cannot become a successful completion', async () => {
  let completed = false;
  const work = async () => {
    await Promise.reject(new Error('PERSISTENCE_FAILED'));
    completed = true;
  };
  await assert.rejects(work, /PERSISTENCE_FAILED/);
  assert.equal(completed, false);
});
