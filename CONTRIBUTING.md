# Contributing

Agent and human contributors can use [the bounded role packets](wiki/contributors.md).
Returned drafts remain unreviewed; the task contract does not start a worker or
grant permission to publish.

Open an issue with one target, one question and public supporting links. For an
entry, use [the template](ENTRY_TEMPLATE.md), pin source versions and state exactly
what was read, analyzed, executed or omitted. Do not describe a whole app as
reconstructed when only a few files were inspected.

We accept original explanations, lawful public-source references and synthetic
test proposals. Do not submit proprietary decompilations, paid indicators,
credentials, customer data, leaked artifacts, unlicensed media or bypass methods.
For devices and physical systems, start with inert fixtures; do not disable safety
controls or operate equipment as part of a documentation contribution.

An upstream test file is not a passing test receipt. A commercial hypothesis is
not measured revenue, savings, performance or demand. Proposed combinations must
retain their hypothetical status until tested.

Checks, without dependency installation:

```sh
node --test scripts/verify.test.mjs
node scripts/verify.mjs --refresh-manifest
node scripts/verify.mjs
git diff --check
```

The refresh command first runs structural/privacy checks, then replaces the local
release file-hash list. Inspect that diff before committing; hashes are not an
independent security review. CI verifies the committed list without refreshing it.

Contribute only material you have permission to share under the applicable
repository license. Identify third-party material and retain its notices.
