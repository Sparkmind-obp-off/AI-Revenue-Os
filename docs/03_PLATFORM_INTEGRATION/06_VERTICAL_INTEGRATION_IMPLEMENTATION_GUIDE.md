# Vertical Integration Implementation Guide

**Version:** 1.0  
**Status:** Master Implementation Guide  
**Owner:** AI Revenue OS  
**Applies to:** All independent Revenue OS vertical repositories

---

## 1. Purpose

Dokumen ini adalah playbook implementasi standar untuk menghubungkan vertical repository ke **AI Revenue OS**.

Tujuannya agar setiap vertical tidak membuat pola integrasi sendiri-sendiri. Setiap vertical mengikuti urutan yang sama:

```text
Identify
  ↓
Register
  ↓
Audit
  ↓
Expose Contract
  ↓
Authorize
  ↓
Declare Capabilities
  ↓
Publish Events (if needed)
  ↓
Integrate Orchestration
  ↓
Test
  ↓
Harden
  ↓
Activate
```

Guide ini bersifat implementasi. Ia melengkapi:

- `01_VERTICAL_INTEGRATION_STANDARD.md` sebagai governing standard.
- `02_VERTICAL_API_CONTRACT.md` sebagai API contract.
- `03_VERTICAL_REGISTRY.md` sebagai registry contract.
- `04_ORCHESTRATION_AND_MCP_PLUGIN_STANDARD.md` sebagai orchestration/MCP/plugin guidance.
- vertical-specific integration contract seperti `05_QIMA_REVENUE_OS_INTEGRATION_CONTRACT.md`.

---

## 2. Core Architecture Rule

Setiap vertical tetap berada di repository sendiri.

```text
                    AI REVENUE OS
                  Master Control Plane
                          │
             Shared Integration Contracts
                          │
          ┌───────────────┼────────────────┐
          │               │                │
     Affiliate OS       QIMA       Future Vertical
       Repo/API        Repo/API         Repo/API
          │               │                │
       Domain DB       Domain DB        Domain DB
```

### Non-negotiable

- Jangan merge source code vertical ke master hanya demi integrasi.
- Jangan membuat fork vertical dari Revenue OS.
- Jangan membuat shared database sebagai shortcut.
- Jangan bypass vertical domain/API layer.
- Jangan menjadikan Make, MCP, plugin, AI, atau spreadsheet sebagai canonical domain/financial authority.
- API adalah primary application integration boundary.

---

## 3. Integration Lifecycle

Setiap vertical mengikuti lifecycle berikut.

| Step | Output | Gate |
|---|---|---|
| V0 | Vertical identity | Identitas jelas |
| V1 | Registry record | Terdaftar |
| V2 | Repository audit | Boundary dipahami |
| V3 | Integration surface | Health/meta/capabilities |
| V4 | Authorization | Tenant/scope aman |
| V5 | Capability contract | Capability callable |
| V6 | Event contract | Async boundary valid bila diperlukan |
| V7 | Orchestration | Workflow lintas sistem valid |
| V8 | Optional AI interfaces | MCP/plugin bila justified |
| V9 | Integration tests | Contract terverifikasi |
| V10 | Security/observability | Operationally safe |
| V11 | Activation | Registry `active` |

Tidak boleh melompati gate hanya karena vertical sudah mempunyai UI atau deployment.

---

## 4. V0 — Define Vertical Identity

Sebelum integrasi, tentukan identitas vertical.

Minimum:

```yaml
vertical_id: <stable-id>
name: <display-name>
version: <application-version>
repository: <owner/repository>
api_contract_version: v1
status: planned
```

### Identity rules

`vertical_id` harus:

- stabil
- unik
- tidak bergantung pada domain deployment
- tidak berubah hanya karena branding/UI berubah.

Contoh:

```yaml
vertical_id: affiliate-os
name: Affiliate OS
repository: Sparkmind-obp-off/Affiliate.os
```

---

## 5. V1 — Register the Vertical

Tambahkan vertical ke registry master sebelum menyatakan integrasi resmi.

Template minimum:

```yaml
vertical_id: <vertical-id>
name: <Vertical Name>
version: 1.0
status: planned
repository: <owner/repository>
owner: <owner>
api_contract_version: v1
integration:
  api: true
  events: false
  orchestration: false
  mcp: false
  plugin: false
endpoints:
  health: /api/v1/health
  meta: /api/v1/meta
  capabilities: /api/v1/capabilities
```

