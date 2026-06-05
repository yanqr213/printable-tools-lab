const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { routes, siteUrl, landingPages, LOCAL_SELLER_STARTER_KIT, CUSTOM_LOCAL_PRINT_PACK_SERVICE, MARKET_TABLE_PRINT_AUDIT, SERVICE_SALES_PACK, HIGH_INTENT_TOOL_PATHS, tools } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const failures = [];
const GITHUB_PAGES_EVENT_ENDPOINT = "https://printable-tools-lab.pages.dev/api/event";

function requireGithubPagesIntentTracking(html, label, events = []) {
  if (!html.includes(GITHUB_PAGES_EVENT_ENDPOINT)) failures.push(`${label} missing GitHub Pages event endpoint.`);
  if (!html.includes('source: "github-pages"')) failures.push(`${label} missing github-pages source tracking.`);
  if (!html.includes('sendEvent("page_view", "site")')) failures.push(`${label} missing GitHub Pages page_view tracking.`);
  for (const event of events) {
    if (!html.includes(`data-track-event="${event}"`)) failures.push(`${label} missing ${event} tracking hook.`);
  }
}

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

const docsSellerIndexFile = path.join(root, "docs", "index.html");
if (!fs.existsSync(docsSellerIndexFile)) failures.push("Missing GitHub Pages discovery index.");
else {
  const html = fs.readFileSync(docsSellerIndexFile, "utf8");
  if (!html.includes("Local seller print help")) failures.push("GitHub Pages directory missing seller-intent CTA.");
  if (!html.includes(MARKET_TABLE_PRINT_AUDIT.slug)) failures.push("GitHub Pages directory missing audit mirror CTA.");
  if (!html.includes(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)) failures.push("GitHub Pages directory missing custom print pack CTA.");
  if (!html.includes(`Copy the $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup request`)) failures.push("GitHub Pages directory missing low-friction paid service copy CTA.");
  if (!html.includes("No payment is collected on this mirror")) failures.push("GitHub Pages directory missing no-payment warning.");
  requireGithubPagesIntentTracking(html, "GitHub Pages directory", ["audit_request_intent", "service_request_intent"]);
}

const docsLandingMirrorFile = path.join(root, "docs", "free-invoice-generator-no-signup", "index.html");
if (!fs.existsSync(docsLandingMirrorFile)) failures.push("Missing GitHub Pages invoice landing mirror.");
else {
  const html = fs.readFileSync(docsLandingMirrorFile, "utf8");
  if (!html.includes("Local seller print help")) failures.push("GitHub Pages landing mirror missing seller-intent CTA.");
  if (!html.includes(MARKET_TABLE_PRINT_AUDIT.slug)) failures.push("GitHub Pages landing mirror missing audit mirror CTA.");
  if (!html.includes(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)) failures.push("GitHub Pages landing mirror missing custom print pack CTA.");
  if (!html.includes(`Copy the $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup request`)) failures.push("GitHub Pages landing mirror missing low-friction paid service copy CTA.");
  requireGithubPagesIntentTracking(html, "GitHub Pages landing mirror", ["audit_request_intent", "service_request_intent"]);
}

const docsToolMirrorFile = path.join(root, "docs", "tools", "invoice-generator", "index.html");
if (!fs.existsSync(docsToolMirrorFile)) failures.push("Missing GitHub Pages invoice tool mirror.");
else {
  const html = fs.readFileSync(docsToolMirrorFile, "utf8");
  if (!html.includes("Local seller print help")) failures.push("GitHub Pages tool mirror missing seller-intent CTA.");
  if (!html.includes(MARKET_TABLE_PRINT_AUDIT.slug)) failures.push("GitHub Pages tool mirror missing audit mirror CTA.");
  if (!html.includes(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)) failures.push("GitHub Pages tool mirror missing custom print pack CTA.");
  if (!html.includes(`Copy the $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup request`)) failures.push("GitHub Pages tool mirror missing low-friction paid service copy CTA.");
  requireGithubPagesIntentTracking(html, "GitHub Pages tool mirror", ["audit_request_intent", "service_request_intent"]);
}

