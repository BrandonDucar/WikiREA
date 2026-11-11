# WikiREA Worker Operations

The [app](https://BrandonDucar.github.io/WikiREA/) is a static, searchable wiki.
The [research workflow](../.github/workflows/research.yml) executes ten persistent
roles on GitHub's standard hosted runner. They take turns; these are not ten
simultaneously resident models. The schedule runs at minutes 7 and 37 each hour,
with one job per tick. Manual dispatch supports batches of 1, 2 or 10 roles.
GitHub schedules can be delayed and are not a real-time or availability guarantee.
Scheduled workflows in inactive public repositories can be disabled by GitHub.

## What A Worker Actually Does

1. Select an unused topic from its seeds or discovered follow-up queue, fairly
   prioritizing roles with fewer jobs that UTC day.
2. Commit a unique reservation before model work. A fifteen-minute lease,
   serialized workflow and topic deduplication prevent overlapping claims.
3. Read an exact English Wikipedia revision, retaining revision, full-text hash,
   inspected-excerpt hash, observation time and coverage. At most 14,000 source
   characters enter the model context. Source bodies are not republished.
4. Request an original mechanism explanation from the configured free writer.
   The WikiREA packet compiler validates and stores it as `UNREVIEWED_RESEARCH`,
   proof level `P0`, with source pins, a compiler source digest, an artifact digest
   and an explicit no-target-execution test record. Exact readback is checked
   before the next stage. Compiling does not grant publication approval.
5. Ask a different configured free model to consume that exact compiled draft and check it against the same
   excerpt. The reviewer can reject unsupported claims. This is a separate model
   check through a shared provider, not independent human verification.
6. Retain the entry and both generation receipts. Only `COMPLETED` entries appear
   as automated research notes. `REVIEW_HELD` remains available for inspection in
   the repository. Failures, rate limits and uncertain interruptions remain in
   the worker ledger. The website shows each role's latest actual outcome.
7. Enqueue source-linked follow-up topics and publish an updated static edition.

The initial automatic adapter provides encyclopedia-based mechanism research.
The maintained catalog separately contains pinned code and official-documentation
studies. Automated notes do not establish physical teardown, proprietary access,
target execution, independent verification or permission to use a design.

## Zero Incremental Spending

[Configuration](../research/config.json) enforces a zero-dollar ceiling, at most
20 jobs per UTC day, two jobs per role per day, and two model calls per job.
Reservations count against the cap even when interrupted. Both research and
senior model review use the owner's existing NVIDIA Developer Program research
allowance at the exact hosted endpoint and qualified model IDs. Nemotron 3.5
Lightning writes the research; Nemotron 3 Ultra reviews the compiled packet.
Neither stage buys capacity or has a paid fallback. The site is a published
research library; visitors do not invoke a NIM API or submit inference jobs.
Developer access is not claimed as an Enterprise production license.

NVIDIA does not report monetary cost in its response; that field remains unknown,
with free research access recorded as its cost basis. It is never fabricated as
a provider-reported zero. Rate limits and account restrictions stop work.

If an earlier review failed in transport or parsing, a newly qualified review
route can consume the retained compiled packet without repeating its research.
There are at most ten such senior reviews per UTC day, one attempt per packet
and route binding, with a separate committed reservation and receipt. Actual
factual rejections are not automatically reviewed again. The original failed
attempt remains in the ledger even if a later senior review accepts publication.
The two models share a vendor, so review is not independent human verification.

Existing public-repository standard GitHub Actions and GitHub Pages capacity
host the service. No premium runner, private-repository minutes, new domain or
new provider subscription is provisioned. Never change runner or provider tier
without requalifying the zero-dollar boundary.

## Deploy And Verify

Use Node.js 24 or newer; no npm dependencies are installed.

```sh
node --test scripts/*.test.mjs
node scripts/research.mjs --verify
node scripts/verify.mjs
node scripts/build-site.mjs
```

The existing research key is installed only as the repository Actions secret
`NVIDIA_API_KEY`. It is never included in the public app or source.
The Pages repository build type is `workflow`. The publication workflow verifies
the release and builds the app before deploying its artifact. Research commits
use the repository token; an explicit Pages dispatch publishes their outcomes.

For a local finite run, set `NVIDIA_API_KEY` securely and use the same unique
`GITHUB_RUN_ID` for reservation and work. Do not run concurrent local writers
against the same checkout. The GitHub workflow is the supported production writer.

```sh
node scripts/research.mjs --reserve 1
node scripts/research.mjs --reserve-reviews 1
node scripts/research.mjs --work
node scripts/research.mjs --review-packets
node scripts/verify.mjs --refresh-manifest
node scripts/build-site.mjs
```

Audit [the job ledger](../research/state.json), matching entry, source pins and
both inference receipts. A configured schedule is not proof of future execution.
Check Actions runs and public `data.json` for the exact deployed edition.
The site consumes no provider credentials and issues no inference requests.

## Pause, Repair And Roll Back

Disable **WikiREA research workers** in the repository's Actions tab to stop
future research dispatches. Cancel an active run only when necessary; its durable
reservation may become `INTERRUPTED_UNKNOWN` and is never blindly replayed.
Do not remove failed jobs or reset counters to manufacture quota headroom.

Authentication, price drift, unavailable models, rate limits and provider errors
stop work without a paid fallback. Inspect the saved diagnostic and current
provider metadata before changing a model or trying a new job. Rate limits and
server failures create a binding-specific backoff of at least thirty minutes;
authentication, billing and unavailable-model errors require configuration review.
There are no in-job retries. Expired leases
preserve uncertain execution; they do not claim success. Human fixes should retain
the previous finding and its source pins rather than silently promoting it.

For a source regression, disable research first, revert the offending code commit
while preserving the current research ledger and entries, refresh the manifest,
run the checks above and publish through **Publish WikiREA**. Do not roll the
ledger backward, reset reservations or repeat already uncertain calls. Re-enable
research only after the source, quota and model bindings are qualified again.

## Additional Research Routes

Existing NVIDIA Developer Program credentials can be qualified for finite
research/testing and compiler handoff. Developer access is not an AI Enterprise
production license. A model appearing in an authenticated catalog does not prove
that its inference endpoint currently works. Preserve timeouts as unknown
execution and unavailable endpoints as failures; never silently replay them.
The exact Nemotron 3.5 Lightning research route was qualified with a completed
source-bound generation; the unavailable Mistral route and uncertain DeepSeek
request were retained separately. Requalify any replacement route before use.
The public site never receives an inference key or exposes a local model server.
