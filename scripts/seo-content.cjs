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
  packageReportPath: "assets/digital-products/local-seller-starter-kit-package.json",
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
  checkoutUrl: configuredServiceCheckoutUrl("custom-local-print-pack"),
  contactEmail: configuredContactEmail(),
  publicRequestPath: "assets/services/custom-local-print-pack-request.txt",
  publicPaymentReplyPath: "assets/services/custom-local-print-pack-payment-reply.txt",
  publicFulfillmentChecklistPath: "assets/services/custom-local-print-pack-fulfillment-checklist.txt",
  publicOrderPipelinePath: "assets/services/custom-local-print-pack-order-pipeline.json",
  publicOutreachQueuePath: "assets/services/custom-local-print-pack-outreach-queue.json",
  publicOutreachBatchPath: "assets/services/custom-local-print-pack-outreach-batch.txt",
  publicSampleDeliveryPath: "assets/services/custom-local-print-pack-sample-delivery.zip",
  publicDeliveryInputExamplePath: "assets/services/custom-local-print-pack-delivery-input.example.json",
  publicDeliveryReportPath: "assets/services/custom-local-print-pack-sample-delivery.json",
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

const INVOICE_FOLLOWUP_COPY_PACK_SERVICE = {
  id: "invoice-followup-copy-pack",
  slug: "invoice-followup-copy-pack",
  name: "Invoice Follow-up Copy Pack",
  headline: "Invoice Follow-up Copy Pack for freelancers and small teams",
  shortDescription: "A $19 manual copy pack request for one invoice workflow: polite payment reminder, due-today note, overdue follow-up, paid thank-you, and next-invoice wording.",
  description: "A tiny done-for-you service for people who just made an invoice and need professional follow-up words without asking for legal, tax, collection, or accounting advice. The buyer sends public-safe context, preferred tone, due date, and invoice status; the seller returns editable reminder copy they can review and send themselves.",
  priceUsd: 19,
  currency: "USD",
  checkoutUrl: configuredServiceCheckoutUrl("invoice-followup-copy-pack"),
  contactEmail: configuredContactEmail(),
  publicRequestPath: "assets/services/invoice-followup-copy-pack-request.txt",
  publicPaymentReplyPath: "assets/services/invoice-followup-copy-pack-payment-reply.txt",
  publicFulfillmentChecklistPath: "assets/services/invoice-followup-copy-pack-fulfillment-checklist.txt",
  publicOrderPipelinePath: "assets/services/invoice-followup-copy-pack-order-pipeline.json",
  publicOutreachQueuePath: "assets/services/invoice-followup-copy-pack-outreach-queue.json",
  publicOutreachBatchPath: "assets/services/invoice-followup-copy-pack-outreach-batch.txt",
  publicSampleDeliveryPath: "assets/services/invoice-followup-copy-pack-sample-delivery.zip",
  publicDeliveryInputExamplePath: "assets/services/invoice-followup-copy-pack-delivery-input.example.json",
  publicDeliveryReportPath: "assets/services/invoice-followup-copy-pack-sample-delivery.json",
  issueTemplatePath: ".github/ISSUE_TEMPLATE/invoice-followup-copy-pack-service.yml",
  issueFormUrl: "https://github.com/yanqr213/printable-tools-lab/issues/new?template=invoice-followup-copy-pack-service.yml",
  turnaround: "Target delivery is 1 business day after real payment and complete public-safe details.",
  deliverables: [
    "one polite payment reminder email",
    "one due-today payment note",
    "one first overdue follow-up",
    "one paid thank-you message",
    "one next-invoice or recurring-work note",
  ],
  buyerInputs: [
    "public-safe business or project name",
    "invoice status: draft, sent, due today, overdue, or paid",
    "preferred tone: friendly, firm, concise, or warm",
    "payment method wording that does not include private account details",
    "need-by date or follow-up timeline",
  ],
  relatedTools: [
    "tools/invoice-generator",
    "tools/invoice-followup-email",
    "tools/estimate-generator",
    "tools/receipt-generator",
    "tools/work-order",
    "tools/timesheet-generator",
    "tools/qr-code",
  ],
  riskControls: [
    "The service provides editable communication copy only, not legal, tax, accounting, debt-collection, or financial advice.",
    "Do not send invoice numbers, customer private data, bank details, card data, tax IDs, identity documents, or full client lists.",
    "The buyer must review every message for accuracy, tone, jurisdiction, and client relationship before sending.",
    "The service does not contact the buyer's client, collect payments, or guarantee payment outcomes.",
    "Work starts only after a real external checkout or invoice is paid and verified.",
  ],
  successGate: "Revenue is proven only after a real payment provider shows a paid order, payout balance, or settled payment for this invoice follow-up service.",
};

const UPLOAD_LIMIT_FIX_PLAN_SERVICE = {
  id: "upload-limit-fix-plan",
  slug: "upload-limit-fix-plan",
  name: "Upload Limit Fix Plan",
  headline: "Upload Limit Fix Plan for rejected PDFs, images, and portal files",
  shortDescription: "A $9 public-safe fix plan for one upload error: which free tool to use, target settings, fallback steps, and a review checklist.",
  description: "A tiny manual service for people blocked by a file upload error and unsure which no-upload tool or settings to use. The buyer sends only public-safe error text, file type, target size or dimensions, and deadline; the response is a step-by-step plan they can run on their own file.",
  priceUsd: 9,
  currency: "USD",
  checkoutUrl: configuredServiceCheckoutUrl("upload-limit-fix-plan"),
  contactEmail: configuredContactEmail(),
  publicRequestPath: "assets/services/upload-limit-fix-plan-request.txt",
  publicPaymentReplyPath: "assets/services/upload-limit-fix-plan-payment-reply.txt",
  publicFulfillmentChecklistPath: "assets/services/upload-limit-fix-plan-fulfillment-checklist.txt",
  publicOrderPipelinePath: "assets/services/upload-limit-fix-plan-order-pipeline.json",
  publicOutreachQueuePath: "assets/services/upload-limit-fix-plan-outreach-queue.json",
  publicOutreachBatchPath: "assets/services/upload-limit-fix-plan-outreach-batch.txt",
  publicSampleDeliveryPath: "assets/services/upload-limit-fix-plan-sample-delivery.zip",
  publicDeliveryInputExamplePath: "assets/services/upload-limit-fix-plan-delivery-input.example.json",
  publicDeliveryReportPath: "assets/services/upload-limit-fix-plan-sample-delivery.json",
  issueTemplatePath: ".github/ISSUE_TEMPLATE/upload-limit-fix-plan-service.yml",
  issueFormUrl: "https://github.com/yanqr213/printable-tools-lab/issues/new?template=upload-limit-fix-plan-service.yml",
  turnaround: "Target delivery is same business day after real payment and complete public-safe upload-error details.",
  deliverables: [
    "one best-fit free tool recommendation",
    "target settings for size, format, dimensions, or page count",
    "fallback path if the first pass still fails",
    "review-before-upload checklist",
  ],
  buyerInputs: [
    "public-safe upload error text",
    "file type: PDF, JPG, PNG, screenshot, resume, passport-style photo, or other",
    "target file size, dimensions, accepted format, or portal rule",
    "what the file is for in broad terms, without private content",
    "need-by time or submission deadline",
  ],
  relatedTools: [
    "upload-limit-fixer",
    "tools/compress-pdf",
    "tools/compress-image-to-kb",
    "tools/resize-image",
    "tools/convert-image",
    "tools/pdf-to-images",
    "tools/image-to-pdf",
  ],
  riskControls: [
    "The service provides a public-safe troubleshooting plan only; the buyer runs the tools on their own device.",
    "Do not upload, email, paste, or attach the actual blocked PDF, image, ID photo, resume, private form, or portal account details.",
    "The buyer must review the final file before uploading it to the destination website.",
    "The plan cannot guarantee that a third-party portal, school, employer, marketplace, email provider, or government website will accept the file.",
    "No legal, immigration, employment, tax, accounting, medical, or official document acceptance advice is included.",
  ],
  successGate: "Revenue is proven only after a real payment provider shows a paid order, payout balance, or settled payment for this upload limit fix plan.",
};

const PAID_SERVICES = [CUSTOM_LOCAL_PRINT_PACK_SERVICE, INVOICE_FOLLOWUP_COPY_PACK_SERVICE, UPLOAD_LIMIT_FIX_PLAN_SERVICE];

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
  githubPagesDeliveryReportUrl: "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-sample-delivery.json",
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
    ["Sample delivery report", "https://yanqr213.github.io/printable-tools-lab/assets/services/custom-local-print-pack-sample-delivery.json"],
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

function configuredServiceCheckoutUrl(serviceId = "") {
  const envByService = {
    "custom-local-print-pack": process.env.PUBLIC_CUSTOM_LOCAL_PRINT_PACK_CHECKOUT_URL || process.env.PUBLIC_CUSTOM_PRINT_PACK_CHECKOUT_URL || "",
    "invoice-followup-copy-pack": process.env.PUBLIC_INVOICE_FOLLOWUP_COPY_PACK_CHECKOUT_URL || process.env.PUBLIC_INVOICE_FOLLOWUP_CHECKOUT_URL || "",
    "upload-limit-fix-plan": process.env.PUBLIC_UPLOAD_LIMIT_FIX_PLAN_CHECKOUT_URL || process.env.PUBLIC_UPLOAD_FIX_PLAN_CHECKOUT_URL || "",
  };
  const envUrl = (envByService[serviceId] || process.env.PUBLIC_SERVICE_CHECKOUT_URL || "").trim();
  if (envUrl) return envUrl;
  const configPath = path.join(__dirname, "..", "site-config.js");
  if (!fs.existsSync(configPath)) return "";
  const source = fs.readFileSync(configPath, "utf8");
  const keyByService = {
    "custom-local-print-pack": "customPrintPackCheckoutUrl",
    "invoice-followup-copy-pack": "invoiceFollowupCheckoutUrl",
    "upload-limit-fix-plan": "uploadLimitFixPlanCheckoutUrl",
  };
  const serviceKey = keyByService[serviceId];
  if (serviceKey) {
    const serviceMatch = source.match(new RegExp(`${serviceKey}:\\s*"([^"]*)"`));
    if (serviceMatch && serviceMatch[1].trim()) return serviceMatch[1].trim();
  }
  if (serviceId === "custom-local-print-pack" || !serviceId) {
    const legacyCustomMatch = source.match(/customPrintPackCheckoutUrl:\s*"([^"]*)"/);
    if (legacyCustomMatch && legacyCustomMatch[1].trim()) return legacyCustomMatch[1].trim();
    const match = source.match(/serviceCheckoutUrl:\s*"([^"]*)"/);
    return match ? match[1].trim() : "";
  }
  return "";
}

function configuredAuditUpgradeCheckoutUrl() {
  const envUrl = (process.env.PUBLIC_AUDIT_UPGRADE_CHECKOUT_URL || process.env.PUBLIC_CUSTOM_LOCAL_PRINT_PACK_CHECKOUT_URL || process.env.PUBLIC_CUSTOM_PRINT_PACK_CHECKOUT_URL || process.env.PUBLIC_SERVICE_CHECKOUT_URL || "").trim();
  if (envUrl) return envUrl;
  const configPath = path.join(__dirname, "..", "site-config.js");
  if (!fs.existsSync(configPath)) return "";
  const source = fs.readFileSync(configPath, "utf8");
  const upgradeMatch = source.match(/auditUpgradeCheckoutUrl:\s*"([^"]*)"/);
  if (upgradeMatch && upgradeMatch[1].trim()) return upgradeMatch[1].trim();
  const customMatch = source.match(/customPrintPackCheckoutUrl:\s*"([^"]*)"/);
  if (customMatch && customMatch[1].trim()) return customMatch[1].trim();
  const serviceMatch = source.match(/serviceCheckoutUrl:\s*"([^"]*)"/);
  return serviceMatch ? serviceMatch[1].trim() : "";
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
  if (service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id) {
    return [
      `I want a free fit check for the ${service.name} ($${service.priceUsd} ${service.currency} only if it fits).`,
      "",
      "Public-safe upload error text:",
      "File type: PDF / JPG / PNG / screenshot / resume / passport photo / other",
      "Target rule from the portal: file size / dimensions / accepted format / page count",
      "What the file is for, in broad terms:",
      "What have you already tried?",
      "Need-by time or deadline:",
      "If it fits, preferred external checkout provider: Gumroad / Payhip / Ko-fi / Stripe / invoice / other",
      "Best contact method:",
      "Notes:",
      "",
      "No payment is collected by this request. Please review fit first; send a real external checkout or invoice link only if the service is useful and available.",
      "Do not include or attach the actual file, ID photo, resume, private form, portal login, account details, tax IDs, bank details, card data, or private identity details.",
    ].join("\n");
  }
  if (service.id === INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id) {
    return [
      `I want a free fit check for the ${service.name} ($${service.priceUsd} ${service.currency} only if it fits).`,
      "",
      "Business or project name:",
      "Invoice status: draft / sent / due today / overdue / paid / recurring",
      "Preferred tone: friendly / firm / concise / warm",
      "What kind of follow-up do you need?",
      "Payment method wording to mention, without private account details:",
      "Need-by date or follow-up timeline:",
      "If it fits, preferred external checkout provider: Gumroad / Payhip / Ko-fi / Stripe / invoice / other",
      "Best contact method:",
      "Notes:",
      "",
      "No payment is collected by this request. Please review fit first; send a real external checkout or invoice link only if the service is useful and available.",
      "Do not include invoice numbers, bank details, card data, tax IDs, client private data, private customer lists, or legal dispute details.",
    ].join("\n");
  }
  return [
    `I want a free fit check for the ${service.name} ($${service.priceUsd} ${service.currency} only if it fits).`,
    "",
    "Business, booth, event, or service name:",
    "What do you sell or promote?",
    "Up to 12 items/services with prices:",
    "Link or contact method for QR sign wording:",
    "Preferred style: clean / cute / bold / minimal / local / premium / practical",
    "Need-by date:",
    "If it fits, preferred external checkout provider: Gumroad / Payhip / Ko-fi / Stripe / invoice / other",
    "Best contact method:",
    "Country or region (optional):",
    "Notes:",
    "",
    "No payment is collected by this request. Please review fit first; send a real external checkout or invoice link only if the service is useful and available.",
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
  if (service.issueTemplatePath) url.searchParams.set("template", path.basename(service.issueTemplatePath));
  url.searchParams.set("title", `Service request: ${service.name}`);
  url.searchParams.set("body", serviceRequestCopy(service));
  url.searchParams.set("labels", "service-request,business-review");
  return url.toString();
}

function serviceLeadTitle(serviceType) {
  if (serviceType === "upload-limit-fix-plan") return UPLOAD_LIMIT_FIX_PLAN_SERVICE.name;
  if (serviceType === "invoice-followup-copy-pack") return INVOICE_FOLLOWUP_COPY_PACK_SERVICE.name;
  if (serviceType === "market-table-print-audit") return MARKET_TABLE_PRINT_AUDIT.name;
  if (serviceType === "local-seller-starter-kit") return LOCAL_SELLER_STARTER_KIT.name;
  return CUSTOM_LOCAL_PRINT_PACK_SERVICE.name;
}

function serviceLeadTrackEvent(serviceType) {
  if (serviceType === "market-table-print-audit") return "audit_request_intent";
  if (serviceType === "local-seller-starter-kit") return "seller_checkout_intent";
  return "service_request_intent";
}

function serviceLeadTrackTool(serviceType) {
  if (serviceType === "upload-limit-fix-plan") return UPLOAD_LIMIT_FIX_PLAN_SERVICE.id;
  if (serviceType === "invoice-followup-copy-pack") return INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id;
  if (serviceType === "market-table-print-audit") return MARKET_TABLE_PRINT_AUDIT.id;
  if (serviceType === "local-seller-starter-kit") return LOCAL_SELLER_STARTER_KIT.id;
  return CUSTOM_LOCAL_PRINT_PACK_SERVICE.id;
}

function serviceLeadFallbackText(serviceType, pathName, options = {}) {
  const sourcePath = pathName === "/" ? "" : (pathName || serviceType);
  const requestSummary = String(options.requestSummary || "").trim();
  const requestedNextStep = String(options.requestedNextStep || "").trim() || "Request service fit review";
  const invoiceRequest = Boolean(options.invoiceLinkRequest) || /invoice|checkout/i.test(requestedNextStep);
  return [
    invoiceRequest ? "Public-safe invoice request." : "Public-safe service request.",
    "",
    `Service: ${serviceLeadTitle(serviceType)}`,
    "Business or project:",
    "Public contact: add only if you want it visible in a public GitHub issue",
    "Need-by / timeline:",
    `Source path: ${siteUrl(sourcePath)}`,
    `Requested next step: ${requestedNextStep}`,
    "",
    "Request note:",
    requestSummary,
    "Do not include payment, tax, bank, phone, identity, password, customer-list, or private file data in this public issue.",
  ].join("\n");
}

function serviceLeadFallbackUrl(serviceTypeOrOptions, pathName) {
  const input = typeof serviceTypeOrOptions === "object" && serviceTypeOrOptions ? serviceTypeOrOptions : {};
  const serviceType = input.serviceType || serviceTypeOrOptions;
  const sourcePath = input.pathName || input.path || pathName;
  const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
  const invoiceRequest = Boolean(input.invoiceLinkRequest) || /invoice|checkout/i.test(String(input.requestedNextStep || ""));
  const titlePrefix = serviceType === "market-table-print-audit" ? "Audit request" : serviceType === "local-seller-starter-kit" ? "Seller kit request" : invoiceRequest ? "Invoice request" : "Service request";
  url.searchParams.set("title", `${titlePrefix}: ${serviceLeadTitle(serviceType)}`);
  url.searchParams.set("body", serviceLeadFallbackText(serviceType, sourcePath, input));
  url.searchParams.set("labels", "service-request,business-review");
  return url.toString();
}

function serviceInvoiceRequestUrl(serviceTypeOrOptions, pathName) {
  const input = typeof serviceTypeOrOptions === "object" && serviceTypeOrOptions ? serviceTypeOrOptions : {};
  const serviceType = input.serviceType || serviceTypeOrOptions;
  const price = serviceType === "upload-limit-fix-plan"
    ? "$9"
    : serviceType === "invoice-followup-copy-pack"
      ? "$19"
      : serviceType === "custom-local-print-pack"
        ? "$29"
        : "";
  return serviceLeadFallbackUrl({
    ...input,
    serviceType,
    pathName: input.pathName || input.path || pathName,
    invoiceLinkRequest: true,
    requestedNextStep: `Request external ${price} checkout or invoice link after fit is confirmed`,
    requestSummary: [
      input.requestSummary || "",
      "",
      `Requested next step: request external ${price} checkout or invoice link after fit is confirmed.`,
      "Payment must happen only through a real external provider or invoice. This public issue must not include card, bank, payout, tax, identity, password, customer-list, private file, or private account data.",
    ].filter(Boolean).join("\n").trim(),
  });
}

function serviceLeadFormHtml({ serviceType, title, cta, intro, placeholder, pathName, defaultSummary = "", utmSource = "landing-page", utmMedium = "site", utmCampaign, utmContent }) {
  const eventName = serviceLeadTrackEvent(serviceType);
  const tool = serviceLeadTrackTool(serviceType);
  const price = serviceType === "upload-limit-fix-plan" ? "$9" : serviceType === "invoice-followup-copy-pack" ? "$19" : "";
  const slugPath = String(pathName || serviceType).replace(/^\/+|\/+$/g, "");
  const sourcePath = `/${slugPath}/`;
  const content = utmContent || `${slugPath}-service-request`;
  const campaign = utmCampaign || serviceLeadCampaign(serviceType);
  const fallbackUrl = serviceLeadFallbackUrl({
    serviceType,
    pathName: sourcePath,
    requestSummary: defaultSummary,
    utmSource,
    utmMedium,
    utmCampaign: campaign,
    utmContent: content,
  });
  const invoiceRequestUrl = price ? serviceInvoiceRequestUrl({
    serviceType,
    pathName: sourcePath,
    requestSummary: defaultSummary,
    utmSource,
    utmMedium,
    utmCampaign: campaign,
    utmContent: `${slugPath}-invoice-request`,
  }) : "";
  const primaryInvoiceFallback = serviceType === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id;
  const publicFallbackUrl = primaryInvoiceFallback ? invoiceRequestUrl : fallbackUrl;
  const publicFallbackEvent = primaryInvoiceFallback ? "service_invoice_request" : eventName;
  const publicFallbackLabel = primaryInvoiceFallback ? `Open public-safe ${price} invoice request` : "Open public-safe request";
  const primaryInvoiceAttr = primaryInvoiceFallback ? ' data-service-primary-invoice-request="true"' : "";
  const oneContactInvoiceRequest = primaryInvoiceFallback;
  const primarySubmitEvent = oneContactInvoiceRequest ? "service_invoice_request" : eventName;
  const primarySubmitText = oneContactInvoiceRequest ? `Request ${price} invoice link` : cta;
  const primaryInvoiceSubmitAttrs = oneContactInvoiceRequest ? ` data-service-invoice-submit data-invoice-fallback-url="${escapeHtml(invoiceRequestUrl)}"` : "";
  const secondaryInvoiceButton = invoiceRequestUrl && !oneContactInvoiceRequest
    ? `<button class="button secondary" type="submit" data-service-invoice-submit data-track-tool="${escapeHtml(tool)}" data-invoice-fallback-url="${escapeHtml(invoiceRequestUrl)}">Request ${escapeHtml(price)} invoice link</button>`
    : "";
  const actionButtons = [
    `<button class="button" type="submit" data-track-event="${escapeHtml(primarySubmitEvent)}" data-track-tool="${escapeHtml(tool)}"${primaryInvoiceSubmitAttrs}>${escapeHtml(primarySubmitText)}</button>`,
    secondaryInvoiceButton,
    `<a class="button ghost" data-service-lead-fallback-link data-track-event="${escapeHtml(publicFallbackEvent)}" data-track-tool="${escapeHtml(tool)}" href="${escapeHtml(publicFallbackUrl)}" target="_blank" rel="noreferrer">${escapeHtml(publicFallbackLabel)}</a>`,
  ].filter(Boolean).join("\n              ");
  const businessNameField = oneContactInvoiceRequest
    ? `<input type="hidden" name="businessName" value="">`
    : `<label class="field">
              <span>Business or project (optional)</span>
              <input name="businessName" maxlength="90" autocomplete="organization" placeholder="Market booth, service name, or shop">
            </label>`;
  const requestSummaryField = oneContactInvoiceRequest
    ? `<input type="hidden" name="requestSummary" value="${escapeHtml(defaultSummary)}" data-upload-fix-plan-summary>
            <p class="notice compact-notice">One-contact $9 invoice request: the public-safe upload fix note is already written. Add a reply email, @handle, or public contact URL to request the external invoice link after fit is confirmed.</p>`
    : `<label class="field">
              <span>What do you need?</span>
              <textarea name="requestSummary" maxlength="1000" required placeholder="${escapeHtml(placeholder)}">${escapeHtml(defaultSummary)}</textarea>
            </label>`;
  const needByField = oneContactInvoiceRequest
    ? `<input type="hidden" name="needBy" value="">`
    : `<label class="field">
              <span>Need-by date (optional)</span>
              <input name="needBy" maxlength="80" placeholder="Event date, this week, this month">
            </label>`;
  const consentField = oneContactInvoiceRequest
    ? `<input type="hidden" name="consent" value="on">
            <p class="help compact-consent-note">By sending, you confirm no actual file, private document, ID photo, resume, portal login, payment, tax, identity, customer-list, or account details are included.</p>`
    : `<label class="check-row">
              <input name="consent" type="checkbox" required>
              <span>I will keep payment, tax, identity, passwords, customer lists, and private files outside this form.</span>
            </label>`;
  const contactLabel = oneContactInvoiceRequest ? `Where should the external ${price} invoice link go?` : "Reply email, @handle, or public contact URL";
  return `<section class="shell section service-lead-section" id="service-request">
        <div class="grid-2">
          <div>
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(intro)}</p>
            <ul>
              <li>No payment is collected here.</li>
              <li>Use an email, website contact page, or public handle for follow-up.</li>
              <li>Do not send payment, tax, bank, identity, password, customer-list, or private file data.</li>
            </ul>
          </div>
          <form class="panel form-grid service-lead-form" data-service-lead-form${primaryInvoiceAttr} data-service-type="${escapeHtml(serviceType)}" data-lead-path="${escapeHtml(sourcePath)}" data-utm-source="${escapeHtml(utmSource)}" data-utm-medium="${escapeHtml(utmMedium)}" data-utm-campaign="${escapeHtml(campaign)}" data-utm-content="${escapeHtml(content)}" data-service-fallback-url="${escapeHtml(publicFallbackUrl)}"${invoiceRequestUrl ? ` data-service-invoice-fallback-url="${escapeHtml(invoiceRequestUrl)}"` : ""}>
            <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
            <input type="hidden" name="serviceType" value="${escapeHtml(serviceType)}">
            <input type="hidden" name="utmSource" value="${escapeHtml(utmSource)}">
            <input type="hidden" name="utmMedium" value="${escapeHtml(utmMedium)}">
            <input type="hidden" name="utmCampaign" value="${escapeHtml(campaign)}">
            <input type="hidden" name="utmContent" value="${escapeHtml(content)}">
            <label class="field">
              <span>${escapeHtml(contactLabel)}</span>
              <input name="contact" maxlength="180" autocomplete="email" placeholder="you@example.com, @publichandle, or https://example.com/contact" required>
            </label>
            ${businessNameField}
            ${requestSummaryField}
            ${needByField}
            ${consentField}
            <div class="actions">
              ${actionButtons}
            </div>
            <p class="help service-lead-status" data-service-lead-status role="status" aria-live="polite">No payment is collected here. A real external checkout or invoice is sent only after fit is confirmed.</p>
          </form>
        </div>
      </section>`;
}

