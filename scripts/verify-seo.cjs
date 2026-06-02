const fs = require("fs");
const path = require("path");
const { routes, siteUrl, landingPages, HIGH_INTENT_TOOL_PATHS, tools } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const failures = [];

for (const route of routes) {
  if (route.index === false) continue;
  const file = route.path ? path.join(root, route.path, "index.html") : path.join(root, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing file: ${route.path || "/"}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(`<title>${route.title} - PrintableTools Lab</title>`)) failures.push(`Missing title: ${route.path || "/"}`);
  if (!html.includes(`content="${escapeAttr(route.description)}"`)) failures.push(`Missing description: ${route.path || "/"}`);
  if (!html.includes(`rel="canonical" href="${siteUrl(route.path)}"`)) failures.push(`Missing canonical: ${route.path || "/"}`);
  if (!/<main id="app" tabindex="-1">\s*[\s\S]{120,}\s*<\/main>/.test(html)) failures.push(`Weak static body: ${route.path || "/"}`);
  if (route.path && route.path.startsWith("tools/")) {
    if (!html.includes('"@type":"SoftwareApplication"')) failures.push(`Missing tool SoftwareApplication schema: ${route.path}`);
    if (!html.includes('"@type":"FAQPage"')) failures.push(`Missing tool FAQPage schema: ${route.path}`);
    if (!html.includes("How to use this free")) failures.push(`Missing tool instructions: ${route.path}`);
    if (!html.includes("Privacy and limits")) failures.push(`Missing tool privacy content: ${route.path}`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
if (!sitemap.includes("<lastmod>")) failures.push("sitemap.xml missing lastmod entries.");
for (const route of routes) {
  if (route.index === false) continue;
  const loc = siteUrl(route.path);
  if (!sitemap.includes(`<loc>${loc}</loc>`)) failures.push(`Missing sitemap loc: ${loc}`);
}

const robotsFile = path.join(root, "robots.txt");
if (!fs.existsSync(robotsFile)) failures.push("Missing robots.txt.");
else {
  const robots = fs.readFileSync(robotsFile, "utf8");
  if (!robots.includes("User-agent: *")) failures.push("robots.txt missing user-agent.");
  if (!robots.includes(`Sitemap: ${siteUrl("sitemap.xml").replace(/\/$/, "")}`)) failures.push("robots.txt missing sitemap directive.");
  if (robots.includes("Sitemap: https://printable-tools-lab.pages.dev/llms.txt")) failures.push("robots.txt should not list llms.txt as a sitemap.");
  if (robots.includes("Sitemap: https://printable-tools-lab.pages.dev/tools.json")) failures.push("robots.txt should not list tools.json as a sitemap.");
  if (!robots.includes("Disallow: /dashboard/")) failures.push("robots.txt should disallow dashboard.");
  if (!robots.includes("Disallow: /reports/")) failures.push("robots.txt should disallow reports.");
}

const llmsFile = path.join(root, "llms.txt");
if (!fs.existsSync(llmsFile)) failures.push("Missing llms.txt.");
else {
  const llms = fs.readFileSync(llmsFile, "utf8");
  if (!llms.includes("# PrintableTools Lab")) failures.push("llms.txt missing title.");
  if (!llms.includes("## Tools")) failures.push("llms.txt missing tools section.");
  if (!llms.includes(siteUrl("tools"))) failures.push("llms.txt missing tools URL.");
  if (!llms.includes(siteUrl("site.webmanifest").replace(/\/$/, ""))) failures.push("llms.txt missing manifest URL.");
  if (!llms.includes(siteUrl("opensearch.xml").replace(/\/$/, ""))) failures.push("llms.txt missing OpenSearch URL.");
  if (!llms.includes(siteUrl("feed.xml").replace(/\/$/, ""))) failures.push("llms.txt missing RSS feed URL.");
  if (!llms.includes(siteUrl("tools.json").replace(/\/$/, ""))) failures.push("llms.txt missing tools.json URL.");
  if (!llms.includes(siteUrl("share-kit"))) failures.push("llms.txt missing share kit URL.");
  if (!llms.includes(siteUrl("share-kit.json").replace(/\/$/, ""))) failures.push("llms.txt missing share-kit.json URL.");
  if (!llms.includes(siteUrl("platform-submit-queue"))) failures.push("llms.txt missing platform submit queue URL.");
  if (!llms.includes(siteUrl("platform-submit-queue.json").replace(/\/$/, ""))) failures.push("llms.txt missing platform submit queue JSON URL.");
  if (!llms.includes(siteUrl("platform-submit-cockpit"))) failures.push("llms.txt missing platform submit cockpit URL.");
  if (!llms.includes(siteUrl("platform-submit-cockpit.json").replace(/\/$/, ""))) failures.push("llms.txt missing platform submit cockpit JSON URL.");
  if (!llms.includes(siteUrl("platform-outreach-tracker"))) failures.push("llms.txt missing platform outreach tracker URL.");
  if (!llms.includes(siteUrl("platform-outreach-tracker.json").replace(/\/$/, ""))) failures.push("llms.txt missing platform outreach tracker JSON URL.");
  if (!llms.includes(siteUrl("zero-cost-monetization-map"))) failures.push("llms.txt missing zero-cost monetization map URL.");
  if (!llms.includes(siteUrl("zero-cost-monetization-map.json").replace(/\/$/, ""))) failures.push("llms.txt missing zero-cost monetization map JSON URL.");
  if (!llms.includes("https://upload-limit-panic.pages.dev/")) failures.push("llms.txt missing zero-domain game experiment URL.");
  if (!llms.includes("https://neon-lane-dash.pages.dev/")) failures.push("llms.txt missing second zero-domain game experiment URL.");
}

const feedFile = path.join(root, "feed.xml");
if (!fs.existsSync(feedFile)) failures.push("Missing feed.xml.");
else {
  const feed = fs.readFileSync(feedFile, "utf8");
  if (!feed.includes("<rss version=\"2.0\"")) failures.push("feed.xml missing RSS root.");
  if (!feed.includes(siteUrl("free-pdf-tools"))) failures.push("feed.xml missing free PDF tools directory.");
  if (!feed.includes(siteUrl("share-kit"))) failures.push("feed.xml missing share kit URL.");
  if (!feed.includes(siteUrl("free-invoice-generator-no-signup"))) failures.push("feed.xml missing high-intent no-signup invoice URL.");
  if (!feed.includes(siteUrl("tools/image-to-pdf"))) failures.push("feed.xml missing high-intent image-to-PDF URL.");
  if (!feed.includes("<lastBuildDate>")) failures.push("feed.xml missing lastBuildDate.");
}

const manifestFile = path.join(root, "site.webmanifest");
if (!fs.existsSync(manifestFile)) failures.push("Missing site.webmanifest.");
else {
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  if (manifest.name !== "PrintableTools Lab") failures.push("site.webmanifest missing app name.");
  if (manifest.start_url !== "/free-pdf-tools/") failures.push("site.webmanifest should start at the free PDF tools page.");
  if (!Array.isArray(manifest.shortcuts) || !manifest.shortcuts.some((item) => item.url === "/pdf-tool-finder/")) failures.push("site.webmanifest missing PDF tool finder shortcut.");
}

const opensearchFile = path.join(root, "opensearch.xml");
if (!fs.existsSync(opensearchFile)) failures.push("Missing opensearch.xml.");
else {
  const opensearch = fs.readFileSync(opensearchFile, "utf8");
  if (!opensearch.includes("<OpenSearchDescription")) failures.push("opensearch.xml missing root element.");
  if (!opensearch.includes("PrintableTools Lab")) failures.push("opensearch.xml missing site name.");
  if (!opensearch.includes(siteUrl("tools").replace(/&/g, "&amp;"))) failures.push("opensearch.xml missing tools URL template.");
}

const toolsJsonFile = path.join(root, "tools.json");
if (!fs.existsSync(toolsJsonFile)) failures.push("Missing tools.json.");
else {
  const data = JSON.parse(fs.readFileSync(toolsJsonFile, "utf8"));
  if (!Array.isArray(data.tools) || data.tools.length < 66) failures.push("tools.json missing tools.");
  if (!Array.isArray(data.guides) || data.guides.length < 95) failures.push("tools.json missing guides.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/invoice-generator"))) failures.push("tools.json missing invoice URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/image-to-pdf"))) failures.push("tools.json missing image-to-PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/multi-image-pdf"))) failures.push("tools.json missing multi-image PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/compress-pdf"))) failures.push("tools.json missing compress PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/ats-resume-checker"))) failures.push("tools.json missing ATS resume checker URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/pdf-to-images"))) failures.push("tools.json missing PDF-to-images URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/pdf-to-text"))) failures.push("tools.json missing PDF-to-text URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/pdf-to-word"))) failures.push("tools.json missing PDF-to-Word URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/compress-image"))) failures.push("tools.json missing compress image URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/resize-image"))) failures.push("tools.json missing resize image URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/convert-image"))) failures.push("tools.json missing convert image URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/remove-background"))) failures.push("tools.json missing background remover URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/crop-image"))) failures.push("tools.json missing crop image URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/rotate-image"))) failures.push("tools.json missing rotate image URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/watermark-image"))) failures.push("tools.json missing watermark image URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/add-text-image"))) failures.push("tools.json missing add text to image URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/signature-png"))) failures.push("tools.json missing signature PNG URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/passport-photo"))) failures.push("tools.json missing passport photo URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/qr-code"))) failures.push("tools.json missing QR code URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/wifi-qr-code"))) failures.push("tools.json missing WiFi QR code URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/vcard-qr-code"))) failures.push("tools.json missing contact QR code URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/merge-pdf"))) failures.push("tools.json missing merge PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/split-pdf"))) failures.push("tools.json missing split PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/pdf-page-numbers"))) failures.push("tools.json missing PDF page numbers URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/rotate-pdf"))) failures.push("tools.json missing rotate PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/remove-pdf-pages"))) failures.push("tools.json missing remove PDF pages URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/reorder-pdf-pages"))) failures.push("tools.json missing reorder PDF pages URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/watermark-pdf"))) failures.push("tools.json missing watermark PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/stamp-pdf"))) failures.push("tools.json missing stamp PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/sign-pdf"))) failures.push("tools.json missing sign PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/markdown-to-pdf"))) failures.push("tools.json missing markdown-to-PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/csv-to-pdf"))) failures.push("tools.json missing CSV-to-PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/json-to-pdf"))) failures.push("tools.json missing JSON-to-PDF URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/compress-image-to-kb"))) failures.push("tools.json missing image-to-KB URL.");
}

