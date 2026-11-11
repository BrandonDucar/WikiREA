# WikiREA

**Understand how things work. Keep the evidence. Reuse the mechanics.**

Open the [WikiREA app](https://BrandonDucar.github.io/WikiREA/) to search the
maintained source studies, read new automated research, and inspect all ten
workers' retained outcomes. The app is published through GitHub Pages.

WikiREA is a growing, independent library of source-bound investigations into
software, games and runtimes. Start with [the wiki](wiki/index.md), browse the
[mechanics](wiki/mechanics.md), or inspect the [machine-readable catalog](library.json).

<img src="assets/wikirea-poster.png" alt="WikiREA: pinned sources, clear evidence, reusable mechanics. GitHub-first, in progress." width="420">

## Explore

| Collection | Investigations |
| --- | --- |
| Television and personalization | [Netflix](wiki/netflix-streaming-personalization.md): preference intake, viewing signals, history imports, delivery scaling and proposed Decent T.V. adaptations; official documentation only |
| Contribution networks | [SLOP](wiki/slop-contribution-network.md): accepted work, revision-bound rules, uncertain dispatch and finalized payment evidence |
| Major software | [Wikipedia / MediaWiki](wiki/mediawiki.md), [NASA Open MCT](wiki/nasa-openmct.md), [PhotoCraft history](wiki/photocraft-history.md) |
| Finance | [TradingView, Polygon.io / Massive, Polygon blockchain and Robinhood](wiki/finance-first-pass.md) |
| Games and quantum visualization | [Quantum Game 2](wiki/quantum-game-2.md), [Quantum Tensors](wiki/quantum-tensors.md), [BraKetVue](wiki/bra-ket-vue.md), [Quantum Game Classic](wiki/quantum-game-classic.md) |
| Languages and runtimes | [JavaScript / Node.js](wiki/javascript-runtimes.md), [TypeScript emit](wiki/typescript-emit.md), [QuickJS host loop](wiki/quickjs-host.md), [Deno and Bun boundaries](wiki/runtime-portability.md) |
| Agent pipelines | [MiroFish and BettaFish](wiki/fish-pipeline.md): exact-source preparation, trace retention and remaining simulation gates |
| Agent workspaces | [OpenBot, Grok Bot, Hark and Instinct](wiki/agent-workspaces.md): upstream recovery/queue source and separately labeled hosted-product docs |
| Agent runtime appendages | [Herdr core and desktop mods](wiki/herdr-appendage.md): process ownership, input gates, turn-aware waits and proposed host grafts |
| Self-improvement systems | [DSPy](wiki/dspy-optimization.md), [Darwin Godel Machine](wiki/darwin-godel-machine.md), [AlphaEvolve Cloud client](wiki/alphaevolve-client.md): candidate search, lineage and evaluation handoffs |

Glossaries: [investigation](wiki/glossary.md), [finance](wiki/finance-glossary.md),
[quantum/simulation](wiki/quantum-glossary.md), [operational state](wiki/operations-glossary.md),
[language/runtime](wiki/runtime-glossary.md).
[Fish pipeline terms](wiki/fish-pipeline-glossary.md) distinguish personas,
simulators, components, action traces and liveness bindings.
[Self-improvement terms](wiki/self-improvement-glossary.md) and the
[comparison](wiki/self-improvement-comparison.md) separate optimization from proof
of improvement and map proposed reuse into existing consumers.
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
node --test scripts/contributors.test.mjs
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

Prepare a compact task for the [ten-role contributor team](wiki/contributors.md):

```sh
node scripts/contributors.mjs --preflight
node scripts/contributors.mjs --task music-events
```

These packet commands do not start agents, call models or publish. The first music/event
entry traces [WaveWarZ's observation boundaries](wiki/wavewarz.md).

The separate [research workflow](.github/workflows/research.yml) runs the ten roles
on a recurring, serialized schedule. It acquires a pinned public encyclopedia
revision, requests an original explanation, checks it with a different model,
and publishes accepted research notes separately from maintained source studies.
It discovers follow-up topics from source links. This first automatic source
adapter documents mechanisms; it does not inspect proprietary code or physically
disassemble products. See [worker operations](wiki/worker-operations.md) for
budgets, failure handling, deployment, and how to pause the workers.

Bring a precise question, an authorized public target and checkable evidence.
See [contribution guidance](CONTRIBUTING.md) and the [entry template](ENTRY_TEMPLATE.md).
Corrections and limitations are as valuable as new entries.

Original documentation: [CC BY 4.0](LICENSE-DOCS.md). Original repository scripts:
[MIT](LICENSE). Upstream software, data, media and trademarks retain their own
terms; this repository does not relicense them. See [attribution](ATTRIBUTION.md).

Maintained by Brandon Ducar. Built alongside DreamNet; its private repository is
not part of this release. Working title; no trademark clearance or novelty claim.
