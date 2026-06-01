# PrintableTools Lab Operations

This file keeps the project pointed at the current model: free ad-supported browser PDF, image, QR, and signature tools first. Paid features are deferred until the free product has traffic and usage data.

## Business Model

### Free acquisition layer

- Fifty-nine free browser PDF generators, no-upload PDF utilities, local image utilities, and static QR utilities.
- Daily free limit stored locally.
- Clean one-page PDF or image exports with no account wall and no ad-click requirement.
- Original guide pages for search traffic and display-ad review.
- High-intent landing pages for no-signup, no-upload PDF, no-upload image, and static QR searches.
- Ads only after approval by a mainstream ad network, never blocking downloads or disguised as controls.
- Move from `pages.dev` to a custom domain before serious ad review; keep `pages.dev` only as the free validation and fallback host.

### Deferred paid layer

Do not add checkout yet. If free traffic proves demand later, use data to decide whether saved projects, batch generation, higher daily limits, richer templates, affiliate links, or another route is worth building.

### Ad-network fallback policy

- Primary: Google AdSense after custom domain, useful content, Search Console visibility, and clean placement review.
- Backup: Microsoft pubCenter if AdSense stalls or rejects the site after a real domain and traffic exist. Treat availability as account/region-dependent and verify at the time of application.
- Later-only options: Ezoic or Media.net after meaningful organic traffic, because they are less suitable for a zero-traffic validation site.
- Avoid: pop-under, push notification, forced-view, download-gated, adult/gambling/crypto-heavy, or misleading ad networks. Do not risk the user's bank, Alipay, AdSense, or domain reputation for short-term revenue.
- Never require visitors to watch, click, or interact with ads before using a tool or downloading a file.

## Account Setup Steps

### Google account

Use one Google account for Search Console, Analytics, and AdSense.

1. Sign in at `https://accounts.google.com/`.
2. Add the live URL-prefix property in Google Search Console.
3. Verify ownership with the HTML file method.
4. Submit `https://printable-tools-lab.pages.dev/sitemap.xml`.
5. Wait for indexing data before applying for AdSense.

### Custom domain

Use a real domain before applying broadly to ad networks. The current `pages.dev` URL is fine for zero-cost validation, but a custom domain is better for trust, Search Console history, brand recall, and ad-network review.

1. Preferred domain: `printabletoolslab.com`.
2. The Cloudflare Registrar API can check availability and pricing. Run `npm.cmd run register:domain` to write `reports/domain-report.json`.
3. Register only a standard, non-premium domain under the configured price cap. Run `npm.cmd run register:domain -- --register` after the Cloudflare account has a default registrant contact and valid payment method.
4. Add it to Cloudflare DNS if the registration flow does not create the zone automatically.
5. Attach it to the existing Cloudflare Pages project manually, or run `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` with `npm.cmd run configure:domain -- --domain your-domain.com` to request the Pages custom-domain binding automatically.
6. Set `PUBLIC_SITE_URL` to the custom domain or run `npm.cmd run configure:domain -- --domain your-domain.com`, then rerun `npm.cmd run build:routes`.
7. Verify the custom domain in Search Console and submit its sitemap.
8. Keep redirects/canonicals consistent before applying for ads.

### Google APIs

For automation with the service account:

