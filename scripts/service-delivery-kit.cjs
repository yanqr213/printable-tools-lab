const crypto = require("crypto");
const { strToU8, zipSync } = require("fflate");

function serviceDeliveryInputExample(service) {
  if (service.id === "upload-limit-fix-plan") {
    return {
      serviceId: service.id,
      orderId: "sample-upload-limit-fix-001",
      paymentStatus: "sample_only_not_revenue",
      paidOrderVerified: false,
      businessName: "Sample Upload Limit Case",
      uploadErrorText: "PDF must be less than 1 MB",
      fileType: "PDF resume",
      targetRule: "PDF under 1MB, PDF format required",
      priorAttempts: "Tried one lower quality export; still too large",
      broadUseCase: "job application portal",
      needByDate: "2026-06-10",
      publicContact: "hello@example.com",
      deliveryNotes: "Sample only. A real delivery should be generated only after paid_order_verified.",
      buyerReviewRequired: true
    };
  }
  if (service.id === "invoice-followup-copy-pack") {
    return {
      serviceId: service.id,
      orderId: "sample-invoice-followup-001",
      paymentStatus: "sample_only_not_revenue",
      paidOrderVerified: false,
      businessName: "Sample Freelance Studio",
      invoiceStatus: "sent, due soon",
      preferredTone: "friendly, concise, professional",
      followupNeed: "one polite reminder now and one firmer overdue follow-up if payment is late",
      paymentWording: "Pay through the secure link already shared on the invoice",
      needByDate: "2026-06-10",
      publicContact: "hello@example.com",
      avoidClaims: [
        "legal threats",
        "late-fee language not already agreed",
        "tax or accounting advice"
      ],
      deliveryNotes: "Sample only. A real delivery should be generated only after paid_order_verified.",
      buyerReviewRequired: true
    };
  }
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
  const isUploadLimitFix = value.serviceId === "upload-limit-fix-plan";
  const isInvoiceFollowup = value.serviceId === "invoice-followup-copy-pack";
  if (isUploadLimitFix) {
    if (!value.uploadErrorText) errors.push("uploadErrorText is required for upload limit fix plans.");
    if (!value.fileType) errors.push("fileType is required for upload limit fix plans.");
    if (!value.targetRule) errors.push("targetRule is required for upload limit fix plans.");
  } else if (isInvoiceFollowup) {
    if (!value.invoiceStatus) errors.push("invoiceStatus is required for invoice follow-up copy.");
    if (!value.followupNeed) errors.push("followupNeed is required for invoice follow-up copy.");
  } else {
    if (!value.qrTarget) errors.push("qrTarget is required.");
    if (!Array.isArray(value.items) || value.items.length < 1) errors.push("At least one item is required.");
    if (Array.isArray(value.items) && value.items.length > 12) errors.push("The $29 scope allows up to 12 items/services.");
  }
  if (!sample && value.paymentStatus !== "paid_order_verified" && value.paidOrderVerified !== true) {
    errors.push("Live delivery generation requires paymentStatus=paid_order_verified or paidOrderVerified=true.");
  }
  if (looksSensitive(value)) {
    errors.push("Input appears to contain private payment, tax, identity, password, or credential details. Remove them before generating.");
  }
  if (!isInvoiceFollowup && !isUploadLimitFix) {
    for (const item of Array.isArray(value.items) ? value.items : []) {
      if (!item || !item.name || !item.price) errors.push("Every item must include name and price.");
    }
  }
  if (!value.buyerReviewRequired) warnings.push(isUploadLimitFix
    ? "Set buyerReviewRequired=true so the buyer confirms the output before uploading it to the destination site."
    : isInvoiceFollowup
      ? "Set buyerReviewRequired=true so the buyer confirms message accuracy, tone, and local rules before sending."
      : "Set buyerReviewRequired=true so the buyer confirms copy, prices, and QR target before printing.");
  return { ok: errors.length === 0, errors, warnings };
}

