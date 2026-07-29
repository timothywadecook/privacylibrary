# Sovereign

> No trust delegation. You own the infrastructure, the models, and the data. No external party can access, process, or observe.

**Status:** Proposed

## Description

The Sovereign class is for applications where privacy is guaranteed by architecture, not policy. The deployer owns and controls the entire stack — hardware or cloud instance, application code, AI models, and data. No external service ever touches user data, because no external service is involved.

This is the posture for personal AI, sensitive professional tools, and any context where "trust us" is not an acceptable answer.

## Normative Rules

Each rule is verifiable: a product either meets it or it doesn't.

| # | Rule | Status | Verification |
|---|---|---|---|
| S-1 | All AI inference runs on infrastructure owned or controlled by the deployer | Proposed | — |
| S-2 | No network requests are made to external AI APIs for inference or processing | Proposed | — |
| S-3 | All software dependencies are open-source with inspectable source code | Proposed | — |
| S-4 | No telemetry, analytics, or crash reporting is sent to third-party services | Proposed | — |
| S-5 | Network access to the application is restricted to explicitly authorized users via secure channels | Proposed | — |
| S-6 | Data at rest is encrypted on the deployment infrastructure | Proposed | — |
| S-7 | The full application stack can be reproduced from source by the deployer | Proposed | — |

## Gaps

These are areas where rules are likely needed but haven't been proposed yet:

- Update and patch management without phoning home
- Key management and rotation for encrypted data
- Secure destruction of data on infrastructure decommission
- Multi-user access control within a sovereign deployment
- Backup and recovery without external services

## Example Use Cases

- Personal AI assistant running on local hardware with Ollama
- Private journaling app on a home server
- Legal research tool deployed to a firm's private cloud
- Family knowledge base on a Raspberry Pi
- Sensitive document analysis via Cloudflare Tunnel to a private instance

## See Also

- [Example Spec: Sovereign Personal AI Assistant](specs/sovereign-personal-ai-assistant.md)
- [Pattern: Local Inference Architecture](patterns/local-inference-architecture.md)
