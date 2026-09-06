# AFFILIATE OS — TESTING, QA & DELIVERY

## Required Tests
- domain unit tests for commission/revenue rules
- integration tests for tracking/conversion ingestion
- API auth/tenant/validation tests
- security tests for cross-tenant access
- idempotency/retry tests
- attribution integrity tests
- end-to-end money-loop test
- prototype UX/responsive checks

## Release Evidence
Record commit, test results, build result, deployment URL/environment, smoke checks, and known limitations.

## Financial Acceptance
No duplicate commission/revenue records on retry; every canonical financial record has source/reference evidence and tenant context.
