# QIMA ↔ AI Revenue OS Integration Contract

**Version:** 1.0  
**Status:** Integration Blueprint / Contract Defined  
**Owner:** AI Revenue OS + QIMA  
**QIMA Repository:** `Sparkmind-obp-off/Qima`  
**Revenue OS Repository:** `Sparkmind-obp-off/AI-Revenue-Os`

---

## 1. Purpose

Dokumen ini mendefinisikan bagaimana **QIMA** dapat terhubung secara resmi ke **AI Revenue OS** tanpa memindahkan source code QIMA ke repository Revenue OS, tanpa membuat fork, dan tanpa mengubah QIMA menjadi generic revenue framework.

Tujuan integrasi adalah membuat boundary yang jelas antara:

- **QIMA** sebagai domain/application platform untuk organisasi, unit, program, activity, participant, dan domain QIMA lainnya.
- **AI Revenue OS** sebagai master revenue operating layer yang mengelola shared revenue semantics, revenue intelligence, orchestration, integration governance, dan cross-vertical revenue workflows.

> **Rule utama:** QIMA tetap menjadi source of truth untuk domain QIMA. AI Revenue OS menjadi source of truth untuk shared revenue semantics dan revenue orchestration. Tidak ada sistem perantara yang boleh diam-diam menjadi financial source of truth.

---

## 2. Architectural Position

```text
                    AI REVENUE OS
              Master Revenue Control Plane
                         │
              Integration Contract v1
                         │
              ┌──────────┴──────────┐
              │                     │
          API Boundary          Event Boundary
              │                     │
              └──────────┬──────────┘
                         │
                       QIMA
              Independent Vertical Repo
                         │
        ┌────────────────┼────────────────┐
        │                │                │
 Organization         Unit          Domain Modules
                                  Program / Activity /
                                  Participant / future
```

QIMA **bukan child folder** di dalam Revenue OS.

QIMA **bukan fork** dari Revenue OS.

QIMA terdaftar sebagai vertical/candidate integration melalui registry dan berkomunikasi melalui contract yang disepakati.

---

## 3. Repository Ownership

| Concern | AI Revenue OS | QIMA |
|---|---|---|
| Revenue OS architecture | Owns | Consumes contract |
| Revenue semantics | Owns shared semantics | Does not redefine |
| QIMA domain model | Does not own | Owns |
| QIMA database | Does not own | Owns |
| QIMA domain APIs | Integration consumer | Owns |
| QIMA deployment | Governance only | Owns |
| Revenue orchestration | Owns/shared execution contract | Exposes authorized capabilities |
| QIMA-specific UI | Does not own | Owns |
| Shared integration contract | Owns standard | Implements |

Perubahan pada QIMA domain tidak boleh dipaksakan masuk ke Revenue OS hanya demi integrasi.

---

## 4. QIMA Identity

Canonical registration identity:

```yaml
vertical_id: qima
name: QIMA
version: 1.0
status: planned
repository: Sparkmind-obp-off/Qima
api_contract_version: v1
health_endpoint: /api/v1/health
integration_mode:
  api: true
  events: true
  mcp: optional
  plugin: optional
```

`status` tetap `planned` sampai integration gate pada dokumen ini terpenuhi. Status registry tidak boleh disimpulkan hanya karena repository QIMA sudah berjalan.

---

## 5. QIMA Domain Boundary

QIMA saat ini memiliki domain yang tetap berada di QIMA, termasuk:

- Organization
- Unit
- User / access context
- Program
- Activity
- Participant
- audit/settings dan domain pendukung lainnya

Domain tersebut **tidak otomatis menjadi revenue entities**.

Contoh:

```text
QIMA Program       ≠ Revenue OS Product
QIMA Activity      ≠ Revenue OS Campaign
QIMA Participant   ≠ Revenue OS Customer
QIMA Registration  ≠ Revenue OS Order
```

Mapping hanya boleh dilakukan apabila terdapat business semantics yang benar-benar sama dan kontraknya disepakati.

---

## 6. Tenant and Organization Context

QIMA memiliki konsep organization dan unit. Revenue OS memiliki tenant context.

Integration rule:

```text
Revenue OS tenant context
          ↓
     QIMA authorized context
          ↓
Organization / Unit scope
```

