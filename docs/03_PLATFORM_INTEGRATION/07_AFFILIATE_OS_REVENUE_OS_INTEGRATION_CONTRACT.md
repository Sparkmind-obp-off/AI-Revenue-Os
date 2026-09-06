# Affiliate OS ↔ AI Revenue OS Integration Contract

**Version:** 1.0  
**Status:** Integration Blueprint / Contract Defined  
**Owner:** AI Revenue OS + Affiliate OS  
**Affiliate OS Repository:** `Sparkmind-obp-off/Affiliate.os`  
**Revenue OS Repository:** `Sparkmind-obp-off/AI-Revenue-Os`

---

## 1. Purpose

Dokumen ini mendefinisikan kontrak resmi antara **Affiliate OS** sebagai vertical revenue implementation dan **AI Revenue OS** sebagai master revenue platform/control plane.

Kontrak ini memastikan Affiliate OS tetap independent repository, memiliki domain ownership sendiri, dan dapat diorkestrasi oleh Revenue OS tanpa menggabungkan database, source code, atau domain rules secara sembarangan.

> **Rule utama:** Affiliate OS owns affiliate-domain truth. AI Revenue OS owns shared revenue semantics, cross-vertical orchestration, integration governance, and revenue intelligence. No connector, AI agent, spreadsheet, or automation layer may silently become canonical financial truth.

Affiliate OS saat ini sudah memiliki API v1, workspace tenancy, Clerk-based identity boundary, RBAC, deterministic opportunity/demand/creator/content foundations, dan PostgreSQL persistence. Kontrak ini mengatur bagaimana capability tersebut nantinya diekspos secara resmi ke Revenue OS; kontrak ini tidak mengklaim seluruh revenue loop Affiliate OS sudah production-complete.

---

## 2. Architectural Position

```text
                         AI REVENUE OS
                  Master Revenue Control Plane
                             │
                  Integration Contract v1
                             │
             ┌───────────────┼───────────────┐
             │               │               │
          API Boundary   Event Boundary   Registry
             │               │               │
             └───────────────┼───────────────┘
                             │
                       AFFILIATE OS
                    Independent Vertical Repo
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
 Opportunity / Demand   Creator / Content   Future Revenue Loop
       │                     │                     │
       └─────────────────────┴─────────────────────┘
```

Affiliate OS is **not** a child folder of Revenue OS and is **not** a fork of Revenue OS.

Revenue OS integrates through explicit contracts and authorized APIs/events.

---

## 3. Repository Ownership

| Concern | AI Revenue OS | Affiliate OS |
|---|---|---|
| Master revenue architecture | Owns | Consumes |
| Shared revenue semantics | Owns | Consumes |
| Affiliate domain model | Does not own | Owns |
| Affiliate database | Does not own | Owns |
| Affiliate domain API | Integration consumer | Owns |
| Opportunity/demand/creator/content domain | Shared semantic governance only | Owns implementation |
| Affiliate attribution rules | Shared contract governance | Owns vertical implementation |
| Commission calculation rules | Shared financial contract | Owns affiliate-specific rule implementation |
| Revenue orchestration | Owns/shared execution contract | Exposes authorized capabilities |
| Affiliate-specific UI | Does not own | Owns |
| Integration registry | Owns governance | Supplies identity/capabilities |

A change in Affiliate OS domain logic must not be moved into Revenue OS merely to make integration easier.

---

## 4. Affiliate OS Identity

Canonical registration identity:

```yaml
vertical_id: affiliate-os
name: Affiliate OS
version: 1.0
status: planned
repository: Sparkmind-obp-off/Affiliate.os
api_contract_version: v1
integration_mode:
  api: true
  events: true
  mcp: optional
  plugin: optional
```

`status` remains `planned` until the integration acceptance gate in this document is satisfied. Existing Affiliate OS production/foundation status must not be confused with Revenue OS integration activation.

---

## 5. Affiliate Domain Boundary

Affiliate OS owns the affiliate-specific money loop:

```text
Market Signal
→ Product Opportunity
→ Validate
→ Select Product
→ Offer
→ Content
→ Distribution
→ Click
→ Conversion
→ Commission
→ Revenue
→ Performance
→ Next Action
```

Canonical affiliate relationship:

```text
Merchant
  ↓
Affiliate Program
  ↓
Affiliate Product
  ↓
Affiliate Offer
  ↓
Affiliate Link
  ↓
Click
  ↓
Conversion
  ↓
Commission
  ↓
Revenue
```

