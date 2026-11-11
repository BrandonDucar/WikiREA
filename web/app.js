export function category(item) {
  const t = `${item.title} ${item.role || ''}`.toLowerCase();
  if (/toaster|heating|hardware|physical|robot|circuit|device/.test(t)) return 'Hardware';
  if (/game|quantum|simulation|tensor/.test(t)) return 'Games & simulation';
  if (/music|audio|midi|wavewarz/.test(t)) return 'Sound & events';
  if (/market|trading|polygon|finance|robinhood|order book/.test(t)) return 'Markets';
  if (/agent|model|dspy|godel|alphaevolve|herdr|feedback|control theory/.test(t)) return 'AI & systems';
  return 'Software & web';
}
export function filterEntries(entries, query = '', selected = 'Everything', view = 'all') {
  const q = query.trim().toLowerCase();
  return entries.filter(x => (view !== 'research' || x.automated) &&
    (selected === 'Everything' || category(x) === selected) &&
    (!q || `${x.title} ${x.summary || ''} ${x.role || ''} ${x.markdown || ''}`.toLowerCase().includes(q)));
}
export function safeUrl(value) {
  try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch { return null; }
}
export function workerStatus(jobs, now = Date.now()) {
  const j = jobs.at(-1);
  if (!j) return { label: 'Awaiting first run', kind: '', job: null };
  if (j.status === 'COMPILED' || (j.packet && j.status === 'FAILED' && j.lastStage === 'reviewer' && !j.publication)) return { label: 'Draft compiled · review pending', kind: 'compiled', job: j };
  if (j.publication) return { label: 'Published after senior review', kind: 'complete', job: j };
  if (j.status === 'RESERVED') return { label: Date.parse(j.expiresAt) > now ? 'Research reserved' : 'Interrupted / lease expired', kind: '', job: j };
  if (j.status === 'COMPLETED') return { label: 'Research completed', kind: 'complete', job: j };
  return { label: j.status.replaceAll('_', ' ').toLowerCase(), kind: 'error', job: j };
}

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const el = (tag, text, className) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; };
  let data, query = '', selected = 'Everything', view = 'all';
  const dialog = $('article-dialog');
  function link(text, url) { const a = el('a', text); const href = safeUrl(url); if (href) { a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a; }
  let articleBase;
  function inline(parent, text) {
    const re = /\[([^\]]+)\]\(([^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
    let start = 0;
    for (const m of text.matchAll(re)) {
      parent.append(document.createTextNode(text.slice(start, m.index)));
      if (m[1]) { let url; try { url = new URL(m[2], articleBase).href; } catch {} parent.append(link(m[1], url)); }
      else parent.append(el(m[3] ? 'code' : 'strong', m[3] || m[4]));
      start = m.index + m[0].length;
    }
    parent.append(document.createTextNode(text.slice(start)));
  }
  function markdown(parent, text) {
    let code = false, buffer = [], list = null, table = null;
    for (const line of text.split('\n')) {
      if (line.startsWith('```')) { if (code) { parent.append(el('pre', buffer.join('\n'))); buffer = []; } code = !code; list = null; continue; }
      if (code) { buffer.push(line); continue; }
      if (!line.trim()) { list = null; table = null; continue; }
      if (line.startsWith('<')) continue;
      if (line.trim().startsWith('|')) {
        const cells = line.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim());
        if (cells.every(x => /^:?-+:?$/.test(x))) continue;
        const header = !table;
        if (!table) { table = el('table'); parent.append(table); }
        const row = el('tr'); for (const cell of cells) { const n = el(header ? 'th' : 'td'); inline(n, cell); row.append(n); } table.append(row); continue;
      }
      table = null;
      const head = /^(#{1,3}) (.+)/.exec(line);
      if (head) { const n = el(`h${head[1].length}`); inline(n, head[2]); parent.append(n); list = null; continue; }
      const bullet = /^(?:[-*]|\d+\.) (.+)/.exec(line);
      if (bullet) { if (!list) { list = el('ul'); parent.append(list); } const n = el('li'); inline(n, bullet[1]); list.append(n); continue; }
      list = null; const p = el('p'); inline(p, line); parent.append(p);
    }
    if (buffer.length) parent.append(el('pre', buffer.join('\n')));
  }
  function showArticle(item) {
    articleBase = item.article ? `https://github.com/BrandonDucar/WikiREA/blob/main/${item.article}` : 'https://github.com/BrandonDucar/WikiREA/';
    const content = $('article-content'); content.replaceChildren();
    if (!item.automated) markdown(content, item.markdown);
    else {
      content.append(el('p', 'AUTOMATED RESEARCH NOTE Â· SEPARATE MODEL CHECK', 'eyebrow'), el('h1', item.title),
        el('p', item.unreviewed ? 'This source-bound draft passed compiler checks. Factual review has not passed. Treat its explanations as unverified research, with the source and unknowns alongside it.' : 'Based on a pinned public encyclopedia revision. This explains documented mechanisms; it is not a physical teardown, proprietary source inspection, or human-verified engineering specification.', 'notice'), el('p', item.summary));
      for (const m of item.mechanisms) content.append(el('h2', m.title), el('p', m.explanation));
      content.append(el('h2', 'What we still donâ€™t know'));
      const ul = el('ul'); item.unknowns.forEach(x => ul.append(el('li', x))); content.append(ul);
      content.append(el('h2', 'Follow the source'));
      item.sources.forEach(s => { const p = el('p'); p.append(link(`${s.title} Â· revision ${s.revision} â†—`, s.url)); content.append(p, el('p', `Inspected ${s.inspectedCharacters.toLocaleString()} of ${s.totalCharacters.toLocaleString()} source characters. ${s.license}`)); });
      content.append(el('p', `Research role: ${item.role}. Published ${new Date(item.createdAt).toLocaleString()}. Source integrity: ${item.sources[0].sha256}. ${item.unreviewed ? 'Unreviewed draft. No successful factual review is claimed.' : 'Separate model check, not independent human review.'}`));
      if (item.compilerRef) content.append(link(`Compiled research packet â†— Â· ${item.compilerRef.artifactDigest.slice(0, 12)}`, `https://github.com/BrandonDucar/WikiREA/blob/${data.sourceCommit || 'main'}/${item.compilerRef.packet}`));
    }
    if (!dialog.open) dialog.showModal(); content.scrollTop = 0;
  }
  function render() {
    const workers = view === 'workers'; $('worker-panel').hidden = !workers; $('cards').hidden = workers; $('library-controls').hidden = workers;
    $('section-title').textContent = workers ? 'A team with a paper trail.' : view === 'drafts' ? 'The working notebook.' : view === 'research' ? 'Fresh questions. New findings.' : 'Follow your curiosity.';
    $('section-eyebrow').textContent = workers ? 'TEN ROLES / REAL RUN RECEIPTS' : 'THE EVER-GROWING INDEX';
    $('result-label').textContent = '';
    if (workers) return renderWorkers();
    const entries = filterEntries(view === 'drafts' ? data.drafts || [] : data.entries, query, selected, view);
    $('result-label').textContent = `${entries.length} ${entries.length === 1 ? 'investigation' : 'investigations'} Â· Sources and limitations included`;
    $('cards').replaceChildren();
    if (!entries.length) $('cards').append(el('p', 'No investigations match yet. Try a broader question.', 'empty'));
    for (const item of entries) {
      const card = el('button', undefined, 'card'); card.type = 'button';
      const meta = el('div', undefined, 'card-meta'); meta.append(el('span', category(item)), el('span', item.unreviewed ? 'UNREVIEWED DRAFT' : item.automated ? 'RESEARCH NOTE' : 'SOURCE STUDY'));
      const bottom = el('div', undefined, 'card-bottom'); bottom.append(el('span', item.unreviewed ? 'P0 · Not reviewed' : item.automated ? 'Model reviewed' : 'Sources & methods', item.automated ? 'tag auto' : 'tag'), el('span', 'Explore â†—'));
      card.append(meta, el('div', item.automated ? 'â—Ž' : 'âŒ˜', 'card-symbol'), el('h3', item.title), el('p', (item.summary || '').slice(0, 145) + ((item.summary || '').length > 145 ? 'â€¦' : '')), bottom);
      card.addEventListener('click', () => showArticle(item)); $('cards').append(card);
    }
  }
  function renderWorkers() {
    const panel = $('worker-panel'); panel.replaceChildren();
    panel.append(el('p', 'Ten persistent research roles take turns on a recurring schedule. Free-only inference, at most 20 research jobs per UTC day, and compiler-first storage. Drafts are readable in the notebook. A separate senior review queue qualifies research notes. A role is not ten simultaneous model processes. Status below comes from retained jobs, not simulated activity.', 'notice'));
    if (data.state.providerHold) {
      const h = data.state.providerHold;
      panel.append(el('p', h.until ? `Last provider pause: ${h.reason}. Backoff ends ${new Date(h.until).toLocaleString()}; the next scheduled run must qualify the route again.` : `Provider configuration requires review: ${h.reason}. Research remains paused for that binding.`, 'notice'));
    }
    const grid = el('div', undefined, 'worker-grid');
    for (const role of data.roles) {
      const jobs = data.state.jobs.filter(j => j.role === role); const status = workerStatus(jobs); const w = el('section', undefined, 'worker');
      w.append(el('h3', role.replaceAll('-', ' ').replace(/\b\w/g, x => x.toUpperCase())), el('span', status.label, `worker-status ${status.kind}`), el('p', `${jobs.filter(j => j.status === 'COMPLETED' || j.publication).length} completed Â· ${jobs.filter(j => j.packet).length} compiled drafts Â· ${jobs.filter(j => j.status === 'REVIEW_HELD').length} held for review Â· ${jobs.filter(j => ['FAILED', 'RATE_LIMITED', 'INTERRUPTED_UNKNOWN'].includes(j.status)).length} failed or interrupted`));
      if (status.job) { w.append(el('p', `Latest topic: ${status.job.topic}`), el('p', `Recorded ${new Date(status.job.finishedAt || status.job.reservedAt).toLocaleString()} Â· ${status.job.callsAttempted}/2 calls attempted`, 'worker-detail')); if (status.job.error) w.append(el('p', status.job.error, 'worker-detail')); }
      grid.append(w);
    }
    panel.append(grid);
  }
  $('search').addEventListener('input', e => { query = e.target.value; render(); });
  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { view = b.dataset.view; document.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('active', x === b)); render(); }));
  $('close-article').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  document.addEventListener('keydown', e => { if (e.key === '/' && !dialog.open && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); $('search').focus(); } });
  fetch('data.json', { cache: 'no-cache' }).then(r => { if (!r.ok) throw Error('DATA_UNAVAILABLE'); return r.json(); }).then(value => {
    data = value; $('count-library').textContent = data.entries.length; $('count-mechanics').textContent = data.mechanics.length; $('count-research').textContent = data.state.jobs.filter(j => j.status === 'COMPLETED' || j.publication).length;
    $('update-label').textContent = `Edition built ${new Date(data.builtAt).toLocaleString()}${data.state.updatedAt ? ` Â· Research recorded ${new Date(data.state.updatedAt).toLocaleString()}` : ' Â· First worker runs pending'}`;
    for (const name of ['Everything', 'Software & web', 'AI & systems', 'Hardware', 'Games & simulation', 'Markets', 'Sound & events']) {
      const b = el('button', name, `filter${name === selected ? ' active' : ''}`); b.addEventListener('click', () => { selected = name; document.querySelectorAll('.filter').forEach(x => x.classList.toggle('active', x === b)); render(); }); $('filters').append(b);
    }
    render();
  }).catch(() => { $('load-error').hidden = false; $('update-label').textContent = 'Library temporarily unavailable'; });
}
