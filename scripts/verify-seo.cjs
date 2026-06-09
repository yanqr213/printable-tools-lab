const fs = require("fs");
const path = require("path");
const { routes, siteUrl, landingPages, LOCAL_SELLER_STARTER_KIT, CUSTOM_LOCAL_PRINT_PACK_SERVICE, INVOICE_FOLLOWUP_COPY_PACK_SERVICE, UPLOAD_LIMIT_FIX_PLAN_SERVICE, MARKET_TABLE_PRINT_AUDIT, SERVICE_SALES_PACK, HIGH_INTENT_TOOL_PATHS, ORGANIC_PUSH_TASKS, UPLOAD_ERROR_CHEATSHEET, SPONSOR_DISCOVERY_LINKS, SPONSOR_VERTICALS, SPONSOR_DEALS, tools, guides } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const failures = [];
const GITHUB_PAGES_EVENT_ENDPOINT = "https://printable-tools-lab.pages.dev/api/event";
const UPLOAD_LIMIT_SHORTCUT_PATHS = [
  "/pdf-size-reducer/",
  "/image-size-reducer-in-kb/",
  "/pdf-must-be-under-100kb/",
  "/pdf-must-be-under-200kb/",
  "/pdf-must-be-under-300kb/",
  "/compress-pdf-to-100kb/",
  "/compress-pdf-to-200kb/",
  "/compress-pdf-to-300kb/",
  "/compress-pdf-to-1mb/",
  "/compress-pdf-to-500kb/",
  "/pdf-must-be-under-10mb/",
  "/compress-pdf-to-10mb/",
  "/compress-image-to-100kb/",
  "/compress-jpg-to-100kb/",
  "/compress-png-to-100kb/",
  "/passport-photo-size-fixer/",
  "/photo-200x230-20kb/",
  "/photo-200x230-50kb/",
  "/photo-200x230-100kb/",
  "/photo-240x320-50kb/",
  "/photo-295x413-35kb/",
  "/photo-413x531-100kb/",
  "/photo-413x531-50kb/",
  "/photo-354x472-100kb/",
  "/photo-300x300-100kb/",
  "/photo-600x600-100kb/",
  "/photo-480x640-200kb/",
  "/photo-512x512-100kb/",
  "/photo-150x200-20kb/",
  "/photo-180x240-50kb/",
  "/photo-400x514-100kb/",
  "/photo-600x800-200kb/",
  "/photo-120x160-20kb/",
  "/photo-160x200-30kb/",
  "/photo-300x400-100kb/",
  "/photo-350x450-100kb/",
  "/photo-360x480-100kb/",
  "/photo-420x560-200kb/",
  "/signature-140x60-20kb/",
  "/signature-140x60-50kb/",
  "/signature-150x50-20kb/",
  "/signature-160x70-20kb/",
  "/signature-200x50-20kb/",
  "/signature-200x100-50kb/",
  "/signature-250x80-50kb/",
  "/signature-300x60-20kb/",
  "/signature-300x80-50kb/",
  "/signature-300x100-50kb/",
  "/signature-400x150-50kb/",
  "/signature-100x50-10kb/",
  "/signature-200x60-20kb/",
  "/signature-256x64-20kb/",
  "/signature-400x200-100kb/",
];
const UPLOAD_LIMIT_DECISION_LINKS = [
  ["/pdf-must-be-under-100kb/", "compress-pdf"],
  ["/pdf-must-be-under-200kb/", "compress-pdf"],
  ["/pdf-must-be-under-300kb/", "compress-pdf"],
  ["/tools/compress-pdf/?targetSize=1mb", "compress-pdf"],
  ["/tools/compress-pdf/?targetSize=500kb", "compress-pdf"],
  ["/pdf-must-be-under-10mb/", "compress-pdf"],
  ["/tools/compress-image-to-kb/?targetKb=100", "compress-image-to-kb"],
  ["/tools/convert-image/", "convert-image"],
  ["/tools/resize-image/", "resize-image"],
  ["/tools/pdf-to-images/", "pdf-to-images"],
  ["/tools/image-to-pdf/", "image-to-pdf"],
  ["/photo-200x230-20kb/", "resize-image"],
  ["/photo-200x230-100kb/", "resize-image"],
  ["/photo-240x320-50kb/", "resize-image"],
  ["/photo-295x413-35kb/", "resize-image"],
  ["/photo-413x531-100kb/", "resize-image"],
  ["/photo-413x531-50kb/", "resize-image"],
  ["/photo-354x472-100kb/", "resize-image"],
  ["/photo-300x300-100kb/", "resize-image"],
  ["/photo-600x600-100kb/", "resize-image"],
  ["/photo-480x640-200kb/", "resize-image"],
  ["/photo-512x512-100kb/", "resize-image"],
  ["/photo-150x200-20kb/", "resize-image"],
  ["/photo-180x240-50kb/", "resize-image"],
  ["/photo-400x514-100kb/", "resize-image"],
  ["/photo-600x800-200kb/", "resize-image"],
  ["/photo-120x160-20kb/", "resize-image"],
  ["/photo-160x200-30kb/", "resize-image"],
  ["/photo-300x400-100kb/", "resize-image"],
  ["/photo-350x450-100kb/", "resize-image"],
  ["/photo-360x480-100kb/", "resize-image"],
  ["/photo-420x560-200kb/", "resize-image"],
  ["/signature-140x60-20kb/", "resize-image"],
  ["/signature-140x60-50kb/", "resize-image"],
  ["/signature-150x50-20kb/", "resize-image"],
  ["/signature-160x70-20kb/", "resize-image"],
  ["/signature-200x50-20kb/", "resize-image"],
  ["/signature-200x100-50kb/", "resize-image"],
  ["/signature-250x80-50kb/", "resize-image"],
  ["/signature-300x60-20kb/", "resize-image"],
  ["/signature-300x80-50kb/", "resize-image"],
  ["/signature-300x100-50kb/", "resize-image"],
  ["/signature-400x150-50kb/", "resize-image"],
  ["/signature-100x50-10kb/", "resize-image"],
  ["/signature-200x60-20kb/", "resize-image"],
  ["/signature-256x64-20kb/", "resize-image"],
  ["/signature-400x200-100kb/", "resize-image"],
];
const PUBLIC_ENTRY_FILES = [
  ["Homepage", "index.html"],
  ["Free PDF tools", path.join("free-pdf-tools", "index.html")],
  ["Tools index", path.join("tools", "index.html")],
  ["PDF tool finder", path.join("pdf-tool-finder", "index.html")],
  ["Directory submission pack", path.join("submit-directory", "index.html")],
  ["RSS feed", "feed.xml"],
  ["Sitemap", "sitemap.xml"],
  ["Tools JSON", "tools.json"],
  ["Discovery JSON", "discovery.json"],
];

function hasPrefilledSponsorReplyUrl(text) {
  return (
    text.includes("github.com/yanqr213/printable-tools-lab/issues/new?") &&
    text.includes("body=Public-safe+sponsor+reply") &&
    text.includes("labels=sponsor%2Cpartner%2Cbusiness-review") &&
    !text.includes("template=sponsor-partner-inquiry.yml")
  );
}

function requireGithubPagesIntentTracking(html, label, events = []) {
  if (!html.includes(GITHUB_PAGES_EVENT_ENDPOINT)) failures.push(`${label} missing GitHub Pages event endpoint.`);
  if (!html.includes('source: "github-pages"')) failures.push(`${label} missing github-pages source tracking.`);
  if (!html.includes('sendEvent("page_view", "site")')) failures.push(`${label} missing GitHub Pages page_view tracking.`);
  for (const event of events) {
    if (!html.includes(`data-track-event="${event}"`)) failures.push(`${label} missing ${event} tracking hook.`);
  }
}

function requireUploadLimitShortcuts(html, label) {
  if (!html.includes("Fast upload limit shortcuts")) failures.push(`${label} missing upload limit shortcut section.`);
  if (!html.includes("Upload message") || !html.includes("PDF must be under 1MB") || !html.includes("Wrong image dimensions")) failures.push(`${label} missing upload limit decision table.`);
  if (!html.includes("Upload error text") || !html.includes("Local text match only") || !html.includes("data-upload-limit-helper")) failures.push(`${label} missing upload error matcher.`);
  if (!html.includes("data-upload-limit-tool-link")) failures.push(`${label} missing stable upload matcher tool-link marker.`);
  if (!html.includes("data-upload-fix-plan-jump") || !html.includes("Need a $9 fix plan?")) failures.push(`${label} missing direct upload matcher $9 fix-plan CTA.`);
  if (!html.includes("PDF must be less than 1 MB") || !html.includes("Invalid file type. Please upload JPG or PNG")) failures.push(`${label} missing upload matcher examples.`);
  if (!html.includes('data-track-event="free_tool_depth"')) failures.push(`${label} missing upload limit depth tracking.`);
  if (!html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes("Request $9 invoice link") || !html.includes('data-service-primary-invoice-request="true"') || !html.includes('data-track-event="service_invoice_request"') || !html.includes("/upload-limit-fix-plan/?utm_source=upload-limit") || !html.includes("No file upload")) failures.push(`${label} missing primary $9 upload fix invoice request path.`);
  if (!html.includes("data-upload-fix-plan-form") || !html.includes("data-upload-fix-plan-summary") || !html.includes("Request note updated from the upload error matcher.")) failures.push(`${label} missing upload matcher paid-request prefill path.`);
  for (const pathName of UPLOAD_LIMIT_SHORTCUT_PATHS) {
    if (!html.includes(pathName)) failures.push(`${label} missing upload limit shortcut: ${pathName}`);
  }
  for (const [href, trackTool] of UPLOAD_LIMIT_DECISION_LINKS) {
    if (!html.includes(`href="${href}"`)) failures.push(`${label} missing upload limit decision link: ${href}`);
    if (!html.includes(`data-track-tool="${trackTool}"`)) failures.push(`${label} missing upload limit tool tracking: ${trackTool}`);
  }
  if (html.includes('data-track-event="free_tool_depth" data-track-tool="site"')) failures.push(`${label} has generic upload limit depth tracking.`);
}

function requireNoDirectInternalEntryLinks(text, label) {
  const checks = [
    ["/ops/", "ops monitor"],
    [siteUrl("ops"), "ops monitor"],
    ["/dashboard/", "dashboard"],
    [siteUrl("dashboard"), "dashboard"],
    ["/sponsor-proposal/", "direct sponsor proposal"],
    [siteUrl("sponsor-proposal"), "direct sponsor proposal"],
  ];
  for (const [needle, name] of checks) {
    if (text.includes(needle)) failures.push(`${label} exposes ${name} from a public entry file.`);
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
  if (html.includes('href="/ops/') || html.includes("href='/ops/")) failures.push(`Public route exposes ops monitor link: ${route.path || "/"}`);
  if (html.includes('href="/dashboard/') || html.includes("href='/dashboard/")) failures.push(`Public route exposes dashboard link: ${route.path || "/"}`);
  if (html.includes('href="/sponsor-proposal') || html.includes("href='/sponsor-proposal")) failures.push(`Public route exposes direct sponsor proposal link: ${route.path || "/"}`);
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

for (const [label, relativePath] of PUBLIC_ENTRY_FILES) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) {
    failures.push(`Missing public entry file: ${relativePath}`);
    continue;
  }
  requireNoDirectInternalEntryLinks(fs.readFileSync(file, "utf8"), label);
}

const homeFile = path.join(root, "index.html");
if (!fs.existsSync(homeFile)) failures.push("Missing homepage.");
else {
  const html = fs.readFileSync(homeFile, "utf8");
  requireUploadLimitShortcuts(html, "Homepage");
  if (!html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes("Request $9 invoice link") || !html.includes('data-service-primary-invoice-request="true"') || !html.includes("/upload-limit-fix-plan/?utm_source=upload-limit")) failures.push("Homepage upload-limit shortcuts missing primary $9 upload fix invoice request form.");
  if (!html.includes('data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="/upload-limit-fix-plan/?utm_source=home&utm_medium=site&utm_campaign=upload_limit_fix_plan&utm_content=hero#invoice-request"') || !html.includes('data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="/upload-limit-fix-plan/?utm_source=home&utm_medium=site&utm_campaign=upload_limit_fix_plan&utm_content=validation-band#invoice-request"')) failures.push("Homepage should route existing traffic directly to the $9 upload-fix invoice request path.");
  if (!html.includes("Request $19 follow-up copy") || !html.includes("Made an invoice? Get the follow-up sequence written for $19.")) failures.push("Homepage missing above-fold invoice follow-up service offer.");
  if (!html.includes('data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack"')) failures.push("Homepage invoice follow-up offer missing service intent tracking.");
  if (!html.includes("/invoice-followup-copy-pack/?utm_source=home&utm_medium=site&utm_campaign=invoice_followup_service&utm_content=hero#service-request")) failures.push("Homepage hero should route to invoice follow-up service fit check.");
  if (!html.includes('home-invoice-lead-form invoice-micro-lead-form') || !html.includes('data-lead-path="/"') || !html.includes('data-utm-content="homepage-inline"') || !html.includes('name="requestSummary"') || !html.includes("Send $19 sequence request")) failures.push("Homepage missing one-field invoice follow-up paid request form.");
  if (!html.includes("/invoice-followup-copy-pack/?utm_source=home&utm_medium=site&utm_campaign=invoice_followup_service&utm_content=inline-secondary#service-request")) failures.push("Homepage close band should keep a full invoice follow-up service page link.");
  if (!html.includes("Payment happens only through a real external checkout or invoice after fit is confirmed.")) failures.push("Homepage paid service offer missing external-payment safety gate.");
}

const docsSellerIndexFile = path.join(root, "docs", "index.html");
if (!fs.existsSync(docsSellerIndexFile)) failures.push("Missing GitHub Pages discovery index.");
else {
  const html = fs.readFileSync(docsSellerIndexFile, "utf8");
  if (!html.includes("Free file tools first")) failures.push("GitHub Pages directory missing free-tool CTA.");
  if (html.includes(MARKET_TABLE_PRINT_AUDIT.slug)) failures.push("GitHub Pages directory should keep service audit out of the main free-tool directory CTA.");
  if (!html.includes("free_tool_depth")) failures.push("GitHub Pages directory missing free-tool depth link.");
  if (!html.includes("Browse more free tools")) failures.push("GitHub Pages directory missing free-tool browse CTA.");
  if (!html.includes("Future ads must stay separated from generator controls")) failures.push("GitHub Pages directory missing ad-safe download copy.");
  if (html.includes(`Copy the $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup request`)) failures.push("GitHub Pages directory should not promote paid setup in the main free-tool CTA.");
  requireGithubPagesIntentTracking(html, "GitHub Pages directory", ["free_tool_depth"]);
}

const docsLandingMirrorFile = path.join(root, "docs", "free-invoice-generator-no-signup", "index.html");
if (!fs.existsSync(docsLandingMirrorFile)) failures.push("Missing GitHub Pages invoice landing mirror.");
else {
  const html = fs.readFileSync(docsLandingMirrorFile, "utf8");
  if (!html.includes("Free file tools first")) failures.push("GitHub Pages landing mirror missing free-tool CTA.");
  if (html.includes(MARKET_TABLE_PRINT_AUDIT.slug)) failures.push("GitHub Pages landing mirror should keep service audit out of the main free-tool CTA.");
  if (!html.includes("free_tool_depth")) failures.push("GitHub Pages landing mirror missing free-tool depth link.");
  if (!html.includes("Browse more free tools")) failures.push("GitHub Pages landing mirror missing free-tool browse CTA.");
  if (html.includes(`Copy the $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup request`)) failures.push("GitHub Pages landing mirror should not promote paid setup in the main free-tool CTA.");
  requireGithubPagesIntentTracking(html, "GitHub Pages landing mirror", ["free_tool_depth"]);
}

const docsToolMirrorFile = path.join(root, "docs", "tools", "invoice-generator", "index.html");
if (!fs.existsSync(docsToolMirrorFile)) failures.push("Missing GitHub Pages invoice tool mirror.");
else {
  const html = fs.readFileSync(docsToolMirrorFile, "utf8");
  if (!html.includes("Free file tools first")) failures.push("GitHub Pages tool mirror missing free-tool CTA.");
  if (html.includes(MARKET_TABLE_PRINT_AUDIT.slug)) failures.push("GitHub Pages tool mirror should keep service audit out of the main free-tool CTA.");
  if (!html.includes("free_tool_depth")) failures.push("GitHub Pages tool mirror missing free-tool depth link.");
  if (!html.includes("Browse more free tools")) failures.push("GitHub Pages tool mirror missing free-tool browse CTA.");
  if (html.includes(`Copy the $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup request`)) failures.push("GitHub Pages tool mirror should not promote paid setup in the main free-tool CTA.");
  requireGithubPagesIntentTracking(html, "GitHub Pages tool mirror", ["free_tool_depth"]);
}

const sponsorFile = path.join(root, "sponsor", "index.html");
if (!fs.existsSync(sponsorFile)) failures.push("Missing sponsor inquiry page.");
else {
  const html = fs.readFileSync(sponsorFile, "utf8");
  if (!html.includes("Sponsor PrintableTools Lab")) failures.push("Sponsor page missing headline.");
  if (!html.includes('data-track-event="sponsor_request_intent"')) failures.push("Sponsor page missing sponsor intent tracking.");
  if (!html.includes('data-track-tool="sponsor"')) failures.push("Sponsor page missing sponsor tool tracking.");
  if (!html.includes('data-sponsor-lead-form')) failures.push("Sponsor page missing lead capture form.");
  if (!html.includes('data-sponsor-quick-form') || !html.includes("sponsor-micro-lead-form") || !html.includes("Send USD 49 invoice review request")) failures.push("Sponsor page missing fast USD 49 invoice review form.");
  if (!html.includes('data-sponsor-quick-deal') || !html.includes("One-field USD 49 invoice review")) failures.push("Sponsor page missing hidden quick pilot deal selector.");
  if (!html.includes("Fastest paid pilot path") || !html.includes("Use USD 49 starter review")) failures.push("Sponsor page missing fastest paid pilot path.");
  if (!html.includes('/sponsor-starter-review/?utm_source=sponsor-page') || !html.includes("Start USD 49 review form") || !html.includes("#sponsor-quick-form")) failures.push("Sponsor page hero should point to the fast USD 49 starter review form.");
  if (!html.includes("Open USD 49 invoice request") || !html.includes("data-sponsor-public-invoice-request")) failures.push("Sponsor page missing primary public USD 49 invoice request CTA.");
  if (!html.includes('option value="starter-fit-review" selected')) failures.push("Sponsor page should default quick pilot to USD 49 starter fit review.");
  if (!html.includes("Send one business-safe field") || !html.includes("Website (optional)") || !html.includes("website is optional and can be inferred from the email domain")) failures.push("Sponsor page quick invoice form should require only a business email.");
  if (!html.includes("Public-safe reply form") || !hasPrefilledSponsorReplyUrl(html)) failures.push("Sponsor page missing prefilled public-safe reply fallback.");
  if (!html.includes('name="contactEmail"')) failures.push("Sponsor page missing business email field.");
  if (!html.includes('name="budgetRange"')) failures.push("Sponsor page missing budget range field.");
  if (!html.includes('name="commitment"') || !html.includes("Request pilot invoice")) failures.push("Sponsor page missing invoice request next-step field.");
  if (!html.includes("public dashboards show only aggregate lead counts")) failures.push("Sponsor page missing private lead/public metric note.");
  if (!html.includes("Early sponsor pilots")) failures.push("Sponsor page missing early sponsor pilot pricing.");
  if (!html.includes("USD 99-149 pilot")) failures.push("Sponsor page missing guide sponsorship pilot price anchor.");
  if (!html.includes("Sponsor pages by audience")) failures.push("Sponsor page missing vertical sponsor page links.");
  if (!html.includes("/sponsor-media-kit.json")) failures.push("Sponsor page missing sponsor media kit link.");
  if (!html.includes("/sponsor-outreach-pack.json")) failures.push("Sponsor page missing sponsor outreach pack link.");
  if (!html.includes("Downloads stay free")) failures.push("Sponsor page missing free-download placement rule.");
  if (!sitemap.includes(`<loc>${siteUrl("sponsor")}</loc>`)) failures.push("Sitemap missing sponsor page.");
}

const sponsorCallFile = path.join(root, "sponsor-call", "index.html");
if (!fs.existsSync(sponsorCallFile)) failures.push("Missing sponsor call page.");
else {
  const html = fs.readFileSync(sponsorCallFile, "utf8");
  if (!html.includes("Sponsor call: privacy-friendly file and printable workflows")) failures.push("Sponsor call page missing headline.");
  if (!html.includes("Current sponsor openings")) failures.push("Sponsor call page missing current openings.");
  if (!html.includes("Audience-specific sponsor pages")) failures.push("Sponsor call page missing vertical sponsor links.");
  if (!html.includes("/sponsor-starter-review/")) failures.push("Sponsor call page missing starter sponsor review path.");
  if (!html.includes("Request USD 49 invoice review") || !html.includes("utm_source=sponsor-call") || !html.includes("commitment=request-invoice")) failures.push("Sponsor call page should lead with the USD 49 invoice review path.");
  if (!html.includes("/sponsor-deal-room/")) failures.push("Sponsor call page missing deal room link.");
  if (!html.includes('data-track-event="sponsor_request_intent"')) failures.push("Sponsor call page missing sponsor intent tracking.");
  if (!html.includes("sponsor-call.json")) failures.push("Sponsor call page should reference machine-readable JSON.");
  if (!sitemap.includes(`<loc>${siteUrl("sponsor-call")}</loc>`)) failures.push("Sitemap missing sponsor call page.");
}

const sponsorStarterReviewFile = path.join(root, "sponsor-starter-review", "index.html");
if (!fs.existsSync(sponsorStarterReviewFile)) failures.push("Missing starter sponsor review page.");
else {
  const html = fs.readFileSync(sponsorStarterReviewFile, "utf8");
  if (!html.includes("USD 49 starter sponsor review for PrintableTools Lab")) failures.push("Starter sponsor review page missing headline.");
  if (!html.includes("Starter fit review") || !html.includes("USD 49")) failures.push("Starter sponsor review page missing default deal and price.");
  if (!html.includes("What the USD 49 review covers")) failures.push("Starter sponsor review page missing review scope.");
  if (!html.includes("One-field USD 49 invoice review") || !html.includes("private form needs only a business email")) failures.push("Starter sponsor review page missing one-field intake copy.");
  if (!html.includes("Open USD 49 invoice request") || !html.includes("data-sponsor-public-invoice-request")) failures.push("Starter sponsor review page missing primary public USD 49 invoice request CTA.");
  if (!html.includes('id="sponsor-quick-form"') || !html.includes("Send USD 49 invoice review request") || !html.includes("Open public request instead")) failures.push("Starter sponsor review page missing anchored fast USD 49 request form.");
  if (html.indexOf('data-sponsor-quick-form') > html.indexOf("<h2>Starter fit review</h2>")) failures.push("Starter sponsor review page should place the quick sponsor form before explanatory deal cards.");
  if (!html.includes('data-sponsor-quick-form') || !html.includes('data-sponsor-lead-form')) failures.push("Starter sponsor review page missing sponsor lead forms.");
  if (!html.includes('option value="starter-fit-review" selected')) failures.push("Starter sponsor review page should default quick pilot to USD 49 starter fit review.");
  if (!html.includes('data-sponsor-deal-select') || !html.includes('data-sponsor-commitment="request-invoice"')) failures.push("Starter sponsor review page missing request-invoice prefill.");
  if (!html.includes("Public-safe reply") || !hasPrefilledSponsorReplyUrl(html)) failures.push("Starter sponsor review page missing prefilled public-safe reply fallback.");
  if (!html.includes("/sponsor-deal-room.json") || !html.includes("/sponsor-media-kit.json")) failures.push("Starter sponsor review page missing sponsor JSON proof links.");
  if (!html.includes("No payment is collected on this page") || !html.includes("settled external payment")) failures.push("Starter sponsor review page missing external payment/revenue gate.");
  if (html.includes('href="/ops/') || html.includes("href='/ops/")) failures.push("Starter sponsor review page should not expose ops monitor.");
  if (!sitemap.includes(`<loc>${siteUrl("sponsor-starter-review")}</loc>`)) failures.push("Sitemap missing starter sponsor review page.");
}

const sponsorDealRoomFile = path.join(root, "sponsor-deal-room", "index.html");
if (!fs.existsSync(sponsorDealRoomFile)) failures.push("Missing sponsor deal room page.");
else {
  const html = fs.readFileSync(sponsorDealRoomFile, "utf8");
  if (!html.includes("Sponsor deal room for PrintableTools Lab")) failures.push("Sponsor deal room missing headline.");
  if (!html.includes("Available pilot deals")) failures.push("Sponsor deal room missing pilot deals.");
  if (!html.includes("Best-fit sponsor categories")) failures.push("Sponsor deal room missing sponsor categories.");
  if (!html.includes("What happens before money counts")) failures.push("Sponsor deal room missing money-count process.");
  if (!html.includes("sponsor-deal-room.json")) failures.push("Sponsor deal room missing JSON link.");
  if (!html.includes('data-sponsor-lead-form')) failures.push("Sponsor deal room missing lead capture form.");
  if (!html.includes('data-sponsor-quick-form') || !html.includes("sponsor-micro-lead-form")) failures.push("Sponsor deal room missing fast invoice review form.");
  if (!html.includes('data-sponsor-quick-deal') || !html.includes("One-field USD 49 invoice review")) failures.push("Sponsor deal room missing quick pilot deal selector.");
  if (!html.includes("Fastest paid pilot path") || !html.includes("Use USD 49 starter review")) failures.push("Sponsor deal room missing fastest paid pilot path.");
  if (!html.includes('option value="starter-fit-review" selected')) failures.push("Sponsor deal room should default quick pilot to USD 49 starter fit review.");
  if (!html.includes("Send one business-safe field") || !html.includes("Public-safe reply form")) failures.push("Sponsor deal room missing lower-friction quick lead fallback.");
  if (!html.includes('data-sponsor-deal-select')) failures.push("Sponsor deal room missing deal prefill buttons.");
  if (!html.includes('name="dealId"')) failures.push("Sponsor deal room form missing selected deal field.");
  if (!html.includes('name="commitment"')) failures.push("Sponsor deal room form missing commitment next-step field.");
  if (!html.includes("data-sponsor-budget-range")) failures.push("Sponsor deal room missing budget prefill data.");
  if (!html.includes('data-sponsor-commitment="request-invoice"')) failures.push("Sponsor deal room missing request-invoice deal prefill data.");
  if (!html.includes("commitment=request-invoice")) failures.push("Sponsor deal room deal links should prefill invoice requests.");
  if (!html.includes("Copy-ready pilot request") || !html.includes("Copy invoice request")) failures.push("Sponsor deal room missing low-friction invoice request copy.");
  if (!html.includes('data-track-event="sponsor_request_intent"')) failures.push("Sponsor deal room missing sponsor intent tracking.");
  if (!SPONSOR_DEALS.every((deal) => html.includes(deal.title) && html.includes(deal.price))) failures.push("Sponsor deal room missing one or more deal offers.");
  if (!html.includes("Revenue is real only after a sponsor agreement or settled external payment")) failures.push("Sponsor deal room missing revenue gate.");
  if (!sitemap.includes(`<loc>${siteUrl("sponsor-deal-room")}</loc>`)) failures.push("Sitemap missing sponsor deal room page.");
}

const sponsorProposalFile = path.join(root, "sponsor-proposal", "index.html");
if (!fs.existsSync(sponsorProposalFile)) failures.push("Missing sponsor proposal route.");
else {
  const html = fs.readFileSync(sponsorProposalFile, "utf8");
  if (!html.includes('content="noindex,follow"')) failures.push("Sponsor proposal page should be noindex.");
  if (!html.includes("Sponsor proposal")) failures.push("Sponsor proposal route missing fallback heading.");
  if (!hasPrefilledSponsorReplyUrl(html) || !html.includes("Open public invoice request") || !html.includes("data-sponsor-public-invoice-request")) failures.push("Sponsor proposal route missing prefilled public invoice request fallback.");
  if (!html.includes("Use one-field review form") || !html.includes("#sponsor-quick-form")) failures.push("Sponsor proposal route missing fast review form CTA.");
  if (!html.includes("sponsor-micro-lead-form") || !html.includes("One-field USD 49 invoice review") || !html.includes("Website (optional)")) failures.push("Sponsor proposal route missing one-field sponsor lead form fallback.");
  if (sitemap.includes(`<loc>${siteUrl("sponsor-proposal")}</loc>`)) failures.push("Sitemap should not include noindex sponsor proposal page.");
}