1. Enable Search Console API in the same Google Cloud project as the service account.
2. Enable Site Verification API in the same project.
3. Set the local key path before running scripts:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="E:\path\to\service-account.json"
```

If Search Console cannot manually add the service-account email as a user, use the Site Verification API script:

```powershell
npm.cmd run site-verification -- verify-file
```

Deploy the generated Google verification file, then claim ownership:

```powershell
npm.cmd run site-verification -- claim
npm.cmd run search-console -- status
```

### GitHub account

Use GitHub for version control and Cloudflare Pages deployment.

1. Keep repository `printable-tools-lab`.
2. Push changes to `main`.
3. Let Cloudflare Pages build from GitHub, or deploy manually with Wrangler.

### Cloudflare account

Cloudflare Pages is the current host.

1. Open Workers & Pages.
2. Confirm project `printable-tools-lab`.
3. Use build command `npm run build:routes`.
4. Output directory is the repository root.
5. Test `/`, `/tools/name-tracing/`, `/guides/`, `/privacy/`, and `/sitemap.xml`.

### AI idea helper

The optional AI idea helper runs through Cloudflare Pages Functions. It should never expose the model provider, base URL, or API key in frontend code.

Required production variables:

- `AI_BASE_URL`: OpenAI-compatible base URL for the model gateway.
- `AI_API_KEY`: model gateway key, stored as a Cloudflare secret.
- `AI_MODEL`: current low-cost model for short printable suggestions.

Local validation:

```powershell
npm.cmd run test:ai
```

Production smoke:

```powershell
Invoke-RestMethod -Uri "https://printable-tools-lab.pages.dev/api/ideas" -Method Post -ContentType "application/json" -Body '{"tool":"chore-chart","values":{"title":"Weekly Chore Chart","names":"Ava","chores":"Make bed\nBrush teeth"}}'
```

Do not ask users for sensitive personal information. The helper should generate printable-safe ideas only, and ordinary PDF generation should continue to work without the AI service. For invoices, receipts, and resumes, only generic writing fields should be sent to the AI helper; names, contact lines, clients, tenants, landlords, property addresses, amounts, and payment details stay local.

### Search crawler assets

Keep these files deployed for crawler and ad review readiness:

- `sitemap.xml`: indexable public pages only.
- `robots.txt`: allows public pages, blocks noindex internal pages, and points crawlers to the sitemap.
- `llms.txt`: short machine-readable site summary for AI assistants and emerging tool crawlers.
- `feed.xml`: RSS discovery feed for high-intent tools, directories, and monitoring services.
- `tools.json`: structured inventory of tools and guides for directories, crawlers, and manual distribution.
- `discovery.json`: compact high-intent route index for tool directories, launch notes, and automated discovery checks.
- Directory page JSON-LD: `/tools/`, `/free-pdf-tools/`, and `/pdf-tool-finder/` include `ItemList` structured data.
- Tool page JSON-LD: each public tool route includes `SoftwareApplication` structured data with a free offer.
- `_headers`: basic content/security headers and explicit content types for sitemap, robots, and verification files.
- `DISTRIBUTION.md`: reusable low-friction launch copy and directory submission fields.

Run before every deploy:

```powershell
npm.cmd run build:routes
npm.cmd run verify:seo
npm.cmd run validate:ops
```

`validate:ops` writes `VALIDATION.md` and `reports/validation-report.json`. It checks local route inventory, live endpoints, `/api/metrics`, Search Console data when credentials are available, and the AdSense readiness gate. Treat this as the operating source of truth before changing direction.

Unattended operating loop:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="E:\path\to\service-account.json"
$env:GITHUB_TOKEN="optional token for GitHub metadata"
$env:CLOUDFLARE_API_TOKEN="optional token for Cloudflare domain probes"
$env:CLOUDFLARE_ACCOUNT_ID="optional Cloudflare account id"
npm.cmd run operate
```

`operate` runs the product checks, sitemap submissions, IndexNow notification, directory monitoring, Cloudflare custom-domain probe, AdSense API probe, validation report, and browser smoke test. It records missing credentials and external-account limitations in `reports/operate-report.json` instead of masking them.

### AdSense account

Do not add live ad code until public pages work and Search Console can crawl the site.

1. Add the site URL in AdSense.
2. Fill identity, tax, and payment details.
3. Add the review code to the site head only after policy pages are final.
4. Keep ads separated from download buttons.
5. Never ask or reward users for ad clicks.

Automation after the real publisher ID is available:

