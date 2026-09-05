# AI REVENUE OS — PHASE 1 EXECUTION PROMPT

**Version:** 1.0  
**Status:** Ready for execution  
**Authority:** AI Revenue OS Master Blueprint  
**Primary Vertical:** Affiliate OS  
**Target Repository:** `Sparkmind-obp-off/Affiliate.os`

---

## 1. Mission

Execute Phase 1 of AI Revenue OS against the existing Affiliate OS repository.

The goal is **not to rewrite Affiliate OS**. The goal is to inspect the existing implementation, map it against the AI Revenue OS Master Blueprint, identify conflicts and gaps, and produce an implementation-ready plan for Phase 2.

**Governing principle:**

> Build the revenue loop first. Build the operating system from proven revenue loops. AI optimizes the system; AI is not the system.

---

## 2. Source of Truth

Treat these as authoritative in this order:

1. AI Revenue OS Master Blueprint.
2. Existing Affiliate OS repository implementation and contracts.
3. Existing database/schema/migrations.
4. Existing tests and CI configuration.
5. Existing deployment/configuration artifacts.

Do not introduce a second architecture, authentication model, tenancy model, or competing source of truth without explicit justification.

---

## 3. Required Inspection

Before changing code, inspect the Affiliate OS repository comprehensively:

- repository tree and package structure
- README and architecture documents
- application entry points
- API routes and contracts
- domain modules
- database schema and migrations
- identity, tenancy, and RBAC
- Opportunity Engine
- Demand
- Creator Fit
- Content Opportunity
- Content Generation
- Distribution foundations
- Performance
- Revenue
- Experiment
- Recommendation
- Automation
- Data
- Security
- Connectors/integrations
- tests
- CI/CD
- deployment configuration
- environment variable usage
- TODO/FIXME/deferred implementations
- mock/stub implementations
- external service assumptions

Do not assume that a module is production-ready merely because a folder, interface, or route exists.

---

## 4. Classification Contract

Every significant existing component must be classified as exactly one primary status:

- `KEEP`
- `REFACTOR`
- `MOVE_TO_SHARED_CORE`
- `AFFILIATE_SPECIFIC`
- `REMOVE`
- `MISSING`
- `BLOCKED`
- `DEFERRED`

For each classification provide evidence: file/path, current behavior, contract, dependency, and reason.

---

## 5. Required Audit Deliverables

Create an audit package covering:

### 5.1 Repository Audit Report

Explain the current state, architecture, implementation maturity, risks, and major findings.

### 5.2 Module Status Matrix

Map every relevant module to its classification and implementation status.

### 5.3 Revenue-Core Mapping Matrix

Map existing capabilities to the canonical revenue loop:

`Market Signal → Research → Validate → Opportunity → Offer/Product → Content/Distribution → Traffic → Lead → Sale/Transaction → Fulfillment → Retention/Upsell/Referral → Revenue Data → AI Optimization → Next Action`

### 5.4 Affiliate-Specific Boundary Matrix

Separate generic AI Revenue OS concepts from Affiliate OS-specific concepts.

### 5.5 API Surface Audit

Inspect routes, request/response contracts, validation, authentication, tenancy, idempotency, and error behavior.

### 5.6 Database/Schema Audit

Inspect tables, relationships, indexes, constraints, monetary types, currency handling, tenant scoping, timestamps, migrations, and lifecycle integrity.

### 5.7 Integration Audit

Identify current and assumed integrations, connector boundaries, provider coupling, webhook handling, retries, and missing adapters.

### 5.8 Security & Tenancy Audit

Verify tenant isolation, authorization, RBAC reuse, secret handling, input validation, auditability, and cross-tenant test coverage.

### 5.9 AI Boundary Audit

Verify that AI is used for intelligence, generation, analysis, recommendation, and prioritization—not as the source of truth for payment, commission, revenue, authorization, security, or financial state.

### 5.10 Automation Boundary Audit

Verify that Make/API/Workers/Queues/Workflows execute orchestration but do not own core financial/domain logic.

### 5.11 Technical Debt Register

Record technical debt with severity, impact, evidence, and recommended disposition.

### 5.12 Architecture Conflict Register Update

Explicitly assess known conflicts, including:

- PostgreSQL vs Cloudflare Workers runtime
- Redis/S3 assumptions vs Workers deployment model
- canonical monorepo assumptions vs actual repository structure
- module contract stubs vs concrete implementations
- live PostgreSQL verification
- opportunity persistence lifecycle
- Content Generation vs Distribution module boundaries

### 5.13 Revenue Loop Gap Analysis

Identify exactly which links in the Affiliate Money Loop are missing, incomplete, mocked, non-deterministic, or non-auditable.

### 5.14 Phase 2 Implementation Plan

Produce a concrete implementation sequence for the smallest reliable Affiliate Money Loop.

---

## 6. Canonical Affiliate Money Loop

The target Phase 2 loop is:

`Discover → Validate → Select → Create → Distribute → Track → Convert → Commission → Revenue → Measure → Next Action`

Required domain path:

`Merchant → Affiliate Program → Affiliate Product → Affiliate Offer → Affiliate Link → Click → Conversion → Commission → Revenue`

