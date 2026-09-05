# AI Revenue OS

**Master Architecture & Source of Truth**

AI Revenue OS adalah arsitektur induk untuk membangun sistem operasi revenue yang dapat digunakan lintas vertical bisnis.

## Purpose

Repository ini menjadi **master repository** untuk:

- Master Blueprint AI Revenue OS
- Revenue Core dan domain contracts
- Intelligence / AI layer
- Automation & orchestration principles
- Shared architecture standards
- Vertical architecture mapping
- Execution governance dan traceability

Repository ini **bukan** tempat untuk langsung menampung seluruh source code setiap vertical.

## Core Principle

> Build the revenue loop first. Build the operating system from proven revenue loops. AI optimizes the system; AI is not the system.

## Revenue Loop

```text
Market Signal
  → Research
  → Validate
  → Opportunity
  → Offer / Product
  → Content / Distribution
  → Traffic
  → Lead
  → Sales / Transaction
  → Fulfillment
  → Retention / Upsell / Referral
  → Revenue Data
  → AI Optimization
  → Next Action
```

## Repository Relationship

```text
AI-Revenue-Os
│
├── Master Blueprint
├── Shared Revenue Core
├── Intelligence Layer
├── Automation Principles
├── Vertical Contracts
└── Execution Governance
        │
        └── Affiliate OS (Vertical #01)
```

The first implementation vertical is **Affiliate OS**, maintained in its own repository.

## Current Priority

1. Establish Master Blueprint
2. Audit existing Affiliate OS foundation
3. Implement the smallest reliable Affiliate Money Loop
4. Verify end-to-end revenue traceability
5. Harden security, tenancy, integrity, idempotency, and observability
6. Add AI optimization only around proven revenue data and workflows

## Important Boundaries

- GitHub is the engineering source of truth.
- Database is the source of truth for financial and operational state.
- AI is an intelligence layer, not a financial authority.
- Make / APIs / Workers / Queues execute workflows but should not own core business-domain truth.
- Human approval is required for publishing, campaigns, pricing, and other high-impact actions.
- Money movement, refunds, permissions/security, and destructive production actions require explicit authorization.
- Shared core extraction happens only after semantics and contracts are stable and reusable by at least two verticals.

## Master Blueprint

See:

`docs/00_MASTER_BLUEPRINT/AI_REVENUE_OS_MASTER_BLUEPRINT.md`

## Status

**v1.0 — Master architecture baseline**

This repository defines the governing architecture. It does not automatically authorize implementation of future phases; each phase must pass its own scope, readiness, testing, and acceptance gates.