```powershell
npm.cmd run configure:adsense -- --publisher ca-pub-0000000000000000 --tool-slot 1234567890 --content-slot 2345678901
npm.cmd run verify:adsense
npm.cmd run build:routes
npm.cmd run verify:seo
```

Notes:

- `configure:adsense` writes `site-config.js` and `ads.txt`.
- While ads are disabled, `ads.txt` contains a no-sellers placeholder so `/ads.txt` never falls through to the homepage.
- `verify:adsense` fails if ads are enabled without a valid `ca-pub-...`, if `ads.txt` does not match, or if ad placement labels are missing.
- If AdSense only asks for review code/auto ads first, configure only `--publisher`; fixed ad slot IDs can be added later.
- Keep `enableAds: false` until the real publisher ID is available. Do not deploy fake publisher IDs.

### Ad network fallback

Primary order:

1. Custom domain plus AdSense, because it has the broadest demand and the lowest integration complexity once approved.
2. Microsoft pubCenter if AdSense review stalls or rejects the site; it is a mainstream display-ad path for websites and can be tested without changing the free product.
3. Media.net or other contextual networks only after there is measurable search traffic and enough original content to make approval plausible.

Avoid pop-under, push-notification, forced-view, download-gate, adult, gambling, crypto, or misleading ad networks. They may create early clicks, but they raise account, domain, and user-trust risk.

Do not add rewarded-ad gating for this site. Requiring users to watch or click ads to download practical files creates policy and trust risk. Use normal display placements around explanatory content and download-complete contexts only after an approved mainstream network is ready.

### Payment account

For the current strategy, payment is intentionally disabled.

Use ads first. Add checkout only after a paid feature can deliver real service access and refund handling is ready.

Compliance priority:

1. Use a provider that supports the owner's country, identity, tax profile, and payout bank account.
2. Keep product claims accurate and refund handling clear.
3. Avoid personal QR-code collection, account sharing, proxy collection, false business categories, or disguised transactions.
4. Do not route subscription payments through a personal Alipay account unless the platform officially supports that collection and settlement flow.
5. Keep buyer payments on mainstream methods such as card, Apple Pay, Google Pay, or PayPal when supported.

If Alipay payout is required, use only a China-friendly checkout page or service platform that officially supports Alipay collection for the account holder. Most overseas creator and SaaS platforms settle to a bank account, card processor balance, or PayPal rather than directly into an Alipay balance.

Practical order if a paid product is added later:

1. Merchant-of-record provider for tax/VAT handling if the owner can pass onboarding.
2. Stripe/PayPal-style checkout if the owner has a supported bank account and can satisfy KYC.
3. China-friendly platform with official Alipay settlement only if it fits the product and account identity.

## First Launch Keywords

- free invoice generator no signup
- free image to PDF converter
- multiple images to PDF converter
- text to PDF converter no signup
- JPG to PDF without uploading
- image to PDF no upload
- PNG to PDF converter free
- free sign-in sheet generator
- attendance sheet PDF template
- free printable graph paper generator
- quarter inch graph paper PDF
- free packing list generator
- travel checklist PDF
- free receipt generator PDF
- weekly timesheet generator PDF
- free certificate generator PDF
- printable to do list generator
- free invoice PDF generator
- freelance invoice PDF template
- invoice generator no signup
- free estimate generator PDF
- service quote PDF template
- free purchase order generator
- purchase order PDF template
- free bill of sale generator
- private sale receipt PDF
- rent receipt generator
- rent receipt for cash payment
- printable rent receipt PDF
- free resume builder PDF
- resume builder no signup
- ATS friendly resume PDF
- free cover letter generator PDF
- cover letter generator no signup
- free resignation letter generator
- two weeks notice letter PDF
- free monthly calendar generator
- printable calendar PDF maker
- free meal planner generator
- weekly meal plan grocery list PDF
- free name tracing worksheet generator
- printable name tracing worksheet maker
- free chore chart generator for kids
- printable reward chart generator
- free printable flashcard generator
- free weekly planner generator
- free habit tracker generator
- sticker chart printable maker
- weekly chore chart PDF
- free printable routine chart
- black and white printable worksheet
- A4 and US Letter printable PDF
- classroom chart generator
- batch printable generator for teachers
- free printable worksheet generator
- watermark PDF without uploading
- stamp PDF without uploading
- add signature text to PDF
- compress image without uploading
- resize image without uploading
- convert image format without uploading
- PDF to JPG without uploading
- PDF to PNG converter no upload
- extract text from PDF without uploading
- PDF to text converter no upload

