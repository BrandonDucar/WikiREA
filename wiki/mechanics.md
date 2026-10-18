# Reusable Mechanics

These fourteen behavior patterns are source-backed **specification candidates**. They
are not copied upstream modules, tested DreamNet integrations or execution grants.
Each machine-readable record in [mechanics.json](../mechanics.json) names the exact
catalog entry and retained source path from which it was derived, plus inputs,
outputs, constraints and acceptance cases. Complete generic adaptations remain
unqualified; the [runtime follow-up](runtime-execution.md) separately tests a
partial private sensitivity-worker implementation, not every acceptance case here.

| Mechanic | What To Reuse | Candidate Consumer | Required Check |
| --- | --- | --- | --- |
| Goal plus safety gate | Objectives and hard constraints evaluated independently | University / mission completion | Missing evidence cannot pass; check threshold boundaries |
| Bounded playhead | Pause, step and seek over retained history | Trade Invader / Gods Eye | Empty history, end bounds and isolation from live actions |
| Named state dimensions | Explicit identity, units and axis ordering | Agent-chain compiler / scenario inputs | Reject incompatible dimensions before composition |
| Branch ledger | Retain every named outcome and weight before selection | Fish / MiroDream experiments | Reproducible sampling, trial retention and input hashes |
| Semantic state legend | Inspectable marks with defined numerical meaning | Gods Eye / Trade Invader | Known-value rendering, zero/missing separation, accessibility |
| Checkpoint versus achievement | Save work separately from a completion marker | Durable worker / University | Atomic/versioned restore and independently verified completion |
| Distribution objective | Judge the outcome distribution instead of a lucky sample | Scenario evaluation / paper research | Retain losing trials and evaluate held-out data |
| Explicit historical correction | Separate live appends from updates to old observations | Market Compiler / Trade Invader | Delayed bars, duplicates and correction rules |
| Connection versus completeness | A connected transport does not establish a gap-free feed | Market Compiler | Disconnect, reconnect, backfill and duplicate handling |
| Typed event time | Normalize each event's time units and preserve its meaning | Market Compiler / receipt replay | Millisecond/nanosecond fixtures and receive-time separation |
| Separate emit, check, parse and authorize | Preserve four distinct outcomes instead of inferring one from another | KnowledgeCompiler / runtime admission | Semantic errors, wrong input shapes, stale evidence and missing authority |
| Budgeted host pump | Advance bounded jobs and acknowledge only retained results | Worker / scenario runner | Rejections, finite budgets, late effects and restart boundaries |
| Required inputs and chunk progress | Reject failed seed extraction and non-advancing iteration | MiroDream preparation / compiler ingestion | Required-file failure, invalid overlap and sentence-boundary progress |
| Simulation clock and liveness | Keep round duration, record time and current worker identity distinct | Fish / Trade Invader / Gods Eye | Alternate round sizes, stale alive files and restarted sessions |

## How It Plugs Into DreamNet

The proposed path is retained source -> investigation -> behavior specification ->
bounded fixture tests -> existing KnowledgeCompiler/Keeper review -> consumer
integration -> independent outcome receipt. This folder supplies the first three
steps and local binding checks, not the later production or authority stages.

For an agent chain, each link needs explicit input/output contracts, evidence
freshness and failure handling. Matching glossary terms is insufficient to prove
two components compose correctly. A generated adaptation must retain lineage and
test results; permission is evaluated separately at execution time.

## Combining Patterns

**Paper mission replay:** typed feed times + historical correction + bounded
playhead + semantic legend. The display can explain what Jaggy saw and decided,
while replay cannot place a live order.

**Practice with consequences:** named inputs + retained scenario branches +
distribution objectives + a safety gate. Score requirements actually satisfied,
not visual activity or arbitrary XP. Future scenarios stay labeled hypothetical.

**Resume a mission:** versioned checkpoint + original evidence references +
completion verification. Restoring progress must neither repeat external sends
nor treat a stale achievement as current proof.

These combinations are design hypotheses. No claim of novelty, live deployment,
learning gain, trading edge or customer savings is established here.

The [runtime integration map](runtime-integration.md) connects the new findings
to existing consumers. Original Node probes test individual host behaviors, not
complete adaptations of these mechanics.
The [Fish follow-up](fish-pipeline.md) qualifies one preparation/trace subset;
it does not qualify the complete generic patterns or an OASIS simulation.

Navigation: [library home](index.md), [quantum terms](quantum-glossary.md),
[finance investigations](finance-first-pass.md), [target shortlist](../TARGETS.md).
