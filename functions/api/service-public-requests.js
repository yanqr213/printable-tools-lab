const LABEL_GROUPS = [
  ["service-request", "business-review"],
  ["audit-request", "business-review"],
];
const PRIMARY_LABELS = LABEL_GROUPS[0];
const DEFAULT_REPO = "yanqr213/printable-tools-lab";

const SERVICE_LABELS = {
  "custom-local-print-pack": "Custom Local Print Pack Setup",
  "invoice-followup-copy-pack": "Invoice Follow-up Copy Pack",
  "market-table-print-audit": "Free Market Table Print Audit",
  "local-seller-starter-kit": "Local Seller Starter Kit",
  unknown: "Unknown service request",
};

export async function onRequestGet({ env }) {
  const repo = cleanRepo(env.SERVICE_PUBLIC_REQUEST_REPO || DEFAULT_REPO);
  const report = await readPublicServiceRequests(repo, env);
  return json({ ok: true, ...report });
}

async function readPublicServiceRequests(repo, env) {
  const generatedAt = new Date().toISOString();
  const apiReport = await readGithubApi(repo, env, generatedAt);
  if (apiReport.available) return apiReport;
  const fallback = await readGithubHtmlFallback(repo, generatedAt, apiReport.error);
  return fallback || unavailableReport(repo, generatedAt, apiReport.error);
}

async function readGithubApi(repo, env, generatedAt) {
  const rows = [];
  const headers = githubHeaders(env);
  const seen = new Set();
  try {
    for (const labelGroup of LABEL_GROUPS) {
      for (let page = 1; page <= 2; page += 1) {
        const url = new URL(`https://api.github.com/repos/${repo}/issues`);
        url.searchParams.set("state", "all");
        url.searchParams.set("labels", labelGroup.join(","));
        url.searchParams.set("sort", "updated");
        url.searchParams.set("direction", "desc");
        url.searchParams.set("per_page", "100");
        url.searchParams.set("page", String(page));
        const response = await fetchWithTimeout(url.toString(), { headers });
        const text = await response.text();
        if (!response.ok) return unavailableReport(repo, generatedAt, `GitHub issues API ${response.status}: ${text.slice(0, 120)}`);
        const issues = safeJson(text, []);
        if (!Array.isArray(issues) || !issues.length) break;
        for (const issue of issues) {
          const key = issue?.html_url || issue?.number;
          if (!issue || issue.pull_request || seen.has(key)) continue;
          seen.add(key);
          rows.push(issueToRow(issue));
        }
        if (issues.length < 100) break;
      }
    }
    return summarizeRows(repo, generatedAt, "github-issues-api", rows.filter(Boolean), "");
  } catch (error) {
    return unavailableReport(repo, generatedAt, error.message);
  }
}

async function readGithubHtmlFallback(repo, generatedAt, apiError) {
  const rows = [];
  const seen = new Set();
  try {
    for (const labelGroup of LABEL_GROUPS) {
      const query = encodeURIComponent(labelSearchQuery(labelGroup));
      const url = `https://github.com/${repo}/issues?q=${query}`;
      const response = await fetchWithTimeout(url, {
        headers: {
          "User-Agent": "PrintableToolsLab-Ops",
          Accept: "text/html",
        },
      });
      const html = await response.text();
      if (!response.ok) return null;
      for (const row of htmlIssueRows(repo, html, labelGroup)) {
        if (seen.has(row.number)) continue;
        seen.add(row.number);
        rows.push(row);
      }
    }
    if (!rows.length) return null;
    return summarizeRows(repo, generatedAt, "github-issues-html-fallback", rows, apiError ? `API unavailable; HTML fallback used. ${sanitizeGithubError(apiError)}` : "HTML fallback used.");
  } catch {
    return null;
  }
}

