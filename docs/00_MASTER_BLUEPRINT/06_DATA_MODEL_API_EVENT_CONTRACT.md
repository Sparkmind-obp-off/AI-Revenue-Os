# AI REVENUE OS — DATA MODEL, API & EVENT CONTRACT

## Canonical Entities
Tenant, User, Opportunity, Product, Offer, ContentAsset, Distribution, Lead, Customer, Click, Conversion, Order, Payment, Commission, Revenue, Expense, Attribution, PerformanceMetric, Recommendation, WorkflowRun, AuditEvent.

## Mandatory Financial Fields
- id
- tenant_id
- amount as NUMERIC/decimal
- currency
- status
- source/reference id
- occurred_at
- created_at/updated_at
- idempotency key where applicable

## Event Envelope
```text
id, type, version, tenant_id, aggregate_id, occurred_at,
source, correlation_id, idempotency_key, payload
```

## API Rules
- server-side authorization
- tenant scoping
- input validation
- stable error contract
- idempotent mutation where duplicate delivery is possible
- financial state never inferred solely from AI output

## Event Vocabulary
`opportunity.created`, `offer.created`, `content.published`, `affiliate.click.recorded`, `affiliate.conversion.recorded`, `affiliate.commission.recorded`, `payment.recorded`, `revenue.recorded`, `performance.updated`, `recommendation.created`, `next_action.created`.
