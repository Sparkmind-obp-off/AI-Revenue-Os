# Vertical Registry

**Version:** 1.0  
**Status:** Master Registry Specification

## 1. Purpose

Registry adalah daftar resmi vertical yang terhubung ke AI Revenue OS. Registry bukan database runtime; ini adalah governance/integration source yang mendefinisikan identity dan contract setiap vertical.

## 2. Current Registry

| Vertical | ID | Repository | Role | Status |
|---|---|---|---|---|
| Affiliate OS | `affiliate-os` | `Sparkmind-obp-off/Affiliate.os` | Vertical #01 | Planned / Integration Contract Defined |
| QIMA | `qima` | `Sparkmind-obp-off/Qima` | Candidate vertical | Planned / Integration Contract Defined |

Status `active` hanya boleh digunakan setelah integration gate terpenuhi.

## 3. Required Registration Fields

Every vertical registration should define:

- `vertical_id`
- `name`
- `version`
- `status`
- `repository`
- `api_contract_version`
- `base_api_url` per environment
- `health_endpoint`
- `capabilities`
- `integration_mode`
- `owner`

## 4. Capability Naming

Capabilities harus spesifik dan dapat dipahami oleh orchestrator. Hindari capability generik seperti `do_everything`.

Examples:

- `affiliate.products`
- `affiliate.conversions`
- `affiliate.commissions`
- `qima.programs`
- `qima.registrations`
- `qima.reporting`

## 5. Lifecycle

```text
PROPOSED
   ↓
CONTRACT_DEFINED
   ↓
INTEGRATION_READY
   ↓
ACTIVE
   ↓
DEPRECATED
   ↓
RETIRED
```

## 6. Registry Does Not Mean Monorepo

Registry hanya menyatakan bahwa sebuah repository adalah bagian resmi dari ekosistem AI Revenue OS. Source code vertical tetap berada di repository sendiri.

## 7. Environment Mapping

Satu vertical dapat memiliki deployment berbeda:

```text
affiliate-os
 ├── development → API endpoint A
 ├── staging     → API endpoint B
 └── production  → API endpoint C
```

Registry harus memungkinkan environment-specific endpoint/configuration tanpa mengubah vertical identity.

## 8. Ownership

AI Revenue OS menjaga standard dan registry. Vertical team menjaga implementation, domain data, deployments, and vertical-specific releases.

## 9. Activation Gate

Before `ACTIVE`:

- repository verified
- API contract implemented
- health endpoint reachable
- auth/tenant isolation verified
- error contract verified
- idempotency reviewed
- event contract reviewed where applicable
- observability available
- integration test evidence available