Tenant mapping **tidak berarti** menghapus atau mengganti model Organization/Unit QIMA.

QIMA tetap melakukan authorization terhadap organization/unit scope menggunakan aturan server-side miliknya.

Revenue OS tidak boleh mengakses QIMA data hanya karena mengetahui `organization_id` atau `unit_id`.

---

## 7. Mandatory Integration API

QIMA harus menyediakan shared integration endpoints berikut pada saat integration implementation dimulai:

```text
GET /api/v1/health
GET /api/v1/meta
GET /api/v1/capabilities
```

### 7.1 Health

`GET /api/v1/health`

Minimum response:

```json
{
  "status": "ok",
  "vertical_id": "qima",
  "contract_version": "v1",
  "timestamp": "2026-01-01T00:00:00Z"
}
```

### 7.2 Metadata

`GET /api/v1/meta`

Minimum information:

- vertical ID
- QIMA application version
- environment
- API contract version
- supported integration modes

No secrets or sensitive credential material may be returned.

### 7.3 Capabilities

`GET /api/v1/capabilities`

Initial conceptual capability set:

```json
{
  "vertical_id": "qima",
  "capabilities": [
    "qima.organizations",
    "qima.units",
    "qima.programs",
    "qima.activities",
    "qima.participants"
  ]
}
```

Capabilities must represent real, callable behavior. Do not register capabilities before their contract and authorization behavior exist.

---

## 8. Request Contract

Protected integration requests should carry the shared context required by Revenue OS integration standards:

```text
Authorization: <deployment-specific credential>
X-Tenant-Id: <tenant>
X-Correlation-Id: <trace>
Idempotency-Key: <unique-key>   # when applicable
```

QIMA remains responsible for validating that the authenticated caller is authorized to access the requested organization/unit scope.

Credentials must never be hardcoded into source code, prompts, demo data, or documentation examples.

---

## 9. Error Contract

QIMA integration endpoints must return stable machine-readable errors.

Example:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied for requested QIMA scope",
    "correlation_id": "corr_123"
  }
}
```

Minimum error classes:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `DUPLICATE_REQUEST`
- `RATE_LIMITED`
- `DEPENDENCY_ERROR`
- `INTERNAL_ERROR`

Internal stack traces, secrets, database credentials, and sensitive implementation details must not cross the integration boundary.

---

## 10. QIMA → Revenue OS Event Boundary

QIMA may publish operational events when those events have value outside the QIMA boundary.

Examples:

```text
qima.organization.created
qima.unit.created
qima.program.created
qima.activity.created
qima.participant.created
qima.registration.created
```

These are **QIMA domain events**, not automatically Revenue OS financial events.

Revenue OS may consume them for:

- signal generation
- analytics
- opportunity discovery
- workflow triggering
- revenue-related orchestration when semantically valid

Example:

```text
QIMA registration.created
          ↓
Revenue OS event consumer
          ↓
Evaluate revenue relevance
          ↓
Opportunity / workflow / no-op
```

A QIMA event must not be converted into `order`, `payment`, `commission`, or `revenue` merely because an automation flow exists.

---

## 11. Revenue Event Mapping

If QIMA later introduces a genuine monetized workflow, the mapping must be explicit.

Example conceptual flow:

```text
QIMA domain action
      ↓
QIMA business event
      ↓
Revenue OS integration adapter
      ↓
Revenue OS canonical revenue event
      ↓
Deterministic revenue domain processing
```

For example, a future QIMA paid registration might produce a QIMA-specific event such as:

```text
qima.registration.payment-confirmed
```

Only after the financial semantics are explicitly defined may it map to a Revenue OS financial lifecycle such as:

```text
Order → Payment/Transaction → Revenue
```

The adapter must preserve source identifiers and correlation IDs so the revenue record remains traceable back to QIMA.

---

## 12. Financial Source-of-Truth Rule

If QIMA eventually handles money, the following distinction must remain explicit:

### QIMA owns

- QIMA business state
- registration/business status
- QIMA-specific payment state if QIMA is the payment-domain owner
- source identifiers
- domain authorization

### Revenue OS owns shared revenue semantics

- canonical revenue representation
- cross-vertical revenue analytics semantics
- attribution semantics where delegated to Revenue OS
- revenue optimization signals
- revenue orchestration

There must be **one canonical financial record for each financial fact**, with a stable reference to the originating QIMA record.

Do not duplicate the same financial truth independently in QIMA, Revenue OS, Make, spreadsheet, and AI memory.

---

## 13. Orchestration Contract

Preferred integration:

```text
Trigger / Schedule / Event
          ↓