for (const pagePath of ["compress-image-to-50kb", "compress-image-to-100kb", "compress-image-to-200kb", "compress-image-to-500kb"]) {
  const file = path.join(root, pagePath, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing target-KB image landing page: ${pagePath}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const target = pagePath.match(/(\d+)kb/)?.[1] || "";
  if (!html.includes(`Compress image to ${target}KB without uploading`)) failures.push(`Target-KB landing page missing headline: ${pagePath}`);
  if (!html.includes(`/tools/compress-image-to-kb/?targetKb=${target}`)) failures.push(`Target-KB landing page missing prefilled tool link: ${pagePath}`);
  if (!sitemap.includes(`<loc>${siteUrl(pagePath)}</loc>`)) failures.push(`Sitemap missing target-KB landing page: ${pagePath}`);
}

for (const [pagePath, targetSize, headlineSize] of [["compress-pdf-to-500kb", "500kb", "500KB"], ["compress-pdf-to-1mb", "1mb", "1MB"], ["compress-pdf-to-2mb", "2mb", "2MB"], ["compress-pdf-to-5mb", "5mb", "5MB"]]) {
  const file = path.join(root, pagePath, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing target-size PDF landing page: ${pagePath}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(`Compress PDF to ${headlineSize} without uploading`)) failures.push(`Target-size PDF landing page missing headline: ${pagePath}`);
  if (!html.includes(`/tools/compress-pdf/?targetSize=${targetSize}`)) failures.push(`Target-size PDF landing page missing prefilled tool link: ${pagePath}`);
  if (!sitemap.includes(`<loc>${siteUrl(pagePath)}</loc>`)) failures.push(`Sitemap missing target-size PDF landing page: ${pagePath}`);
}

const freePdfToolsFile = path.join(root, "free-pdf-tools", "index.html");
if (!fs.existsSync(freePdfToolsFile)) failures.push("Missing free PDF tools directory page.");
else {
  const html = fs.readFileSync(freePdfToolsFile, "utf8");
  if (!html.includes("Free PDF, image, and QR tools without signup")) failures.push("Free PDF tools page missing target heading.");
  if (!html.includes("/tools/ats-resume-checker/") || !html.includes("/tools/compress-pdf/") || !html.includes("/tools/compress-image/") || !html.includes("/tools/compress-image-to-kb/") || !html.includes("/tools/resize-image/") || !html.includes("/tools/convert-image/") || !html.includes("/tools/remove-background/") || !html.includes("/tools/crop-image/") || !html.includes("/tools/rotate-image/") || !html.includes("/tools/watermark-image/") || !html.includes("/tools/add-text-image/") || !html.includes("/tools/signature-png/") || !html.includes("/tools/passport-photo/") || !html.includes("/tools/qr-code/") || !html.includes("/tools/wifi-qr-code/") || !html.includes("/tools/vcard-qr-code/") || !html.includes("/tools/multi-image-pdf/") || !html.includes("/tools/pdf-to-images/") || !html.includes("/tools/pdf-to-text/") || !html.includes("/tools/pdf-to-word/") || !html.includes("/tools/merge-pdf/") || !html.includes("/tools/split-pdf/") || !html.includes("/tools/pdf-page-numbers/") || !html.includes("/tools/rotate-pdf/") || !html.includes("/tools/remove-pdf-pages/") || !html.includes("/tools/reorder-pdf-pages/") || !html.includes("/tools/watermark-pdf/") || !html.includes("/tools/stamp-pdf/") || !html.includes("/tools/sign-pdf/") || !html.includes("/tools/text-to-pdf/") || !html.includes("/tools/markdown-to-pdf/") || !html.includes("/tools/csv-to-pdf/") || !html.includes("/tools/json-to-pdf/")) failures.push("Free PDF tools page missing conversion links.");
  if (!html.includes('"@type":"ItemList"')) failures.push("Free PDF tools page missing ItemList schema.");
}

const finderFile = path.join(root, "pdf-tool-finder", "index.html");
if (!fs.existsSync(finderFile)) failures.push("Missing PDF tool finder page.");
else {
  const html = fs.readFileSync(finderFile, "utf8");
  if (!html.includes("Which free PDF, image, or QR tool should I use?")) failures.push("PDF tool finder missing target heading.");
  if (!html.includes("/tools/ats-resume-checker/") || !html.includes("/tools/compress-pdf/") || !html.includes("/tools/compress-image/") || !html.includes("/tools/compress-image-to-kb/") || !html.includes("/tools/resize-image/") || !html.includes("/tools/convert-image/") || !html.includes("/tools/remove-background/") || !html.includes("/tools/crop-image/") || !html.includes("/tools/rotate-image/") || !html.includes("/tools/watermark-image/") || !html.includes("/tools/add-text-image/") || !html.includes("/tools/signature-png/") || !html.includes("/tools/passport-photo/") || !html.includes("/tools/qr-code/") || !html.includes("/tools/wifi-qr-code/") || !html.includes("/tools/vcard-qr-code/") || !html.includes("/tools/image-to-pdf/") || !html.includes("/tools/pdf-to-images/") || !html.includes("/tools/pdf-to-text/") || !html.includes("/tools/pdf-to-word/") || !html.includes("/tools/merge-pdf/") || !html.includes("/tools/split-pdf/") || !html.includes("/tools/rotate-pdf/") || !html.includes("/tools/remove-pdf-pages/") || !html.includes("/tools/reorder-pdf-pages/") || !html.includes("/tools/watermark-pdf/") || !html.includes("/tools/stamp-pdf/") || !html.includes("/tools/sign-pdf/") || !html.includes("/tools/markdown-to-pdf/") || !html.includes("/tools/csv-to-pdf/") || !html.includes("/tools/json-to-pdf/") || !html.includes("/tools/receipt-generator/")) failures.push("PDF tool finder missing high-intent tool links.");
  if (!html.includes("Invoice vs receipt")) failures.push("PDF tool finder missing decision content.");
  if (!html.includes('"@type":"ItemList"')) failures.push("PDF tool finder missing ItemList schema.");
}

const submissionPackFile = path.join(root, "submit-directory", "index.html");
if (!fs.existsSync(submissionPackFile)) failures.push("Missing directory submission pack page.");
else {
  const html = fs.readFileSync(submissionPackFile, "utf8");
  if (!html.includes("PrintableTools Lab directory submission pack")) failures.push("Directory submission pack missing heading.");
  if (!html.includes("Free no-signup browser PDF, image, and QR tools")) failures.push("Directory submission pack missing tagline.");
  if (!html.includes("/assets/images/app-icon-512.png")) failures.push("Directory submission pack missing icon asset link.");
  if (!html.includes("/assets/images/free-pdf-tools-screenshot.png")) failures.push("Directory submission pack missing screenshot asset link.");
  if (!html.includes(siteUrl("submit-directory"))) failures.push("Directory submission pack missing canonical.");
  if (!sitemap.includes(`<loc>${siteUrl("submit-directory")}</loc>`)) failures.push("Sitemap missing directory submission pack.");
}

const shareKitFile = path.join(root, "share-kit", "index.html");
if (!fs.existsSync(shareKitFile)) failures.push("Missing share kit page.");
else {
  const html = fs.readFileSync(shareKitFile, "utf8");
  if (!html.includes("PrintableTools Lab share kit")) failures.push("Share kit missing heading.");
  if (!html.includes("Priority links")) failures.push("Share kit missing priority links.");
  if (!html.includes("/share-kit.json")) failures.push("Share kit missing JSON link.");
  if (!html.includes("Compress PDF to 1MB")) failures.push("Share kit missing PDF compression angle.");
  if (!html.includes("Ready-to-upload MP4 assets")) failures.push("Share kit missing campaign video assets section.");
  if (!html.includes("ptl-pdf-under-1mb.mp4")) failures.push("Share kit missing public MP4 asset link.");
  if (!html.includes("gist.github.com/yanqr213")) failures.push("Share kit missing public Gist mirror link.");
  if (!html.includes("github.com/yanqr213/printable-tools-lab/issues/1")) failures.push("Share kit missing public GitHub issue link.");
  if (!html.includes("https://upload-limit-panic.pages.dev/")) failures.push("Share kit missing zero-domain game experiment link.");
  if (!html.includes("upload-limit-panic-html5.zip")) failures.push("Share kit missing zero-domain game ZIP link.");
  if (!html.includes("upload-limit-panic-demo.mp4")) failures.push("Share kit missing zero-domain game demo video link.");
  if (!html.includes("upload-limit-panic-cover-16x9.png")) failures.push("Share kit missing zero-domain game cover image link.");
  if (!html.includes("upload-limit-panic-icon-512.png")) failures.push("Share kit missing zero-domain game icon link.");
  if (!html.includes("https://neon-lane-dash.pages.dev/")) failures.push("Share kit missing Neon Lane Dash experiment link.");
  if (!html.includes("neon-lane-dash-html5.zip")) failures.push("Share kit missing Neon Lane Dash ZIP link.");
  if (!html.includes("neon-lane-dash-demo.mp4")) failures.push("Share kit missing Neon Lane Dash demo video link.");
  if (!html.includes("neon-lane-dash-cover-16x9.png")) failures.push("Share kit missing Neon Lane Dash cover image link.");
  if (!html.includes("neon-lane-dash-icon-512.png")) failures.push("Share kit missing Neon Lane Dash icon link.");
  if (!sitemap.includes(`<loc>${siteUrl("share-kit")}</loc>`)) failures.push("Sitemap missing share kit.");
}

const shareKitJsonFile = path.join(root, "share-kit.json");
if (!fs.existsSync(shareKitJsonFile)) failures.push("Missing share-kit.json.");
else {
  const data = JSON.parse(fs.readFileSync(shareKitJsonFile, "utf8"));
  if (!Array.isArray(data.featuredLinks) || data.featuredLinks.length < 8) failures.push("share-kit.json missing featured links.");
  if (!Array.isArray(data.posts) || data.posts.length < 4) failures.push("share-kit.json missing posts.");
  if (!Array.isArray(data.videoAssets) || data.videoAssets.length < 6) failures.push("share-kit.json missing video assets.");
  if (!data.videoAssets.some((item) => item.downloadUrl && item.downloadUrl.includes("ptl-pdf-under-1mb.mp4"))) failures.push("share-kit.json missing public campaign MP4 URL.");
  if (!data.externalDiscovery || !data.externalDiscovery.gist || !data.externalDiscovery.gist.includes("gist.github.com/yanqr213")) failures.push("share-kit.json missing public Gist URL.");
  if (!data.externalDiscovery || !data.externalDiscovery.githubIssue || !data.externalDiscovery.githubIssue.includes("github.com/yanqr213/printable-tools-lab/issues/1")) failures.push("share-kit.json missing public GitHub issue URL.");
  if (!data.zeroDomainGameExperiment || data.zeroDomainGameExperiment.url !== "https://upload-limit-panic.pages.dev/") failures.push("share-kit.json missing zero-domain game experiment.");
  if (!data.zeroDomainGameExperiment || !String(data.zeroDomainGameExperiment.zipUrl || "").includes("upload-limit-panic-html5.zip")) failures.push("share-kit.json missing zero-domain game ZIP URL.");
  if (!data.zeroDomainGameExperiment || !String(data.zeroDomainGameExperiment.coverUrl || "").includes("upload-limit-panic-cover-16x9.png")) failures.push("share-kit.json missing zero-domain game cover URL.");
  if (!Array.isArray(data.zeroDomainGameExperiments) || data.zeroDomainGameExperiments.length < 2) failures.push("share-kit.json missing zero-domain game experiment list.");
  if (!Array.isArray(data.zeroDomainGameExperiments) || !data.zeroDomainGameExperiments.some((item) => item.url === "https://neon-lane-dash.pages.dev/")) failures.push("share-kit.json missing Neon Lane Dash experiment.");
  if (!Array.isArray(data.zeroDomainGameExperiments) || !data.zeroDomainGameExperiments.some((item) => String(item.zipUrl || "").includes("neon-lane-dash-html5.zip"))) failures.push("share-kit.json missing Neon Lane Dash ZIP URL.");
  if (!Array.isArray(data.rules) || data.rules.length < 5) failures.push("share-kit.json missing distribution rules.");
  if (!data.featuredLinks.some((item) => item.url && item.url.includes("utm_source=share-kit"))) failures.push("share-kit.json missing tracked share-kit URLs.");
}

const platformSubmitQueueFile = path.join(root, "platform-submit-queue", "index.html");
if (!fs.existsSync(platformSubmitQueueFile)) failures.push("Missing platform submit queue page.");
else {
  const html = fs.readFileSync(platformSubmitQueueFile, "utf8");
  if (!html.includes("HTML5 platform submit queue")) failures.push("Platform submit queue missing heading.");
  if (!html.includes("CrazyGames")) failures.push("Platform submit queue missing CrazyGames.");
  if (!html.includes("Yandex Games")) failures.push("Platform submit queue missing Yandex Games.");
  for (const platform of ["Playgama", "GamePix", "Lagged", "GameFlare", "Kongregate", "Newgrounds", "GameDistribution", "Poki"]) {
    if (!html.includes(platform)) failures.push(`Platform submit queue missing ${platform}.`);
  }
  if (!html.includes("Neon Lane Dash")) failures.push("Platform submit queue missing Neon Lane Dash.");
  if (!html.includes("Upload Limit Panic")) failures.push("Platform submit queue missing Upload Limit Panic.");
  if (!html.includes("platform-submission-copy.md")) failures.push("Platform submit queue missing copy-ready field pack links.");
  if (!html.includes("review-readiness")) failures.push("Platform submit queue missing review-readiness links.");
  if (!html.includes("portal-clean.zip")) failures.push("Platform submit queue missing clean portal ZIP links.");
  if (!html.includes("clean-portal-package.json")) failures.push("Platform submit queue missing clean portal package report links.");
  if (!html.includes("Zero-domain decision")) failures.push("Platform submit queue missing zero-domain decision section.");
  if (!html.includes("Money gate")) failures.push("Platform submit queue missing money gate.");
  if (!html.includes("Current gate")) failures.push("Platform submit queue missing current platform gate notes.");
  if (!html.includes("games.yandex.com/console")) failures.push("Platform submit queue missing corrected Yandex Console URL.");
  if (!html.includes("/platform-submit-queue.json")) failures.push("Platform submit queue missing machine-readable JSON link.");
  if (!sitemap.includes(`<loc>${siteUrl("platform-submit-queue")}</loc>`)) failures.push("Sitemap missing platform submit queue.");
}

const platformSubmitQueueJsonFile = path.join(root, "platform-submit-queue.json");
if (!fs.existsSync(platformSubmitQueueJsonFile)) failures.push("Missing platform-submit-queue.json.");
else {
  const data = JSON.parse(fs.readFileSync(platformSubmitQueueJsonFile, "utf8"));
  if (!data.strategy || !Array.isArray(data.strategy.immediateRoute)) failures.push("platform-submit-queue.json missing zero-domain strategy.");
  if (!data.strategy || !String(data.strategy.moneyGate || "").includes("revenue")) failures.push("platform-submit-queue.json missing revenue money gate.");
  if (!Array.isArray(data.strategy.officialEvidence) || data.strategy.officialEvidence.length < 3) failures.push("platform-submit-queue.json missing official evidence notes.");
  if (!Array.isArray(data.queue) || data.queue.length < 11) failures.push("platform-submit-queue.json missing expanded platform queue.");
  if (!data.queue.some((item) => item.platform === "Yandex Games" && String(item.submissionUrl).includes("games.yandex.com/console"))) failures.push("platform-submit-queue.json missing corrected Yandex Console URL.");
  for (const platform of ["Playgama", "GamePix", "Lagged", "GameFlare", "Kongregate", "Newgrounds", "GameDistribution", "Poki"]) {
    if (!data.queue.some((item) => item.platform === platform)) failures.push(`platform-submit-queue.json missing ${platform}.`);
  }
  if (!Array.isArray(data.games) || data.games.length < 2) failures.push("platform-submit-queue.json missing game assets.");
  if (!data.queue.some((item) => item.platform === "CrazyGames")) failures.push("platform-submit-queue.json missing CrazyGames.");
  if (!data.queue.some((item) => item.platform === "Yandex Games")) failures.push("platform-submit-queue.json missing Yandex Games.");
  if (!data.games.some((item) => item.name === "Neon Lane Dash")) failures.push("platform-submit-queue.json missing Neon Lane Dash.");
  if (!data.games.some((item) => item.name === "Upload Limit Panic")) failures.push("platform-submit-queue.json missing Upload Limit Panic.");
  if (!data.games.every((item) => String(item.submissionCopyUrl || "").includes("platform-submission-copy.md"))) failures.push("platform-submit-queue.json missing submission copy URLs.");
  if (!data.games.every((item) => String(item.reviewReadinessUrl || "").includes("review-readiness.md"))) failures.push("platform-submit-queue.json missing review-readiness URLs.");
  if (!data.games.every((item) => String(item.cleanZipUrl || "").includes("portal-clean.zip"))) failures.push("platform-submit-queue.json missing clean portal ZIP URLs.");
  if (!data.games.every((item) => String(item.cleanPackageReportUrl || "").includes("clean-portal-package.json"))) failures.push("platform-submit-queue.json missing clean portal package report URLs.");
}

const platformSubmitCockpitFile = path.join(root, "platform-submit-cockpit", "index.html");
if (!fs.existsSync(platformSubmitCockpitFile)) failures.push("Missing platform submit cockpit page.");
else {
  const html = fs.readFileSync(platformSubmitCockpitFile, "utf8");
  if (!html.includes("HTML5 platform submit cockpit")) failures.push("Platform submit cockpit missing heading.");
  if (!html.includes("Manual gates")) failures.push("Platform submit cockpit missing manual gates section.");
  if (!html.includes("Morning expectation")) failures.push("Platform submit cockpit missing realistic expectation section.");
  if (!html.includes("Download ZIP")) failures.push("Platform submit cockpit missing ZIP links.");
  if (!html.includes("submitted_awaiting_review")) failures.push("Platform submit cockpit missing CrazyGames submitted status.");
  if (!html.includes("blocked_non_ai_description_required")) failures.push("Platform submit cockpit missing GamePix non-AI description gate.");
  if (!html.includes("GameDistribution")) failures.push("Platform submit cockpit missing GameDistribution row.");
  if (!html.includes("/platform-submit-cockpit.json")) failures.push("Platform submit cockpit missing machine-readable JSON link.");
  if (!sitemap.includes(`<loc>${siteUrl("platform-submit-cockpit")}</loc>`)) failures.push("Sitemap missing platform submit cockpit.");
}

const platformSubmitCockpitJsonFile = path.join(root, "platform-submit-cockpit.json");
if (!fs.existsSync(platformSubmitCockpitJsonFile)) failures.push("Missing platform-submit-cockpit.json.");
else {
  const data = JSON.parse(fs.readFileSync(platformSubmitCockpitJsonFile, "utf8"));
  const cockpit = data.cockpit || {};
  if (!Array.isArray(cockpit.checklist) || cockpit.checklist.length < 5) failures.push("platform-submit-cockpit.json missing platform checklist.");
  if (!cockpit.checklist?.some((item) => item.platform === "CrazyGames" && item.currentStatus === "submitted_awaiting_review")) failures.push("platform-submit-cockpit.json missing CrazyGames submitted state.");
  if (!cockpit.checklist?.some((item) => item.platform === "GamePix" && item.currentStatus === "blocked_non_ai_description_required")) failures.push("platform-submit-cockpit.json missing GamePix non-AI description gate.");
  if (!cockpit.checklist?.some((item) => item.platform === "GameDistribution" && String(item.currentStatus || "").includes("manual_legal_gate"))) failures.push("platform-submit-cockpit.json missing GameDistribution legal gate.");
  if (!cockpit.readyAssets || !String(cockpit.readyAssets.neonLaneDashZip || "").includes("neon-lane-dash-html5.zip")) failures.push("platform-submit-cockpit.json missing Neon ZIP.");
  if (!String(data.completionGate || "").includes("verified revenue")) failures.push("platform-submit-cockpit.json missing verified revenue completion gate.");
}

const platformOutreachTrackerFile = path.join(root, "platform-outreach-tracker", "index.html");
if (!fs.existsSync(platformOutreachTrackerFile)) failures.push("Missing platform outreach tracker page.");
else {
  const html = fs.readFileSync(platformOutreachTrackerFile, "utf8");
  if (!html.includes("HTML5 platform outreach tracker")) failures.push("Platform outreach tracker missing heading.");
  if (!html.includes("developer.success@playgama.com")) failures.push("Platform outreach tracker missing Playgama email.");
  if (!html.includes("partnership@azerion.com")) failures.push("Platform outreach tracker missing GameDistribution email.");
  if (!html.includes("reCAPTCHA")) failures.push("Platform outreach tracker missing GameDistribution form blocker note.");
  if (!html.includes("blocked_non_ai_description_required")) failures.push("Platform outreach tracker missing GamePix non-AI description status.");
  if (!html.includes("Copy-ready outreach")) failures.push("Platform outreach tracker missing copy-ready outreach section.");
  if (!html.includes("/platform-outreach-tracker.json")) failures.push("Platform outreach tracker missing machine-readable JSON link.");
  if (!sitemap.includes(`<loc>${siteUrl("platform-outreach-tracker")}</loc>`)) failures.push("Sitemap missing platform outreach tracker.");
}

const platformOutreachTrackerJsonFile = path.join(root, "platform-outreach-tracker.json");
if (!fs.existsSync(platformOutreachTrackerJsonFile)) failures.push("Missing platform-outreach-tracker.json.");
else {
  const data = JSON.parse(fs.readFileSync(platformOutreachTrackerJsonFile, "utf8"));
  const tracker = data.tracker || {};
  if (!Array.isArray(tracker.channels) || tracker.channels.length < 6) failures.push("platform-outreach-tracker.json missing outreach channels.");
  if (!tracker.channels?.some((item) => item.contact === "developer.success@playgama.com")) failures.push("platform-outreach-tracker.json missing Playgama public email.");
  if (!tracker.channels?.some((item) => item.contact === "partnership@azerion.com")) failures.push("platform-outreach-tracker.json missing GameDistribution public email.");
  if (!tracker.channels?.some((item) => item.platform === "GameDistribution" && String(item.evidence || "").includes("reCAPTCHA"))) failures.push("platform-outreach-tracker.json missing GameDistribution reCAPTCHA note.");
  if (!tracker.channels?.some((item) => item.platform === "GamePix" && item.status === "blocked_non_ai_description_required")) failures.push("platform-outreach-tracker.json missing GamePix non-AI description status.");
  if (!tracker.channels?.every((item) => item.subject && item.body && item.submissionUrl)) failures.push("platform-outreach-tracker.json missing copy-ready outreach fields.");
  if (!String(data.completionGate || "").includes("verified revenue")) failures.push("platform-outreach-tracker.json missing revenue completion gate.");
}

const zeroCostMapFile = path.join(root, "zero-cost-monetization-map", "index.html");
if (!fs.existsSync(zeroCostMapFile)) failures.push("Missing zero-cost monetization map page.");
else {
  const html = fs.readFileSync(zeroCostMapFile, "utf8");
  if (!html.includes("Zero-cost monetization map")) failures.push("Zero-cost map missing heading.");
  if (!html.includes("Hosted HTML5 game platforms")) failures.push("Zero-cost map missing hosted HTML5 route.");
  if (!html.includes("Douyin mini-game port")) failures.push("Zero-cost map missing Douyin route.");
  if (!html.includes("Bilibili mini-game port")) failures.push("Zero-cost map missing Bilibili route.");
  if (!html.includes("Free subdomain utility site")) failures.push("Zero-cost map missing free subdomain route.");
  if (!html.includes("Ad safety gates")) failures.push("Zero-cost map missing ad safety gates.");
  if (!html.includes("Cloudflare Pages")) failures.push("Zero-cost map missing free host options.");
  if (!html.includes("Money gate")) failures.push("Zero-cost map missing money gate.");
  if (!html.includes("/zero-cost-monetization-map.json")) failures.push("Zero-cost map missing machine-readable JSON link.");
  if (!sitemap.includes(`<loc>${siteUrl("zero-cost-monetization-map")}</loc>`)) failures.push("Sitemap missing zero-cost monetization map.");
}

const zeroCostMapJsonFile = path.join(root, "zero-cost-monetization-map.json");
if (!fs.existsSync(zeroCostMapJsonFile)) failures.push("Missing zero-cost-monetization-map.json.");
else {
  const data = JSON.parse(fs.readFileSync(zeroCostMapJsonFile, "utf8"));
  const map = data.map || {};
  if (!String(map.conclusion || "").includes("hosted HTML5 game platforms")) failures.push("zero-cost-monetization-map.json missing hosted-platform conclusion.");
  if (!Array.isArray(map.routes) || map.routes.length < 5) failures.push("zero-cost-monetization-map.json missing ranked routes.");
  if (!map.routes?.some((item) => item.route === "Douyin mini-game port")) failures.push("zero-cost-monetization-map.json missing Douyin route.");
  if (!map.routes?.some((item) => item.route === "Bilibili mini-game port")) failures.push("zero-cost-monetization-map.json missing Bilibili route.");
  if (!map.routes?.some((item) => item.route === "Hosted HTML5 game platforms" && item.status === "active_mainline")) failures.push("zero-cost-monetization-map.json missing active hosted game mainline.");
  if (!Array.isArray(map.freeDomainOptions) || !map.freeDomainOptions.some((item) => item.provider === "Cloudflare Pages")) failures.push("zero-cost-monetization-map.json missing free host options.");
  if (!Array.isArray(map.adGateRules) || !map.adGateRules.some((item) => String(item).includes("rewarded ads"))) failures.push("zero-cost-monetization-map.json missing rewarded ad gate rules.");
  if (!String(data.completionGate || "").includes("revenue")) failures.push("zero-cost-monetization-map.json missing revenue completion gate.");
}

const distributionFile = path.join(root, "DISTRIBUTION.md");
if (!fs.existsSync(distributionFile)) failures.push("Missing DISTRIBUTION.md.");
else {
  const distribution = fs.readFileSync(distributionFile, "utf8");
  if (!distribution.includes("Directory submission fields")) failures.push("DISTRIBUTION.md missing directory fields.");
  if (!distribution.includes("Machine-readable share kit")) failures.push("DISTRIBUTION.md missing share kit link.");
}

const discoveryFile = path.join(root, "discovery.json");
if (!fs.existsSync(discoveryFile)) failures.push("Missing discovery.json.");
else {
  const discovery = JSON.parse(fs.readFileSync(discoveryFile, "utf8"));
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/multi-image-pdf"))) failures.push("discovery.json missing high-intent multi-image route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/compress-pdf"))) failures.push("discovery.json missing high-intent compress PDF route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/ats-resume-checker"))) failures.push("discovery.json missing high-intent ATS resume checker route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/pdf-to-images"))) failures.push("discovery.json missing high-intent PDF-to-images route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/pdf-to-text"))) failures.push("discovery.json missing high-intent PDF-to-text route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/pdf-to-word"))) failures.push("discovery.json missing high-intent PDF-to-Word route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/compress-image"))) failures.push("discovery.json missing high-intent image compression route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/remove-background"))) failures.push("discovery.json missing high-intent background remover route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/add-text-image"))) failures.push("discovery.json missing high-intent add text to image route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/crop-image"))) failures.push("discovery.json missing high-intent image crop route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/qr-code"))) failures.push("discovery.json missing high-intent QR route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/compress-image-to-kb"))) failures.push("discovery.json missing high-intent image-to-KB route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/signature-png"))) failures.push("discovery.json missing high-intent signature PNG route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/passport-photo"))) failures.push("discovery.json missing high-intent passport photo route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/markdown-to-pdf"))) failures.push("discovery.json missing high-intent markdown-to-PDF route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/csv-to-pdf"))) failures.push("discovery.json missing high-intent CSV-to-PDF route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("tools/json-to-pdf"))) failures.push("discovery.json missing high-intent JSON-to-PDF route.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("submit-directory"))) failures.push("discovery.json missing directory submission pack.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("share-kit"))) failures.push("discovery.json missing share kit page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("platform-submit-queue"))) failures.push("discovery.json missing platform submit queue page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("platform-submit-cockpit"))) failures.push("discovery.json missing platform submit cockpit page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("platform-outreach-tracker"))) failures.push("discovery.json missing platform outreach tracker page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("zero-cost-monetization-map"))) failures.push("discovery.json missing zero-cost monetization map page.");
  if (discovery.shareKit !== siteUrl("share-kit.json").replace(/\/$/, "")) failures.push("discovery.json missing share-kit.json URL.");
  if (discovery.platformSubmitQueue !== siteUrl("platform-submit-queue.json").replace(/\/$/, "")) failures.push("discovery.json missing platform-submit-queue.json URL.");
  if (discovery.platformSubmitCockpit !== siteUrl("platform-submit-cockpit.json").replace(/\/$/, "")) failures.push("discovery.json missing platform-submit-cockpit.json URL.");
  if (discovery.platformOutreachTracker !== siteUrl("platform-outreach-tracker.json").replace(/\/$/, "")) failures.push("discovery.json missing platform-outreach-tracker.json URL.");
  if (discovery.zeroCostMonetizationMap !== siteUrl("zero-cost-monetization-map.json").replace(/\/$/, "")) failures.push("discovery.json missing zero-cost-monetization-map.json URL.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.campaignVideos) || discovery.distributionAssets.campaignVideos.length < 6) failures.push("discovery.json missing campaign video assets.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.publicGist || "").includes("gist.github.com/yanqr213")) failures.push("discovery.json missing public Gist URL.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.publicGrowthIssue || "").includes("github.com/yanqr213/printable-tools-lab/issues/1")) failures.push("discovery.json missing public GitHub issue URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.platformSubmitQueue !== siteUrl("platform-submit-queue")) failures.push("discovery.json missing platform submit queue URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.platformSubmitCockpit !== siteUrl("platform-submit-cockpit")) failures.push("discovery.json missing platform submit cockpit URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.platformOutreachTracker !== siteUrl("platform-outreach-tracker")) failures.push("discovery.json missing platform outreach tracker URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.zeroCostMonetizationMap !== siteUrl("zero-cost-monetization-map")) failures.push("discovery.json missing zero-cost monetization map URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.zeroDomainGame !== "https://upload-limit-panic.pages.dev/") failures.push("discovery.json missing zero-domain game URL.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.zeroDomainGames) || discovery.distributionAssets.zeroDomainGames.length < 2) failures.push("discovery.json missing zero-domain game list.");
  if (!discovery.distributionAssets || !discovery.distributionAssets.zeroDomainGames?.every((item) => String(item.cleanZipUrl || "").includes("portal-clean.zip"))) failures.push("discovery.json missing clean portal ZIP URLs.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.zeroDomainGames) || !discovery.distributionAssets.zeroDomainGames.some((item) => item.url === "https://neon-lane-dash.pages.dev/")) failures.push("discovery.json missing Neon Lane Dash URL.");
  if (discovery.feed !== siteUrl("feed.xml").replace(/\/$/, "")) failures.push("discovery.json missing RSS feed URL.");
  if (!Array.isArray(discovery.landingPages) || discovery.landingPages.length < 61) failures.push("discovery.json missing high-intent landing pages.");
  if (discovery.manifest !== siteUrl("site.webmanifest").replace(/\/$/, "")) failures.push("discovery.json missing manifest URL.");
  if (discovery.opensearch !== siteUrl("opensearch.xml").replace(/\/$/, "")) failures.push("discovery.json missing OpenSearch URL.");
}

for (const page of landingPages) {
  const file = path.join(root, page.path, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing landing page: ${page.path}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(page.headline)) failures.push(`Landing page missing headline: ${page.path}`);
  if (!html.includes(`/${cleanToolPath(page.primaryTool)}/`)) failures.push(`Landing page missing primary tool link: ${page.path}`);
  if (!html.includes('"@type":"CollectionPage"')) failures.push(`Landing page missing CollectionPage schema: ${page.path}`);
  if (!sitemap.includes(`<loc>${siteUrl(page.path)}</loc>`)) failures.push(`Sitemap missing landing page: ${page.path}`);
}

const docsIndexFile = path.join(root, "docs", "index.html");
if (!fs.existsSync(docsIndexFile)) failures.push("Missing GitHub Pages discovery index.");
else {
  const html = fs.readFileSync(docsIndexFile, "utf8");
  if (!html.includes("Free PDF, image, and QR tools without signup")) failures.push("GitHub Pages discovery page missing heading.");
  if (!html.includes(siteUrl("free-pdf-tools"))) failures.push("GitHub Pages discovery page missing main directory link.");
  if (!html.includes(siteUrl("free-invoice-generator-no-signup"))) failures.push("GitHub Pages discovery page missing no-signup invoice landing link.");
  if (!html.includes(siteUrl("tools/image-to-pdf"))) failures.push("GitHub Pages discovery page missing image-to-PDF link.");
  if (!html.includes("https://yanqr213.github.io/printable-tools-lab/tools/image-to-pdf/")) failures.push("GitHub Pages discovery page missing tool mirror link.");
  if (!html.includes("rel=\"canonical\" href=\"https://yanqr213.github.io/printable-tools-lab/\"")) failures.push("GitHub Pages discovery page missing canonical.");
}

const docsToolsFile = path.join(root, "docs", "tools.json");
if (!fs.existsSync(docsToolsFile)) failures.push("Missing GitHub Pages discovery tools.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsToolsFile, "utf8"));
  if (!Array.isArray(data.tools) || data.tools.length < 8) failures.push("GitHub Pages discovery tools.json missing high-intent tools.");
  if (!Array.isArray(data.landingPages) || data.landingPages.length < 50) failures.push("GitHub Pages discovery tools.json missing high-intent landing pages.");
  if (data.feed !== siteUrl("feed.xml").replace(/\/$/, "")) failures.push("GitHub Pages discovery tools.json missing feed URL.");
  if (!data.githubPagesDirectory || data.githubPagesDirectory !== "https://yanqr213.github.io/printable-tools-lab/") failures.push("GitHub Pages discovery tools.json missing GitHub directory URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/image-to-pdf") && tool.discoveryUrl === "https://yanqr213.github.io/printable-tools-lab/tools/image-to-pdf/")) failures.push("GitHub Pages discovery tools.json missing tool discovery URL.");
}

