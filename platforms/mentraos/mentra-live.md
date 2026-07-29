# Mentra Live — Device Profile

> Camera-equipped smart glasses running [MentraOS](README.md). Because they capture the wearer's surroundings, they bring the [Bystander-Respecting](../../classes/bystander-respecting/) class into scope.

**Platform:** MentraOS (formerly AugmentOS)
**Device / board:** Mentra Live (board designation: **K900**, running a custom Android 11 / API 30 build) [S3]
**Chipset:** MediaTek MTK8766 (MT8766) [S1][S4]
**Verified:** 2026-07-28 (hardware/capture facts re-checked against the MIT-licensed `asg_client` source [S7][S8][S9])
**Re-verify by:** 2026-10-26 (hardware facts are stable; re-check after any device revision or major `asg_client` change)
**Availability:** Batch 1 shipped 2026-02-15 at $299 (1,000 units); list $349 [S1][S2]

> **Naming note:** In MentraOS docs, **"K900" is the device/board designation** for Mentra Live (running a custom Android build), **not** the chipset. The chipset is the **MediaTek MTK8766**. An unofficial teardown reports the board string `k61v1_64_bsp` (a MediaTek BSP name); whether that maps to the MTK8766 die is unconfirmed [S4]. Do not describe "K900" as a chipset.

## Hardware Facts

| Spec | Value | Source |
|---|---|---|
| Chipset | MediaTek MTK8766, low-power MCU for dual-chip processing | [S1][S4] |
| Board / OS | "K900" board, custom Android 11 (API 30) | [S3] |
| Camera | 12MP / HD; stills listed at 3264×2448; 1080p video; 119° FOV, landscape | [S1][S2][S3] |
| Microphones | 3 microphones | [S2] |
| Speakers | Stereo | [S2] |
| Battery | 260 mAh (glasses) + 2,200 mAh (charging case); 12+ hrs mixed use | [S2] |
| Weight | 43 g | [S1][S2] |
| Connectivity | Wi-Fi 802.11 b/g/n; Bluetooth 5.0 LE | [S3] |
| Debug | ADB over USB (magnetic "Infinity Cable" USB-C clip-on) **and** over Wi-Fi | [S9] |
| Status LEDs | Blue blinking = BT advertising · Blue solid = BT connected · Red blinking = low battery · Green = charging | [S3] |
| **Camera capture LEDs** | A local MTK "privacy light" **plus** a white RGB ring; both are **software-driven** (see below), and the stock client lights them on photo/video/stream capture | [S5][S6][S7] |
| On-glasses capture storage | Captured photos/videos are written to on-glasses storage and served over a local HTTP server on **port 8089** (LAN-scoped) | [S8] |

## Privacy-Relevant Capabilities

### Ambient capture surface

Mentra Live has a **12MP forward-facing camera with a 119° field of view** and **three microphones** [S1][S2]. Both capture the **wearer's surroundings**, meaning **any person in front of or near the wearer is a potential [bystander](../../classes/bystander-respecting/README.md#who-is-a-bystander)** whose image or voice can be captured. This is the defining reason the Bystander-Respecting class applies to Mentra Live apps that use the camera or microphone.

### The capture indicator is software-driven — BR-1 is a Fail

Mentra Live signals camera use with two indicators: a **local MTK "privacy light"** and a **white RGB ring**, driven together by `MediaCaptureService` so the wearer/bystander gets a consistent signal (photo → white flash; video → solid; buffer recording → blink) [S7]. To Mentra's credit, **the stock client policy is to always light the local capture LED for photo, video, and stream capture** [S7]. That is a genuinely good *default*.