function serviceLeadCampaign(serviceType) {
  if (serviceType === "upload-limit-fix-plan") return "upload_limit_fix_plan";
  if (serviceType === "invoice-followup-copy-pack") return "invoice_followup_service";
  if (serviceType === "market-table-print-audit") return "market_table_audit";
  if (serviceType === "local-seller-starter-kit") return "seller_kit";
  return "service_request";
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
  const isUploadLimitFix = service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id;
  const isInvoiceFollowup = service.id === INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id;
  const serviceFieldCopy = isUploadLimitFix ? {
    businessLabel: "Public-safe project label",
    businessPlaceholder: "Job portal resume upload",
    sellsLabel: "Upload error text",
    sellsPlaceholder: "File must be less than 1 MB, or image dimensions must be 600 x 600 px",
    itemsLabel: "File type and target rule",
    itemsPlaceholder: "PDF resume, target under 1MB. Portal accepts PDF only. I do not need to share the actual resume.",
    contactLabel: "What have you already tried?",
    contactPlaceholder: "Tried reducing image quality once; still over the limit.",
    styleLabel: "Blocked file type",
    styleOptions: ["PDF", "JPG", "PNG", "screenshot", "resume PDF", "passport photo", "other"],
    dateLabel: "Need-by time or deadline",
    datePlaceholder: "Today, tomorrow morning, or before the application deadline",
    preferencePlaceholder: "Public email, website contact page, or GitHub issue reply",
    notesPlaceholder: "Do not attach the file, ID photo, resume, private form, account login, tax ID, bank details, or portal credentials.",
  } : isInvoiceFollowup ? {
    businessLabel: "Business, client-work, or project name",
    businessPlaceholder: "Freelance design project",
    sellsLabel: "What kind of invoice follow-up do you need?",
    sellsPlaceholder: "Friendly reminder for a sent invoice plus a firmer first overdue follow-up",
    itemsLabel: "Invoice status and public-safe context",
    itemsPlaceholder: "Invoice sent last week; due this Friday; client usually pays by bank transfer. No private invoice or client details included.",
    contactLabel: "Payment wording to mention without private details",
    contactPlaceholder: "Please use the payment link or invoice portal already sent.",
    styleLabel: "Preferred tone",
    styleOptions: ["friendly", "firm", "concise", "warm"],
    dateLabel: "Need-by date or follow-up timeline",
    datePlaceholder: "Tomorrow morning or before the due date",
    preferencePlaceholder: "Public email, website contact page, or GitHub issue reply",
    notesPlaceholder: "Avoid invoice numbers, client names, bank details, tax IDs, legal dispute details, and private customer data.",
  } : {
    businessLabel: "Business, booth, event, or service name",
    businessPlaceholder: "Sunny Table Bakes",
    sellsLabel: "What do you sell or promote?",
    sellsPlaceholder: "Cookies, market boxes, and weekend pickup orders",
    itemsLabel: "Up to 12 items or services with prices",
    itemsPlaceholder: "Chocolate chip cookie bag - $6\nBrownie box - $10\nMarket bundle - 2 for $15",
    contactLabel: "QR sign link or public-safe contact method",
    contactPlaceholder: "Public shop link, booking page, or contact page",
    styleLabel: "Preferred style",
    styleOptions: ["clean", "cute", "bold", "minimal", "local", "premium", "practical"],
    dateLabel: "Need-by date",
    datePlaceholder: "June 22 market",
    preferencePlaceholder: "Reply in GitHub issue, public email, or public website contact page",
    notesPlaceholder: "Avoid private customer details, tax IDs, account logins, payment data, and private addresses.",
  };
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
              <label for="service-business">${escapeHtml(serviceFieldCopy.businessLabel)}</label>
              <input id="service-business" name="business" autocomplete="organization" placeholder="${escapeHtml(serviceFieldCopy.businessPlaceholder)}">
            </div>
            <div class="field">
              <label for="service-sells">${escapeHtml(serviceFieldCopy.sellsLabel)}</label>
              <textarea id="service-sells" name="sells" placeholder="${escapeHtml(serviceFieldCopy.sellsPlaceholder)}"></textarea>
            </div>
            <div class="field">
              <label for="service-items">${escapeHtml(serviceFieldCopy.itemsLabel)}</label>
              <textarea id="service-items" name="items" placeholder="${escapeHtml(serviceFieldCopy.itemsPlaceholder)}"></textarea>
            </div>
            <div class="field">
              <label for="service-contact">${escapeHtml(serviceFieldCopy.contactLabel)}</label>
              <input id="service-contact" name="contact" placeholder="${escapeHtml(serviceFieldCopy.contactPlaceholder)}">
            </div>
            <div class="field">
              <label for="service-style">${escapeHtml(serviceFieldCopy.styleLabel)}</label>
              <select id="service-style" name="style">
                ${serviceFieldCopy.styleOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join("\n                ")}
              </select>
            </div>
            <div class="field">
              <label for="service-date">${escapeHtml(serviceFieldCopy.dateLabel)}</label>
              <input id="service-date" name="date" placeholder="${escapeHtml(serviceFieldCopy.datePlaceholder)}">
            </div>
            <div class="field">
              <label for="service-checkout">If it fits, preferred external checkout provider</label>
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
              <input id="service-preference" name="preference" placeholder="${escapeHtml(serviceFieldCopy.preferencePlaceholder)}">
            </div>
            <div class="field">
              <label for="service-region">Country or region (optional)</label>
              <input id="service-region" name="region" placeholder="Optional">
            </div>
            <div class="field">
              <label for="service-notes">Notes</label>
              <textarea id="service-notes" name="notes" placeholder="${escapeHtml(serviceFieldCopy.notesPlaceholder)}"></textarea>
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
  if (service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id) {
    return [
      `Subject: ${service.name} - fit confirmed, payment link before work starts`,
      "",
      "Thanks for sending the public-safe upload error details. This looks like it may fit the small fix-plan scope.",
      "",
      "Scope after payment:",
      ...service.deliverables.map((item) => `- ${item}`),
      "",
      `Price: $${service.priceUsd} ${service.currency}`,
      service.turnaround,
      "",
      "Next step:",
      "1. I will send one real external checkout or invoice link from Gumroad, Payhip, Ko-fi, Stripe, or an invoice provider.",
      "2. Please pay only through that external provider. Do not send or attach the actual file, card, bank, payout, tax, identity, portal login, resume, ID photo, or private form details in GitHub or email.",
      "3. After the provider shows the order as paid, I will mark the request as paid_order_verified and prepare the fix plan.",
      "",
      "Before I send the checkout link, please confirm:",
      "- You need a troubleshooting plan only; you will run the free tools on your own device.",
      "- You will review the final file before uploading it to the destination website.",
      "- No private files, ID photos, resumes, portal credentials, tax IDs, bank details, or account details are included.",
      "",
      "Revenue is counted only after the external provider shows a paid order, payout balance, or settled payment.",
    ].join("\n");
  }
  if (service.id === INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id) {
    return [
      `Subject: ${service.name} - fit confirmed, payment link before work starts`,
      "",
      "Thanks for sending the public-safe invoice follow-up request. This looks like it may fit the simple copy-pack scope.",
      "",
      "Scope after payment:",
      ...service.deliverables.map((item) => `- ${item}`),
      "",
      `Price: $${service.priceUsd} ${service.currency}`,
      service.turnaround,
      "",
      "Next step:",
      "1. I will send one real external checkout or invoice link from Gumroad, Payhip, Ko-fi, Stripe, or an invoice provider.",
      "2. Please pay only through that external provider. Do not post card, bank, payout, tax, identity, customer, or private invoice details in GitHub or email.",
      "3. After the provider shows the order as paid, I will mark the request as paid_order_verified and prepare the copy pack.",
      "",
      "Before I send the checkout link, please confirm:",
      "- The request is for editable wording only, not legal, tax, accounting, debt-collection, or financial advice.",
      "- You will review the final copy for accuracy, tone, client relationship, and local rules before sending it.",
      "- No private invoice numbers, client private data, bank details, tax IDs, or full customer lists are included.",
      "",
      "Revenue is counted only after the external provider shows a paid order, payout balance, or settled payment.",
    ].join("\n");
  }
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
  if (service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id) {
    return [
      `# ${service.name} Fulfillment Checklist`,
      "",
      "Use this only after a real external payment provider shows a paid order. Do not start custom work from a request, page view, email, or brief download alone.",
      "",
      "## Intake",
      "",
      "- Confirm request source URL, date, and public-safe contact method.",
      "- Confirm buyer sent only upload error text, file type, target rule, broad use case, prior attempts, and deadline.",
      "- Confirm no actual file, ID photo, resume, private form, portal login, account credential, tax ID, bank detail, card data, or identity document was collected.",
      "- Confirm buyer understands the plan is troubleshooting guidance only and does not guarantee third-party portal acceptance.",
      "",
      "## Payment Gate",
      "",
      "- Send one real external checkout or invoice link only after fit is confirmed.",
      "- Wait until the provider shows paid_order_verified, paid order, payout balance, or settled payment.",
      "- Log the order source and provider status in OPERATIONS.md without exposing private buyer, file, portal, or payment details.",
      "",
      "## Build",
      "",
      "- Identify the best matching free tool and direct URL.",
      "- Write target settings for size, dimensions, file type, quality, or page count.",
      "- Add fallback steps if the first output still fails.",
      "- Add a review-before-upload checklist.",
      "- Keep the plan general enough to avoid private file inspection or official acceptance claims.",
      "",
      "## Delivery",
      "",
      "- Deliver the steps through the buyer's agreed channel.",
      "- Remind the buyer to run tools locally, keep the original file, and review the final output before uploading.",
      "- Offer one lightweight clarification if the same public-safe error still appears.",
      "- Mark the pipeline delivered, then revision_done or closed after the buyer response.",
    ].join("\n");
  }
  if (service.id === INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id) {
    return [
      `# ${service.name} Fulfillment Checklist`,
      "",
      "Use this only after a real external payment provider shows a paid order. Do not start custom work from a request, page view, email, or brief download alone.",
      "",
      "## Intake",
      "",
      "- Confirm request source URL, date, and public-safe contact method.",
      "- Confirm buyer sent invoice status, preferred tone, needed follow-up type, payment wording constraints, and timeline.",
      "- Confirm no invoice numbers, bank details, card data, tax IDs, identity documents, client private data, full customer lists, or legal dispute details were collected.",
      "- Confirm buyer understands this is editable communication copy only, not legal, tax, accounting, collection, or financial advice.",
      "",
      "## Payment Gate",
      "",
      "- Send one real external checkout or invoice link only after fit is confirmed.",
      "- Wait until the provider shows paid_order_verified, paid order, payout balance, or settled payment.",
      "- Log the order source and provider status in OPERATIONS.md without exposing private buyer, client, invoice, or payment details.",
      "",
      "## Build",
      "",
      "- Draft one polite payment reminder email.",
      "- Draft one due-today payment note.",
      "- Draft one first overdue follow-up.",
      "- Draft one paid thank-you message.",
      "- Draft one next-invoice or recurring-work note.",
      "- Keep copy editable and free of legal threats, debt-collection claims, or guaranteed payment promises.",
      "",
      "## Delivery",
      "",
      "- Deliver text blocks through the buyer's agreed channel.",
      "- Include a note that the buyer must review accuracy, tone, client relationship, and local rules before sending.",
      "- Offer one lightweight revision for tone, typos, or fit.",
      "- Mark the pipeline delivered, then revision_done or closed after the buyer response.",
    ].join("\n");
  }
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
  const isUploadLimitFix = service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id;
  const isInvoiceFollowup = service.id === INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id;
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
      isUploadLimitFix ? "public-safe upload error text" : isInvoiceFollowup ? "business or project name" : "business, booth, event, or service name",
      isUploadLimitFix ? "file type without attaching the file" : isInvoiceFollowup ? "invoice status without invoice numbers or client private data" : "what the buyer sells or promotes",
      isUploadLimitFix ? "target size, dimensions, accepted format, or portal rule" : isInvoiceFollowup ? "preferred tone and follow-up type" : "up to 12 items or services with prices",
      isUploadLimitFix ? "what has already been tried" : isInvoiceFollowup ? "payment method wording without private account details" : "public QR/contact link or public-safe reply preference",
      isUploadLimitFix ? "broad use case and public-safe reply preference" : isInvoiceFollowup ? "public-safe reply preference" : "style preference",
      "need-by date or timeline",
      "preferred external checkout provider",
      "notes that do not include private payment or identity data",
    ],
    forbiddenFields: [
      "card numbers",
      "bank details",
      "payout details",
      "tax identifiers",
      "identity documents",
      "invoice numbers",
      "client private data",
      "actual uploaded files",
      "portal login details",
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
        ownerAction: isUploadLimitFix ? "Confirm the request is within the simple upload-error fix-plan scope and details are public-safe." : isInvoiceFollowup ? "Confirm the request is within the simple invoice follow-up copy scope and details are public-safe." : "Confirm the request is within the simple $29 scope and details are complete enough.",
        buyerAction: isUploadLimitFix ? "Confirm they want a troubleshooting plan only and will run the tools on their own file." : isInvoiceFollowup ? "Confirm the messages are for buyer review and self-send only, not legal, tax, accounting, debt-collection, or financial advice." : "Confirm scope and that the QR/contact link can be printed publicly.",
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
        ownerAction: isUploadLimitFix ? "Prepare the recommended tool route, target settings, fallback steps, and review-before-upload checklist." : isInvoiceFollowup ? "Prepare the editable reminder, due-today, overdue, thank-you, and next-invoice wording blocks." : "Prepare the editable starter CSV, flyer copy, QR sign wording, coupon ideas, packing notes, and launch checklist.",
        buyerAction: "Answer scope clarifications only if needed.",
        moneyRule: "Revenue already verified externally.",
      },
      {
        id: "delivered",
        ownerAction: isUploadLimitFix ? "Send the fix plan through the agreed channel with run-locally and review-before-upload reminders." : isInvoiceFollowup ? "Send the copy pack through the agreed channel with review-before-sending reminders." : "Send the pack through the agreed channel with review and QR-test reminders.",
        buyerAction: isUploadLimitFix ? "Run the steps locally, keep the original file, and review the output before uploading." : isInvoiceFollowup ? "Review all copy for accuracy, tone, client relationship, and local rules before sending." : "Review all copy, prices, QR links, and claims before printing.",
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
        buyerAction: isUploadLimitFix ? "Use the plan in their own local upload workflow." : isInvoiceFollowup ? "Use the editable wording in their own invoice follow-up workflow." : "Use the editable pack in their own business or event workflow.",
        moneyRule: "Final counted revenue must match the external provider record.",
      },
    ],
    moneyGate: service.successGate,
    riskControls: service.riskControls,
  };
}

function serviceGithubPagesUrl(pathName) {
  const githubPagesBase = "https://yanqr213.github.io/printable-tools-lab/";
  return `${githubPagesBase}${pathName.replace(/^\/+/, "")}`;
}

