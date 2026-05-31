const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

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
    "/tools/resume-builder/",
    "/tools/cover-letter/",
    "/tools/resignation-letter/",
    "/tools/monthly-calendar/",
    "/tools/meal-planner/",
    "/tools/image-to-pdf/",
    "/tools/multi-image-pdf/",
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
    "/guides/free-resume-builder-pdf/",
    "/guides/free-cover-letter-generator-pdf/",
    "/guides/free-resignation-letter-generator/",
    "/guides/free-monthly-calendar-generator/",
    "/guides/free-meal-planner-generator/",
    "/guides/free-image-to-pdf-converter/",
    "/guides/multiple-images-to-pdf-without-uploading/",
    "/guides/text-to-pdf-converter-no-signup/",
    "/guides/free-sign-in-sheet-generator/",
    "/guides/free-printable-graph-paper-generator/",
    "/guides/free-packing-list-generator/",
    "/guides/free-receipt-generator-pdf/",
    "/guides/weekly-timesheet-generator-pdf/",
    "/guides/free-certificate-generator-pdf/",
    "/guides/printable-to-do-list-generator/",
    "/privacy/",
    "/dashboard/",
  ];

  for (const route of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    if (!response || !response.ok()) throw new Error(`Route failed: ${route}`);
    const title = await page.title();
    if (!title.includes("PrintableTools Lab")) throw new Error(`Bad title for ${route}: ${title}`);
  }

  await page.goto(`${base}/free-pdf-tools/`, { waitUntil: "networkidle" });
  const freePdfText = await page.locator("main").innerText();
  for (const phrase of ["No-upload conversion tools", "Free business PDF tools", "All free PDF generators"]) {
    if (!freePdfText.includes(phrase)) throw new Error(`Free PDF tools page is missing ${phrase}`);
  }
  for (const href of ["/tools/multi-image-pdf/", "/tools/text-to-pdf/", "/tools/timesheet-generator/"]) {
    const linkCount = await page.locator(`main a[href="${href}"]`).count();
    if (!linkCount) throw new Error(`Free PDF tools page is missing link ${href}`);
  }

  await page.goto(`${base}/pdf-tool-finder/`, { waitUntil: "networkidle" });
  const finderText = await page.locator("main").innerText();
  for (const phrase of ["Which free PDF tool should I use?", "Invoice vs receipt", "One image vs many images"]) {
    if (!finderText.includes(phrase)) throw new Error(`PDF tool finder page is missing ${phrase}`);
  }
  for (const href of ["/tools/image-to-pdf/", "/tools/receipt-generator/", "/tools/timesheet-generator/"]) {
    const linkCount = await page.locator(`main a[href="${href}"]`).count();
    if (!linkCount) throw new Error(`PDF tool finder page is missing link ${href}`);
  }

  for (const route of ["/tools/name-tracing/", "/tools/chore-chart/", "/tools/reward-chart/", "/tools/flashcards/", "/tools/weekly-planner/", "/tools/habit-tracker/", "/tools/invoice-generator/", "/tools/estimate-generator/", "/tools/purchase-order/", "/tools/bill-of-sale/", "/tools/rent-receipt/", "/tools/resume-builder/", "/tools/cover-letter/", "/tools/resignation-letter/", "/tools/monthly-calendar/", "/tools/meal-planner/", "/tools/image-to-pdf/", "/tools/multi-image-pdf/", "/tools/text-to-pdf/", "/tools/sign-in-sheet/", "/tools/graph-paper/", "/tools/packing-list/", "/tools/receipt-generator/", "/tools/timesheet-generator/", "/tools/certificate-generator/", "/tools/todo-list/"]) {
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
    const button = page.getByRole("button", { name: "Generate PDF" });
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      button.click(),
    ]);
    const name = download.suggestedFilename();
    if (!name.endsWith(".pdf")) throw new Error(`Expected PDF download on ${route}, got ${name}`);
    if (route === "/tools/multi-image-pdf/") {
      const filePath = await download.path();
      const pdf = fs.readFileSync(filePath, "latin1");
      if (!/\/Count\s+2\b/.test(pdf)) throw new Error(`Expected multi-image PDF export to contain two pages. Header sample: ${pdf.slice(0, 220)}`);
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
