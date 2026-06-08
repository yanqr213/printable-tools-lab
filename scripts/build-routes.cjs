const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { strToU8, zipSync } = require("fflate");
const { routes, renderRoute, siteUrl, tools, guides, landingPages, SITE_SUMMARY, DIGITAL_PRODUCTS, LOCAL_SELLER_STARTER_KIT, CUSTOM_LOCAL_PRINT_PACK_SERVICE, INVOICE_FOLLOWUP_COPY_PACK_SERVICE, UPLOAD_LIMIT_FIX_PLAN_SERVICE, PAID_SERVICES, MARKET_TABLE_PRINT_AUDIT, SERVICE_SALES_PACK, productCheckoutRequestUrl, productCheckoutRequestCopy, productCheckoutEmailUrl, serviceRequestUrl, serviceRequestCopy, serviceRequestEmailUrl, servicePaymentReplyCopy, serviceFulfillmentChecklistCopy, serviceOrderPipeline, serviceOutreachQueue, serviceOutreachBatchCopy, marketTableAuditRequestUrl, marketTableAuditRequestCopy, marketTableAuditChecklist, HIGH_INTENT_TOOL_PATHS, HIGH_INTENT_LANDING_PATHS, SHARE_KIT_FEATURED_LINKS, SHARE_KIT_POSTS, SHARE_KIT_RULES, ORGANIC_PUSH_TASKS, UPLOAD_ERROR_CHEATSHEET, ZERO_DOMAIN_GAME_EXPERIMENT, ZERO_DOMAIN_GAME_EXPERIMENTS, PLATFORM_SUBMIT_QUEUE, ZERO_DOMAIN_PLATFORM_STRATEGY, PLATFORM_OUTREACH_TRACKER, PLATFORM_SUBMIT_COCKPIT, PORTAL_SUBMISSION_PACK, ZERO_COST_MONETIZATION_MAP, SPONSOR_PLACEMENTS, SPONSOR_DEALS, SPONSOR_OUTREACH_TARGETS, SPONSOR_OUTREACH_TEMPLATES, SPONSOR_VERTICALS, SPONSOR_CALL_ACTIONS, SPONSOR_DISCOVERY_LINKS, sponsorExternalDiscoveryProof, sponsorMediaKitPayload, sponsorCallPayload, sponsorOpportunityPayload, sponsorDealRoomPayload } = require("./seo-content.cjs");
const { serviceDeliveryInputExample, zipServiceDelivery } = require("./service-delivery-kit.cjs");

const root = path.resolve(__dirname, "..");
const template = fs.readFileSync(path.join(root, "index.html"), "utf8");
const generatedAt = new Date();
const generatedAtIso = generatedAt.toISOString();
const lastmod = generatedAtIso.slice(0, 10);
const campaignAssets = readCampaignAssets();
const gistDiscovery = readGistDiscovery();
const issueDiscovery = readIssueDiscovery();
const externalDiscoveryProof = sponsorExternalDiscoveryProof();
const digitalProductPackages = buildDigitalProductPackages();
const paidServiceAssets = buildPaidServiceAssets();
const auditLeadMagnetAssets = buildAuditLeadMagnetAssets();

function pageHtml(route) {
  const rendered = renderRoute(route);
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${rendered.title} - PrintableTools Lab</title>`)
    .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${escapeAttr(rendered.description)}">`)
    .replace(/<meta name="robots" content=".*?">/, `<meta name="robots" content="${route.index === false ? "noindex,follow" : "index,follow"}">`)
    .replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${escapeAttr(rendered.title)}">`)
    .replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${escapeAttr(rendered.description)}">`)
    .replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${siteUrl("assets/images/social-card.webp").replace(/\/$/, "")}">`)
    .replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${siteUrl(route.path)}">`)
    .replace(/<main id="app" tabindex="-1">[\s\S]*?<\/main>/, `<main id="app" tabindex="-1">\n${rendered.html}\n    </main>`);
  if (route.chrome === "internal") {
    html = html
      .replace("<body>", '<body class="internal-route">')
      .replace(/\s*<header class="site-header">[\s\S]*?<\/header>\s*/, "\n")
      .replace(/\s*<footer class="site-footer">[\s\S]*?<\/footer>\s*/, "\n");
  }
  return html;
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
  "Disallow: /ops/",
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
    { name: "Sponsor", short_name: "Sponsor", url: "/sponsor/" },
    { name: "Upload limit fixer", short_name: "Upload fix", url: "/upload-limit-fixer/" },
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
  if (!/^\/ops\/\s*$/m.test(headers)) {
    fs.appendFileSync(headersPath, "\n/ops/\n  X-Robots-Tag: noindex, nofollow\n");
  }
  if (!headers.includes("/ops/*")) {
    fs.appendFileSync(headersPath, "\n/ops/*\n  X-Robots-Tag: noindex, nofollow\n");
  }
  if (!/^\/dashboard\/\s*$/m.test(headers)) {
    fs.appendFileSync(headersPath, "\n/dashboard/\n  X-Robots-Tag: noindex, nofollow\n");
  }
  if (!headers.includes("/dashboard/*")) {
    fs.appendFileSync(headersPath, "\n/dashboard/*\n  X-Robots-Tag: noindex, nofollow\n");
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
  if (!headers.includes("/upload-error-cheatsheet.json")) {
    fs.appendFileSync(headersPath, "\n/upload-error-cheatsheet.json\n  Content-Type: application/json; charset=utf-8\n");
  }
  if (!headers.includes("/sponsor-media-kit.json")) {
    fs.appendFileSync(headersPath, "\n/sponsor-media-kit.json\n  Content-Type: application/json; charset=utf-8\n");
  }
  if (!headers.includes("/sponsor-outreach-pack.json")) {
    fs.appendFileSync(headersPath, "\n/sponsor-outreach-pack.json\n  Content-Type: application/json; charset=utf-8\n");
  }
  if (!headers.includes("/sponsor-call.json")) {
    fs.appendFileSync(headersPath, "\n/sponsor-call.json\n  Content-Type: application/json; charset=utf-8\n");
  }
  if (!headers.includes("/sponsor-opportunities.json")) {
    fs.appendFileSync(headersPath, "\n/sponsor-opportunities.json\n  Content-Type: application/json; charset=utf-8\n");
  }
  if (!headers.includes("/sponsor-intent-feed.json")) {
    fs.appendFileSync(headersPath, "\n/sponsor-intent-feed.json\n  Content-Type: application/json; charset=utf-8\n");
  }
  if (!headers.includes("/sponsor-deal-room.json")) {
    fs.appendFileSync(headersPath, "\n/sponsor-deal-room.json\n  Content-Type: application/json; charset=utf-8\n");
  }
  if (!headers.includes("/organic-push-kit.json")) {
    fs.appendFileSync(headersPath, "\n/organic-push-kit.json\n  Content-Type: application/json; charset=utf-8\n");
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
if (!headers.includes("/portal-submission-pack.json")) {
  fs.appendFileSync(headersPath, "\n/portal-submission-pack.json\n  Content-Type: application/json; charset=utf-8\n");
}
if (!headers.includes("/game-submission-feed.json")) {
  fs.appendFileSync(headersPath, "\n/game-submission-feed.json\n  Content-Type: application/json; charset=utf-8\n");
}
  if (!headers.includes("/zero-cost-monetization-map.json")) {
  fs.appendFileSync(headersPath, "\n/zero-cost-monetization-map.json\n  Content-Type: application/json; charset=utf-8\n");
}
if (!headers.includes("/digital-products.json")) {
  fs.appendFileSync(headersPath, "\n/digital-products.json\n  Content-Type: application/json; charset=utf-8\n");
}
if (!headers.includes("/services.json")) {
  fs.appendFileSync(headersPath, "\n/services.json\n  Content-Type: application/json; charset=utf-8\n");
}
if (!headers.includes("/service-sales-pack.json")) {
  fs.appendFileSync(headersPath, "\n/service-sales-pack.json\n  Content-Type: application/json; charset=utf-8\n");
}
if (!headers.includes("/assets/services/*.txt")) {
  fs.appendFileSync(headersPath, "\n/assets/services/*.txt\n  Content-Type: text/plain; charset=utf-8\n");
}
if (!headers.includes("/assets/services/*.json")) {
  fs.appendFileSync(headersPath, "\n/assets/services/*.json\n  Content-Type: application/json; charset=utf-8\n");
}
if (!headers.includes("/assets/services/*.zip")) {
  fs.appendFileSync(headersPath, "\n/assets/services/*.zip\n  Content-Type: application/zip\n");
}
if (!headers.includes("/assets/digital-products/*.txt")) {
  fs.appendFileSync(headersPath, "\n/assets/digital-products/*.txt\n  Content-Type: text/plain; charset=utf-8\n");
}
if (!headers.includes("/assets/digital-products/*.json")) {
  fs.appendFileSync(headersPath, "\n/assets/digital-products/*.json\n  Content-Type: application/json; charset=utf-8\n");
}
if (!headers.includes("/assets/digital-products/*.zip")) {
  fs.appendFileSync(headersPath, "\n/assets/digital-products/*.zip\n  Content-Type: application/zip\n");
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

const digitalProductsJson = {
  name: "PrintableTools Lab Digital Products",
  generatedAt: generatedAtIso,
  canonical: fileUrl("digital-products.json"),
  products: DIGITAL_PRODUCTS.map(digitalProductEntry),
  moneyGate: "Digital product requests and checkout-link clicks are not revenue. Count revenue only after an external provider proves a paid order, payout balance, or settled payment.",
};
fs.writeFileSync(path.join(root, "digital-products.json"), `${JSON.stringify(digitalProductsJson, null, 2)}\n`);

const servicesJson = {
  name: "PrintableTools Lab Paid Services",
  generatedAt: generatedAtIso,
  canonical: fileUrl("services.json"),
  services: PAID_SERVICES.map(paidServiceEntry),
  leadMagnets: [marketTablePrintAuditEntry()],
  moneyGate: "Service requests and audit requests are not revenue. Count revenue only after an external provider proves a paid order, payout balance, or settled payment.",
};
fs.writeFileSync(path.join(root, "services.json"), `${JSON.stringify(servicesJson, null, 2)}\n`);

const serviceSalesPackJson = serviceSalesPackEntry();
fs.writeFileSync(path.join(root, "service-sales-pack.json"), `${JSON.stringify(serviceSalesPackJson, null, 2)}\n`);

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
  organicPushKit: {
    page: siteUrl("organic-push-kit"),
    json: fileUrl("organic-push-kit.json"),
    tasks: ORGANIC_PUSH_TASKS.map(organicPushTaskEntry),
  },
  uploadErrorCheatsheet: {
    page: siteUrl("upload-error-cheatsheet"),
    json: fileUrl("upload-error-cheatsheet.json"),
    entries: UPLOAD_ERROR_CHEATSHEET.map(uploadErrorEntry),
  },
  sponsorDiscovery: {
    sponsorCall: siteUrl("sponsor-call"),
    sponsorCallJson: fileUrl("sponsor-call.json"),
    sponsorDealRoom: siteUrl("sponsor-deal-room"),
    sponsorDealRoomJson: fileUrl("sponsor-deal-room.json"),
    mediaKit: fileUrl("sponsor-media-kit.json"),
    outreachPack: fileUrl("sponsor-outreach-pack.json"),
    links: SPONSOR_DISCOVERY_LINKS,
    externalDiscoveryProof,
    successGate: "Commercial discovery is working only when a qualified sponsor lead, signed agreement, or settled external payment is verified. Clicks alone are not revenue.",
  },
  localSellerService: {
    servicePage: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug),
    auditPage: siteUrl(MARKET_TABLE_PRINT_AUDIT.slug),
    requestTemplate: fileUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicRequestPath),
    sampleDelivery: fileUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicSampleDeliveryPath),
    priceUsd: CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd,
    moneyGate: "Service requests and audit requests are not revenue. Money is real only after an external provider proves a paid order, payout balance, or settled payment.",
  },
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

