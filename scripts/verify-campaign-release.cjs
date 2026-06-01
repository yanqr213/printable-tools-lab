const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportPath = path.join(root, "reports", "campaign-assets-release.json");
const failures = [];

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  if (!fs.existsSync(reportPath)) {
    failures.push("Missing campaign-assets-release.json. Run npm.cmd run campaign:publish-assets first.");
  } else {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    if (!report.releaseUrl || !report.releaseUrl.includes("/releases/tag/free-pdf-tools")) failures.push("Report missing release URL.");
    if (!Array.isArray(report.assets) || report.assets.length < 6) failures.push("Report needs at least 6 release assets.");
    for (const asset of report.assets || []) {
      if (!asset.downloadUrl || !asset.downloadUrl.includes("/releases/download/free-pdf-tools/")) failures.push(`${asset.id} missing release download URL.`);
      if (!asset.trackedUrl || !asset.trackedUrl.includes("utm_campaign=zero_cost_push")) failures.push(`${asset.id} missing tracked URL.`);
      if (!asset.captionEn || !asset.captionZh) failures.push(`${asset.id} missing captions.`);
      if (!hasCjk(asset.captionZh)) failures.push(`${asset.id} Chinese caption does not contain CJK characters.`);
      if (asset.sizeBytes < 50000) failures.push(`${asset.id} asset size looks too small.`);
    }
    await verifyReleaseBody(report);
  }

  if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join("\n"));
    process.exit(1);
  }
  console.log("Campaign release verification passed.");
}

function hasCjk(value) {
  return [...String(value || "")].some((char) => {
    const codePoint = char.codePointAt(0);
    return codePoint >= 0x4e00 && codePoint <= 0x9fff;
  });
}

async function verifyReleaseBody(report) {
  try {
    const response = await fetch(report.releaseUrl, { redirect: "follow" });
    const text = await response.text();
    if (!response.ok) {
      failures.push(`Release page not reachable: ${response.status}`);
      return;
    }
    if (!text.includes("Short-video campaign assets")) failures.push("Release body missing campaign asset section.");
    for (const asset of report.assets || []) {
      const assetFile = asset.downloadUrl.split("/").pop();
      if (!text.includes(assetFile)) failures.push(`Release page missing ${assetFile}.`);
    }
  } catch (error) {
    failures.push(`Release page verification failed: ${error.message}`);
  }
}
