# Fish Pipeline Glossary

| Term | Meaning And Boundary |
| --- | --- |
| Seed material | Input used to prepare a scenario; its origin, cutoff and omissions still matter. |
| Chunk progress | Every iteration must advance past its previous start; overlap cannot defeat termination. |
| Extraction failure | A missing/unreadable input, not useful evidence merely because its error became text. |
| Persona | A behavioral description, not a running agent or authenticated identity. |
| Agent graph | A set of agents and relations in a particular simulation; not necessarily a production workforce. |
| OASIS | The social-interaction engine used by the inspected MiroFish runner; not the parser/logger alone. |
| Manual action | An explicitly specified environment action; not evidence of autonomous model choice. |
| LLMAction | A model-driven action request whose actual calls and effects need separate accounting. |
| Round clock | Duration and ordering of simulation steps, separate from wall time and log-write timestamps. |
| Action trace | Records of attempted/performed actions; its schema does not independently prove the underlying events. |
| Liveness binding | Fresh observation tied to a particular process/session, not an old `alive` string. |
| Receipt replay | Readback of an already retained result without repeating effects; not replaying the entire simulator. |
| Incomplete run | Effects/artifacts without a valid final receipt; requires reconciliation before another append. |
| Component qualification | Tested behavior of named source functions, not parity with an entire upstream application. |
| Import lineage | Exact evidence relating retained code to an upstream revision; a shared name is insufficient. |

See [the source-bound investigation](fish-pipeline.md) and
[general evidence terms](glossary.md).
