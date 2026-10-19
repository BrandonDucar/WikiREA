# DSPy: What Gets Compiled?

## Question And Coverage

How does an optimizer turn examples, feedback and candidate programs into a
selected artifact, and what does that selection actually prove?

**Stage: SOURCE_INSPECTED_SUBSET.** Manual reading of four Python implementation
files, plus the README and MIT license, pinned at
[`2872410cef53b91d04a00e6ca017636f82ef7f6c`](https://github.com/stanfordnlp/dspy/tree/2872410cef53b91d04a00e6ca017636f82ef7f6c).
The [manifest](../provenance/dspy-optimization.json) binds the selected bytes.
No REA analyzer, dependency installation, model inference or upstream tests ran.

## Observations

1. **Compilation can assemble demonstrations rather than rewrite a compiler.**
   `BootstrapFewShot.compile` prepares student/teacher mappings, bootstraps traces
   and trains the student. `_train` assigns accepted augmented examples plus
   sampled labeled demonstrations to predictors. The `_compiled` flag records
   this operation, not independent generalization or deployment approval.
   [Compile](https://github.com/stanfordnlp/dspy/blob/2872410cef53b91d04a00e6ca017636f82ef7f6c/dspy/teleprompt/bootstrap.py#L84-L94),
   [demonstration assembly](https://github.com/stanfordnlp/dspy/blob/2872410cef53b91d04a00e6ca017636f82ef7f6c/dspy/teleprompt/bootstrap.py#L259-L272).
2. **The metric is an input, not an independent truth oracle.** In the inspected
   bootstrap path, a provided metric controls trace admission; absent a metric,
   an otherwise successful call sets success true. A threshold uses a truthiness
   branch, so a zero threshold follows the non-threshold path. These are source
   observations, not reproduced runtime cases.
   [Metric branch](https://github.com/stanfordnlp/dspy/blob/2872410cef53b91d04a00e6ca017636f82ef7f6c/dspy/teleprompt/bootstrap.py#L199-L221).
3. **MIPRO retains a baseline and distinguishes minibatch from full evaluation.**
   It evaluates the initial program, copies candidates, inserts instructions and
   demos, and records whether a score used the full validation set. Its dataset
   helper splits the supplied training list when no validation set is supplied;
   it does not establish an untouched final test set.
   [Selection](https://github.com/stanfordnlp/dspy/blob/2872410cef53b91d04a00e6ca017636f82ef7f6c/dspy/teleprompt/mipro_optimizer_v2.py#L535-L600),
   [dataset split](https://github.com/stanfordnlp/dspy/blob/2872410cef53b91d04a00e6ca017636f82ef7f6c/dspy/teleprompt/mipro_optimizer_v2.py#L319-L334).
4. **GEPA's wrapper exposes feedback and a search budget, but delegates the engine.**
   Its configuration requires exactly one budget mode. At this revision it
   discovers both instruction predictors and code-optimized Flex submodules;
   describing all DSPy optimization as prompt-only would be inaccurate. The
   external `gepa` engine and Flex helpers were not inspected here.
   [Budget configuration](https://github.com/stanfordnlp/dspy/blob/2872410cef53b91d04a00e6ca017636f82ef7f6c/dspy/teleprompt/gepa/gepa.py#L437-L465),
   [compile boundary](https://github.com/stanfordnlp/dspy/blob/2872410cef53b91d04a00e6ca017636f82ef7f6c/dspy/teleprompt/gepa/gepa.py#L545-L594).
5. **Validation is not automatically held out.** That GEPA path warns when it
   reuses the training set for validation. Repeated selection against a validation
   set also differs from a final unseen evaluation. `Evaluate` calls the program
   and metric for each example and retains failures using its failure score;
   correctness still depends on the metric and dataset.
   [Evaluation](https://github.com/stanfordnlp/dspy/blob/2872410cef53b91d04a00e6ca017636f82ef7f6c/dspy/evaluate/evaluate.py#L157-L185).

## Reusable Mechanic

[Metric-bound candidate selection](mechanics.md#metric-bound-candidate-selection)
records baseline, candidate, metric version, dataset partition and evaluation
budget separately. DreamNet could use this for prompt/skill revision, but a new
score must not edit its own acceptance rules or grant new permissions.

Proposed checks: train/test overlap, zero threshold, metric exception, missing
baseline, minibatch improvement followed by full-set regression, and an unseen
task failure. These checks are specified, not executed DSPy tests.

## Unknowns And Rights

No benchmark gain, provider cost, bill reduction, complete GEPA implementation or
safe execution of generated code was established. MIT applies to the inspected
repository; model services, datasets and imported packages have separate terms.
See the [comparison](self-improvement-comparison.md) and
[glossary](self-improvement-glossary.md).
