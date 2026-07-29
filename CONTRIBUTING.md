# Contributing to PrivacyLibrary

This is a community-maintained project. If you are a security/privacy professional - please consider contributing or sharing with your colleagues.

By participating you agree to our [Code of Conduct](CODE_OF_CONDUCT.md). How decisions get made — how a rule moves from Proposed to Accepted, and how the standard is versioned — is described in [GOVERNANCE.md](GOVERNANCE.md).

## Who Can Contribute

Everyone. Seriously. Here are some paths based on what you bring:

### Privacy Advocates & Policy Experts
You understand the human side — what privacy means to people, not just systems.

- **Propose rules** from the user's perspective
- **Challenge existing rules** — are they sufficient? Do they miss real harms?
- **Write use case descriptions** that ground the classes in real human contexts
- **Propose new classes** for contexts we haven't imagined

**Start here:** Look at the example use cases in each class. Are there important contexts missing? File an issue.

### Technical Writers & Documentarians
You make complex things understandable. That matters enormously here.

- **Improve class descriptions** — make them clearer, more precise
- **Write guides** — how to evaluate your product against a class
- **Improve rule language** — make rules unambiguous and accessible
- **Create examples** that help people understand the classification system

**Start here:** Read any class file and ask yourself: "Would someone unfamiliar with privacy terminology understand this?" If not, a PR improving the language is welcome.

### Privacy/Security Engineers
You know what's hard to implement. Your experience with real systems is invaluable.

- **Propose rules** that are technically verifiable
- **Write specs** for architectures you've built or used
- **Contribute patterns** — architectural blueprints that help meet specific rules
- **Review specs** for technical accuracy

**Start here:** Pick a class, read its rules, and check the Gaps section. File an issue proposing a missing rule with a short rationale.

### Legal & Compliance Professionals
You know what regulations require and where products fall short.

- **Propose rules** grounded in regulatory requirements (GDPR, CCPA, HIPAA, etc.)
- **Map classes to compliance frameworks** — where does Sovereign align with GDPR? Where does it fall short?
- **Review rules** for legal precision and enforceability
- **Propose new classes** for regulatory contexts we haven't considered

**Start here:** Read the [Accountable Use](classes/accountable-use/) class and its gaps. Many gaps touch compliance questions that need legal perspective.

---

## How to Contribute

### Propose a Rule

Rules are the building blocks of the classification system. A good rule is:

- **Verifiable** — it's true or false, not subjective
- **Specific** — it addresses one thing clearly
- **Actionable** — a developer can determine if their system meets it

**Process:**
1. Open an issue titled: `[Rule Proposal] <Class>: <Short description>`
2. Include:
   - Which class this rule belongs to
   - The rule statement (one sentence, true/false verifiable)
   - Why this rule matters (1-2 sentences)
   - How compliance could be verified
3. The community discusses. If there's rough consensus, someone submits a PR adding it with status "Proposed"

**Example:**
> **Class:** Ephemeral
> **Rule:** Error logs must not contain user-submitted content, only system-generated metadata.
> **Why:** Error logging is a common vector for unintentional data retention in "ephemeral" systems.
> **Verification:** Audit error log output to confirm no user content appears.

### Propose a Class

Classes represent coherent privacy postures. A new class should:

- Represent a **distinct** trust model not covered by existing classes
- Have at least **3-5 initial rules** to demonstrate the pattern
- Include **real-world use cases** where this posture makes sense

**Process:**
1. Open an issue titled: `[Class Proposal] <Name>: <One-sentence description>`
2. Include: description, trust model, 3-5 initial rules, example use cases, and how it differs from existing classes
3. Discussion and iteration happen on the issue
4. If accepted, submit a PR following the format of existing class files

### Write a Spec

Specs verify a product or architecture against a class. They're one of the most useful contributions because they test whether the rules actually work in practice.

**Process:**
1. Pick a class and a real (or realistic) product/architecture
2. For each rule, determine Pass/Fail with evidence or rationale
3. Note gaps — rules that should exist but don't
4. Submit a PR adding the spec to the relevant class's `specs/` folder

See the [example spec](classes/sovereign/specs/sovereign-personal-ai-assistant.md) for format.

### Contribute a Pattern

Patterns are architectural blueprints that help products meet specific rules. A good pattern:

