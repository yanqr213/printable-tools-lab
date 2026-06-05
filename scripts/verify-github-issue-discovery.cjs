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
    const freeHelpPublished = Boolean(report.freeHelpPath?.auditUrl || report.freeHelpPath?.freeToolDirectoryUrl);
    if (!freeHelpPublished && !githubPublishSkipped("githubIssueDiscovery")) failures.push("Issue report missing free-help path. Run npm.cmd run github-issue-discovery.");
    if (freeHelpPublished && !String(report.freeHelpPath?.auditUrl || "").includes("market_table_audit")) failures.push("Issue report missing free-help audit URL.");
    if (freeHelpPublished && !String(report.freeHelpPath?.freeToolDirectoryUrl || "").includes("free_tool_depth")) failures.push("Issue report missing free-tool depth URL.");
    await verifyIssuePage(report.issueUrl, freeHelpPublished);
  }

  if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join("\n"));
    process.exit(1);
  }
  console.log("GitHub issue discovery verification passed.");
}

async function verifyIssuePage(url, freeHelpPublished) {
  try {
    const response = await fetch(url, { cache: "no-store", redirect: "follow" });
    const text = await response.text();
    if (!response.ok) {
      failures.push(`Issue page returned ${response.status}.`);
      return;
    }
    const freeHelpNeedles = freeHelpPublished ? ["Free Market Table Print Audit", "market_table_audit", "free_tool_depth", "future ads must never block"] : [];
    for (const needle of ["Growth log", "ptl-pdf-under-1mb.mp4", "utm_source=github-issue", "Public Gist mirror", "portal-submission-pack", "Expanded backup portals", ...freeHelpNeedles]) {
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