for (const routePath of ["dashboard", "ops"]) {
  const file = path.join(root, routePath, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing internal route: ${routePath}.`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes('<body class="internal-route">')) failures.push(`${routePath} should use internal route chrome.`);
  if (html.includes("site-header") || html.includes("top-nav") || html.includes("site-footer")) failures.push(`${routePath} should not render public site navigation chrome.`);
  const expectedRobots = routePath === "ops" ? "noindex,nofollow" : "noindex,follow";
  if (!html.includes(`content="${expectedRobots}"`)) failures.push(`${routePath} should be ${expectedRobots}.`);
  if (sitemap.includes(`<loc>${siteUrl(routePath)}</loc>`)) failures.push(`Sitemap should not include noindex internal route: ${routePath}.`);
  if (routePath === "ops" && (!html.includes("/sponsor-starter-review/?utm_source=ops") || !html.includes("Open invoice review form"))) failures.push("Ops monitor should route sponsor close work to the invoice review form.");
  if (routePath === "ops" && (!html.includes("/api/ops-metrics") || !html.includes("Project detail rows") || !html.includes("Source breakdown") || !html.includes("Tool and game signal snapshot") || !html.includes("Path breakdown") || !html.includes("/polite-payment-reminder-email/") || !html.includes("/freelance-invoice-follow-up-email/"))) failures.push("Ops monitor should render detailed project traffic sections and high-intent path funnel access.");
  if (routePath === "ops" && (!html.includes("Public-safe sponsor reply evidence") || !html.includes("public invoice issues"))) failures.push("Ops monitor should surface public-safe sponsor reply evidence.");
  if (routePath === "ops" && (!html.includes("Next sponsor submissions") || !html.includes("Open email draft") || !html.includes("Copy message"))) failures.push("Ops monitor should expose an internal next sponsor submission queue.");
  if (routePath === "ops") {
    const directoryMonitorReport = readJsonFile(path.join(root, "reports", "directory-monitor.json"), {});
    const listedCount = Number(directoryMonitorReport.listedCount || 0);
    if (listedCount && html.includes("External discovery proof:") && !html.includes(`External discovery proof: ${listedCount} public directory listing(s)`)) failures.push("Ops monitor sponsor submission copy should use the latest directory listing proof count.");
  }
  if (routePath === "ops" && (!html.includes("External payment link readiness") || !html.includes("Copy config command") || !html.includes("sellerKitCheckoutUrl") || !html.includes("customPrintPackCheckoutUrl") || !html.includes("invoiceFollowupCheckoutUrl") || !html.includes("uploadLimitFixPlanCheckoutUrl"))) failures.push("Ops monitor should expose internal per-SKU checkout activation readiness.");
  if (routePath === "ops" && (!html.includes("$9 Upload Fix invoice close queue") || !html.includes("data-upload-fix-invoice-close-queue") || !html.includes("Copy $9 payment reply") || !html.includes("Copy triage checklist") || !html.includes("missing uploadLimitFixPlanCheckoutUrl"))) failures.push("Ops monitor should expose the dedicated $9 upload-fix invoice close queue.");
  if (routePath === "ops" && (!html.includes("Lead-to-payment close cockpit") || !html.includes("Copy payment reply") || !html.includes("Copy export command") || !html.includes("paid_order_verified from external provider"))) failures.push("Ops monitor should expose internal lead-to-payment close actions.");
}

const headersFile = path.join(root, "_headers");
if (!fs.existsSync(headersFile)) failures.push("Missing _headers file.");
else {
  const headers = fs.readFileSync(headersFile, "utf8");
  if (!/\/ops\/\s+X-Robots-Tag: noindex, nofollow/.test(headers)) failures.push("_headers should mark /ops/ noindex and nofollow.");
  if (!/\/ops\/\*\s+X-Robots-Tag: noindex, nofollow/.test(headers)) failures.push("_headers should mark /ops/* noindex and nofollow.");
  if (!/\/dashboard\/\s+X-Robots-Tag: noindex, nofollow/.test(headers)) failures.push("_headers should mark /dashboard/ noindex and nofollow.");
  if (!/\/dashboard\/\*\s+X-Robots-Tag: noindex, nofollow/.test(headers)) failures.push("_headers should mark /dashboard/* noindex and nofollow.");
}

const sponsorOpportunitiesFile = path.join(root, "sponsor-opportunities", "index.html");
if (!fs.existsSync(sponsorOpportunitiesFile)) failures.push("Missing sponsor opportunities page.");
else {
  const html = fs.readFileSync(sponsorOpportunitiesFile, "utf8");
  if (!html.includes("Sponsor opportunities for free PDF, image, and QR workflows")) failures.push("Sponsor opportunities page missing headline.");
  if (!html.includes("Open sponsor audiences")) failures.push("Sponsor opportunities page missing audience board.");
  if (!html.includes("Sponsor prospect paths")) failures.push("Sponsor opportunities page missing prospect paths.");
  if (!html.includes("Good-fit sponsor categories")) failures.push("Sponsor opportunities page missing categories.");
  if (!html.includes("sponsor-opportunities.json")) failures.push("Sponsor opportunities page missing JSON link.");
  if (!html.includes("sponsor-intent-feed.json")) failures.push("Sponsor opportunities page missing sponsor intent feed link.");
  if (!html.includes("utm_source=sponsor-opportunities")) failures.push("Sponsor opportunities page missing tracked source.");
  if (!html.includes("Request USD 49 invoice review") || !html.includes("sponsor_starter_review") || !html.includes("commitment=request-invoice")) failures.push("Sponsor opportunities page should lead with the USD 49 invoice review path.");
  if (!html.includes("Views and clicks alone are not revenue")) failures.push("Sponsor opportunities page missing revenue gate.");
  if (!sitemap.includes(`<loc>${siteUrl("sponsor-opportunities")}</loc>`)) failures.push("Sitemap missing sponsor opportunities page.");
}

for (const vertical of SPONSOR_VERTICALS) {
  const file = path.join(root, "sponsor", vertical.slug, "index.html");
  const label = `Sponsor vertical ${vertical.slug}`;
  if (!fs.existsSync(file)) {
    failures.push(`Missing ${label}.`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(vertical.title)) failures.push(`${label} missing title.`);
  if (!html.includes("Audience fit")) failures.push(`${label} missing audience fit section.`);
  if (!html.includes("Pilot offer")) failures.push(`${label} missing pilot offer section.`);
  if (!html.includes(vertical.priceHint)) failures.push(`${label} missing price hint.`);
  if (!html.includes('data-sponsor-lead-form')) failures.push(`${label} missing lead capture form.`);
  if (!html.includes('data-sponsor-quick-form')) failures.push(`${label} missing fast invoice review form.`);
  if (!html.includes("Fastest paid pilot path") || !html.includes("Use USD 49 starter review")) failures.push(`${label} missing fastest paid pilot path.`);
  if (!html.includes('option value="starter-fit-review" selected')) failures.push(`${label} should default quick pilot to USD 49 starter fit review.`);
  if (!html.includes('data-track-event="sponsor_request_intent"')) failures.push(`${label} missing sponsor intent tracking.`);
  if (!html.includes("Revenue counts only after a signed agreement or settled external payment")) failures.push(`${label} missing revenue gate copy.`);
  if (!html.includes("Good-fit sponsor categories")) failures.push(`${label} missing sponsor categories.`);
  if (!sitemap.includes(`<loc>${siteUrl(`sponsor/${vertical.slug}`)}</loc>`)) failures.push(`Sitemap missing ${label}.`);
}

const sponsorMediaKitFile = path.join(root, "sponsor-media-kit.json");
if (!fs.existsSync(sponsorMediaKitFile)) failures.push("Missing sponsor-media-kit.json.");
else {
  const data = JSON.parse(fs.readFileSync(sponsorMediaKitFile, "utf8"));
  if (!Array.isArray(data.placements) || data.placements.length < 3) failures.push("Sponsor media kit missing placement options.");
  if (!Array.isArray(data.outreachTargets) || data.outreachTargets.length < 4) failures.push("Sponsor media kit missing outreach target categories.");
  if (!Array.isArray(data.verticalSponsorPages) || data.verticalSponsorPages.length < 5) failures.push("Sponsor media kit missing vertical sponsor pages.");
  if (!data.externalDiscoveryProof || Number(data.externalDiscoveryProof.directoryListedCount || 0) < 4) failures.push("Sponsor media kit missing public external discovery proof.");
  if (JSON.stringify(data.externalDiscoveryProof || {}).includes("/ops/")) failures.push("Sponsor media kit external discovery proof should not expose operations routes.");
  if (Object.prototype.hasOwnProperty.call(data, "metricsDashboard")) failures.push("Sponsor media kit JSON should not expose the direct dashboard URL.");
  if (!String(data.moneyGate || "").includes("settled payment")) failures.push("Sponsor media kit missing revenue money gate.");
}

const sponsorOutreachPackFile = path.join(root, "sponsor-outreach-pack.json");
if (!fs.existsSync(sponsorOutreachPackFile)) failures.push("Missing sponsor-outreach-pack.json.");
else {
  const data = JSON.parse(fs.readFileSync(sponsorOutreachPackFile, "utf8"));
  if (!data.sponsorDealRoom || data.sponsorDealRoom.page !== siteUrl("sponsor-deal-room")) failures.push("Sponsor outreach pack missing sponsor deal room.");
  if (data.sponsorIntentFeed !== siteUrl("sponsor-intent-feed.json").replace(/\/$/, "")) failures.push("Sponsor outreach pack missing sponsor intent feed.");
  if (!String(data.starterReview?.invoiceReviewUrl || "").includes("sponsor-starter-review")) failures.push("Sponsor outreach pack missing starter invoice review URL.");
  if (!Array.isArray(data.templates) || data.templates.length < 3) failures.push("Sponsor outreach pack missing copy templates.");
  if (!Array.isArray(data.verticalSponsorPages) || data.verticalSponsorPages.length < 5) failures.push("Sponsor outreach pack missing vertical sponsor pages.");
  if (!Array.isArray(data.prospectPaths) || data.prospectPaths.length < SPONSOR_VERTICALS.length) failures.push("Sponsor outreach pack missing prospect paths.");
  if (!data.externalDiscoveryProof || Number(data.externalDiscoveryProof.directoryListedCount || 0) < 4) failures.push("Sponsor outreach pack missing public external discovery proof.");
  if (JSON.stringify(data).includes("/ops/")) failures.push("Sponsor outreach pack should not expose operations monitor URL.");
  if (!Array.isArray(data.trackedLinks) || data.trackedLinks.length < 10) failures.push("Sponsor outreach pack missing vertical tracked links.");
  if (!String(data.successGate || "").includes("settled payment")) failures.push("Sponsor outreach pack missing settled-payment success gate.");
}

const sponsorDealRoomJsonFile = path.join(root, "sponsor-deal-room.json");
if (!fs.existsSync(sponsorDealRoomJsonFile)) failures.push("Missing sponsor-deal-room.json.");
else {
  const data = JSON.parse(fs.readFileSync(sponsorDealRoomJsonFile, "utf8"));
  if (data.canonical !== siteUrl("sponsor-deal-room")) failures.push("Sponsor deal room JSON missing canonical URL.");
  if (!Array.isArray(data.deals) || data.deals.length !== SPONSOR_DEALS.length) failures.push("Sponsor deal room JSON missing deals.");
  if (Object.prototype.hasOwnProperty.call(data, "metrics")) failures.push("Sponsor deal room JSON should not expose the direct dashboard URL.");
  if (Object.prototype.hasOwnProperty.call(data, "operations")) failures.push("Sponsor deal room JSON should not expose the operations monitor URL.");
  if (!String(data.inquiryUrl || "").includes("utm_source=sponsor-outreach")) failures.push("Sponsor deal room JSON missing tracked inquiry URL.");
  if (!String(data.moneyGate || "").includes("settled external payment")) failures.push("Sponsor deal room JSON missing money gate.");
}

const cloudflareDeployScriptFile = path.join(root, "scripts", "deploy-cloudflare-safe.cjs");
if (fs.existsSync(cloudflareDeployScriptFile)) {
  const deployScript = fs.readFileSync(cloudflareDeployScriptFile, "utf8");
  if (!deployScript.includes("sponsor-deal-room\\.json")) failures.push("Cloudflare safe deploy allowlist missing sponsor-deal-room.json.");
  if (!deployScript.includes("sponsor-intent-feed\\.json")) failures.push("Cloudflare safe deploy allowlist missing sponsor-intent-feed.json.");
  if (!deployScript.includes("functions/api/service-lead.js")) failures.push("Cloudflare safe deploy required files missing service lead function.");
}

const indexNowScriptFile = path.join(root, "scripts", "indexnow.cjs");
if (!fs.existsSync(indexNowScriptFile)) failures.push("Missing IndexNow submission script.");
else {
  const indexNowScript = fs.readFileSync(indexNowScriptFile, "utf8");
  for (const route of ["upload-error-cheatsheet", "upload-limit-fix-plan", "invoice-followup-copy-pack", "image-dimensions-600x600", "pdf-not-accepted-jpg-required", "email-attachment-too-large", "pdf-must-be-under-100kb", "pdf-must-be-under-200kb", "pdf-must-be-under-300kb", "pdf-must-be-under-10mb", "compress-pdf-to-100kb", "compress-pdf-to-200kb", "compress-pdf-to-300kb", "compress-pdf-to-10mb", "photo-120x160-20kb", "photo-160x200-30kb", "photo-300x400-100kb", "photo-350x450-100kb", "photo-360x480-100kb", "photo-420x560-200kb"]) {
    if (!indexNowScript.includes(`siteUrl("${route}")`)) failures.push(`IndexNow priority list missing ${route}.`);
  }
}

const sponsorCallJsonFile = path.join(root, "sponsor-call.json");
if (!fs.existsSync(sponsorCallJsonFile)) failures.push("Missing sponsor-call.json.");
else {
  const data = JSON.parse(fs.readFileSync(sponsorCallJsonFile, "utf8"));
  if (!Array.isArray(data.actions) || data.actions.length < 3) failures.push("Sponsor call JSON missing actions.");
  if (!Array.isArray(data.verticalSponsorPages) || data.verticalSponsorPages.length < 5) failures.push("Sponsor call JSON missing vertical sponsor pages.");
  if (!String(data.replyPath || "").includes("sponsor inquiry form")) failures.push("Sponsor call JSON missing reply path.");
  if (!String(data.successGate || "").includes("settled external payment")) failures.push("Sponsor call JSON missing success gate.");
}

const sponsorOpportunitiesJsonFile = path.join(root, "sponsor-opportunities.json");
if (!fs.existsSync(sponsorOpportunitiesJsonFile)) failures.push("Missing sponsor-opportunities.json.");
else {
  const data = JSON.parse(fs.readFileSync(sponsorOpportunitiesJsonFile, "utf8"));
  if (data.canonical !== siteUrl("sponsor-opportunities")) failures.push("Sponsor opportunities JSON missing canonical URL.");
  if (!Array.isArray(data.opportunities) || data.opportunities.length < SPONSOR_VERTICALS.length) failures.push("Sponsor opportunities JSON missing vertical opportunities.");
  if (!Array.isArray(data.prospectPaths) || data.prospectPaths.length < SPONSOR_VERTICALS.length) failures.push("Sponsor opportunities JSON missing prospect paths.");
  if (!data.externalDiscoveryProof || Number(data.externalDiscoveryProof.directoryListedCount || 0) < 4) failures.push("Sponsor opportunities JSON missing public external discovery proof.");
  if (!String(data.inquiryUrl || "").includes("utm_source=sponsor-opportunities")) failures.push("Sponsor opportunities JSON missing tracked inquiry URL.");
  if (!String(data.invoiceReviewUrl || "").includes("sponsor-starter-review") || !String(data.invoiceReviewUrl || "").includes("commitment=request-invoice")) failures.push("Sponsor opportunities JSON missing invoice review URL.");
  if (!data.prospectPaths?.every((item) => String(item.invoiceReviewUrl || "").includes("sponsor-starter-review") && String(item.invoiceReviewUrl || "").includes("commitment=request-invoice"))) failures.push("Sponsor opportunities JSON prospect paths missing invoice review URLs.");
  if (JSON.stringify(data).includes("/ops/")) failures.push("Sponsor opportunities JSON should not expose operations monitor URL.");
  if (!String(data.successGate || "").includes("Views and clicks alone are not revenue")) failures.push("Sponsor opportunities JSON missing revenue gate.");
}

const sponsorIntentFeedFile = path.join(root, "sponsor-intent-feed.json");
if (!fs.existsSync(sponsorIntentFeedFile)) failures.push("Missing sponsor-intent-feed.json.");
else {
  const data = JSON.parse(fs.readFileSync(sponsorIntentFeedFile, "utf8"));
  const serialized = JSON.stringify(data);
  if (data.canonical !== siteUrl("sponsor-intent-feed.json").replace(/\/$/, "")) failures.push("Sponsor intent feed missing canonical URL.");
  if (!String(data.invoiceReviewUrl || "").includes("sponsor-starter-review") || !String(data.invoiceReviewUrl || "").includes("commitment=request-invoice")) failures.push("Sponsor intent feed missing invoice review URL.");
  if (!Array.isArray(data.prospectPaths) || data.prospectPaths.length < SPONSOR_VERTICALS.length) failures.push("Sponsor intent feed missing prospect paths.");
  if (!data.externalDiscoveryProof || Number(data.externalDiscoveryProof.directoryListedCount || 0) < 4) failures.push("Sponsor intent feed missing public external discovery proof.");
  if (!Array.isArray(data.invoiceReadyDeals) || !data.invoiceReadyDeals.some((deal) => deal.id === "starter-fit-review" && deal.price === "USD 49")) failures.push("Sponsor intent feed missing USD 49 invoice-ready deal.");
  if (!String(data.privacyBoundary || "").includes("operations routes")) failures.push("Sponsor intent feed missing privacy boundary.");
  if (serialized.includes("/ops/") || serialized.includes("dashboard")) failures.push("Sponsor intent feed should not expose operations or dashboard URLs.");
}

for (const toolPath of ["tools/invoice-generator", "tools/price-tag", "tools/flyer-maker", "tools/coupon-maker", "tools/packing-slip", "tools/business-card", "tools/qr-code"]) {
  const file = path.join(root, ...toolPath.split("/"), "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing free-tool depth CTA tool page: ${toolPath}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes("free-tool-depth-cta")) failures.push(`Missing free-tool depth CTA: ${toolPath}`);
  if (!html.includes("service-upgrade-cta")) failures.push(`Local tool funnel missing optional service upgrade CTA: ${toolPath}`);
  if (!html.includes(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug) || !html.includes("Start free fit check") || !html.includes(`$${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd}`)) failures.push(`Local tool funnel missing low-friction paid setup request path: ${toolPath}`);
  if (!html.includes(MARKET_TABLE_PRINT_AUDIT.slug) || !html.includes("Free print audit first")) failures.push(`Local tool funnel missing free audit lead magnet: ${toolPath}`);
  if (!html.includes("free_tool_depth")) failures.push(`Missing free-tool depth campaign on CTA: ${toolPath}`);
  if (!html.includes('data-track-event="free_tool_depth"')) failures.push(`Missing free-tool depth event on CTA: ${toolPath}`);
  if (!html.includes('data-track-event="service_request_intent"')) failures.push(`Local tool funnel missing service request intent tracking: ${toolPath}`);
  if (!html.includes('data-track-event="audit_request_intent"')) failures.push(`Local tool funnel missing audit request intent tracking: ${toolPath}`);
  if (!html.includes("Browse more free tools")) failures.push(`Missing free-tool browse CTA: ${toolPath}`);
  if (!html.includes("Future ads must stay separated from generator controls")) failures.push(`Missing ad-safety warning on funnel CTA: ${toolPath}`);
  if (!html.includes("Payment happens only through a real external checkout or invoice")) failures.push(`Local tool service CTA missing external-payment gate: ${toolPath}`);
  if (toolPath === "tools/invoice-generator") {
    if (!html.includes("tool-invoice-lead-form invoice-micro-lead-form") || !html.includes('data-lead-path="/tools/invoice-generator/"') || !html.includes('data-utm-content="invoice-generator-inline"') || !html.includes('name="requestSummary"') || !html.includes("Send $19 sequence request")) failures.push("Invoice generator missing one-field invoice follow-up paid request form.");
    if (!html.includes("invoice-sponsor-close-cta") || !html.includes("Sponsor the free invoice workflow")) failures.push("Invoice generator missing sponsor close CTA.");
    if (!html.includes("utm_source=invoice_tool") || !html.includes("vertical=small-business-paperwork-sponsors") || !html.includes("commitment=request-invoice")) failures.push("Invoice sponsor close CTA missing tracked invoice sponsor review path.");
    if (!html.includes('data-track-event="sponsor_request_intent"') || !html.includes('data-track-tool="invoice-generator"')) failures.push("Invoice sponsor close CTA missing sponsor intent tracking.");
  }
}

const invoiceFollowupToolFile = path.join(root, "tools", "invoice-followup-email", "index.html");
if (!fs.existsSync(invoiceFollowupToolFile)) failures.push("Missing invoice follow-up email generator route.");
else {
  const html = fs.readFileSync(invoiceFollowupToolFile, "utf8");
  if (!html.includes("service-upgrade-cta") || !html.includes(INVOICE_FOLLOWUP_COPY_PACK_SERVICE.slug) || !html.includes("Start invoice fit check")) failures.push("Invoice follow-up email route missing focused copy-pack service CTA.");
  if (!html.includes("Create invoice first") || !html.includes("invoice_followup_tool")) failures.push("Invoice follow-up email route missing invoice-only free-tool path.");
  if (html.includes(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug) || html.includes(MARKET_TABLE_PRINT_AUDIT.slug) || html.includes("Free print audit first")) failures.push("Invoice follow-up email route should not cross-sell local print-pack or print-audit CTAs.");
  if (!html.includes("Payment happens only through a real external checkout or invoice")) failures.push("Invoice follow-up email route missing external-payment gate.");
}

const overdueInvoiceReminderFile = path.join(root, "overdue-invoice-reminder-email", "index.html");
if (!fs.existsSync(overdueInvoiceReminderFile)) failures.push("Missing overdue invoice reminder landing page.");
else {
  const html = fs.readFileSync(overdueInvoiceReminderFile, "utf8");
  if (!html.includes("Overdue invoice reminder email") || !html.includes("first overdue invoice follow up")) failures.push("Overdue invoice reminder page missing high-intent copy.");
  if (!html.includes("/tools/invoice-followup-email/?invoiceStatus=overdue") || !html.includes("tone=friendly")) failures.push("Overdue invoice reminder page missing prefilled overdue generator link.");
  if (!html.includes('data-service-type="invoice-followup-copy-pack"') || !html.includes("Send overdue invoice fit check") || !html.includes("$19")) failures.push("Overdue invoice reminder page missing $19 invoice follow-up fit-check form.");
  if (!html.includes("I need a first overdue invoice reminder sequence")) failures.push("Overdue invoice reminder page missing prefilled fit-check request text.");
  if (!html.includes("Source+path%3A+https%3A%2F%2Fprintable-tools-lab.pages.dev%2Foverdue-invoice-reminder-email%2F")) failures.push("Overdue invoice reminder backup request should preserve landing page source path.");
  if (html.includes("/ops/") || html.includes("market-table-print-audit") || html.includes("custom-local-print-pack")) failures.push("Overdue invoice reminder page should stay focused and not expose ops or print-pack CTAs.");
  if (!sitemap.includes(`<loc>${siteUrl("overdue-invoice-reminder-email")}</loc>`)) failures.push("Sitemap missing overdue invoice reminder landing page.");
}

for (const page of [
  {
    pathName: "polite-payment-reminder-email",
    headline: "Polite payment reminder email",
    cta: "Send polite reminder fit check",
    summary: "I need a polite payment reminder sequence",
    sourcePath: "polite-payment-reminder-email",
  },
  {
    pathName: "freelance-invoice-follow-up-email",
    headline: "Freelance invoice follow-up email",
    cta: "Send freelance invoice fit check",
    summary: "I need a freelance invoice follow-up copy pack",
    sourcePath: "freelance-invoice-follow-up-email",
  },
]) {
  const file = path.join(root, page.pathName, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing high-intent invoice follow-up landing page: ${page.pathName}`);
  } else {
    const html = fs.readFileSync(file, "utf8");
    if (!html.includes(page.headline) || !html.includes("/tools/invoice-followup-email/?invoiceStatus=sent")) failures.push(`${page.pathName} missing focused invoice follow-up copy or prefilled generator link.`);
    if (!html.includes('data-service-type="invoice-followup-copy-pack"') || !html.includes(page.cta) || !html.includes("$19")) failures.push(`${page.pathName} missing $19 invoice follow-up fit-check form.`);
    if (!html.includes('data-service-invoice-submit') || !html.includes("Request $19 invoice link")) failures.push(`${page.pathName} missing above-fold $19 invoice-link request CTA.`);
    if (!html.includes("Send a 30-second $19 sequence request") || !html.includes("invoice-micro-lead-form") || !html.includes("Send $19 sequence request")) failures.push(`${page.pathName} missing shortest paid request form.`);
    if (!html.includes(page.summary)) failures.push(`${page.pathName} missing prefilled fit-check request text.`);
    if (!html.includes("Open public-safe request") || !html.includes('data-service-lead-fallback-link')) failures.push(`${page.pathName} missing public-safe request CTA.`);
    if (!html.includes(`Source+path%3A+https%3A%2F%2Fprintable-tools-lab.pages.dev%2F${page.sourcePath}%2F`)) failures.push(`${page.pathName} backup request should preserve landing page source path.`);
    if (!html.includes("Request+note%3A") || !html.includes(page.summary.replace(/ /g, "+"))) failures.push(`${page.pathName} public-safe request should prefill the request note.`);
    if (html.includes("/ops/") || html.includes("market-table-print-audit") || html.includes("custom-local-print-pack")) failures.push(`${page.pathName} should stay focused and not expose ops or print-pack CTAs.`);
  }
  if (!sitemap.includes(`<loc>${siteUrl(page.pathName)}</loc>`)) failures.push(`Sitemap missing high-intent invoice follow-up landing page: ${page.pathName}`);
}

const appScriptFile = path.join(root, "app.js");
if (!fs.existsSync(appScriptFile)) failures.push("Missing app.js.");
else {
  const script = fs.readFileSync(appScriptFile, "utf8");
  if (!script.includes("download-after-action")) failures.push("Missing download success after-action funnel.");
  if (!script.includes('parts[0] === "upload-limit-fix-plan"') || !script.includes("renderUploadLimitFixPlanService") || !script.includes('data-service-type="upload-limit-fix-plan"')) failures.push("app.js missing upload limit fix plan route and service lead form.");
  if (!script.includes("utm_source=download_success")) failures.push("Missing download success campaign tracking.");
  if (!script.includes("free_tool_depth")) failures.push("Missing download success free-tool depth campaign.");
  if (!script.includes('data-track-event="free_tool_depth"')) failures.push("Missing download success free-tool depth event tracking.");
  if (!script.includes("Browse more free tools")) failures.push("Missing download success free-tool browse CTA.");
  if (!script.includes("download-service-close") || !script.includes("Want a practical local print pack?") || !script.includes("Need words to follow up on this invoice?") || !script.includes("one-field $19 Invoice Follow-up Copy Pack request") || !script.includes("30-second free fit check")) failures.push("Missing download success low-friction service close CTA.");
  if (!script.includes("/custom-local-print-pack/?utm_source=download_success") || !script.includes("/invoice-followup-copy-pack/?utm_source=download_success") || !script.includes("/market-table-print-audit/?utm_source=download_success")) failures.push("Missing download success service/audit tracked paths.");
  if (!script.includes('data-track-event="service_request_intent"') || !script.includes('data-track-event="audit_request_intent"')) failures.push("Missing download success service/audit intent tracking.");
  if (!script.includes("Payment starts only after fit is confirmed and a real external checkout or invoice is paid")) failures.push("Missing download success external-payment gate.");
  if (!script.includes("renderDownloadServiceLeadForm") || !script.includes("download-service-lead-form") || !script.includes("Send free fit check") || !script.includes("Send $19 sequence request") || !script.includes("want the $19 Invoice Follow-up Copy Pack") || !script.includes("free fit check for the $29 local print pack")) failures.push("Missing inline low-friction service lead form after download success.");
  if (!script.includes("renderInvoiceFollowupOutputServiceLeadForm") || !script.includes("tool-output-service-lead-form") || !script.includes('data-utm-source="tool_output"') || !script.includes("Generated draft excerpt to refine") || !script.includes("data-invoice-followup-output-invoice-request") || !script.includes('name="requestSummary" value=')) failures.push("Invoice follow-up email output missing inline one-field service lead form.");
  if (!script.includes("overdue-invoice-reminder-email") || !script.includes("invoiceStatus=overdue") || !script.includes("Send overdue invoice fit check")) failures.push("app.js missing high-intent overdue invoice reminder landing route.");
  if (!script.includes("polite-payment-reminder-email") || !script.includes("Send polite reminder fit check") || !script.includes("freelance-invoice-follow-up-email") || !script.includes("Send freelance invoice fit check")) failures.push("app.js missing high-intent polite/freelance invoice reminder landing routes.");
  if (!script.includes('tool.id === "invoice-followup-email"') || !script.includes('values.invoiceStatus = invoiceStatus') || !script.includes("const initialValues = initialToolValues(tool)") || !script.includes("renderField(field, initialValues[field.id])")) failures.push("app.js should prefill invoice follow-up generator from URL params.");
  if (!script.includes('data-utm-source="download_success"') || !script.includes("form.dataset.leadPath") || !script.includes("paramOrFieldOrData")) failures.push("Download success service lead form missing attribution preservation.");
  if (!script.includes('utmSource: paramOrFieldOrData("utm_source", "utmSource", "utmSource")') || !script.includes('utmCampaign: paramOrFieldOrData("utm_campaign", "utmCampaign", "utmCampaign")')) failures.push("Service lead attribution should prefer live URL UTM params over static form defaults.");
  if (!script.includes("Future ads must stay separated from generator controls")) failures.push("Missing download success ad-safety warning.");
  if (!script.includes("UPLOAD_FIX_FUNNEL_TOOL_IDS") || !script.includes("renderDownloadUploadFixAfterAction") || !script.includes("download-upload-fix-lead-form") || !script.includes("Send $9 upload check request") || !script.includes("data-download-upload-fix-invoice-request") || !script.includes("Open public-safe $9 invoice request") || !script.includes("data-download-upload-fix-public-request") || !script.includes("I just downloaded") || !script.includes('data-utm-campaign="upload_limit_fix_plan"') || !script.includes('data-service-primary-invoice-request="true"')) failures.push("Missing download success upload-limit fix-plan invoice-request close CTA.");
  if (!script.includes("renderPdfToolUploadFixRequest") || !script.includes("data-compress-pdf-tool-fix-form") || !script.includes('data-utm-source="compress-pdf-tool"') || !script.includes("Request $9 invoice link") || !script.includes('data-service-primary-invoice-request="true"') || !script.includes('data-track-event="service_invoice_request"') || !script.includes("Open public-safe $9 invoice request") || !script.includes("uploadLimitCompressPdfToolSummary") || !script.includes("Portal target: PDF under") || !script.includes("pdfTargetLabel(targetSize")) failures.push("Compress PDF tool missing pre-download upload-limit invoice request path.");
  for (const targetSize of ["100kb", "200kb", "300kb", "500kb", "1mb", "2mb", "5mb", "10mb"]) {
    if (!script.includes(`"${targetSize}"`) || !script.includes(`targetSize=${targetSize}`)) failures.push(`Compress PDF tool missing target-size runtime support: ${targetSize}`);
  }
  if (!script.includes("renderImageKbToolUploadFixRequest") || !script.includes("data-compress-image-kb-tool-fix-form") || !script.includes('data-utm-source="compress-image-kb-tool"') || !script.includes("Request $9 invoice link") || !script.includes("data-service-invoice-submit") || !script.includes("uploadLimitImageKbToolSummary") || !script.includes("Portal target: image or photo under") || !script.includes('params.get("targetkb")') || script.includes("Send $9 image target request</button>")) failures.push("Compress image-to-KB tool missing pre-download primary invoice-link upload-limit fix-plan request path.");
  if (!script.includes("data-service-lead-focus-contact") || !script.includes("Add reply contact") || !script.includes("private $9 follow-up path") || !script.includes('input[name="contact"]')) failures.push("Service lead no-contact fallback should focus visitors back to the reply contact field.");
  if (!script.includes("ensureServiceLeadContactCue") || !script.includes("data-service-lead-contact-cue") || !script.includes("One reply email, @handle, or public contact URL unlocks") || !script.includes("serviceLeadPrivatePathLabel") || !script.includes("aria-invalid")) failures.push("Service lead forms should make the reply-contact value prop and no-contact recovery state visible.");
  if (!script.includes("renderInvoiceSponsorCloseCta") || !script.includes("invoice-sponsor-close-cta") || !script.includes("utm_source=download_success") || !script.includes("small-business-paperwork-sponsors")) failures.push("app.js missing invoice-specific sponsor close CTA on tool/download success.");
  if (!script.includes("utmCampaign") || !script.includes("vertical")) failures.push("app.js missing sponsor attribution fields.");
  if (!script.includes('window.location.hash.startsWith("#/")')) failures.push("app.js should keep ordinary anchor hashes from overriding routed pages.");
  if (!script.includes('params.get("deal")') || !script.includes("Sponsor close cockpit") || !script.includes("data-copy-text")) failures.push("app.js missing sponsor close cockpit or deal-param prefill.");
  if (!script.includes('params.get("commitment")') || !script.includes("sponsorCommitment")) failures.push("app.js missing sponsor invoice-request prefill from deal links.");
  if (!script.includes("sponsorInvoiceRequestCopy") || !script.includes("Copy invoice request")) failures.push("app.js missing copy-ready sponsor invoice request path.");
  if (!script.includes("submitSponsorQuickLeadForm") || !script.includes("data-sponsor-quick-form")) failures.push("app.js missing fast sponsor invoice review form handler.");
  if (!script.includes("DEFAULT_SPONSOR_DEAL_ID") || !script.includes("starter-fit-review") || !script.includes("Fastest paid pilot path")) failures.push("app.js missing USD 49 starter review default path.");
  if (!script.includes("renderSponsorStarterReviewPage") || !script.includes("sponsor-starter-review") || !script.includes("Start USD 49 review")) failures.push("app.js missing direct USD 49 starter sponsor review route.");
  if (!script.includes("data-sponsor-public-invoice-request") || !script.includes("Open public invoice request")) failures.push("app.js missing public invoice request CTA.");
  if (!script.includes("initSponsorQuickDealPicker") || !script.includes("quickDealId")) failures.push("app.js missing quick sponsor deal picker handling.");
  if (!script.includes("sponsor-micro-lead-form") || !script.includes("Website (optional)") || !script.includes("Public-safe reply form")) failures.push("app.js missing one-field sponsor lead capture path.");
  if (!script.includes("sponsorLeadPublicReplyUrl") || !script.includes("Open public-safe reply")) failures.push("app.js missing public-safe sponsor fallback for failed lead storage.");
  if (!script.includes("renderSponsorLeadSuccess") || !script.includes("Copy invoice/agreement request") || !script.includes("Next step ready")) failures.push("app.js missing sponsor lead success close panel.");
  if (!script.includes("absoluteSponsorUrl")) failures.push("app.js sponsor outreach pitch should copy absolute URLs.");
  if (!script.includes("sponsorSprintHtml({ totals: {}, projects: [] }, null, null)")) failures.push("app.js ops monitor should keep sponsor close actions visible when live metrics fail.");
  if (!script.includes("loadSponsorLeadCheck") || !script.includes("Sponsor lead index check") || !script.includes("/api/sponsor-lead")) failures.push("app.js ops monitor should independently check sponsor lead index totals.");
  if (!script.includes("loadSponsorPublicReplies") || !script.includes("Public-safe sponsor reply evidence") || !script.includes("/api/sponsor-public-replies")) failures.push("app.js ops monitor should independently check public sponsor reply evidence.");
  if (!script.includes("sponsorOpsSubmissionQueue") || !script.includes("Next sponsor submissions") || !script.includes("sponsorMailtoDraft") || !script.includes("sponsorOpsExecutionMode") || !script.includes("Copy evidence note")) failures.push("app.js ops monitor should expose internal sponsor submission execution cards.");
  if (!script.includes("renderSponsorProposalPage") || !script.includes("sponsorProspectProposalUrl") || !script.includes("sponsor_proposal")) failures.push("app.js missing direct sponsor proposal funnel.");
  if (!script.includes("sponsorExternalDiscoveryProofLine") || !script.includes("Public discovery proof") || !script.includes("External discovery proof")) failures.push("app.js sponsor proposal should show public external discovery proof.");
  if (!script.includes("applySponsorProspectPrefill") || !script.includes("sponsorProspectQuickNotes") || !script.includes("sponsorProspectValidation")) failures.push("app.js sponsor proposal should prefill prospect-aware invoice review forms.");
  if (!script.includes("applySponsorPublicInvoiceLinks") || !script.includes("Fast invoice-review path") || !script.includes("Open public invoice issue")) failures.push("app.js sponsor proposal and ops cockpit should expose prospect-specific public invoice issue actions.");
  if (!script.includes('utmContent: clean(params.get("utm_content")) || clean(params.get("prospect"))')) failures.push("app.js sponsor attribution should keep proposal prospect IDs on quick invoice requests.");
  if (!script.includes("todayToolScore") || !script.includes("pathIntentScore") || !script.includes("Operating actions") || !script.includes("project.nextAction")) failures.push("app.js ops monitor should show detailed project traffic, path intent, and next actions.");
  if (!script.includes("sponsorInvoiceRequestCopy(prospect, deal, vertical, proposalUrl)")) failures.push("app.js ops sponsor cards should copy a real invoice request.");
  if (!script.includes("renderLocalSellerStarterKit") || !script.includes("Request checkout link")) failures.push("app.js missing restored seller kit checkout-request path.");
  if (!script.includes("renderCustomLocalPrintPackService") || !script.includes("Request free fit check") || !script.includes("customLocalPrintPackRequestCopy")) failures.push("app.js missing restored custom print pack service request path.");
  if (!script.includes("renderInvoiceFollowupCopyPackService") || !script.includes("Invoice Follow-up Copy Pack") || !script.includes("invoiceFollowupRequestCopy")) failures.push("app.js missing invoice follow-up service request path.");
  if (!script.includes("renderMarketTablePrintAudit") || !script.includes("Request free audit") || !script.includes("marketTableAuditRequestCopy")) failures.push("app.js missing restored free audit lead magnet path.");
  if (!script.includes("serviceCheckoutUrlFor") || !script.includes("invoiceFollowupCheckoutUrl") || !script.includes("uploadLimitFixPlanCheckoutUrl") || !script.includes("service_checkout_click") || !script.includes("Buy setup for $29")) failures.push("app.js missing per-SKU external service checkout support.");
  if (!script.includes("checkoutActivationHtml") || !script.includes("External payment link readiness") || !script.includes("Copy config command")) failures.push("app.js ops monitor missing checkout activation panel.");
  if (!script.includes("leadToPaymentCloseHtml") || !script.includes("Lead-to-payment close cockpit") || !script.includes("serviceLeadPaymentReplyCopy") || !script.includes("Copy payment reply")) failures.push("app.js ops monitor missing lead-to-payment close cockpit.");
  if (!script.includes("initServiceLeadForms") || !script.includes("submitServiceLeadForm") || !script.includes("/api/service-lead") || !script.includes("Service lead index check")) failures.push("app.js missing low-friction service lead capture and ops index check.");
  if (!script.includes('form.setAttribute("novalidate", "")') || !script.includes("One reply contact needed.") || !script.includes("Add one reply email, @handle, or public contact URL") || !script.includes("public-safe-no-contact") || !script.includes("serviceLeadContactValue")) failures.push("Service lead forms should convert no-contact service intent into a one-contact paid-path prompt instead of being blocked by browser required validation.");
  if (!script.includes("uploadFixPaidPathNote") || !script.includes("30-second paid path") || !script.includes("external $9 checkout or invoice") || !script.includes("private $9 follow-up path") || !script.includes("oneFieldInvoiceRequest") || !script.includes("serviceLeadConsentAccepted")) failures.push("Upload fix service forms should explain and support the one-field paid follow-up path.");
  if (!script.includes("Where should the external $9 checkout or invoice link go?") || !script.includes("This is where the external ${price} checkout or invoice link will be sent after fit is confirmed")) failures.push("Upload fix invoice forms should frame the one field as the external payment-link destination.");
  if (!script.includes("One-contact $9 invoice request") || !script.includes("oneContactInvoiceRequest") || !script.includes('data-track-event="${escapeHtml(primarySubmitEvent)}"') || !script.includes('name="consent" value="on"')) failures.push("Upload-limit landing service forms should reduce the $9 invoice path to one visible contact field.");
  if (!script.includes("data-upload-error-invoice-request") || !script.includes("Request $9 invoice link") || !script.includes("data-service-invoice-submit") || !script.includes("invoiceLinkRequest") || !script.includes("requestedNextStep")) failures.push("Upload error and service pages should expose explicit invoice-link request CTAs.");
  if (!script.includes("data-service-invoice-jump") || !script.includes("focusHashServiceInvoiceForm") || !script.includes('data-track-event="service_invoice_request"') || !script.includes('track(values.invoiceLinkRequest ? "service_invoice_request"')) failures.push("Invoice-link jump CTAs should track invoice intent and focus the one-contact service form.");
  if (!/const invoiceLinkRequest = Boolean\(\s*options\.invoiceLinkRequest\s*\|\|\s*values\.invoiceLinkRequest === "true"\s*\|\|\s*form\.dataset\.servicePrimaryInvoiceRequest === "true"\s*\|\|\s*form\.dataset\.uploadErrorInvoiceRequest === "true"\s*\);/.test(script)) failures.push("Primary invoice service forms should submit as service_invoice_request even when the visitor uses the ordinary submit button.");
  if (!script.includes("Shortest path: the selected error is already written") || !script.includes('type="hidden" name="needBy"') || !script.includes("extraNote")) failures.push("Upload error quick request should keep the selected-error $9 path to one visible contact field.");
  if (!script.includes("isQaTraffic") || !script.includes('params.get("ptl_qa")') || !script.includes('details.qa = true') || !script.includes("if (qaTraffic) return")) failures.push("app.js should keep QA validation traffic out of remote production metrics.");
  if (!script.includes("loadServicePublicRequests") || !script.includes("Public-safe service request evidence") || !script.includes("/api/service-public-requests")) failures.push("app.js ops monitor should independently check public-safe service request issue evidence.");
  if (!script.includes("sourceIntentScore") || !script.includes("primaryProjectSignal") || !script.includes("service invoices") || !script.includes("Service invoice requests") || !script.includes("service_invoice_request || 0) * 8")) failures.push("app.js ops monitor should prioritize detailed service invoice traffic in project, source, path, and tool rows.");
  if (!script.includes("Payment starts only after fit is confirmed") || !script.includes("real external checkout or invoice") || !script.includes("Requests and clicks are not revenue")) failures.push("app.js restored service path missing real-payment gate.");
  if (script.includes("seller-funnel-cta") || script.includes("seller-help-directory")) failures.push("app.js should use free-tool depth naming, not seller funnel naming.");
}

