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

- **Base classes** answer: *how does a product treat its **user's own** data?* A product declares the base class it intends to claim; different features of one product can sit in different classes (e.g. Ephemeral processing with Trusted Custody storage).
- **Cross-cutting classes** answer: *how does a product treat **other people** it affects — those who are not its users?* A product adopts one only if it applies to what the product does.

Keeping these on separate axes matters: a product can be excellent on its user's data and still harm people it captures. Both must be stated to describe the full posture.

## The Four Base Classes

The four base classes differ in how much trust is delegated to external parties. They are **independent postures, not a nested hierarchy** — the table below is ordered by trust delegation for readability, but meeting one class does *not* imply meeting another. (Sovereign, for instance, has no data-retention rules, so a Sovereign product can retain data indefinitely; an Ephemeral product retains nothing and so cannot satisfy Trusted Custody's export rule.) You evaluate a product against each class on its own.

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

## How the Classes Relate

*This is the canonical statement of the model's semantics. Specs, guides, and tools should treat it as the reference for how classes compose and how a product is classified. Decided at v0.1.*

**1. Two independent axes.** Every classification has (at most) two parts: a **base class** describing how the product treats its user's own data, and, if the product senses beyond its user, a **cross-cutting class** describing how it treats non-users it affects. The axes are independent — a claim on one says nothing about the other.

**2. Base classes are mutually independent, not a hierarchy.** The four base classes are distinct postures, not levels of a ladder. Satisfying one class neither requires nor implies satisfying another; there is **no subsumption and no ranking**. The trust-delegation order used in tables is a reading aid, not a relation between the classes. Some pairs are even effectively exclusive: an Ephemeral product retains nothing and therefore cannot meet Trusted Custody's export and retention rules. The only correct way to determine a product's classes is to evaluate it against each class's rules **independently**.

**3. Classification is a claim you make and can verify.** A product (or a single feature) *is in* a class when it satisfies that class's rules — no more, no less. A product **declares** the class(es) it claims; different features may claim different classes (e.g. Ephemeral chat, Trusted Custody document storage). A [spec](../CONTRIBUTING.md#write-a-spec) is how a claim is evidenced, rule by rule, with Pass/Fail/Partial/Unknown.

**4. Composition across axes is conjunction.** A product's full posture is its base-class claim(s) **and** every cross-cutting class that applies to it, together. "Sovereign + Bystander-Respecting" means both sets of rules are met; neither weakens nor implies the other.

**5. Scope of a claim.** Claims attach to a stated scope — a whole product, or a named feature. A product-level claim means *every* feature meets it; a feature-level claim is bounded to that feature and should say so. When features differ, record the classification per feature rather than forcing one label onto the whole product.

## Status

This classification system is in its early stages. The classes below are proposed starting points, not finished standards. Many rules are missing. Some may be wrong. That's intentional — this is meant to be built together.

See [How to Contribute](../CONTRIBUTING.md) for ways to propose new classes, rules, specs, and patterns.