const docsSitemapFile = path.join(root, "docs", "sitemap.xml");
if (!fs.existsSync(docsSitemapFile)) failures.push("Missing GitHub Pages discovery sitemap.");
else {
  const docsSitemap = fs.readFileSync(docsSitemapFile, "utf8");
  if (countMatches(docsSitemap, /<loc>/g) < landingPages.length + HIGH_INTENT_TOOL_PATHS.length + 1) failures.push("GitHub Pages discovery sitemap missing landing/tool pages.");
  for (const page of landingPages) {
    const githubUrl = `https://yanqr213.github.io/printable-tools-lab/${page.path}/`;
    if (!docsSitemap.includes(`<loc>${githubUrl}</loc>`)) failures.push(`GitHub Pages sitemap missing landing page: ${page.path}`);
  }
  for (const toolPath of HIGH_INTENT_TOOL_PATHS) {
    const githubUrl = `https://yanqr213.github.io/printable-tools-lab/${toolPath}/`;
    if (!docsSitemap.includes(`<loc>${githubUrl}</loc>`)) failures.push(`GitHub Pages sitemap missing tool discovery page: ${toolPath}`);
  }
}

for (const page of landingPages) {
  const file = path.join(root, "docs", page.path, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing GitHub Pages landing discovery page: ${page.path}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(page.headline)) failures.push(`GitHub Pages landing page missing headline: ${page.path}`);
  if (!html.includes(siteUrl(page.path))) failures.push(`GitHub Pages landing page missing live landing URL: ${page.path}`);
  if (!html.includes(liveToolUrl(page.primaryTool))) failures.push(`GitHub Pages landing page missing primary tool URL: ${page.path}`);
}