The domain boundary is intentionally vertical-specific. Affiliate concepts must not be generalized into Revenue OS entities until shared semantics are proven.

### Anti-mapping rules

```text
Affiliate Product  ≠ Revenue OS Product by default
Affiliate Offer    ≠ Revenue OS Offer by default
Affiliate Program  ≠ Revenue OS Campaign by default
Affiliate Click    ≠ Revenue OS Lead by default
Affiliate Conversion ≠ Revenue OS Order by default
Affiliate Commission ≠ Revenue OS Revenue by default
Affiliate Performance ≠ Revenue OS Analytics aggregate by default
```

A mapping becomes canonical only when business semantics, ownership, lifecycle, identifiers, and financial consequences are explicitly defined.

---

## 6. Tenant and Workspace Context

Affiliate OS currently uses workspace-owned tenancy and authenticated request context.

Integration rule:

```text
Revenue OS tenant context
          ↓
Authorized Affiliate OS workspace context
          ↓
Workspace-owned affiliate records
```

Revenue OS must never infer authorization merely from a known `workspace_id`.

Affiliate OS remains responsible for validating authenticated identity, workspace membership, role/permission, resource ownership, and tenant scope on its side of the boundary.

A future shared tenant mapping must preserve the Affiliate OS workspace model rather than silently replacing it.

---

## 7. Mandatory Integration API

Before activation, Affiliate OS must expose or align with the shared integration surface:

```text
GET /api/v1/health
GET /api/v1/meta
GET /api/v1/capabilities
```

The existing Affiliate OS API remains versioned under `/api/v1`; integration alignment should be additive and must not break existing verified routes.

### 7.1 Health

Minimum conceptual response:

```json
{
  "status": "ok",
  "vertical_id": "affiliate-os",
  "contract_version": "v1",
  "timestamp": "2026-01-01T00:00:00Z"
}
```

Health must distinguish application availability from dependency health where appropriate.

### 7.2 Metadata

`GET /api/v1/meta` should expose, at minimum:

- vertical ID
- application version
- environment
- integration/API contract version
- supported integration modes

No secrets, tokens, credentials, or sensitive infrastructure details may be returned.

### 7.3 Capabilities

Conceptual initial capability registration should be conservative:

```json
{
  "vertical_id": "affiliate-os",
  "capabilities": [
    "affiliate.opportunities",
    "affiliate.demand",
    "affiliate.creators",
    "affiliate.content-opportunities",
    "affiliate.content-generation"
  ]
}
```

Future capabilities may include:

```text
affiliate.programs
affiliate.products
affiliate.offers
affiliate.links
affiliate.clicks
affiliate.conversions
affiliate.commissions
affiliate.performance
affiliate.revenue
```

A capability must not be registered merely because it appears in the roadmap. It must represent real callable behavior with a stable contract and authorization boundary.

---

## 8. Request Contract

Protected cross-system requests should carry the shared integration context:

```text
Authorization: <deployment-specific credential>
X-Tenant-Id: <revenue-os-tenant>
X-Correlation-Id: <trace-id>
Idempotency-Key: <unique-key>   # when applicable
```

Affiliate OS must map the request to an authorized workspace/context using server-side rules.

Credentials must never be hardcoded into source code, prompts, demo data, or documentation examples.

---

## 9. Error Contract

Affiliate OS integration endpoints must preserve stable machine-readable errors.

Example:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied for requested Affiliate OS scope",
    "correlation_id": "corr_123"
  }
}
```

Minimum integration classes:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `DUPLICATE_REQUEST`
- `RATE_LIMITED`
- `DEPENDENCY_ERROR`
- `INTERNAL_ERROR`

Internal stack traces, credentials, SQL details, and sensitive provider data must not cross the boundary.

---

## 10. Affiliate Capability Contract

Revenue OS should consume Affiliate OS through domain capabilities rather than direct database access.

### Current foundation capabilities

The existing Affiliate OS foundation supports deterministic and tenant-scoped domains around:

- Opportunity evaluation and persistence
- Demand signals
- Creator profiles and deterministic fit evaluation
- Content opportunities
- Content generation specifications/artifacts

These are useful upstream revenue-loop capabilities, but they do not by themselves constitute the full click → conversion → commission → revenue implementation.

### Future money-loop capabilities

The next revenue-loop capabilities should be added only with explicit contracts:

```text
affiliate.products
affiliate.programs
affiliate.offers
affiliate.links
affiliate.clicks
affiliate.conversions
affiliate.commissions
affiliate.performance
affiliate.revenue
```

Each capability should define:

- input schema
- output schema
- authorization requirement
- tenant/workspace scope
- stable identifiers
- lifecycle/status vocabulary
- idempotency behavior where writes occur
- error behavior
- audit requirements
- source references

---

## 11. Affiliate Attribution Contract

Attribution is a core Affiliate OS concern and must remain evidence-first.

Canonical trace should be:

```text
Revenue
 ↓
