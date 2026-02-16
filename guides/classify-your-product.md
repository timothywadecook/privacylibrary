# Classify Your Product

A step-by-step guide for assessing your product's current privacy posture against the PrivacyLibrary classification system.

## Who This Is For

You build or maintain a product that handles user data — especially an AI-native application — and you want to understand where you stand on privacy. Maybe a customer asked. Maybe you're curious. Maybe you want to improve and need a starting point.

This guide helps you map your product against our [four privacy classes](../classes/overview.md) and produce a classification assessment you can act on.

## The Quick Version

1. Read the [class overview](../classes/overview.md) to understand the four postures
2. For each class, go through its rules and ask: does my product meet this?
3. The class where you meet the most rules (or fail the fewest) is roughly where you are
4. The class you *want* to meet is your target
5. The gap between current and target is your privacy roadmap

## Step-by-Step

### Step 1: Understand Your Data Flows

Before classifying, get clear on what your product actually does with data:

- What user data do you collect?
- Where is it stored? For how long?
- Who can access it? (Your team? Third-party services? AI providers?)
- Is any data used for model training or fine-tuning?
- What happens when a user deletes their account?

If you can't answer these questions confidently, that's a finding in itself.

### Step 2: Read the Classes

Read each class description to understand the postures:

| Class | Core Question |
|---|---|
| [Sovereign](../classes/sovereign/) | Does the user (or deployer) control the entire stack? |
| [Ephemeral](../classes/ephemeral/) | Does all user data disappear after the interaction? |
| [Trusted Custody](../classes/trusted-custody/) | Is data held in trust with full user control and purpose-binding? |
| [Accountable Use](../classes/accountable-use/) | Is every use of data disclosed, consented, and auditable? |

### Step 3: Evaluate Against Rules

For each class, go through the normative rules and mark Pass / Fail / Partial / Unknown:

- **Pass** — Your product clearly meets this rule today
- **Fail** — Your product does not meet this rule
- **Partial** — You meet the spirit but not the letter, or only in some cases
- **Unknown** — You're not sure (this is important to capture honestly)

Start with the class that feels closest to your current state.

### Step 4: Identify Your Current Classification

Your current classification is the *most permissive* class you fully satisfy. If you pass all Trusted Custody rules but fail two Ephemeral rules, you're Trusted Custody (not Ephemeral).

It's common to find you're between classes, or that different features of your product belong to different classes. That's fine — note it. A product can have Ephemeral processing with Trusted Custody storage.

### Step 5: Choose a Target

Decide which class you want to achieve — for the whole product, or for specific features. Consider:

- What do your users expect or need?
- What does your market demand?
- What's achievable with your current architecture?
- What would meaningfully improve trust?

### Step 6: Write a Spec

Document your assessment as a spec. Use the [example spec](../classes/sovereign/specs/sovereign-personal-ai-assistant.md) as a template:

- List each rule with Pass/Fail and evidence
- Note gaps where rules don't cover something that matters to you
- Be honest about Unknowns

This spec is useful internally even if you never share it. If you do share it — as a PR to this repo or in your own documentation — it becomes a trust signal to your users and a contribution to the community.

See the [roadmap guide](roadmap-to-a-class.md) for how to plan your path from current state to target class.

## Using AI to Help Classify

You can use an AI coding assistant to accelerate this process. For example, with Claude Code:

```
Look at the PrivacyLibrary classification system at https://github.com/anthropics/privacylibrary
and review our codebase. Determine which privacy class best describes our current implementation.
Then review the rules for [target class] and draft a roadmap to achieve that classification.
```

The AI can read your code, map it against the rules, and identify specific gaps — but you should review and validate its assessment. The AI doesn't know your deployment environment, your vendor agreements, or your internal policies.

## What Comes Next

- **If you wrote a spec**, consider [submitting it](../CONTRIBUTING.md) to help others in similar situations
- **If you found gaps in the rules**, [propose new rules](../CONTRIBUTING.md#propose-a-rule) — your real-world experience is exactly what makes the classification system better
- **If no class fits**, you may have discovered the need for a [new class](../CONTRIBUTING.md#propose-a-class)

Every classification attempt makes the system more useful. Even a failed attempt that surfaces missing rules is a valuable contribution.
