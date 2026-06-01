# Validation Gates

Last generated: 2026-06-01T20:32:59.171Z

## Current Automated Status

- Product ready: yes.
- Tools live in inventory: 66.
- Guide pages live in inventory: 95.
- High-intent landing pages: 61.
- Indexable routes: 233.
- Custom domain configured: no.
- Live downloads: 1.
- Live generations: 0.
- Search impressions: 0.
- Search clicks: 0.
- External discovery ready: yes.
- Ads enabled: no.
- AdSense apply-ready: no.

## Product Gate

- 66 tools, 95 guides, 61 high-intent landing pages, sitemap, discovery assets, and live metrics are present.

## Search Console Gate

- Sitemap submitted: https://printable-tools-lab.pages.dev/sitemap.xml.
- Sitemap pending: yes; warnings: 0; errors: 0.
- GitHub Pages discovery sitemap submitted: https://yanqr213.github.io/printable-tools-lab/sitemap.xml.
- GitHub Pages sitemap pending: yes; warnings: 0; errors: 0.
- Main Search Console property verified: yes.
- GitHub Pages discovery property verified: yes.
- Sitemap status: pending=true, warnings=0, errors=0.
- GitHub Pages discovery sitemap: pending=true, warnings=0, errors=0.
- Search performance: 0 impressions, 0 clicks.
- 2 inspected sample URL(s) are still unknown to Google.

## External Discovery Gate

- GitHub repo has 20 topic(s) and homepage https://printable-tools-lab.pages.dev/.
- GitHub discovery release is live: https://github.com/yanqr213/printable-tools-lab/releases/tag/free-pdf-tools.
- GitHub Pages discovery directory is live with 61 landing page link(s) and 50 tool mirror link(s).
- GitHub Pages discovery sitemap has 112 URL(s), including 50 tool mirror URL(s); expected at least 112.
- IndexNow key file is reachable from the site root.

## Monetization Gate

- Custom domain is not configured yet; keep pages.dev for validation but use a real domain before ad-network review.
- Real AdSense publisher ID is not configured, so ads remain disabled.
- Search Console has no impressions/indexed sample yet, so applying now is premature.

## Validation Gates

- 30-day continue gate: no. Continue if downloads >= 100, generations >= 300, or Search Console impressions are growing.
- 60-day pivot warning: no. If still true at the 60-day checkpoint, pause printable expansion and test another ad-supported route.
- 90-day monetization review: no. If true later, optimize ad/affiliate revenue before building paid features.

## Next Actions

- Create a small external discovery push using DISTRIBUTION.md; one useful directory/community post is more valuable than resubmitting the sitemap repeatedly.
- Buy and attach a custom domain before submitting broad ad-network review; pages.dev remains the zero-cost validation host.
- When AdSense provides the real ca-pub publisher ID, run configure:adsense; do not deploy fake IDs.
- Keep the current free product live and track downloads/generations until the 30-day gate has enough signal.

## Commands

```powershell
npm.cmd run validate:ops
npm.cmd run verify:seo
npm.cmd run verify:adsense
```
