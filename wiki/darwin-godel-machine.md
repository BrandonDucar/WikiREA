# Darwin Godel Machine: Archive Is Not Improvement

## Question And Coverage

How does a coding agent produce descendants, evaluate them and retain search
history without every retained descendant being an improvement?

**Stage: SOURCE_INSPECTED_SUBSET.** Three Python implementation files, README
and Apache-2.0 license were manually inspected at
[`a565fd2d1dca504ef5104a7cc0f3bdc4ab9b4fd2`](https://github.com/jennyzzt/dgm/tree/a565fd2d1dca504ef5104a7cc0f3bdc4ab9b4fd2).
The [manifest](../provenance/darwin-godel-machine.json) records exact hashes.
No REA analyzer, Docker run, package installation, agent call or benchmark ran.

## Observations

1. **The outer search retains lineage.** It submits self-improvement work with a
   parent commit and evaluation task lists, filters returned attempts, updates an
   archive and writes generation metadata separating children from compiled
   children. Imported filtering helpers were not inspected, so their full
   acceptance meaning remains unknown.
   [Outer loop](https://github.com/jennyzzt/dgm/blob/a565fd2d1dca504ef5104a7cc0f3bdc4ab9b4fd2/DGM_outer.py#L280-L332),
   [filter boundary](https://github.com/jennyzzt/dgm/blob/a565fd2d1dca504ef5104a7cc0f3bdc4ab9b4fd2/DGM_outer.py#L152-L165).
2. **Archive membership is search retention, not certification.** `update_archive`
   defaults to `keep_all`. Its `keep_better` branch compares against the initial
   score minus noise leeway, not necessarily the selected parent's score or the
   current champion. This can be useful for exploration without establishing a
   monotonic improvement guarantee.
   [Archive policy](https://github.com/jennyzzt/dgm/blob/a565fd2d1dca504ef5104a7cc0f3bdc4ab9b4fd2/DGM_outer.py#L167-L190).
3. **Patch existence is one gate, not the result.** The improvement step retrieves
   a patch, checks that it exists and contains non-whitespace text, then invokes
   SWE or Polyglot harness functions. Merely observing a patch file cannot prove
   those harnesses passed. Their implementations are outside this subset.
   [Patch and harness dispatch](https://github.com/jennyzzt/dgm/blob/a565fd2d1dca504ef5104a7cc0f3bdc4ab9b4fd2/self_improve_step.py#L361-L399).
4. **A model-readable test report needs underlying execution evidence.** The
   inspected coding-agent method asks an agent to run regression tests and
   converts its message history into a report via an imported helper. This
   observation neither proves tests were skipped nor independently proves they
   executed. A consumer needs the actual command/result binding.
   [Report path](https://github.com/jennyzzt/dgm/blob/a565fd2d1dca504ef5104a7cc0f3bdc4ab9b4fd2/coding_agent.py#L124-L151).
5. **Running the project is materially different from reading it.** The selected
   improvement path installs requirements inside a container and invokes agents
   and evaluation harnesses. None of those operations was performed for this
   investigation. A container label alone is not an egress or spending policy.
   [Dependency installation](https://github.com/jennyzzt/dgm/blob/a565fd2d1dca504ef5104a7cc0f3bdc4ab9b4fd2/self_improve_step.py#L311-L318).

## Reusable Mechanic

[Lineage archive with separate promotion](mechanics.md#lineage-archive-with-separate-promotion)
retains failed, novel and promising descendants without equating retention with
trust. DreamNet's simulation branches and compiler proposals could reuse this
separation while leaving authority and deployment admission unchanged.

Proposed checks: inferior child retained for exploration; missing patch; baseline
changed between evaluations; model report without command output; reused test
set; champion regression; interrupted evaluation. These are adaptation proposals,
not reproduced DGM results.

## Unknowns And Rights

No self-improvement gain, benchmark replication, complete sandbox audit or
production autonomy was established. Apache-2.0 covers this repository, not every
benchmark dataset, model service or external dependency. The term Godel in the
project name does not establish a formal proof of improvement.
See the [comparison](self-improvement-comparison.md) and
[glossary](self-improvement-glossary.md).
