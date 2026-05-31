# Validation Gates

This project should be judged by usage signals, not by whether it looks finished.

## Pre-launch gate

Pass all items before public deployment:

- `npm.cmd run build:routes` completes.
- `npm.cmd run smoke` completes.
- Static route HTML contains page-specific title, description, canonical, and visible body content before JavaScript runs.
- Six tool pages export PDF files.
- Mobile viewport shows the preview canvas and form without overlap.
- Privacy, Terms, About, and AI & License Disclosure pages exist.
- No live ad code is installed.

## Day 7 gate

Goal: prove the tool experience works.

- Fix any PDF rendering or mobile issues reported by users.
- Confirm at least 6 tools are usable on desktop and mobile.
- Add screenshots or sample PDFs only if users need more trust signals.

## Day 14 gate

Goal: make the site indexable and review-ready.

- Submit the live URL and sitemap in Google Search Console.
- Confirm all 12 guide pages are reachable from `/guides/`.
- Do not apply for AdSense until the public site has visible original content.

## Day 30 gate

Continue this direction if any one of these is true:

- 100 PDF downloads.
- 300 tool generations.
- 20 upgrade/premium clicks.
- Search Console shows growing impressions for printable generator queries.

If none are true, adjust titles and tool focus before adding more features.

## Day 60 gate

If there is no search exposure and no meaningful usage:

- Stop adding printable content.
- Keep the site live as a passive asset.
- Start a separate HTML5 game ad-platform validation project.

## Day 90 gate

If traffic exists but ad earnings are weak:

- Add a no-monthly-fee checkout for watermark-free PDF packs.
- Prioritize batch generation for teachers and tutors.
- Do not rely on ads alone.