for (const toolPath of ["tools/invoice-generator", "tools/price-tag", "tools/flyer-maker", "tools/coupon-maker", "tools/packing-slip", "tools/business-card", "tools/qr-code"]) {
  const file = path.join(root, ...toolPath.split("/"), "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing local seller funnel tool page: ${toolPath}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes("seller-funnel-cta")) failures.push(`Missing local seller funnel CTA: ${toolPath}`);
  if (!html.includes("market_table_audit")) failures.push(`Missing audit campaign tracking on funnel CTA: ${toolPath}`);
  if (!html.includes("service_sales_pack")) failures.push(`Missing service campaign tracking on funnel CTA: ${toolPath}`);
  if (!html.includes("data-track-event=\"audit_request_intent\"")) failures.push(`Missing audit intent event on funnel CTA: ${toolPath}`);
  if (!html.includes("data-track-event=\"service_request_intent\"")) failures.push(`Missing service intent event on funnel CTA: ${toolPath}`);
  if (!html.includes("No payment is collected here")) failures.push(`Missing no-payment warning on funnel CTA: ${toolPath}`);
}

const appScriptFile = path.join(root, "app.js");
if (!fs.existsSync(appScriptFile)) failures.push("Missing app.js.");
else {
  const script = fs.readFileSync(appScriptFile, "utf8");
  if (!script.includes("download-after-action")) failures.push("Missing download success after-action funnel.");
  if (!script.includes("utm_source=download_success")) failures.push("Missing download success campaign tracking.");
  if (!script.includes('data-track-event="audit_request_intent"')) failures.push("Missing download success audit intent tracking.");
  if (!script.includes("free_tool_depth")) failures.push("Missing download success free-tool depth campaign.");
  if (!script.includes("Browse more free tools")) failures.push("Missing download success free-tool browse CTA.");
  if (!script.includes("Future ads must stay separated from generator controls")) failures.push("Missing download success ad-safety warning.");
  if (script.includes("Open $29 setup request")) failures.push("Download success CTA should not promote paid setup.");
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
  if (!llms.includes(siteUrl(LOCAL_SELLER_STARTER_KIT.slug))) failures.push("llms.txt missing digital product URL.");
  if (!llms.includes(siteUrl("digital-products.json").replace(/\/$/, ""))) failures.push("llms.txt missing digital products JSON URL.");
  if (!llms.includes(siteUrl(MARKET_TABLE_PRINT_AUDIT.slug))) failures.push("llms.txt missing free market table print audit URL.");
  if (!llms.includes(siteUrl("platform-submit-queue"))) failures.push("llms.txt missing platform submit queue URL.");
  if (!llms.includes(siteUrl("platform-submit-queue.json").replace(/\/$/, ""))) failures.push("llms.txt missing platform submit queue JSON URL.");
  if (!llms.includes(siteUrl("platform-submit-cockpit"))) failures.push("llms.txt missing platform submit cockpit URL.");
  if (!llms.includes(siteUrl("platform-submit-cockpit.json").replace(/\/$/, ""))) failures.push("llms.txt missing platform submit cockpit JSON URL.");
  if (!llms.includes(siteUrl("platform-outreach-tracker"))) failures.push("llms.txt missing platform outreach tracker URL.");
  if (!llms.includes(siteUrl("platform-outreach-tracker.json").replace(/\/$/, ""))) failures.push("llms.txt missing platform outreach tracker JSON URL.");
  if (!llms.includes(siteUrl("portal-submission-pack"))) failures.push("llms.txt missing portal submission pack URL.");
  if (!llms.includes(siteUrl("portal-submission-pack.json").replace(/\/$/, ""))) failures.push("llms.txt missing portal submission pack JSON URL.");
  if (!llms.includes(siteUrl("game-submission-feed.json").replace(/\/$/, ""))) failures.push("llms.txt missing game submission feed JSON URL.");
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
  if (!feed.includes(siteUrl("upload-limit-fixer"))) failures.push("feed.xml missing upload limit fixer URL.");
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
  if (!Array.isArray(manifest.shortcuts) || !manifest.shortcuts.some((item) => item.url === "/upload-limit-fixer/")) failures.push("site.webmanifest missing upload limit fixer shortcut.");
}

const siteConfigFile = path.join(root, "site-config.js");
if (!fs.existsSync(siteConfigFile)) failures.push("Missing site-config.js.");
else {
  const siteConfig = fs.readFileSync(siteConfigFile, "utf8");
  if (!siteConfig.includes("sellerKitCheckoutUrl")) failures.push("site-config.js missing sellerKitCheckoutUrl.");
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

for (const pagePath of ["compress-image-to-20kb", "compress-image-to-50kb", "compress-image-to-100kb", "compress-image-to-200kb", "compress-image-to-500kb"]) {
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
  if (!html.includes("Paid service sales pack")) failures.push("Share kit missing paid service sales pack section.");
  if (!html.includes("/service-sales-pack.json")) failures.push("Share kit missing service sales pack JSON link.");
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
  if (!Array.isArray(data.zeroDomainGameExperiments) || !data.zeroDomainGameExperiments.some((item) => String(item.gameSnacksZipUrl || "").includes("neon-lane-dash-gamesnacks.zip"))) failures.push("share-kit.json missing Neon Lane Dash GameSnacks ZIP URL.");
  if (!Array.isArray(data.rules) || data.rules.length < 5) failures.push("share-kit.json missing distribution rules.");
  if (!data.featuredLinks.some((item) => item.url && item.url.includes("utm_source=share-kit"))) failures.push("share-kit.json missing tracked share-kit URLs.");
  if (!data.serviceSalesPack || data.serviceSalesPack.id !== SERVICE_SALES_PACK.id) failures.push("share-kit.json missing service sales pack.");
  if (!data.serviceSalesPack?.trackedLinks?.some((item) => String(item.url || "").includes("service_sales_pack"))) failures.push("share-kit.json missing service sales pack tracked URLs.");
  if (!data.marketTablePrintAudit || data.marketTablePrintAudit.id !== MARKET_TABLE_PRINT_AUDIT.id) failures.push("share-kit.json missing market table print audit lead magnet.");
  if (!String(data.marketTablePrintAudit?.moneyGate || "").includes("not revenue")) failures.push("share-kit.json audit lead magnet missing no-revenue gate.");
}

const platformSubmitQueueFile = path.join(root, "platform-submit-queue", "index.html");
if (!fs.existsSync(platformSubmitQueueFile)) failures.push("Missing platform submit queue page.");
else {
  const html = fs.readFileSync(platformSubmitQueueFile, "utf8");
  if (!html.includes("HTML5 platform submit queue")) failures.push("Platform submit queue missing heading.");
  if (!html.includes("CrazyGames")) failures.push("Platform submit queue missing CrazyGames.");
  if (!html.includes("Yandex Games")) failures.push("Platform submit queue missing Yandex Games.");
  for (const platform of ["Playgama", "GamePix", "Lagged", "GameFlare", "Kongregate", "Newgrounds", "GameDistribution", "Poki", "GameSnacks", "InstGame", "GameTwiz", "BizziBeeArcade", "BlurryGames", "GameMonetize", "PLRun"]) {
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
  if (!Array.isArray(data.queue) || data.queue.length < 18) failures.push("platform-submit-queue.json missing expanded platform queue.");
  if (!data.queue.some((item) => item.platform === "Yandex Games" && String(item.submissionUrl).includes("games.yandex.com/console"))) failures.push("platform-submit-queue.json missing corrected Yandex Console URL.");
  for (const platform of ["Playgama", "GamePix", "Lagged", "GameFlare", "Kongregate", "Newgrounds", "GameDistribution", "Poki", "GameSnacks", "InstGame", "GameTwiz", "BizziBeeArcade", "BlurryGames", "GameMonetize", "PLRun"]) {
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

const portalSubmissionPackFile = path.join(root, "portal-submission-pack", "index.html");
if (!fs.existsSync(portalSubmissionPackFile)) failures.push("Missing portal submission pack page.");
else {
  const html = fs.readFileSync(portalSubmissionPackFile, "utf8");
  if (!html.includes("HTML5 game portal submission pack")) failures.push("Portal submission pack missing heading.");
  if (!html.includes("Candidate portal research")) failures.push("Portal submission pack missing candidate research.");
  if (!html.includes("Manual gates and money gate")) failures.push("Portal submission pack missing manual gates.");
  for (const platform of ["GameSnacks", "InstGame", "GameTwiz", "BizziBeeArcade", "BlurryGames", "GameMonetize", "PLRun"]) {
    if (!html.includes(platform)) failures.push(`Portal submission pack missing ${platform}.`);
  }
  if (!html.includes("portal-clean.zip")) failures.push("Portal submission pack missing clean portal ZIP links.");
  if (!html.includes("review-readiness")) failures.push("Portal submission pack missing review-readiness links.");
  if (!html.includes("/portal-submission-pack.json")) failures.push("Portal submission pack missing machine-readable JSON link.");
  if (!sitemap.includes(`<loc>${siteUrl("portal-submission-pack")}</loc>`)) failures.push("Sitemap missing portal submission pack.");
}

const portalSubmissionPackJsonFile = path.join(root, "portal-submission-pack.json");
if (!fs.existsSync(portalSubmissionPackJsonFile)) failures.push("Missing portal-submission-pack.json.");
else {
  const data = JSON.parse(fs.readFileSync(portalSubmissionPackJsonFile, "utf8"));
  const pack = data.pack || {};
  if (!Array.isArray(pack.lowFrictionResearch) || pack.lowFrictionResearch.length < 7) failures.push("portal-submission-pack.json missing researched candidates.");
  for (const platform of ["GameSnacks", "InstGame", "GameTwiz", "BizziBeeArcade", "BlurryGames", "GameMonetize", "PLRun"]) {
    if (!pack.lowFrictionResearch?.some((item) => item.platform === platform)) failures.push(`portal-submission-pack.json missing ${platform}.`);
  }
  if (!Array.isArray(data.games) || data.games.length < 2) failures.push("portal-submission-pack.json missing playable games.");
  if (!data.games.every((item) => String(item.cleanZipUrl || "").includes("portal-clean.zip"))) failures.push("portal-submission-pack.json missing clean ZIP assets.");
  if (!data.games.some((item) => String(item.gameSnacksZipUrl || "").includes("neon-lane-dash-gamesnacks.zip"))) failures.push("portal-submission-pack.json missing Neon GameSnacks ZIP asset.");
  if (!data.games.some((item) => String(item.gameSnacksVerificationUrl || "").includes("gamesnacks-verification.json"))) failures.push("portal-submission-pack.json missing GameSnacks verification asset.");
  if (!Array.isArray(pack.candidatePolicy) || !pack.candidatePolicy.some((item) => String(item).includes("bank"))) failures.push("portal-submission-pack.json missing private-data safety policy.");
  if (!String(data.completionGate || "").includes("visible revenue")) failures.push("portal-submission-pack.json missing visible revenue completion gate.");
}

const gameSubmissionFeedFile = path.join(root, "game-submission-feed.json");
if (!fs.existsSync(gameSubmissionFeedFile)) failures.push("Missing game-submission-feed.json.");
else {
  const data = JSON.parse(fs.readFileSync(gameSubmissionFeedFile, "utf8"));
  if (!Array.isArray(data.games) || data.games.length < 2) failures.push("game-submission-feed.json missing public game list.");
  if (!data.games.some((game) => game.name === "Neon Lane Dash" && String(game.gameSnacksZipUrl || "").includes("neon-lane-dash-gamesnacks.zip"))) failures.push("game-submission-feed.json missing Neon GameSnacks ZIP.");
  if (!data.games.every((game) => String(game.cleanPortalZipUrl || "").includes("portal-clean.zip"))) failures.push("game-submission-feed.json missing clean portal ZIPs.");
  if (!String(data.moneyGate || "").includes("visible revenue")) failures.push("game-submission-feed.json missing visible revenue money gate.");
  if (!Array.isArray(data.safetyRules) || !data.safetyRules.some((rule) => String(rule).includes("bank"))) failures.push("game-submission-feed.json missing private-data safety rule.");
}

const digitalProductFile = path.join(root, LOCAL_SELLER_STARTER_KIT.slug, "index.html");
if (!fs.existsSync(digitalProductFile)) failures.push("Missing Local Seller Starter Kit product page.");
else {
  const html = fs.readFileSync(digitalProductFile, "utf8");
  if (!html.includes("Local Seller Starter Kit")) failures.push("Digital product page missing product name.");
  if (!html.includes("Download sample ZIP")) failures.push("Digital product page missing sample ZIP CTA.");
  if (!html.includes("Request checkout link")) failures.push("Digital product page missing buyer checkout request CTA.");
  if (!html.includes("Checkout link pending")) failures.push("Digital product page missing honest checkout-pending state.");
  if (!html.includes("github.com/yanqr213/printable-tools-lab/issues/new")) failures.push("Digital product page missing checkout request URL.");
  if (!html.includes("local-seller-starter-kit-buy-request.txt")) failures.push("Digital product page missing buyer request template URL.");
  if (!html.includes("seller_checkout_intent")) failures.push("Digital product page missing seller intent tracking.");
  if (!html.includes('"@type":"Product"')) failures.push("Digital product page missing Product schema.");
  if (!html.includes("paid-deliverables/local-seller-starter-kit.zip")) failures.push("Digital product page missing private package setup note.");
  if (!sitemap.includes(`<loc>${siteUrl(LOCAL_SELLER_STARTER_KIT.slug)}</loc>`)) failures.push("Sitemap missing digital product page.");
}

const digitalProductsJsonFile = path.join(root, "digital-products.json");
if (!fs.existsSync(digitalProductsJsonFile)) failures.push("Missing digital-products.json.");
else {
  const data = JSON.parse(fs.readFileSync(digitalProductsJsonFile, "utf8"));
  if (!Array.isArray(data.products) || data.products.length < 1) failures.push("digital-products.json missing product list.");
  const sellerKit = data.products.find((item) => item.id === LOCAL_SELLER_STARTER_KIT.id);
  if (!sellerKit) failures.push("digital-products.json missing Local Seller Starter Kit.");
  if (sellerKit && sellerKit.priceUsd !== 9) failures.push("digital-products.json has unexpected seller kit price.");
  if (sellerKit && !String(sellerKit.sampleUrl || "").includes("local-seller-starter-kit-sample.zip")) failures.push("digital-products.json missing sample ZIP URL.");
  if (sellerKit && !String(sellerKit.requestTemplateUrl || "").includes("local-seller-starter-kit-buy-request.txt")) failures.push("digital-products.json missing buyer request template URL.");
  if (sellerKit && !String(sellerKit.checkoutRequestUrl || "").includes("github.com/yanqr213/printable-tools-lab/issues/new")) failures.push("digital-products.json missing checkout request URL.");
  if (sellerKit && !sellerKit.privatePackageReady) failures.push("digital-products.json missing private package readiness.");
  if (!String(data.moneyGate || "").includes("paid order")) failures.push("digital-products.json missing paid-order money gate.");
}

const sellerKitPackageReportFile = path.join(root, LOCAL_SELLER_STARTER_KIT.packageReportPath);
if (!fs.existsSync(sellerKitPackageReportFile)) failures.push("Missing Local Seller Starter Kit package report.");
else {
  const report = JSON.parse(fs.readFileSync(sellerKitPackageReportFile, "utf8"));
  if (!report.publicSample || report.publicSample.fileCount < 4) failures.push("Seller kit package report missing public sample file count.");
  if (!report.publicRequestTemplate || !String(report.publicRequestTemplate.path || "").includes("local-seller-starter-kit-buy-request.txt")) failures.push("Seller kit package report missing public request template.");
  if (!report.privatePackage || report.privatePackage.fileCount < 10) failures.push("Seller kit package report missing full private package file count.");
  if (!String(report.privatePackage?.sha256 || "").match(/^[0-9a-f]{64}$/)) failures.push("Seller kit private package missing sha256.");
}

const sellerKitSampleFile = path.join(root, LOCAL_SELLER_STARTER_KIT.publicSamplePath);
if (!fs.existsSync(sellerKitSampleFile)) failures.push("Missing public seller kit sample ZIP.");
else if (fs.statSync(sellerKitSampleFile).size < 500) failures.push("Public seller kit sample ZIP is too small.");

const sellerKitRequestFile = path.join(root, LOCAL_SELLER_STARTER_KIT.publicRequestPath);
if (!fs.existsSync(sellerKitRequestFile)) failures.push("Missing public seller kit buyer request template.");
else {
  const text = fs.readFileSync(sellerKitRequestFile, "utf8");
  if (!text.includes("I want to buy the Local Seller Starter Kit")) failures.push("Seller kit buyer request template missing request copy.");
}

const paidServiceFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug, "index.html");
if (!fs.existsSync(paidServiceFile)) failures.push("Missing Custom Local Print Pack service page.");
else {
  const html = fs.readFileSync(paidServiceFile, "utf8");
  if (!html.includes("Custom Local Print Pack Setup")) failures.push("Service page missing service name.");
  if (!html.includes("Request service checkout")) failures.push("Service page missing service request CTA.");
  if (!html.includes("Open structured request form")) failures.push("Service page missing structured issue form CTA.");
  if (!html.includes("Build a service request")) failures.push("Service page missing service request builder.");
  if (!html.includes("Copy generated service request")) failures.push("Service page missing low-friction generated request CTA.");
  if (!html.includes("Open generated GitHub request")) failures.push("Service page missing generated GitHub request CTA.");
  if (!html.includes("data-service-request-builder")) failures.push("Service page missing service request builder hook.");
  if (!html.includes("data-service-request-open")) failures.push("Service page missing generated request open hook.");
  if (!html.includes("data-service-request-copy")) failures.push("Service page missing service request copy hook.");
  if (!html.includes("data-service-request-output")) failures.push("Service page missing service request copy output.");
  if (!html.includes("Up to 12 items or services with prices")) failures.push("Service page missing buyer item intake field.");
  if (!html.includes("Preferred checkout provider")) failures.push("Service page missing checkout preference field.");
  if (!html.includes("Download service brief")) failures.push("Service page missing service brief CTA.");
  if (!html.includes("custom-local-print-pack-request.txt")) failures.push("Service page missing public request brief URL.");
  if (!html.includes("custom-local-print-pack-payment-reply.txt")) failures.push("Service page missing payment reply asset URL.");
  if (!html.includes("custom-local-print-pack-fulfillment-checklist.txt")) failures.push("Service page missing fulfillment checklist URL.");
  if (!html.includes("custom-local-print-pack-order-pipeline.json")) failures.push("Service page missing order pipeline URL.");
  if (!html.includes("custom-local-print-pack-outreach-queue.json")) failures.push("Service page missing outreach queue URL.");
  if (!html.includes("custom-local-print-pack-outreach-batch.txt")) failures.push("Service page missing outreach batch URL.");
  if (!html.includes("custom-local-print-pack-sample-delivery.zip")) failures.push("Service page missing sample delivery ZIP URL.");
  if (!html.includes("custom-local-print-pack-delivery-input.example.json")) failures.push("Service page missing delivery input example URL.");
  if (!html.includes("service:delivery")) failures.push("Service page missing private delivery command.");
  if (!html.includes("paid_order_verified")) failures.push("Service page missing paid order pipeline status.");
  if (!html.includes("service_request_intent")) failures.push("Service page missing service intent tracking.");
  if (!html.includes("Open generated GitHub request")) failures.push("Service page missing generated request fallback.");
  if (!html.includes('"@type":"Service"')) failures.push("Service page missing Service schema.");
  if (!html.includes("Revenue is proven only after a real payment provider")) failures.push("Service page missing real revenue gate.");
  if (!sitemap.includes(`<loc>${siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)}</loc>`)) failures.push("Sitemap missing custom local print pack service page.");
}

const paidServicesJsonFile = path.join(root, "services.json");
if (!fs.existsSync(paidServicesJsonFile)) failures.push("Missing services.json.");
else {
  const data = JSON.parse(fs.readFileSync(paidServicesJsonFile, "utf8"));
  const service = data.services?.find((item) => item.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id);
  if (!service) failures.push("services.json missing Custom Local Print Pack service.");
  if (service && service.priceUsd !== 29) failures.push("services.json has unexpected service price.");
  if (service && !String(service.url || "").startsWith("https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/")) failures.push("services.json service URL should point to the live GitHub Pages request builder.");
  if (service && !String(service.mainSiteFallbackUrl || "").startsWith(siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug))) failures.push("services.json missing Cloudflare fallback URL.");
  if (service && !String(service.githubPagesServiceUrl || "").startsWith("https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/")) failures.push("services.json missing GitHub Pages service URL.");
  if (service && !String(service.requestTemplateUrl || "").includes("custom-local-print-pack-request.txt")) failures.push("services.json missing service request template URL.");
  if (service && !String(service.issueFormUrl || "").includes("custom-local-print-pack-service.yml")) failures.push("services.json missing service issue form URL.");
  if (service && !String(service.paymentReplyTemplateUrl || "").includes("custom-local-print-pack-payment-reply.txt")) failures.push("services.json missing payment reply template URL.");
  if (service && !String(service.fulfillmentChecklistUrl || "").includes("custom-local-print-pack-fulfillment-checklist.txt")) failures.push("services.json missing fulfillment checklist URL.");
  if (service && !String(service.orderPipelineUrl || "").includes("custom-local-print-pack-order-pipeline.json")) failures.push("services.json missing order pipeline URL.");
  if (service && !service.orderPipeline?.some((status) => status.id === "paid_order_verified")) failures.push("services.json missing paid_order_verified pipeline status.");
  if (service && !String(service.outreachQueueUrl || "").includes("custom-local-print-pack-outreach-queue.json")) failures.push("services.json missing outreach queue URL.");
  if (service && !String(service.outreachBatchUrl || "").includes("custom-local-print-pack-outreach-batch.txt")) failures.push("services.json missing outreach batch URL.");
  if (service && !Array.isArray(service.outreachQueue)) failures.push("services.json missing outreach queue entries.");
  if (service && service.outreachQueue?.length < 10) failures.push("services.json outreach queue too small.");
  if (service && !String(service.sampleDeliveryUrl || "").includes("custom-local-print-pack-sample-delivery.zip")) failures.push("services.json missing sample delivery URL.");
  if (service && !String(service.deliveryInputExampleUrl || "").includes("custom-local-print-pack-delivery-input.example.json")) failures.push("services.json missing delivery input example URL.");
  if (service && !String(service.deliveryReportUrl || "").includes("custom-local-print-pack-sample-delivery.json")) failures.push("services.json missing delivery report URL.");
  if (service && !String(service.privateDeliveryCommand || "").includes("service:delivery")) failures.push("services.json missing private delivery command.");
  if (service && !service.outreachQueue?.some((item) => item.status === "reply_only" && String(item.opener || "").includes("payment link before work starts"))) failures.push("services.json missing reply-only payment followup.");
  if (service && !service.outreachQueue?.some((item) => String(item.stopRule || "").includes("Do not send more than one"))) failures.push("services.json missing cold outreach stop rule.");
  if (service && !String(service.requestUrl || "").includes("github.com/yanqr213/printable-tools-lab/issues/new")) failures.push("services.json missing service request URL.");
  const audit = data.leadMagnets?.find((item) => item.id === MARKET_TABLE_PRINT_AUDIT.id);
  if (!audit) failures.push("services.json missing free audit lead magnet.");
  if (audit && !String(audit.requestTemplateUrl || "").includes("market-table-print-audit-request.txt")) failures.push("services.json audit lead magnet missing request template URL.");
  if (audit && !String(audit.checklistUrl || "").includes("market-table-print-audit-checklist.json")) failures.push("services.json audit lead magnet missing checklist URL.");
  if (audit && !audit.statuses?.some((status) => status.id === "audit_request_received" && String(status.moneyRule || "").includes("Not revenue"))) failures.push("services.json audit lead magnet missing no-revenue request status.");
  if (audit && !audit.statuses?.some((status) => status.id === "paid_order_verified" && String(status.moneyRule || "").includes("Revenue only"))) failures.push("services.json audit lead magnet missing paid-order revenue status.");
  if (audit && !String(audit.moneyGate || "").includes("not revenue")) failures.push("services.json audit lead magnet missing money gate.");
  if (!String(data.moneyGate || "").includes("paid order")) failures.push("services.json missing paid-order money gate.");
}

const issueTemplateFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.issueTemplatePath);
if (!fs.existsSync(issueTemplateFile)) failures.push("Missing Custom Local Print Pack GitHub issue form.");
else {
  const text = fs.readFileSync(issueTemplateFile, "utf8");
  if (!text.includes("No payment is collected")) failures.push("Service issue form missing no-payment warning.");
  if (!text.includes("paid order")) failures.push("Service issue form missing paid-order gate.");
  if (!text.includes("Do not post card")) failures.push("Service issue form missing sensitive-data warning.");
  if (!text.includes("business_name")) failures.push("Service issue form missing business name field.");
  if (!text.includes("items_and_prices")) failures.push("Service issue form missing items/prices field.");
  if (!text.includes("checkout_provider")) failures.push("Service issue form missing checkout provider field.");
}

const serviceRequestFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicRequestPath);
if (!fs.existsSync(serviceRequestFile)) failures.push("Missing public service request brief.");
else {
  const text = fs.readFileSync(serviceRequestFile, "utf8");
  if (!text.includes("I want to request the Custom Local Print Pack Setup")) failures.push("Service request brief missing request copy.");
  if (!text.includes("No payment is collected by this request")) failures.push("Service request brief missing money gate.");
}

const servicePaymentReplyFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicPaymentReplyPath);
if (!fs.existsSync(servicePaymentReplyFile)) failures.push("Missing public service payment reply template.");
else {
  const text = fs.readFileSync(servicePaymentReplyFile, "utf8");
  if (!text.includes("payment link before work starts")) failures.push("Service payment reply missing payment-before-work language.");
  if (!text.includes("paid_order_verified")) failures.push("Service payment reply missing paid_order_verified status.");
  if (!text.includes("Do not post card, bank, payout, tax, identity")) failures.push("Service payment reply missing sensitive-data warning.");
}

const serviceFulfillmentChecklistFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicFulfillmentChecklistPath);
if (!fs.existsSync(serviceFulfillmentChecklistFile)) failures.push("Missing public service fulfillment checklist.");
else {
  const text = fs.readFileSync(serviceFulfillmentChecklistFile, "utf8");
  if (!text.includes("Use this only after a real external payment provider shows a paid order")) failures.push("Service fulfillment checklist missing paid-order start gate.");
  if (!text.includes("Deliver text, CSV, or copy blocks")) failures.push("Service fulfillment checklist missing delivery step.");
}

const serviceOrderPipelineFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOrderPipelinePath);
if (!fs.existsSync(serviceOrderPipelineFile)) failures.push("Missing public service order pipeline JSON.");
else {
  const data = JSON.parse(fs.readFileSync(serviceOrderPipelineFile, "utf8"));
  if (data.serviceId !== CUSTOM_LOCAL_PRINT_PACK_SERVICE.id) failures.push("Service order pipeline has unexpected service id.");
  if (!String(data.issueFormUrl || "").includes("custom-local-print-pack-service.yml")) failures.push("Service order pipeline missing issue form URL.");
  if (!data.statuses?.some((status) => status.id === "paid_order_verified" && String(status.moneyRule || "").includes("first status"))) failures.push("Service order pipeline missing paid revenue status gate.");
  if (!data.forbiddenFields?.some((field) => String(field).includes("card"))) failures.push("Service order pipeline missing forbidden sensitive fields.");
}

const serviceOutreachQueueFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOutreachQueuePath);
if (!fs.existsSync(serviceOutreachQueueFile)) failures.push("Missing public service outreach queue JSON.");
else {
  const data = JSON.parse(fs.readFileSync(serviceOutreachQueueFile, "utf8"));
  if (data.serviceId !== CUSTOM_LOCAL_PRINT_PACK_SERVICE.id) failures.push("Service outreach queue has unexpected service id.");
  if (!String(data.dailyCap || "").includes("10 relevant")) failures.push("Service outreach queue missing daily cap.");
  if (!data.forbiddenActions?.some((item) => String(item).includes("scrape private contact lists"))) failures.push("Service outreach queue missing no-scraping rule.");
  if (!Array.isArray(data.batch) || data.batch.length < 10) failures.push("Service outreach queue missing 10-action batch.");
  if (!data.batch?.some((item) => item.id === "warm-reply-followup-01" && item.status === "reply_only")) failures.push("Service outreach queue missing reply-only followup item.");
  if (!data.batch?.every((item) => item.trackedUrl && item.stopRule && item.qualification)) failures.push("Service outreach queue entries missing tracked URL, stop rule, or qualification.");
}

const serviceOutreachBatchFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOutreachBatchPath);
if (!fs.existsSync(serviceOutreachBatchFile)) failures.push("Missing public service outreach batch text.");
else {
  const text = fs.readFileSync(serviceOutreachBatchFile, "utf8");
  if (!text.includes("Daily cap: no more than 10 relevant cold contacts")) failures.push("Service outreach batch missing daily cap.");
  if (!text.includes("Do not scrape, spam, repeat-send")) failures.push("Service outreach batch missing anti-spam warning.");
  if (!text.includes("warm-reply-followup-01")) failures.push("Service outreach batch missing warm reply followup.");
  if (!text.includes("Revenue remains zero until an external provider proves a paid order")) failures.push("Service outreach batch missing revenue gate.");
}

const serviceSampleDeliveryFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicSampleDeliveryPath);
if (!fs.existsSync(serviceSampleDeliveryFile)) failures.push("Missing public service sample delivery ZIP.");
else if (fs.statSync(serviceSampleDeliveryFile).size < 1000) failures.push("Public service sample delivery ZIP is too small.");

const serviceDeliveryInputExampleFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicDeliveryInputExamplePath);
if (!fs.existsSync(serviceDeliveryInputExampleFile)) failures.push("Missing public service delivery input example.");
else {
  const data = JSON.parse(fs.readFileSync(serviceDeliveryInputExampleFile, "utf8"));
  if (data.serviceId !== CUSTOM_LOCAL_PRINT_PACK_SERVICE.id) failures.push("Service delivery input example has wrong service id.");
  if (data.paymentStatus !== "sample_only_not_revenue") failures.push("Service delivery input example should be marked sample_only_not_revenue.");
  if (!Array.isArray(data.items) || data.items.length < 3) failures.push("Service delivery input example missing sample items.");
}

const serviceDeliveryReportFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicDeliveryReportPath);
if (!fs.existsSync(serviceDeliveryReportFile)) failures.push("Missing public service sample delivery report.");
else {
  const data = JSON.parse(fs.readFileSync(serviceDeliveryReportFile, "utf8"));
  if (!data.sampleOnly) failures.push("Service sample delivery report should be sampleOnly.");
  if (!String(data.sampleDelivery?.path || "").includes("custom-local-print-pack-sample-delivery.zip")) failures.push("Service sample delivery report missing ZIP path.");
  if (!String(data.privateDeliveryCommand || "").includes("service:delivery")) failures.push("Service sample delivery report missing private delivery command.");
  if (!String(data.moneyGate || "").includes("paid order")) failures.push("Service sample delivery report missing paid-order money gate.");
}

const auditLeadMagnetFile = path.join(root, MARKET_TABLE_PRINT_AUDIT.slug, "index.html");
if (!fs.existsSync(auditLeadMagnetFile)) failures.push("Missing Free Market Table Print Audit page.");
else {
  const html = fs.readFileSync(auditLeadMagnetFile, "utf8");
  if (!html.includes("Free Market Table Print Audit")) failures.push("Audit page missing title.");
  if (!html.includes("Request free audit")) failures.push("Audit page missing request CTA.");
  if (!html.includes("Open structured audit form")) failures.push("Audit page missing structured audit form CTA.");
  if (!html.includes("data-audit-request-builder")) failures.push("Audit page missing interactive audit request builder.");
  if (!html.includes("Build your request")) failures.push("Audit page missing request builder heading.");
  if (!html.includes("Open prefilled GitHub request")) failures.push("Audit page missing generated GitHub request CTA.");
  if (!html.includes("Copy request")) failures.push("Audit page missing generated request copy button.");
  if (!html.includes("market-table-print-audit-request.txt")) failures.push("Audit page missing request template URL.");
  if (!html.includes("market-table-print-audit-checklist.json")) failures.push("Audit page missing checklist JSON URL.");
  if (!html.includes("custom-local-print-pack")) failures.push("Audit page missing optional paid upgrade link.");
  if (!html.includes("not revenue")) failures.push("Audit page missing no-revenue warning.");
  if (!html.includes("audit_request_intent")) failures.push("Audit page missing audit intent tracking.");
  if (!html.includes("paid_order_verified")) failures.push("Audit page missing paid-order upgrade status.");
  if (!sitemap.includes(`<loc>${siteUrl(MARKET_TABLE_PRINT_AUDIT.slug)}</loc>`)) failures.push("Sitemap missing market table print audit page.");
}

const auditIssueTemplateFile = path.join(root, MARKET_TABLE_PRINT_AUDIT.issueTemplatePath);
if (!fs.existsSync(auditIssueTemplateFile)) failures.push("Missing Free Market Table Print Audit GitHub issue form.");
else {
  const text = fs.readFileSync(auditIssueTemplateFile, "utf8");
  if (!text.includes("No payment is collected")) failures.push("Audit issue form missing no-payment warning.");
  if (!text.includes("not revenue")) failures.push("Audit issue form missing no-revenue warning.");
  if (!text.includes("Do not post card")) failures.push("Audit issue form missing sensitive-data warning.");
  if (!text.includes("business_name")) failures.push("Audit issue form missing business name field.");
  if (!text.includes("upgrade_interest")) failures.push("Audit issue form missing upgrade interest field.");
}

const auditRequestFile = path.join(root, MARKET_TABLE_PRINT_AUDIT.publicRequestPath);
if (!fs.existsSync(auditRequestFile)) failures.push("Missing public audit request template.");
else {
  const text = fs.readFileSync(auditRequestFile, "utf8");
  if (!text.includes("I want a Free Market Table Print Audit")) failures.push("Audit request template missing request copy.");
  if (!text.includes("No payment is collected for this audit request")) failures.push("Audit request template missing no-payment warning.");
  if (!text.includes("Do not include card, bank, payout")) failures.push("Audit request template missing sensitive-data warning.");
}

const auditChecklistFile = path.join(root, MARKET_TABLE_PRINT_AUDIT.publicChecklistPath);
if (!fs.existsSync(auditChecklistFile)) failures.push("Missing public audit checklist JSON.");
else {
  const data = JSON.parse(fs.readFileSync(auditChecklistFile, "utf8"));
  if (data.id !== MARKET_TABLE_PRINT_AUDIT.id) failures.push("Audit checklist has unexpected id.");
  if (!String(data.requestTemplateUrl || "").includes("market-table-print-audit-request.txt")) failures.push("Audit checklist missing request template URL.");
  if (!String(data.githubPagesRequestTemplateUrl || "").includes("market-table-print-audit-request.txt")) failures.push("Audit checklist missing GitHub Pages request template URL.");
  if (!String(data.githubPagesUpgradeServiceUrl || "").includes("custom-local-print-pack")) failures.push("Audit checklist missing upgrade service URL.");
  if (!Array.isArray(data.auditQuestions) || data.auditQuestions.length < 6) failures.push("Audit checklist missing audit questions.");
  if (!data.statuses?.some((status) => status.id === "audit_request_received" && String(status.moneyRule || "").includes("Not revenue"))) failures.push("Audit checklist missing no-revenue request status.");
  if (!data.statuses?.some((status) => status.id === "paid_order_verified" && String(status.moneyRule || "").includes("Revenue only"))) failures.push("Audit checklist missing paid-order revenue gate.");
  if (!String(data.moneyGate || "").includes("not revenue")) failures.push("Audit checklist missing no-revenue money gate.");
}

const unpaidDeliveryProbe = spawnSync(process.execPath, [path.join(root, "scripts", "generate-service-delivery.cjs"), "--input", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicDeliveryInputExamplePath, "--out", "paid-deliverables/service-orders"], {
  cwd: root,
  encoding: "utf8",
  shell: false,
});
if (unpaidDeliveryProbe.status === 0) failures.push("service:delivery CLI should reject sample/unpaid delivery input for live generation.");
if (!String(unpaidDeliveryProbe.stderr || unpaidDeliveryProbe.stdout || "").includes("paid_order_verified")) failures.push("service:delivery unpaid rejection should mention paid_order_verified.");

const serviceSalesPackFile = path.join(root, SERVICE_SALES_PACK.slug, "index.html");
if (!fs.existsSync(serviceSalesPackFile)) failures.push("Missing service sales pack page.");
else {
  const html = fs.readFileSync(serviceSalesPackFile, "utf8");
  if (!html.includes("Copy-ready sales pack")) failures.push("Service sales pack page missing headline.");
  if (!html.includes("Tracked links")) failures.push("Service sales pack page missing tracked links.");
  if (!html.includes("Copy-ready outreach")) failures.push("Service sales pack page missing outreach copy.");
  if (!html.includes("service-sales-pack.json")) failures.push("Service sales pack page missing machine-readable JSON link.");
  if (!html.includes("Open free audit lead magnet")) failures.push("Service sales pack page missing free audit lead magnet link.");
  if (!html.includes("market-table-print-audit-request.txt")) failures.push("Service sales pack page missing audit request template link.");
  if (!html.includes("market_table_audit")) failures.push("Service sales pack page missing audit tracking campaign.");
  if (!html.includes("direct-outreach")) failures.push("Service sales pack page missing direct outreach tracking.");
  if (!html.includes("Order pipeline assets")) failures.push("Service sales pack page missing order pipeline section.");
  if (!html.includes("custom-local-print-pack-service.yml")) failures.push("Service sales pack page missing structured issue form link.");
  if (!html.includes("custom-local-print-pack-payment-reply.txt")) failures.push("Service sales pack page missing payment reply asset.");
  if (!html.includes("custom-local-print-pack-outreach-queue.json")) failures.push("Service sales pack page missing outreach queue asset.");
  if (!html.includes("custom-local-print-pack-outreach-batch.txt")) failures.push("Service sales pack page missing outreach batch asset.");
  if (!html.includes("custom-local-print-pack-sample-delivery.zip")) failures.push("Service sales pack page missing sample delivery asset.");
  if (!html.includes("custom-local-print-pack-delivery-input.example.json")) failures.push("Service sales pack page missing delivery input example asset.");
  if (!html.includes("service:delivery")) failures.push("Service sales pack page missing private delivery command.");
  if (!html.includes("paid_order_verified")) failures.push("Service sales pack page missing paid order pipeline status.");
  if (!sitemap.includes(`<loc>${siteUrl(SERVICE_SALES_PACK.slug)}</loc>`)) failures.push("Sitemap missing service sales pack page.");
}

