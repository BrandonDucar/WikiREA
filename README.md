# WikiREA

**Understand how software works. Keep the evidence. Reuse the mechanics.**

WikiREA is a growing, independent library of source-bound investigations into
software, games and runtimes. Start with [the wiki](wiki/index.md), browse the
[mechanics](wiki/mechanics.md), or inspect the [machine-readable catalog](library.json).

<img src="assets/wikirea-poster.png" alt="WikiREA: pinned sources, clear evidence, reusable mechanics. GitHub-first, in progress." width="420">

## Explore

| Collection | Investigations |
| --- | --- |
| Major software | [Wikipedia / MediaWiki](wiki/mediawiki.md), [NASA Open MCT](wiki/nasa-openmct.md), [PhotoCraft history](wiki/photocraft-history.md) |
| Finance | [TradingView, Polygon.io / Massive, Polygon blockchain and Robinhood](wiki/finance-first-pass.md) |
| Games and quantum visualization | [Quantum Game 2](wiki/quantum-game-2.md), [Quantum Tensors](wiki/quantum-tensors.md), [BraKetVue](wiki/bra-ket-vue.md), [Quantum Game Classic](wiki/quantum-game-classic.md) |
| Languages and runtimes | [JavaScript / Node.js](wiki/javascript-runtimes.md), [TypeScript emit](wiki/typescript-emit.md), [QuickJS host loop](wiki/quickjs-host.md), [Deno and Bun boundaries](wiki/runtime-portability.md) |

Glossaries: [investigation](wiki/glossary.md), [finance](wiki/finance-glossary.md),
[quantum/simulation](wiki/quantum-glossary.md), [operational state](wiki/operations-glossary.md),
[language/runtime](wiki/runtime-glossary.md).
See [what to investigate next](TARGETS.md).
For application ideas, see [how runtime findings can feed DreamNet](wiki/runtime-integration.md).
The [runtime execution follow-up](wiki/runtime-execution.md) records actual Deno,
Bun and QuickJS checks and the private paper/sensitivity integration boundary.

## What Makes An Entry Useful

Each investigation records the question, exact upstream version, inspected files,
method, observations, unknowns, reusable behavior and proposed acceptance checks.
A parser result is not a security audit. A source inspection is not a runtime
test. A proposed integration is not a deployed product.

This public edition contains original explanations, upstream references, selected
source-file hashes and reported analysis summaries. **It does not contain target
source trees, private DreamNet code, credentials, local machine paths or raw
machine-bound analyzer logs.** Public summaries are not independently reproduced
execution receipts. See [provenance and limits](PROVENANCE.md).

WikiREA uses REA for selected static investigations but is not the upstream REA
project and is not affiliated with the organizations whose software is studied.
[REA upstream](https://github.com/morluto/rea).

## Verify And Reproduce

Node.js 24 or newer; no package installation is needed for these local checks:

```sh
node scripts/verify.mjs
node --test scripts/verify.test.mjs
node --test scripts/events-probe.test.mjs
node --test scripts/runtime-probe.test.mjs
node --test scripts/portable.test.mjs
```

Preview an investigation's source-retrieval plan without network access:

```sh
node scripts/fetch-source.mjs tradingview-lightweight-charts
```

Opt in to fetching only its pinned public files and verifying both SHA256 and
Git blob hashes. Downloaded text stays under ignored `.local/` and is not executed:

```sh
node scripts/fetch-source.mjs tradingview-lightweight-charts --fetch
```

For a separate REA run, follow [the reproduction guide](PROVENANCE.md). We do not
automatically install upstream dependencies or execute inspected applications.

## Contribute

Bring a precise question, an authorized public target and checkable evidence.
See [contribution guidance](CONTRIBUTING.md) and the [entry template](ENTRY_TEMPLATE.md).
Corrections and limitations are as valuable as new entries.

Original documentation: [CC BY 4.0](LICENSE-DOCS.md). Original repository scripts:
[MIT](LICENSE). Upstream software, data, media and trademarks retain their own
terms; this repository does not relicense them. See [attribution](ATTRIBUTION.md).

Maintained by Brandon Ducar. Built alongside DreamNet; its private repository is
not part of this release. Working title; no trademark clearance or novelty claim.
