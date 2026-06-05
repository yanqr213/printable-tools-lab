# PrintableTools Lab Operations

This file keeps the project pointed at the current model: free browser PDF, image, QR, and signature tools for acquisition, plus one low-price digital product for direct-payment validation. Display ads still wait for policy readiness and search visibility.

## Business Model

### Free acquisition layer

- Sixty-six free browser PDF generators, no-upload PDF utilities, local image utilities, career utilities, text-data converters, and static QR utilities.
- Daily free limit stored locally.
- Clean one-page PDF or image exports with no account wall and no ad-click requirement.
- Original guide pages for search traffic and display-ad review.
- High-intent landing pages for no-signup, no-upload PDF, no-upload image, and static QR searches.
- Ads only after approval by a mainstream ad network, never blocking downloads or disguised as controls.
- Move from `pages.dev` to a custom domain before serious ad review; keep `pages.dev` only as the free validation and fallback host.

### Direct-payment digital product layer

- Current product: Local Seller Starter Kit at `/local-seller-starter-kit/`.
- Public sample: `/assets/digital-products/local-seller-starter-kit-sample.zip`.
- Full delivery ZIP is generated at `paid-deliverables/local-seller-starter-kit.zip` and must stay out of git.
- Checkout is allowed only through a real external provider such as Gumroad, Payhip, Ko-fi, Stripe Payment Links, or another provider that the owner can legally onboard with.
- Configure the checkout link with `npm.cmd run configure:checkout -- --url https://...`, then run `npm.cmd run build:routes` and verification.
- Do not fake a checkout, fake a paid order, use personal QR-code collection, or expose payout, tax, bank, card, phone, or platform credentials in the repo.
- Revenue is proven only when the payment provider shows a paid order, payout balance, or settled payment.

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

### Zero-domain platform alternatives

No-domain routes are real, but they do not remove monetization risk; they move the bottleneck from DNS and ad-site review to platform eligibility, content distribution, app review, and account compliance.

Current decision:

1. Keep the free tool site as the main zero-cash product because it already works, has 233 indexable routes, and can collect search/direct/referral data without app-store review.
2. Use GitHub Pages as the zero-cash discovery experiment. JS.ORG was rejected, so it is no longer a dependable free-domain path.
3. Use Bilibili/Douyin short videos as distribution only after the product has a few visual demo clips. Do not expect immediate platform revenue because creator incentive programs require eligibility and content performance.
4. Treat Douyin/ByteDance mini games as a pivot candidate, not the first monetization route. The platform provides official ad components for eligible traffic owners, but forced ad watching, blocking core flows with ads, or misleading ad placement is compliance risk.
5. Treat overseas HTML5 portals such as CrazyGames as a later game-specific experiment. Basic Launch can publish a game faster, but ads are disabled during that phase and revenue depends on performance plus a later full-launch review.

If the 60-day site gate still shows no impressions and no downloads, build one extremely simple browser game prototype and test platform submission. Candidate game type: a 60-second sorting/merge/puzzle loop with instant replay, mobile portrait controls, and no copyrighted assets. Do not clone an existing branded game, do not add fake rewarded-ad gates, and do not route payments through personal accounts.

### Payment account

For the current strategy, payment can be enabled for the Local Seller Starter Kit only after a real external checkout product is created and the full ZIP is uploaded there.

While the checkout link is pending, the buyer-facing fallback is the GitHub Pages mirror at `https://yanqr213.github.io/printable-tools-lab/local-seller-starter-kit/`. It hosts the sample ZIP locally and links to a prefilled checkout-request issue. Treat those requests as purchase intent only; revenue is still zero until a payment provider shows a paid order, payout balance, or settled payment.

For buyers who do not use GitHub, the mirror also hosts `assets/digital-products/local-seller-starter-kit-buy-request.txt`. Copy that text into an email, contact form, payment-provider message, or manual checkout reply. It is still only purchase intent, not revenue.

### Custom Local Print Pack service orders

The fastest direct-payment test is the `$29 Custom Local Print Pack Setup`, because it can be fulfilled manually after one qualified buyer reply.

Start colder prospects with the free Market Table Print Audit before asking for a paid checkout. It lets a seller share public-safe details, get practical print feedback, and only upgrade if they want the first pack assembled.

