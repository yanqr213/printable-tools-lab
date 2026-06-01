const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { SHARE_KIT_FEATURED_LINKS, SHARE_KIT_RULES, siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const reportPath = path.join(root, "reports", "github-issue-discovery.json");
const issueTitle = "Growth log: free no-signup PDF and image upload-limit tools";

if (!token) {
  console.error("Set GITHUB_TOKEN or GH_TOKEN before running github-issue-discovery.");
  process.exit(1);
}

const repoUrl = execFileSync("git", ["remote", "get-url", "origin"], { cwd: root, encoding: "utf8" }).trim();
const repo = repoUrl.replace(/\.git$/, "").split("github.com/").pop();
if (!repo || repo === repoUrl) {
  console.error(`Cannot detect GitHub repo from origin: ${repoUrl}`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  const existing = await findExistingIssue();
  const body = renderIssueBody();
  const issue = existing
    ? await github(`/repos/${repo}/issues/${existing.number}`, { method: "PATCH", body: { title: issueTitle, body, state: "open" } })
    : await github(`/repos/${repo}/issues`, { method: "POST", body: { title: issueTitle, body, labels: ["growth", "distribution", "validation"] } });

  const report = {
    generatedAt: new Date().toISOString(),
    action: existing ? "updated" : "created",
    issueNumber: issue.number,
    issueUrl: issue.html_url,
    apiUrl: issue.url,
    state: issue.state,
    title: issue.title,
  };
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`${existing ? "Updated" : "Created"} GitHub issue: ${issue.html_url}`);
  console.log(`Report written to ${path.relative(root, reportPath)}`);
}

async function findExistingIssue() {
  const issues = await github(`/repos/${repo}/issues?state=open&per_page=100`);
  return issues.find((issue) => issue.title === issueTitle) || null;
}

function renderIssueBody() {
  const videos = readCampaignVideos();
  const gist = readJson("gist-discovery.json");
  const validation = readJson("validation-report.json");
  const downloads = validation?.live?.metrics?.totals?.download_pdf ?? validation?.live?.metrics?.totals?.download_file ?? 1;
  const searchVisible = validation?.gates?.searchVisible ? "yes" : "no";

  const highIntent = SHARE_KIT_FEATURED_LINKS.map(([title, pathName, reason]) => ({
    title,
    url: `${siteUrl(pathName).replace(/\/$/, "")}?utm_source=github-issue&utm_medium=organic&utm_campaign=zero_cost_push`,
    reason,
  }));

  return [
    "This issue is a public growth and validation log for PrintableTools Lab. It exists to make the free tools and campaign assets easier to review, share, and validate without paid ads.",
    "",
    "## Current status",
    "",
    `- Product: ${siteUrl("")}`,
    `- Share kit: ${siteUrl("share-kit")}`,
    `- Public Gist mirror: ${gist?.htmlUrl || "not available"}`,
    `- Release MP4 assets: https://github.com/${repo}/releases/tag/free-pdf-tools`,
    `- Search visible: ${searchVisible}`,
    `- Recorded downloads: ${downloads}`,
    "- Monetization: ads remain disabled until real search visibility and ad-network readiness exist.",
    "",
    "## High-intent entry points",
    "",
    ...highIntent.map((item) => `- [${item.title}](${item.url}) - ${item.reason}`),
    "",
    "## Ready-to-upload MP4 assets",
    "",
    ...videos.flatMap((video) => [
      `### ${video.title}`,
      `- MP4: ${video.downloadUrl}`,
      `- Landing page: ${video.trackedUrl}`,
      `- Caption: ${video.captionEn}`,
      "",
    ]),
    "## Safe distribution rules",
    "",
    ...SHARE_KIT_RULES.map((rule) => `- ${rule}`),
    "- Do not ask for ad clicks, fake upvotes, fake engagement, or ad views.",
    "- Do not claim exact compression, acceptance, rankings, hiring, or official approval.",
    "",
    "## Validation gates",
    "",
    "- 24 hours after a post: at least 1 tracked visit or 1 tool event.",
    "- 72 hours: at least 10 tracked visits, 3 tool events, or one relevant external reply remains live.",
    "- 7 days: at least 30 tracked visits, 10 tool events, or Search Console impressions start moving.",
    "",
    "This is not a paid feature roadmap. Paid checkout is deferred; the current monetization route is useful free tools followed by compliant display ads after traffic and policy readiness.",
    "",
  ].join("\n");
}

function readCampaignVideos() {
  const report = readJson("campaign-assets-release.json");
  return Array.isArray(report?.assets) ? report.assets : [];
}

function readJson(fileName) {
  const filePath = path.join(root, "reports", fileName);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function github(pathName, options = {}) {
  const response = await fetch(`https://api.github.com${pathName}`, {
    method: options.method || "GET",
    headers: githubHeaders(),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub API ${options.method || "GET"} ${pathName} failed ${response.status}: ${JSON.stringify(payload).slice(0, 360)}`);
  return payload;
}

function githubHeaders() {
  const authScheme = token.startsWith("ghp_") || token.startsWith("github_pat_") ? "token" : "Bearer";
  return {
    Authorization: `${authScheme} ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "PrintableToolsLab-IssueDiscovery",
  };
}
