import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { root, digest, validateSource } from './verify.mjs';

const [id, flag, ...extra] = process.argv.slice(2);
if (!id || (flag && flag !== '--fetch') || extra.length) throw new Error('Usage: node scripts/fetch-source.mjs <entry-id> [--fetch]');
const catalog = JSON.parse(await fs.readFile(path.join(root, 'library.json'), 'utf8'));
const entry = catalog.entries.find(x => x.id === id);
if (!entry?.provenance) throw new Error('No retained source manifest for this entry');
const manifest = JSON.parse(await fs.readFile(path.join(root, entry.provenance), 'utf8'));
validateSource(manifest);
if (!flag) {
  console.log(JSON.stringify({ mode: 'OFFLINE_PLAN', repository: manifest.repository, commit: manifest.commit,
    files: manifest.files.map(x => x.name), targetExecuted: false, note: 'Pass --fetch for explicit bounded public reads' }, null, 2));
} else {
  const inputs = [];
  for (const item of manifest.files) {
    const response = await fetch(item.url, { redirect: 'error', headers: { 'User-Agent': 'WikiREA-source-check/1.0' }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`SOURCE_READ_FAILED:${response.status}`);
    const chunks = []; let length = 0;
    for await (const chunk of response.body) {
      length += chunk.length; if (length > item.sizeBytes) throw new Error('SOURCE_TOO_LARGE'); chunks.push(chunk);
    }
    const bytes = Buffer.concat(chunks);
    new TextDecoder('utf8', { fatal: true }).decode(bytes);
    if (length !== item.sizeBytes || digest(bytes) !== item.sha256 ||
      createHash('sha1').update(`blob ${length}\0`).update(bytes).digest('hex') !== item.gitBlobSha1) throw new Error('SOURCE_HASH_MISMATCH');
    inputs.push({ item, bytes });
  }
  const local = path.join(root, '.local');
  await fs.mkdir(local, { recursive: true });
  const localStat = await fs.lstat(local);
  if (!localStat.isDirectory() || localStat.isSymbolicLink()) throw new Error('LOCAL_DIRECTORY_NOT_ADMITTED');
  const destination = path.join(local, `${id}-${manifest.commit}`);
  await fs.mkdir(destination);
  for (const { item, bytes } of inputs) {
    for (const folder of ['source', ...(manifest.analyzedFiles.includes(item.name) ? ['analysis-input'] : [])]) {
      const filename = path.join(destination, folder, item.name);
      await fs.mkdir(path.dirname(filename), { recursive: true }); await fs.writeFile(filename, bytes, { flag: 'wx' });
    }
  }
  console.log(JSON.stringify({ status: 'PINNED_SOURCE_HASHES_MATCH', files: inputs.length,
    relativeDestination: path.relative(root, destination).split(path.sep).join('/'), targetExecuted: false,
    analysisRun: false, note: 'No target or dependency was executed; existing downloads are not overwritten' }, null, 2));
}
