const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportPath = path.join(root, "reports", "github-issue-discovery.json");
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
    await verifyIssuePage(report.issueUrl);
  }

  if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join("\n"));
    process.exit(1);
  }
  console.log("GitHub issue discovery verification passed.");
}

async function verifyIssuePage(url) {
  try {
    const response = await fetch(url, { cache: "no-store", redirect: "follow" });
    const text = await response.text();
    if (!response.ok) {
      failures.push(`Issue page returned ${response.status}.`);
      return;
    }
    for (const needle of ["Growth log", "ptl-pdf-under-1mb.mp4", "utm_source=github-issue", "Public Gist mirror"]) {
      if (!text.includes(needle)) failures.push(`Issue page missing ${needle}.`);
    }
  } catch (error) {
    failures.push(`Issue page verification failed: ${error.message}`);
  }
}