### Rule

`planned` berarti:

> Vertical sudah didefinisikan untuk integrasi, tetapi belum lolos activation gate.

`active` hanya boleh diberikan setelah seluruh required checks selesai.

---

## 6. V2 — Audit the Existing Repository

**Audit before rewrite.**

Jangan langsung membuat ulang vertical hanya karena kontraknya belum sama.

Audit minimal:

### Architecture

- framework/runtime
- deployment target
- routing
- API structure
- application/domain layer
- persistence/data access
- external connectors

### Security

- authentication
- authorization
- tenant model
- organization/unit scope
- secret handling
- IDOR exposure

### Existing API

- health endpoint
- metadata endpoint
- domain endpoints
- error format
- request context

### Existing business logic

- source of truth
- financial logic
- attribution logic
- state transitions
- idempotency

### Existing observability

- logs
- correlation IDs
- error tracking
- request timing
- audit trail

Output audit wajib diklasifikasikan:

```text
KEEP
ADAPT
ADD
MOVE_TO_SHARED_CORE
VERTICAL_SPECIFIC
REMOVE
DEFERRED
BLOCKED
```

Tidak ada refactor besar tanpa alasan yang terukur.

---

## 7. V3 — Implement the Minimum Integration Surface

Setiap integrated vertical wajib memiliki:

```text
GET /api/v1/health
GET /api/v1/meta
GET /api/v1/capabilities
```

### 7.1 Health

Health menjawab apakah service dapat menerima integration traffic.

Contoh:

```json
{
  "status": "ok",
  "vertical_id": "<vertical-id>",
  "contract_version": "v1",
  "timestamp": "<iso-8601>"
}
```

Jangan masukkan secrets atau internal infrastructure details.

### 7.2 Meta

Meta minimal menjelaskan:

- vertical ID
- application version
- environment
- contract version
- integration modes.

### 7.3 Capabilities

Capabilities hanya boleh mendaftarkan behavior yang benar-benar tersedia.

Contoh:

```json
{
  "vertical_id": "affiliate-os",
  "capabilities": [
    "affiliate.products",
    "affiliate.offers"
  ]
}
```

Jangan declare capability hanya untuk membuat registry terlihat lengkap.

---

## 8. V4 — Establish Authentication and Tenant Boundary

Authentication dan authorization harus dipisahkan.

```text
Authenticated caller
        ↓
Identify tenant/context
        ↓
Authorize requested capability
        ↓
Authorize resource scope
        ↓
Execute domain operation
```

Minimum request context yang direkomendasikan:

```text
Authorization: <credential>
X-Tenant-Id: <tenant>
X-Correlation-Id: <trace-id>
Idempotency-Key: <key>       # when applicable
```

### Critical rule

Mengetahui `tenant_id`, `organization_id`, atau `unit_id` **tidak sama dengan memiliki akses**.

Authorization harus diverifikasi server-side oleh vertical.

### Tenant isolation checklist

- [ ] tenant context validated server-side
- [ ] resource belongs to requested tenant
- [ ] cross-tenant access rejected
- [ ] client-provided IDs are not trusted blindly
- [ ] privileged operations audited
- [ ] credentials scoped to minimum required access

---

## 9. V5 — Define Capabilities

Capability adalah kontrak behavior, bukan sekadar endpoint name.

Setiap capability minimal memiliki:

```yaml
id: <stable-capability-id>
owner: <vertical>
version: v1
purpose: <what it does>
input: <input contract>
output: <output contract>
authorization: <required scope>
idempotency: <required/optional>
side_effects: <none/read/write/financial>
```

Contoh:

```yaml
id: affiliate.products
version: v1
purpose: Read affiliate product catalog
side_effects: read
```

Untuk write capability:

```yaml
id: affiliate.conversions.record
version: v1
purpose: Record a validated affiliate conversion
side_effects: write
idempotency: required
```

### Capability rule

Semakin besar side effect, semakin ketat contract, authorization, audit, dan idempotency requirement-nya.

---

## 10. V6 — Define Events Only When There Is a Real Consumer

Events digunakan untuk asynchronous propagation, bukan karena event architecture terlihat lebih canggih.

Use events when:

