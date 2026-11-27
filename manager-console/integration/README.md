# KWEIDER PRIVATE EVENTS — Cloud staging integration
27 November 2026. Development only; DO NOT merge or replace production.

## What exists
- Original customer layout copied to customer-preview.html with the original CSS, images and video.
- Original eight experience cards and 16 tier prices extracted from main. staging-seed.json is a public-only seed, not a live admin database.
- customer-preview.mjs adapts the existing builder to the resolved catalog and sends only an anonymous quote to /api/staging-quote; real request submission is disabled. The original production Worker URL is not used.
- staging-worker.mjs serves the preview with an ASSETS binding, reads the live Menu, resolves approved item references, fingerprints the resolved catalog and independently calculates the test quote. No Shopify credentials, no customer data, no production writes.
- quote-contract.test.mjs: 18 isolated function checks passed in JS runtime. Menu fixture verification against GitHub source: 143 parsed cards, 21 linked occurrences of 6 distinct items, original £400 rate preserved, Foul £7.75.
- No browser execution, Cloudflare runtime or live HTTP deployment test completed in this stage. Current V2.1.1 local admin is NOT connected to this preview yet.

## Deployment gate
Create a NEW Worker named kweider-private-events-staging, connect the development/manager-console-v1 branch only, and deploy the configuration manager-console/integration/wrangler.staging.toml (Wrangler deploy command: npx wrangler deploy --config manager-console/integration/wrangler.staging.toml). Assets directory is the repository root; the Worker serves only the preview and specified public assets. Verify Cloudflare's build supports this assets configuration. Do not bind production Shopify secrets or modify DNS/production Worker. Protect staging with Access if desired; before any customer data is served, verified authentication is mandatory.

## Remaining
1. Verify deployed preview visually on desktop and phone, including dynamic categories, images, tiers, units, price mismatch and quote errors.
2. Integrate permanent Owner/Manager authentication and transactional storage for the published catalog, version history, media uploads and edit approvals; change the staging seed reader to the approved catalog store. No local passwords or client-trusted role.
3. Wire the V2.1.1 manager UI to the authenticated cloud endpoints, import remaining original page content/Arabic fields and asset references, preserve quote-only independent choices and approve unresolved menu portions.
4. Back up Shopify privately and the deployed Worker; create protected read-only booking API, then controlled booking/payment operations and concurrency safeguards. Verify VAT with accountant before any payment changes.
5. Only after acceptance, switch public page and production request handler together. Save immutable approved quote snapshots and reject changed prices before writing. Verify calendar, payment reconciliation, rollback, and no changes to unrelated projects.

The stage is a price/visual preview prototype, not a finished admin deployment. Production main, existing Cloudflare Worker and Shopify remain unchanged.
