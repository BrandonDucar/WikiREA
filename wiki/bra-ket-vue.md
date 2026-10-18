# BraKetVue: Inspectable Complex-State Visuals

**Status:** four selected TS files statically analyzed; selected Vue templates manually inspected. No rendered UI verification.

## Question

How can a visual interface expose complex numerical state without turning it
into unexplained decorative particles?

## Source And Coverage

- [Pinned repository](https://github.com/Quantum-Flytrap/bra-ket-vue/tree/f9a53be960385ab051ede43456ab971f38522cf8): `f9a53be960385ab051ede43456ab971f38522cf8`.
- [Manifest](../provenance/bra-ket-vue.json): ten retained files, 36,333 bytes.
- [REA receipt](../provenance/bra-ket-vue.json): four TypeScript files parsed, zero failures; 32 analyzer findings.
- The three retained `.vue` files were not parsed by this REA provider. Template observations below come from direct source reading. Styles, dependencies and most components are omitted.

## What The Source Shows

The [complex legend](https://github.com/Quantum-Flytrap/bra-ket-vue/blob/f9a53be960385ab051ede43456ab971f38522cf8/src/lib-components/complex-legend.vue)
labels amplitude and phase separately. Radius is proportional to complex-number
magnitude; phase is derived with `atan2` and displayed in turns. A zero-value
selection has a separate display path. Its circle radius is not itself a
probability, and the visual encoding needs to be explained to the user.

The [ket component](https://github.com/Quantum-Flytrap/bra-ket-vue/blob/f9a53be960385ab051ede43456ab971f38522cf8/src/lib-components/ket.vue)
shows complex amplitudes with coordinate labels. The
[matrix viewer](https://github.com/Quantum-Flytrap/bra-ket-vue/blob/f9a53be960385ab051ede43456ab971f38522cf8/src/lib-components/matrix-viewer.vue)
projects operator entries into a selectable grid and derives dimension labels.
Its supporting imports were not all retained, so this is not a recovered full
component graph or a tested interaction trace.

## Reusable Mechanics

- **Semantic legend:** every color, size and position maps to a named value.
- **Inspectable selection:** selecting a mark should expose its underlying state.
- **Missing/zero state distinction:** lack of data must not look like a valid zero.

For God's Eye and Trade Invader, use the same discipline for latency, freshness,
workload and paper outcomes. Do not label a generic sentiment color as quantum
phase, or animate an agent that has no corresponding task event.

## Acceptance Checks Still Needed

Render known complex values, zero and near-zero cases, large dimensions and
keyboard-selected entries. Check label collisions, color accessibility and the
mapping between numerical and drawn values. These browser tests are NOT_RUN.

MIT notice retained. Component source does not license every downstream asset
or dependency. Refresh after encoding, coordinate transformation or engine changes.
Commercial hypothesis: domain-specific explainable visualizations with actual
acceptance fixtures; appearance alone establishes neither correctness nor demand.

Related: [Quantum Tensors](quantum-tensors.md), [glossary](quantum-glossary.md),
[mechanics](mechanics.md), [library home](index.md).
