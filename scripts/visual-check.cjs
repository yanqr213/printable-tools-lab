const path = require("path");
const { chromium } = require("playwright-core");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const root = path.resolve(__dirname, "..");
const serverPath = path.join(root, "scripts", "server.cjs");
process.env.PORT = process.env.PORT || "4182";
require(serverPath);

const base = `http://localhost:${process.env.PORT}`;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function samplePng() {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAPAAAACMCAYAAABCtSQoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAXjSURBVHhe7dOhtVAJEARRsiAONFFgNwEEgjAIgCDXrQQJvsw/A/+w/YoS18zYrjf/ff/2I8kzveEhyXMUcPJgBZw8WAEnD1bAyYMVcPJgBZw82IsBv333Psn/hD1SASfD2CMVcDKMPVIBJ8PYI50D5j/J67n2VsDJkGtvBZwMufZWwMmQa28FnAy59lbAyZBrbwWcDLn2VsDJkGtvrx7w209f8hv+/fzhr/LP149/FfZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69FfAYDtyOA7djL3TtrYDHcOB2HLgde6FrbwU8hgO348Dt2AtdeyvgMRy4HQdux17o2lsBj+HA7ThwO/ZC194KeAwHbseB27EXuvZWwGM4cDsO3I690LW3Ah7Dgdtx4Hbsha69vXrASX7dtbcCToZceyvgZMi1twJOhlx7K+BkyLW3Ak6GXHsr4GTItbcCToZcezsHnOTPYY9UwMkw9kgFnAxjj1TAyTD2SC8GnGRXAScPVsDJgxVw8mAFnDxYAScPVsDJgxVw8mA/AWzF0TriPjnQAAAAAElFTkSuQmCC",
    "base64",
  );
}

