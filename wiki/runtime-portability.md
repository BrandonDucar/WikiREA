# Runtime Portability And Permissions

Initial method: official documentation reviewed on **2026-10-18**. Deno and Bun
source coverage remains documentation-only, not REA-complete. A subsequent
[bounded execution pass](runtime-execution.md) tested pinned binaries separately.
Documentation can change; source coverage and runtime evidence are distinct.

## Evidence Matrix

| Subject | Evidence In This Library | What It Does Not Establish |
| --- | --- | --- |
| TypeScript | [Pinned emit/transpile source](typescript-emit.md) | Every build configuration or runtime validator |
| Node.js | [Pinned event source](javascript-runtimes.md) plus original installed-host probes | Behavior of a freshly built pinned Node binary |
| QuickJS | [Selected C reading](quickjs-host.md), supplementary JS parsing and later original runtime probes | Node API compatibility or complete isolation certification |
| Deno | Permission documentation plus later scoped denial/behavior tests | Per-module privilege isolation or full application qualification |
| Bun | Node-compatibility documentation plus later original behavior tests | Identical semantics for an arbitrary Node workload |

## Deno Permission Scope Matters

Deno documents sensitive I/O as denied unless granted, with resource-scoped
permissions. That is useful for designing least-privilege workers, but code on
one thread shares privileges. Subprocess and native-library access can bypass
the JavaScript permission boundary. Static module loading has separate rules.
The documentation recommends additional isolation for untrusted execution.
Therefore a proposed adapter needs an explicit import policy, scoped I/O, no
interactive permission expansion, and an externally enforced resource budget.
These design requirements extend beyond the limited denial fixtures we later ran.
[Official security and permissions guide](https://docs.deno.com/runtime/fundamentals/security/).

## Bun Compatibility Is A Test Obligation

Bun publishes a module-by-module Node compatibility matrix with stated gaps and
behavioral differences. The reviewed page lists differences for worker resource
limits, module APIs and async instrumentation, among others. A shared import name
does not establish equivalent resource enforcement, tracing, or cancellation.
Pin the runtime version and test the APIs actually used by a workload, including
failure paths. Do not infer portability from successful startup alone.
[Official Node compatibility matrix](https://bun.sh/docs/runtime/nodejs-compat).

## Node Type Stripping Is A Separate Path

Node documents built-in TypeScript handling as distinct from full TypeScript
support: type checking and project compiler configuration are separate concerns.
Our probes deliberately request strip-only behavior and expect enum syntax to be
rejected, rather than silently substituting a different transform.
[Official TypeScript support](https://nodejs.org/api/typescript.html),
[stripTypeScriptTypes API](https://nodejs.org/api/module.html#modulestriptypescripttypescode-options).

## Proposed Runtime Admission Checklist

- Pin executable/version, input digest and explicit supported APIs.
- Separate emit/type-check/schema/authority results.
- Exercise promise rejection, cancellation, late results and stale inputs.
- Test actual filesystem/network denial in disposable state before any sandbox claim.
- Enforce deadline and resource budgets outside the evaluated code as appropriate.
- Require durable results and restart checks separately from event-loop progress.
- Preserve NOT_RUN cells instead of replacing them with compatibility guesses.

No production runtime migration or activation was performed. The finite local
Fish adapter does not establish general workload compatibility. See the
[actual runtime checks](runtime-execution.md) for the later local executions.
See [glossary](runtime-glossary.md), [mechanics](mechanics.md),
[DreamNet integration](runtime-integration.md).
