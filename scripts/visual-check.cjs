const path = require("path");
const { chromium } = require("playwright-core");

const root = path.resolve(__dirname, "..");
const serverPath = path.join(root, "scripts", "server.cjs");
process.env.PORT = process.env.PORT || "4182";
require(serverPath);

const base = `http://localhost:${process.env.PORT}`;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  await delay(350);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

  for (const route of ["/tools/invoice-generator/", "/tools/estimate-generator/", "/tools/purchase-order/", "/tools/bill-of-sale/", "/tools/rent-receipt/", "/tools/resume-builder/"]) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
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
    if (!text.includes("AI ideas") || !text.includes("Generate PDF")) throw new Error(`Core actions missing on ${route}`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/tools/invoice-generator/`, { waitUntil: "networkidle" });
  const mobileBox = await page.locator("canvas.preview-canvas").boundingBox();
  if (!mobileBox || mobileBox.width < 250) throw new Error("Mobile invoice preview is not visible.");
  await browser.close();
  console.log("Visual checks passed for business and career tools.");
  process.exit(0);
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
