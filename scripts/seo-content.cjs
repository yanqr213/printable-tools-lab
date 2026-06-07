const BASE_URL = (process.env.PUBLIC_SITE_URL || "https://printable-tools-lab.pages.dev").replace(/\/+$/, "");
const fs = require("fs");
const path = require("path");

const SITE_SUMMARY = {
  name: "PrintableTools Lab",
  description: "Free browser-based PDF generators, no-upload PDF tools, local image tools, PDF compression, background removal for simple image backgrounds, text overlays for images, passport photo sizing, transparent signature PNG generation, static QR code tools, and text-data converters for compressing PDFs, compressing images, compressing images to target KB sizes, resizing images, converting image formats, removing solid image backgrounds, cropping images, rotating images, watermarking images, adding text to photos, creating passport-style photos, creating signature images, creating QR codes, creating WiFi QR codes, creating contact QR codes, converting PDF pages to JPG or PNG images, extracting PDF text, converting selectable PDF text to Word DOCX, merging PDFs, splitting PDFs, rotating pages, removing pages, reordering pages, watermarking PDFs, stamping PDFs, adding typed signatures, adding page numbers, image-to-PDF conversion, text conversion, Markdown-to-PDF, CSV-to-PDF, JSON-to-PDF, invoices, receipts, labels, business cards, timesheets, resumes, certificates, worksheets, graph paper, sign-in sheets, packing lists, to-do lists, and habit trackers.",
  audience: "Freelancers, small businesses, local sellers, event organizers, job seekers, parents, teachers, tutors, homeschool families, students, travelers, tenants, landlords, household planners, cafe operators, booth exhibitors, rental hosts, and office admins.",
  monetization: "Free tools stay live for search demand and future display ads. Ads remain disabled until policy readiness, traffic quality, and ad slots are configured, and downloads must never require an ad click or payment.",
};

const LOCAL_SELLER_STARTER_KIT = {
  id: "local-seller-starter-kit",
  slug: "local-seller-starter-kit",
  name: "Local Seller Starter Kit",
  headline: "Local Seller Starter Kit for market tables, services, and small orders",
  shortDescription: "A checkout-ready digital pack of editable local-selling templates: price tags, coupon copy, packing slips, QR sign wording, inventory starters, promo posts, and market-day checklists.",
  description: "Sell a simple digital operations kit to people who already use invoice, receipt, price tag, flyer, coupon, business card, packing slip, and inventory tools. The product is intentionally small, practical, and low-risk: buyers get editable files they can use for their own local business or event table.",
  priceUsd: 9,
  currency: "USD",
  checkoutUrl: configuredCheckoutUrl(),
  contactEmail: configuredContactEmail(),
  publicSamplePath: "assets/digital-products/local-seller-starter-kit-sample.zip",
  publicRequestPath: "assets/digital-products/local-seller-starter-kit-buy-request.txt",
  privatePackagePath: "paid-deliverables/local-seller-starter-kit.zip",
  packageReportPath: "reports/local-seller-starter-kit-package.json",
  audience: [
    "craft fair and market table sellers",
    "local service providers",
    "small online sellers who need packing and promo templates",
    "pop-up class, workshop, or neighborhood event organizers",
  ],
  contents: [
    "30-day local promo calendar CSV",
    "price tag and SKU starter CSV",
    "coupon offer and fine-print examples",
    "packing slip batch CSV",
    "inventory starter sheet",
    "flyer and QR sign copy bank",
    "market-day checklist",
    "product listing copy for Gumroad, Payhip, Ko-fi, or Stripe Payment Links",
    "checkout publishing checklist and buyer request template",
    "simple commercial-use license for the buyer's own business",
  ],
  freeTools: [
    "tools/invoice-generator",
    "tools/receipt-generator",
    "tools/price-tag",
    "tools/flyer-maker",
    "tools/coupon-maker",
    "tools/packing-slip",
    "tools/business-card",
    "tools/inventory-sheet",
    "tools/qr-code",
  ],
  riskControls: [
    "No private payout, tax, bank, card, or platform credential is stored in the repository.",
    "The full paid ZIP is generated locally under paid-deliverables and is ignored by git.",
    "The public site exposes a sample ZIP and checkout status, not fake purchase or fake revenue claims.",
    "Buyers are licensed to use the templates for their own business, not to resell the kit itself.",
  ],
  successGate: "Revenue is proven only after a real payment provider shows a paid order, payout balance, or settled payment for this kit.",
};

const DIGITAL_PRODUCTS = [LOCAL_SELLER_STARTER_KIT];

const CUSTOM_LOCAL_PRINT_PACK_SERVICE = {
  id: "custom-local-print-pack",
  slug: "custom-local-print-pack",
  name: "Custom Local Print Pack Setup",
  headline: "Custom Local Print Pack Setup for local sellers who want it done for them",
  shortDescription: "A $29 done-for-you setup request for one simple printable seller pack: price tags, flyer copy, QR sign text, coupon wording, packing slip starter rows, and a one-page launch checklist.",
  description: "A lightweight service offer for buyers who like the free generators but do not want to assemble the first local-selling print pack themselves. The buyer sends product, service, or event details; the seller returns editable starter content that can be pasted into the PrintableTools Lab generators and printed.",
  priceUsd: 29,
  currency: "USD",
  contactEmail: configuredContactEmail(),
  publicRequestPath: "assets/services/custom-local-print-pack-request.txt",
  publicPaymentReplyPath: "assets/services/custom-local-print-pack-payment-reply.txt",
  publicFulfillmentChecklistPath: "assets/services/custom-local-print-pack-fulfillment-checklist.txt",
  publicOrderPipelinePath: "assets/services/custom-local-print-pack-order-pipeline.json",
  publicOutreachQueuePath: "assets/services/custom-local-print-pack-outreach-queue.json",
  publicOutreachBatchPath: "assets/services/custom-local-print-pack-outreach-batch.txt",
  publicSampleDeliveryPath: "assets/services/custom-local-print-pack-sample-delivery.zip",
  publicDeliveryInputExamplePath: "assets/services/custom-local-print-pack-delivery-input.example.json",
  publicDeliveryReportPath: "reports/custom-local-print-pack-sample-delivery.json",
  issueTemplatePath: ".github/ISSUE_TEMPLATE/custom-local-print-pack-service.yml",
  issueFormUrl: "https://github.com/yanqr213/printable-tools-lab/issues/new?template=custom-local-print-pack-service.yml",
  turnaround: "Target delivery is 2 business days after real payment and complete buyer details.",
  deliverables: [
    "price tag starter CSV for up to 12 items",
    "one small flyer copy draft",
    "QR sign wording for one link or contact method",
    "three coupon or bundle offer ideas",
    "packing slip or pickup note starter rows",
    "one-page launch checklist for printing and first outreach",
  ],
  buyerInputs: [
    "business, event, booth, or service name",
    "up to 12 items or services with prices",
    "one URL, social profile, phone, or email to turn into QR sign wording",
    "preferred style: clean, cute, bold, minimal, local, premium, or practical",
    "any words, claims, or offers to avoid",
  ],
  relatedTools: [
    "tools/price-tag",
    "tools/flyer-maker",
    "tools/coupon-maker",
    "tools/packing-slip",
    "tools/business-card",
    "tools/qr-code",
  ],
  riskControls: [
    "The service does not start until a real external payment link is sent and paid.",
    "No payout, tax, bank, card, identity, or platform credential is stored in the repository.",
    "The buyer must review all copy, prices, QR links, and claims before printing or publishing.",
    "No legal, tax, accounting, employment, medical, or financial advice is included.",
    "One lightweight revision is included for typos or fit; new branding, logo design, or legal copy is out of scope.",
  ],
  successGate: "Revenue is proven only after a real payment provider shows a paid order, payout balance, or settled payment for this service.",
};

const PAID_SERVICES = [CUSTOM_LOCAL_PRINT_PACK_SERVICE];

const MARKET_TABLE_PRINT_AUDIT = {
  id: "market-table-print-audit",
  slug: "market-table-print-audit",
  name: "Free Market Table Print Audit",
  headline: "Free Market Table Print Audit for local sellers",
  shortDescription: "A free public-safe checklist request that helps craft sellers, market tables, home bakers, and local services spot missing price tags, QR signs, flyer copy, coupon wording, and pickup notes before upgrading to the $29 setup.",
  description: "A low-friction lead magnet for sellers who are not ready to buy the done-for-you pack yet. The visitor answers a few public-safe questions about their table, menu, price list, QR/contact flow, and current print pieces; the response can point them to free generators first and the $29 Custom Local Print Pack Setup only if they want the first pack assembled for them.",
  publicRequestPath: "assets/services/market-table-print-audit-request.txt",
  publicChecklistPath: "assets/services/market-table-print-audit-checklist.json",
  issueTemplatePath: ".github/ISSUE_TEMPLATE/market-table-print-audit.yml",
  issueFormUrl: "https://github.com/yanqr213/printable-tools-lab/issues/new?template=market-table-print-audit.yml",
  githubPagesUrl: "https://yanqr213.github.io/printable-tools-lab/market-table-print-audit/",
  githubPagesRequestUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/market-table-print-audit-request.txt",
  githubPagesChecklistUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/market-table-print-audit-checklist.json",
  upgradeServiceUrl: "https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/",
  targetAudience: [
    "first-time craft fair and market table sellers",
    "home bakers and cottage-food sellers with public menus",
    "local service providers with simple price/menu offers",
    "pop-up class, workshop, and community event organizers",
  ],
  auditQuestions: [
    "Do shoppers see a clear price for each item or service?",
    "Is there one QR/contact sign that opens a public-safe page or contact method?",
    "Is there one simple flyer or table note that says what is available today?",
    "Is there a coupon, bundle, or follow-up offer the seller can actually honor?",
    "Are pickup, packing, or ordering notes clear enough to reduce repeated questions?",
    "Are claims, deadlines, food/health language, and discount rules safe for the seller to review before printing?",
  ],
  freeToolPaths: [
    "tools/price-tag",
    "tools/qr-code",
    "tools/flyer-maker",
    "tools/coupon-maker",
    "tools/packing-slip",
    "tools/business-card",
  ],
  statuses: [
    { id: "audit_request_received", moneyRule: "Not revenue. A person asked for a free public-safe print audit." },
    { id: "audit_reply_sent", moneyRule: "Not revenue. Send free checklist notes and relevant generator links." },
    { id: "upgrade_interest", moneyRule: "Not revenue. The person asked about done-for-you setup or timeline." },
    { id: "service_fit_confirmed", moneyRule: "Not revenue. Move to the $29 service pipeline only after fit is confirmed." },
    { id: "paid_order_verified", moneyRule: "Revenue only if the external payment provider proves a paid order for the $29 setup." },
  ],
  riskControls: [
    "The audit is free and does not collect payment.",
    "Use public-safe business, event, offer, and print-piece details only.",
    "Do not ask for card, bank, payout, tax, identity, password, credential, private address, or customer-list data.",
    "The audit is practical feedback, not legal, tax, health, food-labeling, advertising-compliance, or financial advice.",
    "Mention the paid setup only as an optional upgrade when the seller wants the first pack assembled.",
  ],
  moneyGate: "Free audit requests are validation, not revenue. Money is real only after a separate external provider shows a paid order for the $29 Custom Local Print Pack Setup.",
};

const SERVICE_SALES_PACK = {
  id: "custom-local-print-pack-sales-pack",
  slug: "custom-local-print-pack-sales-pack",
  name: "Custom Local Print Pack Sales Pack",
  headline: "Copy-ready sales pack for the $29 Custom Local Print Pack service",
  shortDescription: "A zero-budget outreach pack for promoting the $29 done-for-you local print pack setup to craft sellers, market tables, local services, tutors, cleaners, repair providers, and pop-up organizers.",
  serviceId: CUSTOM_LOCAL_PRINT_PACK_SERVICE.id,
  serviceUrl: "https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/",
  mainSiteFallbackUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug),
  githubPagesServiceUrl: "https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/",
  requestBriefUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicRequestPath).replace(/\/$/, ""),
  githubPagesRequestBriefUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-request.txt",
  paymentReplyUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicPaymentReplyPath).replace(/\/$/, ""),
  githubPagesPaymentReplyUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-payment-reply.txt",
  fulfillmentChecklistUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicFulfillmentChecklistPath).replace(/\/$/, ""),
  githubPagesFulfillmentChecklistUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-fulfillment-checklist.txt",
  orderPipelineUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOrderPipelinePath).replace(/\/$/, ""),
  githubPagesOrderPipelineUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-order-pipeline.json",
  outreachQueueUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOutreachQueuePath).replace(/\/$/, ""),
  githubPagesOutreachQueueUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-outreach-queue.json",
  outreachBatchUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicOutreachBatchPath).replace(/\/$/, ""),
  githubPagesOutreachBatchUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-outreach-batch.txt",
  sampleDeliveryUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicSampleDeliveryPath).replace(/\/$/, ""),
  githubPagesSampleDeliveryUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-sample-delivery.zip",
  deliveryInputExampleUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicDeliveryInputExamplePath).replace(/\/$/, ""),
  githubPagesDeliveryInputExampleUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-delivery-input.example.json",
  deliveryReportUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.publicDeliveryReportPath).replace(/\/$/, ""),
  githubPagesDeliveryReportUrl: "https://yanqr213.github.io/printable-tools-lab/reports/custom-local-print-pack-sample-delivery.json",
  issueFormUrl: CUSTOM_LOCAL_PRINT_PACK_SERVICE.issueFormUrl,
  audience: [
    "craft fair and market table sellers",
    "home bakers, handmade sellers, and small online sellers",
    "local service providers such as tutors, cleaners, notaries, coaches, and repair helpers",
    "workshop, pop-up class, community event, and booth organizers",
  ],
  trackedLinks: [
    ["GitHub Pages service link", "https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack"],
    ["Free audit lead magnet", "https://yanqr213.github.io/printable-tools-lab/market-table-print-audit/?utm_source=direct-outreach&utm_medium=manual&utm_campaign=market_table_audit"],
    ["Free audit request template", "https://yanqr213.github.io/printable-tools-lab/assets/services/market-table-print-audit-request.txt?utm_source=direct-outreach&utm_medium=manual&utm_campaign=market_table_audit"],
    ["Free audit checklist JSON", "https://yanqr213.github.io/printable-tools-lab/assets/services/market-table-print-audit-checklist.json?utm_source=direct-outreach&utm_medium=manual&utm_campaign=market_table_audit"],
    ["GitHub Pages request brief", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-request.txt?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack"],
    ["Structured request form", `${CUSTOM_LOCAL_PRINT_PACK_SERVICE.issueFormUrl}&utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack`],
    ["Payment reply template", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-payment-reply.txt?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack"],
    ["Fulfillment checklist", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-fulfillment-checklist.txt?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack"],
    ["Manual outreach queue", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-outreach-queue.json?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack"],
    ["Copy/paste outreach batch", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-outreach-batch.txt?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack"],
    ["Sample delivery ZIP", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-sample-delivery.zip?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack"],
    ["Delivery input example", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-delivery-input.example.json?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack"],
    ["Cloudflare fallback service link", `${siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug).replace(/\/$/, "")}?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack`],
    ["Free price tag generator", `${siteUrl("tools/price-tag").replace(/\/$/, "")}?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack`],
    ["Free flyer maker", `${siteUrl("tools/flyer-maker").replace(/\/$/, "")}?utm_source=direct-outreach&utm_medium=manual&utm_campaign=service_sales_pack`],
  ],
  outreachScripts: [
    {
      channel: "market-seller-dm",
      title: "Friendly DM to a market or craft seller",
      message: "Hi, I noticed your local products would look good with a simple printable table pack. I made a $29 done-for-you setup where I prepare starter price tags, flyer copy, QR sign wording, coupon ideas, packing notes, and a one-page launch checklist from your item list. No payment is taken on the site; you can review the brief first and only pay through a real checkout link if it fits.",
      cta: "Want the request brief?",
    },
    {
      channel: "local-service-dm",
      title: "DM to a local service provider",
      message: "Hi, if you ever need quick printable promo pieces for your service, I have a small $29 setup offer: price/menu rows if needed, one flyer draft, QR sign wording, coupon or bundle ideas, pickup/booking notes, and a print checklist. It is meant for simple local services, not a full branding project.",
      cta: "I can send the service brief if useful.",
    },
    {
      channel: "community-reply",
      title: "Helpful community reply",
      message: "For a quick market table setup, I would start with simple price tags, one clear flyer, a QR/contact sign, and one small offer card. I made free generators for those, plus a $29 done-for-you setup if someone wants the first pack assembled from their own item list.",
      cta: "Share the free generator first; mention the paid setup only if the person asks for help.",
    },
    {
      channel: "directory-blurb",
      title: "Small service directory blurb",
      message: "Custom Local Print Pack Setup is a $29 done-for-you starter pack for local sellers and small service providers who need printable price tags, flyer copy, QR sign wording, coupon ideas, packing notes, and a launch checklist without learning design software.",
      cta: "Use the GitHub Pages service link as the public listing URL until the main Cloudflare deployment is refreshed.",
    },
  ],
  listingFields: [
    ["Service name", CUSTOM_LOCAL_PRINT_PACK_SERVICE.name],
    ["Price", `$${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} ${CUSTOM_LOCAL_PRINT_PACK_SERVICE.currency}`],
    ["Category", "Local business printables, small business service, market seller setup"],
    ["Short tagline", "Done-for-you printable starter pack for local sellers and service providers"],
    ["Free audit URL", "https://yanqr213.github.io/printable-tools-lab/market-table-print-audit/"],
    ["Free audit request template", "https://yanqr213.github.io/printable-tools-lab/assets/services/market-table-print-audit-request.txt"],
    ["Free audit checklist JSON", "https://yanqr213.github.io/printable-tools-lab/assets/services/market-table-print-audit-checklist.json"],
    ["Public URL", "https://yanqr213.github.io/printable-tools-lab/custom-local-print-pack/"],
    ["Request brief", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-request.txt"],
    ["Structured request form", CUSTOM_LOCAL_PRINT_PACK_SERVICE.issueFormUrl],
    ["Payment-before-work reply", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-payment-reply.txt"],
    ["Fulfillment checklist", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-fulfillment-checklist.txt"],
    ["Manual outreach queue", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-outreach-queue.json"],
    ["Copy/paste outreach batch", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-outreach-batch.txt"],
    ["Sample delivery ZIP", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-sample-delivery.zip"],
    ["Delivery input example", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-delivery-input.example.json"],
    ["Sample delivery report", "https://yanqr213.github.io/printable-tools-lab/reports/custom-local-print-pack-sample-delivery.json"],
  ],
  executionChecklist: [
    "Start with 5 to 10 manual, relevant, non-spam contacts where the service solves an immediate print or market-table problem.",
    "Send the request brief first; do not ask for payment until the buyer confirms fit and details.",
    "Use the external checkout provider only after the buyer asks to proceed.",
    "After paid_order_verified, run npm.cmd run service:delivery -- --input path/to/order.json to generate the private delivery ZIP under paid-deliverables/service-orders.",
    "Log any request URL, reply, or paid order in OPERATIONS.md with the date and source.",
    "Count revenue only from a paid provider order, payout balance, or settled payment.",
  ],
  riskControls: [
    "Do not spam communities or scrape private contact lists.",
    "Do not promise guaranteed sales, legal compliance, tax results, or ad performance.",
    "Do not collect card, bank, payout, tax, or identity details in the repository or GitHub issues.",
    "Do not begin paid custom work without a real external payment record.",
  ],
};

function configuredCheckoutUrl() {
  const envUrl = (process.env.PUBLIC_SELLER_KIT_CHECKOUT_URL || process.env.PUBLIC_CHECKOUT_URL || "").trim();
  if (envUrl) return envUrl;
  const configPath = path.join(__dirname, "..", "site-config.js");
  if (!fs.existsSync(configPath)) return "";
  const source = fs.readFileSync(configPath, "utf8");
  const match = source.match(/sellerKitCheckoutUrl:\s*"([^"]*)"/);
  return match ? match[1].trim() : "";
}

function configuredContactEmail() {
  const envEmail = (process.env.PUBLIC_CONTACT_EMAIL || "").trim();
  if (envEmail) return envEmail;
  const configPath = path.join(__dirname, "..", "site-config.js");
  if (!fs.existsSync(configPath)) return "";
  const source = fs.readFileSync(configPath, "utf8");
  const match = source.match(/contactEmail:\s*"([^"]*)"/);
  return match ? match[1].trim() : "";
}

function productCheckoutRequestCopy(product, sampleUrl = siteUrl(product.publicSamplePath).replace(/\/$/, "")) {
  return [
    `I want to buy the ${product.name} for $${product.priceUsd} ${product.currency}.`,
    "",
    `Sample checked: ${sampleUrl}`,
    "Preferred checkout provider: Gumroad / Payhip / Ko-fi / Stripe / other",
    "Best contact method:",
    "Country or region (optional):",
    "Notes:",
    "",
    "No payment is collected by this request. Please reply with a real external checkout link only after the payment product is ready.",
  ].join("\n");
}

function productCheckoutEmailUrl(product, sampleUrl = siteUrl(product.publicSamplePath).replace(/\/$/, ""), contactEmail = product.contactEmail) {
  const email = String(contactEmail || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  const params = new URLSearchParams({
    subject: `Checkout request: ${product.name}`,
    body: productCheckoutRequestCopy(product, sampleUrl),
  });
  return `mailto:${email}?${params.toString()}`;
}

function productCheckoutRequestUrl(product, sampleUrl = siteUrl(product.publicSamplePath).replace(/\/$/, "")) {
  const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
  url.searchParams.set("title", `Checkout request: ${product.name}`);
  url.searchParams.set("body", productCheckoutRequestCopy(product, sampleUrl));
  return url.toString();
}

function serviceRequestCopy(service) {
  return [
    `I want to request the ${service.name} for $${service.priceUsd} ${service.currency}.`,
    "",
    "Business, booth, event, or service name:",
    "What do you sell or promote?",
    "Up to 12 items/services with prices:",
    "Link or contact method for QR sign wording:",
    "Preferred style: clean / cute / bold / minimal / local / premium / practical",
    "Need-by date:",
    "Preferred checkout provider: Gumroad / Payhip / Ko-fi / Stripe / other",
    "Best contact method:",
    "Country or region (optional):",
    "Notes:",
    "",
    "No payment is collected by this request. Please reply with a real external checkout link and details checklist only if the service is available.",
  ].join("\n");
}

function serviceRequestEmailUrl(service, contactEmail = service.contactEmail) {
  const email = String(contactEmail || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  const params = new URLSearchParams({
    subject: `Service request: ${service.name}`,
    body: serviceRequestCopy(service),
  });
  return `mailto:${email}?${params.toString()}`;
}

function serviceRequestUrl(service) {
  const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
  url.searchParams.set("title", `Service request: ${service.name}`);
  url.searchParams.set("body", serviceRequestCopy(service));
  return url.toString();
}

function marketTableAuditRequestCopy(audit = MARKET_TABLE_PRINT_AUDIT) {
  return [
    "I want a Free Market Table Print Audit.",
    "",
    "Business, booth, event, or service name:",
    "What do you sell or promote?",
    "Where will this be used? market table / pickup / workshop / local service / online-to-local / other:",
    "Current price list, menu, or item examples:",
    "Current QR/contact link or public-safe contact method:",
    "What print pieces do you already have? price tags / flyer / QR sign / coupon / packing note / none:",
    "What feels confusing or unfinished?",
    "Need-by date or event date:",
    "Would you want a $29 done-for-you setup if the audit shows obvious gaps? yes / maybe / no:",
    "Public-safe contact preference:",
    "Notes:",
    "",
    "No payment is collected for this audit request. Do not include card, bank, payout, tax, identity, credential, password, private address, customer-list, or private account details.",
  ].join("\n");
}

function marketTableAuditRequestUrl(audit = MARKET_TABLE_PRINT_AUDIT) {
  const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
  url.searchParams.set("title", `Free audit request: ${audit.name}`);
  url.searchParams.set("body", marketTableAuditRequestCopy(audit));
  return url.toString();
}

function marketTableAuditChecklist(audit = MARKET_TABLE_PRINT_AUDIT) {
  return {
    id: audit.id,
    name: audit.name,
    purpose: audit.shortDescription,
    freeAuditUrl: siteUrl(audit.slug),
    githubPagesAuditUrl: audit.githubPagesUrl,
    requestUrl: marketTableAuditRequestUrl(audit),
    issueFormUrl: audit.issueFormUrl,
    requestTemplateUrl: siteUrl(audit.publicRequestPath).replace(/\/$/, ""),
    githubPagesRequestTemplateUrl: audit.githubPagesRequestUrl,
    upgradeServiceUrl: siteUrl(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug),
    githubPagesUpgradeServiceUrl: audit.upgradeServiceUrl,
    targetAudience: audit.targetAudience,
    auditQuestions: audit.auditQuestions,
    freeTools: audit.freeToolPaths.map((toolPath) => ({
      path: toolPath,
      url: siteUrl(toolPath),
      githubPagesUrl: `https://yanqr213.github.io/printable-tools-lab/${toolPath.replace(/^tools\//, "tools/")}/`,
    })),
    statuses: audit.statuses,
    upgradePath: [
      "audit_request_received",
      "audit_reply_sent",
      "upgrade_interest",
      "service_fit_confirmed",
      "checkout_sent",
      "paid_order_verified",
    ],
    replyTemplate: [
      "Thanks for sending the public-safe details. I would check these before printing:",
      ...audit.auditQuestions.map((item) => `- ${item}`),
      "",
      "Start free with the price tag, QR, flyer, coupon, packing slip, and business-card generators. If you want the first pack assembled for you, the optional done-for-you setup is $29 and only starts after a real external checkout is paid.",
    ].join("\n"),
    riskControls: audit.riskControls,
    moneyGate: audit.moneyGate,
  };
}

function marketTableAuditRequestBuilderHtml(audit = MARKET_TABLE_PRINT_AUDIT) {
  const pieces = ["price tags", "flyer", "QR sign", "coupon", "packing note", "none"];
  return `<section class="shell section" id="build-audit-request">
        <h2>Build your request</h2>
        <p>Fill the public-safe fields once, then open a prefilled GitHub request or copy the message into email, a contact form, or a DM.</p>
        <div class="grid-2" data-audit-request-builder data-audit-request-title="Free audit request: ${escapeHtml(audit.name)}">
          <form class="panel form-grid" data-audit-request-form>
            <div class="field">
              <label for="audit-business">Business, booth, event, or service name</label>
              <input id="audit-business" name="business" autocomplete="organization" placeholder="Saturday market candle table">
            </div>
            <div class="field">
              <label for="audit-sells">What do you sell or promote?</label>
              <textarea id="audit-sells" name="sells" placeholder="Soy candles, wax melts, and gift bundles"></textarea>
            </div>
            <div class="field">
              <label for="audit-use">Where will this be used?</label>
              <select id="audit-use" name="use">
                <option value="">Choose one</option>
                <option>market table</option>
                <option>pickup</option>
                <option>workshop</option>
                <option>local service</option>
                <option>online-to-local</option>
                <option>other</option>
              </select>
            </div>
            <div class="field">
              <label for="audit-examples">Current price list, menu, or item examples</label>
              <textarea id="audit-examples" name="examples" placeholder="Small candle $8, large candle $15, 2 for $25"></textarea>
            </div>
            <div class="field">
              <label for="audit-contact">Current QR/contact link or public-safe contact method</label>
              <input id="audit-contact" name="contact" inputmode="url" placeholder="Public shop link, booking link, or contact page">
            </div>
            <fieldset class="field">
              <legend>What print pieces do you already have?</legend>
              <div class="check-list">
                ${pieces.map((piece, index) => `<label><input type="checkbox" name="pieces" value="${escapeHtml(piece)}"${index === pieces.length - 1 ? " data-none-option" : ""}> ${escapeHtml(piece)}</label>`).join("")}
              </div>
            </fieldset>
            <div class="field">
              <label for="audit-confusing">What feels confusing or unfinished?</label>
              <textarea id="audit-confusing" name="confusing" placeholder="Prices are on phone notes, QR sign is too small, coupon wording is unclear"></textarea>
            </div>
            <div class="field">
              <label for="audit-date">Need-by date or event date</label>
              <input id="audit-date" name="date" placeholder="June 22 market">
            </div>
            <div class="field">
              <label for="audit-upgrade">Would you want the optional $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup if the audit shows obvious gaps?</label>
              <select id="audit-upgrade" name="upgrade">
                <option>maybe</option>
                <option>yes</option>
                <option>no</option>
              </select>
            </div>
            <div class="field">
              <label for="audit-preference">Public-safe contact preference</label>
              <input id="audit-preference" name="preference" placeholder="Reply on GitHub issue, public email, or public profile DM">
            </div>
            <div class="field">
              <label for="audit-notes">Notes</label>
              <textarea id="audit-notes" name="notes" placeholder="Avoid private customer details, tax IDs, account logins, payment data, and private addresses."></textarea>
            </div>
          </form>
          <article class="panel form-grid">
            <h3>Generated request</h3>
            <p class="notice">No payment is collected here. Do not include card, bank, payout, tax, identity, password, private address, customer-list, or platform credential details.</p>
            <textarea class="code-block audit-request-output" data-audit-request-output readonly>${escapeHtml(marketTableAuditRequestCopy(audit))}</textarea>
            <div class="hero-actions">
              <a class="button" data-audit-request-open data-track-event="audit_request_intent" data-track-tool="${escapeHtml(audit.id)}" href="${escapeHtml(marketTableAuditRequestUrl(audit))}">Open prefilled GitHub request</a>
              <button class="button secondary" type="button" data-audit-request-copy>Copy request</button>
            </div>
            <p class="notice" data-audit-request-status>Ready to copy or open as a public-safe request.</p>
          </article>
        </div>
      </section>`;
}

function serviceRequestBuilderHtml(service = CUSTOM_LOCAL_PRINT_PACK_SERVICE) {
  const requestUrl = serviceRequestUrl(service);
  const emailUrl = serviceRequestEmailUrl(service);
  const requestCopyActions = [
    `<button class="button secondary" type="button" data-service-request-copy data-track-tool="${escapeHtml(service.id)}">Copy generated service request</button>`,
    `<a class="button" data-service-request-open data-track-event="service_request_intent" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(requestUrl)}">Open generated GitHub request</a>`,
    emailUrl ? `<a class="button ghost" data-track-event="service_request_intent" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(emailUrl)}">Open email draft</a>` : "",
  ].filter(Boolean).join("\n              ");
  return `<section class="shell section" id="service-request">
        <h2>Build a service request</h2>
        <p>Fill the public-safe fields once, then copy the generated request or open it as a prefilled GitHub issue. Treat it as intent only until a real external payment is recorded.</p>
        <div class="grid-2" data-service-request-builder data-service-request-title="Service request: ${escapeHtml(service.name)}">
          <form class="panel form-grid" data-service-request-form>
            <div class="field">
              <label for="service-business">Business, booth, event, or service name</label>
              <input id="service-business" name="business" autocomplete="organization" placeholder="Sunny Table Bakes">
            </div>
            <div class="field">
              <label for="service-sells">What do you sell or promote?</label>
              <textarea id="service-sells" name="sells" placeholder="Cookies, market boxes, and weekend pickup orders"></textarea>
            </div>
            <div class="field">
              <label for="service-items">Up to 12 items or services with prices</label>
              <textarea id="service-items" name="items" placeholder="Chocolate chip cookie bag - $6&#10;Brownie box - $10&#10;Market bundle - 2 for $15"></textarea>
            </div>
            <div class="field">
              <label for="service-contact">QR sign link or public-safe contact method</label>
              <input id="service-contact" name="contact" inputmode="url" placeholder="Public shop link, booking page, or contact page">
            </div>
            <div class="field">
              <label for="service-style">Preferred style</label>
              <select id="service-style" name="style">
                <option>clean</option>
                <option>cute</option>
                <option>bold</option>
                <option>minimal</option>
                <option>local</option>
                <option>premium</option>
                <option>practical</option>
              </select>
            </div>
            <div class="field">
              <label for="service-date">Need-by date</label>
              <input id="service-date" name="date" placeholder="June 22 market">
            </div>
            <div class="field">
              <label for="service-checkout">Preferred checkout provider</label>
              <select id="service-checkout" name="checkout">
                <option>No preference</option>
                <option>Gumroad</option>
                <option>Payhip</option>
                <option>Ko-fi</option>
                <option>Stripe</option>
                <option>Invoice provider</option>
              </select>
            </div>
            <div class="field">
              <label for="service-preference">Best public-safe contact method</label>
              <input id="service-preference" name="preference" placeholder="Reply in GitHub issue, public email, or public website contact page">
            </div>
            <div class="field">
              <label for="service-region">Country or region (optional)</label>
              <input id="service-region" name="region" placeholder="Optional">
            </div>
            <div class="field">
              <label for="service-notes">Notes</label>
              <textarea id="service-notes" name="notes" placeholder="Avoid private customer details, tax IDs, account logins, payment data, and private addresses."></textarea>
            </div>
          </form>
          <article class="panel form-grid">
            <h3>Generated request</h3>
            <p class="notice">No payment is collected here. Do not include card, bank, payout, tax, identity, password, private address, customer-list, or platform credential details.</p>
            <textarea class="code-block request-copy-output" data-service-request-output readonly>${escapeHtml(serviceRequestCopy(service))}</textarea>
            <div class="hero-actions">
              ${requestCopyActions}
            </div>
            <p class="notice" data-service-request-status>Ready to copy into email, a contact form, or a public-safe request.</p>
          </article>
        </div>
      </section>`;
}

function servicePaymentReplyCopy(service) {
  return [
    `Subject: ${service.name} - fit confirmed, payment link before work starts`,
    "",
    "Thanks for sending the details. This looks like a good fit for the simple local print pack scope.",
    "",
    "Scope I will prepare after payment:",
    ...service.deliverables.map((item) => `- ${item}`),
    "",
    `Price: $${service.priceUsd} ${service.currency}`,
    service.turnaround,
    "",
    "Next step:",
    "1. I will send one real external checkout link from Gumroad, Payhip, Ko-fi, Stripe, or an invoice provider.",
    "2. Please pay only through that external provider. Do not post card, bank, payout, tax, identity, or private account details in GitHub or email.",
    "3. After the provider shows the order as paid, I will mark the request as paid_order_verified and start the pack.",
    "",
    "Before I send the checkout link, please confirm:",
    "- The item/service list and prices are final enough for a first draft.",
    "- The QR/contact link is safe to print publicly.",
    "- You understand the pack is editable starter copy, not legal, tax, accounting, employment, medical, or financial advice.",
    "- One lightweight revision is included for typos or fit; new branding, logo design, or regulated copy is outside this $29 scope.",
    "",
    "Revenue is counted only after the external provider shows a paid order, payout balance, or settled payment.",
  ].join("\n");
}

function serviceFulfillmentChecklistCopy(service) {
  return [
    `# ${service.name} Fulfillment Checklist`,
    "",
    "Use this only after a real external payment provider shows a paid order. Do not start custom work from a request, page view, email, or brief download alone.",
    "",
    "## Intake",
    "",
    "- Confirm request source URL, date, and public-safe contact method.",
    "- Confirm buyer sent business/event/service name, offer summary, up to 12 items or services with prices, QR/contact link, style preference, need-by date, and words or claims to avoid.",
    "- Confirm no card, bank, payout, tax, identity, platform credential, or private account information was collected.",
    "- Confirm the buyer understands all copy, prices, QR links, and claims must be reviewed before printing or publishing.",
    "",
    "## Payment Gate",
    "",
    "- Send one real external checkout link only after fit is confirmed.",
    "- Wait until the provider shows paid_order_verified, paid order, payout balance, or settled payment.",
    "- Log the order source and provider status in OPERATIONS.md without exposing private buyer or payment details.",
    "",
    "## Build",
    "",
    "- Prepare price tag starter CSV for up to 12 items.",
    "- Draft one small flyer with clear local action wording.",
    "- Draft QR sign wording for the supplied public link or contact method.",
    "- Draft three coupon or bundle offer ideas.",
    "- Draft packing slip or pickup note starter rows.",
    "- Draft one-page launch checklist for printing and first outreach.",
    "- Keep everything editable and easy to paste into PrintableTools Lab generators.",
    "",
    "## Delivery",
    "",
    "- Deliver text, CSV, or copy blocks through the buyer's agreed channel.",
    "- Include a note that the buyer must test the QR code and review all claims before printing.",
    "- Offer one lightweight revision for typos or fit.",
    "- Mark the pipeline delivered, then revision_done or closed after the buyer response.",
  ].join("\n");
}

function serviceOrderPipeline(service) {
  const assetUrl = (relativePath) => siteUrl(relativePath).replace(/\/$/, "");
  return {
    id: `${service.id}-order-pipeline`,
    serviceId: service.id,
    serviceName: service.name,
    priceUsd: service.priceUsd,
    currency: service.currency,
    generatedFor: "Manual service requests that can become paid orders without collecting payment on the site.",
    issueFormUrl: service.issueFormUrl,
    requestUrl: serviceRequestUrl(service),
    requestTemplateUrl: assetUrl(service.publicRequestPath),
    paymentReplyTemplateUrl: assetUrl(service.publicPaymentReplyPath),
    fulfillmentChecklistUrl: assetUrl(service.publicFulfillmentChecklistPath),
    publicSafeFields: [
      "business, booth, event, or service name",
      "what the buyer sells or promotes",
      "up to 12 items or services with prices",
      "public QR/contact link or public-safe reply preference",
      "style preference",
      "need-by date",
      "preferred external checkout provider",
      "notes that do not include private payment or identity data",
    ],
    forbiddenFields: [
      "card numbers",
      "bank details",
      "payout details",
      "tax identifiers",
      "identity documents",
      "platform credentials",
      "private account passwords",
    ],
    statuses: [
      {
        id: "intent_received",
        ownerAction: "A buyer submits the structured issue form, prefilled issue, email, or brief text.",
        buyerAction: "Provide public-safe service details only.",
        moneyRule: "Not revenue.",
      },
      {
        id: "fit_confirmed",
        ownerAction: "Confirm the request is within the simple $29 scope and details are complete enough.",
        buyerAction: "Confirm scope and that the QR/contact link can be printed publicly.",
        moneyRule: "Not revenue.",
      },
      {
        id: "checkout_sent",
        ownerAction: "Send one real external Gumroad, Payhip, Ko-fi, Stripe, or invoice checkout link.",
        buyerAction: "Pay only through the external provider.",
        moneyRule: "Not revenue until the provider confirms payment.",
      },
      {
        id: "paid_order_verified",
        ownerAction: "Verify paid order, payout balance, or settled payment in the provider dashboard.",
        buyerAction: "No extra sensitive data required.",
        moneyRule: "This is the first status that can count as revenue.",
      },
      {
        id: "in_progress",
        ownerAction: "Prepare the editable starter CSV, flyer copy, QR sign wording, coupon ideas, packing notes, and launch checklist.",
        buyerAction: "Answer scope clarifications only if needed.",
        moneyRule: "Revenue already verified externally.",
      },
      {
        id: "delivered",
        ownerAction: "Send the pack through the agreed channel with review and QR-test reminders.",
        buyerAction: "Review all copy, prices, QR links, and claims before printing.",
        moneyRule: "Revenue already verified externally.",
      },
      {
        id: "revision_done",
        ownerAction: "Complete the included lightweight typo or fit revision if requested.",
        buyerAction: "Confirm the revision request is within scope.",
        moneyRule: "No extra revenue unless a separate new paid scope is created.",
      },
      {
        id: "closed",
        ownerAction: "Log the non-sensitive outcome in OPERATIONS.md and leave private payment details in the provider only.",
        buyerAction: "Use the editable pack in their own business or event workflow.",
        moneyRule: "Final counted revenue must match the external provider record.",
      },
    ],
    moneyGate: service.successGate,
    riskControls: service.riskControls,
  };
}

function serviceOutreachQueue(service) {
  const serviceUrl = SERVICE_SALES_PACK.githubPagesServiceUrl;
  const requestBriefUrl = SERVICE_SALES_PACK.githubPagesRequestBriefUrl;
  const issueFormUrl = service.issueFormUrl;
  const githubPagesBase = "https://yanqr213.github.io/printable-tools-lab/";
  const campaign = "service_sales_pack";
  const tracked = (url, source, medium = "manual") => `${url}${url.includes("?") ? "&" : "?"}utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
  const scripts = Object.fromEntries(SERVICE_SALES_PACK.outreachScripts.map((script) => [script.channel, script]));
  const batch = [
    {
      id: "market-seller-public-profile-01",
      day: 1,
      channel: "public-social-dm",
      audience: "craft fair, pop-up, farmers market, and handmade sellers with public business profiles",
      findWhere: "Public Instagram, Facebook Page, TikTok, Etsy shop announcement, or market-vendor page where the seller publicly invites DMs or business inquiries.",
      qualification: "They visibly sell at tables, markets, pop-ups, or local pickup and have pricing/menu/signage that could use printable price tags, QR signs, coupons, or a flyer.",
      opener: scripts["market-seller-dm"].message,
      cta: scripts["market-seller-dm"].cta,
      trackedUrl: tracked(serviceUrl, "public-social-dm"),
      fallbackUrl: tracked(requestBriefUrl, "public-social-dm"),
      stopRule: "Do not send more than one initial message to the same seller unless they reply. Do not contact private personal profiles.",
      status: "ready_manual_send",
    },
    {
      id: "market-seller-public-profile-02",
      day: 1,
      channel: "public-social-dm",
      audience: "home bakers and cottage-food sellers with public order/menu posts",
      findWhere: "Public posts that already show menus, ordering windows, market tables, pickup boxes, or seasonal batches.",
      qualification: "They have a current public menu or price list and could benefit from clearer price tags, QR order sign, coupon card, or pickup note copy.",
      opener: "Hi, I saw your menu/order post and thought a simple printable table or pickup pack might help: price/menu rows, one small flyer, QR sign wording, coupon ideas, packing or pickup notes, and a launch checklist. I have a $29 done-for-you setup if you want the first pack assembled from your own item list. No payment is taken on the site; I send a real checkout link only after confirming fit.",
      cta: "Want the short request brief?",
      trackedUrl: tracked(serviceUrl, "home-baker-dm"),
      fallbackUrl: tracked(requestBriefUrl, "home-baker-dm"),
      stopRule: "No health, allergy, licensing, or compliance advice. Do not imply the pack makes food claims compliant.",
      status: "ready_manual_send",
    },
    {
      id: "local-service-public-profile-01",
      day: 1,
      channel: "public-social-dm",
      audience: "tutors, cleaners, repair helpers, coaches, notaries, and appointment-based local services",
      findWhere: "Public business pages or posts with a booking/contact link and an obvious service offer.",
      qualification: "They use basic text posts or screenshots for offers and could use one flyer draft, QR sign wording, coupon/bundle ideas, and booking-note copy.",
      opener: scripts["local-service-dm"].message,
      cta: scripts["local-service-dm"].cta,
      trackedUrl: tracked(serviceUrl, "local-service-dm"),
      fallbackUrl: tracked(requestBriefUrl, "local-service-dm"),
      stopRule: "Avoid regulated claims and do not contact emergency, medical, legal, tax, financial, or high-risk services.",
      status: "ready_manual_send",
    },
    {
      id: "market-organizer-directory-01",
      day: 2,
      channel: "directory-contact-form",
      audience: "market, craft fair, community event, and pop-up organizer websites",
      findWhere: "Public organizer pages with a vendor resources, contact, or community bulletin link.",
      qualification: "The organizer lists small vendors and may share useful tools/resources with vendors.",
      opener: "Hi, I made a small vendor print-pack service that may help new sellers prepare price tags, a QR/contact sign, flyer copy, coupon ideas, packing/pickup notes, and a launch checklist. It is a $29 done-for-you setup after fit is confirmed, and the free generators are available even if vendors do it themselves.",
      cta: "Would a short vendor-resource link be useful?",
      trackedUrl: tracked(serviceUrl, "market-organizer"),
      fallbackUrl: tracked(requestBriefUrl, "market-organizer"),
      stopRule: "Use only public contact forms meant for vendor/resource inquiries. Do not repeatedly contact organizers.",
      status: "ready_manual_send",
    },
    {
      id: "community-help-reply-01",
      day: 2,
      channel: "helpful-community-reply",
      audience: "public posts where someone asks how to prepare a market table, flyer, QR sign, or local-service promo sheet",
      findWhere: "Relevant public communities, forums, or groups that allow helpful resource replies.",
      qualification: "A person is actively asking for printable setup help, price tags, QR signage, simple flyer copy, or market table prep.",
      opener: scripts["community-reply"].message,
      cta: scripts["community-reply"].cta,
      trackedUrl: tracked(serviceUrl, "community-reply", "organic"),
      fallbackUrl: tracked(`${githubPagesBase}tools/price-tag/`, "community-reply", "organic"),
      stopRule: "Lead with the free generator. Mention the paid setup only when custom help is relevant or requested.",
      status: "ready_manual_reply",
    },
    {
      id: "small-business-directory-01",
      day: 3,
      channel: "service-directory-listing",
      audience: "free or low-friction small-business service directories that allow digital service listings",
      findWhere: "Directory submission forms that accept local business printables, small-business services, or marketing support services.",
      qualification: "The directory allows service listings and does not require false address, phone, payout, or identity data.",
      opener: scripts["directory-blurb"].message,
      cta: scripts["directory-blurb"].cta,
      trackedUrl: tracked(serviceUrl, "service-directory", "organic"),
      fallbackUrl: tracked(requestBriefUrl, "service-directory", "organic"),
      stopRule: "Do not submit to directories requiring fake business registration, scraped reviews, paid placement disguised as free, or private payout information.",
      status: "ready_manual_submit",
    },
    {
      id: "etsy-shop-message-guarded-01",
      day: 3,
      channel: "marketplace-message-if-allowed",
      audience: "small shops that explicitly allow custom-service or business inquiry messages",
      findWhere: "Marketplace profiles only when the seller publicly invites custom/business inquiries and platform rules allow the message.",
      qualification: "The shop sells physical/local goods and appears to need printable insert, coupon, QR, or table assets.",
      opener: "Hi, I am not asking for anything private. If you ever need a quick printable starter pack for your shop table or local pickup flow, I have a $29 setup: price/menu rows, flyer copy, QR sign wording, coupon ideas, packing notes, and a print checklist from your item list. I can send the request brief if useful.",
      cta: "Would the brief help?",
      trackedUrl: tracked(serviceUrl, "marketplace-message"),
      fallbackUrl: tracked(requestBriefUrl, "marketplace-message"),
      stopRule: "Skip if marketplace rules discourage external service pitches. Never pressure or bypass platform messaging rules.",
      status: "conditional_manual_send",
    },
    {
      id: "local-partner-public-email-01",
      day: 4,
      channel: "public-business-email",
      audience: "print shops, coworking spaces, maker spaces, and community bulletin owners with public resource emails",
      findWhere: "Public business websites that share vendor, maker, or small-business resources.",
      qualification: "They serve local sellers and may value a low-cost vendor prep resource.",
      opener: "Hi, I am building a small vendor prep resource: free printable generators plus a $29 done-for-you local print pack setup for sellers who want price tags, flyer copy, QR sign wording, coupon ideas, packing notes, and a launch checklist assembled from their item list. It may be useful for first-time market vendors.",
      cta: "Is there a resource page or bulletin where this would fit?",
      trackedUrl: tracked(serviceUrl, "local-partner-email"),
      fallbackUrl: tracked(requestBriefUrl, "local-partner-email"),
      stopRule: "Use only public business/resource emails. No scraping private addresses or adding anyone to lists.",
      status: "ready_manual_send",
    },
    {
      id: "warm-reply-followup-01",
      day: 5,
      channel: "reply-followup-only",
      audience: "people who replied positively or asked for details",
      findWhere: "Only previous conversations where the recipient asked for the brief, price, delivery, or next step.",
      qualification: "They asked a question, requested the brief, or confirmed the pack might help.",
      opener: servicePaymentReplyCopy(service),
      cta: "Please confirm the scope bullets, then I can send the external checkout link.",
      trackedUrl: issueFormUrl,
      fallbackUrl: tracked(requestBriefUrl, "warm-followup"),
      stopRule: "Use this only after a real reply. Do not send payment language to cold contacts.",
      status: "reply_only",
    },
    {
      id: "manual-log-closeout-01",
      day: 5,
      channel: "operations-log",
      audience: "internal tracking",
      findWhere: "OPERATIONS.md service-order log section.",
      qualification: "After each sent message, reply, request, checkout, paid order, delivery, or closeout.",
      opener: "Log date, channel, public-safe source, contact count, reply count, request URL, checkout state, paid amount, and next action. Do not log private buyer/payment details.",
      cta: "Update status: sent, replied, intent_received, fit_confirmed, checkout_sent, paid_order_verified, delivered, revision_done, or closed.",
      trackedUrl: `${githubPagesBase}service-sales-pack.json`,
      fallbackUrl: `${githubPagesBase}services.json`,
      stopRule: "Never store payout, card, tax, identity, platform credential, phone, or private address data in the repository.",
      status: "required_after_action",
    },
  ];
  return {
    id: `${service.id}-outreach-queue`,
    serviceId: service.id,
    serviceName: service.name,
    priceUsd: service.priceUsd,
    currency: service.currency,
    purpose: "Manual, low-risk outreach queue for finding qualified buyers who may need a simple local print pack setup.",
    primaryServiceUrl: serviceUrl,
    requestBriefUrl,
    issueFormUrl,
    paymentReplyTemplateUrl: SERVICE_SALES_PACK.githubPagesPaymentReplyUrl,
    fulfillmentChecklistUrl: SERVICE_SALES_PACK.githubPagesFulfillmentChecklistUrl,
    orderPipelineUrl: SERVICE_SALES_PACK.githubPagesOrderPipelineUrl,
    batchSize: batch.length,
    dailyCap: "Send or reply to no more than 10 relevant public-safe contacts per day unless people are responding first.",
    qualificationRules: [
      "Use public business/profile/contact pages only.",
      "Message only when the seller or service provider appears to have a real printable-signage, price-list, menu, flyer, coupon, QR sign, pickup-note, or market-table problem.",
      "Lead with helpful free tools or the short request brief before asking for payment.",
      "Send payment language only after the person replies or confirms fit.",
      "Count revenue only after an external provider shows paid_order_verified, a paid order, payout balance, or settled payment.",
    ],
    forbiddenActions: [
      "Do not scrape private contact lists.",
      "Do not spam communities, repeat-send, or use fake engagement.",
      "Do not contact private personal profiles or minors.",
      "Do not collect card, bank, payout, tax, identity, credential, password, or private account details.",
      "Do not promise guaranteed sales, legal compliance, tax results, ad performance, or official approval.",
    ],
    metricsToLog: [
      "date",
      "queue item id",
      "channel",
      "public-safe source",
      "sent count",
      "reply count",
      "intent_received count",
      "fit_confirmed count",
      "checkout_sent count",
      "paid_order_verified amount",
      "next action",
    ],
    batch,
    moneyGate: service.successGate,
  };
}

function serviceOutreachBatchCopy(service) {
  const queue = serviceOutreachQueue(service);
  return [
    `${service.name} Manual Outreach Batch`,
    "",
    "Use this batch only for relevant public-safe contacts. Do not scrape, spam, repeat-send, or collect payment/private identity details.",
    "",
    `Primary service page: ${queue.primaryServiceUrl}`,
    `Request brief: ${queue.requestBriefUrl}`,
    `Structured request form: ${queue.issueFormUrl}`,
    `Money gate: ${queue.moneyGate}`,
    "",
    "Daily cap: no more than 10 relevant cold contacts per day unless people are replying first.",
    "",
    ...queue.batch.flatMap((item, index) => [
      `## ${index + 1}. ${item.id}`,
      `Day: ${item.day}`,
      `Channel: ${item.channel}`,
      `Audience: ${item.audience}`,
      `Find where: ${item.findWhere}`,
      `Qualification: ${item.qualification}`,
      "",
      "Message:",
      item.opener,
      "",
      `CTA: ${item.cta}`,
      `Tracked URL: ${item.trackedUrl}`,
      `Fallback URL: ${item.fallbackUrl}`,
      `Stop rule: ${item.stopRule}`,
      `Status: ${item.status}`,
      "",
    ]),
    "After every action, log only non-sensitive status in OPERATIONS.md. Revenue remains zero until an external provider proves a paid order.",
  ].join("\n");
}

const ZERO_DOMAIN_GAME_EXPERIMENT = {
  name: "Upload Limit Panic",
  url: "https://upload-limit-panic.pages.dev/",
  repo: "https://github.com/yanqr213/upload-limit-panic",
  releaseUrl: "https://github.com/yanqr213/upload-limit-panic/releases/tag/platform-submission-v1",
  packagePath: "upload-limit-panic/reports/upload-limit-panic-html5.tar.gz",
  zipUrl: "https://github.com/yanqr213/upload-limit-panic/releases/download/platform-submission-v1/upload-limit-panic-html5.zip",
  cleanZipUrl: "https://github.com/yanqr213/upload-limit-panic/releases/download/platform-submission-v1/upload-limit-panic-portal-clean.zip",
  cleanPackageReportUrl: "https://github.com/yanqr213/upload-limit-panic/releases/download/platform-submission-v1/clean-portal-package.json",
  demoVideoUrl: "https://github.com/yanqr213/upload-limit-panic/releases/download/platform-submission-v1/upload-limit-panic-demo.mp4",
  iconUrl: "https://github.com/yanqr213/upload-limit-panic/releases/download/platform-submission-v1/upload-limit-panic-icon-512.png",
  coverUrl: "https://github.com/yanqr213/upload-limit-panic/releases/download/platform-submission-v1/upload-limit-panic-cover-16x9.png",
  socialCardUrl: "https://github.com/yanqr213/upload-limit-panic/releases/download/platform-submission-v1/upload-limit-panic-social-card.png",
  submissionNotesUrl: "https://github.com/yanqr213/upload-limit-panic/blob/main/reports/platform-submission.md",
  submissionCopyUrl: "https://github.com/yanqr213/upload-limit-panic/blob/main/reports/platform-submission-copy.md",
  reviewReadinessUrl: "https://github.com/yanqr213/upload-limit-panic/blob/main/reports/review-readiness.md",
  summary: "A free HTML5 file-sorting game prototype for the zero-domain platform-ad route. CrazyGames, Yandex, Playgama, GamePix, and GameDistribution adapters are present; ad calls remain gated until platform review allows them.",
};

const ZERO_DOMAIN_GAME_EXPERIMENTS = [
  ZERO_DOMAIN_GAME_EXPERIMENT,
  {
    name: "Neon Lane Dash",
    url: "https://neon-lane-dash.pages.dev/",
    repo: "https://github.com/yanqr213/neon-lane-dash",
    releaseUrl: "https://github.com/yanqr213/neon-lane-dash/releases/tag/platform-submission-v1",
    packagePath: "neon-lane-dash/reports/neon-lane-dash-html5.tar.gz",
    zipUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-html5.zip",
    cleanZipUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-portal-clean.zip",
    cleanPackageReportUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/clean-portal-package.json",
    gameSnacksZipUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-gamesnacks.zip",
    gameSnacksPackageReportUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/gamesnacks-package.json",
    gameSnacksVerificationUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/gamesnacks-verification.json",
    demoVideoUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-demo.mp4",
    iconUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-icon-512.png",
    coverUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-cover-16x9.png",
    socialCardUrl: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-social-card.png",
    submissionNotesUrl: "https://github.com/yanqr213/neon-lane-dash/blob/main/reports/platform-submission.md",
    submissionCopyUrl: "https://github.com/yanqr213/neon-lane-dash/blob/main/reports/platform-submission-copy.md",
    reviewReadinessUrl: "https://github.com/yanqr213/neon-lane-dash/blob/main/reports/review-readiness.md",
    summary: "A free HTML5 three-lane reflex game for the zero-domain platform-ad route. CrazyGames, Yandex, Playgama, GamePix, GameDistribution, and GameSnacks adapters/packages are present; ad calls remain gated until platform review allows them.",
  },
];

const PLATFORM_SUBMIT_QUEUE = [
  {
    platform: "CrazyGames",
    priority: 1,
    accountRequired: "CrazyGames developer account with payout profile later, after acceptance and ad eligibility.",
    rationale: "Best current fit for short HTML5 arcade games and later platform-managed ads. Basic Launch can validate review quality before revenue.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://developer.crazygames.com/register",
    portalUrl: "https://developer.crazygames.com/",
    docsUrl: "https://docs.crazygames.com/",
    requiredFields: ["Game ZIP or dist upload", "Title", "Short description", "Controls", "Genre/tags", "Icon", "Cover image", "Screenshots or video", "SDK/ad safety note"],
    adPolicyNote: "Standalone builds do not request ads. SDK hooks are present and ad calls remain gated until platform approval.",
    currentGate: "Submitted on 2026-06-02 and awaiting review. Build ID 57a4b821-a761-4541-b2dc-69ced592d4d5. Billing details are a later payout gate and did not block submission.",
  },
  {
    platform: "Yandex Games",
    priority: 2,
    accountRequired: "Yandex Games publisher account and payout setup when eligible.",
    rationale: "Second zero-domain HTML5 platform target. Builds now include Yandex SDK v2 hooks for LoadingAPI.ready, GameplayAPI start/stop, and gated ads.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://games.yandex.com/console",
    portalUrl: "https://games.yandex.com/console",
    docsUrl: "https://yandex.com/dev/games/doc/en/console/add-new-game",
    requiredFields: ["HTML5 archive", "Game Ready SDK integration", "Title", "Description", "Icon", "Cover image", "Age rating", "Controls", "Ad integration note"],
    adPolicyNote: "No external links in Yandex context; ads are not called unless platform context is ready and ads=1 is present.",
    currentGate: "Yandex Console login and developer account are required. The old /dev/games/ landing URL returned 404 in the probe; official docs point to the Games Console and Add app draft flow.",
  },
  {
    platform: "itch.io",
    priority: 3,
    accountRequired: "itch.io creator account.",
    rationale: "Fast public mirror and feedback surface. Useful for plays and screenshots, but not the main ad-revenue path.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://itch.io/game/new",
    portalUrl: "https://itch.io/dashboard",
    docsUrl: "https://itch.io/docs/creators/html5",
    requiredFields: ["HTML ZIP with index.html at root", "Cover image", "Short description", "Controls", "No payments"],
    adPolicyNote: "Use as a free browser-play page and keep payment disabled during validation.",
    currentGate: "Creator login is required. Browser probe on 2026-06-02 reached itch.io/login and Cloudflare protection.",
  },
  {
    platform: "Playgama",
    priority: 4,
    accountRequired: "Playgama developer portal account; payout details later after approval and earnings.",
    rationale: "Strong secondary fit because it is built for HTML5 distribution, partner-platform publishing, ads/IAP monetization, and no upfront cost revenue share. Both current games now include Playgama Bridge lifecycle and gated ad hooks.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://developer.playgama.com/",
    portalUrl: "https://playgama.com/developers",
    docsUrl: "https://wiki.playgama.com/playgama",
    requiredFields: ["Developer account", "HTML5 ZIP upload", "Playgama Bridge SDK or integration notes", "Title", "Description", "Icon/cover", "Ad/IAP monetization preference"],
    adPolicyNote: "Playgama Bridge is integrated behind platform-context checks. The builds send game_ready and gameplay lifecycle messages, listen for pause/audio state changes, and only grant rewarded benefits after rewarded-state confirmation.",
    currentGate: "Submitted on 2026-06-02 and under review after dashboard certification passed SDK init, storage save/restore, and an interstitial ad test. Payout details remain a later earnings gate.",
  },
  {
    platform: "GamePix",
    priority: 5,
    accountRequired: "GamePix Dashboard developer account.",
    rationale: "Good secondary fit because GamePix hosts HTML5 games, distributes to partner sites, and advertises a clear developer revenue share. Both current games now include GamePix lifecycle/ping hooks without guessing undocumented ad APIs.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://partners.gamepix.com/developers",
    portalUrl: "https://partners.gamepix.com/developers",
    docsUrl: "https://partners.gamepix.com/developers",
    requiredFields: ["GamePix account", "Lightweight SDK integration if required", "HTML5 game upload", "Title", "Description", "Assets", "Category/tags"],
    adPolicyNote: "GamePix SDK lifecycle hooks are integrated only in GamePix context. The builds wire gameLoading, gameLoaded, pause/resume, and run-end ping while leaving ads to GamePix-managed review/monetization.",
    currentGate: "Dashboard account is available, but create-game submission is blocked by GamePix's explicit non-AI description requirement. Owner-written 100-500 character English copy is required before continuing.",
  },
  {
    platform: "Lagged",
    priority: 6,
    accountRequired: "Lagged developer dashboard account and likely AdSense-related payment setup after approval.",
    rationale: "Simple revenue-share platform candidate for HTML5 games. Useful as a broader-distribution test after the first two direct platform submissions.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://lagged.dev/",
    portalUrl: "https://lagged.dev/",
    docsUrl: "https://lagged.dev/",
    requiredFields: ["Developer account", "Game ZIP or game URL", "Title", "Description", "Assets", "Controls", "Category"],
    adPolicyNote: "Lagged advertises revenue share with Google AdSense; do not add ad inducement copy or forced ad walls.",
    currentGate: "Developer dashboard signup is required. Official page advertises submitting games to Lagged.com and earning 50% revenue share with Google AdSense.",
  },
  {
    platform: "GameFlare",
    priority: 7,
    accountRequired: "Contact/submission with GameFlare Distribution; payout details later if accepted.",
    rationale: "Low-friction HTML5 candidate because early-access playable games can be reviewed, hosting is free, and screenshots are optional.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://distribution.gameflare.com/developers/",
    portalUrl: "https://distribution.gameflare.com/developers/",
    docsUrl: "https://distribution.gameflare.com/developers/",
    requiredFields: ["Game files or game link", "Playable HTML5 build", "Optional screenshots", "Quality review", "Payment details after acceptance"],
    adPolicyNote: "GameFlare monetizes with its ads; keep standalone review packages ad-safe and disclose platform SDK hooks are gated.",
    currentGate: "GameFlare asks developers to send a link/game files for suitability review. Official FAQ says payout is monthly with 50 EUR minimum via PayPal or TransferWise, and revenue share is 85% on GameFlare sites or 50% on publisher sites.",
  },
  {
    platform: "Kongregate",
    priority: 8,
    accountRequired: "Kongregate account and game upload form.",
    rationale: "Useful clean-package browser portal path because some Kongregate-style submissions reject third-party ads, sponsorships, external API integrations, and embedded links. Current release now includes a separate clean ZIP.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://www.kongregate.com/games/new",
    portalUrl: "https://www.kongregate.com/games/new",
    docsUrl: "https://blog.kongregate.com/hc/en-us/articles/44395849259661-SUBMISSION-How-do-I-submit-a-game-to-Kongregate-It-s-Easy",
    requiredFields: ["Clean HTML5 ZIP", "Title", "Description", "Tags", "Instructions", "Icon/cover", "Account login"],
    adPolicyNote: "Use the clean portal ZIP, which removes third-party ad SDKs, external links, sponsorship CTAs, and remote tracking. Let Kongregate/platform-managed monetization handle ads if accepted.",
    currentGate: "Account login/upload is required. Submit the clean portal ZIP instead of the SDK adapter ZIP.",
  },
  {
    platform: "Newgrounds",
    priority: 9,
    accountRequired: "Newgrounds account and project submission.",
    rationale: "Clean feedback and community-discovery route for HTML5 games. It is not the fastest guaranteed revenue path, but it gives another zero-domain hosted play surface without direct sales.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://www.newgrounds.com/projects/games",
    portalUrl: "https://www.newgrounds.com/projects/games",
    docsUrl: "https://www.newgrounds.com/wiki/creator-resources/flash-resources/html5",
    requiredFields: ["Clean HTML5 ZIP", "Title", "Description", "Controls", "Ratings", "Tags", "Assets"],
    adPolicyNote: "Use the clean portal ZIP and keep monetization controlled by Newgrounds/platform settings after acceptance.",
    currentGate: "Account login/project creation is required. Use as a no-domain clean package route and feedback surface.",
  },
  {
    platform: "GameDistribution",
    priority: 10,
    accountRequired: "GameDistribution developer account and SDK/platform terms acceptance.",
    rationale: "Broad distribution network candidate. Both current games now include GameDistribution GD_OPTIONS, pause/resume, rewarded-completion tracking, and gated showAd calls, but dashboard gameId and legal consent still require manual account action.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://gamedistribution.com/developers/",
    portalUrl: "https://gamedistribution.com/developers/",
    docsUrl: "https://github.com/GameDistribution/GD-HTML5",
    requiredFields: ["Developer signup", "Revenue share agreement", "HTML5 build", "GameDistribution SDK if requested", "Assets", "Description"],
    adPolicyNote: "GameDistribution SDK is integrated only in GameDistribution context or when a gd_game_id is supplied. The build does not hardcode a fake gameId and does not request ads unless ads=1 is present.",
    currentGate: "Developer signup, revenue-share partnership, dashboard gameId, and legal consent are required. Public form probe found reCAPTCHA/legal checkboxes, so automated submission is not appropriate.",
  },
  {
    platform: "Poki",
    priority: 11,
    accountRequired: "Poki for Developers application/acceptance; partnership terms may be negotiated and web exclusivity can apply.",
    rationale: "High-upside but high-curation platform. Treat as a later quality bar, not the first zero-cost submission.",
    submitGames: ["Neon Lane Dash"],
    submissionUrl: "https://developers.poki.com/",
    portalUrl: "https://developers.poki.com/",
    docsUrl: "https://sdk.poki.com/deals.html",
    requiredFields: ["Developer application", "Accepted game entry", "Poki SDK", "Mandatory requirements", "Possibly web-exclusive deal terms"],
    adPolicyNote: "Poki SDK and ad break implementation should be separate and only after acceptance; do not risk existing nonexclusive platform submissions.",
    currentGate: "Poki is not the immediate route. Official docs say Poki prefers Web Exclusive deals and requires mandatory requirements plus SDK after acceptance.",
  },
  {
    platform: "GameSnacks",
    priority: 12,
    accountRequired: "GameSnacks developer access, GameSnacks SDK integration, game.json package, licensing agreement, and AdSense-linked earnings later.",
    rationale: "High-quality Google-owned HTML5 distribution route with real ad revenue infrastructure, but it is stricter than small portals and requires SDK/package compliance before submission.",
    submitGames: ["Neon Lane Dash"],
    submissionUrl: "https://developers.google.com/gamesnacks",
    portalUrl: "https://developers.google.com/gamesnacks",
    docsUrl: "https://developers.google.com/gamesnacks/developer/requirements",
    requiredFields: ["Game bundle", "game.json metadata", "Marketing assets", "GameSnacks SDK", "Ad interface opportunities", "Rights clearance", "English content", "Licensing agreement"],
    adPolicyNote: "GameSnacks ads must happen through the GameSnacks SDK at natural breaks or optional rewarded moments; no other ads, payments, sponsorships, or external promotion inside the game.",
    currentGate: "Dedicated Neon Lane Dash GameSnacks package is now ready as of 2026-06-03: release ZIP includes game.json, GameSnacks-only SDK adapter, no browser storage, no external requests, and verified marketing assets. Submission still requires GameSnacks developer access/licensing by the owner.",
  },
  {
    platform: "InstGame",
    priority: 13,
    accountRequired: "Free developer account and upload/review flow.",
    rationale: "Low-friction portal candidate: public FAQ says developers can upload HTML5/WebGL/packaged builds, basic distribution does not require SDK integration, and approval is typically 24-48 hours.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://instgame.com/",
    portalUrl: "https://instgame.com/",
    docsUrl: "https://instgame.com/about",
    requiredFields: ["Developer account", "HTML5/WebGL/package upload", "Title", "Description", "Screenshots", "Quality review", "Payout details after earnings"],
    adPolicyNote: "Use the clean portal ZIP unless InstGame asks for a platform-specific SDK; do not include standalone ad calls or external promotion.",
    currentGate: "Research-confirmed candidate only. Do not auto-create an account or submit contact/payout data without owner approval.",
  },
  {
    platform: "PLRun",
    priority: 14,
    accountRequired: "Contact form or developer portal if it returns to service; payout details only after acceptance.",
    rationale: "Parked low-friction candidate. The current site is live and links to a developer portal, but the developer page returned 410 in the latest probe, so it should not receive an automatic submission.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://plrun.com/contact/",
    portalUrl: "https://plrun.com/",
    docsUrl: "https://plrun.com/",
    requiredFields: ["Contact form", "Playable link", "Clean ZIP link if requested", "Title", "Description", "Assets", "Developer email", "Manual review"],
    adPolicyNote: "Use only the clean portal ZIP if PLRun reopens a developer upload route; do not include standalone ad calls or payout details in the first contact.",
    currentGate: "Developer portal returned 410 on 2026-06-03 while homepage/contact stayed live. Park until the portal is reachable or a human reply confirms the upload route.",
  },
  {
    platform: "GameTwiz",
    priority: 15,
    accountRequired: "Developer application form and monthly payout setup after approval.",
    rationale: "Low-friction candidate: public developer portal states HTML5 games can be reviewed in 24-48 hours, file size should be under 50MB, and approved games use revenue share.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://www.gametwiz.com/developers",
    portalUrl: "https://www.gametwiz.com/developers",
    docsUrl: "https://www.gametwiz.com/developers",
    requiredFields: ["Self-contained HTML5 package", "No external dependencies/API calls", "Title", "Description", "Assets", "Developer application", "Original/licensed content confirmation"],
    adPolicyNote: "Use the clean portal ZIP because GameTwiz asks for self-contained packages and no external dependencies or API calls.",
    currentGate: "Manual form gate. Do not submit until owner approves sending name/email and agreement confirmations.",
  },
  {
    platform: "BizziBeeArcade",
    priority: 16,
    accountRequired: "Submission form with developer name, email, rights confirmation, and revenue split agreement.",
    rationale: "Low-friction form candidate: public page says HTML5/WebGL games can be submitted for review, the platform handles hosting/ads/marketing, and developers keep 75% of ad revenue.",
    submitGames: ["Neon Lane Dash", "Upload Limit Panic"],
    submissionUrl: "https://www.bizzibeearcade.com/submit-game.html",
    portalUrl: "https://www.bizzibeearcade.com/",
    docsUrl: "https://www.bizzibeearcade.com/submit-game.html",
    requiredFields: ["Developer name", "Email", "Game title", "Genre", "Platform support", "Description", "Game URL/demo link", "Rights confirmation", "Revenue split agreement"],
    adPolicyNote: "Submit only the playable demo and clean portal package. Keep payout details out of the initial form and only use official dashboard/payment flow if accepted.",
    currentGate: "Manual owner-consent gate because the form asks for identity/contact and agreement confirmation.",
  },
  {
    platform: "BlurryGames",
    priority: 17,
    accountRequired: "Developer submission/contact, SDK/compliance review, and PayPal or bank transfer only after accepted earnings.",
    rationale: "Niche family-safe portal candidate: developer page states 50/50 ad revenue split, rewarded/display ads, dashboard stats, PayPal or bank transfer payout after $100, and strict child-safety rules.",
    submitGames: ["Neon Lane Dash"],
    submissionUrl: "https://www.blurrygames.com/developers/",
    portalUrl: "https://www.blurrygames.com/developers/",
    docsUrl: "https://www.blurrygames.com/developers/",
    requiredFields: ["HTML5/WebGL package", "File size compliance", "No external ads/tracking", "Family-safe content", "SDK review", "Contact/submission details"],
    adPolicyNote: "Only use this if the game is clearly family-safe and stripped of external ads/tracking; their SDK should handle rewarded/display ads.",
    currentGate: "Manual review route. The child-safety bar is stricter than our current broad-arcade package, so submit only after a compliance pass.",
  },
  {
    platform: "GameMonetize",
    priority: 18,
    accountRequired: "Developer account, SDK/API integration, and payment setup if accepted.",
    rationale: "Broad HTML5 distribution candidate with public developer pages and ad-revenue claims, but public information is inconsistent across .com/.co pages and community discussion raises trust/commercial caution.",
    submitGames: ["Neon Lane Dash"],
    submissionUrl: "https://gamemonetize.co/developers",
    portalUrl: "https://gamemonetize.com/",
    docsUrl: "https://gamemonetize.com/blog?category=monetize",
    requiredFields: ["Developer signup", "SDK/API integration", "HTML5 game", "Assets", "Payment method after acceptance", "Terms review"],
    adPolicyNote: "Do not integrate or upload until terms, payout identity, SDK behavior, and reputation risk are reviewed against safer candidates.",
    currentGate: "Watchlist only, not an automatic submission target. Use after mature-platform and safer low-friction candidates are exhausted.",
  },
];

const PORTAL_SUBMISSION_PACK = {
  generatedFrom: "2026-06-03 expanded HTML5 portal research",
  purpose: "Public, copy-ready submission pack for zero-cost HTML5 game distribution. It exposes playable builds, release ZIPs, clean portal packages, demo assets, current submission status, and the safety rules for ad-funded portals.",
  leadGame: "Neon Lane Dash",
  backupGame: "Upload Limit Panic",
  currentDecision: "Keep CrazyGames and Playgama as the active submitted/monitoring route, keep Neon Lane Dash GameSnacks-ready for the stricter Google-owned H5 route, and use InstGame, PLRun, GameTwiz, BizziBeeArcade, and BlurryGames as manual-consent backup portals instead of sending private details automatically.",
  candidatePolicy: [
    "Prefer official dashboards and established ad platforms before smaller form-only portals.",
    "Small portal forms often request developer name, email, rights confirmation, or revenue-split agreement; those fields need owner consent.",
    "Send only public game links, GitHub release links, ZIPs, icons, covers, demo videos, and review notes.",
    "Keep bank, card, tax, Alipay, phone, API keys, and platform credentials inside official dashboards only.",
    "If a portal forbids external ads, tracking, or links, submit the clean portal ZIP instead of SDK-adapter ZIPs.",
    "Do not claim guaranteed revenue, guaranteed approval, or artificial traffic.",
  ],
  lowFrictionResearch: [
    {
      platform: "Lagged",
      sourceUrl: "https://lagged.dev/",
      submissionSignal: "Developer dashboard for submitting games to Lagged.com.",
      monetizationSignal: "Public developer page advertises 50% revenue share with Google AdSense and SDK support for interstitials and reward ads.",
      fit: "Good next account route if CrazyGames/Playgama review stalls.",
      risk: "Requires developer account and AdSense-related setup; do not force ad impressions or clicks.",
      action: "Prepare Neon Lane Dash clean package and SDK notes, then submit only through the official dashboard.",
    },
    {
      platform: "GameSnacks",
      sourceUrl: "https://developers.google.com/gamesnacks/developer/requirements",
      submissionSignal: "Google's H5 platform requires a bundle with game files, marketing assets, game.json, and SDK integration.",
      monetizationSignal: "GameSnacks monetizes games and shares revenue under its developer licensing agreement, with ads placed through the GameSnacks SDK.",
      fit: "High-quality route now technically packaged for Neon Lane Dash.",
      risk: "Still requires developer access, licensing agreement, rights/content approval, and platform acceptance before ads can earn.",
      action: "Use the dedicated Neon Lane Dash GameSnacks ZIP and verification report when owner-access GameSnacks submission is available.",
    },
    {
      platform: "InstGame",
      sourceUrl: "https://instgame.com/about",
      submissionSignal: "Developer page describes free account, upload, metadata, screenshots, and 24-48 hour review.",
      monetizationSignal: "Public page states zero upfront publishing fees and 70-80% revenue share to developers.",
      fit: "Strong low-friction backup if owner approves account/contact use.",
      risk: "Smaller portal; payout and traffic claims should be verified inside dashboard before relying on it.",
      action: "Queue a manual submission using the clean portal ZIP and public release assets.",
    },
    {
      platform: "PLRun",
      sourceUrl: "https://plrun.com/contact/",
      submissionSignal: "Homepage and contact page are live, but the current developer portal route returned 410 in the latest probe.",
      monetizationSignal: "Not relied on in this pass because the developer portal was unavailable.",
      fit: "Parked contact-only backup, not an immediate upload route.",
      risk: "Unreachable developer portal means no automatic submission and no payout expectation.",
      action: "Use only the contact page after a manual decision, and send public demo/release links only.",
    },
    {
      platform: "GameTwiz",
      sourceUrl: "https://www.gametwiz.com/developers",
      submissionSignal: "Developer portal asks for HTML5 self-contained game packages under 50MB and 24-48 hour quality review.",
      monetizationSignal: "Portal advertises a revenue sharing program, 70% revenue share, monthly payments, and $50 minimum payout.",
      fit: "Potential fast-review backup for clean packages.",
      risk: "Manual form and identity/contact consent; no external dependencies/API calls allowed.",
      action: "Submit only the clean portal ZIP after owner approves contact and rights-confirmation fields.",
    },
    {
      platform: "BizziBeeArcade",
      sourceUrl: "https://www.bizzibeearcade.com/submit-game.html",
      submissionSignal: "Submission form asks for developer name/email, game metadata, demo link, and rights confirmation.",
      monetizationSignal: "Page advertises 75% developer share of ad revenue, with the platform handling hosting, ads, and marketing.",
      fit: "Useful backup only if a simple form submission is acceptable.",
      risk: "Small form-based portal with agreement checkbox; do not submit without owner consent.",
      action: "Keep as manual owner-consent route; never send bank or Alipay details by form.",
    },
    {
      platform: "BlurryGames",
      sourceUrl: "https://www.blurrygames.com/developers/",
      submissionSignal: "Developer page accepts HTML5/WebGL/Unity-WebGL games and describes strict technical/child-safety requirements.",
      monetizationSignal: "Page says ad revenue is split 50/50, paid monthly via PayPal or bank transfer after $100.",
      fit: "Family-safe portal candidate after content/compliance review.",
      risk: "Stricter child-safety/COPPA/GDPR-K posture; current game must be reviewed before submission.",
      action: "Run a family-safe compliance pass before any outreach.",
    },
    {
      platform: "GameMonetize",
      sourceUrl: "https://gamemonetize.co/developers",
      submissionSignal: "Developer page describes SDK integration and HTML5 distribution.",
      monetizationSignal: "Public pages mention revenue share and PayPal/bank transfer timing, but percentages vary across public pages.",
      fit: "Watchlist only because it may distribute broadly but has trust/reputation uncertainty.",
      risk: "Inconsistent public claims and community caution; avoid until safer portals are exhausted.",
      action: "Do not integrate, upload, or provide payment identity until terms and reputation are rechecked.",
    },
  ],
  notIncludedYet: [
    "Gamevoi was not added because a current official upload/developer page could not be reliably verified in this research pass.",
    "PLRun is present only as a parked contact route because its developer portal returned 410 during the latest probe.",
    "Generic 'free game portal' mirrors are ignored unless they show official developer terms, contact identity, and payout route.",
  ],
  submissionRules: [
    "Lead with Neon Lane Dash because it has broader reflex-arcade appeal than Upload Limit Panic.",
    "Use Upload Limit Panic as a second differentiated backup after the first platform gives a moderation signal.",
    "If the target portal forbids external calls, use the clean portal ZIP links and clean-package reports.",
    "Mention that ads are platform-gated and standalone builds do not force or fake ad impressions.",
    "Never paste AI-generated copy into a field that explicitly asks for non-AI or owner-written content.",
  ],
  completionGate: "Progress is real only when a platform accepts or publishes a game; goal completion still requires real plays, enabled compliant ads, and visible revenue or payout balance.",
};

const ZERO_DOMAIN_PLATFORM_STRATEGY = {
  currentDecision: "Use hosted HTML5 game platforms first instead of buying a custom domain. Platform distribution and platform-managed ads are the zero-upfront-cost path.",
  latestOperationalStatus: [
    "CrazyGames: Neon Lane Dash was submitted on 2026-06-02 with build ID 57a4b821-a761-4541-b2dc-69ced592d4d5; the next live status check needs the developer dashboard session restored after the automation browser reset.",
    "Playgama: Neon Lane Dash is still Waiting for review in the My Games dashboard, and the payouts page shows no earnings until the first game is published and players interact.",
    "Traffic check on 2026-06-03T05:23Z: the public metrics endpoint showed 274 cumulative page_view events, 16 page_view events today, 2 cumulative PDF downloads, 1 PDF download today, and no visible seller/service/audit intent events. This is early low-volume traffic, not revenue.",
    "Game package interest on 2026-06-03T05:30Z: GitHub release assets showed Neon Lane Dash HTML5 ZIP 3 downloads, Neon Lane Dash GameSnacks ZIP 4 downloads, and Upload Limit Panic HTML5 ZIP 3 downloads. These are release-download signals, not platform plays.",
    "CrazyGames payout gate: Billing is handled through Tipalti; payment setup requires owner-only mobile 2-step verification, address, payment method, and tax forms after acceptance or payout eligibility.",
    "GamePix: logged-in dashboard reached the create-game form, but the description field explicitly asks for non-AI original copy, so owner-written 100-500 character English text is required before upload.",
    "Upload Limit Panic: backup game is upgraded, deployed, and release-refreshed with Playgama ad QA gating, SDK storage, and bridge config support. Keep it ready, but do not submit it to the same active reviewing account until Neon receives a first moderation signal unless a separate portal specifically asks for a second package.",
    "2026-06-03 platform expansion: GameSnacks, InstGame, GameTwiz, BizziBeeArcade, BlurryGames, GameMonetize, and PLRun were added as researched candidates, with PLRun parked because its developer portal returned 410.",
  ],
  whyNoDomainCanStillWork: [
    "CrazyGames and Yandex Games host approved HTML5 games inside their own catalogs, so discovery and ad serving do not require a custom domain.",
    "The games already have static live previews on Cloudflare Pages, but the monetization surface is the platform embed after approval.",
    "A custom domain can improve the utility-tool site later, but it is not required to test the first game-platform revenue path.",
  ],
  immediateRoute: [
    "Restore the CrazyGames developer dashboard session only when a live review-state check is needed; do not re-upload unless moderation asks for a change.",
    "Submit Neon Lane Dash to Yandex Games second because the build now includes Yandex SDK v2 lifecycle and gated ad hooks.",
    "Monitor Neon Lane Dash on Playgama because it is already submitted and under review; unblock GamePix only with owner-written non-AI description copy.",
    "Submit the clean portal ZIP to Kongregate/Newgrounds-style portals when a platform rejects third-party ad SDKs, external links, or remote telemetry.",
    "Keep Upload Limit Panic ready as a second submission package, but avoid submitting multiple games to the same reviewing account until Neon receives a first moderation signal.",
    "Use Lagged and GameFlare as lower-friction secondary tests if the first submissions are delayed by account or moderation gates.",
    "Use the public portal submission pack as a single source for clean ZIP links, playable demos, release notes, and manual-consent backup candidates.",
    "Create itch.io mirrors only for public browser-play proof and feedback; do not treat itch as the primary ad route.",
  ],
  parkedRoutes: [
    "GameSnacks is a high-quality later route because it requires a dedicated GameSnacks SDK adapter, game.json, rights/compliance review, and licensing agreement.",
    "GameDistribution remains a later distributor test after CrazyGames, Yandex, Playgama, GamePix, and clean-portal submissions because dashboard gameId, legal consent, and manual submission are still required even though the SDK adapter is now present.",
    "Poki remains a later high-upside quality target because web exclusivity may conflict with broad nonexclusive distribution.",
    "InstGame, GameTwiz, BizziBeeArcade, BlurryGames, and PLRun are manual-consent backup portals because smaller forms can request developer identity, email, rights confirmation, revenue split agreement, or payout follow-up.",
    "GameMonetize is a watchlist route only because public claims vary and reputation/terms should be rechecked before any SDK integration or upload.",
    "Douyin mini-game is a later port because it needs extra account-side setup, domestic platform packaging, and local compliance review.",
    "Bilibili mini-game/video routes are lower priority because they require more creator operation and have a weaker no-sales advertising loop for this project.",
    "AdSense on a free subdomain remains a utility-site validation path, but it is not the fastest zero-domain first-revenue path.",
  ],
  accountsNeeded: [
    "CrazyGames developer account login to submit the ZIP and later complete payout details.",
    "Yandex Games publisher account login to create the game card, upload the archive, and later complete payment details.",
    "itch.io creator account only if we want a free browser mirror.",
    "Douyin/Bilibili accounts only after the HTML5 platform route gives a signal worth porting.",
    "Playgama developer portal account and GamePix Dashboard account are the next-best low-cost accounts after CrazyGames/Yandex; both can use the current release ZIPs.",
    "Lagged, GameFlare, and GameDistribution accounts or contact submissions are useful if primary platform moderation stalls.",
    "Kongregate and Newgrounds accounts can use the clean portal ZIP when third-party SDKs or external links are not allowed.",
    "GameSnacks, InstGame, GameTwiz, BizziBeeArcade, BlurryGames, PLRun, and GameMonetize require separate account/contact consent before any identity, rights, revenue split, or payout information is submitted.",
  ],
  officialEvidence: [
    "CrazyGames Basic Launch disables ads and revenue share at first, and ads must be requested only through the CrazyGames SDK.",
    "CrazyGames quality guidance emphasizes quick onboarding, clear goals, responsive controls, and visually consistent game presentation.",
    "Yandex upload docs require SDK connection, a developer account in the Console, a separate draft per game, and moderation submission.",
    "Yandex monetization docs describe internal advertising, interstitial blocks, rewarded blocks, sticky banners, payments, and statistics.",
    "Playgama describes no upfront costs, HTML5 ZIP upload, Bridge SDK integration, partner distribution, ad/IAP monetization, revenue share, and withdrawal methods.",
    "GamePix describes account creation, lightweight SDK integration, HTML5 hosting, QA, partner distribution, and a 45% developer revenue share.",
    "Playgama Plain JS docs require Bridge initialization, game_ready messaging, pause/audio state handling, interstitials at natural pauses, and rewarded-state confirmation before granting a reward.",
    "GamePix public SDK exposes gameLoading, gameLoaded, ping, pause, and resume callbacks; the current builds integrate those lifecycle hooks without guessing undocumented ad calls.",
    "GameDistribution SDK docs require GD_OPTIONS with dashboard gameId, pause/resume handling, user-input ad calls, and SDK_REWARDED_WATCH_COMPLETE before granting rewarded benefits.",
    "Lagged advertises developer game submissions and 50% revenue share with Google AdSense.",
    "GameFlare says it accepts HTML5 games, can review playable early-access games, offers free hosting, and pays monthly after a 50 EUR minimum.",
    "Kongregate submission guidance accepts browser-playable game uploads and is conservative about third-party ads or sponsorships inside uploaded games.",
    "Newgrounds is a clean HTML5 community-hosted route; use it for no-domain discovery and feedback rather than treating it as guaranteed revenue.",
    "Poki documentation says SDK integration is mandatory after acceptance and that Poki prefers Web Exclusive deals.",
    "GameSnacks requirements require a compliant package, game.json, SDK integration, marketing assets, rights clearance, and ad opportunities managed through the GameSnacks SDK.",
    "InstGame public pages describe free developer publishing, 24-48 hour approval, zero upfront fees, no lock-in, and 70-80% developer revenue share.",
    "GameTwiz developer portal describes HTML5 self-contained packages, 24-48 hour quality review, 70% revenue share, monthly payments, and a $50 minimum payout.",
    "BizziBeeArcade's submit page asks for developer identity/contact, game metadata, demo link, rights confirmation, and revenue split agreement while advertising a 75% developer ad-revenue share.",
    "BlurryGames developer page describes HTML5/WebGL publishing, 50/50 ad revenue split, rewarded/display ads, child-safety compliance, and PayPal or bank transfer after $100.",
    "GameMonetize public pages describe HTML5 distribution and 45% revenue share, but it remains a watchlist candidate because public claims and trust signals need extra review.",
    "PLRun homepage/contact is live, but the current developer portal returned 410 on 2026-06-03, so it is parked until the upload route is restored.",
  ],
  moneyGate: "The goal is not complete until at least one platform accepts a game, real plays are visible in platform analytics, ad monetization is enabled, and revenue or payout balance is verified.",
};

const ZERO_COST_MONETIZATION_MAP = {
  generatedFrom: "2026-06-02 platform research and current package state",
  conclusion: "Without buying a domain, the fastest honest monetization path is hosted HTML5 game platforms with platform-managed ads. Free subdomain websites are useful for proof and utility traffic, but they are weaker for immediate ad approval and cannot legally force ad impressions. Domestic mini-game ports are worth preparing after the overseas ZIP path is submitted because they add account, packaging, and compliance gates.",
  routes: [
    {
      route: "Hosted HTML5 game platforms",
      priority: 1,
      status: "active_mainline",
      zeroDomain: true,
      needsCustomDomain: false,
      needsSales: false,
      canShowRewardedAds: true,
      expectedFirstSignal: "Dashboard submitted/in-review status, platform reply, accepted game, then plays and ad revenue after eligibility. Current public site metrics show only early low-volume traffic, not platform play traffic.",
      why: "Platforms host the game and own the ad surface, so we do not need a purchased domain or AdSense site approval first.",
      currentAssets: ["Neon Lane Dash ZIP", "Upload Limit Panic ZIP", "SDK adapters", "mobile/desktop screenshots", "review-readiness reports"],
      blockers: ["CrazyGames dashboard session restore for live status checks", "Yandex publisher login", "GamePix non-AI description copy", "CAPTCHA/legal forms", "payout setup after approval", "moderation wait"],
      nextAction: "Monitor Playgama review, restore CrazyGames dashboard access for live status checks, and keep Upload Limit Panic as the ready backup package until Neon gets a review signal.",
    },
    {
      route: "Douyin mini-game port",
      priority: 2,
      status: "prepare_after_mainline_submission",
      zeroDomain: true,
      needsCustomDomain: false,
      needsSales: false,
      canShowRewardedAds: true,
      expectedFirstSignal: "Mini-game app created, package uploaded, ad unit IDs available, review submitted.",
      why: "Douyin has huge domestic casual-game traffic and official mini-game ad monetization, including rewarded video. It can monetize through platform ads without direct sales.",
      currentAssets: ["Existing HTML5 game logic can be ported", "Rewarded assist design already exists", "Ad safety rules are documented in the current build"],
      blockers: ["Douyin Open Platform developer account", "real-name/entity and settlement setup", "mini-game appId", "ad unit IDs", "ByteDance mini-game packaging/testing"],
      nextAction: "After overseas submissions are in review, create a Douyin mini-game developer app and port Neon Lane Dash controls/rewarded assist into the Douyin runtime.",
    },
    {
      route: "Bilibili mini-game port",
      priority: 3,
      status: "backup_domestic_route",
      zeroDomain: true,
      needsCustomDomain: false,
      needsSales: false,
      canShowRewardedAds: true,
      expectedFirstSignal: "Bilibili mini-game account/app draft and package review status.",
      why: "Bilibili mini-games can run through the platform with incentive video ads, but traffic and account gates are less direct than Douyin for this project.",
      currentAssets: ["Existing HTML5 game logic can be ported", "No-server gameplay avoids ICP/domain complications"],
      blockers: ["Bilibili mini-game account", "appId", "ad unit IDs", "review metadata", "server domain/ICP only if remote services are added"],
      nextAction: "Keep pure front-end gameplay, avoid server requests, then port only if Douyin or overseas platforms show demand.",
    },
    {
      route: "Free subdomain utility site with ads",
      priority: 4,
      status: "secondary_validation",
      zeroDomain: true,
      needsCustomDomain: false,
      needsSales: false,
      canShowRewardedAds: false,
      expectedFirstSignal: "Search impressions, downloads, and eventual ad-network approval, not instant revenue.",
      why: "Cloudflare Pages, GitHub Pages, Netlify, Vercel, and similar hosts provide free subdomains. They are good for content and utility validation, but display ads need review and cannot be used as an ad-view gate.",
      currentAssets: ["PrintableTools Lab", "Search Console verification", "content pages", "tool pages"],
      blockers: ["AdSense/ad-network review", "traffic ramp", "free subdomain review uncertainty", "no incentivized ad interaction behavior"],
      nextAction: "Keep the tool site as a discovery/SEO asset while games pursue platform-managed ads.",
    },
    {
      route: "Low-quality short-video or repost channel",
      priority: 5,
      status: "rejected_for_risk",
      zeroDomain: true,
      needsCustomDomain: false,
      needsSales: false,
      canShowRewardedAds: false,
      expectedFirstSignal: "Account views may appear, but monetization is fragile and enforcement risk is high.",
      why: "Automated low-quality or repost-style content can violate platform policies, burns account trust, and is not a clean path to stable verified revenue.",
      currentAssets: [],
      blockers: ["platform enforcement", "creator monetization thresholds", "manual content operations", "low trust"],
      nextAction: "Do not use this as the core route; use short videos only as compliant promotion for accepted games or useful free tools.",
    },
  ],
  freeDomainOptions: [
    {
      provider: "Cloudflare Pages",
      freeHost: "pages.dev",
      useNow: "Already in use for live previews and the utility site.",
      monetizationFit: "Good for validation and previews; not the fastest route for display-ad income.",
    },
    {
      provider: "GitHub Pages",
      freeHost: "github.io",
      useNow: "Useful as a mirror or proof page.",
      monetizationFit: "Can host static pages, but ad approval still depends on network review and content quality.",
    },
    {
      provider: "Netlify",
      freeHost: "netlify.app",
      useNow: "Possible mirror if Cloudflare has an outage or platform rejects pages.dev preview links.",
      monetizationFit: "Similar to other free static hosts; not a magic ad-approval shortcut.",
    },
    {
      provider: "Vercel",
      freeHost: "vercel.app",
      useNow: "Possible mirror for static or light serverless pages.",
      monetizationFit: "Good hosting, but ad review and traffic remain the hard parts.",
    },
  ],
  adGateRules: [
    "Do not make users interact with ads before basic gameplay; rewarded ads must be optional assists such as continue, hint, shield, or bonus.",
    "Do not ask users to interact with ads or imply clicks support the project.",
    "Do not hide core controls behind display ads on a website; AdSense-style display ads are not rewarded-ad gates.",
    "Keep standalone builds ad-disabled until a platform accepts the game and provides approved ad context or ad unit IDs.",
    "Payment and bank details should stay inside official platform payout dashboards, not emails or front-end code.",
  ],
  accountsNeeded: [
    "CrazyGames developer dashboard login for first overseas submission.",
    "Yandex Games publisher account for second overseas submission.",
    "Playgama developer portal and GamePix dashboard accounts for secondary distribution.",
    "Douyin Open Platform mini-game account, appId, and ad unit IDs only if we start the domestic port.",
    "Bilibili mini-game developer account, appId, and ad unit IDs only if we start the Bilibili port.",
  ],
  sources: [
    "Douyin mini-game official revenue and ad docs describe platform ad monetization and rewarded video flows.",
    "Bilibili mini-game official docs describe account/app setup and rewarded video ad components.",
    "AdSense policy forbids encouraging ad interactions; website display ads are not a compliant use-gate.",
    "Cloudflare Pages, GitHub Pages, Netlify, and Vercel provide free project subdomains, but they do not remove ad-network approval requirements.",
  ],
  moneyGate: "This route is still incomplete until a platform-hosted game is accepted, real play data appears, ads are enabled by the platform, and revenue or payout balance is visible.",
};

const PLATFORM_OUTREACH_TRACKER = {
  generatedFromProbe: "2026-06-02 platform-entry-probe",
  generatedFromFormProbe: "2026-06-02 platform-form-probe",
  purpose: "Public-contact and low-login outreach tracker for moving HTML5 games toward platform review before full payout setup is available.",
  leadGame: "Neon Lane Dash",
  backupGame: "Upload Limit Panic",
  latestOperationalStatus: [
    "Playgama outreach is no longer needed for Neon Lane Dash because the dashboard submission is under review.",
    "Playgama payouts currently show no earnings because the first game is not live yet; earnings appear only after publishing and player interaction.",
    "CrazyGames payout setup is a later Tipalti owner-only flow requiring mobile 2-step verification, address, payment method, and tax forms.",
    "GamePix dashboard is logged in but blocked by a platform instruction requiring non-AI original description copy.",
    "Payment data remains dashboard-only and should not be sent over email.",
  ],
  rules: [
    "Send only live preview, GitHub release, ZIP link, screenshots, and demo video; do not send private keys or account tokens.",
    "Do not promise exclusivity unless the platform explicitly negotiates it and other submissions are paused.",
    "Do not ask for ad interactions, ad impressions, fake engagement, or artificial traffic.",
    "Keep payment details for platform dashboards only; do not email bank or Alipay account data.",
  ],
  channels: [
    {
      platform: "Playgama",
      priority: 1,
      method: "public email plus developer portal signup",
      contact: "developer.success@playgama.com",
      submissionUrl: "https://developer.playgama.com/auth?utm_source=landing",
      evidence: "Dashboard submission completed on 2026-06-02 after certification passed SDK init, storage save/restore, and interstitial ad checks.",
      status: "submitted_under_review",
      nextAction: "No email needed for Neon Lane Dash now. Monitor Playgama dashboard moderation and respond only if QA requests changes.",
      subject: "HTML5 game submission: Neon Lane Dash",
      body: outreachBody("Playgama"),
    },
    {
      platform: "GameDistribution",
      priority: 2,
      method: "public partnership email plus partnership form",
      contact: "partnership@azerion.com",
      submissionUrl: "https://gamedistribution.com/developers/partnership/",
      evidence: "Probe found public partnership email and forms on GameDistribution partnership page. Form probe found registration fields plus reCAPTCHA and legal checkboxes, so automated form submission is not appropriate.",
      status: "ready_to_email",
      nextAction: "Email Neon Lane Dash as a nonexclusive HTML5 review package and ask which SDK wrapper is required. Use the web form only manually because it has reCAPTCHA and legal checkboxes.",
      subject: "HTML5 game partnership review: Neon Lane Dash",
      body: outreachBody("GameDistribution"),
    },
    {
      platform: "GamePix",
      priority: 3,
      method: "developer page form/dashboard",
      contact: "No public email found in probe",
      submissionUrl: "https://partners.gamepix.com/developers",
      evidence: "Dashboard is accessible and create-game modal is available. The description field explicitly warns not to use AI-generated text, so automated copy insertion was stopped for account-safety reasons.",
      status: "blocked_non_ai_description_required",
      nextAction: "Owner writes a unique 100-500 character English description in the dashboard, then upload the Neon Lane Dash ZIP and assets.",
      subject: "HTML5 game submission: Neon Lane Dash",
      body: outreachBody("GamePix"),
    },
    {
      platform: "Lagged",
      priority: 4,
      method: "developer signup",
      contact: "No public email found in probe",
      submissionUrl: "https://lagged.dev/signup",
      evidence: "Probe found login and Join Now links on Lagged developer dashboard.",
      status: "signup_required",
      nextAction: "Create developer account, then submit Neon Lane Dash ZIP and screenshots.",
      subject: "HTML5 game submission: Neon Lane Dash",
      body: outreachBody("Lagged"),
    },
    {
      platform: "GameFlare",
      priority: 5,
      method: "protected developer page/contact after browser challenge",
      contact: "Protected by Cloudflare challenge in probe",
      submissionUrl: "https://distribution.gameflare.com/developers/",
      evidence: "Probe reached a protected page; prior official FAQ indicates review by link/game files and revenue share.",
      status: "manual_browser_required",
      nextAction: "Open the protected page manually or with an authenticated browser, then submit playable link and ZIP.",
      subject: "HTML5 game review: Neon Lane Dash",
      body: outreachBody("GameFlare"),
    },
    {
      platform: "Poki",
      priority: 6,
      method: "developer application",
      contact: "No public email found in probe",
      submissionUrl: "https://app.poki.dev/signin/",
      evidence: "Probe found Poki developer guide and sign-in link; docs indicate stricter partnership requirements.",
      status: "later_quality_target",
      nextAction: "Delay until Neon Lane Dash has platform traction or a higher-production build.",
      subject: "HTML5 game pitch: Neon Lane Dash",
      body: outreachBody("Poki"),
    },
  ],
};

const PLATFORM_SUBMIT_COCKPIT = {
  generatedFrom: "2026-06-02 release assets and official platform requirements",
  objective: "Move from zero-domain prototypes to accepted platform games with platform-managed advertising.",
  leadGame: "Neon Lane Dash",
  backupGame: "Upload Limit Panic",
  latestOperationalStatus: {
    lastUpdated: "2026-06-03T05:30:32.000Z",
    submitted: [
      "CrazyGames: Neon Lane Dash was submitted on 2026-06-02 with build ID 57a4b821-a761-4541-b2dc-69ced592d4d5. The next live status check needs the developer dashboard session restored after the automation browser reset.",
      "Playgama: Neon Lane Dash is still Waiting for review in the My Games dashboard after passing SDK init, storage restore, and interstitial ad certification.",
    ],
    readyBackup: [
      "Upload Limit Panic: deployed at https://upload-limit-panic.pages.dev/ and release ZIP refreshed to 53632 bytes with Playgama bridge config, storage sync, and SDK-context ad QA gating. Keep it ready as backup; do not submit it to the same active reviewing account until Neon receives a first moderation signal unless a separate portal specifically asks for a second package.",
    ],
    trafficSignals: [
      "PrintableTools Lab public /api/metrics check on 2026-06-03T05:23Z showed 274 cumulative page_view events, 16 page_view events today, 2 cumulative PDF downloads on invoice-generator, 1 PDF download today, 0 generation events, and no visible seller/service/audit intent events.",
      "GitHub release download counts on 2026-06-03T05:30Z showed Neon Lane Dash HTML5 ZIP 3 downloads, Neon Lane Dash GameSnacks ZIP 4 downloads, and Upload Limit Panic HTML5 ZIP 3 downloads. Treat these as package-interest signals, not platform plays or revenue.",
      "Directory monitor on 2026-06-03T03:24Z found NoLogin.tools publicly listed at https://nologin.tools/tool/printable-tools-lab-pages-dev; Zearches, ListAi.cc, NoSignupTools, FreeNoSignup, and NoSubscription.org still showed pending/not matched.",
    ],
    blocked: [
      "GamePix: dashboard account is available, but the create-game form explicitly requires a unique non-AI description. Owner-written 100-500 character English copy is required before submission.",
      "Yandex Games: publisher console remains parked behind the login/postregistration flow, so no draft should be claimed until that session is usable.",
    ],
    statusCheckGates: [
      "CrazyGames: Edge automation session check on 2026-06-02T18:27Z redirected to the login page, so the previously confirmed submitted build should be treated as the last verified CrazyGames state until dashboard access is restored.",
      "CrazyGames: Browser check on 2026-06-03T05:30Z showed the public/logged-out developer portal, so no newer review feedback, acceptance, rejection, or payout signal was visible.",
      "Playgama: My Games snapshot on 2026-06-02T17:34:37Z showed Neon Lane Dash as Waiting for review.",
      "Playgama: Edge automation session check on 2026-06-02T18:27Z redirected to the login page, so the next live review-state check also needs the developer dashboard session restored.",
      "Playgama: Browser check on 2026-06-03T05:30Z showed the login page, so no newer moderation, payout, or earnings signal was visible.",
    ],
    payoutGates: [
      "CrazyGames: Billing says payments are handled through Tipalti. Manage Payment Details requires owner-only 2-step verification with a mobile number, then Address, Payment Method, Tax Forms, and Done.",
      "Playgama: Payouts page on 2026-06-02T18:10:40Z says there is nothing to earn from yet; earnings appear after the first game is published and players interact.",
      "All payment, tax, bank, card, and Alipay-linked settlement details must stay inside official platform payout dashboards and should not be emailed, committed, or placed in site code.",
    ],
    notRevenueYet: "No platform revenue should be expected until a submitted game is accepted, real plays appear in platform analytics, ads are enabled, and a payout balance is visible. Current traffic and release-download signals are not revenue.",
  },
  notAutomatable: [
    "Dashboard signup, email verification, identity checks, payout profile, legal checkboxes, and CAPTCHA must be completed by the account owner.",
    "No platform should receive bank, Alipay, API token, or private credential details by email.",
    "No flow should request fake plays, fake ad impressions, or incentivized ad interactions.",
  ],
  readyAssets: {
    neonLaneDashZip: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-html5.zip",
    neonLaneDashGameSnacksZip: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-gamesnacks.zip",
    neonLaneDashGameSnacksVerification: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/gamesnacks-verification.json",
    uploadLimitPanicZip: "https://github.com/yanqr213/upload-limit-panic/releases/download/platform-submission-v1/upload-limit-panic-html5.zip",
    neonLaneDashCopy: "https://github.com/yanqr213/neon-lane-dash/blob/main/reports/platform-submission-copy.md",
    uploadLimitPanicCopy: "https://github.com/yanqr213/upload-limit-panic/blob/main/reports/platform-submission-copy.md",
    neonLaneDashRelease: "https://github.com/yanqr213/neon-lane-dash/releases/tag/platform-submission-v1",
    uploadLimitPanicRelease: "https://github.com/yanqr213/upload-limit-panic/releases/tag/platform-submission-v1",
  },
  checklist: [
    {
      platform: "GameSnacks",
      rank: 0,
      currentStatus: "package_ready_developer_access_required",
      automationLevel: "owner_access_required",
      nextAction: "Use the Neon Lane Dash GameSnacks ZIP only inside an official GameSnacks developer/licensing flow; do not email private payout, tax, bank, or Alipay-linked details.",
      whyNow: "This is the highest-quality ad infrastructure route after the current platform submissions: the package now has game.json, GameSnacks-only SDK adapter, storage/audio/score/ad lifecycle hooks, and verified marketing assets.",
      manualRequirements: ["GameSnacks developer access or application", "Licensing agreement", "Rights/content confirmation", "Package upload", "Ad opportunity review", "AdSense-linked earnings later if accepted"],
      useGame: "Neon Lane Dash",
      uploadZip: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-gamesnacks.zip",
      copyPack: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/gamesnacks-verification.json",
      successSignal: "GameSnacks developer/licensing flow accepts the package for review, or returns QA changes to fix.",
      riskControl: "The dedicated package strips external links, remote tracking, other platform SDK loaders, localStorage/sessionStorage/IndexedDB/cookies, and uses GameSnacks SDK ads/storage only.",
    },
    {
      platform: "CrazyGames",
      rank: 1,
      currentStatus: "submitted_awaiting_review",
      automationLevel: "monitor_review",
      nextAction: "Restore the CrazyGames dashboard session for the next live status check, then monitor review status and prepare payout details only after acceptance or ad eligibility.",
      whyNow: "Best first moderation signal for a short reflex HTML5 game; the build already has CrazyGames SDK loading/gameplay hooks and hidden external links in platform context.",
      manualRequirements: ["CrazyGames developer login", "Game card creation", "ZIP upload", "Icon/cover selection", "Review submission", "Payout profile later after acceptance/ad eligibility"],
      useGame: "Neon Lane Dash",
      uploadZip: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-html5.zip",
      copyPack: "https://github.com/yanqr213/neon-lane-dash/blob/main/reports/platform-submission-copy.md",
      successSignal: "Already submitted on 2026-06-02; dashboard shows awaiting review. Next signal is accepted, rejected, live, or change request.",
      riskControl: "Tipalti payout setup requires owner-only mobile 2-step verification and later address/payment/tax forms. Do not enter private payout data outside the official dashboard and do not enable standalone ads.",
    },
    {
      platform: "Yandex Games",
      rank: 2,
      currentStatus: "ready_for_dashboard_upload",
      automationLevel: "manual_login_required",
      nextAction: "Create a Yandex Games app draft, upload Neon Lane Dash ZIP first, then Upload Limit Panic if the first draft is accepted or in review.",
      whyNow: "Second zero-domain catalog with platform ads; current builds include Yandex SDK v2 LoadingAPI, GameplayAPI, and gated ad calls.",
      manualRequirements: ["Yandex publisher account", "App draft", "Age/content metadata", "ZIP upload", "Moderation submission", "Payout setup when eligible"],
      useGame: "Neon Lane Dash first; Upload Limit Panic second",
      uploadZip: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-html5.zip",
      copyPack: "https://github.com/yanqr213/neon-lane-dash/blob/main/reports/platform-submission-copy.md",
      successSignal: "Game draft submitted to moderation or accepted in the Yandex Games console.",
      riskControl: "No external CTA is visible in Yandex context; ad calls require platform readiness and ads=1.",
    },
    {
      platform: "Playgama",
      rank: 3,
      currentStatus: "submitted_under_review",
      automationLevel: "monitor_review",
      nextAction: "Monitor Playgama moderation and payouts. The game is still Waiting for review; payouts show no earnings until the first game is published and players interact.",
      whyNow: "No upfront-cost HTML5 distribution route; current builds include Playgama Bridge, game_ready messaging, pause/audio listeners, interstitial placement, and rewarded-state confirmation.",
      manualRequirements: ["Developer portal signup if not using first-contact email", "ZIP upload", "Bridge config review if requested", "Payout setup after approval/earnings"],
      useGame: "Neon Lane Dash",
      uploadZip: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-html5.zip",
      copyPack: "https://github.com/yanqr213/neon-lane-dash/blob/main/reports/platform-submission-copy.md",
      successSignal: "Already submitted through the Playgama dashboard on 2026-06-02. Next signal is accepted, rejected, live, or QA change request.",
      riskControl: "Playgama ads are enabled only in Playgama context and only at natural breaks; payout expectations stay at zero until the game is live and real plays generate platform-side data.",
    },
    {
      platform: "GamePix",
      rank: 4,
      currentStatus: "blocked_non_ai_description_required",
      automationLevel: "owner_micro_copy_required",
      nextAction: "Write a unique 100-500 character English description personally in the GamePix dashboard, then resume the upload with the Neon Lane Dash ZIP and assets.",
      whyNow: "GamePix advertises hosting, QA, partner distribution, and 45% developer revenue share; current builds include GamePix loading/pause/resume/ping lifecycle hooks.",
      manualRequirements: ["GamePix dashboard account", "Owner-written non-AI game description", "ZIP upload", "Metadata", "Assets", "QA/review", "Payment details after acceptance"],
      useGame: "Neon Lane Dash",
      uploadZip: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-html5.zip",
      copyPack: "https://github.com/yanqr213/neon-lane-dash/blob/main/reports/platform-submission-copy.md",
      successSignal: "Dashboard accepts the create-game step and advances to asset/package upload or QA.",
      riskControl: "Do not paste AI-written marketing text into the GamePix description field; only documented GamePix lifecycle hooks are integrated and no guessed ad method is called.",
    },
    {
      platform: "GameDistribution",
      rank: 5,
      currentStatus: "sdk_ready_but_manual_legal_gate",
      automationLevel: "manual_form_required",
      nextAction: "Use the partnership email first, then complete the web form manually because it has reCAPTCHA and legal checkboxes. Add dashboard gameId later if provided.",
      whyNow: "SDK adapter is now present, but the platform requires dashboard gameId and legal consent before full activation.",
      manualRequirements: ["Developer signup", "Legal terms consent", "reCAPTCHA", "Dashboard gameId", "Revenue-share setup", "SDK activation iframe check"],
      useGame: "Neon Lane Dash",
      uploadZip: "https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-html5.zip",
      copyPack: "https://github.com/yanqr213/neon-lane-dash/blob/main/reports/platform-submission-copy.md",
      successSignal: "Partnership reply, dashboard gameId issued, or SDK activation view passes.",
      riskControl: "No fake gameId is hardcoded; gdsdk.showAd is gated behind GameDistribution context and ads=1.",
    },
  ],
  morningExpectation: "The realistic overnight state is review-waiting, not instant cash: Neon Lane Dash is submitted on the active platform route, Playgama still shows Waiting for review, CrazyGames payout setup is a later Tipalti owner-only gate, and Upload Limit Panic remains a validated backup package.",
};

const SHARE_KIT_FEATURED_LINKS = [
  ["Upload limit fixer", "upload-limit-fixer", "Task-first entry for users blocked by file size, format, or photo dimension limits."],
  ["Image size reducer in KB", "image-size-reducer-in-kb", "Hub for exact image and photo file-size limits from 10KB to 500KB."],
  ["PDF size reducer", "pdf-size-reducer", "Hub for exact PDF upload limits including 500KB, 1MB, 2MB, and 5MB."],
  ["Compress image to 20KB", "compress-image-to-20kb", "Strict exam, profile, and application photo size limit intent."],
  ["Fix passport photo size", "passport-photo-size-fixer", "Urgent ID-style photo crop, resize, and file-size workflow."],
  ["Compress PDF to 1MB", "compress-pdf-to-1mb", "Urgent upload-limit search for job, school, email, and portal PDFs."],
  ["Compress PDF to 500KB", "compress-pdf-to-500kb", "Strict form and government-style upload limit intent."],
  ["Compress image to 100KB", "compress-image-to-100kb", "Common profile, exam, job, and form image-size limit."],
  ["Compress image to 50KB", "compress-image-to-50kb", "Severe image upload limit for small photos and documents."],
  ["PDF to JPG without upload", "pdf-to-jpg-no-upload", "Works when a form accepts image files but rejects PDF."],
  ["Remove background without upload", "remove-background-no-upload", "Simple transparent PNG workflow for product photos, logos, and signatures."],
  ["Free QR code generator", "free-qr-code-generator-no-signup", "Fast static QR code for signs, menus, flyers, and labels."],
  ["Free invoice generator", "free-invoice-generator-no-signup", "Small-business PDF document with no signup and no hidden export fee."],
];

const SHARE_KIT_POSTS = [
  {
    channel: "short-video",
    title: "Fix a blocked upload",
    hook: "File upload rejected for size, format, or photo dimensions?",
    body: "Start with the upload limit fixer. It points to the no-upload PDF compressor, image-to-KB compressor, image resizer, passport photo cropper, PDF-to-JPG converter, and image-to-PDF tools.",
    cta: "Fix an upload limit",
    linkPath: "upload-limit-fixer",
  },
  {
    channel: "short-video",
    title: "Exam photo under 20KB",
    hook: "Application photo must be under 20KB?",
    body: "Use the no-upload image-to-KB compressor with the 20KB target, then review the downloaded JPG before submitting it to the exam, school, or application portal.",
    cta: "Compress an image to 20KB",
    linkPath: "compress-image-to-20kb",
  },
  {
    channel: "short-video",
    title: "Fix an ID photo size",
    hook: "Photo rejected for dimensions or file size?",
    body: "Start with the passport photo size fixer. It points to the local crop, resize, and image-to-KB tools so the file can match a portal's photo rules without uploading the original.",
    cta: "Fix a passport-style photo",
    linkPath: "passport-photo-size-fixer",
  },
  {
    channel: "short-video",
    title: "Upload limit fix: PDF under 1MB",
    hook: "Portal says your PDF must be under 1MB?",
    body: "Open the no-upload PDF compressor, choose the 1MB target, select your PDF, and download a smaller copy from the browser. It works best for scans and image-heavy PDFs.",
    cta: "Try the free 1MB PDF compressor",
    linkPath: "compress-pdf-to-1mb",
  },
  {
    channel: "short-video",
    title: "Image under 100KB",
    hook: "Job form rejecting your photo because it is over 100KB?",
    body: "Use the local image-to-KB compressor, pick 100KB, and download a smaller JPG or WebP without uploading the original photo.",
    cta: "Compress an image to 100KB",
    linkPath: "compress-image-to-100kb",
  },
  {
    channel: "community",
    title: "No-upload file utility pack",
    hook: "I made a free no-signup file utility site for common upload blockers.",
    body: "It handles PDF compression targets, image-to-KB targets, PDF-to-JPG, image resizing, QR codes, invoices, labels, and small business PDFs in the browser. Downloads are free during validation and not gated behind ad interactions.",
    cta: "Useful feedback is which tool solved a real blocked-upload moment.",
    linkPath: "free-pdf-tools",
  },
  {
    channel: "directory",
    title: "Directory listing blurb",
    hook: "Free browser PDF, image, and QR tools without signup.",
    body: "PrintableTools Lab helps users create and edit practical files locally: compress PDFs to target sizes, compress images to KB limits, convert PDF pages to JPG, resize and convert images, make static QR codes, and generate invoices, receipts, labels, business cards, and other everyday PDFs.",
    cta: "List as a free productivity and file utility tool.",
    linkPath: "submit-directory",
  },
  {
    channel: "game-platform",
    title: "Zero-domain HTML5 game experiment",
    hook: "Upload Limit Panic turns upload limits into a 60-second sorting game.",
    body: "It is a free standalone HTML5 build for platform review: sort files into Compress, Convert, Send, or Trash before the queue bursts. The standalone version has no forced ads; rewarded hooks are optional for future platform SDK approval.",
    cta: "Play the Upload Limit Panic prototype",
    absoluteUrl: ZERO_DOMAIN_GAME_EXPERIMENT.url,
  },
  {
    channel: "game-platform",
    title: "Second zero-domain HTML5 game experiment",
    hook: "Neon Lane Dash is a 45-second lane-switching reflex game.",
    body: "It is a free standalone HTML5 build for platform review: switch lanes, collect sparks, dodge blockers, and use focus for a short slow-road assist. The standalone version has no forced ads; rewarded hooks are optional for future platform SDK approval.",
    cta: "Play the Neon Lane Dash prototype",
    absoluteUrl: "https://neon-lane-dash.pages.dev/",
  },
];

const ORGANIC_PUSH_TASKS = [
  {
    id: "community-pdf-1mb",
    channel: "community",
    title: "Helpful reply for PDF under 1MB questions",
    trigger: "Use only when someone asks how to make a PDF smaller for a job, school, email, or form upload.",
    linkPath: "compress-pdf-to-1mb",
    utmSource: "community",
    campaign: "upload_error_cheatsheet",
    copy: "If the portal says your PDF must be under 1MB, this free browser tool can try compressing scans or image-heavy PDFs locally: {url}. Check the result before submitting, because very small targets can reduce quality.",
    successSignal: "One real visitor lands from community UTM and downloads a PDF after the reply.",
    riskRule: "Do not post in unrelated threads, do not claim guaranteed compression, and do not use private documents as examples.",
  },
  {
    id: "community-image-100kb",
    channel: "community",
    title: "Helpful reply for 100KB photo upload questions",
    trigger: "Use when a job, exam, school, or profile form rejects an image because it is over 100KB.",
    linkPath: "compress-image-to-100kb",
    utmSource: "community",
    campaign: "upload_error_cheatsheet",
    copy: "For a 100KB image limit, this free no-signup browser tool can compress an image locally: {url}. Review the preview before uploading it anywhere, especially for ID-style photos.",
    successSignal: "One image-tool visitor arrives from community UTM and triggers a download.",
    riskRule: "Do not ask users to share IDs, faces, payment documents, or private files publicly.",
  },
  {
    id: "directory-free-file-tools",
    channel: "directory",
    title: "Directory listing for free no-signup file tools",
    trigger: "Use on directories that accept free productivity, PDF, image, QR, or no-signup tools.",
    linkPath: "submit-directory",
    utmSource: "directory",
    campaign: "free_tool_depth",
    copy: "PrintableTools Lab is a free no-signup browser utility site for common PDF, image, QR, and paperwork tasks: compression targets, PDF-to-JPG, image-to-PDF, QR codes, invoices, receipts, labels, flyers, resumes, and more. Listing URL: {url}",
    successSignal: "Directory referral appears in live metrics or directory monitor moves from pending to listed.",
    riskRule: "Use truthful free-tool claims only; do not resubmit duplicates or imply official endorsement.",
  },
  {
    id: "support-upload-errors",
    channel: "support-thread",
    title: "Support thread resource for exact upload errors",
    trigger: "Use where support communities allow a resource link for file-size, file-type, or image-dimension rejection messages.",
    linkPath: "upload-error-cheatsheet",
    utmSource: "community",
    campaign: "upload_error_cheatsheet",
    copy: "I keep a free upload-error cheatsheet for common messages like PDF under 1MB, image under 500KB, JPG under 200KB, PNG screenshot too large, invalid JPG/PNG type, and resume PDF too large: {url}",
    successSignal: "Upload-error-cheatsheet UTM visits increase and at least one visitor clicks into a fixer page.",
    riskRule: "Only share as a relevant resource; do not mass-post or ask for ad clicks.",
  },
  {
    id: "short-video-pdf-500kb",
    channel: "short-video",
    title: "Short demo for strict 500KB PDF forms",
    trigger: "Use for a 15-30 second silent demo on Shorts, TikTok, Bilibili, Douyin, or Reels.",
    linkPath: "compress-pdf-to-500kb",
    utmSource: "short-video",
    campaign: "zero_cost_push",
    copy: "Hook: Form says PDF must be under 500KB? Show a generic PDF, choose the 500KB target, download the result, and remind viewers to check readability. Link: {url}",
    successSignal: "Short-video UTM produces at least one PDF download or returning page view.",
    riskRule: "Use generic sample files only and avoid guaranteed approval language.",
  },
  {
    id: "short-video-pdf-to-jpg",
    channel: "short-video",
    title: "Short demo for PDF not accepted, JPG required",
    trigger: "Use when the content angle is forms that accept images but reject PDFs.",
    linkPath: "pdf-not-accepted-jpg-required",
    utmSource: "short-video",
    campaign: "zero_cost_push",
    copy: "Hook: Website rejects PDF but asks for JPG? Show PDF pages converted to images locally in the browser, then download the image files. Link: {url}",
    successSignal: "Short-video UTM produces a visit to the PDF-to-image workflow.",
    riskRule: "Do not use real private forms, IDs, medical, legal, or payment documents in the demo.",
  },
  {
    id: "github-pages-cheatsheet",
    channel: "github-pages",
    title: "GitHub Pages mirror for accepted IndexNow discovery",
    trigger: "Use in resource lists that prefer GitHub Pages mirrors or crawlable static pages.",
    absoluteUrl: "https://yanqr213.github.io/printable-tools-lab/upload-error-cheatsheet/",
    utmSource: "github-pages",
    campaign: "upload_error_cheatsheet",
    copy: "Static mirror for common upload errors and direct free fixes: {url}. The live tools remain on PrintableTools Lab and downloads stay free.",
    successSignal: "GitHub Pages sitemap and IndexNow accepted URL count remain above 151 and referral visits appear.",
    riskRule: "Mirror is for discovery only; send users to the live free tools for actual file work.",
  },
  {
    id: "free-tool-depth-upload-limit",
    channel: "community",
    title: "Upload-limit fixer for file-size questions",
    trigger: "Use only where someone asks how to make a PDF, JPG, PNG, resume, or passport photo fit a named upload limit.",
    linkPath: "upload-limit-fixer",
    utmSource: "community",
    campaign: "free_tool_depth",
    copy: "If the site gives a file-size or format error, this free upload-limit fixer maps the message to the right no-signup PDF or image tool: {url}",
    successSignal: "free_tool_depth visits increase and at least one visitor opens a fixer tool or downloads a processed file.",
    riskRule: "Answer the specific upload problem only; do not ask for ad clicks, payments, or private files.",
  },
];

const UPLOAD_LIMIT_SHORTCUTS = [
  ["PDF size reducer", "/pdf-size-reducer/", "Pick 500KB, 1MB, 2MB, or 5MB PDF targets for scanned forms and portal uploads.", "compress-pdf"],
  ["Image size reducer in KB", "/image-size-reducer-in-kb/", "Choose exact image and photo targets from 10KB through 500KB without uploading.", "compress-image-to-kb"],
  ["Compress PDF to 1MB", "/compress-pdf-to-1mb/", "A common job, school, email, and admin portal PDF limit.", "compress-pdf"],
  ["Compress PDF to 500KB", "/compress-pdf-to-500kb/", "A strict PDF target for forms, exam portals, and government-style uploads.", "compress-pdf"],
  ["Compress image to 100KB", "/compress-image-to-100kb/", "A common profile, job, school, and form photo limit.", "compress-image-to-kb"],
  ["Compress JPG to 100KB", "/compress-jpg-to-100kb/", "Use this when the destination asks for JPG and a fixed 100KB limit.", "compress-image-to-kb"],
  ["Compress PNG to 100KB", "/compress-png-to-100kb/", "Use this when a screenshot, graphic, or form upload must stay PNG under 100KB.", "compress-image-to-kb"],
  ["Passport photo size fixer", "/passport-photo-size-fixer/", "Crop, resize, and compress ID-style photos for dimension and file-size rules.", "passport-photo"],
];

const UPLOAD_LIMIT_DECISIONS = [
  ["PDF must be under 1MB", "/tools/compress-pdf/?targetSize=1mb", "Compress PDF", "Use the PDF compressor with the 1MB target for job, school, email, and admin portals.", "compress-pdf"],
  ["PDF must be under 500KB", "/tools/compress-pdf/?targetSize=500kb", "Compress PDF", "Use the strict 500KB target for forms and exam-style upload limits.", "compress-pdf"],
  ["Image must be under 2MB", "/tools/compress-image-to-kb/?targetKb=2048", "Compress image", "Use a 2048KB custom target when the upload page names a 2MB image cap.", "compress-image-to-kb"],
  ["Image must be under 500KB", "/tools/compress-image-to-kb/?targetKb=500", "Compress image", "Use the 500KB image target for profile, marketplace, and portal uploads.", "compress-image-to-kb"],
  ["Photo or image must be under 100KB", "/tools/compress-image-to-kb/?targetKb=100", "Compress image to KB", "Use the image-to-KB compressor when the site names a fixed photo or image file-size limit.", "compress-image-to-kb"],
  ["JPG must be under 100KB", "/tools/compress-image-to-kb/?targetKb=100", "Compress JPG", "Start with the 100KB target and export a smaller JPG or WebP copy locally.", "compress-image-to-kb"],
  ["JPG must be under 200KB", "/tools/compress-image-to-kb/?targetKb=200", "Compress JPG", "Start with the 200KB target when a profile or application form gives a JPG cap.", "compress-image-to-kb"],
  ["PNG screenshot is too large", "/tools/compress-image-to-kb/?targetKb=500", "Compress PNG", "Use this when a support form, portal, or profile page accepts PNG but rejects the screenshot size.", "compress-image-to-kb"],
  ["Resume PDF is too large", "/tools/compress-pdf/?targetSize=1mb", "Compress resume PDF", "Try the 1MB PDF target, then review that resume text remains readable before submitting.", "compress-pdf"],
  ["Email attachment is too large", "/tools/compress-pdf/?targetSize=5mb", "Compress PDF for email", "Start with the 5MB PDF target for large scanned attachments and email limits.", "compress-pdf"],
  ["Wrong file type: needs JPG or PNG", "/tools/convert-image/", "Convert image", "Convert JPG, PNG, or WebP locally when the upload form rejects the current image type.", "convert-image"],
  ["Wrong image dimensions", "/tools/resize-image/", "Resize image", "Resize first when the portal gives width, height, square, thumbnail, or profile-photo dimensions.", "resize-image"],
  ["Passport or ID photo rejected", "/passport-photo-size-fixer/", "Fix passport photo", "Crop, resize, and compress ID-style photos when both dimensions and KB limits matter.", "passport-photo"],
  ["Website accepts image but rejects PDF", "/tools/pdf-to-images/", "PDF to JPG", "Convert PDF pages to JPG or PNG when a form wants image files instead of a PDF.", "pdf-to-images"],
  ["Website accepts PDF but I only have photos", "/tools/image-to-pdf/", "Image to PDF", "Turn a photo, scan, screenshot, or receipt image into a PDF locally.", "image-to-pdf"],
];

const UPLOAD_LIMIT_MATCHER_DEFAULT = {
  badge: "Common match",
  title: "PDF under 1MB",
  href: "/tools/compress-pdf/?targetSize=1mb",
  label: "Open PDF compressor",
  why: "Starts the compressor with the 1MB target already selected.",
  trackTool: "compress-pdf",
};

const UPLOAD_LIMIT_MATCHER_EXAMPLES = [
  "PDF must be less than 1 MB",
  "Image must be less than 2 MB",
  "Photo must be under 100 KB",
  "Resume PDF too large",
  "Invalid file type. Please upload JPG or PNG",
  "Image dimensions must be 600 x 600 px",
];

const UPLOAD_ERROR_CHEATSHEET = [
  {
    errorText: "PDF must be under 1MB",
    problem: "A job, school, email, or admin portal rejects a PDF by file size.",
    landingPath: "file-must-be-less-than-1mb",
    toolPath: "tools/compress-pdf?targetSize=1mb",
    response: "Open the PDF compressor with the 1MB target, compress locally, then review readability before submitting.",
    format: "PDF",
    target: "1MB",
  },
  {
    errorText: "PDF must be under 500KB",
    problem: "A strict form, exam upload, or school portal requires a very small PDF.",
    landingPath: "pdf-must-be-under-500kb",
    toolPath: "tools/compress-pdf?targetSize=500kb",
    response: "Use the strict 500KB PDF target and keep the original file in case the compressed copy loses detail.",
    format: "PDF",
    target: "500KB",
  },
  {
    errorText: "Image must be less than 2MB",
    problem: "A profile, marketplace, support, or application page rejects an image over 2MB.",
    landingPath: "image-must-be-less-than-2mb",
    toolPath: "tools/compress-image-to-kb?targetKb=2048",
    response: "Use the image-to-KB compressor with a 2048KB custom target.",
    format: "Image",
    target: "2MB",
  },
  {
    errorText: "Image must be under 500KB",
    problem: "A portal or ticket form requires an image below 500KB.",
    landingPath: "image-must-be-under-500kb",
    toolPath: "tools/compress-image-to-kb?targetKb=500",
    response: "Use the 500KB image target, then resize if a large phone photo still misses the limit.",
    format: "Image",
    target: "500KB",
  },
  {
    errorText: "Photo must be under 100KB",
    problem: "A job, profile, school, or ID-style form rejects a photo by KB size.",
    landingPath: "photo-must-be-under-100kb",
    toolPath: "tools/compress-image-to-kb?targetKb=100",
    response: "Use the 100KB image target and check that the face or document text remains clear.",
    format: "Photo",
    target: "100KB",
  },
  {
    errorText: "JPG must be under 200KB",
    problem: "A portal accepts JPG/JPEG but rejects the image as too large.",
    landingPath: "jpg-must-be-under-200kb",
    toolPath: "tools/compress-image-to-kb?targetKb=200",
    response: "Use the 200KB image target and keep output as JPG if the destination requires it.",
    format: "JPG",
    target: "200KB",
  },
  {
    errorText: "PNG screenshot too large",
    problem: "A support ticket, admin upload, or bug report rejects a PNG screenshot.",
    landingPath: "png-screenshot-too-large",
    toolPath: "tools/compress-image-to-kb?targetKb=500",
    response: "Crop private areas first, then compress toward 500KB and review small UI text.",
    format: "PNG",
    target: "500KB",
  },
  {
    errorText: "Invalid file type. Please upload JPG or PNG",
    problem: "A website rejects the current image format and asks for JPG/JPEG/PNG.",
    landingPath: "invalid-file-type-jpg-png",
    toolPath: "tools/convert-image",
    response: "Convert the image format locally, then compress if the converted file is still too large.",
    format: "Image",
    target: "JPG or PNG",
  },
  {
    errorText: "Image dimensions must be 600 x 600 px",
    problem: "A profile, marketplace, avatar, or product image must match exact pixels.",
    landingPath: "image-dimensions-600x600",
    toolPath: "tools/resize-image?width=600&height=600&fit=cover",
    response: "Resize or crop to 600 x 600 pixels, then compress only if the KB limit still fails.",
    format: "Image",
    target: "600 x 600",
  },
  {
    errorText: "PDF not accepted, JPG required",
    problem: "A form accepts images but rejects a PDF upload.",
    landingPath: "pdf-not-accepted-jpg-required",
    toolPath: "tools/pdf-to-images",
    response: "Convert PDF pages to JPG/PNG locally and upload the page image the destination expects.",
    format: "PDF",
    target: "JPG",
  },
  {
    errorText: "Resume PDF too large",
    problem: "A job application or recruiter portal rejects a resume PDF by size.",
    landingPath: "resume-pdf-too-large",
    toolPath: "tools/compress-pdf?targetSize=1mb",
    response: "Try the 1MB PDF target and confirm all resume text remains readable before applying.",
    format: "PDF",
    target: "1MB",
  },
  {
    errorText: "Email attachment too large",
    problem: "Gmail, Outlook, school email, or work mail rejects a document attachment.",
    landingPath: "email-attachment-too-large",
    toolPath: "tools/compress-pdf?targetSize=5mb",
    response: "Compress PDFs toward 5MB or use the image-to-KB tool for photo attachments.",
    format: "PDF or image",
    target: "5MB",
  },
];

const SHARE_KIT_RULES = [
  "Post only where free tools or file utilities are relevant to the community.",
  "Do not ask for ad interactions, ad impressions, upvotes, or artificial engagement.",
  "Do not claim guaranteed compression results; say the tool tries toward a target and users should review the output.",
  "Do not post private documents, IDs, payment details, or user files in examples.",
  "Use UTM source labels so the live metrics can separate directory, community, video, and social tests.",
];

const CAMPAIGN_VIDEO_ASSETS = readCampaignVideoAssets();
const GIST_DISCOVERY = readGistDiscovery();
const ISSUE_DISCOVERY = readIssueDiscovery();

const HIGH_INTENT_TOOL_PATHS = [
  "tools/image-to-pdf",
  "tools/multi-image-pdf",
  "tools/compress-pdf",
  "tools/pdf-to-images",
  "tools/pdf-to-text",
  "tools/pdf-to-word",
  "tools/compress-image",
  "tools/compress-image-to-kb",
  "tools/resize-image",
  "tools/convert-image",
  "tools/remove-background",
  "tools/crop-image",
  "tools/rotate-image",
  "tools/watermark-image",
  "tools/add-text-image",
  "tools/signature-png",
  "tools/passport-photo",
  "tools/qr-code",
  "tools/wifi-qr-code",
  "tools/vcard-qr-code",
  "tools/merge-pdf",
  "tools/split-pdf",
  "tools/pdf-page-numbers",
  "tools/rotate-pdf",
  "tools/remove-pdf-pages",
  "tools/reorder-pdf-pages",
  "tools/watermark-pdf",
  "tools/stamp-pdf",
  "tools/sign-pdf",
  "tools/text-to-pdf",
  "tools/markdown-to-pdf",
  "tools/csv-to-pdf",
  "tools/json-to-pdf",
  "tools/invoice-generator",
  "tools/receipt-generator",
  "tools/timesheet-generator",
  "tools/business-card",
  "tools/address-labels",
  "tools/barcode-labels",
  "tools/price-tag",
  "tools/flyer-maker",
  "tools/coupon-maker",
  "tools/packing-slip",
  "tools/work-order",
  "tools/inventory-sheet",
  "tools/resume-builder",
  "tools/ats-resume-checker",
  "tools/certificate-generator",
  "tools/todo-list",
  "tools/graph-paper",
];

const LOCAL_SELLER_FUNNEL_TOOL_PATHS = [
  "tools/invoice-generator",
  "tools/estimate-generator",
  "tools/receipt-generator",
  "tools/timesheet-generator",
  "tools/business-card",
  "tools/address-labels",
  "tools/barcode-labels",
  "tools/price-tag",
  "tools/flyer-maker",
  "tools/coupon-maker",
  "tools/packing-slip",
  "tools/work-order",
  "tools/inventory-sheet",
  "tools/qr-code",
  "tools/wifi-qr-code",
  "tools/vcard-qr-code",
  "tools/add-text-image",
  "tools/watermark-image",
  "tools/remove-background",
];

const LOCAL_SELLER_FUNNEL_TOOL_PATH_SET = new Set(LOCAL_SELLER_FUNNEL_TOOL_PATHS);

const TOOL_FINDER_ROWS = [
  {
    need: "I need to turn a photo, scan, or screenshot into a PDF",
    toolPath: "tools/image-to-pdf",
    why: "Best for one image or a small gallery on one page. The file is processed locally in the browser.",
  },
  {
    need: "I need one PDF with several image pages",
    toolPath: "tools/multi-image-pdf",
    why: "Best when each image should become its own PDF page, such as receipts, scans, or phone photos.",
  },
  {
    need: "I need to make a PDF file smaller",
    toolPath: "tools/compress-pdf",
    why: "Best for scanned or image-heavy PDFs when a form, email, or portal rejects a large file.",
  },
  {
    need: "A website rejected my file because of size, format, or dimensions",
    toolPath: "tools/compress-image-to-kb",
    why: "Start with the upload limit fixer for the full decision path, then use PDF compression, image-to-KB, resizing, passport photo crop, PDF-to-JPG, or image-to-PDF as needed.",
    landingPath: "upload-limit-fixer",
  },
  {
    need: "I need to turn PDF pages into JPG or PNG images",
    toolPath: "tools/pdf-to-images",
    why: "Best when a website, message, listing, or form asks for image files instead of a PDF.",
  },
  {
    need: "I need to extract selectable text from a PDF",
    toolPath: "tools/pdf-to-text",
    why: "Best when you need a local TXT copy of embedded PDF text for notes, review, or cleanup.",
  },
  {
    need: "I need to turn a PDF into an editable Word document",
    toolPath: "tools/pdf-to-word",
    why: "Best for selectable-text PDFs when you need a simple DOCX draft without uploading the file to a converter.",
  },
  {
    need: "I need to make an image file smaller",
    toolPath: "tools/compress-image",
    why: "Best for reducing a JPG, PNG, or WebP file before uploading it to a form, email, marketplace, or profile.",
  },
  {
    need: "I need to compress an image to 100KB, 200KB, or another upload limit",
    toolPath: "tools/compress-image-to-kb",
    why: "Best when a form, portal, exam site, or job application has a strict KB file-size limit.",
  },
  {
    need: "I need to resize an image to exact dimensions",
    toolPath: "tools/resize-image",
    why: "Best for changing image width, height, square posts, thumbnails, profile pictures, and story-sized images locally.",
  },
  {
    need: "I need to convert JPG, PNG, or WebP",
    toolPath: "tools/convert-image",
    why: "Best for changing the image format without sending the file to an online converter server.",
  },
  {
    need: "I need to remove a white or solid background from an image",
    toolPath: "tools/remove-background",
    why: "Best for product photos, logos, signature scans, icons, and green-screen images that need a transparent PNG.",
  },
  {
    need: "I need to crop an image for a profile, listing, or banner",
    toolPath: "tools/crop-image",
    why: "Best for square avatars, wide banners, portrait crops, and product photos that need better framing.",
  },
  {
    need: "I need to rotate or flip a sideways image",
    toolPath: "tools/rotate-image",
    why: "Best for fixing phone photos, scans, screenshots, and mirrored images locally before upload.",
  },
  {
    need: "I need to add a text watermark to an image",
    toolPath: "tools/watermark-image",
    why: "Best for samples, drafts, proofs, social posts, and marketplace photos that need a visible label.",
  },
  {
    need: "I need to add a headline, price, caption, or meme text to an image",
    toolPath: "tools/add-text-image",
    why: "Best for thumbnails, product labels, announcements, class visuals, and quick social images.",
  },
  {
    need: "I need a transparent signature PNG",
    toolPath: "tools/signature-png",
    why: "Best for drawing or typing a visual signature image for documents, PDF annotations, proposals, or forms.",
  },
  {
    need: "I need a passport-style photo in 2x2, 35x45, or 50x70 size",
    toolPath: "tools/passport-photo",
    why: "Best for local sizing, cropping, and 4x6 print-sheet layout before comparing the result with official photo rules.",
  },
  {
    need: "I need a QR code for a link, sign, menu, or flyer",
    toolPath: "tools/qr-code",
    why: "Best for a static QR code PDF when the destination will not need editing after printing.",
  },
  {
    need: "I need guests to join WiFi without typing the password",
    toolPath: "tools/wifi-qr-code",
    why: "Best for printable guest WiFi signs in offices, rentals, cafes, classrooms, waiting rooms, and events.",
  },
  {
    need: "I need people to save contact details from a sign or card",
    toolPath: "tools/vcard-qr-code",
    why: "Best for a vCard contact QR code on business cards, booth signs, service flyers, and event badges.",
  },
  {
    need: "I have plain text and need a simple PDF",
    toolPath: "tools/text-to-pdf",
    why: "Best for notes, short letters, checklists, or copied text that needs a clean one-page export.",
  },
  {
    need: "I have Markdown notes, docs, or README text and need a PDF",
    toolPath: "tools/markdown-to-pdf",
    why: "Best for readable headings, lists, quotes, and project notes without opening a full Markdown editor.",
  },
  {
    need: "I have CSV rows and need a printable table",
    toolPath: "tools/csv-to-pdf",
    why: "Best for small tables, inventory rows, rosters, price sheets, and order lists that should stay local.",
  },
  {
    need: "I have JSON and need a formatted PDF reference",
    toolPath: "tools/json-to-pdf",
    why: "Best for reviewed API samples, config snippets, QA notes, and technical payload references without upload.",
  },
  {
    need: "I need to combine several PDFs into one file",
    toolPath: "tools/merge-pdf",
    why: "Best for local no-upload merging when private documents should stay in the browser.",
  },
  {
    need: "I need to extract pages from a PDF",
    toolPath: "tools/split-pdf",
    why: "Best for keeping selected pages without uploading the source document.",
  },
  {
    need: "I need to add page numbers to a PDF",
    toolPath: "tools/pdf-page-numbers",
    why: "Best for packets, handouts, drafts, and merged PDFs that need page references.",
  },
  {
    need: "I need to rotate sideways PDF pages",
    toolPath: "tools/rotate-pdf",
    why: "Best for scanned forms, phone-generated PDFs, and packets with only a few pages facing the wrong way.",
  },
  {
    need: "I need to delete pages from a PDF",
    toolPath: "tools/remove-pdf-pages",
    why: "Best for removing blank pages, duplicates, covers, or private pages while keeping the rest of the document.",
  },
  {
    need: "I need to reorder PDF pages",
    toolPath: "tools/reorder-pdf-pages",
    why: "Best for organizing scanned packets or drafts where pages were captured out of sequence.",
  },
  {
    need: "I need to add a watermark to a PDF",
    toolPath: "tools/watermark-pdf",
    why: "Best for marking drafts, samples, review copies, and private files locally before sending.",
  },
  {
    need: "I need to stamp a PDF as paid, approved, or draft",
    toolPath: "tools/stamp-pdf",
    why: "Best for simple status stamps on receipts, invoices, work orders, review files, and internal paperwork.",
  },
  {
    need: "I need to add a typed signature line to a PDF",
    toolPath: "tools/sign-pdf",
    why: "Best for lightweight signature blocks when a typed signature is acceptable for the document.",
  },
  {
    need: "I need to bill a client or record a service payment",
    toolPath: "tools/invoice-generator",
    why: "Use an invoice before payment is due. Use the receipt tool after money has been paid.",
  },
  {
    need: "I need a quote before work starts",
    toolPath: "tools/estimate-generator",
    why: "Best for service quotes, repair estimates, consulting scopes, and small project proposals.",
  },
  {
    need: "I need proof that something was paid",
    toolPath: "tools/receipt-generator",
    why: "Best for deposits, reimbursements, service payments, and simple sale records.",
  },
  {
    need: "I need to track hours for a week or pay period",
    toolPath: "tools/timesheet-generator",
    why: "Best for freelancers, contractors, staff records, project approvals, and recurring weekly hour logs.",
  },
  {
    need: "I need contact cards for a service, event, or side business",
    toolPath: "tools/business-card",
    why: "Best for a printable sheet of quick cards before ordering professional prints.",
  },
  {
    need: "I need return address, mailing, badge, or bin labels",
    toolPath: "tools/address-labels",
    why: "Best for printable label sheets when full label software is unnecessary.",
  },
  {
    need: "I need simple barcode or SKU labels",
    toolPath: "tools/barcode-labels",
    why: "Best for internal Code 39 labels, inventory bins, and event check-in workflows.",
  },
  {
    need: "I need price tags, coupons, or a local flyer",
    toolPath: "tools/price-tag",
    why: "Best for small sellers preparing a yard sale, pop-up table, market booth, or simple promotion.",
  },
  {
    need: "I need a packing slip for a small order",
    toolPath: "tools/packing-slip",
    why: "Best for marketplace orders, handmade product shipments, local deliveries, and package inserts.",
  },
  {
    need: "I need a work order for a service visit",
    toolPath: "tools/work-order",
    why: "Best for repair jobs, maintenance visits, cleaning work, contractor tasks, and client approval records.",
  },
  {
    need: "I need an inventory count sheet",
    toolPath: "tools/inventory-sheet",
    why: "Best for stock counts, craft fairs, storage bins, classroom supplies, and small retail shelf checks.",
  },
  {
    need: "I need a job application PDF",
    toolPath: "tools/resume-builder",
    why: "Start with the resume. Use the cover letter tool when the application asks for a separate letter.",
  },
  {
    need: "I need to check my resume against a job description",
    toolPath: "tools/ats-resume-checker",
    why: "Best for a local keyword, section, readability, and evidence check before applying.",
  },
  {
    need: "I need an event or classroom printable",
    toolPath: "tools/sign-in-sheet",
    why: "Best for attendance, workshop check-in, visitor logs, and simple event records.",
  },
  {
    need: "I need a blank printable page for math, notes, or sketches",
    toolPath: "tools/graph-paper",
    why: "Best for quarter-inch grids, half-inch grids, dot grids, math practice, and design planning.",
  },
  {
    need: "I need a certificate or award quickly",
    toolPath: "tools/certificate-generator",
    why: "Best for participation, completion, classroom awards, clubs, and small event recognition.",
  },
  {
    need: "I need a practical checklist",
    toolPath: "tools/todo-list",
    why: "Best for errands, study sessions, event prep, home projects, or work tasks that should fit on one page.",
  },
];

const landingPages = [
  {
    path: "upload-limit-fixer",
    title: "Free Upload Limit Fixer",
    description: "Find the right free no-upload tool when a form rejects your PDF, image, photo, or document because of file size, format, or dimensions.",
    headline: "Fix a file upload limit without signup",
    lead: "Start here when a job application, school portal, marketplace, visa-style form, email, or admin website rejects a file because it is too large, the wrong format, or the wrong image dimensions.",
    primaryTool: "tools/compress-image-to-kb",
    intent: "file upload limit fixer, reduce file size, convert file format, resize photo",
    sections: [
      ["Start from the error message", "If the site says PDF must be under 1MB or 500KB, use the PDF compressor. If it says image must be under 100KB or 200KB, use the image-to-KB compressor. If it asks for JPG, PNG, PDF, or a specific pixel size, choose the matching converter or resizer."],
      ["Keep the file local", "The linked PDF and image tools run in the browser for ordinary use. That is useful when the blocked upload is a resume, ID-style photo, school form, receipt, support screenshot, or private document."],
      ["Review before submitting", "Small file-size targets can blur text, flatten PDF text, or reduce photo detail. Always open the downloaded result before uploading it to the destination website."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=1mb", "tools/compress-pdf?targetSize=500kb", "tools/resize-image", "tools/passport-photo", "tools/pdf-to-images", "tools/image-to-pdf"],
  },
  {
    path: "file-must-be-less-than-1mb",
    title: "File Must Be Less Than 1MB Fix",
    description: "Fix a file must be less than 1MB upload error with free no-signup PDF and image size tools.",
    headline: "Fix file must be less than 1 MB",
    lead: "Use this when a job portal, school form, email upload, support form, or admin website rejects a file with a message like file must be less than 1 MB.",
    primaryTool: "tools/compress-pdf?targetSize=1mb",
    intent: "file must be less than 1MB, upload file too large, reduce file size",
    uploadErrorMatcher: true,
    sections: [
      ["Start with the file type", "If the blocked file is a PDF, open the PDF compressor with the 1MB target. If it is a photo or screenshot, use the image-to-KB compressor and choose the closest KB target."],
      ["Why this query is urgent", "This error usually appears after the user already has the right document and is trying to submit it. The fastest path is a direct target-size tool, not a general editor."],
      ["Review before upload", "A 1MB target can reduce detail or flatten PDF text. Open the downloaded result before submitting it to the destination website."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=1mb", "tools/compress-image-to-kb?targetKb=100", "tools/resize-image"],
  },
  {
    path: "pdf-must-be-under-500kb",
    title: "PDF Must Be Under 500KB Fix",
    description: "Try to reduce a PDF toward a 500KB upload limit locally when a form says the PDF must be under 500KB.",
    headline: "Fix PDF must be under 500KB",
    lead: "Use this when a form, exam portal, school system, or application page rejects a PDF with a strict 500KB limit.",
    primaryTool: "tools/compress-pdf?targetSize=500kb",
    intent: "PDF must be under 500KB, compress PDF to 500KB, upload limit error",
    uploadErrorMatcher: true,
    sections: [
      ["Use the strict PDF target", "Open the PDF compressor with the 500KB target already selected. This is the smallest built-in PDF target and works best for short scanned documents."],
      ["Know the tradeoff", "A 500KB target is aggressive. Long PDFs, text-heavy documents, or high-detail scans may lose clarity or still miss the exact limit."],
      ["If it still fails", "Split the PDF, convert pages to images, or compress source photos before rebuilding the final upload file."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=500kb", "tools/split-pdf", "tools/pdf-to-images"],
  },
  {
    path: "photo-must-be-under-100kb",
    title: "Photo Must Be Under 100KB Fix",
    description: "Compress a photo toward 100KB locally when a job, profile, school, or application form rejects the image file size.",
    headline: "Fix photo must be under 100KB",
    lead: "Use this when a form says a photo, image, profile picture, or ID-style upload must be under 100KB.",
    primaryTool: "tools/compress-image-to-kb?targetKb=100",
    intent: "photo must be under 100KB, image under 100KB, upload photo too large",
    uploadErrorMatcher: true,
    sections: [
      ["Use the 100KB image target", "Open the image-to-KB compressor with 100KB selected, then download a smaller JPG or WebP copy from the browser."],
      ["Resize first if dimensions matter", "If the same portal also gives exact width and height, resize or crop before compressing to the KB limit."],
      ["Check face and text clarity", "Small file-size targets can soften faces, text, screenshots, and document photos. Review the output before submitting."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=100", "tools/resize-image", "tools/passport-photo"],
  },
  {
    path: "invalid-file-type-jpg-png",
    title: "Invalid File Type JPG or PNG Fix",
    description: "Convert an image locally when an upload form says invalid file type and asks for JPG, JPEG, or PNG.",
    headline: "Fix invalid file type: upload JPG or PNG",
    lead: "Use this when a website rejects an image because the file type is unsupported, or the message says to upload JPG, JPEG, or PNG.",
    primaryTool: "tools/convert-image",
    intent: "invalid file type JPG PNG, upload JPG or PNG, convert image type",
    uploadErrorMatcher: true,
    sections: [
      ["Convert the image format", "Open the image converter and export a JPG, PNG, or WebP copy that matches the destination website's accepted file type."],
      ["Then check file size", "Changing format can increase or decrease file size. If the converted image is still too large, run it through the image-to-KB compressor."],
      ["Transparency warning", "JPG does not preserve transparency. Use PNG when transparent background or sharp graphics matter and the portal accepts PNG."],
    ],
    relatedTools: ["tools/convert-image", "tools/compress-image-to-kb", "tools/resize-image"],
  },
  {
    path: "image-dimensions-600x600",
    title: "Image Dimensions 600x600 Fix",
    description: "Resize or crop an image to 600 x 600 pixels locally when a profile, marketplace, or form upload requires exact dimensions.",
    headline: "Fix image dimensions must be 600 x 600",
    lead: "Use this when an upload page rejects a photo, product image, avatar, or screenshot because it must be exactly 600 x 600 pixels.",
    primaryTool: "tools/resize-image?width=600&height=600&fit=cover",
    intent: "image dimensions 600x600, resize image to 600x600, exact pixel upload error",
    uploadErrorMatcher: true,
    sections: [
      ["Resize to exact pixels", "Open the image resizer with 600 x 600 prefilled. The cover crop option helps make a square output instead of leaving blank space."],
      ["Crop important content", "Square resizing can cut off edges. Check that faces, product details, logos, or document text remain visible."],
      ["Compress after resizing", "If the 600 x 600 image still exceeds a KB limit, compress the resized result with the image-to-KB tool."],
    ],
    relatedTools: ["tools/resize-image?width=600&height=600&fit=cover", "tools/crop-image", "tools/compress-image-to-kb?targetKb=100"],
  },
  {
    path: "pdf-not-accepted-jpg-required",
    title: "PDF Not Accepted JPG Required Fix",
    description: "Convert PDF pages to JPG or PNG locally when a website accepts images but rejects a PDF upload.",
    headline: "Fix PDF not accepted, JPG required",
    lead: "Use this when a form or website rejects a PDF and asks for JPG, JPEG, PNG, photo, or image files instead.",
    primaryTool: "tools/pdf-to-images",
    intent: "PDF not accepted JPG required, website accepts image not PDF, convert PDF to JPG",
    uploadErrorMatcher: true,
    sections: [
      ["Convert PDF pages to images", "Open the PDF-to-images tool and export selected pages as JPG or PNG files from the browser."],
      ["Watch page count", "If the PDF has several pages, each page becomes its own image. Some websites expect one image per upload field."],
      ["Compress images if needed", "Converted pages can still be large. If the upload page also has a KB limit, compress the resulting image before submitting."],
    ],
    relatedTools: ["tools/pdf-to-images", "tools/compress-image-to-kb", "tools/image-to-pdf"],
  },
  {
    path: "image-must-be-less-than-2mb",
    title: "Image Must Be Less Than 2MB Fix",
    description: "Compress an image locally toward a 2MB upload cap when a profile, marketplace, support, or application form rejects the file.",
    headline: "Fix image must be less than 2 MB",
    lead: "Use this when a website says an image, photo, screenshot, avatar, or product picture must be less than 2 MB before upload.",
    primaryTool: "tools/compress-image-to-kb?targetKb=2048",
    intent: "image must be less than 2MB, image upload too large, compress image under 2MB",
    uploadErrorMatcher: true,
    sections: [
      ["Use a 2048KB custom target", "Open the image-to-KB compressor with a 2048KB custom target. This maps the common 2MB rule to the tool's KB input."],
      ["Keep enough detail", "A 2MB cap is usually generous enough for profile photos, product images, and support screenshots. Resize first only if the dimensions are also rejected."],
      ["Check the final upload", "Open the downloaded image, confirm it is below the portal limit, and verify that faces, text, or product details still look clear."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=2048", "tools/resize-image", "tools/convert-image"],
  },
  {
    path: "image-must-be-under-500kb",
    title: "Image Must Be Under 500KB Fix",
    description: "Compress a photo, screenshot, avatar, or product image toward a 500KB upload limit locally without creating an account.",
    headline: "Fix image must be under 500KB",
    lead: "Use this when a portal, marketplace, job form, school page, or support ticket says an image file must be under 500KB.",
    primaryTool: "tools/compress-image-to-kb?targetKb=500",
    intent: "image must be under 500KB, compress image to 500KB, upload image too large",
    uploadErrorMatcher: true,
    sections: [
      ["Use the 500KB target", "Open the image-to-KB compressor with 500KB selected and export a smaller JPG or WebP copy from the browser."],
      ["Resize if it still fails", "Large screenshots and phone photos may need a smaller maximum width before they can fit under 500KB cleanly."],
      ["Review text and faces", "Compression can soften document text, ID photos, screenshots, and product details. Check the file before sending it to the destination site."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=500", "tools/resize-image", "tools/crop-image"],
  },
  {
    path: "jpg-must-be-under-200kb",
    title: "JPG Must Be Under 200KB Fix",
    description: "Compress a JPG or photo toward a 200KB upload limit locally for applications, profiles, marketplaces, and school forms.",
    headline: "Fix JPG must be under 200KB",
    lead: "Use this when a website accepts JPG or JPEG but rejects the file because it is over 200KB.",
    primaryTool: "tools/compress-image-to-kb?targetKb=200",
    intent: "JPG must be under 200KB, compress JPG to 200KB, JPEG upload limit",
    uploadErrorMatcher: true,
    sections: [
      ["Use the 200KB target", "Open the image-to-KB compressor with 200KB selected, then export a smaller JPG or WebP copy locally."],
      ["Convert after checking the rule", "If the portal specifically requires JPG, keep the output as JPG. If it only asks for an image, WebP may be smaller but not accepted everywhere."],
      ["Avoid over-compressing IDs", "For ID-style photos, applications, and resumes with headshots, make sure the face and any printed text remain readable."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=200", "tools/convert-image", "tools/passport-photo"],
  },
  {
    path: "png-screenshot-too-large",
    title: "PNG Screenshot Too Large Fix",
    description: "Reduce a PNG screenshot locally when a support form, admin portal, or upload page rejects the screenshot as too large.",
    headline: "Fix PNG screenshot too large",
    lead: "Use this when a support ticket, bug report, admin upload, school portal, or marketplace page rejects a PNG screenshot because the file size is too large.",
    primaryTool: "tools/compress-image-to-kb?targetKb=500",
    intent: "PNG screenshot too large, compress PNG screenshot, screenshot upload too large",
    uploadErrorMatcher: true,
    sections: [
      ["Start with 500KB", "Open the image-to-KB compressor with a 500KB target. This is a practical first pass for screenshots that need to stay readable."],
      ["Crop first for privacy", "Before compressing, crop out unrelated tabs, messages, account details, or private desktop areas if they are not needed."],
      ["Check text clarity", "Screenshots often contain small UI text. Review the compressed image before attaching it to a ticket or form."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=500", "tools/crop-image", "tools/convert-image"],
  },
  {
    path: "resume-pdf-too-large",
    title: "Resume PDF Too Large Fix",
    description: "Compress a resume PDF locally when a job application portal rejects the file because it is too large.",
    headline: "Fix resume PDF too large",
    lead: "Use this when a job application, recruiter portal, or career site says your resume PDF is too large to upload.",
    primaryTool: "tools/compress-pdf?targetSize=1mb",
    intent: "resume PDF too large, compress resume PDF, job application PDF upload limit",
    uploadErrorMatcher: true,
    sections: [
      ["Try the 1MB PDF target", "Open the PDF compressor with the 1MB target selected. Many job portals accept resumes around this size."],
      ["Preserve readability", "A resume must stay readable after compression. Check name, headings, dates, and contact details before uploading."],
      ["If text becomes blurry", "Return to the source resume editor and export a simpler PDF, remove oversized images, or rebuild from a text-first document."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=1mb", "tools/resume-builder", "tools/pdf-to-word"],
  },
  {
    path: "email-attachment-too-large",
    title: "Email Attachment Too Large Fix",
    description: "Reduce a PDF or image before emailing it when an inbox, webmail app, or mail client says the attachment is too large.",
    headline: "Fix email attachment too large",
    lead: "Use this when Gmail, Outlook, a school inbox, or a work mail client rejects a PDF, scanned document, or image attachment because it is too large.",
    primaryTool: "tools/compress-pdf?targetSize=5mb",
    intent: "email attachment too large, compress PDF for email, reduce image before email",
    uploadErrorMatcher: true,
    sections: [
      ["Start with the file type", "If the attachment is a PDF, open the PDF compressor with the 5MB target. If it is a photo or screenshot, use the image-to-KB compressor instead."],
      ["Keep the original copy", "Compression makes a new file for sending. Keep the original document or image in case the recipient needs full quality later."],
      ["Review before sending", "Open the smaller file and confirm all pages, text, signatures, and images are visible before attaching it to the email."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=5mb", "tools/compress-image-to-kb?targetKb=2048", "tools/split-pdf"],
  },
  {
    path: "free-invoice-generator-no-signup",
    title: "Free Invoice Generator Without Signup",
    description: "Create and download a clean invoice PDF without creating an account, uploading data, or hitting a surprise export paywall.",
    headline: "Free invoice generator without signup",
    lead: "Make a practical invoice PDF in the browser, review it, and download it without creating an account. This page is built for freelancers and small businesses who need one clean invoice now.",
    primaryTool: "tools/invoice-generator",
    intent: "invoice PDF now, no account, no hidden export fee",
    sections: [
      ["Why this page exists", "Many invoice tools are free until the export step. PrintableTools Lab keeps the first invoice workflow lightweight: fill the form, generate the PDF locally, and keep your own copy."],
      ["What the invoice includes", "Business and client details, invoice number, date, payment terms, line items, currency, totals, and a footer note. It is a simple record format, not tax or accounting advice."],
      ["Best fit", "Use it for freelance services, consulting work, small one-off jobs, deposits, creative work, or quick client records when full accounting software is unnecessary."],
    ],
    relatedTools: ["tools/estimate-generator", "tools/receipt-generator", "tools/timesheet-generator"],
  },
  {
    path: "jpg-to-pdf-no-upload",
    title: "JPG to PDF Without Uploading",
    description: "Convert JPG, PNG, or WebP images to PDF in your browser without uploading private files to a conversion server.",
    headline: "JPG to PDF without uploading",
    lead: "Choose an image and create a PDF locally in the browser. It is useful for receipts, scans, forms, screenshots, homework pages, and other files you do not want to send to a converter server.",
    primaryTool: "tools/image-to-pdf",
    intent: "private image conversion, no upload, fast PDF",
    sections: [
      ["Local-first conversion", "The image is loaded into your browser preview and drawn into the PDF on your device. Avoid entering or uploading private documents unless you have reviewed them first."],
      ["One image or several", "Use the one-image converter for a single page or gallery layout. Use the multi-image converter when each image should become its own PDF page."],
      ["Before sharing", "Open the downloaded PDF and confirm the image is readable, oriented correctly, and not cropped in a way that hides important information."],
    ],
    relatedTools: ["tools/multi-image-pdf", "tools/text-to-pdf", "tools/packing-list"],
  },
  {
    path: "multiple-images-to-pdf-no-upload",
    title: "Multiple Images to PDF Without Uploading",
    description: "Combine several JPG, PNG, or WebP images into one multi-page PDF locally in your browser.",
    headline: "Multiple images to PDF without uploading",
    lead: "Create a multi-page PDF where each selected image becomes one page. This is designed for quick scans, receipts, forms, screenshots, homework, and grouped photo documents.",
    primaryTool: "tools/multi-image-pdf",
    intent: "combine images into one PDF without upload",
    sections: [
      ["One PDF, several pages", "Select up to eight images and export them as a single PDF. The first version keeps the workflow simple so the page can load fast on mobile and desktop."],
      ["Privacy positioning", "The images stay in the browser for ordinary generation. That is a stronger promise than tools that require an upload before showing the final PDF."],
      ["Practical limits", "Very large images can make large PDFs. Resize or crop photos first if the receiving website has strict upload limits."],
    ],
    relatedTools: ["tools/image-to-pdf", "tools/text-to-pdf", "tools/receipt-generator"],
  },
  {
    path: "compress-pdf-no-upload",
    title: "Compress PDF Without Uploading",
    headline: "Compress PDF without uploading",
    description: "Compress a PDF locally in your browser by creating a smaller image-based PDF copy.",
    lead: "Choose a PDF, pick a compression mode, and download a smaller PDF copy without sending the file to a server. This works best for scanned forms, image-heavy PDFs, and quick document uploads where file size matters more than selectable text.",
    primaryTool: "tools/compress-pdf",
    intent: "compress PDF, reduce PDF size, no upload",
    sections: [
      ["Why this is high intent", "Compress PDF searches often happen after a form, email, school portal, job application, or government upload rejects a file as too large. Many converters require uploads, queues, accounts, or paid exports."],
      ["Local compression tradeoff", "The browser renders selected pages into images and rebuilds them into a smaller PDF. That keeps the file local, but selectable text and links may become flattened."],
      ["Best fit", "Use it for scanned PDFs, photo-heavy documents, receipts, and one-off upload limits. For contracts, forms, or accessible documents with selectable text, keep the original file too."],
    ],
    relatedTools: ["tools/pdf-to-images", "tools/compress-image-to-kb", "tools/merge-pdf"],
  },
  {
    path: "pdf-size-reducer",
    title: "PDF Size Reducer Without Uploading",
    description: "Reduce a scanned or image-heavy PDF toward exact upload limits locally, including 500KB, 1MB, 2MB, and 5MB targets.",
    headline: "PDF size reducer without uploading",
    lead: "Start here when a job portal, school form, email system, exam site, or admin upload page rejects a PDF because the file is too large. Pick the target size, open the no-upload PDF compressor, and download a smaller copy from your browser.",
    primaryTool: "tools/compress-pdf",
    intent: "PDF size reducer, compress PDF under 1MB, compress PDF under 500KB, no upload",
    sections: [
      ["Pick the target from the upload rule", "Use the exact size from the destination site whenever possible. A 500KB target is strict, 1MB is common for forms, and 2MB or 5MB usually preserves more readable detail."],
      ["Best for scanned PDFs", "The compressor rebuilds image-based pages locally, so it is strongest for scanned forms, photo-heavy documents, and PDFs that are already mostly images."],
      ["Honest limits", "Very small PDF targets can flatten selectable text, lower image quality, or still miss the exact limit on long documents. Review the downloaded PDF before submitting it anywhere important."],
    ],
    targetLinks: [
      ["Compress PDF to 500KB", "compress-pdf-to-500kb", "For strict form, school, government-style, and exam upload limits."],
      ["Compress PDF to 1MB", "compress-pdf-to-1mb", "For common job, school, email, and portal PDF limits."],
      ["Compress PDF to 2MB", "compress-pdf-to-2mb", "For upload forms that allow more readable scanned detail."],
      ["Compress PDF to 5MB", "compress-pdf-to-5mb", "For moderate limits where readability matters more than extreme compression."],
    ],
    relatedTools: ["tools/compress-pdf", "tools/pdf-to-images", "tools/split-pdf", "tools/merge-pdf"],
  },
  {
    path: "compress-pdf-to-500kb",
    title: "Compress PDF to 500KB Without Uploading",
    headline: "Compress PDF to 500KB without uploading",
    description: "Try to compress a scanned or image-heavy PDF toward a 500KB upload limit locally in your browser.",
    lead: "Choose a PDF, use the 500KB target, and download a smaller image-based PDF copy without sending the document to a server. This is for strict upload forms that reject PDFs above 500KB.",
    primaryTool: "tools/compress-pdf?targetSize=500kb",
    intent: "compress PDF to 500KB, reduce PDF size, no upload",
    sections: [
      ["Why this is high intent", "A 500KB PDF limit usually appears after a user has already tried to submit a form, school file, job document, exam upload, or government document and been blocked."],
      ["Local target-size workflow", "The browser renders selected pages into smaller JPEG-backed PDF pages and tries stronger compression passes when a target size is selected."],
      ["Honest limit", "A 500KB target can be too small for long or text-heavy PDFs. The tool tries to get close, but the result may flatten selectable text and can lose detail."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=1mb", "tools/pdf-to-images", "tools/compress-image-to-kb"],
  },
  {
    path: "compress-pdf-to-1mb",
    title: "Compress PDF to 1MB Without Uploading",
    headline: "Compress PDF to 1MB without uploading",
    description: "Try to reduce a PDF toward a 1MB upload limit locally for forms, portals, email attachments, and applications.",
    lead: "Choose a PDF, use the 1MB target, and download a smaller image-based PDF copy from your browser. It is designed for the common moment when an upload page says the PDF must be under 1MB.",
    primaryTool: "tools/compress-pdf?targetSize=1mb",
    intent: "compress PDF to 1MB, reduce PDF size, no upload",
    sections: [
      ["Why users search this", "Specific 1MB searches are usually urgent. The user already has the right file but a portal, email, job application, or school form rejects the size."],
      ["Local target-size workflow", "The PDF stays in the browser. The tool renders selected pages into an image-based PDF and tries more aggressive compression when needed."],
      ["Best fit", "This works best for scanned PDFs, receipts, photo-heavy documents, and quick uploads. Keep the original if selectable text, links, or accessibility matter."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=500kb", "tools/pdf-to-images", "tools/resize-image"],
  },
  {
    path: "compress-pdf-to-2mb",
    title: "Compress PDF to 2MB Without Uploading",
    headline: "Compress PDF to 2MB without uploading",
    description: "Try to compress a PDF toward a 2MB file-size limit locally without uploading the document.",
    lead: "Choose a PDF, use the 2MB target, and download a smaller PDF copy in the browser. This target is common for document portals that allow some detail but still reject large scans.",
    primaryTool: "tools/compress-pdf?targetSize=2mb",
    intent: "compress PDF to 2MB, reduce PDF size, no upload",
    sections: [
      ["Why this page exists", "A 2MB limit is common for job, school, support, bank, insurance, and admin portals. Users need a working file immediately, not a heavy editor or account wall."],
      ["Local target-size workflow", "The selected PDF is rendered and rebuilt locally. No ordinary compression step uploads the document to PrintableTools Lab."],
      ["Quality tradeoff", "2MB is friendlier than 500KB or 1MB, but complex PDFs can still flatten text and links. Review the output before submitting."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=1mb", "tools/pdf-to-images", "tools/merge-pdf"],
  },
  {
    path: "compress-pdf-to-5mb",
    title: "Compress PDF to 5MB Without Uploading",
    headline: "Compress PDF to 5MB without uploading",
    description: "Try to reduce a PDF toward a 5MB upload limit locally for email, portals, support tickets, and applications.",
    lead: "Choose a PDF, use the 5MB target, and download a smaller local copy. This is useful when the destination allows a moderate size and readability matters more than maximum compression.",
    primaryTool: "tools/compress-pdf?targetSize=5mb",
    intent: "compress PDF to 5MB, reduce PDF size, no upload",
    sections: [
      ["Better quality target", "A 5MB target is often enough for multi-page scans, document photos, and support attachments while preserving more detail than tiny file-size limits."],
      ["Local target-size workflow", "The browser rebuilds selected pages into a smaller image-based PDF and keeps the source file local during ordinary use."],
      ["Practical limit", "This tool is best for image-heavy PDFs. Text-first PDFs may be better handled by keeping the original or exporting selected pages."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=2mb", "tools/pdf-to-images", "tools/split-pdf"],
  },
  {
    path: "pdf-to-jpg-no-upload",
    title: "PDF to JPG Without Uploading",
    description: "Convert PDF pages to JPG or PNG images locally in your browser without uploading the document.",
    headline: "PDF to JPG without uploading",
    lead: "Choose a PDF, select all pages or a page range, and download JPG or PNG images rendered locally in the browser. This is useful when a site, form, message, or marketplace listing needs image files instead of a PDF.",
    primaryTool: "tools/pdf-to-images",
    intent: "PDF to JPG, PDF to PNG, no upload converter",
    sections: [
      ["Why users search", "PDF-to-image searches often happen after an upload fails because a form accepts JPG or PNG but not PDF. A free no-upload converter solves that moment without a server-side document upload."],
      ["Browser-side rendering", "The PDF is read and rendered with pdf.js in the browser. Ordinary conversion does not send the document to PrintableTools Lab."],
      ["Practical limits", "The free version converts up to eight selected pages. One page downloads as a JPG or PNG; multiple pages download as a ZIP of images."],
    ],
    relatedTools: ["tools/image-to-pdf", "tools/compress-image-to-kb", "tools/resize-image"],
  },
  {
    path: "extract-text-from-pdf-no-upload",
    title: "Extract Text From PDF Without Uploading",
    description: "Copy selectable PDF text into a downloadable TXT file locally in your browser.",
    headline: "Extract text from PDF without uploading",
    lead: "Choose a PDF, select all pages or a page range, and download a plain TXT file extracted locally in the browser. This helps with notes, quotes, admin review, and quick copy-paste cleanup.",
    primaryTool: "tools/pdf-to-text",
    intent: "PDF to text, extract text from PDF, no upload",
    sections: [
      ["What it extracts", "This tool extracts embedded selectable text from PDF pages. It does not run OCR on scanned images, photos, or flattened page pictures."],
      ["Browser-side processing", "The PDF is read with pdf.js in the browser. Ordinary extraction does not send the document to PrintableTools Lab."],
      ["Practical use", "PDF-to-text searches are useful when a user needs searchable notes, plain text, quotes, research snippets, or a lightweight copy of a PDF without a heavy editor."],
    ],
    relatedTools: ["tools/pdf-to-images", "tools/split-pdf", "tools/text-to-pdf"],
  },
  {
    path: "signature-png-generator",
    title: "Signature PNG Generator",
    description: "Draw or type a signature and download a transparent PNG locally without signup or upload.",
    headline: "Signature PNG generator",
    lead: "Create a transparent signature PNG for documents, PDF annotations, forms, proposals, and internal paperwork. Draw with a finger, mouse, or stylus, or use a typed fallback when a drawn signature is not needed.",
    primaryTool: "tools/signature-png",
    intent: "signature PNG, transparent signature, draw signature online",
    sections: [
      ["Transparent PNG output", "The export can keep the background transparent so the signature is easier to place on a PDF, image, or document."],
      ["Browser-side generation", "The drawing pad and typed fallback render in the browser. Ordinary signature image generation does not send the image to PrintableTools Lab."],
      ["Important limit", "This creates a visual signature image only. It does not verify identity, manage consent, notarize documents, or replace regulated e-signature platforms."],
    ],
    relatedTools: ["tools/sign-pdf", "tools/stamp-pdf", "tools/watermark-image"],
  },
  {
    path: "passport-photo-maker",
    title: "Passport Photo Maker",
    description: "Crop a passport-style photo locally for US 2x2, UK 35x45, Canada 50x70, and Australia 35x45 sizes.",
    headline: "Passport photo maker without uploading",
    lead: "Upload a photo in your browser, fit it inside a passport-photo guide, and download a correctly sized JPG, PNG, or 4x6 print sheet PDF without sending the image to a server.",
    primaryTool: "tools/passport-photo",
    intent: "passport photo maker, 2x2 photo, 35x45 photo, no upload",
    sections: [
      ["Why this has urgent intent", "Passport photo searches often happen right before an application, renewal, visa form, exam portal, or document upload. Many photo services charge at export or require uploading a private face photo."],
      ["Local crop workflow", "The selected photo stays in the browser. Choose a size preset, adjust zoom and position, then export a single image or a 4x6 print sheet."],
      ["Important limit", "This tool helps with sizing and layout only. It does not check every official lighting, pose, background, expression, recency, or acceptance rule. Always compare the result with the issuing authority's current requirements."],
    ],
    relatedTools: ["tools/resize-image", "tools/compress-image-to-kb", "tools/crop-image"],
  },
  {
    path: "compress-image-no-upload",
    title: "Compress Image Without Uploading",
    description: "Compress JPG, PNG, or WebP images in your browser without uploading private files to an image compressor server.",
    headline: "Compress image without uploading",
    lead: "Choose an image, pick a compression level, and download a smaller file locally in the browser. This is useful before submitting forms, emailing photos, uploading marketplace images, or reducing screenshots.",
    primaryTool: "tools/compress-image",
    intent: "compress image online, reduce image size, no upload",
    sections: [
      ["Why this is a bigger traffic test", "Image compression is a broad utility search, and many users need it right before an upload fails because the file is too large."],
      ["Local-first workflow", "The image is loaded into your browser, resized or re-encoded there, and downloaded as a new file. The tool is designed for ordinary files, not huge batch processing."],
      ["Best fit", "Use it for profile pictures, marketplace listings, support tickets, form uploads, email attachments, screenshots, and document photos."],
    ],
    relatedTools: ["tools/resize-image", "tools/convert-image", "tools/image-to-pdf"],
  },
  {
    path: "image-size-reducer-in-kb",
    title: "Image Size Reducer in KB Without Uploading",
    description: "Reduce JPG, PNG, or WebP image file size toward exact KB limits locally, including 10KB, 20KB, 30KB, 50KB, 100KB, 150KB, 200KB, 300KB, and 500KB targets.",
    headline: "Image size reducer in KB without uploading",
    lead: "Start here when a form, exam portal, job application, profile page, or support site rejects an image because the file is over a fixed KB limit. Pick the exact target, open the local image-to-KB compressor, and download a smaller copy without creating an account.",
    primaryTool: "tools/compress-image-to-kb",
    intent: "image size reducer in KB, photo size reducer under KB, no upload",
    sections: [
      ["Pick the target from the error message", "Use the exact KB number shown by the portal whenever possible. If the site says under 100KB, use the 100KB target; if it says under 20KB or 50KB, expect stronger quality tradeoffs."],
      ["Local target-size workflow", "The browser tries different dimensions and compression levels locally, then exports the closest smaller JPG or WebP it can make. The original image is not uploaded during ordinary use."],
      ["When to resize first", "If the portal also gives pixel dimensions, resize or crop before compressing. This is especially important for passport-style, exam, school, and profile photos."],
    ],
    targetLinks: [
      ["Compress image to 10KB", "compress-image-to-10kb", "For extremely strict profile, exam, school, and application upload limits."],
      ["Compress image to 20KB", "compress-image-to-20kb", "For severe exam, profile, and application photo limits."],
      ["Compress image to 30KB", "compress-image-to-30kb", "For strict portals that sit between 20KB and 50KB."],
      ["Compress image to 50KB", "compress-image-to-50kb", "For small profile photos, ID-style uploads, and form portals."],
      ["Compress image to 100KB", "compress-image-to-100kb", "For common job, school, profile, and form upload limits."],
      ["Compress image to 150KB", "compress-image-to-150kb", "For portals that allow more clarity than 100KB but still block phone photos."],
      ["Compress image to 200KB", "compress-image-to-200kb", "For forms and listings where image detail still matters."],
      ["Compress image to 300KB", "compress-image-to-300kb", "For support screenshots, listings, documents, and email attachments."],
      ["Compress image to 500KB", "compress-image-to-500kb", "For moderate upload limits where readability and detail are important."],
      ["Compress JPG to 50KB", "compress-jpg-to-50kb", "For strict JPG photo upload limits."],
      ["Compress JPG to 100KB", "compress-jpg-to-100kb", "For common JPG profile, job, and form limits."],
      ["Compress JPG to 200KB", "compress-jpg-to-200kb", "For JPG uploads where detail matters."],
      ["Compress PNG to 50KB", "compress-png-to-50kb", "For strict PNG screenshot or graphic upload limits."],
      ["Compress PNG to 100KB", "compress-png-to-100kb", "For common PNG form and support limits."],
      ["Compress PNG to 200KB", "compress-png-to-200kb", "For PNG uploads that allow more readable detail."],
      ["Passport photo to 50KB", "passport-photo-compress-to-50kb", "For strict ID-style photo file-size limits."],
      ["Passport photo to 100KB", "passport-photo-compress-to-100kb", "For common passport-style and application photo upload limits."],
      ["Passport photo to 200KB", "passport-photo-compress-to-200kb", "For ID-style uploads that allow more detail."],
    ],
    relatedTools: ["tools/compress-image-to-kb", "tools/resize-image", "tools/crop-image", "tools/passport-photo"],
  },
  {
    path: "compress-image-to-10kb",
    title: "Compress Image to 10KB Without Uploading",
    description: "Compress a JPG, PNG, or WebP image toward 10KB locally for extremely strict profile, exam, school, and application upload limits.",
    headline: "Compress image to 10KB without uploading",
    lead: "Choose an image, use the 10KB target, and download the smallest usable copy your browser can create. This page is for severe upload limits where a portal rejects almost every ordinary phone photo.",
    primaryTool: "tools/compress-image-to-kb?targetKb=10",
    intent: "compress image to 10KB, reduce photo size, strict upload limit, no upload",
    sections: [
      ["Why this is urgent", "A 10KB limit usually appears after a user has already tried to upload a photo and hit a hard portal rule. That makes the task immediate and very specific."],
      ["Local target-size workflow", "The image-to-KB compressor runs in the browser, tries smaller dimensions and compression levels, and downloads the closest result it can make without uploading the source image."],
      ["Quality warning", "10KB is tiny. Crop tightly, avoid busy backgrounds, and review the downloaded file before submitting it to an exam, school, job, or ID-style portal."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=10", "tools/resize-image", "tools/crop-image"],
  },
  {
    path: "compress-image-to-20kb",
    title: "Compress Image to 20KB Without Uploading",
    description: "Compress a JPG, PNG, or WebP image toward 20KB locally for strict exam, profile, school, and application upload limits.",
    headline: "Compress image to 20KB without uploading",
    lead: "Choose an image, use the 20KB target, and download a smaller JPG or WebP copy from your browser. This page is for very strict portals that reject profile, exam, school, ID-style, or application photos above 20KB.",
    primaryTool: "tools/compress-image-to-kb?targetKb=20",
    intent: "compress image to 20KB, reduce photo size, exam photo upload, no upload",
    sections: [
      ["Why this is urgent", "A 20KB image limit usually means the user already tried to submit a photo and got blocked by a portal rule. That is high-intent utility traffic, not casual browsing."],
      ["Local target-size workflow", "The image-to-KB compressor runs in the browser, tries smaller dimensions and compression levels, then downloads the closest usable file it can make."],
      ["Quality tradeoff", "20KB is extremely small for faces, IDs, and document text. Use a simple crop, avoid busy backgrounds, and open the result before submitting it anywhere official."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=20", "tools/resize-image", "tools/passport-photo"],
  },
  {
    path: "compress-image-to-30kb",
    title: "Compress Image to 30KB Without Uploading",
    description: "Compress a JPG, PNG, or WebP image toward 30KB locally for strict form, profile, school, and exam upload limits.",
    headline: "Compress image to 30KB without uploading",
    lead: "Choose an image, use the 30KB target, and download a smaller JPG or WebP copy from your browser. This target is common when an upload portal allows slightly more detail than 20KB but still blocks normal photos.",
    primaryTool: "tools/compress-image-to-kb?targetKb=30",
    intent: "compress image to 30KB, reduce photo size, form upload limit, no upload",
    sections: [
      ["Why this page exists", "Specific KB searches usually come from blocked uploads. A 30KB target catches strict portals that do not match the more common 20KB, 50KB, or 100KB limits."],
      ["Local target-size workflow", "The compressor re-encodes the image locally, tries smaller sizes, and exports the closest usable file it can create for the selected target."],
      ["Review the output", "Small targets can blur faces, IDs, screenshots, and product details. Open the downloaded file before sending it anywhere important."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=30", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "compress-image-to-100kb",
    title: "Compress Image to 100KB Without Uploading",
    description: "Compress a JPG, PNG, or WebP image toward 100KB locally for forms, portals, profiles, and upload limits.",
    headline: "Compress image to 100KB without uploading",
    lead: "Choose an image, select the 100KB target, and download a smaller JPG or WebP copy from your browser. This is for the common moment when a form, exam portal, job application, or profile page rejects a file as too large.",
    primaryTool: "tools/compress-image-to-kb?targetKb=100",
    intent: "compress image to 100KB, reduce image size, no upload",
    sections: [
      ["Why this is high intent", "A user searching for a specific KB target usually has a blocked upload and wants a smaller file immediately, not a design app or account signup."],
      ["Local target-size workflow", "The tool tries several quality and width combinations in the browser and picks the smallest acceptable result it can produce for the selected target."],
      ["Quality tradeoff", "Very small targets can blur text, faces, IDs, or product details. Always open the downloaded image before submitting it elsewhere."],
    ],
    relatedTools: ["tools/compress-image-to-kb", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "compress-image-to-150kb",
    title: "Compress Image to 150KB Without Uploading",
    description: "Compress a JPG, PNG, or WebP image toward 150KB locally for upload forms, profiles, job portals, and support attachments.",
    headline: "Compress image to 150KB without uploading",
    lead: "Choose an image, use the 150KB target, and download a smaller copy without sending the file to a server. This is useful when a portal allows more clarity than 100KB but still rejects large camera photos.",
    primaryTool: "tools/compress-image-to-kb?targetKb=150",
    intent: "compress image to 150KB, image size reducer, no upload",
    sections: [
      ["Why this target matters", "Some portals publish file limits that sit between common presets. A 150KB page gives those users a direct path instead of making them guess."],
      ["Local target-size workflow", "The tool tries different compression and width settings in the browser, then exports the closest smaller image it can make."],
      ["Before submitting", "Open the downloaded result and confirm the face, product, document, or screenshot detail is still clear enough for the destination site."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=150", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "compress-image-to-50kb",
    title: "Compress Image to 50KB Without Uploading",
    description: "Compress a JPG, PNG, or WebP image toward 50KB locally for strict upload limits, small profile photos, and form portals.",
    headline: "Compress image to 50KB without uploading",
    lead: "Choose an image, use the 50KB target, and download the smallest usable JPG or WebP copy your browser can create. This page is for strict upload limits where a profile, exam, school, visa-style, or admin form rejects anything larger.",
    primaryTool: "tools/compress-image-to-kb?targetKb=50",
    intent: "compress image to 50KB, reduce photo size, no upload",
    sections: [
      ["Why this is urgent", "A 50KB image limit usually appears after a user has already tried to upload a photo and been blocked. That makes the search intent immediate and practical."],
      ["Local target-size workflow", "The compressor runs in the browser, tries smaller dimensions and compression levels, and downloads a new file without uploading the source image."],
      ["Quality tradeoff", "50KB can be severe for faces, IDs, product details, or screenshots. Review the downloaded file before submitting it to a portal."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=50", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "compress-image-to-200kb",
    title: "Compress Image to 200KB Without Uploading",
    description: "Compress a JPG, PNG, or WebP image toward 200KB locally for job, school, profile, and marketplace upload limits.",
    headline: "Compress image to 200KB without uploading",
    lead: "Choose an image, use the 200KB target, and download a smaller JPG or WebP copy from your browser. This target is common when an upload form allows more clarity than 50KB or 100KB but still blocks large phone photos.",
    primaryTool: "tools/compress-image-to-kb?targetKb=200",
    intent: "compress image to 200KB, image size reducer, no upload",
    sections: [
      ["Why this page exists", "Specific KB searches often come from blocked uploads, not casual browsing. A 200KB target is useful for profile photos, marketplace images, job portals, school forms, and support screenshots."],
      ["Local target-size workflow", "The tool attempts several quality and width combinations locally, then exports the closest matching image it can produce."],
      ["Before uploading elsewhere", "Open the result and confirm important details still look clear enough for the destination site."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=200", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "compress-image-to-300kb",
    title: "Compress Image to 300KB Without Uploading",
    description: "Compress a JPG, PNG, or WebP image toward 300KB locally for forms, listings, support tickets, and email attachments.",
    headline: "Compress image to 300KB without uploading",
    lead: "Choose an image, use the 300KB target, and download a smaller copy locally. This target keeps more detail than tiny profile-photo limits while still helping large phone photos pass upload rules.",
    primaryTool: "tools/compress-image-to-kb?targetKb=300",
    intent: "compress image to 300KB, reduce image file size, no upload",
    sections: [
      ["Practical upload limit", "A 300KB target is useful for marketplace photos, document images, support screenshots, job forms, and email attachments where readability still matters."],
      ["Local target-size workflow", "The browser re-encodes the image and tries size reductions locally before exporting a new JPG or WebP copy."],
      ["Review the output", "Compression can still change sharpness or color. Open the downloaded file before submitting, sending, or printing it."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=300", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "compress-image-to-500kb",
    title: "Compress Image to 500KB Without Uploading",
    description: "Compress a JPG, PNG, or WebP image toward 500KB locally while preserving more clarity for forms, listings, and email attachments.",
    headline: "Compress image to 500KB without uploading",
    lead: "Choose an image, use the 500KB target, and download a smaller copy without sending the file to a server. This target is useful when the receiving site allows a moderate file size and readability matters.",
    primaryTool: "tools/compress-image-to-kb?targetKb=500",
    intent: "compress image to 500KB, reduce image file size, no upload",
    sections: [
      ["Better quality target", "500KB is often a friendlier limit for product images, document photos, support screenshots, and email attachments because it can preserve more detail than tiny KB targets."],
      ["Local target-size workflow", "The browser re-encodes the image and tries size reductions locally before exporting a new JPG or WebP file."],
      ["Review the output", "Even at 500KB, compression can change sharpness or color. Open the file before sending, printing, or submitting it."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=500", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "compress-jpg-to-50kb",
    title: "Compress JPG to 50KB Without Uploading",
    description: "Compress a JPG image toward 50KB locally for strict profile, exam, school, and application upload limits.",
    headline: "Compress JPG to 50KB without uploading",
    lead: "Choose a JPG photo, use the 50KB target, and download a smaller copy from your browser. This page is for strict JPG upload limits where ordinary phone photos are rejected.",
    primaryTool: "tools/compress-image-to-kb?targetKb=50",
    intent: "compress JPG to 50KB, reduce JPG file size, no upload",
    sections: [
      ["Why JPG gets this search", "Many forms ask for JPG photos and reject files above a fixed KB size. A 50KB limit is usually for profile, exam, school, or ID-style uploads."],
      ["Local target-size workflow", "The image-to-KB compressor runs in the browser, tries smaller dimensions and quality levels, and exports the closest JPG or WebP result it can make."],
      ["Quality tradeoff", "50KB can soften faces, IDs, and small text. Crop tightly and review the output before submitting it to a portal."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=50", "tools/resize-image", "tools/crop-image"],
  },
  {
    path: "compress-jpg-to-100kb",
    title: "Compress JPG to 100KB Without Uploading",
    description: "Compress a JPG image toward 100KB locally for forms, profiles, job portals, and upload limits.",
    headline: "Compress JPG to 100KB without uploading",
    lead: "Choose a JPG, use the 100KB target, and download a smaller copy without sending the source image to a server. This target is common for job applications, profiles, school forms, and admin portals.",
    primaryTool: "tools/compress-image-to-kb?targetKb=100",
    intent: "compress JPG to 100KB, JPG size reducer, no upload",
    sections: [
      ["Why this target is common", "A 100KB JPG limit often appears on profile forms, job portals, school systems, support sites, and application uploads."],
      ["Local target-size workflow", "The compressor re-encodes the image locally, tries smaller sizes, and downloads the closest result it can create for the selected target."],
      ["Before uploading elsewhere", "Open the downloaded JPG or WebP copy and confirm important face, document, or product details are still clear."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=100", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "compress-jpg-to-200kb",
    title: "Compress JPG to 200KB Without Uploading",
    description: "Compress a JPG image toward 200KB locally for job, school, marketplace, and support upload limits.",
    headline: "Compress JPG to 200KB without uploading",
    lead: "Choose a JPG, use the 200KB target, and download a smaller browser-made copy. This target keeps more detail than tiny profile-photo limits while still helping large camera photos pass upload rules.",
    primaryTool: "tools/compress-image-to-kb?targetKb=200",
    intent: "compress JPG to 200KB, reduce JPG size, no upload",
    sections: [
      ["Practical upload limit", "A 200KB JPG target is useful for forms, listings, support tickets, product photos, and profile uploads where readability still matters."],
      ["Local target-size workflow", "The browser tries different quality and size combinations locally before exporting a smaller image file."],
      ["Review the output", "Compression can change sharpness or color. Open the downloaded file before submitting, sending, or printing it."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=200", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "compress-png-to-50kb",
    title: "Compress PNG to 50KB Without Uploading",
    description: "Compress or re-export a PNG image toward 50KB locally for strict screenshot, form, and graphic upload limits.",
    headline: "Compress PNG to 50KB without uploading",
    lead: "Choose a PNG screenshot or graphic, use the 50KB target, and download a smaller copy locally. For very small limits, the exported result may use JPG or WebP when that is the only practical way to reduce size.",
    primaryTool: "tools/compress-image-to-kb?targetKb=50",
    intent: "compress PNG to 50KB, reduce PNG size, no upload",
    sections: [
      ["Why PNG can be difficult", "PNG preserves sharp edges and transparency, which can make screenshots and graphics large. A 50KB target is strict and may require format conversion."],
      ["Local target-size workflow", "The image-to-KB compressor works in the browser and tries smaller dimensions and export formats to get near the selected file-size target."],
      ["Transparency note", "If transparency matters, review the result carefully. Small target exports may use a non-transparent format to meet the file-size limit."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=50", "tools/convert-image", "tools/resize-image"],
  },
  {
    path: "compress-png-to-100kb",
    title: "Compress PNG to 100KB Without Uploading",
    description: "Compress or re-export a PNG image toward 100KB locally for forms, screenshots, support tickets, and upload limits.",
    headline: "Compress PNG to 100KB without uploading",
    lead: "Choose a PNG, use the 100KB target, and download a smaller copy from your browser. This is useful when a form accepts PNG but rejects a large screenshot or graphic.",
    primaryTool: "tools/compress-image-to-kb?targetKb=100",
    intent: "compress PNG to 100KB, PNG size reducer, no upload",
    sections: [
      ["Common PNG upload problem", "Screenshots, forms, and graphics often save as PNG and exceed upload limits. A 100KB target gives a direct path for these blocked uploads."],
      ["Local target-size workflow", "The browser re-encodes the image, tries smaller dimensions, and exports the closest result it can create without uploading the source PNG."],
      ["Review before submitting", "Check text, edges, transparency, and colors in the downloaded file before sending it to another site."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=100", "tools/compress-image", "tools/convert-image"],
  },
  {
    path: "compress-png-to-200kb",
    title: "Compress PNG to 200KB Without Uploading",
    description: "Compress or re-export a PNG image toward 200KB locally for readable screenshots, graphics, forms, and support attachments.",
    headline: "Compress PNG to 200KB without uploading",
    lead: "Choose a PNG, use the 200KB target, and download a smaller browser-made copy. This target can preserve more readable screenshot and graphic detail than 50KB or 100KB.",
    primaryTool: "tools/compress-image-to-kb?targetKb=200",
    intent: "compress PNG to 200KB, reduce PNG file size, no upload",
    sections: [
      ["Readable PNG target", "A 200KB limit is useful for screenshots, document images, product graphics, and support attachments that need more detail."],
      ["Local target-size workflow", "The compressor works locally and tries smaller dimensions and export formats before downloading a new file."],
      ["Check the result", "Open the downloaded file and confirm text, lines, transparency, and important details are acceptable for the destination portal."],
    ],
    relatedTools: ["tools/compress-image-to-kb?targetKb=200", "tools/compress-image", "tools/resize-image"],
  },
  {
    path: "passport-photo-compress-to-50kb",
    title: "Passport Photo Compress to 50KB",
    description: "Compress a passport-style or ID-style photo toward 50KB locally before uploading it to a strict form, exam portal, or application.",
    headline: "Compress a passport photo to 50KB",
    lead: "Use this when a visa-style form, exam portal, job application, school system, or profile page accepts the photo dimensions but rejects the file size. The linked image-to-KB tool opens with the 50KB target ready.",
    primaryTool: "tools/compress-image-to-kb?targetKb=50",
    intent: "passport photo compress to 50KB, ID photo size reducer, no upload",
    sections: [
      ["Start with the portal error", "If the form says the passport-style photo must be under 50KB, compress the image after cropping and resizing to the required dimensions."],
      ["Local privacy positioning", "Face photos are sensitive, so the workflow keeps the image processing in the browser during ordinary use."],
      ["Review face clarity", "50KB can soften eyes, hair, background edges, and ID-style details. Open the result before uploading it to any official or school portal."],
    ],
    relatedTools: ["tools/passport-photo", "tools/resize-image", "tools/compress-image-to-kb?targetKb=50"],
  },
  {
    path: "passport-photo-compress-to-100kb",
    title: "Passport Photo Compress to 100KB",
    description: "Compress a passport-style or ID-style photo toward 100KB locally before uploading it to a form, portal, or application.",
    headline: "Compress a passport photo to 100KB",
    lead: "Use this when a visa-style form, exam portal, job application, school system, or profile page accepts the photo but rejects the file size. The linked image-to-KB tool opens with the 100KB target ready.",
    primaryTool: "tools/compress-image-to-kb?targetKb=100",
    intent: "passport photo compress to 100KB, ID photo size reducer, no upload",
    sections: [
      ["Start with the file-size error", "If the portal says the photo must be under 100KB, compress the image first. If it also gives exact dimensions, resize or crop the photo before compressing."],
      ["Local privacy positioning", "The photo is processed in the browser during ordinary use. That matters because face photos and ID-style images are more sensitive than casual screenshots."],
      ["Review the face details", "Compression can soften eyes, hair, document edges, and background color. Open the result before submitting, and compare it with the destination's current photo rules."],
    ],
    relatedTools: ["tools/passport-photo", "tools/resize-image", "tools/compress-image-to-kb?targetKb=100"],
  },
  {
    path: "passport-photo-compress-to-200kb",
    title: "Passport Photo Compress to 200KB",
    description: "Compress a passport-style or ID-style photo toward 200KB locally before uploading it to a form, portal, or application.",
    headline: "Compress a passport photo to 200KB",
    lead: "Use this when a portal allows more clarity than 50KB or 100KB but still rejects a full-size phone photo. The linked image-to-KB tool opens with the 200KB target ready.",
    primaryTool: "tools/compress-image-to-kb?targetKb=200",
    intent: "passport photo compress to 200KB, ID photo size reducer, no upload",
    sections: [
      ["Start with dimensions first", "If the portal gives exact pixels or passport-photo proportions, crop or resize first, then compress toward the 200KB file limit."],
      ["Local privacy positioning", "The face photo is processed in the browser during ordinary use, which is preferable for ID-style and application photos."],
      ["Check before submitting", "Open the downloaded result and compare it with the destination's current rules for file size, dimensions, background, lighting, and face placement."],
    ],
    relatedTools: ["tools/passport-photo", "tools/resize-image", "tools/compress-image-to-kb?targetKb=200"],
  },
  {
    path: "passport-photo-size-fixer",
    title: "Passport Photo Size Fixer",
    description: "Fix passport-style photo dimensions and file size locally with crop, resize, and image-to-KB tools for form uploads.",
    headline: "Fix passport photo size and file limit",
    lead: "Start here when a portal rejects a passport-style, ID-style, exam, school, visa, or profile photo because the dimensions, format, or file size are wrong.",
    primaryTool: "tools/passport-photo",
    intent: "passport photo size fixer, ID photo dimensions, compress passport photo, no upload",
    sections: [
      ["Match the error message", "Use the passport photo cropper when the issue is physical size or passport-style layout. Use the resizer when the portal gives exact pixels. Use image-to-KB when the final file is still too large."],
      ["Common blocked-upload path", "A practical sequence is crop the face photo, resize to the required pixels if listed, then compress toward 20KB, 50KB, 100KB, or another portal limit."],
      ["Official rules still matter", "This page helps with crop, dimensions, format, and file size. It does not verify lighting, background, expression, age, pose, or acceptance by any authority."],
    ],
    relatedTools: ["tools/resize-image", "tools/compress-image-to-kb", "tools/crop-image"],
  },
  {
    path: "resize-photo-413x531",
    title: "Resize Photo to 413x531",
    description: "Resize a JPG, PNG, or WebP photo to 413 x 531 pixels locally for strict profile, exam, and application upload forms.",
    headline: "Resize photo to 413 x 531 pixels",
    lead: "Choose a photo and open the resizer with 413 x 531 pixels prefilled. Use it when a form or portal gives this exact dimension requirement and rejects ordinary phone photos.",
    primaryTool: "tools/resize-image?width=413&height=531&fit=cover",
    intent: "resize photo to 413x531, exam photo size, application photo dimensions, no upload",
    sections: [
      ["Why exact dimensions matter", "Some upload forms validate pixel width and height before accepting a photo. Exact-dimension searches usually happen after a user has already been blocked."],
      ["Fill and crop workflow", "The prefilled resizer uses a cover-style crop so the output can become exactly 413 x 531 pixels. Move to the crop or passport photo tools first if the face placement needs more control."],
      ["Then check file size", "After resizing, the image may still exceed a KB limit. If the portal also says under 20KB, 50KB, or 100KB, run the resized output through the image-to-KB compressor."],
    ],
    relatedTools: ["tools/resize-image?width=413&height=531&fit=cover", "tools/passport-photo", "tools/compress-image-to-kb?targetKb=100"],
  },
  {
    path: "resize-image-no-upload",
    title: "Resize Image Without Uploading",
    description: "Resize a JPG, PNG, or WebP image by width, height, or common preset locally in your browser.",
    headline: "Resize image without uploading",
    lead: "Select an image, choose a custom width or a common preset, then download a resized copy without creating an account or uploading the file.",
    primaryTool: "tools/resize-image",
    intent: "resize image online, change image dimensions, no upload",
    sections: [
      ["The urgent user problem", "Image size requirements show up in job portals, ID forms, seller platforms, social profiles, school portals, and support forms. A fast no-upload resizer solves that moment."],
      ["Fit or crop", "Fit inside keeps the whole image visible. Fill and crop is better when the target size must be exact, such as a square profile image or thumbnail."],
      ["Before uploading elsewhere", "Open the downloaded image and confirm important content is still visible, especially faces, text, IDs, product details, or form screenshots."],
    ],
    relatedTools: ["tools/compress-image", "tools/convert-image", "tools/image-to-pdf"],
  },
  {
    path: "convert-image-format-no-upload",
    title: "Convert Image Format Without Uploading",
    description: "Convert JPG, PNG, and WebP image formats locally in your browser without uploading the source image.",
    headline: "Convert image format without uploading",
    lead: "Turn a JPG, PNG, or WebP image into another common format in the browser. Use it when a website rejects the current file type or when you need a lighter web-friendly image.",
    primaryTool: "tools/convert-image",
    intent: "convert image format, JPG to PNG, PNG to WebP, no upload",
    sections: [
      ["Common format mismatch", "Many upload forms accept only one image type. A local converter helps users switch file format without sending private images to a server."],
      ["Format choices", "JPG is useful for photos and small file size. PNG is useful for sharp graphics. WebP is often smaller for web use when the receiving site accepts it."],
      ["Review the result", "After conversion, check that transparency, background color, and image clarity still match the destination requirement."],
    ],
    relatedTools: ["tools/compress-image", "tools/resize-image", "tools/multi-image-pdf"],
  },
  {
    path: "remove-background-no-upload",
    title: "Remove Background Without Uploading",
    description: "Remove a white, solid, green-screen, or near-solid image background locally and download a transparent PNG.",
    headline: "Remove background without uploading",
    lead: "Choose an image, let the browser sample the background color, adjust tolerance, and download a transparent PNG without sending the file to a server.",
    primaryTool: "tools/remove-background",
    intent: "remove background, transparent PNG, white background remover, no upload",
    sections: [
      ["Why this is high intent", "Background removal searches often come from sellers, creators, students, and office users who need a cleaner product image, logo, signature scan, or graphic immediately."],
      ["What this free version does", "The tool removes solid or near-solid backgrounds by color matching in the browser. It works well for white backgrounds, flat product shots, logos, icons, signatures, and green-screen style images."],
      ["Important limit", "This is not a full AI person or hair segmentation tool. Busy backgrounds, shadows, glass, and complex edges may need a dedicated editor."],
    ],
    relatedTools: ["tools/compress-image", "tools/convert-image", "tools/signature-png"],
  },
  {
    path: "crop-image-no-upload",
    title: "Crop Image Without Uploading",
    description: "Crop JPG, PNG, or WebP images locally in your browser for square avatars, product photos, banners, and upload forms.",
    headline: "Crop image without uploading",
    lead: "Choose an image, pick a crop shape, keep the important area in frame, and download a cropped copy without sending the file to a server.",
    primaryTool: "tools/crop-image",
    intent: "crop image online, square crop, no upload",
    sections: [
      ["Why users need it", "Cropping is a common step before a profile photo, marketplace listing, ID-style upload, social post, or banner will look right."],
      ["Local crop workflow", "The image is loaded in the browser, cropped to the selected aspect ratio, and exported as a new image file without requiring an account."],
      ["Before uploading elsewhere", "Check that faces, product edges, text, logos, and important document details are still visible after the crop."],
    ],
    relatedTools: ["tools/resize-image", "tools/compress-image", "tools/watermark-image"],
  },
  {
    path: "rotate-image-no-upload",
    title: "Rotate Image Without Uploading",
    description: "Rotate or flip JPG, PNG, and WebP images locally in the browser when a photo, scan, or screenshot is sideways.",
    headline: "Rotate image without uploading",
    lead: "Fix a sideways image, rotate a scan, or flip a photo locally before using it in a form, profile, document, or listing.",
    primaryTool: "tools/rotate-image",
    intent: "rotate image online, flip image, no upload",
    sections: [
      ["Common use case", "Phone photos and quick scans often come out sideways. A small local rotation tool solves that before the image is attached to another workflow."],
      ["What it changes", "The tool creates a new rotated or flipped copy. It does not edit the original image file on your device."],
      ["Review the result", "Open the downloaded image and confirm orientation, text readability, and any mirrored content before sending it elsewhere."],
    ],
    relatedTools: ["tools/crop-image", "tools/resize-image", "tools/image-to-pdf"],
  },
  {
    path: "watermark-image-no-upload",
    title: "Watermark Image Without Uploading",
    description: "Add a simple text watermark to JPG, PNG, or WebP images locally for samples, drafts, marketplace photos, and social posts.",
    headline: "Watermark image without uploading",
    lead: "Add a visible text watermark in the browser and download a new copy without uploading the source image.",
    primaryTool: "tools/watermark-image",
    intent: "watermark image online, add text watermark, no upload",
    sections: [
      ["Why it can convert", "People often need to share a sample, proof, preview, or product image while keeping a visible ownership or draft mark on the file."],
      ["Ad-safe free workflow", "The watermark export stays free and does not ask visitors to interact with an ad before downloading. That keeps the path safer for future display advertising."],
      ["Practical limits", "A text watermark is a visual deterrent, not copyright enforcement. Keep original files and use proper licensing or platform tools when the image is commercially important."],
    ],
    relatedTools: ["tools/compress-image", "tools/resize-image", "tools/crop-image"],
  },
  {
    path: "add-text-to-image-no-upload",
    title: "Add Text to Image Without Uploading",
    description: "Add a title, caption, price, label, or meme-style text to a photo locally in your browser.",
    headline: "Add text to image without uploading",
    lead: "Choose an image, add short text, pick a placement, and download a new JPG, PNG, or WebP without sending the image to a server.",
    primaryTool: "tools/add-text-image",
    intent: "add text to image, text on photo, caption image, no upload",
    sections: [
      ["Why users need it", "People add text to images for listings, covers, thumbnails, class materials, social posts, memes, announcements, and quick visual notes. Many design tools are heavier than this one-step job."],
      ["Local workflow", "The image is drawn into a canvas in the browser, the text overlay is rendered locally, and the exported file is downloaded as a new image."],
      ["Practical limits", "This is a quick overlay tool, not a full design suite. Keep the message short and check that text remains readable on small screens."],
    ],
    relatedTools: ["tools/resize-image", "tools/watermark-image", "tools/crop-image"],
  },
  {
    path: "free-qr-code-generator-no-signup",
    title: "Free QR Code Generator Without Signup",
    description: "Create a static QR code PDF for a URL, menu, sign, flyer, event page, or short text without creating an account.",
    headline: "Free QR code generator without signup",
    lead: "Make a printable static QR code in the browser and download a clean PDF without registering. This is useful for signs, menus, flyers, handouts, event pages, packaging notes, and quick links.",
    primaryTool: "tools/qr-code",
    intent: "QR code generator, no signup, printable static QR",
    sections: [
      ["Why this page exists", "Many QR sites advertise a free code and then push account creation, dynamic tracking, or paid downloads. This validation version keeps static QR creation free and simple."],
      ["Static vs dynamic", "A static QR code stores the final link or text directly in the code. It is privacy-friendly and durable, but it cannot be edited after printing."],
      ["Before printing", "Scan the generated code with at least one phone, confirm the destination, and keep enough white space around the code for reliable scanning."],
    ],
    relatedTools: ["tools/wifi-qr-code", "tools/vcard-qr-code", "tools/flyer-maker"],
  },
  {
    path: "wifi-qr-code-generator",
    title: "WiFi QR Code Generator",
    description: "Create a printable WiFi QR code sign for guest networks, rentals, offices, cafes, classrooms, waiting rooms, and events.",
    headline: "WiFi QR code generator",
    lead: "Turn a network name and password into a scannable WiFi QR sign. The PDF is generated locally so you can print a simple guest access page without building a full design.",
    primaryTool: "tools/wifi-qr-code",
    intent: "WiFi QR code generator, guest WiFi sign, printable QR",
    sections: [
      ["Why users need it", "Guests often mistype WiFi passwords. A QR code reduces friction in cafes, rentals, small offices, events, classrooms, and waiting rooms."],
      ["Security note", "Anyone who can scan the printed code can access the encoded network details. Use a guest network and avoid printing private admin credentials."],
      ["Best fit", "Use it for guest WiFi signs, short-term rental welcome sheets, front desk signs, booth check-in areas, and classroom visitor instructions."],
    ],
    relatedTools: ["tools/qr-code", "tools/vcard-qr-code", "tools/sign-in-sheet"],
  },
  {
    path: "contact-qr-code-generator",
    title: "Contact QR Code Generator",
    description: "Create a printable vCard contact QR code for business cards, event badges, service flyers, booth signs, and local promotions.",
    headline: "Contact QR code generator",
    lead: "Enter contact details and download a QR code PDF that phones can scan to save a contact. It is a lightweight alternative to paid digital card services when you only need a printable contact code.",
    primaryTool: "tools/vcard-qr-code",
    intent: "contact QR code, vCard QR generator, printable business contact",
    sections: [
      ["Why this can attract demand", "Small sellers, freelancers, creators, and event exhibitors often need a quick way for visitors to save contact details from a flyer or table sign."],
      ["What the QR stores", "The code uses a vCard-style contact payload with name, company, phone, email, website, and a short note when provided."],
      ["Before sharing", "Scan the code on both iOS and Android if possible, review the saved contact fields, and avoid including sensitive private details on public printouts."],
    ],
    relatedTools: ["tools/business-card", "tools/qr-code", "tools/flyer-maker"],
  },
  {
    path: "compress-jpg-no-upload",
    title: "Compress JPG Without Uploading",
    description: "Compress a JPG image locally in your browser before sending it to a form, email, profile, or marketplace listing.",
    headline: "Compress JPG without uploading",
    lead: "Reduce a JPG photo or screenshot in the browser and download a smaller copy. Use this when an upload form says the image file is too large.",
    primaryTool: "tools/compress-image",
    intent: "compress JPG online, reduce JPG file size, no upload",
    sections: [
      ["Why JPG compression gets searched", "JPG files are common for phone photos, profile pictures, product listings, and support screenshots. The search usually happens after a website rejects the upload size."],
      ["Local compression path", "Choose the JPG, pick a compression level, and download a new file. The browser handles the preview and export without requiring an account."],
      ["Best fit", "Use it for photos, marketplace images, profile uploads, email attachments, help desk screenshots, and form submissions that require smaller JPG files."],
    ],
    relatedTools: ["tools/resize-image", "tools/convert-image", "tools/image-to-pdf"],
  },
  {
    path: "compress-png-no-upload",
    title: "Compress PNG Without Uploading",
    description: "Compress or re-export a PNG image locally in your browser when a form or email rejects a large file.",
    headline: "Compress PNG without uploading",
    lead: "Make a smaller PNG or convert it to a compact JPG/WebP copy locally. This is useful for screenshots, graphics, forms, and support images.",
    primaryTool: "tools/compress-image",
    intent: "compress PNG online, reduce PNG size, no upload",
    sections: [
      ["Why PNG files get large", "Screenshots and graphics often save as PNG because they preserve sharp edges. That can create large files when a website only accepts smaller uploads."],
      ["Compression choices", "Keep PNG when sharp graphics matter, or export as JPG/WebP from the same tool when a smaller photo-style file is acceptable."],
      ["Review before upload", "Open the downloaded image and confirm text, edges, transparency, and important details still look right before sending it elsewhere."],
    ],
    relatedTools: ["tools/convert-image", "tools/resize-image", "tools/image-to-pdf"],
  },
  {
    path: "resize-image-1080x1080",
    title: "Resize Image to 1080x1080",
    description: "Resize an image to a 1080 by 1080 square locally in your browser for profile, listing, or social post requirements.",
    headline: "Resize image to 1080x1080",
    lead: "Create a square 1080x1080 image in the browser without uploading the source file. This is a common size for social posts, product images, and profile-style uploads.",
    primaryTool: "tools/resize-image",
    intent: "resize image to 1080x1080, square image resize, no upload",
    sections: [
      ["Common square requirement", "Many upload workflows prefer square images because they display cleanly in grids, cards, avatars, and listings."],
      ["Fit or crop decision", "Use fit inside when the full image must stay visible. Use fill and crop when the final file must be an exact square."],
      ["Before publishing", "Check faces, product edges, labels, and text after resizing because square crops can remove important context."],
    ],
    relatedTools: ["tools/compress-image", "tools/convert-image", "tools/image-to-pdf"],
  },
  {
    path: "resize-image-512x512",
    title: "Resize Image to 512x512",
    description: "Resize an image to 512 by 512 pixels locally in your browser for avatars, icons, thumbnails, and small profile uploads.",
    headline: "Resize image to 512x512",
    lead: "Create a small square 512x512 image in the browser. This works well for avatars, icons, thumbnail uploads, and profile pictures with strict dimension rules.",
    primaryTool: "tools/resize-image",
    intent: "resize image to 512x512, profile picture resizer, no upload",
    sections: [
      ["Why 512x512 matters", "Small square images are often requested for avatars, account icons, thumbnails, app profiles, and lightweight upload forms."],
      ["Keep it readable", "At 512 pixels, tiny text and product details can become hard to read. Crop around the main subject before uploading the result."],
      ["Privacy angle", "The image is processed locally in the browser, which is helpful when the source is a personal profile photo or ID-related upload preview."],
    ],
    relatedTools: ["tools/compress-image", "tools/convert-image", "tools/image-to-pdf"],
  },
  {
    path: "png-to-jpg-no-upload",
    title: "PNG to JPG Without Uploading",
    description: "Convert PNG to JPG locally in your browser when a website needs a JPG file or a smaller photo-style image.",
    headline: "PNG to JPG without uploading",
    lead: "Turn a PNG screenshot or graphic into a JPG copy in the browser. Use it when an upload form accepts JPG but rejects PNG, or when the PNG is too large.",
    primaryTool: "tools/convert-image",
    intent: "PNG to JPG converter, no upload, browser image conversion",
    sections: [
      ["When PNG to JPG helps", "Many websites accept JPG for photos and listings but reject PNG. JPG can also be smaller for photo-style images."],
      ["Background note", "JPG does not preserve transparency. If the PNG has transparent areas, choose a white or black background before export."],
      ["Check the result", "Open the JPG and confirm text, colors, and any transparent areas look acceptable for the destination site."],
    ],
    relatedTools: ["tools/compress-image", "tools/resize-image", "tools/image-to-pdf"],
  },
  {
    path: "webp-to-jpg-no-upload",
    title: "WebP to JPG Without Uploading",
    description: "Convert WebP to JPG locally in your browser when a form, marketplace, or older app does not accept WebP files.",
    headline: "WebP to JPG without uploading",
    lead: "Convert a WebP image into a JPG copy without sending the source file to a server. Use it when a website accepts JPG but not WebP.",
    primaryTool: "tools/convert-image",
    intent: "WebP to JPG converter, no upload, browser image conversion",
    sections: [
      ["Why WebP gets rejected", "WebP is common on the web, but some forms, portals, marketplaces, and older tools still ask for JPG or PNG uploads."],
      ["Local format conversion", "Select the WebP, choose JPG, and download a compatible copy from the browser. No account is needed for the free conversion."],
      ["Quality check", "Review the converted JPG before uploading it elsewhere, especially if the original WebP contained small text or transparent areas."],
    ],
    relatedTools: ["tools/compress-image", "tools/resize-image", "tools/image-to-pdf"],
  },
  {
    path: "text-to-pdf-no-signup",
    title: "Text to PDF Converter Without Signup",
    description: "Paste plain text and download a clean PDF without installing an editor, uploading a file, or creating an account.",
    headline: "Text to PDF converter without signup",
    lead: "Turn notes, instructions, short letters, meeting summaries, or plain text drafts into a simple one-page PDF. No account is required for the free export.",
    primaryTool: "tools/text-to-pdf",
    intent: "plain text to PDF with no account",
    sections: [
      ["Fast plain text workflow", "Paste text, choose a readable size, generate the preview, and download the PDF. This is intentionally simpler than a full document editor."],
      ["Good use cases", "Use it for short notes, printable instructions, handouts, simple letters, checklists, and text copied from another app."],
      ["One-page focus", "The free version is best for concise documents. Long text should be shortened or split into sections before export."],
    ],
    relatedTools: ["tools/image-to-pdf", "tools/todo-list", "tools/sign-in-sheet"],
  },
  {
    path: "markdown-to-pdf-no-signup",
    title: "Markdown to PDF Converter Without Signup",
    description: "Paste Markdown notes, README text, docs, or outlines and download a clean PDF locally in your browser.",
    headline: "Markdown to PDF converter without signup",
    lead: "Turn Markdown into a readable PDF without creating an account, installing an editor, or uploading the source text. It is useful for README drafts, changelogs, project notes, study notes, and handouts.",
    primaryTool: "tools/markdown-to-pdf",
    intent: "Markdown to PDF, no account, no upload",
    sections: [
      ["Fast Markdown workflow", "Paste Markdown, choose a simple style, generate the preview, and download the PDF. The first version focuses on readable headings, lists, quotes, and paragraphs."],
      ["Good use cases", "Use it for README snapshots, project notes, lesson outlines, meeting summaries, simple docs, and checklists that need a PDF copy."],
      ["Local processing", "The Markdown is rendered in the browser preview and exported as a PDF page without requiring a server upload."],
    ],
    relatedTools: ["tools/text-to-pdf", "tools/json-to-pdf", "tools/todo-list"],
  },
  {
    path: "csv-to-pdf-no-upload",
    title: "CSV to PDF Table Converter Without Uploading",
    description: "Paste CSV rows and export a readable PDF table locally without uploading a spreadsheet.",
    headline: "CSV to PDF table converter without uploading",
    lead: "Create a simple PDF table from CSV rows in the browser. This is useful for inventory lists, event rosters, order lists, task lists, price sheets, and small reports that need a printable copy.",
    primaryTool: "tools/csv-to-pdf",
    intent: "CSV to PDF table, no upload, no account",
    sections: [
      ["Paste rows, get a table", "The first CSV row becomes the header and the remaining rows become table lines. Keep the table small enough to read clearly on one page."],
      ["Why local CSV helps", "CSV files can include customer names, small order details, event rosters, or stock counts. A local converter avoids uploading the data for ordinary quick exports."],
      ["Before sharing", "Open the downloaded PDF and confirm every column is readable, especially when the CSV has long text fields."],
    ],
    relatedTools: ["tools/inventory-sheet", "tools/packing-slip", "tools/text-to-pdf"],
  },
  {
    path: "json-to-pdf-no-upload",
    title: "JSON to PDF Formatter Without Uploading",
    description: "Paste JSON and download a readable formatted PDF locally in your browser.",
    headline: "JSON to PDF formatter without uploading",
    lead: "Format JSON into a clean PDF page without sending the source data to a server. It is useful for API samples, config snippets, bug reports, test fixtures, and technical notes.",
    primaryTool: "tools/json-to-pdf",
    intent: "JSON to PDF formatter, no upload, no account",
    sections: [
      ["Readable technical notes", "The formatter pretty-prints valid JSON and shows invalid JSON as plain text with a warning so you can still export a review copy."],
      ["Local-first workflow", "The JSON is processed in the browser. Do not paste secrets, keys, or private production data unless you have reviewed and removed sensitive values."],
      ["Good use cases", "Use it for sample payloads, documentation snippets, QA notes, configuration examples, and small API response references."],
    ],
    relatedTools: ["tools/markdown-to-pdf", "tools/text-to-pdf", "tools/csv-to-pdf"],
  },
  {
    path: "merge-pdf-no-upload",
    title: "Merge PDF Without Uploading",
    description: "Combine PDF files locally in your browser without uploading documents or creating an account.",
    headline: "Merge PDF without uploading",
    lead: "Select several PDF files, preview their order and page counts, then download one combined PDF. This is built for private paperwork, school forms, receipts, scan batches, and admin documents you do not want to upload.",
    primaryTool: "tools/merge-pdf",
    intent: "combine PDF files, no upload, no account",
    sections: [
      ["Local merge workflow", "The selected PDFs are read in the browser and copied into a new combined file. Ordinary merging does not require sending the documents to a server."],
      ["Best fit", "Use it for forms, receipts, scan batches, school packets, client documents, and any small set of PDFs that needs one file."],
      ["Practical limits", "Very large PDFs can use a lot of browser memory. For sensitive or high-stakes documents, review the final PDF before sharing it."],
    ],
    relatedTools: ["tools/split-pdf", "tools/pdf-page-numbers", "tools/multi-image-pdf"],
  },
  {
    path: "split-pdf-no-upload",
    title: "Split PDF Without Uploading",
    description: "Extract selected PDF pages locally in your browser without uploading the document.",
    headline: "Split PDF without uploading",
    lead: "Choose one PDF, enter the pages you want to keep, and download a smaller extracted PDF. It is designed for quick page removal and document trimming without an upload step.",
    primaryTool: "tools/split-pdf",
    intent: "extract PDF pages, no upload, no account",
    sections: [
      ["Extract only what you need", "Use page numbers or ranges such as 1,3-5 to keep the pages that matter and leave the rest out of the new PDF."],
      ["Privacy positioning", "The source PDF is processed in the browser for ordinary extraction, which helps when a document includes private pages you do not want to upload."],
      ["Before sharing", "Open the downloaded file and confirm the page order and page count before sending it to a school, client, employer, or portal."],
    ],
    relatedTools: ["tools/merge-pdf", "tools/pdf-page-numbers", "tools/text-to-pdf"],
  },
  {
    path: "add-page-numbers-to-pdf",
    title: "Add Page Numbers to PDF",
    description: "Add simple page numbers to an existing PDF locally in your browser without uploading the file.",
    headline: "Add page numbers to PDF",
    lead: "Select a PDF, choose where the page numbers should appear, and download a numbered copy. It is useful for packets, handouts, client drafts, and documents that need page references.",
    primaryTool: "tools/pdf-page-numbers",
    intent: "add page numbers to PDF, no upload, no account",
    sections: [
      ["Why page numbers matter", "Longer PDF packets are easier to review when each page has a clear number. This tool adds simple numbering without forcing a design app."],
      ["Local-first workflow", "The PDF is loaded and edited in the browser for ordinary numbering. The site does not need the file to add the visible page text."],
      ["Best fit", "Use it for classroom packets, meeting handouts, client drafts, applications, reports, and merged PDFs that need references."],
    ],
    relatedTools: ["tools/merge-pdf", "tools/split-pdf", "tools/text-to-pdf"],
  },
  {
    path: "rotate-pdf-no-upload",
    title: "Rotate PDF Pages Without Uploading",
    description: "Rotate PDF pages locally in your browser without uploading the file or creating an account.",
    headline: "Rotate PDF pages without uploading",
    lead: "Select a PDF, choose a rotation angle, and rotate all pages or only selected pages. This is useful when scans, forms, or phone-generated PDFs are sideways or upside down.",
    primaryTool: "tools/rotate-pdf",
    intent: "rotate PDF pages, no upload, no account",
    sections: [
      ["Fix sideways scans quickly", "Scanned forms and phone photos often become PDFs with the wrong orientation. This tool rotates pages locally before you share the file."],
      ["Selected pages or all pages", "Use all when the whole document is sideways, or enter ranges such as 1,3-5 when only a few pages need correction."],
      ["Review before sending", "Open the downloaded copy and confirm the orientation is correct on every page before uploading it to a portal or sending it to someone else."],
    ],
    relatedTools: ["tools/split-pdf", "tools/remove-pdf-pages", "tools/reorder-pdf-pages"],
  },
  {
    path: "remove-pages-from-pdf-no-upload",
    title: "Remove Pages from PDF Without Uploading",
    description: "Delete selected PDF pages locally in your browser without uploading the document.",
    headline: "Remove pages from PDF without uploading",
    lead: "Choose a PDF, enter the pages you want to remove, and download a new copy without those pages. This is built for trimming blank pages, cover sheets, duplicates, and private pages.",
    primaryTool: "tools/remove-pdf-pages",
    intent: "delete PDF pages, no upload, no account",
    sections: [
      ["Trim only the unwanted pages", "Enter pages or ranges such as 1,3-5. The export keeps the remaining pages in their original order."],
      ["Privacy positioning", "Removing pages locally helps when the source document contains private pages that you do not want to send to an online converter."],
      ["Avoid mistakes", "Check the preview count, then open the downloaded PDF and confirm the removed pages are really gone before sharing it."],
    ],
    relatedTools: ["tools/split-pdf", "tools/reorder-pdf-pages", "tools/merge-pdf"],
  },
  {
    path: "reorder-pdf-pages-no-upload",
    title: "Reorder PDF Pages Without Uploading",
    description: "Rearrange PDF pages locally in your browser by entering the new page order.",
    headline: "Reorder PDF pages without uploading",
    lead: "Select one PDF and type the page order you want, such as 3,1,2. This creates a new PDF in that order without uploading the source document.",
    primaryTool: "tools/reorder-pdf-pages",
    intent: "reorder PDF pages, organize PDF, no upload",
    sections: [
      ["Organize pages by number", "Use a comma-separated page order to move pages around. You can also omit pages when you only want a shorter ordered copy."],
      ["Common use cases", "Reorder scanned forms, handouts, application packets, receipts, classroom files, or client drafts when pages were captured out of sequence."],
      ["Keep it simple", "This first version uses typed page numbers instead of a drag interface so it stays fast, mobile-friendly, and free to run without a server."],
    ],
    relatedTools: ["tools/merge-pdf", "tools/remove-pdf-pages", "tools/pdf-page-numbers"],
  },
  {
    path: "watermark-pdf-no-upload",
    title: "Add Watermark to PDF Without Uploading",
    description: "Add a text watermark to PDF pages locally in your browser without uploading the file.",
    headline: "Add watermark to PDF without uploading",
    lead: "Select a PDF, type the watermark text, choose all pages or selected pages, and download a marked copy. This is useful for drafts, samples, review files, and internal paperwork that should stay local.",
    primaryTool: "tools/watermark-pdf",
    intent: "watermark PDF, no upload, free browser tool",
    sections: [
      ["Mark drafts and samples", "A watermark helps show that a PDF is a draft, sample, confidential copy, or review version without changing the original file."],
      ["Local-first workflow", "The PDF is read and edited in the browser for ordinary watermarking, which avoids sending private documents to a converter server."],
      ["Use a light mark", "A useful watermark is visible but does not hide the actual document. Review the downloaded PDF before sharing it."],
    ],
    relatedTools: ["tools/stamp-pdf", "tools/sign-pdf", "tools/pdf-page-numbers"],
  },
  {
    path: "stamp-pdf-no-upload",
    title: "Stamp PDF Without Uploading",
    description: "Add a PAID, APPROVED, DRAFT, or custom text stamp to PDF pages locally in your browser.",
    headline: "Stamp PDF without uploading",
    lead: "Add a simple status stamp to a PDF copy without creating an account or uploading the source file. Use it for paid receipts, approved drafts, review packets, or internal document routing.",
    primaryTool: "tools/stamp-pdf",
    intent: "stamp PDF, paid stamp, approved stamp, no upload",
    sections: [
      ["Status stamps for real paperwork", "A visible stamp can make a receipt, invoice, work order, or draft easier to scan when it moves between people."],
      ["Choose the pages", "Stamp every page or enter a short range such as 1,3-5 when only the cover or key pages need a status mark."],
      ["Review before relying on it", "A stamp is a visual annotation, not proof of payment or legal approval by itself. Keep the underlying records too."],
    ],
    relatedTools: ["tools/watermark-pdf", "tools/receipt-generator", "tools/work-order"],
  },
  {
    path: "sign-pdf-no-upload",
    title: "Add Signature Text to PDF Without Uploading",
    description: "Place a typed signature block on a selected PDF page locally in your browser.",
    headline: "Add signature text to PDF without uploading",
    lead: "Add a typed signature name and optional date to a selected PDF page. This is a lightweight browser tool for documents where a typed signature block is acceptable.",
    primaryTool: "tools/sign-pdf",
    intent: "sign PDF, typed signature, no upload",
    sections: [
      ["Typed signature block", "The tool adds a signature line, typed name, and optional date to a selected page. It does not claim to be an e-signature platform."],
      ["Local processing", "The PDF is read and annotated in the browser for ordinary use, so the source file does not need to be uploaded to PrintableTools Lab."],
      ["Check acceptance rules", "Some documents require a specific e-sign provider, handwritten signature, witness, or identity check. Use this only where a typed signature is acceptable."],
    ],
    relatedTools: ["tools/stamp-pdf", "tools/watermark-pdf", "tools/pdf-page-numbers"],
  },
  {
    path: "free-resume-builder-no-signup",
    title: "Free Resume Builder Without Signup",
    description: "Build and download a clean one-page resume PDF without creating an account or paying at the export step.",
    headline: "Free resume builder without signup",
    lead: "Create a simple resume PDF for job applications without a hidden download fee. The layout is plain, readable, and built for quick edits before applying.",
    primaryTool: "tools/resume-builder",
    intent: "resume PDF download without account or paywall",
    sections: [
      ["Avoid the export surprise", "Some resume builders let users type the whole resume and then charge at download. This tool is positioned around a free one-page PDF export first."],
      ["Readable structure", "The resume includes name, headline, contact line, summary, experience, skills, and education in a simple single-column format."],
      ["Before applying", "Proofread every line, avoid private details you do not want to share, and tailor the summary and experience bullets to the role."],
    ],
    relatedTools: ["tools/cover-letter", "tools/resignation-letter", "tools/text-to-pdf"],
  },
  {
    path: "ats-resume-checker-free",
    title: "Free ATS Resume Checker",
    description: "Check resume text against a job description locally and download a one-page ATS keyword match report.",
    headline: "Free ATS resume checker",
    lead: "Paste your resume text and a job description to get a local keyword, section, readability, and evidence check. The report is designed for practical editing before you apply.",
    primaryTool: "tools/ats-resume-checker",
    intent: "ATS resume checker, resume keyword match, job description match",
    sections: [
      ["Why this is high intent", "Job seekers often search for ATS checks right before applying. Many resume sites show a score or suggestions only after signup, upload, or paid export."],
      ["Local text check", "This checker runs on pasted text in the browser. It does not upload your resume and does not promise a universal ATS score, interview, or hiring outcome."],
      ["What to fix first", "Use the report to compare honest keywords, section headings, measurable achievements, contact details, and overly complex wording against the role."],
    ],
    relatedTools: ["tools/resume-builder", "tools/cover-letter", "tools/text-to-pdf"],
  },
  {
    path: "pdf-to-word-no-upload",
    title: "PDF to Word Without Uploading",
    description: "Convert selectable PDF text into a simple DOCX document locally in your browser without uploading the PDF to a converter server.",
    headline: "PDF to Word without uploading",
    lead: "Choose a PDF and download a simple Word-compatible DOCX made from selectable text in the browser. It is built for quick edits when you do not want to send a private document to an online converter.",
    primaryTool: "tools/pdf-to-word",
    intent: "PDF to Word, PDF to DOCX, no upload PDF converter",
    sections: [
      ["Why this search has urgency", "PDF-to-Word searches often happen when someone must edit a report, letter, assignment, resume, or form right before submitting it. Many converters require upload, queueing, signup, or a paid export step."],
      ["What this free version does", "The browser reads selectable PDF text and writes a clean DOCX with page headings. It is useful for editing the words, not for perfect visual layout reconstruction."],
      ["Important limit", "Scanned image-only PDFs need OCR first, and complex tables, columns, forms, or legal formatting may be simplified. Keep the original PDF when exact layout matters."],
    ],
    relatedTools: ["tools/pdf-to-text", "tools/markdown-to-pdf", "tools/text-to-pdf"],
  },
  {
    path: "free-receipt-generator-no-signup",
    title: "Free Receipt Generator Without Signup",
    description: "Create a printable receipt PDF for a sale, deposit, service payment, reimbursement, or rent record without an account.",
    headline: "Free receipt generator without signup",
    lead: "Make a simple dated receipt PDF when money has already changed hands. It is useful for service payments, deposits, private sales, reimbursements, and basic records.",
    primaryTool: "tools/receipt-generator",
    intent: "receipt PDF now, no account, quick proof of payment",
    sections: [
      ["Invoice vs receipt", "Use an invoice before payment is due. Use a receipt after payment is made and both sides need a record."],
      ["What to include", "Payer, recipient, payment date, amount, method, description, and a short note. Keep copies with your own records."],
      ["Limits", "This is a practical receipt format, not legal, tax, or accounting advice. Requirements vary by business type and location."],
    ],
    relatedTools: ["tools/invoice-generator", "tools/rent-receipt", "tools/bill-of-sale"],
  },
  {
    path: "weekly-timesheet-pdf-no-signup",
    title: "Weekly Timesheet PDF Without Signup",
    description: "Create a printable weekly timesheet PDF for freelance hours, staff records, project tracking, or approvals without creating an account.",
    headline: "Weekly timesheet PDF without signup",
    lead: "Track days, projects, hours, notes, total hours, and approval signature on one printable page. Good for freelancers, contractors, and small teams.",
    primaryTool: "tools/timesheet-generator",
    intent: "weekly timesheet PDF with fast export",
    sections: [
      ["Repeat use", "Timesheets are naturally recurring. A fast no-signup page can serve weekly or pay-period workflows without forcing a full HR app."],
      ["What it includes", "Worker, period, day/project/hour rows, notes, total hours, and signature lines. Review hours before submitting them."],
      ["When to use a system", "If payroll, compliance, overtime, or approvals are complex, use proper time-tracking or payroll software. This page is for simple printable records."],
    ],
    relatedTools: ["tools/invoice-generator", "tools/receipt-generator", "tools/todo-list"],
  },
  {
    path: "free-certificate-maker-no-signup",
    title: "Free Certificate Maker Without Signup",
    description: "Create and download a printable certificate PDF for classroom awards, participation, completion, clubs, and small events.",
    headline: "Free certificate maker without signup",
    lead: "Generate a certificate PDF quickly for a classroom, club, workshop, team, or small event. The first version focuses on a clean printable layout instead of a template marketplace.",
    primaryTool: "tools/certificate-generator",
    intent: "certificate PDF download without account",
    sections: [
      ["Useful moments", "Use it for completion, participation, appreciation, classroom awards, clubs, small events, and workshops."],
      ["Simple fields", "Certificate title, recipient name, reason, date, style, and signer are enough for a practical printable certificate."],
      ["Print check", "Preview the PDF before printing and confirm names, dates, and signer spelling. Certificates are usually noticed for typos."],
    ],
    relatedTools: ["tools/sign-in-sheet", "tools/todo-list", "tools/flashcards"],
  },
  {
    path: "free-business-card-generator-printable",
    title: "Free Printable Business Card Generator",
    description: "Create a printable business card PDF sheet without signing up, uploading a logo, or paying at download.",
    headline: "Free printable business card generator",
    lead: "Make a simple contact card sheet for a side project, local service, pop-up table, class, or event. It is built for people who need usable cards today, not a full design suite.",
    primaryTool: "tools/business-card",
    intent: "printable business cards now, no account, no design software",
    sections: [
      ["Why this works as a free tool", "Business card builders often push users toward print orders or paid template downloads. A browser-side sheet solves the one-time need first and can validate whether small-business searches bring repeat usage."],
      ["Best fit", "Use it for simple service cards, networking cards, appointment cards, event contact cards, and temporary cards before ordering professional prints."],
      ["Print check", "Print one test page, trim along the card edges, and confirm the email, phone, and URL are readable before printing more."],
    ],
    relatedTools: ["tools/flyer-maker", "tools/coupon-maker", "tools/address-labels"],
  },
  {
    path: "free-address-label-generator-printable",
    title: "Free Printable Address Label Generator",
    description: "Create return address labels, mailing labels, badge labels, or classroom labels as a printable PDF sheet.",
    headline: "Free printable address label generator",
    lead: "Generate a clean label sheet in the browser for mail, bins, folders, event badges, or small shipping workflows. No account is required for the free PDF export.",
    primaryTool: "tools/address-labels",
    intent: "mailing label PDF, return address labels, no signup",
    sections: [
      ["Recurring pain", "Labels are needed in bursts: mailing, events, classrooms, inventory, and small office admin. A free printable sheet can attract practical repeat searches without a backend."],
      ["What it includes", "Choose 30 address labels, 14 shipping-style labels, or 10 badge labels, then edit the label title, recipient, address text, and note."],
      ["Before printing on sticker sheets", "Run a plain-paper test first and hold it behind the label sheet to check alignment before using adhesive stock."],
    ],
    relatedTools: ["tools/barcode-labels", "tools/business-card", "tools/price-tag"],
  },
  {
    path: "free-barcode-label-generator-printable",
    title: "Free Printable Barcode Label Generator",
    description: "Generate printable Code 39 barcode labels for SKUs, inventory bins, event check-in, and internal tracking.",
    headline: "Free printable barcode label generator",
    lead: "Create a label sheet with scannable Code 39-style bars and optional human-readable text. It is intended for simple internal labels, not regulated retail compliance.",
    primaryTool: "tools/barcode-labels",
    intent: "barcode label PDF, SKU labels, inventory stickers",
    sections: [
      ["High-intent utility", "Barcode tools are commonly monetized through subscriptions, dynamic inventory systems, or paid label software. A free static label PDF covers small internal workflows."],
      ["Supported codes", "Use uppercase letters, numbers, spaces, dashes, dots, dollar signs, slashes, plus signs, and percent signs. Keep codes short for better scanning."],
      ["Validation note", "Print and test a sample with the scanner or app you plan to use before producing a full sheet."],
    ],
    relatedTools: ["tools/address-labels", "tools/price-tag", "tools/purchase-order"],
  },
  {
    path: "free-price-tag-generator-printable",
    title: "Free Printable Price Tag Generator",
    description: "Create printable price tags or shelf labels for yard sales, pop-up shops, craft fairs, and small retail tables.",
    headline: "Free printable price tag generator",
    lead: "Make a sheet of clean price tags with a title, price, subtitle, and footer. This helps small sellers prepare a table quickly without buying a template pack.",
    primaryTool: "tools/price-tag",
    intent: "price tag PDF, shelf labels, yard sale tags",
    sections: [
      ["Why this has commercial intent", "People searching for price tags are often preparing to sell at a market, garage sale, or shop. That makes the traffic more business-adjacent than generic printables."],
      ["Best fit", "Use it for craft fairs, yard sales, pop-up tables, shelf labels, sale tags, and quick event pricing."],
      ["Print tip", "Use thicker paper if tags will be handled often, and keep prices large enough to read from a few feet away."],
    ],
    relatedTools: ["tools/coupon-maker", "tools/flyer-maker", "tools/barcode-labels"],
  },
  {
    path: "free-flyer-maker-pdf-no-signup",
    title: "Free Flyer Maker PDF Without Signup",
    description: "Make a printable flyer PDF for a local service, yard sale, community event, class, or small business offer.",
    headline: "Free flyer maker PDF without signup",
    lead: "Create a one-page flyer with a headline, subhead, details, call to action, and contact line. The free export is designed for urgent local promotion.",
    primaryTool: "tools/flyer-maker",
    intent: "flyer PDF now, no signup, local event flyer",
    sections: [
      ["Why users click", "Flyer searches often come from time-sensitive local promotion: a sale, class, service, club, or community event. A fast PDF can satisfy that need without a design account."],
      ["What the flyer includes", "The layout keeps the headline prominent, uses short detail copy, and leaves a clear contact or location line."],
      ["Responsible use", "Only create flyers for events, offers, and services you are authorized to promote. Review local posting rules before printing."],
    ],
    relatedTools: ["tools/business-card", "tools/coupon-maker", "tools/price-tag"],
  },
  {
    path: "free-coupon-maker-printable",
    title: "Free Printable Coupon Maker",
    description: "Create printable coupon cards for local services, small shops, pop-up events, classes, or simple promotions.",
    headline: "Free printable coupon maker",
    lead: "Build a coupon sheet with an offer, code, details, expiration note, and fine print. It is useful for local promotions without adding payment or account friction.",
    primaryTool: "tools/coupon-maker",
    intent: "printable coupon cards, discount coupon PDF, no signup",
    sections: [
      ["Commercial intent", "Coupons are attached to offers, services, and local sales. That makes the category a better monetization test than purely decorative printables."],
      ["What to include", "Keep the offer clear, add a short code if needed, state the expiration note, and include simple limitations so customers know how to use it."],
      ["Compliance note", "Do not create misleading offers or coupons for brands you do not own. Keep terms accurate and easy to read."],
    ],
    relatedTools: ["tools/flyer-maker", "tools/price-tag", "tools/business-card"],
  },
  {
    path: "free-packing-slip-generator-printable",
    title: "Free Printable Packing Slip Generator",
    description: "Create a printable packing slip PDF for small orders, marketplace sales, handmade products, and local delivery without signing up.",
    headline: "Free printable packing slip generator",
    lead: "Make a simple packing slip PDF for a customer order, package insert, local delivery, or handmade product shipment. It is built for sellers who need one clear order sheet without full shipping software.",
    primaryTool: "tools/packing-slip",
    intent: "packing slip PDF, order packing sheet, no signup",
    sections: [
      ["Commercial intent", "Packing slip searches often come from sellers preparing real orders. That makes the page business-adjacent and stronger for ad-supported validation than decorative printables."],
      ["What to include", "Sender, ship-to details, order number, ship date, item names, quantities, status, and a short packing note. Keep payment details off the slip unless they are truly needed."],
      ["Best fit", "Use it for marketplace orders, handmade goods, local delivery, pop-up shop pickups, and small warehouse workflows before investing in shipping software."],
    ],
    relatedTools: ["tools/inventory-sheet", "tools/barcode-labels", "tools/address-labels"],
  },
  {
    path: "free-work-order-generator-pdf",
    title: "Free Work Order Generator PDF",
    description: "Create a work order PDF for repair jobs, field service, maintenance visits, cleaning jobs, contractor tasks, and approval records.",
    headline: "Free work order generator PDF",
    lead: "Build a printable work order with provider details, client or site information, tasks, schedule, instructions, and approval notes. No account is required for the free PDF export.",
    primaryTool: "tools/work-order",
    intent: "work order PDF, service order form, contractor job sheet",
    sections: [
      ["Why users search", "Work order searches usually happen right before a service visit, repair task, or client approval. A fast PDF can satisfy that moment without forcing field-service software."],
      ["What it includes", "Provider and client blocks, work order number, date, schedule or status, task rows, estimated total, instructions, and signature lines."],
      ["Limits", "This is a practical job form, not a compliance system. Confirm safety requirements, approval rules, and local regulations before starting work."],
    ],
    relatedTools: ["tools/estimate-generator", "tools/invoice-generator", "tools/timesheet-generator"],
  },
  {
    path: "free-inventory-sheet-generator",
    title: "Free Inventory Sheet Generator",
    description: "Create a printable inventory count sheet PDF for stock checks, craft fairs, market tables, storage bins, classrooms, and small retail shelves.",
    headline: "Free inventory sheet generator",
    lead: "Make a printable inventory count sheet for small stock checks, before-and-after event counts, shelf reviews, storage bins, or classroom supplies.",
    primaryTool: "tools/inventory-sheet",
    intent: "inventory count sheet PDF, stock count template, no signup",
    sections: [
      ["Repeat-use pain", "Inventory counts happen again and again for sellers, classrooms, events, and storage areas. A printable sheet can earn repeat visits if it is faster than opening a spreadsheet."],
      ["What it includes", "Title, location, count date, SKU, item name, expected quantity, counted quantity, notes, and restock reminders."],
      ["Best fit", "Use it for craft fairs, market tables, small retail shelves, supply closets, event materials, or simple stock checks before reordering."],
    ],
    relatedTools: ["tools/barcode-labels", "tools/price-tag", "tools/packing-slip"],
  },
];

const HIGH_INTENT_LANDING_PATHS = landingPages.map((page) => page.path);

const tools = [
  {
    path: "tools/name-tracing",
    title: "Name Tracing Worksheet Generator",
    description: "Create a free one-page name tracing worksheet PDF for preschool and kindergarten handwriting practice.",
    body: [
      "Enter a name or short word, choose US Letter or A4, and download a printable worksheet with tracing lines and a small drawing prompt.",
      "The free version is intentionally limited to one clean page while the project validates demand through downloads, search visibility, and responsible advertising readiness.",
    ],
  },
  {
    path: "tools/chore-chart",
    title: "Chore Chart Generator",
    description: "Make a weekly printable chore chart PDF for children, families, roommates, or classroom jobs.",
    body: [
      "Add names, chores, and a paper size to create a simple weekly chart with checkboxes for each day.",
      "The generator is designed for practical home and classroom routines rather than decorative one-off templates.",
    ],
  },
  {
    path: "tools/reward-chart",
    title: "Reward Chart Generator",
    description: "Build a printable reward chart PDF with goals, sticker boxes, and a reward note.",
    body: [
      "Choose the number of boxes, write a goal statement, and print a chart that works for short behavior or habit challenges.",
      "The free PDF includes one clean page while the product validates which free chart formats get real downloads.",
    ],
  },
  {
    path: "tools/flashcards",
    title: "Flashcard Generator",
    description: "Create a free one-page printable flashcard PDF for vocabulary, classroom review, memory games, and homeschool practice.",
    body: [
      "Enter one card per line, choose six or eight cards per page, and download a printable sheet with cut lines.",
      "This tool targets evergreen teacher and homeschool searches while keeping the first version simple enough to run without a backend.",
    ],
  },
  {
    path: "tools/weekly-planner",
    title: "Weekly Planner Generator",
    description: "Make a free printable weekly planner PDF for family schedules, class planning, errands, and meal notes.",
    body: [
      "Create a one-page weekly planner with seven day boxes and optional note sections for meals, errands, calls, or school items.",
      "Weekly planning is a broader audience test than kids-only worksheets and helps validate whether utility printables can bring non-teacher traffic.",
    ],
  },
  {
    path: "tools/habit-tracker",
    title: "Habit Tracker Generator",
    description: "Create a free printable habit tracker PDF for daily routines, reading goals, wellness habits, or classroom practice.",
    body: [
      "Add four to six habits, choose 21, 30, or 31 days, and print a simple grid for daily check-ins.",
      "Habit trackers are a high-intent printable category that can later support more free templates or affiliate links for planners and stationery.",
    ],
  },
  {
    path: "tools/invoice-generator",
    title: "Invoice Generator",
    description: "Create a clean free invoice PDF for freelance work, small business services, consulting, or one-off projects.",
    body: [
      "Add your business details, client details, invoice number, line items, terms, and notes to download a one-page invoice PDF.",
      "This tool targets users who need a document immediately and do not want an account, template marketplace, or surprise fee at download time.",
    ],
  },
  {
    path: "tools/estimate-generator",
    title: "Estimate Generator",
    description: "Create a free estimate PDF for freelance work, home services, consulting, repairs, or small business quotes.",
    body: [
      "Add business details, client details, estimate number, scope items, validity terms, and notes to download a one-page estimate PDF.",
      "Estimate and quote searches are high-intent because the user is often trying to win a job or respond to a client request quickly.",
    ],
  },
  {
    path: "tools/purchase-order",
    title: "Purchase Order Generator",
    description: "Make a free purchase order PDF for supplies, services, small vendors, internal approvals, or project records.",
    body: [
      "Enter buyer and vendor details, a PO number, order items, delivery terms, and notes to generate a clean purchase order PDF.",
      "Purchase order PDFs are useful for small teams that need an approval record before an invoice arrives.",
    ],
  },
  {
    path: "tools/bill-of-sale",
    title: "Bill of Sale Generator",
    description: "Create a simple bill of sale PDF for a private item sale, equipment transfer, furniture sale, or vehicle record draft.",
    body: [
      "Add seller, buyer, sale date, item description, price, terms, and disclosure notes to create a practical sale record PDF.",
      "This generator is a simple record template, not legal advice. Requirements vary by location and item type.",
    ],
  },
  {
    path: "tools/rent-receipt",
    title: "Rent Receipt Generator",
    description: "Make a free printable rent receipt PDF for a tenant payment, room rental, cash payment record, or landlord file.",
    body: [
      "Enter the tenant, recipient, property, amount, rental period, payment date, and payment method to generate a simple receipt PDF.",
      "Receipt searches have clear intent because the user often needs a printable record immediately after a payment.",
    ],
  },
  {
    path: "tools/business-card",
    title: "Business Card Generator",
    description: "Create a printable business card PDF sheet for a small business, side project, local service, or event contact card.",
    body: [
      "Enter your name, role, business, contact details, and tagline to generate a sheet of simple printable contact cards.",
      "Business card searches have commercial intent because users are often preparing to promote a service, event, or side business immediately.",
    ],
  },
  {
    path: "tools/address-labels",
    title: "Address Label Generator",
    description: "Make a printable sheet of return address labels, mailing labels, classroom labels, or event badge labels.",
    body: [
      "Choose an address, shipping-style, or badge layout, then fill the label title, recipient, address text, and note.",
      "Labels are practical repeat-use pages for mailing, events, classrooms, office storage, and small shipping workflows.",
    ],
  },
  {
    path: "tools/price-tag",
    title: "Price Tag Generator",
    description: "Create printable price tags or shelf labels for yard sales, craft fairs, pop-up shops, and small retail displays.",
    body: [
      "Add a title, price, subtitle, and footer to generate a sheet of tags for selling tables, shelves, or event displays.",
      "Price tags attract business-adjacent searches because users are often getting ready to sell products in person.",
    ],
  },
  {
    path: "tools/flyer-maker",
    title: "Flyer Maker PDF",
    description: "Make a one-page printable flyer PDF for a local service, yard sale, class, community event, or small business offer.",
    body: [
      "Create a flyer with a large headline, supporting subhead, details, call to action, and contact or location line.",
      "Flyer searches are time-sensitive and commercial enough to support advertising validation once the site earns search visibility.",
    ],
  },
  {
    path: "tools/barcode-labels",
    title: "Barcode Label Generator",
    description: "Generate printable Code 39 barcode labels for inventory bins, event check-in, SKU stickers, and internal tracking.",
    body: [
      "Enter one code per line, optionally add a label after a vertical bar, and print a sheet of Code 39-style barcode labels.",
      "Barcode label tools are often bundled into paid inventory software, so a free static PDF version can solve small internal workflows.",
    ],
  },
  {
    path: "tools/coupon-maker",
    title: "Coupon Maker PDF",
    description: "Create printable coupon cards for a local service, class, pop-up event, small shop, or limited-time offer.",
    body: [
      "Add a business name, offer, coupon code, details, expiration note, and fine print to create a sheet of printable coupon cards.",
      "Coupon and promotion searches are linked to real selling activity, making this a stronger monetization test than purely decorative pages.",
    ],
  },
  {
    path: "tools/packing-slip",
    title: "Packing Slip Generator",
    description: "Create a printable packing slip PDF for small orders, marketplace sales, local delivery, and handmade product shipments.",
    body: [
      "Enter sender, recipient, order number, ship date, item rows, quantities, status, and a packing note to create a clear order insert.",
      "Packing slip searches are tied to real selling and shipping work, which makes the tool a strong business-intent addition for ad-supported validation.",
    ],
  },
  {
    path: "tools/work-order",
    title: "Work Order Generator",
    description: "Make a work order PDF for repairs, field service, maintenance visits, cleaning jobs, and contractor tasks.",
    body: [
      "Add provider details, client or site details, schedule, tasks, rates, instructions, and approval notes to create a one-page job form.",
      "Work order searches are urgent and practical because the user usually needs a service record before a visit, job, or repair starts.",
    ],
  },
  {
    path: "tools/inventory-sheet",
    title: "Inventory Sheet Generator",
    description: "Create a printable inventory count sheet PDF for stock checks, craft fairs, storage bins, classroom supplies, and small retail shelves.",
    body: [
      "Enter location, count date, SKU or item rows, expected quantities, counted quantities, and notes to create a printable stock count sheet.",
      "Inventory sheets have repeat-use potential for sellers, classrooms, events, and storage workflows without requiring a spreadsheet login.",
    ],
  },
  {
    path: "tools/resume-builder",
    title: "Resume Builder PDF",
    description: "Build a simple free resume PDF without an account, paywall, or surprise download fee.",
    body: [
      "Create a one-page resume with contact details, summary, experience, skills, and education in a clean single-column layout.",
      "Many resume builders let users type for free and charge at download. This version keeps the first PDF export free to build trust and search demand.",
    ],
  },
  {
    path: "tools/ats-resume-checker",
    title: "ATS Resume Checker",
    description: "Check pasted resume text against a job description and download a local ATS keyword and readability report PDF.",
    body: [
      "Paste resume text and a job description, then generate a one-page report with keyword matches, missing honest terms, section checks, readability notes, and next edits.",
      "ATS checker searches are high-intent because job seekers often need quick feedback before applying, while many alternatives require uploads, accounts, or paid exports.",
    ],
  },
  {
    path: "tools/cover-letter",
    title: "Cover Letter Generator",
    description: "Create a free one-page cover letter PDF for job applications without an account or surprise download fee.",
    body: [
      "Write a clean cover letter with target role, company, opening paragraph, strengths, and closing text, then download a one-page PDF.",
      "Cover letter searches are high-intent because users often need a document right before submitting an application.",
    ],
  },
  {
    path: "tools/resignation-letter",
    title: "Resignation Letter Generator",
    description: "Make a simple resignation letter PDF with notice date, last day, appreciation, and handoff wording.",
    body: [
      "Create a professional resignation letter that states the role, company, date, last working day, appreciation, and transition note.",
      "This free generator targets a common urgent document need while keeping the result practical and editable.",
    ],
  },
  {
    path: "tools/monthly-calendar",
    title: "Monthly Calendar Generator",
    description: "Create a free printable monthly calendar PDF for appointments, school events, chores, meals, or family planning.",
    body: [
      "Choose a month, year, week start, and note headings to generate a simple black-and-white monthly calendar PDF.",
      "Monthly calendars are broad utility printables with repeat use and a larger audience than a single niche worksheet.",
    ],
  },
  {
    path: "tools/meal-planner",
    title: "Meal Planner Generator",
    description: "Make a printable weekly meal planner PDF with breakfast, lunch, dinner, grocery list, and prep notes.",
    body: [
      "Plan breakfast, lunch, dinner, grocery items, and prep notes on one printable page for the week.",
      "Meal planning has recurring weekly intent, which helps test whether free tools can produce return visits and ad-supported usage.",
    ],
  },
  {
    path: "tools/image-to-pdf",
    title: "Image to PDF Converter",
    description: "Convert JPG, PNG, or WebP images into a clean one-page PDF in your browser without uploading files.",
    body: [
      "Select up to four images, choose a fit, fill, or gallery layout, and generate a one-page PDF locally in the browser.",
      "Image conversion is a broad high-intent search category because users often need a PDF immediately for a form, upload, receipt, or scan.",
    ],
  },
  {
    path: "tools/multi-image-pdf",
    title: "Multiple Images to PDF Converter",
    description: "Turn several JPG, PNG, or WebP images into one multi-page PDF in your browser without uploading files.",
    body: [
      "Select up to eight images, choose US Letter or A4, and download one PDF where each image gets its own page.",
      "Multi-image conversion is a high-intent utility category because many paid or ad-heavy converters monetize exactly at the export step.",
    ],
  },
  {
    path: "tools/compress-pdf",
    title: "Compress PDF Online",
    description: "Compress a PDF locally by rendering pages into a smaller image-based PDF without uploading the document.",
    body: [
      "Select one PDF, choose a compression mode, and download a smaller image-based PDF copy processed in the browser.",
      "PDF compression is a high-intent file utility search because people usually arrive after a form, email, or upload portal rejects a large PDF. This local version is honest about the tradeoff: it is best for scanned or image-heavy PDFs and may flatten selectable text.",
    ],
  },
  {
    path: "tools/pdf-to-images",
    title: "PDF to JPG Converter",
    description: "Convert PDF pages to JPG or PNG images locally in your browser without uploading the document.",
    body: [
      "Select one PDF, choose all pages or a page range, pick JPG or PNG, and download image files rendered in the browser.",
      "PDF-to-image conversion is a broad file utility search because forms, listings, chat apps, and portals often ask for image files instead of PDFs.",
    ],
  },
  {
    path: "tools/pdf-to-text",
    title: "PDF to Text Converter",
    description: "Extract selectable text from PDF pages locally in your browser without uploading the document.",
    body: [
      "Select one PDF, choose all pages or a page range, and download extracted selectable text as a TXT file.",
      "PDF-to-text conversion is a broad utility search for notes, quotes, reports, invoices, forms, and admin review. This tool is local-first and clearly avoids promising OCR for scanned PDFs.",
    ],
  },
  {
    path: "tools/pdf-to-word",
    title: "PDF to Word Converter",
    description: "Convert selectable PDF text into a simple DOCX document locally in your browser without uploading the PDF.",
    body: [
      "Select one PDF, choose all pages or a page range, and download a Word-compatible DOCX built from selectable embedded text.",
      "PDF-to-Word conversion is a high-intent utility search because users often need an editable file immediately. This local version is privacy-forward and honest: it creates a clean text-first DOCX, not OCR or pixel-perfect layout reconstruction.",
    ],
  },
  {
    path: "tools/signature-png",
    title: "Signature PNG Generator",
    description: "Draw or type a signature and download a transparent PNG locally in your browser without uploading anything.",
    body: [
      "Draw with a mouse, finger, or stylus, or use the typed fallback, then download a transparent PNG signature image.",
      "Signature image searches have practical document intent, but the tool stays clear that it creates a visual PNG only and does not replace identity-verified e-signature services.",
    ],
  },
  {
    path: "tools/passport-photo",
    title: "Passport Photo Maker",
    description: "Crop a passport-style photo locally for US 2x2, UK 35x45, Canada 50x70, and Australia 35x45 sizes.",
    body: [
      "Select one photo, choose a common passport-style size, adjust zoom and position, then download a single image or a 4x6 print sheet PDF.",
      "Passport photo searches are high intent because users often need a correctly sized face photo immediately, but the tool intentionally stays clear that official acceptance depends on the issuing authority's current rules.",
    ],
  },
  {
    path: "tools/compress-image",
    title: "Compress Image Online",
    description: "Compress JPG, PNG, or WebP images locally in your browser without uploading files.",
    body: [
      "Select one image, choose a compression level and maximum width, then download a smaller JPG, PNG, or WebP file.",
      "Image compression is a broad urgent search category because users often hit upload size limits on forms, emails, profiles, marketplaces, and support portals.",
    ],
  },
  {
    path: "tools/compress-image-to-kb",
    title: "Compress Image to KB",
    description: "Compress an image toward a target KB size locally for upload limits, forms, profiles, and portals.",
    body: [
      "Choose a JPG, PNG, or WebP image, pick a target such as 50KB, 100KB, 200KB, or 500KB, and download a smaller JPG or WebP copy.",
      "Target-KB searches are strong ad-supported utility intent because users usually arrive after a portal, exam site, job application, or profile upload rejects their file.",
    ],
  },
  {
    path: "tools/resize-image",
    title: "Resize Image Online",
    description: "Resize a JPG, PNG, or WebP image locally by width, height, or common social sizes without uploading it.",
    body: [
      "Select one image, choose a custom size or preset, then export a resized copy as JPG, PNG, or WebP.",
      "Image resizing reaches a larger audience than printable-only pages because many sites require exact dimensions before an upload succeeds.",
    ],
  },
  {
    path: "tools/convert-image",
    title: "Convert Image Format",
    description: "Convert JPG, PNG, and WebP images locally in your browser without uploading the file.",
    body: [
      "Select one image and export it as JPG, PNG, or WebP while keeping the conversion in the browser.",
      "Format conversion is a practical utility need when an upload form rejects the current image type or a user wants a smaller web-friendly copy.",
    ],
  },
  {
    path: "tools/remove-background",
    title: "Remove Background Online",
    description: "Remove a solid or near-solid image background locally and download a transparent PNG without uploading the file.",
    body: [
      "Select one JPG, PNG, or WebP image, choose a background sample, adjust tolerance, and download a transparent PNG.",
      "Background-removal searches are broad and urgent for product photos, logos, signatures, icons, and thumbnails. This local version is honest about its scope: it is a color-based remover for simple backgrounds, not full AI segmentation.",
    ],
  },
  {
    path: "tools/crop-image",
    title: "Crop Image Online",
    description: "Crop JPG, PNG, or WebP images locally for square avatars, wide banners, product photos, and profile uploads without uploading files.",
    body: [
      "Select one image, choose a crop shape and focus area, then export a cropped JPG, PNG, or WebP copy.",
      "Image cropping is a broad utility need for profile photos, seller listings, ID-style uploads, social posts, and banner images.",
    ],
  },
  {
    path: "tools/rotate-image",
    title: "Rotate Image Online",
    description: "Rotate or flip a JPG, PNG, or WebP image locally in your browser without uploading the file.",
    body: [
      "Select one image, rotate it 90, 180, or 270 degrees, optionally flip it, and download a corrected copy.",
      "Rotation is a frequent helper task after phone scans, sideways photos, screenshots, and images captured in the wrong orientation.",
    ],
  },
  {
    path: "tools/watermark-image",
    title: "Watermark Image Online",
    description: "Add a text watermark to JPG, PNG, or WebP images locally for drafts, samples, marketplace photos, and social posts without uploading files.",
    body: [
      "Select one image, add text, choose a placement and opacity, then export a watermarked copy in a common image format.",
      "Watermarking attracts practical intent from creators, sellers, and small teams who need a free proof or sample image quickly.",
    ],
  },
  {
    path: "tools/add-text-image",
    title: "Add Text to Image Online",
    description: "Add a headline, caption, price, label, or meme-style text to an image locally without uploading the file.",
    body: [
      "Select one image, type a main line and optional small line, choose a placement, and export a JPG, PNG, or WebP copy.",
      "Text-on-image searches are broad across sellers, creators, teachers, students, and social users who need a quick caption, thumbnail, label, or announcement image without a full design app.",
    ],
  },
  {
    path: "tools/qr-code",
    title: "Free QR Code Generator",
    description: "Create a static QR code PDF for a link, menu, event page, sign, flyer, or short text without signup.",
    body: [
      "Enter a URL or short text, choose error correction, and download a printable QR code PDF generated in the browser.",
      "QR searches are broad and commercial because many users only discover export fees, dynamic upsells, or account walls after they have already created the code.",
    ],
  },
  {
    path: "tools/wifi-qr-code",
    title: "WiFi QR Code Generator",
    description: "Create a printable WiFi QR code for guests, offices, rentals, classrooms, cafes, events, and waiting rooms.",
    body: [
      "Enter the network name, security type, and password, then export a clean one-page WiFi QR sign.",
      "Guest WiFi QR codes solve an immediate real-world problem for short-term rentals, cafes, small offices, events, classrooms, and waiting rooms.",
    ],
  },
  {
    path: "tools/vcard-qr-code",
    title: "Contact QR Code Generator",
    description: "Create a printable contact QR code with vCard details for a business card, booth sign, event badge, or service flyer.",
    body: [
      "Enter contact details and generate a vCard-style QR code that visitors can scan from a card, sign, flyer, or event badge.",
      "Contact QR codes are useful for local sellers, service businesses, creators, recruiters, and exhibitors who need a low-friction way to share contact details.",
    ],
  },
  {
    path: "tools/merge-pdf",
    title: "Merge PDF Tool",
    description: "Combine several PDF files into one PDF in your browser without uploading documents.",
    body: [
      "Select up to six PDFs, review the order and page counts, then export one combined PDF locally in the browser.",
      "PDF merge searches are broad and high-intent because many users need one file immediately but do not want to upload private documents.",
    ],
  },
  {
    path: "tools/split-pdf",
    title: "Split PDF Tool",
    description: "Extract selected pages from a PDF in your browser without uploading the document.",
    body: [
      "Select one PDF, enter pages or ranges such as 1,3-5, and download a new PDF with only those pages.",
      "PDF split searches often come from forms, applications, school packets, and admin documents where users need to remove pages quickly.",
    ],
  },
  {
    path: "tools/pdf-page-numbers",
    title: "Add Page Numbers to PDF",
    description: "Add simple page numbers to an existing PDF locally in your browser.",
    body: [
      "Select one PDF, choose a page number position, and download a copy with visible page numbers.",
      "Page numbering is a small but common PDF editing need for handouts, packets, reports, client drafts, and merged documents.",
    ],
  },
  {
    path: "tools/rotate-pdf",
    title: "Rotate PDF Pages",
    description: "Rotate all PDF pages or selected pages locally in your browser without uploading the file.",
    body: [
      "Select one PDF, choose 90, 180, or 270 degrees, and rotate all pages or only selected page ranges.",
      "PDF rotation is a common no-upload need for scanned forms, phone-generated packets, sideways receipts, and upside-down handouts.",
    ],
  },
  {
    path: "tools/remove-pdf-pages",
    title: "Remove Pages from PDF",
    description: "Delete selected PDF pages locally in your browser without uploading the document.",
    body: [
      "Select one PDF, enter pages or ranges to remove, and export a new PDF with the remaining pages in order.",
      "Removing pages solves a practical privacy and cleanup problem when users need to strip blanks, duplicates, covers, or sensitive pages before sharing.",
    ],
  },
  {
    path: "tools/reorder-pdf-pages",
    title: "Reorder PDF Pages",
    description: "Rearrange PDF pages by typing a new page order, all locally in your browser.",
    body: [
      "Select one PDF and enter the page order you want, such as 3,1,2, then export a new PDF in that order.",
      "Reordering pages targets users who scanned or assembled packets out of sequence and need a fast organizer without account friction.",
    ],
  },
  {
    path: "tools/watermark-pdf",
    title: "Add Watermark to PDF",
    description: "Add a light text watermark to all pages or selected PDF pages locally in your browser.",
    body: [
      "Select one PDF, type watermark text, choose placement and opacity, then export a marked copy without uploading the source file.",
      "PDF watermark searches have practical intent because people often need to label drafts, samples, internal files, or confidential copies before sharing.",
    ],
  },
  {
    path: "tools/stamp-pdf",
    title: "Stamp PDF Pages",
    description: "Add a simple APPROVED, PAID, DRAFT, or custom text stamp to PDF pages without uploading the file.",
    body: [
      "Select one PDF, choose a stamp style and position, then export a copy with a visible status stamp.",
      "PDF stamp searches connect to receipts, invoices, work orders, review packets, and admin workflows where a simple status label saves time.",
    ],
  },
  {
    path: "tools/sign-pdf",
    title: "Add Signature Text to PDF",
    description: "Place a typed signature block on a selected PDF page locally in your browser.",
    body: [
      "Select one PDF, enter a typed signature name and optional date, choose the page and position, then export a signed copy.",
      "Typed signature searches are high-intent, but this tool stays clear about limits: it adds a visual signature block and does not replace regulated e-signature services.",
    ],
  },
  {
    path: "tools/text-to-pdf",
    title: "Text to PDF Converter",
    description: "Paste plain text and download a clean one-page PDF without an account or file upload.",
    body: [
      "Paste notes, instructions, a short letter, or a plain text draft, choose a readable text size, and export a simple PDF.",
      "Text-to-PDF searches often come from people who need a document immediately and do not want to install an editor or upload content.",
    ],
  },
  {
    path: "tools/markdown-to-pdf",
    title: "Markdown to PDF Converter",
    description: "Paste Markdown and download a clean PDF preview without installing an editor or uploading a file.",
    body: [
      "Paste Markdown notes, README text, changelogs, project outlines, or study notes, choose a simple style, and export a readable PDF.",
      "Markdown-to-PDF expands the file-utility audience toward students, developers, writers, and small teams who need a quick offline copy.",
    ],
  },
  {
    path: "tools/csv-to-pdf",
    title: "CSV to PDF Table Converter",
    description: "Paste CSV rows and export a readable PDF table locally in your browser.",
    body: [
      "Paste a small CSV table, keep the first row as headers, choose a layout, and download a one-page PDF table.",
      "CSV-to-PDF targets practical admin searches for inventory rows, rosters, order lists, price sheets, and reports without spreadsheet upload friction.",
    ],
  },
  {
    path: "tools/json-to-pdf",
    title: "JSON to PDF Formatter",
    description: "Paste JSON and download a readable formatted PDF locally without uploading data.",
    body: [
      "Paste JSON, format it into a readable preview, and export a one-page PDF for documentation, QA notes, API samples, or config snippets.",
      "JSON-to-PDF is a broader technical utility that keeps the local-first promise while adding high-intent file conversion searches.",
    ],
  },
  {
    path: "tools/sign-in-sheet",
    title: "Sign-in Sheet Generator",
    description: "Create a printable sign-in sheet PDF for events, classrooms, workshops, meetings, or visitor logs.",
    body: [
      "Add an event name, date, row count, columns, and a short note to create a clean attendance or visitor log page.",
      "Sign-in sheets are recurring utility printables for organizers, teachers, clubs, front desks, and small events.",
    ],
  },
  {
    path: "tools/graph-paper",
    title: "Graph Paper Generator",
    description: "Generate printable graph paper PDF with quarter-inch, half-inch, or small grid spacing for math, notes, and design sketches.",
    body: [
      "Choose a paper size, grid spacing, grid style, and line color to create a printable graph paper page.",
      "Graph paper has broad evergreen demand from students, teachers, planners, makers, and anyone who needs a quick grid page.",
    ],
  },
  {
    path: "tools/packing-list",
    title: "Packing List Generator",
    description: "Make a printable packing list PDF for travel, school trips, business travel, camping, or family vacations.",
    body: [
      "Enter trip details and grouped packing sections to create a one-page checklist with checkboxes and reminder space.",
      "Packing lists are practical repeat-use printables that can reach travelers, families, students, and event planners without requiring an account.",
    ],
  },
  {
    path: "tools/receipt-generator",
    title: "Receipt Generator",
    description: "Create a simple printable receipt PDF for a sale, service payment, deposit, or reimbursement record.",
    body: [
      "Enter payer, recipient, amount, method, date, description, and notes to generate a practical one-page receipt PDF.",
      "Receipts are urgent business paperwork with clear user intent, and a free no-signup export can compete against paywalled template tools.",
    ],
  },
  {
    path: "tools/timesheet-generator",
    title: "Timesheet Generator",
    description: "Make a printable weekly timesheet PDF for freelance hours, staff records, projects, or approvals.",
    body: [
      "Add a worker, period, rows of day/project/hours/notes, and create a printable sheet with a total-hours line and approval signature.",
      "Timesheets can bring repeat use from freelancers, contractors, small teams, and service businesses that need a quick printable record.",
    ],
  },
  {
    path: "tools/certificate-generator",
    title: "Certificate Generator",
    description: "Create a printable certificate PDF for completion, participation, classroom awards, or small events.",
    body: [
      "Enter a certificate title, recipient, award reason, date, and signer to generate a clean award page.",
      "Certificate makers are commonly paywalled around templates or downloads; a simple free printable version gives teachers and organizers immediate value.",
    ],
  },
  {
    path: "tools/todo-list",
    title: "To Do List Generator",
    description: "Build a printable checklist PDF for errands, work tasks, study sessions, home projects, or event prep.",
    body: [
      "Group tasks into sections, add a reminder note, and download a one-page checklist with clear checkboxes.",
      "Checklist searches are broad and repeatable, making this a useful ad-supported free tool while the site validates demand.",
    ],
  },
];

const guides = [
  ["guides/free-printable-name-tracing-worksheet-maker", "Free printable name tracing worksheet maker", "How to create a readable name tracing page for preschool and kindergarten handwriting practice.", "A name tracing page works best as a short, familiar writing warmup. Children already recognize their own name, so the page can focus on letter direction, pencil control, spacing, and confidence."],
  ["guides/free-chore-chart-generator-for-kids", "Free chore chart generator for kids", "Make a printable weekly chore chart that children can understand without a complicated app.", "A printed chore chart turns family expectations into something visible. It works especially well for younger children because they can check boxes and see progress across the week."],
  ["guides/free-reward-chart-generator", "Free reward chart generator", "Create a printable sticker chart for goals, habits, classroom behavior, or family routines.", "A reward chart is strongest when it tracks one clear behavior. Name the exact action and choose a realistic number of boxes before the reward."],
  ["guides/free-sticker-chart-printable-maker", "Free sticker chart printable maker", "Create a simple printable sticker chart for reading, bedtime, chores, classroom behavior, or kindness goals.", "A sticker chart works best when the child can understand exactly what earns a sticker. Choose one behavior and keep the target short."],
  ["guides/bedtime-routine-chart-printable", "Bedtime routine chart printable", "Make a bedtime routine chart that turns repeated reminders into a simple printable checklist.", "A bedtime routine chart should be short enough to finish without negotiation. Good steps include pajamas, bathroom, brush teeth, story, and lights out."],
  ["guides/classroom-job-chart-printable", "Classroom job chart printable", "Use a printable job chart for weekly classroom helpers, centers, small groups, and clean-up routines.", "Classroom job charts work when job names stay short and consistent. A weekly chart gives students enough time to learn the role."],
  ["guides/free-printable-weekly-calendar-for-kids", "Free printable weekly calendar for kids", "Create a simple weekly calendar printable for school events, chores, reading, meals, and family reminders.", "A weekly calendar helps children see what is coming without overwhelming them with a full monthly planner."],
  ["guides/printable-routine-chart-for-mornings", "Printable morning routine chart ideas", "Simple morning chart layouts that help kids move from wake-up to school without constant reminders.", "A morning chart works when each step is short, visible, and in the order it happens. Good first steps include get dressed, brush teeth, eat breakfast, pack bag, and shoes on."],
  ["guides/weekly-family-planner-printable", "How to build a weekly family planner printable", "Plan meals, school events, chores, and appointments on one printable weekly page.", "A family planner should reduce coordination, not become a second calendar system. Use it for the few decisions everyone needs to see."],
  ["guides/classroom-label-generator-ideas", "Classroom label generator ideas", "Use printable labels for bins, centers, cubbies, small groups, and take-home folders.", "The best classroom labels are easy to scan. Use a consistent size, strong contrast, and short nouns."],
  ["guides/habit-tracker-printable-for-beginners", "Habit tracker printable for beginners", "Create a printable habit tracker that tracks progress without turning into a guilt chart.", "A beginner habit tracker should track one to three behaviors. Too many boxes make the page look impressive but harder to keep using."],
  ["guides/flashcard-generator-printable-guide", "Printable flashcard generator guide", "Make flashcards that are easy to cut, review, and reuse for vocabulary or classroom games.", "Printable flashcards should have clear cut lines, enough margin, and a predictable card size. Leave extra white space if children will draw or color on the cards."],
  ["guides/printable-worksheets-for-preschool-at-home", "Printable worksheets for preschool at home", "A practical way to use short printable pages without overloading young children.", "Preschool worksheets work best when they are quick, concrete, and connected to a real routine. A five-minute page can support a habit."],
  ["guides/black-and-white-printable-design-tips", "Black-and-white printable design tips", "Design worksheets and charts that still look clear on a basic home printer.", "Most printable pages are used on ordinary printers. Strong borders, readable headings, and clean spacing matter more than color fills."],
  ["guides/a4-vs-us-letter-printable-guide", "A4 vs US Letter for printable PDFs", "Choose the right paper size for families, schools, and international downloads.", "US Letter is common in the United States and Canada, while A4 is common in many other countries. Offering both sizes reduces printing frustration."],
  ["guides/batch-printable-generator-for-classrooms", "When batch printable generation is worth it", "Understand when a free one-page printable is enough and when repeated printable workflows need a better process.", "Teachers, tutors, and homeschool families sometimes need many personalized pages at once. The free tools are the first test for which workflows deserve more automation later."],
  ["guides/free-weekly-planner-generator", "Free weekly planner generator", "Create a printable weekly planner for family schedules, classroom planning, errands, and meal notes.", "A weekly planner should show only the decisions that need to stay visible: appointments, meals, tasks, and reminders. One printable page is enough for a lightweight planning loop."],
  ["guides/free-habit-tracker-generator", "Free habit tracker generator", "Build a simple habit tracker printable for routines, reading goals, wellness habits, or classroom practice.", "A habit tracker works best when it tracks a few repeatable behaviors. A simple grid is easier to keep using than a heavily decorated page with too many categories."],
  ["guides/free-invoice-generator-no-signup", "Free invoice generator without signup", "Create a clean invoice PDF without an account, template marketplace, or surprise download fee.", "Many freelancers only need one invoice today. A tool that opens quickly, avoids account creation, and downloads a clean PDF can satisfy a high-intent search faster than a full accounting app."],
  ["guides/freelance-invoice-pdf-template", "Freelance invoice PDF template", "Make a one-page freelance invoice PDF for design, writing, consulting, development, and project work.", "A freelance invoice should make it easy for the client to approve payment. Keep each line item short: project phase, quantity, rate, and the resulting amount."],
  ["guides/free-estimate-generator-pdf", "Free estimate generator PDF", "Create a free estimate PDF for services, repairs, project work, consulting, or home jobs.", "A user searching for an estimate generator is often preparing to win a job today. A fast PDF with line items and clear validity terms can solve that moment without forcing accounting software."],
  ["guides/service-quote-pdf-template", "Service quote PDF template", "Make a printable service quote PDF for contractors, freelancers, consultants, or small local businesses.", "A service quote should make the work, assumptions, timeline, and price easy to scan. Keep each line item short and avoid promising work that is not included."],
  ["guides/free-purchase-order-generator", "Free purchase order generator", "Create a purchase order PDF for vendor orders, supply requests, services, or internal approvals.", "A purchase order gives the buyer and vendor a shared reference before an invoice arrives. It is useful for supplies, project materials, services, and approvals."],
  ["guides/purchase-order-pdf-template", "Purchase order PDF template", "Use a clean purchase order PDF template when a small team needs approval before buying goods or services.", "Even small teams benefit from a simple PO because it records what was approved, who the vendor is, and what cost was expected."],
  ["guides/free-bill-of-sale-generator", "Free bill of sale generator", "Create a simple bill of sale PDF for a private item sale, equipment transfer, or sale record.", "A bill of sale records who sold an item, who bought it, what was sold, the price, and the date. It is useful for private sales and simple transfers."],
  ["guides/private-sale-receipt-pdf", "Private sale receipt PDF", "Make a printable receipt for a private sale of equipment, furniture, electronics, or household items.", "Use a short description that identifies the item well enough for both parties. Add model, serial number, or condition notes when appropriate."],
  ["guides/free-rent-receipt-generator", "Free rent receipt generator", "Generate a printable rent receipt PDF for tenant records, landlord files, or cash payment documentation.", "A rent receipt gives both sides a simple record of who paid, how much was paid, when it was received, and what rental period the payment covers."],
  ["guides/rent-receipt-for-cash-payment", "Rent receipt for cash payment", "Create a simple receipt PDF when rent is paid by cash, bank transfer, check, or another payment method.", "Cash rent payments can be easy to dispute later if no record is created. A dated receipt gives both parties a reference."],
  ["guides/free-business-card-generator-printable", "Free printable business card generator", "Create printable business cards for a service, side business, class, event, or pop-up table.", "A simple business card sheet is useful when someone needs contact cards today and does not want to create a design account or order a print run."],
  ["guides/business-card-pdf-for-local-services", "Business card PDF for local services", "Make a practical contact card for notaries, tutors, cleaners, repair services, coaches, and small local businesses.", "Local service cards should make the name, service, phone, email, and booking note easy to read. Decorative design matters less than legibility."],
  ["guides/free-address-label-generator-printable", "Free printable address label generator", "Create return address labels, mailing labels, classroom labels, bin labels, or badge labels as a PDF sheet.", "Label sheets are easiest to use when the first test print is done on plain paper. Check alignment before printing on adhesive stock."],
  ["guides/mailing-label-pdf-template", "Mailing label PDF template", "Use a printable mailing label sheet for small batches of envelopes, packages, folders, and event materials.", "A small batch of labels often does not need full shipping software. A clean PDF sheet is enough for mail, folders, badges, and classroom bins."],
  ["guides/free-barcode-label-generator-printable", "Free printable barcode label generator", "Generate Code 39 barcode labels for SKU stickers, inventory bins, event check-in, and internal tracking.", "Static barcode labels are useful for internal workflows when a full inventory system is unnecessary. Always test scanning before printing a full sheet."],
  ["guides/sku-label-pdf-template", "SKU label PDF template", "Create a simple SKU label PDF for handmade products, market tables, storage bins, or internal inventory.", "SKU labels work best when the code is short, consistent, and printed with enough white space around the bars."],
  ["guides/free-price-tag-generator-printable", "Free printable price tag generator", "Make price tags and shelf labels for yard sales, craft fairs, pop-up shops, and small retail tables.", "A price tag page has commercial intent because the user is often preparing to sell products. Large prices and short item labels are easier for shoppers to scan."],
  ["guides/yard-sale-price-tags-pdf", "Yard sale price tags PDF", "Create quick printable price tags for garage sales, estate sales, moving sales, and community markets.", "Yard sale tags should be readable from a few feet away and simple enough to cut quickly before the sale starts."],
  ["guides/free-flyer-maker-pdf-no-signup", "Free flyer maker PDF without signup", "Make a one-page flyer PDF for a local service, yard sale, class, club, or community event.", "Flyer searches are often urgent. A clear headline, date or offer, short details, and contact line matter more than heavy decoration."],
  ["guides/local-service-flyer-pdf-template", "Local service flyer PDF template", "Create a simple printable flyer for cleaning, tutoring, repair, notary, coaching, or neighborhood services.", "A local service flyer should state what you do, who it helps, how to contact you, and one clear next step."],
  ["guides/free-coupon-maker-printable", "Free printable coupon maker", "Create printable coupon cards for local services, pop-up shops, classes, events, and small offers.", "Coupon pages should make the offer and terms clear. Avoid misleading discounts or unclear expiration notes."],
      ["guides/discount-coupon-pdf-template", "Discount coupon PDF template", "Make a coupon PDF sheet with offer text, coupon code, expiration note, and fine print.", "Coupons connect directly to local promotion and selling activity, so they are a stronger commercial validation category than generic decorative templates."],
      ["guides/free-packing-slip-generator-printable", "Free printable packing slip generator", "Create a packing slip PDF for small orders, handmade products, marketplace shipments, and local delivery.", "Packing slip pages have commercial intent because the user is often preparing a real customer order. Keep payment details off the slip unless the package workflow truly needs them."],
      ["guides/order-packing-slip-pdf-template", "Order packing slip PDF template", "Use a simple packing slip PDF as a package insert for small shops, pop-up pickups, and marketplace sales.", "A packing slip should make it easy to confirm items, quantities, status, order number, and recipient before sealing the package."],
      ["guides/free-work-order-generator-pdf", "Free work order generator PDF", "Create a work order PDF for repairs, maintenance visits, cleaning jobs, field service, and contractor tasks.", "Work order searches often happen right before a service visit. A useful form records scope, schedule, tasks, instructions, approval notes, and signatures."],
      ["guides/service-work-order-pdf-template", "Service work order PDF template", "Make a printable work order for contractors, local services, maintenance teams, and repair visits.", "A work order is strongest when it separates approved work from extra work that needs client approval."],
      ["guides/free-inventory-sheet-generator", "Free inventory sheet generator", "Create a printable inventory count sheet for stock checks, market tables, storage bins, and classroom supplies.", "Inventory counts repeat often, so a fast printable sheet can earn return visits when it is easier than opening a spreadsheet."],
      ["guides/stock-count-sheet-pdf-template", "Stock count sheet PDF template", "Use a printable stock count sheet for SKU checks, shelf reviews, craft fairs, event supplies, and restock notes.", "A stock count sheet should include enough columns to compare expected and counted quantities without making the rows hard to write on."],
      ["guides/free-resume-builder-pdf", "Free resume builder PDF", "Build a clean resume PDF without an account, paywall, or complicated design tool.", "Many job seekers do not need a heavy design template. They need a readable document with a clear name, contact line, summary, experience, skills, and education."],
      ["guides/ats-friendly-resume-pdf-guide", "ATS friendly resume PDF guide", "Format a simple resume PDF so it stays readable for recruiters and applicant tracking systems.", "Use clear section headings, normal text, and a single-column structure. Avoid putting important experience inside images, icons, or complex tables."],
      ["guides/ats-resume-keyword-match", "ATS resume keyword match guide", "Compare a resume against a job description without stuffing fake keywords or uploading private details.", "Use the job description to find skills, tools, job titles, certifications, and repeated responsibilities that genuinely match your background."],
      ["guides/free-cover-letter-generator-pdf", "Free cover letter generator PDF", "Create a one-page cover letter PDF for job applications without an account or download paywall.", "A job seeker often needs a cover letter right before submitting an application. A fast generator that exports a PDF without signup solves that moment better than a hidden download fee."],
  ["guides/cover-letter-no-signup", "Cover letter generator without signup", "Use a free cover letter PDF maker when you need a quick application document without creating an account.", "Many writing tools let users type a letter for free and then ask for payment at export. This generator keeps the first one-page PDF free so the value is visible immediately."],
  ["guides/free-resignation-letter-generator", "Free resignation letter generator", "Create a professional resignation letter PDF with last working day, appreciation, and transition wording.", "A resignation letter does not need to be long. It should state the role, company, date, last working day, appreciation, and a simple handoff offer."],
  ["guides/two-weeks-notice-letter-pdf", "Two weeks notice letter PDF", "Make a simple two weeks notice PDF that states your resignation date and final working day.", "A two weeks notice letter works best when the message is direct: you are resigning, your final day is listed, and you will help with transition tasks where possible."],
  ["guides/free-monthly-calendar-generator", "Free monthly calendar generator", "Create a printable monthly calendar PDF for appointments, bills, family plans, classes, or routines.", "A monthly calendar is useful for families, students, small teams, and anyone planning appointments or recurring tasks. It is a wider audience test than kids-only printables."],
  ["guides/printable-calendar-pdf-maker", "Printable calendar PDF maker", "Generate a simple black-and-white monthly calendar PDF that works on home printers.", "A printable calendar should leave enough writing space in each day cell. Heavy decoration can make the page harder to use after printing."],
  ["guides/free-meal-planner-generator", "Free meal planner generator", "Make a weekly meal planner PDF with meals, grocery list, and prep notes.", "Families often repeat meal planning every week, which makes it a useful validation category for downloads and return visits."],
  ["guides/weekly-meal-plan-grocery-list-pdf", "Weekly meal plan and grocery list PDF", "Create one printable page that combines a weekly meal plan with a grocery list and prep reminders.", "A meal plan is easier to use when the grocery list is on the same sheet. That keeps the planning decision connected to the shopping task."],
  ["guides/free-image-to-pdf-converter", "Free image to PDF converter", "Convert a JPG, PNG, or WebP image into a one-page PDF without uploading files.", "Image-to-PDF searches are urgent: people often need to submit a document, receipt, form, or photo as a PDF. This converter keeps the file in the browser instead of uploading it to a server."],
  ["guides/jpg-to-pdf-without-uploading", "JPG to PDF without uploading", "Make a PDF from a JPG file in the browser when you do not want to send the image to a conversion server.", "Photos of receipts, IDs, forms, and school documents can contain private information. A local converter is a safer first choice because the image is drawn into a PDF on your device."],
  ["guides/multiple-images-to-pdf-without-uploading", "Multiple images to PDF without uploading", "Combine several JPG, PNG, or WebP images into one multi-page PDF in the browser.", "Multi-image PDF conversion is useful for receipts, homework pages, forms, screenshots, and photo scans that need to be submitted together. A browser-side workflow avoids sending those files to a conversion server."],
  ["guides/compress-pdf-without-uploading", "Compress PDF without uploading", "Reduce a PDF file size locally by rebuilding selected pages as a smaller image-based PDF.", "PDF compression has strong urgent intent because users often arrive after an upload form rejects a file. The local image-based workflow is best for scanned or photo-heavy PDFs and may flatten selectable text."],
  ["guides/pdf-to-jpg-without-uploading", "PDF to JPG without uploading", "Convert PDF pages to JPG or PNG images locally in your browser.", "PDF-to-JPG searches often happen when a form or portal accepts images but rejects PDFs. Browser-side rendering keeps the source document local while producing ordinary image files."],
  ["guides/extract-text-from-pdf-without-uploading", "Extract text from PDF without uploading", "Turn selectable PDF text into a downloadable TXT file locally in your browser.", "PDF-to-text searches often happen when someone needs notes, quotes, admin details, or searchable text from a document. Scanned image-only PDFs need OCR, so this browser tool is intentionally clear about extracting embedded text only."],
  ["guides/pdf-to-word-without-uploading", "PDF to Word without uploading", "Convert selectable PDF text into a simple DOCX document locally in your browser.", "PDF-to-Word searches often come from users who need to edit a file now but do not want to upload private documents. A local text-first DOCX is best for words and review, while scanned PDFs and exact layout restoration need OCR or a full editor."],
  ["guides/signature-png-generator", "Signature PNG generator", "Draw or type a signature and download a transparent PNG locally without signup or upload.", "Signature PNG searches often come from document, proposal, and form workflows. A local visual-image tool can be useful, but it should not claim identity verification or regulated e-signature status."],
  ["guides/passport-photo-maker", "Passport photo maker without uploading", "Crop a passport-style photo locally for common print sizes before checking official requirements.", "Passport photo tools can save a user from paid export walls and unnecessary uploads, but they should be honest: sizing is only one part of acceptance. Users still need to check background, lighting, pose, expression, recency, and country-specific rules."],
  ["guides/compress-image-without-uploading", "Compress image without uploading", "Reduce JPG, PNG, or WebP file size in the browser before uploading elsewhere.", "Image compression searches often happen after a form rejects a file as too large. A no-upload workflow lets the user make a smaller copy locally before trying again."],
  ["guides/compress-image-to-100kb-without-uploading", "Compress image to 100KB without uploading", "Reduce a JPG, PNG, or WebP image toward a 100KB upload limit locally in the browser.", "Many forms, portals, job applications, exam sites, and profile pages reject images above a fixed KB size. A target-size compressor helps create a smaller copy without uploading the source image."],
  ["guides/resize-image-without-uploading", "Resize image without uploading", "Change image width, height, or preset size locally in the browser.", "Image resizing is useful for profile photos, thumbnails, marketplace listings, ID forms, and school portals that require exact dimensions."],
  ["guides/convert-image-format-without-uploading", "Convert image format without uploading", "Convert JPG, PNG, and WebP files locally when a website requires a different image format.", "A format converter solves a common mismatch: the image looks fine, but the receiving site accepts only JPG, PNG, or WebP."],
  ["guides/remove-background-without-uploading", "Remove background without uploading", "Create a transparent PNG from a white, solid, or near-solid background image locally in your browser.", "A transparent PNG is useful for product listings, logos, signature scans, icons, school projects, thumbnails, and documents where the original white or solid background looks messy."],
  ["guides/add-text-to-image-without-uploading", "Add text to image without uploading", "Put a headline, caption, label, or price on a photo locally in your browser.", "A simple text-on-image tool helps when a photo needs a title, price, note, class label, sale message, thumbnail headline, or meme-style caption before it is posted or shared."],
  ["guides/merge-pdf-without-uploading", "Merge PDF without uploading", "Combine several PDF files into one PDF locally in your browser.", "People often need one combined PDF for applications, school packets, receipts, or client documents. A browser-side merge avoids sending private files to a converter server."],
  ["guides/split-pdf-without-uploading", "Split PDF without uploading", "Extract selected pages from a PDF without uploading the document.", "PDF splitting is useful when a larger packet contains only a few pages you need to send. Page ranges should be checked carefully before sharing."],
  ["guides/add-page-numbers-to-pdf", "Add page numbers to PDF", "Add simple visible page numbers to an existing PDF in the browser.", "Page numbers help reviewers refer to pages in packets, drafts, reports, and handouts. A local tool can add simple numbering without a full PDF editor."],
  ["guides/rotate-pdf-pages-without-uploading", "Rotate PDF pages without uploading", "Fix sideways or upside-down PDF pages locally in your browser.", "PDF rotation is useful for scanned forms, phone-generated PDFs, receipts, and packets where only a few pages face the wrong direction."],
  ["guides/remove-pages-from-pdf-without-uploading", "Remove pages from PDF without uploading", "Delete selected PDF pages locally without sending the source file to a converter.", "Removing pages helps trim blank pages, duplicate scans, cover sheets, or private pages before sharing a PDF."],
  ["guides/reorder-pdf-pages-without-uploading", "Reorder PDF pages without uploading", "Organize PDF pages by entering a new page order in the browser.", "Reordering pages is useful when forms, application packets, classroom files, or client drafts were scanned out of sequence."],
  ["guides/watermark-pdf-without-uploading", "Watermark PDF without uploading", "Add a light text watermark to PDF pages locally in your browser.", "Watermarks are useful for drafts, samples, internal review copies, and documents that should be marked before sharing. A local workflow avoids sending the source file to a converter server."],
  ["guides/stamp-pdf-without-uploading", "Stamp PDF without uploading", "Add a simple PAID, APPROVED, DRAFT, or custom stamp to a PDF locally.", "PDF stamps help people scan the status of receipts, invoices, work orders, and review packets. Use them as visual labels, not as the only proof of payment or approval."],
  ["guides/add-signature-text-to-pdf-without-uploading", "Add signature text to PDF without uploading", "Place a typed signature block on a selected PDF page locally in your browser.", "A typed signature block is useful only when the receiving person or organization accepts it. Some documents require a specific e-sign provider, identity check, witness, or handwritten signature."],
  ["guides/text-to-pdf-converter-no-signup", "Text to PDF converter without signup", "Paste plain text and download a clean one-page PDF without installing an editor.", "Text-to-PDF searches are practical and time-sensitive. People often need to turn notes, instructions, or a plain letter into a PDF without creating an account or uploading the text to a file service."],
  ["guides/markdown-to-pdf-converter-no-signup", "Markdown to PDF converter without signup", "Paste Markdown and download a readable PDF without creating an account.", "Markdown-to-PDF searches come from people who already have structured notes, docs, README text, or outlines and need a shareable PDF copy without opening a heavier editor."],
  ["guides/csv-to-pdf-table-no-upload", "CSV to PDF table without uploading", "Paste CSV rows and download a readable PDF table without uploading a spreadsheet.", "CSV-to-PDF is useful for small tables such as inventory rows, rosters, order lists, price sheets, and quick reports that should stay local."],
  ["guides/json-to-pdf-formatter-no-upload", "JSON to PDF formatter without uploading", "Paste JSON and download a formatted PDF without sending the source data to a server.", "JSON-to-PDF is useful for reviewed API samples, config snippets, bug reports, QA notes, and technical references, but secrets should be removed before exporting."],
  ["guides/free-sign-in-sheet-generator", "Free sign-in sheet generator", "Create a printable sign-in sheet PDF for events, classes, workshops, meetings, or visitor logs.", "For small events, a printed sign-in sheet is often enough. It gives the organizer names, attendance, signatures, and contact details without needing a registration app."],
  ["guides/attendance-sheet-pdf-template", "Attendance sheet PDF template", "Use a simple printable attendance sheet for classes, clubs, workshops, and small meetings.", "A useful attendance sheet leaves enough writing space. Fewer rows per page can be better than a cramped page nobody can read later."],
  ["guides/free-printable-graph-paper-generator", "Free printable graph paper generator", "Generate graph paper PDF with quarter-inch, half-inch, or small grid spacing.", "Students, teachers, makers, and planners often need graph paper immediately. A generator with paper size and spacing options is useful even without decorative templates."],
  ["guides/quarter-inch-graph-paper-pdf", "Quarter inch graph paper PDF", "Create a quarter-inch graph paper PDF for math practice, planning, and sketching.", "Quarter-inch graph paper is readable without using too much page space. It is a good default for math work, simple layouts, and hand-drawn plans."],
  ["guides/free-packing-list-generator", "Free packing list generator", "Make a printable packing checklist PDF for travel, camping, family vacations, or business trips.", "A printed checklist works well because packing happens away from the screen: bedroom, laundry area, suitcase, car, or entryway."],
  ["guides/travel-checklist-pdf", "Travel checklist PDF", "Create a one-page travel checklist PDF with categories, checkboxes, and reminder notes.", "A travel checklist is easier to use when items are grouped by where they are packed or used. Separate clothes, toiletries, documents, and electronics."],
  ["guides/free-receipt-generator-pdf", "Free receipt generator PDF", "Create a simple printable receipt for a sale, service payment, deposit, or reimbursement.", "Receipt searches usually have immediate intent. Someone has received or sent money and needs a dated record that is clear enough for both parties to keep."],
  ["guides/weekly-timesheet-generator-pdf", "Weekly timesheet generator PDF", "Make a printable timesheet for freelance hours, staff records, project tracking, or approvals.", "Timesheets have repeat use because hours need to be recorded again every week or pay period. A quick printable sheet can be enough for freelancers, contractors, and small teams."],
  ["guides/free-certificate-generator-pdf", "Free certificate generator PDF", "Create a printable certificate for completion, participation, classroom awards, or small events.", "A certificate generator is useful when a teacher, coach, organizer, or club needs a polished award quickly without paying for a template package."],
  ["guides/printable-to-do-list-generator", "Printable to do list generator", "Build a one-page checklist for errands, work tasks, study sessions, home projects, or events.", "A printable to-do list works best when it limits the day to a few visible sections. The goal is action, not a giant task archive."],
].map(([path, title, description, intro]) => ({ path, title, description, intro }));

const keywordClusters = [
  {
    title: "Kids routine charts",
    description: "Morning, bedtime, chore, and reward charts for families who want a visible routine instead of another app.",
    links: [
      ["Chore chart generator", "tools/chore-chart"],
      ["Bedtime routine chart printable", "guides/bedtime-routine-chart-printable"],
      ["Printable morning routine chart ideas", "guides/printable-routine-chart-for-mornings"],
    ],
  },
  {
    title: "Preschool worksheets",
    description: "Name tracing, handwriting warmups, and short black-and-white pages designed for ordinary home printers.",
    links: [
      ["Name tracing worksheet generator", "tools/name-tracing"],
      ["Free printable name tracing worksheet maker", "guides/free-printable-name-tracing-worksheet-maker"],
      ["Printable worksheets for preschool at home", "guides/printable-worksheets-for-preschool-at-home"],
    ],
  },
  {
    title: "Classroom printables",
    description: "Fast one-page resources for teachers, tutors, homeschool groups, and small classroom routines.",
    links: [
      ["Flashcard generator", "tools/flashcards"],
      ["Classroom job chart printable", "guides/classroom-job-chart-printable"],
      ["Printable flashcard generator guide", "guides/flashcard-generator-printable-guide"],
    ],
  },
  {
    title: "Family planning pages",
    description: "Weekly planners, monthly calendars, meal plans, habit trackers, and simple pages for families that need one visible plan.",
    links: [
      ["Weekly planner generator", "tools/weekly-planner"],
      ["Monthly calendar generator", "tools/monthly-calendar"],
      ["Meal planner generator", "tools/meal-planner"],
      ["Habit tracker generator", "tools/habit-tracker"],
    ],
  },
  {
    title: "Everyday file utilities",
    description: "High-intent image, QR, and PDF tools for compression, resizing, format conversion, static QR codes, existing PDF edits, text conversion, labels, checklists, sign-in sheets, graph paper, and travel paperwork.",
    links: [
      ["Upload limit fixer", "upload-limit-fixer"],
      ["Image to PDF converter", "tools/image-to-pdf"],
      ["JPG to PDF without uploading", "jpg-to-pdf-no-upload"],
      ["Multiple images to PDF", "tools/multi-image-pdf"],
      ["Multiple images to PDF without uploading", "multiple-images-to-pdf-no-upload"],
      ["Compress PDF", "tools/compress-pdf"],
      ["Compress PDF without uploading", "compress-pdf-no-upload"],
      ["Compress PDF to 500KB", "compress-pdf-to-500kb"],
      ["Compress PDF to 1MB", "compress-pdf-to-1mb"],
      ["Compress PDF to 2MB", "compress-pdf-to-2mb"],
      ["Compress PDF to 5MB", "compress-pdf-to-5mb"],
      ["PDF to JPG converter", "tools/pdf-to-images"],
      ["PDF to JPG without uploading", "pdf-to-jpg-no-upload"],
      ["PDF to text converter", "tools/pdf-to-text"],
      ["Extract text from PDF without uploading", "extract-text-from-pdf-no-upload"],
      ["PDF to Word converter", "tools/pdf-to-word"],
      ["PDF to Word without uploading", "pdf-to-word-no-upload"],
      ["Compress image", "tools/compress-image"],
      ["Compress image without uploading", "compress-image-no-upload"],
      ["Compress image to KB", "tools/compress-image-to-kb"],
      ["Compress image to 50KB", "compress-image-to-50kb"],
      ["Compress image to 100KB", "compress-image-to-100kb"],
      ["Compress image to 200KB", "compress-image-to-200kb"],
      ["Compress image to 500KB", "compress-image-to-500kb"],
      ["Resize image", "tools/resize-image"],
      ["Resize image without uploading", "resize-image-no-upload"],
      ["Convert image format", "tools/convert-image"],
      ["Convert image format without uploading", "convert-image-format-no-upload"],
      ["Remove background", "tools/remove-background"],
      ["Transparent PNG maker", "remove-background-no-upload"],
      ["Crop image", "tools/crop-image"],
      ["Crop image without uploading", "crop-image-no-upload"],
      ["Rotate image", "tools/rotate-image"],
      ["Rotate image without uploading", "rotate-image-no-upload"],
      ["Watermark image", "tools/watermark-image"],
      ["Watermark image without uploading", "watermark-image-no-upload"],
      ["Add text to image", "tools/add-text-image"],
      ["Add text to photo", "add-text-to-image-no-upload"],
      ["Signature PNG generator", "tools/signature-png"],
      ["Transparent signature PNG", "signature-png-generator"],
      ["Passport photo maker", "tools/passport-photo"],
      ["Passport photo maker without uploading", "passport-photo-maker"],
      ["Free QR code generator", "tools/qr-code"],
      ["QR code generator without signup", "free-qr-code-generator-no-signup"],
      ["WiFi QR code generator", "tools/wifi-qr-code"],
      ["Printable WiFi QR code", "wifi-qr-code-generator"],
      ["Contact QR code generator", "tools/vcard-qr-code"],
      ["vCard contact QR code", "contact-qr-code-generator"],
      ["Compress JPG", "compress-jpg-no-upload"],
      ["Compress PNG", "compress-png-no-upload"],
      ["Resize image to 1080x1080", "resize-image-1080x1080"],
      ["Resize image to 512x512", "resize-image-512x512"],
      ["PNG to JPG", "png-to-jpg-no-upload"],
      ["WebP to JPG", "webp-to-jpg-no-upload"],
      ["Merge PDF without uploading", "merge-pdf-no-upload"],
      ["Split PDF without uploading", "split-pdf-no-upload"],
      ["Add page numbers to PDF", "add-page-numbers-to-pdf"],
      ["Rotate PDF pages", "tools/rotate-pdf"],
      ["Rotate PDF pages without uploading", "rotate-pdf-no-upload"],
      ["Remove pages from PDF", "tools/remove-pdf-pages"],
      ["Remove pages from PDF without uploading", "remove-pages-from-pdf-no-upload"],
      ["Reorder PDF pages", "tools/reorder-pdf-pages"],
      ["Reorder PDF pages without uploading", "reorder-pdf-pages-no-upload"],
      ["Watermark PDF", "tools/watermark-pdf"],
      ["Watermark PDF without uploading", "watermark-pdf-no-upload"],
      ["Stamp PDF", "tools/stamp-pdf"],
      ["Stamp PDF without uploading", "stamp-pdf-no-upload"],
      ["Add signature text to PDF", "tools/sign-pdf"],
      ["Sign PDF without uploading", "sign-pdf-no-upload"],
      ["Text to PDF converter", "tools/text-to-pdf"],
      ["Text to PDF converter without signup", "text-to-pdf-no-signup"],
      ["Markdown to PDF converter", "tools/markdown-to-pdf"],
      ["Markdown to PDF without signup", "markdown-to-pdf-no-signup"],
      ["CSV to PDF table converter", "tools/csv-to-pdf"],
      ["CSV to PDF without uploading", "csv-to-pdf-no-upload"],
      ["JSON to PDF formatter", "tools/json-to-pdf"],
      ["JSON to PDF without uploading", "json-to-pdf-no-upload"],
      ["Sign-in sheet generator", "tools/sign-in-sheet"],
      ["Graph paper generator", "tools/graph-paper"],
      ["Packing list generator", "tools/packing-list"],
      ["To do list generator", "tools/todo-list"],
    ],
  },
  {
    title: "Business paperwork",
    description: "Clean PDF invoices, estimates, purchase orders, sale records, receipts, work orders, packing slips, inventory sheets, timesheets, cards, labels, and barcodes for people who need a document now.",
    links: [
      ["Invoice generator", "tools/invoice-generator"],
      ["Free invoice generator without signup", "free-invoice-generator-no-signup"],
      ["Estimate generator", "tools/estimate-generator"],
      ["Purchase order generator", "tools/purchase-order"],
      ["Packing slip generator", "tools/packing-slip"],
      ["Free packing slip generator", "free-packing-slip-generator-printable"],
      ["Work order generator", "tools/work-order"],
      ["Free work order generator PDF", "free-work-order-generator-pdf"],
      ["Inventory sheet generator", "tools/inventory-sheet"],
      ["Free inventory sheet generator", "free-inventory-sheet-generator"],
      ["Business card generator", "tools/business-card"],
      ["Free business card generator", "free-business-card-generator-printable"],
      ["Address label generator", "tools/address-labels"],
      ["Free address label generator", "free-address-label-generator-printable"],
      ["Barcode label generator", "tools/barcode-labels"],
      ["Free barcode label generator", "free-barcode-label-generator-printable"],
      ["Receipt generator", "tools/receipt-generator"],
      ["Free receipt generator without signup", "free-receipt-generator-no-signup"],
      ["Timesheet generator", "tools/timesheet-generator"],
      ["Weekly timesheet PDF without signup", "weekly-timesheet-pdf-no-signup"],
      ["Rent receipt generator", "tools/rent-receipt"],
    ],
  },
  {
    title: "Events and awards",
    description: "Printable certificates, sign-in sheets, and checklists for small events, classrooms, workshops, and clubs.",
    links: [
      ["Certificate generator", "tools/certificate-generator"],
      ["Free certificate maker without signup", "free-certificate-maker-no-signup"],
      ["Flyer maker", "tools/flyer-maker"],
      ["Free flyer maker PDF", "free-flyer-maker-pdf-no-signup"],
      ["Coupon maker", "tools/coupon-maker"],
      ["Free coupon maker", "free-coupon-maker-printable"],
      ["Price tag generator", "tools/price-tag"],
      ["Free price tag generator", "free-price-tag-generator-printable"],
      ["Sign-in sheet generator", "tools/sign-in-sheet"],
      ["To do list generator", "tools/todo-list"],
    ],
  },
  {
    title: "Career documents",
    description: "Free resume, cover letter, and resignation letter PDFs for job seekers who need useful documents without a surprise paywall.",
    links: [
      ["Resume builder PDF", "tools/resume-builder"],
      ["Free resume builder without signup", "free-resume-builder-no-signup"],
      ["ATS resume checker", "tools/ats-resume-checker"],
      ["Free ATS resume checker", "ats-resume-checker-free"],
      ["Cover letter generator", "tools/cover-letter"],
      ["Resignation letter generator", "tools/resignation-letter"],
      ["Free resume builder PDF guide", "guides/free-resume-builder-pdf"],
      ["ATS resume keyword match guide", "guides/ats-resume-keyword-match"],
    ],
  },
];

const SPONSOR_PLACEMENTS = [
  {
    id: "starter-review",
    name: "Starter media review",
    price: "USD 49 exploratory",
    fit: "A sponsor or partner wants a quick manual fit review before discussing placement.",
    deliverable: "Policy-fit check, suggested placement type, and a public-safe follow-up note.",
  },
  {
    id: "guide-sponsorship",
    name: "Guide sponsorship pilot",
    price: "USD 99-149 pilot",
    fit: "Useful products for privacy-friendly PDF, image, QR, career, classroom, or small-business workflows.",
    deliverable: "Clearly labeled sponsor mention on one relevant guide or resource page after approval.",
  },
  {
    id: "partner-distribution",
    name: "Partner distribution swap",
    price: "No-cash mutual test",
    fit: "Directories, newsletters, or communities that can send relevant visitors to free tools.",
    deliverable: "Tracked partner link and review of whether traffic creates depth, download, or lead signal.",
  },
];

const SPONSOR_DEALS = [
  {
    id: "starter-fit-review",
    title: "Starter fit review",
    price: "USD 49",
    budgetRange: "under-250",
    placement: "media-kit-review",
    timeline: "this-week",
    bestFor: "A sponsor wants to know whether their product is safe and relevant before buying a visible placement.",
    deliverable: "Manual sponsor-fit review, audience match, recommended page family, and safe next-step copy.",
    proofNeeded: "Company URL, product category, intended audience, and any placement rules.",
    trackedUrl: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=starter-fit-review#sponsor-inquiry`,
  },
  {
    id: "guide-sponsor-pilot",
    title: "Guide sponsor pilot",
    price: "USD 99-149",
    budgetRange: "250-500",
    placement: "content-sponsorship",
    timeline: "this-month",
    bestFor: "A PDF, image, QR, career, classroom, or small-business product wants one clearly labeled pilot mention.",
    deliverable: "One manually approved, clearly labeled sponsor mention on a relevant guide or resource page.",
    proofNeeded: "Campaign fit, sponsor copy draft, safe landing URL, and category exclusions.",
    trackedUrl: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=guide-sponsor-pilot#sponsor-inquiry`,
  },
  {
    id: "vertical-category-pilot",
    title: "Vertical category pilot",
    price: "USD 149-250",
    budgetRange: "250-500",
    placement: "directory-visibility",
    timeline: "this-month",
    bestFor: "A partner cares about one audience such as QR/local marketing, resume/career, classroom, or small-business paperwork.",
    deliverable: "Tracked vertical sponsor page, fit review, and one approved contextual placement candidate.",
    proofNeeded: "Target vertical, audience fit, sponsor category, and safe public landing URL.",
    trackedUrl: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=vertical-category-pilot#sponsor-inquiry`,
  },
  {
    id: "partner-distribution-test",
    title: "Partner distribution test",
    price: "No-cash mutual test",
    budgetRange: "exploratory",
    placement: "partner-distribution",
    timeline: "exploratory",
    bestFor: "A newsletter, directory, resource page, or community wants to test relevant traffic before a paid placement.",
    deliverable: "Tracked partner link, source attribution, and review against page views, depth, downloads, or lead signal.",
    proofNeeded: "Partner page, expected audience, planned link context, and review window.",
    trackedUrl: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=partner-distribution-test#sponsor-inquiry`,
  },
];

function sponsorDealPrefillAttrs(deal) {
  return [
    `data-sponsor-deal-id="${escapeHtml(deal.id)}"`,
    `data-sponsor-placement="${escapeHtml(deal.placement)}"`,
    `data-sponsor-budget-range="${escapeHtml(deal.budgetRange)}"`,
    `data-sponsor-timeline="${escapeHtml(deal.timeline)}"`,
    `data-sponsor-notes="${escapeHtml(`${deal.title} (${deal.price}): ${deal.deliverable} Needed: ${deal.proofNeeded}`)}"`,
  ].join(" ");
}

const SPONSOR_OUTREACH_TARGETS = [
  {
    category: "PDF, image, and QR SaaS",
    why: "Adjacent products may want privacy-friendly utility traffic without gating free downloads.",
    pitch: "Offer a labeled guide sponsorship or partner resource link around no-upload file workflows.",
  },
  {
    category: "Career and resume products",
    why: "Resume, ATS, cover-letter, and PDF-size searches carry job-application intent.",
    pitch: "Offer a labeled resource placement near resume, ATS, and PDF upload-limit content.",
  },
  {
    category: "Teacher, homeschool, and classroom resources",
    why: "Worksheet, flashcard, name-tracing, and classroom printable pages match education audiences.",
    pitch: "Offer content sponsorship on classroom-printable guides with strict child-safety review.",
  },
  {
    category: "Small-business paperwork tools",
    why: "Invoices, receipts, price tags, flyers, QR signs, and packing slips attract local seller intent.",
    pitch: "Offer a sponsor pilot around paperwork templates, QR signage, or local promotion workflows.",
  },
  {
    category: "Free-tool directories and newsletters",
    why: "A no-signup free utility collection can be useful editorial inventory for directory audiences.",
    pitch: "Offer a reciprocal or no-cash traffic-quality test using tracked links.",
  },
];

const SPONSOR_VERTICALS = [
  {
    slug: "pdf-image-qr-saas",
    title: "PDF, Image, and QR SaaS Sponsorship",
    description: "Sponsor pilot page for SaaS products that help people compress files, convert images, generate QR codes, automate documents, or manage privacy-friendly file workflows.",
    audience: "Visitors fixing PDF size limits, converting images, making static QR codes, and choosing no-upload browser utilities.",
    sponsorFit: "PDF APIs, image optimization tools, QR platforms, privacy-friendly document automation, browser utility products, and file-workflow SaaS.",
    pitch: "Reach people who already have a file, upload, conversion, or QR job in progress.",
    campaign: "pdf_image_qr_saas",
    primaryPlacementId: "guide-sponsorship",
    priceHint: "USD 99-149 pilot",
    links: [
      ["Compress PDF", "tools/compress-pdf"],
      ["Compress image to KB", "tools/compress-image-to-kb"],
      ["Convert image format", "tools/convert-image"],
      ["Free QR code generator", "tools/qr-code"],
      ["Upload limit fixer", "upload-limit-fixer"],
    ],
    sponsorCategories: ["PDF APIs", "image compression SaaS", "QR code platforms", "document automation", "privacy-friendly browser utilities"],
  },
  {
    slug: "resume-career-sponsors",
    title: "Resume and Career Tool Sponsorship",
    description: "Sponsor pilot page for career products that help job seekers with resumes, ATS checks, cover letters, applications, PDF upload limits, and interview preparation.",
    audience: "Job seekers creating resume PDFs, checking ATS keywords, fixing resume upload size limits, and preparing application documents.",
    sponsorFit: "Resume builders, ATS tools, job boards, interview prep products, career coaching, and applicant-document utilities.",
    pitch: "Reach visitors at the moment they are preparing or fixing job-application documents.",
    campaign: "resume_career_sponsors",
    primaryPlacementId: "guide-sponsorship",
    priceHint: "USD 99-149 pilot",
    links: [
      ["Resume builder", "tools/resume-builder"],
      ["ATS resume checker", "tools/ats-resume-checker"],
      ["Cover letter generator", "tools/cover-letter"],
      ["Resume PDF too large", "resume-pdf-too-large"],
      ["ATS resume keyword guide", "guides/ats-resume-keyword-match"],
    ],
    sponsorCategories: ["resume software", "ATS checkers", "job boards", "career coaching", "interview prep"],
  },
  {
    slug: "classroom-printable-sponsors",
    title: "Classroom Printable Sponsorship",
    description: "Sponsor pilot page for education, homeschool, teacher-resource, and classroom products that fit worksheets, flashcards, tracing pages, planners, and routine charts.",
    audience: "Teachers, homeschool families, and parents making free printable learning, planning, and classroom-management PDFs.",
    sponsorFit: "Teacher marketplaces, homeschool resources, classroom apps, learning printables, family routine products, and child-safe educational tools.",
    pitch: "Reach classroom and homeschool visitors while keeping child-safety and ad-safety review strict.",
    campaign: "classroom_printable_sponsors",
    primaryPlacementId: "guide-sponsorship",
    priceHint: "USD 99-149 pilot",
    links: [
      ["Name tracing worksheet", "tools/name-tracing"],
      ["Flashcard generator", "tools/flashcards"],
      ["Chore chart", "tools/chore-chart"],
      ["Weekly planner", "tools/weekly-planner"],
      ["Classroom label ideas", "guides/classroom-label-generator-ideas"],
    ],
    sponsorCategories: ["teacher resources", "homeschool tools", "classroom apps", "learning printables", "family routine products"],
  },
  {
    slug: "small-business-paperwork-sponsors",
    title: "Small Business Paperwork Sponsorship",
    description: "Sponsor pilot page for products that help freelancers, local sellers, and small businesses with invoices, receipts, quotes, labels, QR signs, flyers, and operations paperwork.",
    audience: "Freelancers, local sellers, home-service operators, and small teams creating simple business PDFs and print assets.",
    sponsorFit: "Invoicing apps, bookkeeping tools, POS products, local marketing services, shipping tools, label systems, and small-business operations software.",
    pitch: "Reach small-business visitors while they are making paperwork or local promotion files.",
    campaign: "small_business_paperwork_sponsors",
    primaryPlacementId: "guide-sponsorship",
    priceHint: "USD 99-149 pilot",
    links: [
      ["Invoice generator", "tools/invoice-generator"],
      ["Receipt generator", "tools/receipt-generator"],
      ["Packing slip generator", "tools/packing-slip"],
      ["Business card generator", "tools/business-card"],
      ["Price tag generator", "tools/price-tag"],
    ],
    sponsorCategories: ["invoicing software", "bookkeeping tools", "POS products", "shipping tools", "local marketing services"],
  },
  {
    slug: "local-marketing-qr-sponsors",
    title: "Local Marketing and QR Sponsorship",
    description: "Sponsor pilot page for QR, signage, local promotion, review-management, and small-business marketing products that fit printable flyers, coupons, price tags, and WiFi/contact QR tools.",
    audience: "Local services, shops, event organizers, and small teams creating QR codes, flyers, coupons, signs, and printable promotion assets.",
    sponsorFit: "QR platforms, review-request tools, local SEO products, print shops, signage services, event tools, and small-business marketing software.",
    pitch: "Reach visitors making offline-to-online assets for local promotion.",
    campaign: "local_marketing_qr_sponsors",
    primaryPlacementId: "starter-review",
    priceHint: "USD 49 exploratory or USD 99-149 pilot",
    links: [
      ["Free QR code generator", "tools/qr-code"],
      ["WiFi QR code generator", "tools/wifi-qr-code"],
      ["Contact QR code generator", "tools/vcard-qr-code"],
      ["Flyer maker", "tools/flyer-maker"],
      ["Coupon maker", "tools/coupon-maker"],
    ],
    sponsorCategories: ["QR code platforms", "review-management tools", "local SEO products", "print shops", "event marketing tools"],
  },
];

const SPONSOR_OUTREACH_TEMPLATES = [
  {
    id: "sponsor-fit-email",
    channel: "Email or contact form",
    subject: "Small sponsorship pilot for free PDF, image, and QR utility traffic",
    body: "Hi, I run PrintableTools Lab, a free no-signup browser utility site for PDF, image, QR, document, career, classroom, and small-business workflows. I am opening a small sponsor/partner pilot with clearly labeled placements and strict rules: downloads stay free, sponsor copy is separated from generator controls, and no misleading upload or finance offers are accepted. If your product is relevant to privacy-friendly file or document workflows, I can send the media kit and fit checklist.",
  },
  {
    id: "directory-partner-message",
    channel: "Directory or newsletter pitch",
    subject: "Free no-signup PDF/image/QR tools for your utility audience",
    body: "PrintableTools Lab has 66 free browser tools, 95 guides, and high-intent pages for upload limits, PDF compression, image conversion, QR codes, invoices, resumes, labels, and printables. I am looking for low-risk partner distribution tests where success is measured by actual tool depth, downloads, or sponsor leads rather than vanity traffic.",
  },
  {
    id: "resource-page-follow-up",
    channel: "Follow-up after relevant discussion",
    subject: "Resource fit: no-upload file tools",
    body: "This may be useful for your audience: PrintableTools Lab keeps core exports free and local-first where possible. Sponsor and partner requests are reviewed manually, with no payment collected on the site and no private payout or tax details requested.",
  },
];

const SPONSOR_CALL_ACTIONS = [
  {
    title: "Sponsor a relevant guide",
    audience: "PDF, image, QR, resume, classroom, or small-business workflow products.",
    url: `${siteUrl("sponsor").replace(/\/$/, "")}?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_call&utm_content=guide-sponsor`,
    signal: "A qualified sponsor lead submits audience fit and budget range through the site form.",
  },
  {
    title: "Request a starter fit review",
    audience: "Early partners who want a quick policy-fit review before discussing copy.",
    url: `${siteUrl("sponsor").replace(/\/$/, "")}?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_call&utm_content=starter-review`,
    signal: "A business asks for the USD 49 exploratory review or a no-cash partner test.",
  },
  {
    title: "Use a vertical sponsor page",
    audience: "Partners who care about one audience: QR/local marketing, resume, classroom, small business, or file workflow SaaS.",
    url: `${siteUrl("sponsor/pdf-image-qr-saas").replace(/\/$/, "")}?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_call&utm_content=vertical-pages`,
    signal: "A sponsor lead arrives with sponsor-call attribution and a vertical path.",
  },
];

const SPONSOR_DISCOVERY_LINKS = [
  {
    title: "Sponsor deal room",
    path: "sponsor-deal-room",
    url: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=deal-room`,
    canonicalUrl: siteUrl("sponsor-deal-room"),
    reason: "Direct pilot pricing, fit rules, tracked deal paths, and the business-safe inquiry form for partners ready to discuss a sponsor test.",
  },
  {
    title: "Public sponsor call",
    path: "sponsor-call",
    url: `${siteUrl("sponsor-call").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_call&utm_content=public-call`,
    canonicalUrl: siteUrl("sponsor-call"),
    reason: "Open invitation for policy-fit sponsors and partners to use the sponsor form instead of private outreach.",
  },
  {
    title: "Sponsor inquiry form",
    path: "sponsor",
    url: `${siteUrl("sponsor").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_call&utm_content=inquiry-form#sponsor-inquiry`,
    canonicalUrl: siteUrl("sponsor"),
    reason: "Manual intake for labeled guide sponsorship, starter review, and partner distribution inquiries.",
  },
  {
    title: "Sponsor call JSON",
    path: "sponsor-call.json",
    url: siteUrl("sponsor-call.json").replace(/\/$/, ""),
    canonicalUrl: siteUrl("sponsor-call.json").replace(/\/$/, ""),
    reason: "Machine-readable sponsor openings, reply path, vertical pages, and success gate.",
  },
  {
    title: "Sponsor media kit JSON",
    path: "sponsor-media-kit.json",
    url: siteUrl("sponsor-media-kit.json").replace(/\/$/, ""),
    canonicalUrl: siteUrl("sponsor-media-kit.json").replace(/\/$/, ""),
    reason: "Public facts, placement rules, vertical fits, and safety constraints for partners.",
  },
];

function sponsorOpportunityPayload(generatedAt = new Date().toISOString()) {
  const trackedInquiryUrl = `${siteUrl("sponsor").replace(/\/$/, "")}?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=sponsor_opportunities&utm_content=board#sponsor-inquiry`;
  return {
    name: "PrintableTools Lab Sponsor Opportunities",
    generatedAt,
    canonical: siteUrl("sponsor-opportunities"),
    sponsorPage: siteUrl("sponsor"),
    sponsorCall: siteUrl("sponsor-call"),
    mediaKit: siteUrl("sponsor-media-kit.json").replace(/\/$/, ""),
    inquiryUrl: trackedInquiryUrl,
    opportunities: SPONSOR_VERTICALS.map((vertical) => ({
      slug: vertical.slug,
      title: vertical.title,
      audience: vertical.audience,
      sponsorFit: vertical.sponsorFit,
      priceHint: vertical.priceHint,
      trackedUrl: `${siteUrl(`sponsor/${vertical.slug}`).replace(/\/$/, "")}?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=${encodeURIComponent(vertical.campaign)}&utm_content=board`,
      categories: vertical.sponsorCategories,
    })),
    placements: SPONSOR_PLACEMENTS,
    rules: [
      "Use this board only for policy-fit sponsor and partner discovery.",
      "Downloads stay free and cannot require ad clicks, sponsor interaction, accounts, or payment.",
      "Sponsor copy must be clearly labeled and manually reviewed before placement.",
      "Do not send payment, tax, bank, phone, private identity, passwords, or customer files through this site.",
    ],
    successGate: "A real qualified sponsor inquiry, signed agreement, or settled external payment. Views and clicks alone are not revenue.",
  };
}

function sponsorDealRoomPayload(generatedAt = new Date().toISOString()) {
  return {
    name: "PrintableTools Lab Sponsor Deal Room",
    generatedAt,
    canonical: siteUrl("sponsor-deal-room"),
    inquiryUrl: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=direct#sponsor-inquiry`,
    deals: SPONSOR_DEALS,
    verticals: SPONSOR_VERTICALS.map(sponsorVerticalEntry),
    requiredReview: [
      "Company/product fit must be relevant to free PDF, image, QR, career, classroom, or small-business workflows.",
      "Sponsor copy must be clearly labeled and manually approved before placement.",
      "Downloads stay free and cannot require sponsor interaction, ad clicks, accounts, or payment.",
      "No gambling, adult, deceptive finance, malware, fake document, misleading upload-service, or unsafe claims.",
    ],
    moneyGate: "Revenue is real only after a sponsor agreement or settled external payment is verified. Deal-room visits, clicks, and lead submissions are operating signals.",
  };
}

function sponsorMediaKitPayload(generatedAt = new Date().toISOString()) {
  return {
    name: "PrintableTools Lab Sponsor Media Kit",
    generatedAt,
    site: siteUrl(""),
    sponsorPage: siteUrl("sponsor"),
    sponsorDealRoom: siteUrl("sponsor-deal-room"),
    toolsJson: siteUrl("tools.json").replace(/\/$/, ""),
    directoryPack: siteUrl("submit-directory"),
    facts: {
      tools: tools.length,
      guides: guides.length,
      landingPages: landingPages.length,
      indexableRoutes: routes.filter((route) => route.index !== false).length,
      exports: "Free browser exports; no signup required for core tools.",
      ads: "Ads disabled during validation. Downloads must never be gated by sponsor or ad interaction.",
    },
    placements: SPONSOR_PLACEMENTS,
    dealRoomOffers: SPONSOR_DEALS,
    outreachTargets: SPONSOR_OUTREACH_TARGETS,
    outreachTemplates: SPONSOR_OUTREACH_TEMPLATES,
    verticalSponsorPages: SPONSOR_VERTICALS.map(sponsorVerticalEntry),
    rules: [
      "Sponsor copy must be clearly labeled.",
      "Downloads stay free and cannot require an ad click, sponsor interaction, account, or payment.",
      "No gambling, adult, deceptive finance, malware, fake document, or misleading upload-service offers.",
      "No guaranteed traffic, guaranteed compression, legal/tax advice, or official acceptance claims.",
      "Payment, tax, bank, phone, private identity, and payout details stay outside PrintableTools Lab.",
    ],
    moneyGate: "Revenue is real only when an external payment provider or sponsor agreement shows settled payment. Sponsor leads and clicks are validation, not revenue.",
  };
}

function sponsorCallPayload(generatedAt = new Date().toISOString()) {
  return {
    name: "PrintableTools Lab Sponsor Call",
    generatedAt,
    canonical: siteUrl("sponsor-call"),
    sponsorPage: siteUrl("sponsor"),
    sponsorDealRoom: siteUrl("sponsor-deal-room"),
    mediaKit: siteUrl("sponsor-media-kit.json").replace(/\/$/, ""),
    outreachPack: siteUrl("sponsor-outreach-pack.json").replace(/\/$/, ""),
    actions: SPONSOR_CALL_ACTIONS,
    discoveryLinks: SPONSOR_DISCOVERY_LINKS,
    verticalSponsorPages: SPONSOR_VERTICALS.map(sponsorVerticalEntry),
    publicFacts: {
      tools: tools.length,
      guides: guides.length,
      landingPages: landingPages.length,
      exports: "Free no-signup browser exports.",
    },
    replyPath: "Use the sponsor inquiry form. Do not send payment, tax, phone, bank, private identity, passwords, or customer files.",
    successGate: "The call works only when a qualified sponsor inquiry, signed agreement, or settled external payment is verified.",
  };
}

function sponsorVerticalEntry(vertical) {
  return {
    slug: vertical.slug,
    title: vertical.title,
    url: siteUrl(`sponsor/${vertical.slug}`),
    trackedUrl: sponsorVerticalTrackedUrl(vertical),
    audience: vertical.audience,
    sponsorFit: vertical.sponsorFit,
    pitch: vertical.pitch,
    priceHint: vertical.priceHint,
    sponsorCategories: vertical.sponsorCategories,
  };
}

function sponsorVerticalTrackedUrl(vertical) {
  return `${siteUrl(`sponsor/${vertical.slug}`).replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=${encodeURIComponent(vertical.campaign)}`;
}


const pages = [
  {
    path: "",
    title: "Free Printable PDF, Image, and QR Tools",
    description: "Create passport photos, image compression, resizing, cropping, rotation, watermarking, text-on-image overlays, transparent signature PNGs, static QR codes, WiFi QR signs, contact QR codes, PDF-to-JPG images, PDF-to-text files, image-to-PDF conversions, text, Markdown, CSV, and JSON PDF exports, invoices, receipts, labels, business cards, flyers, coupons, resumes, worksheets, charts, and planners as free browser exports.",
    html: `
      <section class="shell hero">
        <div>
          <h1>Make useful PDF, image, and QR files in under a minute.</h1>
          <p>Free browser-based generators for passport photos, ATS resume checks, PDF compression, image compression, resizing, cropping, rotation, watermarking, text-on-image overlays, transparent signature PNGs, QR codes, WiFi QR signs, contact QR codes, PDF-to-JPG images, PDF-to-text extraction, image format conversion, no-upload PDF edits, text-to-PDF, Markdown-to-PDF, CSV-to-PDF, JSON-to-PDF, invoices, receipts, labels, business cards, flyers, coupons, timesheets, resumes, certificates, worksheets, sign-in sheets, graph paper, checklists, and planners. No account, no surprise download fee.</p>
          <div class="hero-actions">
            <a class="button" href="/free-pdf-tools/">Browse free file tools</a>
            <a class="button secondary" href="/tools/invoice-generator/">Create an invoice</a>
            <a class="button ghost" href="/upload-limit-fixer/">Fix upload limits</a>
          </div>
          <div class="hero-proof" aria-label="Launch validation goals">
            <div class="proof-tile"><strong>66</strong><span>high-frequency tools</span></div>
            <div class="proof-tile"><strong>5/day</strong><span>free generations</span></div>
            <div class="proof-tile"><strong>95</strong><span>SEO-ready guides</span></div>
          </div>
        </div>
        <div class="hero-preview" aria-hidden="true">
          <picture class="hero-image">
            <source srcset="/assets/images/hero-printable-workspace-small.webp" media="(max-width: 680px)">
            <img src="/assets/images/hero-printable-workspace-web.webp" alt="">
          </picture>
        </div>
      </section>
      <section class="shell section">
        <h2>Popular file and printable searches</h2>
        <div class="grid-2">
          ${keywordClusters.map(keywordClusterHtml).join("\n")}
        </div>
      </section>
      ${uploadLimitShortcutsHtml()}
      <section class="shell section">
        <h2>Ad-supported free tool validation</h2>
        <div class="grid-2">
          <article class="panel">
            <h3>Free tools first</h3>
            <p>The site earns attention by solving useful file jobs: compressing PDFs and images, fixing upload limits, making QR codes, and creating simple business paperwork without signup.</p>
            <p><a class="button" href="/free-pdf-tools/">Browse free tools</a> <a class="button secondary" href="/upload-limit-fixer/">Open upload limit fixer</a></p>
          </article>
          <article class="panel">
            <h3>Ad safety gate</h3>
            <p>Ads are off during validation. When enabled, they must stay away from generator controls, never block downloads, and never ask visitors to click or interact with ads for access.</p>
          </article>
        </div>
      </section>
      <section class="shell section">
        <h2>Free PDF, image, and QR tools</h2>
        <div class="cluster-links">
          ${landingPages.map((page) => `<a href="/${page.path}/">${escapeHtml(page.headline)}</a>`).join("")}
        </div>
        <ul>
          <li><a href="/tools/name-tracing/">Name Tracing Worksheet Generator</a></li>
          <li><a href="/tools/chore-chart/">Chore Chart Generator</a></li>
          <li><a href="/tools/reward-chart/">Reward Chart Generator</a></li>
          <li><a href="/tools/flashcards/">Flashcard Generator</a></li>
          <li><a href="/tools/weekly-planner/">Weekly Planner Generator</a></li>
          <li><a href="/tools/habit-tracker/">Habit Tracker Generator</a></li>
          <li><a href="/tools/invoice-generator/">Invoice Generator</a></li>
          <li><a href="/tools/estimate-generator/">Estimate Generator</a></li>
          <li><a href="/tools/purchase-order/">Purchase Order Generator</a></li>
          <li><a href="/tools/bill-of-sale/">Bill of Sale Generator</a></li>
          <li><a href="/tools/rent-receipt/">Rent Receipt Generator</a></li>
          <li><a href="/tools/packing-slip/">Packing Slip Generator</a></li>
          <li><a href="/tools/work-order/">Work Order Generator</a></li>
          <li><a href="/tools/inventory-sheet/">Inventory Sheet Generator</a></li>
          <li><a href="/tools/business-card/">Business Card Generator</a></li>
          <li><a href="/tools/address-labels/">Address Label Generator</a></li>
          <li><a href="/tools/price-tag/">Price Tag Generator</a></li>
          <li><a href="/tools/flyer-maker/">Flyer Maker PDF</a></li>
          <li><a href="/tools/barcode-labels/">Barcode Label Generator</a></li>
          <li><a href="/tools/coupon-maker/">Coupon Maker PDF</a></li>
          <li><a href="/tools/resume-builder/">Resume Builder PDF</a></li>
          <li><a href="/tools/cover-letter/">Cover Letter Generator</a></li>
          <li><a href="/tools/resignation-letter/">Resignation Letter Generator</a></li>
          <li><a href="/tools/monthly-calendar/">Monthly Calendar Generator</a></li>
          <li><a href="/tools/meal-planner/">Meal Planner Generator</a></li>
          <li><a href="/tools/image-to-pdf/">Image to PDF Converter</a></li>
          <li><a href="/tools/multi-image-pdf/">Multiple Images to PDF Converter</a></li>
          <li><a href="/tools/pdf-to-images/">PDF to JPG Converter</a></li>
          <li><a href="/tools/pdf-to-text/">PDF to Text Converter</a></li>
          <li><a href="/tools/pdf-to-word/">PDF to Word Converter</a></li>
          <li><a href="/tools/compress-image/">Compress Image Online</a></li>
          <li><a href="/tools/compress-image-to-kb/">Compress Image to KB</a></li>
          <li><a href="/tools/resize-image/">Resize Image Online</a></li>
          <li><a href="/tools/convert-image/">Convert Image Format</a></li>
          <li><a href="/tools/remove-background/">Remove Background Online</a></li>
          <li><a href="/tools/crop-image/">Crop Image Online</a></li>
          <li><a href="/tools/rotate-image/">Rotate Image Online</a></li>
          <li><a href="/tools/watermark-image/">Watermark Image Online</a></li>
          <li><a href="/tools/add-text-image/">Add Text to Image Online</a></li>
          <li><a href="/tools/qr-code/">Free QR Code Generator</a></li>
          <li><a href="/tools/wifi-qr-code/">WiFi QR Code Generator</a></li>
          <li><a href="/tools/vcard-qr-code/">Contact QR Code Generator</a></li>
        <li><a href="/tools/merge-pdf/">Merge PDF Tool</a></li>
          <li><a href="/tools/split-pdf/">Split PDF Tool</a></li>
          <li><a href="/tools/pdf-page-numbers/">Add Page Numbers to PDF</a></li>
          <li><a href="/tools/rotate-pdf/">Rotate PDF Pages</a></li>
          <li><a href="/tools/remove-pdf-pages/">Remove Pages from PDF</a></li>
          <li><a href="/tools/reorder-pdf-pages/">Reorder PDF Pages</a></li>
          <li><a href="/tools/watermark-pdf/">Add Watermark to PDF</a></li>
          <li><a href="/tools/stamp-pdf/">Stamp PDF Pages</a></li>
          <li><a href="/tools/sign-pdf/">Add Signature Text to PDF</a></li>
          <li><a href="/tools/text-to-pdf/">Text to PDF Converter</a></li>
          <li><a href="/tools/markdown-to-pdf/">Markdown to PDF Converter</a></li>
          <li><a href="/tools/csv-to-pdf/">CSV to PDF Table Converter</a></li>
          <li><a href="/tools/json-to-pdf/">JSON to PDF Formatter</a></li>
          <li><a href="/tools/sign-in-sheet/">Sign-in Sheet Generator</a></li>
          <li><a href="/tools/graph-paper/">Graph Paper Generator</a></li>
          <li><a href="/tools/packing-list/">Packing List Generator</a></li>
          <li><a href="/tools/receipt-generator/">Receipt Generator</a></li>
          <li><a href="/tools/timesheet-generator/">Timesheet Generator</a></li>
          <li><a href="/tools/certificate-generator/">Certificate Generator</a></li>
          <li><a href="/tools/todo-list/">To Do List Generator</a></li>
        </ul>
      </section>`,
  },
  {
    path: "tools",
    title: "Free PDF Tools",
    description: "Browse free printable PDF, image, and QR tools for compression, resizing, format conversion, QR codes, PDF edits, business paperwork, local promotion printables, labels, career documents, calendars, meal planning, worksheets, and classroom routines.",
    html: toolsIndexHtml(),
  },
  {
    path: "free-pdf-tools",
    title: "Free PDF Tools Without Signup",
    description: "Start with free browser PDF, image, and QR tools for image compression, resizing, format conversion, QR codes, image-to-PDF, text-to-PDF, Markdown-to-PDF, CSV-to-PDF, JSON-to-PDF, invoices, receipts, labels, business cards, flyers, coupons, timesheets, certificates, checklists, and printable pages.",
    html: freePdfToolsHtml(),
  },
  {
    path: "pdf-tool-finder",
    title: "Which Free PDF Tool Should I Use?",
    description: "Find the right free PDF, image, or QR tool for compression, resizing, QR codes, images, text, Markdown, CSV, JSON, invoices, receipts, labels, barcodes, flyers, coupons, timesheets, resumes, certificates, checklists, graph paper, and event sheets.",
    html: pdfToolFinderHtml(),
  },
  {
    path: "submit-directory",
    title: "PrintableTools Lab Directory Submission Pack",
    description: "Copy-ready directory submission details, screenshots, core links, and compliance notes for listing PrintableTools Lab as a free no-signup PDF, image, and QR tool site.",
    html: directorySubmissionHtml(),
  },
  {
    path: "share-kit",
    title: "PrintableTools Lab Share Kit",
    description: "Copy-ready short-video hooks, community posts, directory blurbs, campaign links, and compliance rules for sharing PrintableTools Lab without paid ads.",
    html: shareKitHtml(),
  },
  {
    path: "sponsor",
    title: "Sponsor PrintableTools Lab",
    description: "Sponsor and partner inquiry page for PrintableTools Lab, a free no-signup browser PDF, image, QR, and document utility site with ad-safe placement rules.",
    html: sponsorPageHtml(),
  },
  {
    path: "sponsor-proposal",
    title: "Sponsor Proposal",
    description: "Noindex sponsor proposal page for one policy-fit partner, with a recommended pilot deal and prefilled inquiry path.",
    index: false,
    html: `<section class="shell section"><h1>Sponsor proposal</h1><p>This direct proposal page loads a partner-specific sponsor fit, recommended deal, and prefilled inquiry form after the app loads.</p></section>`,
  },
  {
    path: "sponsor-deal-room",
    title: "Sponsor Deal Room for PrintableTools Lab",
    description: "Direct sponsor deal room with pilot pricing, fit rules, tracked sponsor paths, and the business-safe inquiry form for PrintableTools Lab.",
    html: sponsorDealRoomHtml(),
  },
  {
    path: "sponsor-call",
    title: "Sponsor Call for PrintableTools Lab",
    description: "Public sponsor call for privacy-friendly PDF, image, QR, resume, classroom, and small-business workflow partners to request a labeled pilot placement.",
    html: sponsorCallHtml(),
  },
  {
    path: "sponsor-opportunities",
    title: "Sponsor Opportunities for PrintableTools Lab",
    description: "Crawlable sponsor opportunity board for PDF API, QR marketing, resume, classroom, and small-business workflow partners interested in labeled pilot placements.",
    html: sponsorOpportunitiesHtml(),
  },
  ...SPONSOR_VERTICALS.map((vertical) => ({
    path: `sponsor/${vertical.slug}`,
    title: vertical.title,
    description: vertical.description,
    html: sponsorVerticalPageHtml(vertical),
  })),
  {
    path: "organic-push-kit",
    title: "Organic Push Kit",
    description: "Copy-ready low-risk organic distribution tasks, tracked links, trigger rules, and validation signals for growing free-tool traffic before display ads.",
    html: organicPushKitHtml(),
  },
  {
    path: "upload-error-cheatsheet",
    title: "Upload Error Cheatsheet",
    description: "Copy-ready reference for common PDF, image, JPG, PNG, resume, and email attachment upload errors with direct free no-signup tool fixes.",
    html: uploadErrorCheatsheetHtml(),
  },
  {
    path: LOCAL_SELLER_STARTER_KIT.slug,
    title: "Retired payment experiment",
    description: "This older payment experiment is retired from the public site. PrintableTools Lab is focused on free no-signup tools and future ad-supported monetization.",
    html: retiredPaidExperimentHtml("Retired seller kit experiment"),
    index: false,
  },
  {
    path: CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug,
    title: "Retired payment experiment",
    description: "This older payment experiment is retired from the public site. PrintableTools Lab is focused on free no-signup tools and future ad-supported monetization.",
    html: retiredPaidExperimentHtml("Retired custom print pack experiment"),
    index: false,
  },
  {
    path: MARKET_TABLE_PRINT_AUDIT.slug,
    title: "Retired payment experiment",
    description: "This older direct-payment experiment is retired from the public site. PrintableTools Lab is focused on free no-signup tools and future ad-supported monetization.",
    html: retiredPaidExperimentHtml("Retired print audit experiment"),
    index: false,
  },
  {
    path: SERVICE_SALES_PACK.slug,
    title: "Retired payment experiment",
    description: "This older payment experiment is retired from the public site. PrintableTools Lab is focused on free no-signup tools and future ad-supported monetization.",
    html: retiredPaidExperimentHtml("Retired service sales pack experiment"),
    index: false,
  },
  {
    path: "platform-submit-queue",
    title: "HTML5 Platform Submit Queue",
    description: "Submission order, account checklist, game assets, SDK notes, and compliance rules for the zero-domain HTML5 game monetization route.",
    html: platformSubmitQueueHtml(),
  },
  {
    path: "platform-submit-cockpit",
    title: "HTML5 Platform Submit Cockpit",
    description: "Practical cockpit for submitting zero-domain HTML5 games to ad-funded platforms, including manual gates, ZIP links, copy packs, and success signals.",
    html: platformSubmitCockpitHtml(),
  },
  {
    path: "platform-outreach-tracker",
    title: "HTML5 Platform Outreach Tracker",
    description: "Copy-ready public-contact outreach tracker, platform email drafts, form notes, and account gates for submitting the zero-domain HTML5 game package.",
    html: platformOutreachTrackerHtml(),
  },
  {
    path: "portal-submission-pack",
    title: "HTML5 Game Portal Submission Pack",
    description: "Public submission pack for zero-cost HTML5 game distribution, including playable builds, clean ZIP packages, release assets, official platform research, ad-safety rules, and manual-consent gates.",
    html: portalSubmissionPackHtml(),
  },
  {
    path: "zero-cost-monetization-map",
    title: "Zero-Cost Monetization Map",
    description: "Decision map for zero-domain monetization routes, including hosted HTML5 game platforms, Douyin and Bilibili mini-game ports, free subdomain sites, ad safety gates, and account requirements.",
    html: zeroCostMonetizationMapHtml(),
  },
  ...landingPages.map((page) => ({
    path: page.path,
    title: page.title,
    description: page.description,
    html: landingPageHtml(page),
  })),
  {
    path: "guides",
    title: "Printable Guides",
    description: "Original guides for printable worksheets, charts, planners, flashcards, and classroom resources.",
    html: guideIndexHtml(),
  },
  {
    path: "dashboard",
    title: "Local Validation Dashboard",
    description: "Local browser dashboard for PrintableTools Lab validation events.",
    index: false,
    html: `<section class="shell section"><h1>Local validation dashboard</h1><p>This page shows local browser validation events after the app loads.</p></section>`,
  },
  {
    path: "ops",
    title: "Project Operations Monitor",
    description: "Noindex operations monitor for project-level traffic, sponsor close actions, source, path, tool, game, and monetization signals.",
    index: false,
    html: `<section class="shell section"><h1>Project operations monitor</h1><p>This page loads aggregate project metrics and the sponsor close cockpit after the app loads.</p></section>`,
  },
  {
    path: "about",
    title: "About PrintableTools Lab",
    description: "PrintableTools Lab makes quick, practical PDF generators and image tools for families, small businesses, teachers, tutors, and home organizers.",
    html: `<article class="article-shell article"><h1>About PrintableTools Lab</h1><p>PrintableTools Lab makes useful printable pages and file utilities fast to make, easy to review, and practical on ordinary browsers.</p><p>The current version focuses on browser-side PDF, image, and QR work: image compression, image resizing, image format conversion, static QR codes, WiFi QR signs, contact QR codes, image-to-PDF conversion, business documents, career documents, planning pages, classroom resources, and household checklists.</p></article>`,
  },
  {
    path: "privacy",
    title: "Privacy Policy",
    description: "Privacy policy for PrintableTools Lab.",
    html: `<article class="article-shell article"><h1>Privacy Policy</h1><p>PrintableTools Lab generates PDFs in your browser. Ordinary PDF generation does not require an account and keeps form text on your device.</p><p>If you choose the optional AI idea helper, the current tool type and short form text are sent to the site's AI service only to return printable suggestions. Do not enter sensitive personal information.</p><p>The site stores local generation counts and validation events in your browser. The site's anonymous event counter may also store a normalized source label such as direct, google, github, gist, directory, share-kit, or referral. It does not store full referrer URLs in that counter.</p><p>If you submit the sponsor inquiry form, the company name, business email, website, placement interest, budget range, timeline, audience-fit note, and public-safe notes are sent to the site API for manual follow-up review. Public dashboards expose only aggregate sponsor lead counts, not contact details.</p></article>`,
  },
  {
    path: "terms",
    title: "Terms of Use",
    description: "Terms of use for PrintableTools Lab.",
    html: `<article class="article-shell article"><h1>Terms of Use</h1><p>The free printable generators are provided as-is for personal, classroom, small-business, and small-group use.</p><p>Do not use the tools to create unlawful, harmful, infringing, or misleading materials.</p><p>Generated files are starting points. Review all copy, numbers, QR links, and claims before printing, publishing, or relying on them.</p></article>`,
  },
  {
    path: "license",
    title: "AI & License Disclosure",
    description: "How PrintableTools Lab handles generated content, design assets, and licensing.",
    html: `<article class="article-shell article"><h1>AI & License Disclosure</h1><p>PrintableTools Lab uses code-driven templates and may use AI assistance during product design, wording, and template ideation.</p><p>Existing PDF merge, split, and page-number operations use the MIT-licensed pdf-lib JavaScript library in the browser. PDF-to-image rendering uses the Apache-2.0 pdf.js library, ZIP downloads use the MIT-licensed fflate library, and static QR tools use the MIT-licensed qrcode-generator JavaScript library.</p><p>The default templates avoid third-party characters, trademarked brands, and protected artwork. Users should not enter copyrighted or trademarked content they do not have permission to use.</p></article>`,
  },
  {
    path: "roadmap",
    title: "PrintableTools Lab Roadmap",
    description: "A noindex roadmap for future PrintableTools Lab product decisions after the free version is validated.",
    index: false,
    html: `<article class="article-shell article"><h1>PrintableTools Lab Roadmap</h1><p>The current product focus is a free printable, PDF, image, and QR utility site that can earn through responsible display advertising after review.</p><p>Display ads are deferred until search visibility, content quality, and policy readiness improve. Ads must never gate downloads, sit inside generator controls, or ask visitors for clicks.</p></article>`,
  },
  {
    path: "launch-kit",
    title: "Launch Kit",
    description: "Distribution copy, links, and validation steps for launching PrintableTools Lab.",
    index: false,
    html: `<article class="article-shell article"><h1>Launch Kit</h1><p>Use this page to coordinate the first distribution push. Share the homepage and tool links, then measure downloads and Search Console impressions.</p></article>`,
  },
];

const GUIDE_HINTS_FOR_LINKS = {
  "invoice-generator": ["invoice"],
  "estimate-generator": ["estimate", "quote"],
  "purchase-order": ["purchase order"],
  "bill-of-sale": ["bill of sale", "private sale"],
  "rent-receipt": ["rent receipt"],
  "business-card": ["business card", "local services"],
  "address-labels": ["address label", "mailing label"],
  "barcode-labels": ["barcode label", "SKU label"],
  "price-tag": ["price tag", "yard sale"],
  "flyer-maker": ["flyer"],
  "coupon-maker": ["coupon"],
  "packing-slip": ["packing slip", "order packing"],
  "work-order": ["work order", "service order"],
  "inventory-sheet": ["inventory", "stock count"],
  "resume-builder": ["resume", "ATS"],
  "ats-resume-checker": ["ATS", "resume", "keyword"],
  "cover-letter": ["cover letter"],
  "resignation-letter": ["resignation", "two weeks"],
  "monthly-calendar": ["monthly calendar", "calendar"],
  "meal-planner": ["meal planner", "meal plan", "grocery"],
  "image-to-pdf": ["image to PDF", "JPG to PDF"],
  "multi-image-pdf": ["multiple images", "image to PDF"],
  "compress-pdf": ["compress PDF", "reduce PDF size", "PDF compressor"],
  "pdf-to-images": ["PDF to JPG", "PDF to PNG"],
  "pdf-to-text": ["PDF to text", "extract text"],
  "pdf-to-word": ["PDF to Word", "PDF to DOCX", "Word document"],
  "compress-image": ["compress image", "image compressor", "reduce image"],
  "compress-image-to-kb": ["compress image to KB", "100KB image"],
  "resize-image": ["resize image", "image resizer"],
  "convert-image": ["convert image", "JPG to PNG", "PNG to WebP"],
  "remove-background": ["remove background", "transparent PNG", "white background"],
  "crop-image": ["crop image", "square crop", "profile photo"],
  "rotate-image": ["rotate image", "flip image", "sideways photo"],
  "watermark-image": ["watermark image", "text watermark", "sample photo"],
  "add-text-image": ["add text to image", "text on photo", "caption image"],
  "signature-png": ["signature PNG", "transparent signature", "draw signature"],
  "passport-photo": ["passport photo", "2x2 photo", "35x45 photo"],
  "qr-code": ["QR code", "static QR", "no signup"],
  "wifi-qr-code": ["WiFi QR", "guest WiFi", "printable sign"],
  "vcard-qr-code": ["contact QR", "vCard QR", "business card"],
  "merge-pdf": ["merge PDF"],
  "split-pdf": ["split PDF"],
  "pdf-page-numbers": ["page numbers"],
  "rotate-pdf": ["rotate PDF"],
  "remove-pdf-pages": ["remove pages"],
  "reorder-pdf-pages": ["reorder PDF"],
  "watermark-pdf": ["watermark"],
  "stamp-pdf": ["stamp PDF"],
  "sign-pdf": ["signature", "sign PDF"],
  "text-to-pdf": ["text to PDF"],
  "markdown-to-pdf": ["Markdown to PDF", "README to PDF"],
  "csv-to-pdf": ["CSV to PDF", "table PDF"],
  "json-to-pdf": ["JSON to PDF", "JSON formatter"],
  "sign-in-sheet": ["sign-in", "attendance sheet"],
  "graph-paper": ["graph paper", "quarter inch"],
  "packing-list": ["packing list", "travel checklist"],
  "receipt-generator": ["receipt"],
  "timesheet-generator": ["timesheet"],
  "certificate-generator": ["certificate"],
  "todo-list": ["to do list"],
  "name-tracing": ["name tracing", "preschool"],
  "chore-chart": ["chore", "routine", "job chart"],
  "reward-chart": ["reward", "sticker"],
  flashcards: ["flashcard"],
  "weekly-planner": ["weekly"],
  "habit-tracker": ["habit"],
};

const routes = [
  ...pages,
  ...tools.map((tool) => ({
    path: tool.path,
    title: tool.title,
    description: tool.description,
    html: toolHtml(tool),
  })),
  ...guides.map((guide) => ({
    path: guide.path,
    title: guide.title,
    description: guide.description,
    html: guideHtml(guide),
  })),
];

function renderRoute(route) {
  return {
    title: route.title,
    description: route.description,
    html: route.html,
    path: route.path,
  };
}

function siteUrl(pathName) {
  const suffix = pathName ? `/${pathName.replace(/^\/+|\/+$/g, "")}/` : "/";
  return `${BASE_URL}${suffix}`;
}

function toolHtml(tool) {
  const details = toolDetails(tool);
  const related = relatedGuideLinks(tool.path);
  const noun = tool.path.includes("image") && !tool.path.includes("image-to-pdf") && !tool.path.includes("multi-image-pdf") ? "image tool" : "PDF tool";
  return `
      <section class="shell tool-header">
        <a href="/tools/">All tools</a>
        <h1>${escapeHtml(tool.title)}</h1>
        <p class="lead">${escapeHtml(tool.description)}</p>
      </section>
      <section class="shell section">
        ${tool.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
        <p><a class="button" href="/${tool.path}/">Open generator</a></p>
      </section>
${freeToolDepthCtaHtml(tool)}
      <section class="shell section">
        <h2>How to use this free ${noun}</h2>
        <ol>
          ${details.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("\n")}
        </ol>
      </section>
      <section class="shell section">
        <h2>Good use cases</h2>
        <div class="grid-3">
          ${details.useCases.map((item) => `<article class="panel"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Privacy and limits</h2>
        <p>${escapeHtml(details.privacy)}</p>
        <p>${escapeHtml(details.limit)}</p>
      </section>
      <section class="shell section">
        <h2>Frequently asked questions</h2>
        <div class="faq-list">
          ${details.faq.map((item) => `<details><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`).join("\n")}
        </div>
        <p>${related.map((guide) => `<a class="tag" href="/${guide.path}/">${escapeHtml(guide.title)}</a>`).join(" ")}</p>
        ${jsonLdHtml(softwareSchema(tool))}
        ${jsonLdHtml(faqSchema(details.faq))}
      </section>`;
}

function freeToolDepthCtaHtml(tool) {
  if (!LOCAL_SELLER_FUNNEL_TOOL_PATH_SET.has(tool.path)) return "";
  const toolSlug = tool.path.replace(/^tools\//, "");
  const finderHref = `/free-pdf-tools/?utm_source=tool_cta&utm_medium=site&utm_campaign=free_tool_depth&utm_content=${encodeURIComponent(toolSlug)}`;
  const uploadHref = `/upload-limit-fixer/?utm_source=tool_cta&utm_medium=site&utm_campaign=free_tool_depth&utm_content=${encodeURIComponent(toolSlug)}`;
  return `
      <section class="shell section free-tool-depth-cta" aria-label="More free tools">
        <div>
          <p class="eyebrow">Free tool path</p>
          <h2>Need another file fix before downloading?</h2>
          <p>Keep using the free PDF, image, QR, and business paperwork tools. The current monetization path is future ads, not charging visitors for exports.</p>
        </div>
        <div class="free-tool-depth-actions">
          <a class="button" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(toolSlug)}" href="${escapeHtml(uploadHref)}">Fix upload limits</a>
          <a class="button secondary" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(toolSlug)}" href="${escapeHtml(finderHref)}">Browse more free tools</a>
          <p class="help">Downloads stay free. Future ads must stay separated from generator controls and never block a file download.</p>
        </div>
      </section>`;
}

function toolsIndexHtml() {
  return `
      <section class="shell page-title section">
        <h1>Free PDF, image, and QR tools</h1>
        <p>Choose a browser-based generator for business paperwork, job applications, image compression, image resizing, format conversion, QR codes, PDF editing, text conversion, planning pages, classroom printables, event certificates, checklists, and family routines. Each tool creates a practical PDF, image, or QR export without requiring an account.</p>
      </section>
      <section class="shell section">
        <h2>Tools by use case</h2>
        <div class="grid-2">
          ${keywordClusters.map(keywordClusterHtml).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>All generators</h2>
        <div class="grid-3">
          ${tools.map((tool) => `<article class="tool-card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a class="button" href="/${tool.path}/">Open generator</a></article>`).join("\n")}
        </div>
        ${jsonLdHtml(itemListSchema("Free PDF, image, and QR tools", tools))}
      </section>`;
}

function freePdfToolsHtml() {
  const groups = [
    {
      title: "No-upload conversion tools",
      text: "Use these when a photo, scan, QR code, existing PDF, plain text, Markdown, CSV, or JSON snippet needs to become the right file quickly. Files load in the browser instead of uploading to a converter server.",
      links: ["image-to-pdf", "multi-image-pdf", "compress-pdf", "pdf-to-images", "pdf-to-text", "pdf-to-word", "compress-image", "compress-image-to-kb", "resize-image", "convert-image", "remove-background", "crop-image", "rotate-image", "watermark-image", "add-text-image", "signature-png", "passport-photo", "qr-code", "wifi-qr-code", "vcard-qr-code", "merge-pdf", "split-pdf", "pdf-page-numbers", "rotate-pdf", "remove-pdf-pages", "reorder-pdf-pages", "watermark-pdf", "stamp-pdf", "sign-pdf", "text-to-pdf", "markdown-to-pdf", "csv-to-pdf", "json-to-pdf"],
    },
    {
      title: "Free business PDF tools",
      text: "Create simple paperwork and print assets for freelance jobs, local services, deposits, timesheets, private sales, rent payments, vendor orders, inventory labels, and quick promotions without opening a full design or accounting app.",
      links: ["invoice-generator", "estimate-generator", "purchase-order", "receipt-generator", "timesheet-generator", "bill-of-sale", "rent-receipt", "packing-slip", "work-order", "inventory-sheet", "business-card", "address-labels", "barcode-labels"],
    },
    {
      title: "Free career PDF tools",
      text: "Make a clean resume, cover letter, or resignation letter PDF without the common hidden export fee many document builders add at the end.",
      links: ["resume-builder", "ats-resume-checker", "cover-letter", "resignation-letter"],
    },
    {
      title: "Free printable planning tools",
      text: "Print simple one-page calendars, meal plans, checklists, graph paper, certificates, flyers, coupons, price tags, and routine pages for home, school, work, or events.",
      links: ["monthly-calendar", "meal-planner", "todo-list", "graph-paper", "certificate-generator", "sign-in-sheet", "packing-list", "flyer-maker", "price-tag", "coupon-maker"],
    },
  ];
  return `
      <section class="shell page-title section">
        <h1>Free PDF, image, and QR tools without signup</h1>
        <p>Open a browser-based generator, edit the sample fields, and download a practical PDF, image, or QR file. No account, no surprise download fee, and no ad interaction requirement.</p>
      </section>
      <section class="shell section">
        <h2>Start with the file job</h2>
        <div class="grid-2">
          ${groups.map((group) => `
            <article class="panel tool-directory">
              <h3>${escapeHtml(group.title)}</h3>
              <p>${escapeHtml(group.text)}</p>
              <div class="cluster-links">
                ${group.links.map((slug) => {
                  const tool = tools.find((item) => item.path === `tools/${slug}`);
                  return tool ? `<a href="/${tool.path}/">${escapeHtml(tool.title)}</a>` : "";
                }).join("")}
              </div>
            </article>
          `).join("\n")}
        </div>
      </section>
      ${uploadLimitShortcutsHtml()}
      <section class="shell section">
        <h2>Why the tools are free</h2>
        <p>The validation version is free because the project is testing which document, image, and QR jobs attract real search traffic and repeat downloads. If ads are enabled later, they should sit away from generator controls and never become a condition for downloading.</p>
        <p>For privacy-sensitive jobs, avoid entering unnecessary personal details. Image, PDF, and static QR processing stays local in the browser; optional AI suggestions are limited to generic writing fields.</p>
      </section>
      <section class="shell section">
        <h2>All free generators</h2>
        <div class="grid-3">
          ${tools.map((tool) => `<article class="tool-card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a class="button" href="/${tool.path}/">Open generator</a></article>`).join("\n")}
        </div>
        ${jsonLdHtml(itemListSchema("Free PDF, image, and QR tools without signup", tools))}
      </section>`;
}

function pdfToolFinderHtml() {
  const rows = TOOL_FINDER_ROWS.map((row) => {
    const tool = tools.find((item) => item.path === row.toolPath);
    if (!tool) return "";
    const href = row.landingPath ? `/${row.landingPath}/` : `/${tool.path}/`;
    const label = row.landingPath ? landingPages.find((page) => page.path === row.landingPath)?.headline || tool.title : tool.title;
    return `
      <tr>
        <td>${escapeHtml(row.need)}</td>
        <td><a href="${href}">${escapeHtml(label)}</a></td>
        <td>${escapeHtml(row.why)}</td>
      </tr>`;
  }).join("\n");
  const imageTools = ["compress-image", "compress-image-to-kb", "resize-image", "convert-image", "remove-background", "crop-image", "rotate-image", "watermark-image", "add-text-image", "signature-png", "passport-photo", "image-to-pdf", "multi-image-pdf", "pdf-to-images", "pdf-to-text", "pdf-to-word", "qr-code", "wifi-qr-code", "vcard-qr-code"];
  const pdfEditTools = ["compress-pdf", "merge-pdf", "split-pdf", "pdf-page-numbers", "rotate-pdf", "remove-pdf-pages", "reorder-pdf-pages", "watermark-pdf", "stamp-pdf", "sign-pdf"];
  const textDataTools = ["text-to-pdf", "markdown-to-pdf", "csv-to-pdf", "json-to-pdf"];
  const businessTools = ["invoice-generator", "estimate-generator", "receipt-generator", "purchase-order", "bill-of-sale", "rent-receipt", "timesheet-generator", "packing-slip", "work-order", "inventory-sheet", "business-card", "address-labels", "barcode-labels", "price-tag", "flyer-maker", "coupon-maker"];
  const personalTools = ["resume-builder", "ats-resume-checker", "cover-letter", "resignation-letter", "certificate-generator", "todo-list", "packing-list", "monthly-calendar", "meal-planner", "sign-in-sheet", "graph-paper"];
  return `
      <section class="shell page-title section">
        <h1>Which free PDF, image, or QR tool should I use?</h1>
        <p>Start with the job, not the template name. This finder points you to the free browser PDF, image, or QR tool that best matches the file you need right now.</p>
      </section>
      <section class="shell section">
        <h2>Quick PDF, image, and QR tool finder</h2>
        <table class="event-table">
          <thead><tr><th>What you need</th><th>Use this tool</th><th>Why it fits</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Common choices</h2>
        <div class="grid-2">
          <article class="panel">
            <h3>Invoice vs receipt</h3>
            <p>Use an invoice when you are asking someone to pay. Use a receipt when payment has already happened and you need a record.</p>
            <p><a class="button" href="/tools/invoice-generator/">Create an invoice</a> <a class="button secondary" href="/tools/receipt-generator/">Create a receipt</a></p>
          </article>
          <article class="panel">
            <h3>One image vs many images</h3>
            <p>Use the one-page image converter when layout matters on a single sheet. Use multiple images to PDF when each image should become its own page.</p>
            <p><a class="button" href="/tools/image-to-pdf/">One image PDF</a> <a class="button secondary" href="/tools/multi-image-pdf/">Multi-page PDF</a></p>
          </article>
        </div>
      </section>
      <section class="shell section">
        <h2>No-upload image and QR tools</h2>
        <div class="cluster-links">
          ${imageTools.map((slug) => {
            const tool = tools.find((item) => item.path === `tools/${slug}`);
            return tool ? `<a href="/${tool.path}/">${escapeHtml(tool.title)}</a>` : "";
          }).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>No-upload PDF edit tools</h2>
        <div class="cluster-links">
          ${pdfEditTools.map((slug) => {
            const tool = tools.find((item) => item.path === `tools/${slug}`);
            return tool ? `<a href="/${tool.path}/">${escapeHtml(tool.title)}</a>` : "";
          }).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Text and data to PDF tools</h2>
        <div class="cluster-links">
          ${textDataTools.map((slug) => {
            const tool = tools.find((item) => item.path === `tools/${slug}`);
            return tool ? `<a href="/${tool.path}/">${escapeHtml(tool.title)}</a>` : "";
          }).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Business document tools</h2>
        <div class="cluster-links">
          ${businessTools.map((slug) => {
            const tool = tools.find((item) => item.path === `tools/${slug}`);
            return tool ? `<a href="/${tool.path}/">${escapeHtml(tool.title)}</a>` : "";
          }).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Personal, school, and event tools</h2>
        <div class="cluster-links">
          ${personalTools.map((slug) => {
            const tool = tools.find((item) => item.path === `tools/${slug}`);
            return tool ? `<a href="/${tool.path}/">${escapeHtml(tool.title)}</a>` : "";
          }).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Free tool limits</h2>
        <p>The tools are designed for fast one-page PDFs and simple records. They do not replace legal, tax, accounting, or employment advice. Review every document before sending or printing it.</p>
        <p>Ads are disabled during validation and should never be used as a condition for downloading a PDF, image, or QR file.</p>
        ${jsonLdHtml(itemListSchema("PDF, image, and QR tool finder", TOOL_FINDER_ROWS.map((row) => tools.find((tool) => tool.path === row.toolPath)).filter(Boolean)))}
      </section>`;
}

function sponsorPageHtml() {
  const sponsorEmail = "partners@printable-tools-lab.pages.dev";
  const subject = encodeURIComponent("PrintableTools Lab sponsor inquiry");
  const body = encodeURIComponent([
    "Hi PrintableTools Lab,",
    "",
    "I am interested in a sponsorship or partner placement.",
    "",
    "Company / project:",
    "Website:",
    "Audience fit:",
    "Preferred placement: media kit review / directory mention / content sponsorship / other",
    "Notes:",
    "",
    "I understand that downloads must stay free, ads cannot gate files, and approval depends on fit.",
  ].join("\n"));
  const mailto = `mailto:${sponsorEmail}?subject=${subject}&body=${body}`;
  return `
      <section class="shell page-title section sponsor-hero">
        <a href="/free-pdf-tools/">Free tools</a>
        <h1>Sponsor PrintableTools Lab</h1>
        <p>PrintableTools Lab is a free no-signup browser utility site for PDF compression, image conversion, QR codes, business documents, career PDFs, upload-limit fixes, and printable planners. This page captures responsible sponsorship and partner inquiries without enabling ads or collecting payment on-site.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor-deal-room/?utm_source=sponsor-page&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=hero">Open deal room</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-inquiry">Send sponsor inquiry</a> <a class="button ghost" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
${sponsorLeadFormHtml()}
      <section class="shell section">
        <h2>What can be sponsored</h2>
        <div class="grid-3">
          <article class="panel"><h3>Tool-directory visibility</h3><p>Contextual mentions around free PDF, image, QR, document, and upload-limit workflows after fit review.</p></article>
          <article class="panel"><h3>Content sponsorship</h3><p>Useful guide or resource sponsorship for privacy-friendly file workflows, small-business paperwork, career documents, or classroom printables.</p></article>
          <article class="panel"><h3>Partner distribution</h3><p>Directory, newsletter, or community partnerships that send users to free tools without gated downloads.</p></article>
        </div>
      </section>
      <section class="shell section">
        <h2>Current public facts</h2>
        <div class="metric-grid">
          <div class="metric-tile"><strong>${tools.length}</strong><span>free tools</span></div>
          <div class="metric-tile"><strong>${guides.length}</strong><span>guides</span></div>
          <div class="metric-tile"><strong>${landingPages.length}</strong><span>landing pages</span></div>
          <div class="metric-tile"><strong>free</strong><span>no signup exports</span></div>
        </div>
        <p class="help">Aggregate usage signals are reviewed internally before any sponsor fit review. Search visibility and ad-network eligibility are still validation gates, so this is an early partner inquiry surface rather than a guaranteed media buy.</p>
      </section>
      <section class="shell section">
        <h2>Early sponsor pilots</h2>
        <div class="grid-3">
          ${SPONSOR_PLACEMENTS.map((item) => `<article class="panel"><h3>${escapeHtml(item.name)}</h3><p><strong>${escapeHtml(item.price)}</strong></p><p>${escapeHtml(item.fit)}</p><p>${escapeHtml(item.deliverable)}</p></article>`).join("\n")}
        </div>
        <p class="help">Prices are early validation anchors, not guaranteed inventory. Every placement still requires fit review and a separate external payment or agreement before any sponsor copy goes live.</p>
      </section>
      <section class="shell section">
        <h2>Sponsor pages by audience</h2>
        <p>These vertical pages make outreach clearer for partners who care about one audience instead of the whole tool library.</p>
        <div class="grid-3">
          ${SPONSOR_VERTICALS.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><p>${escapeHtml(vertical.pitch)}</p><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor/${escapeHtml(vertical.slug)}/">Open sponsor fit page</a></p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Media kit and outreach pack</h2>
        <p>The machine-readable media kit gives partners the current facts, placement rules, suggested sponsor categories, and copy-safe outreach templates.</p>
        <p><a class="button" href="/sponsor-media-kit.json">Open sponsor media kit JSON</a> <a class="button secondary" href="/sponsor-outreach-pack.json">Open outreach pack JSON</a> <a class="button ghost" href="/sponsor-deal-room.json">Open deal JSON</a></p>
      </section>
      <section class="shell section">
        <h2>Placement rules</h2>
        <ul>
          <li>Downloads stay free and cannot require an ad click, sponsor interaction, account, or payment.</li>
          <li>Sponsor copy must be clearly labeled and separated from generator controls.</li>
          <li>No gambling, adult, deceptive finance, malware, fake document, or misleading upload-service offers.</li>
          <li>No claim of guaranteed traffic, guaranteed compression, legal/tax advice, or official government acceptance.</li>
          <li>Payment, tax, bank, phone, and identity details stay in external official provider dashboards only.</li>
        </ul>
      </section>
      <section class="shell section">
        <h2>Inquiry checklist</h2>
        <p>Use the form above for a public-safe note with the company URL, audience fit, intended placement, and any policy requirements. Do not include private payment details, tax IDs, passwords, or customer files.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(mailto)}">Email fallback</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/tools.json">Open tools feed</a> <a class="button ghost" href="/privacy/">Privacy policy</a></p>
        ${jsonLdHtml({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Sponsor PrintableTools Lab",
          url: siteUrl("sponsor"),
          description: "Sponsor and partner inquiry page for PrintableTools Lab.",
          about: ["PDF tools", "image tools", "QR tools", "browser utilities", "sponsorship"],
        })}
      </section>`;
}

function sponsorDealRoomHtml() {
  const payload = sponsorDealRoomPayload();
  return `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor/">Sponsor page</a>
        <h1>Sponsor deal room for PrintableTools Lab</h1>
        <p>A direct buyer-facing room for policy-fit sponsors who want a small, manually reviewed pilot around free PDF, image, QR, career, classroom, and small-business workflows. No payment is collected here; the next step is a qualified business inquiry and manual fit review.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-inquiry">Start sponsor inquiry</a> <a class="button secondary" href="/sponsor-deal-room.json">Open deal JSON</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Available pilot deals</h2>
        <div class="grid-2">
          ${SPONSOR_DEALS.map((deal) => `<article class="panel"><h3>${escapeHtml(deal.title)}</h3><p><strong>${escapeHtml(deal.price)}</strong></p><p>${escapeHtml(deal.bestFor)}</p><p>${escapeHtml(deal.deliverable)}</p><p class="help">Needed: ${escapeHtml(deal.proofNeeded)}</p><p><a class="button" data-sponsor-deal-select ${sponsorDealPrefillAttrs(deal)} data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(deal.trackedUrl)}">Use this deal path</a></p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Best-fit sponsor categories</h2>
        <div class="grid-3">
          ${SPONSOR_VERTICALS.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><p>${escapeHtml(vertical.sponsorFit)}</p><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p><a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor/${escapeHtml(vertical.slug)}/?utm_source=sponsor-deal-room&utm_medium=organic&utm_campaign=${escapeHtml(vertical.campaign)}&utm_content=vertical-card">Open vertical fit</a></p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>What happens before money counts</h2>
        <div class="grid-3">
          <article class="panel"><h3>1. Qualified inquiry</h3><p>The sponsor submits business-safe details, website, audience fit, budget range, and timing through the form below.</p></article>
          <article class="panel"><h3>2. Manual fit review</h3><p>The placement is checked for relevance, visitor safety, label clarity, and policy exclusions before any sponsor copy is discussed.</p></article>
          <article class="panel"><h3>3. External agreement</h3><p>Revenue is real only after a signed sponsor agreement or settled external payment. Visits and clicks remain operating signals.</p></article>
        </div>
      </section>
${sponsorLeadFormHtml()}
      <section class="shell section">
        <h2>Deal-room rules</h2>
        <ul>
          ${payload.requiredReview.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("\n")}
        </ul>
        <p class="help">${escapeHtml(payload.moneyGate)}</p>
        ${jsonLdHtml({
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: "PrintableTools Lab Sponsor Deal Room",
          url: siteUrl("sponsor-deal-room"),
          itemListElement: SPONSOR_DEALS.map((deal, index) => ({
            "@type": "Offer",
            position: index + 1,
            name: deal.title,
            description: deal.deliverable,
            url: deal.trackedUrl,
          })),
        })}
      </section>`;
}

function sponsorCallHtml() {
  return `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor/">Sponsor page</a>
        <h1>Sponsor call: privacy-friendly file and printable workflows</h1>
        <p>PrintableTools Lab is accepting a small number of manually reviewed sponsor and partner inquiries for free no-signup PDF, image, QR, resume, classroom, and small-business workflows. This public call is designed so partners can respond through the sponsor form instead of private outreach email.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor-deal-room/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=primary-cta">Open deal room</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_call&utm_content=primary-cta#sponsor-inquiry">Send sponsor inquiry</a> <a class="button ghost" href="/sponsor-call.json">Open sponsor call JSON</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Current sponsor openings</h2>
        <div class="grid-3">
          ${SPONSOR_CALL_ACTIONS.map((item) => `<article class="panel"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.audience)}</p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(item.url)}">Open tracked path</a></p><p class="help">${escapeHtml(item.signal)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Audience-specific sponsor pages</h2>
        <div class="grid-3">
          ${SPONSOR_VERTICALS.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><p>${escapeHtml(vertical.pitch)}</p><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor/${escapeHtml(vertical.slug)}/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=${escapeHtml(vertical.campaign)}">Open fit page</a></p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Rules before any placement</h2>
        <ul>
          <li>Downloads stay free and cannot require ad clicks, sponsor interactions, accounts, or payment.</li>
          <li>Sponsor copy must be clearly labeled and separated from generator controls.</li>
          <li>No gambling, adult, deceptive finance, malware, fake document, or misleading upload-service offers.</li>
          <li>Revenue counts only after a qualified inquiry, signed agreement, or settled external payment is verified.</li>
          <li>Do not submit private payment, tax, phone, bank, identity, password, or customer-file details.</li>
        </ul>
        ${jsonLdHtml({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "PrintableTools Lab Sponsor Call",
          url: siteUrl("sponsor-call"),
          description: "Public sponsor call for privacy-friendly file and printable workflow partners.",
          about: ["sponsorship", "PDF tools", "QR tools", "small business paperwork", "classroom printables"],
        })}
      </section>`;
}

function sponsorOpportunitiesHtml() {
  const board = sponsorOpportunityPayload();
  return `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor-call/">Sponsor call</a>
        <h1>Sponsor opportunities for free PDF, image, and QR workflows</h1>
        <p>This board lists the current policy-fit sponsor categories for PrintableTools Lab. It is built for partners, resource pages, newsletters, and crawlers that need a concise view of the available audiences without private outreach or payment details.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(board.inquiryUrl)}">Send sponsor inquiry</a> <a class="button secondary" href="/sponsor-opportunities.json">Open opportunities JSON</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Open sponsor audiences</h2>
        <div class="grid-3">
          ${board.opportunities.map((item) => `<article class="panel"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.audience)}</p><p><strong>${escapeHtml(item.priceHint)}</strong></p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(item.trackedUrl)}">Open tracked fit page</a></p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Good-fit sponsor categories</h2>
        <div class="grid-2">
          ${board.opportunities.map((item) => `<article class="panel"><h3>${escapeHtml(item.title)}</h3><ul>${item.categories.map((category) => `<li>${escapeHtml(category)}</li>`).join("")}</ul></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Placement options</h2>
        <div class="grid-3">
          ${board.placements.map((item) => `<article class="panel"><h3>${escapeHtml(item.name)}</h3><p><strong>${escapeHtml(item.price)}</strong></p><p>${escapeHtml(item.deliverable)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Safety and revenue gate</h2>
        <ul>
          ${board.rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("\n")}
        </ul>
        <p>${escapeHtml(board.successGate)}</p>
        ${jsonLdHtml({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "PrintableTools Lab Sponsor Opportunities",
          url: siteUrl("sponsor-opportunities"),
          itemListElement: board.opportunities.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            url: item.trackedUrl,
          })),
        })}
      </section>`;
}

function sponsorVerticalPageHtml(vertical) {
  const placement = SPONSOR_PLACEMENTS.find((item) => item.id === vertical.primaryPlacementId) || SPONSOR_PLACEMENTS[0];
  const trackedUrl = sponsorVerticalTrackedUrl(vertical);
  return `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor/">All sponsor options</a>
        <h1>${escapeHtml(vertical.title)}</h1>
        <p>${escapeHtml(vertical.description)}</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-inquiry">Send sponsor inquiry</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(trackedUrl)}">Copy tracked landing link</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Audience fit</h2>
        <div class="grid-2">
          <article class="panel"><h3>Who this reaches</h3><p>${escapeHtml(vertical.audience)}</p></article>
          <article class="panel"><h3>Best sponsor fit</h3><p>${escapeHtml(vertical.sponsorFit)}</p></article>
        </div>
      </section>
      <section class="shell section">
        <h2>Pilot offer</h2>
        <div class="grid-3">
          <article class="panel"><h3>${escapeHtml(placement.name)}</h3><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p>${escapeHtml(placement.deliverable)}</p></article>
          <article class="panel"><h3>Manual approval</h3><p>Every inquiry is reviewed for relevance, policy fit, and visitor safety before sponsor copy is discussed.</p></article>
          <article class="panel"><h3>Revenue gate</h3><p>Clicks and form fills are validation. Revenue counts only after a signed agreement or settled external payment.</p></article>
        </div>
      </section>
${sponsorLeadFormHtml()}
      <section class="shell section">
        <h2>Relevant tool inventory</h2>
        <div class="cluster-links">
          ${vertical.links.map(([label, pathName]) => `<a data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/${escapeHtml(pathName)}/">${escapeHtml(label)}</a>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Good-fit sponsor categories</h2>
        <ul>
          ${vertical.sponsorCategories.map((category) => `<li>${escapeHtml(category)}</li>`).join("\n")}
        </ul>
        <p class="help">Not accepted: gambling, adult, deceptive finance, malware, fake document, misleading upload-service offers, or any placement that gates free downloads.</p>
        ${jsonLdHtml({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: vertical.title,
          url: siteUrl(`sponsor/${vertical.slug}`),
          description: vertical.description,
          about: vertical.sponsorCategories,
        })}
      </section>`;
}

function sponsorLeadFormHtml() {
  return `
      <section id="sponsor-inquiry" class="shell section">
        <div class="grid-2">
          <div>
            <h2>Sponsorship inquiry form</h2>
            <p>Share only business-safe details. The inquiry is stored for follow-up review, while public dashboards show only aggregate lead counts.</p>
            <ul>
              <li>Best fit: relevant PDF, image, QR, productivity, classroom, career, or small-business tools.</li>
              <li>Not accepted: gambling, adult, deceptive finance, malware, fake document, or misleading upload-service offers.</li>
              <li>Payment, tax, bank, phone, and private identity details stay outside this form.</li>
            </ul>
          </div>
          <form class="panel form-grid sponsor-lead-form" data-sponsor-lead-form>
            <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
            <input type="hidden" name="dealId">
            <label class="field">
              <span>Company or project</span>
              <input name="company" maxlength="90" autocomplete="organization" required>
            </label>
            <label class="field">
              <span>Business email</span>
              <input name="contactEmail" type="email" maxlength="140" autocomplete="email" required>
            </label>
            <label class="field">
              <span>Website</span>
              <input name="website" type="url" maxlength="220" placeholder="https://example.com" autocomplete="url" required>
            </label>
            <div class="grid-2 compact-form-grid">
              <label class="field">
                <span>Placement interest</span>
                <select name="placement">
                  <option value="media-kit-review">Media kit review</option>
                  <option value="directory-visibility">Directory visibility</option>
                  <option value="content-sponsorship">Content sponsorship</option>
                  <option value="partner-distribution">Partner distribution</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label class="field">
                <span>Budget range</span>
                <select name="budgetRange">
                  <option value="exploratory">Exploratory</option>
                  <option value="under-250">Under USD 250</option>
                  <option value="250-500">USD 250-500</option>
                  <option value="500-1000">USD 500-1000</option>
                  <option value="1000-plus">USD 1000+</option>
                </select>
              </label>
            </div>
            <label class="field">
              <span>Timeline</span>
              <select name="timeline">
                <option value="exploratory">Exploratory</option>
                <option value="this-week">This week</option>
                <option value="this-month">This month</option>
                <option value="later">Later</option>
              </select>
            </label>
            <label class="field">
              <span>Next step</span>
              <select name="commitment">
                <option value="question-only">Question or fit review</option>
                <option value="request-invoice">Request pilot invoice</option>
                <option value="ready-this-month">Ready to start this month</option>
              </select>
            </label>
            <label class="field">
              <span>Audience fit</span>
              <textarea name="audienceFit" maxlength="420" required placeholder="Why your product or partnership helps free PDF, image, QR, classroom, career, or small-business tool users."></textarea>
            </label>
            <label class="field">
              <span>Notes</span>
              <textarea name="notes" maxlength="1000" placeholder="Placement requirements, policy notes, geography, campaign idea, or useful public context."></textarea>
            </label>
            <p class="notice" data-sponsor-deal-status>Choose a deal above to prefill placement, budget, and timeline.</p>
            <label class="check-row">
              <input name="consent" type="checkbox" required>
              <span>I am sending a business inquiry and will not include payment, tax, private identity, passwords, or customer files.</span>
            </label>
            <div class="actions">
              <button class="button" type="submit" data-track-event="sponsor_request_intent" data-track-tool="sponsor">Send inquiry</button>
              <a class="button ghost" href="/privacy/">Privacy policy</a>
            </div>
            <p class="help sponsor-lead-status" data-sponsor-lead-status role="status" aria-live="polite">No payment is collected here. Invoice requests are reviewed manually and handled only through an external provider.</p>
          </form>
        </div>
      </section>`;
}

function directorySubmissionHtml() {
  const primaryTools = [
    "image-to-pdf",
    "multi-image-pdf",
    "compress-pdf",
    "pdf-to-images",
    "pdf-to-text",
    "pdf-to-word",
    "compress-image",
    "compress-image-to-kb",
    "resize-image",
    "convert-image",
    "remove-background",
    "crop-image",
    "rotate-image",
    "watermark-image",
    "add-text-image",
    "signature-png",
    "passport-photo",
    "qr-code",
    "wifi-qr-code",
    "vcard-qr-code",
    "merge-pdf",
    "split-pdf",
    "watermark-pdf",
    "stamp-pdf",
    "sign-pdf",
    "text-to-pdf",
    "markdown-to-pdf",
    "csv-to-pdf",
    "json-to-pdf",
    "invoice-generator",
    "receipt-generator",
    "packing-slip",
    "work-order",
    "inventory-sheet",
    "resume-builder",
    "ats-resume-checker",
    "certificate-generator",
  ].map((slug) => tools.find((item) => item.path === `tools/${slug}`)).filter(Boolean);
  const directoryFields = [
    ["Product name", "PrintableTools Lab"],
    ["URL", siteUrl("")],
    ["Category", "Files, Productivity, PDF Tools, QR Tools, Document Tools, Small Business Tools"],
    ["Pricing", "Free"],
    ["Tagline", "Free no-signup browser PDF, image, and QR tools"],
    ["Short description", "Create practical PDFs, image files, and static QR codes in the browser, including image compression, resizing, cropping, rotation, watermarking, QR codes, WiFi QR signs, contact QR codes, image-to-PDF, invoices, receipts, work orders, packing slips, inventory sheets, labels, resumes, certificates, and printable tools."],
  ];
  return `
      <section class="shell page-title section">
        <a href="/free-pdf-tools/">Free file tools</a>
        <h1>PrintableTools Lab directory submission pack</h1>
        <p>This page gives directory editors, community moderators, and launch-listing reviewers the exact facts needed to evaluate PrintableTools Lab as a free no-signup PDF, image, and QR tool collection.</p>
      </section>
      <section class="shell section">
        <h2>Copy-ready listing details</h2>
        <table class="event-table">
          <tbody>
            ${directoryFields.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Review notes</h2>
        <div class="grid-3">
          <article class="panel"><h3>No signup</h3><p>Core file tools open directly in the browser and do not require an account before export.</p></article>
          <article class="panel"><h3>Free export</h3><p>The validation version keeps PDF, image, and QR downloads free and avoids surprise checkout screens.</p></article>
          <article class="panel"><h3>Ad-safe</h3><p>Ads are disabled during validation and downloads are not gated behind ad interactions or ad impressions.</p></article>
        </div>
      </section>
      <section class="shell section">
        <h2>Primary links for reviewers</h2>
        <div class="cluster-links">
          <a href="/free-pdf-tools/">Free file tools directory</a>
          <a href="/pdf-tool-finder/">File tool finder</a>
          <a href="/tools/">All tools</a>
          <a href="/tools.json">Machine-readable tools.json</a>
          <a href="/feed.xml">RSS feed</a>
          <a href="/llms.txt">llms.txt</a>
        </div>
      </section>
      <section class="shell section">
        <h2>Representative tools</h2>
        <div class="grid-2">
          ${primaryTools.map((tool) => `<article class="tool-card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a class="button" href="/${tool.path}/">Open generator</a></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Assets</h2>
        <p>Use the icon and screenshot below for directory review. They are provided to make free-tool submissions easier to verify without inventing claims.</p>
        <div class="grid-2">
          <article class="panel"><h3>Icon</h3><p><a href="/assets/images/app-icon-512.png">512px PNG app icon</a></p></article>
          <article class="panel"><h3>Screenshot</h3><p><a href="/assets/images/free-pdf-tools-screenshot.png">Free file tools page screenshot</a></p></article>
        </div>
        ${jsonLdHtml(itemListSchema("PrintableTools Lab representative free PDF, image, and QR tools", primaryTools))}
      </section>`;
}

function uploadErrorCheatsheetHtml() {
  return `
      <section class="shell page-title section">
        <a href="/upload-limit-fixer/">Upload limit fixer</a>
        <h1>Upload error cheatsheet</h1>
        <p>A copy-ready reference for common PDF, image, JPG, PNG, resume, and email attachment upload errors. Each row links to a free no-signup browser tool and a specific landing page that explains the fix.</p>
        <p><a class="button" href="/upload-error-cheatsheet.json">Open JSON feed</a> <a class="button secondary" href="/share-kit/">Open share kit</a></p>
      </section>
      <section class="shell section">
        <h2>Common upload errors and direct fixes</h2>
        <table class="event-table">
          <thead><tr><th>Error text</th><th>Use this link</th><th>Response</th></tr></thead>
          <tbody>
            ${UPLOAD_ERROR_CHEATSHEET.map((item) => `<tr><td>${escapeHtml(item.errorText)}</td><td><a href="/${escapeHtml(item.landingPath)}/">${escapeHtml(item.format)} ${escapeHtml(item.target)}</a></td><td>${escapeHtml(item.response)}</td></tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Copy block for directories and community replies</h2>
        <p>PrintableTools Lab has a free upload error cheatsheet for common file rejections: PDF under 1MB or 500KB, image under 2MB or 500KB, photo under 100KB, JPG under 200KB, PNG screenshot too large, invalid JPG/PNG file type, 600 x 600 image dimensions, PDF not accepted JPG required, resume PDF too large, and email attachment too large.</p>
        <p><a class="button" href="/upload-limit-fixer/">Open upload limit fixer</a> <a class="button secondary" href="/free-pdf-tools/">Browse all free file tools</a></p>
      </section>
      <section class="shell section">
        <h2>Machine-readable fields</h2>
        <div class="grid-3">
          <article class="panel"><h3>JSON</h3><p><a href="/upload-error-cheatsheet.json">/upload-error-cheatsheet.json</a></p></article>
          <article class="panel"><h3>Share kit</h3><p><a href="/share-kit.json">/share-kit.json</a></p></article>
          <article class="panel"><h3>Discovery index</h3><p><a href="/discovery.json">/discovery.json</a></p></article>
        </div>
        ${jsonLdHtml(itemListSchema("Upload error cheatsheet", UPLOAD_ERROR_CHEATSHEET.map((item) => ({ title: item.errorText, path: item.landingPath }))))}
      </section>`;
}

function organicPushTaskEntry(task) {
  const baseUrl = task.absoluteUrl || siteUrl(task.linkPath);
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", task.utmSource || task.channel);
  url.searchParams.set("utm_medium", "organic");
  url.searchParams.set("utm_campaign", task.campaign);
  url.searchParams.set("utm_content", task.id);
  const trackedUrl = url.toString();
  return {
    ...task,
    trackedUrl,
    copy: task.copy.replace("{url}", trackedUrl),
  };
}

function organicPushKitHtml() {
  const tasks = ORGANIC_PUSH_TASKS.map(organicPushTaskEntry);
  return `
      <section class="shell page-title section">
        <a href="/share-kit/">Share kit</a>
        <h1>Organic push kit</h1>
        <p>Copy-ready, low-risk distribution tasks for getting real free-tool traffic before display ads. Each task has a trigger, tracked URL, success signal, and rule to avoid spam or ad-policy problems.</p>
        <p><a class="button" href="/organic-push-kit.json">Open JSON feed</a> <a class="button secondary" href="/upload-error-cheatsheet/">Open upload error cheatsheet</a></p>
      </section>
      <section class="shell section">
        <h2>Today queue</h2>
        <table class="event-table">
          <thead><tr><th>Task</th><th>Use when</th><th>Tracked URL</th><th>Success signal</th></tr></thead>
          <tbody>
            ${tasks.map((task) => `<tr><td>${escapeHtml(task.title)}<br><small>${escapeHtml(task.channel)}</small></td><td>${escapeHtml(task.trigger)}</td><td><a href="${escapeHtml(task.trackedUrl)}">${escapeHtml(task.trackedUrl)}</a></td><td>${escapeHtml(task.successSignal)}</td></tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Copy-ready tasks</h2>
        <div class="grid-2">
          ${tasks.map((task) => `<article class="panel"><h3>${escapeHtml(task.title)}</h3><p><strong>Trigger:</strong> ${escapeHtml(task.trigger)}</p><p>${escapeHtml(task.copy)}</p><p><strong>Risk rule:</strong> ${escapeHtml(task.riskRule)}</p><p><a href="${escapeHtml(task.trackedUrl)}">Open tracked link</a></p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Rules</h2>
        <ul>
          ${SHARE_KIT_RULES.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("\n")}
          <li>Stop using any channel that produces spam complaints, low-quality traffic, or no tool-depth signal.</li>
          <li>Revenue is still unproven until ad payout, platform payout, or another payment provider shows settled money.</li>
        </ul>
        ${jsonLdHtml(itemListSchema("Organic push kit tasks", tasks.map((task) => ({ title: task.title, path: "organic-push-kit" }))))}
      </section>`;
}

function shareKitHtml() {
  const featuredLinks = shareKitFeaturedLinks();
  const posts = shareKitPosts();
  const videoAssets = CAMPAIGN_VIDEO_ASSETS;
  return `
      <section class="shell page-title section">
        <a href="/submit-directory/">Directory pack</a>
        <h1>PrintableTools Lab share kit</h1>
        <p>Copy-ready zero-budget distribution assets for sharing the free PDF, image, and QR tools through directories, useful community replies, short videos, and launch updates.</p>
      </section>
      <section class="shell section">
        <h2>Priority links</h2>
        <p>These links point to high-intent pages where visitors usually have an immediate blocked upload, document, or file-format problem.</p>
        <table class="event-table">
          <thead><tr><th>Angle</th><th>Tracked URL</th><th>Why this can earn attention</th></tr></thead>
          <tbody>
            ${featuredLinks.map((item) => `<tr><td>${escapeHtml(item.title)}</td><td><a href="${escapeHtml(item.url)}">${escapeHtml(item.url)}</a></td><td>${escapeHtml(item.reason)}</td></tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Copy-ready posts</h2>
        <div class="grid-2">
          ${posts.map((post) => `<article class="panel"><h3>${escapeHtml(post.title)}</h3><p><strong>${escapeHtml(post.hook)}</strong></p><p>${escapeHtml(post.body)}</p><p><a href="${escapeHtml(post.url)}">${escapeHtml(post.cta)}</a></p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Ad-safe free-tool distribution</h2>
        <p>The current monetization path is free-tool traffic first, then responsible display ads after review. Share useful tool links, measure downloads and search exposure, and keep ads separate from generator controls.</p>
        <p><a class="button" href="/free-pdf-tools/">Browse free tools</a> <a class="button secondary" href="/organic-push-kit/">Open organic push kit</a> <a class="button ghost" href="/upload-error-cheatsheet/">Open upload error cheatsheet</a></p>
      </section>
      <section class="shell section">
        <h2>Sponsor and partner discovery</h2>
        <p>PrintableTools Lab is also accepting a small number of manually reviewed sponsor and partner inquiries. Downloads stay free, placements must be labeled, and the site does not collect payment or private payout details.</p>
        <table class="event-table">
          <thead><tr><th>Partner path</th><th>Tracked URL</th><th>Fit</th></tr></thead>
          <tbody>
            ${SPONSOR_DISCOVERY_LINKS.map((item) => `<tr><td>${escapeHtml(item.title)}</td><td><a href="${escapeHtml(item.url)}">${escapeHtml(item.url)}</a></td><td>${escapeHtml(item.reason)}</td></tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Upload error cheatsheet</h2>
        <p>This table is built for directory editors, community replies, support threads, and search crawlers that need exact upload-error wording with a direct free fix.</p>
        <table class="event-table">
          <thead><tr><th>Error</th><th>Tracked landing page</th><th>Fix</th></tr></thead>
          <tbody>
            ${UPLOAD_ERROR_CHEATSHEET.map((item) => `<tr><td>${escapeHtml(item.errorText)}</td><td><a href="${escapeHtml(`${siteUrl(item.landingPath).replace(/\/$/, "")}?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet`)}">${escapeHtml(item.landingPath)}</a></td><td>${escapeHtml(item.response)}</td></tr>`).join("\n")}
          </tbody>
        </table>
        <p><a class="button" href="/upload-error-cheatsheet.json">Open upload-error JSON</a> <a class="button secondary" href="/share-kit.json">Open share-kit.json</a></p>
      </section>
      <section class="shell section">
        <h2>Short video scripts</h2>
        <div class="grid-2">
          ${posts.filter((post) => post.channel === "short-video").map((post) => `<article class="panel"><h3>${escapeHtml(post.title)}</h3><ol><li>${escapeHtml(post.hook)}</li><li>Show the source file being rejected or too large.</li><li>${escapeHtml(post.body)}</li><li>${escapeHtml(post.cta)}.</li></ol></article>`).join("\n")}
        </div>
      </section>
      ${videoAssets.length ? `<section class="shell section">
        <h2>Ready-to-upload MP4 assets</h2>
        <p>These silent 9:16 videos are already published on the public GitHub release. Use them with the matching caption and tracked landing page; do not ask for ad interactions or imply guaranteed compression.</p>
        <div class="grid-2">
          ${videoAssets.map((asset) => `<article class="panel"><h3>${escapeHtml(asset.title)}</h3><p>${escapeHtml(asset.captionEn)}</p><p><a href="${escapeHtml(asset.downloadUrl)}">Download MP4</a></p><p><a href="${escapeHtml(asset.trackedUrl)}">Tracked landing page</a></p></article>`).join("\n")}
        </div>
      </section>` : ""}
      ${GIST_DISCOVERY?.htmlUrl ? `<section class="shell section">
        <h2>Public Gist mirror</h2>
        <p>The same high-intent links, MP4 assets, copy angles, and safe posting rules are mirrored in a public GitHub Gist for one more zero-cost external discovery surface.</p>
        <p><a class="button" href="${escapeHtml(GIST_DISCOVERY.htmlUrl)}">Open public Gist share kit</a></p>
      </section>` : ""}
      ${ISSUE_DISCOVERY?.issueUrl ? `<section class="shell section">
        <h2>Public GitHub growth issue</h2>
        <p>The open issue keeps the validation status, high-intent links, Gist mirror, release MP4 assets, and safety rules in one crawlable update thread.</p>
        <p><a class="button" href="${escapeHtml(ISSUE_DISCOVERY.issueUrl)}">Open growth issue</a></p>
      </section>` : ""}
      <section class="shell section">
        <h2>Zero-domain game experiments</h2>
        <div class="grid-2">
          ${ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => `<article class="panel">
            <h3>${escapeHtml(game.name)}</h3>
            <p>${escapeHtml(game.summary)}</p>
            <p><a class="button" href="${escapeHtml(game.url)}">Play ${escapeHtml(game.name)}</a> <a class="button secondary" href="${escapeHtml(game.repo)}">Open game repository</a></p>
            <ul>
              <li><a href="${escapeHtml(game.zipUrl)}">Download HTML5 ZIP package</a></li>
              <li><a href="${escapeHtml(game.cleanZipUrl)}">Download clean portal ZIP package</a></li>
              <li><a href="${escapeHtml(game.demoVideoUrl)}">Download 8-second demo MP4</a></li>
              <li><a href="${escapeHtml(game.coverUrl)}">Download 16:9 platform cover</a></li>
              <li><a href="${escapeHtml(game.iconUrl)}">Download 512x512 platform icon</a></li>
              <li><a href="${escapeHtml(game.socialCardUrl)}">Download social preview card</a></li>
              <li><a href="${escapeHtml(game.submissionNotesUrl)}">Open platform submission notes</a></li>
              <li><a href="${escapeHtml(game.cleanPackageReportUrl)}">Open clean portal package report</a></li>
              <li><a href="${escapeHtml(game.reviewReadinessUrl)}">Open review-readiness report</a></li>
            </ul>
          </article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Rules for safe distribution</h2>
        <ul>
          ${SHARE_KIT_RULES.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("\n")}
        </ul>
        <p><a class="button" href="/share-kit.json">Open machine-readable share-kit.json</a> <a class="button secondary" href="/submit-directory/">Open directory submission pack</a></p>
        ${jsonLdHtml(itemListSchema("PrintableTools Lab share kit priority links", featuredLinks.map((item) => ({ title: item.title, path: item.path }))))}
      </section>`;
}

function retiredPaidExperimentHtml(name) {
  return `
      <section class="shell page-title section">
        <a href="/free-pdf-tools/">Free tools</a>
        <h1>${escapeHtml(name)} has been retired</h1>
        <p>This older direct-payment experiment is no longer part of the public product path. PrintableTools Lab is staying free for visitors and is being validated for responsible display ads later.</p>
        <p><a class="button" href="/free-pdf-tools/">Browse free tools</a> <a class="button secondary" href="/upload-limit-fixer/">Fix upload limits</a> <a class="button ghost" href="/tools/">All tools</a></p>
        <p class="notice">No payment is collected here. Current monetization work is traffic, usage depth, ad policy readiness, and future ad-network payout.</p>
      </section>
      <section class="shell section">
        <h2>Use these instead</h2>
        <div class="grid-3">
          <article class="tool-card"><h3>Upload limit fixer</h3><p>Route PDF, image, JPG, PNG, and photo-size upload errors to the matching free no-signup tool.</p><a class="button" href="/upload-limit-fixer/">Open fixer</a></article>
          <article class="tool-card"><h3>Free PDF, image, and QR tools</h3><p>Browse no-signup generators for compression, conversion, QR codes, invoices, receipts, labels, resumes, and printable pages.</p><a class="button" href="/free-pdf-tools/">Browse tools</a></article>
          <article class="tool-card"><h3>Directory submission pack</h3><p>Review the public facts used for free-tool directory listings and organic discovery.</p><a class="button" href="/submit-directory/">Open pack</a></article>
        </div>
      </section>`;
}

function localSellerStarterKitHtml() {
  const product = LOCAL_SELLER_STARTER_KIT;
  const checkoutConfigured = Boolean(product.checkoutUrl);
  const checkoutRequestUrl = productCheckoutRequestUrl(product);
  const checkoutEmailUrl = productCheckoutEmailUrl(product);
  const primaryCheckoutUrl = checkoutConfigured ? product.checkoutUrl : checkoutRequestUrl;
  const primaryCheckoutText = checkoutConfigured ? `Buy for $${product.priceUsd}` : "Request checkout link";
  const primaryCheckoutEvent = checkoutConfigured ? "seller_checkout_click" : "seller_checkout_intent";
  const heroActions = [
    `<a class="button" data-seller-kit-checkout data-track-event="${primaryCheckoutEvent}" data-track-tool="${escapeHtml(product.id)}" href="${escapeHtml(primaryCheckoutUrl)}">${primaryCheckoutText}</a>`,
    `<a class="button secondary" data-track-event="seller_sample_download" data-track-tool="${escapeHtml(product.id)}" href="/${escapeHtml(product.publicSamplePath)}" download>Download sample ZIP</a>`,
    `<a class="button ghost" href="/${escapeHtml(product.publicRequestPath)}" download>Download request template</a>`,
    checkoutEmailUrl ? `<a class="button ghost" data-track-event="seller_checkout_intent" data-track-tool="${escapeHtml(product.id)}" href="${escapeHtml(checkoutEmailUrl)}">Email checkout request</a>` : "",
    `<a class="button ghost" data-track-event="service_offer_click" data-track-tool="${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.id)}" href="/${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)}/">Done-for-you setup</a>`,
    `<a class="button ghost" href="/tools/price-tag/">Try the free price tag tool</a>`,
  ].filter(Boolean).join("\n          ");
  return `
      <section class="shell page-title section product-hero">
        <a href="/free-pdf-tools/">Free tools</a>
        <h1>${escapeHtml(product.headline)}</h1>
        <p>${escapeHtml(product.description)}</p>
        <div class="hero-actions">
          ${heroActions}
        </div>
        <p class="notice" data-seller-kit-status>${checkoutConfigured ? "Checkout is configured through the external payment provider linked above." : "Checkout link pending: buyers can request a checkout link now, but no payment is collected here until a real Gumroad, Payhip, Ko-fi, or Stripe Payment Link is connected."}</p>
        <div class="hero-proof" aria-label="Digital product readiness">
          <div class="proof-tile"><strong>$${product.priceUsd}</strong><span>starter price</span></div>
          <div class="proof-tile"><strong>${product.contents.length}</strong><span>editable assets</span></div>
          <div class="proof-tile"><strong>0</strong><span>private payout data stored</span></div>
        </div>
      </section>
      <section class="shell section">
        <h2>What the buyer gets</h2>
        <div class="grid-3">
          ${product.contents.map((item) => `<article class="panel"><h3>${escapeHtml(item)}</h3><p>Plain editable CSV, Markdown, HTML, or text content designed for fast customization and printing.</p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Use it with the free generators</h2>
        <div class="grid-3">
          ${product.freeTools.map((toolPath) => {
            const tool = tools.find((item) => item.path === toolPath);
            return tool ? `<article class="tool-card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a class="button" href="/${tool.path}/">Open generator</a></article>` : "";
          }).join("\n")}
        </div>
      </section>
      <section class="shell section" id="checkout-setup">
        <h2>Checkout setup</h2>
        <p>This page is ready for a real payment link, but it does not fake a checkout. Until the payment link is connected, the public request link captures buyer intent without taking money. Create a product in Gumroad, Payhip, Ko-fi, or Stripe Payment Links, upload the full ZIP from <code>${escapeHtml(product.privatePackagePath)}</code>, then set the public checkout URL in <code>PUBLIC_SELLER_KIT_CHECKOUT_URL</code> or <code>site-config.js</code>.</p>
        <pre class="code-block">${escapeHtml(checkoutCopy(product))}</pre>
      </section>
      <section class="shell section">
        <h2>Want it assembled for you?</h2>
        <p>The $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} ${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.name)} service is a manual request path for buyers who want one simple starter pack prepared from their own items, prices, and contact link.</p>
        <p><a class="button" href="/${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)}/">Request the done-for-you setup</a></p>
      </section>
      <section class="shell section">
        <h2>Risk controls</h2>
        <ul>${product.riskControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p><strong>Money gate:</strong> ${escapeHtml(product.successGate)}</p>
        ${jsonLdHtml(productSchema(product))}
      </section>
      <script>
        (function () {
          var config = window.PTL_CONFIG || {};
          var checkoutUrl = config.sellerKitCheckoutUrl || config.checkoutUrl || "";
          var button = document.querySelector("[data-seller-kit-checkout]");
          var status = document.querySelector("[data-seller-kit-status]");
          if (!checkoutUrl || !button) return;
          button.href = checkoutUrl;
          button.textContent = "Buy for $${product.priceUsd}";
          button.dataset.trackEvent = "seller_checkout_click";
          if (status) status.textContent = "Checkout is configured through the external payment provider linked above.";
        }());
      </script>`;
}

function checkoutCopy(product) {
  return [
    `Product name: ${product.name}`,
    `Price: $${product.priceUsd} ${product.currency}`,
    `Short description: ${product.shortDescription}`,
    `Upload file: ${product.privatePackagePath}`,
    `Sample file: ${siteUrl(product.publicSamplePath).replace(/\/$/, "")}`,
    `Buyer request template: ${siteUrl(product.publicRequestPath).replace(/\/$/, "")}`,
    `Buyer request link: ${productCheckoutRequestUrl(product)}`,
    ...(productCheckoutEmailUrl(product) ? [`Email request link: ${productCheckoutEmailUrl(product)}`] : []),
    "Delivery note: Buyer receives editable CSV, Markdown, HTML, and text templates for their own local-selling workflow.",
  ].join("\n");
}

function customLocalPrintPackServiceHtml() {
  const service = CUSTOM_LOCAL_PRINT_PACK_SERVICE;
  const requestUrl = serviceRequestUrl(service);
  const emailUrl = serviceRequestEmailUrl(service);
  const pipeline = serviceOrderPipeline(service);
  const orderAssets = [
    ["Structured request form", service.issueFormUrl],
    ["Payment-before-work reply", `/${service.publicPaymentReplyPath}`],
    ["Fulfillment checklist", `/${service.publicFulfillmentChecklistPath}`],
    ["Order pipeline JSON", `/${service.publicOrderPipelinePath}`],
    ["Manual outreach queue", `/${service.publicOutreachQueuePath}`],
    ["Copy/paste outreach batch", `/${service.publicOutreachBatchPath}`],
    ["Sample delivery ZIP", `/${service.publicSampleDeliveryPath}`],
    ["Delivery input example", `/${service.publicDeliveryInputExamplePath}`],
    ["Sample delivery report", `/${service.publicDeliveryReportPath}`],
  ];
  const actions = [
    `<a class="button" data-track-event="service_request_intent" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(requestUrl)}">Request service checkout</a>`,
    `<a class="button secondary" data-track-event="service_request_intent" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(service.issueFormUrl)}">Open structured request form</a>`,
    `<a class="button secondary" data-track-event="audit_request_intent" data-track-tool="${escapeHtml(MARKET_TABLE_PRINT_AUDIT.id)}" href="/${escapeHtml(MARKET_TABLE_PRINT_AUDIT.slug)}/">Start with free audit</a>`,
    `<a class="button secondary" href="/${escapeHtml(service.publicRequestPath)}" download>Download service brief</a>`,
    emailUrl ? `<a class="button ghost" data-track-event="service_request_intent" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(emailUrl)}">Email service request</a>` : "",
    `<a class="button ghost" href="/${escapeHtml(service.publicOrderPipelinePath)}">Open order pipeline</a>`,
    `<a class="button ghost" href="/${escapeHtml(service.publicSampleDeliveryPath)}">Download sample delivery</a>`,
    `<a class="button ghost" href="/${escapeHtml(LOCAL_SELLER_STARTER_KIT.slug)}/">See the $${LOCAL_SELLER_STARTER_KIT.priceUsd} template kit</a>`,
  ].filter(Boolean).join("\n          ");
  return `
      <section class="shell page-title section product-hero">
        <a href="/${escapeHtml(LOCAL_SELLER_STARTER_KIT.slug)}/">Seller starter kit</a>
        <h1>${escapeHtml(service.headline)}</h1>
        <p>${escapeHtml(service.description)}</p>
        <div class="hero-actions">
          ${actions}
        </div>
        <p class="notice">Manual service checkout pending: this page captures buyer intent only. No payment is collected here until a real Gumroad, Payhip, Ko-fi, Stripe, or invoice checkout link is sent and paid.</p>
        <div class="hero-proof" aria-label="Service readiness">
          <div class="proof-tile"><strong>$${service.priceUsd}</strong><span>setup price</span></div>
          <div class="proof-tile"><strong>${service.deliverables.length}</strong><span>deliverables</span></div>
          <div class="proof-tile"><strong>2 days</strong><span>target turnaround</span></div>
        </div>
      </section>
      <section class="shell section">
        <h2>What gets delivered</h2>
        <div class="grid-3">
          ${service.deliverables.map((item) => `<article class="panel"><h3>${escapeHtml(item)}</h3><p>Delivered as editable text, CSV, or copy blocks the buyer can review, paste into the free generators, and print.</p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Buyer details needed</h2>
        <ul>${service.buyerInputs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p><a class="button" href="/${escapeHtml(service.publicRequestPath)}" download>Download the request brief</a> <a class="button secondary" href="/${escapeHtml(MARKET_TABLE_PRINT_AUDIT.slug)}/">Get a free print audit first</a></p>
      </section>
      <section class="shell section">
        <h2>Order pipeline assets</h2>
        <p>Use these when a request arrives: confirm fit, send a real external checkout link, wait for paid_order_verified, then build and deliver the pack.</p>
        <table class="event-table">
          <thead><tr><th>Asset</th><th>URL</th></tr></thead>
          <tbody>${orderAssets.map(([label, url]) => `<tr><th>${escapeHtml(label)}</th><td><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></td></tr>`).join("\n")}</tbody>
        </table>
        <p>After a real external provider shows paid_order_verified, generate the private customer ZIP with <code>npm.cmd run service:delivery -- --input path/to/paid-order.json</code>. The output stays under <code>paid-deliverables/service-orders/</code>, which is ignored by git.</p>
        <ol>${pipeline.statuses.map((status) => `<li><strong>${escapeHtml(status.id)}</strong>: ${escapeHtml(status.ownerAction)} <em>${escapeHtml(status.moneyRule)}</em></li>`).join("")}</ol>
      </section>
      <section class="shell section">
        <h2>Use the finished pack with these free tools</h2>
        <div class="grid-3">
          ${service.relatedTools.map((toolPath) => {
            const tool = tools.find((item) => item.path === toolPath);
            return tool ? `<article class="tool-card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a class="button" href="/${tool.path}/">Open generator</a></article>` : "";
          }).join("\n")}
        </div>
      </section>
      ${serviceRequestBuilderHtml(service)}
      <section class="shell section">
        <h2>Risk controls</h2>
        <ul>${service.riskControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p><strong>Money gate:</strong> ${escapeHtml(service.successGate)}</p>
        ${jsonLdHtml(serviceSchema(service))}
      </section>`;
}

function marketTablePrintAuditHtml() {
  const audit = MARKET_TABLE_PRINT_AUDIT;
  const requestUrl = marketTableAuditRequestUrl(audit);
  const checklist = marketTableAuditChecklist(audit);
  const toolCards = audit.freeToolPaths.map((toolPath) => {
    const tool = tools.find((item) => item.path === toolPath);
    return tool ? `<article class="tool-card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a class="button" href="/${tool.path}/">Open free tool</a></article>` : "";
  }).join("\n");
  return `
      <section class="shell page-title section product-hero">
        <a href="/${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)}/">Done-for-you setup</a>
        <h1>${escapeHtml(audit.headline)}</h1>
        <p>${escapeHtml(audit.description)}</p>
        <div class="hero-actions">
          <a class="button" data-track-event="audit_request_intent" data-track-tool="${escapeHtml(audit.id)}" href="${escapeHtml(requestUrl)}">Request free audit</a>
          <a class="button secondary" data-track-event="audit_request_intent" data-track-tool="${escapeHtml(audit.id)}" href="${escapeHtml(audit.issueFormUrl)}">Open structured audit form</a>
          <a class="button ghost" href="/${escapeHtml(audit.publicRequestPath)}" download>Download audit request template</a>
          <a class="button ghost" href="/${escapeHtml(audit.publicChecklistPath)}">Open audit checklist JSON</a>
        </div>
        <p class="notice">This free audit captures buyer intent only. It does not collect payment and does not count as revenue. The optional $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup starts only after fit is confirmed and a real external checkout is paid.</p>
        <div class="hero-proof" aria-label="Audit readiness">
          <div class="proof-tile"><strong>free</strong><span>audit request</span></div>
          <div class="proof-tile"><strong>${audit.auditQuestions.length}</strong><span>print checks</span></div>
          <div class="proof-tile"><strong>$${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd}</strong><span>optional upgrade</span></div>
        </div>
      </section>
      <section class="shell section">
        <h2>What the audit checks</h2>
        <div class="grid-3">
          ${audit.auditQuestions.map((item) => `<article class="panel"><h3>${escapeHtml(item)}</h3><p>Use this as practical pre-print feedback before making more signs, tags, flyers, coupons, or pickup notes.</p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Start free with these tools</h2>
        <div class="grid-3">${toolCards}</div>
      </section>
      ${marketTableAuditRequestBuilderHtml(audit)}
      <section class="shell section">
        <h2>Upgrade path</h2>
        <ol>${checklist.upgradePath.map((status) => `<li><strong>${escapeHtml(status)}</strong></li>`).join("")}</ol>
        <p><a class="button" href="/${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)}/">See the $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} done-for-you setup</a></p>
      </section>
      <section class="shell section" id="audit-request">
        <h2>Audit request copy</h2>
        <p>Copy this into GitHub, email, a contact form, or a public-safe message. Treat it as validation only until a separate real payment provider proves a paid order.</p>
        <pre class="code-block">${escapeHtml(marketTableAuditRequestCopy(audit))}</pre>
      </section>
      <section class="shell section">
        <h2>Risk controls</h2>
        <ul>${audit.riskControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p><strong>Money gate:</strong> ${escapeHtml(audit.moneyGate)}</p>
        ${jsonLdHtml(itemListSchema(audit.name, audit.auditQuestions.map((item) => ({ title: item, path: audit.slug }))))}
      </section>`;
}

function serviceSalesPackHtml() {
  const pack = SERVICE_SALES_PACK;
  const service = CUSTOM_LOCAL_PRINT_PACK_SERVICE;
  const pipeline = serviceOrderPipeline(service);
  const orderAssets = [
    ["Structured request form", pack.issueFormUrl],
    ["Request brief", pack.githubPagesRequestBriefUrl],
    ["Payment-before-work reply", pack.githubPagesPaymentReplyUrl],
    ["Fulfillment checklist", pack.githubPagesFulfillmentChecklistUrl],
    ["Order pipeline JSON", pack.githubPagesOrderPipelineUrl],
    ["Manual outreach queue", pack.githubPagesOutreachQueueUrl],
    ["Copy/paste outreach batch", pack.githubPagesOutreachBatchUrl],
    ["Sample delivery ZIP", pack.githubPagesSampleDeliveryUrl],
    ["Delivery input example", pack.githubPagesDeliveryInputExampleUrl],
    ["Sample delivery report", pack.githubPagesDeliveryReportUrl],
  ];
  return `
      <section class="shell page-title section">
        <a href="/${escapeHtml(service.slug)}/">Paid service</a>
        <h1>${escapeHtml(pack.headline)}</h1>
        <p>${escapeHtml(pack.shortDescription)}</p>
        <p><a class="button" href="${escapeHtml(pack.githubPagesServiceUrl)}">Open live GitHub Pages service page</a> <a class="button secondary" href="https://yanqr213.github.io/printable-tools-lab/${escapeHtml(MARKET_TABLE_PRINT_AUDIT.slug)}/">Open free audit lead magnet</a> <a class="button secondary" href="/service-sales-pack.json">Open machine-readable sales pack</a></p>
      </section>
      <section class="shell section">
        <h2>Tracked links</h2>
        <table class="event-table">
          <thead><tr><th>Use</th><th>URL</th></tr></thead>
          <tbody>${pack.trackedLinks.map(([label, url]) => `<tr><th>${escapeHtml(label)}</th><td><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></td></tr>`).join("\n")}</tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Copy-ready outreach</h2>
        <div class="grid-2">
          ${pack.outreachScripts.map((script) => `<article class="panel"><h3>${escapeHtml(script.title)}</h3><p>${escapeHtml(script.message)}</p><p><strong>${escapeHtml(script.cta)}</strong></p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Listing fields</h2>
        <table class="event-table">
          <tbody>${pack.listingFields.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("\n")}</tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Order pipeline assets</h2>
        <p>These are the operational links to turn an interested reply into a paid, externally verified service order without collecting payment details in this repository.</p>
        <table class="event-table">
          <thead><tr><th>Asset</th><th>URL</th></tr></thead>
          <tbody>${orderAssets.map(([label, url]) => `<tr><th>${escapeHtml(label)}</th><td><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></td></tr>`).join("\n")}</tbody>
        </table>
        <p>Private delivery command after paid_order_verified: <code>npm.cmd run service:delivery -- --input path/to/paid-order.json</code>. Public sample files show the deliverable structure, not real revenue.</p>
        <ol>${pipeline.statuses.map((status) => `<li><strong>${escapeHtml(status.id)}</strong>: ${escapeHtml(status.moneyRule)}</li>`).join("")}</ol>
      </section>
      <section class="shell section">
        <h2>Manual execution checklist</h2>
        <ol>${pack.executionChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
      </section>
      <section class="shell section">
        <h2>Risk controls</h2>
        <ul>${pack.riskControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p><strong>Money gate:</strong> ${escapeHtml(service.successGate)}</p>
        ${jsonLdHtml(itemListSchema(pack.name, pack.outreachScripts.map((script) => ({ title: script.title, path: pack.slug }))))}
      </section>`;
}

function productSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    url: siteUrl(product.slug),
    isRelatedTo: product.freeTools.map((toolPath) => ({
      "@type": "SoftwareApplication",
      name: tools.find((tool) => tool.path === toolPath)?.title || toolPath,
      url: siteUrl(toolPath),
    })),
    offers: {
      "@type": "Offer",
      price: String(product.priceUsd),
      priceCurrency: product.currency,
      availability: product.checkoutUrl ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url: product.checkoutUrl || siteUrl(product.slug),
    },
  };
}

function serviceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    url: siteUrl(service.slug),
    areaServed: "Online",
    provider: {
      "@type": "Organization",
      name: SITE_SUMMARY.name,
      url: siteUrl(""),
    },
    offers: {
      "@type": "Offer",
      price: String(service.priceUsd),
      priceCurrency: service.currency,
      availability: "https://schema.org/PreOrder",
      url: siteUrl(service.slug),
    },
  };
}

function platformSubmitQueueHtml() {
  return `
      <section class="shell page-title section">
        <a href="/share-kit/">Share kit</a>
        <h1>HTML5 platform submit queue</h1>
        <p>This queue keeps the zero-domain game submission path operational: which platform to submit first, which game to upload, which assets to use, and which ad-safety notes to include.</p>
        <p><a class="button" href="/platform-submit-cockpit/">Open submit cockpit</a> <a class="button secondary" href="/platform-submit-queue.json">Open machine-readable queue</a></p>
      </section>
      <section class="shell section">
        <h2>Zero-domain decision</h2>
        <p>${escapeHtml(ZERO_DOMAIN_PLATFORM_STRATEGY.currentDecision)}</p>
        <div class="panel">
          <h3>Latest operational status</h3>
          <ul>${ZERO_DOMAIN_PLATFORM_STRATEGY.latestOperationalStatus.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="grid-3">
          <article class="panel">
            <h3>Why this can work without a domain</h3>
            <ul>${ZERO_DOMAIN_PLATFORM_STRATEGY.whyNoDomainCanStillWork.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
          <article class="panel">
            <h3>Immediate route</h3>
            <ul>${ZERO_DOMAIN_PLATFORM_STRATEGY.immediateRoute.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
          <article class="panel">
            <h3>Parked routes</h3>
            <ul>${ZERO_DOMAIN_PLATFORM_STRATEGY.parkedRoutes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
        </div>
      </section>
      <section class="shell section">
        <h2>Recommended submission order</h2>
        <div class="grid-3">
          ${PLATFORM_SUBMIT_QUEUE.map((item) => `<article class="panel">
            <h3>${escapeHtml(item.priority)}. ${escapeHtml(item.platform)}</h3>
            <p>${escapeHtml(item.rationale)}</p>
            <p><strong>Account:</strong> ${escapeHtml(item.accountRequired)}</p>
            <p><strong>Current gate:</strong> ${escapeHtml(item.currentGate || "Account login may be required before upload.")}</p>
            <p><a class="button" href="${escapeHtml(item.submissionUrl)}">Open ${escapeHtml(item.platform)}</a></p>
            ${item.docsUrl ? `<p><a href="${escapeHtml(item.docsUrl)}">Open official docs</a></p>` : ""}
          </article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Game packages ready for upload</h2>
        <div class="grid-2">
          ${ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => `<article class="panel">
            <h3>${escapeHtml(game.name)}</h3>
            <p>${escapeHtml(game.summary)}</p>
            <ul>
              <li><a href="${escapeHtml(game.url)}">Live game</a></li>
              <li><a href="${escapeHtml(game.zipUrl)}">HTML5 ZIP</a></li>
              <li><a href="${escapeHtml(game.cleanZipUrl)}">Clean portal ZIP</a></li>
              <li><a href="${escapeHtml(game.demoVideoUrl)}">Demo MP4</a></li>
              <li><a href="${escapeHtml(game.coverUrl)}">16:9 cover</a></li>
              <li><a href="${escapeHtml(game.iconUrl)}">512 icon</a></li>
              <li><a href="${escapeHtml(game.submissionNotesUrl)}">Submission notes</a></li>
              <li><a href="${escapeHtml(game.cleanPackageReportUrl)}">Clean portal package report</a></li>
              <li><a href="${escapeHtml(game.submissionCopyUrl || game.submissionNotesUrl)}">Copy-ready platform fields</a></li>
              <li><a href="${escapeHtml(game.reviewReadinessUrl)}">Review-readiness report</a></li>
              <li><a href="${escapeHtml(game.repo)}">Repository</a></li>
            </ul>
          </article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Submission fields checklist</h2>
        <table class="event-table">
          <thead><tr><th>Platform</th><th>Games</th><th>Required fields</th><th>Ad safety note</th></tr></thead>
          <tbody>
            ${PLATFORM_SUBMIT_QUEUE.map((item) => `<tr>
              <td>${escapeHtml(item.platform)}</td>
              <td>${escapeHtml(item.submitGames.join(", "))}</td>
              <td>${escapeHtml(item.requiredFields.join(", "))}</td>
              <td>${escapeHtml(item.adPolicyNote)}</td>
            </tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Gate rules</h2>
        <ul>
          <li>Do not enable ads in standalone builds.</li>
          <li>Do not ask users to interact with ads or interact with ads for external rewards.</li>
          <li>Submit Neon Lane Dash first because its lane-reflex loop is broader than the file-sorting theme.</li>
          <li>Submit Upload Limit Panic second as a differentiated puzzle/sorting title.</li>
          <li>If both are rejected for quality, improve controls and visual feedback before building a third game.</li>
        </ul>
        <p><strong>Money gate:</strong> ${escapeHtml(ZERO_DOMAIN_PLATFORM_STRATEGY.moneyGate)}</p>
        <p><strong>Account checklist:</strong> ${escapeHtml(ZERO_DOMAIN_PLATFORM_STRATEGY.accountsNeeded.join(" "))}</p>
        <ul>
          ${ZERO_DOMAIN_PLATFORM_STRATEGY.officialEvidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>`;
}

function platformSubmitCockpitHtml() {
  return `
      <section class="shell page-title section">
        <a href="/platform-submit-queue/">Platform submit queue</a>
        <h1>HTML5 platform submit cockpit</h1>
        <p>This cockpit turns the zero-domain game route into the next concrete actions: which dashboard to open, which ZIP to upload, what still cannot be automated, and what counts as a real progress signal.</p>
        <p><a class="button" href="/platform-submit-cockpit.json">Open machine-readable cockpit</a> <a class="button secondary" href="/platform-outreach-tracker/">Open outreach tracker</a></p>
      </section>
      <section class="shell section">
        <h2>Operating truth</h2>
        <div class="grid-3">
          <article class="panel">
            <h3>Objective</h3>
            <p>${escapeHtml(PLATFORM_SUBMIT_COCKPIT.objective)}</p>
            <p><strong>Lead game:</strong> ${escapeHtml(PLATFORM_SUBMIT_COCKPIT.leadGame)}</p>
            <p><strong>Backup:</strong> ${escapeHtml(PLATFORM_SUBMIT_COCKPIT.backupGame)}</p>
          </article>
          <article class="panel">
            <h3>Manual gates</h3>
            <ul>${PLATFORM_SUBMIT_COCKPIT.notAutomatable.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
          <article class="panel">
            <h3>Morning expectation</h3>
            <p>${escapeHtml(PLATFORM_SUBMIT_COCKPIT.morningExpectation)}</p>
          </article>
        </div>
        <div class="panel">
          <h3>Latest operational status</h3>
          <p><strong>Last updated:</strong> ${escapeHtml(PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.lastUpdated)}</p>
          <p><strong>Submitted:</strong></p>
          <ul>${PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.submitted.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <p><strong>Ready backup:</strong></p>
          <ul>${PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.readyBackup.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          ${PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.trafficSignals ? `<p><strong>Traffic signals:</strong></p><ul>${PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.trafficSignals.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
          <p><strong>Blocked:</strong></p>
          <ul>${PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.blocked.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <p><strong>Status check gates:</strong></p>
          <ul>${PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.statusCheckGates.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <p><strong>Payout gates:</strong></p>
          <ul>${PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.payoutGates.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <p>${escapeHtml(PLATFORM_SUBMIT_COCKPIT.latestOperationalStatus.notRevenueYet)}</p>
        </div>
      </section>
      <section class="shell section">
        <h2>Ready assets</h2>
        <table class="event-table">
          <tbody>
            ${Object.entries(PLATFORM_SUBMIT_COCKPIT.readyAssets).map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td><a href="${escapeHtml(value)}">${escapeHtml(value)}</a></td></tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Next submissions</h2>
        <div class="grid-2">
          ${PLATFORM_SUBMIT_COCKPIT.checklist.map((item) => `<article class="panel">
            <h3>${escapeHtml(item.rank)}. ${escapeHtml(item.platform)}</h3>
            <p><strong>Status:</strong> ${escapeHtml(item.currentStatus)} / ${escapeHtml(item.automationLevel)}</p>
            <p><strong>Next action:</strong> ${escapeHtml(item.nextAction)}</p>
            <p><strong>Why now:</strong> ${escapeHtml(item.whyNow)}</p>
            <p><strong>Use game:</strong> ${escapeHtml(item.useGame)}</p>
            <p><a class="button" href="${escapeHtml(item.uploadZip)}">Download ZIP</a> <a class="button secondary" href="${escapeHtml(item.copyPack)}">Open copy pack</a></p>
            <p><strong>Success signal:</strong> ${escapeHtml(item.successSignal)}</p>
            <p><strong>Risk control:</strong> ${escapeHtml(item.riskControl)}</p>
            <details><summary>Manual requirements</summary><ul>${item.manualRequirements.map((need) => `<li>${escapeHtml(need)}</li>`).join("")}</ul></details>
          </article>`).join("\n")}
        </div>
      </section>`;
}

function platformOutreachTrackerHtml() {
  return `
      <section class="shell page-title section">
        <a href="/platform-submit-queue/">Platform submit queue</a>
        <h1>HTML5 platform outreach tracker</h1>
        <p>This tracker keeps public-contact submissions moving even when developer dashboards require login, verification, or payout setup.</p>
        <p><a class="button" href="/platform-outreach-tracker.json">Open machine-readable tracker</a> <a class="button secondary" href="/platform-submit-queue/">Open submit queue</a></p>
      </section>
      <section class="shell section">
        <h2>Operating rules</h2>
        <div class="panel">
          <h3>Latest operational status</h3>
          <ul>${PLATFORM_OUTREACH_TRACKER.latestOperationalStatus.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <ul>${PLATFORM_OUTREACH_TRACKER.rules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="shell section">
        <h2>Public-contact channels</h2>
        <div class="grid-2">
          ${PLATFORM_OUTREACH_TRACKER.channels.map((channel) => `<article class="panel">
            <h3>${escapeHtml(channel.priority)}. ${escapeHtml(channel.platform)}</h3>
            <p><strong>Status:</strong> ${escapeHtml(channel.status)}</p>
            <p><strong>Method:</strong> ${escapeHtml(channel.method)}</p>
            <p><strong>Contact:</strong> ${escapeHtml(channel.contact)}</p>
            <p><strong>Next:</strong> ${escapeHtml(channel.nextAction)}</p>
            <p><a class="button" href="${escapeHtml(channel.submissionUrl)}">Open submission entry</a></p>
            <p>${escapeHtml(channel.evidence)}</p>
          </article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Copy-ready outreach</h2>
        <div class="grid-2">
          ${PLATFORM_OUTREACH_TRACKER.channels.map((channel) => `<article class="panel">
            <h3>${escapeHtml(channel.platform)}</h3>
            <p><strong>Subject:</strong> ${escapeHtml(channel.subject)}</p>
            <pre class="code-block">${escapeHtml(channel.body)}</pre>
          </article>`).join("\n")}
        </div>
      </section>`;
}

function portalSubmissionPackHtml() {
  const leadGame = ZERO_DOMAIN_GAME_EXPERIMENTS.find((game) => game.name === PORTAL_SUBMISSION_PACK.leadGame) || ZERO_DOMAIN_GAME_EXPERIMENTS[0];
  return `
      <section class="shell page-title section">
        <a href="/platform-submit-cockpit/">Platform submit cockpit</a>
        <h1>HTML5 game portal submission pack</h1>
        <p>${escapeHtml(PORTAL_SUBMISSION_PACK.purpose)}</p>
        <p><strong>Lead:</strong> ${escapeHtml(PORTAL_SUBMISSION_PACK.leadGame)} | <strong>Backup:</strong> ${escapeHtml(PORTAL_SUBMISSION_PACK.backupGame)}</p>
        <p><a class="button" href="/portal-submission-pack.json">Open machine-readable pack</a> <a class="button secondary" href="${escapeHtml(leadGame?.cleanZipUrl || ZERO_DOMAIN_GAME_EXPERIMENT.cleanZipUrl)}">Download lead clean ZIP</a>${leadGame?.gameSnacksZipUrl ? ` <a class="button secondary" href="${escapeHtml(leadGame.gameSnacksZipUrl)}">Download GameSnacks ZIP</a>` : ""}</p>
      </section>
      <section class="shell section">
        <h2>Current decision</h2>
        <p>${escapeHtml(PORTAL_SUBMISSION_PACK.currentDecision)}</p>
        <div class="grid-2">
          <article class="panel">
            <h3>Candidate policy</h3>
            <ul>${PORTAL_SUBMISSION_PACK.candidatePolicy.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
          <article class="panel">
            <h3>Submission rules</h3>
            <ul>${PORTAL_SUBMISSION_PACK.submissionRules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </article>
        </div>
      </section>
      <section class="shell section">
        <h2>Playable packages</h2>
        <div class="grid-2">
          ${ZERO_DOMAIN_GAME_EXPERIMENTS.map((game) => `<article class="panel">
            <h3>${escapeHtml(game.name)}</h3>
            <p>${escapeHtml(game.summary)}</p>
            <ul>
              <li><a href="${escapeHtml(game.url)}">Play live build</a></li>
              <li><a href="${escapeHtml(game.cleanZipUrl)}">Download clean portal ZIP</a></li>
              <li><a href="${escapeHtml(game.zipUrl)}">Download SDK-adapter ZIP</a></li>
              ${optionalListItem(game.gameSnacksZipUrl, "Download GameSnacks ZIP")}
              ${optionalListItem(game.gameSnacksPackageReportUrl, "GameSnacks package report")}
              ${optionalListItem(game.gameSnacksVerificationUrl, "GameSnacks verification report")}
              <li><a href="${escapeHtml(game.demoVideoUrl)}">Demo MP4</a></li>
              <li><a href="${escapeHtml(game.coverUrl)}">Cover image</a></li>
              <li><a href="${escapeHtml(game.iconUrl)}">Icon image</a></li>
              <li><a href="${escapeHtml(game.submissionCopyUrl)}">Submission copy pack</a></li>
              <li><a href="${escapeHtml(game.reviewReadinessUrl)}">Review-readiness report</a></li>
              <li><a href="${escapeHtml(game.cleanPackageReportUrl)}">Clean-package report</a></li>
            </ul>
          </article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Candidate portal research</h2>
        <div class="grid-2">
          ${PORTAL_SUBMISSION_PACK.lowFrictionResearch.map((candidate) => `<article class="panel">
            <h3>${escapeHtml(candidate.platform)}</h3>
            <p><strong>Submission signal:</strong> ${escapeHtml(candidate.submissionSignal)}</p>
            <p><strong>Monetization signal:</strong> ${escapeHtml(candidate.monetizationSignal)}</p>
            <p><strong>Fit:</strong> ${escapeHtml(candidate.fit)}</p>
            <p><strong>Risk:</strong> ${escapeHtml(candidate.risk)}</p>
            <p><strong>Action:</strong> ${escapeHtml(candidate.action)}</p>
            <p><a class="button secondary" href="${escapeHtml(candidate.sourceUrl)}">Open source page</a></p>
          </article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Submission queue snapshot</h2>
        <table class="event-table">
          <thead><tr><th>Priority</th><th>Platform</th><th>Gate</th><th>Submission entry</th></tr></thead>
          <tbody>
            ${PLATFORM_SUBMIT_QUEUE.map((item) => `<tr>
              <td>${escapeHtml(item.priority)}</td>
              <td>${escapeHtml(item.platform)}</td>
              <td>${escapeHtml(item.currentGate || item.accountRequired)}</td>
              <td><a href="${escapeHtml(item.submissionUrl)}">${escapeHtml(item.submissionUrl)}</a></td>
            </tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Manual gates and money gate</h2>
        <ul>${PORTAL_SUBMISSION_PACK.notIncludedYet.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p><strong>Completion gate:</strong> ${escapeHtml(PORTAL_SUBMISSION_PACK.completionGate)}</p>
      </section>`;
}

function optionalListItem(url, label) {
  return url ? `<li><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></li>` : "<!-- optional asset unavailable -->";
}

function zeroCostMonetizationMapHtml() {
  return `
      <section class="shell page-title section">
        <a href="/platform-submit-queue/">Platform submit queue</a>
        <h1>Zero-cost monetization map</h1>
        <p>${escapeHtml(ZERO_COST_MONETIZATION_MAP.conclusion)}</p>
        <p><a class="button" href="/zero-cost-monetization-map.json">Open machine-readable map</a> <a class="button secondary" href="/platform-submit-cockpit/">Open submit cockpit</a></p>
      </section>
      <section class="shell section">
        <h2>Route ranking</h2>
        <div class="grid-2">
          ${ZERO_COST_MONETIZATION_MAP.routes.map((route) => `<article class="panel">
            <h3>${escapeHtml(route.priority)}. ${escapeHtml(route.route)}</h3>
            <p><strong>Status:</strong> ${escapeHtml(route.status)}</p>
            <p>${escapeHtml(route.why)}</p>
            <p><strong>Zero-domain:</strong> ${route.zeroDomain ? "yes" : "no"} | <strong>Sales:</strong> ${route.needsSales ? "needed" : "not needed"} | <strong>Rewarded ads:</strong> ${route.canShowRewardedAds ? "possible" : "not suitable"}</p>
            <p><strong>First signal:</strong> ${escapeHtml(route.expectedFirstSignal)}</p>
            <p><strong>Next action:</strong> ${escapeHtml(route.nextAction)}</p>
            <details><summary>Current assets and blockers</summary>
              <p><strong>Assets:</strong> ${escapeHtml((route.currentAssets || []).join(", ") || "None")}</p>
              <p><strong>Blockers:</strong> ${escapeHtml((route.blockers || []).join(", ") || "None")}</p>
            </details>
          </article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Free host options</h2>
        <table class="event-table">
          <thead><tr><th>Provider</th><th>Free host</th><th>Use now</th><th>Monetization fit</th></tr></thead>
          <tbody>
            ${ZERO_COST_MONETIZATION_MAP.freeDomainOptions.map((item) => `<tr>
              <td>${escapeHtml(item.provider)}</td>
              <td>${escapeHtml(item.freeHost)}</td>
              <td>${escapeHtml(item.useNow)}</td>
              <td>${escapeHtml(item.monetizationFit)}</td>
            </tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Ad safety gates</h2>
        <ul>${ZERO_COST_MONETIZATION_MAP.adGateRules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="shell section">
        <h2>Accounts needed</h2>
        <ul>${ZERO_COST_MONETIZATION_MAP.accountsNeeded.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="shell section">
        <h2>Evidence and money gate</h2>
        <ul>${ZERO_COST_MONETIZATION_MAP.sources.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p><strong>Money gate:</strong> ${escapeHtml(ZERO_COST_MONETIZATION_MAP.moneyGate)}</p>
      </section>`;
}

function outreachBody(platform) {
  return [
    `Hi ${platform} team,`,
    "",
    "I would like to submit Neon Lane Dash for HTML5 platform review.",
    "",
    "Neon Lane Dash is a short three-lane reflex arcade game for browser players. It has keyboard and touch controls, short replayable runs, local best score tracking, no login, no in-app purchases, and an ad-safe standalone review build.",
    "",
    "Live preview: https://neon-lane-dash.pages.dev/",
    "HTML5 ZIP: https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-html5.zip",
    "Release pack: https://github.com/yanqr213/neon-lane-dash/releases/tag/platform-submission-v1",
    "Demo video: https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-demo.mp4",
    "Icon: https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-icon-512.png",
    "Cover: https://github.com/yanqr213/neon-lane-dash/releases/download/platform-submission-v1/neon-lane-dash-cover-16x9.png",
    "Submission fields: https://github.com/yanqr213/neon-lane-dash/blob/main/reports/platform-submission-copy.md",
    "",
    "The current build is standalone and does not force ads. CrazyGames, Yandex, Playgama, GamePix, and GameDistribution adapters are gated for platform contexts; ad calls also require an explicit review flag. The build handles platform pause/resume events, lifecycle messages, and rewarded-completion checks before granting optional assist rewards.",
    "",
    "Could you confirm whether this package can enter review, and whether you need a specific SDK wrapper or metadata format before upload?",
    "",
    "Thanks,",
    "PrintableTools Lab",
  ].join("\n");
}

function readGistDiscovery() {
  const reportPath = path.join(__dirname, "..", "reports", "gist-discovery.json");
  if (!fs.existsSync(reportPath)) return null;
  try {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
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
  const reportPath = path.join(__dirname, "..", "reports", "github-issue-discovery.json");
  if (!fs.existsSync(reportPath)) return null;
  try {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    if (!report.issueUrl) return null;
    return {
      issueUrl: report.issueUrl,
      issueNumber: report.issueNumber || "",
    };
  } catch {
    return null;
  }
}

function readCampaignVideoAssets() {
  const reportPath = path.join(__dirname, "..", "reports", "campaign-assets-release.json");
  if (!fs.existsSync(reportPath)) return [];
  try {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
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

function shareKitFeaturedLinks() {
  return SHARE_KIT_FEATURED_LINKS.map(([title, pathName, reason]) => ({
    title,
    path: pathName,
    url: `${siteUrl(pathName).replace(/\/$/, "")}?utm_source=share-kit&utm_medium=organic`,
    reason,
  }));
}

function shareKitPosts() {
  return SHARE_KIT_POSTS.map((post) => ({
    ...post,
    url: trackedSharePostUrl(post),
  }));
}

function trackedSharePostUrl(post) {
  const base = post.absoluteUrl || siteUrl(post.linkPath).replace(/\/$/, "");
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}utm_source=${post.channel}&utm_medium=organic`;
}

function landingPageHtml(page) {
  const primaryToolPath = cleanToolPath(page.primaryTool);
  const tool = tools.find((item) => item.path === primaryToolPath);
  const primaryToolHref = toolHref(page.primaryTool);
  const related = uniqueBy(page.relatedTools
    .map((toolPath) => tools.find((item) => item.path === cleanToolPath(toolPath)))
    .filter(Boolean), (item) => item.path);
  const sectionHtml = page.sections.map(([heading, text]) => `
      <section class="shell section">
        <h2>${escapeHtml(heading)}</h2>
        <p>${escapeHtml(text)}</p>
      </section>`.trim()).join("\n");
  const uploadMatcherHtml = page.uploadErrorMatcher ? `\n${uploadLimitMatcherHtml()}` : "";
  const targetLinksHtml = page.targetLinks ? `
      <section class="shell section">
        <h2>Choose an exact KB target</h2>
        <div class="grid-3">
          ${page.targetLinks.map(([label, pathName, text]) => `<article class="tool-card"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(text)}</p><a class="button" href="/${escapeHtml(pathName)}/">Open target</a></article>`).join("\n")}
        </div>
      </section>`.trim() : "";
  const uploadShortcutsHtml = page.path === "upload-limit-fixer"
    ? `\n${uploadLimitShortcutsHtml("Fast upload limit shortcuts", "If the error message names a file size, start with the matching target page instead of browsing every tool.")}`
    : "";
  return `
      <section class="shell page-title section">
        <a href="/free-pdf-tools/">Free file tools</a>
        <h1>${escapeHtml(page.headline)}</h1>
        <p>${escapeHtml(page.lead)}</p>
        <p><a class="button" href="${primaryToolHref}">Open ${escapeHtml(tool.shortTitle || tool.title)}</a> <a class="button secondary" href="/pdf-tool-finder/">Compare tools</a></p>
      </section>
      <section class="shell section">
        <h2>Why this matches the search</h2>
        <div class="grid-3">
          <article class="panel"><h3>Intent</h3><p>${escapeHtml(page.intent)}</p></article>
          <article class="panel"><h3>No signup</h3><p>The free workflow starts in the browser and does not require an account before file export.</p></article>
          <article class="panel"><h3>Ad-safe</h3><p>Downloads are not gated behind ad interactions or ad impressions. Ads remain disabled until policy review and search visibility are ready.</p></article>
        </div>
      </section>
      ${sectionHtml}${uploadMatcherHtml}${targetLinksHtml}${uploadShortcutsHtml}
      <section class="shell section">
        <h2>Related free tools</h2>
        <div class="grid-3">
          ${related.map((item) => `<article class="tool-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><a class="button" href="/${item.path}/">Open generator</a></article>`).join("\n")}
        </div>
        ${jsonLdHtml(landingPageSchema(page, tool, related))}
      </section>`;
}

function softwareSchema(tool) {
  const imageToolPaths = new Set(["tools/compress-image", "tools/compress-image-to-kb", "tools/resize-image", "tools/convert-image", "tools/remove-background", "tools/crop-image", "tools/rotate-image", "tools/watermark-image", "tools/add-text-image", "tools/signature-png", "tools/passport-photo", "tools/pdf-to-images"]);
  const textToolPaths = new Set(["tools/pdf-to-text"]);
  const docxToolPaths = new Set(["tools/pdf-to-word"]);
  const compressedPdfToolPaths = new Set(["tools/compress-pdf"]);
  const atsToolPaths = new Set(["tools/ats-resume-checker"]);
  const qrToolPaths = new Set(["tools/qr-code", "tools/wifi-qr-code", "tools/vcard-qr-code"]);
  const isImageTool = imageToolPaths.has(tool.path);
  const isTextTool = textToolPaths.has(tool.path);
  const isDocxTool = docxToolPaths.has(tool.path);
  const isCompressedPdfTool = compressedPdfToolPaths.has(tool.path);
  const isAtsTool = atsToolPaths.has(tool.path);
  const isQrTool = qrToolPaths.has(tool.path);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.title} - PrintableTools Lab`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: siteUrl(tool.path),
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      isAtsTool ? "Browser-based ATS resume keyword report" : isCompressedPdfTool ? "Browser-based PDF compression" : isDocxTool ? "Browser-based PDF to Word conversion" : tool.path === "tools/passport-photo" ? "Browser-based passport photo sizing" : isQrTool ? "Browser-based static QR code generation" : isImageTool ? "Browser-based image processing" : isTextTool ? "Browser-based PDF text extraction" : "Browser-based PDF generation",
      "No account required",
      isAtsTool ? "Local pasted-text analysis" : isCompressedPdfTool ? "No-upload image-based PDF rebuild" : isDocxTool ? "No-upload PDF text extraction" : tool.path === "tools/passport-photo" ? "No-upload passport photo crop" : isQrTool ? "Printable QR code PDF" : isImageTool ? "No-upload image conversion" : isTextTool ? "No-upload PDF text extraction" : "US Letter and A4 support",
      isAtsTool ? "Local PDF report export" : isCompressedPdfTool ? "Smaller PDF copy for scanned or image-heavy files" : isDocxTool ? "Local DOCX file export" : tool.path === "tools/passport-photo" ? "Local JPG, PNG, or print sheet export" : isImageTool ? "Local image file export" : isTextTool ? "Local TXT file export" : "One-page printable export",
    ],
  };
}

function faqSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

function itemListSchema(name, items) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: siteUrl(item.path),
    })),
  };
}

function landingPageSchema(page, tool, related) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    url: siteUrl(page.path),
    description: page.description,
    mainEntity: {
      "@type": "SoftwareApplication",
      name: tool.title,
      url: siteUrl(tool.path),
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    hasPart: related.map((item) => ({
      "@type": "SoftwareApplication",
      name: item.title,
      url: siteUrl(item.path),
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
    })),
  };
}

function cleanToolPath(toolPath) {
  return String(toolPath).split("?")[0];
}

function toolHref(toolPath) {
  const [pathname, query] = String(toolPath).split("?");
  return `/${pathname}/${query ? `?${query}` : ""}`;
}

function toolDetails(tool) {
  const title = tool.title.replace(/\s+PDF$/, "");
  const outputImageToolPaths = new Set(["tools/compress-image", "tools/compress-image-to-kb", "tools/resize-image", "tools/convert-image", "tools/remove-background", "tools/crop-image", "tools/rotate-image", "tools/watermark-image", "tools/add-text-image", "tools/signature-png", "tools/passport-photo", "tools/pdf-to-images"]);
  const outputTextToolPaths = new Set(["tools/pdf-to-text"]);
  const outputDocxToolPaths = new Set(["tools/pdf-to-word"]);
  const exportsImage = outputImageToolPaths.has(tool.path);
  const exportsText = outputTextToolPaths.has(tool.path);
  const exportsDocx = outputDocxToolPaths.has(tool.path);
  const outputLabel = exportsImage ? "image file" : exportsText ? "TXT file" : exportsDocx ? "DOCX file" : "PDF";
  const shared = {
    steps: [
      `Open the ${title} and review the example text already in the form.`,
      "Replace the sample fields with your own short, accurate wording.",
      "Choose US Letter or A4 before generating if the tool offers paper size options.",
      `Preview the result, then download the ${outputLabel} and review it before printing, uploading, or sharing.`,
    ],
    useCases: [
      {
        title: "One-off document",
        text: "Use the tool when you need a single clean PDF quickly and do not want to create an account.",
      },
      {
        title: "Printable copy",
        text: "The layout is designed for ordinary home or office printers with clear spacing and readable text.",
      },
      {
        title: "Fast first draft",
        text: "Start from the built-in example, then edit the wording so the final PDF matches your situation.",
      },
    ],
    privacy: "Most file generation happens in your browser. For tools with the optional AI idea helper, only limited non-sensitive writing fields are sent to the server for suggestions.",
    limit: `The free version is limited to practical ${exportsImage ? "image" : exportsText ? "text" : exportsDocx ? "DOCX" : "PDF"} exports and a small daily generation count in the same browser while usage is validated.`,
    faq: [
      {
        q: "Do I need an account?",
        a: `No. The generator opens in the browser and lets you download a ${exportsImage ? "file" : exportsText ? "TXT file" : exportsDocx ? "DOCX file" : "PDF"} without creating an account.`,
      },
      {
        q: "Is the export really free?",
        a: "Yes. The first version is free and does not hide the file export behind a checkout.",
      },
      {
        q: exportsText ? "Can I edit the text later?" : exportsDocx ? "Can I edit the Word document later?" : "Can I edit the PDF later?",
        a: exportsText ? "Yes. The export is a plain TXT file, so you can open it in any notes, writing, or document app after downloading." : exportsDocx ? "Yes. The export is a simple DOCX file, so you can open it in Word, Google Docs, LibreOffice, or another compatible editor." : "The simplest workflow is to edit the form fields and generate a fresh PDF. Keep your own copy of important documents.",
      },
    ],
  };
  const slug = tool.path.replace(/^tools\//, "");
  const overrides = {
    "invoice-generator": {
      useCases: [
        { title: "Freelance invoice", text: "Create a simple invoice for design, writing, consulting, repair, tutoring, or project work." },
        { title: "Small business service", text: "List service visits, materials, labor, or support time with quantity and rate." },
        { title: "Client payment record", text: "Use invoice numbers and payment terms so both sides know what is being requested." },
      ],
      faq: [
        { q: "Does this store invoices?", a: "No. Download the PDF and keep your own copy with your bookkeeping records." },
        { q: "Can I add payment instructions?", a: "Yes, use the note field, but only include payment details you are comfortable putting in a document." },
        { q: "Is it accounting software?", a: "No. It is a fast PDF generator for simple invoices, not bookkeeping or tax software." },
      ],
    },
    "estimate-generator": {
      useCases: [
        { title: "Service quote", text: "Prepare a clear quote for repair, consulting, freelance, or home service work." },
        { title: "Scope preview", text: "List the work and assumptions before creating a final invoice." },
        { title: "Client approval", text: "Give clients a one-page document they can review before work begins." },
      ],
    },
    "purchase-order": {
      useCases: [
        { title: "Vendor order", text: "Create a PO for supplies, materials, or small service purchases." },
        { title: "Internal approval", text: "Record what was approved before an invoice arrives." },
        { title: "Project buying", text: "List project items, quantities, unit prices, and requested delivery notes." },
      ],
    },
    "bill-of-sale": {
      privacy: "This tool creates a practical draft in your browser. Requirements vary by location and item type, especially for vehicles or regulated items.",
      useCases: [
        { title: "Private sale record", text: "Record the buyer, seller, item, price, date, and terms for a private sale." },
        { title: "Equipment transfer", text: "Document a transfer of tools, furniture, electronics, or equipment." },
        { title: "Signed handoff", text: "Print copies so both parties can sign after payment and item handoff." },
      ],
    },
    "rent-receipt": {
      useCases: [
        { title: "Cash rent record", text: "Create a dated receipt when rent is paid in cash or in person." },
        { title: "Tenant copy", text: "Give tenants a simple record of amount, date, property, and rental period." },
        { title: "Landlord files", text: "Keep a printable copy for household or property records." },
      ],
    },
    "business-card": {
      useCases: [
        { title: "Local service card", text: "Create contact cards for notary, tutoring, repair, cleaning, coaching, or other neighborhood services." },
        { title: "Pop-up table", text: "Print quick cards for a market booth, class, club, or temporary sales table." },
        { title: "Before a print order", text: "Test wording and contact details before ordering a professional batch." },
      ],
      privacy: "Business card details are generated locally. Do not publish personal phone numbers or addresses unless you intend to share them.",
      faq: [
        { q: "Does this order printed cards?", a: "No. It creates a printable PDF sheet that you can print and trim yourself." },
        { q: "Can I use it for a side business?", a: "Yes. It is designed for simple service, event, and contact cards." },
        { q: "Should I test print first?", a: "Yes. Print one page and confirm text size, spacing, and trimming before printing more." },
      ],
    },
    "address-labels": {
      useCases: [
        { title: "Return address labels", text: "Create a sheet for envelopes, cards, office mail, or small batches." },
        { title: "Classroom and bin labels", text: "Use simple labels for folders, cubbies, supplies, or storage bins." },
        { title: "Event badges", text: "Choose the badge-style layout for quick visitor, workshop, or table labels." },
      ],
      privacy: "Labels are generated in your browser. Be careful with home addresses or other private details before printing or sharing.",
      limit: "The free version creates one printable label sheet. Run a plain-paper alignment test before using adhesive labels.",
      faq: [
        { q: "Does it match every Avery template?", a: "No. It provides common printable layouts, but sticker sheet alignment can vary by printer." },
        { q: "Can I use it for classroom labels?", a: "Yes. The label text can be used for bins, folders, cubbies, or event badges." },
        { q: "Should I print a test page?", a: "Yes. Test on plain paper before printing on label stock." },
      ],
    },
    "barcode-labels": {
      useCases: [
        { title: "SKU labels", text: "Print short codes for handmade products, market stock, storage bins, or internal inventory." },
        { title: "Event check-in", text: "Create simple code labels for badges, envelopes, or check-in packets." },
        { title: "Internal tracking", text: "Use static labels when a full inventory system is unnecessary." },
      ],
      privacy: "Barcode labels are generated locally. These are simple Code 39-style labels for internal use, not regulated retail compliance labels.",
      limit: "The free version creates one static label sheet. Test scanning with your device before printing a full batch.",
      faq: [
        { q: "What barcode type is used?", a: "The tool draws Code 39-style bars for uppercase letters, numbers, and common symbols." },
        { q: "Can I use these for official retail products?", a: "Use proper barcode registration and compliance tools for official retail distribution." },
        { q: "Why should codes be short?", a: "Shorter codes print wider bars and are easier to scan on ordinary printers." },
      ],
    },
    "price-tag": {
      useCases: [
        { title: "Yard sale tags", text: "Print large prices for garage sales, estate sales, moving sales, or community tables." },
        { title: "Craft fair table", text: "Create simple tags for handmade goods, bundles, or sale offers." },
        { title: "Shelf labels", text: "Use clean labels for small retail shelves, bins, or pop-up displays." },
      ],
      faq: [
        { q: "Can I print several tags on one page?", a: "Yes. Choose 8, 10, or 12 tags per page." },
        { q: "Can I use it for a craft fair?", a: "Yes. It is designed for simple market tables, pop-up shops, and yard sales." },
        { q: "What should be largest?", a: "The price should be the largest text so shoppers can scan it quickly." },
      ],
    },
    "flyer-maker": {
      useCases: [
        { title: "Local service flyer", text: "Promote tutoring, cleaning, repair, notary, coaching, or neighborhood services." },
        { title: "Community event", text: "Create a simple flyer for a class, club, sale, fundraiser, or workshop." },
        { title: "Yard sale flyer", text: "Print a clear event flyer with time, location, and short details." },
      ],
      privacy: "The flyer is generated locally. Only publish contact details and locations you are comfortable making public.",
      faq: [
        { q: "Is this a design marketplace?", a: "No. It makes one practical flyer PDF quickly without requiring an account." },
        { q: "Can I use it for paid services?", a: "Yes, as long as the offer is accurate and you are authorized to promote it." },
        { q: "Where should ads appear later?", a: "Ads should stay outside the editing and download controls and never block the PDF." },
      ],
    },
    "coupon-maker": {
      useCases: [
        { title: "Local discount card", text: "Create a simple coupon for a service, class, shop, or event offer." },
        { title: "Pop-up promotion", text: "Print cards for a market booth, neighborhood event, or small seasonal sale." },
        { title: "Referral handout", text: "Use a short code and clear fine print for trackable offline promotion." },
      ],
      privacy: "Coupons are generated locally. Use accurate terms and avoid creating coupons for brands or offers you do not control.",
      faq: [
        { q: "Can I add fine print?", a: "Yes. Use the fine print field for simple limits such as dates or one-per-customer terms." },
        { q: "Does it process payments?", a: "No. It only creates printable coupon cards." },
        { q: "Can I use it commercially?", a: "Use it only for offers and businesses you are authorized to promote." },
      ],
    },
    "packing-slip": {
      useCases: [
        { title: "Marketplace order", text: "Print a package insert with order number, items, quantities, and packed status." },
        { title: "Handmade shipment", text: "Use a clean slip for candles, soaps, art prints, clothing, or other small goods." },
        { title: "Local pickup", text: "Create a pickup or local delivery checklist without full shipping software." },
      ],
      privacy: "Packing slips are generated locally. Avoid putting payment details or private customer notes on a package insert unless the workflow truly needs them.",
      limit: "The free version creates one printable packing slip PDF with a limited number of rows.",
      faq: [
        { q: "Is this a shipping label?", a: "No. It is a packing slip for package contents, not postage or carrier labels." },
        { q: "Can I use it for Etsy or marketplace orders?", a: "Yes, for a simple package insert after you copy the order details you need." },
        { q: "Should prices be included?", a: "Usually no. Packing slips often focus on items and quantities, especially for gifts." },
      ],
    },
    "work-order": {
      useCases: [
        { title: "Repair visit", text: "Record tasks, schedule, instructions, and approval notes before a repair starts." },
        { title: "Field service", text: "Print one form for cleaning, maintenance, installation, or contractor work." },
        { title: "Client approval", text: "Use signature lines to separate approved work from additional work." },
      ],
      privacy: "The work order is generated locally. Review safety requirements, scope, and approval terms before using it for real service work.",
      faq: [
        { q: "Is this a legal service contract?", a: "No. It is a practical work order form, not legal advice or a full contract." },
        { q: "Can it include estimated charges?", a: "Yes. Enter task, quantity, and rate rows to show a simple estimated total." },
        { q: "Does it replace field-service software?", a: "No. It is intended for small jobs and printable records." },
      ],
    },
    "inventory-sheet": {
      useCases: [
        { title: "Stock count", text: "Compare expected and counted quantities for shelves, bins, or small inventory areas." },
        { title: "Craft fair table", text: "Count items before opening and after closing a market table." },
        { title: "Classroom supplies", text: "Track books, kits, materials, or storage bins without a spreadsheet." },
      ],
      faq: [
        { q: "Is this inventory software?", a: "No. It creates a printable count sheet and does not store stock history." },
        { q: "Can I use SKU rows?", a: "Yes. The default layout includes SKU, item, expected, counted, and note columns." },
        { q: "Why print instead of using a spreadsheet?", a: "Stock counts often happen away from a desk, so a simple paper sheet can be faster." },
      ],
    },
    "resume-builder": {
      useCases: [
        { title: "Simple resume", text: "Build a clean one-page resume without decorative layouts or hidden export fees." },
        { title: "ATS-friendly draft", text: "Use a single-column structure with readable headings and normal text." },
        { title: "Quick application", text: "Create a practical first PDF when you need to apply soon and improve the wording later." },
      ],
      privacy: "Contact details, names, and work history are generated locally unless you choose to place generic text in the AI idea fields.",
    },
    "ats-resume-checker": {
      steps: [
        "Open the ATS resume checker and paste resume text into the resume field.",
        "Paste the target job description into the comparison field.",
        "Review the keyword match, missing honest terms, section checks, and next edits.",
        "Download the one-page PDF report and edit the resume in your preferred editor before applying.",
      ],
      privacy: "The checker analyzes pasted text locally in the browser and does not upload your resume or job description.",
      limit: "The free version creates one local report PDF per generation and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Before applying", text: "Compare a resume against a role before submitting an application." },
        { title: "Keyword review", text: "Find honest missing terms from a job description without keyword stuffing." },
        { title: "Format sanity check", text: "Check standard headings, measurable evidence, and readable wording." },
      ],
      faq: [
        { q: "Does this guarantee ATS success?", a: "No. It is a local editing aid and cannot guarantee parser behavior, interviews, or hiring outcomes." },
        { q: "Is my resume uploaded?", a: "No. The pasted text is analyzed in your browser." },
        { q: "Should I add every missing keyword?", a: "No. Add only truthful skills, tools, and responsibilities you can support." },
      ],
    },
    "cover-letter": {
      useCases: [
        { title: "Last-minute application", text: "Write a concise cover letter when an application requires one before submission." },
        { title: "Role-specific draft", text: "Mention the role and company, then add a short strengths paragraph." },
        { title: "No signup export", text: "Avoid writing into a tool that asks for payment only after the letter is complete." },
      ],
      privacy: "Name and contact fields stay local. Use the AI idea helper only for generic wording, not private personal details.",
    },
    "resignation-letter": {
      useCases: [
        { title: "Two weeks notice", text: "State your resignation, final working day, appreciation, and handoff plan." },
        { title: "Professional handoff", text: "Keep the tone clear and neutral for workplace records." },
        { title: "Personal copy", text: "Download a PDF copy for your own records after sending or printing." },
      ],
      privacy: "This is a practical draft, not legal advice. Review employment policies and local requirements before sending.",
    },
    "monthly-calendar": {
      useCases: [
        { title: "Family schedule", text: "Track appointments, school events, bills, and household plans on one month page." },
        { title: "Student planner", text: "Mark assignments, exams, study blocks, and project deadlines." },
        { title: "Printable wall calendar", text: "Print a clean black-and-white calendar with enough writing space." },
      ],
    },
    "meal-planner": {
      useCases: [
        { title: "Weekly meals", text: "Plan breakfast, lunch, and dinner for each day of the week." },
        { title: "Grocery list", text: "Keep shopping items on the same page as the meal plan." },
        { title: "Budget planning", text: "Repeat ingredients across meals and leave a flexible dinner for leftovers." },
      ],
    },
    "image-to-pdf": {
      privacy: "Selected image files are loaded into the browser preview and are not uploaded by the converter.",
      limit: "The free version creates a one-page PDF from the selected images and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "JPG to PDF", text: "Turn a photo, screenshot, receipt, or scanned image into a one-page PDF." },
        { title: "No upload conversion", text: "Use the browser-side converter when an image may contain private information." },
        { title: "Gallery page", text: "Place up to four related images on one PDF page for quick sharing or printing." },
      ],
      faq: [
        { q: "Are images uploaded?", a: "No. The selected image is drawn into the PDF preview in your browser." },
        { q: "Which image formats work?", a: "The converter accepts common JPG, PNG, and WebP image files." },
        { q: "Can I add several images?", a: "Yes. Gallery mode places up to four images on one page." },
      ],
    },
    "compress-image": {
      steps: [
        "Open the image compressor and select one JPG, PNG, or WebP image.",
        "Choose a compression level, maximum width, and output format.",
        "Review the preview and estimated export settings.",
        "Download the compressed image and test it in the destination form or upload box.",
      ],
      privacy: "Selected image files are loaded into your browser and are not uploaded by the compressor.",
      limit: "The free version processes one image at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Upload size limit", text: "Make a smaller image when a form, portal, or email rejects the original file." },
        { title: "Marketplace listing", text: "Reduce product photo size before uploading to a seller dashboard." },
        { title: "Support ticket", text: "Compress screenshots before attaching them to a help desk, school portal, or client email." },
      ],
      faq: [
        { q: "Are images uploaded?", a: "No. The selected image is processed locally in your browser." },
        { q: "Which format should I choose?", a: "JPG is usually best for photos, WebP is often smaller for web use, and PNG is useful for sharp graphics." },
        { q: "Will it always be smaller?", a: "Usually, but PNG output can be larger than JPG or WebP depending on the image content." },
      ],
    },
    "compress-image-to-kb": {
      steps: [
        "Open the image to KB compressor and select one JPG, PNG, or WebP image.",
        "Choose a target such as 50KB, 100KB, 200KB, 500KB, or a custom KB value.",
        "Review the preview, estimated file size, and whether the target was met.",
        "Download the smaller image and open it before submitting it to the destination portal.",
      ],
      privacy: "Selected image files are loaded into your browser and are not uploaded by the target-size compressor.",
      limit: "The free version processes one image at a time. Extremely small KB targets may require lower quality or smaller dimensions and may not be visually acceptable.",
      useCases: [
        { title: "100KB upload limit", text: "Make a smaller image when a form, profile, exam portal, or application rejects files over 100KB." },
        { title: "Job application", text: "Reduce a headshot, ID-style photo, or document image before uploading to a job portal." },
        { title: "School or exam portal", text: "Create a smaller copy for strict online forms without sending the original image to another site." },
      ],
      faq: [
        { q: "Can it always hit 100KB?", a: "Not always. The tool tries several quality and size combinations and shows the closest result if the target would make the image too small or blurry." },
        { q: "Are images uploaded?", a: "No. Target-size compression runs locally in your browser." },
        { q: "Which format should I use?", a: "JPG is a safe default for photos. WebP can be smaller when the destination site accepts it." },
      ],
    },
    "resize-image": {
      steps: [
        "Open the image resizer and select one image file.",
        "Choose a preset or enter a custom width and optional height.",
        "Pick fit inside or fill and crop depending on whether exact dimensions matter.",
        "Download the resized image and check that important content is still visible.",
      ],
      privacy: "Selected image files are loaded into your browser and are not uploaded by the resizer.",
      limit: "The free version resizes one image at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Profile image", text: "Resize a photo to a square profile or avatar size." },
        { title: "Thumbnail", text: "Create a 1280 by 720 thumbnail-style export for previews and posts." },
        { title: "Form requirement", text: "Meet an upload field that asks for a specific width or height." },
      ],
      faq: [
        { q: "Can I keep the aspect ratio?", a: "Yes. Use a custom width and leave height empty to keep the original ratio." },
        { q: "What does fill and crop do?", a: "It fills the exact target size and trims the edges when the aspect ratios do not match." },
        { q: "Are images uploaded?", a: "No. The resize runs in your browser." },
      ],
    },
    "convert-image": {
      steps: [
        "Open the image converter and select one JPG, PNG, or WebP file.",
        "Choose the output format and quality setting.",
        "Use a JPG background option if the source has transparency.",
        "Download the converted image and check it before uploading elsewhere.",
      ],
      privacy: "Selected image files are loaded into your browser and are not uploaded by the converter.",
      limit: "The free version converts one image at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Wrong file type", text: "Convert an image when an upload form accepts JPG but not WebP, or PNG but not JPG." },
        { title: "Web-friendly export", text: "Create a WebP copy when the receiving site accepts it and smaller file size matters." },
        { title: "Transparent graphic", text: "Keep PNG output for simple graphics where sharp edges or transparency are important." },
      ],
      faq: [
        { q: "Can I convert WebP to JPG?", a: "Yes, when the browser can load the WebP file." },
        { q: "What happens to transparency in JPG?", a: "JPG does not support transparency, so choose a white or black background before export." },
        { q: "Are images uploaded?", a: "No. The format conversion runs in your browser." },
      ],
    },
    "remove-background": {
      steps: [
        "Open the background remover and select one JPG, PNG, or WebP image.",
        "Choose an automatic corner sample or a known background color.",
        "Adjust tolerance and edge softness until the preview looks clean.",
        "Download the transparent PNG and review it on the checkerboard preview before using it elsewhere.",
      ],
      privacy: "Selected image files are loaded into your browser and are not uploaded by the background remover.",
      limit: "The free version removes simple solid or near-solid backgrounds from one image at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Product or marketplace photo", text: "Remove a white or light product background when the object is clearly separated from the background color." },
        { title: "Logo or icon cleanup", text: "Create a transparent PNG from a flat logo, icon, badge, or graphic with a solid background." },
        { title: "Signature scan cleanup", text: "Turn a signature scan on white paper into a cleaner transparent PNG before placing it in a document." },
      ],
      faq: [
        { q: "Is my image uploaded?", a: "No. The selected image is processed locally in your browser." },
        { q: "Does it use AI?", a: "No. It uses local color matching to remove simple solid or near-solid backgrounds." },
        { q: "Will it work on people or hair?", a: "Not reliably. Complex people, hair, shadows, glass, and busy backgrounds usually need a dedicated editor or manual cleanup." },
      ],
    },
    "crop-image": {
      steps: [
        "Open the image cropper and select one JPG, PNG, or WebP image.",
        "Choose a crop shape such as square, wide, portrait, or banner.",
        "Pick the focus area so the important part stays in frame.",
        "Download the cropped copy and check it before uploading elsewhere.",
      ],
      privacy: "Selected image files are loaded into your browser and are not uploaded by the cropper.",
      limit: "The free version crops one image at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Profile photo", text: "Create a square avatar or profile image while keeping the face centered." },
        { title: "Marketplace listing", text: "Crop product photos so the item fills the frame before resizing or compressing." },
        { title: "Banner image", text: "Create a wide crop for thumbnails, listings, headers, and simple social graphics." },
      ],
      faq: [
        { q: "Does this upload my image?", a: "No. The crop is calculated and exported in your browser." },
        { q: "Can I crop to a square?", a: "Yes. Use the square preset for avatars, product photos, and profile images." },
        { q: "Does it change the original file?", a: "No. It downloads a new cropped copy." },
      ],
    },
    "rotate-image": {
      steps: [
        "Open the image rotator and select one image file.",
        "Choose 90, 180, or 270 degree rotation.",
        "Optionally flip the image horizontally or vertically.",
        "Download the corrected image and confirm text and orientation look right.",
      ],
      privacy: "Selected image files are loaded into your browser and are not uploaded by the rotator.",
      limit: "The free version rotates one image at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Sideways photo", text: "Fix a phone image that opened in the wrong orientation." },
        { title: "Scanned document photo", text: "Rotate a form or receipt image before turning it into a PDF." },
        { title: "Mirrored image", text: "Flip an image when a scan, selfie, or screenshot needs correction." },
      ],
      faq: [
        { q: "Can I flip an image too?", a: "Yes. Choose horizontal or vertical flip before export." },
        { q: "Are images uploaded?", a: "No. The rotation runs in your browser." },
        { q: "Will it edit the original file?", a: "No. It downloads a new rotated copy." },
      ],
    },
    "watermark-image": {
      steps: [
        "Open the image watermark tool and select one image.",
        "Enter short text such as SAMPLE, DRAFT, your name, or a project label.",
        "Choose placement, size, opacity, and output format.",
        "Download the watermarked copy and review readability before sharing.",
      ],
      privacy: "Selected image files are loaded into your browser and are not uploaded by the watermark tool.",
      limit: "The free version watermarks one image at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Sample image", text: "Mark a preview or proof before sending it to a client or collaborator." },
        { title: "Marketplace photo", text: "Add a simple visible label to product photos before posting or sharing." },
        { title: "Draft social image", text: "Create a clearly marked draft image for review without opening a design app." },
      ],
      faq: [
        { q: "Does a watermark protect copyright?", a: "It is only a visual mark. Keep original files and use proper platform or licensing tools when needed." },
        { q: "Can I tile the watermark?", a: "Yes. Choose the diagonal tile placement for repeated text across the image." },
        { q: "Are images uploaded?", a: "No. The watermark is applied in your browser." },
      ],
    },
    "add-text-image": {
      steps: [
        "Open the add text to image tool and select one JPG, PNG, or WebP file.",
        "Enter a short main line and optional small line.",
        "Choose a placement, text color, background style, output format, and quality.",
        "Download the new image and check that the text is readable before posting or sharing.",
      ],
      privacy: "Selected image files are loaded into your browser and are not uploaded by the text overlay tool.",
      limit: "The free version adds text to one image at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Product label", text: "Add a price, sale message, size note, or quick feature label to a listing image." },
        { title: "Thumbnail or cover", text: "Add a short headline to a cover image, classroom visual, or social preview." },
        { title: "Meme or caption", text: "Create a simple top-and-bottom caption without opening a full design editor." },
      ],
      faq: [
        { q: "Is my image uploaded?", a: "No. The selected image and text overlay are processed in your browser." },
        { q: "Can I make meme-style text?", a: "Yes. Choose the meme layout for top and bottom high-contrast text." },
        { q: "Is this a full design editor?", a: "No. It is a focused quick overlay tool for short, readable text on one image." },
      ],
    },
    "qr-code": {
      steps: [
        "Open the QR code generator and enter a full URL or short text.",
        "Choose an error correction level. Balanced is a good default for most signs and flyers.",
        "Generate the PDF, then scan the preview or printed page with a phone.",
        "Print only after confirming the QR code opens the exact destination you expect.",
      ],
      privacy: "The static QR payload is rendered in your browser. Do not put private or temporary secrets into a public QR code.",
      limit: "The free version creates one printable static QR page at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Menu or sign", text: "Put a menu, booking page, signup form, or event page on a printable sign." },
        { title: "Flyer link", text: "Add a scannable link to a flyer, handout, package insert, or notice board." },
        { title: "No account QR", text: "Create a simple static QR code without a dashboard, dynamic tracking, or account wall." },
      ],
      faq: [
        { q: "Is this a dynamic QR code?", a: "No. It is a static QR code. The encoded link or text cannot be changed after printing." },
        { q: "Can I use it for a menu or flyer?", a: "Yes. Use a stable URL and scan the code before printing many copies." },
        { q: "Does the QR code require signup?", a: "No. The validation version generates a printable static QR PDF without account creation." },
      ],
    },
    "wifi-qr-code": {
      steps: [
        "Open the WiFi QR code generator and enter the network name exactly as it appears.",
        "Choose the security type and enter the guest WiFi password if the network has one.",
        "Generate the printable PDF and test the QR code with a phone before posting it.",
        "Use a guest network for public signs so private devices and admin settings stay separate.",
      ],
      privacy: "The WiFi QR payload is generated in your browser, but anyone who scans the printed sign can read or use the encoded network details.",
      limit: "The free version creates one WiFi QR sign at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Guest network sign", text: "Print a quick WiFi access sign for an office, studio, waiting room, or classroom." },
        { title: "Rental welcome page", text: "Add scannable WiFi access to a short-term rental, guest room, or visitor packet." },
        { title: "Event table", text: "Help guests connect during workshops, meetups, pop-ups, and temporary events." },
      ],
      faq: [
        { q: "Should I print my private WiFi password?", a: "Use a guest network for public signs. Anyone who can scan the code can use the encoded details." },
        { q: "Does it support WPA networks?", a: "Yes. The generator supports WPA/WPA2, WEP, and no-password networks." },
        { q: "Can hidden networks work?", a: "Yes. Choose the hidden network option and test the printed code on your devices." },
      ],
    },
    "vcard-qr-code": {
      steps: [
        "Open the contact QR code generator and enter only the details you want people to save.",
        "Generate the printable PDF and scan it on a phone to review the vCard fields.",
        "Use the QR code on a business card, flyer, booth sign, badge, or local service sheet.",
        "Avoid adding sensitive personal details to a QR code that will be posted publicly.",
      ],
      privacy: "The vCard QR payload is generated locally, but the printed code makes the included contact details public to anyone who scans it.",
      limit: "The free version creates one contact QR page at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Business card QR", text: "Add a scannable contact card to a printed business card draft or service handout." },
        { title: "Booth sign", text: "Let visitors save your contact details from a table sign, badge, or market booth flyer." },
        { title: "Local service flyer", text: "Make it easier for customers to save a phone number, email, and website after reading a flyer." },
      ],
      faq: [
        { q: "What does the contact QR store?", a: "It stores a vCard-style contact with name, company, phone, email, website, and note fields when provided." },
        { q: "Will every phone save it the same way?", a: "Most modern phones understand vCard QR codes, but fields can display slightly differently. Test before printing." },
        { q: "Is it private?", a: "Generation is local, but the printed QR code publicly contains the details you entered." },
      ],
    },
    "multi-image-pdf": {
      privacy: "Selected image files are loaded into the browser preview and are not uploaded by the converter.",
      limit: "The free version exports up to eight selected images as a multi-page PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Receipts to PDF", text: "Combine several receipt photos into one PDF for a reimbursement or expense record." },
        { title: "Homework scan", text: "Turn several worksheet or homework photos into a single file." },
        { title: "No upload conversion", text: "Use browser-side conversion when the images may contain private information." },
      ],
      faq: [
        { q: "Are the images uploaded?", a: "No. The selected images are drawn into PDF pages in your browser." },
        { q: "How many images can I add?", a: "The free tool accepts up to eight images for one multi-page PDF." },
        { q: "Does each image get its own page?", a: "Yes. The export creates a multi-page PDF with one image per page." },
      ],
    },
    "compress-pdf": {
      steps: [
        "Open the PDF compressor and select one PDF file.",
        "Choose Small file, Balanced, or More readable depending on the destination limit.",
        "Keep all pages or enter a page range such as 1,3-5.",
        "Download the compressed PDF and compare it with the original before uploading or sharing.",
      ],
      privacy: "The selected PDF is rendered and rebuilt in your browser and is not uploaded by the compressor.",
      limit: "The free version compresses up to twelve selected pages into an image-based PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Upload size limit", text: "Create a smaller PDF when a school, job, government, or support portal rejects the original file." },
        { title: "Scanned paperwork", text: "Compress photo-heavy scans, receipts, forms, and document packets that do not need selectable text." },
        { title: "Private local conversion", text: "Avoid uploading sensitive PDFs to a converter service when a browser-side copy is enough." },
      ],
      faq: [
        { q: "Is the PDF uploaded?", a: "No. The PDF is rendered locally in your browser for ordinary compression." },
        { q: "Will text stay selectable?", a: "Usually no. This compressor rebuilds pages as images, so selectable text and links may be flattened." },
        { q: "What kind of PDFs work best?", a: "Scanned, photo-heavy, receipt, or image-based PDFs usually fit this method better than contracts or accessible text PDFs." },
      ],
    },
    "pdf-to-images": {
      privacy: "The selected PDF is rendered into images in your browser and is not uploaded by the converter.",
      limit: "The free version converts up to eight selected PDF pages at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Portal image upload", text: "Convert a PDF page to JPG when a form accepts image files but rejects PDFs." },
        { title: "Message or listing image", text: "Turn a document page into a PNG or JPG for a chat, listing, or quick visual review." },
        { title: "Private document conversion", text: "Use local rendering when the PDF includes receipts, forms, or personal details." },
      ],
      faq: [
        { q: "Is the PDF uploaded?", a: "No. The PDF is read and rendered locally in your browser for ordinary conversion." },
        { q: "What happens with multiple pages?", a: "Multiple pages download as a ZIP file containing one image per converted page." },
        { q: "How many pages can I convert?", a: "The free version converts up to eight selected pages at a time." },
      ],
    },
    "pdf-to-text": {
      privacy: "The selected PDF is parsed for text in your browser and is not uploaded by the extractor.",
      limit: "The free version extracts text from one PDF at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Research notes", text: "Extract selectable text from a report, guide, article, or handout for local review." },
        { title: "Admin cleanup", text: "Turn invoice, receipt, or form text into a lightweight TXT file for checking details." },
        { title: "Private document review", text: "Keep the PDF local when extracting copy from documents that should not be uploaded to a converter." },
      ],
      faq: [
        { q: "Does it upload my PDF?", a: "No. The PDF is read locally in the browser for ordinary text extraction." },
        { q: "Does it OCR scanned PDFs?", a: "No. It extracts selectable embedded text only. Image-only scans need OCR." },
        { q: "What file do I download?", a: "The export is a plain TXT file with page headings unless you choose plain text layout." },
      ],
    },
    "pdf-to-word": {
      privacy: "The selected PDF is parsed for selectable text in your browser and is not uploaded by the converter.",
      limit: "The free version converts up to twelve selected pages into one DOCX file and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Quick editable draft", text: "Turn a text-based PDF report, letter, assignment, or resume into a simple Word-compatible document for editing." },
        { title: "Private document conversion", text: "Use browser-side conversion when the PDF includes personal, business, school, or client details you do not want to upload." },
        { title: "Text-first cleanup", text: "Extract the words into a DOCX so you can rewrite, summarize, or reformat them in your own document editor." },
      ],
      faq: [
        { q: "Does it upload my PDF?", a: "No. The PDF is read locally in the browser for ordinary conversion." },
        { q: "Will it preserve the exact PDF layout?", a: "No. It creates a clean text-first DOCX with page headings. Complex columns, forms, tables, and exact styling may be simplified." },
        { q: "Does it OCR scanned PDFs?", a: "No. It converts selectable embedded text only. Image-only scans need OCR before this tool can create useful Word text." },
      ],
    },
    "signature-png": {
      privacy: "The signature drawing and typed fallback are rendered in your browser and are not uploaded by the generator.",
      limit: "The free version downloads one PNG signature image at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Document draft", text: "Create a transparent signature image for proposals, forms, PDF annotations, or internal drafts." },
        { title: "Typed fallback", text: "Use the typed signature option when a drawn signature is not needed for the document." },
        { title: "Private local image", text: "Avoid sending the signature image to an online design or conversion service." },
      ],
      faq: [
        { q: "Is the signature uploaded?", a: "No. The signature pad and PNG export run locally in your browser for ordinary use." },
        { q: "Is this an e-signature platform?", a: "No. It creates a visual PNG image only and does not verify identity, collect consent, or manage signing workflows." },
        { q: "Can I get a transparent background?", a: "Yes. Choose Transparent PNG so the signature can sit over a document or image background." },
      ],
    },
    "passport-photo": {
      privacy: "The selected photo is cropped and rendered in your browser and is not uploaded by the maker.",
      limit: "The free version exports one passport-style photo or one 4x6 print sheet at a time and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Application photo sizing", text: "Create a correctly sized image for a passport, visa, exam portal, or document workflow before checking the official requirements." },
        { title: "4x6 print sheet", text: "Place several copies on a 4x6 inch PDF sheet for home or photo-lab printing." },
        { title: "Private local crop", text: "Avoid uploading a face photo to an online cropper when you only need sizing and layout." },
      ],
      faq: [
        { q: "Is my photo uploaded?", a: "No. The photo is loaded, cropped, and exported locally in your browser for ordinary use." },
        { q: "Does this guarantee official acceptance?", a: "No. It helps with size and layout only. You still need to check official background, pose, lighting, expression, recency, and country-specific rules." },
        { q: "Which sizes are included?", a: "The first version includes US 2 x 2 inch, UK 35 x 45 mm, EU-style 35 x 45 mm, Canada 50 x 70 mm, and Australia 35 x 45 mm presets." },
      ],
    },
    "merge-pdf": {
      privacy: "Selected PDF files are read in your browser and are not uploaded by the merge tool.",
      limit: "The free version merges up to six PDFs in one browser session and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Application packet", text: "Combine forms, scans, and supporting PDFs into one file before uploading." },
        { title: "Receipt bundle", text: "Merge several receipts or statements into one reimbursement or admin PDF." },
        { title: "Client document", text: "Create one review file from several smaller PDFs without using a server-side converter." },
      ],
      faq: [
        { q: "Are my PDFs uploaded?", a: "No. The files are read and merged in your browser for ordinary use." },
        { q: "How many PDFs can I merge?", a: "The free tool accepts up to six PDFs at a time." },
        { q: "Can it merge huge PDFs?", a: "Very large files may be limited by browser memory. Try smaller batches when needed." },
      ],
    },
    "split-pdf": {
      privacy: "The source PDF is read in your browser and is not uploaded by the split tool.",
      limit: "The free version extracts selected pages from one PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Extract form pages", text: "Keep only the pages needed for a school, work, or portal upload." },
        { title: "Remove private pages", text: "Create a smaller file that leaves unrelated pages out before sharing." },
        { title: "Trim scan packets", text: "Pull useful pages from a larger scan or downloaded packet." },
      ],
      faq: [
        { q: "How do page ranges work?", a: "Use commas and ranges such as 1,3-5. Pages are counted from the first page as 1." },
        { q: "Does it upload the PDF?", a: "No. The selected PDF is processed in your browser." },
        { q: "Can I reorder pages?", a: "The current tool keeps selected pages in ascending order." },
      ],
    },
    "pdf-page-numbers": {
      privacy: "The PDF is read and numbered in your browser without uploading the file to PrintableTools Lab.",
      limit: "The free version adds simple page numbers to one PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Meeting packet", text: "Add page references before sharing a PDF handout." },
        { title: "Classroom packet", text: "Number pages so students and teachers can refer to the same page quickly." },
        { title: "Merged PDF cleanup", text: "Add simple numbers after combining several files into one PDF." },
      ],
      faq: [
        { q: "Can I choose the position?", a: "Yes. Use bottom center, bottom right, or top right." },
        { q: "Does this edit the original file?", a: "No. It downloads a new numbered copy." },
        { q: "Are files uploaded?", a: "No. The page numbering runs in your browser for ordinary use." },
      ],
    },
    "rotate-pdf": {
      privacy: "The PDF is read and rotated in your browser without uploading the file to PrintableTools Lab.",
      limit: "The free version rotates one PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Sideways scan", text: "Fix a scanned form or receipt that was captured in the wrong orientation." },
        { title: "Selected page correction", text: "Rotate only the pages that are sideways while leaving the rest untouched." },
        { title: "Phone-generated PDF", text: "Correct files made from phone scans before sending or uploading them." },
      ],
      faq: [
        { q: "Can I rotate only one page?", a: "Yes. Enter that page number or a range such as 2 or 2-4." },
        { q: "Does this upload the PDF?", a: "No. The rotation runs in your browser for ordinary use." },
        { q: "Does it edit the original file?", a: "No. It downloads a new rotated copy." },
      ],
    },
    "remove-pdf-pages": {
      privacy: "The source PDF is read in your browser and selected pages are removed locally before export.",
      limit: "The free version removes pages from one PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Blank page cleanup", text: "Remove blank scan pages, cover sheets, or duplicate pages before sharing." },
        { title: "Private page removal", text: "Delete pages that should not be included in the copy you send." },
        { title: "Shorter upload file", text: "Create a smaller PDF by keeping only the useful pages." },
      ],
      faq: [
        { q: "Can I remove all pages?", a: "No. At least one page must remain in the exported PDF." },
        { q: "How do ranges work?", a: "Use commas and ranges such as 1,3-5. Pages are counted from the first page as 1." },
        { q: "Are files uploaded?", a: "No. The page removal runs in your browser for ordinary use." },
      ],
    },
    "reorder-pdf-pages": {
      privacy: "The source PDF is read in your browser and copied into the typed page order without uploading the file.",
      limit: "The free version reorders one PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Out-of-order scan", text: "Fix forms, packets, or handouts that were scanned in the wrong order." },
        { title: "Custom short copy", text: "Enter only the pages you want when you need a shorter ordered PDF." },
        { title: "Packet cleanup", text: "Organize receipts, applications, or client drafts before sharing." },
      ],
      faq: [
        { q: "Can I omit pages?", a: "Yes. The export follows the page numbers you enter, so omitted pages are left out." },
        { q: "Can I repeat a page?", a: "Yes. Repeating a page number creates another copy of that page in the exported PDF." },
        { q: "Does it upload the PDF?", a: "No. The reorder process runs in your browser for ordinary use." },
      ],
    },
    "watermark-pdf": {
      privacy: "The source PDF is read and watermarked in your browser without uploading the file to PrintableTools Lab.",
      limit: "The free version adds a text watermark to one PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Draft copy", text: "Mark a document as draft before sending it for review." },
        { title: "Sample file", text: "Add a light sample or internal-use mark to pages before sharing." },
        { title: "Confidential packet", text: "Place a visible reminder on selected pages that should be handled carefully." },
      ],
      faq: [
        { q: "Can I watermark only some pages?", a: "Yes. Enter all, a single page, or ranges such as 1,3-5." },
        { q: "Does it upload the PDF?", a: "No. The watermark is applied in your browser for ordinary use." },
        { q: "Will the watermark block my text?", a: "Choose a light opacity and review the downloaded PDF before sharing." },
      ],
    },
    "stamp-pdf": {
      privacy: "The source PDF is read and stamped in your browser without uploading the file to PrintableTools Lab.",
      limit: "The free version adds a simple status stamp to one PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Paid receipt", text: "Add a visible PAID mark to a receipt or invoice copy for internal routing." },
        { title: "Approved draft", text: "Mark a review file or work order with a simple approval label." },
        { title: "Document status", text: "Use DRAFT or URGENT stamps to make admin packets easier to scan." },
      ],
      faq: [
        { q: "Is the stamp legal proof?", a: "No. It is a visual annotation. Keep the actual approval, payment, or audit record too." },
        { q: "Can I choose the stamp text?", a: "Yes. Use a short custom label such as PAID, APPROVED, DRAFT, or REVIEW." },
        { q: "Are files uploaded?", a: "No. The stamp is applied in your browser for ordinary use." },
      ],
    },
    "sign-pdf": {
      privacy: "The source PDF is read and annotated in your browser without uploading the file to PrintableTools Lab.",
      limit: "The free version adds one typed signature block to one selected page and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Typed signature block", text: "Add a name and optional date when a typed signature is acceptable." },
        { title: "Simple approval copy", text: "Place a clear signature line on a document you need to keep or send." },
        { title: "Local annotation", text: "Avoid uploading the source PDF when a lightweight typed signature block is enough." },
      ],
      faq: [
        { q: "Is this an e-signature platform?", a: "No. It adds a visual typed signature block and does not verify identity or manage signing workflows." },
        { q: "When should I not use it?", a: "Do not use it when a document requires a regulated e-sign provider, witness, notarization, or handwritten signature." },
        { q: "Does it upload the PDF?", a: "No. The annotation runs in your browser for ordinary use." },
      ],
    },
    "text-to-pdf": {
      privacy: "Text is rendered into the PDF in your browser. Use the AI helper only for generic wording, not private or sensitive content.",
      useCases: [
        { title: "Plain notes", text: "Turn short notes, meeting summaries, or instructions into a clean PDF." },
        { title: "Letter draft", text: "Create a simple one-page letter without opening a heavier editor." },
        { title: "Printable instructions", text: "Paste a short process or checklist explanation for a quick handout." },
      ],
      faq: [
        { q: "Can I paste a long document?", a: "The first version is designed for a readable one-page PDF, so long text is trimmed in the preview." },
        { q: "Do I need to upload a text file?", a: "No. Paste text into the form and generate the PDF locally." },
        { q: "Can I choose a font size?", a: "Yes. Choose small, medium, or large text before generating the PDF." },
      ],
    },
    "markdown-to-pdf": {
      privacy: "Markdown is rendered into the PDF preview in your browser. Remove secrets, tokens, or private production details before sharing the exported PDF.",
      useCases: [
        { title: "README snapshot", text: "Turn README text, changelogs, or project notes into a readable PDF copy." },
        { title: "Lesson outline", text: "Create a printable outline with headings, bullets, quotes, and simple paragraphs." },
        { title: "Meeting notes", text: "Share Markdown notes as a PDF without opening a full editor." },
      ],
      faq: [
        { q: "Which Markdown syntax works?", a: "The first version supports common headings, bullet lists, numbered lists, quotes, and paragraphs." },
        { q: "Does it upload my Markdown?", a: "No. The preview and PDF export run in your browser for ordinary use." },
        { q: "Can it export long docs?", a: "It is best for one-page snapshots. Long documents may be truncated in the preview." },
      ],
    },
    "csv-to-pdf": {
      privacy: "CSV rows are rendered locally in the browser. Do not paste sensitive customer, payment, or confidential business data unless you have reviewed it first.",
      useCases: [
        { title: "Inventory rows", text: "Turn a small stock list or count sheet into a readable table PDF." },
        { title: "Event roster", text: "Create a printable roster, order list, class list, or task table." },
        { title: "Price sheet", text: "Paste item, quantity, and status rows for a one-page reference." },
      ],
      faq: [
        { q: "Does the first row become headers?", a: "Yes. The first CSV row is treated as the table header." },
        { q: "Are CSV files uploaded?", a: "No. Paste the rows and the PDF table is generated locally." },
        { q: "How many rows fit?", a: "The free version is tuned for a readable one-page table, so very long CSV data is truncated." },
      ],
    },
    "json-to-pdf": {
      privacy: "JSON is formatted locally in the browser. Remove API keys, secrets, passwords, and private records before exporting or sharing.",
      useCases: [
        { title: "API sample", text: "Format a small request or response sample for documentation or review." },
        { title: "Config snippet", text: "Create a readable reference copy of a reviewed configuration example." },
        { title: "Bug report", text: "Attach a small formatted payload to a QA note without uploading it to a formatter service." },
      ],
      faq: [
        { q: "What happens if the JSON is invalid?", a: "The tool shows the text with a warning so you can still export a review copy." },
        { q: "Does it upload JSON?", a: "No. Formatting and PDF export run locally in the browser." },
        { q: "Should I paste secrets?", a: "No. Remove tokens, keys, passwords, and private production data before exporting." },
      ],
    },
    "sign-in-sheet": {
      useCases: [
        { title: "Event check-in", text: "Print a sign-in page for workshops, clubs, meetings, and community events." },
        { title: "Class attendance", text: "Use rows with names and signatures for classroom or tutoring attendance." },
        { title: "Visitor log", text: "Choose contact columns only when that information is genuinely needed." },
      ],
    },
    "graph-paper": {
      useCases: [
        { title: "Math practice", text: "Generate a clean grid page for graphing, arithmetic, notes, or classroom work." },
        { title: "Sketch planning", text: "Use quarter-inch or half-inch grids for layouts, room sketches, and craft planning." },
        { title: "Dot grid notes", text: "Choose dot grid for lighter planning pages or bullet-journal style notes." },
      ],
    },
    "packing-list": {
      useCases: [
        { title: "Travel checklist", text: "Plan clothing, toiletries, documents, electronics, and trip-specific items." },
        { title: "Family vacation", text: "Group shared items so the same charger, document, or medicine is not packed twice." },
        { title: "Business trip", text: "Create a focused list for work gear, documents, clothing, and personal essentials." },
      ],
    },
    "receipt-generator": {
      useCases: [
        { title: "Service receipt", text: "Create a simple receipt after a service payment or local job." },
        { title: "Deposit record", text: "Record a deposit amount, date, payment method, and description." },
        { title: "Reimbursement proof", text: "Make a printable receipt record for small reimbursements or shared expenses." },
      ],
      privacy: "The receipt is generated locally. Only generic description and note fields are eligible for optional AI suggestions.",
      faq: [
        { q: "Is this accounting software?", a: "No. It creates a simple printable receipt PDF and does not store bookkeeping records." },
        { q: "Can I use it for cash payments?", a: "Yes, choose cash or write another payment method, then keep signed copies as needed." },
        { q: "Does it store customer details?", a: "No. The tool runs in the browser and does not create an account or receipt archive." },
      ],
    },
    "timesheet-generator": {
      useCases: [
        { title: "Freelance hours", text: "Track day, project, hours, and notes for a client approval record." },
        { title: "Staff timesheet", text: "Create a printable weekly sheet for small teams that do not need payroll software." },
        { title: "Project log", text: "Group hours by project when you need a simple approval page." },
      ],
      faq: [
        { q: "Does the timesheet calculate totals?", a: "Yes. The PDF shows a total-hours line based on the rows you enter." },
        { q: "Can I use decimals?", a: "Yes. Hours such as 7.5 are supported." },
        { q: "Is it payroll software?", a: "No. It is a printable record only. Confirm hours and payroll rules separately." },
      ],
    },
    "certificate-generator": {
      useCases: [
        { title: "Classroom award", text: "Create a quick completion, participation, kindness, or reading certificate." },
        { title: "Workshop certificate", text: "Print an award or participation record after a small event." },
        { title: "Club recognition", text: "Make a simple printable certificate without buying a template pack." },
      ],
      faq: [
        { q: "Can I print it on regular paper?", a: "Yes. The design is built for ordinary US Letter or A4 paper." },
        { q: "Does it use copyrighted artwork?", a: "No. The default certificate uses simple code-driven borders and text." },
        { q: "Can I use it for official credentials?", a: "Only use it for events or recognition you are authorized to issue. It is not a licensing system." },
      ],
    },
    "todo-list": {
      useCases: [
        { title: "Daily checklist", text: "Print a short task list for errands, home projects, or focused work." },
        { title: "Event prep", text: "Group before, during, and after tasks for a small event or workshop." },
        { title: "Study session", text: "Break a study block into preparation, practice, and finish steps." },
      ],
      faq: [
        { q: "How should I enter sections?", a: "Use one line per section, such as Errands: grocery, post office, return item." },
        { q: "How many sections fit?", a: "The PDF shows up to six sections clearly on one page." },
        { q: "Can I use it every day?", a: "Yes. Edit the form and download a fresh one-page checklist whenever needed." },
      ],
    },
    "name-tracing": {
      useCases: [
        { title: "Preschool practice", text: "Create a familiar handwriting warmup using a child's name or short word." },
        { title: "Take-home page", text: "Print one simple worksheet for quick daily practice." },
        { title: "Letter confidence", text: "Use tracing lines and blank lines to build pencil control." },
      ],
    },
    "chore-chart": {
      useCases: [
        { title: "Family chores", text: "List weekly tasks and make progress visible with daily checkboxes." },
        { title: "Roommates", text: "Use one page for shared chores without needing another app." },
        { title: "Classroom jobs", text: "Assign helpers and rotate responsibilities across the week." },
      ],
    },
    "reward-chart": {
      useCases: [
        { title: "Sticker chart", text: "Track one clear behavior with a short, visible reward target." },
        { title: "Reading goal", text: "Use boxes for reading practice, bedtime routines, or kindness goals." },
        { title: "Classroom behavior", text: "Print a simple progress chart for a small group or individual student." },
      ],
    },
    flashcards: {
      useCases: [
        { title: "Vocabulary review", text: "Create cut-out cards for words, definitions, language practice, or memory games." },
        { title: "Classroom activity", text: "Print a small set for centers, tutoring, or homeschool practice." },
        { title: "Study deck starter", text: "Use one page to test a topic before creating a larger deck." },
      ],
    },
    "weekly-planner": {
      useCases: [
        { title: "Family week", text: "Plan appointments, errands, meals, school notes, and reminders." },
        { title: "Class planning", text: "Use day boxes for lessons, materials, or tutoring sessions." },
        { title: "Simple task view", text: "Keep one visible page for the week instead of a complicated planner app." },
      ],
    },
    "habit-tracker": {
      useCases: [
        { title: "Daily routines", text: "Track reading, water, walks, sleep routines, or practice habits." },
        { title: "Wellness check-in", text: "Use a simple grid to mark progress without turning it into a guilt chart." },
        { title: "Classroom practice", text: "Track repeatable student routines or reading goals." },
      ],
    },
  };
  return mergeDetails(shared, overrides[slug] || {});
}

function mergeDetails(base, override) {
  return {
    steps: override.steps || base.steps,
    useCases: override.useCases || base.useCases,
    privacy: override.privacy || base.privacy,
    limit: override.limit || base.limit,
    faq: override.faq || base.faq,
  };
}

function jsonLdHtml(payload) {
  return `<script type="application/ld+json">${escapeScript(JSON.stringify(payload))}</script>`;
}

function guideHtml(guide) {
  const slug = Object.keys(GUIDE_HINTS_FOR_LINKS).find((toolSlug) => {
    const hints = GUIDE_HINTS_FOR_LINKS[toolSlug] || [];
    return hints.some((hint) => guide.title.toLowerCase().includes(hint.toLowerCase()));
  });
  return `
      <article class="article-shell article">
        <a href="/guides/">All guides</a>
        <h1>${escapeHtml(guide.title)}</h1>
        <p class="lead">${escapeHtml(guide.description)}</p>
        <p>${escapeHtml(guide.intro)}</p>
        <h2>Use this guide with the free tools</h2>
        <p>PrintableTools Lab focuses on practical PDFs and image files that can be generated quickly, tested with real users, and improved based on downloads and Search Console data.</p>
        ${slug ? `<p><a class="button" href="/tools/${slug}/">Open related generator</a></p>` : ""}
      </article>`;
}

function guideIndexHtml() {
  return `
      <section class="shell page-title section">
        <h1>Printable guides</h1>
        <p>Short practical guides for parents, teachers, and organizers. These pages support real search intent while the tools validate demand.</p>
      </section>
      <section class="shell section">
        <h2>Search by use case</h2>
        <div class="grid-2">
          ${keywordClusters.map(keywordClusterHtml).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <div class="grid-3">
          ${guides.map((guide) => `<a class="guide-card" href="/${guide.path}/"><h3>${escapeHtml(guide.title)}</h3><p>${escapeHtml(guide.description)}</p></a>`).join("\n")}
        </div>
      </section>`;
}

function keywordClusterHtml(cluster) {
  return `<article class="panel keyword-cluster"><h3>${escapeHtml(cluster.title)}</h3><p>${escapeHtml(cluster.description)}</p><div class="cluster-links">${cluster.links.map(([label, href]) => `<a href="/${href}/">${escapeHtml(label)}</a>`).join("")}</div></article>`;
}

function uploadLimitShortcutsHtml(title = "Fast upload limit shortcuts", text = "Most visitors with a rejected upload already know the target size or file type. These direct routes lead to the free no-upload compressor or fixer that matches the error message.") {
  return `
      <section class="shell section">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(text)}</p>
        ${uploadLimitMatcherHtml()}
        <table class="event-table">
          <thead><tr><th>Upload message</th><th>Open</th><th>Why</th></tr></thead>
          <tbody>
            ${UPLOAD_LIMIT_DECISIONS.map(([message, href, label, why, trackTool]) => `<tr><td>${escapeHtml(message)}</td><td><a href="${escapeHtml(href)}" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(trackTool)}">${escapeHtml(label)}</a></td><td>${escapeHtml(why)}</td></tr>`).join("\n")}
          </tbody>
        </table>
        <div class="grid-3">
          ${UPLOAD_LIMIT_SHORTCUTS.map(([label, href, description, trackTool]) => `<article class="tool-card"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(description)}</p><a class="button" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(trackTool)}" href="${escapeHtml(href)}">Open fixer</a></article>`).join("\n")}
        </div>
      </section>`;
}

function uploadLimitMatcherHtml() {
  return `<div class="upload-limit-matcher" data-upload-limit-helper>
          <label class="field upload-limit-message-field">
            <span>Upload error text</span>
            <textarea data-upload-limit-input placeholder="PDF must be less than 1 MB"></textarea>
            <span class="help">Local text match only. The pasted message is not sent to the server.</span>
          </label>
          <div class="upload-limit-recommendation">
            <div data-upload-limit-result>
              ${uploadLimitRecommendationHtml(UPLOAD_LIMIT_MATCHER_DEFAULT)}
            </div>
            <div class="upload-limit-examples" aria-label="Common upload errors">
              ${UPLOAD_LIMIT_MATCHER_EXAMPLES.map((example) => `<button type="button" data-upload-limit-example="${escapeHtml(example)}">${escapeHtml(example)}</button>`).join("\n")}
            </div>
          </div>
        </div>`;
}

function uploadLimitRecommendationHtml(match) {
  return `<article class="upload-match-card">
                <span class="tag">${escapeHtml(match.badge)}</span>
                <h3>${escapeHtml(match.title)}</h3>
                <p>${escapeHtml(match.why)}</p>
                <a class="button" href="${escapeHtml(match.href)}" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(match.trackTool)}">${escapeHtml(match.label)}</a>
              </article>`;
}

function relatedGuideLinks(toolPath) {
  const slug = toolPath.replace(/^tools\//, "");
  const hints = GUIDE_HINTS_FOR_LINKS[slug] || [];
  return guides.filter((guide) => hints.some((hint) => guide.title.toLowerCase().includes(hint.toLowerCase()))).slice(0, 3);
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeScript(value) {
  return String(value).replace(/</g, "\\u003c");
}

module.exports = { routes, renderRoute, siteUrl, tools, guides, keywordClusters, landingPages, SITE_SUMMARY, DIGITAL_PRODUCTS, LOCAL_SELLER_STARTER_KIT, CUSTOM_LOCAL_PRINT_PACK_SERVICE, PAID_SERVICES, MARKET_TABLE_PRINT_AUDIT, SERVICE_SALES_PACK, productCheckoutRequestUrl, productCheckoutRequestCopy, productCheckoutEmailUrl, serviceRequestUrl, serviceRequestCopy, serviceRequestEmailUrl, marketTableAuditRequestUrl, marketTableAuditRequestCopy, marketTableAuditChecklist, servicePaymentReplyCopy, serviceFulfillmentChecklistCopy, serviceOrderPipeline, serviceOutreachQueue, serviceOutreachBatchCopy, ZERO_DOMAIN_GAME_EXPERIMENT, ZERO_DOMAIN_GAME_EXPERIMENTS, PLATFORM_SUBMIT_QUEUE, ZERO_DOMAIN_PLATFORM_STRATEGY, PLATFORM_OUTREACH_TRACKER, PLATFORM_SUBMIT_COCKPIT, PORTAL_SUBMISSION_PACK, ZERO_COST_MONETIZATION_MAP, HIGH_INTENT_TOOL_PATHS, HIGH_INTENT_LANDING_PATHS, SHARE_KIT_FEATURED_LINKS, SHARE_KIT_POSTS, SHARE_KIT_RULES, ORGANIC_PUSH_TASKS, UPLOAD_ERROR_CHEATSHEET, CAMPAIGN_VIDEO_ASSETS, GIST_DISCOVERY, ISSUE_DISCOVERY, SPONSOR_PLACEMENTS, SPONSOR_DEALS, SPONSOR_OUTREACH_TARGETS, SPONSOR_OUTREACH_TEMPLATES, SPONSOR_VERTICALS, SPONSOR_CALL_ACTIONS, SPONSOR_DISCOVERY_LINKS, sponsorMediaKitPayload, sponsorCallPayload, sponsorOpportunityPayload, sponsorDealRoomPayload };
