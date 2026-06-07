const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const root = path.resolve(__dirname, "..");
const serverPath = path.join(root, "scripts", "server.cjs");
process.env.PORT = process.env.PORT || "4181";
const server = require(serverPath);

const base = `http://localhost:${process.env.PORT}`;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  await delay(350);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const downloads = [];
  page.on("download", (download) => downloads.push(download));

  const routes = [
    "/",
    "/tools/",
    "/free-pdf-tools/",
    "/pdf-tool-finder/",
    "/share-kit/",
    "/free-invoice-generator-no-signup/",
    "/jpg-to-pdf-no-upload/",
    "/multiple-images-to-pdf-no-upload/",
    "/compress-pdf-no-upload/",
    "/compress-pdf-to-500kb/",
    "/compress-pdf-to-1mb/",
    "/compress-pdf-to-2mb/",
    "/compress-pdf-to-5mb/",
    "/pdf-to-jpg-no-upload/",
    "/extract-text-from-pdf-no-upload/",
    "/pdf-to-word-no-upload/",
    "/passport-photo-maker/",
    "/compress-image-no-upload/",
    "/resize-image-no-upload/",
    "/convert-image-format-no-upload/",
    "/remove-background-no-upload/",
    "/crop-image-no-upload/",
    "/rotate-image-no-upload/",
    "/watermark-image-no-upload/",
    "/add-text-to-image-no-upload/",
    "/signature-png-generator/",
    "/free-qr-code-generator-no-signup/",
    "/wifi-qr-code-generator/",
    "/contact-qr-code-generator/",
    "/compress-jpg-no-upload/",
    "/compress-png-no-upload/",
    "/compress-image-to-50kb/",
    "/compress-image-to-100kb/",
    "/compress-image-to-200kb/",
    "/compress-image-to-500kb/",
    "/resize-image-1080x1080/",
    "/resize-image-512x512/",
    "/png-to-jpg-no-upload/",
    "/webp-to-jpg-no-upload/",
    "/text-to-pdf-no-signup/",
    "/markdown-to-pdf-no-signup/",
    "/csv-to-pdf-no-upload/",
    "/json-to-pdf-no-upload/",
    "/free-resume-builder-no-signup/",
    "/ats-resume-checker-free/",
    "/free-receipt-generator-no-signup/",
    "/weekly-timesheet-pdf-no-signup/",
    "/free-certificate-maker-no-signup/",
    "/free-business-card-generator-printable/",
    "/free-address-label-generator-printable/",
    "/free-barcode-label-generator-printable/",
    "/free-price-tag-generator-printable/",
    "/free-flyer-maker-pdf-no-signup/",
    "/free-coupon-maker-printable/",
    "/free-packing-slip-generator-printable/",
    "/free-work-order-generator-pdf/",
    "/free-inventory-sheet-generator/",
    "/watermark-pdf-no-upload/",
    "/stamp-pdf-no-upload/",
    "/sign-pdf-no-upload/",
    "/tools/name-tracing/",
    "/tools/chore-chart/",
    "/tools/reward-chart/",
    "/tools/flashcards/",
    "/tools/weekly-planner/",
    "/tools/habit-tracker/",
    "/tools/invoice-generator/",
    "/tools/estimate-generator/",
    "/tools/purchase-order/",
    "/tools/bill-of-sale/",
    "/tools/rent-receipt/",
    "/tools/business-card/",
    "/tools/address-labels/",
    "/tools/price-tag/",
    "/tools/flyer-maker/",
    "/tools/barcode-labels/",
    "/tools/coupon-maker/",
    "/tools/packing-slip/",
    "/tools/work-order/",
    "/tools/inventory-sheet/",
    "/tools/resume-builder/",
    "/tools/ats-resume-checker/",
    "/tools/cover-letter/",
    "/tools/resignation-letter/",
    "/tools/monthly-calendar/",
    "/tools/meal-planner/",
    "/tools/image-to-pdf/",
    "/tools/multi-image-pdf/",
    "/tools/compress-pdf/",
    "/tools/pdf-to-images/",
    "/tools/pdf-to-text/",
    "/tools/pdf-to-word/",
    "/tools/compress-image/",
    "/tools/compress-image-to-kb/",
    "/tools/resize-image/",
    "/tools/convert-image/",
    "/tools/remove-background/",
    "/tools/crop-image/",
    "/tools/rotate-image/",
    "/tools/watermark-image/",
    "/tools/add-text-image/",
    "/tools/signature-png/",
    "/tools/passport-photo/",
    "/tools/qr-code/",
    "/tools/wifi-qr-code/",
    "/tools/vcard-qr-code/",
    "/tools/merge-pdf/",
    "/tools/split-pdf/",
    "/tools/pdf-page-numbers/",
    "/tools/rotate-pdf/",
    "/tools/remove-pdf-pages/",
    "/tools/reorder-pdf-pages/",
    "/tools/watermark-pdf/",
    "/tools/stamp-pdf/",
    "/tools/sign-pdf/",
    "/tools/text-to-pdf/",
    "/tools/markdown-to-pdf/",
    "/tools/csv-to-pdf/",
    "/tools/json-to-pdf/",
    "/tools/sign-in-sheet/",
    "/tools/graph-paper/",
    "/tools/packing-list/",
    "/tools/receipt-generator/",
    "/tools/timesheet-generator/",
    "/tools/certificate-generator/",
    "/tools/todo-list/",
    "/guides/",
    "/guides/free-printable-name-tracing-worksheet-maker/",
    "/guides/free-weekly-planner-generator/",
    "/guides/free-habit-tracker-generator/",
    "/guides/free-invoice-generator-no-signup/",
    "/guides/free-estimate-generator-pdf/",
    "/guides/free-purchase-order-generator/",
    "/guides/free-bill-of-sale-generator/",
    "/guides/free-rent-receipt-generator/",
    "/guides/free-business-card-generator-printable/",
    "/guides/free-address-label-generator-printable/",
    "/guides/free-barcode-label-generator-printable/",
    "/guides/free-price-tag-generator-printable/",
    "/guides/free-flyer-maker-pdf-no-signup/",
    "/guides/free-coupon-maker-printable/",
    "/guides/free-packing-slip-generator-printable/",
    "/guides/free-work-order-generator-pdf/",
    "/guides/free-inventory-sheet-generator/",
    "/guides/free-resume-builder-pdf/",
    "/guides/ats-resume-keyword-match/",
    "/guides/free-cover-letter-generator-pdf/",
    "/guides/free-resignation-letter-generator/",
    "/guides/free-monthly-calendar-generator/",
    "/guides/free-meal-planner-generator/",
    "/guides/free-image-to-pdf-converter/",
    "/guides/compress-pdf-without-uploading/",
    "/guides/pdf-to-jpg-without-uploading/",
    "/guides/extract-text-from-pdf-without-uploading/",
    "/guides/pdf-to-word-without-uploading/",
    "/guides/signature-png-generator/",
    "/guides/passport-photo-maker/",
    "/guides/compress-image-without-uploading/",
    "/guides/resize-image-without-uploading/",
    "/guides/convert-image-format-without-uploading/",
    "/guides/remove-background-without-uploading/",
    "/guides/add-text-to-image-without-uploading/",
    "/guides/multiple-images-to-pdf-without-uploading/",
    "/guides/merge-pdf-without-uploading/",
    "/guides/split-pdf-without-uploading/",
    "/guides/add-page-numbers-to-pdf/",
    "/guides/rotate-pdf-pages-without-uploading/",
    "/guides/remove-pages-from-pdf-without-uploading/",
    "/guides/reorder-pdf-pages-without-uploading/",
    "/guides/watermark-pdf-without-uploading/",
    "/guides/stamp-pdf-without-uploading/",
    "/guides/add-signature-text-to-pdf-without-uploading/",
    "/guides/text-to-pdf-converter-no-signup/",
    "/guides/markdown-to-pdf-converter-no-signup/",
    "/guides/csv-to-pdf-table-no-upload/",
    "/guides/json-to-pdf-formatter-no-upload/",
    "/guides/free-sign-in-sheet-generator/",
    "/guides/free-printable-graph-paper-generator/",
    "/guides/free-packing-list-generator/",
    "/guides/free-receipt-generator-pdf/",
    "/guides/weekly-timesheet-generator-pdf/",
    "/guides/free-certificate-generator-pdf/",
    "/guides/printable-to-do-list-generator/",
    "/submit-directory/",
    "/sponsor/",
    "/privacy/",
    "/dashboard/",
  ];

  for (const route of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    if (!response || !response.ok()) throw new Error(`Route failed: ${route}`);
    const title = await page.title();
    if (!title.includes("PrintableTools Lab")) throw new Error(`Bad title for ${route}: ${title}`);
  }

  await page.goto(`${base}/?utm_source=github`, { waitUntil: "networkidle" });
  let latestSource = await page.evaluate(() => {
    const events = JSON.parse(localStorage.getItem("ptl_events") || "[]");
    return events.at(-1)?.data?.source;
  });
  if (latestSource !== "github") throw new Error(`Campaign source was not captured: ${latestSource}`);
  await page.goto(`${base}/tools/invoice-generator/`, { waitUntil: "networkidle" });
  latestSource = await page.evaluate(() => {
    const events = JSON.parse(localStorage.getItem("ptl_events") || "[]");
    return events.at(-1)?.data?.source;
  });
  if (latestSource !== "github") throw new Error(`Campaign source did not persist for the session: ${latestSource}`);

  await page.goto(`${base}/free-pdf-tools/`, { waitUntil: "networkidle" });
  const freePdfText = await page.locator("main").innerText();
  for (const phrase of ["No-upload conversion tools", "Free business PDF tools", "All free generators"]) {
    if (!freePdfText.includes(phrase)) throw new Error(`Free PDF tools page is missing ${phrase}`);
  }
  for (const href of ["/tools/compress-pdf/", "/tools/compress-image/", "/tools/compress-image-to-kb/", "/tools/resize-image/", "/tools/convert-image/", "/tools/remove-background/", "/tools/crop-image/", "/tools/rotate-image/", "/tools/watermark-image/", "/tools/add-text-image/", "/tools/signature-png/", "/tools/passport-photo/", "/tools/qr-code/", "/tools/wifi-qr-code/", "/tools/vcard-qr-code/", "/tools/multi-image-pdf/", "/tools/pdf-to-images/", "/tools/pdf-to-text/", "/tools/pdf-to-word/", "/tools/merge-pdf/", "/tools/split-pdf/", "/tools/pdf-page-numbers/", "/tools/rotate-pdf/", "/tools/remove-pdf-pages/", "/tools/reorder-pdf-pages/", "/tools/watermark-pdf/", "/tools/stamp-pdf/", "/tools/sign-pdf/", "/tools/text-to-pdf/", "/tools/markdown-to-pdf/", "/tools/csv-to-pdf/", "/tools/json-to-pdf/", "/tools/timesheet-generator/", "/tools/business-card/", "/tools/barcode-labels/", "/tools/packing-slip/", "/tools/work-order/", "/tools/inventory-sheet/"]) {
    const linkCount = await page.locator(`main a[href="${href}"]`).count();
    if (!linkCount) throw new Error(`Free PDF tools page is missing link ${href}`);
  }

  await page.goto(`${base}/pdf-tool-finder/`, { waitUntil: "networkidle" });
  const finderText = await page.locator("main").innerText();
  for (const phrase of ["Which free PDF, image, or QR tool should I use?", "Compress vs resize vs convert", "Invoice vs receipt", "One image vs many images"]) {
    if (!finderText.includes(phrase)) throw new Error(`PDF tool finder page is missing ${phrase}`);
  }
  for (const href of ["/tools/compress-pdf/", "/tools/compress-image/", "/tools/compress-image-to-kb/", "/tools/resize-image/", "/tools/convert-image/", "/tools/remove-background/", "/tools/crop-image/", "/tools/rotate-image/", "/tools/watermark-image/", "/tools/add-text-image/", "/tools/signature-png/", "/tools/passport-photo/", "/tools/qr-code/", "/tools/wifi-qr-code/", "/tools/vcard-qr-code/", "/tools/image-to-pdf/", "/tools/pdf-to-images/", "/tools/pdf-to-text/", "/tools/pdf-to-word/", "/tools/merge-pdf/", "/tools/split-pdf/", "/tools/pdf-page-numbers/", "/tools/rotate-pdf/", "/tools/remove-pdf-pages/", "/tools/reorder-pdf-pages/", "/tools/watermark-pdf/", "/tools/stamp-pdf/", "/tools/sign-pdf/", "/tools/markdown-to-pdf/", "/tools/csv-to-pdf/", "/tools/json-to-pdf/", "/tools/receipt-generator/", "/tools/timesheet-generator/", "/tools/business-card/", "/tools/price-tag/", "/tools/packing-slip/", "/tools/work-order/", "/tools/inventory-sheet/"]) {
    const linkCount = await page.locator(`main a[href="${href}"]`).count();
    if (!linkCount) throw new Error(`PDF tool finder page is missing link ${href}`);
  }

  for (const targetKb of ["50", "100", "200", "500"]) {
    await page.goto(`${base}/compress-image-to-${targetKb}kb/`, { waitUntil: "networkidle" });
    const landingHref = `/tools/compress-image-to-kb/?targetKb=${targetKb}`;
    const landingLinkCount = await page.locator(`main a[href="${landingHref}"]`).count();
    if (!landingLinkCount) throw new Error(`Target-KB landing page is missing prefilled tool link ${landingHref}`);
    await page.goto(`${base}${landingHref}`, { waitUntil: "networkidle" });
    const selectedTarget = await page.locator("#targetKb").inputValue();
    if (selectedTarget !== targetKb) throw new Error(`Target-KB tool did not preselect ${targetKb}KB, got ${selectedTarget}`);
  }

  for (const [targetSize, pageSlug] of [["500kb", "compress-pdf-to-500kb"], ["1mb", "compress-pdf-to-1mb"], ["2mb", "compress-pdf-to-2mb"], ["5mb", "compress-pdf-to-5mb"]]) {
    await page.goto(`${base}/${pageSlug}/`, { waitUntil: "networkidle" });
    const landingHref = `/tools/compress-pdf/?targetSize=${targetSize}`;
    const landingLinkCount = await page.locator(`main a[href="${landingHref}"]`).count();
    if (!landingLinkCount) throw new Error(`Target-size PDF landing page is missing prefilled tool link ${landingHref}`);
    await page.goto(`${base}${landingHref}`, { waitUntil: "networkidle" });
    const selectedTarget = await page.locator("#targetSize").inputValue();
    if (selectedTarget !== targetSize) throw new Error(`PDF target-size tool did not preselect ${targetSize}, got ${selectedTarget}`);
  }

  await page.goto(`${base}/upload-limit-fixer/`, { waitUntil: "networkidle" });
  const uploadLimitText = await page.locator("main").innerText();
  for (const phrase of ["Upload error text", "Local text match only", "Upload message", "PDF must be under 1MB", "Photo or image must be under 100KB"]) {
    if (!uploadLimitText.includes(phrase)) throw new Error(`Upload limit fixer is missing ${phrase}`);
  }
  const matcherCases = [
    ["PDF must be less than 1 MB", "/tools/compress-pdf/?targetSize=1mb", "compress-pdf"],
    ["Photo must be under 100 KB", "/tools/compress-image-to-kb/?targetKb=100", "compress-image-to-kb"],
    ["Image must be less than 2 MB", "/tools/compress-image-to-kb/?targetKb=2048", "compress-image-to-kb"],
    ["Resume PDF too large", "/tools/compress-pdf/?targetSize=1mb", "compress-pdf"],
    ["PNG screenshot is too large", "/tools/compress-image-to-kb/?targetKb=500", "compress-image-to-kb"],
    ["Image dimensions must be 600 x 600 px", "/tools/resize-image/", "resize-image"],
    ["Invalid file type. Please upload JPG or PNG", "/tools/convert-image/", "convert-image"],
  ];
  for (const [message, expectedHref, expectedTool] of matcherCases) {
    await page.fill("[data-upload-limit-input]", message);
    const recommendation = page.locator(`[data-upload-limit-result] a[href="${expectedHref}"][data-track-tool="${expectedTool}"]`);
    if (!(await recommendation.count())) throw new Error(`Upload limit matcher did not recommend ${expectedHref} for ${message}`);
  }
  const uploadLimitRoutes = [
    ["/tools/compress-pdf/?targetSize=1mb", "#targetSize", "1mb"],
    ["/tools/compress-image-to-kb/?targetKb=100", "#targetKb", "100"],
  ];
  for (const [href, selector, expectedValue] of uploadLimitRoutes) {
    const trackedLink = page.locator(`main a[href="${href}"][data-track-event="free_tool_depth"]`).first();
    if (!(await trackedLink.count())) throw new Error(`Upload limit fixer is missing tracked decision link ${href}`);
    await trackedLink.click();
    await page.waitForLoadState("networkidle");
    const selectedValue = await page.locator(selector).inputValue();
    if (selectedValue !== expectedValue) throw new Error(`Upload limit decision ${href} did not preselect ${expectedValue}, got ${selectedValue}`);
    await page.goto(`${base}/upload-limit-fixer/`, { waitUntil: "networkidle" });
  }

  const uploadErrorLandingRoutes = [
    ["/file-must-be-less-than-1mb/", "/tools/compress-pdf/?targetSize=1mb", "#targetSize", "1mb"],
    ["/photo-must-be-under-100kb/", "/tools/compress-image-to-kb/?targetKb=100", "#targetKb", "100"],
    ["/image-dimensions-600x600/", "/tools/resize-image/?width=600&height=600&fit=cover", "#width", "600"],
    ["/image-must-be-less-than-2mb/", "/tools/compress-image-to-kb/?targetKb=2048", "#customKb", "2048"],
    ["/image-must-be-under-500kb/", "/tools/compress-image-to-kb/?targetKb=500", "#targetKb", "500"],
    ["/jpg-must-be-under-200kb/", "/tools/compress-image-to-kb/?targetKb=200", "#targetKb", "200"],
    ["/resume-pdf-too-large/", "/tools/compress-pdf/?targetSize=1mb", "#targetSize", "1mb"],
    ["/email-attachment-too-large/", "/tools/compress-pdf/?targetSize=5mb", "#targetSize", "5mb"],
  ];
  for (const [landingPath, href, selector, expectedValue] of uploadErrorLandingRoutes) {
    await page.goto(`${base}${landingPath}`, { waitUntil: "networkidle" });
    const landingText = await page.locator("main").innerText();
    if (!landingText.includes("Upload error text")) throw new Error(`Upload-error landing page missing matcher: ${landingPath}`);
    const toolLink = page.locator(`main a[href="${href}"]`).first();
    if (!(await toolLink.count())) throw new Error(`Upload-error landing page missing primary link ${href}`);
    await toolLink.click();
    await page.waitForLoadState("networkidle");
    const selectedValue = await page.locator(selector).inputValue();
    if (selectedValue !== expectedValue) throw new Error(`Upload-error landing ${landingPath} did not preselect ${expectedValue}, got ${selectedValue}`);
  }

  await page.goto(`${base}/submit-directory/`, { waitUntil: "networkidle" });
  const submissionPackText = await page.locator("main").innerText();
  for (const phrase of ["Copy-ready listing details", "Primary links for reviewers", "Representative tools"]) {
    if (!submissionPackText.includes(phrase)) throw new Error(`Directory submission pack is missing ${phrase}`);
  }

  await page.goto(`${base}/share-kit/`, { waitUntil: "networkidle" });
  const shareKitText = await page.locator("main").innerText();
  for (const phrase of ["PrintableTools Lab share kit", "Priority links", "Copy-ready posts", "Rules for safe distribution"]) {
    if (!shareKitText.includes(phrase)) throw new Error(`Share kit is missing ${phrase}`);
  }
  if (!shareKitText.includes("Upload error cheatsheet")) throw new Error("Share kit is missing upload error cheatsheet.");
  const shareKitResponse = await page.goto(`${base}/share-kit.json`, { waitUntil: "networkidle" });
  if (!shareKitResponse || !shareKitResponse.ok()) throw new Error("share-kit.json route failed");
  const shareKitJson = await page.evaluate(() => JSON.parse(document.body.innerText));
  if (!Array.isArray(shareKitJson.featuredLinks) || shareKitJson.featuredLinks.length < 8) throw new Error("share-kit.json missing featured links");
  if (!Array.isArray(shareKitJson.uploadErrorCheatsheet?.entries) || shareKitJson.uploadErrorCheatsheet.entries.length < 12) throw new Error("share-kit.json missing upload error cheatsheet entries");
  if (!Array.isArray(shareKitJson.organicPushKit?.tasks) || shareKitJson.organicPushKit.tasks.length < 8) throw new Error("share-kit.json missing organic push kit tasks");

  await page.goto(`${base}/organic-push-kit/`, { waitUntil: "networkidle" });
  const organicPushText = await page.locator("main").innerText();
  for (const phrase of ["Organic push kit", "Today queue", "Helpful reply for PDF under 1MB questions", "Directory listing for free no-signup file tools"]) {
    if (!organicPushText.includes(phrase)) throw new Error(`Organic push kit is missing ${phrase}`);
  }
  const organicPushResponse = await page.goto(`${base}/organic-push-kit.json`, { waitUntil: "networkidle" });
  if (!organicPushResponse || !organicPushResponse.ok()) throw new Error("organic-push-kit.json route failed");
  const organicPushJson = await page.evaluate(() => JSON.parse(document.body.innerText));
  if (!Array.isArray(organicPushJson.tasks) || organicPushJson.tasks.length < 8) throw new Error("organic-push-kit.json missing tasks");

  await page.goto(`${base}/upload-error-cheatsheet/`, { waitUntil: "networkidle" });
  const cheatsheetText = await page.locator("main").innerText();
  for (const phrase of ["Upload error cheatsheet", "PDF must be under 1MB", "Image must be less than 2MB", "Email attachment too large"]) {
    if (!cheatsheetText.includes(phrase)) throw new Error(`Upload error cheatsheet is missing ${phrase}`);
  }
  const cheatsheetResponse = await page.goto(`${base}/upload-error-cheatsheet.json`, { waitUntil: "networkidle" });
  if (!cheatsheetResponse || !cheatsheetResponse.ok()) throw new Error("upload-error-cheatsheet.json route failed");
  const cheatsheetJson = await page.evaluate(() => JSON.parse(document.body.innerText));
  if (!Array.isArray(cheatsheetJson.entries) || cheatsheetJson.entries.length < 12) throw new Error("upload-error-cheatsheet.json missing entries");

  await page.goto(`${base}/sponsor/`, { waitUntil: "networkidle" });
  const sponsorText = await page.locator("main").innerText();
  for (const phrase of ["Sponsor PrintableTools Lab", "What can be sponsored", "Sponsor pages by audience", "Placement rules", "Inquiry checklist"]) {
    if (!sponsorText.includes(phrase)) throw new Error(`Sponsor page is missing ${phrase}`);
  }
  const sponsorLinkCount = await page.locator('main a[data-track-event="sponsor_request_intent"][data-track-tool="sponsor"]').count();
  if (sponsorLinkCount < 3) throw new Error("Sponsor page is missing tracked sponsor intent links.");
  const sponsorForm = page.locator('[data-sponsor-lead-form]').first();
  if (!(await sponsorForm.count())) throw new Error("Sponsor page is missing lead capture form.");
  await sponsorForm.locator('input[name="company"]').fill("Smoke Test Partner");
  await sponsorForm.locator('input[name="contactEmail"]').fill("smoke@example.com");
  await sponsorForm.locator('input[name="website"]').fill("https://example.com");
  await sponsorForm.locator('select[name="placement"]').selectOption("content-sponsorship");
  await sponsorForm.locator('select[name="budgetRange"]').selectOption("250-500");
  await sponsorForm.locator('select[name="timeline"]').selectOption("this-month");
  await sponsorForm.locator('textarea[name="audienceFit"]').fill("Privacy-friendly utility users who need PDF and image tools.");
  await sponsorForm.locator('textarea[name="notes"]').fill("Smoke test note.");
  await sponsorForm.locator('input[name="consent"]').check();
  await sponsorForm.locator('button[type="submit"]').click();
  await page.locator('[data-sponsor-lead-status][data-status="success"]').waitFor({ timeout: 5000 });
  const sponsorMediaKitResponse = await page.goto(`${base}/sponsor-media-kit.json`, { waitUntil: "networkidle" });
  if (!sponsorMediaKitResponse || !sponsorMediaKitResponse.ok()) throw new Error("sponsor-media-kit.json route failed");
  const sponsorMediaKit = await page.evaluate(() => JSON.parse(document.body.innerText));
  if (!Array.isArray(sponsorMediaKit.placements) || sponsorMediaKit.placements.length < 3) throw new Error("Sponsor media kit missing placements");
  if (!String(sponsorMediaKit.moneyGate || "").includes("settled payment")) throw new Error("Sponsor media kit missing money gate");
  const sponsorOutreachResponse = await page.goto(`${base}/sponsor-outreach-pack.json`, { waitUntil: "networkidle" });
  if (!sponsorOutreachResponse || !sponsorOutreachResponse.ok()) throw new Error("sponsor-outreach-pack.json route failed");
  const sponsorOutreachPack = await page.evaluate(() => JSON.parse(document.body.innerText));
  if (!Array.isArray(sponsorOutreachPack.templates) || sponsorOutreachPack.templates.length < 3) throw new Error("Sponsor outreach pack missing templates");
  if (!Array.isArray(sponsorOutreachPack.verticalSponsorPages) || sponsorOutreachPack.verticalSponsorPages.length < 5) throw new Error("Sponsor outreach pack missing vertical pages");
  if (!Array.isArray(sponsorOutreachPack.trackedLinks) || sponsorOutreachPack.trackedLinks.length < 10) throw new Error("Sponsor outreach pack missing vertical tracked links");
  await page.goto(`${base}/sponsor-call/`, { waitUntil: "networkidle" });
  const sponsorCallText = await page.locator("main").innerText();
  for (const phrase of ["Sponsor call", "Current sponsor openings", "Audience-specific sponsor pages", "Rules before any placement"]) {
    if (!sponsorCallText.includes(phrase)) throw new Error(`Sponsor call page is missing ${phrase}`);
  }
  const sponsorCallResponse = await page.goto(`${base}/sponsor-call.json`, { waitUntil: "networkidle" });
  if (!sponsorCallResponse || !sponsorCallResponse.ok()) throw new Error("sponsor-call.json route failed");
  const sponsorCallJson = await page.evaluate(() => JSON.parse(document.body.innerText));
  if (!Array.isArray(sponsorCallJson.actions) || sponsorCallJson.actions.length < 3) throw new Error("Sponsor call JSON missing actions");
  await page.goto(`${base}/sponsor/pdf-image-qr-saas/?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=pdf_image_qr_saas&utm_content=smoke`, { waitUntil: "networkidle" });
  const sponsorVerticalText = await page.locator("main").innerText();
  for (const phrase of ["PDF, Image, and QR SaaS Sponsorship", "Audience fit", "Pilot offer", "Good-fit sponsor categories"]) {
    if (!sponsorVerticalText.includes(phrase)) throw new Error(`Sponsor vertical page is missing ${phrase}`);
  }
  const sponsorVerticalForm = page.locator('[data-sponsor-lead-form]').first();
  if (!(await sponsorVerticalForm.count())) throw new Error("Sponsor vertical page is missing lead capture form.");
  await sponsorVerticalForm.locator('input[name="company"]').fill("Smoke SaaS Partner");
  await sponsorVerticalForm.locator('input[name="contactEmail"]').fill("saas-smoke@example.com");
  await sponsorVerticalForm.locator('input[name="website"]').fill("https://example.com/saas");
  await sponsorVerticalForm.locator('select[name="placement"]').selectOption("content-sponsorship");
  await sponsorVerticalForm.locator('select[name="budgetRange"]').selectOption("250-500");
  await sponsorVerticalForm.locator('select[name="timeline"]').selectOption("this-month");
  await sponsorVerticalForm.locator('textarea[name="audienceFit"]').fill("PDF, image, and QR SaaS users who need no-upload file workflows.");
  await sponsorVerticalForm.locator('textarea[name="notes"]').fill("Smoke attribution test.");
  await sponsorVerticalForm.locator('input[name="consent"]').check();
  await sponsorVerticalForm.locator('button[type="submit"]').click();
  await page.locator('[data-sponsor-lead-status][data-status="success"]').waitFor({ timeout: 5000 });

  const onePagePdf = await samplePdf("First document");
  const secondPagePdf = await samplePdf("Second document");
  const twoPagePdf = await samplePdf("Split source", 2);

  for (const route of ["/tools/name-tracing/", "/tools/chore-chart/", "/tools/reward-chart/", "/tools/flashcards/", "/tools/weekly-planner/", "/tools/habit-tracker/", "/tools/invoice-generator/", "/tools/estimate-generator/", "/tools/purchase-order/", "/tools/bill-of-sale/", "/tools/rent-receipt/", "/tools/business-card/", "/tools/address-labels/", "/tools/price-tag/", "/tools/flyer-maker/", "/tools/barcode-labels/", "/tools/coupon-maker/", "/tools/packing-slip/", "/tools/work-order/", "/tools/inventory-sheet/", "/tools/resume-builder/", "/tools/ats-resume-checker/", "/tools/cover-letter/", "/tools/resignation-letter/", "/tools/monthly-calendar/", "/tools/meal-planner/", "/tools/image-to-pdf/", "/tools/multi-image-pdf/", "/tools/compress-pdf/", "/tools/pdf-to-images/", "/tools/pdf-to-text/", "/tools/pdf-to-word/", "/tools/compress-image/", "/tools/compress-image-to-kb/", "/tools/resize-image/", "/tools/convert-image/", "/tools/remove-background/", "/tools/crop-image/", "/tools/rotate-image/", "/tools/watermark-image/", "/tools/add-text-image/", "/tools/signature-png/", "/tools/passport-photo/", "/tools/qr-code/", "/tools/wifi-qr-code/", "/tools/vcard-qr-code/", "/tools/merge-pdf/", "/tools/split-pdf/", "/tools/pdf-page-numbers/", "/tools/rotate-pdf/", "/tools/remove-pdf-pages/", "/tools/reorder-pdf-pages/", "/tools/watermark-pdf/", "/tools/stamp-pdf/", "/tools/sign-pdf/", "/tools/text-to-pdf/", "/tools/markdown-to-pdf/", "/tools/csv-to-pdf/", "/tools/json-to-pdf/", "/tools/sign-in-sheet/", "/tools/graph-paper/", "/tools/packing-list/", "/tools/receipt-generator/", "/tools/timesheet-generator/", "/tools/certificate-generator/", "/tools/todo-list/"]) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("ptl_daily"));
    if (route === "/tools/image-to-pdf/") {
      await page.setInputFiles("input[type=file]", {
        name: "sample.png",
        mimeType: "image/png",
        buffer: samplePng(),
      });
      await page.waitForTimeout(750);
      const hasRenderedFileName = await page.evaluate(() => {
        const canvas = document.querySelector("canvas.preview-canvas");
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        const data = ctx.getImageData(45, canvas.height - 120, canvas.width - 90, 80).data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) return true;
        }
        return false;
      });
      if (!hasRenderedFileName) throw new Error("Image-to-PDF upload did not render selected file details.");
    }
    if (route === "/tools/multi-image-pdf/") {
      await page.setInputFiles("input[type=file]", [
        { name: "first.png", mimeType: "image/png", buffer: samplePng() },
        { name: "second.png", mimeType: "image/png", buffer: samplePng() },
      ]);
      await page.waitForTimeout(750);
      const hasRenderedImages = await page.evaluate(() => {
        const canvas = document.querySelector("canvas.preview-canvas");
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        const data = ctx.getImageData(Math.floor(canvas.width / 2) - 160, 260, 320, 320).data;
        let changed = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) changed += 1;
        }
        return changed > 400;
      });
      if (!hasRenderedImages) throw new Error("Multi-image PDF preview did not render selected files.");
    }
    if (["/tools/compress-image/", "/tools/compress-image-to-kb/", "/tools/resize-image/", "/tools/convert-image/", "/tools/remove-background/", "/tools/crop-image/", "/tools/rotate-image/", "/tools/watermark-image/", "/tools/add-text-image/", "/tools/passport-photo/"].includes(route)) {
      await page.setInputFiles("input[type=file]", {
        name: "photo.png",
        mimeType: "image/png",
        buffer: samplePng(),
      });
      if (route === "/tools/resize-image/") {
        await page.selectOption("#preset", "square-1080");
      }
      if (route === "/tools/convert-image/") {
        await page.selectOption("#format", "webp");
      }
      if (route === "/tools/remove-background/") {
        await page.selectOption("#sample", "white");
        await page.selectOption("#tolerance", "108");
      }
      if (route === "/tools/crop-image/") {
        await page.selectOption("#preset", "square");
      }
      if (route === "/tools/rotate-image/") {
        await page.selectOption("#rotation", "90");
      }
      if (route === "/tools/watermark-image/") {
        await page.fill("#watermarkText", "SAMPLE");
        await page.selectOption("#placement", "diagonal-tile");
      }
      if (route === "/tools/add-text-image/") {
        await page.fill("#overlayText", "SALE TODAY");
        await page.fill("#subText", "Local export");
        await page.selectOption("#layout", "bottom-banner");
        await page.selectOption("#boxStyle", "solid");
      }
      if (route === "/tools/passport-photo/") {
        await page.selectOption("#preset", "us-passport");
        await page.selectOption("#output", "single-jpg");
        await page.locator("#zoom").evaluate((input) => {
          input.value = "1.18";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
      }
      await page.waitForTimeout(750);
      const hasRenderedImagePreview = await page.evaluate(() => {
        const canvas = document.querySelector("canvas.preview-canvas");
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        const data = ctx.getImageData(72, 220, canvas.width - 144, canvas.height - 500).data;
        let changed = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) changed += 1;
        }
        return changed > 1200;
      });
      if (!hasRenderedImagePreview) throw new Error(`${route} preview did not render selected image.`);
      const hasOriginalColors = await page.evaluate(() => {
        const canvas = document.querySelector("canvas.preview-canvas");
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        const data = ctx.getImageData(72, 220, canvas.width - 144, canvas.height - 500).data;
        const counts = { blue: 0, red: 0, green: 0 };
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r < 80 && g > 80 && b > 100) counts.blue += 1;
          if (r > 180 && g < 150 && b < 140) counts.red += 1;
          if (r < 150 && g > 110 && b < 150) counts.green += 1;
        }
        return counts.blue > 1000 && counts.red > 1000 && counts.green > 1000;
      });
      if (route !== "/tools/remove-background/" && route !== "/tools/watermark-image/" && route !== "/tools/add-text-image/" && route !== "/tools/passport-photo/" && !hasOriginalColors) throw new Error(`${route} preview did not render the selected image colors.`);
      if (route === "/tools/remove-background/") {
        const hasTransparentGrid = await page.evaluate(() => {
          const canvas = document.querySelector("canvas.preview-canvas");
          if (!canvas) return false;
          const ctx = canvas.getContext("2d");
          const data = ctx.getImageData(72, 220, canvas.width - 144, canvas.height - 500).data;
          let grayGrid = 0;
          let color = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (Math.abs(r - g) < 8 && Math.abs(g - b) < 12 && r > 175 && r < 245) grayGrid += 1;
            if (Math.max(r, g, b) - Math.min(r, g, b) > 40 && (r < 180 || g < 180 || b < 180)) color += 1;
          }
          return grayGrid > 2000 && color > 600;
        });
        if (!hasTransparentGrid) throw new Error("Background remover preview did not render transparent grid and foreground colors.");
      }
      if (route === "/tools/passport-photo/") {
        const hasPassportGuide = await page.evaluate(() => {
          const canvas = document.querySelector("canvas.preview-canvas");
          if (!canvas) return false;
          const ctx = canvas.getContext("2d");
          const data = ctx.getImageData(72, 220, canvas.width - 144, canvas.height - 500).data;
          let blue = 0;
          let red = 0;
          let green = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (b > 150 && r < 120 && g < 150) blue += 1;
            if (r > 170 && g < 100 && b < 120) red += 1;
            if (g > 120 && r < 120 && b < 120) green += 1;
          }
          return blue > 500 && red > 100 && green > 80;
        });
        if (!hasPassportGuide) throw new Error(`${route} preview did not render passport crop guides.`);
      }
      if (route === "/tools/watermark-image/") {
        const hasWatermarkMark = await page.evaluate(() => {
          const canvas = document.querySelector("canvas.preview-canvas");
          if (!canvas) return false;
          const ctx = canvas.getContext("2d");
          const data = ctx.getImageData(72, 220, canvas.width - 144, canvas.height - 500).data;
          let dark = 0;
          let lightStroke = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r < 145 && g < 155 && b < 160) dark += 1;
            if (r > 235 && g > 235 && b > 235) lightStroke += 1;
          }
          return dark > 1000 && lightStroke > 500;
        });
        if (!hasWatermarkMark) throw new Error(`${route} preview did not render watermark text.`);
      }
      if (route === "/tools/add-text-image/") {
        const hasTextOverlay = await page.evaluate(() => {
          const canvas = document.querySelector("canvas.preview-canvas");
          if (!canvas) return false;
          const ctx = canvas.getContext("2d");
          const data = ctx.getImageData(72, 220, canvas.width - 144, canvas.height - 500).data;
          let magenta = 0;
          let white = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > 150 && b > 145 && g < 90) magenta += 1;
            if (r > 238 && g > 238 && b > 238) white += 1;
          }
          return magenta > 800 && white > 700;
        });
        if (!hasTextOverlay) throw new Error(`${route} preview did not render text overlay.`);
      }
    }
    if (route === "/tools/signature-png/") {
      await page.fill("#signatureName", "Alex Rivera");
      await page.selectOption("#style", "typed-script");
      await page.waitForTimeout(500);
      const hasSignaturePreview = await page.evaluate(() => {
        const canvas = document.querySelector("canvas.preview-canvas");
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        const data = ctx.getImageData(72, 220, canvas.width - 144, 520).data;
        let dark = 0;
        let grid = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r < 80 && g < 90 && b < 110) dark += 1;
          if (Math.abs(r - g) < 12 && Math.abs(g - b) < 18 && r > 185 && r < 245) grid += 1;
        }
        return dark > 350 && grid > 2000;
      });
      if (!hasSignaturePreview) throw new Error("Signature PNG preview did not render signature and transparent grid.");
    }
    if (route === "/tools/ats-resume-checker/") {
      await page.fill("#targetRole", "Customer Success Specialist");
      await page.fill("#jobDescription", "Customer Success Specialist role requiring onboarding, CRM, support tickets, retention, reporting, communication, product feedback, and cross-functional follow-up.");
      await page.waitForTimeout(500);
      const hasAtsReport = await page.evaluate(() => {
        const canvas = document.querySelector("canvas.preview-canvas");
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        const data = ctx.getImageData(70, 215, canvas.width - 140, 820).data;
        let dark = 0;
        let tinted = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r < 80 && g < 90 && b < 110) dark += 1;
          if (Math.max(r, g, b) - Math.min(r, g, b) > 12 && r > 210 && g > 220 && b > 220) tinted += 1;
        }
        return dark > 1800 && tinted > 6000;
      });
      if (!hasAtsReport) throw new Error("ATS checker report preview did not render analysis panels.");
    }
    if (["/tools/qr-code/", "/tools/wifi-qr-code/", "/tools/vcard-qr-code/"].includes(route)) {
      const hasQrMatrix = await page.evaluate(() => {
        const canvas = document.querySelector("canvas.preview-canvas");
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        const data = ctx.getImageData(Math.floor(canvas.width / 2) - 260, 300, 520, 520).data;
        let dark = 0;
        let light = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r < 60 && g < 80 && b < 90) dark += 1;
          if (r > 245 && g > 245 && b > 245) light += 1;
        }
        return dark > 6000 && light > 20000;
      });
      if (!hasQrMatrix) throw new Error(`${route} preview did not render a QR matrix.`);
    }
    if (route === "/tools/merge-pdf/") {
      await page.setInputFiles("input[type=file]", [
        { name: "first.pdf", mimeType: "application/pdf", buffer: onePagePdf },
        { name: "second.pdf", mimeType: "application/pdf", buffer: secondPagePdf },
      ]);
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("first.pdf") || !previewText.includes("second.pdf") || !previewText.includes("2-page PDF")) throw new Error(`Merge PDF preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/split-pdf/") {
      await page.setInputFiles("input[type=file]", { name: "source.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#pageRange", "2");
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("source.pdf") || !previewText.includes("keep 1 page")) throw new Error(`Split PDF preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/pdf-to-images/") {
      await page.setInputFiles("input[type=file]", { name: "render.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#pageRange", "1");
      await page.selectOption("#format", "jpeg");
      await page.waitForFunction(() => Boolean(window.pdfjsLib), null, { timeout: 8000 });
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("render.pdf") || !previewText.includes("render 1 page") || !previewText.includes("JPG image")) throw new Error(`PDF-to-image preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/pdf-to-text/") {
      await page.setInputFiles("input[type=file]", { name: "extract.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#pageRange", "1");
      await page.waitForFunction(() => Boolean(window.pdfjsLib), null, { timeout: 8000 });
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("extract.pdf") || !previewText.includes("extract selectable text from 1 of 2 pages")) throw new Error(`PDF-to-text preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/pdf-to-word/") {
      await page.setInputFiles("input[type=file]", { name: "word-source.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#pageRange", "1");
      await page.selectOption("#layout", "headings");
      await page.waitForFunction(() => Boolean(window.pdfjsLib) && Boolean(window.fflate), null, { timeout: 8000 });
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("word-source.pdf") || !previewText.includes("convert selectable text from 1 of 2 pages") || !previewText.includes("DOCX file")) throw new Error(`PDF-to-Word preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/compress-pdf/") {
      await page.setInputFiles("input[type=file]", { name: "large-scan.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.selectOption("#mode", "small");
      await page.fill("#pageRange", "1");
      await page.waitForFunction(() => Boolean(window.pdfjsLib), null, { timeout: 8000 });
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("large-scan.pdf") || !previewText.includes("render 1 of 2 pages") || !previewText.includes("image-based PDF")) throw new Error(`Compress PDF preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/pdf-page-numbers/") {
      await page.setInputFiles("input[type=file]", { name: "number-me.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("number-me.pdf") || !previewText.includes("2 pages")) throw new Error(`Page-number PDF preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/rotate-pdf/") {
      await page.setInputFiles("input[type=file]", { name: "sideways.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#pageRange", "1");
      await page.selectOption("#rotation", "90");
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("sideways.pdf") || !previewText.includes("rotate 1 of 2 pages by 90 degrees")) throw new Error(`Rotate PDF preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/remove-pdf-pages/") {
      await page.setInputFiles("input[type=file]", { name: "remove-pages.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#removeRange", "1");
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("remove-pages.pdf") || !previewText.includes("remove 1 page") || !previewText.includes("keep 1")) throw new Error(`Remove pages PDF preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/reorder-pdf-pages/") {
      await page.setInputFiles("input[type=file]", { name: "reorder.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#pageOrder", "2,1");
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("reorder.pdf") || !previewText.includes("2-page PDF in the typed order")) throw new Error(`Reorder PDF preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/watermark-pdf/") {
      await page.setInputFiles("input[type=file]", { name: "watermark.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#watermarkText", "SAMPLE");
      await page.fill("#pageRange", "1");
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("watermark.pdf") || !previewText.includes("\"SAMPLE\"") || !previewText.includes("1 of 2 pages")) throw new Error(`Watermark PDF preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/stamp-pdf/") {
      await page.setInputFiles("input[type=file]", { name: "stamp.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#stampText", "PAID");
      await page.fill("#pageRange", "2");
      await page.selectOption("#style", "paid");
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("stamp.pdf") || !previewText.includes("\"PAID\"") || !previewText.includes("1 of 2 pages")) throw new Error(`Stamp PDF preview is incomplete: ${previewText}`);
    }
    if (route === "/tools/sign-pdf/") {
      await page.setInputFiles("input[type=file]", { name: "sign.pdf", mimeType: "application/pdf", buffer: twoPagePdf });
      await page.fill("#signatureName", "Alex Rivera");
      await page.fill("#signatureDate", "Jun 1, 2026");
      await page.fill("#pageNumber", "2");
      await page.waitForTimeout(750);
      const previewText = await page.locator("#pdfFilePreview").innerText();
      if (!previewText.includes("sign.pdf") || !previewText.includes("signature block on page 2 of 2")) throw new Error(`Sign PDF preview is incomplete: ${previewText}`);
    }
    const button = page.getByRole("button", { name: "Generate PDF" });
    const pdfUtilityButtonNames = {
      "/tools/merge-pdf/": "Merge PDF",
      "/tools/split-pdf/": "Extract pages",
      "/tools/pdf-to-images/": "Convert to images",
      "/tools/pdf-to-text/": "Extract text",
      "/tools/pdf-to-word/": "Convert to DOCX",
      "/tools/compress-pdf/": "Compress PDF",
      "/tools/pdf-page-numbers/": "Add page numbers",
      "/tools/rotate-pdf/": "Rotate pages",
      "/tools/remove-pdf-pages/": "Remove pages",
      "/tools/reorder-pdf-pages/": "Reorder pages",
      "/tools/watermark-pdf/": "Add watermark",
      "/tools/stamp-pdf/": "Stamp PDF",
      "/tools/sign-pdf/": "Add signature",
    };
    const imageUtilityButtonNames = {
      "/tools/compress-image/": "Compress image",
      "/tools/compress-image-to-kb/": "Compress to KB",
      "/tools/resize-image/": "Resize image",
      "/tools/convert-image/": "Convert image",
      "/tools/remove-background/": "Download PNG",
      "/tools/crop-image/": "Crop image",
      "/tools/rotate-image/": "Rotate image",
      "/tools/watermark-image/": "Watermark image",
      "/tools/add-text-image/": "Add text",
      "/tools/signature-png/": "Download PNG",
      "/tools/passport-photo/": "Download photo",
    };
    const submitButton = pdfUtilityButtonNames[route]
      ? page.getByRole("button", { name: pdfUtilityButtonNames[route] })
      : imageUtilityButtonNames[route]
        ? page.getByRole("button", { name: imageUtilityButtonNames[route] })
        : button;
    let download;
    try {
      [download] = await Promise.all([
        page.waitForEvent("download"),
        submitButton.click(),
      ]);
    } catch (error) {
      const noticeText = await page.locator("#limitNotice").innerText().catch(() => "");
      throw new Error(`Download did not start on ${route}. Notice: ${noticeText || "none"}. ${error.message}`);
    }
    const name = download.suggestedFilename();
    if (imageUtilityButtonNames[route]) {
      if (!/\.(jpg|png|webp)$/.test(name)) throw new Error(`Expected image download on ${route}, got ${name}`);
      const filePath = await download.path();
      const exported = fs.readFileSync(filePath);
      if (exported.length < 100) throw new Error(`Image export on ${route} is unexpectedly small.`);
      if (route === "/tools/signature-png/" && !/signature\.png$/.test(name)) throw new Error(`Expected signature PNG filename on ${route}, got ${name}`);
      if (route === "/tools/remove-background/" && !/transparent\.png$/.test(name)) throw new Error(`Expected transparent PNG filename on ${route}, got ${name}`);
      if (route === "/tools/add-text-image/" && !/-text\.(jpg|png|webp)$/.test(name)) throw new Error(`Expected text overlay image filename on ${route}, got ${name}`);
      if (route === "/tools/passport-photo/" && !/us-2x2\.jpg$/.test(name)) throw new Error(`Expected passport JPG filename on ${route}, got ${name}`);
      continue;
    }
    if (route === "/tools/pdf-to-images/") {
      if (!/\.jpg$/.test(name)) throw new Error(`Expected JPG download on ${route}, got ${name}`);
      const exported = fs.readFileSync(await download.path());
      if (exported.length < 500) throw new Error("PDF-to-image export is unexpectedly small.");
      continue;
    }
    if (route === "/tools/pdf-to-text/") {
      if (!/\.txt$/.test(name)) throw new Error(`Expected TXT download on ${route}, got ${name}`);
      const exported = fs.readFileSync(await download.path(), "utf8");
      if (!exported.includes("Split source 1")) throw new Error(`PDF-to-text export missed source text: ${exported.slice(0, 120)}`);
      continue;
    }
    if (route === "/tools/pdf-to-word/") {
      if (!/\.docx$/.test(name)) throw new Error(`Expected DOCX download on ${route}, got ${name}`);
      const { unzipSync, strFromU8 } = require("fflate");
      const exported = unzipSync(fs.readFileSync(await download.path()));
      const documentXml = exported["word/document.xml"] ? strFromU8(exported["word/document.xml"]) : "";
      if (!documentXml.includes("Split source 1")) throw new Error(`PDF-to-Word export missed source text: ${documentXml.slice(0, 160)}`);
      if (!documentXml.includes("Selectable text only")) throw new Error(`PDF-to-Word export missed local conversion note: ${documentXml.slice(0, 260)}`);
      continue;
    }
    if (route === "/tools/compress-pdf/") {
      if (!/compressed\.pdf$/.test(name)) throw new Error(`Expected compressed PDF filename on ${route}, got ${name}`);
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 1) throw new Error("Compressed PDF should contain one selected rendered page.");
    }
    if (!name.endsWith(".pdf")) throw new Error(`Expected PDF download on ${route}, got ${name}`);
    if (route === "/tools/multi-image-pdf/") {
      const filePath = await download.path();
      const pdf = fs.readFileSync(filePath, "latin1");
      if (!/\/Count\s+2\b/.test(pdf)) throw new Error(`Expected multi-image PDF export to contain two pages. Header sample: ${pdf.slice(0, 220)}`);
    }
    if (route === "/tools/merge-pdf/") {
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 2) throw new Error("Merged PDF should contain two pages.");
    }
    if (route === "/tools/split-pdf/") {
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 1) throw new Error("Split PDF should contain one selected page.");
    }
    if (route === "/tools/pdf-page-numbers/") {
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 2) throw new Error("Page-numbered PDF should preserve page count.");
    }
    if (route === "/tools/rotate-pdf/") {
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 2) throw new Error("Rotated PDF should preserve page count.");
      if ((exported.getPage(0).getRotation().angle || 0) !== 90) throw new Error("Rotated PDF should rotate the selected first page.");
      if ((exported.getPage(1).getRotation().angle || 0) !== 0) throw new Error("Rotated PDF should not rotate unselected pages.");
    }
    if (route === "/tools/remove-pdf-pages/") {
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 1) throw new Error("Remove-pages PDF should keep one page after removing one from a two-page PDF.");
    }
    if (route === "/tools/reorder-pdf-pages/") {
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 2) throw new Error("Reordered PDF should contain two pages.");
    }
    if (route === "/tools/watermark-pdf/") {
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 2) throw new Error("Watermarked PDF should preserve page count.");
    }
    if (route === "/tools/stamp-pdf/") {
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 2) throw new Error("Stamped PDF should preserve page count.");
    }
    if (route === "/tools/sign-pdf/") {
      const exported = await PDFDocument.load(fs.readFileSync(await download.path()));
      if (exported.getPageCount() !== 2) throw new Error("Signed PDF should preserve page count.");
    }
  }

  await page.goto(`${base}/dashboard/`, { waitUntil: "networkidle" });
  const dashboardText = await page.locator("main").innerText();
  if (!dashboardText.includes("live generations") || !dashboardText.includes("live downloads")) throw new Error("Dashboard did not render metrics.");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/tools/name-tracing/`, { waitUntil: "networkidle" });
  const canvasBox = await page.locator("canvas.preview-canvas").boundingBox();
  if (!canvasBox || canvasBox.width < 250) throw new Error("Mobile preview canvas is not visible.");

  await browser.close();
  server.close();
  console.log(`Smoke checks passed. Downloads observed: ${downloads.length}`);
  process.exit(0);
})().catch(async (error) => {
  console.error(error);
  server.close();
  process.exit(1);
});

function samplePng() {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAPAAAACMCAYAAABCtSQoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAXjSURBVHhe7dOhtVAJEARRsiAONFFgNwEEgjAIgCDXrQQJvsw/A/+w/YoS18zYrjf/ff/2I8kzveEhyXMUcPJgBZw8WAEnD1bAyYMVcPJgBZw82IsBv333Psn/hD1SASfD2CMVcDKMPVIBJ8PYI50D5j/J67n2VsDJkGtvBZwMufZWwMmQa28FnAy59lbAyZBrbwWcDLn2VsDJkGtvrx7w209f8hv+/fzhr/LP149/FfZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69vXrASX7dtbcCToZceyvgZMi1twJOhlx7K+BkyLW3Ak6GXHsr4GTItbcCToZcezsHnOTPYY9UwMkw9kgFnAxjj1TAyTD2SC8GnGRXAScPVsDJgxVw8mAFnDxYAScPVsDJgxVw8mA/AWzF0TriPjnQAAAAAElFTkSuQmCC",
    "base64",
  );
}

async function samplePdf(label, pageCount = 1) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pageCount; i += 1) {
    const page = doc.addPage([360, 240]);
    page.drawText(`${label} ${i + 1}`, { x: 48, y: 130, size: 20, font, color: rgb(0.1, 0.2, 0.24) });
  }
  return Buffer.from(await doc.save());
}
