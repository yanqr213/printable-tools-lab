const crypto = require("crypto");
const { strToU8, zipSync } = require("fflate");

function serviceDeliveryInputExample(service) {
  return {
    serviceId: service.id,
    orderId: "sample-market-table-001",
    paymentStatus: "sample_only_not_revenue",
    paidOrderVerified: false,
    businessName: "Sample Market Table",
    businessType: "handmade soaps, candles, and small gift bundles",
    eventName: "Saturday craft market",
    style: "clean, friendly, practical",
    qrTarget: "https://example.com/sample-order-page",
    publicContact: "@samplemarkettable",
    preferredOffer: "Two small items for $10",
    needByDate: "2026-06-10",
    countryOrRegion: "US",
    avoidClaims: [
      "medical, skincare, or guaranteed result claims",
      "discount promises not approved by the seller"
    ],
    items: [
      { name: "Lavender soap bar", price: "$6", sku: "SOAP-LAV", note: "Two for $10" },
      { name: "Mini soy candle", price: "$9", sku: "CANDLE-MINI", note: "Best seller" },
      { name: "Gift bundle", price: "$18", sku: "BUNDLE-GIFT", note: "Includes soap and candle" }
    ],
    deliveryNotes: "Sample only. A real delivery should be generated only after paid_order_verified.",
    buyerReviewRequired: true
  };
}

function validateServiceDeliveryInput(input, options = {}) {
  const errors = [];
  const warnings = [];
  const sample = Boolean(options.sample);
  const value = input && typeof input === "object" ? input : {};
  if (!value.serviceId) errors.push("serviceId is required.");
  if (!value.businessName) errors.push("businessName is required.");
  if (!value.qrTarget) errors.push("qrTarget is required.");
  if (!Array.isArray(value.items) || value.items.length < 1) errors.push("At least one item is required.");
  if (Array.isArray(value.items) && value.items.length > 12) errors.push("The $29 scope allows up to 12 items/services.");
  if (!sample && value.paymentStatus !== "paid_order_verified" && value.paidOrderVerified !== true) {
    errors.push("Live delivery generation requires paymentStatus=paid_order_verified or paidOrderVerified=true.");
  }
  if (looksSensitive(value)) {
    errors.push("Input appears to contain private payment, tax, identity, password, or credential details. Remove them before generating.");
  }
  for (const item of Array.isArray(value.items) ? value.items : []) {
    if (!item || !item.name || !item.price) errors.push("Every item must include name and price.");
  }
  if (!value.buyerReviewRequired) warnings.push("Set buyerReviewRequired=true so the buyer confirms copy, prices, and QR target before printing.");
  return { ok: errors.length === 0, errors, warnings };
}

