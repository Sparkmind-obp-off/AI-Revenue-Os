# AI Revenue OS — Affiliate OS Prototype

A high-fidelity, responsive SaaS prototype that demonstrates how **AI Revenue OS** turns affiliate market signals into measurable revenue and helps operators decide what to do next.

> **Prototype / Demo only.** All financial, attribution, conversion, and performance values are simulated. The application does not connect to payment systems, affiliate networks, social accounts, or production financial infrastructure.

## Product Goal

**AI Revenue OS turns market and affiliate signals into measurable revenue — then helps operators decide what to do next.**

Affiliate OS demonstrates this operating loop:

`Signal → Opportunity → Product → Offer → Content → Distribution → Click → Conversion → Commission → Revenue → Performance → AI Optimization → Next Action`

## Completed Features

- Premium dark-first Revenue Operating System interface
- Persistent workspace, vertical, date range, and DEMO MODE context
- Responsive sidebar and mobile navigation
- Revenue command center with coherent simulated IDR metrics
- Revenue and commission trend visualizations
- Opportunity discovery, filters, market signals, and AI scoring
- Product assessment, product comparison, and local selection state
- Offer and content workspace with simulated AI recommendations
- Distribution previews for TikTok, Instagram, YouTube, and website
- Attribution flow and simulated campaign table
- Conversion and commission ledger with validation states
- Product and channel performance ranking
- AI Revenue Intelligence cards with evidence, impact, confidence, and approval
- End-to-end revenue trace drawer from revenue to original market signal
- Loading, success, empty, simulated, toast, modal, drawer, and confirmation states
- Explicit AI authority boundaries and human approval language
- Hono health endpoint and Cloudflare Pages build configuration

## Application Routes

The prototype is a hash-routed single-page application:

- `/#/overview` — landing and revenue command center
- `/#/revenue` — revenue dashboard
- `/#/opportunities` — opportunity discovery
- `/#/products` — product assessment and selection
- `/#/offers` — offer and content workspace
- `/#/distribution` — channel distribution preview
- `/#/attribution` — click and revenue attribution
- `/#/conversions` — conversion ledger
- `/#/commissions` — commission state overview
- `/#/performance` — performance ranking and optimization
- `/#/recommendations` — AI Revenue Intelligence
- `/#/integrations` — simulated integration context
- `/#/settings` — workspace and account context
- `/api/health` — prototype health response

## Data Architecture

- **Data source:** Local mock data embedded in the frontend
- **Interaction state:** In-memory browser state
- **Storage:** None
- **Financial systems:** None
- **External API keys / OAuth:** None required
- **AI behavior:** Simulated recommendations only

The intended prototype flow is:

`UI → Mock Data → Local State → Simulated Interaction → Demo Result`

## User Guide

1. Start at Overview and inspect the visual revenue loop.
2. Open Opportunity Discovery and review an opportunity.
3. Select Creator Pro Toolkit on the product assessment screen.
4. Create an offer and generate simulated AI content recommendations.
5. Preview distribution channels.
6. Review attribution and click a row or **Trace Revenue**.
7. Continue through conversions, commissions, and performance.
8. Open an AI recommendation, review its evidence, and approve the demo action.

Approval only creates a local confirmation. No external system is modified.

## Development

```bash
npm install
npm run build
pm2 start ecosystem.config.cjs
```

Local preview runs on `http://localhost:3000`.

Production demo: https://ai-revenue-os-affiliate.pages.dev

## Deployment

- **Platform:** Cloudflare Pages
- **Runtime:** Hono + Cloudflare Workers
- **Frontend:** Semantic HTML, CSS, and vanilla JavaScript
- **Production URL:** https://ai-revenue-os-affiliate.pages.dev
- **Production status:** Active and verified on Cloudflare Pages (BYOK)
- **Secrets:** Not required

## Not Implemented by Design

- Real affiliate network integrations
- Production database or financial ledger
- Payment or payout processing
- Real social publishing
- Autonomous AI execution
- Real transaction ingestion
- Authentication or multi-tenant authorization

## Architecture Documentation

The governing master architecture remains available under `docs/`, including the master blueprint, execution standards, vertical contracts, platform integration, and audits.

## Recommended Next Steps

1. Conduct stakeholder usability testing on the end-to-end demo journey.
2. Validate the Affiliate OS domain model and event contracts.
3. Implement the smallest reliable affiliate money loop in a separate production vertical repository.
4. Add production storage and integrations only after security, tenancy, integrity, idempotency, and observability gates are approved.

_Last updated: 2026-09-06_
