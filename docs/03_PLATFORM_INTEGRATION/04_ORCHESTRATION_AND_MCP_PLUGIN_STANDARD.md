# Orchestration, MCP & Plugin Standard

**Version:** 1.0  
**Status:** Master Integration Guidance

## 1. Core Decision

AI Revenue OS menggunakan **API sebagai primary vertical integration boundary**.

MCP dan plugin bukan pengganti API. Keduanya adalah optional interfaces untuk use case yang tepat.

## 2. Responsibility Matrix

| Mechanism | Fungsi utama | Wajib? |
|---|---|---|
| API | Application-to-application integration | **Ya** |
| Events/Webhooks | Async event propagation | Sesuai kebutuhan |
| Orchestrator | Menjalankan workflow lintas repo/service | Sesuai kebutuhan |
| MCP | Memberikan capability kepada AI/tool clients | Opsional |
| Plugin manifest | Discovery/capability declaration | Opsional |

## 3. Orchestrator Pattern

```text
                   AI REVENUE OS
                        │
                 Orchestration Layer
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
      Affiliate        QIMA       Future Vertical
         API            API            API
          │             │              │
       Domain         Domain         Domain
          │             │              │
          DB            DB             DB
```

Orchestrator boleh mengatur sequence, retry, scheduling, notifications, connector calls, dan AI invocation.

Orchestrator **tidak boleh** menjadi pemilik canonical revenue truth atau bypass authorization/domain rules.

## 4. MCP

MCP digunakan ketika AI agent perlu menemukan atau memanggil capability vertical secara terstruktur.

Contoh konseptual:

```text
AI Agent
   ↓
MCP Tool
   ↓
Authorized Vertical API
   ↓
Domain Service
   ↓
Database
```

MCP server tidak boleh menjadi jalan pintas untuk menulis langsung ke canonical financial tables.

## 5. Plugin Manifest

Jika ekosistem membutuhkan dynamic discovery, vertical dapat menyediakan manifest:

```json
{
  "vertical_id": "affiliate-os",
  "contract_version": "v1",
  "capabilities": [
    "affiliate.products",
    "affiliate.offers",
    "affiliate.clicks",
    "affiliate.conversions",
    "affiliate.commissions"
  ],
  "api": {
    "version": "v1"
  },
  "mcp": {
    "enabled": false
  }
}
```

Manifest adalah metadata/discovery contract, bukan business-domain authority.

## 6. Security Boundary

All mechanisms must preserve:

- authentication
- authorization
- tenant isolation
- auditability
- rate limiting where appropriate
- secret isolation
- input validation
- idempotency for relevant writes

## 7. Recommended Adoption Order

Do not build all integration mechanisms at once.

```text
1. API contract
2. Health + auth + tenant boundary
3. Domain API integration
4. Events/webhooks where required
5. Orchestration workflows
6. MCP only when an AI/tool use case is proven
7. Plugin discovery only when multiple dynamic capabilities justify it
```

This keeps the first implementation minimal and avoids premature platform abstraction.