function issueToRow(issue) {
  const body = String(issue.body || "");
  const title = cleanText(issue.title, 160);
  const serviceType = serviceTypeFromText(`${title}\n${body}`);
  const labels = Array.isArray(issue.labels) ? issue.labels.map((label) => cleanText(label.name || label, 60)).filter(Boolean) : [];
  const sourcePath = extractField(body, "Source path") || extractFirstSitePath(body);
  const requestedNextStep = extractField(body, "Requested next step") || (serviceType !== "unknown" ? "Request service fit review" : "");
  return {
    number: issue.number || 0,
    state: cleanText(issue.state, 20),
    title,
    url: cleanText(issue.html_url, 260),
    createdAt: cleanText(issue.created_at, 40),
    updatedAt: cleanText(issue.updated_at, 40),
    labels,
    serviceType,
    serviceLabel: SERVICE_LABELS[serviceType] || SERVICE_LABELS.unknown,
    requestedNextStep: cleanText(requestedNextStep, 120),
    sourcePath: cleanText(sourcePath, 220),
    invoiceFollowupRequest: serviceType === "invoice-followup-copy-pack",
    paidServiceRequest: ["custom-local-print-pack", "invoice-followup-copy-pack", "local-seller-starter-kit"].includes(serviceType),
    readyForReview: issue.state === "open" && serviceType !== "unknown",
    publicSafetyWarningPresent: /Do not include (?:payment|invoice numbers|private payment)/i.test(body),
  };
}

function htmlIssueRows(repo, html, labelGroup = PRIMARY_LABELS) {
  const rows = [];
  const seen = new Set();
  const issueLink = new RegExp(`href="/${escapeRegExp(repo)}/issues/(\\d+)"[^>]*>([\\s\\S]{0,260}?)<\\/a>`, "gi");
  let match;
  while ((match = issueLink.exec(html))) {
    const number = Number(match[1]) || 0;
    if (!number || seen.has(number)) continue;
    seen.add(number);
    const title = cleanHtml(match[2]) || `Service public request #${number}`;
    const serviceType = serviceTypeFromText(title);
    rows.push({
      number,
      state: "",
      title,
      url: `https://github.com/${repo}/issues/${number}`,
      createdAt: "",
      updatedAt: "",
      labels: [...labelGroup],
      serviceType,
      serviceLabel: SERVICE_LABELS[serviceType] || SERVICE_LABELS.unknown,
      requestedNextStep: "",
      sourcePath: "",
      invoiceFollowupRequest: serviceType === "invoice-followup-copy-pack",
      paidServiceRequest: ["custom-local-print-pack", "invoice-followup-copy-pack", "local-seller-starter-kit"].includes(serviceType),
      readyForReview: false,
      publicSafetyWarningPresent: false,
    });
  }
  return rows;
}

function summarizeRows(repo, generatedAt, dataQuality, rows, warning) {
  const sorted = rows
    .filter((row) => row && row.url)
    .sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")))
    .slice(0, 50);
  return {
    generatedAt,
    repo,
    sourceUrl: `https://github.com/${repo}/issues?q=${encodeURIComponent(sourceSearchQuery())}`,
    available: true,
    dataQuality,
    dataWarning: warning || "",
    publicMetricsOnly: true,
    privateFields: "not exposed; rows contain only public GitHub issue metadata and public-safe service fields",
    publicRequestCount: sorted.length,
    openCount: sorted.filter((row) => row.state === "open").length,
    closedCount: sorted.filter((row) => row.state === "closed").length,
    paidServiceRequestCount: sorted.filter((row) => row.paidServiceRequest).length,
    invoiceFollowupRequestCount: sorted.filter((row) => row.serviceType === "invoice-followup-copy-pack").length,
    customLocalPrintRequestCount: sorted.filter((row) => row.serviceType === "custom-local-print-pack").length,
    auditRequestCount: sorted.filter((row) => row.serviceType === "market-table-print-audit").length,
    sellerKitRequestCount: sorted.filter((row) => row.serviceType === "local-seller-starter-kit").length,
    readyForReviewCount: sorted.filter((row) => row.readyForReview).length,
    publicSafetyWarningCount: sorted.filter((row) => row.publicSafetyWarningPresent).length,
    latestUpdatedAt: sorted.reduce((value, row) => {
      const stamp = row.updatedAt || row.createdAt || "";
      return stamp > value ? stamp : value;
    }, ""),
    rows: sorted,
  };
}

