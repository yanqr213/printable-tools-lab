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
  if (directory.name.includes("JS.ORG")) return checkJsOrg(directory);
  const targets = [directory.searchUrl, directory.url].filter(Boolean);
  const checked = [];
  for (const url of targets) {
    const result = await fetchText(url);
    checked.push(result);
    if (result.ok && hasExpectedText(result.text, directory.expected)) {
      return {
        ...directory,
        status: "listed",
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

async function checkJsOrg(directory) {
  const [page, api, checks] = await Promise.all([
    fetchText(directory.url),
    fetchJson("https://api.github.com/repos/js-org/js.org/pulls/11512"),
    fetchJson("https://api.github.com/repos/js-org/js.org/commits/f68060b27af6e352d344ecedc64065d93911326b/check-runs"),
  ]);
  const body = String(api.json?.body || "");
  const templateOk = body.includes("- [x] There is reasonable content")
    && body.includes("- [x] I have read and accepted")
    && body.includes("https://printable-tools-lab.pages.dev/")
    && body.includes("relevant to JavaScript developers");
  const latestChecks = latestCheckRuns(checks.json?.check_runs || []);
  const checksOk = latestChecks.length > 0 && latestChecks.every((check) => check.conclusion === "success");
  let status = "pending";
  if (api.json?.merged || /merged/i.test(page.text || "")) status = "listed";
  else if (api.json?.state === "closed") status = "error";
  else if (!templateOk || latestChecks.some((check) => check.conclusion === "failure")) status = "error";
  return {
    ...directory,
    status,
    evidenceUrl: directory.url,
    templateOk,
    checksOk,
    checks: latestChecks,
    prState: api.json?.state || "unknown",
    mergeable: api.json?.mergeable ?? null,
    checked: [
      slimCheck(page),
      slimCheck(api, { matched: templateOk }),
      slimCheck(checks, { matched: checksOk }),
    ],
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

async function fetchJson(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "PrintableToolsLab-DirectoryMonitor",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const json = await response.json().catch(() => null);
    return {
      url,
      ok: response.ok,
      status: response.status,
      bytes: JSON.stringify(json || "").length,
      matched: false,
      json,
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

function latestCheckRuns(runs) {
  const byName = new Map();
  for (const run of runs) {
    const current = byName.get(run.name);
    if (!current || Date.parse(run.started_at || "") > Date.parse(current.started_at || "")) byName.set(run.name, run);
  }
  return Array.from(byName.values()).map((run) => ({
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    startedAt: run.started_at,
    url: run.html_url,
  }));
}

function slimCheck(result, overrides = {}) {
  return {
    url: result.url,
    ok: Boolean(result.ok),
    status: result.status,
    bytes: result.bytes,
    matched: Boolean(overrides.matched ?? result.matched),
    error: result.error || undefined,
  };
}

function printReport(report) {
  console.log(`Directory monitor: ${report.listedCount} listed, ${report.pendingCount} pending, ${report.errorCount} error`);
  for (const item of report.results) {
    const suffix = item.evidenceUrl ? ` (${item.evidenceUrl})` : "";
    console.log(`- ${item.name}: ${item.status}${suffix}`);
  }
  console.log(`Report written to ${path.relative(root, reportPath)}`);
}
