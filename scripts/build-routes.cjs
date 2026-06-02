const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { routes, renderRoute, siteUrl, tools, guides, landingPages, SITE_SUMMARY, HIGH_INTENT_TOOL_PATHS, HIGH_INTENT_LANDING_PATHS, SHARE_KIT_FEATURED_LINKS, SHARE_KIT_POSTS, SHARE_KIT_RULES, ZERO_DOMAIN_GAME_EXPERIMENT, ZERO_DOMAIN_GAME_EXPERIMENTS, PLATFORM_SUBMIT_QUEUE, ZERO_DOMAIN_PLATFORM_STRATEGY, PLATFORM_OUTREACH_TRACKER, PLATFORM_SUBMIT_COCKPIT } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const template = fs.readFileSync(path.join(root, "index.html"), "utf8");
const generatedAt = new Date();
const generatedAtIso = generatedAt.toISOString();
const lastmod = generatedAtIso.slice(0, 10);
const campaignAssets = readCampaignAssets();
const gistDiscovery = readGistDiscovery();
const issueDiscovery = readIssueDiscovery();

function pageHtml(route) {
  const rendered = renderRoute(route);
  return template
    .replace(/<title>.*?<\/title>/, `<title>${rendered.title} - PrintableTools Lab</title>`)
    .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${escapeAttr(rendered.description)}">`)
    .replace(/<meta name="robots" content=".*?">/, `<meta name="robots" content="${route.index === false ? "noindex,follow" : "index,follow"}">`)
    .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${escapeAttr(rendered.title)}">`)
    .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${escapeAttr(rendered.description)}">`)
    .replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${siteUrl("assets/images/social-card.webp").replace(/\/$/, "")}">`)
    .replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${siteUrl(route.path)}">`)
    .replace(/<main id="app" tabindex="-1">[\s\S]*?<\/main>/, `<main id="app" tabindex="-1">\n${rendered.html}\n    </main>`);
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function writeRoute(route) {
  const dir = path.join(root, route.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageHtml(route));
}

const rootRoute = routes.find((route) => route.path === "");
if (rootRoute) {
  fs.writeFileSync(path.join(root, "index.html"), pageHtml(rootRoute));
}

for (const route of routes) {
  if (route.path) writeRoute(route);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .filter((route) => route.index !== false)
  .map((route) => `  <url><loc>${siteUrl(route.path)}</loc><lastmod>${lastmod}</lastmod></url>`)
  .join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /dashboard/",
  "Disallow: /roadmap/",
  "Disallow: /launch-kit/",
  "Disallow: /reports/",
  `Sitemap: ${fileUrl("sitemap.xml")}`,
  "",
].join("\n");
fs.writeFileSync(path.join(root, "robots.txt"), robots);

const manifest = {
  name: SITE_SUMMARY.name,
  short_name: "PrintableTools",
  description: SITE_SUMMARY.description,
  start_url: "/free-pdf-tools/",
  scope: "/",
  display: "standalone",
  background_color: "#f7fbfc",
  theme_color: "#176b87",
  categories: ["productivity", "utilities", "education", "business"],
  icons: [
    { src: "/assets/images/app-icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/assets/images/app-icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  shortcuts: [
    { name: "Free file tools", short_name: "File tools", url: "/free-pdf-tools/" },
    { name: "File tool finder", short_name: "Finder", url: "/pdf-tool-finder/" },
    { name: "ATS Resume Checker", short_name: "ATS Check", url: "/tools/ats-resume-checker/" },
    { name: "Compress PDF", short_name: "PDF ZIP", url: "/tools/compress-pdf/" },
    { name: "Compress image", short_name: "Compress", url: "/tools/compress-image/" },
    { name: "Image to KB", short_name: "Image KB", url: "/tools/compress-image-to-kb/" },
    { name: "Resize image", short_name: "Resize", url: "/tools/resize-image/" },
    { name: "Remove background", short_name: "BG PNG", url: "/tools/remove-background/" },
    { name: "Add text to image", short_name: "Text IMG", url: "/tools/add-text-image/" },
    { name: "QR code", short_name: "QR", url: "/tools/qr-code/" },
    { name: "WiFi QR", short_name: "WiFi QR", url: "/tools/wifi-qr-code/" },
    { name: "Crop image", short_name: "Crop", url: "/tools/crop-image/" },
    { name: "Merge PDF", short_name: "Merge", url: "/tools/merge-pdf/" },
    { name: "Split PDF", short_name: "Split", url: "/tools/split-pdf/" },
    { name: "Image to PDF", short_name: "Image PDF", url: "/tools/image-to-pdf/" },
    { name: "PDF to JPG", short_name: "PDF JPG", url: "/tools/pdf-to-images/" },
    { name: "PDF to Text", short_name: "PDF Text", url: "/tools/pdf-to-text/" },
    { name: "PDF to Word", short_name: "PDF DOCX", url: "/tools/pdf-to-word/" },
    { name: "Signature PNG", short_name: "Signature", url: "/tools/signature-png/" },
    { name: "Passport Photo", short_name: "Passport", url: "/tools/passport-photo/" },
    { name: "Invoice generator", short_name: "Invoice", url: "/tools/invoice-generator/" },
  ],
};
fs.writeFileSync(path.join(root, "site.webmanifest"), `${JSON.stringify(manifest, null, 2)}\n`);

const opensearch = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>PrintableTools Lab</ShortName>
  <Description>Search free no-signup browser PDF, image, and QR tools from PrintableTools Lab.</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image height="32" width="32" type="image/png">${fileUrl("assets/images/favicon.png")}</Image>
  <Url type="text/html" template="${siteUrl("tools").replace(/&/g, "&amp;")}?q={searchTerms}"/>
</OpenSearchDescription>
`;
fs.writeFileSync(path.join(root, "opensearch.xml"), opensearch);

const headersPath = path.join(root, "_headers");
if (fs.existsSync(headersPath)) {
  const headers = fs.readFileSync(headersPath, "utf8");
  if (!headers.includes("/discovery.json")) {
    fs.appendFileSync(headersPath, "\n/discovery.json\n  Content-Type: application/json; charset=utf-8\n");
  }
  if (!headers.includes("/site.webmanifest")) {
    fs.appendFileSync(headersPath, "\n/site.webmanifest\n  Content-Type: application/manifest+json; charset=utf-8\n");
  }
  if (!headers.includes("/opensearch.xml")) {
    fs.appendFileSync(headersPath, "\n/opensearch.xml\n  Content-Type: application/opensearchdescription+xml; charset=utf-8\n");
  }
  if (!headers.includes("/feed.xml")) {
    fs.appendFileSync(headersPath, "\n/feed.xml\n  Content-Type: application/rss+xml; charset=utf-8\n");
  }
  if (!headers.includes("/share-kit.json")) {
    fs.appendFileSync(headersPath, "\n/share-kit.json\n  Content-Type: application/json; charset=utf-8\n");
  }
  if (!headers.includes("/platform-submit-queue.json")) {
    fs.appendFileSync(headersPath, "\n/platform-submit-queue.json\n  Content-Type: application/json; charset=utf-8\n");
  }
if (!headers.includes("/platform-outreach-tracker.json")) {
  fs.appendFileSync(headersPath, "\n/platform-outreach-tracker.json\n  Content-Type: application/json; charset=utf-8\n");
}
if (!headers.includes("/platform-submit-cockpit.json")) {
  fs.appendFileSync(headersPath, "\n/platform-submit-cockpit.json\n  Content-Type: application/json; charset=utf-8\n");
}
  if (!headers.includes("/assets/vendor/fflate.min.js")) {
    fs.appendFileSync(headersPath, "\n/assets/vendor/fflate.min.js\n  Content-Type: application/javascript; charset=utf-8\n");
  }
  if (!headers.includes("/assets/vendor/fflate.LICENSE.md")) {
    fs.appendFileSync(headersPath, "\n/assets/vendor/fflate.LICENSE.md\n  Content-Type: text/markdown; charset=utf-8\n");
  }
  if (!headers.includes("/assets/vendor/pdf.min.mjs")) {
    fs.appendFileSync(headersPath, "\n/assets/vendor/pdf.min.mjs\n  Content-Type: application/javascript; charset=utf-8\n");
  }
  if (!headers.includes("/assets/vendor/pdf.worker.min.mjs")) {
    fs.appendFileSync(headersPath, "\n/assets/vendor/pdf.worker.min.mjs\n  Content-Type: application/javascript; charset=utf-8\n");
  }
  if (!headers.includes("/assets/vendor/pdfjs.LICENSE.md")) {
    fs.appendFileSync(headersPath, "\n/assets/vendor/pdfjs.LICENSE.md\n  Content-Type: text/markdown; charset=utf-8\n");
  }
}

const adsTxtPath = path.join(root, "ads.txt");
if (!fs.existsSync(adsTxtPath)) {
  fs.writeFileSync(adsTxtPath, "# No authorized advertising sellers configured yet.\n");
}

const toolsJson = {
  name: SITE_SUMMARY.name,
  description: SITE_SUMMARY.description,
  url: siteUrl(""),
  generatedAt: generatedAtIso,
  tools: tools.map((tool) => ({
    title: tool.title,
    url: siteUrl(tool.path),
    description: tool.description,
    category: categoryForTool(tool.path),
  })),
  guides: guides.map((guide) => ({
    title: guide.title,
    url: siteUrl(guide.path),
    description: guide.description,
  })),
};
fs.writeFileSync(path.join(root, "tools.json"), `${JSON.stringify(toolsJson, null, 2)}\n`);

const shareKitJson = {
  name: "PrintableTools Lab Share Kit",
  generatedAt: generatedAtIso,
  canonical: siteUrl("share-kit"),
  purpose: "Zero-budget distribution assets for useful, compliant sharing of PrintableTools Lab.",
  featuredLinks: SHARE_KIT_FEATURED_LINKS.map(([title, pathName, reason]) => ({
    title,
    url: `${siteUrl(pathName).replace(/\/$/, "")}?utm_source=share-kit&utm_medium=organic`,
    canonicalUrl: siteUrl(pathName),
    reason,
  })),
  posts: SHARE_KIT_POSTS.map((post) => ({
    ...post,
    url: trackedSharePostUrl(post),
  })),
  videoAssets: campaignAssets,
  zeroDomainGameExperiment: ZERO_DOMAIN_GAME_EXPERIMENT,
  zeroDomainGameExperiments: ZERO_DOMAIN_GAME_EXPERIMENTS,
  externalDiscovery: {
    gist: gistDiscovery?.htmlUrl || "",
    gistRaw: gistDiscovery?.rawUrl || "",
    githubIssue: issueDiscovery?.issueUrl || "",
  },
  rules: SHARE_KIT_RULES,
};
fs.writeFileSync(path.join(root, "share-kit.json"), `${JSON.stringify(shareKitJson, null, 2)}\n`);

const platformSubmitQueueJson = {
  name: "HTML5 Platform Submit Queue",
  generatedAt: generatedAtIso,
  canonical: siteUrl("platform-submit-queue"),
  strategy: ZERO_DOMAIN_PLATFORM_STRATEGY,
  queue: PLATFORM_SUBMIT_QUEUE,
  games: ZERO_DOMAIN_GAME_EXPERIMENTS,
  nextAction: "Submit Neon Lane Dash to CrazyGames, then Yandex Games. Submit Upload Limit Panic after the first review is live or pending.",
  completionGate: "At least one platform submission accepted/live and platform analytics show real plays; ad revenue requires platform ad eligibility and payout setup.",
};
fs.writeFileSync(path.join(root, "platform-submit-queue.json"), `${JSON.stringify(platformSubmitQueueJson, null, 2)}\n`);

const platformOutreachTrackerJson = {
  name: "HTML5 Platform Outreach Tracker",
  generatedAt: generatedAtIso,
  canonical: siteUrl("platform-outreach-tracker"),
  tracker: PLATFORM_OUTREACH_TRACKER,
  games: ZERO_DOMAIN_GAME_EXPERIMENTS,
  nextAction: "Send Neon Lane Dash to Playgama public email first, then GameDistribution public partnership email, then GamePix form/dashboard.",
  completionGate: "At least one outreach channel confirms review or requests upload metadata; actual goal completion still requires accepted game, real plays, and verified revenue.",
};
fs.writeFileSync(path.join(root, "platform-outreach-tracker.json"), `${JSON.stringify(platformOutreachTrackerJson, null, 2)}\n`);

const platformSubmitCockpitJson = {
  name: "HTML5 Platform Submit Cockpit",
  generatedAt: generatedAtIso,
  canonical: siteUrl("platform-submit-cockpit"),
  cockpit: PLATFORM_SUBMIT_COCKPIT,
  games: ZERO_DOMAIN_GAME_EXPERIMENTS,
  nextAction: "Complete CrazyGames and Yandex dashboard submissions first; use Playgama email/dashboard as the fastest non-domain secondary path.",
  completionGate: "Dashboard submitted/in-review status is progress; the full money goal still requires accepted game, real plays, enabled ads, and verified revenue.",
};
fs.writeFileSync(path.join(root, "platform-submit-cockpit.json"), `${JSON.stringify(platformSubmitCockpitJson, null, 2)}\n`);

const llms = [
  `# ${SITE_SUMMARY.name}`,
  "",
  SITE_SUMMARY.description,
  "",
  `Audience: ${SITE_SUMMARY.audience}`,
  "",
  `Monetization model: ${SITE_SUMMARY.monetization}`,
  "",
  "## Primary URLs",
  "",
  `- Homepage: ${siteUrl("")}`,
  `- Tools index: ${siteUrl("tools")}`,
  `- Free PDF, image, and QR tools directory: ${siteUrl("free-pdf-tools")}`,
  `- PDF, image, and QR tool finder: ${siteUrl("pdf-tool-finder")}`,
  `- Directory submission pack: ${siteUrl("submit-directory")}`,
  `- Share kit: ${siteUrl("share-kit")}`,
  `- HTML5 platform submit queue: ${siteUrl("platform-submit-queue")}`,
  `- HTML5 platform submit cockpit: ${siteUrl("platform-submit-cockpit")}`,
  `- HTML5 platform outreach tracker: ${siteUrl("platform-outreach-tracker")}`,
  `- Guides index: ${siteUrl("guides")}`,
  `- Sitemap: ${fileUrl("sitemap.xml")}`,
  `- RSS feed: ${fileUrl("feed.xml")}`,
  `- Web app manifest: ${fileUrl("site.webmanifest")}`,
  `- OpenSearch description: ${fileUrl("opensearch.xml")}`,
  `- Machine-readable tool list: ${fileUrl("tools.json")}`,
  `- Discovery index: ${fileUrl("discovery.json")}`,
  `- Machine-readable share kit: ${fileUrl("share-kit.json")}`,
  `- Machine-readable platform submit queue: ${fileUrl("platform-submit-queue.json")}`,
  `- Machine-readable platform submit cockpit: ${fileUrl("platform-submit-cockpit.json")}`,
  `- Machine-readable platform outreach tracker: ${fileUrl("platform-outreach-tracker.json")}`,
  ...(gistDiscovery?.htmlUrl ? [`- Public Gist share kit: ${gistDiscovery.htmlUrl}`] : []),
  ...(issueDiscovery?.issueUrl ? [`- Public GitHub growth issue: ${issueDiscovery.issueUrl}`] : []),
  "## Zero-Domain HTML5 Game Experiments",
  "",
  ...ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => `- ${game.name}: ${game.url} | Repository: ${game.repo} | Release: ${game.releaseUrl}`),
  ...(campaignAssets.length ? ["", "## Short-Video Campaign Assets", "", ...campaignAssets.map((asset) => `- [${asset.title} MP4](${asset.downloadUrl}): ${asset.captionEn}`)] : []),
  "",
  "## Tools",
  "",
  ...tools.map((tool) => `- [${tool.title}](${siteUrl(tool.path)}): ${tool.description}`),
  "",
  "## High-Intent Landing Pages",
  "",
  ...landingPages.map((page) => `- [${page.title}](${siteUrl(page.path)}): ${page.intent}`),
  "",
  "## Useful Guide Pages",
  "",
  ...guides.slice(0, 24).map((guide) => `- [${guide.title}](${siteUrl(guide.path)}): ${guide.description}`),
  "",
  "## Notes For Crawlers And Assistants",
  "",
  "- Ordinary PDF, image, and QR file generation runs in the browser and does not require an account.",
  "- Optional AI idea suggestions are server-side and limited to non-sensitive fields.",
  "- Ads are not used as a gate for downloading files.",
  "- Paid checkout is intentionally disabled until free usage and search demand are validated.",
  "",
].join("\n");
fs.writeFileSync(path.join(root, "llms.txt"), llms);

