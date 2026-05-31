# PrintableTools Lab

Zero-cost validation build for a free printable PDF generator site.

## What is included

- Static website with optional Cloudflare Pages Function for the AI idea helper.
- Twelve browser-side generators:
  - Name Tracing Worksheet Generator
  - Chore Chart Generator
  - Reward Chart Generator
  - Flashcard Generator
  - Weekly Planner Generator
  - Habit Tracker Generator
  - Invoice Generator
  - Estimate Generator
  - Purchase Order Generator
  - Bill of Sale Generator
  - Rent Receipt Generator
  - Resume Builder PDF
- One-page PDF export through Canvas-to-PDF.
- Daily free limit stored in `localStorage`.
- Local validation events stored in `localStorage`.
- Anonymous Cloudflare KV counters for live page views, PDF generations, downloads, limit hits, and AI idea applies.
- 30 original guide pages plus keyword clusters for SEO and future AdSense review.
- Compliance pages: About, Privacy, Terms, AI & License Disclosure.
- Static pre-rendered HTML for key routes, plus client-side enhancement.
- Operations checklist, keyword list, and distribution post ideas.
- Noindex roadmap page for future decisions after the free ad-supported version is validated.
- Generated brand visuals: app icon, favicon, social card, and homepage product hero image.
- Optional AI idea helper for printable-safe form suggestions. The API key is a Cloudflare secret, never frontend code.
- Privacy-sensitive document fields are generated locally; the AI helper only receives limited generic fields for business and career tools.

## Run locally

From this folder:

```powershell
npm.cmd run start
```

Open:

```text
http://localhost:4173/
```

If you want to generate static entries for GitHub Pages-style hosting:

```powershell
npm.cmd run build:routes
```

Run the smoke test:

```powershell
npm.cmd run smoke
```

Run the AI helper contract test:

```powershell
npm.cmd run test:ai
```

Run the live metrics contract test:

```powershell
npm.cmd run test:events
```

## Deployment artifacts

- `_redirects` supports Cloudflare Pages rewrites.
- Static route folders support GitHub Pages-style deep links.
- `sitemap.xml` is generated from the route list.
- `OPERATIONS.md` contains account setup, keywords, distribution ideas, and pivot rules.
- `scripts/site-verification.cjs` can generate a Google verification file for the service account and claim site ownership through the Google Site Verification API.

## Account setup checklist

1. Create or prepare a Google account.
2. Create a GitHub account and a public repository for the static site.
3. Optional but recommended: create a Cloudflare account for Cloudflare Pages.
4. After the site is deployed and content is indexed, create/apply for AdSense.
5. Keep paid checkout disabled. The current monetization path is free usage first, then AdSense after approval.

For step-by-step operations, see `OPERATIONS.md`.

## Launch checklist

1. Deploy the full folder contents after running `npm.cmd run build:routes`.
2. Open `/`, `/tools/invoice-generator/`, `/tools/estimate-generator/`, `/tools/purchase-order/`, `/tools/bill-of-sale/`, `/tools/rent-receipt/`, `/tools/resume-builder/`, `/guides/`, `/privacy/`, and `/dashboard/`.
3. Generate and download one PDF from each tool.
4. Confirm the dashboard shows page views, PDF generations, and downloads.
5. Submit the public URL to Google Search Console.
6. Wait for indexing and basic usage before applying for AdSense.
7. Add real AdSense code only after the site has useful public content and policy pages.

## Research-driven adjustment log

- The site uses real path URLs instead of hash-only URLs because Search Console and AdSense workflows are easier with crawlable, shareable page paths.
- The app generates static route entry files so GitHub Pages-style hosting can serve deep links without a server rewrite.
- Live ads are not included in the MVP. Placeholder ad zones mark future placements without risking early AdSense policy problems.
- The AI idea helper is server-side only. Configure `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL` as Cloudflare Pages secrets/environment variables before using it in production.
- New business and career tools were added because invoice, estimate, purchase order, sale record, receipt, and resume queries have stronger immediate pain than light classroom printables and many competing tools monetize at account creation or download.

## Validation gates

- Day 7: 12 tools export stable PDFs on desktop and mobile.
- Day 14: 30 guide pages live; submit sitemap/site to Google Search Console.
- Day 30: continue if any of these are true:
  - 100 PDF downloads.
  - 300 tool generations.
  - Search Console shows growing impressions for printable generator queries.
- Day 60: if there is no search exposure or downloads, stop adding content and test the HTML5 game ad-platform route.
- Day 90: if traffic exists but ad revenue is weak, improve high-intent pages and test affiliate links before building paid features.

## AdSense readiness notes

This build intentionally does not include live ads. Add AdSense only after:

- Original pages are publicly accessible.
- Privacy and policy pages are reviewed.
- The site has real navigation and useful content.
- Ads are not disguised as download buttons.
- No page asks or rewards users for ad clicks.

## Data export

Open `/dashboard/` and click `Export CSV` to download local validation events.
