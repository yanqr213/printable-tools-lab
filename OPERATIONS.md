# PrintableTools Lab Operations

This file keeps the project pointed at the actual model: free ad-supported tools first, then a cloud Pro service if usage proves demand.

## Business Model

### Free acquisition layer

- Six free browser PDF generators.
- Daily free limit stored locally.
- One-page PDF exports with a light footer watermark.
- Original guide pages for search traffic and AdSense review.
- Ads only after AdSense approval, never blocking downloads or disguised as controls.

### Pro cloud layer

Only build paid checkout after there is enough evidence that users need more than a one-off printable.

Pro should sell service access or credits, not a static file pack:

- Saved projects.
- Batch generation for class lists, tutoring groups, or repeated routines.
- No-watermark exports.
- Higher daily limits.
- Private recent-job history.

Recommended first price test after the Pro service exists:

- $3 to $5 monthly for light users.
- $9 monthly for tutors or teachers needing batch generation.
- Optional one-time credit pack if subscription conversion is weak.

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
5. Test `/`, `/tools/name-tracing/`, `/pro/`, `/guides/`, and `/sitemap.xml`.

### AdSense account

Do not add live ad code until public pages work and Search Console can crawl the site.

1. Add the site URL in AdSense.
2. Fill identity, tax, and payment details.
3. Add the review code to the site head only after policy pages are final.
4. Keep ads separated from download buttons.
5. Never ask or reward users for ad clicks.

### Payment account

For the current strategy, payment is intentionally disabled.

Use ads first. Add checkout only after Pro cloud features can deliver real service access.

Compliance priority:

1. Use a provider that supports the owner's country, identity, tax profile, and payout bank account.
2. Keep product claims accurate and refund handling clear.
3. Avoid personal QR-code collection, account sharing, proxy collection, false business categories, or disguised transactions.
4. Do not route subscription payments through a personal Alipay account unless the platform officially supports that collection and settlement flow.
5. Keep buyer payments on mainstream methods such as card, Apple Pay, Google Pay, or PayPal when supported.

If Alipay payout is required, use only a China-friendly checkout page or service platform that officially supports Alipay collection for the account holder. Most overseas creator and SaaS platforms settle to a bank account, card processor balance, or PayPal rather than directly into an Alipay balance.

Practical order when Pro is ready:

1. Merchant-of-record provider for tax/VAT handling if the owner can pass onboarding.
2. Stripe/PayPal-style checkout if the owner has a supported bank account and can satisfy KYC.
3. China-friendly platform with official Alipay settlement only if it fits the product and account identity.

## First Launch Keywords

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
- worksheet generator with saved projects

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

## Weekly Operating Loop

1. Export local events from `/dashboard/`.
2. Check Search Console impressions and queries.
3. Pick the top query with impressions but weak clicks.
4. Improve the matching page title and intro.
5. Add one guide or tool variation only if data points to it.
6. Record the change and compare the next week.

## Search And Indexing

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
- If there are downloads but no Pro clicks, keep ads and affiliate tests as the main path.
- If Pro clicks exceed 20 before meaningful ad revenue, build the smallest cloud Pro layer before adding new free tools.
- If traffic exists but ads are weak, prioritize batch generation and saved projects over waiting for ad revenue.
