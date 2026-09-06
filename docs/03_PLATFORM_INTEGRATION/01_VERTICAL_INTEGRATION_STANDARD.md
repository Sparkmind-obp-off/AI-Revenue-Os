# Vertical Integration Standard

**Version:** 1.0  
**Status:** Master Integration Contract  
**Owner:** AI Revenue OS

## 1. Purpose

Dokumen ini menetapkan standar agar setiap vertical tetap berada di repository sendiri, tetapi dapat terhubung secara resmi ke AI Revenue OS.

AI Revenue OS adalah **platform/master operating layer**, bukan monorepo yang menampung seluruh source code vertical.

## 2. Canonical Architecture

```text
                         AI REVENUE OS
                 Master Platform / Control Plane
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       API Contract    Event Contract   Integration Registry
          │                │                │
     ┌────┴────┐      ┌────┴────┐      ┌────┴────┐
     │         │      │         │      │         │
  Affiliate   QIMA  Affiliate   QIMA  Affiliate   QIMA
    Repo      Repo    Repo      Repo    Registry  Registry

        Separate repositories / shared contracts / one platform
```

## 3. Repository Rule

Setiap vertical **MUST** tetap independent:

- `AI-Revenue-Os` = master platform and contracts
- `Affiliate.os` = Affiliate OS implementation
- `QIMA` = QIMA implementation
- future verticals = repository masing-masing

Vertical tidak boleh menjadi fork dari master platform hanya agar terintegrasi.

## 4. Integration Layers

Vertical dapat terhubung melalui:

1. **REST/HTTP API** — primary application-to-application boundary.
2. **Events/Webhooks** — asynchronous revenue or operational events.
3. **Orchestration** — Make, Workers, queues, schedulers, or equivalent execution layer.
4. **MCP** — optional AI/tool interface; bukan pengganti application API.
5. **Plugin/Capability Manifest** — optional discovery and capability declaration.

API adalah kontrak utama. MCP dan plugin berada di atas kontrak tersebut ketika memang diperlukan.

## 5. Vertical Registration

Setiap vertical yang resmi terhubung harus memiliki registration record minimal:

```yaml
vertical_id: affiliate-os
name: Affiliate OS
version: 1.0
status: active
repository: Sparkmind-obp-off/Affiliate.os
api_contract_version: v1
base_api_url: https://example.com/api
capabilities:
  - affiliate_products
  - offers
  - links
  - clicks
  - conversions
  - commissions
  - revenue
health_endpoint: /api/v1/health
integration_mode:
  api: true
  events: true
  mcp: false
  plugin: false
owner: vertical-team
```

## 6. Minimum Integration Contract

A vertical is integration-ready when it provides:

- stable `vertical_id`
- repository identity
- API version
- health endpoint
- authentication/authorization contract
- tenant context
- request correlation ID
- idempotency strategy for external writes
- error contract
- event contract where applicable
- capability declaration
- integration documentation

## 7. Tenancy

Vertical APIs must preserve tenant isolation. A request from one tenant must never read or mutate another tenant's data merely because an identifier is known.

Tenant context must be resolved and authorized server-side.

## 8. Versioning

Contracts are versioned independently from implementation repositories.

Breaking API changes require a new major contract version and migration/deprecation plan. Additive, backward-compatible changes may remain within the same major version.

## 9. Health and Observability

Every integrated vertical should expose a health endpoint and support:

- request/correlation ID
- structured errors
- integration logs
- latency/error observability
- dependency status where appropriate

## 10. Source-of-Truth Rule

AI Revenue OS owns **shared semantics and integration governance**. The vertical owns its domain implementation and vertical-specific operational state.

No orchestration tool, AI agent, spreadsheet, or connector may silently become the canonical financial source of truth.

## 11. Integration Gate

A vertical may be marked `active` only after its registration, API contract, security boundary, health check, and required event/idempotency behavior have been reviewed.
