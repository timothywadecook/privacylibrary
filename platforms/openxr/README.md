# OpenXR — API-Standard Profile

> A cross-vendor API standard for XR. OpenXR **surfaces** sensitive sensor data (eye, face, body, scene, passthrough) but does **not** own the hardware or govern that data — the runtime/OS underneath does. Profile a specific runtime/OS alongside this to describe a product's full posture.

**Kind:** API standard (not a platform/OS) · see [platform profiles → two kinds](../README.md#two-kinds-of-profile)
**Standard:** OpenXR (The Khronos Group)
**Core version:** 1.1 (first released 2024-04-15); latest registry patch **1.1.61 (2026-07-06)** [S1][S2]
**Extension versioning:** each extension is versioned independently and enabled by name at instance creation [S3]
**Verified:** 2026-07-28

## What OpenXR Is (and Why It's Profiled Differently)

OpenXR is a **royalty-free open API standard** — "a common set of APIs for developing XR applications that run across a wide range of AR and VR devices" [S1]. It is **not a runtime, SDK, or OS.** Three distinct layers matter for privacy [S1][S4]:

| Layer | What it is | Owns data/permissions? |
|---|---|---|
| **Specification** | The API contract (headers + spec text), maintained by Khronos | No — defines *what can be requested* |
| **Runtime** | A vendor's implementation mapping OpenXR calls to real hardware (Meta on Quest, SteamVR, Android XR, Monado) | **Yes** — owns sensors, processing, permissions, indicators |
| **Application** | Your code, calling OpenXR to run portably across devices | — |

**Consequence for verification:** OpenXR tells you *which sensitive surfaces an app can touch* and *how a runtime must deny access*; it says nothing about where data is processed, whether the user is asked, or whether bystanders are signaled. Those are the **runtime/OS's** responsibility. So a spec for an OpenXR app references **this profile** ("what is exposed") *and* a **platform/device profile** for the specific runtime/OS it ships on ("how it's actually governed"). This profile's job is to make that split legible and point at where the governance must come from.

**Runtimes/devices implementing OpenXR** (non-exhaustive): Meta (Quest), Valve (SteamVR), Microsoft (Windows MR, HoloLens 2), HTC (Vive), Magic Leap 2, Varjo, ByteDance/Pico, Qualcomm (Snapdragon Spaces), XREAL, and Collabora's open-source Monado; Google Android XR is represented by the `XR_ANDROID_*` extension family [S5]. The authoritative live list is Khronos' conformant-products registry [S5].

## Privacy-Relevant Surfaces

These are the sensor/data surfaces OpenXR exposes that carry privacy weight. Extension names and "Last Modified" dates are from the Khronos OpenXR-Docs specification source [S3]. `XR_EXT_*` = multi-vendor Khronos; `XR_KHR_*` = Khronos core-track; `XR_FB_*`/`XR_META_*` = Meta; `XR_ANDROID_*` = Google; `XR_ML_*` = Magic Leap; `XR_MSFT_*` = Microsoft; `XR_VARJO_*` = Varjo.

### User-body surfaces (data about the wearer)

| Category | Key extension(s) | Exposes | Notes |
|---|---|---|---|
| **Eye tracking / gaze** | `XR_EXT_eye_gaze_interaction`, `XR_FB_eye_tracking_social`, `XR_ANDROID_eye_tracking` | Gaze pose; per-eye gaze; eye position (coarse/fine on Android) | Spec calls this **"sensitive personal information... closely linked to personal privacy and integrity"** and *recommends* active, specific consent to store/transfer [S3]. Android gates it behind `EYE_TRACKING_COARSE`/`EYE_TRACKING_FINE` ("dangerous") [S3]. |
| **Face tracking** | `XR_FB_face_tracking`, `XR_FB_face_tracking2`, `XR_ANDROID_face_tracking`, `XR_ML_facial_expression`, `XR_META_face_tracking_visemes` | Facial-expression blend-shape weights; visemes (speech shapes) | `XR_ANDROID_face_tracking` **requires** the runtime to support a permission system and return `XR_ERROR_PERMISSION_INSUFFICIENT` if not granted [S3]. |
| **Hand tracking** | `XR_EXT_hand_tracking` (+ `XR_FB_hand_tracking_mesh`, `_aim`, `_capsules`, `XR_MSFT_hand_tracking_mesh`) | Per-joint hand poses / hand mesh | |
| **Body tracking** | `XR_FB_body_tracking`, `XR_META_body_tracking_full_body`, `_fidelity`, `_calibration` | Body-joint poses estimating the wearer's pose | |

### Environment-facing surfaces (can capture the space **and people around** the wearer)

| Category | Key extension(s) | Exposes | Bystander relevance |
|---|---|---|---|
| **Scene meshing / room mesh** | `XR_ANDROID_scene_meshing`, `XR_MSFT_scene_understanding`, `XR_META_spatial_entity_room_mesh`, `XR_FB_scene`/`XR_FB_scene_capture`, `XR_ML_world_mesh_detection` | 3D mesh + semantics of the physical room | A room mesh can contain the **shape of nearby people**. Android calls scene meshing "sensitive personal information" and gates it behind `SCENE_UNDERSTANDING_FINE` [S3]. |
| **Environment depth** | `XR_META_environment_depth`, `XR_VARJO_environment_depth_estimation` | Depth maps of the real environment | Depth of bystanders in view |
| **Plane detection** | `XR_EXT_plane_detection` | Planes in the scene | |
| **Passthrough** | `XR_FB_passthrough`, `XR_ANDROID_passthrough_camera_state`, `XR_ANDROID_composition_layer_passthrough_mesh` | Composited real-world view; camera *readiness state* | **The app does not receive raw camera pixels** through these — passthrough is composited by the runtime; `XR_ANDROID_passthrough_camera_state` reports only state [S3]. Raw frames, if available, come from a **non-OpenXR** API (see Unverified). |
| **Object/marker/spatial** | `XR_ANDROID_trackables` (`_image`/`_marker`/`_object`/`_qr_code`), `XR_EXT_spatial_entity`, `XR_EXT_spatial_persistence`, marker-tracking extensions | Detected objects, markers, QR codes; persistent spatial anchors | `XR_EXT_spatial_entity`/`_persistence` return `XR_ERROR_PERMISSION_INSUFFICIENT` when not permitted [S3]. |

## How OpenXR Handles Denial (but not consent)

OpenXR is **permission-aware but not a permission system.** For sensitive surfaces it defines how a runtime *signals denial* rather than leaking data [S3]:

- Set validity/activity flags to false — e.g. eye gaze and `XR_FB_face_tracking2` report `isActive`/`isValid` = `XR_FALSE`.
- Return `XR_ERROR_PERMISSION_INSUFFICIENT` — e.g. spatial entity/persistence, Android face tracking.
- Some extensions **mandate** a permission system (`XR_ANDROID_face_tracking`: "The runtime **must** support a permission system").

But the **prompt, the UI, the grant, the capture indicator, and any data-handling rule are the runtime/OS's** — not OpenXR's.

## What OpenXR Does NOT Provide

Confirmed absent from the specification (full-tree grep) [S3][S6]:

- **No consent UI or permission prompt** — deferred to the runtime/OS (Android manifest permissions, Meta's runtime, `com.magicleap.permission.*`, etc.).
- **No capture/recording indicator** — no "LED"/"indicator" language exists in the spec. Whether a bystander can tell a passthrough camera is active is entirely a runtime/OS/hardware matter.
- **No data-locality mandate** — the spec never says where eye/face/scene estimation runs (on-device vs cloud); that's the runtime's choice.
- **No bystander/third-party language whatsoever** — zero references to bystanders, other people, or third parties. The word **"biometric" does not appear in the spec** either; Khronos uses "sensitive personal information."

## Mapping to the Classification System

- **[Accountable Use](../../classes/accountable-use/):** OpenXR's own text — sensitive-data labeling plus a *recommendation* of "active and specific" consent for eye/face data — is squarely an Accountable Use concern (per-purpose consent, disclosure). An app using these surfaces should meet AU rules at the runtime/OS layer, since OpenXR only recommends, never enforces.
- **[Bystander-Respecting](../../classes/bystander-respecting/):** the environment-facing surfaces (passthrough, environment depth, room mesh, trackables) capture the space **and people around** the wearer, yet OpenXR defines **nothing** about signaling or protecting them. This is the exact gap the Bystander-Respecting class exists for — and it must be met by the runtime/OS/hardware, not by OpenXR.
- **Candidate rule gaps this surfaces:** (1) is high-precision eye/face tracking *biometric* for the purposes of our rules, distinct from "sensitive personal information"? (2) does a room mesh or depth map containing a bystander's body count as "capture" under [BR-3](../../classes/bystander-respecting/#normative-rules)/[BR-5](../../classes/bystander-respecting/#normative-rules)? (3) when governance is split across a standard and a runtime, how should a spec attribute a Pass/Fail to the right layer?

## Unverified / Not Found

- **"Biometric" classification** — absent from the OpenXR spec; the legal/regulatory question is outside Khronos sources. **UNVERIFIED.**
- **Raw passthrough camera pixel access** — no OpenXR extension hands the app raw camera frames. On Android XR, raw frames appear to route through Android's Camera2 API *outside* OpenXR; cite Android XR docs, not OpenXR. **UNVERIFIED against Khronos sources.**
- **Exact per-extension `XR_*_SPEC_VERSION` integers** at 1.1.61 — cited by "Last Modified Date" from source; verify integers against the per-extension appendix if precision is needed.

## Sources

- **[S1]** OpenXR overview & 1.1 release (2024-04-15; API standard; runtime relationship) — https://www.khronos.org/openxr/ and https://www.khronos.org/news/press/khronos-releases-openxr-1.1-to-further-streamline-cross-platform-xr-development
- **[S2]** OpenXR Registry release history (1.1.61, 2026-07-06) — https://github.com/KhronosGroup/OpenXR-Registry/releases
- **[S3]** OpenXR specification source (extension `.adoc` sources: eye/face/hand/body/scene/passthrough, permission behavior) — https://github.com/KhronosGroup/OpenXR-Docs
- **[S4]** OpenXR 1.1 specification (HTML) — https://registry.khronos.org/OpenXR/specs/1.1/html/xrspec.html
- **[S5]** Conformant implementations — https://www.khronos.org/news/press/multiple-conformant-openxr-implementations-ship-bringing-to-life-the-dream-of-portable-xr-applications and https://www.khronos.org/conformance/adopters/conformant-products/openxr
- **[S6]** OpenXR Registry (spec + man pages) — https://registry.khronos.org/OpenXR/