## First Distribution Posts

Create one image or short post per item. Show the printable use case and never promise outcomes.

1. Free name tracing worksheet maker for preschool practice.
2. Make a chore chart for kids in under one minute.
3. Printable reward chart with 20 sticker boxes.
4. US Letter vs A4 printable worksheet sizes.
5. Morning routine chart idea for school days.
6. Bedtime routine chart idea for young children.
7. Classroom job chart for weekly helper roles.
8. Name tracing worksheet with big outline letters.
9. Chore chart for siblings sharing tasks.
10. Reward chart for reading practice.
11. Reward chart for bedtime routine.
12. Printable chart for screen-time habits.
13. Black-and-white worksheet design tips.
14. Free printable PDF maker without an account.
15. Chore chart for roommates and shared homes.
16. Reward chart for kindness goals.
17. Printable handwriting warmup page.
18. Weekly family chores printable.
19. Sticker chart for classroom behavior goals.
20. One-page printable tools for parents and teachers.
21. Free flashcard generator for vocabulary review.
22. Printable weekly planner for family schedules.
23. Habit tracker generator for simple daily routines.
24. One-page planner tools that do not require an account.
25. Free invoice generator with a clean PDF download.
26. Freelance invoice PDF without creating an account.
27. Printable rent receipt for cash or bank transfer payments.
28. Simple resume builder with no surprise download fee.
29. Free estimate PDF for home services or freelance work.
30. Purchase order PDF for small vendor orders.
31. Bill of sale PDF for private item sales.
32. Free cover letter PDF without a signup wall.
33. Cover letter generator for last-minute job applications.
34. Two weeks notice letter PDF with a clear last day.
35. ATS resume checker against a job description.
36. Professional resignation letter generator.
37. Monthly calendar PDF for appointments and bills.
38. Printable calendar maker with Sunday or Monday start.
39. Weekly meal planner with grocery list.
40. Budget meal plan printable for busy families.
41. Image to PDF converter that does not upload files.
42. JPG to PDF for receipts, scans, and screenshots.
43. Multiple images to PDF without uploading files.
44. Compress PDF without uploading for scanned or image-heavy files.
45. Merge PDF without uploading documents.
46. Split PDF without uploading documents.
47. Add page numbers to PDF locally.
48. Rotate PDF pages without uploading.
49. Remove pages from a PDF without uploading.
50. Reorder PDF pages without uploading.
51. Watermark PDF without uploading.
52. Stamp PDF as paid, approved, or draft.
53. Add typed signature text to a PDF.
54. Compress an image without uploading it.
55. Resize an image for a profile, listing, or form.
56. Convert JPG, PNG, or WebP format in the browser.
57. Printable sign-in sheet for events and classes.
58. Attendance sheet PDF with readable rows.
59. Printable graph paper with quarter-inch grid.
60. Travel packing list with grouped checkboxes.
61. Text to PDF converter for plain notes and letters.
62. Markdown to PDF converter for README notes and outlines.
63. CSV to PDF table for inventory rows, rosters, and price sheets.
64. JSON to PDF formatter for reviewed API samples and config notes.
65. Signature PNG generator with transparent export.
66. Passport photo maker for 2x2, 35x45, and 50x70 local sizing.
67. Free receipt generator for service payments and deposits.
68. Weekly timesheet PDF for freelance hours.
69. Certificate generator for classrooms and events.
70. Printable to-do list for errands, study, and event prep.
71. Free printable business card sheet for local services.
72. Business card PDF before ordering professional prints.
73. Address label sheet for small mailing batches.
74. Badge labels for events, workshops, and classrooms.
75. Barcode label PDF for SKU stickers and inventory bins.
76. SKU labels for handmade products and market tables.
77. Price tag generator for yard sales and pop-up shops.
78. Shelf label PDF for small retail displays.
79. Flyer maker PDF for a local service or class.
80. Yard sale flyer with clear time and location.
81. Printable coupon maker for local offers.
82. Discount coupon PDF with code and expiration note.
83. Free QR code generator without signup.
84. WiFi QR code sign for guest networks.
85. Contact QR code generator for vCard details.
86. Compress image to 100KB or another strict upload limit.
87. Convert PDF pages to JPG without uploading.
88. Extract selectable text from PDF without uploading.
89. PDF to Word DOCX conversion for selectable text without uploading.
90. Remove background from white, solid, or near-solid images into transparent PNGs without uploading.
91. Add text to image or photo without uploading for captions, labels, prices, and quick thumbnail headlines.