const eventFunctionFile = path.join(root, "functions", "api", "event.js");
const metricsFunctionFile = path.join(root, "functions", "api", "metrics.js");
const sponsorLeadFunctionFile = path.join(root, "functions", "api", "sponsor-lead.js");
const serviceLeadFunctionFile = path.join(root, "functions", "api", "service-lead.js");
const servicePublicRequestsFunctionFile = path.join(root, "functions", "api", "service-public-requests.js");
const sponsorProspectScriptFile = path.join(root, "scripts", "generate-sponsor-prospect-queue.cjs");
const sponsorOutreachLogScriptFile = path.join(root, "scripts", "sponsor-outreach-log.cjs");
const sponsorContactProbeScriptFile = path.join(root, "scripts", "probe-sponsor-contact-routes.cjs");
if (!fs.existsSync(eventFunctionFile)) failures.push("Missing event API function.");
else {
  const eventFunction = fs.readFileSync(eventFunctionFile, "utf8");
  if (!eventFunction.includes('"sponsor-outreach"')) failures.push("Event API missing sponsor-outreach source tracking.");
  if (!eventFunction.includes('"service_checkout_click"')) failures.push("Event API missing direct service checkout click tracking.");
  if (!eventFunction.includes('"service_invoice_request"')) failures.push("Event API missing explicit service invoice request tracking.");
  if (!eventFunction.includes("isQaEvent") || !eventFunction.includes('"qa_event"')) failures.push("Event API should ignore QA validation events before writing public rollups.");
}
if (!fs.existsSync(metricsFunctionFile)) failures.push("Missing metrics API function.");
else {
  const metricsFunction = fs.readFileSync(metricsFunctionFile, "utf8");
  if (!metricsFunction.includes("service_checkout_click")) failures.push("Metrics API missing direct service checkout click totals.");
  if (!metricsFunction.includes("service_invoice_request")) failures.push("Metrics API missing explicit service invoice request totals.");
  if (!metricsFunction.includes('"sponsor-outreach"')) failures.push("Metrics API missing sponsor-outreach source row.");
}
const opsMetricsFunctionFile = path.join(root, "functions", "api", "ops-metrics.js");
if (!fs.existsSync(opsMetricsFunctionFile)) failures.push("Missing ops metrics API function.");
else {
  const opsMetricsScript = fs.readFileSync(opsMetricsFunctionFile, "utf8");
  if (!opsMetricsScript.includes("nextActions") || !opsMetricsScript.includes("pathRows") || !opsMetricsScript.includes("countPathEvent") || !opsMetricsScript.includes("/polite-payment-reminder-email/") || !opsMetricsScript.includes("row[`today_${event}`]") || !opsMetricsScript.includes("projectNextAction")) failures.push("Ops metrics API should expose project next actions and today source/tool/path fields.");
  if (!opsMetricsScript.includes("serviceInvoiceRequests") || !opsMetricsScript.includes("Fresh service invoice request today")) failures.push("Ops metrics API should prioritize explicit service invoice request close actions.");
  for (const opsPath of ["/signature-under-20kb/", "/signature-under-50kb/", "/passport-photo-size-fixer/", "/resize-photo-413x531/", "/photo-295x413-35kb/", "/photo-512x512-100kb/", "/photo-150x200-20kb/", "/photo-600x800-200kb/", "/photo-120x160-20kb/", "/photo-160x200-30kb/", "/photo-300x400-100kb/", "/photo-350x450-100kb/", "/photo-360x480-100kb/", "/photo-420x560-200kb/", "/signature-160x70-20kb/", "/signature-400x150-50kb/", "/signature-100x50-10kb/", "/signature-400x200-100kb/"]) {
    if (!opsMetricsScript.includes(opsPath)) failures.push(`Ops metrics API missing high-intent photo/signature path: ${opsPath}`);
  }
}
const directoryMonitorFile = path.join(root, "scripts", "directory-monitor.cjs");
if (!fs.existsSync(directoryMonitorFile)) failures.push("Missing directory monitor script.");
else {
  const directoryMonitorScript = fs.readFileSync(directoryMonitorFile, "utf8");
  const nosignuptoolsExactUploadTitles = [
    "Compress Image to 10KB",
    "Compress Image to 20KB",
    "Compress Image to 30KB",
    "Compress Image to 150KB",
    "Compress Image to 300KB",
    "Compress Image to 500KB",
    "Compress PDF to 100KB",
    "Compress PDF to 200KB",
    "Compress PDF to 300KB",
    "Compress PDF to 500KB",
    "Compress PDF to 1MB",
    "Compress PDF to 2MB",
    "Compress PDF to 5MB",
    "Compress PDF to 10MB",
    "PDF Size Reducer",
    "File Must Be Less Than 1MB Fix",
    "PDF Must Be Under 100KB Fix",
    "PDF Must Be Under 200KB Fix",
    "PDF Must Be Under 300KB Fix",
    "PDF Must Be Under 500KB Fix",
    "PDF Must Be Under 10MB Fix",
    "Photo Must Be Under 100KB Fix",
    "Image Must Be Under 500KB Fix",
    "Image Must Be Less Than 2MB Fix",
    "JPG Must Be Under 200KB Fix",
    "PNG Screenshot Too Large Fix",
    "Photo 295x413 Under 35KB",
    "Photo 354x472 Under 100KB",
    "Photo 480x640 Under 200KB",
    "Photo 512x512 Under 100KB",
    "Photo 150x200 Under 20KB",
    "Photo 180x240 Under 50KB",
    "Photo 400x514 Under 100KB",
    "Photo 600x800 Under 200KB",
    "Photo 120x160 Under 20KB",
    "Photo 160x200 Under 30KB",
    "Photo 300x400 Under 100KB",
    "Photo 350x450 Under 100KB",
    "Photo 360x480 Under 100KB",
    "Photo 420x560 Under 200KB",
    "Signature 160x70 Under 20KB",
    "Signature 250x80 Under 50KB",
    "Signature 300x60 Under 20KB",
    "Signature 400x150 Under 50KB",
    "Signature 100x50 Under 10KB",
    "Signature 200x60 Under 20KB",
    "Signature 256x64 Under 20KB",
    "Signature 400x200 Under 100KB",
  ];
  const freenosignupUploadFixTitles = [
    "Compress PDF to 100KB",
    "Compress PDF to 200KB",
    "Compress PDF to 300KB",
    "Compress PDF to 500KB",
    "Compress PDF to 1MB",
    "Compress PDF to 10MB",
    "PDF Must Be Under 100KB Fix",
    "PDF Must Be Under 200KB Fix",
    "PDF Must Be Under 300KB Fix",
    "PDF Must Be Under 10MB Fix",
    "Compress Image to 100KB",
    "Image Must Be Under 500KB Fix",
    "Passport Photo Size Fixer",
    "Photo 200x230 Under 50KB",
    "Photo 295x413 Under 35KB",
    "Photo 354x472 Under 100KB",
    "Photo 480x640 Under 200KB",
    "Photo 512x512 Under 100KB",
    "Photo 150x200 Under 20KB",
    "Photo 180x240 Under 50KB",
    "Photo 400x514 Under 100KB",
    "Photo 600x800 Under 200KB",
    "Photo 120x160 Under 20KB",
    "Photo 160x200 Under 30KB",
    "Photo 300x400 Under 100KB",
    "Photo 350x450 Under 100KB",
    "Photo 360x480 Under 100KB",
    "Photo 420x560 Under 200KB",
    "Signature Under 20KB",
    "Signature 160x70 Under 20KB",
    "Signature 250x80 Under 50KB",
    "Signature 300x60 Under 20KB",
    "Signature 400x150 Under 50KB",
    "Signature 100x50 Under 10KB",
    "Signature 200x60 Under 20KB",
    "Signature 256x64 Under 20KB",
    "Signature 400x200 Under 100KB",
    "Resize Signature 200x100",
  ];
  const techtoolsExactUploadTitles = [
    "Compress PDF to 100KB",
    "Compress PDF to 200KB",
    "Compress PDF to 300KB",
    "Compress PDF to 10MB",
    "PDF Must Be Under 100KB Fix",
    "PDF Must Be Under 200KB Fix",
    "PDF Must Be Under 300KB Fix",
    "PDF Must Be Under 10MB Fix",
    "Photo 120x160 Under 20KB",
    "Photo 160x200 Under 30KB",
    "Photo 300x400 Under 100KB",
    "Photo 350x450 Under 100KB",
    "Photo 360x480 Under 100KB",
    "Photo 420x560 Under 200KB",
    "Photo 480x640 Under 200KB",
    "Photo 512x512 Under 100KB",
    "Signature 160x70 Under 20KB",
    "Signature 250x80 Under 50KB",
    "Signature 300x60 Under 20KB",
    "Signature 400x150 Under 50KB",
    "Photo 150x200 Under 20KB",
    "Photo 180x240 Under 50KB",
    "Photo 400x514 Under 100KB",
    "Photo 600x800 Under 200KB",
    "Signature 100x50 Under 10KB",
    "Signature 200x60 Under 20KB",
    "Signature 256x64 Under 20KB",
    "Signature 400x200 Under 100KB",
  ];
  if (!directoryMonitorScript.includes("NoSignupTools overdue invoice reminder listing") || !directoryMonitorScript.includes("Overdue+Invoice+Reminder+Email")) failures.push("Directory monitor missing NoSignupTools overdue invoice reminder submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools upload limit fixer listing") || !directoryMonitorScript.includes("Upload+Limit+Fixer")) failures.push("Directory monitor missing NoSignupTools upload limit fixer submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools upload error cheatsheet listing") || !directoryMonitorScript.includes("Upload+Error+Cheatsheet")) failures.push("Directory monitor missing NoSignupTools upload error cheatsheet submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools compress JPG to 50KB listing") || !directoryMonitorScript.includes("Compress+JPG+to+50KB")) failures.push("Directory monitor missing NoSignupTools JPG 50KB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools compress PNG to 200KB listing") || !directoryMonitorScript.includes("Compress+PNG+to+200KB")) failures.push("Directory monitor missing NoSignupTools PNG 200KB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools passport photo compress to 200KB listing") || !directoryMonitorScript.includes("Passport+Photo+Compress+to+200KB")) failures.push("Directory monitor missing NoSignupTools passport photo 200KB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools PDF under 2MB upload fix listing") || !directoryMonitorScript.includes("PDF+Under+2MB+Upload+Fix")) failures.push("Directory monitor missing NoSignupTools PDF under 2MB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools PDF under 5MB upload fix listing") || !directoryMonitorScript.includes("PDF+Under+5MB+Upload+Fix")) failures.push("Directory monitor missing NoSignupTools PDF under 5MB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools resume PDF under 2MB upload fix listing") || !directoryMonitorScript.includes("Resume+PDF+Under+2MB+Upload+Fix")) failures.push("Directory monitor missing NoSignupTools resume PDF under 2MB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools document under 5MB upload fix listing") || !directoryMonitorScript.includes("Document+Under+5MB+Upload+Fix")) failures.push("Directory monitor missing NoSignupTools document under 5MB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools extract text from PDF without uploading listing") || !directoryMonitorScript.includes("Extract+Text+From+PDF+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools extract text from PDF submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools merge PDF without uploading listing") || !directoryMonitorScript.includes("Merge+PDF+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools merge PDF submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools split PDF without uploading listing") || !directoryMonitorScript.includes("Split+PDF+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools split PDF submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools rotate PDF pages without uploading listing") || !directoryMonitorScript.includes("Rotate+PDF+Pages+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools rotate PDF submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools remove pages from PDF without uploading listing") || !directoryMonitorScript.includes("Remove+Pages+From+PDF+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools remove PDF pages submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools reorder PDF pages without uploading listing") || !directoryMonitorScript.includes("Reorder+PDF+Pages+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools reorder PDF pages submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools add page numbers to PDF listing") || !directoryMonitorScript.includes("Add+Page+Numbers+to+PDF")) failures.push("Directory monitor missing NoSignupTools add page numbers submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools stamp PDF without uploading listing") || !directoryMonitorScript.includes("Stamp+PDF+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools stamp PDF submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools sign PDF without uploading listing") || !directoryMonitorScript.includes("Sign+PDF+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools sign PDF submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools compress image without uploading listing") || !directoryMonitorScript.includes("Compress+Image+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools compress image no-upload submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools resize image without uploading listing") || !directoryMonitorScript.includes("Resize+Image+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools resize image no-upload submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools convert image format without uploading listing") || !directoryMonitorScript.includes("Convert+Image+Format+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools convert image format no-upload submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools remove background without uploading listing") || !directoryMonitorScript.includes("Remove+Background+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools remove background no-upload submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools crop image without uploading listing") || !directoryMonitorScript.includes("Crop+Image+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools crop image no-upload submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools rotate image without uploading listing") || !directoryMonitorScript.includes("Rotate+Image+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools rotate image no-upload submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools watermark image without uploading listing") || !directoryMonitorScript.includes("Watermark+Image+Without+Uploading")) failures.push("Directory monitor missing NoSignupTools watermark image no-upload submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools passport photo size fixer listing") || !directoryMonitorScript.includes("Passport+Photo+Size+Fixer")) failures.push("Directory monitor missing NoSignupTools passport photo size fixer submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools resize photo 413x531 listing") || !directoryMonitorScript.includes("Resize+Photo+413x531")) failures.push("Directory monitor missing NoSignupTools resize photo 413x531 submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools passport photo 35x45mm listing") || !directoryMonitorScript.includes("Passport+Photo+35x45mm")) failures.push("Directory monitor missing NoSignupTools passport photo 35x45mm submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools photo 200x230 under 50KB listing") || !directoryMonitorScript.includes("Photo+200x230+Under+50KB")) failures.push("Directory monitor missing NoSignupTools photo 200x230 under 50KB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools resize photo 200x230 listing") || !directoryMonitorScript.includes("Resize+Photo+200x230")) failures.push("Directory monitor missing NoSignupTools resize photo 200x230 submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools signature under 20KB listing") || !directoryMonitorScript.includes("Signature+Under+20KB")) failures.push("Directory monitor missing NoSignupTools signature under 20KB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools signature under 50KB listing") || !directoryMonitorScript.includes("Signature+Under+50KB")) failures.push("Directory monitor missing NoSignupTools signature under 50KB submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools resize signature 140x60 listing") || !directoryMonitorScript.includes("Resize+Signature+140x60")) failures.push("Directory monitor missing NoSignupTools resize signature 140x60 submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools resize signature 200x100 listing") || !directoryMonitorScript.includes("Resize+Signature+200x100")) failures.push("Directory monitor missing NoSignupTools resize signature 200x100 submission tracking.");
  if (!directoryMonitorScript.includes("nosignupExactUploadLimitListings") || !directoryMonitorScript.includes("slugify(title)")) failures.push("Directory monitor missing data-driven NoSignupTools exact upload-limit tracking.");
  for (const title of nosignuptoolsExactUploadTitles) {
    if (!directoryMonitorScript.includes(title)) failures.push(`Directory monitor missing NoSignupTools exact upload-limit tracking: ${title}.`);
  }
  if (!directoryMonitorScript.includes("FreeNoSignup overdue invoice reminder listing") || !directoryMonitorScript.includes("Overdue+Invoice+Reminder+Email")) failures.push("Directory monitor missing FreeNoSignup overdue invoice reminder submission tracking.");
  if (!directoryMonitorScript.includes("FreeNoSignup upload limit fixer listing") || !directoryMonitorScript.includes("Upload+Limit+Fixer")) failures.push("Directory monitor missing FreeNoSignup upload limit fixer submission tracking.");
  if (!directoryMonitorScript.includes("FreeNoSignup upload error cheatsheet listing") || !directoryMonitorScript.includes("Upload+Error+Cheatsheet")) failures.push("Directory monitor missing FreeNoSignup upload error cheatsheet submission tracking.");
  if (!directoryMonitorScript.includes("freenosignupUploadFixListings")) failures.push("Directory monitor missing data-driven FreeNoSignup upload-fix tracking.");
  for (const title of freenosignupUploadFixTitles) {
    if (!directoryMonitorScript.includes(title)) failures.push(`Directory monitor missing FreeNoSignup upload-fix tracking: ${title}.`);
  }
  if (!directoryMonitorScript.includes("TechTools Launchpad upload limit fix plan service listing") || !directoryMonitorScript.includes("Upload Limit Fix Plan")) failures.push("Directory monitor missing TechTools upload limit fix plan service listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad upload error cheatsheet listing") || !directoryMonitorScript.includes("Upload Error Cheatsheet")) failures.push("Directory monitor missing TechTools upload error cheatsheet listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad compress PDF to 1MB listing") || !directoryMonitorScript.includes("Compress PDF to 1MB")) failures.push("Directory monitor missing TechTools compress PDF to 1MB listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad photo under 100KB upload fix listing") || !directoryMonitorScript.includes("Photo Under 100KB Upload Fix")) failures.push("Directory monitor missing TechTools photo under 100KB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad image under 2MB upload fix listing") || !directoryMonitorScript.includes("Image Under 2MB Upload Fix")) failures.push("Directory monitor missing TechTools image under 2MB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad JPG under 200KB upload fix listing") || !directoryMonitorScript.includes("JPG Under 200KB Upload Fix")) failures.push("Directory monitor missing TechTools JPG under 200KB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad resume PDF too large upload fix listing") || !directoryMonitorScript.includes("Resume PDF Too Large Upload Fix")) failures.push("Directory monitor missing TechTools resume PDF too large upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad PNG screenshot too large upload fix listing") || !directoryMonitorScript.includes("PNG Screenshot Too Large Upload Fix")) failures.push("Directory monitor missing TechTools PNG screenshot too large upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad passport photo 50KB upload fix listing") || !directoryMonitorScript.includes("Passport Photo 50KB Upload Fix")) failures.push("Directory monitor missing TechTools passport photo 50KB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad PDF under 500KB upload fix listing") || !directoryMonitorScript.includes("PDF Under 500KB Upload Fix")) failures.push("Directory monitor missing TechTools PDF under 500KB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad image under 500KB upload fix listing") || !directoryMonitorScript.includes("Image Under 500KB Upload Fix")) failures.push("Directory monitor missing TechTools image under 500KB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad image dimensions 600x600 upload fix listing") || !directoryMonitorScript.includes("Image Dimensions 600x600 Upload Fix")) failures.push("Directory monitor missing TechTools image dimensions 600x600 upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad PDF not accepted JPG required fix listing") || !directoryMonitorScript.includes("PDF Not Accepted JPG Required Fix")) failures.push("Directory monitor missing TechTools PDF not accepted JPG required listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad email attachment too large PDF fix listing") || !directoryMonitorScript.includes("Email Attachment Too Large PDF Fix")) failures.push("Directory monitor missing TechTools email attachment too large PDF fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad PDF under 2MB upload fix listing") || !directoryMonitorScript.includes("PDF Under 2MB Upload Fix")) failures.push("Directory monitor missing TechTools PDF under 2MB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad PDF under 5MB upload fix listing") || !directoryMonitorScript.includes("PDF Under 5MB Upload Fix")) failures.push("Directory monitor missing TechTools PDF under 5MB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad resume PDF under 2MB upload fix listing") || !directoryMonitorScript.includes("Resume PDF Under 2MB Upload Fix")) failures.push("Directory monitor missing TechTools resume PDF under 2MB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad document under 5MB upload fix listing") || !directoryMonitorScript.includes("Document Under 5MB Upload Fix")) failures.push("Directory monitor missing TechTools document under 5MB upload fix listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad PDF size reducer listing") || !directoryMonitorScript.includes("PDF Size Reducer")) failures.push("Directory monitor missing TechTools PDF size reducer listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad compress PDF to 2MB listing") || !directoryMonitorScript.includes("Compress PDF to 2MB")) failures.push("Directory monitor missing TechTools compress PDF to 2MB listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad compress PDF to 5MB listing") || !directoryMonitorScript.includes("Compress PDF to 5MB")) failures.push("Directory monitor missing TechTools compress PDF to 5MB listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad compress PDF without uploading listing") || !directoryMonitorScript.includes("Compress PDF Without Uploading")) failures.push("Directory monitor missing TechTools compress PDF without uploading listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad PDF to JPG without uploading listing") || !directoryMonitorScript.includes("PDF to JPG Without Uploading")) failures.push("Directory monitor missing TechTools PDF to JPG without uploading listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad JPG to PDF without uploading listing") || !directoryMonitorScript.includes("JPG to PDF Without Uploading")) failures.push("Directory monitor missing TechTools JPG to PDF without uploading listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad extract text from PDF without uploading listing") || !directoryMonitorScript.includes("Extract Text From PDF Without Uploading")) failures.push("Directory monitor missing TechTools extract text from PDF without uploading listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad merge PDF without uploading listing") || !directoryMonitorScript.includes("Merge PDF Without Uploading")) failures.push("Directory monitor missing TechTools merge PDF without uploading listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad split PDF without uploading listing") || !directoryMonitorScript.includes("Split PDF Without Uploading")) failures.push("Directory monitor missing TechTools split PDF without uploading listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad signature under 20KB listing") || !directoryMonitorScript.includes("Signature Under 20KB")) failures.push("Directory monitor missing TechTools signature 20KB listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad passport photo size fixer listing") || !directoryMonitorScript.includes("Passport Photo Size Fixer")) failures.push("Directory monitor missing TechTools passport photo size fixer listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad resize photo 413x531 listing") || !directoryMonitorScript.includes("Resize Photo 413x531")) failures.push("Directory monitor missing TechTools resize photo 413x531 listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad signature under 50KB listing") || !directoryMonitorScript.includes("Signature Under 50KB")) failures.push("Directory monitor missing TechTools signature 50KB listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad resize signature 140x60 listing") || !directoryMonitorScript.includes("Resize Signature 140x60")) failures.push("Directory monitor missing TechTools resize signature 140x60 listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad photo 200x230 under 50KB listing") || !directoryMonitorScript.includes("Photo 200x230 Under 50KB")) failures.push("Directory monitor missing TechTools photo 200x230 under 50KB listing tracking.");
  if (!directoryMonitorScript.includes("techtoolsExactUploadLimitListings")) failures.push("Directory monitor missing data-driven TechTools exact upload-limit retry tracking.");
  for (const title of techtoolsExactUploadTitles) {
    if (!directoryMonitorScript.includes(title)) failures.push(`Directory monitor missing TechTools exact upload-limit tracking: ${title}.`);
  }
  if (!directoryMonitorScript.includes("TechTools Launchpad photo 240x320 under 50KB listing") || !directoryMonitorScript.includes("Photo 240x320 Under 50KB")) failures.push("Directory monitor missing TechTools photo 240x320 under 50KB listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad photo 295x413 under 35KB listing") || !directoryMonitorScript.includes("Photo 295x413 Under 35KB")) failures.push("Directory monitor missing TechTools photo 295x413 under 35KB listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad photo 354x472 under 100KB listing") || !directoryMonitorScript.includes("Photo 354x472 Under 100KB")) failures.push("Directory monitor missing TechTools photo 354x472 under 100KB listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad signature 300x80 under 50KB listing") || !directoryMonitorScript.includes("Signature 300x80 Under 50KB")) failures.push("Directory monitor missing TechTools signature 300x80 under 50KB listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad resize signature 200x100 listing") || !directoryMonitorScript.includes("Resize Signature 200x100")) failures.push("Directory monitor missing TechTools resize signature 200x100 listing tracking.");
  if (!directoryMonitorScript.includes("NoLogin.tools upload error cheatsheet listing") || !directoryMonitorScript.includes("Upload+Error+Cheatsheet")) failures.push("Directory monitor missing NoLogin upload error cheatsheet submission tracking.");
  if (!directoryMonitorScript.includes("nologinQueuedExactUploadLimitListings") || !directoryMonitorScript.includes("queued for next NoLogin 3-per-24h submission window")) failures.push("Directory monitor missing NoLogin queued exact upload-limit tracking.");
  for (const title of ["Photo 150x200 Under 20KB", "Photo 180x240 Under 50KB", "Photo 400x514 Under 100KB", "Photo 600x800 Under 200KB", "Signature 100x50 Under 10KB", "Signature 200x60 Under 20KB", "Signature 256x64 Under 20KB", "Signature 400x200 Under 100KB"]) {
    if (!directoryMonitorScript.includes(title)) failures.push(`Directory monitor missing NoLogin exact upload-limit queued tracking: ${title}.`);
  }
  if (!directoryMonitorScript.includes("expected.every")) failures.push("Directory monitor should require all expected listing markers to avoid search-query echo false positives.");
}
const techtoolsPdf1mbReportFile = path.join(root, "reports", "techtools-compress-pdf-to-1mb-submit.json");
if (!fs.existsSync(techtoolsPdf1mbReportFile)) failures.push("Missing TechTools compress PDF to 1MB submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPdf1mbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=174") || !report.includes("pdf_1mb_2026_06")) failures.push("TechTools compress PDF to 1MB submission report missing live evidence.");
}
const techtoolsPdf1mbToolFixReportFile = path.join(root, "reports", "techtools-pdf-under-1mb-tool-fix-submit.json");
if (!fs.existsSync(techtoolsPdf1mbToolFixReportFile)) failures.push("Missing TechTools PDF under 1MB tool-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPdf1mbToolFixReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=175") || !report.includes("pdf_1mb_tool_fix_2026_06") || !report.includes("compress_pdf_tool_target_1mb")) failures.push("TechTools PDF under 1MB tool-fix submission report missing live evidence.");
}
const techtoolsPhoto100kbToolFixReportFile = path.join(root, "reports", "techtools-photo-under-100kb-tool-fix-submit.json");
if (!fs.existsSync(techtoolsPhoto100kbToolFixReportFile)) failures.push("Missing TechTools photo under 100KB tool-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPhoto100kbToolFixReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=176") || !report.includes("photo_100kb_tool_fix_2026_06") || !report.includes("compress_image_kb_tool_target_100kb")) failures.push("TechTools photo under 100KB tool-fix submission report missing live evidence.");
}
const techtoolsImage2mbToolFixReportFile = path.join(root, "reports", "techtools-image-under-2mb-tool-fix-submit.json");
if (!fs.existsSync(techtoolsImage2mbToolFixReportFile)) failures.push("Missing TechTools image under 2MB tool-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsImage2mbToolFixReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=177") || !report.includes("image_2mb_tool_fix_2026_06") || !report.includes("compress_image_kb_tool_target_2mb")) failures.push("TechTools image under 2MB tool-fix submission report missing live evidence.");
}
const techtoolsJpg200kbToolFixReportFile = path.join(root, "reports", "techtools-jpg-under-200kb-tool-fix-submit.json");
if (!fs.existsSync(techtoolsJpg200kbToolFixReportFile)) failures.push("Missing TechTools JPG under 200KB tool-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsJpg200kbToolFixReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=178") || !report.includes("jpg_200kb_tool_fix_2026_06") || !report.includes("compress_image_kb_tool_target_200kb")) failures.push("TechTools JPG under 200KB tool-fix submission report missing live evidence.");
}
for (const [reportName, shareUrl, campaign] of [
  ["techtools-signature-under-20kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=215", "signature_20kb_upload_fix_2026_06"],
  ["techtools-passport-photo-size-fixer-submit.json", "https://techtools.cz/tools/launchpad/?tool=216", "passport_photo_size_fixer_2026_06"],
  ["techtools-resize-photo-413x531-submit.json", "https://techtools.cz/tools/launchpad/?tool=217", "resize_photo_413x531_2026_06"],
  ["techtools-signature-under-50kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=218", "signature_50kb_upload_fix_2026_06"],
  ["techtools-resize-signature-140x60-submit.json", "https://techtools.cz/tools/launchpad/?tool=219", "resize_signature_140x60_2026_06"],
  ["techtools-photo-200x230-50kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=220", "photo_200x230_50kb_2026_06"],
  ["techtools-resize-signature-200x100-submit.json", "https://techtools.cz/tools/launchpad/?tool=221", "resize_signature_200x100_2026_06"],
  ["techtools-resize-photo-200x230-submit.json", "https://techtools.cz/tools/launchpad/?tool=222", "resize_photo_200x230_2026_06"],
  ["techtools-passport-photo-35x45mm-submit.json", "https://techtools.cz/tools/launchpad/?tool=223", "passport_photo_35x45mm_2026_06"],
  ["techtools-photo-240x320-50kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=230", "photo_240x320_50kb_2026_06"],
  ["techtools-photo-295x413-35kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=238", "photo_295x413_35kb_2026_06"],
  ["techtools-photo-354x472-100kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=239", "photo_354x472_100kb_2026_06"],
  ["techtools-photo-413x531-50kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=231", "photo_413x531_50kb_2026_06"],
  ["techtools-photo-300x300-100kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=232", "photo_300x300_100kb_2026_06"],
  ["techtools-photo-600x600-100kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=233", "photo_600x600_100kb_2026_06"],
  ["techtools-signature-150x50-20kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=234", "signature_150x50_20kb_2026_06"],
  ["techtools-signature-200x50-20kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=235", "signature_200x50_20kb_2026_06"],
  ["techtools-signature-300x80-50kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=236", "signature_300x80_50kb_2026_06"],
  ["techtools-signature-300x100-50kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=237", "signature_300x100_50kb_2026_06"],
  ["techtools-photo-480x640-200kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=240", "photo_480x640_200kb_2026_06"],
  ["techtools-photo-512x512-100kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=241", "photo_512x512_100kb_2026_06"],
  ["techtools-signature-160x70-20kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=242", "signature_160x70_20kb_2026_06"],
  ["techtools-signature-250x80-50kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=243", "signature_250x80_50kb_2026_06"],
  ["techtools-signature-300x60-20kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=244", "signature_300x60_20kb_2026_06"],
  ["techtools-signature-400x150-50kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=245", "signature_400x150_50kb_2026_06"],
  ["techtools-photo-150x200-20kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=246", "photo_150x200_20kb_2026_06"],
  ["techtools-photo-180x240-50kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=247", "photo_180x240_50kb_2026_06"],
  ["techtools-photo-400x514-100kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=248", "photo_400x514_100kb_2026_06"],
  ["techtools-photo-600x800-200kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=249", "photo_600x800_200kb_2026_06"],
  ["techtools-photo-120x160-20kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=263", "photo_120x160_20kb_2026_06"],
  ["techtools-photo-160x200-30kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=264", "photo_160x200_30kb_2026_06"],
  ["techtools-photo-300x400-100kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=265", "photo_300x400_100kb_2026_06"],
  ["techtools-photo-350x450-100kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=266", "photo_350x450_100kb_2026_06"],
  ["techtools-photo-360x480-100kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=267", "photo_360x480_100kb_2026_06"],
  ["techtools-photo-420x560-200kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=268", "photo_420x560_200kb_2026_06"],
  ["techtools-signature-100x50-10kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=250", "signature_100x50_10kb_2026_06"],
  ["techtools-signature-200x60-20kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=251", "signature_200x60_20kb_2026_06"],
  ["techtools-signature-256x64-20kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=252", "signature_256x64_20kb_2026_06"],
  ["techtools-signature-400x200-100kb-submit.json", "https://techtools.cz/tools/launchpad/?tool=253", "signature_400x200_100kb_2026_06"],
]) {
  const reportFile = path.join(root, "reports", reportName);
  if (!fs.existsSync(reportFile)) failures.push(`Missing TechTools high-intent photo/signature submission evidence report: ${reportName}`);
  else {
    const report = fs.readFileSync(reportFile, "utf8");
    if (!report.includes(shareUrl) || !report.includes(campaign)) failures.push(`TechTools high-intent photo/signature submission report missing live evidence: ${reportName}`);
  }
}
const techtoolsLatestExactRateLimitFile = path.join(root, "reports", "techtools-upload-error-backlog-rate-limit.json");
const techtoolsLatestExactRateLimitReport = fs.existsSync(techtoolsLatestExactRateLimitFile) ? fs.readFileSync(techtoolsLatestExactRateLimitFile, "utf8") : "";
const techtoolsUploadBacklogScriptFile = path.join(root, "scripts", "submit-techtools-upload-error-backlog.cjs");
const techtoolsUploadBacklogScript = fs.existsSync(techtoolsUploadBacklogScriptFile) ? fs.readFileSync(techtoolsUploadBacklogScriptFile, "utf8") : "";
if (!techtoolsLatestExactRateLimitReport && !techtoolsUploadBacklogScript) failures.push("Missing TechTools latest exact upload-limit retry evidence.");
for (const [pending, reportName, campaign] of [
  ["Signature 100x50 Under 10KB", "techtools-signature-100x50-10kb-submit.json", "signature_100x50_10kb_2026_06"],
  ["Signature 200x60 Under 20KB", "techtools-signature-200x60-20kb-submit.json", "signature_200x60_20kb_2026_06"],
  ["Signature 256x64 Under 20KB", "techtools-signature-256x64-20kb-submit.json", "signature_256x64_20kb_2026_06"],
  ["Signature 400x200 Under 100KB", "techtools-signature-400x200-100kb-submit.json", "signature_400x200_100kb_2026_06"],
]) {
  const reportFile = path.join(root, "reports", reportName);
  if (fs.existsSync(reportFile)) {
    const report = fs.readFileSync(reportFile, "utf8");
    if (!report.includes(campaign) || !report.includes("https://techtools.cz/tools/launchpad/?tool=")) failures.push(`TechTools exact upload-limit report missing live evidence: ${reportName}`);
  } else if (!techtoolsLatestExactRateLimitReport.includes(pending) && (!techtoolsUploadBacklogScript.includes(pending) || !techtoolsUploadBacklogScript.includes(campaign))) {
    failures.push(`TechTools exact upload-limit item is neither live, rate-limited, nor queued for retry: ${pending}.`);
  }
}
const techtoolsResumePdfTooLargeReportFile = path.join(root, "reports", "techtools-resume-pdf-too-large-upload-fix-submit.json");
if (!fs.existsSync(techtoolsResumePdfTooLargeReportFile)) failures.push("Missing TechTools resume PDF too large upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsResumePdfTooLargeReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=179") || !report.includes("resume_pdf_too_large_fix_2026_06") || !report.includes("compress_pdf_resume_1mb_fix")) failures.push("TechTools resume PDF too large upload-fix submission report missing live evidence.");
}
const techtoolsPngScreenshotTooLargeReportFile = path.join(root, "reports", "techtools-png-screenshot-too-large-upload-fix-submit.json");
if (!fs.existsSync(techtoolsPngScreenshotTooLargeReportFile)) failures.push("Missing TechTools PNG screenshot too large upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPngScreenshotTooLargeReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=180") || !report.includes("png_screenshot_too_large_fix_2026_06") || !report.includes("compress_image_kb_png_500kb_fix")) failures.push("TechTools PNG screenshot too large upload-fix submission report missing live evidence.");
}
const techtoolsPassportPhoto50kbReportFile = path.join(root, "reports", "techtools-passport-photo-50kb-upload-fix-submit.json");
if (!fs.existsSync(techtoolsPassportPhoto50kbReportFile)) failures.push("Missing TechTools passport photo 50KB upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPassportPhoto50kbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=181") || !report.includes("passport_photo_50kb_fix_2026_06") || !report.includes("compress_image_kb_passport_50kb_fix")) failures.push("TechTools passport photo 50KB upload-fix submission report missing live evidence.");
}
const techtoolsPdf500kbReportFile = path.join(root, "reports", "techtools-pdf-under-500kb-upload-fix-submit.json");
if (!fs.existsSync(techtoolsPdf500kbReportFile)) failures.push("Missing TechTools PDF under 500KB upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPdf500kbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=182") || !report.includes("pdf_500kb_tool_fix_2026_06") || !report.includes("compress_pdf_tool_target_500kb")) failures.push("TechTools PDF under 500KB upload-fix submission report missing live evidence.");
}
const techtoolsImage500kbReportFile = path.join(root, "reports", "techtools-image-under-500kb-upload-fix-submit.json");
if (!fs.existsSync(techtoolsImage500kbReportFile)) failures.push("Missing TechTools image under 500KB upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsImage500kbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=183") || !report.includes("image_500kb_tool_fix_2026_06") || !report.includes("compress_image_kb_tool_target_500kb")) failures.push("TechTools image under 500KB upload-fix submission report missing live evidence.");
}
const techtoolsImageDimensions600ReportFile = path.join(root, "reports", "techtools-image-dimensions-600x600-upload-fix-submit.json");
if (!fs.existsSync(techtoolsImageDimensions600ReportFile)) failures.push("Missing TechTools image dimensions 600x600 upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsImageDimensions600ReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=184") || !report.includes("image_dimensions_600x600_fix_2026_06") || !report.includes("Image Dimensions 600x600 Upload Fix")) failures.push("TechTools image dimensions 600x600 upload-fix submission report missing live evidence.");
}
const techtoolsPdfNotAcceptedJpgReportFile = path.join(root, "reports", "techtools-pdf-not-accepted-jpg-required-submit.json");
if (!fs.existsSync(techtoolsPdfNotAcceptedJpgReportFile)) failures.push("Missing TechTools PDF not accepted JPG required submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPdfNotAcceptedJpgReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=185") || !report.includes("pdf_not_accepted_jpg_required_fix_2026_06") || !report.includes("PDF Not Accepted JPG Required Fix")) failures.push("TechTools PDF not accepted JPG required submission report missing live evidence.");
}
const techtoolsEmailAttachmentTooLargeReportFile = path.join(root, "reports", "techtools-email-attachment-too-large-upload-fix-submit.json");
if (!fs.existsSync(techtoolsEmailAttachmentTooLargeReportFile)) failures.push("Missing TechTools email attachment too large submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsEmailAttachmentTooLargeReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=186") || !report.includes("email_attachment_too_large_fix_2026_06") || !report.includes("Email Attachment Too Large PDF Fix")) failures.push("TechTools email attachment too large submission report missing live evidence.");
}
const techtoolsPdfUnder2mbReportFile = path.join(root, "reports", "techtools-pdf-under-2mb-upload-fix-submit.json");
if (!fs.existsSync(techtoolsPdfUnder2mbReportFile)) failures.push("Missing TechTools PDF under 2MB upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPdfUnder2mbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=201") || !report.includes("pdf_under_2mb_upload_fix_2026_06") || !report.includes("PDF Under 2MB Upload Fix")) failures.push("TechTools PDF under 2MB upload-fix submission report missing live evidence.");
}
const techtoolsPdfUnder5mbReportFile = path.join(root, "reports", "techtools-pdf-under-5mb-upload-fix-submit.json");
if (!fs.existsSync(techtoolsPdfUnder5mbReportFile)) failures.push("Missing TechTools PDF under 5MB upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPdfUnder5mbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=202") || !report.includes("pdf_under_5mb_upload_fix_2026_06") || !report.includes("PDF Under 5MB Upload Fix")) failures.push("TechTools PDF under 5MB upload-fix submission report missing live evidence.");
}
const techtoolsResumePdfUnder2mbReportFile = path.join(root, "reports", "techtools-resume-pdf-under-2mb-upload-fix-submit.json");
if (!fs.existsSync(techtoolsResumePdfUnder2mbReportFile)) failures.push("Missing TechTools resume PDF under 2MB upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsResumePdfUnder2mbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=203") || !report.includes("resume_pdf_under_2mb_upload_fix_2026_06") || !report.includes("Resume PDF Under 2MB Upload Fix")) failures.push("TechTools resume PDF under 2MB upload-fix submission report missing live evidence.");
}
const techtoolsDocumentUnder5mbReportFile = path.join(root, "reports", "techtools-document-under-5mb-upload-fix-submit.json");
if (!fs.existsSync(techtoolsDocumentUnder5mbReportFile)) failures.push("Missing TechTools document under 5MB upload-fix submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsDocumentUnder5mbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=204") || !report.includes("document_under_5mb_upload_fix_2026_06") || !report.includes("Document Under 5MB Upload Fix")) failures.push("TechTools document under 5MB upload-fix submission report missing live evidence.");
}
const techtoolsPdfSizeReducerReportFile = path.join(root, "reports", "techtools-pdf-size-reducer-submit.json");
if (!fs.existsSync(techtoolsPdfSizeReducerReportFile)) failures.push("Missing TechTools PDF size reducer submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPdfSizeReducerReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=205") || !report.includes("pdf_size_reducer_2026_06") || !report.includes("PDF Size Reducer")) failures.push("TechTools PDF size reducer submission report missing live evidence.");
}
const techtoolsCompressPdf2mbReportFile = path.join(root, "reports", "techtools-compress-pdf-to-2mb-submit.json");
if (!fs.existsSync(techtoolsCompressPdf2mbReportFile)) failures.push("Missing TechTools compress PDF to 2MB submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsCompressPdf2mbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=206") || !report.includes("pdf_2mb_2026_06") || !report.includes("Compress PDF to 2MB")) failures.push("TechTools compress PDF to 2MB submission report missing live evidence.");
}
const techtoolsCompressPdf5mbReportFile = path.join(root, "reports", "techtools-compress-pdf-to-5mb-submit.json");
if (!fs.existsSync(techtoolsCompressPdf5mbReportFile)) failures.push("Missing TechTools compress PDF to 5MB submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsCompressPdf5mbReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=207") || !report.includes("pdf_5mb_2026_06") || !report.includes("Compress PDF to 5MB")) failures.push("TechTools compress PDF to 5MB submission report missing live evidence.");
}
for (const [label, reportName, campaign, liveUrl, title] of [
  ["compress PDF to 100KB", "techtools-compress-pdf-to-100kb-submit.json", "pdf_100kb_2026_06", "https://techtools.cz/tools/launchpad/?tool=255", "Compress PDF to 100KB"],
  ["compress PDF to 200KB", "techtools-compress-pdf-to-200kb-submit.json", "pdf_200kb_2026_06", "https://techtools.cz/tools/launchpad/?tool=256", "Compress PDF to 200KB"],
  ["compress PDF to 300KB", "techtools-compress-pdf-to-300kb-submit.json", "pdf_300kb_2026_06", "https://techtools.cz/tools/launchpad/?tool=257", "Compress PDF to 300KB"],
  ["compress PDF to 10MB", "techtools-compress-pdf-to-10mb-submit.json", "pdf_10mb_2026_06", "https://techtools.cz/tools/launchpad/?tool=258", "Compress PDF to 10MB"],
  ["PDF must be under 100KB", "techtools-pdf-must-be-under-100kb-submit.json", "pdf_under_100kb_upload_fix_2026_06", "https://techtools.cz/tools/launchpad/?tool=259", "PDF Must Be Under 100KB Fix"],
  ["PDF must be under 200KB", "techtools-pdf-must-be-under-200kb-submit.json", "pdf_under_200kb_upload_fix_2026_06", "https://techtools.cz/tools/launchpad/?tool=260", "PDF Must Be Under 200KB Fix"],
  ["PDF must be under 300KB", "techtools-pdf-must-be-under-300kb-submit.json", "pdf_under_300kb_upload_fix_2026_06", "https://techtools.cz/tools/launchpad/?tool=261", "PDF Must Be Under 300KB Fix"],
  ["PDF must be under 10MB", "techtools-pdf-must-be-under-10mb-submit.json", "pdf_under_10mb_upload_fix_2026_06", "https://techtools.cz/tools/launchpad/?tool=262", "PDF Must Be Under 10MB Fix"],
  ["photo 120x160 under 20KB", "techtools-photo-120x160-20kb-submit.json", "photo_120x160_20kb_2026_06", "https://techtools.cz/tools/launchpad/?tool=263", "Photo 120x160 Under 20KB"],
  ["photo 160x200 under 30KB", "techtools-photo-160x200-30kb-submit.json", "photo_160x200_30kb_2026_06", "https://techtools.cz/tools/launchpad/?tool=264", "Photo 160x200 Under 30KB"],
  ["photo 300x400 under 100KB", "techtools-photo-300x400-100kb-submit.json", "photo_300x400_100kb_2026_06", "https://techtools.cz/tools/launchpad/?tool=265", "Photo 300x400 Under 100KB"],
  ["photo 350x450 under 100KB", "techtools-photo-350x450-100kb-submit.json", "photo_350x450_100kb_2026_06", "https://techtools.cz/tools/launchpad/?tool=266", "Photo 350x450 Under 100KB"],
  ["photo 360x480 under 100KB", "techtools-photo-360x480-100kb-submit.json", "photo_360x480_100kb_2026_06", "https://techtools.cz/tools/launchpad/?tool=267", "Photo 360x480 Under 100KB"],
  ["photo 420x560 under 200KB", "techtools-photo-420x560-200kb-submit.json", "photo_420x560_200kb_2026_06", "https://techtools.cz/tools/launchpad/?tool=268", "Photo 420x560 Under 200KB"],
]) {
  const reportFile = path.join(root, "reports", reportName);
  if (!fs.existsSync(reportFile)) failures.push(`Missing TechTools ${label} submission evidence report.`);
  else {
    const report = fs.readFileSync(reportFile, "utf8");
    if (!report.includes(liveUrl) || !report.includes(campaign) || !report.includes(title)) failures.push(`TechTools ${label} submission report missing live evidence.`);
  }
}
const techtoolsCompressPdfNoUploadReportFile = path.join(root, "reports", "techtools-compress-pdf-no-upload-submit.json");
if (!fs.existsSync(techtoolsCompressPdfNoUploadReportFile)) failures.push("Missing TechTools compress PDF without uploading submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsCompressPdfNoUploadReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=208") || !report.includes("compress_pdf_no_upload_2026_06") || !report.includes("Compress PDF Without Uploading")) failures.push("TechTools compress PDF without uploading submission report missing live evidence.");
}
const techtoolsPdfToJpgNoUploadReportFile = path.join(root, "reports", "techtools-pdf-to-jpg-no-upload-submit.json");
if (!fs.existsSync(techtoolsPdfToJpgNoUploadReportFile)) failures.push("Missing TechTools PDF to JPG without uploading submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsPdfToJpgNoUploadReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=209") || !report.includes("pdf_to_jpg_no_upload_2026_06") || !report.includes("PDF to JPG Without Uploading")) failures.push("TechTools PDF to JPG without uploading submission report missing live evidence.");
}
const techtoolsJpgToPdfNoUploadReportFile = path.join(root, "reports", "techtools-jpg-to-pdf-no-upload-submit.json");
if (!fs.existsSync(techtoolsJpgToPdfNoUploadReportFile)) failures.push("Missing TechTools JPG to PDF without uploading submission evidence report.");
else {
  const report = fs.readFileSync(techtoolsJpgToPdfNoUploadReportFile, "utf8");
  if (!report.includes("https://techtools.cz/tools/launchpad/?tool=210") || !report.includes("jpg_to_pdf_no_upload_2026_06") || !report.includes("JPG to PDF Without Uploading")) failures.push("TechTools JPG to PDF without uploading submission report missing live evidence.");
}
for (const [label, fileName, campaign, liveUrl, title] of [
  ["extract text from PDF without uploading", "techtools-extract-text-from-pdf-no-upload-submit.json", "extract_text_pdf_no_upload_2026_06", "https://techtools.cz/tools/launchpad/?tool=212", "Extract Text From PDF Without Uploading"],
  ["merge PDF without uploading", "techtools-merge-pdf-no-upload-submit.json", "merge_pdf_no_upload_2026_06", "https://techtools.cz/tools/launchpad/?tool=213", "Merge PDF Without Uploading"],
  ["split PDF without uploading", "techtools-split-pdf-no-upload-submit.json", "split_pdf_no_upload_2026_06", "https://techtools.cz/tools/launchpad/?tool=214", "Split PDF Without Uploading"],
]) {
  const reportFile = path.join(root, "reports", fileName);
  if (!fs.existsSync(reportFile)) failures.push(`Missing TechTools ${label} submission evidence report.`);
  else {
    const report = fs.readFileSync(reportFile, "utf8");
    if (!report.includes(liveUrl) || !report.includes(campaign) || !report.includes(title)) failures.push(`TechTools ${label} submission report missing live evidence.`);
  }
}
if (!techtoolsUploadBacklogScript) failures.push("Missing TechTools upload-error backlog retry script.");
else {
  const script = techtoolsUploadBacklogScript;
  if (!script.includes("Image Dimensions 600x600 Upload Fix") || !script.includes("PDF Not Accepted JPG Required Fix") || !script.includes("Email Attachment Too Large PDF Fix") || !script.includes("PDF Under 2MB Upload Fix") || !script.includes("Resume PDF Under 2MB Upload Fix") || !script.includes("Document Under 5MB Upload Fix") || !script.includes("PDF Size Reducer") || !script.includes("Compress PDF to 100KB") || !script.includes("Compress PDF to 200KB") || !script.includes("Compress PDF to 300KB") || !script.includes("Compress PDF to 10MB") || !script.includes("PDF Must Be Under 100KB Fix") || !script.includes("PDF Must Be Under 200KB Fix") || !script.includes("PDF Must Be Under 300KB Fix") || !script.includes("PDF Must Be Under 10MB Fix") || !script.includes("Compress PDF to 2MB") || !script.includes("Compress PDF to 5MB") || !script.includes("Compress PDF Without Uploading") || !script.includes("PDF to JPG Without Uploading") || !script.includes("JPG to PDF Without Uploading") || !script.includes("Extract Text From PDF Without Uploading") || !script.includes("Merge PDF Without Uploading") || !script.includes("Split PDF Without Uploading") || !script.includes("Photo 120x160 Under 20KB") || !script.includes("Photo 160x200 Under 30KB") || !script.includes("Photo 300x400 Under 100KB") || !script.includes("Photo 350x450 Under 100KB") || !script.includes("Photo 360x480 Under 100KB") || !script.includes("Photo 420x560 Under 200KB") || !script.includes("Photo 150x200 Under 20KB") || !script.includes("Signature 400x200 Under 100KB") || !script.includes("rateLimited") || !script.includes("techtools-upload-error-backlog-rate-limit.json")) failures.push("TechTools upload-error backlog retry script missing remaining high-intent listing payloads or rate-limit handling.");
}
for (const [name, reportName, campaign, reviewUrl] of [
  ["PDF under 2MB", "nosignuptools-pdf-under-2mb-upload-fix-submit.json", "pdf_under_2mb_upload_fix_2026_06", "https://nosignuptools.com/tools/pdf-under-2mb-upload-fix-by-printabletools-lab"],
  ["PDF under 5MB", "nosignuptools-pdf-under-5mb-upload-fix-submit.json", "pdf_under_5mb_upload_fix_2026_06", "https://nosignuptools.com/tools/pdf-under-5mb-upload-fix-by-printabletools-lab"],
  ["resume PDF under 2MB", "nosignuptools-resume-pdf-under-2mb-upload-fix-submit.json", "resume_pdf_under_2mb_upload_fix_2026_06", "https://nosignuptools.com/tools/resume-pdf-under-2mb-upload-fix-by-printabletools-lab"],
  ["document under 5MB", "nosignuptools-document-under-5mb-upload-fix-submit.json", "document_under_5mb_upload_fix_2026_06", "https://nosignuptools.com/tools/document-under-5mb-upload-fix-by-printabletools-lab"],
  ["extract text from PDF without uploading", "nosignuptools-extract-text-from-pdf-no-upload-submit.json", "extract_text_pdf_no_upload_2026_06", "https://nosignuptools.com/tools/extract-text-from-pdf-without-uploading-by-printabletools-lab"],
  ["merge PDF without uploading", "nosignuptools-merge-pdf-no-upload-submit.json", "merge_pdf_no_upload_2026_06", "https://nosignuptools.com/tools/merge-pdf-without-uploading-by-printabletools-lab"],
  ["split PDF without uploading", "nosignuptools-split-pdf-no-upload-submit.json", "split_pdf_no_upload_2026_06", "https://nosignuptools.com/tools/split-pdf-without-uploading-by-printabletools-lab"],
  ["rotate PDF pages without uploading", "nosignuptools-rotate-pdf-no-upload-submit.json", "rotate_pdf_no_upload_2026_06", "https://nosignuptools.com/tools/rotate-pdf-pages-without-uploading-by-printabletools-lab"],
  ["remove pages from PDF without uploading", "nosignuptools-remove-pages-from-pdf-no-upload-submit.json", "remove_pages_pdf_no_upload_2026_06", "https://nosignuptools.com/tools/remove-pages-from-pdf-without-uploading-by-printabletools-lab"],
  ["reorder PDF pages without uploading", "nosignuptools-reorder-pdf-pages-no-upload-submit.json", "reorder_pdf_pages_no_upload_2026_06", "https://nosignuptools.com/tools/reorder-pdf-pages-without-uploading-by-printabletools-lab"],
  ["add page numbers to PDF", "nosignuptools-add-page-numbers-to-pdf-submit.json", "add_page_numbers_pdf_2026_06", "https://nosignuptools.com/tools/add-page-numbers-to-pdf-by-printabletools-lab"],
  ["stamp PDF without uploading", "nosignuptools-stamp-pdf-no-upload-submit.json", "stamp_pdf_no_upload_2026_06", "https://nosignuptools.com/tools/stamp-pdf-without-uploading-by-printabletools-lab"],
  ["sign PDF without uploading", "nosignuptools-sign-pdf-no-upload-submit.json", "sign_pdf_no_upload_2026_06", "https://nosignuptools.com/tools/sign-pdf-without-uploading-by-printabletools-lab"],
  ["compress image without uploading", "nosignuptools-compress-image-no-upload-submit.json", "compress_image_no_upload_2026_06", "https://nosignuptools.com/tools/compress-image-without-uploading-by-printabletools-lab"],
  ["resize image without uploading", "nosignuptools-resize-image-no-upload-submit.json", "resize_image_no_upload_2026_06", "https://nosignuptools.com/tools/resize-image-without-uploading-by-printabletools-lab"],
  ["convert image format without uploading", "nosignuptools-convert-image-format-no-upload-submit.json", "convert_image_format_no_upload_2026_06", "https://nosignuptools.com/tools/convert-image-format-without-uploading-by-printabletools-lab"],
  ["remove background without uploading", "nosignuptools-remove-background-no-upload-submit.json", "remove_background_no_upload_2026_06", "https://nosignuptools.com/tools/remove-background-without-uploading-by-printabletools-lab"],
  ["crop image without uploading", "nosignuptools-crop-image-no-upload-submit.json", "crop_image_no_upload_2026_06", "https://nosignuptools.com/tools/crop-image-without-uploading-by-printabletools-lab"],
  ["rotate image without uploading", "nosignuptools-rotate-image-no-upload-submit.json", "rotate_image_no_upload_2026_06", "https://nosignuptools.com/tools/rotate-image-without-uploading-by-printabletools-lab"],
  ["watermark image without uploading", "nosignuptools-watermark-image-no-upload-submit.json", "watermark_image_no_upload_2026_06", "https://nosignuptools.com/tools/watermark-image-without-uploading-by-printabletools-lab"],
  ["passport photo size fixer", "nosignuptools-passport-photo-size-fixer-submit.json", "passport_photo_size_fixer_2026_06", "https://nosignuptools.com/tools/passport-photo-size-fixer-by-printabletools-lab"],
  ["resize photo 413x531", "nosignuptools-resize-photo-413x531-submit.json", "resize_photo_413x531_2026_06", "https://nosignuptools.com/tools/resize-photo-413x531-by-printabletools-lab"],
  ["passport photo 35x45mm", "nosignuptools-passport-photo-35x45mm-submit.json", "passport_photo_35x45mm_2026_06", "https://nosignuptools.com/tools/passport-photo-35x45mm-by-printabletools-lab"],
  ["photo 200x230 under 50KB", "nosignuptools-photo-200x230-50kb-submit.json", "photo_200x230_50kb_2026_06", "https://nosignuptools.com/tools/photo-200x230-under-50kb-by-printabletools-lab"],
  ["resize photo 200x230", "nosignuptools-resize-photo-200x230-submit.json", "resize_photo_200x230_2026_06", "https://nosignuptools.com/tools/resize-photo-200x230-by-printabletools-lab"],
  ["signature under 20KB", "nosignuptools-signature-under-20kb-submit.json", "signature_20kb_upload_fix_2026_06", "https://nosignuptools.com/tools/signature-under-20kb-by-printabletools-lab"],
  ["signature under 50KB", "nosignuptools-signature-under-50kb-submit.json", "signature_50kb_upload_fix_2026_06", "https://nosignuptools.com/tools/signature-under-50kb-by-printabletools-lab"],
  ["resize signature 140x60", "nosignuptools-resize-signature-140x60-submit.json", "resize_signature_140x60_2026_06", "https://nosignuptools.com/tools/resize-signature-140x60-by-printabletools-lab"],
  ["resize signature 200x100", "nosignuptools-resize-signature-200x100-submit.json", "resize_signature_200x100_2026_06", "https://nosignuptools.com/tools/resize-signature-200x100-by-printabletools-lab"],
  ["compress image to 10KB", "nosignuptools-compress-image-to-10kb-submit.json", "image_10kb_2026_06", "https://nosignuptools.com/tools/compress-image-to-10kb-by-printabletools-lab"],
  ["compress image to 20KB", "nosignuptools-compress-image-to-20kb-submit.json", "image_20kb_2026_06", "https://nosignuptools.com/tools/compress-image-to-20kb-by-printabletools-lab"],
  ["compress image to 30KB", "nosignuptools-compress-image-to-30kb-submit.json", "image_30kb_2026_06", "https://nosignuptools.com/tools/compress-image-to-30kb-by-printabletools-lab"],
  ["compress image to 150KB", "nosignuptools-compress-image-to-150kb-submit.json", "image_150kb_2026_06", "https://nosignuptools.com/tools/compress-image-to-150kb-by-printabletools-lab"],
  ["compress image to 300KB", "nosignuptools-compress-image-to-300kb-submit.json", "image_300kb_2026_06", "https://nosignuptools.com/tools/compress-image-to-300kb-by-printabletools-lab"],
  ["compress image to 500KB", "nosignuptools-compress-image-to-500kb-submit.json", "image_500kb_2026_06", "https://nosignuptools.com/tools/compress-image-to-500kb-by-printabletools-lab"],
  ["compress PDF to 100KB", "nosignuptools-compress-pdf-to-100kb-submit.json", "pdf_100kb_2026_06", "https://nosignuptools.com/tools/compress-pdf-to-100kb-by-printabletools-lab"],
  ["compress PDF to 200KB", "nosignuptools-compress-pdf-to-200kb-submit.json", "pdf_200kb_2026_06", "https://nosignuptools.com/tools/compress-pdf-to-200kb-by-printabletools-lab"],
  ["compress PDF to 300KB", "nosignuptools-compress-pdf-to-300kb-submit.json", "pdf_300kb_2026_06", "https://nosignuptools.com/tools/compress-pdf-to-300kb-by-printabletools-lab"],
  ["compress PDF to 500KB", "nosignuptools-compress-pdf-to-500kb-submit.json", "pdf_500kb_2026_06", "https://nosignuptools.com/tools/compress-pdf-to-500kb-by-printabletools-lab"],
  ["compress PDF to 1MB", "nosignuptools-compress-pdf-to-1mb-submit.json", "pdf_1mb_2026_06", "https://nosignuptools.com/tools/compress-pdf-to-1mb-by-printabletools-lab"],
  ["compress PDF to 2MB", "nosignuptools-compress-pdf-to-2mb-submit.json", "pdf_2mb_2026_06", "https://nosignuptools.com/tools/compress-pdf-to-2mb-by-printabletools-lab"],
  ["compress PDF to 5MB", "nosignuptools-compress-pdf-to-5mb-submit.json", "pdf_5mb_2026_06", "https://nosignuptools.com/tools/compress-pdf-to-5mb-by-printabletools-lab"],
  ["compress PDF to 10MB", "nosignuptools-compress-pdf-to-10mb-submit.json", "pdf_10mb_2026_06", "https://nosignuptools.com/tools/compress-pdf-to-10mb-by-printabletools-lab"],
  ["PDF size reducer", "nosignuptools-pdf-size-reducer-submit.json", "pdf_size_reducer_2026_06", "https://nosignuptools.com/tools/pdf-size-reducer-by-printabletools-lab"],
  ["file under 1MB", "nosignuptools-file-must-be-less-than-1mb-submit.json", "file_under_1mb_upload_fix_2026_06", "https://nosignuptools.com/tools/file-must-be-less-than-1mb-fix-by-printabletools-lab"],
  ["PDF under 100KB", "nosignuptools-pdf-must-be-under-100kb-submit.json", "pdf_under_100kb_upload_fix_2026_06", "https://nosignuptools.com/tools/pdf-must-be-under-100kb-fix-by-printabletools-lab"],
  ["PDF under 200KB", "nosignuptools-pdf-must-be-under-200kb-submit.json", "pdf_under_200kb_upload_fix_2026_06", "https://nosignuptools.com/tools/pdf-must-be-under-200kb-fix-by-printabletools-lab"],
  ["PDF under 300KB", "nosignuptools-pdf-must-be-under-300kb-submit.json", "pdf_under_300kb_upload_fix_2026_06", "https://nosignuptools.com/tools/pdf-must-be-under-300kb-fix-by-printabletools-lab"],
  ["PDF under 500KB", "nosignuptools-pdf-must-be-under-500kb-submit.json", "pdf_under_500kb_upload_fix_2026_06", "https://nosignuptools.com/tools/pdf-must-be-under-500kb-fix-by-printabletools-lab"],
  ["PDF under 10MB", "nosignuptools-pdf-must-be-under-10mb-submit.json", "pdf_under_10mb_upload_fix_2026_06", "https://nosignuptools.com/tools/pdf-must-be-under-10mb-fix-by-printabletools-lab"],
  ["photo under 100KB", "nosignuptools-photo-must-be-under-100kb-submit.json", "photo_under_100kb_upload_fix_2026_06", "https://nosignuptools.com/tools/photo-must-be-under-100kb-fix-by-printabletools-lab"],
  ["image under 500KB", "nosignuptools-image-must-be-under-500kb-submit.json", "image_under_500kb_upload_fix_2026_06", "https://nosignuptools.com/tools/image-must-be-under-500kb-fix-by-printabletools-lab"],
  ["image under 2MB", "nosignuptools-image-must-be-less-than-2mb-submit.json", "image_under_2mb_upload_fix_2026_06", "https://nosignuptools.com/tools/image-must-be-less-than-2mb-fix-by-printabletools-lab"],
  ["JPG under 200KB", "nosignuptools-jpg-must-be-under-200kb-submit.json", "jpg_under_200kb_upload_fix_2026_06", "https://nosignuptools.com/tools/jpg-must-be-under-200kb-fix-by-printabletools-lab"],
  ["PNG screenshot too large", "nosignuptools-png-screenshot-too-large-submit.json", "png_screenshot_too_large_fix_2026_06", "https://nosignuptools.com/tools/png-screenshot-too-large-fix-by-printabletools-lab"],
  ["photo 240x320 under 50KB", "nosignuptools-photo-240x320-50kb-submit.json", "photo_240x320_50kb_2026_06", "https://nosignuptools.com/tools/photo-240x320-under-50kb-by-printabletools-lab"],
  ["photo 295x413 under 35KB", "nosignuptools-photo-295x413-35kb-submit.json", "photo_295x413_35kb_2026_06", "https://nosignuptools.com/tools/photo-295x413-under-35kb-by-printabletools-lab"],
  ["photo 413x531 under 50KB", "nosignuptools-photo-413x531-50kb-submit.json", "photo_413x531_50kb_2026_06", "https://nosignuptools.com/tools/photo-413x531-under-50kb-by-printabletools-lab"],
  ["photo 354x472 under 100KB", "nosignuptools-photo-354x472-100kb-submit.json", "photo_354x472_100kb_2026_06", "https://nosignuptools.com/tools/photo-354x472-under-100kb-by-printabletools-lab"],
  ["photo 300x300 under 100KB", "nosignuptools-photo-300x300-100kb-submit.json", "photo_300x300_100kb_2026_06", "https://nosignuptools.com/tools/photo-300x300-under-100kb-by-printabletools-lab"],
  ["photo 600x600 under 100KB", "nosignuptools-photo-600x600-100kb-submit.json", "photo_600x600_100kb_2026_06", "https://nosignuptools.com/tools/photo-600x600-under-100kb-by-printabletools-lab"],
  ["photo 480x640 under 200KB", "nosignuptools-photo-480x640-200kb-submit.json", "photo_480x640_200kb_2026_06", "https://nosignuptools.com/tools/photo-480x640-under-200kb-by-printabletools-lab"],
  ["photo 512x512 under 100KB", "nosignuptools-photo-512x512-100kb-submit.json", "photo_512x512_100kb_2026_06", "https://nosignuptools.com/tools/photo-512x512-under-100kb-by-printabletools-lab"],
  ["photo 150x200 under 20KB", "nosignuptools-photo-150x200-20kb-submit.json", "photo_150x200_20kb_2026_06", "https://nosignuptools.com/tools/photo-150x200-under-20kb-by-printabletools-lab"],
  ["photo 180x240 under 50KB", "nosignuptools-photo-180x240-50kb-submit.json", "photo_180x240_50kb_2026_06", "https://nosignuptools.com/tools/photo-180x240-under-50kb-by-printabletools-lab"],
  ["photo 400x514 under 100KB", "nosignuptools-photo-400x514-100kb-submit.json", "photo_400x514_100kb_2026_06", "https://nosignuptools.com/tools/photo-400x514-under-100kb-by-printabletools-lab"],
  ["photo 600x800 under 200KB", "nosignuptools-photo-600x800-200kb-submit.json", "photo_600x800_200kb_2026_06", "https://nosignuptools.com/tools/photo-600x800-under-200kb-by-printabletools-lab"],
  ["photo 120x160 under 20KB", "nosignuptools-photo-120x160-20kb-submit.json", "photo_120x160_20kb_2026_06", "https://nosignuptools.com/tools/photo-120x160-under-20kb-by-printabletools-lab"],
  ["photo 160x200 under 30KB", "nosignuptools-photo-160x200-30kb-submit.json", "photo_160x200_30kb_2026_06", "https://nosignuptools.com/tools/photo-160x200-under-30kb-by-printabletools-lab"],
  ["photo 300x400 under 100KB", "nosignuptools-photo-300x400-100kb-submit.json", "photo_300x400_100kb_2026_06", "https://nosignuptools.com/tools/photo-300x400-under-100kb-by-printabletools-lab"],
  ["photo 350x450 under 100KB", "nosignuptools-photo-350x450-100kb-submit.json", "photo_350x450_100kb_2026_06", "https://nosignuptools.com/tools/photo-350x450-under-100kb-by-printabletools-lab"],
  ["photo 360x480 under 100KB", "nosignuptools-photo-360x480-100kb-submit.json", "photo_360x480_100kb_2026_06", "https://nosignuptools.com/tools/photo-360x480-under-100kb-by-printabletools-lab"],
  ["photo 420x560 under 200KB", "nosignuptools-photo-420x560-200kb-submit.json", "photo_420x560_200kb_2026_06", "https://nosignuptools.com/tools/photo-420x560-under-200kb-by-printabletools-lab"],
  ["signature 150x50 under 20KB", "nosignuptools-signature-150x50-20kb-submit.json", "signature_150x50_20kb_2026_06", "https://nosignuptools.com/tools/signature-150x50-under-20kb-by-printabletools-lab"],
  ["signature 160x70 under 20KB", "nosignuptools-signature-160x70-20kb-submit.json", "signature_160x70_20kb_2026_06", "https://nosignuptools.com/tools/signature-160x70-under-20kb-by-printabletools-lab"],
  ["signature 200x50 under 20KB", "nosignuptools-signature-200x50-20kb-submit.json", "signature_200x50_20kb_2026_06", "https://nosignuptools.com/tools/signature-200x50-under-20kb-by-printabletools-lab"],
  ["signature 250x80 under 50KB", "nosignuptools-signature-250x80-50kb-submit.json", "signature_250x80_50kb_2026_06", "https://nosignuptools.com/tools/signature-250x80-under-50kb-by-printabletools-lab"],
  ["signature 300x60 under 20KB", "nosignuptools-signature-300x60-20kb-submit.json", "signature_300x60_20kb_2026_06", "https://nosignuptools.com/tools/signature-300x60-under-20kb-by-printabletools-lab"],
  ["signature 300x80 under 50KB", "nosignuptools-signature-300x80-50kb-submit.json", "signature_300x80_50kb_2026_06", "https://nosignuptools.com/tools/signature-300x80-under-50kb-by-printabletools-lab"],
  ["signature 300x100 under 50KB", "nosignuptools-signature-300x100-50kb-submit.json", "signature_300x100_50kb_2026_06", "https://nosignuptools.com/tools/signature-300x100-under-50kb-by-printabletools-lab"],
  ["signature 400x150 under 50KB", "nosignuptools-signature-400x150-50kb-submit.json", "signature_400x150_50kb_2026_06", "https://nosignuptools.com/tools/signature-400x150-under-50kb-by-printabletools-lab"],
  ["signature 100x50 under 10KB", "nosignuptools-signature-100x50-10kb-submit.json", "signature_100x50_10kb_2026_06", "https://nosignuptools.com/tools/signature-100x50-under-10kb-by-printabletools-lab"],
  ["signature 200x60 under 20KB", "nosignuptools-signature-200x60-20kb-submit.json", "signature_200x60_20kb_2026_06", "https://nosignuptools.com/tools/signature-200x60-under-20kb-by-printabletools-lab"],
  ["signature 256x64 under 20KB", "nosignuptools-signature-256x64-20kb-submit.json", "signature_256x64_20kb_2026_06", "https://nosignuptools.com/tools/signature-256x64-under-20kb-by-printabletools-lab"],
  ["signature 400x200 under 100KB", "nosignuptools-signature-400x200-100kb-submit.json", "signature_400x200_100kb_2026_06", "https://nosignuptools.com/tools/signature-400x200-under-100kb-by-printabletools-lab"],
]) {
  const reportFile = path.join(root, "reports", reportName);
  if (!fs.existsSync(reportFile)) failures.push(`Missing NoSignupTools ${name} submission evidence report.`);
  else {
    const report = fs.readFileSync(reportFile, "utf8");
    if (!report.includes('"ok": true') || !report.includes(campaign) || !report.includes(reviewUrl) || !report.includes("pending_manual_review")) failures.push(`NoSignupTools ${name} submission report missing API acceptance evidence.`);
  }
}
for (const [name, reportName, campaign, searchUrl] of [
  ["compress PDF to 100KB", "freenosignup-compress-pdf-to-100kb-submit.json", "pdf_100kb_2026_06", "https://freenosignup.com/?s=Compress+PDF+to+100KB"],
  ["compress PDF to 200KB", "freenosignup-compress-pdf-to-200kb-submit.json", "pdf_200kb_2026_06", "https://freenosignup.com/?s=Compress+PDF+to+200KB"],
  ["compress PDF to 300KB", "freenosignup-compress-pdf-to-300kb-submit.json", "pdf_300kb_2026_06", "https://freenosignup.com/?s=Compress+PDF+to+300KB"],
  ["compress PDF to 500KB", "freenosignup-compress-pdf-to-500kb-submit.json", "pdf_500kb_2026_06", "https://freenosignup.com/?s=Compress+PDF+to+500KB"],
  ["compress PDF to 1MB", "freenosignup-compress-pdf-to-1mb-submit.json", "pdf_1mb_2026_06", "https://freenosignup.com/?s=Compress+PDF+to+1MB"],
  ["compress PDF to 10MB", "freenosignup-compress-pdf-to-10mb-submit.json", "pdf_10mb_2026_06", "https://freenosignup.com/?s=Compress+PDF+to+10MB"],
  ["PDF under 100KB", "freenosignup-pdf-must-be-under-100kb-submit.json", "pdf_under_100kb_upload_fix_2026_06", "https://freenosignup.com/?s=PDF+Must+Be+Under+100KB+Fix"],
  ["PDF under 200KB", "freenosignup-pdf-must-be-under-200kb-submit.json", "pdf_under_200kb_upload_fix_2026_06", "https://freenosignup.com/?s=PDF+Must+Be+Under+200KB+Fix"],
  ["PDF under 300KB", "freenosignup-pdf-must-be-under-300kb-submit.json", "pdf_under_300kb_upload_fix_2026_06", "https://freenosignup.com/?s=PDF+Must+Be+Under+300KB+Fix"],
  ["PDF under 10MB", "freenosignup-pdf-must-be-under-10mb-submit.json", "pdf_under_10mb_upload_fix_2026_06", "https://freenosignup.com/?s=PDF+Must+Be+Under+10MB+Fix"],
  ["compress image to 100KB", "freenosignup-compress-image-to-100kb-submit.json", "image_100kb_2026_06", "https://freenosignup.com/?s=Compress+Image+to+100KB"],
  ["image under 500KB", "freenosignup-image-must-be-under-500kb-submit.json", "image_under_500kb_upload_fix_2026_06", "https://freenosignup.com/?s=Image+Must+Be+Under+500KB+Fix"],
  ["passport photo size fixer", "freenosignup-passport-photo-size-fixer-submit.json", "passport_photo_size_fixer_2026_06", "https://freenosignup.com/?s=Passport+Photo+Size+Fixer"],
  ["photo 200x230 under 50KB", "freenosignup-photo-200x230-50kb-submit.json", "photo_200x230_50kb_2026_06", "https://freenosignup.com/?s=Photo+200x230+Under+50KB"],
  ["photo 240x320 under 50KB", "freenosignup-photo-240x320-50kb-submit.json", "photo_240x320_50kb_2026_06", "https://freenosignup.com/?s=Photo+240x320+Under+50KB"],
  ["photo 295x413 under 35KB", "freenosignup-photo-295x413-35kb-submit.json", "photo_295x413_35kb_2026_06", "https://freenosignup.com/?s=Photo+295x413+Under+35KB"],
  ["photo 413x531 under 50KB", "freenosignup-photo-413x531-50kb-submit.json", "photo_413x531_50kb_2026_06", "https://freenosignup.com/?s=Photo+413x531+Under+50KB"],
  ["photo 354x472 under 100KB", "freenosignup-photo-354x472-100kb-submit.json", "photo_354x472_100kb_2026_06", "https://freenosignup.com/?s=Photo+354x472+Under+100KB"],
  ["photo 300x300 under 100KB", "freenosignup-photo-300x300-100kb-submit.json", "photo_300x300_100kb_2026_06", "https://freenosignup.com/?s=Photo+300x300+Under+100KB"],
  ["photo 600x600 under 100KB", "freenosignup-photo-600x600-100kb-submit.json", "photo_600x600_100kb_2026_06", "https://freenosignup.com/?s=Photo+600x600+Under+100KB"],
  ["photo 480x640 under 200KB", "freenosignup-photo-480x640-200kb-submit.json", "photo_480x640_200kb_2026_06", "https://freenosignup.com/?s=Photo+480x640+Under+200KB"],
  ["photo 512x512 under 100KB", "freenosignup-photo-512x512-100kb-submit.json", "photo_512x512_100kb_2026_06", "https://freenosignup.com/?s=Photo+512x512+Under+100KB"],
  ["photo 150x200 under 20KB", "freenosignup-photo-150x200-20kb-submit.json", "photo_150x200_20kb_2026_06", "https://freenosignup.com/?s=Photo+150x200+Under+20KB"],
  ["photo 180x240 under 50KB", "freenosignup-photo-180x240-50kb-submit.json", "photo_180x240_50kb_2026_06", "https://freenosignup.com/?s=Photo+180x240+Under+50KB"],
  ["photo 400x514 under 100KB", "freenosignup-photo-400x514-100kb-submit.json", "photo_400x514_100kb_2026_06", "https://freenosignup.com/?s=Photo+400x514+Under+100KB"],
  ["photo 600x800 under 200KB", "freenosignup-photo-600x800-200kb-submit.json", "photo_600x800_200kb_2026_06", "https://freenosignup.com/?s=Photo+600x800+Under+200KB"],
  ["photo 120x160 under 20KB", "freenosignup-photo-120x160-20kb-submit.json", "photo_120x160_20kb_2026_06", "https://freenosignup.com/?s=Photo+120x160+Under+20KB"],
  ["photo 160x200 under 30KB", "freenosignup-photo-160x200-30kb-submit.json", "photo_160x200_30kb_2026_06", "https://freenosignup.com/?s=Photo+160x200+Under+30KB"],
  ["photo 300x400 under 100KB", "freenosignup-photo-300x400-100kb-submit.json", "photo_300x400_100kb_2026_06", "https://freenosignup.com/?s=Photo+300x400+Under+100KB"],
  ["photo 350x450 under 100KB", "freenosignup-photo-350x450-100kb-submit.json", "photo_350x450_100kb_2026_06", "https://freenosignup.com/?s=Photo+350x450+Under+100KB"],
  ["photo 360x480 under 100KB", "freenosignup-photo-360x480-100kb-submit.json", "photo_360x480_100kb_2026_06", "https://freenosignup.com/?s=Photo+360x480+Under+100KB"],
  ["photo 420x560 under 200KB", "freenosignup-photo-420x560-200kb-submit.json", "photo_420x560_200kb_2026_06", "https://freenosignup.com/?s=Photo+420x560+Under+200KB"],
  ["signature under 20KB", "freenosignup-signature-under-20kb-submit.json", "signature_20kb_upload_fix_2026_06", "https://freenosignup.com/?s=Signature+Under+20KB"],
  ["signature 150x50 under 20KB", "freenosignup-signature-150x50-20kb-submit.json", "signature_150x50_20kb_2026_06", "https://freenosignup.com/?s=Signature+150x50+Under+20KB"],
  ["signature 160x70 under 20KB", "freenosignup-signature-160x70-20kb-submit.json", "signature_160x70_20kb_2026_06", "https://freenosignup.com/?s=Signature+160x70+Under+20KB"],
  ["signature 200x50 under 20KB", "freenosignup-signature-200x50-20kb-submit.json", "signature_200x50_20kb_2026_06", "https://freenosignup.com/?s=Signature+200x50+Under+20KB"],
  ["signature 250x80 under 50KB", "freenosignup-signature-250x80-50kb-submit.json", "signature_250x80_50kb_2026_06", "https://freenosignup.com/?s=Signature+250x80+Under+50KB"],
  ["signature 300x60 under 20KB", "freenosignup-signature-300x60-20kb-submit.json", "signature_300x60_20kb_2026_06", "https://freenosignup.com/?s=Signature+300x60+Under+20KB"],
  ["signature 300x80 under 50KB", "freenosignup-signature-300x80-50kb-submit.json", "signature_300x80_50kb_2026_06", "https://freenosignup.com/?s=Signature+300x80+Under+50KB"],
  ["signature 300x100 under 50KB", "freenosignup-signature-300x100-50kb-submit.json", "signature_300x100_50kb_2026_06", "https://freenosignup.com/?s=Signature+300x100+Under+50KB"],
  ["signature 400x150 under 50KB", "freenosignup-signature-400x150-50kb-submit.json", "signature_400x150_50kb_2026_06", "https://freenosignup.com/?s=Signature+400x150+Under+50KB"],
  ["signature 100x50 under 10KB", "freenosignup-signature-100x50-10kb-submit.json", "signature_100x50_10kb_2026_06", "https://freenosignup.com/?s=Signature+100x50+Under+10KB"],
  ["signature 200x60 under 20KB", "freenosignup-signature-200x60-20kb-submit.json", "signature_200x60_20kb_2026_06", "https://freenosignup.com/?s=Signature+200x60+Under+20KB"],
  ["signature 256x64 under 20KB", "freenosignup-signature-256x64-20kb-submit.json", "signature_256x64_20kb_2026_06", "https://freenosignup.com/?s=Signature+256x64+Under+20KB"],
  ["signature 400x200 under 100KB", "freenosignup-signature-400x200-100kb-submit.json", "signature_400x200_100kb_2026_06", "https://freenosignup.com/?s=Signature+400x200+Under+100KB"],
  ["resize signature 200x100", "freenosignup-resize-signature-200x100-submit.json", "resize_signature_200x100_2026_06", "https://freenosignup.com/?s=Resize+Signature+200x100"],
]) {
  const reportFile = path.join(root, "reports", reportName);
  if (!fs.existsSync(reportFile)) failures.push(`Missing FreeNoSignup ${name} submission evidence report.`);
  else {
    const report = fs.readFileSync(reportFile, "utf8");
    if (!report.includes('"ok": true') || !report.includes(campaign) || !report.includes(searchUrl) || !report.includes("pending_manual_review")) failures.push(`FreeNoSignup ${name} submission report missing Google Form confirmation evidence.`);
  }
}
const nosignuptoolsUploadBacklogScriptFile = path.join(root, "scripts", "submit-nosignuptools-upload-fix-pages.cjs");
if (!fs.existsSync(nosignuptoolsUploadBacklogScriptFile)) failures.push("Missing NoSignupTools upload-fix submission script.");
else {
  const script = fs.readFileSync(nosignuptoolsUploadBacklogScriptFile, "utf8");
  if (!script.includes("PDF Under 2MB Upload Fix") || !script.includes("PDF Under 5MB Upload Fix") || !script.includes("Resume PDF Under 2MB Upload Fix") || !script.includes("Document Under 5MB Upload Fix") || !script.includes("Extract Text From PDF Without Uploading") || !script.includes("Merge PDF Without Uploading") || !script.includes("Split PDF Without Uploading") || !script.includes("Rotate PDF Pages Without Uploading") || !script.includes("Remove Pages From PDF Without Uploading") || !script.includes("Reorder PDF Pages Without Uploading") || !script.includes("Add Page Numbers to PDF") || !script.includes("Stamp PDF Without Uploading") || !script.includes("Sign PDF Without Uploading") || !script.includes("Compress Image Without Uploading") || !script.includes("Resize Image Without Uploading") || !script.includes("Convert Image Format Without Uploading") || !script.includes("Remove Background Without Uploading") || !script.includes("Crop Image Without Uploading") || !script.includes("Rotate Image Without Uploading") || !script.includes("Watermark Image Without Uploading") || !script.includes("Passport Photo Size Fixer") || !script.includes("Resize Photo 413x531") || !script.includes("Passport Photo 35x45mm") || !script.includes("Photo 200x230 Under 50KB") || !script.includes("Resize Photo 200x230") || !script.includes("Signature Under 20KB") || !script.includes("Signature Under 50KB") || !script.includes("Resize Signature 140x60") || !script.includes("Resize Signature 200x100") || !script.includes("Compress Image to 10KB") || !script.includes("Compress PDF to 100KB") || !script.includes("Compress PDF to 200KB") || !script.includes("Compress PDF to 300KB") || !script.includes("Compress PDF to 10MB") || !script.includes("PDF Must Be Under 100KB Fix") || !script.includes("PDF Must Be Under 200KB Fix") || !script.includes("PDF Must Be Under 300KB Fix") || !script.includes("PDF Must Be Under 10MB Fix") || !script.includes("Compress PDF to 1MB") || !script.includes("PNG Screenshot Too Large Fix") || !script.includes("Photo 120x160 Under 20KB") || !script.includes("Photo 420x560 Under 200KB")) failures.push("NoSignupTools upload-fix submission script missing PDF/document/image no-upload/photo/signature/exact upload-limit payloads.");
}
const freenosignupUploadBacklogScriptFile = path.join(root, "scripts", "submit-freenosignup-upload-fix-pages.cjs");
if (!fs.existsSync(freenosignupUploadBacklogScriptFile)) failures.push("Missing FreeNoSignup upload-fix submission script.");
else {
  const script = fs.readFileSync(freenosignupUploadBacklogScriptFile, "utf8");
  if (!script.includes("Compress PDF to 100KB") || !script.includes("Compress PDF to 200KB") || !script.includes("Compress PDF to 300KB") || !script.includes("Compress PDF to 10MB") || !script.includes("PDF Must Be Under 100KB Fix") || !script.includes("PDF Must Be Under 200KB Fix") || !script.includes("PDF Must Be Under 300KB Fix") || !script.includes("PDF Must Be Under 10MB Fix") || !script.includes("Compress PDF to 500KB") || !script.includes("Image Must Be Under 500KB Fix") || !script.includes("Passport Photo Size Fixer") || !script.includes("Resize Signature 200x100") || !script.includes("Photo 120x160 Under 20KB") || !script.includes("Photo 420x560 Under 200KB") || !script.includes("formResponseUrl")) failures.push("FreeNoSignup upload-fix submission script missing exact upload-limit/photo/signature payloads.");
}
const nologinUploadBacklogScriptFile = path.join(root, "scripts", "submit-nologin-upload-fix-pages.cjs");
if (!fs.existsSync(nologinUploadBacklogScriptFile)) failures.push("Missing NoLogin upload-fix submission script.");
else {
  const script = fs.readFileSync(nologinUploadBacklogScriptFile, "utf8");
  if (!script.includes("latestExactUploadLimitBacklog") || !script.includes("Photo 150x200 Under 20KB") || !script.includes("Signature 400x200 Under 100KB") || !script.includes("global_recent_rate_limit_pending_retry")) failures.push("NoLogin upload-fix submission script missing queued exact upload-limit payloads or 24h rate-limit handling.");
}
const packageJsonFile = path.join(root, "package.json");
if (!fs.existsSync(packageJsonFile)) failures.push("Missing package.json.");
else {
  const packageJson = readJsonFile(packageJsonFile, {});
  if (packageJson.scripts?.["submit:techtools-upload-backlog"] !== "node scripts/submit-techtools-upload-error-backlog.cjs") failures.push("package.json missing TechTools upload-error backlog retry command.");
  if (packageJson.scripts?.["submit:freenosignup-upload-fix-pages"] !== "node scripts/submit-freenosignup-upload-fix-pages.cjs") failures.push("package.json missing FreeNoSignup upload-fix submission command.");
  if (packageJson.scripts?.["submit:nologin-upload-fix-pages"] !== "node scripts/submit-nologin-upload-fix-pages.cjs") failures.push("package.json missing NoLogin upload-fix submission command.");
}
const sponsorPublicRepliesFunctionFile = path.join(root, "functions", "api", "sponsor-public-replies.js");
if (!fs.existsSync(sponsorPublicRepliesFunctionFile)) failures.push("Missing sponsor public replies API function.");
else {
  const publicRepliesScript = fs.readFileSync(sponsorPublicRepliesFunctionFile, "utf8");
  if (!publicRepliesScript.includes("publicMetricsOnly") || !publicRepliesScript.includes("privateFields") || !publicRepliesScript.includes("GitHub issues API")) failures.push("Sponsor public replies API should expose only public-safe GitHub issue evidence.");
  if (!publicRepliesScript.includes("Do not treat zero as confirmed")) failures.push("Sponsor public replies API should warn when evidence is unavailable.");
}
const sponsorPublicReplyScriptFile = path.join(root, "scripts", "sponsor-public-reply-evidence.cjs");
if (!fs.existsSync(sponsorPublicReplyScriptFile)) failures.push("Missing sponsor public reply evidence script.");
else {
  const publicReplyScript = fs.readFileSync(sponsorPublicReplyScriptFile, "utf8");
  if (!publicReplyScript.includes("sponsor-public-reply-evidence.json") || !publicReplyScript.includes("publicMetricsOnly")) failures.push("Sponsor public reply evidence script should write a public-safe report.");
}
if (!fs.existsSync(servicePublicRequestsFunctionFile)) failures.push("Missing service public request API function.");
else {
  const servicePublicRequestScript = fs.readFileSync(servicePublicRequestsFunctionFile, "utf8");
  if (!servicePublicRequestScript.includes("publicMetricsOnly") || !servicePublicRequestScript.includes("privateFields") || !servicePublicRequestScript.includes("GitHub issues API")) failures.push("Service public request API should expose only public-safe GitHub issue evidence.");
  if (!servicePublicRequestScript.includes("service-request") || !servicePublicRequestScript.includes("business-review")) failures.push("Service public request API should use public-safe service request labels.");
  if (!servicePublicRequestScript.includes("invoiceFollowupRequestCount") || !servicePublicRequestScript.includes("uploadLimitFixPlanRequestCount") || !servicePublicRequestScript.includes("paidServiceRequestCount")) failures.push("Service public request API should summarize invoice follow-up, upload fix plan, and paid service request issues.");
  if (!servicePublicRequestScript.includes("Do not treat zero as confirmed")) failures.push("Service public request API should warn when evidence is unavailable.");
}
const servicePublicRequestScriptFile = path.join(root, "scripts", "service-public-request-evidence.cjs");
if (!fs.existsSync(servicePublicRequestScriptFile)) failures.push("Missing service public request evidence script.");
else {
  const publicServiceRequestScript = fs.readFileSync(servicePublicRequestScriptFile, "utf8");
  if (!publicServiceRequestScript.includes("service-public-request-evidence.json") || !publicServiceRequestScript.includes("publicMetricsOnly")) failures.push("Service public request evidence script should write a public-safe report.");
}
if (!fs.existsSync(sponsorLeadFunctionFile)) failures.push("Missing sponsor lead API function.");
else {
  const sponsorLeadScript = fs.readFileSync(sponsorLeadFunctionFile, "utf8");
  if (!sponsorLeadScript.includes("utmCampaign") || !sponsorLeadScript.includes("vertical")) failures.push("Sponsor lead API missing attribution persistence.");
  if (!sponsorLeadScript.includes("dealId") || !sponsorLeadScript.includes("DEAL_IDS")) failures.push("Sponsor lead API missing selected deal persistence.");
  if (!sponsorLeadScript.includes("COMMITMENT_LEVELS") || !sponsorLeadScript.includes("sponsor_invoice_request")) failures.push("Sponsor lead API missing invoice request commitment tracking.");
  if (!sponsorLeadScript.includes("body.deal")) failures.push("Sponsor lead API should accept deal-param attribution from outreach links.");
  if (!sponsorLeadScript.includes("fallbackPublicReplyUrl") || !sponsorLeadScript.includes('url.searchParams.set("body", body)') || !sponsorLeadScript.includes('url.searchParams.set("labels", "sponsor,partner,business-review")') || sponsorLeadScript.includes('url.searchParams.set("template", "sponsor-partner-inquiry.yml")')) failures.push("Sponsor lead API missing prefilled public-safe fallback reply URL.");
  if (!sponsorLeadScript.includes("dryRunFallback")) failures.push("Sponsor lead API missing no-write fallback validation path.");
  if (!sponsorLeadScript.includes("publicLeadSummary") || !sponsorLeadScript.includes("privateFields") || !sponsorLeadScript.includes("not exposed")) failures.push("Sponsor lead API should expose only public-safe lead summary counts.");
}
if (!fs.existsSync(serviceLeadFunctionFile)) failures.push("Missing service lead API function.");
else {
  const serviceLeadScript = fs.readFileSync(serviceLeadFunctionFile, "utf8");
  if (!serviceLeadScript.includes("service:lead:") || !serviceLeadScript.includes("service:lead_index")) failures.push("Service lead API should persist private leads and a public-safe index.");
  if (!serviceLeadScript.includes("service_request_intent") || !serviceLeadScript.includes("audit_request_intent") || !serviceLeadScript.includes("seller_checkout_intent")) failures.push("Service lead API should roll submitted leads into existing commercial intent metrics.");
  if (!serviceLeadScript.includes("invoice-followup-copy-pack") || !serviceLeadScript.includes("Invoice Follow-up Copy Pack")) failures.push("Service lead API missing invoice follow-up service type.");
  if (!serviceLeadScript.includes("upload-limit-fix-plan") || !serviceLeadScript.includes("Upload Limit Fix Plan")) failures.push("Service lead API missing upload limit fix plan service type.");
  if (!serviceLeadScript.includes("publicLeadSummary") || !serviceLeadScript.includes("privateFields") || !serviceLeadScript.includes("not exposed")) failures.push("Service lead API should expose only public-safe summary counts.");
  if (!serviceLeadScript.includes("fallbackPublicReplyUrl") || !serviceLeadScript.includes("Public-safe service request")) failures.push("Service lead API should provide a public-safe GitHub fallback.");
  if (!serviceLeadScript.includes('fallbackTemplate: "invoice-followup-copy-pack-service.yml"') || !serviceLeadScript.includes('fallbackTemplate: "upload-limit-fix-plan-service.yml"') || !serviceLeadScript.includes('url.searchParams.set("labels", "service-request,business-review")')) failures.push("Service lead API should route invoice and upload fix fallback issues to the public service request workflow.");
}
if (!fs.existsSync(sponsorProspectScriptFile)) failures.push("Missing sponsor prospect queue generator.");
else {
  const prospectScript = fs.readFileSync(sponsorProspectScriptFile, "utf8");
  if (!prospectScript.includes("sponsor-prospect-queue.json") || !prospectScript.includes("utm_content")) failures.push("Sponsor prospect generator missing private queue outputs or per-prospect tracking.");
  if (!prospectScript.includes("SPONSOR_DEALS") || !prospectScript.includes("proposalUrl") || !prospectScript.includes("dealRoomUrl") || !prospectScript.includes("suggestedDealPrice")) failures.push("Sponsor prospect generator missing proposal and deal-room offer targeting.");
  if (!prospectScript.includes("&deal=")) failures.push("Sponsor prospect generator missing explicit deal parameter for prefilled inquiries.");
  if (!prospectScript.includes("requestedCommitment") || !prospectScript.includes("&commitment=")) failures.push("Sponsor prospect generator missing invoice request commitment links.");
  if (!prospectScript.includes("sponsor-proposal") || !prospectScript.includes("sponsor_proposal")) failures.push("Sponsor prospect generator missing direct proposal outreach URLs.");
  if (!prospectScript.includes("sponsorPublicReplyUrl") || !prospectScript.includes("publicReplyUrl")) failures.push("Sponsor prospect generator missing public-safe reply fallback URLs.");
  if (!prospectScript.includes("contactFormMessage") || !prospectScript.includes("contactFormProposalUrl")) failures.push("Sponsor prospect generator missing short public contact form execution copy.");
  if (!prospectScript.includes("validationSignal") || !prospectScript.includes("invoice-generator has") || !prospectScript.includes("sponsor leads/invoice requests")) failures.push("Sponsor prospect generator should include current validation signals in outreach copy.");
  if (!prospectScript.includes("directory-monitor.json") || !prospectScript.includes("externalDiscoveryProof") || !prospectScript.includes("External discovery proof")) failures.push("Sponsor prospect generator should include public external discovery proof in outreach copy.");
}
if (!fs.existsSync(sponsorOutreachLogScriptFile)) failures.push("Missing sponsor outreach log script.");
else {
  const logScript = fs.readFileSync(sponsorOutreachLogScriptFile, "utf8");
  if (!logScript.includes("sponsor-outreach-log.json") || !logScript.includes("needsReplyEmail") || !logScript.includes("settled")) failures.push("Sponsor outreach log script missing status/evidence tracking.");
  if (!logScript.includes("proposalUrl") || !logScript.includes("dealRoomUrl") || !logScript.includes("suggestedDealTitle")) failures.push("Sponsor outreach log script missing proposal and deal-room follow-up fields.");
  if (!logScript.includes("publicReplyUrl") || !logScript.includes("publicReplyAvailable")) failures.push("Sponsor outreach log script missing public-safe reply fallback tracking.");
  if (!logScript.includes("publicReplyFallbackReady") || !logScript.includes("contactFormMessage") || !logScript.includes("contactFormProposalUrl")) failures.push("Sponsor outreach log script missing public reply fallback execution fields.");
  if (!logScript.includes("sponsor-contact-route-probe.json") || !logScript.includes("bestContactUrl") || !logScript.includes("contactRouteStatus") || !logScript.includes("contactRouteReady")) failures.push("Sponsor outreach log script missing contact-probe prioritization fields.");
  if (!logScript.includes("requiresAuthorizedSender") || !logScript.includes("contactRouteSubmissionBlockers")) failures.push("Sponsor outreach log script missing authorized-sender submission blockers.");
  if (!logScript.includes("validationSignal")) failures.push("Sponsor outreach log should preserve current validation signals for submission batches.");
  if (!logScript.includes("publicEmails") || !logScript.includes("mailtoDraft") || !logScript.includes("copyFirstAction") || !logScript.includes("executionBatchRows") || !logScript.includes("sponsor-execution-batch.json")) failures.push("Sponsor outreach log should generate execution-ready contact actions.");
}
if (!fs.existsSync(sponsorContactProbeScriptFile)) failures.push("Missing sponsor contact route probe script.");
else {
  const contactProbeScript = fs.readFileSync(sponsorContactProbeScriptFile, "utf8");
  if (!contactProbeScript.includes("sponsor-contact-route-probe.json") || !contactProbeScript.includes("contactFormMessage") || !contactProbeScript.includes("routeStatus")) failures.push("Sponsor contact probe missing route status report fields.");
  if (!contactProbeScript.includes("never submits forms") || !contactProbeScript.includes("fetchWithTimeout")) failures.push("Sponsor contact probe must remain read-only and timeout bounded.");
  if (!contactProbeScript.includes("extractFormFields") || !contactProbeScript.includes("submissionBlockers") || !contactProbeScript.includes("requiresAuthorizedSender")) failures.push("Sponsor contact probe missing form-field submission blockers.");
}
const sponsorIssueTemplateFile = path.join(root, ".github", "ISSUE_TEMPLATE", "sponsor-partner-inquiry.yml");
if (!fs.existsSync(sponsorIssueTemplateFile)) failures.push("Missing sponsor public issue template.");
else {
  const issueTemplate = fs.readFileSync(sponsorIssueTemplateFile, "utf8");
  if (!issueTemplate.includes("requested_next_step") || !issueTemplate.includes("Request pilot invoice review") || !issueTemplate.includes("proposal_url") || !issueTemplate.includes("selected_deal")) failures.push("Sponsor public issue template missing invoice review fallback fields.");
  if (!issueTemplate.includes("sponsor-starter-review") || !issueTemplate.includes("Starter fit review") || !issueTemplate.includes("Under USD 250")) failures.push("Sponsor public issue template should prioritize the USD 49 starter review path.");
  if (!issueTemplate.includes("private payment") || !issueTemplate.includes("confidential file")) failures.push("Sponsor public issue template missing public safety warning.");
}
const invoiceFollowupIssueTemplateFile = path.join(root, ".github", "ISSUE_TEMPLATE", "invoice-followup-copy-pack-service.yml");
if (!fs.existsSync(invoiceFollowupIssueTemplateFile)) failures.push("Missing invoice follow-up service issue template.");
else {
  const issueTemplate = fs.readFileSync(invoiceFollowupIssueTemplateFile, "utf8");
  if (!issueTemplate.includes("Invoice Follow-up Copy Pack") || !issueTemplate.includes("service-request") || !issueTemplate.includes("business-review")) failures.push("Invoice follow-up service issue template missing service request labels.");
  if (!issueTemplate.includes("invoice_status") || !issueTemplate.includes("payment_wording") || !issueTemplate.includes("checkout_provider")) failures.push("Invoice follow-up service issue template missing invoice-specific fit-check fields.");
  if (!issueTemplate.includes("invoice numbers") || !issueTemplate.includes("bank") || !issueTemplate.includes("client private")) failures.push("Invoice follow-up service issue template missing public safety warnings.");
}

