# Ephemeral

> Process and forget. Nothing persists beyond the interaction.

**Status:** Proposed

## Description

The Ephemeral class is for features and products where user data should never outlive the interaction that produced it. The processor may see the data momentarily, but retains nothing — no content, no embeddings, no logs of what was said or done.

This is the posture for sensitive processing where the act of retention itself is the risk. A therapy chatbot that forgets. A document analyzer that returns results and discards the source. An AI that helps you think but doesn't remember.

## Normative Rules

Each rule is verifiable: a product either meets it or it doesn't.

| # | Rule | Status |
|---|---|---|
| E-1 | No user content persists in any storage after the interaction completes | Proposed |
| E-2 | No user content is used for model training or fine-tuning | Proposed |
| E-3 | Processing logs, if any, contain no user content — only operational metadata | Proposed |
| E-4 | Caches containing user content are invalidated at the interaction boundary | Proposed |
| E-5 | No embeddings or vector representations of user content are retained | Proposed |
| E-6 | Session identifiers are not linkable across interactions | Proposed |

## Gaps

These are areas where rules are likely needed but haven't been proposed yet:

- Definition of "interaction boundary" for streaming/long-running sessions
- Handling of content in error logs and exception reports
- Third-party sub-processor obligations (if the processor uses external APIs)
- Verification mechanisms — how does a user confirm nothing was retained?
- Handling of derived data (summaries, classifications) vs raw content

## Example Use Cases

- Therapy or coaching chatbot that retains no session content
- Sensitive document analysis (legal, medical) that returns results only
- Anonymous survey or feedback processing
- One-time AI writing assistance for private content
- Whistleblower or confidential reporting tools

## See Also

- [Spec: Mentra Live Scene Describer](../bystander-respecting/specs/mentra-live-scene-describer.md) — a smart-glasses app verified against Ephemeral (wearer's data) and [Bystander-Respecting](../bystander-respecting/) (people it captures)