function serviceDeliveryFiles(input, options = {}) {
  const validation = validateServiceDeliveryInput(input, options);
  if (!validation.ok) {
    const error = new Error(validation.errors.join(" "));
    error.validation = validation;
    throw error;
  }

  if (input.serviceId === "invoice-followup-copy-pack") return invoiceFollowupDeliveryFiles(input, options);
  if (input.serviceId === "upload-limit-fix-plan") return uploadLimitFixPlanDeliveryFiles(input, options);

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

function invoiceFollowupDeliveryFiles(input, options = {}) {
  const validation = validateServiceDeliveryInput(input, options);
  if (!validation.ok) {
    const error = new Error(validation.errors.join(" "));
    error.validation = validation;
    throw error;
  }
  const orderId = cleanId(input.orderId || input.businessName || "invoice-followup-copy-pack-order");
  const prefix = options.sample ? "invoice-followup-copy-pack-sample" : `invoice-followup-copy-pack-${orderId}`;
  const businessName = cleanText(input.businessName);
  const invoiceStatus = cleanText(input.invoiceStatus || "sent");
  const preferredTone = cleanText(input.preferredTone || "friendly and concise");
  const followupNeed = cleanText(input.followupNeed || "polite invoice follow-up");
  const paymentWording = cleanText(input.paymentWording || "Please use the payment method listed on the invoice.");
  const needByDate = cleanText(input.needByDate || "");
  const avoidClaims = Array.isArray(input.avoidClaims) ? input.avoidClaims.map(cleanText).filter(Boolean) : [];
  const reviewNote = "Buyer must review every message for accuracy, tone, client relationship, and applicable local rules before sending.";
  const adviceRule = "This is editable communication copy only, not legal, tax, accounting, debt-collection, or financial advice.";
  const revenueRule = options.sample
    ? "This public sample is not revenue. Real revenue is counted only after an external provider shows a paid order, payout balance, or settled payment."
    : "Revenue for this delivery can be counted only if the matching external payment provider record shows paid_order_verified.";

  return {
    [`${prefix}/README.md`]: [
      `# ${businessName} - Invoice Follow-up Copy Pack`,
      "",
      `Invoice status: ${invoiceStatus}`,
      `Preferred tone: ${preferredTone}`,
      `Needed by: ${needByDate || "not specified"}`,
      "",
      "## Included files",
      "",
      "- polite-payment-reminder.md",
      "- due-today-note.md",
      "- first-overdue-follow-up.md",
      "- paid-thank-you.md",
      "- next-invoice-note.md",
      "- review-before-sending.md",
      "- service-order-status.json",
      "",
      reviewNote,
      adviceRule,
      "",
      revenueRule,
    ].join("\n"),
    [`${prefix}/polite-payment-reminder.md`]: [
      `Subject: Friendly reminder: invoice from ${businessName}`,
      "",
      "Hi [Client name],",
      "",
      `I hope you are doing well. I wanted to send a quick reminder about the invoice for [project/service]. ${paymentWording}`,
      "",
      "Please let me know if you need anything else from me to process it.",
      "",
      "Thanks,",
      `[${businessName}]`,
    ].join("\n"),
    [`${prefix}/due-today-note.md`]: [
      `Subject: Invoice due today - ${businessName}`,
      "",
      "Hi [Client name],",
      "",
      `Just a quick note that the invoice for [project/service] is due today. ${paymentWording}`,
      "",
      "Thank you for taking care of it.",
      "",
      `[${businessName}]`,
    ].join("\n"),
    [`${prefix}/first-overdue-follow-up.md`]: [
      `Subject: Follow-up on overdue invoice from ${businessName}`,
      "",
      "Hi [Client name],",
      "",
      "I am following up because the invoice for [project/service] now appears overdue on my side.",
      "",
      `${paymentWording} If payment has already been sent, please disregard this note or let me know so I can update my records.`,
      "",
      "Thanks,",
      `[${businessName}]`,
    ].join("\n"),
    [`${prefix}/paid-thank-you.md`]: [
      `Subject: Payment received - thank you`,
      "",
      "Hi [Client name],",
      "",
      "Thank you, I received the payment for [project/service]. I appreciate it.",
      "",
      "I look forward to working with you again.",
      "",
      `[${businessName}]`,
    ].join("\n"),
    [`${prefix}/next-invoice-note.md`]: [
      `Subject: Next invoice / recurring work note`,
      "",
      "Hi [Client name],",
      "",
      "Thanks again for the recent work together. For the next invoice or recurring work cycle, I will keep the scope, timing, and payment details clear before starting.",
      "",
      "Please let me know if anything needs to change for the next round.",
      "",
      `[${businessName}]`,
    ].join("\n"),
    [`${prefix}/review-before-sending.md`]: [
      "# Review Before Sending",
      "",
      reviewNote,
      adviceRule,
      "",
      "- Replace placeholders before sending.",
      "- Confirm payment wording matches the invoice and does not expose private account details.",
      "- Remove any late-fee, legal, or collection language that was not already agreed and reviewed by the buyer.",
      "- Do not include private invoice numbers, client private data, bank details, tax IDs, or account credentials.",
      "",
      "## Buyer-requested avoid list",
      ...(avoidClaims.length ? avoidClaims.map((item) => `- ${item}`) : ["- No avoid list was provided."]),
    ].join("\n"),
    [`${prefix}/service-order-status.json`]: JSON.stringify({
      serviceId: input.serviceId,
      orderId,
      businessName,
      invoiceStatus,
      preferredTone,
      followupNeed,
      paymentStatus: input.paymentStatus || (options.sample ? "sample_only_not_revenue" : ""),
      paidOrderVerified: Boolean(input.paidOrderVerified),
      generatedAt: new Date().toISOString(),
      sample: Boolean(options.sample),
      buyerReviewRequired: true,
      revenueRule,
    }, null, 2),
  };
}

function uploadLimitFixPlanDeliveryFiles(input, options = {}) {
  const validation = validateServiceDeliveryInput(input, options);
  if (!validation.ok) {
    const error = new Error(validation.errors.join(" "));
    error.validation = validation;
    throw error;
  }
  const orderId = cleanId(input.orderId || input.businessName || "upload-limit-fix-plan-order");
  const prefix = options.sample ? "upload-limit-fix-plan-sample" : `upload-limit-fix-plan-${orderId}`;
  const businessName = cleanText(input.businessName);
  const uploadErrorText = cleanText(input.uploadErrorText);
  const fileType = cleanText(input.fileType);
  const targetRule = cleanText(input.targetRule);
  const priorAttempts = cleanText(input.priorAttempts || "not specified");
  const broadUseCase = cleanText(input.broadUseCase || "file upload");
  const needByDate = cleanText(input.needByDate || "");
  const recommendation = uploadLimitRecommendation(uploadErrorText, fileType, targetRule);
  const reviewNote = "Buyer must run the steps on their own device, keep the original file, and review the output before uploading it to the destination site.";
  const adviceRule = "This is a troubleshooting plan only. It does not guarantee portal, school, employer, marketplace, email, or government acceptance.";
  const revenueRule = options.sample
    ? "This public sample is not revenue. Real revenue is counted only after an external provider shows a paid order, payout balance, or settled payment."
    : "Revenue for this delivery can be counted only if the matching external payment provider record shows paid_order_verified.";

  return {
    [`${prefix}/README.md`]: [
      `# ${businessName} - Upload Limit Fix Plan`,
      "",
      `Upload error: ${uploadErrorText}`,
      `File type: ${fileType}`,
      `Target rule: ${targetRule}`,
      `Use case: ${broadUseCase}`,
      `Needed by: ${needByDate || "not specified"}`,
      "",
      "## Included files",
      "",
      "- recommended-tool.md",
      "- target-settings.md",
      "- fallback-steps.md",
      "- review-before-upload.md",
      "- service-order-status.json",
      "",
      reviewNote,
      adviceRule,
      "",
      revenueRule,
    ].join("\n"),
    [`${prefix}/recommended-tool.md`]: [
      "# Recommended Tool",
      "",
      `Start with: ${recommendation.toolName}`,
      `URL path: ${recommendation.path}`,
      `Why: ${recommendation.why}`,
      "",
      "Do not upload the source file to this service. Run the free tool locally in your browser and keep the original file untouched.",
    ].join("\n"),
    [`${prefix}/target-settings.md`]: [
      "# Target Settings",
      "",
      `Portal rule: ${targetRule}`,
      `Suggested first target: ${recommendation.target}`,
      `Output format: ${recommendation.outputFormat}`,
      "",
      `Prior attempts noted: ${priorAttempts}`,
      "",
      "Use the exact target from the destination site when it is available. If the output is still rejected, use the fallback steps before changing the source document.",
    ].join("\n"),
    [`${prefix}/fallback-steps.md`]: [
      "# Fallback Steps",
      "",
      ...recommendation.fallbackSteps.map((step, index) => `${index + 1}. ${step}`),
      "",
      "Stop if the final file becomes unreadable. Keep the original file and make a fresh copy before trying stronger compression.",
    ].join("\n"),
    [`${prefix}/review-before-upload.md`]: [
      "# Review Before Upload",
      "",
      reviewNote,
      adviceRule,
      "",
      "- Confirm the file opens on your device.",
      "- Confirm the file size, dimensions, and format match the destination rule.",
      "- Confirm names, dates, faces, signatures, text, and important details remain readable.",
      "- Confirm you are uploading the intended new copy, not the original or a failed draft.",
      "- If the destination still rejects it, copy the public-safe error text and compare it with the target rule again.",
    ].join("\n"),
    [`${prefix}/service-order-status.json`]: JSON.stringify({
      serviceId: input.serviceId,
      orderId,
      businessName,
      uploadErrorText,
      fileType,
      targetRule,
      paymentStatus: input.paymentStatus || (options.sample ? "sample_only_not_revenue" : ""),
      paidOrderVerified: Boolean(input.paidOrderVerified),
      generatedAt: new Date().toISOString(),
      sample: Boolean(options.sample),
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

function uploadLimitRecommendation(errorText, fileType, targetRule) {
  const haystack = `${errorText} ${fileType} ${targetRule}`.toLowerCase();
  if (/pdf/.test(haystack) && /500\s?kb/.test(haystack)) {
    return {
      toolName: "Compress PDF to 500KB",
      path: "/tools/compress-pdf/?targetSize=500kb",
      target: "500KB PDF target",
      outputFormat: "PDF",
      why: "The error mentions a strict PDF size limit.",
      fallbackSteps: [
        "Try the 500KB PDF target on a copy of the file.",
        "If the result is unreadable, split the PDF or reduce source images before compressing again.",
        "If the portal allows images instead, convert the required page to JPG or PNG and compress that image.",
      ],
    };
  }
  if (/pdf/.test(haystack)) {
    return {
      toolName: "Compress PDF",
      path: "/tools/compress-pdf/?targetSize=1mb",
      target: /5\s?mb/.test(haystack) ? "5MB PDF target" : /2\s?mb/.test(haystack) ? "2MB PDF target" : "1MB PDF target",
      outputFormat: "PDF",
      why: "The blocked upload appears to be a PDF size issue.",
      fallbackSteps: [
        "Use the closest PDF target named by the portal.",
        "If the output is still too large, try a stricter target once and compare readability.",
        "For scanned PDFs, compress the source images or split pages before rebuilding the final PDF.",
      ],
    };
  }
  if (/dimension|pixel|px|600|square|passport/.test(haystack)) {
    return {
      toolName: "Resize or crop image",
      path: "/tools/resize-image/",
      target: "Exact pixel dimensions from the portal",
      outputFormat: /png/.test(haystack) ? "PNG" : "JPG or PNG",
      why: "The error mentions image dimensions or an ID-style photo rule.",
      fallbackSteps: [
        "Resize or crop to the exact width and height first.",
        "Then compress the resized output only if the portal also has a KB limit.",
        "Review faces, text, and edges after resizing.",
      ],
    };
  }
  return {
    toolName: "Compress image to KB",
    path: "/tools/compress-image-to-kb/",
    target: /100\s?kb/.test(haystack) ? "100KB image target" : /200\s?kb/.test(haystack) ? "200KB image target" : /500\s?kb/.test(haystack) ? "500KB image target" : "closest KB target from the portal",
    outputFormat: /png/.test(haystack) ? "PNG or WebP if accepted" : "JPG or WebP if accepted",
    why: "The blocked upload appears to be an image size or screenshot size issue.",
    fallbackSteps: [
      "Choose the KB target named by the portal.",
      "If the file is still too large, resize the image to a smaller width before compressing again.",
      "If the portal requires JPG or PNG, convert to that format after checking the final size.",
    ],
  };
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
