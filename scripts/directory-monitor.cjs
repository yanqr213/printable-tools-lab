const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportDir = path.join(root, "reports");
const reportPath = path.join(reportDir, "directory-monitor.json");
const siteHost = "printable-tools-lab.pages.dev";

const directories = [
  {
    name: "Zearches",
    url: "https://zearches.com/",
    searchUrl: "https://zearches.com/?s=PrintableTools+Lab",
    expected: [siteHost],
    submittedAt: "2026-06-01",
    reviewWindow: "unknown",
  },
  {
    name: "ListAi.cc",
    url: "https://listai.cc/",
    searchUrl: "https://listai.cc/?s=PrintableTools+Lab",
    expected: [siteHost],
    submittedAt: "2026-06-01",
    reviewWindow: "24-48 hours",
  },
  {
    name: "NoSignupTools",
    url: "https://nosignuptools.com/",
    searchUrl: "https://nosignuptools.com/?q=PrintableTools+Lab",
    expected: [siteHost],
    submittedAt: "2026-06-01",
    reviewWindow: "24-48 hours",
  },
  {
    name: "FreeNoSignup",
    url: "https://freenosignup.com/",
    searchUrl: "https://freenosignup.com/?s=PrintableTools+Lab",
    expected: [siteHost],
    submittedAt: "2026-06-01",
    reviewWindow: "3-5 business days",
  },
  {
    name: "JS.ORG free subdomain",
    url: "https://github.com/js-org/js.org/pull/11512",
    searchUrl: "https://github.com/js-org/js.org/pull/11512",
    expected: ["Add printable-tools-lab.js.org", "printable-tools-lab.pages.dev"],
    submittedAt: "2026-06-02",
    reviewWindow: "maintainer review",
  },
];

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  const results = [];
  for (const directory of directories) {
    results.push(await checkDirectory(directory));
  }
  const report = {
    generatedAt: new Date().toISOString(),
    site: `https://${siteHost}/`,
    listedCount: results.filter((item) => item.status === "listed").length,
    pendingCount: results.filter((item) => item.status === "pending").length,
    errorCount: results.filter((item) => item.status === "error").length,
    results,
  };
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  printReport(report);
}

async function checkDirectory(directory) {
  const targets = [directory.searchUrl, directory.url].filter(Boolean);
  const checked = [];
  for (const url of targets) {
    const result = await fetchText(url);
    checked.push(result);
    if (result.ok && hasExpectedText(result.text, directory.expected)) {
      return {
        ...directory,
        status: directory.name.includes("JS.ORG") ? jsOrgStatus(result.text) : "listed",
        evidenceUrl: url,
        checked,
      };
    }
  }
  if (checked.some((item) => item.ok)) {
    return {
      ...directory,
      status: "pending",
      evidenceUrl: "",
      checked,
    };
  }
  return {
    ...directory,
    status: "error",
    evidenceUrl: "",
    checked,
  };
}

async function fetchText(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "PrintableToolsLab-DirectoryMonitor" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await response.text();
    return {
      url,
      ok: response.ok,
      status: response.status,
      bytes: Buffer.byteLength(text),
      matched: hasExpectedText(text, [siteHost]),
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      bytes: 0,
      matched: false,
      error: error.message,
    };
  }
}

function hasExpectedText(text, expected) {
  const haystack = String(text).toLowerCase();
  return expected.some((needle) => haystack.includes(String(needle).toLowerCase()));
}

function jsOrgStatus(text) {
  const haystack = String(text).toLowerCase();
  if (haystack.includes("merged")) return "listed";
  if (haystack.includes("closed")) return "error";
  return "pending";
}

function printReport(report) {
  console.log(`Directory monitor: ${report.listedCount} listed, ${report.pendingCount} pending, ${report.errorCount} error`);
  for (const item of report.results) {
    const suffix = item.evidenceUrl ? ` (${item.evidenceUrl})` : "";
    console.log(`- ${item.name}: ${item.status}${suffix}`);
  }
  console.log(`Report written to ${path.relative(root, reportPath)}`);
}