for (const toolPath of HIGH_INTENT_TOOL_PATHS) {
  const tool = tools.find((item) => item.path === toolPath);
  const file = path.join(root, "docs", ...toolPath.split("/"), "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing GitHub Pages tool discovery page: ${toolPath}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!tool || !html.includes(tool.title)) failures.push(`GitHub Pages tool page missing title: ${toolPath}`);
  if (!html.includes(siteUrl(toolPath))) failures.push(`GitHub Pages tool page missing live tool URL: ${toolPath}`);
  if (!html.includes(`rel="canonical" href="https://yanqr213.github.io/printable-tools-lab/${toolPath}/"`)) failures.push(`GitHub Pages tool page missing canonical: ${toolPath}`);
}

const verificationFile = path.join(root, "google1b771d6159b52de7.html");
if (!fs.existsSync(verificationFile)) failures.push("Missing Google HTML verification file.");
else {
  const content = fs.readFileSync(verificationFile, "utf8").trim();
  if (content !== "google-site-verification: google1b771d6159b52de7.html") failures.push("Unexpected Google verification file content.");
}

const extensionlessVerificationFile = path.join(root, "google1b771d6159b52de7");
if (!fs.existsSync(extensionlessVerificationFile)) failures.push("Missing extensionless Google verification fallback file.");
else {
  const content = fs.readFileSync(extensionlessVerificationFile, "utf8").trim();
  if (content !== "google-site-verification: google1b771d6159b52de7.html") failures.push("Unexpected extensionless Google verification file content.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`SEO verification passed for ${routes.filter((route) => route.index !== false).length} indexable routes.`);

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function countMatches(value, pattern) {
  const match = String(value).match(pattern);
  return match ? match.length : 0;
}

function cleanToolPath(toolPath) {
  return String(toolPath).split("?")[0];
}

function liveToolUrl(toolPath) {
  const [pathname, query] = String(toolPath).split("?");
  return `${siteUrl(pathname)}${query ? `?${query}` : ""}`;
}