Public service links:

- Free audit page: `https://yanqr213.github.io/printable-tools-lab/market-table-print-audit/`
- Free audit request form: `https://github.com/yanqr213/printable-tools-lab/issues/new?template=market-table-print-audit.yml`
- Free audit request template: `https://yanqr213.github.io/printable-tools-lab/assets/services/market-table-print-audit-request.txt`
- Free audit checklist JSON: `https://yanqr213.github.io/printable-tools-lab/assets/services/market-table-print-audit-checklist.json`
- Service page: `https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/`
- Sales pack: `https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack-sales-pack/`
- Structured request form: `https://github.com/yanqr213/printable-tools-lab/issues/new?template=custom-local-print-pack-service.yml`
- Request brief: `https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-request.txt`
- Payment-before-work reply: `https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-payment-reply.txt`
- Fulfillment checklist: `https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-fulfillment-checklist.txt`
- Order pipeline JSON: `https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-order-pipeline.json`
- Manual outreach queue: `https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-outreach-queue.json`
- Copy/paste outreach batch: `https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-outreach-batch.txt`
- Sample delivery ZIP: `https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-sample-delivery.zip`
- Delivery input example: `https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-delivery-input.example.json`
- Sample delivery report: `https://yanqr213.github.io/printable-tools-lab/reports/custom-local-print-pack-sample-delivery.json`

Manual order SOP:

1. Treat a free audit request, GitHub issue, email, DM, contact-form reply, or brief download as validation only.
2. Check the request has public-safe business/event/service name, offer summary, up to 12 items or services with prices, QR/contact link, style preference, need-by date, and preferred checkout provider.
3. For free audit requests, send checklist notes and relevant free generator links first; do not ask for payment unless the seller asks for done-for-you assembly.
4. Do not collect card, bank, payout, tax, identity, credential, password, or private account details in GitHub, email, or the repo.
5. Reply with the payment-before-work template only after fit is confirmed.
6. Send one real external Gumroad, Payhip, Ko-fi, Stripe, or invoice checkout link.
7. Start custom work only after the external provider shows `paid_order_verified`, a paid order, payout balance, or settled payment.
8. Create a private order input JSON from the delivery input example, changing `paymentStatus` to `paid_order_verified` only after the provider proves payment.
9. Generate the private delivery ZIP with `npm.cmd run service:delivery -- --input path/to/paid-order.json`; outputs stay under `paid-deliverables/service-orders/`, which is ignored by git.
10. Fulfill using the checklist, deliver editable text/CSV/copy blocks, and offer one lightweight typo or fit revision.
11. Log only non-sensitive outcome evidence in this file: date, source, status, provider order state, amount, and public request URL if available.

Manual outreach SOP:

1. Use the outreach batch for the first 10 relevant public-safe actions only; do not scrape, bulk-send, or contact private personal profiles.
2. Send cold messages only when the seller or service provider has an obvious printable-signage, price-list, flyer, QR sign, pickup-note, or market-table problem.
3. Lead with the free audit or free generators before mentioning payment.
4. Use the payment-before-work reply only after the person replies or asks to proceed.
5. Record `sent`, `replied`, `intent_received`, `fit_confirmed`, `checkout_sent`, `paid_order_verified`, `delivered`, `revision_done`, or `closed` without storing private buyer or payment details.

Service revenue is still zero until a payment provider proves a paid order. Requests, replies, issue creation, and downloads are useful validation but are not revenue.

Compliance priority:

1. Use a provider that supports the owner's country, identity, tax profile, and payout bank account.
2. Keep product claims accurate and refund handling clear.
3. Avoid personal QR-code collection, account sharing, proxy collection, false business categories, or disguised transactions.
4. Do not route subscription payments through a personal Alipay account unless the platform officially supports that collection and settlement flow.
5. Keep buyer payments on mainstream methods such as card, Apple Pay, Google Pay, or PayPal when supported.

If Alipay payout is required, use only a China-friendly checkout page or service platform that officially supports Alipay collection for the account holder. Most overseas creator and SaaS platforms settle to a bank account, card processor balance, or PayPal rather than directly into an Alipay balance.

Practical order for the current paid product:

