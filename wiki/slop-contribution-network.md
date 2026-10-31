# SLOP: accepted work, versioned rules and payment evidence

## Question And Identity

Which parts of SLOP's contribution workflow are useful to an agent team without
confusing generated output, maintainer acceptance and actual payment?

This is a bounded source inspection of
[SlopDotCash/slopdotcash at a7e6b0f](https://github.com/SlopDotCash/slopdotcash/tree/a7e6b0fab2f767e14dbbd77021d98351e9470ba5),
observed on 2026-10-31. The [source manifest](../provenance/slop-contribution-network.json)
pins 14 public files: 194,780 bytes, each checked against its Git blob SHA1 and
recorded with SHA256. No target code, installer, payment process, model or upstream
test suite was executed. This is not a completed whole-repository reconstruction,
penetration test, deployed-service audit or financial verification.

The root license is MIT. This page is an original explanation, not a copy of
SLOP's implementation. Dependencies, hosted services, contribution terms and
trademarks have separate conditions.

## What The Product Does

The inspected README describes a GitHub-native network for open-source
contributions. Project rules define eligible work, maintainers decide acceptance,
and accepted outcomes can earn Points and an allocation from a project pool.
Commit volume and token consumption are not themselves delivered value.

The same README distinguishes projected, under-review, approved, scheduled,
paid and unresolved payment states. An estimate is not wages, an approved award
is not a transfer, and a public receipt is not evidence of another system's
acceptance. Availability, project terms and live funding require fresh checks.

## Source Trace

```text
repository identity + project rules
  -> immutable project revision and generated contributor skill
  -> bounded contribution under repository-specific scope
  -> GitHub pull request and maintainer acceptance
  -> scoring / allocation under the applicable policy
  -> separately authorized payment attempt
  -> independent finalized-chain reconciliation
```

This is a cross-file architecture trace, not an executed end-to-end journey.
The selected files do not establish the completeness or correctness of scoring,
webhook delivery, contract execution or production deployment.

## Six Reusable Mechanics

### 1. A revisioned rule source, not competing inventories

[`backend/projects/contracts.ts`](https://github.com/SlopDotCash/slopdotcash/blob/a7e6b0fab2f767e14dbbd77021d98351e9470ba5/backend/projects/contracts.ts)
defines exact manifest bytes and digests, append-only revisions, and writes bound
to the expected revision and enforcement generation. The README identifies D1
as the registry authority. Generated pages and skills are projections.

Proposed reuse: bind a research task to one catalog revision and reject stale
updates. Keep human-readable wiki pages and other coordination views derived
from that binding rather than creating a second authoritative task list.

### 2. Public identity is not repository authority

The project contract distinguishes matching public repository facts from the
permission read. [`repository-access.ts`](https://github.com/SlopDotCash/slopdotcash/blob/a7e6b0fab2f767e14dbbd77021d98351e9470ba5/backend/projects/repository-access.ts)
uses the Slopbot service for that read and rejects a missing service or a failed
response. This is evidence of a boundary in the inspected source, not proof of
all authorization behavior across the application.

Proposed reuse: a team member's identity, source hash or catalog membership must
not silently grant publishing, merging or repository administration permission.

### 3. Generated skills carry bounded work contracts

The [contributor template](https://github.com/SlopDotCash/slopdotcash/blob/a7e6b0fab2f767e14dbbd77021d98351e9470ba5/skills/project-contributor-template/SKILL.md)
combines registry-specific scope with the target repository's rules. It separates
source text from authority, asks contributors to inspect risky hooks before
execution, and excludes duplicate or unapproved work. The authority script binds
installed files to source and manifest digests. These checks do not constitute
an operating-system sandbox.

Proposed reuse: compile team instructions from approved task rules. Keep a task's
input version, evidence obligations, allowed operations and stop conditions
explicit. Do not install a remote skill merely because it has a convincing name.

### 4. Ambiguous dispatch is retained, not blindly retried

[`dispatch.ts`](https://github.com/SlopDotCash/slopdotcash/blob/a7e6b0fab2f767e14dbbd77021d98351e9470ba5/backend/payments/dispatch.ts)
claims an outbox lease, persists an attempt before submission, supplies an
idempotency key, and retains uncertain submission as `unknown`. Existing
prepared, unknown or submitted attempts affect later dispatch. This is a useful
recovery design, not a universal exactly-once guarantee: the executor and
reconciliation boundary matter too.

Proposed reuse outside payments: preserve an uncertain publication or message
attempt and reconcile the receiver before repeating the external effect.
Test crashes before submission, after submission and before local acknowledgment.

### 5. Finalized evidence is a separate promotion step

[`ledger.ts`](https://github.com/SlopDotCash/slopdotcash/blob/a7e6b0fab2f767e14dbbd77021d98351e9470ba5/backend/payments/ledger.ts)
requires an adapter to fetch canonical finalized chain evidence, checks stored
facts and handles conflicting or duplicate records before changing obligation
state. [`chain-awards.ts`](https://github.com/SlopDotCash/slopdotcash/blob/a7e6b0fab2f767e14dbbd77021d98351e9470ba5/backend/payments/chain-awards.ts)
matches actor, gross amount and fee instead of trusting a public source digest
alone. The inspected adapter interface is not proof that every deployed adapter
performs those checks correctly.

Proposed reuse: distinguish task execution, reviewer acceptance, publication and
measured outcome. A generated identifier or self-reported success cannot promote
any of these states by itself.

### 6. Usage provenance and private traces are separate disclosures

The contributor template provides a lightweight PR-opened record that does not
upload a trace. `run-receipt.mjs` also contains a distinct permanent private-trace
upload path. A device signature or a file hash proves neither the truth of a
claim nor the safety of disclosing its contents.

Proposed reuse: prefer minimal, reviewed evidence. Never export a private
conversation, source tree or credential-bearing trace as a default side effect
of contributing. Inspect effective terms and obtain specific disclosure consent.
Neither uploader nor signing flow was executed in this investigation.

## Where Dreamneti Teams Fit

A WikiREA team can be DreamNet-scoped: researchers, builders, reviewers and
editors can use the host's existing memory, capability resolution, compilers and
evidence routes. WikiREA is its public evidence product, not a replacement agent
runtime. These are proposed host integrations; this page activates none.

Make capabilities discoverable broadly but execute them only through qualified,
mission-scoped routes. A useful first qualification is one pinned source task,
one attributable worker result, independent review, a sanitized publication diff
and a publication receipt. A role packet or an agent roster alone is not that
qualification. See the [existing contributor contracts](contributors.md).

## Adoption Order And Checks

1. Reuse version-bound tasks, source manifests and explicit evidence states.
2. Qualify one host dispatch and return path before starting a larger team.
3. Exercise stale revisions, duplicate returns and uncertain external delivery.
4. Keep financial actions, private uploads and live-target security testing out
   of the initial research lane.
5. Before contributing upstream, re-read that project's current rules, eligible
   scope and existing work. Do not assume a generated generic skill resolves
   conflicting or newer repository-specific requirements.

The selected root configuration uses Cloudflare Workers, D1 and R2 bindings.
That is useful architectural overlap for an existing Cloudflare host; it is not
a cost estimate, deployed parity check or permission to provision resources.

## Limits And Open Questions

- No upstream tests, contract tests, live model calls or production workflows ran.
- The source corpus is a subset; scoring engines, identity attesters, complete
  chain adapters and scanner enforcement were not fully reviewed.
- Older protocol documents and current product rules need effective-date
  reconciliation before being treated as financial policy.
- Paid contribution eligibility, available pools and service acceptance remain
  unverified. No earnings, payout or token-investment recommendation is made.
- No new vulnerability is asserted, and no integration was installed or activated.

## Attribution

SLOP source and documentation: Slop Cash and contributors, MIT root license at the
pinned revision. Eliza and SLOP project names remain their respective owners'
marks. WikiREA is independent and does not claim affiliation or endorsement.
