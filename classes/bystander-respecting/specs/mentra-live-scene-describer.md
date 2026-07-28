# Spec: Mentra Live Scene Describer

> An example verification of a real-time scene-description app for low-vision users, running on [Mentra Live](../../../platforms/mentraos/mentra-live.md), against **two** classes: [Ephemeral](../../ephemeral/) (for the wearer's data) and [Bystander-Respecting](../README.md) (for the people it captures).

**Status:** Example
**Base class:** Ephemeral
**Cross-cutting class:** Bystander-Respecting
**Platform:** MentraOS 3.0 (phone-local miniapp model) · [platform profile](../../../platforms/mentraos/README.md)
**Device:** Mentra Live (board K900) · [device profile](../../../platforms/mentraos/mentra-live.md)
**Verified:** 2026-07-27

This spec verifies a product against **both axes of the classification system** — how it treats the *wearer's* data (Ephemeral) and how it treats the *bystanders* it captures (Bystander-Respecting). It is also an example of pinning a verification to a specific platform version, which matters here because MentraOS's data flow changes at the [2026-08-03 v2→v3 cutover](../../../platforms/mentraos/README.md#where-app-code-runs).

## Application

**"Aura"** — a hands-free scene describer for blind and low-vision users. On an explicit button press, the glasses capture a single photo; a vision model describes the scene aloud to the wearer ("a kitchen counter with a coffee mug to your left"); the frame is then discarded. Aura never records continuously, never stores images, and never identifies individuals.

### Architecture (targets MentraOS v3.0)

- **Trigger:** wearer presses the glasses button. No always-on capture.
- **Capture:** `session.camera.requestPhoto()` returns a single still [device profile → camera].
- **Inference:** runs as a **phone-local miniapp** — the vision model executes on the phone; the frame never leaves the device [platform profile → v3.0 miniapps]. (A degraded variant routing frames to an external cloud is analyzed under BR-5 below.)
- **Output:** an audio description played to the wearer via the glasses' speakers.
- **Retention:** the frame and the generated description are held in memory only for the duration of the request, then discarded. Nothing is written to storage.
- **Permissions declared:** `CAMERA` ("To describe what's in front of you when you ask") [platform profile → permissions].

> **Why v3.0 matters here:** under the v2.x cloud model, every captured frame would transit Mentra's cloud relay *and* the developer's cloud before the app could act — undermining both the Ephemeral and Bystander-Respecting claims. The phone-local v3.0 model lets the frame be processed and discarded without leaving the device. This spec assumes v3.0; the same app on v2.x would fail several rules below.

## Rule Verification — Ephemeral (the wearer's data)

| Rule | Requirement | Meets? | Evidence / Rationale |
|---|---|---|---|
| E-1 | No user content persists after the interaction | **Pass** | Frames and descriptions are held in memory only during the request, then discarded. No database, no filesystem writes. |
| E-2 | No user content used for training/fine-tuning | **Pass** | Frames are passed to the vision model for inference only; not logged, not retained, not sent to a training pipeline. |
| E-3 | Logs contain no user content, only operational metadata | **Partial** | By design, only latency/error codes are logged. **Risk:** exception handlers must not attach the frame or description to error reports — a common leak in "ephemeral" systems. Requires a code audit to confirm Pass. |
| E-4 | Caches invalidated at the interaction boundary | **Pass** | The in-memory frame buffer is cleared when the description completes. No persistent cache. |
| E-5 | No embeddings/vector representations retained | **Pass** | The vision model emits a text description; any intermediate activations are transient and not persisted. Holds only while inference runs **on the phone** — a cloud vision API with server-side retention would make this **Unknown**. |
| E-6 | Session identifiers not linkable across interactions | **Unknown** | Depends on implementation. If each request is stateless with no persisted session key, Pass; if the miniapp keeps a stable user/session id, this needs review. Not determinable from the design alone. |

## Rule Verification — Bystander-Respecting (the people captured)

| Rule | Requirement | Meets? | Evidence / Rationale |
|---|---|---|---|
| BR-1 | Capture signaled by an indicator that can't be disabled in software | **Partial** | Mentra Live has a **dedicated white "privacy light"** that signals camera operation [device profile]. **But** whether it is hardwired to the camera or software-controllable is **unverified** — the decisive condition for BR-1. Cannot be asserted Pass until the device/firmware is checked. Also: a single still gives a brief indication; BR-1's intent is best served if the light is clearly perceptible for the capture's duration. |
| BR-2 | Capture off by default; deliberate per-session action | **Pass** | Capture happens only on an explicit button press. No continuous or ambient capture; nothing is captured without a wearer action. |
| BR-3 | Minimum capture; raw buffers discarded on completion | **Pass** | Exactly one frame per trigger, discarded after the description is produced. No rolling buffer. |
| BR-4 | Bystanders not identified (no facial/voice recognition) | **Pass (with mitigation)** | Aura runs no facial recognition and matches against no database. The vision model is instructed via system prompt not to name or identify individuals. **Residual risk:** a general vision model may still volunteer an identity (e.g. a recognizable public figure) — see Gaps. |
| BR-5 | Bystander faces/speech redacted on-device before leaving the device | **Pass (v3.0 only)** | In the phone-local model the frame is processed on the phone and **never leaves the device**, so there is no off-device transmission to redact — the rule's intent (no un-redacted bystander data leaves the device) is met. **The cloud-routed variant Fails:** frames would leave un-redacted, and [Mentra Live cannot redact on the glasses](../../../platforms/mentraos/mentra-live.md#where-redaction-can-happen) (no on-glasses compute). |
| BR-6 | No secondary use of bystander data | **Pass** | Nothing about bystanders is retained, so there is no profiling, advertising, or training use. Follows from E-1/BR-3. |
| BR-7 | Low-friction bystander deletion channel | **N/A (vacuous Pass)** | The rule presupposes retention. Aura retains nothing about bystanders, so there is nothing to delete. This exposes a **class gap**: BR-7 should state how it applies when a product retains no bystander data — see Gaps. |
| BR-8 | Auto-suspend in privacy-sensitive contexts | **Fail** | MentraOS/Mentra Live expose no documented "do-not-record" beacon or geofence [platform profile], so Aura cannot detect a restroom, clinic, or similar and suspend capture. This is a genuine limitation, not a design oversight — the platform capability is absent. |

## Summary

- **Ephemeral:** effectively met, contingent on a log-hygiene audit (E-3) and stateless sessions (E-6).
- **Bystander-Respecting:** the design is strong on minimization (BR-2, BR-3, BR-5, BR-6) and identification (BR-4), but **BR-1 is blocked on an unverified hardware fact** and **BR-8 fails for lack of platform support**. An honest classification would be "Bystander-Respecting, pending BR-1 verification, with BR-8 unmet."

This is the intended outcome of a spec: not a rubber stamp, but a precise map of what's met, what's contingent, and what the platform makes impossible today.

## Gaps and Open Questions

Writing this spec surfaced several candidate improvements to the rules — the best kind of contribution:

- **BR-1 hardware verification** — the class should say how to verify "cannot be disabled in software" for an LED indicator (firmware inspection? a hardware-interlock requirement?). Right now the rule is unverifiable from docs alone.
- **BR-7 vs. non-retention** — a product that retains *nothing* about bystanders trivially "passes" BR-7 while the rule was written assuming retention. BR-7 should explicitly scope to products that *do* retain, and pair with a minimization-first preference.
- **BR-4 and derived identity** — "runs no facial recognition" is not the same as "never reveals an identity." A general vision/LLM model can identify a public figure or read a name badge. The class may need a rule about *derived* identification, distinct from *biometric matching*.
- **BR-8 needs a platform primitive** — the rule presumes a detectable "do-not-record" signal that MentraOS doesn't provide. This is both a rule-refinement question and a [platform feature request](../../../platforms/mentraos/README.md) worth surfacing upstream.
- **Version-conditional verdicts** — this app passes BR-5 on v3.0 and fails it on v2.x. Specs may need a first-class way to express "Pass on version X, Fail on version Y" rather than a single verdict.

## How to Read This Spec

This verifies one product against **two** classes at once, showing how the base-class axis (Ephemeral) and the cross-cutting axis (Bystander-Respecting) combine to describe a complete privacy posture. The process mirrors the [Sovereign example spec](../../sovereign/specs/sovereign-personal-ai-assistant.md):

1. Pick the base class and any cross-cutting class that applies.
2. Pin the platform/device version (facts come from the [platform](../../../platforms/mentraos/README.md) and [device](../../../platforms/mentraos/mentra-live.md) profiles).
3. For each rule, determine Pass / Fail / Partial / Unknown with evidence.
4. Note gaps — rules that don't fit, or platform capabilities that are missing.

Gaps found while writing a spec are one of the best sources of new proposed rules. If one matters to you, [propose it](../../../CONTRIBUTING.md#propose-a-rule).
