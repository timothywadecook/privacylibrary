# Mentra Live — Device Profile

> Camera-equipped smart glasses running [MentraOS](README.md). Because they capture the wearer's surroundings, they bring the [Bystander-Respecting](../../classes/bystander-respecting/) class into scope.

**Platform:** MentraOS (formerly AugmentOS)
**Device / board:** Mentra Live (board designation: **K900**, running a custom Android 11 / API 30 build) [S3]
**Chipset:** MediaTek MTK8766 (MT8766) [S1][S4]
**Verified:** 2026-07-27
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
| Debug | ADB over Wi-Fi only (no USB ADB) | [S3] |
| Status LEDs | Blue blinking = BT advertising · Blue solid = BT connected · Red blinking = low battery · Green = charging | [S3] |
| **Camera privacy light** | **Dedicated white "privacy light" (alongside RGB status LEDs) signals camera operation** | [S5][S6] |

## Privacy-Relevant Capabilities

### Ambient capture surface

Mentra Live has a **12MP forward-facing camera with a 119° field of view** and **three microphones** [S1][S2]. Both capture the **wearer's surroundings**, meaning **any person in front of or near the wearer is a potential [bystander](../../classes/bystander-respecting/#who-is-a-bystander)** whose image or voice can be captured. This is the defining reason the Bystander-Respecting class applies to Mentra Live apps that use the camera or microphone.

### The camera privacy light — and its open question

Mentra Live ships a **dedicated white LED "privacy light"** that signals when the camera is operating, distinct from the RGB status LEDs [S5][S6]. This is a genuine, hardware-level bystander affordance and is the platform's primary documented privacy feature for the camera.

It maps directly onto rule **[BR-1](../../classes/bystander-respecting/#normative-rules)** (*active capture is signaled by a clear, perceptible indicator that cannot be disabled or concealed in software*). **But BR-1's key condition — that the indicator cannot be disabled in software — was not confirmed** in Mentra's documentation at verification time. Whether the privacy light is hardwired to the camera power rail (BR-1 Pass) or software-controlled and thus potentially suppressible by an app or OS build (BR-1 at risk) is an **open verification item**. A spec asserting BR-1 for Mentra Live must resolve this, ideally by testing the device or reading the ASG-client / firmware source.

### Where redaction can happen

Because the glasses perform **no on-device AI inference** ([see platform profile](README.md#on-glasses-compute)), bystander redaction (rule **BR-5**) cannot occur on the glasses themselves. The earliest point at which faces/voices can be redacted is:

- the **phone** (v3.0 miniapp model — redact before anything leaves the phone), or
- the **cloud app** (v2.x model — redaction happens only *after* frames have already transited Mentra's cloud and the developer's cloud, which weakens the "on-device" guarantee).

This makes the **v3.0 phone-local model materially better** for meeting BR-5, and is a concrete reason a privacy-conscious Mentra camera app should target v3.

## Capabilities an App Should Check

Per the SDK, camera apps should gate on capabilities before assuming hardware — `caps.hasCamera`, and `camera.video.canStream` / `camera.video.canRecord` — and camera glasses use the **Mentra Bluetooth SDK** path rather than the display-glasses Cloud SDK [S5]. Photo capture is via `session.camera.requestPhoto()` [S5].

## Unverified / Not Found

- **Whether the camera privacy light can be disabled in software** — not documented; decisive for [BR-1](../../classes/bystander-respecting/). **Needs device/firmware verification.**
- **Mandatory recording tone or software capture-gating policy** beyond the privacy LED — not found in official docs.
- **Native camera megapixels** — sources conflict between "12MP" and a 3264×2448 (~8MP) still resolution.
- **`k61v1_64_bsp` ↔ MTK8766 correspondence** — from an unofficial teardown, unconfirmed.

## Sources

- **[S1]** Press release (Mentra Live specs, MTK8766, $299, ship 2026-02-15) — https://mentraglass.com/blogs/blog/our-first-press-release-mentra-releases-first-smart-glasses-with-an-app-store
- **[S2]** Mentra Live product page (camera, mics, battery, weight, price) — https://mentraglass.com/live
- **[S3]** ASG-client Mentra Live dev doc (K900 board, Android 11, BT 5.0 LE, Wi-Fi, status LEDs) — https://docs.mentraglass.com/os-devs/asg-client/mentra-live
- **[S4]** Hardware teardown gist (`k61v1_64_bsp`) — https://gist.github.com/madebyollin/b24f76ed8e54dc22975e4869a0fdaf5d
- **[S5]** Camera glasses doc (`requestPhoto`, Bluetooth SDK, privacy light) — https://docs.mentraglass.com/app-devs/core-concepts/hardware-capabilities/camera-glasses.md
- **[S6]** Mentra Live hardware doc (RGB + white privacy light) — https://docs.mentraglass.com/mentra-live/hardware.md
