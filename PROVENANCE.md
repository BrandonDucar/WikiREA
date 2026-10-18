# Provenance And Reproduction

This edition deliberately publishes **projections**, not private working folders.
Every selected source file has its upstream URL, commit, size, SHA256 and Git blob
SHA1 in `provenance/`. Manifests list exactly which files were statically analyzed
and which were retained for reading only. Missing coverage remains explicit.

Reported REA summaries name the upstream version and aggregate statistics. They
are maintainer-reported observations, not independent runtime certification or
the complete raw analyzer evidence. Original local paths and raw logs are omitted.
Source hashes prove byte identity when checked, not truth, safety or completeness.

## Fetch A Bounded Source Subset

```sh
node scripts/fetch-source.mjs nasa-openmct
node scripts/fetch-source.mjs nasa-openmct --fetch
```

The first command is an offline plan. The second admits a maximum of 32 selected
text files, one MiB per file and eight MiB total. It fetches only exact pinned
`raw.githubusercontent.com` URLs, rejects redirects and mismatched hashes, and
creates a new ignored directory without overwriting an earlier download.
No dependency installation or source execution is performed.

## Run REA Separately

Follow the upstream [setup documentation](https://github.com/morluto/rea) and review
the install plan. Original investigations used REA 6.4.0. A later version may give
different findings. Use the collector's `analysis-input` folder, which contains
only the manifest's explicitly selected JS/TS files:

```sh
rea analyze-javascript-application .local/<entry-id>-<commit>/analysis-input --json
```

Replace the placeholders with the path printed by the collector. Keep raw results
local until reviewed. A different path or platform may change result identifiers;
compare exact source bytes, provider version, coverage and conclusions rather
than assuming all output hashes should match. Rust/Go manual investigations have
no JS analysis-input claim. No complete target build or scientific validation is
implied by any published entry.

## Publishing New Evidence

Add original explanations and public source references. Retain evidence stage,
method, rights notes and omissions. Run the tests, privacy scan and release-manifest
refresh before committing. Do not add a raw source directory, account export,
firmware image, credentials, private customer context or machine-bound handoff.
See [contribution guidance](CONTRIBUTING.md).
