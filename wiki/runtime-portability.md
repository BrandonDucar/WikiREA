# Runtime Portability And Permissions

Method: official documentation reviewed on **2026-10-18**. Deno and Bun source
trees and binaries were not examined or executed in this pass. Their catalog
stage is documentation-reviewed, not REA-complete. Documentation can change.

## Evidence Matrix

| Subject | Evidence In This Library | What It Does Not Establish |
| --- | --- | --- |
| TypeScript | [Pinned emit/transpile source](typescript-emit.md) | Every build configuration or runtime validator |
| Node.js | [Pinned event source](javascript-runtimes.md) plus original installed-host probes | Behavior of a freshly built pinned Node binary |
| QuickJS | [Selected host/header C reading](quickjs-host.md) and supplementary static JS test parsing | Node API compatibility or verified isolation |
| Deno | Official permission documentation | An installed, tested worker or per-module privilege isolation |
| Bun | Official Node-compatibility documentation | Identical semantics for a given Node workload |

## Deno Permission Scope Matters

Deno documents sensitive I/O as denied unless granted, with resource-scoped
permissions. That is useful for designing least-privilege workers, but code on
one thread shares privileges. Subprocess and native-library access can bypass
the JavaScript permission boundary. Static module loading has separate rules.
The documentation recommends additional isolation for untrusted execution.
Therefore a proposed adapter needs an explicit import policy, scoped I/O, no
interactive permission expansion, and an externally enforced resource budget.
These are design requirements, not verified Deno behavior in this library.
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

No Deno, Bun or QuickJS runtime migration or production activation was performed.
See [glossary](runtime-glossary.md), [mechanics](mechanics.md),
[DreamNet integration](runtime-integration.md).
