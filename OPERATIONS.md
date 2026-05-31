# PrintableTools Lab Operations

This file keeps the project pointed at the current model: free ad-supported printable tools first. Paid features are deferred until the free product has traffic and usage data.

## Business Model

### Free acquisition layer

- Sixteen free browser PDF generators.
- Daily free limit stored locally.
- One-page PDF exports with a light footer watermark.
- Original guide pages for search traffic and AdSense review.
- Ads only after AdSense approval, never blocking downloads or disguised as controls.

### Deferred paid layer

Do not add checkout yet. If free traffic proves demand later, use data to decide whether saved projects, batch generation, higher daily limits, no-watermark exports, affiliate links, or another route is worth building.

## Account Setup Steps

### Google account

Use one Google account for Search Console, Analytics, and AdSense.

1. Sign in at `https://accounts.google.com/`.
2. Add the live URL-prefix property in Google Search Console.
3. Verify ownership with the HTML file method.
4. Submit `https://printable-tools-lab.pages.dev/sitemap.xml`.
5. Wait for indexing data before applying for AdSense.

### Google APIs

For automation with the service account:

1. Enable Search Console API in the same Google Cloud project as the service account.
2. Enable Site Verification API in the same project.
3. Set the local key path before running scripts:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="E:\下载\canvas-sum-498016-g5-11e9a0be90a2.json"
```

The service account email from the provided key is:

```text
codex-258@canvas-sum-498016-g5.iam.gserviceaccount.com
```

If Search Console cannot manually add that email as a user, use the Site Verification API script:

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
- Tool page JSON-LD: each public tool route includes `SoftwareApplication` structured data with a free offer.
- `_headers`: basic content/security headers and explicit content types for sitemap, robots, and verification files.

Run before every deploy:

```powershell
npm.cmd run build:routes
npm.cmd run verify:seo
```

### AdSense account

Do not add live ad code until public pages work and Search Console can crawl the site.

1. Add the site URL in AdSense.
2. Fill identity, tax, and payment details.
3. Add the review code to the site head only after policy pages are final.
4. Keep ads separated from download buttons.
5. Never ask or reward users for ad clicks.

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
- free invoice PDF generator
- freelance invoice PDF template
- invoice generator without watermark
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
35. Professional resignation letter generator.
36. Monthly calendar PDF for appointments and bills.
37. Printable calendar maker with Sunday or Monday start.
38. Weekly meal planner with grocery list.
39. Budget meal plan printable for busy families.

## Weekly Operating Loop

1. Open `/dashboard/` and check live Cloudflare-backed counters.
2. Export local events from `/dashboard/` when testing manually.
3. Check Search Console impressions and queries.
4. Pick the top query with impressions but weak clicks.
5. Improve the matching page title and intro.
6. Add one guide or tool variation only if data points to it.
7. Record the change and compare the next week.

## Search And Indexing

Current Search Console checkpoint:

- `2026-05-31T19:17:52Z`: sitemap submitted, pending, 0 warnings, 0 errors.
- Homepage inspection: `Crawled - currently not indexed`, indexing allowed.
- Sample `/guides/` and `/about/`: still unknown to Google.
- Action: keep site stable, improve useful content/navigation, and avoid repeated low-value resubmission loops.

Submit Google sitemap:

```powershell
npm.cmd run search-console -- submit-sitemap
```

Inspect sample URLs:

```powershell
npm.cmd run search-console -- inspect
```

Notify participating engines through IndexNow:

```powershell
npm.cmd run indexnow
```

Google does not provide a general public API to request indexing for ordinary pages. Search Console API can submit/list sitemaps and inspect URLs after the property is verified.

## Kill Or Pivot Rules

- If Search Console shows no impressions after 60 days, stop adding printable content.
- If there are impressions but no clicks, improve titles and meta descriptions.
- If there are clicks but no downloads, improve above-the-fold tool clarity.
- If there are downloads but weak revenue, keep ads and affiliate tests as the main path.
- If traffic exists but ads are weak, improve high-intent pages and test relevant affiliate links before building paid features.