1. Merchant-of-record provider for tax/VAT handling if the owner can pass onboarding.
2. Gumroad, Payhip, Ko-fi, Stripe Payment Links, or PayPal-style checkout if the owner has a supported account and can satisfy KYC.
3. China-friendly platform with official Alipay settlement only if it fits the product and account identity.

The generated paid ZIP includes `payment-provider-setup.md`, `checkout-listing-copy.md`, and `buyer-request-template.txt` so the checkout product can be published with copy/paste fields once a real provider account is available.

For Cloudflare Pages, use `npm.cmd run deploy:cloudflare:safe` after setting `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The script builds, verifies, copies only git-tracked files into a temporary deploy directory, scans for forbidden paths/content, and refuses to deploy `paid-deliverables`, `.env`, or secrets.

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
- compress PDF to 500KB
- compress PDF to 1MB
- compress PDF to 2MB
- compress PDF to 5MB
- compress image without uploading
- compress image to 50KB
- compress image to 100KB
- compress image to 200KB
- compress image to 500KB
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
- `2026-06-02`: opened JS.ORG pull request `https://github.com/js-org/js.org/pull/11512` for `printable-tools-lab.js.org`; the request later closed with `unrelated / unqualified`, so free JS.ORG domain discovery is treated as failed.
- `2026-06-02`: expanded to 66 tools, 95 guides, and 57 high-intent landing pages by adding 50KB, 200KB, and 500KB image-compression landing pages that deep-link into the same no-upload image-to-KB tool with prefilled target sizes. This targets urgent upload-limit searches while avoiding new infrastructure, checkout, or account friction.
- `2026-06-02`: expanded to 66 tools, 95 guides, and 61 high-intent landing pages by adding 500KB, 1MB, 2MB, and 5MB PDF compression landing pages that deep-link into the same no-upload PDF compressor with prefilled target sizes. The tool now performs stronger compression attempts when a target is selected and keeps claims honest by saying it tries toward the target rather than guarantees exact output.
- `2026-06-02`: expanded the GitHub Pages discovery surface from one directory plus 54 landing mirrors to one directory, 61 landing mirrors, and 50 high-intent tool mirrors. This keeps the zero-cost discovery path alive while the main `pages.dev` site has no custom domain, and gives Search Console a broader second sitemap to crawl.
- `2026-06-02`: added `/share-kit/` and `/share-kit.json` as public zero-budget distribution assets with high-intent tracked links, short-video hooks, community-copy, directory blurbs, and safe posting rules. This addresses the current bottleneck, which is exposure rather than tool functionality, and gives future manual or automated distribution a single source of truth.
- `2026-06-02`: added `npm.cmd run share-kit-push` to update the GitHub discovery release from the public share kit, keep repository topics at GitHub's 20-topic limit, attempt IndexNow notification, and write `reports/share-kit-push.json`. The first run updated GitHub successfully and confirmed that IndexNow still returns 403 on the `pages.dev` subdomain, so it remains a non-blocking fallback until a custom domain exists.
- `2026-06-02`: added `npm.cmd run campaign:generate` and `npm.cmd run campaign:verify` to create a zero-cost distribution kit in `reports/campaign-kit/`: bilingual short-video captions, shot lists, community replies, UTM links, posting calendar, validation gates, and vertical poster images for high-intent upload-limit tools. This keeps the next growth step operational instead of adding more product surface before traffic exists.
- `2026-06-02`: added `npm.cmd run campaign:videos` and `npm.cmd run campaign:verify-videos` to turn the zero-cost distribution kit into ready-to-upload 9:16 MP4 assets. The videos are silent, compliance-safe, use UTM links, and focus on exact upload-limit problems rather than generic self-promotion.
- `2026-06-02`: added `npm.cmd run campaign:publish-assets` and `npm.cmd run campaign:verify-release` to upload the MP4 campaign assets to the public GitHub discovery release, write `reports/campaign-assets-release.json`, and verify the release page contains the asset links.
- `2026-06-02`: added `npm.cmd run gist-discovery` and `npm.cmd run verify:gist-discovery` to create or update a public GitHub Gist that mirrors the share kit, high-intent links, MP4 campaign assets, UTM links, safe posting rules, and validation gates. This gives the project one more zero-cost external discovery surface without creating a new platform account.
- `2026-06-02`: added `npm.cmd run github-issue-discovery` and `npm.cmd run verify:github-issue-discovery` to create or update a public GitHub issue growth log. The issue links the main site, Gist mirror, release MP4 assets, high-intent pages, safe posting rules, and validation gates as another zero-cost external discovery surface.
- `2026-06-01`: AdSense Management API was enabled on the Google Cloud project through Service Usage API. A service-account probe to `adsense.googleapis.com/v2/accounts` returned no AdSense accounts, so the service account is not currently an AdSense account user. The official AdSense ad-unit creation API is also a restricted method, so publisher/ad-slot creation cannot be completed silently from the current service-account credentials.
- `2026-06-01`: GitHub Pages discovery directory was verified as its own Search Console URL-prefix property and its sitemap was submitted through the Search Console API. This creates a second crawlable discovery surface that still points back to the same main site.
- `2026-06-01`: added `npm.cmd run operate` as the unattended operating loop. It rebuilds, verifies, submits sitemaps, checks directories, probes Cloudflare/AdSense readiness, and smoke-tests every tool while recording unavoidable account-level blockers.
- `2026-06-03`: submitted `PrintableTools Lab` to NoSubscription.org through its free open-source track. The submit endpoint returned `result=success`; the public submit page states slow review for the free/open-source plan, so this is a pending discovery link rather than immediate traffic.
- `2026-06-06`: submitted `PrintableTools Lab` to TechTools Launchpad through its no-login public API using the tracked URL `https://printable-tools-lab.pages.dev/submit-directory/?utm_source=techtools&utm_medium=directory&utm_campaign=launchpad_2026_06`. The API returned `success=true`, live tool id `161`, and share URL `https://techtools.cz/tools/launchpad/?tool=161`; directory monitoring now confirms it as a live listing.
- `2026-06-03`: traffic/status check: public `/api/metrics` showed 272 cumulative `page_view` events, 14 page views today, 1 cumulative PDF download on `invoice-generator`, 0 generation events, and 0 seller-intent events. GitHub release assets still showed Neon Lane Dash HTML5 ZIP 3 downloads, Neon Lane Dash GameSnacks ZIP 4 downloads, and Upload Limit Panic HTML5 ZIP 3 downloads. Treat this as early low-volume traffic and package interest, not platform plays or revenue. Revenue remains `$0`.
- `2026-06-03`: platform review check: Edge/Playwright reached only the public CrazyGames developer portal with a `Log in` CTA, and Playgama redirected to `https://developer.playgama.com/auth?redirect=/`. No newer review feedback, acceptance, rejection, payout, or earnings signal was visible. Keep last verified states: CrazyGames submitted/awaiting review for Neon Lane Dash, Playgama Waiting for review, Upload Limit Panic ready as backup until Neon receives a first moderation signal.
- `2026-06-03`: GitHub Pages discovery mirrors now surface the seller-intent path above the fold: Free Market Table Print Audit -> optional `$29` Custom Local Print Pack Setup request. This keeps the zero-cost fallback monetization path visible even when the main Cloudflare Pages deploy is stale; no payment is collected on the mirror, and revenue still requires an external paid-order record.
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
- TechTools Launchpad: submitted `PrintableTools Lab` on `2026-06-06` through `https://techtools.cz/launchpad-api/tools`; API returned live tool id `161` and share URL `https://techtools.cz/tools/launchpad/?tool=161`. Monitor confirms the listing in the public Launchpad API. Traffic is tracked with `utm_source=techtools`.
- NoSignupTools: submitted `PrintableTools Lab` on `2026-06-01` under `Files` with app icon and product screenshot; icon upload, screenshot upload, and `/api/submit` all returned `200`. Awaiting human review, typically 24-48 hours.
- FreeNoSignup: submitted `PrintableTools Lab` on `2026-06-01` through the embedded Google Form. The form displayed the confirmation `Your response has been recorded`. Awaiting manual review, typically 3-5 business days.
- NoLogin.tools: submitted `PrintableTools Lab` on `2026-06-03` through `https://nologin.tools/api/submit`. API returned `201` with slug `printable-tools-lab-pages-dev`. On `2026-06-03T03:24Z`, `npm.cmd run monitor:directories` confirmed the public listing is live at `https://nologin.tools/tool/printable-tools-lab-pages-dev`.
- NoSubscription.org: submitted `PrintableTools Lab` on `2026-06-03` through the free/open-source track. The Google Apps Script endpoint returned `result=success`; monitor search/homepage for publication because free review is intentionally slow.
- JS.ORG free subdomain: PR `https://github.com/js-org/js.org/pull/11512` was closed on `2026-06-02` with the `unrelated / unqualified` label. Treat the free JS.ORG domain route as failed and do not rely on it for ad-network readiness.
- DeepLaunch: candidate for a free tool listing. The public submit page says free submissions are reviewed within 48 hours, but the actual flow redirects to sign-in after image upload, so it requires an authenticated Google/GitHub session.
- BootstrapArena: candidate for a normal free startup listing. The public page exposes a `Normal Free` option, but browser validation did not reveal a no-login form.
- FOSSHUNTER: skipped for unattended submission because the submit route is behind a Cloudflare managed challenge. Do not bypass challenge flows; revisit only with a normal interactive owner session.
- NoSubscription-adjacent rule: skip directories whose rules require no ads or no analytics if the public monetization model is ad-supported display placements after approval.
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
- `2026-06-02`: JS.ORG free subdomain request for `printable-tools-lab.js.org` was rejected as unrelated/unqualified, confirming that a free JS.ORG domain should not be treated as a dependable custom-domain substitute for AdSense or search trust.
- `2026-06-03`: NoLogin.tools accepted a no-login directory submission for `https://printable-tools-lab.pages.dev/` via API with slug `printable-tools-lab-pages-dev`; directory monitoring later confirmed the public listing live at `https://nologin.tools/tool/printable-tools-lab-pages-dev`.
- `2026-06-03`: NoSubscription.org accepted the free/open-source submission for `https://printable-tools-lab.pages.dev/` with a success response; public listing is not live yet and is now monitored as pending.
- `2026-06-06`: TechTools Launchpad accepted the tracked directory-pack URL and immediately published tool id `161` at `https://techtools.cz/tools/launchpad/?tool=161`; `npm.cmd run monitor:directories` confirmed 2 listed directories total.
- `2026-06-03`: External discovery scripts were updated so the GitHub release, public Gist, and public growth issue promote the buyer-intent path: Free Market Table Print Audit -> optional $29 Custom Local Print Pack Setup -> `paid_order_verified` money gate. `npm.cmd run share-kit-push` wrote a buyer-intent share-kit report and submitted IndexNow, but the live GitHub Release/Gist/Issue update was skipped because no `GITHUB_TOKEN`, `GH_TOKEN`, or `gh` CLI auth was available in this environment. Revenue remains $0 until an external provider proves a paid order.

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