## Weekly Operating Loop

1. Open `/dashboard/` and check live Cloudflare-backed counters.
2. Run `npm.cmd run validate:ops` with Search Console credentials available.
3. Export local events from `/dashboard/` when testing manually.
4. Check Search Console impressions and queries.
5. Pick the top query with impressions but weak clicks.
6. Improve the matching page title and intro.
7. Add one guide or tool variation only if data points to it.
8. Record the change and compare the next week.

## Search And Indexing

Current Search Console checkpoint:

- `2026-05-31T19:17:52Z`: sitemap submitted, pending, 0 warnings, 0 errors.
- Homepage inspection: `Crawled - currently not indexed`, indexing allowed.
- Sample `/guides/` and `/about/`: still unknown to Google.
- `2026-05-31T19:24:38Z`: sitemap resubmitted after adding `/tools/` index and thicker tool pages with FAQ content.
- Repeated inspection still shows homepage crawled but not indexed; `/tools/` is currently unknown to Google.
- `llms.txt`, `tools.json`, and distribution pack added after this checkpoint to improve external discovery and manual submission readiness.
- `2026-05-31T19:31:34Z`: sitemap resubmitted after deploying `llms.txt`, `tools.json`, `DISTRIBUTION.md`, and GitHub repository metadata/topics.
- `2026-06-01`: expanded to 26 tools and 52 guide pages, including multi-image PDF, text-to-PDF, receipt, timesheet, certificate, and to-do list routes. Added `discovery.json` for high-intent route discovery.
- `2026-06-01`: added `feed.xml`, sitemap `lastmod`, and `ItemList` JSON-LD on directory/finder pages. Google sitemap documentation supports `lastmod` when accurate, and feeds are useful discovery/monitoring assets, but neither replaces external links or real usage.
- `2026-06-01`: added 8 high-intent no-signup/no-upload landing pages for invoice, receipt, weekly timesheet, resume, certificate, JPG-to-PDF, multi-image PDF, and text-to-PDF searches. Clean free exports are now the default acquisition promise.
- `2026-06-01`: expanded the same site to 32 tools, 64 guides, and 14 high-intent landing pages by adding local-business print assets: business cards, address labels, barcode labels, price tags, flyers, and coupons. This keeps domain authority/data in one property while testing more commercial search intent.
- `2026-06-01`: expanded to 35 tools, 70 guides, and 17 high-intent landing pages by adding packing slip, work order, and inventory sheet workflows for sellers, contractors, and stock-count use cases.
- `2026-06-01`: expanded the same site to 38 tools, 73 guides, and 20 high-intent landing pages by adding no-upload Merge PDF, Split PDF, and PDF Page Numbers utilities. These broaden the ad-supported audience into high-frequency existing-PDF tasks while keeping files in the browser.
- `2026-06-01`: expanded the same PDF utility cluster to 41 tools, 76 guides, and 23 high-intent landing pages by adding no-upload Rotate PDF, Remove PDF Pages, and Reorder PDF Pages. This keeps one domain focused on the existing-PDF editing searches where users often face upload gates, account walls, or download friction.
- `2026-06-01`: expanded the same PDF utility cluster to 44 tools, 79 guides, and 26 high-intent landing pages by adding Watermark PDF, Stamp PDF, and Add Signature Text to PDF. These are existing-document tasks with urgent search intent, while the implementation remains local, free, and careful not to claim legal e-signature status.
- `2026-06-01`: expanded the same site to 47 tools, 82 guides, and 29 high-intent landing pages by adding local no-upload image compression, image resizing, and JPG/PNG/WebP format conversion. This keeps the same domain and Search Console property while testing broader high-frequency form-upload, marketplace, profile-photo, and school-portal pain.
- `2026-06-01`: added 6 image-specific long-tail landing pages for compress JPG, compress PNG, resize to 1080x1080, resize to 512x512, PNG-to-JPG, and WebP-to-JPG. These use existing tools but target more explicit upload-failure and format-mismatch searches.
- `2026-06-01`: expanded to 50 tools and 38 high-intent landing pages by adding local Crop Image, Rotate Image, and Watermark Image workflows. This keeps the product in the broad file-utility lane while targeting profile-photo, marketplace-photo, scan-orientation, and sample/proof-image intent.
- `2026-06-01`: advertising strategy updated: keep AdSense as the first mainstream network, add Microsoft pubCenter as a fallback after a custom domain, and avoid high-risk forced-view or download-gated ad networks. A custom domain is now treated as an ad-review prerequisite.
- `2026-06-01`: expanded to 53 tools and 41 high-intent landing pages by adding local static QR Code, WiFi QR Code, and Contact/vCard QR Code generators. This broadens the same free utility site into urgent QR searches where many competitors push account walls, dynamic-code upsells, or paid exports.
- `2026-06-01`: expanded to 56 tools, 85 guides, and 44 high-intent landing pages by adding local Markdown-to-PDF, CSV-to-PDF, and JSON-to-PDF converters. This keeps the same no-upload free utility positioning while testing broader work, student, admin, and developer file-conversion searches that can earn ad impressions without sales calls.
- `2026-06-01`: expanded to 57 tools, 86 guides, and 45 high-intent landing pages by adding a local Compress Image to KB workflow and a 100KB-focused landing page. This targets urgent upload-limit searches where competitors often force uploads, accounts, or paid download friction.
- `2026-06-01`: expanded to 58 tools, 87 guides, and 46 high-intent landing pages by adding a local PDF-to-JPG/PNG converter and no-upload landing page. This targets high-frequency file-conversion intent where users often want previews, uploads, thumbnails, or shareable images without sending documents to a server.
- `2026-06-01`: expanded to 59 tools, 88 guides, and 47 high-intent landing pages by adding local PDF-to-text extraction and a no-upload landing page. This targets work, research, student, admin, and copy-paste intent while keeping the product honest about extracting embedded text only, not OCR.
- `2026-06-01`: expanded to 60 tools, 89 guides, and 48 high-intent landing pages by adding a local Signature PNG generator with transparent export. This targets document, proposal, form, and PDF annotation workflows while explicitly avoiding claims of identity verification or regulated e-signature status.
- `2026-06-01`: expanded to 61 tools, 90 guides, and 49 high-intent landing pages by adding a local Passport Photo Maker. This targets urgent passport, visa, ID, and upload-photo searches while keeping the product limited to sizing and print layout rather than official acceptance or biometric checks.
- `2026-06-01`: expanded to 62 tools, 91 guides, and 50 high-intent landing pages by adding a local Compress PDF tool. This targets urgent upload-limit searches after email, school, job, portal, or government-form file-size rejections while clearly positioning the output as an image-based PDF that may flatten selectable text and links.
- `2026-06-01`: expanded to 63 tools, 92 guides, and 51 high-intent landing pages by adding a local ATS Resume Checker. This targets job seekers right before application submission, keeps resume text in the browser, and avoids risky promises about ATS parsing, interviews, or hiring outcomes.
- `2026-06-02`: expanded to 64 tools, 93 guides, and 52 high-intent landing pages by adding a local PDF to Word Converter. This targets urgent editable-DOCX searches while keeping the source PDF in the browser and explicitly limiting the promise to selectable text, not OCR or pixel-perfect layout recovery.
- `2026-06-02`: expanded to 65 tools, 94 guides, and 53 high-intent landing pages by adding a local Remove Background tool. This targets broad transparent-PNG, white-background, product-photo, logo, icon, and signature-scan searches while keeping the tool honest as color-based background removal rather than AI portrait or hair segmentation.
- `2026-06-02`: expanded to 66 tools, 95 guides, and 54 high-intent landing pages by adding a local Add Text to Image tool. This targets broad creator, seller, teacher, student, class-visual, thumbnail, caption, price-label, and social-image searches while staying browser-only and avoiding a full design-account workflow.
- `2026-06-02`: zero-cost domain strategy checkpoint: keep the Cloudflare Pages `pages.dev` subdomain for validation because it has no cash cost and can remain crawlable, but treat a normal custom domain as an ad-review and trust upgrade after usage/search data appears. Platform-internal alternatives such as Douyin/WeChat mini games remove domain cost but add app-store review, platform traffic, and ad-eligibility uncertainty, so they are a parallel experiment rather than the current main path.
- `2026-06-02`: opened JS.ORG pull request `https://github.com/js-org/js.org/pull/11512` for `printable-tools-lab.js.org` pointing to the Cloudflare Pages site. The first automatic validation failed because the PR description did not use the JS.ORG template; the description was updated with checked terms, live content URL, and a JavaScript-ecosystem explanation. This is a zero-cash-cost domain experiment and does not replace the real custom-domain requirement for serious ad review.
- `2026-06-01`: AdSense Management API was enabled on the Google Cloud project through Service Usage API. A service-account probe to `adsense.googleapis.com/v2/accounts` returned no AdSense accounts, so the service account is not currently an AdSense account user. The official AdSense ad-unit creation API is also a restricted method, so publisher/ad-slot creation cannot be completed silently from the current service-account credentials.
- `2026-06-01`: GitHub Pages discovery directory was verified as its own Search Console URL-prefix property and its sitemap was submitted through the Search Console API. This creates a second crawlable discovery surface that still points back to the same main site.
- `2026-06-01`: added `npm.cmd run operate` as the unattended operating loop. It rebuilds, verifies, submits sitemaps, checks directories, probes Cloudflare/AdSense readiness, and smoke-tests every tool while recording unavoidable account-level blockers.
- Action: keep site stable, improve useful content/navigation, thicken tool pages, and avoid repeated low-value resubmission loops.