const serviceSalesPackJsonFile = path.join(root, "service-sales-pack.json");
if (!fs.existsSync(serviceSalesPackJsonFile)) failures.push("Missing service-sales-pack.json.");
else {
  const data = JSON.parse(fs.readFileSync(serviceSalesPackJsonFile, "utf8"));
  if (data.id !== SERVICE_SALES_PACK.id) failures.push("service-sales-pack.json has unexpected id.");
  if (!Array.isArray(data.trackedLinks) || data.trackedLinks.length < 5) failures.push("service-sales-pack.json missing tracked links.");
  if (!Array.isArray(data.outreachScripts) || data.outreachScripts.length < 4) failures.push("service-sales-pack.json missing outreach scripts.");
  if (!String(data.githubPagesServiceUrl || "").includes("custom-local-print-pack")) failures.push("service-sales-pack.json missing GitHub Pages service URL.");
  if (!String(data.serviceUrl || "").startsWith("https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/")) failures.push("service-sales-pack.json service URL should point to the live GitHub Pages request builder.");
  if (!String(data.mainSiteFallbackUrl || "").startsWith(siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug))) failures.push("service-sales-pack.json missing Cloudflare fallback URL.");
  if (data.trackedLinks?.some((item) => item.label === "Main service link" && String(item.url || "").includes("printable-tools-lab.pages.dev/custom-local-print-pack"))) failures.push("service-sales-pack.json still promotes stale Cloudflare main service link.");
  if (!String(data.issueFormUrl || "").includes("custom-local-print-pack-service.yml")) failures.push("service-sales-pack.json missing issue form URL.");
  if (!String(data.githubPagesPaymentReplyUrl || "").includes("custom-local-print-pack-payment-reply.txt")) failures.push("service-sales-pack.json missing GitHub Pages payment reply URL.");
  if (!String(data.githubPagesFulfillmentChecklistUrl || "").includes("custom-local-print-pack-fulfillment-checklist.txt")) failures.push("service-sales-pack.json missing GitHub Pages fulfillment checklist URL.");
  if (!String(data.githubPagesOrderPipelineUrl || "").includes("custom-local-print-pack-order-pipeline.json")) failures.push("service-sales-pack.json missing GitHub Pages order pipeline URL.");
  if (!data.orderPipeline?.some((status) => status.id === "paid_order_verified")) failures.push("service-sales-pack.json missing paid_order_verified pipeline status.");
  if (!String(data.githubPagesOutreachQueueUrl || "").includes("custom-local-print-pack-outreach-queue.json")) failures.push("service-sales-pack.json missing GitHub Pages outreach queue URL.");
  if (!String(data.githubPagesOutreachBatchUrl || "").includes("custom-local-print-pack-outreach-batch.txt")) failures.push("service-sales-pack.json missing GitHub Pages outreach batch URL.");
  if (!Array.isArray(data.outreachQueue) || data.outreachQueue.length < 10) failures.push("service-sales-pack.json missing outreach queue entries.");
  if (!String(data.githubPagesSampleDeliveryUrl || "").includes("custom-local-print-pack-sample-delivery.zip")) failures.push("service-sales-pack.json missing GitHub Pages sample delivery URL.");
  if (!String(data.githubPagesDeliveryInputExampleUrl || "").includes("custom-local-print-pack-delivery-input.example.json")) failures.push("service-sales-pack.json missing GitHub Pages delivery input example URL.");
  if (!String(data.githubPagesDeliveryReportUrl || "").includes("custom-local-print-pack-sample-delivery.json")) failures.push("service-sales-pack.json missing GitHub Pages delivery report URL.");
  if (!String(data.privateDeliveryCommand || "").includes("service:delivery")) failures.push("service-sales-pack.json missing private delivery command.");
  if (!data.leadMagnet || data.leadMagnet.id !== MARKET_TABLE_PRINT_AUDIT.id) failures.push("service-sales-pack.json missing lead magnet.");
  if (!data.marketTablePrintAudit || data.marketTablePrintAudit.id !== MARKET_TABLE_PRINT_AUDIT.id) failures.push("service-sales-pack.json missing market table print audit.");
  if (!data.trackedLinks?.some((item) => String(item.url || "").includes("market_table_audit"))) failures.push("service-sales-pack.json missing market table audit tracked link.");
  if (!String(data.marketTablePrintAudit?.moneyGate || "").includes("not revenue")) failures.push("service-sales-pack.json audit lead magnet missing no-revenue gate.");
  if (!String(data.moneyGate || "").includes("paid order")) failures.push("service-sales-pack.json missing paid-order money gate.");
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
  if (!distribution.includes("Paid service sales pack")) failures.push("DISTRIBUTION.md missing paid service sales pack section.");
  if (!distribution.includes("service_sales_pack")) failures.push("DISTRIBUTION.md missing service sales tracking campaign.");
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
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl(LOCAL_SELLER_STARTER_KIT.slug))) failures.push("discovery.json missing digital product page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug))) failures.push("discovery.json missing paid service page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl(MARKET_TABLE_PRINT_AUDIT.slug))) failures.push("discovery.json missing market table print audit page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl(SERVICE_SALES_PACK.slug))) failures.push("discovery.json missing service sales pack page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("platform-submit-queue"))) failures.push("discovery.json missing platform submit queue page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("platform-submit-cockpit"))) failures.push("discovery.json missing platform submit cockpit page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("platform-outreach-tracker"))) failures.push("discovery.json missing platform outreach tracker page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("portal-submission-pack"))) failures.push("discovery.json missing portal submission pack page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("zero-cost-monetization-map"))) failures.push("discovery.json missing zero-cost monetization map page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("upload-limit-fixer"))) failures.push("discovery.json missing upload limit fixer page.");
  if (discovery.shareKit !== siteUrl("share-kit.json").replace(/\/$/, "")) failures.push("discovery.json missing share-kit.json URL.");
  if (discovery.platformSubmitQueue !== siteUrl("platform-submit-queue.json").replace(/\/$/, "")) failures.push("discovery.json missing platform-submit-queue.json URL.");
  if (discovery.platformSubmitCockpit !== siteUrl("platform-submit-cockpit.json").replace(/\/$/, "")) failures.push("discovery.json missing platform-submit-cockpit.json URL.");
  if (discovery.platformOutreachTracker !== siteUrl("platform-outreach-tracker.json").replace(/\/$/, "")) failures.push("discovery.json missing platform-outreach-tracker.json URL.");
  if (discovery.portalSubmissionPack !== siteUrl("portal-submission-pack.json").replace(/\/$/, "")) failures.push("discovery.json missing portal-submission-pack.json URL.");
  if (discovery.digitalProducts !== siteUrl("digital-products.json").replace(/\/$/, "")) failures.push("discovery.json missing digital-products.json URL.");
  if (discovery.paidServices !== siteUrl("services.json").replace(/\/$/, "")) failures.push("discovery.json missing services.json URL.");
  if (discovery.serviceSalesPack !== siteUrl("service-sales-pack.json").replace(/\/$/, "")) failures.push("discovery.json missing service-sales-pack.json URL.");
  if (discovery.zeroCostMonetizationMap !== siteUrl("zero-cost-monetization-map.json").replace(/\/$/, "")) failures.push("discovery.json missing zero-cost-monetization-map.json URL.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.campaignVideos) || discovery.distributionAssets.campaignVideos.length < 6) failures.push("discovery.json missing campaign video assets.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.publicGist || "").includes("gist.github.com/yanqr213")) failures.push("discovery.json missing public Gist URL.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.publicGrowthIssue || "").includes("github.com/yanqr213/printable-tools-lab/issues/1")) failures.push("discovery.json missing public GitHub issue URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.platformSubmitQueue !== siteUrl("platform-submit-queue")) failures.push("discovery.json missing platform submit queue URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.platformSubmitCockpit !== siteUrl("platform-submit-cockpit")) failures.push("discovery.json missing platform submit cockpit URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.platformOutreachTracker !== siteUrl("platform-outreach-tracker")) failures.push("discovery.json missing platform outreach tracker URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.portalSubmissionPack !== siteUrl("portal-submission-pack")) failures.push("discovery.json missing portal submission pack URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.digitalProducts !== siteUrl(LOCAL_SELLER_STARTER_KIT.slug)) failures.push("discovery.json missing digital products page URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.paidServices !== siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)) failures.push("discovery.json missing paid services page URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.marketTablePrintAudit !== siteUrl(MARKET_TABLE_PRINT_AUDIT.slug)) failures.push("discovery.json missing market table print audit URL.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.marketTablePrintAuditRequest || "").includes("market-table-print-audit-request.txt")) failures.push("discovery.json missing market table print audit request template.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.marketTablePrintAuditChecklist || "").includes("market-table-print-audit-checklist.json")) failures.push("discovery.json missing market table print audit checklist.");
  if (!discovery.distributionAssets || discovery.distributionAssets.serviceSalesPack !== siteUrl(SERVICE_SALES_PACK.slug)) failures.push("discovery.json missing service sales pack page URL.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.serviceSalesPackJson || "").includes("service-sales-pack.json")) failures.push("discovery.json missing service sales pack JSON URL.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackRequest || "").includes("custom-local-print-pack-request.txt")) failures.push("discovery.json missing custom print pack request brief.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackIssueForm || "").includes("custom-local-print-pack-service.yml")) failures.push("discovery.json missing custom print pack issue form.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackPaymentReply || "").includes("custom-local-print-pack-payment-reply.txt")) failures.push("discovery.json missing custom print pack payment reply.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackFulfillmentChecklist || "").includes("custom-local-print-pack-fulfillment-checklist.txt")) failures.push("discovery.json missing custom print pack fulfillment checklist.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackOrderPipeline || "").includes("custom-local-print-pack-order-pipeline.json")) failures.push("discovery.json missing custom print pack order pipeline.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackOutreachQueue || "").includes("custom-local-print-pack-outreach-queue.json")) failures.push("discovery.json missing custom print pack outreach queue.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackOutreachBatch || "").includes("custom-local-print-pack-outreach-batch.txt")) failures.push("discovery.json missing custom print pack outreach batch.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackSampleDelivery || "").includes("custom-local-print-pack-sample-delivery.zip")) failures.push("discovery.json missing custom print pack sample delivery.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackDeliveryInputExample || "").includes("custom-local-print-pack-delivery-input.example.json")) failures.push("discovery.json missing custom print pack delivery input example.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.customLocalPrintPackDeliveryReport || "").includes("custom-local-print-pack-sample-delivery.json")) failures.push("discovery.json missing custom print pack delivery report.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.localSellerStarterKitSample || "").includes("local-seller-starter-kit-sample.zip")) failures.push("discovery.json missing seller kit sample ZIP.");
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

for (const [pagePath, headline, toolFragment] of [
  ["passport-photo-compress-to-100kb", "Compress a passport photo to 100KB", "/tools/compress-image-to-kb/?targetKb=100"],
  ["passport-photo-size-fixer", "Fix passport photo size and file limit", "/tools/passport-photo/"],
  ["resize-photo-413x531", "Resize photo to 413 x 531 pixels", "/tools/resize-image/?width=413&height=531&fit=cover"],
]) {
  const file = path.join(root, pagePath, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing photo upload landing page: ${pagePath}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(headline)) failures.push(`Photo upload landing page missing headline: ${pagePath}`);
  if (!html.includes(toolFragment)) failures.push(`Photo upload landing page missing prefilled tool link: ${pagePath}`);
  if (!sitemap.includes(`<loc>${siteUrl(pagePath)}</loc>`)) failures.push(`Sitemap missing photo upload landing page: ${pagePath}`);
}