const uploadLimitFixPlanIssueTemplateFile = path.join(root, ".github", "ISSUE_TEMPLATE", "upload-limit-fix-plan-service.yml");
if (!fs.existsSync(uploadLimitFixPlanIssueTemplateFile)) failures.push("Missing upload limit fix plan service issue template.");
else {
  const issueTemplate = fs.readFileSync(uploadLimitFixPlanIssueTemplateFile, "utf8");
  if (!issueTemplate.includes("Upload Limit Fix Plan") || !issueTemplate.includes("service-request") || !issueTemplate.includes("business-review")) failures.push("Upload limit fix plan issue template missing service request labels.");
  if (!issueTemplate.includes("upload_error") || !issueTemplate.includes("file_type") || !issueTemplate.includes("target_rule") || !issueTemplate.includes("checkout_provider")) failures.push("Upload limit fix plan issue template missing upload-specific fit-check fields.");
  if (!issueTemplate.includes("actual file") || !issueTemplate.includes("portal login") || !issueTemplate.includes("bank details")) failures.push("Upload limit fix plan issue template missing public safety warnings.");
}

const readmeFile = path.join(root, "README.md");
if (!fs.existsSync(readmeFile)) failures.push("Missing README.md.");
else {
  const readme = fs.readFileSync(readmeFile, "utf8");
  if (!readme.includes("sponsor-starter-review") || !readme.includes("USD 49")) failures.push("README should expose the USD 49 sponsor starter review path.");
}

