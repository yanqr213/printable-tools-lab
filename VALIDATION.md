# Validation Gates

Last generated: 2026-06-12T14:07:06.239Z

## Current Automated Status

- Product ready: yes.
- Tools live in inventory: 67.
- Guide pages live in inventory: 95.
- High-intent landing pages: 151.
- Indexable routes: 342.
- Custom domain configured: no.
- Live downloads: 2.
- Live generations: 0.
- Free-tool depth intent events: 0.
- Commercial intent events: 4.
- Checkout links configured: 0/5.
- Lead-to-payment close cockpit ready: yes.
- Sponsor leads captured: 0.
- Sponsor invoice requests: 0.
- Public-safe service request issues: 0.
- Public-safe invoice follow-up request issues: 0.
- Public-safe upload fix plan request issues: 0.
- Public-safe sponsor replies: 0.
- Public-safe invoice issue requests: 0.
- Sponsor outreach queued/sent/settled: 10/0/0.
- Search impressions: 0.
- Search clicks: 0.
- External discovery ready: yes.
- Ads enabled: no.
- AdSense apply-ready: no.

## Product Gate

- 67 tools, 95 guides, 151 high-intent landing pages, sitemap, discovery assets, and live metrics are present.

## Search Console Gate

- Sitemap data unavailable in this run.
- GitHub Pages discovery sitemap data unavailable in this run.
- GOOGLE_APPLICATION_CREDENTIALS is not set or the file is missing.

## External Discovery Gate

- GitHub repo has 20 topic(s) and homepage https://printable-tools-lab.pages.dev/.
- GitHub discovery release is live: https://github.com/yanqr213/printable-tools-lab/releases/tag/free-pdf-tools.
- GitHub Pages discovery directory is live with 151 landing page link(s), 67 tool mirror link(s), 95 guide mirror link(s), and 1 game submission link(s).
- GitHub Pages discovery sitemap has 328 URL(s), including 67 tool mirror URL(s), 95 guide mirror URL(s), and 3 game submission URL(s); expected at least 324.
- IndexNow key file is reachable from the site root.
- IndexNow latest report accepted 328 URL(s) for github-pages.
- Directory monitor shows 112 listed, 184 pending, and 1 error directory target(s).

## Monetization Gate

- Custom domain is not configured yet; keep pages.dev for validation but use a real domain before ad-network review.
- Real AdSense publisher ID is not configured, so ads remain disabled.
- Search Console API data was unavailable during this run.
- Search Console has no impressions/indexed sample yet, so applying now is premature.

## Validation Gates

- 30-day continue gate: no. Continue if downloads >= 100, generations >= 300, or Search Console impressions are growing.
- 60-day pivot warning: no. If still true at the 60-day checkpoint, pause printable expansion and test another ad-supported route.
- 90-day monetization review: no. If true later, optimize ad revenue, page intent, or compliant affiliate tests before building paid features.

## Next Actions

- Watch the newly listed directories for real referrals and depth events before adding another same-category submission.
- Buy and attach a custom domain before submitting broad ad-network review; pages.dev remains the zero-cost validation host.
- When AdSense provides the real ca-pub publisher ID, run configure:adsense; do not deploy fake IDs.
- Keep the current free product live and track downloads/generations until the 30-day gate has enough signal.
- Keep pushing free-tool depth links and watch for audit or directory-browse events before adding more monetization surfaces.
- Use the internal lead-to-payment close cockpit after every service, seller-kit, audit, or sponsor lead: export, confirm fit, copy the payment reply, and count revenue only after external proof.
- Create real external payment-provider products for the $9 upload fix plan, $19 invoice follow-up copy pack, and $29 custom print pack, then configure only their public checkout URLs in the matching per-SKU slots.
- Submit the first sponsor outreach batch using reports/sponsor-next-submission-batch.md, but mark rows sent only after real public-form submission evidence exists.

## Commands

```powershell
npm.cmd run validate:ops
npm.cmd run service:public-requests
npm.cmd run sponsor:public-replies
npm.cmd run verify:seo
npm.cmd run verify:adsense
```
