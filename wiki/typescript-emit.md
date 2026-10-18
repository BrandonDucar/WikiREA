# TypeScript: Emit Is Not Validation

Question: when TypeScript produces JavaScript, what protection actually survives?

## Scope And Method

Fixed historical **v5.8.3**, commit
`68cead182cc24afdc3f1ce7c8ff5853aba14b65a`, not a claim about the newest release.
Four files retained, including license/package metadata. REA 6.4.0 processed two
TS files as inert text: 126,802 bytes, zero parse failures. Source was read manually
to interpret the control flow. No compiler build or upstream test suite ran.
[Manifest](../provenance/typescript-emit.json).

## What The Source Shows

| Finding | Pinned Evidence | Consequence |
| --- | --- | --- |
| Interfaces and type aliases do not become runtime validators | [Transformer cases, lines 701-712](https://github.com/microsoft/TypeScript/blob/68cead182cc24afdc3f1ce7c8ff5853aba14b65a/src/compiler/transformers/ts.ts#L701-L712) return non-emitted statements | Incoming JSON still needs an actual parser/schema |
| An assertion retains the underlying expression, not a runtime check | [visitAssertionExpression and visitNonNullExpression](https://github.com/microsoft/TypeScript/blob/68cead182cc24afdc3f1ce7c8ff5853aba14b65a/src/compiler/transformers/ts.ts#L1718-L1728) | `as Receipt` and `value!` cannot authenticate or validate a receipt |
| Single-file transpilation is not a full semantic check | [transpileWorker diagnostics and emit](https://github.com/microsoft/TypeScript/blob/68cead182cc24afdc3f1ce7c8ff5853aba14b65a/src/services/transpile.ts#L203-L216) collect syntactic/options diagnostics, then emit | Zero transpile diagnostics cannot establish type correctness across a project |
| Some TS constructs require generated runtime code | [Enum emission decision and transformation](https://github.com/microsoft/TypeScript/blob/68cead182cc24afdc3f1ce7c8ff5853aba14b65a/src/compiler/transformers/ts.ts#L1786-L1810) | Stripping erasable syntax is not equivalent to supporting every TS feature |

The [official assertion documentation](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
independently describes assertions as compile-time information, not runtime checking.

## Original Behavior Probes

Run `node --test scripts/runtime-probe.test.mjs` from the repository root.
Four fixtures specifically exercise the installed Node built-in type stripper:
an asserted wrong value survives, non-null access still throws, a type-only import
disappears, and an enum is refused in strip-only mode.

These are original synthetic examples, not downloaded target code. They passed on
Node **26.7.0** locally. They do not execute the pinned TypeScript compiler or
establish Bun/Deno parity. The test runner prints the actual host version.
[Probe source](../scripts/runtime-probe.test.mjs).

## Reusable Mechanic

**Separate emit, check, parse, and authorize.** Preserve separate results for
source transformation, project type checking, runtime schema validation and
permission review. Never manufacture the other three from a successful emit.

Acceptance cases: malformed JSON; well-formed JSON with the wrong field type;
valid schema with stale source binding; valid evidence with no execution lease;
and transpilation that succeeds despite a semantic type error.

## Limits And Rights

Apache-2.0 project notice retained privately; no upstream code is bundled here.
This is neither a compiler/security audit nor proof that a particular application
performs sufficient validation. Custom transforms, checker internals, module
resolution and all unselected code remain outside scope.

Next: [runtime host loops](quickjs-host.md), [portability](runtime-portability.md),
[glossary](runtime-glossary.md), [reuse in DreamNet](runtime-integration.md).