const organicPushKitJson = {
  name: "PrintableTools Lab Organic Push Kit",
  generatedAt: generatedAtIso,
  canonical: siteUrl("organic-push-kit"),
  purpose: "Low-risk organic distribution tasks for getting real free-tool traffic before display ads.",
  tasks: ORGANIC_PUSH_TASKS.map(organicPushTaskEntry),
  successGate: "A task is working only when live metrics show real visits, tool-depth clicks, downloads, search exposure, or accepted external listing evidence.",
  rules: [
    ...SHARE_KIT_RULES,
    "Stop using any channel that creates spam complaints, low-quality traffic, or no tool-depth signal.",
    "Revenue is still unproven until ad payout, platform payout, or another payment provider shows settled money.",
  ],
};
fs.writeFileSync(path.join(root, "organic-push-kit.json"), `${JSON.stringify(organicPushKitJson, null, 2)}\n`);

const uploadErrorCheatsheetJson = {
  name: "PrintableTools Lab Upload Error Cheatsheet",
  generatedAt: generatedAtIso,
  canonical: siteUrl("upload-error-cheatsheet"),
  purpose: "Machine-readable reference for common PDF, image, JPG, PNG, resume, and email attachment upload errors with direct free no-signup fixes.",
  entries: UPLOAD_ERROR_CHEATSHEET.map(uploadErrorEntry),
  safeUseRules: [
    "Share the clean landing page or tracked campaign URL only where it directly answers an upload-error problem.",
    "Do not claim guaranteed compression results; say the tools try toward the target and users should review the output.",
    "Do not ask users to click ads, interact with ads, or upload private files into public examples.",
  ],
};
fs.writeFileSync(path.join(root, "upload-error-cheatsheet.json"), `${JSON.stringify(uploadErrorCheatsheetJson, null, 2)}\n`);

const sponsorMediaKitJson = sponsorMediaKitPayload(generatedAtIso);
fs.writeFileSync(path.join(root, "sponsor-media-kit.json"), `${JSON.stringify(sponsorMediaKitJson, null, 2)}\n`);

const sponsorCallJson = sponsorCallPayload(generatedAtIso);
fs.writeFileSync(path.join(root, "sponsor-call.json"), `${JSON.stringify(sponsorCallJson, null, 2)}\n`);

const sponsorOpportunitiesJson = sponsorOpportunityPayload(generatedAtIso);
fs.writeFileSync(path.join(root, "sponsor-opportunities.json"), `${JSON.stringify(sponsorOpportunitiesJson, null, 2)}\n`);

const sponsorIntentFeedJson = {
  name: "PrintableTools Lab Sponsor Intent Feed",
  generatedAt: generatedAtIso,
  canonical: fileUrl("sponsor-intent-feed.json"),
  purpose: "Public-safe sponsor discovery feed for directories, newsletters, resource pages, and partners. It lists sponsor-fit audiences and invoice-review paths without exposing operations pages, private leads, payment data, or contact details.",
  sponsorOpportunities: siteUrl("sponsor-opportunities"),
  sponsorOpportunitiesJson: fileUrl("sponsor-opportunities.json"),
  sponsorStarterReview: siteUrl("sponsor-starter-review"),
  invoiceReviewUrl: sponsorOpportunitiesJson.invoiceReviewUrl,
  mediaKit: fileUrl("sponsor-media-kit.json"),
  externalDiscoveryProof,
  prospectPaths: sponsorOpportunitiesJson.prospectPaths,
  invoiceReadyDeals: SPONSOR_DEALS
    .filter((deal) => deal.commitment === "request-invoice")
    .map((deal) => ({
      id: deal.id,
      title: deal.title,
      price: deal.price,
      bestFor: deal.bestFor,
      proofNeeded: deal.proofNeeded,
      trackedUrl: deal.trackedUrl,
    })),
  privacyBoundary: "No sponsor lead emails, company names submitted through forms, payment details, internal metric URLs, or operations routes are exposed in this public feed.",
  rules: sponsorOpportunitiesJson.rules,
  successGate: sponsorOpportunitiesJson.successGate,
};
fs.writeFileSync(path.join(root, "sponsor-intent-feed.json"), `${JSON.stringify(sponsorIntentFeedJson, null, 2)}\n`);

const sponsorDealRoomJson = sponsorDealRoomPayload(generatedAtIso);
fs.writeFileSync(path.join(root, "sponsor-deal-room.json"), `${JSON.stringify(sponsorDealRoomJson, null, 2)}\n`);

const sponsorOutreachPackJson = {
  name: "PrintableTools Lab Sponsor Outreach Pack",
  generatedAt: generatedAtIso,
  canonical: fileUrl("sponsor-outreach-pack.json"),
  sponsorPage: siteUrl("sponsor"),
  sponsorIntentFeed: fileUrl("sponsor-intent-feed.json"),
  starterReview: {
    page: siteUrl("sponsor-starter-review"),
    invoiceReviewUrl: sponsorOpportunitiesJson.invoiceReviewUrl,
    recommendedNextStep: sponsorOpportunitiesJson.recommendedNextStep,
  },
  sponsorDealRoom: {
    page: siteUrl("sponsor-deal-room"),
    json: fileUrl("sponsor-deal-room.json"),
    deals: SPONSOR_DEALS,
  },
  mediaKit: fileUrl("sponsor-media-kit.json"),
  externalDiscoveryProof,
  placements: SPONSOR_PLACEMENTS,
  targets: SPONSOR_OUTREACH_TARGETS,
  sponsorCall: {
    page: siteUrl("sponsor-call"),
    json: fileUrl("sponsor-call.json"),
    actions: SPONSOR_CALL_ACTIONS,
  },
  sponsorOpportunities: {
    page: siteUrl("sponsor-opportunities"),
    json: fileUrl("sponsor-opportunities.json"),
    starterReviewUrl: sponsorOpportunitiesJson.starterReviewUrl,
    invoiceReviewUrl: sponsorOpportunitiesJson.invoiceReviewUrl,
    opportunities: sponsorOpportunitiesJson.opportunities,
    prospectPaths: sponsorOpportunitiesJson.prospectPaths,
  },
  prospectPaths: sponsorOpportunitiesJson.prospectPaths,
  verticalSponsorPages: SPONSOR_VERTICALS.map((vertical) => ({
    title: vertical.title,
    audience: vertical.audience,
    sponsorFit: vertical.sponsorFit,
    priceHint: vertical.priceHint,
    url: siteUrl(`sponsor/${vertical.slug}`),
    trackedUrl: `${siteUrl(`sponsor/${vertical.slug}`).replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=${encodeURIComponent(vertical.campaign)}`,
    categories: vertical.sponsorCategories,
  })),
  templates: SPONSOR_OUTREACH_TEMPLATES,
  trackedLinks: [
    ...SPONSOR_DEALS.map((deal) => ({
      category: deal.title,
      url: deal.trackedUrl,
      pitch: deal.bestFor,
    })),
    ...SPONSOR_OUTREACH_TARGETS.map((target) => ({
      category: target.category,
      url: `${siteUrl("sponsor").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_pilot&utm_content=${encodeURIComponent(target.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))}`,
      pitch: target.pitch,
    })),
    ...SPONSOR_VERTICALS.map((vertical) => ({
      category: vertical.title,
      url: `${siteUrl(`sponsor/${vertical.slug}`).replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=${encodeURIComponent(vertical.campaign)}`,
      pitch: vertical.pitch,
    })),
    ...sponsorOpportunitiesJson.prospectPaths.map((pathEntry) => ({
      category: `${pathEntry.title} invoice review`,
      url: pathEntry.invoiceReviewUrl,
      pitch: pathEntry.firstAction,
    })),
  ],
  rules: sponsorMediaKitJson.rules,
  successGate: "Success is a real qualified sponsor lead, a signed agreement, or settled payment in an external provider. Clicks and validation submissions are not revenue.",
};
fs.writeFileSync(path.join(root, "sponsor-outreach-pack.json"), `${JSON.stringify(sponsorOutreachPackJson, null, 2)}\n`);

const platformSubmitQueueJson = {
  name: "HTML5 Platform Submit Queue",
  generatedAt: generatedAtIso,
  canonical: siteUrl("platform-submit-queue"),
  strategy: ZERO_DOMAIN_PLATFORM_STRATEGY,
  queue: PLATFORM_SUBMIT_QUEUE,
  games: ZERO_DOMAIN_GAME_EXPERIMENTS,
  nextAction: "Monitor Playgama review, restore CrazyGames dashboard access for the next live status check, keep Upload Limit Panic ready as the second package, and resume GamePix only after owner-written non-AI description copy is available.",
  completionGate: "At least one platform submission accepted/live and platform analytics show real plays; ad revenue requires platform ad eligibility and payout setup.",
};
fs.writeFileSync(path.join(root, "platform-submit-queue.json"), `${JSON.stringify(platformSubmitQueueJson, null, 2)}\n`);

const platformOutreachTrackerJson = {
  name: "HTML5 Platform Outreach Tracker",
  generatedAt: generatedAtIso,
  canonical: siteUrl("platform-outreach-tracker"),
  tracker: PLATFORM_OUTREACH_TRACKER,
  games: ZERO_DOMAIN_GAME_EXPERIMENTS,
  nextAction: "Monitor Playgama dashboard, keep CrazyGames payout setup inside official Tipalti only after eligibility, keep GameDistribution as a later outreach option, and unblock GamePix only with owner-written non-AI description copy.",
  completionGate: "At least one outreach channel confirms review or requests upload metadata; actual goal completion still requires accepted game, real plays, and verified revenue.",
};
fs.writeFileSync(path.join(root, "platform-outreach-tracker.json"), `${JSON.stringify(platformOutreachTrackerJson, null, 2)}\n`);

