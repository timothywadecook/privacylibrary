# PrivacyLibrary

A free, open repository of privacy and security specs, rules, and architectural patterns — built by and for the community.

So product developers (and their agents) can have a shared resource for privacy-compliant architecture for everyone's benefit.

## Who This Is For

**People building products that handle user data** — especially AI-native applications where the privacy stakes are higher (training use, embeddings, memory, tool calls) and established patterns are fewer.

**Anyone evaluating privacy posture** — whether you're assessing your own product, reviewing a vendor, or planning a new build.

**Legal, policy, and compliance professionals** — contribute by proposing new rules or classifications to make this project better for everyone. This resource will always be 100% free and open-source. A few hours of work could one day protect millions of users and help product developers everywhere incorporate better privacy-standards in the applications they deploy (that you might one day use).

## How To Use

**Assess your product:** Pick the class closest to your intended posture, go through its rules, and see where you pass or fail. The [Classify Your Product](guides/classify-your-product.md) guide walks through this step by step.

**Plan improvements:** Use the [Roadmap to a Class](guides/roadmap-to-a-class.md) guide to plan your path from where you are to where you want to be.

**Build something new:** Pick a class, use its rules as requirements, and check its patterns for ready-to-use architecture. Building for smart glasses, XR, or wearables? Start with the [Building Privacy-Conscious Smart-Glasses Apps](guides/building-privacy-conscious-smart-glasses-apps.md) guide.

## How To Contribute

This is early stage — many rules are missing, most classes don't have specs or patterns yet, and every class has a [Gaps section](classes/sovereign/README.md#gaps) listing areas that need your help.

- **Propose a rule** — see something missing in a class? [Suggest it](CONTRIBUTING.md#propose-a-rule)
- **Write a spec** — verify a product or architecture against a class
- **Contribute a pattern** — document an architectural approach for meeting rules
- **Propose a class** — think there's a privacy posture we're missing?
- **Improve docs** — clarify language, fix examples, add context

Open Requests:
- **Privacy Professionals** - please audit classifications / rules and if you see issues - create an issue or PR
- **General** - see open issues on github

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

## Project Structure

The repo is organized around **privacy classes** — each one defines a privacy posture with verifiable rules that a product either meets or doesn't.

| Class | What It Means | Example |
|---|---|---|
| **[Sovereign](classes/sovereign/)** | You own the entire stack — no external party touches data | Personal AI assistant on local hardware |
| **[Ephemeral](classes/ephemeral/)** | Process and forget — nothing persists after the interaction | Therapy chatbot that retains no session content |
| **[Trusted Custody](classes/trusted-custody/)** | Data held in trust — user-owned, purpose-bound, auto-expiring | Journaling app that stores your entries but they're yours |
| **[Accountable Use](classes/accountable-use/)** | Broader use permitted — but every use is visible, consented, auditable | AI assistant that learns your preferences transparently |

Those four are **base classes** — they describe how a product treats its *user's own* data. A separate axis of **cross-cutting classes** covers people a product affects who are *not* its users:

| Class | What It Means | Example |
|---|---|---|
| **[Bystander-Respecting](classes/bystander-respecting/)** | Ambient sensing respects people who never opted in | Camera glasses that signal recording and blur non-consenting faces on-device |

A product declares a base class **and** any cross-cutting class that applies — e.g. a self-hosted camera-glasses app can be both **Sovereign** and **Bystander-Respecting**. See the [classification overview](classes/overview.md) for the two-axis model.

Each class contains:
- **Rules** — specific, true/false requirements ([example](classes/sovereign/README.md#normative-rules))
- **Specs** — products verified against a class's rules ([example](classes/sovereign/specs/sovereign-personal-ai-assistant.md))
- **Patterns** — architectural blueprints for meeting rules ([example](classes/sovereign/patterns/local-inference-architecture.md))

**File/Folder Organization**

```
classes/                          # Privacy classes and their contents
  overview.md                     # How classes relate to each other
  sovereign/                      # No trust delegation
  ephemeral/                      # Process and forget
  trusted-custody/                # Held in trust, user-owned
  accountable-use/                # Broader use, full transparency
  bystander-respecting/           # Cross-cutting: respects non-users captured by ambient sensing
    README.md                     # Class definition and rules
    specs/                        # Product verifications
    patterns/                     # Architectural blueprints
guides/                           # Practical guides
  classify-your-product.md        # Assess your current posture
  roadmap-to-a-class.md           # Plan a migration
  building-privacy-conscious-smart-glasses-apps.md   # Smart-glasses / XR / wearables
platforms/                        # Version-pinned platform & API-standard profiles
  mentraos/                       # MentraOS + Mentra Live (camera glasses)
  openxr/                         # OpenXR cross-vendor XR API standard
```

## License

[MIT](LICENSE)
