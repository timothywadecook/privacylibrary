# Roadmap to a Class

A guide for products that know where they are and want to plan their path to a target privacy class.

## Prerequisites

You should have already [classified your product](classify-your-product.md) — or at least have a rough sense of which class you currently satisfy and which class you're targeting.

## How Classes Relate

The four classes form a spectrum of trust delegation:

```
Sovereign → Ephemeral → Trusted Custody → Accountable Use
(no trust)   (momentary)   (custodial)      (transparent)
```

Moving left means reducing trust delegation — fewer external parties touch your data. Moving right means allowing broader use with stronger transparency guarantees.

Neither direction is inherently "better." The right target depends on your product, your users, and your context.

## Planning Your Migration

### 1. Map the Gap

For your target class, list every rule and your current status:

| Rule | Current Status | Gap | Effort |
|---|---|---|---|
| S-1 | Fail — using OpenAI API | Replace with local inference | High |
| S-2 | Fail — same | Same change addresses this | — |
| S-3 | Pass | — | — |
| ... | ... | ... | ... |

Be specific about *why* you fail each rule. "We use OpenAI for inference" is more actionable than "Fail."

### 2. Group by Dependency

Some rules are independent. Others form chains — you can't meet S-2 (no external AI APIs) without first meeting S-1 (local inference). Group related rules and identify the critical path.

### 3. Identify Architectural vs Configuration Changes

- **Configuration changes** are fast: disable telemetry, add encryption, change retention policies
- **Architectural changes** are significant: move from cloud AI to local inference, redesign data storage, change processing pipeline

Prioritize configuration changes for quick wins. Plan architectural changes as deliberate projects.

### 4. Check for Patterns

Look in your target class's `patterns/` folder for architectural blueprints that address the rules you're failing. For example, [Local Inference Architecture](../classes/sovereign/patterns/local-inference-architecture.md) addresses Sovereign rules S-1, S-2, S-3, and S-7 as a group.

Patterns are designed to be detailed enough for implementation — whether by your team directly or with AI assistance.

### 5. Build Incrementally

You don't have to achieve your target class in one release. A reasonable approach:

1. **Quick wins first** — configuration changes, easy policy updates
2. **Feature-level migration** — move one feature to the target class, verify with a spec
3. **System-level migration** — expand to the full product
4. **Write your spec** — document your compliance as a verification artifact

### 6. Write a Spec at Each Stage

Even a partial spec is useful. It captures:
- What you've achieved so far
- What's still failing and why
- What gaps you've discovered in the rules themselves

A "work in progress" spec is honest and valuable — both for your team and for the community.

## Common Migration Paths

### Accountable Use → Trusted Custody

Typical changes:
- Add explicit purpose declarations to all stored data
- Implement automatic retention expiry
- Build data export in a portable format
- Remove or gate secondary data uses behind re-consent
- Add audit logging for staff data access

Key challenge: Untangling data uses that cross purpose boundaries.

### Accountable Use → Ephemeral (for specific features)

Typical changes:
- Redesign the feature to process-and-discard
- Eliminate persistent storage of user content for that feature
- Ensure no embeddings or training data are retained
- Make session identifiers unlinkable

Key challenge: Features that currently rely on historical data for quality.

### Trusted Custody → Sovereign

Typical changes:
- Replace external AI APIs with local inference
- Migrate from cloud database to local/private storage
- Audit and replace all dependencies that phone home
- Implement secure remote access without third-party relay

Key challenge: Significant infrastructure change. See the [Local Inference Architecture](../classes/sovereign/patterns/local-inference-architecture.md) pattern.

### Any Class → Adding AI Features Without Regressing

If you already meet a class and want to add AI features:
- Review your class's rules specifically around AI (training use, inference, embeddings)
- Choose an AI integration pattern that preserves your current classification
- Write a spec for the new feature before shipping it

## When You're Between Classes

It's common for different parts of a product to belong to different classes. A product might have:
- Ephemeral processing for AI chat (no content retained)
- Trusted Custody for user documents (stored with purpose-binding)
- Accountable Use for analytics (transparent, consented)

This is fine. Document it per-feature in your spec. The classification system is a tool for clarity, not a straitjacket.

## Contributing What You Learn

Migration attempts are one of the most valuable sources of feedback for the classification system:

- **Missing rules** you discovered → [propose them](../CONTRIBUTING.md#propose-a-rule)
- **Rules that were ambiguous** in practice → file an issue
- **Your spec** (even partial) → submit as a PR to help others on the same path
- **Patterns you developed** → contribute them to help the next team
