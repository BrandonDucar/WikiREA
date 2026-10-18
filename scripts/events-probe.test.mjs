import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

test('listeners run synchronously in registration order', () => {
  const emitter = new EventEmitter(); const seen = ['before'];
  emitter.on('task', () => seen.push('first')); emitter.on('task', () => seen.push('second'));
  emitter.emit('task'); seen.push('after'); assert.deepEqual(seen, ['before', 'first', 'second', 'after']);
});
test('emit does not await an async listener', async () => {
  const emitter = new EventEmitter(); const seen = [];
  emitter.on('task', async () => { await Promise.resolve(); seen.push('finished'); });
  emitter.emit('task'); assert.deepEqual(seen, []); await Promise.resolve(); assert.deepEqual(seen, ['finished']);
});
test('once is removed before reentrant emission', () => {
  const emitter = new EventEmitter(); let calls = 0;
  emitter.once('task', () => { calls++; emitter.emit('task'); });
  emitter.emit('task'); assert.equal(calls, 1);
});
test('removal during emission affects the next emission', () => {
  const emitter = new EventEmitter(); const seen = []; const second = () => seen.push('second');
  emitter.on('task', () => { seen.push('first'); emitter.off('task', second); }); emitter.on('task', second);
  emitter.emit('task'); emitter.emit('task'); assert.deepEqual(seen, ['first', 'second', 'first']);
});
test('unhandled error event throws', () => {
  const emitter = new EventEmitter(); assert.throws(() => emitter.emit('error', new Error('synthetic failure')), /synthetic failure/);
});
test('an error listener consumes the error event', () => {
  const emitter = new EventEmitter(); const failure = new Error('synthetic failure'); let observed;
  emitter.on('error', value => { observed = value; }); assert.equal(emitter.emit('error', failure), true); assert.equal(observed, failure);
});
test('emit without a listener returns false and creates no receipt', () => {
  const emitter = new EventEmitter(); assert.equal(emitter.emit('task', { id: 'synthetic' }), false);
});