## External Discovery Queue

Manual posts should be useful, honest, and placed only where self-promotion is allowed. Keep the current same-site strategy until Search Console shows which category wins; splitting into separate sites now would dilute the few discovery signals already attached to this property.

1. Keep GitHub repository topics aligned with small-business, local-promotion, PDF, career, and education tools.
2. Use `DISTRIBUTION.md` for one product-directory submission at a time.
3. Share a specific tool in a relevant community only when it directly answers a request.
4. Record every external URL here with the post date and observed referral/downloads.

Current directory queue:

- Zearches: completed one free homepage submission to `Resources, Tools & Directories`; result was `status=ok`.
- ListAi.cc: submitted `PrintableTools Lab` through the free no-account form under `Productivity`; the page returned `Submission Received` and says approved tools are published within 24-48 hours. Do not resubmit unless the listing is rejected or material product positioning changes.
- NoSignupTools: submitted `PrintableTools Lab` on `2026-06-01` under `Files` with app icon and product screenshot; icon upload, screenshot upload, and `/api/submit` all returned `200`. Awaiting human review, typically 24-48 hours.
- FreeNoSignup: submitted `PrintableTools Lab` on `2026-06-01` through the embedded Google Form. The form displayed the confirmation `Your response has been recorded`. Awaiting manual review, typically 3-5 business days.
- JS.ORG free subdomain: opened PR `https://github.com/js-org/js.org/pull/11512` on `2026-06-02` for `printable-tools-lab.js.org`; PR body is now template-compliant, mergeable, and awaiting maintainer review.
- DeepLaunch: candidate for a free tool listing. The public submit page says free submissions are reviewed within 48 hours, but the actual flow redirects to sign-in after image upload, so it requires an authenticated Google/GitHub session.
- BootstrapArena: candidate for a normal free startup listing. The public page exposes a `Normal Free` option, but browser validation did not reveal a no-login form.
- Product Hunt: defer until indexing or a visible usage milestone; it is a launch surface, not an indexing shortcut.
- Startup Fame and Dev Hunt: checked and skipped for now because direct submit routes resolve to login/profile/404 flows without a no-login form.

