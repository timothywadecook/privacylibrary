# Governance

PrivacyLibrary is a standards project: its value is that a rule can be **cited**, which means a rule must be able to move from one person's proposal to a settled, agreed statement. This document defines how that happens — how a rule changes status, who decides, and how the project is versioned so that citations stay stable.

This is a `v0.x` governance model: deliberately lightweight, with a single maintainer as the tie-breaker. It is designed to be replaced by broader governance once there is a community to share it with (see [Evolving This Document](#evolving-this-document)).

## Roles

- **Contributors** — anyone who opens an issue or PR. No special status required.
- **Maintainer** — currently [@timothywadecook](https://github.com/timothywadecook), acting as **BDFL for `v0.x`**: final decision-maker on rule status, releases, and scope. This is explicitly a bootstrapping role, not a permanent structure.

## Rule Lifecycle

Every normative rule carries a **status**. This is the core of the project's governance — it's what lets a downstream spec know whether a rule is safe to rely on.

| Status | Meaning | Can a spec cite it? |
|---|---|---|
| **Proposed** | Under discussion. May change or be withdrawn. | Yes, but as a moving target — pin the version. |
| **Accepted** | Rough consensus reached; part of the standard. | Yes — this is what "Accepted" is for. |
| **Deprecated** | Withdrawn or superseded. Kept for historical reference; never deleted, never renumbered. | No — but the ID stays reserved forever. |

### Proposed → Accepted

1. **Propose.** Open a rule-proposal issue (see [CONTRIBUTING](CONTRIBUTING.md#propose-a-rule)) or a PR adding the rule with status `Proposed`.
2. **Comment window.** The proposal stays open for **at least 14 days** to allow review. Substantive objections must be addressed or explicitly overruled with a reason — not ignored.
3. **Rough consensus.** A rule advances when there is rough consensus and no unresolved blocking objection. "Rough consensus" means the serious concerns have been heard and addressed, not that everyone agrees. The maintainer judges whether the bar is met and records the decision on the issue/PR.
4. **Lazy consensus.** If the comment window closes with no objections, the proposal advances by **lazy consensus — silence is assent.** This matters while the community is small: a proposal that no one contests must still be able to reach a decision rather than stalling indefinitely for want of explicit approval.
5. **Accept.** The maintainer merges the status change to `Accepted`, which lands in a versioned release (see below) and the [CHANGELOG](CHANGELOG.md).

### Anyone can block, the maintainer breaks ties

A blocking objection with a concrete, on-topic rationale must be resolved before a rule is Accepted. When discussion stalls, the maintainer decides and **writes down why**. Decisions are made in the open, on the issue or PR.

### Deprecating a rule

A rule is deprecated when it's superseded or found to be wrong. It is marked `Deprecated` (not deleted), its ID is **never reused**, and the reason is recorded in the CHANGELOG. See [Identifier Stability](#identifier-stability).

## Identifier Stability

Rule identifiers (`S-1`, `BR-5`, `AU-3`, …) are the project's load-bearing interface: specs, guides, and external documents cite them. Therefore:

- **IDs are permanent.** Once assigned, a rule ID always refers to that rule.
- **IDs are never reused.** A deprecated rule's ID is retired, not recycled for something else.
- **Renumbering is a breaking change** and is avoided. If a rule's meaning changes materially, it becomes a *new* ID and the old one is deprecated.

This is what makes `BR-5 @ v0.1` a stable citation. Treat it the way a software project treats a public API.

## Versioning & Releases

The standard is versioned so that citations can be pinned to a point in time.

- **Scheme:** `MAJOR.MINOR.PATCH` (semver-flavored, applied to the *standard*, not code).
  - **MAJOR** — a breaking change to the model itself (e.g. reworking the class axes, changing what a status means).
  - **MINOR** — new Accepted rules, new classes, new profiles/specs; backward-compatible.
  - **PATCH** — clarifications, typo fixes, corrections that don't change a rule's meaning.
- **Releases** are git tags with a matching [CHANGELOG](CHANGELOG.md) entry. `v0.1.0` is the first.
- **Specs should pin the version** they verified against (e.g. "verified against Bystander-Respecting rules `@ v0.1`"), because a later release may add or change rules.

While the project is `v0.x`, the model may still shift; `v1.0.0` signals the base classes and the status machinery are considered stable.

## Scope Decisions

What belongs in the project (new classes, new platform profiles, new guide topics) is a maintainer decision, informed by discussion. The bias for `v0.x` is **narrow and deep over broad and shallow** — a small set of well-verified rules and profiles is worth more than a large set of thin ones.

## Licensing of Contributions

By contributing, you agree your contribution is licensed under the project's licenses — **CC BY 4.0** for normative text and documentation, **MIT** for code and data files — and you certify the [Developer Certificate of Origin](CONTRIBUTING.md#licensing--provenance) by signing off your commits. See [CONTRIBUTING](CONTRIBUTING.md#licensing--provenance).

## Evolving This Document

This `v0.x` model concentrates authority in one maintainer because there is currently one maintainer. That is a starting point, not a destination. As contributors arrive, the intended evolution is: multiple maintainers → a defined decision body for `Accepted` status → possibly an independent steering group for `v1.0`. Changes to this document follow the same process as everything else: a PR, a comment window, and a recorded decision. Proposals to broaden governance are explicitly welcome.
