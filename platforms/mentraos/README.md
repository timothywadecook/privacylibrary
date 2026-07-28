# MentraOS — Platform Profile

> The open-source operating system for smart glasses. Apps stream data to and from glasses hardware through a paired phone; this profile documents where that data goes and what controls exist.

**Platform:** MentraOS (formerly AugmentOS)
**Platform-Version:** 2.12 (stable, 2026-05-29) · 3.0 (pre-release, 2026-07-26)
**SDK:** `@mentra/sdk` 2.1.29 (TypeScript/JavaScript)
**License:** MIT (open source)
**Verified:** 2026-07-28 (permission enum and on-glasses capture/storage re-checked against MIT source [S10] and the [Mentra Live profile](mentra-live.md))
**Re-verify by:** 2026-08-03 (the v2→v3 architecture cutover — the Cloud SDK data flow described here changes on this date)
**Devices:** [Mentra Live](mentra-live.md)

> ⚠️ **Architecture in transition.** MentraOS is migrating from a **cloud** app model (v2.x) to **phone-local "miniapps"** (v3.0), with the Cloud SDK scheduled to stop functioning on **2026-08-03** [S6]. The data flow — and therefore the privacy posture — differs materially between versions. This profile documents **both** and labels which is which. Pin your spec to the version you verified.

## What MentraOS Is

MentraOS is an open-source OS for smart glasses that handles pairing, connectivity, hardware access, and data streaming, so developers can write one app that runs across multiple glasses models [S1]. It was formerly called **AugmentOS** (rebranded around mid-2025) [S2]. The platform, SDK, and OS are MIT-licensed [S1].

Relevant to this library: MentraOS devices include **camera- and microphone-equipped glasses** (see [Mentra Live](mentra-live.md)) that perform **ambient capture of the wearer's surroundings** — which brings the [Bystander-Respecting](../../classes/bystander-respecting/) class into scope for any app that uses the camera or microphone.

## Where App Code Runs

This is the single most privacy-relevant fact about MentraOS, and it **changes with the version**.

### v2.x — Cloud apps (current stable, sunset 2026-08-03)

Third-party apps are **cloud services**. Developers extend an `AppServer` (from `@mentra/sdk`) that runs on their own backend; the glasses connect to it through Mentra's cloud [S3]. The data path is:

```
Glasses ──BLE──▶ Phone (hub/relay) ──▶ Mentra cloud relay ──▶ Developer's cloud app
   ▲                                                                    │
   └────────────────────────── responses flow back ────────────────────┘
```

- The **phone is a Bluetooth LE hub**: glasses pair to the phone, the phone relays to Mentra's backend, and the backend connects to the app server [S6].
- **User data (transcripts, audio chunks, camera frames, sensor events) transits both Mentra's cloud and the developer's cloud** before the app can act on it. This is a multi-hop trust chain — relevant to any base-class claim about where data goes.

### v3.0 — Miniapps on the phone (from 2026-08-03)

Apps become **"miniapps" that run locally on the phone** inside a host app; **cloud compute is eliminated** from the core platform [S6]. The data path becomes:

```
Glasses ──BLE──▶ Phone app ──▶ Local miniapp (on the phone)
   ▲                                    │
   └──────── responses flow back ───────┘
```

- The **phone** now handles app execution, lifecycle, permissions, storage, and networking [S6]; the **glasses** handle capture, sensors, display/audio I/O — but note they are **not** merely a dumb sensor (see below).
- A miniapp **may still connect to a developer's own backend** if it chooses — but it is no longer forced through a cloud relay [S6]. This makes stronger base-class postures (e.g. Ephemeral, or data-minimizing designs) materially easier to achieve than under v2.x.

### On-glasses compute and storage

The defensible narrow claim is that there is **no on-glasses AI *inference*** on current MentraOS devices; AI/processing runs on the phone (v3) or cloud (v2) to conserve the glasses' small battery [S6]. **But the glasses are not "I/O only."** The `asg_client` Android app on the glasses **captures, stores, and serves media on-device**: photos/videos are written to on-glasses storage and exposed over a **LAN-scoped HTTP server on port 8089** (enumerate / download / delete), and the glasses support buffer recording and RTMP streaming directly [see [Mentra Live](mentra-live.md#on-glasses-capture-storage-and-redaction)].

**Implication for [Bystander-Respecting](../../classes/bystander-respecting/):** redaction (rule BR-5) still cannot be *computed* on the glasses (no inference), so it happens on the phone (v3) or cloud (v2). **But** a captured bystander image is retained on the glasses and reachable over the local network *before* it reaches the phone — so "on-device means on the phone" is only true once the app has **explicitly cleared the glasses-side copy**. Do not treat a Mentra capture as ephemeral by default.

## SDK Surface (v2.x Cloud SDK)

Developers extend `AppServer`; each connected user gets an `AppSession` (`session`) that exposes hardware through modules [S3]:

- **Input events:** `session.events.onTranscription()`, `onAudioChunk()`, `onVAD()` (voice activity), button presses, head position, location, and forwarded phone notifications [S3].
- **Camera:** `session.camera.requestPhoto()` for stills; apps should check capabilities (`caps.hasCamera`, `camera.video.canStream` / `canRecord`) first. Camera glasses use a separate **Mentra Bluetooth SDK** path distinct from the display-glasses Cloud SDK [S4][S5].
- **Output:** display layouts (`session.layouts.showTextWall()` and others), audio, and settings [S3].
- **Handshake:** on app activation the cloud sends a webhook; the app replies with `AppConnectionInit` (`packageName`, `apiKey`) and receives `AppConnectionAck` with settings and capabilities [S3].