## Zero-Cash Platform Checkpoint

No-domain does not mean no distribution, but it changes the monetization clock:

- Keep `pages.dev` live because it has zero cash cost and is already verified in Search Console.
- Treat the rejected JS.ORG request as evidence that free subdomain programs are not dependable substitutes for an owned commercial domain.
- Avoid moving the main product to low-quality short-video or mini-game spam. Bilibili and YouTube platform ad revenue requires creator eligibility and review first. Douyin mini games support ad APIs, but still require app/game review, ad-placement compliance, and platform traffic. CrazyGames disables ads during Basic Launch, so low-quality games are not an instant revenue shortcut.
- Use short video as distribution for the existing tools first: one useful demo per high-intent pain point, tracked with UTM links, without asking for ad clicks or fake engagement.
- If zero-cost domain approval stalls and Search Console remains flat for 60 days, run a separate HTML5 game experiment only after building a complete game loop that can pass platform review.

## Kill Or Pivot Rules

- If Search Console shows no impressions after 60 days, stop adding printable content.
- If there are impressions but no clicks, improve titles and meta descriptions.
- If there are clicks but no downloads, improve above-the-fold tool clarity.
- If there are downloads but weak revenue, keep ads and affiliate tests as the main path.
- If traffic exists but ads are weak, improve high-intent pages and test relevant affiliate links before building paid features.
