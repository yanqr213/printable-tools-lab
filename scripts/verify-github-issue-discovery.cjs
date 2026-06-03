const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportPath = path.join(root, "reports", "github-issue-discovery.json");
const shareKitPushPath = path.join(root, "reports", "share-kit-push.json");
const failures = [];

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  if (!fs.existsSync(reportPath)) {
    failures.push("Missing reports/github-issue-discovery.json.");
  } else {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    if (!report.issueUrl || !report.issueUrl.includes("/issues/")) failures.push("Issue report missing issueUrl.");
    if (report.state !== "open") failures.push("Issue must be open.");
    const buyerPathPublished = Boolean(report.buyerIntentPath?.auditUrl || report.buyerIntentPath?.serviceUrl);
    if (!buyerPathPublished && !githubPublishSkipped("githubIssueDiscovery")) failures.push("Issue report missing buyer-intent path. Run npm.cmd run github-issue-discovery.");
    if (buyerPathPublished && !String(report.buyerIntentPath?.auditUrl || "").includes("market_table_audit")) failures.push("Issue report missing buyer-intent audit URL.");
    if (buyerPathPublished && !String(report.buyerIntentPath?.serviceUrl || "").includes("service_sales_pack")) failures.push("Issue report missing buyer-intent service URL.");
    await verifyIssuePage(report.issueUrl, buyerPathPublished);
  }

  if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join("\n"));
    process.exit(1);
  }
  console.log("GitHub issue discovery verification passed.");
}

async function verifyIssuePage(url, buyerPathPublished) {
  try {
    const response = await fetch(url, { cache: "no-store", redirect: "follow" });
    const text = await response.text();
    if (!response.ok) {
      failures.push(`Issue page returned ${response.status}.`);
      return;
    }
    const buyerNeedles = buyerPathPublished ? ["Free Market Table Print Audit", "market_table_audit", "Custom Local Print Pack Setup", "paid_order_verified"] : [];
    for (const needle of ["Growth log", "ptl-pdf-under-1mb.mp4", "utm_source=github-issue", "Public Gist mirror", "portal-submission-pack", "Expanded backup portals", ...buyerNeedles]) {
      if (!text.includes(needle)) failures.push(`Issue page missing ${needle}.`);
    }
  } catch (error) {
    failures.push(`Issue page verification failed: ${error.message}`);
  }
}

function githubPublishSkipped(actionName) {
  if (!fs.existsSync(shareKitPushPath)) return false;
  try {
    const report = JSON.parse(fs.readFileSync(shareKitPushPath, "utf8"));
    return report.actions?.[actionName]?.skipped === true && String(report.actions?.[actionName]?.reason || "").includes("GitHub token");
  } catch {
    return false;
  }
}