- consumer tidak membutuhkan synchronous response
- ada beberapa consumer
- workflow perlu decoupling
- event history bernilai
- external integration memang asynchronous.

Do not add events when a simple API call is sufficient.

### Standard event envelope

```json
{
  "event_id": "evt_123",
  "event_type": "<vertical>.<entity>.<action>",
  "version": "v1",
  "tenant_id": "tenant_123",
  "entity_id": "entity_123",
  "occurred_at": "<iso-8601>",
  "source": "<vertical-id>",
  "correlation_id": "corr_123",
  "idempotency_key": "idem_123",
  "payload": {}
}
```

### Event rules

- event IDs are stable
- event types are namespaced
- versions are explicit
- tenant context is preserved
- source identifiers are preserved
- consumers tolerate duplicate delivery
- sensitive data is minimized

---

## 11. V7 — Add Orchestration

Orchestration digunakan ketika satu workflow melewati lebih dari satu system boundary.

Preferred pattern:

```text
Trigger / Event / Schedule
          ↓
Revenue OS Orchestrator
          ↓
Vertical API
          ↓
Vertical Domain Service
          ↓
Vertical DB
```

Orchestrator may:

- sequence calls
- retry transient failures
- schedule work
- correlate execution
- invoke connectors
- invoke AI
- record execution metadata.

Orchestrator may not:

- directly write vertical database
- replace vertical business rules
- bypass authorization
- become canonical vertical truth
- perform hidden financial mutations.

---

## 12. V8 — Optional MCP and Plugin Interfaces

### MCP

MCP is justified when an AI/tool client needs structured capability discovery or invocation.

```text
AI Agent
   ↓
MCP
   ↓
Authorized Vertical API
   ↓
Domain Service
```

MCP is not required for basic integration.

### Plugin manifest

Plugin metadata may describe:

- identity
- capabilities
- API version
- optional MCP availability.

Manifest is discovery metadata only. It does not replace authorization or domain contracts.

### Adoption rule

Use this order:

```text
API
 → Events if needed
 → Orchestration if needed
 → MCP if proven useful
 → Plugin discovery if ecosystem complexity justifies it
```

---

## 13. V9 — Integration Testing

Every vertical must test the integration boundary independently from its internal unit tests.

### Contract tests

- [ ] health response valid
- [ ] meta response valid
- [ ] capabilities response valid
- [ ] API version declared
- [ ] error schema stable

### Security tests

- [ ] unauthenticated request rejected
- [ ] unauthorized scope rejected
- [ ] cross-tenant request rejected
- [ ] IDOR scenarios rejected
- [ ] sensitive errors sanitized

### Reliability tests

- [ ] duplicate idempotent write safe
- [ ] retry does not duplicate side effects
- [ ] transient dependency failure classified correctly
- [ ] correlation ID preserved

### Event tests

If events are enabled:

- [ ] envelope valid
- [ ] event version valid
- [ ] tenant context preserved
- [ ] duplicate event safely handled
- [ ] consumer behavior verified

### End-to-end test

At least one real integration journey must be traceable:

```text
Revenue OS
  ↓
Vertical API
  ↓
Vertical domain operation
  ↓
Vertical state change/event
  ↓
Revenue OS consumer/orchestrator
```

For financial flows, extend the trace through the canonical financial record.

---

## 14. V10 — Security and Observability Hardening

### Security minimum

- authentication
- authorization
- tenant isolation
- least privilege
- secret isolation
- input validation
- rate limiting where appropriate
- audit logging for sensitive actions
- idempotency for relevant writes

### Observability minimum

Every cross-system request should expose enough information to trace:

```text
source
→ target
→ operation
→ tenant/context
→ correlation ID
→ outcome
→ latency
→ retry count
→ error class
```

Do not expose secrets or sensitive payloads merely to improve logs.

---

## 15. Financial Integration Rules

Financial capabilities require a higher gate.

Before mapping any vertical event to Revenue OS financial semantics, answer:

1. What business fact occurred?
2. Which system owns that fact?
3. What is the canonical financial record?
4. What is the source identifier?
5. What is the currency?
6. What is the exact amount?
7. What prevents duplicate recording?
8. How is reconciliation performed?
9. What happens on retry/failure?
10. How can the record be traced back to the source vertical?

### Forbidden shortcut

```text
Vertical
 → Make
 → Spreadsheet
 → AI calculation
 → Revenue
```

