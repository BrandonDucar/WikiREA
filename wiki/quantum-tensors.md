# Quantum Tensors: Typed States And Measurement Branches

**Status:** selected source inspected and statically analyzed. Scientific and runtime validation not performed.

## Question

How does a numerical library keep state dimensions compatible and represent
different measurement outcomes without confusing a sample with the full result?

## Source And Coverage

- [Pinned repository](https://github.com/Quantum-Flytrap/quantum-tensors/tree/b8c677c51475ba33644cb62658796b5a190fdf42): `b8c677c51475ba33644cb62658796b5a190fdf42`.
- [Manifest](../provenance/quantum-tensors.json): 12 retained files, 92,977 bytes.
- [REA receipt](../provenance/quantum-tensors.json): ten TypeScript files parsed, zero failures; 131 analyzer findings, not bugs.
- Selected upstream test files were inspected as source, not executed. Other operators, dependencies and full application consumers were omitted.

## What The Source Shows

[Dimension](https://github.com/Quantum-Flytrap/quantum-tensors/blob/b8c677c51475ba33644cb62658796b5a190fdf42/src/Dimension.ts)
provides named coordinate systems such as position, polarization and qubits.
`checkDimensions` rejects different component counts and incompatible ordered
dimensions. This catches a category of mismatched tensor operations; it does not
prove every caller validates its inputs correctly.

[Measurement](https://github.com/Quantum-Flytrap/quantum-tensors/blob/b8c677c51475ba33644cb62658796b5a190fdf42/src/Measurement.ts)
retains named states. Projective measurement creates branches, combines them with
remaining states and filters very small contributions. Squared vector norms
provide branch probabilities. `pickRandom` samples using `Math.random`, accumulates
those probabilities and returns one normalized named result, or throws when no
branch is selected.

The selected [measurement tests](https://github.com/Quantum-Flytrap/quantum-tensors/blob/b8c677c51475ba33644cb62658796b5a190fdf42/tests/Measurement.test.ts)
describe partial, sequential and weighted measurement cases. Their presence is
not a passing test result in our environment.

## Reusable Mechanics

- **Named axes:** make units and coordinate ordering explicit before composition.
- **Branch ledger:** preserve outcome names and weights before sampling one result.
- **Reproducible sampling requirement:** an adapted scenario runner should retain a seed or replayable random sequence; the inspected method does not expose seed injection.

DreamNet scenario branches can borrow those organizational ideas. Ordinary
probability-weighted scenarios are not quantum states: quantum amplitudes are
complex and normalized through squared magnitudes. See the primary
[IBM state-vector explanation](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information).
Do not claim quantum advantage from a branching agent simulation.

## Acceptance Checks Still Needed

Test incompatible axis order, absent dimensions, zero vectors, normalization
tolerance, repeated measurement and seeded replay. Use a maintained numerical
engine rather than inventing new quantum physics for the UI. No quantum hardware,
prediction accuracy or DreamNet consumer was tested.

## License Gap

The pinned `package.json` declares MIT, but no standalone license file was found
at the inspected commit. Package metadata is not a retained full notice. This
entry documents behavior and attribution; copying upstream code into a released
package remains on hold pending notice/provenance review.

Refresh after dimension, measurement, numerical-tolerance or license changes.
Commercial hypothesis: numerical-visualization integrations and qualified
educational investigations, not selling a quantum trading prediction claim.

Related: [BraKetVue](bra-ket-vue.md), [glossary](quantum-glossary.md),
[mechanics](mechanics.md), [library home](index.md).