Revenue OS Orchestrator
          ↓
QIMA API
          ↓
QIMA Application / Domain Service
          ↓
QIMA Database
```

The orchestrator may:

- call QIMA APIs
- trigger permitted workflows
- retry transient failures
- correlate events
- invoke AI recommendations
- record execution/audit metadata

The orchestrator may **not**:

- write directly to QIMA database
- bypass QIMA authorization
- calculate QIMA domain rules externally
- become the QIMA source of truth
- silently mutate financial state without the canonical domain contract

---

## 14. MCP Boundary

MCP may be added later if AI agents need structured access to QIMA capabilities.

MCP is an **AI/tool interface**, not the primary application integration boundary.

Recommended flow:

```text
AI Agent
   ↓
MCP Tool
   ↓
Authorized QIMA API
   ↓
QIMA Application / Domain
   ↓
Database
```

MCP must not bypass authorization or directly manipulate canonical financial data.

For the initial integration, MCP is optional and should not block API-first integration.

---

## 15. Plugin / Capability Manifest

A future plugin manifest may describe QIMA to the Revenue OS control plane.

Example:

```yaml
id: qima
name: QIMA
contract_version: v1
capabilities:
  - qima.organizations
  - qima.units
  - qima.programs
  - qima.activities
  - qima.participants
integration:
  api: true
  events: true
  mcp: false
```

The manifest is discovery metadata. It does not replace API authorization or domain contracts.

---

## 16. Prototype vs Production

QIMA currently has a presentation/demo surface that intentionally uses simulated interactions and does not write through the production data path.

Therefore:

```text
QIMA Demo
   ≠
QIMA Production Integration
```

Revenue OS integration must not connect to demo-only state as if it were production truth.

For prototype/mockup work, a simulated QIMA adapter is acceptable provided it is clearly marked as demo-only and preserves the same conceptual contract.

Production integration must use real QIMA APIs and real authorization/data paths after the relevant QIMA implementation gates are complete.

---

## 17. Initial Capability Mapping

| QIMA Capability | Revenue OS Treatment | Initial Status |
|---|---|---|
| Organizations | Tenant/context reference | Contract-level |
| Units | Tenant sub-scope/context | Contract-level |
| Programs | QIMA domain capability; possible future opportunity signal | No financial mapping |
| Activities | QIMA operational capability; possible future distribution/activity signal | No financial mapping |
| Participants | QIMA domain entity; not automatically Customer | No financial mapping |
| Registrations | QIMA business event; may become revenue trigger if monetized | Future |
| Payments | Only if/when QIMA owns a real payment workflow | Future |
| Revenue | Canonical Revenue OS financial semantics when explicitly integrated | Future |

This mapping is intentionally conservative to prevent premature abstraction.

---

## 18. Integration Implementation Phases

### Q0 — Contract Defined

- this document approved
- QIMA remains independent repository
- registry entry exists
- no production integration claim

### Q1 — Integration Surface Audit

Audit the current QIMA repository for:

- API routing
- authentication
- tenant/organization/unit authorization
- existing `/api/v1/health`
- existing `/api/v1/meta`
- existing domain endpoints
- event capability
- observability

Output: KEEP / ADAPT / ADD / DEFERRED / BLOCKED.

### Q2 — Shared Integration Endpoints

Implement or align:

```text
GET /api/v1/health
GET /api/v1/meta
GET /api/v1/capabilities
```

without disturbing existing verified QIMA domain behavior.

### Q3 — Domain Capability Integration

Expose only the QIMA capabilities that have stable contracts and authorization.

### Q4 — Event Integration

Add selected QIMA events where there is a real consumer/use case.

Events must support:

- event ID
- version
- tenant context
- entity ID
- timestamp
- source
- correlation ID
- idempotency where applicable
- payload

### Q5 — Revenue Mapping

Only when QIMA has a real monetized flow:

- define business semantics
- identify canonical financial owner
- map source identifiers
- define idempotency
- define reconciliation
- test end-to-end

### Q6 — Activation

Only after integration tests, security checks, health verification, observability, and contract review may registry status become `active`.

---

## 19. Idempotency Rules

Idempotency is mandatory for externally-triggered operations that may create or mutate durable or financial state.

Relevant future examples:

```text
payment confirmation
registration-to-order creation
revenue event ingestion
webhook processing
external workflow retry
```

Duplicate delivery must result in safe deduplication rather than duplicate financial records or duplicate irreversible actions.

---

## 20. Security Rules

The integration must preserve:

- server-side authorization
- tenant isolation
- organization/unit scope isolation
- least privilege
- credential isolation
- auditability of sensitive actions
- no direct database access from external orchestrators
- no secrets in repository/source
- no trust in client-provided scope identifiers without server validation

An authenticated Revenue OS request is **not automatically authorized** to every QIMA organization or unit.

---

## 21. Observability

Every cross-system request should be traceable using:

- `X-Correlation-Id`
- source system
- target system
- operation/capability
- outcome
- latency
- error classification
- retry count where applicable

For important financial flows, preserve the complete trace:

```text
Revenue OS action
 → QIMA request
 → QIMA entity/event
 → external transaction/reference
 → canonical revenue record
