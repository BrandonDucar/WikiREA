# PhotoCraft: Undo, Snapshots And Document Identity

**Status:** selected Rust implementation and tests manually inspected. No Rust analyzer, application build or test execution performed.

## Question And Source

What needs to be restored when an editor undoes a change or selects a snapshot,
and how does it avoid confusing history with persistent storage?

[Pinned source](https://github.com/storytold/photocraft/tree/9185b64b94c07458038e768f4b31778590ba93ee):
`9185b64b94c07458038e768f4b31778590ba93ee`.
[Manifest](../provenance/photocraft-history.json)
retains seven files, including both code licenses, NOTICE, selected history and
layer code, and one upstream test file. No complete editor graph was recovered.

This is inspection of an independent open-source editor, not Adobe source.
The project's README describes a from-scratch implementation. That description
does not establish complete Photoshop parity or independently prove its process.

## What The Code Shows

[History commands](https://github.com/storytold/photocraft/blob/9185b64b94c07458038e768f4b31778590ba93ee/crates/engine/src/history_cmds.rs)
distinguish a linear history state, a named snapshot and a new document derived
from a state. Snapshot IDs increase rather than being reassigned after deletion.
Snapshot restoration checks for an active background job and returns an error
instead of moving the document underneath that job. The selected restore path
retains the current document's identity and name while restoring snapshot content
and an appropriate layer selection.

Snapshot comments describe session-only storage and copy-on-write sharing. These
are not disk-durability guarantees. Memory-budget behavior is described and has
in-file test cases, but the wider accounting implementation was not inspected.

The selected [undo test](https://github.com/storytold/photocraft/blob/9185b64b94c07458038e768f4b31778590ba93ee/crates/engine/tests/undo_keeps_active_layer.rs)
asserts that undo/redo preserve the intended edit target and can restore an
intentionally empty selection. Reading those assertions is not a passing test run.

## Reusable Behaviors

- Restoring content must account for the active target, not only pixels/data.
- A snapshot can become a new reversible operation without changing object identity.
- Do not rewind mutable state while a background task assumes its current version.
- Session undo, saved files, durable checkpoints and external-effect reversal are different contracts.

Candidate use: original creative workflows, simulation branch checkpoints and
reviewable agent edits. A real external action cannot be undone merely by restoring
an interface. New adaptations need explicit side-effect and concurrency contracts.

## Verification Still Needed

Test branch restoration during a job, deleted layer selection, empty selection,
snapshot ID stability, history budget pressure and process restart. No compatibility
or performance benchmark against Photoshop was conducted.

MIT/Apache notices and NOTICE were retained. Fonts, images, icons and project
branding have separate terms; none is included in WikiREA's public export.
Refresh after history, layer identity, background-job or persistence changes.

Related: [operations glossary](operations-glossary.md), [checkpoint mechanics](mechanics.md),
[Quantum Game Classic](quantum-game-classic.md), [library home](index.md).
