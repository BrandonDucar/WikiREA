# WikiREA

An evidence library for how software, games and systems work.

Start with an investigation, follow its source, learn its terms, and inspect what
could be reused. This is the public GitHub edition, not a hosted wiki service.

## Investigations

| Topic | What You Can Learn | Evidence Stage |
| --- | --- | --- |
| [Wikipedia / MediaWiki](mediawiki.md) | Titles, revisions, edits, categories and evidence-bound pages | Selected JS static analysis, selected PHP reading and one bounded public API observation |
| [TradingView](finance-first-pass.md#tradingview) | Chart updates, corrections, crosshair and time ranges | Selected public-library TS static analysis |
| [Polygon.io / Massive](finance-first-pass.md#polygonio--massive-market-data) | Client pagination, stream authentication and timestamp units | Selected official-client TS static analysis |
| [Polygon blockchain](finance-first-pass.md#polygon-blockchain) | Block-bound receipts and finality wrapper | Selected Go source manually inspected; no Go analysis/execution |
| [Robinhood](finance-first-pass.md#robinhood) | Crypto API scope and observation-versus-execution boundary | Official documentation reviewed; application source not inspected |
| [Quantum Game 2](quantum-game-2.md) | Goal/safety checks and bounded playback | Selected TS static analysis and source reading |
| [Quantum Tensors](quantum-tensors.md) | Named dimensions, measurement branches and sampling | Selected TS static analysis; missing standalone license notice flagged |
| [BraKetVue](bra-ket-vue.md) | Complex-state legends, labels and matrix selection | Selected TS static analysis plus manual Vue-source inspection |
| [Quantum Game Classic](quantum-game-classic.md) | Browser checkpoints, distribution goals and useful failure feedback | Selected JS static analysis and source reading |
| [NASA Open MCT](nasa-openmct.md) | Independent time contexts and historical/live telemetry providers | Selected JS static analysis; no mission-control runtime tested |
| [PhotoCraft](photocraft-history.md) | Undo targets, snapshots and background-job restore guards | Selected Rust implementation/tests manually read; no Rust analysis or execution |
| [JavaScript / Node.js](javascript-runtimes.md) | Event ordering, async completion and delivery boundaries | Selected core JS source analyzed; separate installed-runtime probes |
| [TypeScript](typescript-emit.md) | Erasure, assertions, transpilation versus semantic checking | Two pinned TS files analyzed; Node strip probes are separate |
| [QuickJS](quickjs-host.md) | Host-driven pending jobs and resource-limit hooks | Selected C manually read; one supplementary JS test file statically parsed |
| [Deno](runtime-portability.md#deno-permission-scope-matters) | Resource-scoped permissions and native/subprocess boundaries | Official documentation only; runtime NOT_RUN |
| [Bun](runtime-portability.md#bun-compatibility-is-a-test-obligation) | Node API compatibility as a workload test obligation | Official documentation only; runtime NOT_RUN |

Eleven REA-backed catalog entries cover **57 selected JS/TS files** with zero parse
failures. This includes one supplementary QuickJS builtin-test source, not its C
host implementation. Bor, Robinhood, PhotoCraft, Deno and Bun carry different
evidence stages, not five more completed REA runs. Upstream test suites did not run;
separate [original runtime checks](runtime-execution.md) now cover Deno, Bun and QuickJS.
The retained source collections cover subsets, never entire apps by implication.

## Explore By Concept

- [Investigation and wiki glossary](glossary.md): source identity, revisions, lineage, claims and evidence.
- [Finance glossary](finance-glossary.md): events, corrections, backfill, receipts and paper execution.
- [Quantum and simulation glossary](quantum-glossary.md): 25 terms, including amplitude versus probability and replay versus reality.
- [Operational and creative-state glossary](operations-glossary.md): 12 terms covering clocks, history, providers and snapshots.
- [Language and runtime glossary](runtime-glossary.md): 20 terms separating types, jobs, cancellation, receipts and authority.
- [Twelve reusable mechanics](mechanics.md): source-backed behavior specifications with proposed tests and DreamNet consumers.
- [Big and unexpected targets](../TARGETS.md): a twenty-repository discovery shortlist, separate from completed investigations.

## For Builders And Agents

- [Catalog](../library.json): exact commits, coverage, source manifests and analyzer receipts.
- [Mechanics records](../mechanics.json): inputs, outputs, source bindings and acceptance cases.
- [Entry template](../ENTRY_TEMPLATE.md): a consistent investigation contract.
- [Project README](../README.md): reproduction and local validation commands.
- [Runtime integration](runtime-integration.md): concrete consumer mapping without private source or activation claims.
- [Runtime execution checks](runtime-execution.md): actual pinned-host observations and bounded reproduction.

## Reading The Evidence

**Documentation reviewed** means a source describes a capability. **Source inspected**
means selected implementation text was read. **Statically analyzed** means an
analyzer processed selected code. **Runtime tested** requires actual behavior
checks, which are not claimed for these targets. None automatically means deployed,
safe for every context, commercially validated or authorized to act.

Public-source licenses do not automatically cover private services, market data,
device images, artwork or marks. This public edition contains sanitized manifests
and original explanations, not target code or private working folders.
