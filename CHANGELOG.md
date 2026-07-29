# Changelog

All notable changes to the PrivacyLibrary standard are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/), and the project is [versioned](GOVERNANCE.md#versioning--releases) so that specs and external documents can pin the rules they cite (e.g. `BR-5 @ v0.1`).

Rule statuses (`Proposed` / `Accepted` / `Deprecated`) and identifier stability are defined in [GOVERNANCE.md](GOVERNANCE.md).

## [Unreleased]

_Changes on `main` not yet in a tagged release._

## [0.1.0] — 2026-07-28

First tagged release. Establishes the model, the initial classes, and the governance/versioning machinery. All rules are **Proposed** at this stage — see [GOVERNANCE.md](GOVERNANCE.md) for how a rule becomes Accepted.

### Added

- **Classification model** — four base classes (Sovereign, Ephemeral, Trusted Custody, Accountable Use) plus the two-axis model separating base classes (a product's treatment of its *user's* data) from cross-cutting classes.
- **Bystander-Respecting** cross-cutting class with proposed rules `BR-1`…`BR-8`, for products that capture non-users (wearables, ambient AI).
- **Platform profiles** (`platforms/`) — a version-pinned, cited grounding layer, with two archetypes: platform/device profiles (MentraOS → Mentra Live) and API-standard profiles (OpenXR).
- **Specs** — the Sovereign personal-AI-assistant example, and a Mentra Live scene-describer verified against Ephemeral + Bystander-Respecting.
- **Guides** — Classify Your Product, Roadmap to a Class, and Building Privacy-Conscious Smart-Glasses Apps.
- **Governance & versioning** — this changelog, `GOVERNANCE.md` (rule lifecycle, identifier-stability policy), and issue/PR templates.

### Rule identifiers reserved at 0.1.0

`S-1`…`S-7` (Sovereign), `E-1`…`E-6` (Ephemeral), `TC-1`…`TC-7` (Trusted Custody), `AU-1`…`AU-6` (Accountable Use), `BR-1`…`BR-8` (Bystander-Respecting). Per [identifier stability](GOVERNANCE.md#identifier-stability), these IDs are permanent and will not be reused.

[Unreleased]: https://github.com/timothywadecook/privacylibrary/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/timothywadecook/privacylibrary/releases/tag/v0.1.0
