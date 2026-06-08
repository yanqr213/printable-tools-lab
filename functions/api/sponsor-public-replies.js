const LABELS = ["sponsor", "partner", "business-review"];
const DEFAULT_REPO = "yanqr213/printable-tools-lab";

export async function onRequestGet({ env }) {
  const repo = cleanRepo(env.SPONSOR_PUBLIC_REPLY_REPO || DEFAULT_REPO);
  const report = await readPublicReplies(repo, env);
  return json({ ok: true, ...report });
}

async function readPublicReplies(repo, env) {
  const generatedAt = new Date().toISOString();
  const apiReport = await readGithubApi(repo, env, generatedAt);
  if (apiReport.available) return apiReport;
  const fallback = await readGithubHtmlFallback(repo, generatedAt, apiReport.error);
  return fallback || unavailableReport(repo, generatedAt, apiReport.error);
}

async function readGithubApi(repo, env, generatedAt) {
  const rows = [];
  const headers = githubHeaders(env);
  try {
    for (let page = 1; page <= 2; page += 1) {
      const url = new URL(`https://api.github.com/repos/${repo}/issues`);
      url.searchParams.set("state", "all");
      url.searchParams.set("labels", LABELS.join(","));
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
        if (issue && !issue.pull_request) rows.push(issueToRow(issue));
      }
      if (issues.length < 100) break;
    }
    return summarizeRows(repo, generatedAt, "github-issues-api", rows.filter(Boolean), "");
  } catch (error) {
    return unavailableReport(repo, generatedAt, error.message);
  }
}

async function readGithubHtmlFallback(repo, generatedAt, apiError) {
  const query = encodeURIComponent(`is:issue ${LABELS.map((label) => `label:${label}`).join(" ")}`);
  const url = `https://github.com/${repo}/issues?q=${query}`;
  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        "User-Agent": "PrintableToolsLab-Ops",
        Accept: "text/html",
      },
    });
    const html = await response.text();
    if (!response.ok) return null;
    const rows = htmlIssueRows(repo, html);
    if (!rows.length && !html.includes("/issues/")) return null;
    return summarizeRows(repo, generatedAt, "github-issues-html-fallback", rows, apiError ? `API unavailable; HTML fallback used. ${sanitizeGithubError(apiError)}` : "HTML fallback used.");
  } catch {
    return null;
  }
}

function issueToRow(issue) {
  const body = String(issue.body || "");
  const requestedNextStep = extractField(body, "Requested next step");
  const proposalUrl = extractProposalUrl(body);
  const selectedDeal = extractField(body, "Selected pilot deal");
  const urlFields = proposalUrl ? proposalUrlFields(proposalUrl) : {};
  const labels = Array.isArray(issue.labels) ? issue.labels.map((label) => cleanText(label.name || label, 60)).filter(Boolean) : [];
  const invoiceRequest = /invoice/i.test(requestedNextStep)
    || /request-invoice/i.test(proposalUrl)
    || /Request pilot invoice review/i.test(body);
  return {
    number: issue.number || 0,
    state: cleanText(issue.state, 20),
    title: cleanText(issue.title, 160),
    url: cleanText(issue.html_url, 260),
    createdAt: cleanText(issue.created_at, 40),
    updatedAt: cleanText(issue.updated_at, 40),
    labels,
    requestedNextStep: cleanText(requestedNextStep, 120),
    selectedDeal: cleanText(selectedDeal || urlFields.deal || "", 140),
    proposalUrl: cleanText(proposalUrl, 260),
    prospect: cleanText(urlFields.prospect || urlFields.utmContent || "", 100),
    vertical: cleanText(urlFields.vertical || "", 100),
    invoiceRequest,
    readyForReview: issue.state === "open" && (invoiceRequest || /fit|question|review/i.test(requestedNextStep)),
    publicSafetyWarningPresent: /Do not include private payment/i.test(body),
  };
}