const docsIndexFile = path.join(root, "docs", "index.html");
if (!fs.existsSync(docsIndexFile)) failures.push("Missing GitHub Pages discovery index.");
else {
  const html = fs.readFileSync(docsIndexFile, "utf8");
  if (!html.includes("Free PDF, image, and QR tools without signup")) failures.push("GitHub Pages discovery page missing heading.");
  if (!html.includes(siteUrl("free-pdf-tools"))) failures.push("GitHub Pages discovery page missing main directory link.");
  if (!html.includes(siteUrl("upload-limit-fixer"))) failures.push("GitHub Pages discovery page missing upload limit fixer link.");
  if (!html.includes("utm_source=github-pages")) failures.push("GitHub Pages discovery page missing tracked github-pages source links.");
  if (!html.includes(siteUrl("free-invoice-generator-no-signup"))) failures.push("GitHub Pages discovery page missing no-signup invoice landing link.");
  if (!html.includes(`https://yanqr213.github.io/printable-tools-lab/${CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug}/`)) failures.push("GitHub Pages discovery page missing paid service mirror link.");
  if (!html.includes(`https://yanqr213.github.io/printable-tools-lab/${MARKET_TABLE_PRINT_AUDIT.slug}/`)) failures.push("GitHub Pages discovery page missing market table print audit link.");
  if (!html.includes(`https://yanqr213.github.io/printable-tools-lab/${SERVICE_SALES_PACK.slug}/`)) failures.push("GitHub Pages discovery page missing service sales pack link.");
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
  if (!data.gameSubmissionPack || data.gameSubmissionPack.discoveryUrl !== "https://yanqr213.github.io/printable-tools-lab/html5-game-submission-pack/") failures.push("GitHub Pages discovery tools.json missing HTML5 game submission pack.");
  if (!data.gameSubmissionPack?.games?.some((game) => game.name === "Neon Lane Dash" && String(game.gameSnacksZipUrl || "").includes("neon-lane-dash-gamesnacks.zip"))) failures.push("GitHub Pages discovery tools.json missing Neon GameSnacks package.");
  if (!data.digitalProducts?.some((product) => product.id === LOCAL_SELLER_STARTER_KIT.id && String(product.sampleUrl || "").includes("local-seller-starter-kit-sample.zip"))) failures.push("GitHub Pages discovery tools.json missing digital product.");
  if (!data.digitalProducts?.some((product) => product.id === LOCAL_SELLER_STARTER_KIT.id && String(product.discoverySampleUrl || "").startsWith("https://yanqr213.github.io/printable-tools-lab/assets/digital-products/"))) failures.push("GitHub Pages discovery tools.json missing local sample ZIP URL.");
  if (!data.paidServices?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryRequestTemplateUrl || "").startsWith("https://yanqr213.github.io/printable-tools-lab/assets/services/"))) failures.push("GitHub Pages discovery tools.json missing paid service request brief URL.");
  if (!data.paidServices?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryPaymentReplyTemplateUrl || "").includes("custom-local-print-pack-payment-reply.txt"))) failures.push("GitHub Pages discovery tools.json missing paid service payment reply URL.");
  if (!data.paidServices?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryFulfillmentChecklistUrl || "").includes("custom-local-print-pack-fulfillment-checklist.txt"))) failures.push("GitHub Pages discovery tools.json missing paid service fulfillment checklist URL.");
  if (!data.paidServices?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryOrderPipelineUrl || "").includes("custom-local-print-pack-order-pipeline.json"))) failures.push("GitHub Pages discovery tools.json missing paid service order pipeline URL.");
  if (!data.paidServices?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryOutreachQueueUrl || "").includes("custom-local-print-pack-outreach-queue.json"))) failures.push("GitHub Pages discovery tools.json missing paid service outreach queue URL.");
  if (!data.paidServices?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryOutreachBatchUrl || "").includes("custom-local-print-pack-outreach-batch.txt"))) failures.push("GitHub Pages discovery tools.json missing paid service outreach batch URL.");
  if (!data.leadMagnets?.some((lead) => lead.id === MARKET_TABLE_PRINT_AUDIT.id && String(lead.discoveryRequestTemplateUrl || "").includes("market-table-print-audit-request.txt"))) failures.push("GitHub Pages discovery tools.json missing audit request template URL.");
  if (!data.leadMagnets?.some((lead) => lead.id === MARKET_TABLE_PRINT_AUDIT.id && String(lead.discoveryChecklistUrl || "").includes("market-table-print-audit-checklist.json"))) failures.push("GitHub Pages discovery tools.json missing audit checklist URL.");
  if (!data.leadMagnets?.some((lead) => lead.id === MARKET_TABLE_PRINT_AUDIT.id && String(lead.moneyGate || "").includes("not revenue"))) failures.push("GitHub Pages discovery tools.json missing audit no-revenue gate.");
  if (!data.serviceSalesPack || data.serviceSalesPack.id !== SERVICE_SALES_PACK.id) failures.push("GitHub Pages discovery tools.json missing service sales pack.");
  if (!data.serviceSalesPack?.trackedLinks?.some((item) => String(item.url || "").includes("service_sales_pack"))) failures.push("GitHub Pages discovery tools.json missing service sales pack tracking.");
  if (!String(data.serviceSalesPack?.githubPagesOrderPipelineUrl || "").includes("custom-local-print-pack-order-pipeline.json")) failures.push("GitHub Pages discovery tools.json missing service sales pack order pipeline URL.");
  if (!String(data.serviceSalesPack?.githubPagesOutreachQueueUrl || "").includes("custom-local-print-pack-outreach-queue.json")) failures.push("GitHub Pages discovery tools.json missing service sales pack outreach queue URL.");
  if (!Array.isArray(data.serviceSalesPack?.outreachQueue) || data.serviceSalesPack.outreachQueue.length < 10) failures.push("GitHub Pages discovery tools.json missing service sales pack outreach queue entries.");
}

const docsProductsFile = path.join(root, "docs", "products.json");
if (!fs.existsSync(docsProductsFile)) failures.push("Missing GitHub Pages products.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsProductsFile, "utf8"));
  if (!Array.isArray(data.products) || !data.products.some((product) => product.id === LOCAL_SELLER_STARTER_KIT.id)) failures.push("GitHub Pages products.json missing seller kit.");
  if (!data.products?.some((product) => product.id === LOCAL_SELLER_STARTER_KIT.id && String(product.discoverySampleUrl || "").startsWith("https://yanqr213.github.io/printable-tools-lab/assets/digital-products/"))) failures.push("GitHub Pages products.json missing local sample ZIP URL.");
  if (!data.products?.some((product) => product.id === LOCAL_SELLER_STARTER_KIT.id && String(product.discoveryRequestTemplateUrl || "").startsWith("https://yanqr213.github.io/printable-tools-lab/assets/digital-products/"))) failures.push("GitHub Pages products.json missing local buyer request template URL.");
  if (!data.products?.some((product) => product.id === LOCAL_SELLER_STARTER_KIT.id && String(product.discoveryPackageReportUrl || "").startsWith("https://yanqr213.github.io/printable-tools-lab/reports/"))) failures.push("GitHub Pages products.json missing local package report URL.");
  if (!data.products?.some((product) => product.id === LOCAL_SELLER_STARTER_KIT.id && String(product.checkoutRequestUrl || "").includes("github.com/yanqr213/printable-tools-lab/issues/new"))) failures.push("GitHub Pages products.json missing checkout request URL.");
  if (!String(data.moneyGate || "").includes("paid order")) failures.push("GitHub Pages products.json missing paid-order money gate.");
}

const docsProductFile = path.join(root, "docs", LOCAL_SELLER_STARTER_KIT.slug, "index.html");
if (!fs.existsSync(docsProductFile)) failures.push("Missing GitHub Pages seller kit mirror page.");
else {
  const html = fs.readFileSync(docsProductFile, "utf8");
  if (!html.includes("Local Seller Starter Kit")) failures.push("GitHub Pages seller kit mirror missing title.");
  if (!html.includes("Download sample ZIP")) failures.push("GitHub Pages seller kit mirror missing sample link.");
  if (!html.includes("Request checkout link")) failures.push("GitHub Pages seller kit mirror missing checkout request CTA.");
  if (!html.includes("github.com/yanqr213/printable-tools-lab/issues/new")) failures.push("GitHub Pages seller kit mirror missing checkout request URL.");
  if (!html.includes("local-seller-starter-kit-buy-request.txt")) failures.push("GitHub Pages seller kit mirror missing buyer request template URL.");
  if (html.indexOf("Open live product page") !== -1) failures.push("GitHub Pages seller kit mirror should not make stale Cloudflare the primary product CTA.");
  if (!html.includes("https://yanqr213.github.io/printable-tools-lab/assets/digital-products/local-seller-starter-kit-sample.zip")) failures.push("GitHub Pages seller kit mirror should use local sample ZIP URL.");
  if (!html.includes("https://yanqr213.github.io/printable-tools-lab/reports/local-seller-starter-kit-package.json")) failures.push("GitHub Pages seller kit mirror should link local package report.");
  if (!html.includes('"@type":"Product"')) failures.push("GitHub Pages seller kit mirror missing Product schema.");
  requireGithubPagesIntentTracking(html, "GitHub Pages seller kit mirror", ["seller_sample_download", "seller_checkout_intent"]);
  if (!sitemapIncludes(path.join(root, "docs", "sitemap.xml"), `https://yanqr213.github.io/printable-tools-lab/${LOCAL_SELLER_STARTER_KIT.slug}/`)) failures.push("GitHub Pages sitemap missing seller kit mirror page.");
}

const docsSellerKitSampleFile = path.join(root, "docs", LOCAL_SELLER_STARTER_KIT.publicSamplePath);
if (!fs.existsSync(docsSellerKitSampleFile)) failures.push("Missing GitHub Pages seller kit sample ZIP copy.");
else if (fs.statSync(docsSellerKitSampleFile).size < 500) failures.push("GitHub Pages seller kit sample ZIP copy is too small.");

const docsSellerKitRequestFile = path.join(root, "docs", LOCAL_SELLER_STARTER_KIT.publicRequestPath);
if (!fs.existsSync(docsSellerKitRequestFile)) failures.push("Missing GitHub Pages seller kit buyer request template copy.");

const docsSellerKitReportFile = path.join(root, "docs", LOCAL_SELLER_STARTER_KIT.packageReportPath);
if (!fs.existsSync(docsSellerKitReportFile)) failures.push("Missing GitHub Pages seller kit package report copy.");
else {
  const report = JSON.parse(fs.readFileSync(docsSellerKitReportFile, "utf8"));
  if (!report.publicSample || report.publicSample.fileCount < 4) failures.push("GitHub Pages seller kit package report copy missing public sample count.");
  if (!String(report.moneyGate || "").includes("paid order")) failures.push("GitHub Pages seller kit package report copy missing paid-order gate.");
}

const docsServicesFile = path.join(root, "docs", "services.json");
if (!fs.existsSync(docsServicesFile)) failures.push("Missing GitHub Pages services.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsServicesFile, "utf8"));
  if (!Array.isArray(data.services) || !data.services.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id)) failures.push("GitHub Pages services.json missing custom print pack service.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.url || "").startsWith("https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/"))) failures.push("GitHub Pages services.json service URL should point to the live request builder.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.mainSiteFallbackUrl || "").startsWith(siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)))) failures.push("GitHub Pages services.json missing Cloudflare fallback URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.githubPagesServiceUrl || "").startsWith("https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/"))) failures.push("GitHub Pages services.json missing GitHub Pages service URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryRequestTemplateUrl || "").includes("custom-local-print-pack-request.txt"))) failures.push("GitHub Pages services.json missing service request brief URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.issueFormUrl || "").includes("custom-local-print-pack-service.yml"))) failures.push("GitHub Pages services.json missing service issue form URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryPaymentReplyTemplateUrl || "").includes("custom-local-print-pack-payment-reply.txt"))) failures.push("GitHub Pages services.json missing service payment reply URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryFulfillmentChecklistUrl || "").includes("custom-local-print-pack-fulfillment-checklist.txt"))) failures.push("GitHub Pages services.json missing service fulfillment checklist URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryOrderPipelineUrl || "").includes("custom-local-print-pack-order-pipeline.json"))) failures.push("GitHub Pages services.json missing service order pipeline URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && service.orderPipeline?.some((status) => status.id === "paid_order_verified"))) failures.push("GitHub Pages services.json missing paid_order_verified pipeline status.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryOutreachQueueUrl || "").includes("custom-local-print-pack-outreach-queue.json"))) failures.push("GitHub Pages services.json missing service outreach queue URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryOutreachBatchUrl || "").includes("custom-local-print-pack-outreach-batch.txt"))) failures.push("GitHub Pages services.json missing service outreach batch URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && service.outreachQueue?.length >= 10)) failures.push("GitHub Pages services.json missing service outreach queue entries.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoverySampleDeliveryUrl || "").includes("custom-local-print-pack-sample-delivery.zip"))) failures.push("GitHub Pages services.json missing service sample delivery URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryDeliveryInputExampleUrl || "").includes("custom-local-print-pack-delivery-input.example.json"))) failures.push("GitHub Pages services.json missing service delivery input example URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.discoveryDeliveryReportUrl || "").includes("custom-local-print-pack-sample-delivery.json"))) failures.push("GitHub Pages services.json missing service delivery report URL.");
  if (!data.services?.some((service) => service.id === CUSTOM_LOCAL_PRINT_PACK_SERVICE.id && String(service.privateDeliveryCommand || "").includes("service:delivery"))) failures.push("GitHub Pages services.json missing service private delivery command.");
  if (!data.leadMagnets?.some((lead) => lead.id === MARKET_TABLE_PRINT_AUDIT.id && String(lead.discoveryRequestTemplateUrl || "").includes("market-table-print-audit-request.txt"))) failures.push("GitHub Pages services.json missing audit request template URL.");
  if (!data.leadMagnets?.some((lead) => lead.id === MARKET_TABLE_PRINT_AUDIT.id && String(lead.discoveryChecklistUrl || "").includes("market-table-print-audit-checklist.json"))) failures.push("GitHub Pages services.json missing audit checklist URL.");
  if (!data.leadMagnets?.some((lead) => lead.id === MARKET_TABLE_PRINT_AUDIT.id && lead.statuses?.some((status) => status.id === "audit_request_received" && String(status.moneyRule || "").includes("Not revenue")))) failures.push("GitHub Pages services.json missing audit no-revenue request status.");
  if (!String(data.moneyGate || "").includes("paid order")) failures.push("GitHub Pages services.json missing paid-order money gate.");
}

const docsServiceFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug, "index.html");
if (!fs.existsSync(docsServiceFile)) failures.push("Missing GitHub Pages custom print pack service mirror page.");
else {
  const html = fs.readFileSync(docsServiceFile, "utf8");
  if (!html.includes("Custom Local Print Pack Setup")) failures.push("GitHub Pages service mirror missing title.");
  if (!html.includes("Request service checkout")) failures.push("GitHub Pages service mirror missing request CTA.");
  if (!html.includes("Open structured request form")) failures.push("GitHub Pages service mirror missing structured issue form CTA.");
  if (!html.includes("Build a service request")) failures.push("GitHub Pages service mirror missing service request builder.");
  if (!html.includes("Copy generated service request")) failures.push("GitHub Pages service mirror missing low-friction generated request CTA.");
  if (!html.includes("Open generated GitHub request")) failures.push("GitHub Pages service mirror missing generated GitHub request CTA.");
  if (!html.includes("data-service-request-builder")) failures.push("GitHub Pages service mirror missing service request builder hook.");
  if (!html.includes("data-service-request-open")) failures.push("GitHub Pages service mirror missing generated request open hook.");
  if (!html.includes("data-service-request-copy")) failures.push("GitHub Pages service mirror missing service request copy hook.");
  if (!html.includes("data-service-request-output")) failures.push("GitHub Pages service mirror missing service request copy output.");
  if (!html.includes("Up to 12 items or services with prices")) failures.push("GitHub Pages service mirror missing buyer item intake field.");
  if (!html.includes("Preferred checkout provider")) failures.push("GitHub Pages service mirror missing checkout preference field.");
  if (!html.includes("custom-local-print-pack-request.txt")) failures.push("GitHub Pages service mirror missing request brief URL.");
  if (!html.includes("custom-local-print-pack-payment-reply.txt")) failures.push("GitHub Pages service mirror missing payment reply URL.");
  if (!html.includes("custom-local-print-pack-fulfillment-checklist.txt")) failures.push("GitHub Pages service mirror missing fulfillment checklist URL.");
  if (!html.includes("custom-local-print-pack-order-pipeline.json")) failures.push("GitHub Pages service mirror missing order pipeline URL.");
  if (!html.includes("custom-local-print-pack-outreach-queue.json")) failures.push("GitHub Pages service mirror missing outreach queue URL.");
  if (!html.includes("custom-local-print-pack-outreach-batch.txt")) failures.push("GitHub Pages service mirror missing outreach batch URL.");
  if (!html.includes("custom-local-print-pack-sample-delivery.zip")) failures.push("GitHub Pages service mirror missing sample delivery URL.");
  if (!html.includes("custom-local-print-pack-delivery-input.example.json")) failures.push("GitHub Pages service mirror missing delivery input example URL.");
  if (!html.includes("service:delivery")) failures.push("GitHub Pages service mirror missing private delivery command.");
  if (!html.includes("paid_order_verified")) failures.push("GitHub Pages service mirror missing paid_order_verified status.");
  if (!html.includes("github.com/yanqr213/printable-tools-lab/issues/new")) failures.push("GitHub Pages service mirror missing GitHub request URL.");
  if (!html.includes("market-table-print-audit")) failures.push("GitHub Pages service mirror missing audit lead magnet link.");
  if (!html.includes('"@type":"Service"')) failures.push("GitHub Pages service mirror missing Service schema.");
  requireGithubPagesIntentTracking(html, "GitHub Pages service mirror", ["service_request_intent", "audit_request_intent"]);
  if (!sitemapIncludes(path.join(root, "docs", "sitemap.xml"), `https://yanqr213.github.io/printable-tools-lab/${CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug}/`)) failures.push("GitHub Pages sitemap missing custom print pack service mirror page.");
}

const docsServiceRequestFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicRequestPath);
if (!fs.existsSync(docsServiceRequestFile)) failures.push("Missing GitHub Pages service request brief copy.");
else {
  const text = fs.readFileSync(docsServiceRequestFile, "utf8");
  if (!text.includes("I want to request the Custom Local Print Pack Setup")) failures.push("GitHub Pages service request brief missing request copy.");
}

const docsServicePaymentReplyFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicPaymentReplyPath);
if (!fs.existsSync(docsServicePaymentReplyFile)) failures.push("Missing GitHub Pages service payment reply copy.");
else {
  const text = fs.readFileSync(docsServicePaymentReplyFile, "utf8");
  if (!text.includes("payment link before work starts")) failures.push("GitHub Pages service payment reply missing payment-before-work language.");
}

const docsServiceFulfillmentChecklistFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicFulfillmentChecklistPath);
if (!fs.existsSync(docsServiceFulfillmentChecklistFile)) failures.push("Missing GitHub Pages service fulfillment checklist copy.");
else {
  const text = fs.readFileSync(docsServiceFulfillmentChecklistFile, "utf8");
  if (!text.includes("Use this only after a real external payment provider shows a paid order")) failures.push("GitHub Pages service fulfillment checklist missing paid-order gate.");
}

const docsServiceOrderPipelineFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOrderPipelinePath);
if (!fs.existsSync(docsServiceOrderPipelineFile)) failures.push("Missing GitHub Pages service order pipeline copy.");
else {
  const data = JSON.parse(fs.readFileSync(docsServiceOrderPipelineFile, "utf8"));
  if (!data.statuses?.some((status) => status.id === "paid_order_verified")) failures.push("GitHub Pages service order pipeline missing paid_order_verified status.");
}

const docsServiceOutreachQueueFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOutreachQueuePath);
if (!fs.existsSync(docsServiceOutreachQueueFile)) failures.push("Missing GitHub Pages service outreach queue copy.");
else {
  const data = JSON.parse(fs.readFileSync(docsServiceOutreachQueueFile, "utf8"));
  if (!Array.isArray(data.batch) || data.batch.length < 10) failures.push("GitHub Pages service outreach queue missing 10-action batch.");
  if (!data.forbiddenActions?.some((item) => String(item).includes("scrape private contact lists"))) failures.push("GitHub Pages service outreach queue missing no-scraping rule.");
}

const docsServiceOutreachBatchFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOutreachBatchPath);
if (!fs.existsSync(docsServiceOutreachBatchFile)) failures.push("Missing GitHub Pages service outreach batch copy.");
else {
  const text = fs.readFileSync(docsServiceOutreachBatchFile, "utf8");
  if (!text.includes("Daily cap: no more than 10 relevant cold contacts")) failures.push("GitHub Pages service outreach batch missing daily cap.");
}

const docsServiceSampleDeliveryFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicSampleDeliveryPath);
if (!fs.existsSync(docsServiceSampleDeliveryFile)) failures.push("Missing GitHub Pages service sample delivery ZIP copy.");
else if (fs.statSync(docsServiceSampleDeliveryFile).size < 1000) failures.push("GitHub Pages service sample delivery ZIP copy is too small.");

const docsServiceDeliveryInputExampleFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicDeliveryInputExamplePath);
if (!fs.existsSync(docsServiceDeliveryInputExampleFile)) failures.push("Missing GitHub Pages service delivery input example copy.");
else {
  const data = JSON.parse(fs.readFileSync(docsServiceDeliveryInputExampleFile, "utf8"));
  if (data.paymentStatus !== "sample_only_not_revenue") failures.push("GitHub Pages service delivery input example should be sample_only_not_revenue.");
}

const docsServiceDeliveryReportFile = path.join(root, "docs", CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicDeliveryReportPath);
if (!fs.existsSync(docsServiceDeliveryReportFile)) failures.push("Missing GitHub Pages service delivery report copy.");
else {
  const data = JSON.parse(fs.readFileSync(docsServiceDeliveryReportFile, "utf8"));
  if (!data.sampleOnly) failures.push("GitHub Pages service delivery report should be sampleOnly.");
  if (!String(data.privateDeliveryCommand || "").includes("service:delivery")) failures.push("GitHub Pages service delivery report missing private delivery command.");
}

const docsAuditLeadMagnetFile = path.join(root, "docs", MARKET_TABLE_PRINT_AUDIT.slug, "index.html");
if (!fs.existsSync(docsAuditLeadMagnetFile)) failures.push("Missing GitHub Pages market table print audit mirror page.");
else {
  const html = fs.readFileSync(docsAuditLeadMagnetFile, "utf8");
  if (!html.includes("Free Market Table Print Audit")) failures.push("GitHub Pages audit mirror missing title.");
  if (!html.includes("Request free audit")) failures.push("GitHub Pages audit mirror missing request CTA.");
  if (!html.includes("Open structured audit form")) failures.push("GitHub Pages audit mirror missing structured audit form link.");
  if (!html.includes("data-audit-request-builder")) failures.push("GitHub Pages audit mirror missing interactive audit request builder.");
  if (!html.includes("Build your request")) failures.push("GitHub Pages audit mirror missing request builder heading.");
  if (!html.includes("Open prefilled GitHub request")) failures.push("GitHub Pages audit mirror missing generated GitHub request CTA.");
  if (!html.includes("Copy request")) failures.push("GitHub Pages audit mirror missing generated request copy button.");
  if (!html.includes("market-table-print-audit-request.txt")) failures.push("GitHub Pages audit mirror missing request template link.");
  if (!html.includes("market-table-print-audit-checklist.json")) failures.push("GitHub Pages audit mirror missing checklist link.");
  if (!html.includes("custom-local-print-pack")) failures.push("GitHub Pages audit mirror missing upgrade service link.");
  if (!html.includes("not revenue")) failures.push("GitHub Pages audit mirror missing no-revenue gate.");
  requireGithubPagesIntentTracking(html, "GitHub Pages audit mirror", ["audit_request_intent"]);
  if (!sitemapIncludes(path.join(root, "docs", "sitemap.xml"), `https://yanqr213.github.io/printable-tools-lab/${MARKET_TABLE_PRINT_AUDIT.slug}/`)) failures.push("GitHub Pages sitemap missing market table print audit mirror page.");
}

const docsAuditRequestFile = path.join(root, "docs", MARKET_TABLE_PRINT_AUDIT.publicRequestPath);
if (!fs.existsSync(docsAuditRequestFile)) failures.push("Missing GitHub Pages audit request template copy.");
else {
  const text = fs.readFileSync(docsAuditRequestFile, "utf8");
  if (!text.includes("I want a Free Market Table Print Audit")) failures.push("GitHub Pages audit request template missing request copy.");
  if (!text.includes("No payment is collected for this audit request")) failures.push("GitHub Pages audit request template missing no-payment warning.");
}

