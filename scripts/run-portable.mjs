import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';
const [runtime, executable] = process.argv.slice(2);
assert(['deno', 'bun', 'quickjs'].includes(runtime) && executable, 'Usage: node scripts/run-portable.mjs deno|bun|quickjs PATH_TO_TRUSTED_EXECUTABLE');
const fixture = fileURLToPath(new URL('./portable-probe.js', import.meta.url));
const args = runtime === 'deno' ? ['run', '--no-config', '--no-prompt', '--cached-only', '--deny-net', '--deny-env', '--deny-read', '--deny-write', '--deny-run', '--deny-ffi', fixture] :
  runtime === 'bun' ? ['--no-env-file', '--no-install', fixture] : ['--memory-limit', '16777216', fixture];
const child = spawn(executable, args, { cwd: tmpdir(), windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  env: Object.fromEntries(['SystemRoot', 'PATH', 'TEMP', 'TMP'].filter(k => process.env[k]).map(k => [k, process.env[k]])) });
let text = '', stderr = '', timedOut = false, oversized = false;
const timeout = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, 10000);
child.stdout.on('data', b => { text += b; if (text.length > 65536) { oversized = true; child.kill('SIGKILL'); } });
child.stderr.on('data', b => { stderr += b; if (stderr.length > 65536) { oversized = true; child.kill('SIGKILL'); } });
child.on('error', () => { clearTimeout(timeout); console.error('RUNTIME_START_FAILED'); process.exitCode = 1; });
child.on('close', code => {
  clearTimeout(timeout);
  try {
    assert(code === 0 && !timedOut && !oversized);
    const result = JSON.parse(text.trim());
    assert.equal(result.passed, 7); assert(result.cases.every(c => c.passed === true));
    console.log(JSON.stringify({ runtime, ...result }, null, 2));
  } catch { console.error('RUNTIME_PROBE_FAILED'); process.exitCode = 1; }
});
