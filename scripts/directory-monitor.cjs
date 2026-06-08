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
    name: "TechTools Launchpad site listing",
    url: "https://techtools.cz/tools/launchpad/",
    searchUrl: "https://techtools.cz/launchpad-api/tools?per_page=100&sort=recent",
    expected: [siteHost, "PrintableTools Lab"],
    submittedAt: "2026-06-06",
    reviewWindow: "auto-approved API listing",
  },
  {
    name: "TechTools Launchpad upload-limit listing",
    url: "https://techtools.cz/tools/launchpad/?tool=162",
    searchUrl: "https://techtools.cz/launchpad-api/tools/162",
    expected: [siteHost, "Upload Limit Fixer"],
    submittedAt: "2026-06-06",
    reviewWindow: "auto-approved API listing for the high-intent upload-limit entry",
  },
  {
    name: "TechTools Launchpad invoice listing",
    url: "https://techtools.cz/tools/launchpad/?tool=168",
    searchUrl: "https://techtools.cz/launchpad-api/tools/168",
    expected: [siteHost, "Invoice Generator"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the invoice-to-service lead path",
  },
  {
    name: "TechTools Launchpad invoice follow-up service listing",
    url: "https://techtools.cz/tools/launchpad/?tool=169",
    searchUrl: "https://techtools.cz/launchpad-api/tools/169",
    expected: [siteHost, "Invoice Follow-up Copy Pack"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the invoice follow-up service path",
  },
  {
    name: "TechTools Launchpad invoice follow-up email generator listing",
    url: "https://techtools.cz/tools/launchpad/?tool=170",
    searchUrl: "https://techtools.cz/launchpad-api/tools/170",
    expected: [siteHost, "Invoice Follow-up Email Generator"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the invoice follow-up email generator path",
  },
  {
    name: "TechTools Launchpad overdue invoice reminder listing",
    url: "https://techtools.cz/tools/launchpad/?tool=171",
    searchUrl: "https://techtools.cz/launchpad-api/tools/171",
    expected: [siteHost, "Overdue Invoice Reminder Email"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the overdue invoice reminder service-lead path",
  },
  {
    name: "TechTools Launchpad upload limit fix plan service listing",
    url: "https://techtools.cz/tools/launchpad/?tool=172",
    searchUrl: "https://techtools.cz/launchpad-api/tools/172",
    expected: [siteHost, "Upload Limit Fix Plan"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the $9 upload fix plan service path",
  },
  {
    name: "TechTools Launchpad upload error cheatsheet listing",
    url: "https://techtools.cz/tools/launchpad/?tool=173",
    searchUrl: "https://techtools.cz/launchpad-api/tools/173",
    expected: [siteHost, "Upload Error Cheatsheet"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the upload error cheatsheet path",
  },
  {
    name: "TechTools Launchpad compress PDF to 1MB listing",
    url: "https://techtools.cz/tools/launchpad/?tool=174",
    searchUrl: "https://techtools.cz/launchpad-api/tools/174",
    expected: [siteHost, "Compress PDF to 1MB"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the high-intent PDF 1MB upload-error path",
  },
  {
    name: "TechTools Launchpad PDF under 1MB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=175",
    searchUrl: "https://techtools.cz/launchpad-api/tools/175",
    expected: [siteHost, "PDF Under 1MB Upload Fix"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the tool-level pre-download upload fix path",
  },
  {
    name: "TechTools Launchpad photo under 100KB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=176",
    searchUrl: "https://techtools.cz/launchpad-api/tools/176",
    expected: [siteHost, "Photo Under 100KB Upload Fix"],
    submittedAt: "2026-06-08",
    reviewWindow: "auto-approved API listing for the tool-level photo 100KB upload fix path",
  },
  {
    name: "TechTools Launchpad image under 2MB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=177",
    searchUrl: "https://techtools.cz/launchpad-api/tools/177",
    expected: [siteHost, "Image Under 2MB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the tool-level image 2MB upload fix path",
  },
  {
    name: "TechTools Launchpad JPG under 200KB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=178",
    searchUrl: "https://techtools.cz/launchpad-api/tools/178",
    expected: [siteHost, "JPG Under 200KB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the tool-level JPG 200KB upload fix path",
  },
  {
    name: "TechTools Launchpad resume PDF too large upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=179",
    searchUrl: "https://techtools.cz/launchpad-api/tools/179",
    expected: [siteHost, "Resume PDF Too Large Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the resume PDF upload fix path",
  },
  {
    name: "TechTools Launchpad PNG screenshot too large upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=180",
    searchUrl: "https://techtools.cz/launchpad-api/tools/180",
    expected: [siteHost, "PNG Screenshot Too Large Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the PNG screenshot upload fix path",
  },
  {
    name: "TechTools Launchpad passport photo 50KB upload fix listing",
    url: "https://techtools.cz/tools/launchpad/?tool=181",
    searchUrl: "https://techtools.cz/launchpad-api/tools/181",
    expected: [siteHost, "Passport Photo 50KB Upload Fix"],
    submittedAt: "2026-06-09",
    reviewWindow: "auto-approved API listing for the passport photo 50KB upload fix path",
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
    name: "NoSignupTools overdue invoice reminder listing",
    url: "https://nosignuptools.com/tools/overdue-invoice-reminder-email-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Overdue+Invoice+Reminder+Email",
    expected: [siteHost, "Overdue Invoice Reminder Email"],
    submittedAt: "2026-06-08",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools upload limit fixer listing",
    url: "https://nosignuptools.com/tools/upload-limit-fixer-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Upload+Limit+Fixer",
    expected: [siteHost, "Upload Limit Fixer"],
    submittedAt: "2026-06-08",
    reviewWindow: "24-48 hour manual review after public API success response",
  },
  {
    name: "NoSignupTools upload error cheatsheet listing",
    url: "https://nosignuptools.com/tools/upload-error-cheatsheet-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Upload+Error+Cheatsheet",
    expected: [siteHost, "Upload Error Cheatsheet"],
    submittedAt: "2026-06-08",
    reviewWindow: "24-48 hour manual review after public API success response",
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
    name: "FreeNoSignup overdue invoice reminder listing",
    url: "https://freenosignup.com/",
    searchUrl: "https://freenosignup.com/?s=Overdue+Invoice+Reminder+Email",
    expected: [siteHost, "Overdue Invoice Reminder Email"],
    submittedAt: "2026-06-08",
    reviewWindow: "3-5 business day manual review after public Google Form confirmation",
  },
  {
    name: "FreeNoSignup upload limit fixer listing",
    url: "https://freenosignup.com/",
    searchUrl: "https://freenosignup.com/?s=Upload+Limit+Fixer",
    expected: [siteHost, "Upload Limit Fixer"],
    submittedAt: "2026-06-08",
    reviewWindow: "3-5 business day manual review after public Google Form confirmation",
  },
  {
    name: "FreeNoSignup upload error cheatsheet listing",
    url: "https://freenosignup.com/",
    searchUrl: "https://freenosignup.com/?s=Upload+Error+Cheatsheet",
    expected: [siteHost, "Upload Error Cheatsheet"],
    submittedAt: "2026-06-08",
    reviewWindow: "3-5 business day manual review after public Google Form confirmation",
  },
  {
    name: "NoLogin.tools",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev",
    searchUrl: "https://nologin.tools/?q=PrintableTools+Lab",
    expected: [siteHost, "PrintableTools Lab"],
    submittedAt: "2026-06-03",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev",
  },
  {
    name: "NoLogin.tools upload-limit listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-limit-fixer",
    searchUrl: "https://nologin.tools/?q=Upload+Limit+Fixer",
    expected: [siteHost, "Upload Limit Fixer"],
    submittedAt: "2026-06-06",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-upload-limit-fixer",
  },
  {
    name: "NoLogin.tools upload error cheatsheet listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-error-cheatsheet",
    searchUrl: "https://nologin.tools/?q=Upload+Error+Cheatsheet",
    expected: [siteHost, "Upload Error Cheatsheet"],
    submittedAt: "2026-06-08",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-upload-error-cheatsheet",
  },
  {
    name: "NoLogin.tools invoice follow-up email generator listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-tools-invoice-followup-email",
    searchUrl: "https://nologin.tools/?q=Invoice+Follow-up+Email+Generator",
    expected: [siteHost, "Invoice Follow-up Email Generator"],
    submittedAt: "2026-06-08",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-tools-invoice-followup-email",
  },
  {
    name: "NoLogin.tools overdue invoice reminder listing",
    url: "https://nologin.tools/tool/printable-tools-lab-pages-dev-overdue-invoice-reminder-email",
    searchUrl: "https://nologin.tools/?q=Overdue+Invoice+Reminder+Email",
    expected: [siteHost, "Overdue Invoice Reminder Email"],
    submittedAt: "2026-06-08",
    reviewWindow: "human review after API submission accepted with slug printable-tools-lab-pages-dev-overdue-invoice-reminder-email",
  },
  {
    name: "NoSubscription.org",
    url: "https://nosubscription.org/",
    searchUrl: "https://nosubscription.org/?s=PrintableTools+Lab",
    expected: [siteHost, "PrintableTools Lab"],
    submittedAt: "2026-06-03",
    reviewWindow: "free open-source submission accepted by Google Apps Script endpoint; slow review states 4-6 weeks",
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
    const result = await fetchText(url, directory.expected);
    checked.push(slimCheck(result));
    if (result.ok && result.matched) {
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
  const headers = githubHeaders();
  const [page, api, checks] = await Promise.all([
    fetchText(directory.url, directory.expected),
    fetchJson("https://api.github.com/repos/js-org/js.org/pulls/11512", headers),
    fetchJson("https://api.github.com/repos/js-org/js.org/commits/f68060b27af6e352d344ecedc64065d93911326b/check-runs", headers),
  ]);
  const apiAvailable = Boolean(api.ok);
  const checksAvailable = Boolean(checks.ok);
  const body = String(api.json?.body || "");
  const pageHasExpectedText = page.matched;
  const templateOk = apiAvailable ? body.includes("- [x] There is reasonable content")
    && body.includes("- [x] I have read and accepted")
    && body.includes("https://printable-tools-lab.pages.dev/")
    && body.includes("relevant to JavaScript developers") : null;
  const pageShowsClosedOrRejected = /unrelated\s*\/\s*unqualified/i.test(page.text || "")
    || /State:\s*Closed/i.test(page.text || "")
    || /status:\s*closed/i.test(page.text || "");
  const latestChecks = checksAvailable ? latestCheckRuns(checks.json?.check_runs || []) : [];
  const checksOk = checksAvailable ? latestChecks.length > 0 && latestChecks.every((check) => check.conclusion === "success") : null;
  let status = "pending";
  if (apiAvailable && api.json?.merged) status = "listed";
  else if (apiAvailable && api.json?.state === "closed") status = "error";
  else if (page.ok && pageShowsClosedOrRejected) status = "error";
  else if (apiAvailable && templateOk === false) status = "error";
  else if (checksAvailable && latestChecks.some((check) => check.conclusion === "failure")) status = "error";
  else if (!page.ok || !pageHasExpectedText) status = "error";
  return {
    ...directory,
    status,
    evidenceUrl: directory.url,
    apiAvailable,
    checksAvailable,
    templateOk,
    checksOk,
    checks: latestChecks,
    prState: api.json?.state || "unknown",
    mergeable: api.json?.mergeable ?? null,
    checked: [
      slimCheck(page),
      slimCheck(api, { matched: templateOk === null ? false : templateOk }),
      slimCheck(checks, { matched: checksOk === null ? false : checksOk }),
    ],
  };
}

async function fetchText(url, expected = [siteHost]) {
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
      matched: hasExpectedText(text, expected),
      text,
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

async function fetchJson(url, extraHeaders = {}) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "PrintableToolsLab-DirectoryMonitor",
        ...extraHeaders,
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

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function hasExpectedText(text, expected) {
  const haystack = String(text).toLowerCase();
  return expected.every((needle) => haystack.includes(String(needle).toLowerCase()));
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
