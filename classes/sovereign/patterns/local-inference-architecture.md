# Pattern: Local Inference Architecture

> An architectural blueprint for running AI inference entirely on deployer-controlled infrastructure, meeting Sovereign class rules S-1, S-2, S-3, and S-7.

**Class:** [Sovereign](../README.md)
**Rules Addressed:** S-1, S-2, S-3, S-7
**Status:** Proposed

## Problem

You want to offer AI-powered features (chat, summarization, analysis, generation) without any user data leaving infrastructure you control. Most AI integration patterns default to external API calls — OpenAI, Anthropic, Google — which means user prompts, context, and responses transit third-party servers.

## Architectural Approach

Run an open-source model locally using an inference server, with the application communicating only over localhost or a private network.

### Components

```
┌─────────────────────────────────────────────┐
│  Deployer-Controlled Infrastructure         │
│                                             │
│  ┌──────────┐    localhost    ┌───────────┐ │
│  │          │  ────────────▶  │           │ │
│  │   App    │                 │ Inference │ │
│  │  Server  │  ◀────────────  │  Server   │ │
│  │          │                 │ (Ollama)  │ │
│  └──────────┘                 └───────────┘ │
│       │                            │        │
│       ▼                            ▼        │
│  ┌──────────┐              ┌────────────┐   │
│  │  Local   │              │   Model    │   │
│  │ Storage  │              │  Weights   │   │
│  │ (SQLite) │              │  (local)   │   │
│  └──────────┘              └────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
         │
         │ Secure tunnel (optional, for remote access)
         ▼
    ┌──────────┐
    │  User    │
    │ Device   │
    └──────────┘
```

### Key Design Decisions

**Inference server:** Use Ollama, llama.cpp, vLLM, or LocalAI. The inference server must:
- Run on the same machine or private network as the application
- Accept connections only from the application (bind to localhost or use network policies)
- Not phone home for telemetry, updates, or license checks

**Model selection:** Choose models with:
- Open weights (downloadable, inspectable)
- Permissive license for your use case (check Meta, Mistral, etc. license terms)
- Size appropriate for your hardware (7B-13B for consumer hardware, larger for dedicated servers)

**Storage:** Local database (SQLite, PostgreSQL on same host). No managed database services that transmit data externally.

**Remote access (if needed):** Tailscale (peer-to-peer, no central relay of traffic content) or WireGuard. Cloudflare Tunnel is a trade-off — it works, but Cloudflare can observe traffic metadata.

### What This Pattern Does NOT Address

- S-4 (telemetry) — Handled separately; disable telemetry in each dependency
- S-5 (network access control) — Depends on your access method (tunnel config, auth layer)
- S-6 (encryption at rest) — OS-level disk encryption (FileVault, LUKS), not application-level

## Rule Verification Checklist

| Rule | How This Pattern Meets It |
|---|---|
| S-1 | Inference server runs on deployer hardware. No external API calls for AI. |
| S-2 | Application communicates with inference server over localhost only. Firewall rules block outbound AI API traffic. |
| S-3 | Inference server is open-source. Model weights are openly available. All dependencies auditable. |
| S-7 | Entire stack defined in docker-compose or similar. Can be rebuilt from source on fresh hardware. |

## Implementation Notes

These are guidance for anyone implementing this pattern — whether manually or with AI assistance.

**Offline model download:** Download model weights once, then operate fully offline. Verify checksums. Store weights locally, not in a network-mounted volume.

**Firewall hardening:** Explicitly block outbound connections to known AI API endpoints (api.openai.com, api.anthropic.com, etc.) as a defense-in-depth measure, even if your code doesn't call them.

**Dependency auditing:** Pin all dependency versions. Audit for unexpected network calls. Watch for transitive dependencies that include analytics or telemetry.

**Resource sizing:** Local inference requires meaningful compute. Minimum viable: 16GB RAM for 7B parameter models, 32GB+ for 13B+. GPU acceleration (NVIDIA, Apple Silicon) dramatically improves response time.

## Example Contexts

- Personal AI assistant (see [spec](../specs/sovereign-personal-ai-assistant.md))
- Private code review tool for a development team
- Legal document analysis in a law firm's private cloud
- Medical records summarization on hospital infrastructure
- Self-hosted AI email client with local embeddings

## Gaps and Open Questions

- **Model updates:** How do you update model weights without connecting to external registries? Air-gapped transfer? Verified mirror?
- **Multi-model routing:** If you run multiple models (e.g., small for triage, large for analysis), does the routing logic introduce any external dependencies?
- **Hardware trust:** This pattern assumes trusted hardware. TPM, secure boot, and firmware integrity are out of scope but relevant for high-security contexts.

If any of these gaps matter for your use case, consider [proposing a rule](../../../CONTRIBUTING.md#propose-a-rule).