const partnersFile = path.join(root, "PARTNERS.md");
if (!fs.existsSync(partnersFile)) failures.push("Missing PARTNERS.md.");
else {
  const partners = fs.readFileSync(partnersFile, "utf8");
  if (!partners.includes("sponsor-starter-review") || !partners.includes("USD 49 starter sponsor review")) failures.push("PARTNERS.md should expose the starter sponsor review path.");
  if (partners.includes("pages.dev/media-kit.json")) failures.push("PARTNERS.md should link sponsor-media-kit.json, not a missing media-kit.json path.");
  if (!partners.includes("sponsor-media-kit.json")) failures.push("PARTNERS.md missing sponsor media kit JSON link.");
}
const packageJson = readJsonFile(path.join(root, "package.json"), {});
if (packageJson.scripts?.["sponsor:prospects"] !== "node scripts/generate-sponsor-prospect-queue.cjs") failures.push("package.json missing sponsor:prospects command.");
if (packageJson.scripts?.["sponsor:outreach-log"] !== "node scripts/sponsor-outreach-log.cjs") failures.push("package.json missing sponsor:outreach-log command.");
if (packageJson.scripts?.["sponsor:contact-probe"] !== "node scripts/probe-sponsor-contact-routes.cjs") failures.push("package.json missing sponsor:contact-probe command.");

const externalGrowthScripts = [
  "scripts/github-discovery.cjs",
  "scripts/gist-discovery.cjs",
  "scripts/github-issue-discovery.cjs",
  "scripts/share-kit-push.cjs",
];
const retiredGrowthPatterns = [
  "MARKET_TABLE_PRINT_AUDIT",
  "CUSTOM_LOCAL_PRINT_PACK_SERVICE",
  "SERVICE_SALES_PACK",
  "market_table_audit",
  "service_sales_pack",
  "Free Market Table Print Audit",
  "Custom Local Print Pack",
  "paid_order_verified",
  "buyerIntentPath",
  "freeHelpPath",
  "freeMarketTableAudit",
];
for (const scriptPath of externalGrowthScripts) {
  const file = path.join(root, ...scriptPath.split("/"));
  if (!fs.existsSync(file)) {
    failures.push(`Missing external growth script: ${scriptPath}`);
    continue;
  }
  const script = fs.readFileSync(file, "utf8");
  for (const pattern of retiredGrowthPatterns) {
    if (script.includes(pattern)) failures.push(`${scriptPath} should not publish retired payment experiment reference: ${pattern}`);
  }
  if (!script.includes("sponsor-starter-review") || !script.includes("sponsor_starter_review")) failures.push(`${scriptPath} missing USD 49 starter sponsor review distribution.`);
  if (["scripts/gist-discovery.cjs", "scripts/github-issue-discovery.cjs", "scripts/share-kit-push.cjs"].includes(scriptPath) && !script.includes("sponsor-deal-room")) failures.push(`${scriptPath} missing sponsor deal room distribution.`);
}

const redirectsFile = path.join(root, "_redirects");
if (!fs.existsSync(redirectsFile)) failures.push("Missing _redirects.");
else {
  const redirects = fs.readFileSync(redirectsFile, "utf8");
  for (const privatePath of ["/scripts/*", "/reports/*", "/functions/*", "/package.json", "/package-lock.json", "/README.md", "/OPERATIONS.md", "/VALIDATION.md", "/wrangler.toml"]) {
    if (!redirects.includes(`${privatePath} /free-pdf-tools/ 301`)) failures.push(`_redirects missing private file redirect: ${privatePath}`);
  }
  for (const publicPath of ["/digital-products.json", "/services.json", "/service-sales-pack.json", "/assets/digital-products/*", "/assets/services/*", "/docs/products.json", "/docs/services.json", "/docs/service-sales-pack.json", "/docs/assets/digital-products/*", "/docs/assets/services/*"]) {
    if (redirects.includes(`${publicPath} /free-pdf-tools/ 301`)) failures.push(`_redirects should not block restored public service asset: ${publicPath}`);
  }
  if (!redirects.includes("/DISTRIBUTION.md /submit-directory/ 301")) failures.push("_redirects missing distribution pack redirect.");
  if (!redirects.includes("/LICENSE.md /license/ 301")) failures.push("_redirects missing license markdown redirect.");
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
  if (!robots.includes("Disallow: /ops/")) failures.push("robots.txt should disallow ops monitor.");
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
  if (!llms.includes(siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug))) failures.push("llms.txt missing restored custom print pack service URL.");
  if (!llms.includes(siteUrl(MARKET_TABLE_PRINT_AUDIT.slug))) failures.push("llms.txt missing restored market table print audit URL.");
  if (!llms.includes("Optional service requests do not collect payment on-site")) failures.push("llms.txt missing restored service payment boundary.");
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
  if (!siteConfig.includes("serviceCheckoutUrl") || !siteConfig.includes("customPrintPackCheckoutUrl") || !siteConfig.includes("invoiceFollowupCheckoutUrl") || !siteConfig.includes("uploadLimitFixPlanCheckoutUrl") || !siteConfig.includes("auditUpgradeCheckoutUrl")) failures.push("site-config.js missing per-SKU service checkout URL slots.");
}