function unavailableReport(repo, generatedAt, error) {
  return {
    generatedAt,
    repo,
    sourceUrl: `https://github.com/${repo}/issues?q=${encodeURIComponent(sourceSearchQuery())}`,
    available: false,
    dataQuality: "unavailable",
    dataWarning: "GitHub public service request evidence could not be read in this run. Do not treat zero as confirmed while unavailable.",
    error: sanitizeGithubError(error),
    publicMetricsOnly: true,
    privateFields: "not exposed",
    publicRequestCount: 0,
    openCount: 0,
    closedCount: 0,
    paidServiceRequestCount: 0,
    invoiceFollowupRequestCount: 0,
    customLocalPrintRequestCount: 0,
    auditRequestCount: 0,
    sellerKitRequestCount: 0,
    readyForReviewCount: 0,
    publicSafetyWarningCount: 0,
    latestUpdatedAt: "",
    rows: [],
  };
}

function labelSearchQuery(labelGroup) {
  return `is:issue ${labelGroup.map((label) => `label:${label}`).join(" ")}`;
}

function sourceSearchQuery() {
  return "is:issue label:business-review label:service-request OR label:audit-request";
}

function serviceTypeFromText(value) {
  const text = String(value || "").toLowerCase();
  if (/invoice[\s-]*follow|follow[\s-]*up copy/.test(text)) return "invoice-followup-copy-pack";
  if (/custom local print|local print pack/.test(text)) return "custom-local-print-pack";
  if (/market table print audit|free market table/.test(text)) return "market-table-print-audit";
  if (/local seller starter|seller kit/.test(text)) return "local-seller-starter-kit";
  return "unknown";
}

function extractField(text, label) {
  const direct = new RegExp(`^\\s*${escapeRegExp(label)}\\s*:\\s*(.+)$`, "im").exec(text);
  if (direct) return cleanFieldValue(direct[1]);
  const section = new RegExp(`###\\s*${escapeRegExp(label)}\\s*\\n+([\\s\\S]*?)(?:\\n###\\s|$)`, "i").exec(text);
  return section ? cleanFieldValue(section[1]) : "";
}

function extractFirstSitePath(text) {
  const match = String(text || "").match(/https:\/\/printable-tools-lab\.pages\.dev\/[^\s)]+/i);
  return match ? match[0].replace(/[.,]+$/, "") : "";
}

function cleanFieldValue(value) {
  return String(value || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !/^_?No response_?$/i.test(line))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320);
}

function githubHeaders(env = {}) {
  const token = env.GITHUB_TOKEN || env.GH_TOKEN || "";
  const authScheme = token.startsWith("ghp_") || token.startsWith("github_pat_") ? "token" : "Bearer";
  return {
    ...(token ? { Authorization: `${authScheme} ${token}` } : {}),
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "PrintableToolsLab-Ops",
  };
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    return await fetch(url, { ...options, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

function cleanRepo(value) {
  const repo = String(value || "").replace(/^https:\/\/github\.com\//, "").replace(/\.git$/, "").trim();
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo) ? repo : DEFAULT_REPO;
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanHtml(value) {
  return cleanText(String(value || "").replace(/<[^>]+>/g, " ").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"), 220);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeJson(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function sanitizeGithubError(error) {
  const text = cleanText(error, 240);
  if (/GitHub issues API 403/i.test(text) && /rate limit/i.test(text)) {
    return "GitHub issues API 403: API rate limit exceeded for unauthenticated requests.";
  }
  if (/API rate limit exceeded/i.test(text)) return "GitHub API rate limit exceeded.";
  return text;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