const platformSubmitCockpitJson = {
  name: "HTML5 Platform Submit Cockpit",
  generatedAt: generatedAtIso,
  canonical: siteUrl("platform-submit-cockpit"),
  cockpit: PLATFORM_SUBMIT_COCKPIT,
  games: ZERO_DOMAIN_GAME_EXPERIMENTS,
  nextAction: "Monitor Playgama review, restore CrazyGames dashboard access for the next live status check, keep Upload Limit Panic as the ready backup package, keep payout details inside official dashboards, and keep Yandex parked until publisher login/setup is usable.",
  completionGate: "Dashboard submitted/in-review status is progress; the full money goal still requires accepted game, real plays, enabled ads, and verified revenue.",
};
fs.writeFileSync(path.join(root, "platform-submit-cockpit.json"), `${JSON.stringify(platformSubmitCockpitJson, null, 2)}\n`);

const portalSubmissionPackJson = {
  name: "HTML5 Game Portal Submission Pack",
  generatedAt: generatedAtIso,
  canonical: siteUrl("portal-submission-pack"),
  pack: PORTAL_SUBMISSION_PACK,
  games: ZERO_DOMAIN_GAME_EXPERIMENTS,
  platformQueue: PLATFORM_SUBMIT_QUEUE,
  nextAction: "Keep submitted CrazyGames/Playgama routes monitored, then use the public submission pack to approach manual-consent backup portals without exposing payout or private identity details automatically.",
  completionGate: PORTAL_SUBMISSION_PACK.completionGate,
};
fs.writeFileSync(path.join(root, "portal-submission-pack.json"), `${JSON.stringify(portalSubmissionPackJson, null, 2)}\n`);

const gameSubmissionFeedJson = {
  name: "HTML5 Game Submission Feed",
  generatedAt: generatedAtIso,
  canonical: fileUrl("game-submission-feed.json"),
  purpose: "Machine-readable public feed for HTML5 game portals and reviewers. It lists playable builds, clean ZIPs, SDK packages, review assets, ad-safety notes, and manual-consent gates without private account or payout data.",
  leadGame: PORTAL_SUBMISSION_PACK.leadGame,
  backupGame: PORTAL_SUBMISSION_PACK.backupGame,
  moneyGate: PORTAL_SUBMISSION_PACK.completionGate,
  safetyRules: [
    ...PORTAL_SUBMISSION_PACK.candidatePolicy,
    ...PORTAL_SUBMISSION_PACK.submissionRules,
  ],
  games: ZERO_DOMAIN_GAME_EXPERIMENTS.map(gameSubmissionFeedEntry),
  platformQueue: PLATFORM_SUBMIT_QUEUE.map((item) => ({
    platform: item.platform,
    priority: item.priority,
    submissionUrl: item.submissionUrl,
    docsUrl: item.docsUrl || "",
    currentGate: item.currentGate || "",
    adPolicyNote: item.adPolicyNote || "",
    submitGames: item.submitGames,
  })),
  publicPages: {
    portalSubmissionPack: siteUrl("portal-submission-pack"),
    platformSubmitQueue: siteUrl("platform-submit-queue"),
    platformSubmitCockpit: siteUrl("platform-submit-cockpit"),
    zeroCostMonetizationMap: siteUrl("zero-cost-monetization-map"),
    githubPagesGamePack: "https://yanqr213.github.io/printable-tools-lab/html5-game-submission-pack/",
  },
};
fs.writeFileSync(path.join(root, "game-submission-feed.json"), `${JSON.stringify(gameSubmissionFeedJson, null, 2)}\n`);