Commission
 ↓
Conversion / Order Reference
 ↓
Click / Affiliate Link
 ↓
Distribution
 ↓
Content
 ↓
Offer / Product
 ↓
Opportunity
 ↓
Market Signal
```

Every attributable financial record should preserve source identifiers and available upstream context.

Attribution must not be inferred solely from AI-generated suggestions.

When an external affiliate network provides conversion data, Affiliate OS must preserve the external reference and normalize it into a deterministic internal record.

Duplicate external deliveries must not create duplicate conversions, commissions, or revenue records.

---

## 12. Commission and Revenue Contract

Affiliate-specific financial truth must be deterministic.

A conceptual lifecycle is:

```text
Conversion
   ↓
Commission Calculation / Validation
   ↓
Commission Record
   ↓
Revenue Recognition
   ↓
Performance Measurement
```

The system must explicitly define, before production activation:

- commission basis
- commission amount
- currency
- commission status
- source network/program
- external transaction/conversion identifier
- attribution reference
- tenant/workspace ownership
- timestamps
- settlement/payment status where applicable
- reconciliation behavior
- idempotency key/reference

AI may recommend, classify, forecast, or detect anomalies around commissions and revenue, but AI must not be the sole authority for canonical monetary values.

No floating-point representation should be used for canonical monetary records. Use exact decimal/NUMERIC semantics with explicit currency.

---

## 13. Financial Source-of-Truth Rule

The initial boundary is:

### Affiliate OS owns

- affiliate-domain operational state
- affiliate program/product/offer/link state
- click/conversion source references
- affiliate-specific commission rules
- affiliate-specific attribution implementation
- source-network references
- vertical authorization

### AI Revenue OS owns

- shared revenue semantics
- cross-vertical revenue representation
- cross-vertical attribution semantics where explicitly delegated
- revenue intelligence
- optimization signals
- cross-vertical orchestration
- integration governance

For every financial fact there must be one canonical financial record and a stable source reference.

Do not independently write the same commission/revenue fact into Affiliate OS, Revenue OS, Make, spreadsheets, and AI memory.

If a future architecture requires a canonical financial record to live in Revenue OS while Affiliate OS remains the operational source, that migration must be explicitly designed, versioned, reconciled, and approved rather than assumed by this document.

---

## 14. Event Boundary

Affiliate OS may publish events when a real consumer/use case exists.

Potential operational events:

```text
affiliate.opportunity.created
affiliate.content-opportunity.created
affiliate.content.generated
affiliate.click.recorded
affiliate.conversion.recorded
affiliate.commission.recorded
affiliate.performance.updated
```

Where a shared Revenue OS event vocabulary exists, an adapter may translate vertical events into canonical events only when semantics match.

Example:

```text
Affiliate OS
conversion.recorded
        ↓
Integration Adapter
        ↓
Revenue OS canonical event
affiliate.conversion.recorded
        ↓
Revenue processing / orchestration
```

Event envelope must contain:

- event ID
- event type
- version
- tenant context
- aggregate/entity ID
- timestamp
- source
- correlation/trace ID
- payload
- idempotency key where applicable

Events are not permission bypasses and are not automatically financial truth.

---

## 15. Revenue Event Mapping

The canonical Affiliate OS relationship may eventually map into the shared Revenue OS financial lifecycle:

```text
Affiliate Conversion
        ↓
Affiliate Commission
        ↓
Revenue OS Revenue
```

The mapping must preserve:

- affiliate conversion ID
- commission ID
- affiliate program/product/offer identifiers
- external network reference
- currency
- amount
- tenant/workspace context
- timestamp
- correlation ID
- source system

A conversion must not become a Revenue OS Order merely because both represent a commercial event. The mapping requires explicit business semantics.

---

## 16. Orchestration Contract

Preferred cross-repository workflow:

```text
Trigger / Schedule / Affiliate Event
              ↓