> The v3.0 Miniapp SDK that replaces the Cloud SDK on 2026-08-03 was not fully documented at verification time — treat the SDK surface above as **v2.x-specific** and re-verify against the Miniapp SDK for v3 specs.

## Permissions Model (v2.x)

An app declares permissions in the **Developer Console** (not a checked-in manifest), each as a JSON object with a `type` and a **user-facing `description`** [S7]:

```json
{ "type": "MICROPHONE", "description": "To listen to your voice commands" }
```

- **Nine permission types** in the SDK's `PermissionType` enum [S10]: `MICROPHONE`, `LOCATION`, `BACKGROUND_LOCATION`, `CALENDAR`, `CAMERA`, `READ_NOTIFICATIONS`, `POST_NOTIFICATIONS`, a legacy `NOTIFICATIONS`, and — notably — a wildcard **`ALL`**. (Mentra's app-dev docs foreground the first seven; the enum in `cloud/packages/sdk/src/types/models.ts` is the authoritative list [S10].)
- **Grant flow:** the user reviews and approves declared permissions **at install time**; a denied permission behaves like an undeclared one and must be re-enabled in settings [S7].
- **Enforcement granularity:** permissions gate specific API surfaces — e.g. `MICROPHONE` governs `onTranscription()`, `onAudioChunk()`, and `onVAD()` [S7].

**Privacy-relevant limits of this model** (candidate gaps for our rules):
- Consent is **install-time and coarse** — permission per *type*, not per *purpose* or per *session*. There is no documented per-session capture toggle at the permission layer. The existence of a wildcard **`ALL`** permission [S10] is the strongest evidence of this coarseness: an app can request everything in one grant.
- Permissions concern the **wearer's** grant to the app. **Nothing in the permission model represents the bystander** — the person captured by `CAMERA`/`MICROPHONE` has no standing in it. This is precisely the gap the [Bystander-Respecting](../../classes/bystander-respecting/) class exists to address.
- Whether the v3.0 migration changes the permission model (still the same enum? still Developer Console?) was **not documented** at verification time.

## Versioning

- **OS:** GitHub Releases on the main repo, `major.minor` (e.g. v2.11, v2.12, v3.0); betas use a `_Beta_N` suffix [S8]. Latest stable **v2.12 (2026-05-29)**; latest pre-release **v3.0 (2026-07-26)** [S8].
- **SDK:** semver on npm — `@mentra/sdk` 2.1.29 [S9].
- **Release notes:** GitHub Releases (`github.com/Mentra-Community/MentraOS/releases`) [S8].

Because the platform is changing quickly, any spec referencing MentraOS should record the exact OS and SDK version it verified, and be re-checked after the 2026-08-03 v3 cutover.

## Unverified / Watch List

- **v3.0 Miniapp SDK surface** and whether it changes the permission model — not documented at verification time.
- **npm publish date** of `@mentra/sdk` 2.1.29 — registry returned an inconsistent date; the version number is reliable, the date is not.

*(Resolved since the previous version: the camera capture LED **is** software-controllable — see the [Mentra Live device profile](mentra-live.md#the-capture-indicator-is-software-driven--br-1-is-a-fail) — so BR-1 is a Fail, not an open question.)*

## Sources

- **[S1]** MentraOS repo & README (MIT, open source, OS overview) — https://github.com/Mentra-Community/MentraOS
- **[S2]** MentraOS 2.0 announcement (rebrand from AugmentOS, 2025-07-06) — https://mentraglass.com/blogs/blog/announcing-mentraos-2-0-and-our-8m-raise
- **[S3]** Cloud SDK integration (AppServer/AppSession, modules, events, webhook handshake) — https://cloud-docs.mentra.glass/cloud-overview/sdk-integration
- **[S4]** SDK getting-started overview (`@mentra/sdk`, cloud apps) — https://docs.mentraglass.com/app-devs/getting-started/overview.md
- **[S5]** Camera glasses doc (`requestPhoto`, Bluetooth SDK path, privacy light) — https://docs.mentraglass.com/app-devs/core-concepts/hardware-capabilities/camera-glasses.md
- **[S6]** Roadmap: Miniapps on the Phone (v3.0 data flow, cloud sunset 2026-08-03) — https://mentraglass.com/blogs/blog/mentra-roadmap-update-moving-to-miniapps-on-the-phone
- **[S7]** Permissions doc (7 types, Developer Console, install-time grant) — https://docs.mentraglass.com/app-devs/core-concepts/permissions.md
- **[S8]** GitHub Releases (versioning; v2.12, v3.0) — https://github.com/Mentra-Community/MentraOS/releases
- **[S9]** npm `@mentra/sdk` — https://www.npmjs.com/package/@mentra/sdk
- **[S10]** `PermissionType` enum (MIT source), incl. legacy `NOTIFICATIONS` and wildcard `ALL` — `cloud/packages/sdk/src/types/models.ts` in https://github.com/Mentra-Community/MentraOS
