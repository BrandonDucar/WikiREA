# Herdr: a terminal appendage, not an authority layer

## Identity And Question

Herdr can be an external organ or appendage in a larger agent system. The useful
question is which implementation mechanics survive adaptation, not whether the
host should surrender its identity, evidence or permissions to another app.

This investigation separates two pinned targets:

| Library ID | Repository revision | Evidence |
| --- | --- | --- |
| `herdr-core-runtime` | [herdr-core at 4a3591a](https://github.com/herdrdev/herdr-core/tree/4a3591aa835c197f57a5d1b8e8951a75e2a79faa) | Selected Rust sections, tests, API schema and documents manually inspected |
| `herdr-app-mods` | [herdr-app at 3130e41](https://github.com/herdrdev/herdr-app/tree/3130e416ce3d1d39c83f64413728ea070a845424) | Six JavaScript mods parsed by REA 6.4.0; selected Rust host sections manually inspected |

Source package versions are core 0.1.15 and app 0.1.10. The earlier
[Herdr TUI](https://github.com/herdrdev/herdr) is a distinct implementation and
was not reconstructed here. Legacy plugins do not automatically become desktop
mods or inherit compatibility with the new core.

## Evidence And Coverage

The [core manifest](../provenance/herdr-core.json) binds 15 files. The
[app manifest](../provenance/herdr-app.json) binds 16. Each includes its exact
commit, Git blob SHA1, SHA256 and byte count. There are no upstream source bodies,
private working folders, account exports or raw machine-bound analyzer logs in
this publication.

The REA run parsed six mod files, reading 58,609 text bytes and visiting 12,390
AST nodes, with zero parse failures and no integrity contradictions. Its 110
structural findings are not 110 vulnerabilities. Native imports such as `herdr`
and `gpui-kit` were not resolved by installing or executing their runtimes.
The generic analyzer's Electron-oriented phase labels do not establish that
this native application uses Electron.

The Rust process host, terminal library, GUI backend and upstream test suites
were not executed in this study. Installation/version checks outside this study
do not establish successful workflows. Proposed host adaptations have zero
runtime qualification tests and grant no authority.

## Dissection: From UI To Process

```text
personal layout and JavaScript mod
  -> native host bindings and typed app API
  -> herdr-core request/response or event stream
  -> holder owning the terminal and child process
  -> output / reported state / process exit
  -> app projection or parent notification
```

The app is a Rust/GPUI program. The core is a different process, and holders own
the PTYs. This separation helps preserve running programs when a viewer closes
or a core handover occurs; it does not preserve a process through a reboot.
See [holder.rs](https://github.com/herdrdev/herdr-core/blob/4a3591aa835c197f57a5d1b8e8951a75e2a79faa/crates/herdr-core/src/holder.rs).

The inspected schema has 32 request methods. It includes observations, but also
process execution, file modification and machine control. An OpenRPC description
is not an MCP permission model. A host adapter must choose a subset explicitly,
not expose the whole API because its schema is machine-readable.

## Eight Extracted Mechanics

### 1. Viewer-independent process ownership

The holder owns PTYs, reads output and retains a bounded output tail independently
of a viewer. Reuse the separation between presentation and execution ownership;
do not infer a task completed because the window reopened.

Sources: `crates/herdr-core/src/holder.rs`, `schema/README.md`.
Proposed checks: viewer loss, core handover, stale holder identity and actual exit.

### 2. Serialized input with a human quiet gate

`type_in` takes a per-terminal queue lock, waits after human typing, prepares its
input against current state, and holds concurrent human keystrokes during the
agent's batch. This is a concrete way to avoid interleaved terminal input.

`send` normally refuses a reported blocked program, but has a `force` parameter.
That escape is not a host approval. A DreamNet adapter must reject force-through
attempts on permission prompts rather than treating the flag as consent.

Source: [input.rs](https://github.com/herdrdev/herdr-core/blob/4a3591aa835c197f57a5d1b8e8951a75e2a79faa/crates/herdr-core/src/input.rs).

### 3. Turn-aware waiting and report bookkeeping

Waiting can bind to the turn started by a caller's last send. A timeout retains
that binding, while completion clears it unless a newer send replaced it.
Parent notes use seen/noted news counters and defer delivery when the parent is
reported blocked. Typing a report is transport, not evidence acceptance or a
cryptographically authenticated reviewer verdict.

Sources: `crates/herdr-core/src/api/waiting.rs`, `crates/herdr-core/src/notes.rs`.

### 4. Compare-and-swap state with persistence rollback

`doc.set` checks a supplied version under the core lock, increments it, persists
atomically and restores prior in-memory state if persistence fails. Stale writers
receive a conflict instead of silently overwriting a newer value. Null values
retain the advancing version. This protects shared state updates, not append-only
historical provenance.

Source: [doc.rs](https://github.com/herdrdev/herdr-core/blob/4a3591aa835c197f57a5d1b8e8951a75e2a79faa/crates/herdr-core/src/api/doc.rs).
The inspected `tests/docs.rs` covers competing writers and restart persistence;
reading those tests is not a passing execution receipt.

### 5. Snapshot reconciliation after missed events

Subscribers receive sequence-numbered updates. Slow subscribers can receive a
fresh snapshot and a missed-event signal instead of an unbounded backlog. Sequence
numbers are process-scoped, so reconnect requires a new snapshot. Document values
must be refetched separately. This is not durable exactly-once business delivery.

Sources: `crates/herdr-core/src/events.rs`, `schema/README.md`.

### 6. Recovery without replaying the old task

Kept terminal recovery chooses a shell and suitable folder, clears prior program
status, claims and saves the record before spawning, and backs off on failure.
It does not blindly rerun the original task command. That distinction is valuable
when a task might have already published, charged or written before losing its
connection.

Source: [kept.rs](https://github.com/herdrdev/herdr-core/blob/4a3591aa835c197f57a5d1b8e8951a75e2a79faa/crates/herdr-core/src/kept.rs).

### 7. Reject stale asynchronous UI results

The Changes mod captures its repository/machine context and checks it after
asynchronous reads, so a slow response from one checkout is not displayed as the
state of another. Its Git read flags also avoid optional index-refresh writes
that would retrigger its own folder watcher. This is useful for multi-repository
operator panels, not a guarantee against every stale rendering path.

Source: [Changes mod](https://github.com/herdrdev/herdr-app/blob/3130e416ce3d1d39c83f64413728ea070a845424/defaults/mods/changes/main.js).

### 8. Personal UI copies and explicit reload errors

The API supports cloning shipped layouts and mods, preserving clone lineage;
personal copies and shipped files have different update behavior. The host watches
files and records reload errors. A readable previous screen is not proof the new
code loaded. Inspect current errors and source version before claiming adoption.

Sources: `defaults/herdr.d.ts`, `src/window.rs`, `src/files.rs`.

## Trust Boundary

Core API access is account-level command access, not an agent sandbox. Mods are
trusted executable code, including their remote-machine actions. Neither a
worktree, a named session nor a blocked status provides isolation. Never expose a
raw core endpoint to an untrusted agent or treat a writable UI as an approval
broker. See [core trust](https://github.com/herdrdev/herdr-core/blob/4a3591aa835c197f57a5d1b8e8951a75e2a79faa/docs/security.md)
and [app privacy](https://github.com/herdrdev/herdr-app/blob/3130e416ce3d1d39c83f64413728ea070a845424/docs/security.md).

The program table contains Muse and Ollama display entries without launch
commands. This is not evidence of a browser/phone integration, credential binding
or model entitlement. A running terminal agent also does not imply shared memory
with another account or chat.

## Hybridization Into Existing Hosts

These are proposed attachments, not new control centers or deployed capabilities:

| Mechanic | Existing DreamNet consumer | Boundary to retain |
| --- | --- | --- |
| Detached ownership and non-replaying recovery | Durable worker / WorkClaw task execution | Bind terminal instance, task and source; never retry an unknown side effect blindly |
| Serialized input and turn-aware waits | Existing mission handoff / agent task harness | No prompt acceptance or authority inheritance through a report |
| Version-checked state | Keeper / compiler projections | GitRiver source lineage stays separate from a mutable UI document |
| Reconnect snapshot | Existing integration and observation adapters | Mark gaps; refetch instead of inventing successful delivery |
| Repository-context guard | GitGuardian and PR review surfaces | A result must match repository, branch, source digest and requested review |
| Editable personal UI | Existing app stewards | Independently review executable changes; retain rollback and provenance |

The host controls budgets, leases and execution admission outside the UI. Worker
reports lead to existing tests and WorkEvidence/Proof Drops; reviewed artifacts
can then enter the existing GitRiver and memory projections. A UI status cannot
make itself the host's truth or approve its own next action. Related studies:
[agent workspaces](agent-workspaces.md), [runtime integration](runtime-integration.md)
and [self-improvement comparison](self-improvement-comparison.md).

## Reproduction And Invalidation

Use `node scripts/fetch-source.mjs herdr-app-mods` to inspect the fetch plan, then
add `--fetch` to retrieve only exact manifest files. Run REA separately against
the collector's JS-only analysis input, following [provenance](../PROVENANCE.md).
Core Rust files are manual inspection material, not JavaScript parser inputs.

Required adaptation tests include concurrent input, a blocked approval prompt,
an old turn versus a new turn, a failed state write, a stale version, a missed
stream event, a restarted process with reused address, a late old-repository
response, and a failed mod reload. Current result: **NOT_RUN for host adaptations**.

A new upstream commit, changed selected bytes, API generation change, model/CLI
route change, host policy change or changed evaluator invalidates the applicable
qualification. Refresh source and tests; do not merely update a timestamp.

## Rights, Unknowns And Commercial Hypothesis

Selected upstream licenses are Apache-2.0. WikiREA publishes original explanations
and references, not those implementations or assets. The public wiki's CC BY 4.0
documentation terms do not relicense Herdr or its dependencies. No affiliation,
full reconstruction or security certification is claimed.

Unknowns include resource usage on a particular host, complete renderer/PTY
behavior, third-party mod safety, remote access enforcement in each deployment,
and measured improvement over an existing operator workflow.

A possible paid deliverable is a configured, evidence-linked developer workspace
that reduces manual handoffs. Demand, price and savings are unmeasured. Stop if a
bounded pilot cannot improve attributable task completion without broader access,
uncontrolled retries or a second competing authority system.

## Bounded Execution-Adapter Qualification And NVIDIA/FlashAlign Fact Matrix (2026-10-31)

An isolated disposable-worktree qualification run verified `herdr-core 0.1.15` (`4a3591aa835c197f57a5d1b8e8951a75e2a79faa`) as a local execution transport under existing DreamNet `WorkClaw`/`GitGrid`, `AgentTaskHarness`, `WorkEvidence`, and `RepositoryTaskLedger` contracts:

- **OSC 7501 `done` Is Not Acceptance:** A terminal emitting `\x1b]7501;state=done\x1b\\` (`crates/herdr-core/src/status.rs`) is treated strictly as a transport turn hint. Task acceptance requires an independent reviewer terminal to verify exit code `0`, pinned source commit, changed-path scope, artifact SHA-256 digest, and receiver acknowledgment.
- **Blocked Permission Guard at the RPC Boundary:** When a program reports `state=blocked:kind=permission`, `herdr-core` refuses `terminal.send` unless `force: true`, and the DreamNet RPC client policy blocks `force: true` inside `HerdrRpcClient.call()` so permission prompts are never auto-approved.
- **Kept-Terminal Non-Replay & Sequence-Reset Reconciliation:** On core restart, `kept.rs` spawns a fresh shell (`t.argv = shell.clone()`) rather than re-running the original task command, preventing silent duplicate execution; subscribers detect `seq` reset via `reconnectAndResync()` and refetch authoritative state via `events.subscribe` + `doc.get`.
- **NVIDIA / FlashAlign / AGPL Fact Corrections:** Hosted NVIDIA endpoints (`integrate.api.nvidia.com`) are metered external APIs, not self-hosted runtimes; NIM LoRA support (`vLLM` dynamic vs `TensorRT-LLM` engine-constrained) is not a superset of inference-time activation steering / FlashAlign methods; NVIDIA Dynamo v1.2.0 documents KV router trees partitioned by `(model_name, tenant_id)` and optional per-request `cache_salt` hashing with backend-specific limitations, so DreamNet treats Dynamo routing as non-self-certifying and requires tenant `cache_salt` and storage isolation to be verified per deployment (missing evidence is an unqualified deployment, not a reproduced cross-tenant leak); DreamNet policy requires evaluating refusal behavior, task accuracy, calibration, tool-call conformance, and prompt-injection resistance on separate slices rather than collapsing them into one alignment score; and placing a component behind an HTTP sidecar does not automatically cure AGPLv3 Section 13 network-use or distribution obligations (whereas first-party `herdr-core` and `herdr-app` are Apache-2.0).