```

---

## 22. Compatibility Rules

QIMA may evolve independently, but integration-breaking changes require:

1. contract impact assessment
2. versioning where required
3. migration/deprecation plan
4. consumer compatibility testing
5. registry update if capability/version changes

Adding a new QIMA domain endpoint does not require a Revenue OS contract change unless the shared integration semantics change.

---

## 23. Explicit Non-Goals

This contract does **not** require:

- moving QIMA into the Revenue OS repo
- merging QIMA and Revenue OS databases
- rewriting QIMA architecture
- making QIMA a revenue-only application
- exposing every QIMA endpoint to Revenue OS
- adding MCP immediately
- adding a plugin system immediately
- turning QIMA Program/Activity/Participant into revenue entities without business justification
- duplicating QIMA UI inside Revenue OS
- replacing QIMA authorization with orchestration logic

---

## 24. Integration Acceptance Gate

QIMA can move from `planned` toward `active` only when all applicable checks pass:

- [ ] repository identity verified
- [ ] integration contract version declared
- [ ] `/api/v1/health` verified
- [ ] `/api/v1/meta` verified
- [ ] `/api/v1/capabilities` verified
- [ ] authentication contract verified
- [ ] tenant/organization/unit isolation verified
- [ ] stable error contract verified
- [ ] correlation ID propagated
- [ ] idempotency reviewed for applicable writes
- [ ] event envelope reviewed for published events
- [ ] orchestrator does not bypass QIMA domain
- [ ] no direct external database writes
- [ ] demo/prototype boundaries remain separate from production
- [ ] observability available
- [ ] integration tests pass
- [ ] financial mapping explicitly approved if applicable
- [ ] registry updated

Until then:

```text
QIMA = Planned / Contract Defined
```

not `ACTIVE`.

---

## 25. Canonical Decision

**QIMA tetap QIMA. AI Revenue OS tetap AI Revenue OS.**

Integrasi dilakukan melalui contract, bukan melalui repository merge.

```text
                  AI REVENUE OS
                       │
              Shared Integration Contract
                       │
              ┌────────┴────────┐
              │                 │
             API              Events
              │                 │
              └────────┬────────┘
                       │
                      QIMA
                       │
              QIMA Domain Truth
                       │
               QIMA Database
```

Revenue OS mengorkestrasi dan mengoptimalkan revenue loop. QIMA menjaga domain operasionalnya. Jika suatu saat QIMA menghasilkan revenue, integrasi financial dilakukan melalui mapping yang eksplisit, deterministik, dapat diaudit, dan idempotent.

---

## 26. Related Contracts

- `01_VERTICAL_INTEGRATION_STANDARD.md`
- `02_VERTICAL_API_CONTRACT.md`
- `03_VERTICAL_REGISTRY.md`
- `04_ORCHESTRATION_AND_MCP_PLUGIN_STANDARD.md`
- `docs/00_MASTER_BLUEPRINT/AI_REVENUE_OS_MASTER_BLUEPRINT.md`
- QIMA repository: `Sparkmind-obp-off/Qima`