AI Revenue OS Orchestrator
              ↓
Authorized Affiliate OS API
              ↓
Affiliate Application / Domain Service
              ↓
Affiliate OS Database
```

The orchestrator may:

- call Affiliate OS capabilities
- sequence cross-vertical workflows
- retry transient failures
- correlate events
- schedule permitted work
- invoke AI recommendations
- record execution metadata

The orchestrator may not:

- direct-write Affiliate OS database
- bypass Affiliate OS authorization
- calculate affiliate commission externally as canonical truth
- mutate revenue state without the canonical domain/financial contract
- turn an AI recommendation directly into an irreversible financial action

---

## 17. MCP Boundary

MCP is optional.

If AI agents later need structured Affiliate OS tools, preferred flow is:

```text
AI Agent
   ↓
MCP Tool
   ↓
Authorized Affiliate OS API
   ↓
Affiliate Domain
   ↓
Database
```

MCP does not replace the application API and must not bypass tenant isolation, RBAC, financial validation, or audit requirements.

MCP should be introduced only after the API contract is stable.

---

## 18. Plugin / Capability Manifest

A future discovery manifest may describe Affiliate OS to the Revenue OS control plane:

```yaml
id: affiliate-os
name: Affiliate OS
contract_version: v1
capabilities:
  - affiliate.opportunities
  - affiliate.demand
  - affiliate.creators
  - affiliate.content-opportunities
  - affiliate.content-generation
integration:
  api: true
  events: true
  mcp: false
```

The manifest is discovery metadata only. It does not replace API authorization, tenancy, domain validation, or financial contracts.

---

## 19. Prototype vs Production Boundary

Affiliate OS integration must distinguish prototype/mockup behavior from production revenue truth.

```text
Prototype UI / Mock Data / Simulated Events
                 ≠
Production Affiliate Revenue Integration
```

A Revenue OS prototype may use a simulated Affiliate OS adapter to demonstrate:

```text
Signal → Opportunity → Offer → Content → Distribution → Click → Conversion → Commission → Revenue
```

but the prototype must visibly declare that the financial result is simulated.

Production integration must use real Affiliate OS APIs, real authorization, real external references, deterministic financial processing, and real persistence.

No demo data may be silently promoted into production financial truth.

---

## 20. Idempotency Rules

Idempotency is mandatory for externally triggered durable or financial operations.

Relevant examples:

```text
external conversion webhook
click ingestion where duplicate delivery is possible
commission creation
revenue event ingestion
network settlement update
workflow retry
```

The deduplication key should be derived from a stable external/business reference plus the relevant tenant/program context, not from an AI-generated value.

Duplicate delivery must resolve safely without duplicate commission or revenue records.

---

## 21. Security Rules

Integration must preserve:

- server-side authorization
- workspace/tenant isolation
- least privilege
- credential isolation
- auditability of sensitive actions
- no direct DB access from Revenue OS orchestration
- no secrets in source code or documentation
- validation of client-provided scope identifiers
- explicit permission checks for sensitive affiliate actions

An authenticated Revenue OS request is not automatically authorized to every Affiliate OS workspace.

---

## 22. Observability

Every cross-system request should be traceable using:

- `X-Correlation-Id`
- source system
- target system
- capability/operation
- outcome
- latency
- error classification
- retry count

Important financial traces should preserve:

```text
Revenue OS action
 → Affiliate OS request
 → Affiliate entity/event
 → External network reference
 → Commission
 → Canonical revenue record
