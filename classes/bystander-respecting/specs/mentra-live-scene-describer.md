# Spec: Mentra Live Scene Describer

> An example verification of a real-time scene-description app for low-vision users, running on [Mentra Live](../../../platforms/mentraos/mentra-live.md), against **two** classes: [Ephemeral](../../ephemeral/) (for the wearer's data) and [Bystander-Respecting](../README.md) (for the people it captures).

**Status:** Example
**Base class:** Ephemeral
**Cross-cutting class:** Bystander-Respecting
**Platform:** MentraOS 3.0 (phone-local miniapp model) · [platform profile](../../../platforms/mentraos/README.md)
**Device:** Mentra Live (board K900) · [device profile](../../../platforms/mentraos/mentra-live.md)
**Verified:** 2026-07-28 (BR-1 and on-glasses retention re-derived from the MIT-licensed `asg_client` source)

This spec verifies a product against **both axes of the classification system** — how it treats the *wearer's* data (Ephemeral) and how it treats the *bystanders* it captures (Bystander-Respecting). It is also an example of pinning a verification to a specific platform version, which matters here because MentraOS's data flow changes at the [2026-08-03 v2→v3 cutover](../../../platforms/mentraos/README.md#where-app-code-runs).

## Application

**"Aura"** — a hands-free scene describer for blind and low-vision users. On an explicit button press, the glasses capture a single photo; a vision model describes the scene aloud to the wearer ("a kitchen counter with a coffee mug to your left"); the frame is then discarded. Aura never records continuously, never stores images, and never identifies individuals.

### Architecture (targets MentraOS v3.0)

- **Trigger:** wearer presses the glasses button. No always-on capture.
- **Capture:** `session.camera.requestPhoto()` returns a single still [device profile → camera].
- **Inference:** runs as a **phone-local miniapp** — the vision model executes on the phone; the frame never leaves the device [platform profile → v3.0 miniapps]. (A degraded variant routing frames to an external cloud is analyzed under BR-5 below.)
- **Output:** an audio description played to the wearer via the glasses' speakers.
- **Retention (intended):** the app holds the frame and description in memory only for the request, then discards them, and **explicitly deletes the on-glasses copy** (see caveat below). No app-side database or filesystem writes.
- **Permissions declared:** `CAMERA` ("To describe what's in front of you when you ask") [platform profile → permissions].

> **Platform caveat — captures are retained on the glasses first.** A Mentra Live capture is written to on-glasses storage and served over the LAN on [port 8089](../../../platforms/mentraos/mentra-live.md#on-glasses-capture-storage-and-redaction) *before* the app processes it — this is an `asg_client` behavior, independent of whether the app runs in the cloud (v2.x) or on the phone (v3.0). So "nothing is retained" is **not** the platform default; the app must actively delete the glasses-side copy, and several rules below are contingent on it doing so.

> **Why v3.0 still matters:** under v2.x every captured frame *also* transits Mentra's cloud relay and the developer's cloud; v3.0's phone-local model removes that hop, so the frame's exposure is limited to the glasses-side copy plus the phone. v3.0 is better, but not automatically ephemeral.

## Rule Verification — Ephemeral (the wearer's data)

| Rule | Requirement | Meets? | Evidence / Rationale |
|---|---|---|---|
| E-1 | No user content persists after the interaction | **Partial** | The app writes nothing itself — **but the platform does**: the captured frame lands in on-glasses storage / the [8089 gallery](../../../platforms/mentraos/mentra-live.md#on-glasses-capture-storage-and-redaction) until deleted. Pass only if the app reliably deletes the glasses-side copy after each capture; otherwise the frame persists. |
| E-2 | No user content used for training/fine-tuning | **Pass** | Frames are passed to the vision model for inference only; not logged, not retained, not sent to a training pipeline. |
| E-3 | Logs contain no user content, only operational metadata | **Partial** | By design, only latency/error codes are logged. **Risk:** exception handlers must not attach the frame or description to error reports — a common leak in "ephemeral" systems. Requires a code audit to confirm Pass. |
| E-4 | Caches invalidated at the interaction boundary | **Pass** | The in-memory frame buffer is cleared when the description completes. No persistent cache. |
| E-5 | No embeddings/vector representations retained | **Pass** | The vision model emits a text description; any intermediate activations are transient and not persisted. Holds only while inference runs **on the phone** — a cloud vision API with server-side retention would make this **Unknown**. |
| E-6 | Session identifiers not linkable across interactions | **Unknown** | Depends on implementation. If each request is stateless with no persisted session key, Pass; if the miniapp keeps a stable user/session id, this needs review. Not determinable from the design alone. |

## Rule Verification — Bystander-Respecting (the people captured)

| Rule | Requirement | Meets? | Evidence / Rationale |
|---|---|---|---|
| BR-1 | Capture signaled by an indicator that can't be disabled in software | **Fail** | Mentra Live's capture LEDs are **software-driven** — `K900LedController.turnOff()` / `setBrightness(0)`, and the "always on for capture" behavior is app policy that [fails open to a no-op](../../../platforms/mentraos/mentra-live.md#the-capture-indicator-is-software-driven--br-1-is-a-fail). The stock client's default is good, but the indicator *can* be disabled or silently fail in software — exactly what BR-1 forbids. No app running on this hardware can claim BR-1 without a hardware interlock the device doesn't provide. |
| BR-2 | Capture off by default; deliberate per-session action | **Pass** | Capture happens only on an explicit button press. No continuous or ambient capture; nothing is captured without a wearer action. |
| BR-3 | Minimum capture; raw buffers discarded on completion | **Partial** | The app takes exactly one frame per trigger (no rolling buffer) — good. But that frame is [retained on the glasses / 8089 gallery](../../../platforms/mentraos/mentra-live.md#on-glasses-capture-storage-and-redaction) until deleted, so "discarded on completion" holds only if the app deletes the glasses-side copy. Contingent on the same deletion as E-1. |
| BR-4 | Bystanders not identified (no facial/voice recognition) | **Pass (with mitigation)** | Aura runs no facial recognition and matches against no database. The vision model is instructed via system prompt not to name or identify individuals. **Residual risk:** a general vision model may still volunteer an identity (e.g. a recognizable public figure) — see Gaps. |
| BR-5 | Bystander faces/speech redacted on-device before leaving the device | **Partial (v3.0)** | Redaction can't be computed on the glasses (no on-glasses inference), so it happens on the phone. In the phone-local model the frame isn't sent to an external server — **but** the un-redacted frame still sits on the glasses and is reachable over the [LAN via 8089](../../../platforms/mentraos/mentra-live.md#on-glasses-capture-storage-and-redaction) until the app deletes it. So "no un-redacted bystander data is exposed" holds only after the glasses-side copy is cleared. **The cloud-routed v2.x variant Fails outright** — frames leave un-redacted through Mentra's cloud and the developer's cloud. |
| BR-6 | No secondary use of bystander data | **Pass (contingent)** | The app puts bystander data to no secondary use (no profiling, ads, training). Contingent on E-1/BR-3: data the app fails to delete from the glasses is still exposed, even if the app itself never *uses* it. |
| BR-7 | Low-friction bystander deletion channel | **N/A (vacuous)** | Aura retains nothing about bystanders (given E-1/BR-3), so there is nothing for a bystander to request deletion of. The rule presupposes retention — see the sharper BR-4/BR-7 tension in Gaps. |
| BR-8 | Auto-suspend in privacy-sensitive contexts | **Fail** | MentraOS/Mentra Live expose no documented "do-not-record" beacon or geofence [platform profile], so Aura cannot detect a restroom, clinic, or similar and suspend capture. This is a genuine limitation, not a design oversight — the platform capability is absent. |

## Summary

- **Ephemeral:** met **only if the app deletes the on-glasses copy of each capture** (E-1, and by extension BR-3/BR-5/BR-6), plus a log-hygiene audit (E-3) and stateless sessions (E-6). The platform does not make a capture ephemeral for you.
- **Bystander-Respecting:** strong on intent-gated capture (BR-2) and non-identification (BR-4), but **BR-1 is a Fail** — the capture indicator is software-defeatable — and **BR-8 fails** for lack of a platform primitive. BR-3/BR-5/BR-6 are **contingent on glasses-side deletion**. An honest classification is "Bystander-Respecting *aspiring*: BR-1 and BR-8 unmet on this hardware; BR-3/BR-5 conditional on clearing on-glasses storage."

This is the intended outcome of a spec: not a rubber stamp, but a precise map of what's met, what's contingent, and what the platform makes impossible today. Note how much of the honest verdict comes from **reading the platform's source** rather than its marketing — BR-1 and the retention caveats are both source-derived.

## Gaps and Open Questions

Writing this spec surfaced several candidate improvements to the rules — the best kind of contribution:

- **BR-1 should require a hardware interlock, or add a graded verdict.** Mentra Live shows why "not disabled in software" is the right bar: a well-intentioned software-always-on policy still fails open. The class should either require the indicator be tied to the camera power rail in hardware, or add an intermediate verdict for "good default, software-defeatable" so a device like this isn't scored the same as one with no indicator at all.
- **BR-4 and BR-7 are in tension for any *retaining* product.** To honor "delete the captures containing me" (BR-7), a product must find *which* stored captures contain the requester — i.e. match their face against its store, the facial recognition BR-4 forbids. So BR-7 is only satisfiable **without** BR-4-banned matching via *coarse, metadata-scoped* deletion ("delete everything captured at this place in this time window"). BR-7 should say this explicitly, and be scoped to retaining products (a non-retaining app like this one satisfies it vacuously).
- **"Discarded on completion" needs a platform-retention clause.** BR-3/BR-5 assume the app controls where a capture lives. On Mentra the platform persists it first (on-glasses + LAN gallery). The rules should require that *all* copies — including platform-side ones the app didn't write — are accounted for and cleared.
- **BR-4 and derived identity** — "runs no facial recognition" is not the same as "never reveals an identity." A general vision/LLM model can identify a public figure or read a name badge. The class may need a rule about *derived* identification, distinct from *biometric matching*.
- **BR-8 needs a platform primitive** — the rule presumes a detectable "do-not-record" signal that MentraOS doesn't provide. This is both a rule-refinement question and a [platform feature request](../../../platforms/mentraos/README.md) worth surfacing upstream.
- **Version-conditional verdicts** — this app's BR-5 differs between v3.0 (Partial) and v2.x (Fail). Specs may need a first-class way to express "verdict on version X vs version Y" rather than a single value.

## How to Read This Spec

This verifies one product against **two** classes at once, showing how the base-class axis (Ephemeral) and the cross-cutting axis (Bystander-Respecting) combine to describe a complete privacy posture. The process mirrors the [Sovereign example spec](../../sovereign/specs/sovereign-personal-ai-assistant.md):

1. Pick the base class and any cross-cutting class that applies.
2. Pin the platform/device version (facts come from the [platform](../../../platforms/mentraos/README.md) and [device](../../../platforms/mentraos/mentra-live.md) profiles).
3. For each rule, determine Pass / Fail / Partial / Unknown with evidence.
4. Note gaps — rules that don't fit, or platform capabilities that are missing.

Gaps found while writing a spec are one of the best sources of new proposed rules. If one matters to you, [propose it](../../../CONTRIBUTING.md#propose-a-rule).