const zeroCostMonetizationMapJson = {
  name: "Zero-Cost Monetization Map",
  generatedAt: generatedAtIso,
  canonical: siteUrl("zero-cost-monetization-map"),
  map: ZERO_COST_MONETIZATION_MAP,
  games: ZERO_DOMAIN_GAME_EXPERIMENTS,
  nextAction: "Keep overseas hosted HTML5 game platforms as the active mainline; prepare Douyin only after the current ZIP submissions enter review.",
  completionGate: ZERO_COST_MONETIZATION_MAP.moneyGate,
};
fs.writeFileSync(path.join(root, "zero-cost-monetization-map.json"), `${JSON.stringify(zeroCostMonetizationMapJson, null, 2)}\n`);

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
  `- Upload limit fixer page: ${siteUrl("upload-limit-fixer")}`,
  `- Directory submission pack: ${siteUrl("submit-directory")}`,
  `- Share kit: ${siteUrl("share-kit")}`,
  `- Sponsor deal room: ${siteUrl("sponsor-deal-room")}`,
  `- Machine-readable sponsor deal room: ${fileUrl("sponsor-deal-room.json")}`,
  `- Machine-readable sponsor intent feed: ${fileUrl("sponsor-intent-feed.json")}`,
  `- Custom Local Print Pack Setup: ${siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)}`,
  `- Free Market Table Print Audit: ${siteUrl(MARKET_TABLE_PRINT_AUDIT.slug)}`,
  `- Local seller services JSON: ${fileUrl("services.json")}`,
  `- Organic push kit: ${siteUrl("organic-push-kit")}`,
  `- Upload error cheatsheet: ${siteUrl("upload-error-cheatsheet")}`,
  `- Machine-readable organic push kit: ${fileUrl("organic-push-kit.json")}`,
  `- Machine-readable upload error cheatsheet: ${fileUrl("upload-error-cheatsheet.json")}`,
  `- HTML5 platform submit queue: ${siteUrl("platform-submit-queue")}`,
  `- HTML5 platform submit cockpit: ${siteUrl("platform-submit-cockpit")}`,
  `- HTML5 platform outreach tracker: ${siteUrl("platform-outreach-tracker")}`,
  `- HTML5 game portal submission pack: ${siteUrl("portal-submission-pack")}`,
  `- HTML5 game submission feed: ${fileUrl("game-submission-feed.json")}`,
  `- Zero-cost monetization map: ${siteUrl("zero-cost-monetization-map")}`,
  `- Guides index: ${siteUrl("guides")}`,
  `- Sitemap: ${fileUrl("sitemap.xml")}`,
  `- RSS feed: ${fileUrl("feed.xml")}`,
  `- Web app manifest: ${fileUrl("site.webmanifest")}`,
  `- OpenSearch description: ${fileUrl("opensearch.xml")}`,
  `- Machine-readable tool list: ${fileUrl("tools.json")}`,
  `- Discovery index: ${fileUrl("discovery.json")}`,
  `- Machine-readable share kit: ${fileUrl("share-kit.json")}`,
  `- Machine-readable organic push kit: ${fileUrl("organic-push-kit.json")}`,
  `- Machine-readable upload error cheatsheet: ${fileUrl("upload-error-cheatsheet.json")}`,
  `- Machine-readable platform submit queue: ${fileUrl("platform-submit-queue.json")}`,
  `- Machine-readable platform submit cockpit: ${fileUrl("platform-submit-cockpit.json")}`,
  `- Machine-readable platform outreach tracker: ${fileUrl("platform-outreach-tracker.json")}`,
  `- Machine-readable portal submission pack: ${fileUrl("portal-submission-pack.json")}`,
  `- Machine-readable game submission feed: ${fileUrl("game-submission-feed.json")}`,
  `- Machine-readable zero-cost monetization map: ${fileUrl("zero-cost-monetization-map.json")}`,
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
  "- Ads are disabled during validation and are never used as a gate for downloading files.",
  "- Future ad units must stay away from generator controls and must never ask visitors to interact with ads.",
  "- Optional service requests do not collect payment on-site. Count revenue only after an external provider proves a paid order, payout balance, or settled payment.",
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
  organicPushKit: fileUrl("organic-push-kit.json"),
  uploadErrorCheatsheet: fileUrl("upload-error-cheatsheet.json"),
  sponsorCall: fileUrl("sponsor-call.json"),
  sponsorDealRoom: fileUrl("sponsor-deal-room.json"),
  sponsorOpportunities: fileUrl("sponsor-opportunities.json"),
  sponsorIntentFeed: fileUrl("sponsor-intent-feed.json"),
  sponsorMediaKit: fileUrl("sponsor-media-kit.json"),
  sponsorOutreachPack: fileUrl("sponsor-outreach-pack.json"),
  platformSubmitQueue: fileUrl("platform-submit-queue.json"),
  platformSubmitCockpit: fileUrl("platform-submit-cockpit.json"),
  platformOutreachTracker: fileUrl("platform-outreach-tracker.json"),
  portalSubmissionPack: fileUrl("portal-submission-pack.json"),
  gameSubmissionFeed: fileUrl("game-submission-feed.json"),
  zeroCostMonetizationMap: fileUrl("zero-cost-monetization-map.json"),
  highIntentEntryPoints: [siteUrl("free-pdf-tools"), siteUrl("pdf-tool-finder"), siteUrl("upload-limit-fixer"), siteUrl("organic-push-kit"), siteUrl("upload-error-cheatsheet"), siteUrl("submit-directory"), siteUrl("share-kit"), siteUrl("sponsor-call"), siteUrl("sponsor-deal-room"), siteUrl("sponsor-opportunities"), siteUrl("sponsor"), siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug), siteUrl(MARKET_TABLE_PRINT_AUDIT.slug), ...SPONSOR_VERTICALS.map((vertical) => siteUrl(`sponsor/${vertical.slug}`)), siteUrl("platform-submit-queue"), siteUrl("platform-submit-cockpit"), siteUrl("platform-outreach-tracker"), siteUrl("portal-submission-pack"), siteUrl("zero-cost-monetization-map"), ...HIGH_INTENT_LANDING_PATHS.map(siteUrl), ...HIGH_INTENT_TOOL_PATHS.map(siteUrl)],
  distributionAssets: {
    shareKit: siteUrl("share-kit"),
    shareKitJson: fileUrl("share-kit.json"),
    organicPushKit: siteUrl("organic-push-kit"),
    organicPushKitJson: fileUrl("organic-push-kit.json"),
    uploadErrorCheatsheet: siteUrl("upload-error-cheatsheet"),
    uploadErrorCheatsheetJson: fileUrl("upload-error-cheatsheet.json"),
    sponsorCall: siteUrl("sponsor-call"),
    sponsorCallJson: fileUrl("sponsor-call.json"),
    sponsorDealRoom: siteUrl("sponsor-deal-room"),
    sponsorDealRoomJson: fileUrl("sponsor-deal-room.json"),
    sponsorDeals: SPONSOR_DEALS,
    sponsorOpportunities: siteUrl("sponsor-opportunities"),
    sponsorOpportunitiesJson: fileUrl("sponsor-opportunities.json"),
    sponsorIntentFeedJson: fileUrl("sponsor-intent-feed.json"),
    sponsorPage: siteUrl("sponsor"),
    sponsorMediaKit: fileUrl("sponsor-media-kit.json"),
    sponsorOutreachPack: fileUrl("sponsor-outreach-pack.json"),
    sponsorDiscoveryLinks: SPONSOR_DISCOVERY_LINKS,
    sponsorVerticalPages: SPONSOR_VERTICALS.map((vertical) => ({
      title: vertical.title,
      url: siteUrl(`sponsor/${vertical.slug}`),
      trackedUrl: `${siteUrl(`sponsor/${vertical.slug}`).replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=${encodeURIComponent(vertical.campaign)}`,
      sponsorFit: vertical.sponsorFit,
    })),
    localSellerService: {
      servicePage: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug),
      auditPage: siteUrl(MARKET_TABLE_PRINT_AUDIT.slug),
      servicesJson: fileUrl("services.json"),
      requestTemplate: fileUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicRequestPath),
      sampleDelivery: fileUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicSampleDeliveryPath),
      priceUsd: CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd,
      moneyGate: "Service requests and audit requests are not revenue. Money is real only after an external provider proves a paid order, payout balance, or settled payment.",
    },
    platformSubmitQueue: siteUrl("platform-submit-queue"),
    platformSubmitQueueJson: fileUrl("platform-submit-queue.json"),
    platformSubmitCockpit: siteUrl("platform-submit-cockpit"),
    platformSubmitCockpitJson: fileUrl("platform-submit-cockpit.json"),
    platformOutreachTracker: siteUrl("platform-outreach-tracker"),
    platformOutreachTrackerJson: fileUrl("platform-outreach-tracker.json"),
    portalSubmissionPack: siteUrl("portal-submission-pack"),
    portalSubmissionPackJson: fileUrl("portal-submission-pack.json"),
    gameSubmissionFeedJson: fileUrl("game-submission-feed.json"),
    zeroCostMonetizationMap: siteUrl("zero-cost-monetization-map"),
    zeroCostMonetizationMapJson: fileUrl("zero-cost-monetization-map.json"),
    distributionPack: siteUrl("submit-directory"),
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
      cleanZipUrl: game.cleanZipUrl,
      cleanPackageReportUrl: game.cleanPackageReportUrl,
      demoVideoUrl: game.demoVideoUrl,
      coverUrl: game.coverUrl,
      iconUrl: game.iconUrl,
      reviewReadinessUrl: game.reviewReadinessUrl,
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
    "Future ad units must stay separate from generator controls and downloads.",
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
  `- TechTools Launchpad tracked directory pack: ${siteUrl("submit-directory").replace(/\/$/, "")}?utm_source=techtools&utm_medium=directory&utm_campaign=launchpad_2026_06`,
  `- TechTools Upload Limit Fixer listing: ${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=techtools&utm_medium=directory&utm_campaign=upload_limit_2026_06&utm_content=upload_limit_fixer`,
  `- TechTools Invoice Generator listing: ${siteUrl("tools/invoice-generator").replace(/\/$/, "")}?utm_source=techtools&utm_medium=directory&utm_campaign=invoice_service_2026_06&utm_content=invoice_generator`,
  `- TechTools Invoice Follow-up Copy Pack listing: ${siteUrl(INVOICE_FOLLOWUP_COPY_PACK_SERVICE.slug).replace(/\/$/, "")}?utm_source=techtools&utm_medium=directory&utm_campaign=invoice_followup_service_2026_06&utm_content=invoice_followup_copy_pack`,
  `- TechTools Invoice Follow-up Email Generator listing: ${siteUrl("tools/invoice-followup-email").replace(/\/$/, "")}?utm_source=techtools&utm_medium=directory&utm_campaign=invoice_followup_email_2026_06&utm_content=invoice_followup_email_generator`,
  `- TechTools Overdue Invoice Reminder listing: ${siteUrl("overdue-invoice-reminder-email").replace(/\/$/, "")}?utm_source=techtools&utm_medium=directory&utm_campaign=overdue_invoice_2026_06&utm_content=overdue_invoice_reminder_email`,
  `- TechTools Upload Limit Fix Plan listing: ${siteUrl(UPLOAD_LIMIT_FIX_PLAN_SERVICE.slug).replace(/\/$/, "")}?utm_source=techtools&utm_medium=directory&utm_campaign=upload_limit_fix_plan_2026_06&utm_content=upload_limit_fix_plan`,
  `- TechTools Upload Error Cheatsheet listing: ${siteUrl("upload-error-cheatsheet").replace(/\/$/, "")}?utm_source=techtools&utm_medium=directory&utm_campaign=upload_error_cheatsheet_2026_06&utm_content=upload_error_cheatsheet`,
  `- TechTools Compress PDF to 1MB listing: ${siteUrl("compress-pdf-to-1mb").replace(/\/$/, "")}?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_1mb_2026_06&utm_content=compress_pdf_to_1mb`,
  `- TechTools PDF Under 1MB Upload Fix listing: ${siteUrl("tools/compress-pdf").replace(/\/$/, "")}?targetSize=1mb&utm_source=techtools&utm_medium=directory&utm_campaign=pdf_1mb_tool_fix_2026_06&utm_content=compress_pdf_tool_target_1mb`,
  `- TechTools Photo Under 100KB Upload Fix listing: ${siteUrl("tools/compress-image-to-kb").replace(/\/$/, "")}?targetKb=100&utm_source=techtools&utm_medium=directory&utm_campaign=photo_100kb_tool_fix_2026_06&utm_content=compress_image_kb_tool_target_100kb`,
  `- TechTools Image Under 2MB Upload Fix listing: ${siteUrl("tools/compress-image-to-kb").replace(/\/$/, "")}?targetKb=2048&utm_source=techtools&utm_medium=directory&utm_campaign=image_2mb_tool_fix_2026_06&utm_content=compress_image_kb_tool_target_2mb`,
  `- TechTools JPG Under 200KB Upload Fix listing: ${siteUrl("tools/compress-image-to-kb").replace(/\/$/, "")}?targetKb=200&utm_source=techtools&utm_medium=directory&utm_campaign=jpg_200kb_tool_fix_2026_06&utm_content=compress_image_kb_tool_target_200kb`,
  `- TechTools Resume PDF Too Large Upload Fix listing: ${siteUrl("tools/compress-pdf").replace(/\/$/, "")}?targetSize=1mb&utm_source=techtools&utm_medium=directory&utm_campaign=resume_pdf_too_large_fix_2026_06&utm_content=compress_pdf_resume_1mb_fix`,
  `- TechTools PNG Screenshot Too Large Upload Fix listing: ${siteUrl("tools/compress-image-to-kb").replace(/\/$/, "")}?targetKb=500&utm_source=techtools&utm_medium=directory&utm_campaign=png_screenshot_too_large_fix_2026_06&utm_content=compress_image_kb_png_500kb_fix`,
  `- TechTools Passport Photo 50KB Upload Fix listing: ${siteUrl("tools/compress-image-to-kb").replace(/\/$/, "")}?targetKb=50&utm_source=techtools&utm_medium=directory&utm_campaign=passport_photo_50kb_fix_2026_06&utm_content=compress_image_kb_passport_50kb_fix`,
  `- TechTools PDF Under 500KB Upload Fix listing: ${siteUrl("tools/compress-pdf").replace(/\/$/, "")}?targetSize=500kb&utm_source=techtools&utm_medium=directory&utm_campaign=pdf_500kb_tool_fix_2026_06&utm_content=compress_pdf_tool_target_500kb`,
  `- TechTools Image Under 500KB Upload Fix listing: ${siteUrl("tools/compress-image-to-kb").replace(/\/$/, "")}?targetKb=500&utm_source=techtools&utm_medium=directory&utm_campaign=image_500kb_tool_fix_2026_06&utm_content=compress_image_kb_tool_target_500kb`,
  "- TechTools Image Dimensions 600x600 Upload Fix listing: https://techtools.cz/tools/launchpad/?tool=184",
  "- TechTools PDF Not Accepted JPG Required Fix listing: https://techtools.cz/tools/launchpad/?tool=185",
  "- TechTools Email Attachment Too Large PDF Fix listing: https://techtools.cz/tools/launchpad/?tool=186",
  `- NoSignupTools Upload Limit Fixer listing: ${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=nosignuptools&utm_medium=directory&utm_campaign=upload_limit_2026_06&utm_content=upload_limit_fixer`,
  `- NoSignupTools Upload Error Cheatsheet listing: ${siteUrl("upload-error-cheatsheet").replace(/\/$/, "")}?utm_source=nosignuptools&utm_medium=directory&utm_campaign=upload_error_cheatsheet_2026_06&utm_content=upload_error_cheatsheet`,
  `- NoSignupTools Image Dimensions 600x600 Upload Fix listing: ${siteUrl("image-dimensions-600x600").replace(/\/$/, "")}?utm_source=nosignuptools&utm_medium=directory&utm_campaign=image_dimensions_600x600_fix_2026_06&utm_content=image_dimensions_600x600_landing`,
  `- NoSignupTools PDF Not Accepted JPG Required Fix listing: ${siteUrl("pdf-not-accepted-jpg-required").replace(/\/$/, "")}?utm_source=nosignuptools&utm_medium=directory&utm_campaign=pdf_not_accepted_jpg_required_fix_2026_06&utm_content=pdf_to_jpg_required_landing`,
  `- NoSignupTools Compress Image to KB listing: ${siteUrl("tools/compress-image-to-kb").replace(/\/$/, "")}?utm_source=nosignuptools&utm_medium=directory&utm_campaign=compress_image_kb_invoice_first_2026_06&utm_content=compress_image_kb_tool`,
  `- NoSignupTools Email Attachment Too Large Fix listing: ${siteUrl("email-attachment-too-large").replace(/\/$/, "")}?utm_source=nosignuptools&utm_medium=directory&utm_campaign=email_attachment_too_large_fix_2026_06&utm_content=email_attachment_too_large_landing`,
  `- FreeNoSignup Upload Limit Fixer listing: ${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=freenosignup`,
  `- FreeNoSignup Upload Error Cheatsheet listing: ${siteUrl("upload-error-cheatsheet").replace(/\/$/, "")}?utm_source=freenosignup&utm_medium=directory&utm_campaign=upload_error_cheatsheet_2026_06&utm_content=upload_error_cheatsheet`,
  `- NoSignupTools Overdue Invoice Reminder listing: ${siteUrl("overdue-invoice-reminder-email").replace(/\/$/, "")}?utm_source=nosignuptools&utm_medium=directory&utm_campaign=overdue_invoice_2026_06&utm_content=overdue_invoice_reminder_email`,
  `- FreeNoSignup Overdue Invoice Reminder listing: ${siteUrl("overdue-invoice-reminder-email").replace(/\/$/, "")}?utm_source=freenosignup&utm_medium=directory&utm_campaign=overdue_invoice_2026_06&utm_content=overdue_invoice_reminder_email`,
  `- NoLogin.tools tracked upload-limit URL: ${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=nologin&utm_medium=directory&utm_campaign=zero_cost_push`,
  `- NoLogin.tools Upload Limit Fixer listing: ${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=nologin&utm_medium=directory&utm_campaign=upload_limit_2026_06&utm_content=upload_limit_fixer`,
  `- NoLogin.tools Upload Error Cheatsheet listing: ${siteUrl("upload-error-cheatsheet").replace(/\/$/, "")}?utm_source=nologin&utm_medium=directory&utm_campaign=upload_error_cheatsheet_2026_06&utm_content=upload_error_cheatsheet`,
  `- NoLogin.tools Invoice Follow-up Email Generator listing: ${siteUrl("tools/invoice-followup-email").replace(/\/$/, "")}?utm_source=nologin&utm_medium=directory&utm_campaign=invoice_followup_email_2026_06&utm_content=invoice_followup_email_generator`,
  `- NoLogin.tools Overdue Invoice Reminder listing: ${siteUrl("overdue-invoice-reminder-email").replace(/\/$/, "")}?utm_source=nologin&utm_medium=directory&utm_campaign=overdue_invoice_2026_06&utm_content=overdue_invoice_reminder_email`,
  `- NoLogin.tools Image Dimensions 600x600 Upload Fix listing: ${siteUrl("image-dimensions-600x600").replace(/\/$/, "")}?utm_source=nologin&utm_medium=directory&utm_campaign=image_dimensions_600x600_fix_2026_06&utm_content=image_dimensions_600x600_landing`,
  `- NoLogin.tools PDF Not Accepted JPG Required Fix listing: ${siteUrl("pdf-not-accepted-jpg-required").replace(/\/$/, "")}?utm_source=nologin&utm_medium=directory&utm_campaign=pdf_not_accepted_jpg_required_fix_2026_06&utm_content=pdf_to_jpg_required_landing`,
  `- NoLogin.tools Email Attachment Too Large Fix listing: ${siteUrl("email-attachment-too-large").replace(/\/$/, "")}?utm_source=nologin&utm_medium=directory&utm_campaign=email_attachment_too_large_fix_2026_06&utm_content=email_attachment_too_large_landing`,
  `- NoSubscription.org tracked upload-limit URL: ${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=nosubscription&utm_medium=directory&utm_campaign=zero_cost_push`,
  `- Share kit campaign: ${siteUrl("share-kit").replace(/\/$/, "")}?utm_source=share-kit&utm_medium=organic`,
  `- Short-video campaign: ${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=short-video&utm_medium=organic&utm_campaign=zero_cost_push`,
  `- GitHub campaign: ${siteUrl("").replace(/\/$/, "")}?utm_source=github`,
  `- GitHub issue campaign: ${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=github-issue&utm_medium=organic&utm_campaign=zero_cost_push`,
  `- Public Gist campaign: ${siteUrl("upload-limit-fixer").replace(/\/$/, "")}?utm_source=gist&utm_medium=organic&utm_campaign=zero_cost_push`,
  `- Sponsor deal room campaign: ${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=distribution-pack`,
  `- Sponsor call campaign: ${siteUrl("sponsor-call").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_call&utm_content=distribution-pack`,
  `- Sponsor opportunities campaign: ${siteUrl("sponsor-opportunities").replace(/\/$/, "")}?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=sponsor_opportunities&utm_content=distribution-pack`,
  `- Sponsor intent feed JSON: ${fileUrl("sponsor-intent-feed.json")}`,
  `- Sponsor inquiry form campaign: ${siteUrl("sponsor").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_call&utm_content=distribution-pack#sponsor-inquiry`,
  `- Community campaign: ${siteUrl("").replace(/\/$/, "")}?utm_source=community`,
  `- Organic push kit campaign: ${siteUrl("organic-push-kit").replace(/\/$/, "")}?utm_source=distribution&utm_medium=organic&utm_campaign=organic_push_kit`,
  "",
  "## Ad-safe free-tool distribution",
  "",
  `- Free tool directory: ${siteUrl("free-pdf-tools")}?utm_source=distribution&utm_medium=organic&utm_campaign=free_tool_depth`,
  `- Upload limit fixer: ${siteUrl("upload-limit-fixer")}?utm_source=distribution&utm_medium=organic&utm_campaign=zero_cost_push`,
  `- Organic push kit: ${siteUrl("organic-push-kit")}?utm_source=distribution&utm_medium=organic&utm_campaign=organic_push_kit`,
  `- Organic push kit JSON: ${fileUrl("organic-push-kit.json")}`,
  `- Upload error cheatsheet: ${siteUrl("upload-error-cheatsheet")}?utm_source=distribution&utm_medium=organic&utm_campaign=upload_error_cheatsheet`,
  `- Upload error cheatsheet JSON: ${fileUrl("upload-error-cheatsheet.json")}`,
  `- Share kit JSON: ${fileUrl("share-kit.json")}`,
  "",
  "Rule: downloads stay free, ads are disabled until review, and future ads must never block file generation or downloads.",
  "",
  "## Sponsor and partner discovery",
  "",
  "Use these only where sponsor, partnership, directory, newsletter, or resource-page submissions are explicitly welcome. This is not a payment page; every inquiry still needs manual fit review and a separate external agreement or payment record before revenue is real.",
  "",
  `- Sponsor deal room: ${siteUrl("sponsor-deal-room")} - Direct pilot pricing, fit rules, tracked deal paths, and sponsor inquiry form.`,
  `- Sponsor deal room JSON: ${fileUrl("sponsor-deal-room.json")}`,
  ...SPONSOR_DEALS.map((deal) => `- ${deal.title}: ${deal.trackedUrl} - ${deal.price}; ${deal.bestFor}`),
  ...SPONSOR_DISCOVERY_LINKS.map((item) => `- ${item.title}: ${item.url} - ${item.reason}`),
  `- Sponsor opportunities board: ${siteUrl("sponsor-opportunities")} - Crawlable board for PDF API, QR, resume, classroom, and small-business sponsor categories.`,
  `- Sponsor opportunities JSON: ${fileUrl("sponsor-opportunities.json")}`,
  `- Sponsor intent feed JSON: ${fileUrl("sponsor-intent-feed.json")}`,
  `- Sponsor outreach pack JSON: ${fileUrl("sponsor-outreach-pack.json")}`,
  "",
  "Sponsor rules: downloads stay free, placements must be labeled, no misleading upload or finance offers, and no payment, tax, bank, phone, private identity, password, or customer-file details should be sent through the site.",
  "",
  "## Organic push tasks",
  "",
  "Use these as a small daily queue. Post only when the trigger is true; otherwise skip the task.",
  "",
  ...ORGANIC_PUSH_TASKS.map((task) => {
    const entry = organicPushTaskEntry(task);
    return `- ${entry.title}: ${entry.copy} Success signal: ${entry.successSignal}`;
  }),
  "",
  "## Upload error cheatsheet copy",
  "",
  "Use this when a directory, support thread, job seeker community, or small-business forum allows a useful resource link for file upload problems.",
  "",
  "PrintableTools Lab has a free upload error cheatsheet for common blocked-upload messages: PDF must be under 1MB or 500KB, image must be under 2MB or 500KB, photo under 100KB, JPG under 200KB, PNG screenshot too large, invalid JPG/PNG file type, 600 x 600 image dimensions, PDF not accepted JPG required, resume PDF too large, and email attachment too large.",
  "",
  `Resource page: ${siteUrl("upload-error-cheatsheet")}`,
  `Machine-readable JSON: ${fileUrl("upload-error-cheatsheet.json")}`,
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
  "- TechTools Launchpad no-login API listing; submitted on 2026-06-06 and live at https://techtools.cz/tools/launchpad/?tool=161",
  "- TechTools Upload Limit Fixer high-intent listing; submitted on 2026-06-06 and live at https://techtools.cz/tools/launchpad/?tool=162",
  "- TechTools Invoice Generator service-lead listing; submitted on 2026-06-08 and live at https://techtools.cz/tools/launchpad/?tool=168",
  "- TechTools Invoice Follow-up Copy Pack service listing; submitted on 2026-06-08 and live at https://techtools.cz/tools/launchpad/?tool=169",
  "- TechTools Invoice Follow-up Email Generator listing; submitted on 2026-06-08 and live at https://techtools.cz/tools/launchpad/?tool=170",
  "- TechTools Overdue Invoice Reminder Email listing; submitted on 2026-06-08 and live at https://techtools.cz/tools/launchpad/?tool=171",
  "- TechTools Upload Limit Fix Plan service listing; submitted on 2026-06-08 and live at https://techtools.cz/tools/launchpad/?tool=172",
  "- TechTools Upload Error Cheatsheet listing; submitted on 2026-06-08 and live at https://techtools.cz/tools/launchpad/?tool=173",
  "- TechTools Compress PDF to 1MB listing; submitted on 2026-06-08 and live at https://techtools.cz/tools/launchpad/?tool=174",
  "- TechTools PDF Under 1MB Upload Fix listing; submitted on 2026-06-08 and live at https://techtools.cz/tools/launchpad/?tool=175",
  "- TechTools Photo Under 100KB Upload Fix listing; submitted on 2026-06-08 and live at https://techtools.cz/tools/launchpad/?tool=176",
  "- TechTools Image Under 2MB Upload Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=177",
  "- TechTools JPG Under 200KB Upload Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=178",
  "- TechTools Resume PDF Too Large Upload Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=179",
  "- TechTools PNG Screenshot Too Large Upload Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=180",
  "- TechTools Passport Photo 50KB Upload Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=181",
  "- TechTools PDF Under 500KB Upload Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=182",
  "- TechTools Image Under 500KB Upload Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=183",
  "- TechTools Image Dimensions 600x600 Upload Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=184",
  "- TechTools PDF Not Accepted JPG Required Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=185",
  "- TechTools Email Attachment Too Large PDF Fix listing; submitted on 2026-06-09 and live at https://techtools.cz/tools/launchpad/?tool=186",
  "- NoSignupTools Upload Limit Fixer submission; submitted on 2026-06-08 through the public API and awaiting 24-48 hour manual review",
  "- NoSignupTools Upload Error Cheatsheet submission; submitted on 2026-06-08 through the public API and awaiting 24-48 hour manual review",
  "- NoSignupTools Image Dimensions 600x600 Upload Fix submission; submitted on 2026-06-09 through the public API and awaiting 24-48 hour manual review",
  "- NoSignupTools PDF Not Accepted JPG Required Fix submission; submitted on 2026-06-09 through the public API and awaiting 24-48 hour manual review",
  "- NoSignupTools Compress Image to KB submission; submitted on 2026-06-09 through the public API and awaiting 24-48 hour manual review",
  "- NoSignupTools Email Attachment Too Large Fix submission; submitted on 2026-06-09 through the public API and awaiting 24-48 hour manual review",
  "- FreeNoSignup Upload Limit Fixer submission; submitted on 2026-06-08 through the public Google Form and awaiting 3-5 business day manual review",
  "- FreeNoSignup Upload Error Cheatsheet submission; submitted on 2026-06-08 through the public Google Form and awaiting 3-5 business day manual review",
  "- NoSignupTools Overdue Invoice Reminder Email submission; submitted on 2026-06-08 through the public API and awaiting 24-48 hour manual review",
  "- FreeNoSignup Overdue Invoice Reminder Email submission; submitted on 2026-06-08 through the public Google Form and awaiting 3-5 business day manual review",
  "- NoLogin.tools free no-login/privacy tool submission; submitted on 2026-06-03 and monitoring confirms live at https://nologin.tools/tool/printable-tools-lab-pages-dev",
  "- NoLogin.tools Upload Limit Fixer high-intent submission; submitted on 2026-06-06 and monitoring confirms live at https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-limit-fixer",
  "- NoLogin.tools Upload Error Cheatsheet submission; submitted on 2026-06-08 and monitoring confirms live at https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-error-cheatsheet",
  "- NoLogin.tools Invoice Follow-up Email Generator submission; submitted on 2026-06-08 and monitoring confirms live at https://nologin.tools/tool/printable-tools-lab-pages-dev-tools-invoice-followup-email",
  "- NoLogin.tools Overdue Invoice Reminder Email submission; submitted on 2026-06-08 and monitoring confirms live at https://nologin.tools/tool/printable-tools-lab-pages-dev-overdue-invoice-reminder-email",
  "- NoLogin.tools Image Dimensions 600x600 Upload Fix submission; submitted on 2026-06-09 with slug printable-tools-lab-pages-dev-image-dimensions-600x600 and awaiting human review",
  "- NoLogin.tools PDF Not Accepted JPG Required Fix submission; submitted on 2026-06-09 with slug printable-tools-lab-pages-dev-pdf-not-accepted-jpg-required and awaiting human review",
  "- NoLogin.tools Email Attachment Too Large Fix submission; submitted on 2026-06-09 with slug printable-tools-lab-pages-dev-email-attachment-too-large and awaiting human review",
  "- NoSubscription.org free/open-source track; submitted on 2026-06-03 and awaiting slow review",
  "- FOSSHUNTER/open-source directories only when a normal public submit flow is available; do not bypass Cloudflare challenges or submit to directories that prohibit future ads/analytics",
  "- Reddit communities only when rules allow self-promotion and the tool directly solves a request",
  "- Startup/tool directories with free submissions",
  "- GitHub repository topics and README link",
  "",
  "## Rules",
  "",
  "- Never ask users to interact with ads.",
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