const checkoutConfigScriptFile = path.join(root, "scripts", "configure-checkout.cjs");
if (!fs.existsSync(checkoutConfigScriptFile)) failures.push("Missing checkout configuration script.");
else {
  const checkoutConfigScript = fs.readFileSync(checkoutConfigScriptFile, "utf8");
  if (!checkoutConfigScript.includes("seller-kit-url") || !checkoutConfigScript.includes("service-url") || !checkoutConfigScript.includes("audit-upgrade-url")) failures.push("Checkout configuration script should support seller, service, and audit upgrade payment URLs.");
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

for (const pagePath of ["compress-image-to-10kb", "compress-image-to-20kb", "compress-image-to-30kb", "compress-image-to-50kb", "compress-image-to-100kb", "compress-image-to-150kb", "compress-image-to-200kb", "compress-image-to-300kb", "compress-image-to-500kb"]) {
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

for (const [pagePath, formatLabel, target] of [
  ["compress-jpg-to-50kb", "JPG", "50"],
  ["compress-jpg-to-100kb", "JPG", "100"],
  ["compress-jpg-to-200kb", "JPG", "200"],
  ["compress-png-to-50kb", "PNG", "50"],
  ["compress-png-to-100kb", "PNG", "100"],
  ["compress-png-to-200kb", "PNG", "200"],
]) {
  const file = path.join(root, pagePath, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing format target-KB landing page: ${pagePath}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(`Compress ${formatLabel} to ${target}KB without uploading`)) failures.push(`Format target-KB page missing headline: ${pagePath}`);
  if (!html.includes(`/tools/compress-image-to-kb/?targetKb=${target}`)) failures.push(`Format target-KB page missing prefilled tool link: ${pagePath}`);
  if (!html.includes("Get a $9 upload fix plan")) failures.push(`Format target-KB page missing clear $9 upload fix CTA: ${pagePath}`);
  if (html.includes('href="#service-request">Send $9 upload fix request</a>')) failures.push(`Format target-KB page should not show duplicate $9 request CTA in the hero: ${pagePath}`);
  if (!sitemap.includes(`<loc>${siteUrl(pagePath)}</loc>`)) failures.push(`Sitemap missing format target-KB page: ${pagePath}`);
}

const imageKbHubFile = path.join(root, "image-size-reducer-in-kb", "index.html");
if (!fs.existsSync(imageKbHubFile)) failures.push("Missing image size reducer in KB hub page.");
else {
  const html = fs.readFileSync(imageKbHubFile, "utf8");
  if (!html.includes("Image size reducer in KB without uploading")) failures.push("Image KB hub page missing headline.");
  if (!html.includes("/tools/compress-image-to-kb/")) failures.push("Image KB hub page missing image-to-KB tool link.");
  for (const pagePath of ["compress-image-to-10kb", "compress-image-to-20kb", "compress-image-to-30kb", "compress-image-to-50kb", "compress-image-to-100kb", "compress-image-to-150kb", "compress-image-to-200kb", "compress-image-to-300kb", "compress-image-to-500kb", "compress-jpg-to-50kb", "compress-jpg-to-100kb", "compress-jpg-to-200kb", "compress-png-to-50kb", "compress-png-to-100kb", "compress-png-to-200kb", "passport-photo-compress-to-50kb", "passport-photo-compress-to-100kb", "passport-photo-compress-to-200kb", "signature-under-20kb", "resize-signature-140x60", "passport-photo-35x45mm", "photo-200x230-50kb", "signature-under-50kb", "resize-signature-200x100", "resize-photo-200x230"]) {
    if (!html.includes(`/${pagePath}/`)) failures.push(`Image KB hub page missing target link: ${pagePath}`);
  }
  if (!sitemap.includes(`<loc>${siteUrl("image-size-reducer-in-kb")}</loc>`)) failures.push("Sitemap missing image KB hub page.");
}

for (const [pagePath, targetSize, headlineSize] of [["compress-pdf-to-100kb", "100kb", "100KB"], ["compress-pdf-to-200kb", "200kb", "200KB"], ["compress-pdf-to-300kb", "300kb", "300KB"], ["compress-pdf-to-500kb", "500kb", "500KB"], ["compress-pdf-to-1mb", "1mb", "1MB"], ["compress-pdf-to-2mb", "2mb", "2MB"], ["compress-pdf-to-5mb", "5mb", "5MB"], ["compress-pdf-to-10mb", "10mb", "10MB"]]) {
  const file = path.join(root, pagePath, "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing target-size PDF landing page: ${pagePath}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(`Compress PDF to ${headlineSize} without uploading`)) failures.push(`Target-size PDF landing page missing headline: ${pagePath}`);
  if (!html.includes(`/tools/compress-pdf/?targetSize=${targetSize}`)) failures.push(`Target-size PDF landing page missing prefilled tool link: ${pagePath}`);
  if (!html.includes("Get a $9 upload fix plan")) failures.push(`Target-size PDF landing page missing clear $9 upload fix CTA: ${pagePath}`);
  if (html.includes('href="#service-request">Send $9 upload fix request</a>')) failures.push(`Target-size PDF landing page should not show duplicate $9 request CTA in the hero: ${pagePath}`);
    if (!html.includes("Need a $9 upload fix plan?") || !html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes('data-track-tool="upload-limit-fix-plan"') || !html.includes('data-utm-campaign="upload_limit_fix_plan"') || !html.includes('data-service-primary-invoice-request="true"') || !html.includes('data-track-event="service_invoice_request"') || !html.includes("Open public-safe $9 invoice request")) failures.push(`Target-size PDF landing page missing $9 upload fix invoice request path: ${pagePath}`);
  if (!sitemap.includes(`<loc>${siteUrl(pagePath)}</loc>`)) failures.push(`Sitemap missing target-size PDF landing page: ${pagePath}`);
}

const pdfSizeHubFile = path.join(root, "pdf-size-reducer", "index.html");
if (!fs.existsSync(pdfSizeHubFile)) failures.push("Missing PDF size reducer hub page.");
else {
  const html = fs.readFileSync(pdfSizeHubFile, "utf8");
  if (!html.includes("PDF size reducer without uploading")) failures.push("PDF size hub page missing headline.");
  if (!html.includes("/tools/compress-pdf/")) failures.push("PDF size hub page missing PDF compressor link.");
  if (!html.includes("Need a $9 upload fix plan?") || !html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes('data-utm-campaign="upload_limit_fix_plan"') || !html.includes('data-service-primary-invoice-request="true"') || !html.includes('data-track-event="service_invoice_request"') || !html.includes("Open public-safe $9 invoice request")) failures.push("PDF size hub page missing $9 upload fix invoice request path.");
  for (const pagePath of ["pdf-must-be-under-100kb", "pdf-must-be-under-200kb", "pdf-must-be-under-300kb", "compress-pdf-to-100kb", "compress-pdf-to-200kb", "compress-pdf-to-300kb", "compress-pdf-to-500kb", "compress-pdf-to-1mb", "compress-pdf-to-2mb", "compress-pdf-to-5mb", "compress-pdf-to-10mb", "pdf-must-be-under-2mb", "pdf-must-be-under-5mb", "pdf-must-be-under-10mb", "resume-pdf-under-2mb", "document-must-be-under-5mb"]) {
    if (!html.includes(`/${pagePath}/`)) failures.push(`PDF size hub page missing target link: ${pagePath}`);
  }
  if (!sitemap.includes(`<loc>${siteUrl("pdf-size-reducer")}</loc>`)) failures.push("Sitemap missing PDF size hub page.");
}

const freePdfToolsFile = path.join(root, "free-pdf-tools", "index.html");
if (!fs.existsSync(freePdfToolsFile)) failures.push("Missing free PDF tools directory page.");
else {
  const html = fs.readFileSync(freePdfToolsFile, "utf8");
  if (!html.includes("Free PDF, image, and QR tools without signup")) failures.push("Free PDF tools page missing target heading.");
  if (!html.includes("/tools/ats-resume-checker/") || !html.includes("/tools/compress-pdf/") || !html.includes("/tools/compress-image/") || !html.includes("/tools/compress-image-to-kb/") || !html.includes("/tools/resize-image/") || !html.includes("/tools/convert-image/") || !html.includes("/tools/remove-background/") || !html.includes("/tools/crop-image/") || !html.includes("/tools/rotate-image/") || !html.includes("/tools/watermark-image/") || !html.includes("/tools/add-text-image/") || !html.includes("/tools/signature-png/") || !html.includes("/tools/passport-photo/") || !html.includes("/tools/qr-code/") || !html.includes("/tools/wifi-qr-code/") || !html.includes("/tools/vcard-qr-code/") || !html.includes("/tools/multi-image-pdf/") || !html.includes("/tools/pdf-to-images/") || !html.includes("/tools/pdf-to-text/") || !html.includes("/tools/pdf-to-word/") || !html.includes("/tools/merge-pdf/") || !html.includes("/tools/split-pdf/") || !html.includes("/tools/pdf-page-numbers/") || !html.includes("/tools/rotate-pdf/") || !html.includes("/tools/remove-pdf-pages/") || !html.includes("/tools/reorder-pdf-pages/") || !html.includes("/tools/watermark-pdf/") || !html.includes("/tools/stamp-pdf/") || !html.includes("/tools/sign-pdf/") || !html.includes("/tools/text-to-pdf/") || !html.includes("/tools/markdown-to-pdf/") || !html.includes("/tools/csv-to-pdf/") || !html.includes("/tools/json-to-pdf/")) failures.push("Free PDF tools page missing conversion links.");
  requireUploadLimitShortcuts(html, "Free PDF tools page");
  if (!html.includes('"@type":"ItemList"')) failures.push("Free PDF tools page missing ItemList schema.");
}

const uploadLimitFile = path.join(root, "upload-limit-fixer", "index.html");
if (!fs.existsSync(uploadLimitFile)) failures.push("Missing upload limit fixer page.");
else {
  const html = fs.readFileSync(uploadLimitFile, "utf8");
  if (!html.includes("Fix a file upload limit without signup")) failures.push("Upload limit fixer missing target heading.");
  requireUploadLimitShortcuts(html, "Upload limit fixer");
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
  if (!html.includes("TechTools Overdue Invoice Reminder Email") || !html.includes("https://techtools.cz/tools/launchpad/?tool=171")) failures.push("Directory submission pack missing overdue invoice reminder live listing.");
  if (!html.includes("TechTools Upload Limit Fix Plan") || !html.includes("https://techtools.cz/tools/launchpad/?tool=172")) failures.push("Directory submission pack missing upload limit fix plan live listing.");
  if (!html.includes("TechTools Upload Error Cheatsheet") || !html.includes("https://techtools.cz/tools/launchpad/?tool=173")) failures.push("Directory submission pack missing upload error cheatsheet live listing.");
  if (!html.includes("TechTools Compress PDF to 1MB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=174")) failures.push("Directory submission pack missing compress PDF to 1MB live listing.");
  if (!html.includes("TechTools PDF Under 1MB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=175")) failures.push("Directory submission pack missing PDF under 1MB upload fix live listing.");
  if (!html.includes("TechTools Photo Under 100KB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=176")) failures.push("Directory submission pack missing photo under 100KB upload fix live listing.");
  if (!html.includes("TechTools Image Under 2MB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=177")) failures.push("Directory submission pack missing image under 2MB upload fix live listing.");
  if (!html.includes("TechTools JPG Under 200KB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=178")) failures.push("Directory submission pack missing JPG under 200KB upload fix live listing.");
  if (!html.includes("TechTools Resume PDF Too Large Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=179")) failures.push("Directory submission pack missing resume PDF too large upload fix live listing.");
  if (!html.includes("TechTools PNG Screenshot Too Large Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=180")) failures.push("Directory submission pack missing PNG screenshot too large upload fix live listing.");
  if (!html.includes("TechTools Passport Photo 50KB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=181")) failures.push("Directory submission pack missing passport photo 50KB upload fix live listing.");
  if (!html.includes("TechTools PDF Under 500KB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=182")) failures.push("Directory submission pack missing PDF under 500KB upload fix live listing.");
  if (!html.includes("TechTools Image Under 500KB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=183")) failures.push("Directory submission pack missing image under 500KB upload fix live listing.");
  if (!html.includes("TechTools Image Dimensions 600x600 Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=184")) failures.push("Directory submission pack missing TechTools image dimensions live listing.");
  if (!html.includes("TechTools PDF Not Accepted JPG Required Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=185")) failures.push("Directory submission pack missing TechTools PDF-to-JPG live listing.");
  if (!html.includes("TechTools Email Attachment Too Large PDF Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=186")) failures.push("Directory submission pack missing TechTools email attachment live listing.");
  if (!html.includes("TechTools Compress Image to KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=187")) failures.push("Directory submission pack missing TechTools compress image to KB live listing.");
  if (!html.includes("TechTools Compress PDF to 500KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=188")) failures.push("Directory submission pack missing TechTools compress PDF to 500KB live listing.");
  if (!html.includes("TechTools Compress Image to 50KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=189")) failures.push("Directory submission pack missing TechTools image 50KB live listing.");
  if (!html.includes("TechTools Compress Image to 100KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=190")) failures.push("Directory submission pack missing TechTools image 100KB live listing.");
  if (!html.includes("TechTools Compress Image to 200KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=191")) failures.push("Directory submission pack missing TechTools image 200KB live listing.");
  if (!html.includes("TechTools Compress JPG to 50KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=192")) failures.push("Directory submission pack missing TechTools JPG 50KB live listing.");
  if (!html.includes("TechTools Compress JPG to 100KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=193")) failures.push("Directory submission pack missing TechTools JPG 100KB live listing.");
  if (!html.includes("TechTools Compress JPG to 200KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=194")) failures.push("Directory submission pack missing TechTools JPG 200KB live listing.");
  if (!html.includes("TechTools Compress PNG to 50KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=195")) failures.push("Directory submission pack missing TechTools PNG 50KB live listing.");
  if (!html.includes("TechTools Compress PNG to 100KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=196")) failures.push("Directory submission pack missing TechTools PNG 100KB live listing.");
  if (!html.includes("TechTools Compress PNG to 200KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=197")) failures.push("Directory submission pack missing TechTools PNG 200KB live listing.");
  if (!html.includes("TechTools Passport Photo Compress to 50KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=198")) failures.push("Directory submission pack missing TechTools passport photo 50KB live listing.");
  if (!html.includes("TechTools Passport Photo Compress to 100KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=199")) failures.push("Directory submission pack missing TechTools passport photo 100KB live listing.");
  if (!html.includes("TechTools Passport Photo Compress to 200KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=200")) failures.push("Directory submission pack missing TechTools passport photo 200KB live listing.");
  if (!html.includes("TechTools PDF Under 2MB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=201")) failures.push("Directory submission pack missing TechTools PDF under 2MB live listing.");
  if (!html.includes("TechTools PDF Under 5MB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=202")) failures.push("Directory submission pack missing TechTools PDF under 5MB live listing.");
  if (!html.includes("TechTools Resume PDF Under 2MB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=203")) failures.push("Directory submission pack missing TechTools resume PDF under 2MB live listing.");
  if (!html.includes("TechTools Document Under 5MB Upload Fix") || !html.includes("https://techtools.cz/tools/launchpad/?tool=204")) failures.push("Directory submission pack missing TechTools document under 5MB live listing.");
  if (!html.includes("TechTools PDF Size Reducer") || !html.includes("https://techtools.cz/tools/launchpad/?tool=205")) failures.push("Directory submission pack missing TechTools PDF size reducer live listing.");
  if (!html.includes("TechTools Compress PDF to 2MB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=206")) failures.push("Directory submission pack missing TechTools compress PDF to 2MB live listing.");
  if (!html.includes("TechTools Compress PDF to 5MB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=207")) failures.push("Directory submission pack missing TechTools compress PDF to 5MB live listing.");
  if (!html.includes("TechTools Compress PDF Without Uploading") || !html.includes("https://techtools.cz/tools/launchpad/?tool=208")) failures.push("Directory submission pack missing TechTools compress PDF without uploading live listing.");
  if (!html.includes("TechTools PDF to JPG Without Uploading") || !html.includes("https://techtools.cz/tools/launchpad/?tool=209")) failures.push("Directory submission pack missing TechTools PDF to JPG without uploading live listing.");
  if (!html.includes("TechTools JPG to PDF Without Uploading") || !html.includes("https://techtools.cz/tools/launchpad/?tool=210")) failures.push("Directory submission pack missing TechTools JPG to PDF without uploading live listing.");
  if (!html.includes("TechTools Extract Text From PDF Without Uploading") || !html.includes("https://techtools.cz/tools/launchpad/?tool=212")) failures.push("Directory submission pack missing TechTools extract text from PDF without uploading live listing.");
  if (!html.includes("TechTools Merge PDF Without Uploading") || !html.includes("https://techtools.cz/tools/launchpad/?tool=213")) failures.push("Directory submission pack missing TechTools merge PDF without uploading live listing.");
  if (!html.includes("TechTools Split PDF Without Uploading") || !html.includes("https://techtools.cz/tools/launchpad/?tool=214")) failures.push("Directory submission pack missing TechTools split PDF without uploading live listing.");
  if (!html.includes("TechTools Signature Under 20KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=215")) failures.push("Directory submission pack missing TechTools signature 20KB live listing.");
  if (!html.includes("TechTools Passport Photo Size Fixer") || !html.includes("https://techtools.cz/tools/launchpad/?tool=216")) failures.push("Directory submission pack missing TechTools passport photo size fixer live listing.");
  if (!html.includes("TechTools Resize Photo 413x531") || !html.includes("https://techtools.cz/tools/launchpad/?tool=217")) failures.push("Directory submission pack missing TechTools resize photo 413x531 live listing.");
  if (!html.includes("TechTools Signature Under 50KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=218")) failures.push("Directory submission pack missing TechTools signature 50KB live listing.");
  if (!html.includes("TechTools Resize Signature 140x60") || !html.includes("https://techtools.cz/tools/launchpad/?tool=219")) failures.push("Directory submission pack missing TechTools resize signature 140x60 live listing.");
  if (!html.includes("TechTools Photo 200x230 Under 50KB") || !html.includes("https://techtools.cz/tools/launchpad/?tool=220")) failures.push("Directory submission pack missing TechTools photo 200x230 under 50KB live listing.");
  if (!html.includes("TechTools Resize Signature 200x100") || !html.includes("https://techtools.cz/tools/launchpad/?tool=221")) failures.push("Directory submission pack missing TechTools resize signature 200x100 live listing.");
  if (!html.includes("TechTools Resize Photo 200x230") || !html.includes("https://techtools.cz/tools/launchpad/?tool=222")) failures.push("Directory submission pack missing TechTools resize photo 200x230 live listing.");
  if (!html.includes("TechTools Passport Photo 35x45mm") || !html.includes("https://techtools.cz/tools/launchpad/?tool=223")) failures.push("Directory submission pack missing TechTools passport photo 35x45mm live listing.");
  if (!html.includes("NoLogin.tools Upload Error Cheatsheet") || !html.includes("https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-error-cheatsheet")) failures.push("Directory submission pack missing NoLogin upload error cheatsheet submission.");
  if (!html.includes("NoSignupTools Upload Limit Fixer") || !html.includes("https://nosignuptools.com/tools/upload-limit-fixer-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools upload limit fixer submission.");
  if (!html.includes("NoSignupTools Upload Error Cheatsheet") || !html.includes("https://nosignuptools.com/tools/upload-error-cheatsheet-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools upload error cheatsheet submission.");
  if (!html.includes("NoSignupTools Compress JPG to 50KB") || !html.includes("https://nosignuptools.com/tools/compress-jpg-to-50kb-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools JPG 50KB submission.");
  if (!html.includes("NoSignupTools Compress PNG to 200KB") || !html.includes("https://nosignuptools.com/tools/compress-png-to-200kb-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools PNG 200KB submission.");
  if (!html.includes("NoSignupTools Passport Photo Compress to 200KB") || !html.includes("https://nosignuptools.com/tools/passport-photo-compress-to-200kb-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools passport photo 200KB submission.");
  if (!html.includes("NoSignupTools PDF Under 2MB Upload Fix") || !html.includes("https://nosignuptools.com/tools/pdf-under-2mb-upload-fix-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools PDF under 2MB submission.");
  if (!html.includes("NoSignupTools PDF Under 5MB Upload Fix") || !html.includes("https://nosignuptools.com/tools/pdf-under-5mb-upload-fix-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools PDF under 5MB submission.");
  if (!html.includes("NoSignupTools Resume PDF Under 2MB Upload Fix") || !html.includes("https://nosignuptools.com/tools/resume-pdf-under-2mb-upload-fix-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools resume PDF under 2MB submission.");
  if (!html.includes("NoSignupTools Document Under 5MB Upload Fix") || !html.includes("https://nosignuptools.com/tools/document-under-5mb-upload-fix-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools document under 5MB submission.");
  if (!html.includes("NoSignupTools Extract Text From PDF Without Uploading") || !html.includes("https://nosignuptools.com/tools/extract-text-from-pdf-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools extract text from PDF submission.");
  if (!html.includes("NoSignupTools Merge PDF Without Uploading") || !html.includes("https://nosignuptools.com/tools/merge-pdf-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools merge PDF submission.");
  if (!html.includes("NoSignupTools Split PDF Without Uploading") || !html.includes("https://nosignuptools.com/tools/split-pdf-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools split PDF submission.");
  if (!html.includes("NoSignupTools Rotate PDF Pages Without Uploading") || !html.includes("https://nosignuptools.com/tools/rotate-pdf-pages-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools rotate PDF submission.");
  if (!html.includes("NoSignupTools Remove Pages From PDF Without Uploading") || !html.includes("https://nosignuptools.com/tools/remove-pages-from-pdf-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools remove PDF pages submission.");
  if (!html.includes("NoSignupTools Reorder PDF Pages Without Uploading") || !html.includes("https://nosignuptools.com/tools/reorder-pdf-pages-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools reorder PDF pages submission.");
  if (!html.includes("NoSignupTools Add Page Numbers to PDF") || !html.includes("https://nosignuptools.com/tools/add-page-numbers-to-pdf-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools add page numbers submission.");
  if (!html.includes("NoSignupTools Stamp PDF Without Uploading") || !html.includes("https://nosignuptools.com/tools/stamp-pdf-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools stamp PDF submission.");
  if (!html.includes("NoSignupTools Sign PDF Without Uploading") || !html.includes("https://nosignuptools.com/tools/sign-pdf-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools sign PDF submission.");
  if (!html.includes("NoSignupTools Compress Image Without Uploading") || !html.includes("https://nosignuptools.com/tools/compress-image-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools compress image no-upload submission.");
  if (!html.includes("NoSignupTools Resize Image Without Uploading") || !html.includes("https://nosignuptools.com/tools/resize-image-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools resize image no-upload submission.");
  if (!html.includes("NoSignupTools Convert Image Format Without Uploading") || !html.includes("https://nosignuptools.com/tools/convert-image-format-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools convert image no-upload submission.");
  if (!html.includes("NoSignupTools Remove Background Without Uploading") || !html.includes("https://nosignuptools.com/tools/remove-background-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools remove background no-upload submission.");
  if (!html.includes("NoSignupTools Crop Image Without Uploading") || !html.includes("https://nosignuptools.com/tools/crop-image-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools crop image no-upload submission.");
  if (!html.includes("NoSignupTools Rotate Image Without Uploading") || !html.includes("https://nosignuptools.com/tools/rotate-image-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools rotate image no-upload submission.");
  if (!html.includes("NoSignupTools Watermark Image Without Uploading") || !html.includes("https://nosignuptools.com/tools/watermark-image-without-uploading-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools watermark image no-upload submission.");
  if (!html.includes("FreeNoSignup Upload Limit Fixer") || !html.includes("https://freenosignup.com/?s=Upload+Limit+Fixer")) failures.push("Directory submission pack missing FreeNoSignup upload limit fixer submission.");
  if (!html.includes("FreeNoSignup Upload Error Cheatsheet") || !html.includes("https://freenosignup.com/?s=Upload+Error+Cheatsheet")) failures.push("Directory submission pack missing FreeNoSignup upload error cheatsheet submission.");
  if (!html.includes("FreeNoSignup Compress PDF to 500KB") || !html.includes("https://freenosignup.com/?s=Compress+PDF+to+500KB")) failures.push("Directory submission pack missing FreeNoSignup PDF 500KB submission.");
  if (!html.includes("FreeNoSignup Image Must Be Under 500KB Fix") || !html.includes("https://freenosignup.com/?s=Image+Must+Be+Under+500KB+Fix")) failures.push("Directory submission pack missing FreeNoSignup image under 500KB submission.");
  if (!html.includes("FreeNoSignup Resize Signature 200x100") || !html.includes("https://freenosignup.com/?s=Resize+Signature+200x100")) failures.push("Directory submission pack missing FreeNoSignup resize signature 200x100 submission.");
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
  if (!html.includes("Ad-safe free-tool distribution")) failures.push("Share kit missing ad-safe free-tool distribution section.");
  if (!html.includes("Sponsor and partner discovery")) failures.push("Share kit missing sponsor discovery section.");
  if (!html.includes("sponsor-call")) failures.push("Share kit missing sponsor call link.");
  if (!html.includes("utm_source=sponsor-outreach")) failures.push("Share kit missing tracked sponsor outreach source.");
  if (!html.includes("Invoice follow-up email generator")) failures.push("Share kit missing invoice follow-up priority link.");
  if (!html.includes("Invoice follow-up wording helper")) failures.push("Share kit missing invoice follow-up copy-ready post.");
  if (!html.includes("invoice_followup_service")) failures.push("Share kit missing invoice follow-up tracking campaign.");
  if (!html.includes("/organic-push-kit/")) failures.push("Share kit missing organic push kit link.");
  if (!html.includes("Upload error cheatsheet")) failures.push("Share kit missing upload error cheatsheet section.");
  if (!html.includes("/upload-error-cheatsheet.json")) failures.push("Share kit missing upload error cheatsheet JSON link.");
  if (!html.includes("/free-pdf-tools/")) failures.push("Share kit missing free tools directory link.");
  if (html.includes("Paid service sales pack")) failures.push("Share kit should not promote paid service sales pack.");
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

const uploadErrorCheatsheetFile = path.join(root, "upload-error-cheatsheet", "index.html");
if (!fs.existsSync(uploadErrorCheatsheetFile)) failures.push("Missing upload error cheatsheet page.");
else {
  const html = fs.readFileSync(uploadErrorCheatsheetFile, "utf8");
  if (!html.includes("Upload error cheatsheet")) failures.push("Upload error cheatsheet missing heading.");
  if (!html.includes("PDF must be under 1MB")) failures.push("Upload error cheatsheet missing PDF 1MB row.");
  if (!html.includes("Image must be less than 2MB")) failures.push("Upload error cheatsheet missing image 2MB row.");
  if (!html.includes("Email attachment too large")) failures.push("Upload error cheatsheet missing email attachment row.");
  if (!html.includes("Still blocked? Get a $9 upload fix plan.") || !html.includes('id="service-request"')) failures.push("Upload error cheatsheet missing direct $9 fix-plan service section.");
  if (!html.includes('data-upload-error-invoice-request') || !html.includes('href="#upload-error-quick-request"') || !html.includes("Request $9 invoice link")) failures.push("Upload error cheatsheet missing row-level $9 invoice-link quick-form CTAs.");
  if (!html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes("upload_error_cheatsheet_fix_plan") || !html.includes("Request $9 invoice link") || html.includes("Send $9 fix-plan request</button>")) failures.push("Upload error cheatsheet missing primary invoice-link upload fix-plan form.");
  if (!html.includes("Open public-safe $9 invoice request") || !html.includes('data-track-event="service_invoice_request"') || !html.includes("data-upload-error-fix-plan") || !html.includes("data-upload-error-text=\"PDF must be under 1MB\"")) failures.push("Upload error cheatsheet missing row-level public-safe $9 invoice request CTAs.");
  if (!html.includes('id="upload-error-quick-request"') || !html.includes('data-upload-error-quick-request') || !html.includes('data-utm-content="cheatsheet-row-quick"') || !html.includes("Request $9 invoice link") || html.includes("Send selected error request")) failures.push("Upload error cheatsheet missing row-level quick invoice-link request panel.");
  if (!html.includes("/upload-error-cheatsheet.json")) failures.push("Upload error cheatsheet missing JSON link.");
  if (!sitemap.includes(`<loc>${siteUrl("upload-error-cheatsheet")}</loc>`)) failures.push("Sitemap missing upload error cheatsheet.");
}

const compressImageKbToolFile = path.join(root, "tools", "compress-image-to-kb", "index.html");
if (!fs.existsSync(compressImageKbToolFile)) failures.push("Missing compress image-to-KB tool page.");
else {
  const html = fs.readFileSync(compressImageKbToolFile, "utf8");
  if (!html.includes('data-compress-image-kb-tool-fix-form') || !html.includes("Request $9 invoice link") || !html.includes("data-service-invoice-submit") || !html.includes('data-utm-source="compress-image-kb-tool"') || html.includes("Send $9 image target request</button>")) failures.push("Compress image-to-KB static route missing primary one-field $9 invoice-link request form.");
}

const uploadErrorCheatsheetJsonFile = path.join(root, "upload-error-cheatsheet.json");
if (!fs.existsSync(uploadErrorCheatsheetJsonFile)) failures.push("Missing upload-error-cheatsheet.json.");
else {
  const data = JSON.parse(fs.readFileSync(uploadErrorCheatsheetJsonFile, "utf8"));
  if (!Array.isArray(data.entries) || data.entries.length < 12) failures.push("upload-error-cheatsheet.json missing entries.");
  if (!data.entries?.some((item) => item.errorText === "Resume PDF too large" && String(item.toolUrl || "").includes("targetSize=1mb"))) failures.push("upload-error-cheatsheet.json missing resume PDF target.");
  if (!data.entries?.some((item) => item.errorText === "Image must be less than 2MB" && String(item.toolUrl || "").includes("targetKb=2048"))) failures.push("upload-error-cheatsheet.json missing image 2MB target.");
}

const organicPushKitFile = path.join(root, "organic-push-kit", "index.html");
if (!fs.existsSync(organicPushKitFile)) failures.push("Missing organic push kit page.");
else {
  const html = fs.readFileSync(organicPushKitFile, "utf8");
  if (!html.includes("Organic push kit")) failures.push("Organic push kit missing heading.");
  if (!html.includes("Today queue")) failures.push("Organic push kit missing task queue.");
  if (!html.includes("Helpful reply for PDF under 1MB questions")) failures.push("Organic push kit missing PDF task.");
  if (!html.includes("Directory listing for free no-signup file tools")) failures.push("Organic push kit missing directory task.");
  if (!html.includes("Helpful reply for polite invoice follow-up wording")) failures.push("Organic push kit missing invoice follow-up community task.");
  if (!html.includes("Directory listing for invoice follow-up wording resource")) failures.push("Organic push kit missing invoice follow-up directory task.");
  if (!html.includes("utm_campaign=upload_error_cheatsheet")) failures.push("Organic push kit missing upload-error tracking.");
  if (!html.includes("utm_campaign=invoice_followup_service")) failures.push("Organic push kit missing invoice follow-up tracking.");
  if (!html.includes("/organic-push-kit.json")) failures.push("Organic push kit missing JSON link.");
  if (!sitemap.includes(`<loc>${siteUrl("organic-push-kit")}</loc>`)) failures.push("Sitemap missing organic push kit.");
}

const organicPushKitJsonFile = path.join(root, "organic-push-kit.json");
if (!fs.existsSync(organicPushKitJsonFile)) failures.push("Missing organic-push-kit.json.");
else {
  const data = JSON.parse(fs.readFileSync(organicPushKitJsonFile, "utf8"));
  if (!Array.isArray(data.tasks) || data.tasks.length < 8) failures.push("organic-push-kit.json missing tasks.");
  if (!data.tasks?.some((item) => item.id === "community-pdf-1mb" && String(item.trackedUrl || "").includes("utm_source=community"))) failures.push("organic-push-kit.json missing community PDF task.");
  if (!data.tasks?.some((item) => item.id === "directory-free-file-tools" && String(item.copy || "").includes("PrintableTools Lab is a free no-signup"))) failures.push("organic-push-kit.json missing directory copy.");
  if (!data.tasks?.some((item) => item.id === "community-invoice-followup-copy" && String(item.trackedUrl || "").includes("utm_campaign=invoice_followup_service"))) failures.push("organic-push-kit.json missing invoice follow-up community task.");
  if (!data.tasks?.some((item) => item.id === "directory-invoice-followup-resource" && String(item.copy || "").includes("USD 19 Invoice Follow-up Copy Pack"))) failures.push("organic-push-kit.json missing invoice follow-up directory copy.");
  if (!String(data.successGate || "").includes("live metrics")) failures.push("organic-push-kit.json missing live metrics success gate.");
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
  if (!Array.isArray(data.uploadErrorCheatsheet?.entries) || data.uploadErrorCheatsheet.entries.length < 12) failures.push("share-kit.json missing upload error cheatsheet entries.");
  if (!Array.isArray(data.organicPushKit?.tasks) || data.organicPushKit.tasks.length < 8) failures.push("share-kit.json missing organic push kit tasks.");
  if (!data.sponsorDiscovery || data.sponsorDiscovery.sponsorCall !== siteUrl("sponsor-call")) failures.push("share-kit.json missing sponsor call discovery.");
  if (!Array.isArray(data.sponsorDiscovery?.links) || !data.sponsorDiscovery.links.some((item) => String(item.url || "").includes("utm_source=sponsor-outreach"))) failures.push("share-kit.json missing tracked sponsor discovery links.");
  if (!Array.isArray(data.sponsorDiscovery?.links) || !data.sponsorDiscovery.links.some((item) => item.title === "Public USD 49 invoice request" && String(item.url || "").includes("commitment%3Drequest-invoice") && String(item.url || "").includes("body=Public-safe+sponsor+reply"))) failures.push("share-kit.json missing public USD 49 invoice request link.");
  if (!data.sponsorDiscovery?.externalDiscoveryProof || Number(data.sponsorDiscovery.externalDiscoveryProof.directoryListedCount || 0) < 4) failures.push("share-kit.json missing sponsor external discovery proof.");
  if (!String(data.sponsorDiscovery?.successGate || "").includes("qualified sponsor lead")) failures.push("share-kit.json missing sponsor discovery success gate.");
  if (!data.featuredLinks.some((item) => item.url && item.url.includes("utm_source=share-kit"))) failures.push("share-kit.json missing tracked share-kit URLs.");
  if (!data.featuredLinks.some((item) => item.title === "Invoice follow-up email generator" && String(item.url || "").includes("utm_source=share-kit"))) failures.push("share-kit.json missing tracked invoice follow-up featured link.");
  if (!data.posts.some((item) => item.title === "Invoice follow-up wording helper" && String(item.url || "").includes("utm_source=community"))) failures.push("share-kit.json missing invoice follow-up community post.");
  if (!data.organicPushKit?.tasks?.some((item) => item.id === "community-invoice-followup-copy" && String(item.copy || "").includes("optional $19 copy pack"))) failures.push("share-kit.json missing invoice follow-up organic task.");
  if (!data.localSellerService || data.localSellerService.servicePage !== siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)) failures.push("share-kit.json missing restored local seller service page.");
  if (!String(data.localSellerService?.moneyGate || "").includes("external provider")) failures.push("share-kit.json restored service missing external-provider money gate.");
  if (data.serviceSalesPack?.trackedLinks?.some((item) => String(item.url || "").includes("service_sales_pack"))) failures.push("share-kit.json should keep service sales pack out of broad share-kit tracking.");
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

const productRouteFile = path.join(root, LOCAL_SELLER_STARTER_KIT.slug, "index.html");
if (!fs.existsSync(productRouteFile)) failures.push("Missing local seller starter kit route.");
else {
  const html = fs.readFileSync(productRouteFile, "utf8");
  if (!html.includes("Local Seller Starter Kit") || !html.includes("Request checkout link")) failures.push("Seller kit route missing checkout request path.");
  if (!html.includes('data-service-lead-form') || !html.includes('data-service-type="local-seller-starter-kit"') || !html.includes("Send checkout request")) failures.push("Seller kit route missing low-friction service lead form.");
  if ((!html.includes("No payment is collected on this site") && !html.includes("no payment is collected here")) || !html.includes("Revenue is proven only after a real payment provider")) failures.push("Seller kit route missing real-payment gate.");
  if (!sitemap.includes(`<loc>${siteUrl(LOCAL_SELLER_STARTER_KIT.slug)}</loc>`)) failures.push("Sitemap should include restored seller kit route.");
}

const serviceRouteFile = path.join(root, CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug, "index.html");
if (!fs.existsSync(serviceRouteFile)) failures.push("Missing restored custom print pack service route.");
else {
  const html = fs.readFileSync(serviceRouteFile, "utf8");
  if (!html.includes(CUSTOM_LOCAL_PRINT_PACK_SERVICE.name) || !html.includes("Request free fit check") || !html.includes(`$${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd}`)) failures.push("Service route missing low-friction paid setup request CTA.");
  if (!html.includes('data-service-lead-form') || !html.includes('data-service-type="custom-local-print-pack"') || !html.includes("Send free fit check")) failures.push("Service route missing low-friction service lead form.");
  if (!html.includes("real external checkout") || !html.includes("No payment is collected")) failures.push("Service route missing external-payment gate.");
  if (!html.includes("Copy generated service request") && !html.includes("Copy request brief")) failures.push("Service route missing copy-ready request.");
  if (!sitemap.includes(`<loc>${siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)}</loc>`)) failures.push("Sitemap should include restored service route.");
}

const invoiceFollowupRouteFile = path.join(root, INVOICE_FOLLOWUP_COPY_PACK_SERVICE.slug, "index.html");
if (!fs.existsSync(invoiceFollowupRouteFile)) failures.push("Missing invoice follow-up copy pack service route.");
else {
  const html = fs.readFileSync(invoiceFollowupRouteFile, "utf8");
  if (!html.includes(INVOICE_FOLLOWUP_COPY_PACK_SERVICE.name) || !html.includes("Request a free invoice follow-up fit check") || !html.includes(`$${INVOICE_FOLLOWUP_COPY_PACK_SERVICE.priceUsd}`)) failures.push("Invoice follow-up route missing low-friction paid service CTA.");
  if (!html.includes("Send the shortest $19 request") || !html.includes("invoice-micro-lead-form") || !html.includes("Send $19 sequence request")) failures.push("Invoice follow-up route missing shortest paid request form.");
  if (!html.includes("Request $19 invoice link") || !html.includes("data-service-invoice-submit") || !html.includes("data-invoice-fallback-url") || !html.includes("Requested+next+step%3A+Request+external+%2419+checkout+or+invoice+link")) failures.push("Invoice follow-up route missing explicit external invoice-link request CTA.");
  if (!html.includes("Open public-safe request") || !html.includes('data-service-lead-fallback-link')) failures.push("Invoice follow-up route missing public-safe request CTA.");
  if (!html.includes('data-service-lead-form') || !html.includes('data-service-type="invoice-followup-copy-pack"') || !html.includes("Send invoice fit check")) failures.push("Invoice follow-up route missing service lead form.");
  if (!html.includes("What kind of invoice follow-up do you need?") || !html.includes("Invoice status and public-safe context") || !html.includes("Preferred tone")) failures.push("Invoice follow-up route request builder should use invoice-specific fields.");
  for (const retiredInvoiceCopy of ["Cookies, market boxes", "QR sign link", "Start with free audit"]) {
    if (html.includes(retiredInvoiceCopy)) failures.push(`Invoice follow-up route should not include custom print-pack request copy: ${retiredInvoiceCopy}`);
  }
  if (!html.includes("real external checkout") || !html.includes("No payment is collected")) failures.push("Invoice follow-up route missing external-payment gate.");
  if (!html.includes("Request+note%3A") || !html.includes("I+need+a+%2419+invoice+follow-up+copy+pack") || !html.includes("service-request%2Cbusiness-review")) failures.push("Invoice follow-up route missing complete public-safe service request issue fallback.");
  if (!html.includes("not legal, tax, accounting, debt-collection, or financial advice")) failures.push("Invoice follow-up route missing advice-risk boundary.");
  if (!sitemap.includes(`<loc>${siteUrl(INVOICE_FOLLOWUP_COPY_PACK_SERVICE.slug)}</loc>`)) failures.push("Sitemap should include invoice follow-up service route.");
}

const uploadLimitFixPlanRouteFile = path.join(root, UPLOAD_LIMIT_FIX_PLAN_SERVICE.slug, "index.html");
if (!fs.existsSync(uploadLimitFixPlanRouteFile)) failures.push("Missing upload limit fix plan service route.");
else {
  const html = fs.readFileSync(uploadLimitFixPlanRouteFile, "utf8");
  if (!html.includes(UPLOAD_LIMIT_FIX_PLAN_SERVICE.name) || !html.includes("Request a public-safe upload fix fit check") || !html.includes(`$${UPLOAD_LIMIT_FIX_PLAN_SERVICE.priceUsd}`)) failures.push("Upload limit fix plan route missing low-friction paid service CTA.");
  if (!html.includes('href="#invoice-request"') || !html.includes('id="invoice-request"') || !html.includes("Request the $9 invoice link in 30 seconds") || !html.includes("Where should the external $9 invoice link go?")) failures.push("Upload limit fix plan route should route the hero CTA to the one-contact invoice request form.");
  if (!html.includes("upload-limit-fix-plan-micro-lead-form") || !html.includes("service-page-invoice") || !html.includes(">Request $9 invoice link</button>") || !html.includes('type="hidden" name="consent" value="on"') || !html.includes("By sending, you confirm no actual file")) failures.push("Upload limit fix plan route missing primary one-field invoice request form.");
  if (!html.includes("Request $9 invoice link") || !html.includes("data-service-invoice-submit") || !html.includes("data-invoice-fallback-url")) failures.push("Upload limit fix plan route missing explicit external invoice request CTA.");
  if (!html.includes("data-upload-fix-plan-form") || !html.includes("data-upload-fix-plan-summary")) failures.push("Upload limit fix plan route missing upload fix paid-request prefill markers.");
  if (!html.includes("Open public-safe $9 invoice request") || !html.includes('data-service-lead-fallback-link') || !html.includes('data-track-event="service_invoice_request"')) failures.push("Upload limit fix plan route missing public-safe invoice request CTA.");
  if (!html.includes('data-service-lead-form') || !html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes("One-contact $9 invoice request") || !html.includes('data-track-event="service_invoice_request"')) failures.push("Upload limit fix plan route missing one-contact service invoice form.");
  if (!html.includes("Upload error text") || !html.includes("File type and target rule") || !html.includes("Blocked file type")) failures.push("Upload limit fix plan route request builder should use upload-specific fields.");
  if (!html.includes("No file upload") || !html.includes("Do not include or attach the actual file") || (!html.includes("cannot guarantee") && !html.includes("does not guarantee"))) failures.push("Upload limit fix plan route missing no-file safety boundary.");
  if (!html.includes("Request+note%3A") || !html.includes("I+need+a+%249+Upload+Limit+Fix+Plan") || !html.includes("service-request%2Cbusiness-review")) failures.push("Upload limit fix plan route missing complete public-safe service request issue fallback.");
  if (!sitemap.includes(`<loc>${siteUrl(UPLOAD_LIMIT_FIX_PLAN_SERVICE.slug)}</loc>`)) failures.push("Sitemap should include upload limit fix plan service route.");
}

for (const imageInvoicePath of [
  "compress-image-to-50kb",
  "compress-image-to-100kb",
  "compress-image-to-200kb",
  "compress-jpg-to-50kb",
  "compress-jpg-to-100kb",
  "compress-jpg-to-200kb",
  "compress-png-to-50kb",
  "compress-png-to-100kb",
  "compress-png-to-200kb",
  "passport-photo-compress-to-50kb",
  "passport-photo-compress-to-100kb",
  "passport-photo-compress-to-200kb",
]) {
  const file = path.join(root, imageInvoicePath, "index.html");
  if (!fs.existsSync(file)) failures.push(`Missing exact-image upload invoice route: ${imageInvoicePath}`);
  else {
    const html = fs.readFileSync(file, "utf8");
    if (!html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes("One-contact $9 invoice request") || !html.includes("Where should the external $9 invoice link go?") || !html.includes('data-track-event="service_invoice_request"') || !html.includes('name="consent" value="on"')) failures.push(`Exact-image route missing one-contact $9 invoice request path: ${imageInvoicePath}`);
  }
}

const invoiceFollowupDocsRouteFile = path.join(root, "docs", INVOICE_FOLLOWUP_COPY_PACK_SERVICE.slug, "index.html");
if (!fs.existsSync(invoiceFollowupDocsRouteFile)) failures.push("Missing invoice follow-up copy pack docs mirror route.");
else {
  const html = fs.readFileSync(invoiceFollowupDocsRouteFile, "utf8");
  if (!html.includes("What kind of invoice follow-up do you need?") || !html.includes("Invoice status and public-safe context") || !html.includes("Preferred tone")) failures.push("Invoice follow-up docs mirror should use invoice-specific request fields.");
  for (const retiredInvoiceCopy of ["Cookies, market boxes", "QR sign link", "Start with free audit", "See the $9 template kit"]) {
    if (html.includes(retiredInvoiceCopy)) failures.push(`Invoice follow-up docs mirror should not include custom print-pack request copy: ${retiredInvoiceCopy}`);
  }
}

const uploadLimitFixPlanDocsRouteFile = path.join(root, "docs", UPLOAD_LIMIT_FIX_PLAN_SERVICE.slug, "index.html");
if (!fs.existsSync(uploadLimitFixPlanDocsRouteFile)) failures.push("Missing upload limit fix plan docs mirror route.");
else {
  const html = fs.readFileSync(uploadLimitFixPlanDocsRouteFile, "utf8");
  if (!html.includes("Upload error text") || !html.includes("File type and target rule") || !html.includes("Blocked file type")) failures.push("Upload limit fix plan docs mirror should use upload-specific request fields.");
  for (const retiredUploadCopy of ["Cookies, market boxes", "QR sign link"]) {
    if (html.includes(retiredUploadCopy)) failures.push(`Upload limit fix plan docs mirror should not include unrelated service request copy: ${retiredUploadCopy}`);
  }
}

const auditRouteFile = path.join(root, MARKET_TABLE_PRINT_AUDIT.slug, "index.html");
if (!fs.existsSync(auditRouteFile)) failures.push("Missing restored market table print audit route.");
else {
  const html = fs.readFileSync(auditRouteFile, "utf8");
  if (!html.includes(MARKET_TABLE_PRINT_AUDIT.name) || !html.includes("Request free audit")) failures.push("Audit route missing free audit request CTA.");
  if (!html.includes('data-service-lead-form') || !html.includes('data-service-type="market-table-print-audit"') || !html.includes("Send audit request")) failures.push("Audit route missing low-friction audit lead form.");
  if (!html.includes(`$${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup`) || !html.includes("does not count as revenue")) failures.push("Audit route missing optional paid upgrade gate.");
  if (!sitemap.includes(`<loc>${siteUrl(MARKET_TABLE_PRINT_AUDIT.slug)}</loc>`)) failures.push("Sitemap should include restored audit route.");
}

const salesPackRouteFile = path.join(root, SERVICE_SALES_PACK.slug, "index.html");
if (!fs.existsSync(salesPackRouteFile)) failures.push("Missing service sales pack route.");
else {
  const html = fs.readFileSync(salesPackRouteFile, "utf8");
  if (!html.includes('content="noindex,follow"')) failures.push("Service sales pack route should remain noindex.");
  if (!html.includes("Copy-ready outreach") || (!html.includes("real external payment provider") && !html.includes("real payment provider"))) failures.push("Service sales pack route missing outreach and payment gate.");
  if (sitemap.includes(`<loc>${siteUrl(SERVICE_SALES_PACK.slug)}</loc>`)) failures.push("Sitemap should not include noindex service sales pack.");
}

const requiredServiceArtifacts = [
  "digital-products.json",
  "services.json",
  "service-sales-pack.json",
  LOCAL_SELLER_STARTER_KIT.publicSamplePath,
  LOCAL_SELLER_STARTER_KIT.publicRequestPath,
  LOCAL_SELLER_STARTER_KIT.packageReportPath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicRequestPath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicPaymentReplyPath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicFulfillmentChecklistPath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOrderPipelinePath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOutreachQueuePath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOutreachBatchPath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicSampleDeliveryPath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicDeliveryInputExamplePath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicDeliveryReportPath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.publicRequestPath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.publicPaymentReplyPath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.publicFulfillmentChecklistPath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.publicOrderPipelinePath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.publicOutreachQueuePath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.publicOutreachBatchPath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.publicSampleDeliveryPath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.publicDeliveryInputExamplePath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.publicDeliveryReportPath,
  UPLOAD_LIMIT_FIX_PLAN_SERVICE.issueTemplatePath,
  INVOICE_FOLLOWUP_COPY_PACK_SERVICE.issueTemplatePath,
  MARKET_TABLE_PRINT_AUDIT.publicRequestPath,
  MARKET_TABLE_PRINT_AUDIT.publicChecklistPath,
  CUSTOM_LOCAL_PRINT_PACK_SERVICE.issueTemplatePath,
  MARKET_TABLE_PRINT_AUDIT.issueTemplatePath,
];
for (const requiredPath of requiredServiceArtifacts) {
  if (!fs.existsSync(path.join(root, requiredPath))) failures.push(`Missing restored service artifact: ${requiredPath}`);
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
  if (!distribution.includes("Ad-safe free-tool distribution")) failures.push("DISTRIBUTION.md missing ad-safe free-tool distribution section.");
  if (!distribution.includes("Organic push tasks")) failures.push("DISTRIBUTION.md missing organic push task queue.");
  if (!distribution.includes("organic-push-kit.json")) failures.push("DISTRIBUTION.md missing organic push kit JSON link.");
  if (!distribution.includes("Sponsor and partner discovery")) failures.push("DISTRIBUTION.md missing sponsor discovery section.");
  if (!distribution.includes("sponsor-call")) failures.push("DISTRIBUTION.md missing sponsor call link.");
  if (!distribution.includes("utm_source=sponsor-outreach")) failures.push("DISTRIBUTION.md missing sponsor outreach tracking.");
  if (!distribution.includes("TechTools Overdue Invoice Reminder listing") || !distribution.includes("overdue_invoice_2026_06")) failures.push("DISTRIBUTION.md missing overdue invoice reminder directory listing.");
  if (!distribution.includes("TechTools Upload Limit Fix Plan listing") || !distribution.includes("upload_limit_fix_plan_2026_06")) failures.push("DISTRIBUTION.md missing upload limit fix plan directory listing.");
  if (!distribution.includes("TechTools Upload Error Cheatsheet listing") || !distribution.includes("upload_error_cheatsheet_2026_06")) failures.push("DISTRIBUTION.md missing upload error cheatsheet directory listing.");
  if (!distribution.includes("TechTools Compress PDF to 1MB listing") || !distribution.includes("pdf_1mb_2026_06")) failures.push("DISTRIBUTION.md missing compress PDF to 1MB directory listing.");
  if (!distribution.includes("TechTools Photo Under 100KB Upload Fix listing") || !distribution.includes("photo_100kb_tool_fix_2026_06")) failures.push("DISTRIBUTION.md missing photo 100KB upload fix directory listing.");
  if (!distribution.includes("TechTools Image Under 2MB Upload Fix listing") || !distribution.includes("image_2mb_tool_fix_2026_06")) failures.push("DISTRIBUTION.md missing image 2MB upload fix directory listing.");
  if (!distribution.includes("TechTools JPG Under 200KB Upload Fix listing") || !distribution.includes("jpg_200kb_tool_fix_2026_06")) failures.push("DISTRIBUTION.md missing JPG 200KB upload fix directory listing.");
  if (!distribution.includes("TechTools Resume PDF Too Large Upload Fix listing") || !distribution.includes("resume_pdf_too_large_fix_2026_06")) failures.push("DISTRIBUTION.md missing resume PDF too large upload fix directory listing.");
  if (!distribution.includes("TechTools PNG Screenshot Too Large Upload Fix listing") || !distribution.includes("png_screenshot_too_large_fix_2026_06")) failures.push("DISTRIBUTION.md missing PNG screenshot too large upload fix directory listing.");
  if (!distribution.includes("TechTools Passport Photo 50KB Upload Fix listing") || !distribution.includes("passport_photo_50kb_fix_2026_06")) failures.push("DISTRIBUTION.md missing passport photo 50KB upload fix directory listing.");
  if (!distribution.includes("TechTools PDF Under 500KB Upload Fix listing") || !distribution.includes("pdf_500kb_tool_fix_2026_06")) failures.push("DISTRIBUTION.md missing PDF 500KB upload fix directory listing.");
  if (!distribution.includes("TechTools Image Under 500KB Upload Fix listing") || !distribution.includes("image_500kb_tool_fix_2026_06")) failures.push("DISTRIBUTION.md missing image 500KB upload fix directory listing.");
  if (!distribution.includes("TechTools Image Dimensions 600x600 Upload Fix listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=184")) failures.push("DISTRIBUTION.md missing TechTools image dimensions live listing.");
  if (!distribution.includes("TechTools PDF Not Accepted JPG Required Fix listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=185")) failures.push("DISTRIBUTION.md missing TechTools PDF-to-JPG live listing.");
  if (!distribution.includes("TechTools Email Attachment Too Large PDF Fix listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=186")) failures.push("DISTRIBUTION.md missing TechTools email attachment live listing.");
  if (!distribution.includes("TechTools Compress JPG to 50KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=192")) failures.push("DISTRIBUTION.md missing TechTools JPG 50KB live listing.");
  if (!distribution.includes("TechTools Compress JPG to 100KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=193")) failures.push("DISTRIBUTION.md missing TechTools JPG 100KB live listing.");
  if (!distribution.includes("TechTools Compress JPG to 200KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=194")) failures.push("DISTRIBUTION.md missing TechTools JPG 200KB live listing.");
  if (!distribution.includes("TechTools Compress PNG to 50KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=195")) failures.push("DISTRIBUTION.md missing TechTools PNG 50KB live listing.");
  if (!distribution.includes("TechTools Compress PNG to 100KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=196")) failures.push("DISTRIBUTION.md missing TechTools PNG 100KB live listing.");
  if (!distribution.includes("TechTools Compress PNG to 200KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=197")) failures.push("DISTRIBUTION.md missing TechTools PNG 200KB live listing.");
  if (!distribution.includes("TechTools Passport Photo Compress to 50KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=198")) failures.push("DISTRIBUTION.md missing TechTools passport photo 50KB live listing.");
  if (!distribution.includes("TechTools Passport Photo Compress to 100KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=199")) failures.push("DISTRIBUTION.md missing TechTools passport photo 100KB live listing.");
  if (!distribution.includes("TechTools Passport Photo Compress to 200KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=200")) failures.push("DISTRIBUTION.md missing TechTools passport photo 200KB live listing.");
  if (!distribution.includes("TechTools PDF Under 2MB Upload Fix listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=201")) failures.push("DISTRIBUTION.md missing TechTools PDF under 2MB live listing.");
  if (!distribution.includes("TechTools PDF Under 5MB Upload Fix listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=202")) failures.push("DISTRIBUTION.md missing TechTools PDF under 5MB live listing.");
  if (!distribution.includes("TechTools Resume PDF Under 2MB Upload Fix listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=203")) failures.push("DISTRIBUTION.md missing TechTools resume PDF under 2MB live listing.");
  if (!distribution.includes("TechTools Document Under 5MB Upload Fix listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=204")) failures.push("DISTRIBUTION.md missing TechTools document under 5MB live listing.");
  if (!distribution.includes("TechTools PDF Size Reducer listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=205")) failures.push("DISTRIBUTION.md missing TechTools PDF size reducer live listing.");
  if (!distribution.includes("TechTools Compress PDF to 2MB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=206")) failures.push("DISTRIBUTION.md missing TechTools compress PDF to 2MB live listing.");
  if (!distribution.includes("TechTools Compress PDF to 5MB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=207")) failures.push("DISTRIBUTION.md missing TechTools compress PDF to 5MB live listing.");
  if (!distribution.includes("TechTools Compress PDF Without Uploading listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=208")) failures.push("DISTRIBUTION.md missing TechTools compress PDF without uploading live listing.");
  if (!distribution.includes("TechTools PDF to JPG Without Uploading listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=209")) failures.push("DISTRIBUTION.md missing TechTools PDF to JPG without uploading live listing.");
  if (!distribution.includes("TechTools JPG to PDF Without Uploading listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=210")) failures.push("DISTRIBUTION.md missing TechTools JPG to PDF without uploading live listing.");
  if (!distribution.includes("TechTools Extract Text From PDF Without Uploading listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=212")) failures.push("DISTRIBUTION.md missing TechTools extract text from PDF without uploading live listing.");
  if (!distribution.includes("TechTools Merge PDF Without Uploading listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=213")) failures.push("DISTRIBUTION.md missing TechTools merge PDF without uploading live listing.");
  if (!distribution.includes("TechTools Split PDF Without Uploading listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=214")) failures.push("DISTRIBUTION.md missing TechTools split PDF without uploading live listing.");
  if (!distribution.includes("TechTools Signature Under 20KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=215")) failures.push("DISTRIBUTION.md missing TechTools signature 20KB live listing.");
  if (!distribution.includes("TechTools Passport Photo Size Fixer listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=216")) failures.push("DISTRIBUTION.md missing TechTools passport photo size fixer live listing.");
  if (!distribution.includes("TechTools Resize Photo 413x531 listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=217")) failures.push("DISTRIBUTION.md missing TechTools resize photo 413x531 live listing.");
  if (!distribution.includes("TechTools Signature Under 50KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=218")) failures.push("DISTRIBUTION.md missing TechTools signature 50KB live listing.");
  if (!distribution.includes("TechTools Resize Signature 140x60 listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=219")) failures.push("DISTRIBUTION.md missing TechTools resize signature 140x60 live listing.");
  if (!distribution.includes("TechTools Photo 200x230 Under 50KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=220")) failures.push("DISTRIBUTION.md missing TechTools photo 200x230 under 50KB live listing.");
  if (!distribution.includes("TechTools Resize Signature 200x100 listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=221")) failures.push("DISTRIBUTION.md missing TechTools resize signature 200x100 live listing.");
  if (!distribution.includes("TechTools Resize Photo 200x230 listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=222")) failures.push("DISTRIBUTION.md missing TechTools resize photo 200x230 live listing.");
  if (!distribution.includes("TechTools Passport Photo 35x45mm listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=223")) failures.push("DISTRIBUTION.md missing TechTools passport photo 35x45mm live listing.");
  if (!distribution.includes("TechTools Photo 120x160 Under 20KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=263")) failures.push("DISTRIBUTION.md missing TechTools photo 120x160 under 20KB live listing.");
  if (!distribution.includes("TechTools Photo 160x200 Under 30KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=264")) failures.push("DISTRIBUTION.md missing TechTools photo 160x200 under 30KB live listing.");
  if (!distribution.includes("TechTools Photo 300x400 Under 100KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=265")) failures.push("DISTRIBUTION.md missing TechTools photo 300x400 under 100KB live listing.");
  if (!distribution.includes("TechTools Photo 350x450 Under 100KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=266")) failures.push("DISTRIBUTION.md missing TechTools photo 350x450 under 100KB live listing.");
  if (!distribution.includes("TechTools Photo 360x480 Under 100KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=267")) failures.push("DISTRIBUTION.md missing TechTools photo 360x480 under 100KB live listing.");
  if (!distribution.includes("TechTools Photo 420x560 Under 200KB listing") || !distribution.includes("https://techtools.cz/tools/launchpad/?tool=268")) failures.push("DISTRIBUTION.md missing TechTools photo 420x560 under 200KB live listing.");
  if (!distribution.includes("NoLogin.tools Upload Error Cheatsheet listing") || !distribution.includes("upload_error_cheatsheet_2026_06")) failures.push("DISTRIBUTION.md missing NoLogin upload error cheatsheet submission.");
  if (!distribution.includes("NoSignupTools Upload Limit Fixer listing") || !distribution.includes("upload_limit_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools upload limit fixer submission.");
  if (!distribution.includes("NoSignupTools Upload Error Cheatsheet listing") || !distribution.includes("upload_error_cheatsheet_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools upload error cheatsheet submission.");
  if (!distribution.includes("NoSignupTools Compress Image to 50KB listing") || !distribution.includes("image_50kb_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools compress image to 50KB submission.");
  if (!distribution.includes("NoSignupTools Compress Image to 100KB listing") || !distribution.includes("image_100kb_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools compress image to 100KB submission.");
  if (!distribution.includes("NoSignupTools Compress Image to 200KB listing") || !distribution.includes("image_200kb_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools compress image to 200KB submission.");
  if (!distribution.includes("NoSignupTools Compress JPG to 50KB listing") || !distribution.includes("jpg_50kb_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools compress JPG to 50KB submission.");
  if (!distribution.includes("NoSignupTools Compress PNG to 200KB listing") || !distribution.includes("png_200kb_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools compress PNG to 200KB submission.");
  if (!distribution.includes("NoSignupTools Passport Photo Compress to 200KB listing") || !distribution.includes("passport_200kb_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools passport photo 200KB submission.");
  if (!distribution.includes("NoSignupTools Photo 120x160 Under 20KB listing") || !distribution.includes("photo_120x160_20kb_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools photo 120x160 submission.");
  if (!distribution.includes("NoSignupTools Photo 420x560 Under 200KB listing") || !distribution.includes("photo_420x560_200kb_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools photo 420x560 submission.");
  if (!distribution.includes("NoSignupTools PDF Under 2MB Upload Fix listing") || !distribution.includes("pdf_under_2mb_upload_fix_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools PDF under 2MB submission.");
  if (!distribution.includes("NoSignupTools PDF Under 5MB Upload Fix listing") || !distribution.includes("pdf_under_5mb_upload_fix_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools PDF under 5MB submission.");
  if (!distribution.includes("NoSignupTools Resume PDF Under 2MB Upload Fix listing") || !distribution.includes("resume_pdf_under_2mb_upload_fix_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools resume PDF under 2MB submission.");
  if (!distribution.includes("NoSignupTools Document Under 5MB Upload Fix listing") || !distribution.includes("document_under_5mb_upload_fix_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools document under 5MB submission.");
  if (!distribution.includes("NoSignupTools Extract Text From PDF Without Uploading listing") || !distribution.includes("extract_text_pdf_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools extract text from PDF submission.");
  if (!distribution.includes("NoSignupTools Merge PDF Without Uploading listing") || !distribution.includes("merge_pdf_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools merge PDF submission.");
  if (!distribution.includes("NoSignupTools Split PDF Without Uploading listing") || !distribution.includes("split_pdf_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools split PDF submission.");
  if (!distribution.includes("NoSignupTools Rotate PDF Pages Without Uploading listing") || !distribution.includes("rotate_pdf_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools rotate PDF submission.");
  if (!distribution.includes("NoSignupTools Remove Pages From PDF Without Uploading listing") || !distribution.includes("remove_pages_pdf_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools remove PDF pages submission.");
  if (!distribution.includes("NoSignupTools Reorder PDF Pages Without Uploading listing") || !distribution.includes("reorder_pdf_pages_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools reorder PDF pages submission.");
  if (!distribution.includes("NoSignupTools Add Page Numbers to PDF listing") || !distribution.includes("add_page_numbers_pdf_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools add page numbers submission.");
  if (!distribution.includes("NoSignupTools Stamp PDF Without Uploading listing") || !distribution.includes("stamp_pdf_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools stamp PDF submission.");
  if (!distribution.includes("NoSignupTools Sign PDF Without Uploading listing") || !distribution.includes("sign_pdf_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools sign PDF submission.");
  if (!distribution.includes("NoSignupTools Compress Image Without Uploading listing") || !distribution.includes("compress_image_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools compress image no-upload submission.");
  if (!distribution.includes("NoSignupTools Resize Image Without Uploading listing") || !distribution.includes("resize_image_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools resize image no-upload submission.");
  if (!distribution.includes("NoSignupTools Convert Image Format Without Uploading listing") || !distribution.includes("convert_image_format_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools convert image no-upload submission.");
  if (!distribution.includes("NoSignupTools Remove Background Without Uploading listing") || !distribution.includes("remove_background_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools remove background no-upload submission.");
  if (!distribution.includes("NoSignupTools Crop Image Without Uploading listing") || !distribution.includes("crop_image_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools crop image no-upload submission.");
  if (!distribution.includes("NoSignupTools Rotate Image Without Uploading listing") || !distribution.includes("rotate_image_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools rotate image no-upload submission.");
  if (!distribution.includes("NoSignupTools Watermark Image Without Uploading listing") || !distribution.includes("watermark_image_no_upload_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools watermark image no-upload submission.");
  if (!distribution.includes("TechTools no-upload PDF extract/merge/split submissions; retried after the 1-hour API limit")) failures.push("DISTRIBUTION.md missing TechTools no-upload PDF extract/merge/split live retry note.");
  if (!distribution.includes("TechTools exact photo resize submissions; retried after the 1-hour API limit")) failures.push("DISTRIBUTION.md missing TechTools exact photo live retry note.");
  if (!distribution.includes("FreeNoSignup Upload Limit Fixer listing") || !distribution.includes("utm_source=freenosignup")) failures.push("DISTRIBUTION.md missing FreeNoSignup upload limit fixer submission.");
  if (!distribution.includes("FreeNoSignup Upload Error Cheatsheet listing") || !distribution.includes("upload_error_cheatsheet_2026_06")) failures.push("DISTRIBUTION.md missing FreeNoSignup upload error cheatsheet submission.");
  if (!distribution.includes("FreeNoSignup Compress PDF to 500KB listing") || !distribution.includes("pdf_500kb_2026_06")) failures.push("DISTRIBUTION.md missing FreeNoSignup PDF 500KB submission.");
  if (!distribution.includes("FreeNoSignup Image Must Be Under 500KB Fix listing") || !distribution.includes("image_under_500kb_upload_fix_2026_06")) failures.push("DISTRIBUTION.md missing FreeNoSignup image under 500KB submission.");
  if (!distribution.includes("FreeNoSignup Resize Signature 200x100 listing") || !distribution.includes("resize_signature_200x100_2026_06")) failures.push("DISTRIBUTION.md missing FreeNoSignup resize signature 200x100 submission.");
  if (!distribution.includes("FreeNoSignup Photo 120x160 Under 20KB listing") || !distribution.includes("photo_120x160_20kb_2026_06")) failures.push("DISTRIBUTION.md missing FreeNoSignup photo 120x160 submission.");
  if (!distribution.includes("FreeNoSignup Photo 420x560 Under 200KB listing") || !distribution.includes("photo_420x560_200kb_2026_06")) failures.push("DISTRIBUTION.md missing FreeNoSignup photo 420x560 submission.");
  if (!distribution.includes("FreeNoSignup exact upload-limit submissions for PDF 500KB")) failures.push("DISTRIBUTION.md missing FreeNoSignup exact upload-limit submission status note.");
  if (!distribution.includes("FreeNoSignup photo/signature upload-limit submissions")) failures.push("DISTRIBUTION.md missing FreeNoSignup photo/signature submission status note.");
  if (!distribution.includes("NoSignupTools Overdue Invoice Reminder listing") || !distribution.includes("utm_source=nosignuptools")) failures.push("DISTRIBUTION.md missing NoSignupTools overdue invoice reminder submission.");
  if (!distribution.includes("FreeNoSignup Overdue Invoice Reminder listing") || !distribution.includes("utm_source=freenosignup")) failures.push("DISTRIBUTION.md missing FreeNoSignup overdue invoice reminder submission.");
  if (!distribution.includes("NoLogin.tools Overdue Invoice Reminder listing") || !distribution.includes("utm_source=nologin")) failures.push("DISTRIBUTION.md missing NoLogin overdue invoice reminder submission.");
  if (!distribution.includes("NoLogin.tools Compress Image to 50KB listing") || !distribution.includes("utm_source=nologin")) failures.push("DISTRIBUTION.md missing NoLogin compress image to 50KB submission.");
  if (!distribution.includes("NoLogin.tools Compress Image to 100KB listing") || !distribution.includes("image_100kb_2026_06")) failures.push("DISTRIBUTION.md missing NoLogin compress image to 100KB submission.");
  if (!distribution.includes("NoLogin.tools Compress Image to 200KB submission; rate limited")) failures.push("DISTRIBUTION.md missing NoLogin compress image to 200KB retry note.");
  if (!distribution.includes("NoLogin.tools Photo 150x200 Under 20KB queued listing") || !distribution.includes("photo_150x200_20kb_2026_06")) failures.push("DISTRIBUTION.md missing NoLogin exact photo queued listing.");
  if (!distribution.includes("NoLogin.tools Signature 400x200 Under 100KB queued listing") || !distribution.includes("signature_400x200_100kb_2026_06")) failures.push("DISTRIBUTION.md missing NoLogin exact signature queued listing.");
  if (!distribution.includes("NoLogin.tools latest exact photo/signature upload-limit queue")) failures.push("DISTRIBUTION.md missing NoLogin exact upload-limit queue status note.");
  if (!distribution.includes("TechTools Photo 480x640 Under 200KB listing: https://techtools.cz/tools/launchpad/?tool=240")) failures.push("DISTRIBUTION.md missing TechTools latest exact photo live listing.");
  if (!distribution.includes("TechTools Photo 420x560 Under 200KB listing: https://techtools.cz/tools/launchpad/?tool=268")) failures.push("DISTRIBUTION.md missing TechTools newest exact photo live listing.");
  if (!distribution.includes("TechTools Signature 400x200 Under 100KB listing: https://techtools.cz/tools/launchpad/?tool=253")) failures.push("DISTRIBUTION.md missing TechTools latest exact signature live listing.");
  if (!distribution.includes("TechTools exact upload-limit photo/signature submissions; retried after API limits")) failures.push("DISTRIBUTION.md missing TechTools latest exact upload-limit live status note.");
  if (!distribution.includes("free_tool_depth")) failures.push("DISTRIBUTION.md missing free-tool depth tracking campaign.");
  if (distribution.includes("Paid service sales pack")) failures.push("DISTRIBUTION.md should not promote paid service sales pack in the main distribution pack.");
  if (distribution.includes("service_sales_pack")) failures.push("DISTRIBUTION.md should not promote service sales tracking campaign.");
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
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("sponsor-call"))) failures.push("discovery.json missing sponsor call page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("sponsor-deal-room"))) failures.push("discovery.json missing sponsor deal room page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("sponsor-opportunities"))) failures.push("discovery.json missing sponsor opportunities page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("sponsor"))) failures.push("discovery.json missing sponsor page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug))) failures.push("discovery.json should list restored paid service page as a commercial entry point.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl(MARKET_TABLE_PRINT_AUDIT.slug))) failures.push("discovery.json should list restored audit lead magnet as a commercial entry point.");
  if (Array.isArray(discovery.highIntentEntryPoints) && discovery.highIntentEntryPoints.some((url) => url === siteUrl(LOCAL_SELLER_STARTER_KIT.slug))) failures.push("discovery.json should not list seller kit as a broad high-intent entry point until checkout is configured.");
  if (Array.isArray(discovery.highIntentEntryPoints) && discovery.highIntentEntryPoints.some((url) => url === siteUrl(SERVICE_SALES_PACK.slug))) failures.push("discovery.json should not list service sales pack as a high-intent entry point.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("platform-submit-queue"))) failures.push("discovery.json missing platform submit queue page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("platform-submit-cockpit"))) failures.push("discovery.json missing platform submit cockpit page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("platform-outreach-tracker"))) failures.push("discovery.json missing platform outreach tracker page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("portal-submission-pack"))) failures.push("discovery.json missing portal submission pack page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("zero-cost-monetization-map"))) failures.push("discovery.json missing zero-cost monetization map page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("upload-limit-fixer"))) failures.push("discovery.json missing upload limit fixer page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("organic-push-kit"))) failures.push("discovery.json missing organic push kit page.");
  if (!Array.isArray(discovery.highIntentEntryPoints) || !discovery.highIntentEntryPoints.some((url) => url === siteUrl("upload-error-cheatsheet"))) failures.push("discovery.json missing upload error cheatsheet page.");
  if (discovery.shareKit !== siteUrl("share-kit.json").replace(/\/$/, "")) failures.push("discovery.json missing share-kit.json URL.");
  if (discovery.organicPushKit !== siteUrl("organic-push-kit.json").replace(/\/$/, "")) failures.push("discovery.json missing organic-push-kit.json URL.");
  if (discovery.uploadErrorCheatsheet !== siteUrl("upload-error-cheatsheet.json").replace(/\/$/, "")) failures.push("discovery.json missing upload-error-cheatsheet.json URL.");
  if (discovery.sponsorCall !== siteUrl("sponsor-call.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor-call.json URL.");
  if (discovery.sponsorDealRoom !== siteUrl("sponsor-deal-room.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor-deal-room.json URL.");
  if (discovery.sponsorOpportunities !== siteUrl("sponsor-opportunities.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor-opportunities.json URL.");
  if (discovery.sponsorIntentFeed !== siteUrl("sponsor-intent-feed.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor-intent-feed.json URL.");
  if (discovery.sponsorMediaKit !== siteUrl("sponsor-media-kit.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor-media-kit.json URL.");
  if (discovery.sponsorOutreachPack !== siteUrl("sponsor-outreach-pack.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor-outreach-pack.json URL.");
  if (discovery.platformSubmitQueue !== siteUrl("platform-submit-queue.json").replace(/\/$/, "")) failures.push("discovery.json missing platform-submit-queue.json URL.");
  if (discovery.platformSubmitCockpit !== siteUrl("platform-submit-cockpit.json").replace(/\/$/, "")) failures.push("discovery.json missing platform-submit-cockpit.json URL.");
  if (discovery.platformOutreachTracker !== siteUrl("platform-outreach-tracker.json").replace(/\/$/, "")) failures.push("discovery.json missing platform-outreach-tracker.json URL.");
  if (discovery.portalSubmissionPack !== siteUrl("portal-submission-pack.json").replace(/\/$/, "")) failures.push("discovery.json missing portal-submission-pack.json URL.");
  if (discovery.zeroCostMonetizationMap !== siteUrl("zero-cost-monetization-map.json").replace(/\/$/, "")) failures.push("discovery.json missing zero-cost-monetization-map.json URL.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.campaignVideos) || discovery.distributionAssets.campaignVideos.length < 6) failures.push("discovery.json missing campaign video assets.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.publicGist || "").includes("gist.github.com/yanqr213")) failures.push("discovery.json missing public Gist URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.organicPushKit !== siteUrl("organic-push-kit")) failures.push("discovery.json missing organic push kit URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.organicPushKitJson !== siteUrl("organic-push-kit.json").replace(/\/$/, "")) failures.push("discovery.json missing organic push kit JSON URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.uploadErrorCheatsheet !== siteUrl("upload-error-cheatsheet")) failures.push("discovery.json missing upload error cheatsheet URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.uploadErrorCheatsheetJson !== siteUrl("upload-error-cheatsheet.json").replace(/\/$/, "")) failures.push("discovery.json missing upload error cheatsheet JSON URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.sponsorCall !== siteUrl("sponsor-call")) failures.push("discovery.json missing sponsor call URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.sponsorCallJson !== siteUrl("sponsor-call.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor call JSON URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.sponsorDealRoom !== siteUrl("sponsor-deal-room")) failures.push("discovery.json missing sponsor deal room URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.sponsorDealRoomJson !== siteUrl("sponsor-deal-room.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor deal room JSON URL.");
  if (!Array.isArray(discovery.distributionAssets?.sponsorDeals) || discovery.distributionAssets.sponsorDeals.length !== SPONSOR_DEALS.length) failures.push("discovery.json missing sponsor deals.");
  if (!discovery.distributionAssets || discovery.distributionAssets.sponsorOpportunities !== siteUrl("sponsor-opportunities")) failures.push("discovery.json missing sponsor opportunities URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.sponsorOpportunitiesJson !== siteUrl("sponsor-opportunities.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor opportunities JSON URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.sponsorIntentFeedJson !== siteUrl("sponsor-intent-feed.json").replace(/\/$/, "")) failures.push("discovery.json missing sponsor intent feed JSON URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.sponsorPage !== siteUrl("sponsor")) failures.push("discovery.json missing sponsor page URL.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.sponsorDiscoveryLinks) || !discovery.distributionAssets.sponsorDiscoveryLinks.some((item) => String(item.url || "").includes("utm_source=sponsor-outreach"))) failures.push("discovery.json missing sponsor discovery links.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.sponsorDiscoveryLinks) || !discovery.distributionAssets.sponsorDiscoveryLinks.some((item) => item.title === "Public USD 49 invoice request" && String(item.url || "").includes("commitment%3Drequest-invoice") && String(item.url || "").includes("body=Public-safe+sponsor+reply"))) failures.push("discovery.json missing public USD 49 invoice request link.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.sponsorVerticalPages) || discovery.distributionAssets.sponsorVerticalPages.length < 5) failures.push("discovery.json missing sponsor vertical page list.");
  if (!discovery.distributionAssets || !String(discovery.distributionAssets.publicGrowthIssue || "").includes("github.com/yanqr213/printable-tools-lab/issues/1")) failures.push("discovery.json missing public GitHub issue URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.platformSubmitQueue !== siteUrl("platform-submit-queue")) failures.push("discovery.json missing platform submit queue URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.platformSubmitCockpit !== siteUrl("platform-submit-cockpit")) failures.push("discovery.json missing platform submit cockpit URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.platformOutreachTracker !== siteUrl("platform-outreach-tracker")) failures.push("discovery.json missing platform outreach tracker URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.portalSubmissionPack !== siteUrl("portal-submission-pack")) failures.push("discovery.json missing portal submission pack URL.");
  if (!discovery.distributionAssets?.localSellerService || discovery.distributionAssets.localSellerService.servicePage !== siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)) failures.push("discovery.json missing restored local seller service distribution asset.");
  if (!String(discovery.distributionAssets?.localSellerService?.moneyGate || "").includes("external provider")) failures.push("discovery.json restored service asset missing external-provider money gate.");
  if (discovery.distributionAssets?.serviceSalesPack) failures.push("discovery.json should not promote service sales pack in primary distribution assets.");
  if (discovery.distributionAssets?.marketTablePrintAudit || discovery.distributionAssets?.marketTablePrintAuditRequest || discovery.distributionAssets?.marketTablePrintAuditChecklist) failures.push("discovery.json should not promote retired market table audit assets.");
  if (!discovery.distributionAssets || discovery.distributionAssets.zeroCostMonetizationMap !== siteUrl("zero-cost-monetization-map")) failures.push("discovery.json missing zero-cost monetization map URL.");
  if (!discovery.distributionAssets || discovery.distributionAssets.zeroDomainGame !== "https://upload-limit-panic.pages.dev/") failures.push("discovery.json missing zero-domain game URL.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.zeroDomainGames) || discovery.distributionAssets.zeroDomainGames.length < 2) failures.push("discovery.json missing zero-domain game list.");
  if (!discovery.distributionAssets || !discovery.distributionAssets.zeroDomainGames?.every((item) => String(item.cleanZipUrl || "").includes("portal-clean.zip"))) failures.push("discovery.json missing clean portal ZIP URLs.");
  if (!discovery.distributionAssets || !Array.isArray(discovery.distributionAssets.zeroDomainGames) || !discovery.distributionAssets.zeroDomainGames.some((item) => item.url === "https://neon-lane-dash.pages.dev/")) failures.push("discovery.json missing Neon Lane Dash URL.");
  if (discovery.feed !== siteUrl("feed.xml").replace(/\/$/, "")) failures.push("discovery.json missing RSS feed URL.");
  if (!Array.isArray(discovery.landingPages) || discovery.landingPages.length < 72) failures.push("discovery.json missing high-intent landing pages.");
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
  ["file-must-be-less-than-1mb", "Fix file must be less than 1 MB", "/tools/compress-pdf/?targetSize=1mb"],
  ["pdf-must-be-under-100kb", "Fix PDF must be under 100KB", "/tools/compress-pdf/?targetSize=100kb"],
  ["pdf-must-be-under-200kb", "Fix PDF must be under 200KB", "/tools/compress-pdf/?targetSize=200kb"],
  ["pdf-must-be-under-300kb", "Fix PDF must be under 300KB", "/tools/compress-pdf/?targetSize=300kb"],
  ["pdf-must-be-under-500kb", "Fix PDF must be under 500KB", "/tools/compress-pdf/?targetSize=500kb"],
  ["pdf-must-be-under-2mb", "Fix PDF must be under 2 MB", "/tools/compress-pdf/?targetSize=2mb"],
  ["pdf-must-be-under-5mb", "Fix PDF must be under 5 MB", "/tools/compress-pdf/?targetSize=5mb"],
  ["pdf-must-be-under-10mb", "Fix PDF must be under 10 MB", "/tools/compress-pdf/?targetSize=10mb"],
  ["photo-must-be-under-100kb", "Fix photo must be under 100KB", "/tools/compress-image-to-kb/?targetKb=100"],
  ["invalid-file-type-jpg-png", "Fix invalid file type: upload JPG or PNG", "/tools/convert-image/"],
  ["image-dimensions-600x600", "Fix image dimensions must be 600 x 600", "/tools/resize-image/?width=600&height=600&fit=cover"],
  ["pdf-not-accepted-jpg-required", "Fix PDF not accepted, JPG required", "/tools/pdf-to-images/"],
  ["image-must-be-less-than-2mb", "Fix image must be less than 2 MB", "/tools/compress-image-to-kb/?targetKb=2048"],
  ["image-must-be-under-500kb", "Fix image must be under 500KB", "/tools/compress-image-to-kb/?targetKb=500"],
  ["jpg-must-be-under-200kb", "Fix JPG must be under 200KB", "/tools/compress-image-to-kb/?targetKb=200"],
  ["png-screenshot-too-large", "Fix PNG screenshot too large", "/tools/compress-image-to-kb/?targetKb=500"],
  ["resume-pdf-too-large", "Fix resume PDF too large", "/tools/compress-pdf/?targetSize=1mb"],
  ["resume-pdf-under-2mb", "Make a resume PDF under 2 MB", "/tools/compress-pdf/?targetSize=2mb"],
  ["email-attachment-too-large", "Fix email attachment too large", "/tools/compress-pdf/?targetSize=5mb"],
  ["document-must-be-under-5mb", "Fix document must be under 5 MB", "/tools/compress-pdf/?targetSize=5mb"],
  ["passport-photo-compress-to-50kb", "Compress a passport photo to 50KB", "/tools/compress-image-to-kb/?targetKb=50"],
  ["passport-photo-compress-to-100kb", "Compress a passport photo to 100KB", "/tools/compress-image-to-kb/?targetKb=100"],
  ["passport-photo-compress-to-200kb", "Compress a passport photo to 200KB", "/tools/compress-image-to-kb/?targetKb=200"],
  ["passport-photo-size-fixer", "Fix passport photo size and file limit", "/tools/passport-photo/"],
  ["passport-photo-35x45mm", "Make a 35 x 45 mm passport photo without uploading", "/tools/passport-photo/?preset=uk-passport"],
  ["photo-200x230-50kb", "Make a 200 x 230 px photo under 50KB", "/tools/resize-image/?width=200&height=230&fit=cover"],
  ["photo-200x230-20kb", "Make a 200 x 230 px photo under 20KB", "/tools/resize-image/?width=200&height=230&fit=cover"],
  ["photo-200x230-100kb", "Make a 200 x 230 px photo under 100KB", "/tools/resize-image/?width=200&height=230&fit=cover"],
  ["photo-240x320-50kb", "Make a 240 x 320 px photo under 50KB", "/tools/resize-image/?width=240&height=320&fit=cover"],
  ["photo-295x413-35kb", "Make a 295 x 413 px photo under 35KB", "/tools/resize-image/?width=295&height=413&fit=cover"],
  ["photo-413x531-100kb", "Make a 413 x 531 px photo under 100KB", "/tools/resize-image/?width=413&height=531&fit=cover"],
  ["photo-413x531-50kb", "Make a 413 x 531 px photo under 50KB", "/tools/resize-image/?width=413&height=531&fit=cover"],
  ["photo-354x472-100kb", "Make a 354 x 472 px photo under 100KB", "/tools/resize-image/?width=354&height=472&fit=cover"],
  ["photo-300x300-100kb", "Make a 300 x 300 px photo under 100KB", "/tools/resize-image/?width=300&height=300&fit=cover"],
  ["photo-600x600-100kb", "Make a 600 x 600 px photo under 100KB", "/tools/resize-image/?width=600&height=600&fit=cover"],
  ["photo-480x640-200kb", "Make a 480 x 640 px photo under 200KB", "/tools/resize-image/?width=480&height=640&fit=cover"],
  ["photo-512x512-100kb", "Make a 512 x 512 px photo under 100KB", "/tools/resize-image/?width=512&height=512&fit=cover"],
  ["photo-150x200-20kb", "Make a 150 x 200 px photo under 20KB", "/tools/resize-image/?width=150&height=200&fit=cover"],
  ["photo-180x240-50kb", "Make a 180 x 240 px photo under 50KB", "/tools/resize-image/?width=180&height=240&fit=cover"],
  ["photo-400x514-100kb", "Make a 400 x 514 px photo under 100KB", "/tools/resize-image/?width=400&height=514&fit=cover"],
  ["photo-600x800-200kb", "Make a 600 x 800 px photo under 200KB", "/tools/resize-image/?width=600&height=800&fit=cover"],
  ["photo-120x160-20kb", "Make a 120 x 160 px photo under 20KB", "/tools/resize-image/?width=120&height=160&fit=cover"],
  ["photo-160x200-30kb", "Make a 160 x 200 px photo under 30KB", "/tools/resize-image/?width=160&height=200&fit=cover"],
  ["photo-300x400-100kb", "Make a 300 x 400 px photo under 100KB", "/tools/resize-image/?width=300&height=400&fit=cover"],
  ["photo-350x450-100kb", "Make a 350 x 450 px photo under 100KB", "/tools/resize-image/?width=350&height=450&fit=cover"],
  ["photo-360x480-100kb", "Make a 360 x 480 px photo under 100KB", "/tools/resize-image/?width=360&height=480&fit=cover"],
  ["photo-420x560-200kb", "Make a 420 x 560 px photo under 200KB", "/tools/resize-image/?width=420&height=560&fit=cover"],
  ["signature-under-20kb", "Make a signature image under 20KB", "/tools/compress-image-to-kb/?targetKb=20"],
  ["signature-under-50kb", "Make a signature image under 50KB", "/tools/compress-image-to-kb/?targetKb=50"],
  ["resize-signature-140x60", "Resize signature to 140 x 60 pixels", "/tools/resize-image/?width=140&height=60&fit=contain"],
  ["resize-signature-200x100", "Resize signature to 200 x 100 pixels", "/tools/resize-image/?width=200&height=100&fit=contain"],
  ["signature-140x60-20kb", "Make a 140 x 60 px signature under 20KB", "/tools/resize-image/?width=140&height=60&fit=contain"],
  ["signature-140x60-50kb", "Make a 140 x 60 px signature under 50KB", "/tools/resize-image/?width=140&height=60&fit=contain"],
  ["signature-150x50-20kb", "Make a 150 x 50 px signature under 20KB", "/tools/resize-image/?width=150&height=50&fit=contain"],
  ["signature-160x70-20kb", "Make a 160 x 70 px signature under 20KB", "/tools/resize-image/?width=160&height=70&fit=contain"],
  ["signature-200x50-20kb", "Make a 200 x 50 px signature under 20KB", "/tools/resize-image/?width=200&height=50&fit=contain"],
  ["signature-200x100-50kb", "Make a 200 x 100 px signature under 50KB", "/tools/resize-image/?width=200&height=100&fit=contain"],
  ["signature-250x80-50kb", "Make a 250 x 80 px signature under 50KB", "/tools/resize-image/?width=250&height=80&fit=contain"],
  ["signature-300x60-20kb", "Make a 300 x 60 px signature under 20KB", "/tools/resize-image/?width=300&height=60&fit=contain"],
  ["signature-300x80-50kb", "Make a 300 x 80 px signature under 50KB", "/tools/resize-image/?width=300&height=80&fit=contain"],
  ["signature-300x100-50kb", "Make a 300 x 100 px signature under 50KB", "/tools/resize-image/?width=300&height=100&fit=contain"],
  ["signature-400x150-50kb", "Make a 400 x 150 px signature under 50KB", "/tools/resize-image/?width=400&height=150&fit=contain"],
  ["signature-100x50-10kb", "Make a 100 x 50 px signature under 10KB", "/tools/resize-image/?width=100&height=50&fit=contain"],
  ["signature-200x60-20kb", "Make a 200 x 60 px signature under 20KB", "/tools/resize-image/?width=200&height=60&fit=contain"],
  ["signature-256x64-20kb", "Make a 256 x 64 px signature under 20KB", "/tools/resize-image/?width=256&height=64&fit=contain"],
  ["signature-400x200-100kb", "Make a 400 x 200 px signature under 100KB", "/tools/resize-image/?width=400&height=200&fit=contain"],
  ["resize-photo-200x230", "Resize photo to 200 x 230 pixels", "/tools/resize-image/?width=200&height=230&fit=cover"],
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
  if (["passport-photo-35x45mm", "photo-200x230-50kb", "photo-200x230-20kb", "photo-200x230-100kb", "photo-240x320-50kb", "photo-295x413-35kb", "photo-413x531-100kb", "photo-413x531-50kb", "photo-354x472-100kb", "photo-300x300-100kb", "photo-600x600-100kb", "photo-480x640-200kb", "photo-512x512-100kb", "photo-150x200-20kb", "photo-180x240-50kb", "photo-400x514-100kb", "photo-600x800-200kb", "photo-120x160-20kb", "photo-160x200-30kb", "photo-300x400-100kb", "photo-350x450-100kb", "photo-360x480-100kb", "photo-420x560-200kb", "signature-under-20kb", "signature-under-50kb", "resize-signature-140x60", "resize-signature-200x100", "resize-photo-200x230", "signature-140x60-20kb", "signature-140x60-50kb", "signature-150x50-20kb", "signature-160x70-20kb", "signature-200x50-20kb", "signature-200x100-50kb", "signature-250x80-50kb", "signature-300x60-20kb", "signature-300x80-50kb", "signature-300x100-50kb", "signature-400x150-50kb", "signature-100x50-10kb", "signature-200x60-20kb", "signature-256x64-20kb", "signature-400x200-100kb"].includes(pagePath)) {
    if (!html.includes('data-service-primary-invoice-request="true"') || !html.includes("One-contact $9 invoice request") || !html.includes("Where should the external $9 invoice link go?") || !html.includes('data-track-event="service_invoice_request"')) failures.push(`New signature/passport landing page missing one-contact $9 invoice request path: ${pagePath}`);
  }
  if (["file-must-be-less-than-1mb", "pdf-must-be-under-100kb", "pdf-must-be-under-200kb", "pdf-must-be-under-300kb", "pdf-must-be-under-500kb", "pdf-must-be-under-2mb", "pdf-must-be-under-5mb", "pdf-must-be-under-10mb", "photo-must-be-under-100kb", "invalid-file-type-jpg-png", "image-dimensions-600x600", "pdf-not-accepted-jpg-required", "image-must-be-less-than-2mb", "image-must-be-under-500kb", "jpg-must-be-under-200kb", "png-screenshot-too-large", "resume-pdf-too-large", "resume-pdf-under-2mb", "email-attachment-too-large", "document-must-be-under-5mb"].includes(pagePath)) {
    if (!html.includes("data-upload-limit-helper")) failures.push(`Upload-error landing page missing matcher: ${pagePath}`);
    if (!html.includes('href="#invoice-request"') || !html.includes('id="invoice-request"') || !html.includes("Request the $9 invoice link in 30 seconds") || !html.includes("data-service-invoice-submit") || !html.includes(`data-utm-content="${pagePath}-invoice"`) || !html.includes('type="hidden" name="consent" value="on"') || html.includes("Send $9 fix-plan request</button>")) failures.push(`Upload-error landing page missing one-field direct $9 invoice request path: ${pagePath}`);
  }
}

const docsIndexFile = path.join(root, "docs", "index.html");
if (!fs.existsSync(docsIndexFile)) failures.push("Missing GitHub Pages discovery index.");
else {
  const html = fs.readFileSync(docsIndexFile, "utf8");
  if (!html.includes("Free PDF, image, and QR tools without signup")) failures.push("GitHub Pages discovery page missing heading.");
  if (!html.includes(siteUrl("free-pdf-tools"))) failures.push("GitHub Pages discovery page missing main directory link.");
  if (!html.includes(siteUrl("upload-limit-fixer"))) failures.push("GitHub Pages discovery page missing upload limit fixer link.");
  if (!html.includes("Organic push kit mirror")) failures.push("GitHub Pages discovery page missing organic push kit mirror link.");
  if (!html.includes("https://yanqr213.github.io/printable-tools-lab/organic-push-kit/")) failures.push("GitHub Pages discovery page missing organic push kit mirror URL.");
  if (!html.includes("Upload error cheatsheet mirror")) failures.push("GitHub Pages discovery page missing upload error cheatsheet mirror link.");
  if (!html.includes("https://yanqr213.github.io/printable-tools-lab/upload-error-cheatsheet/")) failures.push("GitHub Pages discovery page missing upload error cheatsheet mirror URL.");
  if (!html.includes("Sponsor call mirror")) failures.push("GitHub Pages discovery page missing sponsor call mirror link.");
  if (!html.includes("https://yanqr213.github.io/printable-tools-lab/sponsor-call/")) failures.push("GitHub Pages discovery page missing sponsor call mirror URL.");
  if (!html.includes("USD 49 starter sponsor review mirror")) failures.push("GitHub Pages discovery page missing starter sponsor review mirror link.");
  if (!html.includes("https://yanqr213.github.io/printable-tools-lab/sponsor-starter-review/")) failures.push("GitHub Pages discovery page missing starter sponsor review mirror URL.");
  if (!html.includes("Sponsor opportunities mirror")) failures.push("GitHub Pages discovery page missing sponsor opportunities mirror link.");
  if (!html.includes("https://yanqr213.github.io/printable-tools-lab/sponsor-opportunities/")) failures.push("GitHub Pages discovery page missing sponsor opportunities mirror URL.");
  if (!html.includes("utm_source=github-pages")) failures.push("GitHub Pages discovery page missing tracked github-pages source links.");
  if (!html.includes(siteUrl("free-invoice-generator-no-signup"))) failures.push("GitHub Pages discovery page missing no-signup invoice landing link.");
  if (html.includes(`https://yanqr213.github.io/printable-tools-lab/${MARKET_TABLE_PRINT_AUDIT.slug}/`)) failures.push("GitHub Pages discovery page should not promote retired market table print audit link.");
  if (html.includes(`https://yanqr213.github.io/printable-tools-lab/${CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug}/`)) failures.push("GitHub Pages discovery page should not promote paid service mirror in the main directory.");
  if (html.includes(`https://yanqr213.github.io/printable-tools-lab/${SERVICE_SALES_PACK.slug}/`)) failures.push("GitHub Pages discovery page should not promote service sales pack in the main directory.");
  if (!html.includes(siteUrl("tools/image-to-pdf"))) failures.push("GitHub Pages discovery page missing image-to-PDF link.");
  if (!html.includes("https://yanqr213.github.io/printable-tools-lab/tools/image-to-pdf/")) failures.push("GitHub Pages discovery page missing tool mirror link.");
  if (!html.includes("rel=\"canonical\" href=\"https://yanqr213.github.io/printable-tools-lab/\"")) failures.push("GitHub Pages discovery page missing canonical.");
}

const docsToolsFile = path.join(root, "docs", "tools.json");
if (!fs.existsSync(docsToolsFile)) failures.push("Missing GitHub Pages discovery tools.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsToolsFile, "utf8"));
  if (!Array.isArray(data.tools) || data.tools.length < tools.length) failures.push("GitHub Pages discovery tools.json missing full tool mirror inventory.");
  if (!Array.isArray(data.landingPages) || data.landingPages.length < 50) failures.push("GitHub Pages discovery tools.json missing high-intent landing pages.");
  if (data.feed !== siteUrl("feed.xml").replace(/\/$/, "")) failures.push("GitHub Pages discovery tools.json missing feed URL.");
  if (!data.githubPagesDirectory || data.githubPagesDirectory !== "https://yanqr213.github.io/printable-tools-lab/") failures.push("GitHub Pages discovery tools.json missing GitHub directory URL.");
  if (!data.tools.some((tool) => tool.url === siteUrl("tools/image-to-pdf") && tool.discoveryUrl === "https://yanqr213.github.io/printable-tools-lab/tools/image-to-pdf/")) failures.push("GitHub Pages discovery tools.json missing tool discovery URL.");
  if (!data.gameSubmissionPack || data.gameSubmissionPack.discoveryUrl !== "https://yanqr213.github.io/printable-tools-lab/html5-game-submission-pack/") failures.push("GitHub Pages discovery tools.json missing HTML5 game submission pack.");
  if (!data.organicPushKit || data.organicPushKit.directory !== "https://yanqr213.github.io/printable-tools-lab/organic-push-kit/") failures.push("GitHub Pages discovery tools.json missing organic push kit mirror.");
  if (!Array.isArray(data.organicPushKit?.tasks) || data.organicPushKit.tasks.length !== ORGANIC_PUSH_TASKS.length) failures.push("GitHub Pages discovery tools.json missing organic push kit tasks.");
  if (!data.organicPushKit?.tasks?.some((item) => item.id === "community-pdf-1mb" && String(item.trackedUrl || "").includes("utm_source=github-pages"))) failures.push("GitHub Pages discovery tools.json missing organic push tracked URL.");
  if (!data.uploadErrorCheatsheet || data.uploadErrorCheatsheet.directory !== "https://yanqr213.github.io/printable-tools-lab/upload-error-cheatsheet/") failures.push("GitHub Pages discovery tools.json missing upload error cheatsheet mirror.");
  if (!Array.isArray(data.uploadErrorCheatsheet?.entries) || data.uploadErrorCheatsheet.entries.length !== UPLOAD_ERROR_CHEATSHEET.length) failures.push("GitHub Pages discovery tools.json missing upload error cheatsheet entries.");
  if (!data.uploadErrorCheatsheet?.entries?.some((item) => item.errorText === "Image must be less than 2MB" && String(item.toolUrl || "").includes("targetKb=2048"))) failures.push("GitHub Pages discovery tools.json missing image 2MB upload error target.");
  if (!data.sponsorCall || data.sponsorCall.directory !== "https://yanqr213.github.io/printable-tools-lab/sponsor-call/") failures.push("GitHub Pages discovery tools.json missing sponsor call mirror.");
  if (!Array.isArray(data.sponsorCall?.discoveryLinks) || data.sponsorCall.discoveryLinks.length !== SPONSOR_DISCOVERY_LINKS.length) failures.push("GitHub Pages discovery tools.json missing sponsor discovery links.");
  if (!String(data.sponsorCall?.trackedSponsorCallUrl || "").includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages discovery tools.json missing tracked sponsor-call URL.");
  if (!data.sponsorStarterReview || data.sponsorStarterReview.directory !== "https://yanqr213.github.io/printable-tools-lab/sponsor-starter-review/") failures.push("GitHub Pages discovery tools.json missing starter sponsor review mirror.");
  if (!String(data.sponsorStarterReview?.trackedReviewUrl || "").includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages discovery tools.json missing tracked starter sponsor review URL.");
  if (!data.sponsorOpportunities || data.sponsorOpportunities.directory !== "https://yanqr213.github.io/printable-tools-lab/sponsor-opportunities/") failures.push("GitHub Pages discovery tools.json missing sponsor opportunities mirror.");
  if (!Array.isArray(data.sponsorOpportunities?.opportunities) || data.sponsorOpportunities.opportunities.length < SPONSOR_VERTICALS.length) failures.push("GitHub Pages discovery tools.json missing sponsor opportunities.");
  if (!String(data.sponsorOpportunities?.trackedInquiryUrl || "").includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages discovery tools.json missing tracked sponsor opportunities inquiry URL.");
  if (!data.gameSubmissionPack?.games?.some((game) => game.name === "Neon Lane Dash" && String(game.gameSnacksZipUrl || "").includes("neon-lane-dash-gamesnacks.zip"))) failures.push("GitHub Pages discovery tools.json missing Neon GameSnacks package.");
  if (data.digitalProducts) failures.push("GitHub Pages discovery tools.json should not include retired digitalProducts.");
  if (data.paidServices) failures.push("GitHub Pages discovery tools.json should not include retired paidServices.");
  if (data.leadMagnets) failures.push("GitHub Pages discovery tools.json should not include retired leadMagnets.");
  if (data.serviceSalesPack) failures.push("GitHub Pages discovery tools.json should not include retired serviceSalesPack.");
}

const docsOrganicPushKitFile = path.join(root, "docs", "organic-push-kit", "index.html");
if (!fs.existsSync(docsOrganicPushKitFile)) failures.push("Missing GitHub Pages organic push kit mirror page.");
else {
  const html = fs.readFileSync(docsOrganicPushKitFile, "utf8");
  if (!html.includes("Organic push kit")) failures.push("GitHub Pages organic push kit missing heading.");
  if (!html.includes(siteUrl("organic-push-kit"))) failures.push("GitHub Pages organic push kit missing live page URL.");
  if (!html.includes("Today queue")) failures.push("GitHub Pages organic push kit missing task queue.");
  if (!html.includes("Helpful reply for PDF under 1MB questions")) failures.push("GitHub Pages organic push kit missing PDF task.");
  if (!html.includes("Directory listing for free no-signup file tools")) failures.push("GitHub Pages organic push kit missing directory task.");
  if (!html.includes("Helpful reply for polite invoice follow-up wording")) failures.push("GitHub Pages organic push kit missing invoice follow-up community task.");
  if (!html.includes("Directory listing for invoice follow-up wording resource")) failures.push("GitHub Pages organic push kit missing invoice follow-up directory task.");
  if (!html.includes("utm_source=github-pages")) failures.push("GitHub Pages organic push kit missing tracked links.");
  if (!html.includes("organic-push-kit.json")) failures.push("GitHub Pages organic push kit missing mirror JSON link.");
  requireGithubPagesIntentTracking(html, "GitHub Pages organic push kit mirror");
}

const docsOrganicPushKitJsonFile = path.join(root, "docs", "organic-push-kit.json");
if (!fs.existsSync(docsOrganicPushKitJsonFile)) failures.push("Missing GitHub Pages organic-push-kit.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsOrganicPushKitJsonFile, "utf8"));
  if (data.directory !== "https://yanqr213.github.io/printable-tools-lab/organic-push-kit/") failures.push("GitHub Pages organic-push-kit.json missing directory URL.");
  if (data.liveJson !== siteUrl("organic-push-kit.json").replace(/\/$/, "")) failures.push("GitHub Pages organic-push-kit.json missing live JSON URL.");
  if (!Array.isArray(data.tasks) || data.tasks.length !== ORGANIC_PUSH_TASKS.length) failures.push("GitHub Pages organic-push-kit.json missing tasks.");
  if (!data.tasks?.some((item) => item.id === "community-pdf-1mb" && String(item.trackedUrl || "").includes("utm_source=github-pages"))) failures.push("GitHub Pages organic-push-kit.json missing tracked GitHub Pages URL.");
  if (!data.tasks?.some((item) => item.id === "community-invoice-followup-copy" && String(item.trackedUrl || "").includes("utm_campaign=invoice_followup_service"))) failures.push("GitHub Pages organic-push-kit.json missing invoice follow-up community task.");
  if (!data.tasks?.some((item) => item.id === "directory-invoice-followup-resource" && String(item.copy || "").includes("USD 19 Invoice Follow-up Copy Pack"))) failures.push("GitHub Pages organic-push-kit.json missing invoice follow-up directory copy.");
  if (!String(data.successGate || "").includes("live metrics")) failures.push("GitHub Pages organic-push-kit.json missing live metrics success gate.");
}

const docsUploadErrorCheatsheetFile = path.join(root, "docs", "upload-error-cheatsheet", "index.html");
if (!fs.existsSync(docsUploadErrorCheatsheetFile)) failures.push("Missing GitHub Pages upload error cheatsheet mirror page.");
else {
  const html = fs.readFileSync(docsUploadErrorCheatsheetFile, "utf8");
  if (!html.includes("Upload error cheatsheet")) failures.push("GitHub Pages upload error cheatsheet missing heading.");
  if (!html.includes(siteUrl("upload-error-cheatsheet"))) failures.push("GitHub Pages upload error cheatsheet missing live page URL.");
  if (!html.includes("PDF must be under 1MB")) failures.push("GitHub Pages upload error cheatsheet missing PDF 1MB row.");
  if (!html.includes("Image must be less than 2MB")) failures.push("GitHub Pages upload error cheatsheet missing image 2MB row.");
  if (!html.includes("Email attachment too large")) failures.push("GitHub Pages upload error cheatsheet missing email attachment row.");
  if (!html.includes("utm_source=github-pages")) failures.push("GitHub Pages upload error cheatsheet missing tracked links.");
  if (!html.includes("upload-error-cheatsheet.json")) failures.push("GitHub Pages upload error cheatsheet missing mirror JSON link.");
  requireGithubPagesIntentTracking(html, "GitHub Pages upload error cheatsheet mirror");
}

const docsUploadErrorCheatsheetJsonFile = path.join(root, "docs", "upload-error-cheatsheet.json");
if (!fs.existsSync(docsUploadErrorCheatsheetJsonFile)) failures.push("Missing GitHub Pages upload-error-cheatsheet.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsUploadErrorCheatsheetJsonFile, "utf8"));
  if (data.directory !== "https://yanqr213.github.io/printable-tools-lab/upload-error-cheatsheet/") failures.push("GitHub Pages upload-error-cheatsheet.json missing directory URL.");
  if (data.liveJson !== siteUrl("upload-error-cheatsheet.json").replace(/\/$/, "")) failures.push("GitHub Pages upload-error-cheatsheet.json missing live JSON URL.");
  if (!Array.isArray(data.entries) || data.entries.length !== UPLOAD_ERROR_CHEATSHEET.length) failures.push("GitHub Pages upload-error-cheatsheet.json missing entries.");
  if (!data.entries?.some((item) => item.errorText === "Resume PDF too large" && String(item.toolUrl || "").includes("targetSize=1mb"))) failures.push("GitHub Pages upload-error-cheatsheet.json missing resume target.");
  if (!data.entries?.some((item) => item.errorText === "Image must be less than 2MB" && String(item.trackedUrl || "").includes("utm_source=github-pages"))) failures.push("GitHub Pages upload-error-cheatsheet.json missing tracked GitHub Pages URL.");
}

const docsSponsorCallFile = path.join(root, "docs", "sponsor-call", "index.html");
if (!fs.existsSync(docsSponsorCallFile)) failures.push("Missing GitHub Pages sponsor call mirror page.");
else {
  const html = fs.readFileSync(docsSponsorCallFile, "utf8");
  if (!html.includes("Sponsor call")) failures.push("GitHub Pages sponsor call missing heading.");
  if (!html.includes(siteUrl("sponsor-call"))) failures.push("GitHub Pages sponsor call missing live page URL.");
  if (!html.includes("Current sponsor openings")) failures.push("GitHub Pages sponsor call missing openings section.");
  if (!html.includes("Sponsor discovery links")) failures.push("GitHub Pages sponsor call missing discovery link section.");
  if (!html.includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages sponsor call missing sponsor outreach tracking.");
  if (!html.includes("sponsor-call.json")) failures.push("GitHub Pages sponsor call missing mirror JSON link.");
  requireGithubPagesIntentTracking(html, "GitHub Pages sponsor call mirror");
}

const docsSponsorStarterReviewFile = path.join(root, "docs", "sponsor-starter-review", "index.html");
if (!fs.existsSync(docsSponsorStarterReviewFile)) failures.push("Missing GitHub Pages starter sponsor review mirror page.");
else {
  const html = fs.readFileSync(docsSponsorStarterReviewFile, "utf8");
  if (!html.includes("USD 49 starter sponsor review")) failures.push("GitHub Pages starter sponsor review missing heading.");
  if (!html.includes(siteUrl("sponsor-starter-review"))) failures.push("GitHub Pages starter sponsor review missing live page URL.");
  if (!html.includes("What the starter review covers")) failures.push("GitHub Pages starter sponsor review missing review scope.");
  if (!html.includes("sponsor-starter-review.json")) failures.push("GitHub Pages starter sponsor review missing mirror JSON link.");
  if (!html.includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages starter sponsor review missing sponsor outreach tracking.");
  requireGithubPagesIntentTracking(html, "GitHub Pages starter sponsor review mirror");
}

const docsSponsorDealRoomFile = path.join(root, "docs", "sponsor-deal-room", "index.html");
if (!fs.existsSync(docsSponsorDealRoomFile)) failures.push("Missing GitHub Pages sponsor deal room mirror page.");
else {
  const html = fs.readFileSync(docsSponsorDealRoomFile, "utf8");
  if (!html.includes("Sponsor deal room")) failures.push("GitHub Pages sponsor deal room missing heading.");
  if (!html.includes(siteUrl("sponsor-deal-room"))) failures.push("GitHub Pages sponsor deal room missing live page URL.");
  if (!html.includes("Available pilot deals")) failures.push("GitHub Pages sponsor deal room missing pilot deals.");
  if (!html.includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages sponsor deal room missing sponsor outreach tracking.");
  if (!html.includes("sponsor-deal-room.json")) failures.push("GitHub Pages sponsor deal room missing mirror JSON link.");
  requireGithubPagesIntentTracking(html, "GitHub Pages sponsor deal room mirror");
}

const docsSponsorDealRoomJsonFile = path.join(root, "docs", "sponsor-deal-room.json");
if (!fs.existsSync(docsSponsorDealRoomJsonFile)) failures.push("Missing GitHub Pages sponsor-deal-room.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsSponsorDealRoomJsonFile, "utf8"));
  if (data.directory !== "https://yanqr213.github.io/printable-tools-lab/sponsor-deal-room/") failures.push("GitHub Pages sponsor-deal-room.json missing directory URL.");
  if (data.liveJson !== siteUrl("sponsor-deal-room.json").replace(/\/$/, "")) failures.push("GitHub Pages sponsor-deal-room.json missing live JSON URL.");
  if (!Array.isArray(data.deals) || data.deals.length !== SPONSOR_DEALS.length) failures.push("GitHub Pages sponsor-deal-room.json missing deals.");
  if (!String(data.trackedInquiryUrl || "").includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages sponsor-deal-room.json missing tracked inquiry URL.");
  if (!String(data.moneyGate || "").includes("settled external payment")) failures.push("GitHub Pages sponsor-deal-room.json missing money gate.");
}

const docsSponsorStarterReviewJsonFile = path.join(root, "docs", "sponsor-starter-review.json");
if (!fs.existsSync(docsSponsorStarterReviewJsonFile)) failures.push("Missing GitHub Pages sponsor-starter-review.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsSponsorStarterReviewJsonFile, "utf8"));
  if (data.directory !== "https://yanqr213.github.io/printable-tools-lab/sponsor-starter-review/") failures.push("GitHub Pages sponsor-starter-review.json missing directory URL.");
  if (data.livePage !== siteUrl("sponsor-starter-review")) failures.push("GitHub Pages sponsor-starter-review.json missing live page URL.");
  if (!String(data.trackedReviewUrl || "").includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages sponsor-starter-review.json missing tracked review URL.");
  if (data.deal?.id !== "starter-fit-review" || data.deal?.price !== "USD 49") failures.push("GitHub Pages sponsor-starter-review.json missing USD 49 starter deal.");
  if (!String(data.successGate || "").includes("settled external payment")) failures.push("GitHub Pages sponsor-starter-review.json missing money gate.");
}

const docsSponsorCallJsonFile = path.join(root, "docs", "sponsor-call.json");
if (!fs.existsSync(docsSponsorCallJsonFile)) failures.push("Missing GitHub Pages sponsor-call.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsSponsorCallJsonFile, "utf8"));
  if (data.directory !== "https://yanqr213.github.io/printable-tools-lab/sponsor-call/") failures.push("GitHub Pages sponsor-call.json missing directory URL.");
  if (data.liveJson !== siteUrl("sponsor-call.json").replace(/\/$/, "")) failures.push("GitHub Pages sponsor-call.json missing live JSON URL.");
  if (!Array.isArray(data.discoveryLinks) || data.discoveryLinks.length !== SPONSOR_DISCOVERY_LINKS.length) failures.push("GitHub Pages sponsor-call.json missing discovery links.");
  if (!String(data.publicInvoiceRequest || "").includes("commitment%3Drequest-invoice") || !String(data.publicInvoiceRequest || "").includes("body=Public-safe+sponsor+reply")) failures.push("GitHub Pages sponsor-call.json missing public invoice request URL.");
  if (!Array.isArray(data.verticalPages) || data.verticalPages.length !== SPONSOR_VERTICALS.length) failures.push("GitHub Pages sponsor-call.json missing vertical pages.");
  if (!String(data.trackedSponsorCallUrl || "").includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages sponsor-call.json missing tracked sponsor-call URL.");
  if (!String(data.successGate || "").includes("qualified sponsor")) failures.push("GitHub Pages sponsor-call.json missing sponsor success gate.");
}

const docsSponsorOpportunitiesFile = path.join(root, "docs", "sponsor-opportunities", "index.html");
if (!fs.existsSync(docsSponsorOpportunitiesFile)) failures.push("Missing GitHub Pages sponsor opportunities mirror page.");
else {
  const html = fs.readFileSync(docsSponsorOpportunitiesFile, "utf8");
  if (!html.includes("Sponsor opportunities")) failures.push("GitHub Pages sponsor opportunities missing heading.");
  if (!html.includes(siteUrl("sponsor-opportunities"))) failures.push("GitHub Pages sponsor opportunities missing live page URL.");
  if (!html.includes("Open sponsor audiences")) failures.push("GitHub Pages sponsor opportunities missing audience table.");
  if (!html.includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages sponsor opportunities missing sponsor outreach tracking.");
  if (!html.includes("sponsor-opportunities.json")) failures.push("GitHub Pages sponsor opportunities missing mirror JSON link.");
  requireGithubPagesIntentTracking(html, "GitHub Pages sponsor opportunities mirror");
}

const docsSponsorOpportunitiesJsonFile = path.join(root, "docs", "sponsor-opportunities.json");
if (!fs.existsSync(docsSponsorOpportunitiesJsonFile)) failures.push("Missing GitHub Pages sponsor-opportunities.json.");
else {
  const data = JSON.parse(fs.readFileSync(docsSponsorOpportunitiesJsonFile, "utf8"));
  if (data.directory !== "https://yanqr213.github.io/printable-tools-lab/sponsor-opportunities/") failures.push("GitHub Pages sponsor-opportunities.json missing directory URL.");
  if (data.liveJson !== siteUrl("sponsor-opportunities.json").replace(/\/$/, "")) failures.push("GitHub Pages sponsor-opportunities.json missing live JSON URL.");
  if (!Array.isArray(data.opportunities) || data.opportunities.length < SPONSOR_VERTICALS.length) failures.push("GitHub Pages sponsor-opportunities.json missing opportunities.");
  if (!String(data.trackedInquiryUrl || "").includes("utm_source=sponsor-outreach")) failures.push("GitHub Pages sponsor-opportunities.json missing tracked inquiry URL.");
  if (!String(data.successGate || "").includes("qualified sponsor")) failures.push("GitHub Pages sponsor-opportunities.json missing success gate.");
}

const docsProductsFile = path.join(root, "docs", "products.json");
if (!fs.existsSync(docsProductsFile)) failures.push("Missing GitHub Pages products.json.");
for (const productPath of [
  `docs/${LOCAL_SELLER_STARTER_KIT.slug}/index.html`,
  `docs/${LOCAL_SELLER_STARTER_KIT.publicSamplePath}`,
  `docs/${LOCAL_SELLER_STARTER_KIT.publicRequestPath}`,
  `docs/${LOCAL_SELLER_STARTER_KIT.packageReportPath}`,
]) {
  if (!fs.existsSync(path.join(root, ...productPath.split("/")))) failures.push(`Missing GitHub Pages seller-kit artifact: ${productPath}`);
}

const docsServicesFile = path.join(root, "docs", "services.json");
if (!fs.existsSync(docsServicesFile)) failures.push("Missing GitHub Pages services.json.");
for (const service of [CUSTOM_LOCAL_PRINT_PACK_SERVICE, UPLOAD_LIMIT_FIX_PLAN_SERVICE]) {
  for (const servicePath of [
    `docs/${service.slug}/index.html`,
    `docs/${service.publicRequestPath}`,
    `docs/${service.publicPaymentReplyPath}`,
    `docs/${service.publicFulfillmentChecklistPath}`,
    `docs/${service.publicOrderPipelinePath}`,
    `docs/${service.publicOutreachQueuePath}`,
    `docs/${service.publicOutreachBatchPath}`,
    `docs/${service.publicSampleDeliveryPath}`,
    `docs/${service.publicDeliveryInputExamplePath}`,
    `docs/${service.publicDeliveryReportPath}`,
  ]) {
    if (!fs.existsSync(path.join(root, ...servicePath.split("/")))) failures.push(`Missing GitHub Pages service artifact: ${servicePath}`);
  }
}

const docsAuditLeadMagnetFile = path.join(root, "docs", MARKET_TABLE_PRINT_AUDIT.slug, "index.html");
if (!fs.existsSync(docsAuditLeadMagnetFile)) failures.push("Missing GitHub Pages market table print audit mirror.");
for (const auditPath of [
  `docs/${MARKET_TABLE_PRINT_AUDIT.publicRequestPath}`,
  `docs/${MARKET_TABLE_PRINT_AUDIT.publicChecklistPath}`,
]) {
  if (!fs.existsSync(path.join(root, ...auditPath.split("/")))) failures.push(`Missing GitHub Pages audit artifact: ${auditPath}`);
}

const docsServiceSalesPackJsonFile = path.join(root, "docs", "service-sales-pack.json");
if (!fs.existsSync(docsServiceSalesPackJsonFile)) failures.push("Missing GitHub Pages service-sales-pack.json.");
const docsServiceSalesPackFile = path.join(root, "docs", SERVICE_SALES_PACK.slug, "index.html");
if (!fs.existsSync(docsServiceSalesPackFile)) failures.push("Missing GitHub Pages service sales pack mirror.");

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
  if (countMatches(docsSitemap, /<loc>/g) < landingPages.length + tools.length + guides.length + 1) failures.push("GitHub Pages discovery sitemap missing landing/tool/guide pages.");
  for (const page of landingPages) {
    const githubUrl = `https://yanqr213.github.io/printable-tools-lab/${page.path}/`;
    if (!docsSitemap.includes(`<loc>${githubUrl}</loc>`)) failures.push(`GitHub Pages sitemap missing landing page: ${page.path}`);
  }
  for (const toolPath of tools.map((tool) => tool.path)) {
    const githubUrl = `https://yanqr213.github.io/printable-tools-lab/${toolPath}/`;
    if (!docsSitemap.includes(`<loc>${githubUrl}</loc>`)) failures.push(`GitHub Pages sitemap missing tool discovery page: ${toolPath}`);
  }
  for (const guidePath of guides.map((guide) => guide.path)) {
    const githubUrl = `https://yanqr213.github.io/printable-tools-lab/${guidePath}/`;
    if (!docsSitemap.includes(`<loc>${githubUrl}</loc>`)) failures.push(`GitHub Pages sitemap missing guide discovery page: ${guidePath}`);
  }
  if (!docsSitemap.includes("<loc>https://yanqr213.github.io/printable-tools-lab/upload-error-cheatsheet/</loc>")) failures.push("GitHub Pages sitemap missing upload error cheatsheet mirror page.");
  if (!docsSitemap.includes("<loc>https://yanqr213.github.io/printable-tools-lab/organic-push-kit/</loc>")) failures.push("GitHub Pages sitemap missing organic push kit mirror page.");
  if (!docsSitemap.includes(`<loc>https://yanqr213.github.io/printable-tools-lab/${CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug}/</loc>`)) failures.push("GitHub Pages sitemap should include restored service route.");
  if (!docsSitemap.includes(`<loc>https://yanqr213.github.io/printable-tools-lab/${MARKET_TABLE_PRINT_AUDIT.slug}/</loc>`)) failures.push("GitHub Pages sitemap should include restored audit route.");
  if (docsSitemap.includes(`<loc>https://yanqr213.github.io/printable-tools-lab/${SERVICE_SALES_PACK.slug}/</loc>`)) failures.push("GitHub Pages sitemap should not include noindex service sales pack route.");
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

for (const toolPath of tools.map((tool) => tool.path)) {
  const tool = tools.find((item) => item.path === toolPath);
  const file = path.join(root, "docs", ...toolPath.split("/"), "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing GitHub Pages tool discovery page: ${toolPath}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!tool || !html.includes(tool.title)) failures.push(`GitHub Pages tool page missing title: ${toolPath}`);
  if (!html.includes(siteUrl(toolPath))) failures.push(`GitHub Pages tool page missing live tool URL: ${toolPath}`);
  if (!html.includes('data-track-event="free_tool_depth"')) failures.push(`GitHub Pages tool page missing free_tool_depth tracking: ${toolPath}`);
  if (tool && !html.includes(`data-track-tool="${toolTrackingId(tool)}"`)) failures.push(`GitHub Pages tool page missing tool id tracking: ${toolPath}`);
  if (!html.includes(`rel="canonical" href="https://yanqr213.github.io/printable-tools-lab/${toolPath}/"`)) failures.push(`GitHub Pages tool page missing canonical: ${toolPath}`);
}

for (const guide of guides) {
  const file = path.join(root, "docs", ...guide.path.split("/"), "index.html");
  if (!fs.existsSync(file)) {
    failures.push(`Missing GitHub Pages guide discovery page: ${guide.path}`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes(guide.title)) failures.push(`GitHub Pages guide page missing title: ${guide.path}`);
  if (!html.includes(siteUrl(guide.path))) failures.push(`GitHub Pages guide page missing live guide URL: ${guide.path}`);
  if (!html.includes('data-track-event="guide_depth"')) failures.push(`GitHub Pages guide page missing guide_depth tracking: ${guide.path}`);
  if (!html.includes('data-track-tool="site"')) failures.push(`GitHub Pages guide page missing site tracking tool: ${guide.path}`);
  if (!html.includes(`rel="canonical" href="https://yanqr213.github.io/printable-tools-lab/${guide.path}/"`)) failures.push(`GitHub Pages guide page missing canonical: ${guide.path}`);
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

function readJsonFile(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function cleanToolPath(toolPath) {
  return String(toolPath).split("?")[0];
}

function toolTrackingId(tool) {
  return tool.id || cleanToolPath(tool.path).split("/").filter(Boolean).pop() || "tool";
}

function liveToolUrl(toolPath) {
  const [pathname, query] = String(toolPath).split("?");
  return `${siteUrl(pathname)}${query ? `?${query}` : ""}`;
}

function sitemapIncludes(filePath, url) {
  if (!fs.existsSync(filePath)) return false;
  return fs.readFileSync(filePath, "utf8").includes(`<loc>${url}</loc>`);
}
