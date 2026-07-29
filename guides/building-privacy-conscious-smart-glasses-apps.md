# Building Privacy-Conscious Smart-Glasses Apps

A practical guide for developers building apps for smart glasses, AR/VR headsets, and AI wearables — where a device continuously senses the world, including people who never opted in.

## Who This Is For

You're building an app for smart glasses or an XR headset — on [MentraOS](../platforms/mentraos/README.md) (e.g. [Mentra Live](../platforms/mentraos/mentra-live.md)), on an [OpenXR](../platforms/openxr/README.md) runtime (Quest, Android XR, and others), or on any wearable that puts a camera, microphone, or body sensor on someone's face. This guide maps the distinctive privacy problems of that hardware onto the library's [privacy classes](../classes/overview.md) and gives you concrete design moves.

It assumes you want to do right by both your user *and* the people around them — and that you'd like a defensible, verifiable story about it, not just good intentions.

## Why Smart Glasses Are Different

Most privacy guidance assumes a screen, a keyboard, and a user who deliberately submits data. Head-worn and ambient devices break every part of that:

- **Sensing is continuous and ambient**, not deliberate. The camera and mic are already pointed at the world.
- **You capture bystanders.** A person in front of the wearer never installed your app, never consented, and can't revoke. This is the defining hard problem.
- **The trust chain has hops.** Data often travels glasses → phone → cloud. Each hop is a place it can leak — or be minimized.
- **Compute is constrained.** Where inference runs (glasses vs. phone vs. cloud) is a *privacy* decision, forced by battery, not just a performance one.
- **New sensitive body data.** XR runtimes expose eye tracking, facial expressions, and body pose — data the [OpenXR spec itself](../platforms/openxr/README.md#privacy-relevant-surfaces) calls "sensitive personal information."
- **You're a guest on a platform.** The OS/runtime owns permissions and indicators; your app inherits — and can undermine — them.

## The Two Questions You Must Answer

The library splits privacy posture into [two axes](../classes/overview.md#two-axes). For a smart-glasses app, answer both:

1. **How do you treat your *user's* data?** Pick a base class — [Sovereign](../classes/sovereign/), [Ephemeral](../classes/ephemeral/), [Trusted Custody](../classes/trusted-custody/), or [Accountable Use](../classes/accountable-use/).
2. **How do you treat *everyone else your device senses*?** If you use a camera, microphone, or environment sensor, you're in scope for [Bystander-Respecting](../classes/bystander-respecting/).

A complete answer is "we're *Ephemeral + Bystander-Respecting*," not just one or the other. See the [worked example spec](../classes/bystander-respecting/specs/mentra-live-scene-describer.md) that verifies an app against both at once.

## Design Principles

Each principle below names the rules it serves, so you can trace a design choice to a verifiable claim. A couple of principles are marked *not yet a rule* — they're sound guidance the library hasn't turned into a verifiable rule yet, and each is a standing invitation to [propose one](../CONTRIBUTING.md#propose-a-rule). Don't cite those in a spec.

### 1. Capture on intent, not ambiently — [BR-2]

Default the camera and mic **off**, and capture only on a deliberate per-session action (a button press, a wake gesture). Continuous always-on capture is the posture that makes bystanders most uneasy and is hardest to justify. On Mentra Live, a button-triggered `session.camera.requestPhoto()` is a single deliberate frame; a rolling video buffer is not.

### 2. Minimize at the source — [BR-3], [E-1]

Capture the least that does the job, and discard raw buffers the moment the function completes. A scene describer needs *one* frame, described, then gone — not a saved image. Minimization is the cheapest privacy win and it compounds: data you never retained is data you never have to secure, disclose, or delete.

### 3. Signal capture to bystanders — and know your hardware — [BR-1]

Bystanders deserve to know when they're being recorded — and [BR-1](../classes/bystander-respecting/#normative-rules) demands an indicator that *cannot be disabled in software*. That bar is higher than "has a light," and real hardware shows why:

- **Mentra Live** ships a white capture "privacy light," and the stock client's policy is to light it on every photo/video/stream — a genuinely good default. But reading the open-source client shows the LED is [software-driven and fails open to a no-op](../platforms/mentraos/mentra-live.md#the-capture-indicator-is-software-driven--br-1-is-a-fail): it can be turned off in code, and a modified build can capture with it dark. That's a concrete **BR-1 Fail** — a good default is not a guarantee.
- **OpenXR defines no capture indicator at all** — [it's left entirely to the runtime/OS/hardware](../platforms/openxr/README.md#what-openxr-does-not-provide). Check what your target runtime actually shows.

The lesson: a software-controlled indicator is weaker than a hardware interlock. Read the source, don't trust the marketing — and don't claim BR-1 without a light the software can't turn off.

### 4. Keep sensitive processing close — *(not yet a rule — see note)*

Prefer on-device (or on-phone) inference over cloud round-trips. Where data is processed determines who can see it. This is why MentraOS's [v3.0 phone-local "miniapp" model](../platforms/mentraos/README.md#where-app-code-runs) is materially better for privacy than the v2.x cloud model — and why you should **pin your design to a platform version**, because that architecture is changing (Cloud SDK sunsets 2026-08-03).

> **No rule backs this yet.** Data locality is the basis of the v2-vs-v3 argument, but the library has no locality rule — E-5 is about *retained embeddings*, not *where inference runs*, so don't cite it here. This is a genuine [gap worth a rule proposal](../CONTRIBUTING.md#propose-a-rule); until one exists, treat this principle as guidance, not a verifiable claim.

> **Careful what "on-device" means.** Mentra Live glasses run [no AI *inference*](../platforms/mentraos/mentra-live.md#on-glasses-capture-storage-and-redaction), so redaction happens on the phone — **but the glasses still retain the raw capture** on-device and serve it over the LAN until deleted. "On-device" is only ephemeral once you've cleared the glasses-side copy; it is not free.

### 5. Don't identify people — [BR-4]

Run no facial recognition and match against no identity database. And watch the subtler failure: a general vision or language model can *volunteer* an identity (a recognizable face, a name badge) even without a recognition pipeline. Constrain the model, and treat "derived identity" as a distinct risk from biometric matching.

### 6. Treat body-sensor data as sensitive — [AU-2], [AU-4]

Eye tracking, facial expressions, and body pose are intimate. OpenXR itself recommends "active and specific" consent before storing or transferring eye/face data, and Android XR gates them behind "dangerous" permissions. If your app touches these surfaces, meet [Accountable Use](../classes/accountable-use/) at the runtime/OS layer: per-purpose consent, clear disclosure, and no quiet secondary use.

### 7. Redact before data leaves the device — [BR-5]

If any capture must leave the device, redact bystander faces and identifying speech first — at the earliest point you control. On a phone-local architecture, ideally the raw frame never leaves at all. On a cloud-routed architecture, redaction *after* the frame has already reached your servers is too late; design the pipeline so un-redacted bystander data never transits an external hop.

### 8. Declare only the permissions you need — least privilege

Request the narrowest capability set. MentraOS uses [seven install-time permission types](../platforms/mentraos/README.md#permissions-model-v2x) with user-facing descriptions; OpenXR runtimes rely on the OS (e.g. Android's `EYE_TRACKING_FINE`, `FACE_TRACKING`, `SCENE_UNDERSTANDING_FINE`). Every permission you don't request is a promise you don't have to keep — and note that these permission models represent the *wearer's* grant, never the *bystander's*.

### 9. Retain nothing you don't need; expire what you do — [E-1], [TC-2]

If you can be Ephemeral, be Ephemeral — retention you don't have is risk you don't carry. If persistence is a genuine feature (a memory aid, a journal), move to [Trusted Custody](../classes/trusted-custody/): declared purpose, defined retention, user export and deletion.

### 10. Be transparent about what you do keep — [AU-1], [AU-6]

Whatever you retain or process, make it visible and auditable to the user: what's collected, why, and how to see or revoke it. Transparency is the floor for any wearable that keeps data.

## Platform-Specific Notes

- **MentraOS / Mentra Live** — camera + mic glasses; ambient capture is real. Pin to a version (v2.x cloud vs. v3.0 phone-miniapp; the flip is 2026-08-03). Verify the privacy light's behavior. Start from the [platform profile](../platforms/mentraos/README.md) and [device profile](../platforms/mentraos/mentra-live.md).
- **OpenXR runtimes (Quest, Android XR, etc.)** — OpenXR *surfaces* sensitive data but *governs* none of it; your real permission model, consent prompts, and indicators come from the runtime/OS. Profile both. Start from the [OpenXR profile](../platforms/openxr/README.md), then add a profile for your specific runtime/OS.

## Common Pitfalls

- **"Ephemeral" that leaks through error logs.** An exception handler that attaches the frame or transcript quietly breaks the whole claim ([E-3]).
- **Passthrough and room meshes capturing bystanders.** A depth map or room mesh can contain the shape of nearby people even when you never grabbed a raw photo. Environment capture is bystander capture.
- **Assuming the indicator is tamper-proof.** A software-controllable capture LED is weaker than a hardwired one. Confirm which you have.
- **Cloud routing that quietly undoes minimization.** If frames transit an external relay before your app sees them, your minimization and redaction claims have already failed at hop one.

## Putting It Together

1. **Classify** your product against the four base classes, then check whether you're in Bystander-Respecting scope — the [Classify Your Product](classify-your-product.md) guide walks the process.
2. **Pin the platform version** and pull facts from the relevant [platform/API profiles](../platforms/).
3. **Write a spec** verifying your app against your base class *and* Bystander-Respecting — use the [Mentra Live example](../classes/bystander-respecting/specs/mentra-live-scene-describer.md) as a template.
4. **Plan the gap** from where you are to your target with the [Roadmap to a Class](roadmap-to-a-class.md) guide.

## Using AI to Help

You can ask an AI coding assistant to accelerate this — e.g.:

```
Read the PrivacyLibrary smart-glasses guide and the Bystander-Respecting class.
Our app runs on Mentra Live and captures photos on a button press. Verify it
against Ephemeral + Bystander-Respecting, cite the relevant platform profile
facts, and list where we fall short.
```

Review its assessment — it doesn't know your deployment, your model's behavior, or whether your target device's privacy indicator is hardwired. Those you verify yourself.

## What Comes Next

- **Found a rule that should exist** (e.g. around derived identity, environment-capture of bystanders, or split governance across a standard and a runtime)? [Propose it](../CONTRIBUTING.md#propose-a-rule) — smart glasses are exactly the frontier where our rules are still thin.
- **Built something worth verifying?** A spec for a real device is one of the most useful contributions here.