const discoveryIndex = {
  name: SITE_SUMMARY.name,
  url: siteUrl(""),
  generatedAt: generatedAtIso,
  positioning: "Free no-signup browser PDF, image, and QR tools with local generation, original guides, and responsible ad placement after approval.",
  feed: fileUrl("feed.xml"),
  manifest: fileUrl("site.webmanifest"),
  opensearch: fileUrl("opensearch.xml"),
  shareKit: fileUrl("share-kit.json"),
  platformSubmitQueue: fileUrl("platform-submit-queue.json"),
  platformSubmitCockpit: fileUrl("platform-submit-cockpit.json"),
  platformOutreachTracker: fileUrl("platform-outreach-tracker.json"),
  highIntentEntryPoints: [siteUrl("free-pdf-tools"), siteUrl("pdf-tool-finder"), siteUrl("submit-directory"), siteUrl("share-kit"), siteUrl("platform-submit-queue"), siteUrl("platform-submit-cockpit"), siteUrl("platform-outreach-tracker"), ...HIGH_INTENT_LANDING_PATHS.map(siteUrl), ...HIGH_INTENT_TOOL_PATHS.map(siteUrl)],
  distributionAssets: {
    shareKit: siteUrl("share-kit"),
    shareKitJson: fileUrl("share-kit.json"),
    platformSubmitQueue: siteUrl("platform-submit-queue"),
    platformSubmitQueueJson: fileUrl("platform-submit-queue.json"),
    platformSubmitCockpit: siteUrl("platform-submit-cockpit"),
    platformSubmitCockpitJson: fileUrl("platform-submit-cockpit.json"),
    platformOutreachTracker: siteUrl("platform-outreach-tracker"),
    platformOutreachTrackerJson: fileUrl("platform-outreach-tracker.json"),
    distributionPack: fileUrl("DISTRIBUTION.md"),
    campaignVideos: campaignAssets,
    publicGist: gistDiscovery?.htmlUrl || "",
    publicGistRaw: gistDiscovery?.rawUrl || "",
    publicGrowthIssue: issueDiscovery?.issueUrl || "",
    zeroDomainGame: ZERO_DOMAIN_GAME_EXPERIMENT.url,
    zeroDomainGameRepo: ZERO_DOMAIN_GAME_EXPERIMENT.repo,
    zeroDomainGames: ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => ({
      name: game.name,
      url: game.url,
      repo: game.repo,
      releaseUrl: game.releaseUrl,
      zipUrl: game.zipUrl,
      demoVideoUrl: game.demoVideoUrl,
      coverUrl: game.coverUrl,
      iconUrl: game.iconUrl,
    })),
  },
  landingPages: landingPages.map((page) => ({
    title: page.title,
    url: siteUrl(page.path),
    intent: page.intent,
    tool: liveToolUrl(page.primaryTool),
  })),
  constraints: [
    "No account required.",
    "No ad interaction gate.",
    "No paid checkout in the validation version.",
    "No upload for image and PDF utility tools that are marked local-first.",
  ],
  validationGates: {
    continue30Day: "100 file downloads, 300 tool generations, or growing Search Console impressions.",
    pivot60Day: "If no search exposure or downloads, stop adding printable content and test another ad-supported route.",
    review90Day: "If traffic exists but ad revenue is weak, improve high-intent pages or test compliant affiliate links before paid features.",
  },
};
fs.writeFileSync(path.join(root, "discovery.json"), `${JSON.stringify(discoveryIndex, null, 2)}\n`);

