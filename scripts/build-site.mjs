import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { root, checkText, verify } from './verify.mjs';
import { buildContributorPlan } from './contributors.mjs';
import { validateArchive, sha } from './research.mjs';

export async function buildSite(base = root, output = path.join(base, '.local/site')) {
  await verify(base); await validateArchive(base);
  const load = async name => JSON.parse(await fs.readFile(path.join(base, name), 'utf8'));
  const catalog = await load('library.json'); const state = await load('research/state.json');
  const entries = [];
  for (const e of catalog.entries) {
    const markdown = await fs.readFile(path.join(base, e.article), 'utf8');
    const paragraphs = markdown.split(/\n\s*\n/).filter(x => !/^(#|\||-|>)/.test(x.trim()));
    entries.push({ ...e, markdown, summary: paragraphs.find(x => x.trim().length > 70)?.replaceAll('\n', ' ') || e.title, automated: false });
  }
  for (const j of state.jobs.filter(j => j.status === 'COMPLETED' || j.publication)) {
    const entry = j.entry || j.publication.entry;
    assert.equal(entry, `research/entries/${j.id}.json`);
    entries.unshift({ ...await load(entry), automated: true });
  }
  const sourcePins = {};
  for (const name of ['library.json', 'research/state.json', 'research/config.json', 'web/app.js']) sourcePins[name] = sha(await fs.readFile(path.join(base, name)));
  const data = { builtAt: new Date().toISOString(), sourceCommit: process.env.GITHUB_SHA || null, sourcePins, entries, state,
    roles: buildContributorPlan(catalog).tasks.map(t => t.role), mechanics: (await load('mechanics.json')).mechanics };
  checkText(JSON.stringify(data));
  await fs.mkdir(output, { recursive: true });
  for (const name of ['index.html', 'app.js', 'styles.css']) await fs.copyFile(path.join(base, 'web', name), path.join(output, name));
  await fs.writeFile(path.join(output, 'data.json'), JSON.stringify(data));
  await fs.writeFile(path.join(output, '.nojekyll'), '');
  return { output, entries: entries.length, roles: data.roles.length };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await buildSite()));