### Preferred

```text
Vertical business event
 → Integration adapter
 → Revenue OS canonical financial contract
 → Deterministic domain processing
 → Canonical revenue record
```

AI may analyze or recommend around the financial flow, but it must not become the sole authority for canonical money truth.

---

## 16. Prototype / Demo Integration

Prototype integration is allowed when implementation time is limited, but it must preserve the production contract conceptually.

```text
Prototype
UI
 ↓
Mock Adapter
 ↓
Simulated Vertical Contract
```

Production:

```text
UI / Orchestrator
 ↓
Real Vertical API
 ↓
Real Domain
 ↓
Real Database
```

### Prototype rules

- clearly label simulated behavior
- never use demo state as production truth
- never store real secrets in mock code
- preserve conceptual API/capability names
- do not create fake financial truth that can be mistaken for real revenue.

A successful demo does not automatically mean integration is production-ready.

---

## 17. Versioning and Compatibility

Integration contracts must be versioned independently from UI branding.

Breaking changes require:

1. impact assessment
2. contract version decision
3. migration/deprecation plan
4. consumer testing
5. registry update
6. rollout/rollback plan.

### Compatible changes

Generally safe without a new major contract version:

- adding optional response metadata
- adding a new independent capability
- adding non-breaking event fields where consumers tolerate them.

### Potentially breaking changes

- changing meaning of an existing field
- removing fields
- changing authorization semantics
- changing financial semantics
- changing identifier meaning
- changing event type semantics.

When uncertain, treat the change as potentially breaking and perform impact analysis.

---

## 18. Failure and Rollback Strategy

Integration must assume external failure.

Classify failures as:

```text
VALIDATION
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
DUPLICATE
RATE_LIMITED
TRANSIENT_DEPENDENCY
PERMANENT_DEPENDENCY
INTERNAL
```

### Retry

Retry only failures that are safe and expected to be transient.

### No retry

Do not blindly retry:

- validation errors
- authorization failures
- permanent business conflicts
- already-completed non-idempotent actions.

### Rollback

For multi-step workflows, define whether failure requires:

- retry
- compensation
- manual intervention
- no action because operation is already safely complete.

Financial rollback must follow the canonical financial domain rules rather than deleting records casually.

---

## 19. Standard Vertical Integration Folder Template

A vertical implementation should keep integration-specific documentation easy to locate.

Recommended inside the vertical repository:

```text
docs/
└── integration/
    ├── 01_INTEGRATION_CONTRACT.md
    ├── 02_API_CONTRACT.md
    ├── 03_CAPABILITY_CATALOG.md
    ├── 04_EVENT_CONTRACT.md
    ├── 05_AUTH_TENANT_BOUNDARY.md
    ├── 06_ORCHESTRATION.md
    ├── 07_TEST_PLAN.md
    └── 08_PRODUCTION_READINESS.md
```

Not every vertical needs every file on day one. The folder is a recommended organization pattern, not a mandatory implementation burden.

---

## 20. Copy-Paste Integration Checklist

### Identity

- [ ] stable vertical ID defined
- [ ] repository ownership defined
- [ ] application version defined
- [ ] contract version defined

### Registry

- [ ] registry entry created
- [ ] status starts as `planned`
- [ ] endpoint metadata declared

### Audit

- [ ] existing architecture audited
- [ ] existing API audited
- [ ] auth/tenant boundary audited
- [ ] financial source of truth audited
- [ ] existing events audited

### API

- [ ] `/api/v1/health`
- [ ] `/api/v1/meta`
- [ ] `/api/v1/capabilities`
- [ ] stable error contract
- [ ] correlation ID support

### Security

- [ ] authentication
- [ ] authorization
- [ ] tenant isolation
- [ ] IDOR protection
- [ ] secret isolation

### Capabilities

- [ ] capability IDs stable
- [ ] input/output contract defined
- [ ] side effects declared
- [ ] authorization declared
- [ ] idempotency declared where required

### Events

- [ ] only added for real use cases
- [ ] event envelope valid
- [ ] version defined
- [ ] duplicate delivery safe
- [ ] source/correlation preserved

### Orchestration

- [ ] API-first
- [ ] no direct DB writes
- [ ] retries classified
- [ ] workflow traceable

### Optional interfaces

- [ ] MCP only if justified
- [ ] plugin only if justified
- [ ] neither bypasses API/domain authorization

