# MiroFish And BettaFish Pipeline Qualification

## Scope

MiroFish pin: `7657031ac01184afe2cb220f5ee3545573b5e843`.
BettaFish pin: `b67928ff1ce515dd7672408221fb1e9500d0972d`.
Seven MiroFish and five BettaFish files were retained with Git blob and SHA256
checks. Python source was read manually, not parsed by REA's JavaScript provider.
These are selected files, not complete codebase or dependency audits.

Sources: [MiroFish manifest](../provenance/mirofish-pipeline.json),
[BettaFish manifest](../provenance/bettafish-pipeline.json).

## The Actual Boundaries

The MiroFish Twitter script creates a model, generates an agent graph, creates
and resets an OASIS environment, applies initial posts, and advances selected
agents with `LLMAction`. Its optional wait loop processes later interview and
shutdown commands. That is substantially more than a character, service-health
endpoint, or fixed trading-pattern score. See the pinned
[runner](https://github.com/666ghj/MiroFish/blob/7657031ac01184afe2cb220f5ee3545573b5e843/backend/scripts/run_twitter_simulation.py).

BettaFish's QueryEngine constructs search/research nodes and runs an iterative
report workflow; ReportEngine has its own generation, validation, rendering and
storage responsibilities. An independent defensive-veto function is not evidence
that either upstream engine was imported or executed. This investigation reviews
interfaces and selected branches; it does not execute BettaFish.
[QueryEngine](https://github.com/666ghj/BettaFish/blob/b67928ff1ce515dd7672408221fb1e9500d0972d/QueryEngine/agent.py),
[ReportEngine](https://github.com/666ghj/BettaFish/blob/b67928ff1ce515dd7672408221fb1e9500d0972d/ReportEngine/agent.py).

## Findings To Reuse

1. **Check progress before chunking.** `split_text_into_chunks` accepts overlap
   without validating progress. With a long string containing no separator,
   `overlap == chunk_size` returns the next start to the same position. Our
   adapter rejects overlap greater than or equal to one quarter of chunk size,
   accounting for the function's earlier sentence-boundary cuts. The invalid
   infinite case was source-inspected, not deliberately run to exhaustion.
   [Parser](https://github.com/666ghj/MiroFish/blob/7657031ac01184afe2cb220f5ee3545573b5e843/backend/app/utils/file_parser.py).
2. **Extraction errors are not seed evidence.** `extract_from_multiple` catches
   extraction failures and inserts error text into the combined output. A caller
   needs an explicit required-input policy before passing this text to a graph
   or model. The qualified task uses one prevalidated UTF-8 text file and checks
   the resulting chunks against it. Same parser source as above.
3. **Bind the round clock.** `PlatformActionLogger.log_simulation_start` records
   total hours multiplied by two, while the runner calculates rounds using the
   configured minutes per round. Those disagree outside a thirty-minute round.
   Our task uses explicit round-start/end records, not that inferred total.
   [Logger](https://github.com/666ghj/MiroFish/blob/7657031ac01184afe2cb220f5ee3545573b5e843/backend/scripts/action_logger.py).
4. **A status file is not a heartbeat.** `check_env_alive` checks the stored status
   string but not timestamp age or process identity. A retained `alive` file is
   not proof that an agent is currently working. This is a source observation;
   no production process was crashed.
   [IPC](https://github.com/666ghj/MiroFish/blob/7657031ac01184afe2cb220f5ee3545573b5e843/backend/app/services/simulation_ipc.py).

## What Actually Ran

The private integration executed two unmodified upstream modules: the parser's
text/chunk functions and the platform action logger. A frozen historical paper
evaluation produced **five seed chunks, four recorded outcomes and six trace
rows**. Independent readback checked content, source binding and artifact hashes.
A second process reused its immutable receipt without appending rows. Cancelled
work stayed cancelled; altered artifacts/source and incomplete unreceipted work
were blocked. This is **preparation and trace retention, not an OASIS simulation**.

[Sanitized execution summary](../provenance/mirofish-preparation-execution.json).
It is a publisher-reported observation, not an independent certification. Private
inputs and the application adapter are not included. `success` on an action-log
entry is an operation flag, not evidence of profitable trading.

## Reproduce A Small Public Probe

Python 3.11 or 3.12 and Node.js 24+. No pip dependencies or credentials:

```sh
node scripts/fetch-source.mjs mirofish-pipeline --fetch
python -I -S -B scripts/mirofish-probe.py
```

The first command retrieves only pinned public files, refuses overwrites, and
does not execute them. The second explicitly executes the two hash-checked
modules with original public fixtures and an owned temporary output directory.
It does not reproduce the private paper experiment or the full model pipeline.
This public fixture also passed locally: four chunks and four trace rows,
including a deliberately recorded failure flag.
See [the probe](../scripts/mirofish-probe.py).

## DreamNet Connection And Remaining Gates

Seed preparation can feed a separately qualified graph/persona stage; paper
outcomes can be retained as labeled action traces. Existing compiler/Keeper
review candidates and read-only operator views can bind those receipts without
promoting them to truth, agent acceptance, a forecast, or live trading authority.

Full OASIS/CAMEL dependencies, a bounded working model, graph-memory access,
model-call accounting, and independent outcome evaluation remain unqualified.
The inspected backend pins `camel-oasis==0.2.5`, `camel-ai==0.2.78` and
`zep-cloud==3.25.0`; these are source requirements, not installed capabilities.
[Dependency declaration](https://github.com/666ghj/MiroFish/blob/7657031ac01184afe2cb220f5ee3545573b5e843/backend/pyproject.toml).

MiroFish carries AGPL-3.0 and BettaFish GPL-2.0 license texts. Source is retained
separately with its notices; this public wiki bundles neither source tree.
A process boundary is not a blanket copyleft exemption. Distribution, modified
network services, dependencies, and any commercial embedding need their own
license assessment. This investigation does not establish historical fork
ancestry or grant a proprietary relicensing right.
[MiroFish license](https://github.com/666ghj/MiroFish/blob/7657031ac01184afe2cb220f5ee3545573b5e843/LICENSE),
[BettaFish license](https://github.com/666ghj/BettaFish/blob/b67928ff1ce515dd7672408221fb1e9500d0972d/LICENSE).

Related: [pipeline glossary](fish-pipeline-glossary.md),
[runtime execution](runtime-execution.md), [integration map](runtime-integration.md).
