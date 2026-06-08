const fs = require("fs");
const path = require("path");
const { routes, siteUrl, landingPages, LOCAL_SELLER_STARTER_KIT, CUSTOM_LOCAL_PRINT_PACK_SERVICE, INVOICE_FOLLOWUP_COPY_PACK_SERVICE, UPLOAD_LIMIT_FIX_PLAN_SERVICE, MARKET_TABLE_PRINT_AUDIT, SERVICE_SALES_PACK, HIGH_INTENT_TOOL_PATHS, ORGANIC_PUSH_TASKS, UPLOAD_ERROR_CHEATSHEET, SPONSOR_DISCOVERY_LINKS, SPONSOR_VERTICALS, SPONSOR_DEALS, tools, guides } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const failures = [];
const GITHUB_PAGES_EVENT_ENDPOINT = "https://printable-tools-lab.pages.dev/api/event";
const UPLOAD_LIMIT_SHORTCUT_PATHS = [
  "/pdf-size-reducer/",
  "/image-size-reducer-in-kb/",
  "/compress-pdf-to-1mb/",
  "/compress-pdf-to-500kb/",
  "/compress-image-to-100kb/",
  "/compress-jpg-to-100kb/",
  "/compress-png-to-100kb/",
  "/passport-photo-size-fixer/",
];
const UPLOAD_LIMIT_DECISION_LINKS = [
  ["/tools/compress-pdf/?targetSize=1mb", "compress-pdf"],
  ["/tools/compress-pdf/?targetSize=500kb", "compress-pdf"],
  ["/tools/compress-image-to-kb/?targetKb=100", "compress-image-to-kb"],
  ["/tools/convert-image/", "convert-image"],
  ["/tools/resize-image/", "resize-image"],
  ["/tools/pdf-to-images/", "pdf-to-images"],
  ["/tools/image-to-pdf/", "image-to-pdf"],
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
  if (!html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes("Send $9 fix-plan request") || !html.includes("/upload-limit-fix-plan/?utm_source=upload-limit") || !html.includes("No file upload")) failures.push(`${label} missing $9 upload fix plan service request path.`);
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

const homeFile = path.join(root, "index.html");
if (!fs.existsSync(homeFile)) failures.push("Missing homepage.");
else {
  const html = fs.readFileSync(homeFile, "utf8");
  requireUploadLimitShortcuts(html, "Homepage");
  if (!html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes("Send $9 fix-plan request") || !html.includes("/upload-limit-fix-plan/?utm_source=upload-limit")) failures.push("Homepage upload-limit shortcuts missing $9 upload fix plan request form.");
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
  if (!html.includes('content="noindex,follow"')) failures.push(`${routePath} should be noindex.`);
  if (sitemap.includes(`<loc>${siteUrl(routePath)}</loc>`)) failures.push(`Sitemap should not include noindex internal route: ${routePath}.`);
  if (routePath === "ops" && (!html.includes("/sponsor-starter-review/?utm_source=ops") || !html.includes("Open invoice review form"))) failures.push("Ops monitor should route sponsor close work to the invoice review form.");
  if (routePath === "ops" && (!html.includes("/api/ops-metrics") || !html.includes("Project detail rows") || !html.includes("Source breakdown") || !html.includes("Tool and game signal snapshot") || !html.includes("Path breakdown") || !html.includes("/polite-payment-reminder-email/") || !html.includes("/freelance-invoice-follow-up-email/"))) failures.push("Ops monitor should render detailed project traffic sections and high-intent path funnel access.");
  if (routePath === "ops" && (!html.includes("Public-safe sponsor reply evidence") || !html.includes("public invoice issues"))) failures.push("Ops monitor should surface public-safe sponsor reply evidence.");
  if (routePath === "ops" && (!html.includes("Next sponsor submissions") || !html.includes("Open email draft") || !html.includes("Copy message"))) failures.push("Ops monitor should expose an internal next sponsor submission queue.");
  if (routePath === "ops" && (!html.includes("External payment link readiness") || !html.includes("Copy config command") || !html.includes("sellerKitCheckoutUrl") || !html.includes("customPrintPackCheckoutUrl") || !html.includes("invoiceFollowupCheckoutUrl") || !html.includes("uploadLimitFixPlanCheckoutUrl"))) failures.push("Ops monitor should expose internal per-SKU checkout activation readiness.");
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
  if (!script.includes("renderInvoiceFollowupOutputServiceLeadForm") || !script.includes("tool-output-service-lead-form") || !script.includes('data-utm-source="tool_output"') || !script.includes("Generated draft excerpt to refine") || !script.includes('name="requestSummary" value=')) failures.push("Invoice follow-up email output missing inline one-field service lead form.");
  if (!script.includes("overdue-invoice-reminder-email") || !script.includes("invoiceStatus=overdue") || !script.includes("Send overdue invoice fit check")) failures.push("app.js missing high-intent overdue invoice reminder landing route.");
  if (!script.includes("polite-payment-reminder-email") || !script.includes("Send polite reminder fit check") || !script.includes("freelance-invoice-follow-up-email") || !script.includes("Send freelance invoice fit check")) failures.push("app.js missing high-intent polite/freelance invoice reminder landing routes.");
  if (!script.includes('tool.id === "invoice-followup-email"') || !script.includes('values.invoiceStatus = invoiceStatus') || !script.includes("const initialValues = initialToolValues(tool)") || !script.includes("renderField(field, initialValues[field.id])")) failures.push("app.js should prefill invoice follow-up generator from URL params.");
  if (!script.includes('data-utm-source="download_success"') || !script.includes("form.dataset.leadPath") || !script.includes("fieldOrDataOrParam")) failures.push("Download success service lead form missing attribution preservation.");
  if (!script.includes("Future ads must stay separated from generator controls")) failures.push("Missing download success ad-safety warning.");
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
  if (!script.includes("loadServicePublicRequests") || !script.includes("Public-safe service request evidence") || !script.includes("/api/service-public-requests")) failures.push("app.js ops monitor should independently check public-safe service request issue evidence.");
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
}
if (!fs.existsSync(metricsFunctionFile)) failures.push("Missing metrics API function.");
else {
  const metricsFunction = fs.readFileSync(metricsFunctionFile, "utf8");
  if (!metricsFunction.includes("service_checkout_click")) failures.push("Metrics API missing direct service checkout click totals.");
  if (!metricsFunction.includes('"sponsor-outreach"')) failures.push("Metrics API missing sponsor-outreach source row.");
}
const opsMetricsFunctionFile = path.join(root, "functions", "api", "ops-metrics.js");
if (!fs.existsSync(opsMetricsFunctionFile)) failures.push("Missing ops metrics API function.");
else {
  const opsMetricsScript = fs.readFileSync(opsMetricsFunctionFile, "utf8");
  if (!opsMetricsScript.includes("nextActions") || !opsMetricsScript.includes("pathRows") || !opsMetricsScript.includes("countPathEvent") || !opsMetricsScript.includes("/polite-payment-reminder-email/") || !opsMetricsScript.includes("row[`today_${event}`]") || !opsMetricsScript.includes("projectNextAction")) failures.push("Ops metrics API should expose project next actions and today source/tool/path fields.");
}
const directoryMonitorFile = path.join(root, "scripts", "directory-monitor.cjs");
if (!fs.existsSync(directoryMonitorFile)) failures.push("Missing directory monitor script.");
else {
  const directoryMonitorScript = fs.readFileSync(directoryMonitorFile, "utf8");
  if (!directoryMonitorScript.includes("NoSignupTools overdue invoice reminder listing") || !directoryMonitorScript.includes("Overdue+Invoice+Reminder+Email")) failures.push("Directory monitor missing NoSignupTools overdue invoice reminder submission tracking.");
  if (!directoryMonitorScript.includes("NoSignupTools upload limit fixer listing") || !directoryMonitorScript.includes("Upload+Limit+Fixer")) failures.push("Directory monitor missing NoSignupTools upload limit fixer submission tracking.");
  if (!directoryMonitorScript.includes("FreeNoSignup overdue invoice reminder listing") || !directoryMonitorScript.includes("Overdue+Invoice+Reminder+Email")) failures.push("Directory monitor missing FreeNoSignup overdue invoice reminder submission tracking.");
  if (!directoryMonitorScript.includes("FreeNoSignup upload limit fixer listing") || !directoryMonitorScript.includes("Upload+Limit+Fixer")) failures.push("Directory monitor missing FreeNoSignup upload limit fixer submission tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad upload limit fix plan service listing") || !directoryMonitorScript.includes("Upload Limit Fix Plan")) failures.push("Directory monitor missing TechTools upload limit fix plan service listing tracking.");
  if (!directoryMonitorScript.includes("TechTools Launchpad upload error cheatsheet listing") || !directoryMonitorScript.includes("Upload Error Cheatsheet")) failures.push("Directory monitor missing TechTools upload error cheatsheet listing tracking.");
  if (!directoryMonitorScript.includes("NoLogin.tools upload error cheatsheet listing") || !directoryMonitorScript.includes("Upload+Error+Cheatsheet")) failures.push("Directory monitor missing NoLogin upload error cheatsheet submission tracking.");
  if (!directoryMonitorScript.includes("expected.every")) failures.push("Directory monitor should require all expected listing markers to avoid search-query echo false positives.");
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
  if (!sitemap.includes(`<loc>${siteUrl(pagePath)}</loc>`)) failures.push(`Sitemap missing format target-KB page: ${pagePath}`);
}

