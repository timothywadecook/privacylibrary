# Spec: Sovereign Personal AI Assistant

> An example verification of a personal AI assistant against the [Sovereign](../README.md) class.

**Status:** Example
**Class:** Sovereign
**Application:** A personal AI assistant deployed on a user's local machine, using a locally-hosted open-source LLM for inference, accessed via a secure tunnel.

## Architecture Summary

- **Deployment:** Docker containers on a user-owned machine (e.g., Linux workstation, Mac Mini, NUC)
- **AI Model:** Llama 3 (or similar) via Ollama, running locally
- **Access:** Cloudflare Tunnel or Tailscale for secure remote access, no public endpoints
- **Storage:** SQLite database on local encrypted disk
- **UI:** Web interface served locally, accessed through tunnel

## Rule Verification

| Rule | Requirement | Meets? | Evidence / Rationale |
|---|---|---|---|
| S-1 | All AI inference runs on deployer-owned infrastructure | **Pass** | Ollama runs the LLM on the local machine. No inference requests leave the device. |
| S-2 | No network requests to external AI APIs | **Pass** | Network audit confirms no outbound calls to OpenAI, Anthropic, or other AI endpoints. Ollama operates fully offline once the model is downloaded. |
| S-3 | All dependencies are open-source with inspectable source | **Partial** | Ollama (MIT), SQLite (public domain), and the application code (MIT) are open-source. **But Llama 3 is not:** it ships under Meta's community license — *open-weight / source-available*, with acceptable-use restrictions, a >700M-MAU commercial clause, and unpublished training data — so it does not meet "open-source with inspectable source." Swapping to an OSI-licensed open model (e.g. an Apache-2.0-licensed model such as OLMo) would make this a clean **Pass**. See Gaps. |
| S-4 | No telemetry, analytics, or crash reporting to third parties | **Pass** | Ollama telemetry disabled via `OLLAMA_NOPRUNE` config. No analytics SDKs in application code. Crash logs written to local disk only. |
| S-5 | Network access restricted to authorized users via secure channels | **Pass** | Cloudflare Tunnel authenticates via user's Cloudflare account. No ports exposed publicly. Alternatively, Tailscale provides encrypted mesh networking with identity-based access. |
| S-6 | Data at rest is encrypted | **Pass** | SQLite database stored on FileVault (macOS) or LUKS (Linux) encrypted volume. Encryption is at the OS level, transparent to the application. |
| S-7 | Full stack reproducible from source | **Pass** | `docker-compose.yml` and documented setup process allow complete rebuild. All images built from source or pulled from verified open-source registries. |

## Gaps and Open Questions

This spec meets the current Sovereign rules with one exception (S-3, Partial — the model's license), and surfaces areas where the class itself may need additional rules:

- **"Open-source" for models is contested.** S-3 as written is clean only if the model is genuinely OSI-open-source. Most popular local models (Llama, Mistral, Gemma) are *open-weight* under source-available licenses with use restrictions, not OSI-open-source. The class should decide whether S-3 requires an OSI-approved license, and whether "inspectable source" means inspectable *weights* or also published *training data* and *training code*.
- **Model provenance:** even with open weights, S-3 doesn't address model training-data provenance. Should Sovereign require knowledge of what data trained the model?
- **Update channel:** Pulling updated model weights or Docker images requires network access. Is there a rule needed about verifying updates don't introduce telemetry?
- **Tunnel provider trust:** Cloudflare Tunnel means Cloudflare can see encrypted traffic metadata. Does this violate the spirit of Sovereign? Tailscale (peer-to-peer) may be more aligned.
- **Hardware trust:** The spec assumes the hardware is trustworthy. Should Sovereign address hardware-level concerns (e.g., Intel ME, firmware)?

## How to Read This Spec

This is an example of how any product or deployment can verify itself against a privacy class. The process is:

1. Pick the class that matches your intended privacy posture
2. For each normative rule, determine if your implementation meets it
3. Provide evidence or rationale for each determination
4. Note gaps — places where the class's rules don't cover something that matters
5. Submit the spec for community review

Gaps discovered during spec-writing are one of the best sources of new proposed rules. If you find one, [propose it](../../../CONTRIBUTING.md).