const docsAuditChecklistFile = path.join(root, "docs", MARKET_TABLE_PRINT_AUDIT.publicChecklistPath);
if (!fs.existsSync(docsAuditChecklistFile)) failures.push("Missing GitHub Pages audit checklist copy.");
else {
  const data = JSON.parse(fs.readFileSync(docsAuditChecklistFile, "utf8"));
  if (data.id !== MARKET_TABLE_PRINT_AUDIT.id) failures.push("GitHub Pages audit checklist has unexpected id.");
  if (!String(data.githubPagesUpgradeServiceUrl || "").includes("custom-local-print-pack")) failures.push("GitHub Pages audit checklist missing upgrade service URL.");
  if (!data.statuses?.some((status) => status.id === "audit_request_received" && String(status.moneyRule || "").includes("Not revenue"))) failures.push("GitHub Pages audit checklist missing no-revenue request status.");
}

const docsServiceSalesPackJsonFile = path.join(root, "docs", "service-sales-pack.json");
if (!fs.existsSync(docsServiceSalesPackJsonFile)) failures.push("Missing GitHub Pages service-sales-pack.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsServiceSalesPackJsonFile, "utf8"));
  if (data.id !== SERVICE_SALES_PACK.id) failures.push("GitHub Pages service-sales-pack.json has unexpected id.");
  if (!String(data.discoveryUrl || "").includes(SERVICE_SALES_PACK.slug)) failures.push("GitHub Pages service-sales-pack.json missing discovery URL.");
  if (!String(data.serviceUrl || "").startsWith("https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/")) failures.push("GitHub Pages service-sales-pack.json service URL should point to the live request builder.");
  if (!String(data.mainSiteFallbackUrl || "").startsWith(siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug))) failures.push("GitHub Pages service-sales-pack.json missing Cloudflare fallback URL.");
  if (!data.trackedLinks?.some((item) => String(item.url || "").includes("service_sales_pack"))) failures.push("GitHub Pages service-sales-pack.json missing tracked links.");
  if (data.trackedLinks?.some((item) => item.label === "Main service link" && String(item.url || "").includes("printable-tools-lab.pages.dev/custom-local-print-pack"))) failures.push("GitHub Pages service-sales-pack.json still promotes stale Cloudflare main service link.");
  if (!data.trackedLinks?.some((item) => String(item.url || "").includes("market_table_audit"))) failures.push("GitHub Pages service-sales-pack.json missing audit tracked links.");
  if (!data.outreachScripts?.some((item) => String(item.message || "").includes("$29"))) failures.push("GitHub Pages service-sales-pack.json missing $29 outreach copy.");
  if (!String(data.issueFormUrl || "").includes("custom-local-print-pack-service.yml")) failures.push("GitHub Pages service-sales-pack.json missing issue form URL.");
  if (!String(data.githubPagesPaymentReplyUrl || "").includes("custom-local-print-pack-payment-reply.txt")) failures.push("GitHub Pages service-sales-pack.json missing payment reply URL.");
  if (!String(data.githubPagesFulfillmentChecklistUrl || "").includes("custom-local-print-pack-fulfillment-checklist.txt")) failures.push("GitHub Pages service-sales-pack.json missing fulfillment checklist URL.");
  if (!String(data.githubPagesOrderPipelineUrl || "").includes("custom-local-print-pack-order-pipeline.json")) failures.push("GitHub Pages service-sales-pack.json missing order pipeline URL.");
  if (!data.orderPipeline?.some((status) => status.id === "paid_order_verified")) failures.push("GitHub Pages service-sales-pack.json missing paid_order_verified status.");
  if (!String(data.githubPagesOutreachQueueUrl || "").includes("custom-local-print-pack-outreach-queue.json")) failures.push("GitHub Pages service-sales-pack.json missing outreach queue URL.");
  if (!String(data.githubPagesOutreachBatchUrl || "").includes("custom-local-print-pack-outreach-batch.txt")) failures.push("GitHub Pages service-sales-pack.json missing outreach batch URL.");
  if (!Array.isArray(data.outreachQueue) || data.outreachQueue.length < 10) failures.push("GitHub Pages service-sales-pack.json missing outreach queue entries.");
  if (!String(data.githubPagesSampleDeliveryUrl || "").includes("custom-local-print-pack-sample-delivery.zip")) failures.push("GitHub Pages service-sales-pack.json missing sample delivery URL.");
  if (!String(data.githubPagesDeliveryInputExampleUrl || "").includes("custom-local-print-pack-delivery-input.example.json")) failures.push("GitHub Pages service-sales-pack.json missing delivery input example URL.");
  if (!String(data.githubPagesDeliveryReportUrl || "").includes("custom-local-print-pack-sample-delivery.json")) failures.push("GitHub Pages service-sales-pack.json missing delivery report URL.");
  if (!String(data.privateDeliveryCommand || "").includes("service:delivery")) failures.push("GitHub Pages service-sales-pack.json missing private delivery command.");
  if (!data.leadMagnet || data.leadMagnet.id !== MARKET_TABLE_PRINT_AUDIT.id) failures.push("GitHub Pages service-sales-pack.json missing audit lead magnet.");
  if (!data.marketTablePrintAudit || data.marketTablePrintAudit.id !== MARKET_TABLE_PRINT_AUDIT.id) failures.push("GitHub Pages service-sales-pack.json missing market table print audit.");
}

const docsServiceSalesPackFile = path.join(root, "docs", SERVICE_SALES_PACK.slug, "index.html");
if (!fs.existsSync(docsServiceSalesPackFile)) failures.push("Missing GitHub Pages service sales pack mirror page.");
else {
  const html = fs.readFileSync(docsServiceSalesPackFile, "utf8");
  if (!html.includes("Copy-ready sales pack")) failures.push("GitHub Pages service sales pack missing headline.");
  if (!html.includes("Tracked links")) failures.push("GitHub Pages service sales pack missing tracked links.");
  if (!html.includes("Copy-ready outreach")) failures.push("GitHub Pages service sales pack missing outreach copy.");
  if (!html.includes("market_table_audit")) failures.push("GitHub Pages service sales pack missing audit tracking campaign.");
  if (!html.includes("market-table-print-audit-request.txt")) failures.push("GitHub Pages service sales pack missing audit request template.");
  if (!html.includes("service_sales_pack")) failures.push("GitHub Pages service sales pack missing tracking campaign.");
  if (!html.includes("Order pipeline assets")) failures.push("GitHub Pages service sales pack missing order pipeline section.");
  if (!html.includes("custom-local-print-pack-service.yml")) failures.push("GitHub Pages service sales pack missing issue form link.");
  if (!html.includes("custom-local-print-pack-payment-reply.txt")) failures.push("GitHub Pages service sales pack missing payment reply link.");
  if (!html.includes("custom-local-print-pack-outreach-queue.json")) failures.push("GitHub Pages service sales pack missing outreach queue link.");
  if (!html.includes("custom-local-print-pack-outreach-batch.txt")) failures.push("GitHub Pages service sales pack missing outreach batch link.");
  if (!html.includes("custom-local-print-pack-sample-delivery.zip")) failures.push("GitHub Pages service sales pack missing sample delivery link.");
  if (!html.includes("custom-local-print-pack-delivery-input.example.json")) failures.push("GitHub Pages service sales pack missing delivery input example link.");
  if (!html.includes("service:delivery")) failures.push("GitHub Pages service sales pack missing private delivery command.");
  if (!html.includes("paid_order_verified")) failures.push("GitHub Pages service sales pack missing paid_order_verified status.");
  requireGithubPagesIntentTracking(html, "GitHub Pages service sales pack", ["service_request_intent"]);
  if (!sitemapIncludes(path.join(root, "docs", "sitemap.xml"), `https://yanqr213.github.io/printable-tools-lab/${SERVICE_SALES_PACK.slug}/`)) failures.push("GitHub Pages sitemap missing service sales pack mirror page.");
}

const docsGamesFile = path.join(root, "docs", "games.json");
if (!fs.existsSync(docsGamesFile)) failures.push("Missing GitHub Pages games.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsGamesFile, "utf8"));
  if (!Array.isArray(data.games) || data.games.length < 2) failures.push("GitHub Pages games.json missing games.");
  if (!data.games.some((game) => game.name === "Neon Lane Dash" && String(game.gameSnacksVerificationUrl || "").includes("gamesnacks-verification.json"))) failures.push("GitHub Pages games.json missing Neon GameSnacks verification.");
  if (!data.games.every((game) => String(game.cleanPortalZipUrl || "").includes("portal-clean.zip"))) failures.push("GitHub Pages games.json missing clean portal ZIPs.");
  if (!Array.isArray(data.safetyRules) || !data.safetyRules.some((rule) => String(rule).includes("Standalone builds do not force ads"))) failures.push("GitHub Pages games.json missing ad-safety rule.");
}

const docsGameSubmissionFeedFile = path.join(root, "docs", "game-submission-feed.json");
if (!fs.existsSync(docsGameSubmissionFeedFile)) failures.push("Missing GitHub Pages game-submission-feed.json alias.");
else {
  const data = JSON.parse(fs.readFileSync(docsGameSubmissionFeedFile, "utf8"));
  if (!Array.isArray(data.games) || data.games.length < 2) failures.push("GitHub Pages game-submission-feed.json alias missing games.");
  if (!data.games.some((game) => game.name === "Neon Lane Dash" && String(game.gameSnacksVerificationUrl || "").includes("gamesnacks-verification.json"))) failures.push("GitHub Pages game-submission-feed.json alias missing Neon GameSnacks verification.");
  if (!Array.isArray(data.safetyRules) || !data.safetyRules.some((rule) => String(rule).includes("Payment, tax, bank"))) failures.push("GitHub Pages game-submission-feed.json alias missing private-data rule.");
}

const docsGamePackFile = path.join(root, "docs", "html5-game-submission-pack", "index.html");
if (!fs.existsSync(docsGamePackFile)) failures.push("Missing GitHub Pages HTML5 game submission pack page.");
else {
  const html = fs.readFileSync(docsGamePackFile, "utf8");
  if (!html.includes("HTML5 game submission pack")) failures.push("GitHub Pages game pack page missing heading.");
  if (!html.includes("neon-lane-dash-gamesnacks.zip")) failures.push("GitHub Pages game pack page missing GameSnacks ZIP link.");
  if (!html.includes("upload-limit-panic-portal-clean.zip")) failures.push("GitHub Pages game pack page missing backup clean ZIP link.");
  if (!sitemapIncludes(path.join(root, "docs", "sitemap.xml"), "https://yanqr213.github.io/printable-tools-lab/html5-game-submission-pack/")) failures.push("GitHub Pages sitemap missing game submission pack page.");
}

for (const [slug, name] of [["neon-lane-dash", "Neon Lane Dash"], ["upload-limit-panic", "Upload Limit Panic"]]) {
  const file = path.join(root, "docs", "html5-game-submission-pack", slug, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing GitHub Pages game mirror page: ${slug}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(name)) failures.push(`GitHub Pages game mirror page missing game name: ${slug}`);
  if (!html.includes("Review-readiness report")) failures.push(`GitHub Pages game mirror page missing review report: ${slug}`);
  if (!html.includes('"@type":"VideoGame"')) failures.push(`GitHub Pages game mirror page missing VideoGame schema: ${slug}`);
  if (!sitemapIncludes(path.join(root, "docs", "sitemap.xml"), `https://yanqr213.github.io/printable-tools-lab/html5-game-submission-pack/${slug}/`)) failures.push(`GitHub Pages sitemap missing game mirror page: ${slug}`);
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

function sitemapIncludes(filePath, url) {
  if (!fs.existsSync(filePath)) return false;
  return fs.readFileSync(filePath, "utf8").includes(`<loc>${url}</loc>`);
}
