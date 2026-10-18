# Quantum Game Classic: Persistent Puzzles And Constraint Feedback

**Status:** selected source inspected and statically analyzed. No app, upstream test suite or recovery experiment executed.

## Question

How does the original game retain a player's work and explain why a puzzle
solution failed instead of returning only a score?

## Source And Coverage

- [Pinned repository](https://github.com/stared/quantum-game/tree/531710c7b2eff76f61ea2afc036398abf4741b34): `531710c7b2eff76f61ea2afc036398abf4741b34`.
- [Manifest](../provenance/quantum-game-classic.json): 12 files, 39,765 bytes.
- [REA receipt](../provenance/quantum-game-classic.json): nine JavaScript files parsed, zero failures; 98 analyzer findings.
- Legacy snapshot. Selected `.spec.js` files were analyzed as text/code, not run. Browser storage, dependencies, other engine files and visual behavior remain untested.

## What The Source Shows

[Storage](https://github.com/stared/quantum-game/blob/531710c7b2eff76f61ea2afc036398abf4741b34/js/storage.js)
stores a board export as JSON under a per-level localStorage key. It retains
won-state and current-level keys separately. Reading missing progress throws.
This is browser-local persistence, not a transactionally durable server queue,
multi-device synchronization or validated crash recovery.

[WinningStatus](https://github.com/stared/quantum-game/blob/531710c7b2eff76f61ea2afc036398abf4741b34/js/winning_status.js)
aggregates simulated absorption probabilities across measurement history. Its
comparison combines sufficient detector probability, enough fed detectors and
no mine explosion. Feedback distinguishes a mine violation, missing detectors
and insufficient detection probability. It judges a distribution, not only one
lucky random sample.

## Reusable Mechanics

- **Checkpoint versus achievement:** saved work and completion are separate records.
- **Distribution-based objectives:** evaluate the intended outcome distribution, not a selected success clip.
- **Specific failure feedback:** identify the failed constraint before suggesting the next attempt.

For DreamNet, a mission checkpoint could preserve plan, evidence versions and
attempt history. A completion receipt remains a separately verified artifact.
For trading, a lucky fill or cherry-picked backtest cannot certify a strategy.

## Acceptance Checks Still Needed

Test a missing checkpoint, malformed JSON, old schema, duplicate restore,
storage quota failure and browser restart. Any production adaptation needs
versioned schemas, atomic writes and an actual restart test using the existing
durable worker infrastructure. No restart-survival claim is made for this entry.

MIT notice retained. Media and dependencies need separate review. Refresh after
storage key/schema, scoring, numerical tolerance or simulation changes.
Commercial hypothesis: migration or replay integration backed by synthetic
fixtures and a customer's accepted workflow, not resale of the original game.

Related: [Quantum Game 2](quantum-game-2.md), [glossary](quantum-glossary.md),
[mechanics](mechanics.md), [library home](index.md).
