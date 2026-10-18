# Wikipedia / MediaWiki: First WikiREA Investigation

Date: October 18, 2026. Scope: selected public source and public documentation, plus two read-only API metadata requests. No corpus scrape, installed wiki or Wikipedia edit.

## Why Inspect Wikipedia First?

Wikipedia is the encyclopedia; [MediaWiki is the software that powers it](https://www.mediawiki.org/wiki/MediaWiki). The text, media, site operations and software are separate things to investigate. We can read open source directly instead of reconstructing a binary or treating a visible page as the entire system.

Our question: **Which existing wiki mechanisms can support a library of investigated software, games and quantum projects, with glossaries and evidence that remain useful across agent sessions?**

## Actual Work And Result

Pinned upstream: [wikimedia/mediawiki at 099df524bb975d7e42e707c0b3299e8d11d1e05d](https://github.com/wikimedia/mediawiki/tree/099df524bb975d7e42e707c0b3299e8d11d1e05d).

Retained 15 explicitly selected files, 445,779 bytes, checking each against the upstream Git blob and retaining SHA256. Submitted eight JavaScript files, 75,700 bytes, to existing REA 6.4.0 through DreamNet's upstream adapter. Maintainer-reported static status: `REVIEW_READY`, eight parsed files, zero parse failures, 4,933 visited AST nodes and 29 findings. Target code was not executed.

Important limit: the analyzer recovered zero CommonJS/ESM modules. These files use MediaWiki globals, and omitted ResourceLoader/server wiring is not automatically recovered. The receipt's complete coverage describes only the submitted snapshot. This is not a whole-Wikipedia reverse engineering claim, a full MediaWiki audit or a runtime/security certificate.

Evidence: [collection manifest](../provenance/mediawiki-foundation.json), [analysis receipt](../provenance/mediawiki-foundation.json), [analysis disclosure](../PROVENANCE.md).

## Mechanisms And Reuse

| Mechanism | Evidence | WikiREA application, proposed |
| --- | --- | --- |
| Page identity and titles | Inspected `mediawiki.Title/Title.js` | Human names and aliases map to stable entry IDs; preserve rename history |
| Revision identity and parentage | Read selected `RevisionRecord.php`; not executed | Cite an exact version, not a moving page alone |
| Conflict-aware edits | Inspected `mediawiki.api/edit.js:116-164` | Agents propose against a base revision; conflicting changes require reconciliation |
| Categories | Inspected `mediawiki.api/category.js` | Domain libraries and cross-cutting tags; do not turn category membership into a factual endorsement |
| Watchlists | Inspected `mediawiki.api/watch.js` | Upstream changes can trigger revalidation; observation and subscribing/writing are distinct capabilities |
| Parse API wrapper | Inspected `mediawiki.api/parse.js` | Separate authored entry, parser output and rendered view; the wrapper is not the parser implementation |
| Reference footnotes | Reviewed [Cite documentation](https://www.mediawiki.org/wiki/Extension:Cite) | Link findings to source locations and test receipts, beyond displaying a bibliography |
| Reusable templates | Reviewed [template documentation](https://www.mediawiki.org/wiki/Help:Templates) | Consistent investigation sections; template changes should not silently rewrite old evidence claims |
| Search | Reviewed [search API](https://www.mediawiki.org/wiki/API:Search) | Find entries and terms; search rank is not confidence or authorization |
| Structured entities | Reviewed [Wikibase overview](https://www.mediawiki.org/wiki/Wikibase) | Consider typed project/capability relationships; do not deploy another graph before testing existing DreamNet contracts |

The [revision API](https://www.mediawiki.org/wiki/API:Revisions) provides a documented route to revision metadata. The selected PHP record exposes revision IDs, parentage, content slots and audience-sensitive access. That is useful structure to study; the unseen server/storage behavior was not tested here.

The selected edit helper reads current content and timestamp, applies a transform, and submits the base/start timestamps through its token-protected edit path. This shows an optimistic conflict-aware pattern, not a guarantee of atomic multi-agent work or permission to write. No token was requested and no edit function was run.

## A Real API Check, Including An Ambiguity

The first metadata query for `Quantum_game` returned the redirect page. The second, using redirect resolution, returned:

- Normalized title: `Quantum game`.
- Resolved title: `Quantum game theory`.
- Page ID: `7043646`; revision: `1323199306`.
- Revision time: `2025-11-20T08:21:50Z`; observation: `2026-10-18T17:48:50.9261190Z`.
- Five category records and a continuation token; the response was not treated as exhaustive.

[Retained selected metadata](../provenance/wikipedia-api-observation.json). No article body or author list was retained. This is a single live API behavior observation, not a test of an entire importer.

Two design lessons: a normalized name is not necessarily the intended topic, and a fresh retrieval does not make the underlying revision newly authored. Quantum game theory, games teaching quantum mechanics and quantum-inspired branching worlds need different glossary entries and relationships.

## Architecture Decision

Borrow wiki concepts now. Do not immediately adopt all of Wikimedia's infrastructure or put private DreamNet source inside a public encyclopedia.

The [database layout documentation](https://www.mediawiki.org/wiki/Manual:Database_layout) identifies current schema sources and core page/revision/content relationships. The [architecture manual](https://www.mediawiki.org/wiki/Manual:MediaWiki_architecture) explains the larger application and caching context, but includes historical material. It is orientation, not proof of the currently deployed Wikipedia topology.

For this first library, Markdown entries plus a JSON inventory and retained evidence are sufficient. A later reader/editor could use MediaWiki or another renderer. Evaluate deployment, maintenance, compatibility and privacy before selecting one. Existing DreamNet compilers and memory/proof contracts remain the intended evidence backend.

### Private Knowledge Must Stay Private

MediaWiki's [access documentation](https://www.mediawiki.org/wiki/Manual:Preventing_access) warns that per-page confidentiality is not a native design fit and that uploaded files need separate protection. An edit restriction is not a read restriction. This is a material architecture constraint for a mixed public/private WikiREA, not a discovered flaw in a DreamNet deployment.

Keep public research separate from private customer cells. Admission/export must examine source rights and tenant audience, including attachments, search, caches and revisions. Do not rely on a namespace label or hidden navigation for isolation.

### Rights Are Layered

The retained code license and individual file notices govern software reuse. The [Wikimedia terms](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use) separately describe attribution/share-alike requirements and media/trademark considerations. Public availability does not make every image or cited source unrestricted. This collection retains upstream source for local research and does not redistribute it as a new product.

Automated reads should follow [API etiquette](https://www.mediawiki.org/wiki/API:Etiquette), including identification, caching and sensible request limits. A full encyclopedia import would be a different, explicitly scoped project.

## Monetization Hypotheses

1. **Commissioned investigation:** a buyer pays to understand one authorized capability, with exact coverage, glossary and tested acceptance conditions.
2. **Private team library:** customer-owned software maps and procedures, with controlled access and maintenance.
3. **Compatibility monitoring:** upstream changes identify dependent entries/procedures needing revalidation.
4. **Integration/reconstruction kit:** original or properly licensed code, fixtures and installation support rather than resale of arbitrary decompiled targets.
5. **Education:** original guided labs, teacher materials and practical workshops built from cleared examples.

No customer, price, sale or savings was established by this slice. The initial paid offer should attach to an actual delivered outcome, not the number of generated pages. Generic reverse-engineering wikis already exist; differentiation must be tested, not asserted.

## Next Step

The collection now includes selected [Quantum Game 2](quantum-game-2.md),
[Quantum Tensors](quantum-tensors.md), [BraKetVue](bra-ket-vue.md) and
[Quantum Game Classic](quantum-game-classic.md) source investigations. Commercial
Quantum Odyssey and other closed projects remain documentation/behavior research
candidates unless an appropriate artifact and inspection scope are established.
See the [library home](index.md) for current coverage and stages.