function buildDigitalProductPackages() {
  return DIGITAL_PRODUCTS.map((product) => {
    const fullFiles = localSellerKitFiles(product, false);
    const sampleFiles = localSellerKitFiles(product, true);
    const publicSamplePath = path.join(root, product.publicSamplePath);
    const publicRequestPath = path.join(root, product.publicRequestPath);
    const privatePackagePath = path.join(root, product.privatePackagePath);
    fs.mkdirSync(path.dirname(publicSamplePath), { recursive: true });
    fs.mkdirSync(path.dirname(privatePackagePath), { recursive: true });
    fs.writeFileSync(publicSamplePath, zipFromTextFiles(sampleFiles));
    fs.mkdirSync(path.dirname(publicRequestPath), { recursive: true });
    fs.writeFileSync(publicRequestPath, `${productCheckoutRequestCopy(product)}\n`);
    fs.writeFileSync(privatePackagePath, zipFromTextFiles(fullFiles));
    const report = {
      product: product.name,
      generatedAt: generatedAtIso,
      priceUsd: product.priceUsd,
      checkoutConfigured: Boolean(product.checkoutUrl),
      publicSample: {
        path: product.publicSamplePath,
        url: fileUrl(product.publicSamplePath),
        fileCount: Object.keys(sampleFiles).length,
        sizeBytes: fs.statSync(publicSamplePath).size,
        sha256: sha256File(publicSamplePath),
      },
      publicRequestTemplate: {
        path: product.publicRequestPath,
        url: fileUrl(product.publicRequestPath),
        sizeBytes: fs.statSync(publicRequestPath).size,
        sha256: sha256File(publicRequestPath),
      },
      privatePackage: {
        path: product.privatePackagePath,
        gitIgnored: true,
        fileCount: Object.keys(fullFiles).length,
        sizeBytes: fs.statSync(privatePackagePath).size,
        sha256: sha256File(privatePackagePath),
      },
      moneyGate: product.successGate,
      riskControls: product.riskControls,
    };
    const reportPath = path.join(root, product.packageReportPath);
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    return report;
  });
}

