# Accountable Use

> Broader use permitted, but every use is visible, auditable, and consented.

**Status:** Proposed

## Description

The Accountable Use class is for products that legitimately need to use data beyond simple storage — for recommendations, personalization, model improvement, analytics, or other processing. The key commitment is not restriction, but transparency: nothing happens in the dark. Every use of data is disclosed, individually consented, auditable, and revocable.

This is the floor that all SaaS should meet, and the posture for products where data use creates genuine value for the user. An AI assistant that learns your preferences. A recommendation engine that improves with use. A platform that uses aggregate data to improve the product — with your informed, granular, revocable consent.

## Normative Rules

Each rule is verifiable: a product either meets it or it doesn't.

| # | Rule | Status |
|---|---|---|
| AU-1 | Every processing activity is logged in a user-accessible audit trail | Proposed |
| AU-2 | Users grant consent per processing purpose, not as a blanket agreement | Proposed |
| AU-3 | Users can revoke consent for any specific processing purpose at any time | Proposed |
| AU-4 | AI training use of user data is explicitly disclosed and separately consented | Proposed |
| AU-5 | Third-party data sharing is individually disclosed with recipient and purpose | Proposed |
| AU-6 | Users can view a real-time summary of how their data is currently being used | Proposed |

## Gaps

These are areas where rules are likely needed but haven't been proposed yet:

- Audit trail format and retention requirements
- Consent withdrawal mechanics — what happens to already-processed data?
- Aggregate vs individual data distinctions
- De-identification standards and re-identification risks
- Notification requirements when processing purposes change
- Algorithmic transparency — explaining *how* data influenced outputs
- Third-party audit or certification mechanisms

## Example Use Cases

- AI assistants with persistent memory and personalization
- Recommendation and discovery engines
- Collaborative tools with usage analytics
- Platforms that improve models from user interaction (with consent)
- Marketing tools with behavioral targeting (transparently)
