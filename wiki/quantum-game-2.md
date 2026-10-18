# Quantum Game 2: Objectives, Safety And Replay

**Status:** selected source inspected and statically analyzed. App not executed.

## Question

How does an optical puzzle decide that a solution is successful, and how does it
let a player inspect the simulated history? These are distinct responsibilities.

## Source And Coverage

- [Pinned repository](https://github.com/Quantum-Game/quantum-game-2/tree/dbeebfa51a4bc3e6be27784992cc24fb0450c503): `dbeebfa51a4bc3e6be27784992cc24fb0450c503`.
- [Retained manifest](../provenance/quantum-game-2.json): 12 files, 41,743 bytes.
- [REA receipt](../provenance/quantum-game-2.json): nine TypeScript files parsed, zero parse failures; 137 analyzer findings, not confirmed defects.
- Legacy source snapshot, not a current production deployment. Dependencies, unselected code, assets, upstream tests and browser behavior are outside this pass.

## What The Source Shows

The [goals controller](https://github.com/Quantum-Game/quantum-game-2/blob/dbeebfa51a4bc3e6be27784992cc24fb0450c503/src/engine/controller/goals.ts)
builds two lists: positive-threshold goals and mines. It compares simulated
absorptions with goal and safety thresholds. No loaded level yields a separate
outcome. A failed safety check takes precedence over unmet goals. Victory requires
the goal and safety checks to pass. Missing absorptions do not establish success.

The [playhead controller](https://github.com/Quantum-Game/quantum-game-2/blob/dbeebfa51a4bc3e6be27784992cc24fb0450c503/src/engine/controller/playhead.ts)
keeps a target frame, playback state, optional frame limit and interpolation time.
Seeking clamps to the available range. Stepping, pausing and rewinding operate on
the frame history. Display interpolation is distinct from the stored frame index.

## Reusable Mechanics

- **Outcome plus constraints:** finishing objectives is insufficient if a hard constraint fails.
- **Bounded replay:** a viewer can inspect existing history without authorizing fresh actions.
- **Separate model and animation:** smoothing the display must not fabricate new observations.

For DreamNet, these are candidates for University completion gates, paper-trading
replay and a mission timeline. A simulated mine threshold is not a financial risk
policy. Adaptation needs explicit, independently reviewed domain constraints.

## Acceptance Checks Still Needed

Test an unloaded level, missing absorption data, exact-threshold values, a failed
mine, zero goals and zero frames. JavaScript's empty-array `every` behavior makes
zero-goal semantics worth checking against the intended level contract. This is
an edge-case question, not a confirmed gameplay defect.

For a mission viewer, test rewind after a new event, expiry of old evidence and
replay isolation from live sends/orders. No such integration tests ran here.

## Rights And Refresh

MIT notice retained in the collection. Assets, dependencies and marks require
their own review before redistribution. Refresh this entry if goals, playhead,
frame schema or dependency behavior changes.

Commercial hypothesis: a commissioned evidence/replay integration or learning
module. Buyer demand and learning improvement are unmeasured.

Related: [Classic](quantum-game-classic.md), [Quantum Tensors](quantum-tensors.md),
[glossary](quantum-glossary.md), [mechanics](mechanics.md), [library home](index.md).