- Addresses one or more specific rules by name
- Describes the architecture clearly enough to implement from
- Includes a verification checklist (how to confirm the pattern meets the rules)
- Notes what it does NOT address (so readers know what else to handle)

**Process:**
1. Open a PR adding the pattern to the relevant class's `patterns/` folder
2. Follow the format of the [example pattern](classes/sovereign/patterns/local-inference-architecture.md)
3. Link it from the class README in the "See Also" section

### Improve Existing Content

No formal process needed. If you see something that could be clearer, more accurate, or more complete — open a PR. Small improvements compound.

---

## Finding Gaps

Every class file has a **Gaps** section listing areas where rules are likely needed but haven't been proposed yet. These are some of the easiest places to start contributing.

You can also find gaps by:
- Writing a spec and discovering rules that should exist
- Reading rules and realizing edge cases aren't covered
- Bringing domain expertise (legal, policy, technical) to areas others haven't considered

---

## Contribution Guidelines

- **Be specific.** Vague suggestions are hard to act on. "Privacy should be better" isn't a contribution. "Ephemeral class should require cache invalidation within N seconds, not just 'at interaction boundary'" is.
- **Show your reasoning.** A one-line rule proposal with a paragraph of rationale is better than a paragraph-long rule.
- **It's OK to be wrong.** Proposed rules can be revised or removed. The point is to get ideas on the table.
- **Be kind.** People contributing here care about privacy. Assume good intent, even when you disagree on approach.

## Rule Statuses

- **Proposed** — Under discussion, not yet accepted
- **Accepted** — Rough consensus reached, part of the class
- **Deprecated** — Superseded or found to be problematic

The full lifecycle — the comment window, what "rough consensus" means, and who decides — is in [GOVERNANCE.md](GOVERNANCE.md#rule-lifecycle).

## Rule Identifiers & Versioning

Rule IDs (`S-1`, `BR-5`, `AU-3`, …) are the project's public interface — specs and outside documents cite them — so they are treated like an API:

- **IDs are permanent and never reused.** A withdrawn rule is marked `Deprecated`, not deleted, and its ID is retired.
- **Renumbering is a breaking change** and is avoided; a materially changed rule gets a *new* ID.
- **The standard is versioned** (`MAJOR.MINOR.PATCH`) and released as git tags with a [CHANGELOG](CHANGELOG.md) entry. **Pin the version** you rely on — write `BR-5 @ v0.1`, not just `BR-5`.

See [GOVERNANCE.md](GOVERNANCE.md#identifier-stability) for the full policy.

### Machine-readable export (`rules.json`)

`rules.json` is a generated, machine-readable export of every class and rule (for tools and agents). **It is generated from the Markdown rule tables — do not edit it by hand.** When you change a rule table, regenerate it:

```
node scripts/generate-rules.mjs
```

CI verifies it is in sync ([`.github/workflows/rules-json.yml`](.github/workflows/rules-json.yml)) and will fail a PR whose `rules.json` has drifted. Each rule table also has a **Verification** column; it is currently empty (`—`) for every rule — populating it is [normative work](GOVERNANCE.md#rule-lifecycle), and the export carries `"verification": null` until then.

## Licensing & Provenance

- **Dual license.** Normative text and documentation are contributed under **[CC BY 4.0](LICENSE-CONTENT)**; code and data files under **[MIT](LICENSE)**. By contributing, you agree to license your contribution accordingly.
- **Sign your work (DCO).** This project uses the [Developer Certificate of Origin](https://developercertificate.org/). Certify that you wrote the contribution (or have the right to submit it under our licenses) by signing off each commit:

  ```
  git commit -s -m "Your message"
  ```

  This appends a `Signed-off-by: Your Name <your@email>` line. It matters here specifically: this project makes contested claims (a rule may say a shipping product falls short), so the record of *who is accountable for each claim* must point to a person.
- **AI-assisted drafting is welcome — human accountability is required.** Contributors may use AI tools to draft rules, specs, or profiles. But every merged claim is the responsibility of a named human contributor who has reviewed and verified it. Attribution belongs to the accountable person via commit authorship and sign-off, not to a tool. Do not add tool trailers (e.g. "generated by …") to commits or PRs — they attach provenance to an artifact where it should attach to a person.

---

## Questions?

Open an issue tagged `question`. There are no stupid questions — especially ones that reveal assumptions we haven't examined.
