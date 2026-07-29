# Platform Profiles

A **platform profile** documents the privacy-relevant facts about a hardware or OS platform *once*, so that [specs](../classes/overview.md) and [patterns](../classes/overview.md) can reference it instead of re-deriving them. Profiles are the grounding layer: they describe what a platform actually does with data — its architecture, data flows, permission model, and privacy-relevant capabilities — pinned to specific versions.

## Why Profiles Exist

Privacy claims about a product are only as good as the facts about the platform it runs on. "The app doesn't retain audio" means nothing if the *platform* buffers audio in a cloud relay. A spec that says "meets rule BR-1 (recording indicator)" needs to point at a concrete, verified hardware fact: *this device has a white privacy LED that activates with the camera.*

Platforms also **change**. An OS release can move computation from the cloud to the phone, add a permission type, or alter a sensor's behavior — each of which can flip a rule from Pass to Fail. Profiles are therefore **version-pinned and dated**, and every factual claim carries a source so it can be re-verified.

## What a Profile Is Not

A profile is **descriptive, not evaluative.** It states what the platform does; it does not judge it against a class. That judgment happens in a [spec](../classes/overview.md), which references a profile for its facts. Keeping the two separate means a profile can be reused across many specs, and a spec's verdict can be re-checked against the profile's cited evidence.

## Structure

```
platforms/
  <platform>/
    README.md            # Platform profile: architecture, SDK, data flow, permissions, versioning
    <device>.md          # Device profile: hardware facts for one device the platform runs on
```

A **platform** (e.g. an OS/SDK like MentraOS) can support multiple **devices** (e.g. Mentra Live). Platform-level facts (data flow, permission model) live in the platform `README.md`; device-level facts (camera resolution, indicator LEDs, chipset) live in per-device files.

## Version Header Convention

Every profile — and every spec that references one — carries a version header so readers know exactly what was verified and when:

```
**Platform:** MentraOS
**Platform-Version:** 2.12 (stable, 2026-05-29) · 3.0 (pre-release, 2026-07-26)
**Device:** Mentra Live (board: K900)
**SDK:** @mentra/sdk 2.1.29
**Verified:** 2026-07-27
**Re-verify by:** 2026-08-03
**Sources:** see footnotes
```

When a platform has an imminent architecture change (as MentraOS does with its v2→v3 migration), the profile documents **both** versions and flags what differs, rather than silently describing only one.

**The `Re-verify by:` field is enforced, not decorative.** A scheduled check ([`.github/workflows/profile-staleness.yml`](../.github/workflows/profile-staleness.yml)) opens a tracking issue when a profile passes its date, so decay becomes visible instead of silent. Set it to the earliest known decay event (a scheduled platform change, an SDK major, a hardware revision) or a default review horizon — whichever is sooner. A profile with a known future change (e.g. MentraOS's 2026-08-03 v3 cutover) should re-verify *on or before* that date.

## Correction Notes

Profiles and specs are **citable documents**: someone may have linked to or relied on a claim before you changed it. So when you correct a material fact, **show the correction rather than silently editing it away** — leave a short note ("An earlier version stated X; that is wrong — Y, per [source]"). This is the same discipline the [specs](../classes/overview.md) apply to verdicts, and for a standards project it is a cheap, durable credibility signal: it demonstrates that claims are checked and revised in the open. Silent edits, by contrast, make a document look either infallible (it isn't) or untrustworthy (why did the claim change?).

## Sourcing Standard

Because platform facts drive Pass/Fail verdicts, profiles hold themselves to the same evidence bar as specs:

- **Every non-obvious claim cites a source** — official docs, the platform's source repo, or release notes, linked inline or in a Sources section.
- **Unverified claims are labeled** — if something couldn't be confirmed from an authoritative source, it says so. A profile that admits a gap is more useful than one that guesses.
- **Prefer primary sources** — the platform's own docs and code over press coverage.

## Available Profiles

| Platform | Devices | Focus |
|---|---|---|
| [MentraOS](mentraos/) | [Mentra Live](mentraos/mentra-live.md) | Open-source smart-glasses OS; camera/mic ambient capture; relevant to [Bystander-Respecting](../classes/bystander-respecting/) |

## Contributing a Profile

Profiles are welcome for any platform where privacy posture is non-obvious — wearables, ambient AI devices, edge/IoT, or any OS whose data flows aren't self-evident. Follow the structure above, pin versions, cite everything, and label what you couldn't verify. If a profile surfaces a capability our rules don't yet address, that's a [gap worth proposing a rule for](../CONTRIBUTING.md#propose-a-rule).