function buildPaidServiceAssets() {
  return PAID_SERVICES.map((service) => {
    const publicRequestPath = path.join(root, service.publicRequestPath);
    const paymentReplyPath = path.join(root, service.publicPaymentReplyPath);
    const fulfillmentChecklistPath = path.join(root, service.publicFulfillmentChecklistPath);
    const orderPipelinePath = path.join(root, service.publicOrderPipelinePath);
    const outreachQueuePath = path.join(root, service.publicOutreachQueuePath);
    const outreachBatchPath = path.join(root, service.publicOutreachBatchPath);
    const sampleDeliveryPath = path.join(root, service.publicSampleDeliveryPath);
    const deliveryInputExamplePath = path.join(root, service.publicDeliveryInputExamplePath);
    const deliveryReportPath = path.join(root, service.publicDeliveryReportPath);
    const deliveryInputExample = serviceDeliveryInputExample(service);
    const sampleDeliveryZip = zipServiceDelivery(deliveryInputExample, { sample: true });
    fs.mkdirSync(path.dirname(publicRequestPath), { recursive: true });
    fs.mkdirSync(path.dirname(deliveryReportPath), { recursive: true });
    fs.writeFileSync(publicRequestPath, `${serviceRequestCopy(service)}\n`);
    fs.writeFileSync(paymentReplyPath, `${servicePaymentReplyCopy(service)}\n`);
    fs.writeFileSync(fulfillmentChecklistPath, `${serviceFulfillmentChecklistCopy(service)}\n`);
    fs.writeFileSync(orderPipelinePath, `${JSON.stringify(serviceOrderPipeline(service), null, 2)}\n`);
    fs.writeFileSync(outreachQueuePath, `${JSON.stringify(serviceOutreachQueue(service), null, 2)}\n`);
    fs.writeFileSync(outreachBatchPath, `${serviceOutreachBatchCopy(service)}\n`);
    fs.writeFileSync(deliveryInputExamplePath, `${JSON.stringify(deliveryInputExample, null, 2)}\n`);
    fs.writeFileSync(sampleDeliveryPath, sampleDeliveryZip);
    const deliveryReport = {
      service: service.name,
      generatedAt: generatedAtIso,
      sampleOnly: true,
      sampleDelivery: {
        path: service.publicSampleDeliveryPath,
        url: fileUrl(service.publicSampleDeliveryPath),
        sizeBytes: fs.statSync(sampleDeliveryPath).size,
        sha256: sha256File(sampleDeliveryPath),
      },
      deliveryInputExample: {
        path: service.publicDeliveryInputExamplePath,
        url: fileUrl(service.publicDeliveryInputExamplePath),
        sizeBytes: fs.statSync(deliveryInputExamplePath).size,
        sha256: sha256File(deliveryInputExamplePath),
      },
      privateDeliveryCommand: "npm.cmd run service:delivery -- --input path/to/paid-order.json",
      privateDeliveryOutput: "paid-deliverables/service-orders/<order-id>.zip",
      moneyGate: service.successGate,
      buyerReviewRequired: true,
    };
    fs.writeFileSync(deliveryReportPath, `${JSON.stringify(deliveryReport, null, 2)}\n`);
    return {
      service: service.name,
      generatedAt: generatedAtIso,
      requestTemplate: {
        path: service.publicRequestPath,
        url: fileUrl(service.publicRequestPath),
        sizeBytes: fs.statSync(publicRequestPath).size,
        sha256: sha256File(publicRequestPath),
      },
      paymentReplyTemplate: {
        path: service.publicPaymentReplyPath,
        url: fileUrl(service.publicPaymentReplyPath),
        sizeBytes: fs.statSync(paymentReplyPath).size,
        sha256: sha256File(paymentReplyPath),
      },
      fulfillmentChecklist: {
        path: service.publicFulfillmentChecklistPath,
        url: fileUrl(service.publicFulfillmentChecklistPath),
        sizeBytes: fs.statSync(fulfillmentChecklistPath).size,
        sha256: sha256File(fulfillmentChecklistPath),
      },
      orderPipeline: {
        path: service.publicOrderPipelinePath,
        url: fileUrl(service.publicOrderPipelinePath),
        sizeBytes: fs.statSync(orderPipelinePath).size,
        sha256: sha256File(orderPipelinePath),
      },
      outreachQueue: {
        path: service.publicOutreachQueuePath,
        url: fileUrl(service.publicOutreachQueuePath),
        sizeBytes: fs.statSync(outreachQueuePath).size,
        sha256: sha256File(outreachQueuePath),
      },
      outreachBatch: {
        path: service.publicOutreachBatchPath,
        url: fileUrl(service.publicOutreachBatchPath),
        sizeBytes: fs.statSync(outreachBatchPath).size,
        sha256: sha256File(outreachBatchPath),
      },
      sampleDelivery: deliveryReport.sampleDelivery,
      deliveryInputExample: deliveryReport.deliveryInputExample,
      deliveryReport: {
        path: service.publicDeliveryReportPath,
        url: fileUrl(service.publicDeliveryReportPath),
        sizeBytes: fs.statSync(deliveryReportPath).size,
        sha256: sha256File(deliveryReportPath),
      },
      moneyGate: service.successGate,
      riskControls: service.riskControls,
    };
  });
}

function buildAuditLeadMagnetAssets() {
  const audit = MARKET_TABLE_PRINT_AUDIT;
  const publicRequestPath = path.join(root, audit.publicRequestPath);
  const publicChecklistPath = path.join(root, audit.publicChecklistPath);
  fs.mkdirSync(path.dirname(publicRequestPath), { recursive: true });
  fs.writeFileSync(publicRequestPath, `${marketTableAuditRequestCopy(audit)}\n`);
  fs.writeFileSync(publicChecklistPath, `${JSON.stringify(marketTableAuditChecklist(audit), null, 2)}\n`);
  return {
    id: audit.id,
    generatedAt: generatedAtIso,
    requestTemplate: {
      path: audit.publicRequestPath,
      url: fileUrl(audit.publicRequestPath),
      sizeBytes: fs.statSync(publicRequestPath).size,
      sha256: sha256File(publicRequestPath),
    },
    checklist: {
      path: audit.publicChecklistPath,
      url: fileUrl(audit.publicChecklistPath),
      sizeBytes: fs.statSync(publicChecklistPath).size,
      sha256: sha256File(publicChecklistPath),
    },
    moneyGate: audit.moneyGate,
    upgradeService: CUSTOM_LOCAL_PRINT_PACK_SERVICE.id,
  };
}

