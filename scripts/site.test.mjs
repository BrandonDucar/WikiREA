import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { category, filterEntries, safeUrl, workerStatus } from '../web/app.js';

test('search and category filters compose without hiding research provenance', () => {
  const entries = [{ title: 'Toaster', summary: 'Resistive heating', automated: true }, { title: 'Node.js runtime', automated: false }];
  assert.equal(category(entries[0]), 'Hardware');
  assert.equal(filterEntries(entries, 'HEATING', 'Hardware', 'research').length, 1);
  assert.equal(filterEntries(entries, '', 'Everything', 'research').length, 1);
  assert.equal(filterEntries(entries, 'absent').length, 0);
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