const imageKbHubFile = path.join(root, "image-size-reducer-in-kb", "index.html");
if (!fs.existsSync(imageKbHubFile)) failures.push("Missing image size reducer in KB hub page.");
else {
  const html = fs.readFileSync(imageKbHubFile, "utf8");
  if (!html.includes("Image size reducer in KB without uploading")) failures.push("Image KB hub page missing headline.");
  if (!html.includes("/tools/compress-image-to-kb/")) failures.push("Image KB hub page missing image-to-KB tool link.");
  for (const pagePath of ["compress-image-to-10kb", "compress-image-to-20kb", "compress-image-to-30kb", "compress-image-to-50kb", "compress-image-to-100kb", "compress-image-to-150kb", "compress-image-to-200kb", "compress-image-to-300kb", "compress-image-to-500kb", "compress-jpg-to-50kb", "compress-jpg-to-100kb", "compress-jpg-to-200kb", "compress-png-to-50kb", "compress-png-to-100kb", "compress-png-to-200kb", "passport-photo-compress-to-50kb", "passport-photo-compress-to-100kb", "passport-photo-compress-to-200kb"]) {
    if (!html.includes(`/${pagePath}/`)) failures.push(`Image KB hub page missing target link: ${pagePath}`);
  }
  if (!sitemap.includes(`<loc>${siteUrl("image-size-reducer-in-kb")}</loc>`)) failures.push("Sitemap missing image KB hub page.");
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

const pdfSizeHubFile = path.join(root, "pdf-size-reducer", "index.html");
if (!fs.existsSync(pdfSizeHubFile)) failures.push("Missing PDF size reducer hub page.");
else {
  const html = fs.readFileSync(pdfSizeHubFile, "utf8");
  if (!html.includes("PDF size reducer without uploading")) failures.push("PDF size hub page missing headline.");
  if (!html.includes("/tools/compress-pdf/")) failures.push("PDF size hub page missing PDF compressor link.");
  for (const pagePath of ["compress-pdf-to-500kb", "compress-pdf-to-1mb", "compress-pdf-to-2mb", "compress-pdf-to-5mb"]) {
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
  if (!html.includes("NoLogin.tools Upload Error Cheatsheet") || !html.includes("https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-error-cheatsheet")) failures.push("Directory submission pack missing NoLogin upload error cheatsheet submission.");
  if (!html.includes("NoSignupTools Upload Limit Fixer") || !html.includes("https://nosignuptools.com/tools/upload-limit-fixer-by-printabletools-lab")) failures.push("Directory submission pack missing NoSignupTools upload limit fixer submission.");
  if (!html.includes("FreeNoSignup Upload Limit Fixer") || !html.includes("https://freenosignup.com/?s=Upload+Limit+Fixer")) failures.push("Directory submission pack missing FreeNoSignup upload limit fixer submission.");
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
  if (!html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes("upload_error_cheatsheet_fix_plan") || !html.includes("Send $9 fix-plan request")) failures.push("Upload error cheatsheet missing tracked upload fix-plan lead form.");
  if (!html.includes("/upload-error-cheatsheet.json")) failures.push("Upload error cheatsheet missing JSON link.");
  if (!sitemap.includes(`<loc>${siteUrl("upload-error-cheatsheet")}</loc>`)) failures.push("Sitemap missing upload error cheatsheet.");
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
  if (!html.includes("Send the shortest $9 fix-plan request") || !html.includes("upload-limit-fix-plan-micro-lead-form") || !html.includes("Send $9 fix-plan request")) failures.push("Upload limit fix plan route missing shortest paid request form.");
  if (!html.includes("data-upload-fix-plan-form") || !html.includes("data-upload-fix-plan-summary")) failures.push("Upload limit fix plan route missing upload fix paid-request prefill markers.");
  if (!html.includes("Open public-safe request") || !html.includes('data-service-lead-fallback-link')) failures.push("Upload limit fix plan route missing public-safe request CTA.");
  if (!html.includes('data-service-lead-form') || !html.includes('data-service-type="upload-limit-fix-plan"') || !html.includes("Send upload fix fit check")) failures.push("Upload limit fix plan route missing service lead form.");
  if (!html.includes("Upload error text") || !html.includes("File type and target rule") || !html.includes("Blocked file type")) failures.push("Upload limit fix plan route request builder should use upload-specific fields.");
  if (!html.includes("No file upload") || !html.includes("Do not include or attach the actual file") || (!html.includes("cannot guarantee") && !html.includes("does not guarantee"))) failures.push("Upload limit fix plan route missing no-file safety boundary.");
  if (!html.includes("Request+note%3A") || !html.includes("I+need+a+%249+Upload+Limit+Fix+Plan") || !html.includes("service-request%2Cbusiness-review")) failures.push("Upload limit fix plan route missing complete public-safe service request issue fallback.");
  if (!sitemap.includes(`<loc>${siteUrl(UPLOAD_LIMIT_FIX_PLAN_SERVICE.slug)}</loc>`)) failures.push("Sitemap should include upload limit fix plan service route.");
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
  if (!distribution.includes("NoLogin.tools Upload Error Cheatsheet listing") || !distribution.includes("upload_error_cheatsheet_2026_06")) failures.push("DISTRIBUTION.md missing NoLogin upload error cheatsheet submission.");
  if (!distribution.includes("NoSignupTools Upload Limit Fixer listing") || !distribution.includes("upload_limit_2026_06")) failures.push("DISTRIBUTION.md missing NoSignupTools upload limit fixer submission.");
  if (!distribution.includes("FreeNoSignup Upload Limit Fixer listing") || !distribution.includes("utm_source=freenosignup")) failures.push("DISTRIBUTION.md missing FreeNoSignup upload limit fixer submission.");
  if (!distribution.includes("NoSignupTools Overdue Invoice Reminder listing") || !distribution.includes("utm_source=nosignuptools")) failures.push("DISTRIBUTION.md missing NoSignupTools overdue invoice reminder submission.");
  if (!distribution.includes("FreeNoSignup Overdue Invoice Reminder listing") || !distribution.includes("utm_source=freenosignup")) failures.push("DISTRIBUTION.md missing FreeNoSignup overdue invoice reminder submission.");
  if (!distribution.includes("NoLogin.tools Overdue Invoice Reminder listing") || !distribution.includes("utm_source=nologin")) failures.push("DISTRIBUTION.md missing NoLogin overdue invoice reminder submission.");
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
  ["file-must-be-less-than-1mb", "Fix file must be less than 1 MB", "/tools/compress-pdf/?targetSize=1mb"],
  ["pdf-must-be-under-500kb", "Fix PDF must be under 500KB", "/tools/compress-pdf/?targetSize=500kb"],
  ["photo-must-be-under-100kb", "Fix photo must be under 100KB", "/tools/compress-image-to-kb/?targetKb=100"],
  ["invalid-file-type-jpg-png", "Fix invalid file type: upload JPG or PNG", "/tools/convert-image/"],
  ["image-dimensions-600x600", "Fix image dimensions must be 600 x 600", "/tools/resize-image/?width=600&height=600&fit=cover"],
  ["pdf-not-accepted-jpg-required", "Fix PDF not accepted, JPG required", "/tools/pdf-to-images/"],
  ["image-must-be-less-than-2mb", "Fix image must be less than 2 MB", "/tools/compress-image-to-kb/?targetKb=2048"],
  ["image-must-be-under-500kb", "Fix image must be under 500KB", "/tools/compress-image-to-kb/?targetKb=500"],
  ["jpg-must-be-under-200kb", "Fix JPG must be under 200KB", "/tools/compress-image-to-kb/?targetKb=200"],
  ["png-screenshot-too-large", "Fix PNG screenshot too large", "/tools/compress-image-to-kb/?targetKb=500"],
  ["resume-pdf-too-large", "Fix resume PDF too large", "/tools/compress-pdf/?targetSize=1mb"],
  ["email-attachment-too-large", "Fix email attachment too large", "/tools/compress-pdf/?targetSize=5mb"],
  ["passport-photo-compress-to-50kb", "Compress a passport photo to 50KB", "/tools/compress-image-to-kb/?targetKb=50"],
  ["passport-photo-compress-to-100kb", "Compress a passport photo to 100KB", "/tools/compress-image-to-kb/?targetKb=100"],
  ["passport-photo-compress-to-200kb", "Compress a passport photo to 200KB", "/tools/compress-image-to-kb/?targetKb=200"],
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
  if (["file-must-be-less-than-1mb", "pdf-must-be-under-500kb", "photo-must-be-under-100kb", "invalid-file-type-jpg-png", "image-dimensions-600x600", "pdf-not-accepted-jpg-required", "image-must-be-less-than-2mb", "image-must-be-under-500kb", "jpg-must-be-under-200kb", "png-screenshot-too-large", "resume-pdf-too-large", "email-attachment-too-large"].includes(pagePath) && !html.includes("data-upload-limit-helper")) failures.push(`Upload-error landing page missing matcher: ${pagePath}`);
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
