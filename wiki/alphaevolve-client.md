# AlphaEvolve: Inspect The Client, Not An Imagined Private Engine

## Question And Coverage

What can public source establish about the boundary between cloud candidate
generation and a user-controlled evaluator?

**Stage: SOURCE_INSPECTED_SUBSET.** Four Python client/controller/model files,
README and Apache-2.0 license were manually inspected at
[`674dd5e558e917320c251c085e47fae33e1bbcff`](https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud/tree/674dd5e558e917320c251c085e47fae33e1bbcff).
The [manifest](../provenance/alphaevolve-cloud-client.json) binds this subset.
This is Google's public Cloud client, **not the complete managed AlphaEvolve
search engine**. No analyzer, cloud resource, candidate execution or inference ran.

## Observations

1. **Acquisition and evaluation submission are separate operations.** The client
   requests programs for an experiment, then sends evaluation submissions via a
   different endpoint. The submission model requires the program identity,
   evaluation and acquisition lock token. A lock token is not a benchmark score
   or deployment approval.
   [Client operations](https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud/blob/674dd5e558e917320c251c085e47fae33e1bbcff/src/alpha_evolve/client.py#L262-L301),
   [submission fields](https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud/blob/674dd5e558e917320c251c085e47fae33e1bbcff/src/alpha_evolve/models.py#L309-L323).
2. **The local worker handles a concrete lifecycle.** Sampling acquires batches
   and enqueues programs. Evaluation invokes the supplied evaluator, filters its
   output to `scores` and `insights`, and submits with the program lock token.
   The evaluated counter increments on a non-None response; that counter alone
   does not independently reproduce server-side acceptance or scientific quality.
   Queue acknowledgment runs in a finally block even after an error.
   [Sampling](https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud/blob/674dd5e558e917320c251c085e47fae33e1bbcff/src/alpha_evolve/workers.py#L80-L100),
   [evaluation lifecycle](https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud/blob/674dd5e558e917320c251c085e47fae33e1bbcff/src/alpha_evolve/workers.py#L127-L195).
3. **An idle stop is not a durable completion receipt.** The controller uses an
   unbounded asyncio queue, monitors experiment statistics and an idle timeout,
   then cancels worker tasks. Its executor shutdown uses `wait=False`. Those
   operations alone do not prove every synchronous evaluator stopped, all remote
   work stopped or every result persisted. The imported experiment stopping
   implementation is outside the inspected subset.
   [Controller](https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud/blob/674dd5e558e917320c251c085e47fae33e1bbcff/src/alpha_evolve/controller.py#L50-L146).
4. **Configuration fields do not demonstrate cost enforcement.** Models expose
   maximum program count, concurrency and duration. The inspected HTTP helpers
   do not pass an explicit request timeout. A deployment needs its own verified
   timeouts, capacity bounds, reconciliation and spending controls rather than
   inferring them from these field names.
   [Run settings](https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud/blob/674dd5e558e917320c251c085e47fae33e1bbcff/src/alpha_evolve/models.py#L69-L83),
   [HTTP helpers](https://github.com/Google-Cloud-AI/alphaevolve-on-googlecloud/blob/674dd5e558e917320c251c085e47fae33e1bbcff/src/alpha_evolve/client.py#L103-L127).

## Reusable Mechanic

[Evaluation handoff with reconciliation](mechanics.md#evaluation-handoff-with-reconciliation)
tracks acquired, queued, evaluated, submitted, acknowledged and reconciled states
independently. DreamNet could map this onto existing task and evidence contracts;
it should not create a second authority system or silently launch cloud compute.

Proposed checks: stale lock token, evaluator exception, duplicate submission,
submission timeout with uncertain server state, empty queue with active work, and
late result after cancellation. None was run against Google's service here.

## Unknowns And Rights

The managed generator, prompt sampler, program database, service-side lock
semantics and billing were not inspected or tested. A Google AI subscription
does not itself establish included access to provisioned Cloud resources.
Apache-2.0 covers this client repository; cloud terms are separate.
See the [comparison](self-improvement-comparison.md) and
[glossary](self-improvement-glossary.md).