Completed:

- `2026-05-31`: GitHub repo description, homepage, and topics updated through the GitHub API.
- `2026-05-31`: AdSense config automation added; live `/ads.txt` returns a no-sellers placeholder while ads remain disabled.
- `2026-06-01`: GitHub discovery release created at `https://github.com/yanqr213/printable-tools-lab/releases/tag/free-pdf-tools` with high-intent tool links.
- `2026-06-01`: GitHub Pages discovery directory added at `https://yanqr213.github.io/printable-tools-lab/` as a free external entry point linking to high-intent tools.
- `2026-06-01`: RSS feed exposed at `https://printable-tools-lab.pages.dev/feed.xml` and linked from `llms.txt`, `discovery.json`, GitHub release notes, and the GitHub Pages discovery directory.
- `2026-06-01`: Zearches free directory submission completed for `https://printable-tools-lab.pages.dev/` in the resources/tools directory.
- `2026-06-01`: ListAi.cc free submission completed for `https://printable-tools-lab.pages.dev/`; awaiting 24-48 hour human review.
- `2026-06-01`: NoSignupTools free directory submission completed for `https://printable-tools-lab.pages.dev/`; awaiting 24-48 hour human review.
- `2026-06-01`: FreeNoSignup submission completed for `https://printable-tools-lab.pages.dev/`; awaiting 3-5 business day human review.