function serviceDeliveryFiles(input, options = {}) {
  const validation = validateServiceDeliveryInput(input, options);
  if (!validation.ok) {
    const error = new Error(validation.errors.join(" "));
    error.validation = validation;
    throw error;
  }

  const orderId = cleanId(input.orderId || input.businessName || "custom-local-print-pack-order");
  const prefix = options.sample ? "custom-local-print-pack-sample" : `custom-local-print-pack-${orderId}`;
  const items = normalizeItems(input.items);
  const businessName = cleanText(input.businessName);
  const businessType = cleanText(input.businessType || "local seller or small service");
  const style = cleanText(input.style || "clean and practical");
  const eventName = cleanText(input.eventName || "local market or pickup flow");
  const qrTarget = cleanText(input.qrTarget);
  const publicContact = cleanText(input.publicContact || qrTarget);
  const preferredOffer = cleanText(input.preferredOffer || offerFromItems(items));
  const avoidClaims = Array.isArray(input.avoidClaims) ? input.avoidClaims.map(cleanText).filter(Boolean) : [];
  const reviewNote = "Buyer must review all copy, prices, QR targets, dates, claims, and local compliance before printing or publishing.";
  const revenueRule = options.sample
    ? "This public sample is not revenue. Real revenue is counted only after an external provider shows a paid order, payout balance, or settled payment."
    : "Revenue for this delivery can be counted only if the matching external payment provider record shows paid_order_verified.";

  return {
    [`${prefix}/README.md`]: [
      `# ${businessName} - Custom Local Print Pack`,
      "",
      `Prepared style: ${style}`,
      `Use case: ${businessType} at ${eventName}`,
      `QR/contact target: ${qrTarget}`,
      "",
      "## Included files",
      "",
      "- price-tags.csv",
      "- flyer-copy.md",
      "- qr-sign-copy.md",
      "- coupon-ideas.csv",
      "- packing-or-pickup-notes.csv",
      "- launch-checklist.md",
      "- review-before-printing.md",
      "- service-order-status.json",
      "",
      reviewNote,
      "",
      revenueRule,
    ].join("\n"),
    [`${prefix}/price-tags.csv`]: csv([
      ["item", "price", "sku", "note", "display_line"],
      ...items.map((item) => [item.name, item.price, item.sku, item.note, `${item.name} - ${item.price}`]),
    ]),
    [`${prefix}/flyer-copy.md`]: [
      `# ${businessName}`,
      "",
      `## Simple flyer headline`,
      `${businessName}: ${businessType} for ${eventName}`,
      "",
      "## Short intro",
      `${businessName} is preparing a simple ${style} table setup with clear prices, easy contact details, and a small starter offer for shoppers who want to take action today.`,
      "",
      "## Feature bullets",
      ...items.slice(0, 6).map((item) => `- ${item.name}: ${item.price}${item.note ? ` (${item.note})` : ""}`),
      "",
      "## Call to action",
      `Scan or contact ${publicContact} to ask what is available today.`,
      "",
      "## Print reminder",
      reviewNote,
    ].join("\n"),
    [`${prefix}/qr-sign-copy.md`]: [
      `# QR Sign Copy`,
      "",
      `Headline: Scan for ${businessName}`,
      `Subline: Prices, pickup details, or current availability`,
      `QR target to test before printing: ${qrTarget}`,
      `Backup contact text: ${publicContact}`,
      "",
      "Small-print reminder: Please confirm the QR opens the intended public page or contact method before printing.",
    ].join("\n"),
    [`${prefix}/coupon-ideas.csv`]: csv([
      ["offer_name", "suggested_copy", "fine_print_to_review"],
      ["Starter bundle", preferredOffer, "Seller must confirm margin, expiration, and availability before printing."],
      ["Market-day thank you", "Show this card on your next visit for a small thank-you bonus.", "Use only if the seller can honor it consistently."],
      ["QR follow-up", "Scan the QR code for current items, pickup details, or restock notes.", "Do not promise restocks or delivery windows that are not confirmed."],
    ]),
    [`${prefix}/packing-or-pickup-notes.csv`]: csv([
      ["item", "packing_or_pickup_note", "review_status"],
      ...items.map((item) => [item.name, `${item.name}: check quantity, price, and any pickup note before handoff.`, "buyer_review_required"]),
    ]),
    [`${prefix}/launch-checklist.md`]: [
      "# One-page Launch Checklist",
      "",
      "- Review every price and SKU.",
      "- Test the QR code on a phone that is not already logged into the seller account.",
      "- Print one draft page before printing a full batch.",
      "- Place price tags beside the matching products or service rows.",
      "- Keep one flyer near checkout or the front of the table.",
      "- Keep coupon language simple and honor only offers the seller approves.",
      "- Save the final CSV and Markdown files for the next market or pickup window.",
      "- Track which sign or offer produces replies, scans, or sales.",
      "- Update stale prices before the next event.",
      "- Ask for one lightweight revision only if the change is within the original $29 scope.",
    ].join("\n"),
    [`${prefix}/review-before-printing.md`]: [
      "# Review Before Printing",
      "",
      reviewNote,
      "",
      "Do not treat this pack as legal, tax, accounting, medical, food-labeling, advertising-compliance, or financial advice.",
      "Remove any claim that the seller cannot verify or legally use.",
      "If the buyer sells regulated goods or services, they must adapt this starter copy with qualified local guidance.",
      "",
      avoidClaims.length ? "## Buyer-requested avoid list" : "## Buyer-requested avoid list",
      ...(avoidClaims.length ? avoidClaims.map((item) => `- ${item}`) : ["- No avoid list was provided."]),
    ].join("\n"),
    [`${prefix}/service-order-status.json`]: JSON.stringify({
      serviceId: input.serviceId,
      orderId,
      businessName,
      paymentStatus: input.paymentStatus || (options.sample ? "sample_only_not_revenue" : ""),
      paidOrderVerified: Boolean(input.paidOrderVerified),
      generatedAt: new Date().toISOString(),
      sample: Boolean(options.sample),
      itemCount: items.length,
      buyerReviewRequired: true,
      revenueRule,
    }, null, 2),
  };
}

function zipServiceDelivery(input, options = {}) {
  const files = serviceDeliveryFiles(input, options);
  return Buffer.from(zipSync(Object.fromEntries(Object.entries(files).map(([name, content]) => [name, strToU8(`${content}\n`)])), { level: 9 }));
}

function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function normalizeItems(items) {
  return items.slice(0, 12).map((item, index) => ({
    name: cleanText(item.name || `Item ${index + 1}`),
    price: cleanText(item.price || ""),
    sku: cleanText(item.sku || `ITEM-${String(index + 1).padStart(3, "0")}`),
    note: cleanText(item.note || ""),
  }));
}

function offerFromItems(items) {
  if (items.length >= 2) return `Bundle ${items[0].name} + ${items[1].name} for a simple market-day offer`;
  return `Ask about today's ${items[0]?.name || "featured item"} offer`;
}

function csv(rows) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value) {
  const text = cleanText(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function cleanText(value) {
  return String(value || "").replace(/\r/g, "").trim();
}

function cleanId(value) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "order";
}

function looksSensitive(value) {
  const text = JSON.stringify(value || {}).toLowerCase();
  return [
    /\bcard number\b/,
    /\bcredit card\b/,
    /\bbank account\b/,
    /\brouting number\b/,
    /\bsocial security\b/,
    /\bssn\b/,
    /\bpassport number\b/,
    /\bdriver'?s? license\b/,
    /\btax id\b/,
    /\bpassword\b/,
    /\bsecret key\b/,
    /\bprivate key\b/,
    /\bapi key\b/,
    /\bpayout account\b/,
  ].some((pattern) => pattern.test(text));
}

module.exports = {
  serviceDeliveryInputExample,
  validateServiceDeliveryInput,
  serviceDeliveryFiles,
  zipServiceDelivery,
  sha256Buffer,
};
