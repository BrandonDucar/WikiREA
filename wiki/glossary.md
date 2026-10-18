# WikiREA Glossary

Initial vocabulary for the MediaWiki investigation and the proposed game/quantum collections. Definitions here are concise working explanations, not new implementation claims. See [MediaWiki](mediawiki.md) for scoped evidence and primary references.

## Wiki And Knowledge Terms

| Term | Meaning / Important Distinction |
| --- | --- |
| Wikipedia | The collaboratively maintained encyclopedia, not the name of its entire software stack |
| MediaWiki | The wiki application used by Wikipedia and other sites |
| Page | A named wiki record whose content can change through revisions |
| Revision | A particular version of a page; use its ID and time when binding evidence |
| Parent revision | The version from which an edit descends; useful for reconstructing change lineage |
| Title | A human-facing name, potentially including a namespace; not a substitute for a stable revision identity |
| Namespace | A division of page names/types; not automatically a tenant security boundary |
| Redirect | A pointer from one title to another; resolving it does not prove that the destination is the user's intended subject |
| Category | A grouping of pages; membership does not certify a claim |
| Template / transclusion | Reusable content included in another page; template changes can affect dependent renderings |
| Wikitext | An authored wiki markup representation, distinct from rendered HTML |
| Cite | A MediaWiki extension for reference footnotes, not an independent fact checker |
| Watchlist | A change-following feature; adding an item changes user state |
| Action API | MediaWiki's structured interface for queries and operations; read and mutation operations need separate scopes |
| Continuation | A response marker requiring another bounded request for more results; ignoring it makes coverage incomplete |
| Content slot | A revision content role/container; do not assume all content is one undifferentiated text field |
| ResourceLoader | MediaWiki's frontend resource-delivery mechanism; not fully represented by the selected JavaScript files |

These terms are explained in the linked official [architecture](https://www.mediawiki.org/wiki/Manual:MediaWiki_architecture), [revisions](https://www.mediawiki.org/wiki/API:Revisions), [categories](https://www.mediawiki.org/wiki/Help:Categories), [templates](https://www.mediawiki.org/wiki/Help:Templates), [Cite](https://www.mediawiki.org/wiki/Extension:Cite) and [API](https://www.mediawiki.org/wiki/API:Main_page) documentation. The architecture manual contains historical sections; individual current facts need version-specific checks.

## WikiREA Investigation Terms

| Term | Meaning / Important Distinction |
| --- | --- |
| Investigation entry | A question-bound explanation with sources, methods, coverage, unknowns and reproduction steps |
| REA | The upstream analysis tool; DreamNet's wrappers and the full upstream tool catalog are distinct |
| Static analysis | Inspecting target code/artifacts without executing the target |
| Runtime observation | Evidence from an actual run under stated conditions; not every possible behavior |
| Source pin | An immutable commit/artifact identity used for reproducibility |
| Evidence binding | The connection between a claim, its exact supporting material and applicable scope/time |
| Behavior contract | A specification of inputs, outputs, prerequisites and failure behavior to test |
| Reconstruction | A new implementation to compare against a finite specification; not necessarily recovered original source |
| Coverage | The explicitly inspected portion, including omitted, failed or truncated inputs |
| Unknown | A question not resolved by the available evidence; not a negative finding |
| Requalification | Rechecking a capability after relevant dependencies or assumptions change |
| Library | A linked subject collection of entries and reusable materials, not blanket rights to their targets |
| Glossary | Connected definitions with aliases and disambiguation; not a pile of names treated as equivalent |
| Outcome receipt | Evidence of a bounded completed obligation; distinct from a source-analysis receipt |

Method reference: [REA guided workflows](https://github.com/morluto/rea/blob/main/docs/mcp-prompts.md). Library terminology above is the proposed WikiREA organization, not a claim that MediaWiki implements DreamNet's evidence contracts.

## Game And Quantum Disambiguation

| Term | Meaning / Important Distinction |
| --- | --- |
| Simulation branch | An explicitly hypothetical continuation from a retained state; ordinary software can implement this |
| Historical replay | A past sequence reconstructed with point-in-time inputs; keep later information out of earlier decisions |
| Forward observation | An event recorded as it becomes available, not a historical scenario retroactively labeled live |
| Real-world mission | An actual task with authorized effects and observable outcomes; simulations cannot undo those effects |
| Game mechanic | A rule or interaction shaping play; visual decoration alone is not the mechanic |
| Quantum-inspired | A metaphor/design or specified classical technique; does not by itself use quantum hardware |
| Quantum simulation | Classical or quantum computation modeling a quantum system; record the specific backend |
| Quantum educational game | A game teaching quantum concepts; it need not execute on a quantum processor |
| Quantum game theory | A field concerning games/strategies involving quantum information; not synonymous with any game using branches |
| Quantum hardware execution | An actual device job with backend/job/results evidence; not established by a quantum-themed interface |

Quantum taxonomy starting references: [research survey](https://research.ibm.com/publications/quantum-games-and-interactive-tools-for-quantum-technologies-outreach-and-education), [definition paper](https://research.ibm.com/publications/defining-quantum-games) and [CHSH game lesson](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/chsh-game). Specific projects require their own inspection, not inference from these definitions.
