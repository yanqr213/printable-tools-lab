const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportPath = path.join(root, "reports", "gist-discovery.json");
const failures = [];

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  if (!fs.existsSync(reportPath)) {
    failures.push("Missing reports/gist-discovery.json.");
  } else {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    if (!report.htmlUrl || !report.htmlUrl.includes("gist.github.com/")) failures.push("Gist report missing htmlUrl.");
    if (!report.rawUrl || !report.rawUrl.includes("gist.githubusercontent.com/")) failures.push("Gist report missing rawUrl.");
    if (report.public !== true) failures.push("Gist must be public.");
    if (report.videoAssetCount < 6) failures.push("Gist report should include 6 video assets.");
    await verifyUrl(report.htmlUrl, "PrintableTools Lab zero-cost share kit", "ptl-pdf-under-1mb.mp4");
    await verifyUrl(report.rawUrl, "Compress PDF to 1MB", "utm_source=gist");
  }

  if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join("\n"));
    process.exit(1);
  }
  console.log("Gist discovery verification passed.");
}

async function verifyUrl(url, ...needles) {
  try {
    const response = await fetch(url, { cache: "no-store", redirect: "follow" });
    const text = await response.text();
    if (!response.ok) {
      failures.push(`${url} returned ${response.status}.`);
      return;
    }
    for (const needle of needles) {
      if (!text.includes(needle)) failures.push(`${url} missing ${needle}.`);
    }
  } catch (error) {
    failures.push(`${url} failed: ${error.message}`);
  }
}
