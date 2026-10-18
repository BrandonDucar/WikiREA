# QuickJS: An Engine Needs A Host

Question: who makes asynchronous work progress, and who supplies its limits?

## Scope And Method

Pinned commit `84e723f1ace5e3823cef8149dd0f890fe74b77ce`. Five files retained:
`LICENSE`, `quickjs.h`, `quickjs-libc.c`, `qjs.c`, and `tests/test_builtin.js`.
REA 6.4.0 statically parsed the single JS test file (34,141 bytes), with zero parse
failures. **The host-loop findings below come from manual C-source inspection,
not a C decompiler or the JavaScript analyzer.** The JS file is supplementary
builtin-test source; it does not validate the pending-job loop. No QuickJS binary
or upstream test ran. [Manifest](../provenance/quickjs-host.json).

## What The Source Shows

1. [js_std_loop](https://github.com/bellard/quickjs/blob/84e723f1ace5e3823cef8149dd0f890fe74b77ce/quickjs-libc.c#L4292-L4312)
   repeatedly invokes `JS_ExecutePendingJob`. A positive result continues the
   inner loop; zero or negative breaks it, with negative results reported.
   Rejection checking and the host poll function follow.
2. [js_std_await](https://github.com/bellard/quickjs/blob/84e723f1ace5e3823cef8149dd0f890fe74b77ce/quickjs-libc.c#L4315-L4352)
   examines promise state, returns a fulfilled result, propagates rejection, and
   advances pending jobs while waiting. Host participation is explicit.
3. [Interpreter initialization](https://github.com/bellard/quickjs/blob/84e723f1ace5e3823cef8149dd0f890fe74b77ce/qjs.c#L474-L485)
   creates the runtime and conditionally applies configured memory and stack
   limits. Those options are not evidence of a complete sandbox.
4. [The public header](https://github.com/bellard/quickjs/blob/84e723f1ace5e3823cef8149dd0f890fe74b77ce/quickjs.h#L958-L962)
   exposes an interrupt-handler hook. The [official embedding guide](https://bellard.org/quickjs/quickjs.html#Execution-timeout-and-interrupts)
   describes using it for execution timeouts. A host still has to install and
   implement an appropriate policy.

## Interpretation For Agent Builders

An embedded JS engine is not automatically a Node replacement, a durable worker,
or an authority system. Host bindings decide what a script can touch. A promise
is not a persisted result. Proposed worker adaptations must add finite job/time
budgets, rejection reporting, narrowly exposed capabilities and an external
completion record before being treated as operational.

The finite Node microtask, cancellation and race probes in
[runtime-probe.test.mjs](../scripts/runtime-probe.test.mjs) illustrate related
failure modes on that host only; they are **not QuickJS conformance tests**.

## Reusable Mechanic

**Budgeted host pump:** advance bounded work, retain failure/cancellation state,
yield to the scheduler, then acknowledge only an independently persisted result.
This is a specification candidate, not behavior already implemented or tested in
an embedded DreamNet worker. The selected stock loop itself has no per-turn job
count limit in the inspected body.

Acceptance cases: empty queue; rejected job; nested jobs; work exceeding a finite
budget; cancellation during host I/O; restart after result persistence but before
acknowledgment. A timeout must not be reported as rollback.

## Limits And Rights

MIT notice retained. No upstream source or bytecode is bundled. Engine internals,
OS-specific binding safety, limits in native calls, isolation strength and
performance were not established. No target or installed QuickJS runtime ran.

Next: [runtime portability](runtime-portability.md), [terms](runtime-glossary.md),
[integration proposal](runtime-integration.md), [library](index.md).