function htmlIssueRows(repo, html) {
  const rows = [];
  const seen = new Set();
  const issueLink = new RegExp(`href="/${escapeRegExp(repo)}/issues/(\\d+)"[^>]*>([\\s\\S]{0,260}?)<\\/a>`, "gi");
  let match;
  while ((match = issueLink.exec(html))) {
    const number = Number(match[1]) || 0;
    if (!number || seen.has(number)) continue;
    seen.add(number);
    rows.push({
      number,
      state: "",
      title: cleanHtml(match[2]) || `Sponsor public reply #${number}`,
      url: `https://github.com/${repo}/issues/${number}`,
      createdAt: "",
      updatedAt: "",
      labels: [...LABELS],
      requestedNextStep: "",
      selectedDeal: "",
      proposalUrl: "",
      prospect: "",
      vertical: "",
      invoiceRequest: false,
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
    sourceUrl: `https://github.com/${repo}/issues?q=${encodeURIComponent(`is:issue ${LABELS.map((label) => `label:${label}`).join(" ")}`)}`,
    available: true,
    dataQuality,
    dataWarning: warning || "",
    publicMetricsOnly: true,
    privateFields: "not exposed; rows contain only public GitHub issue metadata and public-safe URL fields",
    publicReplyCount: sorted.length,
    openCount: sorted.filter((row) => row.state === "open").length,
    closedCount: sorted.filter((row) => row.state === "closed").length,
    invoiceRequestCount: sorted.filter((row) => row.invoiceRequest).length,
    readyForReviewCount: sorted.filter((row) => row.readyForReview).length,
    proposalLinkedCount: sorted.filter((row) => row.proposalUrl).length,
    latestUpdatedAt: sorted.reduce((value, row) => {
      const stamp = row.updatedAt || row.createdAt || "";
      return stamp > value ? stamp : value;
    }, ""),
    rows: sorted,
  };
}

function unavailableReport(repo, generatedAt, error) {
  const cleanError = sanitizeGithubError(error);
  return {
    generatedAt,
    repo,
    sourceUrl: `https://github.com/${repo}/issues?q=${encodeURIComponent(`is:issue ${LABELS.map((label) => `label:${label}`).join(" ")}`)}`,
    available: false,
    dataQuality: "unavailable",
    dataWarning: "GitHub public reply evidence could not be read in this run. Do not treat zero as confirmed while unavailable.",
    error: cleanError,
    publicMetricsOnly: true,
    privateFields: "not exposed",
    publicReplyCount: 0,
    openCount: 0,
    closedCount: 0,
    invoiceRequestCount: 0,
    readyForReviewCount: 0,
    proposalLinkedCount: 0,
    latestUpdatedAt: "",
    rows: [],
  };
}

function sanitizeGithubError(error) {
  const text = cleanText(error, 240);
  if (/GitHub issues API 403/i.test(text) && /rate limit/i.test(text)) {
    return "GitHub issues API 403: API rate limit exceeded for unauthenticated requests.";
  }
  if (/API rate limit exceeded/i.test(text)) return "GitHub API rate limit exceeded.";
  return text;
}

function extractField(text, label) {
  const direct = new RegExp(`^\\s*${escapeRegExp(label)}\\s*:\\s*(.+)$`, "im").exec(text);
  if (direct) return cleanFieldValue(direct[1]);
  const section = new RegExp(`###\\s*${escapeRegExp(label)}\\s*\\n+([\\s\\S]*?)(?:\\n###\\s|$)`, "i").exec(text);
  return section ? cleanFieldValue(section[1]) : "";
}

function extractProposalUrl(text) {
  const field = extractField(text, "Proposal or deal URL");
  if (field && /^https?:\/\//i.test(field)) return field;
  const match = String(text).match(/https:\/\/printable-tools-lab\.pages\.dev\/[^\s)]+/i);
  return match ? match[0].replace(/[.,]+$/, "") : "";
}

function proposalUrlFields(value) {
  try {
    const url = new URL(value);
    return {
      prospect: url.searchParams.get("prospect") || "",
      deal: url.searchParams.get("deal") || "",
      vertical: url.searchParams.get("vertical") || "",
      utmContent: url.searchParams.get("utm_content") || "",
    };
  } catch {
    return {};
  }
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