(async () => {
  await delay(350);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const imageRoutes = new Set([
    "/tools/compress-image/",
    "/tools/compress-image-to-kb/",
    "/tools/resize-image/",
    "/tools/convert-image/",
    "/tools/remove-background/",
    "/tools/crop-image/",
    "/tools/rotate-image/",
    "/tools/watermark-image/",
    "/tools/signature-png/",
    "/tools/passport-photo/",
  ]);

  const pdfSample = await samplePdf("Visual scan", 2);
  for (const route of ["/tools/invoice-generator/", "/tools/estimate-generator/", "/tools/purchase-order/", "/tools/bill-of-sale/", "/tools/rent-receipt/", "/tools/business-card/", "/tools/address-labels/", "/tools/price-tag/", "/tools/flyer-maker/", "/tools/barcode-labels/", "/tools/coupon-maker/", "/tools/packing-slip/", "/tools/work-order/", "/tools/inventory-sheet/", "/tools/resume-builder/", "/tools/ats-resume-checker/", "/tools/cover-letter/", "/tools/resignation-letter/", "/tools/monthly-calendar/", "/tools/meal-planner/", "/tools/image-to-pdf/", "/tools/multi-image-pdf/", "/tools/compress-pdf/", "/tools/pdf-to-word/", "/tools/compress-image/", "/tools/compress-image-to-kb/", "/tools/resize-image/", "/tools/convert-image/", "/tools/remove-background/", "/tools/crop-image/", "/tools/rotate-image/", "/tools/watermark-image/", "/tools/signature-png/", "/tools/passport-photo/", "/tools/qr-code/", "/tools/wifi-qr-code/", "/tools/vcard-qr-code/", "/tools/text-to-pdf/", "/tools/markdown-to-pdf/", "/tools/csv-to-pdf/", "/tools/json-to-pdf/", "/tools/sign-in-sheet/", "/tools/graph-paper/", "/tools/packing-list/", "/tools/receipt-generator/", "/tools/timesheet-generator/", "/tools/certificate-generator/", "/tools/todo-list/"]) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    if (route === "/tools/compress-pdf/") {
      await page.setInputFiles("input[type=file]", { name: "scan.pdf", mimeType: "application/pdf", buffer: pdfSample });
      await page.fill("#pageRange", "1");
      await page.waitForTimeout(500);
      const text = await page.locator("main").innerText();
      if (!text.includes("image-based PDF")) throw new Error("Compress PDF preview is missing tradeoff copy.");
      continue;
    }
    if (route === "/tools/pdf-to-word/") {
      await page.setInputFiles("input[type=file]", { name: "word.pdf", mimeType: "application/pdf", buffer: pdfSample });
      await page.fill("#pageRange", "1");
      await page.waitForTimeout(500);
      const text = await page.locator("main").innerText();
      if (!text.includes("DOCX") || !text.includes("selectable text") || !text.includes("Scanned PDFs need OCR")) throw new Error("PDF to Word preview is missing conversion limit copy.");
      continue;
    }
    if (imageRoutes.has(route) && route !== "/tools/signature-png/") {
      await page.setInputFiles("input[type=file]", {
        name: "photo.png",
        mimeType: "image/png",
        buffer: samplePng(),
      });
      if (route === "/tools/remove-background/") {
        await page.selectOption("#sample", "white");
        await page.selectOption("#tolerance", "108");
      }
      if (route === "/tools/watermark-image/") await page.fill("#watermarkText", "SAMPLE");
      await page.waitForTimeout(500);
    }
    if (route === "/tools/signature-png/") {
      await page.fill("#signatureName", "Alex Rivera");
      await page.waitForTimeout(500);
    }
    if (route === "/tools/ats-resume-checker/") {
      await page.fill("#targetRole", "Customer Success Specialist");
      await page.fill("#jobDescription", "Customer success role requiring onboarding, CRM, support tickets, retention, reporting, communication, and customer feedback follow-up.");
      await page.waitForTimeout(500);
    }
    if (route === "/tools/passport-photo/") {
      await page.selectOption("#preset", "us-passport");
      await page.selectOption("#output", "single-jpg");
      await page.waitForTimeout(500);
    }
    const canvas = page.locator("canvas.preview-canvas");
    await canvas.waitFor();
    const box = await canvas.boundingBox();
    if (!box || box.width < 520 || box.height < 650) throw new Error(`Desktop preview is too small on ${route}`);
    const sample = await page.evaluate(() => {
      const canvas = document.querySelector("canvas.preview-canvas");
      const ctx = canvas.getContext("2d");
      const data = ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;
      return Array.from(data);
    });
    if (sample[3] === 0) throw new Error(`Canvas appears transparent on ${route}`);
    const text = await page.locator("main").innerText();
    const imageRoute = /\/tools\/(compress-image|compress-image-to-kb|resize-image|convert-image|remove-background|crop-image|rotate-image|watermark-image|signature-png|passport-photo)\//.test(route);
    if (!imageRoute && !text.includes("Generate PDF")) throw new Error(`Core action missing on ${route}`);
    if (imageRoute && !text.includes("Image preview")) throw new Error(`Image action area missing on ${route}`);
    const noAiRoute = route.includes("image-to-pdf") || route.includes("multi-image-pdf") || route.includes("ats-resume-checker") || /\/tools\/(qr-code|wifi-qr-code|vcard-qr-code)\//.test(route);
    if (!noAiRoute && !imageRoute && !route.includes("graph-paper") && !route.includes("address-labels") && !route.includes("barcode-labels") && !text.includes("AI ideas")) throw new Error(`AI action missing on ${route}`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/tools/invoice-generator/`, { waitUntil: "networkidle" });
  const mobileBox = await page.locator("canvas.preview-canvas").boundingBox();
  if (!mobileBox || mobileBox.width < 250) throw new Error("Mobile invoice preview is not visible.");
  await browser.close();
  console.log("Visual checks passed for high-intent browser tools.");
  process.exit(0);
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});

async function samplePdf(label, pages = 1) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pages; i += 1) {
    const page = doc.addPage([612, 792]);
    page.drawText(`${label} ${i + 1}`, { x: 72, y: 700, size: 22, font, color: rgb(0.08, 0.18, 0.22) });
    page.drawRectangle({ x: 72, y: 520, width: 360, height: 120, color: rgb(0.86, 0.94, 0.96) });
  }
  return Buffer.from(await doc.save());
}
