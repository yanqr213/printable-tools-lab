# PrintableTools Lab Operations

This file turns the MVP into a repeatable launch system.

## Account creation steps

### Google account

Use one Google account for Search Console, Analytics, and AdSense.

1. Sign in at `https://accounts.google.com/`.
2. After deployment, open Google Search Console.
3. Add the live site URL as a URL-prefix property.
4. Verify ownership with the recommended HTML tag or file method.
5. Submit `https://YOUR-DOMAIN/sitemap.xml`.
6. Wait for indexing data before applying for AdSense.

### GitHub account

Use GitHub for free version control and optional GitHub Pages hosting.

1. Create a public repository named `printable-tools-lab`.
2. Upload this folder after running `npm.cmd run build:routes`.
3. In repository settings, enable Pages from the default branch.
4. Test the homepage and deep links such as `/tools/name-tracing/`.

### Cloudflare account

Cloudflare Pages is recommended because it supports SPA rewrites and custom domains cleanly.

1. Create a Cloudflare account.
2. Open Workers & Pages, then create a Pages project.
3. Connect the GitHub repository.
4. Set build command to `npm.cmd run build:routes` only if building on Windows; on Cloudflare use `npm run build:routes`.
5. Set output directory to the project root if deploying this folder directly.
6. Test `/`, `/guides/`, `/tools/name-tracing/`, and `/sitemap.xml`.

### AdSense account

Do not apply before the public site has working tools and visible original guide pages.

1. Open AdSense after the live site is indexed.
2. Add the site URL without a path.
3. Fill identity, tax, and payment details.
4. Add the review code to the site head only after policy pages are final.
5. Keep ads separated from download buttons and do not ask users to click ads.

### Optional checkout account

Only create a Gumroad, Ko-fi, Payhip, or Lemon Squeezy account after validation.

Trigger: at least 20 premium clicks, 100 downloads, or repeated user requests for watermark-free PDFs.

## First launch keywords

Use these in titles, page headings, pins, and short posts:

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

## First 20 distribution posts

Create one image or short post per item. Do not promise outcomes; show the printable use case.

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

## Weekly operating loop

1. Export local events from `/dashboard/`.
2. Check Search Console impressions and queries.
3. Pick the top query with impressions but weak clicks.
4. Improve the matching page title and intro.
5. Add one new guide or tool variation only if data points to it.
6. Record the change and compare the next week.

## Search Console automation

Use the service account only after its email has been added to the Search Console property.

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="E:\path\to\service-account.json"
npm.cmd run search-console -- status
npm.cmd run search-console -- inspect
```

The script can submit and list sitemaps through the Search Console API. It can inspect URL indexing status, but Google does not provide a general public API to request indexing for ordinary pages.

Current service account email from the provided key:

```text
codex-258@canvas-sum-498016-g5.iam.gserviceaccount.com
```

If the API returns `SERVICE_DISABLED`, enable the Search Console API in the same Google Cloud project that owns the service account:

```text
https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=967823041457
```

## IndexNow submission

IndexNow can notify participating search engines without a Google account.

```powershell
npm.cmd run indexnow
```

The script creates `indexnow-key.txt`, hosts it at the site root, and submits all indexable URLs.

## Kill or pivot rules

- If Search Console shows no impressions after 60 days, stop adding printable content.
- If there are impressions but no clicks, improve titles and meta descriptions.
- If there are clicks but no downloads, improve above-the-fold tool clarity.
- If there are downloads but no premium clicks, keep ads/affiliate as the main path.
- If premium clicks exceed 20 before meaningful traffic, create a watermark-free pack before adding new free tools.
