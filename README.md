# PrintableTools Lab

Zero-cost validation build for a free printable PDF generator site.

## What is included

- Static website with no backend requirement.
- Three browser-side generators:
  - Name Tracing Worksheet Generator
  - Chore Chart Generator
  - Reward Chart Generator
- One-page PDF export through Canvas-to-PDF.
- Daily free limit stored in `localStorage`.
- Local validation events stored in `localStorage`.
- 12 original guide pages for SEO and future AdSense review.
- Compliance pages: About, Privacy, Terms, AI & License Disclosure.
- Static pre-rendered HTML for key routes, plus client-side enhancement.
- Operations checklist, keyword list, and distribution post ideas.

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

## Deployment artifacts

- `_redirects` supports Cloudflare Pages rewrites.
- Static route folders support GitHub Pages-style deep links.
- `sitemap.xml` is generated from the route list.
- `OPERATIONS.md` contains account setup, keywords, distribution ideas, and pivot rules.

## Account setup checklist

1. Create or prepare a Google account.
2. Create a GitHub account and a public repository for the static site.
3. Optional but recommended: create a Cloudflare account for Cloudflare Pages.
4. After the site is deployed and content is indexed, create/apply for AdSense.
5. Only after validation, create Gumroad, Ko-fi, Payhip, or a similar no-monthly-fee checkout account.

For step-by-step operations, see `OPERATIONS.md`.

## Launch checklist

1. Deploy the full folder contents after running `npm.cmd run build:routes`.
2. Open `/`, `/tools/name-tracing/`, `/tools/chore-chart/`, `/tools/reward-chart/`, `/guides/`, `/privacy/`, and `/dashboard/`.
3. Generate and download one PDF from each tool.
4. Confirm the dashboard shows page views, PDF generations, and downloads.
5. Submit the public URL to Google Search Console.
6. Wait for indexing and basic usage before applying for AdSense.
7. Add real AdSense code only after the site has useful public content and policy pages.

## Research-driven adjustment log

- The site uses real path URLs instead of hash-only URLs because Search Console and AdSense workflows are easier with crawlable, shareable page paths.
- The app generates static route entry files so GitHub Pages-style hosting can serve deep links without a server rewrite.
- Live ads are not included in the MVP. Placeholder ad zones mark future placements without risking early AdSense policy problems.

## Validation gates

- Day 7: 3 tools export stable PDFs on desktop and mobile.
- Day 14: 12 guide pages live; submit sitemap/site to Google Search Console.
- Day 30: continue if any of these are true:
  - 100 PDF downloads.
  - 300 tool generations.
  - 20 premium/upgrade clicks.
- Day 60: if there is no search exposure or downloads, stop adding content and test the HTML5 game ad-platform route.
- Day 90: if traffic exists but ad revenue is weak, prioritize watermark-free or batch-generation packs over waiting for ads.

## AdSense readiness notes

This build intentionally does not include live ads. Add AdSense only after:

- Original pages are publicly accessible.
- Privacy and policy pages are reviewed.
- The site has real navigation and useful content.
- Ads are not disguised as download buttons.
- No page asks or rewards users for ad clicks.

## Data export

Open `/dashboard/` and click `Export CSV` to download local validation events.
