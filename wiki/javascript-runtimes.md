# JavaScript And Node.js: What An Event Actually Proves

**Status:** one selected Node.js source file statically analyzed. Separate original
runtime probes test the host runtime, not a downloaded Node build.

## Layers To Keep Separate

JavaScript language rules, an engine such as V8, a host such as Node.js, and a
framework such as React are different investigation targets. Finding a behavior
in one does not make it a universal property of all four.

The first runtime investigation asks whether emitting an event proves that
asynchronous work finished, was persisted, or will survive process restart.

## Pinned Source

Node.js **v24.0.0**, a historical release pin rather than a latest-version claim:
[c5349f4](https://github.com/nodejs/node/tree/c5349f43cd66d2aa02d86414c9ed426f71d3ae48).
[Manifest](../provenance/nodejs-events.json)
retains LICENSE and `lib/events.js`. [REA result](../provenance/nodejs-events.json):
one JS file parsed, 35,111 bytes read, zero failures and 37 analyzer findings.
The Node runtime itself was not rebuilt or executed from this source snapshot.

## What The Code Shows

In [EventEmitter.emit](https://github.com/nodejs/node/blob/c5349f43cd66d2aa02d86414c9ed426f71d3ae48/lib/events.js#L454),
handlers are invoked directly. The multi-listener path clones the listener array
before iterating. There is no general await of an asynchronous handler's work.
An unhandled error event takes a throwing path. The once wrapper removes itself
before invoking its callback, which matters for reentrant emission.

These observations align with the official [events documentation](https://nodejs.org/api/events.html).
They do not mean every JavaScript event API behaves like Node's EventEmitter.
Promise rejection capture and custom subclasses require their own inspection.

## Runnable Original Probes

The public repository includes `scripts/events-probe.test.mjs`: seven small tests
for synchronous ordering, async non-await, reentrant once behavior, removal during
emission, error handling and an emission with no listeners. Run them with:

```sh
node --test scripts/events-probe.test.mjs
```

The tests use the installed runtime's built-in `node:events`, not downloaded code.
Record `node --version` with results. A result on another runtime version is a
separate observation and does not certify all paths of the pinned implementation.
During release preparation, all seven passed on the installed Node.js v26.7.0.
The public CI repeats these probes on its selected Node.js version.

## Reusable Contract

Keep these states distinct: event emitted, listener started, task finished,
result persisted, acknowledgment recorded and restart recovery tested.
An in-process event bus alone is not a durable queue or successful delivery.
This is especially relevant to agent coordination and compiler completion hooks.

## Next Language And Runtime Targets

These are investigation candidates, not completed analyses:

| Layer | Public Target | First Question |
| --- | --- | --- |
| Language semantics | [ECMA-262](https://github.com/tc39/ecma262) | Jobs, promises and observable ordering |
| Type system / compiler | [TypeScript](https://github.com/microsoft/TypeScript) | What does type erasure leave unvalidated at runtime? |
| Browser engine | [V8](https://github.com/v8/v8) | Which isolated parsing/serialization behavior is feasible to inspect first? |
| Small engine | [QuickJS](https://github.com/bellard/quickjs) | How are values and host boundaries represented? |
| Alternative host | [Deno](https://github.com/denoland/deno) | How do permission checks differ from language semantics? |
| Alternative host | [Bun](https://github.com/oven-sh/bun) | What does compatibility mean for one pinned Node API? |
| UI runtime | [React](https://github.com/facebook/react) | How do scheduling and effects differ from event emission? |
| UI framework | [Vue](https://github.com/vuejs/core) | How do dependency tracking and invalidation propagate? |
| Portable execution | [WebAssembly spec](https://github.com/WebAssembly/spec) | What is module execution versus host-provided capability? |

No complete language, compiler, browser engine or framework was reconstructed.
Node's retained license has component-specific notices; this library bundles no
Node code. Refresh when the chosen version or event behavior changes.

Related: [operations glossary](operations-glossary.md), [mechanics](mechanics.md),
[library home](index.md).