function localSellerKitFiles(product, sampleOnly) {
  const prefix = sampleOnly ? "local-seller-starter-kit-sample" : "local-seller-starter-kit";
  const files = {
    [`${prefix}/README.md`]: [
      `# ${product.name}${sampleOnly ? " Sample" : ""}`,
      "",
      product.shortDescription,
      "",
      "## How to use",
      "",
      "1. Open the CSV files in any spreadsheet app.",
      "2. Edit the placeholder business, product, offer, and date fields.",
      "3. Paste rows into the matching PrintableTools Lab generators for price tags, coupons, flyers, QR signs, packing slips, inventory sheets, and business cards.",
      "4. Print a small batch, test it at the table or with one customer, then adjust wording before printing more.",
      "",
      sampleOnly ? "This sample shows the structure of the paid kit. The paid ZIP adds the full 30-day calendar, more rows, more copy variants, and the commercial-use license." : "The included license lets the buyer use these templates inside their own business or event workflow, but not resell the kit itself.",
    ].join("\n"),
    [`${prefix}/sample-price-tags.csv`]: [
      "item,price,sku,note",
      "Handmade soap,$6,SOAP-001,Market table tester",
      "Custom keychain,$9,KEY-002,Ask about bundle pricing",
      "Mini print,$12,ART-003,Two for $20",
    ].join("\n"),
    [`${prefix}/sample-coupon-offers.csv`]: [
      "offer,code,expiration,fine_print",
      "10% off your first local order,WELCOME10,End of this month,Valid for one purchase from this seller",
      "Buy 2 small items get $3 off,TABLE3,Market day only,Not combinable with other offers",
      "Free local pickup bonus,PICKUP,This week,Available within the listed pickup area",
    ].join("\n"),
    [`${prefix}/flyer-and-qr-sign-copy.md`]: [
      "# Flyer and QR sign copy",
      "",
      "## Table sign",
      "",
      "Scan for today's menu, prices, custom order form, or booking page.",
      "",
      "## Local service flyer",
      "",
      "Need a quick fix before the weekend? Message us for available times, simple pricing, and local pickup or appointment details.",
      "",
      "## Product photo note",
      "",
      "Use the free QR, flyer, coupon, and price-tag tools to turn this copy into printable PDFs.",
    ].join("\n"),
  };
  if (!sampleOnly) {
    Object.assign(files, {
      [`${prefix}/30-day-local-promo-calendar.csv`]: [
        "day,channel,action,copy_prompt,success_signal",
        "1,market table,print QR sign,Point visitors to order form,One scan or one question",
        "2,Instagram,post product photo,Show best-seller and pickup window,One profile visit",
        "3,local group,reply helpfully,Answer a relevant recommendation request,One useful reply",
        "4,email/text,send coupon,Offer first-order discount to warm leads,One response",
        "5,market table,test price tags,Use clear price and bundle note,One customer notices bundle",
        "6,packing,add insert,Add reorder QR or thank-you line,One repeat inquiry",
        "7,review,measure,Count orders questions scans and clicks,Keep only working copy",
        "8,flyer,print mini batch,Place where posting is allowed,One scan",
        "9,short video,show process,Before/after or packing order,One save or question",
        "10,local partner,ask swap,Leave small cards with a nearby business,One accepted placement",
        "11,market table,offer bundle,Two-item bundle with visible savings,One bundle sold",
        "12,listing,refresh title,Lead with use case and pickup area,One listing view increase",
        "13,customer follow-up,send reorder note,Thank buyer and offer reorder window,One reply",
        "14,review,measure,Compare best source and best offer,Repeat winner next week",
        "15,event,seasonal angle,Match upcoming holiday or local event,One share",
        "16,photo,retake best item,Simple background and clear label,One click",
        "17,coupon,test expiry,Market-day-only coupon,One redemption",
        "18,QR sign,test CTA,Scan for custom colors or sizes,One scan",
        "19,community,helpful comment,Share setup tip without spamming,One positive response",
        "20,packing,insert QR,Add care or reorder link,One scan",
        "21,review,measure,Drop weak channel,One clear next action",
        "22,flyer,small batch,Print only 10 and test,One inquiry",
        "23,market table,price anchor,Show popular under-$10 item,One add-on",
        "24,listing,FAQ update,Answer top buyer objection,One fewer repeated question",
        "25,email/text,limited batch,Announce small restock,One preorder",
        "26,partner,local bundle,Pair service and product,One partner reply",
        "27,short video,pack order,Show packaging and pickup,One message",
        "28,review,measure,Pick next month's winner,One repeatable channel",
        "29,cleanup,archive assets,Save winning copy and tag rows,Ready next month",
        "30,relaunch,repeat winner,Use best offer and channel again,One sale or qualified lead",
      ].join("\n"),
      [`${prefix}/packing-slip-batch.csv`]: [
        "order_id,customer,item,quantity,note",
        "1001,Sample Customer,Handmade soap,2,Thank you for buying local",
        "1002,Sample Customer,Mini print,1,Keep flat and dry",
        "1003,Sample Customer,Custom keychain,3,Custom colors confirmed",
        "1004,Sample Customer,Gift bundle,1,Include coupon insert",
      ].join("\n"),
      [`${prefix}/inventory-starter.csv`]: [
        "sku,item,starting_qty,sold,remaining,reorder_point",
        "SOAP-001,Handmade soap,24,0,24,6",
        "KEY-002,Custom keychain,18,0,18,5",
        "ART-003,Mini print,30,0,30,8",
        "BND-004,Gift bundle,10,0,10,3",
      ].join("\n"),
      [`${prefix}/market-day-checklist.md`]: [
        "# Market-day checklist",
        "",
        "## Before",
        "- Print price tags, QR sign, coupon sheet, and packing slips.",
        "- Pack tape, pen, receipt copy, backup QR sign, and small bills if needed.",
        "- Test the QR code on a phone that is not logged into your own account.",
        "",
        "## During",
        "- Count questions about price, custom options, pickup, and bundles.",
        "- Put the easiest offer at eye level.",
        "- Write down exact customer phrases for later listing copy.",
        "",
        "## After",
        "- Count sold items and update inventory.",
        "- Keep only offers that got questions, scans, or sales.",
        "- Send follow-up messages only to people who asked for them.",
      ].join("\n"),
      [`${prefix}/checkout-listing-copy.md`]: [
        "# Product listing copy",
        "",
        "## Title",
        "Local Seller Starter Kit: editable market table, coupon, price tag, packing, and promo templates",
        "",
        "## Short description",
        product.shortDescription,
        "",
        "## What is included",
        ...product.contents.map((item) => `- ${item}`),
        "",
        "## Delivery",
        "Instant ZIP download after payment through the checkout provider.",
        "",
        "## License",
        "Use inside your own business, table, shop, class, or event. Do not resell or redistribute the kit itself.",
      ].join("\n"),
      [`${prefix}/payment-provider-setup.md`]: [
        "# Payment provider setup",
        "",
        "Use one real external checkout product. Do not paste payout, tax, card, bank, or account credentials into this repository.",
        "",
        "## Product fields",
        "",
        `Product name: ${product.name}`,
        `Price: $${product.priceUsd} ${product.currency}`,
        `Upload file: ${product.privatePackagePath}`,
        `Public sample: ${siteUrl(product.publicSamplePath).replace(/\/$/, "")}`,
        `Buyer request link while checkout is pending: ${productCheckoutRequestUrl(product)}`,
        "",
        "## Short description",
        "",
        product.shortDescription,
        "",
        "## Buyer delivery note",
        "",
        "Instant ZIP download after payment. The ZIP includes editable CSV, Markdown, HTML, and text templates for the buyer's own local-selling workflow.",
        "",
        "## Refund and support note",
        "",
        "Because this is a digital download, review the sample ZIP before buying. If the delivered ZIP cannot be opened, reply through the checkout provider with the order email and a replacement link can be sent.",
        "",
        "## Publish checklist",
        "",
        "- Upload the full ZIP from paid-deliverables.",
        "- Paste the short description and license note.",
        "- Set the price to 9 USD.",
        "- Make delivery instant after payment.",
        "- Copy the public checkout URL into site-config.js with npm run configure:checkout.",
        "- Run npm run build:routes and npm run verify:seo before promoting.",
      ].join("\n"),
      [`${prefix}/buyer-request-template.txt`]: productCheckoutRequestCopy(product),
      [`${prefix}/LICENSE.txt`]: [
        `${product.name} Commercial-Use License`,
        "",
        "The buyer may edit, print, and use these templates inside their own business, market table, local service, class, workshop, or event workflow.",
        "The buyer may not resell, redistribute, sublicense, publish, or repackage the kit files as a competing template product.",
        "No legal, tax, accounting, employment, or financial advice is included.",
      ].join("\n"),
      [`${prefix}/print-preview.html`]: [
        "<!doctype html>",
        "<html lang=\"en\"><head><meta charset=\"utf-8\"><title>Local Seller Starter Kit Preview</title>",
        "<style>body{font-family:Arial,sans-serif;margin:32px;color:#17313b}section{border:1px solid #d9e4e8;padding:18px;margin:0 0 16px}.tag{display:inline-block;border:1px solid #17313b;padding:10px 16px;margin:6px}</style></head><body>",
        "<h1>Local Seller Starter Kit Preview</h1>",
        "<section><h2>Price tags</h2><span class=\"tag\">Handmade soap - $6</span><span class=\"tag\">Mini print - $12</span><span class=\"tag\">Bundle - $20</span></section>",
        "<section><h2>QR sign copy</h2><p>Scan for custom orders, pickup details, and today's market-only offer.</p></section>",
        "<section><h2>Coupon copy</h2><p>Use code WELCOME10 for 10% off your first local order.</p></section>",
        "</body></html>",
      ].join("\n"),
    });
  }
  return files;
}

function zipFromTextFiles(files) {
  return Buffer.from(zipSync(Object.fromEntries(Object.entries(files).map(([name, content]) => [name, strToU8(`${content}\n`)])), { level: 9 }));
}

