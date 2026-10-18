# Language And Runtime Glossary

| Term | Meaning Here | Important Boundary |
| --- | --- | --- |
| Type erasure | Removing type-only syntax from executable output | A declared shape is not a runtime check |
| Type assertion | A compile-time claim about an expression | It does not inspect incoming data |
| Non-null assertion | Removing nullability from the static view | A null value can still fail at runtime |
| Transpile | Transform source syntax into another executable form | Emit success is not project type-check success |
| Semantic diagnostic | A check involving the meaning/types of a program | Syntax-only diagnostics cannot replace it |
| Runtime schema | Executed validation of a value's structure | Schema validity does not prove truth or authority |
| Engine | Implementation executing language semantics | Host I/O and policies are additional surfaces |
| Host binding | Functionality the embedding application exposes | An unrestricted binding can defeat intended limits |
| Pending job | Queued engine work, including promise reactions | Progress requires the host to advance it |
| Microtask | Deferred callback processed at host-defined checkpoints | A finite observed ordering is not universal scheduling proof |
| Interrupt hook | Host callback used to stop or limit engine execution | Availability does not establish configured enforcement |
| Deadline | Latest acceptable completion time | Winning a timeout race does not cancel its loser |
| Cancellation | A request/observed signal to stop work | Prior effects are not automatically rolled back |
| Compatibility matrix | Version/API-specific behavior comparison | The same import name need not imply the same semantics |
| Durable acknowledgment | Confirmation tied to a retained result | An emitted event or in-memory promise is insufficient |
| Admission | Review permitting a bounded capability to be offered | Knowledge ingestion cannot grant execution rights |

Evidence: [TypeScript](typescript-emit.md), [QuickJS](quickjs-host.md),
[runtime documentation](runtime-portability.md), [Node events](javascript-runtimes.md).
These definitions orient investigation and proposed designs, not a new standard.
