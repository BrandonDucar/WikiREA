# Runtime Execution Checks

Follow-up observed **2026-10-18**. These are actual executions of original,
bounded fixtures, separate from the earlier static source inspections.
[Reported evidence](../provenance/runtime-execution.json) includes runtime identity,
archive/executable hashes, fixture hash, observations and explicit limits.
This is maintainer-reported evidence, not independent certification.

## What Ran

| Runtime | Exact Binding | Environment | Observed Results |
| --- | --- | --- | --- |
| Deno | 2.9.7; official Windows release archive SHA256 checked | Windows x64, sanitized child environment | Seven portable cases; denied filesystem/environment/network attempts; wrong-type TS executed but separate check rejected it; unhandled rejection exited 1; external watchdog stopped an infinite loop |
| Bun | 1.4.3 baseline; official Windows release archive SHA256 checked | Windows x64, sanitized child environment | Seven portable cases; wrong-type TS executed; unhandled rejection exited 1; external watchdog stopped an infinite loop; worker resource-limit readback was null, not enforcement proof |
| QuickJS | Source commit `84e723f1ace5e3823cef8149dd0f890fe74b77ce`; version 2026-06-04 | Built for Linux musl; non-root Docker, no network, read-only filesystem, dropped capabilities, finite memory/CPU/PIDs | Seven portable cases; unhandled rejection exited 1; external watchdog stopped an infinite loop; configured eight-MiB engine limit rejected the allocation fixture |

The common cases cover JSON validation, non-finite number serialization, finite
promise ordering, a race winner, its uncancelled loser, and rejection versus
successful completion. The same [original fixture](../scripts/portable-probe.js)
ran on every host. Different platforms and startup paths make the recorded
elapsed times unsuitable as a performance comparison.

## Reproduce The Common Cases

Use an already trusted executable. This command neither downloads nor installs it:

```sh
node scripts/run-portable.mjs deno PATH_TO_DENO
node scripts/run-portable.mjs bun PATH_TO_BUN
node scripts/run-portable.mjs quickjs PATH_TO_QJS
```

The wrapper sanitizes the inherited environment, uses a temporary working
directory and bounds time/output. Bun uses `--no-env-file --no-install`; Deno
denies sensitive I/O and disables config discovery; QuickJS receives a memory
limit. These controls are not equivalent isolation guarantees.

To reproduce the QuickJS build, obtain the exact pinned GitHub source archive
from [the upstream commit archive](https://github.com/bellard/quickjs/archive/84e723f1ace5e3823cef8149dd0f890fe74b77ce.tar.gz)
as `.local/quickjs-build/quickjs.tar.gz`, verify its hash against the evidence,
then explicitly build with [the Dockerfile](../scripts/quickjs.Dockerfile).
The build downloads compiler packages inside its disposable build stage; it is
not a fully hermetic or bit-reproducible toolchain.

```sh
docker build -f scripts/quickjs.Dockerfile -t wikirea-quickjs .local/quickjs-build
docker run --rm --network=none --read-only --cap-drop=ALL --security-opt=no-new-privileges --memory=128m --cpus=1 --pids-limit=32 --mount type=bind,source=ABSOLUTE_FIXTURE_PATH,target=/fixture.js,readonly wikirea-quickjs --memory-limit 16777216 /fixture.js
```

Replace the fixture placeholder with the absolute path to `scripts/portable-probe.js`.
The image has no public registry release. Its local image digest is recorded only
as the identity of the tested build, not an independently available artifact.

## Additional Checks And Their Limits

Deno denial was checked with explicit deny flags and `--no-prompt`, not by
attempting to bypass policy. Separate `deno check --no-config --no-remote` caught
the synthetic type error. Bun executed the same incorrect annotation without
type checking. QuickJS's memory test attempted bounded allocation under its
configured engine limit. Infinite loops were stopped by the parent watchdog;
this does not mean the code cooperatively cancelled itself.

Do not infer that Bun memory limits work from option acceptance, that a timeout
rolls back prior effects, or that any runtime is safe for arbitrary hostile code.
No production rollout, external account action or model inference was part of
these checks. Node CI reruns the portable fixture on Node and validates the
recorded evidence; it does not secretly rerun three installed engines.

## What Changed In DreamNet

The local integration uses the existing Fish simulation entry point and private
paper-source reference, with a finite 12-case shock/fee/slippage sensitivity grid.
All three engines produced matching case results. A second process reopened
the immutable receipts and reused them without new execution. The desk projects
those receipts through a read-only Simulation Lab view.

The adapter is a local deterministic cost-sensitivity worker, not the upstream
MiroFish/OASIS pipeline, a hosted fish agent, a trading fill engine or a forecast.
It adds no trading authority. Actual private implementation and source data are
not published. [Integration map](runtime-integration.md), [runtime glossary](runtime-glossary.md).