**But rule [BR-1](../../classes/bystander-respecting/README.md#normative-rules) requires an indicator that *cannot be disabled or concealed in software* — and this one can.** Reading the MIT-licensed `asg_client` source that this profile already cites resolves the question that an earlier version of this profile left open:

- The LED is controlled entirely in software: `K900LedController.turnOff()`, `setBrightness(int percent)` (0 = off), and `setLedStateInternal()` → `DevApi.setLedOn(boolean)` over JNI to `libxydev.so` [S7].
- "Always enabled for capture" is an **application policy in `MediaCaptureService`, not a hardware interlock** [S7].
- It **fails open**: if `libxydev.so` fails to load, `K900LedController` "becomes a no-op — the local MTK LED simply doesn't light. App keeps running" [S7]. The RGB ring similarly no-ops if the MTK never claims LED authority from the BES co-processor [S7].
- The client is replaceable (`dev-setup.sh` swaps the factory system app) [S9], so a modified build can capture with the indicator dark.

**Verdict: BR-1 is a Fail for Mentra Live** — not because Mentra is careless (the stock behavior is good), but because the indicator is a software policy that can be turned off, misconfigured, or fails silently, which is exactly the condition BR-1 exists to exclude. A hardware interlock tying the LED to the camera power rail would move this to Pass.

### On-glasses capture, storage, and redaction

An earlier version of this profile described the glasses as "I/O and sensors only." That is **wrong** and it matters for BR-3 and BR-5. The glasses run a full Android app that:

- **persists captured photos and video to on-glasses storage** and serves them over an **embedded HTTP server on port 8089** — with endpoints to take pictures, enumerate the gallery, download, and bulk-delete files [S8]. The server is **LAN-scoped** ("listens on the local WiFi address only… not exposed beyond the network the glasses are joined to") [S8] — but that still means a captured bystander image is, until deleted, at rest on the glasses and reachable by anything on the same Wi-Fi (e.g. a café network).
- supports a **rolling "buffer recording" mode** [S7] and **RTMP/SRT/WHIP live streaming directly from the glasses** [S10].

The defensible narrow claim is that the glasses perform **no on-device AI *inference*** — so bystander *redaction* (rule **BR-5**) can't be computed on the glasses and must happen on the phone (v3.0) or cloud (v2.x). But "nothing is retained on the glasses" is false: a capture lands in on-glasses storage and on the 8089 gallery first, so an app targeting BR-3/BR-5 must **explicitly delete the on-glasses copy** (via the delete-files endpoint [S8]) rather than assume the frame lived only in memory. The v3.0 phone-local model is still better for redaction, but only *after* the glasses-side copy is cleared.

## Capabilities an App Should Check

Per the SDK, camera apps should gate on capabilities before assuming hardware — `caps.hasCamera`, and `camera.video.canStream` / `camera.video.canRecord` — and camera glasses use the **Mentra Bluetooth SDK** path rather than the display-glasses Cloud SDK [S5]. Photo capture is via `session.camera.requestPhoto()` [S5].

## Unverified / Not Found

- **Native camera megapixels** — sources conflict between "12MP" and a 3264×2448 (~8MP) still resolution.
- **`k61v1_64_bsp` ↔ MTK8766 correspondence** — from an unofficial teardown, unconfirmed.
- **Whether the SDK `requestPhoto()` path auto-deletes the on-glasses copy** — the 8089 server persists captures and exposes a delete endpoint [S8], but whether a single SDK photo capture is cleaned up automatically or must be deleted by the app is not confirmed; a BR-3/BR-5 spec should verify this on-device.

*(Resolved since the previous version: the capture LED **is** software-controllable — see the BR-1 section above — and the glasses **do** retain captures on-device; both were previously listed here as unverified.)*

## Sources

- **[S1]** Press release (Mentra Live specs, MTK8766, $299, ship 2026-02-15) — https://mentraglass.com/blogs/blog/our-first-press-release-mentra-releases-first-smart-glasses-with-an-app-store
- **[S2]** Mentra Live product page (camera, mics, battery, weight, price) — https://mentraglass.com/live
- **[S3]** ASG-client Mentra Live dev doc (K900 board, Android 11, BT 5.0 LE, Wi-Fi, status LEDs) — https://docs.mentraglass.com/os-devs/asg-client/mentra-live
- **[S4]** Hardware teardown gist (`k61v1_64_bsp`) — https://gist.github.com/madebyollin/b24f76ed8e54dc22975e4869a0fdaf5d
- **[S5]** Camera glasses doc (`requestPhoto`, Bluetooth SDK, privacy light) — https://docs.mentraglass.com/app-devs/core-concepts/hardware-capabilities/camera-glasses.md
- **[S6]** Mentra Live hardware doc (RGB + white privacy light) — https://docs.mentraglass.com/mentra-live/hardware.md
- **[S7]** `asg_client` LED control (MIT source): `K900LedController.java` (`turnOff`, `setBrightness`, `setLedStateInternal`→`DevApi.setLedOn`) and `docs/features/led-control.md` (software-driven; "always enabled for capture" is app policy; fails open to no-op) — https://github.com/Mentra-Community/MentraOS (`asg_client/`)
- **[S8]** `asg_client` camera web server (MIT source): `docs/features/camera-web-server.md` (port 8089; enumerate/download/delete captured media; LAN-scoped) — https://github.com/Mentra-Community/MentraOS (`asg_client/`)
- **[S9]** `asg_client/AGENTS.md` (ADB over USB via "Infinity Cable"; `dev-setup.sh` replaces the factory system app) — https://github.com/Mentra-Community/MentraOS (`asg_client/`)
- **[S10]** `asg_client` live streaming (MIT source): `docs/features/rtmp-streaming.md` (RTMP/SRT/WHIP from the glasses) — https://github.com/Mentra-Community/MentraOS (`asg_client/`)
