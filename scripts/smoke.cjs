const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const root = path.resolve(__dirname, "..");
const serverPath = path.join(root, "scripts", "server.cjs");
process.env.PORT = process.env.PORT || "4181";
require(serverPath);

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
    "/free-invoice-generator-no-signup/",
    "/jpg-to-pdf-no-upload/",
    "/multiple-images-to-pdf-no-upload/",
    "/text-to-pdf-no-signup/",
    "/free-resume-builder-no-signup/",
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
    "/tools/cover-letter/",
    "/tools/resignation-letter/",
    "/tools/monthly-calendar/",
    "/tools/meal-planner/",
    "/tools/image-to-pdf/",
    "/tools/multi-image-pdf/",
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
    "/guides/free-cover-letter-generator-pdf/",
    "/guides/free-resignation-letter-generator/",
    "/guides/free-monthly-calendar-generator/",
    "/guides/free-meal-planner-generator/",
    "/guides/free-image-to-pdf-converter/",
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
    "/guides/free-sign-in-sheet-generator/",
    "/guides/free-printable-graph-paper-generator/",
    "/guides/free-packing-list-generator/",
    "/guides/free-receipt-generator-pdf/",
    "/guides/weekly-timesheet-generator-pdf/",
    "/guides/free-certificate-generator-pdf/",
    "/guides/printable-to-do-list-generator/",
    "/submit-directory/",
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
  for (const phrase of ["No-upload conversion tools", "Free business PDF tools", "All free PDF generators"]) {
    if (!freePdfText.includes(phrase)) throw new Error(`Free PDF tools page is missing ${phrase}`);
  }
  for (const href of ["/tools/multi-image-pdf/", "/tools/merge-pdf/", "/tools/split-pdf/", "/tools/pdf-page-numbers/", "/tools/rotate-pdf/", "/tools/remove-pdf-pages/", "/tools/reorder-pdf-pages/", "/tools/watermark-pdf/", "/tools/stamp-pdf/", "/tools/sign-pdf/", "/tools/text-to-pdf/", "/tools/timesheet-generator/", "/tools/business-card/", "/tools/barcode-labels/", "/tools/packing-slip/", "/tools/work-order/", "/tools/inventory-sheet/"]) {
    const linkCount = await page.locator(`main a[href="${href}"]`).count();
    if (!linkCount) throw new Error(`Free PDF tools page is missing link ${href}`);
  }

  await page.goto(`${base}/pdf-tool-finder/`, { waitUntil: "networkidle" });
  const finderText = await page.locator("main").innerText();
  for (const phrase of ["Which free PDF tool should I use?", "Invoice vs receipt", "One image vs many images"]) {
    if (!finderText.includes(phrase)) throw new Error(`PDF tool finder page is missing ${phrase}`);
  }
  for (const href of ["/tools/image-to-pdf/", "/tools/merge-pdf/", "/tools/split-pdf/", "/tools/pdf-page-numbers/", "/tools/rotate-pdf/", "/tools/remove-pdf-pages/", "/tools/reorder-pdf-pages/", "/tools/watermark-pdf/", "/tools/stamp-pdf/", "/tools/sign-pdf/", "/tools/receipt-generator/", "/tools/timesheet-generator/", "/tools/business-card/", "/tools/price-tag/", "/tools/packing-slip/", "/tools/work-order/", "/tools/inventory-sheet/"]) {
    const linkCount = await page.locator(`main a[href="${href}"]`).count();
    if (!linkCount) throw new Error(`PDF tool finder page is missing link ${href}`);
  }

  await page.goto(`${base}/submit-directory/`, { waitUntil: "networkidle" });
  const submissionPackText = await page.locator("main").innerText();
  for (const phrase of ["Copy-ready listing details", "Primary links for reviewers", "Representative tools"]) {
    if (!submissionPackText.includes(phrase)) throw new Error(`Directory submission pack is missing ${phrase}`);
  }

  const onePagePdf = await samplePdf("First document");
  const secondPagePdf = await samplePdf("Second document");
  const twoPagePdf = await samplePdf("Split source", 2);

  for (const route of ["/tools/name-tracing/", "/tools/chore-chart/", "/tools/reward-chart/", "/tools/flashcards/", "/tools/weekly-planner/", "/tools/habit-tracker/", "/tools/invoice-generator/", "/tools/estimate-generator/", "/tools/purchase-order/", "/tools/bill-of-sale/", "/tools/rent-receipt/", "/tools/business-card/", "/tools/address-labels/", "/tools/price-tag/", "/tools/flyer-maker/", "/tools/barcode-labels/", "/tools/coupon-maker/", "/tools/packing-slip/", "/tools/work-order/", "/tools/inventory-sheet/", "/tools/resume-builder/", "/tools/cover-letter/", "/tools/resignation-letter/", "/tools/monthly-calendar/", "/tools/meal-planner/", "/tools/image-to-pdf/", "/tools/multi-image-pdf/", "/tools/merge-pdf/", "/tools/split-pdf/", "/tools/pdf-page-numbers/", "/tools/rotate-pdf/", "/tools/remove-pdf-pages/", "/tools/reorder-pdf-pages/", "/tools/watermark-pdf/", "/tools/stamp-pdf/", "/tools/sign-pdf/", "/tools/text-to-pdf/", "/tools/sign-in-sheet/", "/tools/graph-paper/", "/tools/packing-list/", "/tools/receipt-generator/", "/tools/timesheet-generator/", "/tools/certificate-generator/", "/tools/todo-list/"]) {
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
      "/tools/pdf-page-numbers/": "Add page numbers",
      "/tools/rotate-pdf/": "Rotate pages",
      "/tools/remove-pdf-pages/": "Remove pages",
      "/tools/reorder-pdf-pages/": "Reorder pages",
      "/tools/watermark-pdf/": "Add watermark",
      "/tools/stamp-pdf/": "Stamp PDF",
      "/tools/sign-pdf/": "Add signature",
    };
    const submitButton = pdfUtilityButtonNames[route] ? page.getByRole("button", { name: pdfUtilityButtonNames[route] }) : button;
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
  if (!dashboardText.includes("PDF generations")) throw new Error("Dashboard did not render metrics.");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/tools/name-tracing/`, { waitUntil: "networkidle" });
  const canvasBox = await page.locator("canvas.preview-canvas").boundingBox();
  if (!canvasBox || canvasBox.width < 250) throw new Error("Mobile preview canvas is not visible.");

  await browser.close();
  console.log(`Smoke checks passed. Downloads observed: ${downloads.length}`);
  process.exit(0);
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});

function samplePng() {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAIAAAD2HxkiAAAAA3NCSVQICAjb4U/gAAABQklEQVR4nO3YQQ6CMBAF0fz/0zv2FQvEgpcqJmO0ZeEyr0wIgYHfWesJAOB/JAQkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJAQkBCTE9WxbKx3Hsd2z7fq+3/d9zvM8jmPbdk3TzPM8x3Hc932/7/v+933f930fAKhkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJMT1bFsrnU6n0+k8z/Pbtk3TzPM8x3Hc930fR+n7PgBQyQhICEgISAiICEgISAiICEgISAiICEgISAiICEgISAiICEgISIjr2bZWCoVCoVAoFAqFQqFQKBSKxWLRdV2n0+n7fgBQyQhICEgISAiICEgISAiICEgISAiICEgISAiICEgISAiICEgISIjr2bZWkiRJkiRJkiRJkiRJkiRJkmRZFsfxAIBKRkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJAQkBCQEJAQkxPUH5+YedERKmfUAAAAASUVORK5CYII=",
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
