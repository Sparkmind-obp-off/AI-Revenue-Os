# Vertical API Contract

**Version:** v1  
**Status:** Master API Integration Standard

## 1. Purpose

Menetapkan API minimum yang harus disediakan setiap vertical agar dapat diorkestrasi oleh AI Revenue OS walaupun repository dan deployment berbeda.

## 2. Base Contract

```text
/api/v1/health
/api/v1/meta
/api/v1/capabilities
```

Domain endpoints tetap dimiliki vertical. AI Revenue OS hanya mensyaratkan kontrak integrasi bersama.

## 3. Health

`GET /api/v1/health`

Response minimum:

```json
{
  "status": "ok",
  "vertical_id": "affiliate-os",
  "contract_version": "v1",
  "timestamp": "2026-01-01T00:00:00Z"
}
```

## 4. Metadata

`GET /api/v1/meta`

Harus mengembalikan identity vertical, version, environment, API version, dan integration capabilities.

## 5. Capabilities

`GET /api/v1/capabilities`

Contoh:

```json
{
  "vertical_id": "affiliate-os",
  "capabilities": [
    "products",
    "offers",
    "links",
    "clicks",
    "conversions",
    "commissions",
    "revenue"
  ]
}
```

## 6. Request Headers

Untuk protected requests, vertical harus mendukung standar yang disepakati platform, termasuk:

- authentication credential/token
- `X-Tenant-Id` atau equivalent tenant context
- `X-Correlation-Id`
- `Idempotency-Key` untuk operasi yang dapat membuat/mengubah financial or externally-triggered state

Actual credential mechanism is deployment-specific and must never be hardcoded in source.

## 7. Response Contract

Success responses should use predictable JSON envelopes where practical.

Errors must expose a stable machine-readable code, human-readable message, correlation ID, and optional field details without leaking secrets.

Example:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "correlation_id": "corr_123"
  }
}
```

## 8. Financial Write Rule

Endpoints that create or mutate payments, conversions, commissions, revenue, refunds, or other canonical financial state must be deterministic, authorized, auditable, and idempotent where duplicate external delivery is possible.

AI-generated recommendations may initiate a workflow, but AI output alone is not financial truth.

## 9. Event/Webhook Boundary

Verticals may publish events to the orchestration/event layer using the shared event envelope:

```json
{
  "event_id": "evt_123",
  "event_type": "affiliate.commission.recorded",
  "version": 1,
  "tenant_id": "tenant_123",
  "entity_id": "commission_123",
  "occurred_at": "2026-01-01T00:00:00Z",
  "source": "affiliate-os",
  "correlation_id": "corr_123",
  "idempotency_key": "idem_123",
  "payload": {}
}
```

## 10. Orchestration

Preferred pattern:

```text
Trigger / Scheduler / External Event
              ↓
        Orchestrator
              ↓
       Vertical API
              ↓
       Domain Service
              ↓
          Database
```

The orchestrator coordinates execution; it does not own domain truth.

## 11. MCP Boundary

MCP may expose selected vertical capabilities to AI agents/tools. MCP should call the same authorized application/domain APIs rather than bypassing domain rules and directly manipulating canonical financial data.

## 12. Compatibility

A vertical may add endpoints freely, but must not break the shared v1 integration contract without versioning and migration planning.