Revenue entities must be evaluated against:

- Order
- OrderItem
- Payment
- Transaction
- Commission
- Revenue
- Expense

---

## 7. Determinism & Financial Integrity

Flag any implementation that makes financial truth dependent on AI output.

Attribution must be:

- deterministic
- auditable
- reproducible
- tenant-safe
- idempotent

Financial values must use exact monetary precision and explicit currency.

Click, conversion, commission, payment, revenue, webhook, and publishing operations must be assessed for idempotency.

Mock or simulated revenue must never be represented as real production revenue.

---

## 8. Human Approval Boundary

Human approval remains required for:

- publishing
- campaign activation
- pricing changes
- material strategy changes

Explicit approval is required for:

- money movement
- refunds
- permission/security changes
- destructive production actions

AI may recommend these actions but must not silently execute them.

---

## 9. Testing Audit

Inspect and report coverage for:

- unit tests
- integration tests
- API tests
- tenancy/security tests
- end-to-end tests
- duplicate-event/idempotency tests
- cross-tenant isolation tests
- financial calculation tests

The intended E2E trace is:

`Demand → Opportunity → Validation → Product → Content → Review → Distribution → Click → Conversion → Commission → Revenue → Performance`

Each stage must be traceable by stable identifiers.

---

## 10. Phase 2 Implementation Order

After the audit, Phase 2 must be planned in this order:

1. Revenue Domain Foundation
2. Affiliate Product/Offer Mapping
3. Attribution Foundation
4. Distribution Foundation
5. Click Tracking
6. Conversion Tracking
7. Commission Tracking
8. Revenue Recording
9. Performance Measurement
10. End-to-End Integration
11. Testing
12. Production Readiness

Do not skip directly to advanced AI optimization.

---

## 11. Explicit Non-Goals

Do not expand Phase 1 or Phase 2 into:

- full social scheduler
- full CRM
- full email marketing platform
- full payment gateway
- full payout engine
- multi-platform affiliate suite
- autonomous AI agent
- autonomous campaign manager
- large analytics dashboard
- mobile app
- multi-vertical abstraction prematurely
- complex subscription engine

---

## 12. Shared-Core Rule

Do not extract a component into shared core merely because it looks reusable.

A component should move toward shared core only when:

1. semantics are generic,
2. ownership is clear,
3. contract is stable,
4. behavior is proven,
5. it is reusable by at least two verticals.

Until then, keep the implementation in the owning vertical.

---

## 13. Execution Rules

Use this workflow:

`Inspect → Map → Identify Conflicts → Plan → Implement Only If Authorized → Test → Review → Commit`

For this Phase 1 document, the default action is **audit first**.

Do not rewrite architecture merely to make it look cleaner.

Do not delete working code without evidence.

Do not create duplicate abstractions when an existing contract can be reused.

Do not silently change financial semantics.

Do not auto-start Phase 2 after completing the audit.

---

## 14. Required Final Audit Output

The final Phase 1 report must answer:

1. What already works?
2. What is only a foundation/stub?
3. What is production-safe?
4. What is architecturally conflicting?
5. What is missing from the Affiliate Money Loop?
6. What should remain Affiliate-specific?
7. What, if anything, is ready for shared core?
8. What must be fixed before revenue testing?
9. What exact files/modules should Phase 2 change?
10. What is the smallest end-to-end path that can prove real affiliate revenue flow?

End the audit with a clear **GO / NO-GO / GO-WITH-CONDITIONS** decision for Phase 2.

---

## 15. QIMA / Ecosystem Placement Rule

QIMA must not be treated as the master architecture itself.

The hierarchy is:

`AI Revenue Ecosystem`

→ `AI Revenue OS` — master operating-system architecture and governance

→ `Verticals / Products`

→ `QIMA` — a product/vertical that may integrate into the ecosystem according to its actual business domain and revenue loop

Therefore:

- `AI-Revenue-Os` owns the cross-vertical architecture, principles, contracts, and governance.
- A QIMA repository should own QIMA-specific product/domain implementation.
- QIMA should consume or conform to AI Revenue OS contracts where appropriate.
- QIMA should not dump all product-specific code into the AI-Revenue-Os master repository unless the repository is intentionally being converted into a monorepo.
- QIMA becomes part of the ecosystem by **alignment and integration**, not by physically placing every QIMA file inside the master repository.

If QIMA is confirmed to be a revenue-producing vertical/product, it can be registered as a vertical under the ecosystem and mapped to the AI Revenue OS revenue-loop contracts.

---

## 16. Definition of Done

Phase 1 is complete only when:

- the existing Affiliate OS repository has been inspected,
- every major module has a classification,
- revenue-loop gaps are documented,
- architecture conflicts are documented,
- security and tenancy have been audited,
- AI and automation boundaries have been audited,
- financial/data integrity risks are identified,
- tests and CI status are understood,
- Phase 2 has an exact implementation order,
- unresolved blockers are explicitly listed,
- and a GO/NO-GO decision is recorded.

**Phase 1 must not be considered complete merely because a report file exists. The report must be evidence-based from the actual Affiliate OS repository.**