Submit Google sitemap:

```powershell
npm.cmd run search-console -- submit-sitemap
```

Inspect sample URLs:

```powershell
npm.cmd run search-console -- inspect
```

Monitor directory approvals:

```powershell
npm.cmd run monitor:directories
```

Notify participating engines through IndexNow:

```powershell
npm.cmd run indexnow
```

Google does not provide a general public API to request indexing for ordinary pages. Search Console API can submit/list sitemaps and inspect URLs after the property is verified.

IndexNow note:

- The IndexNow key file is deployed at the site root.
- If `pages.dev` returns `UserForbiddedToAccessSite`, treat it as a non-blocking Bing/Yandex discovery fallback.
- The primary indexing path remains Search Console sitemap submission plus external links from useful directories or relevant community posts.
- Re-test IndexNow after moving to a custom domain; subdomain ownership can be stricter than ordinary URL-prefix verification.

## Kill Or Pivot Rules

- If Search Console shows no impressions after 60 days, stop adding printable content.
- If there are impressions but no clicks, improve titles and meta descriptions.
- If there are clicks but no downloads, improve above-the-fold tool clarity.
- If there are downloads but weak revenue, keep ads and affiliate tests as the main path.
- If traffic exists but ads are weak, improve high-intent pages and test relevant affiliate links before building paid features.
