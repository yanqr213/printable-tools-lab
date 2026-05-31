# PrintableTools Lab

Zero-cost validation build for a free printable PDF generator site.

Live site: https://printable-tools-lab.pages.dev/

PrintableTools Lab is a no-signup utility site for practical PDFs: image-to-PDF conversion, multi-image PDFs, text-to-PDF, invoices, estimates, purchase orders, sale records, receipts, timesheets, resumes, cover letters, resignation letters, certificates, monthly calendars, meal planners, sign-in sheets, graph paper, packing lists, to-do lists, worksheets, chore charts, reward charts, flashcards, weekly planners, and habit trackers.

## Free PDF tool directory

- [Free PDF tools without signup](https://printable-tools-lab.pages.dev/free-pdf-tools/)
- [PDF tool finder](https://printable-tools-lab.pages.dev/pdf-tool-finder/)
- [GitHub Pages discovery directory](https://yanqr213.github.io/printable-tools-lab/)
- [Image to PDF Converter](https://printable-tools-lab.pages.dev/tools/image-to-pdf/)
- [Multiple Images to PDF Converter](https://printable-tools-lab.pages.dev/tools/multi-image-pdf/)
- [Text to PDF Converter](https://printable-tools-lab.pages.dev/tools/text-to-pdf/)
- [Invoice Generator](https://printable-tools-lab.pages.dev/tools/invoice-generator/)
- [Receipt Generator](https://printable-tools-lab.pages.dev/tools/receipt-generator/)
- [Timesheet Generator](https://printable-tools-lab.pages.dev/tools/timesheet-generator/)
- [Resume Builder PDF](https://printable-tools-lab.pages.dev/tools/resume-builder/)
- [Certificate Generator](https://printable-tools-lab.pages.dev/tools/certificate-generator/)
- [To Do List Generator](https://printable-tools-lab.pages.dev/tools/todo-list/)
- [Graph Paper Generator](https://printable-tools-lab.pages.dev/tools/graph-paper/)

## What is included

- Static website with optional Cloudflare Pages Function for the AI idea helper.
- Twenty-six browser-side generators:
  - Image to PDF Converter
  - Multiple Images to PDF Converter
  - Text to PDF Converter
  - Sign-in Sheet Generator
  - Graph Paper Generator
  - Packing List Generator
  - To Do List Generator
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
  - Receipt Generator
  - Timesheet Generator
  - Resume Builder PDF
  - Cover Letter Generator
  - Resignation Letter Generator
  - Certificate Generator
  - Monthly Calendar Generator
  - Meal Planner Generator
- Canvas-to-PDF export, including a multi-page export path for multiple-image PDFs.
- Daily free limit stored in `localStorage`.
- Local validation events stored in `localStorage`.
- Anonymous Cloudflare KV counters for live page views, PDF generations, downloads, limit hits, and AI idea applies.
- 52 original guide pages plus keyword clusters for SEO and future AdSense review.
- Compliance pages: About, Privacy, Terms, AI & License Disclosure.
- Static pre-rendered HTML for key routes, plus client-side enhancement.
- `robots.txt`, canonical URLs, sitemap, and SoftwareApplication structured data for tool pages.
- `llms.txt`, `tools.json`, `discovery.json`, and `DISTRIBUTION.md` for AI/tool discovery and low-friction launch submissions.
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

Run the automated operating report:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="E:\path\to\service-account.json"
npm.cmd run validate:ops
```

The report updates `VALIDATION.md` and `reports/validation-report.json` with product readiness, live counters, Search Console status, AdSense readiness, and the next operating actions.

Prepare or verify AdSense configuration:

```powershell
npm.cmd run verify:adsense
npm.cmd run configure:adsense -- --publisher ca-pub-0000000000000000 --tool-slot 1234567890 --content-slot 2345678901
```

Keep ads disabled until the real AdSense publisher ID and policy review are ready.

## Deployment artifacts

- `_redirects` supports Cloudflare Pages rewrites.
- `_headers` adds basic content/security headers for Cloudflare Pages.
- Static route folders support GitHub Pages-style deep links.
- `sitemap.xml` and `robots.txt` are generated from the route list.
- `llms.txt`, `feed.xml`, `tools.json`, `discovery.json`, and `DISTRIBUTION.md` are generated from the same route/tool metadata.
- Directory pages include `ItemList` structured data; tool pages include `SoftwareApplication` and FAQ structured data.
- `OPERATIONS.md` contains account setup, keywords, distribution ideas, and pivot rules.
- `VALIDATION.md` and `reports/validation-report.json` are generated by `npm.cmd run validate:ops`.
- `scripts/site-verification.cjs` can generate a Google verification file for the service account and claim site ownership through the Google Site Verification API.
- `scripts/configure-adsense.cjs` can write `site-config.js` and `ads.txt` after a real AdSense publisher ID is available.
- `docs/` contains a compact GitHub Pages discovery directory that links back to the live high-intent tools.

## Account setup checklist

1. Create or prepare a Google account.
2. Create a GitHub account and a public repository for the static site.
3. Optional but recommended: create a Cloudflare account for Cloudflare Pages.
4. After the site is deployed and content is indexed, create/apply for AdSense.
5. Keep paid checkout disabled. The current monetization path is free usage first, then AdSense after approval.

For step-by-step operations, see `OPERATIONS.md`.

## Launch checklist

1. Deploy the full folder contents after running `npm.cmd run build:routes`.
2. Open `/`, `/tools/image-to-pdf/`, `/tools/multi-image-pdf/`, `/tools/text-to-pdf/`, `/tools/invoice-generator/`, `/tools/estimate-generator/`, `/tools/purchase-order/`, `/tools/bill-of-sale/`, `/tools/rent-receipt/`, `/tools/receipt-generator/`, `/tools/timesheet-generator/`, `/tools/resume-builder/`, `/tools/cover-letter/`, `/tools/resignation-letter/`, `/tools/certificate-generator/`, `/tools/monthly-calendar/`, `/tools/meal-planner/`, `/tools/sign-in-sheet/`, `/tools/graph-paper/`, `/tools/packing-list/`, `/tools/todo-list/`, `/guides/`, `/privacy/`, and `/dashboard/`.
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
- New document conversion, business, career, event, checklist, graph paper, packing list, calendar, and meal-planning tools were added because these queries have stronger immediate pain and broader repeat use than light classroom printables. Many competing tools monetize at account creation, download, ads, or conversion limits, so a complete free PDF export is a clearer acquisition hook.

## Validation gates

- Day 7: 26 tools export stable PDFs on desktop and mobile.
- Day 14: 52 guide pages live; submit sitemap/site to Google Search Console.
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
