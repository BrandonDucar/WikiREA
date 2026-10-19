# A Contributor Team For WikiREA

WikiREA now exposes ten bounded role packets through
[the contributor tool](../scripts/contributors.mjs). They are ready for humans
or compatible agent runtimes to consume. **They are not ten running agents.**
No model service, recurring schedule or automatic publisher is started by this
repository. The tool uses no model and makes no network requests.

| Role | Useful Work |
| --- | --- |
| Source curator | Refresh exact version, manifest and coverage boundaries. |
| Application tracer | Trace one meaningful application behavior. |
| Runtime researcher | Test language/host distinctions with finite fixtures. |
| Game mechanic researcher | Explain goals, replay, recovery and feedback. |
| Simulation researcher | Distinguish simulated state, observed state and outcomes. |
| Hardware interoperability scout | Propose inert formats and public interfaces; no device control. |
| Market data researcher | Trace updates, units and gaps; no orders. |
| Music events researcher | Explain event data, music context and participation boundaries. |
| Adversarial reviewer | Challenge unsupported claims and test failure conditions. |
| Glossary and mechanics editor | Turn findings into precise terms and reusable specifications. |

## Run A Finite Local Preflight

```sh
node scripts/contributors.mjs --preflight
node scripts/contributors.mjs --task music-events
node --test scripts/contributors.test.mjs
```

The preflight checks the library once for all roles. It does not perform ten
investigations. A task packet is bound to the catalog snapshot, names selected
source references, and limits a worker to eight files, 256 KiB and fifteen
minutes. These declared limits need enforcement by the executing host; a prompt
is not a sandbox. Unpinned targets need a source admission step first.

## Hand Off To Hermes Or Another Runtime

The packet contains no provider-specific invocation or credentials. Configure
the host independently, select one task and allow only the required public-source
reads and isolated draft writes. The source may contain prompt injection; treat
it as untrusted evidence. Do not automatically follow comments or instructions
found in a target repository.

Before recurring model work, verify the actual model route, entitlement, usage
reporting, request limits and fallback policy. A subscription is not automatically
API capacity. A free tier is not unlimited, and paid fallback must remain disabled
unless separately authorized. Start with one worker and a finite lease before
increasing concurrency. No source bodies or private integrations belong in the
public contribution.

## Review Before Publishing

A worker returns `DRAFT_FOR_REVIEW`, its task/plan identifiers, declared execution
kind and model-call count, exact inspected references, findings and unknowns.
`validateWorkerDraft` only checks the declaration's binding and shape. It cannot
prove the worker read the source, authenticate its identity or verify its claims.
An independent review must reproduce the relevant checks and inspect the final
public diff through [the existing publication gate](../CONTRIBUTING.md).

Self-certification, copied proprietary source, access-control bypasses, invented
runtime evidence and automatic main-branch pushes are not contributor behavior.
Research roles do not inherit financial, device, account or publishing authority.

Ten workers are an allocation option, not a promise of tenfold output. Measure
accepted corrections/investigations, duplicate work, reviewer burden and total
resource use. Deterministic checks avoid model calls in that path; no measured
Codex-credit or cash savings is claimed.

[Library](index.md) | [Entry template](../ENTRY_TEMPLATE.md)
