# AFFILIATE OS — DATA & API CONTRACT

## Core Entities
AffiliateProgram, AffiliateProduct, AffiliateOffer, AffiliateLink, Click, Conversion, Commission, AttributionRecord, RevenueRecord, ContentAsset, Distribution, PerformanceMetric.

## Required Relationships
```text
Program → Product → Offer → Link
Link → Click → Conversion → Commission → Revenue
Content → Distribution → Link/Offer
```

## API Categories
- discovery/products
- offers
- content/distribution
- tracking
- conversions
- commissions
- revenue
- performance
- recommendations

## Contract Rules
All mutations are tenant-scoped and server-authorized. External event ingestion must be idempotent. Financial values use exact decimal precision and explicit currency.