function sha256File(filePath) {
  return require("crypto").createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function digitalProductEntry(product) {
  const report = digitalProductPackages.find((item) => item.product === product.name);
  return {
    id: product.id,
    name: product.name,
    description: product.shortDescription,
    url: siteUrl(product.slug),
    priceUsd: product.priceUsd,
    currency: product.currency,
    checkoutConfigured: Boolean(product.checkoutUrl),
    checkoutUrl: product.checkoutUrl,
    checkoutRequestUrl: productCheckoutRequestUrl(product),
    checkoutEmailUrl: productCheckoutEmailUrl(product),
    sampleUrl: fileUrl(product.publicSamplePath),
    requestTemplateUrl: fileUrl(product.publicRequestPath),
    packageReportUrl: fileUrl(product.packageReportPath),
    privatePackagePath: product.privatePackagePath,
    privatePackageReady: Boolean(report?.privatePackage?.sizeBytes),
    privatePackageSha256: report?.privatePackage?.sha256 || "",
    contents: product.contents,
    freeTools: product.freeTools.map((toolPath) => siteUrl(toolPath)),
    riskControls: product.riskControls,
    successGate: product.successGate,
  };
}

function paidServiceEntry(service) {
  const report = paidServiceAssets.find((item) => item.service === service.name);
  const githubPagesServiceUrl = SERVICE_SALES_PACK.serviceId === service.id ? SERVICE_SALES_PACK.githubPagesServiceUrl : "";
  return {
    id: service.id,
    name: service.name,
    description: service.shortDescription,
    url: githubPagesServiceUrl || siteUrl(service.slug),
    mainSiteFallbackUrl: siteUrl(service.slug),
    githubPagesServiceUrl,
    priceUsd: service.priceUsd,
    currency: service.currency,
    requestUrl: serviceRequestUrl(service),
    issueFormUrl: service.issueFormUrl,
    requestEmailUrl: serviceRequestEmailUrl(service),
    requestTemplateUrl: fileUrl(service.publicRequestPath),
    requestTemplateSha256: report?.requestTemplate?.sha256 || "",
    paymentReplyTemplateUrl: fileUrl(service.publicPaymentReplyPath),
    paymentReplyTemplateSha256: report?.paymentReplyTemplate?.sha256 || "",
    fulfillmentChecklistUrl: fileUrl(service.publicFulfillmentChecklistPath),
    fulfillmentChecklistSha256: report?.fulfillmentChecklist?.sha256 || "",
    orderPipelineUrl: fileUrl(service.publicOrderPipelinePath),
    orderPipelineSha256: report?.orderPipeline?.sha256 || "",
    orderPipeline: serviceOrderPipeline(service).statuses,
    outreachQueueUrl: fileUrl(service.publicOutreachQueuePath),
    outreachQueueSha256: report?.outreachQueue?.sha256 || "",
    outreachBatchUrl: fileUrl(service.publicOutreachBatchPath),
    outreachBatchSha256: report?.outreachBatch?.sha256 || "",
    outreachQueue: serviceOutreachQueue(service).batch,
    sampleDeliveryUrl: fileUrl(service.publicSampleDeliveryPath),
    sampleDeliverySha256: report?.sampleDelivery?.sha256 || "",
    deliveryInputExampleUrl: fileUrl(service.publicDeliveryInputExamplePath),
    deliveryInputExampleSha256: report?.deliveryInputExample?.sha256 || "",
    deliveryReportUrl: fileUrl(service.publicDeliveryReportPath),
    deliveryReportSha256: report?.deliveryReport?.sha256 || "",
    privateDeliveryCommand: "npm.cmd run service:delivery -- --input path/to/paid-order.json",
    turnaround: service.turnaround,
    deliverables: service.deliverables,
    buyerInputs: service.buyerInputs,
    relatedTools: service.relatedTools.map((toolPath) => siteUrl(toolPath)),
    riskControls: service.riskControls,
    successGate: service.successGate,
  };
}

function serviceSalesPackEntry() {
  return {
    id: SERVICE_SALES_PACK.id,
    name: SERVICE_SALES_PACK.name,
    description: SERVICE_SALES_PACK.shortDescription,
    pageUrl: siteUrl(SERVICE_SALES_PACK.slug),
    serviceUrl: SERVICE_SALES_PACK.serviceUrl,
    mainSiteFallbackUrl: SERVICE_SALES_PACK.mainSiteFallbackUrl,
    githubPagesServiceUrl: SERVICE_SALES_PACK.githubPagesServiceUrl,
    requestBriefUrl: SERVICE_SALES_PACK.requestBriefUrl,
    githubPagesRequestBriefUrl: SERVICE_SALES_PACK.githubPagesRequestBriefUrl,
    issueFormUrl: SERVICE_SALES_PACK.issueFormUrl,
    paymentReplyUrl: SERVICE_SALES_PACK.paymentReplyUrl,
    githubPagesPaymentReplyUrl: SERVICE_SALES_PACK.githubPagesPaymentReplyUrl,
    fulfillmentChecklistUrl: SERVICE_SALES_PACK.fulfillmentChecklistUrl,
    githubPagesFulfillmentChecklistUrl: SERVICE_SALES_PACK.githubPagesFulfillmentChecklistUrl,
    orderPipelineUrl: SERVICE_SALES_PACK.orderPipelineUrl,
    githubPagesOrderPipelineUrl: SERVICE_SALES_PACK.githubPagesOrderPipelineUrl,
    orderPipeline: serviceOrderPipeline(CUSTOM_LOCAL_PRINT_PACK_SERVICE).statuses,
    outreachQueueUrl: SERVICE_SALES_PACK.outreachQueueUrl,
    githubPagesOutreachQueueUrl: SERVICE_SALES_PACK.githubPagesOutreachQueueUrl,
    outreachBatchUrl: SERVICE_SALES_PACK.outreachBatchUrl,
    githubPagesOutreachBatchUrl: SERVICE_SALES_PACK.githubPagesOutreachBatchUrl,
    outreachQueue: serviceOutreachQueue(CUSTOM_LOCAL_PRINT_PACK_SERVICE).batch,
    sampleDeliveryUrl: SERVICE_SALES_PACK.sampleDeliveryUrl,
    githubPagesSampleDeliveryUrl: SERVICE_SALES_PACK.githubPagesSampleDeliveryUrl,
    deliveryInputExampleUrl: SERVICE_SALES_PACK.deliveryInputExampleUrl,
    githubPagesDeliveryInputExampleUrl: SERVICE_SALES_PACK.githubPagesDeliveryInputExampleUrl,
    deliveryReportUrl: SERVICE_SALES_PACK.deliveryReportUrl,
    githubPagesDeliveryReportUrl: SERVICE_SALES_PACK.githubPagesDeliveryReportUrl,
    privateDeliveryCommand: "npm.cmd run service:delivery -- --input path/to/paid-order.json",
    leadMagnet: marketTablePrintAuditEntry(),
    audience: SERVICE_SALES_PACK.audience,
    trackedLinks: SERVICE_SALES_PACK.trackedLinks.map(([label, url]) => ({ label, url })),
    outreachScripts: SERVICE_SALES_PACK.outreachScripts,
    listingFields: SERVICE_SALES_PACK.listingFields.map(([label, value]) => ({ label, value })),
    executionChecklist: SERVICE_SALES_PACK.executionChecklist,
    riskControls: SERVICE_SALES_PACK.riskControls,
  };
}

function marketTablePrintAuditEntry() {
  const report = auditLeadMagnetAssets;
  return {
    id: MARKET_TABLE_PRINT_AUDIT.id,
    name: MARKET_TABLE_PRINT_AUDIT.name,
    description: MARKET_TABLE_PRINT_AUDIT.shortDescription,
    pageUrl: siteUrl(MARKET_TABLE_PRINT_AUDIT.slug),
    githubPagesUrl: MARKET_TABLE_PRINT_AUDIT.githubPagesUrl,
    requestUrl: marketTableAuditRequestUrl(MARKET_TABLE_PRINT_AUDIT),
    issueFormUrl: MARKET_TABLE_PRINT_AUDIT.issueFormUrl,
    requestTemplateUrl: fileUrl(MARKET_TABLE_PRINT_AUDIT.publicRequestPath),
    requestTemplateSha256: report?.requestTemplate?.sha256 || "",
    githubPagesRequestTemplateUrl: MARKET_TABLE_PRINT_AUDIT.githubPagesRequestUrl,
    checklistUrl: fileUrl(MARKET_TABLE_PRINT_AUDIT.publicChecklistPath),
    checklistSha256: report?.checklist?.sha256 || "",
    githubPagesChecklistUrl: MARKET_TABLE_PRINT_AUDIT.githubPagesChecklistUrl,
    upgradeServiceUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug),
    githubPagesUpgradeServiceUrl: MARKET_TABLE_PRINT_AUDIT.upgradeServiceUrl,
    targetAudience: MARKET_TABLE_PRINT_AUDIT.targetAudience,
    auditQuestions: MARKET_TABLE_PRINT_AUDIT.auditQuestions,
    statuses: MARKET_TABLE_PRINT_AUDIT.statuses,
    freeTools: MARKET_TABLE_PRINT_AUDIT.freeToolPaths.map((toolPath) => siteUrl(toolPath)),
    riskControls: MARKET_TABLE_PRINT_AUDIT.riskControls,
    moneyGate: MARKET_TABLE_PRINT_AUDIT.moneyGate,
  };
}

function uploadErrorEntry(item) {
  const pageUrl = siteUrl(item.landingPath);
  const trackedUrl = `${pageUrl.replace(/\/$/, "")}?utm_source=upload-error-cheatsheet&utm_medium=organic&utm_campaign=upload_error_cheatsheet`;
  return {
    errorText: item.errorText,
    problem: item.problem,
    response: item.response,
    format: item.format,
    target: item.target,
    landingPage: pageUrl,
    trackedUrl,
    toolUrl: liveToolUrl(item.toolPath),
  };
}

function organicPushTaskEntry(task) {
  const baseUrl = task.absoluteUrl || siteUrl(task.linkPath);
  const tracked = new URL(baseUrl);
  tracked.searchParams.set("utm_source", task.utmSource || task.channel);
  tracked.searchParams.set("utm_medium", "organic");
  tracked.searchParams.set("utm_campaign", task.campaign);
  tracked.searchParams.set("utm_content", task.id);
  const trackedUrl = tracked.toString();
  return {
    id: task.id,
    channel: task.channel,
    title: task.title,
    trigger: task.trigger,
    trackedUrl,
    copy: task.copy.replace("{url}", trackedUrl),
    successSignal: task.successSignal,
    riskRule: task.riskRule,
  };
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
  const tracked = new URL(base);
  tracked.searchParams.set("utm_source", post.channel);
  tracked.searchParams.set("utm_medium", "organic");
  if (post.campaign) tracked.searchParams.set("utm_campaign", post.campaign);
  if (post.content) tracked.searchParams.set("utm_content", post.content);
  return tracked.toString();
}

function gameSubmissionFeedEntry(game) {
  return {
    name: game.name,
    summary: game.summary,
    playUrl: game.url,
    repositoryUrl: game.repo,
    releaseUrl: game.releaseUrl,
    html5ZipUrl: game.zipUrl,
    cleanPortalZipUrl: game.cleanZipUrl,
    cleanPackageReportUrl: game.cleanPackageReportUrl,
    gameSnacksZipUrl: game.gameSnacksZipUrl || "",
    gameSnacksPackageReportUrl: game.gameSnacksPackageReportUrl || "",
    gameSnacksVerificationUrl: game.gameSnacksVerificationUrl || "",
    demoVideoUrl: game.demoVideoUrl,
    iconUrl: game.iconUrl,
    coverUrl: game.coverUrl,
    socialCardUrl: game.socialCardUrl,
    submissionNotesUrl: game.submissionNotesUrl,
    submissionCopyUrl: game.submissionCopyUrl,
    reviewReadinessUrl: game.reviewReadinessUrl,
    safeForPublicSubmission: true,
    monetizationNote: "Standalone builds do not force ads. Platform ad calls are gated to approved platform contexts and natural breaks.",
  };
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