function invoiceFollowupOutreachQueue(service) {
  const serviceUrl = serviceGithubPagesUrl(`${service.slug}/`);
  const requestBriefUrl = serviceGithubPagesUrl(service.publicRequestPath);
  const issueFormUrl = service.issueFormUrl;
  const paymentReplyTemplateUrl = serviceGithubPagesUrl(service.publicPaymentReplyPath);
  const fulfillmentChecklistUrl = serviceGithubPagesUrl(service.publicFulfillmentChecklistPath);
  const orderPipelineUrl = serviceGithubPagesUrl(service.publicOrderPipelinePath);
  const campaign = "invoice_followup_service";
  const tracked = (url, source, medium = "manual") => `${url}${url.includes("?") ? "&" : "?"}utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
  const batch = [
    {
      id: "invoice-generator-inbound-lead-01",
      day: 1,
      channel: "inbound-service-lead",
      audience: "people who used the invoice generator and submitted a free fit-check request",
      findWhere: "Use the operations lead monitor and public-safe service request issues only. Do not identify anonymous download visitors or try to contact site users without a submitted request.",
      qualification: "They explicitly asked for help writing polite invoice follow-up wording and supplied only public-safe context.",
      opener: "Thanks for the invoice follow-up request. This fits a small copy pack if you need editable wording for a polite reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice message. No payment is collected on the site; I can confirm scope first, then send one external checkout or invoice link if it is useful.",
      cta: "Please confirm the invoice status, tone, and whether this is wording-only rather than legal, tax, accounting, collections, or financial advice.",
      trackedUrl: tracked(serviceUrl, "invoice-generator-inbound"),
      fallbackUrl: tracked(requestBriefUrl, "invoice-generator-inbound"),
      stopRule: "Use only after the person submits a request or replies. Do not ask for private invoice numbers, client data, bank details, tax IDs, or payment credentials.",
      status: "ready_manual_reply",
    },
    {
      id: "freelancer-public-profile-01",
      day: 1,
      channel: "public-social-dm",
      audience: "freelancers and consultants with public business profiles who mention client work, invoices, retainers, or late payments",
      findWhere: "Public LinkedIn, X, Bluesky, Indie Hackers, portfolio, or business profile pages where the person invites business messages.",
      qualification: "They publicly sell client services and appear to need simple, professional invoice follow-up wording rather than billing software, legal advice, or collections help.",
      opener: "Hi, I saw that you do client work and thought a small invoice follow-up wording pack may be useful. I have a $19 copy pack for one workflow: polite reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice wording. It is editable copy only, not legal, tax, accounting, or collections advice, and payment happens only through a real external checkout after fit is confirmed.",
      cta: "Want the short fit-check brief?",
      trackedUrl: tracked(serviceUrl, "freelancer-dm"),
      fallbackUrl: tracked(requestBriefUrl, "freelancer-dm"),
      stopRule: "Do not contact private personal profiles. Send at most one initial message unless they reply.",
      status: "ready_manual_send",
    },
    {
      id: "small-agency-public-profile-01",
      day: 1,
      channel: "public-business-email",
      audience: "small studios, solo agencies, and service teams with public business contact emails",
      findWhere: "Public agency or studio websites with a general contact email for business inquiries.",
      qualification: "They sell project or retainer work and may want reusable, polite client follow-up wording for sent invoices.",
      opener: "Hi, I am testing a small $19 Invoice Follow-up Copy Pack for service businesses that want editable wording for reminders, due-today notes, first overdue follow-ups, paid thank-yous, and next-invoice messages. It is wording-only and the buyer reviews everything before sending. No payment is taken on the site; I confirm fit first, then send one external checkout or invoice link.",
      cta: "Would the one-page request brief be useful?",
      trackedUrl: tracked(serviceUrl, "small-agency-email"),
      fallbackUrl: tracked(requestBriefUrl, "small-agency-email"),
      stopRule: "Use public business emails only. Do not add contacts to a list or send repeated follow-ups without a reply.",
      status: "ready_manual_send",
    },
    {
      id: "creator-service-profile-01",
      day: 2,
      channel: "public-social-dm",
      audience: "creators, editors, designers, coaches, and tutors with public service offers",
      findWhere: "Public profiles or service pages where business inquiries are welcome and invoices or client payments are relevant.",
      qualification: "They sell a service and may need a polite message sequence after sending an invoice or payment request.",
      opener: "Hi, if you ever need simple wording after sending an invoice, I have a small $19 pack that drafts a friendly reminder, due-today note, overdue follow-up, thank-you, and next-invoice message. It is editable communication copy only, and I do not collect payment or private invoice details on the site.",
      cta: "I can send the free fit-check brief if helpful.",
      trackedUrl: tracked(serviceUrl, "creator-service-dm"),
      fallbackUrl: tracked(requestBriefUrl, "creator-service-dm"),
      stopRule: "Skip accounts that do not invite business messages. Do not ask for client names, invoice IDs, or private payment details.",
      status: "ready_manual_send",
    },
    {
      id: "community-help-reply-01",
      day: 2,
      channel: "helpful-community-reply",
      audience: "public posts where someone asks how to politely follow up on an unpaid, due, or recently paid invoice",
      findWhere: "Relevant public communities, forums, founder groups, freelancer groups, and Q&A threads that allow helpful resource replies.",
      qualification: "The person is actively asking for wording, tone, or a simple follow-up sequence. They are not asking for legal, tax, accounting, collections, or financial advice.",
      opener: "For wording, I would keep the first follow-up short: acknowledge the invoice, restate the due date or status, give the payment path, and keep the relationship friendly. I made a free invoice generator, plus a small $19 wording pack if someone wants the follow-up sequence drafted for their own tone.",
      cta: "Share the free generator first; mention the paid copy pack only if custom wording is relevant or requested.",
      trackedUrl: tracked(serviceUrl, "community-reply", "organic"),
      fallbackUrl: tracked(serviceGithubPagesUrl("tools/invoice-generator/"), "community-reply", "organic"),
      stopRule: "Lead with free help. Do not diagnose legal rights, interest, penalties, debt collection, taxes, or accounting treatment.",
      status: "ready_manual_reply",
    },
    {
      id: "invoice-template-resource-page-01",
      day: 3,
      channel: "resource-page-contact",
      audience: "free invoice template, freelancer resource, and small-business toolkit pages that accept useful resource suggestions",
      findWhere: "Public contact forms or resource-submission pages that invite relevant tools or templates.",
      qualification: "The page already links to invoice, freelancer, client communication, or small-business admin resources and accepts external suggestions without paid placement.",
      opener: "Hi, I built a free browser invoice generator and a small optional $19 Invoice Follow-up Copy Pack for people who need editable reminder wording after making an invoice. The service is copy-only, does not collect payment on-site, and avoids legal, tax, accounting, collections, and financial advice.",
      cta: "Would this fit your invoice or freelancer resources page?",
      trackedUrl: tracked(serviceUrl, "invoice-resource-page", "organic"),
      fallbackUrl: tracked(serviceGithubPagesUrl("tools/invoice-generator/"), "invoice-resource-page", "organic"),
      stopRule: "Submit only where resource suggestions are welcome. Do not use fake reviews, paid placement disguised as free, or forms requiring private identity/payout data.",
      status: "ready_manual_submit",
    },
    {
      id: "bookkeeper-admin-resource-01",
      day: 3,
      channel: "public-business-email",
      audience: "bookkeepers, virtual assistants, and admin consultants who share public small-business workflow resources",
      findWhere: "Public business websites or resource pages with a general contact email.",
      qualification: "They help clients with admin workflows and may share wording resources, but the message must avoid accounting, tax, and collections claims.",
      opener: "Hi, I am testing a small wording-only resource for freelancers and service teams: a $19 Invoice Follow-up Copy Pack with editable reminder, due-today, overdue, thank-you, and next-invoice messages. It is not bookkeeping, tax, accounting, legal, or collections advice; buyers review the copy themselves before sending.",
      cta: "Is there a resource page where this kind of wording pack would fit?",
      trackedUrl: tracked(serviceUrl, "admin-resource-email"),
      fallbackUrl: tracked(requestBriefUrl, "admin-resource-email"),
      stopRule: "Use only public business/resource emails. Do not imply professional accounting, tax, legal, or collections outcomes.",
      status: "ready_manual_send",
    },
    {
      id: "freelancer-directory-listing-01",
      day: 4,
      channel: "service-directory-listing",
      audience: "free or low-friction directories that allow freelancer tools, admin templates, or business writing services",
      findWhere: "Directory submission forms that accept tool or micro-service listings and do not require false business data.",
      qualification: "The directory allows simple service listings and the category can be described as business writing, freelancer admin templates, or invoice communication copy.",
      opener: "Invoice Follow-up Copy Pack is a $19 wording-only micro-service for freelancers and small service teams that need editable payment reminder, due-today, overdue follow-up, paid thank-you, and next-invoice copy after creating an invoice.",
      cta: "Use the GitHub Pages service link as the public listing URL until the Cloudflare deployment is refreshed.",
      trackedUrl: tracked(serviceUrl, "freelancer-directory", "organic"),
      fallbackUrl: tracked(requestBriefUrl, "freelancer-directory", "organic"),
      stopRule: "Do not submit to directories requiring fake address, phone, reviews, paid placement disguised as free, or private payout information.",
      status: "ready_manual_submit",
    },
    {
      id: "warm-reply-followup-01",
      day: 5,
      channel: "reply-followup-only",
      audience: "people who replied positively or asked for price, scope, timeline, or next step",
      findWhere: "Only previous conversations where the recipient asked for the brief, price, delivery, or checkout.",
      qualification: "They asked a question, requested the brief, or confirmed the wording pack might help.",
      opener: servicePaymentReplyCopy(service),
      cta: "Please confirm the scope bullets, then I can send the external checkout link.",
      trackedUrl: issueFormUrl,
      fallbackUrl: tracked(paymentReplyTemplateUrl, "warm-followup"),
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
      trackedUrl: serviceGithubPagesUrl("services.json"),
      fallbackUrl: serviceGithubPagesUrl("services.json"),
      stopRule: "Never store payout, card, tax, identity, platform credential, phone, client, invoice number, or private address data in the repository.",
      status: "required_after_action",
    },
  ];
  return {
    id: `${service.id}-outreach-queue`,
    serviceId: service.id,
    serviceName: service.name,
    priceUsd: service.priceUsd,
    currency: service.currency,
    purpose: "Manual, low-risk outreach queue for finding qualified freelancers or service teams who may need simple invoice follow-up wording.",
    primaryServiceUrl: serviceUrl,
    requestBriefUrl,
    issueFormUrl,
    paymentReplyTemplateUrl,
    fulfillmentChecklistUrl,
    orderPipelineUrl,
    batchSize: batch.length,
    dailyCap: "Send or reply to no more than 10 relevant public-safe contacts per day unless people are responding first.",
    qualificationRules: [
      "Use public business/profile/contact pages only.",
      "Message only when the person appears to have a real freelancer, agency, service-business, or invoice-follow-up wording need.",
      "Lead with helpful free tools or the short request brief before asking for payment.",
      "Send payment language only after the person replies or confirms fit.",
      "Count revenue only after an external provider shows paid_order_verified, a paid order, payout balance, or settled payment.",
    ],
    forbiddenActions: [
      "Do not scrape private contact lists.",
      "Do not spam communities, repeat-send, or use fake engagement.",
      "Do not contact private personal profiles or minors.",
      "Do not collect invoice numbers, customer private data, card, bank, payout, tax, identity, credential, password, or private account details.",
      "Do not promise guaranteed payment, legal compliance, tax results, accounting outcomes, collections outcomes, or financial results.",
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

function uploadLimitFixPlanOutreachQueue(service) {
  const serviceUrl = serviceGithubPagesUrl(`${service.slug}/`);
  const requestBriefUrl = serviceGithubPagesUrl(service.publicRequestPath);
  const issueFormUrl = service.issueFormUrl;
  const paymentReplyTemplateUrl = serviceGithubPagesUrl(service.publicPaymentReplyPath);
  const fulfillmentChecklistUrl = serviceGithubPagesUrl(service.publicFulfillmentChecklistPath);
  const orderPipelineUrl = serviceGithubPagesUrl(service.publicOrderPipelinePath);
  const campaign = "upload_limit_fix_plan";
  const tracked = (url, source, medium = "manual") => `${url}${url.includes("?") ? "&" : "?"}utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
  const batch = [
    {
      id: "upload-limit-inbound-lead-01",
      day: 1,
      channel: "inbound-service-lead",
      audience: "people who used upload-limit pages and submitted the $9 fix-plan request",
      findWhere: "Use only the operations lead monitor and public-safe service request issues. Do not identify anonymous visitors or ask for the blocked file.",
      qualification: "They explicitly asked for help choosing settings for one upload error and supplied only public-safe error text or target rules.",
      opener: "Thanks for the upload fix request. This fits a small $9 plan if you want the recommended free tool, target settings, fallback steps, and review checklist. No payment is collected on the site; I can confirm scope first, then send one external checkout or invoice link if useful.",
      cta: "Please confirm the file type, target rule, and that you will not send the actual file or portal login details.",
      trackedUrl: tracked(serviceUrl, "upload-limit-inbound"),
      fallbackUrl: tracked(requestBriefUrl, "upload-limit-inbound"),
      stopRule: "Use only after the person submits a request or replies. Never ask for the private file, ID photo, resume, portal login, or payment details.",
      status: "ready_manual_reply",
    },
    {
      id: "community-upload-error-reply-01",
      day: 1,
      channel: "helpful-community-reply",
      audience: "public posts where someone asks how to fix a PDF, image, resume, passport photo, or portal upload-size error",
      findWhere: "Public Q&A, freelancer, student, job-search, maker, and support communities that allow helpful resource replies.",
      qualification: "The person is actively blocked by file size, file format, or dimensions and is asking for steps, not official acceptance, legal, immigration, or employment advice.",
      opener: "For a file-size error, I would start from the exact message: PDF under 1MB goes to the PDF compressor target, image under 100KB goes to the image-to-KB tool, and dimension errors go to resize/crop first. I made a free upload-limit fixer for the common cases, plus a small $9 fix plan if someone wants settings and fallback steps written for their exact public-safe error.",
      cta: "Share the free upload-limit fixer first; mention the paid plan only when custom step-by-step settings are relevant or requested.",
      trackedUrl: tracked(serviceUrl, "community-reply", "organic"),
      fallbackUrl: tracked(serviceGithubPagesUrl("upload-limit-fixer/"), "community-reply", "organic"),
      stopRule: "Lead with free help. Do not request files, account details, ID photos, resumes, private forms, or official portal credentials.",
      status: "ready_manual_reply",
    },
    {
      id: "freelancer-admin-public-profile-01",
      day: 2,
      channel: "public-social-dm",
      audience: "virtual assistants, freelancer admins, career helpers, and document-prep creators with public business profiles",
      findWhere: "Public profiles where the person offers admin help, job-application support, resume help, document prep, or marketplace listing support and invites business messages.",
      qualification: "They may send clients to a no-upload fixer or request small troubleshooting plans without sharing client files.",
      opener: "Hi, I am testing a tiny $9 Upload Limit Fix Plan for people stuck on PDF/image upload errors. The buyer sends only public-safe error text and target rules; I send the recommended free tool, settings, fallback steps, and review checklist. No file upload or private portal details.",
      cta: "Would the free upload-limit fixer or the short request brief be useful for your clients?",
      trackedUrl: tracked(serviceUrl, "admin-profile-dm"),
      fallbackUrl: tracked(requestBriefUrl, "admin-profile-dm"),
      stopRule: "Use only public business profiles that invite messages. Send at most one initial message unless they reply.",
      status: "ready_manual_send",
    },
    {
      id: "resource-page-submit-01",
      day: 3,
      channel: "resource-page-contact",
      audience: "student, freelancer, job-search, marketplace-seller, and admin resource pages that accept useful free tool suggestions",
      findWhere: "Public contact or resource-submission pages that invite relevant tools.",
      qualification: "The page already lists file compression, document submission, resume, marketplace, or application resources.",
      opener: "Hi, I built a free Upload Limit Fixer that routes common PDF/image/file-size errors to no-signup browser tools. There is also an optional $9 troubleshooting plan for users who want public-safe settings and fallback steps without sharing the actual file.",
      cta: "Would this fit your resource page?",
      trackedUrl: tracked(serviceGithubPagesUrl("upload-limit-fixer/"), "resource-page", "organic"),
      fallbackUrl: tracked(serviceUrl, "resource-page", "organic"),
      stopRule: "Submit only where resource suggestions are welcome. Do not use fake reviews, paid placement disguised as free, or forms requiring private identity/payout data.",
      status: "ready_manual_submit",
    },
    {
      id: "warm-reply-followup-01",
      day: 4,
      channel: "reply-followup-only",
      audience: "people who replied positively or asked for price, scope, timeline, or next step",
      findWhere: "Only previous conversations where the recipient asked for the brief, price, delivery, or checkout.",
      qualification: "They asked a question, requested the brief, or confirmed the fix plan might help.",
      opener: servicePaymentReplyCopy(service),
      cta: "Please confirm the scope bullets, then I can send the external checkout link.",
      trackedUrl: issueFormUrl,
      fallbackUrl: tracked(paymentReplyTemplateUrl, "warm-followup"),
      stopRule: "Use this only after a real reply. Do not send payment language to cold contacts.",
      status: "reply_only",
    },
    {
      id: "manual-log-closeout-01",
      day: 4,
      channel: "operations-log",
      audience: "internal tracking",
      findWhere: "OPERATIONS.md service-order log section.",
      qualification: "After each sent message, reply, request, checkout, paid order, delivery, or closeout.",
      opener: "Log date, channel, public-safe source, contact count, reply count, request URL, checkout state, paid amount, and next action. Do not log private buyer/file/payment details.",
      cta: "Update status: sent, replied, intent_received, fit_confirmed, checkout_sent, paid_order_verified, delivered, revision_done, or closed.",
      trackedUrl: serviceGithubPagesUrl("services.json"),
      fallbackUrl: serviceGithubPagesUrl("services.json"),
      stopRule: "Never store payout, card, tax, identity, portal credential, phone, private file, client, invoice number, or private address data in the repository.",
      status: "required_after_action",
    },
  ];
  return {
    id: `${service.id}-outreach-queue`,
    serviceId: service.id,
    serviceName: service.name,
    priceUsd: service.priceUsd,
    currency: service.currency,
    purpose: "Manual, low-risk outreach queue for finding qualified users or resource pages where a no-upload upload-error fix plan may be relevant.",
    primaryServiceUrl: serviceUrl,
    requestBriefUrl,
    issueFormUrl,
    paymentReplyTemplateUrl,
    fulfillmentChecklistUrl,
    orderPipelineUrl,
    batchSize: batch.length,
    dailyCap: "Send or reply to no more than 10 relevant public-safe contacts per day unless people are responding first.",
    qualificationRules: [
      "Lead with the free upload-limit fixer before mentioning the paid plan.",
      "Use public business/profile/contact pages or active public help threads only.",
      "Message only when the person appears to have a real upload-size, format, or dimension troubleshooting need.",
      "Send payment language only after the person replies or confirms fit.",
      "Count revenue only after an external provider shows paid_order_verified, a paid order, payout balance, or settled payment.",
    ],
    forbiddenActions: [
      "Do not ask for or accept the blocked file, ID photo, resume, private form, portal login, or account details.",
      "Do not scrape private contact lists.",
      "Do not spam communities, repeat-send, or use fake engagement.",
      "Do not contact private personal profiles or minors.",
      "Do not promise guaranteed acceptance by a portal, employer, school, marketplace, email provider, or government website.",
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

function serviceOutreachQueue(service) {
  if (service.id === INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id) return invoiceFollowupOutreachQueue(service);
  if (service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id) return uploadLimitFixPlanOutreachQueue(service);
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
  ["Invoice follow-up email generator", "tools/invoice-followup-email", "High-intent freelancer workflow with a free email generator and optional $19 wording pack fit check."],
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
    channel: "community",
    title: "Invoice follow-up wording helper",
    hook: "Need polite wording after sending an invoice?",
    body: "The free invoice follow-up email generator drafts reminder, due-today, overdue, thank-you, and next-invoice wording in the browser. There is also an optional $19 copy pack fit check for people who want one workflow drafted in their own tone; it is wording-only and not legal, tax, accounting, collections, or financial advice.",
    cta: "Open the invoice follow-up generator",
    linkPath: "tools/invoice-followup-email",
    campaign: "invoice_followup_service",
    content: "share-kit-community",
  },
  {
    channel: "directory",
    title: "Invoice reminder resource listing",
    hook: "Free invoice generator plus optional follow-up wording pack.",
    body: "PrintableTools Lab has a free no-signup invoice generator and a free invoice follow-up email generator for freelancers and small service teams. The optional $19 Invoice Follow-up Copy Pack is manually reviewed, payment happens only through an external provider after fit is confirmed, and no private invoice, bank, tax, card, or client details are requested on-site.",
    cta: "List as an invoice communication resource",
    linkPath: "invoice-followup-copy-pack",
    campaign: "invoice_followup_service",
    content: "share-kit-directory",
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
  {
    id: "community-invoice-followup-copy",
    channel: "community",
    title: "Helpful reply for polite invoice follow-up wording",
    trigger: "Use only when a freelancer, consultant, or small service owner asks how to write a polite invoice reminder, due-today note, overdue follow-up, paid thank-you, or next-invoice message.",
    linkPath: "tools/invoice-followup-email",
    utmSource: "community",
    campaign: "invoice_followup_service",
    copy: "For wording only, this free invoice follow-up email generator can draft a polite reminder, due-today note, overdue follow-up, paid thank-you, or next-invoice message: {url}. There is an optional $19 copy pack fit check if someone wants one workflow drafted in their own tone; it is not legal, tax, accounting, collections, or financial advice.",
    successSignal: "invoice_followup_service UTM visits appear and at least one visitor submits a service fit check or opens the invoice generator path.",
    riskRule: "Lead with the free generator, avoid regulated advice, and do not ask for invoice numbers, client names, bank, tax, card, or private payment details.",
  },
  {
    id: "directory-invoice-followup-resource",
    channel: "directory",
    title: "Directory listing for invoice follow-up wording resource",
    trigger: "Use on directories or resource pages that accept freelancer, invoice, admin-template, small-business, or business-writing resources.",
    linkPath: "invoice-followup-copy-pack",
    utmSource: "directory",
    campaign: "invoice_followup_service",
    copy: "PrintableTools Lab offers a free no-signup invoice generator, a free invoice follow-up email generator, and an optional USD 19 Invoice Follow-up Copy Pack for editable reminder, due-today, overdue, thank-you, and next-invoice wording. Listing URL: {url}",
    successSignal: "A directory referral or resource-page UTM visit appears, followed by a service_request_intent or service lead.",
    riskRule: "Submit only where resource listings are welcome; do not claim payment recovery, legal compliance, tax/accounting outcomes, or guaranteed collections.",
  },
];

const UPLOAD_LIMIT_SHORTCUTS = [
  ["PDF size reducer", "/pdf-size-reducer/", "Pick 500KB, 1MB, 2MB, or 5MB PDF targets for scanned forms and portal uploads.", "compress-pdf"],
  ["Image size reducer in KB", "/image-size-reducer-in-kb/", "Choose exact image and photo targets from 10KB through 500KB without uploading.", "compress-image-to-kb"],
  ["Compress PDF to 1MB", "/compress-pdf-to-1mb/", "A common job, school, email, and admin portal PDF limit.", "compress-pdf"],
  ["Compress PDF to 500KB", "/compress-pdf-to-500kb/", "A strict PDF target for forms, exam portals, and government-style uploads.", "compress-pdf"],
  ["PDF under 2MB", "/pdf-must-be-under-2mb/", "A common application, proposal, and document portal PDF cap.", "compress-pdf"],
  ["Document under 5MB", "/document-must-be-under-5mb/", "A moderate upload limit for documents, scans, and email-style attachments.", "compress-pdf"],
  ["Compress image to 100KB", "/compress-image-to-100kb/", "A common profile, job, school, and form photo limit.", "compress-image-to-kb"],
  ["Compress JPG to 100KB", "/compress-jpg-to-100kb/", "Use this when the destination asks for JPG and a fixed 100KB limit.", "compress-image-to-kb"],
  ["Compress PNG to 100KB", "/compress-png-to-100kb/", "Use this when a screenshot, graphic, or form upload must stay PNG under 100KB.", "compress-image-to-kb"],
  ["Passport photo size fixer", "/passport-photo-size-fixer/", "Crop, resize, and compress ID-style photos for dimension and file-size rules.", "passport-photo"],
  ["Passport photo 35x45mm", "/passport-photo-35x45mm/", "Open the local passport photo cropper with a common 35 x 45 mm preset.", "passport-photo"],
  ["Photo 200x230 under 50KB", "/photo-200x230-50kb/", "Resize an exam-style photo to 200 x 230 pixels before compressing toward a 50KB cap.", "resize-image"],
  ["Resize photo to 200x230", "/resize-photo-200x230/", "Prepare a strict 200 x 230 pixel photo for exam, job, and application portals.", "resize-image"],
  ["Resize signature to 140x60", "/resize-signature-140x60/", "Resize a signature image to a strict 140 x 60 pixel portal rule.", "resize-image"],
  ["Resize signature to 200x100", "/resize-signature-200x100/", "Prepare a 200 x 100 pixel signature image for forms that use a wider signature box.", "resize-image"],
  ["Signature under 50KB", "/signature-under-50kb/", "Compress a scanned or drawn signature image toward a 50KB upload cap.", "compress-image-to-kb"],
  ["Signature under 20KB", "/signature-under-20kb/", "Compress a scanned or drawn signature image toward a strict 20KB upload cap.", "compress-image-to-kb"],
];

const UPLOAD_LIMIT_DECISIONS = [
  ["PDF must be under 1MB", "/tools/compress-pdf/?targetSize=1mb", "Compress PDF", "Use the PDF compressor with the 1MB target for job, school, email, and admin portals.", "compress-pdf"],
  ["PDF must be under 500KB", "/tools/compress-pdf/?targetSize=500kb", "Compress PDF", "Use the strict 500KB target for forms and exam-style upload limits.", "compress-pdf"],
  ["PDF must be under 2MB", "/pdf-must-be-under-2mb/", "Fix PDF under 2MB", "Use the 2MB PDF target when a proposal, application, school, or admin portal rejects a larger PDF.", "compress-pdf"],
  ["Document must be under 5MB", "/document-must-be-under-5mb/", "Fix document under 5MB", "Use the 5MB PDF target for document uploads, scans, and attachments that need readable detail.", "compress-pdf"],
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
  ["Photo must be 200 x 230 px and under 50KB", "/photo-200x230-50kb/", "Make 200x230 photo", "Resize the photo to exact 200 x 230 pixels first, then compress the result if the portal also enforces a 50KB cap.", "resize-image"],
  ["Photo dimensions must be 200 x 230 px", "/resize-photo-200x230/", "Resize 200x230 photo", "Use the image resizer with 200 x 230 pixels prefilled for exam, job, and application photo boxes.", "resize-image"],
  ["Signature image must be under 20KB", "/signature-under-20kb/", "Compress signature", "Use the image-to-KB compressor for scanned or drawn signature uploads with a tiny file-size cap.", "compress-image-to-kb"],
  ["Signature dimensions must be 140 x 60 px", "/resize-signature-140x60/", "Resize signature", "Use the image resizer with 140 x 60 pixels prefilled before compressing if the portal also has a KB cap.", "resize-image"],
  ["Signature image must be under 50KB", "/signature-under-50kb/", "Compress signature", "Use the image-to-KB compressor for signature uploads that allow more room than a 20KB cap.", "compress-image-to-kb"],
  ["Signature dimensions must be 200 x 100 px", "/resize-signature-200x100/", "Resize signature", "Use the image resizer with 200 x 100 pixels prefilled for wider signature upload boxes.", "resize-image"],
  ["Passport photo must be 35 x 45 mm", "/passport-photo-35x45mm/", "Make 35 x 45 photo", "Use a 35 x 45 mm passport-style preset, then compare the result with the destination site's current rules.", "passport-photo"],
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
  "tools/invoice-followup-email",
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
  "tools/invoice-followup-email",
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
    path: "pdf-must-be-under-2mb",
    title: "PDF Must Be Under 2MB Fix",
    description: "Compress a PDF locally toward a 2MB upload limit when an application, proposal, school, or document portal rejects the file.",
    headline: "Fix PDF must be under 2 MB",
    lead: "Use this when an upload page says a PDF must be under 2 MB. Open the no-upload PDF compressor with the 2MB target selected, then review the smaller copy before submitting it.",
    primaryTool: "tools/compress-pdf?targetSize=2mb",
    intent: "PDF must be under 2MB, compress PDF to 2MB, upload limit error",
    uploadErrorMatcher: true,
    sections: [
      ["Use the 2MB PDF target", "Open the PDF compressor with the 2MB target already selected. This is useful for proposal, portfolio, school, support, and admin portals that reject larger PDFs."],
      ["Keep readable detail", "A 2MB target usually preserves more detail than 500KB or 1MB, but scanned files and image-heavy PDFs can still flatten text and links."],
      ["If it still fails", "Split long PDFs, compress source photos, or convert oversized pages to images before rebuilding the final upload file."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=2mb", "tools/split-pdf", "tools/pdf-to-images"],
  },
  {
    path: "pdf-must-be-under-5mb",
    title: "PDF Must Be Under 5MB Fix",
    description: "Reduce a PDF locally toward a 5MB upload limit for document portals, support tickets, emails, and applications.",
    headline: "Fix PDF must be under 5 MB",
    lead: "Use this when a site accepts PDF files but rejects yours because it must be under 5 MB. Start with the 5MB PDF target so the file stays readable while getting smaller.",
    primaryTool: "tools/compress-pdf?targetSize=5mb",
    intent: "PDF must be under 5MB, compress PDF to 5MB, upload PDF too large",
    uploadErrorMatcher: true,
    sections: [
      ["Use the 5MB PDF target", "Open the PDF compressor with the 5MB target. It is a moderate cap for scans, forms, support attachments, and application PDFs where readability still matters."],
      ["Preserve the original", "Compression creates a smaller copy. Keep the original PDF in case the destination asks for clearer pages or selectable text."],
      ["Check every page", "Open the downloaded file before submitting it and confirm pages, signatures, stamps, and small text are still visible."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=5mb", "tools/pdf-to-images", "tools/split-pdf"],
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
    path: "resume-pdf-under-2mb",
    title: "Resume PDF Under 2MB Fix",
    description: "Compress a resume PDF locally toward a 2MB job application upload limit while keeping it readable.",
    headline: "Make a resume PDF under 2 MB",
    lead: "Use this when a job board, recruiter portal, client portal, or application form rejects a resume PDF above 2 MB.",
    primaryTool: "tools/compress-pdf?targetSize=2mb",
    intent: "resume PDF under 2MB, compress resume PDF to 2MB, job application upload",
    uploadErrorMatcher: true,
    sections: [
      ["Start with the 2MB target", "Open the PDF compressor with 2MB selected. This target is usually friendlier to resume readability than 500KB or 1MB."],
      ["Protect text clarity", "Check your name, contact details, dates, headings, and links after compression. A resume that is smaller but blurry is not useful."],
      ["If the file is still too large", "Remove oversized headshots, simplify images, or export a cleaner PDF from the original resume editor before compressing again."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=2mb", "tools/resume-builder", "tools/pdf-to-word"],
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
    path: "document-must-be-under-5mb",
    title: "Document Must Be Under 5MB Fix",
    description: "Reduce a PDF document locally toward a 5MB upload limit for forms, applications, portals, and email attachments.",
    headline: "Fix document must be under 5 MB",
    lead: "Use this when a website says a document, scanned file, attachment, or PDF must be under 5 MB before it can be uploaded.",
    primaryTool: "tools/compress-pdf?targetSize=5mb",
    intent: "document must be under 5MB, file upload 5MB limit, compress document PDF",
    uploadErrorMatcher: true,
    sections: [
      ["Start with PDFs", "If the blocked document is a PDF, open the compressor with the 5MB target. If it is an image, use the image-to-KB reducer instead."],
      ["Use for readable documents", "A 5MB cap is usually meant to keep scans and attachments manageable while preserving enough detail to review the file."],
      ["Keep private details local", "The ordinary compression workflow runs in the browser. Still, review the output carefully before sending private forms, IDs, or signed pages elsewhere."],
    ],
    relatedTools: ["tools/compress-pdf?targetSize=5mb", "tools/compress-image-to-kb?targetKb=2048", "tools/pdf-to-images"],
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
    relatedTools: ["tools/invoice-followup-email", "tools/estimate-generator", "tools/receipt-generator"],
  },
  {
    path: "invoice-follow-up-email-template",
    title: "Free Invoice Follow-up Email Template",
    description: "Write and download a polite invoice reminder, due-today note, overdue follow-up, paid thank-you, or next-invoice email without uploading private invoice details.",
    headline: "Free invoice follow-up email template",
    lead: "Use this when an invoice has been sent and you need a professional reminder or thank-you note without turning it into legal, tax, accounting, or collections advice.",
    primaryTool: "tools/invoice-followup-email",
    intent: "invoice follow-up email, payment reminder wording, overdue invoice reminder",
    sections: [
      ["Why this page exists", "People who generate invoices often need the next message more than another PDF. This page gives a quick, editable follow-up email while keeping private invoice numbers, bank details, tax IDs, and client data out of the tool."],
      ["What it drafts", "A polite reminder, due-today note, first overdue follow-up, paid thank-you, or next-invoice message with tone and timing fields the sender can review."],
      ["Best fit", "Use it for freelancers, consultants, local services, or small teams who need relationship-safe wording after sending an invoice."],
    ],
    relatedTools: ["tools/invoice-generator", "tools/estimate-generator", "tools/receipt-generator"],
  },
  {
    path: "overdue-invoice-reminder-email",
    title: "Overdue Invoice Reminder Email",
    description: "Write a first overdue invoice reminder email without uploading private invoice details, then request a $19 follow-up sequence if you want it polished.",
    headline: "Overdue invoice reminder email",
    lead: "Use this when an invoice is already late and you need a calm first follow-up that asks for an update without making legal, tax, accounting, or collections claims.",
    primaryTool: "tools/invoice-followup-email",
    primaryToolQuery: "invoiceStatus=overdue&tone=friendly&dueTiming=overdue&context=I%20wanted%20to%20keep%20this%20easy%20to%20find%20and%20check%20whether%20anything%20else%20is%20needed%20on%20my%20side.&paymentWording=Please%20use%20the%20payment%20link%20or%20invoice%20portal%20already%20sent.",
    intent: "overdue invoice reminder email, first overdue invoice follow up, late payment reminder wording",
    sections: [
      ["Use a first overdue tone", "Keep the message short, specific, and relationship-safe. Mention that the invoice is overdue, ask whether anything else is needed, and point back to the existing payment path without adding private account details."],
      ["Avoid risky claims", "This page is communication copy only. It does not make legal threats, collections claims, tax statements, interest demands, or accounting judgments."],
      ["When to request the $19 pack", "If you need the reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice wording to match one workflow, send the 30-second fit check below before any external checkout is sent."],
    ],
    relatedTools: ["tools/invoice-followup-email", "tools/invoice-generator", "tools/receipt-generator"],
    serviceLead: {
      serviceType: "invoice-followup-copy-pack",
      title: "Need the full overdue follow-up sequence?",
      cta: "Send overdue invoice fit check",
      intro: "Use the free overdue draft now, or send this public-safe 30-second fit check for the optional $19 Invoice Follow-up Copy Pack.",
      placeholder: "I need a friendly first overdue invoice follow-up plus a firmer next message. No invoice numbers, client names, bank details, or private customer data included.",
      defaultSummary: "I need a first overdue invoice reminder sequence for one client-work workflow: friendly reminder, firmer first overdue follow-up, paid thank-you, and next-invoice wording. No private invoice numbers, client names, bank details, tax IDs, or customer lists included.",
    },
  },
  {
    path: "polite-payment-reminder-email",
    title: "Polite Payment Reminder Email",
    description: "Write a polite payment reminder email for an unpaid invoice without uploading private invoice, bank, tax, card, or client details.",
    headline: "Polite payment reminder email",
    lead: "Use this when a client payment is close to due, due today, or lightly overdue and you need calm wording that protects the relationship while asking for an update.",
    primaryTool: "tools/invoice-followup-email",
    primaryToolQuery: "invoiceStatus=sent&tone=warm&dueTiming=due-soon&context=I%20want%20to%20keep%20the%20message%20friendly%20and%20easy%20to%20act%20on.&paymentWording=Please%20use%20the%20payment%20link%20or%20invoice%20portal%20already%20sent.",
    intent: "polite payment reminder email, gentle invoice reminder, friendly payment follow up",
    sections: [
      ["Keep it relationship-safe", "A useful reminder is short, specific, and easy to answer. Mention the invoice or work in general terms, ask whether anything else is needed, and point back to the payment method already shared."],
      ["Avoid private or risky details", "Do not paste invoice numbers, client names, bank details, card data, tax IDs, dispute details, or private customer data into a public form or generator."],
      ["When the $19 pack fits", "If you need several versions in the same tone, the optional copy pack can prepare a polite reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice note for one workflow after fit is confirmed."],
    ],
    relatedTools: ["tools/invoice-followup-email", "tools/invoice-generator", "tools/receipt-generator"],
    serviceLead: {
      serviceType: "invoice-followup-copy-pack",
      title: "Want the full polite reminder sequence?",
      cta: "Send polite reminder fit check",
      intro: "Use the free reminder draft now, or send this public-safe 30-second fit check for the optional $19 Invoice Follow-up Copy Pack.",
      placeholder: "I need a polite payment reminder sequence for one freelance or small-business workflow. No invoice numbers, client names, bank details, tax IDs, legal dispute details, or customer lists included.",
      defaultSummary: "I need a polite payment reminder sequence for one workflow: friendly reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice wording. No private invoice numbers, client names, bank details, tax IDs, legal dispute details, or customer lists included.",
    },
  },
  {
    path: "freelance-invoice-follow-up-email",
    title: "Freelance Invoice Follow-up Email",
    description: "Draft a freelance invoice follow-up email for sent, due-today, overdue, paid, or recurring client-work invoices without sharing private invoice data.",
    headline: "Freelance invoice follow-up email",
    lead: "Use this when you finished client work, sent an invoice, and need professional follow-up wording that sounds human rather than aggressive.",
    primaryTool: "tools/invoice-followup-email",
    primaryToolQuery: "invoiceStatus=sent&tone=friendly&dueTiming=due-soon&context=I%20want%20to%20check%20whether%20the%20client%20needs%20anything%20else%20from%20me%20before%20payment.&paymentWording=Please%20use%20the%20payment%20link%20or%20invoice%20portal%20already%20sent.",
    intent: "freelance invoice follow-up email, freelancer payment reminder, client invoice follow up",
    sections: [
      ["Use a client-work tone", "Freelancers often need to be clear without sounding harsh. State the work or milestone in general terms, keep the ask simple, and make the next action obvious."],
      ["Keep the copy editable", "The generator gives a starting draft, not legal, tax, accounting, collections, or financial advice. Review the wording for your client relationship before sending."],
      ["Upgrade only if it saves time", "The $19 copy pack is meant for one small workflow where you want the reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice wording to match your tone."],
    ],
    relatedTools: ["tools/invoice-followup-email", "tools/invoice-generator", "tools/estimate-generator"],
    serviceLead: {
      serviceType: "invoice-followup-copy-pack",
      title: "Want the freelance follow-up sequence written for you?",
      cta: "Send freelance invoice fit check",
      intro: "Use the free draft first, or send this public-safe fit check for the optional $19 Invoice Follow-up Copy Pack.",
      placeholder: "I need freelance invoice follow-up wording for one client-work workflow. No client names, invoice numbers, bank details, tax IDs, legal dispute details, or customer lists included.",
      defaultSummary: "I need a freelance invoice follow-up copy pack for one client-work workflow: friendly reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice wording. No private invoice numbers, client names, bank details, tax IDs, legal dispute details, or customer lists included.",
    },
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
    serviceLead: uploadLimitLandingServiceLead("PDF size reducer"),
    targetLinks: [
      ["Compress PDF to 500KB", "compress-pdf-to-500kb", "For strict form, school, government-style, and exam upload limits."],
      ["Compress PDF to 1MB", "compress-pdf-to-1mb", "For common job, school, email, and portal PDF limits."],
      ["Compress PDF to 2MB", "compress-pdf-to-2mb", "For upload forms that allow more readable scanned detail."],
      ["Compress PDF to 5MB", "compress-pdf-to-5mb", "For moderate limits where readability matters more than extreme compression."],
      ["PDF must be under 2MB", "pdf-must-be-under-2mb", "For proposal, portfolio, application, and school upload errors."],
      ["PDF must be under 5MB", "pdf-must-be-under-5mb", "For moderate PDF upload caps where readability still matters."],
      ["Resume PDF under 2MB", "resume-pdf-under-2mb", "For job application portals that reject larger resume PDFs."],
      ["Document must be under 5MB", "document-must-be-under-5mb", "For document portals, scans, and attachments with a 5MB cap."],
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
    serviceLead: uploadLimitLandingServiceLead("compress PDF to 500KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress PDF to 1MB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress PDF to 2MB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress PDF to 5MB"),
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
      ["Signature under 20KB", "signature-under-20kb", "For strict signature image upload caps on forms and portals."],
      ["Resize signature to 140x60", "resize-signature-140x60", "For signature boxes that validate exact pixel dimensions."],
      ["Signature under 50KB", "signature-under-50kb", "For wider signature upload caps used by job, exam, and admin portals."],
      ["Resize signature to 200x100", "resize-signature-200x100", "For wider signature boxes that validate exact pixel dimensions."],
      ["Passport photo 35x45mm", "passport-photo-35x45mm", "For common ID-style photo forms that name a 35 x 45 mm requirement."],
      ["Photo 200x230 under 50KB", "photo-200x230-50kb", "For exam-style photo uploads that combine exact pixels with a 50KB cap."],
      ["Resize photo to 200x230", "resize-photo-200x230", "For application photo boxes that validate exact 200 x 230 pixel dimensions."],
    ],
    relatedTools: ["tools/compress-image-to-kb", "tools/resize-image", "tools/crop-image", "tools/passport-photo", "tools/signature-png"],
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
    serviceLead: uploadLimitLandingServiceLead("compress image to 100KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress image to 50KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress image to 200KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress JPG to 50KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress JPG to 100KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress JPG to 200KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress PNG to 50KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress PNG to 100KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress PNG to 200KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress passport photo to 50KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress passport photo to 100KB"),
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
    serviceLead: uploadLimitLandingServiceLead("compress passport photo to 200KB"),
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
    path: "passport-photo-35x45mm",
    title: "Passport Photo 35x45mm Without Uploading",
    description: "Crop a passport-style or ID-style photo to a common 35 x 45 mm layout locally before checking the destination form rules.",
    headline: "Make a 35 x 45 mm passport photo without uploading",
    lead: "Use this when a visa, exam, school, profile, or application form asks for a 35 x 45 mm passport-style photo. Open the local passport photo cropper with the 35 x 45 mm preset, then review the result against the destination site's current rules.",
    primaryTool: "tools/passport-photo?preset=uk-passport",
    intent: "passport photo 35x45mm, 35 x 45 mm photo maker, no upload",
    sections: [
      ["Start with a 35 x 45 mm preset", "The passport photo tool includes 35 x 45 mm presets for common passport-style and ID-style workflows. Choose the closest preset named by the receiving site."],
      ["Crop before compressing", "Face placement and photo proportions should be handled before file-size compression. After exporting the 35 x 45 mm photo, use the image-to-KB tool if the portal also names a KB limit."],
      ["Check official rules", "This page helps with local crop and export only. It does not verify lighting, background, expression, recency, identity, or official acceptance."],
    ],
    serviceLead: uploadLimitLandingServiceLead("make a 35 x 45 mm passport photo"),
    relatedTools: ["tools/passport-photo?preset=uk-passport", "tools/compress-image-to-kb?targetKb=100", "tools/resize-image", "tools/crop-image"],
  },
  {
    path: "photo-200x230-50kb",
    title: "Photo 200x230 Pixels Under 50KB",
    description: "Resize an exam-style, job, or application photo to 200 x 230 pixels locally before compressing toward a 50KB upload cap.",
    headline: "Make a 200 x 230 px photo under 50KB",
    lead: "Use this when a form rejects a photograph unless it is exactly 200 x 230 pixels and within a small 20KB to 50KB style range. Start with the prefilled resizer, then use the image-to-KB compressor if the exported photo is still too large.",
    primaryTool: "tools/resize-image?width=200&height=230&fit=cover",
    intent: "photo 200x230 50KB, resize photo 200 x 230, exam photo upload",
    sections: [
      ["Resize before compressing", "Exact pixel validation usually happens before file-size validation. Make the photo 200 x 230 pixels first so the receiving portal does not reject the file for dimensions."],
      ["Then target 50KB if needed", "At 200 x 230 pixels many photos are already small, but bright backgrounds or high-quality exports can still exceed 50KB. Compress the resized output with the 50KB target if needed."],
      ["Check the current portal notice", "This page is a local image helper. It does not verify official exam, job, visa, school, or government rules, and it does not guarantee acceptance by any named portal."],
    ],
    serviceLead: uploadLimitLandingServiceLead("make a 200 x 230 px photo under 50KB"),
    relatedTools: ["tools/resize-image?width=200&height=230&fit=cover", "tools/compress-image-to-kb?targetKb=50", "tools/passport-photo", "tools/crop-image"],
  },
  {
    path: "signature-under-20kb",
    title: "Signature Under 20KB Without Uploading",
    description: "Compress a scanned, drawn, or transparent signature image toward a strict 20KB upload limit locally.",
    headline: "Make a signature image under 20KB",
    lead: "Use this when a form, exam portal, job application, admin page, or document upload rejects a signature image because it must be under 20KB.",
    primaryTool: "tools/compress-image-to-kb?targetKb=20",
    intent: "signature under 20KB, compress signature image, signature upload too large",
    sections: [
      ["Use the 20KB target", "Open the image-to-KB compressor with 20KB prefilled. A signature usually compresses better than a photo because the image has fewer colors and details."],
      ["Resize first if pixels are required", "Some portals ask for both a signature size and an exact dimension such as 140 x 60 pixels. Resize the signature first, then compress the resized output."],
      ["Avoid legal claims", "This creates or compresses a visual signature image only. It does not verify identity, collect consent, notarize documents, or replace a regulated e-signature service."],
    ],
    serviceLead: uploadLimitLandingServiceLead("make a signature image under 20KB"),
    relatedTools: ["tools/compress-image-to-kb?targetKb=20", "tools/resize-image?width=140&height=60&fit=contain", "tools/signature-png", "tools/remove-background"],
  },
  {
    path: "signature-under-50kb",
    title: "Signature Under 50KB Without Uploading",
    description: "Compress a scanned, drawn, or transparent signature image toward a 50KB upload limit locally.",
    headline: "Make a signature image under 50KB",
    lead: "Use this when a form, job portal, school portal, admin page, or application upload rejects a signature image because it must be under 50KB.",
    primaryTool: "tools/compress-image-to-kb?targetKb=50",
    intent: "signature under 50KB, compress signature image, signature upload too large",
    sections: [
      ["Use the 50KB target", "Open the image-to-KB compressor with 50KB prefilled. A clear black signature on a plain background usually compresses well at this target."],
      ["Resize first if pixels are required", "Some portals require a specific signature box such as 140 x 60 or 200 x 100 pixels. Resize the signature first, then compress the resized file."],
      ["Keep it readable", "Do not over-compress until the signature becomes faint or broken. This is a visual file helper, not identity verification or regulated e-signature software."],
    ],
    serviceLead: uploadLimitLandingServiceLead("make a signature image under 50KB"),
    relatedTools: ["tools/compress-image-to-kb?targetKb=50", "tools/resize-image?width=200&height=100&fit=contain", "tools/signature-png", "tools/crop-image"],
  },
  {
    path: "resize-signature-140x60",
    title: "Resize Signature to 140x60 Pixels",
    description: "Resize a signature image to 140 x 60 pixels locally for strict form, exam, and admin upload rules.",
    headline: "Resize signature to 140 x 60 pixels",
    lead: "Use this when an upload page says a signature image must be exactly 140 x 60 pixels before it will accept the file.",
    primaryTool: "tools/resize-image?width=140&height=60&fit=contain",
    intent: "resize signature 140x60, signature dimensions 140 x 60, no upload",
    sections: [
      ["Match the pixel rule first", "Open the image resizer with 140 x 60 pixels prefilled. Fit-inside mode keeps the full signature visible instead of cropping off strokes."],
      ["Then check file size", "After resizing, use the image-to-KB compressor if the same portal also says the signature must be under 20KB, 50KB, or another limit."],
      ["Review the visual signature", "Make sure the signature remains readable, centered, and not accidentally cropped. This is a visual file helper, not identity verification."],
    ],
    serviceLead: uploadLimitLandingServiceLead("resize a signature to 140 x 60 pixels"),
    relatedTools: ["tools/resize-image?width=140&height=60&fit=contain", "tools/compress-image-to-kb?targetKb=20", "tools/signature-png", "tools/crop-image"],
  },
  {
    path: "resize-signature-200x100",
    title: "Resize Signature to 200x100 Pixels",
    description: "Resize a signature image to 200 x 100 pixels locally for wider form, job, and admin upload rules.",
    headline: "Resize signature to 200 x 100 pixels",
    lead: "Use this when an upload page says a signature image must be exactly 200 x 100 pixels before it will accept the file.",
    primaryTool: "tools/resize-image?width=200&height=100&fit=contain",
    intent: "resize signature 200x100, signature dimensions 200 x 100, no upload",
    sections: [
      ["Match the wider signature box", "Open the image resizer with 200 x 100 pixels prefilled. Fit-inside mode keeps the complete signature visible and adds empty space if needed."],
      ["Compress after resizing", "If the portal also gives a file-size limit such as 50KB, run the resized result through the image-to-KB compressor after exporting."],
      ["Review the result", "Make sure strokes are not cropped, stretched, or too faint. This prepares a visual signature image only and does not verify identity."],
    ],
    serviceLead: uploadLimitLandingServiceLead("resize a signature to 200 x 100 pixels"),
    relatedTools: ["tools/resize-image?width=200&height=100&fit=contain", "tools/compress-image-to-kb?targetKb=50", "tools/signature-png", "tools/crop-image"],
  },
  {
    path: "resize-photo-200x230",
    title: "Resize Photo to 200x230 Pixels",
    description: "Resize a JPG, PNG, or WebP photo to 200 x 230 pixels locally for strict exam, job, and application upload forms.",
    headline: "Resize photo to 200 x 230 pixels",
    lead: "Choose a photo and open the resizer with 200 x 230 pixels prefilled. Use it when a form or portal gives this exact photo dimension and rejects ordinary phone photos.",
    primaryTool: "tools/resize-image?width=200&height=230&fit=cover",
    intent: "resize photo to 200x230, 200 x 230 photo size, application photo dimensions",
    sections: [
      ["Use exact pixels", "Some upload forms validate photo width and height before checking anything else. The prefilled resizer exports an exact 200 x 230 pixel image."],
      ["Crop for face placement", "Cover mode fills the target size and may crop edges. If the face placement needs more control, use the passport photo or crop tool first."],
      ["Then check KB size", "After resizing, compress the exported file if the same portal also asks for under 20KB, 50KB, or 100KB."],
    ],
    serviceLead: uploadLimitLandingServiceLead("resize a photo to 200 x 230 pixels"),
    relatedTools: ["tools/resize-image?width=200&height=230&fit=cover", "tools/compress-image-to-kb?targetKb=50", "tools/passport-photo", "tools/crop-image"],
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
    path: "tools/invoice-followup-email",
    title: "Invoice Follow-up Email Generator",
    description: "Write a polite invoice reminder, due-today note, overdue follow-up, paid thank-you, or next-invoice email without uploading private invoice details.",
    body: [
      "Choose the invoice status, tone, timing, and payment wording to generate a copy-ready follow-up email and one-page PDF.",
      "This free tool is intentionally wording-only. It does not give legal, tax, accounting, debt-collection, or financial advice, and it asks users to keep private invoice details out.",
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
    commitment: "request-invoice",
    bestFor: "A sponsor wants to know whether their product is safe and relevant before buying a visible placement.",
    deliverable: "Manual sponsor-fit review, audience match, recommended page family, and safe next-step copy.",
    proofNeeded: "Company URL, product category, intended audience, and any placement rules.",
    trackedUrl: `${siteUrl("sponsor-starter-review").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_starter_review&utm_content=starter-fit-review&commitment=request-invoice#sponsor-inquiry`,
  },
  {
    id: "guide-sponsor-pilot",
    title: "Guide sponsor pilot",
    price: "USD 99-149",
    budgetRange: "250-500",
    placement: "content-sponsorship",
    timeline: "this-month",
    commitment: "request-invoice",
    bestFor: "A PDF, image, QR, career, classroom, or small-business product wants one clearly labeled pilot mention.",
    deliverable: "One manually approved, clearly labeled sponsor mention on a relevant guide or resource page.",
    proofNeeded: "Campaign fit, sponsor copy draft, safe landing URL, and category exclusions.",
    trackedUrl: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=guide-sponsor-pilot&commitment=request-invoice#sponsor-inquiry`,
  },
  {
    id: "vertical-category-pilot",
    title: "Vertical category pilot",
    price: "USD 149-250",
    budgetRange: "250-500",
    placement: "directory-visibility",
    timeline: "this-month",
    commitment: "request-invoice",
    bestFor: "A partner cares about one audience such as QR/local marketing, resume/career, classroom, or small-business paperwork.",
    deliverable: "Tracked vertical sponsor page, fit review, and one approved contextual placement candidate.",
    proofNeeded: "Target vertical, audience fit, sponsor category, and safe public landing URL.",
    trackedUrl: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=vertical-category-pilot&commitment=request-invoice#sponsor-inquiry`,
  },
  {
    id: "partner-distribution-test",
    title: "Partner distribution test",
    price: "No-cash mutual test",
    budgetRange: "exploratory",
    placement: "partner-distribution",
    timeline: "exploratory",
    commitment: "question-only",
    bestFor: "A newsletter, directory, resource page, or community wants to test relevant traffic before a paid placement.",
    deliverable: "Tracked partner link, source attribution, and review against page views, depth, downloads, or lead signal.",
    proofNeeded: "Partner page, expected audience, planned link context, and review window.",
    trackedUrl: `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=partner-distribution-test&commitment=question-only#sponsor-inquiry`,
  },
];

const DEFAULT_SPONSOR_DEAL_ID = "starter-fit-review";

function sponsorDealPrefillAttrs(deal) {
  return [
    `data-sponsor-deal-id="${escapeHtml(deal.id)}"`,
    `data-sponsor-placement="${escapeHtml(deal.placement)}"`,
    `data-sponsor-budget-range="${escapeHtml(deal.budgetRange)}"`,
    `data-sponsor-timeline="${escapeHtml(deal.timeline)}"`,
    `data-sponsor-commitment="${escapeHtml(sponsorDealCommitment(deal))}"`,
    `data-sponsor-notes="${escapeHtml(`${deal.title} (${deal.price}): ${deal.deliverable} Needed: ${deal.proofNeeded}`)}"`,
  ].join(" ");
}

function sponsorDealCommitment(deal) {
  return deal?.commitment || (String(deal?.price || "").toLowerCase().includes("no-cash") ? "question-only" : "request-invoice");
}

function sponsorQuickDealOptions() {
  return SPONSOR_DEALS
    .filter((deal) => sponsorDealCommitment(deal) === "request-invoice")
    .map((deal) => `<option value="${escapeHtml(deal.id)}"${deal.id === DEFAULT_SPONSOR_DEAL_ID ? " selected" : ""}>${escapeHtml(deal.title)} - ${escapeHtml(deal.price)}</option>`)
    .join("\n");
}

function sponsorInvoiceRequestCopy(prospect, deal, vertical, dealUrl) {
  return [
    "Hi PrintableTools Lab team,",
    "",
    `We are interested in the ${deal.title} (${deal.price}) for ${vertical.title}.`,
    `Company/prospect: ${prospect.name}`,
    `Pilot link: ${dealUrl}`,
    "",
    "Please review fit and send the external invoice/agreement if this sponsor placement is policy-safe.",
    "We will keep payment, tax, bank, phone, and private customer details outside the website form.",
  ].join("\n");
}

function sponsorPublicReplyUrl({ prospectName = "", website = "", verticalTitle = "", dealTitle = "", dealPrice = "", proposalUrl = "" } = {}) {
  const title = `[Sponsor/Partner]: ${prospectName || "Sponsor pilot review"}`;
  const body = [
    "Public-safe sponsor reply.",
    "",
    `Company / project: ${prospectName}`,
    `Public website URL: ${website}`,
    `Audience fit: ${verticalTitle}`,
    `Selected pilot deal: ${dealTitle}${dealPrice ? ` (${dealPrice})` : ""}`,
    `Proposal or deal URL: ${proposalUrl}`,
    "",
    "Requested next step: Request pilot invoice review",
    "",
    "Do not include private payment, tax, bank, phone, customer, identity, password, or confidential file data in this public issue.",
  ].join("\n");
  const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
  url.searchParams.set("title", title);
  url.searchParams.set("body", body);
  url.searchParams.set("labels", "sponsor,partner,business-review");
  return url.toString();
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
    url: `${siteUrl("sponsor-starter-review")}?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_call&utm_content=starter-review`,
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
    title: "USD 49 starter sponsor review",
    path: "sponsor-starter-review",
    url: `${siteUrl("sponsor-starter-review").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=discovery`,
    canonicalUrl: siteUrl("sponsor-starter-review"),
    reason: "Shortest paid pilot entry point for sponsors who want a manual fit review before any visible placement or invoice.",
  },
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
    title: "Public USD 49 invoice request",
    path: "github-sponsor-issue",
    url: sponsorPublicReplyUrl({
      verticalTitle: SPONSOR_VERTICALS[0]?.title || "",
      dealTitle: SPONSOR_DEALS.find((deal) => deal.id === "starter-fit-review")?.title || "Starter fit review",
      dealPrice: SPONSOR_DEALS.find((deal) => deal.id === "starter-fit-review")?.price || "USD 49",
      proposalUrl: `${siteUrl("sponsor-starter-review").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=public-invoice-request&commitment=request-invoice#sponsor-inquiry`,
    }),
    canonicalUrl: "https://github.com/yanqr213/printable-tools-lab/issues/new",
    reason: "Public-safe prefilled GitHub issue for partners who want a verifiable USD 49 invoice-review request without using site lead storage; no private payment, tax, bank, phone, customer, identity, password, or file data.",
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

function sponsorInvoiceReviewUrl({ source = "sponsor-opportunities", medium = "organic", content = "board", verticalSlug = "" } = {}) {
  const url = new URL(siteUrl("sponsor-starter-review"));
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", "sponsor_starter_review");
  url.searchParams.set("utm_content", content);
  if (verticalSlug) url.searchParams.set("vertical", verticalSlug);
  url.searchParams.set("commitment", "request-invoice");
  url.hash = "sponsor-inquiry";
  return url.toString();
}

function sponsorProspectPathEntry(vertical, source = "sponsor-opportunities") {
  return {
    slug: vertical.slug,
    title: vertical.title,
    audience: vertical.audience,
    sponsorFit: vertical.sponsorFit,
    bestFitCategories: vertical.sponsorCategories,
    verticalPageUrl: siteUrl(`sponsor/${vertical.slug}`),
    trackedVerticalUrl: `${siteUrl(`sponsor/${vertical.slug}`).replace(/\/$/, "")}?utm_source=${encodeURIComponent(source)}&utm_medium=organic&utm_campaign=${encodeURIComponent(vertical.campaign)}&utm_content=prospect-path`,
    invoiceReviewUrl: sponsorInvoiceReviewUrl({ source, content: `prospect-${vertical.slug}`, verticalSlug: vertical.slug }),
    firstAction: "Request USD 49 invoice review",
    proofNeeded: "Company URL, product category, intended audience, safe landing page, and placement exclusions.",
  };
}

function sponsorExternalDiscoveryProof() {
  const directoryReport = readPublicJsonReport("directory-monitor.json", {});
  const indexNowReport = readPublicJsonReport("indexnow-report.json", {});
  const listedDirectories = (Array.isArray(directoryReport.results) ? directoryReport.results : [])
    .filter((item) => item && item.status === "listed")
    .map((item) => ({
      name: item.name || "",
      evidenceUrl: item.evidenceUrl || item.url || "",
      submittedAt: item.submittedAt || "",
      reviewWindow: item.reviewWindow || "",
    }))
    .filter((item) => item.name && item.evidenceUrl);
  const acceptedTargets = Array.isArray(indexNowReport.acceptedTargets) ? indexNowReport.acceptedTargets : [];
  const indexNowSubmittedUrls = (Array.isArray(indexNowReport.results) ? indexNowReport.results : [])
    .reduce((sum, item) => sum + Number(item.submittedUrls || 0), 0);
  const listedCount = Number(directoryReport.listedCount || listedDirectories.length || 0);
  const pendingCount = Number(directoryReport.pendingCount || 0);
  const proofLine = listedCount
    ? `External discovery proof: ${listedCount} public directory listing(s) are live; ${pendingCount} more listing(s) remain pending; IndexNow accepted ${indexNowSubmittedUrls} URL(s) across ${acceptedTargets.length} target(s). These are discovery signals, not revenue.`
    : "External discovery proof is still pending; clicks, views, and submissions are not revenue.";
  return {
    generatedAt: directoryReport.generatedAt || indexNowReport.generatedAt || "",
    directoryListedCount: listedCount,
    directoryPendingCount: pendingCount,
    directoryErrorCount: Number(directoryReport.errorCount || 0),
    listedDirectories,
    indexNowAcceptedTargets: acceptedTargets,
    indexNowSubmittedUrls,
    publicProofLine: proofLine,
    moneyBoundary: "Directory listings, IndexNow submissions, clicks, and views are discovery signals only. Revenue is real only after a signed sponsor agreement or settled external payment.",
  };
}

function sponsorExternalDiscoveryProofHtml() {
  const proof = sponsorExternalDiscoveryProof();
  if (!proof.directoryListedCount) return "";
  const names = proof.listedDirectories.slice(0, 4).map((item) => item.name).join(", ");
  const links = proof.listedDirectories.slice(0, 4)
    .map((item) => `<a href="${escapeHtml(item.evidenceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(item.name)}</a>`)
    .join(" ");
  return `
      <section class="shell section sponsor-proof">
        <h2>Public discovery proof</h2>
        <p>${escapeHtml(proof.publicProofLine)}</p>
        <p class="help">Live evidence: ${links || escapeHtml(names)}. ${escapeHtml(proof.moneyBoundary)}</p>
      </section>`;
}

function sponsorOpportunityPayload(generatedAt = new Date().toISOString()) {
  const trackedInquiryUrl = `${siteUrl("sponsor").replace(/\/$/, "")}?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=sponsor_opportunities&utm_content=board#sponsor-inquiry`;
  const starterReviewUrl = sponsorInvoiceReviewUrl({ source: "sponsor-opportunities", content: "board-hero" });
  const externalDiscoveryProof = sponsorExternalDiscoveryProof();
  return {
    name: "PrintableTools Lab Sponsor Opportunities",
    generatedAt,
    canonical: siteUrl("sponsor-opportunities"),
    sponsorPage: siteUrl("sponsor"),
    sponsorCall: siteUrl("sponsor-call"),
    sponsorStarterReview: siteUrl("sponsor-starter-review"),
    mediaKit: siteUrl("sponsor-media-kit.json").replace(/\/$/, ""),
    inquiryUrl: trackedInquiryUrl,
    starterReviewUrl,
    invoiceReviewUrl: starterReviewUrl,
    recommendedNextStep: "Request the USD 49 starter invoice review before any visible sponsor placement is discussed.",
    publicReplyUrl: sponsorPublicReplyUrl({ proposalUrl: starterReviewUrl }),
    externalDiscoveryProof,
    opportunities: SPONSOR_VERTICALS.map((vertical) => ({
      slug: vertical.slug,
      title: vertical.title,
      audience: vertical.audience,
      sponsorFit: vertical.sponsorFit,
      priceHint: vertical.priceHint,
      trackedUrl: `${siteUrl(`sponsor/${vertical.slug}`).replace(/\/$/, "")}?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=${encodeURIComponent(vertical.campaign)}&utm_content=board`,
      invoiceReviewUrl: sponsorInvoiceReviewUrl({ source: "sponsor-opportunities", content: `board-${vertical.slug}`, verticalSlug: vertical.slug }),
      categories: vertical.sponsorCategories,
    })),
    prospectPaths: SPONSOR_VERTICALS.map((vertical) => sponsorProspectPathEntry(vertical)),
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
  const inquiryUrl = `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=direct#sponsor-inquiry`;
  const externalDiscoveryProof = sponsorExternalDiscoveryProof();
  return {
    name: "PrintableTools Lab Sponsor Deal Room",
    generatedAt,
    canonical: siteUrl("sponsor-deal-room"),
    inquiryUrl,
    starterReviewPage: siteUrl("sponsor-starter-review"),
    publicReplyUrl: sponsorPublicReplyUrl({ proposalUrl: inquiryUrl }),
    externalDiscoveryProof,
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
  const externalDiscoveryProof = sponsorExternalDiscoveryProof();
  return {
    name: "PrintableTools Lab Sponsor Media Kit",
    generatedAt,
    site: siteUrl(""),
    sponsorPage: siteUrl("sponsor"),
    sponsorStarterReview: siteUrl("sponsor-starter-review"),
    sponsorDealRoom: siteUrl("sponsor-deal-room"),
    publicReplyForm: sponsorPublicReplyUrl({ proposalUrl: siteUrl("sponsor-deal-room") }),
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
    externalDiscoveryProof,
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
  const externalDiscoveryProof = sponsorExternalDiscoveryProof();
  return {
    name: "PrintableTools Lab Sponsor Call",
    generatedAt,
    canonical: siteUrl("sponsor-call"),
    sponsorPage: siteUrl("sponsor"),
    sponsorStarterReview: siteUrl("sponsor-starter-review"),
    sponsorDealRoom: siteUrl("sponsor-deal-room"),
    publicReplyForm: sponsorPublicReplyUrl({ proposalUrl: siteUrl("sponsor-call") }),
    publicInvoiceRequest: SPONSOR_DISCOVERY_LINKS.find((item) => item.path === "github-sponsor-issue")?.url || sponsorPublicReplyUrl({ proposalUrl: siteUrl("sponsor-starter-review") }),
    mediaKit: siteUrl("sponsor-media-kit.json").replace(/\/$/, ""),
    outreachPack: siteUrl("sponsor-outreach-pack.json").replace(/\/$/, ""),
    actions: SPONSOR_CALL_ACTIONS,
    discoveryLinks: SPONSOR_DISCOVERY_LINKS,
    externalDiscoveryProof,
    verticalSponsorPages: SPONSOR_VERTICALS.map(sponsorVerticalEntry),
    publicFacts: {
      tools: tools.length,
      guides: guides.length,
      landingPages: landingPages.length,
      exports: "Free no-signup browser exports.",
      externalDiscovery: externalDiscoveryProof.publicProofLine,
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
            <a class="button secondary" data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack" href="/invoice-followup-copy-pack/?utm_source=home&utm_medium=site&utm_campaign=invoice_followup_service&utm_content=hero#service-request">Request $19 follow-up copy</a>
            <a class="button ghost" data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="/upload-limit-fix-plan/?utm_source=home&utm_medium=site&utm_campaign=upload_limit_fix_plan&utm_content=hero#invoice-request">Request $9 upload fix</a>
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
      ${homeInvoiceFollowupCloseHtml()}
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
            <p><a class="button" href="/free-pdf-tools/">Browse free tools</a> <a class="button secondary" data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="/upload-limit-fix-plan/?utm_source=home&utm_medium=site&utm_campaign=upload_limit_fix_plan&utm_content=validation-band#invoice-request">Request $9 upload fix</a></p>
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
    path: "sponsor-starter-review",
    title: "USD 49 Starter Sponsor Review",
    description: "Direct USD 49 starter sponsor review page for policy-fit partners who want a manual fit check before any visible placement or external invoice.",
    html: sponsorStarterReviewHtml(),
  },
  {
    path: "sponsor-proposal",
    title: "Sponsor Proposal",
    description: "Noindex sponsor proposal page for one policy-fit partner, with a recommended pilot deal and prefilled inquiry path.",
    index: false,
    html: `<section class="shell section"><h1>Sponsor proposal</h1><p>This direct proposal page loads a partner-specific sponsor fit, recommended deal, and prefilled inquiry form after the app loads.</p><p><a class="button" data-sponsor-public-invoice-request href="${escapeHtml(sponsorPublicReplyUrl({ proposalUrl: siteUrl("sponsor-proposal"), dealTitle: "Starter fit review", dealPrice: "USD 49" }))}" target="_blank" rel="noreferrer">Open public invoice request</a> <a class="button secondary" href="#sponsor-quick-form">Use one-field review form</a></p><p class="help">Use only public company, website, audience-fit, and deal context in the issue. Payment, tax, bank, phone, identity, password, and customer-file details stay outside the public request.</p></section>${sponsorLeadFormHtml()}${sponsorExternalDiscoveryProofHtml()}`,
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
    title: LOCAL_SELLER_STARTER_KIT.name,
    description: LOCAL_SELLER_STARTER_KIT.shortDescription,
    html: localSellerStarterKitHtml(),
  },
  {
    path: CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug,
    title: CUSTOM_LOCAL_PRINT_PACK_SERVICE.name,
    description: CUSTOM_LOCAL_PRINT_PACK_SERVICE.shortDescription,
    html: customLocalPrintPackServiceHtml(),
  },
  {
    path: INVOICE_FOLLOWUP_COPY_PACK_SERVICE.slug,
    title: INVOICE_FOLLOWUP_COPY_PACK_SERVICE.name,
    description: INVOICE_FOLLOWUP_COPY_PACK_SERVICE.shortDescription,
    html: paidServiceHtml(INVOICE_FOLLOWUP_COPY_PACK_SERVICE, {
      crumb: "Invoice generator",
      crumbHref: "/tools/invoice-generator/",
      formTitle: "Request a free invoice follow-up fit check",
      formCta: "Send invoice fit check",
      formIntro: "Send a reply contact and one public-safe note about the invoice status and tone you need. If it fits, the $19 copy pack starts only through an external checkout or invoice.",
      formPlaceholder: "I sent an invoice for a freelance project and need a friendly reminder plus a firmer overdue follow-up. No private invoice or client details included.",
      secondaryHref: "/tools/invoice-generator/",
      secondaryText: "Open free invoice generator",
    }),
  },
  {
    path: UPLOAD_LIMIT_FIX_PLAN_SERVICE.slug,
    title: UPLOAD_LIMIT_FIX_PLAN_SERVICE.name,
    description: UPLOAD_LIMIT_FIX_PLAN_SERVICE.shortDescription,
    html: paidServiceHtml(UPLOAD_LIMIT_FIX_PLAN_SERVICE, {
      crumb: "Upload limit fixer",
      crumbHref: "/upload-limit-fixer/",
      formTitle: "Request a public-safe upload fix fit check",
      formCta: "Send upload fix fit check",
      formIntro: "Send a reply contact and one public-safe note about the upload error, target rule, and file type. If it fits, the $9 plan starts only through an external checkout or invoice.",
      formPlaceholder: "The portal says my PDF must be less than 1MB. I need a no-upload plan for what tool and settings to try. No file attached.",
      formDefaultSummary: "I need a $9 Upload Limit Fix Plan for one rejected file upload: best free tool, target settings, fallback steps, and a review checklist. No file upload, private document, ID photo, resume, portal login, bank details, tax IDs, or private account data included.",
      secondaryHref: "/upload-limit-fixer/",
      secondaryText: "Open free upload limit fixer",
    }),
  },
  {
    path: MARKET_TABLE_PRINT_AUDIT.slug,
    title: MARKET_TABLE_PRINT_AUDIT.name,
    description: MARKET_TABLE_PRINT_AUDIT.shortDescription,
    html: marketTablePrintAuditHtml(),
  },
  {
    path: SERVICE_SALES_PACK.slug,
    title: SERVICE_SALES_PACK.name,
    description: SERVICE_SALES_PACK.shortDescription,
    html: serviceSalesPackHtml(),
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
    chrome: "internal",
    html: `<section class="shell section"><h1>Local validation dashboard</h1><p>This page shows local browser validation events after the app loads.</p></section>`,
  },
  {
    path: "ops",
    title: "Project Operations Monitor",
    description: "Noindex operations monitor for project-level traffic, sponsor close actions, source, path, tool, game, and monetization signals.",
    index: false,
    robots: "noindex,nofollow",
    chrome: "internal",
    html: opsMonitorStaticHtml(),
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

function homeInvoiceFollowupCloseHtml() {
  return `<section class="shell section service-upgrade-cta" aria-label="Invoice follow-up copy service">
        <div>
          <p class="eyebrow">Quick paid help</p>
          <h2>Made an invoice? Get the follow-up sequence written for $19.</h2>
          <p>The free invoice generator stays free. If you want editable reminder, due-today, first-overdue, thank-you, and next-invoice wording for one workflow, send the one-field $19 request before any external checkout or invoice is sent.</p>
        </div>
        <div class="home-service-lead-panel">
          ${invoiceFollowupInlineLeadFormHtml({
            pathName: "/",
            utmSource: "home",
            utmContent: "homepage-inline",
            submitLabel: "Send $19 sequence request",
            className: "home-invoice-lead-form invoice-micro-lead-form",
            compact: true,
          })}
          <div class="actions">
            <a class="button secondary" data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack" href="/invoice-followup-copy-pack/?utm_source=home&utm_medium=site&utm_campaign=invoice_followup_service&utm_content=inline-secondary#service-request">Open full $19 service page</a>
            <a class="button secondary" data-track-event="free_tool_depth" data-track-tool="invoice-followup-email" href="/tools/invoice-followup-email/?utm_source=home&utm_medium=site&utm_campaign=invoice_followup_tool&utm_content=close-band">Write one free follow-up first</a>
          </div>
        </div>
      </section>`;
}

function invoiceFollowupInlineLeadFormHtml(options = {}) {
  const pathName = options.pathName || "/";
  const utmSource = options.utmSource || "tool_cta";
  const utmMedium = options.utmMedium || "site";
  const utmCampaign = options.utmCampaign || "invoice_followup_service";
  const utmContent = options.utmContent || "invoice-inline";
  const submitLabel = options.submitLabel || "Send invoice fit check";
  const className = options.className || "invoice-inline-lead-form";
  const compact = Boolean(options.compact);
  const requestSummary = options.requestSummary || "I need a $19 invoice follow-up copy pack for one workflow: polite reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice wording. No private invoice numbers, client names, bank details, tax IDs, legal dispute details, or customer lists included.";
  const fallbackUrl = serviceLeadFallbackUrl({
    serviceType: "invoice-followup-copy-pack",
    pathName,
    requestSummary,
  });
  const invoiceRequestUrl = serviceInvoiceRequestUrl({
    serviceType: "invoice-followup-copy-pack",
    pathName,
    requestSummary,
  });
  const requestSummaryField = compact
    ? `<input type="hidden" name="requestSummary" value="${escapeHtml(requestSummary)}">`
    : `<label class="field">
            <span>Invoice follow-up needed</span>
            <textarea name="requestSummary" maxlength="1000" required>${escapeHtml(requestSummary)}</textarea>
          </label>`;
  return `<form class="panel form-grid service-lead-form ${escapeHtml(className)}" data-service-lead-form data-service-type="invoice-followup-copy-pack" data-lead-path="${escapeHtml(pathName)}" data-utm-source="${escapeHtml(utmSource)}" data-utm-medium="${escapeHtml(utmMedium)}" data-utm-campaign="${escapeHtml(utmCampaign)}" data-utm-content="${escapeHtml(utmContent)}" data-service-fallback-url="${escapeHtml(fallbackUrl)}">
          <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
          <input type="hidden" name="serviceType" value="invoice-followup-copy-pack">
          <input type="hidden" name="utmSource" value="${escapeHtml(utmSource)}">
          <input type="hidden" name="utmMedium" value="${escapeHtml(utmMedium)}">
          <input type="hidden" name="utmCampaign" value="${escapeHtml(utmCampaign)}">
          <input type="hidden" name="utmContent" value="${escapeHtml(utmContent)}">
          ${requestSummaryField}
          <label class="field">
            <span>Reply email, @handle, or public contact URL</span>
            <input name="contact" maxlength="180" autocomplete="email" placeholder="you@example.com, @publichandle, or https://example.com/contact" required>
          </label>
          <label class="field">
            <span>Need-by date (optional)</span>
            <input name="needBy" maxlength="80" placeholder="Today, this week, or before the due date">
          </label>
          <label class="check-row">
            <input name="consent" type="checkbox" ${compact ? "checked " : ""}required>
            <span>I will keep payment, tax, identity, passwords, customer lists, and private invoice details outside this form.</span>
          </label>
          <div class="actions">
            <button class="button" type="submit" data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack">${escapeHtml(submitLabel)}</button>
            <button class="button secondary" type="submit" data-service-invoice-submit data-track-tool="invoice-followup-copy-pack" data-invoice-fallback-url="${escapeHtml(invoiceRequestUrl)}">Request $19 invoice link</button>
            <a class="button ghost" data-service-lead-fallback-link data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack" href="${escapeHtml(fallbackUrl)}" target="_blank" rel="noreferrer">Open public-safe request</a>
          </div>
          <p class="help service-lead-status" data-service-lead-status role="status" aria-live="polite">Fastest path: send this public-safe fit check. Payment happens only through a real external checkout or invoice after fit is confirmed.</p>
        </form>`;
}

function uploadLimitFixPlanRequestSummary(service = UPLOAD_LIMIT_FIX_PLAN_SERVICE) {
  return `I need a $${service.priceUsd} ${service.name} for one rejected file upload: best free tool, target settings, fallback steps, and a review checklist. No file upload, private document, ID photo, resume, portal login, bank details, tax IDs, or private account data included.`;
}

function uploadLimitFixPlanInlineLeadFormHtml(options = {}) {
  const pathName = options.pathName || "/upload-limit-fixer/";
  const utmSource = options.utmSource || "upload-limit";
  const utmMedium = options.utmMedium || "site";
  const utmCampaign = options.utmCampaign || "upload_limit_fix_plan";
  const utmContent = options.utmContent || "upload-limit-inline";
  const submitLabel = options.submitLabel || "Send $9 fix-plan request";
  const className = options.className || "upload-limit-fix-plan-lead-form";
  const compact = Boolean(options.compact);
  const imageKbToolFixFormAttr = options.imageKbToolFixForm ? " data-compress-image-kb-tool-fix-form" : "";
  const primaryInvoiceRequest = Boolean(options.primaryInvoiceRequest);
  const oneFieldInvoiceRequest = Boolean(options.oneFieldInvoiceRequest || (compact && primaryInvoiceRequest));
  const requestSummary = options.requestSummary || uploadLimitFixPlanRequestSummary();
  const fallbackUrl = serviceLeadFallbackUrl({
    serviceType: "upload-limit-fix-plan",
    pathName,
    requestSummary,
  });
  const invoiceRequestUrl = serviceInvoiceRequestUrl({
    serviceType: "upload-limit-fix-plan",
    pathName,
    requestSummary,
  });
  const publicRequestUrl = primaryInvoiceRequest ? invoiceRequestUrl : fallbackUrl;
  const publicRequestEvent = primaryInvoiceRequest ? "service_invoice_request" : "service_request_intent";
  const publicRequestLabel = primaryInvoiceRequest ? "Open public-safe $9 invoice request" : "Open public-safe request";
  const primaryInvoiceAttr = primaryInvoiceRequest ? ' data-service-primary-invoice-request="true"' : "";
  const requestSummaryField = compact
    ? `<input type="hidden" name="requestSummary" value="${escapeHtml(requestSummary)}" data-upload-fix-plan-summary>`
    : `<label class="field">
            <span>Upload error and target rule</span>
            <textarea name="requestSummary" maxlength="1000" required data-upload-fix-plan-summary>${escapeHtml(requestSummary)}</textarea>
          </label>`;
  const needByField = compact
    ? `<input type="hidden" name="needBy" value="${escapeHtml(options.needBy || "")}">`
    : `<label class="field">
            <span>Need-by time (optional)</span>
            <input name="needBy" maxlength="80" placeholder="Today, tomorrow morning, or before the portal deadline">
          </label>`;
  const extraNote = options.extraNote ? `\n          <p class="notice compact-notice">${escapeHtml(options.extraNote)}</p>` : "";
  const consentField = oneFieldInvoiceRequest
    ? `<input type="hidden" name="consent" value="on">
          <p class="help compact-consent-note">By sending, you confirm no actual file, private document, ID photo, resume, portal login, payment, tax, identity, or account details are included.</p>`
    : `<label class="check-row">
            <input name="consent" type="checkbox" ${compact ? "checked " : ""}required>
            <span>I will not upload or paste the actual file, private document, ID photo, resume, portal login, payment, tax, identity, or account details.</span>
          </label>`;
  const primaryInvoiceButtons = [
    `<button class="button" type="submit" data-service-invoice-submit data-track-tool="upload-limit-fix-plan" data-invoice-fallback-url="${escapeHtml(invoiceRequestUrl)}">${escapeHtml(submitLabel)}</button>`,
    oneFieldInvoiceRequest ? "" : `<button class="button secondary" type="submit" data-track-event="service_request_intent" data-track-tool="upload-limit-fix-plan">Send $9 fix-plan request</button>`,
  ].filter(Boolean).join("\n            ");
  return `<form class="panel form-grid service-lead-form ${escapeHtml(className)}" data-service-lead-form data-upload-fix-plan-form${imageKbToolFixFormAttr}${primaryInvoiceAttr} data-service-type="upload-limit-fix-plan" data-lead-path="${escapeHtml(pathName)}" data-utm-source="${escapeHtml(utmSource)}" data-utm-medium="${escapeHtml(utmMedium)}" data-utm-campaign="${escapeHtml(utmCampaign)}" data-utm-content="${escapeHtml(utmContent)}" data-service-fallback-url="${escapeHtml(publicRequestUrl)}" data-service-invoice-fallback-url="${escapeHtml(invoiceRequestUrl)}">
          <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
          <input type="hidden" name="serviceType" value="upload-limit-fix-plan">
          <input type="hidden" name="utmSource" value="${escapeHtml(utmSource)}">
          <input type="hidden" name="utmMedium" value="${escapeHtml(utmMedium)}">
          <input type="hidden" name="utmCampaign" value="${escapeHtml(utmCampaign)}">
          <input type="hidden" name="utmContent" value="${escapeHtml(utmContent)}">
          ${requestSummaryField}${extraNote}
          <label class="field">
            <span>Where should the external $9 invoice link go?</span>
            <input name="contact" maxlength="180" autocomplete="email" placeholder="you@example.com, @publichandle, or https://example.com/contact" required>
          </label>
          ${needByField}
          ${consentField}
          <div class="actions">
            ${primaryInvoiceRequest
              ? primaryInvoiceButtons
              : `<button class="button" type="submit" data-track-event="service_request_intent" data-track-tool="upload-limit-fix-plan">${escapeHtml(submitLabel)}</button>
            <button class="button secondary" type="submit" data-service-invoice-submit data-track-tool="upload-limit-fix-plan" data-invoice-fallback-url="${escapeHtml(invoiceRequestUrl)}">Request $9 invoice link</button>`}
            <a class="button ghost" data-service-lead-fallback-link data-track-event="${escapeHtml(publicRequestEvent)}" data-track-tool="upload-limit-fix-plan" href="${escapeHtml(publicRequestUrl)}" target="_blank" rel="noreferrer">${escapeHtml(publicRequestLabel)}</a>
          </div>
          <p class="help service-lead-status" data-service-lead-status role="status" aria-live="polite">No file upload. Payment happens only through a real external checkout or invoice after fit is confirmed.</p>
          <p class="help" data-upload-fix-plan-prefill-status hidden>Request note updated from the upload error matcher.</p>
        </form>`;
}

function uploadLimitLandingServiceLead(workflow) {
  return {
    serviceType: "upload-limit-fix-plan",
    title: "Need a $9 upload fix plan?",
    cta: "Send $9 upload fix request",
    intro: "Use the free no-upload tool first, or send this public-safe fit check if the receiving portal keeps rejecting the file.",
    placeholder: `I need a $9 Upload Limit Fix Plan for ${workflow}. The public-safe error is: [paste exact upload message]. File type and target rule: [PDF/image/JPG/PNG, size limit, dimensions, or portal rule]. No actual file, private document, ID photo, resume, portal login, bank details, tax IDs, or private account data included.`,
    defaultSummary: `I need a $9 Upload Limit Fix Plan for ${workflow}: best free tool, target settings, fallback steps, and a review-before-upload checklist. No file upload, private document, ID photo, resume, portal login, bank details, tax IDs, or private account data included.`,
    utmCampaign: "upload_limit_fix_plan",
  };
}

function uploadErrorQuickRequestPanelHtml(requestSummary) {
  return `<div class="upload-error-quick-request" id="upload-error-quick-request" data-upload-error-quick-request hidden>
          <div class="grid-2 service-micro-intent-section">
            <div>
              <p class="eyebrow">Selected error</p>
              <h3>Get the exact $9 plan for this row.</h3>
              <p data-upload-error-quick-copy>Choose an error row to prefill a public-safe request.</p>
            </div>
            ${uploadLimitFixPlanInlineLeadFormHtml({
              pathName: "/upload-error-cheatsheet/",
              utmSource: "upload-error-cheatsheet",
              utmMedium: "site",
              utmCampaign: "upload_error_cheatsheet_fix_plan",
              utmContent: "cheatsheet-row-quick",
              requestSummary,
              className: "upload-limit-fix-plan-micro-lead-form upload-error-quick-lead-form",
              submitLabel: "Request $9 invoice link",
              extraNote: "Shortest path: the selected error is already written. Add one reply email or public handle to get the external $9 invoice link after fit is confirmed.",
              compact: true,
              primaryInvoiceRequest: true,
            })}
          </div>
        </div>`;
}

const GUIDE_HINTS_FOR_LINKS = {
  "invoice-generator": ["invoice"],
  "invoice-followup-email": ["invoice"],
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

function opsMonitorStaticHtml() {
  const report = readOpsValidationSnapshot();
  const metrics = report?.live?.metrics || {};
  const apiMetrics = report?.live?.checks?.["/api/metrics"]?.json || {};
  const totals = metrics.totals || apiMetrics.totals || {};
  const todayTotals = metrics.todayTotals || apiMetrics.todayTotals || {};
  const sourceRows = opsActiveRows(apiMetrics.sources || [], opsSourceScore).slice(0, 8);
  const toolRows = opsActiveRows(metrics.topTools || apiMetrics.tools || [], opsToolScore).slice(0, 8);
  const totalDownloads = Number(metrics.totalDownloads ?? apiMetrics.totalDownloads ?? ((totals.download_pdf || 0) + (totals.download_file || 0))) || 0;
  const totalGenerations = Number(metrics.totalGenerations ?? apiMetrics.totalGenerations ?? ((totals.generate_pdf || 0) + (totals.generate_file || 0))) || 0;
  const commercialIntent = Number(metrics.commercialIntent ?? apiMetrics.commercialIntent ?? opsCommercialIntent(totals)) || 0;
  const sponsorLeads = Number(metrics.sponsorLeads ?? apiMetrics.sponsorLeads ?? totals.sponsor_lead_submit ?? 0) || 0;
  const sponsorInvoiceRequests = Number(metrics.sponsorInvoiceRequests ?? apiMetrics.sponsorInvoiceRequests ?? totals.sponsor_invoice_request ?? 0) || 0;
  const serviceLeadJson = report?.live?.checks?.["/api/service-lead"]?.json || {};
  const serviceLeads = Number(serviceLeadJson.leadCount ?? 0) || 0;
  const servicePublicRequests = report?.live?.checks?.["/api/service-public-requests"]?.json || report?.local?.servicePublicRequests || {};
  const generatedAt = report?.generatedAt || "No validation snapshot yet";
  const sponsorOutreach = report?.local?.sponsorOutreach || {};
  const publicReplies = report?.local?.sponsorPublicReplies || {};
  const outreachLog = readPublicJsonReport("sponsor-outreach-log.json", { rows: [] });
  const nextSubmissionRows = opsSponsorNextSubmissionRows(outreachLog.rows || []);
  const starterReviewUrl = "/sponsor-starter-review/?utm_source=ops&utm_medium=internal&utm_campaign=sponsor_close&utm_content=static-ops&commitment=request-invoice#sponsor-inquiry";
  const defaultDeal = SPONSOR_DEALS.find((deal) => deal.id === DEFAULT_SPONSOR_DEAL_ID) || SPONSOR_DEALS[0];
  const defaultVertical = SPONSOR_VERTICALS[0];
  const publicInvoiceRequestUrl = sponsorPublicReplyUrl({
    prospectName: "Sponsor team",
    verticalTitle: defaultVertical?.title || "",
    dealTitle: defaultDeal?.title || "Starter fit review",
    dealPrice: defaultDeal?.price || "USD 49",
    proposalUrl: `${siteUrl("sponsor-starter-review").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_close&utm_content=static-public-invoice&commitment=request-invoice#sponsor-inquiry`,
  });
  const projectRows = [
    [
      "PrintableTools Lab",
      "Free browser tools and sponsor funnel",
      totals.page_view || 0,
      todayTotals.page_view || 0,
      totalDownloads,
      sponsorLeads,
      sponsorInvoiceRequests,
      commercialIntent,
    ],
    [
      "Pocket Arcade Shelf",
      "HTML5 game portal and platform revenue-share route",
      "Live via /api/ops-metrics",
      "Live via /api/ops-metrics",
      "n/a",
      "n/a",
      "n/a",
      "Game play/embed rows",
    ],
  ];
  const nextActions = Array.isArray(report?.nextActions) ? report.nextActions.slice(0, 5) : [
    "Refresh live project metrics from /api/ops-metrics.",
    "Route sponsor clicks into the USD 49 starter review path.",
    "Keep revenue uncounted until a signed sponsor agreement, settled payment, or platform balance exists.",
  ];
  return `
      <section class="shell dashboard ops-monitor">
        <div class="section-head">
          <div>
            <p class="eyebrow">internal noindex route</p>
            <h1>Project operations monitor</h1>
            <p>Project-level traffic, source, path, tool, game, sponsor, and monetization signals for the active money projects. This route is intentionally not linked from the public site.</p>
          </div>
          <div class="actions">
            <a class="button secondary" href="/api/ops-metrics" target="_blank" rel="noreferrer">Open JSON</a>
            <a class="button" href="${escapeHtml(starterReviewUrl)}">Open invoice review form</a>
            <a class="button ghost" data-sponsor-public-invoice-request href="${escapeHtml(publicInvoiceRequestUrl)}" target="_blank" rel="noreferrer">Open public invoice issue</a>
          </div>
        </div>
        <div class="notice compact-notice">
          <strong>Runtime refresh:</strong> the app replaces this snapshot with live project rows from /api/ops-metrics after loading. Snapshot generated: ${escapeHtml(generatedAt)}.
        </div>
        <div class="metric-grid ops-summary-grid">
          ${opsMetricTile(totals.page_view || 0, "all page views")}
          ${opsMetricTile(todayTotals.page_view || 0, "today views")}
          ${opsMetricTile(totalDownloads, "tool downloads")}
          ${opsMetricTile(totalGenerations, "tool generations")}
          ${opsMetricTile(commercialIntent, "commercial intent")}
          ${opsMetricTile(sponsorLeads, "sponsor leads")}
          ${opsMetricTile(serviceLeads, "service leads")}
          ${opsMetricTile(servicePublicRequests.publicRequestCount || 0, "public service issues")}
          ${opsMetricTile(sponsorInvoiceRequests, "invoice requests")}
          ${opsMetricTile(publicReplies.publicReplyCount || 0, "public sponsor replies")}
          ${opsMetricTile(publicReplies.invoiceRequestCount || 0, "public invoice issues")}
          ${opsMetricTile(servicePublicRequests.invoiceFollowupRequestCount || 0, "public invoice follow-ups")}
          ${opsMetricTile(`${sponsorOutreach.queued || 0}/${sponsorOutreach.sent || 0}/${sponsorOutreach.settled || 0}`, "outreach queued/sent/settled")}
        </div>
        <div id="opsMetrics" class="metric-remote">
          ${opsCheckoutActivationHtml(totals)}
          ${opsUploadFixInvoiceCloseHtml({ totals, todayTotals, serviceLeadJson, servicePublicRequests })}
          ${opsLeadToPaymentCloseHtml({ totals, sponsorLeads, sponsorInvoiceRequests, serviceLeadJson, publicReplies, servicePublicRequests })}
          <section class="panel ops-sponsor-sprint">
            <div class="ops-project-head">
              <div>
                <p class="eyebrow">revenue sprint</p>
                <h2>Sponsor close cockpit</h2>
                <p>${escapeHtml(opsSponsorSnapshotAction(sponsorLeads, totals.sponsor_request_intent || 0, totals.page_view || 0, totalDownloads, sponsorInvoiceRequests))}</p>
              </div>
              <div class="actions">
                <a class="button" href="${escapeHtml(starterReviewUrl)}">Open invoice review form</a>
                <a class="button ghost" data-sponsor-public-invoice-request href="${escapeHtml(publicInvoiceRequestUrl)}" target="_blank" rel="noreferrer">Open public invoice issue</a>
              </div>
            </div>
            <div class="metric-grid compact ops-project-grid">
              ${opsMetricTile(totals.sponsor_request_intent || 0, "sponsor intent")}
              ${opsMetricTile(sponsorLeads, "sponsor leads")}
              ${opsMetricTile(sponsorInvoiceRequests, "invoice requests")}
              ${opsMetricTile(publicReplies.publicReplyCount || 0, "public replies")}
              ${opsMetricTile(publicReplies.readyForReviewCount || 0, "public replies to review")}
              ${opsMetricTile(SPONSOR_DEALS.find((deal) => deal.id === DEFAULT_SPONSOR_DEAL_ID)?.price || "USD 49", "starter review")}
            </div>
${opsPublicReplySnapshotHtml(publicReplies)}
${opsSponsorNextSubmissionHtml(nextSubmissionRows)}
          </section>
          <section class="notice sponsor-lead-check service-lead-check">
            <strong>Service lead index check</strong>
            <p>Private details stay hidden. Public-safe check: ${serviceLeads} indexed service lead(s). Runtime refresh reads /api/service-lead for service, audit, seller-kit, source, and latest-created counts.</p>
            <p><a href="/api/service-lead" target="_blank" rel="noreferrer">Open public-safe service lead JSON</a></p>
          </section>
${opsServicePublicRequestSnapshotHtml(servicePublicRequests)}
          <section class="panel ops-project">
            <div class="ops-project-head">
              <div>
                <p class="eyebrow">project traffic</p>
                <h2>Project detail rows</h2>
                <p>Live mode expands this into per-project sources, paths, tools, games, and next actions.</p>
              </div>
              <button class="button" id="refreshOpsMetrics" type="button">Refresh</button>
            </div>
            ${opsStaticTable(["Project", "Goal", "Views", "Today", "Downloads", "Sponsor leads", "Invoice requests", "Intent"], projectRows)}
          </section>
          <section class="panel">
            <h2>Source breakdown</h2>
            ${opsStaticTable(["Source", "Views", "Downloads", "Depth", "Sponsor intent"], sourceRows.map((row) => [
              row.source,
              row.page_view || 0,
              (row.download_pdf || 0) + (row.download_file || 0),
              (row.free_tool_depth || 0) + (row.guide_depth || 0),
              row.sponsor_request_intent || 0,
            ]))}
          </section>
          <section class="panel">
            <h2>Tool and game signal snapshot</h2>
            ${opsStaticTable(["Tool or game", "Downloads", "Generations", "Depth", "Sponsor intent"], toolRows.map((row) => [
              row.tool,
              (row.download_pdf || 0) + (row.download_file || 0),
              (row.generate_pdf || 0) + (row.generate_file || 0),
              (row.free_tool_depth || 0) + (row.guide_depth || 0),
              row.sponsor_request_intent || 0,
            ]))}
          </section>
          <section class="panel">
            <h2>Path breakdown</h2>
            <p class="help">Path-level funnel rows refresh from /api/ops-metrics in the live app. Monitored buyer paths include /invoice-followup-copy-pack/, /polite-payment-reminder-email/, /freelance-invoice-follow-up-email/, /overdue-invoice-reminder-email/, /tools/invoice-followup-email/, and /tools/invoice-generator/.</p>
          </section>
          <section class="panel">
            <h2>Operating actions</h2>
            <ul class="ops-action-summary">${nextActions.map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ul>
          </section>
        </div>
        <p class="help">Revenue is still counted only after a platform balance, sponsor agreement, or settled payment is verified. Views and clicks are operating signals, not money.</p>
      </section>`;
}

function opsPublicReplySnapshotHtml(publicReplies) {
  const sourceUrl = publicReplies?.sourceUrl || "https://github.com/yanqr213/printable-tools-lab/issues?q=is%3Aissue%20label%3Asponsor%20label%3Apartner%20label%3Abusiness-review";
  const warning = publicReplies?.dataWarning ? `\n              <p class="notice">${escapeHtml(publicReplies.dataWarning)}</p>` : "";
  return `            <div class="notice sponsor-lead-check">
              <strong>Public-safe sponsor reply evidence</strong>
              <p>${escapeHtml(publicReplies?.publicReplyCount || 0)} public GitHub sponsor reply issue(s), ${escapeHtml(publicReplies?.invoiceRequestCount || 0)} public invoice request issue(s), ${escapeHtml(publicReplies?.readyForReviewCount || 0)} ready for manual review. Quality ${escapeHtml(publicReplies?.dataQuality || "missing")}.</p>
              <p><a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">Open public evidence search</a></p>${warning}
            </div>`;
}

function opsServicePublicRequestSnapshotHtml(servicePublicRequests) {
  const sourceUrl = servicePublicRequests?.sourceUrl || "https://github.com/yanqr213/printable-tools-lab/issues?q=is%3Aissue%20label%3Aservice-request%20label%3Abusiness-review";
  const warning = servicePublicRequests?.dataWarning ? `\n              <p class="notice">${escapeHtml(servicePublicRequests.dataWarning)}</p>` : "";
  return `          <section class="notice sponsor-lead-check service-public-request-check">
            <strong>Public-safe service request evidence</strong>
            <p>${escapeHtml(servicePublicRequests?.publicRequestCount || 0)} public GitHub service request issue(s), ${escapeHtml(servicePublicRequests?.invoiceFollowupRequestCount || 0)} invoice follow-up issue(s), ${escapeHtml(servicePublicRequests?.paidServiceRequestCount || 0)} paid service issue(s), ${escapeHtml(servicePublicRequests?.readyForReviewCount || 0)} ready for manual review. Quality ${escapeHtml(servicePublicRequests?.dataQuality || "missing")}.</p>
            <p><a href="/api/service-public-requests" target="_blank" rel="noreferrer">Open public-safe service request JSON</a> · <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">Open GitHub evidence search</a></p>${warning}
          </section>`;
}

function opsSponsorNextSubmissionRows(rows) {
  const queued = (Array.isArray(rows) ? rows : [])
    .filter((row) => row.status === "queued")
    .sort((a, b) => opsSubmissionScore(b) - opsSubmissionScore(a) || Number(a.priority || 999) - Number(b.priority || 999))
    .slice(0, 5);
  return queued.length ? queued : opsSponsorFallbackSubmissionRows();
}

function opsSubmissionScore(row) {
  let score = 100;
  score += Math.max(-20, Math.min(40, Number(row.contactRouteScore || 0)));
  if (row.contactRouteStatus === "ready") score += 50;
  else if (row.contactRouteStatus === "review") score += 20;
  else if (row.contactRouteStatus === "blocked") score -= 30;
  if (row.executionMode === "email_draft" || row.mailtoUrl) score += 35;
  else if (row.executionMode === "contact_route") score += 20;
  else if (row.executionMode === "prepare") score -= 10;
  else if (row.executionMode === "hold") score -= 60;
  if (row.requiresAuthorizedSender) score -= 25;
  if (row.publicReplyAvailable) score += 8;
  if (String(row.vertical || "").includes("small-business-paperwork")) score += 10;
  return score;
}

function opsSponsorNextSubmissionHtml(rows) {
  if (!rows.length) {
    const fallbackSubject = "PrintableTools Lab sponsor fit review";
    const fallbackMessage = [
      "Hi, I am checking whether your product is a policy-fit sponsor for PrintableTools Lab's free invoice and small-business paperwork workflows.",
      "",
      "Current path: start with the USD 49 starter sponsor review before any visible placement or external invoice.",
      "Review URL: https://printable-tools-lab.pages.dev/sponsor-starter-review/?utm_source=ops&utm_medium=internal&utm_campaign=sponsor_starter_review&utm_content=fallback-empty-queue#sponsor-inquiry",
      "",
      "Downloads stay free, sponsor copy must be labeled, and private payout, tax, bank, phone, identity, password, or customer-file data stays outside the site.",
    ].join("\n");
    const fallbackMailto = `mailto:?subject=${encodeURIComponent(fallbackSubject)}&body=${encodeURIComponent(fallbackMessage)}`;
    return `            <div class="notice sponsor-lead-check">
              <strong>Next sponsor submissions</strong>
              <p>No queued sponsor submission rows are available. Use this fallback only for a truthful sender identity, or regenerate reports with npm run sponsor:outreach-log.</p>
              <div class="actions">
                <a class="button" href="${escapeHtml(fallbackMailto)}">Open email draft</a>
                <button class="button ghost" type="button" data-copy-text="${escapeHtml(fallbackMessage)}">Copy message</button>
              </div>
            </div>`;
  }
  return `            <div class="ops-submission-queue">
              <h3>Next sponsor submissions</h3>
              <p class="help">Use only with a truthful sender identity. Mark sent only after a real public form submission or legitimate email send with evidence.</p>
              <div class="ops-action-list">
                ${rows.map(opsSponsorSubmissionCardHtml).join("\n")}
              </div>
            </div>`;
}

function opsSponsorFallbackSubmissionRows() {
  return [
    opsSponsorFallbackSubmissionRow({
      id: "invoice-ninja-small-business",
      name: "Invoice Ninja",
      verticalSlug: "small-business-paperwork-sponsors",
      dealId: "vertical-category-pilot",
      category: "Invoicing software",
      bestContactUrl: "https://www.invoiceninja.com/contact/",
      mailtoUrl: "mailto:contact@invoiceninja.com",
      executionMode: "email_draft",
      copyFirstAction: "Open email draft",
      action: "Open the email draft, review every copied line, send only from a truthful sender, then record timestamped evidence.",
      gate: "The public email is a legitimate business, partner, sales, or media route and the sender identity is truthful.",
    }),
    opsSponsorFallbackSubmissionRow({
      id: "zoho-invoice-small-business",
      name: "Zoho Invoice",
      verticalSlug: "small-business-paperwork-sponsors",
      dealId: "guide-sponsor-pilot",
      category: "Small-business invoicing",
      bestContactUrl: "https://www.zoho.com/partners",
      executionMode: "contact_route",
      copyFirstAction: "Open contact route",
      action: "Review the route first, confirm partner or sponsor notes are welcome, paste the short message only if allowed, then record timestamped evidence.",
      gate: "Manual review confirms the route accepts public-safe sponsor or partnership notes.",
    }),
    opsSponsorFallbackSubmissionRow({
      id: "qrcodechimp-qr-marketing",
      name: "QRCodeChimp",
      verticalSlug: "local-marketing-qr-sponsors",
      dealId: "guide-sponsor-pilot",
      category: "QR code marketing",
      bestContactUrl: "https://www.qrcodechimp.com/contact",
      mailtoUrl: "mailto:support@qrcodechimp.com",
      executionMode: "email_draft",
      copyFirstAction: "Open email draft",
      action: "Open the email draft, review every copied line, send only from a truthful sender, then record timestamped evidence.",
      gate: "The public email is a legitimate business, partner, sales, or media route and the sender identity is truthful.",
    }),
    opsSponsorFallbackSubmissionRow({
      id: "educationcom-worksheets",
      name: "Education.com",
      verticalSlug: "classroom-printable-sponsors",
      dealId: "vertical-category-pilot",
      category: "Worksheets and learning resources",
      bestContactUrl: "https://www.education.com/support/contact/",
      mailtoUrl: "mailto:support@education.com",
      executionMode: "email_draft",
      copyFirstAction: "Open email draft",
      action: "Open the email draft only after a truthful sender name and business email are available, then record timestamped evidence.",
      gate: "The public email is a legitimate business, partner, sales, or media route and the sender identity is truthful.",
    }),
    opsSponsorFallbackSubmissionRow({
      id: "twinkl-teacher-resources",
      name: "Twinkl",
      verticalSlug: "classroom-printable-sponsors",
      dealId: "guide-sponsor-pilot",
      category: "Teacher resources",
      bestContactUrl: "https://www.twinkl.com/contact",
      executionMode: "contact_route",
      copyFirstAction: "Open contact route",
      action: "Review the route first, confirm partner or sponsor notes are welcome, paste the short message only if allowed, then record timestamped evidence.",
      gate: "Manual review confirms the route accepts public-safe sponsor or partnership notes.",
    }),
  ];
}

function opsSponsorFallbackSubmissionRow({ id, name, verticalSlug, dealId, category, bestContactUrl, mailtoUrl = "", executionMode, copyFirstAction, action, gate }) {
  const vertical = SPONSOR_VERTICALS.find((item) => item.slug === verticalSlug) || SPONSOR_VERTICALS[0];
  const deal = SPONSOR_DEALS.find((item) => item.id === dealId) || SPONSOR_DEALS.find((item) => item.id === DEFAULT_SPONSOR_DEAL_ID) || SPONSOR_DEALS[0];
  const proposalUrl = `${siteUrl("sponsor-proposal").replace(/\/$/, "")}?prospect=${encodeURIComponent(id)}&deal=${encodeURIComponent(deal.id)}&vertical=${encodeURIComponent(vertical.slug)}&utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_proposal&utm_content=${encodeURIComponent(id)}&commitment=${encodeURIComponent(sponsorDealCommitment(deal))}#sponsor-inquiry`;
  const contactFormProposalUrl = `${siteUrl("sponsor-proposal").replace(/\/$/, "")}?prospect=${encodeURIComponent(id)}&deal=${encodeURIComponent(deal.id)}&vertical=${encodeURIComponent(vertical.slug)}#sponsor-inquiry`;
  const invoiceReviewUrl = `${siteUrl("sponsor-starter-review").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_starter_review&utm_content=${encodeURIComponent(id)}&deal=${encodeURIComponent(deal.id)}&vertical=${encodeURIComponent(vertical.slug)}&commitment=request-invoice#sponsor-inquiry`;
  const publicReplyUrl = sponsorPublicReplyUrl({
    prospectName: name,
    verticalTitle: vertical.title,
    dealTitle: deal.title,
    dealPrice: deal.price,
    proposalUrl,
  });
  const message = [
    `Hi ${name} team - I run PrintableTools Lab, a free no-signup browser utility site for PDF, image, QR, resume, classroom, and small-business document workflows.`,
    "Your product looks relevant to this audience.",
    `Fast invoice review URL: ${invoiceReviewUrl}`,
    `Sponsor proposal: ${contactFormProposalUrl}`,
    `Public-safe reply form: ${publicReplyUrl}`,
    "Please keep private payment, tax, bank, phone, customer, identity, password, or file data out of the public reply.",
  ].join(" ");
  return {
    id,
    name,
    status: "queued",
    vertical: vertical.slug,
    contactRouteStatus: "review",
    contactRouteScore: executionMode === "email_draft" ? 28 : 20,
    copyFirstAction,
    bestContactUrl,
    mailtoUrl,
    suggestedDealTitle: deal.title,
    suggestedDealPrice: deal.price,
    proposalUrl,
    contactFormProposalUrl,
    invoiceReviewUrl,
    publicReplyUrl,
    contactFormMessage: message,
    body: message,
    executionMode,
    executionStep: action,
    doNotSendUntil: gate,
    evidenceChecklist: [
      "route-fit note confirming sponsorship or partnership notes are allowed",
      "submittedAt timestamp",
      "bestContactUrl or public email used",
      "proposalUrl or invoiceReviewUrl included",
      "no private payment, tax, bank, phone, customer, identity, password, or file data submitted",
    ],
    nextAction: action,
    requiresAuthorizedSender: executionMode === "prepare",
    contactRouteSubmissionBlockers: [],
    category,
  };
}

function opsCheckoutActivationRows(totals = {}) {
  const auditUpgradeUrl = configuredAuditUpgradeCheckoutUrl();
  return [
    {
      sku: LOCAL_SELLER_STARTER_KIT.name,
      price: `$${LOCAL_SELLER_STARTER_KIT.priceUsd} ${LOCAL_SELLER_STARTER_KIT.currency}`,
      configured: Boolean(LOCAL_SELLER_STARTER_KIT.checkoutUrl),
      configKey: "sellerKitCheckoutUrl",
      command: "npm.cmd run configure:checkout -- --seller-kit-url https://your-payment-provider.example/local-seller-starter-kit",
      publicPage: `/${LOCAL_SELLER_STARTER_KIT.slug}/`,
      checkoutClicks: totals.seller_checkout_click || 0,
      requestIntent: totals.seller_checkout_intent || 0,
      copy: checkoutCopy(LOCAL_SELLER_STARTER_KIT),
    },
    {
      sku: CUSTOM_LOCAL_PRINT_PACK_SERVICE.name,
      price: `$${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} ${CUSTOM_LOCAL_PRINT_PACK_SERVICE.currency}`,
      configured: Boolean(CUSTOM_LOCAL_PRINT_PACK_SERVICE.checkoutUrl),
      configKey: "customPrintPackCheckoutUrl",
      command: "npm.cmd run configure:checkout -- --custom-print-pack-url https://your-payment-provider.example/custom-local-print-pack",
      publicPage: `/${CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug}/`,
      checkoutClicks: totals.service_checkout_click || 0,
      requestIntent: totals.service_request_intent || 0,
      copy: serviceCheckoutCopy(CUSTOM_LOCAL_PRINT_PACK_SERVICE),
    },
    {
      sku: INVOICE_FOLLOWUP_COPY_PACK_SERVICE.name,
      price: `$${INVOICE_FOLLOWUP_COPY_PACK_SERVICE.priceUsd} ${INVOICE_FOLLOWUP_COPY_PACK_SERVICE.currency}`,
      configured: Boolean(INVOICE_FOLLOWUP_COPY_PACK_SERVICE.checkoutUrl),
      configKey: "invoiceFollowupCheckoutUrl",
      command: "npm.cmd run configure:checkout -- --invoice-followup-url https://your-payment-provider.example/invoice-followup-copy-pack",
      publicPage: `/${INVOICE_FOLLOWUP_COPY_PACK_SERVICE.slug}/`,
      checkoutClicks: totals.service_checkout_click || 0,
      requestIntent: totals.service_request_intent || 0,
      copy: serviceCheckoutCopy(INVOICE_FOLLOWUP_COPY_PACK_SERVICE),
    },
    {
      sku: UPLOAD_LIMIT_FIX_PLAN_SERVICE.name,
      price: `$${UPLOAD_LIMIT_FIX_PLAN_SERVICE.priceUsd} ${UPLOAD_LIMIT_FIX_PLAN_SERVICE.currency}`,
      configured: Boolean(UPLOAD_LIMIT_FIX_PLAN_SERVICE.checkoutUrl),
      configKey: "uploadLimitFixPlanCheckoutUrl",
      command: "npm.cmd run configure:checkout -- --upload-limit-fix-plan-url https://your-payment-provider.example/upload-limit-fix-plan",
      publicPage: `/${UPLOAD_LIMIT_FIX_PLAN_SERVICE.slug}/`,
      checkoutClicks: totals.service_checkout_click || 0,
      requestIntent: totals.service_request_intent || 0,
      copy: serviceCheckoutCopy(UPLOAD_LIMIT_FIX_PLAN_SERVICE),
    },
    {
      sku: "Audit upgrade checkout",
      price: `$${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} ${CUSTOM_LOCAL_PRINT_PACK_SERVICE.currency}`,
      configured: Boolean(auditUpgradeUrl),
      configKey: "auditUpgradeCheckoutUrl",
      command: "npm.cmd run configure:checkout -- --audit-upgrade-url https://your-payment-provider.example/custom-local-print-pack",
      publicPage: `/${MARKET_TABLE_PRINT_AUDIT.slug}/`,
      checkoutClicks: totals.service_checkout_click || 0,
      requestIntent: totals.audit_request_intent || 0,
      copy: [
        "Upgrade from the Free Market Table Print Audit to the Custom Local Print Pack Setup.",
        "",
        serviceCheckoutCopy(CUSTOM_LOCAL_PRINT_PACK_SERVICE),
      ].join("\n"),
    },
  ];
}

function opsCheckoutActivationHtml(totals = {}) {
  const rows = opsCheckoutActivationRows(totals);
  const configuredCount = rows.filter((row) => row.configured).length;
  return `          <section class="panel ops-checkout-activation">
            <div class="ops-project-head">
              <div>
                <p class="eyebrow">checkout activation</p>
                <h2>External payment link readiness</h2>
                <p>${configuredCount ? `${configuredCount}/${rows.length} external checkout slot(s) are configured.` : "No external checkout URL is configured yet. The public pages collect requests only until a real payment-provider link is connected."}</p>
              </div>
              <a class="button secondary" href="/custom-local-print-pack/">Open service page</a>
            </div>
            <div class="metric-grid compact ops-project-grid">
              ${opsMetricTile(`${configuredCount}/${rows.length}`, "configured slots")}
              ${opsMetricTile(rows.reduce((sum, row) => sum + Number(row.checkoutClicks || 0), 0), "checkout clicks")}
              ${opsMetricTile(rows.reduce((sum, row) => sum + Number(row.requestIntent || 0), 0), "request intent")}
              ${opsMetricTile("settled only", "revenue proof")}
            </div>
            ${opsStaticTable(["SKU", "Price", "Config key", "Status", "Checkout clicks", "Requests", "Page"], rows.map((row) => [
              row.sku,
              row.price,
              row.configKey,
              row.configured ? "configured" : "missing",
              row.checkoutClicks || 0,
              row.requestIntent || 0,
              row.publicPage,
            ]))}
            <div class="ops-action-list">
              ${rows.map((row) => `<article class="ops-action-card checkout-activation-card">
                <div>
                  <p class="eyebrow">${escapeHtml(row.configured ? "ready" : "missing checkout")}</p>
                  <h4>${escapeHtml(row.sku)}</h4>
                  <p>${escapeHtml(row.price)}. Create one real Gumroad, Payhip, Ko-fi, Stripe Payment Link, or invoice product, then paste only the public checkout URL into this repository.</p>
                  <p class="help">Do not store payout, tax, bank, card, customer-list, or account credential data here. Revenue is proven only by the external provider's paid or settled order record.</p>
                </div>
                <div class="ops-action-buttons">
                  <button class="button secondary" type="button" data-copy-text="${escapeHtml(row.copy)}">Copy listing copy</button>
                  <button class="button ghost" type="button" data-copy-text="${escapeHtml(row.command)}">Copy config command</button>
                  <a class="button ghost" href="${escapeHtml(row.publicPage)}">Open page</a>
                </div>
              </article>`).join("\n")}
            </div>
          </section>`;
}

function opsLeadToPaymentCloseRows({ totals = {}, sponsorLeads = 0, sponsorInvoiceRequests = 0, serviceLeadJson = {}, publicReplies = {}, servicePublicRequests = {} } = {}) {
  const serviceTypes = serviceLeadJson.serviceTypes || {};
  const localPrintRequests = numberSignal(serviceTypes[CUSTOM_LOCAL_PRINT_PACK_SERVICE.id]);
  const invoiceFollowupRequests = numberSignal(serviceTypes[INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id]);
  const uploadLimitFixRequests = numberSignal(serviceTypes[UPLOAD_LIMIT_FIX_PLAN_SERVICE.id]);
  const serviceRequests = numberSignal(serviceLeadJson.serviceRequestCount);
  const auditRequests = numberSignal(serviceLeadJson.auditRequestCount);
  const sellerRequests = numberSignal(serviceLeadJson.sellerKitRequestCount);
  const publicSourceUrl = servicePublicRequests.sourceUrl || "/api/service-public-requests";
  const publicLocalPrintRequests = numberSignal(servicePublicRequests.customLocalPrintRequestCount);
  const publicInvoiceFollowupRequests = numberSignal(servicePublicRequests.invoiceFollowupRequestCount);
  const publicUploadLimitFixRequests = numberSignal(servicePublicRequests.uploadLimitFixPlanRequestCount);
  const publicAuditRequests = numberSignal(servicePublicRequests.auditRequestCount);
  const publicSellerRequests = numberSignal(servicePublicRequests.sellerKitRequestCount);
  const publicPaidServiceRequests = numberSignal(servicePublicRequests.paidServiceRequestCount);
  const sponsorInvoices = Math.max(numberSignal(sponsorInvoiceRequests), numberSignal(publicReplies.invoiceRequestCount));
  return [
    {
      lane: "$29 service setup",
      signal: `${localPrintRequests} lead(s), ${publicLocalPrintRequests} public issue(s), ${numberSignal(totals.service_request_intent)} shared request intent`,
      state: localPrintRequests ? "lead captured" : publicLocalPrintRequests ? "public request" : numberSignal(totals.service_request_intent) ? "intent only" : "waiting",
      nextAction: localPrintRequests
        ? "Export service leads, confirm fit, then send the external checkout or invoice reply."
        : publicLocalPrintRequests
          ? "Open public service request issues, confirm fit, then send the external checkout or invoice reply."
        : "Keep the request form live and use the payment reply as soon as a qualified service lead arrives.",
      proofGate: "paid_order_verified from external provider",
      command: publicLocalPrintRequests && !localPrintRequests ? "npm.cmd run service:public-requests" : "npm.cmd run service:leads",
      copy: opsServicePaymentReplyCopy("custom-local-print-pack"),
      link: publicLocalPrintRequests && !localPrintRequests ? publicSourceUrl : "/api/service-lead",
    },
    {
      lane: "$9 upload fix plan",
      signal: `${uploadLimitFixRequests} lead(s), ${publicUploadLimitFixRequests} public issue(s), ${numberSignal(totals.service_request_intent)} shared request intent`,
      state: uploadLimitFixRequests ? "lead captured" : publicUploadLimitFixRequests ? "public request" : "waiting",
      nextAction: uploadLimitFixRequests
        ? "Export upload fix leads, confirm public-safe scope, then send the external checkout or invoice reply."
        : publicUploadLimitFixRequests
          ? "Review public upload-fix request issues, confirm no files or private details were included, then send the external checkout or invoice reply."
          : "Keep the $9 request form on upload-limit pages and reply as soon as a qualified upload-error lead arrives.",
      proofGate: "paid_order_verified from external provider",
      command: publicUploadLimitFixRequests && !uploadLimitFixRequests ? "npm.cmd run service:public-requests" : "npm.cmd run service:leads",
      copy: opsServicePaymentReplyCopy("upload-limit-fix-plan"),
      link: publicUploadLimitFixRequests && !uploadLimitFixRequests ? publicSourceUrl : "/api/service-lead",
    },
    {
      lane: "$19 invoice follow-up copy",
      signal: `${invoiceFollowupRequests} lead(s), ${publicInvoiceFollowupRequests} public issue(s), ${publicPaidServiceRequests} paid public issue(s), ${serviceRequests} total service lead(s)`,
      state: invoiceFollowupRequests ? "lead captured" : publicInvoiceFollowupRequests ? "public request" : "waiting",
      nextAction: invoiceFollowupRequests
        ? "Export service leads, confirm the invoice copy scope, then send the external checkout or invoice reply."
        : publicInvoiceFollowupRequests
          ? "Review the public invoice follow-up request issue, confirm scope, then send the external checkout or invoice reply."
        : "Keep the invoice download form live and use this reply as soon as a qualified invoice follow-up lead arrives.",
      proofGate: "paid_order_verified from external provider",
      command: publicInvoiceFollowupRequests && !invoiceFollowupRequests ? "npm.cmd run service:public-requests" : "npm.cmd run service:leads",
      copy: opsServicePaymentReplyCopy("invoice-followup-copy-pack"),
      link: publicInvoiceFollowupRequests && !invoiceFollowupRequests ? publicSourceUrl : "/api/service-lead",
    },
    {
      lane: "Free audit to $29 upgrade",
      signal: `${auditRequests} audit lead(s), ${publicAuditRequests} public issue(s), ${numberSignal(totals.audit_request_intent)} audit intent`,
      state: auditRequests ? "audit follow-up" : publicAuditRequests ? "public request" : numberSignal(totals.audit_request_intent) ? "intent only" : "waiting",
      nextAction: auditRequests
        ? "Export the audit lead, send useful free checks, then offer the $29 setup only if they want assembly."
        : publicAuditRequests
          ? "Open public audit request issues, answer the free check, then offer the $29 setup only if they ask for assembly."
        : "Use the audit as a low-friction lead magnet before asking for a paid setup.",
      proofGate: "separate paid setup order",
      command: publicAuditRequests && !auditRequests ? "npm.cmd run service:public-requests" : "npm.cmd run service:leads",
      copy: opsServicePaymentReplyCopy("market-table-print-audit"),
      link: publicAuditRequests && !auditRequests ? publicSourceUrl : `/${MARKET_TABLE_PRINT_AUDIT.slug}/`,
    },
    {
      lane: "$9 seller kit",
      signal: `${sellerRequests} seller request(s), ${publicSellerRequests} public issue(s), ${numberSignal(totals.seller_checkout_intent)} checkout intent`,
      state: sellerRequests ? "buyer requested" : publicSellerRequests ? "public request" : numberSignal(totals.seller_checkout_intent) ? "intent only" : "waiting",
      nextAction: sellerRequests
        ? "Export seller kit requests and reply with the real external checkout link once the product is configured."
        : publicSellerRequests
          ? "Open public seller-kit request issues and reply with the real external checkout link once the product is configured."
        : "Connect a real checkout URL before treating clicks as purchase demand.",
      proofGate: "paid digital product order",
      command: publicSellerRequests && !sellerRequests ? "npm.cmd run service:public-requests" : "npm.cmd run service:leads",
      copy: opsServicePaymentReplyCopy("local-seller-starter-kit"),
      link: publicSellerRequests && !sellerRequests ? publicSourceUrl : `/${LOCAL_SELLER_STARTER_KIT.slug}/`,
    },
    {
      lane: "Sponsor invoice review",
      signal: `${sponsorInvoices} invoice request(s), ${numberSignal(sponsorLeads)} lead(s), ${numberSignal(totals.sponsor_request_intent)} intent`,
      state: sponsorInvoices ? "invoice review" : numberSignal(sponsorLeads) ? "lead captured" : numberSignal(totals.sponsor_request_intent) ? "intent only" : "waiting",
      nextAction: sponsorInvoices || numberSignal(sponsorLeads)
        ? "Export sponsor leads, verify policy fit, then send only an external invoice or agreement."
        : "Use the starter review path for sponsor clicks until a qualified lead arrives.",
      proofGate: "signed sponsor agreement or settled external payment",
      command: "npm.cmd run sponsor:leads",
      copy: opsSponsorInvoiceCloseCopy(),
      link: "/sponsor-starter-review/?utm_source=ops&utm_medium=internal&utm_campaign=lead_close&utm_content=static-close-cockpit&commitment=request-invoice#sponsor-inquiry",
    },
  ];
}

function opsLeadToPaymentCloseHtml(state = {}) {
  const rows = opsLeadToPaymentCloseRows(state);
  const activeRows = rows.filter((row) => row.state !== "waiting");
  const needsReply = rows.filter((row) => ["lead captured", "buyer requested", "audit follow-up", "invoice review", "public request"].includes(row.state)).length;
  return `          <section class="panel ops-lead-close-cockpit">
            <div class="ops-project-head">
              <div>
                <p class="eyebrow">cash close</p>
                <h2>Lead-to-payment close cockpit</h2>
                <p>${needsReply ? "A captured lead or invoice signal exists. Use the matching export and payment reply, then count revenue only after outside proof." : "No captured buyer lead yet. The close runbook is ready for the first qualified service, seller-kit, or sponsor request."}</p>
              </div>
              <div class="actions">
                <a class="button secondary" href="/api/service-lead" target="_blank" rel="noreferrer">Open service index</a>
                <a class="button ghost" href="/api/service-public-requests" target="_blank" rel="noreferrer">Open service issues</a>
                <a class="button ghost" href="/api/sponsor-lead" target="_blank" rel="noreferrer">Open sponsor index</a>
              </div>
            </div>
            <div class="metric-grid compact ops-project-grid">
              ${opsMetricTile(`${activeRows.length}/${rows.length}`, "active close lanes")}
              ${opsMetricTile(needsReply, "needs reply")}
              ${opsMetricTile("external only", "payment channel")}
              ${opsMetricTile("paid proof", "revenue gate")}
            </div>
            ${opsStaticTable(["Lane", "Signal", "State", "Next cash action", "Proof gate"], rows.map((row) => [
              row.lane,
              row.signal,
              row.state,
              row.nextAction,
              row.proofGate,
            ]))}
            <div class="ops-action-list">
              ${rows.map((row) => `<article class="ops-action-card lead-close-card">
                <div>
                  <p class="eyebrow">${escapeHtml(row.state)}</p>
                  <h4>${escapeHtml(row.lane)}</h4>
                  <p>${escapeHtml(row.nextAction)}</p>
                  <p class="help">Close proof: ${escapeHtml(row.proofGate)}. Requests, clicks, exports, and copied replies are not revenue.</p>
                </div>
                <div class="ops-action-buttons">
                  <button class="button secondary" type="button" data-copy-text="${escapeHtml(row.copy)}">Copy payment reply</button>
                  <button class="button ghost" type="button" data-copy-text="${escapeHtml(row.command)}">Copy export command</button>
                  <a class="button ghost" href="${escapeHtml(row.link)}" target="_blank" rel="noreferrer">Open lane</a>
                </div>
              </article>`).join("\n")}
            </div>
          </section>`;
}

function opsUploadFixInvoiceCloseHtml({ totals = {}, todayTotals = {}, serviceLeadJson = {}, servicePublicRequests = {}, paths = [] } = {}) {
  const serviceTypes = serviceLeadJson.serviceTypes || {};
  const uploadLeadCount = numberSignal(serviceTypes[UPLOAD_LIMIT_FIX_PLAN_SERVICE.id]);
  const publicUploadCount = numberSignal(servicePublicRequests.uploadLimitFixPlanRequestCount);
  const serviceInvoiceRequests = numberSignal(totals.service_invoice_request);
  const todayServiceInvoiceRequests = numberSignal(todayTotals.service_invoice_request);
  const serviceIntent = numberSignal(totals.service_request_intent);
  const todayServiceIntent = numberSignal(todayTotals.service_request_intent);
  const checkoutConfigured = Boolean(UPLOAD_LIMIT_FIX_PLAN_SERVICE.checkoutUrl);
  const replyableRequests = uploadLeadCount + publicUploadCount;
  const closeState = replyableRequests
    ? "invoice request needs reply"
    : serviceInvoiceRequests
      ? "invoice intent, no reply contact"
    : serviceIntent
      ? "intent, no lead yet"
      : "waiting for first request";
  const nextAction = replyableRequests
    ? "Open the service index or public issue, confirm the request has no file or private data, then send the external $9 checkout or invoice link."
    : serviceInvoiceRequests
      ? "Invoice-link clicks exist without a replyable contact yet; keep the one-contact form focused and watch for the first lead before sending payment."
    : serviceIntent
      ? "Keep the one-contact invoice form primary on upload-error pages and watch for the first lead before sending a payment link."
      : "Keep the upload-error landing pages live; this queue is ready for the first qualified $9 request.";
  const paymentReply = opsServicePaymentReplyCopy(UPLOAD_LIMIT_FIX_PLAN_SERVICE.id);
  const triageChecklist = [
    "Upload Fix invoice close checklist",
    "",
    "1. Open /api/service-lead or the public service issue search.",
    "2. Confirm the buyer gave only public-safe error text, file type, target rule, and timeline.",
    "3. Reject or ask them to remove any actual file, ID photo, resume, portal login, card, bank, tax, identity, or private account data.",
    "4. Send only a real external $9 checkout or invoice link.",
    "5. Start work only after the external provider shows paid_order_verified, paid order, payout balance, or settled payment.",
  ].join("\n");
  const checkoutCommand = "npm.cmd run configure:checkout -- --upload-limit-fix-plan-url https://your-payment-provider.example/upload-limit-fix-plan";
  const publicSourceUrl = servicePublicRequests.sourceUrl || "/api/service-public-requests";
  const warmRows = opsUploadFixInvoicePathRows(paths);
  return `          <section class="panel ops-upload-fix-invoice-close" data-upload-fix-invoice-close-queue>
            <div class="ops-project-head">
              <div>
                <p class="eyebrow">$9 service close</p>
                <h2>$9 Upload Fix invoice close queue</h2>
                <p>${escapeHtml(nextAction)}</p>
              </div>
              <div class="actions">
                <a class="button secondary" href="/api/service-lead" target="_blank" rel="noreferrer">Open service index</a>
                <a class="button ghost" href="${escapeHtml(publicSourceUrl)}" target="_blank" rel="noreferrer">Open public issues</a>
                <a class="button ghost" href="/${escapeHtml(UPLOAD_LIMIT_FIX_PLAN_SERVICE.slug)}/">Open $9 page</a>
              </div>
            </div>
            <div class="metric-grid compact ops-project-grid">
              ${opsMetricTile(serviceInvoiceRequests, "invoice intent")}
              ${opsMetricTile(todayServiceInvoiceRequests, "today invoices")}
              ${opsMetricTile(uploadLeadCount, "upload fix leads")}
              ${opsMetricTile(publicUploadCount, "public upload issues")}
              ${opsMetricTile(serviceIntent, "service intent")}
              ${opsMetricTile(todayServiceIntent, "today intent")}
              ${opsMetricTile(checkoutConfigured ? "configured" : "missing", "checkout URL")}
              ${opsMetricTile("paid_order_verified", "revenue gate")}
            </div>
            <div class="ops-action-list">
              <article class="ops-action-card lead-close-card">
                <div>
                  <p class="eyebrow">${escapeHtml(closeState)}</p>
                  <h4>${replyableRequests ? "Reply with the $9 external payment link" : "Capture one reply contact first"}</h4>
                  <p>${replyableRequests ? "Use this only after fit is confirmed. No payment is collected on PrintableTools Lab itself." : "A click is not enough to invoice. Wait for one reply email, @handle, public contact URL, or public issue before sending an external payment link."}</p>
                  <p class="help">Checkout status: ${checkoutConfigured ? "configured" : "missing uploadLimitFixPlanCheckoutUrl"}. Revenue is still zero until external paid proof exists.</p>
                </div>
                <div class="ops-action-buttons">
                  <button class="button secondary" type="button" data-copy-text="${escapeHtml(paymentReply)}">Copy $9 payment reply</button>
                  <button class="button ghost" type="button" data-copy-text="${escapeHtml(triageChecklist)}">Copy triage checklist</button>
                  <button class="button ghost" type="button" data-copy-text="${escapeHtml(checkoutCommand)}">Copy config command</button>
                </div>
              </article>
            </div>
            ${opsStaticTable(["Upload path", "Views", "Today", "Intent", "Invoice requests"], warmRows.map((row) => [
              row.path,
              row.page_view || 0,
              row.today_page_view || 0,
              row.service_request_intent || 0,
              row.service_invoice_request || 0,
            ]))}
          </section>`;
}

function opsUploadFixInvoicePathRows(paths = []) {
  const uploadPaths = [
    `/${UPLOAD_LIMIT_FIX_PLAN_SERVICE.slug}/`,
    "/upload-error-cheatsheet/",
    "/image-dimensions-600x600/",
    "/pdf-not-accepted-jpg-required/",
    "/email-attachment-too-large/",
    "/file-must-be-less-than-1mb/",
    "/pdf-must-be-under-500kb/",
    "/pdf-must-be-under-2mb/",
    "/pdf-must-be-under-5mb/",
    "/resume-pdf-under-2mb/",
    "/document-must-be-under-5mb/",
    "/photo-must-be-under-100kb/",
    "/invalid-file-type-jpg-png/",
    "/image-must-be-less-than-2mb/",
    "/image-must-be-under-500kb/",
    "/jpg-must-be-under-200kb/",
    "/png-screenshot-too-large/",
    "/resume-pdf-too-large/",
    "/passport-photo-size-fixer/",
    "/passport-photo-35x45mm/",
    "/photo-200x230-50kb/",
    "/signature-under-20kb/",
    "/resize-signature-140x60/",
    "/signature-under-50kb/",
    "/resize-signature-200x100/",
    "/resize-photo-200x230/",
    "/resize-photo-413x531/",
  ];
  const rowsByPath = new Map((Array.isArray(paths) ? paths : []).map((row) => [String(row.path || ""), row]));
  return uploadPaths
    .map((pathName) => ({ path: pathName, ...(rowsByPath.get(pathName) || {}) }))
    .sort((a, b) => opsUploadFixPathScore(b) - opsUploadFixPathScore(a))
    .slice(0, 8);
}

function opsUploadFixPathScore(row = {}) {
  return numberSignal(row.service_invoice_request) * 100
    + numberSignal(row.service_request_intent) * 50
    + numberSignal(row.today_page_view) * 3
    + numberSignal(row.page_view);
}

function opsServicePaymentReplyCopy(serviceType = "custom-local-print-pack") {
  if (serviceType === "local-seller-starter-kit") {
    return [
      "Subject: Local Seller Starter Kit checkout link",
      "",
      `Thanks for requesting the ${LOCAL_SELLER_STARTER_KIT.name}.`,
      "",
      `Price: $${LOCAL_SELLER_STARTER_KIT.priceUsd} ${LOCAL_SELLER_STARTER_KIT.currency}`,
      `Request source: ${siteUrl(LOCAL_SELLER_STARTER_KIT.slug)}`,
      "",
      "Next step: I will send the real external checkout link. Please pay only through that external provider and do not send card, bank, payout, tax, identity, password, or private customer-list details through the website, GitHub, or email.",
      "",
      "After the external provider shows a paid order, the editable starter kit files can be delivered. Revenue is counted only from that paid or settled provider record.",
    ].join("\n");
  }
  if (serviceType === "market-table-print-audit") {
    return [
      `Subject: ${MARKET_TABLE_PRINT_AUDIT.name} next steps`,
      "",
      "Thanks for sending the public-safe audit details.",
      "",
      "I will check whether your current table/sign/price/QR/flyer flow has obvious printable gaps. The audit itself is free and does not count as revenue.",
      "",
      `If you want the first pack assembled after the audit, the optional ${CUSTOM_LOCAL_PRINT_PACK_SERVICE.name} is $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} ${CUSTOM_LOCAL_PRINT_PACK_SERVICE.currency}. That paid setup starts only after fit is confirmed and a real external checkout or invoice is paid.`,
      `Request source: ${siteUrl(MARKET_TABLE_PRINT_AUDIT.slug)}`,
      "",
      "Please keep payment, tax, bank, card, identity, password, customer-list, private address, and private file details outside the website form.",
    ].join("\n");
  }
  if (serviceType === "invoice-followup-copy-pack") {
    return servicePaymentReplyCopy(INVOICE_FOLLOWUP_COPY_PACK_SERVICE);
  }
  if (serviceType === "upload-limit-fix-plan") {
    return servicePaymentReplyCopy(UPLOAD_LIMIT_FIX_PLAN_SERVICE);
  }
  return servicePaymentReplyCopy(CUSTOM_LOCAL_PRINT_PACK_SERVICE);
}

function opsSponsorInvoiceCloseCopy() {
  const deal = SPONSOR_DEALS.find((item) => item.id === DEFAULT_SPONSOR_DEAL_ID) || SPONSOR_DEALS[0];
  const vertical = SPONSOR_VERTICALS[0] || { title: "PrintableTools Lab sponsor audience" };
  return sponsorInvoiceRequestCopy(
    { name: "Sponsor team" },
    deal,
    vertical,
    deal.trackedUrl || siteUrl("sponsor-starter-review"),
  );
}

function numberSignal(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function serviceCheckoutCopy(service) {
  if (service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id) {
    return [
      `Product name: ${service.name}`,
      `Price: $${service.priceUsd} ${service.currency}`,
      `Short description: ${service.shortDescription}`,
      "Delivery note: Buyer sends public-safe upload error text, file type, target rule, and timeline only. Delivery target is same business day after paid_order_verified and complete public-safe details.",
      "Deliverables:",
      ...service.deliverables.map((item) => `- ${item}`),
      "",
      "Buyer safety: Do not send or attach the actual file, ID photo, resume, private form, portal login, tax ID, bank detail, card data, or private account details through the website form.",
    ].join("\n");
  }
  return [
    `Product name: ${service.name}`,
    `Price: $${service.priceUsd} ${service.currency}`,
    `Short description: ${service.shortDescription}`,
    "Delivery note: Buyer sends public-safe item, price, style, and contact-link details after payment. Delivery target is 2 business days after paid_order_verified and complete buyer details.",
    "Deliverables:",
    ...service.deliverables.map((item) => `- ${item}`),
    "",
    "Buyer safety: Do not send tax, bank, card, password, private identity, customer-list, or private file data through the website form.",
  ].join("\n");
}

function opsSponsorSubmissionCardHtml(row) {
  const firstAction = row.copyFirstAction || (row.mailtoUrl ? "Open email draft" : row.requiresAuthorizedSender ? "Prepare only" : "Open contact route");
  const blockerText = row.requiresAuthorizedSender ? `Sender required: ${(row.contactRouteSubmissionBlockers || []).join("; ") || "authorized sender fields"}` : "No required sender blocker detected by probe.";
  const message = row.contactFormMessage || row.body || "";
  const evidenceChecklist = Array.isArray(row.evidenceChecklist) && row.evidenceChecklist.length ? row.evidenceChecklist : ["submittedAt timestamp", "bestContactUrl or public email used", "proposalUrl or invoiceReviewUrl included"];
  const evidenceCopy = opsSponsorEvidenceCopy(row, evidenceChecklist);
  const buttons = [
    `<a class="button secondary" href="${escapeHtml(row.bestContactUrl || row.contactUrl || "#")}" target="_blank" rel="noreferrer">Open route</a>`,
    row.mailtoUrl ? `<a class="button" href="${escapeHtml(row.mailtoUrl)}">Open email draft</a>` : "",
    `<a class="button secondary" href="${escapeHtml(row.contactFormProposalUrl || row.proposalUrl || "#")}" target="_blank" rel="noreferrer">Short proposal</a>`,
    `<a class="button ghost" href="${escapeHtml(row.invoiceReviewUrl || "#")}" target="_blank" rel="noreferrer">Invoice URL</a>`,
    row.publicReplyUrl ? `<a class="button ghost" href="${escapeHtml(row.publicReplyUrl)}" target="_blank" rel="noreferrer">Public reply</a>` : "",
    `<button class="button ghost" type="button" data-copy-text="${escapeHtml(message)}">Copy message</button>`,
    `<button class="button ghost" type="button" data-copy-text="${escapeHtml(evidenceCopy)}">Copy evidence note</button>`,
  ].filter(Boolean).join("\n                    ");
  return `<article class="ops-action-card sponsor-submission-card">
                  <div>
                    <p class="eyebrow">${escapeHtml(row.contactRouteStatus || "queued")} / ${escapeHtml(firstAction)} / ${escapeHtml(row.executionMode || "contact_route")}</p>
                    <h4>${escapeHtml(row.name || "Sponsor prospect")}</h4>
                    <p><strong>${escapeHtml(row.suggestedDealTitle || "Sponsor pilot")}</strong> ${escapeHtml(row.suggestedDealPrice || "")}</p>
                    <p>${escapeHtml(blockerText)}</p>
                    <p><strong>30-minute action:</strong> ${escapeHtml(row.executionStep || row.nextAction || "")}</p>
                    <p class="help"><strong>Do not send until:</strong> ${escapeHtml(row.doNotSendUntil || "Manual review confirms this is a legitimate public sponsor or partner route.")}</p>
                    <p class="help"><strong>Evidence:</strong> ${escapeHtml(evidenceChecklist.join("; "))}</p>
                    <p class="help">${escapeHtml(row.nextAction || "")}</p>
                  </div>
                  <div class="ops-action-buttons">
                    ${buttons}
                  </div>
                </article>`;
}

function opsSponsorEvidenceCopy(row, evidenceChecklist) {
  return [
    `Prospect: ${row.name || "Sponsor prospect"}`,
    `Execution mode: ${row.executionMode || "contact_route"}`,
    `Status before action: ${row.contactRouteStatus || "queued"} / ${row.copyFirstAction || ""}`,
    `Open URL: ${row.mailtoUrl || row.bestContactUrl || row.contactUrl || ""}`,
    `Proposal URL: ${row.contactFormProposalUrl || row.proposalUrl || ""}`,
    `Invoice review URL: ${row.invoiceReviewUrl || ""}`,
    "Evidence to record after a real manual send:",
    ...evidenceChecklist.map((item) => `- ${item}`),
    "",
    "Sent only after a real manual submission or legitimate email send. Revenue remains $0 until a signed agreement or settled external payment exists.",
  ].join("\n");
}

function readOpsValidationSnapshot() {
  const reportPath = path.join(__dirname, "..", "reports", "validation-report.json");
  try {
    return JSON.parse(fs.readFileSync(reportPath, "utf8"));
  } catch {
    return null;
  }
}

function readPublicJsonReport(fileName, fallback) {
  const reportPath = path.join(__dirname, "..", "reports", fileName);
  try {
    return JSON.parse(fs.readFileSync(reportPath, "utf8"));
  } catch {
    return fallback;
  }
}

function opsMetricTile(value, label) {
  return `<div class="metric-tile"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}

function opsStaticTable(headers, rows) {
  const body = rows.length
    ? rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("\n")
    : `<tr><td colspan="${headers.length}">No signal yet.</td></tr>`;
  return `<div class="preview-stage compact-table"><table class="event-table"><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function opsActiveRows(rows, scoreFn) {
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => scoreFn(row) > 0)
    .sort((a, b) => scoreFn(b) - scoreFn(a) || String(a.tool || a.source || "").localeCompare(String(b.tool || b.source || "")));
}

function opsSourceScore(row) {
  return (row.page_view || 0)
    + ((row.download_pdf || 0) + (row.download_file || 0)) * 4
    + ((row.free_tool_depth || 0) + (row.guide_depth || 0)) * 3
    + (row.seller_checkout_click || 0) * 6
    + (row.service_checkout_click || 0) * 6
    + (row.sponsor_request_intent || 0) * 5;
}

function opsToolScore(row) {
  return ((row.download_pdf || 0) + (row.download_file || 0)) * 4
    + ((row.generate_pdf || 0) + (row.generate_file || 0)) * 2
    + ((row.free_tool_depth || 0) + (row.guide_depth || 0)) * 3
    + (row.seller_checkout_click || 0) * 6
    + (row.service_checkout_click || 0) * 6
    + (row.service_request_intent || 0) * 5
    + (row.audit_request_intent || 0) * 4
    + (row.sponsor_request_intent || 0) * 5;
}

function opsCommercialIntent(totals) {
  return (totals.seller_checkout_intent || 0)
    + (totals.seller_checkout_click || 0)
    + (totals.service_checkout_click || 0)
    + (totals.service_request_intent || 0)
    + (totals.audit_request_intent || 0)
    + (totals.sponsor_request_intent || 0)
    + (totals.sponsor_lead_submit || 0)
    + (totals.sponsor_invoice_request || 0);
}

function opsSponsorSnapshotAction(sponsorLeads, sponsorIntent, pageViews, downloads, sponsorInvoiceRequests) {
  if (sponsorInvoiceRequests > 0) return "Invoice request present: export the private lead, verify policy fit, and send only an external invoice or agreement.";
  if (sponsorLeads > 0) return "Sponsor lead present: review fit, reply with the selected deal, and keep unsafe categories out.";
  if (sponsorIntent > 0) return "Sponsor clicks exist without lead capture; send the starter review proposal to the highest-fit sponsor prospects.";
  if (downloads > 0 || pageViews >= 50) return "Traffic exists; push one sponsor vertical tied to the warmest PDF, QR, resume, or paperwork path.";
  return "Keep distribution active and watch for the first download, sponsor intent, game play, or search signal.";
}

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
${freeToolDepthCtaHtml(tool)}${invoiceSponsorCloseCtaHtml(tool)}
${toolUploadFixServiceCtaHtml(tool)}
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
      </section>
      ${serviceUpgradeCtaHtml(tool)}`;
}

function toolUploadFixServiceCtaHtml(tool) {
  if (tool.path !== "tools/compress-image-to-kb") return "";
  return `
      <section class="shell section service-micro-intent-section">
        <div class="grid-2">
          <div>
            <p class="eyebrow">Optional paid help</p>
            <h2>Need the image under an exact KB limit today?</h2>
            <p>Use the free no-upload compressor first. If a portal still rejects the file, send one public-safe reply contact for a $9 Upload Limit Fix Plan with target settings and fallback steps.</p>
          </div>
          ${uploadLimitFixPlanInlineLeadFormHtml({
            pathName: "/tools/compress-image-to-kb/",
            utmSource: "compress-image-kb-tool",
            utmContent: "compress-image-kb-static-panel",
            submitLabel: "Request $9 invoice link",
            className: "upload-limit-fix-plan-micro-lead-form compress-image-kb-tool-fix-form",
            compact: true,
            imageKbToolFixForm: true,
            primaryInvoiceRequest: true,
            requestSummary: "I need a $9 Upload Limit Fix Plan for the Compress Image to KB tool before submitting to another website. Portal target: image or photo under the required KB limit. No file upload, private document, ID photo, resume, portal login, payment, tax, identity, or account details included.",
          })}
        </div>
      </section>`;
}

function invoiceSponsorCloseCtaHtml(tool) {
  if (tool.path !== "tools/invoice-generator") return "";
  const sponsorHref = "/sponsor-starter-review/?utm_source=invoice_tool&utm_medium=site&utm_campaign=sponsor_starter_review&utm_content=invoice-generator&vertical=small-business-paperwork-sponsors&commitment=request-invoice#sponsor-inquiry";
  const publicHref = sponsorPublicReplyUrl({
    verticalTitle: "Small Business Paperwork Sponsorship",
    dealTitle: "Starter fit review",
    dealPrice: "USD 49",
    proposalUrl: siteUrl("sponsor-starter-review").replace(/\/$/, "") + "?utm_source=invoice_tool&utm_medium=site&utm_campaign=sponsor_starter_review&utm_content=invoice-generator-public&vertical=small-business-paperwork-sponsors&commitment=request-invoice#sponsor-inquiry",
  });
  return `
      <section class="shell section invoice-sponsor-close-cta" aria-label="Sponsor invoice workflow">
        <div>
          <p class="eyebrow">Small-business sponsor pilot</p>
          <h2>Sponsor the free invoice workflow</h2>
          <p>Invoicing, bookkeeping, POS, payment, and small-business workflow products can request a manual USD 49 fit review for a clearly labeled pilot around this free invoice page. Downloads stay free and no payment is collected on-site.</p>
        </div>
        <div class="free-tool-depth-actions">
          <a class="button" data-track-event="sponsor_request_intent" data-track-tool="invoice-generator" href="${escapeHtml(sponsorHref)}">Request USD 49 invoice review</a>
          <a class="button secondary" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="invoice-generator" href="${escapeHtml(publicHref)}" target="_blank" rel="noreferrer">Open public invoice request</a>
          <p class="help">Revenue counts only after a signed sponsor agreement or settled external payment is verified.</p>
        </div>
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
      links: ["invoice-generator", "invoice-followup-email", "estimate-generator", "purchase-order", "receipt-generator", "timesheet-generator", "bill-of-sale", "rent-receipt", "packing-slip", "work-order", "inventory-sheet", "business-card", "address-labels", "barcode-labels"],
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
  const businessTools = ["invoice-generator", "invoice-followup-email", "estimate-generator", "receipt-generator", "purchase-order", "bill-of-sale", "rent-receipt", "timesheet-generator", "packing-slip", "work-order", "inventory-sheet", "business-card", "address-labels", "barcode-labels", "price-tag", "flyer-maker", "coupon-maker"];
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
  const defaultDeal = SPONSOR_DEALS.find((deal) => deal.id === DEFAULT_SPONSOR_DEAL_ID) || SPONSOR_DEALS[0];
  const defaultVertical = SPONSOR_VERTICALS[0];
  const publicReplyUrl = sponsorPublicReplyUrl({
    prospectName: "Sponsor team",
    verticalTitle: defaultVertical.title,
    dealTitle: defaultDeal.title,
    dealPrice: defaultDeal.price,
    proposalUrl: defaultDeal.trackedUrl || siteUrl("sponsor-deal-room"),
  });
  return `
      <section class="shell page-title section sponsor-hero">
        <a href="/free-pdf-tools/">Free tools</a>
        <h1>Sponsor PrintableTools Lab</h1>
        <p>PrintableTools Lab is a free no-signup browser utility site for PDF compression, image conversion, QR codes, business documents, career PDFs, upload-limit fixes, and printable planners. This page captures responsible sponsorship and partner inquiries without enabling ads or collecting payment on-site.</p>
        <p><a class="button" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open USD 49 invoice request</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor-starter-review/?utm_source=sponsor-page&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=hero#sponsor-quick-form">Start USD 49 review form</a> <a class="button ghost" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor-deal-room/?utm_source=sponsor-page&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=hero">Open deal room</a></p>
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
${sponsorExternalDiscoveryProofHtml()}
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
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public-safe reply</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/tools.json">Open tools feed</a> <a class="button ghost" href="/privacy/">Privacy policy</a></p>
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

function serviceUpgradeCtaHtml(tool) {
  if (!LOCAL_SELLER_FUNNEL_TOOL_PATH_SET.has(tool.path)) return "";
  const toolSlug = tool.path.replace(/^tools\//, "");
  if (tool.path === "tools/invoice-generator" || tool.path === "tools/invoice-followup-email") {
    const serviceHref = `/${INVOICE_FOLLOWUP_COPY_PACK_SERVICE.slug}/?utm_source=tool_cta&utm_medium=site&utm_campaign=invoice_followup_service&utm_content=${encodeURIComponent(toolSlug)}#service-request`;
    const invoiceHref = `/tools/invoice-generator/?utm_source=tool_cta&utm_medium=site&utm_campaign=invoice_followup_tool&utm_content=${encodeURIComponent(toolSlug)}`;
    const followupHref = `/tools/invoice-followup-email/?utm_source=tool_cta&utm_medium=site&utm_campaign=invoice_followup_tool&utm_content=${encodeURIComponent(toolSlug)}`;
    const inlineForm = invoiceFollowupInlineLeadFormHtml({
      pathName: `/${tool.path}/`,
      utmSource: "tool_cta",
      utmContent: `${toolSlug}-inline`,
      submitLabel: "Send $19 sequence request",
      className: "tool-invoice-lead-form invoice-micro-lead-form",
      compact: true,
    });
    const localSellerActions = tool.path === "tools/invoice-generator"
      ? [
        `<a class="button secondary" data-track-event="service_request_intent" data-track-tool="${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.id)}" href="/${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug)}/?utm_source=tool_cta&utm_medium=site&utm_campaign=service_request&utm_content=${encodeURIComponent(toolSlug)}">Start free fit check</a>`,
        `<a class="button ghost" data-track-event="audit_request_intent" data-track-tool="${escapeHtml(MARKET_TABLE_PRINT_AUDIT.id)}" href="/${escapeHtml(MARKET_TABLE_PRINT_AUDIT.slug)}/?utm_source=tool_cta&utm_medium=site&utm_campaign=audit_request&utm_content=${encodeURIComponent(toolSlug)}">Free print audit first</a>`,
        `<p class="help">Also selling locally? The optional $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} print-pack setup can turn invoice, receipt, price tag, flyer, QR, coupon, and packing-slip details into a first printable seller pack.</p>`,
      ].join("\n          ")
      : "";
    const invoiceActions = [
      `<a class="button" data-track-event="service_request_intent" data-track-tool="${escapeHtml(INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id)}" href="${escapeHtml(serviceHref)}">Start invoice fit check</a>`,
      `<a class="button secondary" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(toolSlug)}" href="${escapeHtml(tool.path === "tools/invoice-generator" ? followupHref : invoiceHref)}">${tool.path === "tools/invoice-generator" ? "Write follow-up email" : "Create invoice first"}</a>`,
      localSellerActions,
      `<p class="help">Payment happens only through a real external checkout or invoice after fit is confirmed.</p>`,
    ].filter(Boolean).join("\n          ");
    return `
      <section class="shell section service-upgrade-cta" aria-label="Optional invoice follow-up help">
        <div>
          <p class="eyebrow">Optional done-for-you help</p>
          <h2>Want the full invoice follow-up sequence written for you?</h2>
          <p>The free invoice tools stay free. Send a free fit check for the $${INVOICE_FOLLOWUP_COPY_PACK_SERVICE.priceUsd} ${escapeHtml(INVOICE_FOLLOWUP_COPY_PACK_SERVICE.name)} if you want a polished reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice note prepared for one workflow.</p>
        </div>
        <div class="home-service-lead-panel">
          ${inlineForm}
          <div class="actions">
          ${invoiceActions}
          </div>
        </div>
      </section>`;
  }
  const serviceHref = `/${CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug}/?utm_source=tool_cta&utm_medium=site&utm_campaign=service_request&utm_content=${encodeURIComponent(toolSlug)}`;
  const auditHref = `/${MARKET_TABLE_PRINT_AUDIT.slug}/?utm_source=tool_cta&utm_medium=site&utm_campaign=audit_request&utm_content=${encodeURIComponent(toolSlug)}`;
  return `
      <section class="shell section service-upgrade-cta" aria-label="Optional done-for-you setup">
        <div>
          <p class="eyebrow">Optional done-for-you help</p>
          <h2>Want the first local seller print pack assembled?</h2>
          <p>The free generators stay free. Send a free fit check for the $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} ${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.name)} if you want price tag rows, flyer copy, QR sign wording, coupon ideas, pickup notes, and a print checklist prepared from your item list.</p>
        </div>
        <div class="free-tool-depth-actions">
          <a class="button" data-track-event="service_request_intent" data-track-tool="${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.id)}" href="${escapeHtml(serviceHref)}">Start free fit check</a>
          <a class="button secondary" data-track-event="audit_request_intent" data-track-tool="${escapeHtml(MARKET_TABLE_PRINT_AUDIT.id)}" href="${escapeHtml(auditHref)}">Free print audit first</a>
          <p class="help">Payment happens only through a real external checkout or invoice after fit is confirmed.</p>
        </div>
      </section>`;
}

function sponsorStarterReviewHtml() {
  const deal = SPONSOR_DEALS.find((item) => item.id === "starter-fit-review") || SPONSOR_DEALS[0];
  const vertical = SPONSOR_VERTICALS[0];
  const reviewUrl = `${siteUrl("sponsor-starter-review").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=canonical#sponsor-inquiry`;
  const publicReplyUrl = sponsorPublicReplyUrl({
    prospectName: "Sponsor team",
    verticalTitle: vertical.title,
    dealTitle: deal.title,
    dealPrice: deal.price,
    proposalUrl: reviewUrl,
  });
  return `
      <section class="shell page-title section sponsor-hero sponsor-starter-hero">
        <a href="/sponsor-deal-room/">Sponsor deal room</a>
        <h1>USD 49 starter sponsor review for PrintableTools Lab</h1>
        <p>A short manual fit review for sponsors who want to know whether their product is safe, relevant, and worth discussing before any visible placement. No payment is collected on this page; invoice or agreement steps happen externally after policy fit.</p>
        <p><a class="button" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open USD 49 invoice request</a> <a class="button secondary" data-sponsor-deal-select ${sponsorDealPrefillAttrs(deal)} data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-quick-form">Start USD 49 review form</a> <a class="button ghost" href="/sponsor-deal-room.json">Open deal JSON</a></p>
      </section>
${sponsorLeadFormHtml()}
      <section class="shell section">
        <h2>Starter fit review</h2>
        <div class="grid-3">
          <article class="panel"><h3>${escapeHtml(deal.title)}</h3><p><strong>${escapeHtml(deal.price)}</strong></p><p>${escapeHtml(deal.bestFor)}</p></article>
          <article class="panel"><h3>What it covers</h3><p>${escapeHtml(deal.deliverable)}</p><p class="help">Needed: ${escapeHtml(deal.proofNeeded)}</p></article>
          <article class="panel"><h3>Revenue gate</h3><p>This requests manual review only. Revenue is real only after a signed sponsor agreement or settled external payment is verified.</p></article>
        </div>
      </section>
${sponsorExternalDiscoveryProofHtml()}
      <section class="shell section">
        <h2>What the USD 49 review covers</h2>
        <div class="grid-2">
          <article class="panel"><h3>Product and category fit</h3><p>Checks whether the sponsor belongs near PDF, image, QR, classroom, career, or small-business utility pages without misleading visitors.</p></article>
          <article class="panel"><h3>Safe landing URL</h3><p>Reviews the public landing page for clear claims, relevant audience fit, and obvious exclusion risks before any copy is discussed.</p></article>
          <article class="panel"><h3>Best page family</h3><p>Recommends whether the sponsor is better suited to the deal room, a vertical sponsor page, a guide pilot, or no placement.</p></article>
          <article class="panel"><h3>Next-step copy</h3><p>Returns public-safe next-step wording for a sponsor inquiry, invoice request, or partner distribution test.</p></article>
        </div>
      </section>
      <section class="shell section">
        <h2>Policy limits</h2>
        <ul>
          <li>Downloads stay free and cannot require sponsor interaction, ad clicks, accounts, or payment.</li>
          <li>Sponsor copy must be clearly labeled and separated from generator controls.</li>
          <li>No gambling, adult, deceptive finance, malware, fake document, misleading upload-service, or unsafe claims.</li>
          <li>The starter review does not guarantee traffic, placement approval, ranking, or conversion.</li>
        </ul>
        <p><a class="button" href="/sponsor-media-kit.json">Open media kit</a> <a class="button secondary" href="/sponsor-deal-room/">Compare all sponsor options</a> <a class="button ghost" href="/privacy/">Privacy policy</a></p>
        ${jsonLdHtml({
          "@context": "https://schema.org",
          "@type": "Offer",
          name: "PrintableTools Lab starter sponsor review",
          price: "49",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: siteUrl("sponsor-starter-review"),
          description: "Manual sponsor fit review before any visible placement or external invoice.",
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
        <h2>Copy-ready pilot request</h2>
        <div class="grid-2">
          ${SPONSOR_DEALS.filter((deal) => deal.id !== "partner-distribution-test").slice(0, 2).map((deal) => {
            const vertical = SPONSOR_VERTICALS[0];
            const prospect = { id: deal.id, name: "Sponsor team", category: "Direct buyer", fitReason: deal.bestFor, vertical: vertical.slug };
            const copy = sponsorInvoiceRequestCopy(prospect, deal, vertical, deal.trackedUrl);
            return `<article class="panel"><h3>${escapeHtml(deal.title)}</h3><p><strong>${escapeHtml(deal.price)}</strong></p><p>${escapeHtml(deal.deliverable)}</p><p><button class="button" type="button" data-copy-text="${escapeHtml(copy)}" data-track-event="sponsor_request_intent" data-track-tool="sponsor">Copy invoice request</button></p></article>`;
          }).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Best-fit sponsor categories</h2>
        <div class="grid-3">
          ${SPONSOR_VERTICALS.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><p>${escapeHtml(vertical.sponsorFit)}</p><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p><a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor/${escapeHtml(vertical.slug)}/?utm_source=sponsor-deal-room&utm_medium=organic&utm_campaign=${escapeHtml(vertical.campaign)}&utm_content=vertical-card">Open vertical fit</a></p></article>`).join("\n")}
        </div>
      </section>
${sponsorExternalDiscoveryProofHtml()}
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
  const starterReviewUrl = `${siteUrl("sponsor-starter-review").replace(/\/$/, "")}?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=primary-cta&commitment=request-invoice#sponsor-inquiry`;
  return `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor/">Sponsor page</a>
        <h1>Sponsor call: privacy-friendly file and printable workflows</h1>
        <p>PrintableTools Lab is accepting a small number of manually reviewed sponsor and partner inquiries for free no-signup PDF, image, QR, resume, classroom, and small-business workflows. This public call is designed so partners can respond through the sponsor form instead of private outreach email.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(starterReviewUrl)}">Request USD 49 invoice review</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor-deal-room/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=secondary-cta">Open deal room</a> <a class="button ghost" href="/sponsor-call.json">Open sponsor call JSON</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Current sponsor openings</h2>
        <div class="grid-3">
          ${SPONSOR_CALL_ACTIONS.map((item) => `<article class="panel"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.audience)}</p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(item.url)}">Open tracked path</a></p><p class="help">${escapeHtml(item.signal)}</p></article>`).join("\n")}
        </div>
      </section>
${sponsorExternalDiscoveryProofHtml()}
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
  const starterReviewUrl = `${siteUrl("sponsor-starter-review").replace(/\/$/, "")}?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=board-hero&commitment=request-invoice#sponsor-inquiry`;
  return `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor-call/">Sponsor call</a>
        <h1>Sponsor opportunities for free PDF, image, and QR workflows</h1>
        <p>This board lists the current policy-fit sponsor categories for PrintableTools Lab. It is built for partners, resource pages, newsletters, and crawlers that need a concise view of the available audiences without private outreach or payment details.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(starterReviewUrl)}">Request USD 49 invoice review</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(board.inquiryUrl)}">Send sponsor inquiry</a> <a class="button ghost" href="/sponsor-opportunities.json">Open opportunities JSON</a> <a class="button ghost" href="/sponsor-intent-feed.json">Open intent feed</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Sponsor prospect paths</h2>
        <div class="grid-3">
          ${board.prospectPaths.map((item) => `<article class="panel"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.sponsorFit)}</p><p><strong>${escapeHtml(item.firstAction)}</strong></p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(item.invoiceReviewUrl)}">Request invoice review for this audience</a></p></article>`).join("\n")}
        </div>
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
${sponsorExternalDiscoveryProofHtml()}
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
${sponsorExternalDiscoveryProofHtml()}
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
  const defaultDeal = SPONSOR_DEALS.find((deal) => deal.id === DEFAULT_SPONSOR_DEAL_ID) || SPONSOR_DEALS[0];
  const defaultVertical = SPONSOR_VERTICALS[0];
  const publicReplyUrl = sponsorPublicReplyUrl({
    prospectName: "Sponsor team",
    verticalTitle: defaultVertical.title,
    dealTitle: defaultDeal.title,
    dealPrice: defaultDeal.price,
    proposalUrl: defaultDeal.trackedUrl || siteUrl("sponsor-deal-room"),
  });
  return `
      <section id="sponsor-inquiry" class="shell section">
        <div class="grid-2">
          <div>
            <h2>Sponsorship inquiry form</h2>
            <p>Share only business-safe details. The inquiry is stored for follow-up review, while public dashboards show only aggregate lead counts.</p>
            <div class="notice sponsor-close-path">
              <strong>Fastest paid pilot path</strong>
              <p>Start with the USD 49 starter fit review. The lowest-friction private form needs only a business email; website is optional and can be inferred from the email domain.</p>
              <p><a class="button" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open USD 49 invoice request</a> <a class="button secondary" data-sponsor-deal-select ${sponsorDealPrefillAttrs(defaultDeal)} data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-quick-form">Use USD 49 starter review</a></p>
            </div>
            <ul>
              <li>Best fit: relevant PDF, image, QR, productivity, classroom, career, or small-business tools.</li>
              <li>Not accepted: gambling, adult, deceptive finance, malware, fake document, or misleading upload-service offers.</li>
              <li>Payment, tax, bank, phone, and private identity details stay outside this form.</li>
            </ul>
            <div class="notice sponsor-public-reply">
              <strong>Prefer a public-safe reply?</strong>
              <p>Public-safe reply form: open a prefilled USD 49 invoice-review issue with only public company, website, fit, and deal context. Do not include payment, tax, bank, phone, identity, password, or customer-file details.</p>
              <p><a class="button" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open USD 49 invoice request</a></p>
            </div>
          </div>
          <form class="panel form-grid sponsor-quick-form sponsor-micro-lead-form" id="sponsor-quick-form" data-sponsor-quick-form>
            <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
            <input type="hidden" name="dealId">
            <h3>One-field USD 49 invoice review</h3>
            <p class="help">Send one business-safe field for manual fit review. Any invoice or agreement is sent later through an external provider.</p>
            <label class="field sponsor-deal-picker sr-only">
              <span>Selected pilot</span>
              <select name="quickDealId" data-sponsor-quick-deal aria-label="Selected pilot" tabindex="-1">
                ${sponsorQuickDealOptions()}
              </select>
            </label>
            <input type="hidden" name="company" value="">
            <label class="field">
              <span>Business email</span>
              <input name="contactEmail" type="email" maxlength="140" autocomplete="email" required>
            </label>
            <label class="field">
              <span>Website (optional)</span>
              <input name="website" type="url" maxlength="220" placeholder="https://example.com or leave blank" autocomplete="url">
            </label>
            <div class="actions">
              <button class="button" type="submit" data-track-event="sponsor_request_intent" data-track-tool="sponsor">Send USD 49 invoice review request</button>
              <a class="button secondary" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public request instead</a>
            </div>
            <p class="notice compact-notice" data-sponsor-quick-summary>Selected pilot: Starter fit review - USD 49. No payment is collected here.</p>
            <p class="help sponsor-lead-status" data-sponsor-lead-status role="status" aria-live="polite">No payment is collected here. Fit is reviewed manually first.</p>
          </form>
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
            <p class="notice" data-sponsor-deal-status>Choose a deal above to prefill placement, budget, timeline, and next step.</p>
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
  const liveDirectoryListings = [
    ["TechTools Launchpad", "https://techtools.cz/tools/launchpad/?tool=161", "Homepage listing for the free no-signup tool collection."],
    ["TechTools Upload Limit Fixer", "https://techtools.cz/tools/launchpad/?tool=162", "High-intent listing for file-size and format upload errors."],
    ["TechTools Invoice Generator", "https://techtools.cz/tools/launchpad/?tool=168", "Service-lead path for small-seller invoice PDF visitors."],
    ["TechTools Invoice Follow-up Copy Pack", "https://techtools.cz/tools/launchpad/?tool=169", "Direct discovery listing for the $19 invoice follow-up copy service."],
    ["TechTools Invoice Follow-up Email Generator", "https://techtools.cz/tools/launchpad/?tool=170", "Free-tool discovery listing for invoice reminder visitors before the $19 service CTA."],
    ["TechTools Overdue Invoice Reminder Email", "https://techtools.cz/tools/launchpad/?tool=171", "High-intent overdue invoice reminder listing that points to a service-lead landing page."],
    ["TechTools Upload Limit Fix Plan", "https://techtools.cz/tools/launchpad/?tool=172", "Direct discovery listing for the $9 upload-limit troubleshooting service path."],
    ["TechTools Upload Error Cheatsheet", "https://techtools.cz/tools/launchpad/?tool=173", "High-intent listing for exact PDF, image, resume, and portal upload errors."],
    ["TechTools Compress PDF to 1MB", "https://techtools.cz/tools/launchpad/?tool=174", "High-intent listing for the common PDF under 1MB upload-error path that leads to the download-time $9 upload fix request."],
    ["TechTools PDF Under 1MB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=175", "Tool-level 1MB PDF listing that opens the compressor with the pre-download $9 upload fix request ready."],
    ["TechTools Photo Under 100KB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=176", "Tool-level photo 100KB listing that opens the image compressor with the pre-download $9 upload fix request ready."],
    ["TechTools Image Under 2MB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=177", "Tool-level image 2MB listing that opens the image compressor with the pre-download $9 upload fix request ready."],
    ["TechTools JPG Under 200KB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=178", "Tool-level JPG 200KB listing that opens the image compressor with the pre-download $9 upload fix request ready."],
    ["TechTools Resume PDF Too Large Upload Fix", "https://techtools.cz/tools/launchpad/?tool=179", "Resume PDF 1MB listing that opens the PDF compressor with the pre-download $9 upload fix request ready."],
    ["TechTools PNG Screenshot Too Large Upload Fix", "https://techtools.cz/tools/launchpad/?tool=180", "PNG screenshot 500KB listing that opens the image compressor with the pre-download $9 upload fix request ready."],
    ["TechTools Passport Photo 50KB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=181", "Passport photo 50KB listing that opens the image compressor with the pre-download $9 upload fix request ready."],
    ["TechTools PDF Under 500KB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=182", "Strict PDF 500KB listing that opens the compressor with the pre-download $9 upload fix request ready."],
    ["TechTools Image Under 500KB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=183", "Image 500KB listing that opens the image compressor with the pre-download $9 upload fix request ready."],
    ["TechTools Image Dimensions 600x600 Upload Fix", "https://techtools.cz/tools/launchpad/?tool=184", "Tool-level 600 x 600 image dimensions listing that opens the resize path with the $9 upload fix request ready."],
    ["TechTools PDF Not Accepted JPG Required Fix", "https://techtools.cz/tools/launchpad/?tool=185", "PDF-to-JPG required listing that routes visitors to the format fix path with the $9 upload fix request ready."],
    ["TechTools Email Attachment Too Large PDF Fix", "https://techtools.cz/tools/launchpad/?tool=186", "Email attachment too large listing that routes visitors to the PDF compression path with the $9 upload fix request ready."],
    ["TechTools Compress Image to KB", "https://techtools.cz/tools/launchpad/?tool=187", "Image compressor listing for upload-size visitors who can request the $9 fix path after testing a file."],
    ["TechTools Compress PDF to 500KB", "https://techtools.cz/tools/launchpad/?tool=188", "Strict PDF 500KB landing listing for portal and email attachment failures."],
    ["TechTools Compress Image to 50KB", "https://techtools.cz/tools/launchpad/?tool=189", "Exact 50KB image target listing for high-intent upload-size searches."],
    ["TechTools Compress Image to 100KB", "https://techtools.cz/tools/launchpad/?tool=190", "Exact 100KB image target listing for photo and portal upload failures."],
    ["TechTools Compress Image to 200KB", "https://techtools.cz/tools/launchpad/?tool=191", "Exact 200KB image target listing for JPG, PNG, and form upload failures."],
    ["TechTools Compress JPG to 50KB", "https://techtools.cz/tools/launchpad/?tool=192", "Format-specific JPG 50KB listing with the one-contact $9 invoice request path."],
    ["TechTools Compress JPG to 100KB", "https://techtools.cz/tools/launchpad/?tool=193", "Format-specific JPG 100KB listing with the one-contact $9 invoice request path."],
    ["TechTools Compress JPG to 200KB", "https://techtools.cz/tools/launchpad/?tool=194", "Format-specific JPG 200KB listing with the one-contact $9 invoice request path."],
    ["TechTools Compress PNG to 50KB", "https://techtools.cz/tools/launchpad/?tool=195", "Format-specific PNG 50KB listing with the one-contact $9 invoice request path."],
    ["TechTools Compress PNG to 100KB", "https://techtools.cz/tools/launchpad/?tool=196", "Format-specific PNG 100KB listing with the one-contact $9 invoice request path."],
    ["TechTools Compress PNG to 200KB", "https://techtools.cz/tools/launchpad/?tool=197", "Format-specific PNG 200KB listing with the one-contact $9 invoice request path."],
    ["TechTools Passport Photo Compress to 50KB", "https://techtools.cz/tools/launchpad/?tool=198", "Passport-photo 50KB listing for document upload visitors with the $9 fix request path."],
    ["TechTools Passport Photo Compress to 100KB", "https://techtools.cz/tools/launchpad/?tool=199", "Passport-photo 100KB listing for application upload visitors with the $9 fix request path."],
    ["TechTools Passport Photo Compress to 200KB", "https://techtools.cz/tools/launchpad/?tool=200", "Passport-photo 200KB listing for application upload visitors with the $9 fix request path."],
    ["TechTools PDF Under 2MB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=201", "PDF 2MB listing for proposal, school, and portal upload visitors with the $9 fix request path."],
    ["TechTools PDF Under 5MB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=202", "PDF 5MB listing for scanned documents and admin upload visitors with the $9 fix request path."],
    ["TechTools Resume PDF Under 2MB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=203", "Resume PDF 2MB listing for job application visitors with the $9 fix request path."],
    ["TechTools Document Under 5MB Upload Fix", "https://techtools.cz/tools/launchpad/?tool=204", "Document 5MB listing for application and portal upload visitors with the $9 fix request path."],
    ["TechTools PDF Size Reducer", "https://techtools.cz/tools/launchpad/?tool=205", "PDF target-size hub listing for visitors choosing 500KB, 1MB, 2MB, or 5MB with the $9 fix request path."],
    ["TechTools Compress PDF to 2MB", "https://techtools.cz/tools/launchpad/?tool=206", "PDF 2MB target-size listing for proposal, school, support, and portal upload visitors."],
    ["TechTools Compress PDF to 5MB", "https://techtools.cz/tools/launchpad/?tool=207", "PDF 5MB target-size listing for readable scanned documents, support tickets, and attachment visitors."],
    ["TechTools Compress PDF Without Uploading", "https://techtools.cz/tools/launchpad/?tool=208", "No-upload PDF compression listing for scanned, photo-heavy, and portal-ready files."],
    ["TechTools PDF to JPG Without Uploading", "https://techtools.cz/tools/launchpad/?tool=209", "No-upload PDF-to-JPG listing for portals that require image files instead of PDFs."],
    ["TechTools JPG to PDF Without Uploading", "https://techtools.cz/tools/launchpad/?tool=210", "No-upload JPG-to-PDF listing for combining scans, receipts, and document photos into one PDF."],
    ["TechTools Extract Text From PDF Without Uploading", "https://techtools.cz/tools/launchpad/?tool=212", "No-upload PDF text extraction listing for copying notes, forms, resumes, and public-safe drafts."],
    ["TechTools Merge PDF Without Uploading", "https://techtools.cz/tools/launchpad/?tool=213", "No-upload PDF merge listing for visitors combining forms, receipts, scans, and document packets."],
    ["TechTools Split PDF Without Uploading", "https://techtools.cz/tools/launchpad/?tool=214", "No-upload PDF split listing for visitors trimming packets, pulling pages, and preparing smaller upload-ready PDFs."],
    ["TechTools Signature Under 20KB", "https://techtools.cz/tools/launchpad/?tool=215", "Strict signature 20KB listing for exam, job, admin, and application upload visitors with the $9 upload fix request path."],
    ["TechTools Passport Photo Size Fixer", "https://techtools.cz/tools/launchpad/?tool=216", "Passport photo dimension-and-KB listing for ID-style upload visitors who need crop, resize, and compression steps."],
    ["TechTools Resize Photo 413x531", "https://techtools.cz/tools/launchpad/?tool=217", "Exact 413 x 531 px photo resize listing for application and profile upload visitors."],
    ["TechTools Signature Under 50KB", "https://techtools.cz/tools/launchpad/?tool=218", "Signature 50KB listing for school, job, admin, and document upload visitors with the $9 upload fix request path."],
    ["TechTools Resize Signature 140x60", "https://techtools.cz/tools/launchpad/?tool=219", "Exact 140 x 60 px signature resize listing for exam, job, school, and admin upload visitors."],
    ["TechTools Photo 200x230 Under 50KB", "https://techtools.cz/tools/launchpad/?tool=220", "Combined 200 x 230 px and 50KB photo listing for exam, profile, job, and application upload visitors."],
    ["TechTools Resize Signature 200x100", "https://techtools.cz/tools/launchpad/?tool=221", "Exact 200 x 100 px signature resize listing for job, school, exam, document, and admin upload visitors."],
    ["TechTools resize photo 200x230 and passport photo 35x45mm retry", "https://techtools.cz/tools/launchpad/", "Rate-limited after the 200 x 100 signature listing; retry the remaining exact-photo listings after the one-hour API window."],
    ["NoSignupTools Upload Limit Fixer", "https://nosignuptools.com/tools/upload-limit-fixer-by-printabletools-lab", "Pending public API submission for a no-signup upload error matcher."],
    ["NoSignupTools Upload Error Cheatsheet", "https://nosignuptools.com/tools/upload-error-cheatsheet-by-printabletools-lab", "Pending public API submission for exact upload-error fix routing."],
    ["NoSignupTools PDF Under 2MB Upload Fix", "https://nosignuptools.com/tools/pdf-under-2mb-upload-fix-by-printabletools-lab", "Pending public API submission for the PDF 2MB upload-limit page with the $9 fix request path."],
    ["NoSignupTools PDF Under 5MB Upload Fix", "https://nosignuptools.com/tools/pdf-under-5mb-upload-fix-by-printabletools-lab", "Pending public API submission for the PDF 5MB upload-limit page with the $9 fix request path."],
    ["NoSignupTools Resume PDF Under 2MB Upload Fix", "https://nosignuptools.com/tools/resume-pdf-under-2mb-upload-fix-by-printabletools-lab", "Pending public API submission for the resume PDF 2MB page with the $9 fix request path."],
    ["NoSignupTools Document Under 5MB Upload Fix", "https://nosignuptools.com/tools/document-under-5mb-upload-fix-by-printabletools-lab", "Pending public API submission for the document 5MB page with the $9 fix request path."],
    ["NoSignupTools Compress JPG to 50KB", "https://nosignuptools.com/tools/compress-jpg-to-50kb-by-printabletools-lab", "Pending public API submission for the exact JPG 50KB page with a one-contact $9 invoice request path."],
    ["NoSignupTools Compress JPG to 100KB", "https://nosignuptools.com/tools/compress-jpg-to-100kb-by-printabletools-lab", "Pending public API submission for the exact JPG 100KB page with a one-contact $9 invoice request path."],
    ["NoSignupTools Compress JPG to 200KB", "https://nosignuptools.com/tools/compress-jpg-to-200kb-by-printabletools-lab", "Pending public API submission for the exact JPG 200KB page with a one-contact $9 invoice request path."],
    ["NoSignupTools Compress PNG to 50KB", "https://nosignuptools.com/tools/compress-png-to-50kb-by-printabletools-lab", "Pending public API submission for the exact PNG 50KB page with a one-contact $9 invoice request path."],
    ["NoSignupTools Compress PNG to 100KB", "https://nosignuptools.com/tools/compress-png-to-100kb-by-printabletools-lab", "Pending public API submission for the exact PNG 100KB page with a one-contact $9 invoice request path."],
    ["NoSignupTools Compress PNG to 200KB", "https://nosignuptools.com/tools/compress-png-to-200kb-by-printabletools-lab", "Pending public API submission for the exact PNG 200KB page with a one-contact $9 invoice request path."],
    ["NoSignupTools Passport Photo Compress to 50KB", "https://nosignuptools.com/tools/passport-photo-compress-to-50kb-by-printabletools-lab", "Pending public API submission for the passport-photo 50KB page with a one-contact $9 invoice request path."],
    ["NoSignupTools Passport Photo Compress to 100KB", "https://nosignuptools.com/tools/passport-photo-compress-to-100kb-by-printabletools-lab", "Pending public API submission for the passport-photo 100KB page with a one-contact $9 invoice request path."],
    ["NoSignupTools Passport Photo Compress to 200KB", "https://nosignuptools.com/tools/passport-photo-compress-to-200kb-by-printabletools-lab", "Pending public API submission for the passport-photo 200KB page with a one-contact $9 invoice request path."],
    ["NoSignupTools Extract Text From PDF Without Uploading", "https://nosignuptools.com/tools/extract-text-from-pdf-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload PDF text extraction page."],
    ["NoSignupTools Merge PDF Without Uploading", "https://nosignuptools.com/tools/merge-pdf-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload PDF merge page."],
    ["NoSignupTools Split PDF Without Uploading", "https://nosignuptools.com/tools/split-pdf-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload PDF split page."],
    ["NoSignupTools Rotate PDF Pages Without Uploading", "https://nosignuptools.com/tools/rotate-pdf-pages-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload PDF rotate page."],
    ["NoSignupTools Remove Pages From PDF Without Uploading", "https://nosignuptools.com/tools/remove-pages-from-pdf-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload PDF page-removal page."],
    ["NoSignupTools Reorder PDF Pages Without Uploading", "https://nosignuptools.com/tools/reorder-pdf-pages-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload PDF reorder page."],
    ["NoSignupTools Add Page Numbers to PDF", "https://nosignuptools.com/tools/add-page-numbers-to-pdf-by-printabletools-lab", "Pending public API submission for the PDF page-numbering page."],
    ["NoSignupTools Stamp PDF Without Uploading", "https://nosignuptools.com/tools/stamp-pdf-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload PDF stamp page."],
    ["NoSignupTools Sign PDF Without Uploading", "https://nosignuptools.com/tools/sign-pdf-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload PDF signing helper page."],
    ["NoSignupTools Compress Image Without Uploading", "https://nosignuptools.com/tools/compress-image-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload image compression page."],
    ["NoSignupTools Resize Image Without Uploading", "https://nosignuptools.com/tools/resize-image-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload image resize page."],
    ["NoSignupTools Convert Image Format Without Uploading", "https://nosignuptools.com/tools/convert-image-format-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload image format conversion page."],
    ["NoSignupTools Remove Background Without Uploading", "https://nosignuptools.com/tools/remove-background-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload transparent PNG helper page."],
    ["NoSignupTools Crop Image Without Uploading", "https://nosignuptools.com/tools/crop-image-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload image crop page."],
    ["NoSignupTools Rotate Image Without Uploading", "https://nosignuptools.com/tools/rotate-image-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload image rotate page."],
    ["NoSignupTools Watermark Image Without Uploading", "https://nosignuptools.com/tools/watermark-image-without-uploading-by-printabletools-lab", "Pending public API submission for the no-upload image watermark page."],
    ["NoSignupTools Passport Photo Size Fixer", "https://nosignuptools.com/tools/passport-photo-size-fixer-by-printabletools-lab", "Pending public API submission for the passport photo crop, resize, and KB fix workflow."],
    ["NoSignupTools Resize Photo 413x531", "https://nosignuptools.com/tools/resize-photo-413x531-by-printabletools-lab", "Pending public API submission for the exact 413 x 531 px photo resize workflow."],
    ["NoSignupTools Passport Photo 35x45mm", "https://nosignuptools.com/tools/passport-photo-35x45mm-by-printabletools-lab", "Pending public API submission for the common 35 x 45 mm passport-style photo workflow."],
    ["NoSignupTools Photo 200x230 Under 50KB", "https://nosignuptools.com/tools/photo-200x230-under-50kb-by-printabletools-lab", "Pending public API submission for the combined 200 x 230 px and 50KB photo path."],
    ["NoSignupTools Resize Photo 200x230", "https://nosignuptools.com/tools/resize-photo-200x230-by-printabletools-lab", "Pending public API submission for the exact 200 x 230 px photo resize workflow."],
    ["NoSignupTools Signature Under 20KB", "https://nosignuptools.com/tools/signature-under-20kb-by-printabletools-lab", "Pending public API submission for the strict 20KB signature image path."],
    ["NoSignupTools Signature Under 50KB", "https://nosignuptools.com/tools/signature-under-50kb-by-printabletools-lab", "Pending public API submission for the 50KB signature image path."],
    ["NoSignupTools Resize Signature 140x60", "https://nosignuptools.com/tools/resize-signature-140x60-by-printabletools-lab", "Pending public API submission for the exact 140 x 60 px signature resize workflow."],
    ["NoSignupTools Resize Signature 200x100", "https://nosignuptools.com/tools/resize-signature-200x100-by-printabletools-lab", "Pending public API submission for the exact 200 x 100 px signature resize workflow."],
    ["FreeNoSignup Upload Limit Fixer", "https://freenosignup.com/?s=Upload+Limit+Fixer", "Pending Google Form submission for the free upload error matcher."],
    ["FreeNoSignup Upload Error Cheatsheet", "https://freenosignup.com/?s=Upload+Error+Cheatsheet", "Pending Google Form submission for exact upload-error fix routing."],
    ["NoLogin.tools", "https://nologin.tools/tool/printable-tools-lab-pages-dev", "Privacy-friendly no-login tool listing."],
    ["NoLogin.tools Upload Limit Fixer", "https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-limit-fixer", "No-login listing for upload-limit fixes."],
    ["NoLogin.tools Upload Error Cheatsheet", "https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-error-cheatsheet", "Pending no-login submission for exact upload-error fix routing."],
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
        <h2>External listings and submissions</h2>
        <p>These public directory entries and pending submissions are discovery signals, not revenue proof. They are listed here so reviewers can verify external visibility without accessing internal operations pages.</p>
        <div class="grid-2">
          ${liveDirectoryListings.map(([title, url, note]) => {
            const pending = /pending/i.test(note);
            return `<article class="panel"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(note)}</p><a class="button secondary" href="${escapeHtml(url)}" rel="nofollow">${pending ? "Open pending URL" : "Open listing"}</a></article>`;
          }).join("\n")}
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
  const fixPlanSummary = "I need a $9 Upload Limit Fix Plan after checking the upload error cheatsheet. Public-safe error text: [paste the exact message]. File type and target rule: [PDF/image/JPG/PNG, size limit, dimensions, or portal rule]. Please send target settings, fallback steps, and a review-before-upload checklist. No actual file, private document, ID photo, resume, portal login, bank details, tax IDs, or private account data included.";
  const rowFixPlanSummary = (item) => `I need a $9 Upload Limit Fix Plan after checking the upload error cheatsheet. Public-safe error text: ${item.errorText}. File type and target rule: ${item.format} ${item.target}. Matched free-tool route: ${item.response} Please send target settings, fallback steps, and a review-before-upload checklist. No actual file, private document, ID photo, resume, portal login, bank details, tax IDs, or private account data included.`;
  const rowFixPlanHref = (item) => serviceLeadFallbackUrl({
    serviceType: "upload-limit-fix-plan",
    pathName: "/upload-error-cheatsheet/",
    requestSummary: rowFixPlanSummary(item),
  });
  const rowInvoiceRequestHref = (item) => serviceInvoiceRequestUrl({
    serviceType: "upload-limit-fix-plan",
    pathName: "/upload-error-cheatsheet/",
    requestSummary: rowFixPlanSummary(item),
  });
  return `
      <section class="shell page-title section">
        <a href="/upload-limit-fixer/">Upload limit fixer</a>
        <h1>Upload error cheatsheet</h1>
        <p>A copy-ready reference for common PDF, image, JPG, PNG, resume, and email attachment upload errors. Each row links to a free no-signup browser tool and a specific landing page that explains the fix.</p>
        <p><a class="button" data-service-invoice-jump data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="#service-request">Request $9 invoice link</a> <a class="button secondary" href="#service-request">Use one-contact form</a> <a class="button ghost" href="/upload-error-cheatsheet.json">Open JSON feed</a></p>
      </section>
      <section class="shell section">
        <h2>Common upload errors and direct fixes</h2>
        ${uploadErrorQuickRequestPanelHtml(fixPlanSummary)}
        <table class="event-table">
          <thead><tr><th>Error text</th><th>Use this link</th><th>Response</th><th>Optional plan</th></tr></thead>
          <tbody>
            ${UPLOAD_ERROR_CHEATSHEET.map((item) => `<tr data-upload-error-row data-upload-error-text="${escapeHtml(item.errorText)}" data-upload-error-format="${escapeHtml(item.format)}" data-upload-error-target="${escapeHtml(item.target)}" data-upload-error-response="${escapeHtml(item.response)}"><td>${escapeHtml(item.errorText)}</td><td><a href="/${escapeHtml(item.landingPath)}/">${escapeHtml(item.format)} ${escapeHtml(item.target)}</a></td><td>${escapeHtml(item.response)}</td><td><a class="button secondary table-action" data-upload-error-invoice-request data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="#upload-error-quick-request">Request $9 invoice link</a><br><a class="table-secondary-link" data-upload-error-fix-plan data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="${escapeHtml(rowInvoiceRequestHref(item))}" target="_blank" rel="noreferrer">Open public-safe $9 invoice request</a></td></tr>`).join("\n")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Copy block for directories and community replies</h2>
        <p>PrintableTools Lab has a free upload error cheatsheet for common file rejections: PDF under 1MB or 500KB, image under 2MB or 500KB, photo under 100KB, JPG under 200KB, PNG screenshot too large, invalid JPG/PNG file type, 600 x 600 image dimensions, PDF not accepted JPG required, resume PDF too large, and email attachment too large.</p>
        <p><a class="button" href="/upload-limit-fixer/">Open upload limit fixer</a> <a class="button secondary" href="/free-pdf-tools/">Browse all free file tools</a></p>
      </section>
      <section class="shell section" id="service-request">
        <h2>Still blocked? Get a $9 upload fix plan.</h2>
        <p>Use this when your portal has a mixed rule, repeated rejection, strict deadline, or unclear error message. Send only public-safe details; do not upload the actual file.</p>
        ${uploadLimitFixPlanInlineLeadFormHtml({
          pathName: "/upload-error-cheatsheet/",
          utmSource: "upload-error-cheatsheet",
          utmMedium: "site",
          utmCampaign: "upload_error_cheatsheet_fix_plan",
          utmContent: "cheatsheet-inline",
          requestSummary: fixPlanSummary,
          className: "upload-limit-fix-plan-micro-lead-form upload-error-cheatsheet-fix-plan-form",
          submitLabel: "Request $9 invoice link",
          primaryInvoiceRequest: true,
          oneFieldInvoiceRequest: true,
        })}
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
      ${serviceLeadFormHtml({
        serviceType: "local-seller-starter-kit",
        title: "Request the checkout link",
        cta: "Send checkout request",
        intro: "Send a reply contact and one public-safe note. The kit remains a request path until a real external checkout link is available.",
        placeholder: "I want the starter kit for a market table, pop-up, service offer, or first local product launch.",
        pathName: product.slug,
      })}
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

function invoiceFollowupHeroRequestSummary(service = INVOICE_FOLLOWUP_COPY_PACK_SERVICE) {
  if (service.id !== INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id) return "";
  return "I need a $19 invoice follow-up copy pack for one workflow: polite reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice wording. No private invoice numbers, client names, bank details, tax IDs, legal dispute details, or customer lists included.";
}

function paidServiceHtml(service, options = {}) {
  const checkoutConfigured = Boolean(service.checkoutUrl);
  const emailUrl = serviceRequestEmailUrl(service);
  const heroRequestSummary = options.formDefaultSummary || invoiceFollowupHeroRequestSummary(service) || (service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id ? uploadLimitFixPlanRequestSummary(service) : "");
  const isUploadLimitFixPlan = service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id;
  const publicFitCheckUrl = serviceLeadFallbackUrl({
    serviceType: service.id,
    pathName: service.slug,
    requestSummary: heroRequestSummary,
  });
  const publicInvoiceRequestUrl = serviceInvoiceRequestUrl({
    serviceType: service.id,
    pathName: service.slug,
    requestSummary: heroRequestSummary,
  });
  const publicServiceFallbackUrl = isUploadLimitFixPlan ? publicInvoiceRequestUrl : publicFitCheckUrl;
  const publicServiceFallbackEvent = isUploadLimitFixPlan ? "service_invoice_request" : "service_request_intent";
  const publicServiceFallbackLabel = isUploadLimitFixPlan ? `Open public-safe $${service.priceUsd} invoice request` : "Open public-safe request";
  const primaryServiceUrl = checkoutConfigured ? service.checkoutUrl : isUploadLimitFixPlan ? "#invoice-request" : "#service-request";
  const primaryServiceText = checkoutConfigured ? `Buy for $${service.priceUsd}` : isUploadLimitFixPlan ? "Request $9 invoice link" : "Request free fit check";
  const primaryServiceEvent = checkoutConfigured ? "service_checkout_click" : isUploadLimitFixPlan ? "service_invoice_request" : "service_request_intent";
  const primaryServiceInvoiceJump = !checkoutConfigured && isUploadLimitFixPlan ? " data-service-invoice-jump" : "";
  const orderAssets = [
    ["Request brief", `/${service.publicRequestPath}`],
    ["Payment-before-work reply", `/${service.publicPaymentReplyPath}`],
    ["Fulfillment checklist", `/${service.publicFulfillmentChecklistPath}`],
    ["Order pipeline JSON", `/${service.publicOrderPipelinePath}`],
    ["Sample delivery ZIP", `/${service.publicSampleDeliveryPath}`],
    ["Delivery input example", `/${service.publicDeliveryInputExamplePath}`],
    ["Sample delivery report", `/${service.publicDeliveryReportPath}`],
  ];
  const actions = [
    `<a class="button" data-service-checkout${primaryServiceInvoiceJump} data-track-event="${escapeHtml(primaryServiceEvent)}" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(primaryServiceUrl)}">${escapeHtml(primaryServiceText)}</a>`,
    service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id || service.id === INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id ? `<a class="button secondary" data-track-event="service_invoice_request" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(publicInvoiceRequestUrl)}" target="_blank" rel="noreferrer">Request $${service.priceUsd} invoice link</a>` : "",
    `<a class="button secondary" data-service-lead-fallback-link data-track-event="${escapeHtml(publicServiceFallbackEvent)}" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(publicServiceFallbackUrl)}" target="_blank" rel="noreferrer">${escapeHtml(publicServiceFallbackLabel)}</a>`,
    options.secondaryHref ? `<a class="button secondary" href="${escapeHtml(options.secondaryHref)}">${escapeHtml(options.secondaryText || "Open related free tool")}</a>` : "",
    `<a class="button secondary" href="/${escapeHtml(service.publicRequestPath)}" download>Download request brief</a>`,
    emailUrl ? `<a class="button ghost" data-track-event="service_request_intent" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(emailUrl)}">Email service request</a>` : "",
    `<a class="button ghost" href="/${escapeHtml(service.publicOrderPipelinePath)}">Open order pipeline</a>`,
  ].filter(Boolean).join("\n          ");
  return `
      <section class="shell page-title section product-hero">
        <a href="${escapeHtml(options.crumbHref || "/free-pdf-tools/")}">${escapeHtml(options.crumb || "Free tools")}</a>
        <h1>${escapeHtml(service.headline)}</h1>
        <p>${escapeHtml(service.description)}</p>
        <div class="hero-actions">
          ${actions}
        </div>
        <p class="notice">${checkoutConfigured ? "Checkout is configured through an external payment provider. Revenue is still proven only after that provider shows a paid or settled order." : "Manual checkout pending: this page captures fit-check requests only. No payment is collected here until a real external checkout or invoice link is sent and paid."}</p>
        <div class="hero-proof" aria-label="Service readiness">
          <div class="proof-tile"><strong>$${service.priceUsd}</strong><span>service price</span></div>
          <div class="proof-tile"><strong>${service.deliverables.length}</strong><span>deliverables</span></div>
          <div class="proof-tile"><strong>external</strong><span>payment only</span></div>
        </div>
      </section>
      ${service.id === INVOICE_FOLLOWUP_COPY_PACK_SERVICE.id ? `<section class="shell section service-micro-intent-section">
        <div class="grid-2">
          <div>
            <h2>Send the shortest $19 request</h2>
            <p>Use this if you already know you want the sequence. Add only a reply contact; the public-safe request is already written.</p>
          </div>
          ${invoiceFollowupInlineLeadFormHtml({
            pathName: service.slug,
            utmSource: "service-page",
            utmContent: "service-page-micro",
            submitLabel: "Send $19 sequence request",
            className: "invoice-micro-lead-form",
            compact: true,
            requestSummary: invoiceFollowupHeroRequestSummary(service),
          })}
        </div>
      </section>` : service.id === UPLOAD_LIMIT_FIX_PLAN_SERVICE.id ? `<section class="shell section service-micro-intent-section" id="invoice-request">
        <div class="grid-2">
          <div>
            <h2>Request the $9 invoice link in 30 seconds</h2>
            <p>Use this if the free chooser is not enough and you want the paid path. Add where the external $9 invoice link should go; the public-safe request already says no file upload.</p>
          </div>
          ${uploadLimitFixPlanInlineLeadFormHtml({
            pathName: service.slug,
            utmSource: "service-page",
            utmContent: "service-page-invoice",
            submitLabel: "Request $9 invoice link",
            className: "upload-limit-fix-plan-micro-lead-form",
            compact: true,
            primaryInvoiceRequest: true,
            requestSummary: heroRequestSummary,
          })}
        </div>
      </section>` : ""}
      ${serviceLeadFormHtml({
        serviceType: service.id,
        title: options.formTitle || "Request a free fit check",
        cta: options.formCta || "Send free fit check",
        intro: options.formIntro || `Send a reply contact and one public-safe brief. Fit is checked manually; if it is useful, the $${service.priceUsd} service starts only through an external checkout or invoice.`,
        placeholder: options.formPlaceholder || "Tell us what you need without private payment, identity, customer, or file details.",
        pathName: service.slug,
        defaultSummary: heroRequestSummary,
      })}
      <section class="shell section">
        <h2>What gets delivered</h2>
        <div class="grid-3">
          ${service.deliverables.map((item) => `<article class="panel"><h3>${escapeHtml(item)}</h3><p>Delivered as editable copy the buyer can review before using.</p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Buyer details needed</h2>
        <ul>${service.buyerInputs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="shell section">
        <h2>Order pipeline assets</h2>
        <p>Use these when a request arrives: confirm fit, send a real external checkout link, wait for paid_order_verified, then build and deliver the service.</p>
        <table class="event-table">
          <thead><tr><th>Asset</th><th>URL</th></tr></thead>
          <tbody>${orderAssets.map(([label, url]) => `<tr><th>${escapeHtml(label)}</th><td><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></td></tr>`).join("\n")}</tbody>
        </table>
      </section>
      ${serviceRequestBuilderHtml(service)}
      <section class="shell section">
        <h2>Risk controls</h2>
        <ul>${service.riskControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p><strong>Money gate:</strong> ${escapeHtml(service.successGate)}</p>
        ${jsonLdHtml(serviceSchema(service))}
      </section>`;
}

function customLocalPrintPackServiceHtml() {
  const service = CUSTOM_LOCAL_PRINT_PACK_SERVICE;
  const checkoutConfigured = Boolean(service.checkoutUrl);
  const emailUrl = serviceRequestEmailUrl(service);
  const pipeline = serviceOrderPipeline(service);
  const primaryServiceUrl = checkoutConfigured ? service.checkoutUrl : "#service-request";
  const primaryServiceText = checkoutConfigured ? `Buy setup for $${service.priceUsd}` : "Request free fit check";
  const primaryServiceEvent = checkoutConfigured ? "service_checkout_click" : "service_request_intent";
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
    `<a class="button" data-service-checkout data-track-event="${escapeHtml(primaryServiceEvent)}" data-track-tool="${escapeHtml(service.id)}" href="${escapeHtml(primaryServiceUrl)}">${escapeHtml(primaryServiceText)}</a>`,
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
        <p class="notice" data-service-checkout-status>${checkoutConfigured ? "Checkout is configured through the external payment provider linked above. Revenue is still proven only after that provider shows a paid or settled order." : "Manual service checkout pending: this page captures buyer intent only. No payment is collected here until a real Gumroad, Payhip, Ko-fi, Stripe, or invoice checkout link is sent and paid."}</p>
        <div class="hero-proof" aria-label="Service readiness">
          <div class="proof-tile"><strong>$${service.priceUsd}</strong><span>setup price</span></div>
          <div class="proof-tile"><strong>${service.deliverables.length}</strong><span>deliverables</span></div>
          <div class="proof-tile"><strong>2 days</strong><span>target turnaround</span></div>
        </div>
      </section>
      ${serviceLeadFormHtml({
        serviceType: "custom-local-print-pack",
        title: "Request a free setup fit check",
        cta: "Send free fit check",
        intro: `Send a reply contact and one public-safe brief. Fit is checked manually; if it is useful, the $${service.priceUsd} setup starts only through an external checkout or invoice.`,
        placeholder: "I sell handmade candles at a Saturday market. I need a quick fit check for price tags, QR sign wording, a flyer line, and a pickup note before next weekend.",
        pathName: service.slug,
      })}
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
      </section>
      <script>
        (function () {
          var config = window.PTL_CONFIG || {};
          var serviceId = "${escapeHtml(service.id)}";
          var checkoutByService = {
            "custom-local-print-pack": config.customPrintPackCheckoutUrl || config.serviceCheckoutUrl || "",
            "invoice-followup-copy-pack": config.invoiceFollowupCheckoutUrl || "",
            "upload-limit-fix-plan": config.uploadLimitFixPlanCheckoutUrl || ""
          };
          var checkoutUrl = checkoutByService[serviceId] || "";
          var button = document.querySelector("[data-service-checkout]");
          var status = document.querySelector("[data-service-checkout-status]");
          if (!checkoutUrl || !button) return;
          button.href = checkoutUrl;
          button.textContent = "Buy for $${service.priceUsd}";
          button.dataset.trackEvent = "service_checkout_click";
          if (status) status.textContent = "Checkout is configured through the external payment provider linked above. Revenue is still proven only after that provider shows a paid or settled order.";
        }());
      </script>`;
}

function marketTablePrintAuditHtml() {
  const audit = MARKET_TABLE_PRINT_AUDIT;
  const requestUrl = marketTableAuditRequestUrl(audit);
  const upgradeCheckoutUrl = configuredAuditUpgradeCheckoutUrl();
  const upgradeUrl = upgradeCheckoutUrl || `/${CUSTOM_LOCAL_PRINT_PACK_SERVICE.slug}/`;
  const upgradeEvent = upgradeCheckoutUrl ? "service_checkout_click" : "service_request_intent";
  const upgradeText = upgradeCheckoutUrl ? `Buy $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup` : `See the $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} done-for-you setup`;
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
      ${serviceLeadFormHtml({
        serviceType: "market-table-print-audit",
        title: "Request the free audit",
        cta: "Send audit request",
        intro: "Send a public-safe snapshot of what you sell and what feels unfinished. The audit is free; the optional setup stays separate.",
        placeholder: "I sell cookies at a school event. Prices are not clear and I need a QR/contact sign checked before printing.",
        pathName: audit.slug,
      })}
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
        <p><a class="button" data-audit-upgrade-checkout data-track-event="${escapeHtml(upgradeEvent)}" data-track-tool="${escapeHtml(CUSTOM_LOCAL_PRINT_PACK_SERVICE.id)}" href="${escapeHtml(upgradeUrl)}">${escapeHtml(upgradeText)}</a></p>
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
      </section>
      <script>
        (function () {
          var config = window.PTL_CONFIG || {};
          var checkoutUrl = config.auditUpgradeCheckoutUrl || config.customPrintPackCheckoutUrl || config.serviceCheckoutUrl || "";
          var button = document.querySelector("[data-audit-upgrade-checkout]");
          if (!checkoutUrl || !button) return;
          button.href = checkoutUrl;
          button.textContent = "Buy $${CUSTOM_LOCAL_PRINT_PACK_SERVICE.priceUsd} setup";
          button.dataset.trackEvent = "service_checkout_click";
        }());
      </script>`;
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
      url: service.checkoutUrl || siteUrl(service.slug),
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
  const url = new URL(base);
  url.searchParams.set("utm_source", post.channel);
  url.searchParams.set("utm_medium", "organic");
  if (post.campaign) url.searchParams.set("utm_campaign", post.campaign);
  if (post.content) url.searchParams.set("utm_content", post.content);
  return url.toString();
}

function landingPageHtml(page) {
  const primaryToolPath = cleanToolPath(page.primaryTool);
  const tool = tools.find((item) => item.path === primaryToolPath);
  const primaryToolHref = toolHref(page.primaryTool, page.primaryToolQuery);
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
  const uploadFixMicroSummary = page.uploadErrorMatcher
    ? `I need a $9 Upload Limit Fix Plan for the ${page.headline} workflow: best free tool, target settings, fallback steps, and a review checklist. No file upload, private document, ID photo, resume, portal login, bank details, tax IDs, or private account data included.`
    : "";
  const uploadLimitMicroLeadHtml = page.uploadErrorMatcher ? `
      <section class="shell section service-micro-intent-section" id="invoice-request">
        <div class="grid-2">
          <div>
            <h2>Need a $9 upload fix plan?</h2>
            <p>Request the $9 invoice link in 30 seconds if the free tool is not enough. Add where the external $9 invoice link should go; the public-safe request already says no file upload.</p>
          </div>
          ${uploadLimitFixPlanInlineLeadFormHtml({
            pathName: page.path,
            utmSource: "landing-page",
            utmContent: `${page.path}-invoice`,
            submitLabel: "Request $9 invoice link",
            className: "upload-limit-fix-plan-micro-lead-form",
            compact: true,
            primaryInvoiceRequest: true,
            requestSummary: uploadFixMicroSummary,
          })}
        </div>
      </section>` : "";
  const serviceLeadHtml = page.serviceLead ? `\n${serviceLeadFormHtml({ ...page.serviceLead, pathName: page.path })}` : "";
  const serviceMicroLeadHtml = page.serviceLead?.serviceType === "invoice-followup-copy-pack" ? `
      <section class="shell section service-micro-intent-section">
        <div class="grid-2">
          <div>
            <h2>Send a 30-second $19 sequence request</h2>
            <p>Use this if the free draft is not enough. Add one reply contact; the invoice follow-up request is already written from this page.</p>
          </div>
          ${invoiceFollowupInlineLeadFormHtml({
            pathName: page.path,
            utmSource: "landing-page",
            utmContent: `${page.path}-micro`,
            submitLabel: "Send $19 sequence request",
            className: "invoice-micro-lead-form",
            compact: true,
            requestSummary: page.serviceLead.defaultSummary || "",
          })}
        </div>
      </section>` : "";
  const serviceLeadIsUploadInvoice = page.serviceLead?.serviceType === "upload-limit-fix-plan";
  const servicePublicRequestHref = page.serviceLead ? (serviceLeadIsUploadInvoice ? serviceInvoiceRequestUrl : serviceLeadFallbackUrl)({
    serviceType: page.serviceLead.serviceType,
    pathName: page.path,
    requestSummary: page.serviceLead.defaultSummary || "",
    utmSource: "landing-page",
    utmMedium: "site",
    utmCampaign: page.serviceLead.utmCampaign || "service_request",
    utmContent: `${page.path}-public-request`,
  }) : "";
  const servicePublicRequestEvent = serviceLeadIsUploadInvoice ? "service_invoice_request" : page.serviceLead ? serviceLeadTrackEvent(page.serviceLead.serviceType) : "";
  const servicePublicRequestLabel = serviceLeadIsUploadInvoice ? "Open public-safe $9 invoice request" : "Open public-safe request";
  const uploadFixPublicRequestHref = page.uploadErrorMatcher ? serviceInvoiceRequestUrl({
    serviceType: "upload-limit-fix-plan",
    pathName: page.path,
    requestSummary: uploadFixMicroSummary,
    utmSource: "landing-page",
    utmMedium: "site",
    utmCampaign: "upload_limit_fix_plan",
    utmContent: `${page.path}-hero-invoice`,
  }) : "";
  const serviceInvoiceRequestText = page.serviceLead?.serviceType === "upload-limit-fix-plan"
    ? "Get a $9 upload fix plan"
    : page.serviceLead?.serviceType === "invoice-followup-copy-pack"
      ? "Request $19 invoice link"
      : "";
  const serviceInvoiceRequestHref = page.serviceLead?.serviceType === "upload-limit-fix-plan" && page.uploadErrorMatcher ? "#invoice-request" : "#service-request";
  const secondaryActionHtml = page.uploadErrorMatcher
    ? `<a class="button secondary" data-service-invoice-jump data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="#invoice-request">Get a $9 upload fix plan</a> <a class="button ghost" data-service-lead-fallback-link data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="${escapeHtml(uploadFixPublicRequestHref)}" target="_blank" rel="noreferrer">Open public-safe $9 invoice request</a>`
    : page.serviceLead
    ? page.serviceLead.serviceType === "upload-limit-fix-plan"
      ? `${serviceInvoiceRequestText ? `<a class="button secondary" data-service-invoice-jump data-track-event="service_invoice_request" data-track-tool="${escapeHtml(serviceLeadTrackTool(page.serviceLead.serviceType))}" href="${escapeHtml(serviceInvoiceRequestHref)}">${escapeHtml(serviceInvoiceRequestText)}</a> ` : ""}<a class="button ghost" data-service-lead-fallback-link data-track-event="${escapeHtml(servicePublicRequestEvent)}" data-track-tool="${escapeHtml(serviceLeadTrackTool(page.serviceLead.serviceType))}" href="${escapeHtml(servicePublicRequestHref)}" target="_blank" rel="noreferrer">${escapeHtml(servicePublicRequestLabel)}</a>`
      : `${serviceInvoiceRequestText ? `<a class="button secondary" data-service-invoice-jump data-track-event="service_invoice_request" data-track-tool="${escapeHtml(serviceLeadTrackTool(page.serviceLead.serviceType))}" href="${escapeHtml(serviceInvoiceRequestHref)}">${escapeHtml(serviceInvoiceRequestText)}</a> ` : ""}<a class="button secondary" data-track-event="${escapeHtml(serviceLeadTrackEvent(page.serviceLead.serviceType))}" data-track-tool="${escapeHtml(serviceLeadTrackTool(page.serviceLead.serviceType))}" href="#service-request">${escapeHtml(page.serviceLead.cta || "Send fit check")}</a> <a class="button ghost" data-service-lead-fallback-link data-track-event="${escapeHtml(servicePublicRequestEvent)}" data-track-tool="${escapeHtml(serviceLeadTrackTool(page.serviceLead.serviceType))}" href="${escapeHtml(servicePublicRequestHref)}" target="_blank" rel="noreferrer">${escapeHtml(servicePublicRequestLabel)}</a>`
    : `<a class="button secondary" href="/pdf-tool-finder/">Compare tools</a>`;
  return `
      <section class="shell page-title section">
        <a href="/free-pdf-tools/">Free file tools</a>
        <h1>${escapeHtml(page.headline)}</h1>
        <p>${escapeHtml(page.lead)}</p>
        <p><a class="button" href="${primaryToolHref}">Open ${escapeHtml(tool.shortTitle || tool.title)}</a> ${secondaryActionHtml}</p>
      </section>
      <section class="shell section">
        <h2>Why this matches the search</h2>
        <div class="grid-3">
          <article class="panel"><h3>Intent</h3><p>${escapeHtml(page.intent)}</p></article>
          <article class="panel"><h3>No signup</h3><p>The free workflow starts in the browser and does not require an account before file export.</p></article>
          <article class="panel"><h3>Ad-safe</h3><p>Downloads are not gated behind ad interactions or ad impressions. Ads remain disabled until policy review and search visibility are ready.</p></article>
        </div>
      </section>
${serviceMicroLeadHtml}${sectionHtml}${uploadLimitMicroLeadHtml}${uploadMatcherHtml}${targetLinksHtml}${uploadShortcutsHtml}${serviceLeadHtml}
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

function toolHref(toolPath, extraQuery = "") {
  const [pathname, query] = String(toolPath).split("?");
  const finalQuery = extraQuery || query || "";
  return `/${pathname}/${finalQuery ? `?${finalQuery}` : ""}`;
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
    "invoice-followup-email": {
      useCases: [
        { title: "Polite reminder", text: "Draft a short message after an invoice has been sent but before it is overdue." },
        { title: "First overdue note", text: "Use firmer wording that still asks for an update instead of making legal or collections claims." },
        { title: "Paid thank-you", text: "Send a brief thank-you after payment while keeping the client relationship warm." },
      ],
      privacy: "The wording is generated in your browser. Use generic client labels and keep invoice numbers, private client data, bank details, card data, tax IDs, and legal dispute details out of the fields.",
      limit: "This is editable communication copy only, not legal, tax, accounting, financial, or debt-collection advice.",
      faq: [
        { q: "Can I use this for overdue invoices?", a: "Yes, for a first gentle follow-up. Review the wording yourself and get professional advice for legal, collections, tax, accounting, or financial questions." },
        { q: "Does this send the email?", a: "No. It creates copy you can review and paste into your own email, invoice portal, or message thread." },
        { q: "Can I get a custom sequence?", a: "Yes. The optional Invoice Follow-up Copy Pack is a separate $19 fit-check path for one workflow after a real external payment is verified." },
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
        <div class="grid-2 service-micro-intent-section">
          <div>
            <p class="eyebrow">Optional paid help</p>
            <h3>Still blocked? Get a $9 upload fix plan.</h3>
            <p>Request the external $9 invoice link after fit is confirmed. The note is already public-safe; add only where the invoice link should go.</p>
            <p><a class="button secondary" data-track-event="service_invoice_request" data-track-tool="upload-limit-fix-plan" href="/upload-limit-fix-plan/?utm_source=upload-limit&utm_medium=site&utm_campaign=upload_limit_fix_plan&utm_content=shortcuts#invoice-request">Open full $9 invoice request</a></p>
          </div>
          ${uploadLimitFixPlanInlineLeadFormHtml({
            pathName: "/upload-limit-fixer/",
            utmSource: "upload-limit",
            utmContent: "shortcut-inline",
            submitLabel: "Request $9 invoice link",
            className: "upload-limit-fix-plan-micro-lead-form",
            compact: true,
            primaryInvoiceRequest: true,
          })}
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
                <div class="actions">
                  <a class="button" data-upload-limit-tool-link href="${escapeHtml(match.href)}" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(match.trackTool)}">${escapeHtml(match.label)}</a>
                  <a class="button secondary" data-upload-fix-plan-jump data-track-event="service_request_intent" data-track-tool="upload-limit-fix-plan" href="#service-request">Need a $9 fix plan?</a>
                </div>
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

module.exports = { routes, renderRoute, siteUrl, tools, guides, keywordClusters, landingPages, SITE_SUMMARY, DIGITAL_PRODUCTS, LOCAL_SELLER_STARTER_KIT, CUSTOM_LOCAL_PRINT_PACK_SERVICE, INVOICE_FOLLOWUP_COPY_PACK_SERVICE, UPLOAD_LIMIT_FIX_PLAN_SERVICE, PAID_SERVICES, MARKET_TABLE_PRINT_AUDIT, SERVICE_SALES_PACK, productCheckoutRequestUrl, productCheckoutRequestCopy, productCheckoutEmailUrl, serviceRequestUrl, serviceRequestCopy, serviceRequestEmailUrl, marketTableAuditRequestUrl, marketTableAuditRequestCopy, marketTableAuditChecklist, servicePaymentReplyCopy, serviceFulfillmentChecklistCopy, serviceOrderPipeline, serviceOutreachQueue, serviceOutreachBatchCopy, ZERO_DOMAIN_GAME_EXPERIMENT, ZERO_DOMAIN_GAME_EXPERIMENTS, PLATFORM_SUBMIT_QUEUE, ZERO_DOMAIN_PLATFORM_STRATEGY, PLATFORM_OUTREACH_TRACKER, PLATFORM_SUBMIT_COCKPIT, PORTAL_SUBMISSION_PACK, ZERO_COST_MONETIZATION_MAP, HIGH_INTENT_TOOL_PATHS, HIGH_INTENT_LANDING_PATHS, SHARE_KIT_FEATURED_LINKS, SHARE_KIT_POSTS, SHARE_KIT_RULES, ORGANIC_PUSH_TASKS, UPLOAD_ERROR_CHEATSHEET, CAMPAIGN_VIDEO_ASSETS, GIST_DISCOVERY, ISSUE_DISCOVERY, SPONSOR_PLACEMENTS, SPONSOR_DEALS, SPONSOR_OUTREACH_TARGETS, SPONSOR_OUTREACH_TEMPLATES, SPONSOR_VERTICALS, SPONSOR_CALL_ACTIONS, SPONSOR_DISCOVERY_LINKS, sponsorPublicReplyUrl, sponsorExternalDiscoveryProof, sponsorMediaKitPayload, sponsorCallPayload, sponsorOpportunityPayload, sponsorDealRoomPayload };
