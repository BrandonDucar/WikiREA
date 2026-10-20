# Agent Workspaces: Persistence, Recovery And Boundaries

Observed October 20, 2026. This is a bounded external-source investigation, not
a clone of hosted assistants or a claim that a workforce acquired their powers.

## OpenBot: Actual Upstream Source

The official site links to [nightly-labs/openbot](https://github.com/nightly-labs/openbot).
Seven files were acquired at revision
`9aaa1873d3cd222200d7b26ae9b3619a1f5a0fab`, with file-size, Git blob and SHA-256
checks. [The manifest](../provenance/openbot-workspace.json) records the exact
subset. Four TypeScript files received Software MRI structural text inspection;
README, architecture and license were read separately. No dependencies, app,
upstream tests, account sessions or models were executed.

Three useful mechanics and their qualifications:

- **Wake with a bounded readiness check.** `src/main/routine-wake.ts` suspends
  routines, polls for consecutive online observations and resumes after either
  sufficient observations or a deadline. Defaults are two observations, two-second
  polling and a two-minute maximum. Deadline expiry deliberately permits resume
  even while offline; this is not a guarantee that the next external task works.
- **Retain a restart hold window.** `src/main/routine-hold-file.ts` writes the
  suspended time interval and reads it on restart. Reading attempts to delete the
  file before parsing. A deletion failure is logged but does not prevent returning
  a valid window. This alone does not prove exactly-once catch-up across repeated
  restarts. Durable task idempotency remains a separate obligation.
- **Bound a queue projection without erasing failure history.**
  `src/main/team-api/route-agent-queue.ts` keeps active deliveries, then prioritizes
  failures/interruption/cancellation within a transport-frame budget, then up to
  100 recent completed deliveries. Active entries can themselves exceed that
  budget; this source subset does not establish a hard bound for every snapshot.

The queue routes pass a delivery identifier and expected turn identifier to the
agent service when steering. They validate input presence, not the underlying
service's stale-expectation enforcement. The relevant imported backend was not
inspected. `src/main/ingress-queue-key.ts` also distinguishes loaded, newly stored,
and unavailable encrypted queue keys; imported crypto/storage helpers were not
audited. A structural scanner's empty finding list is not a security pass.

The pinned LICENSE is **PolyForm Noncommercial 1.0.0**. Publicly readable source is
not a blanket commercial-use license. No upstream implementation or target assets
are included here; review applicable terms before copying or shipping code.

## Hosted Products: Different Evidence Class

| Product | Material Reviewed | What It Supports | Still Unknown |
| --- | --- | --- | --- |
| Grok Bot | [Official bot documentation](https://docs.x.ai/grok-bot/bots) | Published role/profile and working-context interface | Private scheduler, memory implementation, model internals and actual task performance |
| Hark | [Manifesto](https://hark.com/manifesto), [Handoff article](https://hark.com/articles/introducing-hark-handoff) | Published personal-context and browser-task architecture claims | Closed implementation, claimed benchmark reproduction and account integration behavior |
| Instinct | [Official site](https://instinct.com/) | Published phone/text/computer assistant interface | Private runtime, recovery, permission checks and observed outcome quality |
| ChatGPT dots | App acquisition of the selected announcement was rejected by the upstream HTTP boundary | A failed acquisition retained as a failure | No successful app-produced source/documentation inspection in this batch |
| Muse | No authoritative product binding admitted to this batch | Identity remains unresolved | No namesake repository or platform substituted |

Documentation describes an interface or vendor claim; it does not expose private
backend code. Published contact references are source-bound review data, not
verified account ownership or outreach authorization. Individual contact details
and private machine reports are intentionally not included in this public entry.

## Reusable Acceptance Cases

Proposals, not executed adaptations:

1. Suspend a mission, restart, restore the interval and prove completed tasks do
   not execute again, including a failed hold-file deletion and a second restart.
2. Keep the network unavailable past a readiness deadline; distinguish scheduling
   resumption from successful delivery and retain the original failure.
3. Supply a stale expected-turn identifier, concurrent edits and an oversized
   active queue; require explicit rejection or a separately bounded projection.
4. Replace the model/provider while preserving agent identity and retained context;
   independently test competence rather than inheriting a prior qualification.

Map accepted mechanics into existing mission, scheduler, memory, lease, evidence
and review contracts. Do not create more agents merely to imitate product names.
Actual training, adoption, deployment and receiving-runtime acknowledgments remain
separate gates. This research establishes no revenue or subscription-credit saving.

## Glossary

| Term | Meaning |
| --- | --- |
| Agent identity | Stable owner/role identity, separate from a selected model |
| Harness | Environment coordinating context, tools, execution and recovery |
| Brain lease | Finite use of a qualified runtime/model under resource limits |
| Hold window | Interval retained for catch-up after suspension or restart |
| Readiness observation | A health signal, not successful downstream execution |
| Expected-turn guard | Rejection when an edit targets a turn that is no longer current |
| Queue projection | Bounded view of retained work, not the full durable store |
| Delivery acknowledgment | Evidence that the specified consumer received a specified version |
| Published contact reference | Address/profile found in public material, without inferred consent |
| Adaptation | New implementation subject to its own compatibility and outcome tests |

## Commercial Hypothesis

A fixed-scope queue/restart readiness review could deliver a source manifest,
reproduction cases and an explicit risk report to agent-workspace operators.
Buyer demand, pricing, rights, delivery cost and willingness to pay are untested.
Stop if authorized source and a named reviewer cannot be established. This is a
service hypothesis, not revenue evidence or permission to contact maintainers.

[Library](index.md) | [Contribution boundary](../CONTRIBUTING.md)
