# From Runtime Findings To DreamNet

This is a public-safe integration design. Private source, credentials, local
evidence logs and deployment topology are intentionally absent. Reading these
pages grants no execution authority.

## Reuse The Existing Contracts

| Finding | Existing DreamNet Consumer | Proposed Application | Required Evidence |
| --- | --- | --- | --- |
| Type erasure | KnowledgeCompiler and capability input contracts | Validate imported values with runtime schemas; keep build checks separate | Reject malformed and wrong-type inputs even when transpilation passes |
| Source/version binding | Repository capability adapter and Keeper | Retain commit/file digests, scope and omissions; invalidate stale reuse | Changed-source and wrong-tenant rejection |
| Async completion boundary | Arya work loop and durable wormhole receipts | Await bounded work; persist the result before acknowledgment | Crash at each boundary; duplicate delivery; readback after restart |
| Host limits | Customs / runtime admission | Admit only reviewed bindings, pinned runtimes and finite budgets | Capability denial, cancellation and resource-limit probes |
| Compatibility differences | University / agent-chain review | Qualify each runtime against the workload's required API subset | An explicit versioned pass/fail/NOT_RUN matrix |
| Late result after timeout | Mission execution and outcome evidence | Retain timeout separately from eventual effects; reconcile by idempotency key | No accidental success, duplicate side effect or unreported late completion |

## Bounded First Loop

1. Treat public pages/manifests as review evidence, not executable plugins.
2. Compile their structure through the existing repository adapter. Its Markdown
   support is a bounded, filtered ATX heading index, not full-text/prose analysis;
   test that the intended lookup terms actually produce candidates.
3. Retrieve only the relevant version-bound packets for a mission.
4. Pass those packets through the existing CIR/KnowledgeCompiler/Keeper path.
5. Preserve candidate status, explicit omissions and unsigned evidence state.
6. Build and independently test a narrowly scoped adaptation before any admission.

A local canary can demonstrate structural lookup, compiler receipt creation and
in-process Keeper readback without contacting a model, database or production
worker. It does not demonstrate remote delivery, automatic fact acceptance,
cross-process Keeper persistence or live runtime deployment. Glossary text is not
automatically promoted into canonical claims.

### Local Canary Observation

On 2026-10-18, the maintainer exercised the four TypeScript, QuickJS, portability
and glossary documents through that existing path. Four outlines were indexed;
a serialized warm snapshot reused all four with zero new parses. TypeScript,
QuickJS, Deno and Bun lookups returned review candidates. The existing compiler
created a schema-checked receipt and Keeper returned its candidate artifacts.
Wrong tenant, wrong compiler revision, attempted execution promotion and a
wrong-type receipt were rejected. No-match remained NO_MATCH.

This is a maintainer-reported local observation, not independently reproduced
delivery evidence. The receipt added no canonical claims; its Proof Drop stayed
unsigned. Keeper readback was in-process only. No model/provider, remote database,
production agent or live trade was involved; billed savings remain unmeasured.

## Where This Helps The Product

**Trade Invader:** expose real research/validation/completion states rather than
animating an agent as successful before its paper result is retained. Keep market
events, simulated branches and live authority distinct.

**MiroDream / Fish:** give each practice branch explicit source inputs, runtime
version and budget; preserve rejected or incomplete runs. A branch timing out
does not establish that its underlying effects were cancelled.

**Compiler reuse:** reuse source-bound structural answers when their digests
remain valid. That can avoid repeated discovery work, but local token reduction,
subscription headroom and actual cash savings require different measurements.

## Possible Paid Work, Not Established Revenue

The public library can support scoped migration assessments, API-compatibility
test packs, failure/recovery reviews and evidence-backed onboarding reports.
The commercial deliverable is a tested answer for a customer's authorized
workload, not copied proprietary software or a guarantee of cost reduction.
No revenue, runtime-speed advantage or measured customer savings is claimed.

## Runtime Execution Follow-Up

The later [execution checks](runtime-execution.md) exercised all three runtimes.
A private, finite Fish sensitivity adapter now uses sanitized child environments,
owned working directories, disabled Bun environment-file/autoinstall behavior,
external deadlines, output limits, runtime/code/policy bindings and immutable
read-back receipts. Failed and timed-out attempts cannot become completed
scenarios. Trade Invader consumes its read-only projection in Simulation Lab.
The earlier outline canary remains structural review evidence, not a semantic
knowledge importer. The broader reusable mechanics still require qualification
against each real workload; this partial adaptation grants no general admission.

Navigation: [runtime findings](runtime-portability.md), [mechanics](mechanics.md),
[library](index.md).
