# Bystander-Respecting

> The people you capture are not your users. Ambient sensing respects those who never opted in.

**Status:** Proposed
**Type:** Cross-cutting class (composes with a base class)

## Description

The four base classes — [Sovereign](../sovereign/), [Ephemeral](../ephemeral/), [Trusted Custody](../trusted-custody/), and [Accountable Use](../accountable-use/) — all reason about one relationship: how a product treats its **user's own data**. Wearables and ambient AI break that assumption. A pair of smart glasses, a wearable camera, an always-listening assistant, or a home device captures **bystanders** — people who never installed the app, never consented, and cannot revoke.

The Bystander-Respecting class defines a posture toward those non-users. It is **cross-cutting**: a product also picks a base class for how it handles its user's data, and *additionally* adopts this class if it captures the surrounding environment. A Sovereign product with an always-on camera can still be hostile to the people around the wearer — this class is what closes that gap.

This is the posture for any product that senses beyond its user: camera glasses, wearable recorders, always-on voice assistants, dashcams, drones, and robots operating in shared human space.

### Who is a bystander?

Any identifiable person captured by the product's sensors who is not the user operating the device, and who has not affirmatively consented to that capture. Bystanders cannot be assumed to consent by presence alone.

## Normative Rules

Each rule is verifiable: a product either meets it or it doesn't.

| # | Rule | Status |
|---|---|---|
| BR-1 | Active capture of the surrounding environment (camera or microphone) is signaled to bystanders by a clear, perceptible indicator that cannot be disabled or concealed in software | Proposed |
| BR-2 | Environmental capture is off by default and requires a deliberate, per-session user action to begin — not a persistent always-on default | Proposed |
| BR-3 | Only the minimum capture needed for the invoked function is retained; continuous raw audio/video buffers are discarded once the function completes | Proposed |
| BR-4 | Bystanders are not identified — no facial recognition, speaker identification, gait, or other biometric matching against any enrolled or external database | Proposed |
| BR-5 | Where any capture is persisted or transmitted off-device, bystander faces and identifying speech are redacted (blurred / muted) on-device before it leaves the device | Proposed |
| BR-6 | Data captured about bystanders is never used for model training, profiling, advertising, or any secondary purpose | Proposed |
| BR-7 | A documented, low-friction channel exists for a bystander to request deletion of captures containing them, and such requests are honored | Proposed |
| BR-8 | Capture is suspended automatically in contexts with a heightened expectation of privacy where the device can detect them (e.g., a paired "do not record" beacon or geofence) | Proposed |

## Gaps

These are areas where rules are likely needed but haven't been proposed yet:

- **Enforceability of the indicator (BR-1)** — hardware LED requirements, brightness/visibility standards, and what counts as "cannot be disabled in software"
- **Consent that scales** — is bystander *consent* ever meaningful for ambient capture, or is minimization + redaction the only honest posture? Where is the line?
- **Redaction quality (BR-5)** — acceptable false-negative rates for on-device face/voice redaction; what happens when redaction is uncertain
- **Identifying whom to notify (BR-7)** — a bystander deletion channel presupposes the bystander can find you and prove they're in the capture; unresolved
- **Sensitive-context detection (BR-8)** — restrooms, medical facilities, schools, protests; detection is hard and partly a policy/legal question
- **Children and vulnerable subjects** — heightened obligations when bystanders are minors
- **Jurisdictional variance** — one-party vs all-party recording-consent law, EU biometric rules (GDPR Art. 9), Illinois BIPA, etc.
- **Derived insights** — a capture may be redacted but still yield inferences about bystanders (count, mood, presence); does minimization extend to derivations?
- **Interaction with the base class** — how Ephemeral/Trusted Custody guarantees for the *user* interact with bystander retention windows

## Example Use Cases

- Camera-equipped smart glasses that capture only on an explicit gesture, signal recording via a visible LED, and blur non-consenting faces before anything syncs to a phone
- An always-on voice assistant that processes wake-word audio on-device and never retains ambient speech from people other than the user
- A wearable "memory" recorder that redacts bystander faces and voices on-device before storing the user's day
- A delivery or service robot that films for navigation but discards frames and never runs facial recognition
- A dashcam that records for the driver's safety but honors a documented deletion request from someone captured

## Composing With a Base Class

A product declares **both** a base class and, if it senses beyond its user, this class. Examples:

- **Sovereign + Bystander-Respecting** — a self-hosted personal camera-glasses app: the wearer's data never leaves their control (Sovereign), *and* bystanders are signaled, minimized, and redacted (Bystander-Respecting).
- **Ephemeral + Bystander-Respecting** — a live translation earbud: the user's audio is processed and forgotten (Ephemeral), *and* surrounding speakers are not identified or retained (Bystander-Respecting).

## See Also

- [Classification overview](../overview.md) — how cross-cutting classes fit the two-axis model
- Smart-glasses and wearable specs/patterns (planned) — verifications and edge-inference blueprints for real devices
