# Trusted Custody

> Data is held in trust. User-owned, purpose-bound, auto-expiring.

**Status:** Proposed

## Description

The Trusted Custody class is for products that need to store user data but treat it as belonging to the user, not the platform. The product is a custodian, not an owner. Data exists for a declared purpose, has a defined lifespan, and the user retains full control — including the ability to take it elsewhere or delete it entirely.

This is the posture for products where persistence is a feature but exploitation is not. A journaling app that keeps your entries safe. A personal knowledge base that remembers for you. A health tracker that stores your data because you asked it to.

## Normative Rules

Each rule is verifiable: a product either meets it or it doesn't.

| # | Rule | Status | Verification |
|---|---|---|---|
| TC-1 | All stored data has an explicit, declared purpose visible to the user | Proposed | — |
| TC-2 | Data has a defined retention period and is automatically deleted upon expiry | Proposed | — |
| TC-3 | Users can export all their data in a standard, portable format | Proposed | — |
| TC-4 | Users can delete all their data, and deletion is verified complete | Proposed | — |
| TC-5 | No secondary use of data beyond declared purpose without explicit re-consent | Proposed | — |
| TC-6 | Data is not used for model training unless the user explicitly opts in per dataset | Proposed | — |
| TC-7 | Access to user data by staff requires audit-logged justification | Proposed | — |

## Gaps

These are areas where rules are likely needed but haven't been proposed yet:

- Portable format standards (JSON export? GDPR-style data package?)
- Encryption requirements for data at rest and in transit
- Breach notification obligations and timelines
- What constitutes "verified complete" deletion (backups, replicas, logs)
- Data processing during the custody period — what transformations are allowed?
- Sub-processor requirements when using cloud infrastructure

## Example Use Cases

- Journaling or personal reflection apps
- Personal knowledge management and note-taking tools
- Health and wellness tracking
- Private photo/document storage
- Personal finance tools with transaction history
