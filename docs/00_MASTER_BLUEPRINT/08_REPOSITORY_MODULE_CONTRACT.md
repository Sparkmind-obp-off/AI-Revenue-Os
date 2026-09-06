# AI REVENUE OS — REPOSITORY & MODULE CONTRACT

## Master Repository
`Sparkmind-obp-off/AI-Revenue-Os`

Owns master architecture, shared revenue semantics, standards, vertical mapping, and governance.

## Vertical Repository
`Sparkmind-obp-off/Affiliate.os`

Owns concrete Affiliate OS implementation.

## Recommended Module Boundaries
```text
apps/
  web/
  api/
packages/
  domain/
  application/
  data-access/
  contracts/
  intelligence/
  orchestration/
  connectors/
```

Exact structure may differ after the Affiliate OS audit; do not force a rewrite before evidence exists.

## Ownership Rule
Shared core owns generic semantics. Vertical owns affiliate-specific rules. External integrations remain connector boundaries.

## Change Rule
Preserve stable contracts; prefer incremental changes over broad rewrites.
