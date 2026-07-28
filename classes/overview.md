# Privacy Classification System

A shared framework for defining, verifying, and communicating privacy postures in software.

## How It Works

The classification system has four layers:

1. **Classes** define a privacy posture — a coherent set of commitments a product makes about how it handles data.
2. **Normative Rules** are the specific, verifiable requirements within each class. Each rule is true or false — a product either meets it or doesn't.
3. **Specs** are verification documents where a specific product or feature is evaluated against a class's rules, with evidence for each.
4. **Patterns** are reusable architectural blueprints that help products meet specific rules.

## Two Axes

Privacy posture has more than one dimension. This system separates them:

- **Base classes** answer: *how does a product treat its **user's own** data?* Every product picks exactly one.
- **Cross-cutting classes** answer: *how does a product treat **other people** it affects — those who are not its users?* A product adopts one only if it applies to what the product does.

Keeping these on separate axes matters: a product can be excellent on its user's data and still harm people it captures. Both must be stated to describe the full posture.

## The Four Base Classes

Base classes form a spectrum based on how much trust is delegated to external parties:

| Class | Trust Model | Data Leaves Your Control? |
|---|---|---|
| [Sovereign](sovereign/) | Trust no one — you own the stack | Never, architecturally |
| [Ephemeral](ephemeral/) | Trust the processor momentarily | Briefly, then gone |
| [Trusted Custody](trusted-custody/) | Trust the custodian with your data | Yes, but it's yours |
| [Accountable Use](accountable-use/) | Trust, but verify via transparency | Yes, and it may be used |

No base class is "better" than another. Each is a legitimate posture for different products and contexts. A therapy app might need Sovereign or Ephemeral. A collaborative AI tool might be well-served by Accountable Use. The point is to make the posture explicit and verifiable.

## Cross-Cutting Classes

Cross-cutting classes compose *on top of* a base class to cover people beyond the user. A product declares its base class **and** any cross-cutting class that applies.

| Class | Applies When | Covers |
|---|---|---|
| [Bystander-Respecting](bystander-respecting/) | The product senses beyond its user (camera, microphone, ambient AI) | People captured who never opted in — bystanders |

This is the axis that ambient AI, wearables, and smart glasses force into the open. Example: a self-hosted camera-glasses app can be **Sovereign** (the wearer owns the stack) *and* **Bystander-Respecting** (people around the wearer are signaled, minimized, and redacted).

## Status

This classification system is in its early stages. The classes below are proposed starting points, not finished standards. Many rules are missing. Some may be wrong. That's intentional — this is meant to be built together.

See [How to Contribute](../CONTRIBUTING.md) for ways to propose new classes, rules, specs, and patterns.