```

Financial reconciliation must be possible from source reference to canonical record.

---

## 23. Compatibility and Versioning

Affiliate OS can evolve independently.

Integration-breaking changes require:

1. contract impact assessment
2. versioning where required
3. migration/deprecation plan
4. consumer compatibility testing
5. registry update if capability/version changes

Additive, backward-compatible capability additions do not require a new major contract version unless shared semantics change.

Affiliate OS implementation versions and integration contract versions should remain independently identifiable.

---

## 24. Implementation Phases

### A0 — Contract Defined

- this contract exists and is reviewed
- Affiliate OS remains independent repository
- registry identity is defined
- no Revenue OS integration activation claim

### A1 — Affiliate OS Integration Audit

Audit current Affiliate OS for:

- health/meta/capabilities surface
- API routing and versioning
- Clerk identity boundary
- workspace/tenant authorization
- RBAC enforcement
- existing domain capabilities
- error envelope
- correlation support
- idempotency readiness
- event capability
- observability

Output:

```text
KEEP
ADAPT
ADD
MOVE_TO_SHARED_CONTRACT
AFFILIATE_SPECIFIC
DEFERRED
BLOCKED
```

No rewrite before audit.

### A2 — Integration Surface Alignment

Implement or align:

```text
GET /api/v1/health
GET /api/v1/meta
GET /api/v1/capabilities
```

Preserve existing verified Affiliate OS routes and architecture.

### A3 — Capability Integration

Expose stable capabilities one by one with explicit authorization and tenant/workspace behavior.

Initial focus should be upstream capabilities already implemented, not unfinished financial modules.

### A4 — Attribution + Event Integration

Add click/conversion/commission events only when their underlying domain capabilities exist and there is a real consumer.

### A5 — Revenue Mapping

Only after a real monetized Affiliate OS flow exists:

- define financial semantics
- define canonical ownership
- map external references
- implement deterministic commission logic
- implement idempotency
- define reconciliation
- test end-to-end

### A6 — Production Integration Activation

Only after security, contract, health, capability, event, idempotency, observability, and end-to-end financial tests pass may the registry move from `planned` to `active`.

---

## 25. Recommended Implementation Order

```text
1. Contract + registry
        ↓
2. Health / Meta / Capabilities
        ↓
3. Auth + Workspace/Tenant Context
        ↓
4. Existing Affiliate Capabilities
        ↓
5. Opportunity / Content integration
        ↓
6. Distribution / Click tracking
        ↓
7. Conversion tracking
        ↓
8. Commission engine
        ↓
9. Revenue mapping
        ↓
10. Events / Webhooks
        ↓
11. Orchestration
        ↓
12. MCP / Plugin (optional)
        ↓
13. End-to-End financial verification
        ↓
14. Activation
```

The order is intentionally API-first and evidence-first.

---

## 26. Explicit Non-Goals

This contract does **not** require:

- moving Affiliate OS into Revenue OS
- merging repositories
- merging databases
- rewriting Affiliate OS architecture
- making Affiliate OS a generic revenue framework
- exposing every Affiliate OS endpoint
- adding MCP immediately
- adding a plugin system immediately
- implementing every affiliate revenue capability now
- turning AI into canonical financial authority
- creating a giant cross-vertical abstraction before a second proven vertical exists
- connecting prototype/mock financial data directly to production
- replacing Affiliate OS authorization with Revenue OS orchestration

---

## 27. Integration Acceptance Gate

Affiliate OS may move from `planned` to `active` only when all applicable checks pass:

- [ ] repository identity verified
- [ ] integration contract version declared
- [ ] `/api/v1/health` verified
- [ ] `/api/v1/meta` verified
- [ ] `/api/v1/capabilities` verified
- [ ] API authentication contract verified
- [ ] workspace/tenant isolation verified
- [ ] RBAC/permission enforcement verified
- [ ] stable error contract verified
- [ ] correlation ID propagation verified
- [ ] idempotency behavior verified for applicable writes
- [ ] capability contracts reviewed
- [ ] event contract reviewed where events are enabled
- [ ] no direct database writes from Revenue OS/orchestrator
- [ ] prototype/demo boundary verified
- [ ] observability verified
- [ ] integration tests pass
- [ ] financial mapping reviewed before any revenue activation
- [ ] reconciliation strategy defined for financial flows
- [ ] registry updated to `active`

Until these checks pass, Affiliate OS is an **independent vertical with an integration blueprint**, not an activated Revenue OS vertical.

---

## 28. Canonical Decision Rule

When deciding whether a new Affiliate OS capability belongs in the vertical or in Revenue OS:

```text
Does the rule describe affiliate-specific behavior?
        ↓ YES → Affiliate OS
        ↓ NO
Is it shared revenue semantics used by multiple verticals?
        ↓ YES → Revenue OS
        ↓ NO
Is it cross-system execution/orchestration?
        ↓ YES → Orchestrator / Integration Layer
        ↓ NO
Keep it local until the semantic boundary is proven.
```

This prevents premature abstraction while keeping the architecture ready for scale.

---

## 29. Final Contract Principle

> **Affiliate OS remains an independent revenue vertical. AI Revenue OS remains the master revenue operating layer. They integrate through explicit contracts, APIs, events, and controlled orchestration — never through hidden coupling or shared database shortcuts.**
