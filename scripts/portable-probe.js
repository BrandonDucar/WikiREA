// Original fixed fixtures. No imports, filesystem, network, timers or credentials.
(function () {
  var cases = [];
  function check(name, ok) {
    if (!ok) throw new Error('PROBE_FAILED:' + name);
    cases.push({ name: name, passed: true });
  }
  var wrong = JSON.parse('{"count":"wrong"}');
  check('runtime-shape-check-required', typeof wrong.count !== 'number');
  check('invalid-json-rejected', (function () { try { JSON.parse('{'); return false; } catch (_) { return true; } })());
  check('non-finite-number-not-preserved-by-json', JSON.parse(JSON.stringify({ value: Infinity })).value === null);
  var sequence = [];
  var first = Promise.resolve().then(function () {
    sequence.push('first');
    Promise.resolve().then(function () { sequence.push('nested'); });
  });
  var second = Promise.resolve().then(function () { sequence.push('second'); });
  Promise.all([first, second]).then(function () {
    check('finite-promise-order', sequence.join(',') === 'first,second,nested');
    var finish;
    var effects = [];
    var operation = new Promise(function (resolve) { finish = resolve; }).then(function () { effects.push('late'); });
    return Promise.race([operation, Promise.resolve('deadline')]).then(function (winner) {
      check('race-deadline-wins', winner === 'deadline' && effects.length === 0);
      finish();
      return operation.then(function () { check('race-did-not-cancel-loser', effects.length === 1); });
    });
  }).then(function () {
    var completed = false;
    return Promise.reject(new Error('EXPECTED')).then(function () { completed = true; }, function () {
      check('rejection-not-completion', completed === false);
    });
  }).then(function () {
    console.log(JSON.stringify({ schemaVersion: 'wikirea.portable-probe.v1', cases: cases, passed: cases.length,
      fixture: 'ORIGINAL_SYNTHETIC', networkUsed: false, authorityGranted: false }));
  }).catch(function (e) { console.log(JSON.stringify({ failed: true, code: e.message })); });
})();
