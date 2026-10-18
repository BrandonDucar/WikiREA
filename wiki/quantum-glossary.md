# Quantum And Simulation Glossary

These definitions support the four inspected project entries. They do not imply
that DreamNet executes on quantum hardware or predicts future events.

## Numerical Terms

| Term | Plain-Language Meaning | Investigation |
| --- | --- | --- |
| Amplitude | A complex coefficient associated with a basis state; not a probability by itself | [Tensors](quantum-tensors.md) |
| Probability | For a basis-state measurement of a normalized pure state, the corresponding amplitude's squared magnitude | [Tensors](quantum-tensors.md) |
| Phase | The angular component of a complex amplitude; the inspected legend uses atan2 | [BraKetVue](bra-ket-vue.md) |
| State vector | A complex vector with unit squared norm representing a pure quantum state | [Tensors](quantum-tensors.md) |
| Basis | The reference coordinates used to express a state or operator | [Tensors](quantum-tensors.md) |
| Qubit | A quantum system represented with two basis states | [Tensors](quantum-tensors.md) |
| Superposition | A linear combination of basis states, not simply a list of possible business futures | [Tensors](quantum-tensors.md) |
| Normalization | Scaling a nonzero state to unit norm; zero-state behavior needs explicit tests | [Tensors](quantum-tensors.md) |
| Named dimension | An axis with identity, size and coordinate labels; order matters for compatibility | [Tensors](quantum-tensors.md) |
| Projection | An operation used to isolate components of a state for the selected measurement model | [Tensors](quantum-tensors.md) |
| Measurement branch | A labeled resulting state with a weight; distinct from sampling one branch | [Tensors](quantum-tensors.md) |
| Ket | A notation and, in BraKetVue, a visual presentation of state components | [BraKetVue](bra-ket-vue.md) |
| Operator | A map represented in the selected library by structured matrix entries and dimensions | [BraKetVue](bra-ket-vue.md) |

The core state/amplitude/probability distinctions above follow
[IBM's quantum-state explanation](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information).
Implementation-specific details are linked to the pinned investigations, not
claimed to be universal properties of every engine.

## Play And Evidence Terms

| Term | Meaning In This Library | Boundary |
| --- | --- | --- |
| Goal threshold | A required measured value at a goal location | Game condition, not a customer acceptance contract until adapted |
| Safety threshold | A separate maximum tolerated value at a hazard | Not automatically a real-world financial or appliance policy |
| Playhead | A cursor over retained simulation frames | Moving it does not undo an external action |
| Interpolation | Smoothing between retained states for display | New display positions are not new observations |
| Checkpoint | Saved progress and its relevant state | Not automatically a verified completion or a crash-safe transaction |
| Achievement | A completion marker | Must not substitute for evidence-bound acceptance |
| Branch ledger | Our proposed retained record of scenarios, inputs and outcomes | Reusable design candidate, not existing active DreamNet infrastructure |
| Seeded replay | Repeating a random sequence under a retained seed | Requires an injectable/controlled random source and pinned inputs |
| Counterfactual | A result under altered assumptions | Not an observation from the future |
| Distribution objective | A condition evaluated over an outcome distribution | A selected successful sample cannot establish it |
| Quantum-inspired | A design analogy drawing on quantum concepts | Not evidence of quantum computation or advantage |
| Physics validation | Checking numerical behavior against a qualified reference | Neither parser success nor attractive visuals establish it |

Navigation: [library home](index.md), [mechanics](mechanics.md),
[finance glossary](finance-glossary.md), [investigation glossary](glossary.md).
