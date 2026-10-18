import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { validateRuntimeSnapshot } from './verify.mjs';

test('original portable fixture produces seven checked results on the CI Node host', () => {
  const result = JSON.parse(execFileSync(process.execPath, [fileURLToPath(new URL('./portable-probe.js', import.meta.url))],
    { encoding: 'utf8', timeout: 5000, windowsHide: true }));
  assert.equal(result.passed, 7); assert(result.cases.every(c => c.passed === true));
  assert.equal(result.authorityGranted, false);
});
test('reported runtime evidence rejects promotion, duplicate hosts and invalid source identity', async () => {
  const report = JSON.parse(await readFile(new URL('../provenance/runtime-execution.json', import.meta.url), 'utf8'));
  validateRuntimeSnapshot(report);
  for (const change of [r => { r.authorityGranted = true; }, r => { r.productionActivated = true; },
    r => { r.runtimes.push(r.runtimes[0]); }, r => { r.runtimes[2].sourceCommit = 'moving-head'; }]) {
    const value = structuredClone(report); change(value); assert.throws(() => validateRuntimeSnapshot(value));
  }
});
