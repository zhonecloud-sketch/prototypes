# ATTK project instructions

## Documentation width

Keep newly written or rewritten Markdown documentation within 80
characters per source line. This includes AGENTS.md, prose, headings,
lists, copy-and-paste prompts and fenced text. Wrap at whitespace without
changing wording or meaning. Keep long links in short reference links.
Split wide tables into readable lists when they cannot fit the limit.

Apply this rule to future documentation and regenerate authored prompt
documents with the same limit. Machine-readable data and evidence keep
their required formats; do not change their values to wrap prose.

## Generation prompt storage

Store generative prompts in docs/prompts/. Keep one canonical copy of
each recorded prompt. Preserve distinct production, edit and correction
variants with clear labels. Other documentation and JSON manifests link
to the canonical prompt rather than repeating its text.

Preserve generation metadata, source-image requirements, terrain data,
asset hashes and provenance when consolidating prompts. Do not claim
that a text prompt guarantees identical generated pixels or grants
commercial rights.

## Existing delivery preferences

Use the existing GitHub repository for delivery. Do not retrain AI
profiles, regenerate images, create ZIPs or deploy the Site unless the
user explicitly requests those actions.

## Rust boundary

Keep the v56 behavior and RNG draw order during arithmetic migration.
Run Rust/WASM differential cases and the inherited game regression cases.
Every reported bug needs a validation case or a pending case design.
Keep mobile landscape controls compact and test actual phone browsers.
Do not train AI or install/remove shared system tools automatically.
Keep the attk fork independent of rtk2 and the sibling lib directory.