const feedItems = [
  routeToFeedItem(routes.find((route) => route.path === "free-pdf-tools")),
  routeToFeedItem(routes.find((route) => route.path === "pdf-tool-finder")),
  routeToFeedItem(routes.find((route) => route.path === "share-kit")),
  routeToFeedItem(routes.find((route) => route.path === "tools")),
  ...HIGH_INTENT_LANDING_PATHS
    .map((pagePath) => routes.find((route) => route.path === pagePath))
    .filter(Boolean)
    .map(routeToFeedItem),
  ...HIGH_INTENT_TOOL_PATHS
    .map((toolPath) => routes.find((route) => route.path === toolPath))
    .filter(Boolean)
    .map(routeToFeedItem),
  ...guides.slice(0, 12).map(routeToFeedItem),
].filter(Boolean);
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_SUMMARY.name)}</title>
    <link>${escapeXml(siteUrl(""))}</link>
    <atom:link href="${escapeXml(fileUrl("feed.xml"))}" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(SITE_SUMMARY.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${generatedAt.toUTCString()}</lastBuildDate>
${feedItems.map((item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${generatedAt.toUTCString()}</pubDate>
    </item>`).join("\n")}
  </channel>
</rss>
`;
fs.writeFileSync(path.join(root, "feed.xml"), feed);

const distribution = [
  "# PrintableTools Lab Distribution Pack",
  "",
  "Use these snippets for low-friction external discovery. Do not spam communities; post only where free tools are relevant.",
  "",
  "## One-line pitch",
  "",
  "PrintableTools Lab is a free no-signup PDF, image, and QR utility site for compressing images, resizing images, converting image formats, removing simple image backgrounds, adding text to photos, cropping images, rotating images, watermarking images, creating QR codes, creating WiFi QR codes, creating contact QR codes, converting PDF pages to JPG or PNG, extracting PDF text, merging PDFs, splitting PDFs, rotating pages, removing pages, reordering pages, adding page numbers, image-to-PDF conversion, text-to-PDF, Markdown-to-PDF, CSV-to-PDF, JSON-to-PDF, invoices, estimates, receipts, labels, business cards, flyers, coupons, price tags, barcode labels, timesheets, resumes, cover letters, certificates, calendars, meal planners, sign-in sheets, graph paper, packing lists, to-do lists, worksheets, charts, and flashcards.",
  "",
  "## Short launch post",
  "",
  "I built PrintableTools Lab, a free browser-based PDF, image, and QR tool site. It can compress images, resize images, remove simple white or solid backgrounds as transparent PNGs, add text to photos, crop images, rotate images, watermark images, convert JPG/PNG/WebP formats, create static QR codes, WiFi QR signs, contact QR codes, convert PDF pages to JPG or PNG, extract selectable PDF text to TXT, merge PDFs, split PDFs, rotate pages, remove pages, reorder pages, add PDF page numbers, convert images to PDF, create multi-image PDFs, turn text, Markdown, CSV, and JSON into PDF, and create practical documents like invoices, receipts, labels, business cards, flyers, coupons, timesheets, resumes, certificates, calendars, sign-in sheets, graph paper, packing lists, worksheets, and charts. No account and no surprise download fee. Feedback on which tools are most useful would help shape the next batch.",
  "",
  "## Directory submission fields",
  "",
  "- Product name: PrintableTools Lab",
  "- URL: https://printable-tools-lab.pages.dev/",
  "- Category: Productivity, PDF Tools, Document Tools, Education, Small Business Tools, Job Search Tools",
  "- Tagline: Free no-signup PDF, image, and QR tools",
  "- Description: Create practical PDFs, image files, text files, and static QR codes in the browser, including image compression, image resizing, transparent PNG background removal for simple image backgrounds, text-on-image overlays, image cropping, image rotation, image watermarking, JPG/PNG/WebP format conversion, QR codes, WiFi QR signs, contact QR codes, PDF-to-text extraction, PDF merge, PDF split, page rotation, page removal, page reordering, page numbering, image-to-PDF, multi-image PDFs, text-to-PDF, Markdown-to-PDF, CSV-to-PDF, JSON-to-PDF, invoices, estimates, purchase orders, sale records, receipts, labels, business cards, flyers, coupons, price tags, barcode labels, timesheets, resumes, certificates, calendars, sign-in sheets, graph paper, packing lists, to-do lists, worksheets, charts, flashcards, and habit trackers.",
  "- Pricing: Free",
  "",
  "## Tracked campaign links",
  "",
  "Use these only for posts or listings that allow URL parameters. Directory fields can still use the clean homepage URL when a reviewer prefers canonical links.",
  "",
  `- Directory campaign: ${siteUrl("").replace(/\/$/, "")}?utm_source=directory`,
  `- GitHub campaign: ${siteUrl("").replace(/\/$/, "")}?utm_source=github`,
  `- Community campaign: ${siteUrl("").replace(/\/$/, "")}?utm_source=community`,
  "",
  "## High-intent links",
  "",
  `- Free PDF, image, and QR tools directory: ${siteUrl("free-pdf-tools")}`,
  `- PDF, image, and QR tool finder: ${siteUrl("pdf-tool-finder")}`,
  `- Directory submission pack: ${siteUrl("submit-directory")}`,
  `- Share kit page: ${siteUrl("share-kit")}`,
  `- Machine-readable share kit: ${fileUrl("share-kit.json")}`,
  `- Compress image without upload page: ${siteUrl("compress-image-no-upload")}`,
  `- Compress PDF without upload page: ${siteUrl("compress-pdf-no-upload")}`,
  `- Compress image to 100KB page: ${siteUrl("compress-image-to-100kb")}`,
  `- Resize image without upload page: ${siteUrl("resize-image-no-upload")}`,
  `- Convert image format without upload page: ${siteUrl("convert-image-format-no-upload")}`,
  `- Remove background without upload page: ${siteUrl("remove-background-no-upload")}`,
  `- Add text to image without upload page: ${siteUrl("add-text-to-image-no-upload")}`,
  `- Crop image without upload page: ${siteUrl("crop-image-no-upload")}`,
  `- Rotate image without upload page: ${siteUrl("rotate-image-no-upload")}`,
  `- Watermark image without upload page: ${siteUrl("watermark-image-no-upload")}`,
  `- Signature PNG generator page: ${siteUrl("signature-png-generator")}`,
  `- Passport photo maker page: ${siteUrl("passport-photo-maker")}`,
  `- QR code generator without signup page: ${siteUrl("free-qr-code-generator-no-signup")}`,
  `- WiFi QR code generator page: ${siteUrl("wifi-qr-code-generator")}`,
  `- Contact QR code generator page: ${siteUrl("contact-qr-code-generator")}`,
  `- PDF to JPG without upload page: ${siteUrl("pdf-to-jpg-no-upload")}`,
  `- Extract text from PDF without upload page: ${siteUrl("extract-text-from-pdf-no-upload")}`,
  `- Merge PDF without upload page: ${siteUrl("merge-pdf-no-upload")}`,
  `- Split PDF without upload page: ${siteUrl("split-pdf-no-upload")}`,
  `- Add page numbers to PDF page: ${siteUrl("add-page-numbers-to-pdf")}`,
  `- Rotate PDF without upload page: ${siteUrl("rotate-pdf-no-upload")}`,
  `- Remove PDF pages without upload page: ${siteUrl("remove-pages-from-pdf-no-upload")}`,
  `- Reorder PDF pages without upload page: ${siteUrl("reorder-pdf-pages-no-upload")}`,
  `- Watermark PDF without upload page: ${siteUrl("watermark-pdf-no-upload")}`,
  `- Stamp PDF without upload page: ${siteUrl("stamp-pdf-no-upload")}`,
  `- Sign PDF without upload page: ${siteUrl("sign-pdf-no-upload")}`,
  `- No-signup invoice page: ${siteUrl("free-invoice-generator-no-signup")}`,
  `- JPG to PDF without upload page: ${siteUrl("jpg-to-pdf-no-upload")}`,
  `- No-signup resume page: ${siteUrl("free-resume-builder-no-signup")}`,
  `- Free ATS resume checker page: ${siteUrl("ats-resume-checker-free")}`,
  ...landingPages
    .filter((page) => !["free-invoice-generator-no-signup", "jpg-to-pdf-no-upload", "free-resume-builder-no-signup"].includes(page.path))
    .map((page) => `- ${page.title}: ${siteUrl(page.path)}`),
  ...HIGH_INTENT_TOOL_PATHS.map((toolPath) => {
    const tool = tools.find((item) => item.path === toolPath);
    return tool ? `- ${tool.title}: ${siteUrl(tool.path)}` : "";
  }).filter(Boolean),
  "",
  "## Community-safe angles",
  "",
  "- For freelancers: free invoice, estimate, purchase order, receipt, bill of sale, work order, packing slip, inventory sheet, and timesheet PDFs without account creation.",
  "- For high-intent search visitors: no-signup and no-upload landing pages for PDF compression, passport photos, image compression, image resizing, simple background removal, image cropping, image rotation, image watermarking, QR codes, WiFi QR signs, contact QR codes, image format conversion, PDF-to-JPG, PDF-to-text, PDF merge, PDF split, PDF rotation, PDF page removal, PDF page reordering, PDF watermarking, PDF stamping, typed PDF signatures, PDF page numbers, invoices, receipts, work orders, packing slips, inventory sheets, labels, business cards, barcodes, price tags, flyers, coupons, timesheets, resumes, certificates, text-to-PDF, Markdown-to-PDF, CSV-to-PDF, JSON-to-PDF, JPG-to-PDF, and multi-image PDF.",
  "- For small businesses and local sellers: printable business cards, address labels, barcode labels, price tags, flyers, coupons, packing slips, and inventory sheets without design-account or spreadsheet friction.",
  "- For job seekers: free resume, cover letter, and resignation letter PDFs without a hidden export fee.",
  "- For parents and teachers: printable name tracing, chore charts, reward charts, flashcards, weekly planners, and habit trackers.",
  "- For teachers and organizers: free certificate, sign-in sheet, and event checklist PDFs.",
  "- For household planning: monthly calendars and meal planners with grocery lists.",
  "- For everyday utility needs: compress PDFs, crop passport photos, compress images, resize images, remove simple image backgrounds, crop images, rotate images, watermark images, create QR codes, create WiFi QR signs, create contact QR codes, convert image formats, convert PDF pages to JPG or PNG, extract PDF text, merge PDF, split PDF, rotate pages, remove pages, reorder pages, watermark PDFs, stamp PDFs, add typed signature blocks, add page numbers, image-to-PDF conversion, multi-image PDF export, text-to-PDF, Markdown-to-PDF, CSV-to-PDF, JSON-to-PDF, sign-in sheets, graph paper, to-do lists, and packing lists.",
  "",
  "## Places to consider manually",
  "",
  "- Indie Hackers product update or milestone post",
  "- Product Hunt upcoming/manual launch after indexing starts",
  "- DeepLaunch free listing after signing in; their public submit page says free submissions are reviewed within 48 hours",
  "- BootstrapArena normal free startup listing after sign-in flow is available",
  "- Zearches free URL directory for one homepage submission only",
  "- ListAi.cc free no-account AI tool directory submission; submitted on 2026-06-01 and awaiting review",
  "- Reddit communities only when rules allow self-promotion and the tool directly solves a request",
  "- Startup/tool directories with free submissions",
  "- GitHub repository topics and README link",
  "",
  "## Rules",
  "",
  "- Never ask users to click ads.",
  "- Never claim legal, tax, employment, or financial advice.",
  "- Never claim that image conversion or compression removes the need to review sensitive documents before sharing.",
  "- Keep the post framed as a free utility and ask for feedback.",
  "- Record the posted URL and date in OPERATIONS.md.",
  "- Do not repeat-submit the same homepage to the same directory.",
  "",
].join("\n");
fs.writeFileSync(path.join(root, "DISTRIBUTION.md"), distribution);

execFileSync(process.execPath, [path.join(root, "scripts", "build-github-pages.cjs")], { cwd: root, stdio: "inherit" });

console.log(`Generated ${routes.length - 1} static route entries, sitemap.xml, robots.txt, feed.xml, tools.json, discovery.json, llms.txt, and DISTRIBUTION.md.`);

function readCampaignAssets() {
  const filePath = path.join(root, "reports", "campaign-assets-release.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const report = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!Array.isArray(report.assets)) return [];
    return report.assets.map((asset) => ({
      id: asset.id,
      title: asset.title,
      downloadUrl: asset.downloadUrl,
      trackedUrl: asset.trackedUrl,
      captionEn: asset.captionEn,
      captionZh: asset.captionZh,
      hashtags: asset.hashtags,
      sizeBytes: asset.sizeBytes,
    }));
  } catch {
    return [];
  }
}

function readGistDiscovery() {
  const filePath = path.join(root, "reports", "gist-discovery.json");
  if (!fs.existsSync(filePath)) return null;
  try {
    const report = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!report.htmlUrl) return null;
    return {
      htmlUrl: report.htmlUrl,
      rawUrl: report.rawUrl || "",
      gistId: report.gistId || "",
    };
  } catch {
    return null;
  }
}

function readIssueDiscovery() {
  const filePath = path.join(root, "reports", "github-issue-discovery.json");
  if (!fs.existsSync(filePath)) return null;
  try {
    const report = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!report.issueUrl) return null;
    return {
      issueUrl: report.issueUrl,
      issueNumber: report.issueNumber || "",
    };
  } catch {
    return null;
  }
}

function categoryForTool(toolPath) {
  const slug = toolPath.replace(/^tools\//, "");
  if (["invoice-generator", "estimate-generator", "purchase-order", "bill-of-sale", "rent-receipt", "receipt-generator", "timesheet-generator", "packing-slip", "work-order", "inventory-sheet", "business-card", "address-labels", "barcode-labels", "price-tag", "flyer-maker", "coupon-maker"].includes(slug)) return "Business paperwork";
  if (["resume-builder", "ats-resume-checker", "cover-letter", "resignation-letter"].includes(slug)) return "Career documents";
  if (["monthly-calendar", "meal-planner", "weekly-planner", "habit-tracker"].includes(slug)) return "Planning";
  if (["image-to-pdf", "multi-image-pdf", "compress-pdf", "pdf-to-images", "pdf-to-text", "pdf-to-word", "compress-image", "compress-image-to-kb", "resize-image", "convert-image", "remove-background", "crop-image", "rotate-image", "watermark-image", "add-text-image", "signature-png", "passport-photo", "qr-code", "wifi-qr-code", "vcard-qr-code", "merge-pdf", "split-pdf", "pdf-page-numbers", "rotate-pdf", "remove-pdf-pages", "reorder-pdf-pages", "watermark-pdf", "stamp-pdf", "sign-pdf", "text-to-pdf", "markdown-to-pdf", "csv-to-pdf", "json-to-pdf", "sign-in-sheet", "graph-paper", "packing-list", "todo-list"].includes(slug)) return "Everyday file utilities";
  if (["certificate-generator"].includes(slug)) return "Events and awards";
  return "Education and family printables";
}

function fileUrl(fileName) {
  return siteUrl(fileName).replace(/\/$/, "");
}

function trackedSharePostUrl(post) {
  const base = post.absoluteUrl || siteUrl(post.linkPath).replace(/\/$/, "");
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}utm_source=${post.channel}&utm_medium=organic`;
}

function liveToolUrl(toolPath) {
  const [pathname, query] = String(toolPath).split("?");
  return `${siteUrl(pathname)}${query ? `?${query}` : ""}`;
}

function routeToFeedItem(route) {
  if (!route) return null;
  return {
    title: route.title,
    description: route.description,
    url: siteUrl(route.path),
  };
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