### QA

- [ ] contract tests
- [ ] security tests
- [ ] idempotency tests
- [ ] event tests if applicable
- [ ] end-to-end integration test

### Production gate

- [ ] observability verified
- [ ] failure handling verified
- [ ] financial mapping approved if applicable
- [ ] documentation complete
- [ ] registry status changed only after gate passes

---

## 21. Integration Evidence Package

Before activation, the vertical should produce a small evidence package:

```text
1. Repository/version reference
2. Integration contract
3. Registry record
4. API endpoint verification
5. Capability verification
6. Auth/tenant test evidence
7. Event test evidence (if applicable)
8. End-to-end trace
9. Security checklist
10. Observability verification
11. Financial mapping approval (if applicable)
12. Known limitations / deferred items
```

Evidence is more important than a claim that “integration is done.”

---

## 22. Activation Gate

A vertical may move from `planned` to `active` only when:

```text
Contract
   ✓
Registry
   ✓
API
   ✓
Auth/Tenant
   ✓
Capabilities
   ✓
Events (if required)
   ✓
Orchestration (if required)
   ✓
Security
   ✓
Observability
   ✓
Integration Tests
   ✓
Financial Semantics (if applicable)
   ✓
```

If any required item is missing, the vertical remains `planned`, `candidate`, or another explicitly documented pre-activation state.

---

## 23. Standard Implementation Order

The recommended implementation sequence is intentionally minimal:

```text
STEP 01 — Identity
STEP 02 — Registry
STEP 03 — Audit
STEP 04 — Health
STEP 05 — Meta
STEP 06 — Capabilities
STEP 07 — Auth + Tenant Boundary
STEP 08 — Domain Capability APIs
STEP 09 — Events where needed
STEP 10 — Orchestration where needed
STEP 11 — MCP/plugin only if justified
STEP 12 — Integration Tests
STEP 13 — Security + Observability
STEP 14 — Production Readiness
STEP 15 — Activation
```

Do not implement STEP 11 before STEP 04–10 are stable.

---

## 24. Decision Rules for New Verticals

When adding a new vertical, ask these questions before writing integration code:

### Q1 — Is this actually a separate vertical?

If it is only a feature of an existing vertical, do not create a new vertical repository.

### Q2 — Does it own a distinct domain?

If yes, keep the domain in its own boundary.

### Q3 — What must Revenue OS know?

Expose only the minimum required capabilities/events.

### Q4 — What must Revenue OS never own?

Keep vertical-specific domain state, authorization, and internal business rules inside the vertical.

### Q5 — Is money actually involved?

If no, do not invent financial mappings.

### Q6 — Is async behavior actually needed?

If no, prefer API over events.

### Q7 — Does AI need tool access?

If no, do not add MCP merely for architecture completeness.

---

## 25. Canonical Principle

The purpose of integration is not to make every vertical look identical.

The purpose is to make different verticals **interoperable without destroying their domain boundaries**.

```text
ONE REVENUE OS
        │
        ├── Shared Contracts
        ├── Shared Revenue Semantics
        ├── Shared Orchestration Standards
        └── Shared Governance
                │
                ├── Affiliate OS — independent domain
                ├── QIMA — independent domain
                └── Future Vertical — independent domain
```

> **Integrate through contracts. Keep ownership at the domain boundary. Build only the integration complexity that a real use case requires.**

---

## 26. Related Documents

- `docs/00_MASTER_BLUEPRINT/AI_REVENUE_OS_MASTER_BLUEPRINT.md`
- `docs/03_PLATFORM_INTEGRATION/01_VERTICAL_INTEGRATION_STANDARD.md`
- `docs/03_PLATFORM_INTEGRATION/02_VERTICAL_API_CONTRACT.md`
- `docs/03_PLATFORM_INTEGRATION/03_VERTICAL_REGISTRY.md`
- `docs/03_PLATFORM_INTEGRATION/04_ORCHESTRATION_AND_MCP_PLUGIN_STANDARD.md`
- `docs/03_PLATFORM_INTEGRATION/05_QIMA_REVENUE_OS_INTEGRATION_CONTRACT.md`

---

**Status:** Ready as the generic implementation playbook for future vertical integrations.  
**Next use:** Apply this guide to Affiliate OS and QIMA integration execution after their respective audit/gates are approved.
